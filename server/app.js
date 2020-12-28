const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const app = express();
let doc;

try {
    doc = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'dbcreds.yml'), 'utf8'));
} catch (e) {
    console.log(e);
}

const dbcreds = doc["mongoDBCreds"];
const username = dbcreds["username"];
const password = dbcreds["password"];
const dbname = dbcreds["dbname"];

const dbURI = `mongodb+srv://${username}:${password}@mern-cluster.bmjrj.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log('DB OK');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('SERVER OK');
});
