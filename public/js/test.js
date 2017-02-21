$(function() {
    getVisitorType();
})

function getVisitorType(){
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if(isiOS){
        console.log("iOS");
        return "iOS";
    }else if(isAndroid){
        console.log("Android");
        return "Android";
    }else{
        console.log("PC");
        return "PC";
    }
}