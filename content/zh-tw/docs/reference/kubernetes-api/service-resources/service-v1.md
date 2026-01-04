---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Service"
content_type: "api_reference"
description: "Service 是軟體服務（例如 mysql）的命名抽象，包含代理要偵聽的本地端口（例如 3306）和一個選擇算符，選擇算符用來確定哪些 Pod 將響應通過代理發送的請求。"
title: Service
weight: 1
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Service"
content_type: "api_reference"
description: "Service is a named abstraction of software service (for example, mysql) consisting of local port (for example 3306) that the proxy listens on, and the selector that determines which pods will answer requests sent through the proxy."
title: "Service"
weight: 1
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1”`

## Service {#Service}

<!--
Service is a named abstraction of software service (for example, mysql) consisting of local port (for example 3306) that the proxy listens on, and the selector that determines which pods will answer requests sent through the proxy.
-->
Service 是軟體服務（例如 mysql）的命名抽象，包含代理要偵聽的本地端口（例如 3306）和一個選擇算符，
選擇算符用來確定哪些 Pod 將響應通過代理發送的請求。

<hr>

- **apiVersion**: v1

- **kind**: Service

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->

  標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **spec** (<a href="{{< ref "../service-resources/service-v1#ServiceSpec" >}}">ServiceSpec</a>)

  <!--
  Spec defines the behavior of a service. https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->

  spec 定義 Service 的行爲。
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

- **status**（<a href="{{< ref "../service-resources/service-v1#ServiceStatus" >}}">ServiceStatus</a>）

  <!--
  Most recently observed status of the service. Populated by the system. Read-only. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
  -->

  最近觀察到的 Service 狀態。由系統填充。只讀。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

## ServiceSpec {#ServiceSpec}

<!--
ServiceSpec describes the attributes that a user creates on a service. 
-->
ServiceSpec 描述使用者在服務上創建的屬性。

<hr>

- **selector** (map[string]string)

  <!--
  Route service traffic to pods with label keys and values matching this selector. If empty or not present, the service is assumed to have an external process managing its endpoints, which Kubernetes will not modify. Only applies to types ClusterIP, NodePort, and LoadBalancer. Ignored if type is ExternalName. More info: https://kubernetes.io/docs/concepts/services-networking/service/ 
  -->

  將 Service 流量路由到具有與此 selector 匹配的標籤鍵值對的 Pod。
  如果爲空或不存在，則假定該服務有一個外部進程管理其端點，Kubernetes 不會修改該端點。
  僅適用於 ClusterIP、NodePort 和 LoadBalancer 類型。如果類型爲 ExternalName，則忽略。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/

- **ports** ([]ServicePort)

  <!--
  *Patch strategy: merge on key `port`*
  
  *Map: unique values on keys `port, protocol` will be kept during a merge*
  
  The list of ports that are exposed by this service. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies

  <a name="ServicePort"></a>
  *ServicePort contains information on service's port.*
  -->

  **補丁策略：基於鍵 `type` 合併**

  **Map：合併時將保留 type 鍵的唯一值**

  此 Service 公開的端口列表。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies

  <a name="ServicePort"></a>
  **ServicePort 包含有關 ServicePort 的資訊。**

  <!--
  - **ports.port** (int32), required

    The port that will be exposed by this service.
  -->

  - **ports.port** (int32)，必需

    Service 將公開的端口。

  <!--
  - **ports.targetPort** (IntOrString)

    Number or name of the port to access on the pods targeted by the service. Number must be in the range 1 to 65535. Name must be an IANA_SVC_NAME. If this is a string, it will be looked up as a named port in the target Pod's container ports. If this is not specified, the value of the 'port' field is used (an identity map). This field is ignored for services with clusterIP=None, and should be omitted or set equal to the 'port' field. More info: https://kubernetes.io/docs/concepts/services-networking/service/#defining-a-service

    <a name="IntOrString"></a>
    *IntOrString is a type that can hold an int32 or a string.  When used in JSON or YAML marshalling and unmarshalling, it produces or consumes the inner type.  This allows you to have, for example, a JSON field that can accept a name or number.*
  -->

  - **ports.targetPort** (IntOrString)

    在 Service 所針對的 Pod 上要訪問的端口號或名稱。
    編號必須在 1 到 65535 的範圍內。名稱必須是 IANA_SVC_NAME。
    如果此值是一個字符串，將在目標 Pod 的容器端口中作爲命名端口進行查找。
    如果未指定字段，則使用 `port` 字段的值（直接映射）。
    對於 clusterIP 爲 None 的服務，此字段將被忽略，
    應忽略不設或設置爲 `port` 字段的取值。更多資訊：
    https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/#defining-a-service

    <a name="IntOrString"></a>
    **IntOrString 是一種可以保存 int32 或字符串的類型。
    在 JSON 或 YAML 編組和解組中使用時，它會生成或使用內部類型。
    例如，這允許您擁有一個可以接受名稱或數字的 JSON 字段。**

  - **ports.protocol** (string)

    <!--
    The IP protocol for this port. Supports "TCP", "UDP", and "SCTP". Default is TCP. 
    -->

    此端口的 IP 協議。支持 “TCP”、“UDP” 和 “SCTP”。預設爲 TCP。

  - **ports.name** (string)

    <!--
    The name of this port within the service. This must be a DNS_LABEL. All ports within a ServiceSpec must have unique names. When considering the endpoints for a Service, this must match the 'name' field in the EndpointPort. Optional if only one ServicePort is defined on this service. 
    -->

    Service 中此端口的名稱。這必須是 DNS_LABEL。
    ServiceSpec 中的所有端口的名稱都必須唯一。
    在考慮 Service 的端點時，這一字段值必須與 EndpointPort 中的 `name` 字段相同。
    如果此服務上僅定義一個 ServicePort，則爲此字段爲可選。

  - **ports.nodePort** (int32)

    <!--
    The port on each node on which this service is exposed when type is NodePort or LoadBalancer.  Usually assigned by the system. If a value is specified, in-range, and not in use it will be used, otherwise the operation will fail.  If not specified, a port will be allocated if this Service requires one.  If this field is specified when creating a Service which does not need it, creation will fail. This field will be wiped when updating a Service to no longer need it (e.g. changing type from NodePort to ClusterIP). More info: https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport 
    -->

    當類型爲 NodePort 或 LoadBalancer 時，Service 公開在節點上的端口，
    通常由系統分配。如果指定了一個在範圍內且未使用的值，則將使用該值，否則操作將失敗。
    如果在創建的 Service 需要該端口時未指定該字段，則會分配端口。
    如果在創建不需要該端口的 Service時指定了該字段，則會創建失敗。
    當更新 Service 時，如果不再需要此字段（例如，將類型從 NodePort 更改爲 ClusterIP），這個字段將被擦除。更多資訊：
    https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/#type-nodeport

  - **ports.appProtocol** (string)

    <!--
    The application protocol for this port. This is used as a hint for implementations to offer
    richer behavior for protocols that they understand. This field follows standard Kubernetes label syntax.
    Valid values are either:
    -->

    此端口的應用協議，用作實現的提示，爲他們理解的協議提供更豐富的行爲。此字段遵循標準
    Kubernetes 標籤語法，有效值包括：
    
    <!--
    * Un-prefixed protocol names - reserved for IANA standard service names (as per RFC-6335 and https://www.iana.org/assignments/service-names).
    
    * Kubernetes-defined prefixed names:
      * 'kubernetes.io/h2c' - HTTP/2 prior knowledge over cleartext as described in https://www.rfc-editor.org/rfc/rfc9113.html#name-starting-http-2-with-prior-
      * 'kubernetes.io/ws'  - WebSocket over cleartext as described in https://www.rfc-editor.org/rfc/rfc6455
      * 'kubernetes.io/wss' - WebSocket over TLS as described in https://www.rfc-editor.org/rfc/rfc6455
    
    * Other protocols should use implementation-defined prefixed names such as mycompany.com/my-custom-protocol.
    -->

    * 無前綴協議名稱 - 保留用於 IANA 標準服務名稱（根據 RFC-6335 和 https://www.iana.org/assignments/service-names）。
        
    * Kubernetes 定義的前綴名稱：
      * 'kubernetes.io/h2c' - HTTP/2 先前以明文傳輸，如
        https://www.rfc-editor.org/rfc/rfc9113.html#name-starting-http-2-with-prior- 中所述。
      * 'kubernetes.io/ws'  - 基於明文的 WebSocket，如 https://www.rfc-editor.org/rfc/rfc6455 中所述。
      * 'kubernetes.io/wss' - 基於 TLS 的 WebSocket，如 https://www.rfc-editor.org/rfc/rfc6455 中所述。
        
    * 其他協議應使用實現定義的前綴名稱，例如 mycompany.com/my-custom-protocol。

- **type** (string)

  <!--
  type determines how the Service is exposed. Defaults to ClusterIP. Valid options are ExternalName, ClusterIP, NodePort, and LoadBalancer. "ClusterIP" allocates a cluster-internal IP address for load-balancing to endpoints. Endpoints are determined by the selector or if that is not specified, by manual construction of an Endpoints object or EndpointSlice objects. If clusterIP is "None", no virtual IP is allocated and the endpoints are published as a set of endpoints rather than a virtual IP. "NodePort" builds on ClusterIP and allocates a port on every node which routes to the same endpoints as the clusterIP. "LoadBalancer" builds on NodePort and creates an external load-balancer (if supported in the current cloud) which routes to the same endpoints as the clusterIP. "ExternalName" aliases this service to the specified externalName. Several other fields do not apply to ExternalName services. More info: https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types 
  -->

  type 確定 Service 的公開方式。預設爲 ClusterIP。
  有效選項爲 ExternalName、ClusterIP、NodePort 和 LoadBalancer。
  `ClusterIP` 爲端點分配一個叢集內部 IP 地址用於負載均衡。
  Endpoints 由 selector 確定，如果未設置 selector，則需要通過手動構造 Endpoints 或 EndpointSlice 的對象來確定。
  如果 clusterIP 爲 `None`，則不分配虛擬 IP，並且 Endpoints 作爲一組端點而不是虛擬 IP 發佈。
  `NodePort` 建立在 ClusterIP 之上，並在每個節點上分配一個端口，該端口路由到與 clusterIP 相同的 Endpoints。
  `LoadBalancer` 基於 NodePort 構建並創建一個外部負載均衡器（如果當前雲支持），該負載均衡器路由到與 clusterIP 相同的 Endpoints。
  `externalName` 將此 Service 別名爲指定的 externalName。其他幾個字段不適用於 ExternalName Service。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/#publishing-services-service-types

- **ipFamilies** ([]string)

  <!--
  *Atomic: will be replaced during a merge* 
  -->

  **原子：將在合併期間被替換**

  <!--
  IPFamilies is a list of IP families (e.g. IPv4, IPv6) assigned to this service. This field is usually assigned automatically based on cluster configuration and the ipFamilyPolicy field. If this field is specified manually, the requested family is available in the cluster, and ipFamilyPolicy allows it, it will be used; otherwise creation of the service will fail. This field is conditionally mutable: it allows for adding or removing a secondary IP family, but it does not allow changing the primary IP family of the Service. Valid values are "IPv4" and "IPv6".  This field only applies to Services of types ClusterIP, NodePort, and LoadBalancer, and does apply to "headless" services. This field will be wiped when updating a Service to type ExternalName. 
  -->

  iPFamilies 是分配給此服務的 IP 協議（例如 IPv4、IPv6）的列表。
  該字段通常根據叢集設定和 ipFamilyPolicy 字段自動設置。
  如果手動指定該字段，且請求的協議在叢集中可用，且 ipFamilyPolicy 允許，則使用；否則服務創建將失敗。
  該字段修改是有條件的：它允許添加或刪除輔助 IP 協議，但不允許更改服務的主要 IP 協議。
  有效值爲 “IPv4” 和 “IPv6”。
  該字段僅適用於 ClusterIP、NodePort 和 LoadBalancer 類型的服務，並且確實可用於“無頭”服務。
  更新服務設置類型爲 ExternalName 時，該字段將被擦除。

  <!--
  This field may hold a maximum of two entries (dual-stack families, in either order).  These families must correspond to the values of the clusterIPs field, if specified. Both clusterIPs and ipFamilies are governed by the ipFamilyPolicy field. 
  -->

  該字段最多可以包含兩個條目（雙棧系列，按任意順序）。
  如果指定，這些協議棧必須對應於 clusterIPs 字段的值。
  clusterIP 和 ipFamilies 都由 ipFamilyPolicy 字段管理。

- **ipFamilyPolicy** (string)

  <!--
  IPFamilyPolicy represents the dual-stack-ness requested or required by this Service. If there is no value provided, then this field will be set to SingleStack. Services can be "SingleStack" (a single IP family), "PreferDualStack" (two IP families on dual-stack configured clusters or a single IP family on single-stack clusters), or "RequireDualStack" (two IP families on dual-stack configured clusters, otherwise fail). The ipFamilies and clusterIPs fields depend on the value of this field. This field will be wiped when updating a service to type ExternalName. 
  -->

  iPFamilyPolicy 表示此服務請求或要求的雙棧特性。
  如果沒有提供值，則此字段將被設置爲 SingleStack。
  服務可以是 “SingleStack”（單個 IP 協議）、
  “PreferDualStack”（雙棧設定叢集上的兩個 IP 協議或單棧叢集上的單個 IP 協議）
  或 “RequireDualStack”（雙棧上的兩個 IP 協議設定的叢集，否則失敗）。
  ipFamilies 和 clusterIPs 字段取決於此字段的值。
  更新服務設置類型爲 ExternalName 時，此字段將被擦除。

- **clusterIP** (string)

  <!--
  clusterIP is the IP address of the service and is usually assigned randomly. If an address is specified manually, is in-range (as per system configuration), and is not in use, it will be allocated to the service; otherwise creation of the service will fail. This field may not be changed through updates unless the type field is also being changed to ExternalName (which requires this field to be blank) or the type field is being changed from ExternalName (in which case this field may optionally be specified, as describe above).  Valid values are "None", empty string (""), or a valid IP address. Setting this to "None" makes a "headless service" (no virtual IP), which is useful when direct endpoint connections are preferred and proxying is not required.  Only applies to types ClusterIP, NodePort, and LoadBalancer. If this field is specified when creating a Service of type ExternalName, creation will fail. This field will be wiped when updating a Service to type ExternalName. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies 
  -->

  clusterIP 是服務的 IP 地址，通常是隨機分配的。
  如果地址是手動指定的，在範圍內（根據系統設定），且沒有被使用，它將被分配給服務，否則創建服務將失敗。
  clusterIP 一般不會被更改，除非 type 被更改爲 ExternalName
  （ExternalName 需要 clusterIP 爲空）或 type 已經是 ExternalName 時，可以更改 clusterIP（在這種情況下，可以選擇指定此字段）。
  可選值 “None”、空字符串 (“”) 或有效的 IP 地址。
  clusterIP 爲 “None” 時會生成“無頭服務”（無虛擬 IP），這在首選直接 Endpoint 連接且不需要代理時很有用。
  僅適用於 ClusterIP、NodePort、和 LoadBalancer 類型的服務。
  如果在創建 ExternalName 類型的 Service 時指定了 clusterIP，則創建將失敗。
  更新 Service type 爲 ExternalName 時，clusterIP 會被移除。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies

- **clusterIPs** ([]string)

  <!--
  *Atomic: will be replaced during a merge* 
  -->

  **原子：將在合併期間被替換**

  <!--
  ClusterIPs is a list of IP addresses assigned to this service, and are usually assigned randomly.  If an address is specified manually, is in-range (as per system configuration), and is not in use, it will be allocated to the service; otherwise creation of the service will fail. This field may not be changed through updates unless the type field is also being changed to ExternalName (which requires this field to be empty) or the type field is being changed from ExternalName (in which case this field may optionally be specified, as describe above).  Valid values are "None", empty string (""), or a valid IP address.  Setting this to "None" makes a "headless service" (no virtual IP), which is useful when direct endpoint connections are preferred and proxying is not required.  Only applies to types ClusterIP, NodePort, and LoadBalancer. If this field is specified when creating a Service of type ExternalName, creation will fail. This field will be wiped when updating a Service to type ExternalName.  If this field is not specified, it will be initialized from the clusterIP field.  If this field is specified, clients must ensure that clusterIPs[0] and clusterIP have the same value.
  -->

  clusterIPs 是分配給該 Service 的 IP 地址列表，通常是隨機分配的。
  如果地址是手動指定的，在範圍內（根據系統設定），且沒有被使用，它將被分配給 Service；否則創建 Service 失敗。
  clusterIP 一般不會被更改，除非 type 被更改爲 ExternalName
  （ExternalName 需要 clusterIPs 爲空）或 type 已經是 ExternalName 時，可以更改 clusterIPs（在這種情況下，可以選擇指定此字段）。
  可選值 “None”、空字符串 (“”) 或有效的 IP 地址。
  clusterIPs 爲 “None” 時會生成“無頭服務”（無虛擬 IP），這在首選直接 Endpoint 連接且不需要代理時很有用。
  適用於 ClusterIP、NodePort、和 LoadBalancer 類型的服務。
  如果在創建 ExternalName 類型的 Service 時指定了 clusterIPs，則會創建失敗。
  更新 Service type 爲 ExternalName 時，該字段將被移除。如果未指定此字段，則將從 clusterIP 字段初始化。
  如果指定 clusterIPs，客戶端必須確保 clusterIPs[0] 和 clusterIP 一致。

  <!--
  This field may hold a maximum of two entries (dual-stack IPs, in either order). These IPs must correspond to the values of the ipFamilies field. Both clusterIPs and ipFamilies are governed by the ipFamilyPolicy field. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies 
  -->

  clusterIPs 最多可包含兩個條目（雙棧系列，按任意順序）。
  這些 IP 必須與 ipFamilies 的值相對應。
  clusterIP 和 ipFamilies 都由 ipFamilyPolicy 管理。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies

- **externalIPs** ([]string)

  <!--
  *Atomic: will be replaced during a merge*
  
  externalIPs is a list of IP addresses for which nodes in the cluster will also accept traffic for this service.  These IPs are not managed by Kubernetes.  The user is responsible for ensuring that traffic arrives at a node with this IP.  A common example is external load-balancers that are not part of the Kubernetes system. 
  -->

  **原子：將在合併期間被替換**

  externalIPs 是一個 IP 列表，叢集中的節點會爲此 Service 接收針對這些 IP 地址的流量。
  這些 IP 不被 Kubernetes 管理。使用者需要確保流量可以到達具有此 IP 的節點。
  一個常見的例子是不屬於 Kubernetes 系統的外部負載均衡器。

- **sessionAffinity** (string)

  <!--
  Supports "ClientIP" and "None". Used to maintain session affinity. Enable client IP based session affinity. Must be ClientIP or None. Defaults to None. More info: https://kubernetes.io/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies 
  -->

  支持 “ClientIP” 和 “None”。用於維護會話親和性。
  啓用基於客戶端 IP 的會話親和性。必須是 ClientIP 或 None。預設爲 None。更多資訊：
  https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies

- **loadBalancerIP** (string)

  <!--
  Only applies to Service Type: LoadBalancer. This feature depends on whether the underlying cloud-provider supports specifying the loadBalancerIP when a load balancer is created. This field will be ignored if the cloud-provider does not support the feature. Deprecated: This field was under-specified and its meaning varies across implementations. Using it is non-portable and it may not support dual-stack. Users are encouraged to use implementation-specific annotations when available.
  -->

  僅適用於服務類型：LoadBalancer。此功能取決於底層雲提供商是否支持負載均衡器。
  如果雲提供商不支持該功能，該字段將被忽略。
  已棄用：該字段資訊不足，且其含義因實現而異。此字段是不可移植的，並且可能不支持雙棧。。
  我們鼓勵使用者在可用時使用特定於實現的註解。

- **loadBalancerSourceRanges** ([]string)

  <!--
  *Atomic: will be replaced during a merge*
  
  If specified and supported by the platform, this will restrict traffic through the cloud-provider load-balancer will be restricted to the specified client IPs. This field will be ignored if the cloud-provider does not support the feature." More info: https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/ 
  -->

  **原子：將在合併期間被替換**

  如果設置了此字段並且被平臺支持，將限制通過雲廠商的負載均衡器的流量到指定的客戶端 IP。
  如果雲提供商不支持該功能，該字段將被忽略。更多資訊：
  https://kubernetes.io/zh-cn/docs/tasks/access-application-cluster/create-external-load-balancer/

- **loadBalancerClass** (string)

  <!--
  loadBalancerClass is the class of the load balancer implementation this Service belongs to. If specified, the value of this field must be a label-style identifier, with an optional prefix, e.g. "internal-vip" or "example.com/internal-vip". Unprefixed names are reserved for end-users. This field can only be set when the Service type is 'LoadBalancer'. If not set, the default load balancer implementation is used, today this is typically done through the cloud provider integration, but should apply for any default implementation. If set, it is assumed that a load balancer implementation is watching for Services with a matching class. Any default load balancer implementation (e.g. cloud providers) should ignore Services that set this field. This field can only be set when creating or updating a Service to type 'LoadBalancer'. Once set, it can not be changed. This field will be wiped when a service is updated to a non 'LoadBalancer' type.
  -->

  loadBalancerClass 是此 Service 所屬的負載均衡器實現的類。
  如果設置了此字段，則字段值必須是標籤風格的標識符，帶有可選前綴，例如 ”internal-vip” 或 “example.com/internal-vip”。
  無前綴名稱是爲最終使用者保留的。該字段只能在 Service 類型爲 “LoadBalancer” 時設置。
  如果未設置此字段，則使用預設負載均衡器實現。預設負載均衡器現在通常通過雲提供商集成完成，但應適用於任何預設實現。
  如果設置了此字段，則假定負載均衡器實現正在監測具有對應負載均衡器類的 Service。
  任何預設負載均衡器實現（例如雲提供商）都應忽略設置此字段的 Service。
  只有在創建或更新的 Service 的 type 爲 “LoadBalancer” 時，纔可設置此字段。
  一經設定，不可更改。當 Service 的 type 更新爲 “LoadBalancer” 之外的其他類型時，此字段將被移除。

- **externalName** (string)

  <!--
  externalName is the external reference that discovery mechanisms will return as an alias for this service (e.g. a DNS CNAME record). No proxying will be involved.  Must be a lowercase RFC-1123 hostname (https://tools.ietf.org/html/rfc1123) and requires `type` to be "ExternalName". 
  -->

  externalName 是發現機制將返回的外部引用，作爲此服務的別名（例如 DNS CNAME 記錄）。
  不涉及代理。必須是小寫的 RFC-1123 主機名 (https://tools.ietf.org/html/rfc1123)，
  並且要求 `type` 爲 `ExternalName`。

- **externalTrafficPolicy** (string)

  <!--
  externalTrafficPolicy describes how nodes distribute service traffic they receive on one of the Service's "externally-facing" addresses (NodePorts, ExternalIPs, and LoadBalancer IPs). If set to "Local", the proxy will configure the service in a way that assumes that external load balancers will take care of balancing the service traffic between nodes, and so each node will deliver traffic only to the node-local endpoints of the service, without masquerading the client source IP. (Traffic mistakenly sent to a node with no endpoints will be dropped.) The default value, "Cluster", uses the standard behavior of routing to all endpoints evenly (possibly modified by topology and other features). Note that traffic sent to an External IP or LoadBalancer IP from within the cluster will always get "Cluster" semantics, but clients sending to a NodePort from within the cluster may need to take traffic policy into account when picking a node.
  -->

  externalTrafficPolicy 描述了節點如何分發它們在 Service 的“外部訪問”地址
  （NodePort、ExternalIP 和 LoadBalancer IP）接收到的服務流量。
  如果設置爲 “Local”，代理將以一種假設外部負載均衡器將負責在節點之間服務流量負載均衡，
  因此每個節點將僅向服務的節點本地端點傳遞流量，而不會僞裝客戶端源 IP。
 （將丟棄錯誤發送到沒有端點的節點的流量。）
  “Cluster” 預設值使用負載均衡路由到所有端點的策略（可能會根據拓撲和其他特性進行修改）。
  請注意，從叢集內部發送到 External IP 或 LoadBalancer IP 的流量始終具有 “Cluster” 語義，
  但是從叢集內部發送到 NodePort 的客戶端需要在選擇節點時考慮流量路由策略。

- **internalTrafficPolicy** (string)

  <!--
  InternalTrafficPolicy describes how nodes distribute service traffic they receive on the ClusterIP. If set to "Local", the proxy will assume that pods only want to talk to endpoints of the service on the same node as the pod, dropping the traffic if there are no local endpoints. The default value, "Cluster", uses the standard behavior of routing to all endpoints evenly (possibly modified by topology and other features).
  -->

  internalTrafficPolicy 描述節點如何分發它們在 ClusterIP 上接收到的服務流量。
  如果設置爲 “Local”，代理將假定 Pod 只想與在同一節點上的服務端點通信，如果沒有本地端點，它將丟棄流量。
  “Cluster” 預設將流量路由到所有端點（可能會根據拓撲和其他特性進行修改）。

- **healthCheckNodePort** (int32)

  <!--
  healthCheckNodePort specifies the healthcheck nodePort for the service. This only applies when type is set to LoadBalancer and externalTrafficPolicy is set to Local. If a value is specified, is in-range, and is not in use, it will be used.  If not specified, a value will be automatically allocated.  External systems (e.g. load-balancers) can use this port to determine if a given node holds endpoints for this service or not.  If this field is specified when creating a Service which does not need it, creation will fail. This field will be wiped when updating a Service to no longer need it (e.g. changing type). This field cannot be updated once set.
  -->

  healthCheckNodePort 指定 Service 的健康檢查節點端口。
  僅適用於 type 爲 LoadBalancer 且 externalTrafficPolicy 設置爲 Local 的情況。
  如果爲此字段設定了一個值，該值在合法範圍內且沒有被使用，則使用所指定的值。
  如果未設置此字段，則自動分配字段值。外部系統（例如負載平衡器）可以使用此端口來確定給定節點是否擁有此服務的端點。
  在創建不需要 healthCheckNodePort 的 Service 時指定了此字段，則 Service 創建會失敗。
  要移除 healthCheckNodePort，需要更改 Service 的 type。
  該字段一旦設置就無法更改。

- **publishNotReadyAddresses** (boolean)

  <!--
  publishNotReadyAddresses indicates that any agent which deals with endpoints for this Service should disregard any indications of ready/not-ready. The primary use case for setting this field is for a StatefulSet's Headless Service to propagate SRV DNS records for its Pods for the purpose of peer discovery. The Kubernetes controllers that generate Endpoints and EndpointSlice resources for Services interpret this to mean that all endpoints are considered "ready" even if the Pods themselves are not. Agents which consume only Kubernetes generated endpoints through the Endpoints or EndpointSlice resources can safely assume this behavior. 
  -->

  publishNotReadyAddresses 表示任何處理此 Service 端點的代理都應忽略任何準備就緒/未準備就緒的指示。
  設置此字段的主要場景是爲 StatefulSet 的服務提供支持，使之能夠爲其 Pod 傳播 SRV DNS 記錄，以實現對等發現。
  爲 Service 生成 Endpoints 和 EndpointSlice 資源的 Kubernetes 控制器對字段的解讀是，
  即使 Pod 本身還沒有準備好，所有端點都可被視爲 “已就緒”。
  對於代理而言，如果僅使用 Kubernetes 通過 Endpoints 或 EndpointSlice 資源所生成的端點，
  則可以安全地假設這種行爲。

- **sessionAffinityConfig** (SessionAffinityConfig)

  <!--
  sessionAffinityConfig contains the configurations of session affinity.

  <a name="SessionAffinityConfig"></a>
  *SessionAffinityConfig represents the configurations of session affinity.*
  -->

  sessionAffinityConfig 包含會話親和性的設定。

  <a name="SessionAffinityConfig"></a>
  **SessionAffinityConfig 表示會話親和性的設定。**

  - **sessionAffinityConfig.clientIP** (ClientIPConfig)

    <!--
    clientIP contains the configurations of Client IP based session affinity.

    <a name="ClientIPConfig"></a>
    *ClientIPConfig represents the configurations of Client IP based session affinity.*
    -->
    
    clientIP 包含基於客戶端 IP 的會話親和性的設定。

    <a name="ClientIPConfig"></a>
    **ClientIPConfig 表示基於客戶端 IP 的會話親和性的設定。**

    - **sessionAffinityConfig.clientIP.timeoutSeconds** (int32)

      <!--
      timeoutSeconds specifies the seconds of ClientIP type session sticky time. The value must be >0 && \<=86400(for 1 day) if ServiceAffinity == "ClientIP". Default value is 10800(for 3 hours). 
      -->

      timeoutSeconds 指定 ClientIP 類型會話的維繫時間秒數。
      如果 ServiceAffinity == "ClientIP"，則該值必須 >0 && <=86400（1 天）。預設值爲 10800（3 小時）。

- **allocateLoadBalancerNodePorts** (boolean)

  <!--
  allocateLoadBalancerNodePorts defines if NodePorts will be automatically allocated for services with type LoadBalancer.  Default is "true". It may be set to "false" if the cluster load-balancer does not rely on NodePorts.  If the caller requests specific NodePorts (by specifying a value), those requests will be respected, regardless of this field. This field may only be set for services with type LoadBalancer and will be cleared if the type is changed to any other type. 
  -->

  allocateLoadBalancerNodePorts 定義了是否會自動爲 LoadBalancer 類型的 Service 分配 NodePort。預設爲 true。
  如果叢集負載均衡器不依賴 NodePort，則可以設置此字段爲 false。
  如果調用者（通過指定一個值）請求特定的 NodePort，則無論此字段如何，都會接受這些請求。
  該字段只能設置在 type 爲 LoadBalancer 的 Service 上，如果 type 更改爲任何其他類型，該字段將被移除。

<!--
- **trafficDistribution** (string)

  TrafficDistribution offers a way to express preferences for how traffic is distributed to Service endpoints. Implementations can use this field as a hint, but are not required to guarantee strict adherence. If the field is not set, the implementation will apply its default routing strategy. If set to "PreferClose", implementations should prioritize endpoints that are in the same zone.
-->
- **trafficDistribution** (string)

  trafficDistribution 提供了一種流量如何被分配到 Service 端點的偏好表達方式。
  各個實現可以將此字段用作提示，但不需要嚴格遵守。如果此字段未設置，實現將應用其預設路由策略。
  如果設置爲 “PreferClose”，則實現應優先考慮位於同一區域的端點。

## ServiceStatus {#ServiceStatus}

<!--
ServiceStatus represents the current status of a service. 
-->
ServiceStatus 表示 Service 的當前狀態。

<hr>

- **conditions** ([]Condition)

  <!--
  *Patch strategy: merge on key `type`*

  *Map: unique values on key type will be kept during a merge*
  
  Current service state

  <a name="Condition"></a>
  *Condition contains details for one aspect of the current state of this API Resource.*
  -->

  **補丁策略：基於鍵 `type` 合併**

  **Map：鍵類型的唯一值將在合併期間保留**

  服務的當前狀態。

  <a name="Condition"></a>
  **condition 包含此 API 資源某一方面當前的狀態詳細資訊。**

  <!--
  - **conditions.lastTransitionTime** (Time), required

    lastTransitionTime is the last time the condition transitioned from one status to another. This should be when the underlying condition changed.  If that is not known, then using the time when the API field changed is acceptable.

    <a name="Time"></a>
    *Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.*
  -->
  
  - **conditions.lastTransitionTime**（Time），必需

    lastTransitionTime 是狀況最近一次狀態轉化的時間。
    變化應該發生在下層狀況發生變化的時候。如果不知道下層狀況發生變化的時間，
    那麼使用 API 字段更改的時間是可以接受的。

    <a name="Time"></a>
    **Time 是 time.Time 的包裝類，支持正確地序列化爲 YAML 和 JSON。
    爲 time 包提供的許多工廠方法提供了包裝類。**

  <!--
  - **conditions.message** (string), required
  -->

  - **conditions.message** (string)，必需

    <!--
    message is a human readable message indicating details about the transition. This may be an empty string. 
    -->

    message 是人類可讀的消息，有關轉換的詳細資訊，可以是空字符串。

  <!--
  - **conditions.reason** (string), required
  -->

  - **conditions.reason** (string)，必需

    <!--
    reason contains a programmatic identifier indicating the reason for the condition's last transition. Producers of specific condition types may define expected values and meanings for this field, and whether the values are considered a guaranteed API. The value should be a CamelCase string. This field may not be empty. 
    -->
  
    reason 包含一個程式標識符，指示 condition 最後一次轉換的原因。
    特定條件類型的生產者可以定義該字段的預期值和含義，以及這些值是否被視爲有保證的 API。
    該值應該是 CamelCase 字符串且不能爲空。

  <!--
  - **conditions.status** (string), required
  -->

  - **conditions.status** (string)，必需

    <!--
    status of the condition, one of True, False, Unknown. 
    -->

    condition 的狀態，True、False、Unknown 之一。

  <!--
  - **conditions.type** (string), required
  -->

  - **conditions.type** (string)，必需

    <!--
    type of condition in CamelCase or in foo.example.com/CamelCase. 
    -->

    condition 的類型，格式爲 CamelCase 或 foo.example.com/CamelCase。

  - **conditions.observedGeneration** (int64)

    <!--
    observedGeneration represents the .metadata.generation that the condition was set based upon. For instance, if .metadata.generation is currently 12, but the .status.conditions[x].observedGeneration is 9, the condition is out of date with respect to the current state of the instance. 
    -->

    observedGeneration 表示設置 condition 基於的 .metadata.generation 的過期次數。
    例如，如果 .metadata.generation 當前爲 12，但 .status.conditions[x].observedGeneration 爲 9，
    則 condition 相對於實例的當前狀態已過期。

- **loadBalancer** (LoadBalancerStatus)

  <!--
  LoadBalancer contains the current status of the load-balancer, if one is present.

  <a name="LoadBalancerStatus"></a>
  *LoadBalancerStatus represents the status of a load-balancer.*
  -->

  loadBalancer 包含負載均衡器的當前狀態（如果存在）。

  <a name="LoadBalancerStatus"></a>
  **LoadBalancerStatus 表示負載均衡器的狀態。**

  - **loadBalancer.ingress** ([]LoadBalancerIngress)

    <!--
    *Atomic: will be replaced during a merge*
    
    Ingress is a list containing ingress points for the load-balancer. Traffic intended for the service should be sent to these ingress points.

    <a name="LoadBalancerIngress"></a>
    *LoadBalancerIngress represents the status of a load-balancer ingress point: traffic intended for the service should be sent to an ingress point.*
    -->
  
    **原子：將在合併期間被替換**

    ingress 是一個包含負載均衡器 Ingress 點的列表。Service 的流量需要被髮送到這些 Ingress 點。

    <a name="LoadBalancerIngress"></a>
    **LoadBalancerIngress 表示負載平衡器入口點的狀態: 用於服務的流量是否被髮送到入口點。**

    - **loadBalancer.ingress.hostname** (string)

      <!--
      Hostname is set for load-balancer ingress points that are DNS based (typically AWS load-balancers)     
      -->

      hostname 是爲基於 DNS 的負載均衡器 Ingress 點（通常是 AWS 負載均衡器）設置的。

    - **loadBalancer.ingress.ip** (string)

      <!--
      IP is set for load-balancer ingress points that are IP based (typically GCE or OpenStack load-balancers) 
      -->

      ip 是爲基於 IP 的負載均衡器 Ingress 點（通常是 GCE 或 OpenStack 負載均衡器）設置的。
    
    - **loadBalancer.ingress.ipMode** (string)

      <!--
      IPMode specifies how the load-balancer IP behaves, and may only be specified when the ip field is specified.
      Setting this to "VIP" indicates that traffic is delivered to the node with the destination set to the load-balancer's IP and port.
      Setting this to "Proxy" indicates that traffic is delivered to the node or pod with the destination set to the node's IP and node
      port or the pod's IP and port. Service implementations may use this information to adjust traffic routing.
      -->

      ipMode 指定負載平衡器 IP 的行爲方式，並且只能在設置了 ip 字段時指定。
      將其設置爲 `VIP` 表示流量將傳送到節點，並將目標設置爲負載均衡器的 IP 和端口。
      將其設置爲 `Proxy` 表示將流量傳送到節點或 Pod，並將目標設置爲節點的 IP 和節點端口或 Pod 的 IP 和端口。
      服務實現可以使用此資訊來調整流量路由。

    - **loadBalancer.ingress.ports** ([]PortStatus)

      <!--
      *Atomic: will be replaced during a merge* 
      -->

      **原子：將在合併期間被替換**

      <!--
      Ports is a list of records of service ports If used, every port defined in the service should have an entry in it
      -->

      ports 是 Service 的端口列表。如果設置了此字段，Service 中定義的每個端口都應該在此列表中。

      <a name="PortStatus"></a>

      <!--
      *PortStatus represents the error condition of a service port*
      
      - **loadBalancer.ingress.ports.port** (string), required
      -->
  
      **PortStatus 表示服務端口的狀態**

      - **loadBalancer.ingress.ports.port** (int32)，必需

        <!--
        Port is the port number of the service port of which status is recorded here
        -->

        port 是所記錄的服務端口狀態的端口號。

      <!--
      - **loadBalancer.ingress.ports.protocol** (string), required
      -->

      - **loadBalancer.ingress.ports.protocol** (string)，必需

        <!--
        Protocol is the protocol of the service port of which status is recorded here The supported values are: "TCP", "UDP", "SCTP"
        -->

        protocol 是所記錄的服務端口狀態的協議。支持的值爲：“TCP”、“UDP”、“SCTP”。

      - **loadBalancer.ingress.ports.error** (string)

        <!--
        Error is to record the problem with the service port The format of the error shall comply with the following rules: - built-in error values shall be specified in this file and those shall use
          CamelCase names
        - cloud provider specific error values must have names that comply with the
          format foo.example.com/CamelCase. 
        -->

        error 是記錄 Service 端口的問題。
        錯誤的格式應符合以下規則：
        - 內置錯誤原因應在此檔案中指定，應使用 CamelCase 名稱。
        - 雲提供商特定錯誤原因的名稱必須符合格式 foo.example.com/CamelCase。

## ServiceList {#ServiceList}

<!--
ServiceList holds a list of services. 
-->

ServiceList 包含一個 Service 列表。

<hr>

- **apiVersion**: v1

- **kind**: ServiceList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds 
  -->

  標準的列表元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **items** ([]<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>), required

  List of services
-->
- **items**（[]<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>），必需

  Service 列表。

<!--
## Operations {#Operations}
-->

## 操作  {#operations}

<hr>

<!--
### `get` read the specified Service

#### HTTP Request
-->
### `get` 讀取指定的 Service

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/services/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the Service

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**查詢參數**)：string，必需

  Service 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: OK

401: Unauthorized

<!--
### `get` read status of the specified Service

#### HTTP Request 
-->
### `get` 讀取指定 Service 的狀態

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/services/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the Service

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**)：string，必需

  Service 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Service

#### HTTP Request 
-->
### `list` 列出或監測 Service 類型的對象

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/services

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 參數

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **allowWatchBookmarks**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200（<a href="{{< ref "../service-resources/service-v1#ServiceList" >}}">ServiceList</a>）: OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Service

#### HTTP Request 
-->
### `list` 列出或監測 Service 類型的對象

#### HTTP 請求

GET /api/v1/services

<!--
#### Parameters

- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
#### 參數

- **allowWatchBookmarks**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200（<a href="{{< ref "../service-resources/service-v1#ServiceList" >}}">ServiceList</a>）: OK

401: Unauthorized

<!--
### `create` create a Service

#### HTTP Request 
-->
### `create` 創建一個 Service

#### HTTP 請求

POST /api/v1/namespaces/{namespace}/services

<!--
#### Parameters

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**：<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: OK

201（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: Created

202（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: Accepted

401: Unauthorized

<!--
### `update` replace the specified Service

#### HTTP Request 
-->
### `update` 替換指定的 Service

#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/services/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the Service

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**)：string，必需

  Service 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: OK

201（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: Created

401: Unauthorized

<!--
### `update` replace status of the specified Service

#### HTTP Request 
-->
### `update` 替換指定 Service 的狀態

#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/services/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the Service

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>, required

- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
#### 參數

- **name** (**路徑參數**)：string，必需

  Service 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: OK

201（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: Created

401: Unauthorized

<!--
### `patch` partially update the specified Service

#### HTTP Request 
-->
### `patch` 部分更新指定的 Service

#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/services/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the Service

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

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
#### 參數

- **name** (**路徑參數**)：string，必需

  Service 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: OK

201（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: Created

401: Unauthorized

<!--
### `patch` partially update status of the specified Service

#### HTTP Request
-->
### `patch` 部分更新指定 Service 的狀態

#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/services/{name}/status

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the Service

- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required

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
#### 參數

- **name** (**路徑參數**)：string，必需

  Service 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

- **fieldValidation**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: OK

201（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: Created

401: Unauthorized

<!--
### `delete` delete a Service

#### HTTP Request 
-->
### `delete` 刪除 Service

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/services/{name}

<!--
#### Parameters

- **name** (*in path*): string, required

  name of the Service

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
#### 參數

- **name** (**路徑參數**)：string，必需

  Service 的名稱。

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **gracePeriodSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **propagationPolicy**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: OK

202（<a href="{{< ref "../service-resources/service-v1#Service" >}}">Service</a>）: Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of Service

#### HTTP Request 
-->
### `deletecollection` 刪除 Service 集合

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/services

<!--
#### Parameters

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

- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>
-->
#### 參數

- **namespace**（**路徑參數**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

- **continue**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

- **dryRun**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **gracePeriodSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

- **labelSelector**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

- **limit**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

- **propagationPolicy**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

- **resourceVersion**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch**（**查詢參數**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

- **timeoutSeconds**（**查詢參數**）：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200（<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>）: OK

401: Unauthorized
