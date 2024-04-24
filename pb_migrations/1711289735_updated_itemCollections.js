/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hwgf8r58topmsju")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hwgf8r58topmsju")

  // update
  collection.schema.addField(new SchemaField({
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
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
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
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
