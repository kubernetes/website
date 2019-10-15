<!--
---
reviewers:
- mikedanese
title: Labels and Selectors
content_template: templates/concept
weight: 40
---
-->

---
reviewers:
- mikedanese
title: 标签和选择器
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

<!--
_Labels_ are key/value pairs that are attached to objects, such as pods.
Labels are intended to be used to specify identifying attributes of objects that are meaningful and relevant to users, but do not directly imply semantics to the core system.
Labels can be used to organize and to select subsets of objects. Labels can be attached to objects at creation time and subsequently added and modified at any time.
Each object can have a set of key/value labels defined. Each Key must be unique for a given object.
-->

_Labels_ 是附加到对象（比如 pods）上的键值对。标签旨在用于指定对用户有意义且与用户相关的对象的标识属性，但并不直接暗示核心系统的语义。标签可用于组织和选择对象的子集。标签可以在对象创建时附加，然后可以随时添加和修改。每个对象可以定义一组键值对。每个键对于给定对象必须是唯一的。

```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

<!--
Labels allow for efficient queries and watches and are ideal for use in UIs and CLIs. Non-identifying information should be recorded using [annotations](/docs/concepts/overview/working-with-objects/annotations/).
-->

标签可以进行有效的查询和监视，非常适合用于 UI 和 CLI。非识别信息应该使用[注解](/docs/concepts/overview/working-with-objects/annotations/)记录。

{{% /capture %}}


{{% capture body %}}

<!--
## Motivation
-->
## 动机

<!--
Labels enable users to map their own organizational structures onto system objects in a loosely coupled fashion, without requiring clients to store these mappings.
-->

标签使用户能够以松散耦合的方式将自己的组织结构映射到系统对象上，而不需要客户端存储这些映射。

<!--
Service deployments and batch processing pipelines are often multi-dimensional entities (e.g., multiple partitions or deployments, multiple release tracks, multiple tiers, multiple micro-services per tier). Management often requires cross-cutting operations, which breaks encapsulation of strictly hierarchical representations, especially rigid hierarchies determined by the infrastructure rather than by users.
-->

服务部署和批处理管道通常是多维实体（例如，多个分区或部署，多个发布轨道，多层级，每层多个微服务）。管理通常需要横切操作，这破坏了严格层次表达的封装，尤其是由基础结构而非用户确定的刚性层次。

<!--
Example labels:
-->
标签示例：

   * `"release" : "stable"`, `"release" : "canary"`
   * `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
   * `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
   * `"partition" : "customerA"`, `"partition" : "customerB"`
   * `"track" : "daily"`, `"track" : "weekly"`

<!--
These are just examples of commonly used labels; you are free to develop your own conventions. Keep in mind that label Key must be unique for a given object.
-->

这些只是常用标签的示例；也可以自由制定自己的约定。切记，标签键对于对象必须是唯一的。

<!--
## Syntax and character set
-->
语法和字符集

<!--
_Labels_ are key/value pairs. Valid label keys have two segments: an optional prefix and name, separated by a slash (`/`). The name segment is required and must be 63 characters or less, beginning and ending with an alphanumeric character (`[a-z0-9A-Z]`) with dashes (`-`), underscores (`_`), dots (`.`), and alphanumerics between. The prefix is optional. If specified, the prefix must be a DNS subdomain: a series of DNS labels separated by dots (`.`), not longer than 253 characters in total, followed by a slash (`/`).
-->

_Labels_ 是键值对。有限的标签键分为两个部分：可选的前缀和名称，以斜杠（`/`）分隔。名称段是必填的，并且必须为 63 个字符或者更少，以字母数字字符（`[a-z0-9A-Z]`）开头和结尾，并带有破折号（`-`），下划线（`_`），点号（`.`）和之间的字母数字。前缀是可选的。如果指定，则前缀必须是 DNS 子域：一系列由点号（`.`）分隔的 DNS 标签，总计不超过 253 个字符，后面跟着斜杠（`/`）。

<!--
If the prefix is omitted, the label Key is presumed to be private to the user. Automated system components (e.g. `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl`, or other third-party automation) which add labels to end-user objects must specify a prefix.
-->

如果省略前缀，则假定标签键对用户是私有的。自动化系统组件（例如 `kube-scheduler`，`kube-controller-manager`，`kube-apiserver`，`kubectl`，或第三方自动化）添加标签到终端用户对象时必须制定一个前缀。

<!--
The `kubernetes.io/` and `k8s.io/` prefixes are reserved for Kubernetes core components.
-->

`kubernetes.io/` 和 `k8s.io/` 前缀保留给 Kubernetes 核心组件使用。

<!--
Valid label values must be 63 characters or less and must be empty or begin and end with an alphanumeric character (`[a-z0-9A-Z]`) with dashes (`-`), underscores (`_`), dots (`.`), and alphanumerics between.
-->

有限的标签值必须为 63 个字符或者更少，并且必须为空或以字母数字字符（`[a-z0-9A-Z]`）开头和结尾，并在其中以短划线（`-`），下划线（`_`），点号（`.`）和字母数字组成。

<!--
For example, here’s the configuration file for a Pod that has two labels `environment: production` and `app: nginx` :
-->

例如，下面是具有 `environment: production` 和 `app: nginx` 两个标签的 Pod 配置文件：

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
    image: nginx:1.7.9
    ports:
    - containerPort: 80

```

<!--
## Label selectors
-->

标签选择器

<!--
Unlike [names and UIDs](/docs/user-guide/identifiers), labels do not provide uniqueness. In general, we expect many objects to carry the same label(s).
-->

与[名称](/docs/user-guide/identifiers)不同，标签不提供唯一性。通常，我们希望许多对象带有相同的标签。

<!--
Via a _label selector_, the client/user can identify a set of objects. The label selector is the core grouping primitive in Kubernetes.
-->

通过_标签选择器_，客户端/用户可以识别一组对象。标签选择器是 Kubernetes 中的核心分组原语。

<!--
The API currently supports two types of selectors: _equality-based_ and _set-based_.
A label selector can be made of multiple _requirements_ which are comma-separated. In the case of multiple requirements, all must be satisfied so the comma separator acts as a logical _AND_ (`&&`) operator.
-->

目前，API 支持两种选择器：_基于等式_和_基于集合_。标签选择器可以由逗号分隔的多个_条件_组成。在有多个条件的情况下，必须满足所有条件，逗号分隔符相当于逻辑 _AND_ （`&&`）运算符。

<!--
The semantics of empty or non-specified selectors are dependent on the context,
and API types that use selectors should document the validity and meaning of
them.
-->

空的或者未指定选择器的语义取决于上下文，并且使用选择器的 API 类型应该记录它们的有效性和含义。

{{< note >}}
<!--
For some API types, such as ReplicaSets, the label selectors of two instances must not overlap within a namespace, or the controller can see that as conflicting instructions and fail to determine how many replicas should be present.
-->
对于某些 API 类型，比如 ReplicaSets，两个实例的标签选择器不得在命名空间内重叠，否则控制器将其视为冲突的指令，且无法确定应该存在多少个副本。
{{< /note >}}

<!--
### _Equality-based_ requirement
-->

### _基于等式_的条件

<!--
_Equality-_ or _inequality-based_ requirements allow filtering by label keys and values. Matching objects must satisfy all of the specified label constraints, though they may have additional labels as well.
Three kinds of operators are admitted `=`,`==`,`!=`. The first two represent _equality_ (and are simply synonyms), while the latter represents _inequality_. For example:
-->

_基于等式-_或者_基于不等式_条件求允许按照标签键和值进行过滤。匹配对象必须满足所有指定的标签约束，尽管它们可能具有其他标签。`=`，`==`，`!=`三种操作符可用。前两个代表_等式_（并且只是同义词），而后一个表示_不等式_。例如：

```
environment = production
tier != frontend
```

<!--
The former selects all resources with key equal to `environment` and value equal to `production`.
The latter selects all resources with key equal to `tier` and value distinct from `frontend`, and all resources with no labels with the `tier` key.
One could filter for resources in `production` excluding `frontend` using the comma operator: `environment=production,tier!=frontend`
-->

前者选择键等于 `environment` 且值等于 `production` 的所有资源。后者选择键等于 `tier` 且值不等于 `frontend` 的所有资源，以及所有不带有 `tier` 键的标签的资源。可以使用
逗号分隔的 `environment=production,tier!=frontend` 操作符来过滤键值为 `production` 不为 `frontend` 的资源。

<!--
One usage scenario for equality-based label requirement is for Pods to specify
node selection criteria. For example, the sample Pod below selects nodes with
the label "`accelerator=nvidia-tesla-p100`".
-->

基于等式的标签条件的一种使用场景是 Pods 指定节点选择标准。例如，下面的示例 Pod 选择带有标签 "`accelerator=nvidia-tesla-p100`"的节点。

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
-->

### _基于集合_的条件

<!--
_Set-based_ label requirements allow filtering keys according to a set of values. Three kinds of operators are supported: `in`,`notin` and `exists` (only the key identifier). For example:
-->

_基于集合_的标签条件允许根据一组值来过滤关键字。三种运算符被支持：`in`，`notin` 和 `exists`（仅适用于键标识符）。例如：

```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

<!--
The first example selects all resources with key equal to `environment` and value equal to `production` or `qa`.
The second example selects all resources with key equal to `tier` and values other than `frontend` and `backend`, and all resources with no labels with the `tier` key.
The third example selects all resources including a label with key `partition`; no values are checked.
The fourth example selects all resources without a label with key `partition`; no values are checked.
Similarly the comma separator acts as an _AND_ operator. So filtering resources with a `partition` key (no matter the value) and with `environment` different than  `qa` can be achieved using `partition,environment notin (qa)`.
The _set-based_ label selector is a general form of equality since `environment=production` is equivalent to `environment in (production)`; similarly for `!=` and `notin`.
-->

第一个示例选择键值等于 `environment` 且值等于 `production` 或 `qa` 的所有资源。第二个示例选择键等于 `tier` 且值不等于 `frontend` 和 `backend`，以及没有 `tier` 键标签的所有资源。第三个示例选择所有包括带有键为 `partition` 标签的资源，不检查键的值。第四个示例选择所有不带有 `partition` 键的标签的资源，不检查键的值。相似的，逗号分隔符相当于 _AND_ 运算符。因此，通过 `partition` 键（无论值如何）和 `environment` 键（值不为 `qa`）来过滤资源可以通过 `partition,environment notin (qa)`。_基于集合_的标签选择器与等式条件的选择器是同一般形式，因为 `environment=production` 等同于 `environment in (production)`；`!=` 和 `notin` 也类似。

<!--
_Set-based_ requirements can be mixed with _equality-based_ requirements. For example: `partition in (customerA, customerB),environment!=qa`.
-->

_基于集合_的条件可以与_基于等式_的条件进行混合。例如：`partition in (customerA, customerB),environment!=qa`。

## API

<!--
### LIST and WATCH filtering
-->

### LIST 和 WATCH 过滤

<!--
LIST and WATCH operations may specify label selectors to filter the sets of objects returned using a query parameter. Both requirements are permitted (presented here as they would appear in a URL query string):
-->

LIST 和 WATCH 操作可以指定标签选择器来过滤使用查询参数返回的对象集。下面两个条件都是允许的（在此处显示，它们将出现在 URL 查询字符串中）：

<!--
  * _equality-based_ requirements: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
  * _set-based_ requirements: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`
-->

  * _基于等式_ 的条件： `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
  * _基于集合_ 的条件： `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

<!--
Both label selector styles can be used to list or watch resources via a REST client. For example, targeting `apiserver` with `kubectl` and using _equality-based_ one may write:
-->

两种标签选择器都可用于通过 REST 客户端来列出或监视资源。例如，联合 `apiserver` 与 `kubectl` 并且使用_基于等式_条件的命令可以写成：

```shell
kubectl get pods -l environment=production,tier=frontend
```

<!--
or using _set-based_ requirements:
-->

或者使用_基于集合_的条件：

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

<!--
As already mentioned _set-based_ requirements are more expressive.  For instance, they can implement the _OR_ operator on values:
-->

如前所述，_基于集合_的条件更具有表现力。例如，它们可以在值上实现 _OR_ 运算符：

```shell
kubectl get pods -l 'environment in (production, qa)'
```

<!--
or restricting negative matching via _exists_ operator:
-->

或通过 _exists_ 运算符来限制否定匹配：

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```

<!--
### Set references in API objects
-->

### 在 API 对象中设置引用

<!--
Some Kubernetes objects, such as [`services`](/docs/user-guide/services) and [`replicationcontrollers`](/docs/user-guide/replication-controller), also use label selectors to specify sets of other resources, such as [pods](/docs/user-guide/pods).
-->

一些 Kubernetes 对象（例如 [`services`](/docs/user-guide/services) 和 [`replicationcontrollers`](/docs/user-guide/replication-controller)）还使用标签选择器来指定其他资源的集合，例如 [pods](/docs/user-guide/pods)。

<!--
#### Service and ReplicationController
-->

#### Service 和 ReplicationController

<!--
The set of pods that a `service` targets is defined with a label selector. Similarly, the population of pods that a `replicationcontroller` should manage is also defined with a label selector.
-->

`service` 使用标签选择器定义对应 pods 的集合。同样，`replicationcontroller` 应该管理的 pods 也是通过标签选择器来定义。

<!--
Labels selectors for both objects are defined in `json` or `yaml` files using maps, and only _equality-based_ requirement selectors are supported:
-->

标签选择器使用 maps 格式定义在 `json` 或 `yaml` 文件中，并且仅支持 _基于表达式_的条件选择器：

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

<!--
this selector (respectively in `json` or `yaml` format) is equivalent to `component=redis` or `component in (redis)`.
-->

此选择器（以 `json` 或 `yaml` 格式定义）等同于 `component=redis` 或者 `component in (redis)`。

<!--
#### Resources that support set-based requirements
-->

#### 支持基于集合条件的资源

<!--
Newer resources, such as [`Job`](/docs/concepts/jobs/run-to-completion-finite-workloads/), [`Deployment`](/docs/concepts/workloads/controllers/deployment/), [`Replica Set`](/docs/concepts/workloads/controllers/replicaset/), and [`Daemon Set`](/docs/concepts/workloads/controllers/daemonset/), support _set-based_ requirements as well.
-->

较新的资源，如 [`Job`](/docs/concepts/jobs/run-to-completion-finite-workloads/)，[`Deployment`](/docs/concepts/workloads/controllers/deployment/)，[`Replica Set`](/docs/concepts/workloads/controllers/replicaset/)，[`Replica Set`](/docs/concepts/workloads/controllers/replicaset/) 和 [`Daemon Set`](/docs/concepts/workloads/controllers/daemonset/)，都支持_基于集合_的条件。

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - {key: tier, operator: In, values: [cache]}
    - {key: environment, operator: NotIn, values: [dev]}
```

<!--
`matchLabels` is a map of `{key,value}` pairs. A single `{key,value}` in the `matchLabels` map is equivalent to an element of `matchExpressions`, whose `key` field is "key", the `operator` is "In", and the `values` array contains only "value". `matchExpressions` is a list of pod selector requirements. Valid operators include In, NotIn, Exists, and DoesNotExist. The values set must be non-empty in the case of In and NotIn. All of the requirements, from both `matchLabels` and `matchExpressions` are added together -- they must all be satisfied in order to match.
-->

`matchLabels` 是 `{key,value}` 形式的 map。`matchLabels` map 中的单个 `{key,value}` 相当于 `matchExpressions` 中的一个元素，`key` 字段是 "key"，`operator` 是 "In"，并且 `values` 数组仅包含 "value"。`matchExpressions` 是 pod 选择器条件的列表。有限的运算符包括 In，NotIn，Exists 和 DoesNotExist。对于 In 和 NotIn，值集不能为空。所有的条件，从 `matchLabels` 和 `matchExpressions` 组合在一起，必须全部满足才能匹配。

<!--
#### Selecting sets of nodes
-->

### 选择节点集

<!--
One use case for selecting over labels is to constrain the set of nodes onto which a pod can schedule.
See the documentation on [node selection](/docs/concepts/configuration/assign-pod-node/) for more information.
-->

用于选择标签的一个用例是约束 pod 可以调度到的节点集。有关更多信息，请参见 [node selection](/docs/concepts/configuration/assign-pod-node/) 文档。

{{% /capture %}}
