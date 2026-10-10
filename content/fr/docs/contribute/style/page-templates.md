---
title: Utilisation des modèles de page
content_type: concept
weight: 30
card:
  name: contribute
  weight: 30
---

<!-- overview -->

Lorsque vous ajoutez de nouveaux sujets, appliquez-leur l'un des templates suivants.
Ceci standardise l'expérience utilisateur d'une page donnée.

Les templates de page sont dans le répertoire [`layouts/partials/templates`](https://git.k8s.io/website/layouts/partials/templates) du dépôt [`kubernetes/website`](https://github.com/kubernetes/website).

{{< note >}}
Chaque nouveau sujet doit utiliser un modèle.
Si vous n'êtes pas sûr du modèle à utiliser pour un nouveau sujet, commencez par un [template concept](#concept-template).
{{< /note >}}



<!-- body -->

## Concept template

Une page de concept explique certains aspects de Kubernetes.
Par exemple, une page conceptuelle peut décrire l'objet Kubernetes `Deployment` et expliquer le rôle qu'il joue en tant qu'application une fois qu'il est déployé, dimensionné et mis à jour.
Généralement, les pages conceptuelles n'incluent pas de séquences d'étapes, mais fournissent plutôt des liens vers des tâches ou des tutoriels.

Pour écrire une nouvelle page concept, créez un fichier Markdown dans un sous-répertoire du répertoire `/content/fr/docs/concepts`, avec les caractéristiques suivantes :

- Dans l'entête YAML de la page, définissez `content_type: concept`.
- Dans le corps de la page, définissez les variables `capture` requises et les variables optionnelles que vous voulez inclure :

    | Variable      | Required? |
    |---------------|-----------|
    | overview      | yes       |
    | body          | yes       |
    | whatsnext     | no        |

    Le corps de la page ressemblera à ceci (supprimez toutes les captures optionnelles dont vous n'avez pas besoin) :

    ```
    {{%/* capture overview */%}}

    {{%/* /capture */%}}

    {{%/* capture body */%}}

    {{%/* /capture */%}}

    {{%/* capture whatsnext */%}}

    {{%/* /capture */%}}
    ```

- Remplissez chaque section de contenu. Suivez ces lignes directrices :
  - Organiser le contenu avec les rubriques H2 et H3.
  - Pour `overview`, définir le contexte du sujet à l'aide d'un seul paragraphe.
  - Pour `body`, expliquer le concept.
  - Pour `whatsnext`, fournir une liste à puces de sujets (5 au maximum) pour en apprendre davantage sur le concept.

[Annotations](/docs/concepts/overview/working-with-objects/annotations/) est un exemple publié du template de concept.
Cette page utilise également le modèle de concept.

## Template de tâche

Une page de tâches montre comment faire une seule chose, généralement en donnant une courte séquence d'étapes.
Les pages de tâches ont une explication minimale, mais fournissent souvent des liens vers des sujets conceptuels qui fournissent un contexte et des connaissances connexes.

Pour écrire une nouvelle page de tâches, créez un fichier Markdown dans un sous-répertoire du répertoire `/content/fr/docs/tasks`, avec les caractéristiques suivantes :

- Dans l'entête YAML de la page, définissez `content_type: task`.
- Dans le corps de la page, définissez les variables `capture` requises et les variables optionnelles que vous voulez inclure :

    | Variable      | Required? |
    |---------------|-----------|
    | overview      | yes       |
    | prerequisites | yes       |
    | steps         | no        |
    | discussion    | no        |
    | whatsnext     | no        |

    Le corps de la page ressemblera à ceci (supprimez toutes les captures optionnelles dont vous n'avez pas besoin) :

    ```
    {{%/* capture overview */%}}

    {{%/* /capture */%}}

    {{%/* capture prerequisites */%}}

    {{</* include "task-tutorial-prereqs.md" */>}} {{</* version-check */>}}

    {{%/* /capture */%}}

    {{%/* capture steps */%}}

    {{%/* /capture */%}}

    {{%/* capture discussion */%}}

    {{%/* /capture */%}}

    {{%/* capture whatsnext */%}}

    {{%/* /capture */%}}
    ```

- Dans chaque section, écrivez votre contenu.
  Suivez les directives suivantes :
  - Utilisez un minimum d'en-têtes H2 (avec deux caractères `#` en tête de liste).
    Les sections elles-mêmes sont intitulées automatiquement par le modèle.
  - Pour `overview`, utilisez un paragraphe pour définir le contexte de l'ensemble du sujet.
  - Pour `prerequisites`, utiliser des listes à puces dans la mesure du possible.
    Commencez à ajouter des prérequis supplémentaires sous la balise `include`.
    Les conditions préalables par défaut incluent un cluster Kubernetes en cours d'exécution.
  - Pour `steps`, utiliser des listes numérotées.
  - Pour la discussion, utilisez le contenu normal pour développer l'information couverte dans la section `steps`.
  - Pour `whatsnext`, donnez une liste de 5 sujets au maximum qui peuvent être intéressant à lire ensuite.

Voici un exemple de sujet publié qui utilise le template de tasks [Using an HTTP proxy to access the Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api).

## Tutorial template

Une page de tutoriel montre comment atteindre un objectif qui est plus grand qu'une seule tâche.
Typiquement, une page de tutoriel comporte plusieurs sections, chacune d'entre elles ayant une séquence d'étapes.
Par exemple, un tutoriel pourrait fournir un aperçu d'un exemple de code qui illustre une certaine caractéristique de Kubernetes.
Les didacticiels peuvent inclure des explications au niveau de la surface, mais devraient être reliés à des sujets connexes sur les concepts pour des explications approfondies.

Pour écrire une nouvelle page de tutoriel, créez un fichier Markdown dans un sous-répertoire du répertoire `/content/fr/docs/tutorials`, avec les caractéristiques suivantes :

- Dans l'entête YAML de la page, définissez `content_type: tutorial`.
- Dans le corps de la page, définissez les variables `capture` requises et les variables optionnelles que vous voulez inclure :

    | Variable      | Required? |
    |---------------|-----------|
    | overview      | yes       |
    | prerequisites | yes       |
    | objectives    | yes       |
    | lessoncontent | yes       |
    | cleanup       | no        |
    | whatsnext     | no        |

    Le corps de la page ressemblera à ceci (supprimez toutes les captures optionnelles dont vous n'avez pas besoin) :

    ```
    {{%/* capture overview */%}}

    {{%/* /capture */%}}

    {{%/* capture prerequisites */%}}

    {{</* include "task-tutorial-prereqs.md" */>}} {{</* version-check */>}}

    {{%/* /capture */%}}

    {{%/* capture objectives */%}}

    {{%/* /capture */%}}

    {{%/* capture lessoncontent */%}}

    {{%/* /capture */%}}

    {{%/* capture cleanup */%}}

    {{%/* /capture */%}}

    {{%/* capture whatsnext */%}}

    {{%/* /capture */%}}
    ```

- Dans chaque section, écrivez votre contenu. Suivez les directives suivantes :
  - Utilisez un minimum d'en-têtes H2 (avec deux caractères `#` en tête de liste).
    Les sections elles-mêmes sont intitulées automatiquement par le template.
  - Pour `overview`, utiliser un paragraphe pour définir le contexte de l'ensemble du sujet.
  - Pour `prerequisites`, utiliser des listes à puces dans la mesure du possible.
    Ajoutez des prérequis supplémentaires en dessous de ceux inclus par défaut.
  - Pour `objectives`, utiliser des listes à puces.
  - Pour `lessoncontent`, utiliser un mélange de listes numérotées et de contenu narratif, le cas échéant.
  - Pour `cleanup`, utiliser des listes numérotées pour décrire les étapes de nettoyage de l'état du cluster une fois la tâche terminée.
  - Pour `whatsnext`, Donnez une liste de 5 sujets au maximum qu'il serait intéressant à lire ensuite.

Voici un exemple de sujet publié qui utilise le modèle de tutoriel [Running a Stateless Application Using a Deployment](/docs/tutorials/stateless-application/run-stateless-application-deployment/).



## {{% heading "whatsnext" %}}


- En savoir plus sur le [style guide](/docs/contribute/style/style-guide/)
- En savoir plus sur l'[organisation des contenus](/docs/contribute/style/content-organization/)


