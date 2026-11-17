const $ = id => document.getElementById(id);
let mode = 'login'; // login | signup | recovery

function msg(text, kind) { const m = $('msg'); m.textContent = text || ''; m.className = kind || ''; }

function setMode(m) {
  mode = m; msg('');
  const t = {
    login:    ['Log in to see your expenses.', 'Log in', 'No account?', 'Sign up'],
    signup:   ['Create an account to start tracking.', 'Sign up', 'Already registered?', 'Log in'],
    recovery: ['Choose a new password.', 'Save new password', '', '']
  }[m];
  $('sub').textContent = t[0]; $('submit').textContent = t[1];
  $('toggleText').textContent = t[2]; $('toggle').textContent = t[3];
  $('password').autocomplete = m === 'login' ? 'current-password' : 'new-password';
  $('email').closest('form').querySelector('label[for=email]').hidden = (m === 'recovery');
  $('email').hidden = (m === 'recovery'); $('email').required = (m !== 'recovery');
  $('toggle').parentElement.hidden = (m === 'recovery');
  $('forgot').hidden = (m === 'recovery');
}

$('toggle').onclick = () => setMode(mode === 'login' ? 'signup' : 'login');

$('forgot').onclick = async () => {
  const email = $('email').value.trim();
  if (!email) return msg('Type your email above first, then click "Forgot password?".', 'err');
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
  error ? msg(error.message, 'err') : msg('Check your email for a password reset link.', 'ok');
};

$('authForm').addEventListener('submit', async ev => {
  ev.preventDefault();
  const email = $('email').value.trim(), password = $('password').value;
  $('submit').disabled = true; msg('Please wait...');
  try {
    if (mode === 'login') {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      location.href = 'index.html';
    } else if (mode === 'signup') {
      const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } });
      if (error) throw error;
      if (data.session) location.href = 'index.html';
      else msg('Account created. Check your email to confirm it, then log in.', 'ok');
    } else {
      const { error } = await sb.auth.updateUser({ password });
      if (error) throw error;
      location.href = 'index.html';
    }
  } catch (e) {
    msg(e.message || 'Something went wrong.', 'err');
  } finally { $('submit').disabled = false; }
});

sb.auth.onAuthStateChange((event) => { if (event === 'PASSWORD_RECOVERY') setMode('recovery'); });
sb.auth.getSession().then(({ data }) => { if (data.session && mode !== 'recovery' && !location.hash.includes('type=recovery')) location.href = 'index.html'; });
