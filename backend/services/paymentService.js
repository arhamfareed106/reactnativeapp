const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

class PaymentService {
  constructor() {
    this.stripe = stripe;
  }

  // Create a new subscription with Stripe
  async createSubscription(userId, planData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create or retrieve customer in Stripe
      let stripeCustomer;
      if (user.stripeCustomerId) {
        stripeCustomer = await this.stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        stripeCustomer = await this.stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user._id.toString()
          }
        });

        // Save the customer ID to the user
        user.stripeCustomerId = stripeCustomer.id;
        await user.save();
      }

      // Create a price object for the subscription
      const price = await this.stripe.prices.create({
        unit_amount: planData.amount * 100, // Convert to cents
        currency: planData.currency || 'usd',
        recurring: {
          interval: planData.billingCycle === 'yearly' ? 'year' : 'month',
        },
        product_data: {
          name: `${planData.planType} Plan`,
          description: `Subscription for ${user.role} user`,
        },
      });

      // Create the subscription in Stripe
      const stripeSubscription = await this.stripe.subscriptions.create({
        customer: stripeCustomer.id,
        items: [
          {
            price: price.id,
          },
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Create the subscription record in our database
      const subscription = await Subscription.create({
        user: userId,
        planType: planData.planType,
        status: 'active',
        startDate: new Date(),
        endDate: this.calculateEndDate(planData.billingCycle),
        amount: planData.amount,
        currency: planData.currency || 'USD',
        billingCycle: planData.billingCycle,
        autoRenew: true,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: stripeCustomer.id
      });

      return {
        subscription,
        clientSecret: stripeSubscription.latest_invoice.payment_intent.client_secret
      };
    } catch (error) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // Process one-time payment
  async processOneTimePayment(userId, paymentData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Create or retrieve customer in Stripe
      let stripeCustomer;
      if (user.stripeCustomerId) {
        stripeCustomer = await this.stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        stripeCustomer = await this.stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user._id.toString()
          }
        });

        // Save the customer ID to the user
        user.stripeCustomerId = stripeCustomer.id;
        await user.save();
      }

      // Create a payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: paymentData.amount * 100, // Convert to cents
        currency: paymentData.currency || 'usd',
        customer: stripeCustomer.id,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId: userId.toString(),
          paymentType: 'one_time'
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // Handle webhook from Stripe
  async handleWebhook(signature, payload) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw new ErrorResponse('Webhook handler error', 400);
    }
  }

  // Handle successful payment
  async handlePaymentSucceeded(invoice) {
    try {
      const subscription = await Subscription.findOne({
        stripeSubscriptionId: invoice.subscription
      });

      if (subscription) {
        // Update subscription status
        await Subscription.findByIdAndUpdate(subscription._id, {
          status: 'active',
          paymentStatus: 'paid',
          endDate: this.calculateEndDate(subscription.billingCycle)
        });

        // Create payment record
        await Payment.create({
          subscription: subscription._id,
          user: subscription.user,
          amount: invoice.amount_paid / 100, // Convert from cents
          currency: invoice.currency,
          method: 'stripe',
          status: 'completed',
          transactionId: invoice.payment_intent,
          receiptUrl: invoice.hosted_invoice_url,
          billingCycle: subscription.billingCycle,
          periodStart: new Date(invoice.period_start * 1000),
          periodEnd: new Date(invoice.period_end * 1000)
        });
      }
    } catch (error) {
      console.error('Error handling payment succeeded:', error);
    }
  }

  // Handle failed payment
  async handlePaymentFailed(invoice) {
    try {
      const subscription = await Subscription.findOne({
        stripeSubscriptionId: invoice.subscription
      });

      if (subscription) {
        await Subscription.findByIdAndUpdate(subscription._id, {
          status: 'past_due',
          paymentStatus: 'failed'
        });
      }
    } catch (error) {
      console.error('Error handling payment failed:', error);
    }
  }

  // Handle subscription updated
  async handleSubscriptionUpdated(subscription) {
    try {
      const dbSubscription = await Subscription.findOne({
        stripeSubscriptionId: subscription.id
      });

      if (dbSubscription) {
        const updateData = {
          status: this.mapStripeStatus(subscription.status),
          autoRenew: !subscription.cancel_at_period_end
        };

        if (subscription.current_period_end) {
          updateData.endDate = new Date(subscription.current_period_end * 1000);
        }

        await Subscription.findByIdAndUpdate(dbSubscription._id, updateData);
      }
    } catch (error) {
      console.error('Error handling subscription updated:', error);
    }
  }

  // Handle subscription deleted
  async handleSubscriptionDeleted(subscription) {
    try {
      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { status: 'cancelled' }
      );
    } catch (error) {
      console.error('Error handling subscription deleted:', error);
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription || !subscription.stripeSubscriptionId) {
        throw new Error('Subscription not found or not linked to Stripe');
      }

      // Cancel subscription in Stripe
      const stripeSubscription = await this.stripe.subscriptions.del(
        subscription.stripeSubscriptionId,
        { invoice_now: true, prorate: true }
      );

      // Update database
      await Subscription.findByIdAndUpdate(subscriptionId, {
        status: 'cancelled',
        autoRenew: false
      });

      return stripeSubscription;
    } catch (error) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // Renew subscription
  async renewSubscription(subscriptionId) {
    try {
      const subscription = await Subscription.findById(subscriptionId);
      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Calculate new end date
      const newEndDate = this.calculateEndDate(subscription.billingCycle);

      // Update subscription in database
      const updatedSubscription = await Subscription.findByIdAndUpdate(
        subscriptionId,
        {
          status: 'active',
          endDate: newEndDate,
          paymentStatus: 'pending'
        },
        { new: true }
      );

      return updatedSubscription;
    } catch (error) {
      throw new ErrorResponse(error.message, 500);
    }
  }

  // Calculate end date based on billing cycle
  calculateEndDate(billingCycle) {
    const now = new Date();
    if (billingCycle === 'yearly') {
      now.setFullYear(now.getFullYear() + 1);
    } else {
      now.setMonth(now.getMonth() + 1);
    }
    return now;
  }

  // Map Stripe status to our status
  mapStripeStatus(stripeStatus) {
    const statusMap = {
      'active': 'active',
      'trialing': 'active',
      'past_due': 'past_due',
      'unpaid': 'failed',
      'canceled': 'cancelled',
      'incomplete': 'pending',
      'incomplete_expired': 'expired',
      'paused': 'paused'
    };

    return statusMap[stripeStatus] || 'inactive';
  }
}

module.exports = new PaymentService();