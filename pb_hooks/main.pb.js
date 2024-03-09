/// <reference path="../pb_data/types.d.ts" />

// Send email verification after a new user record is created
onRecordAfterCreateRequest((e) => {
    const userId = e.record.id;
    // const userRecord = $app.dao.findRecordById("users", userId);
    // $mails.sendRecordVerification(userId, userRecord);

    // Create First Collection
    const itemCollectionsCollection = $app.dao().findCollectionByNameOrId("itemCollections");
    const newItemCollectionRecord = new Record(itemCollectionsCollection);
    const form = new RecordUpsertForm($app, newItemCollectionRecord);

    form.loadData({
        owner: userId,
        name: "First Collection",
        slug: "first-collection",
        sortOrder: 0,
    });

    form.submit();
}, "users");

// // Create starting data after a new user record is verified
// onRecordAfterConfirmVerificationRequest((e) => {
    
// }, "users");
    
// TODO: fetch title and favicon for linksa