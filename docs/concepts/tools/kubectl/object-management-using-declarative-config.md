---
title: Managing Kubernetes Objects Using Object Configuration (Declarative)
---

{% capture overview %}
Kubernetes objects can be created, updated, and deleted storing multiple
object configuration files in a directory and using `kubectl` to
recursively create and update those objects as needed.  This method
retains writes made to live objects without merging the changes
back into the local object configuration.
{% endcapture %}

{% capture body %}

## Trade-offs

The `kubectl` tool supports three kinds of object management:

* Imperative commands
* Imperative object configuration
* Declarative object configuration

See [Kubernetes Object Management](/docs/concepts/tools/kubectl/object-management-overview/)
for a discussion of the advantages and disadvantage of each kind of object management.

## Before you begin

Declarative object configuration requires a firm understanding of
the Kubernetes object definitions and configuration.  Read and complete
the following documents if you have not already.

- [Managing Kubernetes Objects Using Imperative Commands](/docs/concepts/tools/kubectl/object-management-using-imperative-commands/)
- [Managing Kubernetes Objects Using Object Configuration (Imperative)](/docs/concepts/tools/kubectl/object-management-using-imperative-config/)

Following are definitions for terms used in this document.

- Object Configuration File / Configuration File: A file defining the
  configuration for a Kubernetes object that is passed to
  `kubectl apply`.  Typically stored in source control, such as `git`.
- Live Object Configuration / Live Configuration: The live configuration
  values observed by the Kubernetes cluster.  Stored in the Kubernetes
  cluster storage, typically `etcd`.
- Declarative Configuration Writer /  Declarative Writer: An entity
  making updates to an object by modifying the object configuration
  file and running `kubectl apply` to write the changes.

## How to create objects

Create all objects defined by configuration files in a directory if they do not exist
already in the cluster.

**Note**: Add the `-R` flag to recursively process directories.

- `kubectl apply -f <directory/>`

This sets the `kubectl.kubernetes.io/last-applied-configuration: '{...}'`
annotation on each object, which contains the contents of the object configuration file
used to create the object.

**Example:**

{% include code.html language="yaml" file="simple_deployment.yaml" ghlink="/docs/concepts/tools/simple_deployment.yaml" %}

Create the object using `kubectl apply` with the following command.

        kubectl apply -f http://k8s.io/docs/concepts/tools/kubectl/simple_deployment.yaml

Print the live configuration using `kubectl get` with the following command.

        kubectl get -f http://k8s.io/docs/concepts/tools/kubectl/simple_deployment.yaml -o yaml

**Observe:** the `kubectl.kubernetes.io/last-applied-configuration` was written to the live configuration and matches the configuration file:

{% include code.html language="yaml" file="applied_deployment.yaml" ghlink="/docs/concepts/tools/applied_deployment.yaml" %}

## How to update objects

Update any objects defined in a directory that already exist:

1. Set fields that appear in the configuration file in the live configuration.
2. Clear fields removed from the configuration file in the live configuration.

**Note**: Add the `-R` flag to recursively process directories.

- `kubectl apply -f <directory/>`

**Example:**

{% include code.html language="yaml" file="simple_deployment.yaml" ghlink="/docs/concepts/tools/simple_deployment.yaml" %}

Create the object using `kubectl apply` with the following command.

        kubectl apply -f http://k8s.io/docs/concepts/tools/kubectl/simple_deployment.yaml

Print the live configuration using `kubectl get` with the following command.

        kubectl get -f http://k8s.io/docs/concepts/tools/kubectl/simple_deployment.yaml -o yaml

**Observe:** the `kubectl.kubernetes.io/last-applied-configuration` was written to the live configuration and matches the configuration file:

{% include code.html language="yaml" file="applied_deployment.yaml" ghlink="/docs/concepts/tools/applied_deployment.yaml" %}

Update the `replicas` on the live configuration directly using `kubectl scale`.  This does not use `kubectl apply`.

        kubectl scale deployment/nginx-deployment --replicas 2

Print the live configuration using `kubectl get` with the following
command.

        kubectl get -f http://k8s.io/docs/concepts/tools/kubectl/simple_deployment.yaml -o yaml

**Observe:** the following changes to the live configuration:

- the `replicas` field has been set to 1
- the `last-applied-configuration` annotation does not contain the replicas

{% include code.html language="yaml" file="applied_scaled_deployment.yaml" ghlink="/docs/concepts/tools/applied_scaled_deployment.yaml" %}

Update the simple_deployment.yaml to change the image from `nginx:1.7.9` to `nginx:1.11.9` and delete the `minReadySeconds` field.

{% include code.html language="yaml" file="update_deployment.yaml" ghlink="/docs/concepts/tools/update_deployment.yaml" %}

        kubectl apply -f http://k8s.io/docs/concepts/tools/kubectl/updated_deployment.yaml

Print the live configuration using `kubectl get` with the following
command.

        kubectl get -f http://k8s.io/docs/concepts/tools/kubectl/simple_deployment.yaml -o yaml

**Observe:** the following changes to the live configuration:

- the `replicas` field retains the value of 2 set by `kubectl scale` -
  this is possible because it is omitted from the configuration file
- the `image` field has been updated to `nginx:1.11.9` from `nginx:1.7.9`
- the `last-applied-configuration` annotation has been updated with the new image
- the `minReadySeconds` field has been cleared
- the `last-applied-configuration` annotation no longer contains the `minReadySeconds` field

{% include code.html language="yaml" file="applied_update_deployment.yaml" ghlink="/docs/concepts/tools/applied_update_deployment.yaml" %}

**Warning**: mixing `kubectl apply` with the imperative object configuration commands
`create` and `replace` is not supported.  This is because `create`
and `replace` does not retain the `kubectl.kubernetes.io/last-applied-configuration`
the `kubectl apply` uses to compute updates.

**Warning**: as of Kubernetes 1.5, the `kubectl edit` command is
incompatible with `kubectl apply` and the two should not be
used together.

## How to delete objects

There are two approaches to delete objects managed by `kubectl apply`.

### Recommended: `delete -f <filename>`

Manually deleting objects using the imperative command is the recommended
approach, as it is more explicit about what is being deleted, and less likely
to result in the user to deleting something unintentionally.

- `delete -f <filename>`

### Alternative: `kubectl apply -f <directory/> --prune -l your=label`

Only use this if you know what you are doing.

**Warning:** `kubectl apply --prune` is in alpha, and backwards incompatible
changes may be introduced in subsequent releases.

**Warning**: The user must be careful when using this command so as not
to delete objects unintentionally.

Alternatively, `kubectl apply` can identify objects to be deleted once their
configuration files are deleted from a directory.  `--prune`
queries the apiserver for all objects matching a set of labels, attempts
to match the returned live object configuration against the object
configuration files.  Objects matching the query that are not found
are deleted if the have `last-applied-configuration`.

{% comment %}
TODO(pwittrock): We need to change the behavior to prevent the user from running apply on subdirectories unintentionally.
{% endcomment %}

- `kubectl apply -f <directory/> --prune -l <labels>`

**Important:** Apply with prune should only be run against the root directory
containing the object configuration files.  Running on sub-directories
may cause objects to be unintentionally deleted if they are returned
by the label selector query specified with `-l <labels>` and
do not appear in the subdirectory.

## How to view an object

- `get -f <filename|url> -o yaml`

## How apply calculates differences and merges changes

**Definition:** Patch: An update operation that is scoped to specific
fields of an object instead of updating the entire object.
This enables updating only a specific set of fields on an object without
reading the object first.

When `kubectl apply` updates the live configuration for an object,
it does so by sending a patch request to the apiserver.  The
patch defines updates scoped to specific fields of the live object
configuration.  `kubectl apply` calculates this patch request
using the configuration file, live configuration, and
`last-applied-configuration` annotation stored in the live configuration.

### Merge patch calculation

`kubectl apply` writes the contents of the configuration file to the
annotation `kubectl.kubernetes.io/last-applied-configuration`.  This
is used to identify fields that have been removed from the configuration
file and need to be cleared from the live configuration.

1. Calculate fields to delete: Fields present in `last-applied-configuration` and missing from the configuration file
2. Calculate fields to add or set: Fields present in the configuration file whose values don't match the live configuration

**Example:**

Configuration file:

{% include code.html language="yaml" file="update_deployment.yaml" ghlink="/docs/concepts/tools/update_deployment.yaml" %}

Live configuration:

{% include code.html language="yaml" file="applied_scaled_deployment.yaml" ghlink="/docs/concepts/tools/applied_scaled_deployment.yaml" %}

**Observe:** Merge calculations performed by `kubectl apply` when run against the
configuration file and a cluster containing the live object configuration.

1. Calculate fields to delete by reading values from
   `last-applied-configuration` and comparing them to values in the
   configuration file.
  - `minReadySeconds` appears in the `last-applied-configuration` annotation,
    but is not present in the configuration file.
    **Action:** clear `minReadySeconds` from the live configuration.
2. Calculate fields to set by reading values from the configuration
   file and comparing them to values in the live configuration.
  - the value of `image` in the configuration file does not match
    the value in the live configuration.  **Action:** set the value of `image`.
3. Set the `last-applied-configuration` annotation to match the value
   of the configuration file.
4. Merge the results from 1, 2, 3 into a single patch request to the apiserver.

Result:

{% include code.html language="yaml" file="applied_update_deployment.yaml" ghlink="/docs/concepts/tools/applied_update_deployment.yaml" %}

{% comment %}
TODO(1.6): For 1.6, add the following bullet point to 1.

- clear fields explicitly set to null in the local object configuration file regardless of whether they appear in the last-applied-configuration
{% endcomment %}

### How different types of fields are merged

How a particular field in the configuration file is merged with
with the live configuration depends on the
type of the field.  Several types of fields exist:

- primitive: fields of type string, integer, boolean: e.g. `image`, `replicas`  **Action:** Replace
- map / object: fields of type map or complex-types containing sub fields: e.g. maps: `labels`, `annotations`; complex-types: `spec`, `metadata` **Action:** Merge elements or sub fields
- list: fields containing a list of items that may be either primitive types, maps, or complex-types: e.g. `containers`, `ports`, `args`  **Action:** Varies

When `kubectl apply` updates a map / object or list field, it typically does
not replace the entire field, but instead updates the individual sub elements.
For instance, when merging the `spec` on a Deployment, the entire `spec` is
not replaced.  Instead the sub fields of `spec`, such as `replicas`, are compared
and merged.

### Merging changes to fields whose types are primitive values

Fields that represent primitive types are replaced or cleared.

**Note:** '-' is used for "not applicable" because the value is not used.

| Field in object configuration file  | Field in live object configuration | Field in last-applied-configuration | Action                                    |
|-------------------------------------|------------------------------------|-------------------------------------|-------------------------------------------|
| Yes                                 | Yes                                | -                                   | Set live to configuration file value  |
| Yes                                 | No                                 | -                                   | Set live to local configuration           |
| No                                  | -                                  | Yes                                 | Clear from live configuration            |
| No                                  | -                                  | No                                  | Do nothing / Keep live value              |

### Merging changes to fields of type map or complex-types

Fields that represent maps or complex-types are merged by comparing each of the sub fields or elements of of the map / complex-type:

**Note:** '-' is used for "not applicable" because the value is not used.

| Key in object configuration file    | Key in live object configuration   | Field in last-applied-configuration | Action                           |
|-------------------------------------|------------------------------------|-------------------------------------|----------------------------------|
| Yes                                 | Yes                                | -                                   | Compare sub fields values        |
| Yes                                 | No                                 | -                                   | Set live to local configuration  |
| No                                  | -                                  | Yes                                 | Delete from live configuration   |
| No                                  | -                                  | No                                  | Do nothing / Keep live value     |

### Merging changes for fields of type list

Merging changes to lists uses one of 3 strategies.  The strategy is controlled
per-field on the Kubernetes object definition.

#### Replace the list (either elements of primitive types or complex-types)

Treat the list the same as a primitive field.  Replace or delete the
entire list.  Preserves ordering.

**Example:** Using apply to update the `args` field of a PodSpec sets
the value of `args` to the value in the configuration file.  Any elements
added to the live configuration are lost.  Ordering of `args` defined
in the configuration file is retained in the live configuration.

```yaml
# last-applied-configuration value
    args: ["a, b"]

# configuration file value
    args: ["a", "c"]

# live configuration
    args: ["a", "b", "d"]

# result after merge
    args: ["a", "c"]

```

**Explanation:**

    - The merge used the configuration file value as the new list value

#### Merge list of complex-type elements:

Treat the list as a map and treat a specific field of the entries as a key.
Add, delete, or update individual entries.  Does not preserve ordering.

This merge strategy uses a special tag on the field called a `mergeKey`.  The
`mergeKey` is defined for each field in the Kubernetes source code:
[types.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/api/v1/types.go#L2119)
When merging a list of complex-types, the field specified as the `mergeKey`
is used like a map-key for each element.

**Example:** Using apply to update the `containers` field of a PodSpec
merges the list as though `containers` was a map where each element is keyed
by `name`.

```yaml
# last-applied-configuration value
    containers:
    - name: nginx
      image: nginx:1.10
    - name: nginx-helper-a # key: nginx-helper-a; will be deleted in result
      image: helper:1.3
    - name: nginx-helper-b # key: nginx-helper-b; will be retained
      image: helper:1.3

# configuration file value
    containers:
    - name: nginx
      image: nginx:1.11
    - name: nginx-helper-b
      image: helper:1.3
    - name: nginx-helper-c # key: nginx-helper-c; will be added in result
      image: helper:1.3

# live configuration
    containers:
    - name: nginx
      image: nginx:1.10
    - name: nginx-helper-a
      image: helper:1.3
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Field will be retained
    - name: nginx-helper-d # key: nginx-helper-d; will be retained
      image: helper:1.3

# result after merge
    containers:
    - name: nginx
      image: nginx:1.10
      # Element nginx-helper-a was deleted
    - name: nginx-helper-b
      image: helper:1.3
      args: ["run"] # Field was retained
    - name: nginx-helper-c # Element was added
      image: helper:1.3
    - name: nginx-helper-d # Element was ignored
      image: helper:1.3
```

**Explanation:**

- The container named "nginx-helper-a" was deleted because a no container
  named "nginx-helper-a" appeared in the configuration file
- The container named "nginx-helper-b" retained the changes to `args`
  in the live configuration.  `kubectl apply` was able to identify
  that "nginx-helper-b" in the live configuration was the same
  "nginx-helper-b" as in the configuration file even though their fields
  had different values (no `args` in the configuration file).  This is
  because the `mergeKey` field value (name) was identical in both.
- The container named "nginx-helper-c" was added because no container
  with that name appeared in the live configuration, but one with
  that name was present in the configuration file.
- The container named "nginx-helper-d" was retained because
  no element with that name appeared in the last-applied-configuration.

#### Merge list of primitive type elements:

As of Kubernetes 1.5, lists of primitive types do not support the merge strategy.

**Note:** Which of the above strategies is chosen for a given field is controlled by
the `patchStrategy` tag in [types.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/api/v1/types.go#L2119)
If no `patchStrategy` is specified for a field of type list, then
the list is replaced.

{% comment %}
TODO(pwittrock): Uncomment this for 1.6

- Treat the list as a set of primitives.  Replace or delete individual
  elements.  Does not preserve ordering.  Does not preserve duplicates.

**Example:** Using apply to update the `finalizers` field of ObjectMeta
keeps elements added to the live configuration.  Ordering of finalizers
is lost.
{% endcomment %}

## Considerations around defaulting performed in the server

Certain optional fields will be set by the apiserver on the live object
iff they are not specified when creating the object.

**Example:**

Create a Deployment from a configuration file without specifying the `strategy` or `selector` in the configuration.

{% include code.html language="yaml" file="simple_deployment.yaml" ghlink="/docs/concepts/tools/simple_deployment.yaml" %}

Create the object using `kubectl apply` with the following command.

        kubectl apply -f http://k8s.io/docs/concepts/tools/kubectl/simple_deployment.yaml

Print the live configuration using `kubectl get` with the following command.

        kubectl get -f http://k8s.io/docs/concepts/tools/kubectl/simple_deployment.yaml -o yaml

**Observe:** that many fields have been set to default values in the live
configuration by the apiserver.  These fields were not specified in the
configuration file.

{% include code.html language="yaml" file="defaulted_deployment.yaml" ghlink="/docs/concepts/tools/defaulted_deployment.yaml" %}

**Note:** some of the fields default values have been derived from
the values of other fields that were specified in the configuration file,
such as the `selector` field.

Defaulted fields are *not* re-defaulted unless they are explicitly cleared
as part of the patch request.  This may cause unexpected behavior for a
fields defaulted based
on the values of other fields.  When the other fields are later changed
the values defaulted from them will not be updated unless they are
explicitly cleared.

For this reason, it is recommended that certain fields defaulted
by the server are explicitly defined in the object configuration even
if the desired values match the server defaults.  This will make it
easier to recognize conflicting values that will not be re-defaulted
by the server.

**Example:**

```yaml
# last-applied-configuration
spec:
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80

# configuration file
spec:
  strategy:
    type: Recreate # updated value
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80

# live configuration
spec:
  strategy:
    type: RollingUpdate # defaulted value
    rollingUpdate: # defaulted value derived from type
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80

# result after merge - ERROR!
spec:
  strategy:
    type: Recreate # updated value
    rollingUpdate: # defaulted value - incompatible with Recreate
      maxSurge : 1
      maxUnavailable: 1
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

**Explanation:**

1. User creates a Deployment without defining `strategy.type`
2. Server defaults `strategy.type` to `RollingUpdate` and defaults `strategy.rollingUpdate` values
3. User changes `strategy.type` to `Recreate`.  The `strategy.rollingUpdate` values remain at their defaulted values, though the server expects them to be cleared.
  - If the `strategy.rollingUpdate` was defined in the config initially, it would have been more clear that it needed to be deleted.
4. Apply fails because `strategy.rollingUpdate` is not cleared
  - `strategy.rollingupdate` can not be used with a `strategy.type` of `Recreate`

Recommendations for fields to explicitly define in the object configuration field:

- Selectors and PodTemplate Labels on workloads such as Deployment, StatefulSet, Job, DaemonSet, ReplicaSet, ReplicationController
- Deployment RolloutStrategy

### How to clear server defaulted fields or fields set by other writers

As of Kubernetes 1.5, fields that do not appear in the configuration file cannot be
cleared.  The following workaround exist:

Option 1: remove the field by directly modifying the live object

**Note:** As of Kubernetes 1.5, `kubectl edit` does not work with `kubectl apply`
and will cause unexpected behavior if used together.

Option 2: remove the field through the configuration file

- Add the field to the configuration file to match the live object
- Apply the configuration file - updates the annotation to include the field
- Delete the field from the configuration file
- Apply the configuration file - delete the field from the live object and annotation.

{% comment %}
TODO(1.6): Update this with the following for 1.6

Fields that do not appear in the configuration file can be cleared by
setting their values to `null` and then applying the configuration file.
For fields defaulted by the server, this triggers re-defaulting
the values.
{% endcomment %}

## How to change ownership of a field between the configuration file and direct imperative writers

Individual object fields should be written to exclusively by either `kubectl apply` or
directly to the live configuration without appearing in the configuration file, e.g. `kubectl scale`.

### Change owner from a direct imperative writer to the configuration file

Add the field to the configuration file.  Discontinue direct updates to
the live configuration that do not go through `kubectl apply` (for the field).

### Change owner from the configuration file to a direct imperative writer.

As of Kubernetes 1.5, changing ownership of a field from a configuration file to
an imperative writer requires manual steps.

- Remove the field from the configuration file.
- Remove the field from the `kubectl.kubernetes.io/last-applied-configuration` annotation on the live object.

## Migrating management methods

Kubernetes objects should be managed using only one method at a time.
Switching from one method to another is possible, but is a manual process.

**Note:** The following exceptions:
- using imperative delete with declarative management

{% comment %}
TODO(pwittrock): We need to make using imperative commands with
declarative object configuration work so that it doesn't write the
fields to the annotation, and instead.  Then add this bullet point.

- using imperative commands with declarative configuration to manage where each manages different fields.
{% endcomment %}

### Migrating object management from imperative command management to declarative object configuration

Migrating object management from imperative command management to declarative object
configuration involves several manual steps.

1. Export live object to a local object configuration file
  - `kubectl get <kind>/<name> -o yaml --export > <kind>_<name>.yaml`
2. Manually remove the status field from the object configuration in a text editor
  - Note: This step is optional as `kubectl apply` will not update the status field even if present in the configuration.
3. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object
  - `kubectl replace --save-config -f <kind>_<name>.yaml`
4. Change processes to use `kubectl apply` for managing the object exclusively

{% comment %}
TODO(pwittrock): Why doesn't export remove the status field?  Seems like it should.
{% endcomment %}

### Migrating object management from imperative object configuration to declarative object configuration

1. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object
  - `kubectl replace --save-config -f <kind>_<name>.yaml`
2. Change processes to use `kubectl apply` for managing the object exclusively

## Defining controller selectors and PodTemplate labels

**Warning**: Updating selectors on controllers is strongly discouraged.

The recommended approach is to define a single, immutable PodTemplate label
used only by the controller selector with no other semantic meaning.

**Example:**

```yaml
selector:
  matchLabels:
      controller-selector: "v1beta1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "v1beta1/deployment/nginx"
```

## Support for ThirdPartyResources

As of Kubernetes 1.5, ThirdPartyResources are not supported by `kubectl apply`.
The recommended approach for ThirdPartyResources is to use [imperative object configuration](/docs/concepts/tools/kubectl/object-management-using-imperative-config/) methods.
{% endcapture %}

{% capture whatsnext %}
- [Managing Kubernetes Objects Using Imperative Commands](/docs/concepts/tools/kubectl/object-management-using-imperative-commands/)
- [Managing Kubernetes Objects Using Object Configuration (Imperative)](/docs/concepts/tools/kubectl/object-management-using-imperative-config/)
- [Kubectl Command Reference](/docs/user-guide/kubectl/v1.5/)
- [Kubernetes Object Schema Reference](/docs/resources-reference/v1.5/)
{% endcapture %}

{% include templates/concept.md %}
