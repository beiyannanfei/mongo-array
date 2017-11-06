/**
 * Created by wyq on 17/11/6.
 * 查询嵌入式文档数组
 */
const Bluebird = require("bluebird");
const co = require("co");
const client = require("./client.js").t2Model;

function run() {
	co(function *() {
		yield init();
		//在整个嵌入/嵌套文档上的平等匹配需要指定文档的 精确匹配，包括字段顺序
		let findResponse = yield client.find({instock: {qty: 5, warehouse: "A"}}, {_id: 0});
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [{"item": "journal", "instock": [{"warehouse": "A", "qty": 5}, {"warehouse": "C", "qty": 15}]}];
		findResponse = yield client.find({instock: {warehouse: "A", qty: 5}}, {_id: 0});
		// console.log("====== findResponse= %j;", findResponse);
		findResponse = [];


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