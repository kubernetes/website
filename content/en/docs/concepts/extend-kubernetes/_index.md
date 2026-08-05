---
title: Extending Kubernetes
weight: 999 # this section should come last
description: Different ways to change the behavior of your Kubernetes cluster.
reviewers:
- erictune
- lavalamp
- cheftako
- chenopis
feature:
  title: Designed for extensibility
  description: >
    Add features to your Kubernetes cluster without changing upstream source code.
content_type: concept
no_list: true
---

<!-- overview -->

Kubernetes is highly configurable and extensible. As a result, there is rarely a need to fork or
submit patches to the Kubernetes project code.

This guide describes the options for customizing a Kubernetes cluster. It is aimed at
{{< glossary_tooltip text="cluster operators" term_id="cluster-operator" >}} who want to understand
how to adapt their Kubernetes cluster to the needs of their work environment. Developers who are
prospective {{< glossary_tooltip text="Platform Developers" term_id="platform-developer" >}} or
Kubernetes Project {{< glossary_tooltip text="Contributors" term_id="contributor" >}} will also
find it useful as an introduction to what extension points and patterns exist, and their
trade-offs and limitations.

Customization approaches can be broadly divided into [configuration](#configuration), which only
involves changing command line arguments, local configuration files, or API resources; and [extensions](#extensions),
which involve running additional programs, additional network services, or both.
This document is primarily about _extensions_.

<!-- body -->

## Configuration

*Configuration files* and *command arguments* are documented in the [Reference](/docs/reference/) section of the online
documentation, with a page for each binary:

* [`kube-apiserver`](/docs/reference/command-line-tools-reference/kube-apiserver/)
* [`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [`kube-scheduler`](/docs/reference/command-line-tools-reference/kube-scheduler/)
* [`kubelet`](/docs/reference/command-line-tools-reference/kubelet/)
* [`kube-proxy`](/docs/reference/command-line-tools-reference/kube-proxy/)

Command arguments and configuration files may not always be changeable in a hosted Kubernetes service or a
distribution with managed installation. When they are changeable, they are usually only changeable
by the cluster operator. Also, they are subject to change in future Kubernetes versions, and
setting them may require restarting processes. For those reasons, they should be used only when
there are no other options.

Built-in *policy APIs*, such as [ResourceQuota](/docs/concepts/policy/resource-quotas/),
[NetworkPolicy](/docs/concepts/services-networking/network-policies/) and Role-based Access Control
([RBAC](/docs/reference/access-authn-authz/rbac/)), are built-in Kubernetes APIs that provide declaratively configured policy settings.
APIs are typically usable even with hosted Kubernetes services and with managed Kubernetes installations.
The built-in policy APIs follow the same conventions as other Kubernetes resources such as Pods.
When you use a policy APIs that is [stable](/docs/reference/using-api/#api-versioning), you benefit from a
[defined support policy](/docs/reference/using-api/deprecation-policy/) like other Kubernetes APIs.
For these reasons, policy APIs are recommended over *configuration files* and *command arguments* where suitable.

## Extensions

Extensions are software components that extend and deeply integrate with Kubernetes.
They adapt it to support new types and new kinds of hardware.

Many cluster administrators use a hosted or distribution instance of Kubernetes.
These clusters come with extensions pre-installed. As a result, most Kubernetes
users will not need to install extensions and even fewer users will need to author new ones.

### Extension patterns

Kubernetes is designed to be automated by writing client programs. Any
program that reads and/or writes to the Kubernetes API can provide useful
automation. *Automation* can run on the cluster or off it. By following
the guidance in this doc you can write highly available and robust automation.
Automation generally works with any Kubernetes cluster, including hosted
clusters and managed installations.

There is a specific pattern for writing client programs that work well with
Kubernetes called the {{< glossary_tooltip term_id="controller" text="controller" >}}
pattern. Controllers typically read an object's `.spec`, possibly do things, and then
update the object's `.status`.

A controller is a client of the Kubernetes API. When Kubernetes is the client and calls
out to a remote service, Kubernetes calls this a *webhook*. The remote service is called
a *webhook backend*. As with custom controllers, webhooks do add a point of failure.

{{< note >}}
Outside of Kubernetes, the term “webhook” typically refers to a mechanism for asynchronous
notifications, where the webhook call serves as a one-way notification to another system or
component. In the Kubernetes ecosystem, even synchronous HTTP callouts are often
described as “webhooks”.
{{< /note >}}

In the webhook model, Kubernetes makes a network request to a remote service.
With the alternative *binary Plugin* model, Kubernetes executes a binary (program).
Binary plugins are used by the kubelet (for example, [CSI storage plugins](https://kubernetes-csi.github.io/docs/)
and [CNI network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)),
and by kubectl (see [Extend kubectl with plugins](/docs/tasks/extend-kubectl/kubectl-plugins/)).

### Extension points

This diagram shows the extension points in a Kubernetes cluster and the
clients that access it.

<!-- image source: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

{{< figure src="/docs/concepts/extend-kubernetes/extension-points.png"
    alt="Symbolic representation of seven numbered extension points for Kubernetes"
    class="diagram-large" caption="Kubernetes extension points" >}}

#### Key to the figure

1. Users often interact with the Kubernetes API using `kubectl`. [Plugins](#client-extensions)
   customise the behaviour of clients. There are generic extensions that can apply to different clients,
   as well as specific ways to extend `kubectl`.

1. The API server handles all requests. Several types of extension points in the API server allow
   authenticating requests, or blocking them based on their content, editing content, and handling
   deletion. These are described in the [API Access Extensions](#api-access-extensions) section.

1. The API server serves various kinds of *resources*. *Built-in resource kinds*, such as
   `pods`, are defined by the Kubernetes project and can't be changed.
   Read [API extensions](#api-extensions) to learn about extending the Kubernetes API.

1. The Kubernetes scheduler [decides](/docs/concepts/scheduling-eviction/assign-pod-node/)
   which nodes to place pods on. There are several ways to extend scheduling, which are
   described in the [Scheduling extensions](#scheduling-extensions) section.

1. Much of the behavior of Kubernetes is implemented by programs called
   {{< glossary_tooltip term_id="controller" text="controllers" >}}, that are
   clients of the API server. Controllers are often used in conjunction with custom resources.
   Read [combining new APIs with automation](#combining-new-apis-with-automation) and
   [Changing built-in resources](#changing-built-in-resources) to learn more.

1. The kubelet runs on servers (nodes), and helps pods appear like virtual servers with their own IPs on
   the cluster network. [Network Plugins](#network-plugins) allow for different implementations of
   pod networking.

1. You can use [Device Plugins](#device-plugins) to integrate custom hardware or other special
   node-local facilities, and make these available to Pods running in your cluster. The kubelet
   includes support for working with device plugins.

   The kubelet also mounts and unmounts
   {{< glossary_tooltip text="volume" term_id="volume" >}} for pods and their containers.
   You can use [Storage Plugins](#storage-plugins) to add support for new kinds
   of storage and other volume types.


#### Extension point choice flowchart {#extension-flowchart}

If you are unsure where to start, this flowchart can help. Note that some solutions may involve
several types of extensions.

<!-- image source for flowchart: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->

{{< figure src="/docs/concepts/extend-kubernetes/flowchart.svg"
    alt="Flowchart with questions about use cases and guidance for implementers. Green circles indicate yes; red circles indicate no."
    class="diagram-large" caption="Flowchart guide to select an extension approach" >}}

---

## Client extensions

Plugins for kubectl are separate binaries that add or replace the behavior of specific subcommands.
The `kubectl` tool can also integrate with [credential plugins](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)
These extensions only affect a individual user's local environment, and so cannot enforce site-wide policies.

If you want to extend the `kubectl` tool, read [Extend kubectl with plugins](/docs/tasks/extend-kubectl/kubectl-plugins/).

## API extensions

### Custom resource definitions

Consider adding a _Custom Resource_ to Kubernetes if you want to define new controllers, application
configuration objects or other declarative APIs, and to manage them using Kubernetes tools, such
as `kubectl`.

For more about Custom Resources, see the
[Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) concept guide.

### API aggregation layer

You can use Kubernetes' [API Aggregation Layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
to integrate the Kubernetes API with additional services such as for [metrics](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/).

### Combining new APIs with automation

A combination of a custom resource API and a control loop is called the
{{< glossary_tooltip term_id="controller" text="controllers" >}} pattern. If your controller takes
the place of a human operator deploying infrastructure based on a desired state, then the controller
may also be following the {{< glossary_tooltip text="operator pattern" term_id="operator-pattern" >}}.
The Operator pattern is used to manage specific applications; usually, these are applications that
maintain state and require care in how they are managed.

You can also make your own custom APIs and control loops that manage other resources, such as storage,
or to define policies (such as an access control restriction).

### Changing built-in resources

When you extend the Kubernetes API by adding custom resources, the added resources always fall
into a new API Groups. You cannot replace or change existing API groups.
Adding an API does not directly let you affect the behavior of existing APIs (such as Pods), whereas
_API Access Extensions_ do.

## API access extensions

When a request reaches the Kubernetes API Server, it is first _authenticated_, then _authorized_,
and is then subject to various types of _admission control_ (some requests are in fact not
authenticated, and get special treatment). See
[Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/)
for more on this flow.

Each of the steps in the Kubernetes authentication / authorization flow offers extension points.

### Authentication

[Authentication](/docs/reference/access-authn-authz/authentication/) maps headers or certificates
in all requests to a username for the client making the request.

Kubernetes has several built-in authentication methods that it supports. It can also sit behind an
authenticating proxy, and it can send a token from an `Authorization:` header to a remote service for
verification (an [authentication webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication))
if those don't meet your needs.

### Authorization

[Authorization](/docs/reference/access-authn-authz/authorization/) determines whether specific
users can read, write, and do other operations on API resources. It works at the level of whole
resources -- it doesn't discriminate based on arbitrary object fields.

If the built-in authorization options don't meet your needs, an
[authorization webhook](/docs/reference/access-authn-authz/webhook/)
allows calling out to custom code that makes an authorization decision.

### Dynamic admission control

After a request is authorized, if it is a write operation, it also goes through
[Admission Control](/docs/reference/access-authn-authz/admission-controllers/) steps.
In addition to the built-in steps, there are several extensions:

* The [Image Policy webhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)
  restricts what images can be run in containers.
* To make arbitrary admission control decisions, a general
  [Admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  can be used. Admission webhooks can reject creations or updates.
  Some admission webhooks modify the incoming request data before it is handled further by Kubernetes.

## Infrastructure extensions

### Device plugins

_Device plugins_ allow a node to discover new Node resources (in addition to the
builtin ones like cpu and memory) via a
[Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/).

### Storage plugins

{{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) plugins provide
a way to extend Kubernetes with supports for new kinds of volumes. The volumes can be backed by
durable external storage, or provide ephemeral storage, or they might offer a read-only interface
to information using a filesystem paradigm.

Kubernetes also includes support for [FlexVolume](/docs/concepts/storage/volumes/#flexvolume) plugins,
which are deprecated since Kubernetes v1.23 (in favour of CSI).

FlexVolume plugins allow users to mount volume types that aren't natively supported by Kubernetes. When
you run a Pod that relies on FlexVolume storage, the kubelet calls a binary plugin to mount the volume.
The archived [FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md)
design proposal has more detail on this approach.

The [Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/master/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors)
includes general information on storage plugins.

### Network plugins

Your Kubernetes cluster needs a _network plugin_ in order to have a working Pod network
and to support other aspects of the Kubernetes network model.

[Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
allow Kubernetes to work with different networking topologies and technologies.

### Kubelet image credential provider plugins

{{< feature-state for_k8s_version="v1.26" state="stable" >}}
Kubelet image credential providers are plugins for the kubelet to dynamically retrieve image registry
credentials. The credentials are then used when pulling images from container image registries that
match the configuration.

The plugins can communicate with external services or use local files to obtain credentials. This way,
the kubelet does not need to have static credentials for each registry, and can support various
authentication methods and protocols.

For plugin configuration details, see
[Configure a kubelet image credential provider](/docs/tasks/administer-cluster/kubelet-credential-provider/).

## Scheduling extensions

The scheduler is a special type of controller that watches pods, and assigns
pods to nodes. The default scheduler can be replaced entirely, while
continuing to use other Kubernetes components, or
[multiple schedulers](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)
can run at the same time.

This is a significant undertaking, and almost all Kubernetes users find they
do not need to modify the scheduler.

You can control which [scheduling plugins](/docs/reference/scheduling/config/#scheduling-plugins)
are active, or associate sets of plugins with different named [scheduler profiles](/docs/reference/scheduling/config/#multiple-profiles).
You can also write your own plugin that integrates with one or more of the kube-scheduler's
[extension points](/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points).

Finally, the built in `kube-scheduler` component supports a
[webhook](https://git.k8s.io/design-proposals-archive/scheduling/scheduler_extender.md)
that permits a remote HTTP backend (scheduler extension) to filter and / or prioritize
the nodes that the kube-scheduler chooses for a pod.

{{< note >}}
You can only affect node filtering
and node prioritization with a scheduler extender webhook; other extension points are
not available through the webhook integration.
{{< /note >}}

## {{% heading "whatsnext" %}}

* Learn more about infrastructure extensions
  * [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  * [Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * CSI [storage plugins](https://kubernetes-csi.github.io/docs/)
* Learn about [kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/)
* Learn more about [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Learn more about [Extension API Servers](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
* Learn about [Dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
* Learn about the [Operator pattern](/docs/concepts/extend-kubernetes/operator/)
