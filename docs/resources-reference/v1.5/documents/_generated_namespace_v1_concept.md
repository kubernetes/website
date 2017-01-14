

-----------
# Namespace v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | Namespace







Namespace provides a scope for Names. Use of multiple namespaces is optional.

<aside class="notice">
Appears In <a href="#namespacelist-v1">NamespaceList</a> </aside>

Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
spec <br /> *[NamespaceSpec](#namespacespec-v1)*  | Spec defines the behavior of the Namespace. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status
status <br /> *[NamespaceStatus](#namespacestatus-v1)*  | Status describes the current status of a Namespace. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#spec-and-status


### NamespaceSpec v1

<aside class="notice">
Appears In <a href="#namespace-v1">Namespace</a> </aside>

Field        | Description
------------ | -----------
finalizers <br /> *string array*  | Finalizers is an opaque list of values that must be empty to permanently remove object from storage. More info: http://releases.k8s.io/HEAD/docs/design/namespaces.md#finalizers

### NamespaceStatus v1

<aside class="notice">
Appears In <a href="#namespace-v1">Namespace</a> </aside>

Field        | Description
------------ | -----------
phase <br /> *string*  | Phase is the current lifecycle phase of the namespace. More info: http://releases.k8s.io/HEAD/docs/design/namespaces.md#phases

### NamespaceList v1



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
items <br /> *[Namespace](#namespace-v1) array*  | Items is the list of Namespace objects in the list. More info: http://kubernetes.io/docs/user-guide/namespaces
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds





