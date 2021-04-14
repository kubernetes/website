---
layout: blog
title: 'Three Tenancy Models For Kubernetes'
date: 2021-04-15
slug: three-tenancy-models-for-kubernetes
---

**Authors:** Ryan Bezdicek (Medtronic), Jim Bugwadia (Nirmata), Tasha Drew (VMware),  Fei Guo (Alibaba), Adrian Ludwin (Google)

Kubernetes clusters are typically used by several teams in an organization. In other cases, Kubernetes may be used to deliver applications to end users requiring segmentation and isolation of resources across users from different organizations. Secure sharing of Kubernetes control plane and worker node resources allows maximizing productivity and saving costs in both cases.

The Kubernetes Multi-Tenancy Working Group is chartered with defining tenancy models for Kubernetes and making it easier to operationalize tenancy related use cases. This blog post, from the working group members, describes three common tenancy models and introduces related working group projects.

We will also be presenting on this content and discussing different use cases at our Kubecon EU 2021 panel session, [Multi-tenancy vs. Multi-cluster: When Should you Use What?](https://sched.co/iE66).

## Namespaces as a Service

With the *namespaces-as-a-service* model, tenants share a cluster and tenant workloads are restricted to a set of Namespaces assigned to the tenant. The cluster control plane resources like the API server and scheduler, and worker node resources like CPU, memory, etc. are available for use across all tenants. 

To isolate tenant workloads, each namespace must also contain:
* **[role bindings](/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding):** for controlling access to the namespace
* **[network policies](/docs/concepts/services-networking/network-policies/):** to prevent network traffic across tenants
* **[resource quotas](/docs/concepts/policy/resource-quotas/):** to limit usage and ensure fairness across tenants

With this model, tenants share cluster-wide resources like ClusterRoles and CustomResourceDefinitions (CRDs) and hence cannot create or update these cluster-wide resources.

The [Hierarchical Namespace Controller (HNC)](/blog/2020/08/14/introducing-hierarchical-namespaces/) project makes it easier to manage namespace based tenancy by allowing users to create additional namespaces under a namespace, and propagating resources within the namespace hierarchy. This allows self-service namespaces for tenants, without requiring cluster-wide permissions.

The [Multi-Tenancy Benchmarks (MTB)](https://github.com/kubernetes-sigs/multi-tenancy/tree/master/benchmarks) project provides benchmarks and a command-line tool that performs several configuration and runtime checks to report if tenant namespaces are properly isolated and the necessary security controls are implemented.

## Clusters as a Service

With the *clusters-as-a-service* usage model, each tenant gets their own cluster.  This model allows tenants to have different versions of cluster-wide resources such as CRDs, and provides full isolation of the Kubernetes control plane.

The tenant clusters may be provisioned using projects like [Cluster API (CAPI)](https://cluster-api.sigs.k8s.io/) where a management cluster is used to provision multiple workload clusters. A workload cluster is assigned to a tenant and tenants have full control over cluster resources. Note that in most enterprises a central platform team may be responsible for managing required add-on services such as security and monitoring services, and for providing cluster lifecycle management services such as patching and upgrades. A tenant administrator may be restricted from modifying the centrally managed services and other critical cluster information. 

## Control planes as a Service

In a variation of the *clusters-as-a-service* model, the tenant cluster may be a **virtual cluster** where each tenant gets their own dedicated Kubernetes control plane but share worker node resources. As with other forms of virtualization, users of a virtual cluster see no significant differences between a virtual cluster and other Kubernetes clusters. This is sometimes referred to as `Control Planes as a Service` (CPaaS).

A virtual cluster of this type shares worker node resources and workload state independent control plane components, like the scheduler. Other workload aware control-plane components, like the API server, are created on a per-tenant basis to allow overlaps, and additional components are used to synchronize and manage state across the per-tenant control plane and the underlying shared cluster resources. With this model users can manage their own cluster-wide resources. 

The [Virtual Cluster](https://github.com/kubernetes-sigs/multi-tenancy/tree/master/incubator/virtualcluster) project implements this model, where a `supercluster` is shared by multiple `virtual clusters`. The [Cluster API Nested](https://github.com/kubernetes-sigs/cluster-api-provider-nested) project is extending this work to conform to the CAPI model, allowing use of familiar API resources to provision and manage virtual clusters.

## Security considerations

Cloud native security involves different system layers and lifecycle phases as described in the [Cloud Native Security Whitepaper](https://kubernetes.io/blog/2020/11/18/cloud-native-security-for-your-clusters) from CNCF SIG Security.  Without proper security measures implemented across all layers and phases, Kubernetes tenant isolation can be compromised and a security breach with one tenant can threaten other tenants.

It is important for any new user to Kubernetes to realize that the default installation of a new upstream Kubernetes cluster is not secure, and you are going to need to invest in hardening it in order to avoid security issues.

At a minimum, the following security measures are required:
* image scanning: container image vulnerabilities can be exploited to execute commands and access additional resources. 
* [RBAC](/docs/reference/access-authn-authz/rbac/): for *namespaces-as-a-service* user roles and permissions must be properly configured at a per-namespace level; for other models tenants may need to be restricted from accessing centrally managed add-on services and other cluster-wide resources.
* [network policies](/docs/concepts/services-networking/network-policies/): for *namespaces-as-a-service* default network policies that deny all ingress and egress traffic are recommended to prevent cross-tenant network traffic and may also be used as a best practice for other tenancy models.
* [Kubernetes Pod Security Standards](/docs/concepts/security/pod-security-standards/): to enforce Pod hardening best practices the `Restricted` policy is recommended as the default for tenant workloads with exclusions configured only as needed.
* [CIS Benchmarks for Kubernetes](https://www.cisecurity.org/benchmark/kubernetes/): the CIS Benchmarks for Kubernetes guidelines should be used to properly configure Kubernetes control-plane and worker node components.

Additional recommendations include using:
* policy engines: for configuration security best practices, such as only allowing trusted registries.  
* runtime scanners: to detect and report runtime security events.
* VM-based container sandboxing: for stronger data plane isolation.

While proper security is required independently of tenancy models, not having essential security controls like [pod security](/docs/concepts/security/pod-security-standards/) in a shared cluster provides attackers with means to compromise tenancy models and possibly access sensitive information across tenants increasing the overall risk profile.

## Summary

A 2020 CNCF survey showed that production Kubernetes usage has increased by over 300% since 2016. As an increasing number of Kubernetes workloads move to production, organizations are looking for ways to share Kubernetes resources across teams for agility and cost savings. 

The **namespaces as a service** tenancy model allows sharing clusters and hence enables resource efficiencies. However, it requires proper security configurations and has limitations as all tenants share the same cluster-wide resources. 

The **clusters as a service** tenancy model addresses these limitations, but with higher management and resource overhead. 

The **control planes as a service** model provides a way to share resources of a single Kubernetes cluster and also let tenants manage their own cluster-wide resources. Sharing worker node resources increases resource effeciencies, but also exposes cross tenant security and isolation concerns that exist for shared clusters.

 In many cases, organizations will use multiple tenancy models to address different use cases and as different product and development teams will have varying needs. Following security and management best practices, such as applying [Pod Security Standards](/docs/concepts/security/pod-security-standards/) and not using the `default` namespace, makes it easer to switch from one model to another.

The [Kubernetes Multi-Tenancy Working Group](https://github.com/kubernetes-sigs/multi-tenancy) has created several projects like [Hierarchical Namespaces Controller](https://github.com/kubernetes-sigs/multi-tenancy/tree/master/incubator/hnc), [Virtual Cluster](https://github.com/kubernetes-sigs/multi-tenancy/tree/master/incubator/virtualcluster) / [CAPI Nested](https://github.com/kubernetes-sigs/cluster-api-provider-nested), and [Multi-Tenancy Benchmarks](https://github.com/kubernetes-sigs/multi-tenancy/tree/master/benchmarks) to make it easier to provision and manage multi-tenancy models.

If you are interested in multi-tenancy topics, or would like to share your use cases, please join us in an upcoming [community meeting](https://github.com/kubernetes/community/blob/master/wg-multitenancy/README.md) or reach out on the *wg-multitenancy channel* on the [Kubernetes slack](https://slack.k8s.io/).


