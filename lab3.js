class UserRecord {
  constructor({ surname, name, age, email, feedbackGoal, date, time }) {
    Object.assign(this, { surname, name, age, email, feedbackGoal, date, time });
  }

  get fullName() { return `${this.surname} ${this.name}`; }
}

class SchoolBeforeAcademicYear extends UserRecord {}
class NonSchoolDuringSemester extends UserRecord {}
class OtherUser extends UserRecord {}

const initialTopics = [
  { id: 1, title: 'Vocabulary Basics', author: 'Олена Коваль', taskType: 'Картки', day1Readers: 48, day2Readers: 36, duration: 35 },
  { id: 2, title: 'Present Simple', author: 'Ігор Мельник', taskType: 'Тест', day1Readers: 55, day2Readers: 41, duration: 45 },
  { id: 3, title: 'Family and Friends', author: 'Анна Бойко', taskType: 'Відповідність', day1Readers: 31, day2Readers: 24, duration: 30 },
  { id: 4, title: 'Past Simple', author: 'Марія Ткач', taskType: 'Пропуски', day1Readers: 62, day2Readers: 47, duration: 55 },
  { id: 5, title: 'Travel English', author: 'Олег Савчук', taskType: 'Діалоги', day1Readers: 44, day2Readers: 29, duration: 50 },
  { id: 6, title: 'Listening Practice', author: 'Юлія Шевченко', taskType: 'Аудіювання', day1Readers: 38, day2Readers: 18, duration: 40 },
  { id: 7, title: 'Food and Shopping', author: 'Наталія Лисенко', taskType: 'Мінітест', day1Readers: 27, day2Readers: 15, duration: 25 },
  { id: 8, title: 'Writing an Email', author: 'Андрій Кравець', taskType: 'Письмова робота', day1Readers: 35, day2Readers: 22, duration: 60 },
  { id: 9, title: 'Pronunciation', author: 'Катерина Мороз', taskType: 'Повторення', day1Readers: 29, day2Readers: 20, duration: 20 },
  { id: 10, title: 'Job Interview', author: 'Віктор Романюк', taskType: 'Рольова гра', day1Readers: 51, day2Readers: 33, duration: 70 }
];

const initialUsers = [
  { surname: 'Бондар', name: 'Ірина', age: 15, email: 'iryna@gmail.com', feedbackGoal: 'Пропозиція', date: '2026-10-02', time: '09:15' },
  { surname: 'Гнатюк', name: 'Максим', age: 18, email: 'maksym@gmail.com', feedbackGoal: 'Співпраця', date: '2026-10-03', time: '13:40' },
  { surname: 'Дяченко', name: 'Ольга', age: 24, email: 'olha@gmail.com', feedbackGoal: 'Помилка', date: '2026-10-05', time: '16:10' },
  { surname: 'Коваль', name: 'Данило', age: 16, email: 'danylo@gmail.com', feedbackGoal: 'Пропозиція', date: '2026-10-07', time: '11:20' },
  { surname: 'Левченко', name: 'Софія', age: 17, email: 'sofia@gmail.com', feedbackGoal: 'Скарга', date: '2026-09-28', time: '12:05' },
  { surname: 'Мельник', name: 'Артем', age: 21, email: 'artem@gmail.com', feedbackGoal: 'Співпраця', date: '2026-10-09', time: '08:50' },
  { surname: 'Олійник', name: 'Віра', age: 32, email: 'vira@gmail.com', feedbackGoal: 'Пропозиція', date: '2026-10-11', time: '14:30' },
  { surname: 'Петренко', name: 'Назар', age: 14, email: 'nazar@gmail.com', feedbackGoal: 'Помилка', date: '2026-08-14', time: '10:00' },
  { surname: 'Савчук', name: 'Лілія', age: 19, email: 'liliia@gmail.com', feedbackGoal: 'Скарга', date: '2026-10-15', time: '12:45' },
  { surname: 'Яремчук', name: 'Богдан', age: 27, email: 'bohdan@gmail.com', feedbackGoal: 'Співпраця', date: '2026-10-18', time: '17:25' }
].map((user) => new UserRecord(user));

let topics = initialTopics.map((topic) => ({ ...topic }));
const users = initialUsers.map((user) => ({ ...user }));

function sortTopicsAndGetAverage(items) {
  const sortedTopics = items
    .map((topic) => ({ ...topic, averageReaders: (topic.day1Readers + topic.day2Readers) / 2 }))
    .sort((first, second) => first.duration - second.duration);
  const totalReaders = items.reduce((sum, topic) => sum + topic.day1Readers + topic.day2Readers, 0);
  return { sortedTopics, averageReaders: totalReaders / (items.length * 2) };
}

function findTopicWithMinimumDay2(items) {
  return items.reduce((minimum, topic) => topic.day2Readers < minimum.day2Readers ? topic : minimum);
}

function addTopic(items, topicData) {
  const requiredFields = ['title', 'author', 'taskType', 'day1Readers', 'day2Readers', 'duration'];
  const isComplete = requiredFields.every((field) => String(topicData[field] ?? '').trim() !== '');
  const newTopic = {
    id: Math.max(...items.map((topic) => topic.id), 0) + 1,
    title: String(topicData.title ?? '').trim() || 'Інформація відсутня',
    author: String(topicData.author ?? '').trim() || 'Інформація відсутня',
    taskType: String(topicData.taskType ?? '').trim() || 'Інформація відсутня',
    day1Readers: String(topicData.day1Readers ?? '').trim() === '' ? 0 : Number(topicData.day1Readers),
    day2Readers: String(topicData.day2Readers ?? '').trim() === '' ? 0 : Number(topicData.day2Readers),
    duration: String(topicData.duration ?? '').trim() === '' ? 0 : Number(topicData.duration)
  };
  if (!isComplete) return { topics: [newTopic, ...items], position: 0, isComplete: false };

  const result = [...items].sort((first, second) => first.author.localeCompare(second.author, 'uk'));
  const position = result.findIndex((topic) => topic.author.localeCompare(newTopic.author, 'uk') > 0);
  const insertionIndex = position === -1 ? result.length : position;
  result.splice(insertionIndex, 0, newTopic);
  return { topics: result, position: insertionIndex, isComplete: true };
}

function calculateStudyDuration(items, selectedIds) {
  const selected = items.filter((topic) => selectedIds.includes(topic.id));
  const multiplier = selected.length <= 3 ? 1 : 1.5;
  return selected.map((topic) => ({ ...topic, calculatedDuration: topic.duration * multiplier }));
}

function filterUsersByMonthAndTime(items, month, time) {
  return items.filter((user) => new Date(`${user.date}T00:00:00`).getMonth() === Number(month) && user.time === time);
}

function findYoungestUser(items) {
  return items.reduce((youngest, user) => user.age < youngest.age ? user : youngest);
}

function classifyUsers(items) {
  const classes = { school: [], university: [], other: [] };
  items.forEach((user) => {
    const appealMonth = new Date(`${user.date}T00:00:00`).getMonth();
    const isBeforeAcademicYear = appealMonth >= 5 && appealMonth < 8;
    const isDuringSemester = appealMonth >= 8 && appealMonth <= 11;
    if (user.age < 16 && isBeforeAcademicYear) classes.school.push(new SchoolBeforeAcademicYear(user));
    else if (user.age >= 16 && isDuringSemester) classes.university.push(new NonSchoolDuringSemester(user));
    else classes.other.push(new OtherUser(user));
  });
  return classes;
}

function sortUsersByEmailWithoutGoal(items) {
  return items.map((user) => {
    const copy = new UserRecord(user);
    delete copy.feedbackGoal;
    return copy;
  }).sort((first, second) => first.email.localeCompare(second.email, 'uk'));
}

function renderTopics(items = topics) {
  document.querySelector('#topics-body').innerHTML = items.map((topic) => `
    <tr><td><input class="topic-checkbox" type="checkbox" value="${topic.id}" aria-label="Обрати тему ${escapeHtml(topic.title)}"></td>
      <td>${topic.id}</td><td>${escapeHtml(topic.title)}</td><td>${escapeHtml(topic.author)}</td><td>${escapeHtml(topic.taskType)}</td>
      <td>${topic.day1Readers}</td><td>${topic.day2Readers}</td><td>${((topic.day1Readers + topic.day2Readers) / 2).toFixed(1)}</td><td>${topic.duration}</td></tr>`).join('');
}

function renderUsers(items = users, hideGoal = false) {
  document.querySelector('#users-body').innerHTML = items.map((user) => `
    <tr><td>${escapeHtml(`${user.surname} ${user.name}`)}</td><td>${user.age}</td><td>${escapeHtml(user.email)}</td>
      <td>${hideGoal ? 'Видалено' : escapeHtml(user.feedbackGoal)}</td><td>${user.date}</td><td>${user.time}</td></tr>`).join('');
}

function setSummary(selector, text) { document.querySelector(selector).textContent = text; }

function runTests() {
  const completeTopic = { title: 'Business English', author: 'Білик', taskType: 'Тест', day1Readers: 10, day2Readers: 8, duration: 32 };
  const incompleteFields = ['title', 'author', 'taskType', 'day1Readers', 'day2Readers', 'duration'];
  const tests = [
    ['Створено рівно 10 записів тем з усіма полями', () => initialTopics.length === 10 && initialTopics.every((topic) => Object.keys(topic).length === 7)],
    ['Теми сортуються за зростанням тривалості без зміни початкового масиву', () => {
      const originalFirstId = initialTopics[0].id;
      const result = sortTopicsAndGetAverage(initialTopics);
      return result.sortedTopics.every((topic, index) => index === 0 || result.sortedTopics[index - 1].duration <= topic.duration)
        && initialTopics[0].id === originalFirstId;
    }],
    ['Середнє для кожної теми та загальне середнє обчислюються правильно', () => {
      const result = sortTopicsAndGetAverage(initialTopics);
      const firstTopic = result.sortedTopics.find((topic) => topic.id === 1);
      return firstTopic.averageReaders === 42 && result.averageReaders === 35.25;
    }],
    ['Мінімум за добу 2 містить правильні ID, назву та кількість', () => {
      const topic = findTopicWithMinimumDay2(initialTopics);
      return topic.id === 7 && topic.title === 'Food and Shopping' && topic.day2Readers === 15;
    }],
    ['Порожнє або заповнене пробілами поле додає тему на початок', () => incompleteFields.every((field) => {
      const data = { ...completeTopic, [field]: field === 'title' ? '   ' : '' };
      const result = addTopic(initialTopics, data);
      return result.position === 0 && result.isComplete === false && result.topics[0].id === 11;
    })],
    ['Повна тема вставляється до списку за автором', () => {
      const result = addTopic(initialTopics, completeTopic);
      return result.isComplete && result.topics[result.position].author === completeTopic.author
        && result.topics.every((topic, index) => index === 0 || result.topics[index - 1].author.localeCompare(topic.author, 'uk') <= 0);
    }],
    ['Для однієї теми тривалість не змінюється', () => calculateStudyDuration(initialTopics, [1])[0].calculatedDuration === 35],
    ['Для двох тем тривалість не змінюється', () => calculateStudyDuration(initialTopics, [1, 2])[1].calculatedDuration === 45],
    ['Для трьох тем тривалість не змінюється', () => calculateStudyDuration(initialTopics, [1, 2, 3])[2].calculatedDuration === 30],
    ['Для чотирьох тем тривалість кожної зростає в 1,5 раза', () => calculateStudyDuration(initialTopics, [1, 2, 3, 4]).every((topic) => topic.calculatedDuration === topic.duration * 1.5)],
    ['Без вибраних тем повертається порожній результат', () => calculateStudyDuration(initialTopics, []).length === 0],
    ['Створено рівно 10 облікових записів користувачів', () => initialUsers.length === 10 && initialUsers.every((user) => Object.keys(user).length === 7)],
    ['Фільтр повертає користувача за місяцем і точним часом', () => {
      const result = filterUsersByMonthAndTime(initialUsers, 9, '13:40');
      return result.length === 1 && result[0].email === 'maksym@gmail.com';
    }],
    ['Знаходиться наймолодший користувач з E-mail і датою', () => {
      const user = findYoungestUser(initialUsers);
      return user.age === 14 && user.email === 'nazar@gmail.com' && user.date === '2026-08-14';
    }],
    ['Користувачі розподіляються на три ООП-класи за віком і датою', () => {
      const result = classifyUsers(initialUsers);
      return result.school.length === 1 && result.university.length === 8 && result.other.length === 1
        && result.school[0] instanceof SchoolBeforeAcademicYear
        && result.university.every((user) => user instanceof NonSchoolDuringSemester)
        && result.other[0] instanceof OtherUser;
    }],
    ['E-mail сортуються, мета видаляється лише з копій', () => {
      const result = sortUsersByEmailWithoutGoal(initialUsers);
      return result[0].email === 'artem@gmail.com'
        && result.every((user, index) => index === 0 || result[index - 1].email.localeCompare(user.email, 'uk') <= 0)
        && result.every((user) => !Object.hasOwn(user, 'feedbackGoal'))
        && initialUsers.every((user) => Object.hasOwn(user, 'feedbackGoal'));
    }]
  ];
  const results = tests.map(([name, test]) => {
    try { return { name, passed: Boolean(test()) }; }
    catch (error) { return { name: `${name}: ${error.message}`, passed: false }; }
  });
  return results;
}

document.addEventListener('DOMContentLoaded', () => {
  renderTopics();
  renderUsers();
  document.querySelector('#sort-topics').addEventListener('click', () => {
    const result = sortTopicsAndGetAverage(topics);
    topics = result.sortedTopics;
    renderTopics();
    setSummary('#topics-summary', `Теми впорядковано. Середня кількість читачів за одну добу: ${result.averageReaders.toFixed(1)}.`);
  });
  document.querySelector('#find-min-topic').addEventListener('click', () => {
    const topic = findTopicWithMinimumDay2(topics);
    setSummary('#topics-summary', `Мінімум за добу 2: ID ${topic.id}, «${topic.title}» — ${topic.day2Readers} користувачів.`);
  });
  document.querySelector('#topic-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const result = addTopic(topics, Object.fromEntries(new FormData(form)));
    topics = result.topics;
    renderTopics();
    const message = form.querySelector('.form-message');
    message.textContent = result.isComplete ? `Тему додано на позицію ${result.position + 1} у списку, впорядкованому за автором.` : 'Не всі дані заповнено, тому тему додано на початок списку.';
    message.classList.remove('error');
    form.reset();
  });
  document.querySelector('#calculate-duration').addEventListener('click', () => {
    const selectedIds = [...document.querySelectorAll('.topic-checkbox:checked')].map((checkbox) => Number(checkbox.value));
    const result = calculateStudyDuration(topics, selectedIds);
    setSummary('#topics-summary', result.length ? result.map((topic) => `${topic.title}: ${topic.calculatedDuration} хв`).join('; ') : 'Оберіть щонайменше одну тему.');
  });
  document.querySelector('#user-filter-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = filterUsersByMonthAndTime(users, data.get('month'), data.get('time'));
    renderUsers(result);
    setSummary('#users-summary', `Знайдено користувачів: ${result.length}.`);
  });
  document.querySelector('#find-youngest').addEventListener('click', () => {
    const user = findYoungestUser(users);
    renderUsers([user]);
    setSummary('#users-summary', `Наймолодший: ${user.age} років; E-mail: ${user.email}; дата звернення: ${user.date}.`);
  });
  document.querySelector('#classify-users').addEventListener('click', () => {
    const classes = classifyUsers(users);
    renderUsers([...classes.school, ...classes.university, ...classes.other]);
    setSummary('#users-summary', `Школярі до початку навчального року: ${classes.school.length}; не школярі впродовж семестру: ${classes.university.length}; інші: ${classes.other.length}.`);
  });
  document.querySelector('#sort-user-emails').addEventListener('click', () => {
    const result = sortUsersByEmailWithoutGoal(users);
    renderUsers(result, true);
    setSummary('#users-summary', 'Користувачів упорядковано за E-mail, поле мети звернення видалено з результату.');
  });
  const testResults = runTests();
  console.info(`Тести лабораторної №3: ${testResults.filter((result) => result.passed).length}/${testResults.length}`);
});

window.lab3 = { sortTopicsAndGetAverage, findTopicWithMinimumDay2, addTopic, calculateStudyDuration, filterUsersByMonthAndTime, findYoungestUser, classifyUsers, sortUsersByEmailWithoutGoal };
