const fs = require('fs');
const TableModel = require('../table-model');
const TableView = require('../table-view');

describe('table-view', () => {

  beforeEach(() => {
    // load html skeleton from disk into the DOM
    const fixturePath = './client/js/test/fixtures/sheet-container.html';
    const html = fs.readFileSync(fixturePath, 'utf8');
    document.documentElement.innerHTML = html;
  });

  describe('formula bar', () => {
    it('makes changes TO the value of the current cell', () => {
      // set up the initial state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      view.init();

      // inspect the inital state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[0].cells[1];
      expect(td.textContent).toBe('');

      // simulate user action
      document.querySelector('#formula-bar').value = '65';
      view.handleFormulaBarChange();

      // inspect the resulting state
      trs = document.querySelectorAll('TBODY TR');
      expect(trs[0].cells[1].textContent).toBe('65');
    });


    it('updates FROM the value of the current cell', () => {
      // set up the initial value
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({ col: 2, row: 1 }, '123');
      view.init();

      //inspect the inital state
      const formulaBarEl = document.querySelector('#formula-bar')
      expect(formulaBarEl.value).toBe('');

      // simulate user action
      const trs = document.querySelectorAll('TBODY TR');
      trs[1].cells[2].click();

      // inspect the resulting state
      expect(formulaBarEl.value).toBe('123');
    });

  });

  describe('add row/column buttons', () => {
    it('adds a new row when add row button is clicked', () => {
      // set up the initial state
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init()

      // simulate user action
      document.getElementById('Add Row').click();
      // inspect the resulting state
      expect(model.numRows).toBe(6);
    });

    it('s add row button adds one row below the current row', () => {
      // set up the initial state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      let location_a = { col: 1, row: 0 };
      let location_b = { col: 2, row: 1 }
      model.setValue(location_a, 'A');
      model.setValue(location_b, 'B');
      view.init();

      // simulate user action
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[0].cells[0];
      td.click()
      document.getElementById('Add Row').click();

      // inspect the resulting state
      expect(model.getValue({ col: 2, row: 2 })).toBe('B');
    });

    it('adds a new column when add column button is clicked', () => {
      // set up the initial state
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init()
        // simulate user action
      document.getElementById('Add Column').click();
      // inspect the resulting state
      expect(model.numCols).toBe(6)
    });


    it('adds one column to the right of the current column', () => {
      // set up the inital state
      const numCols = 2;
      const numRows = 2;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      model.setValue({ col: 0, row: 0 }, 'A');
      model.setValue({ col: 0, row: 1 }, 'B');
      model.setValue({ col: 1, row: 0 }, 'C');
      model.setValue({ col: 1, row: 1 }, 'D');
      view.init();

      // inspect the inital state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[0].cells[1];
      expect(td.textContent).toBe('C');
      td = trs[1].cells[1];
      expect(td.textContent).toBe('D');

      // simulate user action
      let ths = document.querySelectorAll('THEAD TH');
      ths[0].click();
      document.getElementById('Add Column').click();

      // inspect the resulting state
      expect(model.getValue({ col: 2, row: 0 })).toBe('C')
      expect(model.getValue({ col: 2, row: 1 })).toBe('D')
    });
  });

  describe('table body', () => {

    it('highlights the current cell when clicked', () => {
      // set up the initial state
      const model = new TableModel(10, 5);
      const view = new TableView(model);
      view.init()

      // inspect the initial state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[2].cells[3];
      expect(td.className).toBe('');

      // simulate user action
      td.click();

      // inspect the resulting state
      trs = document.querySelectorAll('TBODY TR');
      td = trs[2].cells[3];
      expect(td.className).not.toBe('');
    });

    it('has the right size', () => {
      // set up the inital state
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      // inspect the initial state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length - 1).toBe(numCols);
    });

    it('fills in the values from the model', () => {
      // set up the inital state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({ col: 2, row: 1 }, '123');
      view.init();

      // inspect the intial state
      const trs = document.querySelectorAll('TBODY TR');
      expect(trs[1].cells[2].textContent).toBe('123');
    });

    it('highlights the current row when a row label cell is clicked', () => {
      // set up the initial state
      const model = new TableModel(5, 5);
      const view = new TableView(model);
      view.init()

      // inspect the initial state
      let trs = document.querySelectorAll('TBODY TR');
      let td = trs[2].cells[0];
      expect(td.className).toBe('');

      // simulate user action
      td.click();

      // inspect the resulting state
      trs = document.querySelectorAll('TBODY TR');
      td = trs[2].cells[0];
      expect(td.className).toBe('current-row');
      td = trs[2].cells[2];
      expect(td.className).toBe('current-row');
    });
  });

  describe('table header', () => {
    it('has valid column header labels', () => {
      // set up the inital state
      const numCols = 6;
      const numRows = 10;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      // inspect the inital state
      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length - 1).toBe(numCols);

      // inspect the resulting state
      let labelTexts = Array.from(ths).map(el => el.textContent);
      expect(labelTexts).toEqual(['', 'A', 'B', 'C', 'D', 'E', 'F'])
    });

    it('highlights the column when the column header is selected', () => {
      // set up the inital state
      const numCols = 5;
      const numRows = 5;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();

      // inspect the inital state
      let trs = document.querySelectorAll('TBODY TR');

      let td = trs[1].cells[1];
      expect(td.className).toBe('');
      td = trs[2].cells[1];
      expect(td.className).toBe('');

      // simulate user action
      let ths = document.querySelectorAll('THEAD TH');
      ths[1].click();

      // inspect the resulting state
      trs = document.querySelectorAll('TBODY TR');
      td = trs[1].cells[1];
      expect(td.className).toBe('current-col');
      td = trs[2].cells[1];
      expect(td.className).toBe('current-col');
    });
  });

  describe('table footer', () => {
    it('calculats the sum of a column', () => {
      // set up the inital state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({ col: 1, row: 0 }, 1);
      model.setValue({ col: 1, row: 2 }, 1);
      model.setValue({ col: 2, row: 1 }, -2);
      model.setValue({ col: 3, row: 0 }, 3);
      model.setValue({ col: 3, row: 2 }, -3);
      view.init();

      // inspect the inital state
      let ths = document.querySelectorAll('TFOOT TR');
      let columnSums = Array.from(ths).map(el => el.textContent);
      expect(columnSums).toEqual(['2-20'])
    })

    it('can calculate the sum of a columns numbers with strings', () => {
      // set up the inital state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({ col: 1, row: 0 }, 1);
      model.setValue({ col: 1, row: 2 }, 1);
      model.setValue({ col: 2, row: 0 }, 'apple');
      model.setValue({ col: 2, row: 1 }, -2);
      model.setValue({ col: 3, row: 0 }, 3);
      model.setValue({ col: 3, row: 2 }, -3);
      view.init();

      // inspect the inital state
      let ths = document.querySelectorAll('TFOOT TR');
      let columnSums = Array.from(ths).map(el => el.textContent);
      expect(columnSums).toEqual(['2-20'])
    })

    it('renders 0 when a column has numbers and sums to 0', () => {
      // set up the inital state
      const model = new TableModel(3, 3);
      const view = new TableView(model);
      model.setValue({ col: 1, row: 0 }, -1);
      model.setValue({ col: 1, row: 1 }, 'sauce');
      model.setValue({ col: 1, row: 2 }, 1);
      view.init();

      // inspect the inital state
      let ths = document.querySelectorAll('TFOOT TR');
      let columnSums = Array.from(ths).map(el => el.textContent);
      expect(columnSums).toEqual(['0'])
    })
  });

});
