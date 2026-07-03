export interface Character {
  id: string;
  name: string;
  /** "procedural" grows through the animated pixel-kaiju stages; "sprite" is a static image that scales up with stage. */
  kind: "procedural" | "sprite";
  src?: string;
}

const MONSTER_COUNT = 48;

export const CHARACTERS: Character[] = [
  { id: "kaiju", name: "Kaiju", kind: "procedural" },
  ...Array.from({ length: MONSTER_COUNT }, (_, i) => {
    const n = i + 1;
    return { id: `monster-${n}`, name: `Monster ${n}`, kind: "sprite" as const, src: `/monsters/monster-${n}.png` };
  }),
];

export function getCharacter(id: string): Character {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}
