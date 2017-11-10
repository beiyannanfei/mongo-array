/**
 * Created by wyq on 17/11/9.
 * $slice
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
			{name: "1"},
			{
				$push: {
					scores: {
						$each: [5, 6, 7],   //向数组尾端追加三个元素结果为 1 2 3 4 5 6 7
						$slice: -4          //截取数组的后四位入库即4 5 6 7
					}
				}
			},
			{new: true});
		// console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a0515b74cd4478755f1bcc0", "name": "1", "scores": [4, 5, 6, 7]};

		yield init();
		findResponse = yield client.findOneAndUpdate(
			{name: 1},
			{
				$push: {
					scores: {
						$each: [5, 6, 7],   //向数组尾端追加三个元素结果为 1 2 3 4 5 6 7
						$slice: 5           //截取数组的前5位入库即 1 2 3 4 5
					}
				}
			},
			{new: true}
		);
		// console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a05165fd8653e8e55e43a52", "name": "1", "scores": [1, 2, 3, 4, 5]};

		findResponse = yield client.findOneAndUpdate(
			{name: "1"},
			{
				$push: {
					scores: {
						$each: [50, 60, 70],      //向数组尾端追加三个元素结果为 1 2 3 4 5 50 60 70
						$slice: 10                //当截取长度大于数组长度时,保留全部元素
					}
				}
			},
			{new: true}
		);
		// console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a051921a8e05f98555fedd3", "name": "1", "scores": [1, 2, 3, 4, 5, 50, 60, 70]};

		findResponse = yield client.findOneAndUpdate(
			{name: "1"},
			{
				$push: {
					scores: {
						$each: [500, 600, 700],   //向数组尾端追加三个元素结果为 1 2 3 4 5 50 60 70 500 600 700
						$slice: 10                //保留最老的10个数据
					}
				}
			},
			{new: true}
		);
		console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a0519a654a363a255e3fd51", "name": "1", "scores": [1, 2, 3, 4, 5, 50, 60, 70, 500, 600]};
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{
			name: "1",
			scores: [1, 2, 3, 4]
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