

-----------
# ThirdPartyResource v1beta1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1beta1 | ThirdPartyResource







A ThirdPartyResource is a generic representation of a resource, it is used by add-ons and plugins to add new resource types to the API.  It consists of one or more Versions of the api.

<aside class="notice">
Appears In <a href="#thirdpartyresourcelist-v1beta1">ThirdPartyResourceList</a> </aside>

Field        | Description
------------ | -----------
description <br /> *string*  | Description is the description of this object.
metadata <br /> *[ObjectMeta](#objectmeta-v1)*  | Standard object metadata
versions <br /> *[APIVersion](#apiversion-v1beta1) array*  | Versions are versions for this third party object


### ThirdPartyResourceList v1beta1



Field        | Description
------------ | -----------
items <br /> *[ThirdPartyResource](#thirdpartyresource-v1beta1) array*  | Items is the list of ThirdPartyResources.
metadata <br /> *[ListMeta](#listmeta-unversioned)*  | Standard list metadata.





