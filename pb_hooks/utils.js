const utils = {

    /**
     * @typedef { Object } urlPart
     * @property { string } protocol
     * @property { string } domain
     */

    /**
     * Checks whether argument is a valid url
     * @param {string} urlStr 
     * @returns {boolean} 
     */
    isValidUrl(urlStr) {
        const urlRegex = new RegExp('^(https?:\\/\\/)?' + // validate protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator

        return urlRegex.test(utils.tryProcessUrl(urlStr));
    },

    /**
     * Attempts to prepend the protocol for a potential correct url, e.g. mozilla.org
     * @param {string} urlStr 
     * @returns {string} an url string that starts with `https://`
     */
    tryProcessUrl(urlStr) {
        if (urlStr.indexOf("http") === 0) {
            return urlStr;
        }

        return "https://" + urlStr;
    },


    /**
     * Breakdown an url
     * @param {string} url 
     * @returns {urlPart}
     */
    getProtocolAndDomain(url) {
        const regex = /^(https?:\/\/)?([^\/]+)(\/.*)?$/;
        const match = url.match(regex);

        if (match) {
            const protocol = match[1] ? match[1].replace('://', '') : 'http'; // Extract protocol
            const domain = match[2]; // Extract domain

            return { protocol, domain };
        } else {
            return null; // Invalid URL
        }
    },

    /**
     * Attempts to prepend the url domain to a potentially relative favicon path
     * @param {string} favicon 
     * @param {string} originalProcessedUrl 
     * @returns {string} The absolute path to favicon
     */
    tryProcessFaviconUrl(favicon, originalProcessedUrl) {
        if (favicon.indexOf("http") === 0) {
            return favicon;
        }

        const urlData = utils.getProtocolAndDomain(originalProcessedUrl);

        const domainWithoutSlash = urlData.domain.endsWith("/")
            ? urlData.domain.slice(0, urlData.domain.length - 1)
            : urlData.domain;
        const faviconWithoutSlash = favicon.startsWith("/")
            ? favicon.slice(1)
            : favicon;

        return `${urlData.protocol}://${domainWithoutSlash}/${faviconWithoutSlash}`;
    },
};

module.exports = utils;