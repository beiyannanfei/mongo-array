/**
 * Created by wyq on 17/11/6.
 * 查询嵌入式文档数组
 */
const Bluebird = require("bluebird");
const co = require("co");
const client = require("./client.js").t2Model;

function run() {
	co(function *() {
		const field = {_id: 0};
		yield init();
		//在整个嵌入/嵌套文档上的平等匹配需要指定文档的 精确匹配，包括字段顺序
		let findResponse = yield client.find({instock: {qty: 5, warehouse: "A"}}, field);
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [{"item": "journal", "instock": [{"warehouse": "A", "qty": 5}, {"warehouse": "C", "qty": 15}]}];
		findResponse = yield client.find({instock: {warehouse: "A", qty: 5}}, field);
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [];

		//使用数组索引查询嵌入式文档中的字段
		findResponse = yield client.find({"instock.0.qty": {$lte: 20}}, field);
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [
			{"item": "journal", "instock": [{"warehouse": "A", "qty": 5}, {"warehouse": "C", "qty": 15}]},
			{"item": "notebook", "instock": [{"warehouse": "C", "qty": 5}]},
			{"item": "postcard", "instock": [{"warehouse": "B", "qty": 15}, {"warehouse": "C", "qty": 35}]}
		];

		// 单个嵌套文档满足嵌套字段的多个查询条件
		findResponse = yield client.find({instock: {$elemMatch: {warehouse: "A", qty: 5}}}, field);  //<!=>{"instock.qty":5, "instock.warehouse":"A"} 该条件的查询结果会分别匹配(组合满足)
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [{"item": "journal", "instock": [{"warehouse": "A", "qty": 5}, {"warehouse": "C", "qty": 15}]}];

		findResponse = yield client.find({instock: {$elemMatch: {qty: {$gt: 10, $lte: 20}}}}, field);
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [
			{"item": "journal", "instock": [{"warehouse": "A", "qty": 5}, {"warehouse": "C", "qty": 15}]},
			{"item": "paper", "instock": [{"warehouse": "A", "qty": 60}, {"warehouse": "B", "qty": 15}]},
			{"item": "postcard", "instock": [{"warehouse": "B", "qty": 15}, {"warehouse": "C", "qty": 35}]}
		];
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{item: "journal", instock: [{warehouse: "A", qty: 5}, {warehouse: "C", qty: 15}]},
		{item: "notebook", instock: [{warehouse: "C", qty: 5}]},
		{item: "paper", instock: [{warehouse: "A", qty: 60}, {warehouse: "B", qty: 15}]},
		{item: "planner", instock: [{warehouse: "A", qty: 40}, {warehouse: "B", qty: 5}]},
		{item: "postcard", instock: [{warehouse: "B", qty: 15}, {warehouse: "C", qty: 35}]}
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