//Main Server File

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;

//ExpressJS
var app = express();

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('public', path.join(__dirname, 'public'))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + "/public"));

//Initialize neo4j driver
var driver = neo4j.driver('bolt://hobby-nimcknmcieflgbkepkpnpidl.dbs.graphenedb.com:24787', neo4j.auth.basic('myapp', 'b.yntraNmvs9zf.OB5EVHINaBBWtc3M'))
var session = driver.session()

//app getters and posters
app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/claim", (req, res) => {
    res.render("claim.ejs");
});

app.get('/populate', function (req, res) {
    session
        .run("START t=node(*) RETURN t")
        .then(function (result) {
            var peopleArr = []
            result.records.forEach(function (record) {
                peopleArr.push({
                    id: record._fields[0].identity.low,
                    title: record._fields[0].properties.name,
                    role: record._fields[0].properties.role,
                    org: record._fields[0].properties.organization,
                })
            })

            res.render('populate.ejs', {
                people: peopleArr
            })
        })
        .catch(function (err) {
            console.log(err)
        })
})

app.get('/search', function (req, res) {
    session
        .run("START n=node(*) RETURN n LIMIT 0")
        .then(function (result) {
            var peopleArr = []
            result.records.forEach(function (record) {
                peopleArr.push({
                    id: record._fields[0].identity.low,
                    title: record._fields[0].properties.name,
                    safe: record._fields[0].properties.safe,
                })
            })

            res.render('search.ejs', {
                people: peopleArr
            })
        })
        .catch(function (err) {
            console.log(err)
        })
})

app.post('/search', function (req, res) {
    var name = req.body.name;
    var role = req.body.role;
    var org = req.body.org;
    var peopleArr = []

    session
        .run("MATCH (n {name:{nameParam}}) RETURN n", { nameParam: name })
        .then(function (result) {
            result.records.forEach(function (record) {
                peopleArr.push({
                    id: record._fields[0].identity.low,
                    title: record._fields[0].properties.name,
                    safe: record._fields[0].properties.safe,
                    geo: record._fields[0].properties.geo,
                    cond: record._fields[0].properties.cond,
                    msg: record._fields[0].properties.msg,
                })
            })
            session
                .run("MATCH (n {role:{roleParam}}) RETURN n", { roleParam: role })
                .then(function (result) {
                    result.records.forEach(function (record) {
                        peopleArr.push({
                            id: record._fields[0].identity.low,
                            title: record._fields[0].properties.name,
                            safe: record._fields[0].properties.safe,
                            geo: record._fields[0].properties.geo,
                            cond: record._fields[0].properties.cond,
                            msg: record._fields[0].properties.msg,
                        })
                    })
                    session
                        .run("MATCH (n {organization:{orgParam}}) RETURN n", { orgParam: org })
                        .then(function (result) {
                            result.records.forEach(function (record) {
                                peopleArr.push({
                                    id: record._fields[0].identity.low,
                                    title: record._fields[0].properties.name,
                                    safe: record._fields[0].properties.safe,
                                    geo: record._fields[0].properties.geo,
                                    cond: record._fields[0].properties.cond,
                                    msg: record._fields[0].properties.msg,
                                })
                            })
                            res.render('search.ejs', {
                                people: peopleArr
                            })
                        }).catch(function (err) {
                            console.log(err)
                        })

                }).catch(function (err) {
                    console.log(err)
                })
        })
        .catch(function (err) {
            console.log(err)
        })
})

app.post('/claim/person/person', function (req, res) {
    var name = req.body.name;
    var geo1 = req.body.geo;
    var condition = req.body.condition;
    var custommsg = req.body.custommsg;

    session
        .run("MATCH (n { name: {nameParam}}) SET n.safe = true SET n.geo={geoParam} SET n.cond={condParam} SET n.msg={msgParam}", { nameParam: name, geoParam: geo1, condParam: condition, msgParam: custommsg })
        .then(function (result) {
            res.redirect('/claim#about')
            session.close()
        })
        .catch(function (err) {
            console.log(err)
        })
})

app.post('/person/add', function (req, res) {
    var name1 = req.body.name;
    var rol1 = req.body.role
    var org1 = req.body.org;
    var type1 = req.body.type;
    var geo = req.body.geo;
    var email = req.body.email;

    if (type1 === "person") {
        session
            .run("CREATE(n:person {name:{nameParam},role:{rolParam},organization:{orgParam}, geo:{geoParam}, email:{emailParam}, safe:true}) RETURN n", { rolParam: rol1, nameParam: name1, orgParam: org1, geoParam: geo, emailParam: email })
            .then(function (result) {
                res.redirect('/populate#results')
                session.close()
            })
            .catch(function (err) {
                console.log(err)
            })
    }
    else if (type1 === "pet") {
        session
            .run("CREATE(n:pet {name:{nameParam},role:{rolParam},organization:{orgParam}, safe:true}) RETURN n", { rolParam: rol1, nameParam: name1, orgParam: org1 })
            .then(function (result) {
                res.redirect('/populate#results')
                session.close()
            })
            .catch(function (err) {
                console.log(err)
            })
    }
    else {
        session
            .run("CREATE(n:other {name:{nameParam},role:{rolParam},organization:{orgParam},safe:true}) RETURN n", { rolParam: rol1, nameParam: name1, orgParam: org1 })
            .then(function (result) {
                res.redirect('/populate#results')
                session.close()
            })
            .catch(function (err) {
                console.log(err)
            })
    }
})


app.post('/person/del', function (req, res) {
    var name1 = req.body.name1;
    var name2 = req.body.name2;
    session
        .run("MATCH (n { name: {nameParam1} })-[r]->(k {name: {nameParam2}}) DELETE r", { nameParam1: name1, nameParam2: name2 })
        .then(function (result) {
            res.redirect('/populate#results')
            session.close()
        })
        .catch(function (err) {
            console.log(err)
        })
})

app.post('/person/link', function (req, res) {
    var name1 = req.body.name1;
    var connect = req.body.connect;
    var name2 = req.body.name2;

    if (connect === "friend")
        session
            .run("MATCH (a:person),(b:person) WHERE a.name = {name1Param} AND b.name = {name2Param} CREATE (a)-[r:friend]->(b)", { name1Param: name1, name2Param: name2 })
            .then(function (result) {
                res.redirect('/populate#results')
                session.close()
            })
            .catch(function (err) {
                console.log(err)
            })
    else if (connect === "relative")
        session
            .run("MATCH (a:person),(b:person) WHERE a.name = {name1Param} AND b.name = {name2Param} CREATE (a)-[r:relative]->(b)", { name1Param: name1, name2Param: name2 })
            .then(function (result) {
                res.redirect('/populate#results')
                session.close()
            })
            .catch(function (err) {
                console.log(err)
            })
    else if (connect === "neighbour")
        session
            .run("MATCH (a:person),(b:person) WHERE a.name = {name1Param} AND b.name = {name2Param} CREATE (a)-[r:neighbour]->(b)", { name1Param: name1, name2Param: name2 })
            .then(function (result) {
                res.redirect('/populate#results')
                session.close()
            })
            .catch(function (err) {
                console.log(err)
            })
    else if (connect === "colleague")
        session
            .run("MATCH (a:person),(b:person) WHERE a.name = {name1Param} AND b.name = {name2Param} CREATE (a)-[r:colleague]->(b)", { name1Param: name1, name2Param: name2 })
            .then(function (result) {
                res.redirect('/populate#results')
                session.close()
            })
            .catch(function (err) {
                console.log(err)
            })
    else if (connect === "owner")
        session
            .run("MATCH (a:person),(b:pet) WHERE a.name = {name1Param} AND b.name = {name2Param} CREATE (a)-[r:owner]->(b)", { name1Param: name1, name2Param: name2 })
            .then(function (result) {
                res.redirect('/populate#results')
                session.close()
            })
            .catch(function (err) {
                console.log(err)
            })
    else
        session
            .run("MATCH (a:person),(b:person) WHERE a.name = {name1Param} AND b.name = {name2Param} CREATE (a)-[r:other]->(b)", { name1Param: name1, name2Param: name2 })
            .then(function (result) {
                res.redirect('/populate#results')
                session.close()
            })
            .catch(function (err) {
                console.log(err)
            })
})

//process.env.PORT for listening to the correct port after deployment
app.listen(process.env.PORT || 3000)
console.log('Server started!')

module.exports = app
