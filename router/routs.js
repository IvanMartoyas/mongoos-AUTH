const Router = require('express');
const router = new Router();

const Controller = require("../controllers/authController");
const {check} = require('express-validator');

const authMiddleware = require('../middlewaree/authMiddleware'); 
const roleMiddleware = require('../middlewaree/roleMiddleware'); 

router.post('/registration', [
    check('name', "Имя не дложно быть пустым" ).notEmpty(),
    check('password', "Паароль должен быть не меньше 4 и не больше 10 символов" ).isLength({min: 4, max: 10})
], Controller.registration);

router.post('/login', Controller.login);

// сначала данные попадут в authMiddleware, а затем в Controller.getUser
router.get('/user',roleMiddleware(["ADMIN"]), Controller.getUser);
// чтобы разрешить доступ например пользователю к этому роту то мне достаточно написать через запятую "USER"



module.exports = router;