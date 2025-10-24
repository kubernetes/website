---
title: Storage Versions
content_type: concept
weight: 20
---

<!-- overview -->
Storage version is the current version that the API object is stored at in the
cluster. While it does not affect what the API Server returns it is an important
concept to understand since it is what links the API representation of the
object to the actual encoding in the storage backend. This can matter for when
the underlying binary encodings of the object matter, such as for encryption at
rest, or API deprecation.

The same API object may have multiple storage versions that the API Server can
then convert to an object schema. This means that the API Server is aware of the
binary encodings of the objects and is able to convert between all the stored
versions to the API Representation of the object dynamically.

The version of an object is separate from the storage version entirely. For
example, a `v1alpha1` and `v1beta1` API Object for the same GroupResource will
be encoded the same in storage as long as the storage version has not been
updated between the two objects.

<!-- body -->

## Storage Version to Resource Mapping

Every resource will have 1 active storage version at any point in time, meaning
that any write to an object will store the object at that storage version. Reads
can occur from any storage version however, and will not update the stored
version of the object. The only way a storage version will get updated is by
modifying the object somehow. Otherwise the stored version will stay the same as
long as the object exists in the cluster. 

## Encryption at Rest

There are tools to [encrypt the at rest
storage](/docs/tasks/administer-cluster/kms-provider/) of a cluster, especially
for cluster secrets. This adds an additional layer of protection for data
exfiltration since the actual stored data in the cluster is encrypted. This
means that the API Server is actually decrypting the stored data when it decodes
the data from storage. The APIServer must have the key for that storage version
in order to decode the object properly.

## Custom Resource Definition Stored Version

[Custom
resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) are
defined dynamically, and as such differ from built in kubernetes types with
their storage version. Builtin objects generally have their storage version
defined as a seperate object from their API types, where the stored version acts
as a hub and the specific version of the resource does not matter apart from
being a field in the object schema. This is why for custom resources, a certain
version of the resource must be set as the storage version. That object encoding
will be used as the schema for that storage version. See [versioning custom
resources](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/)
for more detailed information on the API setup.

Upon modification of the version that is used for storage, that version of the
API will be used to store any new or update CRs. The old version will still be
used for any reads, but new writes will use the updated stored version.

# Migrating Storage Versions

Multiple storage versions can pose problems for cluster administrators. Since a
resource must be actively in use to update the storage version, when a key
rotation is done, both the old encryption key and the new encryption key must
remain in use until the administrator is sure all objects have been written to
at least once. This poses both security risks and usability issues, since a key
cannot be fully removed from use until then. 

Another important issue is the deprecation of old storage versions, such as with
CRDs. A cluster administrator may not remove old versions of the API which may
be unsupported until they are sure that all objects have been moved off of it.
With a large number of objects and an opaque view into which ones are new and
which ones still are backed by old storage versions, it makes it difficult to
tell when a version can be safely removed. If a version is removed prematurely,
it can mean being unable to read the object entirely.

With `StorageVersionMigration` a cluster administrator can kick off a migration
on a specific `GroupResource` and be assured that all the objects that are part
of that `GroupResource` will have been migrated to the latest storage version.
Once that is done, an administrator can proceed to deprecate anything that
supported the old storage version, providing a clean path to deprecations and
key rotations.

See [storage version
migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration) on
examples of how to run a migration to ensure that all objects are using a newer
storage version without manual intervention.