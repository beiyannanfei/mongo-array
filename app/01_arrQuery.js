/**
 * Created by wyq on 17/11/6.
 */
const Bluebird = require("bluebird");
const co = require("co");
const client = require("./client.js").t1Model;

function run() {
	co(function *() {
		yield init();

		//要求数组的长度、内容、顺序都完全匹配
		let findResponse = yield client.find({tags: ["red", "blank"]}, {_id: 0});
		findResponse = [{"item": "notebook", "qty": 50, "dim_cm": [14, 21], "tags": ["red", "blank"]}];
		// console.log("====== findResponse= %j;", findResponse);

		//只要包含就会命中,不考虑数组中的其他元素、顺序
		findResponse = yield client.find({tags: {$all: ["red", "blank"]}}, {_id: 0});
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [
			{"item": "journal", "qty": 25, "dim_cm": [14, 21], "tags": ["blank", "red"]},
			{"item": "paper", "qty": 100, "dim_cm": [14, 21], "tags": ["red", "blank", "plain"]},
			{"item": "notebook", "qty": 50, "dim_cm": [14, 21], "tags": ["red", "blank"]},
			{"item": "planner", "qty": 75, "dim_cm": [22.85, 30], "tags": ["blank", "red"]}
		];

		//一个元素可以满足大于15条件，另一个元素可以满足小于20条件，或者单个元素可以满足两者
		findResponse = yield client.find({dim_cm: {$gt: 15, $lt: 20}}, {_id: 0});
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [
			{"item": "journal", "qty": 25, "dim_cm": [14, 21], "tags": ["blank", "red"]},
			{"item": "notebook", "qty": 50, "dim_cm": [14, 21], "tags": ["red", "blank"]},
			{"item": "paper", "qty": 100, "dim_cm": [14, 21], "tags": ["red", "blank", "plain"]},
			{"item": "postcard", "qty": 45, "dim_cm": [10, 15.25], "tags": ["blue"]}
		];

		//$elemMatch运算符在数组的元素上指定多个条件
		findResponse = yield client.find({dim_cm: {$elemMatch: {$gt: 22, $lt: 30}}}, {_id: 0});
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [
			{"item": "planner", "qty": 75, "dim_cm": [22.85, 30], "tags": ["blank", "red"]}
		];

		//通过索引位置查询
		findResponse = yield client.find({"dim_cm.1": {$gt: 25}}, {_id: 0});
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [{"item": "planner", "qty": 75, "dim_cm": [22.85, 30], "tags": ["blank", "red"]}];

		//通过数组长度查询
		findResponse = yield client.find({tags: {$size: 3}}, {_id: 0});
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [{"item": "paper", "qty": 100, "dim_cm": [14, 21], "tags": ["red", "blank", "plain"]}];
		/*
		 注意: $size必须匹配精确数值,不能使用类似tags: {$size: {$gte:3}}  //=> err:Cast to number failed for value "[object Object]" at path "tags"
		 */

		//如果需要匹配数组长度范围,可借助索引
		findResponse = yield client.find({"tags.2": {$exists: true}}, {_id: 0});  //匹配tags数组长度大于等于3的文档
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [{"item": "paper", "qty": 100, "dim_cm": [14, 21], "tags": ["red", "blank", "plain"]}];
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}
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
run();

