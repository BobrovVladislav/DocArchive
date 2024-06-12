const Router = require('express')
const router = new Router()
const { addDocuments, getAllDocuments, getDocumentById, updateDocument, deleteDocument, addVersion ,addMessage } = require('../controllers/documentController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/all', getAllDocuments);
// router.get('/filter', getFilteredDocuments);
router.post('/add', addDocuments);
router.get('/:id', authMiddleware(), getDocumentById);
router.patch('/:id', authMiddleware(), updateDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/versions', authMiddleware(), addVersion);
router.post('/:id/messages', authMiddleware(), addMessage);

module.exports = router