---
title: Networking
---

{% capture overview %}
Kubernetes supports the [Container Network Interface (CNI)](https://github.com/containernetworking/cni).
This is a network plugin architecture that allows you to use whatever
Kubernetes-friendly SDN you want. Currently this means support for Flannel and Canal.

This page shows how the various network portions of a cluster work and how to configure them.
{% endcapture %}
{% capture prerequisites %}
This page assumes you have a working Juju deployed cluster.

**Note:** Note that if you deploy a cluster via conjure-up or the CDK bundles, manually deploying CNI plugins is unnecessary.
{: .note}
{% endcapture %}


{% capture steps %}
The CNI charms are [subordinates](https://jujucharms.com/docs/stable/authors-subordinate-applications).
These charms will require a principal charm that implements the `kubernetes-cni` interface in order to properly deploy.

## Flannel

```
juju deploy flannel
juju add-relation flannel kubernetes-master
juju add-relation flannel kubernetes-worker
juju add-relation flannel etcd
```

## Canal

```
juju deploy canal
juju add-relation canal kubernetes-master
juju add-relation canal kubernetes-worker
juju add-relation canal etcd
```

### Configuration

**iface** The interface to configure the flannel or canal SDN binding. If this value is
empty string or undefined the code will attempt to find the default network
adapter similar to the following command:

```bash
$ route | grep default | head -n 1 | awk {'print $8'}
```

**cidr** The network range to configure the flannel or canal SDN to declare when
establishing networking setup with etcd. Ensure this network range is not active
on layers 2/3 you're deploying to, as it will cause collisions and odd behavior
if care is not taken when selecting a good CIDR range to assign to flannel. It's
also good practice to ensure you allot yourself a large enough IP range to support
how large your cluster will potentially scale.  Class A IP ranges with /24 are
a good option.
{% endcapture %}

{% include templates/task.md %}
