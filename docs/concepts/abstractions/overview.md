---
---

{% capture overview %}
This page explains how Kubernetes objects are represented in the Kubernetes API, and how you can express them in `.yaml` format.
{% endcapture %}

{% capture body %}
### Understanding Kubernetes Objects

*Kubernetes Objects* are persistent entities in the Kubernetes system. Kubenetes uses these entities to represent the state of your cluster. Specifically, they can describe:

* What containerized applications are running (and on which nodes)
* The resources available to those applications
* The policies around how those applications behave, such as restart policies, upgrades, and fault-tolerance

When you create a Kubernetes object, you create a "record of intent"--once you create the object, the Kubernetes system will constantly work to ensure that the entity exists. By creating an object, you're effectively telling the Kubernetes system what you want your cluster to be doing; this is your cluster's **desired state**.

To work with Kubernetes objects--whether to create, modify, or delete them--you'll need to use the [Kubernetes API](https://github.com/kubernetes/kubernetes/blob/master/docs/devel/api-conventions.md). When you use the `kubectl` comamnd-line interface, for example, the CLI makes the necessary Kubernetes API calls for you; you can also use the Kubernetes API directly in your own programs.

#### Object Spec and Status

Every Kubernetes object has two major nested object fields: the object *spec* and the object *status*. The *spec*, which you must provide, describes your *desired state* for the object--the characteristics that you want the object to have. The *status* describes the *actual state* for the object, and is supplied by the Kubernetes system. At any given time, the [Kubernetes Control Plane](/docs/concepts/control-plane/overview/) actively maintains an object's actual state to match the desired state you supplied.

For more information on the object spec and status, see the [Kubernetes API Conventions](https://github.com/kubernetes/kubernetes/blob/master/docs/devel/api-conventions.md#spec-and-status).

#### Describing a Kubernetes Object

When you create an object in Kubernetes, you need to describe it. Your description must provide some basic information about the object along with the object spec that represents your desired state. The Kubernetes API communicates this information by passing JSON; when you make Kubernetes API calls or use the `kubectl` command-line interface, **you can express that JSON using a `.yaml` file.**

Here's an example `.yaml` file that shows an example of the required fields and object spec for a Kubernetes [Deployment](/docs/concepts/abstractions/deployment/):

{% include code.html language="yaml" file="nginx-deployment.yaml" ghlink="/docs/user-guide/nginx-deployment.yaml" %}

One way to create a Deployment using a `.yaml` file like the one above is to use the []`kubectl create`]() command in the `kubectl` command-line interface, passing the `.yaml` file as an argument. Here's an example:

```shell
$ kubectl create -f docs/user-guide/nginx-deployment.yaml --record
deployment "nginx-deployment" created
```

#### Required Fields

In the `.yaml` file for the Kubernetes object you want to create, you'll need to set values for the following fields:

* `apiVersion` - Which version of the Kubernetes API you're using to create this object
* `kind` - What kind of object you want to create
* `metadata` - Data that helps uniquely identify the object, including a `name` string, UID, and optional `namespace`

You'll also need to provide the object `spec` field. The precise format of the object `spec` is different for every Kubernetes object, and contains nested fields specific to that object. The [Kubernetes API reference](/docs/api/) can help you find the spec format for all of the objects you can create using Kubernetes.

{% endcapture %}

{% capture whatsnext %}
* Learn about the most important basic Kubernetes objects, such as [Pod](/docs/concepts/abstractions/pod/).
{% endcapture %}

{% include templates/concept.md %}