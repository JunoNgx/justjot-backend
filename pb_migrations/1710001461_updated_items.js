/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zge7ncngf5zodei")

  // remove
  collection.schema.removeField("n5fojeci")

  // remove
  collection.schema.removeField("deai6u9e")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "k2ut3j4t",
    "name": "shouldCopyUponClick",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zge7ncngf5zodei")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "n5fojeci",
    "name": "defaultAction",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "copy",
        "edit",
        "open"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "deai6u9e",
    "name": "isMarkedDone",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // remove
  collection.schema.removeField("k2ut3j4t")

  return dao.saveCollection(collection)
})
