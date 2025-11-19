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
_Labels_ are key/value pairs that are attached to
{{< glossary_tooltip text="objects" term_id="object" >}} such as pods.
Labels are intended to be used to specify identifying attributes of objects
that are meaningful and relevant to users, but do not directly imply semantics
to the core system. Labels can be used to organize and to select subsets of
objects. Labels can be attached to objects at creation time and subsequently
added and modified at any time. Each object can have a set of key/value labels
defined. Each Key must be unique for a given object.
-->
**標籤（Labels）** 是附加到 Kubernetes
{{< glossary_tooltip text="對象" term_id="object" >}}（比如 Pod）上的鍵值對。
標籤旨在用於指定對用戶有意義且相關的對象的標識屬性，但不直接對核心系統有語義含義。
標籤可以用於組織和選擇對象的子集。標籤可以在創建時附加到對象，隨後可以隨時添加和修改。
每個對象都可以定義一組鍵/值標籤。每個鍵對於給定對象必須是唯一的。

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
標籤能夠支持高效的查詢和監聽操作，對於用戶界面和命令行是很理想的。
應使用[註解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)記錄非識別信息。

<!-- body -->

<!--
## Motivation

Labels enable users to map their own organizational structures onto system objects
in a loosely coupled fashion, without requiring clients to store these mappings.
-->
## 動機   {#motivation}

標籤使用戶能夠以鬆散耦合的方式將他們自己的組織結構映射到系統對象，而無需客戶端存儲這些映射。

<!--
Service deployments and batch processing pipelines are often multi-dimensional entities
(e.g., multiple partitions or deployments, multiple release tracks, multiple tiers,
multiple micro-services per tier). Management often requires cross-cutting operations,
which breaks encapsulation of strictly hierarchical representations, especially rigid
hierarchies determined by the infrastructure rather than by users.

Example labels:
-->
服務部署和批處理流水線通常是多維實體（例如，多個分區或部署、多個發行序列、多個層，每層多個微服務）。
管理通常需要交叉操作，這打破了嚴格的層次表示的封裝，特別是由基礎設施而不是用戶確定的嚴格的層次結構。

示例標籤：

* `"release" : "stable"`, `"release" : "canary"`
* `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
* `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
* `"partition" : "customerA"`, `"partition" : "customerB"`
* `"track" : "daily"`, `"track" : "weekly"`

<!--
These are examples of
[commonly used labels](/docs/concepts/overview/working-with-objects/common-labels/);
you are free to develop your own conventions.
Keep in mind that label Key must be unique for a given object.
-->
有一些[常用標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/)的例子；你可以任意制定自己的約定。
請記住，標籤的 Key 對於給定對象必須是唯一的。

<!--
## Syntax and character set

_Labels_ are key/value pairs. Valid label keys have two segments: an optional
prefix and name, separated by a slash (`/`). The name segment is required and
must be 63 characters or less, beginning and ending with an alphanumeric
character (`[a-z0-9A-Z]`) with dashes (`-`), underscores (`_`), dots (`.`),
and alphanumerics between. The prefix is optional. If specified, the prefix
must be a DNS subdomain: a series of DNS labels separated by dots (`.`),
not longer than 253 characters in total, followed by a slash (`/`).

If the prefix is omitted, the label Key is presumed to be private to the user.
Automated system components (e.g. `kube-scheduler`, `kube-controller-manager`,
`kube-apiserver`, `kubectl`, or other third-party automation) which add labels
to end-user objects must specify a prefix.

The `kubernetes.io/` and `k8s.io/` prefixes are
[reserved](/docs/reference/labels-annotations-taints/) for Kubernetes core components.
-->
## 語法和字符集   {#syntax-and-character-set}

**標籤**是鍵值對。有效的標籤鍵有兩個段：可選的前綴和名稱，用斜槓（`/`）分隔。
名稱段是必需的，必須小於等於 63 個字符，以字母數字字符（`[a-z0-9A-Z]`）開頭和結尾，
帶有破折號（`-`），下劃線（`_`），點（ `.`）和之間的字母數字。
前綴是可選的。如果指定，前綴必須是 DNS 子域：由點（`.`）分隔的一系列 DNS 標籤，總共不超過 253 個字符，
後跟斜槓（`/`）。

如果省略前綴，則假定標籤鍵對用戶是私有的。
向最終用戶對象添加標籤的自動系統組件（例如 `kube-scheduler`、`kube-controller-manager`、
`kube-apiserver`、`kubectl` 或其他第三方自動化工具）必須指定前綴。

`kubernetes.io/` 和 `k8s.io/` 前綴是爲 Kubernetes 核心組件[保留的](/zh-cn/docs/reference/labels-annotations-taints/)。

<!--
Valid label value:

* must be 63 characters or less (can be empty),
* unless empty, must begin and end with an alphanumeric character (`[a-z0-9A-Z]`),
* could contain dashes (`-`), underscores (`_`), dots (`.`), and alphanumerics between.
-->
有效標籤值：

* 必須爲 63 個字符或更少（可以爲空）
* 除非標籤值爲空，必須以字母數字字符（`[a-z0-9A-Z]`）開頭和結尾
* 包含破折號（`-`）、下劃線（`_`）、點（`.`）和字母或數字

<!--
For example, here's a manifest for a Pod that has two labels
`environment: production` and `app: nginx`:
-->
例如，以下是一個清單 (manifest)，適用於具有 `environment: production` 和 `app: nginx` 這兩個標籤的 Pod：

```yaml

apiVersion: v1
kind: Pod
metadata:
  name: label-demo
  labels:
    environment: production
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80

```

<!--
## Label selectors

Unlike [names and UIDs](/docs/concepts/overview/working-with-objects/names/), labels
do not provide uniqueness. In general, we expect many objects to carry the same label(s).
-->
## 標籤選擇算符   {#label-selectors}

與[名稱和 UID](/zh-cn/docs/concepts/overview/working-with-objects/names/) 不同，
標籤不支持唯一性。通常，我們希望許多對象攜帶相同的標籤。

<!--
Via a _label selector_, the client/user can identify a set of objects.
The label selector is the core grouping primitive in Kubernetes.
-->
通過**標籤選擇算符**，客戶端/用戶可以識別一組對象。標籤選擇算符是 Kubernetes 中的核心分組原語。

<!--
The API currently supports two types of selectors: _equality-based_ and _set-based_.
A label selector can be made of multiple _requirements_ which are comma-separated.
In the case of multiple requirements, all must be satisfied so the comma separator
acts as a logical _AND_ (`&&`) operator.
-->
API 目前支持兩種類型的選擇算符：**基於等值的**和**基於集合的**。
標籤選擇算符可以由逗號分隔的多個**需求**組成。
在多個需求的情況下，必須滿足所有要求，因此逗號分隔符充當邏輯**與**（`&&`）運算符。

<!--
The semantics of empty or non-specified selectors are dependent on the context,
and API types that use selectors should document the validity and meaning of
them.
-->
空標籤選擇算符或者未指定的選擇算符的語義取決於上下文，
支持使用選擇算符的 API 類別應該將算符的合法性和含義用文檔記錄下來。

{{< note >}}
<!--
For some API types, such as ReplicaSets, the label selectors of two instances must
not overlap within a namespace, or the controller can see that as conflicting
instructions and fail to determine how many replicas should be present.
-->
對於某些 API 類別（例如 ReplicaSet）而言，兩個實例的標籤選擇算符不得在命名空間內重疊，
否則它們的控制器將互相沖突，無法確定應該存在的副本個數。
{{< /note >}}

{{< caution >}}
<!--
For both equality-based and set-based conditions there is no logical _OR_ (`||`) operator.
Ensure your filter statements are structured accordingly.
-->
對於基於等值的和基於集合的條件而言，不存在邏輯或（`||`）操作符。
你要確保你的過濾語句按合適的方式組織。
{{< /caution >}}

<!--
### _Equality-based_ requirement

_Equality-_ or _inequality-based_ requirements allow filtering by label keys and values.
Matching objects must satisfy all of the specified label constraints, though they may
have additional labels as well. Three kinds of operators are admitted `=`,`==`,`!=`.
The first two represent _equality_ (and are synonyms), while the latter represents _inequality_.
For example:
-->
### **基於等值的**需求

**基於等值**或**基於不等值**的需求允許按標籤鍵和值進行過濾。
匹配對象必須滿足所有指定的標籤約束，儘管它們也可能具有其他標籤。
可接受的運算符有 `=`、`==` 和 `!=` 三種。
前兩個表示**相等**（並且是同義詞），而後者表示**不相等**。例如：

```
environment = production
tier != frontend
```

<!--
The former selects all resources with key equal to `environment` and value equal to `production`.
The latter selects all resources with key equal to `tier` and value distinct from `frontend`,
and all resources with no labels with the `tier` key. One could filter for resources in `production`
excluding `frontend` using the comma operator: `environment=production,tier!=frontend`
-->
前者選擇所有資源，其鍵名等於 `environment`，值等於 `production`。
後者選擇所有資源，其鍵名等於 `tier`，值不同於 `frontend`，所有資源都沒有帶有 `tier` 鍵的標籤。
可以使用逗號運算符來過濾 `production` 環境中的非 `frontend` 層資源：`environment=production,tier!=frontend`。

<!--
One usage scenario for equality-based label requirement is for Pods to specify
node selection criteria. For example, the sample Pod below selects nodes where
the  `accelerator` label exists and is set to `nvidia-tesla-p100`.
-->
基於等值的標籤要求的一種使用場景是 Pod 要指定節點選擇標準。
例如，下面的示例 Pod 選擇存在 `accelerator` 標籤且值爲 `nvidia-tesla-p100` 的節點。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "registry.k8s.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```

<!--
### _Set-based_ requirement

_Set-based_ label requirements allow filtering keys according to a set of values.
Three kinds of operators are supported: `in`,`notin` and `exists` (only the key identifier).
For example:
-->
### **基於集合**的需求

**基於集合**的標籤需求允許你通過一組值來過濾鍵。
支持三種操作符：`in`、`notin` 和 `exists`（只可以用在鍵標識符上）。例如：

```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

<!--
- The first example selects all resources with key equal to `environment` and value
  equal to `production` or `qa`.
- The second example selects all resources with key equal to `tier` and values other
  than `frontend` and `backend`, and all resources with no labels with the `tier` key.
- The third example selects all resources including a label with key `partition`;
  no values are checked.
- The fourth example selects all resources without a label with key `partition`;
  no values are checked.

Similarly the comma separator acts as an _AND_ operator. So filtering resources
with a `partition` key (no matter the value) and with `environment` different
than `qa` can be achieved using `partition,environment notin (qa)`.
-->

- 第一個示例選擇了所有鍵等於 `environment` 並且值等於 `production` 或者 `qa` 的資源。
- 第二個示例選擇了所有鍵等於 `tier` 並且值不等於 `frontend` 或者 `backend` 的資源，以及所有沒有 `tier` 鍵標籤的資源。
- 第三個示例選擇了所有包含了有 `partition` 標籤的資源；沒有校驗它的值。
- 第四個示例選擇了所有沒有 `partition` 標籤的資源；沒有校驗它的值。

類似地，逗號分隔符充當**與**運算符。因此，使用 `partition` 鍵（無論爲何值）和
`environment` 不同於 `qa` 來過濾資源可以使用 `partition, environment notin (qa)` 來實現。

<!--
The _set-based_ label selector is a general form of equality since
`environment=production` is equivalent to `environment in (production)`;
similarly for `!=` and `notin`.
-->
**基於集合**的標籤選擇算符是相等標籤選擇算符的一般形式，因爲 `environment=production`
等同於 `environment in (production)`；`!=` 和 `notin` 也是類似的。

<!--
_Set-based_ requirements can be mixed with _equality-based_ requirements.
For example: `partition in (customerA, customerB),environment!=qa`.
-->
**基於集合**的要求可以與基於**相等**的要求混合使用。例如：`partition in (customerA, customerB),environment!=qa`。

## API

<!--
### LIST and WATCH filtering

For **list** and **watch** operations, you can specify label selectors to filter the sets of objects
returned; you specify the filter using a query parameter.
(To learn in detail about watches in Kubernetes, read
[efficient detection of changes](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)).
Both requirements are permitted
(presented here as they would appear in a URL query string):
-->
### LIST 和 WATCH 過濾

對於 **list** 和 **watch** 操作，你可以指定標籤選擇算符過濾返回的對象集；你可以使用查詢參數來指定過濾條件。
（瞭解 Kubernetes 中的 watch 操作細節，請參閱
[高效檢測變更](/zh-cn/docs/reference/using-api/api-concepts/#efficient-detection-of-changes)）。
兩種需求都是允許的。（這裏顯示的是它們出現在 URL 查詢字符串中）

<!--
* _equality-based_ requirements: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
* _set-based_ requirements: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`
-->
* **基於等值**的需求：`?labelSelector=environment%3Dproduction,tier%3Dfrontend`
* **基於集合**的需求：`?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

<!--
Both label selector styles can be used to list or watch resources via a REST client.
For example, targeting `apiserver` with `kubectl` and using _equality-based_ one may write:
-->
兩種標籤選擇算符都可以通過 REST 客戶端用於 list 或者 watch 資源。
例如，使用 `kubectl` 定位 `apiserver`，可以使用**基於等值**的標籤選擇算符可以這麼寫：


```shell
kubectl get pods -l environment=production,tier=frontend
```

<!--
or using _set-based_ requirements:
-->
或者使用**基於集合的**需求：

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

<!--
As already mentioned _set-based_ requirements are more expressive.
For instance, they can implement the _OR_ operator on values:
-->
正如剛纔提到的，**基於集合**的需求更具有表達力。例如，它們可以實現值的**或**操作：

```shell
kubectl get pods -l 'environment in (production, qa)'
```

<!--
or restricting negative matching via _notin_ operator:
-->
或者通過**notin**運算符限制不匹配：

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
### 在 API 對象中設置引用

一些 Kubernetes 對象，例如 [`services`](/zh-cn/docs/concepts/services-networking/service/)
和 [`replicationcontrollers`](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)，
也使用了標籤選擇算符去指定了其他資源的集合，例如
[pods](/zh-cn/docs/concepts/workloads/pods/)。

<!--
#### Service and ReplicationController

The set of pods that a `service` targets is defined with a label selector.
Similarly, the population of pods that a `replicationcontroller` should
manage is also defined with a label selector.

Label selectors for both objects are defined in `json` or `yaml` files using maps,
and only _equality-based_ requirement selectors are supported:
-->
#### Service 和 ReplicationController

一個 `Service` 指向的一組 Pod 是由標籤選擇算符定義的。同樣，一個 `ReplicationController`
應該管理的 Pod 的數量也是由標籤選擇算符定義的。

兩個對象的標籤選擇算符都是在 `json` 或者 `yaml` 文件中使用映射定義的，並且只支持
**基於等值**需求的選擇算符：

```json
"selector": {
    "component" : "redis",
}
```

<!--
or
-->
或者

```yaml
selector:
  component: redis
```

<!---
This selector (respectively in `json` or `yaml` format) is equivalent to
`component=redis` or `component in (redis)`.
-->
這個選擇算符（分別在 `json` 或者 `yaml` 格式中）等價於 `component=redis` 或 `component in (redis)`。

<!--
#### Resources that support set-based requirements

Newer resources, such as [`Job`](/docs/concepts/workloads/controllers/job/),
[`Deployment`](/docs/concepts/workloads/controllers/deployment/),
[`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/), and
[`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/),
support _set-based_ requirements as well.
-->
#### 支持基於集合需求的資源

比較新的資源，例如 [`Job`](/zh-cn/docs/concepts/workloads/controllers/job/)、
[`Deployment`](/zh-cn/docs/concepts/workloads/controllers/deployment/)、
[`ReplicaSet`](/zh-cn/docs/concepts/workloads/controllers/replicaset/) 和
[`DaemonSet`](/zh-cn/docs/concepts/workloads/controllers/daemonset/)，
也支持**基於集合的**需求。

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - { key: tier, operator: In, values: [cache] }
    - { key: environment, operator: NotIn, values: [dev] }
```

<!--
`matchLabels` is a map of `{key,value}` pairs. A single `{key,value}` in the
`matchLabels` map is equivalent to an element of `matchExpressions`, whose `key`
field is "key", the `operator` is "In", and the `values` array contains only "value".
`matchExpressions` is a list of pod selector requirements. Valid operators include
In, NotIn, Exists, and DoesNotExist. The values set must be non-empty in the case of
In and NotIn. All of the requirements, from both `matchLabels` and `matchExpressions`
are ANDed together -- they must all be satisfied in order to match.
-->

`matchLabels` 是由 `{key,value}` 對組成的映射。
`matchLabels` 映射中的單個 `{key,value}` 等同於 `matchExpressions` 的元素，
其 `key` 字段爲 "key"，`operator` 爲 "In"，而 `values` 數組僅包含 "value"。
`matchExpressions` 是 Pod 選擇算符需求的列表。
有效的運算符包括 `In`、`NotIn`、`Exists` 和 `DoesNotExist`。
在 `In` 和 `NotIn` 的情況下，設置的值必須是非空的。
來自 `matchLabels` 和 `matchExpressions` 的所有要求都按邏輯與的關係組合到一起
-- 它們必須都滿足才能匹配。

<!--
#### Selecting sets of nodes

One use case for selecting over labels is to constrain the set of nodes onto which
a pod can schedule. See the documentation on
[node selection](/docs/concepts/scheduling-eviction/assign-pod-node/) for more information.
-->
#### 選擇節點集

通過標籤進行選擇的一個用例是確定節點集，方便 Pod 調度。
有關更多信息，請參閱[選擇節點](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)文檔。

<!--
## Using labels effectively

The examples we've used so far apply at most a single label to any resource. There are many
scenarios where multiple labels should be used to distinguish sets from one another.
-->
## 有效地使用標籤  {#using-labels-effectively}

到目前爲止我們使用的示例中的資源最多使用了一個標籤。
在許多情況下，應使用多個標籤來區分不同集合。

<!--
For instance, different applications would use different values for the `app` label, but a
multi-tier application, such as the [guestbook example](https://github.com/kubernetes/examples/tree/master/web/guestbook/),
would additionally need to distinguish each tier. The frontend could carry the following labels:
-->
例如，不同的應用可能會爲 `app` 標籤設置不同的值。
但是，類似 [guestbook 示例](https://github.com/kubernetes/examples/tree/master/web/guestbook/)
這樣的多層應用，還需要區分每一層。前端可能會帶有以下標籤：

```yaml
labels:
  app: guestbook
  tier: frontend
```

<!--
while the Redis master and replica would have different `tier` labels, and perhaps even an
additional `role` label:
-->
Redis 的主從節點會有不同的 `tier` 標籤，甚至還有一個額外的 `role` 標籤：

```yaml
labels:
  app: guestbook
  tier: backend
  role: master
```

<!--
and
-->
以及

```yaml
labels:
  app: guestbook
  tier: backend
  role: replica
```

<!--
The labels allow us to slice and dice our resources along any dimension specified by a label:
-->
標籤使得我們能夠按照所指定的任何維度對我們的資源進行切片和切塊：

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```none
NAME                           READY  STATUS    RESTARTS   AGE   APP         TIER       ROLE
guestbook-fe-4nlpb             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-ght6d             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-fe-jpy62             1/1    Running   0          1m    guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1    Running   0          1m    guestbook   backend    master
guestbook-redis-replica-2q2yf  1/1    Running   0          1m    guestbook   backend    replica
guestbook-redis-replica-qgazl  1/1    Running   0          1m    guestbook   backend    replica
my-nginx-divi2                 1/1    Running   0          29m   nginx       <none>     <none>
my-nginx-o0ef1                 1/1    Running   0          29m   nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=replica
```

```none
NAME                           READY  STATUS   RESTARTS  AGE
guestbook-redis-replica-2q2yf  1/1    Running  0         3m
guestbook-redis-replica-qgazl  1/1    Running  0         3m
```

<!--
## Updating labels

Sometimes existing pods and other resources need to be relabeled before creating new resources.
This can be done with `kubectl label`.
For example, if you want to label all your nginx pods as frontend tier, run:
-->
## 更新標籤  {#updating-labels}

有時需要要在創建新資源之前對現有的 Pod 和其它資源重新打標籤。
這可以用 `kubectl label` 完成。
例如，如果想要將所有 NGINX Pod 標記爲前端層，運行：

```shell
kubectl label pods -l app=nginx tier=fe
```

```none
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

<!--
This first filters all pods with the label "app=nginx", and then labels them with the "tier=fe".
To see the pods you labeled, run:
-->
首先用標籤 "app=nginx" 過濾所有的 Pod，然後用 "tier=fe" 標記它們。
想要查看你剛設置了標籤的 Pod，請運行：

```shell
kubectl get pods -l app=nginx -L tier
```

```none
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

<!--
This outputs all "app=nginx" pods, with an additional label column of pods' tier (specified with
`-L` or `--label-columns`).

For more information, please see [labels](/docs/concepts/overview/working-with-objects/labels/)
and [kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label).
-->
此命令將輸出所有 "app=nginx" 的 Pod，並有一個額外的描述 Pod 所在分層的標籤列
（用參數 `-L` 或者 `--label-columns` 標明）。

想要了解更多信息，請參考[標籤](/zh-cn/docs/concepts/overview/working-with-objects/labels/)和
[`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands/#label)
命令文檔。

## {{% heading "whatsnext" %}}

<!--
- Learn how to [add a label to a node](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)
- Find [Well-known labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)
- See [Recommended labels](/docs/concepts/overview/working-with-objects/common-labels/)
- [Enforce Pod Security Standards with Namespace Labels](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)
- Read a blog on [Writing a Controller for Pod Labels](/blog/2021/06/21/writing-a-controller-for-pod-labels/)
-->
- 學習如何[給節點添加標籤](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)
- 查閱[衆所周知的標籤、註解和污點](/zh-cn/docs/reference/labels-annotations-taints/)
- 參見[推薦使用的標籤](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/)
- [使用名字空間標籤來實施 Pod 安全性標準](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)
- 閱讀[爲 Pod 標籤編寫控制器](/blog/2021/06/21/writing-a-controller-for-pod-labels/)的博文
