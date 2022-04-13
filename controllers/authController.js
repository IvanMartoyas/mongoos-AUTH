
const User = require("../model/User");
const Role = require("../model/Role");

const bcrypt = require('bcryptjs'); //  для хеширования
const {validationResult} = require('express-validator');// валидатор входящий даных
const jwt = require('jsonwebtoken');
const {seсret} = require('../config');// секрет для генерации токена


const  generateAccessToken = (id, roles) => {
    const payLoad = {// обьект с данными пользователя, можно указать любые
        id, roles
    }
    // {expiresIn: "24h"} время жизни токена
    return jwt.sign(payLoad, seсret, {expiresIn: "24h"} );  // возвращаю токен с основной информацией
}

//npm i bcryptjs --save нужен чтобы хешировать пароли

class authController {
    async registration( req, res) {
        try { 

            // в роутах через check я прописал правила, если они будут наршуенны то сработает этот код и выведет ошибку
            const errors = validationResult(req);// получаю данные запроса, если есть ошибки он их сам достанет
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }


            const { name, password } = req.body; // заранее достаю данные из body имя и пароля

            const condidat = await User.findOne({name}); // делаю проверку на уникальность имени, если уже пользователь с таким именем зарегистрирован

            if(condidat) {
                return res.status(400).json({message: "Пользователь с таким логином уже существет"})
            }

            const hashPassword = bcrypt.hashSync(password, 7);// хеширую пароль

            const userRole = await Role.findOne({value: "USER"})// создаю роль юзера, в последствии добавлю её в роли через userRole.value, если надо чтобы был админ то пишу findOne({value: "ADMIN"})

            const user = new User( {name: name, password: hashPassword, roles: [userRole.value]})

            await user.save();

            const token = generateAccessToken(user._id, user.roles)

            // если нужно вернуть токен с сообщением сразу после регистрации
            // return res.json({token: token, message: "Пользователь успешно зарегистрирован"});

            // если нужно просто сказать что регистрация прошла успешно
            res.json("Ользователь успешно зарегистрирован")

        } catch(e) {
            console.log("Error: ",e)
            res.status(400).json({message: "Error regitration: ",e})
        }
    }
    async login( req, res) {
        try { 

            const { name, password } = req.body; 

            const user = await User.findOne({name})

            if(!user) {// если пользователь не найден
                return res.status(400).json({message: `Пользователь ${name} не найден`})
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if(!validPassword) { // если пароли пользователя и пришедший пароль не совпали
                return res.status(400).json({message: `Неверный пароль`})
            }
            
            // если всё впорядке то делаю
            const token = generateAccessToken(user._id, user.roles)

            return res.json({token});

        } catch(e) {
            console.log("Error: ",e)
            res.status(400).json({message: "Error login: ",e})
        }
    }
    async getUser ( req, res) {
        try { 
            // ВНИМАНИЕ все операции с бд асинхронные, если не писать await то cursor будет выдовать ошибку
            
            // для начальной работы с базой добавил обычного пользователя и пользователя с админом 
            // const userRole = new Role()
            // const adminRole = new Role({value: "ADMIN"});
            // await userRole.save();
            // await adminRole.save();


            const users = await User.find()

            res.json(users)

        } catch(e) {
            console.log("Error: ",e)
            res.status(400).json({message: "Error user: ",e})
        }
    }
}

module.exports = new authController();