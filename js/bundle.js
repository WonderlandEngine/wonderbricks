// Engine component
import {registerComponent} from "@wonderlandengine/api";

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
require('./button');
const secondTestComponent = require('./TestComponent').SecondTestComponent;
const gridDebugComponent = require('./gameplay/grid/GridDebugComponent').default;

WL.registerComponent(secondTestComponent);
WL.registerComponent(gridDebugComponent);

