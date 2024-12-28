db.createUser({
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles:[{role:'root',db:'admin'}]
})
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
// Create a sample collection "test"
db.createCollection('test');

// Insert a sample document into the "test" collection
db.test.insertOne({
    name: 'Sample Document',
    createdAt: new Date()
});

