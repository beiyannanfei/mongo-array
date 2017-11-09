/**
 * Created by wyq on 17/11/9.
 * $在数组中的使用
 */
const Bluebird = require("bluebird");
const co = require("co");
const client = require("./client.js").t4Model;

function run() {
	co(function *() {
		const field = {};
		yield init();

		//$符号用来替代数组中位置不确定的元素(注意:如果数组中有多个元素满足则只会更新第一个元素,multi选项只会应用于对个不同文档)
		let updateResponse = yield client.update({grades: 80}, {$set: {"grades.$": 82}}, {multi: true});
		// console.log("updateResponse = %j;", updateResponse);
		updateResponse = {"ok": 1, "nModified": 2, "n": 2};
		let findResponse = yield client.find();
		// console.log("findResponse = %j;", findResponse);
		findResponse = [
			{
				"_id": "5a03fa892a89b426502dd06c",
				"others": [],
				"grades": [82, 85, 90, 80]    //注意:只会将数组中第一个符合条件的元素进行替换
			},
			{
				"_id": "5a03fa892a89b426502dd06d",
				"others": [
					{"grade": 80, "mean": 75, "std": 8}, {"grade": 85, "mean": 90, "std": 5}, {"grade": 90, "mean": 85, "std": 3}
				],
				"grades": [88, 90, 92]
			},
			{"_id": "5a03fa892a89b426502dd06e", "others": [], "grades": [85, 100, 90, 82]}
		];

		yield init();

		//对象数组的更新
		findResponse = yield client.findOneAndUpdate({"others.grade": 85}, {$set: {"others.$.std": 6}}, {new: true});
		// console.log("findResponse = %j;", findResponse);
		findResponse = {
			"_id": "5a03fd17924ad33350594181",
			"others": [
				{"grade": 80, "mean": 75, "std": 8}, {"grade": 85, "mean": 90, "std": 6}, {"grade": 90, "mean": 85, "std": 3}
			],
			"grades": [88, 90, 92]
		};

		yield init();

		//多条件查询
		findResponse = yield client.findOneAndUpdate(
			{
				others: {
					$elemMatch: {
						grade: {$lte: 90}, mean: {$gt: 80}
					}
				}
			},
			{
				$set: {"others.$.std": 6}
			},
			{new: true}
		);
		// console.log("findResponse = %j;", findResponse);
		findResponse = {
			"_id": "5a03fe50d1f6b63f50069f8d",
			"others": [
				{"grade": 80, "mean": 75, "std": 8}, {"grade": 85, "mean": 90, "std": 6}, {"grade": 90, "mean": 85, "std": 3}
			],
			"grades": [88, 90, 92]
		};
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{
			"grades": [80, 85, 90, 80],
			"others": []
		},
		{
			"grades": [88, 90, 92],
			"others": [{grade: 80, mean: 75, std: 8}, {grade: 85, mean: 90, std: 5}, {grade: 90, mean: 85, std: 3}]
		},
		{
			"grades": [85, 100, 90, 80],
			"others": []
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