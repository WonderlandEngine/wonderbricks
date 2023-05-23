/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * You should register the component you need here, e.g.,
 *
 * ```
 * import { MyComponent } from './my-component.js';
 *
 * WL.registerComponent(MyComponent);
 * ```
 *
 * The `wle:auto-imports:start` and `wle:auto-imports:end` comments are
 * used by the editor as a target for the import list.
 */

/* wle:auto-imports:start */
import {Cursor} from '@wonderlandengine/components';
import {HowlerAudioListener} from '@wonderlandengine/components';
import {HowlerAudioSource} from '@wonderlandengine/components';
import {MouseLookComponent} from '@wonderlandengine/components';
import {PlayerHeight} from '@wonderlandengine/components';
import {TeleportComponent} from '@wonderlandengine/components';
import {VrModeActiveSwitch} from '@wonderlandengine/components';
import {BuildContainer} from './gameplay/buildSystem/BuildContainer.js';
import {GridDebugComponent} from './gameplay/grid/GridDebugComponent.js';
import {PointerRay} from './gameplay/interactions/PointerRay.js';
import {XrController} from './gameplay/interactions/XrController.js';
import {BlockPrefab} from './gameplay/prefabs/BlockPrefab.js';
import {BlockSlopePrefab} from './gameplay/prefabs/BlockSlopePrefab.js';
import {BlockStairPrefab} from './gameplay/prefabs/BlockStairPrefab.js';
import {BlockVerticalPrefab} from './gameplay/prefabs/BlockVerticalPrefab.js';
import {ConeCutPrefab} from './gameplay/prefabs/ConeCutPrefab.js';
import {ConePrefab} from './gameplay/prefabs/ConePrefab.js';
import {CylinderPrefab} from './gameplay/prefabs/CylinderPrefab.js';
import {PyramidCutPrefab} from './gameplay/prefabs/PyramidCutPrefab.js';
import {PyramidPrefab} from './gameplay/prefabs/PyramidPrefab.js';
import {SlabPrefab} from './gameplay/prefabs/SlabPrefab.js';
import {ClickSoundEmitter} from './sound/soundEmitters/ClickSoundEmitter.js';
import {DestroySoundEmitter} from './sound/soundEmitters/DestroySoundEmitter.js';
import {PlaceSoundEmitter} from './sound/soundEmitters/PlaceSoundEmitter.js';
import {RotateSoundEmitter} from './sound/soundEmitters/RotateSoundEmitter.js';
import {BlockSelectorInteractible} from './ui/BlockSelectorInteractible.js';
import {TextureSelectorInteractible} from './ui/TextureSelectorInteractible.js';
import {UiButton} from './ui/UiButton.js';
import {ArmPanel} from './ui/armMenu/ArmPanel.js';
import {BlockSelectionPanel} from './ui/armMenu/BlockSelectionPanel.js';
import {MenuController} from './ui/armMenu/MenuController.js';
import {MenuSelectionButton} from './ui/armMenu/MenuSelectionButton.js';
import {TextureSelectionPanel} from './ui/armMenu/TextureSelectionPanel.js';
import {SavePanel} from './ui/saveMenu/SavePanel.js';
import {TagComponent} from './utils/TagComponent.js';
import {TextureInformation} from './utils/textures/TextureInformation.js';
/* wle:auto-imports:end */