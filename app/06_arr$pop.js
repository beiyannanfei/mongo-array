/**
 * Created by wyq on 17/11/9.
 * $pop的使用
 */
const Bluebird = require("bluebird");
const co = require("co");
const path = require("path");
const client = require("./client.js")[`t${"" + +path.basename(__filename).split("_")[0]}Model`];

function run() {
	co(function *() {
		const field = {};
		yield init();

		//pop取值-1则删除第一个元素,取值1则删除最后一个元素
		let findResponse = yield client.findOneAndUpdate({}, {$pop: {scores: -1}}, {new: true});
		console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a040a90b5ee4a4651a88ef5", "scores": [2, 3, 4, 5, 6, 7, 8, 9]};
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{scores: [1, 2, 3, 4, 5, 6, 7, 8, 9]}
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




