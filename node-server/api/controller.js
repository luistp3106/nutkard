const express = require('express');
const router = express.Router();
const logic = require("../services/logic");
const models = require("../models/index");
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nutkard.app@gmail.com',
        pass: 'nutluisitokard'
    }
});
let mailOptions = {
    from: 'nutkard.app@gmail.com',
    to: 'edison22_1997@live.com',
    subject: '',
    html: ''
};

router.post("/sendMail", async (req, res) => {
    try{
        let {form} = req.body;
        console.log(form);
        let m = logic.noPointer(mailOptions);
        m.subject = `Mensaje de "${form.nombre.toUpperCase()}"`;
        m.html = `Nombre completo: <b>${form.nombre.toUpperCase()}</b><br>
                    E-mail: <b>${form.email.toLowerCase()}<br></b>
                    Mensaje: ${form.mensaje.toLowerCase()}
                    `;
        transporter.sendMail(m, async function(error, info){
            if (error) {
                res.json({status: false, message: 'Ha ocurrido un error en el proceso'});
            } else {
                res.json({status: true});
            }
        });
    }
    catch (e) {
        console.log(e);
        res.json({status: false, message: 'Ha ocurrido un error en el proceso'});
    }
});

router.post("/manageFormulario", async (req, res) => {
    try{
        let {form} = req.body;
        let finalDate = new Date(form.date), initialDate = new Date(form.date);
        finalDate.setMinutes(finalDate.getMinutes() + 30);
        let count = await models.cita.count({
            where: models.Sequelize.literal(`'${initialDate.toISOString()}'::timestamp with time zone between fecha_inicio and fecha_fin or '${finalDate.toISOString()}'::timestamp with time zone between fecha_inicio and fecha_fin`)
        });
        if (count === 0){
            await models.cita.create({
                nombre_paciente: form.nombre,
                fecha_inicio: initialDate,
                fecha_fin: finalDate
            });
            await models.formulario.create({json: form});
            let m = logic.noPointer(mailOptions);
            m.subject = `Formulario de "${form.nombre.toUpperCase()}"`;
            m.html = `Nombre completo: <b>${form.nombre.toUpperCase()}</b><br>
                    Fecha de nacimiento: <b>${logic.formatDateNoHour(new Date(form.nacimiento))}<br></b>
                    Ocupación/Profesión: <b>${form.profesion.toUpperCase()}<br></b>
                    Género: <b>${form.genero.toUpperCase()}<br></b>
                    E-mail: <b>${form.email.toLowerCase()}<br></b>
                    Teléfono: <b>${form.telefono.toLowerCase()}<br></b>
                    Antecedentes familiares: <b>${form.antecedentes.toLowerCase()}<br></b>
                    Alergias alimentarias: <b>${logic.listOnString(form.alergias, 'toLowerCase')}<br></b>
                    Consumo de tabaco: <b>${form.tabaco}<br></b>
                    Consumo de alcohol: <b>${form.alcohol}<br></b>
                    Actividad física: <b>${form.actividad}<br></b>
                    Número de ingestas/día: <b>${form.ingestas}<br></b>
                    Comida entre horas: <b>${form.comer}<br></b>
                    Fecha y hora de la cita: <b>${logic.formatDate(new Date(form.date))}<br></b>
                    `;
            transporter.sendMail(m, async function(error, info){
                if (error) {
                    res.json({status: false, message: 'Ha ocurrido un error en el proceso'});
                } else {
                    res.json({status: true});
                }
            });
        }
        else res.json({status: false, message: `Esta cita choca con ${count} cita(s)`});
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