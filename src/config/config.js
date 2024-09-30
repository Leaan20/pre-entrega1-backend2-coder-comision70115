// En este archivo , configuraremos las estrategias para el registro y logueo de usuarios.
//importamos passport
import passport from "passport";
// importamos jwt
import jwt from "passport-jwt";
// importamos nuestras variables
import {secret_cookie, private_key} from "../utils/jsonwebtoken.js";



// Jwt utilizamos Json Web Token.


const JWTStrategy = jwt.Strategy; 
const ExtractJwt = jwt.ExtractJwt; 

const initializePassport = () => {

    //Implementamos una estrategia "current" que funcione con JWT para restringir el acceso.
    passport.use("current", new JWTStrategy({
        // Extrae el JWT de las cookies
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        // clave secreta.
        secretOrKey: private_key,
    }, async (jwt_payload, done) => {
        try {
            // usuario almacenado en el token
            return done(null, jwt_payload.user);
        } catch (error) {
            return done(error);
        }
    }));

    
}

//Funcion extractora del token.
const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies[secret_cookie];
    }
    return token;
}

export default initializePassport;