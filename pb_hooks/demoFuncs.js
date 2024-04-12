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

        try {
            const itemCollections = $app.dao().findRecordsByFilter(
                types.DbTables.COLLECTIONS,
                `owner="${demoUserId}"`,
            );
    
            if (!itemCollections.length) return;
    
            for (const coll of itemCollections) {
                $app.dao().deleteRecord(coll);
            };
        } catch (err) {
            $app.logger().error(
                "Error deleting demo data",
                "error", err.toString(),
            );
            console.log(err)
        }
    },

    recreateData(demoUserId) {
        try {
            console.log("Execute: recreateData")

            const personalCollId = recordUtils.createCollection(
                demoUserId, "Personal", "personal");

            recordUtils.createLinkItem(
                demoUserId,
                personalCollId,
                "xkcd",
                "https://xkcd.com",
                "https://xkcd.com/s/919f27.ico",
            );
            recordUtils.createTextItem(
                demoUserId,
                personalCollId,
                "Pretty colour: Munsell",
                "#0087BD",
                true
            );
            recordUtils.createTextItem(
                demoUserId,
                personalCollId,
                "Forum signature",
                "In Light we Walk.",
                true
            );
            recordUtils.createTodoItem(
                demoUserId,
                personalCollId,
                "Buy bacon",
                true
            );
            recordUtils.createTodoItem(
                demoUserId,
                personalCollId,
                "Try Quadrilateral Cowboy"
            );
            recordUtils.createTextItem(
                demoUserId,
                personalCollId,
                "Carian Knight build",
                "Lvl: 150\nAstrologer\n\nVIG 55\nMIN 36\nEND 20\nSTR 10\nDEX 12\nINT 80\nFAI 7\nARC 9"
            );

            const workCollId = recordUtils.createCollection(
                demoUserId, "Work", "work");

        } catch (err) {
            $app.logger().error(
                "Error recreating demo data",
                "error", err.toString(),
            );
            console.log(err)
        }
    },
};

module.exports = demoFuncs;