---
title: IP Masquerade Agent 使用者指南
content_type: task
---
<!--
title: IP Masquerade Agent User Guide
content_type: task
-->

<!-- overview -->
<!--
This page shows how to configure and enable the `ip-masq-agent`.
-->
此頁面展示如何配置和啟用 `ip-masq-agent`。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- discussion -->
<!--
## IP Masquerade Agent User Guide
-->
## IP Masquerade Agent 使用者指南

<!--
The `ip-masq-agent` configures iptables rules to hide a pod's IP address behind the cluster node's IP address. This is typically done when sending traffic to destinations outside the cluster's pod [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) range.
-->
`ip-masq-agent` 配置 iptables 規則以隱藏位於叢集節點 IP 地址後面的 Pod 的 IP 地址。
這通常在將流量傳送到叢集的 Pod
[CIDR](https://zh.wikipedia.org/wiki/%E6%97%A0%E7%B1%BB%E5%88%AB%E5%9F%9F%E9%97%B4%E8%B7%AF%E7%94%B1)
範圍之外的目的地時使用。

<!--
### **Key Terms**
-->
### **關鍵術語**

<!--
* **NAT (Network Address Translation)**
  Is a method of remapping one IP address to another by modifying either the source and/or destination address information in the IP header.  Typically performed by a device doing IP routing.
-->
* **NAT (網路地址轉譯)**
  是一種透過修改 IP 地址頭中的源和/或目標地址資訊將一個 IP 地址重新對映
  到另一個 IP 地址的方法。通常由執行 IP 路由的裝置執行。

<!--
* **Masquerading**
  A form of NAT that is typically used to perform a many to one address translation, where multiple source IP addresses are masked behind a single address, which is typically the device doing the IP routing. In Kubernetes this is the Node's IP address.
-->    
* **偽裝**
  NAT 的一種形式，通常用於執行多對一地址轉換，其中多個源 IP 地址被隱藏在
  單個地址後面，該地址通常是執行 IP 路由的裝置。在 Kubernetes 中，
  這是節點的 IP 地址。

<!--
* **CIDR (Classless Inter-Domain Routing)**
  Based on the variable-length subnet masking, allows specifying arbitrary-length prefixes. CIDR introduced a new method of representation for IP addresses, now commonly known as **CIDR notation**, in which an address or routing prefix is written with a suffix indicating the number of bits of the prefix, such as 192.168.2.0/24.
-->
* **CIDR (無類別域間路由)**
  基於可變長度子網掩碼，允許指定任意長度的字首。
  CIDR 引入了一種新的 IP 地址表示方法，現在通常稱為**CIDR表示法**，
  其中地址或路由字首後新增一個字尾，用來表示字首的位數，例如 192.168.2.0/24。

<!--
* **Link Local**
  A link-local address is a network address that is valid only for communications within the network segment or the broadcast domain that the host is connected to. Link-local addresses for IPv4 are defined in the address block 169.254.0.0/16 in CIDR notation.
-->
* **本地鏈路**
  本地鏈路是僅對網段或主機所連線的廣播域內的通訊有效的網路地址。
  IPv4 的本地鏈路地址在 CIDR 表示法的地址塊 169.254.0.0/16 中定義。

<!--
The ip-masq-agent configures iptables rules to handle masquerading node/pod IP addresses when sending traffic to destinations outside the cluster node's IP and the Cluster IP range.  This essentially hides pod IP addresses behind the cluster node's IP address.  In some environments, traffic to "external" addresses must come from a known machine address. For example, in Google Cloud, any traffic to the internet must come from a VM's IP.  When containers are used, as in Google Kubernetes Engine, the Pod IP will be rejected for egress. To avoid this, we must hide the Pod IP behind the VM's own IP address - generally known as "masquerade". By default, the agent is configured to treat the three private IP ranges specified by [RFC 1918](https://tools.ietf.org/html/rfc1918) as non-masquerade [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing).  These ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. The agent will also treat link-local (169.254.0.0/16) as a non-masquerade CIDR by default.  The agent is configured to reload its configuration from the location */etc/config/ip-masq-agent* every 60 seconds, which is also configurable.
-->
ip-masq-agent 配置 iptables 規則，以便在將流量傳送到叢集節點的 IP 和叢集 IP 範圍之外的目標時
處理偽裝節點或 Pod 的 IP 地址。這本質上隱藏了叢集節點 IP 地址後面的 Pod IP 地址。
在某些環境中，去往“外部”地址的流量必須從已知的機器地址發出。
例如，在 Google Cloud 中，任何到網際網路的流量都必須來自 VM 的 IP。
使用容器時，如 Google Kubernetes Engine，從 Pod IP 發出的流量將被拒絕出站。
為了避免這種情況，我們必須將 Pod IP 隱藏在 VM 自己的 IP 地址後面 - 通常稱為“偽裝”。
預設情況下，代理配置為將
[RFC 1918](https://tools.ietf.org/html/rfc1918)
指定的三個私有 IP 範圍視為非偽裝
[CIDR](https://zh.wikipedia.org/wiki/%E6%97%A0%E7%B1%BB%E5%88%AB%E5%9F%9F%E9%97%B4%E8%B7%AF%E7%94%B1)。
這些範圍是 10.0.0.0/8,172.16.0.0/12 和 192.168.0.0/16。
預設情況下，代理還將鏈路本地地址（169.254.0.0/16）視為非偽裝 CIDR。
代理程式配置為每隔 60 秒從 */etc/config/ip-masq-agent* 重新載入其配置，
這也是可修改的。

![masq/non-masq example](/images/docs/ip-masq.png)

<!--
The agent configuration file must be written in YAML or JSON syntax, and may contain three optional keys:
-->
代理配置檔案必須使用 YAML 或 JSON 語法編寫，並且可能包含三個可選值：

<!--
* `nonMasqueradeCIDRs`: A list of strings in
  [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation that specify the non-masquerade ranges.
-->
* `nonMasqueradeCIDRs`：
  [CIDR](https://zh.wikipedia.org/wiki/%E6%97%A0%E7%B1%BB%E5%88%AB%E5%9F%9F%E9%97%B4%E8%B7%AF%E7%94%B1)
  表示法中的字串列表，用於指定不需偽裝的地址範圍。

<!--
* `masqLinkLocal`: A Boolean (true/false) which indicates whether to masquerade traffic to the
  link local prefix `169.254.0.0/16`. False by default.
-->
* `masqLinkLocal`：布林值 (true/false)，表示是否為本地鏈路字首 169.254.0.0/16 的流量提供偽裝。
  預設為 false。

<!--
* `resyncInterval`: A time interval at which the agent attempts to reload config from disk.
  For example: '30s', where 's' means seconds, 'ms' means milliseconds.
-->
* `resyncInterval`：代理從磁碟重新載入配置的重試時間間隔。
  例如 '30s'，其中 's' 是秒，'ms' 是毫秒。

<!--
Traffic to 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16) ranges will NOT be masqueraded. Any other traffic (assumed to be internet) will be masqueraded.  An example of a local destination from a pod could be its Node's IP address as well as another node's address or one of the IP addresses in Cluster's IP range.   Any other traffic will be masqueraded by default.  The below entries show the default set of rules that are applied by the ip-masq-agent:
-->
10.0.0.0/8、172.16.0.0/12 和 192.168.0.0/16 範圍內的流量不會被偽裝。
任何其他流量（假設是網際網路）將被偽裝。
Pod 訪問本地目的地的例子，可以是其節點的 IP 地址、另一節點的地址或叢集的 IP 地址範圍內的一個 IP 地址。
預設情況下，任何其他流量都將偽裝。以下條目展示了 ip-masq-agent 的預設使用的規則：

```shell
iptables -t nat -L IP-MASQ-AGENT
```

```none
RETURN     all  --  anywhere             169.254.0.0/16       /* ip-masq-agent: cluster-local traffic should not be subject to MASQUERADE */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             10.0.0.0/8           /* ip-masq-agent: cluster-local traffic should not be subject to MASQUERADE */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             172.16.0.0/12        /* ip-masq-agent: cluster-local traffic should not be subject to MASQUERADE */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             192.168.0.0/16       /* ip-masq-agent: cluster-local traffic should not be subject to MASQUERADE */ ADDRTYPE match dst-type !LOCAL
MASQUERADE  all  --  anywhere             anywhere             /* ip-masq-agent: outbound traffic should be subject to MASQUERADE (this match must come after cluster-local CIDR matches) */ ADDRTYPE match dst-type !LOCAL

```

<!--
By default, in GCE/Google Kubernetes Engine, if network policy is enabled or
you are using a cluster CIDR not in the 10.0.0.0/8 range, the `ip-masq-agent`
will run in your cluster. If you are running in another environment,
you can add the `ip-masq-agent` [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
to your cluster.
-->
預設情況下，在 GCE/Google Kubernetes Engine 中，如果啟用了網路策略，
或者你使用的叢集 CIDR 不在 10.0.0.0/8 範圍內，
則 `ip-masq-agent` 將在你的叢集中執行。
如果你在其他環境中執行，可以將 `ip-masq-agent`
[DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/) 新增到你的叢集中。

<!-- steps -->

<!--
## Create an ip-masq-agent
To create an ip-masq-agent, run the following kubectl command:
-->
## 建立 ip-masq-agent

透過執行以下 kubectl 指令建立 ip-masq-agent:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/ip-masq-agent/master/ip-masq-agent.yaml
```

<!--
You must also apply the appropriate node label to any nodes in your cluster that you want the agent to run on.
-->
你必須同時將適當的節點標籤應用於叢集中希望代理執行的任何節點。

```shell
kubectl label nodes my-node beta.kubernetes.io/masq-agent-ds-ready=true
```

<!--
More information can be found in the ip-masq-agent documentation [here](https://github.com/kubernetes-sigs/ip-masq-agent)
-->
更多資訊可以透過 ip-masq-agent 文件 [這裡](https://github.com/kubernetes-sigs/ip-masq-agent) 找到。

<!--
In most cases, the default set of rules should be sufficient; however, if this is not the case for your cluster, you can create and apply a [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) to customize the IP ranges that are affected.  For example, to allow only 10.0.0.0/8 to be considered by the ip-masq-agent, you can create the following [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/) in a file called "config".
-->
在大多數情況下，預設的規則集應該足夠；但是，如果你的叢集不是這種情況，則可以建立並應用
[ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
來自定義受影響的 IP 範圍。
例如，要允許 ip-masq-agent 僅作用於 10.0.0.0/8，你可以在一個名為 “config” 的檔案中建立以下
[ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/) 。

{{< note >}}
<!--
It is important that the file is called config since, by default, that will be used as the key for lookup by the `ip-masq-agent`:
-->
重要的是，該檔案之所以被稱為 config，因為預設情況下，該檔案將被用作
`ip-masq-agent` 查詢的主鍵：

```yaml
nonMasqueradeCIDRs:
  - 10.0.0.0/8
resyncInterval: 60s
```
{{< /note >}}

<!--
Run the following command to add the config map to your cluster:
-->
執行以下命令將 ConfigMap 新增到你的叢集：

```shell
kubectl create configmap ip-masq-agent --from-file=config --namespace=kube-system
```

<!--
This will update a file located at `/etc/config/ip-masq-agent` which is periodically checked every `resyncInterval` and applied to the cluster node.
After the resync interval has expired, you should see the iptables rules reflect your changes:
-->
這將更新位於 `/etc/config/ip-masq-agent` 的一個檔案，該檔案以 `resyncInterval`
為週期定期檢查並應用於叢集節點。
重新同步間隔到期後，你應該看到你的更改在 iptables 規則中體現：

```shell
iptables -t nat -L IP-MASQ-AGENT
```

```none
Chain IP-MASQ-AGENT (1 references)
target     prot opt source               destination
RETURN     all  --  anywhere             169.254.0.0/16       /* ip-masq-agent: cluster-local traffic should not be subject to MASQUERADE */ ADDRTYPE match dst-type !LOCAL
RETURN     all  --  anywhere             10.0.0.0/8           /* ip-masq-agent: cluster-local
MASQUERADE  all  --  anywhere             anywhere             /* ip-masq-agent: outbound traffic should be subject to MASQUERADE (this match must come after cluster-local CIDR matches) */ ADDRTYPE match dst-type !LOCAL
```

<!--
By default, the link local range (169.254.0.0/16) is also handled by the ip-masq agent, which sets up the appropriate iptables rules.  To have the ip-masq-agent ignore link local, you can set `masqLinkLocal` to true in the ConfigMap.
-->
預設情況下，本地鏈路範圍 (169.254.0.0/16) 也由 ip-masq agent 處理，
該代理設定適當的 iptables 規則。 要使 ip-masq-agent 忽略本地鏈路，
可以在 ConfigMap 中將 `masqLinkLocal` 設定為 true。

```yaml
nonMasqueradeCIDRs:
  - 10.0.0.0/8
resyncInterval: 60s
masqLinkLocal: true
```

