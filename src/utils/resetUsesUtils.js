const cron = require('node-cron');
require("../helpers/init_mongoose");
const UserModel = require("../models/user.js"); // Replace with your user model path

cron.schedule('0 0 * * *', async () => {
    console.log('Running daily user uses reset...');
    try {
        const today = new Date().getDate();
        const usersToUpdate = await UserModel.find({
            subscription: 'free',
            lastResetDate: { $ne: today } // Find users where lastUsesResetDay is not today
        });

        for (const user of usersToUpdate) {
            user.uses = 15; // Reset uses to 15
            user.lastResetDate = today; // Update reset day
            await user.save();
        }

        console.log('User uses reset successfully!');
    } catch (error) {
        console.error('Error resetting user uses:', error);
    }
});

console.log('User uses reset job scheduled to run daily at midnight (0 0 * * *)');
