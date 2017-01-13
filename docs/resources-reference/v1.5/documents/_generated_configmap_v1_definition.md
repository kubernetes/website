## ConfigMap v1

Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | ConfigMap



ConfigMap holds configuration data for pods to consume.

<aside class="notice">
Appears In  <a href="#configmaplist-v1">ConfigMapList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
data <br /> *object*  | Data contains the configuration data. Each key must be a valid DNS_SUBDOMAIN with an optional leading dot.
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata

