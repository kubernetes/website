---
title: Networking
---

{% capture overview %}
This page shows how to the various network portions of a cluster work, and how to configure them. 
{% endcapture %}
{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.
{% endcapture %}

Kubernetes supports the [Container Network Interface (CNI)](https://github.com/containernetworking/cni).
This is a network plugin architecture that allows you to use whatever
Kubernetes-friendly SDN you want. Currently this means support for Flannel.  

{% capture steps %}
# Flannel

## Usage

The flannel charm is a
[subordinate](https://jujucharms.com/docs/stable/authors-subordinate-applications).
This charm will require a principal charm that implements the `kubernetes-cni`
interface in order to properly deploy.

```
juju deploy flannel
juju deploy etcd
juju deploy kubernetes-master
juju add-relation flannel kubernetes-master
juju add-relation flannel etcd
```

## Configuration

**iface** The interface to configure the flannel SDN binding. If this value is
empty string or undefined the code will attempt to find the default network
adapter similar to the following command:

```bash
$ route | grep default | head -n 1 | awk {'print $8'}
```

**cidr** The network range to configure the flannel SDN to declare when
establishing networking setup with etcd. Ensure this network range is not active
on layers 2/3 you're deploying to, as it will cause collisions and odd behavior
if care is not taken when selecting a good CIDR range to assign to flannel. It's
also good practice to ensure you allot yourself a large enough IP range to support
how large your cluster will potentially scale.  Class A IP ranges with /24 are
a good option.
{% endcapture %}

{% include templates/task.md %}
