---
---

The cluster admin guide is for anyone creating or administering a Kubernetes cluster.
It assumes some familiarity with concepts in the [User Guide](/docs/user-guide/).

* TOC
{:toc}

## Planning a cluster

There are many different examples of how to setup a kubernetes cluster.  Many of them are listed in this
[matrix](/docs/getting-started-guides/).  We call each of the combinations in this matrix a *distro*.

Before choosing a particular guide, here are some things to consider:

 - Are you just looking to try out Kubernetes on your laptop, or build a high-availability many-node cluster? Both
   models are supported, but some distros are better for one case or the other.
 - Will you be using a hosted Kubernetes cluster, such as [GKE](https://cloud.google.com/container-engine), or setting
   one up yourself?
 - Will your cluster be on-premises, or in the cloud (IaaS)?  Kubernetes does not directly support hybrid clusters.  We
   recommend setting up multiple clusters rather than spanning distant locations.
 - Will you be running Kubernetes on "bare metal" or virtual machines?  Kubernetes supports both, via different distros.
 - Do you just want to run a cluster, or do you expect to do active development of kubernetes project code?  If the
   latter, it is better to pick a distro actively used by other developers.  Some distros only use binary releases, but
   offer is a greater variety of choices.
 - Not all distros are maintained as actively.  Prefer ones which are listed as tested on a more recent version of
   Kubernetes.
 - If you are configuring kubernetes on-premises, you will need to consider what [networking
   model](/docs/admin/networking) fits best.
 - If you are designing for very high-availability, you may want [clusters in multiple zones](/docs/admin/multi-cluster).
 - You may want to familiarize yourself with the various
   [components](/docs/admin/cluster-components) needed to run a cluster.

## Setting up a cluster

Pick one of the Getting Started Guides from the [matrix](/docs/getting-started-guides/) and follow it.
If none of the Getting Started Guides fits, you may want to pull ideas from several of the guides.

One option for custom networking is *OpenVSwitch GRE/VxLAN networking* ([ovs-networking.md](/docs/admin/ovs-networking)), which
uses OpenVSwitch to set up networking between pods across
  Kubernetes nodes.

If you are modifying an existing guide which uses Salt, this document explains [how Salt is used in the Kubernetes
project](/docs/admin/salt).

## Managing a cluster, including upgrades

[Managing a cluster](/docs/admin/cluster-management).

## Managing nodes

[Managing nodes](/docs/admin/node).

## Optional Cluster Services

* **DNS Integration with SkyDNS** ([dns.md](/docs/admin/dns)):
  Resolving a DNS name directly to a Kubernetes service.

* **Logging** with [Kibana](/docs/user-guide/logging)

## Multi-tenant support

* **Resource Quota** ([resource-quota.md](/docs/admin/resource-quota))

## Security

* **Kubernetes Container Environment** ([docs/user-guide/container-environment.md](/docs/user-guide/container-environment)):
  Describes the environment for Kubelet managed containers on a Kubernetes
  node.

* **Securing access to the API Server** [accessing the api](/docs/admin/accessing-the-api)

* **Authentication**  [authentication](/docs/admin/authentication)

* **Authorization** [authorization](/docs/admin/authorization)

* **Admission Controllers** [admission_controllers](/docs/admin/admission-controllers)