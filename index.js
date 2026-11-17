
async function checkLogin() {
  try {
    const { data: { session }, error } =
      await sb.auth.getSession();

    if (error) {
      throw error;
    }

    if (session) {
      window.location.replace('/dashboard.html');
    } else {
      window.location.replace('/login.html');
    }

  } catch (error) {
    console.error('Authentication error:', error);

    document.querySelector('.loading-container p')
      .textContent =
      'Unable to verify login. Please refresh the page.';
  }
}

checkLogin();
