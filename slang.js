
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
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
          'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
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

export default SlangData;
