# Stitch Trainer Management Portal

A comprehensive training-verified, subscription-based workforce application that allows companies to publish shifts and hire only pre-qualified workers in real time.

## Overview

This is a training-verified, shift-based workforce platform with three main user groups:

1. **Workers** - Mobile application for shift-based job seekers
2. **Companies/Trainers** - Web portal for job posting and training management
3. **System Administrators** - Administrative oversight panel

## Features

### Worker Dashboard
- User registration & login
- Role-based access (Worker)
- Profile creation & management
- Availability & preference settings
- Company discovery & search
- Company public profiles
- Job role browsing
- Training enrollment
- Training content consumption (video, document, quiz)
- Training progress tracking
- Training completion status
- Company-specific qualification status
- Subscription management
- Subscription payment & renewal
- Shift calendar view
- Open shift browsing
- Shift request submission
- Shift request status tracking
- Approved shift confirmation
- Upcoming shift reminders
- Shift history & activity log
- In-app notifications
- Email & push notifications
- Account settings
- Logout

### Company Panel
- Company registration & verification
- Company profile management
- Role-based access (Company Admin)
- Job role creation & management
- Trainer invitation & management
- Trainer role assignment
- Training program creation
- Training content upload
- Training module management
- Training requirement mapping to job roles
- Worker qualification tracking
- Schedule creation & management
- Shift creation & publishing
- Shift request review
- Shift approval & rejection
- Worker profile review
- Notifications & alerts
- Company user management
- Activity logs & reports
- Settings & preferences

### Trainer Panel
- Trainer account login
- Training program access
- Training content creation
- Training content update
- Training module assignment
- Trainee progress tracking
- Training completion reporting
- Notifications

### Admin Panel
- Admin authentication
- User management (workers, companies, trainers)
- Company approval & suspension
- Subscription plan management
- Payment monitoring
- System-wide role & permission control
- Platform configuration
- Activity & audit logs
- Content moderation
- Notification system control
- Analytics & reporting
- Security & access management

## Technology Stack

- **Frontend (Mobile)**: React Native
- **Frontend (Web)**: React.js with Redux for state management
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions, Storage)
- **Database**: Firestore (NoSQL)
- **Authentication**: Firebase Authentication
- **Serverless**: Firebase Cloud Functions
- **Payment Processing**: Stripe (integrated with Firebase Functions)
- **Real-time Updates**: Firestore real-time listeners
- **Push Notifications**: Firebase Cloud Messaging

## Architecture

The application uses a serverless architecture with Firebase as the complete backend solution. The frontend components connect directly to Firebase services without requiring a traditional server.

## Firebase Backend Components

- **Firestore Collections**:
  - `users` - User profiles and authentication data
  - `companies` - Company profiles and information
  - `workers` - Worker-specific data and qualifications
  - `jobRoles` - Available job roles and requirements
  - `trainingPrograms` - Training content and modules
  - `shifts` - Shift schedules and availability
  - `subscriptions` - Subscription plans and payments
  - `notifications` - Push and in-app notifications

- **Cloud Functions**:
  - Authentication functions (register, login)
  - User management functions
  - Company management functions
  - Worker management functions
  - Job role management functions
  - Training program functions
  - Shift management functions
  - Subscription functions
  - Notification functions

## Setup Instructions

See [RUN_INSTRUCTIONS.md](RUN_INSTRUCTIONS.md) for detailed setup and deployment instructions.

## Directory Structure

```
stitch_trainer_management_portal/
├── mobile/                     # React Native mobile app
├── web/                        # React web portals
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # Service files (including firebaseApi.js)
│   │   └── ...
├── firebase_backend/          # Firebase backend implementation
│   ├── firebaseConfig.js      # Firebase configuration
│   ├── firebaseUtils.js       # Firestore utility functions
│   └── functions/             # Firebase Cloud Functions
│       └── src/
│           ├── index.ts       # All Cloud Functions
│           └── types.ts       # Type definitions
├── FIREBASE_MIGRATION_GUIDE.md # Backend migration documentation
├── FRONTEND_MIGRATION_GUIDE.md # Frontend migration documentation
├── RUN_INSTRUCTIONS.md        # Setup and deployment guide
└── README.md                  # This file
```

## Color Scheme

- White
- Green
- Orange

## Benefits of Firebase Architecture

1. **Scalability**: Automatically scales with demand
2. **Cost-effective**: Pay-per-use pricing model
3. **Maintenance-free**: No server maintenance required
4. **Real-time capabilities**: Built-in real-time updates
5. **Security**: Integrated security rules and authentication
6. **Cross-platform**: Consistent API across mobile and web
7. **Reliability**: Google's infrastructure backing

## Getting Started

1. Clone the repository
2. Follow the setup instructions in [RUN_INSTRUCTIONS.md](RUN_INSTRUCTIONS.md)
3. Configure your Firebase project
4. Deploy the Cloud Functions
5. Start the web application
6. Build and run the mobile application

The application is now fully powered by Firebase services while maintaining all the functionality that was originally built with Node.js/Express/MongoDB.