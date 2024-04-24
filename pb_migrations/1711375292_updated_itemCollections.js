/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hwgf8r58topmsju")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hwgf8r58topmsju")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "di76pxp4",
    "name": "sortOrder",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
})
