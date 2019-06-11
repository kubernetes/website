---
title: Classe d'exécution (Runtime Class)
description: Classe d'execution conteneur pour Kubernetes
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

Cette page décrit la ressource RuntimeClass et le mécanisme de sélection d'exécution (runtime).

{{% /capture %}}


{{% capture body %}}

## Runtime Class

La RuntimeClass est une fonctionnalité alpha permettant de sélectionner la configuration d'exécution du conteneur
à utiliser pour exécuter les conteneurs d'un pod.

### Installation

En tant que nouvelle fonctionnalité alpha, certaines étapes de configuration supplémentaires doivent
être suivies pour utiliser la RuntimeClass:

1. Activer la fonctionnalité RuntimeClass (sur les apiservers et les kubelets, nécessite la version 1.12+)
2. Installer la RuntimeClass CRD
3. Configurer l'implémentation CRI sur les nœuds (dépend du runtime)
4. Créer les ressources RuntimeClass correspondantes

#### 1. Activer RuntimeClass feature gate (portail de fonctionnalité)

Voir [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/) pour une explication
sur l'activation des feature gates. La `RuntimeClass` feature gate doit être activée sur les API servers _et_
les kubelets.

#### 2. Installer la CRD RuntimeClass

La RuntimeClass [CustomResourceDefinition][] (CRD) se trouve dans le répertoire addons du dépôt
Git Kubernetes: [kubernetes/cluster/addons/runtimeclass/runtimeclass_crd.yaml][runtimeclass_crd]

Installer la CRD avec `kubectl apply -f runtimeclass_crd.yaml`.

[CustomResourceDefinition]: /docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/
[runtimeclass_crd]: https://github.com/kubernetes/kubernetes/tree/master/cluster/addons/runtimeclass/runtimeclass_crd.yaml


#### 3. Configurer l'implémentation CRI sur les nœuds

Les configurations à sélectionner avec RuntimeClass dépendent de l'implémentation CRI. Consultez
la documentation correspondante pour votre implémentation CRI pour savoir comment le configurer.
Comme c'est une fonctionnalité alpha, tous les CRI ne prennent pas encore en charge plusieurs RuntimeClasses.

{{< note >}}
La RuntimeClass suppose actuellement une configuration de nœud homogène sur l'ensemble du cluster
(ce qui signifie que tous les nœuds sont configurés de la même manière en ce qui concerne les environnements d'exécution de conteneur). Toute hétérogénéité (configuration variable) doit être
gérée indépendamment de RuntimeClass via des fonctions de planification (scheduling features) (voir [Affectation de pods sur les nœuds](/docs/concepts/configuration/assign-pod-node/)).
{{< /note >}}

Les configurations ont un nom `RuntimeHandler` correspondant , référencé par la RuntimeClass.
Le RuntimeHandler doit être un sous-domaine DNS valide selon la norme RFC 1123 (alphanumériques + `-` et `.` caractères).

#### 4. Créer les ressources RuntimeClass correspondantes

Les configurations effectuées à l'étape 3 doivent chacune avoir un nom `RuntimeHandler` associé, qui
identifie la configuration. Pour chaque RuntimeHandler (et optionellement les handlers vides `""`),
créez un objet RuntimeClass correspondant.

La ressource RuntimeClass ne contient actuellement que 2 champs significatifs: le nom RuntimeClass
(`metadata.name`) et le RuntimeHandler (`spec.runtimeHandler`). la définition de l'objet ressemble à ceci:

```yaml
apiVersion: node.k8s.io/v1alpha1  # La RuntimeClass est définie dans le groupe d'API node.k8s.io
kind: RuntimeClass
metadata:
  name: myclass  # Le nom avec lequel la RuntimeClass sera référencée
  # La RuntimeClass est une ressource non cantonnées à un namespace
spec:
  runtimeHandler: myconfiguration  # Le nom de la configuration CRI correspondante
```


{{< note >}}
Il est recommandé de limiter les opérations d'écriture sur la RuntimeClass (create/update/patch/delete) à
l'administrateur du cluster. C'est la configuration par défault. Voir [Vue d'ensemble d'autorisation](/docs/reference/access-authn-authz/authorization/) pour plus de détails.
{{< /note >}}

### Usage

Une fois que les RuntimeClasses sont configurées pour le cluster, leur utilisation est très simple.
Spécifiez `runtimeClassName` dans la spécficiation du pod. Par exemple:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

Cela indiquera à la kubelet d'utiliser la RuntimeClass spécifiée pour exécuter ce pod. Si la
RuntimeClass n'existe pas, ou si la CRI ne peut pas exécuter le handler correspondant, le pod passera finalement à
[l'état](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) `failed`. Recherchez
[l'événement](/docs/tasks/debug-application-cluster/debug-application-introspection/) correspondant pour un
message d'erreur.

Si aucun `runtimeClassName` n'est spécifié, le RuntimeHandler par défault sera utilisé, qui équivaut
au comportement lorsque la fonctionnalité RuntimeClass est désactivée.

{{% /capture %}}
