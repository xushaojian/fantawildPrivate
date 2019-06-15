export function getToken(){
    return localStorage.getItem('TokenName');
}

export function setToken(token){
    return localStorage.setItem('TokenName',token);
}

export function removeToken(){
    return localStorage.removeItem('TokenName');
}