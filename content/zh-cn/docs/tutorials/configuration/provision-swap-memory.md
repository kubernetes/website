---
title: 在 Kubernetes 节点上配置交换内存
content_type: tutorial
weight: 35
min-kubernetes-server-version: "1.33"
---
<!--
reviewers:
- lmktfy
title: Configuring swap memory on Kubernetes nodes
content_type: tutorial
weight: 35
min-kubernetes-server-version: "1.33"
-->

<!-- overview -->

<!--
This page provides an example of how to provision and configure swap memory on a Kubernetes node using kubeadm.
-->
本文演示了如何使用 kubeadm 在 Kubernetes 节点上制备和启用交换内存。

<!-- lessoncontent -->

## {{% heading "objectives" %}}

<!--
* Provision swap memory on a Kubernetes node using kubeadm.
* Learn to configure both encrypted and unencrypted swap.
* Learn to enable swap on boot.
-->
* 使用 kubeadm 在 Kubernetes 节点上制备交换内存。
* 学习配置加密和未加密的交换内存。
* 学习如何在系统启动时启用交换内存。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You need at least one worker node in your cluster which needs to run a Linux operating system.
It is required for this demo that the kubeadm tool be installed, following the steps outlined in the
[kubeadm installation guide](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm).
-->
你需要在集群中至少有一个运行 Linux 操作系统的工作节点。
本次演示需要先安装 kubeadm 工具，安装步骤请参考
[kubeadm 安装指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm)。

<!--
On each worker node where you will configure swap use, you need:
* `fallocate`
* `mkswap`
* `swapon`

* For encrypted swap space (recommended), you also need:
* `cryptsetup`
-->
在每个需要配置交换内存的工作节点上，你需要以下工具：

* `fallocate`
* `mkswap`
* `swapon`

对于加密的交换空间（推荐），你还需要：

* `cryptsetup`

<!-- lessoncontent -->

<!--
## Install a swap-enabled cluster with kubeadm

### Create a swap file and turn swap on

If swap is not enabled, there's a need to provision swap on the node. 
The following sections demonstrate creating 4GiB of swap, both in the encrypted and unencrypted case.
-->
## 使用 kubeadm 安装支持交换内存的集群

### 创建交换文件并启用交换内存

如果当前节点未启用交换内存，则需要先**制备**交换空间。
本节将展示如何以加密和未加密的方式创建 4GiB 的交换文件。

<!--
"Create a swap file and turn swap on"
"Setting up encrypted swap"
-->
{{< tabs name="创建交换文件并启用交换内存" >}}

{{% tab name="设置加密的交换内存" %}}

<!--
An encrypted swap file can be set up as follows.
Bear in mind that this example uses the `cryptsetup` binary (which is available
on most Linux distributions).
-->
你可以使用如下命令设置加密的交换文件。
请注意，此示例使用的是 `cryptsetup` 工具（在大多数 Linux 发行版中都可用）：

<!--
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
-->
```bash
# 分配存储空间并限制访问权限
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# 基于已分配的存储空间创建加密设备
cryptsetup --type plain --cipher aes-xts-plain64 --key-size 256 -d /dev/urandom open /swapfile cryptswap

# 格式化此交换空间
mkswap /dev/mapper/cryptswap

# 为换页激活交换空间
swapon /dev/mapper/cryptswap
```

{{% /tab %}}

<!--
"Setting up unencrypted swap"
-->
{{% tab name="设置未加密的交换内存" %}}
<!--
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
-->
未加密的交换文件可以按以下方式配置：

```bash
# 分配存储空间并限制访问权限
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# 格式化此交换空间
mkswap /swapfile

# 为换页激活交换空间
swapon /swapfile
```

{{% /tab %}}

{{< /tabs >}}

<!--
#### Verify that swap is enabled

Swap can be verified to be enabled with both `swapon -s` command or the `free` command.

Using `swapon -s`:
-->
#### 验证交换内存是否启用

你可以使用 `swapon -s` 命令或 `free` 命令来验证交换内存是否启用。

使用 `swapon -s`：

```
Filename       Type		Size		Used		Priority
/dev/dm-0      partition 	4194300		0		-2
```

使用 `free -h`：
<!--
Using `free -h`:
-->

```
               total        used        free      shared  buff/cache   available
Mem:           3.8Gi       1.3Gi       249Mi        25Mi       2.5Gi       2.5Gi
Swap:          4.0Gi          0B       4.0Gi
```

<!--
#### Enable swap on boot

After setting up swap, to start the swap file at boot time,
you typically either set up a systemd unit to activate (encrypted) swap, or you
add a line similar to `/swapfile swap swap defaults 0 0` into `/etc/fstab`.

Using systemd for swap activation allows the system to delay kubelet start until swap is available,
if that is something you want to ensure.
In a similar way, using systemd allows your server to leave swap active until kubelet
(and, typically, your container runtime) have shut down.
-->
#### 引导时启用交换内存

在设置好交换内存后，若要在系统引导时启动交换文件，通常有两种做法：
你可以设置一个 systemd 单元来激活（加密的）交换内存，或者在
`/etc/fstab` 文件中添加类似于 `/swapfile swap swap defaults 0 0` 的行。

使用 systemd 激活交换内存，可以确保在交换内存可用之前延迟启动 kubelet（如果你有这个需求）。
同样，使用 systemd 还可以让服务器在 kubelet（以及通常的容器运行时）关闭之前保持交换内存处于启用状态。

<!--
### Set up kubelet configuration

After enabling swap on the node, kubelet needs to be configured in the following way:

```yaml
 # this fragment goes into the kubelet's configuration file
 failSwapOn: false
 memorySwap:
     swapBehavior: LimitedSwap
```

In order for these configurations to take effect, kubelet needs to be restarted.
-->
### 配置 kubelet  {#set-up-kubelet-configuration}

在节点上启用交换内存后，需要按如下方式配置 kubelet：

```yaml
# 此代码片段应添加到 kubelet 的配置文件中
failSwapOn: false
memorySwap:
    swapBehavior: LimitedSwap
```

为了使这些配置生效，需重启 kubelet。
