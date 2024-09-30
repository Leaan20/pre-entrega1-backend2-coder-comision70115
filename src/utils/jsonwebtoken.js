import jwt from "jsonwebtoken";

const private_key = "myDirtyLittleSecret";

const secret_cookie = "userCookieToken";

// Funcion que genera el token.
const generateToken = (user) => {
    const token = jwt.sign({user}, private_key, {expiresIn:"24h"});

    return token;
};



export {
    generateToken,
    secret_cookie,
    private_key
 } ;