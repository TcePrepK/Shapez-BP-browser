const TILE_SIZE = 96;
const TILE_OVERLAP = 6;
const TILE_REAL_SIZE = TILE_SIZE - 2 * TILE_OVERLAP;

const BUILDINGS = {
  beltStraight: {
    code: 1,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 0, y: 0, h: 1, w: 1 }
  },
  beltLeft: {
    code: 2,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 3, type: 'beltOut', draw: false }
    ],
    atlas: { x: 1, y: 0, h: 1, w: 1 }
  },
  beltRight: {
    code: 3,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 1, type: 'beltOut', draw: false }
    ],
    atlas: { x: 2, y: 0, h: 1, w: 1 }
  },
  balancer: {
    code: 4,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 1, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true },
      { i: 1, j: 0, facing: 0, type: 'beltOut', draw: true }
    ],
    atlas: { x: 3, y: 0, h: 1, w: 2 }
  },
  extractor: {
    code: 7,
    links: [
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 5, y: 0, h: 1, w: 1 }
  },
  chainExtractor: {
    code: 8,
    links: [
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 6, y: 0, h: 1, w: 1 }
  },
  trash: {
    code: 20,
    links: [
      { i: 0, j: 0, facing: 0, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 1, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false }
    ],
    atlas: { x: 7, y: 0, h: 1, w: 1 }
  },
  
  mergerLeft: {
    code: 6,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true }
    ],
    atlas: { x: 0, y: 1, h: 1, w: 1 }
  },
  mergerRight: {
    code: 5,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 1, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true }
    ],
    atlas: { x: 1, y: 1, h: 1, w: 1 }
  },
  splitterLeft: {
    code: 48,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 3, type: 'beltOut', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true }
    ],
    atlas: { x: 2, y: 1, h: 1, w: 1 }
  },
  splitterRight: {
    code: 47,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 1, type: 'beltOut', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true }
    ],
    atlas: { x: 3, y: 1, h: 1, w: 1 }
  },
  tunnelMk1In: {
    code: 22,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false }
    ],
    atlas: { x: 4, y: 1, h: 1, w: 1 }
  },
  tunnelMk1Out: {
    code: 23,
    links: [
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 5, y: 1, h: 1, w: 1 }
  },
  tunnelMk2In: {
    code: 24,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false }
    ],
    atlas: { x: 6, y: 1, h: 1, w: 1 }
  },
  tunnelMk2Out: {
    code: 25,
    links: [
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 7, y: 1, h: 1, w: 1 }
  },
  
  rotator90: {
    code: 11,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 0, y: 2, h: 1, w: 1 }
  },
  rotator270: {
    code: 12,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 1, y: 2, h: 1, w: 1 }
  },
  rotator180: {
    code: 13,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 2, y: 2, h: 1, w: 1 }
  },
  beltOut: {
    code: -1,
    links: [],
    atlas: { x: 3, y: 2, h: 1, w: 1 }
  },
  beltIn: {
    code: -1,
    links: [],
    atlas: { x: 4, y: 2, h: 1, w: 1 }
  },
  cutter: {
    code: 9,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 1, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 6, y: 2, h: 1, w: 2 }
  },
  
  painterLeft: {
    code: 16,
    links: [
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 0, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 1, type: 'beltOut', draw: false }
    ],
    atlas: { x: 0, y: 3, h: 1, w: 2 }
  },
  painterDouble: {
    code: 18,
    links: [
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
      { i: 0, j: 1, facing: 3, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 0, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 1, type: 'beltOut', draw: false }
    ],
    atlas: { x: 2, y: 3, h: 2, w: 2 }
  },
  cutterQuad: {
    code: 10,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 1, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 2, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 3, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 4, y: 3, h: 1, w: 4 }
  },
  
  painterRight: {
    code: 17,
    links: [
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 1, type: 'beltOut', draw: false }
    ],
    atlas: { x: 0, y: 4, h: 1, w: 2 }
  },
  stacker: {
    code: 14,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 4, y: 4, h: 1, w: 2 }
  },
  mixer: {
    code: 15,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 6, y: 4, h: 1, w: 2 }
  },
  
  reader: {
    code: 49,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true }
    ],
    atlas: { x: 0, y: 5, h: 1, w: 1 }
  },
  constantSignal: {
    code: 31,
    links: [],
    atlas: { x: 1, y: 5, h: 1, w: 1 }
  },
  filter: {
    code: 37,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 1, j: 0, facing: 1, type: 'beltOut', draw: false }
    ],
    atlas: { x: 2, y: 5, h: 1, w: 2 }
  },
  painterQuad: {
    code: 19,
    links: [
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 2, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 3, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 4, y: 5, h: 1, w: 4 }
  },
  
  display: {
    code: 40,
    links: [],
    atlas: { x: 0, y: 6, h: 1, w: 1 }
  },
  lever: {
    code: 33,
    links: [],
    atlas: { x: 1, y: 6, h: 1, w: 1 }
  },
  analyzer: {
    code: 43,
    links: [],
    atlas: { x: 2, y: 6, h: 1, w: 1 }
  },
  comparator: {
    code: 46,
    links: [],
    atlas: { x: 3, y: 6, h: 1, w: 1 }
  },
  logicNot: {
    code: 34,
    links: [],
    atlas: { x: 4, y: 6, h: 1, w: 1 }
  },
  logicOr: {
    code: 36,
    links: [],
    atlas: { x: 5, y: 6, h: 1, w: 1 }
  },
  logicXOr: {
    code: 35,
    links: [],
    atlas: { x: 6, y: 6, h: 1, w: 1 }
  },
  logicAnd: {
    code: 32,
    links: [],
    atlas: { x: 7, y: 6, h: 1, w: 1 }
  },
  
  transistorRight: {
    code: 60,
    links: [],
    atlas: { x: 0, y: 7, h: 1, w: 1 }
  },
  transistorLeft: {
    code: 38,
    links: [],
    atlas: { x: 1, y: 7, h: 1, w: 1 }
  },
  virtualPainter: {
    code: 51,
    links: [],
    atlas: { x: 2, y: 7, h: 1, w: 1 }
  },
  virtualRotator: {
    code: 44,
    links: [],
    atlas: { x: 3, y: 7, h: 1, w: 1 }
  },
  virtualStacker: {
    code: 50,
    links: [],
    atlas: { x: 4, y: 7, h: 1, w: 1 }
  },
  virtualUnstacker: {
    code: 45,
    links: [],
    atlas: { x: 5, y: 7, h: 1, w: 1 }
  },
  virtualCutter: {
    code: 42,
    links: [],
    atlas: { x: 6, y: 7, h: 1, w: 1 }
  },
  wireBridge: {
    code: 39,
    links: [],
    atlas: { x: 7, y: 7, h: 1, w: 1 }
  },
  
  hub: {
    code: 26,
    links: [
      { i: 0, j: 0, facing: 0, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 0, type: 'beltIn', draw: false },
      { i: 2, j: 0, facing: 0, type: 'beltIn', draw: false },
      { i: 3, j: 0, facing: 0, type: 'beltIn', draw: false },
      { i: 3, j: 0, facing: 1, type: 'beltIn', draw: false },
      { i: 3, j: 1, facing: 1, type: 'beltIn', draw: false },
      { i: 3, j: 2, facing: 1, type: 'beltIn', draw: false },
      { i: 3, j: 3, facing: 1, type: 'beltIn', draw: false },
      { i: 3, j: 3, facing: 2, type: 'beltIn', draw: false },
      { i: 2, j: 3, facing: 2, type: 'beltIn', draw: false },
      { i: 1, j: 3, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 3, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 3, facing: 3, type: 'beltIn', draw: false },
      { i: 0, j: 2, facing: 3, type: 'beltIn', draw: false },
      { i: 0, j: 1, facing: 3, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false }
    ],
    atlas: { x: 0, y: 8, h: 4, w: 4 }
  },
  wireGrCross: {
    code: 30,
    links: [],
    atlas: { x: 4, y: 8, h: 1, w: 1 }
  },
  wireGrStraight: {
    code: 27,
    links: [],
    atlas: { x: 5, y: 8, h: 1, w: 1 }
  },
  wireGrTee: {
    code: 29,
    links: [],
    atlas: { x: 6, y: 8, h: 1, w: 1 }
  },
  wireGrCorner: {
    code: 28,
    links: [],
    atlas: { x: 7, y: 8, h: 1, w: 1 }
  },
  
  wireBlCross: {
    code: 55,
    links: [],
    atlas: { x: 4, y: 9, h: 1, w: 1 }
  },
  wireBlStraight: {
    code: 52,
    links: [],
    atlas: { x: 5, y: 9, h: 1, w: 1 }
  },
  wireBlTee: {
    code: 54,
    links: [],
    atlas: { x: 6, y: 9, h: 1, w: 1 }
  },
  wireBlCorner: {
    code: 53,
    links: [],
    atlas: { x: 7, y: 9, h: 1, w: 1 }
  },
  
  storage: {
    code: 21,
    links: [
      { i: 0, j: 1, facing: 2, type: 'beltIn', draw: false },
      { i: 1, j: 1, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 1, j: 0, facing: 0, type: 'beltOut', draw: false },
    ],
    atlas: { x: 4, y: 10, h: 2, w: 2 }
  },
  puzzleProducer: {
    code: 62,
    links: [
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 6, y: 10, h: 1, w: 1 }
  },
  puzzleConsumer: {
    code: 63,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false }
    ],
    atlas: { x: 7, y: 10, h: 1, w: 1 }
  },
  
  cheatProducer: {
    code: 61,
    links: [
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }
    ],
    atlas: { x: 6, y: 11, h: 1, w: 1 }
  },
  block: {
    code: 64,
    links: [],
    atlas: { x: 7, y: 11, h: 1, w: 1 }
  }
};

function drawBlueprint( bpString, bgStyle = BG_DARK ) {
  if( !bpString ) {
    bpString = 'NobwRAxg9gtgDlAdgU0QFwM5gFzgMpoCGaAlhALKFwCi6JaAnjuFAE4kDmJizYAHjgC0ARgA0YJtgAMAX3GsoRUkhwBOKeLaduhADYAlRcRIrs68dAAmyHMJn3R4aPCSpMvAsYpVapRry0uHlx+ITEJWzkwBSUTYPMwQJ0DI2V4jUgoa0iHJ1gEFHQsEM9Sbxo6fxCk4PABaXFJWXlUuLUMmr1DWNMEqxtsYQBWKIBJNGQYAAUFCGQMDDZeFD40AHkAVzQ4LbxdRRxmsHHJ6gArZAg0JZCMffdsUDB6SZxEDd1dcTgFDlZ54qyAC69jkeRchQe+Fi5V89EkLHYQV49XCkhEURixlMHSRyW62OCGX6OTBmQhbmK0K8lAqfgRiTxtVCg0akRaPWCACYAOy47SILqtUy84lZAbCABsYwm01mAJu4BW6y2OzQewO0hlpwuV0VYDuimKTxeMDeHy+YB+UD+AMOMhBuXJBUpHhhtLhVURApRtjZ2C5mOFRM0TKFnMOFnFpKBQA';
  }
  let blueprint = parseBlueprintString( bpString );
  
  let ctx = initCanvas( blueprint.w, blueprint.h, bgStyle );
  
  drawBelts( ctx, blueprint );
  drawBuildings( ctx, blueprint );
}

function parseBlueprintString( bp ) {
  const blueprint = JSON.parse( LZString.decompressFromEncodedURIComponent( bp ) );
  
  let minX = Number.MAX_SAFE_INTEGER, minY = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER, maxY = Number.MIN_SAFE_INTEGER;
  
  for( let idx = 0; idx < blueprint.length; idx++ ) {
    const code = blueprint[ idx ].components.StaticMapEntity.code;
    
    if( code === BUILDINGS.beltStraight.code ) {
      continue;
    }
    if( code === BUILDINGS.wireBlStraight.code ) {
      continue;
    }
    if( code === BUILDINGS.wireGrStraight.code ) {
      continue;
    }
    
    const coords = blueprint[ idx ].components.StaticMapEntity.origin;
    
    const name = Object.keys( BUILDINGS ).find( k => BUILDINGS[ k ].code === code );
    
    let [ cornerX, cornerY ] = translate(
      coords.x,
      coords.y,
      blueprint[ idx ].components.StaticMapEntity.rotation / 90,
      BUILDINGS[ name ].atlas.w - 1,
      BUILDINGS[ name ].atlas.h - 1
    );
    
    minX = Math.min( minX, coords.x, cornerX );
    minY = Math.min( minY, coords.y, cornerY );
    maxX = Math.max( maxX, coords.x, cornerX );
    maxY = Math.max( maxY, coords.y, cornerY );
  }
  
  let offsetX = minX - 1;
  let offsetY = minY - 1;
  
  let ret = new Array( maxY - minY + 3 );
  for( let y = 0; y < ret.length; y++ ) {
    ret[ y ] = new Array( maxX - minX + 3 );
  }
  ret.w = maxX - minX + 3;
  ret.h = maxY - minY + 3;
  
  for( let idx = 0; idx < blueprint.length; idx++ ) {
    const code = blueprint[ idx ].components.StaticMapEntity.code;
    const coords = blueprint[ idx ].components.StaticMapEntity.origin;
    const entity = blueprint[ idx ].components.StaticMapEntity;
    const name = Object.keys( BUILDINGS ).find( k => BUILDINGS[ k ].code === code );
    const [ cornerX, cornerY ] = translate(
      coords.x,
      coords.y,
      entity.rotation / 90,
      BUILDINGS[ name ].atlas.w - 1,
      BUILDINGS[ name ].atlas.h - 1
    );
    
    const minX = Math.min( entity.origin.x, cornerX );
    const minY = Math.min( entity.origin.y, cornerY );
    const maxX = Math.max( entity.origin.x, cornerX );
    const maxY = Math.max( entity.origin.y, cornerY );
    for( let y = minY; y <= maxY; y++ ) {
      for( let x = minX; x <= maxX; x++ ) {
        let arrX = x - offsetX;
        let arrY = y - offsetY;
        if( arrX < 0 || arrX >= ret.w || arrY < 0 || arrY >= ret.h ) {
          continue;
        }
        if( x === entity.origin.x && y === entity.origin.y ) {
          ret[ arrY ][ arrX ] = {
            name,
            rotation: entity.rotation / 90
          };
        } else {
          ret[ arrY ][ arrX ] = {
            name: 'child',
            x: entity.origin.x - offsetX,
            y: entity.origin.y - offsetY
          };
        }
      }
    }
  }
  
  return ret;
}
function drawBelts( ctx, blueprint ) {
  for( let y = 0; y < blueprint.h; y++ ) {
    for( let x = 0; x < blueprint.w; x++ ) {
      if( !blueprint[ y ][ x ] || blueprint[ y ][ x ] === null ) {
        continue;
      }
      
      const name = blueprint[ y ][ x ].name;
      if( name === 'child' ) {
        continue;
      }
      if( name.startsWith( 'belt' ) || name.startsWith( 'wire' ) ) {
        drawSprite( ctx, name, x, y, blueprint[ y ][ x ].rotation );
        continue;
      }
      for( let idx = 0; idx < BUILDINGS[ name ].links.length; idx++ ) {
        const link = BUILDINGS[ name ].links[ idx ];
        
        if( !link.draw ) {
          continue;
        }
        
        let [ selfLinkX, selfLinkY ] = translate(
          x,
          y,
          blueprint[ y ][ x ].rotation,
          link.i,
          link.j
        );
        
        const selfFacing = ( blueprint[ y ][ x ].rotation + link.facing ) % 4;
        
        let [ neighborX, neighborY ] = neighborCoords( selfLinkX, selfLinkY, selfFacing );
        
        if( neighborX < 0 || neighborX >= blueprint.w || neighborY < 0 || neighborY >= blueprint.h ) {
          continue;
        }
        let neighbor = blueprint[ neighborY ][ neighborX ];
        if( !neighbor || neighbor === null ) {
          continue;
        }
        if( neighbor.name === 'child' ) {
          neighborX = neighbor.x;
          neighborY = neighbor.y;
          neighbor = blueprint[ neighborY ][ neighborX ];
        }
        for( let nIdx = 0; nIdx < BUILDINGS[ neighbor.name ].links.length; nIdx++ ) {
          const nLink = BUILDINGS[ neighbor.name ].links[ nIdx ];
          
          let [ neighborLinkX, neighborLinkY ] = translate(
            neighborX,
            neighborY,
            blueprint[ y ][ x ].rotation,
            nLink.i,
            nLink.j
          );
          
          if( neighborX !== neighborLinkX || neighborY !== neighborLinkY ) {
            continue;
          }
          
          const nAdjFacing = ( neighbor.rotation + nLink.facing + 2 ) % 4;
          
          if( selfFacing === nAdjFacing ) {
            if( link.type === 'beltIn' && nLink.type === 'beltOut' ) {
              drawSprite( ctx, 'beltIn', selfLinkX, selfLinkY, selfFacing );
            } else if( link.type === 'beltOut' && nLink.type === 'beltIn' ) {
              drawSprite( ctx, 'beltOut', selfLinkX, selfLinkY, selfFacing );
            }
          }
        }
      }
    }
  }
}
function drawBuildings( ctx, blueprint ) {
  for( let y = 0; y < blueprint.h; y++ ) {
    for( let x = 0; x < blueprint.w; x++ ) {
      if( !blueprint[ y ][ x ] || blueprint[ y ][ x ] === null ) {
        continue;
      }
      
      const name = blueprint[ y ][ x ].name
      if( name === 'child' || name.startsWith( 'belt' ) || name.startsWith( 'wire' ) ) {
        continue;
      }
      
      drawSprite( ctx, name, x, y, blueprint[ y ][ x ].rotation );
    }
  }
}

function translate( x, y, r, i, j ) {
  switch( r ) {
    case 0: return [ x + i, y - j ];
    case 1: return [ x + j, y + i ];
    case 2: return [ x - i, y + j ];
    case 3: return [ x - j, y - i ];
  }
}
function neighborCoords( x, y, facing ) {
  switch( facing ) {
    case 0: return [ x, y - 1 ];
    case 1: return [ x + 1, y ];
    case 2: return [ x, y + 1 ];
    case 3: return [ x - 1, y ];
  }
}

const BG_NONE = -1;
const BG_LIGHT = 0;
const BG_DARK = 1;
const BG_COLORS = {
  background: [
    '#ffffff',
    '#3e3f47',
  ],
  gridLines: [
    '#fafafa',
    '#42434b',
  ],
};
const LINE_WIDTH = 3;

function initCanvas( width, height, bgMode ) {
  const pxWidth = TILE_REAL_SIZE * width;
  const pxHeight = TILE_REAL_SIZE * height;
  
  let c = document.getElementById( 'viewer' );
  c.width = pxWidth;
  c.height = pxHeight;
  
  let ctx = c.getContext( '2d' );
  
  if( bgMode != -1 ) {
    ctx.fillStyle = BG_COLORS.background[ bgMode ];
    ctx.strokeStyle = BG_COLORS.gridLines[ bgMode ];
    ctx.lineWidth = LINE_WIDTH;
    
    ctx.fillRect( 0, 0, pxWidth, pxHeight );
    
    ctx.beginPath();
    
    for( let row = 1; row < width; row++ ) {
      ctx.moveTo( TILE_REAL_SIZE * row, 0 );
      ctx.lineTo( TILE_REAL_SIZE * row, pxHeight );
    }
    for( let col = 1; col < height; col++ ) {
      ctx.moveTo( 0, TILE_REAL_SIZE * col );
      ctx.lineTo( pxWidth, TILE_REAL_SIZE * col );
    }
    
    ctx.stroke();
  }
  
  return ctx;
}

function drawSprite( ctx, name, x, y, rot ) {
  const ctxX = TILE_REAL_SIZE * ( x + 0.5 );
  const ctxY = TILE_REAL_SIZE * ( y + 0.5 );
  
  const atlas = BUILDINGS[ name ].atlas;
  
  const ctxR = rot * Math.PI / 2;
  ctx.translate( ctxX, ctxY );
  ctx.rotate( ctxR );
  
  ctx.drawImage(
    document.getElementById('sprites'),
    TILE_SIZE * atlas.x,
    TILE_SIZE * atlas.y,
    TILE_SIZE * atlas.w,
    TILE_SIZE * atlas.h,
    TILE_REAL_SIZE * -0.5 - TILE_OVERLAP * atlas.w,
    TILE_REAL_SIZE * -0.5 - TILE_OVERLAP * atlas.h,
    TILE_SIZE * atlas.w,
    TILE_SIZE * atlas.h
  );
  
  ctx.rotate( -ctxR );
  ctx.translate( -ctxX, -ctxY );
}