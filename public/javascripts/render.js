const TILE_SIZE = 96;
const TILE_OVERLAP = 6;
const TILE_REAL_SIZE = TILE_SIZE - 2 * TILE_OVERLAP;

function renderBlueprint( bpString, bgStyle = BG_DARK ) {
  if( !bpString ) {
    bpString = window.location.hash.substring(1);
  }
  let blueprint = parseBlueprintString( bpString );
  
  let ctx = initCanvas( blueprint.w, blueprint.h, bgStyle );
  
  drawBelts( ctx, blueprint );
  drawBuildings( ctx, blueprint );
}

function parseBlueprintString( bp ) {
  const blueprint = JSON.parse( LZString.decompressFromEncodedURIComponent( bp ) );
  
  // First pass to determine bounds
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
  
  // Initialize map grid
  let ret = new Array( maxY - minY + 3 );
  for( let y = 0; y < ret.length; y++ ) {
    ret[ y ] = new Array( maxX - minX + 3 );
  }
  ret.w = maxX - minX + 3;
  ret.h = maxY - minY + 3;
  
  // Second pass to populate map grid
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
      if( !blueprint[ y ][ x ] ) {
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
        if( !neighbor ) {
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
      if( !blueprint[ y ][ x ] ) {
        continue;
      }
      
      const name = blueprint[ y ][ x ].name;
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
    '#3e3f47'
  ],
  gridLines: [
    '#fafafa',
    '#42434b'
  ]
};
const LINE_WIDTH = 3;

function initCanvas( width, height, bgMode ) {
  const pxWidth = TILE_REAL_SIZE * width;
  const pxHeight = TILE_REAL_SIZE * height;
  
  let c = document.getElementById( 'viewer' );
  c.width = pxWidth;
  c.height = pxHeight;
  
  let ctx = c.getContext( '2d' );
  
  if( bgMode !== BG_NONE ) {
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