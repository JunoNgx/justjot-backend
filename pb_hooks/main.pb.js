/// <reference path="../pb_data/types.d.ts" />
const types = require(`${__hooks}/types.js`);

onRecordAfterCreateRequest((e) => {
    const utils = require(`${__hooks}/utils.js`);

    // utils.sendUserEmailVerification(e);
    utils.createInitialItemsForNewUser(e);
}, types.DbTables.USERS);

// // Create starting data after a new user record is verified
// onRecordAfterConfirmVerificationRequest((e) => {
//     utils.createInitialItemsForNewUser(e);
// }, "users");

onModelAfterCreate(async (e) => {
    const utils = require(`${__hooks}/utils.js`);
    
    utils.processNewItem(e);
}, types.DbTables.ITEMS);
