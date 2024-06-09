const Router = require('express')
const router = new Router()
const { addDocuments, getAllDocuments, getDocumentById, deleteDocument, getFilteredDocuments } = require('../controllers/documentController')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/all', getAllDocuments);
router.post('/add', addDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);
router.get('/documents/filter', getFilteredDocuments);

module.exports = router