/**
 * Created by wyq on 17/11/8.
 * $all在数组中的应用
 */
const Bluebird = require("bluebird");
const co = require("co");
const client = require("./client.js").t3Model;

function run() {
	co(function *() {
		const field = {_id: 0};
		yield init();

		let findResponse = yield client.find({tags: {$all: ["appliance", "school", "book"]}}, field);
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [
			{
				"code": "xyz",
				"qty": [
					{"size": "S", "num": 10, "color": "blue"},
					{"size": "M", "num": 45, "color": "blue"},
					{"size": "L", "num": 100, "color": "green"}
				],
				"tags": ["school", "book", "bag", "headphone", "appliance"]
			},
			{
				"code": "abc",
				"qty": [
					{"size": "6", "num": 100, "color": "green"},
					{"size": "6", "num": 50, "color": "blue"},
					{"size": "8", "num": 100, "color": "brown"}
				],
				"tags": ["appliance", "school", "book"]
			}
		];

		//查询对象数组需要$all与$elemMatch配合使用(组合满足)
		let condition = {
			qty: {
				$all: [
					{$elemMatch: {size: "M", num: {$gt: 50}}},
					{$elemMatch: {num: 100, color: "green"}}
				]
			}
		};
		findResponse = yield client.find(condition, field);
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [
			{
				"code": "efg",
				"qty": [
					{"size": "S", "num": 10, "color": "blue"},
					{"size": "M", "num": 100, "color": "blue"},
					{"size": "L", "num": 100, "color": "green"}
				],
				"tags": ["school", "book"]
			},
			{
				"code": "ijk",
				"qty": [
					{"size": "M", "num": 100, "color": "green"}
				],
				"tags": ["electronics", "school"]
			}
		];


	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{
			code: "xyz",
			tags: ["school", "book", "bag", "headphone", "appliance"],
			qty: [
				{size: "S", num: 10, color: "blue"},
				{size: "M", num: 45, color: "blue"},
				{size: "L", num: 100, color: "green"}
			]
		},
		{
			code: "abc",
			tags: ["appliance", "school", "book"],
			qty: [
				{size: "6", num: 100, color: "green"},
				{size: "6", num: 50, color: "blue"},
				{size: "8", num: 100, color: "brown"}
			]
		},
		{
			code: "efg",
			tags: ["school", "book"],
			qty: [
				{size: "S", num: 10, color: "blue"},
				{size: "M", num: 100, color: "blue"},
				{size: "L", num: 100, color: "green"}
			]
		},
		{
			code: "ijk",
			tags: ["electronics", "school"],
			qty: [
				{size: "M", num: 100, color: "green"}
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