 var requestSending = false;  //用户是否点击提交按钮

$(function () {
    /*
    $($('#form1 .radioGourp input')[0]).on('click', function () {
        //is regular
        $('.only-intern').addClass('hide');
        $('.only-regular').removeClass('hide');
    });
    $($('#form1 .radioGourp input')[1]).on('click', function () {
        //is intern
        $('.only-regular').addClass('hide');
        $('.only-intern').removeClass('hide');
    });
    */

    $('.J_submit').on('click', function () {  //优化：bindEvents统一function
        if (!validateForm()) {
            return;
        }
        $(".J_submit").addClass("grey").text('提交中');
        if (requestSending) {
            return;
        }
        var $selectedOption = $('.J_Job').find("option").not(function () { return !this.selected }),
            jobId = $selectedOption.data('regularid'),
            studentType = 1;

        var postdata = {
            name: $('.J_name').val(),
            phone: $('.J_phone').val(),
            email: $('.J_email').val(),
            /*school: $('.J_school').val() || '',*/
            interestGroupId: $('.J_Group').val() || '1',
            jobId: jobId || '8956',
            studentType: 1 /*studentType*/
        };
        requestSending = true;  // 优化： 这里可以抽离postData function
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
                $(".J_submit").removeClass("grey").text('提交');
            },
            error: function (e) {
                // todo 错误处理
                requestSending = false;
                Toast('暂无网络连接，请检查网络设置', '', 2000, '', true);
                $(".J_submit").removeClass("grey").text('提交');
            }
        });
    })

    var phoneRegx = /^1\d{10}$/,
        emailRegx = /^[a-zA-Z.0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    var err_mail = '邮箱地址格式有误!',
        err_phone = '手机号码格式有误!',
        err_job = '请选择应聘岗位!';

    var err_empty_name = '姓名不可为空!',
        err_empty_phone = '手机号码不可为空!',
        err_empty_mail = '邮箱地址不可为空!',
        err_empty_school = '学校不可为空!';

    $('#form1 .J_Job').change(function (e) {
        // 如果选择的工作不为0，则隐藏警告
        if ($('.J_Job .groupDefault').val() !== $(this).val() && $('.J_error').text() == err_job) {
            $('.J_error').addClass('hide');
        }

        //切换工作改变部门
        var $this = $(this),
            $selectedOption = $(this).find("option").not(function () { return !this.selected }),
            selectedGroupId = $selectedOption.data('interestgroupid') || 0;

        $.ajax({
            type: 'get',
            url: '/ajax/jobMatchSingleBu',
            data: {'groupId' : selectedGroupId},
            success: function (res) {
                oGroup = res || {};
                console.log(oGroup);
                $('.J_Group').empty().append('<option value='+oGroup.value+'>'+oGroup.text+'</option>');
            },
            error: function (e) {
                // todo 错误处理
                console.log(e)
                Toast('暂无网络连接，请检查网络设置', '', 2000, '', true);
            }
        });

        $('.J_Group').empty().append('<option value="1">都喜欢</option>');
    });




    $('#form1 .inputDiv input').blur(function () {
        var input_name = $('.J_name').val().trim(),
            input_phone = $('.J_phone').val().trim(),
            input_email = $('.J_email').val().trim(),
            /*input_school = $('.J_school').val().trim(),*/
            input_job = $('.J_Job').val().trim();

        if ($(this).attr("class") === "J_name") {
            if (!input_name) {
                displayError(err_empty_name);
            } else if($('.J_error').text() == err_empty_name){
                $('.J_error').addClass('hide');
            }
        }

        if ($(this).attr("class") === "J_phone") {
            if (!input_phone) {
                displayError(err_empty_phone);
            } else if (!phoneRegx.test(input_phone)) {
                displayError(err_phone);
            } else if($('.J_error').text() == err_empty_phone || $('.J_error').text() == err_phone){
                $('.J_error').addClass('hide');
            }
        }

        if ($(this).attr("class") === "J_email") {
            if (!input_email) {
                displayError(err_empty_mail);
            } else if (!emailRegx.test(input_email)) {
                displayError(err_mail);
            } else if($('.J_error').text() == err_empty_mail || $('.J_error').text() == err_mail){
                $('.J_error').addClass('hide');
            }
        }
        /*
        // 不需要填写学校
        if ($(this).attr("class") === "J_school") {
            if (!input_school) {
                displayError(err_empty_school);
            } else if($('.J_error').text() == err_empty_school){
                $('.J_error').addClass('hide');
            }
        }
        */

        if ($(this).attr("class") === "J_Job") {
            if ($('.J_Job .groupDefault').val() === input_job) {
                displayError(err_empty_name);
            } else if($('.J_error').text() == err_empty_name){
                $('.J_error').addClass('hide');
            }
        }
    });

    function validateForm() {
        var input_name = $('.J_name').val().trim(),
            input_phone = $('.J_phone').val().trim(),
            input_email = $('.J_email').val().trim(),
            /*input_school = $('.J_school').val().trim(),*/
            input_job = $('.J_Job').val().trim();

        if (!input_name) {
            displayError(err_empty_name);
            return false;
        }

        if (!input_phone) {
            displayError(err_empty_phone);
            return false;
        }

        if (!input_email) {
            displayError(err_empty_mail);
            return false;
        }

/*
        if (!input_school) {
            displayError(err_empty_school);
            return false;
        }
*/

        if (!phoneRegx.test(input_phone)) {
            displayError(err_phone);
            return false;
        }

        if (!emailRegx.test(input_email)) {
            displayError(err_mail);
            return false;
        }
        if ($('.J_Job .groupDefault').val() === input_job) {
            displayError(err_job);
            return false;
        }

        return true;
    }

    function displayError(err_msg) {
        $('.J_error').text(err_msg).removeClass('hide')
    }
})


