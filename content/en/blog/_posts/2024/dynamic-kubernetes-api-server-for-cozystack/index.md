---
layout: blog
title: "How we built a dynamic Kubernetes API Server for the API Aggregation Layer in Cozystack"
slug: dynamic-kubernetes-api-server-for-cozystack
date: 2024-11-21
author: >
  Andrei Kvapil (Ænix)
---

Hi there! I'm Andrei Kvapil, but you might know me as [@kvaps](https://github.com/kvaps) in communities dedicated to Kubernetes
and cloud-native tools. In this article, I want to share how we implemented our own extension api-server
in the open-source PaaS platform, Cozystack.

Kubernetes truly amazes me with its powerful extensibility features. You're probably already
familiar with the [controller](/docs/concepts/architecture/controller/) concept
and frameworks like [kubebuilder](https://book.kubebuilder.io/) and
[operator-sdk](https://sdk.operatorframework.io/) that help you implement it. In a nutshell, they
allow you to extend your Kubernetes cluster by defining custom resources (CRDs) and writing additional
controllers that handle your business logic for reconciling and managing these kinds of resources.
This approach is well-documented, with a wealth of information available online on how to develop your
own operators.

However, this is not the only way to
[extend the Kubernetes API](/docs/concepts/extend-kubernetes/#api-extensions).
For more complex scenarios such as implementing imperative logic,
managing subresources, and dynamically generating responses—the Kubernetes API _aggregation layer_
provides an effective alternative. Through the aggregation layer, you can develop a custom
extension API server and seamlessly integrate it within the broader Kubernetes API framework.

In this article, I will explore the API aggregation layer, the types of challenges it is well-suited
to address, cases where it may be less appropriate, and how we utilized this model to implement
our own extension API server in Cozystack.

## What Is the API Aggregation Layer?

First, let's get definitions straight to avoid any confusion down the road.
The [API aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
is a feature in Kubernetes, while an extension api-server is a specific implementation of an
API server for the aggregation layer. An extension API server is just like the standard Kubernetes API server, except it runs separately and handles requests for your specific resource types.

So, the aggregation layer lets you write your own extension API server, integrate it easily into Kubernetes,
and directly process requests for resources in a certain group. Unlike the CRD mechanism, the extension API
is registered in Kubernetes as an APIService, telling Kubernetes to consider this new API server and acknowledge
that it serves certain APIs.

You can execute this command to list all registered apiservices:

```shell
kubectl get apiservices.apiregistration.k8s.io
```

Example APIService:

```console
NAME                          	SERVICE                   	AVAILABLE   AGE
v1alpha1.apps.cozystack.io    	cozy-system/cozystack-api 	True    	7h29m
```

As soon as the Kubernetes api-server receives requests for resources in the group
`v1alpha1.apps.cozystack.io`, it redirects all those requests to our extension api-server,
which can handle them based on the business logic we've built into it.


## When to use the API Aggregation Layer

The API Aggregation Layer helps solve several issues where the usual CRD mechanism might
not enough. Let's break them down.

### Imperative Logic and Subresources

Besides regular resources, Kubernetes also has something called subresources.

In Kubernetes, subresources are additional actions or operations you can perform on primary resources
(like Pods, Deployments, Services) via the Kubernetes API. They provide interfaces to manage
specific aspects of resources without affecting the entire object.

A simple example is `status`, which is traditionally exposed as a separate subresource that you can
access independently from the parent object. The `status` field isn't meant to be changed

But beyond `/status`, Pods in Kubernetes also have subresources like `/exec`, `/portforward`, and
`/log`. Interestingly, instead of the usual declarative resources in Kubernetes, these represent
endpoints for imperative operations like viewing logs, proxying connections, executing commands in
a running container, and so on.

To support such imperative commands on your own API, you need implement an extension API and an
extension API server. Here are some well-known examples:

- **KubeVirt**: An add-on for Kubernetes that extends its API capabilities to run traditional virtual machines.
  The extension api-server created as part of KubeVirt handles subresources
  like `/restart`, `/console`, and `/vnc` for virtual machines.
- **Knative**: A Kubernetes add-on that extends its capabilities for serverless computing,
  implementing the `/scale` subresource to set up autoscaling for its resource types.

By the way, even though subresource logic in Kubernetes can be *imperative*, you can manage access
to them *declaratively* using Kubernetes standard RBAC model.

For example this way you can control access to the `/log` and `/exec` subresources of the Pod kind:
```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
- apiGroups: [""]
  resources: ["pods/exec"]
  verbs: ["create"]
```

### You're not tied to use etcd

Usually, the Kubernetes API server uses [etcd](https://etcd.io/) for its backend.
However, implementing your own API server doesn't lock you into using only etcd.
If it doesn't make sense to store your server's state in etcd, you can store information in any
other system and generate responses on the fly. Here are a few cases to illustrate:

* [metrics-server](https://github.com/kubernetes-sigs/metrics-server) is a standard extension for Kubernetes
  which allows you to view real-time metrics of your nodes and pods. It defines alternative Pod and Node
  kinds in its own metrics.k8s.io API. Requests to these resources are translated into metrics
  directly from Kubelet. So when you run `kubectl top node` or `kubectl top pod`, metrics-server fetches
  metrics from cAdvisor in real-time. It then returns these metrics to you. Since the information
  is generated in real-time and is only relevant at the moment of the request, there is no need
  to store it in etcd. This approach saves resources.

* If needed, you can use a backend other than etcd. You can even implement a Kubernetes-compatible API
  for it. For example, if you use Postgres, you can create a transparent representation of its entities
  in the Kubernetes API. Eg. databases, users, and grants within Postgres would appear as regular
  Kubernetes resources, thanks to your extension API server. You could manage them using `kubectl` or any
  other Kubernetes-compatible tool. Unlike controllers, which implement business logic using custom resources
  and reconciliation methods, an extension API server eliminates the need for separate controllers for every kind.
  This means you don't have to sync state between the Kubernetes API and your backend.

### One-Time resources

- Kubernetes has a special API used to provide users with information about their permissions.
  This is implemented using the SelfSubjectAccessReview API. One unusual detail of these
  resources is that you can't view them using **get** or **list** verbs. You can only create them (using
  the **create** verb) and receive output with information about what you have access to at that
  moment.
  
  If you try to run `kubectl get selfsubjectaccessreviews` directly, you'll just get an error
  like this:
  
  ```console
  Error from server (MethodNotAllowed): the server does not allow this method on the requested resource
  ```
  
  The reason is that the Kubernetes API server doesn't support any other interaction with this
  type of resource (you can only CREATE them).
  
  The SelfSubjectAccessReview API supports commands such as:
  
  ```shell
  kubectl auth can-i create deployments --namespace dev
  ```
  
  When you run the command above, `kubectl` creates a SelfSubjectAccessReview using the
  Kubernetes API. This allows Kubernetes to fetch a list of possible permissions for your user.
  Kubernetes then generates a personalized response to your request in real-time. This logic is
  different from a scenario where this resource is simply stored in etcd.

- Similarly, in KubeVirt's [CDI (Containerized Data Importer)](https://github.com/kubevirt/containerized-data-importer)
  extension, which allows file uploads into a PVC from a local machine using the `virtctl` tool,
  a special token is required before the upload process begins.
  This token is generated by creating an UploadTokenRequest resource via the Kubernetes API. Kubernetes
  routes (proxies) all UploadTokenRequest resource creation requests to the CDI extension API server,
  which generates and returns the token in response.

### Full control over conversion, validation, and output formatting

- Your own API server can have all the capabilities of the vanilla Kubernetes API server. The resources you create
  in your API server can be validated immediately on the server side without additional webhooks.
  While CRDs also support server-side validation using [Common Expression Language (CEL)](https://kubernetes.io/docs/reference/using-api/cel/)
  for declarative validation and [ValidatingAdmissionPolicies](https://kubernetes.io/docs/reference/access-authn-authz/validating-admission-policy/)
  without the need for webhooks, a custom API server allows for more complex and tailored validation logic if needed.

  Kubernetes allows you to serve multiple API versions for each resource type, traditionally
  `v1alpha1`, `v1beta1` and `v1`. Only one version can be specified as the storage version.
  All requests to other versions must be automatically converted to the version specified as storage version.
  With CRDs, this mechanism is implemented using conversion webhooks. Whereas in an extension API server,
  you can implement your own conversion mechanism, choose to mix up different storage versions (one
  object might be serialized as `v1`, another as `v2`), or rely on an external backing API.

- Directly implementing the Kubernetes API lets you format table output however you like and doesn't force you to follow
  the `additionalPrinterColumns` logic in CRDs. Instead, you can write your own formatter that
  formats the table output and custom fields in it. For example, when using `additionalPrinterColumns`,
  you can display field values only following the JSONPath logic. In your own API server, you can generate
  and insert values on the fly, formatting the table output as you wish.

### Dynamic resource registration

- The resources served by an extension api-server don't need to be pre-registered as CRDs.
  Once your extension API server is registered using an APIService, Kubernetes starts polling it to discover
  APIs and resources it can serve. After receiving a discovery response, the Kubernetes API server automatically
  registers all available types for this API group.
  Although this isn't considered common practice, you can implement logic that dynamically registers
  the resource types you need in your Kubernetes cluster.

## When not to use the API Aggregation Layer

There are some anti-patterns where using the API Aggregation Layer isn't recommended.
Let's go through them.

### Unstable backend

If your API server stops responding for some reason due to an unavailable backend or other issues it
may block some Kubernetes functionality. For example, when deleting namespaces, Kubernetes will wait
for a response from your API server to see if there are any remaining resources.
If the response doesn't come, the namespace deletion will be blocked.

Also, you might have encountered a [situation](https://github.com/kedacore/keda/issues/4224) where,
when the metrics-server is unavailable, an extra message appears in stderr after every API request
(even unrelated to metrics) stating that `metrics.k8s.io` is unavailable. This is another example
of how using the API Aggregation Layer can lead to problems when the api-server handling requests
is unavailable.

### Slow requests

If you can't guarantee an instant response for user requests, it's better to consider using a
CustomResourceDefinition and controller.
Otherwise, you might make your cluster less stable. Many projects implement an extension
API server only for a limited set of resources, particularly for imperative logic and subresources.
This recommendation is also
[mentioned](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/#response-latency)
in the official Kubernetes
documentation.

## Why we needed it in Cozystack

As a reminder, we're developing the open-source PaaS platform [Cozystack](https://cozystack.io/),
which can also be used as a framework for building your own private cloud. Therefore, the ability
to easily extend the platform is crucial for us.

Cozystack is built on top of [FluxCD](https://fluxcd.io/). Any application is packaged into its
own Helm chart, ready for deployment in a tenant namespace. Deploying any application on the platform
is done by creating a HelmRelease resource, specifying the chart name and parameters for the application.
All the rest logic is handled by FluxCD. This pattern allows us to easily extend the platform with new
applications and provide the ability to create new applications that just need to be packaged
into the appropriate Helm chart.

{{< figure src="cozystack.png" alt="Interface of the Cozystack platform" caption="Interface of the Cozystack platform" >}}

So, in our platform, everything is configured as HelmRelease resources. However, we ran into
two problems: limitations of the RBAC model and the need for a public API. Let's delve into these

### Limitations of the RBAC model

The widely-deployed RBAC system in Kubernetes doesn't allow you to restrict access to a list of resources
of the same kind based on labels or specific fields in the spec. When creating a role, you can limit
access across the resources in the same kind only by specifying specific resource names in `resourceNames`.
For verbs like **get** or **update** it will work. However, filtering by `resourceNames` using **list**
verb doesn't work like that. Thus you can limit listing certain resources by kind but not by name.

- Kubernetes has a special API used to provide users with information about their permissions.
  This is implemented using the SelfSubjectAccessReview API. One unusual detail of these
  resources is that you can't view them using **get** or **list** verbs. You can only create them (using
  the **create** verb) and receive output with information about what you have access to at that
  moment.

So, we decided to introduce new resource types based on the names of the Helm charts they use and
generate the list of available kinds dynamically at runtime in our extension api-server.
This way, we can reuse Kubernetes standard RBAC model to manage access to specific resource types.

### Need for a public API

Since our platform provides capabilities for deploying various managed services, we want to organize
public access to the platform's API. However, we can't allow users to interact directly with resources
like HelmRelease because that would let them specify arbitrary names and parameters for Helm charts to
deploy, potentially compromising our system.

We wanted to give users the ability to deploy a specific service simply by creating the resource with corresponding
kind in Kubernetes. The type of this resource should be named the same as the chart from
which it's deployed. Here are some examples:

- `kind: Kubernetes` → `chart: kubernetes`
- `kind: Postgres` → `chart: postgres`
- `kind: Redis` → `chart: redis`
- `kind: VirtualMachine` → `chart: virtual-machine`

Moreover, we don't want to have to add a new type to codegen and recompile our extension API server
every time we add a new chart for it to start being served.
The schema update should be done dynamically or provided via a ConfigMap by the administrator.

### Two-Way conversion

Currently, we already have integrations and a dashboard that continue to use HelmRelease resources.
At this stage, we didn't want to lose the ability to support this API. Considering that we're simply
translating one resource into another, support is maintained and it works both ways.
If you create a HelmRelease, you'll get a custom resource in Kubernetes, and if you create a
custom resource in Kubernetes, it will also be available as a HelmRelease.

We don't have any additional controllers that synchronize state between these resources.
All requests to resources in our extension API server are transparently proxied to HelmRelease and vice versa.
This eliminates intermediate states and the need to write controllers and synchronization logic.

## Implementation

To implement the Aggregation API, you might consider starting with the following projects:

- [apiserver-builder](https://github.com/kubernetes-sigs/apiserver-builder-alpha):
  Currently in alpha and hasn't been updated for two years. It works like kubebuilder,
  providing a framework for creating an extension API server, allowing you to sequentially create
  a project structure and generate code for your resources.
- [sample-apiserver](https://github.com/kubernetes/sample-apiserver):
  A ready-made example of an implemented API server, based on official Kubernetes libraries,
  which you can use as a foundation for your project.

For practical reasons, we chose the second project. Here's what we needed to do:

### Disable etcd support

In our case, we don't need it since all resources are stored directly in the Kubernetes API.

You can disable etcd options by passing nil to `RecommendedOptions.Etcd`:

- [Disabling etcd options](https://github.com/aenix-io/cozystack/blob/003edf8cf0a419bd67cd822d61ff806db49e7026/pkg/cmd/server/start.go#L70)

### Generate a common resource kind

We called it Application, and it looks like this:

- [Application type definition](https://github.com/aenix-io/cozystack/blob/003edf8cf0a419bd67cd822d61ff806db49e7026/pkg/apis/apps/v1alpha1/types.go)

This is a generic type used for any application type, and its handling logic is the same for all charts.

### Configure configuration loading

Since we want to configure our extension api-server via a config file, we formed the config structure in Go:

- [Config type definition](https://github.com/aenix-io/cozystack/blob/003edf8cf0a419bd67cd822d61ff806db49e7026/pkg/config/config.go)

We also modified the resource registration logic so that the resources we create are registered in scheme with different `Kind` values:

- [Dynamic resource registration](https://github.com/aenix-io/cozystack/blob/003edf8cf0a419bd67cd822d61ff806db49e7026/pkg/apis/apps/v1alpha1/register.go#L63-L77)

As a result, we got a config where you can pass all possible types and specify what they should map to:

- [ConfigMap example](https://github.com/aenix-io/cozystack/blob/003edf8cf0a419bd67cd822d61ff806db49e7026/packages/system/cozystack-api/templates/configmap.yaml)

### Implement our own registry

To store state not in etcd but translate it directly into Kubernetes HelmRelease resources (and vice versa),
we wrote conversion functions from Application to HelmRelease and from HelmRelease to Application:

- [Conversion functions](https://github.com/aenix-io/cozystack/blob/003edf8cf0a419bd67cd822d61ff806db49e7026/pkg/registry/apps/application/rest.go#L920-L991)

We implemented logic to filter resources by chart name, `sourceRef`, and prefix in the HelmRelease name:

- [Filtering functions](https://github.com/aenix-io/cozystack/blob/003edf8cf0a419bd67cd822d61ff806db49e7026/pkg/registry/apps/application/rest.go#L747-L784)

Then, using this logic, we implemented the methods `Get()`, `Delete()`, `List()`, `Create()`.

You can see the full example here:

- [Registry Implementation](https://github.com/aenix-io/cozystack/blob/003edf8cf0a419bd67cd822d61ff806db49e7026/pkg/registry/apps/application/rest.go)

At the end of each method, we set the correct `Kind` and return an `unstructured.Unstructured{}` object
so that Kubernetes serializes the object correctly. Otherwise,
it would always serialize them with `kind: Application`, which we don't want.


## What did we achieve?

In Cozystack, all our types from the ConfigMap are now available in Kubernetes as-is:

```shell
kubectl api-resources | grep cozystack
```

```console
buckets                   apps.cozystack.io/v1alpha1      true        Bucket
clickhouses               apps.cozystack.io/v1alpha1      true        ClickHouse
etcds                     apps.cozystack.io/v1alpha1      true        Etcd
ferretdb                  apps.cozystack.io/v1alpha1      true        FerretDB
httpcaches                apps.cozystack.io/v1alpha1      true        HTTPCache
ingresses                 apps.cozystack.io/v1alpha1      true        Ingress
kafkas                    apps.cozystack.io/v1alpha1      true        Kafka
kuberneteses              apps.cozystack.io/v1alpha1      true        Kubernetes
monitorings               apps.cozystack.io/v1alpha1      true        Monitoring
mysqls                    apps.cozystack.io/v1alpha1      true        MySQL
natses                    apps.cozystack.io/v1alpha1      true        NATS
postgreses                apps.cozystack.io/v1alpha1      true        Postgres
rabbitmqs                 apps.cozystack.io/v1alpha1      true        RabbitMQ
redises                   apps.cozystack.io/v1alpha1      true        Redis
seaweedfses               apps.cozystack.io/v1alpha1      true        SeaweedFS
tcpbalancers              apps.cozystack.io/v1alpha1      true        TCPBalancer
tenants                   apps.cozystack.io/v1alpha1      true        Tenant
virtualmachines           apps.cozystack.io/v1alpha1      true        VirtualMachine
vmdisks                   apps.cozystack.io/v1alpha1      true        VMDisk
vminstances               apps.cozystack.io/v1alpha1      true        VMInstance
vpns                      apps.cozystack.io/v1alpha1      true        VPN
```

We can work with them just like regular Kubernetes resources.

Listing S3 Buckets:

```shell
kubectl get buckets.apps.cozystack.io -n tenant-kvaps
```

Example output:

```console
NAME         READY   AGE    VERSION
foo          True    22h    0.1.0
testaasd     True    27h    0.1.0
```

Listing Kubernetes Clusters:

```shell
kubectl get kuberneteses.apps.cozystack.io -n tenant-kvaps
```

Example output:

```console
NAME     READY   AGE    VERSION
abc      False   19h    0.14.0
asdte    True    22h    0.13.0
```

Listing Virtual Machine Disks:

```shell
kubectl get vmdisks.apps.cozystack.io -n tenant-kvaps
```

Example output:

```console
NAME               READY   AGE    VERSION
docker             True    21d    0.1.0
test               True    18d    0.1.0
win2k25-iso        True    21d    0.1.0
win2k25-system     True    21d    0.1.0
```

Listing Virtual Machine Instances:

```shell
kubectl get vminstances.apps.cozystack.io -n tenant-kvaps
```

Example output:

```console
NAME        READY   AGE    VERSION
docker      True    21d    0.1.0
test        True    18d    0.1.0
win2k25     True    20d    0.1.0
```

We can create, modify, and delete each of them, and any interaction with them will be translated
into HelmRelease resources, while also applying the resource structure and prefix in the name.

To see all related Helm releases:

```shell
kubectl get helmreleases -n tenant-kvaps -l cozystack.io/ui
```

Example output:

```console
NAME                     AGE    READY
bucket-foo               22h    True
bucket-testaasd          27h    True
kubernetes-abc           19h    False
kubernetes-asdte         22h    True
redis-test               18d    True
redis-yttt               12d    True
vm-disk-docker           21d    True
vm-disk-test             18d    True
vm-disk-win2k25-iso      21d    True
vm-disk-win2k25-system   21d    True
vm-instance-docker       21d    True
vm-instance-test         18d    True
vm-instance-win2k25      20d    True
```

## Next Steps

We don’t intend to stop here with our API. In the future, we plan to add new features:

- Add validation based on an OpenAPI spec generated directly from Helm charts.
- Develop a controller that collects release notes from deployed releases and shows users
  access information for specific services.
- Revamp our dashboard to work directly with the new API.

## Conclusion

The API Aggregation Layer allowed us to quickly and efficiently solve our problem by providing
a flexible mechanism for extending the Kubernetes API with dynamically registered resources and
converting them on the fly. Ultimately, this made our platform even more flexible and extensible
without the need to write code for each new resource.

You can test the API yourself in the open-source PaaS platform Cozystack,
starting from [version v0.18](https://github.com/aenix-io/cozystack/releases/tag/v0.18.0).
