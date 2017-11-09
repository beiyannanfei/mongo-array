/**
 * Created by wyq on 17/11/9.
 * $pushAll的使用
 */
const Bluebird = require("bluebird");
const co = require("co");
const path = require("path");
const client = require("./client.js")[`t${"" + +path.basename(__filename).split("_")[0]}Model`];

function run() {
	co(function *() {
		const field = {_id: 0};
		yield init();

		//$pushAll可以使用$push和$each配合实现
		let findResponse = yield client.findOneAndUpdate({}, {$pushAll: {a: [3, 4]}}, {new: true});
		console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a041af53a0b455752255d08", "a": [1, 2, 3, 4]};
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{
			a: [1, 2]
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