const express = require("express");

const ExpressError = require("../expressError");
const jsonschema = require("jsonschema");
// const Book = require("../models/book");

const newShiftSchema = require("../schemas/newShiftValidation.json");
const editShiftSchema = { ...newShiftSchema, "required": [] };
const Shift = require('../models/Shift');
const User = require('../models/User');
const { ensureLoggedIn } = require("../middleware/auth");

const router = new express.Router();

/** GET / => {shifts: [shift, ...]}  */

router.get("/", async function (req, res, next) {
    try {
        const page = req.body.page || 0; 
        const shifts = await Shift.findAll(25, page);
        return res.json({ shifts });
    } catch (err) {
        return next(err);
    }
});

/** GET /[id]  => {shift: shift} */

router.get("/:id", async function (req, res, next) {
    try {
        const shift = await Shift.findOne(req.params.id);
        return res.json({ shift });
    } catch (err) {
        return next(err);
    }
});

/** POST /   {shift: shiftData} => {shift: newShift}  */

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const shiftData = req.body.shift;
        validateInput(shiftData, newShiftSchema);
        const shift = await User.addShift(res.locals.user.id, shiftData);
        return res.status(201).json({ shift });

    } catch (err) {
        return next(err);
    }
});

/** PATCH /[id]   shiftData => {shift: updatedShift}  */

router.patch("/:id", async function (req, res, next) {
    try {
        const id = req.params.id;
        const shiftData = req.body;
        validateInput(shiftData, editShiftSchema);
        const shift = await Shift.update(id, shiftData);
        return res.json({ shift });

    } catch (err) {
        return next(err);
    }
});

/** DELETE /[id]   => {message: "Shift deleted"} */

router.delete("/:id", async function (req, res, next) {
    try {
        await Shift.remove(req.params.id);
        return res.json({ message: "Shift deleted" });
    } catch (err) {
        return next(err);
    }
});

const validateInput = (data, schema) => {
    const verify = jsonschema.validate(data, schema);
    if (!verify.valid) {
        const errors = verify.errors.map(e => e.stack);
        throw new ExpressError(errors, 400);
    }
    else {
        return true;
    }
};
module.exports = router