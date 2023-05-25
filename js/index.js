/**
 * /!\ This file is auto-generated.
 *
 * This is the entry point of your standalone application.
 *
 * There are multiple tags used by the editor to inject code automatically:
 *     - `wle:auto-imports:start` and `wle:auto-imports:end`: The list of import statements
 *     - `wle:auto-register:start` and `wle:auto-register:end`: The list of component to register
 *     - `wle:auto-constants:start` and `wle:auto-constants:end`: The project's constants,
 *        such as the project's name, whether it should use the physx runtime, etc...
 *     - `wle:auto-benchmark:start` and `wle:auto-benchmark:end`: Append the benchmarking code
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

import { loadRuntime } from "@wonderlandengine/api";
import * as API from "@wonderlandengine/api"; // Deprecated: Backward compatibility.

/* wle:auto-constants:start */
const RuntimeOptions = {
    physx: false,
    loader: false,
    xrFramebufferScaleFactor: 1,
    canvas: 'canvas',
};
const Constants = {
    ProjectName: 'wonderbrick',
    RuntimeBaseName: 'WonderlandRuntime',
    WebXRRequiredFeatures: ['local',],
    WebXROptionalFeatures: ['local','local-floor','hit-test',],
};
/* wle:auto-constants:end */

const engine = await loadRuntime(Constants.RuntimeBaseName, RuntimeOptions);
Object.assign(engine, API); // Deprecated: Backward compatibility.
window.WL = engine; // Deprecated: Backward compatibility.

engine.onSceneLoaded.once(() => {
  const el = document.getElementById("version");
  if (el) setTimeout(() => el.remove(), 2000);
});

/* WebXR setup. */

function requestSession(mode) {
  engine
    .requestXRSession(
      mode,
      Constants.WebXRRequiredFeatures,
      Constants.WebXROptionalFeatures
    )
    .catch((e) => console.error(e));
}

function setupButtonsXR() {
  /* Setup AR / VR buttons */
  const arButton = document.getElementById("ar-button");
  if (arButton) {
    arButton.dataset.supported = engine.arSupported;
    arButton.addEventListener("click", () => requestSession("immersive-ar"));
  }
  const vrButton = document.getElementById("vr-button");
  if (vrButton) {
    vrButton.dataset.supported = engine.vrSupported;
    vrButton.addEventListener("click", () => requestSession("immersive-vr"));
  }
}

if (document.readyState === "loading") {
  window.addEventListener("load", setupButtonsXR);
} else {
  setupButtonsXR();
}

/* wle:auto-register:start */
engine.registerComponent(Cursor);
engine.registerComponent(HowlerAudioListener);
engine.registerComponent(HowlerAudioSource);
engine.registerComponent(MouseLookComponent);
engine.registerComponent(PlayerHeight);
engine.registerComponent(TeleportComponent);
engine.registerComponent(VrModeActiveSwitch);
engine.registerComponent(BuildContainer);
engine.registerComponent(GridDebugComponent);
engine.registerComponent(PointerRay);
engine.registerComponent(XrController);
engine.registerComponent(BlockPrefab);
engine.registerComponent(BlockSlopePrefab);
engine.registerComponent(BlockStairPrefab);
engine.registerComponent(BlockVerticalPrefab);
engine.registerComponent(ConeCutPrefab);
engine.registerComponent(ConePrefab);
engine.registerComponent(CylinderPrefab);
engine.registerComponent(PyramidCutPrefab);
engine.registerComponent(PyramidPrefab);
engine.registerComponent(SlabPrefab);
engine.registerComponent(ClickSoundEmitter);
engine.registerComponent(DestroySoundEmitter);
engine.registerComponent(PlaceSoundEmitter);
engine.registerComponent(RotateSoundEmitter);
engine.registerComponent(BlockSelectorInteractible);
engine.registerComponent(TextureSelectorInteractible);
engine.registerComponent(UiButton);
engine.registerComponent(ArmPanel);
engine.registerComponent(BlockSelectionPanel);
engine.registerComponent(MenuController);
engine.registerComponent(MenuSelectionButton);
engine.registerComponent(TextureSelectionPanel);
engine.registerComponent(SavePanel);
engine.registerComponent(TagComponent);
engine.registerComponent(TextureInformation);
/* wle:auto-register:end */

engine.scene.load(`${Constants.ProjectName}.bin`);

/* wle:auto-benchmark:start */
/* wle:auto-benchmark:end */
