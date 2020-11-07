var expr = require('express');
var DbWrap = require('./dbWrap.js');
var GetFormsValidators = require('./getFormsValidators.js');
var DateTools = require('./utils/dateTools');
var Model = require('./model.js');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = new expr();
app.use(expr.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cors());
var getFormsValidators = new GetFormsValidators();

var conf = {
  host: "localhost",
  user: "root",
  password: "12345",
  database: "astro"
};

var dobo = new DbWrap(conf);
var model = new Model(dobo);

app.get('/get_all', (req, resp) => {
    model.getAll()
            .then((result) => {
                resp.send({result: result});
            })
            .catch((err) => {
                resp.send({error: err});
            })
            ;
});

app.get('/is_exists', (req, resp) => {
    var url = require('url');
    var params = url.parse(req.url, true).query;
    var validatorsMulti = getFormsValidators.getIsExists();
    var validationPassed = validatorsMulti.validate(params);
    if (!validationPassed) {
        resp.send({result: false, validationErrors: validatorsMulti.errors});
    }
    else {
        model.isExists(params)
            .then((result) => {
                resp.send({result: result});
            })
            .catch((err) => {
                resp.send({error: err});
            })
            ;
    }   
});

app.post('/new', (req, resp) => {
    var params = req.body;
    var validatorsMulti = getFormsValidators.getNew();
    var validationPassed = validatorsMulti.validate(params);
    if (!validationPassed) {
        resp.send({result: 'failed', validationErrors: validatorsMulti.errors});
    }
    else {
        model.addNew(params)
            .then((id) => {
                resp.send({result: 'ok', newId: id});
            })
            .catch((err) => {
                resp.send({result: 'failed', error: err});
            });
    }
});

app.put('/edit', (req, resp) => {
    var params = req.body;
    var validatorsMulti = getFormsValidators.getEdit();
    var validationPassed = validatorsMulti.validate(params);
    if (!validationPassed) {
        resp.send({result: 'failed', validationErrors: validatorsMulti.errors});
    }
    else {
        model.modify(params)
            .then(() => {
                resp.send({result: 'ok'});
            })
            .catch((err) => {
                resp.send({result: 'failed', error: err});
            });
    }
});

app.delete('/delete/:id', (req, resp) => {
    var params = req.params;
    var validatorsMulti = getFormsValidators.getId();
    var validationPassed = validatorsMulti.validate(params);
    if (!validationPassed) {
        resp.send({result: 'failed', validationErrors: validatorsMulti.errors});
    }
    else {
        model.del(params)
            .then(() => {
                resp.send({result: 'ok'});
            })
            .catch((err) => {
                resp.send({result: 'failed', error: err});
            });
    }
});

app.listen(80);

