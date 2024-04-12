/// <reference path="../pb_data/types.d.ts" />

const types = require(`${__hooks}/types.js`);
const consts = require(`${__hooks}/consts.js`);
const utils = require(`${__hooks}/utils.js`);

const demoFuncs = {
    resetDemoData() {
        const demoUser = $app.dao().findAuthRecordByUsername(
            types.DbTables.USERS,
            consts.DEMO_USERNAME
        );

        demoFuncs.resetDisplayName(demoUser);

        const demoUserId = demoUser.getId();
        demoFuncs.deleteCollections(demoUserId);
    },

    resetDisplayName(demoUser) {
        const form = new RecordUpsertForm($app, demoUser);
        form.loadData({
            displayName: "Jay Doe"
        });
        form.submit();
    },

    deleteCollections(demoUserId) {
        const itemCollections = $app.dao().findRecordsByFilter(
            types.DbTables.COLLECTIONS,
            `owner=${demoUserId}`,
        );

        for (const coll of itemCollections) {
            $app.dao().deleteRecord(coll);
        };
    },

    createCollections() {

    },

    createItems() {

    },
};

module.exports = demoFuncs;