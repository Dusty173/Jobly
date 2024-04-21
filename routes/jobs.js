"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const db = require("../db");

const router = new express.Router();


router.get("/", async function (req, res, next) {
    try {
      if(Object.values(req.query)!=0){
        const filtered= await Job.getfiltered(req.query)
        return res.json(filtered)
      }else{const jobs = await Job.findAll();
      return res.json({ jobs })};
    } catch (err) {
      return next(err);
    }
  });


  
router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }
});


router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, jobUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.update(req.params.title, req.body);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        await Job.remove(req.params.id)
        return res.json({deleted: `Job #${req.params.id} has been deleted`})
    } catch (err) {
        return next(err)
    }
})



module.exports = router   