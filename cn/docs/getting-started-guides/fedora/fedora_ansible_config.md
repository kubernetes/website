---
cn-approvers:
- tianshapjq
approvers:
- aveshagarwal
- erictune
title: 使用 Ansible 配置 Fedora
---
<!--
---
approvers:
- aveshagarwal
- erictune
title: Fedora via Ansible
---
-->

<!--
Configuring Kubernetes on Fedora via Ansible offers a simple way to quickly create a clustered environment with little effort.
-->
Ansible 提供了一种简单的方法在 Fedora 上配置 Kubernetes，能够快速创建一个集群环境。

* TOC
{:toc}

<!--
## Prerequisites
-->
## 先决条件

<!--
1. Host able to run ansible and able to clone the following repo: [Kubernetes](https://github.com/kubernetes/kubernetes.git)
2. A Fedora 21+ host to act as cluster master
3. As many Fedora 21+ hosts as you would like, that act as cluster nodes

The hosts can be virtual or bare metal. Ansible will take care of the rest of the configuration for you - configuring networking, installing packages, handling the firewall, etc. This example will use one master and two nodes.
-->
1. 能够运行 ansible 并且能够克隆以下存储库的主机：[Kubernetes](https://github.com/kubernetes/kubernetes.git)
2. 一台至少 Fedora 21 的主机，用来作为集群的 master
3. 多个至少 Fedora 21 的主机，用来作为集群的 node

以上主机可以是虚拟机或者物理裸机。Ansible将负责为您完成其余的配置 - 配置网络、安装软件包和处理防火墙等。本示例将使用一个 master 节点和两个 node 节点。

<!--
## Architecture of the cluster

A Kubernetes cluster requires etcd, a master, and n nodes, so we will create a cluster with three hosts, for example:
-->
## 集群架构

一个 Kubernetes 集群需要 etcd、master 和 n 个 node，因此我们将创建一个包含三台主机的集群，例如：

```shell
master,etcd = kube-master.example.com
    node1 = kube-node-01.example.com
    node2 = kube-node-02.example.com
```

<!--
**Make sure your local machine has**
-->
**确保您的本地机器满足以下条件**

 - ansible (must be 1.9.0+)
 - git
 - python-netaddr

<!--
If not
-->
如果不满足

```shell
dnf install -y ansible git python-netaddr
```

<!--
**Now clone down the Kubernetes repository**
-->
**现在从 Kubernetes 存储库克隆文件**

```shell
git clone https://github.com/kubernetes/contrib.git
cd contrib/ansible
```

<!--
**Tell ansible about each machine and its role in your cluster**
-->
**配置集群中的每台机器及其角色**

<!--
Get the IP addresses from the master and nodes.  Add those to the `~/contrib/ansible/inventory/localhost.ini` file on the host running Ansible.
-->
获得 master 和 node 的 IP 地址。然后添加到运行 Ansible 的主机的 `~/contrib/ansible/inventory/localhost.ini` 文件。

```shell
[masters]
kube-master.example.com

[etcd]
kube-master.example.com

[nodes]
kube-node-01.example.com
kube-node-02.example.com
```

<!--
## Setting up ansible access to your nodes
-->
## 使 ansible 能访问您的所有 node

<!--
If you already are running on a machine which has passwordless ssh access to the kube-master and kube-node-{01,02} nodes, and 'sudo' privileges, simply set the value of `ansible_ssh_user` in `~/contrib/ansible/inventory/group_vars/all.yml` to the username which you use to ssh to the nodes (i.e. `fedora`), and proceed to the next step...
-->
如果您的主机已经能够和 kube-master 节点及 kube-node-{01,02} 节点建立无需密码的 ssh 访问，并且有 'sudo' 权限，那么只需要将 ssh 访问的用户名（例如，`fedora`）配置到 `~/contrib/ansible/inventory/group_vars/all.yml` 文件的 `ansible_ssh_user` 中，然后继续下一步...

<!--
*Otherwise* setup ssh on the machines like so (you will need to know the root password to all machines in the cluster).
-->
*否则* 需要需要您自己配置 ssh 以达到无需密码的 ssh 访问（您需要知道集群中所有机器的 root 密码）。

<!--
edit: ~/contrib/ansible/inventory/group_vars/all.yml
-->
编辑：~/contrib/ansible/inventory/group_vars/all.yml

```yaml
ansible_ssh_user: root
```

<!--
**Configuring ssh access to the cluster**
-->
**配置对集群的 ssh 访问**

<!--
If you already have ssh access to every machine using ssh public keys you may skip to [setting up the cluster](#setting-up-the-cluster)

Make sure your local machine (root) has an ssh key pair if not
-->
如果您已经可以使用 ssh 公钥访问每台机器，那么您可以跳到 [配置集群](#setting-up-the-cluster)。

如果您的本地机器（root 用户）没有 ssh 的秘钥对，可以通过以下方式生成

```shell
ssh-keygen
```

<!--
Copy the ssh public key to **all** nodes in the cluster
-->
拷贝这个 ssh 公钥到集群中的 **所有** 节点

```shell
for node in kube-master.example.com kube-node-01.example.com kube-node-02.example.com; do
  ssh-copy-id ${node}
done
```

<!--
## Setting up the cluster
-->
## 配置集群

<!--
Although the default value of variables in `~/contrib/ansible/inventory/group_vars/all.yml` should be good enough, if not, change them as needed.
-->
`~/contrib/ansible/inventory/group_vars/all.yml` 中的默认值应该已经足够了，如果不满足您的要求，您可以按照要求进行修改。

```conf
edit: ~/contrib/ansible/inventory/group_vars/all.yml
```

<!--
**Configure access to Kubernetes packages**

Modify `source_type` as below to access Kubernetes packages through the package manager.
-->
**配置到 Kubernetes 包的访问**

如下所示，修改 `source_type` 以能够通过包管理器访问 Kubernetes 包。

```yaml
source_type: packageManager
```

<!--
**Configure the IP addresses used for services**

Each Kubernetes service gets its own IP address.  These are not real IPs.  You need to only select a range of IPs which are not in use elsewhere in your environment.
-->
**配置服务所用的 IP 地址**

每一个 Kubernetes 服务都需要获得它自己的 IP 地址，这些并不是真实的 IP，您只需要选择一个在您的环境中未被使用的 IP 地址范围即可。

```yaml
kube_service_addresses: 10.254.0.0/16
```

<!--
**Managing flannel**

Modify `flannel_subnet`, `flannel_prefix` and `flannel_host_prefix` only if defaults are not appropriate for your cluster.
-->
**管理 flannel**

只有在默认值不适合您集群的情况下才需要修改 `flannel_subnet`、`flannel_prefix` 和 `flannel_host_prefix`。

<!--
**Managing add on services in your cluster**

Set `cluster_logging` to false or true (default) to disable or enable logging with elasticsearch.
-->
**管理集群中的插件服务（add on services）**

将 `cluster_logging` 设置为 false 或 true（默认）以禁用或启用 elasticsearch 进行日志记录。

```yaml
cluster_logging: true
```

<!--
Turn `cluster_monitoring` to true (default) or false to enable or disable cluster monitoring with heapster and influxdb.
-->
将 `cluster_monitoring` 设置为 true（默认）或 false 以启用或禁用使用 heapster 和 influxdb 进行集群监视。

```yaml
cluster_monitoring: true
```

<!--
Turn `dns_setup` to true (recommended) or false to enable or disable whole DNS configuration.
-->
将 `dns_setup` 设置为 true（推荐）或 false 以启用或禁用整个 DNS 配置。

```yaml
dns_setup: true
```

<!--
**Tell ansible to get to work!**

This will finally setup your whole Kubernetes cluster for you.
-->
**叫 ansible 起来工作！**

这将最终为您建立整个 Kubernetes 集群。

```shell
cd ~/contrib/ansible/

./scripts/deploy-cluster.sh
```

<!--
## Testing and using your new cluster

That's all there is to it.  It's really that easy.  At this point you should have a functioning Kubernetes cluster.
-->
## 测试并使用您的新集群

这就是创建集群的步骤，真的是非常简单。到这后您应该就拥有一个可以工作的 Kubernetes 集群了。

<!--
**Show Kubernetes nodes**

Run the following on the kube-master:
-->
**展示 Kubernetes nodes**

在 kube-master 上运行如下命令：

```shell
kubectl get nodes
```

<!--
**Show services running on masters and nodes**
-->
**展示运行在 master 和 node 上的服务**

```shell
systemctl | grep -i kube
```

<!--
**Show firewall rules on the masters and nodes**
-->
**展示在 master 和 node 上的防火墙规则**

```shell
iptables -nvL
```

<!--
**Create /tmp/apache.json on the master with the following contents and deploy pod**
-->
**使用以下内容在 master 上创建 /tmp/apache.json 并部署 pod**

```json
{
  "kind": "Pod",
  "apiVersion": "v1",
  "metadata": {
    "name": "fedoraapache",
    "labels": {
      "name": "fedoraapache"
    }
  },
  "spec": {
    "containers": [
      {
        "name": "fedoraapache",
        "image": "fedora/apache",
        "ports": [
          {
            "hostPort": 80,
            "containerPort": 80
          }
        ]
      }
    ]
  }
}
```

```shell
kubectl create -f /tmp/apache.json
```

<!--
**Check where the pod was created**
-->
**检查 pod 创建的位置**

```shell
kubectl get pods
```

<!--
**Check Docker status on nodes**
-->
**检查 node 上的 Docker 状态**

```shell
docker ps
docker images
```

<!--
**After the pod is 'Running' Check web server access on the node**
-->
**在 pod 处于 'Running' 状态后，通过在 node 上访问以检查 web 服务**

```shell
curl http://localhost
```

<!--
That's it!
-->
就是这么简单！

<!--
## Support Level
-->
## 支持级别

<!--
IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Bare-metal           | Ansible      | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/fedora_ansible_config)           |          | Project
-->
IaaS 提供者          | Config. Mgmt | 系统   | 网络        | 文档                                              | 配套     | 支持级别
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
裸机                 | Ansible      | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/fedora_ansible_config)           |          | Project

<!--
For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
-->
有关所有解决方案的支持级别信息，请参见 [解决方案表](/docs/getting-started-guides/#table-of-solutions)。
