"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = sanitizeInput;
const sanitize_html_1 = __importDefault(require("sanitize-html"));
function sanitizeInput(input) {
    if (typeof input !== "string")
        return null;
    return (0, sanitize_html_1.default)(input, {
        allowedTags: [], // Aucune balise HTML autorisée
        allowedAttributes: {}, // Aucun attribut non plus
    });
}
