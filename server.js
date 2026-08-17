const express=require("express"), path=require("path"), fs=require("fs");
const app=express(); const PORT=process.env.PORT||3000;
const DATA=path.join(__dirname,"data.json");
if(!fs.existsSync(DATA)) fs.writeFileSync(DATA,JSON.stringify({reports:[],users:[{username:"admin",password:"CHANGE-ME",role:"superadmin"}]},null,2));
app.use(express.json({limit:"2mb"})); app.use(express.static(path.join(__dirname,"public")));
function read(){return JSON.parse(fs.readFileSync(DATA));} function write(x){fs.writeFileSync(DATA,JSON.stringify(x,null,2));}
app.get("/api/reports",(req,res)=>res.json(read().reports));
app.post("/api/reports",(req,res)=>{const d=read(), r=req.body; r.id="LJS-"+Date.now().toString(36).toUpperCase(); r.status="Submitted"; r.createdAt=new Date().toISOString(); d.reports.unshift(r); write(d); res.json(r);});
app.post("/api/login",(req,res)=>{const d=read(),u=d.users.find(x=>x.username===req.body.username&&x.password===req.body.password); if(!u)return res.status(401).json({error:"Invalid login"}); res.json({username:u.username,role:u.role});});
app.patch("/api/reports/:id",(req,res)=>{const d=read(),r=d.reports.find(x=>x.id===req.params.id); if(!r)return res.status(404).json({error:"Not found"}); Object.assign(r,req.body,{updatedAt:new Date().toISOString()}); write(d); res.json(r);});
app.listen(PORT,()=>console.log("KHUMTAI JAN SEVA running on http://localhost:"+PORT));
