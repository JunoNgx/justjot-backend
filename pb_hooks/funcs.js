const types = require(`${__hooks}/types.js`);
const consts = require(`${__hooks}/consts.js`);
const utils = require(`${__hooks}/utils.js`);

const funcs = {
    sendUserEmailVerification(e) {
        const userId = e.record.getId();
        const userRecord = $app.dao().findRecordById(types.DbTables.USERS, userId);
        $mails.sendRecordVerification($app, userRecord);
    },

    createInitialItemsForNewUser(e) {
        const userId = e.record.getId();
        const collectionId = funcs.createFirstCollectionForNewUser(userId);
        const itemsCollection = $app.dao().findCollectionByNameOrId(types.DbTables.ITEMS);

        funcs.createLinkForNewUser(userId, collectionId, itemsCollection);
        funcs.createColourNoteForNewUser(userId, collectionId, itemsCollection);
        funcs.createShortTextForNewUser(userId, collectionId, itemsCollection);
        funcs.createLongTextForNewUser(userId, collectionId, itemsCollection);
    },

    createFirstCollectionForNewUser(userId) {
        const itemCollectionsCollection = $app.dao().findCollectionByNameOrId(types.DbTables.COLLECTIONS);
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

    processNewItem(e) {
        const itemRecordId = e.model.id;
        const itemRecord = $app.dao().findFirstRecordByData("items", "id", itemRecordId);
        const content = itemRecord.get("content");

        // // Is todo list
        // const firstChar = content.substring(0, 1);
        // if (firstChar === "*" || firstChar === "-") {
        //   funcs.setItemAsTodoList(itemRecord);
        //   return;
        // }

        // Is link
        const isValidUrl = utils.isValidUrl(content);
        if (isValidUrl) {
            funcs.setItemAsLink(itemRecord);
            return;
        }

        // Fallback, is note
        funcs.setItemAsText(itemRecord);
    },

    setItemAsTodoList(itemRecord) {
        const form = RecordUpsertForm($app, itemRecord);
        // Use submitted content as title
        form.loadData({
            type: types.ItemTypes.TODO,
            title: content,
            content: ""
        });
        form.submit();
    },

    setItemAsLink(itemRecord) {
        const form = RecordUpsertForm($app, itemRecord);

        // fetch doesn't work in Goja :<
        // const getTitle = async (url) => {  
        //     return fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
        //         .then(response => {
        //             $app.logger().info(response);
        //             if (response.ok) return response.json()
        //             $app.logger().error("Failed to fetch data from url", response);
        //         })
        //         .then(data => {
        //             const doc = new DOMParser().parseFromString(data.contents, "text/html");
        //             const title = doc.querySelectorAll('title')[0];
        //             return title.innerText;
        //         });
        // };
        
        let title;
        // try {
        //     title = await getTitle(content);
        // } catch (error) {
        //     $app.logger().error("error fetching title", error);
        // }
        // TODO: fetch title and favicon
        form.loadData({
            type: types.ItemTypes.LINK,
            title
        });
        form.submit();
    },

    setItemAsText(itemRecord) {
        const form = RecordUpsertForm($app, itemRecord);
        const formData = {
            type: types.ItemTypes.TEXT
        };
        if (itemRecord.get("content").length <= consts.SHORT_NOTE_LEN)
            formData.shouldCopyOnClick = true;

        form.loadData(formData);
        form.submit();
    },
};

module.exports = funcs;