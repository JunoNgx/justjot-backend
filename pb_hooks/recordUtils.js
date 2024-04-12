const recordUtils = {
    createCollection(demoUserId, collName, collSlug) {
        const itemCollectionsCollection = $app.dao().findCollectionByNameOrId(types.DbTables.COLLECTIONS);
        const collectionRecord = new Record(itemCollectionsCollection);
        const form = new RecordUpsertForm($app, collectionRecord);

        form.loadData({
            owner: demoUserId,
            name: collName,
            slug: collSlug,
            sortOrder: 0,
        });
        form.submit();
    },
};

module.exports = recordUtils;