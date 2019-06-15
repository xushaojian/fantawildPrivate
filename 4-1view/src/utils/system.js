export function getSystem(){
    return localStorage.getItem('System');
}

export function setSystem(ver){
    return localStorage.setItem('System',ver);
}

export function removeSystem(){
    return localStorage.removeItem('System');
}