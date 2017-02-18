var mysql   = require('mysql'),
    express = require('express'),
    routes  = require("./routes"),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),   
    formidable = require('formidable'),
    http = require('http'),
    util = require('util');

var app = new express();

app.set("view engine", 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());//use要写在所有路由之前，不然该功能就没有被启用
app.use(favicon(__dirname + '/public/icon/favicon.ico'));//解决favicon请求404的问题

app.get('/form', routes.form);
app.get('/success', routes.success);
app.get('/share', routes.share);

//数据发送页面，跳转提交成功页面
app.post('/postdata', function(req, res){
    var dbName = 'app_neitui100';
    var tableName = 'neitui100';
    
    var connection = mysql.createConnection({
            host     : process.env.MYSQL_HOST,
            port     : 3306,  //process.env.MYSQL_PORT
            user     : process.env.ACCESSKEY,
            password : process.env.SECRETKEY,
            database : 'app_' + process.env.APPNAME
        });

    var querySQL = "SELECT * FROM `" + tableName + "` WHERE `phone` = " + req.body.phone;
    connection.connect();
    connection.query(querySQL, function (err1, res1) {        
        if (res1 && res1.length != 0) {
            //phone exist
            var resData = {};
            resData["statusCode"] = -1;
            resData["data"] = "phone existed";
            connection.end();
            res.send(resData);
        } else{
            var data = req.body;
            var insertSQL = "INSERT INTO  `" + dbName + "`.`" + tableName +"` (`name`, `phone`, `email`, `school`, `interestGroupId`, `jobId`) VALUES ('" + data.name + "', '" + data.phone + "', '" + data.email + "', '" + data.school + "', '" + data.interestGroupId + "', '" + data.jobId + "')";
            connection.query(insertSQL, function (err1, res1) {
                connection.end();
                if (err1) {
                    var resData = {};
                    console.log(err1);
                    resData["statusCode"] = -2;
                    resData["data"] = err1;
                    res.send(resData);
                    return;
                } else{ 
                    var resData = {};
                    resData["statusCode"] = 1;
                    resData["data"] = "upload success";
                    res.send(resData);
                }
            });           
        }
    });    
});


//主页面
app.get('/', function (req, res) {
    res.render("mainpage.ejs",{'data': req.headers});
});

//数据发送页面
app.get('/mydatabase', function (req, res) {
    // 连接共享型MySQL
    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        port     : process.env.MYSQL_PORT,
        user     : process.env.ACCESSKEY,
        password : process.env.SECRETKEY,
        database : 'app_' + process.env.APPNAME
    });
    var selectSQL = "SELECT `name` ,  `interestGroupId` ,  `jobId` ,  `email` ,  `phone` FROM `neitui100` WHERE 1";

    connection.query(selectSQL, function(err, rows) {
        if (err) {
            res.send(err)
            return;
        }

        res.send(rows);
    });

    connection.end();

});

//数据报表展示页
app.get('/datadisplay', function (req, res) {
    // 连接共享型MySQL
    var connection = mysql.createConnection({
        host     : process.env.MYSQL_HOST,
        port     : process.env.MYSQL_PORT,
        user     : process.env.ACCESSKEY,
        password : process.env.SECRETKEY,
        database : 'app_' + process.env.APPNAME
    });
    var selectSQL = "SELECT * FROM `neitui100` WHERE 1";
    
    connection.query(selectSQL, function(err, rows) {
        if (err) {
            res.send(err)
            return;
        }

        res.render("datadisplay.ejs",{'data': rows});
    });

    connection.end();
});

//测试页面
app.get('/test', function (req, res) {
    //这个页面判断用户来源
    res.render("test.ejs",{'data': req.headers});
});


app.post('/upload', function(req, res){
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    //创建表单上传
    var form = new formidable.IncomingForm();
    //设置编辑
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "uploads/images/";
    //保留后缀
    form.keepExtensions = true;
    //设置单文件大小限制    
    form.maxFieldsSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所有文件的大小总和

    form.parse(req, function(err, fields, files) {
          res.redirect("/success") ;
    });

    return;
}

})

app.listen(process.env.PORT || 5050);






