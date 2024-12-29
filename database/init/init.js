db.createUser({
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
    roles: [{ role: 'root', db: 'admin' }],
});
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
// Create a sample collection "test"
db.createCollection('levels');

db.levels.insertOne({
    levelNumber: 1,
    levelData: [
        [1, 0, 0, 4, 0, 0, 8, 2, 0],
        [0, 6, 0, 0, 5, 0, 0, 0, 0],
        [0, 0, 0, 1, 9, 0, 0, 3, 5],
        [3, 0, 5, 0, 1, 4, 2, 7, 9],
        [6, 2, 1, 0, 7, 8, 0, 5, 4],
        [0, 9, 0, 0, 2, 3, 0, 0, 0],
        [0, 0, 0, 2, 0, 0, 0, 0, 8],
        [5, 0, 8, 0, 4, 0, 0, 0, 0],
        [0, 4, 6, 0, 0, 0, 5, 9, 0],
    ],
});
