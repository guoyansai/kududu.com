/*
 * Copyright (C)  2022  Estun Medical Ltd.  
 * 
 * This program is commercial software, you can not redistribute 
 * it or modify it without the permission from Estun Medical Ltd.
 * 
 * @FilePath: \bulkd:\0projectDemo\mytest\app.js
 * @Brief: 
 * 
 * @Author: 
 * @Version: V1.0.0
 * @License: Commercial
 * ----------------------------------------------------------------------------
 * @Date: 2024-10-28 16:56:35
 * @LastEditTime: 2024-11-20 19:27:11
 */
const fs = require('fs');
const http = require('http');
const directoryPath = './';
const port = 3000;
let fileDom = ``;
let currentIndex = 0;

/**
 * 初始化，读取目标文件夹数据
 */
fs.readdir(directoryPath, (err, files)=>{
    if(err){
        console.error("\x1b[31m%s\x1b[0m", "读取目录失败", err);
        return;
    }

    console.log("\x1b[32m%s\x1b[0m", "......开始读取数据");
    readFiles(files)
});

/**
 * 方法，将目标文件中的数据，提取至字符串中
 * @param {*} file 
 */
/**
 * @param {*} file 
 */
function readFiles(file) {
    // Check if the current index is within the file array length
    if (currentIndex >= file.length) {
        initHttp(fileDom);
        console.log("\x1b[32m%s\x1b[0m", "读取数据结束......");
        console.log("");
        return;
    }

    const filePath = directoryPath + '/' + file[currentIndex];
    // Check if the path is a file
    try {
        const stats = fs.statSync(filePath);
        if (stats.isFile() && file[currentIndex].endsWith('.svg')) {
            let fileName = file[currentIndex].replace('.svg', '');
            let svgBase64 = fs.readFileSync(filePath).toString('base64');

            let svgUrl = 'data:image/svg+xml;base64,' + svgBase64;
            fileDom += `<div class='svgDom'>
                            <div class='img-box'><img src='${svgUrl}'></div>
                            <div class='text-style'>${fileName}</div>
                        </div>`;
        }
    } catch (err) {
        console.error("\x1b[31m%s\x1b[0m", "Error checking file status", err);
    }

    currentIndex++;
    readFiles(file);
}

/**
 * Method to initialize the server and output the content in the page
 * @param {*} fileDom 
 */
function initHttp(fileDom) {
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                .boxs{
                    width: 90%;
                    margin: 0 auto;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                }
                .img-box{
                    border-radius: 10%;
                    width: 50px;
                    height: 50px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .boxs-bg > .svgDom > .img-box{
                    background-color: #000000;
                }
                .svgDom{
                    width: 100px;
                    min-width: 120px;
                    text-align: center;
                    padding: 20px 10px;
                }
                .svgDom img{
                    width: 40px;
                    height: 40px;
                }
                .text-style{
                    font-size: 12px;
                    color: #898989;
                    padding: 4px 0;
                }
                .button-item{
                    width: 150px;
                    margin-left: 5%;
                    padding: 8px 0;
                    border-radius: 30px;
                    text-align: center;
                    background: #73a7ff;
                    color: #ffffff;
                    margin-bottom: 40px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="button-item" onClick="showBackground()">显示背景色</div>
            <div class="boxs" id="bgButton">${fileDom}</div>
            <script>
                let backgroundFlag = false;
                function showBackground(){
                    backgroundFlag = !backgroundFlag;
                    let dom = document.querySelector("#bgButton");
                    if(backgroundFlag){
                        dom.classList.add("boxs-bg");
                    }
                    else{
                        dom.classList.remove("boxs-bg");
                    }
                    console.log(dom);
                }
            </script>
        </body>
        </html>
    `;
    
    http.createServer((req, res)=>{
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(html);

    }).listen(port, ()=>{
        console.log("\x1b[36m%s\x1b[3m", "服务开始:");
        console.log("\x1b[36m%s\x1b[0m", "[", "  Network: localhost:3000/");   
        console.log("");
    });

    
}

