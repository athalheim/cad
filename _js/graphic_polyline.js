var _polyline_ = {

    __moduleName:                         '_polyline_',
    __invalidLinearOption:                'invalidLinearOption',
    __invalidArcOption:                   'invalidArcOption',
    __invalidEntry:                       'invalidEntry',
    __choosePolylineType: function() {
        _inputSelect_.__selectObjectByType(this.__moduleName, Object.keys(this.__parameterObject), '_polyline_._processPolylineByType(__inputValue)');
    },
    _processPolylineByType: function(__inputValue) {
        if (__inputValue === 'polyline') {
            _add_.__initialize('polyline', '');
        } else {
            var __option                             = __inputValue.replace('polygon', '');
            _add_.__initialize('polygon', __option);
        }
    },
    // NOTE: This code covers the following objects:
    //    line
    //    polyline
    //    polygon


    /* ******************************************************** */
    //  PROPERTIES

    //  Polyline options:
    __polylineType:                       'polyline',
    __polygonType:                        'polygon',

    // Menu options:
    __centerOption:                       'Center',
    __sideOption:                         'Side',

    __parameterObject: {
        polyline:{
            __parameterNames: [_parameter_.__origin,             _parameter_.__nextPoint],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        },
        polygon:{
            __parameterNames: [_parameter_.__origin,             _parameter_.__nextPoint],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        },
        polygonCenter:{
            __parameterNames: [_parameter_.__sideCount,            _parameter_.__origin,             _parameter_.__nextPoint],
            __parameterTypes: ['_polyline_.__sideCountParameters', _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        },
        polygonSide:{
            __parameterNames: [_parameter_.__sideCount,            _parameter_.__origin,             _parameter_.__nextPoint],
            __parameterTypes: ['_polyline_.__sideCountParameters', _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        },
    },

    // Options used in _edit_ module:
    __optionNames:                        [_parameter_.__option,                                _parameter_.__sideCount],
    __optionTypes:                        ['_polyline_.__regularPolygonParameters', _parameter_.__parameterTypeNumeric],

    __sideCountParameters:                [3,4,5,6,7,8,9,10,12,15,16,20,24,36],

    __regularPolygonParameters:           {
                                            center: _parameter_.__center,
                                            side:   _parameter_.__side
                                          },


    /* ******************************************************** */
    // POLYLINE/POLYGON-SPECIFIC
    //  Properties
    //   Options:
    //    Segment options: line, arc
    __polylineSegmentTypeArc:             'a',
    __polylineSegmentTypeLine:            'l',
    __polylineSegmentType:                'l',

    //    Linear options:
    //  Note: setting current segment type to 'linear' resets arc initial option to 'p' (point)
    __polylineLinearSegmentOptionLength:  'l',

    //    Arc options:
    //  Note: setting current segment type to 'arc' resets arc initial option to 'e' (end)
    __polylineArcSegmentOptionBulge:      'b',
    __polylineArcSegmentOptionCenter:     'c',
    __polylineArcSegmentOptionEnd:        'e',
    __polylineArcSegmentOptionSecond:     's',
    __polylineArcSegmentOption:           'e',

    //     Usage:
    //       'b': start-end-bulge
    //       'c': start-center-end
    //       'e': start-end (default: compute center, using start direction)
    //       's': start-second-end
    //       Cancelled by 'l' (returns to linear segment)
    __polylineCurrentArcBulgePoint:       null,
    __polylineCurrentArcCenterPoint:      null,
    __polylineCurrentArcEndPoint:         null,
    __polylineCurrentArcSecondPoint:      null,



    /* ******************************************************** */
    //  PROCEDURES
    // 1. Initialize: Done in _add_ module.
    //  This procedure manages polyline exceptions to the general rule
    __initialize: function(__thisObject) {
        if (!_utils_.__ownsProperty(__thisObject, _parameter_.__option)) {
            __thisObject.__polylineSegmentType                      = this.__polylineSegmentTypeLine;
        }
    },

    // 2. Data acquisition: either a (picked) point or an input entry: validated point, selected option, side count or a string
    __addParameterData: function(__thisObject, __data) {
        switch (_add_.__parameterName) {
            case _parameter_.__sideCount:
                if (_utils_.__hasXproperty(__data)) {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidEntry));
                } else {
                    __thisObject[_parameter_.__sideCount]                 = __data;
                    return true;
                }
                break;
            default:
                if (_utils_.__hasXproperty(__data)) {
                    this.__addParameterPoint(__thisObject, __data);
                    return true;
                } else  if (isNaN(__data)) {
                    if (__data === this.__regularPolygonParameters[_parameter_.__side]) {
                        __thisObject[_parameter_.__option]         = __data;
                    } else if (__data === this.__regularPolygonParameters[_parameter_.__center]) {
                        __thisObject[_parameter_.__option]         = __data;
                    } else {
                        this.__checkPolylineSegmentOption(__thisObject, __data);
                        this.__updateInputTitle(__thisObject);
                    }
                }
        }
    },

    __addParameterPoint: function(__thisObject, __data) {
        if (_utils_.__ownsProperty(__thisObject, _parameter_.__origin)) {
            if (_utils_.__ownsProperty(__thisObject,_parameter_.__option)) {
                __thisObject[_parameter_.__points].push(__data);
                return true;
            } else {
                // polygon/polyline: Will return 'true' if a point was added:
                return this.__checkPolylineSegmentPoint(__thisObject, __data);
            }
        } else {
            __thisObject[_parameter_.__origin]                    = __data;
            __thisObject[_parameter_.__points]                    = [];
            return true;
        }
    },

    __updateInputTitle: function(__thisObject) {
        if (__thisObject.__polylineSegmentType === this.__polylineSegmentTypeLine) {
            _inputSingle_.__updatePromptTitle(_messages_.__getMessage(_parameter_.__nextPoint));
        } else {
            switch (__thisObject.__polylineArcSegmentOption) {
                case this.__polylineArcSegmentOptionBulge:  _inputSingle_.__updatePromptTitle(_messages_.__getMessage(_parameter_.__nextPointArcBulge)); break;
                case this.__polylineArcSegmentOptionCenter: _inputSingle_.__updatePromptTitle(_messages_.__getMessage(_parameter_.__nextPointArcCenter)); break;
                case this.__polylineArcSegmentOptionSecond: _inputSingle_.__updatePromptTitle(_messages_.__getMessage(_parameter_.__nextPointArcSecond)); break;
                default:                                    _inputSingle_.__updatePromptTitle(_messages_.__getMessage(_parameter_.__nextPointArcEnd));
            }
        }
    },

    // 3. Finalize
    __finalize: function(__thisObject, __currentPoint) {
        delete __thisObject.__polylineSegmentType;
        delete __thisObject.__polylineArcSegmentOption;
        delete __thisObject.__polylineCurrentArcBulgePoint;
        delete __thisObject.__polylineCurrentArcCenterPoint;
        delete __thisObject.__polylineCurrentArcSecondPoint;
        delete __thisObject.__polylineCurrentArcEndPoint;
        this.__updateAnchorPoints(__thisObject);
    },

    // 4. Analysis
    __isHitByPointer: function(__thisObject, __currentPoint, __fuzzValue) {
        return (_utils_.__isPointOnAnyVector(__thisObject.__anchorPoints, __currentPoint, __fuzzValue, (__thisObject[_parameter_.__type] === this.__polygonType)));
    },

    // 5. Update anchor points
    __updateAnchorPoints: function(__thisObject) {
        if (__thisObject[_parameter_.__option]) {
            __thisObject[_parameter_.__polygonPoints]           = _utils_.__buildRegularPolygon(__thisObject, null, 0, 0);
        }
        var __xIndex                             = 0;
        var __yIndex                             = 0;
        __thisObject.__anchorPoints              = [];
        var __arrayColumns                       = __thisObject[_parameter_.__arrayColumns]?  __thisObject[_parameter_.__arrayColumns]:  1;
        var __arrayRows                          = __thisObject[_parameter_.__arrayRows]?     __thisObject[_parameter_.__arrayRows]:     1;
        var __arrayColumnWidth                   = __thisObject[_parameter_.__arrayColumnWidth]? __thisObject[_parameter_.__arrayColumnWidth]: 0.0;
        var __arrayRowHeight                     = __thisObject[_parameter_.__arrayRowHeight]?__thisObject[_parameter_.__arrayRowHeight]:0.0;
        for (var __xIndex = 0; __xIndex < __arrayColumns; __xIndex += 1) {
            var __deltaX                         = (__xIndex * __arrayColumnWidth);
            for (var __yIndex = 0; __yIndex < __arrayRows; __yIndex += 1) {
                var __deltaY                     = (__yIndex * __arrayRowHeight);
                this.__buildPolylineAnchorPoints(__thisObject, __deltaX, __deltaY, (__thisObject[_parameter_.__type] === this.__polygonType));
            }
        }
    },
    __buildPolylineAnchorPoints: function(__thisObject, __deltaX, __deltaY, __isClosed) {
        var __polylinePoints                     = null;
        if (__thisObject[_parameter_.__polygonPoints]) {
            __polylinePoints                     = __thisObject[_parameter_.__polygonPoints];
        } else {
            __polylinePoints                     = JSON.parse(JSON.stringify(__thisObject[_parameter_.__points]));
            __polylinePoints.unshift(__thisObject[_parameter_.__origin]);
        }
        var q                                    = null;
        for (var __pointIndex = 1; __pointIndex < __polylinePoints.length; __pointIndex += 1) {
            var p                                = _utils_.__addDelta(__polylinePoints[__pointIndex - 1], __deltaX, __deltaY);
            __thisObject.__anchorPoints.push(p);
            q                                    = _utils_.__addDelta(__polylinePoints[__pointIndex], __deltaX, __deltaY);
            __thisObject.__anchorPoints.push(this.__updateCenterOrMidpoint(__thisObject, p, q));
        }
        __thisObject.__anchorPoints.push(q);
        if (__isClosed) {
            var p                                = _utils_.__addDelta(__polylinePoints[0], __deltaX, __deltaY);
            __thisObject.__anchorPoints.push(this.__updateCenterOrMidpoint(__thisObject, p, q));
        }
    },
    __updateCenterOrMidpoint: function(__thisObject, p, q) {
        if (p[_parameter_.__centerX]) {
            return {x:p[_parameter_.__centerX], y:p[_parameter_.__centerY]};
        } else {
            return _utils_.__getMidPoint(p, q);
        }
    },


        // 6. Misc.

        // Option called for: data should be a one-character string:
    __checkPolylineSegmentOption: function(__thisObject, __dataString) {
        __option                                                  = __dataString.substring(0,1);
        __option                                                  = __option.toLowerCase();
        var __optionValue                                         = null;
        if (__dataString.length > 1) {
            __dataString                                          = __dataString.substring(1);
            if (!isNaN(__dataString)) {
                __optionValue                                     = parseFloat(__dataString);
            }
        }
        var __previousPoint                           = __thisObject[_parameter_.__origin];
        if (__thisObject[_parameter_.__points].length > 0) {
            var __previousIndex                       = (__thisObject[_parameter_.__points].length - 1);
            var __previousPoint                       = __thisObject[_parameter_.__points][__previousIndex];
        }

        if (__thisObject.__polylineSegmentType === this.__polylineSegmentTypeLine) {
            if (__option === this.__polylineSegmentTypeArc) {
                __thisObject.__polylineSegmentType === this.__polylineSegmentTypeArc;
                this.__polylineArcSegmentOption                   =  this.__polylineArcSegmentOptionEnd;
            } else if (__option === this.__polylineLinearSegmentOptionLength) {
                if (__optionValue === null) {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidLinearOption));
                } else if (__previousPoint[_parameter_.__direction]) {
                    var __nextPoint = _utils_.__setDirectionPoint(__previousPoint, __previousPoint[_parameter_.__direction], value);
                    __nextPoint[_parameter_.__direction]      = __previousPoint[_parameter_.__direction];
                    __thisObject[_parameter_.__points].push(__nextPoint);
                } else {
                    _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidLinearOption));
                }
            } else {
                _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidLinearOption))
            }
        } else {
            // Arc type:
            switch(__option) {
                case this.__polylineArcSegmentOptionBulge:        this.__setPolylineSegmentArcMode(__thisObject, this.__polylineArcSegmentOptionBulge);      break;
                case this.__polylineArcSegmentOptionCenter:       this.__setPolylineSegmentArcMode(__thisObject, this.__polylineArcSegmentOptionCenter);     break;
                case this.__polylineArcSegmentOptionSecond:       this.__setPolylineSegmentArcMode(__thisObject, this.__polylineArcSegmentOptionSecond);     break;
                case this.__polylineArcSegmentOptionEnd:
                    if (__thisObject[_parameter_.__points].length > 0) {
                        this.__setPolylineSegmentArcMode(__thisObject, this.__polylineArcSegmentOptionEnd);
                    } else {
                        _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidArcOption));
                    }
                    break;
                default:                                          _events_.__callError(this.__moduleName, _messages_.__getMessage(this.__invalidArcOption));
            }
        }
    },

    __setPolylineSegmentArcMode: function(__thisObject, __mode) {
        __thisObject.__polylineSegmentType                      = this.__polylineSegmentTypeArc;
        __thisObject.__polylineArcSegmentOption                 = __mode;
        __thisObject.__polylineCurrentArcBulgePoint             = null;
        __thisObject.__polylineCurrentArcCenterPoint            = null;
        __thisObject.__polylineCurrentArcEndPoint               = null;
        __thisObject.__polylineCurrentArcSecondPoint            = null;
    },

        // polygon/polyline: check according to current segment mode:
    __checkPolylineSegmentPoint: function(__thisObject, __currentPoint) {
        var __previousPoint                                                    = __thisObject[_parameter_.__origin];
        if (__thisObject[_parameter_.__points].length > 0) {
            var __previousIndex                                                = (__thisObject[_parameter_.__points].length - 1);
            __previousPoint                                                    = __thisObject[_parameter_.__points][__previousIndex];
        }
            // Prevent overlapping points
        if (_utils_.__getDistance(__previousPoint, __currentPoint) > 0.0) {
            if (__thisObject.__polylineSegmentType === this.__polylineSegmentTypeLine) {
                if (__previousPoint[_parameter_.__direction]) {
                    __currentPoint[_parameter_.__direction]                   = __previousPoint[_parameter_.__direction];
                } else {
                    __currentPoint[_parameter_.__direction]                   = Math.atan2(__currentPoint.y - __previousPoint.y, __currentPoint.x - __previousPoint.x);
                }
                __thisObject[_parameter_.__points].push(__currentPoint);
                return true;
            } else {
                // arc mode
                switch(__thisObject.__polylineArcSegmentOption) {
                    case this.__polylineArcSegmentOptionBulge:
                        if (__thisObject.__polylineCurrentArcEndPoint === null) {
                            __thisObject.__polylineCurrentArcEndPoint          = __currentPoint;
                        } else {
                            __thisObject.__polylineCurrentArcBulgePoint        = __currentPoint;
                            this.__finalizePolylineSegment(__thisObject, __previousPoint);
                            return true;
                        }
                        break;

                    case this.__polylineArcSegmentOptionCenter:
                        if (__thisObject.__polylineCurrentArcCenterPoint === null) {
                            __thisObject.__polylineCurrentArcCenterPoint       = __currentPoint;
                        } else {
                            __thisObject.__polylineCurrentArcEndPoint          = __currentPoint;
                            this.__finalizePolylineSegment(__thisObject, __previousPoint);
                            return true;
                        }
                        break;
                    case this.__polylineArcSegmentOptionSecond:
                        if (__thisObject.__polylineCurrentArcSecondPoint === null) {
                            __thisObject.__polylineCurrentArcSecondPoint       = __currentPoint;
                        } else {
                            __thisObject.__polylineCurrentArcEndPoint          = __currentPoint;
                            this.__finalizePolylineSegment(__thisObject, __previousPoint);
                            return true;
                        }
                        break;
                    default:
                        __thisObject.__polylineCurrentArcEndPoint              = __currentPoint;
                        this.__finalizePolylineSegment(__thisObject, __previousPoint);
                        return true;
                }
            }
        }
    },
    __finalizePolylineSegment: function(__thisObject, __previousPoint) {
        var __center                                                           = null;
        if (__thisObject.__polylineCurrentArcBulgePoint) {
            __center                                                           = _utils_.__getCenterFromThreePoints(__previousPoint, __thisObject.__polylineCurrentArcBulgePoint, __thisObject.__polylineCurrentArcEndPoint);
        } else if (__thisObject.__polylineCurrentArcCenterPoint) {
            __center                                                           = __thisObject.__polylineCurrentArcCenterPoint;
            var __pointFromStartInDirection                                    = _utils_.__setDirectionPoint(__previousPoint, __previousPoint[_parameter_.__direction], 100.0);
            __center[_parameter_.__ccw]                                        = _utils_.__isCCW(__previousPoint, __pointFromStartInDirection, __thisObject.__polylineCurrentArcEndPoint);
            var __radius                                                       = _utils_.__getDistance(__previousPoint, __center);
            var __directionFromCenterToEnd                                     = Math.atan2(__thisObject.__polylineCurrentArcEndPoint.y - __center.y, __thisObject.__polylineCurrentArcEndPoint.x - __center.x);
            __thisObject.__polylineCurrentArcEndPoint                          = _utils_.__setDirectionPoint(__center, __directionFromCenterToEnd, __radius);

        } else if (__thisObject.__polylineCurrentArcSecondPoint) {
            __center                                                           = _utils_.__getCenterFromThreePoints(__previousPoint, __thisObject.__polylineCurrentArcSecondPoint, __thisObject.__polylineCurrentArcEndPoint);
        } else {
            __center                                                           = _utils_.__computeCenterFromStartEndPoints(__thisObject, __thisObject.__polylineCurrentArcEndPoint);
            var __pointFromStartInDirection                                    = _utils_.__setDirectionPoint(__previousPoint, __previousPoint[_parameter_.__direction], 100.0);
            __center[_parameter_.__ccw]                                        = _utils_.__isCCW(__previousPoint, __pointFromStartInDirection, __thisObject.__polylineCurrentArcEndPoint);
        }
        __thisObject.__polylineCurrentArcEndPoint[_parameter_.__centerX]       = __center.x;
        __thisObject.__polylineCurrentArcEndPoint[_parameter_.__centerY]       = __center.y;
        __thisObject.__polylineCurrentArcEndPoint[_parameter_.__ccw]           = __center[_parameter_.__ccw];
        var __directionFromCenterToEnd                                         = Math.atan2(__thisObject.__polylineCurrentArcEndPoint.y - __center.y, __thisObject.__polylineCurrentArcEndPoint.x - __center.x);
        if (__center[_parameter_.__ccw] ) {
            __thisObject.__polylineCurrentArcEndPoint[_parameter_.__direction] = __directionFromCenterToEnd - (Math.PI * 0.5);
        } else {
            __thisObject.__polylineCurrentArcEndPoint[_parameter_.__direction] = __directionFromCenterToEnd + (Math.PI * 0.5);
        }
        __thisObject[_parameter_.__points].push(__thisObject.__polylineCurrentArcEndPoint);
        __thisObject.__polylineCurrentArcBulgePoint                            = null;
        __thisObject.__polylineCurrentArcCenterPoint                           = null;
        __thisObject.__polylineCurrentArcEndPoint                              = null;
        __thisObject.__polylineCurrentArcSecondPoint                           = null;
        // Note: Continue with same arc mode...
    },

    /* ********************************************************************** */
    // OBJECT MODIFICATION
    __anchorEdit: function(__thisObject, __thisPointIndex, __currentPoint) {
        if (__thisPointIndex === 0) {
            // Object origin:
            __thisObject[_parameter_.__origin]             = __currentPoint;
        } else if (__thisObject[_parameter_.__sideCount]) {
            // Regular Polygon
            // TODO
        } else {
            // Line, polyline or free polygon
            // Check object for implicit array
            var __arrayColumns                   = __thisObject[_parameter_.__arrayColumns]?__thisObject[_parameter_.__arrayColumns]:1;
            var __arrayRows                      = __thisObject[_parameter_.__arrayRows]?   __thisObject[_parameter_.__arrayRows]:   1;
            var __instanceCount                  = (__arrayColumns * __arrayRows);
            var __pointsPerInstance              = (__thisObject.__anchorPoints.length / __instanceCount);
            var __instanceIndex                  = Math.floor(__thisPointIndex / __pointsPerInstance);
            var __instanceAnchorPointIndex       = (__thisPointIndex % __pointsPerInstance);
            var __isMidPoint                     = ((__instanceAnchorPointIndex % 2) === 1);
            var __instancePointIndex             = __instanceAnchorPointIndex;
            if (__isMidPoint) {
                __instancePointIndex            -= 1;
            }
            __instancePointIndex                /= 2;
            __instancePointIndex                -= 1;

            if (__instanceIndex === 0) {
                // Single/original object
                if (__isMidPoint) {
                    // Segment midpoint: move adjacent points
                    var __selectedAnchorPoint    = __thisObject.__anchorPoints[__instanceAnchorPointIndex];
                    var __deltaX                 = (__currentPoint.x - __selectedAnchorPoint.x);
                    var __deltaY                 = (__currentPoint.y - __selectedAnchorPoint.y);
                    // Move previous point
                    if (__instancePointIndex === -1) {
                        __thisObject[_parameter_.__origin] =  _utils_.__addDelta(__thisObject[_parameter_.__origin], __deltaX, __deltaY);
                    } else {
                        __thisObject[_parameter_.__points][__instancePointIndex]     = _utils_.__addDelta(__thisObject[_parameter_.__points][__instancePointIndex], __deltaX, __deltaY);
                    }
                    // Move next point
                    if ((__instancePointIndex + 1) === __thisObject[_parameter_.__points].length) {
                        __thisObject[_parameter_.__origin] = _utils_.__addDelta(__thisObject[_parameter_.__origin], __deltaX, __deltaY);
                    } else {
                        __thisObject[_parameter_.__points][__instancePointIndex + 1] = _utils_.__addDelta(__thisObject[_parameter_.__points][__instancePointIndex + 1], __deltaX, __deltaY);
                    }
                } else {
                    // Segment endpoint: move directly
                     __thisObject[_parameter_.__points][__instancePointIndex]         = __currentPoint;
                }
            } else {
                _events_.__callError(this.__moduleName, _messages_.__getMessage('anchorEditNotAuthorized'));
            }
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // ARRAY:  managed by array module

    // CHAMFER:
    __chamfer: function(__thisObject, __point0, __point1) {

    },

    // COPY: managed by edit module

    // EXPLODE:
    __explode: function(__thisObject) {
        var __polylinePoints                 = null;
        if (__thisObject[_parameter_.__sideCount]) {
            __polylinePoints                           = _utils_.__buildRegularPolygon(__thisObject, null, 0, 0);
        } else{
            __polylinePoints                           = JSON.parse(JSON.stringify(__thisObject[_parameter_.__points]));
            __polylinePoints.unshift(__thisObject[_parameter_.__origin]);
        }
        var __newObjectsData                   = [];
        for (var __pointIndex = 0; __pointIndex <= __polylinePoints.length - 2; __pointIndex += 1) {
            __newObjectsData.push({type:_line_.__lineType, origin:__polylinePoints[__pointIndex], points:[__polylinePoints[__pointIndex + 1]]});
        }
        if (__thisObject[_parameter_.__type] === this.__polygonType) {
            __newObjectsData.push({type:_line_.__lineType, origin:__polylinePoints[__polylinePoints.length - 1], points:[__polylinePoints[0]]});
        }
        return __newObjectsData;
    },

    // FILLET:
    __fillet: function(__firstObject, __secondObject, __radius) {

    },

    // MIRROR: Mirror object from vector
    __mirror: function(__thisObject, __point0, __point1) {
        __thisObject[_parameter_.__origin]                        = _utils_.__mirrorPoint(__point0, __point1, __thisObject[_parameter_.__origin]);
        for (var __pointIndex = 0; __pointIndex < __thisObject[_parameter_.__points].length; __pointIndex += 1) {
            __thisObject[_parameter_.__points][__pointIndex]        = _utils_.__mirrorPoint(__point0, __point1, __thisObject[_parameter_.__points][__pointIndex]);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // MOVE: Move object
    __move: function(__thisObject, __displacement) {
        __thisObject[_parameter_.__origin]                           = _utils_.__movePoint(__thisObject[_parameter_.__origin], __displacement);
        for (var __pointIndex = 0; __pointIndex < __thisObject[_parameter_.__points].length; __pointIndex += 1) {
            __thisObject[_parameter_.__points][__pointIndex]         = _utils_.__movePoint(__thisObject[_parameter_.__points][__pointIndex], __displacement);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // OFFSET:
    __offset: function(__thisObject, __offsetPoint, __offset) {
        if (__offset) {
            
        } else {
            // Object must pass through offset point
        }
    },
    
    // ROTATE: Rotate object around origin
    __rotate: function(__thisObject, __thisAnchorPoint, __thisAngle) {
        __thisObject[_parameter_.__origin]                           = _utils_.__rotatePoint(__thisObject[_parameter_.__origin], __thisAnchorPoint, __thisAngle);
        for (var __pointIndex = 0; __pointIndex < __thisObject[_parameter_.__points].length; __pointIndex += 1) {
            __thisObject[_parameter_.__points][__pointIndex]         = _utils_.__rotatePoint(__thisObject[_parameter_.__points][__pointIndex], __thisAnchorPoint, __thisAngle);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // SCALE: Scale object: scales each point in turn.
    __scale: function(__thisObject, __anchorPoint, __thisScale) {
        __thisObject[_parameter_.__origin]                           = _utils_.__scalePoint(__thisObject[_parameter_.__origin], __anchorPoint, __thisScale);
        for (var __pointIndex = 0; __pointIndex < __thisObject[_parameter_.__points].length; __pointIndex += 1) {
            __thisObject[_parameter_.__points][__pointIndex]         = _utils_.__scalePoint(__thisObject[_parameter_.__points][__pointIndex], __anchorPoint, __thisScale);
        }
        this.__updateAnchorPoints(__thisObject);
    },

    // STRETCH
    __stretch: function(__thisObject, __area, __directionVector) {
        if (area) {
            this.__stretchMany(points, __area, from, to);
        } else {
            this.__stretchSingle(points, __area, from, to);
        }
        this.__updateAnchorPoints(__thisObject);
    },
    __stretchMany: function(__points, __area, __from, __to) {
            // Compute displacement
        var __deltaX                             = (__to.x - __from.x);
        var __deltaY                             = (__to.y - __from.y);
             // Scan each point: stretch by displacement when within area
        for (var __pointIndex = 0; __pointIndex < __points.length; __pointIndex += 1) {
            var p                                = __points[__pointIndex];
            if ((__area.x < p.x) && (p.x < (__area.x + __area[_parameter_.__width]))) {
                if ((__area.y < p.y) && (p.y < (__area.y + __area[_parameter_.__height]))) {
                    __points[__pointIndex]           = {x:(p.x + __deltaX), y:(p.y + __deltaY)};
                }
            }
        };
        return __points;
    },
        // Stretch Single is used to move one of the points.
    __stretchSingle: function(__points, __area, __fromPoint, __toPoint) {
        // TODO
        var __pointIndex                           = _utils_.__getNearestPoint(__points, __fromPoint);
        __points[__pointIndex]                     = {x:__toPoint.x, y:__toPoint.y};
        return __points;
    },
    
    // Trim: Stretch is used to move one of the two points.
    __trim: function(__thisObject, __firstPoint, __secondPoint, __sidePoint) {
        // TODO
        this.__updateAnchorPoints(__thisObject);
    },
};
