/// <reference path="../pb_data/types.d.ts" />

const types = require("./types.js");

const exportFuncs = {

    /**
     * Handle a request to export all user data as a JSON file
     * @param {echo.Context} c
     */
    handleExportRequest(c) {
        const ownerId = c.pathParam("ownerId");

        try {
            const userRecord = $app.dao().findRecordById(types.DbTables.USERS, ownerId);
            const collections = $app.dao().findRecordsByExpr(
                types.DbTables.COLLECTIONS,
                $dbx.hashExp({ owner: ownerId })
            );
            const items = $app.dao().findRecordsByExpr(
                types.DbTables.ITEMS,
                $dbx.hashExp({ owner: ownerId })
            );
            const trashBins = $app.dao().findRecordsByExpr(
                types.DbTables.TRASH_BINS,
                $dbx.hashExp({ owner: ownerId })
            );
            const trashBin = trashBins.length > 0 ? trashBins[0] : null;

            const date = new Date().toISOString().split("T")[0];
            const exportData = {
                exportedAt: new Date().toISOString(),
                user: {
                    id: userRecord.getId(),
                    email: userRecord.email(),
                    username: userRecord.username(),
                    displayName: userRecord.get("displayName"),
                    userType: userRecord.get("userType"),
                },
                itemCollections: collections.map(function(col) {
                    return {
                        id: col.getId(),
                        name: col.get("name"),
                        slug: col.get("slug"),
                        sortOrder: col.get("sortOrder"),
                        created: col.get("created"),
                        updated: col.get("updated"),
                    };
                }),
                items: items.map(function(item) {
                    return {
                        id: item.getId(),
                        collection: item.get("collection"),
                        title: item.get("title"),
                        content: item.get("content"),
                        type: item.get("type"),
                        shouldCopyOnClick: item.get("shouldCopyOnClick"),
                        isTodoDone: item.get("isTodoDone"),
                        faviconUrl: item.get("faviconUrl"),
                        isTrashed: item.get("isTrashed"),
                        trashedDateTime: item.get("trashedDateTime"),
                        created: item.get("created"),
                        updated: item.get("updated"),
                    };
                }),
                trashBin: trashBin ? {
                    id: trashBin.getId(),
                    name: trashBin.get("name"),
                    slug: trashBin.get("slug"),
                } : null,
            };

            const filename = "justjot-export-" + date + ".json";
            c.response().header().set("Content-Disposition", "attachment; filename=\"" + filename + "\"");
            c.response().header().set("Content-Type", "application/json");
            return c.string(200, JSON.stringify(exportData, null, 2));

        } catch (err) {
            $app.logger().error(
                "Error processing export request",
                "ownerId", ownerId,
                "error", err.toString(),
            );
            return c.json(500, { error: err.toString() });
        }
    },
};

module.exports = exportFuncs;
