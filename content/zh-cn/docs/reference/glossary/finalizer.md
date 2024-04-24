---
title: Finalizer
id: finalizer
date: 2021-07-07
full_link: /zh-cn/docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  一个带有命名空间的键，告诉 Kubernetes 等到特定的条件被满足后，
  再完全删除被标记为删除的资源。
aka: 
tags:
- fundamental
- operation
---
<!--
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
Finalizer 是带有命名空间的键，告诉 Kubernetes 等到特定的条件被满足后，
再完全删除被标记为删除的资源。
Finalizer 提醒{{<glossary_tooltip text="控制器" term_id="controller">}}清理被删除的对象拥有的资源。

<!--more-->

<!--
When you tell Kubernetes to delete an object that has finalizers specified for
it, the Kubernetes API marks the object for deletion by populating `.metadata.deletionTimestamp`,
and returns a `202` status code (HTTP "Accepted"). The target object remains in a terminating state while the
control plane, or other components, take the actions defined by the finalizers.
After these actions are complete, the controller removes the relevant finalizers
from the target object. When the `metadata.finalizers` field is empty,
Kubernetes considers the deletion complete and deletes the object.
-->
当你告诉 Kubernetes 删除一个指定了 Finalizer 的对象时，
Kubernetes API 通过填充 `.metadata.deletionTimestamp` 来标记要删除的对象，
并返回 `202` 状态码(HTTP "已接受") 使其进入只读状态。
此时控制平面或其他组件会采取 Finalizer 所定义的行动，
而目标对象仍然处于终止中（Terminating）的状态。
这些行动完成后，控制器会删除目标对象相关的 Finalizer。
当 `metadata.finalizers` 字段为空时，Kubernetes 认为删除已完成并删除对象。

<!--
You can use finalizers to control {{<glossary_tooltip text="garbage collection" term_id="garbage-collection">}}
of resources. For example, you can define a finalizer to clean up related resources or
infrastructure before the controller deletes the target resource.
-->
你可以使用 Finalizer 控制资源的{{<glossary_tooltip text="垃圾收集" term_id="garbage-collection">}}。
例如，你可以定义一个 Finalizer，在删除目标资源前清理相关资源或基础设施。
