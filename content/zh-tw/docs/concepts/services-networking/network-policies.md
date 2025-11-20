---
title: 網路策略
content_type: concept
api_metadata:
  - apiVersion: "networking.k8s.io/v1"
    kind: "NetworkPolicy"
weight: 70
description: >-
  如果你希望在 IP 地址或端口層面（OSI 第 3 層或第 4 層）控制網路流量，
  NetworkPolicy 可以讓你爲叢集內以及 Pod 與外界之間的網路流量指定規則。
  你的叢集必須使用支持 NetworkPolicy 實施的網路插件。
---

<!--
reviewers:
- thockin
- caseydavenport
- danwinship
title: Network Policies
content_type: concept
api_metadata:
- apiVersion: "networking.k8s.io/v1"
  kind: "NetworkPolicy"
weight: 70
description: >-
  If you want to control traffic flow at the IP address or port level (OSI layer 3 or 4),
  NetworkPolicies allow you to specify rules for traffic flow within your cluster, and
  also between Pods and the outside world.
  Your cluster must use a network plugin that supports NetworkPolicy enforcement.
-->

<!-- overview -->

<!--
If you want to control traffic flow at the IP address or port level for TCP, UDP, and SCTP protocols,
then you might consider using Kubernetes NetworkPolicies for particular applications in your cluster.
NetworkPolicies are an application-centric construct which allow you to specify how a
{{< glossary_tooltip text="pod" term_id="pod">}} is allowed to communicate with various network
"entities" (we use the word "entity" here to avoid overloading the more common terms such as
"endpoints" and "services", which have specific Kubernetes connotations) over the network.
NetworkPolicies apply to a connection with a pod on one or both ends, and are not relevant to
other connections.
-->
如果你希望針對 TCP、UDP 和 SCTP 協議在 IP 地址或端口層面控制網路流量，
則你可以考慮爲叢集中特定應用使用 Kubernetes 網路策略（NetworkPolicy）。
NetworkPolicy 是一種以應用爲中心的結構，允許你設置如何允許
{{< glossary_tooltip text="Pod" term_id="pod">}} 與網路上的各類網路“實體”
（我們這裏使用實體以避免過度使用諸如“端點”和“服務”這類常用術語，
這些術語在 Kubernetes 中有特定含義）通信。
NetworkPolicy 適用於一端或兩端與 Pod 的連接，與其他連接無關。

<!--
The entities that a Pod can communicate with are identified through a combination of the following
three identifiers:

1. Other pods that are allowed (exception: a pod cannot block access to itself)
1. Namespaces that are allowed
1. IP blocks (exception: traffic to and from the node where a Pod is running is always allowed,
   regardless of the IP address of the Pod or the node)
-->
Pod 可以與之通信的實體是通過如下三個標識符的組合來辯識的：

1. 其他被允許的 Pod（例外：Pod 無法阻塞對自身的訪問）
2. 被允許的名字空間
3. IP 組塊（例外：與 Pod 運行所在的節點的通信總是被允許的，
   無論 Pod 或節點的 IP 地址）

<!--
When defining a pod- or namespace-based NetworkPolicy, you use a
{{< glossary_tooltip text="selector" term_id="selector">}} to specify what traffic is allowed to
and from the Pod(s) that match the selector.

Meanwhile, when IP-based NetworkPolicies are created, we define policies based on IP blocks (CIDR ranges).
-->
在定義基於 Pod 或名字空間的 NetworkPolicy 時，
你會使用{{< glossary_tooltip text="選擇算符" term_id="selector">}}來設定哪些流量可以進入或離開與該算符匹配的 Pod。

另外，當創建基於 IP 的 NetworkPolicy 時，我們基於 IP 組塊（CIDR 範圍）來定義策略。

<!-- body -->

<!--
## Prerequisites

Network policies are implemented by the [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
To use network policies, you must be using a networking solution which supports NetworkPolicy.
Creating a NetworkPolicy resource without a controller that implements it will have no effect.
-->
## 前置條件   {#prerequisites}

網路策略通過[網路插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)來實現。
要使用網路策略，你必須使用支持 NetworkPolicy 的網路解決方案。
創建一個 NetworkPolicy 資源對象而沒有控制器來使它生效的話，是沒有任何作用的。

<!--
## The two Sorts of Pod isolation

There are two sorts of isolation for a pod: isolation for egress, and isolation for ingress.
They concern what connections may be established. "Isolation" here is not absolute, rather it
means "some restrictions apply". The alternative, "non-isolated for $direction", means that no
restrictions apply in the stated direction. The two sorts of isolation (or not) are declared
independently, and are both relevant for a connection from one pod to another.
-->
## Pod 隔離的兩種類型   {#the-two-sorts-of-pod-isolation}

Pod 有兩種隔離：出口的隔離和入口的隔離。它們涉及到可以建立哪些連接。
這裏的“隔離”不是絕對的，而是意味着“有一些限制”。
另外的，“非隔離方向”意味着在所述方向上沒有限制。這兩種隔離（或不隔離）是獨立聲明的，
並且都與從一個 Pod 到另一個 Pod 的連接有關。

<!--
By default, a pod is non-isolated for egress; all outbound connections are allowed.
A pod is isolated for egress if there is any NetworkPolicy that both selects the pod and has
"Egress" in its `policyTypes`; we say that such a policy applies to the pod for egress.
When a pod is isolated for egress, the only allowed connections from the pod are those allowed by
the `egress` list of some NetworkPolicy that applies to the pod for egress. Reply traffic for those
allowed connections will also be implicitly allowed.
The effects of those `egress` lists combine additively.
-->
預設情況下，一個 Pod 的出口是非隔離的，即所有外向連接都是被允許的。如果有任何的 NetworkPolicy
選擇該 Pod 並在其 `policyTypes` 中包含 "Egress"，則該 Pod 是出口隔離的，
我們稱這樣的策略適用於該 Pod 的出口。當一個 Pod 的出口被隔離時，
唯一允許的來自 Pod 的連接是適用於出口的 Pod 的某個 NetworkPolicy 的 `egress` 列表所允許的連接。
針對那些允許連接的應答流量也將被隱式允許。
這些 `egress` 列表的效果是相加的。

<!--
By default, a pod is non-isolated for ingress; all inbound connections are allowed.
A pod is isolated for ingress if there is any NetworkPolicy that both selects the pod and
has "Ingress" in its `policyTypes`; we say that such a policy applies to the pod for ingress.
When a pod is isolated for ingress, the only allowed connections into the pod are those from
the pod's node and those allowed by the `ingress` list of some NetworkPolicy that applies to
the pod for ingress. Reply traffic for those allowed connections will also be implicitly allowed.
The effects of those `ingress` lists combine additively.
-->
預設情況下，一個 Pod 對入口是非隔離的，即所有入站連接都是被允許的。如果有任何的 NetworkPolicy
選擇該 Pod 並在其 `policyTypes` 中包含 “Ingress”，則該 Pod 被隔離入口，
我們稱這種策略適用於該 Pod 的入口。當一個 Pod 的入口被隔離時，唯一允許進入該 Pod
的連接是來自該 Pod 節點的連接和適用於入口的 Pod 的某個 NetworkPolicy 的 `ingress`
列表所允許的連接。針對那些允許連接的應答流量也將被隱式允許。這些 `ingress` 列表的效果是相加的。

<!--
Network policies do not conflict; they are additive. If any policy or policies apply to a given
pod for a given direction, the connections allowed in that direction from that pod is the union of
what the applicable policies allow. Thus, order of evaluation does not affect the policy result.

For a connection from a source pod to a destination pod to be allowed, both the egress policy on
the source pod and the ingress policy on the destination pod need to allow the connection. If
either side does not allow the connection, it will not happen.
-->
網路策略是相加的，所以不會產生衝突。如果策略適用於 Pod 某一特定方向的流量，
Pod 在對應方向所允許的連接是適用的網路策略所允許的集合。
因此，評估的順序不影響策略的結果。

要允許從源 Pod 到目的 Pod 的某個連接，源 Pod 的出口策略和目的 Pod 的入口策略都需要允許此連接。
如果任何一方不允許此連接，則連接將會失敗。

<!--
## The NetworkPolicy resource {#networkpolicy-resource}

See the [NetworkPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io)
reference for a full definition of the resource.

An example NetworkPolicy might look like this:
-->
## NetworkPolicy 資源 {#networkpolicy-resource}

參閱 [NetworkPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io)
來了解資源的完整定義。

下面是一個 NetworkPolicy 的示例：

{{< code_sample file="service/networking/networkpolicy.yaml" >}}

{{< note >}}
<!--
POSTing this to the API server for your cluster will have no effect unless your chosen networking
solution supports network policy.
-->
除非選擇支持網路策略的網路解決方案，否則將上述示例發送到 API 伺服器沒有任何效果。
{{< /note >}}

<!--
__Mandatory Fields__: As with all other Kubernetes config, a NetworkPolicy needs `apiVersion`,
`kind`, and `metadata` fields. For general information about working with config files, see
[Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/),
and [Object Management](/docs/concepts/overview/working-with-objects/object-management).

**spec**: NetworkPolicy [spec](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
has all the information needed to define a particular network policy in the given namespace.

**podSelector**: Each NetworkPolicy includes a `podSelector` which selects the grouping of pods to
which the policy applies. The example policy selects pods with the label "role=db". An empty
`podSelector` selects all pods in the namespace.
-->
**必需字段**：與所有其他的 Kubernetes 設定一樣，NetworkPolicy 需要 `apiVersion`、
`kind` 和 `metadata` 字段。關於設定檔案操作的一般資訊，
請參考[設定 Pod 以使用 ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/)
和[對象管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management)。

**spec**：NetworkPolicy
[規約](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
中包含了在一個名字空間中定義特定網路策略所需的所有資訊。

**podSelector**：每個 NetworkPolicy 都包括一個 `podSelector`，
它對該策略所適用的一組 Pod 進行選擇。示例中的策略選擇帶有 "role=db" 標籤的 Pod。
空的 `podSelector` 選擇名字空間下的所有 Pod。

<!--
**policyTypes**: Each NetworkPolicy includes a `policyTypes` list which may include either
`Ingress`, `Egress`, or both. The `policyTypes` field indicates whether or not the given policy
applies to ingress traffic to selected pod, egress traffic from selected pods, or both. If no
`policyTypes` are specified on a NetworkPolicy then by default `Ingress` will always be set and
`Egress` will be set if the NetworkPolicy has any egress rules.

**ingress**: Each NetworkPolicy may include a list of allowed `ingress` rules. Each rule allows
traffic which matches both the `from` and `ports` sections. The example policy contains a single
rule, which matches traffic on a single port, from one of three sources, the first specified via
an `ipBlock`, the second via a `namespaceSelector` and the third via a `podSelector`.

**egress**: Each NetworkPolicy may include a list of allowed `egress` rules. Each rule allows
traffic which matches both the `to` and `ports` sections. The example policy contains a single
rule, which matches traffic on a single port to any destination in `10.0.0.0/24`.
-->
**policyTypes**：每個 NetworkPolicy 都包含一個 `policyTypes` 列表，其中包含
`Ingress` 或 `Egress` 或兩者兼具。`policyTypes` 字段表示給定的策略是應用於進入所選
Pod 的入站流量還是來自所選 Pod 的出站流量，或兩者兼有。
如果 NetworkPolicy 未指定 `policyTypes` 則預設情況下始終設置 `Ingress`；
如果 NetworkPolicy 有任何出口規則的話則設置 `Egress`。

**ingress**：每個 NetworkPolicy 可包含一個 `ingress` 規則的白名單列表。
每個規則都允許同時匹配 `from` 和 `ports` 部分的流量。示例策略中包含一條簡單的規則：
它匹配某個特定端口，來自三個來源中的一個，第一個通過 `ipBlock`
指定，第二個通過 `namespaceSelector` 指定，第三個通過 `podSelector` 指定。

**egress**：每個 NetworkPolicy 可包含一個 `egress` 規則的白名單列表。
每個規則都允許匹配 `to` 和 `ports` 部分的流量。該示例策略包含一條規則，
該規則將指定端口上的流量匹配到 `10.0.0.0/24` 中的任何目的地。

<!--
So, the example NetworkPolicy:

1. isolates `role=db` pods in the `default` namespace for both ingress and egress traffic
   (if they weren't already isolated)
1. (Ingress rules) allows connections to all pods in the `default` namespace with the label
   `role=db` on TCP port 6379 from:

   * any pod in the `default` namespace with the label `role=frontend`
   * any pod in a namespace with the label `project=myproject`
   * IP addresses in the ranges `172.17.0.0`–`172.17.0.255` and `172.17.2.0`–`172.17.255.255`
     (ie, all of `172.17.0.0/16` except `172.17.1.0/24`)

1. (Egress rules) allows connections from any pod in the `default` namespace with the label
   `role=db` to CIDR `10.0.0.0/24` on TCP port 5978

See the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
walkthrough for further examples.
-->
所以，該網路策略示例：

1. 隔離 `default` 名字空間下 `role=db` 的 Pod （如果它們不是已經被隔離的話）。
2. （Ingress 規則）允許以下 Pod 連接到 `default` 名字空間下的帶有 `role=db`
   標籤的所有 Pod 的 6379 TCP 端口：

   * `default` 名字空間下帶有 `role=frontend` 標籤的所有 Pod
   * 帶有 `project=myproject` 標籤的所有名字空間中的 Pod
   * IP 地址範圍爲 `172.17.0.0–172.17.0.255` 和 `172.17.2.0–172.17.255.255`
     （即，除了 `172.17.1.0/24` 之外的所有 `172.17.0.0/16`）

3. （Egress 規則）允許 `default` 名字空間中任何帶有標籤 `role=db` 的 Pod 到 CIDR
   `10.0.0.0/24` 下 5978 TCP 端口的連接。

有關更多示例，請參閱[聲明網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)演練。

<!--
## Behavior of `to` and `from` selectors

There are four kinds of selectors that can be specified in an `ingress` `from` section or `egress`
`to` section:

**podSelector**: This selects particular Pods in the same namespace as the NetworkPolicy which
should be allowed as ingress sources or egress destinations.

**namespaceSelector**: This selects particular namespaces for which all Pods should be allowed as
ingress sources or egress destinations.

**namespaceSelector** *and* **podSelector**: A single `to`/`from` entry that specifies both
`namespaceSelector` and `podSelector` selects particular Pods within particular namespaces. Be
careful to use correct YAML syntax. For example:
-->
## 選擇器 `to` 和 `from` 的行爲   {#behavior-of-to-and-from-selectors}

可以在 `ingress` 的 `from` 部分或 `egress` 的 `to` 部分中指定四種選擇器：

**podSelector**：此選擇器將在與 NetworkPolicy 相同的名字空間中選擇特定的
Pod，應將其允許作爲入站流量來源或出站流量目的地。

**namespaceSelector**：此選擇器將選擇特定的名字空間，應將所有 Pod
用作其入站流量來源或出站流量目的地。

**namespaceSelector 和 podSelector**：一個指定 `namespaceSelector`
和 `podSelector` 的 `to`/`from` 條目選擇特定名字空間中的特定 Pod。
注意使用正確的 YAML 語法；下面的策略：

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
      podSelector:
        matchLabels:
          role: client
  ...
```

<!--
This policy contains a single `from` element allowing connections from Pods with the label
`role=client` in namespaces with the label `user=alice`. But the following policy is different:
-->
此策略在 `from` 數組中僅包含一個元素，只允許來自標有 `role=client` 的 Pod
且該 Pod 所在的名字空間中標有 `user=alice` 的連接。但是**這項**策略：

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
    - podSelector:
        matchLabels:
          role: client
  ...
```

<!--
It contains two elements in the `from` array, and allows connections from Pods in the local
Namespace with the label `role=client`, *or* from any Pod in any namespace with the label
`user=alice`.
-->
它在 `from` 數組中包含兩個元素，允許來自本地名字空間中標有 `role=client` 的
Pod 的連接，**或**來自任何名字空間中標有 `user=alice` 的任何 Pod 的連接。

<!--
When in doubt, use `kubectl describe` to see how Kubernetes has interpreted the policy.

<a name="behavior-of-ipblock-selectors"></a>
**ipBlock**: This selects particular IP CIDR ranges to allow as ingress sources or egress
destinations. These should be cluster-external IPs, since Pod IPs are ephemeral and unpredictable.

Cluster ingress and egress mechanisms often require rewriting the source or destination IP
of packets. In cases where this happens, it is not defined whether this happens before or
after NetworkPolicy processing, and the behavior may be different for different
combinations of network plugin, cloud provider, `Service` implementation, etc.

In the case of ingress, this means that in some cases you may be able to filter incoming
packets based on the actual original source IP, while in other cases, the "source IP" that
the NetworkPolicy acts on may be the IP of a `LoadBalancer` or of the Pod's node, etc.

For egress, this means that connections from pods to `Service` IPs that get rewritten to
cluster-external IPs may or may not be subject to `ipBlock`-based policies.
-->
如有疑問，請使用 `kubectl describe` 查看 Kubernetes 如何解釋該策略。

**ipBlock**：此選擇器將選擇特定的 IP CIDR 範圍以用作入站流量來源或出站流量目的地。
這些應該是叢集外部 IP，因爲 Pod IP 存在時間短暫的且隨機產生。

叢集的入站和出站機制通常需要重寫資料包的源 IP 或目標 IP。
在發生這種情況時，不確定在 NetworkPolicy 處理之前還是之後發生，
並且對於網路插件、雲提供商、`Service` 實現等的不同組合，其行爲可能會有所不同。

對入站流量而言，這意味着在某些情況下，你可以根據實際的原始源 IP 過濾傳入的資料包，
而在其他情況下，NetworkPolicy 所作用的 `源IP` 則可能是 `LoadBalancer` 或
Pod 的節點等。

對於出站流量而言，這意味着從 Pod 到被重寫爲叢集外部 IP 的 `Service` IP
的連接可能會或可能不會受到基於 `ipBlock` 的策略的約束。

<!--
## Default policies

By default, if no policies exist in a namespace, then all ingress and egress traffic is allowed to
and from pods in that namespace. The following examples let you change the default behavior
in that namespace.
-->
## 預設策略   {#default-policies}

預設情況下，如果名字空間中不存在任何策略，則所有進出該名字空間中 Pod 的流量都被允許。
以下示例使你可以更改該名字空間中的預設行爲。

<!--
### Default deny all ingress traffic
-->
### 預設拒絕所有入站流量   {#default-deny-all-ingress-traffic}

<!--
You can create a "default" ingress isolation policy for a namespace by creating a NetworkPolicy
that selects all pods but does not allow any ingress traffic to those pods.
-->
你可以通過創建選擇所有 Pod 但不允許任何進入這些 Pod 的入站流量的 NetworkPolicy
來爲名字空間創建 "default" 隔離策略。

{{< code_sample file="service/networking/network-policy-default-deny-ingress.yaml" >}}

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will still be isolated
for ingress. This policy does not affect isolation for egress from any pod.
-->
這確保即使沒有被任何其他 NetworkPolicy 選擇的 Pod 仍將被隔離以進行入口。
此策略不影響任何 Pod 的出口隔離。

<!--
### Allow all ingress traffic
-->
### 允許所有入站流量   {#allow-all-ingress-traffic}

<!--
If you want to allow all incoming connections to all pods in a namespace, you can create a policy
that explicitly allows that.
-->
如果你想允許一個名字空間中所有 Pod 的所有入站連接，你可以創建一個明確允許的策略。

{{< code_sample file="service/networking/network-policy-allow-all-ingress.yaml" >}}

<!--
With this policy in place, no additional policy or policies can cause any incoming connection to
those pods to be denied. This policy has no effect on isolation for egress from any pod.
-->
有了這個策略，任何額外的策略都不會導致到這些 Pod 的任何入站連接被拒絕。
此策略對任何 Pod 的出口隔離沒有影響。

<!--
### Default deny all egress traffic

You can create a "default" egress isolation policy for a namespace by creating a NetworkPolicy
that selects all pods but does not allow any egress traffic from those pods.
-->
### 預設拒絕所有出站流量   {#default-deny-all-egress-traffic}

你可以通過創建選擇所有容器但不允許來自這些容器的任何出站流量的 NetworkPolicy
來爲名字空間創建 "default" 隔離策略。

{{< code_sample file="service/networking/network-policy-default-deny-egress.yaml" >}}

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will not be allowed
egress traffic. This policy does not change the ingress isolation behavior of any pod.
-->
此策略可以確保即使沒有被其他任何 NetworkPolicy 選擇的 Pod 也不會被允許流出流量。
此策略不會更改任何 Pod 的入站流量隔離行爲。

<!--
### Allow all egress traffic
-->
### 允許所有出站流量   {#allow-all-egress-traffic}

<!--
If you want to allow all connections from all pods in a namespace, you can create a policy that
explicitly allows all outgoing connections from pods in that namespace.
-->
如果要允許來自名字空間中所有 Pod 的所有連接，
則可以創建一個明確允許來自該名字空間中 Pod 的所有出站連接的策略。

{{< code_sample file="service/networking/network-policy-allow-all-egress.yaml" >}}

<!--
With this policy in place, no additional policy or policies can cause any outgoing connection from
those pods to be denied. This policy has no effect on isolation for ingress to any pod.
-->
有了這個策略，任何額外的策略都不會導致來自這些 Pod 的任何出站連接被拒絕。
此策略對進入任何 Pod 的隔離沒有影響。

<!--
### Default deny all ingress and all egress traffic

You can create a "default" policy for a namespace which prevents all ingress AND egress traffic by
creating the following NetworkPolicy in that namespace.
-->
### 預設拒絕所有入站和所有出站流量   {#default-deny-all-ingress-and-all-egress-traffic}

你可以爲名字空間創建 "default" 策略，以通過在該名字空間中創建以下 NetworkPolicy
來阻止所有入站和出站流量。

{{< code_sample file="service/networking/network-policy-default-deny-all.yaml" >}}

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will not be allowed
ingress or egress traffic.
-->
此策略可以確保即使沒有被其他任何 NetworkPolicy 選擇的 Pod 也不會被允許入站或出站流量。

<!--
## Network traffic filtering

NetworkPolicy is defined for [layer 4](https://en.wikipedia.org/wiki/OSI_model#Layer_4:_Transport_layer)
connections (TCP, UDP, and optionally SCTP). For all the other protocols, the behaviour may vary
across network plugins.
-->
## 網路流量過濾   {#network-traffic-filtering}

NetworkPolicy 是爲[第 4 層](https://zh.wikipedia.org/wiki/OSI%E6%A8%A1%E5%9E%8B#%E7%AC%AC4%E5%B1%A4_%E5%82%B3%E8%BC%B8%E5%B1%A4)連接
（TCP、UDP 和可選的 SCTP）所定義的。對於所有其他協議，這種網路流量過濾的行爲可能因網路插件而異。

{{< note >}}
<!--
You must be using a {{< glossary_tooltip text="CNI" term_id="cni" >}} plugin that supports SCTP
protocol NetworkPolicies.
-->
你必須使用支持 SCTP 協議 NetworkPolicy 的 {{< glossary_tooltip text="CNI" term_id="cni" >}} 插件。
{{< /note >}}

<!--
When a `deny all` network policy is defined, it is only guaranteed to deny TCP, UDP and SCTP
connections. For other protocols, such as ARP or ICMP, the behaviour is undefined.
The same applies to allow rules: when a specific pod is allowed as ingress source or egress destination,
it is undefined what happens with (for example) ICMP packets. Protocols such as ICMP may be allowed by some
network plugins and denied by others.
-->
當 `deny all` 網路策略被定義時，此策略只能保證拒絕 TCP、UDP 和 SCTP 連接。
對於 ARP 或 ICMP 這類其他協議，這種網路流量過濾行爲是未定義的。
相同的情況也適用於 allow 規則：當特定 Pod 被允許作爲入口源或出口目的地時，
對於（例如）ICMP 資料包會發生什麼是未定義的。
ICMP 這類協議可能被某些網路插件所允許，而被另一些網路插件所拒絕。

<!--
## Targeting a range of ports
-->
## 針對某個端口範圍   {#targeting-a-range-of-ports}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

<!--
When writing a NetworkPolicy, you can target a range of ports instead of a single port.

This is achievable with the usage of the `endPort` field, as the following example:
-->
在編寫 NetworkPolicy 時，你可以針對一個端口範圍而不是某個固定端口。

這一目的可以通過使用 `endPort` 字段來實現，如下例所示：

{{< code_sample file="service/networking/networkpolicy-multiport-egress.yaml" >}}

<!--
The above rule allows any Pod with label `role=db` on the namespace `default` to communicate
with any IP within the range `10.0.0.0/24` over TCP, provided that the target
port is between the range 32000 and 32768.
-->
上面的規則允許名字空間 `default` 中所有帶有標籤 `role=db` 的 Pod 使用 TCP 協議與
`10.0.0.0/24` 範圍內的 IP 通信，只要目標端口介於 32000 和 32768 之間就可以。

<!--
The following restrictions apply when using this field:

* The `endPort` field must be equal to or greater than the `port` field.
* `endPort` can only be defined if `port` is also defined.
* Both ports must be numeric.
-->
使用此字段時存在以下限制：

* `endPort` 字段必須等於或者大於 `port` 字段的值。
* 只有在定義了 `port` 時才能定義 `endPort`。
* 兩個字段的設置值都只能是數字。

{{< note >}}
<!--
Your cluster must be using a {{< glossary_tooltip text="CNI" term_id="cni" >}} plugin that
supports the `endPort` field in NetworkPolicy specifications.
If your [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
does not support the `endPort` field and you specify a NetworkPolicy with that,
the policy will be applied only for the single `port` field.
-->
你的叢集所使用的 {{< glossary_tooltip text="CNI" term_id="cni" >}} 插件必須支持在
NetworkPolicy 規約中使用 `endPort` 字段。
如果你的[網路插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)不支持
`endPort` 字段，而你指定了一個包含 `endPort` 字段的 NetworkPolicy，
策略只對單個 `port` 字段生效。
{{< /note >}}

<!--
## Targeting multiple namespaces by label

In this scenario, your `Egress` NetworkPolicy targets more than one namespace using their
label names. For this to work, you need to label the target namespaces. For example:
-->
## 按標籤選擇多個名字空間   {#targeting-multiple-namespaces-by-label}

在這種情況下，你的 `Egress` NetworkPolicy 使用名字空間的標籤名稱來將多個名字空間作爲其目標。
爲此，你需要爲目標名字空間設置標籤。例如：

```shell
kubectl label namespace frontend namespace=frontend
kubectl label namespace backend namespace=backend
```

<!--
Add the labels under `namespaceSelector` in your NetworkPolicy document. For example:
-->
在 NetworkPolicy 文檔中的 `namespaceSelector` 下添加標籤。例如：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: egress-namespaces
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
    - Egress
  egress:
    - to:
      - namespaceSelector:
          matchExpressions:
            - key: namespace
              operator: In
              values: ["frontend", "backend"]
```

{{< note >}}
<!--
It is not possible to directly specify the name of the namespaces in a NetworkPolicy.
You must use a `namespaceSelector` with `matchLabels` or `matchExpressions` to select the
namespaces based on their labels.
-->
你不可以在 NetworkPolicy 中直接指定名字空間的名稱。
你必須使用帶有 `matchLabels` 或 `matchExpressions` 的 `namespaceSelector`
來根據標籤選擇名字空間。
{{< /note >}}

<!--
## Targeting a Namespace by its name
-->
## 基於名字指向某名字空間   {#targeting-a-namespace-by-its-name}

<!--
The Kubernetes control plane sets an immutable label `kubernetes.io/metadata.name` on all
namespaces, the value of the label is the namespace name.

While NetworkPolicy cannot target a namespace by its name with some object field, you can use the
standardized label to target a specific namespace.
-->
Kubernetes 控制面會在所有名字空間上設置一個不可變更的標籤
`kubernetes.io/metadata.name`。該標籤的值是名字空間的名稱。

如果 NetworkPolicy 無法在某些對象字段中指向某名字空間，
你可以使用標準的標籤方式來指向特定名字空間。

<!--
## Pod lifecycle
-->
## Pod 生命週期   {#pod-lifecycle}

{{< note >}}
<!--
The following applies to clusters with a conformant networking plugin and a conformant implementation of
NetworkPolicy.
-->
以下內容適用於使用了合規網路插件和 NetworkPolicy 合規實現的叢集。
{{< /note >}}

<!--
When a new NetworkPolicy object is created, it may take some time for a network plugin
to handle the new object. If a pod that is affected by a NetworkPolicy
is created before the network plugin has completed NetworkPolicy handling,
that pod may be started unprotected, and isolation rules will be applied when
the NetworkPolicy handling is completed.
-->
當新的 NetworkPolicy 對象被創建時，網路插件可能需要一些時間來處理這個新對象。
如果受到 NetworkPolicy 影響的 Pod 在網路插件完成 NetworkPolicy 處理之前就被創建了，
那麼該 Pod 可能會最初處於無保護狀態，而在 NetworkPolicy 處理完成後被應用隔離規則。

<!--
Once the NetworkPolicy is handled by a network plugin,

1. All newly created pods affected by a given NetworkPolicy will be isolated before 
   they are started.
   Implementations of NetworkPolicy must ensure that filtering is effective throughout
   the Pod lifecycle, even from the very first instant that any container in that Pod is started.
   Because they are applied at Pod level, NetworkPolicies apply equally to init containers,
   sidecar containers, and regular containers.
-->
一旦 NetworkPolicy 被網路插件處理，

1. 所有受給定 NetworkPolicy 影響的新建 Pod 都將在啓動前被隔離。
   NetworkPolicy 的實現必須確保過濾規則在整個 Pod 生命週期內是有效的，
   這個生命週期要從該 Pod 的任何容器啓動的第一刻算起。
   因爲 NetworkPolicy 在 Pod 層面被應用，所以 NetworkPolicy 同樣適用於 Init 容器、邊車容器和常規容器。

<!--
2. Allow rules will be applied eventually after the isolation rules (or may be applied at the same time).
   In the worst case, a newly created pod may have no network connectivity at all when it is first started, if
   isolation rules were already applied, but no allow rules were applied yet.

Every created NetworkPolicy will be handled by a network plugin eventually, but there is no
way to tell from the Kubernetes API when exactly that happens.
-->
2. Allow 規則最終將在隔離規則之後被應用（或者可能同時被應用）。
   在最糟的情況下，如果隔離規則已被應用，但 allow 規則尚未被應用，
   那麼新建的 Pod 在初始啓動時可能根本沒有網路連接。

使用者所創建的每個 NetworkPolicy 最終都會被網路插件處理，但無法使用 Kubernetes API
來獲知確切的處理時間。

<!--
Therefore, pods must be resilient against being started up with different network
connectivity than expected. If you need to make sure the pod can reach certain destinations
before being started, you can use an [init container](/docs/concepts/workloads/pods/init-containers/)
to wait for those destinations to be reachable before kubelet starts the app containers.
-->
因此，若 Pod 啓動時使用非預期的網路連接，它必須保持穩定。
如果你需要確保 Pod 在啓動之前能夠訪問特定的目標，可以使用
[Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)在
kubelet 啓動應用容器之前等待這些目的地變得可達。

<!--
Every NetworkPolicy will be applied to all selected pods eventually.
Because the network plugin may implement NetworkPolicy in a distributed manner,
it is possible that pods may see a slightly inconsistent view of network policies
when the pod is first created, or when pods or policies change.
For example, a newly-created pod that is supposed to be able to reach both Pod A
on Node 1 and Pod B on Node 2 may find that it can reach Pod A immediately,
but cannot reach Pod B until a few seconds later.
-->
每個 NetworkPolicy 最終都會被應用到所選定的所有 Pod 之上。
由於網路插件可能以分佈式的方式實現 NetworkPolicy，所以當 Pod 被首次創建時或當
Pod 或策略發生變化時，Pod 可能會看到稍微不一致的網路策略視圖。
例如，新建的 Pod 本來應能立即訪問 Node 1 上的 Pod A 和 Node 2 上的 Pod B，
但可能你會發現新建的 Pod 可以立即訪問 Pod A，但要在幾秒後才能訪問 Pod B。

<!--
## NetworkPolicy and `hostNetwork` pods

NetworkPolicy behaviour for `hostNetwork` pods is undefined, but it should be limited to 2 possibilities:
-->
## NetworkPolicy 和 `hostNetwork` Pod    {#networkpolicy-and-hostnetwork-pods}

針對 `hostNetwork` Pod 的 NetworkPolicy 行爲是未定義的，但應限制爲以下兩種可能：

<!--
- The network plugin can distinguish `hostNetwork` pod traffic from all other traffic
  (including being able to distinguish traffic from different `hostNetwork` pods on
  the same node), and will apply NetworkPolicy to `hostNetwork` pods just like it does
  to pod-network pods.
-->
- 網路插件可以從所有其他流量中辨別出 `hostNetwork` Pod 流量
  （包括能夠從同一節點上的不同 `hostNetwork` Pod 中辨別流量），
  網路插件還可以像處理 Pod 網路流量一樣，對 `hostNetwork` Pod 應用 NetworkPolicy。

<!--
- The network plugin cannot properly distinguish `hostNetwork` pod traffic,
  and so it ignores `hostNetwork` pods when matching `podSelector` and `namespaceSelector`.
  Traffic to/from `hostNetwork` pods is treated the same as all other traffic to/from the node IP.
  (This is the most common implementation.)
-->
- 網路插件無法正確辨別 `hostNetwork` Pod 流量，因此在匹配 `podSelector` 和 `namespaceSelector`
  時會忽略 `hostNetwork` Pod。流向/來自 `hostNetwork` Pod 的流量的處理方式與流向/來自節點 IP
  的所有其他流量一樣。（這是最常見的實現方式。）

<!--
This applies when
-->
這適用於以下情形：

<!--
1. a `hostNetwork` pod is selected by `spec.podSelector`.
-->
1. `hostNetwork` Pod 被 `spec.podSelector` 選中。
   
   ```yaml
     ...
     spec:
       podSelector:
         matchLabels:
           role: client
     ...
   ```
 
<!--
1. a `hostNetwork` pod is selected by a `podSelector` or `namespaceSelector` in an `ingress` or `egress` rule.
-->
2. `hostNetwork` Pod 在 `ingress` 或 `egress` 規則中被 `podSelector` 或
   `namespaceSelector` 選中。

   ```yaml
     ...
     ingress:
       - from:
         - podSelector:
             matchLabels:
               role: client
     ...
   ```

<!--
At the same time, since `hostNetwork` pods have the same IP addresses as the nodes they reside on,
their connections will be treated as node connections. For example, you can allow traffic
from a `hostNetwork` Pod using an `ipBlock` rule.
-->
同時，由於 `hostNetwork` Pod 具有與其所在節點相同的 IP 地址，所以它們的連接將被視爲節點連接。
例如，你可以使用 `ipBlock` 規則允許來自 `hostNetwork` Pod 的流量。

<!--
## What you can't do with network policies (at least, not yet)

As of Kubernetes {{< skew currentVersion >}}, the following functionality does not exist in the
NetworkPolicy API, but you might be able to implement workarounds using Operating System
components (such as SELinux, OpenVSwitch, IPTables, and so on) or Layer 7 technologies (Ingress
controllers, Service Mesh implementations) or admission controllers. In case you are new to
network security in Kubernetes, its worth noting that the following User Stories cannot (yet) be
implemented using the NetworkPolicy API.
-->
## 通過網路策略（至少目前還）無法完成的工作   {#what-you-can-t-do-with-network-policies-at-least-not-yet}

到 Kubernetes {{< skew currentVersion >}} 爲止，NetworkPolicy API 還不支持以下功能，
不過你可能可以使用操作系統組件（如 SELinux、OpenVSwitch、IPTables 等等）
或者第七層技術（Ingress 控制器、服務網格實現）或准入控制器來實現一些替代方案。
如果你對 Kubernetes 中的網路安全性還不太瞭解，瞭解使用 NetworkPolicy API
還無法實現下面的使用者場景是很值得的。

<!--
- Forcing internal cluster traffic to go through a common gateway (this might be best served with
  a service mesh or other proxy).
- Anything TLS related (use a service mesh or ingress controller for this).
- Node specific policies (you can use CIDR notation for these, but you cannot target nodes by
  their Kubernetes identities specifically).
- Targeting of services by name (you can, however, target pods or namespaces by their
  {{< glossary_tooltip text="labels" term_id="label" >}}, which is often a viable workaround).
- Creation or management of "Policy requests" that are fulfilled by a third party.
-->
- 強制叢集內部流量經過某公用網關（這種場景最好通過服務網格或其他代理來實現）；
- 與 TLS 相關的場景（考慮使用服務網格或者 Ingress 控制器）；
- 特定於節點的策略（你可以使用 CIDR 來表達這一需求不過你無法使用節點在
  Kubernetes 中的其他標識資訊來辯識目標節點）；
- 基於名字來選擇服務（不過，你可以使用 {{< glossary_tooltip text="標籤" term_id="label" >}}
  來選擇目標 Pod 或名字空間，這也通常是一種可靠的替代方案）；
- 創建或管理由第三方來實際完成的“策略請求”；
<!--
- Default policies which are applied to all namespaces or pods (there are some third party
  Kubernetes distributions and projects which can do this).
- Advanced policy querying and reachability tooling.
- The ability to log network security events (for example connections that are blocked or accepted).
- The ability to explicitly deny policies (currently the model for NetworkPolicies are deny by
  default, with only the ability to add allow rules).
- The ability to prevent loopback or incoming host traffic (Pods cannot currently block localhost
  access, nor do they have the ability to block access from their resident node).
-->
- 實現適用於所有名字空間或 Pod 的預設策略（某些第三方 Kubernetes 發行版本或項目可以做到這點）；
- 高級的策略查詢或者可達性相關工具；
- 生成網路安全事件日誌的能力（例如，被阻塞或接收的連接請求）；
- 顯式地拒絕策略的能力（目前，NetworkPolicy 的模型預設採用拒絕操作，
  其唯一的能力是添加允許策略）；
- 禁止本地迴路或指向宿主的網路流量（Pod 目前無法阻塞 localhost 訪問，
  它們也無法禁止來自所在節點的訪問請求）。

<!--
## NetworkPolicy's impact on existing connections

When the set of NetworkPolicies that applies to an existing connection changes - this could happen
either due to a change in NetworkPolicies or if the relevant labels of the namespaces/pods selected by the
policy (both subject and peers) are changed in the middle of an existing connection - it is
implementation defined as to whether the change will take effect for that existing connection or not.
Example: A policy is created that leads to denying a previously allowed connection, the underlying network plugin
implementation is responsible for defining if that new policy will close the existing connections or not.
It is recommended not to modify policies/pods/namespaces in ways that might affect existing connections.
-->
## NetworkPolicy 對現有連接的影響   {#networkpolicys-impact-on-existing-connections}

當應用到現有連接的 NetworkPolicy 集合發生變化時，這可能是由於 NetworkPolicy
發生變化或者在現有連接過程中（主體和對等方）策略所選擇的名字空間或 Pod 的相關標籤發生變化，
此時是否對該現有連接生效是由實現定義的。例如：某個策略的創建導致之前允許的連接被拒絕，
底層網路插件的實現負責定義這個新策略是否會關閉現有的連接。
建議不要以可能影響現有連接的方式修改策略、Pod 或名字空間。

## {{% heading "whatsnext" %}}

<!--
- See the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
  walkthrough for further examples.
- See more [recipes](https://github.com/ahmetb/kubernetes-network-policy-recipes) for common
  scenarios enabled by the NetworkPolicy resource.
-->
- 有關更多示例，請參閱[聲明網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)演練。
- 有關 NetworkPolicy 資源所支持的常見場景的更多資訊，
  請參見[此指南](https://github.com/ahmetb/kubernetes-network-policy-recipes)。
