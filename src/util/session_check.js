import { jwtDecode } from "jwt-decode";

export const session_check = () => {
    console.log("session_check()");

    let token = sessionStorage.getItem('sessionID');
    console.log("token: " + token);

    if(token === 'undefined' || token === null){
        console.log("[session_check] token is undefined");
        sessionStorage.removeItem('sessionID');
        return null; 
    }else {
        console.log('token in session storage: ') ;
        let tokenExp = jwtDecode(token).exp;
        let date = (new Date().getTime() + 1) / 1000;
        if(date >= tokenExp ) {
            return null;
        }else{
            return token;
        }        
    }
        
}