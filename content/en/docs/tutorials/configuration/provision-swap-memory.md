---
reviewers:
- lmktfy
title: Configuring swap memory on Kubernetes nodes
content_type: tutorial
weight: 30
---

<!-- overview -->

This page provides an example of how to provision and configure swap memory on a Kubernetes node using kubeadm.

<!-- lessoncontent -->

## {{% heading "objectives" %}}

* Provision swap memory on a Kubernetes node using kubeadm.
* Learn to configure both encrypted and unencrypted swap.
* Learn to enable swap on boot.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* The example shown on this page works with `kubectl` 1.14 and above.
* Understand [Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).



<!-- lessoncontent -->


## Install a swap-enabled cluster with kubeadm

### Before you begin

It is required for this demo that the kubeadm tool be installed, following the steps outlined in the
[kubeadm installation guide](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm).
If swap is already enabled on the node, cluster creation may proceed.
If swap is not enabled, please refer to the provided instructions for enabling swap.

Prerequisites for this demo include: `fallocate`, `mkswap`, `swapon`, and `cryptsetup` (for encrypted swap).

### Create a swap file and turn swap on

The following sections demonstrate creating 4GiB of swap, both in the encrypted and unencrypted case.

#### Setting up unencrypted swap

An unencrypted swap file can be set up as follows.

```bash
# Allocate storage and restrict access
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# Format the swap space
mkswap /swapfile

# Activate the swap space for paging
swapon /swapfile
```

#### Setting up encrypted swap

An encrypted swap file can be set up as follows.
Bear in mind that this example uses the `cryptsetup` binary (which is available
on most Linux distributions).

```bash
# Allocate storage and restrict access
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# Create an encrypted device backed by the allocated storage
cryptsetup --type plain --cipher aes-xts-plain64 --key-size 256 -d /dev/urandom open /swapfile cryptswap

# Format the swap space
mkswap /dev/mapper/cryptswap

# Activate the swap space for paging
swapon /dev/mapper/cryptswap
```

#### Verify that swap is enabled

Swap can be verified to be enabled with both `swapon -s` command or the `free` command.

Using `swapon -s`:
```
Filename       Type		Size		Used		Priority
/dev/dm-0      partition 	4194300		0		-2
```

Using `free -h`:
```
               total        used        free      shared  buff/cache   available
Mem:           3.8Gi       1.3Gi       249Mi        25Mi       2.5Gi       2.5Gi
Swap:          4.0Gi          0B       4.0Gi
```

#### Enable swap on boot

After setting up swap, to start the swap file at boot time,
you typically either set up a systemd unit to activate (encrypted) swap, or you
add a line similar to `/swapfile swap swap defaults 0 0` into `/etc/fstab`.

### Set up a Kubernetes cluster that uses swap-enabled nodes

To make things clearer, here is an example kubeadm configuration file `kubeadm-config.yaml` for the swap enabled cluster.

```yaml
---
apiVersion: "kubeadm.k8s.io/v1beta3"
kind: InitConfiguration
---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
failSwapOn: false
memorySwap:
  swapBehavior: LimitedSwap
```

Then create a single-node cluster using `kubeadm init --config kubeadm-config.yaml`.
During init, there is a warning that swap is enabled on the node and in case the kubelet
`failSwapOn` is set to true. We plan to remove this warning in a future release.