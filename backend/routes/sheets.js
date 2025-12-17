'use strict';
import express from 'express';
import SheetController from "../Controllers/SheetController.js";

const controller = SheetController.getInstance();

const router = express.Router();

router.get('/fetch/:nanoid', async (req, res, next) => {
    controller.getSheetDocument(req, res).catch(next);
});

router.get('/fetch/', async (req, res, next) => {
    controller.getBlankSheet(req, res).catch(next);
});

router.post('/', async(req, res, next)=>{
    controller.saveSheet(req, res).catch(next);
});

router.get('/:nanoid/qrCode', async(req, res, next)=>{
    controller.getQRCode(req, res).catch(next);
});

router.get('/:nanoid/share', async(req, res, next)=>{
    controller.getSheetForTemporaryLink(req, res).catch(next);
});

export default router;