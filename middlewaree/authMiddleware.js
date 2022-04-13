const jwt = require("jsonwebtoken");
const {seсret} = require('../config');

// authMiddleware.js показывает пользователь авторизован или нет

module.exports = function ( req, res, next ) {
    // next вызывею следующий по ципоче middleware т.е. следующую подпрограмму которая служит прослойкой между получаемыми данными от клиента и сервером.

    if(req.method === "OPTIONS") { // если нам попадает запрос типа OPTIONS то мы его пропускаем
        next()
    }

    try {
        // заголовок в себе содержит токен 
        const token = req.headers.authorization.split(" ")[1];// достаю сам токен из заголовка
        

        if(!token) {// если токена нет в запросе
            return res.status(403).json({message: "Пользователь не авторизован"})
        }

        // получается чтобы принять данные нужно в headers добавить заголовок Auth
        // а в  value  вписать Bearer и через пробел сам токен, готовый пример 
        // ( Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNTQ0ZmEyMGJmOGNkNjNjYzhkNjVhMiIsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNjQ5NzcxNzYxLCJleHAiOjE2NDk4NTgxNjF9.5R-rMdxFifBwvgSgUVf0tyCX19_FCo_isBlazYYRvbE )
        
        const decodedData = jwt.verify(token, seсret) // если кратко то расшифровываю полученый  из заголовка токен, по секретному ключу (seсret)

        req.user = decodedData // в req.user записываю декодированные данные  это будет тот самый payload из контроллера 
        
        next();// перехожу к следующему middl wear --- в данном случае попаду в обрабодку роутов в controller 

    } catch (e) {
        console.log(e);
        return res.status(403).json({message: "Пользователь не авторизован"})
    }
}
