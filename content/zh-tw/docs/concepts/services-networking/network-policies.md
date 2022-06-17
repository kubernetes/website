---
title: 網路策略
content_type: concept
weight: 50
---

<!--
title: Network Policies
content_type: concept
weight: 50
-->

<!-- overview -->

<!--
If you want to control traffic flow at the IP address or port level (OSI layer 3 or 4), then you might consider using Kubernetes NetworkPolicies for particular applications in your cluster.  NetworkPolicies are an application-centric construct which allow you to specify how a {{< glossary_tooltip text="pod" term_id="pod">}} is allowed to communicate with various network "entities" (we use the word "entity" here to avoid overloading the more common terms such as "endpoints" and "services", which have specific Kubernetes connotations) over the network. NetworkPolicies apply to a connection with a pod on one or both ends, and are not relevant to other connections.
-->
如果你希望在 IP 地址或埠層面（OSI 第 3 層或第 4 層）控制網路流量，
則你可以考慮為叢集中特定應用使用 Kubernetes 網路策略（NetworkPolicy）。
NetworkPolicy 是一種以應用為中心的結構，允許你設定如何允許
{{< glossary_tooltip text="Pod" term_id="pod">}} 與網路上的各類網路“實體”
（我們這裡使用實體以避免過度使用諸如“端點”和“服務”這類常用術語，
這些術語在 Kubernetes 中有特定含義）通訊。
NetworkPolicies 適用於一端或兩端與 Pod 的連線，與其他連線無關。

<!--
The entities that a Pod can communicate with are identified through a combination of the following 3 identifiers:

1. Other pods that are allowed (exception: a pod cannot block access to itself)
2. Namespaces that are allowed
3. IP blocks (exception: traffic to and from the node where a Pod is running is always allowed, regardless of the IP address of the Pod or the node)
-->
Pod 可以通訊的 Pod 是透過如下三個識別符號的組合來辯識的：

1. 其他被允許的 Pods（例外：Pod 無法阻塞對自身的訪問）
2. 被允許的名字空間
3. IP 組塊（例外：與 Pod 執行所在的節點的通訊總是被允許的，
   無論 Pod 或節點的 IP 地址）

<!--
When defining a pod- or namespace- based NetworkPolicy, you use a {{< glossary_tooltip text="selector" term_id="selector">}} to specify what traffic is allowed to and from the Pod(s) that match the selector.

Meanwhile, when IP based NetworkPolicies are created, we define policies based on IP blocks (CIDR ranges).
-->
在定義基於 Pod 或名字空間的 NetworkPolicy 時，你會使用
{{< glossary_tooltip text="選擇算符" term_id="selector">}} 來設定哪些流量
可以進入或離開與該算符匹配的 Pod。

同時，當基於 IP 的 NetworkPolicy 被建立時，我們基於 IP 組塊（CIDR 範圍）
來定義策略。

<!-- body -->

<!--
## Prerequisites

Network policies are implemented by the [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/). To use network policies, you must be using a networking solution which supports NetworkPolicy. Creating a NetworkPolicy resource without a controller that implements it will have no effect.
-->
## 前置條件   {#prerequisites}

網路策略透過[網路外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
來實現。要使用網路策略，你必須使用支援 NetworkPolicy 的網路解決方案。
建立一個 NetworkPolicy 資源物件而沒有控制器來使它生效的話，是沒有任何作用的。

<!--
## The Two Sorts of Pod Isolation

There are two sorts of isolation for a pod: isolation for egress, and isolation for ingress.  They concern what connections may be established.  "Isolation" here is not absolute, rather it means "some restrictions apply".  The alternative, "non-isolated for $direction", means that no restrictions apply in the stated direction.  The two sorts of isolation (or not) are declared independently, and are both relevant for a connection from one pod to another.
-->

## Pod 隔離的兩種型別   {#the-two-sorts-of-pod-isolation}

Pod 有兩種隔離: 出口的隔離和入口的隔離。它們涉及到可以建立哪些連線。
這裡的“隔離”不是絕對的，而是意味著“有一些限制”。
另外的，“非隔離方向”意味著在所述方向上沒有限制。這兩種隔離（或不隔離）是獨立宣告的，
並且都與從一個 Pod 到另一個 Pod 的連線有關。

<!--
By default, a pod is non-isolated for egress; all outbound connections are allowed.  A pod is isolated for egress if there is any NetworkPolicy that both selects the pod and has "Egress" in its `policyTypes`; we say that such a policy applies to the pod for egress.  When a pod is isolated for egress, the only allowed connections from the pod are those allowed by the `egress` list of some NetworkPolicy that applies to the pod for egress.  The effects of those `egress` lists combine additively.
-->

預設情況下，一個 Pod 的出口是非隔離的，即所有外向連線都是被允許的。如果有任何的 NetworkPolicy
選擇該 Pod 並在其 `policyTypes` 中包含 “Egress”，則該 Pod 是出口隔離的，
我們稱這樣的策略適用於該 Pod 的出口。當一個 Pod 的出口被隔離時，
唯一允許的來自 Pod 的連線是適用於出口的 Pod 的某個 NetworkPolicy 的 `egress` 列表所允許的連線。
這些 `egress` 列表的效果是相加的。

<!--
By default, a pod is non-isolated for ingress; all inbound connections are allowed.  A pod is isolated for ingress if there is any NetworkPolicy that both selects the pod and has "Ingress" in its `policyTypes`; we say that such a policy applies to the pod for ingress.  When a pod is isolated for ingress, the only allowed connections into the pod are those from the pod's node and those allowed by the `ingress` list of some NetworkPolicy that applies to the pod for ingress.  The effects of those `ingress` lists combine additively.
-->

預設情況下，一個 Pod 對入口是非隔離的，即所有入站連線都是被允許的。如果有任何的 NetworkPolicy
選擇該 Pod 並在其 `policyTypes` 中包含 “Ingress”，則該 Pod 被隔離入口，
我們稱這種策略適用於該 Pod 的入口。當一個 Pod 的入口被隔離時，唯一允許進入該 Pod
的連線是來自該 Pod 節點的連線和適用於入口的 Pod 的某個 NetworkPolicy 的 `ingress`
列表所允許的連線。這些 `ingress` 列表的效果是相加的。

<!--
Network policies do not conflict; they are additive. If any policy or policies apply to a given pod for a given direction, the connections allowed in that direction from that pod is the union of what the applicable policies allow. Thus, order of evaluation does not affect the policy result.

For a connection from a source pod to a destination pod to be allowed, both the egress policy on the source pod and the ingress policy on the destination pod need to allow the connection. If either side does not allow the connection, it will not happen.
-->

網路策略是相加的，所以不會產生衝突。如果策略適用於 Pod 某一特定方向的流量，
Pod 在對應方向所允許的連線是適用的網路策略所允許的集合。
因此，評估的順序不影響策略的結果。

要允許從源 Pod 到目的 Pod 的連線，源 Pod 的出口策略和目的 Pod 的入口策略都需要允許連線。
如果任何一方不允許連線，建立連線將會失敗。

<!--
## The NetworkPolicy resource {#networkpolicy-resource}

See the [NetworkPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io) reference for a full definition of the resource.

An example NetworkPolicy might look like this:
-->
## NetworkPolicy 資源 {#networkpolicy-resource}

參閱 [NetworkPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io)
來了解資源的完整定義。

下面是一個 NetworkPolicy 的示例:

{{< codenew file="service/networking/networkpolicy.yaml" >}}

<!--
POSTing this to the API server for your cluster will have no effect unless your chosen networking solution supports network policy.
 -->
{{< note >}}
除非選擇支援網路策略的網路解決方案，否則將上述示例傳送到API伺服器沒有任何效果。
{{< /note >}}

<!--
__Mandatory Fields__: As with all other Kubernetes config, a NetworkPolicy
needs `apiVersion`, `kind`, and `metadata` fields.  For general information
about working with config files, see
[Configure a Pod to Use a ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/),
and [Object Management](/docs/concepts/overview/working-with-objects/object-management).

__spec__: NetworkPolicy [spec](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status) has all the information needed to define a particular network policy in the given namespace.

__podSelector__: Each NetworkPolicy includes a `podSelector` which selects the grouping of pods to which the policy applies. The example policy selects pods with the label "role=db". An empty `podSelector` selects all pods in the namespace.
-->
__必需欄位__：與所有其他的 Kubernetes 配置一樣，NetworkPolicy 需要 `apiVersion`、
`kind` 和 `metadata` 欄位。關於配置檔案操作的一般資訊，請參考
[配置 Pod 以使用 ConfigMap](/zh-cn/docs/tasks/configure-pod-container/configure-pod-configmap/),
和[物件管理](/zh-cn/docs/concepts/overview/working-with-objects/object-management)。

__spec__：NetworkPolicy [規約](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)
中包含了在一個名字空間中定義特定網路策略所需的所有資訊。

__podSelector__：每個 NetworkPolicy 都包括一個 `podSelector`，它對該策略所
適用的一組 Pod 進行選擇。示例中的策略選擇帶有 "role=db" 標籤的 Pod。
空的 `podSelector` 選擇名字空間下的所有 Pod。

<!--
__policyTypes__: Each NetworkPolicy includes a `policyTypes` list which may include either `Ingress`, `Egress`, or both. The `policyTypes` field indicates whether or not the given policy applies to ingress traffic to selected pod, egress traffic from selected pods, or both. If no `policyTypes` are specified on a NetworkPolicy then by default `Ingress` will always be set and `Egress` will be set if the NetworkPolicy has any egress rules.

__ingress__: Each NetworkPolicy may include a list of allowed `ingress` rules.  Each rule allows traffic which matches both the `from` and `ports` sections. The example policy contains a single rule, which matches traffic on a single port, from one of three sources, the first specified via an `ipBlock`, the second via a `namespaceSelector` and the third via a `podSelector`.

__egress__: Each NetworkPolicy may include a list of allowed `egress` rules.  Each rule allows traffic which matches both the `to` and `ports` sections. The example policy contains a single rule, which matches traffic on a single port to any destination in `10.0.0.0/24`.
-->

__policyTypes__: 每個 NetworkPolicy 都包含一個 `policyTypes` 列表，其中包含
`Ingress` 或 `Egress` 或兩者兼具。`policyTypes` 欄位表示給定的策略是應用於
進入所選 Pod 的入站流量還是來自所選 Pod 的出站流量，或兩者兼有。
如果 NetworkPolicy 未指定 `policyTypes` 則預設情況下始終設定 `Ingress`；
如果 NetworkPolicy 有任何出口規則的話則設定 `Egress`。

__ingress__: 每個 NetworkPolicy 可包含一個 `ingress` 規則的白名單列表。
每個規則都允許同時匹配 `from` 和 `ports` 部分的流量。示例策略中包含一條
簡單的規則：它匹配某個特定埠，來自三個來源中的一個，第一個透過 `ipBlock`
指定，第二個透過 `namespaceSelector` 指定，第三個透過 `podSelector` 指定。

__egress__: 每個 NetworkPolicy 可包含一個 `egress` 規則的白名單列表。
每個規則都允許匹配 `to` 和 `port` 部分的流量。該示例策略包含一條規則，
該規則將指定埠上的流量匹配到 `10.0.0.0/24` 中的任何目的地。

<!--
So, the example NetworkPolicy:

1. isolates "role=db" pods in the "default" namespace for both ingress and egress traffic (if they weren't already isolated)
2. (Ingress rules) allows connections to all pods in the "default" namespace with the label "role=db" on TCP port 6379 from:

   * any pod in the "default" namespace with the label "role=frontend"
   * any pod in a namespace with the label "project=myproject"
   * IP addresses in the ranges 172.17.0.0–172.17.0.255 and 172.17.2.0–172.17.255.255 (ie, all of 172.17.0.0/16 except 172.17.1.0/24)
3. (Egress rules) allows connections from any pod in the "default" namespace with the label "role=db" to CIDR 10.0.0.0/24 on TCP port 5978

See the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) walkthrough for further examples.
-->
所以，該網路策略示例:

1. 隔離 "default" 名字空間下 "role=db" 的 Pod （如果它們不是已經被隔離的話）。
2. （Ingress 規則）允許以下 Pod 連線到 "default" 名字空間下的帶有 "role=db"
   標籤的所有 Pod 的 6379 TCP 埠：

   * "default" 名字空間下帶有 "role=frontend" 標籤的所有 Pod
   * 帶有 "project=myproject" 標籤的所有名字空間中的 Pod
   * IP 地址範圍為 172.17.0.0–172.17.0.255 和 172.17.2.0–172.17.255.255
     （即，除了 172.17.1.0/24 之外的所有 172.17.0.0/16）

3. （Egress 規則）允許 “default” 名稱空間中任何帶有標籤 “role=db” 的 Pod 到 CIDR
   10.0.0.0/24 下 5978 TCP 埠的連線。

參閱[宣告網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)演練
瞭解更多示例。

<!--
## Behavior of `to` and `from` selectors

There are four kinds of selectors that can be specified in an `ingress` `from` section or `egress` `to` section:

__podSelector__: This selects particular Pods in the same namespace as the NetworkPolicy which should be allowed as ingress sources or egress destinations.

__namespaceSelector__: This selects particular namespaces for which all Pods should be allowed as ingress sources or egress destinations.

__namespaceSelector__ *and* __podSelector__: A single `to`/`from` entry that specifies both `namespaceSelector` and `podSelector` selects particular Pods within particular namespaces. Be careful to use correct YAML syntax; this policy:
-->
## 選擇器 `to` 和 `from` 的行為   {#behavior-of-to-and-from-selectors}

可以在 `ingress` 的 `from` 部分或 `egress` 的 `to` 部分中指定四種選擇器：

__podSelector__: 此選擇器將在與 NetworkPolicy 相同的名字空間中選擇特定的
Pod，應將其允許作為入站流量來源或出站流量目的地。

__namespaceSelector__：此選擇器將選擇特定的名字空間，應將所有 Pod 用作其
入站流量來源或出站流量目的地。

__namespaceSelector__ *和* __podSelector__：一個指定 `namespaceSelector`
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
contains a single `from` element allowing connections from Pods with the label `role=client` in namespaces with the label `user=alice`. But *this* policy:
 -->
在 `from` 陣列中僅包含一個元素，只允許來自標有 `role=client` 的 Pod 且
該 Pod 所在的名字空間中標有 `user=alice` 的連線。但是 *這項* 策略：

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
contains two elements in the `from` array, and allows connections from Pods in the local Namespace with the label `role=client`, *or* from any Pod in any namespace with the label `user=alice`.
-->
在 `from` 陣列中包含兩個元素，允許來自本地名字空間中標有 `role=client` 的
Pod 的連線，*或* 來自任何名字空間中標有 `user=alice` 的任何 Pod 的連線。

<!--
When in doubt, use `kubectl describe` to see how Kubernetes has interpreted the policy.

<a name="behavior-of-ipblock-selectors"></a>
__ipBlock__: This selects particular IP CIDR ranges to allow as ingress sources or egress destinations. These should be cluster-external IPs, since Pod IPs are ephemeral and unpredictable.

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
如有疑問，請使用 `kubectl describe` 檢視 Kubernetes 如何解釋該策略。

__ipBlock__: 此選擇器將選擇特定的 IP CIDR 範圍以用作入站流量來源或出站流量目的地。
這些應該是叢集外部 IP，因為 Pod IP 存在時間短暫的且隨機產生。

叢集的入站和出站機制通常需要重寫資料包的源 IP 或目標 IP。
在發生這種情況時，不確定在 NetworkPolicy 處理之前還是之後發生，
並且對於網路外掛、雲提供商、`Service` 實現等的不同組合，其行為可能會有所不同。

對入站流量而言，這意味著在某些情況下，你可以根據實際的原始源 IP 過濾傳入的資料包，
而在其他情況下，NetworkPolicy 所作用的 `源IP` 則可能是 `LoadBalancer` 或
Pod 的節點等。

對於出站流量而言，這意味著從 Pod 到被重寫為叢集外部 IP 的 `Service` IP
的連線可能會或可能不會受到基於 `ipBlock` 的策略的約束。

<!--
## Default policies

By default, if no policies exist in a namespace, then all ingress and egress traffic is allowed to and from pods in that namespace. The following examples let you change the default behavior
in that namespace.
-->
## 預設策略   {#default-policies}

預設情況下，如果名字空間中不存在任何策略，則所有進出該名字空間中 Pod 的流量都被允許。
以下示例使你可以更改該名字空間中的預設行為。

<!--
### Default deny all ingress traffic
-->
### 預設拒絕所有入站流量   {#default-deny-all-ingress-traffic}

<!--
You can create a "default" ingress isolation policy for a namespace by creating a NetworkPolicy that selects all pods but does not allow any ingress traffic to those pods.
-->
你可以透過建立選擇所有容器但不允許任何進入這些容器的入站流量的 NetworkPolicy
來為名字空間建立 “default” 隔離策略。

{{< codenew file="service/networking/network-policy-default-deny-ingress.yaml" >}}

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will still be isolated for ingress. This policy does not affect isolation for egress from any pod.
-->
這確保即使沒有被任何其他 NetworkPolicy 選擇的 Pod 仍將被隔離以進行入口。
此策略不影響任何 Pod 的出口隔離。

<!--
### Allow all ingress traffic
-->
### 允許所有入站流量   {#allow-all-ingress-traffic}

<!--
If you want to allow all incoming connections to all pods in a namespace, you can create a policy that explicitly allows that.
-->
如果你想允許一個名稱空間中所有 Pod 的所有入站連線，你可以建立一個明確允許的策略。

{{< codenew file="service/networking/network-policy-allow-all-ingress.yaml" >}}

<!--
With this policy in place, no additional policy or policies can cause any incoming connection to those pods to be denied.  This policy has no effect on isolation for egress from any pod.
-->
有了這個策略，任何額外的策略都不會導致到這些 Pod 的任何入站連線被拒絕。
此策略對任何 Pod 的出口隔離沒有影響。

<!--
### Default deny all egress traffic

You can create a "default" egress isolation policy for a namespace by creating a NetworkPolicy that selects all pods but does not allow any egress traffic from those pods.
-->
### 預設拒絕所有出站流量   {#default-deny-all-egress-traffic}

你可以透過建立選擇所有容器但不允許來自這些容器的任何出站流量的 NetworkPolicy
來為名字空間建立 “default” 隔離策略。

{{< codenew file="service/networking/network-policy-default-deny-egress.yaml" >}}

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will not be allowed egress traffic. This policy does not
change the ingress isolation behavior of any pod.
-->
此策略可以確保即使沒有被其他任何 NetworkPolicy 選擇的 Pod 也不會被允許流出流量。
此策略不會更改任何 Pod 的入站流量隔離行為。

<!--
### Allow all egress traffic
-->
### 允許所有出站流量   {#allow-all-egress-traffic}

<!--
If you want to allow all connections from all pods in a namespace, you can create a policy that explicitly allows all outgoing connections from pods in that namespace.
-->
如果要允許來自名稱空間中所有 Pod 的所有連線，
則可以建立一個明確允許來自該名稱空間中 Pod 的所有出站連線的策略。

{{< codenew file="service/networking/network-policy-allow-all-egress.yaml" >}}

<!--
With this policy in place, no additional policy or policies can cause any outgoing connection from those pods to be denied.  This policy has no effect on isolation for ingress to any pod.
-->
有了這個策略，任何額外的策略都不會導致來自這些 Pod 的任何出站連線被拒絕。
此策略對進入任何 Pod 的隔離沒有影響。

<!--
### Default deny all ingress and all egress traffic

You can create a "default" policy for a namespace which prevents all ingress AND egress traffic by creating the following NetworkPolicy in that namespace.
-->
### 預設拒絕所有入站和所有出站流量   {#default-deny-all-ingress-and-all-egress-traffic}

你可以為名字空間建立“預設”策略，以透過在該名字空間中建立以下 NetworkPolicy
來阻止所有入站和出站流量。

{{< codenew file="service/networking/network-policy-default-deny-all.yaml" >}}

<!--
This ensures that even pods that aren't selected by any other NetworkPolicy will not be allowed ingress or egress traffic.
-->
此策略可以確保即使沒有被其他任何 NetworkPolicy 選擇的 Pod 也不會被
允許入站或出站流量。

<!--
## SCTP support
-->
## SCTP 支援   {#sctp-support}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

<!--
As a stable feature, this is enabled by default. To disable SCTP at a cluster level, you (or your cluster administrator) will need to disable the `SCTPSupport` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for the API server with `--feature-gates=SCTPSupport=false,…`.
When the feature gate is enabled, you can set the `protocol` field of a NetworkPolicy to `SCTP`.
-->
作為一個穩定特性，SCTP 支援預設是被啟用的。
要在叢集層面禁用 SCTP，你（或你的叢集管理員）需要為 API 伺服器指定
`--feature-gates=SCTPSupport=false,...`
來禁用 `SCTPSupport` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
啟用該特性門控後，使用者可以將 NetworkPolicy 的 `protocol` 欄位設定為 `SCTP`。

{{< note >}}
<!--
You must be using a {{< glossary_tooltip text="CNI" term_id="cni" >}} plugin that supports SCTP protocol NetworkPolicies.
 -->
你必須使用支援 SCTP 協議網路策略的 {{< glossary_tooltip text="CNI" term_id="cni" >}} 外掛。
{{< /note >}}

<!--
## Targeting a range of Ports
-->
## 針對某個埠範圍   {#targeting-a-range-of-ports}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

<!--
When writing a NetworkPolicy, you can target a range of ports instead of a single port.

This is achievable with the usage of the `endPort` field, as the following example:
-->
在編寫 NetworkPolicy 時，你可以針對一個埠範圍而不是某個固定埠。

這一目的可以透過使用 `endPort` 欄位來實現，如下例所示：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: multi-port-egress
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Egress
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 32000
      endPort: 32768
```

<!--
The above rule allows any Pod with label `role=db` on the namespace `default` to communicate
with any IP within the range `10.0.0.0/24` over TCP, provided that the target
port is between the range 32000 and 32768.
-->
上面的規則允許名字空間 `default` 中所有帶有標籤 `role=db` 的 Pod 使用 TCP 協議
與 `10.0.0.0/24` 範圍內的 IP 通訊，只要目標埠介於 32000 和 32768 之間就可以。

<!--
The following restrictions apply when using this field:
* As a beta feature, this is enabled by default. To disable the `endPort` field
  at a cluster level, you (or your cluster administrator) need to disable the
  `NetworkPolicyEndPort` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
  for the API server with `--feature-gates=NetworkPolicyEndPort=false,…`.
* The `endPort` field must be equal to or greater than the `port` field.
* `endPort` can only be defined if `port` is also defined.
* Both ports must be numeric.
-->
使用此欄位時存在以下限制：

* 作為一種 Beta 階段的特性，埠範圍設定預設是被啟用的。要在整個叢集
  範圍內禁止使用 `endPort` 欄位，你（或者你的叢集管理員）需要為 API
  伺服器設定 `--feature-gates=NetworkPolicyEndPort=false,...` 以禁用
  `NetworkPolicyEndPort`
  [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。
* `endPort` 欄位必須等於或者大於 `port` 欄位的值。
* 兩個欄位的設定值都只能是數字。

{{< note >}}
<!--
Your cluster must be using a {{< glossary_tooltip text="CNI" term_id="cni" >}} plugin that
supports the `endPort` field in NetworkPolicy specifications.
If your [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
does not support the `endPort` field and you specify a NetworkPolicy with that,
the policy will be applied only for the single `port` field.
-->
你的叢集所使用的 {{< glossary_tooltip text="CNI" term_id="cni" >}} 外掛
必須支援在 NetworkPolicy 規約中使用 `endPort` 欄位。
如果你的[網路外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
不支援 `endPort` 欄位，而你指定了一個包含 `endPort` 欄位的 NetworkPolicy，
策略只對單個 `port` 欄位生效。
{{< /note >}}

<!--
## Targeting a Namespace by its name
-->
## 基於名字指向某名字空間   {#targeting-a-namespace-by-its-name}

{{< feature-state for_k8s_version="1.22" state="stable" >}}

<!--
The Kubernetes control plane sets an immutable label `kubernetes.io/metadata.name` on all
namespaces, provided that the `NamespaceDefaultLabelName`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled.
The value of the label is the namespace name.

While NetworkPolicy cannot target a namespace by its name with some object field, you can use the
standardized label to target a specific namespace.
-->
只要 `NamespaceDefaultLabelName`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
被啟用，Kubernetes 控制面會在所有名字空間上設定一個不可變更的標籤
`kubernetes.io/metadata.name`。該標籤的值是名字空間的名稱。

如果 NetworkPolicy 無法在某些物件欄位中指向某名字空間，你可以使用標準的
標籤方式來指向特定名字空間。

<!--
## What you can't do with network policies (at least, not yet)

As of Kubernetes {{< skew latestVersion >}}, the following functionality does not exist in the NetworkPolicy API, but you might be able to implement workarounds using Operating System components (such as SELinux, OpenVSwitch, IPTables, and so on) or Layer 7 technologies (Ingress controllers, Service Mesh implementations) or admission controllers.  In case you are new to network security in Kubernetes, its worth noting that the following User Stories cannot (yet) be implemented using the NetworkPolicy API.
-->
## 透過網路策略（至少目前還）無法完成的工作   {#what-you-can-t-do-with-network-policies-at-least-not-yet}

到 Kubernetes {{< skew latestVersion >}} 為止，NetworkPolicy API 還不支援以下功能，不過
你可能可以使用作業系統元件（如 SELinux、OpenVSwitch、IPTables 等等）
或者第七層技術（Ingress 控制器、服務網格實現）或准入控制器來實現一些
替代方案。
如果你對 Kubernetes 中的網路安全性還不太瞭解，瞭解使用 NetworkPolicy API
還無法實現下面的使用者場景是很值得的。

<!--
- Forcing internal cluster traffic to go through a common gateway (this might be best served with a service mesh or other proxy).
- Anything TLS related (use a service mesh or ingress controller for this).
- Node specific policies (you can use CIDR notation for these, but you cannot target nodes by their Kubernetes identities specifically).
- Targeting of services by name (you can, however, target pods or namespaces by their {{< glossary_tooltip text="labels" term_id="label" >}}, which is often a viable workaround).
- Creation or management of "Policy requests" that are fulfilled by a third party.
-->
- 強制叢集內部流量經過某公用閘道器（這種場景最好透過服務網格或其他代理來實現）；
- 與 TLS 相關的場景（考慮使用服務網格或者 Ingress 控制器）；
- 特定於節點的策略（你可以使用 CIDR 來表達這一需求不過你無法使用節點在
  Kubernetes 中的其他標識資訊來辯識目標節點）；
- 基於名字來選擇服務（不過，你可以使用 {{< glossary_tooltip text="標籤" term_id="label" >}}
  來選擇目標 Pod 或名字空間，這也通常是一種可靠的替代方案）；
- 建立或管理由第三方來實際完成的“策略請求”；
<!--
- Default policies which are applied to all namespaces or pods (there are some third party Kubernetes distributions and projects which can do this).
- Advanced policy querying and reachability tooling.
- The ability to log network security events (for example connections that are blocked or accepted).
- The ability to explicitly deny policies (currently the model for NetworkPolicies are deny by default, with only the ability to add allow rules).
- The ability to prevent loopback or incoming host traffic (Pods cannot currently block localhost access, nor do they have the ability to block access from their resident node).
-->
- 實現適用於所有名字空間或 Pods 的預設策略（某些第三方 Kubernetes 發行版本
  或專案可以做到這點）；
- 高階的策略查詢或者可達性相關工具；
- 生成網路安全事件日誌的能力（例如，被阻塞或接收的連線請求）；
- 顯式地拒絕策略的能力（目前，NetworkPolicy 的模型預設採用拒絕操作，
  其唯一的能力是新增允許策略）；
- 禁止本地迴路或指向宿主的網路流量（Pod 目前無法阻塞 localhost 訪問，
  它們也無法禁止來自所在節點的訪問請求）。

## {{% heading "whatsnext" %}}

<!--
- See the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
  walkthrough for further examples.
- See more [recipes](https://github.com/ahmetb/kubernetes-network-policy-recipes) for common scenarios enabled by the NetworkPolicy resource.
-->
- 參閱[宣告網路策略](/zh-cn/docs/tasks/administer-cluster/declare-network-policy/)
  演練了解更多示例；
- 有關 NetworkPolicy 資源所支援的常見場景的更多資訊，請參見
  [此指南](https://github.com/ahmetb/kubernetes-network-policy-recipes)。
