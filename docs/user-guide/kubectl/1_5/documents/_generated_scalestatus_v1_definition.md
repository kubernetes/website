## ScaleStatus v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ScaleStatus

> Example yaml coming soon...

<aside class="notice">Other api versions of this object exist: <a href="#scalestatus-v1beta1">v1beta1</a> </aside>

ScaleStatus represents the current status of a scale subresource.

<aside class="notice">
Appears In  <a href="#scale-v1">Scale</a> </aside>

Field        | Description
------------ | -----------
replicas <br /> *integer* | actual number of observed instances of the scaled object.
selector <br /> *string* | label query over pods that should match the replicas count. This is same as the label selector but in the string format to avoid introspection by clients. The string will be in the same format as the query-param syntax. More info about label selectors: http://kubernetes.io/docs/user-guide/labels#label-selectors

