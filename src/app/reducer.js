const intinalState = {
    user: false
}
const saveToken = (token) => {
    $.ajaxSetup({
        headers: { 'x-customer-token': token.value }
    });
    if(localStorage) {
        localStorage.setItem('customer_token', JSON.stringify(token));
    }
}

export default (state = intinalState, action) => {
    switch(action.type){
        case 'LOGIN_SUCCESS':
            saveToken(action.token);
            return {
                ...state,
                fetched: true,
                user: action.user
            };
            break;
        case 'FETCH_SUCCESS':
            if(action.user !== null){
                saveToken(action.token);
            }
            return {
                ...state,
                fetched: true,
                user: action.user
            };
            break;

        case 'LOGOUT':
            $.ajaxSetup({
                headers: {}
            });
            if(localStorage) {
                localStorage.removeItem('customer_token');
            }
            return {
                ...state,
                fetched: true,
                user: null
            };
            break;

        default:
            return state;
    }
}
