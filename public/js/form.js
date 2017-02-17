$(function() {
    var flag = false;  //用户是否点击提交按钮

    $('.J_submit').on('click', function() {
        if(!validateForm()) {
            return;
        }

        if (flag) {
            return;
        }

        flag = true;

        $(".J_submit").addClass("grey").text('提交中');
        $.post("/postdata", {
                                name: $('.J_name').val(),
                                phone: $('.J_phone').val(),
                                email: $('.J_email').val(),
                                school: $('.J_school').val()
                            }, 
            function(data) {
                if(data.statusCode === -1){
                    $(".J_submit").removeClass("grey").text('提交');
                    alert("该手机号已注册");
                }
            }
        );
    }) 
})

function validateForm() {
    var $name = $('.J_name'),
        $phone = $('.J_phone'),
        $email = $('.J_email'),
        $school = $('.J_school'),
        $error = $('.J_error');

    var phoneRegx = /^1\d{10}$/,
        emailRegx = /^[a-zA-Z.0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    var err_msg = '邮箱填写错误',
        err_phone = '手机号填写错误',
        err_empty = '输入不可为空!';

    if(!$name.val() || !$phone.val() || !$email.val()) {
        displayError(err_empty);
        return false;
    } 

    if (!phoneRegx.test($phone.val())) {
        displayError('手机号码格式有误!');
        return false;
    }

    if (!emailRegx.test($email.val())) {
        displayError('邮箱地址格式有误!');
        return false;
    }

    return true;
}

function displayError(err_msg) {
    $('.J_error').text(err_msg).show();
}
