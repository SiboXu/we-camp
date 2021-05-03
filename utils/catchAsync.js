/**
 * The error catch wrapper for WeCamp.
 */

// ----------------------------------------------------------------------------

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
};
