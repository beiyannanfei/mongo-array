/**
 * Created by wyq on 17/11/9.
 * $pull的使用
 */
const Bluebird = require("bluebird");
const co = require("co");
const path = require("path");
const client = require("./client.js")[`t${"" + +path.basename(__filename).split("_")[0]}Model`];

function run() {
	co(function *() {
		const field = {_id: 0};
		yield init();

		//$pull会删除数组中满足条件的元素,如果要删除的是数组则要精确匹配包括顺序,文档只需匹配键名和键值,顺序可以不同
		let findResponse = yield client.findOneAndUpdate(
			{},
			{
				$pull: {
					fruits: {$in: ["apples", "oranges"]},
					vegetables: "carrots"
				}
			},
			{multi: true}
		);
		// console.log("findResponse = %j;", findResponse);
		findResponse = {
			"_id": "5a040f4381349bac51df357a",
			"results": [],
			"votes": [],
			"vegetables": ["celery", "squash"],
			"fruits": ["pears", "grapes", "bananas"]
		};

		//$pull与$gte等范围操作符的配合
		findResponse = yield client.findOneAndUpdate(
			{votes: {$gte: 6}},
			{$pull: {votes: {$gte: 6}}},
			{new: true, multi: true});
		// console.log("findResponse = %j;", findResponse);
		findResponse = {"_id": "5a040f4381349bac51df357c", "results": [], "votes": [3, 5], "vegetables": [], "fruits": []};

		//文档数组的删除
		let updateResponse = yield client.update({}, {$pull: {results: {score: 8, item: "B"}}}, {multi: true});
		// console.log("updateResponse = %j;", updateResponse);
		updateResponse = {"ok": 1, "nModified": 1, "n": 5};
		findResponse = yield client.find({"results.0": {$exists: true}}, field);
		// console.log("findResponse = %j;", findResponse);
		findResponse = [
			{
				"results": [{"item": "A", "score": 5}],
				"votes": [], "vegetables": [], "fruits": []
			},
			{
				"results": [{"item": "C", "score": 8, "comment": "Strongly agree"}, {"item": "B", "score": 4}],
				"votes": [], "vegetables": [], "fruits": []
			}
		];

		yield init2();
		//嵌套文档数组中需要和 $elemMatch 配合使用
		updateResponse = yield client.update(
			{},
			{$pull: {results: {answers: {$elemMatch: {q: 2, a: {$gte: 8}}}}}},  //在mongo中执行正常,但是此处不生效
			{multi: true});
	}).catch(err => {
		console.log("err: %s", err.message || err);
	});
}

function init() {   //初始化数据
	let doc = [
		{
			"fruits": ["pears", "grapes", "bananas"],
			"vegetables": ["celery", "squash"]
		},
		{
			"fruits": ["plums", "kiwis", "bananas"],
			"vegetables": ["broccoli", "zucchini", "onions"]
		},
		{
			votes: [3, 5, 6, 7, 7, 8]
		},
		{
			results: [
				{item: "A", score: 5},
				{item: "B", score: 8, comment: "Strongly agree"}
			]
		},
		{
			results: [
				{item: "C", score: 8, comment: "Strongly agree"},
				{item: "B", score: 4}
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

function init2() {
	let doc = [
		{
			results: [
				{item: "A", score: 5, answers: [{q: 1, a: 4}, {q: 2, a: 6}]},
				{item: "B", score: 8, answers: [{q: 1, a: 8}, {q: 2, a: 9}]}
			]
		},
		{
			results: [
				{item: "C", score: 8, answers: [{q: 1, a: 8}, {q: 2, a: 7}]},
				{item: "B", score: 4, answers: [{q: 1, a: 0}, {q: 2, a: 8}]}
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