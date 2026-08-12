const express = require('express');
const fs = require('fs');
const puppeteer = require('puppeteer');
const app = express();

const PORT = 3000;

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
            height:280px;
            background:#f8fafc;
            border:1px solid var(--border);
            border-radius:14px;
            display:flex;
            align-items:center;
            justify-content:center;
            margin-bottom:18px;
            font-size:22px;
            font-weight:800;
            color:var(--navy);
          ">
            معاينة القالب
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
        background:#15203a;
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
          background:#3b82f6;
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
          color:#93c5fd;
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
              color:#2563eb;
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
            border-right:2px solid #bfdbfe;
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
                  background:#eff6ff;
                  border:1px solid #dbeafe;
                  color:#1d4ed8;
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

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
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
            background: #15203a;
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
            background: #3b82f6;
          }

          h1 {
            margin: 0;
            font-size: 28px;
          }

          .job-title {
            margin-top: 5px;
            color: #93c5fd;
            font-size: 15px;
            font-weight: bold;
          }

          .contact {
            margin-top: 12px;
            font-size: 9px;
            color: #dbeafe;
            line-height: 2;
          }

          .section {
            margin-top: 18px;
          }

          .section-title {
            font-size: 15px;
            font-weight: bold;
            color: #15203a;
            border-right: 3px solid #3b82f6;
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
            border-right: 2px solid #bfdbfe;
            padding-right: 10px;
          }

          .item-title {
            font-size: 12px;
            font-weight: bold;
          }

          .company {
            color: #2563eb;
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
            background: #eff6ff;
            border: 1px solid #dbeafe;
            color: #1d4ed8;
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

app.get('/sitemap.xml', (req,res)=>{

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

  const jobs = getAllJobs();

  jobs.forEach(job=>{
    urls.push(
      `${baseUrl}/jobs/${job.sector}/job/${job.id}`
    );
  });


  const articles = getArticles();

  articles.forEach(article=>{
    urls.push(
      `${baseUrl}/articles/${article.id}`
    );
  });


  const stories = getStories();

  stories.forEach(story=>{
    urls.push(
      `${baseUrl}/stories/${story.id}`
    );
  });


  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  urls.forEach(url=>{
    xml += `
<url>
<loc>${url}</loc>
</url>`;
  });


  xml += `
</urlset>`;


  res.header('Content-Type','application/xml');
  res.send(xml);

});


/* =========================
   ROBOTS
========================= */

app.get('/robots.txt',(req,res)=>{

res.type('text/plain');

res.send(`
User-agent: *
Allow: /

Sitemap: https://jobs-site-0hcz.onrender.com/sitemap.xml
`);

});

/* ========================= */
app.listen(PORT,()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});

