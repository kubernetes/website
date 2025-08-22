---
title: Sélecteurs de champs
content_type: concept
weight: 70
---

Les _sélecteurs de champs_ vous permettent de sélectionner des {{< glossary_tooltip text="objets" term_id="object" >}} Kubernetes en fonction de la valeur d'un ou plusieurs champs de ressources. Voici quelques exemples de requêtes de sélecteurs de champs :

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

Cette commande `kubectl` sélectionne tous les Pods pour lesquels la valeur du champ [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) est `Running` :

```shell
kubectl get pods --field-selector status.phase=Running
```

{{<note>}}
Les sélecteurs de champs sont essentiellement des *filtres* de ressources. Par défaut, aucun sélecteur/filtre n'est appliqué, ce qui signifie que toutes les ressources du type spécifié sont sélectionnées. Cela rend les requêtes `kubectl get pods` et `kubectl get pods --field-selector ""` équivalentes.
{{</note>}}

## Champs pris en charge

Les sélecteurs de champs pris en charge varient en fonction du type de ressource Kubernetes. Tous les types de ressources prennent en charge les champs `metadata.name` et `metadata.namespace`. L'utilisation de sélecteurs de champs non pris en charge génère une erreur. Par exemple :

```shell
kubectl get ingress --field-selector foo.bar=baz
```
```
Erreur du serveur (BadRequest) : Impossible de trouver des "ingresses" correspondant au sélecteur de labels "", au sélecteur de champs "foo.bar=baz" : "foo.bar" n'est pas un sélecteur de champ connu : seuls "metadata.name", "metadata.namespace"
```

### Liste des champs pris en charge

| Kind                      | Champs                                                                                                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pod                       | `spec.nodeName`<br>`spec.restartPolicy`<br>`spec.schedulerName`<br>`spec.serviceAccountName`<br>`spec.hostNetwork`<br>`status.phase`<br>`status.podIP`<br>`status.nominatedNodeName`                                                                            |
| Event                     | `involvedObject.kind`<br>`involvedObject.namespace`<br>`involvedObject.name`<br>`involvedObject.uid`<br>`involvedObject.apiVersion`<br>`involvedObject.resourceVersion`<br>`involvedObject.fieldPath`<br>`reason`<br>`reportingComponent`<br>`source`<br>`type` |
| Secret                    | `type`                                                                                                                                                                                                                                                          |
| Namespace                 | `status.phase`                                                                                                                                                                                                                                                  |
| ReplicaSet                | `status.replicas`                                                                                                                                                                                                                                               |
| ReplicationController     | `status.replicas`                                                                                                                                                                                                                                               |
| Job                       | `status.successful`                                                                                                                                                                                                                                             |
| Node                      | `spec.unschedulable`                                                                                                                                                                                                                                            |
| CertificateSigningRequest | `spec.signerName`                                                                                                                                                                                                                                               |

## Opérateurs pris en charge

Vous pouvez utiliser les opérateurs `=`, `==` et `!=` avec les sélecteurs de champs (`=` et `==` signifient la même chose). Cette commande `kubectl`, par exemple, sélectionne tous les services Kubernetes qui ne sont pas dans le namespace `default` :

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```
{{<note>}}
Les opérateurs basés sur les ensembles (`in`, `notin`, `exists`) ne sont pas pris en charge pour les sélecteurs de champs.
{{</note>}}

## Sélecteurs enchaînés

Comme pour les [labels](/fr/docs/concepts/overview/working-with-objects/labels) et autres sélecteurs, les sélecteurs de champs peuvent être enchaînés ensemble sous forme d'une liste séparée par des virgules. Cette commande `kubectl` sélectionne tous les Pods pour lesquels le champ `status.phase` n'est pas égal à `Running` et le champ `spec.restartPolicy` est égal à `Always` :

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## Types de ressources multiples

Vous pouvez utiliser des sélecteurs de champs sur plusieurs types de ressources. Cette commande `kubectl` sélectionne tous les Statefulsets et Services qui ne sont pas dans le namespace `default` :

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
