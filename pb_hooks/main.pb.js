/// <reference path="../pb_data/types.d.ts" />
// ES5 dynamic import to accomodate Goja caveats
const types = require(`${__hooks}/types.js`);

routerAdd("PATCH", "/refetch/:ownerId/:itemId", c => {
    const types = require(`${__hooks}/types.js`);
    const utils = require(`${__hooks}/utils.js`);
    const funcs = require(`${__hooks}/funcs.js`);

    const itemId = c.pathParam("itemId");

    try {
        const itemRecord = $app.dao().findRecordById(types.DbTables.ITEMS, itemId);
        const isValidUrl = utils.isValidUrl(itemRecord.get("content"));
        if (isValidUrl) {
            funcs.tryGetTitleAndFavicon(itemRecord);
            return c.json(200, itemRecord);
        }

        $app.logger().warn(
            "Was requested to refetch, but not a valid url",
            "itemId", itemId,
            "content", itemRecord.content,
        );
        return;

    } catch (err) {
        $app.logger().error(
            "Error processing request to refetch hyperlink",
            "err", err,
            "itemId", itemId,
            "error", err,
        );
    }
}, $apis.requireAdminOrOwnerAuth("ownerId"));

onRecordAfterCreateRequest((e) => {
    const funcs = require(`${__hooks}/funcs.js`);

    // funcs.sendUserEmailVerification(e);
    funcs.createInitialItemsForNewUser(e);
}, types.DbTables.USERS);

// // Create starting data after a new user record is verified
// onRecordAfterConfirmVerificationRequest((e) => {
//     const funcs = require(`${__hooks}/funcs.js`);
//     funcs.createInitialItemsForNewUser(e);
// }, "users");

onRecordBeforeCreateRequest(async (e) => {
    const funcs = require(`${__hooks}/funcs.js`);

    funcs.processNewItem(e);
}, types.DbTables.ITEMS);
