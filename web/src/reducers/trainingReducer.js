const initialState = {
  trainingPrograms: [],
  loading: true,
  error: null
};

const trainingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_TRAINING_PROGRAMS':
      return {
        ...state,
        trainingPrograms: action.payload,
        loading: false
      };
    case 'ADD_TRAINING_PROGRAM':
      return {
        ...state,
        trainingPrograms: [...state.trainingPrograms, action.payload],
        loading: false
      };
    case 'UPDATE_TRAINING_PROGRAM':
      return {
        ...state,
        trainingPrograms: state.trainingPrograms.map(program => 
          program.id === action.payload.id ? action.payload : program
        ),
        loading: false
      };
    case 'DELETE_TRAINING_PROGRAM':
      return {
        ...state,
        trainingPrograms: state.trainingPrograms.filter(program => program.id !== action.payload),
        loading: false
      };
    case 'TRAINING_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default trainingReducer;