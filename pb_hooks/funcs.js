/// <reference path="../pb_data/types.d.ts" />

const he = require("./libs/he.js");

const types = require("./types.js");
const consts = require("./consts.js");
const utils = require("./utils.js");

const recordUtils = require("./recordUtils.js");

const funcs = {
    /**
     * @param { core.RecordCreateEvent } e 
     */
    sendUserEmailVerification(e) {
        const userId = e.record.getId();
        const userRecord = $app.dao().findRecordById(types.DbTables.USERS, userId);
        $mails.sendRecordVerification($app, userRecord);
    },

    /**
     * @param { core.RecordCreateEvent } e 
     */
    createInitialItemsForNewUser(e) {
        const userId = e.record.getId();

        try {
            const collectionId = recordUtils.createCollection(
                userId, "Logbook", "logbook");
    
            recordUtils.createLinkItem(
                userId,
                collectionId,
                "Internet for people, not profit — Mozilla Global",
                "https://mozilla.org",
                "https://www.mozilla.org/media/img/favicons/mozilla/favicon-196x196.2af054fea211.png",
            );

            recordUtils.createTextItem(
                userId,
                collectionId,
                "Mellow yellow",
                "#F8DE7E",
                true
            );

            recordUtils.createTextItem(
                userId,
                collectionId,
                "Click here to copy",
                "Something you copy and use very frequently",
                true
            );

            recordUtils.createTextItem(
                userId,
                collectionId,
                "A typical text note",
                "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way—in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.",
            );

            recordUtils.createTodoItem(
                userId,
                collectionId,
                "Learn to use JustJot"
            );

        } catch (err) {
            $app.logger().error(
                "Error creating data for new user",
                "userId", userId,
                "error", err.toString(),
            );
        }
    },

     /**
     * @param { core.RecordCreateEvent } e 
     */
    classifyNewItem(e) {
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

     /**
     * @param { models.Record } itemRecord 
     */
    setItemAsTodo(itemRecord) {
        try {
            const submittedContent = itemRecord.get("content");
            const processedContent = submittedContent.
                substring(4, submittedContent.length).trim();

            const form = new RecordUpsertForm($app, itemRecord);
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

    /**
     * @param { models.Record } itemRecord 
     * @param { string } content
     */
    setItemAsLink(itemRecord, content) {
        try {
            const form = new RecordUpsertForm($app, itemRecord);
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

    /**
     * @param { models.Record } itemRecord 
     */
    setItemAsText(itemRecord) {
        try {
            const form = new RecordUpsertForm($app, itemRecord);
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

    /**
     * @param { models.Record } itemRecord 
     */
    tryGetTitleAndFavicon(itemRecord) {
        const form = new RecordUpsertForm($app, itemRecord);

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

    /**
     * @param {string} rawHtmlData 
     * @param {string} originalProcessedUrl 
     * @returns {string} The favicon url; returns empty string if not found
     */
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