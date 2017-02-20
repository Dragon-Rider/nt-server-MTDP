
$(function() {
    var requestSending = false;  //用户是否点击提交按钮

    $($('#form1 .radioGourp input')[0]).on('click', function(){
        //is regular
        $('.only-intern').addClass('hide');
        $('.only-regular').removeClass('hide');
    });
    $($('#form1 .radioGourp input')[1]).on('click', function(){
        //is intern
        $('.only-regular').addClass('hide');
        $('.only-intern').removeClass('hide');
    });
    $('.J_submit').on('click', function() {
        if(!validateForm()) {
            return;
        }
        $(".J_submit").addClass("grey").text('提交中');
        if(requestSending){
            return ;
        }
        var $selectedOption = $('.J_Job').find("option").not(function(){ return !this.selected }),
            jobId = 0;
       
        if ($('.J_regular').prop('checked')) {
            jobId = $selectedOption.data('regularid');
        }else {
            jobId = $selectedOption.data('internid');
        }
        var postdata = {
            name: $('.J_name').val(),
            phone: $('.J_phone').val(),
            email: $('.J_email').val(),
            school: $('.J_school').val() || '',
            interestGroupId:  $('.J_Group').val() || '1',
            jobId:  jobId || '7074',
        };
        requestSending = true;
        $.ajax({
            type: 'post',
            url: '/postdata',
            data: postdata || {},
            success: function (data) {
                requestSending = false;
                data = data || {};
                
                if(data.statusCode === 1){
                    var showSuccess = function(){
                        $('.recom-success').removeClass("hide");
                    }
                    Toast('上传成功', showSuccess, 2000, '', true);                    
                }
                else if(data.statusCode === -1){
                    Toast('该手机号已注册', '', 2000, '', true);
                }else if(data.statusCode === -2){
                    Toast('系统错误，请稍后尝试', '', 2000, '', true);
                }
                $(".J_submit").removeClass("grey").text('提交');
            },
            error: function (e) {
                // todo 错误处理
                requestSending = false;
                Toast('暂无网络连接，请检查网络设置', '', 2000, '', true);
            }
        });
    }) 
})

function validateForm() {
    var $name = $('.J_name'),
        $phone = $('.J_phone'),
        $email = $('.J_email'),
        $school = $('.J_school'),
        $job = $('.J_Job');
        $error = $('.J_error');

    var phoneRegx = /^1\d{10}$/,
        emailRegx = /^[a-zA-Z.0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    var err_mail = '邮箱地址格式有误!',
        err_phone = '手机号码格式有误!',
        err_job = '请选择应聘岗位!',
        err_empty = '输入不可为空!';

    if(!$name.val() || !$phone.val() || !$email.val() || !$school.val()) {
        displayError(err_empty);
        return false;
    } 

    if (!phoneRegx.test($phone.val())) {
        displayError(err_phone);
        return false;
    }

    if (!emailRegx.test($email.val())) {
        displayError(err_mail);
        return false;
    }
    if($('.J_Job .groupDefault').val() === $job.val()){
        displayError(err_job);
        return false;
    }

    return true;
}

function displayError(err_msg) {
    Toast(err_msg, '', 1000, '', true);
}
