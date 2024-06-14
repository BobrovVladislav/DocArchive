const prisma = require('../db');

class DocumentController {

    async addDocuments(req, res) {
        const { name, type, size } = req.body;

        try {
            const document = await prisma.document.create({
                data: {
                    name,
                    type,
                    histories: {
                        create: {
                            authorId: req.user.id,
                            size,
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
                    histories: {
                        orderBy: { version: 'desc' },
                        take: 1,
                        include: {
                            author: true,
                        },
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
                    histories: {
                        include: {
                            author: {
                                include: { contactInfo: true }
                            }
                        },
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

    async updateDocument(req, res) {
        const { id } = req.params;
        const updateData = req.body;

        try {
            const result = await prisma.$transaction(async (prisma) => {
                const updateDocumentData = {};
                const updateVersionData = {};

                // Формируем данные для обновления документа
                if (updateData.name) updateDocumentData.name = updateData.name;
                if (updateData.type) updateDocumentData.type = updateData.type;
                if (updateData.description) updateDocumentData.description = updateData.description;
                if (updateData.tags) updateDocumentData.tags = updateData.tags;

                // Обновляем документ, если есть что обновлять
                if (Object.keys(updateDocumentData).length > 0) {
                    await prisma.document.update({
                        where: { id: parseInt(id, 10) },
                        data: updateDocumentData,
                    });
                }

                // Получаем последнюю версию документа
                const latestVersion = await prisma.documentVersion.findFirst({
                    where: { documentId: parseInt(id, 10) },
                    orderBy: { createdAt: 'desc' },
                });

                // Формируем данные для обновления версии документа
                if (updateData.histories.version) updateVersionData.version = updateData.histories.version;
                if (updateData.histories.url) updateVersionData.url = updateData.histories.url;
                if (updateData.histories.size) updateVersionData.size = updateData.histories.size;
                if (updateData.histories.status) updateVersionData.status = updateData.histories.status;

                // Обновляем версию документа, если есть что обновлять
                if (latestVersion && Object.keys(updateVersionData).length > 0) {
                    await prisma.documentVersion.update({
                        where: { id: latestVersion.id },
                        data: updateVersionData,
                    });
                }

                // Получаем обновленный документ вместе с его версиями
                const documentWithVersions = await prisma.document.findUnique({
                    where: { id: parseInt(id, 10) },
                    include: {
                        histories: true,
                    },
                });

                return documentWithVersions || { message: 'Документ не был обновлен, так как не было передано данных для обновления.' };
            });

            res.status(200).json(result);
        } catch (error) {
            console.error('Ошибка при обновлении документа:', error);
            res.status(500).json({ error: 'Ошибка при обновлении документа' });
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