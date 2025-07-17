"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyJwtToken = verifyJwtToken;
exports.getUserIdInToken = getUserIdInToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(tokenPayload) {
    const token = jsonwebtoken_1.default.sign({
        user: {
            email: tokenPayload.email,
            id: tokenPayload.id,
        },
    }, process.env.JWT_SECRET, {
        expiresIn: "120m",
    });
    return token;
}
function verifyJwtToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
function getUserIdInToken(req) {
    const decoded = jsonwebtoken_1.default.verify(req.token, process.env.JWT_SECRET);
    const user_id = decoded.user.id;
    const user_id_for_db = Number(user_id);
    return user_id_for_db;
}
