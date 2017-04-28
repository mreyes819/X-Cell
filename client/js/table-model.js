class TableModel {
  constructor(numCols=10, numRows=20) {
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

  getColumn(column) {
    let values = {};
    for (let r = 0; r < this.numRows; r++){
      const location = {col: column, row: r};
      const value = this.data[this._getCellId(location)];
      values[r] = value;
    }
    return values
  }

  getRow(row){
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