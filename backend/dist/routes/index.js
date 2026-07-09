"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
// Definir una ruta en el objeto router
router.get('/status', (req, res) => {
    res.send('Servidor en funcionamiento');
});
exports.default = router;
