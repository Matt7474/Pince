"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchErrors = catchErrors;
// * cette fonction exécute une méthode de controller dans un try catch, ce qui nous évite d'écrire les try catch dans toutes les méthodes
function catchErrors(controllerMethod) {
    return (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield controllerMethod(req, res);
        }
        catch (error) {
            res.status(500).json({
                status: 500,
                message: "Une erreur serveur est survenue lors de l'opération",
            });
        }
    });
}
