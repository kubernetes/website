---
layout: blog
title: "Kubernetes v1.26：可追溯的默認 StorageClass"
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

**譯者：** Michael Yao (DaoCloud)

<!--
The v1.25 release of Kubernetes introduced an alpha feature to change how a default
StorageClass was assigned to a PersistentVolumeClaim (PVC). With the feature enabled,
you no longer need to create a default StorageClass first and PVC second to assign the
class. Additionally, any PVCs without a StorageClass assigned can be updated later.
This feature was graduated to beta in Kubernetes v1.26.
-->
Kubernetes v1.25 引入了一個 Alpha 特性來更改默認 StorageClass 被分配到 PersistentVolumeClaim (PVC) 的方式。
啓用此特性後，你不再需要先創建默認 StorageClass，再創建 PVC 來分配類。
此外，任何未分配 StorageClass 的 PVC 都可以在後續被更新。此特性在 Kubernetes v1.26 中已進階至 Beta。

<!--
You can read [retroactive default StorageClass assignment](/docs/concepts/storage/persistent-volumes/#retroactive-default-storageclass-assignment)
in the Kubernetes documentation for more details about how to use that,
or you can read on to learn about why the Kubernetes project is making this change.
-->
有關如何使用的更多細節，請參閱 Kubernetes
文檔[可追溯的默認 StorageClass 賦值](/zh-cn/docs/concepts/storage/persistent-volumes/#retroactive-default-storageclass-assignment)，
你還可以閱讀了解爲什麼 Kubernetes 項目做了此項變更。

<!--
## Why did StorageClass assignment need improvements

Users might already be familiar with a similar feature that assigns default StorageClasses
to **new** PVCs at the time of creation. This is currently handled by the
[admission controller](/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass).
-->
## 爲什麼 StorageClass 賦值需要改進  {#why-did-sc-assignment-need-improvements}

用戶可能已經熟悉在創建時將默認 StorageClasses 分配給**新** PVC 的這一類似特性。
這個目前由[准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#defaultstorageclass)處理。

<!--
But what if there wasn't a default StorageClass defined at the time of PVC creation?
Users would end up with a PVC that would never be assigned a class.
As a result, no storage would be provisioned, and the PVC would be somewhat "stuck" at this point.
Generally, two main scenarios could result in "stuck" PVCs and cause problems later down the road.
Let's take a closer look at each of them.
-->
但是，如果在創建 PVC 時沒有定義默認 StorageClass 會怎樣？
那用戶最終將得到一個永遠不會被賦予存儲類的 PVC。結果是沒有存儲會被製備，而 PVC 有時也會“卡在”這裏。
一般而言，兩個主要場景可能導致 PVC “卡住”，並在後續造成更多問題。讓我們仔細看看這兩個場景。

<!--
### Changing default StorageClass

With the alpha feature enabled, there were two options admins had when they wanted to change the default StorageClass:
-->
### 更改默認 StorageClass  {#changing-default-storageclass}

啓用這個 Alpha 特性後，管理員想要更改默認 StorageClass 時會有兩個選項：

<!--
1. Creating a new StorageClass as default before removing the old one associated with the PVC.
   This would result in having two defaults for a short period.
   At this point, if a user were to create a PersistentVolumeClaim with storageClassName set to
   <code>null</code> (implying default StorageClass), the newest default StorageClass would be
   chosen and assigned to this PVC.
-->
1. 在移除與 PVC 關聯的舊 StorageClass 之前，創建一個新的 StorageClass 作爲默認值。
   這將導致在短時間內出現兩個默認值。此時，如果用戶要創建一個 PersistentVolumeClaim，
   並將 storageClassName 設置爲 <code>null</code>（指代默認 StorageClass），
   則最新的默認 StorageClass 將被選中並指定給這個 PVC。

<!--
2. Removing the old default first and creating a new default StorageClass.
   This would result in having no default for a short time.
   Subsequently, if a user were to create a PersistentVolumeClaim with storageClassName
   set to <code>null</code> (implying default StorageClass), the PVC would be in
   <code>Pending</code> state forever. The user would have to fix this by deleting
   the PVC and recreating it once the default StorageClass was available.
-->
2. 先移除舊的默認值再創建一個新的默認 StorageClass。這將導致短時間內沒有默認值。
   接下來如果用戶創建一個 PersistentVolumeClaim，並將 storageClassName 設置爲 <code>null</code>
   （指代默認 StorageClass），則 PVC 將永遠處於 <code>Pending</code> 狀態。
   一旦默認 StorageClass 可用，用戶就不得不通過刪除並重新創建 PVC 來修復這個問題。

<!--
### Resource ordering during cluster installation

If a cluster installation tool needed to create resources that required storage,
for example, an image registry, it was difficult to get the ordering right.
This is because any Pods that required storage would rely on the presence of
a default StorageClass and would fail to be created if it wasn't defined.
-->
### 集羣安裝期間的資源順序  {#resource-ordering-during-cluster-installation}

如果集羣安裝工具需要創建鏡像倉庫這種有存儲要求的資源，很難進行合適地排序。
這是因爲任何有存儲要求的 Pod 都將依賴於默認 StorageClass 的存在與否。
如果默認 StorageClass 未被定義，Pod 創建將失敗。

<!--
## What changed

We've changed the PersistentVolume (PV) controller to assign a default StorageClass
to any unbound PersistentVolumeClaim that has the storageClassName set to <code>null</code>.
We've also modified the PersistentVolumeClaim admission within the API server to allow
the change of values from an unset value to an actual StorageClass name.
-->
## 發生了什麼變化  {#what-changed}

我們更改了 PersistentVolume (PV) 控制器，以便將默認 StorageClass 指定給
storageClassName 設置爲 `null` 且未被綁定的所有 PersistentVolumeClaim。
我們還修改了 API 服務器中的 PersistentVolumeClaim 准入機制，允許將取值從未設置值更改爲實際的 StorageClass 名稱。

<!--
### Null `storageClassName` versus `storageClassName: ""` - does it matter? { #null-vs-empty-string }

Before this feature was introduced, those values were equal in terms of behavior.
Any PersistentVolumeClaim with the storageClassName set to <code>null</code> or <code>""</code>
would bind to an existing PersistentVolume resource with storageClassName also set to
<code>null</code> or <code>""</code>.
-->
### Null `storageClassName` 與 `storageClassName: ""` - 有什麼影響？ {#null-vs-empty-string}

此特性被引入之前，這兩種賦值就其行爲而言是相同的。storageClassName 設置爲 `null` 或 `""`
的所有 PersistentVolumeClaim 都會被綁定到 storageClassName 也設置爲 `null` 或
`""` 的、已有的 PersistentVolume 資源。

<!--
With this new feature enabled we wanted to maintain this behavior but also be able to update the StorageClass name.
With these constraints in mind, the feature changes the semantics of <code>null</code>.
If a default StorageClass is present, <code>null</code> would translate to "Give me a default" and
<code>""</code> would mean "Give me PersistentVolume that also has <code>""</code> StorageClass name."
In the absence of a StorageClass, the behavior would remain unchanged.
-->
啓用此新特性時，我們希望保持此行爲，但也希望能夠更新 StorageClass 名稱。
考慮到這些限制，此特性更改了 `null` 的語義。
具體而言，如果有一個默認 StorageClass，`null` 將可被理解爲 “給我一個默認值”，
而 `""` 表示 “給我 StorageClass 名稱也是 `""` 的 PersistentVolume”，
所以行爲將保持不變。

<!--
Summarizing the above, we've changed the semantics of <code>null</code> so that
its behavior depends on the presence or absence of a definition of default StorageClass.

The tables below show all these cases to better describe when PVC binds and when its StorageClass gets updated.
-->
綜上所述，我們更改了 `null` 的語義，使其行爲取決於默認 StorageClass 定義的存在或缺失。

下表顯示了所有這些情況，更好地描述了 PVC 何時綁定及其 StorageClass 何時被更新。

<table>
  <!-- PVC binding behavior with Retroactive default StorageClass -->
  <caption>使用默認 StorageClass 時的 PVC 綁定行爲</caption>
  <thead>
     <tr>
        <th colspan="2"></th>
        <th>PVC <tt>storageClassName</tt> = <code>""</code></th>
        <th>PVC <tt>storageClassName</tt> = <code>null</code></th>
     </tr>
  </thead>
  <tbody>
     <tr>
        <td rowspan="2">未設置默認存儲類</td>
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
        <td rowspan="2">設置了默認存儲類</td>
        <td>PV <tt>storageClassName</tt> = <code>""</code></td>
        <td>binds</td>
        <td>存儲類更新</td>
     </tr>
     <tr>
        <td>PV without <tt>storageClassName</tt></td>
        <td>binds</td>
        <td>存儲類更新</td>
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

如果你想測試這個 Alpha 特性，你需要在 kube-controller-manager 和 kube-apiserver 中啓用相關特性門控。
你可以使用 `--feature-gates` 命令行參數：

```
--feature-gates="...,RetroactiveDefaultStorageClass=true"
```

<!--
### Test drive

If you would like to see the feature in action and verify it works fine in your cluster here's what you can try:
-->
### 測試演練  {#test-drive}

如果你想看到此特性發揮作用並驗證它在集羣中是否正常工作，你可以嘗試以下步驟：

<!--
1. Define a basic PersistentVolumeClaim:
-->
1. 定義一個基本的 PersistentVolumeClaim：

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
2. 在沒有默認 StorageClass 時創建 PersistentVolumeClaim。
   PVC 不會製備或綁定（除非當前已存在一個合適的 PV），PVC 將保持在 `Pending` 狀態。

   ```shell
   kubectl get pvc
   ```
   <!--
   The output is similar to this:
   -->

   輸出類似於： 
   ```console
   NAME      STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE
   pvc-1     Pending
   ```

<!--
3. Configure one StorageClass as default.
-->
3. 將某個 StorageClass 配置爲默認值。

   ```shell
   kubectl patch sc -p '{"metadata":{"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
   ```

   <!--
   The output is similar to this:
   -->

   輸出類似於：
   ```console
   storageclass.storage.k8s.io/my-storageclass patched
   ```

<!--
4. Verify that PersistentVolumeClaims is now provisioned correctly and was updated retroactively with new default StorageClass.
-->
4. 確認 PersistentVolumeClaims 現在已被正確製備，並且已使用新的默認 StorageClass 進行了可追溯的更新。

   ```shell
   kubectl get pvc
   ```

   <!--
   The output is similar to this:
   -->

   輸出類似於：
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
### 新指標  {#new-metrics}

爲了幫助你瞭解該特性是否按預期工作，我們還引入了一個新的 `retroactive_storageclass_total`
指標來顯示 PV 控制器嘗試更新 PersistentVolumeClaim 的次數，以及
`retroactive_storageclass_errors_total` 來顯示這些嘗試失敗了多少次。

<!--
## Getting involved

We always welcome new contributors so if you would like to get involved you can
join our [Kubernetes Storage Special-Interest-Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG).

If you would like to share feedback, you can do so on our [public Slack channel](https://app.slack.com/client/T09NY5SBT/C09QZFCE5).

Special thanks to all the contributors that provided great reviews, shared valuable insight and helped implement this feature (alphabetical order):
-->
## 歡迎參與   {#getting-involved}

我們始終歡迎新的貢獻者，如果你想參與其中，歡迎加入
[Kubernetes Storage Special Interest Group（存儲特別興趣小組）](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG)。

如果你想分享反饋，可以在我們的[公開 Slack 頻道](https://app.slack.com/client/T09NY5SBT/C09QZFCE5)上反饋。

特別感謝所有提供精彩評論、分享寶貴見解並幫助實現此特性的貢獻者們（按字母順序排列）：

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
