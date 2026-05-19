---
title: Interface de Runtime de Conteneur (CRI)
content_type: concept
weight: 60
---

<!-- overview -->

Le CRI (Container Runtime Interface) est une interface de plugin qui permet au kubelet d'utiliser 
une grande variété de runtimes de conteneurs, sans avoir besoin de recompiler les composants du cluster.

Vous avez besoin d'un
{{<glossary_tooltip text="runtime de conteneur" term_id="container-runtime">}} fonctionnel
sur chaque nœud de votre cluster, afin que le
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} puisse lancer
{{< glossary_tooltip text="Pods" term_id="pod" >}} et leurs conteneurs.

{{< glossary_definition prepend="L'Interface de Runtime de Conteneur (CRI) est" term_id="container-runtime-interface" length="all" >}}

<!-- body -->

## L'API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Le kubelet agit en tant que client lorsqu'il se connecte au runtime de conteneur via gRPC.
Les points de terminaison du service de runtime et d'image doivent être disponibles
dans le runtime de conteneur, ce qui peut être configuré séparément dans le kubelet
en utilisant les indicateurs de ligne de commande `--image-service-endpoint` (voir la [référence des options du kubelet](/docs/reference/command-line-tools-reference/kubelet)).

Pour Kubernetes v{{< skew currentVersion >}}, le kubelet préfère utiliser CRI `v1`.
Si un runtime de conteneur ne prend pas en charge `v1` de CRI, alors le kubelet essaie de
négocier toute version plus ancienne prise en charge.
Le kubelet de v{{< skew currentVersion >}} peut également négocier CRI `v1alpha2`, mais
cette version est considérée comme obsolète.
Si le kubelet ne peut pas négocier une version de CRI prise en charge, le kubelet abandonne
et ne s'enregistre pas en tant que nœud.

## Mise à niveau

Lors de la mise à niveau de Kubernetes, le kubelet essaie de sélectionner automatiquement la
dernière version de CRI lors du redémarrage du composant. Si cela échoue, alors le fallback
aura lieu comme mentionné ci-dessus. Si une nouvelle connexion gRPC était nécessaire car le
runtime de conteneur a été mis à niveau, alors le runtime de conteneur doit également
prendre en charge la version initialement sélectionnée, sinon la reconnexion est censée échouer. Cela
nécessite un redémarrage du kubelet.

## {{% heading "whatsnext" %}}

- En savoir plus sur la définition du protocole CRI [ici](https://github.com/kubernetes/cri-api/blob/c75ef5b/pkg/apis/runtime/v1/api.proto)
