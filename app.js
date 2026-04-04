const express = require('express');
const fs = require('fs');
const app = express();

const PORT = 3000;

// قراءة الوظائف من ملف JSON
function getJobs(sector) {
  const data = fs.readFileSync('jobs.json');
  const jobs = JSON.parse(data);
  return jobs.filter(job => job.sector === sector);
}

// الصفحة الرئيسية بالأيقونات بتصميم جذاب
app.get('/', (req, res) => {
  res.send(`
  <html>
  <head>
    <style>
      body {
        margin:0;
        font-family: Arial, sans-serif;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:flex-start;
        background-color:#f0f0f0;
      }
      .header {
        width:100%;
        background-color:black;
        color:white;
        padding:20px 0;
        text-align:center;
        font-size:28px;
        font-weight:bold;
        position:sticky;
        top:0;
        z-index:1000;
      }
      .icon-button {
        background:black;
        color:white;
        width:90%;
        max-width:400px;
        padding:30px;
        font-size:24px;
        text-align:center;
        margin:15px 0;
        border-radius:12px;
        text-decoration:none;
        display:block;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
      }
      .icon-button:hover {
        background: linear-gradient(90deg, #333, #555);
        transform: translateY(-3px);
        box-shadow: 0 6px 8px rgba(0,0,0,0.3);
      }
    </style>
  </head>
  <body>
    <div class="header">وظائف الوطن العربي</div>
    <a href="/jobs/health/page/1" class="icon-button">وظائف قطاع الصحة</a>
    <a href="/jobs/engineering/page/1" class="icon-button">وظائف قطاع الهندسة</a>
    <a href="/jobs/education/page/1" class="icon-button">وظائف قطاع التعليم</a>
    <a href="/jobs/management/page/1" class="icon-button">وظائف قطاع الإدارة والتكنولوجيا</a>
  </body>
  </html>
  `);
});

// صفحة قطاع مع تصميم احترافي و Pagination
app.get('/jobs/:sector/page/:page', (req, res) => {
  const sector = req.params.sector;
  const page = parseInt(req.params.page);
  const jobs = getJobs(sector);

  const perPage = 5;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedJobs = jobs.slice(start, end);

  const sectorNames = {
    health: "وظائف قطاع الصحة",
    engineering: "وظائف قطاع الهندسة",
    education: "وظائف قطاع التعليم",
    management: "وظائف قطاع الإدارة والتكنولوجيا"
  };
  const sectorTitle = sectorNames[sector] || "وظائف القطاع";

  let html = `
  <html>
  <head>
    <style>
      body {
        margin:0;
        font-family:Arial;
        display:flex;
        flex-direction:column;
        align-items:center;
        background-color:#f0f0f0;
        padding:20px;
      }
      .header {
        width:100%;
        background-color:black;
        color:white;
        padding:20px 0;
        text-align:center;
        font-size:28px;
        font-weight:bold;
        position:sticky;
        top:0;
        z-index:1000;
      }
      h1 {
        font-size:36px;
        text-align:center;
        margin-bottom:30px;
      }
      .job-card {
        background:white;
        width:90%;
        max-width:500px;
        padding:20px;
        margin:15px 0;
        border-radius:12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        text-align:center;
        transition: all 0.3s ease;
      }
      .job-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 8px rgba(0,0,0,0.3);
      }
      .job-card a {
        text-decoration:none;
        color:black;
        font-size:20px;
        font-weight:bold;
      }
      .pagination {
        margin-top:20px;
      }
      .pagination a {
        margin: 0 10px;
        text-decoration:none;
        color:white;
        background:black;
        padding:10px 20px;
        border-radius:5px;
        transition: all 0.3s ease;
      }
      .pagination a:hover {
        background:#333;
      }
    </style>
  </head>
  <body>
    <div class="header">وظائف الوطن العربي</div>
    <h1>${sectorTitle}</h1>
  `;

  paginatedJobs.forEach(job => {
    html += `<div class="job-card">
               <a href="/jobs/${sector}/job/${job.id}">${job.title}</a>
             </div>`;
  });

  // أزرار السابق / التالي
  html += `<div class="pagination">`;
  if (page > 1) html += `<a href="/jobs/${sector}/page/${page-1}">السابق</a>`;
  if (end < jobs.length) html += `<a href="/jobs/${sector}/page/${page+1}">التالي</a>`;
  html += `</div>`;

  html += `</body></html>`;

  res.send(html);
});

// صفحة تفاصيل وظيفة بتصميم احترافي
app.get('/jobs/:sector/job/:id', (req, res) => {
  const sector = req.params.sector;
  const id = parseInt(req.params.id);
  const jobs = getJobs(sector);
  const job = jobs.find(j => j.id === id);

  if (!job) return res.send('وظيفة غير موجودة');

  res.send(`
  <html>
  <head>
    <style>
      body {
        font-family:Arial;
        display:flex;
        flex-direction:column;
        align-items:center;
        padding:20px;
        background-color:#f0f0f0;
      }
      .header {
        width:100%;
        background-color:black;
        color:white;
        padding:20px 0;
        text-align:center;
        font-size:28px;
        font-weight:bold;
        position:sticky;
        top:0;
        z-index:1000;
      }
      .job-details {
        background:white;
        width:90%;
        max-width:500px;
        padding:20px;
        margin:30px 0;
        border-radius:12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        text-align:center;
      }
      .job-details h2 {
        font-size:28px;
        margin-bottom:15px;
      }
      .job-details p {
        font-size:18px;
        margin:10px 0;
      }
      .job-details a {
        color:black;
        font-weight:bold;
        text-decoration:none;
      }
    </style>
  </head>
  <body>
    <div class="header">وظائف الوطن العربي</div>
    <div class="job-details">
      <h2>${job.title}</h2>
      <p>${job.description}</p>
      <p>للتقديم مباشرة: <a href="mailto:${job.email}">${job.email}</a></p>
    </div>
  </body>
  </html>
  `);
});

app.listen(PORT, () => {
 console.log("Server running on http://localhost:" + PORT);
});