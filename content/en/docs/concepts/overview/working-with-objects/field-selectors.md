---
title: Field Selectors
content_type: concept
weight: 70
---

_Field selectors_ let you select Kubernetes {{< glossary_tooltip text="objects" term_id="object" >}} based on the
value of one or more resource fields. Here are some examples of field selector queries:

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

This `kubectl` command selects all Pods for which the value of the [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) field is `Running`:

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
Field selectors are essentially resource *filters*. By default, no selectors/filters are applied, meaning that all resources of the specified type are selected. This makes the `kubectl` queries `kubectl get pods` and `kubectl get pods --field-selector ""` equivalent.
{{< /note >}}

## Supported fields

Supported field selectors vary by Kubernetes resource type. All resource types support the `metadata.name` and `metadata.namespace` fields. Using unsupported field selectors produces an error. For example:

```shell
kubectl get ingress --field-selector foo.bar=baz
```
```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

### List of supported fields

| Kind                      | Fields                                                                                                                                                                                                                                                          |
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

## Supported operators

You can use the `=`, `==`, and `!=` operators with field selectors (`=` and `==` mean the same thing). This `kubectl` command, for example, selects all Kubernetes Services that aren't in the `default` namespace:

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```
{{< note >}}
[Set-based operators](/docs/concepts/overview/working-with-objects/labels/#set-based-requirement)
(`in`, `notin`, `exists`) are not supported for field selectors. 
{{< /note >}}

## Chained selectors

As with [label](/docs/concepts/overview/working-with-objects/labels) and other selectors, field selectors can be chained together as a comma-separated list. This `kubectl` command selects all Pods for which the `status.phase` does not equal `Running` and the `spec.restartPolicy` field equals `Always`:

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## Multiple resource types

You can use field selectors across multiple resource types. This `kubectl` command selects all Statefulsets and Services that are not in the `default` namespace:

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```