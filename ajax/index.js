
function ajaxRouters(app) {
    app.get('/test', function(req, res) {
        res.send(require('./json/test'));
    });

    app.get('/zhaopin/toTest', function(req, res) {
        console.log("toTest");
        //res.redirect("#/register");
        res.redirect(302, 'http://www.baidu.com');
        //res.send(require('./json/register'));
    });
};

module.exports = ajaxRouters;

