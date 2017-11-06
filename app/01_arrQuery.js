/**
 * Created by wyq on 17/11/6.
 */
const Bluebird = require("bluebird");
const co = require("co");
const client = require("./client.js");

function init() {   //初始化数据
	let doc = [
		{item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [14, 21]},
		{item: "notebook", qty: 50, tags: ["red", "blank"], dim_cm: [14, 21]},
		{item: "paper", qty: 100, tags: ["red", "blank", "plain"], dim_cm: [14, 21]},
		{item: "planner", qty: 75, tags: ["blank", "red"], dim_cm: [22.85, 30]},
		{item: "postcard", qty: 45, tags: ["blue"], dim_cm: [10, 15.25]}
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

function run() {
	co(function *() {
		yield init();
		//要求数组的长度、内容、顺序都完全匹配
		let findResponse = yield client.find({tags: ["red", "blank"]});
		// [{"_id":"5a002d6ab9d42a493a509bc5","item":"notebook","qty":50,"dim_cm":[14,21],"tags":["red","blank"]}]
		console.log("====== findResponse: %j", findResponse);
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

run();

