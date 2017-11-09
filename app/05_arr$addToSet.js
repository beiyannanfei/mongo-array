/**
 * Created by wyq on 17/11/9.
 * $addToSet的使用
 */
const Bluebird = require("bluebird");
const co = require("co");
const client = require("./client.js").t5Model;

function run() {
	co(function *() {
		const field = {};
		yield init();

		//$addToSet 会将将数组中不存在的元素插入到数组,如果存在不做任何修改,如果元素为文档的话则匹配键名、键值、顺序,只有都匹配才认为相等
		let updateResponse = yield client.findOneAndUpdate({item: "polarizing_filter"}, {$addToSet: {tags: "accessories"}}, {new: true});
		// console.log("updateResponse = %j;", updateResponse);
		updateResponse = {
			"_id": "5a04033353c7fc9d50c4eaa9",
			"item": "polarizing_filter",
			"tags": ["electronics", "camera", "accessories"]
		};

		yield init();

		//如果$addToSet的值为数组,则会整体插入数组
		updateResponse = yield client.findOneAndUpdate({item: "polarizing_filter"}, {$addToSet: {tags: ["a", "b"]}}, {new: true});
		// console.log("updateResponse = %j;", updateResponse);
		updateResponse = {
			"_id": "5a0403a8d2b338a650823ee8",
			"item": "polarizing_filter",
			"tags": ["electronics", "camera", ["a", "b"]]
		};

		yield init();

		//$addToSet 和 $each的配合
		updateResponse = yield client.findOneAndUpdate({item: "polarizing_filter"}, {$addToSet: {tags: {$each: ["a", "b"]}}}, {new: true});
		console.log("updateResponse = %j;", updateResponse);
		updateResponse = {
			"_id": "5a040400276c9cad50eaeb37",
			"item": "polarizing_filter",
			"tags": ["electronics", "camera", "a", "b"]
		};
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{
			item: "polarizing_filter",
			tags: ["electronics", "camera"]
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