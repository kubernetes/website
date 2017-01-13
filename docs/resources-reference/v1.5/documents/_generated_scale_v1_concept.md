

-----------
# Scale v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Scale




<aside class="notice">Other api versions of this object exist: <a href="#scale-v1beta1">v1beta1</a> </aside>


Scale represents a scaling request for a resource.



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object metadata; More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata.
spec <br /> *[ScaleSpec](#scalespec-v1)*  | defines the behavior of the scale. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status.
status <br /> *[ScaleStatus](#scalestatus-v1)*  | current status of the scale. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status. Read-only.


### ScaleSpec v1

<aside class="notice">
Appears In <a href="#scale-v1">Scale</a> </aside>

Field        | Description
------------ | -----------
replicas <br /> *integer*  | desired number of instances for the scaled object.

### ScaleStatus v1

<aside class="notice">
Appears In <a href="#scale-v1">Scale</a> </aside>

Field        | Description
------------ | -----------
replicas <br /> *integer*  | actual number of observed instances of the scaled object.
selector <br /> *string*  | label query over pods that should match the replicas count. This is same as the label selector but in the string format to avoid introspection by clients. The string will be in the same format as the query-param syntax. More info about label selectors: http://kubernetes.io/docs/user-guide/labels#label-selectors





