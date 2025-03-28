import {TOKEN_SECRET} from '../config.js';
import jwt from 'jsonwebtoken'
export function createAccessToken(payload) {

  return new Promise(function(resolve, reject) {
    jwt.sign(
        payload,
        TOKEN_SECRET,
        {
            expiresIn: '1h'
        },
        (err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        }
    );
  });
}