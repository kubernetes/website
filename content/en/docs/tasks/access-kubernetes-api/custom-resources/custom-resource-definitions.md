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

- The fields `default`, `nullable`, `discriminator`, `readOnly`, `writeOnly`, `xml`,
`deprecated` and `$ref` cannot be set.
- The field `uniqueItems` cannot be set to true.
- The field `additionalProperties` cannot be set to false.

You can disable this feature using the `CustomResourceValidation` feature gate on
the [kube-apiserver](/docs/admin/kube-apiserver):

```
--feature-gates=CustomResourceValidation=false
```

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
      properties:
        spec:
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

### Publish Validation Schema in OpenAPI v2

{{< feature-state state="alpha" for_kubernetes_version="1.14" >}}

Starting with Kubernetes 1.14, [custom resource validation schema](#validation) can be published as part
of [OpenAPI v2 spec](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions) from
Kubernetes API server.

[kubectl](/docs/reference/kubectl/overview) consumes the published schema to perform client-side validation
(`kubectl create` and `kubectl apply`), schema explanation (`kubectl explain`) on custom resources.
The published schema can be consumed for other purposes. The feature is Alpha in 1.14 and disabled by default.
You can enable the feature using the `CustomResourcePublishOpenAPI` feature gate on the
[kube-apiserver](/docs/admin/kube-apiserver):

```
--feature-gates=CustomResourcePublishOpenAPI=true
```

Custom resource validation schema will be converted to OpenAPI v2 schema, and
show up in `definitions` and `paths` fields in the [OpenAPI v2 spec](/docs/concepts/overview/kubernetes-api/#openapi-and-swagger-definitions).
The following modifications are applied during the conversion to keep backwards compatiblity with
kubectl in previous 1.13 version. These modifications prevent kubectl from being over-strict and rejecting
valid OpenAPI schemas that it doesn't understand. The conversion won't modify the validation schema defined in CRD,
and therefore won't affect [validation](#validation) in the API server.

1. The following fields are removed as they aren't supported by OpenAPI v2 (in future versions OpenAPI v3 will be used without these restrictions)
   - The fields `oneOf`, `anyOf` and `not` are removed
2. The following fields are removed as they aren't allowed by kubectl in
   previous 1.13 version
   - For a schema with a `$ref`
      - the fields `properties` and `type` are removed
      - if the `$ref` is outside of the `definitions`, the field `$ref` is removed
   - For a schema of a primitive data type (which means the field `type` has two elements: one type and one format)
      - if any one of the two elements is `null`, the field `type` is removed
      - otherwise, the fields `type` and `properties` are removed
   - For a schema of more than two types
      - the fields `type` and `properties` are removed
   - For a schema of `null` type
      - the field `type` is removed
   - For a schema of `array` type
      - if the schema doesn't have exactly one item, the fields `type` and `items` are
        removed
   - For a schema with no type specified
      - the field `properties` is removed
3. The following fields are removed as they aren't supported by the OpenAPI protobuf implementation
   - The fields `id`, `schema`, `definitions`, `additionalItems`, `dependencies`,
     and `patternProperties` are removed
   - For a schema with a `externalDocs`
      - if the `externalDocs` has `url` defined, the field `externalDocs` is removed
   - For a schema with `items` defined
      - if the field `items` has multiple schemas, the field `items` is removed

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
  - Only JSONPaths under `.status` and with the dot notation are allowed.
  - If there is no value under the `LabelSelectorPath` in the custom resource,
the status selector value in the `/scale` subresource will default to the empty string.

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
