# Office Runtime Motion Pack

These GLB clips are the shared motion source for the web office runtime.

## Files

- `M_Standing_Idle_001.glb`
- `M_Walk_001.glb`
- `M_Talking_Variations_001.glb`

## Source

Downloaded from the official Ready Player Me animation library repository and used as the retarget source for the local Wolf3D-style office avatars.

Reference:

- [readyplayerme/animation-library](https://github.com/readyplayerme/animation-library)

## Runtime use

- Loaded by `web/src/components/game/office-v2/AnimatedOfficeAvatar.tsx`
- Retargeted at runtime onto local avatar skeletons with `SkeletonUtils.retargetClip`
- Used for founder free-roam, NPC walking loops, and desk-side talk/idling states

## Notes

- These clips are the shared baseline motion pack for Phase B.
- If higher-fidelity retargeting is needed later, Zara can bake replacement clips on `zyra-mini` and drop them into this directory.
