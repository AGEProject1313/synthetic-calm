document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  // Progress tracking: page opened
  if (window.setProgress && window.CASE_PROGRESS) {
    const path = window.location.pathname.toLowerCase();

    if (path.includes('/beacon/')) {
      setProgress(CASE_PROGRESS.BEACON_SITE_OPENED);
    }

    if (path.includes('archive.html')) {
      setProgress(CASE_PROGRESS.BEACON_ARCHIVE_OPENED);
    }

    if (path.includes('giulia-verra.html')) {
      setProgress(CASE_PROGRESS.BEACON_GIULIA_PROFILE_OPENED);
    }

    if (path.includes('synthetic-calm.html')) {
      setProgress(CASE_PROGRESS.SYNTHETIC_CALM_PAGE_OPENED);
    }
  }

  const form = document.querySelector('#draft-login');
  const panel = document.querySelector('#login-panel');
  const draft = document.querySelector('#draft-content');
  const error = document.querySelector('#login-error');

  if (!form || !panel || !draft) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();

    if (window.setProgress && window.CASE_PROGRESS) {
      setProgress(CASE_PROGRESS.SYNTHETIC_CALM_LOGIN_ATTEMPTED);
    }

    if (username === 'prova' && password === 'prova') {
      if (window.setProgress && window.CASE_PROGRESS) {
        setProgress(CASE_PROGRESS.SYNTHETIC_CALM_UNLOCKED);
        setProgress(CASE_PROGRESS.SYNTHETIC_CALM_DRAFT_REVIEWED);
      }

      panel.style.display = 'none';
      draft.classList.add('unlocked');

      if (!document.querySelector('.final-report-link')) {
        const link = document.createElement('a');
        link.href = '../FINAL-REPORT/';
        link.className = 'button final-report-link';
        link.textContent = 'Submit Final Case Report';
        draft.appendChild(link);
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      error.textContent = 'Invalid editorial credentials.';
    }
  });
});