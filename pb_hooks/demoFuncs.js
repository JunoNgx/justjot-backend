/// <reference path="../pb_data/types.d.ts" />

const types = require("./types.js");
const consts = require("./consts.js");
const recordUtils = require("./recordUtils.js");

const demoFuncs = {
    resetDemoData() {
        $app.logger().info(
            "Resetting test account",
            "datetime", new Date().toISOString()
        );

        const demoUser = $app.dao().findAuthRecordByUsername(
            types.DbTables.USERS,
            consts.TEST_ACC_USERNAME
        );

        demoFuncs.resetTestAccount(demoUser);

        const demoUserId = demoUser.getId();
        demoFuncs.deleteExistingData(demoUserId);
        demoFuncs.recreateData(demoUserId);
        demoFuncs.resetTrashBin(demoUserId);
    },

    resetTestAccount(demoUser) {
        try {
            const form = new RecordUpsertForm($app, demoUser);
            form.setFullManageAccess(true);
            form.loadData({
                email: consts.TEST_ACC_EMAIL,
                displayName: consts.TEST_ACC_USERNAME,
                password: consts.TEST_ACC_PASSWORD,
                passwordConfirm: consts.TEST_ACC_PASSWORD,
            });
            form.submit();
        } catch (err) {
            $app.logger().error(
                "Error resetting test account",
                "error", err.toString(),
            );
            console.log(err)
        }
    },

    deleteExistingData(demoUserId) {
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
                "Lvl: 150\nAstrologer\n\nVIG 60\nMIN 31\nEND 20\nSTR 10\nDEX 12\nINT 80\nFAI 7\nARC 9"
            );

            const workCollId = recordUtils.createCollection(
                demoUserId, "Work", "work");

            recordUtils.createLinkItem(
                demoUserId,
                workCollId,
                "Keyboard code reference",
                "https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values",
                "https://developer.mozilla.org/favicon-48x48.cbbd161b.png",
            );
            recordUtils.createTextItem(
                demoUserId,
                workCollId,
                "Hexcode validator func",
                "export const isValidHexColourCode = (str: string): boolean => {\r\n    const hexColourCodeRegEx = \/(^#[A-Fa-f0-9]{6}$)\/;\r\n    return hexColourCodeRegEx.test(str);\r\n}",
                true,
            );
            recordUtils.createTodoItem(
                demoUserId,
                workCollId,
                "Submit PR to fix the keyboard shortcut",
            );

        } catch (err) {
            $app.logger().error(
                "Error recreating demo data",
                "error", err.toString(),
            );
            console.log(err)
        }
    },

    resetTrashBin(demoUserId) {
        try {
            const trashBinRecord = $app.dao().findFirstRecordByFilter(
                types.DbTables.TRASH_BINS,
                `owner="${demoUserId}"`,
            );

            const trashBinForm = new RecordUpsertForm($app, trashBinRecord);
            trashBinForm.loadData({
                name: "Recycle bin",
                slug: "recycle-bin",
            });
            trashBinForm.submit();

        } catch (err) {
            $app.logger().error(
                "Error resetting demo trash bin",
                "error", err.toString(),
            );
        }
    },
};

module.exports = demoFuncs;