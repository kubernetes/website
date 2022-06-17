---
title: 標籤和選擇算符
content_type: concept
weight: 40
---
<!--
reviewers:
- mikedanese
title: Labels and Selectors
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
_Labels_ are key/value pairs that are attached to objects, such as pods.
Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to users, but do not directly imply semantics to the core system.
Labels can be used to organize and to select subsets of objects.
Labels can be attached to objects at creation time and subsequently added and modified at any time.
Each object can have a set of key/value labels defined.  Each Key must be unique for a given object.
-->
_標籤（Labels）_ 是附加到 Kubernetes 物件（比如 Pods）上的鍵值對。
標籤旨在用於指定對使用者有意義且相關的物件的標識屬性，但不直接對核心系統有語義含義。
標籤可以用於組織和選擇物件的子集。標籤可以在建立時附加到物件，隨後可以隨時新增和修改。
每個物件都可以定義一組鍵/值標籤。每個鍵對於給定物件必須是唯一的。

```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

<!--
Labels allow for efficient queries and watches and are ideal for use in UIs
and CLIs. Non-identifying information should be recorded using
[annotations](/docs/concepts/overview/working-with-objects/annotations/).
-->
標籤能夠支援高效的查詢和監聽操作，對於使用者介面和命令列是很理想的。
應使用[註解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)記錄非識別資訊。

<!-- body -->

<!--
## Motivation

Labels enable users to map their own organizational structures onto system objects in a loosely coupled fashion, without requiring clients to store these mappings.
-->
## 動機

標籤使使用者能夠以鬆散耦合的方式將他們自己的組織結構對映到系統物件，而無需客戶端儲存這些對映。

<!--
Service deployments and batch processing pipelines are often multi-dimensional entities (e.g., multiple partitions or deployments, multiple release tracks, multiple tiers, multiple micro-services per tier). Management often requires cross-cutting operations, which breaks encapsulation of strictly hierarchical representations, especially rigid hierarchies determined by the infrastructure rather than by users.

Example labels:
-->
服務部署和批處理流水線通常是多維實體（例如，多個分割槽或部署、多個發行序列、多個層，每層多個微服務）。
管理通常需要交叉操作，這打破了嚴格的層次表示的封裝，特別是由基礎設施而不是使用者確定的嚴格的層次結構。

示例標籤：

* `"release" : "stable"`, `"release" : "canary"`
* `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
* `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
* `"partition" : "customerA"`, `"partition" : "customerB"`
* `"track" : "daily"`, `"track" : "weekly"`

<!--
These are examples of [commonly used labels](/docs/concepts/overview/working-with-objects/common-labels/); you are free to develop your own conventions. Keep in mind that label Key must be unique for a given object.
-->
有一些[常用標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/)的例子；你可以任意制定自己的約定。
請記住，標籤的 Key 對於給定物件必須是唯一的。

<!--
## Syntax and character set

_Labels_ are key/value pairs. Valid label keys have two segments: an optional prefix and name, separated by a slash (`/`).  The name segment is required and must be 63 characters or less, beginning and ending with an alphanumeric character (`[a-z0-9A-Z]`) with dashes (`-`), underscores (`_`), dots (`.`), and alphanumerics between.  The prefix is optional.  If specified, the prefix must be a DNS subdomain: a series of DNS labels separated by dots (`.`), not longer than 253 characters in total, followed by a slash (`/`).

If the prefix is omitted, the label Key is presumed to be private to the user. Automated system components (e.g. `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl`, or other third-party automation) which add labels to end-user objects must specify a prefix.

The `kubernetes.io/` and `k8s.io/` prefixes are [reserved](/docs/reference/labels-annotations-taints/) for Kubernetes core components.
-->
## 語法和字符集

_標籤_ 是鍵值對。有效的標籤鍵有兩個段：可選的字首和名稱，用斜槓（`/`）分隔。
名稱段是必需的，必須小於等於 63 個字元，以字母數字字元（`[a-z0-9A-Z]`）開頭和結尾，
帶有破折號（`-`），下劃線（`_`），點（ `.`）和之間的字母數字。
字首是可選的。如果指定，字首必須是 DNS 子域：由點（`.`）分隔的一系列 DNS 標籤，總共不超過 253 個字元，
後跟斜槓（`/`）。

如果省略字首，則假定標籤鍵對使用者是私有的。
向終端使用者物件新增標籤的自動系統元件（例如 `kube-scheduler`、`kube-controller-manager`、
`kube-apiserver`、`kubectl` 或其他第三方自動化工具）必須指定字首。

`kubernetes.io/` 和 `k8s.io/` 字首是為 Kubernetes 核心元件[保留的](/zh-cn/docs/reference/labels-annotations-taints/)。

<!--
Valid label value:

* must be 63 characters or less (can be empty),
* unless empty, must begin and end with an alphanumeric character (`[a-z0-9A-Z]`),
* could contain dashes (`-`), underscores (`_`), dots (`.`), and alphanumerics between.
-->
有效標籤值：

* 必須為 63 個字元或更少（可以為空）
* 除非標籤值為空，必須以字母數字字元（`[a-z0-9A-Z]`）開頭和結尾
* 包含破折號（`-`）、下劃線（`_`）、點（`.`）和字母或數字

<!--
## Label selectors

Unlike [names and UIDs](/docs/user-guide/identifiers), labels do not provide uniqueness. In general, we expect many objects to carry the same label(s).
-->
## 標籤選擇算符   {#label-selectors}

與[名稱和 UID](/zh-cn/docs/concepts/overview/working-with-objects/names/) 不同，
標籤不支援唯一性。通常，我們希望許多物件攜帶相同的標籤。

<!--
Via a _label selector_, the client/user can identify a set of objects. The label selector is the core grouping primitive in Kubernetes.
-->
透過 _標籤選擇算符_，客戶端/使用者可以識別一組物件。標籤選擇算符是 Kubernetes 中的核心分組原語。

<!--
The API currently supports two types of selectors: _equality-based_ and _set-based_.
A label selector can be made of multiple _requirements_ which are comma-separated. In the case of multiple requirements, all must be satisfied so the comma separator acts as a logical _AND_ (`&&`) operator.
-->
API 目前支援兩種型別的選擇算符：_基於等值的_ 和 _基於集合的_。
標籤選擇算符可以由逗號分隔的多個 _需求_ 組成。
在多個需求的情況下，必須滿足所有要求，因此逗號分隔符充當邏輯 _與_（`&&`）運算子。

<!--
The semantics of empty or non-specified selectors are dependent on the context,
and API types that use selectors should document the validity and meaning of
them.
-->
空標籤選擇算符或者未指定的選擇算符的語義取決於上下文，
支援使用選擇算符的 API 類別應該將算符的合法性和含義用文件記錄下來。

<!--
For some API types, such as ReplicaSets, the label selectors of two instances must not overlap within a namespace, or the controller can see that as conflicting instructions and fail to determine how many replicas should be present.
-->
{{< note >}}
對於某些 API 類別（例如 ReplicaSet）而言，兩個例項的標籤選擇算符不得在名稱空間內重疊，
否則它們的控制器將互相沖突，無法確定應該存在的副本個數。
{{< /note >}}

<!--
For both equality-based and set-based conditions there is no logical _OR_ (`||`) operator. Ensure your filter statements are structured accordingly.
-->
{{< caution >}}
對於基於等值的和基於集合的條件而言，不存在邏輯或（`||`）運算子。
你要確保你的過濾語句按合適的方式組織。
{{< /caution >}}

<!--
### _Equality-based_ requirement

_Equality-_ or _inequality-based_ requirements allow filtering by label keys and values. Matching objects must satisfy all of the specified label constraints, though they may have additional labels as well.
Three kinds of operators are admitted `=`,`==`,`!=`. The first two represent _equality_ (and are simply synonyms), while the latter represents _inequality_. For example:
-->
### _基於等值的_ 需求

_基於等值_ 或 _基於不等值_ 的需求允許按標籤鍵和值進行過濾。
匹配物件必須滿足所有指定的標籤約束，儘管它們也可能具有其他標籤。
可接受的運算子有 `=`、`==` 和 `!=` 三種。 
前兩個表示 _相等_（並且只是同義詞），而後者表示 _不相等_。例如：

```
environment = production
tier != frontend
```

<!--
The former selects all resources with key equal to `environment` and value equal to `production`.
The latter selects all resources with key equal to `tier` and value distinct from `frontend`, and all resources with no labels with the `tier` key.
One could filter for resources in `production` excluding `frontend` using the comma operator: `environment=production,tier!=frontend`
-->
前者選擇所有資源，其鍵名等於 `environment`，值等於 `production`。
後者選擇所有資源，其鍵名等於 `tier`，值不同於 `frontend`，所有資源都沒有帶有 `tier` 鍵的標籤。
可以使用逗號運算子來過濾 `production` 環境中的非 `frontend` 層資源：`environment=production,tier!=frontend`。

<!--
One usage scenario for equality-based label requirement is for Pods to specify
node selection criteria. For example, the sample Pod below selects nodes with
the label "`accelerator=nvidia-tesla-p100`".
-->
基於等值的標籤要求的一種使用場景是 Pod 要指定節點選擇標準。
例如，下面的示例 Pod 選擇帶有標籤 "`accelerator=nvidia-tesla-p100`"。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "k8s.gcr.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```

<!--
### _Set-based_ requirement

_Set-based_ label requirements allow filtering keys according to a set of values. Three kinds of operators are supported: `in`,`notin` and `exists` (only the key identifier). For example:
-->
### _基於集合_ 的需求

_基於集合_ 的標籤需求允許你透過一組值來過濾鍵。
支援三種運算子：`in`、`notin` 和 `exists`（只可以用在鍵識別符號上）。例如：

```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

<!--
* The first example selects all resources with key equal to `environment` and value equal to `production` or `qa`.
* The second example selects all resources with key equal to `tier` and values other than `frontend` and `backend`, and all resources with no labels with the `tier` key.
* The third example selects all resources including a label with key `partition`; no values are checked.
* The fourth example selects all resources without a label with key `partition`; no values are checked.

Similarly the comma separator acts as an _AND_ operator. So filtering resources with a `partition` key (no matter the value) and with `environment` different than  `qa` can be achieved using `partition,environment notin (qa)`.
-->

* 第一個示例選擇了所有鍵等於 `environment` 並且值等於 `production` 或者 `qa` 的資源。
* 第二個示例選擇了所有鍵等於 `tier` 並且值不等於 `frontend` 或者 `backend` 的資源，以及所有沒有 `tier` 鍵標籤的資源。
* 第三個示例選擇了所有包含了有 `partition` 標籤的資源；沒有校驗它的值。
* 第四個示例選擇了所有沒有 `partition` 標籤的資源；沒有校驗它的值。

類似地，逗號分隔符充當 _與_ 運算子。因此，使用 `partition` 鍵（無論為何值）和
`environment` 不同於 `qa` 來過濾資源可以使用 `partition, environment notin (qa)` 來實現。

<!--
The _set-based_ label selector is a general form of equality since `environment=production` is equivalent to `environment in (production)`; similarly for `!=` and `notin`.
-->
_基於集合_ 的標籤選擇算符是相等標籤選擇算符的一般形式，因為 `environment=production`
等同於 `environment in (production)`；`!=` 和 `notin` 也是類似的。

<!--
_Set-based_ requirements can be mixed with _equality-based_ requirements. For example: `partition in (customerA, customerB),environment!=qa`.
-->
_基於集合_ 的要求可以與基於 _相等_ 的要求混合使用。例如：`partition in (customerA, customerB),environment!=qa`。

## API

<!--
### LIST and WATCH filtering

LIST and WATCH operations may specify label selectors to filter the sets of objects returned using a query parameter. Both requirements are permitted (presented here as they would appear in a URL query string):
-->
### LIST 和 WATCH 過濾

LIST 和 WATCH 操作可以使用查詢引數指定標籤選擇算符過濾一組物件。
兩種需求都是允許的。（這裡顯示的是它們出現在 URL 查詢字串中）

<!--
* _equality-based_ requirements: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
* _set-based_ requirements: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`
-->
* _基於等值_ 的需求：`?labelSelector=environment%3Dproduction,tier%3Dfrontend`
* _基於集合_ 的需求：`?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

<!--
Both label selector styles can be used to list or watch resources via a REST client. For example, targeting `apiserver` with `kubectl` and using _equality-based_ one may write:
-->
兩種標籤選擇算符都可以透過 REST 客戶端用於 list 或者 watch 資源。
例如，使用 `kubectl` 定位 `apiserver`，可以使用 _基於等值_ 的標籤選擇算符可以這麼寫：


```shell
kubectl get pods -l environment=production,tier=frontend
```

<!-- or using _set-based_ requirements: -->
或者使用 _基於集合的_ 需求：

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

<!--
As already mentioned _set-based_ requirements are more expressive.  For instance, they can implement the _OR_ operator on values:
-->
正如剛才提到的，_基於集合_ 的需求更具有表達力。例如，它們可以實現值的 _或_ 操作：

```shell
kubectl get pods -l 'environment in (production, qa)'
```

<!-- or restricting negative matching via _exists_ operator: -->
或者透過 _exists_ 運算子限制不匹配：

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```

<!--
### Set references in API objects

Some Kubernetes objects, such as [`services`](/docs/concepts/services-networking/service/)
and [`replicationcontrollers`](/docs/concepts/workloads/controllers/replicationcontroller/),
also use label selectors to specify sets of other resources, such as
[pods](/docs/concepts/workloads/pods/).
-->
### 在 API 物件中設定引用

一些 Kubernetes 物件，例如 [`services`](/zh-cn/docs/concepts/services-networking/service/)
和 [`replicationcontrollers`](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/) ，
也使用了標籤選擇算符去指定了其他資源的集合，例如
[pods](/zh-cn/docs/concepts/workloads/pods/)。

<!--
#### Service and ReplicationController

The set of pods that a `service` targets is defined with a label selector. Similarly, the population of pods that a `replicationcontroller` should manage is also defined with a label selector.

Labels selectors for both objects are defined in `json` or `yaml` files using maps, and only _equality-based_ requirement selectors are supported:
-->
#### Service 和 ReplicationController

一個 `Service` 指向的一組 Pods 是由標籤選擇算符定義的。同樣，一個 `ReplicationController`
應該管理的 pods 的數量也是由標籤選擇算符定義的。

兩個物件的標籤選擇算符都是在 `json` 或者 `yaml` 檔案中使用對映定義的，並且只支援
_基於等值_ 需求的選擇算符：

```json
"selector": {
    "component" : "redis",
}
```

<!-- or -->
或者

```yaml
selector:
    component: redis
```

<!---
this selector (respectively in `json` or `yaml` format) is equivalent to `component=redis` or `component in (redis)`.
-->
這個選擇算符（分別在 `json` 或者 `yaml` 格式中）等價於 `component=redis` 或 `component in (redis)`。

<!--
#### Resources that support set-based requirements

Newer resources, such as [`Job`](/docs/concepts/jobs/run-to-completion-finite-workloads/), [`Deployment`](/docs/concepts/workloads/controllers/deployment/), [`Replica Set`](/docs/concepts/workloads/controllers/replicaset/), and [`Daemon Set`](/docs/concepts/workloads/controllers/daemonset/), support _set-based_ requirements as well.
-->
#### 支援基於集合需求的資源

比較新的資源，例如 [`Job`](/zh-cn/docs/concepts/workloads/controllers/job/)、
[`Deployment`](/zh-cn/docs/concepts/workloads/controllers/deployment/)、
[`Replica Set`](/zh-cn/docs/concepts/workloads/controllers/replicaset/) 和
[`DaemonSet`](/zh-cn/docs/concepts/workloads/controllers/daemonset/)，
也支援 _基於集合的_ 需求。

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - {key: tier, operator: In, values: [cache]}
    - {key: environment, operator: NotIn, values: [dev]}
```

<!--
`matchLabels` is a map of `{key,value}` pairs. A single `{key,value}` in the `matchLabels` map is equivalent to an element of `matchExpressions`, whose `key` field is "key", the `operator` is "In", and the `values` array contains only "value". `matchExpressions` is a list of pod selector requirements. Valid operators include In, NotIn, Exists, and DoesNotExist. The values set must be non-empty in the case of In and NotIn. All of the requirements, from both `matchLabels` and `matchExpressions` are ANDed together - they must all be satisfied in order to match.
-->

`matchLabels` 是由 `{key,value}` 對組成的對映。
`matchLabels` 對映中的單個 `{key,value}` 等同於 `matchExpressions` 的元素，
其 `key` 欄位為 "key"，`operator` 為 "In"，而 `values` 陣列僅包含 "value"。
`matchExpressions` 是 Pod 選擇算符需求的列表。
有效的運算子包括 `In`、`NotIn`、`Exists` 和 `DoesNotExist`。
在 `In` 和 `NotIn` 的情況下，設定的值必須是非空的。
來自 `matchLabels` 和 `matchExpressions` 的所有要求都按邏輯與的關係組合到一起
-- 它們必須都滿足才能匹配。

<!--
#### Selecting sets of nodes

One use case for selecting over labels is to constrain the set of nodes onto which a pod can schedule.
See the documentation on [node selection](/docs/concepts/configuration/assign-pod-node/) for more information.
-->
#### 選擇節點集

透過標籤進行選擇的一個用例是確定節點集，方便 Pod 排程。
有關更多資訊，請參閱[選擇節點](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)文件。

