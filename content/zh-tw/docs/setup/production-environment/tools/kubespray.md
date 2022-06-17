---
title: 使用 Kubespray 安裝 Kubernetes
content_type: concept
weight: 30
---
<!--
title: Installing Kubernetes with Kubespray
content_type: concept
weight: 30
-->

<!-- overview -->

<!--
This quickstart helps to install a Kubernetes cluster hosted on GCE, Azure, OpenStack, AWS, vSphere, Packet (bare metal), Oracle Cloud Infrastructure (Experimental) or Baremetal with [Kubespray](https://github.com/kubernetes-sigs/kubespray).
-->
此快速入門有助於使用 [Kubespray](https://github.com/kubernetes-sigs/kubespray)
安裝在 GCE、Azure、OpenStack、AWS、vSphere、Packet（裸機）、Oracle Cloud
Infrastructure（實驗性）或 Baremetal 上託管的 Kubernetes 叢集。

<!--
Kubespray is a composition of [Ansible](https://docs.ansible.com/) playbooks, [inventory](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible.md), provisioning tools, and domain knowledge for generic OS/Kubernetes clusters configuration management tasks. Kubespray provides:
-->
Kubespray 是一個由 [Ansible](https://docs.ansible.com/) playbooks、
[清單（inventory）](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible.md)、
製備工具和通用 OS/Kubernetes 叢集配置管理任務的領域知識組成的。
Kubespray 提供：

<!--
* a highly available cluster
* composable attributes
* support for most popular Linux distributions
  * Ubuntu 16.04, 18.04, 20.04
  * CentOS/RHEL/Oracle Linux 7, 8
  * Debian Buster, Jessie, Stretch, Wheezy
  * Fedora 31, 32
  * Fedora CoreOS
  * openSUSE Leap 15
  * Flatcar Container Linux by Kinvolk
* continuous integration tests
-->
* 高可用性叢集
* 可組合屬性
* 支援大多數流行的 Linux 發行版
   * Ubuntu 16.04、18.04、20.04
   * CentOS / RHEL / Oracle Linux 7、8
   * Debian Buster、Jessie、Stretch、Wheezy
   * Fedora 31、32
   * Fedora CoreOS
   * openSUSE Leap 15
   * Kinvolk 的 Flatcar Container Linux
* 持續整合測試

<!--
To choose a tool which best fits your use case, read [this comparison](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/comparisons.md) to
[kubeadm](/docs/reference/setup-tools/kubeadm/) and [kops](/docs/setup/production-environment/tools/kops/).
-->
要選擇最適合你的用例的工具，請閱讀
[kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/) 和
[kops](/zh-cn/docs/setup/production-environment/tools/kops/) 之間的
[這份比較](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/comparisons.md)。
 。
<!-- body -->

<!--
## Creating a cluster

### (1/5) Meet the underlay requirements
-->
## 建立叢集

### （1/5）滿足下層設施要求

<!--
Provision servers with the following [requirements](https://github.com/kubernetes-sigs/kubespray#requirements):
-->
按以下[要求](https://github.com/kubernetes-sigs/kubespray#requirements)來配置伺服器：

<!--
* **Ansible v2.9 and python-netaddr are installed on the machine that will run Ansible commands**
* **Jinja 2.11 (or newer) is required to run the Ansible Playbooks**
* The target servers must have access to the Internet in order to pull docker images. Otherwise, additional configuration is required ([See Offline Environment](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/offline-environment.md))
* The target servers are configured to allow **IPv4 forwarding**
* **Your ssh key must be copied** to all the servers in your inventory
* **Firewalls are not managed by kubespray**. You'll need to implement appropriate rules as needed. You should disable your firewall in order to avoid any issues during deployment
* If kubespray is run from a non-root user account, correct privilege escalation method should be configured in the target servers and the `ansible_become` flag or command parameters `--become` or `-b` should be specified
-->
* 在將執行 Ansible 命令的計算機上安裝 Ansible v2.9 和 python-netaddr
* **執行 Ansible Playbook 需要 Jinja 2.11（或更高版本）**
* 目標伺服器必須有權訪問 Internet 才能拉取 Docker 映象。否則，
  需要其他配置（[請參見離線環境](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/offline-environment.md)）
* 目標伺服器配置為允許 IPv4 轉發
* **你的 SSH 金鑰必須複製**到部署叢集的所有伺服器中
* **防火牆不是由 kubespray 管理的**。你需要根據需求設定適當的規則策略。為了避免部署過程中出現問題，可以禁用防火牆。
* 如果從非 root 使用者帳戶執行 kubespray，則應在目標伺服器中配置正確的特權升級方法
並指定 `ansible_become` 標誌或命令引數 `--become` 或 `-b`

<!--
Kubespray provides the following utilities to help provision your environment:

* [Terraform](https://www.terraform.io/) scripts for the following cloud providers:
  * [AWS](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/aws)
  * [OpenStack](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/openstack)
  * [Packet](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/packet)
-->
Kubespray 提供以下實用程式來幫助你設定環境：

* 為以下雲驅動提供的 [Terraform](https://www.terraform.io/) 指令碼：
* [AWS](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/aws)
* [OpenStack](http://sitebeskuethree/contrigetbernform/contribeskubernform/contribeskupernform/https/sitebesku/master/)
* [Packet](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/packet)

<!--
### (2/5) Compose an inventory file

After you provision your servers, create an [inventory file for Ansible](https://docs.ansible.com/ansible/latest/network/getting_started/first_inventory.html). You can do this manually or via a dynamic inventory script. For more information, see "[Building your own inventory](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory)".

### (3/5) Plan your cluster deployment

Kubespray provides the ability to customize many aspects of the deployment:
-->
### （2/5）編寫清單檔案

設定伺服器後，請建立一個
[Ansible 的清單檔案](https://docs.ansible.com/ansible/latest/network/getting_started/first_inventory.html)。
你可以手動執行此操作，也可以透過動態清單指令碼執行此操作。有關更多資訊，請參閱
“[建立你自己的清單](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory)”。

### （3/5）規劃叢集部署

Kubespray 能夠自定義部署的許多方面：

<!--
* Choice deployment mode: kubeadm or non-kubeadm
* CNI (networking) plugins
* DNS configuration
* Choice of control plane: native/binary or containerized
* Component versions
* Calico route reflectors
* Component runtime options
  * {{< glossary_tooltip term_id="docker" >}}
  * {{< glossary_tooltip term_id="containerd" >}}
  * {{< glossary_tooltip term_id="cri-o" >}}
* Certificate generation methods
-->
* 選擇部署模式： kubeadm 或非 kubeadm
* CNI（網路）外掛
* DNS 配置
* 控制平面的選擇：本機/可執行檔案或容器化
* 元件版本
* Calico 路由反射器
* 元件執行時選項
  * {{< glossary_tooltip term_id="docker" >}}
  * {{< glossary_tooltip term_id="containerd" >}}
  * {{< glossary_tooltip term_id="cri-o" >}}
* 證書生成方式

<!--
Kubespray customizations can be made to a [variable file](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html). If you are getting started with Kubespray, consider using the Kubespray defaults to deploy your cluster and explore Kubernetes.
-->
可以修改[變數檔案](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html)
以進行 Kubespray 定製。
如果你剛剛開始使用 Kubespray，請考慮使用 Kubespray 預設設定來部署你的叢集
並探索 Kubernetes 。
<!--
### (4/5) Deploy a Cluster

Next, deploy your cluster:

Cluster deployment using [ansible-playbook](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment).
-->
### （4/5）部署叢集

接下來，部署你的叢集：

使用 [ansible-playbook](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment)
進行叢集部署。

```shell
ansible-playbook -i your/inventory/inventory.ini cluster.yml -b -v \
  --private-key=~/.ssh/private_key
```
<!--
Large deployments (100+ nodes) may require [specific adjustments](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/large-deployments.md) for best results.
-->
大型部署（超過 100 個節點）可能需要
[特定的調整](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/large-deployments.md)，
以獲得最佳效果。

<!--
### (5/5) Verify the deployment

Kubespray provides a way to verify inter-pod connectivity and DNS resolve with [Netchecker](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/netcheck.md). Netchecker ensures the netchecker-agents pods can resolve DNS requests and ping each over within the default namespace. Those pods mimic similar behavior as the rest of the workloads and serve as cluster health indicators.
-->
### （5/5）驗證部署

Kubespray 提供了一種使用
[Netchecker](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/netcheck.md)
驗證 Pod 間連線和 DNS 解析的方法。
Netchecker 確保 netchecker-agents Pods 可以解析 DNS 請求，
並在預設名稱空間內對每個請求執行 ping 操作。
這些 Pod 模仿其他工作負載類似的行為，並用作叢集執行狀況指示器。
<!--
## Cluster operations

Kubespray provides additional playbooks to manage your cluster: _scale_ and _upgrade_.
-->
## 叢集操作

Kubespray 提供了其他 Playbooks 來管理叢集： _scale_ 和 _upgrade_。
<!--
### Scale your cluster

You can add worker nodes from your cluster by running the scale playbook. For more information, see "[Adding nodes](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#adding-nodes)".
You can remove worker nodes from your cluster by running the remove-node playbook. For more information, see "[Remove nodes](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#remove-nodes)".
-->
### 擴充套件叢集

你可以透過執行 scale playbook 向叢集中新增工作節點。有關更多資訊，
請參見 “[新增節點](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#adding-nodes)”。
你可以透過執行 remove-node playbook 來從叢集中刪除工作節點。有關更多資訊，
請參見 “[刪除節點](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#remove-nodes)”。
<!--
### Upgrade your cluster

You can upgrade your cluster by running the upgrade-cluster playbook. For more information, see "[Upgrades](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/upgrades.md)".
-->
### 升級叢集

你可以透過執行 upgrade-cluster Playbook 來升級叢集。有關更多資訊，請參見
“[升級](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/upgrades.md)”。
<!--
## Cleanup

You can reset your nodes and wipe out all components installed with Kubespray via the [reset playbook](https://github.com/kubernetes-sigs/kubespray/blob/master/reset.yml).

{{< caution >}}
When running the reset playbook, be sure not to accidentally target your production cluster!
{{< /caution >}}
-->
## 清理

你可以透過 [reset](https://github.com/kubernetes-sigs/kubespray/blob/master/reset.yml) Playbook
重置節點並清除所有與 Kubespray 一起安裝的元件。

{{< caution >}}
執行 reset playbook 時，請確保不要意外地將生產叢集作為目標！
{{< /caution >}}

<!--
## Feedback

* Slack Channel: [#kubespray](https://kubernetes.slack.com/messages/kubespray/) (You can get your invite [here](https://slack.k8s.io/))
* [GitHub Issues](https://github.com/kubernetes-sigs/kubespray/issues)
-->
## 反饋

* Slack 頻道：[#kubespray](https://kubernetes.slack.com/messages/kubespray/)
  （你可以在[此處](https://slack.k8s.io/)獲得邀請）
* [GitHub 問題](https://github.com/kubernetes-sigs/kubespray/issues)

<!--
## {{% heading "whatsnext" %}}

Check out planned work on Kubespray's [roadmap](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/roadmap.md).
-->
## {{% heading "whatsnext" %}}

檢視有關 Kubespray 的
[路線圖](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/roadmap.md)
的計劃工作。
