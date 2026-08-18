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
  const featuredArticle = articles[0] || {title:'كيف تكتب سيرة ذاتية احترافية تجذب أصحاب العمل', date:'12 مايو 2026'};
  const featuredStory   = stories[0]   || {title:'رحلة نجاح: من الصفر إلى القمة', date:'11 مايو 2026'};
  const restArticles = articles.slice(1,3);
  const restStories  = stories.slice(1,3);

  const articleItems = restArticles.length ? restArticles.map(a=>`
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">${a.title}</div><div class="d">${a.date||''}</div></div></div>
  `).join('') : `
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">أهم المهارات المطلوبة في سوق العمل 2026</div><div class="d">10 مايو 2026</div></div></div>
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">أخطاء شائعة في مقابلات العمل وكيف تجنبها</div><div class="d">8 مايو 2026</div></div></div>
  `;

  const storyItems = restStories.length ? restStories.map(s=>`
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">${s.title}</div><div class="d">${s.date||''}</div></div></div>
  `).join('') : `
    <div class="cc-item"><i class="far fa-calendar"></i><div><div class="t">قصة شاب بدأ من لا شيء وأصبح رائد أعمال ناجح</div><div class="d">9 مايو 2026</div></div></div>
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
<a href="/free-courses" class="content-card" style="text-decoration:none;color:inherit;transition:.3s">

  <img
    class="cc-thumb"
    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"
    alt="أهم الدورات المجانية لتطوير المهارات والتوظيف"
    loading="lazy"
  >

  <div style="padding:18px">

    <div style="
      font-size:42px;
      margin-bottom:10px;
      text-align:center;
    ">
      🎓
    </div>

    <h3 style="
      font-size:20px;
      font-weight:900;
      margin-bottom:10px;
      text-align:center;
    ">
      أهم الدورات المجانية لتطوير المهارات والتوظيف
    </h3>

    <p style="
      font-size:15px;
      line-height:1.9;
      color:#555;
      text-align:center;
      margin-bottom:15px;
    ">
      اكتشف دورات مجانية تساعدك على تطوير مهاراتك، تقوية سيرتك الذاتية،
      والاستعداد بشكل أفضل لسوق العمل وزيادة فرصك في الحصول على وظيفة.
    </p>

    <div style="text-align:center">
      <span class="sector-btn">
        اكتشف الدورات المجانية
      </span>
    </div>

  </div>

</a>
<a href="/paid-courses" class="content-card" style="text-decoration:none;color:inherit;transition:.3s">

  <img
    class="cc-thumb"
    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80"
    alt="أهم الدورات المدفوعة لتطوير المهارات والدخول لسوق العمل"
    loading="lazy"
  >

  <div style="padding:18px">

    <div style="
      font-size:42px;
      margin-bottom:10px;
      text-align:center;
    ">
      💼
    </div>

    <h3 style="
      font-size:20px;
      font-weight:900;
      margin-bottom:10px;
      text-align:center;
    ">
      أهم الدورات المدفوعة لتطوير المهارات والدخول لسوق العمل
    </h3>

    <p style="
      font-size:15px;
      line-height:1.9;
      color:#555;
      text-align:center;
      margin-bottom:15px;
    ">
      مجموعة مختارة من الدورات المدفوعة التي تساعدك على تطوير
      مهاراتك المهنية والتخصصية والاستعداد بشكل أفضل لسوق العمل.
    </p>

    <div style="text-align:center">
      <span class="sector-btn">
        اكتشف الدورات المدفوعة
      </span>
    </div>

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
  formtarget="_blank"
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

<!-- وصف القالب -->
<div style="
  max-width:900px;
  margin:50px auto;
  padding:30px;
  background:#ffffff;
  border:1px solid var(--border);
  border-radius:16px;
  line-height:2;
  color:#334155;
">

  <h2 style="
    font-size:24px;
    font-weight:800;
    margin-bottom:20px;
  ">
    قالب السيرة الذاتية الاحترافي Professional
  </h2>

  <div style="
    font-size:15px;
  ">

<h2 style="
  font-size:24px;
  font-weight:800;
  margin-bottom:20px;
">
  قالب السيرة الذاتية الاحترافي Professional
</h2>

<p>
  يُعد قالب السيرة الذاتية الاحترافي Professional خيارًا مناسبًا للباحثين عن عمل الذين يرغبون في تقديم خبراتهم ومؤهلاتهم بطريقة منظمة وواضحة تساعد مسؤول التوظيف على الوصول إلى أهم المعلومات بسهولة. تم تصميم هذا القالب ليجمع بين المظهر الرسمي والبساطة في عرض البيانات، مع تقسيم السيرة الذاتية إلى أقسام واضحة تشمل المعلومات الشخصية، والملخص المهني، والخبرات العملية، والتعليم، والمهارات، والدورات والشهادات، واللغات. ويتيح لك القالب إدخال بياناتك ثم معاينة السيرة الذاتية قبل تحميلها بصيغة PDF، مما يجعل عملية إنشاء السيرة الذاتية أكثر سهولة ووضوحًا.
</p>

<h3 style="
  font-size:20px;
  font-weight:800;
  margin-top:30px;
  margin-bottom:12px;
">
  ما الذي يميز قالب Professional؟
</h3>

<p>
  يتميز قالب Professional بتصميم رسمي ومنظم يناسب مجموعة واسعة من المجالات المهنية. فبدل الاعتماد على عناصر تصميمية كثيرة قد تشتت الانتباه عن المعلومات المهمة، يركز القالب على ترتيب المحتوى وإظهاره بطريقة سهلة القراءة. ويمكن للباحث عن عمل استخدامه عند التقديم على وظائف في الشركات والمؤسسات، والوظائف الإدارية، والمحاسبة، والهندسة، وتقنية المعلومات، والتعليم، وخدمة العملاء، والمبيعات، والموارد البشرية وغيرها من المجالات التي تحتاج إلى سيرة ذاتية واضحة ومهنية.
</p>

<p>
  كما يتيح القالب اختيار اللون المناسب للسيرة الذاتية من مجموعة من الألوان المختلفة. ويمكنك اختيار لون رسمي مثل الكحلي أو الرمادي أو الأسود، أو اختيار لون أكثر وضوحًا مثل الأزرق أو الأخضر أو البنفسجي حسب طبيعة المجال والوظيفة التي تتقدم إليها. ويساعد اختيار لون مناسب على إعطاء السيرة الذاتية هوية بصرية بسيطة دون أن يطغى التصميم على المحتوى الأساسي.
</p>

<h3 style="
  font-size:20px;
  font-weight:800;
  margin-top:30px;
  margin-bottom:12px;
">
  أهمية المعلومات الشخصية في السيرة الذاتية
</h3>

<p>
  تبدأ السيرة الذاتية عادة بالمعلومات الأساسية التي تساعد صاحب العمل على التعرف عليك والتواصل معك. لذلك يوفر قالب Professional حقولًا للاسم الكامل، والمسمى الوظيفي، والدولة، والمدينة، ورقم الهاتف، والبريد الإلكتروني، بالإضافة إلى رابط LinkedIn والموقع الشخصي عند توفرهما. من الأفضل التأكد من كتابة هذه المعلومات بشكل صحيح قبل تحميل السيرة الذاتية، خصوصًا البريد الإلكتروني ورقم الهاتف، لأن وجود خطأ بسيط في معلومات التواصل قد يمنع مسؤول التوظيف من الوصول إليك.
</p>

<p>
  ومن المفيد أيضًا أن يكون المسمى الوظيفي متوافقًا مع الوظيفة التي تتقدم إليها. فإذا كنت تتقدم لوظيفة محاسب، فمن الأفضل استخدام مسمى واضح مثل "محاسب" أو "محاسب مالي" بحسب خبرتك الفعلية، بدل استخدام عنوان عام لا يعكس طبيعة عملك. يساعد العنوان الواضح على فهم تخصصك منذ بداية قراءة السيرة الذاتية.
</p>

<h3 style="
  font-size:20px;
  font-weight:800;
  margin-top:30px;
  margin-bottom:12px;
">
  كيف تكتب ملخصًا مهنيًا قويًا؟
</h3>

<p>
  الملخص المهني من الأقسام المهمة في السيرة الذاتية لأنه يقدم فكرة سريعة عن خلفيتك المهنية ومهاراتك وأهدافك. حاول أن يكون الملخص مختصرًا ومباشرًا، وأن يوضح المجال الذي تعمل فيه وأبرز نقاط قوتك والخبرة التي تمتلكها. ومن الأفضل تجنب العبارات العامة جدًا التي لا تضيف معلومات حقيقية عنك.
</p>

<p>
  على سبيل المثال، بدل كتابة عبارة قصيرة مثل "أبحث عن فرصة عمل مناسبة لتطوير نفسي"، يمكنك توضيح تخصصك وخبرتك ومهاراتك بشكل أكثر فائدة. ويمكن أن يتضمن الملخص عدد سنوات الخبرة، والمجال المهني، وبعض المهارات الرئيسية أو نوع المهام التي لديك خبرة فيها. ويجب أن يكون المحتوى صادقًا ويعكس خبرتك الحقيقية.
</p>

<h3 style="
  font-size:20px;
  font-weight:800;
  margin-top:30px;
  margin-bottom:12px;
">
  كتابة الخبرات المهنية بطريقة أفضل
</h3>

<p>
  قسم الخبرات المهنية يساعد صاحب العمل على معرفة الأماكن التي عملت فيها والمهام التي توليتها خلال مسيرتك المهنية. عند استخدام قالب Professional يمكنك إدخال المسمى الوظيفي واسم الشركة وتاريخ بداية العمل وتاريخ النهاية، بالإضافة إلى وصف الخبرة والمسؤوليات والإنجازات.
</p>

<p>
  حاول ألا تجعل وصف الخبرة مجرد قائمة طويلة من المهام اليومية. الأفضل التركيز على المسؤوليات المهمة والنتائج التي ساهمت في تحقيقها عندما يكون ذلك ممكنًا. على سبيل المثال، يمكنك توضيح أنك تعاملت مع العملاء، أو أعددت التقارير، أو أدرت فريقًا، أو استخدمت برنامجًا معينًا، أو ساهمت في تحسين إجراء داخل الشركة. كلما كان الوصف أكثر ارتباطًا بالوظيفة المستهدفة، أصبح أكثر فائدة لمسؤول التوظيف.
</p>

<h3 style="
  font-size:20px;
  font-weight:800;
  margin-top:30px;
  margin-bottom:12px;
">
  التعليم والمؤهلات الأكاديمية
</h3>

<p>
  يوفر القالب قسمًا مخصصًا للتعليم يمكنك من خلاله إضافة الدرجة العلمية والتخصص والجامعة أو المؤسسة التعليمية وسنة التخرج. احرص على كتابة اسم الدرجة والتخصص بشكل واضح، خصوصًا إذا كان التخصص مرتبطًا مباشرة بالوظيفة التي تتقدم إليها. ويمكن للخريجين الجدد إعطاء هذا القسم أهمية أكبر عند عدم امتلاك خبرة مهنية طويلة، مع إمكانية إضافة المشاريع الأكاديمية أو التدريب العملي في الأقسام المناسبة إذا كانت ذات صلة بالوظيفة.
</p>

<h3 style="
  font-size:20px;
  font-weight:800;
  margin-top:30px;
  margin-bottom:12px;
">
  اختيار المهارات المناسبة
</h3>

<p>
  المهارات من أكثر المعلومات التي يبحث عنها أصحاب العمل عند مراجعة السير الذاتية. يتيح لك قالب Professional إضافة مجموعة من المهارات وفصلها باستخدام الفواصل. حاول اختيار المهارات التي تمتلكها فعلًا والتي ترتبط بالوظيفة المستهدفة. يمكن أن تشمل المهارات مهارات تقنية مثل Excel أو تحليل البيانات أو البرمجة، ومهارات مهنية مثل إدارة الوقت والتواصل والعمل الجماعي وحل المشكلات، بحسب تخصصك وخبرتك.
</p>

<p>
  ومن الأفضل مراجعة إعلان الوظيفة قبل كتابة قسم المهارات. فإذا كان إعلان الوظيفة يذكر أدوات أو برامج أو مهارات محددة وتمتلكها بالفعل، يمكنك إضافتها إلى سيرتك الذاتية بطريقة طبيعية. هذا يجعل السيرة الذاتية أكثر ارتباطًا بالوظيفة التي تتقدم إليها.
</p>

<h3 style="
  font-size:20px;
  font-weight:800;
  margin-top:30px;
  margin-bottom:12px;
">
  الدورات والشهادات واللغات
</h3>

<p>
  يمكن أن تساعد الدورات والشهادات المهنية في توضيح اهتمامك بالتطوير المستمر، خصوصًا عندما تكون الشهادة مرتبطة بالمجال الذي تعمل فيه أو الوظيفة التي ترغب في الحصول عليها. اكتب اسم الدورة أو الشهادة بشكل واضح، ويفضل إضافة الجهة المانحة أو السنة عندما تكون هذه المعلومات مفيدة.
</p>

<p>
  أما قسم اللغات فيمكن استخدامه لتوضيح اللغات التي تتحدثها ومستوى إتقانك لها. حاول استخدام أوصاف واضحة لمستواك مثل اللغة الأم، ممتاز، جيد جدًا، جيد، أو أي وصف دقيق يعكس مستواك الحقيقي. تجنب المبالغة في مستوى اللغة لأن ذلك قد يظهر خلال المقابلة الشخصية أو اختبار اللغة.
</p>

<h3 style="
  font-size:20px;
  font-weight:800;
  margin-top:30px;
  margin-bottom:12px;
">
  لمن يناسب قالب Professional؟
</h3>

<p>
  يناسب قالب Professional الباحثين عن عمل في العديد من القطاعات، وخاصة الأشخاص الذين يفضلون السيرة الذاتية الرسمية والواضحة. ويمكن استخدامه من قبل حديثي التخرج، والموظفين الذين لديهم خبرة عملية، وأصحاب الخبرات المتوسطة، والباحثين عن فرص جديدة داخل بلدهم أو في أسواق العمل العربية والدولية. كما يمكن تعديله وفق طبيعة الوظيفة من خلال تغيير المسمى الوظيفي والملخص والمهارات والخبرات بما يتناسب مع الفرصة المستهدفة.
</p>

<h3 style="
  font-size:20px;
  font-weight:800;
  margin-top:30px;
  margin-bottom:12px;
">
  نصائح قبل تحميل السيرة الذاتية
</h3>

<p>
  قبل الضغط على زر تحميل PDF، راجع جميع البيانات الموجودة في السيرة الذاتية بعناية. تأكد من صحة الاسم ورقم الهاتف والبريد الإلكتروني، وتحقق من عدم وجود أخطاء إملائية أو معلومات غير دقيقة. اقرأ الملخص المهني والخبرات والمهارات مرة أخرى وتأكد من ارتباطها بالوظيفة التي ترغب في التقدم إليها.
</p>

<p>
  من الأفضل أيضًا عدم إرسال نفس السيرة الذاتية لجميع الوظائف دون تعديل. يمكنك الاحتفاظ بنسخة أساسية من سيرتك الذاتية ثم تعديل الملخص والمهارات وبعض التفاصيل المهنية حسب متطلبات كل وظيفة. هذه الخطوة تساعد على جعل طلب التوظيف أكثر ارتباطًا بالفرصة التي تتقدم إليها.
</p>

<h3 style="
  font-size:20px;
  font-weight:800;
  margin-top:30px;
  margin-bottom:12px;
">
  إنشاء السيرة الذاتية وتحميلها بصيغة PDF
</h3>

<p>
  يمكنك استخدام نموذج إنشاء السيرة الذاتية الموجود في هذه الصفحة لإدخال معلوماتك الشخصية والمهنية والتعليمية والمهارات والدورات واللغات. بعد الانتهاء من إدخال البيانات يمكنك اختيار اللون المناسب ثم معاينة السيرة الذاتية للتأكد من شكلها ومحتواها. وعند التأكد من أن جميع البيانات صحيحة، يمكنك استخدام خيار تحميل PDF للحصول على نسخة جاهزة للاستخدام عند التقديم على الوظائف.
</p>

<p>
  تذكر أن قالب السيرة الذاتية هو وسيلة لعرض خبرتك ومؤهلاتك، وليس بديلًا عن جودة المحتوى نفسه. التصميم الجيد يساعد على تنظيم المعلومات، لكن أهم ما يجعل السيرة الذاتية قوية هو أن تكون البيانات دقيقة، والخبرات واضحة، والمهارات مرتبطة بالوظيفة، والمحتوى مكتوبًا بطريقة مهنية وصادقة.
</p>

<h3 style="
  font-size:20px;
  font-weight:800;
  margin-top:30px;
  margin-bottom:12px;
">
  أسئلة شائعة حول قالب Professional
</h3>

<h4 style="font-size:16px;font-weight:800;margin-top:18px;">
  هل يمكن تحميل السيرة الذاتية بصيغة PDF؟
</h4>

<p>
  نعم، بعد إدخال البيانات يمكنك استخدام زر تحميل PDF لإنشاء نسخة من السيرة الذاتية بصيغة PDF.
</p>

<h4 style="font-size:16px;font-weight:800;margin-top:18px;">
  هل يمكن اختيار لون السيرة الذاتية؟
</h4>

<p>
  نعم، يوفر القالب مجموعة من الألوان التي يمكنك الاختيار بينها حسب ذوقك وطبيعة الوظيفة التي تتقدم إليها.
</p>

<h4 style="font-size:16px;font-weight:800;margin-top:18px;">
  هل يناسب القالب حديثي التخرج؟
</h4>

<p>
  نعم، يمكن لحديثي التخرج استخدام القالب وإبراز التعليم والمهارات والدورات والتدريب والخبرات العملية المتوفرة لديهم.
</p>

<h4 style="font-size:16px;font-weight:800;margin-top:18px;">
  هل يمكن استخدام القالب لأكثر من وظيفة؟
</h4>

<p>
  نعم، ويمكنك إنشاء نسخة مخصصة لكل وظيفة من خلال تعديل المسمى الوظيفي والملخص والمهارات والخبرات بما يتناسب مع متطلبات الوظيفة.
</p>

  </div>

</div>

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
     waitUntil: 'load',
  timeout: 120000
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

console.log('===== PDF GENERATED =====');
console.log('PDF SIZE:', pdf.length);

    await browser.close();

console.log('===== BROWSER CLOSED =====');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="my-cv.pdf"',
      'Content-Length': pdf.length
    });

    res.send(pdf);
console.log('===== PDF SENT =====');

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
  formtarget="_blank"
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
<!-- وصف القالب -->
<div style="
  max-width:900px;
  margin:50px auto;
  padding:30px;
  background:#ffffff;
  border:1px solid var(--border);
  border-radius:16px;
  line-height:2;
  color:#334155;
">

  <h2 style="
    font-size:24px;
    font-weight:800;
    margin-bottom:20px;
  ">
    قالب السيرة الذاتية  ATS
  </h2>

  <div style="
    font-size:15px;
  ">

<h2>قالب السيرة الذاتية ATS – سيرة ذاتية متوافقة مع أنظمة تتبع المتقدمين</h2>

<p>
قالب السيرة الذاتية ATS هو قالب مصمم خصيصًا للباحثين عن عمل الذين يرغبون في إنشاء سيرة ذاتية واضحة ومنظمة وسهلة القراءة من قبل أصحاب العمل وأنظمة تتبع المتقدمين. أصبحت العديد من الشركات والمؤسسات تستخدم أنظمة إلكترونية للمساعدة في استقبال طلبات التوظيف وفرز السير الذاتية قبل وصولها إلى مسؤول التوظيف، ولذلك أصبح تنسيق السيرة الذاتية وطريقة كتابة المعلومات وترتيب الأقسام من الأمور المهمة عند التقديم على الوظائف.
</p>

<p>
يوفر قالب ATS تصميمًا بسيطًا واحترافيًا يركز على المحتوى بدلًا من الزخارف البصرية المعقدة. الهدف من هذا النوع من القوالب هو تقديم معلومات المتقدم بطريقة منظمة وواضحة، بحيث يستطيع مسؤول التوظيف الوصول بسرعة إلى الاسم والمسمى الوظيفي والخبرة المهنية والتعليم والمهارات والدورات والشهادات واللغات وبيانات التواصل. كما يساعد التنظيم الجيد للبيانات الباحث عن العمل على تقديم صورة مهنية أكثر وضوحًا عن خبراته ومؤهلاته.
</p>

<h3>ما هو نظام ATS؟</h3>

<p>
يشير مصطلح ATS إلى Applicant Tracking System، أي نظام تتبع المتقدمين للوظائف. تستخدم بعض الشركات أنظمة رقمية لإدارة طلبات التوظيف والسير الذاتية التي تصل إليها، خصوصًا عندما يكون عدد المتقدمين على الوظيفة كبيرًا. يمكن لهذه الأنظمة تنظيم الطلبات والبحث داخل السير الذاتية عن معلومات محددة مثل المسمى الوظيفي والمهارات والخبرات والمؤهلات التعليمية والكلمات المرتبطة بالوظيفة.
</p>

<p>
وجود نظام ATS لا يعني أن السيرة الذاتية يجب أن تكون خالية من التصميم تمامًا، ولكنه يعني أن وضوح المحتوى وبنية السيرة الذاتية يجب أن يكونا من الأولويات. لذلك يعتمد قالب ATS على تصميم عملي ومنظم، مع تقسيم واضح للأقسام واستخدام عناوين مفهومة وترتيب منطقي للمعلومات.
</p>

<h3>لماذا تختار قالب ATS؟</h3>

<p>
يعتبر قالب ATS خيارًا مناسبًا للمتقدمين إلى الوظائف في الشركات والمؤسسات التي تعتمد على التقديم الإلكتروني. كما يناسب الأشخاص الذين يريدون استخدام سيرة ذاتية احترافية يمكن قراءتها بسهولة دون الاعتماد على عناصر تصميمية كثيرة. فبدلًا من وضع المعلومات داخل عناصر بصرية معقدة، يتم التركيز على النصوص والعناوين والأقسام الأساسية.
</p>

<p>
من أهم مميزات قالب ATS أنه يعطي مساحة أكبر للمحتوى المهني. يستطيع المستخدم كتابة ملخص مهني واضح، وإضافة خبراته السابقة، وذكر الإنجازات والمسؤوليات، وإضافة المهارات المرتبطة بالوظيفة، بالإضافة إلى المؤهلات التعليمية والدورات والشهادات واللغات. هذا يجعل القالب مناسبًا لمجموعة واسعة من التخصصات والوظائف.
</p>

<h3>أهم أقسام السيرة الذاتية في قالب ATS</h3>

<p>
يحتوي قالب ATS على مجموعة من الأقسام الأساسية التي تساعد على تنظيم المعلومات المهنية. يبدأ عادةً بالمعلومات الشخصية وبيانات التواصل، ثم المسمى الوظيفي أو المسمى المهني، وبعد ذلك يمكن إضافة الملخص المهني والخبرة العملية والتعليم والمهارات والدورات والشهادات واللغات حسب خبرة المتقدم ومتطلبات الوظيفة.
</p>

<p>
من المهم أن يختار المستخدم الأقسام التي تتناسب مع خبرته الفعلية. فالشخص الذي يمتلك خبرة عملية كبيرة يجب أن يعطي قسم الخبرة المهنية مساحة مناسبة، بينما يمكن للخريج الجديد التركيز بشكل أكبر على التعليم والمشاريع والتدريب والمهارات والدورات ذات العلاقة.
</p>

<h3>كيفية كتابة الملخص المهني في سيرة ATS</h3>

<p>
الملخص المهني من الأقسام المهمة في بداية السيرة الذاتية، لأنه يقدم فكرة سريعة عن خبرة المتقدم ومجاله المهني وأهم نقاط قوته. يفضل أن يكون الملخص واضحًا ومختصرًا ومخصصًا للوظيفة التي يتقدم إليها الشخص، بدلًا من استخدام نص عام يمكن وضعه في أي سيرة ذاتية.
</p>

<p>
على سبيل المثال، إذا كان المتقدم يبحث عن وظيفة في المحاسبة، يمكن أن يتضمن الملخص خبرته في إعداد التقارير المالية ومتابعة الحسابات واستخدام برامج المحاسبة والتحليل المالي، بشرط أن تكون هذه المعلومات حقيقية وتعكس خبرة الشخص ومهاراته الفعلية.
</p>

<h3>الكلمات المفتاحية وأهميتها</h3>

<p>
من الأمور المهمة عند إعداد سيرة ذاتية للتقديم على وظيفة أن يقرأ الباحث عن العمل وصف الوظيفة بعناية. غالبًا يحتوي إعلان الوظيفة على مجموعة من المهارات والمؤهلات والمصطلحات المهنية المرتبطة بالوظيفة. يمكن للمتقدم استخدام المصطلحات المناسبة في سيرته الذاتية عندما تكون مرتبطة فعلًا بخبرته.
</p>

<p>
على سبيل المثال، إذا كان إعلان الوظيفة يطلب مهارات مثل إدارة المشاريع، Microsoft Excel، إعداد التقارير، تحليل البيانات أو خدمة العملاء، وكان المتقدم يمتلك هذه المهارات بالفعل، فمن المفيد ذكرها بطريقة طبيعية داخل قسم المهارات أو الخبرة المهنية.
</p>

<p>
لا يُنصح بإضافة كلمات مفتاحية لا يمتلكها المتقدم بهدف زيادة فرصة ظهوره في نتائج البحث، لأن السيرة الذاتية يجب أن تكون دقيقة وصادقة وتعكس المؤهلات الحقيقية لصاحبها.
</p>

<h3>كتابة الخبرات المهنية بطريقة أفضل</h3>

<p>
بدلًا من كتابة اسم الوظيفة والشركة فقط، من الأفضل استخدام قسم الخبرة المهنية لعرض المسؤوليات والإنجازات المهمة. يمكن توضيح نوع المهام التي كان المتقدم مسؤولًا عنها والأدوات والبرامج التي استخدمها والنتائج التي ساهم في تحقيقها.
</p>

<p>
على سبيل المثال، بدلًا من كتابة "مسؤول عن خدمة العملاء"، يمكن توضيح طبيعة العمل مثل "التعامل مع استفسارات العملاء ومتابعة طلباتهم وحل المشكلات وتحسين جودة الخدمة". وإذا كانت هناك نتائج قابلة للقياس، فمن المفيد ذكرها بشكل دقيق، مثل عدد العملاء أو حجم العمليات أو نسبة التحسن، إذا كانت هذه المعلومات صحيحة.
</p>

<h3>المهارات في قالب ATS</h3>

<p>
قسم المهارات يساعد صاحب العمل على معرفة نقاط القوة الرئيسية لدى المتقدم بسرعة. من الأفضل اختيار المهارات المرتبطة بالوظيفة بدلًا من وضع قائمة طويلة من المهارات العامة التي لا تضيف قيمة حقيقية.
</p>

<p>
يمكن تقسيم المهارات إلى مهارات تقنية ومهارات مهنية حسب طبيعة المجال. على سبيل المثال، يمكن لمطور البرمجيات ذكر لغات البرمجة والأطر البرمجية وأدوات التطوير، بينما يمكن للمحاسب ذكر برامج المحاسبة وExcel وإعداد التقارير والتحليل المالي، ويمكن لموظف التسويق ذكر التسويق الرقمي وتحليل البيانات وإدارة الحملات وصناعة المحتوى.
</p>

<h3>التعليم والدورات والشهادات</h3>

<p>
يساعد قسم التعليم على توضيح المؤهلات الأكاديمية للمتقدم، ويمكن أن يتضمن الدرجة العلمية والتخصص والجامعة أو المؤسسة التعليمية وسنة التخرج. كما يمكن إضافة الدورات والشهادات المهنية التي ترتبط مباشرة بالمجال الوظيفي.
</p>

<p>
لا يحتاج المستخدم إلى إضافة كل دورة حصل عليها طوال حياته المهنية. الأفضل التركيز على الدورات والشهادات التي تضيف قيمة إلى طلب التوظيف وترتبط بالوظيفة المستهدفة.
</p>

<h3>هل قالب ATS مناسب للخريجين الجدد؟</h3>

<p>
نعم، يمكن أن يكون قالب ATS مناسبًا للخريجين الجدد والباحثين عن أول وظيفة. في حالة عدم وجود خبرة عملية طويلة، يمكن التركيز على التعليم والمشاريع الأكاديمية والتدريب العملي والمهارات والدورات والشهادات والأنشطة المهنية ذات الصلة.
</p>

<p>
يمكن للخريج أيضًا استخدام الملخص المهني لتوضيح المجال الذي يرغب في العمل فيه، مع التركيز على المهارات التي اكتسبها خلال الدراسة أو التدريب. المهم هو عدم إضافة خبرات غير حقيقية، وإنما تقديم الخبرات الأكاديمية والتدريبية بطريقة مهنية ومنظمة.
</p>

<h3>أخطاء يجب تجنبها عند إنشاء سيرة ذاتية ATS</h3>

<p>
من الأخطاء الشائعة استخدام تصميم مزدحم جدًا أو إضافة معلومات غير ضرورية أو كتابة فقرات طويلة يصعب قراءتها. كما يجب تجنب استخدام كلمات مفتاحية غير مرتبطة بالخبرة الفعلية، أو إضافة معلومات غير دقيقة، أو إرسال نفس السيرة الذاتية لكل الوظائف دون تعديلها.
</p>

<p>
من الأفضل أيضًا مراجعة الأخطاء الإملائية واللغوية قبل إرسال السيرة الذاتية، والتأكد من صحة رقم الهاتف والبريد الإلكتروني وروابط LinkedIn والموقع الشخصي. كما يجب التأكد من أن تواريخ الخبرة والتعليم واضحة ومتناسقة.
</p>

<h3>نصائح للحصول على سيرة ذاتية أكثر احترافية</h3>

<p>
ابدأ بقراءة إعلان الوظيفة الذي تريد التقديم إليه، ثم حدد أهم المهارات والمؤهلات المطلوبة. بعد ذلك راجع سيرتك الذاتية وعدّل الملخص المهني والمهارات ووصف الخبرات بحيث تعكس متطلبات الوظيفة، بشرط أن تكون جميع المعلومات حقيقية.
</p>

<p>
استخدم عناوين واضحة للأقسام، وحافظ على ترتيب منطقي للمعلومات، واكتب الخبرات بطريقة مباشرة. حاول التركيز على الإنجازات والنتائج بدلًا من سرد المهام فقط عندما يكون ذلك ممكنًا. كما يفضل مراجعة السيرة الذاتية قبل كل عملية تقديم للتأكد من أنها مناسبة للوظيفة المحددة.
</p>

<h3>هل قالب ATS يعني أن الحصول على الوظيفة مضمون؟</h3>

<p>
لا. استخدام قالب ATS لا يضمن تجاوز أي نظام توظيف أو الحصول على مقابلة أو وظيفة. قرار التوظيف يعتمد على عوامل عديدة، منها مؤهلات المتقدم وخبرته ومدى توافقه مع متطلبات الوظيفة وجودة طلب التوظيف والمقابلة الشخصية واحتياجات الشركة.
</p>

<p>
الفكرة الأساسية من قالب ATS هي تقديم المعلومات المهنية بطريقة واضحة ومنظمة، مما يساعد على جعل السيرة الذاتية سهلة القراءة والمراجعة. لذلك يجب اعتبار القالب أداة لتنظيم وتقديم المعلومات، وليس وسيلة لضمان القبول في وظيفة معينة.
</p>

<h3>ابدأ بإنشاء سيرتك الذاتية الآن</h3>

<p>
إذا كنت تبحث عن طريقة سهلة لإنشاء سيرة ذاتية منظمة للتقديم على الوظائف، يمكنك استخدام قالب ATS وإدخال معلوماتك الشخصية وخبراتك المهنية وتعليمك ومهاراتك ودوراتك وشهاداتك ولغاتك. بعد الانتهاء من إدخال البيانات، يمكنك معاينة السيرة الذاتية والتأكد من ترتيب المعلومات ثم تحميلها بصيغة PDF واستخدامها عند التقديم على الوظائف المناسبة.
</p>

<p>
احرص دائمًا على تخصيص سيرتك الذاتية لكل وظيفة عندما يكون ذلك ممكنًا، واستخدم المعلومات والكلمات المهنية المرتبطة بخبرتك الحقيقية. السيرة الذاتية الجيدة ليست مجرد تصميم جميل، بل هي وثيقة مهنية توضح لصاحب العمل من أنت، وما الذي تستطيع تقديمه، وما الخبرات والمهارات التي تمتلكها، ولماذا يمكن أن تكون مناسبًا للوظيفة التي تتقدم إليها.
</p>
  </div>

</div>
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

console.log('ATS STEP 2 - Browser launched');

    const page = await browser.newPage();

console.log('ATS STEP 3 - New page created');
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

      waitUntil: 'load',
  timeout: 120000

    });

console.log('ATS STEP 4 - Content loaded');
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

console.log('ATS STEP 5 - PDF GENERATED');
console.log('PDF SIZE:', pdf.length);

    await browser.close();
console.log('ATS STEP 6 - BROWSER CLOSED');

    res.set({

      'Content-Type':'application/pdf',

      'Content-Disposition':'attachment; filename="ats-cv.pdf"',

      'Content-Length':pdf.length

    });


    res.send(pdf);

console.log('ATS STEP 7 - PDF SENT');

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
  formtarget="_blank"
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
<!-- وصف القالب -->
<div style="
  max-width:900px;
  margin:50px auto;
  padding:30px;
  background:#ffffff;
  border:1px solid var(--border);
  border-radius:16px;
  line-height:2;
  color:#334155;
">

  <h2 style="
    font-size:24px;
    font-weight:800;
    margin-bottom:20px;
  ">
    قالب السيرة الذاتية العصري MODERN 
  </h2>

  <div style="
    font-size:15px;
  ">

<!-- وصف القالب العصري -->
<div style="
  max-width:900px;
  margin:50px auto;
  padding:30px;
  background:#ffffff;
  border:1px solid var(--border);
  border-radius:16px;
  line-height:2;
  color:#334155;
">

  <h2 style="
    font-size:24px;
    font-weight:800;
    margin-bottom:20px;
  ">
    قالب السيرة الذاتية العصري Modern
  </h2>

  <p>
    قالب السيرة الذاتية العصري Modern هو خيار مناسب للباحثين عن عمل الذين يرغبون في الحصول على سيرة ذاتية تجمع بين التنظيم والمظهر الحديث وسهولة قراءة المعلومات. تم تصميم هذا القالب ليقدم البيانات المهنية بطريقة مرتبة مع استخدام توزيع واضح للأقسام والألوان والعناصر البصرية البسيطة. ويمكن استخدامه لإنشاء سيرة ذاتية تناسب مجموعة واسعة من الوظائف، سواء كنت حديث التخرج أو تمتلك خبرة عملية وتبحث عن فرصة مهنية جديدة.
  </p>

  <p>
    يتيح لك هذا القالب إدخال معلوماتك الشخصية والمهنية والتعليمية، وإضافة الخبرات والمهارات والدورات والشهادات واللغات، ثم اختيار اللون الذي يناسبك قبل معاينة السيرة الذاتية أو تحميلها بصيغة PDF. وبذلك يمكنك إنشاء نسخة منظمة من سيرتك الذاتية دون الحاجة إلى تصميم المستند يدويًا أو التعامل مع برامج التصميم المعقدة.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    لماذا تختار قالب Modern؟
  </h3>

  <p>
    يعتمد القالب العصري على فكرة تقديم المعلومات المهنية بأسلوب أكثر حيوية من القوالب التقليدية، مع المحافظة على الوضوح وعدم المبالغة في استخدام العناصر الزخرفية. ويظهر الاسم والمسمى الوظيفي ومعلومات التواصل بطريقة بارزة، بينما يتم تنظيم الخبرات والتعليم والمهارات والدورات في أقسام منفصلة تساعد القارئ على الانتقال بين المعلومات بسهولة.
  </p>

  <p>
    التصميم العصري يمكن أن يكون مناسبًا بشكل خاص للباحثين عن وظائف في القطاعات التي تهتم بالمهارات الحديثة وطريقة تقديم المعلومات، مثل التسويق الرقمي، وتقنية المعلومات، وخدمة العملاء، والمبيعات، وإدارة المشاريع، والإعلام، وإدارة الأعمال، والوظائف المكتبية والمهنية المختلفة. ومع ذلك، يمكن تعديل محتوى السيرة الذاتية بحيث يناسب طبيعة الوظيفة التي تتقدم إليها.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    اختيار لون السيرة الذاتية
  </h3>

  <p>
    من الخصائص التي يوفرها قالب Modern إمكانية اختيار لون السيرة الذاتية من مجموعة متنوعة من الألوان. يمكنك اختيار الكحلي أو الأزرق أو الأخضر أو التركواز أو البنفسجي أو الخمري أو البرتقالي أو البني أو الرمادي أو الأسود. اختيار اللون لا ينبغي أن يكون عشوائيًا، بل من الأفضل التفكير في طبيعة المجال الذي تتقدم إليه والانطباع المهني الذي تريد أن تعكسه.
  </p>

  <p>
    الألوان الكحلية والزرقاء مناسبة عادة للمجالات المهنية والإدارية والتقنية، بينما يمكن أن تكون الألوان الخضراء أو التركوازية خيارًا جيدًا لمن يرغب في مظهر هادئ وحديث. أما الألوان الأكثر جرأة مثل البرتقالي أو البنفسجي فيمكن استخدامها عندما تكون طبيعة المجال أكثر انفتاحًا على الأساليب البصرية الحديثة. وفي جميع الحالات، يجب أن يبقى الهدف الأساسي هو وضوح النص وسهولة قراءة المعلومات.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    كيف تجعل معلوماتك الشخصية أكثر احترافية؟
  </h3>

  <p>
    تبدأ السيرة الذاتية بالمعلومات التي تساعد صاحب العمل على التعرف عليك والتواصل معك. لذلك من المهم إدخال الاسم الكامل بشكل صحيح، وكتابة المسمى الوظيفي بطريقة تعكس تخصصك أو الوظيفة التي تستهدفها. كما يوفر القالب حقولًا للدولة والمدينة ورقم الهاتف والبريد الإلكتروني، بالإضافة إلى LinkedIn والموقع الشخصي عند توفرهما.
  </p>

  <p>
    احرص على استخدام بريد إلكتروني مهني عند التقديم للوظائف، وتأكد من أن رقم الهاتف مكتوب بشكل صحيح. وإذا كنت تستخدم حساب LinkedIn، فمن الأفضل التأكد من أن الرابط يقود إلى صفحتك المهنية وأن المعلومات الموجودة فيه متوافقة مع المعلومات الموجودة في السيرة الذاتية.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    كتابة الملخص المهني
  </h3>

  <p>
    الملخص المهني هو فرصة لتقديم صورة سريعة عن خبرتك ومجالك وأهم نقاط قوتك. حاول أن تجعل الملخص مرتبطًا بالوظيفة التي تتقدم إليها بدل استخدام نص عام يمكن وضعه في أي سيرة ذاتية. يمكن أن تذكر فيه مجال تخصصك، وعدد سنوات الخبرة إذا كان مناسبًا، وأبرز المهارات التي تمتلكها، ونوع القيمة التي تستطيع تقديمها في بيئة العمل.
  </p>

  <p>
    بالنسبة لحديثي التخرج، يمكن التركيز على التخصص الجامعي والتدريب العملي والمشاريع الأكاديمية والمهارات التي تم تطويرها خلال الدراسة. ليس من الضروري أن يكون لديك سنوات طويلة من الخبرة حتى تكتب ملخصًا مهنيًا جيدًا؛ المهم أن يكون المحتوى واقعيًا ومحددًا ويعكس إمكاناتك الفعلية.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    عرض الخبرات المهنية
  </h3>

  <p>
    يسمح قالب Modern بإضافة المسمى الوظيفي واسم الشركة وتاريخ بداية العمل وتاريخ النهاية ووصف الخبرة والمسؤوليات. عند كتابة هذا القسم، حاول التركيز على الخبرات الأكثر ارتباطًا بالوظيفة التي ترغب في الحصول عليها.
  </p>

  <p>
    من الأفضل أن يكون وصف الخبرة عمليًا ومحددًا. بدل كتابة قائمة عامة مثل "العمل مع العملاء" أو "استخدام الكمبيوتر"، حاول توضيح طبيعة مسؤولياتك والأنظمة أو البرامج التي استخدمتها والنتائج التي ساهمت في تحقيقها عندما يكون ذلك ممكنًا. ويمكنك استخدام أفعال واضحة عند وصف إنجازاتك مثل أدار، طور، نظم، تابع، حلل، نسق، نفذ أو ساهم.
  </p>

  <p>
    إذا كانت لديك أكثر من خبرة مهنية، فمن الأفضل إعطاء الأولوية للخبرات الأكثر ارتباطًا بالوظيفة المستهدفة. كما يجب مراجعة التواريخ والتأكد من أنها صحيحة، لأن وجود معلومات متناقضة قد يعطي انطباعًا غير جيد لدى مسؤول التوظيف.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    التعليم والتخصص
  </h3>

  <p>
    قسم التعليم مهم خصوصًا للخريجين الجدد والوظائف التي تتطلب مؤهلًا أكاديميًا محددًا. يمكنك إضافة الدرجة العلمية والتخصص والجامعة أو المؤسسة التعليمية وسنة التخرج. احرص على كتابة اسم التخصص والمؤسسة التعليمية بشكل واضح.
  </p>

  <p>
    إذا كنت حديث التخرج ولا تمتلك خبرة عملية كبيرة، يمكنك الاستفادة من هذا القسم لإظهار خلفيتك الأكاديمية، ويمكن دعمها بالدورات والمشاريع والتدريب العملي والمهارات ذات الصلة بالوظيفة. أما إذا كنت تمتلك سنوات طويلة من الخبرة، فمن الطبيعي أن تأخذ الخبرات المهنية مساحة أكبر من التعليم في السيرة الذاتية.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    اختيار المهارات المناسبة
  </h3>

  <p>
    قسم المهارات من الأقسام التي تستحق عناية خاصة عند إنشاء السيرة الذاتية. لا تضع قائمة طويلة من المهارات لمجرد زيادة حجم السيرة الذاتية، بل اختر المهارات التي تمتلكها فعلًا والتي ترتبط بالوظيفة التي تتقدم إليها.
  </p>

  <p>
    يمكن أن تشمل المهارات البرامج والأدوات التي تتقن استخدامها، والمهارات التقنية المرتبطة بتخصصك، بالإضافة إلى المهارات المهنية مثل التواصل وإدارة الوقت والعمل الجماعي وحل المشكلات. والأفضل أن تكون مستعدًا لتقديم أمثلة على استخدام هذه المهارات إذا تم سؤالك عنها أثناء المقابلة.
  </p>

  <p>
    من المفيد أيضًا قراءة إعلان الوظيفة بعناية والتعرف على المهارات التي يبحث عنها صاحب العمل. إذا كنت تمتلك إحدى المهارات المطلوبة، يمكنك إضافتها إلى سيرتك الذاتية بصياغة طبيعية ودقيقة. بهذه الطريقة تصبح السيرة الذاتية أكثر ارتباطًا بالوظيفة بدل أن تكون وثيقة عامة لا تستهدف فرصة محددة.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    الدورات والشهادات المهنية
  </h3>

  <p>
    يمكن أن تساعد الدورات والشهادات في إظهار اهتمامك بالتعلم وتطوير مهاراتك، خاصة إذا كانت مرتبطة بالمجال المهني الذي تستهدفه. عند إضافة دورة أو شهادة، اكتب اسمها بوضوح، ويمكنك إضافة الجهة المانحة أو السنة إذا كانت هذه المعلومات مفيدة.
  </p>

  <p>
    لا تحتاج إلى إضافة كل دورة درستها طوال حياتك. اختر الدورات التي تضيف قيمة فعلية إلى طلب التوظيف والتي تتناسب مع الوظيفة أو التخصص. وإذا كانت لديك شهادات مهنية معروفة في مجالك، فمن المفيد إبرازها بطريقة واضحة ضمن هذا القسم.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    أهمية قسم اللغات
  </h3>

  <p>
    يمكن أن تكون اللغات عاملًا مهمًا في العديد من فرص العمل، خصوصًا الوظائف التي تتطلب التعامل مع العملاء أو الشركات الدولية أو فرق العمل متعددة الجنسيات. يتيح لك القالب إضافة اللغات ومستوى إتقان كل لغة.
  </p>

  <p>
    عند تحديد مستوى اللغة، استخدم وصفًا يعكس مستواك الحقيقي. لا تكتب أنك تتقن لغة بمستوى متقدم إذا كنت غير قادر على استخدامها في بيئة العمل، لأن مستوى اللغة يمكن اختباره خلال المقابلة أو أثناء أداء المهام الوظيفية.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    لمن يناسب قالب Modern؟
  </h3>

  <p>
    يناسب قالب Modern الأشخاص الذين يريدون سيرة ذاتية ذات مظهر حديث ومنظم دون الاعتماد على تصميم معقد. ويمكن استخدامه من قبل حديثي التخرج والموظفين وأصحاب الخبرات المختلفة، كما يمكن تكييف محتواه مع مجالات متعددة.
  </p>

  <p>
    قد يكون مناسبًا بشكل خاص للوظائف الحديثة والمجالات التي تجمع بين الجانب المهني والجانب العصري في تقديم المعلومات، مثل التسويق، والمبيعات، وتقنية المعلومات، وإدارة الأعمال، وخدمة العملاء، وإدارة المشاريع، والإعلام، والمحتوى الرقمي وغيرها. ومع ذلك، يجب اختيار القالب بناءً على طبيعة الوظيفة وثقافة جهة العمل وليس على الشكل فقط.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    أخطاء يفضل تجنبها عند إنشاء السيرة الذاتية
  </h3>

  <p>
    من أكثر الأخطاء شيوعًا كتابة معلومات غير دقيقة أو استخدام مبالغات في وصف الخبرات والمهارات. كما يفضل تجنب إضافة معلومات شخصية غير ضرورية لا تخدم عملية التوظيف. ومن المهم أيضًا مراجعة الأخطاء الإملائية والتأكد من أن جميع بيانات التواصل صحيحة.
  </p>

  <p>
    تجنب كذلك جعل السيرة الذاتية طويلة دون حاجة. الهدف هو تقديم المعلومات المهمة بطريقة منظمة، وليس إضافة أكبر عدد ممكن من الكلمات. اختر الخبرات والمهارات التي تساعد على توضيح مدى ملاءمتك للوظيفة، واحذف المعلومات التي لا تضيف قيمة واضحة.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    راجع سيرتك الذاتية قبل تحميل PDF
  </h3>

  <p>
    بعد الانتهاء من إدخال المعلومات، استخدم خيار معاينة السيرة الذاتية لمراجعة الشكل النهائي والمحتوى. تأكد من أن الاسم والمسمى الوظيفي واضحان، وأن بيانات التواصل صحيحة، وأن الخبرات والتعليم والمهارات مرتبة بشكل مناسب.
  </p>

  <p>
    إذا اكتشفت أي خطأ، يمكنك العودة إلى نموذج الإدخال وتعديل البيانات ثم معاينة السيرة الذاتية مرة أخرى. وبعد التأكد من صحة المحتوى، يمكنك استخدام خيار تحميل PDF للحصول على نسخة جاهزة للاستخدام عند التقديم للوظائف.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    لا تستخدم سيرة ذاتية واحدة لكل الوظائف
  </h3>

  <p>
    من الأفضل التعامل مع السيرة الذاتية باعتبارها وثيقة يمكن تخصيصها حسب الفرصة. احتفظ بنسخة أساسية تحتوي على معلوماتك المهنية، ثم عدّل الملخص والمهارات وبعض التفاصيل حسب الوظيفة التي تتقدم إليها. إذا كانت الوظيفة تركز على مهارة أو برنامج معين وتمتلك هذه المهارة فعلًا، فمن المفيد إبرازها في السيرة الذاتية.
  </p>

  <p>
    هذا الأسلوب يساعدك على تقديم طلب توظيف أكثر ارتباطًا بالفرصة ويجعل مسؤول التوظيف يرى المعلومات التي تهمه بشكل أسرع. والأهم أن تبقى جميع المعلومات صادقة وقابلة للإثبات.
  </p>

  <h3 style="
    font-size:20px;
    font-weight:800;
    margin-top:30px;
    margin-bottom:12px;
  ">
    أسئلة شائعة حول قالب Modern
  </h3>

  <h4 style="font-size:16px;font-weight:800;margin-top:18px;">
    هل يمكن تحميل السيرة الذاتية بصيغة PDF؟
  </h4>

  <p>
    نعم، يمكنك إدخال بياناتك ثم معاينة السيرة الذاتية واستخدام زر تحميل PDF للحصول على نسخة بصيغة PDF.
  </p>

  <h4 style="font-size:16px;font-weight:800;margin-top:18px;">
    هل يمكن تغيير لون القالب؟
  </h4>

  <p>
    نعم، يمكنك اختيار اللون المناسب من مجموعة الألوان المتاحة قبل إنشاء السيرة الذاتية وتحميلها.
  </p>

  <h4 style="font-size:16px;font-weight:800;margin-top:18px;">
    هل يناسب القالب حديثي التخرج؟
  </h4>

  <p>
    نعم، يمكن لحديثي التخرج استخدامه لإبراز التعليم والمهارات والدورات والتدريب والمشاريع والخبرات المتاحة لديهم.
  </p>

  <h4 style="font-size:16px;font-weight:800;margin-top:18px;">
    هل يمكن استخدامه للوظائف الإدارية والتقنية؟
  </h4>

  <p>
    نعم، يمكن استخدام القالب لمجالات متعددة، مع ضرورة تخصيص محتوى السيرة الذاتية حسب الوظيفة والمهارات المطلوبة في إعلان التوظيف.
  </p>

  <h4 style="font-size:16px;font-weight:800;margin-top:18px;">
    هل التصميم أهم من محتوى السيرة الذاتية؟
  </h4>

  <p>
    التصميم يساعد على تنظيم المعلومات وإظهارها بشكل جيد، لكن جودة المحتوى ودقة المعلومات وارتباطها بالوظيفة تظل من أهم عوامل إعداد سيرة ذاتية جيدة.
  </p>

</div>
  </div>

</div>
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
      waitUntil: 'load',
  timeout: 120000
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
  formtarget="_blank"
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
<!-- وصف القالب -->
<div style="
  max-width:900px;
  margin:50px auto;
  padding:30px;
  background:#ffffff;
  border:1px solid var(--border);
  border-radius:16px;
  line-height:2;
  color:#334155;
">

  <h2 style="
    font-size:24px;
    font-weight:800;
    margin-bottom:20px;
  ">
    قالب السيرة الذاتية الإبداعي Ceative
  </h2>

  <div style="
    font-size:15px;
  ">

<h2>قالب السيرة الذاتية الإبداعي Creative – تصميم مميز لإظهار شخصيتك المهنية</h2>

<p>
قالب السيرة الذاتية الإبداعي Creative هو خيار مناسب للباحثين عن عمل الذين يرغبون في تقديم خبراتهم ومهاراتهم بطريقة احترافية مع إضافة لمسة بصرية مميزة إلى السيرة الذاتية. تم تصميم هذا القالب ليجمع بين التنظيم الجيد للمعلومات والمظهر العصري الذي يساعد على إبراز شخصية المتقدم ومجاله المهني. فالسيرة الذاتية ليست مجرد قائمة بالمؤهلات والخبرات، بل هي أيضًا وسيلة لتقديم صورة أولية عن أسلوب المتقدم واهتمامه بالتفاصيل وطريقة تنظيمه للمعلومات.
</p>

<p>
يتميز القالب الإبداعي بتصميم أكثر حيوية من القوالب التقليدية، مع استخدام الألوان والعناصر البصرية بشكل متوازن. ومع ذلك، يبقى التركيز الأساسي على المحتوى المهني، بحيث يستطيع صاحب العمل الوصول إلى المعلومات المهمة مثل الاسم والمسمى الوظيفي والخبرة والتعليم والمهارات والدورات والشهادات وبيانات التواصل بسهولة.
</p>

<h3>لمن يناسب قالب السيرة الذاتية الإبداعي؟</h3>

<p>
يمكن أن يكون قالب Creative مناسبًا للأشخاص الذين يعملون أو يرغبون في العمل في المجالات التي تسمح بمظهر أكثر إبداعًا وتميزًا في السيرة الذاتية. ومن أمثلة ذلك مجالات التصميم الجرافيكي، التسويق، صناعة المحتوى، الإعلام، العلاقات العامة، التصوير، العلامات التجارية، وسائل التواصل الاجتماعي، التصميم الداخلي، الموضة، الإعلان وبعض الوظائف الرقمية والإبداعية.
</p>

<p>
كما يمكن استخدامه من قبل أصحاب الخبرات المختلفة، سواء كانوا حديثي التخرج أو لديهم عدة سنوات من الخبرة المهنية. يستطيع الخريج الجديد استخدام القالب لإبراز التعليم والمشاريع والتدريب والمهارات والدورات، بينما يستطيع صاحب الخبرة استخدام المساحة المتاحة لعرض إنجازاته المهنية ومسؤولياته السابقة بطريقة أكثر وضوحًا.
</p>

<h3>لماذا تختار القالب الإبداعي؟</h3>

<p>
أحد أهم أسباب اختيار القالب الإبداعي هو الرغبة في الابتعاد عن الشكل التقليدي جدًا للسيرة الذاتية دون التخلي عن التنظيم والاحترافية. بعض الوظائف والمجالات المهنية تستفيد من سيرة ذاتية ذات طابع بصري مميز، خصوصًا عندما تكون القدرة على تقديم المعلومات بطريقة جذابة جزءًا من طبيعة العمل.
</p>

<p>
يساعد التصميم الإبداعي على إنشاء تسلسل بصري واضح داخل السيرة الذاتية، بحيث تظهر المعلومات الرئيسية بطريقة منظمة. ويمكن للألوان والعناوين والفواصل والعناصر البصرية أن تساعد على تقسيم الصفحة إلى أجزاء سهلة القراءة بدلًا من تقديم جميع المعلومات في كتلة نصية واحدة.
</p>

<h3>اختيار اللون المناسب للسيرة الذاتية</h3>

<p>
يتيح قالب Creative اختيار اللون الذي يناسب ذوق المستخدم وهويته المهنية. يمكن اختيار ألوان مثل الكحلي أو الأزرق أو الأخضر أو التركواز أو البنفسجي أو الخمري أو البرتقالي أو البني أو الرمادي أو الأسود. ويُفضل اختيار اللون بناءً على طبيعة المجال والوظيفة المستهدفة بدلًا من اختيار اللون بشكل عشوائي.
</p>

<p>
على سبيل المثال، يمكن أن تكون الألوان الهادئة مثل الكحلي والأزرق مناسبة للعديد من المجالات المهنية، بينما يمكن استخدام البنفسجي أو البرتقالي أو التركواز في المجالات التي تسمح بطابع بصري أكثر جرأة. أما الأسود والرمادي فيمكن استخدامهما للحصول على مظهر بسيط وأنيق. المهم هو الحفاظ على وضوح النص وعدم جعل اللون يطغى على المعلومات الموجودة في السيرة الذاتية.
</p>

<h3>أهمية الاسم والمسمى الوظيفي</h3>

<p>
يجب أن يكون الاسم الكامل واضحًا في بداية السيرة الذاتية، ويُفضل أن يظهر المسمى الوظيفي أو المجال المهني بالقرب منه. يساعد ذلك صاحب العمل على معرفة هوية المتقدم ومجاله بسرعة. ومن الأفضل استخدام مسمى وظيفي مرتبط بالوظيفة التي يتقدم إليها الشخص، بشرط أن يعكس خبرته ومؤهلاته الفعلية.
</p>

<p>
إذا كان الشخص يعمل في مجال التسويق الرقمي، يمكن أن يستخدم مسمى مناسبًا مثل "أخصائي تسويق رقمي" عندما يكون ذلك متوافقًا مع خبرته. وإذا كان حديث التخرج، يمكن استخدام مسمى يعكس تخصصه أو المجال الذي يبحث عن فرصة فيه، دون الادعاء بامتلاك خبرة غير موجودة.
</p>

<h3>كتابة نبذة مهنية قوية</h3>

<p>
تعتبر النبذة المهنية من الأقسام المهمة في قالب Creative، لأنها تمنح صاحب العمل فكرة مختصرة عن خلفية المتقدم وأهم مهاراته وأهدافه المهنية. يفضل أن تكون النبذة محددة ومباشرة وأن تركز على المعلومات الأكثر ارتباطًا بالوظيفة.
</p>

<p>
يمكن أن تتضمن النبذة عدد سنوات الخبرة، المجال المهني، أهم المهارات والتخصصات، ونوع القيمة التي يستطيع المتقدم تقديمها. أما الخريج الجديد فيمكنه التركيز على تخصصه الأكاديمي ومهاراته والمجالات التي يرغب في تطوير مسيرته المهنية فيها.
</p>

<h3>كيف تعرض خبراتك المهنية؟</h3>

<p>
يجب أن يكون قسم الخبرة المهنية من أكثر أجزاء السيرة الذاتية اهتمامًا، خصوصًا إذا كان المتقدم يمتلك خبرة عملية. لا يكفي عادةً ذكر اسم الشركة والمسمى الوظيفي فقط، بل من الأفضل توضيح المسؤوليات والإنجازات والمهارات التي تم استخدامها أثناء العمل.
</p>

<p>
بدلًا من كتابة "إدارة حسابات التواصل الاجتماعي"، يمكن توضيح طبيعة المسؤولية بشكل أكبر، مثل إدارة المحتوى وجدولة المنشورات ومتابعة تفاعل الجمهور وتحليل أداء الحملات، إذا كانت هذه المهام جزءًا حقيقيًا من تجربة المتقدم.
</p>

<p>
كما يمكن ذكر النتائج القابلة للقياس عندما تكون متوفرة. على سبيل المثال، يمكن الإشارة إلى زيادة التفاعل أو تحسين سرعة إنجاز العمليات أو إدارة عدد معين من العملاء أو المشاريع، بشرط أن تكون الأرقام دقيقة ويمكن للمتقدم دعمها عند الحاجة.
</p>

<h3>قالب Creative للخريجين الجدد</h3>

<p>
لا يشترط أن يمتلك المستخدم سنوات طويلة من الخبرة حتى يستفيد من القالب الإبداعي. يمكن للخريجين الجدد إنشاء سيرة ذاتية جيدة من خلال التركيز على التعليم والتدريب والمشاريع الجامعية والمهارات والدورات والشهادات والأنشطة ذات العلاقة.
</p>

<p>
يمكن أيضًا استخدام قسم النبذة المهنية لتوضيح التخصص والهدف المهني، وإضافة المشاريع التي تم تنفيذها أثناء الدراسة إذا كانت مرتبطة بالوظيفة المستهدفة. بالنسبة للوظائف الإبداعية، يمكن أن تكون المشاريع الشخصية أو نماذج الأعمال مهمة جدًا، ولذلك من المفيد إضافة رابط Portfolio أو موقع شخصي عندما يكون متوفرًا.
</p>

<h3>المهارات في القالب الإبداعي</h3>

<p>
يمنح قسم المهارات المستخدم فرصة لعرض القدرات الأكثر ارتباطًا بمجاله المهني. من الأفضل اختيار المهارات التي تتوافق مع الوظيفة المستهدفة بدلًا من إضافة قائمة طويلة جدًا من المهارات العامة.
</p>

<p>
يمكن لمصمم الجرافيك مثلًا ذكر برامج التصميم التي يتقن استخدامها، بينما يمكن لمسوق رقمي ذكر إدارة الحملات وتحليل البيانات وصناعة المحتوى وتحسين محركات البحث، ويمكن لمطور برمجيات ذكر لغات البرمجة والأطر والأدوات التي يمتلك خبرة فعلية بها.
</p>

<p>
ومن الأفضل ترتيب المهارات حسب أهميتها بالنسبة إلى الوظيفة. المهارات الأكثر ارتباطًا بالوظيفة يمكن وضعها في البداية حتى تكون واضحة عند قراءة السيرة الذاتية.
</p>

<h3>الدورات والشهادات المهنية</h3>

<p>
يمكن أن تساعد الدورات والشهادات على دعم الملف المهني، خصوصًا عندما تكون مرتبطة مباشرة بالتخصص أو الوظيفة المستهدفة. يمكن إضافة الدورات المتعلقة بالتسويق أو التصميم أو البرمجة أو إدارة المشاريع أو تحليل البيانات أو اللغات أو غيرها من المجالات المهنية.
</p>

<p>
لكن لا يُنصح بإضافة عدد كبير جدًا من الدورات غير المرتبطة بالوظيفة. الأفضل اختيار الدورات الأكثر أهمية وإضافة اسم الدورة والجهة المقدمة لها عندما تكون هذه المعلومات متوفرة.
</p>

<h3>أهمية اللغات في السيرة الذاتية</h3>

<p>
يمكن أن يكون قسم اللغات مهمًا للعديد من الوظائف، خصوصًا الوظائف التي تتطلب التواصل مع العملاء أو التعامل مع شركات دولية أو العمل في بيئات متعددة اللغات. من الأفضل كتابة اللغة ومستوى الإتقان بطريقة واضحة مثل اللغة الأم أو ممتاز أو جيد جدًا أو جيد، أو استخدام وصف أكثر تحديدًا عندما يكون ذلك مناسبًا.
</p>

<p>
يجب أن يعكس مستوى اللغة الموجود في السيرة الذاتية المستوى الحقيقي للمتقدم، لأن المبالغة في مستوى اللغة قد تسبب مشكلة أثناء المقابلة أو اختبار اللغة.
</p>

<h3>هل التصميم الإبداعي أهم من محتوى السيرة الذاتية؟</h3>

<p>
رغم أهمية التصميم، إلا أن التصميم وحده لا يجعل السيرة الذاتية قوية. الهدف من قالب Creative هو تحسين طريقة عرض المعلومات وليس استبدال المحتوى المهني. يجب أن تكون الخبرات والمهارات والتعليم والدورات والمعلومات الشخصية دقيقة وواضحة.
</p>

<p>
يمكن أن يكون لديك تصميم ممتاز، لكن إذا كان المحتوى غير منظم أو يحتوي على أخطاء لغوية أو معلومات غير مرتبطة بالوظيفة، فلن يكون التصميم كافيًا. لذلك يجب الاهتمام بالمحتوى والتنسيق معًا.
</p>

<h3>متى يفضل استخدام قالب Creative؟</h3>

<p>
يمكن استخدام القالب الإبداعي عندما يكون المظهر البصري للسيرة الذاتية مناسبًا لطبيعة الوظيفة وثقافة الشركة. وهو خيار جيد بشكل خاص للوظائف التي يكون فيها الإبداع أو التواصل البصري أو صناعة المحتوى جزءًا من العمل.
</p>

<p>
أما في الوظائف التي تتطلب تنسيقًا تقليديًا جدًا أو في بعض الجهات التي تعتمد بشكل كبير على أنظمة التوظيف الإلكترونية، فقد يكون من الأفضل استخدام قالب أكثر بساطة مثل قالب ATS. لذلك يجب على الباحث عن عمل اختيار القالب بناءً على طبيعة الوظيفة وليس على الشكل فقط.
</p>

<h3>أخطاء يجب تجنبها عند استخدام القالب الإبداعي</h3>

<p>
من الأخطاء استخدام عدد كبير جدًا من الألوان أو العناصر البصرية التي تجعل السيرة الذاتية مزدحمة. كما يجب تجنب استخدام خطوط صغيرة جدًا أو ألوان منخفضة التباين تجعل النص صعب القراءة.
</p>

<p>
من الأفضل أيضًا عدم إضافة صور أو رموز أو معلومات شخصية غير ضرورية لمجرد جعل السيرة الذاتية أكثر إبداعًا. يجب أن يكون كل عنصر موجود في السيرة الذاتية له هدف واضح ويخدم تقديم الملف المهني للمتقدم.
</p>

<h3>نصائح لجعل السيرة الذاتية أكثر احترافية</h3>

<p>
ابدأ بتحديد الوظيفة التي تريد التقديم إليها، ثم راجع متطلباتها قبل كتابة السيرة الذاتية. اختر المهارات والخبرات الأكثر ارتباطًا بها، واكتب نبذة مهنية تناسب المجال، ثم رتب خبراتك بطريقة واضحة.
</p>

<p>
راجع السيرة الذاتية أكثر من مرة قبل إرسالها، وتأكد من صحة الاسم ورقم الهاتف والبريد الإلكتروني وروابط LinkedIn والموقع الشخصي. كما يجب مراجعة الأخطاء الإملائية والتأكد من أن التواريخ والمعلومات المهنية متناسقة.
</p>

<p>
إذا كنت تمتلك Portfolio أو نماذج أعمال، يمكن إضافة رابط الموقع الشخصي أو صفحة الأعمال عندما يكون ذلك مناسبًا. هذه الخطوة قد تكون مفيدة بشكل خاص للمصممين والمصورين وكتاب المحتوى والمطورين والمسوقين وغيرهم من أصحاب الأعمال التي يمكن عرضها بصريًا أو عبر الإنترنت.
</p>

<h3>أنشئ سيرتك الذاتية الإبداعية الآن</h3>

<p>
يتيح لك قالب السيرة الذاتية الإبداعي إنشاء CV منظم ومميز بطريقة سهلة. أدخل معلوماتك الشخصية، والمسمى الوظيفي، والملخص المهني، والخبرات، والتعليم، والمهارات، والدورات والشهادات واللغات، ثم اختر اللون الذي يناسبك.
</p>

<p>
بعد الانتهاء من إدخال البيانات، يمكنك معاينة السيرة الذاتية للتأكد من شكلها ومراجعة المعلومات قبل استخدامها في طلبات التوظيف. كما يمكنك تحميل السيرة الذاتية بصيغة PDF والاحتفاظ بها لاستخدامها عند التقديم على الوظائف المناسبة.
</p>

<p>
تذكر أن أفضل سيرة ذاتية هي التي تجمع بين التصميم المناسب والمحتوى المهني الحقيقي والواضح. استخدم قالب Creative لإظهار شخصيتك المهنية بطريقة أنيقة، ولكن اجعل خبرتك ومهاراتك وإنجازاتك هي العنصر الأساسي في السيرة الذاتية.
</p>
  </div>

</div>

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

  let browser;

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

    /* =========================
       PUPPETEER
    ========================= */

    const executablePath = await puppeteer.executablePath();

    console.log('===== CREATIVE PDF TEST =====');
    console.log('PUPPETEER EXECUTABLE:', executablePath);

    browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });

    const page = await browser.newPage();

    /* =========================
       PDF HTML
    ========================= */

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
            background: #ffffff;
            position: relative;
            overflow: hidden;
          }

          /* =========================
             HEADER
          ========================= */

          .header {
            width: 100%;
            min-height: 58mm;
            background: ${theme.primary};
            position: relative;
            overflow: hidden;
            color: #ffffff;
          }

          .circle-one {
            position: absolute;
            width: 70mm;
            height: 70mm;
            border-radius: 50%;
            background: ${theme.accent};
            opacity: .18;
            top: -38mm;
            left: -18mm;
          }

          .circle-two {
            position: absolute;
            width: 45mm;
            height: 45mm;
            border-radius: 50%;
            background: #ffffff;
            opacity: .07;
            bottom: -28mm;
            right: -12mm;
          }

          .header-content {
            position: relative;
            z-index: 2;
            padding: 12mm 13mm;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10mm;
          }

          .identity {
            display: flex;
            align-items: center;
            gap: 6mm;
            min-width: 0;
          }

          .avatar {
            width: 27mm;
            height: 27mm;
            min-width: 27mm;
            border-radius: 50%;
            background: ${theme.accent};
            border: 2mm solid rgba(255,255,255,.9);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 22px;
            font-weight: bold;
          }

          .name {
            font-size: 22px;
            line-height: 1.5;
            font-weight: bold;
            color: #ffffff;
          }

          .job-title {
            margin-top: 2mm;
            color: ${theme.light};
            font-size: 10px;
            font-weight: bold;
            line-height: 1.6;
          }

          .contact {
            width: 65mm;
            display: flex;
            flex-direction: column;
            gap: 2.2mm;
            font-size: 7.8px;
            line-height: 1.6;
            color: #f8fafc;
            word-break: break-word;
          }

          /* =========================
             CONTENT
          ========================= */

          .content {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            width: 100%;
            min-height: 239mm;
          }

          .main {
            width: 137mm;
            padding: 10mm 10mm 12mm 12mm;
            background: #ffffff;
          }

          .side {
            width: 73mm;
            min-height: 239mm;
            padding: 10mm 9mm;
            background: ${theme.light};
            border-right: 1px solid ${theme.border};
          }

          .section {
            margin-bottom: 7mm;
          }

          .section-head {
            display: flex;
            align-items: center;
            gap: 3mm;
            margin-bottom: 3.5mm;
          }

          .section-mark {
            width: 10mm;
            height: 1.5mm;
            background: ${theme.accent};
            border-radius: 2mm;
            flex-shrink: 0;
          }

          .section-title {
            font-size: 12.5px;
            font-weight: bold;
            color: ${theme.primary};
          }

          .text {
            font-size: 8.5px;
            line-height: 1.9;
            color: #475569;
            white-space: pre-line;
          }

          /* =========================
             EXPERIENCE / EDUCATION
          ========================= */

          .item {
            border-right: 1.2mm solid ${theme.accent};
            padding-right: 4mm;
            margin-bottom: 2mm;
          }

          .item-title {
            font-size: 10.5px;
            font-weight: bold;
            color: #1e293b;
            line-height: 1.6;
          }

          .company {
            color: ${theme.accent};
            font-size: 8.8px;
            font-weight: bold;
            margin-top: 1mm;
          }

          .date {
            color: #94a3b8;
            font-size: 7px;
            margin-top: 1mm;
          }

          /* =========================
             SIDE
          ========================= */

          .side-title {
            font-size: 10px;
            font-weight: bold;
            color: ${theme.primary};
            padding-bottom: 2mm;
            margin-bottom: 3mm;
            border-bottom: 1px solid ${theme.border};
          }

          .side-text {
            font-size: 7.8px;
            line-height: 1.9;
            color: #475569;
            white-space: pre-line;
            word-break: break-word;
          }

          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 2mm;
          }

          .skill {
            background: #ffffff;
            border: .35mm solid ${theme.border};
            color: ${theme.text};
            padding: 1.5mm 2.5mm;
            border-radius: 2mm;
            font-size: 7.5px;
            font-weight: bold;
          }

        </style>

      </head>

      <body>

        <div class="cv">

          <!-- HEADER -->

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
                  <span>
                    📍 ${data.country || ''}${data.city ? ' - ' + data.city : ''}
                  </span>
                ` : ''}

                ${data.phone ? `
                  <span>☎ ${data.phone}</span>
                ` : ''}

                ${data.email ? `
                  <span>✉ ${data.email}</span>
                ` : ''}

                ${data.linkedin ? `
                  <span>LinkedIn: ${data.linkedin}</span>
                ` : ''}

                ${data.website ? `
                  <span>🌐 ${data.website}</span>
                ` : ''}

              </div>

            </div>

          </header>


          <!-- CONTENT -->

          <div class="content">

            <!-- MAIN -->

            <main class="main">

              ${data.summary ? `
                <section class="section">

                  <div class="section-head">
                    <div class="section-mark"></div>
                    <div class="section-title">
                      نبذة مهنية
                    </div>
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
                    <div class="section-title">
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
                        ${data.experienceEnd
                          ? ' - ' + data.experienceEnd
                          : ' - حتى الآن'}
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
                    <div class="section-title">
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

            </main>


            <!-- SIDE -->

            <aside class="side">

              ${data.skills ? `
                <section class="section">

                  <div class="side-title">
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
     waitUntil: 'load',
  timeout: 120000
    });


    /* =========================
       CREATE PDF
    ========================= */

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      }
    });


    await browser.close();
    browser = null;


    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="creative-cv.pdf"',
      'Content-Length': pdf.length
    });

    return res.send(pdf);


  } catch (error) {

    console.error('CREATIVE PDF ERROR:', error);

    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('BROWSER CLOSE ERROR:', closeError);
      }
    }

    return res.status(500).send('حدث خطأ أثناء إنشاء ملف PDF');

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
FREE COURSES
========================= */

app.get('/free-courses', (req, res) => {

  try {

   const mainPath = path.join(
  __dirname,
  'main.json'
);

const coursesPath = path.join(
  __dirname,
  'courses.json'
);


    const main = JSON.parse(
      fs.readFileSync(mainPath, 'utf8')
    );

    const courses = JSON.parse(
      fs.readFileSync(coursesPath, 'utf8')
    );


    const coursesHTML = courses.map(course => `

      <div style="
        margin-top:25px;
        padding:22px;
        border-radius:12px;
        background:#f7f7f7;
        border:1px solid #eee;
      ">

        <h3 style="
          font-size:22px;
          font-weight:900;
          margin-bottom:10px;
        ">
          ${course.title}
        </h3>

        <p style="
          color:#666;
          margin-bottom:10px;
        ">
          <strong>التخصص:</strong>
          ${course.category}
        </p>

        <p style="
          color:#666;
          margin-bottom:15px;
        ">
          <strong>المستوى:</strong>
          ${course.level}
        </p>

        <p style="
          line-height:2;
          margin-bottom:15px;
        ">
          ${course.description}
        </p>

        <h4 style="
          font-weight:900;
          margin-bottom:10px;
        ">
          ماذا ستستفيد من الدورة؟
        </h4>

        <ul style="
          line-height:2;
          margin-bottom:18px;
        ">
          ${course.benefits.map(
            benefit => `<li>${benefit}</li>`
          ).join('')}
        </ul>

        <div style="text-align:center">

       <a
  href="/free-courses/${course.slug}"
  class="sector-btn"
  style="
    text-decoration:none;
    display:inline-block;
  "
>
  عرض تفاصيل الدورة
</a>

        </div>

      </div>

    `).join('');


    const body = `

      <div class="page-container">

        <div class="post">

          <h1 style="
            font-size:32px;
            font-weight:900;
            text-align:center;
            margin-bottom:20px;
          ">
            ${main.title}
          </h1>


          <p style="
            font-size:17px;
            line-height:2.2;
            text-align:right;
          ">
            ${main.intro}
          </p>


          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              ${main.importance.title}
            </h2>

            <p style="line-height:2;">
              ${main.importance.content}
            </p>

          </div>


          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              ${main.categories.title}
            </h2>

            <p style="line-height:2;">
              ${main.categories.content}
            </p>

          </div>


          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              أهم الدورات المجانية المقترحة
            </h2>

            ${coursesHTML}

          </div>


          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              ${main.howToChoose.title}
            </h2>

            <p style="line-height:2;">
              ${main.howToChoose.content}
            </p>

          </div>


          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              ${main.tips.title}
            </h2>

            <p style="line-height:2;">
              ${main.tips.content}
            </p>

          </div>

        </div>

      </div>

    `;


    res.send(
      layout(
        main.title,
        body
      )
    );


 } catch (error) {

  console.error('FREE COURSES ERROR:', error);

  res.status(500).send(`
    <div style="direction:rtl;text-align:right;padding:30px;font-family:Arial;">
      <h2>حدث خطأ أثناء تحميل صفحة الدورات المجانية</h2>
      <p style="color:red;line-height:2;">
        ${error.message}
      </p>
    </div>
  `);

}

});


/* =========================
FREE COURSE DETAILS
========================= */

app.get('/free-courses/:slug', (req, res) => {

  try {

    const coursesPath = path.join(
      __dirname,
      'courses.json'
    );

    const courses = JSON.parse(
      fs.readFileSync(coursesPath, 'utf8')
    );

    const course = courses.find(
      item => item.slug === req.params.slug
    );

    if (!course) {
      return res.status(404).send(
        layout(
          'الدورة غير موجودة',
          `
          <div class="page-container">
            <div class="post">

              <h1 style="
                text-align:center;
                font-weight:900;
              ">
                الدورة غير موجودة
              </h1>

              <p style="
                text-align:center;
                line-height:2;
              ">
                عذرًا، لم نتمكن من العثور على الدورة المطلوبة.
              </p>

            </div>
          </div>
          `
        )
      );
    }


    const benefitsHTML = (course.benefits || [])
      .map(
        benefit => `<li>${benefit}</li>`
      )
      .join('');


    const body = `

      <div class="page-container">

        <div class="post">

          <h1 style="
            font-size:32px;
            font-weight:900;
            text-align:center;
            margin-bottom:20px;
          ">
            ${course.title}
          </h1>


          <p style="
            font-size:17px;
            line-height:2.2;
            text-align:right;
          ">
            ${course.description || ''}
          </p>


          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              معلومات عن الدورة
            </h2>

            <p style="line-height:2;">
              <strong>التخصص:</strong>
              ${course.category || 'غير محدد'}
            </p>

            <p style="line-height:2;">
              <strong>المستوى:</strong>
              ${course.level || 'مناسب للمبتدئين'}
            </p>

          </div>


          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              ماذا ستستفيد من الدورة؟
            </h2>

            <ul style="
              line-height:2;
            ">
              ${benefitsHTML}
            </ul>

          </div>


          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
            text-align:center;
          ">

            <h2 style="font-weight:900;">
              الوصول إلى الدورة
            </h2>

            <p style="
              line-height:2;
              margin-bottom:20px;
            ">
              يمكنك الانتقال إلى المصدر الرسمي للدورة والبدء
              في التعلم من خلال الرابط التالي.
            </p>

            <a
              href="${course.link}"
              target="_blank"
              rel="noopener noreferrer"
              class="sector-btn"
              style="
                text-decoration:none;
                display:inline-block;
              "
            >
              الانتقال إلى الدورة
            </a>

          </div>


          <div style="
            margin-top:30px;
            text-align:center;
          ">

            <a
              href="/free-courses"
              style="
                text-decoration:none;
                font-weight:900;
              "
            >
              ← العودة إلى جميع الدورات المجانية
            </a>

          </div>

        </div>

      </div>

    `;


    res.send(
      layout(
        course.title,
        body
      )
    );


  } catch (error) {

    console.error(
      'FREE COURSE DETAILS ERROR:',
      error
    );

    res.status(500).send(
      'حدث خطأ أثناء تحميل الدورة.'
    );

  }

});

/* =========================
PAID COURSES
========================= */

app.get('/paid-courses', (req, res) => {

  try {

    const paidCoursesPath = path.join(
      __dirname,
      'data',
      'paid-courses',
      'main.json'
    );

    const data = JSON.parse(
      fs.readFileSync(paidCoursesPath, 'utf8')
    );

    const courses = data.courses || [];

    const coursesHTML = courses.map(course => `

      <div style="
        margin-top:25px;
        padding:22px;
        border-radius:12px;
        background:#f7f7f7;
        border:1px solid #eee;
      ">

        <h3 style="
          font-size:22px;
          font-weight:900;
          margin-bottom:10px;
        ">
          ${course.title}
        </h3>

        ${course.category ? `
        <p style="
          color:#666;
          margin-bottom:10px;
        ">
          <strong>التخصص:</strong>
          ${course.category}
        </p>
        ` : ''}

        ${course.level ? `
        <p style="
          color:#666;
          margin-bottom:15px;
        ">
          <strong>المستوى:</strong>
          ${course.level}
        </p>
        ` : ''}

        ${course.description ? `
        <p style="
          line-height:2;
          margin-bottom:15px;
        ">
          ${course.description}
        </p>
        ` : ''}

        <div style="text-align:center">

          <a
            href="/paid-courses/${course.slug}"
            class="sector-btn"
            style="
              text-decoration:none;
              display:inline-block;
            "
          >
            عرض تفاصيل الدورة
          </a>

        </div>

      </div>

    `).join('');


    const body = `

      <div class="page-container">

        <div class="post">

          <h1 style="
            font-size:32px;
            font-weight:900;
            text-align:center;
            margin-bottom:20px;
          ">
            ${data.title}
          </h1>

          <p style="
            font-size:17px;
            line-height:2.2;
            text-align:right;
          ">
            ${data.intro || ''}
          </p>


          ${data.importance ? `
          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              ${data.importance.title}
            </h2>

            <p style="line-height:2;">
              ${data.importance.content}
            </p>

          </div>
          ` : ''}


          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              أهم الدورات المدفوعة المقترحة
            </h2>

            ${coursesHTML}

          </div>


          ${data.howToChoose ? `
          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              ${data.howToChoose.title}
            </h2>

            <p style="line-height:2;">
              ${data.howToChoose.content}
            </p>

          </div>
          ` : ''}


          ${data.tips ? `
          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              ${data.tips.title}
            </h2>

            <p style="line-height:2;">
              ${data.tips.content}
            </p>

          </div>
          ` : ''}

        </div>

      </div>

    `;


    res.send(
      layout(
        data.title,
        body
      )
    );


  } catch (error) {

    console.error(
      'PAID COURSES ERROR:',
      error
    );

    res.status(500).send(`
      <div style="
        direction:rtl;
        text-align:right;
        padding:30px;
        font-family:Arial;
      ">

        <h2>
          حدث خطأ أثناء تحميل صفحة الدورات المدفوعة
        </h2>

        <p style="
          color:red;
          line-height:2;
        ">
          ${error.message}
        </p>

      </div>
    `);

  }

});


/* =========================
PAID COURSE DETAILS
========================= */

app.get('/paid-courses/:slug', (req, res) => {

  try {

    const paidCoursesPath = path.join(
      __dirname,
      'data',
      'paid-courses',
      'main.json'
    );

    const data = JSON.parse(
      fs.readFileSync(paidCoursesPath, 'utf8')
    );

    const courses = data.courses || [];

    const course = courses.find(
      item => item.slug === req.params.slug
    );


    if (!course) {

      return res.status(404).send(
        layout(
          'الدورة غير موجودة',
          `
          <div class="page-container">

            <div class="post">

              <h1 style="
                text-align:center;
                font-weight:900;
              ">
                الدورة غير موجودة
              </h1>

              <p style="
                text-align:center;
                line-height:2;
              ">
                عذرًا، لم نتمكن من العثور على الدورة المطلوبة.
              </p>

            </div>

          </div>
          `
        )
      );

    }


    const benefitsHTML = (course.benefits || [])
      .map(
        benefit => `<li>${benefit}</li>`
      )
      .join('');


    const body = `

      <div class="page-container">

        <div class="post">

          <h1 style="
            font-size:32px;
            font-weight:900;
            text-align:center;
            margin-bottom:20px;
          ">
            ${course.title}
          </h1>


          <p style="
            font-size:17px;
            line-height:2.2;
            text-align:right;
          ">
            ${course.description || ''}
          </p>


          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              معلومات عن الدورة
            </h2>

            <p style="line-height:2;">
              <strong>التخصص:</strong>
              ${course.category || 'غير محدد'}
            </p>

            <p style="line-height:2;">
              <strong>المستوى:</strong>
              ${course.level || 'مناسب للمبتدئين'}
            </p>

            ${course.provider ? `
            <p style="line-height:2;">
              <strong>المنصة:</strong>
              ${course.provider}
            </p>
            ` : ''}

            ${course.price ? `
            <p style="line-height:2;">
              <strong>السعر:</strong>
              ${course.price}
            </p>
            ` : ''}

          </div>


          ${benefitsHTML ? `
          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
          ">

            <h2 style="font-weight:900;">
              ماذا ستستفيد من الدورة؟
            </h2>

            <ul style="line-height:2;">
              ${benefitsHTML}
            </ul>

          </div>
          ` : ''}


          <div style="
            margin-top:30px;
            padding:20px;
            border-radius:12px;
            background:#f7f7f7;
            text-align:center;
          ">

            <h2 style="font-weight:900;">
              التسجيل في الدورة
            </h2>

            <p style="
              line-height:2;
              margin-bottom:20px;
            ">
              يمكنك الانتقال إلى الموقع الرسمي للمنصة
              والاطلاع على تفاصيل الدورة والتسجيل فيها.
            </p>

            <a
              href="${course.link}"
              target="_blank"
              rel="noopener noreferrer"
              class="sector-btn"
              style="
                text-decoration:none;
                display:inline-block;
              "
            >
              الانتقال إلى الدورة
            </a>

          </div>


          <div style="
            margin-top:30px;
            text-align:center;
          ">

            <a
              href="/paid-courses"
              style="
                text-decoration:none;
                font-weight:900;
              "
            >
              ← العودة إلى جميع الدورات المدفوعة
            </a>

          </div>

        </div>

      </div>

    `;


    res.send(
      layout(
        course.title,
        body
      )
    );


  } catch (error) {

    console.error(
      'PAID COURSE DETAILS ERROR:',
      error
    );

    res.status(500).send(
      'حدث خطأ أثناء تحميل الدورة.'
    );

  }

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
`${baseUrl}/free-courses`,
`${baseUrl}/paid-courses`,
    `${baseUrl}/terms`
  ];
// =========================
// PAID COURSES
// =========================

try {

  const paidCoursesPath = path.join(
    __dirname,
    'data',
    'paid-courses',
    'main.json'
  );

  const paidCoursesData = JSON.parse(
    fs.readFileSync(paidCoursesPath, 'utf8')
  );

  const paidCourses = paidCoursesData.courses || [];

  paidCourses.forEach(course => {

    if (course.slug) {

      urls.push(
        `${baseUrl}/paid-courses/${course.slug}`
      );

    }

  });

} catch (error) {

  console.log(
    'PAID COURSES SITEMAP ERROR:',
    error.message
  );

}
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