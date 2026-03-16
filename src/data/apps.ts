import rappelIcon from "@/assets/rappel-produit-icon.png";
import mysteryIcon from "@/assets/mysterypix-icon.png";
import mathIcon from "@/assets/math-match-icon.png";
import allFavesIcon from "@/assets/AllFaves-icon.png";
import { AppData } from "./types";

export const apps: AppData[] = [
  {
    id: "rappel-produit",
    name: "Rappel Produit",
    icon: rappelIcon,
    appStoreUrl: "https://apps.apple.com/us/app/rappel-produit/id6449599235?l=fr-FR",
  },
  {
    id: "mysterypix",
    name: "MysteryPix",
    icon: mysteryIcon,
    appStoreUrl: "https://apps.apple.com/us/app/mysterypix/id6744659004?l=fr-FR",
  },
  {
    id: "math-match-memory",
    name: "Math-Match Memory",
    icon: mathIcon,
    appStoreUrl: "https://apps.apple.com/fr/app/math-match-memory/id6754247952",
  },
  {
    id: "allfaves",
    name: "AllFaves",
    icon: allFavesIcon,
    appStoreUrl: "https://apps.apple.com/app/allfaves/id6760546463",
  },
];