$(function () {
    var REGULAR = 0;
    var INTERN = 1;

    $('.add-flag-btn.regular').click(function() {
        postSetFlagReq(REGULAR);
    });

    $('.add-flag-btn.intern').click(function() {
        postSetFlagReq(INTERN);
    });

    $('#copy-regular-emails').click(function() {
        CopyToClipboard('regular-emails');
    });

    $('#copy-intern-emails').click(function() {
        CopyToClipboard('intern-emails');
    });

    function postSetFlagReq(type){
        var textMails = (type === REGULAR 
                            ? $('.J-regular-email.item-container').text()
                            : $('.J-intern-email.item-container').text()
                        );
        $.ajax({
            type: 'post',
            url: '/addSentFlag',
            data: {'emails' : textMails.replace(/\s+/g,"").split(";")},
            success: function (data) {
                console.log(data);
                if(data[status] == -1){
                    alert("mail update failed");
                }else{
                    alert("all update success");
                    location.reload();
                }                
            },
            error: function (e) {
                alert("ajax request failed");
                console.log(e)
            }
        });
    }    

    function CopyToClipboard(containerid) {
        if (document.selection) { 
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select().createTextRange();
            document.execCommand("Copy"); 

        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().addRange(range);
            document.execCommand("Copy");
            alert("text copied"); 
    }}
})


