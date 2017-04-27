const removeChildren = function(parentEl) {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild);
  }
};

const createEl = function(tagName) {
  return function(text) {
    const el = document.createElement(tagName);
    if (text) {
      el.textContent = text;
    }
    return el;
  };
};

const createTR = createEl('TR');
const createTH = createEl('TH');
const createTD = createEl('TD');
const createTF = createEl('TF');

module.exports = {
  createTR: createTR,
  createTH: createTH,
  createTD: createTD,
  createTF: createTF,
  removeChildren: removeChildren
}