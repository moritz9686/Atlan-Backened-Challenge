
// for sending the msg to client after 
import unirest from "unirest";
import dotenv from "dotenv";
dotenv.config();
const sendmsg = async (req,res)=>{
const {client_email, client_name, income_per_annum, savings_per_annum, mobile_number} = req.body;
var response = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

response.headers({
  "authorization": process.env.API_KEY
});

response.form({
  "message": `Your Details :\n Email ID :${client_email}\n Name : ${client_name}\n Income Per Annum: ${income_per_annum}\n Savings Per Annum: ${savings_per_annum}\n Contact : ${mobile_number}\n Thankyou for your response`,
  "language": "english",
  "route": "q",
  "numbers": `"${mobile_number}"`,
});
   
   response.end(function (result) {
    if(result.body.return == false){
        res.send("Error form Server side Sorry for inconvience Please send all infromation again")
        return;
    }
    res.send("SMS sended to your mobile number");
  console.log(result.body);
});
}
export default sendmsg;