const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

let util = {
    checkLogin(ctx) {
        // let uid = ctx.cookies.get('uid');
        // if (!uid) {
        //     return Tips[1005];
        // } else {
        //     return Tips[0];
        // }
    },
    generateToken(data) {
        let created = Math.floor(Date.now() / 1000);
        let cert = fs.readFileSync(path.join(__dirname, '../config/rsa_private_key.pem'));
        let token = jwt.sign({
            data,
            exp: created + 3600 * 24
        }, cert, { algorithm: 'RS256' });
        return token;
    },
    verifyToken(token) {
        let cert = fs.readFileSync(path.join(__dirname, '../config/rsa_public_key.pem')), res = {};
        try {
            let result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {};
            let { exp = 0 } = result
            let current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result.data || {};
            }
        } catch (err) {
            
        }
        return res;
    }
}

module.exports = util;