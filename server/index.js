const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const CONFIG_FILE = path.join(DATA, 'config.json');
const AUTH_FILE = path.join(DATA, 'admin-auth.json');
const RSVP_FILE = path.join(DATA, 'rsvps.json');
const UPLOADS = path.join(ROOT, 'uploads');
const PORT = Number(process.env.PORT || 3000);

for (const dir of [DATA, UPLOADS]) fs.mkdirSync(dir, { recursive: true });

const mime = {
  '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg',
  '.webp':'image/webp','.gif':'image/gif','.mp3':'audio/mpeg','.wav':'audio/wav','.m4a':'audio/mp4','.mp4':'video/mp4',
  '.woff2':'font/woff2','.ico':'image/x-icon'
};
function json(res,status,payload){const body=JSON.stringify(payload);res.writeHead(status,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','access-control-allow-origin':'*'});res.end(body)}
function readJson(file,fallback){try{return JSON.parse(fs.readFileSync(file,'utf8'))}catch{return fallback}}
function writeJson(file,data){fs.writeFileSync(file,JSON.stringify(data,null,2))}
function body(req){return new Promise((resolve,reject)=>{const chunks=[];req.on('data',c=>chunks.push(c));req.on('end',()=>resolve(Buffer.concat(chunks)));req.on('error',reject)})}
function safeName(name){return String(name||'upload').replace(/[^a-zA-Z0-9._-]+/g,'-').slice(-120)||'upload'}
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){const hash=crypto.pbkdf2Sync(password,salt,120000,32,'sha256').toString('hex');return {salt,hash}}
function passwordOk(password){const auth=readJson(AUTH_FILE,null);if(!auth)return false;const trial=hashPassword(password,auth.salt).hash;return crypto.timingSafeEqual(Buffer.from(trial,'hex'),Buffer.from(auth.hash,'hex'))}
function authConfigured(){const auth=readJson(AUTH_FILE,null);return !!(auth&&typeof auth.hash==='string'&&auth.hash.length&&typeof auth.salt==='string'&&auth.salt.length)}
function isAuthed(req){return authConfigured() && passwordOk(req.headers['x-admin-password']||'')}
function serveFile(req,res,pathname){
  let rel=decodeURIComponent(pathname);
  if(rel==='/'||rel==='') rel='/index.html';
  if(rel==='/admin') rel='/admin.html';
  if(rel==='/admin/') rel='/admin.html';
  const clean=path.normalize(rel).replace(/^([.][.][/\\])+/, '').replace(/^[/\\]+/,'');
  const file=path.join(ROOT,clean);
  if(!file.startsWith(ROOT) || !fs.existsSync(file) || !fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return}
  const ext=path.extname(file).toLowerCase();
  res.writeHead(200,{'content-type':mime[ext]||'application/octet-stream','cache-control':ext==='.html'?'no-cache':'public,max-age=31536000,immutable'});
  fs.createReadStream(file).pipe(res);
}

const server=http.createServer(async(req,res)=>{
  try{
    const u=new URL(req.url,`http://${req.headers.host||'localhost'}`);
    if(req.method==='OPTIONS'){res.writeHead(204,{'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,PUT,OPTIONS','access-control-allow-headers':'content-type,x-admin-password'});return res.end()}
    if(u.pathname==='/api/config' && req.method==='GET'){return json(res,200,readJson(CONFIG_FILE,{}))}
    if(u.pathname==='/api/admin/status' && req.method==='GET'){return json(res,200,{initialized:authConfigured()})}
    if(u.pathname==='/api/admin/setup' && req.method==='POST'){
      if(authConfigured())return json(res,409,{error:'Admin password is already configured.'});
      const data=JSON.parse((await body(req)).toString('utf8')||'{}');
      if(typeof data.password!=='string'||data.password.length<8)return json(res,400,{error:'Use at least 8 characters.'});
      writeJson(AUTH_FILE,hashPassword(data.password));return json(res,200,{ok:true});
    }
    if(u.pathname==='/api/admin/config' && req.method==='GET'){
      if(!isAuthed(req))return json(res,401,{error:'Invalid admin password.'});
      return json(res,200,{config:readJson(CONFIG_FILE,{}),rsvps:readJson(RSVP_FILE,[])});
    }
    if(u.pathname==='/api/admin/config' && req.method==='POST'){
      if(!isAuthed(req))return json(res,401,{error:'Invalid admin password.'});
      const data=JSON.parse((await body(req)).toString('utf8')||'{}');
      if(!data.config||typeof data.config!=='object')return json(res,400,{error:'Invalid config.'});
      writeJson(CONFIG_FILE,data.config);return json(res,200,{config:data.config});
    }
    if(u.pathname==='/api/admin/rsvps' && req.method==='GET'){
      if(!isAuthed(req))return json(res,401,{error:'Invalid admin password.'});
      return json(res,200,{rsvps:readJson(RSVP_FILE,[])});
    }
    if(u.pathname==='/api/admin/upload' && req.method==='PUT'){
      if(!isAuthed(req))return json(res,401,{error:'Invalid admin password.'});
      const data=await body(req); const name=safeName(u.searchParams.get('name')); const stamp=Date.now();
      const file=path.join(UPLOADS,`${stamp}-${name}`); fs.writeFileSync(file,data);
      return json(res,200,{url:`/uploads/${path.basename(file)}`});
    }
    if(u.pathname==='/api/rsvp' && req.method==='POST'){
      const data=JSON.parse((await body(req)).toString('utf8')||'{}');
      const list=readJson(RSVP_FILE,[]);list.push({...data,createdAt:new Date().toISOString()});writeJson(RSVP_FILE,list);return json(res,200,{ok:true});
    }
    return serveFile(req,res,u.pathname);
  }catch(error){console.error(error);json(res,500,{error:'Server error.'})}
});
server.listen(PORT,()=>console.log(`Wedding site: http://localhost:${PORT}`));
