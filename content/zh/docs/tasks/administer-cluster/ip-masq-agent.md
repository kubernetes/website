---
title: IP Masquerade Agent 用户指南
content_template: templates/task
---
<!--
---
title: IP Masquerade Agent User Guide
content_template: templates/task
---
-->

{{% capture overview %}}
<!--
This page shows how to configure and enable the ip-masq-agent.
-->
此页面展示如何配置和启用 ip-masq-agent。
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture discussion %}}
<!--
## IP Masquerade Agent User Guide
-->
## IP Masquerade Agent 用户指南

<!--
The ip-masq-agent configures iptables rules to hide a pod's IP address behind the cluster node's IP address. This is typically done when sending traffic to destinations outside the cluster's pod [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) range.
-->
ip-masq-agent 配置 iptables 规则以隐藏位于集群节点 IP 地址后面的 pod 的 IP 地址。 这通常在将流量发送到集群的 pod [CIDR](https://zh.wikipedia.org/wiki/%E6%97%A0%E7%B1%BB%E5%88%AB%E5%9F%9F%E9%97%B4%E8%B7%AF%E7%94%B1) 范围之外的目的地时使用。

<!--
### **Key Terms**
-->
### **关键词**

<!--
*   **NAT (Network Address Translation)**
    Is a method of remapping one IP address to another by modifying either the source and/or destination address information in the IP header.  Typically performed by a device doing IP routing.
-->
*   **NAT (网络地址解析)**
    是一种通过修改 IP 地址头中的源和/或目标地址信息将一个 IP 地址重新映射到另一个 IP 地址的方法。通常由执行 IP 路由的设备执行。

<!--
*   **Masquerading**
    A form of NAT that is typically used to perform a many to one address translation, where multiple source IP addresses are masked behind a single address, which is typically the device doing the IP routing. In Kubernetes this is the Node's IP address.
-->    
*   **伪装**
    NAT 的一种形式，通常用于执行多对一地址转换，其中多个源 IP 地址被隐藏在单个地址后面，该地址通常是执行 IP 路由的设备。在 Kubernetes 中，这是节点的 IP 地址。

<!--
*   **CIDR (Classless Inter-Domain Routing)**
    Based on the variable-length subnet masking, allows specifying arbitrary-length prefixes. CIDR introduced a new method of representation for IP addresses, now commonly known as **CIDR notation**, in which an address or routing prefix is written with a suffix indicating the number of bits of the prefix, such as 192.168.2.0/24.
-->
*   **CIDR (无类别域间路由)**
    基于可变长度子网掩码，允许指定任意长度的前缀。CIDR 引入了一种新的 IP 地址表示方法，现在通常称为**CIDR表示法**，其中地址或路由前缀后添加一个后缀，用来表示前缀的位数，例如 192.168.2.0/24。

<!--
*   **Link Local**
    A link-local address is a network address that is valid only for communications within the network segment or the broadcast domain that the host is connected to. Link-local addresses for IPv4 are defined in the address block 169.254.0.0/16 in CIDR notation.
-->
*   **本地链路**
    本地链路是仅对网段或主机所连接的广播域内的通信有效的网络地址。IPv4的本地链路地址在 CIDR 表示法的地址块 169.254.0.0/16 中定义。

<!--
The ip-masq-agent configures iptables rules to handle masquerading node/pod IP addresses when sending traffic to destinations outside the cluster node's IP and the Cluster IP range.  This essentially hides pod IP addresses behind the cluster node's IP address.  In some environments, traffic to "external" addresses must come from a known machine address. For example, in Google Cloud, any traffic to the internet must come from a VM's IP.  When containers are used, as in Google Kubernetes Engine, the Pod IP will be rejected for egress. To avoid this, we must hide the Pod IP behind the VM's own IP address - generally known as "masquerade". By default, the agent is configured to treat the three private IP ranges specified by [RFC 1918](https://tools.ietf.org/html/rfc1918) as non-masquerade [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).  These ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. The agent will also treat link-local (169.254.0.0/16) as a non-masquerade CIDR by default.  The agent is configured to reload its configuration from the location */etc/config/ip-masq-agent* every 60 seconds, which is also configurable.
-->
ip-masq-agent 配置 iptables 规则，以便在将流量发送到集群节点的IP和集群IP范围之外的目标时处理伪装节点/pod 的 IP 地址。这基本上隐藏了集群节点 IP 地址后面的pod IP地址。在某些环境中，去往“外部”地址的流量必须从已知的机器地址发出。例如，在 Google Cloud 中，任何到互联网的流量都必须来自 VM 的 IP。使用容器时，如 Google Kubernetes Engine，从Pod IP 发出的流量将被拒绝出出站。为了避免这种情况，我们必须将 Pod IP 隐藏在 VM 自己的IP地址后面 - 通常称为“伪装”。默认情况下，代理配置为将[RFC 1918](https://tools.ietf.org/html/rfc1918)指定的三个私有IP范围视为非伪装[CIDR](https://zh.wikipedia.org/wiki/%E6%97%A0%E7%B1%BB%E5%88%AB%E5%9F%9F%E9%97%B4%E8%B7%AF%E7%94%B1)。这些范围是 10.0.0.0/8,172.16.0.0/12 和 192.168.0.0/16。默认情况下，代理还将链路本地地址(169.254.0.0/16)视为非伪装 CIDR。代理程序配置为每隔60秒从*/etc/config/ip-masq-agent*重新加载其配置，这也是可修改的。

![masq/non-masq example](/images/docs/ip-masq.png)

<!--
The agent configuration file must be written in YAML or JSON syntax, and may contain three optional keys:
-->
代理配置文件必须使用 YAML 或 JSON 语法编写，并且可能包含三个可选值：

<!--
*   **nonMasqueradeCIDRs:** A list of strings in [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation that specify the non-masquerade ranges.
-->
*   **nonMasqueradeCIDRs:** [CIDR](https://zh.wikipedia.org/wiki/%E6%97%A0%E7%B1%BB%E5%88%AB%E5%9F%9F%E9%97%B4%E8%B7%AF%E7%94%B1) 表示法中的字符串列表，用于指定不需伪装的地址范围。

<!--
*   **masqLinkLocal:** A Boolean (true / false) which indicates whether to masquerade traffic to the link local prefix 169.254.0.0/16. False by default.
-->
*   **masqLinkLocal:** 布尔值 (true / false)，表示是否将流量伪装到本地链路前缀169.254.0.0/16。 默认为 false。

<!--
*   **resyncInterval:** An interval at which the agent attempts to reload config from disk. e.g. '30s' where 's' is seconds, 'ms' is milliseconds etc...
-->
*   **resyncInterval:** 代理尝试从磁盘重新加载配置的时间间隔。 例如 '30s'，其中 's' 是秒，'ms' 是毫秒等...

<!--
Traffic to 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16) ranges will NOT be masqueraded. Any other traffic (assumed to be internet) will be masqueraded.  An example of a local destination from a pod could be its Node's IP address as well as another node's address or one of the IP addresses in Cluster's IP range.   Any other traffic will be masqueraded by default.  The below entries show the default set of rules that are applied by the ip-masq-agent:
-->
10.0.0.0/8,172.16.0.0/12和192.168.0.0/16）范围内的流量不会被伪装。任何其他流量（假设是互联网）将被伪装。pod 访问本地目的地的例子，可以是其节点的 IP 地址、另一节点的地址或集群的 IP 地址范围内的一个 IP 地址。默认情况下，任何其他流量都将伪装。以下条目展示了 ip-masq-agent 的默认使用的规则：

<!--
```
iptables -t nat -L IP-MASQ-AGENT
RETURN     all  --  anywhere             169.254.0.0/16       /* ip-masq-agent: cluster-local traffic should not be subject to MASQUERADE */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             10.0.0.0/8           /* ip-masq-agent: cluster-local traffic should not be subject to MASQUERADE */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             172.16.0.0/12        /* ip-masq-agent: cluster-local traffic should not be subject to MASQUERADE */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             192.168.0.0/16       /* ip-masq-agent: cluster-local traffic should not be subject to MASQUERADE */ ADDRTYPE match dst-type !LOCAL
MASQUERADE  all  --  anywhere             anywhere             /* ip-masq-agent: outbound traffic should be subject to MASQUERADE (this match must come after cluster-local CIDR matches) */ ADDRTYPE match dst-type !LOCAL

```
-->
```
iptables -t nat -L IP-MASQ-AGENT
RETURN     all  --  anywhere             169.254.0.0/16       /* ip-masq-agent: 集群本地流量不被 MASQUERADE 控制 */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             10.0.0.0/8           /* ip-masq-agent: 集群本地流量不被 MASQUERADE 控制 */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             172.16.0.0/12        /* ip-masq-agent: 集群本地流量不被 MASQUERADE 控制 */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             192.168.0.0/16       /* ip-masq-agent: 集群本地流量不被 MASQUERADE 控制 */ ADDRTYPE match dst-type !LOCAL
MASQUERADE  all  --  anywhere             anywhere             /* ip-masq-agent: 出站流量应受 MASQUERADE 控制 (此规则必须在集群本地 CIDR 规则之后) */ ADDRTYPE match dst-type !LOCAL

```

<!--
By default, in GCE/Google Kubernetes Engine starting with Kubernetes version 1.7.0, if network policy is enabled or you are using a cluster CIDR not in the 10.0.0.0/8 range, the ip-masq-agent will run in your cluster.  If you are running in another environment, you can add the ip-masq-agent [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) to your cluster:
-->
默认情况下，从 Kubernetes 1.7.0 版本开始的 GCE/Google Kubernetes Engine 中，如果启用了网络策略，或者您使用的集群 CIDR 不在 10.0.0.0/8 范围内，则 ip-masq-agent 将在您的集群中运行。如果您在其他环境中运行，则可以将 ip-masq-agent [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) 添加到您的集群：

{{% /capture %}}

{{% capture steps %}}

<!--
## Create an ip-masq-agent
To create an ip-masq-agent, run the following kubectl command:
-->
## 创建 ip-masq-agent
通过运行以下 kubectl 指令创建 ip-masq-agent:

`
kubectl apply -f https://raw.githubusercontent.com/kubernetes-incubator/ip-masq-agent/master/ip-masq-agent.yaml
`

<!--
You must also apply the appropriate node label to any nodes in your cluster that you want the agent to run on.
-->
您必须同时将适当的节点标签应用于集群中希望代理运行的任何节点。

`
kubectl label nodes my-node beta.kubernetes.io/masq-agent-ds-ready=true
`

<!--
More information can be found in the ip-masq-agent documentation [here](https://github.com/kubernetes-incubator/ip-masq-agent)
-->
更多信息可以通过 ip-masq-agent 文档 [这里](https://github.com/kubernetes-incubator/ip-masq-agent) 找到

<!--
In most cases, the default set of rules should be sufficient; however, if this is not the case for your cluster, you can create and apply a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) to customize the IP ranges that are affected.  For example, to allow only 10.0.0.0/8 to be considered by the ip-masq-agent, you can create the following [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) in a file called "config".
-->
在大多数情况下，默认的规则集应该足够；但是，如果您的群集不是这种情况，则可以创建并应用 [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) 来自定义受影响的 IP 范围。 例如，要允许 ip-masq-agent 仅作用于 10.0.0.0/8，您可以一个名为 “config” 的文件中创建以下 [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) 。

{{< note >}}
<!--
It is important that the file is called config since, by default, that will be used as the key for lookup by the ip-masq-agent:
-->
重要的是，该文件之所以被称为 config，因为默认情况下，该文件将被用作 ip-masq-agent 查找的关键：

```
nonMasqueradeCIDRs:
  - 10.0.0.0/8
resyncInterval: 60s
```
{{< /note >}}

<!--
Run the following command to add the config map to your cluster:
-->
运行以下命令将配置映射添加到您的集群：

```
kubectl create configmap ip-masq-agent --from-file=config --namespace=kube-system
```

<!--
This will update a file located at */etc/config/ip-masq-agent* which is periodically checked every *resyncInterval* and applied to the cluster node.
After the resync interval has expired, you should see the iptables rules reflect your changes:
-->
这将更新位于 */etc/config/ip-masq-agent* 的一个文件，该文件以 *resyncInterval* 为周期定期检查并应用于集群节点。
重新同步间隔到期后，您应该看到您的更改在 iptables 规则中体现：

<!--
```
iptables -t nat -L IP-MASQ-AGENT
Chain IP-MASQ-AGENT (1 references)
target     prot opt source               destination
RETURN     all  --  anywhere             169.254.0.0/16       /* ip-masq-agent: cluster-local traffic should not be subject to MASQUERADE */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             10.0.0.0/8           /* ip-masq-agent: cluster-local
MASQUERADE  all  --  anywhere             anywhere             /* ip-masq-agent: outbound traffic should be subject to MASQUERADE (this match must come after cluster-local CIDR matches) */ ADDRTYPE match dst-type !LOCAL
```
-->
```
iptables -t nat -L IP-MASQ-AGENT
Chain IP-MASQ-AGENT (1 references)
target     prot opt source               destination
RETURN     all  --  anywhere             169.254.0.0/16       /* ip-masq-agent: 集群本地流量不被 MASQUERADE 控制 */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             10.0.0.0/8           /* ip-masq-agent: cluster-local
MASQUERADE  all  --  anywhere             anywhere             /* ip-masq-agent: 出站流量应受 MASQUERADE 控制 (此规则必须在集群本地 CIDR 规则之后) */ ADDRTYPE match dst-type !LOCAL
```

<!--
By default, the link local range (169.254.0.0/16) is also handled by the ip-masq agent, which sets up the appropriate iptables rules.  To have the ip-masq-agent ignore link local, you can set *masqLinkLocal*  to true in the config map.
-->
默认情况下，本地链路范围 (169.254.0.0/16) 也由 ip-masq agent 处理，该代理设置适当的 iptables 规则。 要使 ip-masq-agent 忽略本地链路，可以在配置映射中将 *masqLinkLocal* 设置为true。

```
nonMasqueradeCIDRs:
  - 10.0.0.0/8
resyncInterval: 60s
masqLinkLocal: true
```
{{% /capture %}}
