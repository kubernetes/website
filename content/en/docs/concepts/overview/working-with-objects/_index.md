---
title: Objects In Kubernetes
content_type: concept
weight: 30
description: >
  Kubernetes objects are persistent entities in the Kubernetes system.
  Kubernetes uses these entities to represent the state of your cluster.
  Learn about the Kubernetes object model and how to work with these objects.
simple_list: true
card:
  name: concepts
  weight: 40
---

<!-- overview -->

This page explains how Kubernetes objects are represented in the Kubernetes API, and how you can
express them in `.yaml` format.

<!-- body -->

## Understanding Kubernetes objects {#kubernetes-objects}

*Kubernetes objects* are persistent entities in the Kubernetes system. Kubernetes uses these
entities to represent the state of your cluster. Specifically, they can describe:

* What containerized applications are running (and on which nodes)
* The resources available to those applications
* The policies around how those applications behave, such as restart policies, upgrades, and fault-tolerance

A Kubernetes object is a "record of intent"--once you create the object, the Kubernetes system
will constantly work to ensure that the object exists. By creating an object, you're effectively
telling the Kubernetes system what you want your cluster's workload to look like; this is your
cluster's *desired state*.

To work with Kubernetes objects—whether to create, modify, or delete them—you'll need to use the
[Kubernetes API](/docs/concepts/overview/kubernetes-api/). When you use the `kubectl` command-line
interface, for example, the CLI makes the necessary Kubernetes API calls for you. You can also use
the Kubernetes API directly in your own programs using one of the
[Client Libraries](/docs/reference/using-api/client-libraries/).

### Object spec and status

Almost every Kubernetes object includes two nested object fields that govern
the object's configuration: the object *`spec`* and the object *`status`*.
For objects that have a `spec`, you have to set this when you create the object,
providing a description of the characteristics you want the resource to have:
its _desired state_.

The `status` describes the _current state_ of the object, supplied and updated
by the Kubernetes system and its components. The Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} continually
and actively manages every object's actual state to match the desired state you
supplied.

For example: in Kubernetes, a Deployment is an object that can represent an
application running on your cluster. When you create the Deployment, you
might set the Deployment `spec` to specify that you want three replicas of
the application to be running. The Kubernetes system reads the Deployment
spec and starts three instances of your desired application--updating
the status to match your spec. If any of those instances should fail
(a status change), the Kubernetes system responds to the difference
between spec and status by making a correction--in this case, starting
a replacement instance.

For more information on the object spec, status, and metadata, see the
[Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

### Describing a Kubernetes object

When you create an object in Kubernetes, you must provide the object spec that describes its
desired state, as well as some basic information about the object (such as a name). When you use
the Kubernetes API to create the object (either directly or via `kubectl`), that API request must
include that information as JSON in the request body.
Most often, you provide the information to `kubectl` in a file known as a _manifest_.
By convention, manifests are YAML (you could also use JSON format).
Tools such as `kubectl` convert the information from a manifest into JSON or another supported
serialization format when making the API request over HTTP.

Here's an example manifest that shows the required fields and object spec for a Kubernetes
Deployment:

{{% code_sample file="application/deployment.yaml" %}}

One way to create a Deployment using a manifest file like the one above is to use the
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) command
in the `kubectl` command-line interface, passing the `.yaml` file as an argument. Here's an example:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml
```

The output is similar to this:

```
deployment.apps/nginx-deployment created
```

### Required fields

In the manifest (YAML or JSON file) for the Kubernetes object you want to create, you'll need to set values for
the following fields:

* `apiVersion` - Which version of the Kubernetes API you're using to create this object
* `kind` - What kind of object you want to create
* `metadata` - Data that helps uniquely identify the object, including a `name` string, `UID`, and optional `namespace`
* `spec` - What state you desire for the object

The precise format of the object `spec` is different for every Kubernetes object, and contains
nested fields specific to that object. The [Kubernetes API Reference](/docs/reference/kubernetes-api/)
can help you find the spec format for all of the objects you can create using Kubernetes.

For example, see the [`spec` field](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
for the Pod API reference.
For each Pod, the `.spec` field specifies the pod and its desired state (such as the container image name for
each container within that pod).
Another example of an object specification is the
[`spec` field](/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/#StatefulSetSpec)
for the StatefulSet API. For StatefulSet, the `.spec` field specifies the StatefulSet and
its desired state.
Within the `.spec` of a StatefulSet is a [template](/docs/concepts/workloads/pods/#pod-templates)
for Pod objects. That template describes Pods that the StatefulSet controller will create in order to
satisfy the StatefulSet specification.
Different kinds of objects can also have different `.status`; again, the API reference pages
detail the structure of that `.status` field, and its content for each different type of object.

{{< note >}}
See [Configuration Best Practices](/docs/concepts/configuration/overview/) for additional
information on writing YAML configuration files.
{{< /note >}}

## Server side field validation

Starting with Kubernetes v1.25, the API server offers server side
[field validation](/docs/reference/using-api/api-concepts/#field-validation)
that detects unrecognized or duplicate fields in an object. It provides all the functionality
of `kubectl --validate` on the server side.

The `kubectl` tool uses the `--validate` flag to set the level of field validation. It accepts the
values `ignore`, `warn`, and `strict` while also accepting the values `true` (equivalent to `strict`)
and `false` (equivalent to `ignore`). The default validation setting for `kubectl` is `--validate=true`.

`Strict`
: Strict field validation, errors on validation failure

`Warn`
: Field validation is performed, but errors are exposed as warnings rather than failing the request

`Ignore`
: No server side field validation is performed

When `kubectl` cannot connect to an API server that supports field validation it will fall back
to using client-side validation. Kubernetes 1.27 and later versions always offer field validation;
older Kubernetes releases might not. If your cluster is older than v1.27, check the documentation
for your version of Kubernetes.

## {{% heading "whatsnext" %}}

If you're new to Kubernetes, read more about the following:

* [Pods](/docs/concepts/workloads/pods/) which are the most important basic Kubernetes objects.
* [Deployment](/docs/concepts/workloads/controllers/deployment/) objects.
* [Controllers](/docs/concepts/architecture/controller/) in Kubernetes.
* [kubectl](/docs/reference/kubectl/) and [kubectl commands](/docs/reference/generated/kubectl/kubectl-commands).

[Kubernetes Object Management](/docs/concepts/overview/working-with-objects/object-management/)
explains how to use `kubectl` to manage objects.
You might need to [install kubectl](/docs/tasks/tools/#kubectl) if you don't already have it available.

To learn about the Kubernetes API in general, visit:

* [Kubernetes API overview](/docs/reference/using-api/)

To learn about objects in Kubernetes in more depth, read other pages in this section:
<!-- Docsy automatically includes a list of pages in the section -->
