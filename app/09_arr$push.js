/**
 * Created by wyq on 17/11/9.
 * $push的使用
 */
const Bluebird = require("bluebird");
const co = require("co");
const path = require("path");
const client = require("./client.js")[`t${"" + +path.basename(__filename).split("_")[0]}Model`];

function run() {
	co(function *() {
		const field = {_id: 0};
		yield init();

		//向数组尾端插入一个元素
		let findResponse = yield client.findOneAndUpdate({name: "1"}, {$push: {scores: 89}}, {new: true});
		console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a04224ff3a562a75286ba78", "name": "1", "quizzes": [], "scores": [1, 89]};

		//配合$each插入多个值(<=>$pushAll)
		findResponse = yield client.findOneAndUpdate({name: "1"}, {$push: {scores: {$each: [90, 92, 85]}}}, {new: true});
		console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a0422cd7d3004af52676865", "name": "1", "quizzes": [], "scores": [1, 89, 90, 92, 85]};

		//$push结合$each $sort $slice使用
		findResponse = yield client.findOneAndUpdate(
			{name: "5"},
			{
				$push: {
					quizzes: {
						$each: [{wk: 5, score: 8}, {wk: 6, score: 7}, {wk: 7, score: 6}], //插入三个文档
						$sort: {score: -1}, //按照score倒序排列
						$slice: 5           //截取前n个值
					}
				}
			},
			{new: true});
		console.log("findResponse = %j;", findResponse);
		findResponse = {
			"_id": "5a042790d9aa53de52686a28",
			"name": "5",
			"quizzes": [
				{"wk": 1, "score": 10},
				{"wk": 2, "score": 8},
				{"wk": 5, "score": 8},
				{"wk": 6, "score": 7},
				{"wk": 4, "score": 6}
			],
			"scores": []
		};
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{
			name: "1",
			scores: [1]
		},
		{
			name: "5",
			quizzes: [
				{"wk": 1, "score": 10},
				{"wk": 2, "score": 8},
				{"wk": 3, "score": 5},
				{"wk": 4, "score": 6}
			]
		}
	];
	return new Bluebird((resolve, reject) => {
		client.remove({}).then(response => {
			console.log("delete all doc response: %j", response);
			return client.create(doc);
		}).then(response => {
			return resolve(response);
		}).catch(err => {
			return reject(err);
		});
	});
}
run();