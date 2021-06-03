var _browser_ = {

    __moduleName:     '_browser_',
    __isEdge:         false,
    __isExplorer:     false,
    __isFirefox:      false,
    __isOpera:        false,
    __isChrome:       false,
    __isSafari:       false,
   
    __getPointerLocation: function(__event) {
        if ((this.__isSafari) && ('ontouchstart' in window)) {
            return {x:__event.targetTouches[0].clientX, y:__event.targetTouches[0].clientY};
        } else {
            return {x: __event.offsetX, y: __event.offsetY};
        }
    },

    __processPointerDownEvent: function(__event) {
        _menu_.__closeMenu();
        if (this.__cancelPointerEvent(__event)) return;
        _view_.__processTouchStart();
    },
    __processPointerMoveEvent: function(__event) {
        if (this.__cancelPointerEvent(__event)) return;
        var __pointerLocation                     = this.__getPointerLocation(__event);
        _view_.__processTouchMove(__pointerLocation);
    },
    __processPointerUpEvent: function(__event) {
        if (this.__cancelPointerEvent(__event)) return;
        _view_.__processTouchEnd();
    },

    __cancelPointerEvent: function(__event) {
        __event.stopImmediatePropagation();
        __event.preventDefault();
        if (__event.hasOwnProperty('button')) {
            if (__event.button > 0) return true;
        } else if (__event.hasOwnProperty('originalEvent')) {
            if (__event.originalEvent.button > 0) return true;
        }
    },


    __setComponentEvents: function(__elementId, __functionDown, __functionMove, __functionUp) {
        if ((this.__isEdge || this.__isExplorer) || (this.__isChrome)) {
            $('#' + __elementId).on('pointerdown', function(__event) {eval(__functionDown); });
            $('#' + __elementId).on('pointermove', function(__event) {eval(__functionMove); });
            $('#' + __elementId).on('pointerup',   function(__event) {eval(__functionUp);   });
        }
        else {
            var __currentElement                           = document.getElementById(__elementId);
            if (this.__isFirefox) {
                // Mouse events:
                __currentElement.onpointerdown             = function(__event) {eval(__functionDown); };
                __currentElement.onpointermove             = function(__event) {eval(__functionMove); };
                __currentElement.onpointerup               = function(__event) {eval(__functionUp);   };
                // Touch events:
                __currentElement.touchstart                = function(__event) {eval(__functionDown); };
                __currentElement.touchmove                 = function(__event) {eval(__functionMove); };
                __currentElement.touchend                  = function(__event) {eval(__functionUp);   };
            } else if (this.__isOpera) {
                __currentElement.touchstart                = function(__event) {eval(__functionDown); };
                __currentElement.touchmove                 = function(__event) {eval(__functionMove); };
                __currentElement.touchend                  = function(__event) {eval(__functionUp);   };
            } else if (this.__isSafari) {
                if ('ontouchstart' in window) {
                    __currentElement.touchstart            = function(__event) {eval(__functionDown); };
                    __currentElement.touchmove             = function(__event) {eval(__functionMove); };
                    __currentElement.touchend              = function(__event) {eval(__functionUp);   };
                } else {
                    __currentElement.onmousedown           = function(__event) {eval(__functionDown); };
                    __currentElement.onmousemove           = function(__event) {eval(__functionMove); };
                    __currentElement.onmouseup             = function(__event) {eval(__functionUp);   };
                }
            }
        }
    }

};


$(document).ready(function() {
    _browser_.__isEdge              =  (navigator.userAgent.indexOf('Edge')    > -1);
    _browser_.__isExplorer          = ((navigator.userAgent.indexOf('MSIE')    > -1) || (!!document.documentMode === true));
    _browser_.__isFirefox           =  (navigator.userAgent.indexOf('Firefox') > -1);
    _browser_.__isOpera             = ((navigator.userAgent.indexOf('Opera')   > -1) || (navigator.userAgent.indexOf('OPR') > -1));
    _browser_.__isChrome            =  (navigator.userAgent.indexOf('Chrome')  > -1);
    _browser_.__isSafari            = ((navigator.userAgent.indexOf('Safari')  > -1) && (navigator.userAgent.indexOf('Chrome') === -1));
    var __canvasId                  = _utils_.__getCanvasId();
    _browser_.__setComponentEvents(__canvasId, '_browser_.__processPointerDownEvent(__event);', '_browser_.__processPointerMoveEvent(__event);', '_browser_.__processPointerUpEvent(__event);');
    // Set wheel event
    if (_browser_.__isEdge || _browser_.__isExplorer || _browser_.__isChrome) {
        _utils_.__getCanvas().on('wheel',  function(__event) {
            _browser_.__cancelPointerEvent(__event, true);
            _view_.__wheelUpdate(Math.sign(__event.originalEvent.deltaY), true);
        });
    } else {
        var __canvasElement = document.getElementById(_utils_.__getCanvasId());
        if (_browser_.__isFirefox) {
            __canvasElement.onwheel              = function(__event) {
                _browser_.__cancelPointerEvent(__event, true);
                _view_.__wheelUpdate(Math.sign(__event.deltaY), true);
            };
        } else if (_browser_.__isSafari) {
            __canvasElement.onmousewheel         = function(__event) {
                _browser_.__cancelPointerEvent(__event, true);
                _view_.__wheelUpdate(Math.sign(__event.wheelDeltaY), true);
            };
        }
    }
    // Note: Opera wheel event (if any) is not handled at this time
});
