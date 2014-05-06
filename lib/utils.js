// transform an object or arrays into a single flat array 
function flattenPathObject(PathObjectObj) {
    var arr = [];

    if (PathObjectObj && 'object' === typeof PathObjectObj) {
        Object.keys(PathObjectObj).forEach(function(key) {
            PathObjectObj[key].forEach(function(path) {
                arr.push(path);
            })
        })
    }
    return arr;
}

// check if the pattern is a single string or an array of string
function isGlob(pattern) {

    var isString = function isString(element, index, array) {
        return ('string' === typeof element);
    };

    if (!pattern) {
        return;
    } else if (isString(pattern)) {
        return true;
    } else if (Array.isArray(pattern) && pattern.every(isString)) {
        return true;
    } else {
        return;
    }

}

module.exports = {
    flattenPathObject: flattenPathObject,
    isGlob: isGlob
}