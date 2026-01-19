const initialState = {
  companies: [],
  loading: true,
  error: null
};

const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_COMPANIES':
      return {
        ...state,
        companies: action.payload,
        loading: false
      };
    case 'ADD_COMPANY':
      return {
        ...state,
        companies: [...state.companies, action.payload],
        loading: false
      };
    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map(company => 
          company.id === action.payload.id ? action.payload : company
        ),
        loading: false
      };
    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter(company => company.id !== action.payload),
        loading: false
      };
    case 'COMPANY_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default companyReducer;