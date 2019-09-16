---
title: Versions of CustomResourceDefinitions
reviewers:
- mbohlool
- sttts
- liggitt
content_template: templates/task
weight: 30
---

{{% capture overview %}}
This page explains how to add versioning information to
[CustomResourceDefinitions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#customresourcedefinition-v1beta1-apiextensions), to indicate the stability
level of your CustomResourceDefinitions or advance your API to a new version with conversion between API representations. It also describes how to upgrade an object from one version to another.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* Make sure your Kubernetes cluster has a master version of 1.11.0 or higher.

* Read about [custom resources](/docs/concepts/api-extension/custom-resources/).

{{% /capture %}}

{{% capture steps %}}

## Overview

{{< feature-state state="beta" for_kubernetes_version="1.15" >}}

The CustomResourceDefinition API supports a `versions` field that you can use to
support multiple versions of custom resources that you have developed. Versions
can have different schemas with a conversion webhook to convert custom resources between versions.
Webhook conversions should follow the [Kubernetes API conventions](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md) wherever applicable.
Specifically, See the [API change documentation](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md) for a set of useful gotchas and suggestions.

{{< note >}}
Earlier iterations included a `version` field instead of `versions`. The
`version` field is deprecated and optional, but if it is not empty, it must
match the first item in the `versions` field.
{{< /note >}}

## Specify multiple versions

This example shows a CustomResourceDefinition with two versions. For the first
example, the assumption is all versions share the same schema with no conversion
between them. The comments in the YAML provide more context.

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
  name: crontabs.example.com
spec:
  # group name to use for REST API: /apis/<group>/<version>
  group: example.com
  # list of versions supported by this CustomResourceDefinition
  versions:
  - name: v1beta1
    # Each version can be enabled/disabled by Served flag.
    served: true
    # One and only one version must be marked as the storage version.
    storage: true
  - name: v1
    served: true
    storage: false
  # The conversion section is introduced in Kubernetes 1.13+ with a default value of
  # None conversion (strategy sub-field set to None).
  conversion:
    # None conversion assumes the same schema for all versions and only sets the apiVersion
    # field of custom resources to the proper value
    strategy: None
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

You can save the CustomResourceDefinition in a YAML file, then use
`kubectl apply` to create it.

```shell
kubectl apply -f my-versioned-crontab.yaml
```

After creation, the API server starts to serve each enabled version at an HTTP
REST endpoint. In the above example, the API versions are available at
`/apis/example.com/v1beta1` and `/apis/example.com/v1`.

### Version priority

Regardless of the order in which versions are defined in a
CustomResourceDefinition, the version with the highest priority is used by
kubectl as the default version to access objects. The priority is determined
by parsing the _name_ field to determine the version number, the stability
(GA, Beta, or Alpha), and the sequence within that stability level.

The algorithm used for sorting the versions is designed to sort versions in the
same way that the Kubernetes project sorts Kubernetes versions. Versions start with a
`v` followed by a number, an optional `beta` or `alpha` designation, and
optional additional numeric versioning information. Broadly, a version string might look
like `v2` or `v2beta1`. Versions are sorted using the following algorithm:

- Entries that follow Kubernetes version patterns are sorted before those that
  do not.
- For entries that follow Kubernetes version patterns, the numeric portions of
  the version string is sorted largest to smallest.
- If the strings `beta` or `alpha` follow the first numeric portion, they sorted
  in that order, after the equivalent string without the `beta` or `alpha`
  suffix (which is presumed to be the GA version).
- If another number follows the `beta`, or `alpha`, those numbers are also
  sorted from largest to smallest.
- Strings that don't fit the above format are sorted alphabetically and the
  numeric portions are not treated specially. Notice that in the example below,
  `foo1` is sorted above `foo10`. This is different from the sorting of the
  numeric portion of entries that do follow the Kubernetes version patterns.

This might make sense if you look at the following sorted version list:

```none
- v10
- v2
- v1
- v11beta2
- v10beta3
- v3beta1
- v12alpha1
- v11alpha2
- foo1
- foo10
```

For the example in [Specify multiple versions](#specify-multiple-versions), the
version sort order is `v1`, followed by `v1beta1`. This causes the kubectl
command to use `v1` as the default version unless the provided object specifies
the version.

## Webhook conversion

{{< feature-state state="beta" for_kubernetes_version="1.15" >}}

{{< note >}}
Webhook conversion is available as beta since 1.15, and as alpha since Kubernetes 1.13. The
`CustomResourceWebhookConversion` feature must be enabled, which is the case automatically for many clusters for beta features. Please refer to the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) documentation for more information.
{{< /note >}}

The above example has a None conversion between versions which only sets the `apiVersion` field
on conversion and does not change the rest of the object. The API server also supports webhook
conversions that call an external service in case a conversion is required. For example when:

* custom resource is requested in a different version than stored version.
* Watch is created in one version but the changed object is stored in another version.
* custom resource PUT request is in a different version than storage version.

To cover all of these cases and to optimize conversion by the API server, the conversion requests may contain multiple objects in order to minimize the external calls. The webhook should perform these conversions independently.

### Write a conversion webhook server

Please refer to the implementation of the [custom resource conversion webhook
server](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/images/crd-conversion-webhook/main.go)
that is validated in a Kubernetes e2e test. The webhook handles the
`ConversionReview` requests sent by the API servers, and sends back conversion
results wrapped in `ConversionResponse`. Note that the request
contains a list of custom resources that need to be converted independently without
changing the order of objects.
The example server is organized in a way to be reused for other conversions. Most of the common code are located in the [framework file](https://github.com/kubernetes/kubernetes/tree/v1.14.0/test/images/crd-conversion-webhook/converter/framework.go) that leaves only [one function](https://github.com/kubernetes/kubernetes/blob/v1.13.0/test/images/crd-conversion-webhook/converter/example_converter.go#L29-L80) to be implemented for different conversions.

{{< note >}}
The example conversion webhook server leaves the `ClientAuth` field
[empty](https://github.com/kubernetes/kubernetes/tree/v1.13.0/test/images/crd-conversion-webhook/config.go#L47-L48),
which defaults to `NoClientCert`. This means that the webhook server does not
authenticate the identity of the clients, supposedly API servers. If you need
mutual TLS or other ways to authenticate the clients, see
how to [authenticate API servers](/docs/reference/access-authn-authz/extensible-admission-controllers/#authenticate-apiservers).
{{< /note >}}

#### Permissible mutations

A conversion webhook must not mutate anything inside of `metadata` of the converted object other than `labels` and `annotations`. Attempted changes to `name`, `UID` and `namespace` are rejected and fail the request which caused the conversion. All other changes are just ignored.  

### Deploy the conversion webhook service

Documentation for deploying the conversion webhook is the same as for the [admission webhook example service](/docs/reference/access-authn-authz/extensible-admission-controllers/#deploy_the_admission_webhook_service).
The assumption for next sections is that the conversion webhook server is deployed to a service named `example-conversion-webhook-server` in `default` namespace and serving traffic on path `/crdconvert`.

{{< note >}}
When the webhook server is deployed into the Kubernetes cluster as a
service, it has to be exposed via a service on port 443 (The server
itself can have an arbitrary port but the service object should map it to port 443).
The communication between the API server and the webhook service may fail
if a different port is used for the service.
{{< /note >}}

### Configure CustomResourceDefinition to use conversion webhooks

The `None` conversion example can be extended to use the conversion webhook by modifying `conversion`
section of the `spec`:

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
metadata:
  # name must match the spec fields below, and be in the form: <plural>.<group>
  name: crontabs.example.com
spec:
  # group name to use for REST API: /apis/<group>/<version>
  group: example.com
  # prunes object fields that are not specified in OpenAPI schemas below.
  preserveUnknownFields: false
  # list of versions supported by this CustomResourceDefinition
  versions:
  - name: v1beta1
    # Each version can be enabled/disabled by Served flag.
    served: true
    # One and only one version must be marked as the storage version.
    storage: true
    # Each version can define it's own schema when there is no top-level
    # schema is defined.
    schema:
      openAPIV3Schema:
        type: object
        properties:
          hostPort:
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
  conversion:
    # a Webhook strategy instruct API server to call an external webhook for any conversion between custom resources.
    strategy: Webhook
    # webhookClientConfig is required when strategy is `Webhook` and it configure the webhook endpoint to be
    # called by API server.
    webhookClientConfig:
      service:
        namespace: default
        name: example-conversion-webhook-server
        path: /crdconvert
      caBundle: <pem encoded ca cert that signs the server cert used by the webhook>
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

You can save the CustomResourceDefinition in a YAML file, then use
`kubectl apply` to apply it.

```shell
kubectl apply -f my-versioned-crontab-with-conversion.yaml
```

Make sure the conversion service is up and running before applying new changes.

### Contacting the webhook

Once the API server has determined a request should be sent to a conversion webhook,
it needs to know how to contact the webhook. This is specified in the `webhookClientConfig`
stanza of the webhook configuration.

Conversion webhooks can either be called via a URL or a service reference,
and can optionally include a custom CA bundle to use to verify the TLS connection.

### URL

`url` gives the location of the webhook, in standard URL form
(`scheme://host:port/path`).

The `host` should not refer to a service running in the cluster; use
a service reference by specifying the `service` field instead.
The host might be resolved via external DNS in some apiservers
(i.e., `kube-apiserver` cannot resolve in-cluster DNS as that would 
be a layering violation). `host` may also be an IP address.

Please note that using `localhost` or `127.0.0.1` as a `host` is
risky unless you take great care to run this webhook on all hosts
which run an apiserver which might need to make calls to this
webhook. Such installs are likely to be non-portable, i.e., not easy
to turn up in a new cluster.

The scheme must be "https"; the URL must begin with "https://".

Attempting to use a user or basic auth e.g. "user:password@" is not allowed.
Fragments ("#...") and query parameters ("?...") are also not allowed.

Here is an example of a conversion webhook configured to call a URL
(and expects the TLS certificate to be verified using system trust roots, so does not specify a caBundle):

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhookClientConfig:
      url: "https://my-webhook.example.com:9443/my-webhook-path"
...
```

### Service Reference

The `service` stanza inside `webhookClientConfig` is a reference to the service for a conversion webhook.
If the webhook is running within the cluster, then you should use `service` instead of `url`.
The service namespace and name are required. The port is optional and defaults to 443.
The path is optional and defaults to "/".

Here is an example of a webhook that is configured to call a service on port "1234"
at the subpath "/my-path", and to verify the TLS connection against the ServerName
`my-service-name.my-service-namespace.svc` using a custom CA bundle.

```yaml
apiVersion: apiextensions.k8s.io/v1beta1
kind: CustomResourceDefinition
...
spec:
  ...
  conversion:
    strategy: Webhook
    webhookClientConfig:
      service:
        namespace: my-service-namespace
        name: my-service-name
        path: /my-path
        port: 1234
      caBundle: "Ci0tLS0tQk...<base64-encoded PEM bundle>...tLS0K"
...
```

## Writing, reading, and updating versioned CustomResourceDefinition objects

When an object is written, it is persisted at the version designated as the
storage version at the time of the write. If the storage version changes,
existing objects are never converted automatically. However, newly-created
or updated objects are written at the new storage version. It is possible for an
object to have been written at a version that is no longer served.

When you read an object, you specify the version as part of the path. If you
specify a version that is different from the object's persisted version,
Kubernetes returns the object to you at the version you requested, but the
persisted object is neither changed on disk, nor converted in any way
(other than changing the `apiVersion` string) while serving the request.
You can request an object at any version that is currently served.

If you update an existing object, it is rewritten at the version that is
currently the storage version. This is the only way that objects can change from
one version to another.

To illustrate this, consider the following hypothetical series of events:

1.  The storage version is `v1beta1`. You create an object. It is persisted in
    storage at version `v1beta1`
2.  You add version `v1` to your CustomResourceDefinition and designate it as
    the storage version.
3.  You read your object at version `v1beta1`, then you read the object again at
    version `v1`. Both returned objects are identical except for the apiVersion
    field.
4.  You create a new object. It is persisted in storage at version `v1`. You now
    have two objects, one of which is at `v1beta1`, and the other of which is at
    `v1`.
5.  You update the first object. It is now persisted at version `v1` since that
    is the current storage version.

### Previous storage versions

The API server records each version which has ever been marked as the storage
version in the status field `storedVersions`. Objects may have been persisted
at any version that has ever been designated as a storage version. No objects
can exist in storage at a version that has never been a storage version.

## Upgrade existing objects to a new stored version

When deprecating versions and dropping support, devise a storage upgrade
procedure. The following is an example procedure to upgrade from `v1beta1`
to `v1`.

1.  Set `v1` as the storage in the CustomResourceDefinition file and apply it
    using kubectl. The `storedVersions` is now `v1beta1, v1`.
2.  Write an upgrade procedure to list all existing objects and write them with
    the same content. This forces the backend to write objects in the current
    storage version, which is `v1`.
3.  Update the CustomResourceDefinition `Status` by removing `v1beta1` from
    `storedVersions` field.

{{% /capture %}}
