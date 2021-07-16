const BUILDINGS = {
  beltStraight: {
    code: 1,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
    ],
    atlas: { x: 0, y: 0, h: 1, w: 1 },
  },
  beltLeft: {
    code: 2,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 3, type: 'beltOut', draw: false },
    ],
    atlas: { x: 1, y: 0, h: 1, w: 1 },
  },
  beltRight: {
    code: 3,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 1, type: 'beltOut', draw: false },
    ],
    atlas: { x: 2, y: 0, h: 1, w: 1 },
  },
  balancer: {
    code: 4,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 1, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true },
      { i: 1, j: 0, facing: 0, type: 'beltOut', draw: true },
    ],
    atlas: { x: 3, y: 0, h: 1, w: 2 },
  },
  extractor: {
    code: 7,
    links: [{ i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }],
    atlas: { x: 5, y: 0, h: 1, w: 1 },
  },
  chainExtractor: {
    code: 8,
    links: [{ i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }],
    atlas: { x: 6, y: 0, h: 1, w: 1 },
  },
  trash: {
    code: 20,
    links: [
      { i: 0, j: 0, facing: 0, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 1, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
    ],
    atlas: { x: 7, y: 0, h: 1, w: 1 },
  },

  mergerLeft: {
    code: 6,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true },
    ],
    atlas: { x: 0, y: 1, h: 1, w: 1 },
  },
  mergerRight: {
    code: 5,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 1, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true },
    ],
    atlas: { x: 1, y: 1, h: 1, w: 1 },
  },
  splitterLeft: {
    code: 48,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 3, type: 'beltOut', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true },
    ],
    atlas: { x: 2, y: 1, h: 1, w: 1 },
  },
  splitterRight: {
    code: 47,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 1, type: 'beltOut', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true },
    ],
    atlas: { x: 3, y: 1, h: 1, w: 1 },
  },
  tunnelMk1In: {
    code: 22,
    links: [{ i: 0, j: 0, facing: 2, type: 'beltIn', draw: false }],
    atlas: { x: 4, y: 1, h: 1, w: 1 },
  },
  tunnelMk1Out: {
    code: 23,
    links: [{ i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }],
    atlas: { x: 5, y: 1, h: 1, w: 1 },
  },
  tunnelMk2In: {
    code: 24,
    links: [{ i: 0, j: 0, facing: 2, type: 'beltIn', draw: false }],
    atlas: { x: 6, y: 1, h: 1, w: 1 },
  },
  tunnelMk2Out: {
    code: 25,
    links: [{ i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }],
    atlas: { x: 7, y: 1, h: 1, w: 1 },
  },

  rotator90: {
    code: 11,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
    ],
    atlas: { x: 0, y: 2, h: 1, w: 1 },
  },
  rotator270: {
    code: 12,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
    ],
    atlas: { x: 1, y: 2, h: 1, w: 1 },
  },
  rotator180: {
    code: 13,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
    ],
    atlas: { x: 2, y: 2, h: 1, w: 1 },
  },
  beltOut: {
    code: -1,
    links: [],
    atlas: { x: 3, y: 2, h: 1, w: 1 },
  },
  beltIn: {
    code: -1,
    links: [],
    atlas: { x: 4, y: 2, h: 1, w: 1 },
  },
  cutter: {
    code: 9,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 1, j: 0, facing: 0, type: 'beltOut', draw: false },
    ],
    atlas: { x: 6, y: 2, h: 1, w: 2 },
  },

  painterLeft: {
    code: 16,
    links: [
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 0, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 1, type: 'beltOut', draw: false },
    ],
    atlas: { x: 0, y: 3, h: 1, w: 2 },
  },
  painterDouble: {
    code: 18,
    links: [
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
      { i: 0, j: 1, facing: 3, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 0, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 1, type: 'beltOut', draw: false },
    ],
    atlas: { x: 2, y: 3, h: 2, w: 2 },
  },
  cutterQuad: {
    code: 10,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 1, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 2, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 3, j: 0, facing: 0, type: 'beltOut', draw: false },
    ],
    atlas: { x: 4, y: 3, h: 1, w: 4 },
  },

  painterRight: {
    code: 17,
    links: [
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 1, type: 'beltOut', draw: false },
    ],
    atlas: { x: 0, y: 4, h: 1, w: 2 },
  },
  stacker: {
    code: 14,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
    ],
    atlas: { x: 4, y: 4, h: 1, w: 2 },
  },
  mixer: {
    code: 15,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
    ],
    atlas: { x: 6, y: 4, h: 1, w: 2 },
  },

  reader: {
    code: 49,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: true },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: true },
    ],
    atlas: { x: 0, y: 5, h: 1, w: 1 },
  },
  constantSignal: {
    code: 31,
    links: [],
    atlas: { x: 1, y: 5, h: 1, w: 1 },
  },
  filter: {
    code: 37,
    links: [
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 1, j: 0, facing: 1, type: 'beltOut', draw: false },
    ],
    atlas: { x: 2, y: 5, h: 1, w: 2 },
  },
  painterQuad: {
    code: 19,
    links: [
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 1, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 2, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 3, j: 0, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
    ],
    atlas: { x: 4, y: 5, h: 1, w: 4 },
  },

  display: {
    code: 40,
    links: [],
    atlas: { x: 0, y: 6, h: 1, w: 1 },
  },
  lever: {
    code: 33,
    links: [],
    atlas: { x: 1, y: 6, h: 1, w: 1 },
  },
  analyzer: {
    code: 43,
    links: [],
    atlas: { x: 2, y: 6, h: 1, w: 1 },
  },
  comparator: {
    code: 46,
    links: [],
    atlas: { x: 3, y: 6, h: 1, w: 1 },
  },
  logicNot: {
    code: 34,
    links: [],
    atlas: { x: 4, y: 6, h: 1, w: 1 },
  },
  logicOr: {
    code: 36,
    links: [],
    atlas: { x: 5, y: 6, h: 1, w: 1 },
  },
  logicXOr: {
    code: 35,
    links: [],
    atlas: { x: 6, y: 6, h: 1, w: 1 },
  },
  logicAnd: {
    code: 32,
    links: [],
    atlas: { x: 7, y: 6, h: 1, w: 1 },
  },

  transistorRight: {
    code: 60,
    links: [],
    atlas: { x: 0, y: 7, h: 1, w: 1 },
  },
  transistorLeft: {
    code: 38,
    links: [],
    atlas: { x: 1, y: 7, h: 1, w: 1 },
  },
  virtualPainter: {
    code: 51,
    links: [],
    atlas: { x: 2, y: 7, h: 1, w: 1 },
  },
  virtualRotator: {
    code: 44,
    links: [],
    atlas: { x: 3, y: 7, h: 1, w: 1 },
  },
  virtualStacker: {
    code: 50,
    links: [],
    atlas: { x: 4, y: 7, h: 1, w: 1 },
  },
  virtualUnstacker: {
    code: 45,
    links: [],
    atlas: { x: 5, y: 7, h: 1, w: 1 },
  },
  virtualCutter: {
    code: 42,
    links: [],
    atlas: { x: 6, y: 7, h: 1, w: 1 },
  },
  wireBridge: {
    code: 39,
    links: [],
    atlas: { x: 7, y: 7, h: 1, w: 1 },
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
      { i: 0, j: 0, facing: 3, type: 'beltIn', draw: false },
    ],
    atlas: { x: 0, y: 8, h: 4, w: 4 },
  },
  wireGrCross: {
    code: 30,
    links: [],
    atlas: { x: 4, y: 8, h: 1, w: 1 },
  },
  wireGrStraight: {
    code: 27,
    links: [],
    atlas: { x: 5, y: 8, h: 1, w: 1 },
  },
  wireGrTee: {
    code: 29,
    links: [],
    atlas: { x: 6, y: 8, h: 1, w: 1 },
  },
  wireGrCorner: {
    code: 28,
    links: [],
    atlas: { x: 7, y: 8, h: 1, w: 1 },
  },

  wireBlCross: {
    code: 55,
    links: [],
    atlas: { x: 4, y: 9, h: 1, w: 1 },
  },
  wireBlStraight: {
    code: 52,
    links: [],
    atlas: { x: 5, y: 9, h: 1, w: 1 },
  },
  wireBlTee: {
    code: 54,
    links: [],
    atlas: { x: 6, y: 9, h: 1, w: 1 },
  },
  wireBlCorner: {
    code: 53,
    links: [],
    atlas: { x: 7, y: 9, h: 1, w: 1 },
  },

  storage: {
    code: 21,
    links: [
      { i: 0, j: 1, facing: 2, type: 'beltIn', draw: false },
      { i: 1, j: 1, facing: 2, type: 'beltIn', draw: false },
      { i: 0, j: 0, facing: 0, type: 'beltOut', draw: false },
      { i: 1, j: 0, facing: 0, type: 'beltOut', draw: false },
    ],
    atlas: { x: 4, y: 10, h: 2, w: 2 },
  },
  puzzleProducer: {
    code: 62,
    links: [{ i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }],
    atlas: { x: 6, y: 10, h: 1, w: 1 },
  },
  puzzleConsumer: {
    code: 63,
    links: [{ i: 0, j: 0, facing: 2, type: 'beltIn', draw: false }],
    atlas: { x: 7, y: 10, h: 1, w: 1 },
  },

  cheatProducer: {
    code: 61,
    links: [{ i: 0, j: 0, facing: 0, type: 'beltOut', draw: false }],
    atlas: { x: 6, y: 11, h: 1, w: 1 },
  },
  block: {
    code: 64,
    links: [],
    atlas: { x: 7, y: 11, h: 1, w: 1 },
  },
};
