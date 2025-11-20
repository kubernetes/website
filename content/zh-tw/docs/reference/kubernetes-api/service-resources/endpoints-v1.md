---
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Endpoints"
content_type: "api_reference"
description: "Endpoints 是實現實際服務的端點的集合。"
title: "Endpoints"
weight: 2
---
<!--
api_metadata:
  apiVersion: "v1"
  import: "k8s.io/api/core/v1"
  kind: "Endpoints"
content_type: "api_reference"
description: "Endpoints is a collection of endpoints that implement the actual service."
title: "Endpoints"
weight: 2
auto_generated: true
-->

`apiVersion: v1`

`import "k8s.io/api/core/v1"`

## Endpoints {#Endpoints}

<!--
Endpoints is a collection of endpoints that implement the actual service. Example:
-->
Endpoints 是實現實際 Service 的端點的集合。舉例：

	 Name: "mysvc",
	 Subsets: [
	   {
	     Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],
	     Ports: [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]
	   },
	   {
	     Addresses: [{"ip": "10.10.3.3"}],
	     Ports: [{"name": "a", "port": 93}, {"name": "b", "port": 76}]
	   },
	]

<hr>

<!--
Endpoints is a legacy API and does not contain information about all Service features. Use discoveryv1.EndpointSlice for complete information about Service endpoints.

Deprecated: This API is deprecated in v1.33+. Use discoveryv1.EndpointSlice.
-->
Endpoints 是遺留 API，不包含所有 Service 特性的資訊。使用 discoveryv1.EndpointSlice
獲取關於 Service 端點的完整資訊。

已棄用：此 API 在 v1.33+ 中已被棄用。請使用 discoveryv1.EndpointSlice。

- **apiVersion**: v1

- **kind**: Endpoints

- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  <!--
  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  -->
  標準的對象元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

- **subsets** ([]EndpointSubset)

  <!--
  *Atomic: will be replaced during a merge*
  
  The set of all endpoints is the union of all subsets. Addresses are placed into subsets according to the IPs they share. A single address with multiple ports, some of which are ready and some of which are not (because they come from different containers) will result in the address being displayed in different subsets for the different ports. No address will appear in both Addresses and NotReadyAddresses in the same subset. Sets of addresses and ports that comprise a service.
  -->
  
  **Atomic：將在合併期間被替換**

  所有端點的集合是所有 subsets 的並集。不同地址會根據其 IP 地址被放入不同子集。
  對於具有多個端口的單個地址，如果其中一些端口已就緒，而另一些端口未就緒（因爲它們來自不同的容器），
  將導致地址顯示在不同端口的不同子集中。
  任何地址都不可以同時出現在 addresses 和 notReadyAddress 中的相同子集內。

  <!--
  <a name="EndpointSubset"></a>
  *EndpointSubset is a group of addresses with a common set of ports. The expanded set of endpoints is the Cartesian product of Addresses x Ports. For example, given:
  -->
  <a name="EndpointSubset"></a>
  **EndpointSubset 是一組具有公共端口集的地址。擴展的端點集是 addresses 和 ports 的笛卡爾乘積。例如假設：**

  	{
  	  Addresses: [{"ip": "10.10.1.1"}, {"ip": "10.10.2.2"}],
  	  Ports:     [{"name": "a", "port": 8675}, {"name": "b", "port": 309}]
  	}

  <!--
  The resulting set of endpoints can be viewed as:
  -->
  則最終的端點集可以看作：

  	a: [ 10.10.1.1:8675, 10.10.2.2:8675 ],
  	b: [ 10.10.1.1:309, 10.10.2.2:309 ]

  <!--
  Deprecated: This API is deprecated in v1.33+.*
  -->

  已棄用：此 API 在 v1.33+ 中已被棄用。

  - **subsets.addresses** ([]EndpointAddress)
  
    <!--
    *Atomic: will be replaced during a merge*
    
    IP addresses which offer the related ports that are marked as ready. These endpoints should be considered safe for load balancers and clients to utilize.
    -->

    **Atomic：將在合併期間被替換**

    提供標記爲就緒的相關端口的 IP 地址。
    這些端點應該被認爲是負載均衡器和客戶端可以安全使用的。

    <!--
    <a name="EndpointAddress"></a>
    *EndpointAddress is a tuple that describes single IP address. Deprecated: This API is deprecated in v1.33+.*
    -->

    <a name="EndpointAddress"></a>
    **EndpointAddress 是描述單個 IP 地址的元組。已棄用：此 API 在 v1.33+ 中已被棄用。**

    <!--
    - **subsets.addresses.ip** (string), required
  
      The IP of this endpoint. May not be loopback (127.0.0.0/8 or ::1), link-local (169.254.0.0/16 or fe80::/10), or link-local multicast ((224.0.0.0/24).
    -->

    - **subsets.addresses.ip** (string)，必需

      端點的 IP。不可以是本地迴路（127.0.0.0/8 或 ::1）、
      鏈路本地（169.254.0.0/16 或 fe80::/10）或鏈路本地多播（224.0.0.0/24
      或 ff02::/16)）地址。

    - **subsets.addresses.hostname** (string)
      
      <!--
      The Hostname of this endpoint
      -->

      端點主機名稱。

    - **subsets.addresses.nodeName** (string)
      
      <!--
      Optional: Node hosting this endpoint. This can be used to determine endpoints local to a node.
      -->

      可選：承載此端點的節點。此字段可用於確定一個節點的本地端點。

    - **subsets.addresses.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

      <!--
      Reference to object providing the endpoint.
      -->

      對提供端點的對象的引用。
            
  - **subsets.notReadyAddresses** ([]EndpointAddress)

    <!--
    *Atomic: will be replaced during a merge*
    
    IP addresses which offer the related ports but are not currently marked as ready because they have not yet finished starting, have recently failed a readiness check, or have recently failed a liveness check.

    <a name="EndpointAddress"></a>
    *EndpointAddress is a tuple that describes single IP address. Deprecated: This API is deprecated in v1.33+.*
    -->

    **Atomic：將在合併期間被替換**

    提供相關端口但由於尚未完成啓動、最近未通過就緒態檢查或最近未通過活躍性檢查而被標記爲當前未就緒的 IP 地址。
    <a name="EndpointAddress"></a>
    **EndpointAddress 是描述單個 IP 地址的元組。已棄用：此 API 在 v1.33+ 中已被棄用。**

    <!--
    - **subsets.notReadyAddresses.ip** (string), required

      The IP of this endpoint. May not be loopback (127.0.0.0/8 or ::1), link-local (169.254.0.0/16 or fe80::/10), or link-local multicast (224.0.0.0/24 or ff02::/16).
    -->

    - **subsets.notReadyAddresses.ip** (string)，必需

      端點的 IP。不可以是本地環路（127.0.0.0/8 或 ::1）、
      鏈路本地（169.254.0.0/16 或 fe80::/10）或鏈路本地多播（224.0.0.0/24
      或 ff02::/16）地址。

    - **subsets.notReadyAddresses.hostname** (string)

      <!--
      The Hostname of this endpoint
      -->

      端點主機名稱。

    - **subsets.notReadyAddresses.nodeName** (string)
    
      <!--
      Optional: Node hosting this endpoint. This can be used to determine endpoints local to a node.
      -->

      可選：承載此端點的節點。此字段可用於確定節點的本地端點。

    - **subsets.notReadyAddresses.targetRef** (<a href="{{< ref "../common-definitions/object-reference#ObjectReference" >}}">ObjectReference</a>)

      <!--
      Reference to object providing the endpoint.
      -->

      對提供端點的對象的引用。

  - **subsets.ports** ([]EndpointPort)

    <!--
    *Atomic: will be replaced during a merge*
    
    Port numbers available on the related IP addresses.
    -->

    **Atomic：將在合併期間被替換**
 
    相關 IP 地址上可用的端口號。
    
    <!--
    <a name="EndpointPort"></a>
    *EndpointPort is a tuple that describes a single port. Deprecated: This API is deprecated in v1.33+.*
    -->

    <a name="EndpointPort"></a>
    **EndpointPort 是描述單個端口的元組。已棄用：此 API 在 v1.33+ 中已被棄用。**

    <!--    
    - **subsets.ports.port** (int32), required

      The port number of the endpoint.
    -->

    - **subsets.ports.port** (int32)，必需

      端點的端口號。

    - **subsets.ports.protocol** (string)

      <!--
      The IP protocol for this port. Must be UDP, TCP, or SCTP. Default is TCP.
      -->

      此端口的 IP 協議。必須是 UDP、TCP 或 SCTP。預設值爲 TCP。
      
    - **subsets.ports.name** (string)
    
      <!--
      The name of this port.  This must match the 'name' field in the corresponding ServicePort. Must be a DNS_LABEL. Optional only if one port is defined.
      -->

      端口的名稱。此字段必須與相應 ServicePort 中的 `name` 字段匹配。必須是 DNS_LABEL。
      僅當定義了一個端口時纔可選。

    - **subsets.ports.appProtocol** (string)
      
      <!--
      The application protocol for this port. This is used as a hint for implementations to offer richer behavior for protocols that they understand. This field follows standard Kubernetes label syntax. Valid values are either:
      -->

      端口的應用程式協議。這被用作實現的提示，爲他們理解的協議提供更豐富的行爲。
      此字段遵循標準的 Kubernetes 標籤語法。有效值爲：

      <!--
      * Un-prefixed protocol names - reserved for IANA standard service names (as per RFC-6335 and https://www.iana.org/assignments/service-names).
     
      * Kubernetes-defined prefixed names:
        * 'kubernetes.io/h2c' - HTTP/2 over cleartext as described in https://www.rfc-editor.org/rfc/rfc7540
        * 'kubernetes.io/h2c' - HTTP/2 prior knowledge over cleartext as described in https://www.rfc-editor.org/rfc/rfc9113.html#name-starting-http-2-with-prior-
        * 'kubernetes.io/ws'  - WebSocket over cleartext as described in https://www.rfc-editor.org/rfc/rfc6455
        * 'kubernetes.io/wss' - WebSocket over TLS as described in https://www.rfc-editor.org/rfc/rfc6455
     
      * Other protocols should use implementation-defined prefixed names such as mycompany.com/my-custom-protocol.
      -->
      
      * 未加前綴的名稱保留給 IANA 標準服務名稱（遵循 RFC-6335 和 https://www.iana.org/assignments/service-names)。
      
      * Kubernetes 定義的前綴名稱
        * 'kubernetes.io/h2c' - HTTP/2 明文，如 https://www.rfc-editor.org/rfc/rfc7540 中所述
        * HTTP/2 通過明文預先了解知識，如 https://www.rfc-editor.org/rfc/rfc9113.html#name-starting-http-2-with-prior- 中所述
        * 'kubernetes.io/ws'  - WebSocket 明文，如 https://www.rfc-editor.org/rfc/rfc6455 中所述
        * 'kubernetes.io/wss' - WebSocket TLS 傳輸方式，如 https://www.rfc-editor.org/rfc/rfc6455 中所述
    
      * 其他協議應使用實現定義的前綴名稱，如 mycompany.com/my-custom-protocol。

## EndpointsList {#EndpointsList}

<!--
EndpointsList is a list of endpoints. Deprecated: This API is deprecated in v1.33+.
-->
EndpointsList 是端點列表。已棄用：此 API 在 v1.33+ 中已被棄用。

<hr>

- **apiVersion**: v1

- **kind**: EndpointsList

- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  <!--
  Standard list metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  -->

  標準的列表元資料。更多資訊：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

<!--
- **items** ([]<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>), required

  List of endpoints.

## Operations {#Operations}
-->
- **items** ([]<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>)，必需

  端點列表。 

## 操作 {#Operations}

<hr>

<!--
### `get` read the specified Endpoints

#### HTTP Request

GET /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters
-->
### `get` 讀取指定的 Endpoints

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/endpoints/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Endpoints
-->
- **name** (**路徑參數**)：string，必需

  Endpoints 的名稱。

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Endpoints

#### HTTP Request

GET /api/v1/namespaces/{namespace}/endpoints

#### Parameters
-->
### `list` 列出或監測 Endpoints 類型的對象

#### HTTP 請求

GET /api/v1/namespaces/{namespace}/endpoints

#### 參數

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean
-->
- **allowWatchBookmarks** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string
-->
- **continue** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string
-->
- **fieldSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string
-->
- **labelSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer
-->
- **limit** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string
-->
- **resourceVersion** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string
-->
- **resourceVersionMatch** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>

<!--
- **sendInitialEvents** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>
-->
- **sendInitialEvents** (**查詢參數**): boolean

  <a href="{{< ref "../common-parameters/common-parameters#sendInitialEvents" >}}">sendInitialEvents</a>

<!--
- **timeoutSeconds** (*in query*): integer
-->
- **timeoutSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean
-->
- **watch** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../service-resources/endpoints-v1#EndpointsList" >}}">EndpointsList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind Endpoints

#### HTTP Request

GET /api/v1/endpoints

#### Parameters
-->
### `list` 列出或監測 Endpoints 類型的對象

#### HTTP 請求

GET /api/v1/endpoints

#### 參數

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **allowWatchBookmarks** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

- **continue** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **fieldSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

- **labelSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **limit** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersion** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

- **resourceVersionMatch** (**查詢參數**)：string

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

- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **timeoutSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

- **watch** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../service-resources/endpoints-v1#EndpointsList" >}}">EndpointsList</a>): OK

401: Unauthorized

<!--
### `create` create Endpoints

#### HTTP Request

POST /api/v1/namespaces/{namespace}/endpoints

#### Parameters
-->
### `create` 創建 Endpoints

#### HTTP 請求

POST /api/v1/namespaces/{namespace}/endpoints

#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>, required
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

202 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified Endpoints

#### HTTP Request

PUT /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters
-->
### `update` 替換指定的 Endpoints

#### HTTP 請求

PUT /api/v1/namespaces/{namespace}/endpoints/{name}

#### 參數

<!--
- **name** (*in path*): string, required
 
  name of the Endpoints
-->
- **name** (**路徑參數**)：string，必需
 
  Endpoints 名稱

<!--
- **namespace** (*in path*): string, required
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>, required

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified Endpoints

#### HTTP Request

PATCH /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters
-->
### `patch` 部分更新指定的 Endpoints

#### HTTP 請求

PATCH /api/v1/namespaces/{namespace}/endpoints/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Endpoints
-->
- **name** (**路徑參數**)：string，必需

  Endpoints 名稱

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需
  
<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

- **fieldManager** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **fieldValidation** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

- **force** (**查詢參數**)：boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): OK

201 (<a href="{{< ref "../service-resources/endpoints-v1#Endpoints" >}}">Endpoints</a>): Created

401: Unauthorized

<!--
### `delete` delete Endpoints

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/endpoints/{name}

#### Parameters
-->
### `delete` 刪除 Endpoints

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/endpoints/{name}

#### 參數

<!--
- **name** (*in path*): string, required

  name of the Endpoints
-->
- **name** (**路徑參數**)：string，必需

  Endpoints 名稱

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of Endpoints

#### HTTP Request

DELETE /api/v1/namespaces/{namespace}/endpoints

#### Parameters
-->
### `deletecollection` 刪除 Endpoints 組

#### HTTP 請求

DELETE /api/v1/namespaces/{namespace}/endpoints

#### 參數

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **namespace** (**路徑參數**)：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
  
<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **ignoreStoreReadErrorWithClusterBreakingPotential** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>
-->
- **ignoreStoreReadErrorWithClusterBreakingPotential**（**查詢參數**）：boolean

  <a href="{{< ref "../common-parameters/common-parameters#ignoreStoreReadErrorWithClusterBreakingPotential" >}}">ignoreStoreReadErrorWithClusterBreakingPotential</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** (**查詢參數**)：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** (**查詢參數**)：string

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
- **timeoutSeconds** (**查詢參數**)：integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response
-->
#### 響應

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
