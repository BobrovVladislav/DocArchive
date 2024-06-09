const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const documentRouter = require('./documentRouter')

router.use('/user', userRouter)
router.use('/documents', documentRouter)

module.exports = router