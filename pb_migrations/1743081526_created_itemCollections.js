/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "hwgf8r58topmsju",
    "created": "2025-03-27 13:18:46.848Z",
    "updated": "2025-03-27 13:18:46.848Z",
    "name": "itemCollections",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "7ywrvsaa",
        "name": "owner",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "bhbpcrzx",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 1,
          "max": 50,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "e5mymbvo",
        "name": "slug",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 2,
          "max": 50,
          "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
        }
      },
      {
        "system": false,
        "id": "di76pxp4",
        "name": "sortOrder",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
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
  const collection = dao.findCollectionByNameOrId("hwgf8r58topmsju");

  return dao.deleteCollection(collection);
})
