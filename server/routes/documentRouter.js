const Router = require('express')
const router = new Router()
const { addDocuments, getAllDocuments, getDocumentById, updateDocument, deleteDocument, addVersion ,addMessage } = require('../controllers/documentController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/all', authMiddleware(), getAllDocuments);
// router.get('/filter', getFilteredDocuments);
router.post('/add', authMiddleware(), addDocuments);
router.get('/:id', authMiddleware(), getDocumentById);
router.patch('/:id', authMiddleware(), updateDocument);
router.delete('/:id', authMiddleware(), deleteDocument);
router.post('/:id/versions', authMiddleware(), addVersion);
router.post('/:id/messages', authMiddleware(), addMessage);

module.exports = router