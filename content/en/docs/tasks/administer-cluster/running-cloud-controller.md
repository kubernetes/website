---
reviewers:
- luxas
- thockin
- wlan0
title: Cloud Controller Manager Administration
content_type: concept
weight: 110
---

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.11" >}}

Since cloud providers develop and release at a different pace compared to the
Kubernetes project, abstracting the provider-specific code to the
`{{< glossary_tooltip text="cloud-controller-manager" term_id="cloud-controller-manager" >}}`
binary allows cloud vendors to evolve independently from the core Kubernetes code.

The `cloud-controller-manager` can be linked to any cloud provider that satisfies
[cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go).
For backwards compatibility, the
[cloud-controller-manager](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager)
provided in the core Kubernetes project uses the same cloud libraries as `kube-controller-manager`.
Cloud providers already supported in Kubernetes core are expected to use the in-tree
cloud-controller-manager to transition out of Kubernetes core.

<!-- body -->

## Administration

### Requirements

Every cloud has their own set of requirements for running their own cloud provider
integration, it should not be too different from the requirements when running
`kube-controller-manager`. As a general rule of thumb you'll need:

* cloud authentication/authorization: your cloud may require a token or IAM rules
  to allow access to their APIs
* kubernetes authentication/authorization: cloud-controller-manager may need RBAC
  rules set to speak to the kubernetes apiserver
* high availability: like kube-controller-manager, you may want a high available
  setup for cloud controller manager using leader election (on by default).

### Running cloud-controller-manager

Successfully running cloud-controller-manager requires some changes to your cluster configuration.

* `kubelet`, `kube-apiserver`, and `kube-controller-manager` must be set according to the
  user's usage of external CCM. If the user has an external CCM (not the internal cloud
  controller loops in the Kubernetes Controller Manager), then `--cloud-provider=external`
  must be specified. Otherwise, it should not be specified.

Keep in mind that setting up your cluster to use cloud controller manager will
change your cluster behaviour in a few ways:

* Components that specify `--cloud-provider=external` will add a taint
 `node.cloudprovider.kubernetes.io/uninitialized` with an effect `NoSchedule`
 during initialization. This marks the node as needing a second initialization
 from an external controller before it can be scheduled work. Note that in the
 event that cloud controller manager is not available, new nodes in the cluster
 will be left unschedulable. The taint is important since the scheduler may
 require cloud specific information about nodes such as their region or type
 (high cpu, gpu, high memory, spot instance, etc).
* cloud information about nodes in the cluster will no longer be retrieved using
  local metadata, but instead all API calls to retrieve node information will go
  through cloud controller manager. This may mean you can restrict access to your
  cloud API on the kubelets for better security. For larger clusters you may want
  to consider if cloud controller manager will hit rate limits since it is now
  responsible for almost all API calls to your cloud from within the cluster.

The cloud controller manager can implement:

* Node controller - responsible for updating kubernetes nodes using cloud APIs
  and deleting kubernetes nodes that were deleted on your cloud.
* Service controller - responsible for loadbalancers on your cloud against
  services of type LoadBalancer.
* Route controller - responsible for setting up network routes on your cloud
* any other features you would like to implement if you are running an out-of-tree provider.

## Examples

If you are using a cloud that is currently supported in Kubernetes core and would
like to adopt cloud controller manager, see the
[cloud controller manager in kubernetes core](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager).

For cloud controller managers not in Kubernetes core, you can find the respective
projects in repositories maintained by cloud vendors or by SIGs.

For providers already in Kubernetes core, you can run the in-tree cloud controller
manager as a DaemonSet in your cluster, use the following as a guideline:

{{% code_sample file="admin/cloud/ccm-example.yaml" %}}

## Limitations

Running cloud controller manager comes with a few possible limitations. Although
these limitations are being addressed in upcoming releases, it's important that
you are aware of these limitations for production workloads.

### Support for Volumes

Cloud controller manager does not implement any of the volume controllers found
in `kube-controller-manager` as the volume integrations also require coordination
with kubelets. As we evolve CSI (container storage interface) and add stronger
support for flex volume plugins, necessary support will be added to cloud
controller manager so that clouds can fully integrate with volumes. Learn more
about out-of-tree CSI volume plugins [here](https://github.com/kubernetes/features/issues/178).

### Scalability

The cloud-controller-manager queries your cloud provider's APIs to retrieve
information for all nodes. For very large clusters, consider possible
bottlenecks such as resource requirements and API rate limiting.

### Chicken and Egg

The goal of the cloud controller manager project is to decouple development
of cloud features from the core Kubernetes project. Unfortunately, many aspects
of the Kubernetes project has assumptions that cloud provider features are tightly
integrated into the project. As a result, adopting this new architecture can create
several situations where a request is being made for information from a cloud provider,
but the cloud controller manager may not be able to return that information without
the original request being complete.

A good example of this is the TLS bootstrapping feature in the Kubelet.
TLS bootstrapping assumes that the Kubelet has the ability to ask the cloud provider
(or a local metadata service) for all its address types (private, public, etc)
but cloud controller manager cannot set a node's address types without being
initialized in the first place which requires that the kubelet has TLS certificates
to communicate with the apiserver.

As this initiative evolves, changes will be made to address these issues in upcoming releases.

## {{% heading "whatsnext" %}}

To build and develop your own cloud controller manager, read
[Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).
