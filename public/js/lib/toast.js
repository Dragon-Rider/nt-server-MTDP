
/*
*/
function Toast(content, callback, time, topPercentage, showMask) {

    let text = content || '已完成';
    let displayTime = time || 2000;
    let top = topPercentage || 45;
    let toast = $('<div class="J_toast"></div>');

    toast.html(text);
    toast.css({
        'z-index': 999,
        'position': 'fixed',
        'top': top + '%',
        'left': '50%',
        'max-width': '80%',
        'font-size': '16px',
        'color': '#ffffff',
        'text-align': 'center',
        'word-break': 'break-all',
        'line-height': '16px',
        'border-radius': '3px',
        'padding': '10px 10px 10px 10px',
        'background': 'rgba(0, 0, 0, 0.8)',
        '-webkit-box-sizing': 'border-box',
        'box-sizing': 'border-box',
        '-webkit-transform': 'translateX(-50%) translateY(-50%)',
        'transform': 'translateX(-50%) translateY(-50%)'
    });
    if($('.J_toast').length == 0){
        if(showMask) {
            let mask = $('<div class="J_toast_mask"></div>');
            mask.css({
                'z-index': 998,
                'position': 'fixed',
                'background': 'rgba(0, 0, 0, .6)',
                'top': '0',
                'left': '0',
                'height': '100%',
                'width': '100%'
            });
            toast.css({
                'background': 'rgba(0, 0, 0)'
            });
            $('body').append(mask);
        }
        $('body').append(toast);
        setTimeout(function() {
            $('.J_toast').remove();
            if(showMask) {
                $('.J_toast_mask').remove();
            }
            callback && callback();
        }, displayTime);
    }

}

