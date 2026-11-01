---
title: Interface de Runtime de Conteneur (CRI)
content_type: concept
weight: 60
---

<!-- overview -->

Le CRI (Container Runtime Interface) est une interface de plugin qui permet au kubelet d'utiliser une grande variété de runtimes de conteneurs, sans avoir besoin de recompiler les composants du cluster.

Vous avez besoin d'un
{{<glossary_tooltip text="runtime de conteneur" term_id="container-runtime">}}
fonctionnel sur chaque nœud de votre cluster, afin que le
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} puisse lancer des
{{< glossary_tooltip text="Pods" term_id="pod" >}} et leurs conteneurs.

{{< glossary_definition prepend="L'Interface de Runtime de Conteneur (CRI) est" term_id="cri" length="all" >}}

<!-- body -->

## L'API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Le kubelet agit en tant que client lorsqu'il se connecte au runtime de conteneur via gRPC.
Les points de terminaison du runtime et du service d'images doivent être disponibles dans le runtime de conteneur. Ils peuvent être configurés séparément dans le kubelet à l'aide du paramètre de ligne de commande
`--container-runtime-endpoint`
(consultez la [référence des options du kubelet](/docs/reference/command-line-tools-reference/kubelet/)).

Pour Kubernetes v1.26 et les versions ultérieures, le kubelet exige que le runtime de conteneur prenne en charge l'API CRI `v1`. Si un runtime de conteneur ne prend pas en charge l'API `v1`, le kubelet n'enregistre pas le nœud.

## Mise à niveau

Lors de la mise à niveau de la version de Kubernetes sur un nœud, le kubelet redémarre. Si le runtime de conteneur ne prend pas en charge l'API CRI `v1`, le kubelet ne pourra pas enregistrer le nœud et signalera une erreur. Si une nouvelle connexion gRPC est nécessaire parce que le runtime de conteneur a été mis à niveau, celui-ci doit prendre en charge l'API CRI `v1` afin que la connexion puisse être établie correctement. Cela peut nécessiter un redémarrage du kubelet après que le runtime de conteneur a été correctement configuré.

## Diffusion en continu des listes {#list-streaming}

{{< feature-state feature_gate_name="CRIListStreaming" >}}

Les RPC de liste CRI standards (`ListContainers`, `ListPodSandbox`, `ListImages`) renvoient tous les résultats dans une unique réponse unaire. Sur les nœuds contenant un grand nombre de conteneurs (par exemple plus de 10 000, y compris les conteneurs en cours d'exécution et arrêtés), ces réponses peuvent dépasser la limite par défaut de 16 Mio des messages gRPC, ce qui peut empêcher le kubelet de synchroniser correctement son état avec le runtime de conteneur.

Lorsque la porte de fonctionnalité `CRIListStreaming` est activée, le kubelet utilise des RPC de diffusion en flux côté serveur (tels que `StreamContainers`, `StreamPodSandboxes` et `StreamImages`) qui permettent au runtime de conteneur de répartir les résultats sur plusieurs messages de réponse, contournant ainsi la limite de taille par message.

Cette fonctionnalité est particulièrement utile pour :

- Les environnements avec un fort renouvellement de conteneurs (systèmes CI/CD)
- Les charges de travail de traitement par lots à grande échelle

Si le runtime de conteneur ne prend pas en charge les RPC de diffusion en flux, le kubelet revient automatiquement aux RPC unaires standards afin d'assurer la rétrocompatibilité.

## {{% heading "whatsnext" %}}

- En savoir plus sur la [définition du protocole CRI](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto)