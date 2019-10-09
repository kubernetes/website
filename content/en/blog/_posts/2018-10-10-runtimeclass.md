---
layout: blog
title: 'Kubernetes v1.12: Introducing RuntimeClass'
date: 2018-10-10
---

**Author**: Tim Allclair (Google)

Kubernetes originally launched with support for Docker containers running native applications on a Linux host. Starting with [rkt](https://kubernetes.io/blog/2016/07/rktnetes-brings-rkt-container-engine-to-kubernetes/) in Kubernetes 1.3 more runtimes were coming, which lead to the development of the [Container Runtime Interface](https://kubernetes.io/blog/2016/12/container-runtime-interface-cri-in-kubernetes/) (CRI). Since then, the set of alternative runtimes has only expanded: projects like [Kata Containers](https://katacontainers.io/) and [gVisor](https://github.com/google/gvisor) were announced for stronger workload isolation, and Kubernetes' Windows support has been [steadily progressing](https://kubernetes.io/blog/2018/01/kubernetes-v19-beta-windows-support/).

With runtimes targeting so many different use cases, a clear need for mixed runtimes in a cluster arose. But all these different ways of running containers have brought a new set of problems to deal with:

- How do users know which runtimes are available, and select the runtime for their workloads?
- How do we ensure pods are scheduled to the nodes that support the desired runtime?
- Which runtimes support which features, and how can we surface incompatibilities to the user?
- How do we account for the varying resource overheads of the runtimes?

**RuntimeClass** aims to solve these issues.

## RuntimeClass in Kubernetes 1.12

RuntimeClass was recently introduced as an alpha feature in Kubernetes 1.12. The initial implementation focuses on providing a runtime selection API, and paves the way to address the other open problems.

The RuntimeClass resource represents a container runtime supported in a Kubernetes cluster. The cluster provisioner sets up, configures, and defines the concrete runtimes backing the RuntimeClass. In its current form, a RuntimeClassSpec holds a single field, the **RuntimeHandler**. The RuntimeHandler is interpreted by the CRI implementation running on a node, and mapped to the actual runtime configuration. Meanwhile the PodSpec has been expanded with a new field, **RuntimeClassName**, which names the RuntimeClass that should be used to run the pod.

Why is RuntimeClass a pod level concept? The Kubernetes resource model expects certain resources to be shareable between containers in the pod. If the pod is made up of different containers with potentially different resource models, supporting the necessary level of resource sharing becomes very challenging. For example, it is extremely difficult to support a loopback (localhost) interface across a VM boundary, but this is a common model for communication between two containers in a pod.

## What's next?

The RuntimeClass resource is an important foundation for surfacing runtime properties to the control plane. For example, to implement scheduler support for clusters with heterogeneous nodes supporting different runtimes, we might add [NodeAffinity](/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity) terms to the RuntimeClass definition. Another area to address is managing the variable resource requirements to run pods of different runtimes. The [Pod Overhead proposal](https://docs.google.com/document/d/1EJKT4gyl58-kzt2bnwkv08MIUZ6lkDpXcxkHqCvvAp4/preview) was an early take on this that aligns nicely with the RuntimeClass design, and may be pursued further.

Many other RuntimeClass extensions have also been proposed, and will be revisited as the feature continues to develop and mature. A few more extensions that are being considered include:

 - Surfacing optional features supported by runtimes, and better visibility into errors caused by incompatible features.
- Automatic runtime or feature discovery, to support scheduling decisions without manual configuration.
- Standardized or conformant RuntimeClass names that define a set of properties that should be supported across clusters with RuntimeClasses of the same name.
- Dynamic registration of additional runtimes, so users can install new runtimes on existing clusters with no downtime.
- "Fitting" a RuntimeClass to a pod's requirements. For instance, specifying runtime properties and letting the system match an appropriate RuntimeClass, rather than explicitly assigning a RuntimeClass by name.

RuntimeClass will be under active development at least through 2019, and we’re excited to see the feature take shape, starting with the RuntimeClass alpha in Kubernetes 1.12.

## Learn More

- Take it for a spin! As an alpha feature, there are some additional setup steps to use RuntimeClass. Refer to the [RuntimeClass documentation](/docs/concepts/containers/runtime-class/#runtime-class) for how to get it running.
- Check out the [RuntimeClass Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/0014-runtime-class.md) for more nitty-gritty design details.
- The [Sandbox Isolation Level Decision](https://docs.google.com/document/d/1fe7lQUjYKR0cijRmSbH_y0_l3CYPkwtQa5ViywuNo8Q/preview) documents the thought process that initially went into making RuntimeClass a pod-level choice.
- Join the discussions and help shape the future of RuntimeClass with the [SIG-Node community](https://github.com/kubernetes/community/tree/master/sig-node)
