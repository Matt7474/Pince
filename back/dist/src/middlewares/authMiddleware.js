"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwtToken_1 = require("../libs/jwtToken");
const authMiddleware = (req, res, next) => {
    var _a, _b;
    const token = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split("Bearer ")[1];
    console.log("token: ", token);
    if (!token) {
        res.status(401).json({
            status: 401,
            message: "Cette route n'est pas accessible sans token",
        });
        return;
    }
    const decodedToken = (0, jwtToken_1.verifyJwtToken)(token);
    console.log("Decoded token:", decodedToken);
    // TypeScript ne sait pas encore ce qu'est decodedToken (string | object)
    if (!decodedToken || typeof decodedToken === "string") {
        res.status(401).json({ status: 401, message: "Le token n'est pas valide" });
        return;
    }
    // Ici, on peut maintenant dire à TypeScript : c'est bien un TokenPayloadType
    const user = decodedToken;
    if (typeof decodedToken !== "object" ||
        !("user" in decodedToken) ||
        typeof decodedToken.user !== "object" ||
        typeof decodedToken.user.id !== "number") {
        res.status(401).json({ status: 401, message: "Token mal formé" });
        return;
    }
    req.token = token;
    req.user = {
        id: decodedToken.user.id,
        token,
    };
    next();
};
exports.authMiddleware = authMiddleware;
