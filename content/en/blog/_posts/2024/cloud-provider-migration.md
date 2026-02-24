---
layout: blog
title: 'Completing the largest migration in Kubernetes history'
date: 2024-05-20
slug: completing-cloud-provider-migration
author: >
  Andrew Sy Kim (Google),
  Michelle Au (Google),
  Walter Fender (Google),
  Michael McCune (Red Hat)
---

Since as early as Kubernetes v1.7, the Kubernetes project has pursued the ambitious goal of removing built-in cloud provider integrations ([KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)).
While these integrations were instrumental in Kubernetes' early development and growth, their removal was driven by two key factors:
the growing complexity of maintaining native support for every cloud provider across millions of lines of Go code, and the desire to establish
Kubernetes as a truly vendor-neutral platform.

After many releases, we're thrilled to announce that all cloud provider integrations have been successfully migrated from the core Kubernetes repository to external plugins.
In addition to achieving our initial objectives, we've also significantly streamlined Kubernetes by removing roughly 1.5 million lines of code and reducing the binary sizes of core components by approximately 40%.

This migration was a complex and long-running effort due to the numerous impacted components and the critical code paths that relied on the built-in integrations for the
five initial cloud providers: Google Cloud, AWS, Azure, OpenStack, and vSphere. To successfully complete this migration, we had to build four new subsystems from the ground up:

1. **Cloud controller manager** ([KEP-2392](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2392-cloud-controller-manager/README.md))
1. **API server network proxy** ([KEP-1281](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1281-network-proxy))
1. **kubelet credential provider plugins** ([KEP-2133](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2133-kubelet-credential-providers))
1. **Storage migration to use [CSI](https://github.com/container-storage-interface/spec?tab=readme-ov-file#container-storage-interface-csi-specification-)** ([KEP-625](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/625-csi-migration/README.md))

Each subsystem was critical to achieve full feature parity with built-in capabilities and required several releases to bring each subsystem to GA-level maturity with a safe and
reliable migration path. More on each subsystem below.

### Cloud controller manager

The cloud controller manager was the first external component introduced in this effort, replacing functionality within the kube-controller-manager and kubelet that directly interacted with cloud APIs.
This essential component is responsible for initializing nodes by applying metadata labels that indicate the cloud region and zone a Node is running on, as well as IP addresses that are only known to the cloud provider.
Additionally, it runs the service controller, which is responsible for provisioning cloud load balancers for Services of type LoadBalancer.

![Kubernetes components](/images/docs/components-of-kubernetes.svg)

To learn more, read [Cloud Controller Manager](/docs/concepts/architecture/cloud-controller/) in the Kubernetes documentation.

### API server network proxy

The API Server Network Proxy project, initiated in 2018 in collaboration with SIG API Machinery, aimed to replace the SSH tunneler functionality within the kube-apiserver.
This tunneler had been used to securely proxy traffic between the Kubernetes control plane and nodes, but it heavily relied on provider-specific implementation details embedded in the kube-apiserver to establish these SSH tunnels.

Now, the API Server Network Proxy is a GA-level extension point within the kube-apiserver. It offers a generic proxying mechanism that can route traffic from the API server to nodes through a secure proxy,
eliminating the need for the API server to have any knowledge of the specific cloud provider it is running on. This project also introduced the Konnectivity project, which has seen growing adoption in production environments.

You can learn more about the API Server Network Proxy from its [README](https://github.com/kubernetes-sigs/apiserver-network-proxy#readme).

### Credential provider plugins for the kubelet

The Kubelet credential provider plugin was developed to replace the kubelet's built-in functionality for dynamically fetching credentials for image registries hosted on Google Cloud, AWS, or Azure.
The legacy capability was convenient as it allowed the kubelet to seamlessly retrieve short-lived tokens for pulling images from GCR, ECR, or ACR. However, like other areas of Kubernetes, supporting
this required the kubelet to have specific knowledge of different cloud environments and APIs.

Introduced in 2019, the credential provider plugin mechanism offers a generic extension point for the kubelet to execute plugin binaries that dynamically provide credentials for images hosted on various clouds.
This extensibility expands the kubelet's capabilities to fetch short-lived tokens beyond the initial three cloud providers.

To learn more, read [kubelet credential provider for authenticated image pulls](/docs/concepts/containers/images/#kubelet-credential-provider).

### Storage plugin migration from in-tree to CSI

The Container Storage Interface (CSI) is a control plane standard for managing block and file storage systems in Kubernetes and other container orchestrators that went GA in 1.13.
It was designed to replace the in-tree volume plugins built directly into Kubernetes with drivers that can run as Pods within the Kubernetes cluster.
These drivers communicate with kube-controller-manager storage controllers via the Kubernetes API, and with kubelet through a local gRPC endpoint.
Now there are over 100 CSI drivers available across all major cloud and storage vendors, making stateful workloads in Kubernetes a reality.

However, a major challenge remained on how to handle all the existing users of in-tree volume APIs. To retain API backwards compatibility,
we built an API translation layer into our controllers that will convert the in-tree volume API into the equivalent CSI API. This allowed us to redirect all storage operations to the CSI driver,
paving the way for us to remove the code for the built-in volume plugins without removing the API.

You can learn more about In-tree Storage migration in [Kubernetes In-Tree to CSI Volume Migration Moves to Beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/).

## What's next?

This migration has been the primary focus for SIG Cloud Provider over the past few years. With this significant milestone achieved, we will be shifting our efforts towards exploring new
and innovative ways for Kubernetes to better integrate with cloud providers, leveraging the external subsystems we've built over the years. This includes making Kubernetes smarter in
hybrid environments where nodes in the cluster can run on both public and private clouds, as well as providing better tools and frameworks for developers of external providers to simplify and streamline their integration efforts.

With all the new features, tools, and frameworks being planned, SIG Cloud Provider is not forgetting about the other side of the equation: testing. Another area of focus for the SIG's future activities is the improvement of
cloud controller testing to include more providers. The ultimate goal of this effort being to create a testing framework that will include as many providers as possible so that we give the Kubernetes community the highest
levels of confidence about their Kubernetes environments.

If you're using a version of Kubernetes older than v1.29 and haven't migrated to an external cloud provider yet, we recommend checking out our previous blog post [Kubernetes 1.29: Cloud Provider Integrations Are Now Separate Components](/blog/2023/12/14/cloud-provider-integration-changes/).It provides detailed information on the changes we've made and offers guidance on how to migrate to an external provider. Starting in v1.31, in-tree cloud providers will be permanently disabled and removed from core Kubernetes components.

If you’re interested in contributing, come join our [bi-weekly SIG meetings](https://github.com/kubernetes/community/tree/master/sig-cloud-provider#meetings)!