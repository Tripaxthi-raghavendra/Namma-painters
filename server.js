const express=require('express'), multer=require('multer'), fs=require('fs'), path=require('path'), crypto=require('crypto');
const app=express(), PORT=process.env.PORT||3000;
const dataDir=path.join(__dirname,'data'), uploadDir=path.join(__dirname,'uploads');
fs.mkdirSync(dataDir,{recursive:true});fs.mkdirSync(uploadDir,{recursive:true});
const db=path.join(dataDir,'requests.json'); if(!fs.existsSync(db))fs.writeFileSync(db,'[]');
const read=()=>JSON.parse(fs.readFileSync(db,'utf8')); const write=x=>fs.writeFileSync(db,JSON.stringify(x,null,2));
const storage=multer.diskStorage({destination:(req,file,cb)=>cb(null,uploadDir),filename:(req,file,cb)=>cb(null,Date.now()+'-'+crypto.randomBytes(5).toString('hex')+path.extname(file.originalname))});
const upload=multer({storage,limits:{files:12,fileSize:10*1024*1024},fileFilter:(req,file,cb)=>cb(null,file.mimetype.startsWith('image/'))});
app.use(express.json());app.use(express.static(path.join(__dirname,'public')));app.use('/uploads',express.static(uploadDir));
app.get('/admin',(req,res)=>res.sendFile(path.join(__dirname,'public','admin.html')));
app.post('/api/requests',upload.array('photos',12),(req,res)=>{
 const id='NP-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+crypto.randomBytes(3).toString('hex').toUpperCase();
 const item={id,createdAt:new Date().toISOString(),status:'New',name:req.body.name,phone:req.body.phone,location:req.body.location,property:req.body.property,service:req.body.service,area:req.body.area,rooms:req.body.rooms,date:req.body.date,details:req.body.details,photos:(req.files||[]).map(f=>'/uploads/'+f.filename),amount:'',message:''};
 const all=read();all.unshift(item);write(all);res.json({id});
});
app.get('/api/requests',(req,res)=>res.json(read().map(x=>({...x,photos:undefined,details:undefined,message:undefined}))));
app.get('/api/requests/:id',(req,res)=>{const x=read().find(a=>a.id===req.params.id);if(!x)return res.status(404).json({error:'Not found'});res.json(x)});
app.patch('/api/requests/:id',(req,res)=>{const all=read(),i=all.findIndex(a=>a.id===req.params.id);if(i<0)return res.status(404).json({error:'Not found'});all[i]={...all[i],status:req.body.status||all[i].status,amount:req.body.amount??all[i].amount,message:req.body.message??all[i].message,updatedAt:new Date().toISOString()};write(all);res.json(all[i])});
app.listen(PORT,()=>console.log('Namma Painters quote system running on http://localhost:'+PORT));
