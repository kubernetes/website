---
assignees:
- thockin 
title: Building and Running cloud-controller-manager
---

Release 1.6 of Kubernetes ships with a new binary known as cloud-controller-manager. This is a daemon that embeds cloud
specific control loops in kubernetes. These cloud specific control loops were originally in the kube-controller-manager. However,
cloudproviders move at a different pace and schedule compared to the kubernetes project, and this binary allows the cloudprovider vendors
and kubernetes core to evolve independently. 

The cloud-controller-manager is designed to be linked with any cloudprovider that satisifies the [cloudprovider.Interface](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go). 
In the future, cloud vendors would be expected to link code(that satisfies the above interface) to this project and compile cloud-controller-manager for their own clouds. They
would also be responsible for maintaining and evolving their code.

* TOC
{:toc}

### Building cloud-controller-manager for your cloud

In order to build cloud-controller-manager for your cloud, you need to follow these steps:

* Write a cloudprovider that satisfies the [cloudprovider.Interface](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go).
* Link the cloudprovider to cloud-controller-manager

The methods in [cloudprovider.Interface](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go) are self-explanatory. All of the
[existing providers](https://github.com/kubernetes/kubernetes/tree/master/pkg/cloudprovider/providers) satisfy this interface. If your cloud is already a part
of the existing providers, then you do not need to write a new provider. You can directly skip to the step of linking you cloudprovider to the cloud-controller-manager.

Once you have the code ready, you need to import that code into the cloud-controller-manager. There is a sample cloud-controller-manager with the rancher cloud for your 
reference [here](https://github.com/rancher/rancher-cloud-controller-manager). The import is the only step required to link your cloudprovider to the cloud-controller-manager.

### Running cloud-controller-manager

The cloud-controller-manager can be added to your existing kubernetes cluster as a Master component. All other master components, except kube-controller-manager can be run without any changes.
The kube-controller-manager should not run any cloud specific controllers, since the cloud-controller-manager takes over this responsibility. In order to prevent the kube-controller-manager from
running cloud specific controllers, you need to set the `--cloud-provider` flag in kube-controller-manager to "external"
