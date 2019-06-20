---
reviewers:
- davidopp
- lavalamp
title: Cluster Administration Overview
content_template: templates/concept
weight: 10
---

{{% capture overview %}}
The cluster administration overview is for anyone creating or administering a Kubernetes cluster.
It assumes some familiarity with core Kubernetes [concepts](/docs/concepts/).
{{% /capture %}}

{{% capture body %}}
## Planning a cluster

See the guides in [Setup](/docs/setup/) for examples of how to plan, set up, and configure Kubernetes clusters. The solutions listed in this article are called *distros*.

Before choosing a guide, here are some considerations:

 - Do you just want to try out Kubernetes on your computer, or do you want to build a high-availability, multi-node cluster? Choose distros best suited for your needs.
 - **If you are designing for high-availability**, learn about configuring [clusters in multiple zones](/docs/concepts/cluster-administration/federation/).
 - Will you be using **a hosted Kubernetes cluster**, such as [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/), or **hosting your own cluster**?
 - Will your cluster be **on-premises**, or **in the cloud (IaaS)**? Kubernetes does not directly support hybrid clusters. Instead, you can set up multiple clusters.
 - **If you are configuring Kubernetes on-premises**, consider which [networking model](/docs/concepts/cluster-administration/networking/) fits best.
 - Will you be running Kubernetes on **"bare metal" hardware** or on **virtual machines (VMs)**?
 - Do you **just want to run a cluster**, or do you expect to do **active development of Kubernetes project code**? If the
   latter, choose an actively-developed distro. Some distros only use binary releases, but
   offer a greater variety of choices.
 - Familiarize yourself with the [components](/docs/admin/cluster-components/) needed to run a cluster.

Note: Not all distros are actively maintained. Choose distros which have been tested with a recent version of Kubernetes.

## Managing a cluster

* [Managing a cluster](/docs/tasks/administer-cluster/cluster-management/) describes several topics related to the lifecycle of a cluster: creating a new cluster, upgrading your cluster’s master and worker nodes, performing node maintenance (e.g. kernel upgrades), and upgrading the Kubernetes API version of a running cluster.

* Learn how to [manage nodes](/docs/concepts/nodes/node/).

* Learn how to set up and manage the [resource quota](/docs/concepts/policy/resource-quotas/) for shared clusters.

## Securing a cluster

* [Certificates](/docs/concepts/cluster-administration/certificates/) describes the steps to generate certificates using different tool chains.

* [Kubernetes Container Environment](/docs/concepts/containers/container-environment-variables/) describes the environment for Kubelet managed containers on a Kubernetes node.

* [Controlling Access to the Kubernetes API](/docs/reference/access-authn-authz/controlling-access/) describes how to set up permissions for users and service accounts.

* [Authenticating](/docs/reference/access-authn-authz/authentication/) explains authentication in Kubernetes, including the various authentication options.

* [Authorization](/docs/reference/access-authn-authz/authorization/) is separate from authentication, and controls how HTTP calls are handled.

* [Using Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/) explains plug-ins which intercepts requests to the Kubernetes API server after authentication and authorization.

* [Using Sysctls in a Kubernetes Cluster](/docs/concepts/cluster-administration/sysctl-cluster/) describes to an administrator how to use the `sysctl` command-line tool to set kernel parameters .

* [Auditing](/docs/tasks/debug-application-cluster/audit/) describes how to interact with Kubernetes' audit logs.

### Securing the kubelet
  * [Master-Node communication](/docs/concepts/architecture/master-node-communication/)
  * [TLS bootstrapping](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/)
  * [Kubelet authentication/authorization](/docs/admin/kubelet-authentication-authorization/)

## Optional Cluster Services

* [DNS Integration](/docs/concepts/services-networking/dns-pod-service/) describes how to resolve a DNS name directly to a Kubernetes service.

* [Logging and Monitoring Cluster Activity](/docs/concepts/cluster-administration/logging/) explains how logging in Kubernetes works and how to implement it.

{{% /capture %}}


