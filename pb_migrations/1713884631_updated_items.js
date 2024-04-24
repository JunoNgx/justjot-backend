/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zge7ncngf5zodei")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "okc6xar8",
    "name": "isTrashed",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "2mv9bs0v",
    "name": "trashedDateTime",
    "type": "date",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zge7ncngf5zodei")

  // remove
  collection.schema.removeField("okc6xar8")

  // remove
  collection.schema.removeField("2mv9bs0v")

  return dao.saveCollection(collection)
})
