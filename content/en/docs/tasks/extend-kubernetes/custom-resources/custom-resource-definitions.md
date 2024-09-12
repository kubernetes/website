---
title: Extend the Kubernetes API with CustomResourceDefinitions
reviewers:
- deads2k
- jpbetz
- liggitt
- roycaihw
- sttts
content_type: task
min-kubernetes-server-version: 1.16
weight: 20
---

<!-- overview -->
This page shows how to install a
[custom resource](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
into the Kubernetes API by creating a
[CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1-apiextensions-k8s-io).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
If you are using an older version of Kubernetes that is still supported, switch to
the documentation for that version to see advice that is relevant for your cluster.

<!-- steps -->

## Create a CustomResourceDefinition

When you create a new CustomResourceDefinition (CRD), the Kubernetes API Server
creates a new RESTful resource path for each version you specify. The custom
resource created from a CRD object can be either namespaced or cluster-scoped,
as specified in the CRD's `spec.scope` field. As with existing built-in
objects, deleting a namespace deletes all custom objects in that namespace.
CustomResourceDefinitions themselves are non-namespaced and are available to
all namespaces.

For example, if you save the following CustomResourceDefinition to `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
  name: crontabs.stable.example.com
spec:
  # group name to use for REST API: /apis/<group>/<version>
  group: stable.example.com
  # list of versions supported by this CustomResourceDefinition
  versions:
    - name: v1
      # Each version can be enabled/disabled by Served flag.
      served: true
      # One and only one version must be marked as the storage version.
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
  # either Namespaced or Cluster
  scope: Namespaced
  names:
    # plural name to be used in the URL: /apis/<group>/<version>/<plural>
    plural: crontabs
    # singular name to be used as an alias on the CLI and for display
    singular: crontab
    # kind is normally the CamelCased singular type. Your resource manifests use this.
    kind: CronTab
    # shortNames allow shorter string to match your resource on the CLI
    shortNames:
    - ct
```

and create it:

```shell
kubectl apply -f resourcedefinition.yaml
```

Then a new namespaced RESTful API endpoint is created at:

```
/apis/stable.example.com/v1/namespaces/*/crontabs/...
```

This endpoint URL can then be used to create and manage custom objects.
The `kind` of these objects will be `CronTab` from the spec of the
CustomResourceDefinition object you created above.

It might take a few seconds for the endpoint to be created.
You can watch the `Established` condition of your CustomResourceDefinition
to be true or watch the discovery information of the API server for your
resource to show up.

## Create custom objects

After the CustomResourceDefinition object has been created, you can create
custom objects. Custom objects can contain custom fields. These fields can
contain arbitrary JSON.
In the following example, the `cronSpec` and `image` custom fields are set in a
custom object of kind `CronTab`.  The kind `CronTab` comes from the spec of the
CustomResourceDefinition object you created above.

If you save the following YAML to `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
```

and create it:

```shell
kubectl apply -f my-crontab.yaml
```

You can then manage your CronTab objects using kubectl. For example:

```shell
kubectl get crontab
```

Should print a list like this:

```none
NAME                 AGE
my-new-cron-object   6s
```

Resource names are not case-sensitive when using kubectl, and you can use either
the singular or plural forms defined in the CRD, as well as any short names.

You can also view the raw YAML data:

```shell
kubectl get ct -o yaml
```

You should see that it contains the custom `cronSpec` and `image` fields
from the YAML you used to create it:

```yaml
apiVersion: v1
items:
- apiVersion: stable.example.com/v1
  kind: CronTab
  metadata:
    annotations:
      kubectl.kubernetes.io/last-applied-configuration: |
        {"apiVersion":"stable.example.com/v1","kind":"CronTab","metadata":{"annotations":{},"name":"my-new-cron-object","namespace":"default"},"spec":{"cronSpec":"* * * * */5","image":"my-awesome-cron-image"}}
    creationTimestamp: "2021-06-20T07:35:27Z"
    generation: 1
    name: my-new-cron-object
    namespace: default
    resourceVersion: "1326"
    uid: 9aab1d66-628e-41bb-a422-57b8b3b1f5a9
  spec:
    cronSpec: '* * * * */5'
    image: my-awesome-cron-image
kind: List
metadata:
  resourceVersion: ""
  selfLink: ""
```

## Delete a CustomResourceDefinition

When you delete a CustomResourceDefinition, the server will uninstall the RESTful API endpoint
and delete all custom objects stored in it.

```shell
kubectl delete -f resourcedefinition.yaml
kubectl get crontabs
```

```none
Error from server (NotFound): Unable to list {"stable.example.com" "v1" "crontabs"}: the server could not
find the requested resource (get crontabs.stable.example.com)
```

If you later recreate the same CustomResourceDefinition, it will start out empty.

## Specifying a structural schema

CustomResources store structured data in custom fields (alongside the built-in
fields `apiVersion`, `kind` and `metadata`, which the API server validates
implicitly). With [OpenAPI v3.0 validation](#validation) a schema can be
specified, which is validated during creation and updates, compare below for
details and limits of such a schema.

With `apiextensions.k8s.io/v1` the definition of a structural schema is
mandatory for CustomResourceDefinitions. In the beta version of
CustomResourceDefinition, the structural schema was optional.

A structural schema is an [OpenAPI v3.0 validation schema](#validation) which:

1. specifies a non-empty type (via `type` in OpenAPI) for the root, for each specified field of an object node
   (via `properties` or `additionalProperties` in OpenAPI) and for each item in an array node
   (via `items` in OpenAPI), with the exception of:
   * a node with `x-kubernetes-int-or-string: true`
   * a node with `x-kubernetes-preserve-unknown-fields: true`
2. for each field in an object and each item in an array which is specified within any of `allOf`, `anyOf`,
   `oneOf` or `not`, the schema also specifies the field/item outside of those logical junctors (compare example 1 and 2).
3. does not set `description`, `type`, `default`, `additionalProperties`, `nullable` within an `allOf`, `anyOf`,
   `oneOf` or `not`, with the exception of the two pattern for `x-kubernetes-int-or-string: true` (see below).
4. if `metadata` is specified, then only restrictions on `metadata.name` and `metadata.generateName` are allowed.

Non-structural example 1:

```none
allOf:
- properties:
    foo:
      ...
```

conflicts with rule 2. The following would be correct:

```none
properties:
  foo:
    ...
allOf:
- properties:
    foo:
      ...
```

Non-structural example 2:

```none
allOf:
- items:
    properties:
      foo:
        ...
```
conflicts with rule 2. The following would be correct:

```none
items:
  properties:
    foo:
      ...
allOf:
- items:
    properties:
      foo:
        ...
```

Non-structural example 3:

```none
properties:
  foo:
    pattern: "abc"
  metadata:
    type: object
    properties:
      name:
        type: string
        pattern: "^a"
      finalizers:
        type: array
        items:
          type: string
          pattern: "my-finalizer"
anyOf:
- properties:
    bar:
      type: integer
      minimum: 42
  required: ["bar"]
  description: "foo bar object"
```

is not a structural schema because of the following violations:

* the type at the root is missing (rule 1).
* the type of `foo` is missing (rule 1).
* `bar` inside of `anyOf` is not specified outside (rule 2).
* `bar`'s `type` is within `anyOf` (rule 3).
* the description is set within `anyOf` (rule 3).
* `metadata.finalizers` might not be restricted (rule 4).

In contrast, the following, corresponding schema is structural:

```yaml
type: object
description: "foo bar object"
properties:
  foo:
    type: string
    pattern: "abc"
  bar:
    type: integer
  metadata:
    type: object
    properties:
      name:
        type: string
        pattern: "^a"
anyOf:
- properties:
    bar:
      minimum: 42
  required: ["bar"]
```

Violations of the structural schema rules are reported in the `NonStructural` condition in the
CustomResourceDefinition.

### Field pruning

CustomResourceDefinitions store validated resource data in the cluster's persistence store, {{< glossary_tooltip term_id="etcd" text="etcd">}}.
As with native Kubernetes resources such as {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
if you specify a field that the API server does not recognize, the unknown field  is _pruned_ (removed) before being persisted.

CRDs converted from `apiextensions.k8s.io/v1beta1` to `apiextensions.k8s.io/v1` might lack
structural schemas, and `spec.preserveUnknownFields` might be `true`.

For legacy CustomResourceDefinition objects created as
`apiextensions.k8s.io/v1beta1` with `spec.preserveUnknownFields` set to
`true`, the following is also true:

* Pruning is not enabled.
* You can store arbitrary data.

For compatibility with `apiextensions.k8s.io/v1`, update your custom
resource definitions to:

1. Use a structural OpenAPI schema.
2. Set `spec.preserveUnknownFields` to `false`.

If you save the following YAML to `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
  someRandomField: 42
```

and create it:

```shell
kubectl create --validate=false -f my-crontab.yaml -o yaml
```

Your output is similar to:

```yaml
apiVersion: stable.example.com/v1
kind: CronTab
metadata:
  creationTimestamp: 2017-05-31T12:56:35Z
  generation: 1
  name: my-new-cron-object
  namespace: default
  resourceVersion: "285"
  uid: 9423255b-4600-11e7-af6a-28d2447dc82b
spec:
  cronSpec: '* * * * */5'
  image: my-awesome-cron-image
```

Notice that the field `someRandomField` was pruned.

This example turned off client-side validation to demonstrate the API server's behavior, by adding
the `--validate=false` command line option.
Because the [OpenAPI validation schemas are also published](#publish-validation-schema-in-openapi)
to clients, `kubectl` also checks for unknown fields and rejects those objects well before they
would be sent to the API server.

#### Controlling pruning

By default, all unspecified fields for a custom resource, across all versions, are pruned. It is possible though to
opt-out of that for specific sub-trees of fields by adding `x-kubernetes-preserve-unknown-fields: true` in the
[structural OpenAPI v3 validation schema](#specifying-a-structural-schema).

For example:

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
```

The field `json` can store any JSON value, without anything being pruned.

You can also partially specify the permitted JSON; for example:

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
    type: object
    description: this is arbitrary JSON
```

With this, only `object` type values are allowed.

Pruning is enabled again for each specified property (or `additionalProperties`):

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
    type: object
    properties:
      spec:
        type: object
        properties:
          foo:
            type: string
          bar:
            type: string
```

With this, the value:

```yaml
json:
  spec:
    foo: abc
    bar: def
    something: x
  status:
    something: x
```

is pruned to:

```yaml
json:
  spec:
    foo: abc
    bar: def
  status:
    something: x
```

This means that the `something` field in the specified `spec` object is pruned, but everything outside is not.

### IntOrString

Nodes in a schema with `x-kubernetes-int-or-string: true` are excluded from rule 1, such that the
following is structural:

```yaml
type: object
properties:
  foo:
    x-kubernetes-int-or-string: true
```

Also those nodes are partially excluded from rule 3 in the sense that the following two patterns are allowed
(exactly those, without variations in order to additional fields):

```none
x-kubernetes-int-or-string: true
anyOf:
  - type: integer
  - type: string
...
```

and

```none
x-kubernetes-int-or-string: true
allOf:
  - anyOf:
      - type: integer
      - type: string
  - ... # zero or more
...
```

With one of those specification, both an integer and a string validate.

In [Validation Schema Publishing](#publish-validation-schema-in-openapi),
`x-kubernetes-int-or-string: true` is unfolded to one of the two patterns shown above.

### RawExtension

RawExtensions (as in [`runtime.RawExtension`](/docs/reference//kubernetes-api/workload-resources/controller-revision-v1#RawExtension))
holds complete Kubernetes objects, i.e. with `apiVersion` and `kind` fields.

It is possible to specify those embedded objects (both completely without constraints or partially specified)
by setting `x-kubernetes-embedded-resource: true`. For example:

```yaml
type: object
properties:
  foo:
    x-kubernetes-embedded-resource: true
    x-kubernetes-preserve-unknown-fields: true
```

Here, the field `foo` holds a complete object, e.g.:

```none
foo:
  apiVersion: v1
  kind: Pod
  spec:
    ...
```

Because `x-kubernetes-preserve-unknown-fields: true` is specified alongside, nothing is pruned.
The use of `x-kubernetes-preserve-unknown-fields: true` is optional though.

With `x-kubernetes-embedded-resource: true`, the `apiVersion`, `kind` and `metadata` are implicitly specified and validated.

## Serving multiple versions of a CRD

See [Custom resource definition versioning](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/)
for more information about serving multiple versions of your
CustomResourceDefinition and migrating your objects from one version to another.

<!-- discussion -->
## Advanced topics

### Finalizers

*Finalizers* allow controllers to implement asynchronous pre-delete hooks.
Custom objects support finalizers similar to built-in objects.

You can add a finalizer to a custom object like this:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  finalizers:
  - stable.example.com/finalizer
```

Identifiers of custom finalizers consist of a domain name, a forward slash and the name of
the finalizer. Any controller can add a finalizer to any object's list of finalizers.

The first delete request on an object with finalizers sets a value for the
`metadata.deletionTimestamp` field but does not delete it. Once this value is set,
entries in the `finalizers` list can only be removed. While any finalizers remain it is also
impossible to force the deletion of an object.

When the `metadata.deletionTimestamp` field is set, controllers watching the object execute any
finalizers they handle and remove the finalizer from the list after they are done. It is the
responsibility of each controller to remove its finalizer from the list.

The value of `metadata.deletionGracePeriodSeconds` controls the interval between polling updates.

Once the list of finalizers is empty, meaning all finalizers have been executed, the resource is
deleted by Kubernetes.

### Validation

Custom resources are validated via
[OpenAPI v3 schemas](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schemaObject),
by x-kubernetes-validations when the [Validation Rules feature](#validation-rules) is enabled, and you
can add additional validation using
[admission webhooks](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook).

Additionally, the following restrictions are applied to the schema:

- These fields cannot be set:

  - `definitions`,
  - `dependencies`,
  - `deprecated`,
  - `discriminator`,
  - `id`,
  - `patternProperties`,
  - `readOnly`,
  - `writeOnly`,
  - `xml`,
  - `$ref`.

- The field `uniqueItems` cannot be set to `true`.
- The field `additionalProperties` cannot be set to `false`.
- The field `additionalProperties` is mutually exclusive with `properties`.

The `x-kubernetes-validations` extension can be used to validate custom resources using
[Common Expression Language (CEL)](https://github.com/google/cel-spec) expressions when the
[Validation rules](#validation-rules) feature is enabled and the CustomResourceDefinition schema is a
[structural schema](#specifying-a-structural-schema).

Refer to the [structural schemas](#specifying-a-structural-schema) section for other
restrictions and CustomResourceDefinition features.

The schema is defined in the CustomResourceDefinition. In the following example, the
CustomResourceDefinition applies the following validations on the custom object:

- `spec.cronSpec` must be a string and must be of the form described by the regular expression.
- `spec.replicas` must be an integer and must have a minimum value of 1 and a maximum value of 10.

Save the CustomResourceDefinition to `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        # openAPIV3Schema is the schema for validating custom objects.
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                  pattern: '^(\d+|\*)(/\d+)?(\s+(\d+|\*)(/\d+)?){4}$'
                image:
                  type: string
                replicas:
                  type: integer
                  minimum: 1
                  maximum: 10
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

and create it:

```shell
kubectl apply -f resourcedefinition.yaml
```

A request to create a custom object of kind CronTab is rejected if there are invalid values in its fields.
In the following example, the custom object contains fields with invalid values:

- `spec.cronSpec` does not match the regular expression.
- `spec.replicas` is greater than 10.

If you save the following YAML to `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * *"
  image: my-awesome-cron-image
  replicas: 15
```

and attempt to create it:

```shell
kubectl apply -f my-crontab.yaml
```

then you get an error:

```console
The CronTab "my-new-cron-object" is invalid: []: Invalid value: map[string]interface {}{"apiVersion":"stable.example.com/v1", "kind":"CronTab", "metadata":map[string]interface {}{"name":"my-new-cron-object", "namespace":"default", "deletionTimestamp":interface {}(nil), "deletionGracePeriodSeconds":(*int64)(nil), "creationTimestamp":"2017-09-05T05:20:07Z", "uid":"e14d79e7-91f9-11e7-a598-f0761cb232d1", "clusterName":""}, "spec":map[string]interface {}{"cronSpec":"* * * *", "image":"my-awesome-cron-image", "replicas":15}}:
validation failure list:
spec.cronSpec in body should match '^(\d+|\*)(/\d+)?(\s+(\d+|\*)(/\d+)?){4}$'
spec.replicas in body should be less than or equal to 10
```

If the fields contain valid values, the object creation request is accepted.

Save the following YAML to `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
  replicas: 5
```

And create it:

```shell
kubectl apply -f my-crontab.yaml
crontab "my-new-cron-object" created
```
### Validation ratcheting

{{< feature-state feature_gate_name="CRDValidationRatcheting" >}}

If you are using a version of Kubernetes older than v1.30, you need to explicitly
enable the `CRDValidationRatcheting`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to
use this behavior, which then applies to all CustomResourceDefinitions in your
cluster. 

Provided you enabled the feature gate, Kubernetes implements _validation ratcheting_
for CustomResourceDefinitions. The API server is willing to accept updates to resources that
are not valid after the update, provided that each part of the resource that failed to validate
was not changed by the update operation. In other words, any invalid part of the resource
that remains invalid must have already been wrong.
You cannot use this mechanism to update a valid resource so that it becomes invalid.

This feature allows authors of CRDs to confidently add new validations to the
OpenAPIV3 schema under certain conditions. Users can update to the new schema
safely without bumping the version of the object or breaking workflows.

While most validations placed in the OpenAPIV3 schema of a CRD support
ratcheting, there are a few exceptions. The following OpenAPIV3 schema 
validations are not supported by ratcheting under the implementation in Kubernetes
{{< skew currentVersion >}} and if violated will continue to throw an error as normally:

- Quantors
  - `allOf`
  - `oneOf`
  - `anyOf`
  - `not`
  -  any validations in a descendent of one of these fields
- `x-kubernetes-validations`
  For Kubernetes 1.28, CRD [validation rules](#validation-rules) are ignored by
  ratcheting. Starting with Alpha 2 in Kubernetes 1.29, `x-kubernetes-validations`
  are ratcheted only if they do not refer to `oldSelf`.

  Transition Rules are never ratcheted: only errors raised by rules that do not 
  use `oldSelf` will be automatically ratcheted if their values are unchanged.

  To write custom ratcheting logic for CEL expressions, check out [optionalOldSelf](#field-optional-oldself).
- `x-kubernetes-list-type`
  Errors arising from changing the list type of a subschema will not be 
  ratcheted. For example adding `set` onto a list with duplicates will always 
  result in an error.
- `x-kubernetes-map-keys`
  Errors arising from changing the map keys of a list schema will not be 
  ratcheted.
- `required`
  Errors arising from changing the list of required fields will not be ratcheted.
- `properties`
  Adding/removing/modifying the names of properties is not ratcheted, but 
  changes to validations in each properties' schemas and subschemas may be ratcheted
  if the name of the property stays the same.
- `additionalProperties`
  To remove a previously specified `additionalProperties` validation will not be
  ratcheted.
- `metadata`
  Errors that come from Kubernetes' built-in validation of an object's `metadata` 
  are not ratcheted (such as object name, or characters in a label value). 
  If you specify your own additional rules for the metadata of a custom resource, 
  that additional validation will be ratcheted.

### Validation rules

{{< feature-state state="stable" for_k8s_version="v1.29" >}}

Validation rules use the [Common Expression Language (CEL)](https://github.com/google/cel-spec)
to validate custom resource values. Validation rules are included in
CustomResourceDefinition schemas using the `x-kubernetes-validations` extension.

The Rule is scoped to the location of the `x-kubernetes-validations` extension in the schema.
And `self` variable in the CEL expression is bound to the scoped value.

All validation rules are scoped to the current object: no cross-object or stateful validation
rules are supported.

For example:

```none
  ...
  openAPIV3Schema:
    type: object
    properties:
      spec:
        type: object
        x-kubernetes-validations:
          - rule: "self.minReplicas <= self.replicas"
            message: "replicas should be greater than or equal to minReplicas."
          - rule: "self.replicas <= self.maxReplicas"
            message: "replicas should be smaller than or equal to maxReplicas."
        properties:
          ...
          minReplicas:
            type: integer
          replicas:
            type: integer
          maxReplicas:
            type: integer
        required:
          - minReplicas
          - replicas
          - maxReplicas
```

will reject a request to create this custom resource:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  minReplicas: 0
  replicas: 20
  maxReplicas: 10
```

with the response:

```
The CronTab "my-new-cron-object" is invalid:
* spec: Invalid value: map[string]interface {}{"maxReplicas":10, "minReplicas":0, "replicas":20}: replicas should be smaller than or equal to maxReplicas.
```

`x-kubernetes-validations` could have multiple rules.
The `rule` under `x-kubernetes-validations` represents the expression which will be evaluated by CEL.
The `message` represents the message displayed when validation fails. If message is unset, the
above response would be:

```
The CronTab "my-new-cron-object" is invalid:
* spec: Invalid value: map[string]interface {}{"maxReplicas":10, "minReplicas":0, "replicas":20}: failed rule: self.replicas <= self.maxReplicas
```

{{< note >}}
You can quickly test CEL expressions in [CEL Playground](https://playcel.undistro.io).
{{< /note >}}

Validation rules are compiled when CRDs are created/updated.
The request of CRDs create/update will fail if compilation of validation rules fail.
Compilation process includes type checking as well.

The compilation failure:

- `no_matching_overload`: this function has no overload for the types of the arguments.

  For example, a rule like `self == true` against a field of integer type will get error:

  ```none
  Invalid value: apiextensions.ValidationRule{Rule:"self == true", Message:""}: compilation failed: ERROR: \<input>:1:6: found no matching overload for '_==_' applied to '(int, bool)'
  ```

- `no_such_field`: does not contain the desired field.

  For example, a rule like `self.nonExistingField > 0` against a non-existing field will return
  the following error:

  ```none
  Invalid value: apiextensions.ValidationRule{Rule:"self.nonExistingField > 0", Message:""}: compilation failed: ERROR: \<input>:1:5: undefined field 'nonExistingField'
  ```

- `invalid argument`: invalid argument to macros.

  For example, a rule like `has(self)` will return error:

  ```none
  Invalid value: apiextensions.ValidationRule{Rule:"has(self)", Message:""}: compilation failed: ERROR: <input>:1:4: invalid argument to has() macro
  ```

Validation Rules Examples:

| Rule                                                                             | Purpose                                                                           |
| ----------------                                                                 | ------------                                                                      |
| `self.minReplicas <= self.replicas && self.replicas <= self.maxReplicas`         | Validate that the three fields defining replicas are ordered appropriately        |
| `'Available' in self.stateCounts`                                                | Validate that an entry with the 'Available' key exists in a map                   |
| `(size(self.list1) == 0) != (size(self.list2) == 0)`                             | Validate that one of two lists is non-empty, but not both                         |
| <code>!('MY_KEY' in self.map1) &#124;&#124; self['MY_KEY'].matches('^[a-zA-Z]*$')</code>               | Validate the value of a map for a specific key, if it is in the map               |
| `self.envars.filter(e, e.name == 'MY_ENV').all(e, e.value.matches('^[a-zA-Z]*$')` | Validate the 'value' field of a listMap entry where key field 'name' is 'MY_ENV'  |
| `has(self.expired) && self.created + self.ttl < self.expired`                    | Validate that 'expired' date is after a 'create' date plus a 'ttl' duration       |
| `self.health.startsWith('ok')`                                                   | Validate a 'health' string field has the prefix 'ok'                              |
| `self.widgets.exists(w, w.key == 'x' && w.foo < 10)`                             | Validate that the 'foo' property of a listMap item with a key 'x' is less than 10 |
| `type(self) == string ? self == '100%' : self == 1000`                           | Validate an int-or-string field for both the int and string cases             |
| `self.metadata.name.startsWith(self.prefix)`                                     | Validate that an object's name has the prefix of another field value              |
| `self.set1.all(e, !(e in self.set2))`                                            | Validate that two listSets are disjoint                                           |
| `size(self.names) == size(self.details) && self.names.all(n, n in self.details)` | Validate the 'details' map is keyed by the items in the 'names' listSet           |
| `size(self.clusters.filter(c, c.name == self.primary)) == 1`                     | Validate that the 'primary' property has one and only one occurrence in the 'clusters' listMap           |

Xref: [Supported evaluation on CEL](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#evaluation)

- If the Rule is scoped to the root of a resource, it may make field selection into any fields
  declared in the OpenAPIv3 schema of the CRD as well as `apiVersion`, `kind`, `metadata.name` and
  `metadata.generateName`. This includes selection of fields in both the `spec` and `status` in the
  same expression:

  ```none
    ...
    openAPIV3Schema:
      type: object
      x-kubernetes-validations:
        - rule: "self.status.availableReplicas >= self.spec.minReplicas"
      properties:
          spec:
            type: object
            properties:
              minReplicas:
                type: integer
              ...
          status:
            type: object
            properties:
              availableReplicas:
                type: integer
  ```

- If the Rule is scoped to an object with properties, the accessible properties of the object are field selectable
  via `self.field` and field presence can be checked via `has(self.field)`. Null valued fields are treated as
  absent fields in CEL expressions.

  ```none
    ...
    openAPIV3Schema:
      type: object
      properties:
        spec:
          type: object
          x-kubernetes-validations:
            - rule: "has(self.foo)"
          properties:
            ...
            foo:
              type: integer
  ```

- If the Rule is scoped to an object with additionalProperties (i.e. a map) the value of the map
  are accessible via `self[mapKey]`, map containment can be checked via `mapKey in self` and all
  entries of the map are accessible via CEL macros and functions such as `self.all(...)`.

  ```none
    ...
    openAPIV3Schema:
      type: object
      properties:
        spec:
          type: object
          x-kubernetes-validations:
            - rule: "self['xyz'].foo > 0"
          additionalProperties:
            ...
            type: object
            properties:
              foo:
                type: integer
  ```

- If the Rule is scoped to an array, the elements of the array are accessible via `self[i]` and
  also by macros and functions.

  ```none
    ...
    openAPIV3Schema:
      type: object
      properties:
        ...
        foo:
          type: array
          x-kubernetes-validations:
            - rule: "size(self) == 1"
          items:
            type: string
  ```

- If the Rule is scoped to a scalar, `self` is bound to the scalar value.

  ```none
    ...
    openAPIV3Schema:
      type: object
      properties:
        spec:
          type: object
          properties:
            ...
            foo:
              type: integer
              x-kubernetes-validations:
              - rule: "self > 0"
  ```

Examples:

|type of the field rule scoped to    | Rule example             |
| -----------------------| -----------------------|
| root object            | `self.status.actual <= self.spec.maxDesired` |
| map of objects         | `self.components['Widget'].priority < 10` |
| list of integers       | `self.values.all(value, value >= 0 && value < 100)` |
| string                 | `self.startsWith('kube')` |


The `apiVersion`, `kind`, `metadata.name` and `metadata.generateName` are always accessible from
the root of the object and from any `x-kubernetes-embedded-resource` annotated objects. No other
metadata properties are accessible.

Unknown data preserved in custom resources via `x-kubernetes-preserve-unknown-fields` is not
accessible in CEL expressions. This includes:

- Unknown field values that are preserved by object schemas with `x-kubernetes-preserve-unknown-fields`.
- Object properties where the property schema is of an "unknown type". An "unknown type" is
  recursively defined as:

  - A schema with no type and x-kubernetes-preserve-unknown-fields set to true
  - An array where the items schema is of an "unknown type"
  - An object where the additionalProperties schema is of an "unknown type"


Only property names of the form `[a-zA-Z_.-/][a-zA-Z0-9_.-/]*` are accessible.
Accessible property names are escaped according to the following rules when accessed in the expression:

| escape sequence         | property name equivalent  |
| ----------------------- | -----------------------|
| `__underscores__`       | `__`                  |
| `__dot__`               | `.`                   |
|`__dash__`               | `-`                   |
| `__slash__`             | `/`                   |
| `__{keyword}__`         | [CEL RESERVED keyword](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#syntax)       |

Note: CEL RESERVED keyword needs to match the exact property name to be escaped (e.g. int in the word sprint would not be escaped).

Examples on escaping:

|property name    | rule with escaped property name     |
| ----------------| -----------------------             |
| namespace       | `self.__namespace__ > 0`            |
| x-prop          | `self.x__dash__prop > 0`            |
| redact__d       | `self.redact__underscores__d > 0`   |
| string          | `self.startsWith('kube')`           |


Equality on arrays with `x-kubernetes-list-type` of `set` or `map` ignores element order,
i.e., `[1, 2] == [2, 1]`. Concatenation on arrays with x-kubernetes-list-type use the semantics of
the list type:

- `set`: `X + Y` performs a union where the array positions of all elements in `X` are preserved
  and non-intersecting elements in `Y` are appended, retaining their partial order.

- `map`: `X + Y` performs a merge where the array positions of all keys in `X` are preserved but
  the values are overwritten by values in `Y` when the key sets of `X` and `Y` intersect. Elements
  in `Y` with non-intersecting keys are appended, retaining their partial order.


Here is the declarations type mapping between OpenAPIv3 and CEL type:

| OpenAPIv3 type                                     | CEL type                                                                                                                     |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 'object' with Properties                           | object / "message type"                                                                                                      |
| 'object' with AdditionalProperties                 | map                                                                                                                          |
| 'object' with x-kubernetes-embedded-type           | object / "message type", 'apiVersion', 'kind', 'metadata.name' and 'metadata.generateName' are implicitly included in schema |
| 'object' with x-kubernetes-preserve-unknown-fields | object / "message type", unknown fields are NOT accessible in CEL expression                                                 |
| x-kubernetes-int-or-string                         | dynamic object that is either an int or a string, `type(value)` can be used to check the type                                |
| 'array                                             | list                                                                                                                         |
| 'array' with x-kubernetes-list-type=map            | list with map based Equality & unique key guarantees                                                                         |
| 'array' with x-kubernetes-list-type=set            | list with set based Equality & unique entry guarantees                                                                       |
| 'boolean'                                          | boolean                                                                                                                      |
| 'number' (all formats)                             | double                                                                                                                       |
| 'integer' (all formats)                            | int (64)                                                                                                                     |
| 'null'                                             | null_type                                                                                                                    |
| 'string'                                           | string                                                                                                                       |
| 'string' with format=byte (base64 encoded)         | bytes                                                                                                                        |
| 'string' with format=date                          | timestamp (google.protobuf.Timestamp)                                                                                        |
| 'string' with format=datetime                      | timestamp (google.protobuf.Timestamp)                                                                                        |
| 'string' with format=duration                      | duration (google.protobuf.Duration)                                                                                          |

xref: [CEL types](https://github.com/google/cel-spec/blob/v0.6.0/doc/langdef.md#values),
[OpenAPI types](https://swagger.io/specification/#data-types),
[Kubernetes Structural Schemas](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#specifying-a-structural-schema).

#### The messageExpression field

Similar to the `message` field, which defines the string reported for a validation rule failure, 
`messageExpression` allows you to use a CEL expression to construct the message string.
This allows you to insert more descriptive information into the validation failure message. 
`messageExpression` must evaluate a string and may use the same variables that are available to the `rule` 
field. For example:

```yaml
x-kubernetes-validations:
- rule: "self.x <= self.maxLimit"
  messageExpression: '"x exceeded max limit of " + string(self.maxLimit)'
```

Keep in mind that CEL string concatenation (`+` operator) does not auto-cast to string. If
you have a non-string scalar, use the `string(<value>)` function to cast the scalar to a string
like shown in the above example.

`messageExpression` must evaluate to a string, and this is checked while the CRD is being written. Note that it is possible
to set `message` and `messageExpression` on the same rule, and if both are present, `messageExpression`
will be used. However, if `messageExpression` evaluates to an error, the string defined in `message` 
will be used instead, and the `messageExpression` error will be logged. This fallback will also occur if
the CEL expression defined in `messageExpression` generates an empty string, or a string containing line 
breaks.

If one of the above conditions are met and no `message` has been set, then the default validation failure
message will be used instead.

`messageExpression` is a CEL expression, so the restrictions listed in [Resource use by validation functions](#resource-use-by-validation-functions) apply. If evaluation halts due to resource constraints 
during `messageExpression` execution, then no further validation rules will be executed.

Setting `messageExpression` is optional.

#### The `message` field {#field-message}

If you want to set a static message, you can supply `message` rather than `messageExpression`.
The value of `message` is used as an opaque error string if validation fails.

Setting `message` is optional.

#### The `reason` field {#field-reason}

You can add a machine-readable validation failure reason within a `validation`, to be returned
whenever a request fails this validation rule.

For example:

```yaml
x-kubernetes-validations:
- rule: "self.x <= self.maxLimit"
  reason: "FieldValueInvalid"
```

The HTTP status code returned to the caller will match the reason of the first failed validation rule.
The currently supported reasons are: "FieldValueInvalid", "FieldValueForbidden", "FieldValueRequired", "FieldValueDuplicate".
If not set or unknown reasons, default to use "FieldValueInvalid".

Setting `reason` is optional.

#### The `fieldPath` field {#field-field-path}

You can specify the field path returned when the validation fails.

For example:

```yaml
x-kubernetes-validations:
- rule: "self.foo.test.x <= self.maxLimit"
  fieldPath: ".foo.test.x"
```

In the example above, the validation checks the value of field `x` should be less than the value of `maxLimit`.
If no `fieldPath` specified, when validation fails, the fieldPath would be default to wherever `self` scoped.
With `fieldPath` specified, the returned error will have `fieldPath` properly refer to the location of field `x`.

The `fieldPath` value must be a relative JSON path that is scoped to the location of this x-kubernetes-validations extension in the schema. 
Additionally, it should refer to an existing field within the schema.
For example when validation checks if a specific attribute `foo` under a map `testMap`, you could set
`fieldPath` to `".testMap.foo"` or `.testMap['foo']'`.
If the validation requires checking for unique attributes in two lists, the fieldPath can be set to either of the lists. 
For example, it can be set to `.testList1` or `.testList2`.
It supports child operation to refer to an existing field currently. 
Refer to [JSONPath support in Kubernetes](/docs/reference/kubectl/jsonpath/) for more info.
The `fieldPath` field does not support indexing arrays numerically.

Setting `fieldPath` is optional.

#### The `optionalOldSelf` field {#field-optional-oldself}

{{< feature-state feature_gate_name="CRDValidationRatcheting" >}}

If your cluster does not have [CRD validation ratcheting](#validation-ratcheting) enabled, 
the CustomResourceDefinition API doesn't include this field, and trying to set it may result
in an error.

The `optionalOldSelf` field is a boolean field that alters the behavior of [Transition Rules](#transition-rules) described
below. Normally, a transition rule will not evaluate if `oldSelf` cannot be determined:
during object creation or when a new value is introduced in an update.

If `optionalOldSelf` is set to true, then transition rules will always be 
evaluated and the type of `oldSelf` be changed to a CEL [`Optional`](https://pkg.go.dev/github.com/google/cel-go/cel#OptionalTypes) type. 

`optionalOldSelf` is useful in cases where schema authors would like a more
control tool [than provided by the default equality based behavior of](#validation-ratcheting)
to introduce newer, usually stricter constraints on new values, while still 
allowing old values to be "grandfathered" or ratcheted using the older validation.

Example Usage:

| CEL                                     | Description |
|-----------------------------------------|-------------|
| `self.foo == "foo" || (oldSelf.hasValue() && oldSelf.value().foo != "foo")` | Ratcheted rule. Once a value is set to "foo", it must stay foo. But if it existed before the "foo" constraint was introduced, it may use any value |
| [oldSelf.orValue(""), self].all(x, ["OldCase1", "OldCase2"].exists(case, x == case)) || ["NewCase1", "NewCase2"].exists(case, self == case) || ["NewCase"].has(self)` | "Ratcheted validation for removed enum cases if oldSelf used them" |
| oldSelf.optMap(o, o.size()).orValue(0) < 4 || self.size() >= 4 | Ratcheted validation of newly increased minimum map or list size |


#### Validation functions {#available-validation-functions}

Functions available include:

- CEL standard functions, defined in the [list of standard definitions](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#list-of-standard-definitions)
- CEL standard [macros](https://github.com/google/cel-spec/blob/v0.7.0/doc/langdef.md#macros)
- CEL [extended string function library](https://pkg.go.dev/github.com/google/cel-go@v0.11.2/ext#Strings)
- Kubernetes [CEL extension library](https://pkg.go.dev/k8s.io/apiextensions-apiserver@v0.24.0/pkg/apiserver/schema/cel/library#pkg-functions)

#### Transition rules

A rule that contains an expression referencing the identifier `oldSelf` is implicitly considered a
_transition rule_. Transition rules allow schema authors to prevent certain transitions between two
otherwise valid states. For example:

```yaml
type: string
enum: ["low", "medium", "high"]
x-kubernetes-validations:
- rule: "!(self == 'high' && oldSelf == 'low') && !(self == 'low' && oldSelf == 'high')"
  message: cannot transition directly between 'low' and 'high'
```

Unlike other rules, transition rules apply only to operations meeting the following criteria:

- The operation updates an existing object. Transition rules never apply to create operations.

- Both an old and a new value exist. It remains possible to check if a value has been added or
  removed by placing a transition rule on the parent node. Transition rules are never applied to
  custom resource creation. When placed on an optional field, a transition rule will not apply to
  update operations that set or unset the field.

- The path to the schema node being validated by a transition rule must resolve to a node that is
  comparable between the old object and the new object. For example, list items and their
  descendants (`spec.foo[10].bar`) can't necessarily be correlated between an existing object and a
  later update to the same object.

Errors will be generated on CRD writes if a schema node contains a transition rule that can never be
applied, e.g. "oldSelf cannot be used on the uncorrelatable portion of the schema within *path*".

Transition rules are only allowed on _correlatable portions_ of a schema.
A portion of the schema is correlatable if all `array` parent schemas are of type `x-kubernetes-list-type=map`;
any `set`or `atomic`array parent schemas make it impossible to unambiguously correlate a `self` with `oldSelf`.

Here are some examples for transition rules:

{{< table caption="Transition rules examples" >}}
| Use Case                                                          | Rule
| --------                                                          | --------
| Immutability                                                      | `self.foo == oldSelf.foo`
| Prevent modification/removal once assigned                        | `oldSelf != 'bar' \|\| self == 'bar'` or `!has(oldSelf.field) \|\| has(self.field)`
| Append-only set                                                   | `self.all(element, element in oldSelf)`
| If previous value was X, new value can only be A or B, not Y or Z | `oldSelf != 'X' \|\| self in ['A', 'B']`
| Monotonic (non-decreasing) counters                               | `self >= oldSelf`
{{< /table >}}

#### Resource use by validation functions

When you create or update a CustomResourceDefinition that uses validation rules,
the API server checks the likely impact of running those validation rules. If a rule is
estimated to be prohibitively expensive to execute, the API server rejects the create
or update operation, and returns an error message.
A similar system is used at runtime that observes the actions the interpreter takes. If the interpreter executes
too many instructions, execution of the rule will be halted, and an error will result.
Each CustomResourceDefinition is also allowed a certain amount of resources to finish executing all of
its validation rules. If the sum total of its rules are estimated at creation time to go over that limit,
then a validation error will also occur.

You are unlikely to encounter issues with the resource budget for validation if you only
specify rules that always take the same amount of time regardless of how large their input is.
For example, a rule that asserts that `self.foo == 1` does not by itself have any
risk of rejection on validation resource budget groups.
But if `foo` is a string and you define a validation rule `self.foo.contains("someString")`, that rule takes
longer to execute depending on how long `foo` is.
Another example would be if `foo` were an array, and you specified a validation rule `self.foo.all(x, x > 5)`.
The cost system always assumes the worst-case scenario if a limit on the length of `foo` is not
given, and this will happen for anything that can be iterated over (lists, maps, etc.).

Because of this, it is considered best practice to put a limit via `maxItems`, `maxProperties`, and
`maxLength` for anything that will be processed in a validation rule in order to prevent validation
errors during cost estimation. For example, given this schema with one rule:

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      items:
        type: string
      x-kubernetes-validations:
        - rule: "self.all(x, x.contains('a string'))"
```

then the API server rejects this rule on validation budget grounds with error:

```
spec.validation.openAPIV3Schema.properties[spec].properties[foo].x-kubernetes-validations[0].rule: Forbidden:
CEL rule exceeded budget by more than 100x (try simplifying the rule, or adding maxItems, maxProperties, and
maxLength where arrays, maps, and strings are used)
```

The rejection happens because `self.all` implies calling `contains()` on every string in `foo`,
which in turn will check the given string to see if it contains `'a string'`. Without limits, this
is a very expensive rule.

If you do not specify any validation limit, the estimated cost of this rule will exceed the
per-rule cost limit. But if you add limits in the appropriate places, the rule will be allowed:

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      maxItems: 25
      items:
        type: string
        maxLength: 10
      x-kubernetes-validations:
        - rule: "self.all(x, x.contains('a string'))"
```

The cost estimation system takes into account how many times the rule will be executed in addition to the
estimated cost of the rule itself. For instance, the following rule will have the same estimated cost as the
previous example (despite the rule now being defined on the individual array items):

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      maxItems: 25
      items:
        type: string
        x-kubernetes-validations:
          - rule: "self.contains('a string'))"
        maxLength: 10
```

If a list inside of a list has a validation rule that uses `self.all`, that is significantly more expensive
than a non-nested list with the same rule. A rule that would have been allowed on a non-nested list might need
lower limits set on both nested lists in order to be allowed. For example, even without having limits set,
the following rule is allowed:

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      items:
        type: integer
    x-kubernetes-validations:
      - rule: "self.all(x, x == 5)"
```

But the same rule on the following schema (with a nested array added) produces a validation error:

```yaml
openAPIV3Schema:
  type: object
  properties:
    foo:
      type: array
      items:
        type: array
        items:
          type: integer
        x-kubernetes-validations:
          - rule: "self.all(x, x == 5)"
```

This is because each item of `foo` is itself an array, and each subarray in turn calls `self.all`.
Avoid nested lists and maps if possible where validation rules are used.

### Defaulting

{{< note >}}
To use defaulting, your CustomResourceDefinition must use API version `apiextensions.k8s.io/v1`.
{{< /note >}}

Defaulting allows to specify default values in the [OpenAPI v3 validation schema](#validation):

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        # openAPIV3Schema is the schema for validating custom objects.
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                  pattern: '^(\d+|\*)(/\d+)?(\s+(\d+|\*)(/\d+)?){4}$'
                  default: "5 0 * * *"
                image:
                  type: string
                replicas:
                  type: integer
                  minimum: 1
                  maximum: 10
                  default: 1
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

With this both `cronSpec` and `replicas` are defaulted:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  image: my-awesome-cron-image
```

leads to

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "5 0 * * *"
  image: my-awesome-cron-image
  replicas: 1
```

Defaulting happens on the object

* in the request to the API server using the request version defaults,
* when reading from etcd using the storage version defaults,
* after mutating admission plugins with non-empty patches using the admission webhook object version defaults.

Defaults applied when reading data from etcd are not automatically written back to etcd.
An update request via the API is required to persist those defaults back into etcd.

Default values must be pruned (with the exception of defaults for `metadata` fields) and must
validate against a provided schema.

Default values for `metadata` fields of `x-kubernetes-embedded-resources: true` nodes (or parts of
a default value covering `metadata`) are not pruned during CustomResourceDefinition creation, but
through the pruning step during handling of requests.

#### Defaulting and Nullable

Null values for fields that either don't specify the nullable flag, or give it a
`false` value, will be pruned before defaulting happens. If a default is present, it will be
applied. When nullable is `true`, null values will be conserved and won't be defaulted.

For example, given the OpenAPI schema below:

```yaml
type: object
properties:
  spec:
    type: object
    properties:
      foo:
        type: string
        nullable: false
        default: "default"
      bar:
        type: string
        nullable: true
      baz:
        type: string
```

creating an object with null values for `foo` and `bar` and `baz`

```yaml
spec:
  foo: null
  bar: null
  baz: null
```

leads to

```yaml
spec:
  foo: "default"
  bar: null
```

with `foo` pruned and defaulted because the field is non-nullable, `bar` maintaining the null
value due to `nullable: true`, and `baz` pruned because the field is non-nullable and has no
default.

### Publish Validation Schema in OpenAPI

CustomResourceDefinition [OpenAPI v3 validation schemas](#validation) which are
[structural](#specifying-a-structural-schema) and [enable pruning](#field-pruning) are published
as [OpenAPI v3](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions) and
OpenAPI v2 from Kubernetes API server. It is recommended to use the OpenAPI v3 document
as it is a lossless representation of the CustomResourceDefinition OpenAPI v3 validation schema
while OpenAPI v2 represents a lossy conversion.

The [kubectl](/docs/reference/kubectl/) command-line tool consumes the published schema to perform
client-side validation (`kubectl create` and `kubectl apply`), schema explanation (`kubectl explain`)
on custom resources. The published schema can be consumed for other purposes as well, like client generation or documentation.

#### Compatibility with OpenAPI V2

For compatibility with OpenAPI V2, the OpenAPI v3 validation schema performs a lossy conversion
to the OpenAPI v2 schema. The schema show up in `definitions` and `paths` fields in the
[OpenAPI v2 spec](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions).

The following modifications are applied during the conversion to keep backwards compatibility with
kubectl in previous 1.13 version. These modifications prevent kubectl from being over-strict and rejecting
valid OpenAPI schemas that it doesn't understand. The conversion won't modify the validation schema defined in CRD,
and therefore won't affect [validation](#validation) in the API server.

1. The following fields are removed as they aren't supported by OpenAPI v2.

   - The fields `allOf`, `anyOf`, `oneOf` and `not` are removed

2. If `nullable: true` is set, we drop `type`, `nullable`, `items` and `properties` because OpenAPI v2 is
   not able to express nullable. To avoid kubectl to reject good objects, this is necessary.

### Additional printer columns

The kubectl tool relies on server-side output formatting. Your cluster's API server decides which
columns are shown by the `kubectl get` command. You can customize these columns for a
CustomResourceDefinition. The following example adds the `Spec`, `Replicas`, and `Age`
columns.

Save the CustomResourceDefinition to `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              cronSpec:
                type: string
              image:
                type: string
              replicas:
                type: integer
    additionalPrinterColumns:
    - name: Spec
      type: string
      description: The cron spec defining the interval a CronJob is run
      jsonPath: .spec.cronSpec
    - name: Replicas
      type: integer
      description: The number of jobs launched by the CronJob
      jsonPath: .spec.replicas
    - name: Age
      type: date
      jsonPath: .metadata.creationTimestamp
```

Create the CustomResourceDefinition:

```shell
kubectl apply -f resourcedefinition.yaml
```

Create an instance using the `my-crontab.yaml` from the previous section.

Invoke the server-side printing:

```shell
kubectl get crontab my-new-cron-object
```

Notice the `NAME`, `SPEC`, `REPLICAS`, and `AGE` columns in the output:

```
NAME                 SPEC        REPLICAS   AGE
my-new-cron-object   * * * * *   1          7s
```

{{< note >}}
The `NAME` column is implicit and does not need to be defined in the CustomResourceDefinition.
{{< /note >}}


#### Priority

Each column includes a `priority` field. Currently, the priority
differentiates between columns shown in standard view or wide view (using the `-o wide` flag).

- Columns with priority `0` are shown in standard view.
- Columns with priority greater than `0` are shown only in wide view.

#### Type

A column's `type` field can be any of the following (compare
[OpenAPI v3 data types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#dataTypes)):

- `integer` – non-floating-point numbers
- `number` – floating point numbers
- `string` – strings
- `boolean` – `true` or `false`
- `date` – rendered differentially as time since this timestamp.

If the value inside a CustomResource does not match the type specified for the column,
the value is omitted. Use CustomResource validation to ensure that the value
types are correct.

#### Format

A column's `format` field can be any of the following:

- `int32`
- `int64`
- `float`
- `double`
- `byte`
- `date`
- `date-time`
- `password`

The column's `format` controls the style used when `kubectl` prints the value.

### Field selectors

[Field Selectors](/docs/concepts/overview/working-with-objects/field-selectors/)
let clients select custom resources based on the value of one or more resource
fields.

All custom resources support the `metadata.name` and `metadata.namespace` field
selectors.

Fields declared in a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}
may also be used with field selectors when included in the `spec.versions[*].selectableFields` field of the
{{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}}.

#### Selectable fields for custom resources {#crd-selectable-fields}

{{< feature-state feature_gate_name="CustomResourceFieldSelectors" >}}

For Kubernetes {{< skew currentVersion >}} the ability to define field selectors for
custom resources is available by default (enabled by default since Kubernetes v1.31);
you can disable it for your cluster  by turning off the `CustomResourceFieldSelectors`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
The `spec.versions[*].selectableFields` field of a {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} may be used to
declare which other fields in a custom resource may be used in field selectors
with the feature of `CustomResourceFieldSelectors`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) (This feature gate is enabled by default since Kubernetes v1.31).
The following example adds the `.spec.color` and `.spec.size` fields as
selectable fields.

Save the CustomResourceDefinition to `shirt-resource-definition.yaml`:

{{% code_sample file="customresourcedefinition/shirt-resource-definition.yaml" %}}

Create the CustomResourceDefinition:

```shell
kubectl apply -f https://k8s.io/examples/customresourcedefinition/shirt-resource-definition.yaml
```

Define some Shirts by editing `shirt-resources.yaml`; for example:

{{% code_sample file="customresourcedefinition/shirt-resources.yaml" %}}

Create the custom resources:

```shell
kubectl apply -f https://k8s.io/examples/customresourcedefinition/shirt-resources.yaml
```

Get all the resources:

```shell
kubectl get shirts.stable.example.com
```

The output is:

```
NAME       COLOR  SIZE
example1   blue   S
example2   blue   M
example3   green  M
```

Fetch blue shirts (retrieve Shirts with a `color` of `blue`):

```shell
kubectl get shirts.stable.example.com --field-selector spec.color=blue
```

Should output:

```
NAME       COLOR  SIZE
example1   blue   S
example2   blue   M
```

Get only resources with a `color` of `green` and a `size` of `M`:

```shell
kubectl get shirts.stable.example.com --field-selector spec.color=green,spec.size=M
```

Should output:

```
NAME       COLOR  SIZE
example2   blue   M
```

### Subresources

Custom resources support `/status` and `/scale` subresources.

The status and scale subresources can be optionally enabled by
defining them in the CustomResourceDefinition.

#### Status subresource

When the status subresource is enabled, the `/status` subresource for the custom resource is exposed.

- The status and the spec stanzas are represented by the `.status` and `.spec` JSONPaths
  respectively inside of a custom resource.
- `PUT` requests to the `/status` subresource take a custom resource object and ignore changes to
  anything except the status stanza.
- `PUT` requests to the `/status` subresource only validate the status stanza of the custom
  resource.
- `PUT`/`POST`/`PATCH` requests to the custom resource ignore changes to the status stanza.
- The `.metadata.generation` value is incremented for all changes, except for changes to
  `.metadata` or `.status`.
- Only the following constructs are allowed at the root of the CRD OpenAPI validation schema:

  - `description`
  - `example`
  - `exclusiveMaximum`
  - `exclusiveMinimum`
  - `externalDocs`
  - `format`
  - `items`
  - `maximum`
  - `maxItems`
  - `maxLength`
  - `minimum`
  - `minItems`
  - `minLength`
  - `multipleOf`
  - `pattern`
  - `properties`
  - `required`
  - `title`
  - `type`
  - `uniqueItems`

#### Scale subresource

When the scale subresource is enabled, the `/scale` subresource for the custom resource is exposed.
The `autoscaling/v1.Scale` object is sent as the payload for `/scale`.

To enable the scale subresource, the following fields are defined in the CustomResourceDefinition.

- `specReplicasPath` defines the JSONPath inside of a custom resource that corresponds to `scale.spec.replicas`.

  - It is a required value.
  - Only JSONPaths under `.spec` and with the dot notation are allowed.
  - If there is no value under the `specReplicasPath` in the custom resource,
    the `/scale` subresource will return an error on GET.

- `statusReplicasPath` defines the JSONPath inside of a custom resource that corresponds to `scale.status.replicas`.

  - It is a required value.
  - Only JSONPaths under `.status` and with the dot notation are allowed.
  - If there is no value under the `statusReplicasPath` in the custom resource,
    the status replica value in the `/scale` subresource will default to 0.

- `labelSelectorPath` defines the JSONPath inside of a custom resource that corresponds to
  `Scale.Status.Selector`.

  - It is an optional value.
  - It must be set to work with HPA and VPA.
  - Only JSONPaths under `.status` or `.spec` and with the dot notation are allowed.
  - If there is no value under the `labelSelectorPath` in the custom resource,
    the status selector value in the `/scale` subresource will default to the empty string.
  - The field pointed by this JSON path must be a string field (not a complex selector struct)
    which contains a serialized label selector in string form.

In the following example, both status and scale subresources are enabled.

Save the CustomResourceDefinition to `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
            status:
              type: object
              properties:
                replicas:
                  type: integer
                labelSelector:
                  type: string
      # subresources describes the subresources for custom resources.
      subresources:
        # status enables the status subresource.
        status: {}
        # scale enables the scale subresource.
        scale:
          # specReplicasPath defines the JSONPath inside of a custom resource that corresponds to Scale.Spec.Replicas.
          specReplicasPath: .spec.replicas
          # statusReplicasPath defines the JSONPath inside of a custom resource that corresponds to Scale.Status.Replicas.
          statusReplicasPath: .status.replicas
          # labelSelectorPath defines the JSONPath inside of a custom resource that corresponds to Scale.Status.Selector.
          labelSelectorPath: .status.labelSelector
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
```

And create it:

```shell
kubectl apply -f resourcedefinition.yaml
```

After the CustomResourceDefinition object has been created, you can create custom objects.

If you save the following YAML to `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
  replicas: 3
```

and create it:

```shell
kubectl apply -f my-crontab.yaml
```

Then new namespaced RESTful API endpoints are created at:

```none
/apis/stable.example.com/v1/namespaces/*/crontabs/status
```

and

```none
/apis/stable.example.com/v1/namespaces/*/crontabs/scale
```

A custom resource can be scaled using the `kubectl scale` command.
For example, the following command sets `.spec.replicas` of the
custom resource created above to 5:

```shell
kubectl scale --replicas=5 crontabs/my-new-cron-object
crontabs "my-new-cron-object" scaled

kubectl get crontabs my-new-cron-object -o jsonpath='{.spec.replicas}'
5
```

You can use a [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/) to protect custom
resources that have the scale subresource enabled.

### Categories

Categories is a list of grouped resources the custom resource belongs to (eg. `all`).
You can use `kubectl get <category-name>` to list the resources belonging to the category.

The following example adds `all` in the list of categories in the CustomResourceDefinition
and illustrates how to output the custom resource using `kubectl get all`.

Save the following CustomResourceDefinition to `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
    # categories is a list of grouped resources the custom resource belongs to.
    categories:
    - all
```

and create it:

```shell
kubectl apply -f resourcedefinition.yaml
```

After the CustomResourceDefinition object has been created, you can create custom objects.

Save the following YAML to `my-crontab.yaml`:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
```

and create it:

```shell
kubectl apply -f my-crontab.yaml
```

You can specify the category when using `kubectl get`:

```shell
kubectl get all
```

and it will include the custom resources of kind `CronTab`:

```none
NAME                          AGE
crontabs/my-new-cron-object   3s
```

## {{% heading "whatsnext" %}}

* Read about [custom resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

* See [CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1-apiextensions-k8s-io).

* Serve [multiple versions](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/) of a
  CustomResourceDefinition.
