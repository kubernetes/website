---
title: Binding
id: binding
full_link: /docs/concepts/scheduling-eviction/binding/
short_description: >
  The association of one Kubernetes resource with another, most commonly assigning a Pod to run on a specific Node.

tags:
- architecture
- fundamental
- operation
---
In Kubernetes, **binding** is the action of linking or associating one API resource with another.

<!--more-->

Most commonly, binding refers to assigning a {{< glossary_tooltip text="Pod" term_id="pod" >}} to a specific {{< glossary_tooltip text="Node" term_id="node" >}} where it will execute, setting the Pod's `.spec.nodeName` field. Binding can occur at creation time or dynamically via the `pods/binding` subresource used by the {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}}.

Binding also appears as an abstract pattern elsewhere in Kubernetes, such as associating a role with users or groups (`RoleBinding`), or binding a storage claim to persistent storage (`VolumeBinding`).

To learn more, read [Binding](/docs/concepts/scheduling-eviction/binding/).
