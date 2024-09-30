// Utilizaremos el modulo de bcrypt.
import bcrypt from "bcrypt";
// tulizamos passport para passportCall
//import passport from "passport";

// Funcion de hasheo
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Funcion de comparacion.
const isValidPassword = (password,user) => bcrypt.compareSync(password,user.password);




// Queda por implementar passportCall (aunque funciona de forma correcta actualmente)
// passportCall


// const passportCall = (strategy) => {
//     return (req, res, next) => {
//         passport.authenticate(strategy, { session: false }, (err, user, info) => {
//             if (err) return next(err);
//             if (!user) return res.status(401).send({ error: "Unauthorized" });
//             req.user = user; // Almacena el usuario en la solicitud
//             next();
//         })(req, res, next);
//     };
// };

// const passportCall = (strategy) => {
//     return async (req,res,next) =>{

//         passport.authenticate(strategy,{ session: false }, (error,user,info) => {
//             if(error){
//                 return next(error);
//             }

//             if(!user){
//                 res.status(401).send({error: info.message ? info.message : info.toString()});
//             }
//             req.user = user;
//             next();
//         })(req,res,next);
//     }
// }

// // funcion de autorizacion.
// const authorization = (role) =>{
//     return async (req,res,next) =>{
//         if(req.user.role !== role){
//             return res.status(403).send("No posees el permiso necesario.");
//         }

//         next();
//     }
// }

export  {
    createHash,
    isValidPassword,
    // passportCall,
    // authorization
};