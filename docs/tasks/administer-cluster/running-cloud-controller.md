---
approvers:
- thockin
title: Kubernetes Cloud Controller Manager
---

{% capture overview %}
**Cloud Controller Manager is an alpha feature in 1.8. In upcoming releases it will
be the preferred way to integrate Kubernetes with any cloud. This will ensure cloud providers
can develop their features independantly from [Kubernetes core](https://github.com/kubernetes/kubernetes).

{% include templates/glossary/snippet.md term="cloud-controller-manager" length="long" %}
{% endcapture %}

{% capture body %}

## Cloud Controller Manager

Kubernetes v1.6 introduced a new binary called `cloud-controller-manager`. `cloud-controller-manager` is a daemon that embeds cloud-specific control loops. These cloud-specific control loops were originally in the `kube-controller-manager`. Since cloud providers develop and release at a different pace compared to the Kubernetes project, abstracting the provider-specific code to the `cloud-controller-manager` binary allows cloud provider vendors to evolve independently from the core Kubernetes code.

The `cloud-controller-manager` can be linked to any cloud provider that satisifies [cloudprovider.Interface](https://git.k8s.io/kubernetes/pkg/cloudprovider/cloud.go). For backwards compatibility, the [cloud-controller-manager](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager) provided in the core Kubernetes project uses the same cloud libraries as `kube-controller-manager`. Cloud providers already supported in Kubernetes core are expected to use the in-project cloud-controller-manager to transition out of Kubernetes core. In future Kubernetes releases, all cloud controller managers will be developed outside of the core Kubernetes project managed by sig leads or cloud vendors.

* TOC
{:toc}

## Administration

### Requirements

Every cloud has their own set of requirements for running `cloud-controller-manager`, it should not be too different from the requirements when running `kube-controller-manager`. As a general rule of thumb you'll need:

* cloud authentication/authorization: your cloud may require a token or IAM rules to allow access to their APIs
* kubernetes authentication/authorization: cloud-controller-manager may need abac/rbac set to speak to the kubernetes apiserver
* high availabilty: like kube-controller-manager, you may want a high available setup for cloud controller manager using leader election.

### Running cloud-controller-manager

Successfully running cloud-controller-manager requires some changes to your cluster configuration.

* `kube-apiserver` and `kube-controller-manager` must either specify no cloud provider or the `external` cloud provider for the flag `--cloud-provider`. This ensures that it does not run any cloud specific loops that would be run by cloud controller manager.
* `kubelet` must run with `--cloud-provider=external`. This is to ensure that the kubelet is aware that it must be initialized by the cloud controller manager before it is scheduled any work.

Keep in mind that setting up your cluster to use cloud controller manager will change your cluster behaviour in a few ways:

* kubelets specifying `--cloud-provider=external` will add a [taint during initialization](https://github.com/kubernetes/kubernetes/blob/master/plugin/pkg/scheduler/algorithm/well_known_labels.go#L51-L55). This marks the node as needing a second initialization from an external controller before it can be scheduled work. Note that in the event that cloud controller manager is not available, new nodes in the cluster will be left unscheduable. The taint is important since the scheduler may require cloud specific information about nodes such as it's region or type (high cpu, gpu, high memory, spot instance, etc).
* cloud information about nodes in the cluster will no longer be retrieved using local metadata, but instead all API calls to retreive node information will go through cloud controller manager. This may mean you can restrict access to your cloud API on the kubelets for better security. For larger clusters you may want to consider if cloud controller manager will hit rate limits since it is now responsible for almost all API calls to your cloud from within the cluster.


As of v1.8, cloud controller manager can implement:

* node controller - responsible for updating nodes using cloud APIs.
* service controller - responsible for loadbalancers on your cloud against services of type LoadBalancer.
* route controller - responsible for setting up network routes on your cloud
* persistent volume label controller - responsible for labeling persistent volumes on your cloud - ensure that the persistent volume label admission plugin is not enabled on your kube-apiserver.


## Examples

If you are using a cloud that is currently supported in Kubernetes core and would like to adopt cloud controller manager, see the [cloud controller manager in kubernetes core](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager).

For cloud controller managers not in Kubernetes core, you can find the respective projects in repos maintained by cloud vendors or sig leads.

* [DigitalOcean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [Rancher](https://github.com/rancher/rancher-cloud-controller-manager)


## Developing your own Cloud Controller Manager

### Background

Before going into how to build your own cloud controller manager, some background on how it works under the hood is helpful. The cloud controller manager is code from `kube-controller-manager` utilizing Go interfaces to allow implementations from any cloud to be plugged in. Most of the logic for the cloud controller manager will still live in Kubernetes core but the implementations for each cloud can develop at any pace, so long as the [cloud provider interface](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go#L29-L50) is satisifed.

To dive a little deeper into implementation details, all cloud controller managers will import packages from Kubernetes core, the only difference being each project will register their own cloud providers by calling [cloudprovider.RegisterCloudProvier](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/plugins.go#L42-L52) where a global variable of available cloud providers is updated.

### Building

To build cloud-controller-manager for your cloud, follow these steps:

1. Create a go package with an implementation that satisfies [cloudprovider.Interface](https://git.k8s.io/kubernetes/pkg/cloudprovider/cloud.go).
2. Use [main.go in cloud-controller-manager](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/controller-manager.go) from Kubernestes core as a template for your main.go.
3. Import your cloud package in `main.go`, ensure your package has an `init` block to run [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/plugins.go#L42-L52).

Use [DigitalOcean](https://github.com/digitalocean/digitalocean-cloud-controller-manager/blob/master/main.go) and [Racher](https://github.com/rancher/rancher-cloud-controller-manager/blob/master/main.go) cloud controller managers as examples!

{% endcapture %}
