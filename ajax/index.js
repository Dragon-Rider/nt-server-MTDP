
function ajaxRouters(app) {
    app.get('/test', function(req, res) {
        res.send(require('./json/test'));
    });

    //根据groupId返回对应可选事业群
    app.get('/ajax/jobMatchSingleBu', function(req, res) {
        var ajaxData = require('./json/jobMatchSingleBu'),
            allAroups = ajaxData.data,
            reqData = req.query,
            groupId = reqData.groupId;

        var oGroup = allAroups.find(function (item, index, arr) {
                return item.value == groupId;
            })
        res.send(oGroup);
    });

    app.get('/zhaopin/toTest', function(req, res) {
        console.log("toTest");
        //res.redirect("#/register");
        res.redirect(302, 'http://www.baidu.com');
        //res.send(require('./json/register'));
    });
};

module.exports = ajaxRouters;

