const goalFocusDelay = 30000;
const nightModeStartHour = 21;
const nightModeEndHour = 6;

function isNightHour(hour) {
  return hour >= nightModeStartHour || hour < nightModeEndHour;
}

function matchesTopic(title, query) {
  return title.toLocaleLowerCase('uk').includes(query.trim().toLocaleLowerCase('uk'));
}

function createGoalAdviceModal() {
  if (document.querySelector('#goal-advice-modal')) return;

  const previouslyFocused = document.activeElement;
  const modal = document.createElement('div');
  modal.id = 'goal-advice-modal';
  modal.className = 'goal-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'goal-advice-title');
  modal.setAttribute('aria-describedby', 'goal-rules-description');
  modal.innerHTML = `
    <div class="goal-modal-content">
      <button class="goal-modal-close" type="button" aria-label="Закрити пораду">×</button>
      <p class="eyebrow">Корисна пам’ятка</p>
      <h2 id="goal-advice-title">Золоті правила навчання</h2>
      <div id="goal-rules-description">
        <ol>
          <li>Ставте одну конкретну й досяжну мету.</li>
          <li>Навчайтеся регулярно, навіть якщо маєте лише 15 хвилин.</li>
          <li>Практикуйте нові знання та щотижня перевіряйте свій прогрес.</li>
        </ol>
      </div>
    </div>`;

  const pageElements = [...document.body.children].filter((element) => element !== modal);
  const closeButton = modal.querySelector('.goal-modal-close');
  const closeModal = () => {
    document.body.classList.remove('modal-open');
    pageElements.forEach((element) => { element.inert = false; });
    document.removeEventListener('keydown', handleModalKeydown);
    modal.remove();
    if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
  };
  const handleModalKeydown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      closeButton.focus();
    }
  };

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.body.append(modal);
  document.body.classList.add('modal-open');
  pageElements.forEach((element) => { element.inert = true; });
  document.addEventListener('keydown', handleModalKeydown);
  closeButton.focus();
}

function initializeGoalFocusModal() {
  const purposeSection = document.querySelector('#purpose');
  if (!purposeSection) return;

  let timerId = null;
  const stopTimer = () => {
    window.clearTimeout(timerId);
    timerId = null;
  };
  const startTimer = () => {
    if (timerId !== null || sessionStorage.getItem('goalAdviceShown')) return;
    timerId = window.setTimeout(() => {
      sessionStorage.setItem('goalAdviceShown', 'true');
      createGoalAdviceModal();
      timerId = null;
    }, goalFocusDelay);
  };

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) startTimer();
    else stopTimer();
  }, { threshold: [0.6] });
  observer.observe(purposeSection);
}

function initializeNightMode() {
  if (!document.body.classList.contains('page-index')) return;

  const updateNightMode = () => {
    document.body.classList.toggle('night-mode', isNightHour(new Date().getHours()));
  };
  updateNightMode();
  window.setInterval(updateNightMode, 60000);
}

function initializeTopicSearch() {
  const topicsGrid = document.querySelector('.topics-grid');
  if (!topicsGrid) return;

  const search = document.querySelector('.topic-search') || document.createElement('div');
  search.className = 'topic-search';
  if (!search.querySelector('input')) search.innerHTML = `
    <label for="topic-search-input">Пошук теми за назвою</label>
    <input id="topic-search-input" type="search" placeholder="Наприклад, граматика" autocomplete="off">
    <p class="topic-search-result" aria-live="polite"></p>`;
  if (!search.isConnected) topicsGrid.before(search);

  const input = search.querySelector('input');
  const result = search.querySelector('.topic-search-result');
  const cards = [...topicsGrid.querySelectorAll('.topic-card')];
  const updateResults = () => {
    const query = input.value;
    let visibleCount = 0;
    cards.forEach((card) => {
      const title = card.querySelector('h2').textContent;
      const isVisible = matchesTopic(title, query);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });
    result.textContent = query.trim() ? `Знайдено тем: ${visibleCount}.` : `Усього тем: ${cards.length}.`;
  };
  input.addEventListener('input', updateResults);
  updateResults();
}

function initializeTopicsAccordion() {
  const cards = [...document.querySelectorAll('.topics-grid .topic-card')];
  if (!cards.length) return;

  const accordion = document.querySelector('.topics-accordion') || document.createElement('aside');
  accordion.className = 'topics-accordion';
  accordion.setAttribute('aria-label', 'Короткий опис навчальних тем');
  accordion.innerHTML = '<h2>Коротко про теми</h2>';

  cards.forEach((card, index) => {
    const title = card.querySelector('h2').textContent;
    const description = card.querySelector('p').textContent;
    const item = document.createElement('section');
    const contentId = `accordion-topic-${index + 1}`;
    item.className = 'accordion-item';
    item.innerHTML = `
      <button type="button" aria-expanded="false" aria-controls="${contentId}">${title}</button>
      <p id="${contentId}" hidden>${description}</p>`;
    item.querySelector('button').addEventListener('click', (event) => {
      const button = event.currentTarget;
      const content = item.querySelector('p');
      const willOpen = button.getAttribute('aria-expanded') === 'false';
      accordion.querySelectorAll('.accordion-item').forEach((otherItem) => {
        otherItem.querySelector('button').setAttribute('aria-expanded', 'false');
        otherItem.querySelector('p').hidden = true;
      });
      button.setAttribute('aria-expanded', String(willOpen));
      content.hidden = !willOpen;
      if (willOpen) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    accordion.append(item);
  });
  if (!accordion.isConnected) document.querySelector('.site-header').after(accordion);
}

function initializeFeedbackTooltip() {
  const detailsField = document.querySelector('#feedback-message');
  if (!detailsField) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'detail-field-wrap';
  detailsField.before(wrapper);
  wrapper.append(detailsField);

  const tooltip = document.createElement('span');
  tooltip.className = 'detail-tooltip';
  tooltip.id = 'feedback-details-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.textContent = 'Ваша думка для нас важлива! Конкретизуйте мету звернення, будь ласка.';
  wrapper.append(tooltip);
  detailsField.setAttribute('aria-describedby', tooltip.id);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeNightMode();
  initializeGoalFocusModal();
  initializeTopicSearch();
  initializeTopicsAccordion();
  initializeFeedbackTooltip();
});

window.lab4 = { isNightHour, matchesTopic };
