---
reviewers:
- luxas
- thockin
- wlan0
title: Developing Cloud Controller Manager
content_template: templates/concept
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.11" state="beta" >}}
In upcoming releases, Cloud Controller Manager will
be the preferred way to integrate Kubernetes with any cloud. This will ensure cloud providers
can develop their features independently from the core Kubernetes release cycles.

{{< feature-state for_k8s_version="1.8" state="alpha" >}}

Before going into how to build your own cloud controller manager, some background on how it works under the hood is helpful. The cloud controller manager is code from `kube-controller-manager` utilizing Go interfaces to allow implementations from any cloud to be plugged in. Most of the scaffolding and generic controller implementations will be in core, but it will always exec out to the cloud interfaces it is provided, so long as the [cloud provider interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go#L42-L62) is satisfied.

To dive a little deeper into implementation details, all cloud controller managers will import packages from Kubernetes core, the only difference being each project will register their own cloud providers by calling [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go#L56-L66) where a global variable of available cloud providers is updated.

{{% /capture %}}


{{% capture body %}}

## Developing

### Out of Tree

To build an out-of-tree cloud-controller-manager for your cloud, follow these steps:

1. Create a go package with an implementation that satisfies [cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go).
2. Use [main.go in cloud-controller-manager](https://github.com/kubernetes/kubernetes/blob/master/cmd/cloud-controller-manager/controller-manager.go) from Kubernetes core as a template for your main.go. As mentioned above, the only difference should be the cloud package that will be imported.
3. Import your cloud package in `main.go`, ensure your package has an `init` block to run [cloudprovider.RegisterCloudProvider](https://github.com/kubernetes/cloud-provider/blob/master/plugins.go).

Using existing out-of-tree cloud providers as an example may be helpful. You can find the list [here](/docs/tasks/administer-cluster/running-cloud-controller.md#examples).

### In Tree

For in-tree cloud providers, you can run the in-tree cloud controller manager as a [Daemonset](/examples/admin/cloud/ccm-example.yaml) in your cluster. See the [running cloud controller manager docs](/docs/tasks/administer-cluster/running-cloud-controller.md) for more details.

{{% /capture %}}
