/// <reference path="../pb_data/types.d.ts" />
// ES5 dynamic import to accomodate Goja caveats
const types = require(`${__hooks}/types.js`);

routerAdd("POST", "/refetch/:itemId", c => {
    const utils = require(`${__hooks}/utils.js`);
    const funcs = require(`${__hooks}/funcs.js`);

    const itemId = c.pathParam("itemId");

    try {
        const itemRecord = $app.dao().findRecordById(itemId);
        const isValidUrl = utils.isValidUrl(itemRecord.content);
        if (isValidUrl) {
            funcs.tryGetTitleAndFavicon(itemRecord);
            return;
        }

        $app.logger().warn(
            "Was requested to refetch, but not a valid url",
            "itemId", itemId,
            "content", content,
        );

    } catch (err) {
        $app.logger().error(
            "Error processing request to refetch hyperlink",
            "itemId", itemId,
            "error", err,
        );
    }
});

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

onModelAfterCreate(async (e) => {
    const funcs = require(`${__hooks}/funcs.js`);
    
    funcs.processNewItem(e);
}, types.DbTables.ITEMS);
