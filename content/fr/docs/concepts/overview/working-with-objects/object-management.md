---
title: Kubernetes Object Management
content_type: concept
weight: 20
---

<!-- overview -->
L'outil en ligne de commande `kubectl` prend en charge plusieurs façons différentes de créer et gérer des {{< glossary_tooltip text="objets" term_id="object" >}} Kubernetes.
Ce document donne un aperçu des différentes approches. 
Consultez le [livre Kubectl](https://kubectl.docs.kubernetes.io) pour plus de détails
sur la gestion des objets avec Kubectl.

<!-- body -->

## Management techniques

{{< warning >}}
Un objet Kubernetes doit être géré en utilisant une seule technique. Mélanger et combiner des techniques pour le même objet entraîne un comportement indéfini.
{{< /warning >}}

| Technique de gestion             | Opère sur             | Environnement recommandé | Operateurs supportés | Courbe d'apprentissage |
|----------------------------------|----------------------|------------------------|---------------------|-----------------------|
| Commandes impératives            | Objets en direct      | Projets de développement | 1+                  | La plus basse         |
| Configuration impérative d'objet | Fichiers individuels  | Projets de production   | 1                   | Modérée               |
| Configuration déclarative d'objet| Répertoires de fichiers | Projets de production | 1+                  | La plus élevée        |


## Commandes impératives

Lors de l'utilisation de commandes impératives, un utilisateur opère directement sur des objets
en direct dans un cluster.
L'utilisateur fournit les opérations à la commande `kubectl` en tant qu'arguments ou indicateurs.

C'est la méthode recommandée pour commencer ou exécuter une tâche ponctuelle dans un cluster.
Étant donné que cette technique opère directement sur des objets en direct,
elle ne fournit aucune historique des configurations précédentes.

### Exemples

Exécutez une instance du conteneur nginx en créant un objet Deployment :

```sh
kubectl create deployment nginx --image nginx
```
### Compromis

Avantages par rapport à la configuration d'objet :

- Les commandes sont exprimées par un seul mot d'action.
- Les commandes ne nécessitent qu'une seule étape pour apporter des modifications au cluster.

Inconvénients par rapport à la configuration d'objet :

- Les commandes ne s'intègrent pas aux processus de révision des modifications.
- Les commandes ne fournissent pas de piste d'audit associée aux modifications.
- Les commandes ne fournissent pas de source d'enregistrement, sauf ce qui est en direct.
- Les commandes ne fournissent pas de modèle pour créer de nouveaux objets.


## Configuration impérative d'objet

Dans la configuration impérative d'objet, la commande kubectl spécifie 
l'opération (créer, remplacer, etc.), des indicateurs facultatifs et au moins 
un nom de fichier. Le fichier spécifié doit contenir une définition complète 
de l'objet au format YAML ou JSON.

Consultez la [référence de l'API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) 
pour plus de détails sur les définitions d'objets.

{{< warning >}}
La commande impérative `replace` remplace la spécification existante
par celle nouvellement fournie, en supprimant toutes les modifications
apportées à l'objet qui ne figurent pas dans le fichier de configuration.
Cette approche ne doit pas être utilisée avec des types de ressources
dont les spécifications sont mises à jour indépendamment du fichier de configuration.
Par exemple, les services de type `LoadBalancer` ont leur champ `externalIPs` mis à jour indépendamment de la configuration par le cluster.
{{< /warning >}}

### Exemples

Créez les objets définis dans un fichier de configuration :

```sh
kubectl create -f nginx.yaml
```

Supprimez les objets définis dans deux fichiers de configuration :

```sh
kubectl delete -f nginx.yaml -f redis.yaml
```

Mettre à jour les objets définis dans un fichier de configuration
en écrasant la configuration en direct :

```sh
kubectl replace -f nginx.yaml
```

### Compromis

Avantages par rapport aux commandes impératives :

- La configuration d'objet peut être stockée dans un système de contrôle de source tel que Git.
- La configuration d'objet peut s'intégrer à des processus tels que la révision des modifications avant la validation et les pistes d'audit.
- La configuration d'objet fournit un modèle pour créer de nouveaux objets.

Inconvénients par rapport aux commandes impératives :

- La configuration d'objet nécessite une compréhension de base du schéma de l'objet.
- La configuration d'objet nécessite une étape supplémentaire consistant à rédiger un fichier YAML.

Avantages par rapport à la configuration d'objet déclarative :

- Le comportement de la configuration d'objet impérative est plus simple et plus facile à comprendre.
- À partir de la version 1.5 de Kubernetes, la configuration d'objet impérative est plus mature.

Inconvénients par rapport à la configuration d'objet déclarative :

- La configuration d'objet impérative fonctionne mieux sur des fichiers, pas sur des répertoires.
- Les mises à jour des objets en direct doivent être reflétées dans les fichiers de configuration, sinon elles seront perdues lors du prochain remplacement.

## Configuration déclarative d'objet

Lors de l'utilisation de la configuration déclarative d'objet, un utilisateur opère 
sur des fichiers de configuration d'objet stockés localement,
mais l'utilisateur ne définit pas les opérations à effectuer sur les fichiers.
Les opérations de création, de mise à jour et de suppression sont automatiquement détectées par `kubectl` pour chaque objet.
Cela permet de travailler sur des répertoires, où différentes opérations peuvent être nécessaires pour différents objets.

{{< note >}}
La configuration déclarative d'objet conserve les modifications apportées par d'autres,
même si les modifications ne sont pas fusionnées dans le fichier de configuration de l'objet. 
Cela est possible en utilisant l'opération d'API `patch` pour écrire uniquement les différences
observées, au lieu d'utiliser l'opération d'API `replace` pour remplacer l'ensemble de la configuration
de l'objet.
{{< /note >}}

### Exemples

Traitez tous les fichiers de configuration d'objet dans le répertoire `configs` et créez ou
appliquez les modifications aux objets en direct. Vous pouvez d'abord utiliser `diff` pour voir quelles modifications vont être
apportées, puis appliquer les modifications :

```sh
kubectl diff -f configs/
kubectl apply -f configs/
```

Traiter récursivement les répertoires :

```sh
kubectl diff -R -f configs/
kubectl apply -R -f configs/
```

### Compromis

Avantages par rapport à la configuration impérative d'objet :

- Les modifications apportées directement aux objets en direct sont conservées, même si elles ne sont pas fusionnées dans les fichiers de configuration.
- La configuration déclarative d'objet offre une meilleure prise en charge pour travailler sur des répertoires et détecte automatiquement les types d'opérations (création, patch, suppression) par objet.

Inconvénients par rapport à la configuration impérative d'objet :

- La configuration déclarative d'objet est plus difficile à déboguer et à comprendre lorsque les résultats sont inattendus.
- Les mises à jour partielles à l'aide de diffs créent des opérations de fusion et de patch complexes.

## {{% heading "whatsnext" %}}

- [Gestion des objets Kubernetes en utilisant des commandes impératives](/docs/tasks/manage-kubernetes-objects/imperative-command/)
- [Gestion impérative des objets Kubernetes en utilisant des fichiers de configuration](/docs/tasks/manage-kubernetes-objects/imperative-config/)
- [Gestion déclarative des objets Kubernetes à l'aide de fichiers de configuration](/docs/tasks/manage-kubernetes-objects/declarative-config/)
- [Gestion déclarative des objets Kubernetes en utilisant Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
- [Référence des commandes Kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
- [Livre Kubectl](https://kubectl.docs.kubernetes.io)
- [Référence de l'API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)

