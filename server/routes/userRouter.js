const Router = require('express')
const router = new Router()
const { registration, login, check, getUserById, updateUserById, getUserDocumentsById, getAllUsers, updatePermission, updatePhoto, deleteUser } = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', registration)
router.post('/login', login)
router.get('/me', authMiddleware(), check)
router.get('/all', authMiddleware('admin'),  getAllUsers)
router.get('/:id', authMiddleware(), getUserById)
router.get('/:id/documents', authMiddleware(), getUserDocumentsById)
router.patch('/:id', authMiddleware(), updateUserById)
router.post('/:id/update-photo', authMiddleware(), updatePhoto)
router.put('/permissions/:userId', authMiddleware('admin'), updatePermission)
router.delete('/:id', authMiddleware('admin'), deleteUser);

module.exports = router