import pool from './db.js';

const  checkAll = async(req,res) =>{
    // console.log(8);
    try {
        let inValidRows = await pool.query("SELECT * FROM client_income_data WHERE savings_per_annum > income_per_annum");
        inValidRows = inValidRows.rows;
        if(inValidRows.length === 0)
        {
            res.send("All records are Valid");
        }
        else {
            res.send(inValidRows);
        }
    } catch (err) {
        console.log(err.message);
    }
}
// export checkAll and checkData
export default checkAll;

