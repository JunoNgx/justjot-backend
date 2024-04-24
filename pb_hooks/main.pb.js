/// <reference path="../pb_data/types.d.ts" />
// ES5 dynamic import to accomodate Goja caveats
const types = require(`${__hooks}/types.js`);

routerAdd("PATCH", "/refetch/:ownerId/:itemId", c => {
    const refetchFuncs = require(`${__hooks}/refetchFuncs.js`);

    refetchFuncs.handleRefetchRequest(c);
}, $apis.requireAdminOrOwnerAuth("ownerId"));

routerAdd("PATCH", "/items/trash/:ownerId/:itemId", c => {
    const trashFuncs = require(`${__hooks}/trashFuncs.js`);

    trashFuncs.handleTrashRequest(c);
}, $apis.requireAdminOrOwnerAuth("ownerId"));

routerAdd("PATCH", "/items/untrash/:ownerId/:itemId", c => {
    const trashFuncs = require(`${__hooks}/trashFuncs.js`);

    trashFuncs.handleUntrashRequest(c);
}, $apis.requireAdminOrOwnerAuth("ownerId"));

onRecordAfterCreateRequest((e) => {
    const funcs = require(`${__hooks}/funcs.js`);

    funcs.sendUserEmailVerification(e);
    funcs.createInitialItemsForNewUser(e);
    funcs.createTrashBinForNewUser(e);
}, types.DbTables.USERS);

// // Create starting data after a new user record is verified
// onRecordAfterConfirmVerificationRequest((e) => {
//     const funcs = require(`${__hooks}/funcs.js`);
//     funcs.createInitialItemsForNewUser(e);
// }, "users");

onRecordBeforeCreateRequest(async (e) => {
    const funcs = require(`${__hooks}/funcs.js`);

    funcs.classifyNewItem(e);
}, types.DbTables.ITEMS);

onRecordBeforeRequestEmailChangeRequest((e) => {
    const funcs = require(`${__hooks}/funcs.js`);

    funcs.tryBlockAttemptToChangeTestAccEmail(e);
}, types.DbTables.USERS);

cronAdd("resetDemoData", "0 */2 * * *", () => {
    const demoFuncs = require(`${__hooks}/demoFuncs.js`);

    demoFuncs.resetDemoData();
});

cronAdd("handleTrashedItems", "0 0 * * *", () => {
    const trashFuncs = require(`${__hooks}/trashFuncs.js`);

    trashFuncs.handleExpiredTrashItems();
});