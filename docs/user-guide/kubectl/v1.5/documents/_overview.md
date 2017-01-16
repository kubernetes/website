# <strong>API OVERVIEW</strong>

Welcome to the Kubernetes API.  You can use our API to access Kubernetes API endpoints to read and write Kubernetes
resource objects.

## Resource Categories

This is a highlevel overview of the basic types of resources provide by the Kubernetes API and their primary functions.

**Workloads** *Run your containers*: These are responsible for managing and running your containers on the cluster.

**Discovery & LB Resources** *Access your containers*: These are responsible for stitching your workloads together into an externally accessible Loadbalanced Service.

**Config & Storage Resources** *Inject initialization data into your containers*: These are responsible for injecting data into your applications and persisting data externally to your container.

**Cluster Resources** *Manage your cluster*: These are responsible for defining configuration of the cluster itself, and are generally only used by cluster operators.

**Metadata Resources** *Configure resource meta behavior*: These are responsible for configuring behavior of your other Resources within the Cluster.

------------

## Resource Objects

Resource objects typically have 3 components:

- **ResourceSpec**: This is defined by the user and describes the desired state of system.  Fill this in when creating or updating an
object.
- **ResourceStatus**: This is filled in by the server and reports the current state of the system.  Only kubernetes components should fill
this in
- **Resource ObjectMeta**: This is metadata about the resource, such as its name, type, api version, annotations, and labels.  This contains
fields that maybe updated both by the end user and the system (e.g. annotations)

------------

## Resource Operations

Most resources provide the following Operations:

#### Create:
Create operations will create the resource in the storage backend.  After a resource is create the system will apply
the desired state.

#### Update:
Updates come in 2 forms: **Replace** and **Patch**

**Replace**:
Replacing a resource object will update the resource by replacing the existing spec with the provided one.  For
read-then-write operations this is safe because an optimistic lock failure will occur if the resource was modified
between the read and write.  *Note*: The *Resource*Status will be ignored by the system and will not be updated.
To update the status, one must invoke the specific status update operation.

Note: Replacing a resource object may not result immediately in changes being propagated to downstream objects.  For instance
replacing a *ConfigMap* or *Secret* resource will not result in all *Pod*s seeing the changes unless the *Pod*s are
restarted out of band.

**Patch**:
Patch will apply a change to a specific field.  How the change is merged is defined per field.  Lists may either be
replaced or merged.  Merging lists will not preserve ordering.

**Patches will never cause optimistic locking failures, and the last write will win.**  Patches are recommended
 when the full state is not read before an update, or when failing on optimistic locking is undesirable.  *When patching
 complex types, arrays and maps, how the patch is applied is defined on a per-field basis and may either replace
 the field's current value, or merge the contents into the current value.*

#### Read

Reads come in 3 forms: **Get**, **List** and **Watch**

**Get**: Get will retrieve a specific resource object by name.

**List**: List will retrieve all resource objects of a specific type within a namespace, and the results can be restricted to resources matching a selector query.

**List All Namespaces**: Like *List* but retrieves resources across all namespaces.

**Watch**: Watch will stream results for an object(s) as it is updated.  Similar to a callback, watch is used to respond to resource changes.

#### Delete

Delete will delete a resource.  Depending on the specific resource, child objects may or may not be garbage collected by the server.  See
notes on specific resource objects for details.

#### Additional Operations

Resources may define additional operations specific to that resource type.

**Rollback**: Rollback a PodTemplate to a previous version.  Only available for some resource types.

**Read / Write Scale**: Read or Update the number of replicas for the given resource.  Only available for some resource types.

**Read / Write Status**: Read or Update the Status for a resource object.  The Status can only changed through these update operations.

------------
