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
        let existingTrashBinRecord;

        try {
            existingTrashBinRecord = dao.findFirstRecordByData("trashBins", "owner", user.id);
        } catch (e) {
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
