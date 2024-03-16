/// <reference path="../pb_data/types.d.ts" />
const DbTables = require(`${__hooks}/types.js`);

onRecordAfterCreateRequest((e) => {
    // const DbTables = require(`${__hooks}/types.js`);
    const utils = require(`${__hooks}/utils.js`);

    utils.sendUserEmailVerification(e);
    utils.createInitialItemsForNewUser(e);
}, DbTables.USERS);

// // Create starting data after a new user record is verified
// onRecordAfterConfirmVerificationRequest((e) => {
//     utils.createInitialItemsForNewUser(e);
// }, "users");

onModelAfterCreate(async (e) => {
    const SHORT_NOTE_LEN = 50;
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
        '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator

    const itemRecordId = e.model.id;
    const itemRecord = $app.dao().findFirstRecordByData("items", "id", itemRecordId);
    const content = itemRecord.get("content");
    const form = RecordUpsertForm($app, itemRecord);

    // // Is todo list
    // const firstChar = content.substring(0, 1);
    // if (firstChar === "*" || firstChar === "-") {
    //     // Use submitted content as title
    //     form.loadData({
    //         type: "todoList",
    //         title: content,
    //         content: ""
    //     });
    //     form.submit();
    //     return;
    // }

    // Is link
    const isValidUrl = urlPattern.test(content);
    if (isValidUrl) {
        // fetch doesn't work in Goja :<
        // const getTitle = async (url) => {  
        //     return fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
        //         .then(response => {
        //             $app.logger().info(response);
        //             if (response.ok) return response.json()
        //             $app.logger().error("Failed to fetch data from url", response);
        //         })
        //         .then(data => {
        //             const doc = new DOMParser().parseFromString(data.contents, "text/html");
        //             const title = doc.querySelectorAll('title')[0];
        //             return title.innerText;
        //         });
        // };
        
        let title;
        // try {
        //     title = await getTitle(content);
        // } catch (error) {
        //     $app.logger().error("error fetching title", error);
        // }
        // TODO: fetch title and favicon
        form.loadData({
            type: "link",
            title
        });
        form.submit();
        return;
    }

    // Is note
    const formData = {
        type: "text"
    };
    if (content.length <= SHORT_NOTE_LEN) formData.shouldCopyUponClick = true;
    form.loadData(formData);
    form.submit();

}, "items")