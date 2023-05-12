const http = require("http");
const url = require("url");
const { parse } = require("querystring");
const express = require("express");
const fs = require("fs");

const app = express();

const host = "127.0.0.1";
const port = 3000;

let comments = [
  { id: 1, author: "John", text: "Nice post!" },
  { id: 2, author: "Jane", text: "Thanks for sharing." }
];
const us = { user_agent: 0 };

var server = http.createServer(function (request, response) {
  console.log("URL: " + request.url);
  if (request.method == "GET") {
    if (request.url === "/") {
      response.end("Hello word");  
    } else if (request.url == "/stats") {
      response.statusCode = 200;
      us.user_agent++;
      response.setHeader("Content-Type", "text/html");
      response.end(`<table>
      <tr><th>User-agent:</th><th>Request:</th></tr>
      <tr><td>${request.headers["user-agent"]}</td><td>${us.user_agent}</td></tr>
      </table>`);
    }
    
  } else {
    if (request.url == "/comments") {

  let data = [];

  request.on('data', chunk => {
    data.push(chunk);
  });

  request.on('end', () => {
    data = Buffer.concat(data).toString();
    const newComment = JSON.parse(data);

    newComment.id = comments.length + 1;
    comments.push(newComment);

    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(comments));
  });
    }
  }
});


server.listen(port, host);
console.log(`Сервер начал прослушивание запросов по адресу ${host}:${port}`);