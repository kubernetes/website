---
layout: blog
title: "Kubernetes v1.26：可追溯的默认 StorageClass"
date: 2023-01-05
slug: retroactive-default-storage-class
---
<!--
layout: blog
title: "Kubernetes v1.26: Retroactive Default StorageClass"
date: 2023-01-05
slug: retroactive-default-storage-class
-->

<!--
**Author:** Roman Bednář (Red Hat)
-->
**作者：** Roman Bednář (Red Hat)

**译者：** Michael Yao (DaoCloud)

<!--
The v1.25 release of Kubernetes introduced an alpha feature to change how a default
StorageClass was assigned to a PersistentVolumeClaim (PVC). With the feature enabled,
you no longer need to create a default StorageClass first and PVC second to assign the
class. Additionally, any PVCs without a StorageClass assigned can be updated later.
This feature was graduated to beta in Kubernetes v1.26.
-->
Kubernetes v1.25 引入了一个 Alpha 特性来更改默认 StorageClass 被分配到 PersistentVolumeClaim (PVC) 的方式。
启用此特性后，你不再需要先创建默认 StorageClass，再创建 PVC 来分配类。
此外，任何未分配 StorageClass 的 PVC 都可以在后续被更新。此特性在 Kubernetes v1.26 中已进阶至 Beta。

<!--
You can read [retroactive default StorageClass assignment](/docs/concepts/storage/persistent-volumes/#retroactive-default-storageclass-assignment)
in the Kubernetes documentation for more details about how to use that,
or you can read on to learn about why the Kubernetes project is making this change.
-->
有关如何使用的更多细节，请参阅 Kubernetes
文档[可追溯的默认 StorageClass 赋值](/zh-cn/docs/concepts/storage/persistent-volumes/#retroactive-default-storageclass-assignment)，
你还可以阅读了解为什么 Kubernetes 项目做了此项变更。

<!--
## Why did StorageClass assignment need improvements

Users might already be familiar with a similar feature that assigns default StorageClasses
to **new** PVCs at the time of creation. This is currently handled by the
[admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass).
-->
## 为什么 StorageClass 赋值需要改进  {#why-did-sc-assignment-need-improvements}

用户可能已经熟悉在创建时将默认 StorageClasses 分配给**新** PVC 的这一类似特性。
这个目前由[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)处理。

<!--
But what if there wasn't a default StorageClass defined at the time of PVC creation?
Users would end up with a PVC that would never be assigned a class.
As a result, no storage would be provisioned, and the PVC would be somewhat "stuck" at this point.
Generally, two main scenarios could result in "stuck" PVCs and cause problems later down the road.
Let's take a closer look at each of them.
-->
但是，如果在创建 PVC 时没有定义默认 StorageClass 会怎样？
那用户最终将得到一个永远不会被赋予存储类的 PVC。结果是没有存储会被制备，而 PVC 有时也会“卡在”这里。
一般而言，两个主要场景可能导致 PVC “卡住”，并在后续造成更多问题。让我们仔细看看这两个场景。

<!--
### Changing default StorageClass

With the alpha feature enabled, there were two options admins had when they wanted to change the default StorageClass:
-->
### 更改默认 StorageClass  {#changing-default-storageclass}

启用这个 Alpha 特性后，管理员想要更改默认 StorageClass 时会有两个选项：

<!--
1. Creating a new StorageClass as default before removing the old one associated with the PVC.
   This would result in having two defaults for a short period.
   At this point, if a user were to create a PersistentVolumeClaim with storageClassName set to
   <code>null</code> (implying default StorageClass), the newest default StorageClass would be
   chosen and assigned to this PVC.
-->
1. 在移除与 PVC 关联的旧 StorageClass 之前，创建一个新的 StorageClass 作为默认值。
   这将导致在短时间内出现两个默认值。此时，如果用户要创建一个 PersistentVolumeClaim，
   并将 storageClassName 设置为 <code>null</code>（指代默认 StorageClass），
   则最新的默认 StorageClass 将被选中并指定给这个 PVC。

<!--
2. Removing the old default first and creating a new default StorageClass.
   This would result in having no default for a short time.
   Subsequently, if a user were to create a PersistentVolumeClaim with storageClassName
   set to <code>null</code> (implying default StorageClass), the PVC would be in
   <code>Pending</code> state forever. The user would have to fix this by deleting
   the PVC and recreating it once the default StorageClass was available.
-->
2. 先移除旧的默认值再创建一个新的默认 StorageClass。这将导致短时间内没有默认值。
   接下来如果用户创建一个 PersistentVolumeClaim，并将 storageClassName 设置为 <code>null</code>
   （指代默认 StorageClass），则 PVC 将永远处于 <code>Pending</code> 状态。
   一旦默认 StorageClass 可用，用户就不得不通过删除并重新创建 PVC 来修复这个问题。

<!--
### Resource ordering during cluster installation

If a cluster installation tool needed to create resources that required storage,
for example, an image registry, it was difficult to get the ordering right.
This is because any Pods that required storage would rely on the presence of
a default StorageClass and would fail to be created if it wasn't defined.
-->
### 集群安装期间的资源顺序  {#resource-ordering-during-cluster-installation}

如果集群安装工具需要创建镜像仓库这种有存储要求的资源，很难进行合适地排序。
这是因为任何有存储要求的 Pod 都将依赖于默认 StorageClass 的存在与否。
如果默认 StorageClass 未被定义，Pod 创建将失败。

<!--
## What changed

We've changed the PersistentVolume (PV) controller to assign a default StorageClass
to any unbound PersistentVolumeClaim that has the storageClassName set to <code>null</code>.
We've also modified the PersistentVolumeClaim admission within the API server to allow
the change of values from an unset value to an actual StorageClass name.
-->
## 发生了什么变化  {#what-changed}

我们更改了 PersistentVolume (PV) 控制器，以便将默认 StorageClass 指定给
storageClassName 设置为 `null` 且未被绑定的所有 PersistentVolumeClaim。
我们还修改了 API 服务器中的 PersistentVolumeClaim 准入机制，允许将取值从未设置值更改为实际的 StorageClass 名称。

<!--
### Null `storageClassName` versus `storageClassName: ""` - does it matter? { #null-vs-empty-string }

Before this feature was introduced, those values were equal in terms of behavior.
Any PersistentVolumeClaim with the storageClassName set to <code>null</code> or <code>""</code>
would bind to an existing PersistentVolume resource with storageClassName also set to
<code>null</code> or <code>""</code>.
-->
### Null `storageClassName` 与 `storageClassName: ""` - 有什么影响？ {#null-vs-empty-string}

此特性被引入之前，这两种赋值就其行为而言是相同的。storageClassName 设置为 `null` 或 `""`
的所有 PersistentVolumeClaim 都会被绑定到 storageClassName 也设置为 `null` 或
`""` 的、已有的 PersistentVolume 资源。

<!--
With this new feature enabled we wanted to maintain this behavior but also be able to update the StorageClass name.
With these constraints in mind, the feature changes the semantics of <code>null</code>.
If a default StorageClass is present, <code>null</code> would translate to "Give me a default" and
<code>""</code> would mean "Give me PersistentVolume that also has <code>""</code> StorageClass name."
In the absence of a StorageClass, the behavior would remain unchanged.
-->
启用此新特性时，我们希望保持此行为，但也希望能够更新 StorageClass 名称。
考虑到这些限制，此特性更改了 `null` 的语义。
具体而言，如果有一个默认 StorageClass，`null` 将可被理解为 “给我一个默认值”，
而 `""` 表示 “给我 StorageClass 名称也是 `""` 的 PersistentVolume”，
所以行为将保持不变。

<!--
Summarizing the above, we've changed the semantics of <code>null</code> so that
its behavior depends on the presence or absence of a definition of default StorageClass.

The tables below show all these cases to better describe when PVC binds and when its StorageClass gets updated.
-->
综上所述，我们更改了 `null` 的语义，使其行为取决于默认 StorageClass 定义的存在或缺失。

下表显示了所有这些情况，更好地描述了 PVC 何时绑定及其 StorageClass 何时被更新。

<table>
  <!-- PVC binding behavior with Retroactive default StorageClass -->
  <caption>使用默认 StorageClass 时的 PVC 绑定行为</caption>
  <thead>
     <tr>
        <th colspan="2"></th>
        <th>PVC <tt>storageClassName</tt> = <code>""</code></th>
        <th>PVC <tt>storageClassName</tt> = <code>null</code></th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td rowspan="2">未设置默认存储类</td>
        <td>PV <tt>storageClassName</tt> = <code>""</code></td>
        <td>binds</td>
        <td>binds</td>
     </tr>
     <tr>
        <td>PV without <tt>storageClassName</tt></td>
        <td>binds</td>
        <td>binds</td>
     </tr>
     <tr>
        <td rowspan="2">设置了默认存储类</td>
        <td>PV <tt>storageClassName</tt> = <code>""</code></td>
        <td>binds</td>
        <td>存储类更新</td>
     </tr>
     <tr>
        <td>PV without <tt>storageClassName</tt></td>
        <td>binds</td>
        <td>存储类更新</td>
     </tr>
  </tbody>
</table>

<!--
## How to use it

If you want to test the feature whilst it's alpha, you need to enable the relevant
feature gate in the kube-controller-manager and the kube-apiserver.
Use the `--feature-gates` command line argument:
-->
## 如何使用  {#how-to-use-it}

如果你想测试这个 Alpha 特性，你需要在 kube-controller-manager 和 kube-apiserver 中启用相关特性门控。
你可以使用 `--feature-gates` 命令行参数：

```
--feature-gates="...,RetroactiveDefaultStorageClass=true"
```

<!--
### Test drive

If you would like to see the feature in action and verify it works fine in your cluster here's what you can try:
-->
### 测试演练  {#test-drive}

如果你想看到此特性发挥作用并验证它在集群中是否正常工作，你可以尝试以下步骤：

<!--
1. Define a basic PersistentVolumeClaim:
-->
1. 定义一个基本的 PersistentVolumeClaim：

   ```yaml
   apiVersion: v1
   kind: PersistentVolumeClaim
   metadata:
     name: pvc-1
   spec:
     accessModes:
     - ReadWriteOnce
     resources:
       requests:
         storage: 1Gi
   ```

<!--
2. Create the PersistentVolumeClaim when there is no default StorageClass.
   The PVC won't provision or bind (unless there is an existing, suitable PV already present)
   and will remain in <code>Pending</code> state.
-->
2. 在没有默认 StorageClass 时创建 PersistentVolumeClaim。
   PVC 不会制备或绑定（除非当前已存在一个合适的 PV），PVC 将保持在 `Pending` 状态。

   ```shell
   kubectl get pvc
   ```
   <!--
   The output is similar to this:
   -->

   输出类似于： 
   ```console
   NAME      STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
   pvc-1     Pending
   ```

<!--
3. Configure one StorageClass as default.
-->
3. 将某个 StorageClass 配置为默认值。

   ```shell
   kubectl patch sc -p '{"metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
   ```

   <!--
   The output is similar to this:
   -->

   输出类似于：
   ```console
   storageclass.storage.k8s.io/my-storageclass patched
   ```

<!--
4. Verify that PersistentVolumeClaims is now provisioned correctly and was updated retroactively with new default StorageClass.
-->
4. 确认 PersistentVolumeClaims 现在已被正确制备，并且已使用新的默认 StorageClass 进行了可追溯的更新。

   ```shell
   kubectl get pvc
   ```

   <!--
   The output is similar to this:
   -->

   输出类似于：
   ```console
   NAME      STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS      AGE
   pvc-1     Bound    pvc-06a964ca-f997-4780-8627-b5c3bf5a87d8   1Gi        RWO            my-storageclass   87m
   ```

<!--
### New metrics

To help you see that the feature is working as expected we also introduced a new
<code>retroactive_storageclass_total</code> metric to show how many times that the
PV controller attempted to update PersistentVolumeClaim, and
<code>retroactive_storageclass_errors_total</code> to show how many of those attempts failed.
-->
### 新指标  {#new-metrics}

为了帮助你了解该特性是否按预期工作，我们还引入了一个新的 `retroactive_storageclass_total`
指标来显示 PV 控制器尝试更新 PersistentVolumeClaim 的次数，以及
`retroactive_storageclass_errors_total` 来显示这些尝试失败了多少次。

<!--
## Getting involved

We always welcome new contributors so if you would like to get involved you can
join our [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).

If you would like to share feedback, you can do so on our [public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).

Special thanks to all the contributors that provided great reviews, shared valuable insight and helped implement this feature (alphabetical order):
-->
## 欢迎参与   {#getting-involved}

我们始终欢迎新的贡献者，如果你想参与其中，欢迎加入
[Kubernetes Storage Special Interest Group（存储特别兴趣小组）](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)。

如果你想分享反馈，可以在我们的[公开 Slack 频道](https://app.slack.com/client/T09NY5SBT/C09QZFCE5)上反馈。

特别感谢所有提供精彩评论、分享宝贵见解并帮助实现此特性的贡献者们（按字母顺序排列）：

- Deep Debroy ([ddebroy](https://github.com/ddebroy))
- Divya Mohan ([divya-mohan0209](https://github.com/divya-mohan0209))
- Jan Šafránek ([jsafrane](https://github.com/jsafrane/))
- Joe Betz ([jpbetz](https://github.com/jpbetz))
- Jordan Liggitt ([liggitt](https://github.com/liggitt))
- Michelle Au ([msau42](https://github.com/msau42))
- Seokho Son ([seokho-son](https://github.com/seokho-son))
- Shannon Kularathna ([shannonxtreme](https://github.com/shannonxtreme))
- Tim Bannister ([sftim](https://github.com/sftim))
- Tim Hockin ([thockin](https://github.com/thockin))
- Wojciech Tyczynski ([wojtek-t](https://github.com/wojtek-t))
- Xing Yang ([xing-yang](https://github.com/xing-yang))
