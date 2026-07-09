const body = JSON.stringify({
  name: "Admin",
  email: "admin@scriptworldview.org",
  password: "SWF@admin2024",
  role: "super_admin"
});

fetch("https://script-worldview-api.scriptworldview-dev.workers.dev/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body
})
  .then(r => r.json())
  .then(d => console.log(JSON.stringify(d, null, 2)))
  .catch(e => console.error(e));
