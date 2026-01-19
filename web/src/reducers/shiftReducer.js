const initialState = {
  shifts: [],
  selectedShift: null,
  loading: true,
  error: null
};

const shiftReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SHIFTS':
      return {
        ...state,
        shifts: action.payload,
        loading: false
      };
    case 'ADD_SHIFT':
      return {
        ...state,
        shifts: [...state.shifts, action.payload],
        loading: false
      };
    case 'UPDATE_SHIFT':
      return {
        ...state,
        shifts: state.shifts.map(shift => 
          shift.id === action.payload.id ? action.payload : shift
        ),
        loading: false
      };
    case 'DELETE_SHIFT':
      return {
        ...state,
        shifts: state.shifts.filter(shift => shift.id !== action.payload),
        loading: false
      };
    case 'SET_SELECTED_SHIFT':
      return {
        ...state,
        selectedShift: action.payload
      };
    case 'SHIFT_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default shiftReducer;