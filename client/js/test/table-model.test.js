const TabelModel = require('../table-model');

describe('tabel0model', () => {

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

})