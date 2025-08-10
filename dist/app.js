"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./app/controllers/book.controller");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'https://library-frontend-umber-five.vercel.app']
}));
app.use(express_1.default.json());
const jsonErrorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        res.status(404).json({
            success: false,
            message: "Invalid JSON in request body",
            error: err,
        });
        return;
    }
    next(err);
};
app.use(jsonErrorHandler);
app.use("/", book_controller_1.bookRoutes);
app.get('/', (_req, res) => {
    res.send('Welcome to new APP');
});
exports.default = app;
