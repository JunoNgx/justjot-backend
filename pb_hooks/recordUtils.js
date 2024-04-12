const types = require("./types");

const recordUtils = {

    /**
     * Create an ItemCollection
     * @param {string} userId 
     * @param {string} collName 
     * @param {string} collSlug 
     * @return {string} The id of the created Collection record
     */
    createCollection(userId, collName, collSlug) {
        try {
            const itemCollectionsCollection = $app.dao().findCollectionByNameOrId(types.DbTables.COLLECTIONS);
            const collectionRecord = new Record(itemCollectionsCollection);
            const form = new RecordUpsertForm($app, collectionRecord);
    
            form.loadData({
                owner: userId,
                name: collName,
                slug: collSlug,
                sortOrder: 0,
            });
            form.submit();

            return collectionRecord.getId();
        } catch (err) {
            $app.logger().error(
                "Error creating Collection",
                "userId", userId,
                "error", err.toString(),
            );

            return "";
        }
    },

    /**
     * Create an Item marked as link
     * @param {string} userId 
     * @param {string} collectionId 
     * @param {string} title 
     * @param {string} content 
     * @param {string} faviconUrl 
     * @param {boolean} shouldCopyOnClick
     */
    createLinkItem(userId, collectionId, title, content, faviconUrl, shouldCopyOnClick = false) {
        try {
            const itemsCollection = $app.dao().findCollectionByNameOrId(types.DbTables.ITEMS);
            const linkItemRecord = new Record(itemsCollection);
            const linkItemForm = new RecordUpsertForm($app, linkItemRecord);
            linkItemForm.loadData({
                owner: userId,
                collection: collectionId,
                title,
                content,
                faviconUrl,
                shouldCopyOnClick,
                type: types.ItemTypes.LINK,
            });
            linkItemForm.submit();
        } catch (err) {
            $app.logger().error(
                "Error creating link",
                "userId", userId,
                "collectionId", collectionId,
                "error", err.toString(),
            );
        }
    },

    /**
     * Create an Item marked as Todo
     * @param {string} userId 
     * @param {string} collectionId 
     * @param {string} taskName 
     * @param {boolean} isTodoDone 
     */
    createTodoItem(userId, collectionId, taskName, isTodoDone = false) {
        try {
            const itemsCollection = $app.dao().findCollectionByNameOrId(types.DbTables.ITEMS);
            const todoItemRecord = new Record(itemsCollection);
            const todoItemForm = new RecordUpsertForm($app, todoItemRecord);
            todoItemForm.loadData({
                owner: userId,
                collection: collectionId,
                title: taskName,
                isTodoDone,
                type: types.ItemTypes.TODO,
            });
            todoItemForm.submit();
        } catch (err) {
            $app.logger().error(
                "Error creating todo",
                "userId", userId,
                "collectionId", collectionId,
                "error", err.toString(),
            );
        }
    },

    /**
     * Create an Item marked as Text
     * @param {string} userId 
     * @param {string} collectionId 
     * @param {string} title 
     * @param {string} content 
     * @param {boolean} shouldCopyOnClick 
     */
    createTextItem(userId, collectionId, title, content, shouldCopyOnClick = false) {
        try {
            const itemsCollection = $app.dao().findCollectionByNameOrId(types.DbTables.ITEMS);
            const textItemRecord = new Record(itemsCollection);
            const textItemForm = new RecordUpsertForm($app, textItemRecord);
            textItemForm.loadData({
                owner: userId,
                collection: collectionId,
                title,
                content,
                shouldCopyOnClick,
                type: types.ItemTypes.TEXT,
            });
            textItemForm.submit();
        } catch (err) {
            $app.logger().error(
                "Error creating todo",
                "userId", userId,
                "collectionId", collectionId,
                "error", err.toString(),
            );
        }
    },
};

module.exports = recordUtils;