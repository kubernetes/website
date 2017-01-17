## APIResourceList unversioned

Group        | Version     | Kind
------------ | ---------- | -----------
Core | unversioned | APIResourceList

> Example yaml coming soon...



APIResourceList is a list of APIResource, it is used to expose the name of the resources supported in a specific group and version, and if the resource is namespaced.



Field        | Description
------------ | -----------
groupVersion <br /> *string* | groupVersion is the group and version this APIResourceList is for.
resources <br /> *[APIResource](#apiresource-unversioned) array* | resources contains the name of the resources and if they are namespaced.

