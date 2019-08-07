---
title: Built-in controllers
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

This page lists the {{< glossary_tooltip text="controllers" term_id="controller" >}}
that come as part of Kubernetes itself.
{{% /capture %}}


{{% capture body %}}

Kubernetes comes with a number of built-in controllers that run as part
of the {{< glossary_tooltip term_id="kube-controller-manager" >}}.

If your cluster is deployed against a cloud service provider, you can
use the cloud-controller-manager to run additional provider-specific
controllers such as
[Route](/docs/concepts/architecture/cloud-controller/#route-controller).

The cloud controller manager provides an abstract API (in Go) that
allows cloud vendors to plug in their custom implementation.

The built-in {{< glossary_tooltip term_id="kube-scheduler" text="scheduler" >}}
is itself a specialized controller. The scheduler's purpose is to reconcile the
desired set of running Pods and match that against the available Nodes,
optimizing against discovered constraints.
{{< glossary_tooltip term_id="kubelet" >}} will update the actual state each
time it starts or stops a scheduled Pod.

Because its work is essential to Kubernetes' operation, the scheduler
run separately from the kube-controller-manager. This separation helps
with control plane performance.

The controllers that run inside kube-controller-manager are:

## Controllers for running workloads on Kubernetes {#controllers-workloads}

* [CronJob controller](/docs/reference/controllers/cronjob/)
* [DaemonSet controller](/docs/reference/controllers/daemonset/)
* [Deployment controller](/docs/reference/controllers/deployment/)
* [Job controller](/docs/reference/controllers/job/)
* [ReplicaSet controller](/docs/reference/controllers/replicaset/)
* [StatefulSet controller](/docs/reference/controllers/statefulset/)
* [Service controller](/docs/reference/controllers/service/)

## Pod management controllers {#controllers-pod-management}

* [Horizontal Pod Autoscaler](/docs/reference/controllers/horizontal-pod-autoscaler/)
* [PodDisruptionBudget controller](/docs/reference/controllers/poddisruptionbudget/)
* [PodPreset controller](/docs/reference/access-authn-authz/admission-controllers/#podpreset)

## Resource management controllers {#controllers-resource-management}

* [Resource quota controller](/reference/access-authn-authz/admission-controllers/#resourcequota)

## Certificate controllers {#controllers-certificates}

* [Root CA controller](/docs/reference/controllers/certificate-root-ca/)

There are also a set of three controllers that work together to provide signed
certificates on demand, for use within your cluster:

[Certificate signer](/docs/reference/controllers/certificate-signer)
: A controller that signs {{< glossary_tooltip text="certificates" term_id="certificate" >}},
  based on a certificate signing request (CSR), once approved. The issued
  certificates will have a signing chain back to the root CA.

[Certificate signature approver](/docs/reference/controllers/certificate-approver/)
: An automated approver for valid certificate signing requests. Requests are approved
  automatically if the request came from a Node known to Kubernetes.

[CSR cleaner](/docs/reference/controllers/certificate-cleaner/)
: The CSRs within your cluster have a lifetime. This controller removes CSRs that have
  expired without being approved.

{{< note >}}
If you wanted to have something that isn't a Node use a signing request to obtain valid
cluster certificates, you can implement that in your own custom controller.
The built-in controller will automatically know not to intervene, because it only acts o
nsigning requests that come from from nodes.
{{< /note >}}

## Storage controllers {#controllers-storage}

There are a set of built-in controllers for storage management.

* [Volume attach / detach controller](/docs/reference/controllers/attach-detach/)
* [PersistentVolume controller](/docs/reference/controllers/persistentvolume/)
* [PersistentVolumeClaim controller](/docs/reference/controllers/persistentvolumeclaim/)

## Networking controllers {#controllers-networking}

* [Endpoint controller](/docs/reference/controllers/endpoint)
* [Service controller](/docs/reference/controllers/service)
* [Node IP address management controller](/docs/reference/controllers/node-ipam/)

## Cluster orchestration controllers {#controllers-cluster-orchestration}

* [ServiceAccount controller](/docs/reference/controllers/serviceaccount/)
* [ServiceAccount token controller](/docs/reference/controllers/serviceaccount-token/)
* [ClusterRole aggregation controller](/docs/reference/controllers/clusterrole-aggregation)

## Garbage collection & expiry controllers {#controllers-gc-expiry}

### Time-to-live (TTL) controller {#controller-ttl}

The [TTL controller](/docs/reference/controllers/ttl/) sets sets TTL
annotations on Nodes based on cluster size.
kubelet consumes these annotations as a hint about how long it can cache
object data that it has fetched from the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}.

### TTL-after-finished controller {#controller-ttl-after-finished}

The [TTL-after-finished controller](/docs/reference/controllers/ttl-after-finished)
cleans up finished task objects; currently, just Jobs.

### Garbage collector {#controller-garbagecollector}

The [garbage collector](/docs/reference/controllers/garbage-collector/) watches
for changes to objects that have dependencies, and spots objects that are eligible
for garbage collection. Once identified these are queued for (attempts at) deletion.

Other controllers can rely on this behavior to take care of cascading deletion
of objects via parent-child relationships.

### Pod garbage collector {#controller-pod-garbage-collector}

The [pod garbage collector](/docs/reference/controllers/pod-garbage-collector/)
takes care of cleaning up {{< glossary_tooltip text="Pods" term_id="pod" >}} that
are terminated, so that the resources for tracking those Pods can be reclaimed.

### Certificate signing request cleaner {#controller-certificate-cleaner}

The [certificate cleaner](/docs/reference/controllers/certificate-cleaner/)
removes old certificate signing requests that haven't been approved and signed.

### Node lifecycle controller {#controller-node-lifecycle}

The [node lifecycle controller](/docs/reference/controllers/node-lifecycle)
observes the behavior of kubelet on a node, and sets (potentially also removes)
{{< glossary_tooltip text="taints" term_id="taint" >}} on Nodes that reflect its
findings.

### Namespace lifecycle controller {#controller-namespace}

When you (or any Kubernetes API client) remove a {{< glossary_tooltip term_id="namespace" >}},
the [namespace controller](/docs/reference/controllers/namespace/) makes sure that objects in
that namespace are removed before the namespace itself is removed.

{{% /capture %}}
