---
title: Field Selectors
weight: 60
---

_Field selectors_ enable you to [select Kubernetes resources](/docs/concepts/overview/working-with-objects/kubernetes-objects) on the basis of the value of one or more resource fields. Here are some example field selector queries:

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

This `kubectl` command, for example, would select all Pods for which the value of the [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) field is `Running`:

```shell
$ kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
Field selectors are essentially resource *filters*. By default, no selectors/filters are applied, meaning that all resources of the specified type are selected. This makes the following `kubectl` queries equivalent:

```shell
$ kubectl get pods
$ kubectl get pods --field-selector ""
```
{{< /note >}}

## Supported fields

Which fields can be used with field selectors varies by Kubernetes resource type. *All* resource types do, however, support the `metadata.name` and `metadata.namespace` fields. If you attempt to use field selectors on a field that isn't supported for that resource, you will receive an error. Here's an example:

```shell
$ kubectl get ingress --field-selector foo.bar=baz
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

## Supported operators

The `!=` field selector operator is supported in addition to `=` (used in the example directly above). This `kubectl` command, for example, would select all Kubernetes Services that are not in the `default` namespace:

```shell
$ kubectl get services --field-selector metadata.namespace!=default
```

{{< warning >}}
Please note that *only* the `=` and `!=` operators are supported as field selector operators. [Label selector](/docs/concepts/overview/working-with-objects/labels) syntax should *not* be taken as a general guide to field selector syntax. If you require more complex queries involving selectors like [`in` or `notin`](/docs/concepts/overview/working-with-objects/labels#set-based-requirement), you may be better served by label selectors.
{{< /warning >}}

## Chained selectors

As with [label](/docs/concepts/overview/working-with-objects/labels) and other selectors, field selectors can be chained together as a comma-separated list. This `kubectl` command would select all Pods for which the `status.phase` does not equal `Running` *and* the `spec.restartPolicy` field equals `Always`:

```shell
$ kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## Multiple resource types

Field selectors can be used to select across multiple resource types. This `kubectl` command would select all Statefulsets *and* Services that are not in the `default` namespace:

```shell
$ kubectl get statefulsets,services --field-selector metadata.namespace!=default
```