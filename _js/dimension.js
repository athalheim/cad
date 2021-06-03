var _dimension_ = {

    // Properties:
    __moduleName:             '_dimension_',

    __linearType:             'linear',
    __alignedType:            'aligned',
    __angularType:            'angular',
    __radialType:             'radial',

    __arcType:                'arc',
    __lineType:               'line',
    __textType:               'text',

    __currentDimObject:       null,
    __parameterNames:         null,
    __parameterTypes:         null,
    __parameterIndex:         null,

    __selectedDimension:      null,
    __editedParameterName:    null,
    __computedPoints:         null,

    __chooseDimensionType: function() {
        _inputSelect_.__selectObjectByType(this.__moduleName, Object.keys(this.__parameterObject), '_dimension_.__initializeAddDimension(__inputValue);');
     },

  
    __parameterObject: {
        linear:{
            __parameterNames: [_parameter_.__firstPoint,         _parameter_.__secondPoint,        _parameter_.__dimensionLocation],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        },
        aligned: {
            __parameterNames: [_parameter_.__firstPoint,         _parameter_.__secondPoint,        _parameter_.__dimensionLocation],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        },
        angular:{
            __parameterNames: [_parameter_.__center,             _parameter_.__firstPoint,         _parameter_.__secondPoint,        _parameter_.__dimensionLocation],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        },
        radial:{
            __parameterNames: [_parameter_.__center,             _parameter_.__radiusPoint,        _parameter_.__dimensionLocation],
            __parameterTypes: [_parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint, _parameter_.__parameterTypePoint],
        }
    },
    __parameterName:          null,
    __parameterType:          null,
    __parameterIndex:         null,

    __dimensionDrawingParameters: {
        __parameterNames:     [_parameter_.__dimensionFontSize,                             _parameter_.__dimensionFontName,          _parameter_.__dimensionColor],
        __parameterTypes:     [_parameter_.__parameterTypeNumeric,                          _parameter_.__parameterTypeString,        '_utils_.__colorList'],
        __parameterValues:    ['_model_[_parameter_.__dimension][_parameter_.__fontSize]', '_user_[_parameter_.__dimensionFontName]', '_user_[_parameter_.__dimensionColor]'],
    },

    /* ***************************************************************************** */
    // Construction Procedures:
    __initializeAddDimension: function(__type) {
        _anchor_.__isSnapToAnchor                = true;
        this.__currentDimObject                  = {
                                                    type:  __type,
                                                    id:    '',
                                                    layer: _model_[_parameter_.__layer],
                                                   };
        var __parameterObject                    = this.__parameterObject[__type];
        this.__parameterNames                    = __parameterObject.__parameterNames;
        this.__parameterTypes                    = __parameterObject.__parameterTypes;
        this.__parameterIndex                    = -1;
        _view_.__setTouchEventsFunctionString(
            '_dimension_.__addDimensionParameter(this.__touchStartLocation, _view_.__fuzzValue)',
            '_track_.__trackEntry(_dimension_.__moduleName, this.__modelLocation);',
            '_dimension_.__addDimensionParameter(this.__modelLocation, _view_.__fuzzValue);',
            '_dimension_.__cancel()',
        );
        this.__setNextAddDimensionInput();
        _inputSingle_.__initializeInput(this.__moduleName, this.__currentDimObject, this.__parameterName, this.__parameterType);
    },
    __setNextAddDimensionInput: function() {
        this.__parameterIndex                   += 1;
        this.__parameterName                     = this.__parameterNames[this.__parameterIndex];
        this.__parameterType                     = this.__parameterTypes[this.__parameterIndex];
        _inputSingle_.__setParameterInput(this.__parameterName, this.__parameterType);
    },
    __addDimensionParameter: function(__data, __fuzzValue) {
        switch(this.__currentDimObject[_parameter_.__type]) {
            case _dimension_.__alignedType:
            case _dimension_.__linearType:
                // firstPoint, secondPoint, dimensionLocation
                if (this.__parameterName === _parameter_.__dimensionLocation) {
                    if ((_utils_.__getDistance(this.__currentDimObject[_parameter_.__firstPoint], __data) > __fuzzValue) &&
                        (_utils_.__getDistance(this.__currentDimObject[_parameter_.__secondPoint], __data) > __fuzzValue)) {
                            this.__currentDimObject[this.__parameterName] = __data;
                        }
                } else if (this.__parameterName === _parameter_.__secondPoint) {
                    if (_utils_.__getDistance(this.__currentDimObject[_parameter_.__firstPoint], __data) > __fuzzValue) {
                        this.__currentDimObject[this.__parameterName] = __data;
                    }
                } else {
                    this.__currentDimObject[this.__parameterName] = __data;
                }
                break;
            case _dimension_.radial:
                // center, radiusPoint, dimensionLocation
                if (this.__parameterName === _parameter_.__dimensionLocation) {
                    if ((_utils_.__getDistance(this.__currentDimObject[_parameter_.__center], __data) > __fuzzValue) &&
                        (_utils_.__getDistance(this.__currentDimObject[_parameter_.__radiusPoint], __data) > __fuzzValue)) {
                            this.__currentDimObject[this.__parameterName] = __data;
                        }
                } else if (this.__parameterName === _parameter_.__secondPoint) {
                    if (_utils_.__getDistance(this.__currentDimObject[_parameter_.__center], __data) > __fuzzValue) {
                        this.__currentDimObject[this.__parameterName] = __data;
                    }
                } else {
                    this.__currentDimObject[this.__parameterName] = __data;
                }
                break;
            default:
                // center, firstPoint, secondPoint, dimensionLocation
                if (this.__parameterName === _parameter_.__dimensionLocation) {
                    if ((_utils_.__getDistance(this.__currentDimObject[_parameter_.__center], __data) > __fuzzValue) &&
                        (_utils_.__getDistance(this.__currentDimObject[_parameter_.__firstPoint], __data) > __fuzzValue) &&
                        (_utils_.__getDistance(this.__currentDimObject[_parameter_.__secondPoint], __data) > __fuzzValue)) {
                            this.__currentDimObject[this.__parameterName] = __data;
                        }
                } else if (this.__parameterName === _parameter_.__secondPoint) {
                    if ((_utils_.__getDistance(this.__currentDimObject[_parameter_.__center], __data) > __fuzzValue) &&
                        (_utils_.__getDistance(this.__currentDimObject[_parameter_.__firstPoint], __data) > __fuzzValue)) {
                            this.__currentDimObject[this.__parameterName] = __data;
                        }
                } else if (this.__parameterName === _parameter_.__firstPoint) {
                    if (_utils_.__getDistance(this.__currentDimObject[_parameter_.__center], __data) > __fuzzValue) {
                        this.__currentDimObject[this.__parameterName] = __data;
                    }
                } else {
                    this.__currentDimObject[this.__parameterName] = __data;
                }
            }
        if (this.__parameterIndex === (this.__parameterNames.length - 1)) {
            this.__finalizeAddDimension();
        } else {
            this.__setNextAddDimensionInput();
        }
    },
    __finalizeAddDimension: function() {
        this.__currentDimObject.__computedPoints = this.__computeDimensionPoints(this.__currentDimObject);
        var __thisId                             = _utils_.__buildId(_model_[_parameter_.__dimension][_parameter_.__list]);
        _model_[_parameter_.__dimension][_parameter_.__list][__thisId]         = this.__currentDimObject;
        this.__cancel();
    },


    /* ***************************************************************************** */
    // Graphic Edit
    __initializeDimensionSelect: function() {
        var __dimensionKeys                        = Object.keys(_model_[_parameter_.__dimension][_parameter_.__list]);
        if (__dimensionKeys.length === 1) {
            this.__selectedDimension             = _model_[_parameter_.__dimension][_parameter_.__list][__dimensionKeys[0]];
            this.__editSelectedDimensionByParameter();
        } else {
            _view_.__setTouchEventsFunctionString(
                '',
                '',
                '_dimension_.__selectDimensionByLocation(this.__modelLocation);',
                '_dimension_.__cancel',
            );
        }
    },
    __selectDimensionByLocation: function(__currentPoint) {
        var __thisId                             = this.__getNearestDimensionObjectId(__currentPoint);
        this.__selectedDimension                 = _model_[_parameter_.__dimension][_parameter_.__list][__thisId];
        this.__editSelectedDimensionByParameter();
    },
    __editSelectedDimensionByParameter: function() {
        _anchor_.__isSnapToAnchor                = true;
        _view_.__setTouchEventsFunctionString(
            '_dimension_.__identifyDimensionParameter(this.__modelLocation, this.__fuzzValue);',
            '_track_.__trackEntry(_dimension_.__moduleName, this.__modelLocation);',
            '_dimension_.__updateDimensionParameter(this.__modelLocation);',
            '_dimension_.__cancel',
        );
    },
    __identifyDimensionParameter: function(__currentPoint, __fuzzValue) {
        $.each( [_parameter_.__firstPoint, _parameter_.__secondPoint, _parameter_.__center, _parameter_.__radiusPoint, _parameter_.__dimensionLocation], function( __parameterIndex, __parameterName ) {
            if (_dimension_.__selectedDimension[__parameterName]) {
                if (_utils_.__getDistance(_dimension_.__selectedDimension[__parameterName], __currentPoint) < __fuzzValue) {
                    _dimension_.__editedParameterName  = __parameterName;
                    return false;
                }
            }
        });
    },
    __updateDimensionParameter: function(__currentPoint) {
        this.__selectedDimension[this.__editedParameterName] = __currentPoint;
        this.__selectedDimension.__computedPoints = this.__computeDimensionPoints(this.__selectedDimension);
        this.__editedParameterName                = null;
        _paint_.__paintEntry();
    },


    /* ***************************************************************************** */
    // Edition by Table Procedures
    __initializeDimensionEditByTable: function() {
        var __dimensionKeys                      = Object.keys(_model_[_parameter_.__dimension][_parameter_.__list]);
        if (__dimensionKeys.length === 1) {
            this.__editDimensionByTable(__dimensionKeys[0]);
        } else {
            _view_.__setTouchEventsFunctionString(
                '',
                '',
                '_dimension_.__selectEditDimensionByTable(this.__modelLocation);',
                '_dimension_.__cancel',
            );
        }
    },
    __selectEditDimensionByTable: function(__currentPoint) {
        var dimensionId                          = this.__getNearestDimensionObjectId(__currentPoint);
        this.__editDimensionByTable(dimensionId);
    },
    __editDimensionByTable: function(__thisDimensionId) {
        this.__currentDimObject                  = _model_[_parameter_.__dimension][_parameter_.__list][__thisDimensionId];
        var __message                              = _messages_.__getMessage(this.__moduleName);
        _inputMultiple_.__setMultipleInput(__message, this.__parameterObject[this.__currentDimObject[_parameter_.__type]], this.__currentDimObject, '_dimension_.__finalizeEditDimensionByTable(__parameterValues)');
    },
    __finalizeEditDimensionByTable: function(__parameterValues) {
        $.each(__parameterValues , function(__parameterName, __parameterValue) {
            this.__currentDimObject[__parameterName]    = __parameterValue;
        });
        this.__currentDimObject.__computedPoints = this.__computeDimensionPoints(this.__currentDimObject);
        this.__cancel();
    },


    /* ***************************************************************************** */
    // Deletion Procedures
    __initializeDelete: function() {
        var __dimensionKeys                      = Object.keys(_model_[_parameter_.__dimension][_parameter_.__list]);
        if (__dimensionKeys.length === 1) {
            _model_[_parameter_.__dimension][_parameter_.__list]               = {};
            _paint_.__paintEntry();
        } else {
            _view_.__setTouchEventsFunctionString(
                '',
                '',
                '_dimension_.__deleteDimension(this.__modelLocation);',
                '_dimension_.__cancel',
            );
        }
    },
    __deleteDimension: function(__currentPoint) {
        var __dimensionId                          = this.__getNearestDimensionObjectId(__currentPoint);
        delete _model_[_parameter_.__dimension][_parameter_.__list][__dimensionId];
        _paint_.__paintEntry();
    },
    __clearDimensions: function() {
        $.each(_model_[_parameter_.__dimension][_parameter_.__list] , function(__thisDimensionId, __thisDimension) {
            delete _model_[_parameter_.__dimension][_parameter_.__list][__thisDimensionId];
        });
        _paint_.__paintEntry();
    },


    /* ***************************************************************************** */
    // On-screen dimension select
    __getNearestDimensionObjectId: function(__currentPoint) {
        var __strikeDistance                       = _model_[_parameter_.__limits][_parameter_.__width];
        var __dimensionId                          = '';
        $.each(_model_[_parameter_.__dimension][_parameter_.__list] , function(__thisDimensionId, __thisDimension) {
            var __distanceToThisDimension          = _utils_.__getDistance(__currentPoint, __thisDimension[_parameter_.__dimensionLocation]);
            if (__distanceToThisDimension < __strikeDistance) {
                __strikeDistance                   = __distanceToThisDimension;
                __dimensionId                      = __thisDimensionId;
            }
        });
        return __dimensionId;
    },


    /* ***************************************************************************** */
    // Dimension Parameters Procedures

    __showDimensionParameters: function() {
        var __message                              = _messages_.__getMessage(this.__moduleName);
        _inputMultiple_.__setMultipleInput(__message, this.__dimensionDrawingParameters, null, '_dimension_.__setDimensionParameters(__parameterValues)');
    },
    __setDimensionParameters: function(__parameterValues) {
        _model_[_parameter_.__dimension][_parameter_.__fontSize]                 = __parameterValues.dimensionFontSize;
        _userTools_.__setUserParameter(_parameter_.__dimensionColor,    __parameterValues[_parameter_.__dimensionColor]);
        _userTools_.__setUserParameter(_parameter_.__dimensionFontName, __parameterValues[_parameter_.__dimensionFontName]);
        _model_[_parameter_.__dimension][_parameter_.__color]                    = __parameterValues[_parameter_.__dimensionColor];
        _model_[_parameter_.__dimension][_parameter_.__fontName]                 = __parameterValues[_parameter_.__dimensionFontName];
    },


    /* ***************************************************************************** */
    // Compute dimension points for faster paint
    __computeDimensionPoints: function(__thisDimension) {
        switch(__thisDimension[_parameter_.__type]) {
            case this.__linearType:              return this.__computeLinearDimensionPoints(__thisDimension);
            case this.__alignedType:             return this.__computeAlignedDimensionPoints(__thisDimension);
            case this.__angularType:             return this.__computeAngularDimensionPoints(__thisDimension);
            default:                             return this.__computeRadialDimensionPoints(__thisDimension);
        }
    },
    __computeLinearDimensionPoints: function(__thisDimension, __currentPoint) {
        var __overlap                              = (_model_[_parameter_.__dimension][_parameter_.__fontSize] * 0.5);
        var __dimensionLocation                    = __thisDimension[_parameter_.__dimensionLocation];
        if (__currentPoint) {
            __dimensionLocation                    = __currentPoint;
        }
        // 1. Common part: get data
        var __midPoint                             = _utils_.__getMidPoint(__thisDimension[_parameter_.__firstPoint], __thisDimension[_parameter_.__secondPoint]);
        var __dimensionToMidpointX                 = Math.abs(__dimensionLocation.x - __midPoint.x);
        var __dimensionToMidpointY                 = Math.abs(__dimensionLocation.y - __midPoint.y);
        // 2. Specific part: according to direction
        var __directionToDimension                 = 0.0;
        var __dimensionFirstPoint                  = null;
        var __dimensionSecondPoint                 = null;
        var __distanceFirstToSecond                = '';
        var __textSpacing                          = 0;

        if (__dimensionToMidpointX >= __dimensionToMidpointY) {
            // Dimension located either left or right of points: Vertical dimension
            if (__midPoint.x > __dimensionLocation.x) {
                __directionToDimension             = Math.PI;
            }
            __dimensionFirstPoint                  = {x:__dimensionLocation.x, y:__thisDimension[_parameter_.__firstPoint].y};
            __dimensionSecondPoint                 = {x:__dimensionLocation.x, y:__thisDimension[_parameter_.__secondPoint].y};
            // Distance to measure: Vertical
            __distanceFirstToSecond                = Math.abs(__thisDimension[_parameter_.__firstPoint].y - __thisDimension[_parameter_.__secondPoint].y);
        } else {
            // Dimension located either above or below points: Horizontal dimension

            __directionToDimension                 = (Math.PI * 0.5);
            if (__midPoint.y > __dimensionLocation.y) {
                __directionToDimension             = (Math.PI * 1.5);
            }
            __dimensionFirstPoint                  = {x:__thisDimension[_parameter_.__firstPoint].x,  y:__dimensionLocation.y};
            __dimensionSecondPoint                 = {x:__thisDimension[_parameter_.__secondPoint].x, y:__dimensionLocation.y};
            // Distance to measure: Horizontal
            __distanceFirstToSecond                = Math.abs(__thisDimension[_parameter_.__firstPoint].x - __thisDimension[_parameter_.__secondPoint].x);
        }
        // Common part: paint dimension
            //  Formatted dimension text
        var __distanceFirstToSecondText            = _unit_.__getLengthExpression(__distanceFirstToSecond);
        if (__dimensionToMidpointX >= __dimensionToMidpointY) {
            var __textWidth                        = _utils_.__getTextWidth(_model_[_parameter_.__dimension][_parameter_.__fontName], _model_[_parameter_.__dimension][_parameter_.__fontSize],  __distanceFirstToSecondText);
            __textSpacing                          = (__textWidth * 0.5) + __overlap;
        } else {
            __textSpacing                          = _model_[_parameter_.__dimension][_parameter_.__fontSize] + __overlap;
        }
            // Locate dimension text
        var __dimensionTextPoint                   = _utils_.__getMidPoint(__dimensionFirstPoint, __dimensionSecondPoint);
            // Leader 1
        var __firstPointLeader                     = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__firstPoint],    __directionToDimension, __overlap);
        var __firstPointDimLeader                  = _utils_.__setDirectionPoint(__dimensionFirstPoint, __directionToDimension, __overlap);
            // Leader 2
        var __secondPointLeader                    = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__secondPoint],    __directionToDimension, __overlap);
        var __secondPointDimLeader                 = _utils_.__setDirectionPoint(__dimensionSecondPoint, __directionToDimension, __overlap);
            // Dimension Line
        var __dimensionLineDirection               = Math.atan2((__dimensionSecondPoint.y - __dimensionFirstPoint.y), (__dimensionSecondPoint.x - __dimensionFirstPoint.x));
            //   Part 1
        var __dimLineFirstLeader                   = _utils_.__setDirectionPoint(__dimensionFirstPoint, (__dimensionLineDirection - Math.PI), __overlap);
        var __dimLineFirstText                     = _utils_.__setDirectionPoint(__dimensionTextPoint,  (__dimensionLineDirection - Math.PI), __textSpacing);
            //   Part 2
        var __dimLineSecondLeader                  = _utils_.__setDirectionPoint(__dimensionSecondPoint, __dimensionLineDirection,            __overlap);
        var __dimLineSecondText                    = _utils_.__setDirectionPoint(__dimensionTextPoint,   __dimensionLineDirection,            __textSpacing);
        return [
            [this.__lineType, __firstPointLeader,   __firstPointDimLeader],
            [this.__lineType, __secondPointLeader,  __secondPointDimLeader],
            [this.__lineType, __dimLineFirstLeader, __dimLineFirstText],
            [this.__lineType, __dimLineSecondText,  __dimLineSecondLeader],
            [this.__textType, __dimensionTextPoint, __distanceFirstToSecondText],
        ];
    },
    __computeAlignedDimensionPoints: function(__thisDimension, __currentPoint) {
        var __overlap                              = (_model_[_parameter_.__dimension][_parameter_.__fontSize] * 0.5);
        var __dimensionLocation                    = __thisDimension[_parameter_.__dimensionLocation];
        if (__currentPoint) {
            __dimensionLocation                    = __currentPoint;
        }
        // Dimension follows object
        var __intersectionPoint                    = _utils_.__getPointPerpendicularToVector(__thisDimension[_parameter_.__firstPoint], __thisDimension[_parameter_.__secondPoint], __dimensionLocation);
        var __directionFirstToSecond               = Math.atan2((__thisDimension[_parameter_.__secondPoint].y - __thisDimension[_parameter_.__firstPoint].y), (__thisDimension[_parameter_.__secondPoint].x - __thisDimension[_parameter_.__firstPoint].x));
        var __directionToDimension                 = Math.atan2((__dimensionLocation.y - __intersectionPoint.y), (__dimensionLocation.x - __intersectionPoint.x));
        var __distanceToDimension                  = _utils_.__getDistance(__intersectionPoint, __dimensionLocation);
        var __dimensionFirstPoint                  = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__firstPoint],  __directionToDimension, __distanceToDimension);
        var __dimensionSecondPoint                 = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__secondPoint], __directionToDimension, __distanceToDimension);
        var __dimensionTextPoint                   = _utils_.__getMidPoint(__dimensionFirstPoint, __dimensionSecondPoint);
            // Leader 1
        var __firstPointLeader                     = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__firstPoint],    __directionToDimension, __overlap);
        var __firstPointDimLeader                  = _utils_.__setDirectionPoint(__dimensionFirstPoint, __directionToDimension, __overlap);
            // Leader 2
        var __secondPointLeader                    = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__secondPoint],    __directionToDimension, __overlap);
        var __secondPointDimLeader                 = _utils_.__setDirectionPoint(__dimensionSecondPoint, __directionToDimension, __overlap);
            // Dimension Line
            //   Part 1
        var __dimLineFirstLeader                   = _utils_.__setDirectionPoint(__dimensionFirstPoint, (__directionFirstToSecond - Math.PI), __overlap);
        var __dimLineFirstText                     = _utils_.__setDirectionPoint(__dimensionTextPoint,  (__directionFirstToSecond - Math.PI), _model_[_parameter_.__dimension][_parameter_.__fontSize]);
            //   Part 2
        var __dimLineSecondLeader                  = _utils_.__setDirectionPoint(__dimensionSecondPoint, __directionFirstToSecond,            __overlap);
        var __dimLineSecondText                    = _utils_.__setDirectionPoint(__dimensionTextPoint,   __directionFirstToSecond,            _model_[_parameter_.__dimension][_parameter_.__fontSize]);
            // Dimension Text
        var __distanceFirstToSecond                = _utils_.__getDistance(__thisDimension[_parameter_.__firstPoint], __thisDimension[_parameter_.__secondPoint]);
        var __distanceFirstToSecondText            = _unit_.__getLengthExpression(__distanceFirstToSecond);
         return [
            [this.__lineType, __firstPointLeader, __firstPointDimLeader],
            [this.__lineType, __secondPointLeader, __secondPointDimLeader],
            [this.__lineType, __dimLineFirstLeader, __dimLineFirstText],
            [this.__lineType, __dimLineSecondText, __dimLineSecondLeader],
            [this.__textType, __dimensionTextPoint, __distanceFirstToSecondText],
        ];
    },
    __computeAngularDimensionPoints: function(__thisDimension, __currentPoint) {
        var __overlap                              = (_model_[_parameter_.__dimension][_parameter_.__fontSize] * 0.5);
        var __dimensionLocation                    = __thisDimension[_parameter_.__dimensionLocation];
        if (__currentPoint) {
            __dimensionLocation                    = __currentPoint;
        }
        // Directions
        var __directionToFirstPoint                = Math.atan2((__thisDimension[_parameter_.__firstPoint].y - __thisDimension[_parameter_.__center].y), (__thisDimension[_parameter_.__firstPoint].x - __thisDimension[_parameter_.__center].x));
        var __directionToSecondPoint               = Math.atan2((__thisDimension[_parameter_.__secondPoint].y - __thisDimension[_parameter_.__center].y), (__thisDimension[_parameter_.__secondPoint].x - __thisDimension[_parameter_.__center].x));
        var __directionToText                      = (__directionToFirstPoint + __directionToSecondPoint) * 0.5;
        // Radius
        var __radius                               = _utils_.__getDistance(__thisDimension[_parameter_.__center], __dimensionLocation);
        // Leader 1
        var __dimensionFirstPoint                  = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__firstPoint],  __directionToFirstPoint, __overlap);
        var __firstPointDimOverlap                 = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__center],      __directionToFirstPoint, __radius + __overlap);
        // Leader 2
        var __dimensionSecondPoint                 = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__secondPoint], __directionToSecondPoint, __overlap);
        var __secondPointDimOverlap                = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__center],      __directionToSecondPoint, __radius + __overlap);
        var __computedPoints                       = [
                                                        [this.__lineType, __dimensionFirstPoint, __firstPointDimOverlap],
                                                        [this.__lineType, __dimensionSecondPoint, __secondPointDimOverlap],
                                                     ];
        // Arcs
        var __overlapArc                           = Math.atan(__overlap / __radius);
        var __coveredAngleRadian                   = (__directionToSecondPoint - __directionToFirstPoint);
        if (__coveredAngleRadian < 0.0) {
            __coveredAngleRadian                   = (__directionToFirstPoint - __directionToSecondPoint);
            __computedPoints.push([this.__arcType, __thisDimension[_parameter_.__center], __radius, (__directionToSecondPoint - __overlapArc), (__directionToText - __overlapArc)]);
            __computedPoints.push([this.__arcType, __thisDimension[_parameter_.__center], __radius, (__directionToText + __overlapArc), (__directionToFirstPoint  + __overlapArc)]);
        } else {
            __computedPoints.push([this.__arcType, __thisDimension[_parameter_.__center], __radius, (__directionToFirstPoint  - __overlapArc), (__directionToText - __overlapArc)]);
            __computedPoints.push([this.__arcType, __thisDimension[_parameter_.__center], __radius, (__directionToText  + __overlapArc), (__directionToSecondPoint + __overlapArc)]);
        }
        // Text
        var __coveredAngleDegree                   = (_utils_.__roundValue(__coveredAngleRadian / Math.PI) * 180.0);

        var __dimensionTextPoint                   = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__center], __directionToText, __radius);
        __computedPoints.push([this.__textType, __dimensionTextPoint, __coveredAngleDegree + 'd']);
        return __computedPoints;
    },
    __computeRadialDimensionPoints: function(__thisDimension, __currentPoint) {
        var __overlap                              = _model_[_parameter_.__dimension][_parameter_.__fontSize];
            // Draw center cross:
        var __delta                                = (_model_[_parameter_.__dimension][_parameter_.__fontSize] * 2.0);
        var __radius                               = _utils_.__getDistance(__thisDimension[_parameter_.__center], __thisDimension[_parameter_.__radiusPoint]);
        var __dimensionLocation                    = __thisDimension[_parameter_.__dimensionLocation];
        if (__currentPoint) {
            __dimensionLocation                    = __currentPoint;
        }
        var __radiusText                           = '\u2300' + _unit_.__getLengthExpression(__radius);
        var __textWidth                            = _utils_.__getTextWidth(_model_[_parameter_.__dimension][_parameter_.__fontName], _model_[_parameter_.__dimension][_parameter_.__fontSize], __radiusText);
        var __directionToDimensionPoint            = Math.atan2((__dimensionLocation.y - __thisDimension[_parameter_.__center].y), (__dimensionLocation.x - __thisDimension[_parameter_.__center].x));
        var __radialTextMargin                     = (((__textWidth * 0.5) * Math.cos(__directionToDimensionPoint)) + __overlap);
        var __distanceToDimensionPoint             = _utils_.__getDistance(__dimensionLocation, __thisDimension[_parameter_.__center]);
        var __borderPointOverlap                   = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__center], __directionToDimensionPoint, __radius + __overlap);
        var __dimensionLocationOverlap             = _utils_.__setDirectionPoint(__thisDimension[_parameter_.__center], __directionToDimensionPoint, __distanceToDimensionPoint - __radialTextMargin);
        return [
                [this.__lineType,  {x:__thisDimension[_parameter_.__center].x + __delta, y:__thisDimension[_parameter_.__center].y},         {x:__thisDimension[_parameter_.__center].x - __delta, y:__thisDimension[_parameter_.__center].y}],
                [this.__lineType,  {x:__thisDimension[_parameter_.__center].x,         y:__thisDimension[_parameter_.__center].y + __delta}, {x:__thisDimension[_parameter_.__center].x,         y:__thisDimension[_parameter_.__center].y - __delta}],
                [this.__lineType,  __borderPointOverlap, __dimensionLocationOverlap],
                [this.__textType, __dimensionLocation,  __radiusText],
            ];
    },


    /* ***************************************************************************** */
    __cancel: function() {
        _view_.__resetTouchEventsFunctionString();
        this.__selectedDimension                  = null;
        this.__editedParameterName                = null;
        this.__currentDimObject                   = null;
        this.__parameterNames                     = null;
        this.__parameterTypes                     = null;
        this.__parameterIndex                     = null;
        this.__parameterName                      = null;
        this.__parameterType                      = null;
        _tooltip_.__hideTooltip();
        _inputSingle_.__resetInput();
        _paint_.__paintEntry();
    },

};
