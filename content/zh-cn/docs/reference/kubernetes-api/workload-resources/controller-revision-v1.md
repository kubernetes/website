---
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "ControllerRevision"
content_type: "api_reference"
description: "ControllerRevision 实现了状态数据的不可变快照。"
title: "ControllerRevision"
weight: 7
---

<!--
api_metadata:
  apiVersion: "apps/v1"
  import: "k8s.io/api/apps/v1"
  kind: "ControllerRevision"
content_type: "api_reference"
description: "ControllerRevision implements an immutable snapshot of state data."
title: "ControllerRevision"
weight: 7
auto_generated: true
-->

`apiVersion: apps/v1`

`import "k8s.io/api/apps/v1"`

<!-- 
## ControllerRevision {#ControllerRevision 
-->
## ControllerRevision {#ControllerRevision}

<!--
ControllerRevision implements an immutable snapshot of state data.
Clients are responsible for serializing and deserializing the objects that contain their internal state.
Once a ControllerRevision has been successfully created, it can not be updated. 
The API Server will fail validation of all requests that attempt to mutate the Data field.
ControllerRevisions may, however, be deleted. Note that, due to its use by both the DaemonSet and StatefulSet controllers for update and rollback,
this object is beta. However, it may be subject to name and representation changes in future releases, and clients should not depend on its stability.
It is primarily for internal use by controllers.

<hr>
-->
ControllerRevision 实现了状态数据的不可变快照。
客户端负责序列化和反序列化对象，包含对象内部状态。
成功创建 ControllerRevision 后，将无法对其进行更新。
API 服务器将无法成功验证所有尝试改变 data 字段的请求。
但是，可以删除 ControllerRevisions。
请注意，由于 DaemonSet 和 StatefulSet 控制器都使用它来进行更新和回滚，所以这个对象是 Beta 版。
但是，它可能会在未来版本中更改名称和表示形式，客户不应依赖其稳定性。
它主要供控制器内部使用。

<hr>

<!--
- **apiVersion**: apps/v1
-->
- **apiVersion**: apps/v1

<!--
- **kind**: ControllerRevision
-->
- **kind**: ControllerRevision

<!--
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/object-meta#ObjectMeta" >}}">ObjectMeta</a>)

  标准的对象元数据。更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **revision** (int64), required

  Revision indicates the revision of the state represented by Data.
-->
- **revision** (int64)，必需

  revision 表示 data 表示的状态的修订。

<!--
- **data** (RawExtension)

  Data is the serialized representation of the state.
-->
- **data** (RawExtension)

  data 是状态的序列化表示。
  
  <!--
  <a name="RawExtension"></a>
    *RawExtension is used to hold extensions in external versions.
  -->

  <a name="RawExtension"></a>
  **RawExtension 用于以外部版本来保存扩展数据。**
  
  <!--
  To use this, make a field which has RawExtension as its type in your external, versioned struct, and Object in your internal struct. You also need to register your various plugin types.
  -->

  要使用它，请生成一个字段，在外部、版本化结构中以 RawExtension 作为其类型，在内部结构中以 Object 作为其类型。
  你还需要注册你的各个插件类型。
  
  <!--
  // Internal package:
  -->
  
  // 内部包：

    ```go
    type MyAPIObject struct {  
      runtime.TypeMeta `json:",inline"`   
      MyPlugin runtime.Object `json:"myPlugin"`  
    } 

    type PluginA struct {  
      AOption string `json:"aOption"`  
    }
    ```
  
  <!--
  // External package:
  -->

  // 外部包：

    ```go
    type MyAPIObject struct {  
      runtime.TypeMeta `json:",inline"`  
      MyPlugin runtime.RawExtension `json:"myPlugin"`    
    } 

    type PluginA struct {  
      AOption string `json:"aOption"`  
    }
    ```
  
  <!--
  // On the wire, the JSON will look something like this:
  -->

  // 在网络上，JSON 看起来像这样：

    ```json
    {  
      "kind":"MyAPIObject",  
      "apiVersion":"v1",  
      "myPlugin": {  
        "kind":"PluginA",  
        "aOption":"foo",  
      },  
    }
    ```
  
  <!--
  So what happens? Decode first uses json or yaml to unmarshal the serialized data into your external MyAPIObject. That causes the raw JSON to be stored, but not unpacked. The next step is to copy (using pkg/conversion) into the internal struct. The runtime package's DefaultScheme has conversion functions installed which will unpack the JSON stored in RawExtension, turning it into the correct object type, and storing it in the Object. (TODO: In the case where the object is of an unknown type, a runtime.Unknown object will be created and stored.)*
  -->
  
  那么会发生什么？
  解码首先使用 json 或 yaml 将序列化数据解组到你的外部 MyAPIObject 中。
  这会导致原始 JSON 被存储下来，但不会被解包。
  下一步是复制（使用 pkg/conversion）到内部结构中。
  runtime 包的 DefaultScheme 安装了转换函数，它将解析存储在 RawExtension 中的 JSON，
  将其转换为正确的对象类型，并将其存储在 Object 中。
  （TODO：如果对象是未知类型，将创建并存储一个 `runtime.Unknown`对象。）

<!--
## ControllerRevisionList {#ControllerRevisionList}

ControllerRevisionList is a resource containing a list of ControllerRevision objects.

<hr>
-->
## ControllerRevisionList {#ControllerRevisionList}

ControllerRevisionList 是一个包含 ControllerRevision 对象列表的资源。

<hr>

<!--
- **apiVersion**: apps/v1
-->
- **apiVersion**: apps/v1

<!--
- **kind**: ControllerRevisionList
-->
- **kind**: ControllerRevisionList

<!--
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
-->
- **metadata** (<a href="{{< ref "../common-definitions/list-meta#ListMeta" >}}">ListMeta</a>)

  更多信息：
  https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

<!--
- **items** ([]<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>), required

  Items is the list of ControllerRevisions
-->
- **items** ([]<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>)，必需

  items 是 ControllerRevisions 的列表

<!--
## Operations {#Operations}

<hr>
-->
## 操作 {#Operations}

<hr>

<!--
### `get` read the specified ControllerRevision
-->
### `get` 读取特定的 ControllerRevision

<!--
#### HTTP Request

GET /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}
-->
#### HTTP 请求

GET /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the ControllerRevision
-->
- **name** （**路径参数**）：string，必需

  ControllerRevision 的名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ControllerRevision
-->
### `list` 列出或监视 ControllerRevision 类别的对象

<!--
#### HTTP Request

GET /apis/apps/v1/namespaces/{namespace}/controllerrevisions
-->
#### HTTP 请求

GET /apis/apps/v1/namespaces/{namespace}/controllerrevisions

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** （**查询参数**）： boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** (**查询参数**)): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** （**查询参数**）：string

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
- **timeoutSeconds** （**查询参数**）： integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** （**查询参数**）： boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevisionList" >}}">ControllerRevisionList</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevisionList" >}}">ControllerRevisionList</a>): OK

401: Unauthorized

<!--
### `list` list or watch objects of kind ControllerRevision
-->
### `list` 列出或监视 ControllerRevision 类别的对象

<!--
#### HTTP Request

GET /apis/apps/v1/controllerrevisions
-->
#### HTTP 请求

GET /apis/apps/v1/controllerrevisions

<!--
#### Parameters
-->
#### 参数

<!--
- **allowWatchBookmarks** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>
-->
- **allowWatchBookmarks** （**查询参数**）： boolean

  <a href="{{< ref "../common-parameters/common-parameters#allowWatchBookmarks" >}}">allowWatchBookmarks</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->
- **continue** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** （**查询参数**）： integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** （**查询参数**）：string

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
- **timeoutSeconds** （**查询参数**）： integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
- **watch** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>
-->
- **watch** （**查询参数**）： boolean

  <a href="{{< ref "../common-parameters/common-parameters#watch" >}}">watch</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevisionList" >}}">ControllerRevisionList</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevisionList" >}}">ControllerRevisionList</a>): OK

401: Unauthorized

<!--
### `create` create a ControllerRevision
-->
### `create` 创建一个 ControllerRevision

<!--
#### HTTP Request

POST /apis/apps/v1/namespaces/{namespace}/controllerrevisions
-->
#### HTTP 请求

POST /apis/apps/v1/namespaces/{namespace}/controllerrevisions

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->  
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

201 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Created

202 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Accepted

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

201 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Created

202 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Accepted

401: Unauthorized

<!--
### `update` replace the specified ControllerRevision
-->
### `update` 替换特定的 ControllerRevision

<!--
#### HTTP Request

PUT /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}
-->
#### HTTP 参数

PUT /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the ControllerRevision
-->
- **name** （**路径参数**）：string，必需

  ControllerRevision 的名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>, required
-->
- **body**: <a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>


<!--
#### Response

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

201 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Created

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

201 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Created

401: Unauthorized

<!--
### `patch` partially update the specified ControllerRevision
-->
### `patch` 部分更新特定的 ControllerRevision

<!--
#### HTTP Request

PATCH /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}
-->
#### HTTP 请求

PATCH /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the ControllerRevision
-->
- **name** （**路径参数**）：string，必需

  ControllerRevision 的名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>, required
-->
- **body**: <a href="{{< ref "../common-definitions/patch#Patch" >}}">Patch</a>，必需

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldManager** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>
-->
- **fieldManager** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldManager" >}}">fieldManager</a>

<!--
- **fieldValidation** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>
-->
- **fieldValidation** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldValidation" >}}">fieldValidation</a>

<!--
- **force** (*in query*): boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>
-->
- **force** （**查询参数**）： boolean

  <a href="{{< ref "../common-parameters/common-parameters#force" >}}">force</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
#### Response

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

201 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Created

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): OK

201 (<a href="{{< ref "../workload-resources/controller-revision-v1#ControllerRevision" >}}">ControllerRevision</a>): Created

401: Unauthorized

<!--
### `delete` delete a ControllerRevision
-->
### `delete` 删除一个 ControllerRevision

<!--
#### HTTP Request

DELETE /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}
-->
#### HTTP 请求

DELETE /apis/apps/v1/namespaces/{namespace}/controllerrevisions/{name}

<!--
#### Parameters
-->
#### 参数

<!--
- **name** (*in path*): string, required

  name of the ControllerRevision
-->
- **name** （**路径参数**）：string，必需

  ControllerRevision 的名称

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->  
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** （**查询参数**）： integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

202 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): Accepted

401: Unauthorized

<!--
### `deletecollection` delete collection of ControllerRevision
-->
### `deletecollection` 删除 ControllerRevision 集合

<!--
#### HTTP Request

DELETE /apis/apps/v1/namespaces/{namespace}/controllerrevisions
-->
#### HTTP 请求

DELETE /apis/apps/v1/namespaces/{namespace}/controllerrevisions

<!--
#### Parameters
-->
#### 参数

<!--
- **namespace** (*in path*): string, required

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>
-->
- **namespace** （**路径参数**）：string，必需

  <a href="{{< ref "../common-parameters/common-parameters#namespace" >}}">namespace</a>

<!--
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>
-->
- **body**: <a href="{{< ref "../common-definitions/delete-options#DeleteOptions" >}}">DeleteOptions</a>

<!--
- **continue** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>
-->  
- **continue** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#continue" >}}">continue</a>

<!--
- **dryRun** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>
-->
- **dryRun** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#dryRun" >}}">dryRun</a>

<!--
- **fieldSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>
-->
- **fieldSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#fieldSelector" >}}">fieldSelector</a>

<!--
- **gracePeriodSeconds** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>
-->
- **gracePeriodSeconds** （**查询参数**）： integer

  <a href="{{< ref "../common-parameters/common-parameters#gracePeriodSeconds" >}}">gracePeriodSeconds</a>

<!--
- **labelSelector** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>
-->
- **labelSelector** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#labelSelector" >}}">labelSelector</a>

<!--
- **limit** (*in query*): integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>
-->
- **limit** （**查询参数**）： integer

  <a href="{{< ref "../common-parameters/common-parameters#limit" >}}">limit</a>

<!--
- **pretty** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>
-->
- **pretty** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#pretty" >}}">pretty</a>

<!--
- **propagationPolicy** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>
-->
- **propagationPolicy** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#propagationPolicy" >}}">propagationPolicy</a>

<!--
- **resourceVersion** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>
-->
- **resourceVersion** （**查询参数**）：string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersion" >}}">resourceVersion</a>

<!--
- **resourceVersionMatch** (*in query*): string

  <a href="{{< ref "../common-parameters/common-parameters#resourceVersionMatch" >}}">resourceVersionMatch</a>
-->
- **resourceVersionMatch** （**查询参数**）：string

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
- **timeoutSeconds** （**查询参数**）： integer

  <a href="{{< ref "../common-parameters/common-parameters#timeoutSeconds" >}}">timeoutSeconds</a>

<!--
#### Response

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized
-->
#### 响应

200 (<a href="{{< ref "../common-definitions/status#Status" >}}">Status</a>): OK

401: Unauthorized

