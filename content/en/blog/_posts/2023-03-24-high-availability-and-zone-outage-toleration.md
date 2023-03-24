---
layout: blog
title: "High Availability and Zone Outage Toleration"
date: 2023-03-24
slug: high-availability-and-zone-outage-toleration
---

**Authors:** [Vedran Lerenc](mailto:vedran.lerenc@sap.com) (SAP)

Developing highly available workload that can tolerate a zone outage is no trivial task. You will find here various recommendations to get closer to that goal. While many recommendations are general enough, the examples are specific in how to achieve this in a [Gardener](https://gardener.cloud)-managed cluster and where/how to tweak the different control plane components. If you do not use Gardener, it may be still a worthwhile read as most settings can be influenced with most of the Kubernetes providers.

First however, what is a zone outage? It sounds like a clear-cut "thing", but it isn't. There are many things that can go haywire. Here are some examples:

- Elevated cloud provider API error rates for individual or multiple services
- Network bandwidth reduced or latency increased, usually also effecting storage sub systems as they are network attached
- No networking at all, no DNS, machines shutting down or restarting, ...
- Functional issues, of either the entire service (e.g. all block device operations) or only parts of it (e.g. LB listener registration)
- All services down, temporarily or permanently (the proverbial burning down data center :fire:)

This and everything in between make it hard to prepare for such events, but you can still do a lot. The most important recommendation is to not target specific issues exclusively - tomorrow another service will fail in an unanticipated way. Also, focus more on [meaningful availability](https://research.google/pubs/pub50828) than on internal signals (useful, but not as relevant as the former). Always prefer automation over manual intervention (e.g. leader election is a pretty robust mechanism, auto-scaling may be required as well, etc.).

Also remember that HA is costly - you need to balance it against the cost of an outage as silly as this may sound, e.g. running all this excess capacity "just in case" vs. "going down" vs. a risk-based approach in between where you have means that will kick in, but they are not guaranteed to work (e.g. if the cloud provider is out of resource capacity). Maybe some of your components must run at the highest possible availability level, but others not - that's a decision only you can make.

## Control Plane

The Kubernetes cluster control plane is managed by Gardener (as pods in separate infrastructure clusters to which you have no direct access) and can be set up with no failure tolerance (control plane pods will be recreated best-effort when resources are available) or one of the [failure tolerance types `node` or `zone`](https://github.com/gardener/gardener/blob/master/docs/usage/shoot_high_availability.md).

Strictly speaking, static workload does not depend on the (high) availability of the control plane, but static workload doesn't rhyme with Cloud and Kubernetes and also means, that when you possibly need it the most, e.g. during a zone outage, critical self-healing or auto-scaling functionality won't be available to you and your workload, if your control plane is down as well. That's why it's generally recommended to use the failure tolerance type `zone` for the control planes of productive clusters, at least in all regions that have 3+ zones. Regions that have only 1 or 2 zones don't support the failure tolerance type `zone` and then your second best option is the failure tolerance type `node`, which means a zone outage can still take down your control plane, but individual node outages won't.

In the `shoot` resource it's merely only this what you need to add:

``` yaml
apiVersion: core.gardener.cloud/v1beta1
kind: Shoot
spec:
  controlPlane:
    highAvailability:
      failureTolerance:
        type: zone # valid values are `node` and `zone` (only available if your control plane resides in a region with 3+ zones)
```

This setting will scale out all control plane components for a Gardener cluster as necessary, so that no single zone outage can take down the control plane for longer than just a few seconds for the fail-over to take place (e.g. lease expiration and new leader election or readiness probe failure and endpoint removal). Components run highly available in either active-active (servers) or active-passive (controllers) mode at all times, the persistence (ETCD), which is consensus-based, will tolerate the loss of one zone and still maintain quorum and therefore remain operational. These are all patterns that we will revisit down below also for your own workload.

## Worker Pools

Now that you have configured your Kubernetes cluster control plane in HA, i.e. spread it across multiple zones, you need to do the same for your own workload, but in order to do so, you need to spread your nodes across multiple zones first.

``` yaml
apiVersion: core.gardener.cloud/v1beta1
kind: Shoot
spec:
  provider:
    workers:
    - name: ...
      minimum: 6
      maximum: 600
      zones:
      - ...
```

Prefer regions with at least 2, better 3+ zones and list the zones in the `zones` section for each of your worker pools. Whether you need 2 or 3 zones at a minimum depends on your fail-over concept:

- Consensus-based software components (like ETCD) depend on maintaining a quorum of `(n/2)+1`, so you need at least 3 zones to tolerate the outage of 1 zone.
- Primary/Secondary-based software components need just 2 zones to tolerate the outage of 1 zone.
- Then there are software components that can scale out horizontally. They are probably fine with 2 zones, but you also need to think about the load-shift and that the remaining zone must then pick up the work of the unhealthy zone. With 2 zones, the remaining zone must cope with an increase of 100% load. With 3 zones, the remaining zones must only cope with an increase of 50% load (per zone).

In general, the question is also whether you have the fail-over capacity already up and running or not. If not, i.e. you depend on re-scheduling to a healthy zone or auto-scaling, be aware that during a zone outage, you will see a resource crunch in the healthy zones. If you have no automation, i.e. only human operators (a.k.a. "red button approach"), you probably will not get the machines you need and even with automation, it may be tricky. But holding the capacity available at all times is costly. In the end, that's a decision only you can make. If you made that decision, please adapt the `minimum` and `maximum` settings for your worker pools accordingly.

Also, consider fall-back worker pools (with different/alternative machine types) and [cluster autoscaler expanders](https://github.com/gardener/autoscaler/blob/machine-controller-manager-provider/cluster-autoscaler/FAQ.md#what-are-expanders) using a [priority-based strategy](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/expander/priority/readme.md).

Gardener-managed clusters deploy the [cluster autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) or CA for short and you can [tweak the general CA knobs](https://gardener.cloud/docs/gardener/api-reference/core/#clusterautoscaler) for Gardener-managed clusters like this:

``` yaml
apiVersion: core.gardener.cloud/v1beta1
kind: Shoot
spec:
  kubernetes:
    clusterAutoscaler:
      expander: "least-waste"
      scanInterval: 10s
      scaleDownDelayAfterAdd: 60m
      scaleDownDelayAfterDelete: 0s
      scaleDownDelayAfterFailure: 3m
      scaleDownUnneededTime: 30m
      scaleDownUtilizationThreshold: 0.5
```

If you want to be ready for a sudden spike or have some buffer in general, [over-provision nodes by means of "placeholder" pods](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-can-i-configure-overprovisioning-with-cluster-autoscaler) with [low priority](https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption) and appropriate resource requests. This way, they will demand nodes to be provisioned for them, but if any pod comes up with a regular/higher priority, the low priority pods will be evicted to make space for the more important ones. Strictly speaking, this is not related to HA, but it may be important to keep this in mind as you generally want critical components to be rescheduled as fast as possible and if there is no node available, it may take 3 minutes or longer to do so (depending on the cloud provider). Besides, not only zones can fail, but also individual nodes.

## Replicas (Horizontal Scaling)

Now let's talk about your workload. In most cases, this will mean to run multiple replicas. If you cannot do that (a.k.a. you have a singleton), that's a bad situation to be in. Maybe you can run a spare (secondary) as backup? If you cannot, you depend on quick detection and rescheduling of your singleton (more on that below).

Obviously, things get messier with persistence. If you have persistence, you should ideally replicate your data, i.e. let your spare (secondary) "follow" your main (primary). If your software doesn't support that, you have to deploy other means, e.g. [volume snapshotting](https://kubernetes.io/docs/concepts/storage/volume-snapshots) or side-backups (specific to the software you deploy; keep the backups regional, so that you can switch to another zone at all times). If you have to do those, your HA scenario becomes more a DR scenario and terms like RPO and RTO become relevant to you:

- **Recovery Point Objective (RPO)**: Potential data loss, i.e. how much data will you lose at most (time between backups)
- **Recovery Time Objective  (RTO)**: Time until recovery, i.e. how long does it take you to be operational again (time to restore)

Also, keep in mind that your persistent volumes are usually zonal, i.e. once you have a volume in one zone, it's bound to that zone and you cannot get up your pod in another zone w/o first recreating the volume yourself (Kubernetes won't help you here directly).

Anyway, best avoid that, if you can (from technical and cost perspective). The best solution (and also the most costly one) is to run multiple replicas in multiple zones and keep your data replicated at all times, so that your RPO is always 0 (best). That's what we do for Gardener-managed cluster HA control planes (ETCD) as any data loss may be disastrous and lead to orphaned resources (in addition, we deploy side cars that do side-backups for disaster recovery, with full and incremental snapshots with an RPO of 5m).

So, how to run with multiple replicas? That's the easiest part in Kubernetes and the two most important resources, `Deployments` and `StatefulSet`, support that out of the box:

``` yaml
apiVersion: apps/v1
kind: Deployment | StatefulSet
spec:
  replicas: ...
```

The problem comes with the number of replicas. It's easy only if the number is static, e.g. 2 for active-active/passive or 3 for consensus-based software components, but what with software components that can scale out horizontally? Here you usually do not set the number of replicas statically, but make use of the [horizontal pod autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale) or HPA for short (built-in; part of the kube-controller-manager). There are also other options like the [cluster proportional autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler), but while the former works based on metrics, the latter is more a guestimate approach that derives the number of replicas from the number of nodes/cores in a cluster. Sometimes useful, but often blind to the actual demand.

So, HPA it is then for most of the cases. However, what is the resource (e.g. CPU or memory) that drives the number of desired replicas? Again, this is up to you, but not always are CPU or memory the best choices. In some cases, [custom metrics](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/#scaling-on-custom-metrics) may be more appropriate, e.g. requests per second (it was also for us).

You will have to create specific `HorizontalPodAutoscaler` resources for your scale target and can [tweak the general HPA knobs](https://gardener.cloud/docs/gardener/api-reference/core/#horizontalpodautoscalerconfig) for Gardener-managed clusters like this:

``` yaml
apiVersion: core.gardener.cloud/v1beta1
kind: Shoot
spec:
  kubernetes:
    kubeControllerManager:
      horizontalPodAutoscaler:
        syncPeriod: 15s
        tolerance: 0.1
        downscaleStabilization: 5m0s
        initialReadinessDelay: 30s
        cpuInitializationPeriod: 5m0s
```

## Resources (Vertical Scaling)

While it is important to set a sufficient number of replicas, it is also important to give the pods sufficient resources (CPU and memory). This is especially true when you think about HA. When a zone goes down, you might need to get up replacement pods, if you don't have them running already to take over the load from the impacted zone. Likewise, e.g. with active-active software components, you can expect the remaining pods to receive more load. If you cannot scale them out horizontally to serve the load, you will probably need to scale them out (or rather up) vertically. This is done by the [vertical pod autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler) or VPA for short (not built-in; part of the [kubernetes/autoscaler](https://github.com/kubernetes/autoscaler) repository).

A few caveats though:

- You cannot use HPA and VPA on the same metrics as they would influence each other, which would lead to pod trashing (more replicas require fewer resources; fewer resources require more replicas)
- Scaling horizontally doesn't cause downtimes (at least not when out-scaling and only one replica is affected when in-scaling), but scaling vertically does (if the pod runs OOM anyway, but also when new recommendations are applied, resource requests for existing pods may be changed, which causes the pods to be rescheduled). Although the discussion is going on for a very long time now, that is still not supported in-place yet (see [KEP 1287](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/1287-in-place-update-pod-resources/README.md), [implementation in Kubernetes](https://github.com/kubernetes/kubernetes/pull/102884), [implementation in VPA](https://github.com/kubernetes/autoscaler/issues/4016)).

VPA is a useful tool and Gardener-managed clusters deploy a VPA by default for you (HPA is supported anyway as it's built into the kube-controller-manager). You will have to create specific `VerticalPodAutoscaler` resources for your scale target and can [tweak the general VPA knobs](https://gardener.cloud/docs/gardener/api-reference/core/#verticalpodautoscaler) for Gardener-managed clusters like this:

``` yaml
apiVersion: core.gardener.cloud/v1beta1
kind: Shoot
spec:
  kubernetes:
    verticalPodAutoscaler:
      enabled: true
      evictAfterOOMThreshold: 10m0s
      evictionRateBurst: 1
      evictionRateLimit: -1
      evictionTolerance: 0.5
      recommendationMarginFraction: 0.15
      updaterInterval: 1m0s
      recommenderInterval: 1m0s
```

While horizontal pod autoscaling is relatively straight-forward, it takes a long time to master vertical pod autoscaling. We saw [performance issues](https://github.com/kubernetes/autoscaler/issues/4498), hard-coded behavior (on OOM, memory is bumped by +20% and it may take a few iterations to reach a good level), unintended pod disruptions by applying new resource requests (after 12h all targeted pods will receive new requests even though individually they would be fine without, which also drives active-passive resource consumption up), difficulties to deal with spiky workload in general (due to the algorithmic approach it takes), recommended requests may exceed node capacity, limit scaling is proportional and therefore often questionable, and more. VPA is a double-edged sword: useful and necessary, but not easy to handle.

For the Gardener-managed components, we mostly removed limits. Why?

- CPU limits have almost always only downsides. They cause needless CPU throttling, which is not even easily visible. CPU requests turn into `cpu shares`, so if the node has capacity, the pod may consume the freely available CPU, but not if you have set limits, which curtail the pod by means of `cpu quota`. There are only certain scenarios in which they may make sense, e.g. if you set requests=limits and thereby define a pod with `guaranteed` [QoS](https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod), which influences your `cgroup` placement. However, that is difficult to do for the components you implement yourself and practically impossible for the components you just consume, because what's the correct value for requests/limits and will it hold true also if the load increases and what happens if a zone goes down or with the next update/version of this component? If anything, CPU limits caused outages, not helped prevent them.
- As for memory limits, they are slightly more useful, because CPU is compressible and memory is not, so if one pod runs berserk, it may take others down (with CPU, `cpu shares` make it as fair as possible), depending on which OOM killer strikes (a complicated topic by itself). You don't want the operating system OOM killer to strike as the result is unpredictable. Better, it's the cgroup OOM killer or even the `kubelet`'s eviction, if the consumption is slow enough as [it takes priorities into consideration](https://kubernetes.io/docs/concepts/scheduling-eviction/pod-priority-preemption/#interactions-of-pod-priority-and-qos) even. If your component is critical and a singleton (e.g. node daemon set pods), you are better off also without memory limits, because letting the pod go OOM because of artificial/wrong memory limits can mean that the node becomes unusable. Hence, such components also better run only with no or a very high memory limit, so that you can catch the occasional memory leak (bug) eventually, but under normal operation, if you cannot decide about a true upper limit, rather not have limits and cause endless outages through them or when you need the pods the most (during a zone outage) where all your assumptions went out of the window.

The downside of having poor or no limits and poor and no requests is that nodes may "die" more often. Contrary to the expectation, even for managed services, the managed service is not responsible or cannot guarantee the health of a node under all circumstances, since the end user defines what is run on the nodes (shared responsibility). If the workload exhausts any resource, it will be the end of the node, e.g. by compressing the CPU too much (so that the `kubelet` fails to do its work), exhausting the main memory too fast, disk space, file handles, or any other resource.

The `kubelet` allows for [explicit reservation of resources](https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources) for operating system daemons (`system-reserved`) and Kubernetes daemons (`kube-reserved`) that are subtracted from the actual node resources and become the allocatable node resources for your workload/pods. All managed services configure these settings "by rule of thumb" (a balancing act), but cannot guarantee that the values won't waste resources or always will be sufficient. You will have to fine-tune them eventually and adapt them to your needs. In addition, you can configure [soft and hard eviction thresholds](https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction) to give the `kubelet` some headroom to evict "greedy" pods in a controlled way. These settings can be configured for Gardener-managed clusters like this:

``` yaml
apiVersion: core.gardener.cloud/v1beta1
kind: Shoot
spec:
  kubernetes:
    kubelet:
      systemReserved:                          # explicit resource reservation for operating system daemons
        cpu: 100m
        memory: 1Gi
        ephemeralStorage: 1Gi
        pid: 1000
      kubeReserved:                            # explicit resource reservation for Kubernetes daemons
        cpu: 100m
        memory: 1Gi
        ephemeralStorage: 1Gi
        pid: 1000
      evictionSoft:                            # soft, i.e. graceful eviction (used if the node is about to run out of resources, avoiding hard evictions)
        memoryAvailable: 200Mi
        imageFSAvailable: 10%
        imageFSInodesFree: 10%
        nodeFSAvailable: 10%
        nodeFSInodesFree: 10%
      evictionSoftGracePeriod:                 # caps pod's `terminationGracePeriodSeconds` value during soft evictions (specific grace periods)
        memoryAvailable: 1m30s
        imageFSAvailable: 1m30s
        imageFSInodesFree: 1m30s
        nodeFSAvailable: 1m30s
        nodeFSInodesFree: 1m30s
      evictionHard:                            # hard, i.e. immediate eviction (used if the node is out of resources, avoiding the OS generally run out of resources fail processes indiscriminately)
        memoryAvailable: 100Mi
        imageFSAvailable: 5%
        imageFSInodesFree: 5%
        nodeFSAvailable: 5%
        nodeFSInodesFree: 5%
      evictionMinimumReclaim:                  # additional resources to reclaim after hitting the hard eviction thresholds to not hit the same thresholds soon after again
        memoryAvailable: 0Mi
        imageFSAvailable: 0Mi
        imageFSInodesFree: 0Mi
        nodeFSAvailable: 0Mi
        nodeFSInodesFree: 0Mi
      evictionMaxPodGracePeriod: 90            # caps pod's `terminationGracePeriodSeconds` value during soft evictions (general grace periods)
      evictionPressureTransitionPeriod: 5m0s   # stabilization time window to avoid flapping of node eviction state
```

You can tweak these settings also individually per worker pool (`spec.provider.workers.kubernetes.kubelet...`), which makes sense especially with different machine types (and also workload that you may want to schedule there).

Physical memory is not compressible, but you can overcome this issue to some degree (alpha since Kubernetes `v1.22` in combination with the feature gate `NodeSwap` on the `kubelet`) with swap memory. You can read more in this [introductory blog](https://kubernetes.io/blog/2021/08/09/run-nodes-with-swap-alpha) and the [docs](https://kubernetes.io/docs/concepts/architecture/nodes/#swap-memory). If you chose to use it (still only alpha at the time of this writing) you may want to consider also the risks associated with swap memory:

- Reduced performance predictability
- Reduced performance up to page trashing
- Reduced security as secrets, normally held only in memory, could be swapped out to disk

That said, the various options mentioned above are only remotely related to HA and will not be further explored throughout this document, but just to remind you: if a zone goes down, load patterns will shift, existing pods will probably receive more load and will require more resources (especially because it is often practically impossible to set "proper" resource requests, which drive node allocation - limits are always ignored by the scheduler) or more pods will/must be placed on the existing and/or new nodes and then these settings, which are generally critical (especially if you switch on [bin-packing for Gardener-managed clusters](https://github.com/gardener/gardener/blob/master/docs/usage/shoot_scheduling_profiles.md) as a cost saving measure), will become even more critical during a zone outage.

## Probes

Before we go down the rabbit hole even further and talk about how to spread your replicas, we need to talk about probes first, as they will become relevant later. Kubernetes supports three kinds of probes: [startup, liveness, and readiness probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes). If you are a [visual thinker](https://twitter.com/thockin/status/1615468485987143682), also check out this [slide deck](https://speakerdeck.com/thockin/kubernetes-pod-probes) by [Tim Hockin](https://www.linkedin.com/in/tim-hockin-6501072) (Kubernetes networking SIG chair).

Basically, the `startupProbe` and the `livenessProbe` help you restart the container, if it's unhealthy for whatever reason, by letting the `kubelet` that orchestrates your containers on a node know, that it's unhealthy. The former is a special case of the latter and only applied at the startup of your container, if you need to handle the startup phase differently (e.g. with very slow starting containers) from the rest of the lifetime of the container.

Now, the `readinessProbe` helps you manage the ready status of your container and thereby pod (any container that is not ready turns the pod not ready). This again has impact on endpoints and pod disruption budgets:

- If the pod is not ready, the endpoint will be removed and the pod will not receive traffic anymore
- If the pod is not ready, the pod counts into the pod disruption budget and if the budget is exceeded, no further voluntary pod disruptions will be permitted for the remaining ready pods (e.g. no eviction, no voluntary horizontal or vertical scaling, if the pod runs on a node that is about to be drained or in draining, draining will be paused until the max drain timeout passes)

As you can see, all of these probes are (also) related to HA (mostly the `readinessProbe`, but depending on your workload, you can also leverage `livenessProbe` and `startupProbe` into your HA strategy). If Kubernetes doesn't know about the individual status of your container/pod, it won't do anything for you (right away). That said, later/indirectly something might/will happen via the node status that can also be ready or not ready, which influences the pods and load balancer listener registration (a not ready node will not receive cluster traffic anymore), but this process is worker pool global and reacts delayed and also doesn't discriminate between the containers/pods on a node.

In addition, Kubernetes also offers [pod readiness gates](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate) to amend your pod readiness with additional custom conditions (normally, only the sum of the container readiness matters, but pod readiness gates additionally count into the overall pod readiness). This may be useful if you want to block (by means of pod disruption budgets that we will talk about next) the roll-out of your workload/nodes in case some (possibly external) condition fails.

## Pod Disruption Budgets

One of the most important resources that help you on your way to HA are [pod disruption budgets](https://kubernetes.io/docs/tasks/run-application/configure-pdb) or PDB for short. They tell Kubernetes how to deal with voluntary pod disruptions, e.g. during the deployment of your workload, when the nodes are rolled, or just in general when a pod shall be evicted/terminated. Basically, if the budget is reached, they block all voluntary pod disruptions (at least for a while until possibly other timeouts act or things happen that leave Kubernetes no choice anymore, e.g. the node is forcefully terminated). You should always define them for your workload.

Very important to note is that they are based on the `readinessProbe`, i.e. even if all of your replicas are `lively`, but not enough of them are `ready`, this blocks voluntary pod disruptions, so they are very critical and useful. Here an example (you can specify either `minAvailable` or `maxUnavailable` in absolute numbers or as percentage):

``` yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
spec:
  maxUnavailable: 1
  selector:
    matchLabels:
      ...
```

And please do not specify a PDB of `maxUnavailable` being 0 or similar. That's pointless, even detrimental, as it blocks then even useful operations, forces always the hard timeouts that are, well... less graceful and it doesn't make sense in the context of HA. You cannot "force" HA by preventing voluntary pod disruptions, you must work with the pod disruptions in a resilient way. Besides, PDBs are really only about voluntary pod disruptions - something bad can happen to a node/pod at any time and PDBs won't make this reality go away for you.

PDBs will not always work as expected and can also get in your way, e.g. if the PDB is violated or would be violated, it may possibly block whatever you are trying to do to salvage the situation, e.g. drain a node or deploy a patch version (if the PDB is or would be violated, not even unhealthy pods would be evicted as they could theoretically become healthy again, which Kubernetes doesn't know). In order to overcome this issue, it is now possible (alpha since Kubernetes `v1.26` in combination with the feature gate `PDBUnhealthyPodEvictionPolicy` on the API server) to configure the so-called [unhealthy pod eviction policy](https://kubernetes.io/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy). The default is still `IfHealthyBudget` as a change in default would have changed the behavior (as described above), but you can now also set `AlwaysAllow` at the PDB (`spec.unhealthyPodEvictionPolicy`). For more information, please check out [this discussion](https://github.com/kubernetes/kubernetes/issues/72320), [the PR](https://github.com/kubernetes/kubernetes/pull/105296) and [this document](https://groups.google.com/g/kubernetes-sig-apps/c/_joO4swogKY?pli=1) and balance the pros and cons for yourself. In short,
the new `AlwaysAllow` option is probably the better choice in most of the cases while `IfHealthyBudget` is useful only if you have frequent temporary transitions or for special cases where you have already implemented controllers that depend on the old behavior.

## Pod Topology Spread Constraints

[Pod topology spread constraints](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints) or PTSC for short (no official abbreviation exists, but we will use this in the following) are enormously helpful to distribute your replicas across multiple zones, nodes, or any other user-defined topology domain. They complement and improve on [pod (anti-)affinities](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) that still exist and can be used in combination.

PTSCs are an improvement, because they allow for `maxSkew` and `minDomains`. You can steer the "level of tolerated imbalance" with `maxSkew`, e.g. you probably want that to be at least 1, so that you can perform a rolling update, but this all depends on your [deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment) (`maxUnavailable` and `maxSurge`), etc. [Stateful sets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#rolling-updates) are a bit different (`maxUnavailable`) as they are bound to volumes and depend on them, so there usually cannot be 2 pods requiring the same volume. `minDomains` is a hint to tell the scheduler how far to spread, e.g. if all nodes in one zone disappeared because of a zone outage, it may "appear" as if there are only 2 zones in a 3 zones cluster and the scheduling decisions may end up wrong, so a `minDomains` of 3 will tell the scheduler to spread to 3 zones before adding another replica in one zone. Be careful with this setting as it also means, if one zone is down the "spread" is already at least 1, if pods run in the other zones. This is useful where you have exactly as many replicas as you have zones and you do not want any imbalance. Imbalance is critical as if you end up with one, nobody is going to do the (active) re-balancing for you (unless you deploy and configure additional non-standard components such as the [descheduler](https://github.com/kubernetes-sigs/descheduler)). So, for instance, if you have something like a DBMS that you want to spread across 2 zones (active-passive) or 3 zones (consensus-based), you better specify `minDomains` of 2 respectively 3 to force your replicas into at least that many zones before adding more replicas to another zone (if supported).

Anyway, PTSCs are critical to have, but not perfect, so we saw (unsurprisingly, because that's how the scheduler works), that the scheduler may block the deployment of new pods because it takes the decision pod-by-pod (see for instance [#109364](https://github.com/kubernetes/kubernetes/issues/109364)).

## Pod Affinities and Anti-Affinities

As said, you can combine PTSCs with [pod affinities and/or anti-affinities](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity). Especially [inter-pod (anti-)affinities](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity) may be helpful to place pods *apart*, e.g. because they are fall-backs for each other or you do not want multiple potentially resource-hungry ["best-effort"](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#besteffort) or ["burstable"](https://kubernetes.io/docs/concepts/workloads/pods/pod-qos/#burstable) pods side-by-side (noisy neighbor problem), or *together*, e.g. because they form a unit and you want to reduce the failure domain, reduce the network latency, and reduce the costs.

## Topology Aware Hints

While [topology aware hints](https://kubernetes.io/docs/concepts/services-networking/topology-aware-hints) are not directly related to HA, they are very relevant in the HA context. Spreading your workload across multiple zones may increase network latency and cost significantly, if the traffic is not shaped. Topology aware hints (beta since Kubernetes `v1.23`, replacing the now deprecated topology aware traffic routing with topology keys) help to route the traffic within the originating zone, if possible. Basically, they tell `kube-proxy` how to setup your routing information, so that clients can talk to endpoints that are located within the same zone.

Be aware however, that there are some limitations. Those are called [safeguards](https://kubernetes.io/docs/concepts/services-networking/topology-aware-hints/#safeguards) and if they strike, the hints are off and traffic is routed again randomly. Especially controversial is the balancing limitation as there is the assumption, that the load that hits an endpoint is determined by the allocatable CPUs in that topology zone, but that's not always, if even often, the case (see for instance [#113731](https://github.com/kubernetes/kubernetes/issues/113731) and [#110714](https://github.com/kubernetes/kubernetes/issues/110714)). So, this limitation hits far too often and your hints are off, but then again, it's about network latency and cost optimization first, so it's better than nothing.

## Networking

We have talked about networking only to some small degree so far (`readiness` probes, pod disruption budgets, topology aware hints). The most important component is probably your ingress load balancer - everything else is managed by Kubernetes. AWS, Azure, GCP, and also OpenStack offer multi-zonal load balancers, so make use of them. In Azure and GCP, LBs are regional whereas in AWS and OpenStack, they need to be bound to a zone, which the cloud-controller-manager does by observing the zone labels at the nodes (please note that this behavior is not always working as expected, see [#570](https://github.com/kubernetes/cloud-provider-aws/issues/569) where the AWS cloud-controller-manager is not readjusting to newly observed zones).

Please be reminded that even if you use a service mesh like [Istio](https://istio.io), the off-the-shelf installation/configuration usually never comes with productive settings (on purpose) and you will have to fine-tune your installation/configuration, much like the rest of your workload.

## Relevant Cluster Settings

Following now a summary/list of the more relevant settings you may like to tune for Gardener-managed clusters:

``` yaml
apiVersion: core.gardener.cloud/v1beta1
kind: Shoot
spec:
  controlPlane:
    highAvailability:
      failureTolerance:
        type: zone # valid values are `node` and `zone` (only available if your control plane resides in a region with 3+ zones)
  kubernetes:
    kubeAPIServer:
      defaultNotReadyTolerationSeconds: 300
      defaultUnreachableTolerationSeconds: 300
    kubelet:
      ...
    kubeScheduler:
      featureGates:
        MinDomainsInPodTopologySpread: true
    kubeControllerManager:
      nodeMonitorPeriod: 10s
      nodeMonitorGracePeriod: 40s
      horizontalPodAutoscaler:
        syncPeriod: 15s
        tolerance: 0.1
        downscaleStabilization: 5m0s
        initialReadinessDelay: 30s
        cpuInitializationPeriod: 5m0s
    verticalPodAutoscaler:
      enabled: true
      evictAfterOOMThreshold: 10m0s
      evictionRateBurst: 1
      evictionRateLimit: -1
      evictionTolerance: 0.5
      recommendationMarginFraction: 0.15
      updaterInterval: 1m0s
      recommenderInterval: 1m0s
    clusterAutoscaler:
      expander: "least-waste"
      scanInterval: 10s
      scaleDownDelayAfterAdd: 60m
      scaleDownDelayAfterDelete: 0s
      scaleDownDelayAfterFailure: 3m
      scaleDownUnneededTime: 30m
      scaleDownUtilizationThreshold: 0.5
  provider:
    workers:
    - name: ...
      minimum: 6
      maximum: 600
      maxSurge: 3
      maxUnavailable: 0
      zones:
      - ... # list of zones you want your worker pool nodes to be spread across, see above
      kubernetes:
        kubelet:
          ... # similar to `kubelet` above (cluster-wide settings), but here per worker pool (pool-specific settings), see above
      machineControllerManager: # optional, it allows to configure the machine-controller settings.
        machineCreationTimeout: 20m
        machineHealthTimeout: 10m
        machineDrainTimeout: 60h
  systemComponents:
    coreDNS:
      autoscaling:
        mode: horizontal # valid values are `horizontal` (driven by CPU load) and `cluster-proportional` (driven by number of nodes/cores)
```

#### On `spec.controlPlane.highAvailability.failureTolerance.type`

If set, determines the degree of failure tolerance for your control plane. `zone` is preferred, but only available if your control plane resides in a region with 3+ zones. See [above](#control-plane) and the [docs](https://github.com/gardener/gardener/blob/master/docs/usage/shoot_high_availability.md).

#### On `spec.kubernetes.kubeAPIServer.defaultUnreachableTolerationSeconds` and `defaultNotReadyTolerationSeconds`

This is a very interesting [API server setting](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver) that lets Kubernetes decide how fast to evict pods from nodes whose status condition of type `Ready` is either `Unknown` (node status unknown, a.k.a unreachable) or `False` (`kubelet` not ready) (see [node status conditions](https://kubernetes.io/docs/concepts/architecture/nodes/#condition); please note that `kubectl` shows both values as `NotReady` which is a somewhat "simplified" visualization).

You can also override the cluster-wide API server settings [individually per pod](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions):

``` yaml
spec:
  tolerations:
  - key: "node.kubernetes.io/unreachable"
    operator: "Exists"
    effect: "NoExecute"
    tolerationSeconds: 0
  - key: "node.kubernetes.io/not-ready"
    operator: "Exists"
    effect: "NoExecute"
    tolerationSeconds: 0
```

This will evict pods on unreachable or not-ready nodes immediately, but be cautious: `0` is very aggressive and may lead to unnecessary disruptions. Again, you must decide for your own workload and balance out the pros and cons (e.g. long startup time).

Please note, these settings replace `spec.kubernetes.kubeControllerManager.podEvictionTimeout` that was deprecated with Kubernetes `v1.26` (and acted as an upper bound).

#### On `spec.kubernetes.kubeScheduler.featureGates.MinDomainsInPodTopologySpread`

Required to be enabled for `minDomains` to work with PTSCs (beta since Kubernetes `v1.25`, but off by default). See [above](#pod-topology-spread-constraints) and the [docs](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/#topologyspreadconstraints-field). This tells the scheduler, how many topology domains to expect (=zones in the context of this document).

#### On `spec.kubernetes.kubeControllerManager.nodeMonitorPeriod` and `nodeMonitorGracePeriod`

This is another very interesting [kube-controller-manager setting](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager) that can help you speed up or slow down how fast a node shall be considered `Unknown` (node status unknown, a.k.a unreachable) when the `kubelet` is not updating its status anymore (see [node status conditions](https://kubernetes.io/docs/concepts/architecture/nodes/#condition)), which effects eviction (see `spec.kubernetes.kubeAPIServer.defaultUnreachableTolerationSeconds` and `defaultNotReadyTolerationSeconds` above). The shorter the time window, the faster Kubernetes will act, but the higher the chance of flapping behavior and pod trashing, so you may want to balance that out according to your needs, otherwise stick to the default which is a reasonable compromise.

#### On `spec.kubernetes.kubeControllerManager.horizontalPodAutoscaler...`

This configures horizontal pod autoscaling in Gardener-managed clusters. See [above](#replicas-horizontal-scaling) and the [docs](https://kubernetes.io/de/docs/tasks/run-application/horizontal-pod-autoscale) for the detailed fields.

#### On `spec.kubernetes.verticalPodAutoscaler...`

This configures vertical pod autoscaling in Gardener-managed clusters. See [above](#resources-vertical-scaling) and the [docs](https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/FAQ.md) for the detailed fields.

#### On `spec.kubernetes.clusterAutoscaler...`

This configures node auto-scaling in Gardener-managed clusters. See [above](#worker-pools) and the [docs](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md) for the detailed fields, especially about [expanders](https://github.com/gardener/autoscaler/blob/machine-controller-manager-provider/cluster-autoscaler/FAQ.md#what-are-expanders), which may become life-saving in case of a zone outage when a resource crunch is setting in and everybody rushes to get machines in the healthy zones.

In case of a zone outage, it may be interesting to understand how the cluster autoscaler will put a worker pool in one zone into "back-off". Unfortunately, the official cluster autoscaler documentation does not explain these details, but you can find hints in the [source code](https://github.com/kubernetes/autoscaler/blob/b94f340af58eb063df9ebfcd65835f9a499a69a2/cluster-autoscaler/config/autoscaling_options.go#L214-L219):

If a node fails to come up, the node group (worker pool in that zone) will go into "back-off", at first 5m, then [exponentially longer](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/utils/backoff/exponential_backoff.go#L77-L82) until the maximum of 30m is reached. The "back-off" is reset after 3 hours. This in turn means, that nodes must be first considered `Unknown`, which happens when `spec.kubernetes.kubeControllerManager.nodeMonitorPeriod.nodeMonitorGracePeriod` lapses. Then they must either remain in this state until `spec.provider.workers.machineControllerManager.machineHealthTimeout` lapses for them to be recreated, which will fail in the unhealthy zone, or `spec.kubernetes.kubeAPIServer.defaultUnreachableTolerationSeconds` lapses for the pods to be evicted (usually faster than node replacements, depending on your configuration), which will trigger the cluster autoscaler to create more capacity, but very likely in the same zone as it tries to balance its node groups at first, which will also fail in the unhealthy zone. It will be considered failed only when `maxNodeProvisionTime` lapses (usually close to `spec.provider.workers.machineControllerManager.machineCreationTimeout`) and only then put the node group into "back-off" and not retry for 5m at first and then exponentially longer. It's critical to keep that in mind and accommodate for it. If you have already capacity up and running, the reaction time is usually much faster with leases (whatever you set) or endpoints (`spec.kubernetes.kubeControllerManager.nodeMonitorPeriod.nodeMonitorGracePeriod`), but if you depend on new/fresh capacity, the above should inform you how long you will have to wait for it.

#### On `spec.provider.workers.minimum`, `maximum`, `maxSurge`, `maxUnavailable`, `zones`, and `machineControllerManager`

Each worker pool in Gardener may be configured differently. Among many other settings like machine type, root disk, Kubernetes version, `kubelet` settings, and many more you can also specify the lower and upper bound for the number of machines (`minimum` and `maximum`), how many machines may be added additionally during a rolling update (`maxSurge`) and how many machines may be in termination/recreation during a rolling update (`maxUnavailable`), and of course across how many zones the nodes shall be spread (`zones`).

Interesting is also the configuration for Gardener's machine-controller-manager or MCM for short that provisions, monitors, terminates, replaces, or updates machines that back your nodes:

- The shorter `machineCreationTimeout` is, the faster MCM will retry to create a machine/node, if the process is stuck on cloud provider side. It is set to useful/practical timeouts for the different cloud providers and you probably don't want to change those (in the context of HA at least). Please align with the cluster autoscaler's `maxNodeProvisionTime`.
- The shorter `machineHealthTimeout` is, the faster MCM will replace machines/nodes in case the kubelet isn't reporting back, which translates to `Unknown`, or reports back with `NotReady`, or the [node-problem-detector](https://github.com/kubernetes/node-problem-detector) that Gardener deploys for you reports a non-recoverable issue/condition (e.g. read-only file system). If it is too short however, you risk node and pod trashing, so be careful.
- The shorter `machineDrainTimeout` is, the faster you can get rid of machines/nodes that MCM decided to remove, but this puts a cap on the grace periods and PDBs. They are respected up until the drain timeout lapses - then the machine/node will be forcefully terminated, whether or not the pods are still in termination or not even terminated because of PDBs. Those PDBs will then be violated, so be careful here as well. Please align with the cluster autoscaler's `maxGracefulTerminationSeconds`.

Especially the last two settings may help you recover faster from cloud provider issues.

#### On `spec.systemComponents.coreDNS.autoscaling`

DNS is critical, in general and also within a Kubernetes cluster. Gardener-managed clusters deploy [CoreDNS](https://coredns.io), a graduated CNCF project. Gardener supports 2 auto-scaling modes for it, `horizontal` (using HPA based on CPU) and `cluster-proportional` (using [cluster proportional autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler) that scales the number of pods based on the number of nodes/cores, not to be confused with the cluster autoscaler that scales nodes based on their utilization). Check out the [docs](https://github.com/gardener/gardener/blob/master/docs/usage/dns-autoscaling.md), especially the [trade-offs](https://github.com/gardener/gardener/blob/master/docs/usage/dns-autoscaling.md#trade-offs-of-horizontal-and-cluster-proportional-dns-autoscaling) why you would chose one over the other (`cluster-proportional` gives you more configuration options, if CPU-based horizontal scaling is insufficient to your needs). Consider also Gardener's feature [node-local DNS](https://github.com/gardener/gardener/blob/master/docs/usage/node-local-dns.md) to decouple you further from the DNS pods and stabilize DNS. Again, that's not strictly related to HA, but may become important during a zone outage, when load patterns shift and pods start to initialize/resolve DNS records more frequently in bulk.

## More Caveats

Unfortunately, there are a few more things of note when it comes to HA in a Kubernetes cluster that may be "surprising" and hard to mitigate:

- If the `kubelet` restarts, it will report all pods as `NotReady` on startup until it reruns its probes ([#100277](https://github.com/kubernetes/kubernetes/issues/100277)), which leads to temporary endpoint and load balancer target removal ([#102367](https://github.com/kubernetes/kubernetes/issues/102367)). This topic is somewhat controversial. Gardener uses rolling updates and a jitter to spread necessary `kubelet` restarts as good as possible.
- If a `kube-proxy` pod on a node turns `NotReady`, all load balancer traffic to all pods (on this node) under services with `externalTrafficPolicy` `local` will cease as the load balancer will then take this node out of serving. This topic is somewhat controversial as well. So, please remember that `externalTrafficPolicy` `local` not only has the disadvantage of imbalanced traffic spreading, but also a dependency to the kube-proxy pod that may and will be unavailable during updates. Gardener uses rolling updates to spread necessary `kube-proxy` updates as good as possible.

These are just a few additional considerations. They may or may not affect you, but other intricacies may. It's a reminder to be watchful as Kubernetes may have one or two relevant quirks that you need to consider (and will probably only find out over time and with extensive testing).

## Meaningful Availability

Finally, let's go back to where we started. We recommended to measure [meaningful availability](https://research.google/pubs/pub50828). For instance, in Gardener, we do not trust only internal signals, but track also whether Gardener or the control planes that it manages are externally available through the external DNS records and load balancers, SNI-routing Istio gateways, etc. (the same path all users must take). It's a huge difference whether the API server's internal readiness probe passes or the user can actually reach the API server and it does what it's supposed to do. Most likely, you will be in a similar spot and can do the same.

What you do with these signals is another matter. Maybe there are some actionable metrics and you can trigger some active fail-over, maybe you can only use it to improve your HA setup altogether. In our case, we also use it to deploy mitigations, e.g. via our [dependency-watchdog](https://github.com/gardener/dependency-watchdog) that watches, for instance, Gardener-managed API servers and shuts down components like the controller managers to avert cascading knock-off effects (e.g. melt-down if the `kubelets` cannot reach the API server, but the controller managers can and start taking down nodes and pods).

Either way, understanding how users perceive your service is key to the improvement process as a whole. Even if you are not struck by a zone outage, the measures above and tracking the meaningful availability will help you improve your service.

Thank you for your interest and we wish you no or a "successful" zone outage next time. 😊

## Want to know more about Gardener?

The Gardener project is Open Source and [hosted on GitHub](https://github.com/gardener).

Feedback and contributions are always welcome!

All channels for getting in touch or learning about the project are listed on our [landing page](https://gardener.cloud/docs/contribute/#community). We are cordially inviting interested parties to join our [bi-weekly meetings](https://gardener.cloud/docs/contribute/#bi-weekly-meetings).
