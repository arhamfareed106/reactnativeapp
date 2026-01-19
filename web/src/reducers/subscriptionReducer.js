const initialState = {
  subscriptions: [],
  loading: true,
  error: null
};

const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SUBSCRIPTIONS':
      return {
        ...state,
        subscriptions: action.payload,
        loading: false
      };
    case 'ADD_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: [...state.subscriptions, action.payload],
        loading: false
      };
    case 'UPDATE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.map(subscription => 
          subscription.id === action.payload.id ? action.payload : subscription
        ),
        loading: false
      };
    case 'DELETE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.filter(subscription => subscription.id !== action.payload),
        loading: false
      };
    case 'SUBSCRIPTION_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default subscriptionReducer;