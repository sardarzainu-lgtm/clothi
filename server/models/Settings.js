const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    heroImage: {
        type: String,
        default: '/uploads/default-hero.jpg', // Default hero image path
    },
}, {
    timestamps: true,
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
    let settings = await this.findOne();
    if (!settings) {
        settings = await this.create({});
    }
    return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;

