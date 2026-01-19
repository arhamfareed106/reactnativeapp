const initialState = {
  workers: [],
  loading: true,
  error: null
};

const workerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_WORKERS':
      return {
        ...state,
        workers: action.payload,
        loading: false
      };
    case 'ADD_WORKER':
      return {
        ...state,
        workers: [...state.workers, action.payload],
        loading: false
      };
    case 'UPDATE_WORKER':
      return {
        ...state,
        workers: state.workers.map(worker => 
          worker.id === action.payload.id ? action.payload : worker
        ),
        loading: false
      };
    case 'DELETE_WORKER':
      return {
        ...state,
        workers: state.workers.filter(worker => worker.id !== action.payload),
        loading: false
      };
    case 'WORKER_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default workerReducer;