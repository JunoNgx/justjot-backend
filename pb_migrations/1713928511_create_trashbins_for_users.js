/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
    const dao = new Dao(db);

    const trashBinsCollection = dao.findCollectionByNameOrId("trashBins");
    // TODO: rename to `findAllRecords` in the next release
    const allUsers = dao.findRecordsByExpr("users");

    for (const user of allUsers) {

        try {
            // Try checking if user already has a trash bin
            dao.findFirstRecordByData("trashBins", "owner", user.id);
        } catch (e) {
            // Likely has no trash, to create a new one
            const newTrashBinRecord = new Record(trashBinsCollection, {
                owner: user.id,
                name: "Trash bin",
                slug: "trash-bin",
            });

            dao.saveRecord(newTrashBinRecord);
        }
    };
}, (db) => {
    // Intentionally does nothing
})
