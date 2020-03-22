---
title: TaintsとTolerations
content_template: templates/concept
weight: 40
---


{{% capture overview %}}
[こちらの記事](/docs/concepts/configuration/assign-pod-node/#node-affinity-beta-feature)にて説明されているNode affinityはPodを特定のNodeに(必須あるいは優先の要件として)*引きつける* 、*Pod* のプロパティです。Taintはその反対で、*Node* が特定のPodを*遠ざける* ことができます。

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

上記の例では、`NoSchedule`の`effect`が使われます。かわりに`PreferNoSchedule`を使うこともできます。これは`NoSchedule`を「ソフトにした」バージョンで、システムはノード上にある該当のtaintを許容しないPodを配置*しようとします* が、必須の条件にはなりません。3つ目の`effect`には`NoExecute`がありますが、これは後で説明します。

同一のNodeには複数のtaintを付与することができ、また、Podについても同様に複数のtolerationを付与することができます。Kubernetesは、複数のtaintやtolerationをフィルターのように処理します。Nodeの持つtaintを評価し、配置したいPodがそれに一致するtolerationを保つ場合は全て無視します。
最後に残ったtaintが、Podに対して明示されたeffectの値で作用します。特に

* `NoSchedule`のeffectを持つtaintが1つでも作用する条件を満たす場合、Kubernetesは該当Nodeに対してそのPodをスケジュールすることはありません
* `NoSchedule`のeffectを持つtaintが1つも作用する条件を満たさず、`PreferNoSchedule`のeffectを持つtaintが1つでも条件を満たす場合、Kubernetesは該当Nodeに対してそのPodをスケジュールしないように*試みます*
* `NoExecute`のeffectを持つtaintが1つでも作用する条件を満たす場合、Node上で動いているPodについてはevict(退役)され、Node上で動いていない場合はそのPodを該当Nodeにスケジュールすることはありません

例えば、Nodeに以下のようなtaintを付与したとします

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

さらに、Podに以下の2つのtolerationがあります

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
- key: "key1
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
```

このケースでは、3つ目のtaintが適用されるためにPodはこのNode上にはスケジュールされなくなります。ただし、既に動いているPodは動き続けます。なぜなら、このPodに許容されないのは3つ目のtaintだけだからです。

通常、`NoExecute`の効果を持つtaintがNodeに追加された場合、そのtaintを許容しないPodは直ちにevictされ、許容するPodがevictされることはありません。ただし、`NoExecute`効果を持つtolerationは、taintが追加された後、PodがNodeにバインドされたままでいる時間を指定するオプションの`tolerationSeconds`フィールドを指定することができます。
通常、`NoExecute`の効果を持つtolerationがNodeに追加された場合、そのtolerationを許容しないPodは即座に追い出され、許容したPodは追い出されることはありません。ただし、`NoExecute`の効果を持つtolerationには、オプションの`tolerationSeconds`フィールドを指定することができ、このフィールドは、汚染物質が追加された後にPodがNodeにバインドされたままになる時間を指定します。例えば、

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
  tolerationSeconds: 3600
```

このような設定では、Podが実行中にこの条件にマッチするtaintがNodeに追加された場合、Podは3600秒の間Nodeにバインドされ、その後evictされることを意味しています。その時間より前にtaintが削除された場合、Podは削除されません。

## 使用例

TaintsとTolerationは、ノードからポッドを *away* に誘導したり、実行してはいけないPodをevictさせたりするための柔軟な方法です。使用例は以下の通りです。

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
