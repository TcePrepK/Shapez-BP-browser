const defsUrl = '/resource/buildingDefs.json';
const spriteDims = {
  normal: {
    size: 96,
    overlap: 5,
    realSize: 96 - 2 * 5,
    borderWidth: 6,
    gridWidth: 4,
    resizeSmooth: true,
    scaleBounds: {
      min: 0,
      preferMin: 0.25,
      max: 1
    }
  },
  minimap: {
    size: 3,
    overlap: 0,
    realSize: 3,
    borderWidth: 0,
    gridWidth: 0,
    resizeSmooth: false,
    scaleBounds: {
      min: 1,
      preferMin: 1,
      max: 16
    }
  }
};
const backgroundColors = {
  light: {
    background: '#ffffff',
    gridLines: '#fafafa',
    border: '#83d8ff',
    outOfBounds: '#f7f7ff'
  },
  dark: {
    background: '#3e3f47',
    gridLines: '#42434b',
    border: '#156abc',
    outOfBounds: '#292930'
  }
};
const blueprintMargin = 1;

var spritesheet, viewport, bpString;
const defsByCode = new Map();
const defsByName = new Map();

function init() {
  spritesheet = document.getElementById('sprites');
  viewport = document.getElementById('viewport');
  bpString = document.getElementById('blueprint-string').innerText;
  
  fetch(defsUrl).then(r => r.json()).then(ready);
}

function ready(json) {
  json.definitions.forEach(entry => {
    const building = new Building(entry);
    if(building.code !== -1) {
      defsByCode.set(building.code, building);
    }
    defsByName.set(building.internal, building);
  });
  
  const style = {mode: 'normal', theme: 'dark'};
  
  const bp = Blueprint.importShrimpBP(bpString);
  const stats = bp.stats;
  console.log(
    '%cBlueprint stats\n'
  + '%cDimensions: %c%s×%s\n'
  + '%cBelts:      %c%s\n'
  + '%cBuildings:  %c%s\n'
  + '%cMin. Level: %c%s',
    'font-weight: bold; font-size:20px;',
    'font-weight: bold; font-size:16px;',
    'font-size:16px;',
    stats.width,
    stats.height,
    'font-weight: bold; font-size:16px;',
    'font-size:16px;',
    stats.belts,
    'font-weight: bold; font-size:16px;',
    'font-size:16px;',
    stats.buildings,
    'font-weight: bold; font-size:16px;',
    'font-size:16px;',
    stats.minLevel
  );
  
  const render = renderBlueprint(bp, style);
  
  const mode = spriteDims[style.mode];
  
  viewport.width = viewport.clientWidth;
  viewport.height = viewport.clientHeight;
  
  const view = {
    x: 0,
    y: 0, 
    scale: clamp(
      Math.min(
        viewport.width / render.width,
        viewport.height / render.height
      ),
      mode.scaleBounds.preferMin,
      mode.scaleBounds.max
    ),
    minScale: clamp(
      Math.min(
        viewport.width / render.width,
        viewport.height / render.height
      ),
      mode.scaleBounds.min,
      mode.scaleBounds.max
    )
  };
  var lastPos = null;
  viewport.addEventListener('mousedown', e => {
    e.preventDefault();
    lastPos = {x: e.offsetX, y: e.offsetY};
  });
  viewport.addEventListener('mouseup', e => {
    lastPos = null;
  });
  viewport.addEventListener('mousemove', e => {
    if(lastPos) {
      const deltaX = 2 * (e.offsetX - lastPos.x) / render.width;
      const deltaY = 2 * (e.offsetY - lastPos.y) / render.height;
      lastPos = {x: e.offsetX, y: e.offsetY};
      
      view.x = clamp(view.x + deltaX / view.scale, -1, 1);
      view.y = clamp(view.y + deltaY / view.scale, -1, 1);
      
      redrawViewport(viewport, render, view, style);
    }
  });
  viewport.addEventListener('wheel',  e => {
    e.preventDefault();
    
    view.scale = clamp(view.scale * (1 - Math.sign(e.deltaY) / 5), view.minScale, mode.scaleBounds.max);
    redrawViewport(viewport, render, view, style);
  });
  new ResizeObserver(() => {
    const deltaWidth = viewport.clientWidth / viewport.width;
    const deltaHeight = viewport.clientHeight / viewport.height;
    
    viewport.width = viewport.clientWidth;
    viewport.height = viewport.clientHeight;
    
    view.minScale = clamp(
      Math.min(
        viewport.width / render.width,
        viewport.height / render.height
      ),
      mode.scaleBounds.min,
      mode.scaleBounds.max
    );
    view.scale = clamp(view.scale * deltaWidth * deltaHeight, view.minScale, mode.scaleBounds.max);
    
    redrawViewport(viewport, render, view, style);
  }).observe(viewport);
  
  redrawViewport(viewport, render, view, style);
  
  try {
    document.getElementById('copy-render').addEventListener('click', e => {
      render.toBlob(blob => {
        navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
      });
    });
  } catch(ex) {}
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function redrawViewport(viewport, render, view, style = {mode: 'normal', theme: 'dark'}) {
  const objCenterX = viewport.width / 2;
  const objCenterY = viewport.height / 2;
  
  const srcAdjWidth = render.width * view.scale;
  const srcAdjHeight = render.height * view.scale;
  
  const srcCenterX = srcAdjWidth / 2;
  const srcCenterY = srcAdjHeight / 2;
  
  const panOffsetX = srcAdjWidth * view.x / 2;
  const panOffsetY = srcAdjHeight * view.y / 2;
  
  const posX = objCenterX - srcCenterX + panOffsetX;
  const posY = objCenterY - srcCenterY + panOffsetY;
  
  const ctx = viewport.getContext('2d');
  if(style.theme) {
    ctx.fillStyle = backgroundColors[style.theme].outOfBounds;
    ctx.fillRect(0, 0, viewport.width, viewport.height);
  } else {
    ctx.clearRect(0, 0, viewport.width, viewport.height);
  }
  ctx.imageSmoothingEnabled = spriteDims[style.mode].resizeSmooth;
  ctx.drawImage(render, posX, posY, srcAdjWidth, srcAdjHeight);
}

function renderBlueprint(blueprint, style = {mode: 'normal', theme: 'dark'}) {
  const mode = spriteDims[style.mode];
  
  const pxWidth = mode.realSize * blueprint.width;
  const pxHeight = mode.realSize * blueprint.height;
  
  const canvas = document.createElement('canvas');
  canvas.width = pxWidth + 2 * mode.borderWidth;
  canvas.height = pxHeight + 2 * mode.borderWidth;
  const ctx = canvas.getContext('2d');
  
  if(style.theme) {
    ctx.fillStyle = backgroundColors[style.theme].border;
    ctx.fillRect(0, 0, pxWidth + 2 * mode.borderWidth, pxHeight + 2 * mode.borderWidth);
    
    ctx.fillStyle = backgroundColors[style.theme].background;
    ctx.fillRect(mode.borderWidth, mode.borderWidth, pxWidth, pxHeight);
    
    if(mode.gridWidth) {
      ctx.strokeStyle = backgroundColors[style.theme].gridLines;
      ctx.lineWidth = mode.gridWidth;
      
      for(let row = 1; row < blueprint.width; row++) {
        ctx.moveTo(
          mode.borderWidth + mode.realSize * row,
          mode.borderWidth);
        ctx.lineTo(
          mode.borderWidth + mode.realSize * row,
          mode.borderWidth + pxHeight);
      }
      for(let col = 1; col < blueprint.height; col++) {
        ctx.moveTo(
          mode.borderWidth,
          mode.borderWidth + mode.realSize * col);
        ctx.lineTo(
          mode.borderWidth + pxWidth,
          mode.borderWidth + mode.realSize * col);
      }
      
      ctx.stroke();
    }
  }
  
  blueprint.buildings.forEach(srcBuilding => {
    if(srcBuilding.type.internal.startsWith('belt')
    || srcBuilding.type.internal.startsWith('wire')) {
      drawSprite(ctx, mode, srcBuilding);
      return;
    }
    srcBuilding.type.links.forEach(srcLink => {
      if(!srcLink.draw) {
        return;
      }
      
      let linkX = srcBuilding.x;
      let linkY = srcBuilding.y;
      switch(srcBuilding.rotation) {
        case 0:
          linkX += srcLink.i;
          linkY -= srcLink.j;
          break;
        case 1:
          linkX += srcLink.j;
          linkY += srcLink.i;
          break;
        case 2:
          linkX -= srcLink.i;
          linkY += srcLink.j;
          break;
        case 3:
          linkX -= srcLink.j;
          linkY -= srcLink.i;
          break;
      }
      
      const selfFacing = (srcBuilding.rotation + srcLink.facing) % 4;
      
      let searchX = linkX;
      let searchY = linkY;
      switch(selfFacing) {
        case 0:
          searchY--;
          break;
        case 1:
          searchX++;
          break;
        case 2:
          searchY++;
          break;
        case 3:
          searchX--;
          break;
      }
      
      let inverseType;
      switch(srcLink.type) {
        case 'beltIn':
          inverseType = 'beltOut';
          break;
        case 'beltOut':
          inverseType = 'beltIn';
          break;
      }
      
      const atLocation = blueprint.buildings.filter(
        objBuilding => {
          return objBuilding.type.contains(
            objBuilding.rotation,
            searchX - objBuilding.x,
            searchY - objBuilding.y
          );
        }
      );
      
      const paired = atLocation.some(
        objBuilding => {
          const foundLinks = objBuilding.type.linksAt(
            objBuilding.rotation,
            searchX - objBuilding.x,
            searchY - objBuilding.y
          );
          
          return foundLinks.some(
            objLink => {
              return selfFacing === (objBuilding.rotation + objLink.facing + 2) % 4
                  && inverseType === objLink.type;
            }
          );
        }
      );
      
      if(paired) {
        drawSprite(
          ctx,
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
    
    drawSprite(ctx, mode, srcBuilding);
  });
  
  return canvas;
}
function drawSprite(ctx, mode, building) {
  const ctxX = mode.realSize * (building.x + 0.5) + mode.borderWidth;
  const ctxY = mode.realSize * (building.y + 0.5) + mode.borderWidth;
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