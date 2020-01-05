const express = require('express');
const router = express.Router();
const logic = require("../services/logic");
const models = require("../models/index");

router.post("/getCitas", async (req, res) => {
    try {
        let {token} = req.body;
        let date = new Date();
        let before = new Date(date.getFullYear(),date.getMonth()-3,date.getDate(),date.getHours(),date.getMinutes(),0,0);
        res.json({citas: await models.cita.findAll({where:{createdAt: {$gt: before, $lt: date}}}), token: logic.resetTimeUser(token)});
    }
    catch (e) {
        console.log(e);
        res.json({citas: []});
    }
});

router.post("/deleteCita", async (req, res) => {
    try {
        let {id, token} = req.body;
        await models.cita.destroy({where:{id}});
        res.json({status: true, token: logic.resetTimeUser(token)});
    }
    catch (e) {
        console.log(e);
        res.json({status: false, message: 'Ha ocurrido un error en el proceso'});
    }
});

module.exports = {
    router: router,
    func: function (io1) {

    }
};