(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const TableModel = require('./table-model');
const TableView = require('./table-view')

const model = new TableModel();
const tableView = new TableView(model);
tableView.init();
},{"./table-model":4,"./table-view":5}],2:[function(require,module,exports){
const getRange = function(fromNum, toNum) {
  return Array.from({ length: toNum - fromNum + 1 },
    (unused, i) => i + fromNum);
};

const getLetterRange = function(firstLetter = 'A',
  numLetters) {
  const rangeStart = firstLetter.charCodeAt(0);
  const rangeEnd = rangeStart + numLetters - 1;

  return getRange(rangeStart, rangeEnd)
    .map(charCode => String.fromCharCode(charCode));
};

module.exports = {
  getRange: getRange,
  getLetterRange: getLetterRange
};
},{}],3:[function(require,module,exports){
const removeChildren = function(parentEl) {
  while (parentEl.firstChild) {
    parentEl.removeChild(parentEl.firstChild);
  }
};

const createEl = function(tagName) {
  return function(text) {
    const el = document.createElement(tagName);
    if (text || text == 0) {
      el.textContent = text;
    }
    return el;
  };
};

const createTR = createEl('TR');
const createTH = createEl('TH');
const createTD = createEl('TD');

module.exports = {
  createTR: createTR,
  createTH: createTH,
  createTD: createTD,
  removeChildren: removeChildren
}
},{}],4:[function(require,module,exports){
class TableModel {
  constructor(numCols=5, numRows=10) {
    this.numCols = numCols;
    this.numRows = numRows;
    this.data = {};
  }

  _getCellId(location) {
    return `${location.col}:${location.row}`;
  }

  getValue(location) {
    return this.data[this._getCellId(location)];
  }

  setValue(location, value) {
    this.data[this._getCellId(location)] = value;
  }

  shiftColumn(column){
    const values = getColumn(column)
    column = column + 1;
    for (var r = 0; r < values.length; r++){
      let location = { col: column, row: r }
      setValue(location, values[r])
    }
  }

  getColumn(column) {
    // echo
    let values = {};
    for (let r = 0; r < this.numRows; r++){
      const location = {col: column, row: r};
      const value = this.data[this._getCellId(location)];
      values[r] = value;
    }
    return values
  }

  shitRow(row){
    // similar to shift column
  }

  getRow(row){
    // echo
    let values = {};
    for(let c = 0; c < this.numCols; c++){
      const location = {col:c, row: row};
      const value = this.data[this._getCellId(location)];
      values[c] = value;
    }
    return values
  }

}

module.exports = TableModel;
},{}],5:[function(require,module,exports){
const { getLetterRange } = require('./array-util');
const { removeChildren, createTH, createTR, createTD } = require('./dom-util');

class TableView {

  // What's going on where

  constructor(model) {
    this.model = model;
  }

  init() {
    this.initDomReferences();
    this.initCurrentCell();
    this.renderTable();
    this.attachEventHandlers();
  }

  initDomReferences() {
    this.headerRowEl = document.querySelector('THEAD TR');
    this.sheetBodyEl = document.querySelector('TBODY');
    this.formulaBarEl = document.querySelector('#formula-bar');
    this.footSumRowEl = document.querySelector('TFOOT TR')
  }

  initCurrentCell() {
    this.currentCellLocation = { col: 1, row: 0 };
    this.renderFormulaBar();
  }

  isCurrentCell(col, row) {
    return this.currentCellLocation.row === row &&
           this.currentCellLocation.col === col;
  }

  // Rendering things

  normalizeValueForRendering(value) {
    return value || '';
  }

  renderFormulaBar() {
    const currentCellValue = this.model.getValue(this.currentCellLocation);
    this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
    this.formulaBarEl.focus();
  }

  renderTable() {
    this.renderTableHeader();
    this.renderTableBody();
    this.renderTableFoot();
  }

  renderTableHeader() {
    removeChildren(this.headerRowEl);

    // column for row labels
    this.headerRowEl.appendChild(createTH(''));

    // labels columns
    getLetterRange('A', this.model.numCols)
      .map(colLabel => createTH(colLabel))
      .forEach(th => this.headerRowEl.appendChild(th));

    // highlights columns
    const col = this.currentCellLocation.col
    const row = this.currentCellLocation.row
    if (col > 0 && row === -1){
      document.getElementsByTagName("TH")[col].className = 'current-col';
    }
  }

  renderTableBody() {
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < this.model.numRows; row++) {
      const tr = createTR();
      for (let col = 0; col < this.model.numCols + 1; col++) {
        const position = {col: col, row: row};
        const value = this.model.getValue(position);
        const td = createTD(value);

        if (this.isCurrentCell(col, row)) {
          td.className = 'current-cell';
        }
        if (this.isCurrentCell(0, row)){
          td.className = 'current-row';
        }
        if (this.isCurrentCell(col, -1) && col > 0){
          td.className = 'current-col';
        }
        if (col === 0) {
          td.id = row;
          td.innerHTML = row;
          td.align="center"
        }

        tr.appendChild(td)
      }
      fragment.appendChild(tr);
    }
    removeChildren(this.sheetBodyEl);

    this.sheetBodyEl.appendChild(fragment);
  }

  renderTableFoot() {
    removeChildren(this.footSumRowEl);
    // column for row labels
    this.footSumRowEl.appendChild(createTH(''));
    // columns for column sums
    this.calculateColumnSum()
      .map(colSum => createTD(colSum))
      .forEach(td => this.footSumRowEl.appendChild(td));
  }

  calculateColumnSum() {
    // I would like for this to be in a seperate JS file
    // with all other math operators but I digress
    let sums = [];
    for (var col = 1 ; col < this.model.numCols + 1; col++) {
      let column = this.model.getColumn(col)
      let total = null;
      for (var row in column){
        let value = parseInt(column[row]);
        if(!isNaN(value)){
          total += value;
        }
      }
      sums.push(total);
    }
    return sums
  }

  // Buttons and event stuff

  attachEventHandlers() {
    this.sheetBodyEl.addEventListener('click',
      this.handleSheetClick.bind(this));

    this.headerRowEl.addEventListener('click',
      this.handleColumnLableClick.bind(this));

    this.formulaBarEl.addEventListener('keyup',
      this.handleFormulaBarChange.bind(this));

    document.getElementById('Add Column')
      .addEventListener('click',
        this.addColumn.bind(this));

    document.getElementById('Add Row')
      .addEventListener('click',
        this.addRow.bind(this));
  }

  addColumn(event){
    this.model.numCols = this.model.numCols + 1;

    const col = this.currentCellLocation.col
    const row = this.currentCellLocation.row

    if (row === -1){
      // echo, !DRY
      // shifts column
      // would like to put this funtion into table-model "shiftColumn"
      for(var c = this.model.numCols - 1; c > col; c--) {
        const columnValues = this.model.getColumn(c);
        for(var r = 0; r < this.model.numRows; r++){
          let location = { col: c + 1, row: r };
          const value = columnValues[r]
          this.model.setValue(location, value);
        }
      }

      const columnValues = this.model.getColumn(col + 1);
      for (var r = 0; r < this.model.numRows; r++) {
        let location = { col: col + 1, row: r };
        this.model.setValue(location, null);
      }
    }

    this.renderTable();
  }

  addRow(event){
    this.model.numRows = this.model.numRows + 1;

    const col = this.currentCellLocation.col
    const row = this.currentCellLocation.row

    if (col === 0){
      // echo, !DRY
      // shifts row
      // would like to put this funtion into table-model "shiftRow"
      for(var r = this.model.numRows - 1; r > row; r--) {
        const rowValues = this.model.getRow(r);
        console.log(rowValues)
        for(var c = 0; c < this.model.numCols; c++){
          let location = { col: c, row: r + 1 };
          const value = rowValues[c]
          this.model.setValue(location, value);
        }
      }

      const rowValues = this.model.getRow(row + 1);
      for (var c = 0; c < this.model.numCols; c++) {
        let location = { col: c, row: row + 1 };
        this.model.setValue(location, null);
      }
    }

    this.renderTable();
  }

  handleFormulaBarChange(evt){
    const value = this.formulaBarEl.value;
    this.model.setValue(this.currentCellLocation, value);
    this.renderTableBody();
    this.renderTableFoot();
  }

  handleColumnLableClick(evt){
    const col = evt.target.cellIndex;
    const row = evt.target.parentElement.rowIndex - 1;
    this.currentCellLocation = { col: col, row: row };
    this.renderTableBody();
    this.renderTableHeader();


  }

  handleSheetClick(evt) {
    const col = evt.target.cellIndex;
    const row = evt.target.parentElement.rowIndex - 1;
    this.currentCellLocation = { col: col, row: row };
    this.renderTableBody();
    this.renderTableHeader();
    this.renderFormulaBar();
  }

}

module.exports = TableView;

},{"./array-util":2,"./dom-util":3}]},{},[1]);
