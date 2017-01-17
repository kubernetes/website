## PodTemplate v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | PodTemplate

> Example yaml coming soon...



PodTemplate describes a template for creating copies of a predefined pod.

<aside class="notice">
Appears In  <a href="#podtemplatelist-v1">PodTemplateList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
template <br /> *[PodTemplateSpec](#podtemplatespec-v1)* | Template defines the pods that will be created from this pod template. http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status

