const crypto = require("../security/crypto");

function midAuthentication(){
    return function (req, res, next) {
        next();
    };
}

function realAuthentication(){
    return function (req, res, next) {
        if (!req.cookies['os']){
            return res.status(401).send("NOOOO!!");
        }
        try{
            JSON.parse(crypto.decrypt(req.cookies['os']));
        }
        catch (e) {
            return res.status(401).send("NOOOO!!");
        }
        if (req.cookies['os']) res.cookie('os', req.cookies['os'], { expires: new Date(Date.now() + 300000), httpOnly: true, secure: false });
        next();
    };
}

module.exports = {
    midAuthentication,
    realAuthentication
};
