const fs = require('fs');
const http = require('http');
const slugify = require('slugify');
const url = require('url');

//const replaceTemplate=require('./starter/modules/replaceTemplate.js');

replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%ORIGIN%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const tempOverview = fs.readFileSync(
  './starter/templates/template-overview.html',
  'utf-8'
);
const tempCard = fs.readFileSync(
  './starter/templates/template-card.html',
  'utf-8'
);
const tempProduct = fs.readFileSync(
  './starter/templates/template-product.html',
  'utf-8'
);

const data = fs.readFileSync('./starter/dev-data/data.json', 'utf-8'); //to read the json file only once i.e at the beginning
const dataObj = JSON.parse(data); //dataObj is an array of all item objects

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true })); //Using 3rd party packages like slugify
//console.log(slugs);

const server = http.createServer((req, res) => {
  //Creating server with request and response variables
  const { query, pathname } = url.parse(req.url, true); //Parsing variables from URL for product page
  //Routing Implementation.......

  //OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml); //filling HTML Templates
    res.end(output); //Sending response to the user from server
  }

  //PRODUCT PAGE
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output); //Sending response to the user from server
  }

  //API PAGE
  else if (pathname === '/api') {
    //creating a very simple API
    //fs.readFile('./starter/dev-data/data.json','utf-8',(err,data)=>{
    //    const productData=JSON.parse(data);           //to parse JSON data into javascript object
    res.writeHead(200, {
      'Content-type': 'application/json', //Specifying Response headers
    });
    res.end(data);
    //})
  }

  //NOT FOUND PAGE
  else {
    res.writeHead(404, {
      'Content-type': 'text/html', //Specifying Response headers
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  //Starting the server
  console.log('Listening to requests on port-8000....');
});

/*

//Callback hell implementation

const fs= require('fs');
fs.readFile('./starter/txt/start.txt','utf-8',(err,data1)=>{
    if(err) return console.log('Error💥');
    fs.readFile(`./starter/txt/${data1}.txt`,'utf-8',(err,data2)=>{    //  `` is used instead of '' in case we use ${}
        console.log(data2);   
        fs.readFile('./starter/txt/append.txt','utf-8',(err,data3)=>{
            console.log(data3);  
            fs.writeFile('./starter/txt/final.txt',`${data2}\n${data3}`,'utf-8',err=>{
                console.log('Your text has been written✔😊');
            }); 
        });
    });
});
console.log('reading...'); 

//Reading files in NodeJs (Asynchronous,Non-Blocking)

const fs= require('fs');
fs.readFile('./starter/txt/start.txt','utf-8',(err,data)=>{
    console.log(data);     //Line1
});
console.log('reading...');      //line2
//Since it's asynchronous,line2 will be executed first and when the file is completely read line1 will execute 


//Reading and Writing files in NodeJs (Synchronous,Blocking)

const fs = require('fs');
const textIn=fs.readFileSync('./starter/txt/input.txt','utf-8');
console.log(textIn);

const textOut='This is the information about avocados:'+ textIn+'\nCreated on'+Date.now();
fs.writeFileSync('./starter/txt/output.txt',textOut);
console.log("Information Added");




//Hello World Program

const hello='Hello World';
console.log(hello);
*/
