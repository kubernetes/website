---
approvers:
- luxas
- thockin
- wlan0
title: Developing Cloud Controller Manager
---

{% capture overview %}
**Cloud Controller Manager is an alpha feature in 1.8. In upcoming releases it will
be the preferred way to integrate Kubernetes with any cloud. This will ensure cloud providers
can develop their features independantly from the core Kubernetes release cycles.**

{% include templates/glossary/snippet.md term="cloud-controller-manager" length="long" %}
{% endcapture %}

{% capture body %}

# Developing your own Cloud Controller Manager

## Background

Before going into how to build your own cloud controller manager, some background on how it works under the hood is helpful. The cloud controller manager is code from `kube-controller-manager` utilizing Go interfaces to allow implementations from any cloud to be plugged in. Most of the scaffolding and generic controller implementations will be in core, but it will always exec out to the cloud interfaces it is provided, so long as the [cloud provider interface](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go#L29-L50) is satisifed.

To dive a little deeper into implementation details, all cloud controller managers will import packages from Kubernetes core, the only difference being each project will register their own cloud providers by calling [cloudprovider.RegisterCloudProvier](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/plugins.go#L42-L52) where a global variable of available cloud providers is updated. Using DigitalOcean as an example, it [imports the package do](https://github.com/digitalocean/digitalocean-cloud-controller-manager/blob/master/main.go#L34) which then calls [init](https://github.com/digitalocean/digitalocean-cloud-controller-manager/blob/master/do/cloud.go#L81-L86) to add itself to the list of avaiable providers.

## Building

### Out of Tree

To build an out-of-tree cloud-controller-manager for your cloud, follow these steps:

1. Create a go package with an implementation that satisfies [cloudprovider.Interface](https://git.k8s.io/kubernetes/pkg/cloudprovider/cloud.go).
2. Use [main.go in cloud-controller-manager](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/controller-manager.go) from Kubernestes core as a template for your main.go. As mentioned above, the only difference should be the cloud package that will be imported.
3. Import your cloud package in `main.go`, ensure your package has an `init` block to run [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/plugins.go#L42-L52).

Use these out-of-tree cloud providers as examples:
* [DigitalOcean](https://github.com/digitalocean/digitalocean-cloud-controller-manager/blob/master/main.go)
* [keepalived](https://github.com/munnerz/keepalived-cloud-provider/blob/master/main.go)
* [Rancher](https://github.com/rancher/rancher-cloud-controller-manager/blob/master/main.go)

### In Tree

For in-tree cloud providers, you can run the in-tree cloud controller manager as a [Deployment](/docs/tasks/administer-cluster/cloud-controller-manager-deployment-example.yaml) or [Daemonset](/docs/tasks/administer-cluster/cloud-controller-manager-daemonset-example.yaml) in your cluster.

{% endcapture %}
