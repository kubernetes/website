---
title: 在 Kubernetes 節點上配置交換內存
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
本文演示瞭如何使用 kubeadm 在 Kubernetes 節點上製備和啓用交換內存。

<!-- lessoncontent -->

## {{% heading "objectives" %}}

<!--
* Provision swap memory on a Kubernetes node using kubeadm.
* Learn to configure both encrypted and unencrypted swap.
* Learn to enable swap on boot.
-->
* 使用 kubeadm 在 Kubernetes 節點上製備交換內存。
* 學習配置加密和未加密的交換內存。
* 學習如何在系統啓動時啓用交換內存。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
You need at least one worker node in your cluster which needs to run a Linux operating system.
It is required for this demo that the kubeadm tool be installed, following the steps outlined in the
[kubeadm installation guide](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm).
-->
你需要在集羣中至少有一個運行 Linux 操作系統的工作節點。
本次演示需要先安裝 kubeadm 工具，安裝步驟請參考
[kubeadm 安裝指南](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm)。

<!--
On each worker node where you will configure swap use, you need:
* `fallocate`
* `mkswap`
* `swapon`

* For encrypted swap space (recommended), you also need:
* `cryptsetup`
-->
在每個需要配置交換內存的工作節點上，你需要以下工具：

* `fallocate`
* `mkswap`
* `swapon`

對於加密的交換空間（推薦），你還需要：

* `cryptsetup`

<!-- lessoncontent -->

<!--
## Install a swap-enabled cluster with kubeadm

### Create a swap file and turn swap on

If swap is not enabled, there's a need to provision swap on the node. 
The following sections demonstrate creating 4GiB of swap, both in the encrypted and unencrypted case.
-->
## 使用 kubeadm 安裝支持交換內存的集羣

### 創建交換文件並啓用交換內存

如果當前節點未啓用交換內存，則需要先**製備**交換空間。
本節將展示如何以加密和未加密的方式創建 4GiB 的交換文件。

<!--
"Create a swap file and turn swap on"
"Setting up encrypted swap"
-->
{{< tabs name="創建交換文件並啓用交換內存" >}}

{{% tab name="設置加密的交換內存" %}}

<!--
An encrypted swap file can be set up as follows.
Bear in mind that this example uses the `cryptsetup` binary (which is available
on most Linux distributions).
-->
你可以使用如下命令設置加密的交換文件。
請注意，此示例使用的是 `cryptsetup` 工具（在大多數 Linux 發行版中都可用）：

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
# 分配存儲空間並限制訪問權限
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# 基於已分配的存儲空間創建加密設備
cryptsetup --type plain --cipher aes-xts-plain64 --key-size 256 -d /dev/urandom open /swapfile cryptswap

# 格式化此交換空間
mkswap /dev/mapper/cryptswap

# 爲換頁激活交換空間
swapon /dev/mapper/cryptswap
```

{{% /tab %}}

<!--
"Setting up unencrypted swap"
-->
{{% tab name="設置未加密的交換內存" %}}
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
未加密的交換文件可以按以下方式配置：

```bash
# 分配存儲空間並限制訪問權限
fallocate --length 4GiB /swapfile
chmod 600 /swapfile

# 格式化此交換空間
mkswap /swapfile

# 爲換頁激活交換空間
swapon /swapfile
```

{{% /tab %}}

{{< /tabs >}}

<!--
#### Verify that swap is enabled

Swap can be verified to be enabled with both `swapon -s` command or the `free` command.

Using `swapon -s`:
-->
#### 驗證交換內存是否啓用

你可以使用 `swapon -s` 命令或 `free` 命令來驗證交換內存是否啓用。

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
#### 引導時啓用交換內存

在設置好交換內存後，若要在系統引導時啓動交換文件，通常有兩種做法：
你可以設置一個 systemd 單元來激活（加密的）交換內存，或者在
`/etc/fstab` 文件中添加類似於 `/swapfile swap swap defaults 0 0` 的行。

使用 systemd 激活交換內存，可以確保在交換內存可用之前延遲啓動 kubelet（如果你有這個需求）。
同樣，使用 systemd 還可以讓服務器在 kubelet（以及通常的容器運行時）關閉之前保持交換內存處於啓用狀態。

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

在節點上啓用交換內存後，需要按如下方式配置 kubelet：

```yaml
# 此代碼片段應添加到 kubelet 的配置文件中
failSwapOn: false
memorySwap:
    swapBehavior: LimitedSwap
```

爲了使這些配置生效，需重啓 kubelet。
