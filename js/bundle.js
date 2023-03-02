// Init serialization system
// require('./gameplay/serialization/SerializationUtils');

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
const buildContainer = require('./gameplay/buildSystem/BuildContainer').default;

WL.registerComponent(tagComponent);
WL.registerComponent(secondTestComponent);
WL.registerComponent(gridDebugComponent);
WL.registerComponent(buildContainer);

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
const colorSelector = require('./ui/ColorSelectorInteractible').default;
const savesPanel = require('./ui/saveMenu/SavePanel').default;

WL.registerComponent(uiButton);
WL.registerComponent(blockSelector);
WL.registerComponent(colorSelector);
WL.registerComponent(savesPanel);

// Sound components
const clickSoundEmitter = require('./sound/soundEmitters/ClickSoundEmitter').default;
const placeSoundEmitter = require('./sound/soundEmitters/PlaceSoundEmitter').default;
const rotateSoundEmitter = require('./sound/soundEmitters/RotateSoundEmitter').default;
const destroySoundEmitter = require('./sound/soundEmitters/DestroySoundEmitter').default;
//
WL.registerComponent(clickSoundEmitter);
WL.registerComponent(placeSoundEmitter);
WL.registerComponent(rotateSoundEmitter);
WL.registerComponent(destroySoundEmitter);