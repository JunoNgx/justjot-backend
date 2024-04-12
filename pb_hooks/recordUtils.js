const types = require("./types");

const recordUtils = {

    /**
     * Create an ItemCollection
     * @param {string} userId 
     * @param {string} collName 
     * @param {string} collSlug 
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
        } catch (err) {
            $app.logger().error(
                "Error creating Collection",
                "userId", userId,
                "error", err.toString(),
            );
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
            const linkItemRecord = new Record(itemsCollection);
            const linkItemForm = new RecordUpsertForm($app, linkItemRecord);
            linkItemForm.loadData({
                owner: userId,
                collection: collectionId,
                title: taskName,
                isTodoDone,
                type: types.ItemTypes.TODO,
            });
            linkItemForm.submit();
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