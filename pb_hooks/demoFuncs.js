/// <reference path="../pb_data/types.d.ts" />

const types = require("./types.js");
const consts = require("./consts.js");
const recordUtils = require("./recordUtils.js");

const demoFuncs = {
    resetDemoData() {
        console.log("Execute: resetDemoData")
        const demoUser = $app.dao().findAuthRecordByUsername(
            types.DbTables.USERS,
            consts.DEMO_USERNAME
        );

        demoFuncs.resetDisplayName(demoUser);

        const demoUserId = demoUser.getId();
        demoFuncs.deleteExistingData(demoUserId);
        demoFuncs.recreateData(demoUserId);
    },

    resetDisplayName(demoUser) {
        const form = new RecordUpsertForm($app, demoUser);
        form.loadData({
            displayName: "Jay Doe"
        });
        form.submit();
    },

    deleteExistingData(demoUserId) {
        console.log("Execute: deleteExistingData")

        const itemCollections = $app.dao().findRecordsByFilter(
            types.DbTables.COLLECTIONS,
            `owner=${demoUserId}`,
        );

        if (!itemCollections.length) return;

        for (const coll of itemCollections) {
            $app.dao().deleteRecord(coll);
        };
    },

    recreateData(demoUserId) {
        console.log("Execute: recreateData")

        const personalCollId = recordUtils.createCollection(
            demoUserId, "Personal", "personal");
        const workCollId = recordUtils.createCollection(
            demoUserId, "Work", "work");

        console.log("Demo collection created", personalCollId, workCollId);
    },
};

module.exports = demoFuncs;