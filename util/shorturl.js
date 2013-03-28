exports.getShortUrl = function() {
    var hat = require('hat');
    var rack = hat.rack();

    return rack();
}
