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
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
var getFormsValidators = new GetFormsValidators();

var conf = {
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "astromen"
};

var dobo = new DbWrap(conf);
var model = new Model(dobo);

function sendValidationFailed(resp, validatorsMulti) {
    resp.status(400).send({result: 'failed', validationErrors: validatorsMulti.errors});
}

function sendServerError(resp, err) {
    resp.status(500).send({error: err});
}

app.get('/get_all', (req, resp) => {
        model.getAll()
        .then((result) => {
            resp.send({result: result});
            })
            .catch((err) => {
                resp.status(500).send({error: err});
            })
            ;
});

app.get('/is_exists', (req, resp) => {
    var url = require('url');
    var params = url.parse(req.url, true).query;
    var validatorsMulti = getFormsValidators.getIsExists();
    var validationPassed = validatorsMulti.validate(params);
    if (!validationPassed) {
        sendValidationFailed(resp, validatorsMulti);
    }
    else {
        model.isExists(params)
            .then((result) => {
                resp.send({result: result});
            })
            .catch((err) => {
                resp.status(500).send({error: err});
            })
            ;
    }   
});

app.post('/new', (req, resp) => {
    var params = req.body;
    var validatorsMulti = getFormsValidators.getNew();
    var validationPassed = validatorsMulti.validate(params);
    if (!validationPassed) {
        sendValidationFailed(resp, validatorsMulti);
    }
    else {
        model.addNew(params)
            .then((id) => {
                resp.send({result: 'ok', newId: id});
            })
            .catch((err) => {
                resp.status(500).send({error: err});
            });
    }
});

app.put('/edit', (req, resp) => {
    var params = req.body;
    var validatorsMulti = getFormsValidators.getEdit();
    var validationPassed = validatorsMulti.validate(params);
    if (!validationPassed) {
        sendValidationFailed(resp, validatorsMulti);
    }
    else {
        model.modify(params)
            .then(() => {
                resp.send({result: 'ok'});
            })
            .catch((err) => {
                resp.status(500).send({error: err});
            });
    }
});

app.delete('/delete/:id', (req, resp) => {
    var params = req.params;
    var validatorsMulti = getFormsValidators.getId();
    var validationPassed = validatorsMulti.validate(params);
    if (!validationPassed) {
        sendValidationFailed(resp, validatorsMulti);
    }
    else {
        model.del(params)
            .then(() => {
                resp.send({result: 'ok'});
            })
            .catch((err) => {
                resp.status(500).send({error: err});
            });
    }
});

app.listen(3030);

