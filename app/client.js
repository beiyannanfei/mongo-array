/**
 * Created by wyq on 17/11/6.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/arr_test");
const Schema = mongoose.Schema;

let t1Schema = new Schema({
	item: String,
	qty: Number,
	tags: [String],
	dim_cm: [Number]
}, {versionKey: false});

module.exports = mongoose.model("t1", t1Schema);

