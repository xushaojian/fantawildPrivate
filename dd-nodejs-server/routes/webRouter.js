const express = require('express');
const webRouter = express.Router();
const path = require('path');
const fs = require('fs');
const business = require('../business/business');
const mutipart = require('connect-multiparty');
const mutipartMiddeware = mutipart();
const xlsx = require('node-xlsx');
const commonTool = require('../tools/commonTool');
var logger = require('log4js').getLogger("webRouter");

/**
 * 下载文件
 * 2019-01-15
 */
webRouter.get('/download', function (req, res, next) {
	let type = req.query.type;
	let currFile = path.join(__dirname, '../file/excel_create_chat_template/');
	let fileName = ''
	if (type == 1) {
		fileName = "Template1.xlsx";
	} else if (type == 2) {
		fileName = "Template2.xlsx";
	}
	currFile = currFile + fileName;

	let fReadStream;
	fs.exists(currFile, function (exist) {
		if (exist) {
			res.set({
				"Content-type": "application/octet-stream",
				"Content-Disposition": "attachment;filename=" + encodeURI(fileName)
			});
			fReadStream = fs.createReadStream(currFile);
			fReadStream.on("data", function (chunk) { res.write(chunk, "binary") });
			fReadStream.on("end", function () {
				res.end();
				next();
			});
		} else {
			res.set("Content-type", "text/html");
			res.send("file not exist!");
			res.end();
			next();
		}
	});
});

/**
 * 根据excel文件创建群会话
 * 2019-01-15
 */
webRouter.post('/excel_create_chat', mutipartMiddeware, function (req, res, next) {
	// console.log(req.originalUrl);
	// console.log(req.files);// 上传的文件信息
	//初始化返回值
	let item = {
		name: '', //群名称
		chatid: '', //群ID
		errcode: 0, //是否创建成功,0 表示成功
		errmsg: '' //错误信息
	}

	let record = []; // 记录每个群是否创建成功
	let sheetData; // excel文件的第一个sheet的数据
	let analysisAfterArray = []; //解析第一个sheet后的数据

	if (req.files.excel1 != undefined) {
		try {
			sheetData = xlsx.parse(req.files.excel1.path)[0].data;
			// 由于xlsx 是按行读取到的二维数组，需要对二维数组进行转置。这里只对第一个sheets进行转置
			// 如果二维数组不是每列的数量都相同，会以数量最多来转置，其他的用 undefined 填补
			analysisAfterArray = sheetData[0].map(function (col, i) {
				return sheetData.map(function (row) {
					return row[i];
				})
			});

			logger.info(analysisAfterArray);

			// 循环二维数组创建群
			for (let i = 0; i < analysisAfterArray.length; i++) {
				business.createChat(analysisAfterArray[i],result => {
					record.push(result);
					if( i === analysisAfterArray.length-1){
						logger.info(record)
						res.send(record);
						next();
					}
				});
			}

		} catch (error) {
			logger.info("解析 excel1 出现异常");
			logger.info(error);
			item.name = req.files.excel1.originalFilename;//文件名称
			item.errcode = 1;
			item.errmsg = "建群失败，请检查excel格式是否正确";
			record.push(item);
			res.send(record);
			next();
		}

	} else if (req.files.excel2 != undefined) {

		try {
			sheetData = xlsx.parse(req.files.excel2.path)[0].data;
			console.log(sheetData)
			//记录标题
			console.log(sheetData[0])

			let title = '';
			//标题存在 '-'的时候
			if (sheetData[0][0].indexOf('-') != -1) {
				let titleTemp = sheetData[0][0].split("-");
				title = titleTemp[0];
			} else {
				title = sheetData[0][0];
			}

			//以第三行为锚点进行转置，转置后有用的数组为 群名称：temp_1[1], 人名：temp_1[2]
			let temp_1 = sheetData[2].map(function (col, i) {
				return sheetData.map(function (row) {
					return row[i];
				})
			});

			//解析转置后的第二个数组，获取到去重后的群名称
			let temp_2 = commonTool.uniqArr(temp_1[1].slice(2))

			//循环群名称获取到该群的群员
			for (let i in temp_2) {
				let temp_3 = [];
				let isFirst = true;
				for (let y in temp_1[1]) {
					if (temp_2[i] === temp_1[1][y]) { //判断群名称是否相同
						//首次相同时 需要连同群名称一起push
						if (isFirst) {
							temp_3.push(temp_2[i])
							temp_3.push(temp_1[2][y])
							isFirst = false
						} else {
							temp_3.push(temp_1[2][y])
						}
					}
				}
				analysisAfterArray.push(temp_3)
			}

			console.log(analysisAfterArray)

			// 循环二维数组创建群
			for (let i = 0; i < analysisAfterArray.length; i++) {
				// let result =  business.businessChat(analysisAfterArray[i], title);
				business.createChat(analysisAfterArray[i], result => {
					record.push(result)
					if(i === analysisAfterArray.length-1){
						console.log(record)
						res.send(record);
						next();
					}
				});
			}

			
		} catch (error) {
			console.log("解析 excel2 出现异常")
			item.name = req.files.excel2.originalFilename;
			item.errcode = 1
			item.errmsg = "建群失败，请检查excel格式是否正确"
			record.push(item)
			console.log(record)
			res.send(record);
			next();
		}
	}
})



module.exports = webRouter;