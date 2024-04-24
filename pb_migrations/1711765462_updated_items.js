/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zge7ncngf5zodei")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "twnv1hmx",
    "name": "isTodoDone",
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

  // remove
  collection.schema.removeField("twnv1hmx")

  return dao.saveCollection(collection)
})
