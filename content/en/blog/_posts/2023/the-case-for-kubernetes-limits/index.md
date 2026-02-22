---
layout: blog
title: "The Case for Kubernetes Resource Limits: Predictability vs. Efficiency"
date: 2023-11-16
slug: the-case-for-kubernetes-resource-limits
author: >
  Milan Plžík (Grafana Labs)
---

There’s been quite a lot of posts suggesting that not using Kubernetes resource limits might be a fairly useful thing (for example, [For the Love of God, Stop Using CPU Limits on Kubernetes](https://home.robusta.dev/blog/stop-using-cpu-limits/) or [Kubernetes: Make your services faster by removing CPU limits](https://erickhun.com/posts/kubernetes-faster-services-no-cpu-limits/) ). The points made there are totally valid – it doesn’t make much sense to pay for compute power that will not be used due to limits, nor to artificially increase latency. This post strives to argue that limits have their legitimate use as well.

As a Site Reliability Engineer on the [Grafana Labs](https://grafana.com/) platform team, which maintains and improves internal infrastructure and tooling used by the product teams, I primarily try to make Kubernetes upgrades as smooth as possible. But I also spend a lot of time going down the rabbit hole of various interesting Kubernetes issues. This article reflects my personal opinion, and others in the community may disagree.

Let’s flip the problem upside down. Every pod in a Kubernetes cluster has inherent resource limits – the actual CPU, memory, and other resources of the machine it’s running on. If those physical limits are reached by a pod, it will experience throttling similar to what is caused by reaching Kubernetes limits.

## The problem
Pods without (or with generous) limits can easily consume the extra resources on the node. This, however, has a hidden cost – the amount of extra resources available often heavily depends on pods scheduled on the particular node and their actual load. These extra resources make each pod a special snowflake when it comes to real resource allocation. Even worse, it’s fairly hard to figure out the resources that the pod had at its disposal at any given moment – certainly not without unwieldy data mining of pods running on a particular node, their resource consumption, and similar. And finally, even if we pass this obstacle, we can only have data sampled up to a certain rate and get profiles only for a certain fraction of our calls. This can be scaled up, but the amount of observability data generated might easily reach diminishing returns. Thus, there’s no easy way to tell if a pod had a quick spike and for a short period of time used twice as much memory as usual to handle a request burst.

Now, with Black Friday and Cyber Monday approaching, businesses expect a surge in traffic. Good performance data/benchmarks of the past performance allow businesses to plan for some extra capacity. But is data about pods without limits reliable? With memory or CPU instant spikes handled by the extra resources, everything might look good according to past data. But once the pod bin-packing changes and the extra resources get more scarce, everything might start looking different – ranging from request latencies rising negligibly to requests slowly snowballing and causing pod OOM kills. While almost no one actually cares about the former, the latter is a serious issue that requires instant capacity increase.

## Configuring the limits
Not using limits takes a tradeoff – it opportunistically improves the performance if there are extra resources available, but lowers predictability of the performance, which might strike back in the future. There are a few approaches that can be used to increase the predictability again. Let’s pick two of them to analyze:

- **Configure workload limits to be a fixed (and small) percentage more than the requests** – I'll call it _fixed-fraction headroom_. This allows the use of some extra shared resources, but keeps the per-node overcommit bound and can be taken to guide worst-case estimates for the workload. Note that the bigger the limits percentage is, the bigger the variance in the performance that might happen across the workloads.
- **Configure workloads with `requests` = `limits`**. From some point of view, this is equivalent to giving each pod its own tiny machine with constrained resources; the performance is fairly predictable. This also puts the pod into the _Guaranteed_ QoS class, which makes it get evicted only after _BestEffort_ and _Burstable_ pods have been evicted by a node under resource pressure (see [Quality of Service for Pods](/docs/concepts/workloads/pods/pod-qos/)).

Some other cases might also be considered, but these are probably the two simplest ones to discuss.


## Cluster resource economy
Note that in both cases discussed above, we’re effectively preventing the workloads from using some cluster resources it has at the cost of getting more predictability – which might sound like a steep price to pay for a bit more stable performance. Let’s try to quantify the impact there.

### Bin-packing and cluster resource allocation
Firstly, let’s discuss bin-packing and cluster resource allocation. There’s some inherent cluster inefficiency that comes to play – it’s hard to achieve 100% resource allocation in a Kubernetes cluster. Thus, some percentage will be left unallocated.

When configuring fixed-fraction headroom limits, a proportional amount of this will be available to the pods. If the percentage of unallocated resources in the cluster is lower than the constant we use for setting fixed-fraction headroom limits (see the figure, line 2), all the pods together are able to theoretically use up all the node’s resources; otherwise there are some resources that will inevitably be wasted (see the figure, line 1). In order to eliminate the inevitable resource waste, the percentage for fixed-fraction headroom limits should be configured so that it’s at least equal to the expected percentage of unallocated resources.

{{<figure alt="Chart displaying various requests/limits configurations" class="diagram-medium" src="requests-limits-configurations.svg">}}

For requests = limits (see the figure, line 3), this does not hold: Unless we’re able to allocate all node’s resources, there’s going to be some inevitably wasted resources. Without any knobs to turn on the requests/limits side, the only suitable approach here is to ensure efficient bin-packing on the nodes by configuring correct machine profiles. This can be done either manually or by using a variety of cloud service provider tooling – for example [Karpenter](https://karpenter.sh/) for EKS or [GKE Node auto provisioning](https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-provisioning).

### Optimizing actual resource utilization
Free resources also come in the form of unused resources of other pods (reserved vs. actual CPU utilization, etc.), and their availability can’t be predicted in any reasonable way. Configuring limits makes it next to impossible to utilize these. Looking at this from a different perspective, if a workload wastes a significant amount of resources it has requested, re-visiting its own resource requests might be a fair thing to do. Looking at past data and picking more fitting resource requests might help to make the packing more tight (although at the price of worsening its performance – for example increasing long tail latencies).

## Conclusion
Optimizing resource requests and limits is hard. Although it’s much easier to break things when setting limits, those breakages might help prevent a catastrophe later by giving more insights into how the workload behaves in bordering conditions. There are cases where setting limits makes less sense: batch workloads (which are not latency-sensitive – for example non-live video encoding), best-effort services (don’t need that level of availability and can be preempted), clusters that have a lot of spare resources by design (various cases of specialty workloads – for example services that handle spikes by design). 

On the other hand, setting limits shouldn’t be avoided at all costs – even though figuring out the "right” value for limits is harder and configuring a wrong value yields less forgiving situations. Configuring limits helps you learn about a workload’s behavior in corner cases, and there are simple strategies that can help when reasoning about the right value. It’s a tradeoff between efficient resource usage and performance predictability and should be considered as such.

There’s also an economic aspect of workloads with spiky resource usage. Having “freebie” resources always at hand does not serve as an incentive to improve performance for the product team. Big enough spikes might easily trigger efficiency issues or even problems when trying to defend a product’s SLA – and thus, might be a good candidate to mention when assessing any risks. 
