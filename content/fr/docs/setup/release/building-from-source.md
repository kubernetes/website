---
title: Construire une release
content_template: templates/concept
description: Construire une release de la documentation Kubernetes
card:
  name: download
  weight: 20
  title: Construire une release
---
{{% capture overview %}}
Vous pouvez soit compiler une version à partir des sources, soit télécharger une version pré-compilée.  Si vous ne 
prévoyez pas de développer Kubernetes nous vous suggérons d'utiliser une version pré-compilée de la version actuelle,
 que l'on peut trouver dans le répertoire [Release Notes](/docs/setup/release/notes/).

Le code source de Kubernetes peut être téléchargé sur le repo [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

{{% /capture %}}

{{% capture body %}}
## Installer à partir des sources

Si vous installez simplement une version à partir des sources, il n'est pas nécessaire de mettre en place un environnement golang complet car tous les builds se font dans un conteneur Docker.

Construire une release est simple.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

Pour plus de détails sur le processus de release, voir le repertoire [`build`](http://releases.k8s.io/{{< param "githubbranch" >}}/build/) dans kubernetes/kubernetes.

{{% /capture %}}
