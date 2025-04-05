---
layout: blog
title: "Navigating Failures in Pods With Devices"
date: 2025-04-01
slug: navigating-failures-in-pods-with-devices
draft: true
author: >
  Sergey Kanzhelev (Google)
  Mrunal Patel (RedHat)
---

Kubernetes is the de facto standard for container orchestration, but when it
comes to handling specialized hardware like GPUs and other accelerators, things
get a bit complicated. This blog post dives into the challenges of managing
failure modes when operating pods with devices in Kubernetes, based on insights
from [Sergey Kanzhelev and Mrunal Patel's talk at KubeCon NA
2024](https://sched.co/1i7pT). You can follow the links to
[slides](https://static.sched.com/hosted_files/kccncna2024/b9/KubeCon%20NA%202024_%20Navigating%20Failures%20in%20Pods%20With%20Devices_%20Challenges%20and%20Solutions.pptx.pdf?_gl=1*191m4j5*_gcl_au*MTU1MDM0MTM1My4xNzMwOTE4ODY5LjIxNDI4Nzk1NDIuMTczMTY0ODgyMC4xNzMxNjQ4ODIy*FPAU*MTU1MDM0MTM1My4xNzMwOTE4ODY5)
and
[recording](https://www.youtube.com/watch?v=-YCnOYTtVO8&list=PLj6h78yzYM2Pw4mRw4S-1p_xLARMqPkA7&index=150).

## The AI/ML boom and its impact on Kubernetes

The rise of AI/ML workloads has brought new challenges to Kubernetes. These
workloads often rely heavily on specialized hardware, and any device failure can
significantly impact performance and lead to frustrating interruptions. As
highlighted in the 2024 [Llama
paper](https://ai.meta.com/research/publications/the-llama-3-herd-of-models/),
hardware issues, particularly GPU failures, are a major cause of disruption in
AI/ML training. You can also learn how much effort NVIDIA spends on handling
devices failures and maintenance in the KubeCon talk by [Ryan Hallisey and Piotr
Prokop All-Your-GPUs-Are-Belong-to-Us: An Inside Look at NVIDIA's Self-Healing
GeForce NOW
Infrastructure](https://kccncna2024.sched.com/event/1i7kJ/all-your-gpus-are-belong-to-us-an-inside-look-at-nvidias-self-healing-geforce-now-infrastructure-ryan-hallisey-piotr-prokop-pl-nvidia)
([recording](https://www.youtube.com/watch?v=iLnHtKwmu2I)) as they see 19
remediation requests per 1000 nodes a day!
We also see data centers offering spot consumption models and overcommit on
power, making device failures commonplace and a part of the business model.

However, Kubernetes’s view on resources is still very static. The resource is
either there or not. And if it is there, the assumption is that it will stay
there fully functional - Kubernetes lacks good support for handling full or partial
hardware failures. These long-existing assumptions combined with the overall complexity of a setup lead
to a variety of failure modes, which we discuss here.

### Understanding AI/ML workloads

Generally, all AI/ML workloads require specialized hardware, have challenging 
scheduling requirements, and are expensive when idle. AI/ML workloads typically
fall into two categories - training and inference. Here is an oversimplified
view of those categories’ characteristics, which are different from traditional workloads
like web services:

Training
: These workloads are resource-intensive, often consuming entire
  machines and running as gangs of pods. Training jobs are usually "run to
  completion" - but that could be days, weeks or even months. Any failure in a
  single pod can necessitate restarting the entire step across all the pods.

Inference
: These workloads are usually long-running or run indefinitely,
  and can be small enough to consume a subset of a Node’s devices or large enough to span
  multiple nodes. They often require downloading huge files with the model
  weights.

These workload types specifically break many past assumptions:

{{< table caption="Workload assumptions before and now" >}}
| Before | Now |
| :---- | :---- |
| Can get a better CPU and the app will work faster. | Require a **specific** device (or **class of devices**) to run. |
| When something doesn’t work, just recreate it. | Allocation or reallocation is expensive. |
| Any node will work. No need to coordinate between Pods. | Scheduled in a special way - devices often connected in a cross-node topology. |
| Each Pod can be plug-and-play replaced if failed. | Pods are a part of a larger task. Lifecycle of an entire task depends on each Pod. |
| Container images are slim and easily available. | Container images may be so big that they require special handling. |
| Long initialization can be offset by slow rollout. | Initialization may be long and should be optimized, sometimes across many Pods together. |
| Compute nodes are commoditized and relatively inexpensive, so some idle time is acceptable. | Nodes with specialized hardware can be an order of magnitude more expensive than those without, so idle time is very wasteful. |
{{< /table >}}

The existing failure model was relying on old assumptions. It may still work for
the new workload types, but it has limited knowledge about devices and is very
expensive for them. In some cases, even prohibitively expensive. You will see
more examples later in this article.

### Why Kubernetes still reigns supreme

This article is not going deeper into the question: why not start fresh for  
AI/ML workloads since they are so different from the traditional Kubernetes
workloads. Despite many challenges, Kubernetes remains the platform of choice
for AI/ML workloads. Its maturity, security, and rich ecosystem of tools make it
a compelling option. While alternatives exist, they often lack the years of
development and refinement that Kubernetes offers. And the Kubernetes developers
are actively addressing the gaps identified in this article and beyond.

## The current state of device failure handling

This section outlines different failure modes and the best practices and DIY
(Do-It-Yourself) solutions used today. The next session will describe a roadmap
of improving things for those failure modes.

### Failure modes: K8s infrastructure

In order to understand the failures related to the Kubernetes infrastructure,
you need to understand how many moving parts are involved in scheduling a Pod on
the node. The sequence of events when the Pod is scheduled in the Node is as
follows:

1. *Device plugin* is scheduled on the Node  
1. *Device plugin* is registered with the *kubelet* via local gRPC  
1. *Kubelet* uses *device plugin* to watch for devices and updates capacity of
   the node  
1. *Scheduler* places a *user Pod* on a Node based on the updated capacity  
1. *Kubelet* asks *Device plugin* to **Allocate** devices for a *User Pod*  
1. *Kubelet* creates a *User Pod* with the allocated devices attached to it

This diagram shows some of those actors involved:

{{< figure src="k8s-infra-devices.svg" alt="The diagram shows relationships between the kubelet, Device plugin, and a user Pod. It shows that kubelet connects to the Device plugin named my-device, kubelet reports the node status with the my-device availability, and the user Pod requesting the 2 of my-device." >}}

As there are so many actors interconnected, every one of them and every
connection may experience interruptions. This leads to many exceptional
situations that are often considered failures, and may cause serious workload
interruptions:

* Pods failing admission at various stages of its lifecycle  
* Pods unable to run on perfectly fine hardware  
* Scheduling taking unexpectedly long time

{{< figure src="k8s-infra-failures.svg" alt="The same diagram as one above it, however it has an overlayed orange bang drawings over individual components with the text indicating what can break in that component. Over the kubelet text reads: 'kubelet restart: looses all devices info before re-Watch'. Over the Device plugin text reads: 'device plugin update, evictIon, restart: kubelet cannot Allocate devices or loses all devices state'. Over the user Pod text reads: 'slow pod termination: devices are unavailable'." >}}

The goal for Kubernetes is to make the interruption between these components as
reliable as possible. Kubelet already implements retries, grace periods, and
other techniques to improve it. The roadmap section goes into details on other
edge cases that the Kubernetes project tracks. However, all these improvements
only work when these best practices are followed:

* Configure and restart kubelet and the container runtime (such as containerd or CRI-O)
  as early as possible to not interrupt the workload.  
* Monitor device plugin health and carefully plan for upgrades.  
* Do not overload the node with less-important workloads to prevent interruption
  of device plugin and other components.  
* Configure user pods tolerations to handle node readiness flakes.  
* Configure and code graceful termination logic carefully to not block devices
  for too long.

Another class of Kubernetes infra-related issues is driver-related. With
traditional resources like CPU and memory, no compatibility checks between the
application and hardware were needed. With special devices like hardware
accelerators, there are new failure modes. Device drivers installed on the node:

* Must match the hardware  
* Be compatible with an app  
* Must work with other drivers (like [nccl](https://developer.nvidia.com/nccl),
  etc.)

Best practices for handling driver versions:

* Monitor driver installer health  
* Plan upgrades of infrastructure and Pods to match the version  
* Have canary deployments whenever possible

Following the best practices in this section and using device plugins and device
driver installers from trusted and reliable sources generally eliminate this
class of failures. Kubernetes is tracking work to make this space even better.

### Failure modes: device failed

There is very little handling of device failure in Kubernetes today. Device
plugins report the device failure only by changing the count of allocatable
devices. And Kubernetes relies on standard mechanisms like liveness probes or
container failures to allow Pods to communicate the failure condition to the
kubelet. However, Kubernetes does not correlate device failures with container
crashes and does not offer any mitigation beyond restarting the container while
being attached to the same device.

This is why many plugins and DIY solutions exist to handle device failures based
on various signals.

#### Health controller

In many cases a failed device will result in unrecoverable and very expensive
nodes doing nothing. A simple DIY solution is a _node health controller_. The
controller could compare the device allocatable count with the capacity and if
the capacity is greater, it starts a timer. Once the timer reaches a threshold,
the health controller kills and recreates a node.

There are problems with the _health controller_ approach:

* Root cause of the device failure is typically not known  
* The controller is not workload aware  
* Failed device might not be in use and you want to keep other devices running  
* The detection may be too slow as it is very generic  
* The node may be part of a bigger set of nodes and simply cannot be deleted in
  isolation without other nodes

There are variations of the health controller solving some of the problems
above. The overall theme here though is that to best handle failed devices, you
need customized handling for the specific workload. Kubernetes doesn’t yet offer
enough abstraction to express how critical the device is for a node, for the
cluster, and for the Pod it is assigned to.

#### Pod failure policy

Another DIY approach for device failure handling is a per-pod reaction on a
failed device. This approach is applicable for *training* workloads that are
implemented as Jobs.

Pod can define special error codes for device failures. For example, whenever
unexpected device behavior is encountered, Pod exits with a special exit code.
Then the Pod failure policy can handle the device failure in a special way. Read
more on [Handling retriable and non-retriable pod failures with Pod failure
policy](/docs/concepts/workloads/controllers/job/#pod-failure-policy)

There are some problems with the _Pod failure policy_ approach for Jobs:

* There is no well-known _device failed_ condition, so this approach does not work for the
  generic Pod case  
* Error codes must be coded carefully and in some cases are hard to guarantee.  
* Only works with Jobs with `restartPolicy: Never`, due to the limitation of a pod
  failure policy feature.

So, this solution has limited applicability.

#### Custom pod watcher

A little more generic approach is to implement the Pod watcher as a DIY solution
or use some third party tools offering this functionality. The pod watcher is
most often used to handle device failures for inference workloads.

Since Kubernetes just keeps a pod assigned to a device, even if the device is
reportedly unhealthy, the idea is to detect this situation with the pod watcher
and apply some remediation. It often involves obtaining device health status and
its mapping to the Pod using Pod Resources API on the node. If a device fails,
it can then delete the attached Pod as a remediation. The replica set will
handle the Pod recreation on a healthy device.

The other reasons to implement this watcher:

* Without it, the Pod will keep being assigned to the failed device forever.  
* There is no _descheduling_ for a pod with `restartPolicy=Always`.
* There are no built-in controllers that delete Pods in CrashLoopBackoff.

Problems with the _custom pod watcher_:

* The signal for the pod watcher is expensive to get, and involves some
  privileged actions.  
* It is a custom solution and it assumes the importance of a device for a Pod.  
* The pod watcher relies on external controllers to reschedule a Pod.

There are more variations of DIY solutions for handling device failures or
upcoming maintenance. Overall, Kubernetes has enough extension points to
implement these solutions. However, some extension points require higher
privilege than users may be comfortable with or are too disruptive. The roadmap
section goes into more details on specific improvements in handling the device
failures.

### Failure modes: container code failed

When the container code fails or something bad happens with it, like out of
memory conditions, Kubernetes knows how to handle those cases. There is either
the restart of a container, or a crash of a Pod if it has `restartPolicy: Never`
and scheduling it on another node. Kubernetes has limited expressiveness on what
is a failure (for example, non-zero exit code or liveness probe failure) and how
to react on such a failure (mostly either Always restart or immediately fail the
Pod).

This level of expressiveness is often not enough for the complicated AI/ML
workloads. AI/ML pods are better rescheduled locally or even in-place as that
would save on image pulling time and device allocation. AI/ML pods are often
interconnected and need to be restarted together. This adds another level of
complexity and optimizing it often brings major savings in running AI/ML
workloads.

There are various DIY solutions to handle Pod failures orchestration. The most
typical one is to wrap a main executable in a container by some orchestrator.
And this orchestrator will be able to restart the main executable whenever the
job needs to be restarted because some other pod has failed.

Solutions like this are very fragile and elaborate. They are often worth the
money saved comparing to a regular JobSet delete/recreate cycle when used in
large training jobs. Making these solutions less fragile and more streamlined
by developing new hooks and extension points in Kubernetes will make it
easy to apply to smaller jobs, benefiting everybody.

### Failure modes: device degradation

Not all device failures are terminal for the overall workload or batch job.
As the hardware stack gets more and more
complex, misconfiguration on one of the hardware stack layers, or driver
failures, may result in devices that are functional, but lagging on performance.
One device that is lagging behind can slow down the whole training job.

We see reports of such cases more and more often. Kubernetes has no way to
express this type of failures today and since it is the newest type of failure
mode, there is not much of a best practice offered by hardware vendors for
detection and third party tooling for remediation of these situations.

Typically, these failures are detected based on observed workload
characteristics. For example, the expected speed of AI/ML training steps on
particular hardware. Remediation for those issues is highly depend on a workload needs.

## Roadmap

As outlined in a section above, Kubernetes offers a lot of extension points
which are used to implement various DIY solutions. The space of AI/ML is
developing very fast, with changing requirements and usage patterns. SIG Node is
taking a measured approach of enabling more extension points to implement the
workload-specific scenarios over introduction of new semantics to support
specific scenarios. This means prioritizing making information about failures
readily available over implementing automatic remediations for those failures
that might only be suitable for a subset of workloads.

This approach ensures there are no drastic changes for workload handling which
may break existing, well-oiled DIY solutions or experiences with the existing
more traditional workloads.

Many error handling techniques used today work for AI/ML, but are very
expensive. SIG Node will invest in extension points to make those cheaper, with
the understanding that the price cutting for AI/ML is critical.

The following is the set of specific investments we envision for various failure
modes.

### Roadmap for failure modes: K8s infrastructure

The area of Kubernetes infrastructure is the easiest to understand and very
important to make right for the upcoming transition from Device Plugins to DRA.
SIG Node is tracking many work items in this area, most notably the following:

* [integrate kubelet with the systemd watchdog · Issue
  #127460](https://github.com/kubernetes/kubernetes/issues/127460)
* [DRA: detect stale DRA plugin sockets · Issue
 #128696](https://github.com/kubernetes/kubernetes/issues/128696)  
* [Support takeover for devicemanager/device-plugin · Issue
 #127803](https://github.com/kubernetes/kubernetes/issues/127803)  
* [Kubelet plugin registration reliability · Issue
 #127457](https://github.com/kubernetes/kubernetes/issues/127457)  
* [Recreate the Device Manager gRPC server if failed · Issue
 #128167](https://github.com/kubernetes/kubernetes/issues/128167)  
* [Retry pod admission on device plugin grpc failures · Issue
  #128043](https://github.com/kubernetes/kubernetes/issues/128043)

Basically, every interaction of Kubernetes components must be reliable via
either the kubelet improvements or the best practices in plugins development
and deployment.

### Roadmap for failure modes: device failed

For the device failures some patterns are already emerging in common scenarios
that Kubernetes can support. However, the very first step is to make information
about failed devices available easier. The very first step here is the work in
[KEP 4680](https://kep.k8s.io/4680) (Add Resource Health Status to the Pod Status for
Device Plugin and DRA).

Longer term ideas include to be tested:

* Integrate device failures into Pod Failure Policy.  
* Node-local retry policies, enabling pod failure policies for Pods with
  restartPolicy=OnFailure and possibly beyond that.  
* Ability to _deschedule_ pod, including with the `restartPolicy: Always`, so it can
  get a new device allocated.  
* Add device health to the ResourceSlice used to represent devices in DRA,
  rather than simply withdrawing an unhealthy device from the ResourceSlice.

### Roadmap for failure modes: container code failed

The main improvements to handle container code failures for AI/ML workloads are
all targeting cheaper error handling and recovery. The cheapness is mostly
coming from reuse of pre-allocated resources as much as possible. From reusing
the Pods by restarting containers in-place, to node local restart of containers
instead of rescheduling whenever possible, to snapshotting support, and
re-scheduling prioritizing the same node to save on image pulls.

Consider this scenario: A big training job needs 512 Pods to run. And one of the
pods failed. It means that all Pods need to be interrupted and synced up to
restart the failed step. The most efficient way to achieve this generally is to
reuse as many Pods as possible by restarting them in-place, while replacing the
failed pod to clear up the error from it. Like demonstrated in this picture:

{{< figure src="inplace-pod-restarts.svg" alt="The picture shows 512 pod, most ot them are green and have a recycle sign next to them indicating that they can be reused, and one Pod drawn in red, and a new green replacement Pod next to it indicating that it needs to be replaced." >}}

It is possible to implement this scenario, but all solutions implementing it are
fragile due to lack of certain extension points in Kubernetes. Adding these
extension points to implement this scenario is on the Kubernetes roadmap.

### Roadmap for failure modes: device degradation

There is very little done in this area - there is no clear detection signal,
very limited troubleshooting tooling, and no built-in semantics to express the
"degraded" device on Kubernetes. There has been discussion of adding data on
device performance or degradation in the ResourceSlice used by DRA to represent
devices, but it is not yet clearly defined. There are also projects like
[node-healthcheck-operator](https://github.com/medik8s/node-healthcheck-operator)
that can be used for some scenarios.

We expect developments in this area from hardware vendors and cloud providers, and we expect to see mostly DIY
solutions in the near future. As more users get exposed to AI/ML workloads, this
is a space needing feedback on patterns used here.

## Join the conversation

The Kubernetes community encourages feedback and participation in shaping the
future of device failure handling. Join SIG Node and contribute to the ongoing
discussions!

This blog post provides a high-level overview of the challenges and future
directions for device failure management in Kubernetes. By addressing these
issues, Kubernetes can solidify its position as the leading platform for AI/ML
workloads, ensuring resilience and reliability for applications that depend on
specialized hardware.
