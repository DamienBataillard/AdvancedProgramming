const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.get('/notifications', authMiddleware, async (req, res) => {
    try {
        const profileId = req.user.userId;
        console.log('Profile ID:', profileId);

        const notificationQuery = `
            SELECT id_notification, message, is_read, created_at
            FROM notification
            WHERE id_profile = ?
            ORDER BY created_at DESC
        `;

        const evaluationQuery = `
            SELECT evaluation.id_evaluation, evaluation.title_evaluation, evaluation.date_closing
            FROM evaluation
            JOIN student_group ON evaluation.id_student_group = student_group.id_student_group
            JOIN student_group_association ON student_group.id_student_group = student_group_association.id_student_group
            WHERE student_group_association.id_student = ?
        `;

        const [existingNotifications] = await db.promise().query(notificationQuery, [profileId]);

        const [evaluationsEndingSoon] = await db.promise().query(evaluationQuery, [profileId]);

        const currentDate = new Date();
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(currentDate.getDate() + 7);

        for (const evaluation of evaluationsEndingSoon) {
            const evaluationClosingDate = new Date(evaluation.date_closing);

            if (evaluationClosingDate >= currentDate && evaluationClosingDate <= sevenDaysLater) {
                const formattedDate = new Date(evaluation.date_closing).toLocaleDateString('fr-FR');
                const notificationMessage = `${evaluation.title_evaluation}: The survey is closing soon (on ${formattedDate}). Don't forget to answer the survey`;

                const existingNotif = existingNotifications.find((notif) => notif.message === notificationMessage);
                if (!existingNotif) {
                    const now = new Date();

                    // Format date for MySQL
                    const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

                    const insertNotificationQuery = `
                        INSERT INTO notification (id_profile, message, is_read, created_at)
                        VALUES (?, ?, ?, ?)
                    `;

                    try {
                        const [result] = await db.promise().query(insertNotificationQuery, [
                            profileId,
                            notificationMessage,
                            false, // is_read = 0 (unread)
                            formattedDate,
                        ]);
                        console.log('Notification inserted successfully:', result.insertId);
                    } catch (err) {
                        console.error('Error inserting notification:', err);
                    }
                }
            }
        }

        const unreadCount = existingNotifications.filter((notif) => !notif.is_read).length;

        res.status(200).json({
            message: 'Notifications retrieved successfully.',
            notifications: existingNotifications,
            unreadCount,
        });

    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;