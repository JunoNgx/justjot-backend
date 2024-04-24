/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hwgf8r58topmsju")

  collection.name = "itemCollections"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hwgf8r58topmsju")

  collection.name = "itemLists"

  return dao.saveCollection(collection)
})
