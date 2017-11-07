if (typeof window == "undefined") {
	window = global;
}

var getMappedAddr = function (url) {
	var addrMap = {
		"http://test.com": ["localhost:3000", "127.0.0.1:3000", "192.168.0.24:3000"]
	};
	var _getMappedAddr = function (originalUrl) {
		var key = null, i = null, searchFlag = true, result = null;
		for (key in addrMap) {
			if (addrMap.hasOwnProperty(key) && searchFlag) {
				value = addrMap[key];
				if (Object.prototype.toString.call(value) == '[object Array]') {
					for (i = 0; i < value.length; i++) {
						if (originalUrl.indexOf(value[i]) > -1) {
							result = key, searchFlag = false;
							break;
						}
					}
				}
			}
		}
		return result;
	};
	return _getMappedAddr(url || window.location.href);
}

window.getMappedAddr = getMappedAddr;