---
title: Managing Kubernetes Objects Using Object Configuration (Declarative)
---

{% capture overview %}
Kubernetes objects can be created, updated, and deleted storing multiple
object configuration files in a directory and using `kubectl` to
recusively create and update those objects as needed.  This methodology
can retain writes made to live objects without merging the changes
back into the local object configuration.
{% endcapture %}

{% capture body %}
## Trade-offs

Advantages compared to imperative object configuration:

- Changes made directly to live objects are retained, even if they are not merged back into the configuration files.
- Declarative object configuration has better support for operating on directories and automatically detecting operation types (create, patch, delete) per-object.

Disadvantages compared to imperative object configuration:

- Declarative object configuration is harder to debug and understand results when they are unexpected.
- Partial updates using diffs create complex merge and patch operations.

## How to create objects

Create all objects defined locally in a directory that do not exist as
live objects.  This will set the `kubectl.kubernetes.io/last-applied-configuration: '{...}'`
annotation on each object, which contains the contents of the local object configuration file
used to create the object.  For details on why this is done, see [merge semantics](#merge-semantics).

**Note**: Add the `-R` flag to recursively process directories.

- `apply -f <directory/>`

## How to update objects

Update any objects defined in a directory that already exist:

1. Set fields to match the local configuration if they are missing or differ in the live object.  Ignores fields omitted from the local configuration file even if they are set in the live object.
2. Clear fields previously set with apply have since been removed from the local configuration file.

**Warning**: mixing `apply` with imperative object configuration commands
`create` and `replace` is not supported.  This is because `create`
and `replace` will not retain the `kubectl.kubernetes.io/last-applied-configuration`
the `apply` uses to compute updates.

**Note:** Updates send a patch request to update
specific fields instead of replacing the entire live object.
See [merge semantics](#merge-semantics) for more details.

- `apply -f <directory/>`

## How to delete objects

There are two approaches to delete objects managed by `apply`.

### Recommended: `delete -f <filename>`

Manually deleting objects using the imperative command is the recommended
approach, as it is more explicit about what is being deleted, and less likely
to result in the user to deleting something unintentionally.

- `delete -f <filename>`

### Alternative: `apply -f <directory/> --prune`

{% comment %}
TODO(pwittrock): We need a better way of supporting prune without making it easy for users to unintentionally delete a bunch of their objects.
{% endcomment %}

**Warning**: The user must be careful when using this command not to delete resources unintentionally.

Alternatively, `apply` can automatically identify objects to be deleted after their
configuration files are deleted from a directory.  `--prune`
queryies for all objects matching a set of labels, then checks
whether or not their local configuration is present.
All live objects that do not have local configuration are deleted.

**Important:** If the user deletes objects using prune, all candidates for deletion must have a common label used to identify them.

**Important:** Apply with prune should only be run on the root directory containing the object configuration files.  Running on sub-directories may cause objects to be unintentionally deleted.

{% comment %}
TODO(pwittrock): We need to change the behavior to prevent the user from running apply on subdirectories unintentionally.
{% endcomment %}

- `apply -f <directory/> --prune -l <labels>`

## How to view an object

- `get -f <filename|url> -o yaml`

## Merge semantics

`apply` maintains updates made to a live object, even when those
changes are not merged into the applied object configuration.  `apply`
supports using only a single object configuration file for an object,
but any number of live object writers can be used.

**Important**: Writes made to a live object should be made only to fields
omitted from the local object configuration.  If a field on the live
object is updated and it is present in the local object configuration,
it will be reset to the value in the local object configuration.

{% comment %}
TODO(pwittrock): Improve support for detecting multiple writers to the
same field.  Consider linting as a solution for this.
{% endcomment %}

### Merge calculation

Each time an object is applied, the local object configuration contents is written
to the annotation `kubectl.kubernetes.io/last-applied-configuration`.  This
is used to detect the deletion of fields from the local object configuration
so that they are then cleared from the live object.

1. Calculate fields to delete:
  - *last-applied-configuration - local object configuration*
  - clear fields present in the last-applied-configuration that are missing from the local object configuration file
2. Calculate fields to add or set:
  - *local object configuration - live object*
  - set fields present in the local object configuration file whose values are missing or differ from the live object
3. Calculate the merged patch: *fields to delete + fields to add*
  - Merge the results of 1. and 2. into a single patch request

{% comment %}
TODO(1.6): For 1.6, add the following bullet point to 1.

- clear fields explicitly set to null in the local object configuration file regardless of whether they appear in the last-applied-configuration
{% endcomment %}


### Merging changes to primitive fields

Changes to a primitive field of an object use the following strategy:

| Field in local object configuration | Field in live object configuration | Field in last-applied-config | Action                                    |
|-------------------------------------|------------------------------------|------------------------------|-------------------------------------------|
| Yes                                 | Yes                                | -                            | Conflict! Set live to local configuration |
| Yes                                 | No                                 | -                            | Set live to local configuration           |
| No                                  | -                                  | Yes                          | Delete from live configuration            |
| No                                  | -                                  | No                           | Do nothing / Keep live value              |

### Merging changes to map (object) fields

Changes to map fields of an object use the following strategy for each key in the map:

| Key in local object configuration   | Key in live object configuration   | Field in last-applied-config | Action                           |
|-------------------------------------|------------------------------------|------------------------------|----------------------------------|
| Yes                                 | Yes                                | -                            | Recurse on map value             |
| Yes                                 | No                                 | -                            | Set live to local configuration  |
| No                                  | -                                  | Yes                          | Delete from live configuration   |
| No                                  | -                                  | No                           | Do nothing / Keep live value     |

### Merging changes for list fields

Merging changes to lists uses one of 2 strategies.  The strategy is controlled
per-field on the Kubernetes object definition.

- Replace: Treat the list the same as a primitive field.  Replace or delete the entire list.  Preserves ordering.
- Merge: Treat the list like a map.  Add, delete, or update individual entries.  Does not preserve ordering.

The merge strategy requires that a `mergeKey` be defined on the list field.
The `mergeKey` is a field on the list elements to be used as the map key when
merging the list as though it were a map.

**Note:** As of Kubernetes 1.5, lists of primitive types do not support the merge strategy.

{% comment %}
TODO(1.6): Update this with the following for 1.6

Lists of primitive types with the merge strategy use the value as the `mergeKey`.
{% endcomment %}

**Note:** As of Kubernetes 1.5, the strategy and `mergeKey`s for list
fields are defined in the [types.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/api/v1/types.go)
source code in the tags `patchStrategy` and `patchMergeKey`.

{% comment %}
TODO(pwittrock): Update this once the patchStrategy and patchMergeKey are
represented in the open-api schema and shown in the reference docs.
{% endcomment %}

{% comment %}
TODO(pwittrock): We need to support a flag to auto generate these labels + selectors for users.
{% endcomment %}

## Example map merge

`last-applied-config` value - stored as an annotation on the live object

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
...
spec:
  replicas: 3
  minReadySeconds: 10
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.10
```

Local Object Configuration

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
...
spec:
  replicas: 4
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.10
```

Live object before `apply`

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
...
spec:
  replicas: 3              # Will be changed to 4
  minReadySeconds: 10      # Will be cleared
  revisionHistoryLimit: 3  # Will be ignored
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.10
```

Live object after `apply`

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
...
spec:
  replicas: 4
  revisionHistoryLimit: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.10
```

## Example list with merge strategy

**Note:** This examples shows ordering in lists as being preserved so
that it is easier to understand.  In practice, the ordering is not
preserved during merge.

`last-applied-config` value - stored as an annotation on the live object

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
...
spec:
  replicas: 3
  revisionHistoryLimit: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.10
      - name: nginx-helper-a
        image: helper:1.3
      - name: nginx-helper-b
        image: helper:1.3
```

Local Object Configuration

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
...
spec:
  replicas: 3
  revisionHistoryLimit: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.11
      - name: nginx-helper-b
        image: helper:1.3
      - name: nginx-helper-c
        image: helper:1.3
```

Live object before `apply`

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
...
spec:
  replicas: 3
  revisionHistoryLimit: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.10
      - name: nginx-helper-a # Will be deleted
        image: helper:1.3
      - name: nginx-helper-b
        image: helper:1.3
        args: ["run"]        # This field will be ignored
      - name: nginx-helper-d # This entry will be ignored
        image: helper:1.3
```

Live object after `apply`

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
...
spec:
  replicas: 3
  revisionHistoryLimit: 3
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.10
      - name: nginx-helper-b
        image: helper:1.3
        args: ["run"]
      - name: nginx-helper-c # This field was added
        image: helper:1.3
      - name: nginx-helper-d
        image: helper:1.3
```


## **Warning:** considerations around defaulting performed in the server

Defaulted fields are *not* re-defaulted unless they are explicitly cleared
as part of the patch request.
This may cause unexpected behavior for a fields defaulted to based
on the values of other fields.  When the other fields are later changed
the values defaulted from them will not be updated unless they are
explicitly cleared.

For this reason, it is recommended that certain fields defaulted
by the server are explicitly defined in the object configuration even
if the desired values match the server defaults.  This will make it
easier to recognize conflicting values that will not be re-defaulted
by the server.

Example:

1. User creates a Deployment without defining `strategy.type`
2. Server defaults `strategy.type` to `RollingUpdate` and defaults `strategy.rollingUpdate` values
3. User changes `strategy.type` to `Recreate`.  The `strategy.rollingUpdate` values remain at their defaulted values, though the server expects them to be cleared.
  - If the strategy.rollingUpdate was defined in the config initially, it would have been more clear that it needed to be deleted.
4. Apply fails because `strategy.rollingUpdate` is not cleared

Recommendations for fields to explicitly define in the object configuration:

- Selectors and PodTemplate Labels on any controller
- Deployment RolloutStrategy

### How to clear server defaulted fields or fields set by other writers

As of Kubernetes 1.5, fields that do not appear in the configuration cannot be
cleared.  For lists that are merged, this means elements of the list
that do not appear in the configuration cannot be deleted.  The
following workaround exist:

Option 1: remove the field by directly editing the live object

Option 2: remove the field through the configuration
- Add the field to the configuration to match the live object
- Apply the configuration - updates the annotation to include the field
- Delete the field from the configuration
- Apply the configuration - delete the field from the live object and annotation.

{% comment %}
TODO(1.6): Update this with the following for 1.6

Fields that do not appear in the configuration can be cleared by
setting their values to `null` and then applying the configuration.
For fields defaulted by the server, this will trigger re-defaulting
the values.
{% endcomment %}

## **Warning:** defining Controller Selectors and PodTemplate Labels

{% comment %}
TODO(pwittrock): We need to support a flag to auto generate these labels + selectors for users.
{% endcomment %}

Updating selector on controllers is strongly advised against.  Instead,
the recommended approach is to define a single immutable PodTemplate label
used only by the controller selector with no other semantic meaning.

Example label:

```yaml
selector:
  matchLabels:
      controller-selector: "v1beta1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "v1beta1/deployment/nginx"
```

## Notes on ThirdPartyResources

As of Kubernetes 1.5, ThirdPartyResources are not supported by `apply`.
The recommended approach for ThirdPartyResources is to use [imperative
object configuration](/docs/concepts/tools/kubectl/object-management-using-imperative-config/) methodologies.

## How to change ownership of a field between configuration and live writers

Individual object fields should be owned by a single writer.

### Change owner from a live writer to configuration

Add the field to the configuration.  Stop the live writer from writing to the field.

### Change owner from configuration to a live writer.

As of Kubernetes 1.5, changing ownership of a field from configuration to
a live writer requires manual steps.

- Remove the field from the configuration
- Remove the field from the `kubectl.kubernetes.io/last-applied-configuration` annotation on the live object.  This can be done using `edit`

{% comment %}
TODO(pwittrock): Update this once we support the following.

- Remove the field from the configuration
- Run `kubectl apply set last-applied-config -f <file>`
{% endcomment %}

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


## Migrating objects from imperative command management to declarative object configuration

Migrating objects from imperative command management to declarative object
configuration involves several manual steps.

1. Export live object to a local object configuration file
  - `kubectl get <kind>/<name> -o yaml --export > <kind>_<name>.yaml`
2. Manually remove the status field from the object configuration in a text editor
3. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object
  - `kubectl replace --save-config -f <kind>_<name>.yaml`
4. Change processes to use `apply` for managing the object exclusively

{% comment %}
TODO(pwittrock): Why doesn't export remove the status field?  Seems like it should.
{% endcomment %}

## Migrating objects from imperative object configuration to declarative object configuration

1. Set the `kubectl.kubernetes.io/last-applied-configuration` annotation on the object
  - `kubectl replace --save-config -f <kind>_<name>.yaml`
2. Change processes to use `apply` for managing the object exclusively

{% endcapture %}

{% capture whatsnext %}
- [Managing Kubernetes Objects Using Imperative Commands](/docs/concepts/tools/kubectl/object-management-using-commands/)
- [Managing Kubernetes Objects Using Object Configuration (Imperative)](/docs/concepts/tools/kubectl/object-management-using-imperative-config/)
- [Kubectl Command Reference](/docs/user-guide/kubectl/v1.5/)
- [Kubernetes Object Schema Reference](/docs/resources-reference/v1.5/)
{% endcapture %}

{% include templates/concept.md %}
