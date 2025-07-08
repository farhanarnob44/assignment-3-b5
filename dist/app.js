"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./app/controllers/book.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const jsonErrorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).json({
            success: false,
            message: "Invalid JSON in request body",
            error: err,
        });
        return; // Just return void here, don't return res
    }
    next(err);
};
// Then register the middleware normally
app.use(jsonErrorHandler);
app.use("/api", book_controller_1.bookRoutes);
// app.use('/api', borrowControl);
app.get('/', (_req, res) => {
    res.send('Welcome to new APP');
});
exports.default = app;
