/// <reference path="../pb_data/types.d.ts" />

const funcs = require("./funcs.js");
const utils = require("./utils.js");
const types = require("./types.js");

const trashFuncs = {

    /**
     * Handle a request to trash an item
     * @param {echo.Context} c 
     */
    handleTrashRequest(c) {
        const itemId = c.pathParam("itemId");

        try {
            const itemRecord = $app.dao().findRecordById(types.DbTables.ITEMS, itemId);
            const form = new RecordUpsertForm($app, itemRecord);
            form.loadData({
                isTrashed: true,
                trashedDateTime: new DateTime(),
            });
            form.submit();
            return c.json(200, itemRecord);

        } catch (err) {
            $app.logger().error(
                "Error processing request to trash an item",
                "itemId", itemId,
                "error", err.toString(),
            );
            return c.json(500, { error: err });
        }
    },

    /**
     * Handle a request to untrash an item
     * @param {echo.Context} c 
     */
    handleUntrashRequest(c) {
        const itemId = c.pathParam("itemId");

        try {
            const itemRecord = $app.dao().findRecordById(types.DbTables.ITEMS, itemId);
            const form = new RecordUpsertForm($app, itemRecord);
            form.loadData({
                isTrashed: false,
                trashedDateTime: null,
            });
            form.submit();
            return c.json(200, itemRecord);

        } catch (err) {
            $app.logger().error(
                "Error processing request to untrash an item",
                "itemId", itemId,
                "error", err.toString(),
            );
            return c.json(500, { error: err });
        }
    },
};

module.exports = trashFuncs;