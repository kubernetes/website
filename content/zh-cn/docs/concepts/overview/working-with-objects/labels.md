---
title: 标签和选择算符
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
**标签（Labels）** 是附加到 Kubernetes
{{< glossary_tooltip text="对象" term_id="object" >}}（比如 Pod）上的键值对。
标签旨在用于指定对用户有意义且相关的对象的标识属性，但不直接对核心系统有语义含义。
标签可以用于组织和选择对象的子集。标签可以在创建时附加到对象，随后可以随时添加和修改。
每个对象都可以定义一组键/值标签。每个键对于给定对象必须是唯一的。

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
标签能够支持高效的查询和监听操作，对于用户界面和命令行是很理想的。
应使用[注解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)记录非识别信息。

<!-- body -->

<!--
## Motivation

Labels enable users to map their own organizational structures onto system objects
in a loosely coupled fashion, without requiring clients to store these mappings.
-->
## 动机   {#motivation}

标签使用户能够以松散耦合的方式将他们自己的组织结构映射到系统对象，而无需客户端存储这些映射。

<!--
Service deployments and batch processing pipelines are often multi-dimensional entities
(e.g., multiple partitions or deployments, multiple release tracks, multiple tiers,
multiple micro-services per tier). Management often requires cross-cutting operations,
which breaks encapsulation of strictly hierarchical representations, especially rigid
hierarchies determined by the infrastructure rather than by users.

Example labels:
-->
服务部署和批处理流水线通常是多维实体（例如，多个分区或部署、多个发行序列、多个层，每层多个微服务）。
管理通常需要交叉操作，这打破了严格的层次表示的封装，特别是由基础设施而不是用户确定的严格的层次结构。

示例标签：

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
有一些[常用标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/)的例子；你可以任意制定自己的约定。
请记住，标签的 Key 对于给定对象必须是唯一的。

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
## 语法和字符集   {#syntax-and-character-set}

**标签**是键值对。有效的标签键有两个段：可选的前缀和名称，用斜杠（`/`）分隔。
名称段是必需的，必须小于等于 63 个字符，以字母数字字符（`[a-z0-9A-Z]`）开头和结尾，
带有破折号（`-`），下划线（`_`），点（ `.`）和之间的字母数字。
前缀是可选的。如果指定，前缀必须是 DNS 子域：由点（`.`）分隔的一系列 DNS 标签，总共不超过 253 个字符，
后跟斜杠（`/`）。

如果省略前缀，则假定标签键对用户是私有的。
向最终用户对象添加标签的自动系统组件（例如 `kube-scheduler`、`kube-controller-manager`、
`kube-apiserver`、`kubectl` 或其他第三方自动化工具）必须指定前缀。

`kubernetes.io/` 和 `k8s.io/` 前缀是为 Kubernetes 核心组件[保留的](/zh-cn/docs/reference/labels-annotations-taints/)。

<!--
Valid label value:

* must be 63 characters or less (can be empty),
* unless empty, must begin and end with an alphanumeric character (`[a-z0-9A-Z]`),
* could contain dashes (`-`), underscores (`_`), dots (`.`), and alphanumerics between.
-->
有效标签值：

* 必须为 63 个字符或更少（可以为空）
* 除非标签值为空，必须以字母数字字符（`[a-z0-9A-Z]`）开头和结尾
* 包含破折号（`-`）、下划线（`_`）、点（`.`）和字母或数字

<!--
For example, here's a manifest for a Pod that has two labels
`environment: production` and `app: nginx`:
-->
例如，以下是一个清单 (manifest)，适用于具有 `environment: production` 和 `app: nginx` 这两个标签的 Pod：

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
## 标签选择算符   {#label-selectors}

与[名称和 UID](/zh-cn/docs/concepts/overview/working-with-objects/names/) 不同，
标签不支持唯一性。通常，我们希望许多对象携带相同的标签。

<!--
Via a _label selector_, the client/user can identify a set of objects.
The label selector is the core grouping primitive in Kubernetes.
-->
通过**标签选择算符**，客户端/用户可以识别一组对象。标签选择算符是 Kubernetes 中的核心分组原语。

<!--
The API currently supports two types of selectors: _equality-based_ and _set-based_.
A label selector can be made of multiple _requirements_ which are comma-separated.
In the case of multiple requirements, all must be satisfied so the comma separator
acts as a logical _AND_ (`&&`) operator.
-->
API 目前支持两种类型的选择算符：**基于等值的**和**基于集合的**。
标签选择算符可以由逗号分隔的多个**需求**组成。
在多个需求的情况下，必须满足所有要求，因此逗号分隔符充当逻辑**与**（`&&`）运算符。

<!--
The semantics of empty or non-specified selectors are dependent on the context,
and API types that use selectors should document the validity and meaning of
them.
-->
空标签选择算符或者未指定的选择算符的语义取决于上下文，
支持使用选择算符的 API 类别应该将算符的合法性和含义用文档记录下来。

{{< note >}}
<!--
For some API types, such as ReplicaSets, the label selectors of two instances must
not overlap within a namespace, or the controller can see that as conflicting
instructions and fail to determine how many replicas should be present.
-->
对于某些 API 类别（例如 ReplicaSet）而言，两个实例的标签选择算符不得在命名空间内重叠，
否则它们的控制器将互相冲突，无法确定应该存在的副本个数。
{{< /note >}}

{{< caution >}}
<!--
For both equality-based and set-based conditions there is no logical _OR_ (`||`) operator.
Ensure your filter statements are structured accordingly.
-->
对于基于等值的和基于集合的条件而言，不存在逻辑或（`||`）操作符。
你要确保你的过滤语句按合适的方式组织。
{{< /caution >}}

<!--
### _Equality-based_ requirement

_Equality-_ or _inequality-based_ requirements allow filtering by label keys and values.
Matching objects must satisfy all of the specified label constraints, though they may
have additional labels as well. Three kinds of operators are admitted `=`,`==`,`!=`.
The first two represent _equality_ (and are synonyms), while the latter represents _inequality_.
For example:
-->
### **基于等值的**需求

**基于等值**或**基于不等值**的需求允许按标签键和值进行过滤。
匹配对象必须满足所有指定的标签约束，尽管它们也可能具有其他标签。
可接受的运算符有 `=`、`==` 和 `!=` 三种。
前两个表示**相等**（并且是同义词），而后者表示**不相等**。例如：

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
前者选择所有资源，其键名等于 `environment`，值等于 `production`。
后者选择所有资源，其键名等于 `tier`，值不同于 `frontend`，所有资源都没有带有 `tier` 键的标签。
可以使用逗号运算符来过滤 `production` 环境中的非 `frontend` 层资源：`environment=production,tier!=frontend`。

<!--
One usage scenario for equality-based label requirement is for Pods to specify
node selection criteria. For example, the sample Pod below selects nodes where
the  `accelerator` label exists and is set to `nvidia-tesla-p100`.
-->
基于等值的标签要求的一种使用场景是 Pod 要指定节点选择标准。
例如，下面的示例 Pod 选择存在 `accelerator` 标签且值为 `nvidia-tesla-p100` 的节点。

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
### **基于集合**的需求

**基于集合**的标签需求允许你通过一组值来过滤键。
支持三种操作符：`in`、`notin` 和 `exists`（只可以用在键标识符上）。例如：

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

- 第一个示例选择了所有键等于 `environment` 并且值等于 `production` 或者 `qa` 的资源。
- 第二个示例选择了所有键等于 `tier` 并且值不等于 `frontend` 或者 `backend` 的资源，以及所有没有 `tier` 键标签的资源。
- 第三个示例选择了所有包含了有 `partition` 标签的资源；没有校验它的值。
- 第四个示例选择了所有没有 `partition` 标签的资源；没有校验它的值。

类似地，逗号分隔符充当**与**运算符。因此，使用 `partition` 键（无论为何值）和
`environment` 不同于 `qa` 来过滤资源可以使用 `partition, environment notin (qa)` 来实现。

<!--
The _set-based_ label selector is a general form of equality since
`environment=production` is equivalent to `environment in (production)`;
similarly for `!=` and `notin`.
-->
**基于集合**的标签选择算符是相等标签选择算符的一般形式，因为 `environment=production`
等同于 `environment in (production)`；`!=` 和 `notin` 也是类似的。

<!--
_Set-based_ requirements can be mixed with _equality-based_ requirements.
For example: `partition in (customerA, customerB),environment!=qa`.
-->
**基于集合**的要求可以与基于**相等**的要求混合使用。例如：`partition in (customerA, customerB),environment!=qa`。

## API

<!--
### LIST and WATCH filtering

LIST and WATCH operations may specify label selectors to filter the sets of objects
returned using a query parameter. Both requirements are permitted
(presented here as they would appear in a URL query string):
-->
### LIST 和 WATCH 过滤

LIST 和 WATCH 操作可以使用查询参数指定标签选择算符过滤一组对象。
两种需求都是允许的。（这里显示的是它们出现在 URL 查询字符串中）

<!--
* _equality-based_ requirements: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
* _set-based_ requirements: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`
-->
* **基于等值**的需求：`?labelSelector=environment%3Dproduction,tier%3Dfrontend`
* **基于集合**的需求：`?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

<!--
Both label selector styles can be used to list or watch resources via a REST client.
For example, targeting `apiserver` with `kubectl` and using _equality-based_ one may write:
-->
两种标签选择算符都可以通过 REST 客户端用于 list 或者 watch 资源。
例如，使用 `kubectl` 定位 `apiserver`，可以使用**基于等值**的标签选择算符可以这么写：


```shell
kubectl get pods -l environment=production,tier=frontend
```

<!--
or using _set-based_ requirements:
-->
或者使用**基于集合的**需求：

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

<!--
As already mentioned _set-based_ requirements are more expressive.
For instance, they can implement the _OR_ operator on values:
-->
正如刚才提到的，**基于集合**的需求更具有表达力。例如，它们可以实现值的**或**操作：

```shell
kubectl get pods -l 'environment in (production, qa)'
```

<!--
or restricting negative matching via _notin_ operator:
-->
或者通过**notin**运算符限制不匹配：

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
### 在 API 对象中设置引用

一些 Kubernetes 对象，例如 [`services`](/zh-cn/docs/concepts/services-networking/service/)
和 [`replicationcontrollers`](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/)，
也使用了标签选择算符去指定了其他资源的集合，例如
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

一个 `Service` 指向的一组 Pod 是由标签选择算符定义的。同样，一个 `ReplicationController`
应该管理的 Pod 的数量也是由标签选择算符定义的。

两个对象的标签选择算符都是在 `json` 或者 `yaml` 文件中使用映射定义的，并且只支持
**基于等值**需求的选择算符：

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
这个选择算符（分别在 `json` 或者 `yaml` 格式中）等价于 `component=redis` 或 `component in (redis)`。

<!--
#### Resources that support set-based requirements

Newer resources, such as [`Job`](/docs/concepts/workloads/controllers/job/),
[`Deployment`](/docs/concepts/workloads/controllers/deployment/),
[`ReplicaSet`](/docs/concepts/workloads/controllers/replicaset/), and
[`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/),
support _set-based_ requirements as well.
-->
#### 支持基于集合需求的资源

比较新的资源，例如 [`Job`](/zh-cn/docs/concepts/workloads/controllers/job/)、
[`Deployment`](/zh-cn/docs/concepts/workloads/controllers/deployment/)、
[`ReplicaSet`](/zh-cn/docs/concepts/workloads/controllers/replicaset/) 和
[`DaemonSet`](/zh-cn/docs/concepts/workloads/controllers/daemonset/)，
也支持**基于集合的**需求。

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

`matchLabels` 是由 `{key,value}` 对组成的映射。
`matchLabels` 映射中的单个 `{key,value}` 等同于 `matchExpressions` 的元素，
其 `key` 字段为 "key"，`operator` 为 "In"，而 `values` 数组仅包含 "value"。
`matchExpressions` 是 Pod 选择算符需求的列表。
有效的运算符包括 `In`、`NotIn`、`Exists` 和 `DoesNotExist`。
在 `In` 和 `NotIn` 的情况下，设置的值必须是非空的。
来自 `matchLabels` 和 `matchExpressions` 的所有要求都按逻辑与的关系组合到一起
-- 它们必须都满足才能匹配。

<!--
#### Selecting sets of nodes

One use case for selecting over labels is to constrain the set of nodes onto which
a pod can schedule. See the documentation on
[node selection](/docs/concepts/scheduling-eviction/assign-pod-node/) for more information.
-->
#### 选择节点集

通过标签进行选择的一个用例是确定节点集，方便 Pod 调度。
有关更多信息，请参阅[选择节点](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)文档。

<!--
## Using labels effectively

The examples we've used so far apply at most a single label to any resource. There are many
scenarios where multiple labels should be used to distinguish sets from one another.
-->
## 有效地使用标签  {#using-labels-effectively}

到目前为止我们使用的示例中的资源最多使用了一个标签。
在许多情况下，应使用多个标签来区分不同集合。

<!--
For instance, different applications would use different values for the `app` label, but a
multi-tier application, such as the [guestbook example](https://github.com/kubernetes/examples/tree/master/guestbook/),
would additionally need to distinguish each tier. The frontend could carry the following labels:
-->
例如，不同的应用可能会为 `app` 标签设置不同的值。
但是，类似 [guestbook 示例](https://github.com/kubernetes/examples/tree/master/guestbook/)
这样的多层应用，还需要区分每一层。前端可能会带有以下标签：

```yaml
labels:
  app: guestbook
  tier: frontend
```

<!--
while the Redis master and replica would have different `tier` labels, and perhaps even an
additional `role` label:
-->
Redis 的主从节点会有不同的 `tier` 标签，甚至还有一个额外的 `role` 标签：

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
标签使得我们能够按照所指定的任何维度对我们的资源进行切片和切块：

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
## 更新标签  {#updating-labels}

有时需要要在创建新资源之前对现有的 Pod 和其它资源重新打标签。
这可以用 `kubectl label` 完成。
例如，如果想要将所有 NGINX Pod 标记为前端层，运行：

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
首先用标签 "app=nginx" 过滤所有的 Pod，然后用 "tier=fe" 标记它们。
想要查看你刚设置了标签的 Pod，请运行：

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
此命令将输出所有 "app=nginx" 的 Pod，并有一个额外的描述 Pod 所在分层的标签列
（用参数 `-L` 或者 `--label-columns` 标明）。

想要了解更多信息，请参考[标签](/zh-cn/docs/concepts/overview/working-with-objects/labels/)和
[`kubectl label`](/docs/reference/generated/kubectl/kubectl-commands/#label)
命令文档。

## {{% heading "whatsnext" %}}

<!--
- Learn how to [add a label to a node](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)
- Find [Well-known labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)
- See [Recommended labels](/docs/concepts/overview/working-with-objects/common-labels/)
- [Enforce Pod Security Standards with Namespace Labels](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)
- Read a blog on [Writing a Controller for Pod Labels](/blog/2021/06/21/writing-a-controller-for-pod-labels/)
-->
- 学习如何[给节点添加标签](/zh-cn/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node)
- 查阅[众所周知的标签、注解和污点](/zh-cn/docs/reference/labels-annotations-taints/)
- 参见[推荐使用的标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/)
- [使用名字空间标签来实施 Pod 安全性标准](/zh-cn/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/)
- 阅读[为 Pod 标签编写控制器](/blog/2021/06/21/writing-a-controller-for-pod-labels/)的博文
