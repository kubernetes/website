---
assignees:
- mml

---
This guide is for anyone wishing to specify safety constraints on pods or anyone
wishing to write software (typically automation software) that respects those
constraints.

* TOC
{:toc}

## Rationale

Various cluster management operations may voluntarily evict pods.  "Voluntary"
means an eviction can be safely delayed for a reasonable period of time. The
principal examples today are draining a node for maintenance or upgrade
(`kubectl drain`), and cluster autoscaling down. In the future the
[rescheduler](https://github.com/kubernetes/kubernetes/blob/master/docs/proposals/rescheduling.md)
may also perform voluntary evictions.  By contrast, something like evicting pods
because a node has become unreachable or reports `NotReady`, is not "voluntary."

For voluntary evictions, it can be useful for applications to be able to limit
the number of pods that are down simultaneously.  For example, a quorum-based application would
like to ensure that the number of replicas running is never brought below the
number needed for a quorum, even temporarily. Or a web front end might want to
ensure that the number of replicas serving load never falls below a certain
percentage of the total, even briefly.  `PodDisruptionBudget` is an API object
that specifies the minimum number or percentage of replicas of a collection that
must be up at a time.  Components that wish to evict a pod subject to disruption
budget use the `/eviction` subresource; unlike a regular pod deletion, this
operation may be rejected by the API server if the eviction would cause a
disruption budget to be violated.

## Specifying a PodDisruptionBudget

A `PodDisruptionBudget` has two components: a label selector `selector` to specify the set of
pods to which it applies, and `minAvailable` which is a description of the number of pods from that
set that must still be available after the eviction, i.e. even in the absence
of the evicted pod. `minAvailable` can be either an absolute number or a percentage.
So for example, 100% means no voluntary evictions from the set are permitted. In
typical usage, a single budget would be used for a collection of pods managed by
a controller—for example, the pods in a single ReplicaSet.

Note that a disruption budget does not truly guarantee that the specified
number/percentage of pods will always be up.  For example, a node that hosts a
pod from the collection may fail when the collection is at the minimum size
specified in the budget, thus bringing the number of available pods from the
collection below the specified size. The budget can only protect against
voluntary evictions, not all causes of unavailability.

## Requesting an eviction

If you are writing infrastructure software that wants to produce these voluntary
evictions, you will need to use the eviction API.  The eviction subresource of a
pod can be thought of as a kind of policy-controlled DELETE operation on the pod
itself.  To attempt an eviction (perhaps more REST-precisely, to attempt to
*create* an eviction), you POST an attempted operation.  Here's an example:

```json
{
  "apiVersion": "policy/v1alpha1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```

You can attempt an eviction using `curl`:

```bash
$ curl -v -H 'Content-type: application/json' http://127.0.0.1:8080/api/v1/namespaces/default/pods/quux/eviction -d @eviction.json
```

The API can respond in one of three ways.

 1. If the eviction is granted, then the pod is deleted just as if you had sent
    a `DELETE` request to the pod's URL and you get back `200 OK`.
 2. If the current state of affairs wouldn't allow an eviction by the rules set
    forth in the budget, you get back `429 Too Many Requests`.  This is
    typically used for generic rate limiting of *any* requests, but here we mean
    that this request isn't allowed *right now* but it may be allowed later.
    Currently, callers do not get any `Retry-After` advice, but they may in
    future versions.
 3. If there is some kind of misconfiguration, like multiple budgets pointing at
    the same pod, you will get `500 Internal Server Error`.

For a given eviction request, there are two cases.

 1. There is no budget that matches this pod.  In this case, the server always
    returns `200 OK`.
 2. There is at least one budget.  In this case, any of the three above responses may
    apply.
