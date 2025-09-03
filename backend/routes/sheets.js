'use strict';
import express from 'express';
import SheetController from "../Controllers/SheetController.js";

const controller = new SheetController();

const router = express.Router();

router.get('/fetch/:nanoid', async (req, res, next) => {
    controller.getSheetDocument(req, res).catch(next);
});

router.get('/fetch/', async (req, res, next) => {
    controller.getBlankSheet(req, res).catch(next);
});

export default router;