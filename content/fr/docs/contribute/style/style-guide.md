---
title: Documentation Style Guide
linktitle: Style guide
content_type: concept
weight: 10
card:
  name: contribute
  weight: 20
  title: Documentation Style Guide
---

<!-- overview -->
Cette page donne des directives de style d'écriture pour la documentation de Kubernetes.
Ce sont des lignes directrices, pas des règles.
Faites preuve de discernement et n'hésitez pas à proposer des modifications à ce document dans le cadre d'une pull request.

Pour plus d'informations sur la création de nouveau contenu pour les documents Kubernetes, suivez les instructions sur[l'utilisation des templates](/fr/docs/contribute/style/page-templates/) et [création d'une pull request de documentation](/fr/docs/contribute/start/#improve-existing-content).


<!-- body -->

{{< note >}}
La documentation de Kubernetes utilise [Blackfriday Markdown Renderer](https://github.com/russross/blackfriday) ainsi que quelques [Hugo Shortcodes](/docs/home/contribute/includes/) pour prendre en charge les entrées de glossaire, les onglets et la représentation de l'état des fonctionnalités.
{{< /note >}}

## Language

La documentation de Kubernetes utilise l'anglais américain comme langue de référence.

## Normes de formatage de la documentation

### Utilisez le camel case pour les objets d'API

Lorsque vous faites référence à un objet API, utilisez les mêmes lettres majuscules et minuscules que celles utilisées dans le nom d'objet réel.
Typiquement, les noms des objets de l'API utilisent le [camel case](https://en.wikipedia.org/wiki/Camel_case).

Ne divisez pas le nom de l'objet API en mots séparés.
Par exemple, utilisez PodTemplateList, et pas Pod Template List.

Référez-vous aux objets de l'API sans dire "objet", à moins que l'omission de "objet" n'entraîne une construction maladroite.

| À faire                                          | À éviter                                  |
|--------------------------------------------------|-------------------------------------------|
| Le Pod dispose de deux conteneurs.               | La pod a deux conteneurs.                 |
| Le Deployment est responsable de ce qui suit ... | L'objet Déployment est responsable de ... |
| Une PodList est une liste de Pod.                | Une Pod List est une liste de pods.       |
| Les deux ContainerPorts ...                      | Les deux objets ContainerPort ...         |
| Les deux objets ContainerStateTerminated ...     | Les deux ContainerStateTerminateds ...    |

### Use angle brackets for placeholders

Use angle brackets for placeholders.
Tell the reader what a placeholder represents.

1. Affiche des informations sur un Pod :

       kubectl describe pod <pod-name>

    where `<pod-name>` is the name of one of your Pods.

### Use bold for user interface elements

| À faire                 | À éviter              |
|-------------------------|-----------------------|
| Cliquez sur **Fork**.   | Cliquez sur "Fork".   |
| Sélectionnez **Other**. | Sélectionnez 'Other'. |

### Utiliser l'italique pour définir ou introduire de nouveaux termes.

| À faire                                     | À éviter                                      |
|---------------------------------------------|-----------------------------------------------|
| Un _cluster_ est un ensemble de nœuds ...   | Un "cluster" est un ensemble de nœuds ...     |
| Ces composantes forment le _control plane_. | Ces composantes forment le **control plane**. |

### Utiliser un style de code pour les noms de fichiers, les répertoires et les chemins d'accès

<table>
  <tr><th>À faire</th><th>À éviter</th></tr>
  <tr><td>Open the <code>envars.yaml</code> file.</td><td>Open the envars.yaml file.</td></tr>
  <tr><td>Aller dans le répertoire <code>/docs/tutorials</code>.</td><td>Go to the /docs/tutorials directory.</td></tr>
  <tr><td>Open the <code>/_data/concepts.yaml</code><!--to-unbreak-atom-highlighting_--> file.</td><td>Open the /_data/concepts.yaml<!--to-unbreak-atom-highlighting_--> file.</td></tr>
</table>

### Utiliser la norme internationale pour la ponctuation entre guillemets

| À faire                                         | À éviter                                        |
|-------------------------------------------------|-------------------------------------------------|
| events are recorded with an associated "stage". | events are recorded with an associated "stage." |
| The copy is called a "fork".                    | The copy is called a "fork."                    |

## Inline code formatting

### Use code style for inline code and commands

For inline code in an HTML document, use the `<code>` tag. In a Markdown document, use the backtick (`).

<table>
  <tr><th>À faire</th><th>À éviter</th></tr>
  <tr><td>The <code>kubectl run</code> command creates a Deployment.</td><td>The "kubectl run" command creates a Deployment.</td></tr>
  <tr><td>For declarative management, use <code>kubectl apply</code>.</td><td>For declarative management, use "kubectl apply".</td></tr>
  <tr><td>Enclose code samples with triple backticks. <code>(```)</code></td><td>Enclose code samples with any other syntax.</td></tr>
</table>

{{< note >}}
Le site Web prend en charge la coloration syntaxique pour les échantillons de code, mais la spécification d'une langue est facultative.
{{< /note >}}

### Utiliser le style de code pour les noms de champs d'objets

<table>
  <tr><th>À faire</th><th>À éviter</th></tr>
  <tr><td>Set the value of the <code>replicas</code> field in the configuration file.</td><td>Définissez la valeur du champ "replicas" dans le fichier de configuration.</td></tr>
  <tr><td>The value of the <code>exec</code> field is an ExecAction object.</td><td>La valeur du champ "exec" est un objet ExecAction.</td></tr>
</table>

### Utiliser le style normal pour les chaînes de caractères et les valeurs de champs entiers

Pour les valeurs de champ de type chaîne de caractères ou entier, utilisez un style normal sans guillemets.

| À faire                                                  | À éviter                                                            |
|----------------------------------------------------------|---------------------------------------------------------------------|
| Set the value of <code>imagePullPolicy</code> to Always. | Set the value of <code>imagePullPolicy</code> to "Always".          |
| Set the value of <code>image</code> to nginx:1.8.        | Set the value of <code>image</code> to <code>nginx:1.8</code>.      |
| Set the value of the <code>replicas</code> field to 2.   | Set the value of the <code>replicas</code> field to <code>2</code>. |

## Code snippet formatting

### Ne pas inclure l'invite de commande

| À faire          | À éviter           |
|------------------|--------------------|
| kubectl get pods | $ kubectl get pods |

### Séparer les commandes de la sortie

Vérifiez que le Pod fonctionne sur le nœud que vous avez choisi :

    kubectl get pods --output=wide

La sortie est similaire à celle-ci :

    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0

### Versioning Kubernetes examples

Code examples and configuration examples that include version information should be consistent with the accompanying text.

If the information is version specific, the Kubernetes version needs to be defined in the `prerequisites` section of the [Task template](/docs/contribute/style/page-templates/#task-template) or the [Tutorial template] (/docs/contribute/style/page-templates/#tutorial-template).
Once the page is saved, the `prerequisites` section is shown as **Before you begin**.

Pour spécifier la version de Kubernetes pour une tâche ou une page de tutoriel, incluez `min-kubernetes-server-version` dans l'entête de la page.

Si l'exemple YAML se trouve dans un fichier autonome, recherchez et passez en revue les sujets qui l'incluent comme référence.
Vérifiez que toutes les rubriques utilisant le YAML autonome ont les informations de version appropriées définies.
Si un fichier YAML autonome n'est référencé à partir d'aucun sujet, pensez à le supprimer au lieu de le mettre à jour.

Par exemple, si vous écrivez un tutoriel pertinent pour Kubernetes version 1.8, la première partie de votre fichier de démarque doit ressembler à ceci :

```yaml
---
title: <your tutorial title here>
min-kubernetes-server-version: v1.8
---
```

Dans les exemples de code et de configuration, n'incluez pas de commentaires sur les versions alternatives.
Veillez à ne pas inclure d'énoncés incorrects dans vos exemples sous forme de commentaires, tels que :

```yaml
apiVersion: v1 # earlier versions use...
kind: Pod
...
```

## Liste de mots Kubernetes.io

Une liste de termes et de mots spécifiques à Kubernetes à utiliser de manière cohérente sur le site.

| Term       | Usage                                               |
|------------|-----------------------------------------------------|
| Kubernetes | Kubernetes a toujours une majuscule.                |
| Docker     | Docker a toujours une majuscule.                    |
| SIG Docs   | SIG Docs plutôt que SIG-DOCS ou d'autres variantes. |

## Shortcodes

Hugo [Shortcodes](https://gohugo.io/content-management/shortcodes) help create different rhetorical appeal levels.
Notre documentation prend en charge trois shortcodes différents dans cette catégorie : **Note** {{</* note */>}}, **Mise en garde** {{</* caution */>}}, et **Avertissement** {{</* warning */>}}.

1. Entourez le texte d'un raccourci d'ouverture et de fermeture.

2. Utilisez la syntaxe suivante pour appliquer un style :

    ```
    {{</* note */>}}
    Il n'est pas nécessaire d'inclure un préfixe ; le shortcode fournit automatiquement (Note:, Caution:, etc.).
    {{</* /note */>}}
    ```

La sortie est :

{{< note >}}
Le préfixe que vous choisissez est le même que le texte de la balise.
{{< /note >}}

### Note

Utilisez {{</* note *//>}} pour mettre en surbrillance un conseil ou une information qu'il peut être utile de connaître.

Par exemple :

```
{{</* note */>}}
Vous pouvez _toujours_ utiliser Markdown à l'intérieur de ces légendes.
{{</* /note */>}}
```

La sortie est :

{{< note >}}
Vous pouvez _toujours_ utiliser Markdown à l'intérieur de ces légendes.
{{< /note >}}

### Mise en garde

Utilisez {{</* caution *//>}} pour attirer l'attention sur une information importante afin d'éviter les pièges.

Par exemple :

```
{{</* caution */>}}
Le style de légende ne s'applique qu'à la ligne directement au-dessus de la balise.
{{</* /caution */>}}
```

La sortie est :

{{< caution >}}
Le style de légende ne s'applique qu'à la ligne directement au-dessus de la balise.
{{< /caution >}}

### Avertissement

Utilisez {{</* warning *//>}} pour indiquer un danger ou une information cruciale à suivre.

Par exemple :

```
{{</* warning */>}}
Méfiez-vous.
{{</* /warning */>}}
```

La sortie est :

{{< warning >}}
Méfiez-vous.
{{< /warning >}}

### Katacoda Embedded Live Environment

Ce bouton permet aux utilisateurs d'exécuter Minikube dans leur navigateur en utilisant le [Katacoda Terminal](https://www.katacoda.com/embed/panel).
Il abaisse le seuil d'entrée en permettant aux utilisateurs d'utiliser Minikube en un seul clic au lieu de passer par l'ensemble du processus d'installation Minikube et Kubectl localement.

The Embedded Live Environment is configured to run `minikube start` and lets users complete tutorials in the same window as the documentation.

{{< caution >}}
La session est limitée à 15 minutes.
{{< /caution >}}

For example:

```
{{</* kat-button */>}}
```

La sortie est :

{{< kat-button >}}

## Common Shortcode Issues

### Ordered Lists

Un Shortcode interrompra les listes numérotées à moins que vous ne mettiez une indentation de 4 espaces avant l'avis et l'étiquette.

Par exemple :

    1. Préchauffer le four à 350˚F

    1. Préparer la pâte et la verser dans un moule à charnière.
       {{</* note */>}}**Note:** Graisser la casserole pour de meilleurs résultats.{{</* /note */>}}

    1. Cuire au four de 20 à 25 minutes ou jusqu'à ce que ce soit pris.

La sortie est :

1. Préchauffer le four à 350˚F

1. Préparer la pâte et la verser dans un moule à charnière.

    {{< note >}}Graisser la casserole pour de meilleurs résultats.{{< /note >}}

1. Cuire au four de 20 à 25 minutes ou jusqu'à ce que ce soit pris.

### Expressions Includes

Les Shortcodes dans les expressions d'include brisera la compilation du site.
Vous devez les insérer dans le document parent, avant et après avoir appelé l'include.
Par exemple :

```
{{</* note */>}}
{{</* include "task-tutorial-prereqs.md" */>}}
{{</* /note */>}}
```

## Meilleures pratiques en matière de contenu

Cette section contient des suggestions de pratiques exemplaires pour un contenu clair, concis et cohérent.

### Utiliser le présent

| À faire                        | À éviter                         |
|--------------------------------|----------------------------------|
| Cette commande lance un proxy. | Cette commande lancera un proxy. |

Exception : Utilisez le futur ou le passé s'il est nécessaire pour transmettre le sens correct.

### Utiliser la voix active

| À faire                                              | À éviter                                                  |
|------------------------------------------------------|-----------------------------------------------------------|
| Vous pouvez explorer l'API à l'aide d'un navigateur. | L'API peut être explorée à l'aide d'un navigateur.        |
| Le fichier YAML spécifie le nombre de répliques.     | Le nombre de répliques est spécifié dans le fichier YAML. |

Exception : Utilisez la voix passive si la voix active conduit à une construction maladroite.

### Utiliser un langage simple et direct

Utilisez un langage simple et direct.
Évitez d'utiliser des expressions inutiles, comme "s'il vous plaît".

| À faire                           | À éviter                                                  |
|-----------------------------------|-----------------------------------------------------------|
| Pour créer un ReplicaSet, ...     | Afin de créer un ReplicaSet, ...                          |
| Voir le fichier de configuration. | Veuillez consulter le fichier de configuration.           |
| Voir les Pods.                    | Avec cette prochaine commande, nous allons voir les Pods. |

### S'adresser au lecteur en tant que "vous"

| À faire                                        | À éviter                                    |
|------------------------------------------------|---------------------------------------------|
| Vous pouvez créer un déploiement en ...        | Nous allons créer un déploiement en ...     |
| Dans l'édition précédente, vous pouvez voir... | Dans la sortie précédente, on peut voir ... |

### Évitez les phrases latines

Préférez les termes français aux abréviations latines.

| À faire           | À éviter  |
|-------------------|-----------|
| Par exemple, ...  | e.g., ... |
| C'est à dire, ... | i.e., ... |

Exception : Utilisez "etc." pour et cetera.

## Tendances à éviter

### Évitez d'utiliser "nous"

L'utilisation du "nous" dans une phrase peut prêter à confusion, car le lecteur pourrait ne pas savoir s'ils font partie du "nous" que vous décrivez.

| À faire                                               | À éviter                                                  |
|-------------------------------------------------------|-----------------------------------------------------------|
| La version 1.4 comprend ...                           | Dans la version 1.4, nous avons ajouté ...                |
| Kubernetes offre une nouvelle fonctionnalité pour ... | Nous proposons une nouvelle fonctionnalité ...            |
| Cette page vous apprend à utiliser les Pods.          | Dans cette page, nous allons en savoir plus sur les Pods. |

### Évitez le jargon et les expressions idiomatiques

Certains lecteurs parlent le français comme seconde langue.
Évitez le jargon et les expressions idiomatiques pour les aider à mieux comprendre.

| À faire                   | À éviter                   |
|---------------------------|----------------------------|
| En interne, ...           | Sous le capot, ...         |
| Créer un nouveau cluster. | Monter un nouveau cluster. |

### Évitez les déclarations sur l'avenir

Évitez de faire des promesses ou de donner des conseils sur l'avenir.
Si vous avez besoin de parler d'une fonctionnalité alpha, placez le texte sous un titre qui l'identifie comme une fonctionnalité alpha.

### Évitez les déclarations qui seront bientôt périmées

Évitez les mots comme "actuellement" et "nouveau".
Une caractéristique qui est nouvelle aujourd'hui pourrait ne pas être considérée comme nouvelle dans quelques mois.

| À faire                             | À éviter                                              |
|-------------------------------------|-------------------------------------------------------|
| Dans la version 1.4, ...            | Dans la version actuelle, ...                         |
| La fonction de fédération offre ... | La nouvelle fonctionnalité de la Fédération offre ... |



## {{% heading "whatsnext" %}}


* En savoir plus sur [writing a new topic](/docs/home/contribute/write-new-topic/).
* En savoir plus sur [using page templates](/docs/home/contribute/page-templates/).
* En savoir plus sur [staging your changes](/docs/home/contribute/stage-documentation-changes/)
* En savoir plus sur [creating a pull request](/docs/home/contribute/create-pull-request/).


