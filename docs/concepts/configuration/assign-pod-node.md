---
approvers:
- davidopp
- kevin-wangzefeng
- bsalamat
title: Assigning Pods to Nodes
---

You can constrain a [pod](/docs/concepts/workloads/pods/pod/) to only be able to run on particular [nodes](/docs/concepts/nodes/node/) or to prefer to
run on particular nodes. There are several ways to do this, and they all use
[label selectors](/docs/user-guide/labels/) to make the selection.
Generally such constraints are unnecessary, as the scheduler will automatically do a reasonable placement
(e.g. spread your pods across nodes, not place the pod on a node with insufficient free resources, etc.)
but there are some circumstances where you may want more control on a node where a pod lands, e.g. to ensure
that a pod ends up on a machine with an SSD attached to it, or to co-locate pods from two different
services that communicate a lot into the same availability zone.

You can find all the files for these examples [in our docs
repo here](https://github.com/kubernetes/kubernetes.github.io/tree/{{page.docsbranch}}/docs/user-guide/node-selection).

* TOC
{:toc}

## nodeSelector

`nodeSelector` is the simplest form of constraint.
`nodeSelector` is a field of PodSpec. It specifies a map of key-value pairs. For the pod to be eligible
to run on a node, the node must have each of the indicated key-value pairs as labels (it can have
additional labels as well). The most common usage is one key-value pair.

Let's walk through an example of how to use `nodeSelector`.

### Step Zero: Prerequisites

This example assumes that you have a basic understanding of Kubernetes pods and that you have [turned up a Kubernetes cluster](https://github.com/kubernetes/kubernetes#documentation).

### Step One: Attach label to the node

Run `kubectl get nodes` to get the names of your cluster's nodes. Pick out the one that you want to add a label to, and then run `kubectl label nodes <node-name> <label-key>=<label-value>` to add a label to the node you've chosen. For example, if my node name is 'kubernetes-foo-node-1.c.a-robinson.internal' and my desired label is 'disktype=ssd', then I can run `kubectl label nodes kubernetes-foo-node-1.c.a-robinson.internal disktype=ssd`.

If this fails with an "invalid command" error, you're likely using an older version of kubectl that doesn't have the `label` command. In that case, see the [previous version](https://github.com/kubernetes/kubernetes/blob/a053dbc313572ed60d89dae9821ecab8bfd676dc/examples/node-selection/README.md) of this guide for instructions on how to manually set labels on a node.

Also, note that label keys must be in the form of DNS labels (as described in the [identifiers doc](https://git.k8s.io/community/contributors/design-proposals/identifiers.md)), meaning that they are not allowed to contain any upper-case letters.

You can verify that it worked by re-running `kubectl get nodes --show-labels` and checking that the node now has a label.

### Step Two: Add a nodeSelector field to your pod configuration

Take whatever pod config file you want to run, and add a nodeSelector section to it, like this. For example, if this is my pod config:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
```

Then add a nodeSelector like so:

{% include code.html language="yaml" file="pod.yaml" ghlink="/docs/concepts/configuration/pod.yaml" %}

When you then run `kubectl create -f pod.yaml`, the pod will get scheduled on the node that you attached the label to! You can verify that it worked by running `kubectl get pods -o wide` and looking at the "NODE" that the pod was assigned to.

## Interlude: built-in node labels

In addition to labels you [attach yourself](#step-one-attach-label-to-the-node), nodes come pre-populated
with a standard set of labels. As of Kubernetes v1.4 these labels are

* `kubernetes.io/hostname`
* `failure-domain.beta.kubernetes.io/zone`
* `failure-domain.beta.kubernetes.io/region`
* `beta.kubernetes.io/instance-type`
* `beta.kubernetes.io/os`
* `beta.kubernetes.io/arch`

## Affinity and anti-affinity

`nodeSelector` provides a very simple way to constrain pods to nodes with particular labels. The affinity/anti-affinity
feature, currently in beta, greatly expands the types of constraints you can express. The key enhancements are

1. the language is more expressive (not just "AND of exact match")
2. you can indicate that the rule is "soft"/"preference" rather than a hard requirement, so if the scheduler
   can't satisfy it, the pod will still be scheduled
3. you can constrain against labels on other pods running on the node (or other topological domain),
   rather than against labels on the node itself, which allows rules about which pods can and cannot be co-located

The affinity feature consists of two types of affinity, "node affinity" and "inter-pod affinity/anti-affinity."
Node affinity is like the existing `nodeSelector` (but with the first two benefits listed above),
while inter-pod affinity/anti-affinity constrains against pod labels rather than node labels, as
described in the third item listed above, in addition to having the first and second properties listed above.

`nodeSelector` continues to work as usual, but will eventually be deprecated, as node affinity can express
everything that `nodeSelector` can express.

### Node affinity (beta feature)

Node affinity was introduced as alpha in Kubernetes 1.2.
Node affinity is conceptually similar to `nodeSelector` -- it allows you to constrain which nodes your
pod is eligible to schedule on, based on labels on the node.

There are currently two types of node affinity, called `requiredDuringSchedulingIgnoredDuringExecution` and
`preferredDuringSchedulingIgnoredDuringExecution`. You can think of them as "hard" and "soft" respectively,
in the sense that the former specifies rules that *must* be met for a pod to schedule onto a node (just like
`nodeSelector` but using a more expressive syntax), while the latter specifies *preferences* that the scheduler
will try to enforce but will not guarantee. The "IgnoredDuringExecution" part of the names means that, similar
to how `nodeSelector` works, if labels on a node change at runtime such that the affinity rules on a pod are no longer
met, the pod will still continue to run on the node. In the future we plan to offer
`requiredDuringSchedulingRequiredDuringExecution` which will be just like `requiredDuringSchedulingIgnoredDuringExecution`
except that it will evict pods from nodes that cease to satisfy the pods' node affinity requirements.

Thus an example of `requiredDuringSchedulingIgnoredDuringExecution` would be "only run the pod on nodes with Intel CPUs"
and an example `preferredDuringSchedulingIgnoredDuringExecution` would be "try to run this set of pods in availability
zone XYZ, but if it's not possible, then allow some to run elsewhere".

Node affinity is specified as field `nodeAffinity` of field `affinity` in the PodSpec.

Here's an example of a pod that uses node affinity:

{% include code.html language="yaml" file="pod-with-node-affinity.yaml" ghlink="/docs/concepts/configuration/pod-with-node-affinity.yaml" %}

This node affinity rule says the pod can only be placed on a node with a label whose key is
`kubernetes.io/e2e-az-name` and whose value is either `e2e-az1` or `e2e-az2`. In addition,
among nodes that meet that criteria, nodes with a label whose key is `another-node-label-key` and whose
value is `another-node-label-value` should be preferred.

You can see the operator `In` being used in the example. The new node affinity syntax supports the following operators: `In`, `NotIn`, `Exists`, `DoesNotExist`, `Gt`, `Lt`.
There is no explicit "node anti-affinity" concept, but `NotIn` and `DoesNotExist` give that behavior.

If you specify both `nodeSelector` and `nodeAffinity`, *both* must be satisfied for the pod
to be scheduled onto a candidate node.

If you specify multiple `nodeSelectorTerms` associated with `nodeAffinity` types, then the pod can be scheduled onto a node **if one of** the `nodeSelectorTerms` is satisfied.

If you specify multiple `matchExpressions` associated with `nodeSelectorTerms`, then the pod can be scheduled onto a node **only if all** `matchExpressions` can be satisfied.

If you remove or change the label of the node where the pod is scheduled, the pod won't be removed. In other words, the affinity selection works only at the time of scheduling the pod.

For more information on node affinity, see the design doc
[here](https://git.k8s.io/community/contributors/design-proposals/nodeaffinity.md).

### Inter-pod affinity and anti-affinity (beta feature)

Inter-pod affinity and anti-affinity were introduced in Kubernetes 1.4.
Inter-pod affinity and anti-affinity allow you to constrain which nodes your pod is eligible to schedule on *based on
labels on pods that are already running on the node* rather than based on labels on nodes. The rules are of the form "this pod should (or, in the case of
anti-affinity, should not) run in an X if that X is already running one or more pods that meet rule Y." Y is expressed
as a LabelSelector with an associated list of namespaces (or "all" namespaces); unlike nodes, because pods are namespaced
(and therefore the labels on pods are implicitly namespaced),
a label selector over pod labels must specify which namespaces the selector should apply to. Conceptually X is a topology domain
like node, rack, cloud provider zone, cloud provider region, etc. You express it using a `topologyKey` which is the
key for the node label that the system uses to denote such a topology domain, e.g. see the label keys listed above
in the section [Interlude: built-in node labels](#interlude-built-in-node-labels).

As with node affinity, there are currently two types of pod affinity and anti-affinity, called `requiredDuringSchedulingIgnoredDuringExecution` and
`preferredDuringSchedulingIgnoredDuringExecution` which denote "hard" vs. "soft" requirements.
See the description in the node affinity section earlier.
An example of `requiredDuringSchedulingIgnoredDuringExecution` affinity would be "co-locate the pods of service A and service B
in the same zone, since they communicate a lot with each other"
and an example `preferredDuringSchedulingIgnoredDuringExecution` anti-affinity would be "spread the pods from this service across zones"
(a hard requirement wouldn't make sense, since you probably have more pods than zones).

Inter-pod affinity is specified as field `podAffinity` of field `affinity` in the PodSpec.
And inter-pod anti-affinity is specified as field `podAntiAffinity` of field `affinity` in the PodSpec.

#### An example of a pod that uses pod affinity:

{% include code.html language="yaml" file="pod-with-pod-affinity.yaml" ghlink="/docs/concepts/configuration/pod-with-pod-affinity.yaml" %}

The affinity on this pod defines one pod affinity rule and one pod anti-affinity rule. In this example, the
`podAffinity` is `requiredDuringSchedulingIgnoredDuringExecution`
while the `podAntiAffinity` is `preferredDuringSchedulingIgnoredDuringExecution`. The
pod affinity rule says that the pod can schedule onto a node only if that node is in the same zone
as at least one already-running pod that has a label with key "security" and value "S1". (More precisely, the pod is eligible to run
on node N if node N has a label with key `failure-domain.beta.kubernetes.io/zone` and some value V
such that there is at least one node in the cluster with key `failure-domain.beta.kubernetes.io/zone` and
value V that is running a pod that has a label with key "security" and value "S1".) The pod anti-affinity
rule says that the pod prefers to not schedule onto a node if that node is already running a pod with label
having key "security" and value "S2". (If the `topologyKey` were `failure-domain.beta.kubernetes.io/zone` then
it would mean that the pod cannot schedule onto a node if that node is in the same zone as a pod with
label having key "security" and value "S2".) See the [design doc](https://git.k8s.io/community/contributors/design-proposals/podaffinity.md).
for many more examples of pod affinity and anti-affinity, both the `requiredDuringSchedulingIgnoredDuringExecution`
flavor and the `preferredDuringSchedulingIgnoredDuringExecution` flavor.

The legal operators for pod affinity and anti-affinity are `In`, `NotIn`, `Exists`, `DoesNotExist`.

In principle, the `topologyKey` can be any legal label-key. However,
for performance and security reasons, there are some constraints on topologyKey:

1. For affinity and for `RequiredDuringScheduling` pod anti-affinity,
empty `topologyKey` is not allowed.
2. For `RequiredDuringScheduling` pod anti-affinity, the admission controller `LimitPodHardAntiAffinityTopology` was introduced to limit `topologyKey` to `kubernetes.io/hostname`. If you want to make it available for custom topologies, you may modify the admission controller, or simply disable it.
3. For `PreferredDuringScheduling` pod anti-affinity, empty `topologyKey` is interpreted as "all topologies" ("all topologies" here is now limited to the combination of `kubernetes.io/hostname`, `failure-domain.beta.kubernetes.io/zone` and `failure-domain.beta.kubernetes.io/region`).
4. Except for the above cases, the `topologyKey` can be any legal label-key.

In addition to `labelSelector` and `topologyKey`, you can optionally specify a list `namespaces`
of namespaces which the `labelSelector` should match against (this goes at the same level of the definition as `labelSelector` and `topologyKey`).
If omitted, it defaults to the namespace of the pod where the affinity/anti-affinity definition appears.
If defined but empty, it means "all namespaces."

All `matchExpressions` associated with `requiredDuringSchedulingIgnoredDuringExecution` affinity and anti-affinity
must be satisfied for the pod to schedule onto a node.

#### More Practical Use-cases 

Interpod Affinity and AnitAffinity can be even more useful when they are used with higher
level collections such as ReplicaSets, Statefulsets, Deployments, etc.  One can easily configure that a set of workloads should
be co-located in the same defined topology, eg., the same node. 

##### Always co-located in the same node

In a three node cluster, a web application has in-memory cache such as redis, we want the web-servers to be co-located with the cache as much as possible. 
Here is the yaml snippet of a simple redis deployment with three replicas and selector label `app=store`

```yaml
apiVersion: apps/v1beta1 # for versions before 1.6.0 use extensions/v1beta1
kind: Deployment
metadata:
  name: redis-cache
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: store
    spec:
      containers:
      - name: redis-server
        image: redis:3.2-alpine
```

Below yaml snippet of the webserver deployment has `podAffinity` configured, this informs the scheduler that all its replicas are to be 
co-located with pods that has selector label `app=store` 

```yaml
apiVersion: apps/v1beta1 # for versions before 1.6.0 use extensions/v1beta1
kind: Deployment
metadata:
  name: web-server
spec:
  replicas: 3
  template:
    metadata:
      labels:
        app: web-store
    spec:
      affinity:
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: web-app
```

if we create the above two deployments, our three node cluster could look like below.

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| *webserver-1*        |   *webserver-2*     |    *webserver-3*   |
|  *cache-1*           |     *cache-2*       |     *cache-3*      |

As you can see, all the 3 replicas of the `web-server` are automatically co-located with the cache as expected. 

```
$kubectl get pods -o wide
NAME                           READY     STATUS    RESTARTS   AGE       IP           NODE
redis-cache-1450370735-6dzlj   1/1       Running   0          8m        10.192.4.2   kube-node-3
redis-cache-1450370735-j2j96   1/1       Running   0          8m        10.192.2.2   kube-node-1
redis-cache-1450370735-z73mh   1/1       Running   0          8m        10.192.3.1   kube-node-2
web-server-1287567482-5d4dz    1/1       Running   0          7m        10.192.2.3   kube-node-1
web-server-1287567482-6f7v5    1/1       Running   0          7m        10.192.4.3   kube-node-3
web-server-1287567482-s330j    1/1       Running   0          7m        10.192.3.2   kube-node-2
```

Best practice is to configure these highly available stateful workloads such as redis with AntiAffinity rules for more guaranteed spreading, which we will see in the next section.

##### Never co-located in the same node

Highly Available database statefulset has one master and three replicas, one may prefer none of the database instances to be co-located in the same node.

|       node-1         |       node-2        |       node-3       |       node-4       |
|:--------------------:|:-------------------:|:------------------:|:------------------:|
| *DB-MASTER*          | *DB-REPLICA-1*      | *DB-REPLICA-2*     | *DB-REPLICA-3*     |

[Here](https://kubernetes.io/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure) is an example of zookeper statefulset configured with anti-affinity for high availability.

For more information on inter-pod affinity/anti-affinity, see the design doc
[here](https://git.k8s.io/community/contributors/design-proposals/podaffinity.md).

## Taints and tolerations (beta feature)

Node affinity, described earlier, is a property of *pods* that *attracts* them to a set
of nodes (either as a preference or a hard requirement). Taints are the opposite --
they allow a *node* to *repel* a set of pods.

Taints and tolerations work together to ensure that pods are not scheduled
onto inappropriate nodes. One or more taints are applied to a node; this
marks that the node should not accept any pods that do not tolerate the taints.
Tolerations are applied to pods, and allow (but do not require) the pods to schedule
onto nodes with matching taints.

You add a taint to a node using [kubectl taint](/docs/user-guide/kubectl/v1.7/#taint).
For example,

```shell
kubectl taint nodes node1 key=value:NoSchedule
```

places a taint on node `node1`. The taint has key `key`, value `value`, and taint effect `NoSchedule`.
This means that no pod will be able to schedule onto `node1` unless it has a matching toleration.
You specify a toleration for a pod in the PodSpec. Both of the following tolerations "match" the
taint created by the `kubectl taint` line above, and thus a pod with either toleration would be able
to schedule onto `node1`:

```yaml
tolerations:
- key: "key"
  operator: "Equal"
  value: "value"
  effect: "NoSchedule"
```

```yaml
tolerations:
- key: "key"
  operator: "Exists"
  effect: "NoSchedule"
```

A toleration "matches" a taint if the `key`s are the same and the `effect`s are the same, and:

* the `operator` is `Exists` (in which case no `value` should be specified), or
* the `operator` is `Equal` and the `value`s are equal

`Operator` defaults to `Equal` if not specified.

**NOTE:** There are two special cases:

* An empty `key` with operator `Exists` matches all keys, values and effects which means this
will tolerate everything.

```yaml
tolerations:
- operator: "Exists"
```

* An empty `effect` matches all effects with key `key`.

```yaml
tolerations:
- key: "key"
  operator: "Exists"
```

The above example used `effect` of `NoSchedule`. Alternatively, you can use `effect` of `PreferNoSchedule`.
This is a "preference" or "soft" version of `NoSchedule` -- the system will *try* to avoid placing a
pod that does not tolerate the taint on the node, but it is not required. The third kind of `effect` is
`NoExecute`, described later.

You can put multiple taints on the same node and multiple tolerations on the same pod.
The way Kubernetes processes multiple taints and tolerations is like a filter: start
with all of a node's taints, then ignore the ones for which the pod has a matching toleration; the
remaining un-ignored taints have the indicated effects on the pod. In particular,

* if there is at least one un-ignored taint with effect `NoSchedule` then Kubernetes will not schedule
the pod onto that node
* if there is no un-ignored taint with effect `NoSchedule` but there is at least one un-ignored taint with
effect `PreferNoSchedule` then Kubernetes will *try* to not schedule the pod onto the node
* if there is at least one un-ignored taint with effect `NoExecute` then the pod will be evicted from
the node (if it is already running on the node), and will not be
scheduled onto the node (if it is not yet running on the node).

For example, imagine you taint a node like this

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

And a pod has two tolerations:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
```

In this case, the pod will not be able to schedule onto the node, because there is no
toleration matching the third taint. But it will be able to continue running if it is
already running on the node when the taint is added, because the third taint is the only
one of the three that is not tolerated by the pod.

Normally, if a taint with effect `NoExecute` is added to a node, then any pods that do
not tolerate the taint will be evicted immediately, and any pods that do tolerate the
taint will never be evicted. However, a toleration with `NoExecute` effect can specify
an optional `tolerationSeconds` field that dictates how long the pod will stay bound
to the node after the taint is added. For example,

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
  tolerationSeconds: 3600
```

means that if this pod is running and a matching taint is added to the node, then
the pod will stay bound to the node for 3600 seconds, and then be evicted. If the
taint is removed before that time, the pod will not be evicted.

### Example use cases

Taints and tolerations are a flexible way to steer pods away from nodes or evict
pods that shouldn't be running. A few of the use cases are

* **dedicated nodes**: If you want to dedicate a set of nodes for exclusive use by
a particular set of users, you can add a taint to those nodes (say,
`kubectl taint nodes nodename dedicated=groupName:NoSchedule`) and then add a corresponding
toleration to their pods (this would be done most easily by writing a custom
[admission controller](/docs/admin/admission-controllers/)).
The pods with the tolerations will then be allowed to use the tainted (dedicated) nodes as
well as any other nodes in the cluster. If you want to dedicate the nodes to them *and*
ensure they *only* use the dedicated nodes, then you should additionally add a label similar
to the taint to the same set of nodes (e.g. `dedicated=groupName`), and the admission
controller should additionally add a node affinity to require that the pods can only schedule
onto nodes labeled with `dedicated=groupName`.

* **nodes with special hardware**: In a cluster where a small subset of nodes have specialized
hardware (for example GPUs), it is desirable to keep pods that don't need the specialized
hardware off of those nodes, thus leaving room for later-arriving pods that do need the
specialized hardware. This can be done by tainting the nodes that have the specialized
hardware (e.g. `kubectl taint nodes nodename special=true:NoSchedule` or
`kubectl taint nodes nodename special=true:PreferNoSchedule`) and adding a corresponding
toleration to pods that use the special hardware. As in the dedicated nodes use case,
it is probably easiest to apply the tolerations using a custom
[admission controller](/docs/admin/admission-controllers/)).
For example, the admission controller could use
some characteristic(s) of the pod to determine that the pod should be allowed to use
the special nodes and hence the admission controller should add the toleration.
To ensure that the pods that need
the special hardware *only* schedule onto the nodes that have the special hardware, you will need some
additional mechanism, e.g. you could represent the special resource using
[opaque integer resources](/docs/concepts/configuration/manage-compute-resources-container/#opaque-integer-resources-alpha-feature)
and request it as a resource in the PodSpec, or you could label the nodes that have
the special hardware and use node affinity on the pods that need the hardware.

* **per-pod-configurable eviction behavior when there are node problems (alpha feature)**,
which is described in the next section.

### Per-pod-configurable eviction behavior when there are node problems (alpha feature)

Earlier we mentioned the `NoExecute` taint effect, which affects pods that are already
running on the node as follows

 * pods that do not tolerate the taint are evicted immediately
 * pods that tolerate the taint without specifying `tolerationSeconds` in
   their toleration specification remain bound forever
 * pods that tolerate the taint with a specified `tolerationSeconds` remain
   bound for the specified amount of time

The above behavior is a beta feature. In addition, Kubernetes 1.6 has alpha
support for representing node problems (currently only "node unreachable" and
"node not ready", corresponding to the NodeCondition "Ready" being "Unknown" or
"False" respectively) as taints. When the `TaintBasedEvictions` alpha feature
is enabled (you can do this by including `TaintBasedEvictions=true` in `--feature-gates`, such as
`--feature-gates=FooBar=true,TaintBasedEvictions=true`), the taints are automatically
added by the NodeController and the normal logic for evicting pods from nodes
based on the Ready NodeCondition is disabled.
(Note: To maintain the existing [rate limiting](/docs/concepts/architecture/nodes/)
behavior of pod evictions due to node problems, the system actually adds the taints
in a rate-limited way. This prevents massive pod evictions in scenarios such
as the master becoming partitioned from the nodes.)
This alpha feature, in combination with `tolerationSeconds`, allows a pod
to specify how long it should stay bound to a node that has one or both of these problems.

For example, an application with a lot of local state might want to stay
bound to node for a long time in the event of network partition, in the hope
that the partition will recover and thus the pod eviction can be avoided.
The toleration the pod would use in that case would look like

```yaml
tolerations:
- key: "node.alpha.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

(For the node not ready case, change the key to `node.alpha.kubernetes.io/notReady`.)

Note that Kubernetes automatically adds a toleration for
`node.alpha.kubernetes.io/notReady` with `tolerationSeconds=300`
unless the pod configuration provided
by the user already has a toleration for `node.alpha.kubernetes.io/notReady`.
Likewise it adds a toleration for
`node.alpha.kubernetes.io/unreachable` with `tolerationSeconds=300`
unless the pod configuration provided
by the user already has a toleration for `node.alpha.kubernetes.io/unreachable`.

These automatically-added tolerations ensure that
the default pod behavior of remaining bound for 5 minutes after one of these
problems is detected is maintained.
The two default tolerations are added by the [DefaultTolerationSeconds
admission controller](https://git.k8s.io/kubernetes/plugin/pkg/admission/defaulttolerationseconds).

[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) pods are created with
`NoExecute` tolerations for `node.alpha.kubernetes.io/unreachable` and `node.alpha.kubernetes.io/notReady`
with no `tolerationSeconds`. This ensures that DaemonSet pods are never evicted due
to these problems, which matches the behavior when this feature is disabled.
