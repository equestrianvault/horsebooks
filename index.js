var express = require('express'),
app = express();

app.use(express.static(__dirname + "/dist"));
app.get('/', function(req, res) {
    res.sendfile('index.html', {root: __dirname + "/dist" })
});
var server = app.listen(process.env.PORT || 80);