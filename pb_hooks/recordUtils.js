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
};

module.exports = recordUtils;