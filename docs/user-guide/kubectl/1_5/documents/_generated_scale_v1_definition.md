## Scale v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Scale

> Example yaml coming soon...

<aside class="notice">Other api versions of this object exist: <a href="#scale-v1beta1">v1beta1</a> </aside>

Scale represents a scaling request for a resource.



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object metadata; More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata.
spec <br /> *[ScaleSpec](#scalespec-v1)* | defines the behavior of the scale. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status.
status <br /> *[ScaleStatus](#scalestatus-v1)* | current status of the scale. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status. Read-only.

