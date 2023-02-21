// Engine component
require('@wonderlandengine/components/finger-cursor');
require('@wonderlandengine/components/cursor-target');
require('@wonderlandengine/components/cursor');
require('@wonderlandengine/components/mouse-look');

require('@wonderlandengine/components/player-height');
require('@wonderlandengine/components/hand-tracking');
require('@wonderlandengine/components/teleport');
require('@wonderlandengine/components/vr-mode-active-switch');

require('@wonderlandengine/components/howler-audio-listener');
require('@wonderlandengine/components/howler-audio-source');

// Custom components
const tagComponent = require('./utils/TagComponent').default;
const secondTestComponent = require('./TestComponent').SecondTestComponent;
const gridDebugComponent = require('./gameplay/grid/GridDebugComponent').default;

WL.registerComponent(tagComponent);
WL.registerComponent(secondTestComponent);
WL.registerComponent(gridDebugComponent);

// Inputs components
const xrController = require('./gameplay/interactions/XrController').default;
const pointerRay = require('./gameplay/interactions/PointerRay').default;

WL.registerComponent(xrController);
WL.registerComponent(pointerRay);

// Prefabs components
const blockPrefab = require('./gameplay/prefabs/BlockPrefab').default;
const blockStairPrefab = require('./gameplay/prefabs/BlockStairPrefab').default;
const blockSlopePrefab = require('./gameplay/prefabs/BlockSlopePrefab').default;

WL.registerComponent(blockPrefab);
WL.registerComponent(blockStairPrefab);
WL.registerComponent(blockSlopePrefab);

// Ui components
const uiButton = require('./ui/UiButton').default;
const blockSelector = require('./ui/BlockSelectorInteractible').default;

WL.registerComponent(uiButton);
WL.registerComponent(blockSelector);