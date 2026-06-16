# BBC Boutique 3D

Boutique virtuelle 3D de **Bleu Blanc Couture** — un espace luxe où le visiteur
se déplace librement, un mur par créatrice, pièces accrochées sur des portants
dorés. Les produits proviennent de Shopify via la Storefront API.

Ambiance Hermès / Gucci · Or `#C9A96E` · Crème `#FAF8F5` · Bodoni Moda + Raleway.

## Stack

| Couche       | Technologie                          |
| ------------ | ------------------------------------ |
| Framework    | Next.js 14 (App Router)              |
| 3D           | React Three Fiber + @react-three/drei |
| Animations   | Framer Motion                        |
| Style        | Tailwind CSS                         |
| Data         | Shopify Storefront API               |
| Déploiement  | Vercel                               |

## Démarrage

```bash
npm install
cp .env.local.example .env.local   # puis renseigner le token Shopify
npm run dev                        # http://localhost:3000/boutique
```

> Sans token Shopify, la boutique tourne quand même : les murs affichent des
> pièces "placeholder" aux couleurs de chaque créatrice. Renseignez le token
> pour charger les vrais produits.

### Variables d'environnement

| Variable                            | Description                                  |
| ----------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`  | `bleublancouture.myshopify.com`              |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN`   | Token Storefront API (read_products/collections) |
| `NEXT_PUBLIC_SITE_URL`              | URL publique du site                         |

Token : Shopify Admin → Apps → Develop apps → Create app → Storefront API access.

## Navigation

- **ZQSD / WASD** ou **flèches** : se déplacer
- **Clic-glisser** (ou doigt sur mobile) : regarder autour
- **Points à droite** : voler directement vers une créatrice
- **Clic sur une pièce** : fiche produit + lien d'achat

## Structure

```
src/
├── app/
│   ├── boutique/            # Page boutique (server fetch) + client orchestrateur
│   └── api/products/        # Route de fallback côté client
├── components/
│   ├── boutique/            # Scène R3F : Room, BrandWall, ClothingItem, Lighting…
│   ├── ui/                  # Overlays DOM : Entry, Loading, BrandStrip, Popup…
│   └── effects/             # TextReveal, GoldParticles, ShaderBackground
├── hooks/                   # Caméra, détection de mur, fetch produits
├── lib/                     # Client Shopify, config des 4 créatrices
└── types/                   # Types Shopify + helpers
```

## Les 4 créatrices

| Mur | Créatrice            | Univers                          |
| --- | -------------------- | -------------------------------- |
| N   | My Tailor is Joh     | Deadstock Haute Couture          |
| E   | La 8e Fois           | Fabriqué à Paris 2024            |
| S   | Le Manoir à Lingerie | Lingerie Fine                    |
| W   | Teran Conde Paris    | Élégance Singulière              |

## Déploiement (Vercel)

```bash
npm run build
npx vercel deploy
```

Configurer les variables d'env sur Vercel avant le déploiement.

## Effets "21st.dev"

Les composants de `src/components/effects/` reproduisent les effets décrits dans
le prompt d'origine (reveal de texte lettre par lettre, particules dorées, fond
"shader" pastel). Ils sont écrits à la main en Framer Motion / Canvas pour rester
sans dépendance externe. Pour régénérer des variantes via le **21st.dev Magic
MCP**, connecter le MCP puis utiliser les commandes `/ui` du prompt initial.
