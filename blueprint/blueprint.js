const { Buffer } = require('buffer');
const LZString = require('lz-string');

const Building = require('./building');

const MARGIN = 1;

const SIGNAL_COLORS = ['uncolored', 'blue', 'green', 'cyan', 'red', 'purple', 'yellow', 'white'];
const SIGNAL_SHAPES = [...'CRWS'];

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
    const offsetX = MARGIN - bounds.minX;
    const offsetY = MARGIN - bounds.minY;
    this.width = bounds.maxX - bounds.minX + 2 * MARGIN + 1;
    this.height = bounds.maxY - bounds.minY + 2 * MARGIN + 1;
    
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
  
  static importBinary(data) {
    let buildings = [];
    let offset = 0;
    while(offset < data.length) {
      let entry = {
        type: Building.byCode(data.readUInt8(offset)),
        x: data.readUInt16LE(offset + 1),
        y: data.readUInt16LE(offset + 3),
        rotation: data.readUInt8(offset + 5) >> 2 & 0x3,
        ogRotation: data.readUInt8(offset + 5) & 0x3
      };
      offset += 6;
      if(entry.type.internal === 'constantSignal') {
        let head = data.readUInt8(offset++);
        if((head & 0xFE) === 0x04) {
          // 0000 01xx = flag
          switch(head & 0x03) {
            case 3:
              entry.meta = {
                type: 'type',
                data: 'item'
              };
              break;
          }
        } else if((head & 0xFE) === 0x00) {
          // 0000 000x = boolean
          entry.meta = {
            type: 'boolean_item',
            data: head
          };
        } else if((head & 0xF8) === 0x08) {
          // 0000 1rgb = color
          entry.meta = {
            type: 'color',
            data: SIGNAL_COLORS[head & 0x07]
          };
        } else {
          // aaaa bbbb = layers 0 and 1
          head <<= 8;
          if(head & 0x0F00) {
            // cccc dddd = layers 2 and 3
            // only if layer 1 is non-empty
            head |= data.readUInt8(offset++);
          }
          
          let quads = new Array(16);
          let buf = 0, bits = 0;
          
          for(let i = 0; i < 16; i++) {
            let enabled = !!(head >> 15 - i & 0x01);
            if(enabled) {
              if(bits < 5) {
                // load another byte onto the end of the buffer if there aren't enough bits
                let next = data.readUInt8(offset++)
                buf |= next << 4 - bits;
                
                bits += 8;
              }

              // pull off 5 bits from the top of the buffer
              let dat = buf >> 7 & 0x1F;
              buf <<= 5;
              bits -= 5;

              // rgbSS
              let shape = SIGNAL_SHAPES[dat & 0x03];
              let color = SIGNAL_COLORS[dat >> 2 & 0x07].charAt(0);
              quads[i] = shape + color;
            } else {
              quads[i] = '--';
            }
          }
          
          let shape = quads.join('')
            // insert layer separators every 4 quads
            .replace(/(.{8})/g, '$1:')
            // trim trailing layer separator
            .substring(0, 35)
            // trim trailing empty layers
            .replace(/:-{8}/g,'');
          
          entry.meta = {
            type: 'shape',
            data: shape
          };
        }
      }
      buildings.push(entry);
    }
    return new Blueprint(buildings);
  }
  exportBinary() {
    // Most buildings are 6 bytes, constant signals can be up to 12 bytes
    const estimateSize = this.buildings.length * 18;
    let data = Buffer.allocUnsafe(estimateSize);
    let offset = 0;
    this.buildings.forEach((building) => {
      data.writeUInt8(building.type.code, offset);
      data.writeUInt16LE(building.x, offset + 1);
      data.writeUInt16LE(building.y, offset + 3);
      data.writeUInt8(building.rotation << 2 | building.ogRotation, offset + 5);
      offset += 6;
      if(building.type.internal === 'constantSignal') {
        if(building.meta.type === 'type') {
          switch(building.meta.data) {
            case 'item':
              data.writeUInt8(0x07, offset++);
              break;
          }
        } else if(building.meta.type === 'boolean_item') {
          data.writeUInt8(building.meta.data & 0x01, offset++);
        } else if(building.meta.type === 'color') {
          data.writeUInt8(SIGNAL_COLORS.indexOf(building.meta.data) & 0x07 | 0x08, offset++);
        } else if(building.meta.type === 'shape') {
          // remove layer separators
          
          let val = building.meta.data.replace(/:/g,'');
          // pad to 2 or 4 layers, split into array of quads
          val = val.padEnd(val.length > 16 ? 32 : 16, '-').match(/(.{2})/g);
          
          let head = [];
          // generate bit field for enabled quads
          // first two layers
          for(let i = 0; i < 8; i++) {
            head[0] = head[0] << 1 | val[i] !== '--';
          }
          // add second byte if second layer exists
          if(head[0] & 0x0F) {
            head[1] = 0;
          }
          // last two layers (optional)
          for(let i = 8; i < val.length; i++) {
            head[1] = head[1] << 1 | val[i] !== '--';
          }
          
          // remove all empty quads
          val = val.filter(q => q !== '--');
          
          let buf = [];
          let pos = 0;
          for(let i = 0; i < val.length; i++) {
            const shape = SIGNAL_SHAPES.indexOf(val[i].charAt(0));
            const color = SIGNAL_COLORS.findIndex(c => c.startsWith(val[i].charAt(1)));
            const pair = color << 2 | shape;
            
            // shift quad data into position and add to buffer
            const bufOffset = pos % 8 - 3;
            buf[Math.floor(pos / 8)] |= bufOffset < 0 ? pair << -bufOffset : pair >> bufOffset;
            if(bufOffset > 0) {
              // if there is not enough space on the first byte, overflow remaining bits to the second byte
              buf[Math.floor(pos / 8) + 1] |= pair << 8 - bufOffset & 0xFF;
            }
            pos += 5;
          }
          
          [...head,...buf].forEach(v => {
            data.writeUInt8(v, offset++);
          });
        }
      }
    });
    
    return data.slice(0, offset);
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
        LZString.decompressFromEncodedURIComponent(senseBP)
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

module.exports = Blueprint;