// Log out handler. Add an element with id="logout" to any page, then load this file
// AFTER the Supabase library and config.js:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.0/dist/umd/supabase.min.js"></script>
//   <script src="config.js"></script>
//   <script src="logout.js"></script>
(function () {
  const btn = document.getElementById('logout');
  if (!btn) return;
  btn.addEventListener('click', async function (e) {
    e.preventDefault();
    try { await sb.auth.signOut(); } catch (err) { console.error(err); }
    location.href = 'login.html';
  });
})();