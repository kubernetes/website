---
cn-approvers:
- linyouchong
reviewers:
- davidopp
title: 使用 Salt 配置 Kubernetes 集群
weight: 70
content_template: templates/concept
---
<!--
reviewers:
- davidopp
title: Configuring Kubernetes with Salt
weight: 70
content_template: templates/concept
---
-->

{{% capture overview %}}

<!--
The Kubernetes cluster can be configured using Salt.
-->
Kubernetes 集群可以使用 Salt 进行配置

<!--
The Salt scripts are shared across multiple hosting providers and depending on where you host your Kubernetes cluster, you may be using different operating systems and different networking configurations. As a result, it's important to understand some background information before making Salt changes in order to minimize introducing failures for other hosting providers.
-->
这些 Salt 脚本可以跨多个托管提供商共享，这取决于您在何处托管 Kubernetes 集群，您可能正在使用多种不同的操作系统和多种不同的网络配置。因此，在做修改 Salt 配置之前了解一些背景信息是很重要的，以便在使用其他主机托管提供商时降低集群配置失败的可能。

{{% /capture %}}

{{% capture body %}}

<!--
## Salt cluster setup
-->
## 创建 Salt 集群

<!--
The **salt-master** service runs on the kubernetes-master [(except on the default GCE and OpenStack-Heat setup)](#standalone-salt-configuration-on-gce-and-others).
-->
**salt-master** 服务运行在 kubernetes-master 节点 [（除了在默认的 GCE 环境和 OpenStack-Heat 环境）](#standalone-salt-configuration-on-gce-and-others)。

<!--
The **salt-minion** service runs on the kubernetes-master and each kubernetes-node in the cluster.
-->
**salt-minion** 服务运行在 kubernetes-master 节点和每个 kubernetes-node 节点。

<!--
Each salt-minion service is configured to interact with the **salt-master** service hosted on the kubernetes-master via the **master.conf** file [(except on GCE and OpenStack-Heat)](#standalone-salt-configuration-on-gce-and-others).
-->
每个 salt-minion 服务在 **master.conf** 文件中配置与 kubernetes-master 节点上的 **salt-master** 服务进行交互 [（除了 GCE 环境和 OpenStack-Heat 环境）](#standalone-salt-configuration-on-gce-and-others)。

```shell
cat /etc/salt/minion.d/master.conf
```

```none
master: kubernetes-master
```

<!--
The salt-master is contacted by each salt-minion and depending upon the machine information presented, the salt-master will provision the machine as either a kubernetes-master or kubernetes-node with all the required capabilities needed to run Kubernetes.
-->
每个 salt-minion 都会与 salt-master 联系，根据其提供的机器信息，salt-master 会向其提供作为 kubernetes-master 或 kubernetes-node 用于运行 Kubernetes 所需要的能力。

<!--
If you are running the Vagrant based environment, the **salt-api** service is running on the kubernetes-master.  It is configured to enable the vagrant user to introspect the salt cluster in order to find out about machines in the Vagrant environment via a REST API.
-->
如果您正使用基于 Vagrant 的环境，**salt-api** 服务运行在 kubernetes-master 节点。它被配置为使 Vagrant 用户能够对 Salt 集群进行内省，以便通过 REST API 了解 Vagrant 环境中的机器的信息。

<!--
## Standalone Salt Configuration on GCE and others
-->
## 在 GCE 和其它环境下独立配置 Salt

<!--
On GCE and OpenStack, using the Openstack-Heat provider, the master and nodes are all configured as [standalone minions](http://docs.saltstack.com/en/latest/topics/tutorials/standalone_minion.html). The configuration for each VM is derived from the VM's [instance metadata](https://cloud.google.com/compute/docs/metadata) and then stored in Salt grains (`/etc/salt/minion.d/grains.conf`) and pillars (`/srv/salt-overlay/pillar/cluster-params.sls`) that local Salt uses to enforce state.
-->
在 GCE 和 OpenStack 环境，使用 Openstack-Heat 提供商，master 和 node 节点被配置为 [standalone minions](http://docs.saltstack.com/en/latest/topics/tutorials/standalone_minion.html)。每个 VM 的配置都源于它的 [instance metadata](https://cloud.google.com/compute/docs/metadata) 并被保存在 Salt grains (`/etc/salt/minion.d/grains.conf`) 和本地 Salt 用于保存执行状态的 pillars (`/srv/salt-overlay/pillar/cluster-params.sls`) 中。

<!--
All remaining sections that refer to master/minion setups should be ignored for GCE and OpenStack. One fallout of this setup is that the Salt mine doesn't exist - there is no sharing of configuration amongst nodes.
-->
对于 GCE 和 OpenStack ，所有引用 master/minion 设置的其余部分都应该被忽略。这种设置的一个后果是，Salt 不存在 - 节点之间不存在配置共享。

<!--
## Salt security
-->
## Salt 安全

<!--
*(Not applicable on default GCE and OpenStack-Heat setup.)*
-->
*（不适用于 默认的 GCE 和 OpenStack-Heat 配置环境。）*

<!--
Security is not enabled on the salt-master, and the salt-master is configured to auto-accept incoming requests from minions.  It is not recommended to use this security configuration in production environments without deeper study.  (In some environments this isn't as bad as it might sound if the salt master port isn't externally accessible and you trust everyone on your network.)
-->
salt-master 没有启用安全功能，salt-master 被配置为自动接受所有来自 minion 的接入请求。在深入研究之前，不推荐在生产环境中启用安全配置。（在某些环境中，如果 salt-master 端口不能从外部访问，并且您信任您的网络上的每个节点，这并不像它看起来那么糟糕）

```shell
cat /etc/salt/master.d/auto-accept.conf
```

```shell
open_mode: True
auto_accept: True
```

<!--
## Salt minion configuration
-->
## 配置 Salt minion

<!--
Each minion in the salt cluster has an associated configuration that instructs the salt-master how to provision the required resources on the machine.
-->
Salt 集群中的每个 minion 都有一个相关的配置，它指示 salt-master 如何在机器上提供所需的资源。

<!--
An example file is presented below using the Vagrant based environment.
-->
下面是一个基于 Vagrant 环境的示例文件：

```shell
cat /etc/salt/minion.d/grains.conf
```

```yaml
grains:
  etcd_servers: $MASTER_IP
  cloud: vagrant
  roles:
    - kubernetes-master
```

<!--
Each hosting environment has a slightly different grains.conf file that is used to build conditional logic where required in the Salt files.
-->
每个托管环境都使用了略微不同的 grains.conf 文件，用于在需要的 Salt 文件中构建条件逻辑。

<!--
The following enumerates the set of defined key/value pairs that are supported today.  If you add new ones, please make sure to update this list.
-->
下面列举了目前支持的定义键/值对的集合。如果你添加了新的，请确保更新这个列表。

<!--
Key | Value
-->
键 | 值
-----------------------------------|----------------------------------------------------------------
<!--
`api_servers` | (Optional) The IP address / host name where a kubelet can get read-only access to kube-apiserver
-->
`api_servers` | （可选） IP 地址/主机名 ，kubelet 用其访问 kube-apiserver
<!--
`cbr-cidr` | (Optional) The minion IP address range used for the docker container bridge.
-->
`cbr-cidr` | （可选） docker 容器网桥分配给 minion 节点的 IP 地址范围
<!--
`cloud` | (Optional) Which IaaS platform is used to host Kubernetes, *gce*, *azure*, *aws*, *vagrant*
-->
`cloud` | （可选） 托管 Kubernetes 的 IaaS 平台， *gce*, *azure*, *aws*, *vagrant*
<!--
`etcd_servers` | (Optional) Comma-delimited list of IP addresses the kube-apiserver and kubelet use to reach etcd.  Uses the IP of the first machine in the kubernetes_master role, or 127.0.0.1 on GCE.
-->
`etcd_servers` | （可选） 以逗号分隔的 IP 地址列表，kube-apiserver 和 kubelet 使用其访问 etcd。kubernetes_master 角色的节点使用第一个机器的 IP ，在 GCE 环境上使用 127.0.0.1。
<!--
`hostnamef` | (Optional) The full host name of the machine, i.e. uname -n
-->
`hostnamef` | （可选） 机器的完整主机名，即：uname -n
<!--
`node_ip` | (Optional) The IP address to use to address this node
-->
`node_ip` | （可选）用于定位本节点的 IP 地址
<!--
`hostname_override` | (Optional) Mapped to the kubelet hostname-override
-->
`hostname_override` | （可选）对应 kubelet 的 hostname-override 参数
<!--
`network_mode` | (Optional) Networking model to use among nodes: *openvswitch*
-->
`network_mode` | （可选）节点间使用的网络模型：*openvswitch*
<!--
`networkInterfaceName` | (Optional) Networking interface to use to bind addresses, default value *eth0*
-->
`networkInterfaceName` | （可选）用于绑定地址的网络接口，默认值 *eth0*
<!--
`publicAddressOverride` | (Optional) The IP address the kube-apiserver should use to bind against for external read-only access
-->
`publicAddressOverride` | （可选）kube-apiserver 用于外部只读访问而绑定的IP地址
<!--
`roles` | (Required) 1. `kubernetes-master` means this machine is the master in the Kubernetes cluster.  2. `kubernetes-pool` means this machine is a kubernetes-node.  Depending on the role, the Salt scripts will provision different resources on the machine.
-->
`roles` | （必选）1、`kubernetes-master` 表示本节点是 Kubernetes 集群的 master。2、`kubernetes-pool` 表示本节点是一个 kubernetes-node。根据角色，Salt 脚本会在机器上提供不同的资源

<!--
These keys may be leveraged by the Salt sls files to branch behavior.
-->
Salt sls 文件可以应用这些键到分支行为。

<!--
In addition, a cluster may be running a Debian based operating system or Red Hat based operating system (Centos, Fedora, RHEL, etc.).  As a result, it's important to sometimes distinguish behavior based on operating system using if branches like the following.
-->
此外，一个集群可能运行在基于 Debian 的操作系统或基于 Red Hat 的操作系统（Centos、Fedora、RHEL等）。因此，有时区分基于操作系统的行为（如果像下面这样的分支）是很重要的。

```liquid

{% if grains['os_family'] == 'RedHat' %}
// something specific to a RedHat environment (Centos, Fedora, RHEL) where you may use yum, systemd, etc.
{% else %}
// something specific to Debian environment (apt-get, initd)
{% endif %}

```

<!--
## Best Practices
-->
## 最佳实践

<!--
When configuring default arguments for processes, it's best to avoid the use of EnvironmentFiles (Systemd in Red Hat environments) or init.d files (Debian distributions) to hold default values that should be common across operating system environments.  This helps keep our Salt template files easy to understand for editors who may not be familiar with the particulars of each distribution.
-->
在为进程配置默认参数时，最好避免使用环境文件（ Red Hat 环境中的 Systemd ）或 init.d 文件（ Debian 发行版）以保留在操作系统环境中应该通用的默认值。这有助于保持我们的 Salt 模板文件易于理解，因为管理员可能不熟悉每个发行版的细节。

<!--
## Future enhancements (Networking)
-->
## 未来的增强（网络）

<!--
Per pod IP configuration is provider-specific, so when making networking changes, it's important to sandbox these as all providers may not use the same mechanisms (iptables, openvswitch, etc.)
-->
每个 pod IP 配置都是特定于提供商的，因此在进行网络更改时，必须将这些设置为沙箱，因为不同的提供商可能不会使用相同的机制（ iptables 、openvswitch 等）。

<!--
We should define a grains.conf key that captures more specifically what network configuration environment is being used to avoid future confusion across providers.
-->
我们应该定义一个 grains.conf 键，这样能更明确地捕获正在使用的网络环境配置，以避免将来在不同的提供商之间产生混淆。

{{% /capture %}}