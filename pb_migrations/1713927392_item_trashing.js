/// <reference path="../pb_data/types.d.ts" />

migrate((db) => {
    const dao = new Dao(db)

    /**
     * Add new fields to ITEMS
     */
    const itemsCollection = dao.findCollectionByNameOrId("items");
    itemsCollection.schema.addField(new SchemaField({
        "system": false,
        "id": "okc6xar8",
        "name": "isTrashed",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
    }))
    itemsCollection.schema.addField(new SchemaField({
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
    dao.saveCollection(itemsCollection)
}, (db) => {
    const dao = new Dao(db)

    const itemsCollection = dao.findCollectionByNameOrId("zge7ncngf5zodei")
    itemsCollection.schema.removeField("okc6xar8")
    itemsCollection.schema.removeField("2mv9bs0v")
    dao.saveCollection(itemsCollection);
})
