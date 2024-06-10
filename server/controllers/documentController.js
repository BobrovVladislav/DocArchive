const prisma = require('../db');

class DocumentController {

    async addDocuments(req, res) {
        const { name, type, authorId, description, status, size, url } = req.body;

        try {
            const document = await prisma.document.create({
                data: {
                    name,
                    type,
                    authorId,
                    description,
                    status,
                    histories: {
                        create: {
                            version: 1,
                            authorId,
                            url,
                            size,
                            status
                        }
                    }
                },
                include: {
                    histories: true,
                },
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
                    histories: {
                        orderBy: { version: 'desc' },
                        take: 1,
                    },
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
                    histories: {
                        include: { author: true },
                        orderBy: { version: 'desc' },
                    },
                    messages: {
                        include: { user: true },
                        orderBy: { createdAt: 'asc' },
                    },
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

    async addVersion(req, res) {
        const { url, status, size } = req.body;
        console.log(req.body)
        const authorId = req.user.id;
        const { id } = req.params;

        try {
            // Находим документ по его ID
            const document = await prisma.document.findUnique({
                where: { id: parseInt(id) },
                include: { histories: true }
            });

            if (!document) {
                return res.status(404).json({ error: 'Документ не найден' });
            }

            // Создаем новую версию документа
            const newVersion = await prisma.documentVersion.create({
                data: {
                    documentId: parseInt(id),
                    version: document.histories.length + 1,
                    url,
                    size,
                    status,
                    authorId
                }
            });

            res.status(201).json(newVersion);
        } catch (error) {
            console.error('Ошибка при добавлении новой версии:', error);
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    async addMessage(req, res) {
        const { content } = req.body;
        const id = req.params.id;
        const userId = req.user.id;

        try {
            const message = await prisma.message.create({
                data: {
                    documentId: parseInt(id, 10),
                    userId,
                    content,
                },
            });
            res.status(200).json(message);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Ошибка при добавлении сообщения' });
        }
    }
}

module.exports = new DocumentController();