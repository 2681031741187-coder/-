const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

function readDB(){
  if(!fs.existsSync(DATA_FILE)) return {teachers:[],students:[],activities:[],attendance:[]};
  return JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
}
function writeDB(db){
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db,null,2), 'utf8');
  fs.renameSync(tmp, DATA_FILE);
}

app.get('/api/db', (req,res)=>{
  try { res.json(readDB()); }
  catch(e){ res.status(500).json({error:'อ่านฐานข้อมูลไม่สำเร็จ'}); }
});

app.put('/api/db', (req,res)=>{
  try {
    const db=req.body;
    if(!db || !Array.isArray(db.students) || !Array.isArray(db.teachers) || !Array.isArray(db.activities) || !Array.isArray(db.attendance))
      return res.status(400).json({error:'รูปแบบข้อมูลไม่ถูกต้อง'});
    writeDB(db);
    res.json({ok:true});
  } catch(e){ res.status(500).json({error:'บันทึกฐานข้อมูลไม่สำเร็จ'}); }
});

app.get('*', (req,res)=>res.sendFile(path.join(__dirname,'index.html')));

app.listen(PORT, ()=>console.log(`SAMS running on http://localhost:${PORT}`));
