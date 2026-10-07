import { beforeSunset } from "./before-sunset";
import { moveableFeast } from "./moveable-feast";
import { sunAlsoRises } from "./sun-also-rises";
import type { FrenchStory } from "./types";

export const french: Record<string, FrenchStory> = { ...beforeSunset, ...sunAlsoRises, ...moveableFeast };
