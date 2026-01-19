const initialState = {
  jobRoles: [],
  loading: true,
  error: null
};

const jobRoleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_JOB_ROLES':
      return {
        ...state,
        jobRoles: action.payload,
        loading: false
      };
    case 'ADD_JOB_ROLE':
      return {
        ...state,
        jobRoles: [...state.jobRoles, action.payload],
        loading: false
      };
    case 'UPDATE_JOB_ROLE':
      return {
        ...state,
        jobRoles: state.jobRoles.map(role => 
          role.id === action.payload.id ? action.payload : role
        ),
        loading: false
      };
    case 'DELETE_JOB_ROLE':
      return {
        ...state,
        jobRoles: state.jobRoles.filter(role => role.id !== action.payload),
        loading: false
      };
    case 'JOB_ROLE_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default jobRoleReducer;