## Binding v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Binding

> Example yaml coming soon...



Binding ties one object to another. For example, a pod is bound to a node by a scheduler.



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
target <br /> *[ObjectReference](#objectreference-v1)* | The target object that you want to bind to the standard object.

