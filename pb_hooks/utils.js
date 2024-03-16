const DbTables = require(`${__hooks}/types.js`);

const utils = {
    sendUserEmailVerification(userId) {
        const userRecord = $app.dao().findRecordById(DbTables.USERS, userId);
        $mails.sendRecordVerification($app, userRecord);
    },

    createFirstCollectionForNewUser(userId) {
        const itemCollectionsCollection = $app.dao().findCollectionByNameOrId(DbTables.COLLECTIONS);
        const collectionRecord = new Record(itemCollectionsCollection);
        const form = new RecordUpsertForm($app, collectionRecord);
    
        form.loadData({
            owner: userId,
            name: "First Collection",
            slug: "first-collection",
            sortOrder: 0,
        });
        form.submit();

        return collectionRecord.id;
    },
};

module.exports = utils;