---
title: Installing Kubernetes with KRIB
krib-version: 2.4
author: Rob Hirschfeld (zehicle)
weight: 20
---

## Overview

This guide helps to install a Kubernetes cluster hosted on bare metal with [Digital Rebar Provision](https://github.com/digitalrebar/provision) using only its Content packages and *kubeadm*.

Digital Rebar Provision (DRP) is an integrated Golang DHCP, bare metal provisioning (PXE/iPXE) and workflow automation platform. While [DRP can be used to invoke](https://provision.readthedocs.io/en/tip/doc/integrations/ansible.html) [kubespray](/docs/setup/custom-cloud/kubespray), it also offers a self-contained Kubernetes installation known as [KRIB (Kubernetes Rebar Integrated Bootstrap)](https://github.com/digitalrebar/provision-content/tree/master/krib).

{{< note >}}
KRIB is not a _stand-alone_ installer: Digital Rebar templates drive a standard *[kubeadm](/docs/admin/kubeadm/)* configuration that manages the Kubernetes installation with the [Digital Rebar cluster pattern](https://provision.readthedocs.io/en/tip/doc/arch/cluster.html#rs-cluster-pattern) to elect leaders _without external supervision_.
{{< /note >}}


KRIB features:

* zero-touch, self-configuring cluster without pre-configuration or inventory
* very fast, no-ssh required automation
* bare metal, on-premises focused platform
* highly available cluster options (including splitting etcd from the controllers)
* dynamic generation of a TLS infrastructure
* composable attributes and automatic detection of hardware by profile
* options for persistent, immutable and image-based deployments
* support for Ubuntu 18.04, CentOS/RHEL 7, CoreOS, RancherOS and others

## Creating a cluster

Review [Digital Rebar documentation](https://https://provision.readthedocs.io/en/tip/README.html) for details about installing the platform.

The Digital Rebar Provision Golang binary should be installed on a Linux-like system with 16 GB of RAM or larger (Packet.net Tiny and Rasberry Pi are also acceptable).

### (1/5) Discover servers

Following the [Digital Rebar installation](https://provision.readthedocs.io/en/tip/doc/quickstart.html), allow one or more servers to boot through the _Sledgehammer_ discovery process to register with the API. This will automatically install the Digital Rebar runner and to allow for next steps.

### (2/5) Install KRIB Content and Certificate Plugin

Upload the KRIB Content bundle (or build from [source](https://github.com/digitalrebar/provision-content/tree/master/krib)) and the Cert Plugin for your DRP platform. Both are freely available via the [RackN UX](https://portal.rackn.io) or using the upload from catalog feature of the DRPCLI (shown below).

```
drpcli plugin_providers upload certs from catalog:certs-stable
drpcli contents upload catalog:krib-stable
```

### (3/5) Start your cluster deployment

{{< note >}}
KRIB documentation is dynamically generated from the source and will be more up to date than this guide.
{{< /note >}}

Following the [KRIB documentation](https://provision.readthedocs.io/en/tip/doc/content-packages/krib.html), create a Profile for your cluster and assign your target servers into the cluster Profile. The Profile must set `krib\cluster-name` and `etcd\cluster-name` Params to be the name of the Profile. Cluster configuration choices can be made by adding additional Params to the Profile; however, safe defaults are provided for all Params.

Once all target servers are assigned to the cluster Profile, start a KRIB installation Workflow by assigning one of the included Workflows to all cluster servers. For example, selecting `krib-live-cluster` will perform an immutable deployment into the Sledgehammer discovery operating system. You may use one of the pre-created read-only Workflows or choose to build your own custom variation.

For basic installs, no further action is required. Advanced users may choose to assign the controllers, etcd servers or other configuration values in the relevant Params.

### (4/5) Monitor your cluster deployment

Digital Rebar Provision provides detailed logging and live updates during the installation process. Workflow events are available via a websocket connection or monitoring the Jobs list.

During the installation, KRIB writes cluster configuration data back into the cluster Profile.

### (5/5) Access your cluster

The cluster is available for access via *kubectl* once the `krib/cluster-admin-conf` Param has been set. This Param contains the `kubeconfig` information necessary to access the cluster.

For example, if you named the cluster Profile `krib` then the following commands would allow you to connect to the installed cluster from your local terminal.

  ::

    drpcli profiles get krib params krib/cluster-admin-conf > admin.conf
    export KUBECONFIG=admin.conf
    kubectl get nodes


The installation continues after the `krib/cluster-admin-conf` is set to install the Kubernetes UI and Helm. You may interact with the cluster as soon as the `admin.conf` file is available.

## Cluster operations

KRIB provides additional Workflows to manage your cluster. Please see the [KRIB documentation](https://provision.readthedocs.io/en/tip/doc/content-packages/krib.html) for an updated list of advanced cluster operations.

### Scale your cluster

You can add servers into your cluster by adding the cluster Profile to the server and running the appropriate Workflow.

### Cleanup your cluster (for developers)

You can reset your cluster and wipe out all configuration and TLS certificates using the `krib-reset-cluster` Workflow on any of the servers in the cluster.

{{< caution >}}
When running the reset Workflow, be sure not to accidentally target your production cluster!
{{< /caution >}}

## Feedback

* Slack Channel: [#community](https://rackn.slack.com/messages/community/)
* [GitHub Issues](https://github.com/digitalrebar/provision/issues)
