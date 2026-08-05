---
title: Rédiger une nouveau sujet
content_type: task
weight: 20
---

<!-- overview -->
Cette page montre comment créer un nouveau sujet pour la documentation Kubernetes.


## {{% heading "prerequisites" %}}

Créez un fork du dépôt de la documentation de Kubernetes comme décrit dans [Commencez à contribuer](/fr/docs/contribute/start/).


<!-- steps -->

## Choisir un type de page

Alors que vous vous préparez à écrire un nouveau sujet, pensez au type de page qui convient le mieux à votre contenu :

<table>

  <tr>
    <td>Concept</td>
    <td>Une page de concept explique certains aspects de Kubernetes. Par exemple, une page conceptuelle pourrait décrire l'objet Kubernetes `Déploiement` et expliquer le rôle qu'il joue en tant qu'application pendant son déploiement, sa mise à l'échelle, ou sa mise à jour. Généralement, les pages conceptuelles n'incluent pas de séquences d'étapes, mais fournissent plutôt des liens vers des tâches ou des tutoriels. Pour un exemple de sujet de concept, voir <a href="/fr/docs/concepts/architecture/nodes/">Noeuds</a>.</td>
  </tr>

  <tr>
    <td>Tâche</td>
    <td>Une page de tâches montre comment faire une seule chose. L'idée est de donner aux lecteurs une séquence d'étapes qu'ils peuvent suivre en lisant la page. Une page de tâches peut être courte ou longue, à condition qu'elle reste concentrée sur un domaine. Dans une page de tâches, il est acceptable de mélanger de brèves explications avec les étapes à effectuer, mais si vous avez besoin de fournir une longue explication, vous devriez le faire dans un sujet de concept. Les tâches et les concepts connexes devraient être reliés les uns aux autres. Pour un exemple d'une courte page de tâches, consultez <a href="/fr/docs/tasks/configure-pod-container/configure-volume-storage/">Configurer un pod en utilisant un volume pour le stockage
</a>. Pour un exemple de page de tâches plus longue, voir <a href="/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/">Configure Liveness and Readiness Probes</a></td>
  </tr>

  <tr>
    <td>Tutoriel</td>
    <td>Une page de tutoriel montre comment atteindre un objectif qui relie plusieurs fonctionnalités de Kubernetes. Un tutoriel peut fournir plusieurs séquences d'étapes que les lecteurs peuvent suivre en lisant la page. Ou il peut fournir des explications sur des éléments de code connexes. Par exemple, un tutoriel pourrait fournir un aperçu d'un exemple de code. Un tutoriel peut inclure de brèves explications sur les caractéristiques de Kubernetes qui sont liées entre elles, mais devrait comporter des liens vers des sujets de concepts connexes pour une explication approfondie des caractéristiques individuelles.</td>
  </tr>

</table>

Utilisez un modèle pour chaque nouvelle page.
Chaque type de page a un [template](/docs/contribute/style/page-templates/) que vous pouvez utiliser lorsque vous écrivez votre sujet.
L'utilisation de templates permet d'assurer la cohérence entre les sujets d'un type donné.

## Choisir un titre et un nom de fichier

Choisissez un titre qui contient les mots-clés que vous voulez que les moteurs de recherche trouvent.
Créez un nom de fichier qui utilise les mots de votre titre séparés par des tirets.
Par exemple, le sujet avec titre [Using an HTTP Proxy to Access the Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api/) has filename `http-proxy-access-api.md`.
Vous n'avez pas besoin de mettre "kubernetes" dans le nom du fichier, car "kubernetes" est déjà dans l'URL du sujet, par exemple :

       /docs/tasks/access-kubernetes-api/http-proxy-access-api/

## Ajout du titre du sujet à l'entête

Dans votre sujet, insérez un champ `title` dans l'entête [frontmatter](https://jekyllrb.com/docs/frontmatter/).
L'entête est le bloc YAML qui se trouve entre les lignes à trois tirets en haut de la page.
En voici un exemple :

    ---
    title: Using an HTTP Proxy to Access the Kubernetes API
    ---

## Choisir un répertoire

En fonction de votre type de page, placez votre nouveau fichier dans un sous-répertoire de l'un d'entre eux :

* /content/en/docs/tasks/
* /content/en/docs/tutorials/
* /content/en/docs/concepts/

Vous pouvez placer votre fichier dans un sous-répertoire existant ou en créer un nouveau.

## Placer votre sujet dans la table des matières

La table des matières est construite dynamiquement en utilisant la structure de répertoire de la source de documentation.
Les répertoires de niveau supérieur sous `/content/fr/docs/` créent une navigation de niveau supérieur, et les sous-répertoires ont chacun des entrées dans la table des matières.

Chaque sous-répertoire possède un fichier `_index.md`, qui représente la page d'accueil du contenu d'un sous-répertoire donné.
Le `_index.md` n'a pas besoin d'un template.
Il peut contenir une vue d'ensemble du contenu des rubriques du sous-répertoire.

Les autres fichiers d'un répertoire sont triés par ordre alphabétique par défaut.
Ce n'est presque jamais le meilleur ordre.
Pour contrôler le tri relatif des sujets dans un sous-répertoire, définissez la clé `weight:` front-matter sur un entier.
Généralement, nous utilisons des multiples de 10, pour tenir compte de l'ajout de sujets plus tard.
Par exemple, un sujet ayant un poids de `10` sera précédé d'un sujet ayant un poids de `20`.

## Intégrer du code dans votre sujet

Si vous voulez inclure du code dans votre sujet, vous pouvez incorporer le code dans votre fichier directement à l'aide de l'option de syntaxe de bloc de code de markdown.
Ceci est recommandé dans les cas suivants (liste non exhaustive) :

* Le code indique la sortie d'une commande telle que `kubectl get deploy mydeployment -o json | jq '.status'`.
* Le code n'est pas assez générique pour que les utilisateurs puissent l'essayer.
  Par exemple, vous pouvez intégrer le fichier YAML pour créer un Pod qui dépend d'une implementation [Flexvolume](/docs/concepts/storage/volumes#flexvolume) spécifique.
* Le code est un exemple incomplet parce qu'il a pour but de mettre en évidence une partie d'un fichier plus volumineux.
  Par exemple, lorsque vous décrivez des façons de personnaliser l'attribut [PodSecurityPolicy](/docs/tasks/administer-cluster/sysctl-cluster/#podsecuritypolicy) pour certaines raisons, vous pouvez fournir un court snippet directement dans le fichier.
* Le code n'est pas destiné à être testé par les utilisateurs pour d'autres raisons.
  Par exemple, lorsque vous décrivez comment un nouvel attribut doit être ajouté à une ressource à l'aide de la commande `kubectl edit`, vous pouvez fournir un court exemple qui inclut seulement l'attribut à ajouter.

## Inclure le code d'un autre fichier

Une autre façon d'inclure du code dans votre sujet est de créer un nouveau fichier d'exemple complet (ou un groupe de fichiers d'exemple), puis de référencer l'exemple de votre sujet.
Utilisez cette méthode pour inclure des exemples de fichiers YAML lorsque l'échantillon est générique et réutilisable, et que vous voulez favoriser leur utilisation.

Lors de l'ajout d'un nouveau fichier d'exemple autonome, tel qu'un fichier YAML, placez le code dans l'un des sous-répertoires `<LANG>/examples/` où `<LANG>` est la langue utilisé dans votre page.
Dans votre fichier, utilisez le shortcode `codenew` :

```none
{{%/* codenew file="<RELPATH>/my-example-yaml>" */%}}
```
où `<RELPATH>` est le chemin vers le fichier à inclure, relatif au répertoire `examples`.
Le shortcode Hugo suivant fait référence à un fichier YAML situé sur `/content/en/examples/pods/storage/gce-volume.yaml`.

```none
{{%/* codenew file="pods/storage/gce-volume.yaml" */%}}
```

{{< note >}}
Pour afficher les shortcodes Hugo bruts comme dans l'exemple ci-dessus et empêcher Hugo de les interpréter, utilisez des commentaires de style C directement après les caractères `<` et avant les caractères `>`.
Voir le code de cette page pour un exemple.
{{< /note >}}

## Montrer comment créer un objet API à partir d'un fichier de configuration

Si vous avez besoin de démontrer comment créer un objet API basé sur un fichier de configuration, placez le fichier de configuration dans l'un des sous-répertoires sous `<LANG>/examples`.

Dans votre sujet, affichez cette commande :

```
kubectl create -f https://k8s.io/examples/pods/storage/gce-volume.yaml
```

{{< note >}}
Lors de l'ajout de nouveaux fichiers YAML dans le répertoire `<LANG>/examples`, assurez-vous que le fichier est également inclus dans le fichier `<LANG>/examples_test.go`.
La CI pour le site Web exécute automatiquement ce scénario de test lorsque des PRs sont soumises pour s'assurer que tous les exemples réussissent les tests.
{{< /note >}}

Pour un exemple d'un sujet qui utilise cette technique, voir [Running a Single-Instance Stateful Application](/docs/tutorials/stateful-application/run-stateful-application/).

## Ajouter des images à un sujet

Placez les fichiers images dans le répertoire `/images`.
Le format d'image préféré est SVG.



## {{% heading "whatsnext" %}}


* En savoir plus sur [l'utilisation des templates de pages](/docs/home/contribute/page-templates/).
* En savoir plus sur [le staging de vos changements](/docs/home/contribute/stage-documentation-changes/).
* En savoir plus sur [la création d'une pull request](/docs/home/contribute/create-pull-request/).


