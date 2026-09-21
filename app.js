const storageKey = 'learnEarnUser';
const getUser = () => JSON.parse(localStorage.getItem(storageKey) || 'null');

function escapeHtml(value) {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

function renderAuthActions() {
  const user = getUser();
  document.querySelectorAll('[data-auth-actions]').forEach((container) => {
    container.innerHTML = user
      ? `<span class="user-greeting">Привіт, ${escapeHtml(user.name)}!</span><button class="logout-button" type="button">Вийти</button>`
      : '<a class="login-link" href="auth.html">Увійти</a><a class="button small-button" href="auth.html">Реєстрація</a>';
  });
  document.querySelectorAll('.logout-button').forEach((button) => button.addEventListener('click', () => {
    localStorage.removeItem(storageKey);
    window.location.href = 'index.html';
  }));
}

function showMessage(form, text, isError = false) {
  const message = form.closest('.auth-card, .form-card').querySelector('.form-message');
  message.textContent = text;
  message.classList.toggle('error', isError);
}

const gmailPattern = /^[^\s@]+@gmail\.com$/i;

function validateForm(form) {
  const emailInput = form.elements.email;

  form.querySelectorAll('input[type="text"], textarea').forEach((input) => {
    input.value = input.value.trim();
  });

  if (emailInput) {
    emailInput.value = emailInput.value.trim().toLowerCase();
    emailInput.setCustomValidity(gmailPattern.test(emailInput.value) ? '' : 'Використовуйте адресу Gmail у форматі name@gmail.com.');
  }

  return form.reportValidity();
}

document.addEventListener('DOMContentLoaded', () => {
  renderAuthActions();
  document.querySelector('#register-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validateForm(form)) return;
    const data = new FormData(form);
    localStorage.setItem(storageKey, JSON.stringify({ name: data.get('name'), email: data.get('email'), password: data.get('password') }));
    showMessage(form, 'Акаунт створено. Ви вже увійшли в систему.');
    form.reset();
    renderAuthActions();
  });
  document.querySelector('#login-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validateForm(form)) return;
    const data = new FormData(form);
    const user = getUser();
    if (!user || user.email !== data.get('email') || user.password !== data.get('password')) {
      showMessage(form, 'Перевірте e-mail і пароль або зареєструйтеся.', true);
      return;
    }
    showMessage(form, `Вітаємо, ${user.name}! Ви увійшли в систему.`);
    form.reset();
    renderAuthActions();
  });
  document.querySelector('#feedback-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!validateForm(form)) return;
    showMessage(form, 'Дякуємо! Ваше повідомлення надіслано.');
    form.reset();
  });
});
