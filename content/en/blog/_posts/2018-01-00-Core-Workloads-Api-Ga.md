---
title: "Core Workloads API GA"
date: 2018-01-15
slug: core-workloads-api-ga
url: /blog/2018/01/Core-Workloads-Api-Ga
author: >
   Kenneth Owens (Google)  
---

## DaemonSet, Deployment, ReplicaSet, and StatefulSet are GA

**_Editor’s Note: We’re happy to announce that the Core Workloads API is GA in Kubernetes 1.9! This blog post from Kenneth Owens reviews how Core Workloads got to GA from its origins, reveals changes in 1.9, and talks about what you can expect going forward._**  


## In the Beginning …
There were [Pods](/docs/concepts/workloads/pods/pod-overview/), tightly coupled containers that share resource requirements, networking, storage, and a lifecycle. Pods were useful, but, as it turns out, users wanted to seamlessly, reproducibly, and automatically create many identical replicas of the same Pod, so we created [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).  

Replication was a step forward, but what users really needed was higher level orchestration of their replicated Pods. They wanted rolling updates, roll backs, and roll overs. So the OpenShift team created [DeploymentConfig](https://docs.openshift.org/latest/architecture/core_concepts/deployments.html#deployments-and-deployment-configurations). DeploymentConfigs were also useful, and OpenShift users were happy. In order to allow all OSS Kubernetes uses to share in the elation, and to take advantage of [set-based label selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors), [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) and [Deployment](/docs/concepts/workloads/controllers/deployment/) were added to the extensions/v1beta1 group version providing rolling updates, roll backs, and roll overs for all Kubernetes users.  

That mostly solved the problem of orchestrating containerized 12 factor apps on Kubernetes, so the community turned its attention to a different problem. Replicating a Pod \<n\> times isn’t the right hammer for every nail in your cluster. Sometimes, you need to run a Pod on every Node, or on a subset of Nodes (for example, shared side cars like log shippers and metrics collectors, Kubernetes add-ons, and Distributed File Systems). The state of the art was Pods combined with NodeSelectors, or static Pods, but this is unwieldy. After having grown used to the ease of automation provided by Deployments, users demanded the same features for this category of application, so [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) was added to extension/v1beta1 as well.  

For a time, users were content, until they decided that Kubernetes needed to be able to orchestrate more than just 12 factor apps and cluster infrastructure. Whether your architecture is N-tier, service oriented, or micro-service oriented, your 12 factor apps depend on stateful workloads (for example, RDBMSs, distributed key value stores, and messaging queues) to provide services to end users and other applications. These stateful workloads can have availability and durability requirements that can only be achieved by distributed systems, and users were ready to use Kubernetes to orchestrate the entire stack.  

While Deployments are great for stateless workloads, they don’t provide the right guarantees for the orchestration of distributed systems. These applications can require stable network identities, ordered, sequential deployment, updates, and deletion, and stable, durable storage. [PetSet](/docs/tasks/run-application/upgrade-pet-set-to-stateful-set/) was added to the apps/v1beta1 group version to address this category of application. Unfortunately, [we were less than thoughtful with its naming](https://github.com/kubernetes/kubernetes/issues/27430), and, as we always strive to be an inclusive community, we renamed the kind to [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).  

Finally, we were done.  

 ![](https://lh5.googleusercontent.com/0T36knExav8JAr41ict3EVOPOqaIJPMBQrOT2N5jehXw_12jEILD87tKW8BvaK2UCOtCHzS700Oki8Fxja3bF37J3eceanEBjbHpRsATBhC1y3P0mas7DvPeQjt6QmfYuNWDqZVl)  

...Or were we?



## Kubernetes 1.8 and apps/v1beta2
Pod, ReplicationController, ReplicaSet, Deployment, DaemonSet, and StatefulSet came to collectively be known as the core workloads API. We could finally orchestrate all of the things, but the API surface was spread across three groups, had many inconsistencies, and left users wondering about the stability of each of the core workloads kinds. It was time to stop adding new features and focus on consistency and stability.  

Pod and ReplicationController were at GA stability, and even though you can run a workload in a Pod, it’s a nucleus primitive that belongs in core. As Deployments are the recommended way to manage your stateless apps, moving ReplicationController would serve no purpose. In Kubernetes 1.8, we moved all the other core workloads API kinds (Deployment, DaemonSet, ReplicaSet, and StatefulSet) to the apps/v1beta2 group version. This had the benefit of providing a better aggregation across the API surface, and allowing us to break backward compatibility to fix inconsistencies. Our plan was to promote this new surface to GA, wholesale and as is, when we were satisfied with its completeness. The modifications in this release, which are also implemented in apps/v1, are described below.



### Selector Defaulting Deprecated
In prior versions of the apps and extensions groups, label selectors of the core workloads API kinds were, when left unspecified, defaulted to a label selector generated from the kind’s template’s labels.  

This was completely incompatible with strategic merge patch and kubectl apply. Moreover, we’ve found that defaulting the value of a field from the value of another field of the same object is an anti-pattern, in general, and particularly dangerous for the API objects used to orchestrate workloads.



### Immutable Selectors
Selector mutation, while allowing for some use cases like promotable Deployment canaries, is not handled gracefully by our workload controllers, and we have always [strongly cautioned users against it](/docs/concepts/workloads/controllers/deployment/#label-selector-updates). To provide a consistent, usable, and stable API, selectors were made immutable for all kinds in the workloads API.  

We believe that there are better ways to support features like promotable canaries and orchestrated Pod relabeling, but, if restricted selector mutation is a necessary feature for our users, we can relax immutability in the future without breaking backward compatibility.  

The development of features like promotable canaries, orchestrated Pod relabeling, and restricted selector mutability is driven by demand signals from our users. If you are currently modifying the selectors of your core workload API objects, please tell us about your use case via a GitHub issue, or by participating in SIG apps.



### Default Rolling Updates
Prior to apps/v1beta2, some kinds defaulted their update strategy to something other than RollingUpdate (e.g. app/v1beta1/StatefulSet uses OnDelete by default). We wanted to be confident that RollingUpdate worked well prior to making it the default update strategy, and we couldn’t change the default behavior in released versions without breaking our promise with respect to backward compatibility. In apps/v1beta2 we enabled RollingUpdate for all core workloads kinds by default.



### CreatedBy Annotation Deprecated
The "kubernetes.io/created-by" was a legacy hold over from the days before garbage collection. Users should use an object’s ControllerRef from its ownerReferences to determine object ownership. We deprecated this feature in 1.8 and removed it in 1.9.



### Scale Subresources
A scale subresource was added to all of the applicable kinds in apps/v1beta2 (DaemonSet scales based on its node selector).  


## Kubernetes 1.9 and apps/v1
In Kubernetes 1.9, as planned, we promoted the entire core workloads API surface to GA in the apps/v1 group version. We made a few more changes to make the API consistent, but apps/v1 is mostly identical to apps/v1beta2. The reality is that most users have been treating the beta versions of the core workloads API as GA for some time now. Anyone who is still using ReplicationControllers and shying away from DaemonSets, Deployments, and StatefulSets, due to a perceived lack of stability, should plan migrate their workloads (where applicable) to apps/v1. The minor changes that were made during promotion are described below.



### Garbage Collection Defaults to Delete
Prior to apps/v1 the default garbage collection policy for Pods in a DaemonSet, Deployment, ReplicaSet, or StatefulSet, was to orphan the Pods. That is, if you deleted one of these kinds, the Pods that they owned would not be deleted automatically unless cascading deletion was explicitly specified. If you use kubectl, you probably didn’t notice this, as these kinds are scaled to zero prior to deletion. In apps/v1 all core worloads API objects will now, by default, be deleted when their owner is deleted. For most users, this change is transparent.  
Status Conditions  

Prior to apps/v1 only Deployment and ReplicaSet had Conditions in their Status objects. For consistency's sake, either all of the objects or none of them should have conditions. After some debate, we decided that Conditions are useful, and we added Conditions to StatefulSetStatus and DaemonSetStatus. The StatefulSet and DaemonSet controllers currently don’t populate them, but we may choose communicate conditions to clients, via this mechanism, in the future.

### Scale Subresource Migrated to autoscale/v1
We originally added a scale subresource to the apps group. This was the wrong direction for integration with the autoscaling, and, at some point, we would like to use custom metrics to autoscale StatefulSets. So the apps/v1 group version uses the autoscaling/v1 scale subresource.



## Migration and Deprecation
The question most you’re probably asking now is, “What’s my migration path onto apps/v1 and how soon should I plan on migrating?” All of the group versions prior to apps/v1 are deprecated as of Kubernetes 1.9, and all new code should be developed against apps/v1, but, as discussed above, many of our users treat extensions/v1beta1 as if it were GA. We realize this, and the minimum support timelines in our [deprecation policy](/docs/reference/deprecation-policy/) are just that, minimums.  

In future releases, before completely removing any of the group versions, we will disable them by default in the API Server. At this point, you will still be able to use the group version, but you will have to explicitly enable it. We will also provide utilities to upgrade the storage version of the API objects to apps/v1. Remember, all of the versions of the core workloads kinds are bidirectionally convertible. If you want to manually update your core workloads API objects now, you can use [kubectl convert](/docs/reference/generated/kubectl/kubectl-commands#convert) to convert manifests between group versions.



## What’s Next?
The core workloads API surface is stable, but it’s still software, and software is never complete. We often add features to stable APIs to support new use cases, and we will likely do so for the core workloads API as well. GA stability means that any new features that we do add will be strictly backward compatible with the existing API surface. From this point forward, nothing we do will break our backwards compatibility guarantees. If you’re looking to participate in the evolution of this portion of the API, please feel free to get involved in [GitHub](https://github.com/kubernetes/kubernetes) or to participate in [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps).  


- [Download](https://get.k8s.io/) Kubernetes
- Get involved with the Kubernetes project on [GitHub](https://github.com/kubernetes/kubernetes)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Connect with the community on [Slack](http://slack.k8s.io/)
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
