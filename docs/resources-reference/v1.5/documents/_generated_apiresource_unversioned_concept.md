

-----------
# APIResource unversioned



Group        | Version     | Kind
------------ | ---------- | -----------
Core | unversioned | APIResource







APIResource specifies the name of a resource and whether it is namespaced.

<aside class="notice">
Appears In <a href="#apiresourcelist-unversioned">APIResourceList</a> </aside>

Field        | Description
------------ | -----------
kind <br /> *string*  | kind is the kind for the resource (e.g. 'Foo' is the kind for a resource 'foo')
name <br /> *string*  | name is the name of the resource.
namespaced <br /> *boolean*  | namespaced indicates if a resource is namespaced or not.


### APIResourceList unversioned



Field        | Description
------------ | -----------
apiVersion <br /> *string*  | APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#resources
groupVersion <br /> *string*  | groupVersion is the group and version this APIResourceList is for.
kind <br /> *string*  | Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#types-kinds
resources <br /> *[APIResource](#apiresource-unversioned) array*  | resources contains the name of the resources and if they are namespaced.





