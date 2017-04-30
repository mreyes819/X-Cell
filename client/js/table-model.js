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
    // not implemented. See addColumn() in table-view.js
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
    // not implemented. See addRow() in table-view.js
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