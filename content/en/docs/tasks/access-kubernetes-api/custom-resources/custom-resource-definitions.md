---
title: Extend the Kubernetes API with CustomResourceDefinitions
reviewers:
- deads2k
- enisoc
- sttts
content_template: templates/task
weight: 20
---

{{% capture overview %}}
This page shows how to install a
[custom resource](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
into the Kubernetes API by creating a
[CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions).
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Make sure your Kubernetes cluster has a master version of 1.7.0 or higher.

* Read about [custom resources](/docs/concepts/api-extension/custom-resources/).

{{% /capture %}}

{{% capture steps %}}
## Create a CustomResourceDefinition

When you create a new CustomResourceDefinition (CRD), the Kubernetes API Server
creates a new RESTful resource path for each version you specify. The CRD can be
either namespaced or cluster-scoped, as specified in the CRD's `scope` field. As
with existing built-in objects, deleting a namespace deletes all custom objects
in that namespace. CustomResourceDefinitions themselves are non-namespaced and
are available to all namespaces.

For example, if you save the following CustomResourceDefinition to `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
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
  preserveUnknownFields: false
  validation:
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
```

And create it:

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

```console
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
from the yaml you used to create it:

```console
apiVersion: v1
kind: List
items:
- apiVersion: stable.example.com/v1
  kind: CronTab
  metadata:
    creationTimestamp: 2017-05-31T12:56:35Z
    generation: 1
    name: my-new-cron-object
    namespace: default
    resourceVersion: "285"
    selfLink: /apis/stable.example.com/v1/namespaces/default/crontabs/my-new-cron-object
    uid: 9423255b-4600-11e7-af6a-28d2447dc82b
  spec:
    cronSpec: '* * * * */5'
    image: my-awesome-cron-image
metadata:
  resourceVersion: ""
  selfLink: ""
```

## Delete a CustomResourceDefinition

When you delete a CustomResourceDefinition, the server will uninstall the RESTful API  endpoint
and **delete all custom objects stored in it**.

```shell
kubectl delete -f resourcedefinition.yaml
kubectl get crontabs
```

```console
Error from server (NotFound): Unable to list {"stable.example.com" "v1" "crontabs"}: the server could not find the requested resource (get crontabs.stable.example.com)
```

If you later recreate the same CustomResourceDefinition, it will start out empty.

## Specifying a structural schema

{{< feature-state state="beta" for_kubernetes_version="1.15" >}}

CustomResources traditionally store arbitrary JSON (next to `apiVersion`, `kind` and `metadata`, which is validated by the API server implicitly). With [OpenAPI v3.0 validation](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#validation) a schema can be specified, which is validated during creation and updates, compare below for details and limits of such a schema.

With `apiextensions.k8s.io/v1` the definition of a structural schema will be mandatory for CustomResourceDefinitions, while in `v1beta1` this is still optional.

A structural schema is an [OpenAPI v3.0 validation schema](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#validation) which:

1. specifies a non-empty type (via `type` in OpenAPI) for the root, for each specified field of an object node (via `properties` or `additionalProperties` in OpenAPI) and for each item in an array node (via `items` in OpenAPI), with the exception of:
   * a node with `x-kubernetes-int-or-string: true`
   * a node with `x-kubernetes-preserve-unknown-fields: true`
2. for each each field in an object and each item in an array which is specified within any of `allOf`, `anyOf`, `oneOf` or `not`, the schema also specifies the field/item outside of those logical junctors (compare example 1 and 2).
3. does not set `description`, `type`, `default`, `additionProperties`, `nullable` within an `allOf`, `anyOf`, `oneOf` or `not`, with the exception of the two pattern for `x-kubernetes-int-or-string: true` (see below).
4. if `metadata` is specified, then only restrictions on `metadata.name` and `metadata.generateName` are allowed. 


Non-Structural Example 1: 
```yaml
allOf:
- properties:
    foo:
      ...
```
conflicts with rule 2. The following would be correct:
```yaml
properties:
  foo:
    ...
allOf:
- properties:
    foo:
      ...
```

Non-Structural Example 2:
```yaml
allOf:
- items:
    properties:
      foo:
        ...
```
conflicts with rule 2. The following would be correct:
```yaml
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

Non-Structural Example 3:
```yaml
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
* `metadata.finalizer` might not be restricted (rule 4). 

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

Violations of the structural schema rules are reported in the `NonStructural` condition in the CustomResourceDefinition.

Not being structural disables the following features:

* [Validation Schema Publishing](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#publish-validation-schema-in-openapi-v2)
* [Webhook Conversion](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definition-versioning/#webhook-conversion)
* [Validation Schema Defaulting](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#defaulting)
* [Pruning](#preserving-unknown-fields)

and possibly more features in the future.

### Pruning versus preserving unknown fields

{{< feature-state state="beta" for_kubernetes_version="1.15" >}}

CustomResourceDefinitions traditionally store any (possibly validated) JSON as is in etcd. This means that unspecified fields (if there is a [OpenAPI v3.0 validation schema](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#validation) at all) are persisted. This is in contrast to native Kubernetes resources like e.g. a pod where unknown fields are dropped before being persisted to etcd. We call this "pruning" of unknown fields.
 
If a [structural OpenAPI v3 validation schema](#specifying-a-structural-schema) is defined (either in the global `spec.validation.openAPIV3Schema` or for each version) in a CustomResourceDefinition, pruning can be enabled by setting `spec.preserveUnknownFields` to `false`. Then unspecified fields on creation and on update are dropped.

Compare the CustomResourceDefinition `crontabs.stable.example.com` above. It has pruning enabled. Hence, if you save the following YAML to `my-crontab.yaml`:

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

you should get:

```console
apiVersion: stable.example.com/v1
kind: CronTab
metadata:
  creationTimestamp: 2017-05-31T12:56:35Z
  generation: 1
  name: my-new-cron-object
  namespace: default
  resourceVersion: "285"
  selfLink: /apis/stable.example.com/v1/namespaces/default/crontabs/my-new-cron-object
  uid: 9423255b-4600-11e7-af6a-28d2447dc82b
spec:
  cronSpec: '* * * * */5'
  image: my-awesome-cron-image
```

The field `someRandomField` has been pruned.

Note that the `kubectl create` call uses `--validate=false` to skip client-side validation. Because the [OpenAPI validation schemas are also published](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#publish-validation-schema-in-openapi-v2) to kubectl, it will also check for unknown fields and reject those objects long before they are sent to the API server.

In `apiextensions.k8s.io/v1beta1`, pruning is disabled by default, i.e. `spec.preserveUnknownFields` defaults to `true`. In `apiextensions.k8s.io/v1` no new CustomResourceDefinitions with `spec.preserveUnknownFields: true` will be allowed to be created.

### Controlling pruning

With `spec.preserveUnknownField: false` in the CustomResourceDefinition, pruning is enabled for all custom resources of that type and in all versions. It is possible though to opt-out of that for JSON sub-trees via `x-kubernetes-preserve-unknown-fields: true` in the [structural OpenAPI v3 validation schema](#specifying-a-structural-schema):

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
```

The field `json` can store any JSON value, without anything being pruned.

It is possible to partially specify the permitted JSON, e.g.:

```yaml
type: object
properties:
  json:
    x-kubernetes-preserve-unknown-fields: true
    type: object
    description: this is arbitrary JSON
```

With this only object type values are allowed.

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

Nodes in a schema with `x-kubernetes-int-or-string: true` are excluded from rule 1, such that the following is structural:

```yaml
type: object
properties:
  foo:
    x-kubernetes-int-or-string: true
``` 
 
Also those nodes are partially excluded from rule 3 in the sense that the following two patterns are allowed (exactly those, without variations in order to additional fields):

```yaml
x-kubernetes-int-or-string: true
anyOf:
- type: integer
- type: string
...
``` 

and

```yaml
x-kubernetes-int-or-string: true
allOf:
- anyOf:
  - type: integer
  - type: string
- ... # zero or more
...
``` 

With one of those specification, both an integer and a string validate.

In [Validation Schema Publishing](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#publish-validation-schema-in-openapi-v2), `x-kubernetes-int-or-string: true` is unfolded to one of the two patterns shown above.

### RawExtension

RawExtensions (as in `runtime.RawExtension` defined in [k8s.io/apimachinery](https://github.com/kubernetes/apimachinery/blob/03ac7a9ade429d715a1a46ceaa3724c18ebae54f/pkg/runtime/types.go#L94)) holds complete Kubernetes objects, i.e. with `apiVersion` and `kind` fields.

It is possible to specify those embedded objects (both completely without constraints or partially specified) by setting `x-kubernetes-embedded-resource: true`. For example:

```yaml
type: object
properties:
  foo:
    x-kubernetes-embedded-resource: true
    x-kubernetes-preserve-unknown-fields: true
```

Here, the field `foo` holds a complete object, e.g.:

```yaml
foo:
  apiVersion: v1
  kind: Pod
  spec:
    ...
```

Because `x-kubernetes-preserve-unknown-fields: true` is specified alongside, nothing is pruned. The use of `x-kubernetes-preserve-unknown-fields: true` is optional though.

With `x-kubernetes-embedded-resource: true`, the `apiVersion`, `kind` and `metadata` are implicitly specified and validated.

## Serving multiple versions of a CRD

See [Custom resource definition versioning](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definition-versioning/)
for more information about serving multiple versions of your
CustomResourceDefinition and migrating your objects from one version to another.

{{% /capture %}}

{{% capture discussion %}}
## Advanced topics

### Finalizers

*Finalizers* allow controllers to implement asynchronous pre-delete hooks.
Custom objects support finalizers just like built-in objects.

You can add a finalizer to a custom object like this:

```yaml
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  finalizers:
  - finalizer.stable.example.com
```

Finalizers are arbitrary string values, that when present ensure that a hard delete
of a resource is not possible while they exist.

The first delete request on an object with finalizers sets a value for the
`metadata.deletionTimestamp` field but does not delete it. Once this value is set,
entries in the `finalizer` list can only be removed.

When the `metadata.deletionTimestamp` field is set, controllers watching the object
execute any finalizers they handle, by polling update requests for that
object. When all finalizers have been executed, the resource is deleted.

The value of `metadata.deletionGracePeriodSeconds` controls the interval between
polling updates.

It is the responsibility of each controller to removes its finalizer from the list.

Kubernetes only finally deletes the object if the list of finalizers is empty,
meaning all finalizers have been executed.

### Validation

{{< feature-state state="beta" for_kubernetes_version="1.9" >}}

Validation of custom objects is possible via
[OpenAPI v3 schema](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#schemaObject) or [validatingadmissionwebhook](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook).
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
- The field `uniqueItems` cannot be set to true.
- The field `additionalProperties` cannot be set to false.
- The field `additionalProperties` is mutually exclusive with `properties`.

These fields can only be set with specific features enabled:

- `default`: the `CustomResourceDefaulting` feature gate must be enabled, compare [Validation Schema Defaulting](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#defaulting).

Note: compare with [structural schemas](#specifying-a-structural-schema) for further restriction required for certain CustomResourceDefinition features.

{{< note >}}
OpenAPI v3 validation is available as beta. The
`CustomResourceValidation` feature must be enabled, which is the case automatically for many clusters for beta features. Please refer to the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) documentation for more information.
{{< /note >}}

The schema is defined in the CustomResourceDefinition. In the following example, the
CustomResourceDefinition applies the following validations on the custom object:

- `spec.cronSpec` must be a string and must be of the form described by the regular expression.
- `spec.replicas` must be an integer and must have a minimum value of 1 and a maximum value of 10.

Save the CustomResourceDefinition to `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  version: v1
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
  validation:
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
            replicas:
              type: integer
              minimum: 1
              maximum: 10
```

And create it:

```shell
kubectl apply -f resourcedefinition.yaml
```

A request to create a custom object of kind `CronTab` will be rejected if there are invalid values in its fields.
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

and create it:

```shell
kubectl apply -f my-crontab.yaml
```

you will get an error:

```console
The CronTab "my-new-cron-object" is invalid: []: Invalid value: map[string]interface {}{"apiVersion":"stable.example.com/v1", "kind":"CronTab", "metadata":map[string]interface {}{"name":"my-new-cron-object", "namespace":"default", "deletionTimestamp":interface {}(nil), "deletionGracePeriodSeconds":(*int64)(nil), "creationTimestamp":"2017-09-05T05:20:07Z", "uid":"e14d79e7-91f9-11e7-a598-f0761cb232d1", "selfLink":"", "clusterName":""}, "spec":map[string]interface {}{"cronSpec":"* * * *", "image":"my-awesome-cron-image", "replicas":15}}:
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

### Defaulting

{{< feature-state state="alpha" for_kubernetes_version="1.15" >}}

{{< note >}}
Defaulting is available as alpha since 1.15. It is disabled by default and can be enabled via the `CustomResourceDefaulting` feature gate. Please refer to the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) documentation for more information.

Defaulting also requires a structural schema and pruning. 
{{< /note >}}

Defaulting allows to specify default values in the [OpenAPI v3 validation schema](#validation):

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  version: v1
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
  preserveUnknownFields: false
  validation:
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
  replaces: 1
```

Note that defaulting happens on the object
 
* in the request to the API server using the request version defaults
* when reading from etcd using the storage version defaults
* after mutating admission plugins with non-empty patches using the admission webhook object version defaults.

Note that defaults applied when reading data from etcd are not automatically written back to etcd. An update request via the API is required to persist those defaults back into etcd.

### Publish Validation Schema in OpenAPI v2

{{< feature-state state="beta" for_kubernetes_version="1.15" >}}

{{< note >}}
OpenAPI v2 Publishing is available as beta since 1.15, and as alpha since 1.14. The
`CustomResourcePublishOpenAPI` feature must be enabled, which is the case automatically for many clusters for beta features. Please refer to the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) documentation for more information.
{{< /note >}}

With the OpenAPI v2 Publishing feature enabled, CustomResourceDefinition [OpenAPI v3 validation schemas](#validation) which are [structural](#specifying-a-structural-schema) are published as part
of the [OpenAPI v2 spec](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions) from Kubernetes API server.

[kubectl](/docs/reference/kubectl/overview) consumes the published schema to perform client-side validation (`kubectl create` and `kubectl apply`), schema explanation (`kubectl explain`) on custom resources. The published schema can be consumed for other purposes as well, like client generation or documentation. 

The OpenAPI v3 validation schema is converted to OpenAPI v2 schema, and
show up in `definitions` and `paths` fields in the [OpenAPI v2 spec](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions).
The following modifications are applied during the conversion to keep backwards compatiblity with
kubectl in previous 1.13 version. These modifications prevent kubectl from being over-strict and rejecting
valid OpenAPI schemas that it doesn't understand. The conversion won't modify the validation schema defined in CRD,
and therefore won't affect [validation](#validation) in the API server.

1. The following fields are removed as they aren't supported by OpenAPI v2 (in future versions OpenAPI v3 will be used without these restrictions)
   - The fields `allOf`, `anyOf`, `oneOf` and `not` are removed
2. If `nullable: true` is set, we drop `type`, `nullable`, `items` and `properties` because OpenAPI v2 is not able to express nullable. To avoid kubectl to reject good objects, this is necessary.

### Additional printer columns

Starting with Kubernetes 1.11, kubectl uses server-side printing. The server decides which
columns are shown by the `kubectl get` command. You can customize these columns using a
CustomResourceDefinition. The following example adds the `Spec`, `Replicas`, and `Age`
columns.

1.  Save the CustomResourceDefinition to `resourcedefinition.yaml`.
      ```yaml
      apiVersion: apiextensions.k8s.io/v1beta1
      kind: CustomResourceDefinition
      metadata:
        name: crontabs.stable.example.com
      spec:
        group: stable.example.com
        version: v1
        scope: Namespaced
        names:
          plural: crontabs
          singular: crontab
          kind: CronTab
          shortNames:
          - ct
        additionalPrinterColumns:
        - name: Spec
          type: string
          description: The cron spec defining the interval a CronJob is run
          JSONPath: .spec.cronSpec
        - name: Replicas
          type: integer
          description: The number of jobs launched by the CronJob
          JSONPath: .spec.replicas
        - name: Age
          type: date
          JSONPath: .metadata.creationTimestamp
      ```

2.  Create the CustomResourceDefinition:

      ```shell
      kubectl apply -f resourcedefinition.yaml
      ```

3.  Create an instance using the `my-crontab.yaml` from the previous section.

4.  Invoke the server-side printing:

      ```shell
      kubectl get crontab my-new-cron-object
      ```

      Notice the `NAME`, `SPEC`, `REPLICAS`, and `AGE` columns in the output:

      ```
      NAME                 SPEC        REPLICAS   AGE
      my-new-cron-object   * * * * *   1          7s
      ```

The `NAME` column is implicit and does not need to be defined in the CustomResourceDefinition.

#### Priority

Each column includes a `priority` field for each column. Currently, the priority
differentiates between columns shown in standard view or wide view (using the `-o wide` flag).

- Columns with priority `0` are shown in standard view.
- Columns with priority greater than `0` are shown only in wide view.

#### Type

A column's `type` field can be any of the following (compare [OpenAPI v3 data types](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#dataTypes)):

- `integer` – non-floating-point numbers
- `number` – floating point numbers
- `string` – strings
- `boolean` – true or false
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

### Subresources

{{< feature-state state="beta" for_kubernetes_version="1.11" >}}

Custom resources support `/status` and `/scale` subresources.

You can disable this feature using the `CustomResourceSubresources` feature gate on
the [kube-apiserver](/docs/admin/kube-apiserver):

```
--feature-gates=CustomResourceSubresources=false
```

The status and scale subresources can be optionally enabled by
defining them in the CustomResourceDefinition.

#### Status subresource

When the status subresource is enabled, the `/status` subresource for the custom resource is exposed.

- The status and the spec stanzas are represented by the `.status` and `.spec` JSONPaths respectively inside of a custom resource.
- `PUT` requests to the `/status` subresource take a custom resource object and ignore changes to anything except the status stanza.
- `PUT` requests to the `/status` subresource only validate the status stanza of the custom resource.
- `PUT`/`POST`/`PATCH` requests to the custom resource ignore changes to the status stanza.
- The `.metadata.generation` value is incremented for all changes, except for changes to `.metadata` or `.status`.
- Only the following constructs are allowed at the root of the CRD OpenAPI validation schema:

  - Description
  - Example
  - ExclusiveMaximum
  - ExclusiveMinimum
  - ExternalDocs
  - Format
  - Items
  - Maximum
  - MaxItems
  - MaxLength
  - Minimum
  - MinItems
  - MinLength
  - MultipleOf
  - Pattern
  - Properties
  - Required
  - Title
  - Type
  - UniqueItems

#### Scale subresource

When the scale subresource is enabled, the `/scale` subresource for the custom resource is exposed.
The `autoscaling/v1.Scale` object is sent as the payload for `/scale`.

To enable the scale subresource, the following values are defined in the CustomResourceDefinition.

- `SpecReplicasPath` defines the JSONPath inside of a custom resource that corresponds to `Scale.Spec.Replicas`.

  - It is a required value.
  - Only JSONPaths under `.spec` and with the dot notation are allowed.
  - If there is no value under the `SpecReplicasPath` in the custom resource,
the `/scale` subresource will return an error on GET.

- `StatusReplicasPath` defines the JSONPath inside of a custom resource that corresponds to `Scale.Status.Replicas`.

  - It is a required value.
  - Only JSONPaths under `.status` and with the dot notation are allowed.
  - If there is no value under the `StatusReplicasPath` in the custom resource,
the status replica value in the `/scale` subresource will default to 0.

- `LabelSelectorPath` defines the JSONPath inside of a custom resource that corresponds to `Scale.Status.Selector`.

  - It is an optional value.
  - It must be set to work with HPA.
  - Only JSONPaths under `.status` or `.spec` and with the dot notation are allowed.
  - If there is no value under the `LabelSelectorPath` in the custom resource,
the status selector value in the `/scale` subresource will default to the empty string.
  - The field pointed by this JSON path must be a string field (not a complex selector struct) which contains a serialized label selector in string form.

In the following example, both status and scale subresources are enabled.

Save the CustomResourceDefinition to `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
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

```
/apis/stable.example.com/v1/namespaces/*/crontabs/status
```

and

```
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

You can use a [PodDisruptionBudget](docs/tasks/run-application/configure-pdb/) to protect custom resources that have the scale subresource enabled.

### Categories

Categories is a list of grouped resources the custom resource belongs to (eg. `all`).
You can use `kubectl get <category-name>` to list the resources belonging to the category.
This feature is __beta__ and available for custom resources from v1.10.

The following example adds `all` in the list of categories in the CustomResourceDefinition
and illustrates how to output the custom resource using `kubectl get all`.

Save the following CustomResourceDefinition to `resourcedefinition.yaml`:

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
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

And create it:

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

You can specify the category using `kubectl get`:

```
kubectl get all
```

and it will include the custom resources of kind `CronTab`:

```console
NAME                          AGE
crontabs/my-new-cron-object   3s
```

{{% /capture %}}

{{% capture whatsnext %}}

* See [CustomResourceDefinition](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions-k8s-io).

* Serve [multiple versions](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definition-versioning/) of a
  CustomResourceDefinition.

{{% /capture %}}
