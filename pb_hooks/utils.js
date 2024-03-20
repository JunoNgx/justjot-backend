const utils = {
    isValidUrl(urlStr) {
        const urlRegex = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
            '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
        
        return urlRegex.test(utils.tryProcessUrl(urlStr));
    },

    // Make use of shorthand url without protocol; e.g. mozilla.org
    tryProcessUrl(urlStr) {
        if (urlStr.indexOf("http") === 0) {
            return urlStr;
        }

        return "https://" + urlStr;
    },

    getProtocolAndTld(url) {
        const regex = /^(https?:\/\/)?([^\/]+)(\/.*)?$/;
        const match = url.match(regex);
        
        if (match) {
            const protocol = match[1] ? match[1].slice(0, -3) : 'http'; // Default to http if protocol is not specified
            const domain = match[2];
            const tld = domain.split('.').slice(-2).join('.'); // Get the last two parts of the domain
            
            return { protocol, tld };
        } else {
            return null; // Invalid URL
        }
    },

    // Some favicon comes in as relative path
    tryProcessFaviconUrl(favicon, originalProcessedUrl) {
        if (favicon.indexOf("http") === 0) {
            return favicon;
        }

        const urlData = utils.getProtocolAndTld(originalProcessedUrl);

        return `${urlData.protocol}://${urlData.tld}${favicon}`;
    },
};

module.exports = utils;