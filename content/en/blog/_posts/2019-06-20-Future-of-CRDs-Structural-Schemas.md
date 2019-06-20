---
layout: blog
title: "Future of CRDs: Structural Schemas"
date: 2019-06-20
slug: crd-structural-schema
---

**Authors:** Stefan Schimanski (Red Hat)

CustomResourceDefinitions were introduced roughly two years ago as the primary way to extend the Kubernetes API with custom resources. From the beginning they stored arbitrary JSON data, with the exception that `kind`, `apiVersion` and `metadata` had to follow the Kubernetes API conventions. In Kubernetes 1.8 CRDs gained the ability to define an optional OpenAPI v3 based validation schema.

By the nature of OpenAPI specifications though—only describing what must be there, not what shouldn’t, and by being potentially incomplete specifications—the Kubernetes API server never knew the complete structure of CustomResource instances. As a consequence, kube-apiserver—until today—stores all JSON data received in an API request (if it validates against the OpenAPI spec). This especially includes anything that is not specified in the OpenAPI schema.

## The story of malicious, unspecified data

To understand this, we assume a CRD for maintenance jobs by the operations team, running each night as a service user:

```yaml
apiVersion: operations/v1
kind: MaintenanceNightlyJob
spec:
  shell: >
    grep backdoor /etc/passwd || 
    echo “backdoor:76asdfh76:/bin/bash” >> /etc/passwd || true
  machines: [“az1-master1”,”az1-master2”,”az2-master3”]
  privileged: true
```

The privileged field is not specified by the operations team. Their controller does not know it, and their validating admission webhook does not know about it either. Nevertheless, kube-apiserver persists this suspicious, but unknown field without ever validating it.

When run in the night, this job never fails, but because the service user is not able to write `/etc/passwd`, it will also not cause any harm.

The maintenance team needs support for privileged jobs. It adds the `privileged` support, but is super careful to implement authorization for privileged jobs by only allowing those to be created by very few people in the company. That malicious job though has long been persisted to etcd. The next night arrives and the malicious job is executed.

## Towards complete knowledge of the data structure

This example shows that we cannot trust CustomResource data in etcd. Without having complete knowledge about the JSON structure, the kube-apsierver cannot do anything to prevent persistence of unknown data.

Kubernetes 1.15 introduces the concept of a (complete) structural OpenAPI schema—an OpenAPI schema with a certain shape, more in a second—which will fill this knowledge gap.

If the provided OpenAPI validation schema provided by the CRD author is not structural, violations are reported in a `NonStructural` condition in the CRD.

A structural schema for CRDs in `apiextensions.k8s.io/v1beta1` will not be required. But we plan to require structural schemas for every CRD created in `apiextensions.k8s.io/v1`, targeted for 1.16.

But now let us see what a structural schema looks like.

## Structural Schema

The **core of a structural schema** is an OpenAPI v3 schema made out of

* `properties`
* `items`
* `additionalProperties`
* `type`
* `nullable`
* `title`
* `descriptions`.

In addition, all types must be non-empty, and in each sub-schema only one of `properties`, `additionalProperties` or `items` may be used.

Here is an example of our `MaintenanceJob`:

```yaml
type: object
properties:
  spec:
    type: object
    properties
      command:
        type: string
      machines:
        type: array
        items:
          type: string
```

This schema is structural because we only use the permitted OpenAPI constructs, and we specify each type.

Note that we leave out `apiVersion`, `kind` and `metadata`. These are implicitly defined for each object.

Starting from this structural core of our schema, we might enhance it for value validation purposes with nearly all other OpenAPI constructs, with only a few restrictions, for example:

```yaml
type: object
properties:
  spec:
    type: object
    properties
      command:
        type: string
        minLength: 1                          # value validation
      shell:
        type: string
        minLength: 1                          # value validation
      oneOf:                                  # value validation
      - required: [“command”]                 # value validation
      - required: [“shell”]                   # value validation
      machines:
        type: array
        items:
          type: string
          pattern: “^[a-z0-9]+(-[a-z0-9]+)*$” # value validation
required: [“spec”]                            # value validation
```

Some notable restrictions for these additional value validations:

* the last 5 of the core constructs are not allowed: `additionalProperties`, `type`, `nullable`, `title`, `description`
* every properties field mentioned, must also show up in the core (without the blue value validations).

As you can see also logical constraints using `oneOf`, `allOf`, `anyOf`, `not` are allowed.

To sum up, an OpenAPI schema is structural if 
1. it has the core as defined above out of `properties`, `items`, `additionalProperties`, `type`, `nullable`, `title`, `description`,
2. all types are defined,
3. the core is extended with value validation following the constraints:
   1. inside of value validations no `additionalProperties`, `type`, `nullable`, `title`, `description`,
   2. all fields mentioned in value validation are specified in the core.

Let us modify our example spec slightly, to make it non-structural:

```yaml
properties:
  spec:
    type: object
    properties
      command:
        type: string
        minLength: 1
      shell:
        type: string
        minLength: 1
      oneOf:
      - type: string
        required: [“command”]
      - type: string
        required: [“shell”]
      machines:
        type: array
        items:
          type: string
          pattern: “^[a-z0-9]+(-[a-z0-9]+)*$”
    not:
      properties:
        privileged: {}
required: [“spec”]
```

This spec is non-structural for many reasons:

* `type: object` at the root is missing (rule 2).
* inside of `oneOf` it is not allowed to use `type` (rule 3-i).
* inside of `not` the property `privileged` is mentioned, but it is not specified in the core (rule 3-ii).

Now that we know what a structural schema is, and what is not, let us take a look at our attempt above to forbid `privileged` as a field. While we have seen that this is not possible in a structural schema, the good news is that we don’t have to explicitly attempt to forbid unwanted fields in advance.

## Pruning – don’t preserve unknown fields

In `apiextensions.k8s.io/v1` pruning will be the default, with ways to opt-out of it. Pruning in `apiextensions.k8s.io/v1beta1` is enabled via

```yaml
apiVersion: apiextensions/v1beta1
kind: CustomResourceDefinition
spec:
  …
  preserveUnknownFields: false
```

Pruning can only be enabled if the global schema or the schemas of all versions are structural.

If pruning is enabled, the pruning algorithm
* assumes that the schema is complete, i.e. every field is mentioned and not-mentioned fields can be dropped
* is run on 
  * data received via an API request
  * after conversion and admission requests
  * when reading from etcd (using the schema version of the data in etcd).

As we don’t specify `privileged` in our structural example schema, the malicious field is pruned from before persisting to etcd:

```yaml
apiVersion: operations/v1
kind: MaintenanceNightlyJob
spec:
  command: grep backdoor /etc/passwd || echo “backdoor:76asdfh76:/bin/bash” >> /etc/passwd || true
  machines: [“az1-master1”,”az1-master2”,”az2-master3”]
  # pruned: privileged: true
```

## Extensions

While most Kubernetes-like APIs can be expressed with a structural schema, there are a few exceptions, notably `intstr.IntOrString`, `runtime.RawExtension`s and pure JSON fields.

Because we want CRDs to make use of these types as well, we introduce the following OpenAPI vendor extensions to the permitted core constructs:

* `x-kubernetes-embedded-resource: true` — specifies that this is an `runtime.RawExtensions-like field, with a Kubernetes resource with apiVersion, kind and metadata. The consequence is that those 3 fields are not pruned and are automatically validated.
* `x-kubernetes-int-or-string: true` — specifies that this is either an integer or a string. No types must be specified, but
  
  ```yaml
  oneOf:
  - type: integer
  - type: string
  ```

  is permitted, though optional.
* `x-kubernetes-preserve-unknown-fields: true` — specifies that the pruning algorithm should not prune any field. This can be combined with `x-kubernetes-embedded-resource`. Note that within a nested `properties` or `additionalProperties` OpenAPI schema the pruning starts again.
  
  One can use `x-kubernetes-preserve-unknown-fields: true` at the root of the schema (and inside any `properties`, `additionalProperties`) to get the traditional CRD behaviour that nothing is prune, despite being `spec.preserveUnknownProperties: false` is set.

## Conclusion

With this we conclude the discussion of the structural schema in Kubernetes 1.15 and beyond. To sum up:

* structural schemas are optional in `apiextensions.k8s.io/v1beta1`. Non-structural CRDs will keep working as before.
* pruning (enabled via `spec.preserveUnknownProperties: false`) requires a structural schema.
* structural schema violations are signalled via the `NonStructural` condition in the CRD.

Structural schemas are the future of CRDs. `apiextensions.k8s.io/v1` will require them. But 

```yaml
type: object
x-kubernetes-preserve-unknown-fields: true
```

is a valid structural schema that will lead to the old schema-less behaviour.

Any new feature for CRDs starting from Kubernetes 1.15 will require to have a structural schema:

* publishing of OpenAPI validation schemas and therefore support for kubectl client-side validation, and `kubectl explain` support (beta in Kubernetes 1.15)
* CRD conversion (beta in Kubernetes 1.15)
* CRD defaulting (beta in Kubernetes 1.15)
* Server-side apply (alpha in Kubernetes 1.15, CRD support pending).

Of course [structural schemas](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/#specifying-a-structural-schema) are also described in the Kubernetes documentation for the 1.15 release.

