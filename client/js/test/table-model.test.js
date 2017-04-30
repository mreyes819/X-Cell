const TabelModel = require('../table-model');

describe('tableModel', () => {

  it('can set then get a value', () => {
    // set up the initial state
    const model = new TabelModel();
    const location = { row: 3, col: 5};

    // inspect the initial state
    expect(model.getValue(location)).toBeUndefined();

    // execute code under test
    model.setValue(location, 'foo');

    // inspect the resulting state
    expect(model.getValue(location)).toBe('foo');
  });

  it('can get the values in a column', () => {
    const model = new TabelModel(2,2);
    model.setValue({ row: 0, col: 0}, 'foo');
    model.setValue({ row: 1, col: 0}, 'bar');
    model.setValue({ row: 0, col: 1}, 'aaa');
    model.setValue({ row: 1, col: 1}, 'bbb');

    expect(JSON.stringify(model.getColumn(0))).toBe(JSON.stringify({"0":"foo","1":"bar"}));
  });

  it('can get the values in a row', () => {
    const model = new TabelModel(2,2);
    model.setValue({ row: 0, col: 0}, 'foo');
    model.setValue({ row: 1, col: 0}, 'bar');
    model.setValue({ row: 0, col: 1}, 'aaa');
    model.setValue({ row: 1, col: 1}, 'bbb');

    expect(JSON.stringify(model.getRow(0))).toBe(JSON.stringify({"0":"foo","1":"aaa"}));
  });

})

