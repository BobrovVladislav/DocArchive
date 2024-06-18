const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const documentRouter = require('./documentRouter')
const authMiddleware = require('../middleware/authMiddleware')
const prisma = require('../db');

router.use('/user', userRouter)
router.use('/documents', documentRouter)
router.get('/admin/statistics', authMiddleware('admin'), async (req, res) => {
    try {
        const usersCount = await prisma.user.count();
        const documentsCount = await prisma.document.count();
        const versionsCount = await prisma.documentVersion.count();

        const automotiveExpertiseCount = await prisma.document.count({
            where: {
                tags: {
                    hasSome: ['автомобильные экспертизы']
                }
            }
        });

        const documentaryExpertiseCount = await prisma.document.count({
            where: {
                tags: {
                    hasSome: ['документальные экспертизы']
                }
            }
        });

        const engineeringExpertiseCount = await prisma.document.count({
            where: {
                tags: {
                    hasSome: ['инженерно-технические экспертизы']
                }
            }
        });

        const statistics = {
            usersCount,
            documentsCount,
            versionsCount,
            automotiveExpertiseCount,
            documentaryExpertiseCount,
            engineeringExpertiseCount
        };

        res.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

module.exports = router