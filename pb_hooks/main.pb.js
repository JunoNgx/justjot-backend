/// <reference path="../pb_data/types.d.ts" />
// ES5 dynamic import to accomodate Goja caveats
const types = require(`${__hooks}/types.js`);

onRecordAfterCreateRequest((e) => {
    const funcs = require(`${__hooks}/funcs.js`);

    // funcs.sendUserEmailVerification(e);
    funcs.createInitialItemsForNewUser(e);
}, types.DbTables.USERS);

// // Create starting data after a new user record is verified
// onRecordAfterConfirmVerificationRequest((e) => {
//     funcs.createInitialItemsForNewUser(e);
// }, "users");

onModelAfterCreate(async (e) => {
    const funcs = require(`${__hooks}/funcs.js`);
    
    funcs.processNewItem(e);
}, types.DbTables.ITEMS);
