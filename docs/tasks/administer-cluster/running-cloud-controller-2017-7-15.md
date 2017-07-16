---
assignees:
- thockin 
title: Build and Run cloud-controller-manager
redirect_from:
- "/docs/getting-started-guides/running-cloud-controller/"
- "/docs/getting-started-guides/running-cloud-controller.html"
---

Kubernetes version 1.6 contains a new binary called as `cloud-controller-manager`. `cloud-controller-manager` is a daemon that embeds cloud-specific control loops in Kubernetes. These cloud-specific control loops were originally in the kube-controller-manager. However, cloud providers move at a different pace and schedule compared to the Kubernetes project, and abstracting the provider-specific code to the `cloud-controller-manager` binary allows cloud provider vendors to evolve independently from the core Kubernetes code.

The `cloud-controller-manager` can be linked to any cloud provider that satisifies the [cloudprovider.Interface](https://git.k8s.io/kubernetes/pkg/cloudprovider/cloud.go). 
In future Kubernetes releases, cloud vendors should link code that satisfies the above interface to the `cloud-controller-manager` project and compile `cloud-controller-manager` for their own clouds. Cloud providers would also be responsible for maintaining and evolving their code.

* TOC
{:toc}

### Building cloud-controller-manager for your cloud

To build cloud-controller-manager for your cloud, follow these steps:

* Write a cloudprovider that satisfies the [cloudprovider.Interface](https://git.k8s.io/kubernetes/pkg/cloudprovider/cloud.go).
* Link the cloudprovider to cloud-controller-manager

The methods in [cloudprovider.Interface](https://git.k8s.io/kubernetes/pkg/cloudprovider/cloud.go) are self-explanatory. All of the
[existing providers](https://git.k8s.io/kubernetes/pkg/cloudprovider/providers) satisfy this interface. If your cloud is already a part
of the existing providers, you do not need to write a new provider; you can proceed directly with linking your cloud provider to the `cloud-controller-manager`.

Once your code is ready, you must import that code into `cloud-controller-manager`. See the [rancher cloud sample](https://github.com/rancher/rancher-cloud-controller-manager) for a reference example. The import step in the sample is the only step required to link your cloud provider to the `cloud-controller-manager`.

### Running cloud-controller-manager

To run `cloud-controller-manager`, add it to your existing Kubernetes cluster as a Master component. All other master components except `kube-controller-manager` can be run without any changes.

The `kube-controller-manager` should not run any cloud-specific controllers, since the `cloud-controller-manager` takes over this responsibility. To prevent the `kube-controller-manager` from running cloud-specific controllers, you must set the `--cloud-provider` flag in `kube-controller-manager` to `external`.
