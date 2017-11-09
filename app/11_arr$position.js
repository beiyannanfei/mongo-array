/**
 * Created by wyq on 17/11/9.
 * $position的使用
 */
const Bluebird = require("bluebird");
const co = require("co");
const path = require("path");
const client = require("./client.js")[`t${"" + +path.basename(__filename).split("_")[0]}Model`];

function run() {
	co(function *() {
		const field = {_id: 0};
		yield init();

		let findResponse = yield client.findOneAndUpdate(
			{},
			{
				$push: {
					scores: {
						$each: [50, 60, 70],
						$position: 0          //在下标0插入数据
					}
				}
			},
			{new: true});
		console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a042fa745f0585053810e85", "scores": [50, 60, 70, 100]};
		findResponse = yield client.findOneAndUpdate(
			{},
			{
				$push: {
					scores: {
						$each: [20, 30],
						$position: 2
					}
				}
			},
			{new: true});
		console.log("findResponse = %j;", findResponse);
		findResponse = {"_id":"5a042fc9a115455653f12888","scores":[50,60,20,30,70,100]};
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{
			scores: [100]
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
