const Router = require('express')
const router = new Router()
const { registration, login, check, getAllUsers, updatePermission, updatePhoto, deleteUser } = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', registration)
router.post('/login', login)
router.get('/me', authMiddleware(), check)
router.get('/all', getAllUsers)
router.put('/permissions/:userId', updatePermission)
router.post('/update-photo', authMiddleware(), updatePhoto)
router.delete('/:id', deleteUser);

module.exports = router