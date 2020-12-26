//Converts a string to a list, splitting it by a separator
var stringToList = function (listAsString, separator) {
    if (separator === void 0) {
        separator = ',';
    }
    return listAsString ? listAsString.split(separator) : [];
};

//Checks if the list contains at least of item of a  specific list  
var containsAtLeastOne = function (groupList, specificList) {    
    return specificList.length === 0 || groupList.some(function (item) {        
        return specificList.includes(item);
    });
};

module.exports.stringToList = stringToList;
module.exports.containsAtLeastOne = containsAtLeastOne;
