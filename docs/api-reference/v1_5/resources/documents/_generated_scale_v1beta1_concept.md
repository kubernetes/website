

-----------
# Scale v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | Scale




<aside class="notice">Other api versions of this object exist: <a href="#scale-v1">v1</a> </aside>


represents a scaling request for a resource.



Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object metadata; More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata.
spec <br /> *[ScaleSpec](#scalespec-v1beta1)*  | defines the behavior of the scale. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status.
status <br /> *[ScaleStatus](#scalestatus-v1beta1)*  | current status of the scale. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status. Read-only.


### ScaleSpec v1beta1

<aside class="notice">
Appears In <a href="#scale-v1beta1">Scale</a> </aside>

Field        | Description
------------ | -----------
replicas <br /> *integer*  | desired number of instances for the scaled object.

### ScaleStatus v1beta1

<aside class="notice">
Appears In <a href="#scale-v1beta1">Scale</a> </aside>

Field        | Description
------------ | -----------
replicas <br /> *integer*  | actual number of observed instances of the scaled object.
selector <br /> *object*  | label query over pods that should match the replicas count. More info: http://kubernetes.io/docs/user-guide/labels#label-selectors
targetSelector <br /> *string*  | label selector for pods that should match the replicas count. This is a serializated version of both map-based and more expressive set-based selectors. This is done to avoid introspection in the clients. The string will be in the same format as the query-param syntax. If the target type only supports map-based selectors, both this field and map-based selector field are populated. More info: http://kubernetes.io/docs/user-guide/labels#label-selectors





