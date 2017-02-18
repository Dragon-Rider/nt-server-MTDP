
$(function() {

    $('.J-input-select-img').on('change', function(e){
        $('.J-upload-img-name').val(this.value);
    })

    $(".J_submit").on('click', function(){
        Toast('图片上传中...','',120000,'',true);
    })

})