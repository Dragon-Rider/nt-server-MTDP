var nameVal = $('.J-name').val().trim(),
    phoneVal = $('.J-phone').val().trim(),
    emailVal = $('.J-email').val().trim(),
    schoolVal = $('.J-school').val().trim(),
    jobVal = $('.J-job').val().trim();

var phoneRegx = /^1\d{10}$/,
    emailRegx = /^[a-zA-Z.0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

var errEmailText = '邮箱地址格式有误!',
    errPhoneText = '手机号码格式有误!',
    errJobText = '请选择应聘岗位!',
    errEmptyName = '姓名不可为空!',
    errEmptyPhone = '手机号码不可为空!',
    errEmptyEmail = '邮箱地址不可为空!',
    errEmptySchool = '学校不可为空!',
    errEmptyJob = '请选择应聘岗位!';

var requestSending = false;  //用户是否点击提交按钮

$(function () {
    $('.J-submit').on('click', function () {
        if (!validateForm()) {
            return;
        }
        if (requestSending) {
            return;
        }
        $(".J-submit").addClass("grey").text('提交中');

        var $selectedOption = $('.J-job').find("option").not(function () { return !this.selected }),
            jobId = 0,
            studentType = 1;

        if ($('.J_regular').prop('checked')) {
            jobId = $selectedOption.data('regularid');
        } else {
            jobId = $selectedOption.data('internid');
            studentType = 2;
        }
        var postdata = {
            name: $('.J-name').val().trim(),
            phone: $('.J-phone').val().trim(),
            email: $('.J-email').val().trim(),
            school: $('.J-school').val().trim() || '',
            jobId: jobId || '7074',
            studentType: studentType
        };
        requestSending = true;
        $.ajax({
            type: 'post',
            url: '/postdata',
            data: postdata || {},
            success: function (data) {
                requestSending = false;
                data = data || {};

                if (data.statusCode === 1) {
                    var showSuccess = function () {
                        $('.recom-success').removeClass("hide");
                    }
                    Toast('上传成功', showSuccess, 2000, '', true);
                }
                else if (data.statusCode === -1) {
                     displayError('该手机号已注册');
                } else if (data.statusCode === -2) {
                    Toast('系统错误，请稍后尝试', '', 2000, '', true);
                }
                $(".J-submit").removeClass("grey").text('提交');
            },
            error: function (e) {
                // todo 错误处理
                requestSending = false;
                Toast('暂无网络连接，请检查网络设置', '', 2000, '', true);
                $(".J-submit").removeClass("grey").text('提交');
            }
        });
    })

    this.bindEvents();
})

function bindEvents() {
    $('#form1 .J-job').change(function () {
        if ($('.J-job-default').val() !== $(this).val() && $('.J-error').text() == errJobText) {
            $('.J-error').addClass('hide');
        }
    });

    $('#form1 .form-item input').blur(function () {
        if ($(this).attr("class") === "J-name") {
            if (!$(this).val().trim()) {
                displayError(errEmptyName);
            } else if($('.J-error').text() == errEmptyName){
                $('.J-error').addClass('hide');
            }
        }

        if ($(this).attr("class") === "J-phone") {
            if (!$(this).val().trim()) {
                displayError(errEmptyPhone);
            } else if (!phoneRegx.test(phoneVal)) {
                displayError(errPhoneText);
            } else if($('.J-error').text() == errEmptyPhone || $('.J-error').text() == errPhoneText){
                $('.J-error').addClass('hide');
            }
        }

        if ($(this).attr("class") === "J-email") {
            if (!$(this).val().trim()) {
                displayError(errEmptyEmail);
            } else if (!emailRegx.test(emailVal)) {
                displayError(errEmailText);
            } else if($('.J-error').text() == errEmptyEmail || $('.J-error').text() == errEmailText){
                $('.J-error').addClass('hide');
            }
        }

        if ($(this).attr("class") === "J-school") {
            if (!$(this).val().trim()) {
                displayError(errEmptySchool);
            } else if($('.J-error').text() == errEmptySchool){
                $('.J-error').addClass('hide');
            }
        }

/*        if ($(this).attr("class") === "J-job") {
            if ($('.J-job-default').val() === jobVal) {
                displayError(errEmptyJob);
            } else if($('.J-error').text() == errEmptyJob){
                $('.J-error').addClass('hide');
            }
        }*/
    });
}

function validateForm() {
    if (!nameVal) {
        displayError(errEmptyName);
        return false;
    }

    if (!phoneVal) {
        displayError(errEmptyPhone);
        return false;
    }

    if (!emailVal) {
        displayError(errEmptyEmail);
        return false;
    }

    if (!schoolVal) {
        displayError(errEmptySchool);
        return false;
    }

    if (!phoneRegx.test(phoneVal)) {
        displayError(errPhoneText);
        return false;
    }

    if (!emailRegx.test(emailVal)) {
        displayError(errEmailText);
        return false;
    }
    if ($('.J-job .groupDefault').val() === jobVal) {
        displayError(errJobText);
        return false;
    }

    return true;
}

function displayError(err_msg) {
    $('.J-error').text(err_msg).removeClass('hide')
}
