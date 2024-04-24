/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
    const collection = new Collection({
        "id": "mx2gu6c6yab83nr",
        "created": "2024-04-24 02:56:41.237Z",
        "updated": "2024-04-24 02:56:41.237Z",
        "name": "trashBins",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "0j9n3tqi",
                "name": "owner",
                "type": "relation",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "collectionId": "_pb_users_auth_",
                    "cascadeDelete": false,
                    "minSelect": null,
                    "maxSelect": 1,
                    "displayFields": null
                }
            },
            {
                "system": false,
                "id": "qqd6rbbc",
                "name": "name",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "s4hnfjqq",
                "name": "slug",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            }
        ],
        "indexes": [],
        "listRule": "@request.auth.id = owner.id",
        "viewRule": "@request.auth.id = owner.id",
        "createRule": "@request.auth.id = owner.id",
        "updateRule": "@request.auth.id = owner.id",
        "deleteRule": "@request.auth.id = owner.id",
        "options": {}
    });

    return Dao(db).saveCollection(collection);
}, (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("trashBins");

    return dao.deleteCollection(collection);
})
