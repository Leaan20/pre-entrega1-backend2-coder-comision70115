// Importamos el modelo
import UserModel from "../models/user.model.js";
import CartModel from "../models/cart.model.js";
// importamos las funciones de bcrypt
import { createHash, isValidPassword } from "../../utils/utils.js";


// Creamos una class para poder controlar mejor las acciones de registro y logueo de un usuario.


class UserManager {

    // metodo de registro
    async registerUser({first_name, last_name,email, password, age}){
        try {
             //verficamos si existe el usuario

        const ExistingUser = await UserModel.findOne({email});

        if(ExistingUser){
            return { status: 400, message: "Ya existe un usuario registrado con ese email." };
        };

        // Si no existe el usuario , creamos uno nuevo
        const newCart = new CartModel();
        await newCart.save();

        const newUser = new UserModel ({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age,
            cart : newCart,
        });

        console.log(newUser);
        
        await newUser.save();


        // retornamos un objeto para poder utilizar como response.
        return { status: 200, user: newUser };
        }
         catch (error) {
            console.log(error);
            
            return { status: 500, message: "Fallo en el registro, error del servidor"} ;
        }
    }

    // Metodo de logueo
    async loginUser(email, password){

       try {
        // Buscamos en la DB si tenemos un usuario registrado.
        const findUser = await UserModel.findOne({email});

        if(!findUser){
            return { status: 401, message: "No existe un usuario con ese email." };
        }
        // si encontramos el usuario , validamos la pass
        const validatePass =  isValidPassword(password, findUser);

        if(!validatePass){
            return { status: 400, message: "Contraseña inválida" };
        }
        
        // Si es correcta la pass, retornas una response con el usuario.
        
        return { status: 200,  user: findUser };
       } catch (error) {
        return { status: 500, message: "Fallo en el login, error del servidor" }
       }
    }
}

export default UserManager;