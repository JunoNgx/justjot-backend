/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
    console.log("migrate up")
    const dao = new Dao(db);

    // const getAllRecords = (collectionName) => {
    //     const records = arrayOf(new Record);

    //     // dao.recordQuery(collectionName)
    //     //     .all(records);

    //     $app.dao().recordQuery(collectionName)
    //         // .andWhere($dbx.hashExp({ "status": "active" }))
    //         // .orderBy("published DESC")
    //         .limit(10)
    //         .all(records)

    //     return records;
    // };

    // const usersCollection = dao.findCollectionByNameOrId("users");
    const trashBinsCollection = dao.findCollectionByNameOrId("trashBins");

    // TODO: rename to `findAllRecords` in the next release
    const allUsers = dao.findRecordsByExpr("users");
    // const allUsers = getAllRecords("users");

    for (const user of allUsers) {

        try {
            // Try checking if user already has a trash bin
            const existingTrashBinRecord = dao.findFirstRecordByData("trashBins", "owner", user.id);
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
