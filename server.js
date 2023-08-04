import express from 'express';
import cors from 'cors'; //used to enable cross-origin requests from the frontend.
import pool from './db.js'; // provides a database connection pool 
import SlangData from './slang.js'; //which  contain data or functionality related to slang words or phrases.
import fileSystem from "fs"; // used for working with files and directories.
import fastcsv from 'fast-csv'; // library for reading and writing CSV files
import { fileURLToPath } from "url"; // library used for converts a file URL to a local file path.
import path from "path"; // used for working with file and directory paths.
import sendmsg from './uni.js'; // used for sendmsg
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3000;

app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
// Task 1
app.get('/CheckSlang',SlangData ,((req,res)=>{}));
// Task 1- end 



// Task 2
app.get('/CheckAll', async (req, res) => {
   
        pool.query('SELECT * FROM client_income_data WHERE savings_per_annum > income_per_annum',  function(err, results, fields) {
            if(err) throw err;
            console.log(results); // results contains rows returned by server
            res.send(results);
            return;

          });
  
});
// middleware for validate
function CheckData  (req, res, next) {
    const { income_per_annum, savings_per_annum, mobile_number } = req.body;

    if (income_per_annum < savings_per_annum) {
        res.send("Invalid Data Savings cannot be more than Income");
        return;
    }
    else if (isNaN(mobile_number)) {
        res.send("Invalid mobile number, only digits are acceptable");
        return;
    }
    else if (mobile_number.length !== 10) {
        res.send("Invalid mobile number, should be of 10 digits");
        return;
    }
    next();
};
// Take all the data form client after validating 
app.post('/CheckNew', CheckData, async (req, res) => {
    console.log(4);
    try {
        const  { client_email, client_name, income_per_annum, savings_per_annum, mobile_number } = req.body;
        const r = `INSERT INTO client_income_data(client_email,client_name,income_per_annum,savings_per_annum,mobile_number)  VALUES( '${client_email}', '${client_name}', ${income_per_annum}, ${savings_per_annum}, '${mobile_number}')`;
        pool.query(r);
        res.json('done');
    } catch (err) {
        res.send(err.message);
    }
});
// End of task 2



// Export data in sheet - Task 3
async function exportData(req, res) {
    
         pool.query('SELECT * FROM client_income_data',
         function(err, results, fields) {
            if(err) throw err;
            console.log(results);
        var file = fileSystem.createWriteStream("public/data.csv");
        fastcsv
            .write(results, { headers: true })
            .on("finish", function() {
 
                res.send("<a href='/public/data.csv' download='data.csv' id='download-link'></a><script>document.getElementById('download-link').click();</script>");
            })
            .pipe(file);
            return;
        });
    
}
// Get data into sheet - task 3
app.get('/getData', exportData, (req, res) => { });
// Send Message after a response - task 4
app.post('/sendmessage', sendmsg);

app.listen(port, () => {
    console.log(`Server is listening at port : ${port}`);
});