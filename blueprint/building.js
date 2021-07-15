const buildingDefs = require('./buildingDefs').definitions;

class Building {
  constructor(entry) {
    this.code = entry.code;
    this.internal = entry.internal;
    this.name = entry.name;
    this.width = entry.width;
    this.height = entry.height;
    this.links = entry.links;
    this.sprite = entry.sprite;
  }
  
  farCorner(rotation) {
    switch(rotation) {
      case 0: return {
        x: this.width - 1,
        y: this.height - 1
      };
      case 1: return {
        x: 1 - this.height,
        y: this.width - 1
      };
      case 2: return {
        x: 1 - this.width,
        y: 1 - this.height
      };
      case 3: return {
        x: this.height - 1,
        y: 1 - this.width
      };
    }
  }
}

const defsByCode = new Map();
const defsByName = new Map();

buildingDefs.forEach(entry => {
  const building = new Building(entry);
  if(building.code !== -1) {
    defsByCode.set(building.code, building);
  }
  defsByName.set(building.internal, building);
});

function byCode(code) {
  return defsByCode.get(code);
}
function byName(name) {
  return defsByName.get(name);
}

module.exports = {
  byCode,
  byName
};