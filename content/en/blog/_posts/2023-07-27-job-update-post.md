---
layout: blog
title: "Kubernetes 1.28: Updates to the Job API"
date: 2023-07-27 
slug: kubernetes-1-28-jobapi-update
---

**Authors:** Kevin Hannon (G-Research), Michał Woźniak (Google)

This blog discusses two features to improve Jobs for batch users: PodRecreationPolicy and JobBackoffLimitPerIndex.

These are two features requested from users of the Job API to enhance a user's experience.

## Pod Recreation Policy

### What problem does this solve?

Many common machine learning frameworks, such as Tensorflow and JAX, require unique pods per Index. Currently, if a pod enters a terminating state (due to preemption, eviction or other external factors), a replacement pod is created and immediately fail to start.

Having a replacement Pod before the previous one fully terminates can also cause problems in clusters with scarce resources or with tight budgets. These resources can be difficult to obtain so pods can take a long time to find resources and they may only be able to find nodes once the existing pods have been terminated. If cluster autoscaler is enabled, the replacement Pods might produce undesired scale ups.

On the other hand, if a replacement Pod is not immediately created, the Job status would show that the number of active pods doesn't match the desired parallelism. To provide better visibility, the job status can have a new field to track the number of Pods currently terminating.

This new field can also be used by queueing controllers, such as Kueue, to track the number of terminating pods to calculate quotas.

### How can I use it

This is an alpha feature, which means you have to enable the `JobPodReplacementPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/),
with the command line argument `--feature-gates=JobPodReplacementPolicy=true`
to the kube-apiserver.

```yaml
kind: Job
metadata:
  name: new
  ...
spec:
  podReplacementPolicy: Failed
  ...
```

`podReplacementPolicy` can take either `Failed` or `TerminatingOrFailed`.  In cases where `PodFailurePolicy` is set, you can only use `Failed`.

This feature enables two components in the Job controller: Adds a `terminating` field to the status and adds a new API field called `podReplacementPolicy`.

The Job controller uses `parallelism` field in the Job API to determine the number of pods that it is expects to be active (not finished).  If there is a mismatch of active pods and the pod has not finished, we would normally assume that the pod has failed and the Job controller would recreate the pod.  In cases where `Failed` is specified, the Job controller will wait for the pod to be fully terminated (`DeletionTimeStamp != nil`).

### How can I learn more?

- Read the KEP: [PodReplacementPolicy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3939-allow-replacement-when-fully-terminated)

## JobBackoffLimitPerIndex

### Getting Involved

These features were sponsored under the domain of SIG Apps.  Batch is actively being improved for Kubernetes users in the batch working group.  
Working groups are relatively short-lived initatives focused on specific goals.  In the case of Batch, the goal is to improve/support batch users and enhance the Job API for common use cases.  If that interests you, please join the working group either by subscriping to our [mailing list](https://groups.google.com/a/kubernetes.io/g/wg-batch) or on [Slack](https://kubernetes.slack.com/messages/wg-batch).

### Acknowledgments

As with any Kubernetes feature, multiple people contributed to getting this
done, from testing and filing bugs to reviewing code.

We would not have been able to achieve either of these features without Aldo Culquicondor (Google) providing excellent domain knowledge and expertise throughout the Kubernetes ecosystem.
