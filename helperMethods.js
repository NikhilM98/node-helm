const YAML = require('yaml')

const flattenValuesToString = function (values) {
    var valuesString = '';
    for (var valueSet in values) {
        if (values.hasOwnProperty(valueSet)) {
            if (Array.isArray(values[valueSet])) {
                valuesString += `${valueSet}=${flattenArrayToString(values[valueSet])},`;
            } else if (typeof values[valueSet] == "object") {
                valuesString += flattenObjectToString(values[valueSet], `${valueSet}`)
            } else {
                valuesString += `${valueSet}=${values[valueSet]},`;
            }
        }
    }
    return valuesString;
};

const flattenObjectToString = function (obj, index = null) {
    var objString = '';
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (Array.isArray(obj[i])) {
            objString += `${index ? index + '.' : ''}${i}=${flattenArrayToString(obj[i])},`;
        } else if (typeof obj[i] == "object") {
            objString += `${flattenObjectToString(obj[i], `${index ? index + '.' : ''}${i}`)}`
        } else {
            objString += `${index ? index + '.' : ''}${i}=${obj[i]},`;
        }
    }
    return objString;
}

const flattenArrayToString = function (arr) {
    if(arr.length === 0) return ''

    var arrString = '{';

    for (var i in arr) {
        if (!arr.hasOwnProperty(i)) continue;
        arrString += `${arr[i]}`;
        if (parseInt(i) !== arr.length - 1) arrString += ',';
    }
    arrString += '}'

    return arrString;
}

const flattenObject = function (obj) {
    var toReturn = {};
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;

        if (typeof obj[i] == "object") {
            var flatObject = flattenObject(obj[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + "." + x] = flatObject[x];
            }
        } else {
            toReturn[i] = obj[i];
        }
    }
    return toReturn;
};

function parseResponseToJson(rawData) {
    try {
        var parsedDocuments = YAML.parseAllDocuments(rawData);
        var jsonData = [];
        if (typeof parsedDocuments == "object") {
            for (var i=0; i<parsedDocuments.length; i++) {
                jsonData.push(parsedDocuments[i].toJSON());
            }
        }
        return jsonData;
    }
    catch(e) {
        console.log("could not parse helm response with error: " + e.message);
        //ignore
        return rawData;
    }
}

function parseJson(rawData) {
    try {
        var jsonData = JSON.parse(rawData);
        return jsonData;
    }
    catch(e) {
        console.log("could not parse helm response with error: " + e.message);
        return rawData;
    }
}

module.exports = {
    flattenValuesToString : flattenValuesToString,
    flattenObject : flattenObject,
    parseResponseToJson : parseResponseToJson,
    parseJson : parseJson
};
