const user = require('../models/user');
//const user = require('../models/user');

module.exports = {
    private: async(req, res, next) => {
        if (!req.query.token && !req.body.token) {
            res.json({ notallowed: true });
            return;
        }
        if (req.query.token) {
            token = req.query.token;
        }
        if (req.body.token) {
            token = req.body.token;
        }
        if (token == '') {
            res.json({ notallowed: true });
            return;
        }
        const user = await user.findOne({
            token
        });
        if (!user) {
            res.json({ notallowed: true });
            return;
        }

        next();
    }
};