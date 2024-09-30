// Router para sessiones
import { Router } from "express";
//passport
import passport from "passport";
// Manager de usuarios
import UserManager from "../dao/db/user-manager-db.js";
// nuestra variables (aun no de entorno)
import {secret_cookie, generateToken} from "../utils/jsonwebtoken.js";


//instanciamos nuestro router de sessions.
const sessionRouter = Router();

// instanciamos nuestro manager de usuarios.
const manager = new UserManager();




// Register

sessionRouter.post('/register'  , async (req,res) => {

    const {first_name, last_name, email, age, password} = req.body;

try {
    
    const result = await manager.registerUser({ first_name, last_name, email, password, age});

        // Si el resultado es correcto y se creo el usuario.

    if (result.status === 200) {
        // generamos el token
        const token = generateToken(result.user);
        // Generamos la cookie
        res.cookie(secret_cookie, token, { maxAge: 3600000, httpOnly: true })

        res.redirect("/profile");
    } else {
        res.status(result.status).send(result.message);
    }
    
} catch (error) {
    res.status(500).send({ message: "Error en el servidor", error: error.message });
}

});




// Login


sessionRouter.post('/login',  async (req,res) => {

        const { email, password } = req.body;

    try {

        const result = await manager.loginUser(email, password);

        if (result.status === 200) {

            // generamos el token
         const token = generateToken(result.user);

            // Generamos la cookie
            res.cookie(secret_cookie, token, { maxAge: 3600000, httpOnly: true })

            res.redirect('/profile');
        } else {
            res.status(result.status).send(result.message);
        }

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).send({ message: "Error en el servidor", error: error.message });
    }
});


//ruta current - solo se puede ingresar si esta autorizado - ruta protegida.

sessionRouter.get("/current", passport.authenticate("current", { session: false }), (req, res) => {
    try {

            if (req.user.role !== "admin"){
                return res.status(403).send("Lo siento , no estas autorizado para ingresar aqui 😅");
            };

            res.render("current", { user: req.user});


    } catch (error) {
        res.status(500).send("Error del servidor, no podemos ingresar al apartado solicitado")
    }
});



// ruta para desloguearse

sessionRouter.get("/logout", (req,res) => {
    //si hay una sesion de usuario
    res.clearCookie("userCookieToken");

     res.redirect("/login");
})


export default sessionRouter;