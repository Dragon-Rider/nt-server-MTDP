var mysql   = require('mysql'),
    express = require('express'),
    app = new express(),
    bodyParser = require('body-parser'),
    http = require('http'),
    util = require('util');


app.set("view engine", 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());//use要写在所有路由之前，不然该功能就没有被启用

exports.email = function(req, res) {
    var fromName = 'neitui100';
        
    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        port     : process.env.MYSQL_PORT,
        user     : process.env.ACCESSKEY,
        password : process.env.SECRETKEY,
        database : 'app_' + process.env.APPNAME
    });
    var selectSQL = "SELECT `email` FROM " + tableName + " WHERE `studentType` LIKE `2`";

    connection.query(selectSQL, function(err, rows) {
        if (err) {
            res.send(err)
            return;
        }

        res.render("email",{'data': rows});
    });

    connection.end();
        
    //res.render("email",{'data': ['278362241@qq.com','jianghuan03@meituan.com']});
}