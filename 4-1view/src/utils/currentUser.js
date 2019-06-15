export function getCurrentUser(){
    return localStorage.getItem('CurrentUserName');
}

export function setCurrentUser(currentUser){
    return localStorage.setItem('CurrentUserName',currentUser);
}

export function removeCurrentUser(){
    return localStorage.removeItem('CurrentUserName');
}