---
title: Organisation du contenu
content_type: concept
weight: 40
---


<!-- overview -->

Ce site utilise Hugo.
Dans Hugo, l'[organisation du contenu](https://gohugo.io/content-management/organization/) est un concept de base.



<!-- body -->

{{% note %}}
**Astuce Hugo:** Démarrez Hugo avec `hugo server --navigateToChanged` pour les sessions d'édition de contenu.
{{% /note %}}

## Listes de pages

### Ordre des pages

Le menu latéral de la documentation, le navigateur de la page de documentation, etc. sont listés selon l'ordre de tri par défaut de Hugo, qui trie par poids (à partir de 1), par date (la plus récente en premier), et enfin par titre du lien.

Si vous voulez déplacer une page ou une section vers le haut, placez un poids dans l'entête de la page :

```yaml
title: My Page
weight: 10
```

{{% note %}}
Pour les poids de page, il peut être judicieux de ne pas utiliser 1, 2, 3..., mais un autre intervalle, disons 10, 20, 30... Ceci vous permet d'insérer des pages où vous voulez plus tard.
{{% /note %}}

### Menu principal de la documentation

Le menu principal `Documentation` est construit à partir des sections ci-dessous `docs/` avec le drapeau `main_menu` placé dans l'entête du fichier de contenu de la section `_index.md' :

```yaml
main_menu: true
```

Notez que le titre du lien est récupéré à partir du `linkTitle` de la page, donc si vous voulez qu'il soit différent du titre, changez-le dans le fichier du contenu cible :

```yaml
main_menu: true
title: Page Title
linkTitle: Title used in links
```

{{% note %}}
Ce qui précède doit être fait par langue.
Si vous ne voyez pas votre section dans le menu, c'est probablement parce qu'elle n'est pas identifiée comme une section par Hugo.
Créez un fichier de contenu `_index.md` dans le dossier de la section.
{{% /note %}}

### Menu latéral de documentation

Le menu latéral de la barre de documentation est construit à partir de l'arborescence _de la section courante_ commençant sous `docs/`.

Il affichera toutes les sections et leurs pages.

Si vous ne voulez pas lister une section ou une page, mettez l'option `toc_hide` à `true` dans l'entête :

```yaml
toc_hide: true
```

Lorsque vous naviguez vers une section contenant du contenu, la section ou la page spécifique (par exemple `_index.md`) est affichée.
Sinon, la première page à l'intérieur de cette section est affichée.

### Navigateur de documentation

Le navigateur de page sur la page d'accueil de la documentation est construit en utilisant toutes les sections et pages qui sont directement sous la section `docs`.

Si vous ne voulez pas lister une section ou une page, mettez l'option `toc_hide` à `true` dans la partie avant :

```yaml
toc_hide: true
```

### Menu principal

Les liens du site dans le menu en haut à droite -- et aussi dans le pied de page -- sont construits par des recherches de pages.
C'est pour s'assurer que la page existe réellement.
Ainsi, si la section `case-studies` n'existe pas dans un site (langue), le lien n'apparaitra pas.

## Paquets de pages

In addition to standalone content pages (Markdown files), Hugo supports [Page Bundles](https://gohugo.io/content-management/page-bundles/).

One example is [Custom Hugo Shortcodes](/docs/contribute/style/hugo-shortcodes/).
On considère qu'il s'agit d'un "paquet de feuilles".
Tout ce qui se trouve sous le répertoire, y compris le fichier `index.md', fera partie du paquet.
Cela inclut également les liens relatifs aux pages, les images qui peuvent être traitées, etc :

```bash
en/docs/home/contribute/includes
├── example1.md
├── example2.md
├── index.md
└── podtemplate.json
```

Un autre exemple largement utilisé est celui du paquet `includes`.
Il définit `headless : true` dans l'entête, ce qui signifie qu'il n'obtient pas son propre URL.
Il n'est utilisé que dans d'autres pages.

```bash
en/includes
├── default-storage-class-prereqs.md
├── federated-task-tutorial-prereqs.md
├── index.md
├── partner-script.js
├── partner-style.css
├── task-tutorial-prereqs.md
├── user-guide-content-moved.md
└── user-guide-migration-notice.md
```

Quelques notes importantes sur les fichiers dans les paquets :

* Pour les paquets traduits, tous les fichiers non contenus manquants seront hérités des fichiers de langue anglaise.
  Cela permet d'éviter les doublons.
* Tous les fichiers d'un bundle sont ce que Hugo appelle `Resources` et vous pouvez fournir des métadonnées par langue, comme les paramètres et le titre, même s'il ne prend pas en charge les entêtes (fichiers YAML etc.).
  Voir [Page Resources Metadata](https://gohugo.io/content-management/page-resources/#page-resources-metadata).
* La valeur que vous obtenez de `.RelPermalink` d'un `Resource` est relative à la page.
  Voir [Permalinks](https://gohugo.io/content-management/urls/#permalinks).

## Styles

La source `SASS` des feuilles de style pour ce site est stockée sous `src/sass` et peut être construite avec `make sass` (notez que Hugo aura bientôt le support `SASS`, voir <https://github.com/gohugoio/hugo/issues/4243>.



## {{% heading "whatsnext" %}}


* [Hugo shortcodes personnalisés](/docs/contribute/style/hugo-shortcodes/)
* [Style guide](/docs/contribute/style/style-guide)


