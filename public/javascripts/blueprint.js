const defsUrl = '/resource/buildingDefs.json';
const spriteDims = {
  normal: {
    size: 96,
    overlap: 6,
    realSize: 96 - 2 * 6,
    resizeSmooth: true,
    drawGrid: true
  },
  minimap: {
    size: 3,
    overlap: 0,
    realSize: 3,
    resizeSmooth: false,
    drawGrid: false
  }
};
const backgroundColors = {
  light: {
    background: '#ffffff',
    gridLines: '#fafafa',
    lineWidth: 3
  },
  dark: {
    background: '#3e3f47',
    gridLines: '#42434b',
    lineWidth: 3
  }
};
const blueprintMargin = 1;

const spritesheetId = 'sprites';
const canvasId = 'viewport';
const bpStringId = 'blueprint-string';

const defsByCode = new Map();
const defsByName = new Map();

fetch(defsUrl).then(r => r.json()).then(ready);
function ready(defs) {
  defs.forEach(entry => {
    const building = new Building(entry);
    if(building.code !== -1) {
      defsByCode.set(building.code, building);
    }
    defsByName.set(building.internal, building);
  });
}

var srcCtx;

function renderBlueprint(blueprint, style = {mode: 'normal', theme: 'dark'}) {
  const mode = spriteDims[style.mode];
  
  const pxWidth = mode.realSize * blueprint.width;
  const pxHeight = mode.realSize * blueprint.height;
  
  const canvas = document.createElement('canvas');
  canvas.width = pxWidth;
  canvas.height = pxHeight;
  srcCtx = canvas.getContext('2d');
  const spritesheet = document.getElementById('sprites');
  
  if(style.theme) {
    srcCtx.fillStyle = backgroundColors[style.theme].background;
    srcCtx.strokeStyle = backgroundColors[style.theme].gridLines;
    srcCtx.lineWidth = backgroundColors[style.theme].lineWidth;
    
    srcCtx.fillRect(0, 0, pxWidth, pxHeight);
    if(mode.drawGrid) {
      for(let row = 1; row < blueprint.width; row++) {
        srcCtx.moveTo(mode.realSize * row, 0);
        srcCtx.lineTo(mode.realSize * row, pxHeight);
      }
      for(let col = 1; col < blueprint.height; col++) {
        srcCtx.moveTo(0, mode.realSize * col);
        srcCtx.lineTo(pxWidth, mode.realSize * col);
      }
      
      srcCtx.stroke();
    }
  }
  
  blueprint.buildings.forEach(srcBuilding => {
    if(srcBuilding.type.internal.startsWith('belt')
    || srcBuilding.type.internal.startsWith('wire')) {
      drawSprite(srcCtx, spritesheet, mode, srcBuilding);
      return;
    }
    srcBuilding.type.links.forEach(srcLink => {
      if(!srcLink.draw) {
        return;
      }
      
      const selfFacing = (srcBuilding.rotation + srcLink.facing) % 4;
      
      let linkX = srcBuilding.x;
      let linkY = srcBuilding.y;
      let searchX = 0;
      let searchY = 0;
      switch(srcLink.facing) {
        case 0:
          linkX += srcLink.i;
          linkY -= srcLink.j;
          searchY--;
          break;
        case 1:
          linkX += srcLink.j;
          linkY += srcLink.i;
          searchX++;
          break;
        case 2:
          linkX -= srcLink.i;
          linkY += srcLink.j;
          searchY++;
          break;
        case 3:
          linkX -= srcLink.j;
          linkY -= srcLink.i;
          searchX--;
          break;
      }
      searchX += linkX;
      searchY += linkY;
      
      let inverseType;
      switch(srcLink.type) {
        case 'beltIn':
          inverse = 'beltOut';
          break;
        case 'beltOut':
          inverse = 'beltIn';
          break;
      }
      
      const paired = blueprint.filter(
        objBuilding => objBuilding.type.contains(
          objBuilding.rotation,
          searchX - objBuilding.x,
          searchY - objBuilding.y
        )
      ).some(
        objBuilding => objBuilding.type.linksAt(
          objBuilding.rotation,
          searchX - objBuilding.x,
          searchY - objBuilding.y
        ).some(
          objLink => selfFacing === (objBuilding.rotation + objLink.facing + 2) % 4
                  && objLink.type === inverseType
        )
      );
      if(paired) {
        drawSprite(
          srcCtx,
          spritesheet,
          mode,
          {
            type: Building.byName(srcLink.type),
            x: linkX,
            y: linkY,
            rotation: selfFacing
          }
        );
      }
    });
  });
  blueprint.buildings.forEach(srcBuilding => {
    if(srcBuilding.type.internal.startsWith('belt')
    || srcBuilding.type.internal.startsWith('wire')) {
      return;
    }
    
    drawSprite(srcCtx, spritesheet, mode, srcBuilding);
  });
}
function drawSprite(ctx, spritesheet, mode, building) {
  const ctxX = mode.realSize * (building.x + 0.5);
  const ctxY = mode.realSize * (building.y + 0.5);
  const ctxR = building.rotation * Math.PI / 2;
  
  ctx.translate(ctxX, ctxY);
  ctx.rotate(ctxR);
  
  ctx.drawImage(
    spritesheet,
    mode.size * building.type.sprite.x,
    mode.size * building.type.sprite.y,
    mode.size * building.type.width,
    mode.size * building.type.height,
    mode.realSize * -0.5 - mode.overlap * building.type.width,
    mode.realSize * -0.5 - mode.overlap * building.type.height,
    mode.size * building.type.width,
    mode.size * building.type.height
  );
  
  ctx.rotate(-ctxR);
  ctx.translate(-ctxX, -ctxY);
}

class Building {
  constructor(entry) {
    this.code = entry.code;
    this.internal = entry.internal;
    this.name = entry.name;
    this.level = entry.level;
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
  
  contains(rotation, relativeX, relativeY) {
    let corner = this.farCorner(rotation);
    if(corner.x < 0) {
      corner.x = -corner.x;
      relativeX = -relativeX;
    }
    if(corner.y < 0) {
      corner.y = -corner.y;
      relativeY = -relativeY;
    }
    return relativeX >= 0 && relativeX <= corner.x
        && relativeY >= 0 && relativeY <= corner.y;
  }
  linksAt(rotation, relativeX, relativeY) {
    let searchI, searchJ;
    switch(rotation) {
      case 0:
        searchI = relativeX;
        searchJ = relativeY;
        break;
      case 1:
        searchI = relativeY;
        searchJ = -relativeX;
        break;
      case 2:
        searchI = -relativeX;
        searchJ = -relativeY;
        break;
      case 3:
        searchI = -relativeY;
        searchJ = relativeX;
        break;
    }
    return this.links.filter(l => l.i === searchI && l.j === searchJ);
  }
  
  static byCode(code) {
    return defsByCode.get(code);
  }
  static byName(name) {
    return defsByName.get(name);
  }
}

class Blueprint {
  constructor(buildings) {
    this.buildings = buildings;
    
    const bounds = this.buildings.reduce((bounds, building) => {
      const corner = building.type.farCorner(building.rotation);
      bounds.minX = Math.min(bounds.minX, building.x, corner.x);
      bounds.minY = Math.min(bounds.minY, building.y, corner.y);
      bounds.maxX = Math.max(bounds.maxX, building.x, corner.x);
      bounds.maxY = Math.max(bounds.maxY, building.y, corner.y);
      return bounds;
    }, {
      minX: Number.MAX_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER
    });
    
    this.normalizeBounds(bounds);
  }
  
  trim() {
    const bounds = this.buildings.reduce((bounds, building) => {
      switch(building.type.internal) {
        case 'beltStraight':
        case 'wireGrStraight':
        case 'wireBlStraight':
          return bounds;
      }
      
      const corner = building.type.farCorner(building.rotation);
      bounds.minX = Math.min(bounds.minX, building.x, corner.x);
      bounds.minY = Math.min(bounds.minY, building.y, corner.y);
      bounds.maxX = Math.max(bounds.maxX, building.x, corner.x);
      bounds.maxY = Math.max(bounds.maxY, building.y, corner.y);
      return bounds;
    }, {
      minX: Number.MAX_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER
    });
    
    this.normalizeBounds(bounds);
  }
  rotate(rotation) {
    rotation = (rotation % 4 + 4) % 4;
    if(rotation % 2 === 1) {
      [this.width, this.height] = [this.height, this.width];
    }
    this.buildings.forEach((building) => {
      building.rotation = (building.rotation + rotation) % 4;
      switch(rotation) {
        case 0: return;
        case 1: 
          [building.x, building.y] = [
            this.width - building.y - 1,
            building.x
          ];
          return;
        case 2:
          building.x = this.width - building.x - 1;
          building.y = this.height - building.y - 1;
          return;
        case 3:
          [building.x, building.y] = [
            building.y,
            this.height - building.x - 1
          ];
          return;
      }
    });
  }
  normalizeBounds(bounds) {
    const offsetX = blueprintMargin - bounds.minX;
    const offsetY = blueprintMargin - bounds.minY;
    this.width = bounds.maxX - bounds.minX + 2 * blueprintMargin + 1;
    this.height = bounds.maxY - bounds.minY + 2 * blueprintMargin + 1;
    
    this.buildings = this.buildings.reduce((acc, building) => {
      building.x += offsetX;
      building.y += offsetY;
      
      if(building.x < 0 || building.x >= this.width) {
        return acc;
      }
      if(building.y < 0 || building.y >= this.height) {
        return acc;
      }
      acc.push(building);
      return acc;
    }, []);
  }
  
  get stats() {
    return this.buildings.reduce((acc, building) => {
      acc.minLevel = Math.max(acc.minLevel, building.type.level);
      if(building.type.internal.startsWith('belt')) {
        acc.belts++;
      } else {
        acc.buildings++;
      }
      return acc;
    }, {
      height: this.height - 2,
      width: this.width - 2,
      belts: 0,
      buildings: 0,
      minLevel: 0
    });
  }
  
  static importJSON(json) {
    const buildings = json.map((entry) => {
      let ret = {
        type: Building.byCode(entry.components.StaticMapEntity.code),
        x: entry.components.StaticMapEntity.origin.x,
        y: entry.components.StaticMapEntity.origin.y,
        rotation: entry.components.StaticMapEntity.rotation / 90,
        ogRotation: entry.components.StaticMapEntity.rotation / 90
      };
      if(ret.type.internal === 'constantSignal') {
        ret.meta = {
          type: entry.components.ConstantSignal.signal.$,
          data: entry.components.ConstantSignal.signal.data
        };
      }
      return ret;
    });
    return new Blueprint(buildings);
  }
  exportJSON() {
    const json = this.buildings.map((building) => {
      let ret = {
        components: {
          StaticMapEntity: {
            origin: {
              x: building.x - Math.floor(this.width / 2),
              y: building.y - Math.floor(this.height / 2)
            },
            rotation: building.rotation * 90,
            originalRotation: building.ogRotation * 90,
            code: building.type.code
          }
        }
      };
      if(building.type.internal === 'constantSignal') {
        ret.components.ConstantSignal = {
          signal: {
            $: building.meta.type,
            data: building.meta.data
          }
        };
      }
      return ret;
    });
    return json;
  }
  
  static importShrimpBP(shrimpBP) {
    return Blueprint.importJSON(
      JSON.parse(
        LZString.decompressFromEncodedURIComponent(shrimpBP)
      )
    );
  }
  exportShrimpBP() {
    return LZString.compressToEncodedURIComponent(
      JSON.stringify(
        this.exportJSON()
      )
    );
  }
}