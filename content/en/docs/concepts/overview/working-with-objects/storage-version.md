---
title: Storage Versions
content_type: concept
weight: 110
---

<!-- overview -->
The Kubernetes API server stores objects, relying on an etcd-compatible backing
store (often, the backing storage is etcd itself). Each object is serialized
using a particular version of that API type; for example, the v1 representation
of a ConfigMap. Kubernetes uses the term _storage version_ to describe how an
object is stored in your cluster.

The Kubernetes API also relies on automatic conversion; for example, if you have
a HorizontalPodAutoscaler, then you can interact with that
HorizontalPodAutoscaler using any mix of the v1 and v2 versions of the
HorizontalPodAutoscaler API. Kubernetes is responsible for converting each API
call so that clients do not see what version is actually serialized. 

For cluster administrators, object storage version is an important concept to
understand since it is what links the API representation of the object to the
actual encoding in the storage backend. This can be important for when the
underlying binary encodings of the object matter, such as for encryption at
rest, or API deprecation.

The same API may have multiple storage versions that the API Server can then
convert to an object schema. A single object that is part of that resource must
only have one storage version at any time. This means that the API Server is
aware of the binary encodings of the objects and is able to convert between all
the stored versions to the API Representation of the object dynamically.

The version of an object is separate from the storage version entirely. For
example, a `v1alpha1` and `v1beta1` API Object for the same Resource will be
encoded the same in storage as long as the storage version has not been updated
between the two objects.

<!-- body -->

## Storage version to resource mapping

Every resource will have 1 active storage version at any point in time, meaning
that any write to an object will store the object at that storage version. The
storage version can be updated however, making it so that objects can be stored
at differing versions. One object will only be stored at one storage version at
any time.

Reads from the API Server will convert the stored data to the API representation
of the object. This makes it so that old storage versions can sit indefinitely
as long as no updates occur to the object. Writes, on the other hand, will
convert the stored object to the new representation upon update. 

## Storage versions for custom resources {#CustomResourceDefinition-storage-version}

[Custom
resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#storage) are
defined dynamically, and as such differ from built in Kubernetes types with
their storage version. Builtin objects generally have their storage encoding
defined separately from their API types, where the stored object acts as a hub
and the specific version of the resource does not matter apart from being a
field in the object schema. 

However, for custom resources, a certain version of the resource must be set as
the storage version. The schema defined by that specific version of the custom
resource will be used as the encoding of the resource in the storage layer. See
the [advanced CRD
featureset](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#advanced-features-and-flexibility)
for more detailed information on the API setup and versioning.

For example see this CustomResourceDefinition for _crontabs_:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.example.com
spec:
  group: example.com
  # list of versions supported by this CustomResourceDefinition
  versions:
  - name: v1beta1
    # Each version can be enabled/disabled by Served flag.
    served: true
    # One and only one version must be marked as the storage version.
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
  - name: v1
    served: true
    storage: false
    schema:
      openAPIV3Schema:
        type: object
        properties:
          host:
            type: string
          port:
            type: string
          time:
            type: string
  conversion:
    strategy: None
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

The `v1beta1` API definition is used as the storage version, meaning that any
updates or creation of `crontabs` will be stored with the object schema of the
`v1beta1` api. In this case it actually would mean that the `v1` API object
would never be able to store the `time` field since it is not part of the
storage definition. This schema is used in the storage layer as the binary
encoding of the object itself. Trying to set two versions as the stored version
at the same time is considered invalid, since that would mean that two data
schemes would be considered valid ways to store the objects at the same time.

Upon modification of the version that is used for storage, that version of the
API will be used to store any new or update CRs. Watching or getting the object
will have the object be in use but will just convert the object from the old
storage version and not affect the object. Only updating or creating will have
an effect and use the newly defined storage version.  

## How storage versions are relevant to encryption at rest

There are tools to [encrypt the at rest
storage](/docs/tasks/administer-cluster/kms-provider/) of a cluster, especially
for cluster secrets. This adds an additional layer of protection for data
exfiltration since the actual stored data in the cluster is encrypted. This
means that the API Server is actually decrypting the data as it retrieves them
from storage. the data from storage. The APIServer must have the key for that
storage version in order to decode the object properly.

The storage version in this case is more than just the binary encoding of the
object. As long as what is stored can be somehow converted into the API object,
it can be used as a storage version.

## Migrating to a different storage version

Multiple storage versions for a single resource can pose problems for cluster
administrators. A cluster administrator may not remove old versions of an API
for CRDs which may be unsupported until they are sure that all objects are no
longer using the storege version associated with it. With a large number of
objects and an opaque view into which ones are new and which ones still are
backed by old storage versions, it makes it difficult to tell when a version can
be safely removed. If a version is removed prematurely, it can mean being unable
to read the object entirely.

Another important issue is the use of encryption keys as defined in the section
above. Since a resource must be actively in use to update the storage version,
when a key rotation is done, both the old encryption key and the new encryption
key must remain in use until the administrator is sure all objects have been
written to at least once. This poses both security risks and usability issues,
since a key cannot be fully removed from use until then. 

See [storage version
migration](/docs/tasks/manage-kubernetes-objects/storage-version-migration) on
examples of how to run a migration to ensure that all objects are using a newer
storage version without manual intervention.