/// <reference path="../pb_data/types.d.ts" />

const types = require("./types.js");
const consts = require("./consts.js");
const recordUtils = require("./recordUtils.js");

const demoFuncs = {
    resetDemoData() {
        const demoUser = $app.dao().findAuthRecordByUsername(
            types.DbTables.USERS,
            consts.DEMO_USERNAME
        );

        demoFuncs.resetDisplayName(demoUser);

        const demoUserId = demoUser.getId();
        demoFuncs.deleteCollections(demoUserId);
        demoFuncs.createCollections(demoUserId);
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

    createCollections(demoUserId) {
        const personalCollId = recordUtils.createCollection(
            demoUserId, "Personal", "personal");
        const workCollId = recordUtils.createCollection(
            demoUserId, "Work", "work");

        console.log("Demo collection created", personalCollId, workCollId);
    },

    createItems() {

    },
};

module.exports = demoFuncs;