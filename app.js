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

function getAllJobs() {
  if (!fs.existsSync('jobs.json')) return [];
  return JSON.parse(fs.readFileSync('jobs.json'));
}

function getArticles() {
  if (!fs.existsSync('articles.json')) return [];
  return JSON.parse(fs.readFileSync('articles.json'));
}

function getStories() {
  if (!fs.existsSync('stories.json')) return [];
  return JSON.parse(fs.readFileSync('stories.json'));
}
function getPrivacy() {
  if (!fs.existsSync('privacy.json')) return null;
  return JSON.parse(fs.readFileSync('privacy.json'));
}
function getGeneralQuestions() {
  return JSON.parse(fs.readFileSync('generalQuestions.json', 'utf8'));
}
function getTrueFalseQuestions(){
  return JSON.parse(fs.readFileSync('trueFalseQuestions.json', 'utf8'));
}
function getWhoAmIQuestions(){
  return JSON.parse(fs.readFileSync('whoAmIQuestions.json', 'utf8'));
}
function getOddOneOutQuestions(){
  return JSON.parse(fs.readFileSync('oddOneOutQuestions.json', 'utf8'));
}
function getInternationalQuestions(){
  return JSON.parse(fs.readFileSync('internationalQuestions.json', 'utf8'));
}
function getIslamicQuestions(){
  return JSON.parse(fs.readFileSync('islamicQuestions.json', 'utf8'));
}
function getWrongInfoQuestions(){
  return JSON.parse(fs.readFileSync('wrongInfoQuestions.json', 'utf8'));
}
function getTimeQuestions(){
  return JSON.parse(fs.readFileSync('timeQuestions.json', 'utf8'));
}
function shuffle(array) {
  const arr = [...array]; // مهم حتى لا نغيّر الأصل
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
/* =========================
   GLOBAL STYLE (NEW DESIGN)
========================= */
function pageStyle() {
return `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
<style>
:root{
  --navy:#15203a;
  --navy-2:#1b2746;
  --brand:#3b82f6;
  --brand-2:#2563eb;
  --bg:#f6f8fc;
  --card:#ffffff;
  --text:#0f172a;
  --muted:#64748b;
  --border:#e5e7eb;

  --health:#10b981;
  --eng:#7c3aed;
  --edu:#c026d3;
  --tech:#f59e0b;

  --shadow:0 10px 30px -12px rgba(15,23,42,.18);
  --radius:18px;
}

*{margin:0;padding:0;box-sizing:border-box}
html,body{font-family:'Cairo',Arial,sans-serif}
body{background:var(--bg);color:var(--text);direction:rtl;overflow-x:hidden;line-height:1.7}
a{text-decoration:none;color:inherit}
img{max-width:100%;display:block}

.container{max-width:1200px;margin:0 auto;padding:0 24px}

/* HEADER */
.navbar{background:var(--navy);color:#fff}
.navbar .inner{display:flex;justify-content:space-between;align-items:center;padding:18px 24px;max-width:1200px;margin:0 auto}
.logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:18px}
.logo i{color:var(--brand)}
.nav-links{display:flex;gap:26px}
.nav-links a{font-size:14px;color:#e5e7eb;transition:.25s}
.nav-links a:hover{color:var(--brand)}

/* HERO */
.hero{background:linear-gradient(135deg,#eaf1ff 0%,#f6f8fc 60%);padding:64px 0}
.hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
.hero h1{font-size:44px;font-weight:800;line-height:1.35;color:var(--text)}
.hero h1 .accent{color:var(--brand-2)}
.hero p{margin-top:18px;color:var(--muted);font-size:16px}
.hero-image{border-radius:24px;overflow:hidden;box-shadow:var(--shadow)}
.hero-image img{width:100%;height:auto;object-fit:cover}

/* SECTION TITLE */
.section{padding:64px 0}
.section-title{text-align:center;font-size:28px;font-weight:800;margin-bottom:36px}

/* SECTOR CARDS */
.sector-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.sector-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:28px 20px;text-align:center;box-shadow:var(--shadow);transition:.3s;display:flex;flex-direction:column;align-items:center}
.sector-card:hover{transform:translateY(-6px)}
.sector-icon{width:64px;height:64px;border-radius:18px;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:16px;color:#fff}
.sector-card h3{font-size:16px;font-weight:700;margin-bottom:6px}
.sector-card .count{color:var(--muted);font-size:13px;margin-bottom:18px}
.sector-btn{display:inline-block;padding:9px 20px;border-radius:10px;color:#fff;font-size:13px;font-weight:600;transition:.25s}
.sector-btn:hover{opacity:.9}

.s-health .sector-icon,.s-health .sector-btn{background:var(--health)}
.s-eng    .sector-icon,.s-eng    .sector-btn{background:var(--eng)}
.s-edu    .sector-icon,.s-edu    .sector-btn{background:var(--edu)}
.s-tech   .sector-icon,.s-tech   .sector-btn{background:var(--tech)}

.center{text-align:center;margin-top:36px}
.btn-primary{display:inline-block;background:var(--brand-2);color:#fff;padding:12px 28px;border-radius:10px;font-weight:600;font-size:14px;transition:.25s}
.btn-primary:hover{background:#1d4ed8}

/* THREE COL */
.three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.content-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);display:flex;flex-direction:column}
.cc-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)}
.cc-head h3{font-size:16px;font-weight:700}
.cc-head a{color:var(--brand-2);font-size:12px}
.cc-thumb{height:170px;width:100%;object-fit:cover}
.cc-feature{padding:18px 20px}
.cc-feature h4{font-size:15px;font-weight:700;line-height:1.5}
.cc-feature .date{color:var(--muted);font-size:12px;margin-top:8px}
.cc-list{border-top:1px solid var(--border)}
.cc-item{display:flex;gap:10px;padding:14px 20px;border-bottom:1px solid var(--border);transition:.2s}
.cc-item:last-child{border-bottom:none}
.cc-item:hover{background:#f8fafc}
.cc-item i{color:var(--muted);font-size:13px;margin-top:5px}
.cc-item .t{font-size:14px;font-weight:600}
.cc-item .d{color:var(--muted);font-size:12px;margin-top:4px}

/* FEATURES BAR */
.features{background:#eaf1ff;border-radius:var(--radius);padding:34px;margin-bottom:64px}
.feat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
.feat{text-align:center}
.feat-ic{width:56px;height:56px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;color:var(--brand-2);font-size:20px;box-shadow:var(--shadow)}
.feat h4{font-size:14px;font-weight:700}
.feat p{color:var(--muted);font-size:12px;margin-top:4px}

/* JOBS / POSTS */
.page-container{max-width:900px;margin:0 auto;padding:48px 24px}
.page-container .section-title{margin-bottom:28px}
.post{background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:26px;margin-bottom:18px;box-shadow:var(--shadow)}
.post h2{font-size:22px;margin-bottom:14px;color:var(--text);font-weight:800}
.post p{font-size:15px;line-height:2;color:#334155;white-space:pre-line}
.post .apply{display:inline-block;margin-top:16px;background:var(--brand-2);color:#fff;padding:11px 24px;border-radius:10px;font-weight:600;font-size:14px;transition:.25s}
.post .apply:hover{background:#1d4ed8}

/* FOOTER */
.footer{background:var(--navy);color:#fff;padding:48px 0 22px;margin-top:60px}
.footer .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
.footer h4{font-size:16px;font-weight:700;margin-bottom:16px}
.footer a{display:block;color:#cbd5e1;font-size:14px;margin-bottom:10px;transition:.25s}
.footer a:hover{color:#fff}
.footer p{color:#cbd5e1;font-size:14px;line-height:1.9}
.socials{display:flex;gap:10px;margin-top:16px}
.socials a{width:36px;height:36px;background:rgba(255,255,255,.08);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0;transition:.25s}
.socials a:hover{background:rgba(255,255,255,.18)}
.copyright{border-top:1px solid rgba(255,255,255,.08);margin-top:30px;padding-top:18px;text-align:center;color:#94a3b8;font-size:12px}

/* MOBILE */
@media(max-width:900px){
  .navbar .inner{flex-direction:column;gap:14px;padding:16px}
  .nav-links{flex-wrap:wrap;justify-content:center;gap:16px}
  .hero{padding:40px 0}
  .hero-grid{grid-template-columns:1fr;text-align:center}
  .hero h1{font-size:30px}
  .sector-grid{grid-template-columns:repeat(2,1fr)}
  .three-col{grid-template-columns:1fr}
  .feat-grid{grid-template-columns:repeat(2,1fr)}
  .footer .grid{grid-template-columns:1fr;text-align:center}
  .socials{justify-content:center}
  .section{padding:44px 0}
}
</style>
`;
}

/* =========================
   SHARED HEADER / FOOTER
========================= */
function header(){
return `
<div class="navbar">
  <div class="inner">
    <nav class="nav-links">
      <a href="/contact">اتصل بنا</a>
      <a href="/about">من نحن</a>
      <a href="/stories">قصص</a>
      <a href="/articles">مقالات</a>
      <a href="/">الرئيسية</a>
    </nav>
    <div class="logo">
      <span>وظائف الوطن العربي</span>
      <i class="fas fa-briefcase"></i>
    </div>
  </div>
</div>
`;
}
function getContests() {
  if (!fs.existsSync('contests.json')) return [];
  return JSON.parse(fs.readFileSync('contests.json'));
}

function footer(){
return `
<div class="footer">
  <div class="container">
    <div class="grid">
      <div>
        <h4>روابط سريعة</h4>
        <a href="/">الوظائف</a>
        <a href="/articles">المقالات</a>
        <a href="/stories">القصص</a>
        <a href="/contests">المسابقات</a>
      </div>
      <div>
        <h4>معلومات</h4>
        <a href="/about">من نحن</a>
      <a href="/privacy">سياسة الخصوصية</a>
        <a href="#">شروط الاستخدام</a>
        <a href="/contact">اتصل بنا</a>
      </div>
      <div>
        <h4>وظائف الوطن العربي</h4>
        <p>منصة عربية تهدف إلى ربط الباحثين عن عمل بأفضل الفرص الوظيفية في الوطن العربي.</p>
        <div class="socials">
          <a href="https://www.instagram.com/brain_bucks_75/"><i class="fab fa-instagram"></i></a>
          <a href="mailto:brainbucks75@gmail.com"><i class="fas fa-envelope"></i></a>
          <a href="https://www.facebook.com/share/1BM7rk968P/"><i class="fab fa-facebook-f"></i></a>
          <a href="https://x.com/BrainBucks7"><i class="fab fa-x-twitter"></i></a>
        </div>
      </div>
    </div>
    <div class="copyright">جميع الحقوق محفوظة © 2026 وظائف الوطن العربي</div>
  </div>
</div>
`;
}

function getGeneralQuestions(){
  return JSON.parse(fs.readFileSync('generalQuestions.json'));
}

function layout(title, body){
return `<!doctype html><html lang="ar" dir="rtl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3462119395976615"
     crossorigin="anonymous"></script>
${pageStyle()}
</head><body>
${header()}
${body}
${footer()}
</body></html>`;
}

/* =========================
   HOME PAGE
========================= */
app.get('/', (req,res)=>{

  const allJobs = getAllJobs();
  const count = s => allJobs.filter(j=>j.sector===s).length;

  const articles = getArticles();
  const stories  = getStories();
  const featuredArticle = articles[0] || {title:'كيف تكتب سيرة ذاتية احترافية تجذب أصحاب العمل', date:'12 مايو 2024'};
  const featuredStory   = stories[0]   || {title:'رحلة نجاح: من الصفر إلى القمة', date:'11 مايو 2024'};
  const restArticles = articles.slice(1,3);
  const restStories  = stories.slice(1,3);

  const articleItems = restArticles.length ? restArticles.map(a=>`
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">${a.title}</div><div class="d">${a.date||''}</div></div></div>
  `).join('') : `
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">أهم المهارات المطلوبة في سوق العمل 2024</div><div class="d">10 مايو 2024</div></div></div>
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">أخطاء شائعة في مقابلات العمل وكيف تجنبها</div><div class="d">8 مايو 2024</div></div></div>
  `;

  const storyItems = restStories.length ? restStories.map(s=>`
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">${s.title}</div><div class="d">${s.date||''}</div></div></div>
  `).join('') : `
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">قصة شاب بدأ من لا شيء وأصبح رائد أعمال ناجح</div><div class="d">9 مايو 2024</div></div></div>
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">كيف غيّرت التعلم المستمر مجرى حياتي المهنية</div><div class="d">7 مايو 2024</div></div></div>
  `;

  const body = `
<section class="hero">
  <div class="container hero-grid">
    <div>
      <h1>ابحث عن وظيفتك القادمة<br><span class="accent">في الوطن العربي</span></h1>
      <p>مئات الفرص الوظيفية في مختلف المجالات في انتظارك</p>
    </div>
    <div class="hero-image">
      <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1280&q=80" alt="وظائف">
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title">تصفح الوظائف حسب القطاع</h2>
    <div class="sector-grid">
      <a href="/jobs/health/page/1" class="sector-card s-health">
        <div class="sector-icon"><i class="fas fa-heart-pulse"></i></div>
        <h3>قطاع الصحة</h3>
        <div class="count">${count('health')} وظيفة متاحة</div>
        <span class="sector-btn">عرض الوظائف</span>
      </a>
      <a href="/jobs/engineering/page/1" class="sector-card s-eng">
        <div class="sector-icon"><i class="fas fa-helmet-safety"></i></div>
        <h3>قطاع الهندسة</h3>
        <div class="count">${count('engineering')} وظيفة متاحة</div>
        <span class="sector-btn">عرض الوظائف</span>
      </a>
      <a href="/jobs/education/page/1" class="sector-card s-edu">
        <div class="sector-icon"><i class="fas fa-graduation-cap"></i></div>
        <h3>قطاع التعليم</h3>
        <div class="count">${count('education')} وظيفة متاحة</div>
        <span class="sector-btn">عرض الوظائف</span>
      </a>
      <a href="/jobs/management/page/1" class="sector-card s-tech">
        <div class="sector-icon"><i class="fas fa-briefcase"></i></div>
        <h3>قطاع الإدارة والتكنولوجيا</h3>
        <div class="count">${count('management')} وظيفة متاحة</div>
        <span class="sector-btn">عرض الوظائف</span>
      </a>
    </div>
    <div class="center"><a href="/jobs/health/page/1" class="btn-primary">عرض جميع القطاعات</a></div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="three-col">

      <div class="content-card">
        <div class="cc-head"><a href="/articles">عرض الكل</a><h3>أحدث المقالات</h3></div>
        <img class="cc-thumb" src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80" alt="">
        <div class="cc-feature">
          <h4>${featuredArticle.title}</h4>
          <div class="date">${featuredArticle.date || '12 مايو 2024'}</div>
        </div>
        <div class="cc-list">${articleItems}</div>
      </div>

      <div class="content-card">
        <div class="cc-head"><a href="/stories">عرض الكل</a><h3>قصص ملهمة</h3></div>
        <img class="cc-thumb" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" alt="">
        <div class="cc-feature">
          <h4>${featuredStory.title}</h4>
          <div class="date">${featuredStory.date || '11 مايو 2024'}</div>
        </div>
        <div class="cc-list">${storyItems}</div>
      </div>

      <div class="content-card">
        <div class="cc-head"><a href="/contests">عرض الكل</a><h3>مسابقات واختبارات</h3></div>
        <img class="cc-thumb" src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80" alt="">
        <div class="cc-feature">
          <h4>اختبر معلوماتك العامة واربح جوائز قيمة!</h4>
          <a class="date" href="/contests" style="color:var(--brand-2)">شارك الآن في المسابقة الأسبوعية</a>
        </div>
        <div class="cc-list">
          <div class="cc-item"><i class="fas fa-gift"></i><div class="t">مسابقة الثقافة العربية</div></div>
          <div class="cc-item"><i class="fas fa-lightbulb"></i><div class="t">اختبار الذكاء العام</div></div>
        </div>
      </div>

    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="container">
    <div class="features">
      <div class="feat-grid">
        <div class="feat"><div class="feat-ic"><i class="fas fa-globe"></i></div><h4>في جميع الدول العربية</h4><p>وظائف من كل أنحاء الوطن العربي</p></div>
        <div class="feat"><div class="feat-ic"><i class="fas fa-users"></i></div><h4>فرص للجميع</h4><p>آلاف الفرص في مختلف المجالات</p></div>
        <div class="feat"><div class="feat-ic"><i class="fas fa-clock"></i></div><h4>محدث يومياً</h4><p>نضيف وظائف جديدة كل يوم</p></div>
        <div class="feat"><div class="feat-ic"><i class="fas fa-shield-halved"></i></div><h4>موثوق وآمن</h4><p>نحرص على مصداقية جميع الوظائف</p></div>
      </div>
    </div>
  </div>
</section>
`;

  res.send(layout('وظائف الوطن العربي - ابحث عن وظيفتك القادمة', body));
});

/* =========================
   ARTICLES PAGE
========================= */
app.get('/articles', (req,res)=>{
  const articles = getArticles();

  let body = `
  <div class="page-container">
    <h1 class="section-title">المقالات</h1>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
  `;

  articles.forEach(a=>{
    body += `
      <a href="/articles/${a.id}" style="text-decoration:none;color:inherit">
        <div class="post" style="padding:0;overflow:hidden">
          <img src="${a.image}" style="width:100%;height:180px;object-fit:cover">

          <div style="padding:12px">
            <h2 style="font-size:18px;font-weight:800">
              ${a.title}
            </h2>
          </div>
        </div>
      </a>
    `;
  });

  body += `
    </div>
  </div>
  `;

  res.send(layout('المقالات', body));
});
app.get('/articles/:id', (req,res)=>{
  const articles = getArticles();
  const article = articles.find(a => a.id == req.params.id);

  if(!article){
    return res.send(layout('غير موجود','<div class="page-container"><div class="post">المقال غير موجود</div></div>'));
  }

  const body = `
  <div class="page-container">
    <div class="post">
      <h2 style="font-size:30px;font-weight:900">${article.title}</h2>

      <img src="${article.image}" style="width:100%;margin:20px 0;border-radius:12px">

      <p style="font-size:16px;line-height:2">
        ${article.content}
      </p>
    </div>
  </div>
  `;

  res.send(layout(article.title, body));
});
/* =========================
   STORIES PAGE
========================= */
app.get('/stories', (req,res)=>{
  const stories = getStories();

  let body = `
  <div class="page-container">
    <h1 class="section-title">القصص الملهمة</h1>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
  `;

  stories.forEach(s=>{
    body += `
      <a href="/stories/${s.id}" style="text-decoration:none;color:inherit">
        <div class="post" style="padding:0;overflow:hidden">
          <img src="${s.image}" style="width:100%;height:180px;object-fit:cover">
          <div style="padding:12px">
            <h2 style="font-size:18px;font-weight:800">
              ${s.title}
            </h2>
          </div>
        </div>
      </a>
    `;
  });

  body += `
    </div>
  </div>
  `;

  res.send(layout('القصص', body));
});
app.get('/stories/:id', (req,res)=>{
  const stories = getStories();
  const story = stories.find(s => s.id == req.params.id);

  if(!story){
    return res.send(layout('غير موجود','<div class="page-container"><div class="post">القصة غير موجودة</div></div>'));
  }

  const body = `
  <div class="page-container">
    <div class="post">
      <h2 style="font-size:30px;font-weight:900">${story.title}</h2>

      <img src="${story.image}" style="width:100%;margin:20px 0;border-radius:12px">

      <p style="font-size:16px;line-height:2">
        ${story.content}
      </p>
    </div>
  </div>
  `;

  res.send(layout(story.title, body));
});
/* =========================
   CONTESTS PAGE
========================= */
app.get('/contests', (req,res)=>{
  const contests = getContests();

  let body = `
  <div class="page-container">
    <h1 class="section-title">المسابقات</h1>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
  `;

  contests.forEach(c=>{
    body += `
      <a href="/contests/${c.id}" style="text-decoration:none;color:inherit">
        <div class="post" style="padding:0;overflow:hidden;cursor:pointer">

          <img src="${c.image}" 
               style="width:100%;height:180px;object-fit:cover">

          <div style="padding:12px;text-align:center">
            <h2 style="font-size:18px;font-weight:800">
              ${c.title}
            </h2>
          </div>

        </div>
      </a>
    `;
  });

  body += `</div></div>`;

  res.send(layout('المسابقات', body));
});
app.get('/contests/:id', (req,res)=>{
  const contests = getContests();
  const game = contests.find(c => c.id === req.params.id);

  if(!game){
    return res.send(layout('غير موجود','<div class="page-container"><div class="post">غير موجود</div></div>'));
  }

  // ⭐ لعبة الثقافة العامة
  if(game.id === "general"){

    const body = `
    <div class="page-container">
      <div class="post">

        <h2 style="text-align:center;font-size:26px;font-weight:900">
          ${game.title}
        </h2>

        <div id="quizBox"></div>

      </div>
    </div>

<script>
const questions = ${JSON.stringify(shuffle(getGeneralQuestions()))};
let index = 0;
let lock = false;

function showQ(){
  const q = questions[index];

  let html = \`
    <div style="
      background:linear-gradient(135deg,#d4af37,#f5d76e);
      padding:15px;
      border-radius:15px;
      color:white;
      font-weight:800;
      text-align:center;
      margin-bottom:15px;
    ">
      \${q.q}
    </div>
  \`;

  q.a.forEach((opt,i)=>{
    html += \`
      <div onclick="answer(\${i})"
        id="opt\${i}"
        style="
          background:linear-gradient(135deg,#d4af37,#b8860b);
          color:white;
          padding:14px;
          margin:10px 0;
          border-radius:12px;
          cursor:pointer;
          font-weight:700;
          text-align:center;
        ">
        \${opt}
      </div>
    \`;
  });

  document.getElementById("quizBox").innerHTML = html;
}

window.answer = function(i){
  if(lock) return;
  lock = true;

  const q = questions[index];
  const correct = q.correct;

  for(let j=0;j<q.a.length;j++){
    const el = document.getElementById("opt"+j);

    if(j === correct){
      el.style.background = "#22c55e";
    }
  }

  const selected = document.getElementById("opt"+i);

  if(i !== correct){
    selected.style.background = "#ef4444";
  }

  setTimeout(()=>{
    index++;
    lock = false;

    if(index < questions.length){
      showQ();
    } else {
      document.getElementById("quizBox").innerHTML =
      "<div style='text-align:center;font-size:22px;font-weight:900'>انتهت اللعبة 🎉</div>";
    }
  },1500);
}

showQ();
</script>
`;

    return res.send(layout(game.title, body));
  }
if(game.id === "truefalse"){

  const body = `
  <div class="page-container">
    <div class="post">

      <h2 style="text-align:center;font-size:26px;font-weight:900">
        ${game.title}
      </h2>

      <div id="quizBox"></div>

    </div>
  </div>

<script>
const questions = ${JSON.stringify(shuffle(getTrueFalseQuestions()))};
let index = 0;
let lock = false;

function showQ(){
  const q = questions[index];

  let html = \`
    <div style="
      background:linear-gradient(135deg,#d4af37,#f5d76e);
      padding:15px;
      border-radius:15px;
      color:white;
      font-weight:800;
      text-align:center;
      margin-bottom:15px;
    ">
      \${q.q}
    </div>
  \`;

  q.a.forEach((opt,i)=>{
    html += \`
      <div onclick="answer(\${i})"
        id="opt\${i}"
        style="
          background:linear-gradient(135deg,#d4af37,#b8860b);
          color:white;
          padding:14px;
          margin:10px 0;
          border-radius:12px;
          cursor:pointer;
          font-weight:700;
          text-align:center;
        ">
        \${opt}
      </div>
    \`;
  });

  document.getElementById("quizBox").innerHTML = html;
}

window.answer = function(i){
  if(lock) return;
  lock = true;

  const q = questions[index];
  const correct = q.correct;

  for(let j=0;j<q.a.length;j++){
    const el = document.getElementById("opt"+j);
    if(j === correct){
      el.style.background = "#22c55e";
    }
  }

  const selected = document.getElementById("opt"+i);

  if(i !== correct){
    selected.style.background = "#ef4444";
  }

  setTimeout(()=>{
    index++;
    lock = false;

    if(index < questions.length){
      showQ();
    } else {
      document.getElementById("quizBox").innerHTML =
      "<div style='text-align:center;font-size:22px;font-weight:900'>انتهت اللعبة 🎉</div>";
    }
  },1500);
}

showQ();
</script>
`;

  return res.send(layout(game.title, body));
}


if(game.id === "whoami"){

  const body = `
  <div class="page-container">
    <div class="post">

      <h2 style="text-align:center;font-size:26px;font-weight:900">
        ${game.title}
      </h2>

      <div id="quizBox"></div>

    </div>
  </div>

<script>
const questions = ${JSON.stringify(shuffle(getWhoAmIQuestions()))};

let index = 0;

function showQ(){
  const q = questions[index];

  document.getElementById("quizBox").innerHTML = \`
  
    <div style="
      background:linear-gradient(135deg,#d4af37,#f5d76e);
      padding:15px;
      border-radius:15px;
      color:white;
      font-weight:800;
      text-align:center;
      margin-bottom:15px;
      font-size:18px;
    ">
      \${q.q}
    </div>

    <input id="answerInput" placeholder="اكتب جوابك هنا"
      style="
        width:100%;
        padding:12px;
        border-radius:10px;
        border:1px solid #ccc;
        font-size:16px;
      "
    />

    <button onclick="checkAnswer()"
      style="
        margin-top:10px;
        width:100%;
        padding:12px;
        background:#3b82f6;
        color:white;
        border:none;
        border-radius:10px;
        font-weight:700;
        cursor:pointer;
      ">
      تأكيد
    </button>

    <div id="result" style="margin-top:15px;font-weight:700;text-align:center;"></div>
  
  \`;
}

window.checkAnswer = function(){

  const q = questions[index];
  const user = document.getElementById("answerInput").value.trim();

  const resultBox = document.getElementById("result");

  if(user === q.a[0]){
    resultBox.innerHTML = "✔ إجابة صحيحة";
    resultBox.style.color = "green";
  } else {
    resultBox.innerHTML = "✖ إجابة خاطئة. الصحيح: " + q.a[0];
    resultBox.style.color = "red";
  }

  setTimeout(()=>{
    index++;

    if(index < questions.length){
      showQ();
    } else {
      document.getElementById("quizBox").innerHTML =
      "<div style='text-align:center;font-size:22px;font-weight:900'>انتهت اللعبة 🎉</div>";
    }
  },1500);
}

showQ();
</script>
`;

  return res.send(layout(game.title, body));
}
if(game.id === "oddoneout"){

  const body = `
  <div class="page-container">
    <div class="post">

      <h2 style="text-align:center;font-size:26px;font-weight:900">
        ${game.title}
      </h2>

      <div id="quizBox"></div>

    </div>
  </div>

<script>

const questions = ${JSON.stringify(shuffle(getOddOneOutQuestions()))};
let index = 0;
let lock = false;

function showQ(){
  const q = questions[index];

  let html = \`
    <div style="
      background:linear-gradient(135deg,#d4af37,#f5d76e);
      padding:15px;
      border-radius:15px;
      color:white;
      font-weight:800;
      text-align:center;
      margin-bottom:15px;
      font-size:18px;
    ">
      \${q.q}
    </div>
  \`;

  q.a.forEach((opt,i)=>{
    html += \`
      <div onclick="answer(\${i})"
        id="opt\${i}"
        style="
          background:linear-gradient(135deg,#d4af37,#b8860b);
          color:white;
          padding:14px;
          margin:10px 0;
          border-radius:12px;
          cursor:pointer;
          font-weight:700;
          text-align:center;
          transition:0.3s;
        ">
        \${opt}
      </div>
    \`;
  });

  document.getElementById("quizBox").innerHTML = html;
}

window.answer = function(i){

  if(lock) return;
  lock = true;

  const q = questions[index];
  const correct = q.correct;

  for(let j=0;j<q.a.length;j++){
    const el = document.getElementById("opt"+j);
    if(j === correct){
      el.style.background = "#22c55e";
    }
  }

  const selected = document.getElementById("opt"+i);

  if(i !== correct){
    selected.style.background = "#ef4444";
  }

  setTimeout(()=>{
    index++;
    lock = false;

    if(index < questions.length){
      showQ();
    } else {
      document.getElementById("quizBox").innerHTML =
      "<div style='text-align:center;font-size:22px;font-weight:900'>انتهت اللعبة 🎉</div>";
    }
  },1500);
}

showQ();
</script>
`;

  return res.send(layout(game.title, body));
}

if(game.id === "international"){

  const body = `
  <div class="page-container">
    <div class="post">

      <h2 style="text-align:center;font-size:26px;font-weight:900">
        ${game.title}
      </h2>

      <div id="quizBox"></div>

    </div>
  </div>

<script>
const questions = ${JSON.stringify(shuffle(getInternationalQuestions()))};
let index = 0;
let lock = false;

function showQ(){
  const q = questions[index];

  let html = \`
    <div style="
      background:linear-gradient(135deg,#d4af37,#f5d76e);
      padding:15px;
      border-radius:15px;
      color:white;
      font-weight:800;
      text-align:center;
      margin-bottom:15px;
      font-size:18px;
    ">
      \${q.q}
    </div>
  \`;

  q.a.forEach((opt,i)=>{
    html += \`
      <div onclick="answer(\${i})"
        id="opt\${i}"
        style="
          background:linear-gradient(135deg,#d4af37,#b8860b);
          color:white;
          padding:14px;
          margin:10px 0;
          border-radius:12px;
          cursor:pointer;
          font-weight:700;
          text-align:center;
        ">
        \${opt}
      </div>
    \`;
  });

  document.getElementById("quizBox").innerHTML = html;
}

window.answer = function(i){

  if(lock) return;
  lock = true;

  const q = questions[index];
  const correct = q.correct;

  for(let j=0;j<q.a.length;j++){
    const el = document.getElementById("opt"+j);
    if(j === correct){
      el.style.background = "#22c55e";
    }
  }

  const selected = document.getElementById("opt"+i);

  if(i !== correct){
    selected.style.background = "#ef4444";
  }

  setTimeout(()=>{
    index++;
    lock = false;

    if(index < questions.length){
      showQ();
    } else {
      document.getElementById("quizBox").innerHTML =
      "<div style='text-align:center;font-size:22px;font-weight:900'>انتهت اللعبة 🎉</div>";
    }
  },1500);
}

showQ();
</script>
`;

  return res.send(layout(game.title, body));
}

if(game.id === "islamic"){

  const body = `
  <div class="page-container">
    <div class="post">

      <h2 style="text-align:center;font-size:26px;font-weight:900">
        ${game.title}
      </h2>

      <div id="quizBox"></div>

    </div>
  </div>

<script>
const questions = ${JSON.stringify(shuffle(getIslamicQuestions()))};
let index = 0;
let lock = false;

function showQ(){
  const q = questions[index];

  let html = \`
    <div style="
      background:linear-gradient(135deg,#0f766e,#14b8a6);
      padding:15px;
      border-radius:15px;
      color:white;
      font-weight:800;
      text-align:center;
      margin-bottom:15px;
    ">
      \${q.q}
    </div>
  \`;

  q.a.forEach((opt,i)=>{
    html += \`
      <div onclick="answer(\${i})"
        id="opt\${i}"
        style="
          background:linear-gradient(135deg,#0f766e,#115e59);
          color:white;
          padding:14px;
          margin:10px 0;
          border-radius:12px;
          cursor:pointer;
          font-weight:700;
          text-align:center;
        ">
        \${opt}
      </div>
    \`;
  });

  document.getElementById("quizBox").innerHTML = html;
}

window.answer = function(i){
  if(lock) return;
  lock = true;

  const q = questions[index];
  const correct = q.correct;

  for(let j=0;j<q.a.length;j++){
    const el = document.getElementById("opt"+j);
    if(j === correct){
      el.style.background = "#22c55e";
    }
  }

  const selected = document.getElementById("opt"+i);
  if(i !== correct){
    selected.style.background = "#ef4444";
  }

  setTimeout(()=>{
    index++;
    lock = false;

    if(index < questions.length){
      showQ();
    } else {
      document.getElementById("quizBox").innerHTML =
      "<div style='text-align:center;font-size:22px;font-weight:900'>انتهت اللعبة 🎉</div>";
    }
  },1500);
}

showQ();
</script>
`;

  return res.send(layout(game.title, body));
}
if(game.id === "wronginfo"){

  const body = `
  <div class="page-container">
    <div class="post">

      <h2 style="text-align:center;font-size:26px;font-weight:900">
        ${game.title}
      </h2>

      <div id="quizBox"></div>

    </div>
  </div>

<script>
const questions = ${JSON.stringify(shuffle(getWrongInfoQuestions()))};
let index = 0;
let lock = false;

function showQ(){
  const q = questions[index];

  let html = \`
    <div style="
      background:linear-gradient(135deg,#f97316,#fb923c);
      padding:15px;
      border-radius:15px;
      color:white;
      font-weight:800;
      text-align:center;
      margin-bottom:15px;
    ">
      \${q.q}
    </div>
  \`;

  q.a.forEach((opt,i)=>{
    html += \`
      <div onclick="answer(\${i})"
        id="opt\${i}"
        style="
          background:linear-gradient(135deg,#f97316,#c2410c);
          color:white;
          padding:14px;
          margin:10px 0;
          border-radius:12px;
          cursor:pointer;
          font-weight:700;
          text-align:center;
        ">
        \${opt}
      </div>
    \`;
  });

  document.getElementById("quizBox").innerHTML = html;
}

window.answer = function(i){

  if(lock) return;
  lock = true;

  const q = questions[index];
  const correct = q.correct;

  for(let j=0;j<q.a.length;j++){
    const el = document.getElementById("opt"+j);

    if(j === correct){
      el.style.background = "#22c55e";
    }
  }

  const selected = document.getElementById("opt"+i);

  if(i !== correct){
    selected.style.background = "#ef4444";
  }

  setTimeout(()=>{
    index++;
    lock = false;

    if(index < questions.length){
      showQ();
    } else {
      document.getElementById("quizBox").innerHTML =
      "<div style='text-align:center;font-size:22px;font-weight:900'>انتهت اللعبة 🎉</div>";
    }
  },1500);
}

showQ();
</script>
`;

  return res.send(layout(game.title, body));
}
if(game.id === "time"){

  const body = `
  <div class="page-container">
    <div class="post">

      <h2 style="text-align:center;font-size:26px;font-weight:900">
        ${game.title}
      </h2>

      <div id="timer" style="
        text-align:center;
        font-size:20px;
        font-weight:900;
        margin-bottom:10px;
        color:#ef4444;
      "></div>

      <div id="quizBox"></div>

    </div>
  </div>

<script>
const questions = ${JSON.stringify(shuffle(getTimeQuestions()))};
let index = 0;
let lock = false;
let timeLeft = 10;
let timer;

function startTimer(){

  clearInterval(timer);
  timeLeft = 10;

  document.getElementById("timer").innerHTML = "⏳ الوقت: " + timeLeft;

  timer = setInterval(()=>{
    timeLeft--;
    document.getElementById("timer").innerHTML = "⏳ الوقت: " + timeLeft;

    if(timeLeft <= 0){
      clearInterval(timer);
      nextQ(); // إذا خلص الوقت ينتقل للسؤال التالي
    }

  },1000);
}

function showQ(){

  const q = questions[index];

  let html = \`
    <div style="
      background:linear-gradient(135deg,#3b82f6,#60a5fa);
      padding:15px;
      border-radius:15px;
      color:white;
      font-weight:800;
      text-align:center;
      margin-bottom:15px;
    ">
      \${q.q}
    </div>
  \`;

  q.a.forEach((opt,i)=>{
    html += \`
      <div onclick="answer(\${i})"
        id="opt\${i}"
        style="
          background:linear-gradient(135deg,#2563eb,#1d4ed8);
          color:white;
          padding:14px;
          margin:10px 0;
          border-radius:12px;
          cursor:pointer;
          font-weight:700;
          text-align:center;
        ">
        \${opt}
      </div>
    \`;
  });

  document.getElementById("quizBox").innerHTML = html;

  startTimer();
}

function nextQ(){
  index++;
  lock = false;

  if(index < questions.length){
    showQ();
  } else {
    clearInterval(timer);
    document.getElementById("quizBox").innerHTML =
      "<div style='text-align:center;font-size:22px;font-weight:900'>انتهى التحدي 🎉</div>";
  }
}

window.answer = function(i){

  if(lock) return;
  lock = true;

  clearInterval(timer);

  const q = questions[index];
  const correct = q.correct;

  for(let j=0;j<q.a.length;j++){
    const el = document.getElementById("opt"+j);

    if(j === correct){
      el.style.background = "#22c55e";
    }
  }

  const selected = document.getElementById("opt"+i);

  if(i !== correct){
    selected.style.background = "#ef4444";
  }

  setTimeout(()=>{
    nextQ();
  },1200);
}

showQ();
</script>
`;

  return res.send(layout(game.title, body));
}
  // ⭐ باقي الألعاب (لاحقاً)
  const body = `
  <div class="page-container">
    <div class="post">
      <h2 style="font-size:28px;font-weight:900">${game.title}</h2>

      <img src="${game.image}" style="width:100%;margin:20px 0;border-radius:12px">

      <p style="font-size:16px;line-height:2">
        سيتم إضافة اللعبة قريباً 🎮
      </p>
    </div>
  </div>
  `;

  res.send(layout(game.title, body));
});
  /* =========================
   ABOUT
========================= */
app.get('/about',(req,res)=>{
  const body = `
  <div class="page-container">
    <div class="post">
      <h2>من نحن</h2>
      <p>منصة عربية تهدف إلى ربط الباحثين عن عمل بأفضل الفرص الوظيفية في الوطن العربي، نوفر آلاف الفرص المحدثة يومياً في مختلف القطاعات يُعد هذا الموقع منصة رقمية متقدمة ومتكاملة تم تطويرها بهدف تسهيل عملية الوصول إلى الفرص الوظيفية وربط الباحثين عن العمل بأصحاب الشركات والمؤسسات بطريقة حديثة وفعّالة تعتمد على السرعة والدقة وسهولة الاستخدام، حيث يوفر الموقع بيئة تفاعلية تجمع بين الوظائف المتنوعة في مختلف القطاعات مثل القطاع التقني والإداري والهندسي والطبي والتعليمي والخدمي وغيرها من المجالات التي تلبي احتياجات سوق العمل المتغيرة باستمرار، كما يتيح الموقع لأصحاب الأعمال إمكانية نشر إعلانات الوظائف بشكل مفصل يتضمن جميع المعلومات الضرورية مثل الوصف الوظيفي، الشروط المطلوبة، الخبرات اللازمة، المهارات الأساسية، موقع العمل، وساعات الدوام، مما يساعد في جذب المرشحين الأكثر ملاءمة لكل وظيفة، وفي المقابل يوفر للباحثين عن العمل تجربة استخدام سلسة تمكنهم من إنشاء حسابات شخصية وإعداد ملفات تعريف احترافية وإرفاق السيرة الذاتية الخاصة بهم والتقديم على الوظائف بنقرة واحدة فقط، إضافة إلى إمكانية البحث المتقدم باستخدام فلاتر متعددة مثل التخصص، مستوى الخبرة، نوع العقد، الراتب المتوقع، والموقع الجغرافي، كما يعمل الموقع على تحديث قاعدة بيانات الوظائف بشكل مستمر لضمان توفير أحدث الفرص المتاحة في السوق المحلي والعالمي، ويهدف كذلك إلى دعم فئة الشباب والخريجين الجدد من خلال تسهيل وصولهم إلى فرص تدريب وتوظيف مناسبة تساعدهم على بناء مستقبل مهني قوي، ولا يقتصر دور المنصة على عرض الوظائف فقط بل يسعى أيضًا إلى تعزيز ثقافة التوظيف الرقمي وتطوير سوق العمل من خلال ربط مباشر وفعال بين الطرفين دون وسطاء وبأعلى درجات الشفافية، كما يوفر النظام إشعارات فورية للمستخدمين عند توفر وظائف جديدة تتناسب مع اهتماماتهم ومهاراتهم، بالإضافة إلى إمكانية حفظ الوظائف المفضلة والعودة إليها لاحقًا، ويتميز الموقع بواجهة مستخدم عصرية متجاوبة تعمل بكفاءة على جميع الأجهزة سواء الهواتف الذكية أو الأجهزة اللوحية أو الحواسيب، مما يضمن تجربة استخدام مريحة وسهلة في أي وقت ومن أي مكان، ويطمح هذا المشروع إلى أن يكون أحد أهم المنصات الرائدة في مجال التوظيف الإلكتروني عبر تقديم حلول ذكية تساعد على تقليل البطالة وتحسين فرص الوصول إلى وظائف حقيقية وموثوقة تلبي تطلعات المستخدمين وتواكب تطور سوق العمل الحديث.</p>
    </div>
  </div>`;
  res.send(layout('من نحن - وظائف الوطن العربي', body));
});

/* =========================
   CONTACT
========================= */
app.get('/contact',(req,res)=>{
  const body = `
  <div class="page-container">
    <div class="post" style="text-align:center;">
      <h2>اتصل بنا</h2>
      <p>نحن سعداء بتواصلكم معنا عبر وسائل التواصل التالية لتقديم المقترحات او للإعلانات أو لطلب الحصول على الوظائف عبر الايميل الشخصي:</p>
      <div class="socials" style="justify-content:center;margin-top:24px;">
        <a href="https://instagram.com"><i class="fab fa-instagram"></i></a>
        <a href="https://facebook.com"><i class="fab fa-facebook-f"></i></a>
        <a href="mailto:test@gmail.com"><i class="fas fa-envelope"></i></a>
        <a href="https://x.com"><i class="fab fa-x-twitter"></i></a>
      </div>
    </div>
  </div>`;
  res.send(layout('اتصل بنا - وظائف الوطن العربي', body));
});

/* =========================
   JOBS LIST (paginated)
========================= */
app.get('/jobs/:sector/page/:page',(req,res)=>{
  const sector = req.params.sector;
  const page   = parseInt(req.params.page) || 1;
  const jobs   = getJobs(sector);

  const perPage = 5;
  const start = (page-1)*perPage;
  const end = start+perPage;
  const paginatedJobs = jobs.slice(start,end);
  const totalPages = Math.max(1, Math.ceil(jobs.length / perPage));

  const sectorNames = {health:'قطاع الصحة',engineering:'قطاع الهندسة',education:'قطاع التعليم',management:'قطاع الإدارة والتكنولوجيا'};

  let body = `<div class="page-container"><h1 class="section-title">${sectorNames[sector]||'الوظائف'}</h1>`;

  if(paginatedJobs.length===0){
    body += `<div class="post"><p>لا توجد وظائف متاحة حالياً في هذا القطاع.</p></div>`;
  } else {
    paginatedJobs.forEach(job=>{
      body += `
        <div class="post">
          <h2>${job.title}</h2>
          <p>${(job.description||'').substring(0,180)}...</p>
          <a href="/jobs/${sector}/job/${job.id}" class="apply">عرض الوظيفة</a>
        </div>`;
    });

    // Pagination
    body += `<div class="center" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:30px">`;
    for(let p=1;p<=totalPages;p++){
      const active = p===page ? 'background:var(--brand-2);color:#fff' : 'background:#fff;color:var(--text);border:1px solid var(--border)';
      body += `<a href="/jobs/${sector}/page/${p}" style="${active};padding:9px 16px;border-radius:9px;font-weight:600;font-size:14px">${p}</a>`;
    }
    body += `</div>`;
  }

  body += `</div>`;
  res.send(layout(`${sectorNames[sector]||'الوظائف'} - وظائف الوطن العربي`, body));
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
    return res.send(layout('غير موجود', `<div class="page-container"><div class="post"><h2>الوظيفة غير موجودة</h2></div></div>`));
  }

  const applyBtn = job.applyLink
    ? `<a href="${job.applyLink}" target="_blank" class="apply">التقديم الآن</a>`
    : (job.email ? `<a href="mailto:${job.email}" class="apply">إرسال السيرة الذاتية</a>` : '');

  const body = `
  <div class="page-container">
    <div class="post">
      <h2>${job.title}</h2>
      <p>${job.description||''}</p>
      ${job.email ? `<p style="margin-top:14px"><strong>البريد:</strong> ${job.email}</p>` : ''}
      <div style="margin-top:8px">${applyBtn}</div>
    </div>
    <div class="center"><a href="/jobs/${sector}/page/1" class="btn-primary" style="background:#fff;color:var(--text);border:1px solid var(--border)">← العودة للقائمة</a></div>
  </div>`;

  res.send(layout(`${job.title} - وظائف الوطن العربي`, body));
});

app.get('/privacy', (req, res) => {
  const privacy = getPrivacy();

  if (!privacy) {
    return res.send(layout('سياسة الخصوصية', '<div class="page-container"><div class="post">لا يوجد محتوى</div></div>'));
  }

  const body = `
  <div class="page-container">
    <div class="post">
      <h2 style="font-size:28px;font-weight:900">${privacy.title}</h2>

      ${privacy.content.map(p => `
        <p style="font-size:16px;line-height:2;margin-top:12px">
          ${p}
        </p>
      `).join('')}
    </div>
  </div>
  `;

  res.send(layout('سياسة الخصوصية', body));
});
/* ========================= */
app.listen(PORT,()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});
