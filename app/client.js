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
exports.t1Model = mongoose.model("t1", t1Schema);

let t2Schema = new Schema({
	item: String,
	instock: [mongoose.Schema.Types.Mixed]
}, {versionKey: false});
exports.t2Model = mongoose.model("t2", t2Schema);

let t3Schema = new Schema({
	code: String,
	tags: [String],
	qty: [mongoose.Schema.Types.Mixed]
}, {versionKey: false});
exports.t3Model = mongoose.model("t3", t3Schema);

let t4Schema = new Schema({
	grades: [Number],
	others: [mongoose.Schema.Types.Mixed]
}, {versionKey: false});
exports.t4Model = mongoose.model("t4", t4Schema);

let t5Schema = new Schema({
	item: String,
	tags: [mongoose.Schema.Types.Mixed]
}, {versionKey: false});
exports.t5Model = mongoose.model("t5", t5Schema);

let t6Schema = new Schema({
	scores: [Number]
}, {versionKey: false});
exports.t6Model = mongoose.model("t6", t6Schema);

let t7Schema = new Schema({
	fruits: [String],
	vegetables: [String],
	votes: [Number],
	results: [mongoose.Schema.Types.Mixed]
}, {versionKey: false});
exports.t7Model = mongoose.model("t7", t7Schema);

let t8Schema = new Schema({
	a: [Number]
}, {versionKey: false});
exports.t8Model = mongoose.model("t8", t8Schema);

let t9Schema = new Schema({
	name: String,
	scores: [Number],
	quizzes: [mongoose.Schema.Types.Mixed]
}, {versionKey: false});
exports.t9Model = mongoose.model("t9", t9Schema);

let t10Schema = new Schema({
	scores: [Number]
}, {versionKey: false});
exports.t10Model = mongoose.model("t10", t10Schema);