---
layout: blog
title: "Kubernetes v1.28: Introducing native sidecar containers"
date: 2023-08-25
slug: native-sidecar-containers
author: >
  Todd Neal (AWS),
  Matthias Bertschy (ARMO),
  Sergey Kanzhelev (Google),
  Gunju Kim (NAVER),
  Shannon Kularathna (Google)
---

This post explains how to use the new sidecar feature, which enables restartable init containers and is available in alpha in Kubernetes 1.28. We want your feedback so that we can graduate this feature as soon as possible.

The concept of a “sidecar” has been part of Kubernetes since nearly the very beginning. In 2015, sidecars were described in a [blog post](/blog/2015/06/the-distributed-system-toolkit-patterns/) about composite containers as additional containers that “extend and enhance the ‘main’ container”. Sidecar containers have become a common Kubernetes deployment pattern and are often used for network proxies or as part of a logging system. Until now, sidecars were a concept that Kubernetes users applied without native support. The lack of native support has caused some usage friction, which this enhancement aims to resolve.

## What are sidecar containers in 1.28?

Kubernetes 1.28 adds a new `restartPolicy` field to [init containers](/docs/concepts/workloads/pods/init-containers/) that is available when the `SidecarContainers` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled.

```yaml
apiVersion: v1
kind: Pod
spec:
  initContainers:
  - name: secret-fetch
    image: secret-fetch:1.0
  - name: network-proxy
    image: network-proxy:1.0
    restartPolicy: Always
  containers:
  ...
```

The field is optional and, if set, the only valid value is Always. Setting this field changes the behavior of init containers as follows:

- The container restarts if it exits
- Any subsequent init container starts immediately after the [startupProbe](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-startup-probes) has successfully completed instead of waiting for the restartable init container to exit
- The resource usage calculation changes for the pod as restartable init container resources are now added to the sum of the resource requests by the main containers

[Pod termination](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) continues to only depend on the main containers. An init container with a `restartPolicy` of `Always` (named a sidecar) won't prevent the pod from terminating after the main containers exit.

The following properties of restartable init containers make them ideal for the sidecar deployment pattern:

- Init containers have a well-defined startup order regardless of whether you set a `restartPolicy`, so you can ensure that your sidecar starts before any container declarations that come after the sidecar declaration in your manifest.
- Sidecar containers don't extend the lifetime of the Pod, so you can use them in short-lived Pods with no changes to the Pod lifecycle.
- Sidecar containers are restarted on exit, which improves resilience and lets you use sidecars to provide services that your main containers can more reliably consume.

## When to use sidecar containers

You might find built-in sidecar containers useful for workloads such as the following:

- **Batch or AI/ML workloads**, or other Pods that run to completion. These workloads will experience the most significant benefits.
- **Network proxies** that start up before any other container in the manifest. Every other container that runs can use the proxy container's services. For instructions, see the [Kubernetes Native sidecars in Istio blog post](https://istio.io/latest/blog/2023/native-sidecars/).
- **Log collection containers**, which can now start before any other container and run until the Pod terminates. This improves the reliability of log collection in your Pods.
- **Jobs**, which can use sidecars for any purpose without Job completion being blocked by the running sidecar. No additional configuration is required to ensure this behavior.

## How did users get sidecar behavior before 1.28?

Prior to the sidecar feature, the following options were available for implementing sidecar behavior depending on the desired lifetime of the sidecar container:

- **Lifetime of sidecar less than Pod lifetime**: Use an init container, which provides well-defined startup order. However, the sidecar has to exit for other init containers and main Pod containers to start.
- **Lifetime of sidecar equal to Pod lifetime**: Use a main container that runs alongside your workload containers in the Pod. This method doesn't give you control over startup order, and lets the sidecar container potentially block Pod termination after the workload containers exit.

The built-in sidecar feature solves for the use case of having a lifetime equal to the Pod lifetime and has the following additional benefits:

- Provides control over startup order
- Doesn’t block Pod termination

## Transitioning existing sidecars to the new model

We recommend only using the sidecars feature gate in [short lived testing clusters](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages) at the alpha stage. If you have an existing sidecar that is configured as a main container so it can run for the lifetime of the pod, it can be moved to the `initContainers` section of the pod spec and given a `restartPolicy` of `Always`. In many cases, the sidecar should work as before with the added benefit of having a defined startup ordering and not prolonging the pod lifetime.

## Known issues

The alpha release of built-in sidecar containers has the following known issues, which we'll resolve before graduating the feature to beta:

- The CPU, memory, device, and topology manager are unaware of the sidecar container lifetime and additional resource usage, and will operate as if the Pod had lower resource requests than it actually does.
- The output of `kubectl describe node` is incorrect when sidecars are in use. The output shows resource usage that's lower than the actual usage because it doesn't use the new resource usage calculation for sidecar containers.

## We need your feedback!

In the alpha stage, we want you to try out sidecar containers in your environments and open issues if you encounter bugs or friction points. We're especially interested in feedback about the following:
- The shutdown sequence, especially with multiple sidecars running 
- The backoff timeout adjustment for crashing sidecars 
- The behavior of Pod readiness and liveness probes when sidecars are running

To open an issue, see the [Kubernetes GitHub repository](https://github.com/kubernetes/kubernetes/issues/new/choose).

## What’s next?

In addition to the known issues that will be resolved, we're working on adding termination ordering for sidecar and main containers. This will ensure that sidecar containers only terminate after the Pod's main containers have exited.

We’re excited to see the sidecar feature come to Kubernetes and are interested in feedback.

## Acknowledgements

Many years have passed since the original KEP was written, so we apologize if we omit anyone who worked on this feature over the years. This is a best-effort attempt to recognize the people involved in this effort.

- [mrunalp](https://github.com/mrunalp/) for design discussions and reviews
- [thockin](https://github.com/thockin/) for API discussions and support thru years
- [bobbypage](https://github.com/bobbypage) for reviews
- [smarterclayton](https://github.com/smarterclayton) for detailed review and feedback
- [howardjohn](https://github.com/howardjohn) for feedback over years and trying it early during implementation
- [derekwaynecarr](https://github.com/derekwaynecarr) and [dchen1107](https://github.com/dchen1107) for leadership
- [jpbetz](https://github.com/Jpbetz) for API and termination ordering designs as well as code reviews
- [Joseph-Irving](https://github.com/Joseph-Irving) and [rata](https://github.com/rata) for the early iterations design and reviews years back
- [swatisehgal](https://github.com/swatisehgal) and [ffromani](https://github.com/ffromani) for early feedback on resource managers impact
- [alculquicondor](https://github.com/Alculquicondor) for feedback on addressing the version skew of the scheduler
- [wojtek-t](https://github.com/Wojtek-t) for PRR review of a KEP
- [ahg-g](https://github.com/ahg-g) for reviewing the scheduler portion of a KEP
- [adisky](https://github.com/Adisky) for the Job completion issue

## More Information

- Read [API for sidecar containers](/docs/concepts/workloads/pods/init-containers/#api-for-sidecar-containers) in the Kubernetes documentation
- Read the [Sidecar KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/753-sidecar-containers/README.md)