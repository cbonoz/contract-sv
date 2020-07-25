module.exports = {
    
    capLength: (s, length) => {
        if (!s) {
            return s;
        }

        if (!length) {
            length = 25;
        }

        const maxLen = Math.min(s.length, length);
        if (s.length > length) {
            // console.log('s', s);
            return s.substr(0, maxLen) + ''; // no added elipsis
        }
        return s

    },

}