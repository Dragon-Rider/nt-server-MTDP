var mysql   = require('mysql'),  // 优化：可以换成import，引入babel
    express = require('express'),
    Email   = require("./routes/email.js"),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    formidable = require('formidable'),
    http = require('http'),
    util = require('util');
var app = new express();

const ajaxRouters = require("./ajax/");
const pageRouters  = require("./routes");
const dbName = 'app_neitui100'; // 数据库名字

app.set("view engine", 'ejs'); // 设置express模板引擎，和路径为public文件夹
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // use要写在所有路由之前，不然该功能就没有被启用
app.use(favicon(__dirname + '/public/icon/favicon.ico'));// 解决favicon请求404的问题

app.get('/form', pageRouters.form); // 优化：routes路由，可收进routes文件夹
app.get('/form-MTDP', pageRouters.formBaidu);
app.get('/success', pageRouters.success);
app.get('/share', pageRouters.share);
app.get('/email', Email.email);
ajaxRouters(app);

function createConnectSql(){  //优化：放入config文件中
    return mysql.createConnection({
        host     : '172.16.87.24',
        port     : 3306,
        user     : 'neitui100',
        password : 'neitui-100',
        database : 'app_neitui100'
    });
}

//get post data from email page
//set each ele in arr from request "sent flag"
app.post('/addSentFlag', function(req, resData) {
    var data = {};

    var updateSQL = "UPDATE neitui100 SET mailed = true WHERE email IN (";
    req.body.emails.map(function(ele) {
        if(!ele){
            return;
        }
        updateSQL += "\"" + ele + "\",";
    });
    updateSQL = updateSQL.substr(0, updateSQL.length - 1) + ");";
    var connection = createConnectSql();
    connection.query(updateSQL, function (err, res) {
        console.log(res);
        if(err){
            console.log(err)
            data["status"] = -1;
            data["data"] = err;
        }else{
            data["status"] = 0;
            data["data"] = "SUCCESS";
        }
        resData.send(data);
        connection.end();
    });
});


//百度内推数据发送页面，跳转提交成功页面。需要抽出来
app.post('/ajax-form-baidu', function(req, res){
    var tableName = 'baidu_intern_2017';

    var connection = createConnectSql();
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
            var insertSQL = "INSERT INTO  `" + dbName + "`.`" + tableName +"` (`name`, `phone`, `email`, `school`, `jobId`, `degree`, `graduateTime`, `reason`) VALUES ('" + data.name + "', '" + data.phone + "', '" + data.email + "', '" + data.school + "', '" + data.jobId + "', '" + data.degree + "', '" + data.graduateTime + "', '" + data.reason + "')";

            connection.query(insertSQL, function (err1, res1) {
                connection.end();
                if (err1) {
                    var resData = {};
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

//数据发送页面，跳转提交成功页面
app.post('/postdata', function(req, res){
    var tableName = 'neitui100';

    var connection = createConnectSql();
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
            var insertSQL = "INSERT INTO  `" + dbName + "`.`" + tableName +"` (`name`, `phone`, `email`, `school`, `interestGroupId`, `jobId`, `studentType`) VALUES ('" + data.name + "', '" + data.phone + "', '" + data.email + "', '" + data.school + "', '" + data.interestGroupId + "', '" + data.jobId + "', '" + data.studentType + "')";
            connection.query(insertSQL, function (err1, res1) {
                connection.end();
                if (err1) {
                    var resData = {};
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
    var connection = createConnectSql();

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
    var connection = createConnectSql();

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
app.get('/uaCheck', function (req, res) {
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
});
app.listen(80);  // 优化：这里把端口换成80，加https证书
