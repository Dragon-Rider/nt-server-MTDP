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

//提供邮箱服务，给运营人员发邮件使用

exports.email = function(req, res) {
    var REGULAR = 1;
    var INTERN = 2;
    var tableName = 'neitui100';
    
    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        port     : process.env.MYSQL_PORT,
        user     : process.env.ACCESSKEY,
        password : process.env.SECRETKEY,
        database : 'app_' + process.env.APPNAME
    });    

    function getSelectSQL(selectType){
        return  "SELECT `email` FROM " + tableName + " WHERE `mailed` = false AND `studentType` LIKE " + selectType + " LIMIT 0 , 30";
    }

    connection.query(getSelectSQL(REGULAR), function(err, dataRegular) {
        if (err) {
            res.send(err);
            connection.end();
            return;
        }
        connection.query(getSelectSQL(INTERN), function(err, dataInter){
            if (err) {
                res.send(err);
                connection.end();
                return;
            }
            var data = {};
            data["regular"] = dataRegular;
            data["intern"] = dataInter;
            res.render("email",{'data': data});
            connection.end();
        });        
    });
}