---
title: 利用 kubeadm 建立高可用叢集
content_type: task
weight: 60
---

<!--
reviewers:
- sig-cluster-lifecycle
title: Creating Highly Available Clusters with kubeadm
content_type: task
weight: 60
-->

<!-- overview -->

<!--
This page explains two different approaches to setting up a highly available Kubernetes
cluster using kubeadm:

- With stacked control plane nodes. This approach requires less infrastructure. The etcd members
  and control plane nodes are co-located.
- With an external etcd cluster. This approach requires more infrastructure. The
  control plane nodes and etcd members are separated.

-->
本文講述了使用 kubeadm 設定一個高可用的 Kubernetes 叢集的兩種不同方式：

- 使用具有堆疊的控制平面節點。這種方法所需基礎設施較少。etcd 成員和控制平面節點位於同一位置。
- 使用外部叢集。這種方法所需基礎設施較多。控制平面的節點和 etcd 成員是分開的。

<!--
Before proceeding, you should carefully consider which approach best meets the needs of your applications
and environment. [Options for Highly Available topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/) outlines the advantages and disadvantages of each.

If you encounter issues with setting up the HA cluster, please report these
in the kubeadm [issue tracker](https://github.com/kubernetes/kubeadm/issues/new).

See also the [upgrade documentation](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15).
-->
在下一步之前，你應該仔細考慮哪種方法更好的滿足你的應用程式和環境的需求。 
[高可用拓撲選項](/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology/) 講述了每種方法的優缺點。

如果你在安裝 HA 叢集時遇到問題，請在 kubeadm [問題跟蹤](https://github.com/kubernetes/kubeadm/issues/new)裡向我們提供反饋。

你也可以閱讀[升級文件](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
<!--
This page does not address running your cluster on a cloud provider. In a cloud
environment, neither approach documented here works with Service objects of type
LoadBalancer, or with dynamic PersistentVolumes.
-->
{{< caution >}}
這篇文件沒有講述在雲提供商上執行叢集的問題。在雲環境中，此處記錄的方法不適用於型別為 LoadBalancer 的服務物件，或者具有動態的 PersistentVolumes。
{{< /caution >}}



## {{% heading "prerequisites" %}}


<!--
The prerequisites depend on which topology you have selected for your cluster's
control plane:
-->
根據叢集控制平面所選擇的拓撲結構不同，準備工作也有所差異：

{{< tabs name="prerequisite_tabs" >}}
{{% tab name="堆疊（Stacked） etcd 拓撲" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    external etc tab
-->
<!--
You need:

- Three or more machines that meet [kubeadm's minimum requirements](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) for
  the control-plane nodes. Having an odd number of control plane nodes can help
  with leader selection in the case of machine or zone failure.
  - including a {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, already set up and working
- Three or more machines that meet [kubeadm's minimum
  requirements](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) for the workers
  - including a container runtime, already set up and working
- Full network connectivity between all machines in the cluster (public or
  private network)
- Superuser privileges on all machines using `sudo`
  - You can use a different tool; this guide uses `sudo` in the examples.
- SSH access from one device to all nodes in the system
- `kubeadm` and `kubelet` already installed on all machines.

_See [Stacked etcd topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/#stacked-etcd-topology) for context._
-->
需要準備：

- 配置滿足 [kubeadm 的最低要求](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#準備開始)
  的三臺機器作為控制面節點。奇數臺控制平面節點有利於機器故障或者網路分割槽時進行重新選主。
  - 機器已經安裝好{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}，並正常執行
- 配置滿足 [kubeadm 的最低要求](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#準備開始)
  的三臺機器作為工作節點
  - 機器已經安裝好{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}，並正常執行
- 在叢集中，確保所有計算機之間存在全網路連線（公網或私網）
- 在所有機器上具有 sudo 許可權
  - 可以使用其他工具；本教程以 `sudo` 舉例
- 從某臺裝置透過 SSH 訪問系統中所有節點的能力
- 所有機器上已經安裝 `kubeadm` 和 `kubelet`

_拓撲詳情請參考[堆疊（Stacked）etcd 拓撲](/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology/#堆疊-stacked-etcd-拓撲)。_
{{% /tab %}}
{{% tab name="外部 etcd 拓撲" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    stacked etc tab
-->
<!--
You need:

- Three or more machines that meet [kubeadm's minimum requirements](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) for
  the control-plane nodes. Having an odd number of control plane nodes can help
  with leader selection in the case of machine or zone failure.
  - including a {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}, already set up and working
- Three or more machines that meet [kubeadm's minimum
  requirements](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) for the workers
  - including a container runtime, already set up and working
- Full network connectivity between all machines in the cluster (public or
  private network)
- Superuser privileges on all machines using `sudo`
  - You can use a different tool; this guide uses `sudo` in the examples.
- SSH access from one device to all nodes in the system
- `kubeadm` and `kubelet` already installed on all machines.
-->
需要準備：

- 配置滿足 [kubeadm 的最低要求](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#準備開始)
  的三臺機器作為控制面節點。奇數臺控制平面節點有利於機器故障或者網路分割槽時進行重新選主。
  - 機器已經安裝好{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}，並正常執行
- 配置滿足 [kubeadm 的最低要求](/zh-cn/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#準備開始)
  的三臺機器作為工作節點
  - 機器已經安裝好{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}，並正常執行
- 在叢集中，確保所有計算機之間存在全網路連線（公網或私網）
- 在所有機器上具有 sudo 許可權
  - 可以使用其他工具；本教程以 `sudo` 舉例
- 從某臺裝置透過 SSH 訪問系統中所有節點的能力
- 所有機器上已經安裝 `kubeadm` 和 `kubelet`
<!-- end of shared prerequisites -->
<!--
And you also need:
- Three or more additional machines, that will become etcd cluster members.
  Having an odd number of members in the etcd cluster is a requirement for achieving
  optimal voting quorum.
  - These machines again need to have `kubeadm` and `kubelet` installed.
  - These machines also require a container runtime, that is already set up and working.
-->
還需要準備：
- 給 etcd 叢集使用的另外三臺及以上機器。為了分散式一致性演算法達到更好的投票效果，叢集必須由奇數個節點組成。
  - 機器上已經安裝 `kubeadm` 和 `kubelet`。
  - 機器上同樣需要安裝好容器執行時，並能正常執行。
<!--
_See [External etcd topology](/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology) for context._
-->
_拓撲詳情請參考[外部 etcd 拓撲](/zh-cn/docs/setup/production-environment/tools/kubeadm/ha-topology/#外部-etcd-拓撲)。_
{{% /tab %}}
{{< /tabs >}}

<!-- ### Container images -->
### 容器映象

<!--
Each host should have access read and fetch images from the Kubernetes container image registry, `k8s.gcr.io`.
If you want to deploy a highly-available cluster where the hosts do not have access to pull images, this is possible. You must ensure by some other means that the correct container images are already available on the relevant hosts.
-->
每臺主機需要能夠從 Kubernetes 容器映象倉庫（ `k8s.gcr.io` ）讀取和拉取映象。
想要在無法拉取 Kubernetes 倉庫映象的機器上部署高可用叢集也是可行的。透過其他的手段保證主機上已經有對應的容器映象即可。

<!-- ### Command line interface {#kubectl} -->
### 命令列  {#kubectl}

<!--
To manage Kubernetes once your cluster is set up, you should
[install kubectl](/docs/tasks/tools/#kubectl) on your PC. It is also useful
to install the `kubectl` tool on each control plane node, as this can be
helpful for troubleshooting.
-->
一旦叢集建立成功，需要在 PC 上[安裝 kubectl](/zh-cn/docs/tasks/tools/#kubectl) 用於管理 Kubernetes。為了方便故障排查，也可以在每個控制平面節點上安裝 `kubectl`。

<!-- steps -->

<!--
## First steps for both methods

### Create load balancer for kube-apiserver
-->
## 這兩種方法的第一步

### 為 kube-apiserver 建立負載均衡器

<!--
There are many configurations for load balancers. The following example is only one
option. Your cluster requirements may need a different configuration.
-->
{{< note >}}
使用負載均衡器需要許多配置。你的叢集搭建可能需要不同的配置。
下面的例子只是其中的一方面配置。
{{< /note >}}

<!--
1. Create a kube-apiserver load balancer with a name that resolves to DNS.

   - In a cloud environment you should place your control plane nodes behind a TCP
     forwarding load balancer. This load balancer distributes traffic to all
     healthy control plane nodes in its target list. The health check for
     an apiserver is a TCP check on the port the kube-apiserver listens on
     (default value `:6443`).

   - It is not recommended to use an IP address directly in a cloud environment.

   - The load balancer must be able to communicate with all control plane nodes
     on the apiserver port. It must also allow incoming traffic on its
     listening port.

   - Make sure the address of the load balancer always matches
     the address of kubeadm's `ControlPlaneEndpoint`.

   - Read the [Options for Software Load Balancing](https://git.k8s.io/kubeadm/docs/ha-considerations.md#options-for-software-load-balancing)
     guide for more details.
-->
1. 建立一個名為 kube-apiserver 的負載均衡器解析 DNS。

   - 在雲環境中，應該將控制平面節點放置在 TCP 轉發負載平衡後面。
     該負載均衡器將流量分配給目標列表中所有執行狀況良好的控制平面節點。
     API 伺服器的健康檢查是在 kube-apiserver 的監聽埠（預設值 `:6443`）
     上進行的一個 TCP 檢查。

   - 不建議在雲環境中直接使用 IP 地址。

   - 負載均衡器必須能夠在 API 伺服器埠上與所有控制平面節點通訊。
     它還必須允許其監聽埠的入站流量。

   - 確保負載均衡器的地址始終匹配 kubeadm 的 `ControlPlaneEndpoint` 地址。

   - 閱讀[軟體負載平衡選項指南](https://git.k8s.io/kubeadm/docs/ha-considerations.md#options-for-software-load-balancing)
     以獲取更多詳細資訊。

<!--
1. Add the first control plane nodes to the load balancer and test the
   connection:

   ```sh
   nc -v LOAD_BALANCER_IP PORT
   ```

   - A connection refused error is expected because the apiserver is not yet
     running. A timeout, however, means the load balancer cannot communicate
     with the control plane node. If a timeout occurs, reconfigure the load
     balancer to communicate with the control plane node.

1. Add the remaining control plane nodes to the load balancer target group.
-->
2. 新增第一個控制平面節點到負載均衡器並測試連線：

   ```shell
   nc -v LOAD_BALANCER_IP PORT
   ```

   由於 apiserver 尚未執行，預期會出現一個連線拒絕錯誤。
   然而超時意味著負載均衡器不能和控制平面節點通訊。
   如果發生超時，請重新配置負載均衡器與控制平面節點進行通訊。

3. 將其餘控制平面節點新增到負載均衡器目標組。

<!--
## Stacked control plane and etcd nodes

### Steps for the first control plane node
-->
## 使用堆控制平面和 etcd 節點

### 控制平面節點的第一步

<!--
1. Initialize the control plane:

   ```sh
   sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
   ```
   - You can use the `--kubernetes-version` flag to set the Kubernetes version to use.
     It is recommended that the versions of kubeadm, kubelet, kubectl and Kubernetes match.
   - The `--control-plane-endpoint` flag should be set to the address or DNS and port of the load balancer.

   - The `--upload-certs` flag is used to upload the certificates that should be shared
     across all the control-plane instances to the cluster. If instead, you prefer to copy certs across
     control-plane nodes manually or using automation tools, please remove this flag and refer to [Manual
     certificate distribution](#manual-certs) section bellow.
-->
1. 初始化控制平面：

   ```shell
   sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
   ```

   - 你可以使用 `--kubernetes-version` 標誌來設定要使用的 Kubernetes 版本。
     建議將 kubeadm、kebelet、kubectl 和 Kubernetes 的版本匹配。
   - 這個 `--control-plane-endpoint` 標誌應該被設定成負載均衡器的地址或 DNS 和埠。
   - 這個 `--upload-certs` 標誌用來將在所有控制平面例項之間的共享證書上傳到叢集。
     如果正好相反，你更喜歡手動地透過控制平面節點或者使用自動化工具複製證書，
     請刪除此標誌並參考如下部分[證書分配手冊](#manual-certs)。

   <!--
   The `kubeadm init` flags `--config` and `--certificate-key` cannot be mixed, therefore if you want
   to use the [kubeadm configuration](/docs/reference/config-api/kubeadm-config.v1beta3/) you must add the `certificateKey` field in the appropriate config locations (under `InitConfiguration` and `JoinConfiguration: controlPlane`).
   -->
   {{< note >}}
   標誌 `kubeadm init`、`--config` 和 `--certificate-key` 不能混合使用，
   因此如果你要使用
   [kubeadm 配置](/docs/reference/config-api/kubeadm-config.v1beta3/)，你必須在相應的配置結構
   （位於 `InitConfiguration` 和 `JoinConfiguration: controlPlane`）新增 `certificateKey` 欄位。
   {{< /note >}}

   <!--
   Some CNI network plugins like Calico require a CIDR such as `192.168.0.0/16` and
   some like Weave do not. See the [CNI network documentation](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network).
   To add a pod CIDR pass the flag `--pod-network-cidr`, or if you are using a kubeadm configuration file
   set the `podSubnet` field under the `networking` object of `ClusterConfiguration`.
   -->
   {{< note >}}
   一些 CNI 網路外掛如 Calico 需要 CIDR 例如 `192.168.0.0/16` 和一些像 Weave 沒有。參考
   [CNI 網路文件](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)。
   透過傳遞 `--pod-network-cidr` 標誌新增 pod CIDR，或者你可以使用 kubeadm
   配置檔案，在 `ClusterConfiguration` 的 `networking` 物件下設定 `podSubnet` 欄位。
   {{< /note >}}

   <!--
   - The output looks similar to:
   -->
   - 輸出類似於：

     ```sh
     ...
     You can now join any number of control-plane node by running the following command on each as a root:
     kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

     Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
     As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.

     Then you can join any number of worker nodes by running the following on each as root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
     ```

   <!--
   - Copy this output to a text file. You will need it later to join control plane and worker nodes to the cluster.
   - When `--upload-certs` is used with `kubeadm init`, the certificates of the primary control plane
   are encrypted and uploaded in the `kubeadm-certs` Secret.
   - To re-upload the certificates and generate a new decryption key, use the following command on a control plane
   node that is already joined to the cluster:
   -->
   - 將此輸出複製到文字檔案。 稍後你將需要它來將控制平面節點和工作節點加入叢集。
   - 當使用 `--upload-certs` 呼叫 `kubeadm init` 時，主控制平面的證書被加密並上傳到 `kubeadm-certs` Secret 中。
   - 要重新上傳證書並生成新的解密金鑰，請在已加入叢集節點的控制平面上使用以下命令：

     ```shell
     sudo kubeadm init phase upload-certs --upload-certs
     ```
   <!--
   - You can also specify a custom `--certificate-key` during `init` that can later be used by `join`.
     To generate such a key you can use the following command:
   -->
   - 你還可以在 `init` 期間指定自定義的 `--certificate-key`，以後可以由 `join` 使用。
     要生成這樣的金鑰，可以使用以下命令：

     ```shell
     kubeadm certs certificate-key
     ```
   <!--
   The `kubeadm-certs` Secret and decryption key expire after two hours.
   -->
   {{< note >}}
   `kubeadm-certs` Secret 和解密金鑰會在兩個小時後失效。
   {{< /note >}}

   <!--
   As stated in the command output, the certificate key gives access to cluster sensitive data, keep it secret!
   -->
   {{< caution >}}
   正如命令輸出中所述，證書金鑰可訪問叢集敏感資料。請妥善保管！
   {{< /caution >}}

<!--
1. Apply the CNI plugin of your choice:
   [Follow these instructions](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network) to install the CNI provider. Make sure the configuration corresponds to the Pod CIDR specified in the kubeadm configuration file (if applicable).
-->
2. 應用你所選擇的 CNI 外掛：
   [請遵循以下指示](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)
   安裝 CNI 驅動。如果適用，請確保配置與 kubeadm 配置檔案中指定的 Pod
   CIDR 相對應。
   <!--
   You must pick a network plugin that suits your use case and deploy it before you move on to next step.
   If you don't do this, you will not be able to launch your cluster properly.
   -->
   {{< note >}}
   在進行下一步之前，必須選擇並部署合適的網路外掛。
   否則叢集不會正常執行。
   {{< /note >}}


<!--
1. Type the following and watch the pods of the control plane components get started:
-->
3. 輸入以下內容，並檢視控制平面元件的 Pods 啟動：

   ```shell
   kubectl get pod -n kube-system -w
   ```

<!--
### Steps for the rest of the control plane nodes
-->
### 其餘控制平面節點的步驟

<!--
Since kubeadm version 1.15 you can join multiple control-plane nodes in parallel.
Prior to this version, you must join new control plane nodes sequentially, only after
the first node has finished initializing.
-->
{{< note >}}
從 kubeadm 1.15 版本開始，你可以並行加入多個控制平面節點。
在此版本之前，你必須在第一個節點初始化後才能依序的增加新的控制平面節點。
{{< /note >}}

<!--
For each additional control plane node you should:

1. Execute the join command that was previously given to you by the `kubeadm init` output on the first node.
   It should look something like this:

   ```sh
   sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
   ```

   - The `--control-plane` flag tells `kubeadm join` to create a new control plane.
   - The `--certificate-key ...` will cause the control plane certificates to be downloaded
   from the `kubeadm-certs` Secret in the cluster and be decrypted using the given key.

-->
對於每個其他控制平面節點，你應該：

1. 執行先前由第一個節點上的 `kubeadm init` 輸出提供給你的 join 命令。
   它看起來應該像這樣：

   ```sh
   sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
   ```

   - 這個 `--control-plane` 標誌通知 `kubeadm join` 建立一個新的控制平面。
   - `--certificate-key ...` 將導致從叢集中的 `kubeadm-certs` Secret
     下載控制平面證書並使用給定的金鑰進行解密。

<!--
## External etcd nodes

Setting up a cluster with external etcd nodes is similar to the procedure used for stacked etcd
with the exception that you should setup etcd first, and you should pass the etcd information
in the kubeadm config file.
-->
## 外部 etcd 節點

使用外部 etcd 節點設定叢集類似於用於堆疊 etcd 的過程，
不同之處在於你應該首先設定 etcd，並在 kubeadm 配置檔案中傳遞 etcd 資訊。

<!--
### Set up the etcd cluster

1. Follow [these instructions](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) to set up the etcd cluster.

1. Setup SSH as described [here](#manual-certs).

1. Copy the following files from any etcd node in the cluster to the first control plane node:

   ```sh
   export CONTROL_PLANE="ubuntu@10.0.0.7"
   scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
   ```

   - Replace the value of `CONTROL_PLANE` with the `user@host` of the first control-plane machine.
-->
### 設定 ectd 叢集

1. 按照[這些指示](/zh-cn/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) 
   去設定 etcd 叢集。

1. 根據[這裡](#manual-certs) 的描述配置 SSH。

1. 將以下檔案從叢集中的任何 etcd 節點複製到第一個控制平面節點：

   ```shell
   export CONTROL_PLANE="ubuntu@10.0.0.7"
   scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
   ```

   - 用第一臺控制平面機的 `user@host` 替換 `CONTROL_PLANE` 的值。

<!--
### Set up the first control plane node

1. Create a file called `kubeadm-config.yaml` with the following contents:

   ```yaml
   ---
   apiVersion: kubeadm.k8s.io/v1beta3
   kind: ClusterConfiguration
   kubernetesVersion: stable
   controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" # change this (see below)
   etcd:
     external:
       endpoints:
         - https://ETCD_0_IP:2379 # change ETCD_0_IP appropriately
         - https://ETCD_1_IP:2379 # change ETCD_1_IP appropriately
         - https://ETCD_2_IP:2379 # change ETCD_2_IP appropriately
       caFile: /etc/kubernetes/pki/etcd/ca.crt
       certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
       keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
   ```
-->

### 設定第一個控制平面節點

1. 用以下內容建立一個名為 `kubeadm-config.yaml` 的檔案：

   ```yaml
   ---
   apiVersion: kubeadm.k8s.io/v1beta3
   kind: ClusterConfiguration
   kubernetesVersion: stable
   controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" # change this (see below)
   etcd:
     external:
       endpoints:
         - https://ETCD_0_IP:2379 # change ETCD_0_IP appropriately
         - https://ETCD_1_IP:2379 # change ETCD_1_IP appropriately
         - https://ETCD_2_IP:2379 # change ETCD_2_IP appropriately
       caFile: /etc/kubernetes/pki/etcd/ca.crt
       certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
       keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
   ```
   <!--
   The difference between stacked etcd and external etcd here is that the external etcd setup requires
   a configuration file with the etcd endpoints under the `external` object for `etcd`.
   In the case of the stacked etcd topology this is managed automatically.
   -->
   {{< note >}}
   這裡的堆疊（stacked）etcd 和外部 etcd 之前的區別在於設定外部 etcd
   需要一個 `etcd` 的 `external` 物件下帶有 etcd 端點的配置檔案。
   如果是內部 etcd，是自動管理的。
   {{< /note >}}

   <!--
   -  Replace the following variables in the config template with the appropriate values for your cluster:
   -->
   - 在你的叢集中，將配置模板中的以下變數替換為適當值：

     - `LOAD_BALANCER_DNS`
     - `LOAD_BALANCER_PORT`
     - `ETCD_0_IP`
     - `ETCD_1_IP`
     - `ETCD_2_IP`

<!--
The following steps are similar to the stacked etcd setup:
-->
以下的步驟與設定內建 etcd 的叢集是相似的：

<!--
1. Run `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` on this node.

1. Write the output join commands that are returned to a text file for later use.

1. Apply the CNI plugin of your choice. 
-->
1. 在節點上執行 `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` 命令。

1. 記下輸出的 join 命令，這些命令將在以後使用。

1. 應用你選擇的 CNI 外掛。
   <!--
   You must pick a network plugin that suits your use case and deploy it before you move on to next step.
   If you don't do this, you will not be able to launch your cluster properly.
   -->
   {{< note >}}
   在進行下一步之前，必須選擇並部署合適的網路外掛。
   否則叢集不會正常執行。
   {{< /note >}}

<!--
### Steps for the rest of the control plane nodes

The steps are the same as for the stacked etcd setup:

- Make sure the first control plane node is fully initialized.
- Join each control plane node with the join command you saved to a text file. It's recommended
to join the control plane nodes one at a time.
- Don't forget that the decryption key from `--certificate-key` expires after two hours, by default.
-->
### 其他控制平面節點的步驟

步驟與設定內建 etcd 相同：

- 確保第一個控制平面節點已完全初始化。
- 使用儲存到文字檔案的 join 命令將每個控制平面節點連線在一起。
  建議一次加入一個控制平面節點。
- 不要忘記預設情況下，`--certificate-key` 中的解密秘鑰會在兩個小時後過期。

<!--
## Common tasks after bootstrapping control plane

### Install workers
-->
## 列舉控制平面之後的常見任務

### 安裝工作節點

<!--
Worker nodes can be joined to the cluster with the command you stored previously
as the output from the `kubeadm init` command:
-->
你可以使用之前儲存的 `kubeadm init` 命令的輸出將工作節點加入叢集中：

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

<!--
## Manual certificate distribution {#manual-certs}

If you choose to not use `kubeadm init` with the `--upload-certs` flag this means that
you are going to have to manually copy the certificates from the primary control plane node to the
joining control plane nodes.

There are many ways to do this. In the following example we are using `ssh` and `scp`:

SSH is required if you want to control all nodes from a single machine.
-->
## 手動證書分發 {#manual-certs}

如果你選擇不將 `kubeadm init` 與 `--upload-certs` 命令一起使用，
則意味著你將必須手動將證書從主控制平面節點複製到
將要加入的控制平面節點上。

有許多方法可以實現這種操作。在下面的例子中我們使用 `ssh` 和 `scp`：

如果要在單獨的一臺計算機控制所有節點，則需要 SSH。

<!--
1. Enable ssh-agent on your main device that has access to all other nodes in
   the system:
-->
1. 在你的主裝置上啟用 ssh-agent，要求該裝置能訪問系統中的所有其他節點：

   ```shell
   eval $(ssh-agent)
   ```

<!--
1. Add your SSH identity to the session:
-->
2. 將 SSH 身份新增到會話中：

   ```shell
   ssh-add ~/.ssh/path_to_private_key
   ```

<!--
1. SSH between nodes to check that the connection is working correctly.
-->
3. 檢查節點間的 SSH 以確保連線是正常執行的

   <!--
   - When you SSH to any node, make sure to add the `-A` flag:
   -->
   - SSH 到任何節點時，請確保新增 `-A` 標誌：

     ```shell
     ssh -A 10.0.0.7
     ```

   <!--
   - When using sudo on any node, make sure to preserve the environment so SSH
     forwarding works:
   -->
   - 當在任何節點上使用 sudo 時，請確保保持環境變數設定，以便 SSH
     轉發能夠正常工作：

     ```shell
     sudo -E -s
     ```
<!--
1. After configuring SSH on all the nodes you should run the following script on the first control plane node after
   running `kubeadm init`. This script will copy the certificates from the first control plane node to the other
   control plane nodes:
-->
4. 在所有節點上配置 SSH 之後，你應該在執行過 `kubeadm init` 命令的第一個
   控制平面節點上執行以下指令碼。
   該指令碼會將證書從第一個控制平面節點複製到另一個控制平面節點：

   <!--
   In the following example, replace `CONTROL_PLANE_IPS` with the IP addresses of the
   other control plane nodes.
   -->
   在以下示例中，用其他控制平面節點的 IP 地址替換 `CONTROL_PLANE_IPS`。

   ```sh
   USER=ubuntu # 可定製
   CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
   for host in ${CONTROL_PLANE_IPS}; do
       scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
       scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
   done
   ```
   <!--
   Copy only the certificates in the above list. kubeadm will take care of generating the rest of the certificates
   with the required SANs for the joining control-plane instances. If you copy all the certificates by mistake,
   the creation of additional nodes could fail due to a lack of required SANs.
   -->
   {{< caution >}}
   只需要複製上面列表中的證書。kubeadm 將負責生成其餘證書以及加入控制平面例項所需的 SAN。
   如果你錯誤地複製了所有證書，由於缺少所需的 SAN，建立其他節點可能會失敗。
   {{< /caution >}}

<!--
1. Then on each joining control plane node you have to run the following script before running `kubeadm join`.
   This script will move the previously copied certificates from the home directory to `/etc/kubernetes/pki`:
-->
5. 然後，在每個即將加入叢集的控制平面節點上，你必須先執行以下指令碼，然後
   再執行 `kubeadm join`。
   該指令碼會將先前複製的證書從主目錄移動到 `/etc/kubernetes/pki`：

   ```shell
   USER=ubuntu # 可定製
   mkdir -p /etc/kubernetes/pki/etcd
   mv /home/${USER}/ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/ca.key /etc/kubernetes/pki/
   mv /home/${USER}/sa.pub /etc/kubernetes/pki/
   mv /home/${USER}/sa.key /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
   mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
   mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
   ```

