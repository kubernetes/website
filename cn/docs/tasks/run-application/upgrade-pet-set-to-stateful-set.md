---
approvers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
cn-approvers:
- linyouchong
title: 将 PetSet 升级为 StatefulSet
---
<!--
---
approvers:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton
title: Upgrade from PetSets to StatefulSets
---
-->

{% capture overview %}
<!--
This page shows how to upgrade from PetSets (Kubernetes version 1.3 or 1.4) to *StatefulSets* (Kubernetes version 1.5 or later).
-->
本页描述如何将 PetSet（Kubernetes 1.3 或 1.4 版本）升级为 *StatefulSet* （Kubernetes 1.5 或更高版本）。
{% endcapture %}

{% capture prerequisites %}

<!--
* If you don't have PetSets in your current cluster, or you don't plan to upgrade
  your master to Kubernetes 1.5 or later, you can skip this task.
-->
* 如果您当前使用的集群中不存在 PetSet，或者您没有将 master 升级到 Kubernetes 1.5 或更高版本的计划，您可以跳过本任务。

{% endcapture %}

{% capture steps %}

<!--
## Differences between alpha PetSets and beta StatefulSets

PetSet was introduced as an alpha resource in Kubernetes release 1.3, and was renamed to StatefulSet as a beta resource in 1.5.
Here are some notable changes:
-->
## alpha 阶段的 PetSet 和 beta 阶段的 StatefulSet 的区别

PetSet 是在 Kubernetes 1.3 版本中引入的 alpha 资源，其在 1.5 版本中作为 beta 资源且被重命名为 StatefulSet。以下是一些值得注意的变化：

<!--
* **StatefulSet is the new PetSet**: PetSet is no longer available in Kubernetes release 1.5 or later. It becomes beta StatefulSet. To understand why the name was changed, see this [discussion thread](https://github.com/kubernetes/kubernetes/issues/27430).
-->
* **StatefulSet 是新的 PetSet**：在 Kubernetes 1.5 或更高版本之后，PetSet 不再可用。它变成了名为 StatefulSet 的 beta 资源。想了解为何它的名称被改变了，请查看这个[讨论帖子](https://github.com/kubernetes/kubernetes/issues/27430)。
<!--
* **StatefulSet guards against split brain**: StatefulSets guarantee at most one Pod for a given ordinal index can be running anywhere in a cluster, to guard against split brain scenarios with distributed applications. *TODO: Link to doc about fencing.*
-->
* **StatefulSet 防止脑裂**：StatefulSet 确保一个指定序号索引最多只被分配给一个 Pod，且这个 Pod 可以在集群的任何节点上运行，这在分布式应用中可以防止脑裂的发生。*TODO: 关于这个措施的链接*
<!--
* **Flipped debug annotation behavior**:
  The default value of the debug annotation (`pod.alpha.kubernetes.io/initialized`) is `true` in 1.5 through 1.7.
  The annotation is completely ignored in 1.8 and above, which always behave as if it were `true`.
-->
* **相反的调试注解行为**：
  在 1.5 到 1.7 版本，调试注解 (`pod.alpha.kubernetes.io/initialized`) 的默认值是 `true`。
  在 1.8 或 之后的版本，这个注解被完全忽略了，系统总是认为它被设置为 `true` 。

<!--
  The absence of this annotation will pause PetSet operations, but will NOT pause StatefulSet operations.
  In most cases, you no longer need this annotation in your StatefulSet manifests.
-->
  缺少这个注解会造成 PetSet 暂停运行，但是不会造成 StatefulSet 暂停运行。
  多数情况下，您无需在 StatefulSet 的 manifest 中添加这个注解。

<!--
## Upgrading from PetSets to StatefulSets
-->
## 将 PetSet 升级到 StatefulSet

<!--
Note that these steps need to be done in the specified order. You **should
NOT upgrade your Kubernetes master, nodes, or `kubectl` to Kubernetes version
1.5 or later**, until told to do so.
-->
注意，以下步骤必须按顺序执行。在被告知之前，请您先不要将您的 master、node 或者 `kubectl` 升级到 Kubernetes 1.5 或更高版本。

<!--
### Find all PetSets and their manifests

First, find all existing PetSets in your cluster:
-->
### 找到所有的 PetSet 和它们的 manifest

首先，找到您的集群中存在的所有 PetSet：

```shell
kubectl get petsets --all-namespaces
```

<!--
If you don't find any existing PetSets, you can safely upgrade your cluster to
Kubernetes version 1.5 or later.
-->
如果您没有找到有 PetSet 存在，那么您可以安全地将您的集群升级到 Kubernetes 1.5 或更高版本了。

<!--
If you find existing PetSets and you have all their manifests at hand, you can continue to the next step to prepare StatefulSet manifests.
-->
如果您找到了一些 PetSet 而且您的手头有它们的 manifest，您可以继续下一步，即准备 StatefulSet 的 manifest。

<!--
Otherwise, you need to save their manifests so that you can recreate them as StatefulSets later.
Here's an example command for you to save all existing PetSets as one file.
-->
否则，您需要先将它们的 manifest 保存下来以便稍后您能够以 StatefulSet 的方式重建它们。
关于如何将已存在的 PetSet 保存到文件中，这里有一个示例命令。

```shell
# Save all existing PetSets in all namespaces into a single file. Only needed when you don't have their manifests at hand.
kubectl get petsets --all-namespaces -o yaml > all-petsets.yaml
```
<!--
### Prepare StatefulSet manifests

Now, for every PetSet manifest you have, prepare a corresponding StatefulSet manifest:
-->
### 准备 StatefulSet 的 manifest

现在，对于您手头的每个 PetSet 的 manifest，将其对应转换为 StatefulSet 的 manifest ：

<!--
1. Change `apiVersion` from `apps/v1alpha1` to `apps/v1beta1`.
2. Change `kind` from `PetSet` to `StatefulSet`.
3. If you have the debug hook annotation `pod.alpha.kubernetes.io/initialized` set to `true`,
   you can remove it because it's redundant.
   If you don't have this annotation or have it set to `false`,
   be aware that StatefulSet operations might resume after the upgrade.
-->
1. 将 `apiVersion` 从 `apps/v1alpha1` 改为 `apps/v1beta1`。
2. 将 `kind` 从 `PetSet` 改为 `StatefulSet`。
3. 如果存在作为调试勾子的注解 `pod.alpha.kubernetes.io/initialized` 且被设置为 `true`，您可以将其删除，因为它是多余的。
   如果不存在这个注解或者存在但其被设置为 `false`，您需要了解的是在升级完成后 StatefulSet 会恢复运行。

<!--
   If you are upgrading to 1.6 or 1.7, you can set the annotation explicitly to `false` to maintain
   the paused behavior.
   If you are upgrading to 1.8 or above, there's no longer any debug annotation to pause StatefulSets.
-->
  如果您正在升级到 1.6 或 1.7 版本，您可以将这个注解明确设置为 `false` 以保持它的暂停运行特性。
  如果您正在升级到 1.8 或更高版本，则不再存在任何注解可以让 StatefulSet 暂停运行。

<!--
It's recommended that you keep both PetSet manifests and StatefulSet manifests, so that you can safely roll back and recreate your PetSets,
if you decide not to upgrade your cluster.
-->
建议您保存好 PetSet 的 manifest 和 StatefulSet 的 manifest，万一您决定不再升级您的集群，您还可以安全回滚并重建您的 PetSet。

<!--
### Delete all PetSets without cascading
-->
### 非级联地删除所有 PetSet

<!--
If you find existing PetSets in your cluster in the previous step, you need to delete all PetSets *without cascading*. You can do this from `kubectl` with `--cascade=false`.
Note that if the flag isn't set, **cascading deletion will be performed by default**, and all Pods managed by your PetSets will be gone.
-->
如果您在上一步中发现您的集群中存在 PetSet，您需要 *非级联地* 删除所有的 PetSet。您可以在执行 `kubectl` 命令时带上 `--cascade=false` 参数实现这个目的。
需要注意的是如果没有带上这个参数，**默认会进行级联删除**，您的 PetSet 所管理的所有 Pod 将会消失。

<!--
Delete those PetSets by specifying file names. This only works when
the files contain only PetSets, but not other resources such as Services:
-->
通过指定文件名删除 PetSet。要求这些文件中只能包含 PetSet 资源，不能包含其它资源，例如 Service。

```shell
# Delete all existing PetSets without cascading
# Note that <pet-set-file> should only contain PetSets that you want to delete, but not any other resources
kubectl delete -f <pet-set-file> --cascade=false
```

<!--
Alternatively, delete them by specifying resource names:
-->
或者，通过指定资源名来删除它们

```shell
# Alternatively, delete them by name and namespace without cascading
kubectl delete petsets <pet-set-name> -n=<pet-set-namespace> --cascade=false
```

<!--
Make sure you've deleted all PetSets in the system:
-->
确保系统中所有的 PetSet 已经被删除：

```shell
# Get all PetSets again to make sure you deleted them all
# This should return nothing
kubectl get petsets --all-namespaces
```

<!--
At this moment, you've deleted all PetSets in your cluster, but not their Pods, Persistent Volumes, or Persistent Volume Claims.
However, since the Pods are not managed by PetSets anymore, they will be vulnerable to node failures until you finish the master upgrade and recreate StatefulSets.
-->
此时，您已经将集群中所有的 PetSet 删除，但是它们关联的 Pod、Persistent Volume 或者 Persistent Volume Claim 还继续存在。然而，由于这些 Pod 不再被 PetSet 所管理，它们很容易受到节点故障的影响，直到您完成 master 的升级且重新创建了 StatefulSet。

<!--
### Upgrade your master to Kubernetes version 1.5 or later

Now, you can [upgrade your Kubernetes master](/docs/admin/cluster-management/#upgrading-a-cluster) to Kubernetes version 1.5 or later.
Note that **you should NOT upgrade Nodes at this time**, because the Pods
(that were once managed by PetSets) are now vulnerable to node failures.
-->
### 将您的 master 升级到 Kubernetes 1.5 或更高版本

现在，您可以 [升级您的 Kubernetes master](/docs/admin/cluster-management/#upgrading-a-cluster) 到 Kubernetes 1.5 或更高版本。
需要注意的是 **此时您不应该升级 Node**，因为（曾经被 PetSet 所管理的）Pod 很容易受到节点故障的影响。

<!--
### Upgrade kubectl to Kubernetes version 1.5 or later

Upgrade `kubectl` to Kubernetes version 1.5 or later, following [the steps for installing and setting up
kubectl](/docs/tasks/kubectl/install/).
-->
### 升级 kubectl 到 Kubernetes 1.5 或更高版本
升级 `kubectl` 到 Kubernetes 1.5 或更高版本，请参考 [安装和配置 kubectl 的步骤](/docs/tasks/kubectl/install/)。

<!--
### Create StatefulSets

Make sure you have both master and `kubectl` upgraded to Kubernetes version 1.5
or later before continuing:
-->
### 创建 StatefulSet

继续操作之前，确保您已经将 master 和 `kubectl` 都升级到了Kubernetes 1.5 或更高版本

```shell
kubectl version
```

<!--
The output is similar to this:
-->
输出类似如下的信息：

```shell
Client Version: version.Info{Major:"1", Minor:"5", GitVersion:"v1.5.0", GitCommit:"0776eab45fe28f02bbeac0f05ae1a203051a21eb", GitTreeState:"clean", BuildDate:"2016-11-24T22:35:03Z", GoVersion:"go1.7.3", Compiler:"gc", Platform:"linux/amd64"}
Server Version: version.Info{Major:"1", Minor:"5", GitVersion:"v1.5.0", GitCommit:"0776eab45fe28f02bbeac0f05ae1a203051a21eb", GitTreeState:"clean", BuildDate:"2016-11-24T22:30:23Z", GoVersion:"go1.7.3", Compiler:"gc", Platform:"linux/amd64"}
```

<!--
If both `Client Version` (`kubectl` version) and `Server Version` (master
version) are 1.5 or later, you are good to go.
-->
如果 `Client Version` (`kubectl` version) 和 `Server Version` (master version) 都是 1.5 或更高，您可以继续。

<!--
Create StatefulSets to adopt the Pods belonging to the deleted PetSets with the
StatefulSet manifests generated in the previous step:
-->
创建 StatefulSet 接管那些属于被删除 PetSet 的 Pod，创建时使用了上一步中生成的 StatefulSet 的 manifest 

```shell
kubectl create -f <stateful-set-file>
```

<!--
Make sure all StatefulSets are created and running as expected in the
newly-upgraded cluster:
-->
确保升级后的集群中所有 StatefulSet 已被创建且运行正常：

```shell
kubectl get statefulsets --all-namespaces
```

<!--
### Upgrade nodes to Kubernetes version 1.5 or later (optional)
-->
### 升级 node 到 Kubernetes 1.5 或更高版本（可选）

<!--
You can now [upgrade Kubernetes nodes](/docs/admin/cluster-management/#upgrading-a-cluster)
to Kubernetes version 1.5 or later. This step is optional, but needs to be done after all StatefulSets
are created to adopt PetSets' Pods.
-->
现在您可以 [升级 Kubernetes node](/docs/admin/cluster-management/#upgrading-a-cluster) 到 Kubernetes 1.5 或更高版本。这一步是可选的，但必须在全部 StatefulSet 已被创建且接管了 PetSet 的 Pod 之后进行。

<!--
You should be running Node version >= 1.1.0 to run StatefulSets safely. Older versions do not support features which allow the StatefulSet to guarantee that at any time, there is **at most** one Pod with a given identity running in a cluster.
-->
为了安全地运行 StatefulSet，您需要运行版本号 >= 1.1.0 的 Node 版本。更老的版本不支持 StatefulSet 的这个特性：任何时候，最多只能有一个同样身份标识的 Pod 在集群中运行。

{% endcapture %}

{% capture whatsnext %}

<!--
Learn more about [scaling a StatefulSet](/docs/tasks/manage-stateful-set/scale-stateful-set/).
-->
了解更多关于 [伸缩一个 StatefulSet](/docs/tasks/manage-stateful-set/scale-stateful-set/)。

{% endcapture %}

{% include templates/task.md %}
