export type GLBAssetKind = "avatar" | "office" | "furniture" | "prop";

export interface GLBAsset {
  slug: string;
  file: string;
  path: string;
  kind: GLBAssetKind;
  sizeMB: number;
  note: string;
}

export const GLB_ASSETS: GLBAsset[] = [
  { slug: "avatar-ghost", file: "Avatar_ghost.glb", path: "/GLB_Assets/Avatar_ghost.glb", kind: "avatar", sizeMB: 2.03, note: "Ghost, Lead Developer." },
  { slug: "avatar-zoro", file: "Avatar_zoro.glb", path: "/GLB_Assets/Avatar_zoro.glb", kind: "avatar", sizeMB: 3.96, note: "Zoro, Creative Lead." },
  { slug: "avatar-zara", file: "Avatar_zara.glb", path: "/GLB_Assets/Avatar_zara.glb", kind: "avatar", sizeMB: 2.6, note: "Zara, OpenClaw asset ops on zyra-mini." },
  { slug: "avatar-zyra", file: "Avatar_Zyra.glb", path: "/GLB_Assets/Avatar_Zyra.glb", kind: "avatar", sizeMB: 2.05, note: "Zyra, OpenClaw node watch on zyra-mini." },
  { slug: "avatar-1", file: "Avatar_1.glb", path: "/GLB_Assets/Avatar_1.glb", kind: "avatar", sizeMB: 8.86, note: "Generic council rig; contains one embedded animation; centimeter-scale export." },
  { slug: "avatar-2", file: "Avatar_2.glb", path: "/GLB_Assets/Avatar_2.glb", kind: "avatar", sizeMB: 2.1, note: "Generic operator rig; contains one embedded animation." },
  { slug: "avatar-3", file: "Avatar_3.glb", path: "/GLB_Assets/Avatar_3.glb", kind: "avatar", sizeMB: 3.23, note: "Static generic operator export; centimeter-scale." },
  { slug: "avatar-4", file: "Avatar_4.glb", path: "/GLB_Assets/Avatar_4.glb", kind: "avatar", sizeMB: 2.89, note: "Generic skinned operator rig." },
  { slug: "avatar-5", file: "Avatar_5.glb", path: "/GLB_Assets/Avatar_5.glb", kind: "avatar", sizeMB: 5.22, note: "Generic skinned operator rig." },
  { slug: "avatar-6", file: "Avatar_6.glb", path: "/GLB_Assets/Avatar_6.glb", kind: "avatar", sizeMB: 2.16, note: "Generic skinned operator rig." },
  { slug: "avatar-7", file: "Avatar_7.glb", path: "/GLB_Assets/Avatar_7.glb", kind: "avatar", sizeMB: 4.77, note: "Generic skinned operator rig." },
  { slug: "avatar-8", file: "Avatar_8.glb", path: "/GLB_Assets/Avatar_8.glb", kind: "avatar", sizeMB: 5.35, note: "Generic skinned operator rig." },
  { slug: "avatar-9", file: "Avatar_9.glb", path: "/GLB_Assets/Avatar_9.glb", kind: "avatar", sizeMB: 7.29, note: "Generic skinned operator rig." },
  { slug: "avatar-10", file: "Avatar_10.glb", path: "/GLB_Assets/Avatar_10.glb", kind: "avatar", sizeMB: 4.87, note: "Generic skinned operator rig." },
  { slug: "avatar-11", file: "Avatar_11.glb", path: "/GLB_Assets/Avatar_11.glb", kind: "avatar", sizeMB: 2.55, note: "Generic skinned operator rig." },
  { slug: "office-floor-1", file: "office_floor_option_1.glb", path: "/GLB_Assets/office_floor_option_1.glb", kind: "office", sizeMB: 37.09, note: "Rejected for default scene: heavy, about 697k position vertices." },
  { slug: "office-floor-2", file: "office_floor_option_2.glb", path: "/GLB_Assets/office_floor_option_2.glb", kind: "office", sizeMB: 10.85, note: "Chosen Phase B base: lighter, about 60.7k position vertices." },
  { slug: "desk", file: "furniture_desk.glb", path: "/GLB_Assets/furniture_desk.glb", kind: "furniture", sizeMB: 34.79, note: "Primary workbench cluster." },
  { slug: "server-rack", file: "furniture_server_rack.glb", path: "/GLB_Assets/furniture_server_rack.glb", kind: "furniture", sizeMB: 34.99, note: "OpenClaw node/server corner." },
  { slug: "tech", file: "furniture_tech.glb", path: "/GLB_Assets/furniture_tech.glb", kind: "furniture", sizeMB: 31.79, note: "Cyberpunk tech clutter and holographic props." },
  { slug: "couch", file: "furniture_couch.glb", path: "/GLB_Assets/furniture_couch.glb", kind: "furniture", sizeMB: 22.94, note: "Reel/cipher lounge station." },
  { slug: "computer-1", file: "furniture_computer 1.glb", path: "/GLB_Assets/furniture_computer%201.glb", kind: "furniture", sizeMB: 5.89, note: "Animated computer prop." },
  { slug: "computer-2", file: "furniture_computer_2.glb", path: "/GLB_Assets/furniture_computer_2.glb", kind: "furniture", sizeMB: 12.7, note: "Desktop computer cluster." },
  { slug: "wall-computer", file: "furniture_wall_computer.glb", path: "/GLB_Assets/furniture_wall_computer.glb", kind: "furniture", sizeMB: 0.89, note: "Monitor-wall prop." },
  { slug: "whiteboard", file: "furniture_whiteboard.glb", path: "/GLB_Assets/furniture_whiteboard.glb", kind: "furniture", sizeMB: 0.12, note: "Zoro/Compass whiteboard station." },
  { slug: "calendar", file: "furniture_wall_calendar.glb", path: "/GLB_Assets/furniture_wall_calendar.glb", kind: "furniture", sizeMB: 0.1, note: "Roadmap/calendar wall prop." },
  { slug: "cyberpunk-font", file: "cyberpunk_font.glb", path: "/GLB_Assets/cyberpunk_font.glb", kind: "prop", sizeMB: 0.25, note: "Phase B signage prop." },
];

export const CHOSEN_OFFICE_FLOOR = GLB_ASSETS.find((asset) => asset.slug === "office-floor-2")!;
export const GLB_ASSETS_BY_KIND = GLB_ASSETS.reduce<Record<GLBAssetKind, GLBAsset[]>>(
  (acc, asset) => {
    (acc[asset.kind] ??= []).push(asset);
    return acc;
  },
  { avatar: [], office: [], furniture: [], prop: [] },
);
