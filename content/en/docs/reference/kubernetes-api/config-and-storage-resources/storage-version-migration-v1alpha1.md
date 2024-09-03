---
api_metadata:
  apiVersion: "storagemigration.k8s.io/v1alpha1"
  import: "k8s.io/api/storagemigration/v1alpha1"
  kind: "StorageVersionMigration"
content_type: "api_reference"
description: "StorageVersionMigration represents a migration of stored data to the latest storage version."
title: "StorageVersionMigration v1alpha1"
weight: 9
auto_generated: true
---

<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference content, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

`apiVersion: storagemigration.k8s.io/v1alpha1`

`import "k8s.io/api/storagemigration/v1alpha1"`


## StorageVersionMigration {#StorageVersionMigration}

StorageVersionMigration represents a migration of stored data to the latest storage version.

<hr>

- **apiVersion**: storagemigration.k8s.io/v1alpha1


- **kind**: StorageVersionMigration


- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationSpec" >}}">StorageVersionMigrationSpec</a>)

  Specification of the migration.

- **status** (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationStatus" >}}">StorageVersionMigrationStatus</a>)

  Status of the migration.





## StorageVersionMigrationSpec {#StorageVersionMigrationSpec}

Spec of the storage version migration.

<hr>

- **continueToken** (string)

  The token used in the list options to get the next chunk of objects to migrate. When the .status.conditions indicates the migration is "Running", users can use this token to check the progress of the migration.

- **resource** (GroupVersionResource), required

  The resource that is being migrated. The migrator sends requests to the endpoint serving the resource. Immutable.

  <a name="GroupVersionResource"></a>
  *The names of the group, the version, and the resource.*

  - **resource.group** (string)

    The name of the group.

  - **resource.resource** (string)

    The name of the resource.

  - **resource.version** (string)

    The name of the version.





## StorageVersionMigrationStatus {#StorageVersionMigrationStatus}

Status of the storage version migration.

<hr>

- **conditions** ([]MigrationCondition)

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  The latest available observations of the migration's current state.

  <a name="MigrationCondition"></a>
  *Describes the state of a migration at a certain point.*

  - **conditions.status** (string), required

    Status of the condition, one of True, False, Unknown.

  - **conditions.type** (string), required

    Type of the condition.

  - **conditions.lastUpdateTime** (Time)

    The last time this condition was updated.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*

  - **conditions.message** (string)

    A human readable message indicating details about the transition.

  - **conditions.reason** (string)

    The reason for the condition's last transition.

- **resourceVersion** (string)

  ResourceVersion to compare with the GC cache for performing the migration. This is the current resource version of given group, version and resource when kube-controller-manager first observes this StorageVersionMigration resource.





## StorageVersionMigrationList {#StorageVersionMigrationList}

StorageVersionMigrationList is a collection of storage version migrations.

<hr>

- **apiVersion**: storagemigration.k8s.io/v1alpha1


- **kind**: StorageVersionMigrationList


- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **items** ([]<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>), required

  *Patch strategy: merge on key `type`*
  
  *Map: unique values on key type will be kept during a merge*
  
  Items is the list of StorageVersionMigration





## Operations {#Operations}



<hr>






### `get` read the specified StorageVersionMigration

#### HTTP Request

GET /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the StorageVersionMigration


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

401: Unauthorized


### `get` read status of the specified StorageVersionMigration

#### HTTP Request

GET /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the StorageVersionMigration


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

401: Unauthorized


### `list` list or watch objects of kind StorageVersionMigration

#### HTTP Request

GET /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations

#### Parameters


- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>


- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigrationList" >}}">StorageVersionMigrationList</a>): OK

401: Unauthorized


### `create` create a StorageVersionMigration

#### HTTP Request

POST /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations

#### Parameters


- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

202 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Accepted

401: Unauthorized


### `update` replace the specified StorageVersionMigration

#### HTTP Request

PUT /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the StorageVersionMigration


- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized


### `update` replace status of the specified StorageVersionMigration

#### HTTP Request

PUT /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the StorageVersionMigration


- **body**: <a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized


### `patch` partially update the specified StorageVersionMigration

#### HTTP Request

PATCH /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the StorageVersionMigration


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized


### `patch` partially update status of the specified StorageVersionMigration

#### HTTP Request

PATCH /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}/status

#### Parameters


- **name** (*in path*): string, required

  name of the StorageVersionMigration


- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>


- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>


- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>



#### Response


200 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): OK

201 (<a href="{{< ref "../config-and-storage-resources/storage-version-migration-v1alpha1#StorageVersionMigration" >}}">StorageVersionMigration</a>): Created

401: Unauthorized


### `delete` delete a StorageVersionMigration

#### HTTP Request

DELETE /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations/{name}

#### Parameters


- **name** (*in path*): string, required

  name of the StorageVersionMigration


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized


### `deletecollection` delete collection of StorageVersionMigration

#### HTTP Request

DELETE /apis/storagemigration.k8s.io/v1alpha1/storageversionmigrations

#### Parameters


- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

  


- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>


- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>


- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>


- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>


- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>


- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>


- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>


- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>


- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>


- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>


- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>



#### Response


200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

