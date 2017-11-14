---
title: Custom Resources
approvers:
- enisoc
- deads2k
---

{% capture overview %}
This page explains [*custom resources*](/docs/concepts/api-extension/custom-resources/), which are extensions of the Kubernetes API. This page explains when to add a custom resource to your Kubernetes cluster and when to use a standalone service. It describes the two methods for adding custom resources and how to choose between them.

{% endcapture %}

{% capture body %}
## Custom resources

A *resource* is an endpoint in the [Kubernetes API](/docs/reference/api-overview/) that stores a collection of [API objects](/docs/concepts/overview/working-with-objects/kubernetes-objects/) of a certain kind. For example, the built-in *pods* resource contains a collection of Pod objects.

A *custom resource* is an extension of the Kubernetes API that is not necessarily available on every
Kubernetes cluster.
In other words, it represents a customization of a particular Kubernetes installation.

Custom resources can appear and disappear in a running cluster through dynamic registration,
and cluster admins can update custom resources independently of the cluster itself.
Once a custom resource is installed, users can create and access its objects with
[kubectl](/docs/user-guide/kubectl-overview/), just as they do for built-in resources like *pods*.

### Custom controllers

On their own, custom resources simply let you store and retrieve structured data.
It is only when combined with a *controller* that they become a true [declarative API](/docs/concepts/overview/working-with-objects/kubernetes-objects/#understanding-kubernetes-objects). The controller interprets the structured data as a record of the user's desired state, and continually takes action to achieve and maintain that state.

A *custom controller* is a controller that users can deploy and update on a running cluster, independently of the cluster's own lifecycle. Custom controllers can work with any kind of resource, but they are especially effective when combined with custom resources. The [Operator](https://coreos.com/blog/introducing-operators.html) pattern is one example of such a combination. It allows developers to encode domain knowledge for specific applications into an extension of the Kubernetes API.

### Should I add a custom resource to my Kubernetes Cluster?

When creating a new API, consider whether to [aggregate your API with the Kubernetes cluster APIs](https://kubernetes.io/docs/concepts/api-extension/apiserver-aggregation/) or  let your API stand alone.

| Consider API aggregation if: | Prefer a stand-alone API if: |
|-|-|
| Your API is Declarative.<br>Typically, this means: <ul><li>your API consists of a relatively small number of relatively small objects</li><li>the objects define configuration of applications or infrastructure the objects are updated relatively infrequently</li><li>humans often need to read and write the objects</li><li>the main operations on the objects are CRUD-y (creating, reading, updating and deleting)</li><li>transactions across objects are not required.</li><ul> | Your API does not fit the Declarative model.<br>For example, it might: <ul><li>need to directly store large amounts of data (e.g. > a few kB per object, or >1000s of objects)</li><li>need to be high bandwidth (10s of requests per second sustained)</li><li>store end-user data (such as images, PII, etc) or other large-scale data processed by applications</li><li>the objects require non-CRUD operations</li><li>the API does is not well modeled as objects.</li></ul> |
| You want your new types to be readable and writable using `kubectl`. For example: <ul><li>`kubectl create -f customresources.{yaml,json}`</li><li>`kubectl get myresourcetype myresinstance`</li><li>`kubectl delete myresourcetype myresinstance`</li><li>`kubectl list myresourcetype`</li></ul> | `kubectl` support is not required |
| You want to view your new types in a Kubernetes UI, such as dashboard, alongside built-in types. | Kuberetes UI support is not required. |
| You prefer Declarative/REST/Resource style APIs. | You prefer Imperative/RPC/Operation style APIs [comparison]. |
| You are developing a new API. | You already have program that serves your API and works well. |
| You are willing to accept the format restriction that Kubernetes puts on REST resource paths, such as API Groups and Namespaces. (See the [API Overview](https://kubernetes.io/docs/concepts/overview/kubernetes-api/).) | You need to have specific REST paths to be compatible with an already defined REST API. |
| Your resources are naturally scoped to a cluster or to namespaces of a cluster. | Cluster or namespace scoped resources are a poor fit; you need control over the specifics of resource paths. |
| You want to reuse these features of the Kubernetes code: <ul><li>Client Libraries for listing, watching, and patching resource.</li><li>Authentication</li><li>Authorization</li><li>Audit logging</li><li>Garbage collection and hierarchy of resources</li><li>Resource metadata such as labels, annotations, and creation timestamps.</li></ul> | You either don't need or have different needs for these features. |
| You want to reuse these aspects of your cluster environment that may already be set up. <br>For example: <ul><li>Existing Kubernetes Service Accounts, and their ability to discover the APIServer</li><li>Any built-in or custom Access Control and Policy mechanisms on your cluster</li><li>User's existing Clients which point to your existing cluster</li><li>Hostname, IP and certificate of the existing APIserver, which has already been delivered to clients and is in their `.kube/config` file</li><li>Code which already uses in Kubernetes client libraries</li><li>High Availability (if any) of your Kubernetes APIServer(s) and etcd</li><li>Your API needs to be acted on by Kubernetes controllers, e.g. scaled by autoscaler</li></ul> | You don't need these features. |

### Should I use a configMap or a user-defined resource?

Sometimes, you just need to store a small amount of plain-old data alongside your other Kubernetes configuration.

Use a ConfigMap if any of the following apply:

* There is an existing, well-documented config file format, such as a `mysql.cnf` or `pom.xml`.
* You want to put the entire config file into one key of a configMap.
* The main use of the config file is for a program running in a Pod on your cluster to consume the file to configure itself.
* Consumers of the file prefer to consume via file in a Pod or environment variable in a pod, rather than the Kubernetes API.
* You want to perform rolling updates via Deployment, etc, when the file is updated.

**Note:** Use a [secret](https://kubernetes.io/docs/concepts/configuration/secret/) for sensitive data, which is similar to a configMap but more secure.
{: .note}

Use a custom resource (CRD or Aggregated API) if most of the following apply:

* You want to use Kubernetes client libraries and CLIs to create and update the new resource.
* You want top-level support from kubectl (for example: `kubectl get my-object object-name`).
* You want to build new automation that watches for updates on the new object, and then CRUD other objects, or vice versa.
* You want to write automation that handles updates to the object.
* You want to use Kubernetes API conventions like `.spec`, `.status`, and `.metadata`.
* You want an object to be an abstraction over a collection of controlled resources, or a summarization of other resources.

## Two Ways to Add Custom Resources

Kubernetes provides two ways to add custom resources to your cluster:

*   [Custom Resource Definitions](https://kubernetes.io/docs/concepts/api-extension/custom-resources/) (CRDs) are easier to use: they do not require any programming in some cases.  
*   [API Aggregation](https://kubernetes.io/docs/concepts/api-extension/apiserver-aggregation/) requires programming, but allows more control over API behaviors like how data is stored, and conversion between API versions.

Kubernetes provides these two options to meet the needs of different users, so that neither ease-of-use nor flexibility is compromised.

Aggregated APIs are subordinate APIServers that sit behind the primary API server, which acts as a proxy.  This arrangement is called [API Aggregation (AA)](docs/concepts/api-extension/apiserver-aggregation.md).  To users, it simply appears that the Kubernetes API is extended.

Custom Resource Definitions (CRDS) allow users to create new types of resources without adding another APIserver.  You do not need to understand API Aggregation to use CRDs.

Regardless of whether they are installed via CRDs or AA, the new resources are called Custom Resources to distinguish them from built-in Kubernetes resources (like pods)

## CustomResourceDefinitions


The [CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/) (CRD) resource is a built-in resource that allows defining Custom Resources.  Defining a CRD object creates an new custom resource, with a name and schema that you specify.  The main Kubernetes API server serves and handles the storage of your Custom Resource.

This frees you from writing your own API server to handle the custom resource,
but the generic nature of the implementation means you have less flexibility than with
[API server aggregation](#api-server-aggregation).

Refer to the [Custom Resource Example](https://github.com/kubernetes/kubernetes/tree/master/staging/src/k8s.io/apiextensions-apiserver/examples/client-go)
for a demonstration of how to register a new custom resource, work with instances of your new resource type,
and setup a controller to handle events.

**Note:** CRD is the successor to the deprecated *ThirdPartyResource* (TPR) API, and is available as of Kubernetes 1.7.
{: .note}

## API server aggregation

Usually, each resource in the Kubernetes API requires code that handles REST requests and manages
persistent storage of objects.
The main Kubernetes API server handles built-in resources like *pods* and *services*,
and can also handle custom resources in a generic way through [CustomResourceDefinitions](#customresourcedefinitions).

The [aggregation layer](/docs/concepts/api-extension/apiserver-aggregation/) allows you to provide specialized
implementations for your custom resources by writing and deploying your own standalone API server.
The main API server delegates requests to you for the custom resources that you handle,
making them available to all of its clients.

### Choosing which method to use to add a User-defined Resource

CRDs is easier to use.  Aggregated APIs are more flexible.  Choose the one that best meets your needs.

Typically, CRDs are a good fit if:



*   You are have a handful of fields
*   You are using the resource within your company, or as part of a small open-source project (as opposed to a commercial product)



#### Ease of Use Comparison

CRDs are easier to create than AAs.

|CRDs|Aggregated API|
|-|-|
|Do not require programming. For writing a controller for the custom resources, user can chose any language for the controller.|Requires programming in Go and building binary and image. For writing a controller for the custom resources, user can chose any language for the controller.|
|No additional service to run; CRs are handled by API Server|An additional service to create and that could fail.|
|No ongoing support once the CRD is created. Any bugfixes picked up as part of normal Kubernetes Master upgrades.|May need to periodically pickup bugfixes from upstream and rebuild and update the Aggregated APIserver.|
|You don't need to handle multiple versions of your API. E.g. when you control the client for this resource, so you can upgrade it in sync with the API.|You need to handle multiple versions of your API. E.g. when developing an extension to share with the world.|
 API|

#### Flexibility Comparison


### Advanted Features and Flexibility
AAs allow for some more advanced API features, and customization of things like the storage layer.

|Feature|What it does|CRDs|Aggregated API|
|-|-|-|
|Validation|These help users prevent errors and allow you to evolve your API independently of your clients. These features are most useful when there are many clients, and they can't all update at the same time.|Alpha feature of CRDs in v1.8. Checks limited to what is supported by OpenAPI v3.0.|Yes, arbitrary validation checks.|
|Defaulting|See above| No. But can get same effect with an Initializer. (requires programming).|Yes|
|Multi-versioning|Allows serving the same object through two API versions. Can help ease API changes like renaming fields. Less important if you control your client versions.|No.|Yes|
|Custom Storage|If you need storage with a different performance mode (e.g. time-series database instead of key-value store) or isolation for security (e.g. encryption secrets or different t|No.|Yes.|
|Custom Business Logic|Do arbitrary checks or actions when creating, reading, updating or deleting an object.|No. But can get some of the same effects with Initializers or Finalizers. (requires programming).|Yes.|
|Subresources|Add extra operations other than CRUD, such as "scale" or "exec". Allows systems like like HorizontalPodAutoscaler and PodDisruptionBudget interact with your new resource. Allows splitting responsibility for setting spec vs status. Allows incrementing object Generation on custom resource data mutation (requires Spec/Status split).|No but planned.|Yes. Any Subresource.|
|strategic-merge-patch|The new endpoints support PATCH with `Content-Type: application/strategic-merge-patch+json`. Useful for updating objects that may be modified both locally, and by the server. See [here](https://kubernetes.io/docs/tasks/run-application/update-api-object-kubectl-patch/)|No|Yes|
|Protocol Buffers|The new resource supports clients that want to use  Protocol Buffers|No|Yes|
|OpenAPI Schema|Is there an OpenAPI (swagger) schema for the types that can be dynamically fetched from the server?  Is the user protected from misspelling field names by ensuring only allowed fields are set?  Are types enforced (e.g. don't put an int in a string field?) |No but planned.|Yes.|

#### Common Features
CRDs and AAs support many of the same features:

|Feature|What it Does|
|-|-|
|CRUD|The new endpoints support CRUD basic operations via HTTP|
|Watch|The new endpoints support Kubernetes Watch operations via HTTP|
|Discovery|Clients like kubectl and dashboard automatically offer list, display, and field edit operations on your resources.|
|json-patch|The new endpoints support PATCH with `Content-Type: application/json-patch+json`.|
|merge-patch|The new endpoints support PATCH with `Content-Type: application/merge-patch+json`.|
|HTTPS|The new endpoints uses HTTPS|
|Built-in Authentication|Can the extension reuse the core apiserver's authentication?|
|Built-in Authorization|Can I reuse the authorization scheme of the Core API server (e.g. RBAC).|
|Finalizers|Can I have resource deletion block on another client doing something.|
|Initializers|Can I have resource creation block on another client doing something.|
|UI/CLI Display|Kubectl, dashboard can display objects of your new type, without modification.|
|Unset vs Empty|Can clients distinguish unset fields from set to 0 or empty-string fields.|


## Preparing to Install a Custom Resource

There are several points to be aware of before adding a custom resource to your cluster.

### Third Party Code and New Points of Failure

Installing a CRD by itself, (meaning creating a resource of kind CustomResourceDefinition), does not cause any "third party code" to run on your apiserver, and does not add any new point of failure.  However packages (such as Charts) or other installation bundles often include CRDs as well as a Deployment of third-party code that implements the business logic for the new Custom Resource.  

Installing an Aggregated APIserver always involves running a new Deployment.  


### Storage

Custom resources consume storage space in the same way that ConfigMaps do.  Watch out for creating too many, as it may overload your APIserver.  Aggregated API Servers may have their own storage, or may use Custom Resources for their storage, in which case the same warning applies.  


### Authentication, Authorization and Auditing

Custom Resources always use the same authentication, authorization, and audit logging as the built-in resources of your API Server.  

If you are using RBAC for authorization, then most RBAC roles will not grant access to the new resources (except the cluster-admin role or any you created with wildcard rules).  You'll need to explicitly grant access to the new resources.  CRDs and Aggregated APIs often come bundled with new role definitions for the types they add.

Aggregated API servers may or may not use the same authentication, authorization and auditing as the primary APIServer.


## Accessing a Custom Resource

Kubernetes [client libraries](https://kubernetes.io/docs/reference/client-libraries/) can be used to access custom resources.  Not all client libraries support custom resources.  The go and python client libraries do.

TODO: talk about how to access the resource from kubectl.  Are binary plugins needed?

TODO: confirm this: When you add a custom resource, you can access it using: your own rest client, a kubernetes dynamic client, a generated client using the open-api spec (is that true?).  When you use api aggregation, you generate a static client from the go-idl. TODO: make glossary and check if these terms are defined on the web site.


{% endcapture %}

{% capture whatsnext %}
* Learn how to [Extend the Kubernetes API with the aggregation layer](/docs/concepts/api-extension/apiserver-aggregation/).
* Learn how to [Extend the Kubernetes API with CustomResourceDefinition](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).
* Learn how to [Migrate a ThirdPartyResource to CustomResourceDefinition](/docs/tasks/access-kubernetes-api/migrate-third-party-resource/).
{% endcapture %}

{% include templates/concept.md %}
