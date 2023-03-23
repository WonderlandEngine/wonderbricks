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
import {ARCamera8thwall, Cursor, CursorTarget, DebugObject, DeviceOrientationLook, FingerCursor, FixedFoveation, HandTracking, HitTestLocation, HowlerAudioListener, HowlerAudioSource, ImageTexture, MouseLookComponent, PlayerHeight, TargetFramerate, TeleportComponent, Trail, TwoJointIkSolver, VideoTexture, VrModeActiveSwitch, Vrm, WasdControlsComponent} from '@wonderlandengine/components';
WL.registerComponent(ARCamera8thwall, Cursor, CursorTarget, DebugObject, DeviceOrientationLook, FingerCursor, FixedFoveation, HandTracking, HitTestLocation, HowlerAudioListener, HowlerAudioSource, ImageTexture, MouseLookComponent, PlayerHeight, TargetFramerate, TeleportComponent, Trail, TwoJointIkSolver, VideoTexture, VrModeActiveSwitch, Vrm, WasdControlsComponent);
import {BuildContainer} from './gameplay/buildSystem/BuildContainer.ts';
WL.registerComponent(BuildContainer);
import './gameplay/buildSystem/BuildController.ts';
import './gameplay/grid/Grid.ts';
import {GridDebugComponent} from './gameplay/grid/GridDebugComponent.ts';
WL.registerComponent(GridDebugComponent);
import './gameplay/grid/GridLayer.ts';
import './gameplay/grid/GridManager.ts';
import './gameplay/input/XrButton.ts';
import './gameplay/input/XrGamepad.ts';
import './gameplay/input/XrInputAxes.ts';
import './gameplay/input/XrInputButton.ts';
import './gameplay/interactions/PointerMode.ts';
import {PointerRay} from './gameplay/interactions/PointerRay.ts';
WL.registerComponent(PointerRay);
import {XrController} from './gameplay/interactions/XrController.ts';
WL.registerComponent(XrController);
import {BlockPrefab} from './gameplay/prefabs/BlockPrefab.ts';
WL.registerComponent(BlockPrefab);
import {BlockSlopePrefab} from './gameplay/prefabs/BlockSlopePrefab.ts';
WL.registerComponent(BlockSlopePrefab);
import {BlockStairPrefab} from './gameplay/prefabs/BlockStairPrefab.ts';
WL.registerComponent(BlockStairPrefab);
import {BlockVerticalPrefab} from './gameplay/prefabs/BlockVerticalPrefab.ts';
WL.registerComponent(BlockVerticalPrefab);
import {ConeCutPrefab} from './gameplay/prefabs/ConeCutPrefab.ts';
WL.registerComponent(ConeCutPrefab);
import {ConePrefab} from './gameplay/prefabs/ConePrefab.ts';
WL.registerComponent(ConePrefab);
import {CylinderPrefab} from './gameplay/prefabs/CylinderPrefab.ts';
WL.registerComponent(CylinderPrefab);
import './gameplay/prefabs/PrefabBase.ts';
import './gameplay/prefabs/PrefabsRegistry.ts';
import {PyramidCutPrefab} from './gameplay/prefabs/PyramidCutPrefab.ts';
WL.registerComponent(PyramidCutPrefab);
import {PyramidPrefab} from './gameplay/prefabs/PyramidPrefab.ts';
WL.registerComponent(PyramidPrefab);
import {SlabPrefab} from './gameplay/prefabs/SlabPrefab.ts';
WL.registerComponent(SlabPrefab);
import './gameplay/serialization/SarielizationData.ts';
import './gameplay/serialization/SerializationUtils.ts';
import './sound/HowlerAudioSourceComponent.ts';
import {SoundEmitterBase} from './sound/SoundEmitterBase.ts';
WL.registerComponent(SoundEmitterBase);
import './sound/SoundEmitterType.ts';
import './sound/SoundSystem.ts';
import {ClickSoundEmitter} from './sound/soundEmitters/ClickSoundEmitter.ts';
WL.registerComponent(ClickSoundEmitter);
import {DestroySoundEmitter} from './sound/soundEmitters/DestroySoundEmitter.ts';
WL.registerComponent(DestroySoundEmitter);
import {PlaceSoundEmitter} from './sound/soundEmitters/PlaceSoundEmitter.ts';
WL.registerComponent(PlaceSoundEmitter);
import {RotateSoundEmitter} from './sound/soundEmitters/RotateSoundEmitter.ts';
WL.registerComponent(RotateSoundEmitter);
import {BlockSelectorInteractible} from './ui/BlockSelectorInteractible.ts';
WL.registerComponent(BlockSelectorInteractible);
import {ColorSelectorInteractible} from './ui/ColorSelectorInteractible.ts';
WL.registerComponent(ColorSelectorInteractible);
import {TextureSelectorInteractible} from './ui/TextureSelectorInteractible.ts';
WL.registerComponent(TextureSelectorInteractible);
import {UiButton} from './ui/UiButton.ts';
WL.registerComponent(UiButton);
import {UiElementBase} from './ui/UiElementBase.ts';
WL.registerComponent(UiElementBase);
import {SavePanel} from './ui/saveMenu/SavePanel.ts';
WL.registerComponent(SavePanel);
import {ObjectToggler} from './utils/ObjectToggler.ts';
WL.registerComponent(ObjectToggler);
import {SimplePreviewBlockCreator} from './utils/SimplePreviewBlockCreator.ts';
WL.registerComponent(SimplePreviewBlockCreator);
import './utils/Tag.ts';
import {TagComponent} from './utils/TagComponent.ts';
WL.registerComponent(TagComponent);
import './utils/TagUtils.ts';
import {TextureInformation} from './utils/textures/TextureInformation.ts';
WL.registerComponent(TextureInformation);
import './utils/textures/TextureInformationRegistry.ts';
import {ArmPanel} from './ui/armMenu/ArmPanel.ts';
WL.registerComponent(ArmPanel);
import {BlockSelectionPanel} from './ui/armMenu/BlockSelectionPanel.ts';
WL.registerComponent(BlockSelectionPanel);
import {MenuController} from './ui/armMenu/MenuController.ts';
WL.registerComponent(MenuController);
import {MenuSelectionButton} from './ui/armMenu/MenuSelectionButton.ts';
WL.registerComponent(MenuSelectionButton);
import {TextureSelectionPanel} from './ui/armMenu/TextureSelectionPanel.ts';
WL.registerComponent(TextureSelectionPanel);
/* wle:auto-imports:end */