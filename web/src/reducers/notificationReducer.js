const initialState = {
  notifications: [],
  loading: true,
  error: null
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        loading: false
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
        loading: false
      };
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(notification => 
          notification.id === action.payload.id ? action.payload : notification
        ),
        loading: false
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
        loading: false
      };
    case 'NOTIFICATION_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default notificationReducer;