---
title: Custom Resources
approvers:
- enisoc
- deads2k
---

{% capture overview %}
This page explains the concept of *custom resources*, which are extensions of the Kubernetes API.  This page shows how to decide when to add a custom resource to your Kubernetes cluster, and when to have a standalone service.  It describes the two ways that custom resources can be added, and how to chose between them.

{% endcapture %}

{% capture body %}
## Custom resources

A *resource* is an endpoint in the [Kubernetes API](/docs/reference/api-overview/) that stores a
collection of [API objects](/docs/concepts/overview/working-with-objects/kubernetes-objects/) of a
certain kind.
For example, the built-in *pods* resource contains a collection of Pod objects.

A *custom resource* is an extension of the Kubernetes API that is not necessarily available on every
Kubernetes cluster.
In other words, it represents a customization of a particular Kubernetes installation.

Custom resources can appear and disappear in a running cluster through dynamic registration,
and cluster admins can update custom resources independently of the cluster itself.
Once a custom resource is installed, users can create and access its objects with
[kubectl](/docs/user-guide/kubectl-overview/), just as they do for built-in resources like *pods*.

### Custom controllers

On their own, custom resources simply let you store and retrieve structured data.
It is only when combined with a *controller* that they become a true
[declarative API](/docs/concepts/overview/working-with-objects/kubernetes-objects/#understanding-kubernetes-objects).
The controller interprets the structured data as a record of the user's desired state,
and continually takes action to achieve and maintain that state.

A *custom controller* is a controller that users can deploy and update on a running cluster,
independently of the cluster's own lifecycle.
Custom controllers can work with any kind of resource, but they are especially effective when
combined with custom resources.
The [Operator](https://coreos.com/blog/introducing-operators.html) pattern is one example of such a
combination. It allows developers to encode domain knowledge for specific applications into an
extension of the Kubernetes API.

### Should I Add a Custom Resource to my Kubernetes Cluster?
When creating a new API, first consider if you should add your API to Kubernetes cluster APIs, or instead let your API stand alone.


<table>
  <tr>
   <td>Consider adding an API to the Kubernetes API if...
   </td>
   <td>Prefer a stand-alone API if...
   </td>
  </tr>
  <tr>
   <td>… your API is Declarative. Typically, this means:<ul>
<li>your API consists of a relatively small number of relatively small objects
<li>the objects define configuration of applications or infrastructure
<li>the objects are updated relatively infrequently
<li>humans often need to read and write the objects
<li>the main operations on the objects are (CRUD) creating, reading, updating and deleting
<li>humans often need to read and write the objects
<li>transactions across objects are not required.</li></ul>
   </td>
   <td>… your API does not fit the Declarative model.  For example, it might:<ul>
<li>need to directly store large amounts of data (e.g. > a few kB per object, or >1000s of objects)
<li>need to be high bandwidth (10s of requests per second sustained)
<li>store end-user data (such as images, PII, etc) or other large-scale data processed by applications<li>
<li>the objects require non-CRUD operations.
<li>the API does is not well modeled as objects.</li></ul>
   </td>
  </tr>
  <tr>
   <td>...you want your new types to be readable and writable using the kubernetes CLI.  For example:<ul>

<li><code>kubectl create -f customresources.{yaml|json}</code>
<li><code>kubectl get myresourcetype myresinstance</code>
<li><code>kubectl delete myresourcetype myresinstance</code>
<li><code>kubectl list myresourcetype</code></li></ul>

   </td>
   <td><code>kubectl</code> support not required
   </td>
  </tr>
  <tr>
   <td>… you want to view your new types in a Kubernetes UI, such as dashboard, alongside built-in types.
   </td>
   <td>Kuberetes UI support not required
   </td>
  </tr>
  <tr>
   <td>… you prefer Declarative/REST/Resource style APIs
   </td>
   <td>... you prefer Imperative/RPC/Operation style APIs [<a href="https://apihandyman.io/do-you-really-know-why-you-prefer-rest-over-rpc/">comparison</a>].
   </td>
  </tr>
  <tr>
   <td>... you are developing a new API. 
   </td>
   <td>… you already have program that serves your API and works just fine. 
   </td>
  </tr>
  <tr>
   <td>… you are willing to accept the format restriction that Kubernetes puts on REST resource paths, such as API Groups, Namespaces, 
<p>
(See the <a href="https://kubernetes.io/docs/reference/api-overview/">API Overview</a>.)
   </td>
   <td>… you need to have specific REST paths to be compatible with an already defined REST API.
   </td>
  </tr>
  <tr>
   <td>... your resources are naturally scoped to a cluster or to namespaces of a cluster; 
   </td>
   <td>... if cluster or namespace scoped resources are a poor fit; you need control over the specifics of resource paths.
   </td>
  </tr>
  <tr>
   <td>... you want to reuse these features of the Kubernetes code:<ul>

<li>Client Libraries for listing, watching, and patching resource.
<li>Authentication
<li>Authorization 
<li>Audit logging 
<li>Garbage collection and hierarchy of resources
<li>Resource metadata such as  labels, annotations, and creation timestamps</li></ul>

   </td>
   <td>… you don't need or have different needs for items to the left. 
<p>
<em>But,</em> see Access Control and Policy Section below for options on how to configuring those which might allow you to continue to use the Kubernetes API.
   </td>
  </tr>
  <tr>
   <td>… you want to reuse these aspects of your cluster environment that may already be set up:<ul>

<li>Existing Kubernetes Service Accounts, and their ability to discover the APIServer
<li>Any built-in or custom Access Control and Policy mechanisms on your cluster.
<li>User's existing Clients which point to your existing cluster.
<li>Hostname, IP and certificate of the existing APIserver, which has already been delivered to clients and is in their  .kube/config file 
<li>Code which already uses in Kubernetes client libraries.
<li>High Availability (if any) of your Kubernetes APIServer(s)
<li>Your API can be acted on by default controllers, e.g. scaled by autoscaler</li></ul>

   </td>
   <td>… you don't need these.
   </td>
  </tr>
</table>



### Should I use a configMap or a User-defined resource?

Sometimes, you just need to store a small amount of plain-old data alongside your other Kubernetes configuration.

Use a ConfigMap if any of the following:



*   there is an existing well documented config file format, such as a mysql.cnf, or pom.xml.
    *   Put the entire config file into one key of a configMap.
*   The main use of the config file is for a program running in a Pod on your cluster to consume the file to configure itself.
*   Consumers of the file prefer to consume via file in a Pod or environment variable in a pod, rather than the Kubernetes API.
*   You want to do rolling updates via Deployment, etc, when the file is updated.

Use a secret, which is similar to a configMap, but more secure, for sensitive data.

Use a custom resource (CRD or Aggregated API) if you want do most of the following:



*   You want to use Kubernetes client libraries and CLIs to create and update the new resource.
*   You want top-level support from kubectl (e.g. `kubectl get my-object object-name`)
*   You want to build new automation that watches for updates on the new object, and then CRUD other objects, or vice versa.
*   You want to write automation that handles updates to the object.
*   You want to use Kubernetes API conventions like having .spec and .status and .metadata.
*   You want to object to be an abstraction over a collection of controlled resources, or summarization of other resources.



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

<table>
  <tr>
   <td colspan="2" >
<strong>Ease of use comparison</strong>
   </td>
  </tr>
  <tr>
   <td>CRDs
   </td>
   <td>Aggregated API
   </td>
  </tr>
  <tr>
   <td>Do not require programming.
<p>
For writing a controller for the custom resources, user can chose any language for the controller.
   </td>
   <td>Requires programming in Go and building binary and image.
<p>
 
<p>
For writing a controller for the custom resources, user can chose any language for the controller.
   </td>
  </tr>
  <tr>
   <td>No additional service to run; CRs are handled by API Server
   </td>
   <td>An additional service to create and that could fail.
   </td>
  </tr>
  <tr>
   <td>No ongoing support once the CRD is created.
<p>
Any bugfixes picked up as part of normal Kubernetes Master upgrades.
   </td>
   <td>May need to periodically pickup bugfixes from upstream and rebuild and update the Aggregated APIserver. 
   </td>
  </tr>
  <tr>
   <td>
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>You don't need to handle multiple versions of your API.<ul>

<li>E.g. when you control the client for this resource, so you can upgrade it in sync with the API.</li></ul>

   </td>
   <td>You need to handle multiple versions of your API.<ul>

<li>E.g. when developing an extension to share with the world.</li></ul>

   </td>
  </tr>
</table>



<table>
  <tr>
   <td colspan="4" ><strong>Flexibility Comparison</strong>
   </td>
  </tr>
  <tr>
   <td>Feature
   </td>
   <td>What it does
   </td>
   <td>CRDs
   </td>
   <td>Aggregated API
   </td>
  </tr>
  <tr>
   <td>Validation
   </td>
   <td rowspan="2" >These help users prevent errors and allow you to evolve your API independently of your clients.  
<p>
These features are most useful when there are many clients, and they can't all update at the same time.
   </td>
   <td>Alpha feature of CRDs in v1.8.  Checks limited to what is supported by OpenAPI v3.0.
   </td>
   <td>Yes, arbitrary validation checks.
   </td>
  </tr>
  <tr>
   <td>Defaulting
   </td>
   <td>No.  But can get same effect with an Initializer. (requires programming).
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>Multi-versioning
   </td>
   <td>Allows serving the same object through two API versions.  Can help ease API changes like renaming fields.
<p>
Less important if you control your client versions.
   </td>
   <td>No.
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>Custom Storage
   </td>
   <td>If you need storage with a different performance mode (e.g. time-series database instead of key-value store) or isolation for security (e.g. encryption secrets or different trust level for admins) or fault isolation.
   </td>
   <td>No.
   </td>
   <td>Yes.
   </td>
  </tr>
  <tr>
   <td>Custom Business Logic
   </td>
   <td>Do arbitrary checks or actions when creating, reading, updating or deleting an object.
   </td>
   <td>No.  But can get some of the same effects with Initializers or Finalizers. (requires programming).
   </td>
   <td>Yes.
   </td>
  </tr>
  <tr>
   <td>Subresources
   </td>
   <td>Add extra operations other than CRUD, such as "scale" or "exec".
<p>
Allows systems like like HorizontalPodAutoscaler and PodDisruptionBudget interact with your new resource. 
<p>
Allows splitting responsibility for setting spec vs status.
<p>
Allows incrementing object Generation on custom resource data mutation (requires Spec/Status split).
   </td>
   <td>No but planned.
   </td>
   <td>Yes.  Any Subresource.
   </td>
  </tr>
  <tr>
   <td>strategic-merge-patch
   </td>
   <td>The new endpoints support PATCH with <code>Content-Type: application/strategic-merge-patch+json</code>.
<p>
Useful for updating objects that may be modified both locally, and by the server.   See: <a href="https://kubernetes.io/docs/tasks/run-application/update-api-object-kubectl-patch/#use-a-strategic-merge-patch-to-update-a-deployment">https://kubernetes.io/docs/tasks/run-application/update-api-object-kubectl-patch/#use-a-strategic-merge-patch-to-update-a-deployment</a>  
   </td>
   <td>No
   </td>
   <td>Yes.
   </td>
  </tr>
  <tr>
   <td>Protocol Buffers
   </td>
   <td>The new resource supports clients that want to use  Protocol Buffers
   </td>
   <td>No
   </td>
   <td>Yes
   </td>
  </tr>
  <tr>
   <td>OpenAPI Schema
   </td>
   <td>Is there an OpenAPI (swagger) schema for the types that can be dynamically fetched from the server?  Is the user protected from misspelling field names by ensuring only allowed fields are set?  Are types enforced (e.g. don't put an int in a string field?)
   </td>
   <td>No but planned.
   </td>
   <td>Yes.
   </td>
  </tr>
</table>



<table>
  <tr>
   <td colspan="2" ><strong>Common Capabilities</strong>
   </td>
  </tr>
  <tr>
   <td><strong>Feature</strong>
   </td>
   <td><strong>What it does</strong>
   </td>
  </tr>
  <tr>
   <td>CRUD
   </td>
   <td>The new endpoints support CRUD basic operations via HTTP
   </td>
  </tr>
  <tr>
   <td>Watch
   </td>
   <td>The new endpoints support Kubernetes Watch operations via HTTP
   </td>
  </tr>
  <tr>
   <td>Discovery
   </td>
   <td>Clients like kubectl and dashboard automatically offer list, display, and field edit operations on your resources.
   </td>
  </tr>
  <tr>
   <td>json-patch
   </td>
   <td>The new endpoints support PATCH with Content-Type: <code>application/json-patch+json</code>.
   </td>
  </tr>
  <tr>
   <td>merge-patch
   </td>
   <td>The new endpoints support PATCH with Content-Type: <code>application/merge-patch+json</code>.
   </td>
  </tr>
  <tr>
   <td>HTTPS
   </td>
   <td>The new endpoints uses HTTPS
   </td>
  </tr>
  <tr>
   <td>Built-in Authentication
   </td>
   <td>Can the extension reuse the core apiserver's authentication?
   </td>
  </tr>
  <tr>
   <td>Built-in 
<p>
Authorization
   </td>
   <td>Can I reuse the authorization scheme of the Core API server (e.g. RBAC).  
   </td>
  </tr>
  <tr>
   <td>Finalizers
   </td>
   <td>Can I have resource deletion block on another client doing something.
   </td>
  </tr>
  <tr>
   <td>Initializers
   </td>
   <td>Can I have resource creation block on another client doing something.
   </td>
  </tr>
  <tr>
   <td>UI/CLI Display
   </td>
   <td>Kubectl, dashboard can display objects of your new type, without modification.
   </td>
  </tr>
  <tr>
   <td>Unset vs Empty
   </td>
   <td>Can clients distinguish unset fields from set to 0 or empty-string fields.
   </td>
  </tr>
</table>


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
