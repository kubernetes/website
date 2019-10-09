---
title: Conventions d'utilisation de kubectl
description: kubectl conventions
content_template: templates/concept
---

{{% capture overview %}}
Conventions d'utilisation recommandées pour `kubectl`.
{{% /capture %}}

{{% capture body %}}

## Utiliser `kubectl` dans des scripts réutilisables

Pour une sortie stable dans un script :

* Demandez un des formats de sortie orienté machine, comme `-o name`, `-o json`, `-o yaml`, `-o go-template` ou `-o jsonpath`.
* Spécifiez complètement la version. Par exemple, `jobs.v1.batch/monjob`. Cela va assurer que kubectl n'utilise pas sa version par défaut, qui risque d'évoluer avec le temps.
* Utilisez le flag `--generator` pour coller à un comportement spécifique lorsque vous utilisez les commandes basées sur un générateur, comme `kubectl run` ou `kubectl expose`.
* Ne vous basez pas sur un contexte, des préférences ou tout autre état implicite.

## Bonnes pratiques

### `kubectl run`

Pour que `kubectl run` satisfasse l'infrastructure as code :

* Taggez les images avec un tag spécifique à une version et n'utilisez pas ce tag pour une nouvelle version. Par exemple, utilisez `:v1234`, `v1.2.3`, `r03062016-1-4`, plutôt que `:latest` (Pour plus d'informations, voir [Bonnes pratiques pour la configuration](/docs/concepts/configuration/overview/#container-images)).
* Capturez les paramètres dans un script enregistré, ou tout au moins utilisez `--record` pour annoter les objets créés avec la ligne de commande correspondante pour une image peu paramétrée.
* Capturez le script pour une image fortement paramétrée.
* Passez à des fichiers de configuration enregistrés dans un système de contrôle de source pour des fonctionnalités désirées mais non exprimables avec des flags de `kubectl run`.
* Collez à une version spécifique de [générateur](#generators), comme `kubectl run --generator=deployment/v1beta1`.

#### Générateurs

Vous pouvez créer les ressources suivantes en utilisant `kubectl run` avec le flag `--generator` :

| Ressource                         | groupe api         | commande kubectl                                  |
|-----------------------------------|--------------------|---------------------------------------------------|
| Pod                               | v1                 | `kubectl run --generator=run-pod/v1`              |
| Replication controller (déprécié) | v1                 | `kubectl run --generator=run/v1`                  |
| Deployment (déprécié)             | extensions/v1beta1 | `kubectl run --generator=deployment/v1beta1`      |
| Deployment (déprécié)             | apps/v1beta1       | `kubectl run --generator=deployment/apps.v1beta1` |
| Job (déprécié)                    | batch/v1           | `kubectl run --generator=job/v1`                  |
| CronJob (déprécié)                | batch/v1beta1      | `kubectl run --generator=cronjob/v1beta1`         |
| CronJob (déprécié)                | batch/v2alpha1     | `kubectl run --generator=cronjob/v2alpha1`        |

{{< note >}}
`kubectl run --generator` sauf pour `run-pod/v1` est déprécié depuis v1.12.
{{< /note >}}

Si vous n'indiquez pas de flag de générateur, d'autres flags vous demandent d'utiliser un générateur spécifique. La table suivante liste les flags qui vous forcent à préciser un générateur spécifique, selon la version du cluster :

|   Ressource générée    | Cluster v1.4 et suivants | Cluster v1.3          | Cluster v1.2                               | Cluster v1.1 et précédents                 |
|:----------------------:|--------------------------|-----------------------|--------------------------------------------|--------------------------------------------|
| Pod                    | `--restart=Never`        | `--restart=Never`     | `--generator=run-pod/v1`                   | `--restart=OnFailure` OU `--restart=Never` |
| Replication Controller | `--generator=run/v1`     | `--generator=run/v1`  | `--generator=run/v1`                       | `--restart=Always`                         |
| Deployment             | `--restart=Always`       | `--restart=Always`    | `--restart=Always`                         | N/A                                        |
| Job                    | `--restart=OnFailure`    | `--restart=OnFailure` | `--restart=OnFailure` OU `--restart=Never` | N/A                                        |
| Cron Job               | `--schedule=<cron>`      | N/A                   | N/A                                        | N/A                                        |

{{< note >}}
Ces flags utilisent un générateur par défaut uniquement lorsque vous n'avez utilisé aucun flag.
Cela veut dire que lorsque vous combinez `--generator` avec d'autres flags, le générateur que vous avez spécifié plus tard ne change pas. Par exemple, dans cluster v1.4, si vous spécifiez d'abord `--restart=Always`, un Deployment est créé ; si vous spécifiez ensuite `--restart=Always` et `--generator=run/v1`, alors un Replication Controller sera créé.
Ceci vous permet de coller à un comportement spécifique avec le générateur, même si le générateur par défaut est changé par la suite.
{{< /note >}}

Les flags définissent le générateur dans l'ordre suivant : d'abord le flag `--schedule`, puis le flag `--restart`, et finalement le flag `--generator`.

Pour vérifier la ressource qui a été finalement créée, utilisez le flag `--dry-run`, qui fournit l'objet qui sera soumis au cluster.

### `kubectl apply`

* Vous pouvez utiliser `kubectl apply` pour créer ou mettre à jour des ressources. Pour plus d'informations sur l'utilisation de `kubectl apply` pour la mise à jour de ressources, voir le [livre Kubectl](https://kubectl.docs.kubernetes.io).

{{% /capture %}}
