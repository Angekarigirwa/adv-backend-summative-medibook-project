const locales = { en: require('../../locales/en.json'), fr: require('../../locales/fr.json') };
function feedback(req, res) {
  const lang = locales[req.query.lang] ? req.query.lang : 'en';
  const t = locales[lang];
  const today = new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(new Date());
  res.send(`<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"><title>${t.title}</title></head>
<body style="font-family: sans-serif; max-width: 700px; margin: 2em auto;">
<h1>${t.title}</h1><p>${t.instructions}</p><p><strong>${t.date}:</strong> ${today}</p>
<form method="post">
<label>1. ${t.q1}</label><br><textarea name="q1" style="width:100%; height:60px;"></textarea><br><br>
<label>2. ${t.q2}</label><br><textarea name="q2" style="width:100%; height:60px;"></textarea><br><br>
<label>3. ${t.q3}</label><br><textarea name="q3" style="width:100%; height:60px;"></textarea><br><br>
<label>4. ${t.q4}</label><br><textarea name="q4" style="width:100%; height:60px;"></textarea><br><br>
<label>5. ${t.q5}</label><br><textarea name="q5" style="width:100%; height:60px;"></textarea><br><br>
<button type="submit">${t.submit}</button></form></body></html>`);
}
module.exports = { feedback };
