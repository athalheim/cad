var _crosshairs_ = {
    __moduleName:     '_crosshairs_',
    __locateCrosshair: function(__crosshairLocation) {
        var __canvasOffset                       = _utils_.__getCanvasOffset();
        $('#crosshair-v').css(_parameter_.__left, (__canvasOffset.left + __crosshairLocation.x));
        $('#crosshair-v').css(_parameter_.__top,  __canvasOffset.top);
        $('#crosshair-h').css(_parameter_.__top,  (__canvasOffset.top  + __crosshairLocation.y));
    },
};


$(document).ready(function() {
    if ($('.hair').length === 0) {
        _utils_.__getCanvas().parent().append('<div id="crosshair-v" class="hair"></div>');
        _utils_.__getCanvas().parent().append('<div id="crosshair-h" class="hair"></div>');
    }
});
