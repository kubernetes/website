---
title: Finalizer
id: finalizer
date: 2021-07-07
full_link: /zh-cn/docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  一個帶有名稱空間的鍵，告訴 Kubernetes 等到特定的條件被滿足後，
  再完全刪除被標記為刪除的資源。
aka: 
tags:
- fundamental
- operation
---

<!--
---
title: Finalizer
id: finalizer
date: 2021-07-07
full_link: /zh-cn/docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  A namespaced key that tells Kubernetes to wait until specific conditions are met
  before it fully deletes an object marked for deletion.
aka: 
tags:
- fundamental
- operation
-->


<!--
Finalizers are namespaced keys that tell Kubernetes to wait until specific
conditions are met before it fully deletes resources marked for deletion.
Finalizers alert {{<glossary_tooltip text="controllers" term_id="controller">}}
to clean up resources the deleted object owned.
-->
Finalizer 是帶有名稱空間的鍵，告訴 Kubernetes 等到特定的條件被滿足後，
再完全刪除被標記為刪除的資源。
Finalizer 提醒{{<glossary_tooltip text="控制器" term_id="controller">}}清理被刪除的物件擁有的資源。
<!--more-->

<!--
When you tell Kubernetes to delete an object that has finalizers specified for
it, the Kubernetes API marks the object for deletion by populating `.metadata.deletionTimestamp`,
and returns a `202` status code (HTTP "Accepted"). The target object remains in a terminating state while the
control plane, or other components, take the actions defined by the finalizers.
After these actions are complete, the controller removes the relevant finalizers
from the target object. When the `metadata.finalizers` field is empty,
Kubernetes considers the deletion complete.
-->
當你告訴 Kubernetes 刪除一個指定了 Finalizer 的物件時，
Kubernetes API 透過填充 `.metadata.deletionTimestamp` 來標記要刪除的物件，
並返回`202`狀態碼 (HTTP "已接受") 使其進入只讀狀態。
此時控制平面或其他元件會採取 Finalizer 所定義的行動，
而目標物件仍然處於終止中（Terminating）的狀態。
這些行動完成後，控制器會刪除目標物件相關的 Finalizer。
當 `metadata.finalizers` 欄位為空時，Kubernetes 認為刪除已完成。

<!--
You can use finalizers to control {{<glossary_tooltip text="garbage collection" term_id="garbage-collection">}}
of resources. For example, you can define a finalizer to clean up related resources or
infrastructure before the controller deletes the target resource.
-->
你可以使用 Finalizer 控制資源的{{<glossary_tooltip text="垃圾收集" term_id="garbage-collection">}}。
例如，你可以定義一個 Finalizer，在刪除目標資源前清理相關資源或基礎設施。