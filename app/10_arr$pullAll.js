/**
 * Created by wyq on 17/11/9.
 * $pullAll的使用
 */
const Bluebird = require("bluebird");
const co = require("co");
const path = require("path");
const client = require("./client.js")[`t${"" + +path.basename(__filename).split("_")[0]}Model`];

function run() {
	co(function *() {
		const field = {_id: 0};
		yield init();

		let findResponse = yield client.findOneAndUpdate({}, {$pullAll: {scores: [0, 5]}}, {new: true});
		console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a042a1bbc16ff1653a86ffe", "scores": [2, 1]};
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{
			scores: [0, 2, 5, 5, 1, 0]
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