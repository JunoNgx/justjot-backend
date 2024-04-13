/// <reference path="../pb_data/types.d.ts" />
// ES5 dynamic import to accomodate Goja caveats
const types = require(`${__hooks}/types.js`);

routerAdd("PATCH", "/refetch/:ownerId/:itemId", c => {
    const refetchFuncs = require(`${__hooks}/refetchFuncs.js`);

    refetchFuncs.handleRefetchRequest(c);
}, $apis.requireAdminOrOwnerAuth("ownerId"));

onRecordAfterCreateRequest((e) => {
    const funcs = require(`${__hooks}/funcs.js`);

    funcs.sendUserEmailVerification(e);
    funcs.createInitialItemsForNewUser(e);
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

cronAdd("resetDemoData", "0 */6 * * *", () => {
    const demoFuncs = require(`${__hooks}/demoFuncs.js`);

    demoFuncs.resetDemoData();
});