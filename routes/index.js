function form (req, res) {
    res.render("form");  //优化： 加beta页，切换
}

function formBaidu (req, res) {
    res.render("form-baidu");
}

function success (req, res) {
    res.render("success");
}

function mainpage (req, res) {
    res.render("mainpage");
}

function share (req, res) {
    res.render("share");
}

module.exports = {form, formBaidu, success, mainpage, share};

/* 优化代码，需要bug fixed
var express = require('express');
var bodyParser = require('body-parser');

module.exports = function (app) {
    app.set("view engine", 'ejs'); // 设置express模板引擎，和路径为public文件夹
    app.use(express.static('../public'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json()); // use要写在所有路由之前，不然该功能就没有被启用

    console.log(app);

    app.post('/form', function(req, res){
        res.render("form");
    });
}
*/
