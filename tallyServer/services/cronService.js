import cron from 'node-cron';
import User from '../models/userModel.js';
import { generateAlertsForUser } from './alertService.js';
import sendEmail from './emailService.js';

/**
 * Har subah 9 baje "Daily Digest" email bhejta hai.
 */
const startDailyDigestJob = () => {
  // Cron syntax: "minute hour day-of-month month day-of-week"
  // '0 9 * * *' = har din subah 9:00 baje
  cron.schedule(
    '0 9 * * *',
    async () => {
      console.log('Running Daily Digest Cron Job (Every day at 9:00 AM)...');

      try {
        // 1. Saare users ko find karein
        const users = await User.find({});

        // 2. Har user ke liye loop karein
        for (const user of users) {
          // 3. Unke alerts generate karein
          const alerts = await generateAlertsForUser(user._id);

          // 4. Email body banayein
          const htmlBody = `
          <h1>Your SARM Daily Digest for ${user.shopName}</h1>
          <p>Here are your smart alerts for today:</p>
          <ul>
            ${alerts.map((alert) => `<li>${alert}</li>`).join('')}
          </ul>
          <p>Have a great day!</p>
        `;

          // 5. Unhein email bhej dein
          await sendEmail({
            to: user.email,
            subject: 'Your SARM Daily Digest 📈',
            text: alerts.join('\n'),
            html: htmlBody,
          });

          console.log(`Daily digest sent to ${user.email}`);
        }
      } catch (error) {
        console.error('Error in daily digest cron job:', error);
      }
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata', // Apne server timezone ke hisaab se
    }
  );
};

export { startDailyDigestJob };