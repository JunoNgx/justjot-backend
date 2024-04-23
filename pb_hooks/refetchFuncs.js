/// <reference path="../pb_data/types.d.ts" />

const funcs = require("./funcs.js");
const utils = require("./utils.js");
const types = require("./types.js");

const refetchFuncs = {

    /**
     * Handle a request to refetch meta-data for an existing link
     * @param {echo.Context} c 
     */
    handleRefetchRequest(c) {
        const itemId = c.pathParam("itemId");

        try {
            const itemRecord = $app.dao().findRecordById(types.DbTables.ITEMS, itemId);
            const isValidUrl = utils.isValidUrl(itemRecord.get("content"));
            if (isValidUrl) {
                funcs.tryGetTitleAndFavicon(itemRecord);
                return c.json(200, itemRecord);
            }
    
            $app.logger().warn(
                "Was requested to refetch, but not a valid url",
                "itemId", itemId,
                "content", itemRecord.get("content"),
            );
            return c.json(400, { error: "Item is not a valid url" });
    
        } catch (err) {
            $app.logger().error(
                "Error processing request to refetch hyperlink",
                "itemId", itemId,
                "error", err,
            );
            return c.json(500, { error: err });
        }
    },
};

module.exports = refetchFuncs;