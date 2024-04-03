/*
  Routage fait référence à la détermination de la façon dont une application répond à un nœud final spécifique, c’est-à-dire un URI (ou chemin) et une méthode de requête HTTP (GET, POST, etc.). Chaque route a une ou plusieurs fonctions, qui sont exécutées lorsque la route est mise en correspondance.
*/
const {createPost, getPosts, getPost, getCatPosts, getUserPost, editPost, deletePost} = require('../controller/postController')
const authMiddleware = require('../middleware/authMiddleware')
const {Router} = require('express')
const router = Router();

router.post('/', authMiddleware, createPost)
router.get('/', getPosts)
router.get('/:id', getPost)
router.get('/categories/:category', getCatPosts)
router.get('/users/:id', getUserPost)
router.patch('/:id', authMiddleware, editPost)
router.delete('/:id', authMiddleware, deletePost)

module.exports = router;