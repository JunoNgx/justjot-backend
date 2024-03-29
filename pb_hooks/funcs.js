/// <reference path="../pb_data/types.d.ts" />

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
        try {
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
        } catch (err) {
            app.logger().Error(
                consts.ERROR_NEW_USER + "create first collection",
                "userId", userId,
                "error", err,
            );
        }
    },

    createLinkForNewUser(userId, collectionId, itemsCollection) {
        try {
            const linkItemRecord = new Record(itemsCollection);
            const linkItemForm = new RecordUpsertForm($app, linkItemRecord);
            linkItemForm.loadData({
                owner: userId,
                collection: collectionId,
                content: "https://www.mozilla.org/",
                // title to be processed by `onRecordAfterCreateHook`
            });
            linkItemForm.submit();
        } catch (err) {
            app.logger().Error(
                consts.ERROR_NEW_USER + "create link",
                "userId", userId,
                "error", err,
            );
        }
    },

    createColourNoteForNewUser(userId, collectionId, itemsCollection) {
        try {
            const colourItemRecord = new Record(itemsCollection);
            const colourItemForm = new RecordUpsertForm($app, colourItemRecord);
            colourItemForm.loadData({
                owner: userId,
                collection: collectionId,
                title: "Medium Aquamarine",
                content: "#66CDAA",
            });
            colourItemForm.submit();
        } catch (err) {
            app.logger().Error(
                consts.ERROR_NEW_USER + "create colour note",
                "userId", userId,
                "error", err,
            );
        }
    },

    createShortTextForNewUser(userId, collectionId, itemsCollection) {
        try {
            const shortTextItemRecord = new Record(itemsCollection);
            const shortTextItemForm = new RecordUpsertForm($app, shortTextItemRecord);
            shortTextItemForm.loadData({
                owner: userId,
                collection: collectionId,
                title: "Short text note",
                content: "Click here to copy",
            });
            shortTextItemForm.submit();
        } catch (err) {
            app.logger().Error(
                consts.ERROR_NEW_USER + "create short text",
                "userId", userId,
                "error", err,
            );
        }
    },

    createLongTextForNewUser(userId, collectionId, itemsCollection) {
        try {
            const longTextItemRecord = new Record(itemsCollection);
            const longTextItemForm = new RecordUpsertForm($app, longTextItemRecord);
            longTextItemForm.loadData({
                owner: userId,
                collection: collectionId,
                title: "Long text note",
                content: "Click here to open the editor. Text notes with more than 50 characters will have their default action automatically set to open the editor. You can manually configure this note item from the context menu (right click on a mouse; long press from a touchscreen, or Cmd/Ctrl + M from a keyboard)."
            });
            longTextItemForm.submit();
        } catch (err) {
            app.logger().Error(
                consts.ERROR_NEW_USER + "create long text",
                "userId", userId,
                "error", err,
            );
        }
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
            funcs.tryGetTitleAndFavicon(itemRecord);
            return;
        }

        // Fallback, is note
        funcs.setItemAsText(itemRecord);
    },

    setItemAsTodoList(itemRecord) {
        try {
            const form = RecordUpsertForm($app, itemRecord);
            // Use submitted content as title
            form.loadData({
                type: types.ItemTypes.TODO,
                title: content,
                content: ""
            });
            form.submit();
        } catch (err) {
            app.logger().Error(
                consts.ERROR_NEW_ITEM + "set item as todo list",
                "itemRecordId", itemRecord.id,
                "content", content,
                "owner", itemRecord.owner,
                "error", err,
            );
        }
    },

    setItemAsLink(itemRecord) {
        try {
            const form = RecordUpsertForm($app, itemRecord);
            form.loadData({
                type: types.ItemTypes.LINK,
            });
            form.submit();
        } catch (err) {
            app.logger().Error(
                consts.ERROR_NEW_ITEM + "set item as link",
                "itemRecordId", itemRecord.id,
                "content", content,
                "owner", itemRecord.owner,
                "error", err,
            );
        }
    },

    setItemAsText(itemRecord) {
        try {
            const form = RecordUpsertForm($app, itemRecord);
            const formData = {
                type: types.ItemTypes.TEXT
            };
            if (itemRecord.get("content").length <= consts.SHORT_NOTE_LEN)
                formData.shouldCopyOnClick = true;

            form.loadData(formData);
            form.submit();
        } catch (err) {
            app.logger().Error(
                consts.ERROR_NEW_ITEM + "set item as text",
                "itemRecordId", itemRecord.id,
                "content", content,
                "owner", itemRecord.owner,
                "error", err,
            );
        }
    },

    tryGetTitleAndFavicon(itemRecord) {
        const form = RecordUpsertForm($app, itemRecord);

        try {
            // Try adding protocol
            const processedUrl = utils.tryProcessUrl(itemRecord.get("content"));
            const res = $http.send({
                url: processedUrl,
                method: "GET",
                timeout: 2,
            });

            if (res.statusCode !== 200) {
                form.loadData({
                    content: processedUrl,
                });
                form.submit();
                return;
            }

            const title = res.raw.match(/<title.*?>(.*)<\/title>/)[1];
            // Known bug: Will fail if href comes before rel
            const favicon = res.raw.match(/<link\s+[^>]*?rel=["'](?:shortcut )?icon["'][^>]*?href=["']([^"']+)["'][^>]*?>/);

            let processedFaviconUrl;
            if (favicon && favicon[1]) {
                processedFaviconUrl = utils.tryProcessFaviconUrl(
                    favicon[1],
                    processedUrl,
                );
            }

            form.loadData({
                title,
                content: processedUrl,
                faviconUrl: processedFaviconUrl
            });
            form.submit();

        } catch (err) {
            console.log(err)
            $app.logger().warn(
                "Failed to fetch title and favicon",
                "err", err,
                "itemId", itemRecord.id,
                "content", itemRecord.get("content")
            );
        }
    },

    setTitleAndFaviconToItem(itemRecord, title, favicon) {
        const form = RecordUpsertForm($app, itemRecord);
        form.loadData({
            title: title.substring(0, consts.TITLE_MAX_LEN),
            favicon
        });
        form.submit();
    },
};

module.exports = funcs;