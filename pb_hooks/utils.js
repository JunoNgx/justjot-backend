const utils = {
    sendUserEmailVerification(userId) {
        const userRecord = $app.dao().findRecordById("users", userId);
        $mails.sendRecordVerification($app, userRecord);
    }

};

module.exports = utils;