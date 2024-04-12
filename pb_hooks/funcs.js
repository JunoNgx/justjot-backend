/// <reference path="../pb_data/types.d.ts" />

const he = require("./libs/he.js");

const types = require("./types.js");
const consts = require("./consts.js");
const utils = require("./utils.js");

const funcs = {
    sendUserEmailVerification(e) {
        const userId = e.record.getId();
        const userRecord = $app.dao().findRecordById(types.DbTables.USERS, userId);
        $mails.sendRecordVerification($app, userRecord);
    },

    createInitialItemsForNewUser(e) {
        try {
            const userId = e.record.getId();
            const collectionId = funcs.createFirstCollectionForNewUser(userId);
            const itemsCollection = $app.dao().findCollectionByNameOrId(types.DbTables.ITEMS);
    
            funcs.createLinkForNewUser(userId, collectionId, itemsCollection);
            funcs.createColourNoteForNewUser(userId, collectionId, itemsCollection);
            funcs.createShortTextForNewUser(userId, collectionId, itemsCollection);
            funcs.createLongTextForNewUser(userId, collectionId, itemsCollection);
        } catch (err) {
            $app.logger().error(
                "Error creating data for new user",
                "error", err.toString(),
                "userId", userId,
                "collectionId", collectionId,
            );
        }
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
            $app.logger().error(
                consts.ERROR_NEW_USER + "create first collection",
                "userId", userId,
                "error", err.toString(),
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
            $app.logger().error(
                consts.ERROR_NEW_USER + "create link",
                "userId", userId,
                "error", err.toString(),
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
            $app.logger().error(
                consts.ERROR_NEW_USER + "create colour note",
                "userId", userId,
                "error", err.toString(),
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
            $app.logger().error(
                consts.ERROR_NEW_USER + "create short text",
                "userId", userId,
                "error", err.toString(),
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
            $app.logger().error(
                consts.ERROR_NEW_USER + "create long text",
                "userId", userId,
                "error", err.toString(),
            );
        }
    },

    processNewItem(e) {
        const itemRecord = e.record;
        if (itemRecord.get("type")) {
            return;
        }

        const content = itemRecord.get("content");

        // Is todo item
        const firstFourChars = content.substring(0, 4);
        if (firstFourChars === ":td:") {
          funcs.setItemAsTodo(itemRecord);
          return;
        }

        // Is link
        const isValidUrl = utils.isValidUrl(content);
        if (isValidUrl) {
            funcs.tryGetTitleAndFavicon(itemRecord);
            return;
        }

        // Fallback, is note
        funcs.setItemAsText(itemRecord);
    },

    setItemAsTodo(itemRecord) {
        try {
            const submittedContent = itemRecord.get("content");
            const processedContent = submittedContent.
                substring(4, submittedContent.length).trim();

            const form = RecordUpsertForm($app, itemRecord);
            // Use processed submitted content as title
            form.loadData({
                type: types.ItemTypes.TODO,
                title: processedContent,
                content: ""
            });
            form.submit();
        } catch (err) {
            $app.logger().error(
                consts.ERROR_NEW_ITEM + "set item as todo",
                "itemRecordId", itemRecord.id,
                "owner", itemRecord.get("owner"),
                "error", err.toString(),
            );
        }
    },

    setItemAsLink(itemRecord, content) {
        try {
            const form = RecordUpsertForm($app, itemRecord);
            const formData = {
                type: types.ItemTypes.LINK,
            };
            if (content) formData.content = content;

            form.loadData(formData);
            form.submit();
        } catch (err) {
            $app.logger().error(
                consts.ERROR_NEW_ITEM + "set item as link",
                "itemRecordId", itemRecord.id,
                "content", itemRecord.content,
                "owner", itemRecord.get("owner"),
                "error", err.toString(),
            );
        }
    },

    setItemAsText(itemRecord) {
        try {
            const form = RecordUpsertForm($app, itemRecord);
            const formData = {
                type: types.ItemTypes.TEXT
            };
            // if (itemRecord.get("content").length <= consts.SHORT_NOTE_LEN)
            //     formData.shouldCopyOnClick = true;

            form.loadData(formData);
            form.submit();
        } catch (err) {
            $app.logger().error(
                consts.ERROR_NEW_ITEM + "set item as text",
                "itemRecordId", itemRecord.id,
                "content", itemRecord.content,
                "owner", itemRecord.get("owner"),
                "error", err.toString(),
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
                headers: {"Content-Type": "text/html; charset=utf-8"},
                timeout: 10,
            });

            if (res.statusCode !== 200) {
                funcs.setItemAsLink(itemRecord, processedUrl);
                return;
            }

            const title = res.raw.match(/<title.*?>(.*)<\/title>/)[1];
            const processedTitle = he.decode(title)
                .substring(0, consts.TITLE_MAX_LEN);

            const faviconUrl = funcs.tryGetFavicon(res.raw, processedUrl);

            form.loadData({
                title: processedTitle,
                content: processedUrl,
                faviconUrl,
                type: types.ItemTypes.LINK
            });
            form.submit();

        } catch (err) {
            // Even if host doesn't exist, item still needs to be typed
            funcs.setItemAsLink(itemRecord);

            console.log(err)
            $app.logger().warn(
                "Failed to fetch title and favicon",
                "err", err,
                "itemId", itemRecord.id,
                "content", itemRecord.get("content")
            );
        }
    },

    tryGetFavicon(rawHtmlData, originalProcessedUrl) {
        const urlData = utils.getProtocolAndDomain(originalProcessedUrl);

        // First choice: Scour the raw html to find possible intended 
        // Known bug: Will fail if href comes before rel
        const favicon = rawHtmlData.match(/<link\s+[^>]*?rel=["'](?:shortcut )?icon["'][^>]*?href=["']([^"']+)["'][^>]*?>/);
        if (favicon && favicon[1]) {
            const processedFaviconUrl = utils.tryProcessFaviconUrl(
                favicon[1],
                originalProcessedUrl,
            );

            return processedFaviconUrl;
        }

        // Second choice: Try getting the default `/favicon.ico`
        const defaultUrl = `${urlData.protocol}://${urlData.domain}/favicon.ico`;
        const res = $http.send({
            url: defaultUrl,
            method: "GET",
            timeout: 2,
        });

        if (res.statusCode === 200) {
            return defaultUrl;
        }

        return "";
    },
};

module.exports = funcs;