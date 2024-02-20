---
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "NetworkPolicy"
content_type: "api_reference"
description: "NetworkPolicy 描述针对一组 Pod 所允许的网络流量。"
title: "NetworkPolicy"
weight: 3
---
<!--
api_metadata:
  apiVersion: "networking.k8s.io/v1"
  import: "k8s.io/api/networking/v1"
  kind: "NetworkPolicy"
content_type: "api_reference"
description: "NetworkPolicy describes what network traffic is allowed for a set of Pods."
title: "NetworkPolicy"
weight: 3
auto_generated: true
-->

`apiVersion: networking.k8s.io/v1`

`import "k8s.io/api/networking/v1"`

## NetworkPolicy {#NetworkPolicy}

<!--
NetworkPolicy describes what network traffic is allowed for a set of Pods
-->
NetworkPolicy 描述针对一组 Pod 所允许的网络流量。

<hr>

- **apiVersion**: networking.k8s.io/v1

- **kind**: NetworkPolicy

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)
  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicySpec" >}}">NetworkPolicySpec</a>)
  <!--
  spec represents the specification of the desired behavior for this NetworkPolicy.
  -->
  spec 表示 NetworkPolicy 预期行为的规约。

## NetworkPolicySpec {#NetworkPolicySpec}

<!--
NetworkPolicySpec provides the specification of a NetworkPolicy
-->
NetworkPolicySpec 定义特定 NetworkPolicy 所需的所有信息.

<hr>

<!--
- **podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>), required

  podSelector selects the pods to which this NetworkPolicy object applies. The array of ingress rules is applied to any pods selected by this field. Multiple network policies can select the same set of pods. In this case, the ingress rules for each are combined additively. This field is NOT optional and follows standard label selector semantics. An empty podSelector matches all pods in this namespace.
-->
- **podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)，必需

  podSelector 选择此网络策略所适用的一组 Pod。一组 Ingress 入口策略将应用于此字段选择的所有 Pod。
  多个网络策略可以选择同一组 Pod。
  在这种情况下，这些列表条目的 Ingress 规则效果会被叠加。此字段不是可选的，并且遵循标准标签选择算符语义。
  空值的 podSelector 匹配此命名空间中的所有 Pod。

<!--
- **policyTypes** ([]string)

  policyTypes is a list of rule types that the NetworkPolicy relates to. Valid options are ["Ingress"], ["Egress"], or ["Ingress", "Egress"]. If this field is not specified, it will default based on the existence of ingress or egress rules; policies that contain an egress section are assumed to affect egress, and all policies (whether or not they contain an ingress section) are assumed to affect ingress. If you want to write an egress-only policy, you must explicitly specify policyTypes [ "Egress" ]. Likewise, if you want to write a policy that specifies that no egress is allowed, you must specify a policyTypes value that include "Egress" (since such a policy would not include an egress section and would otherwise default to just [ "Ingress" ]). This field is beta-level in 1.8
-->
- **policyTypes** ([]string)

  policyTypes 是 NetworkPolicy 相关的规则类型列表。有效选项为 `[“Ingress”]`、`[“Egress”]` 或 `[“Ingress”， “Egress”]`。
  如果不指定此字段，则默认值取决是否存在 Ingress 或 Egress 规则；规则里包含 Egress 部分的策略将会影响出站流量，
  并且所有策略（无论它们是否包含 Ingress 部分）都将会影响 入站流量。
  如果要仅定义出站流量策略，则必须明确指定 `[ "Egress" ]`。
  同样，如果要定义一个指定拒绝所有出站流量的策略，则必须指定一个包含 “Egress” 的 policyTypes 值
  （因为这样不包含 Egress 部分的策略，将会被默认为只有 [ "Ingress" ] )。此字段在 1.8 中为 Beta。

<!--
- **ingress** ([]NetworkPolicyIngressRule)

  ingress is a list of ingress rules to be applied to the selected pods. Traffic is allowed to a pod if there are no NetworkPolicies selecting the pod (and cluster policy otherwise allows the traffic), OR if the traffic source is the pod's local node, OR if the traffic matches at least one ingress rule across all of the NetworkPolicy objects whose podSelector matches the pod. If this field is empty then this NetworkPolicy does not allow any traffic (and serves solely to ensure that the pods it selects are isolated by default)

  <a name="NetworkPolicyIngressRule"></a>
  *NetworkPolicyIngressRule describes a particular set of traffic that is allowed to the pods matched by a NetworkPolicySpec's podSelector. The traffic must match both ports and from.*
-->
- **ingress** ([]NetworkPolicyIngressRule)

  ingress 是应用到所选 Pod 的入站规则列表。在没有被任何 NetworkPolicy 选择到 Pod 的情况下（同时假定集群策略允许对应流量），
  或者如果流量源是 Pod 的本地节点，或者流量与所有 NetworkPolicy 中的至少一个入站规则（Ingress) 匹配，
  则进入 Pod 的流量是被允许的。如果此字段为空，则此 NetworkPolicy 不允许任何入站流量
  （这种设置用来确保它所选择的 Pod 在默认情况下是被隔离的）。

  <a name="NetworkPolicyIngressRule"></a>
  **NetworkPolicyIngressRule 定义 NetworkPolicySpec 的 podSelector 所选 Pod 的入站规则的白名单列表，
  流量必须同时匹配 ports 和 from。**

  <!--
  - **ingress.from** ([]NetworkPolicyPeer)

    from is a list of sources which should be able to access the pods selected for this rule. Items in this list are combined using a logical OR operation. If this field is empty or missing, this rule matches all sources (traffic not restricted by source). If this field is present and contains at least one item, this rule allows traffic only if the traffic matches at least one item in the from list.

    <a name="NetworkPolicyPeer"></a>
    *NetworkPolicyPeer describes a peer to allow traffic to/from. Only certain combinations of fields are allowed*
  -->

  - **ingress.from** ([]NetworkPolicyPeer)

    from 是流量来源列表，列表中的来源可以访问被此规则选中的 Pod。此列表中的流量来源使用逻辑或操作进行组合。
    如果此字段为空值或缺失（未设置），
    则此规则匹配所有流量来源（也即允许所有入站流量）。如果此字段存在并且至少包含一项来源，则仅当流量与来自列表中的至少一项匹配时，
    此规则才允许流量访问被选中的 Pod 集合。

    <a name="NetworkPolicyPeer"></a>
    **NetworkPolicyPeer 描述了允许进出流量的对等点。这个参数只允许某些字段组合。**

    <!--
    - **ingress.from.ipBlock** (IPBlock)
    
      ipBlock defines policy on a particular IPBlock. If this field is set then neither of the other fields can be.
    
      <a name="IPBlock"></a>
      *IPBlock describes a particular CIDR (Ex. "192.168.1.0/24","2001:db8::/64") that is allowed to the pods matched by a NetworkPolicySpec's podSelector. The except entry describes CIDRs that should not be included within this rule.*
    -->

    - **ingress.from.ipBlock** (IPBlock)

      ipBlock 针对特定 IPBlock 定义策略。如果设置了此字段，则不可以设置其他字段。

      <a name="IPBlock"></a>
      **IPBlock 定义一个特定的 CIDR 范围（例如 `192.168.1.0/24`、`2001:db8::/64`），
      来自这个 IP 范围的流量来源将会被允许访问与 NetworkPolicySpec 的 podSelector 匹配的 Pod 集合。
      except 字段则设置应排除在此规则之外的 CIDR 范围。**

      <!--
      - **ingress.from.ipBlock.cidr** (string), required

        cidr is a string representing the IPBlock Valid examples are "192.168.1.0/24" or "2001:db8::/64"

      - **ingress.from.ipBlock.except** ([]string)

        except is a slice of CIDRs that should not be included within an IPBlock Valid examples are "192.168.1.0/24" or "2001:db8::/64" Except values will be rejected if they are outside the cidr range
      -->

      - **ingress.from.ipBlock.cidr** (string)，必需

        cidr 是表示 IP 组块的字符串，例如 `"192.168.1.0/24"` 或 `"2001:db8::/64"`。

      - **ingress.from.ipBlock.except** ([]string)

        except 是一个由 CIDR 范围组成的列表，其中指定的 CIDR 都应排除在此 IP 区块范围之外。
        例如 `"192.168.1.0/24"` 或 `"2001:db8::/64"`。
        如果 except 字段的值超出 ipBlock.cidr 的范围则被视为无效策略。

    <!--
    - **ingress.from.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      namespaceSelector selects namespaces using cluster-scoped labels. This field follows standard label selector semantics; if present but empty, it selects all namespaces.

      If podSelector is also set, then the NetworkPolicyPeer as a whole selects the pods matching podSelector in the namespaces selected by namespaceSelector. Otherwise it selects all pods in the namespaces selected by namespaceSelector.
    -->

    - **ingress.from.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      namespaceSelector 使用集群范围标签来选择特定的 Namespace。此字段遵循标准标签选择算符语义；
      如果此字段存在但为空值，则会选择所有名字空间。

      如果 podSelector 也被定义了, 那么 NetworkPolicyPeer 将选择那些同时满足 namespaceSelector
      所选名字空间下和 podSelector 规则匹配的 Pod。
      反之选择 namespaceSelector 所选名字空间下所有的 Pod。

    <!--
    - **ingress.from.podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      podSelector is a label selector which selects pods. This field follows standard label selector semantics; if present but empty, it selects all pods.

      If namespaceSelector is also set, then the NetworkPolicyPeer as a whole selects the pods matching podSelector in the Namespaces selected by NamespaceSelector. Otherwise it selects the pods matching podSelector in the policy's own namespace.
    -->

    - **ingress.from.podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      podSelector 是负责选择 Pod 的标签选择算符。该字段遵循标准标签选择算符语义；如果字段存在但为空值，则选择所有 Pod。

      如果 namespaceSelector 也被定义，那么 NetworkPolicyPeer 将选择那些同时满足 namespaceSelector
      定义的名字空间下和 podSelector 规则匹配的 Pod。
      反之会在策略所在的名字空间中选择与 podSelector 匹配的 Pod。

  <!--
  - **ingress.ports** ([]NetworkPolicyPort)

    ports is a list of ports which should be made accessible on the pods selected for this rule. Each item in this list is combined using a logical OR. If this field is empty or missing, this rule matches all ports (traffic not restricted by port). If this field is present and contains at least one item, then this rule allows traffic only if the traffic matches at least one port in the list.

    <a name="NetworkPolicyPort"></a>
    *NetworkPolicyPort describes a port to allow traffic on*
  -->

  - **ingress.ports** ([]NetworkPolicyPort)

    ports 是在此规则选中的 Pod 上应可访问的端口列表。此列表中的个项目使用逻辑或操作组合。如果此字段为空或缺失，
    则此规则匹配所有端口（进入流量可访问任何端口）。
    如果此字段存在并且包含至少一个有效值，则此规则仅在流量至少匹配列表中的一个端口时才允许访问。

    <a name="NetworkPolicyPort"></a>
    **NetworkPolicyPort 定义可以连接的端口**

    <!--
    - **ingress.ports.port** (IntOrString)

      port represents the port on the given protocol. This can either be a numerical or named port on a pod. If this field is not provided, this matches all port names and numbers. If present, only traffic on the specified protocol AND port will be matched.

      <a name="IntOrString"></a>
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
    -->

    - **ingress.ports.port** (IntOrString)

      port 表示符合给定协议的端口。字段值可以是 Pod 上的数字或命名端口。如果未提供此字段，则匹配所有端口名和端口号。
      如果定义了，则仅允许对给定的协议和端口的入口流量。

      <a name="IntOrString"></a>
      **IntOrString 是一种可以包含 int32 或字符串值的类型。在 JSON 或 YAML 编组和解组中使用时，它会生成或使用内部类型。
      例如，这允许你拥有一个可以接受名称或数字的 JSON 字段。**

    <!--
    - **ingress.ports.endPort** (int32)

      endPort indicates that the range of ports from port to endPort if set, inclusive, should be allowed by the policy. This field cannot be defined if the port field is not defined or if the port field is defined as a named (string) port. The endPort must be equal or greater than port.

    - **ingress.ports.protocol** (string)

      protocol represents the protocol (TCP, UDP, or SCTP) which traffic must match. If not specified, this field defaults to TCP.
    -->

    - **ingress.ports.endPort** (int32)

      endPort 表示如果设置了此字段，则策略应该允许 port 与 endPort 之间（包含二者）的所有端口。
      如果未定义 port 或将 port 字段值为命名端口（字符串），则不可以使用 endPort。
      endPort 必须等于或大于 port 值。

    - **ingress.ports.protocol** (string)

      protocol 表示流量必须匹配的网络协议（TCP、UDP 或 SCTP）。如果未指定，此字段默认为 TCP。

<!--
- **egress** ([]NetworkPolicyEgressRule)

  egress is a list of egress rules to be applied to the selected pods. Outgoing traffic is allowed if there are no NetworkPolicies selecting the pod (and cluster policy otherwise allows the traffic), OR if the traffic matches at least one egress rule across all of the NetworkPolicy objects whose podSelector matches the pod. If this field is empty then this NetworkPolicy limits all outgoing traffic (and serves solely to ensure that the pods it selects are isolated by default). This field is beta-level in 1.8

  <a name="NetworkPolicyEgressRule"></a>
  *NetworkPolicyEgressRule describes a particular set of traffic that is allowed out of pods matched by a NetworkPolicySpec's podSelector. The traffic must match both ports and to. This type is beta-level in 1.8*
-->
- **egress** ([]NetworkPolicyEgressRule)

  egress 是应用到所选 Pod 的出站规则的列表。如果没有 NetworkPolicy 选中指定 Pod（并且其他集群策略也允许出口流量），
  或者在所有通过 podSelector 选中了某 Pod 的 NetworkPolicy 中，至少有一条出站规则与出站流量匹配，
  则该 Pod 的出站流量是被允许的。
  如果此字段为空，则此 NetworkPolicy 拒绝所有出站流量（这策略可以确保它所选中的 Pod 在默认情况下是被隔离的）。
  egress 字段在 1.8 中为 Beta 级别。

  <a name="NetworkPolicyEgressRule"></a>
  **NetworkPolicyEgressRule 针对被 NetworkPolicySpec 的 podSelector 所选中 Pod，描述其被允许的出站流量。
  流量必须同时匹配 ports 和 to 设置。此类型在 1.8 中为 Beta 级别。**

  <!--
  - **egress.to** ([]NetworkPolicyPeer)

    to is a list of destinations for outgoing traffic of pods selected for this rule. Items in this list are combined using a logical OR operation. If this field is empty or missing, this rule matches all destinations (traffic not restricted by destination). If this field is present and contains at least one item, this rule allows traffic only if the traffic matches at least one item in the to list.

    <a name="NetworkPolicyPeer"></a>
    *NetworkPolicyPeer describes a peer to allow traffic to/from. Only certain combinations of fields are allowed*
  -->

  - **egress.to** ([]NetworkPolicyPeer)

    to 是针对此规则所选择的 Pod 的出口流量的目的地列表。此列表中的目的地使用逻辑或操作进行组合。如果此字段为空或缺失，
    则此规则匹配所有目的地（流量不受目的地限制）。如果此字段存在且至少包含一项目的地，则仅当流量与目标列表中的至少一个匹配时，
    此规则才允许出口流量。

    <a name="NetworkPolicyPeer"></a>
    **NetworkPolicyPeer 描述允许进出流量的对等点。这个对象只允许某些字段组合。**

    <!--
    - **egress.to.ipBlock** (IPBlock)

      ipBlock defines policy on a particular IPBlock. If this field is set then neither of the other fields can be.

      <a name="IPBlock"></a>
      *IPBlock describes a particular CIDR (Ex. "192.168.1.0/24","2001:db8::/64") that is allowed to the pods matched by a NetworkPolicySpec's podSelector. The except entry describes CIDRs that should not be included within this rule.*
    -->

    - **egress.to.ipBlock** (IPBlock)

      ipBlock 针对特定的 IP 区块定义策略。如果设置了此字段，则其他不可以设置其他字段。

      <a name="IPBlock"></a>
      **IPBlock 描述一个特定的 CIDR 范围（例如 `192.168.1.0/24`、`2001:db8::/64`），
      与 NetworkPolicySpec 的 podSelector 匹配的 Pod 将被允许连接到这个 IP 范围，作为其出口流量目的地。
      except 字段则设置了不被此规则影响的 CIDR 范围。**

      <!--
      - **egress.to.ipBlock.cidr** (string), required

        cidr is a string representing the IPBlock Valid examples are "192.168.1.0/24" or "2001:db8::/64"

      - **egress.to.ipBlock.except** ([]string)

        except is a slice of CIDRs that should not be included within an IPBlock Valid examples are "192.168.1.0/24" or "2001:db8::/64" Except values will be rejected if they are outside the cidr range
      -->

      - **egress.to.ipBlock.cidr** (string)，必需

        cidr 是用来表达 IP 组块的字符串，例如 `"192.168.1.0/24"` 或 `"2001:db8::/64"`。

      - **egress.to.ipBlock.except** ([]string)

        except 定义不应包含在 ipBlock 内的 CIDR 范围列表。例如 `"192.168.1.0/24"` 或 `"2001:db8::/64"`。
        如果 except 的值超出 ipBlock.cidr 的范围则被拒绝。

    <!--
    - **egress.to.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      namespaceSelector selects namespaces using cluster-scoped labels. This field follows standard label selector semantics; if present but empty, it selects all namespaces.

      If podSelector is also set, then the NetworkPolicyPeer as a whole selects the pods matching podSelector in the namespaces selected by namespaceSelector. Otherwise it selects all pods in the namespaces selected by namespaceSelector.
    -->

    - **egress.to.namespaceSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      namespaceSelector 使用集群范围标签来选择特定的名字空间。该字段遵循标准标签选择算符语义；
      如果字段存在但为空值，那会选择所有名字空间。

      如果 podSelector 也被定义了, 那么 NetworkPolicyPeer 将选择那些同时满足 namespaceSelector
      指定的名字空间下和 podSelector 规则匹配的 Pod。
      反之选择 namespaceSelector 指定的名字空间下所有的 Pod。

    <!--
    - **egress.to.podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      podSelector is a label selector which selects pods. This field follows standard label selector semantics; if present but empty, it selects all pods.

      If namespaceSelector is also set, then the NetworkPolicyPeer as a whole selects the pods matching podSelector in the Namespaces selected by NamespaceSelector. Otherwise it selects the pods matching podSelector in the policy's own namespace.
    -->

    - **egress.to.podSelector** (<a href="{{< ref "../common-definitions/label-selector#LabelSelector" >}}">LabelSelector</a>)

      podSelector 是负责选择一组 Pod 的标签选择算符。该字段遵循标准标签选择算符语义；
      如果字段存在但为空值，则选择所有 Pod。

      如果 egress.to.namespaceSelector 也被定义，则 NetworkPolicyPeer 将选择 namespaceSelector
      所指定的名字空间下和 podSelector 规则匹配的 Pod。
      反之会在策略所属的名字空间中选择与 podSelector 匹配的 Pod。

  <!--
  - **egress.ports** ([]NetworkPolicyPort)

    ports is a list of destination ports for outgoing traffic. Each item in this list is combined using a logical OR. If this field is empty or missing, this rule matches all ports (traffic not restricted by port). If this field is present and contains at least one item, then this rule allows traffic only if the traffic matches at least one port in the list.

    <a name="NetworkPolicyPort"></a>
    *NetworkPolicyPort describes a port to allow traffic on*
  -->

  - **egress.ports** ([]NetworkPolicyPort)

    ports 是出站流量目的地的端口列表。此列表中的各个项目使用逻辑或操作进行组合。如果此字段为空或缺失，
    则此规则匹配所有端口（可访问出口流量目的地的任何端口）。如果此字段存在并且包含至少一个有效值，
    则此规则仅在流量与列表中的至少一个端口匹配时才允许访问。

    <a name="NetworkPolicyPort"></a>
    **NetworkPolicyPort 定义出口流量目的地的端口。**

    <!--
    - **egress.ports.port** (IntOrString)

      port represents the port on the given protocol. This can either be a numerical or named port on a pod. If this field is not provided, this matches all port names and numbers. If present, only traffic on the specified protocol AND port will be matched.

      <a name="IntOrString"></a>
      *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
    -->

    - **egress.ports.port** (IntOrString)

      port 表示符合给定协议的端口。字段值可以是 Pod 上的数字或命名端口。如果未提供此字段，则匹配所有端口名和端口号。
      如果定义此字段，则仅允许针对给定的协议和端口的出站流量。

      <a name="IntOrString"></a>
      **IntOrString 是一种可以包含 int32 或字符串值的类型。在 JSON 或 YAML 编组和解组中使用时，它会生成或使用内部类型。
      例如，这允许你拥有一个可以接受名称或数字的 JSON 字段。**

    <!--
    - **egress.ports.endPort** (int32)

      endPort indicates that the range of ports from port to endPort if set, inclusive, should be allowed by the policy. This field cannot be defined if the port field is not defined or if the port field is defined as a named (string) port. The endPort must be equal or greater than port.

    - **egress.ports.protocol** (string)

      protocol represents the protocol (TCP, UDP, or SCTP) which traffic must match. If not specified, this field defaults to TCP.
    -->
    - **egress.ports.endPort** (int32)

      如果设置了 endPort，则用来指定策略所允许的从 port 到 endPort 的端口范围（包含边界值）。
      如果未设置 port 或 port 字段值为端口名称（字符串），则不可以指定 endPort。
      endPort 必须等于或大于 port 值。

    - **egress.ports.protocol** (string)

      protocol 表示流量必须匹配的网络协议（TCP、UDP 或 SCTP）。如果未指定，此字段默认为 TCP。

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

  标准的对象元数据。更多信息：
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

### `get` 读取指定的 NetworkPolicy

#### HTTP 请求

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the NetworkPolicy
-->
- **name** (**路径参数**): string，必需

  NetworkPolicy 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind NetworkPolicy

#### HTTP Request
-->

### `list` 列出或监视 NetworkPolicy 类型的对象

#### HTTP 请求

GET /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!-- - **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicyList" >}}">NetworkPolicyList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind NetworkPolicy

#### HTTP Request
-->

### `list` 列出或监视 NetworkPolicy 类

#### HTTP Request

GET /apis/networking.k8s.io/v1/networkpolicies

<!--
#### Parameters
-->
#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!-- - **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicyList" >}}">NetworkPolicyList</a>): OK

401: Unauthorized

<!--
### `create` create a NetworkPolicy

#### HTTP Request
-->

### `create` 创建 NetworkPolicy

#### HTTP 请求

POST /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路径参数**): string，必需

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

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Created

202 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified NetworkPolicy

#### HTTP Request
-->

### `update` 替换指定的 NetworkPolicy

#### HTTP 请求

PUT /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the NetworkPolicy
-->
- **name** (**路径参数**): string，必需

  NetworkPolicy 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>, required
-->
- **namespace** (**路径参数**): string，必需

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

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified NetworkPolicy

#### HTTP Request
-->
### `patch` 部分更新指定的 NetworkPolicy

#### HTTP 请求

PATCH /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the NetworkPolicy
-->
- **name** (**路径参数**): string，必需

  NetworkPolicy 的名称。

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **namespace** (**路径参数**): string，必需

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
- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (_in query_): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): OK

201 (<a href="{{< ref "../policy-resources/network-policy-v1#NetworkPolicy" >}}">NetworkPolicy</a>): Created

401: Unauthorized

<!--
### `delete` delete a NetworkPolicy

#### HTTP Request
-->
### `delete` 删除 NetworkPolicy

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies/{name}

<!--
#### Parameters
-->
#### 参数

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

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **name** (**路径参数**): string，必需

  NetworkPolicy 的名称。

- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of NetworkPolicy

#### HTTP Request
-->
### `deletecollection` 删除 NetworkPolicy 的集合

#### HTTP 请求

DELETE /apis/networking.k8s.io/v1/namespaces/{namespace}/networkpolicies

<!--
#### Parameters
-->
#### 参数

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
- **namespace** (**路径参数**): string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **labelSelector** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查询参数**): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查询参数**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (**查询参数**): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
