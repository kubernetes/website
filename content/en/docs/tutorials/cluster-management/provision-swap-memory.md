---
reviewers:
- lmktfy
title: Configuring swap memory on Kubernetes nodes
content_type: tutorial
weight: 35
min-kubernetes-server-version: "1.33"
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

You need at least one worker node in your cluster which needs to run a Linux operating system.
It is required for this demo that the kubeadm tool be installed, following the steps outlined in the
[kubeadm installation guide](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm).

On each worker node where you will configure swap use, you need:
* `fallocate`
* `mkswap`
* `swapon`

* For encrypted swap space (recommended), you also need:
* `cryptsetup`

<!-- lessoncontent -->


## Install a swap-enabled cluster with kubeadm

### Create a swap file and turn swap on

If swap is not enabled, there's a need to provision swap on the node. 
The following sections demonstrate creating 4GiB of swap, both in the encrypted and unencrypted case.

{{< tabs name="Create a swap file and turn swap on" >}}

{{% tab name="Setting up encrypted swap" %}}
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

{{% /tab %}}

{{% tab name="Setting up unencrypted swap" %}}
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

{{% /tab %}}

{{< /tabs >}}

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

Using systemd for swap activation allows the system to delay kubelet start until swap is available,
if that is something you want to ensure.
In a similar way, using systemd allows your server to leave swap active until kubelet
(and, typically, your container runtime) have shut down.

### Set up kubelet configuration

After enabling swap on the node, kubelet needs to be configured to use it.
You need to select a [swap behavior](/docs/reference/node/swap-behavior/)
for this node. You'll configure _LimitedSwap_ behavior for this tutorial.

Find and edit the kubelet configuration file, and:

- set `failSwapOn` to false
- set `memorySwap.swapBehavior` to LimitedSwap

```yaml
 # this fragment goes into the kubelet's configuration file
 failSwapOn: false
 memorySwap:
     swapBehavior: LimitedSwap
```

In order for these configurations to take effect, kubelet needs to be restarted. 
Typically you do that by running:
```shell
systemctl restart kubelet.service
```

You should find that the kubelet is now healthy, and that you can run Pods
that use swap memory as needed.
