import { story } from './story-content.js';

const panel = document.getElementById('story-panel');
const content = document.getElementById('story-content');
const eyebrow = document.getElementById('eyebrow');
const progress = document.getElementById('progress');
const toast = document.getElementById('toast');

const state = {
  stage: 'cover',
  first: null,
  second: null,
};

let toastTimer;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function paragraphs(lines) {
  return `<div class="story-prose">${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>`;
}

function choices(options, action) {
  return `<div class="choices">${options.map((option) => `
    <button class="choice" type="button" data-action="${action}" data-choice="${option.id}">
      <span>
        <span class="choice__label">${escapeHtml(option.label)}</span>
        <span class="choice__detail">${escapeHtml(option.detail)}</span>
      </span>
      <span class="choice__glyph" aria-hidden="true">✧</span>
    </button>
  `).join('')}</div>`;
}

function coverMarkup() {
  return `
    <div class="scene-content">
      <span class="chapter-label">A little fiction</span>
      <h1 tabindex="-1">The Margins<br><em>Between Us</em></h1>
      <p class="hero-intro">A tiny story and one honest question.</p>
      <p class="body-copy">One bookshop. A note in a secondhand novel. Four possible endings. Yours takes about a minute.</p>
      <div class="action-row">
        <button class="button button--primary" type="button" data-action="begin">Open the book</button>
        <button class="button button--quiet" type="button" data-action="skip">Skip to the note</button>
      </div>
    </div>`;
}

function firstMarkup() {
  return `
    <div class="scene-content">
      <span class="chapter-label">Closing time</span>
      <h1 class="scene-title" tabindex="-1">The note in the margin</h1>
      ${paragraphs(story.opening)}
      <p class="story-prompt">${escapeHtml(story.firstPrompt)}</p>
      ${choices(story.firstChoices, 'choose-first')}
      <button class="sub-action" type="button" data-action="cover">Back to the cover</button>
    </div>`;
}

function secondMarkup() {
  const selected = story.firstChoices.find((choice) => choice.id === state.first);
  return `
    <div class="scene-content">
      <span class="chapter-label">${escapeHtml(selected?.label || 'The next page')}</span>
      <h1 class="scene-title" tabindex="-1">A little past closing</h1>
      ${paragraphs(story.bridges[state.first])}
      <p class="story-prompt">${escapeHtml(story.secondPrompt)}</p>
      ${choices(story.secondChoices, 'choose-second')}
      <button class="sub-action" type="button" data-action="back-first">Change my first choice</button>
    </div>`;
}

function invitationMarkup() {
  return `
    <aside class="invitation" aria-label="A note outside the story">
      <span class="invitation__eyebrow">Outside the story</span>
      <h2 class="invitation__title">One honest question</h2>
      <p>I made this because a person who loves fiction deserves a better opener than “hey.” I’d like to get to know you. If you’re comfortable, send me your Instagram on Hinge and tell me which ending you chose.</p>
    </aside>`;
}

function endingMarkup() {
  const ending = story.endings[`${state.first}-${state.second}`];
  return `
    <div class="scene-content">
      <span class="chapter-label">Your ending</span>
      <h1 class="scene-title" tabindex="-1">${escapeHtml(ending.title)}</h1>
      ${paragraphs(ending.paragraphs)}
      <div class="ending-decor" aria-hidden="true">✦</div>
      ${invitationMarkup()}
      <div class="ending-actions">
        <button class="button button--primary" type="button" data-action="copy">Copy my ending</button>
        <button class="button button--outline" type="button" data-action="replay">Read another ending</button>
      </div>
    </div>`;
}

function noteMarkup() {
  return `
    <div class="scene-content">
      <span class="chapter-label">No need to turn every page</span>
      <h1 class="scene-title" tabindex="-1">The note at the end</h1>
      <p class="body-copy">The story has four endings, but this part is the same in every one.</p>
      ${invitationMarkup()}
      <div class="ending-actions">
        <button class="button button--primary" type="button" data-action="begin">Read the story</button>
      </div>
    </div>`;
}

function render({ moveFocus = true } = {}) {
  document.body.dataset.stage = state.stage;

  const metadata = {
    cover: ['AN INTERACTIVE SHORT STORY', 'ABOUT ONE MINUTE'],
    first: ['CHAPTER ONE', 'THE FIRST CHOICE'],
    second: ['CHAPTER TWO', 'THE SECOND CHOICE'],
    ending: ['THE LAST PAGE', 'YOUR ENDING'],
    note: ['A NOTE FROM ME', 'THE HONEST QUESTION'],
  }[state.stage];

  eyebrow.textContent = metadata[0];
  progress.textContent = metadata[1];

  content.innerHTML = ({
    cover: coverMarkup,
    first: firstMarkup,
    second: secondMarkup,
    ending: endingMarkup,
    note: noteMarkup,
  })[state.stage]();

  if (moveFocus) {
    requestAnimationFrame(() => {
      content.querySelector('h1')?.focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 760px)').matches) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        panel.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'instant' : 'smooth' });
      }
    });
  }
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
}

async function copyEnding() {
  const ending = story.endings[`${state.first}-${state.second}`];
  const message = `I chose “${ending.title}” in The Margins Between Us.`;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
    } else {
      const temporary = document.createElement('textarea');
      temporary.value = message;
      temporary.style.position = 'fixed';
      temporary.style.opacity = '0';
      document.body.append(temporary);
      temporary.select();
      const copied = document.execCommand('copy');
      temporary.remove();
      if (!copied) throw new Error('Copy unavailable');
    }
    showToast('Ending copied. You can paste it into our Hinge chat.');
  } catch {
    showToast(`Your ending is “${ending.title}.” You can mention it in our Hinge chat.`);
  }
}

document.addEventListener('click', (event) => {
  const control = event.target.closest('[data-action]');
  if (!control) return;

  switch (control.dataset.action) {
    case 'begin':
    case 'replay':
      state.first = null;
      state.second = null;
      state.stage = 'first';
      break;
    case 'cover':
      state.stage = 'cover';
      break;
    case 'back-first':
      state.first = null;
      state.second = null;
      state.stage = 'first';
      break;
    case 'choose-first':
      if (!story.firstChoices.some((choice) => choice.id === control.dataset.choice)) return;
      state.first = control.dataset.choice;
      state.second = null;
      state.stage = 'second';
      break;
    case 'choose-second':
      if (!story.secondChoices.some((choice) => choice.id === control.dataset.choice)) return;
      state.second = control.dataset.choice;
      state.stage = 'ending';
      break;
    case 'skip':
      state.stage = 'note';
      break;
    case 'copy':
      copyEnding();
      return;
    default:
      return;
  }

  render();
});

render({ moveFocus: false });
