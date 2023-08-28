---
title: Lister toutes les images de conteneur exécutées dans un cluster
content_type: task
weight: 100
---

<!-- overview -->

Cette page montre comment utiliser kubectl pour répertorier toutes les images de conteneur pour les pods s'exécutant dans un cluster.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

Dans cet exercice, vous allez utiliser kubectl pour récupérer tous les pods exécutés dans un cluster et formater la sortie pour extraire la liste des conteneurs pour chacun.

## Répertorier toutes les images de conteneurs dans tous les namespaces

- Récupérez tous les pods dans tous les namespace à l'aide de `kubectl get pods --all-namespaces`
- Formatez la sortie pour inclure uniquement la liste des noms d'image de conteneur à l'aide de `-o jsonpath={.items[*].spec.containers[*].image}`.
  Cela analysera récursivement le champ `image` du json retourné.
  - Voir la [reference jsonpath](/docs/reference/kubectl/jsonpath/) pour plus d'informations sur l'utilisation de jsonpath.
- Formatez la sortie à l'aide des outils standard: `tr`, `sort`, `uniq`
  - Utilisez `tr` pour remplacer les espaces par des nouvelles lignes
  - Utilisez `sort` pour trier les résultats
  - Utilisez `uniq` pour agréger le nombre d'images

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" |\
tr -s '[[:space:]]' '\n' |\
sort |\
uniq -c
```

La commande ci-dessus renverra récursivement tous les champs nommés `image` pour tous les éléments retournés.

Comme alternative, il est possible d'utiliser le chemin absolu vers le champ d'image dans le Pod.
Cela garantit que le champ correct est récupéré même lorsque le nom du champ est répété, par ex. de nombreux champs sont appelés `name` dans un élément donné:

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}"
```

Le jsonpath est interprété comme suit:

- `.items[*]`: pour chaque valeur renvoyée
- `.spec`: obtenir les spécifications
- `.containers[*]`: pour chaque conteneur
- `.image`: obtenir l'image

{{< note >}}
Lors de la récupération d'un seul pod par son nom, par exemple `kubectl get pod nginx`, la portion `.items[*]` du chemin doit être omis car un seul pod est renvoyé au lieu d'une liste d'éléments.
{{< /note >}}

## Liste des images de conteneurs par pod

Le formatage peut être contrôlé davantage en utilisant l'opération `range` pour parcourir les éléments individuellement.

```shell
kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{"\n"}{.metadata.name}{":\t"}{range .spec.containers[*]}{.image}{", "}{end}{end}' |\
sort
```

## Filtrage des images de conteneur de liste par label de pod

Pour cibler uniquement les pods correspondant à un label spécifique, utilisez l'indicateur -l.
Les éléments suivants correspondent uniquement aux pods avec les labels `app=nginx`.

```shell
kubectl get pods --all-namespaces -o jsonpath="{.items[*].spec.containers[*].image}" -l app=nginx
```

## Filtrage des images de conteneur de liste par namespace de pod

Pour cibler uniquement les pods dans un namespace spécifique, utilisez l'indicateur de namespace.
Ce qui suit correspond uniquement aux pods du namespace `kube-system`.

```shell
kubectl get pods --namespace kube-system -o jsonpath="{.items[*].spec.containers[*].image}"
```

## Répertorier les images de conteneurs en utilisant un go-template au lieu de jsonpath

Comme alternative à jsonpath, Kubectl peut aussi utiliser les [go-templates](https://pkg.go.dev/text/template) pour formater la sortie:

```shell
kubectl get pods --all-namespaces -o go-template --template="{{range .items}}{{range .spec.containers}}{{.image}} {{end}}{{end}}"
```

## {{% heading "whatsnext" %}}

### Reference

- Guide de référence pour [Jsonpath](/docs/reference/kubectl/jsonpath/)
- Guide de référence pour les [Go template](https://pkg.go.dev/text/template)
