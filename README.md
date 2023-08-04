
# Atlan-Backend-Challenge

## :rocket: Task 1 (Great Task)
 ```shell
One of our clients wanted to search for slangs (in local language) for an answer to a text question
on the basis of cities (which was the answer to a different MCQ question).

```
### Tasks1 : -
1. **Translation API approach :-**
  - **We can use google translate API [Click to translate](https://translate.google.co.in/) to find slangs of the given word efficiently**
    - **Route to find slangs of a text/word in local language**
        - ```shell   
              // translate the question in a given language
            const translate = async (q,ln) => {
              const encodedParams = new URLSearchParams();
              encodedParams.set('q', q);
              encodedParams.set('target', ln);
   
    
             const options = {
                method: 'POST',
                url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
                headers: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Accept-Encoding': 'application/gzip',
                  'X-RapidAPI-Key': process.env.TRANSELATE_KEY,
                  'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
                },
                data: encodedParams,
              };
              return await axios.request(options);
          };

          // Get the language of given slang question
          const language = async (lang) =>{
              let Mymap = new Map();
              const options = {
                  method: 'GET',
                  url: 'https://google-translate1.p.rapidapi.com/language/translate/v2/languages',
                  params: {target: 'en'},
                  headers: {
                    'Accept-Encoding': 'application/gzip',
                    'X-RapidAPI-Key': process.env.TRANSELATE_KEY,
          '          X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
                  }
                };
                const response = await axios.request(options);
              response.data.data.languages.map((item)=>{
                  Mymap.set(item.name,item.language);

              })

               return Mymap.get(lang);
          }

          const SlangData = async (req,res) =>{
              console.log(req.query);
              try{
                  const ln = await language(req.body.lang);
                  console.log(ln);
                  const text = await translate(req.body.word, ln);
                  console.log(text.data.data.translations[0].translatedText);
                  res.send(text.data.data.translations[0].translatedText);
        
              }
              catch(err){
                  res.send(err.message); 
              }
     
   
          }
   
             ```   
        -   Route (GET Method) :  ```shell  http://localhost:3000/CheckSlang  Params {"word" : "awesome", lang : "hi",}```
   
           
## :rocket: Task 2 
 ```shell
A market research agency wanted to validate responses coming in against a set of business rules 
(eg. monthly savings cannot be more than monthly income) and send the response back to the data collector 
to fix it when the rules generate a flag.
```
1. **Middleware approach   :-** 
    - **Created a sample Mysql based relational database**
        - ```shell   
           CREATE DATABASE atlan;
       USE atlan;
       CREATE TABLE client_income_data(
           client_id SERIAL PRIMARY KEY,
           client_email VARCHAR(255),
           client_name VARCHAR(255), 
           income_per_annum FLOAT,
           savings_per_annum FLOAT,
           mobile_number VARCHAR(15)
       );  
         ```
    - **Route to validate while insertion**
        - ```shell   
                 // Validate data middleware sample
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
             ```   
        -   Route (POST Method) :  ```shell http://localhost:3000/CheckNew ```
        -   ```shell  
                
               // Validate while insertion of a new client details 
                  app.post('/CheckNew', CheckData, async (req, res) => {
            try {
             const  { client_email, client_name, income_per_annum,savings_per_annum, mobile_number } = req.body;
            const r = `INSERT INTO client_income_data(client_email,client_name,income_per_annum,savings_per_annum,mobile_number)  VALUES( '${client_email}', '${client_name}', ${income_per_annum}, ${savings_per_annum}, '${mobile_number}')`;
            pool.query(r);
            res.json('done');
            } catch (err) {
            res.send(err.message);
            }
            });
             ```
    - **Route to validate All the records/responses  if missed to validate**    
        -   Route (GET method) :  ```shell http://localhost:3000/CheckAll ```
        -   ```shell  
               
            // Validate all and send invalid data to data collector 
                app.get('/CheckAll', async (req, res) => {
   
                pool.query('SELECT * FROM client_income_data WHERE savings_per_annum > income_per_annum',  function(err, results, fields) {
                  if(err) throw err;
                console.log(results); // results contains rows returned by server
            res.send(results);
            return;

             });
  
             });
             ```
## :rocket: Task 3 
 ```shell
A very common need for organizations is wanting all their data onto Google Sheets, wherein they could
connect their CRM, and also generate graphs and charts offered by Sheets out of the box. In such cases,
each response to the form becomes a row in the sheet, and questions in the form become columns. 


```

 **Middleware approach   :-** 
- **Using a sample Mysql based relational database**
     ```shell   
               CREATE DATABASE atlan;
               USE atlan;
        CREATE TABLE client_income_data(
    client_id SERIAL PRIMARY KEY,
    client_email VARCHAR(255),
    client_name VARCHAR(255), 
    income_per_annum FLOAT,
    savings_per_annum FLOAT,
    mobile_number VARCHAR(15)
);
         ```
    - **Route to export and download **
        - ```shell   
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
    ```   
        -   Route (GET Method) :  ```shell http://localhost:3000/getData ```
       
## :rocket: Task 4 
 ```shell
A recent client partner wanted us to send an SMS to the customer whose details are
collected in the response as soon as the ingestion was complete reliably. The content
of the SMS consists of details of the customer, which were a part of the answers in 
the response. This customer was supposed to use this as a “receipt” for them having 
participated in the exercise




```
### Various Approches/ideas : -
1. **Middleware approach  :-** 
    - **Using a sample Mysql based relational database**
        - ```shell   
             CREATE DATABASE atlan;
             CREATE TABLE client_income_data(
             client_id SERIAL PRIMARY KEY,
             client_email VARCHAR(255),
             client_name VARCHAR(255), 
             income_per_annum FLOAT,
             savings_per_annum FLOAT,
             mobile_number VARCHAR(15)
         );   
         ```
    - **Route to send SMS using fast-two-sms API**
        - ```shell   
                const sendmsg = async (req,res)=>{
            const {client_email, client_name, income_per_annum, savings_per_annum, mobile_number} = req.body;
         var response = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
         response.headers({
         "authorization": process.env.API_KEY
         });

          response.form({
          "message": `Your Details :\n Email ID :${client_email}\n Name : ${client_name}\n Income Per Annum: ${income_per_annum}\n Savings Per Annum: ${savings_per_annum}\n Contact : ${mobile_number}\n Thankyou for your  response`,
           "language": "english",
           "route": "q",
           "numbers": `"${mobile_number}"`,
          });
   
           response.end(function (result) {
           if(result.body.return == false){
           res.send("Error form Server side Sorry for inconvience Please               send all infromation again")
           return;
           }
          res.send("SMS sended to your mobile number");
          console.log(result.body);
          });
          }
             ```   
        -   Route (POST Method) :  ```shell http://localhost:3000/sendmessage ```
       

## :ballot_box: Dependencies Used
 ```shell
  "dependencies": {
    "axios": "^1.4.0",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "fast-csv": "^4.3.6",
    "fast-two-sms": "^3.0.0",
    "fs": "0.0.1-security",
    "google-translate-api": "^2.3.0",
    "mysql": "^2.18.1",
    "mysql2": "^3.5.2",
    "translate": "^1.2.3",
    "translate-google": "^1.4.3",
    "unirest": "^0.6.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.12"
  }
   ```
