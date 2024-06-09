const prisma = require('../db');

class DocumentController {

    async addDocuments(req, res) {
        const { name, type, authorId, size, status, url } = req.body;

        try {
            const document = await prisma.document.create({
                data: {
                    name,
                    type,
                    authorId,
                    size,
                    status,
                    url
                }
            });
            res.status(200).json(document);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Ошибка при сохранении документа' });
        }
    };

    async getAllDocuments(req, res) {
        try {
            const documents = await prisma.document.findMany({
                include: {
                    author: true,
                },
            });
            res.status(200).json(documents);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Ошибка при получении документов' });
        }
    }

    async getDocumentById(req, res) {
        const { id } = req.params;

        try {
            const document = await prisma.document.findUnique({
                where: { id: parseInt(id, 10) },
                include: {
                    author: true,
                }
            });
            res.status(200).json(document);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Ошибка при получении документа' });
        }
    }


    async deleteDocument(req, res) {
        const { id } = req.params;

        try {
            await prisma.document.delete({
                where: { id: Number(id) },
            });
            res.status(200).json({ message: 'Документ удален' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Ошибка при удалении документа' });
        }
    }

    async getFilteredDocuments(req, res) {
        const { searchTerm, status } = req.query;

        try {
            const documents = await prisma.document.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                { name: { contains: searchTerm, mode: 'insensitive' } },
                                { author: { firstName: { contains: searchTerm, mode: 'insensitive' } } },
                                { author: { lastName: { contains: searchTerm, mode: 'insensitive' } } },
                            ],
                        },
                        status ? { status } : {},
                    ],
                },
                include: {
                    author: true,
                },
            });
            res.status(200).json(documents);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Ошибка при получении документов' });
        }
    }

}

module.exports = new DocumentController();