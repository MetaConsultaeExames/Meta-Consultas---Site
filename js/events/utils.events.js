function closePopUp() {
    const popup = $('.popup');
    const html  = $("#html");
    popup.css('display', 'none');
    html.css('overflow', 'auto');
}

function delay(callback, ms) {
    var timer = 0;
    return function() {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}