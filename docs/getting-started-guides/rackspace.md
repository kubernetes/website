---
assignees:
- erictune
title: CoreOS on Rackspace
---

* Supported Version: v0.18.1

In general, the dev-build-and-up.sh workflow for Rackspace is the similar to Google Compute Engine. The specific implementation is different due to the use of CoreOS, Rackspace Cloud Files and the overall network design.

These scripts should be used to deploy development environments for Kubernetes. If your account leverages RackConnect or non-standard networking, these scripts will most likely not work without modification.

NOTE: The rackspace scripts do NOT rely on `saltstack` and instead rely on cloud-init for configuration.

The current cluster design is inspired by:

- [corekube](https://github.com/metral/corekube)
- [Angus Lees](https://github.com/anguslees/kube-openstack)

* TOC
{:toc}

## Prerequisites

1. Python2.7
2. You need to have both `nova` and `swiftly` installed. It's recommended to use a python virtualenv to install these packages into.
3. Make sure you have the appropriate environment variables set to interact with the OpenStack APIs. See [Rackspace Documentation](http://docs.rackspace.com/servers/api/v2/cs-gettingstarted/content/section_gs_install_nova.html) for more details.

## Provider: Rackspace

- To build your own released version from source use `export KUBERNETES_PROVIDER=rackspace` and run the `bash hack/dev-build-and-up.sh`
- Note: The get.k8s.io install method is not working yet for our scripts.
  * To install the latest released version of Kubernetes use `export KUBERNETES_PROVIDER=rackspace; wget -q -O - https://get.k8s.io | bash`

## Build

1. The Kubernetes binaries will be built via the common build scripts in `build/`.
2. If you've set the ENV `KUBERNETES_PROVIDER=rackspace`, the scripts will upload `kubernetes-server-linux-amd64.tar.gz` to Cloud Files.
2. A cloud files container will be created via the `swiftly` CLI and a temp URL will be enabled on the object.
3. The built `kubernetes-server-linux-amd64.tar.gz` will be uploaded to this container and the URL will be passed to master/nodes when booted.

## Cluster

There is a specific `cluster/rackspace` directory with the scripts for the following steps:

1. A cloud network will be created and all instances will be attached to this network.
  - flanneld uses this network for next hop routing. These routes allow the containers running on each node to communicate with one another on this private network.
2. An SSH key will be created and uploaded if needed. This key must be used to ssh into the machines (we do not capture the password).
3. The master server and additional nodes will be created via the `nova` CLI. A `cloud-config.yaml` is generated and provided as user-data with the entire configuration for the systems.
4. We then boot as many nodes as defined via `$NUM_NODES`.

## Some notes

- The scripts expect `eth2` to be the cloud network that the containers will communicate across.
- A number of the items in `config-default.sh` are overridable via environment variables.
- For older versions please either:
 * Sync back to `v0.9` with `git checkout v0.9`
  * Download a [snapshot of `v0.9`](https://github.com/kubernetes/kubernetes/archive/v0.9.tar.gz)
 * Sync back to `v0.3` with `git checkout v0.3`
  * Download a [snapshot of `v0.3`](https://github.com/kubernetes/kubernetes/archive/v0.3.tar.gz)

## Network Design

- eth0 - Public Interface used for servers/containers to reach the internet
- eth1 - ServiceNet - Intra-cluster communication (k8s, etcd, etc.) communicate via this interface. The `cloud-config` files use the special CoreOS identifier `$private_ipv4` to configure the services.
- eth2 - Cloud Network - Used for k8s pods to communicate with one another. The proxy service will pass traffic via this interface.

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Rackspace            | CoreOS       | CoreOS | flannel     | [docs](/docs/getting-started-guides/rackspace)                              |          | Community ([@doublerr](https://github.com/doublerr))


For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
