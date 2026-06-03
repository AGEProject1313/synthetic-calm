document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#draft-login');
  const panel = document.querySelector('#login-panel');
  const draft = document.querySelector('#draft-content');
  const error = document.querySelector('#login-error');

  if (!form || !panel || !draft) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();

    if (username === 'prova' && password === 'prova') {
      panel.style.display = 'none';
      draft.classList.add('unlocked');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      error.textContent = 'Invalid editorial credentials.';
    }
  });
});
