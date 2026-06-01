# Bleu Blanc Couture — Thème Shopify

Thème Shopify **Online Store 2.0** reproduisant le site Bleu Blanc Couture
(mode Made in France, multi-créatrices). Toutes les pages sont éditables depuis
**Personnaliser** (theme editor), et le catalogue / les fiches produits sont
branchés sur les vraies données Shopify.

## 1. Installation

1. Compresser le contenu de ce dossier en `.zip` (les dossiers `assets`,
   `config`, `layout`, `locales`, `sections`, `snippets`, `templates` doivent
   être **à la racine** du zip), ou utiliser le zip déjà fourni.
2. Dans Shopify : **Boutique en ligne → Thèmes → Ajouter un thème →
   Importer un fichier zip**.
3. **Prévisualiser**, puis **Publier**.

## 2. Configuration indispensable (une fois)

### Menus (Boutique en ligne → Navigation)
- **Menu principal** (`main-menu`) : Catalogue, Nos Créateurs, Journal,
  Notre Histoire, Contact.
- **Pied de page** (`footer`) : liens « Explorer » + mentions légales.

### Pages (Boutique en ligne → Pages) — choisir le bon **modèle** à droite
| Page          | Modèle (template)      |
|---------------|------------------------|
| Notre Histoire| `page.histoire`        |
| Nos Créateurs | `page.creators`        |
| Fiche créateur| `page.creator-detail`  |
| FAQ           | `page.faq`             |
| Contact       | `page.contact`         |

### Blog
Créer un blog **Journal** (Boutique en ligne → Articles de blog). La page
d'accueil et le bandeau « Journal » s'y branchent automatiquement.

### Produits
- **Fournisseur (vendor)** = nom de la créatrice (ex. « My Tailor is Joh »).
  S'affiche sur les cartes et la fiche produit.
- **Option** nommée **« Taille »** → boutons de taille (XS, S, M, L, XL).
- **Images** : la 1re image = visuel principal, la 2e = survol. Sans image, un
  dégradé « tone » s'affiche en repli (le design ne casse jamais).

### Métachamps produit (namespace `custom`) — « Passeport de Fabrication »
Réglages → Métachamps → Produits. Créez ces métachamps (texte) :

| Clé                  | Exemple                                   |
|----------------------|-------------------------------------------|
| `collection_name`    | Sœur / Illusion / Conception…             |
| `atelier`            | My Tailor is Joh — Le Marais, Paris        |
| `matiere`            | 100% laine vierge — deadstock HC          |
| `temps_confection`   | ≈ 14 heures, à la main                     |
| `creatrice`          | Johanna Richard                           |
| `origine`            | Confectionné à Paris, France              |
| `edition`            | Série limitée — 12 exemplaires            |
| `matieres_entretien` | (texte enrichi) entretien                 |
| `made_in_france`     | (vrai/faux) masque le badge si « faux »   |

Les lignes du passeport s'affichent uniquement si le métachamp est renseigné.

### Filtres du catalogue
Installez l'app gratuite **Search & Discovery** (Shopify) et configurez les
filtres (marque, couleur, taille, prix…). Ils apparaissent automatiquement dans
la barre latérale du catalogue, déjà stylée.

## 3. Personnalisation (Personnaliser)
- **Couleurs / logo / réseaux sociaux** : Personnaliser → *Paramètres du thème*.
- **Page d'accueil** : héros, manifeste, sélection, créateurs, histoire,
  engagements, journal, newsletter — chaque bloc est réordonnable / éditable.
- **En-tête / pied de page** : barre d'annonce, menus, newsletter.

## 4. Structure
```
assets/      base.css (design), bbc-shopify.css (liaison Shopify), global.js
config/      settings_schema.json, settings_data.json
layout/      theme.liquid, password.liquid
locales/     fr.default.json
sections/    héros, manifeste, produits, créateurs, fiche produit, catalogue…
snippets/    icon, image-layers, product-card
templates/   index, product, collection, page.*, blog, article, cart, search…
```

## Notes
- Le design (typographies Bodoni Moda + Raleway, animations, dégradés) est
  conservé tel quel dans `assets/base.css`.
- `assets/bbc-shopify.css` ajoute le rendu des vraies images, le panier, la
  recherche et les états de variantes.
- L'ajout au panier se fait en AJAX avec repli sans JavaScript.
