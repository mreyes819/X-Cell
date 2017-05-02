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
      const model = new TableModel(3,3);
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
      model.setValue({col:2, row:1}, '123');
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

  describe('add row/column', () => {
    it('adds a new row when add row button is clicked', () => {
      const model = new TableModel(5,5);
      const view = new TableView(model);
      view.init()
      document.getElementById('Add Row').click();
      expect(model.numRows).toBe(6);

    });

    it('adds a new column when add column button is clicked', () => {
      const model = new TableModel(5,5);
      const view = new TableView(model);
      view.init()
      document.getElementById('Add Column').click();
      expect(model.numCols).toBe(6)
    });


    it('adds a new row when add row button is clicked below current row', () => {
      const model = new TableModel(4,4);
      const view = new TableView(model);
      view.init()
      model.setValue({col:1, row:0}, 'A');
      model.setValue({col:1, row:1}, 'B');
      model.setValue({col:2, row:0}, 'C');
      model.setValue({col:2, row:1}, 'D');

      // simulate user action
        // selects row header
        // clicks add row

      // inspect the resulting state
    });

    // it('adds a new coulmn when add coulmn button is clicked to the right of the current column', () => {
    // });

  });

  describe('table body', () => {

    it('highlights the current cell when clicked', () => {
      // set up the initial state
      const model = new TableModel(10,5);
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
      const model = new TableModel(3,3);
      const view = new TableView(model);
      model.setValue({col:2, row:1}, '123');
      view.init();

      // inspect the intial state
      const trs = document.querySelectorAll('TBODY TR');
      expect(trs[1].cells[2].textContent).toBe('123');
    });

    it('highlights the current row when a row label cell is clicked', () => {
      // set up the initial state
      const model = new TableModel(5,5);
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

      let labelTexts = Array.from(ths).map(el => el.textContent);
      expect(labelTexts).toEqual(['','A','B','C','D','E','F'])
    });

    // it('highlights the current column when a table header label cell is clicked', () => {
    //   // set up the initial state
    //   const model = new TableModel(5,5);
    //   const view = new TableView(model);
    //   view.init()

    //   // inspect the initial state
    //   let ths = document.querySelectorAll('THEAD TH');
    //   console.log(ths)
    //   console.log(ths[1].HTMLTableHeaderCellElement)
    //   ths[1].click();
    //   //let td = ths['0'];

    //   console.log(ths[1].HTMLTableHeaderCellElement)
    //   //expect(td.className).toBe('');
    //   // trs = document.querySelectorAll('TBODY TR');
    //   // td = trs[2].cells[3];
    //   // simulate user action
    //   //td.click();

    //   // inspect the resulting state
    //   // ths = document.querySelectorAll('THEAD TH');
    //   // td = ths[0].cells[3];
    //   // expect(td.className).not.toBe('');
    // });

  });

  describe('table footer', () => {
    it('calculats the sum of a column', () => {
      // set up the inital state
      const model = new TableModel(3,3);
      const view = new TableView(model);
      model.setValue({col:1, row:0}, 1);
      model.setValue({col:1, row:2}, 1);
      model.setValue({col:2, row:1}, -2);
      model.setValue({col:3, row:0}, 3);
      model.setValue({col:3, row:2}, -3);
      view.init();

      // inspect the inital state
      let ths = document.querySelectorAll('TFOOT TR');
      let columnSums = Array.from(ths).map(el => el.textContent);
      expect(columnSums).toEqual(['2-20'])
    })

    it('can calculate the sum of a columns numbers with strings', () => {
      // set up the inital state
      const model = new TableModel(3,3);
      const view = new TableView(model);
      model.setValue({col:1, row:0}, 1);
      model.setValue({col:1, row:2}, 1);
      model.setValue({col:2, row:0}, 'apple');
      model.setValue({col:2, row:1}, -2);
      model.setValue({col:3, row:0}, 3);
      model.setValue({col:3, row:2}, -3);
      view.init();

      // inspect the inital state
      let ths = document.querySelectorAll('TFOOT TR');
      let columnSums = Array.from(ths).map(el => el.textContent);
      expect(columnSums).toEqual(['2-20'])
    })


  });
});





