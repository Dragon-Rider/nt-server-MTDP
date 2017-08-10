
function ajaxRouters(app) {
    app.post('/zhaopin/test', function(req, res) {
        res.send(require('./json/test'));
    });

    app.get('/toTest', function(req, res) {
        console.log("toTest");
        //res.redirect("#/register");
        res.redirect(302, 'http://www.baidu.com');
        //res.send(require('./json/register'));
    });
};

module.exports = ajaxRouters;
