/// <reference path="../pb_data/types.d.ts" />

// Send email verification after a new user record is created
onRecordAfterCreateRequest((e) => {
    const userId = e.record.id;
    const userRecord = $app.dao.findRecordById("users", userId);
    $mails.sendRecordVerification(userId, userRecord);
}, "users");

// TODO: fetch title and favicon for links