"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
// Inicializar la aplicación Express
const app = (0, express_1.default)();
// Middlewares globales
app.use(express_1.default.json());
// Ejemplo de ruta para verificar el estado del servidor
app.use('/api', routes_1.default);
exports.default = app;
