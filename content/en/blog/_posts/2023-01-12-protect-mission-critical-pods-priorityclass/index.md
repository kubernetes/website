---
layout: blog
title: "Protect Your Mission-Critical Pods From Eviction With PriorityClass"
date: 2023-01-12
slug: protect-mission-critical-pods-priorityclass
description: "Pod priority and preemption help to make sure that mission-critical pods are up in the event of a resource crunch by deciding order of scheduling and eviction."
author: >
  Sunny Bhambhani (InfraCloud Technologies)
---

Kubernetes has been widely adopted, and many organizations use it as their de-facto
orchestration engine for running workloads that need to be created and deleted frequently.

Therefore, proper scheduling of the pods is key to ensuring that application pods
are up and running within the Kubernetes cluster without any issues. This article
delves into the use cases around resource management by leveraging the
[PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
object to protect mission-critical or high-priority pods from getting evicted and
making sure that the application pods are up, running, and serving traffic.

## Resource management in Kubernetes

The control plane consists of multiple components, out of which the scheduler
(usually the built-in [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/))
is one of the components which is responsible for assigning a node to a pod.

Whenever a pod is created, it enters a "pending" state, after which the scheduler
determines which node is best suited for the placement of the new pod.

In the background, the scheduler runs as an infinite loop looking for pods without
a `nodeName` set that are [ready for scheduling](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/).
For each Pod that needs scheduling, the scheduler tries to decide which node should run that Pod.

If the scheduler cannot find any node, the pod remains in the pending state, which is not ideal.

{{< note >}}
To name a few, `nodeSelector`, `taints and tolerations`, `nodeAffinity`, the rank
of nodes based on available resources (for example, CPU and memory), and several
other criteria are used to determine the pod's placement.
{{< /note >}}

The below diagram, from point number 1 through 4, explains the request flow:

{{< figure src=kube-scheduler.svg alt="A diagram showing the scheduling of three Pods that a client has directly created." title="Scheduling in Kubernetes">}}

## Typical use cases

Below are some real-life scenarios where control over the scheduling and eviction of pods may be required.

1. Let's say the pod you plan to deploy is critical, and you have some resource
   constraints. An example would be the DaemonSet of an infrastructure component
   like Grafana Loki. The Loki pods must run before other pods can on every node.
   In such cases, you could ensure resource availability by manually identifying
   and deleting the pods that are not required or by adding a new node to the cluster.
   Both these approaches are unsuitable since the former would be tedious to execute,
   and the latter could involve an expenditure of time and money.

2. Another use case could be a single cluster that holds the pods for the below
   environments with associated priorities:
   - Production (`prod`):  top priority
   - Preproduction (`preprod`): intermediate priority
   - Development (`dev`): least priority

   In the event of high resource consumption in the cluster, there is competition
   for CPU and memory resources on the nodes. While cluster-level autoscaling _may_
   add more nodes, it takes time. In the interim, if there are no further nodes to
   scale the cluster, some Pods could remain in a Pending state, or the service could
   be degraded as they compete for resources. If the kubelet does evict a Pod from the
   node, that eviction would be random because the kubelet doesn’t have any special
   information about which Pods to evict and which to keep.

3. A third example could be a microservice backed by a queuing application or a
   database running into a resource crunch and the queue or database getting evicted.
   In such a case, all the other services would be rendered useless until the database
   can serve traffic again.

There can also be other scenarios where you want to control the order of
scheduling or order of eviction of pods.

## PriorityClasses in Kubernetes

PriorityClass is a cluster-wide API object in Kubernetes and part of the
`scheduling.k8s.io/v1` API group. It contains a mapping of the PriorityClass
name (defined in `.metadata.name`) and an integer value (defined in `.value`).
This represents the value that the scheduler uses to determine Pod's relative priority.

Additionally, when you create a cluster using kubeadm or a managed Kubernetes
service (for example, Azure Kubernetes Service), Kubernetes uses PriorityClasses
to safeguard the pods that are hosted on the control plane nodes. This ensures
that critical cluster components such as CoreDNS and kube-proxy can run even if
resources are constrained.

This availability of pods is achieved through the use of a special PriorityClass
that ensures the pods are up and running and that the overall cluster is not affected.

```console
$ kubectl get priorityclass
NAME                      VALUE        GLOBAL-DEFAULT   AGE
system-cluster-critical   2000000000   false            82m
system-node-critical      2000001000   false            82m
```

The diagram below shows exactly how it works with the help of an example,
which will be detailed in the upcoming section.

{{< figure src="decision-tree.svg" alt="A flow chart that illustrates how the kube-scheduler prioritizes new Pods and potentially preempts existing Pods" title="Pod scheduling and preemption">}}

### Pod priority and preemption

[Pod preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)
is a Kubernetes feature that allows the cluster to preempt pods
(removing an existing Pod in favor of a new Pod) on the basis of priority.
[Pod priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority)
indicates the importance of a pod relative to other pods while scheduling.
If there aren't enough resources to run all the current pods, the scheduler tries
to evict lower-priority pods over high-priority ones.

Also, when a healthy cluster experiences a node failure, typically, lower-priority
pods get preempted to create room for higher-priority pods on the available node.
This happens even if the cluster can bring up a new node automatically since pod
creation is usually much faster than bringing up a new node.

### PriorityClass requirements

Before you set up PriorityClasses, there are a few things to consider.

1. Decide which PriorityClasses are needed. For instance, based on environment,
   type of pods, type of applications, etc.
2. The default PriorityClass resource for your cluster. The pods without a
   `priorityClassName` will be treated as priority 0.
3. Use a consistent naming convention for all PriorityClasses.
4. Make sure that the pods for your workloads are running with the right PriorityClass.

## PriorityClass hands-on example

Let’s say there are 3 application pods: one for prod, one for preprod, and one
for development. Below are three sample YAML manifest files for each of those.

```yaml
---
# development
apiVersion: v1
kind: Pod
metadata:
  name: dev-nginx
  labels:
    env: dev
spec:
  containers:
  - name: dev-nginx
    image: nginx
    resources:
      requests:
        memory: "256Mi"
        cpu: "0.2"
      limits:
        memory: ".5Gi"
        cpu: "0.5"
```

```yaml
---
# preproduction
apiVersion: v1
kind: Pod
metadata:
  name: preprod-nginx
  labels:
    env: preprod
spec:
  containers:
  - name: preprod-nginx
    image: nginx
    resources:
      requests:
        memory: "1.5Gi"
        cpu: "1.5"
      limits:
        memory: "2Gi"
        cpu: "2"
```

```yaml
---
# production
apiVersion: v1
kind: Pod
metadata:
  name: prod-nginx
  labels:
    env: prod
spec:
  containers:
  - name: prod-nginx
    image: nginx
    resources:
      requests:
        memory: "2Gi"
        cpu: "2"
      limits:
        memory: "2Gi"
        cpu: "2"
```

You can create these pods with the `kubectl create -f <FILE.yaml>` command, and then check their status
using the `kubectl get pods` command. You can see if they are up and look ready to serve traffic:

```console
$ kubectl get pods --show-labels
NAME            READY   STATUS    RESTARTS   AGE   LABELS
dev-nginx       1/1     Running   0          55s   env=dev
preprod-nginx   1/1     Running   0          55s   env=preprod
prod-nginx      0/1     Pending   0          55s   env=prod
```

Bad news. The pod for the Production environment is still Pending and isn't serving any traffic.

Let's see why this is happening:

```console
$ kubectl get events
...
...
5s          Warning   FailedScheduling   pod/prod-nginx      0/2 nodes are available: 1 Insufficient cpu, 2 Insufficient memory.
```

In this example, there is only one worker node, and that node has a resource crunch.

Now, let's look at how PriorityClass can help in this situation since prod should be
given higher priority than the other environments.

## PriorityClass API

Before creating PriorityClasses based on these requirements, let's see what a basic
manifest for a PriorityClass looks like and outline some prerequisites:

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: PRIORITYCLASS_NAME
value: 0 # any integer value between -1000000000 to 1000000000 
description: >-
  (Optional) description goes here!
globalDefault: false # or true. Only one PriorityClass can be the global default.
```

Below are some prerequisites for PriorityClasses:

- The name of a PriorityClass must be a valid DNS subdomain name.
- When you make your own PriorityClass, the name should not start with `system-`, as those names are
  reserved by Kubernetes itself (for example, they are used for two built-in PriorityClasses).
- Its absolute value should be between -1000000000 to 1000000000 (1 billion).
- Larger numbers are reserved by PriorityClasses such as `system-cluster-critical`
  (this Pod is critically important to the cluster) and `system-node-critical` (the node
  critically relies on this Pod).
  `system-node-critical` is a higher priority than `system-cluster-critical`, because a
  cluster-critical Pod can only work well if the node where it is running has all its node-level
  critical requirements met.
- There are two optional fields:
  - `globalDefault`: When true, this PriorityClass is used for pods where a `priorityClassName` is not specified.
    Only one PriorityClass with `globalDefault` set to true can exist in a cluster.  
    If there is no PriorityClass defined with globalDefault set to true, all the pods
    with no priorityClassName defined will be treated with 0 priority (i.e. the least priority).
  - `description`: A string with a meaningful value so that people know when to use this PriorityClass.

{{< note >}}
Adding a PriorityClass with `globalDefault` set to `true` does not mean it will
apply the same to the existing pods that are already running. This will be
applicable only to the pods that came into existence after the PriorityClass was created.
{{< /note >}}

### PriorityClass in action

Here's an example. Next, create some environment-specific PriorityClasses:

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: dev-pc
value: 1000000
globalDefault: false
description: >-
  (Optional) This priority class should only be used for all development pods.
```

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: preprod-pc
value: 2000000
globalDefault: false
description: >-
  (Optional) This priority class should only be used for all preprod pods.
```

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: prod-pc
value: 4000000
globalDefault: false
description: >-
  (Optional) This priority class should only be used for all prod pods.
```

Use `kubectl create -f <FILE.YAML>` command to create a pc and `kubectl get pc` to check its status.

```console
$ kubectl get pc
NAME                      VALUE        GLOBAL-DEFAULT   AGE
dev-pc                    1000000      false            3m13s
preprod-pc                2000000      false            2m3s
prod-pc                   4000000      false            7s
system-cluster-critical   2000000000   false            82m
system-node-critical      2000001000   false            82m
```

The new PriorityClasses are in place now. A small change is needed in the pod
manifest or pod template (in a ReplicaSet or Deployment). In other words, you
need to specify the priority class name at `.spec.priorityClassName` (which is a string value).

First update the previous production pod manifest file to have a PriorityClass
assigned, then delete the Production pod and recreate it. You can't edit the
priority class for a Pod that already exists.

In my cluster, when I tried this, here's what happened.
First, that change seems successful; the status of pods has been updated:

```console
$ kubectl get pods --show-labels
NAME            READY   STATUS    	RESTARTS   AGE   LABELS
dev-nginx       1/1     Terminating	0          55s   env=dev
preprod-nginx   1/1     Running   	0          55s   env=preprod
prod-nginx      0/1     Pending   	0          55s   env=prod
```

The dev-nginx pod is getting terminated. Once that is successfully terminated and
there are enough resources for the prod pod, the control plane can schedule the prod pod:

```console
Warning   FailedScheduling   pod/prod-nginx    0/2 nodes are available: 1 Insufficient cpu, 2 Insufficient memory.
Normal    Preempted          pod/dev-nginx     by default/prod-nginx on node node01
Normal    Killing            pod/dev-nginx     Stopping container dev-nginx
Normal    Scheduled          pod/prod-nginx    Successfully assigned default/prod-nginx to node01
Normal    Pulling            pod/prod-nginx    Pulling image "nginx"
Normal    Pulled             pod/prod-nginx    Successfully pulled image "nginx"
Normal    Created            pod/prod-nginx    Created container prod-nginx
Normal    Started            pod/prod-nginx    Started container prod-nginx
```

## Enforcement

When you set up PriorityClasses, they exist just how you defined them. However, people
(and tools) that make changes to your cluster are free to set any PriorityClass, or to not
set any PriorityClass at all.
However, you can use other Kubernetes features to make sure that the priorities you wanted
are actually applied.

As an alpha feature, you can define a
[ValidatingAdmissionPolicy](/blog/2022/12/20/validating-admission-policies-alpha/)
and a ValidatingAdmissionPolicyBinding so that, for example,
Pods that go into the `prod` namespace must use the `prod-pc` PriorityClass.
With another ValidatingAdmissionPolicyBinding you ensure that the `preprod` namespace
uses the `preprod-pc` PriorityClass, and so on.
In *any* cluster, you can enforce similar controls using external projects such as
[Kyverno](https://kyverno.io/) or [Gatekeeper](https://open-policy-agent.github.io/gatekeeper/),
through validating admission webhooks.

However you do it, Kubernetes gives you options to make sure that the PriorityClasses are
used how you wanted them to be, or perhaps just to
[warn](https://open-policy-agent.github.io/gatekeeper/website/docs/violations/#warn-enforcement-action)
users when they pick an unsuitable option.

## Summary

The above example and its events show you what this feature of Kubernetes brings
to the table, along with several scenarios where you can use this feature. To
reiterate, this helps ensure that mission-critical pods are up and available to
serve the traffic and, in the case of a resource crunch, determines cluster behavior.

It gives you some power to decide the order of scheduling and order of
[preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)
for Pods. Therefore, you need to define the PriorityClasses sensibly.
For example, if you have a cluster autoscaler to add nodes on demand,
make sure to run it with the `system-cluster-critical` PriorityClass. You don't want to
get in a situation where the autoscaler has been preempted and there are no new nodes
coming online.

If you have any queries or feedback, feel free to reach out to me on
[LinkedIn](http://www.linkedin.com/in/sunnybhambhani).
