---
title: TaintsとTolerations
content_template: templates/concept
weight: 40
---


{{% capture overview %}}
[こちらの記事](/docs/concepts/configuration/assign-pod-node/#node-affinity-beta-feature)にて説明されているNode affinityはPodを特定のNodeに(必須あるいは優先の要件として)*引きつける*、*Pod*のプロパティです。Taintはその反対で、*Node*が特定のPodを*遠ざける*ことができます。

TaintとTolerationは、不適切なNodeにPodがスケジュールされないようにするために連携して機能します。単一のNodeに対しては、1つまたはそれ以上のTaintが適用されます。これは、NodeがこのTaintを許容しないPodを受け入れてはならないということを示します。TolerationはPodに適用され、PodがそれにマッチするTaintを持つNodeにのみスケジュールされることを許します(ただし、必須ではありません)。

{{% /capture %}}

{{% capture body %}}

## Concepts

ノードにTaintを追加するには以下のようにして[kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint)を使います。

```shell
kubectl taint nodes node1 key=value:NoSchedule
```

こうすると、`node1`というNodeに対してTaintが設定されます。このTaintには`key`と`value`があり、さらにeffectに`NoSchedule`が設定されています。これは、Taintに設定された値と同じTolerationを持たないあらゆるPodは、`node1`にスケジュールされないことを示します。

上記のコマンドで追加されたTaintを削除するには、以下のコマンドを実行します。
```shell
kubectl taint nodes node1 key:NoSchedule-
```

PodSpec内にてTolerationを指定します。以下のTolerationはいずれも`kubectl taint`によって作られたTaintの条件と"マッチ"するため、いずれのTolerationを持つPodについても`node1`にスケジュール可能です。

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

keyが同じでなおかつeffectも同じ場合、TolerationはTaintに"マッチ"すると言えます。さらに、

* `operator`の値が`Exists`の場合(このとき、`value`は必須ではなくなります)や、もしくは
* `operator`の値が`Equal`で、`value`の値も同じ場合

`operator`は、指定がない場合`Equal`がデフォルト値になります。

{{< note >}}
以下に示す2つは特例です:

* operatorが`Existsで`key`が空の場合は、すべてのkey、value、およびeffectにマッチします。つまり、これはすべてを許容します。

```yaml
tolerations:
- operator: "Exists"
```

* `effect`が空の場合、keyが`key`である全てのeffectにマッチします。

```yaml
tolerations:
- key: "key"
  operator: "Exists"
```
{{< /note >}}

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

## Example Use Cases

Taints and tolerations are a flexible way to steer pods *away* from nodes or evict
pods that shouldn't be running. A few of the use cases are

* **Dedicated Nodes**: If you want to dedicate a set of nodes for exclusive use by
a particular set of users, you can add a taint to those nodes (say,
`kubectl taint nodes nodename dedicated=groupName:NoSchedule`) and then add a corresponding
toleration to their pods (this would be done most easily by writing a custom
[admission controller](/docs/reference/access-authn-authz/admission-controllers/)).
The pods with the tolerations will then be allowed to use the tainted (dedicated) nodes as
well as any other nodes in the cluster. If you want to dedicate the nodes to them *and*
ensure they *only* use the dedicated nodes, then you should additionally add a label similar
to the taint to the same set of nodes (e.g. `dedicated=groupName`), and the admission
controller should additionally add a node affinity to require that the pods can only schedule
onto nodes labeled with `dedicated=groupName`.

* **Nodes with Special Hardware**: In a cluster where a small subset of nodes have specialized
hardware (for example GPUs), it is desirable to keep pods that don't need the specialized
hardware off of those nodes, thus leaving room for later-arriving pods that do need the
specialized hardware. This can be done by tainting the nodes that have the specialized
hardware (e.g. `kubectl taint nodes nodename special=true:NoSchedule` or
`kubectl taint nodes nodename special=true:PreferNoSchedule`) and adding a corresponding
toleration to pods that use the special hardware. As in the dedicated nodes use case,
it is probably easiest to apply the tolerations using a custom
[admission controller](/docs/reference/access-authn-authz/admission-controllers/).
For example, it is recommended to use [Extended
Resources](/docs/concepts/configuration/manage-compute-resources-container/#extended-resources)
to represent the special hardware, taint your special hardware nodes with the
extended resource name and run the
[ExtendedResourceToleration](/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration)
admission controller. Now, because the nodes are tainted, no pods without the
toleration will schedule on them. But when you submit a pod that requests the
extended resource, the `ExtendedResourceToleration` admission controller will
automatically add the correct toleration to the pod and that pod will schedule
on the special hardware nodes. This will make sure that these special hardware
nodes are dedicated for pods requesting such hardware and you don't have to
manually add tolerations to your pods.

* **Taint based Evictions (beta feature)**: A per-pod-configurable eviction behavior
when there are node problems, which is described in the next section.

## Taint based Evictions

Earlier we mentioned the `NoExecute` taint effect, which affects pods that are already
running on the node as follows

 * pods that do not tolerate the taint are evicted immediately
 * pods that tolerate the taint without specifying `tolerationSeconds` in
   their toleration specification remain bound forever
 * pods that tolerate the taint with a specified `tolerationSeconds` remain
   bound for the specified amount of time

In addition, Kubernetes 1.6 introduced alpha support for representing node
problems. In other words, the node controller automatically taints a node when
certain condition is true. The following taints are built in:

 * `node.kubernetes.io/not-ready`: Node is not ready. This corresponds to
   the NodeCondition `Ready` being "`False`".
 * `node.kubernetes.io/unreachable`: Node is unreachable from the node
   controller. This corresponds to the NodeCondition `Ready` being "`Unknown`".
 * `node.kubernetes.io/out-of-disk`: Node becomes out of disk.
 * `node.kubernetes.io/memory-pressure`: Node has memory pressure.
 * `node.kubernetes.io/disk-pressure`: Node has disk pressure.
 * `node.kubernetes.io/network-unavailable`: Node's network is unavailable.
 * `node.kubernetes.io/unschedulable`: Node is unschedulable.
 * `node.cloudprovider.kubernetes.io/uninitialized`: When the kubelet is started
    with "external" cloud provider, this taint is set on a node to mark it
    as unusable. After a controller from the cloud-controller-manager initializes
    this node, the kubelet removes this taint.

In version 1.13, the `TaintBasedEvictions` feature is promoted to beta and enabled by default, hence the taints are automatically
added by the NodeController (or kubelet) and the normal logic for evicting pods from nodes
based on the Ready NodeCondition is disabled.

{{< note >}}
To maintain the existing [rate limiting](/docs/concepts/architecture/nodes/)
behavior of pod evictions due to node problems, the system actually adds the taints
in a rate-limited way. This prevents massive pod evictions in scenarios such
as the master becoming partitioned from the nodes.
{{< /note >}}

This beta feature, in combination with `tolerationSeconds`, allows a pod
to specify how long it should stay bound to a node that has one or both of these problems.

For example, an application with a lot of local state might want to stay
bound to node for a long time in the event of network partition, in the hope
that the partition will recover and thus the pod eviction can be avoided.
The toleration the pod would use in that case would look like

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

Note that Kubernetes automatically adds a toleration for
`node.kubernetes.io/not-ready` with `tolerationSeconds=300`
unless the pod configuration provided
by the user already has a toleration for `node.kubernetes.io/not-ready`.
Likewise it adds a toleration for
`node.kubernetes.io/unreachable` with `tolerationSeconds=300`
unless the pod configuration provided
by the user already has a toleration for `node.kubernetes.io/unreachable`.

These automatically-added tolerations ensure that
the default pod behavior of remaining bound for 5 minutes after one of these
problems is detected is maintained.
The two default tolerations are added by the [DefaultTolerationSeconds
admission controller](https://git.k8s.io/kubernetes/plugin/pkg/admission/defaulttolerationseconds).

[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) pods are created with
`NoExecute` tolerations for the following taints with no `tolerationSeconds`:

  * `node.kubernetes.io/unreachable`
  * `node.kubernetes.io/not-ready`

This ensures that DaemonSet pods are never evicted due to these problems,
which matches the behavior when this feature is disabled.

## Taint Nodes by Condition

In version 1.12, `TaintNodesByCondition` feature is promoted to beta, so node lifecycle controller automatically creates taints corresponding to
Node conditions.
Similarly the scheduler does not check Node conditions; instead the scheduler checks taints. This assures that Node conditions don't affect what's scheduled onto the Node. The user can choose to ignore some of the Node's problems (represented as Node conditions) by adding appropriate Pod tolerations.
Note that `TaintNodesByCondition` only taints nodes with `NoSchedule` effect. `NoExecute` effect is controlled by `TaintBasedEviction` which is a beta feature and enabled by default since version 1.13.

Starting in Kubernetes 1.8, the DaemonSet controller automatically adds the
following `NoSchedule` tolerations to all daemons, to prevent DaemonSets from
breaking.

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/out-of-disk` (*only for critical pods*)
  * `node.kubernetes.io/unschedulable` (1.10 or later)
  * `node.kubernetes.io/network-unavailable` (*host network only*)

Adding these tolerations ensures backward compatibility. You can also add
arbitrary tolerations to DaemonSets.
