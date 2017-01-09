## StorageClass v1beta1

Group        | Version     | Kind
------------ | ---------- | -----------
Storage | v1beta1 | StorageClass

> Example yaml coming soon...



StorageClass describes the parameters for a class of storage for which PersistentVolumes can be dynamically provisioned.

StorageClasses are non-namespaced; the name of the storage class according to etcd is in ObjectMeta.Name.

<aside class="notice">
Appears In  <a href="#storageclasslist-v1beta1">StorageClassList</a> </aside>

Field        | Description
------------ | -----------
metadata <br /> *[ObjectMeta](#objectmeta-v1)* | Standard object's metadata. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#metadata
parameters <br /> *object* | Parameters holds the parameters for the provisioner that should create volumes of this storage class.
provisioner <br /> *string* | Provisioner indicates the type of the provisioner.

