---
title: API-initiated Eviction
content_type: concept
weight: 110
---

{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

You can request eviction by calling the Eviction API directly, or programmatically
using a client of the {{<glossary_tooltip term_id="kube-apiserver" text="API server">}}, like the `kubectl drain` command. This
creates an `Eviction` object, which causes the API server to terminate the Pod.

API-initiated evictions respect your configured [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
and [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination).

Using the API to create an Eviction object for a Pod is like performing a
policy-controlled [`DELETE` operation](/docs/reference/kubernetes-api/workload-resources/pod-v1/#delete-delete-a-pod)
on the Pod.

## Calling the Eviction API

You can use a [Kubernetes language client](/docs/tasks/administer-cluster/access-cluster-api/#programmatic-access-to-the-api)
to access the Kubernetes API and create an `Eviction` object. To do this, you
POST the attempted operation, similar to the following example:

{{< tabs name="Eviction_example" >}}
{{% tab name="policy/v1" %}}
{{< note >}}
`policy/v1` Eviction is available in v1.22+. Use `policy/v1beta1` with prior releases.
{{< /note >}}

```json
{
  "apiVersion": "policy/v1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{% tab name="policy/v1beta1" %}}
{{< note >}}
Deprecated in v1.22 in favor of `policy/v1`
{{< /note >}}

```json
{
  "apiVersion": "policy/v1beta1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

Alternatively, you can attempt an eviction operation by accessing the API using
`curl` or `wget`, similar to the following example:

```bash
curl -v -H 'Content-type: application/json' https://your-cluster-api-endpoint.example/api/v1/namespaces/default/pods/quux/eviction -d @eviction.json
```

## How API-initiated eviction works

When you request an eviction using the API, the API server performs admission
checks and responds in one of the following ways:

* `200 OK`: the eviction is allowed, the `Eviction` subresource is created, and
  the Pod is deleted, similar to sending a `DELETE` request to the Pod URL.
* `429 Too Many Requests`: the eviction is not currently allowed because of the
  configured {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}.
  You may be able to attempt the eviction again later. You might also see this
  response because of API rate limiting.
* `500 Internal Server Error`: the eviction is not allowed because there is a
  misconfiguration, like if multiple PodDisruptionBudgets reference the same Pod.

If the Pod you want to evict isn't part of a workload that has a
PodDisruptionBudget, the API server always returns `200 OK` and allows the
eviction.

If the API server allows the eviction, the Pod is deleted as follows:

1. The `Pod` resource in the API server is updated with a deletion timestamp,
   after which the API server considers the `Pod` resource to be terminated. The
   `Pod` resource is also marked with the configured grace period.
1. The {{<glossary_tooltip term_id="kubelet" text="kubelet">}} on the node where the local Pod is running notices that the `Pod`
   resource is marked for termination and starts to gracefully shut down the
   local Pod.
1. While the kubelet is shutting the Pod down, the control plane removes the Pod
   from {{<glossary_tooltip term_id="endpoint" text="Endpoint">}} and
   {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}
   objects. As a result, controllers no longer consider the Pod as a valid object.
1. After the grace period for the Pod expires, the kubelet forcefully terminates
   the local Pod.
1. The kubelet tells the API server to remove the `Pod` resource.
1. The API server deletes the `Pod` resource.

## Troubleshooting stuck evictions

In some cases, your applications may enter a broken state, where the Eviction
API will only return `429` or `500` responses until you intervene. This can
happen if, for example, a ReplicaSet creates pods for your application but new
pods do not enter a `Ready` state. You may also notice this behavior in cases
where the last evicted Pod had a long termination grace period.

If you notice stuck evictions, try one of the following solutions:

* Abort or pause the automated operation causing the issue. Investigate the stuck
  application before you restart the operation.
* Wait a while, then directly delete the Pod from your cluster control plane
  instead of using the Eviction API.

## {{% heading "whatsnext" %}}

* Learn how to protect your applications with a [Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/).
* Learn about [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* Learn about [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
