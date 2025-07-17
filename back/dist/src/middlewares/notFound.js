"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = void 0;
const notFound = (req, res, next) => {
    res
        .status(404)
        .json({ status: 404, message: "Vous cherchez une page inexistante" });
    return;
};
exports.notFound = notFound;
