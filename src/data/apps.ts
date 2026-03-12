import rappelIcon from "@/assets/rappel-produit-icon.png";
import mysteryIcon from "@/assets/mysterypix-icon.png";
import mathIcon from "@/assets/math-match-icon.png";
import { AppData } from "./types";

export const apps: AppData[] = [
  {
    id: "rappel-produit",
    name: "Rappel Produit",
    tagline: "Vérifiez les rappels de produits en un instant",
    description:
      "Restez informé pour consommer en toute sérénité. Scannez un produit, recherchez par nom ou catégorie, et découvrez immédiatement s'il fait l'objet d'un rappel officiel. Protégez vos proches en partageant l'info en un clic ! Toutes les données proviennent du site officiel gouvernemental rappel.conso.gouv.fr.",
    category: "Shopping",
    icon: rappelIcon,
    appStoreUrl:
      "https://apps.apple.com/us/app/rappel-produit/id6449599235?l=fr-FR",
    features: [
      "Scan de code-barres",
      "Recherche par nom ou catégorie",
      "Données officielles gouvernementales",
      "Partage rapide des alertes",
    ],
  },
  {
    id: "mysterypix",
    name: "MysteryPix",
    tagline: "Devinez le mot mystère",
    description:
      "Le jeu parfait pour pimenter vos soirées entre amis ou en famille ! Choisissez une image mystérieuse, devinez le mot caché et lancez des défis ou des vérités piquantes. Jouez en solo, en multijoueur ou avec l'IA.",
    category: "Jeux de société",
    icon: mysteryIcon,
    appStoreUrl:
      "https://apps.apple.com/us/app/mysterypix/id6744659004?l=fr-FR",
    features: [
      "Mode solo et multijoueur",
      "Intelligence artificielle",
      "Défis et vérités",
      "Mode Premium avec niveaux illimités",
    ],
  },
  {
    id: "math-match-memory",
    name: "Math-Match Memory",
    tagline: "Apprends les maths en t'amusant",
    description:
      "Transforme les maths en jeu de mémoire amusant ! Parfait pour apprendre et réviser les tables de multiplication, addition, soustraction et division. Trois niveaux de difficulté pour progresser à son rythme.",
    category: "Éducation",
    icon: mathIcon,
    appStoreUrl:
      "https://apps.apple.com/fr/app/math-match-memory/id6754247952",
    features: [
      "3 niveaux de difficulté",
      "Multiplication, addition, soustraction, division",
      "Suivi des progrès",
      "Confidentialité garantie",
    ],
  },
];
