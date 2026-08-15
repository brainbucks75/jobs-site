const express = require('express');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const app = express();

const PORT = process.env.PORT || 3000;
/* =========================
   READ JSON FILES
========================= */
function safeRead(file, fallback = []) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.log("Error reading:", file);
    return fallback;
  }
}
function getJobs(sector) {
  const jobs = safeRead('jobs.json');

  return jobs
    .filter(job => job.sector === sector)
    .sort((a, b) => b.id - a.id);
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
function getCVTemplates() {
  return safeRead('cv-templates.json');
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
             </div>
      <div>
        <h4>معلومات</h4>
        <a href="/about">من نحن</a>
      <a href="/privacy">سياسة الخصوصية</a>
        <a href="/terms">شروط الاستخدام</a>
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

function layout(title, body){
return `<!doctype html><html lang="ar" dir="rtl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="google-site-verification" content="12WvV3-XgAjFGCg9j7I4r_pi-n17R-XADE3MIOLw2JE" />
<meta name="description" content="موقع وظائف الوطن العربي - أحدث الوظائف والمقالات والقصص">
<meta name="keywords" content="وظائف, عمل, توظيف, وظائف عربية">
<title>${title}</title>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3462119395976615"
     crossorigin="anonymous"></script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DSDN57CY0H"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-DSDN57CY0H');
</script>
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
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">أخطاء شائعة في مقابلات العمل وكيف تجنبها</div><div class="d">8 مايو 2026</div></div></div>
  `;

  const storyItems = restStories.length ? restStories.map(s=>`
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">${s.title}</div><div class="d">${s.date||''}</div></div></div>
  `).join('') : `
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">قصة شاب بدأ من لا شيء وأصبح رائد أعمال ناجح</div><div class="d">9 مايو 2024</div></div></div>
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">كيف غيّرت التعلم المستمر مجرى حياتي المهنية</div><div class="d">7 مايو 2026</div></div></div>
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
    <h2 class="section-title">أدوات الباحث عن العمل</h2>

    <div class="three-col">

      <a href="/cv-builder" class="content-card" style="text-decoration:none;color:inherit;transition:.3s">
        <img
          class="cc-thumb"
          src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80"
          alt="إنشاء سيرة ذاتية"
        >

        <div class="cc-feature">
          <h4>إنشاء سيرة ذاتية احترافية</h4>
          <div class="date">
            اختر قالب السيرة الذاتية المناسب لك واملأ بياناتك وحمّلها بصيغة PDF.
          </div>
        </div>

        <div style="padding:0 20px 20px">
          <span class="btn-primary" style="display:inline-block">
            إنشاء سيرتي الذاتية
          </span>
        </div>
      </a>

    </div>
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
          <div class="date">${featuredArticle.date || '12 مايو 2026'}</div>
        </div>
        <div class="cc-list">${articleItems}</div>
      </div>

      <div class="content-card">
        <div class="cc-head"><a href="/stories">عرض الكل</a><h3>قصص ملهمة</h3></div>
        <img class="cc-thumb" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" alt="">
        <div class="cc-feature">
          <h4>${featuredStory.title}</h4>
          <div class="date">${featuredStory.date || '11 مايو 2026'}</div>
        </div>
        <div class="cc-list">${storyItems}</div>
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
   CV BUILDER
========================= */
app.get('/cv-builder', (req, res) => {
  const templates = getCVTemplates();
  const body = `
  <div class="page-container">

    <h1 class="section-title">إنشاء سيرتك الذاتية</h1>

    <div class="post" style="text-align:center;margin-bottom:30px">
      <h2 style="font-size:24px;font-weight:800">
        اختر قالب السيرة الذاتية المناسب لك
      </h2>

      <p style="margin-top:10px;color:var(--muted);font-size:15px">
        اختر التصميم الذي يناسب مجالك، ثم املأ بياناتك الشخصية والتعليمية والمهنية.
      </p>
    </div>

       <div style="
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:24px;
    ">

      ${templates.map(template => `
        <div class="post" style="text-align:center">

          <div style="
  height:320px;
  background:#f8fafc;
  border:1px solid var(--border);
  border-radius:14px;
  overflow:hidden;
  margin-bottom:18px;
  box-shadow:0 8px 25px rgba(15,23,42,.08);
">

  <img
    src="${template.image}"
    alt="${template.nameAr}"
    style="
      width:100%;
      height:100%;
      object-fit:cover;
      object-position:top center;
      display:block;
    "
  >

</div>

          <h2 style="font-size:21px">
            ${template.nameAr}
          </h2>

          <p style="font-size:14px;margin-top:6px">
            ${template.description}
          </p>

          <a href="/cv-builder/${template.type}" class="apply" style="margin-top:14px">
            استخدام هذا القالب
          </a>

        </div>
      `).join('')}

    </div>
  </div>
  `;

  res.send(layout('إنشاء سيرة ذاتية - وظائف الوطن العربي', body));
});

/* =========================
   CV PROFESSIONAL - FORM
========================= */
app.get('/cv-builder/professional', (req, res) => {

  const body = `
  <div class="page-container">

    <h1 class="section-title">إنشاء السيرة الذاتية</h1>

   <div class="post">

  <form method="POST" action="/cv-builder/professional/preview">

<!-- اختيار لون القالب -->
<div style="
  margin-bottom:32px;
  padding:22px;
  background:#f8fafc;
  border:1px solid var(--border);
  border-radius:14px;
">

  <h3 style="
    font-size:19px;
    font-weight:800;
    margin-bottom:8px;
  ">
    اختر لون السيرة الذاتية
  </h3>

  <p style="
    color:var(--muted);
    font-size:13px;
    margin-bottom:18px;
  ">
    اختر اللون الذي يناسبك، وسيتم استخدامه في تصميم السيرة الذاتية وملف PDF.
  </p>

  <div style="
    display:flex;
    flex-wrap:wrap;
    gap:14px;
    align-items:center;
  ">

    <label style="cursor:pointer;text-align:center">
      <input type="radio" name="cvColor" value="navy" checked style="display:none">
      <span style="
        display:block;
        width:48px;
        height:48px;
        background:#15203a;
        border-radius:50%;
        border:4px solid #ffffff;
        box-shadow:0 0 0 2px #15203a;
      "></span>
      <small style="display:block;margin-top:6px">كحلي</small>
    </label>


    <label style="cursor:pointer;text-align:center">
      <input type="radio" name="cvColor" value="blue" style="display:none">
      <span style="
        display:block;
        width:48px;
        height:48px;
        background:#2563eb;
        border-radius:50%;
      "></span>
      <small style="display:block;margin-top:6px">أزرق</small>
    </label>


    <label style="cursor:pointer;text-align:center">
      <input type="radio" name="cvColor" value="green" style="display:none">
      <span style="
        display:block;
        width:48px;
        height:48px;
        background:#059669;
        border-radius:50%;
      "></span>
      <small style="display:block;margin-top:6px">أخضر</small>
    </label>


    <label style="cursor:pointer;text-align:center">
      <input type="radio" name="cvColor" value="teal" style="display:none">
      <span style="
        display:block;
        width:48px;
        height:48px;
        background:#0f766e;
        border-radius:50%;
      "></span>
      <small style="display:block;margin-top:6px">تركواز</small>
    </label>


    <label style="cursor:pointer;text-align:center">
      <input type="radio" name="cvColor" value="purple" style="display:none">
      <span style="
        display:block;
        width:48px;
        height:48px;
        background:#7c3aed;
        border-radius:50%;
      "></span>
      <small style="display:block;margin-top:6px">بنفسجي</small>
    </label>


    <label style="cursor:pointer;text-align:center">
      <input type="radio" name="cvColor" value="burgundy" style="display:none">
      <span style="
        display:block;
        width:48px;
        height:48px;
        background:#991b1b;
        border-radius:50%;
      "></span>
      <small style="display:block;margin-top:6px">خمري</small>
    </label>


    <label style="cursor:pointer;text-align:center">
      <input type="radio" name="cvColor" value="orange" style="display:none">
      <span style="
        display:block;
        width:48px;
        height:48px;
        background:#ea580c;
        border-radius:50%;
      "></span>
      <small style="display:block;margin-top:6px">برتقالي</small>
    </label>


    <label style="cursor:pointer;text-align:center">
      <input type="radio" name="cvColor" value="brown" style="display:none">
      <span style="
        display:block;
        width:48px;
        height:48px;
        background:#78350f;
        border-radius:50%;
      "></span>
      <small style="display:block;margin-top:6px">بني</small>
    </label>


    <label style="cursor:pointer;text-align:center">
      <input type="radio" name="cvColor" value="gray" style="display:none">
      <span style="
        display:block;
        width:48px;
        height:48px;
        background:#475569;
        border-radius:50%;
      "></span>
      <small style="display:block;margin-top:6px">رمادي</small>
    </label>


    <label style="cursor:pointer;text-align:center">
      <input type="radio" name="cvColor" value="black" style="display:none">
      <span style="
        display:block;
        width:48px;
        height:48px;
        background:#111827;
        border-radius:50%;
      "></span>
      <small style="display:block;margin-top:6px">أسود</small>
    </label>

  </div>

</div>

    <h2 style="font-size:24px;font-weight:800;margin-bottom:8px">

        القالب الرسمي Professional
      </h2>

      <p style="color:var(--muted);margin-bottom:28px">
        املأ بياناتك التالية، وسنستخدمها لاحقًا لإنشاء سيرتك الذاتية بصيغة احترافية.
      </p>


      <!-- المعلومات الشخصية -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          المعلومات الشخصية
        </h3>

        <div style="
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:18px;
        ">

          <div>
            <label>الاسم الكامل</label>
            <input
              type="text"
              name="fullName"
              placeholder="مثال: أحمد محمد"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

          <div>
            <label>المسمى الوظيفي</label>
            <input
              type="text"
              name="jobTitle"
              placeholder="مثال: مهندس برمجيات"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

          <div>
            <label>الدولة</label>
            <input
              type="text"
              name="country"
              placeholder="مثال: الأردن"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

          <div>
            <label>المدينة</label>
            <input
              type="text"
              name="city"
              placeholder="مثال: عمّان"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

          <div>
            <label>رقم الهاتف</label>
            <input
              type="tel"
              name="phone"
              placeholder="مثال: 0790000000"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

          <div>
            <label>البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

          <div>
            <label>LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              placeholder="رابط حساب LinkedIn - اختياري"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

          <div>
            <label>الموقع الشخصي</label>
            <input
              type="text"
              name="website"
              placeholder="رابط الموقع - اختياري"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

        </div>

      </div>


      <!-- الملخص المهني -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          الملخص المهني
        </h3>

        <textarea
          name="summary"
          rows="6"
          placeholder="اكتب نبذة مختصرة عن خبرتك ومهاراتك وأهدافك المهنية..."
          style="
            width:100%;
            padding:12px;
            border:1px solid var(--border);
            border-radius:10px;
            resize:vertical;
            font-family:inherit;
            line-height:1.8;
          "
        ></textarea>

      </div>


      <!-- الخبرات -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          الخبرات المهنية
        </h3>

        <div style="
          background:#f8fafc;
          border:1px solid var(--border);
          border-radius:12px;
          padding:20px;
        ">

          <div style="
            display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:18px;
          ">

            <div>
              <label>المسمى الوظيفي</label>
              <input
                type="text"
                name="experienceTitle"
                placeholder="مثال: محاسب"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>اسم الشركة</label>
              <input
                type="text"
                name="company"
                placeholder="اسم الشركة"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>تاريخ البداية</label>
              <input
                type="month"
                name="experienceStart"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>تاريخ النهاية</label>
              <input
                type="month"
                name="experienceEnd"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

          </div>

          <div style="margin-top:18px">

            <label>وصف الخبرة والمسؤوليات</label>

            <textarea
              name="experienceDescription"
              rows="5"
              placeholder="اكتب أهم المسؤوليات والإنجازات..."
              style="
                width:100%;
                padding:12px;
                border:1px solid var(--border);
                border-radius:10px;
                resize:vertical;
                font-family:inherit;
                line-height:1.8;
                margin-top:6px;
              "
            ></textarea>

          </div>

        </div>

      </div>


      <!-- التعليم -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          التعليم
        </h3>

        <div style="
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:18px;
        ">

          <div>
            <label>الدرجة العلمية</label>
            <input
              type="text"
              name="degree"
              placeholder="مثال: بكالوريوس"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

          <div>
            <label>التخصص</label>
            <input
              type="text"
              name="specialization"
              placeholder="مثال: إدارة الأعمال"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

          <div>
            <label>الجامعة أو المؤسسة التعليمية</label>
            <input
              type="text"
              name="university"
              placeholder="اسم الجامعة"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

          <div>
            <label>سنة التخرج</label>
            <input
              type="number"
              name="graduationYear"
              placeholder="2026"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
            >
          </div>

        </div>

      </div>


      <!-- المهارات -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          المهارات
        </h3>

        <input
          type="text"
          name="skills"
          placeholder="اكتب مهاراتك، مثال: Excel، إدارة الوقت، التواصل، البرمجة"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px"
        >

        <p style="font-size:12px;color:var(--muted);margin-top:6px">
          افصل بين المهارات باستخدام الفاصلة.
        </p>

      </div>


      <!-- الدورات والشهادات -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          الدورات والشهادات
        </h3>

        <textarea
          name="certificates"
          rows="4"
          placeholder="اكتب الدورات والشهادات التي حصلت عليها..."
          style="
            width:100%;
            padding:12px;
            border:1px solid var(--border);
            border-radius:10px;
            resize:vertical;
            font-family:inherit;
            line-height:1.8;
          "
        ></textarea>

      </div>


      <!-- اللغات -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          اللغات
        </h3>

        <textarea
          name="languages"
          rows="3"
          placeholder="مثال: العربية - اللغة الأم&#10;الإنجليزية - جيد جدًا"
          style="
            width:100%;
            padding:12px;
            border:1px solid var(--border);
            border-radius:10px;
            resize:vertical;
            font-family:inherit;
            line-height:1.8;
          "
        ></textarea>

      </div>


     <div style="
  text-align:center;
  margin-top:30px;
  display:flex;
  justify-content:center;
  gap:12px;
  flex-wrap:wrap;
">

  <!-- زر المعاينة -->
  <button
    type="submit"
    class="btn-primary"
    style="
      border:none;
      cursor:pointer;
      font-family:inherit;
    "
  >
    <i class="fas fa-eye"></i>
    معاينة السيرة الذاتية
  </button>


  <!-- زر تحميل PDF -->
  <button
    type="submit"
    formaction="/cv-builder/professional/pdf"
    formmethod="POST"
    class="btn-primary"
    style="
      border:none;
      cursor:pointer;
      font-family:inherit;
      background:#10b981;
    "
  >
    <i class="fas fa-file-pdf"></i>
    تحميل PDF
  </button>

</div>

       </form>

  </div>

</div>
`;

  res.send(layout('إنشاء السيرة الذاتية - القالب الرسمي', body));
});

/* =========================
   CV PROFESSIONAL - PREVIEW
========================= */
app.post('/cv-builder/professional/preview', express.urlencoded({ extended: true }), (req, res) => {

  const data = req.body;

const colors = {
  navy: {
    primary: '#15203a',
    accent: '#3b82f6',
    light: '#eff6ff',
    border: '#bfdbfe',
    text: '#1d4ed8'
  },
  blue: {
    primary: '#1e3a8a',
    accent: '#2563eb',
    light: '#eff6ff',
    border: '#bfdbfe',
    text: '#1d4ed8'
  },
  green: {
    primary: '#064e3b',
    accent: '#059669',
    light: '#ecfdf5',
    border: '#a7f3d0',
    text: '#047857'
  },
  teal: {
    primary: '#134e4a',
    accent: '#0f766e',
    light: '#f0fdfa',
    border: '#99f6e4',
    text: '#0f766e'
  },
  purple: {
    primary: '#3b0764',
    accent: '#7c3aed',
    light: '#f5f3ff',
    border: '#ddd6fe',
    text: '#6d28d9'
  },
  burgundy: {
    primary: '#450a0a',
    accent: '#991b1b',
    light: '#fef2f2',
    border: '#fecaca',
    text: '#b91c1c'
  },
  orange: {
    primary: '#431407',
    accent: '#ea580c',
    light: '#fff7ed',
    border: '#fed7aa',
    text: '#c2410c'
  },
  brown: {
    primary: '#451a03',
    accent: '#78350f',
    light: '#fffbeb',
    border: '#fde68a',
    text: '#92400e'
  },
  gray: {
    primary: '#1e293b',
    accent: '#475569',
    light: '#f1f5f9',
    border: '#cbd5e1',
    text: '#334155'
  },
  black: {
    primary: '#111827',
    accent: '#000000',
    light: '#f3f4f6',
    border: '#d1d5db',
    text: '#111827'
  }
};

const theme = colors[data.cvColor] || colors.navy;

  const body = `
  <div style="
    background:#eef2f7;
    padding:40px 15px;
    min-height:100vh;
    direction:rtl;
  ">

    <!-- CV PAPER -->
    <div style="
      max-width:794px;
      min-height:1123px;
      margin:0 auto;
      background:#ffffff;
      box-shadow:0 12px 40px rgba(15,23,42,.16);
      overflow:hidden;
      color:#1e293b;
      font-family:'Cairo',Arial,sans-serif;
    ">

      <!-- TOP HEADER -->
      <div style="
        background:${theme.primary};
        color:#ffffff;
        padding:42px 55px 34px;
        position:relative;
      ">

        <div style="
          position:absolute;
          top:0;
          right:0;
          width:100%;
          height:5px;
         background:${theme.accent};
        "></div>

        <h1 style="
          margin:0;
          font-size:32px;
          font-weight:800;
          line-height:1.35;
          color:#ffffff;
        ">
          ${data.fullName || 'الاسم الكامل'}
        </h1>

        <div style="
          margin-top:6px;
          font-size:17px;
        color:${theme.light};
          font-weight:700;
        ">
          ${data.jobTitle || 'المسمى الوظيفي'}
        </div>

        <div style="
          display:flex;
          flex-wrap:wrap;
          gap:8px 18px;
          margin-top:18px;
          color:#dbeafe;
          font-size:11px;
        ">

          ${data.country || data.city ? `
          <span>
            <i class="fas fa-location-dot"></i>
            ${data.country || ''}
            ${data.city ? ' - ' + data.city : ''}
          </span>
          ` : ''}

          ${data.phone ? `
          <span>
            <i class="fas fa-phone"></i>
            ${data.phone}
          </span>
          ` : ''}

          ${data.email ? `
          <span>
            <i class="fas fa-envelope"></i>
            ${data.email}
          </span>
          ` : ''}

          ${data.linkedin ? `
          <span>
            <i class="fab fa-linkedin"></i>
            ${data.linkedin}
          </span>
          ` : ''}

          ${data.website ? `
          <span>
            <i class="fas fa-globe"></i>
            ${data.website}
          </span>
          ` : ''}

        </div>

      </div>


      <!-- CV CONTENT -->

      <div style="
        padding:38px 55px 55px;
      ">


        <!-- SUMMARY -->

        ${data.summary ? `
        <section style="margin-bottom:27px">

          <div style="
            display:flex;
            align-items:center;
            gap:10px;
            margin-bottom:11px;
          ">

            <div style="
              width:5px;
              height:24px;
              background:#3b82f6;
              border-radius:4px;
            "></div>

            <h2 style="
              margin:0;
              font-size:17px;
              font-weight:800;
              color:#15203a;
            ">
              الملخص المهني
            </h2>

          </div>

          <p style="
            margin:0;
            font-size:12.5px;
            line-height:2;
            color:#475569;
            white-space:pre-line;
          ">
            ${data.summary}
          </p>

        </section>
        ` : ''}


        <!-- EXPERIENCE -->

        ${(data.experienceTitle || data.company) ? `
        <section style="margin-bottom:27px">

          <div style="
            display:flex;
            align-items:center;
            gap:10px;
            margin-bottom:15px;
          ">

            <div style="
              width:5px;
              height:24px;
              background:#3b82f6;
              border-radius:4px;
            "></div>

            <h2 style="
              margin:0;
              font-size:17px;
              font-weight:800;
              color:#15203a;
            ">
              الخبرة المهنية
            </h2>

          </div>

          <div style="
            border-right:2px solid #bfdbfe;
            padding-right:16px;
          ">

            <h3 style="
              margin:0;
              font-size:15px;
              font-weight:800;
              color:#1e293b;
            ">
              ${data.experienceTitle || ''}
            </h3>

            ${data.company ? `
            <div style="
              margin-top:4px;
              font-size:13px;
              color:${theme.accent};
              font-weight:700;
            ">
              ${data.company}
            </div>
            ` : ''}

            ${(data.experienceStart || data.experienceEnd) ? `
            <div style="
              margin-top:4px;
              font-size:10.5px;
              color:#94a3b8;
            ">
              ${data.experienceStart || ''}
              ${data.experienceEnd ? ' - ' + data.experienceEnd : ' - حتى الآن'}
            </div>
            ` : ''}

            ${data.experienceDescription ? `
            <p style="
              margin:9px 0 0;
              font-size:12px;
              line-height:1.9;
              color:#475569;
              white-space:pre-line;
            ">
              ${data.experienceDescription}
            </p>
            ` : ''}

          </div>

        </section>
        ` : ''}


        <!-- EDUCATION -->

        ${(data.degree || data.specialization || data.university) ? `
        <section style="margin-bottom:27px">

          <div style="
            display:flex;
            align-items:center;
            gap:10px;
            margin-bottom:15px;
          ">

            <div style="
              width:5px;
              height:24px;
              background:#3b82f6;
              border-radius:4px;
            "></div>

            <h2 style="
              margin:0;
              font-size:17px;
              font-weight:800;
              color:#15203a;
            ">
              التعليم
            </h2>

          </div>

          <div style="
            border-right:2px solid ${theme.border};
            padding-right:16px;
          ">

            ${data.degree ? `
            <h3 style="
              margin:0;
              font-size:15px;
              font-weight:800;
              color:#1e293b;
            ">
              ${data.degree}
            </h3>
            ` : ''}

            ${data.specialization ? `
            <div style="
              margin-top:4px;
              font-size:13px;
              color:#2563eb;
              font-weight:700;
            ">
              ${data.specialization}
            </div>
            ` : ''}

            ${data.university ? `
            <div style="
              margin-top:4px;
              font-size:12px;
              color:#475569;
            ">
              ${data.university}
            </div>
            ` : ''}

            ${data.graduationYear ? `
            <div style="
              margin-top:4px;
              font-size:10.5px;
              color:#94a3b8;
            ">
              سنة التخرج: ${data.graduationYear}
            </div>
            ` : ''}

          </div>

        </section>
        ` : ''}


        <!-- SKILLS -->

        ${data.skills ? `
        <section style="margin-bottom:27px">

          <div style="
            display:flex;
            align-items:center;
            gap:10px;
            margin-bottom:13px;
          ">

            <div style="
              width:5px;
              height:24px;
              background:#3b82f6;
              border-radius:4px;
            "></div>

            <h2 style="
              margin:0;
              font-size:17px;
              font-weight:800;
              color:#15203a;
            ">
              المهارات
            </h2>

          </div>

          <div style="
            display:flex;
            flex-wrap:wrap;
            gap:8px;
          ">

            ${data.skills
              .split(',')
              .map(skill => `
                <span style="
                 background:${theme.light};
                 border:1px solid ${theme.border};
                  color:${theme.text};
                  padding:6px 12px;
                  border-radius:7px;
                  font-size:11px;
                  font-weight:700;
                ">
                  ${skill.trim()}
                </span>
              `)
              .join('')}

          </div>

        </section>
        ` : ''}


        <!-- CERTIFICATES -->

        ${data.certificates ? `
        <section style="margin-bottom:27px">

          <div style="
            display:flex;
            align-items:center;
            gap:10px;
            margin-bottom:12px;
          ">

            <div style="
              width:5px;
              height:24px;
              background:#3b82f6;
              border-radius:4px;
            "></div>

            <h2 style="
              margin:0;
              font-size:17px;
              font-weight:800;
              color:#15203a;
            ">
              الدورات والشهادات
            </h2>

          </div>

          <p style="
            margin:0;
            font-size:12px;
            line-height:1.9;
            color:#475569;
            white-space:pre-line;
          ">
            ${data.certificates}
          </p>

        </section>
        ` : ''}


        <!-- LANGUAGES -->

        ${data.languages ? `
        <section>

          <div style="
            display:flex;
            align-items:center;
            gap:10px;
            margin-bottom:12px;
          ">

            <div style="
              width:5px;
              height:24px;
              background:#3b82f6;
              border-radius:4px;
            "></div>

            <h2 style="
              margin:0;
              font-size:17px;
              font-weight:800;
              color:#15203a;
            ">
              اللغات
            </h2>

          </div>

          <p style="
            margin:0;
            font-size:12px;
            line-height:1.9;
            color:#475569;
            white-space:pre-line;
          ">
            ${data.languages}
          </p>

        </section>
        ` : ''}

      </div>

    </div>


    <!-- ACTION BUTTON -->

    <div style="
      max-width:794px;
      margin:25px auto 0;
      text-align:center;
    ">

      <a
        href="/cv-builder/professional"
        class="btn-primary"
        style="margin-left:8px"
      >
        تعديل البيانات
      </a>

    </div>

  </div>
  `;

  res.send(layout('معاينة السيرة الذاتية - وظائف الوطن العربي', body));
});

/* =========================
   PROFESSIONAL CV PDF
========================= */
app.post('/cv-builder/professional/pdf', express.urlencoded({ extended: true }), async (req, res) => {

  try {

    const data = req.body;

const colors = {
  navy: {
    primary: '#15203a',
    accent: '#3b82f6',
    light: '#eff6ff',
    border: '#bfdbfe',
    text: '#1d4ed8'
  },

  blue: {
    primary: '#1e3a8a',
    accent: '#2563eb',
    light: '#eff6ff',
    border: '#bfdbfe',
    text: '#1d4ed8'
  },

  green: {
    primary: '#064e3b',
    accent: '#059669',
    light: '#ecfdf5',
    border: '#a7f3d0',
    text: '#047857'
  },

  teal: {
    primary: '#134e4a',
    accent: '#0f766e',
    light: '#f0fdfa',
    border: '#99f6e4',
    text: '#0f766e'
  },

  purple: {
    primary: '#3b0764',
    accent: '#7c3aed',
    light: '#f5f3ff',
    border: '#ddd6fe',
    text: '#6d28d9'
  },

  burgundy: {
    primary: '#450a0a',
    accent: '#991b1b',
    light: '#fef2f2',
    border: '#fecaca',
    text: '#b91c1c'
  },

  orange: {
    primary: '#431407',
    accent: '#ea580c',
    light: '#fff7ed',
    border: '#fed7aa',
    text: '#c2410c'
  },

  brown: {
    primary: '#451a03',
    accent: '#78350f',
    light: '#fffbeb',
    border: '#fde68a',
    text: '#92400e'
  },

  gray: {
    primary: '#1e293b',
    accent: '#475569',
    light: '#f1f5f9',
    border: '#cbd5e1',
    text: '#334155'
  },

  black: {
    primary: '#111827',
    accent: '#000000',
    light: '#f3f4f6',
    border: '#d1d5db',
    text: '#111827'
  }
};

const theme = colors[data.cvColor] || colors.navy;

const executablePath = await puppeteer.executablePath();

console.log('===== PDF TEST =====');
console.log('PUPPETEER EXECUTABLE:', executablePath);
console.log('====================');

console.log('PUPPETEER EXECUTABLE:', executablePath);

const browser = await puppeteer.launch({
  headless: true,
  executablePath: executablePath,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ]
});
const page = await browser.newPage();
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">

        <style>

          @page {
            size: A4;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-family: Arial, sans-serif;
            direction: rtl;
            color: #1e293b;
          }

          .cv {
            width: 210mm;
            min-height: 297mm;
            background: #ffffff;
            padding: 18mm;
          }

          .header {
           background: ${theme.primary};
            color: #ffffff;
            padding: 15mm;
            position: relative;
          }

          .top-line {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 2mm;
            background: ${theme.accent};
          }

          h1 {
            margin: 0;
            font-size: 28px;
          }

          .job-title {
            margin-top: 5px;
           color: ${theme.light};
            font-size: 15px;
            font-weight: bold;
          }

          .contact {
            margin-top: 12px;
            font-size: 9px;
           color: ${theme.light};
            line-height: 2;
          }

          .section {
            margin-top: 18px;
          }

          .section-title {
            font-size: 15px;
            font-weight: bold;
            color: ${theme.primary};
            border-right: 3px solid ${theme.accent};
            padding-right: 8px;
            margin-bottom: 8px;
          }

          .text {
            font-size: 10px;
            line-height: 1.9;
            color: #475569;
            white-space: pre-line;
          }

          .item {
           border-right: 2px solid ${theme.border};
            padding-right: 10px;
          }

          .item-title {
            font-size: 12px;
            font-weight: bold;
          }

          .company {
            color: ${theme.accent};
            font-size: 10px;
            margin-top: 3px;
          }

          .date {
            color: #94a3b8;
            font-size: 8px;
            margin-top: 3px;
          }

          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
          }

          .skill {
            background: ${theme.light};
           border: 1px solid ${theme.border};
            color: ${theme.text};
            padding: 4px 8px;
            border-radius: 5px;
            font-size: 9px;
            font-weight: bold;
          }

        </style>
      </head>

      <body>

        <div class="cv">

          <div class="header">

            <div class="top-line"></div>

            <h1>
              ${data.fullName || 'الاسم الكامل'}
            </h1>

            <div class="job-title">
              ${data.jobTitle || 'المسمى الوظيفي'}
            </div>

            <div class="contact">

              ${data.country || data.city ? `
                📍 ${data.country || ''}
                ${data.city ? ' - ' + data.city : ''}
              ` : ''}

              ${data.phone ? ` &nbsp; | &nbsp; ☎ ${data.phone}` : ''}

              ${data.email ? ` &nbsp; | &nbsp; ✉ ${data.email}` : ''}

              ${data.linkedin ? ` &nbsp; | &nbsp; LinkedIn: ${data.linkedin}` : ''}

              ${data.website ? ` &nbsp; | &nbsp; ${data.website}` : ''}

            </div>

          </div>


          ${data.summary ? `
          <div class="section">

            <div class="section-title">
              الملخص المهني
            </div>

            <div class="text">
              ${data.summary}
            </div>

          </div>
          ` : ''}


          ${(data.experienceTitle || data.company) ? `
          <div class="section">

            <div class="section-title">
              الخبرة المهنية
            </div>

            <div class="item">

              <div class="item-title">
                ${data.experienceTitle || ''}
              </div>

              ${data.company ? `
                <div class="company">
                  ${data.company}
                </div>
              ` : ''}

              ${(data.experienceStart || data.experienceEnd) ? `
                <div class="date">
                  ${data.experienceStart || ''}
                  ${data.experienceEnd ? ' - ' + data.experienceEnd : ' - حتى الآن'}
                </div>
              ` : ''}

              ${data.experienceDescription ? `
                <div class="text" style="margin-top:6px">
                  ${data.experienceDescription}
                </div>
              ` : ''}

            </div>

          </div>
          ` : ''}


          ${(data.degree || data.specialization || data.university) ? `
          <div class="section">

            <div class="section-title">
              التعليم
            </div>

            <div class="item">

              ${data.degree ? `
                <div class="item-title">
                  ${data.degree}
                </div>
              ` : ''}

              ${data.specialization ? `
                <div class="company">
                  ${data.specialization}
                </div>
              ` : ''}

              ${data.university ? `
                <div class="text">
                  ${data.university}
                </div>
              ` : ''}

              ${data.graduationYear ? `
                <div class="date">
                  سنة التخرج: ${data.graduationYear}
                </div>
              ` : ''}

            </div>

          </div>
          ` : ''}


          ${data.skills ? `
          <div class="section">

            <div class="section-title">
              المهارات
            </div>

            <div class="skills">

              ${data.skills
                .split(',')
                .map(skill => `
                  <span class="skill">
                    ${skill.trim()}
                  </span>
                `)
                .join('')}

            </div>

          </div>
          ` : ''}


          ${data.certificates ? `
          <div class="section">

            <div class="section-title">
              الدورات والشهادات
            </div>

            <div class="text">
              ${data.certificates}
            </div>

          </div>
          ` : ''}


          ${data.languages ? `
          <div class="section">

            <div class="section-title">
              اللغات
            </div>

            <div class="text">
              ${data.languages}
            </div>

          </div>
          ` : ''}

        </div>

      </body>
      </html>
    `, {
      waitUntil: 'networkidle0'
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="my-cv.pdf"',
      'Content-Length': pdf.length
    });

    res.send(pdf);

  } catch (error) {

    console.error('PDF ERROR:', error);

    res.status(500).send('حدث خطأ أثناء إنشاء ملف PDF');

  }

});

/* =========================
   CV ATS - FORM
========================= */
app.get('/cv-builder/ats', (req, res) => {

  const body = `

  <div class="page-container">

    <h1 class="section-title">إنشاء سيرة ذاتية ATS</h1>

    <div class="post">

      <h2 style="font-size:24px;font-weight:800;margin-bottom:8px">
        قالب ATS الاحترافي
      </h2>

      <p style="color:var(--muted);margin-bottom:28px">
        صمم سيرتك الذاتية بتنسيق بسيط وواضح ومتوافق مع أنظمة تتبع المتقدمين ATS.
      </p>

      <form method="POST" action="/cv-builder/ats/preview">

        <!-- الألوان -->

        <div style="margin-bottom:32px">

          <h3 style="
            font-size:19px;
            font-weight:800;
            margin-bottom:18px;
            padding-bottom:10px;
            border-bottom:2px solid var(--border);
          ">
            اختر لون السيرة الذاتية
          </h3>

          <div style="
            display:flex;
            flex-wrap:wrap;
            gap:18px;
            align-items:center;
          ">

            <label style="cursor:pointer;text-align:center">
              <input type="radio" name="cvColor" value="navy" checked style="display:none">
              <span style="
                display:block;
                width:48px;
                height:48px;
                background:#15203a;
                border-radius:50%;
                border:4px solid #fff;
                box-shadow:0 0 0 2px #15203a;
              "></span>
              <small>كحلي</small>
            </label>

            <label style="cursor:pointer;text-align:center">
              <input type="radio" name="cvColor" value="blue" style="display:none">
              <span style="
                display:block;
                width:48px;
                height:48px;
                background:#2563eb;
                border-radius:50%;
              "></span>
              <small>أزرق</small>
            </label>

            <label style="cursor:pointer;text-align:center">
              <input type="radio" name="cvColor" value="green" style="display:none">
              <span style="
                display:block;
                width:48px;
                height:48px;
                background:#059669;
                border-radius:50%;
              "></span>
              <small>أخضر</small>
            </label>

            <label style="cursor:pointer;text-align:center">
              <input type="radio" name="cvColor" value="teal" style="display:none">
              <span style="
                display:block;
                width:48px;
                height:48px;
                background:#0f766e;
                border-radius:50%;
              "></span>
              <small>تركواز</small>
            </label>

            <label style="cursor:pointer;text-align:center">
              <input type="radio" name="cvColor" value="purple" style="display:none">
              <span style="
                display:block;
                width:48px;
                height:48px;
                background:#7c3aed;
                border-radius:50%;
              "></span>
              <small>بنفسجي</small>
            </label>

            <label style="cursor:pointer;text-align:center">
              <input type="radio" name="cvColor" value="burgundy" style="display:none">
              <span style="
                display:block;
                width:48px;
                height:48px;
                background:#991b1b;
                border-radius:50%;
              "></span>
              <small>خمري</small>
            </label>

            <label style="cursor:pointer;text-align:center">
              <input type="radio" name="cvColor" value="orange" style="display:none">
              <span style="
                display:block;
                width:48px;
                height:48px;
                background:#ea580c;
                border-radius:50%;
              "></span>
              <small>برتقالي</small>
            </label>

            <label style="cursor:pointer;text-align:center">
              <input type="radio" name="cvColor" value="brown" style="display:none">
              <span style="
                display:block;
                width:48px;
                height:48px;
                background:#78350f;
                border-radius:50%;
              "></span>
              <small>بني</small>
            </label>

            <label style="cursor:pointer;text-align:center">
              <input type="radio" name="cvColor" value="gray" style="display:none">
              <span style="
                display:block;
                width:48px;
                height:48px;
                background:#475569;
                border-radius:50%;
              "></span>
              <small>رمادي</small>
            </label>

            <label style="cursor:pointer;text-align:center">
              <input type="radio" name="cvColor" value="black" style="display:none">
              <span style="
                display:block;
                width:48px;
                height:48px;
                background:#111827;
                border-radius:50%;
              "></span>
              <small>أسود</small>
            </label>

          </div>

        </div>


        <!-- المعلومات الشخصية -->

        <div style="margin-bottom:32px">

          <h3 style="
            font-size:19px;
            font-weight:800;
            margin-bottom:18px;
            padding-bottom:10px;
            border-bottom:2px solid var(--border);
          ">
            المعلومات الشخصية
          </h3>

          <div style="
            display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:18px;
          ">

            <div>
              <label>الاسم الكامل</label>
              <input
                type="text"
                name="fullName"
                placeholder="مثال: أحمد محمد"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>المسمى الوظيفي</label>
              <input
                type="text"
                name="jobTitle"
                placeholder="مثال: مهندس برمجيات"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>الدولة</label>
              <input
                type="text"
                name="country"
                placeholder="مثال: الأردن"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>المدينة</label>
              <input
                type="text"
                name="city"
                placeholder="مثال: عمّان"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>رقم الهاتف</label>
              <input
                type="tel"
                name="phone"
                placeholder="مثال: 0790000000"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                placeholder="رابط LinkedIn - اختياري"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>الموقع الشخصي</label>
              <input
                type="text"
                name="website"
                placeholder="رابط الموقع - اختياري"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

          </div>

        </div>


        <!-- الملخص -->

        <div style="margin-bottom:32px">

          <h3 style="
            font-size:19px;
            font-weight:800;
            margin-bottom:18px;
            padding-bottom:10px;
            border-bottom:2px solid var(--border);
          ">
            الملخص المهني
          </h3>

          <textarea
            name="summary"
            rows="6"
            placeholder="اكتب نبذة مهنية واضحة عن خبرتك ومهاراتك وأهدافك..."
            style="
              width:100%;
              padding:12px;
              border:1px solid var(--border);
              border-radius:10px;
              resize:vertical;
              font-family:inherit;
              line-height:1.8;
            "
          ></textarea>

        </div>


        <!-- الخبرة -->

        <div style="margin-bottom:32px">

          <h3 style="
            font-size:19px;
            font-weight:800;
            margin-bottom:18px;
            padding-bottom:10px;
            border-bottom:2px solid var(--border);
          ">
            الخبرة المهنية
          </h3>

          <div style="
            background:#f8fafc;
            border:1px solid var(--border);
            border-radius:12px;
            padding:20px;
          ">

            <div style="
              display:grid;
              grid-template-columns:repeat(2,1fr);
              gap:18px;
            ">

              <div>
                <label>المسمى الوظيفي</label>
                <input
                  type="text"
                  name="experienceTitle"
                  placeholder="مثال: محاسب"
                  style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
                >
              </div>

              <div>
                <label>اسم الشركة</label>
                <input
                  type="text"
                  name="company"
                  placeholder="اسم الشركة"
                  style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
                >
              </div>

              <div>
                <label>تاريخ البداية</label>
                <input
                  type="month"
                  name="experienceStart"
                  style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
                >
              </div>

              <div>
                <label>تاريخ النهاية</label>
                <input
                  type="month"
                  name="experienceEnd"
                  style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
                >
              </div>

            </div>

            <div style="margin-top:18px">

              <label>وصف الخبرة والمسؤوليات والإنجازات</label>

              <textarea
                name="experienceDescription"
                rows="6"
                placeholder="اكتب المسؤوليات والإنجازات والخبرات المهمة..."
                style="
                  width:100%;
                  padding:12px;
                  border:1px solid var(--border);
                  border-radius:10px;
                  resize:vertical;
                  font-family:inherit;
                  line-height:1.8;
                  margin-top:6px;
                "
              ></textarea>

            </div>

          </div>

        </div>


        <!-- التعليم -->

        <div style="margin-bottom:32px">

          <h3 style="
            font-size:19px;
            font-weight:800;
            margin-bottom:18px;
            padding-bottom:10px;
            border-bottom:2px solid var(--border);
          ">
            التعليم
          </h3>

          <div style="
            display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:18px;
          ">

            <div>
              <label>الدرجة العلمية</label>
              <input
                type="text"
                name="degree"
                placeholder="مثال: بكالوريوس"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>التخصص</label>
              <input
                type="text"
                name="specialization"
                placeholder="مثال: إدارة الأعمال"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>الجامعة أو المؤسسة التعليمية</label>
              <input
                type="text"
                name="university"
                placeholder="اسم الجامعة"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

            <div>
              <label>سنة التخرج</label>
              <input
                type="number"
                name="graduationYear"
                placeholder="2026"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px"
              >
            </div>

          </div>

        </div>


        <!-- المهارات -->

        <div style="margin-bottom:32px">

          <h3 style="
            font-size:19px;
            font-weight:800;
            margin-bottom:18px;
            padding-bottom:10px;
            border-bottom:2px solid var(--border);
          ">
            المهارات
          </h3>

          <input
            type="text"
            name="skills"
            placeholder="مثال: Excel، إدارة المشاريع، التواصل، البرمجة"
            style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px"
          >

          <p style="font-size:12px;color:var(--muted);margin-top:6px">
            افصل بين المهارات باستخدام الفاصلة.
          </p>

        </div>


        <!-- الدورات -->

        <div style="margin-bottom:32px">

          <h3 style="
            font-size:19px;
            font-weight:800;
            margin-bottom:18px;
            padding-bottom:10px;
            border-bottom:2px solid var(--border);
          ">
            الدورات والشهادات
          </h3>

          <textarea
            name="certificates"
            rows="4"
            placeholder="اكتب الدورات والشهادات المهنية..."
            style="
              width:100%;
              padding:12px;
              border:1px solid var(--border);
              border-radius:10px;
              resize:vertical;
              font-family:inherit;
              line-height:1.8;
            "
          ></textarea>

        </div>


        <!-- اللغات -->

        <div style="margin-bottom:32px">

          <h3 style="
            font-size:19px;
            font-weight:800;
            margin-bottom:18px;
            padding-bottom:10px;
            border-bottom:2px solid var(--border);
          ">
            اللغات
          </h3>

          <textarea
            name="languages"
            rows="3"
            placeholder="مثال: العربية - اللغة الأم&#10;الإنجليزية - جيد جدًا"
            style="
              width:100%;
              padding:12px;
              border:1px solid var(--border);
              border-radius:10px;
              resize:vertical;
              font-family:inherit;
              line-height:1.8;
            "
          ></textarea>

        </div>


        <!-- الأزرار -->

        <div style="
          text-align:center;
          margin-top:30px;
          display:flex;
          justify-content:center;
          gap:12px;
          flex-wrap:wrap;
        ">

          <button
            type="submit"
            class="btn-primary"
            style="
              border:none;
              cursor:pointer;
              font-family:inherit;
            "
          >
            <i class="fas fa-eye"></i>
            معاينة السيرة الذاتية
          </button>

          <button
            type="submit"
            formaction="/cv-builder/ats/pdf"
            formmethod="POST"
            class="btn-primary"
            style="
              border:none;
              cursor:pointer;
              font-family:inherit;
              background:#10b981;
            "
          >
            <i class="fas fa-file-pdf"></i>
            تحميل PDF
          </button>

        </div>

      </form>

    </div>

  </div>

  `;

  res.send(layout('إنشاء السيرة الذاتية - قالب ATS', body));
});


/* =========================
   CV ATS - PREVIEW
========================= */
app.post('/cv-builder/ats/preview', express.urlencoded({ extended: true }), (req, res) => {

  const data = req.body;

  const colors = {

    navy: {
      primary: '#15203a',
      accent: '#3b82f6',
      light: '#eff6ff',
      border: '#bfdbfe',
      text: '#1d4ed8'
    },

    blue: {
      primary: '#1e3a8a',
      accent: '#2563eb',
      light: '#eff6ff',
      border: '#bfdbfe',
      text: '#1d4ed8'
    },

    green: {
      primary: '#064e3b',
      accent: '#059669',
      light: '#ecfdf5',
      border: '#a7f3d0',
      text: '#047857'
    },

    teal: {
      primary: '#134e4a',
      accent: '#0f766e',
      light: '#f0fdfa',
      border: '#99f6e4',
      text: '#0f766e'
    },

    purple: {
      primary: '#3b0764',
      accent: '#7c3aed',
      light: '#f5f3ff',
      border: '#ddd6fe',
      text: '#6d28d9'
    },

    burgundy: {
      primary: '#450a0a',
      accent: '#991b1b',
      light: '#fef2f2',
      border: '#fecaca',
      text: '#b91c1c'
    },

    orange: {
      primary: '#431407',
      accent: '#ea580c',
      light: '#fff7ed',
      border: '#fed7aa',
      text: '#c2410c'
    },

    brown: {
      primary: '#451a03',
      accent: '#78350f',
      light: '#fffbeb',
      border: '#fde68a',
      text: '#92400e'
    },

    gray: {
      primary: '#1e293b',
      accent: '#475569',
      light: '#f1f5f9',
      border: '#cbd5e1',
      text: '#334155'
    },

    black: {
      primary: '#111827',
      accent: '#000000',
      light: '#f3f4f6',
      border: '#d1d5db',
      text: '#111827'
    }

  };

  const theme = colors[data.cvColor] || colors.navy;


  const body = `

  <div style="
    background:#eef2f7;
    padding:40px 15px;
    min-height:100vh;
    direction:rtl;
  ">

    <div style="
      max-width:794px;
      min-height:1123px;
      margin:0 auto;
      background:#fff;
      box-shadow:0 12px 40px rgba(15,23,42,.12);
      color:#1e293b;
      font-family:Arial,Cairo,sans-serif;
    ">

      <!-- HEADER -->

      <div style="
        padding:38px 50px 25px;
        border-bottom:3px solid ${theme.accent};
      ">

        <h1 style="
          margin:0;
          font-size:30px;
          font-weight:800;
          color:${theme.primary};
        ">
          ${data.fullName || 'الاسم الكامل'}
        </h1>

        <div style="
          margin-top:5px;
          font-size:16px;
          font-weight:700;
          color:${theme.accent};
        ">
          ${data.jobTitle || 'المسمى الوظيفي'}
        </div>

        <div style="
          margin-top:12px;
          font-size:10.5px;
          line-height:2;
          color:#475569;
        ">

          ${data.country || data.city ? `
            ${data.country || ''}
            ${data.city ? ' | ' + data.city : ''}
          ` : ''}

          ${data.phone ? ` | ${data.phone}` : ''}

          ${data.email ? ` | ${data.email}` : ''}

          ${data.linkedin ? ` | LinkedIn: ${data.linkedin}` : ''}

          ${data.website ? ` | ${data.website}` : ''}

        </div>

      </div>


      <div style="padding:28px 50px 50px;">


        ${data.summary ? `

        <section style="margin-bottom:22px">

          <h2 style="
            margin:0 0 9px;
            padding-bottom:6px;
            border-bottom:1px solid ${theme.border};
            font-size:16px;
            font-weight:800;
            color:${theme.primary};
          ">
            الملخص المهني
          </h2>

          <p style="
            margin:0;
            font-size:11.5px;
            line-height:1.9;
            color:#475569;
            white-space:pre-line;
          ">
            ${data.summary}
          </p>

        </section>

        ` : ''}


        ${(data.experienceTitle || data.company) ? `

        <section style="margin-bottom:22px">

          <h2 style="
            margin:0 0 10px;
            padding-bottom:6px;
            border-bottom:1px solid ${theme.border};
            font-size:16px;
            font-weight:800;
            color:${theme.primary};
          ">
            الخبرة المهنية
          </h2>

          <div>

            <div style="
              font-size:13px;
              font-weight:800;
              color:#1e293b;
            ">
              ${data.experienceTitle || ''}
            </div>

            ${data.company ? `

            <div style="
              margin-top:3px;
              font-size:11px;
              color:${theme.accent};
              font-weight:700;
            ">
              ${data.company}
            </div>

            ` : ''}

            ${(data.experienceStart || data.experienceEnd) ? `

            <div style="
              margin-top:3px;
              font-size:9px;
              color:#64748b;
            ">
              ${data.experienceStart || ''}
              ${data.experienceEnd ? ' - ' + data.experienceEnd : ' - حتى الآن'}
            </div>

            ` : ''}

            ${data.experienceDescription ? `

            <p style="
              margin:7px 0 0;
              font-size:11px;
              line-height:1.9;
              color:#475569;
              white-space:pre-line;
            ">
              ${data.experienceDescription}
            </p>

            ` : ''}

          </div>

        </section>

        ` : ''}


        ${(data.degree || data.specialization || data.university) ? `

        <section style="margin-bottom:22px">

          <h2 style="
            margin:0 0 10px;
            padding-bottom:6px;
            border-bottom:1px solid ${theme.border};
            font-size:16px;
            font-weight:800;
            color:${theme.primary};
          ">
            التعليم
          </h2>

          <div>

            ${data.degree ? `

            <div style="
              font-size:13px;
              font-weight:800;
            ">
              ${data.degree}
            </div>

            ` : ''}

            ${data.specialization ? `

            <div style="
              margin-top:3px;
              font-size:11px;
              color:${theme.accent};
              font-weight:700;
            ">
              ${data.specialization}
            </div>

            ` : ''}

            ${data.university ? `

            <div style="
              margin-top:3px;
              font-size:11px;
              color:#475569;
            ">
              ${data.university}
            </div>

            ` : ''}

            ${data.graduationYear ? `

            <div style="
              margin-top:3px;
              font-size:9px;
              color:#64748b;
            ">
              سنة التخرج: ${data.graduationYear}
            </div>

            ` : ''}

          </div>

        </section>

        ` : ''}


        ${data.skills ? `

        <section style="margin-bottom:22px">

          <h2 style="
            margin:0 0 10px;
            padding-bottom:6px;
            border-bottom:1px solid ${theme.border};
            font-size:16px;
            font-weight:800;
            color:${theme.primary};
          ">
            المهارات
          </h2>

          <div style="
            font-size:11px;
            line-height:2;
            color:#334155;
          ">

            ${data.skills
              .split(',')
              .map(skill => `
                <span style="
                  display:inline-block;
                  margin:0 5px 5px 0;
                  padding:3px 8px;
                  background:${theme.light};
                  border:1px solid ${theme.border};
                  color:${theme.text};
                  border-radius:4px;
                  font-weight:700;
                ">
                  ${skill.trim()}
                </span>
              `)
              .join('')}

          </div>

        </section>

        ` : ''}


        ${data.certificates ? `

        <section style="margin-bottom:22px">

          <h2 style="
            margin:0 0 9px;
            padding-bottom:6px;
            border-bottom:1px solid ${theme.border};
            font-size:16px;
            font-weight:800;
            color:${theme.primary};
          ">
            الدورات والشهادات
          </h2>

          <p style="
            margin:0;
            font-size:11px;
            line-height:1.9;
            color:#475569;
            white-space:pre-line;
          ">
            ${data.certificates}
          </p>

        </section>

        ` : ''}


        ${data.languages ? `

        <section>

          <h2 style="
            margin:0 0 9px;
            padding-bottom:6px;
            border-bottom:1px solid ${theme.border};
            font-size:16px;
            font-weight:800;
            color:${theme.primary};
          ">
            اللغات
          </h2>

          <p style="
            margin:0;
            font-size:11px;
            line-height:1.9;
            color:#475569;
            white-space:pre-line;
          ">
            ${data.languages}
          </p>

        </section>

        ` : ''}

      </div>

    </div>


    <div style="
      max-width:794px;
      margin:25px auto 0;
      text-align:center;
    ">

      <a
        href="/cv-builder/ats"
        class="btn-primary"
        style="margin-left:8px"
      >
        تعديل البيانات
      </a>

    </div>

  </div>

  `;

  res.send(layout('معاينة السيرة الذاتية ATS - وظائف الوطن العربي', body));

});


/* =========================
   CV ATS - PDF
========================= */
app.post('/cv-builder/ats/pdf', express.urlencoded({ extended: true }), async (req, res) => {

  try {

    const data = req.body;


    const colors = {

      navy: {
        primary: '#15203a',
        accent: '#3b82f6',
        light: '#eff6ff',
        border: '#bfdbfe',
        text: '#1d4ed8'
      },

      blue: {
        primary: '#1e3a8a',
        accent: '#2563eb',
        light: '#eff6ff',
        border: '#bfdbfe',
        text: '#1d4ed8'
      },

      green: {
        primary: '#064e3b',
        accent: '#059669',
        light: '#ecfdf5',
        border: '#a7f3d0',
        text: '#047857'
      },

      teal: {
        primary: '#134e4a',
        accent: '#0f766e',
        light: '#f0fdfa',
        border: '#99f6e4',
        text: '#0f766e'
      },

      purple: {
        primary: '#3b0764',
        accent: '#7c3aed',
        light: '#f5f3ff',
        border: '#ddd6fe',
        text: '#6d28d9'
      },

      burgundy: {
        primary: '#450a0a',
        accent: '#991b1b',
        light: '#fef2f2',
        border: '#fecaca',
        text: '#b91c1c'
      },

      orange: {
        primary: '#431407',
        accent: '#ea580c',
        light: '#fff7ed',
        border: '#fed7aa',
        text: '#c2410c'
      },

      brown: {
        primary: '#451a03',
        accent: '#78350f',
        light: '#fffbeb',
        border: '#fde68a',
        text: '#92400e'
      },

      gray: {
        primary: '#1e293b',
        accent: '#475569',
        light: '#f1f5f9',
        border: '#cbd5e1',
        text: '#334155'
      },

      black: {
        primary: '#111827',
        accent: '#000000',
        light: '#f3f4f6',
        border: '#d1d5db',
        text: '#111827'
      }

    };


    const theme = colors[data.cvColor] || colors.navy;


    const executablePath = await puppeteer.executablePath();

    console.log('===== ATS PDF TEST =====');
    console.log('PUPPETEER EXECUTABLE:', executablePath);
    console.log('========================');


    const browser = await puppeteer.launch({

      headless: true,

      executablePath: executablePath,

      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]

    });


    const page = await browser.newPage();


    await page.setContent(`

      <!DOCTYPE html>

      <html lang="ar" dir="rtl">

      <head>

        <meta charset="UTF-8">

        <style>

          @page {
            size:A4;
            margin:0;
          }

          * {
            box-sizing:border-box;
          }

          body {
            margin:0;
            padding:0;
            background:#fff;
            font-family:Arial,Cairo,sans-serif;
            direction:rtl;
            color:#1e293b;
          }

          .cv {

            width:210mm;
            min-height:297mm;

            padding:16mm 18mm;

            background:#fff;

          }

          .header {

            padding-bottom:9mm;

            border-bottom:3px solid ${theme.accent};

          }

          h1 {

            margin:0;

            font-size:26px;

            font-weight:800;

            color:${theme.primary};

          }

          .job-title {

            margin-top:4px;

            font-size:14px;

            font-weight:bold;

            color:${theme.accent};

          }

          .contact {

            margin-top:9px;

            font-size:9px;

            line-height:2;

            color:#475569;

          }

          .section {

            margin-top:7mm;

          }

          .section-title {

            font-size:14px;

            font-weight:bold;

            color:${theme.primary};

            border-bottom:1px solid ${theme.border};

            padding-bottom:3px;

            margin-bottom:5px;

          }

          .text {

            font-size:9.5px;

            line-height:1.85;

            color:#475569;

            white-space:pre-line;

          }

          .item-title {

            font-size:11.5px;

            font-weight:bold;

            color:#1e293b;

          }

          .company {

            margin-top:2px;

            font-size:9.5px;

            color:${theme.accent};

            font-weight:bold;

          }

          .date {

            margin-top:2px;

            font-size:8px;

            color:#64748b;

          }

          .skills {

            font-size:9.5px;

            line-height:2;

          }

          .skill {

            display:inline-block;

            margin:0 4px 4px 0;

            padding:2px 6px;

            background:${theme.light};

            border:1px solid ${theme.border};

            color:${theme.text};

            border-radius:3px;

            font-weight:bold;

          }

        </style>

      </head>

      <body>

        <div class="cv">

          <div class="header">

            <h1>
              ${data.fullName || 'الاسم الكامل'}
            </h1>

            <div class="job-title">
              ${data.jobTitle || 'المسمى الوظيفي'}
            </div>

            <div class="contact">

              ${data.country || data.city ? `
                ${data.country || ''}
                ${data.city ? ' | ' + data.city : ''}
              ` : ''}

              ${data.phone ? ` | ${data.phone}` : ''}

              ${data.email ? ` | ${data.email}` : ''}

              ${data.linkedin ? ` | LinkedIn: ${data.linkedin}` : ''}

              ${data.website ? ` | ${data.website}` : ''}

            </div>

          </div>


          ${data.summary ? `

          <div class="section">

            <div class="section-title">
              الملخص المهني
            </div>

            <div class="text">
              ${data.summary}
            </div>

          </div>

          ` : ''}


          ${(data.experienceTitle || data.company) ? `

          <div class="section">

            <div class="section-title">
              الخبرة المهنية
            </div>

            <div>

              <div class="item-title">
                ${data.experienceTitle || ''}
              </div>

              ${data.company ? `

              <div class="company">
                ${data.company}
              </div>

              ` : ''}

              ${(data.experienceStart || data.experienceEnd) ? `

              <div class="date">

                ${data.experienceStart || ''}

                ${data.experienceEnd
                  ? ' - ' + data.experienceEnd
                  : ' - حتى الآن'}

              </div>

              ` : ''}

              ${data.experienceDescription ? `

              <div class="text" style="margin-top:4px">

                ${data.experienceDescription}

              </div>

              ` : ''}

            </div>

          </div>

          ` : ''}


          ${(data.degree || data.specialization || data.university) ? `

          <div class="section">

            <div class="section-title">
              التعليم
            </div>

            <div>

              ${data.degree ? `

              <div class="item-title">
                ${data.degree}
              </div>

              ` : ''}

              ${data.specialization ? `

              <div class="company">
                ${data.specialization}
              </div>

              ` : ''}

              ${data.university ? `

              <div class="text">
                ${data.university}
              </div>

              ` : ''}

              ${data.graduationYear ? `

              <div class="date">
                سنة التخرج: ${data.graduationYear}
              </div>

              ` : ''}

            </div>

          </div>

          ` : ''}


          ${data.skills ? `

          <div class="section">

            <div class="section-title">
              المهارات
            </div>

            <div class="skills">

              ${data.skills
                .split(',')
                .map(skill => `

                  <span class="skill">
                    ${skill.trim()}
                  </span>

                `)
                .join('')}

            </div>

          </div>

          ` : ''}


          ${data.certificates ? `

          <div class="section">

            <div class="section-title">
              الدورات والشهادات
            </div>

            <div class="text">
              ${data.certificates}
            </div>

          </div>

          ` : ''}


          ${data.languages ? `

          <div class="section">

            <div class="section-title">
              اللغات
            </div>

            <div class="text">
              ${data.languages}
            </div>

          </div>

          ` : ''}

        </div>

      </body>

      </html>

    `, {

      waitUntil:'networkidle0'

    });


    const pdf = await page.pdf({

      format:'A4',

      printBackground:true,

      margin: {
        top:'0',
        right:'0',
        bottom:'0',
        left:'0'
      }

    });


    await browser.close();


    res.set({

      'Content-Type':'application/pdf',

      'Content-Disposition':'attachment; filename="ats-cv.pdf"',

      'Content-Length':pdf.length

    });


    res.send(pdf);


  } catch(error) {

    console.error('ATS PDF ERROR:', error);

    res.status(500).send(
      'حدث خطأ أثناء إنشاء ملف PDF للسيرة الذاتية ATS'
    );

  }

});

/* =========================
   CV MODERN - FORM
========================= */
app.get('/cv-builder/modern', (req, res) => {

  const body = `

  <div class="page-container">

    <h1 class="section-title">إنشاء السيرة الذاتية</h1>

    <h2 style="font-size:24px;font-weight:800;margin-bottom:8px">
      القالب العصري Modern
    </h2>

    <p style="color:var(--muted);margin-bottom:28px">
      أنشئ سيرة ذاتية عصرية ومنظمة، واختر اللون الذي يناسبك ثم قم بمعاينتها أو تحميلها بصيغة PDF.
    </p>

    <form method="POST" action="/cv-builder/modern/preview">

      <!-- الألوان -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          اختر لون السيرة الذاتية
        </h3>

        <div style="
          display:flex;
          flex-wrap:wrap;
          gap:18px;
          align-items:center;
        ">

          <label style="cursor:pointer;text-align:center">
            <input type="radio" name="cvColor" value="navy" checked style="display:none">
            <span style="display:block;width:48px;height:48px;background:#15203a;border-radius:50%;border:4px solid #fff;box-shadow:0 0 0 2px #15203a"></span>
            <small style="display:block;margin-top:6px">كحلي</small>
          </label>

          <label style="cursor:pointer;text-align:center">
            <input type="radio" name="cvColor" value="blue" style="display:none">
            <span style="display:block;width:48px;height:48px;background:#2563eb;border-radius:50%"></span>
            <small style="display:block;margin-top:6px">أزرق</small>
          </label>

          <label style="cursor:pointer;text-align:center">
            <input type="radio" name="cvColor" value="green" style="display:none">
            <span style="display:block;width:48px;height:48px;background:#059669;border-radius:50%"></span>
            <small style="display:block;margin-top:6px">أخضر</small>
          </label>

          <label style="cursor:pointer;text-align:center">
            <input type="radio" name="cvColor" value="teal" style="display:none">
            <span style="display:block;width:48px;height:48px;background:#0f766e;border-radius:50%"></span>
            <small style="display:block;margin-top:6px">تركواز</small>
          </label>

          <label style="cursor:pointer;text-align:center">
            <input type="radio" name="cvColor" value="purple" style="display:none">
            <span style="display:block;width:48px;height:48px;background:#7c3aed;border-radius:50%"></span>
            <small style="display:block;margin-top:6px">بنفسجي</small>
          </label>

          <label style="cursor:pointer;text-align:center">
            <input type="radio" name="cvColor" value="burgundy" style="display:none">
            <span style="display:block;width:48px;height:48px;background:#991b1b;border-radius:50%"></span>
            <small style="display:block;margin-top:6px">خمري</small>
          </label>

          <label style="cursor:pointer;text-align:center">
            <input type="radio" name="cvColor" value="orange" style="display:none">
            <span style="display:block;width:48px;height:48px;background:#ea580c;border-radius:50%"></span>
            <small style="display:block;margin-top:6px">برتقالي</small>
          </label>

          <label style="cursor:pointer;text-align:center">
            <input type="radio" name="cvColor" value="brown" style="display:none">
            <span style="display:block;width:48px;height:48px;background:#78350f;border-radius:50%"></span>
            <small style="display:block;margin-top:6px">بني</small>
          </label>

          <label style="cursor:pointer;text-align:center">
            <input type="radio" name="cvColor" value="gray" style="display:none">
            <span style="display:block;width:48px;height:48px;background:#475569;border-radius:50%"></span>
            <small style="display:block;margin-top:6px">رمادي</small>
          </label>

          <label style="cursor:pointer;text-align:center">
            <input type="radio" name="cvColor" value="black" style="display:none">
            <span style="display:block;width:48px;height:48px;background:#111827;border-radius:50%"></span>
            <small style="display:block;margin-top:6px">أسود</small>
          </label>

        </div>
      </div>


      <!-- المعلومات الشخصية -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          المعلومات الشخصية
        </h3>

        <div style="
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:18px;
        ">

          <div>
            <label>الاسم الكامل</label>
            <input type="text" name="fullName"
              placeholder="مثال: أحمد محمد"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

          <div>
            <label>المسمى الوظيفي</label>
            <input type="text" name="jobTitle"
              placeholder="مثال: مهندس برمجيات"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

          <div>
            <label>الدولة</label>
            <input type="text" name="country"
              placeholder="مثال: الأردن"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

          <div>
            <label>المدينة</label>
            <input type="text" name="city"
              placeholder="مثال: عمّان"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

          <div>
            <label>رقم الهاتف</label>
            <input type="tel" name="phone"
              placeholder="مثال: 0790000000"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

          <div>
            <label>البريد الإلكتروني</label>
            <input type="email" name="email"
              placeholder="example@email.com"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

          <div>
            <label>LinkedIn</label>
            <input type="text" name="linkedin"
              placeholder="رابط LinkedIn - اختياري"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

          <div>
            <label>الموقع الشخصي</label>
            <input type="text" name="website"
              placeholder="رابط الموقع - اختياري"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

        </div>
      </div>


      <!-- الملخص -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          الملخص المهني
        </h3>

        <textarea
          name="summary"
          rows="6"
          placeholder="اكتب نبذة مختصرة عن خبرتك ومهاراتك وأهدافك المهنية..."
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;resize:vertical;font-family:inherit;line-height:1.8"
        ></textarea>

      </div>


      <!-- الخبرة -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          الخبرات المهنية
        </h3>

        <div style="
          background:#f8fafc;
          border:1px solid var(--border);
          border-radius:12px;
          padding:20px;
        ">

          <div style="
            display:grid;
            grid-template-columns:repeat(2,1fr);
            gap:18px;
          ">

            <div>
              <label>المسمى الوظيفي</label>
              <input type="text" name="experienceTitle"
                placeholder="مثال: محاسب"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
            </div>

            <div>
              <label>اسم الشركة</label>
              <input type="text" name="company"
                placeholder="اسم الشركة"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
            </div>

            <div>
              <label>تاريخ البداية</label>
              <input type="month" name="experienceStart"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
            </div>

            <div>
              <label>تاريخ النهاية</label>
              <input type="month" name="experienceEnd"
                style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
            </div>

          </div>

          <div style="margin-top:18px">

            <label>وصف الخبرة والمسؤوليات</label>

            <textarea
              name="experienceDescription"
              rows="5"
              placeholder="اكتب أهم المسؤوليات والإنجازات..."
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;resize:vertical;font-family:inherit;line-height:1.8;margin-top:6px"
            ></textarea>

          </div>

        </div>
      </div>


      <!-- التعليم -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          التعليم
        </h3>

        <div style="
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:18px;
        ">

          <div>
            <label>الدرجة العلمية</label>
            <input type="text" name="degree"
              placeholder="مثال: بكالوريوس"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

          <div>
            <label>التخصص</label>
            <input type="text" name="specialization"
              placeholder="مثال: إدارة الأعمال"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

          <div>
            <label>الجامعة أو المؤسسة التعليمية</label>
            <input type="text" name="university"
              placeholder="اسم الجامعة"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

          <div>
            <label>سنة التخرج</label>
            <input type="number" name="graduationYear"
              placeholder="2026"
              style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
          </div>

        </div>
      </div>


      <!-- المهارات -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          المهارات
        </h3>

        <input
          type="text"
          name="skills"
          placeholder="Excel، التواصل، إدارة الوقت، البرمجة..."
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px"
        >

        <p style="font-size:12px;color:var(--muted);margin-top:6px">
          افصل بين المهارات باستخدام الفاصلة.
        </p>

      </div>


      <!-- الدورات -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          الدورات والشهادات
        </h3>

        <textarea
          name="certificates"
          rows="4"
          placeholder="اكتب الدورات والشهادات..."
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;resize:vertical;font-family:inherit;line-height:1.8"
        ></textarea>

      </div>


      <!-- اللغات -->
      <div style="margin-bottom:32px">

        <h3 style="
          font-size:19px;
          font-weight:800;
          margin-bottom:18px;
          padding-bottom:10px;
          border-bottom:2px solid var(--border);
        ">
          اللغات
        </h3>

        <textarea
          name="languages"
          rows="3"
          placeholder="العربية - اللغة الأم&#10;الإنجليزية - جيد جدًا"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;resize:vertical;font-family:inherit;line-height:1.8"
        ></textarea>

      </div>


      <!-- الأزرار -->
      <div style="
        text-align:center;
        margin-top:30px;
        display:flex;
        justify-content:center;
        gap:12px;
        flex-wrap:wrap;
      ">

        <button
          type="submit"
          class="btn-primary"
          style="border:none;cursor:pointer;font-family:inherit"
        >
          <i class="fas fa-eye"></i>
          معاينة السيرة الذاتية
        </button>

        <button
          type="submit"
          formaction="/cv-builder/modern/pdf"
          formmethod="POST"
          class="btn-primary"
          style="
            border:none;
            cursor:pointer;
            font-family:inherit;
            background:#10b981;
          "
        >
          <i class="fas fa-file-pdf"></i>
          تحميل PDF
        </button>

      </div>

    </form>

  </div>
  `;

  res.send(layout('إنشاء السيرة الذاتية - القالب العصري', body));
});

/* =========================
   CV MODERN - PREVIEW
========================= */
app.post('/cv-builder/modern/preview', express.urlencoded({ extended: true }), (req, res) => {

  const data = req.body;

  const colors = {
    navy: {
      primary: '#15203a',
      accent: '#3b82f6',
      light: '#eff6ff',
      border: '#bfdbfe',
      text: '#1d4ed8'
    },
    blue: {
      primary: '#1e3a8a',
      accent: '#2563eb',
      light: '#eff6ff',
      border: '#bfdbfe',
      text: '#1d4ed8'
    },
    green: {
      primary: '#064e3b',
      accent: '#059669',
      light: '#ecfdf5',
      border: '#a7f3d0',
      text: '#047857'
    },
    teal: {
      primary: '#134e4a',
      accent: '#0f766e',
      light: '#f0fdfa',
      border: '#99f6e4',
      text: '#0f766e'
    },
    purple: {
      primary: '#3b0764',
      accent: '#7c3aed',
      light: '#f5f3ff',
      border: '#ddd6fe',
      text: '#6d28d9'
    },
    burgundy: {
      primary: '#450a0a',
      accent: '#991b1b',
      light: '#fef2f2',
      border: '#fecaca',
      text: '#b91c1c'
    },
    orange: {
      primary: '#431407',
      accent: '#ea580c',
      light: '#fff7ed',
      border: '#fed7aa',
      text: '#c2410c'
    },
    brown: {
      primary: '#451a03',
      accent: '#78350f',
      light: '#fffbeb',
      border: '#fde68a',
      text: '#92400e'
    },
    gray: {
      primary: '#1e293b',
      accent: '#475569',
      light: '#f1f5f9',
      border: '#cbd5e1',
      text: '#334155'
    },
    black: {
      primary: '#111827',
      accent: '#000000',
      light: '#f3f4f6',
      border: '#d1d5db',
      text: '#111827'
    }
  };

  const theme = colors[data.cvColor] || colors.navy;

  const skills = data.skills
    ? data.skills.split(',').map(skill => `
      <span style="
        background:${theme.light};
        border:1px solid ${theme.border};
        color:${theme.text};
        padding:6px 11px;
        border-radius:6px;
        font-size:10px;
        font-weight:700;
        display:inline-block;
      ">
        ${skill.trim()}
      </span>
    `).join('')
    : '';

  const body = `
  <div style="
    background:#eef2f7;
    padding:40px 15px;
    min-height:100vh;
    direction:rtl;
  ">

    <div style="
      max-width:794px;
      min-height:1123px;
      margin:0 auto;
      background:#fff;
      box-shadow:0 12px 40px rgba(15,23,42,.15);
      display:flex;
      overflow:hidden;
      direction:rtl;
      font-family:'Cairo',Arial,sans-serif;
    ">

      <!-- SIDE -->
      <aside style="
        width:235px;
        flex-shrink:0;
        background:${theme.primary};
        color:#fff;
        padding:34px 22px;
      ">

        <div style="
          width:90px;
          height:90px;
          border-radius:50%;
          background:${theme.accent};
          margin:0 auto 20px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:34px;
          font-weight:800;
        ">
          ${(data.fullName || 'ا').trim().charAt(0)}
        </div>

        <h1 style="
          text-align:center;
          margin:0;
          font-size:23px;
          line-height:1.5;
          font-weight:800;
          color:#fff;
        ">
          ${data.fullName || 'الاسم الكامل'}
        </h1>

        <div style="
          text-align:center;
          margin-top:6px;
          color:${theme.light};
          font-size:12px;
          font-weight:700;
          line-height:1.6;
        ">
          ${data.jobTitle || 'المسمى الوظيفي'}
        </div>


        <div style="
          margin-top:28px;
          padding-top:18px;
          border-top:1px solid rgba(255,255,255,.2);
        ">

          <div style="
            font-size:12px;
            font-weight:800;
            margin-bottom:12px;
            color:#fff;
          ">
            معلومات التواصل
          </div>

          ${data.country || data.city ? `
          <div style="font-size:10px;line-height:1.8;margin-bottom:8px">
            📍 ${data.country || ''}${data.city ? ' - ' + data.city : ''}
          </div>
          ` : ''}

          ${data.phone ? `
          <div style="font-size:10px;line-height:1.8;margin-bottom:8px">
            ☎ ${data.phone}
          </div>
          ` : ''}

          ${data.email ? `
          <div style="font-size:10px;line-height:1.8;margin-bottom:8px;word-break:break-word">
            ✉ ${data.email}
          </div>
          ` : ''}

          ${data.linkedin ? `
          <div style="font-size:10px;line-height:1.8;margin-bottom:8px;word-break:break-word">
            LinkedIn<br>${data.linkedin}
          </div>
          ` : ''}

          ${data.website ? `
          <div style="font-size:10px;line-height:1.8;word-break:break-word">
            🌐 ${data.website}
          </div>
          ` : ''}

        </div>


        ${data.skills ? `
        <div style="
          margin-top:26px;
          padding-top:18px;
          border-top:1px solid rgba(255,255,255,.2);
        ">

          <div style="
            font-size:12px;
            font-weight:800;
            margin-bottom:12px;
          ">
            المهارات
          </div>

          ${data.skills.split(',').map(skill => `
            <div style="
              margin-bottom:7px;
              font-size:10px;
              line-height:1.6;
              color:#f8fafc;
            ">
              • ${skill.trim()}
            </div>
          `).join('')}

        </div>
        ` : ''}


        ${data.languages ? `
        <div style="
          margin-top:26px;
          padding-top:18px;
          border-top:1px solid rgba(255,255,255,.2);
        ">

          <div style="
            font-size:12px;
            font-weight:800;
            margin-bottom:10px;
          ">
            اللغات
          </div>

          <div style="
            font-size:10px;
            line-height:2;
            white-space:pre-line;
            color:#f8fafc;
          ">
            ${data.languages}
          </div>

        </div>
        ` : ''}

      </aside>


      <!-- MAIN -->
      <main style="
        flex:1;
        padding:38px 34px;
        color:#1e293b;
        min-width:0;
      ">

        ${data.summary ? `
        <section style="margin-bottom:25px">

          <div style="
            display:flex;
            align-items:center;
            gap:9px;
            margin-bottom:10px;
          ">

            <div style="
              width:30px;
              height:4px;
              background:${theme.accent};
              border-radius:4px;
            "></div>

            <h2 style="
              margin:0;
              font-size:16px;
              font-weight:800;
              color:${theme.primary};
            ">
              الملف المهني
            </h2>

          </div>

          <p style="
            margin:0;
            font-size:11px;
            line-height:2;
            color:#475569;
            white-space:pre-line;
          ">
            ${data.summary}
          </p>

        </section>
        ` : ''}


        ${(data.experienceTitle || data.company) ? `
        <section style="margin-bottom:25px">

          <div style="
            display:flex;
            align-items:center;
            gap:9px;
            margin-bottom:13px;
          ">

            <div style="
              width:30px;
              height:4px;
              background:${theme.accent};
              border-radius:4px;
            "></div>

            <h2 style="
              margin:0;
              font-size:16px;
              font-weight:800;
              color:${theme.primary};
            ">
              الخبرة المهنية
            </h2>

          </div>


          <div style="
            border-right:3px solid ${theme.light};
            padding-right:14px;
          ">

            <h3 style="
              margin:0;
              font-size:13px;
              font-weight:800;
            ">
              ${data.experienceTitle || ''}
            </h3>

            ${data.company ? `
            <div style="
              color:${theme.accent};
              font-size:11px;
              font-weight:700;
              margin-top:4px;
            ">
              ${data.company}
            </div>
            ` : ''}

            ${(data.experienceStart || data.experienceEnd) ? `
            <div style="
              color:#94a3b8;
              font-size:9px;
              margin-top:4px;
            ">
              ${data.experienceStart || ''}
              ${data.experienceEnd ? ' - ' + data.experienceEnd : ' - حتى الآن'}
            </div>
            ` : ''}

            ${data.experienceDescription ? `
            <p style="
              margin:8px 0 0;
              font-size:10.5px;
              line-height:1.9;
              color:#475569;
              white-space:pre-line;
            ">
              ${data.experienceDescription}
            </p>
            ` : ''}

          </div>

        </section>
        ` : ''}


        ${(data.degree || data.specialization || data.university) ? `
        <section style="margin-bottom:25px">

          <div style="
            display:flex;
            align-items:center;
            gap:9px;
            margin-bottom:13px;
          ">

            <div style="
              width:30px;
              height:4px;
              background:${theme.accent};
              border-radius:4px;
            "></div>

            <h2 style="
              margin:0;
              font-size:16px;
              font-weight:800;
              color:${theme.primary};
            ">
              التعليم
            </h2>

          </div>

          <div style="
            border-right:3px solid ${theme.light};
            padding-right:14px;
          ">

            ${data.degree ? `
            <h3 style="margin:0;font-size:13px;font-weight:800">
              ${data.degree}
            </h3>
            ` : ''}

            ${data.specialization ? `
            <div style="
              color:${theme.accent};
              font-size:11px;
              font-weight:700;
              margin-top:4px;
            ">
              ${data.specialization}
            </div>
            ` : ''}

            ${data.university ? `
            <div style="
              font-size:10.5px;
              color:#475569;
              margin-top:4px;
            ">
              ${data.university}
            </div>
            ` : ''}

            ${data.graduationYear ? `
            <div style="
              font-size:9px;
              color:#94a3b8;
              margin-top:4px;
            ">
              سنة التخرج: ${data.graduationYear}
            </div>
            ` : ''}

          </div>

        </section>
        ` : ''}


        ${data.skills ? `
        <section style="margin-bottom:25px">

          <div style="
            display:flex;
            align-items:center;
            gap:9px;
            margin-bottom:12px;
          ">

            <div style="
              width:30px;
              height:4px;
              background:${theme.accent};
              border-radius:4px;
            "></div>

            <h2 style="
              margin:0;
              font-size:16px;
              font-weight:800;
              color:${theme.primary};
            ">
              المهارات
            </h2>

          </div>

          <div style="
            display:flex;
            flex-wrap:wrap;
            gap:6px;
          ">
            ${skills}
          </div>

        </section>
        ` : ''}


        ${data.certificates ? `
        <section style="margin-bottom:25px">

          <div style="
            display:flex;
            align-items:center;
            gap:9px;
            margin-bottom:12px;
          ">

            <div style="
              width:30px;
              height:4px;
              background:${theme.accent};
              border-radius:4px;
            "></div>

            <h2 style="
              margin:0;
              font-size:16px;
              font-weight:800;
              color:${theme.primary};
            ">
              الدورات والشهادات
            </h2>

          </div>

          <div style="
            font-size:10.5px;
            line-height:1.9;
            color:#475569;
            white-space:pre-line;
          ">
            ${data.certificates}
          </div>

        </section>
        ` : ''}

      </main>

    </div>


    <div style="
      max-width:794px;
      margin:25px auto 0;
      text-align:center;
    ">

      <a
        href="/cv-builder/modern"
        class="btn-primary"
        style="margin-left:8px"
      >
        تعديل البيانات
      </a>

    </div>

  </div>
  `;

  res.send(layout('معاينة السيرة الذاتية - القالب العصري', body));
});

/* =========================
   CV MODERN - PDF
========================= */
app.post('/cv-builder/modern/pdf', express.urlencoded({ extended: true }), async (req, res) => {

  try {

    const data = req.body;

    const colors = {
      navy: {
        primary: '#15203a',
        accent: '#3b82f6',
        light: '#eff6ff',
        border: '#bfdbfe',
        text: '#1d4ed8'
      },
      blue: {
        primary: '#1e3a8a',
        accent: '#2563eb',
        light: '#eff6ff',
        border: '#bfdbfe',
        text: '#1d4ed8'
      },
      green: {
        primary: '#064e3b',
        accent: '#059669',
        light: '#ecfdf5',
        border: '#a7f3d0',
        text: '#047857'
      },
      teal: {
        primary: '#134e4a',
        accent: '#0f766e',
        light: '#f0fdfa',
        border: '#99f6e4',
        text: '#0f766e'
      },
      purple: {
        primary: '#3b0764',
        accent: '#7c3aed',
        light: '#f5f3ff',
        border: '#ddd6fe',
        text: '#6d28d9'
      },
      burgundy: {
        primary: '#450a0a',
        accent: '#991b1b',
        light: '#fef2f2',
        border: '#fecaca',
        text: '#b91c1c'
      },
      orange: {
        primary: '#431407',
        accent: '#ea580c',
        light: '#fff7ed',
        border: '#fed7aa',
        text: '#c2410c'
      },
      brown: {
        primary: '#451a03',
        accent: '#78350f',
        light: '#fffbeb',
        border: '#fde68a',
        text: '#92400e'
      },
      gray: {
        primary: '#1e293b',
        accent: '#475569',
        light: '#f1f5f9',
        border: '#cbd5e1',
        text: '#334155'
      },
      black: {
        primary: '#111827',
        accent: '#000000',
        light: '#f3f4f6',
        border: '#d1d5db',
        text: '#111827'
      }
    };

    const theme = colors[data.cvColor] || colors.navy;

   const executablePath = await puppeteer.executablePath();

console.log('===== PDF TEST =====');
console.log('PUPPETEER EXECUTABLE:', executablePath);

const browser = await puppeteer.launch({
  headless: true,
  executablePath: executablePath,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ]
});

    const page = await browser.newPage();

    await page.setContent(`
      <!DOCTYPE html>

      <html lang="ar" dir="rtl">

      <head>

        <meta charset="UTF-8">

        <style>

          @page {
            size: A4;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            width: 210mm;
            min-height: 297mm;
            background: #ffffff;
          }

          body {
            font-family: Arial, sans-serif;
            direction: rtl;
            color: #1e293b;
          }

          .cv {
            width: 210mm;
            min-height: 297mm;
            display: flex;
            background: #ffffff;
            direction: rtl;
          }

          .sidebar {
            width: 62mm;
            min-height: 297mm;
            background: ${theme.primary};
            color: #ffffff;
            padding: 11mm 6mm;
            flex-shrink: 0;
          }

          .main {
            width: 148mm;
            min-height: 297mm;
            padding: 11mm 10mm;
            background: #ffffff;
          }

          .avatar {
            width: 27mm;
            height: 27mm;
            border-radius: 50%;
            background: ${theme.accent};
            margin: 0 auto 5mm;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 23px;
            font-weight: bold;
          }

          .name {
            text-align: center;
            font-size: 18px;
            line-height: 1.5;
            font-weight: bold;
            color: #ffffff;
          }

          .job-title {
            text-align: center;
            margin-top: 2mm;
            color: ${theme.light};
            font-size: 9px;
            font-weight: bold;
            line-height: 1.6;
          }

          .side-section {
            margin-top: 8mm;
            padding-top: 5mm;
            border-top: 1px solid rgba(255,255,255,.22);
          }

          .side-title {
            font-size: 9px;
            font-weight: bold;
            margin-bottom: 3mm;
            color: #ffffff;
          }

          .side-text {
            font-size: 7.5px;
            line-height: 1.9;
            color: #f8fafc;
            word-break: break-word;
            white-space: pre-line;
          }

          .side-skill {
            font-size: 7.5px;
            line-height: 1.8;
            margin-bottom: 1mm;
            color: #f8fafc;
          }

          .section {
            margin-bottom: 6mm;
          }

          .section-title {
            display: flex;
            align-items: center;
            gap: 3mm;
            margin-bottom: 3mm;
          }

          .section-line {
            width: 10mm;
            height: 1.3mm;
            background: ${theme.accent};
            border-radius: 2mm;
          }

          .section-title-text {
            font-size: 12px;
            font-weight: bold;
            color: ${theme.primary};
          }

          .text {
            font-size: 8.5px;
            line-height: 1.9;
            color: #475569;
            white-space: pre-line;
          }

          .item {
            border-right: 1.2mm solid ${theme.light};
            padding-right: 4mm;
          }

          .item-title {
            font-size: 10px;
            font-weight: bold;
            color: #1e293b;
          }

          .company {
            color: ${theme.accent};
            font-size: 8.5px;
            font-weight: bold;
            margin-top: 1mm;
          }

          .date {
            color: #94a3b8;
            font-size: 7px;
            margin-top: 1mm;
          }

          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 2mm;
          }

          .skill {
            background: ${theme.light};
            border: 0.3mm solid ${theme.border};
            color: ${theme.text};
            padding: 1.5mm 2.5mm;
            border-radius: 1.5mm;
            font-size: 7.5px;
            font-weight: bold;
          }

        </style>

      </head>

      <body>

        <div class="cv">

          <!-- SIDEBAR -->

          <aside class="sidebar">

            <div class="avatar">
              ${(data.fullName || 'ا').trim().charAt(0)}
            </div>

            <div class="name">
              ${data.fullName || 'الاسم الكامل'}
            </div>

            <div class="job-title">
              ${data.jobTitle || 'المسمى الوظيفي'}
            </div>


            <div class="side-section">

              <div class="side-title">
                معلومات التواصل
              </div>

              ${data.country || data.city ? `
                <div class="side-text">
                  📍 ${data.country || ''}${data.city ? ' - ' + data.city : ''}
                </div>
              ` : ''}

              ${data.phone ? `
                <div class="side-text">
                  ☎ ${data.phone}
                </div>
              ` : ''}

              ${data.email ? `
                <div class="side-text">
                  ✉ ${data.email}
                </div>
              ` : ''}

              ${data.linkedin ? `
                <div class="side-text">
                  LinkedIn<br>${data.linkedin}
                </div>
              ` : ''}

              ${data.website ? `
                <div class="side-text">
                  🌐 ${data.website}
                </div>
              ` : ''}

            </div>


            ${data.skills ? `

            <div class="side-section">

              <div class="side-title">
                المهارات
              </div>

              ${data.skills.split(',').map(skill => `
                <div class="side-skill">
                  • ${skill.trim()}
                </div>
              `).join('')}

            </div>

            ` : ''}


            ${data.languages ? `

            <div class="side-section">

              <div class="side-title">
                اللغات
              </div>

              <div class="side-text">
                ${data.languages}
              </div>

            </div>

            ` : ''}

          </aside>


          <!-- MAIN -->

          <main class="main">

            ${data.summary ? `

            <section class="section">

              <div class="section-title">

                <div class="section-line"></div>

                <div class="section-title-text">
                  الملف المهني
                </div>

              </div>

              <div class="text">
                ${data.summary}
              </div>

            </section>

            ` : ''}


            ${(data.experienceTitle || data.company) ? `

            <section class="section">

              <div class="section-title">

                <div class="section-line"></div>

                <div class="section-title-text">
                  الخبرة المهنية
                </div>

              </div>

              <div class="item">

                <div class="item-title">
                  ${data.experienceTitle || ''}
                </div>

                ${data.company ? `
                  <div class="company">
                    ${data.company}
                  </div>
                ` : ''}

                ${(data.experienceStart || data.experienceEnd) ? `
                  <div class="date">
                    ${data.experienceStart || ''}
                    ${data.experienceEnd ? ' - ' + data.experienceEnd : ' - حتى الآن'}
                  </div>
                ` : ''}

                ${data.experienceDescription ? `
                  <div class="text" style="margin-top:2mm">
                    ${data.experienceDescription}
                  </div>
                ` : ''}

              </div>

            </section>

            ` : ''}


            ${(data.degree || data.specialization || data.university) ? `

            <section class="section">

              <div class="section-title">

                <div class="section-line"></div>

                <div class="section-title-text">
                  التعليم
                </div>

              </div>

              <div class="item">

                ${data.degree ? `
                  <div class="item-title">
                    ${data.degree}
                  </div>
                ` : ''}

                ${data.specialization ? `
                  <div class="company">
                    ${data.specialization}
                  </div>
                ` : ''}

                ${data.university ? `
                  <div class="text">
                    ${data.university}
                  </div>
                ` : ''}

                ${data.graduationYear ? `
                  <div class="date">
                    سنة التخرج: ${data.graduationYear}
                  </div>
                ` : ''}

              </div>

            </section>

            ` : ''}


            ${data.skills ? `

            <section class="section">

              <div class="section-title">

                <div class="section-line"></div>

                <div class="section-title-text">
                  المهارات
                </div>

              </div>

              <div class="skills">

                ${data.skills.split(',').map(skill => `
                  <span class="skill">
                    ${skill.trim()}
                  </span>
                `).join('')}

              </div>

            </section>

            ` : ''}


            ${data.certificates ? `

            <section class="section">

              <div class="section-title">

                <div class="section-line"></div>

                <div class="section-title-text">
                  الدورات والشهادات
                </div>

              </div>

              <div class="text">
                ${data.certificates}
              </div>

            </section>

            ` : ''}

          </main>

        </div>

      </body>

      </html>
    `, {
      waitUntil: 'networkidle0'
    });


   const pdf = await page.pdf({
  format: 'A4',
  printBackground: true,
  margin: {
    top: '0',
    right: '0',
    bottom: '0',
    left: '0'
  }
});

await browser.close();

res.set({
  'Content-Type': 'application/pdf',
  'Content-Disposition': 'attachment; filename="my-cv.pdf"',
  'Content-Length': pdf.length
});

res.send(pdf);

  } catch (error) {

    console.error('MODERN PDF ERROR:', error);

    res.status(500).send('حدث خطأ أثناء إنشاء ملف PDF');

  }

});

/* =========================
CV CREATIVE - FORM
========================= */
app.get('/cv-builder/creative', (req, res) => {

const body = `

<h1 class="section-title">إنشاء السيرة الذاتية</h1>

<h2 style="font-size:24px;font-weight:800;margin-bottom:8px">
  القالب الإبداعي Creative
</h2>

<p style="color:var(--muted);margin-bottom:28px">
  صمّم سيرة ذاتية مميزة وعصرية، واختر اللون الذي يناسب شخصيتك المهنية.
</p>

<form method="POST" action="/cv-builder/creative/preview">

  <!-- الألوان -->
  <div style="margin-bottom:32px">

    <h3 style="
      font-size:19px;
      font-weight:800;
      margin-bottom:18px;
      padding-bottom:10px;
      border-bottom:2px solid var(--border);
    ">
      اختر لون السيرة الذاتية
    </h3>

    <div style="
      display:flex;
      flex-wrap:wrap;
      gap:18px;
      align-items:center;
    ">

      <label style="cursor:pointer;text-align:center">
        <input type="radio" name="cvColor" value="navy" checked style="display:none">
        <span style="display:block;width:48px;height:48px;background:#15203a;border-radius:14px;transform:rotate(45deg);border:4px solid #fff;box-shadow:0 0 0 2px #15203a"></span>
        <small style="display:block;margin-top:12px">كحلي</small>
      </label>

      <label style="cursor:pointer;text-align:center">
        <input type="radio" name="cvColor" value="blue" style="display:none">
        <span style="display:block;width:48px;height:48px;background:#2563eb;border-radius:14px;transform:rotate(45deg)"></span>
        <small style="display:block;margin-top:12px">أزرق</small>
      </label>

      <label style="cursor:pointer;text-align:center">
        <input type="radio" name="cvColor" value="green" style="display:none">
        <span style="display:block;width:48px;height:48px;background:#059669;border-radius:14px;transform:rotate(45deg)"></span>
        <small style="display:block;margin-top:12px">أخضر</small>
      </label>

      <label style="cursor:pointer;text-align:center">
        <input type="radio" name="cvColor" value="teal" style="display:none">
        <span style="display:block;width:48px;height:48px;background:#0f766e;border-radius:14px;transform:rotate(45deg)"></span>
        <small style="display:block;margin-top:12px">تركواز</small>
      </label>

      <label style="cursor:pointer;text-align:center">
        <input type="radio" name="cvColor" value="purple" style="display:none">
        <span style="display:block;width:48px;height:48px;background:#7c3aed;border-radius:14px;transform:rotate(45deg)"></span>
        <small style="display:block;margin-top:12px">بنفسجي</small>
      </label>

      <label style="cursor:pointer;text-align:center">
        <input type="radio" name="cvColor" value="burgundy" style="display:none">
        <span style="display:block;width:48px;height:48px;background:#991b1b;border-radius:14px;transform:rotate(45deg)"></span>
        <small style="display:block;margin-top:12px">خمري</small>
      </label>

      <label style="cursor:pointer;text-align:center">
        <input type="radio" name="cvColor" value="orange" style="display:none">
        <span style="display:block;width:48px;height:48px;background:#ea580c;border-radius:14px;transform:rotate(45deg)"></span>
        <small style="display:block;margin-top:12px">برتقالي</small>
      </label>

      <label style="cursor:pointer;text-align:center">
        <input type="radio" name="cvColor" value="brown" style="display:none">
        <span style="display:block;width:48px;height:48px;background:#78350f;border-radius:14px;transform:rotate(45deg)"></span>
        <small style="display:block;margin-top:12px">بني</small>
      </label>

      <label style="cursor:pointer;text-align:center">
        <input type="radio" name="cvColor" value="gray" style="display:none">
        <span style="display:block;width:48px;height:48px;background:#475569;border-radius:14px;transform:rotate(45deg)"></span>
        <small style="display:block;margin-top:12px">رمادي</small>
      </label>

      <label style="cursor:pointer;text-align:center">
        <input type="radio" name="cvColor" value="black" style="display:none">
        <span style="display:block;width:48px;height:48px;background:#111827;border-radius:14px;transform:rotate(45deg)"></span>
        <small style="display:block;margin-top:12px">أسود</small>
      </label>

    </div>
  </div>


  <!-- المعلومات الشخصية -->
  <div style="margin-bottom:32px">

    <h3 style="
      font-size:19px;
      font-weight:800;
      margin-bottom:18px;
      padding-bottom:10px;
      border-bottom:2px solid var(--border);
    ">
      المعلومات الشخصية
    </h3>

    <div style="
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:18px;
    ">

      <div>
        <label>الاسم الكامل</label>
        <input type="text" name="fullName"
          placeholder="مثال: أحمد محمد"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

      <div>
        <label>المسمى الوظيفي</label>
        <input type="text" name="jobTitle"
          placeholder="مثال: مصمم جرافيك"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

      <div>
        <label>الدولة</label>
        <input type="text" name="country"
          placeholder="مثال: الأردن"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

      <div>
        <label>المدينة</label>
        <input type="text" name="city"
          placeholder="مثال: عمّان"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

      <div>
        <label>رقم الهاتف</label>
        <input type="tel" name="phone"
          placeholder="0790000000"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

      <div>
        <label>البريد الإلكتروني</label>
        <input type="email" name="email"
          placeholder="example@email.com"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

      <div>
        <label>LinkedIn</label>
        <input type="text" name="linkedin"
          placeholder="رابط LinkedIn - اختياري"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

      <div>
        <label>الموقع الشخصي</label>
        <input type="text" name="website"
          placeholder="رابط الموقع - اختياري"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

    </div>
  </div>


  <!-- الملخص -->
  <div style="margin-bottom:32px">

    <h3 style="
      font-size:19px;
      font-weight:800;
      margin-bottom:18px;
      padding-bottom:10px;
      border-bottom:2px solid var(--border);
    ">
      الملخص المهني
    </h3>

    <textarea
      name="summary"
      rows="6"
      placeholder="اكتب نبذة احترافية عن خبرتك ومهاراتك..."
      style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;resize:vertical;font-family:inherit;line-height:1.8"
    ></textarea>

  </div>


  <!-- الخبرات -->
  <div style="margin-bottom:32px">

    <h3 style="
      font-size:19px;
      font-weight:800;
      margin-bottom:18px;
      padding-bottom:10px;
      border-bottom:2px solid var(--border);
    ">
      الخبرات المهنية
    </h3>

    <div style="
      background:#f8fafc;
      border:1px solid var(--border);
      border-radius:12px;
      padding:20px;
    ">

      <div style="
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:18px;
      ">

        <div>
          <label>المسمى الوظيفي</label>
          <input type="text" name="experienceTitle"
            placeholder="مثال: مصمم جرافيك"
            style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
        </div>

        <div>
          <label>اسم الشركة</label>
          <input type="text" name="company"
            placeholder="اسم الشركة"
            style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
        </div>

        <div>
          <label>تاريخ البداية</label>
          <input type="month" name="experienceStart"
            style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
        </div>

        <div>
          <label>تاريخ النهاية</label>
          <input type="month" name="experienceEnd"
            style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
        </div>

      </div>

      <div style="margin-top:18px">

        <label>وصف الخبرة والإنجازات</label>

        <textarea
          name="experienceDescription"
          rows="5"
          placeholder="اكتب أهم المسؤوليات والإنجازات..."
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;resize:vertical;font-family:inherit;line-height:1.8;margin-top:6px"
        ></textarea>

      </div>

    </div>
  </div>


  <!-- التعليم -->
  <div style="margin-bottom:32px">

    <h3 style="
      font-size:19px;
      font-weight:800;
      margin-bottom:18px;
      padding-bottom:10px;
      border-bottom:2px solid var(--border);
    ">
      التعليم
    </h3>

    <div style="
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:18px;
    ">

      <div>
        <label>الدرجة العلمية</label>
        <input type="text" name="degree"
          placeholder="بكالوريوس"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

      <div>
        <label>التخصص</label>
        <input type="text" name="specialization"
          placeholder="إدارة الأعمال"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

      <div>
        <label>الجامعة أو المؤسسة</label>
        <input type="text" name="university"
          placeholder="اسم الجامعة"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

      <div>
        <label>سنة التخرج</label>
        <input type="number" name="graduationYear"
          placeholder="2026"
          style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;margin-top:6px">
      </div>

    </div>
  </div>


  <!-- المهارات -->
  <div style="margin-bottom:32px">

    <h3 style="
      font-size:19px;
      font-weight:800;
      margin-bottom:18px;
      padding-bottom:10px;
      border-bottom:2px solid var(--border);
    ">
      المهارات
    </h3>

    <input
      type="text"
      name="skills"
      placeholder="Photoshop، التصميم، التواصل، إدارة الوقت..."
      style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px"
    >

    <p style="font-size:12px;color:var(--muted);margin-top:6px">
      افصل بين المهارات باستخدام الفاصلة.
    </p>

  </div>


  <!-- الدورات -->
  <div style="margin-bottom:32px">

    <h3 style="
      font-size:19px;
      font-weight:800;
      margin-bottom:18px;
      padding-bottom:10px;
      border-bottom:2px solid var(--border);
    ">
      الدورات والشهادات
    </h3>

    <textarea
      name="certificates"
      rows="4"
      placeholder="اكتب الدورات والشهادات..."
      style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;resize:vertical;font-family:inherit;line-height:1.8"
    ></textarea>

  </div>


  <!-- اللغات -->
  <div style="margin-bottom:32px">

    <h3 style="
      font-size:19px;
      font-weight:800;
      margin-bottom:18px;
      padding-bottom:10px;
      border-bottom:2px solid var(--border);
    ">
      اللغات
    </h3>

    <textarea
      name="languages"
      rows="3"
      placeholder="العربية - اللغة الأم&#10;الإنجليزية - جيد جدًا"
      style="width:100%;padding:12px;border:1px solid var(--border);border-radius:10px;resize:vertical;font-family:inherit;line-height:1.8"
    ></textarea>

  </div>


  <div style="
    text-align:center;
    margin-top:30px;
    display:flex;
    justify-content:center;
    gap:12px;
    flex-wrap:wrap;
  ">

    <button
      type="submit"
      class="btn-primary"
      style="border:none;cursor:pointer;font-family:inherit"
    >
      <i class="fas fa-eye"></i>
      معاينة السيرة الذاتية
    </button>

    <button
      type="submit"
      formaction="/cv-builder/creative/pdf"
      formmethod="POST"
      class="btn-primary"
      style="
        border:none;
        cursor:pointer;
        font-family:inherit;
        background:#10b981;
      "
    >
      <i class="fas fa-file-pdf"></i>
      تحميل PDF
    </button>

  </div>

</form>
`;

res.send(layout('إنشاء السيرة الذاتية - القالب الإبداعي', body));

});

/* =========================
CV CREATIVE - PREVIEW
========================= */
app.post('/cv-builder/creative/preview', express.urlencoded({ extended: true }), (req, res) => {

const data = req.body;

const colors = {
  navy:    { primary:'#15203a', accent:'#3b82f6', light:'#eff6ff', border:'#bfdbfe', text:'#1d4ed8' },
  blue:    { primary:'#1e3a8a', accent:'#2563eb', light:'#eff6ff', border:'#bfdbfe', text:'#1d4ed8' },
  green:   { primary:'#064e3b', accent:'#059669', light:'#ecfdf5', border:'#a7f3d0', text:'#047857' },
  teal:    { primary:'#134e4a', accent:'#0f766e', light:'#f0fdfa', border:'#99f6e4', text:'#0f766e' },
  purple:  { primary:'#3b0764', accent:'#7c3aed', light:'#f5f3ff', border:'#ddd6fe', text:'#6d28d9' },
  burgundy:{ primary:'#450a0a', accent:'#991b1b', light:'#fef2f2', border:'#fecaca', text:'#b91c1c' },
  orange:  { primary:'#431407', accent:'#ea580c', light:'#fff7ed', border:'#fed7aa', text:'#c2410c' },
  brown:   { primary:'#451a03', accent:'#78350f', light:'#fffbeb', border:'#fde68a', text:'#92400e' },
  gray:    { primary:'#1e293b', accent:'#475569', light:'#f1f5f9', border:'#cbd5e1', text:'#334155' },
  black:   { primary:'#111827', accent:'#000000', light:'#f3f4f6', border:'#d1d5db', text:'#111827' }
};

const theme = colors[data.cvColor] || colors.navy;

const skills = data.skills
? data.skills.split(',').map(skill => `
  <span style="
    background:${theme.light};
    color:${theme.text};
    padding:6px 12px;
    border-radius:20px;
    font-size:10px;
    font-weight:700;
    display:inline-block;
    border:1px solid ${theme.border};
  ">
    ${skill.trim()}
  </span>
`).join('')
: '';

const body = `

<div style="
  max-width:794px;
  min-height:1123px;
  margin:0 auto;
  background:#fff;
  box-shadow:0 12px 40px rgba(15,23,42,.15);
  direction:rtl;
  font-family:'Cairo',Arial,sans-serif;
  overflow:hidden;
">

  <!-- HEADER -->

  <header style="
    position:relative;
    background:${theme.primary};
    color:#fff;
    padding:38px 42px 34px;
    overflow:hidden;
  ">

    <div style="
      position:absolute;
      width:190px;
      height:190px;
      border-radius:50%;
      background:${theme.accent};
      opacity:.18;
      left:-60px;
      top:-90px;
    "></div>

    <div style="
      position:absolute;
      width:110px;
      height:110px;
      border-radius:50%;
      border:22px solid ${theme.accent};
      opacity:.15;
      right:35px;
      top:-55px;
    "></div>

    <div style="
      position:relative;
      display:flex;
      align-items:center;
      gap:22px;
    ">

      <div style="
        width:88px;
        height:88px;
        border-radius:24px;
        background:${theme.accent};
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:34px;
        font-weight:800;
        flex-shrink:0;
        transform:rotate(-5deg);
      ">
        ${(data.fullName || 'ا').trim().charAt(0)}
      </div>

      <div>

        <h1 style="
          margin:0;
          font-size:27px;
          font-weight:800;
          line-height:1.4;
          color:#fff;
        ">
          ${data.fullName || 'الاسم الكامل'}
        </h1>

        <div style="
          margin-top:5px;
          font-size:13px;
          font-weight:700;
          color:${theme.light};
        ">
          ${data.jobTitle || 'المسمى الوظيفي'}
        </div>

      </div>

    </div>

    <div style="
      position:relative;
      display:flex;
      flex-wrap:wrap;
      gap:8px 18px;
      margin-top:25px;
      font-size:10px;
      color:#f8fafc;
    ">

      ${data.country || data.city ? `
      <span>📍 ${data.country || ''}${data.city ? ' - ' + data.city : ''}</span>
      ` : ''}

      ${data.phone ? `<span>☎ ${data.phone}</span>` : ''}

      ${data.email ? `<span>${data.email}</span>` : ''}

      ${data.linkedin ? `<span>LinkedIn: ${data.linkedin}</span>` : ''}

      ${data.website ? `<span>${data.website}</span>` : ''}

    </div>

  </header>


  <!-- BODY -->

  <div style="
    display:grid;
    grid-template-columns:1fr 260px;
    gap:0;
  ">


    <!-- MAIN -->

    <main style="
      padding:35px 38px;
      color:#1e293b;
    ">

      ${data.summary ? `
      <section style="margin-bottom:28px">

        <div style="
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:12px;
        ">

          <span style="
            width:34px;
            height:8px;
            background:${theme.accent};
            border-radius:20px;
          "></span>

          <h2 style="
            margin:0;
            font-size:17px;
            color:${theme.primary};
            font-weight:800;
          ">
            نبذة مهنية
          </h2>

        </div>

        <p style="
          margin:0;
          font-size:11px;
          line-height:2;
          color:#475569;
          white-space:pre-line;
        ">
          ${data.summary}
        </p>

      </section>
      ` : ''}


      ${(data.experienceTitle || data.company) ? `
      <section style="margin-bottom:28px">

        <div style="
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:14px;
        ">

          <span style="
            width:34px;
            height:8px;
            background:${theme.accent};
            border-radius:20px;
          "></span>

          <h2 style="
            margin:0;
            font-size:17px;
            color:${theme.primary};
            font-weight:800;
          ">
            الخبرة المهنية
          </h2>

        </div>

        <div style="
          position:relative;
          padding-right:18px;
          border-right:3px solid ${theme.light};
        ">

          <h3 style="
            margin:0;
            font-size:13px;
            font-weight:800;
          ">
            ${data.experienceTitle || ''}
          </h3>

          ${data.company ? `
          <div style="
            margin-top:4px;
            color:${theme.accent};
            font-size:11px;
            font-weight:700;
          ">
            ${data.company}
          </div>
          ` : ''}

          ${(data.experienceStart || data.experienceEnd) ? `
          <div style="
            margin-top:4px;
            color:#94a3b8;
            font-size:9px;
          ">
            ${data.experienceStart || ''}
            ${data.experienceEnd ? ' - ' + data.experienceEnd : ' - حتى الآن'}
          </div>
          ` : ''}

          ${data.experienceDescription ? `
          <p style="
            margin:9px 0 0;
            font-size:10.5px;
            line-height:1.9;
            color:#475569;
            white-space:pre-line;
          ">
            ${data.experienceDescription}
          </p>
          ` : ''}

        </div>

      </section>
      ` : ''}


      ${(data.degree || data.specialization || data.university) ? `
      <section style="margin-bottom:28px">

        <div style="
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:14px;
        ">

          <span style="
            width:34px;
            height:8px;
            background:${theme.accent};
            border-radius:20px;
          "></span>

          <h2 style="
            margin:0;
            font-size:17px;
            color:${theme.primary};
            font-weight:800;
          ">
            التعليم
          </h2>

        </div>

        <div style="
          padding-right:18px;
          border-right:3px solid ${theme.light};
        ">

          ${data.degree ? `
          <div style="font-size:13px;font-weight:800">
            ${data.degree}
          </div>
          ` : ''}

          ${data.specialization ? `
          <div style="
            color:${theme.accent};
            font-size:11px;
            font-weight:700;
            margin-top:4px;
          ">
            ${data.specialization}
          </div>
          ` : ''}

          ${data.university ? `
          <div style="
            font-size:10.5px;
            color:#475569;
            margin-top:4px;
          ">
            ${data.university}
          </div>
          ` : ''}

          ${data.graduationYear ? `
          <div style="
            font-size:9px;
            color:#94a3b8;
            margin-top:4px;
          ">
            سنة التخرج: ${data.graduationYear}
          </div>
          ` : ''}

        </div>

      </section>
      ` : ''}

    </main>


    <!-- SIDE -->

    <aside style="
      background:${theme.light};
      padding:35px 24px;
      border-right:1px solid ${theme.border};
    ">

      ${data.skills ? `
      <section style="margin-bottom:30px">

        <h2 style="
          margin:0 0 14px;
          font-size:15px;
          font-weight:800;
          color:${theme.primary};
        ">
          المهارات
        </h2>

        <div style="
          display:flex;
          flex-wrap:wrap;
          gap:7px;
        ">
          ${skills}
        </div>

      </section>
      ` : ''}


      ${data.languages ? `
      <section style="margin-bottom:30px">

        <h2 style="
          margin:0 0 14px;
          font-size:15px;
          font-weight:800;
          color:${theme.primary};
        ">
          اللغات
        </h2>

        <div style="
          font-size:10.5px;
          line-height:2;
          color:#475569;
          white-space:pre-line;
        ">
          ${data.languages}
        </div>

      </section>
      ` : ''}


      ${data.certificates ? `
      <section>

        <h2 style="
          margin:0 0 14px;
          font-size:15px;
          font-weight:800;
          color:${theme.primary};
        ">
          الدورات والشهادات
        </h2>

        <div style="
          font-size:10px;
          line-height:1.9;
          color:#475569;
          white-space:pre-line;
        ">
          ${data.certificates}
        </div>

      </section>
      ` : ''}

    </aside>

  </div>

</div>


<div style="
  max-width:794px;
  margin:25px auto 0;
  text-align:center;
">

  <a
    href="/cv-builder/creative"
    class="btn-primary"
    style="margin-left:8px"
  >
    تعديل البيانات
  </a>

</div>
`;

res.send(layout('معاينة السيرة الذاتية - القالب الإبداعي', body));

});

/* =========================
CV CREATIVE - PDF
========================= */
app.post('/cv-builder/creative/pdf', express.urlencoded({ extended: true }), async (req, res) => {

try {

const data = req.body;

const colors = {
  navy:    { primary:'#15203a', accent:'#3b82f6', light:'#eff6ff', border:'#bfdbfe', text:'#1d4ed8' },
  blue:    { primary:'#1e3a8a', accent:'#2563eb', light:'#eff6ff', border:'#bfdbfe', text:'#1d4ed8' },
  green:   { primary:'#064e3b', accent:'#059669', light:'#ecfdf5', border:'#a7f3d0', text:'#047857' },
  teal:    { primary:'#134e4a', accent:'#0f766e', light:'#f0fdfa', border:'#99f6e4', text:'#0f766e' },
  purple:  { primary:'#3b0764', accent:'#7c3aed', light:'#f5f3ff', border:'#ddd6fe', text:'#6d28d9' },
  burgundy:{ primary:'#450a0a', accent:'#991b1b', light:'#fef2f2', border:'#fecaca', text:'#b91c1c' },
  orange:  { primary:'#431407', accent:'#ea580c', light:'#fff7ed', border:'#fed7aa', text:'#c2410c' },
  brown:   { primary:'#451a03', accent:'#78350f', light:'#fffbeb', border:'#fde68a', text:'#92400e' },
  gray:    { primary:'#1e293b', accent:'#475569', light:'#f1f5f9', border:'#cbd5e1', text:'#334155' },
  black:   { primary:'#111827', accent:'#000000', light:'#f3f4f6', border:'#d1d5db', text:'#111827' }
};

const theme = colors[data.cvColor] || colors.navy;


/* نفس إعداد Puppeteer الناجح */

const executablePath = await puppeteer.executablePath();

console.log('===== CREATIVE PDF TEST =====');
console.log('PUPPETEER EXECUTABLE:', executablePath);

const browser = await puppeteer.launch({
  headless: true,
  executablePath: executablePath,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ]
});

const page = await browser.newPage();

await page.setContent(`
<!DOCTYPE html>

<html lang="ar" dir="rtl">

<head>

<meta charset="UTF-8">

<style>

@page {
  size:A4;
  margin:0;
}

* {
  box-sizing:border-box;
}

html,
body {
  margin:0;
  padding:0;
  width:210mm;
  min-height:297mm;
  background:#fff;
}

body {
  font-family:Arial,sans-serif;
  direction:rtl;
  color:#1e293b;
}

.cv {
  width:210mm;
  min-height:297mm;
  background:#fff;
  direction:rtl;
}

.header {
  height:65mm;
  background:${theme.primary};
  color:#fff;
  padding:10mm 12mm 8mm;
  position:relative;
  overflow:hidden;
}

.circle-one {
  position:absolute;
  width:65mm;
  height:65mm;
  border-radius:50%;
  background:${theme.accent};
  opacity:.15;
  left:-20mm;
  top:-30mm;
}

.circle-two {
  position:absolute;
  width:35mm;
  height:35mm;
  border-radius:50%;
  border:7mm solid ${theme.accent};
  opacity:.15;
  right:15mm;
  top:-15mm;
}

.header-content {
  position:relative;
}

.identity {
  display:flex;
  align-items:center;
  gap:7mm;
}

.avatar {
  width:27mm;
  height:27mm;
  border-radius:7mm;
  background:${theme.accent};
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:23px;
  font-weight:bold;
  color:#fff;
  transform:rotate(-5deg);
  flex-shrink:0;
}

.name {
  font-size:21px;
  font-weight:bold;
  line-height:1.5;
  color:#fff;
}

.job-title {
  margin-top:1mm;
  font-size:9.5px;
  font-weight:bold;
  color:${theme.light};
}

.contact {
  margin-top:7mm;
  display:flex;
  flex-wrap:wrap;
  gap:2mm 6mm;
  font-size:7.5px;
  color:#f8fafc;
}

.body {
  display:flex;
  flex-direction:row;
  min-height:232mm;
}

.main {
  width:148mm;
  padding:10mm 11mm;
  background:#fff;
}

.side {
  width:62mm;
  padding:10mm 7mm;
  background:${theme.light};
  border-right:.3mm solid ${theme.border};
}

.section {
  margin-bottom:7mm;
}

.section-head {
  display:flex;
  align-items:center;
  gap:3mm;
  margin-bottom:3mm;
}

.section-mark {
  width:11mm;
  height:2.5mm;
  background:${theme.accent};
  border-radius:3mm;
}

.section-title {
  font-size:12px;
  font-weight:bold;
  color:${theme.primary};
}

.text {
  font-size:8.5px;
  line-height:1.9;
  color:#475569;
  white-space:pre-line;
}

.item {
  padding-right:4mm;
  border-right:1.2mm solid ${theme.light};
}

.item-title {
  font-size:10px;
  font-weight:bold;
}

.company {
  color:${theme.accent};
  font-size:8.5px;
  font-weight:bold;
  margin-top:1mm;
}

.date {
  color:#94a3b8;
  font-size:7px;
  margin-top:1mm;
}

.side-title {
  font-size:10px;
  font-weight:bold;
  color:${theme.primary};
  margin-bottom:3mm;
}

.side-text {
  font-size:7.8px;
  line-height:1.9;
  color:#475569;
  white-space:pre-line;
  word-break:break-word;
}

.skills {
  display:flex;
  flex-wrap:wrap;
  gap:2mm;
}

.skill {
  background:#fff;
  border:0.3mm solid ${theme.border};
  color:${theme.text};
  padding:1.5mm 2.5mm;
  border-radius:5mm;
  font-size:7px;
  font-weight:bold;
}

</style>

</head>

<body>

<div class="cv">

  <header class="header">

    <div class="circle-one"></div>
    <div class="circle-two"></div>

    <div class="header-content">

      <div class="identity">

        <div class="avatar">
          ${(data.fullName || 'ا').trim().charAt(0)}
        </div>

        <div>

          <div class="name">
            ${data.fullName || 'الاسم الكامل'}
          </div>

          <div class="job-title">
            ${data.jobTitle || 'المسمى الوظيفي'}
          </div>

        </div>

      </div>


      <div class="contact">

        ${data.country || data.city ? `
        <span>📍 ${data.country || ''}${data.city ? ' - ' + data.city : ''}</span>
        ` : ''}

        ${data.phone ? `<span>☎ ${data.phone}</span>` : ''}

        ${data.email ? `<span>${data.email}</span>` : ''}

        ${data.linkedin ? `<span>LinkedIn: ${data.linkedin}</span>` : ''}

        ${data.website ? `<span>${data.website}</span>` : ''}

      </div>

    </div>

  </header>


  <div class="body">

    <main class="main">

      ${data.summary ? `
      <section class="section">

        <div class="section-head">
          <div class="section-mark"></div>
          <div class="section-title">نبذة مهنية</div>
        </div>

        <div class="text">
          ${data.summary}
        </div>

      </section>
      ` : ''}


      ${(data.experienceTitle || data.company) ? `
      <section class="section">

        <div class="section-head">
          <div class="section-mark"></div>
          <div class="section-title">الخبرة المهنية</div>
        </div>

        <div class="item">

          <div class="item-title">
            ${data.experienceTitle || ''}
          </div>

          ${data.company ? `
          <div class="company">
            ${data.company}
          </div>
          ` : ''}

          ${(data.experienceStart || data.experienceEnd) ? `
          <div class="date">
            ${data.experienceStart || ''}
            ${data.experienceEnd ? ' - ' + data.experienceEnd : ' - حتى الآن'}
          </div>
          ` : ''}

          ${data.experienceDescription ? `
          <div class="text" style="margin-top:2mm">
            ${data.experienceDescription}
          </div>
          ` : ''}

        </div>

      </section>
      ` : ''}


      ${(data.degree || data.specialization || data.university) ? `
      <section class="section">

        <div class="section-head">
          <div class="section-mark"></div>
          <div class="section-title">التعليم</div>
        </div>

        <div class="item">

          ${data.degree ? `
          <div class="item-title">
            ${data.degree}
          </div>
          ` : ''}

          ${data.specialization ? `
          <div class="company">
            ${data.specialization}
          </div>
          ` : ''}

          ${data.university ? `
          <div class="text">
            ${data.university}
          </div>
          ` : ''}

          ${data.graduationYear ? `
          <div class="date">
            سنة التخرج: ${data.graduationYear}
          </div>
          ` : ''}

        </div>

      </section>
      ` : ''}

    </main>


    <aside class="side">

      ${data.skills ? `
      <section class="section">

        <div class="side-title">
          المهارات
        </div>

        <div class="skills">

          ${data.skills.split(',').map(skill => `
          <span class="skill">
            ${skill.trim()}
          </span>
          `).join('')}

        </div>

      </section>
      ` : ''}


      ${data.languages ? `
      <section class="section">

        <div class="side-title">
          اللغات
        </div>

        <div class="side-text">
          ${data.languages}
        </div>

      </section>
      ` : ''}


      ${data.certificates ? `
      <section class="section">

        <div class="side-title">
          الدورات والشهادات
        </div>

        <div class="side-text">
          ${data.certificates}
        </div>

      </section>
      ` : ''}

    </aside>

  </div>

</div>

</body>

</html>
`, {
  waitUntil:'networkidle0'
});

const pdf = await page.pdf({
  format:'A4',
  printBackground:true,
  margin:{
    top:'0',
    right:'0',
    bottom:'0',
    left:'0'
  }
});

await browser.close();

res.set({
  'Content-Type':'application/pdf',
  'Content-Disposition':'attachment; filename="creative-cv.pdf"',
  'Content-Length':pdf.length
});

res.send(pdf);

} catch(error) {

console.error('CREATIVE PDF ERROR:', error);

res.status(500).send('حدث خطأ أثناء إنشاء ملف PDF');

}

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

  const perPage = 10;
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
    <p>${job.description || ''}</p>

${job.location ? `<p><strong>الموقع:</strong> ${job.location}</p>` : ''}

${job.type ? `<p><strong>نوع الوظيفة:</strong> ${job.type}</p>` : ''}

${job.requirements ? `
  <div style="margin-top:12px">
    <strong>المتطلبات:</strong>
    <p style="margin-top:6px">${job.requirements}</p>
  </div>
` : ''}

${job.responsibilities ? `
  <div style="margin-top:12px">
    <strong>المهام:</strong>
    <p style="margin-top:6px">${job.responsibilities}</p>
  </div>
` : ''}
 ${job.content ? `
    <div style="margin-top:20px;line-height:2;font-size:16px;color:#334155;white-space:pre-line">
      ${job.content}
    </div>
  ` : ''}
      ${job.email ? `<p style="margin-top:14px"><strong>البريد:</strong> ${job.email}</p>` : ''}
      <div style="margin-top:8px">${applyBtn}</div>
    </div>
    <div class="center"><a href="/jobs/${sector}/page/1" class="btn-primary" style="background:#fff;color:var(--text);border:1px solid var(--border)">← العودة للقائمة</a></div>
  </div>`;

  res.send(layout(`${job.title} - وظائف الوطن العربي`, body));
});
app.get('/terms', (req, res) => {
  const body = `
  <div class="page-container">
    <div class="post">
      <h2>شروط الاستخدام</h2>

      <p>
        باستخدامك لموقع "وظائف الوطن العربي"، فإنك توافق على الالتزام بالشروط والأحكام التالية.
      </p>

      <p>
        يهدف هذا الموقع إلى توفير فرص وظيفية ومحتوى متعلق بسوق العمل في الوطن العربي.
      </p>

      <p>
        نحن لا نضمن دقة كل الوظائف بنسبة 100% وننصح المستخدمين بالتأكد من المصدر.
      </p>

      <p>
        يلتزم المستخدم بعدم استخدام الموقع لأي أغراض غير قانونية.
      </p>

      <p>
        يحق لإدارة الموقع تعديل أو حذف أي محتوى في أي وقت.
      </p>
    </div>
  </div>
  `;

  res.send(layout('شروط الاستخدام', body));
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
/* =========================
SITEMAP
========================= */

app.get('/sitemap.xml', (req, res) => {

  const baseUrl = "https://jobs-site-0hcz.onrender.com";

  let urls = [
    `${baseUrl}/`,
    `${baseUrl}/about`,
    `${baseUrl}/contact`,
    `${baseUrl}/articles`,
    `${baseUrl}/stories`,
    `${baseUrl}/privacy`,
    `${baseUrl}/terms`
  ];

  // =========================
  // JOB DETAILS
  // =========================

  const jobs = getAllJobs();

  jobs.forEach(job => {
    urls.push(
      `${baseUrl}/jobs/${job.sector}/job/${job.id}`
    );
  });


  // =========================
  // JOB SECTORS + PAGINATION
  // =========================

  const sectors = [
    'health',
    'engineering',
    'education',
    'management'
  ];

  const JOBS_PER_PAGE = 10;

  sectors.forEach(sector => {

    const sectorJobs = getJobs(sector);

    const totalPages = Math.max(
      1,
      Math.ceil(sectorJobs.length / JOBS_PER_PAGE)
    );

    // الصفحة الأولى
    urls.push(
      `${baseUrl}/jobs/${sector}/page/1`
    );

    // باقي الصفحات
    for (let page = 2; page <= totalPages; page++) {

      urls.push(
        `${baseUrl}/jobs/${sector}/page/${page}`
      );

    }

  });


  // =========================
  // ARTICLES
  // =========================

  const articles = getArticles();

  articles.forEach(article => {

    urls.push(
      `${baseUrl}/articles/${article.id}`
    );

  });


  // =========================
  // STORIES
  // =========================

  const stories = getStories();

  stories.forEach(story => {

    urls.push(
      `${baseUrl}/stories/${story.id}`
    );

  });


  // =========================
  // CREATE XML
  // =========================

  let xml = `<?xml version="1.0" encoding="UTF-8"?>`;

  xml += `
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  urls.forEach(url => {

    xml += `
  <url>
    <loc>${url}</loc>
  </url>
`;

  });

  xml += `
</urlset>
`;


  res.header('Content-Type', 'application/xml');

  res.send(xml);

});


/* =========================
ROBOTS
========================= */

app.get('/robots.txt', (req, res) => {

  res.type('text/plain');

  res.send(`
User-agent: *
Allow: /

Sitemap: https://jobs-site-0hcz.onrender.com/sitemap.xml
`);

});


/* ========================= */

app.listen(PORT, () => {

  console.log(`Server running on http://localhost:${PORT}`);

});