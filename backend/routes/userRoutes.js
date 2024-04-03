/*
  Routage fait référence à la détermination de la façon dont une application répond à un nœud final spécifique, c’est-à-dire un URI (ou chemin) et une méthode de requête HTTP (GET, POST, etc.). Chaque route a une ou plusieurs fonctions, qui sont exécutées lorsque la route est mise en correspondance.
*/
const {registerUser,loginUser,getUser, changeAvatar, editUser, getUsers} = require('../controller/userController')
const authMiddleware = require('../middleware/authMiddleware')
const {Router} = require('express')
const router = Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/:id', getUser)
router.get('/', getUsers)
router.post('/change-avatar', authMiddleware, changeAvatar)
router.patch('/edit-user', authMiddleware, editUser)

module.exports = router;