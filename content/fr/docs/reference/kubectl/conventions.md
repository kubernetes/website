---
title: Conventions d'utilisation de kubectl
description: kubectl conventions
content_type: concept
---

<!-- overview -->
Conventions d'utilisation recommandées pour `kubectl`.


<!-- body -->

## Utiliser `kubectl` dans des scripts réutilisables

Pour une sortie stable dans un script :

* Demandez un des formats de sortie orienté machine, comme `-o name`, `-o json`, `-o yaml`, `-o go-template` ou `-o jsonpath`.
* Spécifiez complètement la version. Par exemple, `jobs.v1.batch/monjob`. Cela va assurer que kubectl n'utilise pas sa version par défaut, qui risque d'évoluer avec le temps.
* Ne vous basez pas sur un contexte, des préférences ou tout autre état implicite.

## Bonnes pratiques

### `kubectl run`

Pour que `kubectl run` satisfasse l'infrastructure as code :

* Taggez les images avec un tag spécifique à une version et n'utilisez pas ce tag pour une nouvelle version. Par exemple, utilisez `:v1234`, `v1.2.3`, `r03062016-1-4`, plutôt que `:latest` (Pour plus d'informations, voir [Bonnes pratiques pour la configuration](/docs/concepts/configuration/overview/#container-images)).
* Capturez le script pour une image fortement paramétrée.
* Passez à des fichiers de configuration enregistrés dans un système de contrôle de source pour des fonctionnalités désirées mais non exprimables avec des flags de `kubectl run`.

Vous pouvez utiliser l'option `--dry-run` pour prévisualiser l'objet qui serait envoyé à votre cluster, sans réellement l'envoyer.

{{< note >}}
Tous les générateurs `kubectl` sont dépréciés. Voir la documentation de Kubernetes v1.17 pour une [liste](https://v1-17.docs.kubernetes.io/fr/docs/reference/kubectl/conventions/#g%C3%A9n%C3%A9rateurs) de générateurs et comment ils étaient utilisés.
{{< /note >}}

#### Générateurs
Vous pouvez générer les ressources suivantes avec une commande kubectl, `kubectl create --dry-run -o yaml`:
```
  clusterrole         Crée un ClusterRole.
  clusterrolebinding  Crée un ClusterRoleBinding pour un ClusterRole particulier.
  configmap           Crée une configmap à partir d'un fichier local, un répertoire ou une valeur litérale.
  cronjob             Crée un cronjob avec le nom spécifié.
  deployment          Crée un deployment avec le nom spécifié.
  job                 Crée un job avec le nom spécifié.
  namespace           Crée un namespace avec le nom spécifié.
  poddisruptionbudget Crée un pod disruption budget avec le nom spécifié.
  priorityclass       Crée une priorityclass avec le nom spécifié.
  quota               Crée un quota avec le nom spécifié.
  role                Crée un role avec une unique règle.
  rolebinding         Crée un RoleBinding pour un Role ou ClusterRole particulier.
  secret              Crée un secret en utilisant la sous-commande spécifiée.
  service             Crée un service en utilisant la sous-commande spécifiée.
  serviceaccount      Crée un service account avec le nom spécifié.
```

### `kubectl apply`

* Vous pouvez utiliser `kubectl apply` pour créer ou mettre à jour des ressources. Pour plus d'informations sur l'utilisation de `kubectl apply` pour la mise à jour de ressources, voir le [livre Kubectl](https://kubectl.docs.kubernetes.io).


