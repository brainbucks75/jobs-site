const express = require('express');
const fs = require('fs');
const app = express();

const PORT = 3000;

// قراءة الوظائف
function getJobs(sector) {
  const data = fs.readFileSync('jobs.json');
  const jobs = JSON.parse(data);
  return jobs.filter(job => job.sector === sector);
}

// قراءة المقالات
function getArticles() {
  if (!fs.existsSync('articles.json')) return [];
  return JSON.parse(fs.readFileSync('articles.json'));
}

// قراءة القصص
function getStories() {
  if (!fs.existsSync('stories.json')) return [];
  return JSON.parse(fs.readFileSync('stories.json'));
}

/* ===================== */
/*        HOME PAGE      */
/* ===================== */
app.get('/', (req, res) => {

  res.send(`
  <html>
  <head>
  <style>
    body{
      margin:0;
      font-family:Arial;
      background:#f5f6fa;
    }

    /* NAVBAR */
    .nav{
      background:#0d0d0d;
      color:white;
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:15px 20px;
      position:sticky;
      top:0;
    }

    .nav a{
      color:white;
      margin:0 10px;
      text-decoration:none;
      font-size:14px;
    }

    /* HERO */
    .hero{
      display:flex;
      justify-content:space-between;
      align-items:center;
      padding:40px;
      background:linear-gradient(120deg,#111,#333);
      color:white;
    }

    .hero h1{font-size:32px;}
    .hero p{opacity:0.8;}

    .hero img{
      width:300px;
      border-radius:10px;
    }

    /* SECTIONS */
    .section-title{
      text-align:center;
      margin:30px 0;
      font-size:22px;
      font-weight:bold;
    }

    .grid{
      display:flex;
      flex-wrap:wrap;
      justify-content:center;
      gap:15px;
      padding:20px;
    }

    .card{
      background:white;
      padding:20px;
      width:220px;
      text-align:center;
      border-radius:12px;
      box-shadow:0 3px 10px rgba(0,0,0,0.1);
      text-decoration:none;
      color:black;
      transition:0.3s;
    }

    .card:hover{
      transform:translateY(-5px);
    }

    /* FOOTER */
    .footer{
      background:#0d0d0d;
      color:white;
      text-align:center;
      padding:30px;
      margin-top:40px;
    }

    .social a{
      color:white;
      margin:0 10px;
      text-decoration:none;
    }
  </style>
  </head>

  <body>

  <div class="nav">
    <div>وظائف الوطن العربي</div>
    <div>
      <a href="/">الرئيسية</a>
      <a href="/articles">مقالات</a>
      <a href="/stories">قصص</a>
      <a href="/about">من نحن</a>
      <a href="/contact">اتصل بنا</a>
    </div>
  </div>

  <div class="hero">
    <div>
      <h1>ابحث عن وظيفتك القادمة في الوطن العربي</h1>
      <p>مئات الفرص الوظيفية في مختلف المجالات في انتظارك</p>
    </div>
    <img src="https://i.imgur.com/3ZQ3ZQz.png" />
  </div>

  <div class="section-title">تصفح الوظائف حسب القطاع</div>

  <div class="grid">
    <a class="card" href="/jobs/health/page/1">قطاع الصحة</a>
    <a class="card" href="/jobs/engineering/page/1">قطاع الهندسة</a>
    <a class="card" href="/jobs/education/page/1">قطاع التعليم</a>
    <a class="card" href="/jobs/management/page/1">قطاع الإدارة والتكنولوجيا</a>
  </div>

  <div class="section-title">استكشف</div>

  <div class="grid">
    <a class="card" href="/articles">أحدث المقالات</a>
    <a class="card" href="/stories">قصص ملهمة</a>
    <a class="card" href="/contests">مسابقات واختبارات</a>
  </div>

  <div class="footer">
    <p>روابط سريعة</p>

    <div class="social">
      <a href="https://instagram.com">Instagram</a>
      <a href="mailto:test@gmail.com">Email</a>
      <a href="https://facebook.com">Facebook</a>
      <a href="https://x.com">X</a>
    </div>

    <p>© وظائف الوطن العربي</p>
  </div>

  </body>
  </html>
  `);
});

/* ===================== */
/*      ARTICLES PAGE    */
/* ===================== */
app.get('/articles', (req, res) => {

  const articles = getArticles();

  let html = `<html><body style="font-family:Arial;background:#f5f5f5;padding:20px;">`;

  html += `<h1>المقالات</h1>`;

  articles.forEach(a=>{
    html += `
      <div style="background:white;padding:20px;margin:10px;border-radius:10px;">
        <h2>${a.title}</h2>
        <p>${a.content}</p>
      </div>
    `;
  });

  html += `</body></html>`;
  res.send(html);
});

/* ===================== */
/*       STORIES         */
/* ===================== */
app.get('/stories', (req, res) => {

  const stories = getStories();

  let html = `<html><body style="font-family:Arial;background:#f5f5f5;padding:20px;">`;

  html += `<h1>القصص</h1>`;

  stories.forEach(s=>{
    html += `
      <div style="background:white;padding:20px;margin:10px;border-radius:10px;">
        <h2>${s.title}</h2>
        <p>${s.content}</p>
      </div>
    `;
  });

  html += `</body></html>`;
  res.send(html);
});

/* ===================== */
/*      ABOUT PAGE       */
/* ===================== */
app.get('/about', (req, res) => {
  res.send(`
    <h1 style="font-family:Arial;text-align:center;">نحن موقع وظائف</h1>
  `);
});

/* ===================== */
/*     CONTACT PAGE      */
/* ===================== */
app.get('/contact', (req, res) => {
  res.send(`
  <div style="font-family:Arial;text-align:center;">
    <h2>اتصل بنا</h2>

    <div>
      <a href="https://instagram.com">Instagram</a><br>
      <a href="https://facebook.com">Facebook</a><br>
      <a href="mailto:test@gmail.com">Email</a><br>
      <a href="https://x.com">X</a>
    </div>
  </div>
  `);
});

/* ===================== */
/*     JOB ROUTES        */
/* (نفس نظامك القديم)   */
/* ===================== */

app.get('/jobs/:sector/page/:page', (req,res)=>{
  const sector = req.params.sector;
  const page = parseInt(req.params.page);

  const jobs = getJobs(sector);
  const perPage = 5;

  const start = (page-1)*perPage;
  const end = start+perPage;

  const list = jobs.slice(start,end);

  let html = `<h1>${sector}</h1>`;

  list.forEach(j=>{
    html += `<div><a href="/jobs/${sector}/job/${j.id}">${j.title}</a></div>`;
  });

  res.send(html);
});

app.get('/jobs/:sector/job/:id', (req,res)=>{
  const jobs = getJobs(req.params.sector);
  const job = jobs.find(j=>j.id==req.params.id);

  res.send(`
    <h1>${job.title}</h1>
    <p>${job.description}</p>
  `);
});

app.listen(PORT, ()=>console.log("Running on "+PORT));