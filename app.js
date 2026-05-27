```javascript
const express = require('express');
const fs = require('fs');
const app = express();

const PORT = 3000;

/* =========================
   READ JSON FILES
========================= */

function getJobs(sector) {
  const data = fs.readFileSync('jobs.json');
  const jobs = JSON.parse(data);
  return jobs.filter(job => job.sector === sector);
}

function getArticles() {
  if (!fs.existsSync('articles.json')) return [];
  return JSON.parse(fs.readFileSync('articles.json'));
}

function getStories() {
  if (!fs.existsSync('stories.json')) return [];
  return JSON.parse(fs.readFileSync('stories.json'));
}

/* =========================
   GLOBAL STYLE
========================= */
function pageStyle() {
return `
<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
font-family:Arial;
background:#f5f9ff;
direction:rtl;
overflow-x:hidden;
}

/* NAVBAR */

.navbar{
width:100%;
background:#0b1220;
display:flex;
justify-content:space-between;
align-items:center;
padding:18px 60px;
position:sticky;
top:0;
z-index:1000;
}

.logo{
color:white;
font-size:24px;
font-weight:bold;
}

.nav-links{
display:flex;
gap:25px;
}

.nav-links a{
color:white;
text-decoration:none;
font-size:15px;
transition:0.3s;
}

.nav-links a:hover{
color:#4ea1ff;
}

/* HERO */

.hero{
width:100%;
padding:70px 60px;
display:flex;
justify-content:space-between;
align-items:center;
background:linear-gradient(to left,#eef5ff,#ffffff);
}

.hero-text{
width:50%;
}

.hero-text h1{
font-size:48px;
color:#111827;
margin-bottom:20px;
line-height:1.5;
}

.hero-text p{
font-size:20px;
color:#6b7280;
line-height:2;
}

.hero-image{
width:45%;
display:flex;
justify-content:center;
}

.hero-image img{
width:100%;
max-width:500px;
}

/* SECTION */

.section{
padding:60px 50px;
}

.section-title{
font-size:34px;
font-weight:bold;
text-align:center;
margin-bottom:40px;
color:#111827;
}

/* CARDS */

.cards{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
gap:25px;
}

.card{
background:white;
border-radius:20px;
padding:35px 20px;
text-align:center;
text-decoration:none;
color:black;
transition:0.3s;
box-shadow:0 5px 18px rgba(0,0,0,0.08);
}

.card:hover{
transform:translateY(-8px);
}

.card-icon{
font-size:55px;
margin-bottom:20px;
}

.card h3{
font-size:24px;
margin-bottom:10px;
}

.card p{
color:#6b7280;
line-height:1.8;
}

/* COLORS */

.health{
background:linear-gradient(135deg,#dbeafe,#bfdbfe);
}

.engineering{
background:linear-gradient(135deg,#ede9fe,#ddd6fe);
}

.education{
background:linear-gradient(135deg,#dcfce7,#bbf7d0);
}

.management{
background:linear-gradient(135deg,#fee2e2,#fecaca);
}

.article{
background:linear-gradient(135deg,#fff7ed,#fed7aa);
}

.story{
background:linear-gradient(135deg,#ecfeff,#a5f3fc);
}

.contest{
background:linear-gradient(135deg,#fdf4ff,#f5d0fe);
}

/* ARTICLE PAGE */

.page-container{
width:90%;
max-width:900px;
margin:auto;
padding:40px 0;
}

.post{
background:white;
padding:30px;
border-radius:20px;
margin-bottom:25px;
box-shadow:0 5px 18px rgba(0,0,0,0.08);
}

.post h2{
font-size:32px;
margin-bottom:20px;
color:#111827;
}

.post p{
font-size:18px;
line-height:2.2;
color:#374151;
}

/* FOOTER */

.footer{
background:#0b1220;
padding:50px 30px;
margin-top:70px;
color:white;
}

.footer-container{
display:flex;
justify-content:space-between;
flex-wrap:wrap;
gap:30px;
}

.footer-box h3{
margin-bottom:20px;
font-size:22px;
}

.footer-box a{
display:block;
margin-bottom:12px;
color:#d1d5db;
text-decoration:none;
}

.footer-box a:hover{
color:white;
}

.socials{
display:flex;
gap:15px;
margin-top:15px;
}

.socials a{
width:45px;
height:45px;
background:#111827;
border-radius:50%;
display:flex;
justify-content:center;
align-items:center;
text-decoration:none;
color:white;
font-size:20px;
transition:0.3s;
}

.socials a:hover{
background:#2563eb;
}

/* MOBILE */

@media(max-width:900px){

.navbar{
padding:18px 20px;
flex-direction:column;
gap:20px;
}

.hero{
flex-direction:column;
padding:50px 20px;
text-align:center;
}

.hero-text{
width:100%;
margin-bottom:40px;
}

.hero-text h1{
font-size:35px;
}

.hero-image{
width:100%;
}

.section{
padding:50px 20px;
}

}

</style>
`;
}
/* =========================
   HOME PAGE
========================= */

app.get('/', (req,res)=>{

res.send(`
<html>

<head>

${pageStyle()}

<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>

</head>

<body>

<div class="navbar">

<div class="logo">
وظائف الوطن العربي
</div>

<div class="nav-links">
<a href="/">الرئيسية</a>
<a href="/articles">مقالات</a>
<a href="/stories">قصص</a>
<a href="/about">من نحن</a>
<a href="/contact">اتصل بنا</a>
</div>

</div>

<div class="hero">

<div class="hero-text">

<h1>
ابحث عن وظيفتك القادمة في الوطن العربي
</h1>

<p>
مئات الفرص الوظيفية في مختلف المجالات في انتظارك
</p>

</div>

<div class="hero-image">

<img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png">

</div>

</div>

<div class="section">

<div class="section-title">
تصفح الوظائف حسب القطاع
</div>

<div class="cards">

<a href="/jobs/health/page/1" class="card health">
<div class="card-icon">🩺</div>
<h3>قطاع الصحة</h3>
<p>وظائف المستشفيات والتمريض والصيدلة</p>
</a>

<a href="/jobs/engineering/page/1" class="card engineering">
<div class="card-icon">⚙️</div>
<h3>قطاع الهندسة</h3>
<p>وظائف الهندسة المدنية والمعمارية</p>
</a>

<a href="/jobs/education/page/1" class="card education">
<div class="card-icon">🎓</div>
<h3>قطاع التعليم</h3>
<p>وظائف المدارس والجامعات والتعليم</p>
</a>

<a href="/jobs/management/page/1" class="card management">
<div class="card-icon">💻</div>
<h3>قطاع الإدارة والتكنولوجيا</h3>
<p>وظائف الإدارة والبرمجة والتقنية</p>
</a>

</div>

</div>

<div class="section">

<div class="section-title">
استكشف المزيد
</div>

<div class="cards">

<a href="/contests" class="card contest">
<div class="card-icon">🏆</div>
<h3>مسابقات واختبارات</h3>
<p>اختبارات ومسابقات تفاعلية ممتعة</p>
</a>

<a href="/stories" class="card story">
<div class="card-icon">✨</div>
<h3>قصص ملهمة</h3>
<p>قصص نجاح وتجارب ملهمة</p>
</a>

<a href="/articles" class="card article">
<div class="card-icon">📰</div>
<h3>أحدث المقالات</h3>
<p>مقالات مفيدة ونصائح مهنية</p>
</a>

</div>

</div>

<div class="footer">

<div class="footer-container">

<div class="footer-box">

<h3>روابط سريعة</h3>

<a href="/">الرئيسية</a>
<a href="/articles">مقالات</a>
<a href="/stories">قصص</a>
<a href="/about">من نحن</a>

</div>

<div class="footer-box">

<h3>وظائف الوطن العربي</h3>

<p>
منصة عربية لعرض الوظائف والمقالات
والقصص والمسابقات.
</p>

<div class="socials">

<a href="https://instagram.com">
<i class="fab fa-instagram"></i>
</a>

<a href="https://facebook.com">
<i class="fab fa-facebook-f"></i>
</a>

<a href="mailto:test@gmail.com">
<i class="fas fa-envelope"></i>
</a>

<a href="https://x.com">
<i class="fab fa-x-twitter"></i>
</a>

</div>

</div>

</div>

</div>

</body>
</html>
`);

});

/* =========================
   ARTICLES PAGE
========================= */

app.get('/articles',(req,res)=>{

const articles = getArticles();

let html = `
<html>
<head>
${pageStyle()}
</head>
<body>

<div class="page-container">

<h1 class="section-title">
المقالات
</h1>
`;

articles.forEach(article=>{

html += `
<div class="post">

<h2>
${article.title}
</h2>

<p>
${article.content}
</p>

</div>
`;

});

html += `</div></body></html>`;

res.send(html);

});

/* =========================
   STORIES PAGE
========================= */

app.get('/stories',(req,res)=>{

const stories = getStories();

let html = `
<html>
<head>
${pageStyle()}
</head>
<body>

<div class="page-container">

<h1 class="section-title">
القصص الملهمة
</h1>
`;

stories.forEach(story=>{

html += `
<div class="post">

<h2>
${story.title}
</h2>

<p>
${story.content}
</p>

</div>
`;

});

html += `</div></body></html>`;

res.send(html);

});

/* =========================
   ABOUT
========================= */

app.get('/about',(req,res)=>{

res.send(`
<html>
<head>
${pageStyle()}
</head>
<body>

<div class="page-container">

<div class="post">

<h2>
من نحن
</h2>

<p>
نحن موقع وظائف...
</p>

</div>

</div>

</body>
</html>
`);

});

/* =========================
   CONTACT
========================= */

app.get('/contact',(req,res)=>{

res.send(`
<html>

<head>

${pageStyle()}

<link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>

</head>

<body>

<div class="page-container">

<div class="post" style="text-align:center;">

<h2>
اتصل بنا
</h2>

<div class="socials"
style="justify-content:center;margin-top:30px;">

<a href="https://instagram.com">
<i class="fab fa-instagram"></i>
</a>

<a href="https://facebook.com">
<i class="fab fa-facebook-f"></i>
</a>

<a href="mailto:test@gmail.com">
<i class="fas fa-envelope"></i>
</a>

<a href="https://x.com">
<i class="fab fa-x-twitter"></i>
</a>

</div>

</div>

</div>

</body>
</html>
`);

});

/* =========================
   JOBS PAGE
========================= */

app.get('/jobs/:sector/page/:page',(req,res)=>{

const sector = req.params.sector;
const page = parseInt(req.params.page);

const jobs = getJobs(sector);

const perPage = 5;

const start = (page-1)*perPage;
const end = start+perPage;

const paginatedJobs = jobs.slice(start,end);

let html = `
<html>

<head>
${pageStyle()}
</head>

<body>

<div class="page-container">

<h1 class="section-title">
الوظائف
</h1>
`;

paginatedJobs.forEach(job=>{

html += `
<div class="post">

<h2>
${job.title}
</h2>

<p>
${job.description.substring(0,150)}...
</p>

<a href="/jobs/${sector}/job/${job.id}"
style="
display:inline-block;
margin-top:15px;
background:#2563eb;
color:white;
padding:12px 25px;
border-radius:10px;
text-decoration:none;
">
عرض الوظيفة
</a>

</div>
`;

});

html += `</div></body></html>`;

res.send(html);

});

/* =========================
   JOB DETAILS
========================= */

app.get('/jobs/:sector/job/:id',(req,res)=>{

const sector = req.params.sector;
const id = parseInt(req.params.id);

const jobs = getJobs(sector);

const job = jobs.find(j=>j.id===id);

if(!job){
return res.send("الوظيفة غير موجودة");
}

res.send(`
<html>

<head>
${pageStyle()}
</head>

<body>

<div class="page-container">

<div class="post">

<h2>
${job.title}
</h2>

<p>
${job.description}
</p>

<br>

<a href="${job.applyLink || '#'}"
target="_blank"
style="
display:inline-block;
background:#2563eb;
color:white;
padding:14px 30px;
border-radius:10px;
text-decoration:none;
">

التقديم الآن

</a>

</div>

</div>

</body>
</html>
`);

});

/* ========================= */

app.listen(PORT,()=>{

console.log("Server Running");

});
```
