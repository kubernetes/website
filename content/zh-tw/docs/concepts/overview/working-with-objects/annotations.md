---
title: 註解
content_type: concept
weight: 60
---

<!--
title: Annotations
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
You can use Kubernetes annotations to attach arbitrary non-identifying metadata
to {{< glossary_tooltip text="objects" term_id="object" >}}.
Clients such as tools and libraries can retrieve this metadata.
-->
你可以使用 Kubernetes 註解爲{{< glossary_tooltip text="對象" term_id="object" >}}附加任意的非標識的元數據。
客戶端程序（例如工具和庫）能夠獲取這些元數據信息。

<!-- body -->
<!--
## Attaching metadata to objects

You can use either labels or annotations to attach metadata to Kubernetes
objects. Labels can be used to select objects and to find
collections of objects that satisfy certain conditions. In contrast, annotations
are not used to identify and select objects. The metadata
in an annotation can be small or large, structured or unstructured, and can
include characters not permitted by labels. It is possible to use labels as 
well as annotations in the metadata of the same object.

Annotations, like labels, are key/value maps:
-->
## 爲對象附加元數據

你可以使用標籤或註解將元數據附加到 Kubernetes 對象。
標籤可以用來選擇對象和查找滿足某些條件的對象集合。 相反，註解不用於標識和選擇對象。
註解中的元數據，可以很小，也可以很大，可以是結構化的，也可以是非結構化的，能夠包含標籤不允許的字符。
可以在同一對象的元數據中同時使用標籤和註解。

註解和標籤一樣，是鍵/值對：

```json
"metadata": {
  "annotations": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

{{<note>}}
<!--
The keys and the values in the map must be strings. In other words, you cannot use
numeric, boolean, list or other types for either the keys or the values.
-->
Map 中的鍵和值必須是字符串。
換句話說，你不能使用數字、布爾值、列表或其他類型的鍵或值。
{{</note>}}

<!--
Here are some examples of information that could be recorded in annotations:
-->
以下是一些例子，用來說明哪些信息可以使用註解來記錄：

<!--
* Fields managed by a declarative configuration layer. Attaching these fields
  as annotations distinguishes them from default values set by clients or
  servers, and from auto-generated fields and fields set by
  auto-sizing or auto-scaling systems.

* Build, release, or image information like timestamps, release IDs, git branch,
  PR numbers, image hashes, and registry address.

* Pointers to logging, monitoring, analytics, or audit repositories.
-->

* 由聲明性配置所管理的字段。
  將這些字段附加爲註解，能夠將它們與客戶端或服務端設置的默認值、
  自動生成的字段以及通過自動調整大小或自動伸縮系統設置的字段區分開來。
* 構建、發佈或鏡像信息（如時間戳、發佈 ID、Git 分支、PR 數量、鏡像哈希、倉庫地址）。
* 指向日誌記錄、監控、分析或審計倉庫的指針。


<!--
* Client library or tool information that can be used for debugging purposes:
  for example, name, version, and build information.

* User or tool/system provenance information, such as URLs of related objects
  from other ecosystem components.

* Lightweight rollout tool metadata: for example, config or checkpoints.

* Phone or pager numbers of persons responsible, or directory entries that
  specify where that information can be found, such as a team web site.

* Directives from the end-user to the implementations to modify behavior or
  engage non-standard features.
-->
* 可用於調試目的的客戶端庫或工具信息：例如，名稱、版本和構建信息。

* 用戶或者工具/系統的來源信息，例如來自其他生態系統組件的相關對象的 URL。

* 輕量級上線工具的元數據信息：例如，配置或檢查點。

* 負責人員的電話或呼機號碼，或指定在何處可以找到該信息的目錄條目，如團隊網站。

* 從用戶到最終運行的指令，以修改行爲或使用非標準功能。

<!--
Instead of using annotations, you could store this type of information in an
external database or directory, but that would make it much harder to produce
shared client libraries and tools for deployment, management, introspection,
and the like.
-->
你可以將這類信息存儲在外部數據庫或目錄中而不使用註解，
但這樣做就使得開發人員很難生成用於部署、管理、自檢的客戶端共享庫和工具。

<!--
## Syntax and character set

_Annotations_ are key/value pairs. Valid annotation keys have two segments: an optional prefix and name, separated by a slash (`/`). The name segment is required and must be 63 characters or less, beginning and ending with an alphanumeric character (`[a-z0-9A-Z]`) with dashes (`-`), underscores (`_`), dots (`.`), and alphanumerics between. The prefix is optional. If specified, the prefix must be a DNS subdomain: a series of DNS labels separated by dots (`.`), not longer than 253 characters in total, followed by a slash (`/`).

If the prefix is omitted, the annotation Key is presumed to be private to the user. Automated system components (e.g. `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl`, or other third-party automation) which add annotations to end-user objects must specify a prefix.
-->
## 語法和字符集

**註解（Annotations）** 存儲的形式是鍵/值對。有效的註解鍵分爲兩部分：
可選的前綴和名稱，以斜槓（`/`）分隔。 
名稱段是必需項，並且必須在 63 個字符以內，以字母數字字符（`[a-z0-9A-Z]`）開頭和結尾，
並允許使用破折號（`-`），下劃線（`_`），點（`.`）和字母數字。 
前綴是可選的。如果指定，則前綴必須是 DNS 子域：一系列由點（`.`）分隔的 DNS 標籤，
總計不超過 253 個字符，後跟斜槓（`/`）。
如果省略前綴，則假定註解鍵對用戶是私有的。 由系統組件添加的註解
（例如，`kube-scheduler`，`kube-controller-manager`，`kube-apiserver`，`kubectl`
或其他第三方組件），必須爲終端用戶添加註解前綴。

<!--
The `kubernetes.io/` and `k8s.io/` prefixes are reserved for Kubernetes core components.

For example, here's a manifest for a Pod that has the annotation `imageregistry: https://hub.docker.com/` :
-->
`kubernetes.io/` 和 `k8s.io/` 前綴是爲 Kubernetes 核心組件保留的。

例如，下面是一個 Pod 的清單，其註解中包含 `imageregistry: https://hub.docker.com/`：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: annotations-demo
  annotations:
    imageregistry: "https://hub.docker.com/"
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

## {{% heading "whatsnext" %}}

<!--
- Learn more about [Labels and Selectors](/docs/concepts/overview/working-with-objects/labels/).
- Find [Well-known labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)
-->
- 進一步瞭解[標籤和選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)。
- 查找[衆所周知的標籤、註解和污點](/zh-cn/docs/reference/labels-annotations-taints/)。