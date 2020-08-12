var utils = {};

utils.getFields = function(obj, keys) {
  var finalObj = {};
  for(i in keys) {
    var key = keys[i];
    var val = obj[key];
    if(val != undefined) {
      finalObj[key] = val;
    }
  }

  return finalObj;
}

utils.isValidPassword = function(password) {
	if(password == "" || password == undefined) {
		return false
  	}
	return true
}

module.exports = utils;