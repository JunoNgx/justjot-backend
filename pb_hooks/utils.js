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

    createLinkForNewUser(userId, collectionId, itemsCollection) {
        const linkItemRecord = new Record(itemsCollection);
        const linkItemForm = new RecordUpsertForm($app, linkItemRecord);
        linkItemForm.loadData({
            owner: userId,
            collection: collectionId,
            content: "https://www.mozilla.org/",
            // title to be processed by `onRecordAfterCreateHook`
        });
        linkItemForm.submit();
    },

    createColourNoteForNewUser(userId, collectionId, itemsCollection) {
        const colourItemRecord = new Record(itemsCollection);
        const colourItemForm = new RecordUpsertForm($app, colourItemRecord);
        colourItemForm.loadData({
            owner: userId,
            collection: collectionId,
            title: "Medium Aquamarine",
            content: "#66CDAA",
        });
        colourItemForm.submit();
    },

    createShortTextForNewUser(userId, collectionId, itemsCollection) {
        const shortTextItemRecord = new Record(itemsCollection);
        const shortTextItemForm = new RecordUpsertForm($app, shortTextItemRecord);
        shortTextItemForm.loadData({
            owner: userId,
            collection: collectionId,
            title: "Short text note",
            content: "Click here to copy",
        });
        shortTextItemForm.submit();
    },

    createLongTextForNewUser(userId, collectionId, itemsCollection) {
        const longTextItemRecord = new Record(itemsCollection);
        const longTextItemForm = new RecordUpsertForm($app, longTextItemRecord);
        longTextItemForm.loadData({
            owner: userId,
            collection: collectionId,
            title: "Long text note",
            content: "Click here to open the editor. Text notes with more than 50 characters will have their default action automatically set to open the editor. You can manually configure this note item from the context menu (right click on a mouse; long press from a touchscreen, or Cmd/Ctrl + M from a keyboard)."
        });
        longTextItemForm.submit();
    },
};

module.exports = utils;