---
layout: blog
title: "Kubernetes 1.31: Pod Failure Policy for Jobs Goes GA"
date: 2024-08-19
slug: kubernetes-1-31-pod-failure-policy-for-jobs-goes-ga
author: >
  [Michał Woźniak](https://github.com/mimowo) (Google),
  [Shannon Kularathna](https://github.com/shannonxtreme) (Google)
---

This post describes _Pod failure policy_, which graduates to stable in Kubernetes
1.31, and how to use it in your Jobs.

## About Pod failure policy

When you run workloads on Kubernetes, Pods might fail for a variety of reasons.
Ideally, workloads like Jobs should be able to ignore transient, retriable
failures and continue running to completion.

To allow for these transient failures, Kubernetes Jobs include the `backoffLimit`
field, which lets you specify a number of Pod failures that you're willing to tolerate
during Job execution. However, if you set a large value for the `backoffLimit` field
and rely solely on this field, you might notice unnecessary increases in operating
costs as Pods restart excessively until the backoffLimit is met.

This becomes particularly problematic when running large-scale Jobs with
thousands of long-running Pods across thousands of nodes.

The Pod failure policy extends the backoff limit mechanism to help you reduce
costs in the following ways:

- Gives you control to fail the Job as soon as a non-retriable Pod failure occurs.
- Allows you to ignore retriable errors without increasing the `backoffLimit` field.

For example, you can use a Pod failure policy to run your workload on more affordable spot machines
by ignoring Pod failures caused by
[graceful node shutdown](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown).

The policy allows you to distinguish between retriable and non-retriable Pod
failures based on container exit codes or Pod conditions in a failed Pod.

## How it works

You specify a Pod failure policy in the Job specification, represented as a list
of rules.

For each rule you define _match requirements_ based on one of the following properties:

- Container exit codes: the `onExitCodes` property.
- Pod conditions: the `onPodConditions` property.

Additionally, for each rule, you specify one of the following actions to take
when a Pod matches the rule:
- `Ignore`: Do not count the failure towards the `backoffLimit` or `backoffLimitPerIndex`.
- `FailJob`: Fail the entire Job and terminate all running Pods.
- `FailIndex`: Fail the index corresponding to the failed Pod.
  This action works with the [Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index) feature.
- `Count`: Count the failure towards the `backoffLimit` or `backoffLimitPerIndex`.
  This is the default behavior.

When Pod failures occur in a running Job, Kubernetes matches the
failed Pod status against the list of Pod failure policy rules, in the specified
order, and takes the corresponding actions for the first matched rule.

Note that when specifying the Pod failure policy, you must also set the Job's
Pod template with `restartPolicy: Never`. This prevents race conditions between
the kubelet and the Job controller when counting Pod failures.

### Kubernetes-initiated Pod disruptions

To allow matching Pod failure policy rules against failures caused by
disruptions initiated by Kubernetes, this feature introduces the `DisruptionTarget`
Pod condition.

Kubernetes adds this condition to any Pod, regardless of whether it's managed by
a Job controller, that fails because of a retriable
[disruption scenario](/docs/concepts/workloads/pods/disruptions/#pod-disruption-conditions).
The `DisruptionTarget` condition contains one of the following reasons that
corresponds to these disruption scenarios:

- `PreemptionByKubeScheduler`: [Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption)
   by `kube-scheduler` to accommodate a new Pod that has a higher priority.
- `DeletionByTaintManager` - the Pod is due to be deleted by
   `kube-controller-manager` due to a `NoExecute` [taint](/docs/concepts/scheduling-eviction/taint-and-toleration/)
   that the Pod doesn't tolerate.
- `EvictionByEvictionAPI` - the Pod is due to be deleted by an
   [API-initiated eviction](/docs/concepts/scheduling-eviction/api-eviction/).
- `DeletionByPodGC` - the Pod is bound to a node that no longer exists, and is due to
   be deleted by [Pod garbage collection](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection).
- `TerminationByKubelet` - the Pod was terminated by
  [graceful node shutdown](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown),
  [node pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
  or preemption for [system critical pods](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).

In all other disruption scenarios, like eviction due to exceeding
[Pod container limits](/docs/concepts/configuration/manage-resources-containers/),
Pods don't receive the `DisruptionTarget` condition because the disruptions were
likely caused by the Pod and would reoccur on retry.

### Example

The Pod failure policy snippet below demonstrates an example use:

```yaml
podFailurePolicy:
  rules:
  - action: Ignore
    onPodConditions:
    - type: DisruptionTarget
  - action: FailJob
    onPodConditions:
    - type: ConfigIssue
  - action: FailJob
    onExitCodes:
      operator: In
      values: [ 42 ]
```

In this example, the Pod failure policy does the following:

- Ignores any failed Pods that have the built-in `DisruptionTarget`
  condition. These Pods don't count towards Job backoff limits.
- Fails the Job if any failed Pods have the custom user-supplied
  `ConfigIssue` condition, which was added either by a custom controller or webhook.
- Fails the Job if any containers exited with the exit code 42.
- Counts all other Pod failures towards the default `backoffLimit` (or
  `backoffLimitPerIndex` if used).

## Learn more

- For a hands-on guide to using Pod failure policy, see
  [Handling retriable and non-retriable pod failures with Pod failure policy](/docs/tasks/job/pod-failure-policy/)
- Read the documentation for
  [Pod failure policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy) and
  [Backoff limit per index](/docs/concepts/workloads/controllers/job/#backoff-limit-per-index)
- Read the documentation for
  [Pod disruption conditions](/docs/concepts/workloads/pods/disruptions/#pod-disruption-conditions)
- Read the KEP for [Pod failure policy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3329-retriable-and-non-retriable-failures)

## Related work

Based on the concepts introduced by Pod failure policy, the following additional work is in progress:
- JobSet integration: [Configurable Failure Policy API](https://github.com/kubernetes-sigs/jobset/issues/262)
- [Pod failure policy extension to add more granular failure reasons](https://github.com/kubernetes/enhancements/issues/4443)
- Support for Pod failure policy via JobSet in [Kubeflow Training v2](https://github.com/kubeflow/training-operator/pull/2171)
- Proposal: [Disrupted Pods should be removed from endpoints](https://docs.google.com/document/d/1t25jgO_-LRHhjRXf4KJ5xY_t8BZYdapv7MDAxVGY6R8)

## Get involved

This work was sponsored by
[batch working group](https://github.com/kubernetes/community/tree/master/wg-batch)
in close collaboration with the
[SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps),
and [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node),
and [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling)
communities.

If you are interested in working on new features in the space we recommend
subscribing to our [Slack](https://kubernetes.slack.com/messages/wg-batch)
channel and attending the regular community meetings.

## Acknowledgments

I would love to thank everyone who was involved in this project over the years -
it's been a journey and a joint community effort! The list below is
my best-effort attempt to remember and recognize people who made an impact.
Thank you!

- [Aldo Culquicondor](https://github.com/alculquicondor/) for guidance and reviews throughout the process
- [Jordan Liggitt](https://github.com/liggitt) for KEP and API reviews
- [David Eads](https://github.com/deads2k) for API reviews
- [Maciej Szulik](https://github.com/soltysh) for KEP reviews from SIG Apps PoV
- [Clayton Coleman](https://github.com/smarterclayton) for guidance and SIG Node reviews
- [Sergey Kanzhelev](https://github.com/SergeyKanzhelev) for KEP reviews from SIG Node PoV
- [Dawn Chen](https://github.com/dchen1107) for KEP reviews from SIG Node PoV
- [Daniel Smith](https://github.com/lavalamp) for reviews from SIG API machinery PoV
- [Antoine Pelisse](https://github.com/apelisse) for reviews from SIG API machinery PoV
- [John Belamaric](https://github.com/johnbelamaric) for PRR reviews
- [Filip Křepinský](https://github.com/atiratree) for thorough reviews from SIG Apps PoV and bug-fixing
- [David Porter](https://github.com/bobbypage) for thorough reviews from SIG Node PoV
- [Jensen Lo](https://github.com/jensentanlo) for early requirements discussions, testing and reporting issues
- [Daniel Vega-Myhre](https://github.com/danielvegamyhre) for advancing JobSet integration and reporting issues
- [Abdullah Gharaibeh](https://github.com/ahg-g) for early design discussions and guidance
- [Antonio Ojea](https://github.com/aojea) for test reviews
- [Yuki Iwai](https://github.com/tenzen-y) for reviews and aligning implementation of the closely related Job features
- [Kevin Hannon](https://github.com/kannon92) for reviews and aligning implementation of the closely related Job features
- [Tim Bannister](https://github.com/sftim) for docs reviews
- [Shannon Kularathna](https://github.com/shannonxtreme) for docs reviews
- [Paola Cortés](https://github.com/cortespao) for docs reviews
