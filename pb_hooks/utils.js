const DbTables = {
    USERS: "users",
    ITEMS: "items",
    COLLECTIONS: "itemCollections"
};

const utils = {
    sendUserEmailVerification(userId) {
        const userRecord = $app.dao().findRecordById(DbTables.USERS, userId);
        $mails.sendRecordVerification($app, userRecord);
    }

};

module.exports = utils;