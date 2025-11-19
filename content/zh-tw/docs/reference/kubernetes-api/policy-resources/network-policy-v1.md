---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "NetworkPolicy"
content_type: "api_reference"
description: "NetworkPolicy 描述針對一組 Pod 所允許的網絡流量。"
title: "NetworkPolicy"
weight: 4
---
<!--
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "NetworkPolicy"
content_type: "api_reference"
description: "NetworkPolicy describes what network traffic is allowed for a set of Pods."
title: "NetworkPolicy"
weight: 4
auto_generated: true
-->

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`

## NetworkPolicy {#NetworkPolicy}

<!--
NetworkPolicy describes what network traffic is allowed for a set of Pods
-->
NetworkPolicy 描述針對一組 Pod 所允許的網絡流量。

<hr>

- **apiVersion**: networking.k8s.io/v1

- **kind**: NetworkPolicy

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicySpec" >}}">NetworkPolicySpec</a>)
  <!--
  spec represents the specification of the desired behavior for this NetworkPolicy.
  -->
  `spec` 表示 NetworkPolicy 預期行爲的規約。

## NetworkPolicySpec {#NetworkPolicySpec}

<!--
NetworkPolicySpec provides the specification of a NetworkPolicy
-->
NetworkPolicySpec 定義特定 NetworkPolicy 所需的所有信息.

<hr>

<!--
- **podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  podSelector selects the pods to which this NetworkPolicy object applies. The array of ingress rules is applied to any pods selected by this field. Multiple network policies can select the same set of pods. In this case, the ingress rules for each are combined additively. This field is NOT optional and follows standard label selector semantics. An empty podSelector matches all pods in this namespace.
-->
- **podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

  `podSelector` 選擇此 NetworkPolicy 對象適用的一組 Pod。此字段選擇的任何 Pod 都會應用規則數組。
  一個空的選擇器匹配策略命名空間中的所有 Pod。多個 NetworkPolicy 可以選擇相同的 Pod 集合。
  在這種情況下，每個策略的入口規則會被疊加應用。
  此字段是可選的。如果未指定，則默認爲一個空選擇器。

<!--
- **policyTypes** ([]string)

  *Atomic: will be replaced during a merge*

  policyTypes is a list of rule types that the NetworkPolicy relates to. Valid options are ["Ingress"], ["Egress"], or ["Ingress", "Egress"]. If this field is not specified, it will default based on the existence of ingress or egress rules; policies that contain an egress section are assumed to affect egress, and all policies (whether or not they contain an ingress section) are assumed to affect ingress. If you want to write an egress-only policy, you must explicitly specify policyTypes [ "Egress" ]. Likewise, if you want to write a policy that specifies that no egress is allowed, you must specify a policyTypes value that include "Egress" (since such a policy would not include an egress section and would otherwise default to just [ "Ingress" ]). This field is beta-level in 1.8
-->
- **policyTypes** ([]string)

  **原子：將在合併期間被替換**

  `policyTypes` 是 NetworkPolicy 相關的規則類型列表。有效選項爲 `[“Ingress”]`、`[“Egress”]` 或 `[“Ingress”， “Egress”]`。
  如果不指定此字段，則默認值取決是否存在 Ingress 或 Egress 規則；規則裏包含 Egress 部分的策略將會影響出站流量，
  並且所有策略（無論它們是否包含 Ingress 部分）都將會影響 入站流量。
  如果要僅定義出站流量策略，則必須明確指定 `[ "Egress" ]`。
  同樣，如果要定義一個指定拒絕所有出站流量的策略，則必須指定一個包含 `Egress` 的 policyTypes 值
  （因爲這樣不包含 Egress 部分的策略，將會被默認爲只有 [ "Ingress" ] )。此字段在 1.8 中爲 Beta。

<!--
- **ingress** ([]NetworkPolicyIngressRule)

  *Atomic: will be replaced during a merge*

  ingress is a list of ingress rules to be applied to the selected pods. Traffic is allowed to a pod if there are no NetworkPolicies selecting the pod (and cluster policy otherwise allows the traffic), OR if the traffic source is the pod's local node, OR if the traffic matches at least one ingress rule across all of the NetworkPolicy objects whose podSelector matches the pod. If this field is empty then this NetworkPolicy does not allow any traffic (and serves solely to ensure that the pods it selects are isolated by default)

  <a name="NetworkPolicyIngressRule"></a>
  *NetworkPolicyIngressRule describes a particular set of traffic that is allowed to the pods matched by a NetworkPolicySpec's podSelector. The traffic must match both ports and from.*
-->
- **ingress** ([]NetworkPolicyIngressRule)

  **原子：將在合併期間被替換**

  ingress 是應用到所選 Pod 的入站規則列表。在沒有被任何 NetworkPolicy 選擇到 Pod 的情況下（同時假定集羣策略允許對應流量），
  或者如果流量源是 Pod 的本地節點，或者流量與所有 NetworkPolicy 中的至少一個入站規則（Ingress) 匹配，
  則進入 Pod 的流量是被允許的。如果此字段爲空，則此 NetworkPolicy 不允許任何入站流量
  （這種設置用來確保它所選擇的 Pod 在默認情況下是被隔離的）。

  <a name="NetworkPolicyIngressRule"></a>
  **NetworkPolicyIngressRule 定義 NetworkPolicySpec 的 podSelector 所選
  Pod 的入站規則的白名單列表，流量必須同時匹配 ports 和 from。**

  <!--
  - **ingress.from** ([]NetworkPolicyPeer)

    *Atomic: will be replaced during a merge*
  
    from is a list of sources which should be able to access the pods selected for this rule. Items in this list are combined using a logical OR operation. If this field is empty or missing, this rule matches all sources (traffic not restricted by source). If this field is present and contains at least one item, this rule allows traffic only if the traffic matches at least one item in the from list.

    <a name="NetworkPolicyPeer"></a>
    *NetworkPolicyPeer describes a peer to allow traffic to/from. Only certain combinations of fields are allowed*
  -->

  - **ingress.from** ([]NetworkPolicyPeer)

    **原子：將在合併期間被替換**

    `from` 是流量來源列表，列表中的來源可以訪問被此規則選中的 Pod。此列表中的流量來源使用邏輯或操作進行組合。
    如果此字段爲空值或缺失（未設置），
    則此規則匹配所有流量來源（也即允許所有入站流量）。如果此字段存在並且至少包含一項來源，
    則僅當流量與來自列表中的至少一項匹配時，
    此規則才允許流量訪問被選中的 Pod 集合。

    <a name="NetworkPolicyPeer"></a>
    **NetworkPolicyPeer 描述了允許進出流量的對等點。這個參數只允許某些字段組合。**

    <!--
    - **ingress.from.ipBlock** (IPBlock)
    
      ipBlock defines policy on a particular IPBlock. If this field is set then neither of the other fields can be.
    
      <a name="IPBlock"></a>
      *IPBlock describes a particular CIDR (Ex. "192.168.1.0/24","2001:db8::/64") that is allowed to the pods matched by a NetworkPolicySpec's podSelector. The except entry describes CIDRs that should not be included within this rule.*
    -->

    - **ingress.from.ipBlock** (IPBlock)

      `ipBlock` 針對特定 IPBlock 定義策略。如果設置了此字段，則不可以設置其他字段。

      <a name="IPBlock"></a>
      **IPBlock 定義一個特定的 CIDR 範圍（例如 `192.168.1.0/24`、`2001:db8::/64`），
      來自這個 IP 範圍的流量來源將會被允許訪問與 NetworkPolicySpec 的 podSelector 匹配的 Pod 集合。
      except 字段則設置應排除在此規則之外的 CIDR 範圍。**

      <!--
      - **ingress.from.ipBlock.cidr** (string), required

        cidr is a string representing the IPBlock Valid examples are "192.168.1.0/24" or "2001:db8::/64"

      - **ingress.from.ipBlock.except** ([]string)
      
        *Atomic: will be replaced during a merge*

        except is a slice of CIDRs that should not be included within an IPBlock Valid examples are "192.168.1.0/24" or "2001:db8::/64" Except values will be rejected if they are outside the cidr range
      -->

      - **ingress.from.ipBlock.cidr** (string)，必需

        `cidr` 是表示 IP 組塊的字符串，例如 `"192.168.1.0/24"` 或 `"2001:db8::/64"`。

      - **ingress.from.ipBlock.except** ([]string)

        **原子：將在合併期間被替換**

        `except` 是一個由 CIDR 範圍組成的列表，其中指定的 CIDR 都應排除在此 IP 區塊範圍之外。
        例如 `"192.168.1.0/24"` 或 `"2001:db8::/64"`。
        如果 `except` 字段的值超出 `ipBlock.cidr` 的範圍則被視爲無效策略。

    <!--
    - **ingress.from.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      namespaceSelector selects namespaces using cluster-scoped labels. This field follows standard label selector semantics; if present but empty, it selects all namespaces.

      If podSelector is also set, then the NetworkPolicyPeer as a whole selects the pods matching podSelector in the namespaces selected by namespaceSelector. Otherwise it selects all pods in the namespaces selected by namespaceSelector.
    -->

    - **ingress.from.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      `namespaceSelector` 使用集羣範圍標籤來選擇特定的 Namespace。
      此字段遵循標準標籤選擇算符語義；如果此字段存在但爲空值，則會選擇所有名字空間。

      如果 `podSelector` 也被定義了, 那麼 NetworkPolicyPeer 將選擇那些同時滿足 `namespaceSelector`
      所選名字空間下和 `podSelector` 規則匹配的 Pod。
      反之選擇 `namespaceSelector` 所選名字空間下所有的 Pod。

    <!--
    - **ingress.from.podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      podSelector is a label selector which selects pods. This field follows standard label selector semantics; if present but empty, it selects all pods.

      If namespaceSelector is also set, then the NetworkPolicyPeer as a whole selects the pods matching podSelector in the Namespaces selected by NamespaceSelector. Otherwise it selects the pods matching podSelector in the policy's own namespace.
    -->

    - **ingress.from.podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      `podSelector` 是負責選擇 Pod 的標籤選擇算符。該字段遵循標準標籤選擇算符語義；
      如果字段存在但爲空值，則選擇所有 Pod。

      如果 `namespaceSelector` 也被定義，那麼 NetworkPolicyPeer 將選擇那些同時滿足
     `namespaceSelector` 定義的名字空間下和 `podSelector` 規則匹配的 Pod。
      反之會在策略所在的名字空間中選擇與 `podSelector` 匹配的 Pod。

  <!--
  - **ingress.ports** ([]NetworkPolicyPort)

    *Atomic: will be replaced during a merge*
  
    ports is a list of ports which should be made accessible on the pods selected for this rule. Each item in this list is combined using a logical OR. If this field is empty or missing, this rule matches all ports (traffic not restricted by port). If this field is present and contains at least one item, then this rule allows traffic only if the traffic matches at least one port in the list.

    <a name="NetworkPolicyPort"></a>
    *NetworkPolicyPort describes a port to allow traffic on*
  -->

  - **ingress.ports** ([]NetworkPolicyPort)

    **原子：將在合併期間被替換**

    `ports` 是在此規則選中的 Pod 上應可訪問的端口列表。此列表中的個項目使用邏輯或操作組合。
    如果此字段爲空或缺失，則此規則匹配所有端口（進入流量可訪問任何端口）。
    如果此字段存在並且包含至少一個有效值，則此規則僅在流量至少匹配列表中的一個端口時才允許訪問。

    <a name="NetworkPolicyPort"></a>
    **NetworkPolicyPort 定義可以連接的端口**

    <!--
    - **ingress.ports.port** (IntOrString)

      port represents the port on the given protocol. This can either be a numerical or named port on a pod. If this field is not provided, this matches all port names and numbers. If present, only traffic on the specified protocol AND port will be matched.

      <a name="IntOrString"></a>
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
    -->

    - **ingress.ports.port** (IntOrString)

      `port` 表示符合給定協議的端口。字段值可以是 Pod 上的數字或命名端口。如果未提供此字段，
      則匹配所有端口名和端口號。如果定義了，則僅允許對給定的協議和端口的入口流量。

      <a name="IntOrString"></a>
      **IntOrString 是一種可以包含 int32 或字符串值的類型。在 JSON 或 YAML 編組和解組中使用時，
      它會生成或使用內部類型。例如，這允許你擁有一個可以接受名稱或數字的 JSON 字段。**

    <!--
    - **ingress.ports.endPort** (int32)

      endPort indicates that the range of ports from port to endPort if set, inclusive, should be allowed by the policy. This field cannot be defined if the port field is not defined or if the port field is defined as a named (string) port. The endPort must be equal or greater than port.

    - **ingress.ports.protocol** (string)

      protocol represents the protocol (TCP, UDP, or SCTP) which traffic must match. If not specified, this field defaults to TCP.
    -->

    - **ingress.ports.endPort** (int32)

      `endPort` 表示如果設置了此字段，則策略應該允許 `port` 與 `endPort` 之間（包含二者）的所有端口。
      如果未定義 `port` 或將 `port` 字段值爲命名端口（字符串），則不可以使用 `endPort`。
      `endPort` 必須等於或大於 `port` 值。

    - **ingress.ports.protocol** (string)

      `protocol` 表示流量必須匹配的網絡協議（TCP、UDP 或 SCTP）。如果未指定，此字段默認爲 TCP。

<!--
- **egress** ([]NetworkPolicyEgressRule)

  *Atomic: will be replaced during a merge*

  egress is a list of egress rules to be applied to the selected pods. Outgoing traffic is allowed if there are no NetworkPolicies selecting the pod (and cluster policy otherwise allows the traffic), OR if the traffic matches at least one egress rule across all of the NetworkPolicy objects whose podSelector matches the pod. If this field is empty then this NetworkPolicy limits all outgoing traffic (and serves solely to ensure that the pods it selects are isolated by default). This field is beta-level in 1.8

  <a name="NetworkPolicyEgressRule"></a>
  *NetworkPolicyEgressRule describes a particular set of traffic that is allowed out of pods matched by a NetworkPolicySpec's podSelector. The traffic must match both ports and to. This type is beta-level in 1.8*
-->
- **egress** ([]NetworkPolicyEgressRule)

  **原子：將在合併期間被替換**

  `egress` 是應用到所選 Pod 的出站規則的列表。如果沒有 NetworkPolicy 選中指定 Pod（並且其他集羣策略也允許出口流量），
  或者在所有通過 `podSelector` 選中了某 Pod 的 NetworkPolicy 中，至少有一條出站規則與出站流量匹配，
  則該 Pod 的出站流量是被允許的。
  如果此字段爲空，則此 NetworkPolicy 拒絕所有出站流量（這策略可以確保它所選中的 Pod 在默認情況下是被隔離的）。
  egress 字段在 1.8 中爲 Beta 級別。

  <a name="NetworkPolicyEgressRule"></a>
  **NetworkPolicyEgressRule 針對被 NetworkPolicySpec 的 podSelector 所選中 Pod，描述其被允許的出站流量。
  流量必須同時匹配 `ports` 和 `to` 設置。此類型在 1.8 中爲 Beta 級別。**

  <!--
  - **egress.to** ([]NetworkPolicyPeer)

    *Atomic: will be replaced during a merge*
  
    to is a list of destinations for outgoing traffic of pods selected for this rule. Items in this list are combined using a logical OR operation. If this field is empty or missing, this rule matches all destinations (traffic not restricted by destination). If this field is present and contains at least one item, this rule allows traffic only if the traffic matches at least one item in the to list.

    <a name="NetworkPolicyPeer"></a>
    *NetworkPolicyPeer describes a peer to allow traffic to/from. Only certain combinations of fields are allowed*
  -->

  - **egress.to** ([]NetworkPolicyPeer)

    **原子：將在合併期間被替換**

    `to` 是針對此規則所選擇的 Pod 的出口流量的目的地列表。此列表中的目的地使用邏輯或操作進行組合。如果此字段爲空或缺失，
    則此規則匹配所有目的地（流量不受目的地限制）。如果此字段存在且至少包含一項目的地，則僅當流量與目標列表中的至少一個匹配時，
    此規則才允許出口流量。

    <a name="NetworkPolicyPeer"></a>
    **NetworkPolicyPeer 描述允許進出流量的對等點。這個對象只允許某些字段組合。**

    <!--
    - **egress.to.ipBlock** (IPBlock)

      ipBlock defines policy on a particular IPBlock. If this field is set then neither of the other fields can be.

      <a name="IPBlock"></a>
      *IPBlock describes a particular CIDR (Ex. "192.168.1.0/24","2001:db8::/64") that is allowed to the pods matched by a NetworkPolicySpec's podSelector. The except entry describes CIDRs that should not be included within this rule.*
    -->

    - **egress.to.ipBlock** (IPBlock)

      `ipBlock` 針對特定的 IP 區塊定義策略。如果設置了此字段，則其他不可以設置其他字段。

      <a name="IPBlock"></a>
      **IPBlock 描述一個特定的 CIDR 範圍（例如 `192.168.1.0/24`、`2001:db8::/64`），
      與 NetworkPolicySpec 的 podSelector 匹配的 Pod 將被允許連接到這個 IP 範圍，作爲其出口流量目的地。
      except 字段則設置了不被此規則影響的 CIDR 範圍。**

      <!--
      - **egress.to.ipBlock.cidr** (string), required

        cidr is a string representing the IPBlock Valid examples are "192.168.1.0/24" or "2001:db8::/64"

      - **egress.to.ipBlock.except** ([]string)
      
        *Atomic: will be replaced during a merge*

        except is a slice of CIDRs that should not be included within an IPBlock Valid examples are "192.168.1.0/24" or "2001:db8::/64" Except values will be rejected if they are outside the cidr range
      -->

      - **egress.to.ipBlock.cidr** (string)，必需

        `cidr` 是用來表達 IP 組塊的字符串，例如 `"192.168.1.0/24"` 或 `"2001:db8::/64"`。

      - **egress.to.ipBlock.except** ([]string)
      
        **原子：將在合併期間被替換**

        `except` 定義不應包含在 ipBlock 內的 CIDR 範圍列表。例如 `"192.168.1.0/24"` 或
        `"2001:db8::/64"`。如果 `except` 的值超出 `ipBlock.cidr` 的範圍則被拒絕。

    <!--
    - **egress.to.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      namespaceSelector selects namespaces using cluster-scoped labels. This field follows standard label selector semantics; if present but empty, it selects all namespaces.

      If podSelector is also set, then the NetworkPolicyPeer as a whole selects the pods matching podSelector in the namespaces selected by namespaceSelector. Otherwise it selects all pods in the namespaces selected by namespaceSelector.
    -->

    - **egress.to.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      `namespaceSelector` 使用集羣範圍標籤來選擇特定的名字空間。該字段遵循標準標籤選擇算符語義；
      如果字段存在但爲空值，那會選擇所有名字空間。

      如果 `podSelector` 也被定義了, 那麼 `NetworkPolicyPeer` 將選擇那些同時滿足 `namespaceSelector`
      指定的名字空間下和 `podSelector` 規則匹配的 Pod。
      反之選擇 `namespaceSelector` 指定的名字空間下所有的 Pod。

    <!--
    - **egress.to.podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      podSelector is a label selector which selects pods. This field follows standard label selector semantics; if present but empty, it selects all pods.

      If namespaceSelector is also set, then the NetworkPolicyPeer as a whole selects the pods matching podSelector in the Namespaces selected by NamespaceSelector. Otherwise it selects the pods matching podSelector in the policy's own namespace.
    -->

    - **egress.to.podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      `podSelector` 是負責選擇一組 Pod 的標籤選擇算符。該字段遵循標準標籤選擇算符語義；
      如果字段存在但爲空值，則選擇所有 Pod。

      如果 `egress.to.namespaceSelector` 也被定義，則 NetworkPolicyPeer 將選擇 `namespaceSelector`
      所指定的名字空間下和 `podSelector` 規則匹配的 Pod。
      反之會在策略所屬的名字空間中選擇與 `podSelector` 匹配的 Pod。

  <!--
  - **egress.ports** ([]NetworkPolicyPort)

    *Atomic: will be replaced during a merge*
  
    ports is a list of destination ports for outgoing traffic. Each item in this list is combined using a logical OR. If this field is empty or missing, this rule matches all ports (traffic not restricted by port). If this field is present and contains at least one item, then this rule allows traffic only if the traffic matches at least one port in the list.

    <a name="NetworkPolicyPort"></a>
    *NetworkPolicyPort describes a port to allow traffic on*
  -->

  - **egress.ports** ([]NetworkPolicyPort)

    **原子：將在合併期間被替換**

    ports 是出站流量目的地的端口列表。此列表中的各個項目使用邏輯或操作進行組合。如果此字段爲空或缺失，
    則此規則匹配所有端口（可訪問出口流量目的地的任何端口）。如果此字段存在並且包含至少一個有效值，
    則此規則僅在流量與列表中的至少一個端口匹配時才允許訪問。

    <a name="NetworkPolicyPort"></a>
    **NetworkPolicyPort 定義出口流量目的地的端口。**

    <!--
    - **egress.ports.port** (IntOrString)

      port represents the port on the given protocol. This can either be a numerical or named port on a pod. If this field is not provided, this matches all port names and numbers. If present, only traffic on the specified protocol AND port will be matched.

      <a name="IntOrString"></a>
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
    -->

    - **egress.ports.port** (IntOrString)

      port 表示符合給定協議的端口。字段值可以是 Pod 上的數字或命名端口。如果未提供此字段，則匹配所有端口名和端口號。
      如果定義此字段，則僅允許針對給定的協議和端口的出站流量。

      <a name="IntOrString"></a>
      **IntOrString 是一種可以包含 int32 或字符串值的類型。在 JSON 或 YAML 編組和解組中使用時，它會生成或使用內部類型。
      例如，這允許你擁有一個可以接受名稱或數字的 JSON 字段。**

    <!--
    - **egress.ports.endPort** (int32)

      endPort indicates that the range of ports from port to endPort if set, inclusive, should be allowed by the policy. This field cannot be defined if the port field is not defined or if the port field is defined as a named (string) port. The endPort must be equal or greater than port.

    - **egress.ports.protocol** (string)

      protocol represents the protocol (TCP, UDP, or SCTP) which traffic must match. If not specified, this field defaults to TCP.
    -->
    - **egress.ports.endPort** (int32)

      如果設置了 endPort，則用來指定策略所允許的從 port 到 endPort 的端口範圍（包含邊界值）。
      如果未設置 port 或 port 字段值爲端口名稱（字符串），則不可以指定 endPort。
      endPort 必須等於或大於 port 值。

    - **egress.ports.protocol** (string)

      protocol 表示流量必須匹配的網絡協議（TCP、UDP 或 SCTP）。如果未指定，此字段默認爲 TCP。

## NetworkPolicyList {#NetworkPolicyList}

<!--
NetworkPolicyList is a list of NetworkPolicy objects.
-->

NetworkPolicyList 是 NetworkPolicy 的集合。

<hr>

- **apiVersion**: networking.k8s.io/v1

- **kind**: NetworkPolicyList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  標準的對象元數據。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata。

<!--
- **items** ([]<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>), required

  items is a list of schema objects.
-->

- **items** ([]<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>)，必需

  items 是 NetworkPolicy 的列表。

## 操作 {#Operations}

<hr>

<!--
### `get` read the specified NetworkPolicy

#### HTTP Request
-->

### `get` 讀取指定的 NetworkPolicy

#### HTTP 請求

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the NetworkPolicy
-->
- **name** (**路徑參數**): string，必需

  NetworkPolicy 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind NetworkPolicy

#### HTTP Request
-->

### `list` 列出或監視 NetworkPolicy 類型的對象

#### HTTP 請求

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!-- - **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicyList" >}}">NetworkPolicyList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind NetworkPolicy

#### HTTP Request
-->

### `list` 列出或監視 NetworkPolicy 類

#### HTTP Request

GET /apis/networking.k8s.io/v1/networkpolicies

<!--
#### Parameters
-->
#### 參數

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!-- - **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicyList" >}}">NetworkPolicyList</a>): OK

401: Unauthorized

<!--
### `create` create a NetworkPolicy

#### HTTP Request
-->

### `create` 創建 NetworkPolicy

#### HTTP 請求

POST /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**): string，必需

- **body**: <a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Created

202 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified NetworkPolicy

#### HTTP Request
-->

### `update` 替換指定的 NetworkPolicy

#### HTTP 請求

PUT /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the NetworkPolicy
-->
- **name** (**路徑參數**): string，必需

  NetworkPolicy 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>, required
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **body**: <a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>，必需

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified NetworkPolicy

#### HTTP Request
-->
### `patch` 部分更新指定的 NetworkPolicy

#### HTTP 請求

PATCH /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the NetworkPolicy
-->
- **name** (**路徑參數**): string，必需

  NetworkPolicy 的名稱。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Created

401: Unauthorized

<!--
### `delete` delete a NetworkPolicy

#### HTTP Request
-->
### `delete` 刪除 NetworkPolicy

#### HTTP 請求

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

<!--
#### Parameters
-->
#### 參數

<!--
- **name** (*in path*): string, required

  name of the NetworkPolicy

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **name** (**路徑參數**): string，必需

  NetworkPolicy 的名稱。

- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of NetworkPolicy

#### HTTP Request
-->
### `deletecollection` 刪除 NetworkPolicy 的集合

#### HTTP 請求

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies

<!--
#### Parameters
-->
#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
s
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **namespace** (**路徑參數**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查詢參數**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
