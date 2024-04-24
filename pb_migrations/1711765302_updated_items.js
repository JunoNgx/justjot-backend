/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zge7ncngf5zodei")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g8ix2wjb",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "text",
        "link",
        "todo"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("zge7ncngf5zodei")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "g8ix2wjb",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "text",
        "link",
        "todoList"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
