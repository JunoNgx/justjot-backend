const utils = {
    isValidUrl(urlStr) {
        const urlRegex = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
            '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
        
        return urlRegex.test(urlStr);
    },

    tryProcessUrl(urlStr) {
        if (urlStr.indexOf("http") === 0) {
            return urlStr;
        }

        return "http://" + urlStr;
    },
};

module.exports = utils;