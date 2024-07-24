---
layout: blog
title: 'Completing the largest migration in Kubernetes history'
date: 2024-05-20
slug: completing-cloud-provider-migration
author: >
  Andrew Sy Kim (Google),
  Michelle Au (Google),
  Michael McCune (Red Hat)
---

Since as early as Kubernetes v1.7, the Kubernetes project has pursued the ambitious goal of removing built-in cloud provider integrations.
While these integrations were instrumental in Kubernetes' early development and growth, their removal was driven by two key factors:
the growing complexity of maintaining native support for every cloud provider across millions of lines of Go code, and the desire to establish
Kubernetes as a truly vendor-neutral platform.

After many releases, we're thrilled to announce that all cloud provider integrations have been successfully migrated from the core Kubernetes repository to external plugins.
This migration was a complex and long-running effort due to the numerous impacted components and the critical code paths that relied on the built-in integrations for the
five initial cloud providers: Google Cloud, AWS, Azure, OpenStack, and vSphere. To successfully complete this migration, we had to build four new subsystems from the ground up:

1. [Cloud Controller Manager](https://kubernetes.io/docs/concepts/architecture/cloud-controller/)
2. [API Server Network Proxy](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1281-network-proxy)
3. [Kubelet Credential Provider Plugins](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2133-kubelet-credential-providers)
4. [CSI In-tree Storage migration plugins](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/625-csi-migration/README.md)

Each subsystem was critical to achieve full feature parity with built-in capabilities and required several releases to bring each subsystem to GA-level maturity with a safe and
reliable migration path. More on each subsystem below.

### Cloud Controller Manager

The cloud controller manager was the first external component introduced in this effort, replacing functionality within the kube-controller-manager and kubelet that directly interacted with cloud APIs.
This essential component is responsible for initializing nodes by applying metadata labels that indicate the cloud region and zone a Node is running on, as well as IP addresses that are only known to the cloud provider.
Additionally, it runs the service controller, which is responsible for provisioning cloud load balancers for Services of type LoadBalancer.

![Kubernetes components](/images/docs/components-of-kubernetes.svg)

Learn more about Cloud Controller Manager [here](/docs/concepts/architecture/cloud-controller).

### API Server Network Proxy

The API Server Network Proxy project, initiated in 2018 in collaboration with SIG API Machinery, aimed to replace the SSH tunneler functionality within the kube-apiserver.
This tunneler had been used to securely proxy traffic between the Kubernetes control plane and nodes, but it heavily relied on provider-specific implementation details embedded in the kube-apiserver to establish these SSH tunnels.

Now, the API Server Network Proxy is a GA-level extension point within the kube-apiserver. It offers a generic proxying mechanism that can route traffic from the API server to nodes through a secure proxy,
eliminating the need for the API server to have any knowledge of the specific cloud provider it is running on. This project also introduced the Konnectivity project, which has seen growing adoption in production environments.

Learn more about the API Server Network Proxy [here](https://github.com/kubernetes-sigs/apiserver-network-proxy).

### Kubelet Credential Provider

The Kubelet credential provider plugin was developed to replace the kubelet's built-in functionality for dynamically fetching credentials for image registries hosted on Google Cloud, AWS, or Azure.
This capability was convenient as it allowed the kubelet to seamlessly retrieve short-lived tokens for pulling images from GCR, ECR, or ACR. However, like other areas of the project,
this required the kubelet to have specific knowledge of different cloud environments and APIs.

Introduced in 2019, the credential provider plugin offers a generic extension point for the kubelet to execute plugin binaries that dynamically provide credentials for images hosted on various clouds.
This extensibility expands the kubelet's capabilities to fetch short-lived tokens beyond the initial three cloud providers.

Learn more about Kubelet Credential Provider [here](https://kubernetes.io/docs/tasks/administer-cluster/kubelet-credential-provider/).

### CSI In-tree Storage Migration Plugins

The Container Storage Interface (CSI) is a control plane standard for managing block and file storage systems in Kubernetes and other container orchestrators that went GA in 1.13.
It was designed to replace the in-tree volume plugins built directly into Kubernetes with drivers that can run as Pods within the Kubernetes cluster.
These drivers communicate with kube-controller-manager storage controllers via the Kubernetes API, and with kubelet through a local gRPC endpoint.
Now there are over 100 CSI drivers available across all major cloud and storage vendors, making stateful workloads in Kubernetes a reality.

However, a major challenge remained on how to handle all the existing users of in-tree volume APIs. To retain API backwards compatibility,
we built an API translation layer into our controllers that will convert the in-tree volume API into the equivalent CSI API. This allowed us to redirect all storage operations to the CSI driver,
paving the way for us to remove the code for the built-in volume plugins without removing the API.

Learn more about In-tree Storage migration in [this blog post](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/).

## What’s Next?

This migration has been the primary focus for SIG Cloud Provider over the past few years. With this significant milestone achieved, we will be shifting our efforts towards exploring new
and innovative ways for Kubernetes to better integrate with cloud providers, leveraging the external subsystems we've built over the years. This includes making Kubernetes smarter in
hybrid environments where nodes in the cluster can run on both public and private clouds, as well as providing better tools and frameworks for developers of external providers to simplify and streamline their integration efforts.

With all the new features, tools, and frameworks being planned, SIG Cloud Provider is not forgetting about the other side of the equation: testing. Another area of focus for the SIG's future activities is the improvement of
cloud controller testing to include more providers. The ultimate goal of this effort being to create a testing framework that will include as many providers as possible so that we give the Kubernetes community the highest
levels of confidence about their Kubernetes environments.

If you're using a version older than v1.29 and haven't migrated to an external cloud provider yet, we recommend checking out our previous blog post [Kubernetes 1.29: Cloud Provider Integrations Are Now Separate Components](https://kubernetes.io/blog/2023/12/14/cloud-provider-integration-changes/).
It provides detailed information on the changes we've made and offers guidance on how to migrate to an external provider. Starting in v1.31, in-tree cloud providers will be permanently disabled and removed from core Kubernetes components.

If you’re interested in contributing, come join our [bi-weekly SIG meetings](https://github.com/kubernetes/community/tree/master/sig-cloud-provider#meetings)!