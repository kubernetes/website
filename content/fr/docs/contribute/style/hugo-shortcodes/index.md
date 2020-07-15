---
title: Hugo Shortcodes personnalisés
content_type: concept
---

<!-- overview -->

Cette page explique les shortcodes Hugo personnalisés pouvant être utilisés dans la documentation de Kubernetes Markdown.

En savoir plus sur shortcodes dans la [documentation Hugo](https://gohugo.io/content-management/shortcodes).


<!-- body -->

## Etat de la fonctionnalité

Dans une page de Markdown (fichier `.md`) de ce site, vous pouvez ajouter un code court pour afficher la version et l'état de la fonction documentée.

### Feature state demo

Ci-dessous se trouve une démo de l'extrait d'état de la fonctionnalité, qui affiche la fonctionnalité comme stable dans Kubernetes version 1.10.

```
{{</* feature-state for_k8s_version="v1.10" state="stable" */>}}
```

Rend à :

{{< feature-state for_k8s_version="v1.10" state="stable" >}}

Les valeurs valides pour `state` sont :

* alpha
* beta
* deprecated
* stable

### Feature state code

La version de Kubernetes affichée par défaut est celle de la page ou du site.
Ceci peut être modifié en passant le paramètre <code>for_k8s_version</code> shortcode.

````
{{</* feature-state for_k8s_version="v1.10" state="stable" */>}}
````

Rend à :

{{< feature-state for_k8s_version="v1.10" state="stable" >}}

#### Alpha feature

````
{{</* feature-state feature-state state="alpha" */>}}
````

Rend à :

{{< feature-state state="alpha" >}}

#### Beta feature

````
{{</* feature-state feature-state state="beta" */>}}
````

Rend à :

{{< feature-state state="beta" >}}

#### Stable feature

````
{{</* feature-state feature-state state="stable" */>}}
````

Rend à :

{{< feature-state state="stable" >}}

#### Deprecated feature

````
{{</* feature-state feature-state state="deprecated" */>}}
````

Rend à :

{{< feature-state state="deprecated" >}}

## Glossaire

Vous pouvez faire référence à des termes du glossaire avec une inclusion qui met à jour et remplace automatiquement le contenu avec les liens pertinents de [notre glossaire](/fr/docs/reference/glossary/).
When the term is moused-over by someone using the online documentation, the glossary entry displays a tooltip.

The raw data for glossary terms is stored at [https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/glossary), with a content file for each glossary term.

### Démonstration du glossaire

Par exemple, le snippet suivant est rendu à {{< glossary_tooltip text="cluster" term_id="cluster" >}} avec une infobulle :

````liquid
{{</* glossary_tooltip text="cluster" term_id="cluster" */>}}
````

## Tabs

Dans une page de démarque (fichier `.md`) de ce site, vous pouvez ajouter un jeu d'onglets pour afficher plusieurs saveurs d'une solution donnée.

The `tabs` shortcode takes these parameters:

* `name`: Le nom tel qu'il apparaît sur l'onglet.
* `codelang`: Si vous fournissez un contenu interne au shortcode `tab`, vous pouvez indiquer à Hugo quel langage de code utiliser pour activer la coloration syntaxique.
* `include`: Le fichier à inclure dans l'onglet.
  Si l'onglet vit dans un Hugo [leaf bundle](https://gohugo.io/content-management/page-bundles/#leaf-bundles), le fichier -- qui peut être n'importe quel type MIME supporté par Hugo -- est recherché dans le bundle lui-même.
  Si ce n'est pas le cas, la page de contenu qui doit être incluse est recherchée par rapport à la page en cours.
  Notez qu'avec le `include`, vous n'avez pas de contenu interne de shortcode et devez utiliser la syntaxe de fermeture automatique.
  Par exemple, <code>{{</* tab name="Content File #1" include="example1" /*/>}}</code>.
  La langue doit être spécifiée sous `codelang` ou la langue est prise en compte en fonction du nom du fichier.
  Les fichiers non contenus sont mis en surbrillance par défaut.
* Si votre contenu interne est Markdown, vous devez utiliser le délimiteur `%` pour entourer l'onglet.
  Par exemple, `{{%/* tab name="Tab 1" %}}This is **markdown**{{% /tab */%}}`
* Vous pouvez combiner les variations mentionnées ci-dessus dans un ensemble d'onglets.

Ci-dessous se trouve une démo du raccourci des onglets.

{{< note >}}
L'onglet **name** d'une définition `tabs` doit être unique dans une page de contenu.
{{< /note >}}

### Tabs demo: Code highlighting

```go-text-template
{{</* tabs name="tab_with_code" >}}
{{{< tab name="Tab 1" codelang="bash" >}}
echo "This is tab 1."
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "This is tab 2."
{{< /tab >}}}
{{< /tabs */>}}
```

Rend à:

{{< tabs name="tab_with_code" >}}
{{< tab name="Tab 1" codelang="bash" >}}
echo "This is tab 1."
{{< /tab >}}
{{< tab name="Tab 2" codelang="go" >}}
println "This is tab 2."
{{< /tab >}}
{{< /tabs >}}

### Tabs demo: Inline Markdown and HTML

```go-html-template
{{</* tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
This is **some markdown.**
{{< note >}}
It can even contain shortcodes.
{{< /note >}}
{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>Plain HTML</h3>
	<p>This is some <i>plain</i> HTML.</p>
</div>
{{< /tab >}}
{{< /tabs */>}}
```

Rend à:

{{< tabs name="tab_with_md" >}}
{{% tab name="Markdown" %}}
This is **some markdown.**

{{< note >}}
Il peut même contenir des shortcodes.
{{< /note >}}

{{% /tab %}}
{{< tab name="HTML" >}}
<div>
	<h3>Plain HTML</h3>
	<p>This is some <i>plain</i> HTML.</p>
</div>
{{< /tab >}}
{{< /tabs >}}

### Tabs demo: File include

```go-text-template
{{</* tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate" />}}
{{< /tabs */>}}
```

Rend à:

{{< tabs name="tab_with_file_include" >}}
{{< tab name="Content File #1" include="example1" />}}
{{< tab name="Content File #2" include="example2" />}}
{{< tab name="JSON File" include="podtemplate" />}}
{{< /tabs >}}



## {{% heading "whatsnext" %}}


* En savoir plus sur [Hugo](https://gohugo.io/).
* En savoir plus sur [écrire un nouveau sujet](/docs/home/contribute/write-new-topic/).
* En savoir plus sur [l'utilisation des page templates](/docs/home/contribute/page-templates/).
* En savoir plus sur [staging your changes](/docs/home/contribute/stage-documentation-changes/)
* En savoir plus sur [créer une pull request](/docs/home/contribute/create-pull-request/).


