/**
 * Created by wyq on 17/11/10.
 * $sort的使用
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
					quizzes: {
						$each: [
							{id: 3, score: 8},
							{id: 4, score: 7},
							{id: 5, score: 6}
						],
						$sort: {score: 1}     //将数组按照score字段升序排列后入库
					}
				}
			},
			{new: true}
		);
		// console.log("findResponse = %j;", findResponse);
		findResponse = {
			"_id": "5a051cc1c49601da55721e08",
			"name": "1",
			"quizzes": [
				{"id": 1, "score": 6},
				{"id": 5, "score": 6},
				{"id": 4, "score": 7},
				{"id": 3, "score": 8},
				{"id": 2, "score": 9}
			]
		};

		findResponse = yield client.findOneAndUpdate(
			{name: "2"},
			{
				$push: {
					tests: {
						$each: [40, 60],
						$sort: -1         //当数组数据为基本类型时的排序方式
					}
				}
			},
			{new: true}
		);
		// console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a051d954b8841e355eef9f5", "name": "2", "tests": [89, 89, 70, 60, 50, 40], "quizzes": []};

		findResponse = yield client.findOneAndUpdate(
			{name: "3"},
			{
				$push: {
					tests: {
						$each: [],        //不能省略
						$sort: -1         //只排序
					}
				}
			},
			{new: true}
		);
		// console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a051e2d0c730dee55038798", "name": "3", "tests": [100, 89, 70, 20], "quizzes": []};

		findResponse = yield client.findOneAndUpdate(
			{name: "5"},
			{
				$push: {
					quizzes: {
						$each: [
							{wk: 5, score: 8},
							{wk: 6, score: 7},
							{wk: 7, score: 6}
						], //插入完成后文档为[{"wk":1,"score":10},{"wk":2,"score":8},{"wk":3,"score":5},{"wk":4,"score":6},{wk:5,score:8},{wk:6,score:7},{wk:7,score:6}]
						$sort: {score: -1}, //排序后[{"wk":1,"score":10},{"wk":2,"score":8},{wk:5,score:8},{wk:6,score:7},{"wk":4,"score":6},{wk:7,score:6},{"wk":3,"score":5}]
						$slice: 3           //截取前三个[{"wk":1,"score":10},{"wk":2,"score":8},{wk:5,score:8}]
					}
				}
			},
			{new: true}
		);
		console.log("findResponse = %j;", findResponse);
		findResponse = {
			"_id": "5a051fa945a8ee0256b94233", "name": "5", "tests": [],
			"quizzes": [{"wk": 1, "score": 10}, {"wk": 2, "score": 8}, {"wk": 5, "score": 8}]
		};
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{
			name: "1",
			quizzes: [
				{"id": 1, "score": 6},
				{"id": 2, "score": 9}
			]
		},
		{
			name: "2",
			tests: [89, 70, 89, 50]
		},
		{
			name: "3",
			tests: [89, 70, 100, 20]
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
