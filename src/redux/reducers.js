const initialState = {
    categoryList: [],
    tagList: [],
    supplierList: [],
    productList: [],
    productTrash: [],
    user: {},
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_CATEGORY": {
            return {
                ...state,
                categoryList: action.payload,
            };
        }
        case "LOAD_TAG": {
            return {
                ...state,
                tagList: action.payload,
            };
        }
        case "ADD_TAG":
            return [...state, { tagList: action.payload }];
        case "SET_PRODUCT":
            return {
                ...state,
                productList: action.payload,
            };
        case "SET_USER":
            return {
                ...state,
                user: action.payload,
            };
        case "SET_SUPPLIER":
            return {
                ...state,
                supplierList: action.payload,
            };
        default:
            return state;
    }
};

export default appReducer;
