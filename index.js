const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = express.json();

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(__dirname + "/"));
app.set("view engine", "pug");

let infoVar = true;
let nameValutaVar = "";
let posts = [
  {
    id: 1625674004176,
    tiker: "TNG",
    name: "TENGE"
  },
  {
    id: 1625674004177,
    tiker: "RUB",
    name: "RUBL"
  },
  {
    id: 1625674004178,
    tiker: "USR",
    name: "DOLAR"
  },
  {
    id: 1625674004179,
    tiker: "UKG",
    name: "UKRAIN GRIVNE"
  },
  {
    id: 1625674004180,
    tiker: "EUR",
    name: "EURO"
  }
];

app.post("/addCurency", urlencodedParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);
  let name = request.body.name;
  let tiker = request.body.tiker;
  nameValutaVar = name;
  infoVar = true;
  var timestamp = new Date().valueOf();
  posts.push({ id: timestamp, tiker: tiker, name: name });
  response.redirect("/");
});

app.use("/contact", function (request, response) {
  response.render("contact", {
    title: "Мои контакты",
    nameValuta: "rubl",
    info: true,
    posts: posts
  });
});

app.use("/contact2", function (request, response) {
  response.render("contact2", {
    title: "Мои контакты",
    emailsVisible: true,
    posts: posts,
    phone: "+1234567890"
  });
});

app.get("/", urlencodedParser, function (request, response) {
  response.render("contact3", {
    nameValuta: nameValutaVar,
    info: infoVar
  });
  infoVar = false;
  console.log(posts);
  //nameValutaVar = "";
});

var countserver = 0; // номер статьи в массиве posts

app.post("/zapros", jsonParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);

  if (countserver >= posts.length) {
    countserver = 0;
  }
  //response.render("otvet", {post: posts1, count: count});
  response.json({ post: posts[countserver] }); // отдаем статью из массива в формате Json
  countserver++;
});

app.post("/zapros2", jsonParser, function (request, response) {
  if (!request.body) return response.sendStatus(400);
  console.log(request.body.title); // выводим то что прислал клиент
  posts.push({
    title: request.body.title,
    content: request.body.article,
    src: "img/no.jpg"
  });
  response.sendStatus(200);
});

app.get("/ALLVALL", function (request, response) {
  response.json(posts);
});

app.get("/redact/:productId", function (request, response) {
  //response.send("productId: " + request.params["productId"]);
  let indexred = request.params["productId"];
  console.log(indexred);
  let index = posts.findIndex((item) => item.id == indexred);
  response.render("redact", {
    posts: posts[index]
  });
});

app.post("/update", urlencodedParser, function (request, response) {
  //response.send("productId: " + request.params["productId"]);

  if (!request.body) return response.sendStatus(400);
  let name = request.body.name;
  let tiker = request.body.tiker;
  let id = request.body.id;
  console.log(tiker);
  let indexUpd = posts.findIndex((item) => item.id == id);
  console.log(indexUpd);
  posts.splice(indexUpd, 1, { id: id, tiker: tiker, name: name });
  response.redirect("/contact2");
});

app.get("/deletes/:productId", function (request, response) {
  //response.send("productId: " + request.params["productId"]);
  let indexArr = request.params["productId"];
  console.log(indexArr);
  let indexDel = posts.findIndex((item) => item.id == indexArr);
  console.log(indexDel);
  if (indexDel != -1) posts.splice(indexDel, 1);
  response.redirect("/contact");
});

app.get("/ALLVALL", function (request, response) {
  response.sendfile("src/index2.html");
});

app.listen(8080);
