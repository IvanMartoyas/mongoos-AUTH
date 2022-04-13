const jwt = require("jsonwebtoken");
const {seсret} = require('../config');

//roleMiddleware.js показывает доступен ли данный роут при имеющиххся провах у пользователя (проверка на права)

module.exports = function (roles) { // указываю роли которые есть
    return function ( req, res, next ) {

        if(req.method === "OPTIONS") { 
            next()
        }

        try {
       
            const token = req.headers.authorization.split(" ")[1];
            

            if(!token) {
                return res.status(403).json({message: "Пользователь не авторизован"})
            }

            
            const userRole = jwt.verify(token, seсret).roles;
            
            console.log("access " , userRole )

            let hasRole = false;
            userRole.forEach(role => {// роли которые взял у пользователя сравниваю с разрешонными ролями 
                if(roles.includes(role)) {
                    hasRole = true
                }
            })

            if(!hasRole) {
                return res.status(403).json({message: "У вас нет доступа"})
            }
            
            next();

        } catch (e) {
            console.log(e);
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
}