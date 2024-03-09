/// <reference path="../pb_data/types.d.ts" />

// Send email verification after a new user record is created
onRecordAfterCreateRequest((e) => {
    const userId = e.record.getId();
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

    // Create items

    // Retrieve the recently created Collection
    const firstCollection = $app.dao().findFirstRecordByData("itemCollections", "owner", userId);
    const firstCollectionId = firstCollection.getId();

    const itemCollection = $app.dao().findCollectionByNameOrId("items");

    // Create link
    const linkItemRecord = new Record(itemCollection);
    const linkItemForm = new RecordUpsertForm($app, linkItemRecord);
    linkItemForm.loadData({
        owner: userId,
        collection: firstCollectionId,
        content: "https://bmrks.com/",
        // title to be processed by backend
    });
    linkItemForm.submit();

    // Create colour
    const colourItemRecord = new Record(itemCollection);
    const colourItemForm = new RecordUpsertForm($app, colourItemRecord);
    colourItemForm.loadData({
        owner: userId,
        collection: firstCollectionId,
        title: "Medium Aquamarine",
        content: "#66CDAA",
    });
    colourItemForm.submit();

    // Create short note
    const shortTextItemRecord = new Record(itemCollection);
    const shortTextItemForm = new RecordUpsertForm($app, shortTextItemRecord);
    shortTextItemForm.loadData({
        owner: userId,
        collection: firstCollectionId,
        title: "Short text note",
        content: "Click here to copy",
    });
    shortTextItemForm.submit();

    // Create long note
    const longTextItemRecord = new Record(itemCollection);
    const longTextItemForm = new RecordUpsertForm($app, longTextItemRecord);
    longTextItemForm.loadData({
        owner: userId,
        collection: firstCollectionId,
        title: "Long text note",
        content: "Click here to open the editor. Text notes with more than 50 characters will have their default action automatically set to open the editor. You can manually change this behavior from the context menu (right click on a mouse; long press from a touchscreen, or Cmd/Ctrl + M from a keyboard)."
    });
    longTextItemForm.submit();

}, "users");

// // Create starting data after a new user record is verified
// onRecordAfterConfirmVerificationRequest((e) => {
    
// }, "users");
    
// TODO: fetch title and favicon for links

// TODO: process and assign type to new items

// TDOO: check asterisk and dash prefix and create todo item