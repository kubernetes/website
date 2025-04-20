---
title: Admission Webhook 良好实践
description: >
  在 Kubernetes 中设计和部署 Admission Webhook 的建议。
content_type: concept
weight: 60
---
<!--
title: Admission Webhook Good Practices
description: >
  Recommendations for designing and deploying admission webhooks in Kubernetes.
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
This page provides good practices and considerations when designing
_admission webhooks_ in Kubernetes. This information is intended for
cluster operators who run admission webhook servers or third-party applications
that modify or validate your API requests.

Before reading this page, ensure that you're familiar with the following
concepts:

* [Admission controllers](/docs/reference/access-authn-authz/admission-controllers/)
* [Admission webhooks](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
-->
本页面提供了在 Kubernetes 中设计 **Admission Webhook** 时的良好实践和注意事项。
此信息适用于运行准入 Webhook 服务器或第三方应用程序的集群操作员，
这些程序用于修改或验证你的 API 请求。

在阅读本页之前，请确保你熟悉以下概念：

* [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
* [准入 Webhook](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)

<!-- body -->

<!--
## Importance of good webhook design {#why-good-webhook-design-matters}

Admission control occurs when any create, update, or delete request
is sent to the Kubernetes API. Admission controllers intercept requests that
match specific criteria that you define. These requests are then sent to
mutating admission webhooks or validating admission webhooks. These webhooks are
often written to ensure that specific fields in object specifications exist or
have specific allowed values.
-->
## 良好的 Webhook 设计的重要性   {#why-good-webhook-design-matters}

当任何创建、更新或删除请求发送到 Kubernetes API 时，就会发生准入控制。
准入控制器会拦截符合你定义的特定条件的请求。然后，这些请求会被发送到变更准入 Webhook（Mutating Admission Webhook）
或验证准入 Webhook（Validating Admission Webhook）。这些 Webhook 通常用于确保对象规范中的特定字段存在或具有特定允许值。

<!--
Webhooks are a powerful mechanism to extend the Kubernetes API. Badly-designed
webhooks often result in workload disruptions because of how much control
the webhooks have over objects in the cluster. Like other API extension
mechanisms, webhooks are challenging to test at scale for compatibility with
all of your workloads, other webhooks, add-ons, and plugins. 
-->
Webhook 是扩展 Kubernetes API 的强大机制。设计不良的 Webhook 由于对集群中对象具有很大的控制权，
常常会导致工作负载中断。与其他 API 扩展机制一样，对 Webhook 与所有工作负载、其他
Webhook、插件及附加组件的兼容性进行大规模测试是一个挑战。

<!--
Additionally, with every release, Kubernetes adds or modifies the API with new
features, feature promotions to beta or stable status, and deprecations. Even
stable Kubernetes APIs are likely to change. For example, the `Pod` API changed
in v1.29 to add the
[Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) feature.
While it's rare for a Kubernetes object to enter a broken state because of a new
Kubernetes API, webhooks that worked as expected with earlier versions of an API
might not be able to reconcile more recent changes to that API. This can result
in unexpected behavior after you upgrade your clusters to newer versions.
-->
此外，随着每个版本的发布，Kubernetes 会通过新增特性、将特性提升为测试版或稳定版以及弃用旧特性来添加或修改 API。
即使是稳定的 Kubernetes API 也可能会发生变化。例如，在 v1.29 中，`Pod` API 发生了变化，
以添加 [Sidecar 容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)特性。
虽然因为新的 Kubernetes API 导致 Kubernetes 对象进入损坏状态的情况很少见，
但那些在早期 API 版本中正常工作的 Webhook 可能无法适配该 API 的最新更改。
这可能会导致在你将集群升级到较新版本后出现意外行为。

<!--
This page describes common webhook failure scenarios and how to avoid them by
cautiously and thoughtfully designing and implementing your webhooks. 
-->
本页面描述了常见的 Webhook 失败场景，以及如何通过谨慎和周到地设计与实现你的
Webhook 来避免这些问题。

<!--
## Identify whether you use admission webhooks {#identify-admission-webhooks}

Even if you don't run your own admission webhooks, some third-party applications
that you run in your clusters might use mutating or validating admission
webhooks.

To check whether your cluster has any mutating admission webhooks, run the
following command:
-->
## 识别是否使用 Admission Webhook   {#identify-admission-webhooks}

即使你没有运行自己的 Admission Webhook，
你在集群中运行的一些第三方应用程序也可能使用变更或验证准入 Webhook。

要检查你的集群是否存在变更性质的准入 Webhook，请运行以下命令：

```shell
kubectl get mutatingwebhookconfigurations
```

<!---
The output lists any mutating admission controllers in the cluster. 

To check whether your cluster has any validating admission webhooks, run the
following command:
-->
输出列出了集群中的所有变更准入控制器。

要检查你的集群是否存在验证性质的准入 Webhook，运行以下命令：

```shell
kubectl get validatingwebhookconfigurations
```

<!---
The output lists any validating admission controllers in the cluster. 
-->
输出列出了集群中的所有验证性质准入控制器。

<!---
## Choose an admission control mechanism {#choose-admission-mechanism}

Kubernetes includes multiple admission control and policy enforcement options.
Knowing when to use a specific option can help you to improve latency and
performance, reduce management overhead, and avoid issues during version
upgrades. The following table describes the mechanisms that let you mutate or
validate resources during admission:
-->
## 选择准入控制机制 {#choose-admission-mechanism}

Kubernetes 包含多个准入控制和策略执行选项。知道何时使用特定选项可以帮助你改善延迟和性能，
减少管理开销，并避免版本升级期间的问题。下表中描述的是你可以在准入时变更或验证资源的一些机制：

<!-- This table is HTML because it uses unordered lists for readability. -->

<table>
  <caption><!--Mutating and validating admission control in Kubernetes-->Kubernetes 中的变更和验证准入控制</caption>
  <thead>
    <tr>
      <th><!--Mechanism-->机制</th>
      <th><!--Description-->描述</th>
      <th><!--Use cases-->使用场景</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/"><!--Mutating admission policy-->变更性准入策略</a></td>
      <td>
        <!--
        Intercept API requests before admission and modify as needed using
        custom logic.
        -->
        在准入前拦截 API 请求，并使用通用表达式语言（CEL）表达式进行必要的修改。
      </td>
      <td><ul>
        <li>
          <!--
          Make critical modifications that must happen before resource
          admission.
          -->
          执行资源准入前必须发生的关键修改。
          </li>
        <li>
          <!--
          Make complex modifications that require advanced logic, like calling
          external APIs.
          -->
          执行需要高级逻辑的复杂修改，例如调用外部 API。
          </li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/zh-cn/docs/reference/access-authn-authz/mutating-admission-policy/"><!--Mutating admission policy-->变更性准入策略</a></td>
      <td>
        <!--
        Intercept API requests before admission and modify as needed using
        Common Expression Language (CEL) expressions.
        -->
        在准入前拦截 API 请求，并使用通用表达式语言（CEL）表达式进行必要的修改。
      </td>
      <td><ul>
        <li>
          <!--
         Make critical modifications that must happen before resource
          admission.
          -->
          执行资源准入前必须发生的关键修改。
        </li>
        <li>
        <!--
        Make simple modifications, such as adjusting labels or replica
        counts.
        -->
          执行简单的修改，例如调整标签或副本数量。
        </li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/"><!--Validating admission webhook-->验证性准入策略</a></td>
      <td>
        <!--
        Intercept API requests before admission and validate against complex
        policy declarations.
        -->
        在准入前拦截 API 请求，并根据复杂的策略声明进行验证。
      </td>
      <td><ul>
        <li><!--Validate critical configurations before resource admission.-->在资源准入前验证关键配置。</li>
        <li><!--Enforce complex policy logic before admission.-->在准入前执行复杂的策略逻辑。</li>
      </ul></td>
    </tr>
    <tr>
      <td><a href="/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/"><!--Validating admission policy-->验证性准入策略</a></td>
      <td>
        <!--
        Intercept API requests before admission and validate against CEL
        expressions.
        -->
        在准入前拦截 API 请求，并根据通用表达式语言（CEL）表达式进行验证。
      </td>
      <td><ul>
        <li><!--Validate critical configurations before resource admission.-->在资源准入前验证关键配置。</li>
        <li><!--Enforce policy logic using CEL expressions.-->使用 CEL 表达式执行策略逻辑。</li>
      </ul></td>
    </tr>
  </tbody>
</table>

<!--
In general, use _webhook_ admission control when you want an extensible way to
declare or configure the logic. Use built-in CEL-based admission control when
you want to declare simpler logic without the overhead of running a webhook
server. The Kubernetes project recommends that you use CEL-based admission
control when possible.
-->
一般来说，当你希望以可扩展的方式声明或配置逻辑时，可以使用 **Webhook** 准入控制。
当你希望声明更简单的逻辑而无需运行 Webhook 服务器的开销时，可以使用基于 CEL
的内置准入控制。Kubernetes 项目建议在可能的情况下使用基于 CEL 的准入控制。

<!--
### Use built-in validation and defaulting for CustomResourceDefinitions {#no-crd-validation-defaulting}

If you use
{{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}},
don't use admission webhooks to validate values in CustomResource specifications
or to set default values for fields. Kubernetes lets you define validation rules
and default field values when you create CustomResourceDefinitions.

To learn more, see the following resources:

* [Validation rules](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
* [Defaulting](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting)
-->
### 为 CustomResourceDefinitions 使用内置验证和默认值 {#no-crd-validation-defaulting}

如果你使用 {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}}，
请勿使用准入 Webhook 来验证 CustomResource 规约中的值，或者为其中的字段设置默认值。
Kubernetes 允许你在创建 CustomResourceDefinitions 时定义验证规则和字段的默认值。

要了解更多，请参阅以下资源：

* [验证规则](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)
* [默认值](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#defaulting)

<!--
## Performance and latency {#performance-latency}

This section describes recommendations for improving performance and reducing
latency. In summary, these are as follows:

* Consolidate webhooks and limit the number of API calls per webhook.
* Use audit logs to check for webhooks that repeatedly do the same action.
* Use load balancing for webhook availability.
* Set a small timeout value for each webhook.
* Consider cluster availability needs during webhook design.
-->
## 性能和延迟   {#performance-latency}

本节描述的是一些可以提高性能和减少延迟的建议。总结如下：

* 整合 Webhook 并限制每个 Webhook 的 API 调用次数。
* 使用审计日志检查反复执行相同操作的 Webhook。
* 使用负载均衡确保 Webhook 的可用性。
* 为每个 Webhook 设置较小的超时值。
* 在设计 Webhook 时考虑集群的可用性需求。

<!--
### Design admission webhooks for low latency {#design-admission-webhooks-low-latency}

Mutating admission webhooks are called in sequence. Depending on the mutating
webhook setup, some webhooks might be called multiple times. Every mutating
webhook call adds latency to the admission process. This is unlike validating
webhooks, which get called in parallel. 

When designing your mutating webhooks, consider your latency requirements and
tolerance. The more mutating webhooks there are in your cluster, the greater the
chance of latency increases. 
-->
### 设计低延迟的准入 Webhook   {#design-admission-webhooks-low-latency}

变更性质的准入 Webhook 是按顺序调用的。根据变更性质 Webhook 的设置，某些 Webhook
可能会被多次调用。对变更性质的 Webhook 的每次调用都会增加准入过程的延迟。
这一点与验证性质的 Webhook 不同，验证性质的 Webhook 是被并行调用的。

在设计你的变更性质 Webhook 时，请考虑你的延迟要求和容忍度。集群中的变更性 Webhook 越多，
延迟增加的可能性就越大。

<!--
Consider the following to reduce latency:

* Consolidate webhooks that perform a similar mutation on different objects.
* Reduce the number of API calls made in the mutating webhook server logic.
* Limit the match conditions of each mutating webhook to reduce how many
  webhooks are triggered by a specific API request.
* Consolidate small webhooks into one server and configuration to help with
  ordering and organization.
-->
考虑以下措施以减少延迟：

* 整合对不同对象执行类似变更的 Webhook。
* 减少变更性质 Webhook 服务器逻辑中进行的 API 调用次数。
* 限制每个变更性质 Webhook 对应的匹配条件，以减少特定 API 请求所触发的 Webhook 数量。
* 将多个小型的 Webhook 整合到一个服务器和配置中，以帮助进行排序和组织。

<!--
### Prevent loops caused by competing controllers {#prevent-loops-competing-controllers}

Consider any other components that run in your cluster that might conflict with
the mutations that your webhook makes. For example, if your webhook adds a label
that a different controller removes, your webhook gets called again. This leads
to a loop.

To detect these loops, try the following:
-->
### 防止由相互竞争的控制器所引起的循环处理   {#prevent-loops-competing-controllers}

考虑集群中运行的其他可能与你的 Webhook 所做的变更发生冲突的组件。例如，如果你的
Webhook 要添加某个标签，而另一个控制器要删除该标签，那么你的 Webhook
会被再次调用，从而导致循环处理。

要检测这些循环，可以尝试以下方法：

<!--
1.  Update your cluster audit policy to log audit events. Use the following
    parameters:
    
      * `level`: `RequestResponse`
      * `verbs`: `["patch"]`
      * `omitStages`: `RequestReceived`

    Set the audit rule to create events for the specific resources that your
    webhook mutates.

1.  Check your audit events for webhooks being reinvoked multiple times with the
    same patch being applied to the same object, or for an object having
    a field updated and reverted multiple times.
-->
1. 更新集群的审计策略以记录审计事件。使用以下参数：

   * `level`: `RequestResponse`
   * `verbs`: `["patch"]`
   * `omitStages`: `RequestReceived`

   设置审计规则，为你的 Webhook 所变更的特定资源创建事件。

1. 检查审计事件，查看是否有 Webhook 被多次重新调用并应用了相同的补丁到同一个对象的情况，
   或者某个对象的字段被多次更新和回滚的情况。

<!--
### Set a small timeout value {#small-timeout}

Admission webhooks should evaluate as quickly as possible (typically in
milliseconds), since they add to API request latency. Use a small timeout for
webhooks.

For details, see
[Timeouts](/docs/reference/access-authn-authz/extensible-admission-controllers/#timeouts).
-->
### 设置较小的超时值   {#small-timeout}

准入性质的 Webhook 应尽可能快速评估（通常在毫秒级别），因为它们会增加 API 请求的延迟。
为 Webhook 设置较小的超时值。

更多详细信息，请参见[超时](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#timeouts)。

<!--
### Use a load balancer to ensure webhook availability {#load-balancer-webhook}

Admission webhooks should leverage some form of load-balancing to provide high
availability and performance benefits. If a webhook is running within the
cluster, you can run multiple webhook backends behind a Service of type
`ClusterIP`.
-->
### 使用负载均衡器确保 Webhook 可用性   {#load-balancer-webhook}

准入性质的 Webhook 应该利用某种形式的负载均衡来提供高可用性和性能优势。
如果 Webhook 在集群内运行，你可以在类型为 `ClusterIP` 的服务后面运行多个 Webhook 后端。

这样可以确保请求被均匀分配到不同的后端实例上，提高处理能力和可靠性。

<!--
### Use a high-availability deployment model {#ha-deployment}

Consider your cluster's availability requirements when designing your webhook. 
For example, during node downtime or zonal outages, Kubernetes marks Pods as
`NotReady` to allow load balancers to reroute traffic to available zones and
nodes. These updates to Pods might trigger your mutating webhooks. Depending on
the number of affected Pods, the mutating webhook server has a risk of timing
out or causing delays in Pod processing. As a result, traffic won't get
rerouted as quickly as you need.

Consider situations like the preceding example when writing your webhooks.
Exclude operations that are a result of Kubernetes responding to unavoidable
incidents.
-->
### 使用高可用部署模型    {#ha-deployment}

在设计 Webhook 时，请考虑集群的可用性需求。例如，在节点停机或可用区中断期间，
Kubernetes 会将一些 Pod 标记为 `NotReady`，以便负载均衡器可以将流量重新路由到可用的可用区和节点。
这些对 Pod 的更新可能会触发你的变更性 Webhook。取决于受影响 Pod 的数量，变更性 Webhook
服务器有超时或导致 Pod 处理延迟的风险。结果是，流量不会像你所需要的那样被快速地重新路由。

在编写 Webhook 时，请考虑上述示例中的情况。排除那些由 Kubernetes
为响应不可避免的事件所执行的操作。

<!--
## Request filtering {#request-filtering}

This section provides recommendations for filtering which requests trigger
specific webhooks. In summary, these are as follows:

* Limit the webhook scope to avoid system components and read-only requests.
* Limit webhooks to specific namespaces.
* Use match conditions to perform fine-grained request filtering.
* Match all versions of an object.
-->
## 请求过滤   {#request-filtering}

本节提供关于过滤哪些请求以触发特定 Webhook 的建议。总结如下：

* 限制 Webhook 的作用范围，避免处理系统组件和只读请求。
* 将 Webhook 限制到特定的名字空间。
* 使用匹配条件执行细粒度的请求过滤。
* 匹配对象的所有版本。

<!--
### Limit the scope of each webhook {#webhook-limit-scope}

Admission webhooks are only called when an API request matches the corresponding
webhook configuration. Limit the scope of each webhook to reduce unnecessary
calls to the webhook server. Consider the following scope limitations:
-->
### 限制每个 Webhook 的作用范围 {#webhook-limit-scope}

准入性质的 Webhook 仅在 API 请求与相应的 Webhook 配置匹配时才会被调用。
限制每个 Webhook 的作用范围，以减少对 Webhook 服务器的不必要调用。
考虑以下作用范围限制：

<!--
* Avoid matching objects in the `kube-system` namespace. If you run your own
  Pods in the `kube-system` namespace, use an
  [`objectSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector)
  to avoid mutating a critical workload.
* Don't mutate node leases, which exist as Lease objects in the
  `kube-node-lease` system namespace. Mutating node leases might result in
  failed node upgrades. Only apply validation controls to Lease objects in this
  namespace if you're confident that the controls won't put your cluster at
  risk.
* Don't mutate TokenReview or SubjectAccessReview objects. These are always
  read-only requests. Modifying these objects might break your cluster.
* Limit each webhook to a specific namespace by using a
  [`namespaceSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector).
-->
* 避免匹配 `kube-system` 命名空间中的对象。如果你在 `kube-system`
  名字空间中运行自己的 Pod，请使用
  [`objectSelector`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector)
  来避免对关键工作负载进行变更。
* 不要对节点租约（Node Leases）进行变更，这些租约以 Lease 对象的形式存在于
  `kube-node-lease` 系统命名空间中。对节点租约进行变更可能会导致节点升级失败。
  只有在你确信验证控制不会对集群造成风险时，才对这个命名空间中的 Lease 对象应用验证规则。
* 不要对 TokenReview 或 SubjectAccessReview 对象进行变更。这些始终是只读请求。
  修改这些对象可能会破坏你的集群。
* 使用 [`namespaceSelector`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)
  将每个 Webhook 限制到特定的名字空间上。

<!--
### Filter for specific requests by using match conditions {#filter-match-conditions}

Admission controllers support multiple fields that you can use to match requests
that meet specific criteria. For example, you can use a `namespaceSelector` to
filter for requests that target a specific namespace.
-->
### 使用匹配条件过滤特定请求   {#filter-match-conditions}

准入控制器允许你使用多个字段来匹配符合特定条件的请求。例如，
你可以使用 `namespaceSelector` 来过滤针对特定命名空间的请求。

<!--
For more fine-grained request filtering, use the `matchConditions` field in your
webhook configuration. This field lets you write multiple CEL expressions that
must evaluate to `true` for a request to trigger your admission webhook. Using
`matchConditions` might significantly reduce the number of calls to your webhook
server.

For details, see
[Matching requests: `matchConditions`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchconditions).
-->
为了实现更细粒度的请求过滤，可以在 Webhook 配置中使用 `matchConditions` 字段。
该字段允许你编写多个 CEL 表达式，只有当这些表达式都评估为 `true` 时，
请求才会触发你的准入 Webhook。使用 `matchConditions` 可能会显著减少对
Webhook 服务器的调用次数。

更多详细信息，请参见[匹配请求：`matchConditions`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchconditions)。

<!--
### Match all versions of an API {#match-all-versions}

By default, admission webhooks run on any API versions that affect a specified
resource. The `matchPolicy` field in the webhook configuration controls this
behavior. Specify a value of `Equivalent` in the `matchPolicy` field or omit
the field to allow the webhook to run on any API version. 

For details, see
[Matching requests: `matchPolicy`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy).
-->
### 匹配 API 的所有版本 {#match-all-versions}

默认情况下，系统会针对针对影响指定资源的所有 API 版本运行准入 Webhook。Webhook
配置中的 `matchPolicy` 字段控制此行为。在 `matchPolicy` 字段中指定值为
`Equivalent` 或省略该字段，以允许 Webhook 对所有 API 版本起作用。

更多详细信息，请参见[匹配请求：`matchPolicy`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy)。

<!--
## Mutation scope and field considerations {#mutation-scope-considerations}

This section provides recommendations for the scope of mutations and any special
considerations for object fields. In summary, these are as follows:

* Patch only the fields that you need to patch.
* Don't overwrite array values.
* Avoid side effects in mutations when possible.
* Avoid self-mutations.
* Fail open and validate the final state.
* Plan for future field updates in later versions.
* Prevent webhooks from self-triggering.
* Don't change immutable objects.
-->
## 变更范围和字段注意事项    {#mutation-scope-considerations}

本节提供关于变更范围和对象字段特殊考虑的建议。总结如下：

* 仅修补需要修补的字段。
* 不要覆盖数组值。
* 尽可能避免在变更中产生副作用。
* 避免自我变更。
* 以开放的形式失败并验证最终状态。
* 为未来版本中对字段执行变更作规划。
* 防止 Webhook 自我触发。
* 不要更改不可变更的对象。

<!--
### Patch only required fields {#patch-required-fields}

Admission webhook servers send HTTP responses to indicate what to do with a
specific Kubernetes API request. This response is an AdmissionReview object.
A mutating webhook can add specific fields to mutate before allowing admission
by using the `patchType` field and the `patch` field in the response. Ensure
that you only modify the fields that require a change. 
-->
### 仅修补必要的字段   {#patch-required-fields}

准入 Webhook 服务器发送 HTTP 响应来指示如何处理特定的 Kubernetes API 请求。
此响应是一个 AdmissionReview 对象。通过使用响应中的 `patchType` 字段和 `patch` 字段，
变更性 Webhook 可以添加具体的字段进行变更，之后才允许准入。确保你仅修改需要更改的字段。

<!--
For example, consider a mutating webhook that's configured to ensure that
`web-server` Deployments have at least three replicas. When a request to
create a Deployment object matches your webhook configuration, the webhook
should only update the value in the `spec.replicas` field.
-->
例如，考虑一个配置为确保 `web-server` 部署至少具有三个副本的变更性质 Webhook。
当创建 Deployment 对象的某个请求与你的 Webhook 配置匹配时，Webhook
应仅更新 `spec.replicas` 字段中的值。

<!--
### Don't overwrite array values {#dont-overwrite-arrays}

Fields in Kubernetes object specifications might include arrays. Some arrays
contain key:value pairs (like the `envVar` field in a container specification),
while other arrays are unkeyed (like the `readinessGates` field in a Pod
specification). The order of values in an array field might matter in some
situations. For example, the order of arguments in the `args` field of a
container specification might affect the container. 

Consider the following when modifying arrays:
-->
### 不要覆盖数组值   {#dont-overwrite-arrays}

Kubernetes 对象规约中的字段可能包含数组。有些数组包含键值对
（如容器规约中的 `envVar` 字段），而其他数组则没有键（如 Pod 规约中的 `readinessGates` 字段）。
在某些情况下，数组字段中值的顺序可能很重要。例如，容器规约中 `args`
字段的参数顺序可能会影响容器。

在修改数组时，要考虑以下几点：

<!--
* Whenever possible, use the `add` JSONPatch operation instead of `replace` to
  avoid accidentally replacing a required value.
* Treat arrays that don't use key:value pairs as sets.
* Ensure that the values in the field that you modify aren't required to be
  in a specific order. 
* Don't overwrite existing key:value pairs unless absolutely necessary.
* Use caution when modifying label fields. An accidental modification might
  cause label selectors to break, resulting in unintended behavior.
-->
* 尽可能使用 `add` JSONPatch 操作，而不是 `replace`，以避免意外替换掉必需的值。
* 将不使用键值对的数组视为集合来处理。
* 确保你所要修改的字段中的值不需要特定的顺序。
* 除非绝对必要，否则不要覆盖现有的键值对。
* 在修改标签字段时要小心。意外的修改可能会导致标签选择器失效，从而引发意外行为。

<!--
### Avoid side effects {#avoid-side-effects}

Ensure that your webhooks operate only on the content of the AdmissionReview
that's sent to them, and do not make out-of-band changes. These additional
changes, called _side effects_, might cause conflicts during admission if they
aren't reconciled properly. The `.webhooks[].sideEffects` field should
be set to `None` if a webhook doesn't have any side effect. 
-->
### 避免副作用   {#avoid-side-effects}

确保你的 Webhook 仅操作发送给它们的 AdmissionReview 内容，
而不进行带外更改。这些额外的更改（称为“副作用”）如果未妥善协调，
可能会在准入期间引发冲突。如果 Webhook 没有任何副作用，则应将
`.webhooks[].sideEffects` 字段设置为 `None`。

<!--
If side effects are required during the admission evaluation, they must be
suppressed when processing an AdmissionReview object with `dryRun` set to
`true`, and the `.webhooks[].sideEffects` field should be set to `NoneOnDryRun`.

For details, see
[Side effects](/docs/reference/access-authn-authz/extensible-admission-controllers/#side-effects).
-->
如果在准入评估期间需要副作用，则必须在处理 `dryRun` 设置为 `true`
的 AdmissionReview 对象时抑制这些副作用，并且应将 `.webhooks[].sideEffects`
字段设置为 `NoneOnDryRun`。

更多详细信息，请参见[副作用](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#side-effects)。

<!--
### Avoid self-mutations {#avoid-self-mutation}

A webhook running inside the cluster might cause deadlocks for its own
deployment if it is configured to intercept resources required to start its own
Pods.

For example, a mutating admission webhook is configured to admit **create** Pod
requests only if a certain label is set in the Pod (such as `env: prod`).
The webhook server runs in a Deployment that doesn't set the `env` label.
-->
### 避免自我变更   {#avoid-self-mutation}

在集群内运行的 Webhook 可能会因为其自身的部署拦截了启动自身 Pod
所需的资源而导致死锁。

例如，你可能配置了一个变更性质的准入 Webhook，仅当 Pod 中设置了特定标签（如 `env: prod`）时才允许**创建**
Pod 请求，而 Webhook 服务器却运行在一个没有设置 `env` 标签的 Deployment 中。

<!--
When a node that runs the webhook server Pods becomes unhealthy, the webhook
Deployment tries to reschedule the Pods to another node. However, the existing
webhook server rejects the requests since the `env` label is unset. As a
result, the migration cannot happen.

Exclude the namespace where your webhook is running with a
[`namespaceSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector).
-->
当运行 Webhook 服务器 Pod 的节点变得不健康时，Webhook 的 Deployment
会尝试将这些 Pod 重新调度到另一个节点。然而，由于 `env` 标签未设置，
现有的 Webhook 服务器会拒绝这些请求。结果是，迁移无法完成。

通过 [`namespaceSelector`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)
排除运行 Webhook 的命名空间，以避免此问题。

<!--
### Avoid dependency loops {#avoid-dependency-loops}

Dependency loops can occur in scenarios like the following:

* Two webhooks check each other's Pods. If both webhooks become unavailable
  at the same time, neither webhook can start.
* Your webhook intercepts cluster add-on components, such as networking plugins
  or storage plugins, that your webhook depends on. If both the webhook and the
  dependent add-on become unavailable, neither component can function.
-->
### 避免依赖循环   {#avoid-dependency-loops}

依赖循环可能在如下场景中发生：

* 两个 Webhook 相互检查对方的 Pod。如果这两个 Webhook 同时变得不可用，
  那么任何一个 Webhook 都无法启动。
* 你的 Webhook 拦截了集群插件组件（如网络插件或存储插件），而这些插件是
  Webhook 所依赖的。如果 Webhook 和依赖的插件同时变得不可用，则两个组件都无法正常工作。

<!--
To avoid these dependency loops, try the following:

* Use
  [ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/)
  to avoid introducing dependencies.
* Prevent webhooks from validating or mutating other webhooks. Consider
  [excluding specific namespaces](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)
  from triggering your webhook.
* Prevent your webhooks from acting on dependent add-ons by using an
  [`objectSelector`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector).
-->
为了避免这种循环依赖，可以尝试以下方法：

* 使用[验证准入策略](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)以避免引入依赖关系。
* 避免让一个 Webhook 验证或变更其他 Webhook。
  考虑[排除特定命名空间](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-namespaceselector)，
  使其不触发你的 Webhook。
* 通过使用
  [`objectSelector`](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-objectselector)，
  防止你的 Webhook 对依赖的插件进行操作。

<!---
### Fail open and validate the final state {#fail-open-validate-final-state}

Mutating admission webhooks support the `failurePolicy` configuration field.
This field indicates whether the API server should admit or reject the request
if the webhook fails. Webhook failures might occur because of timeouts or errors
in the server logic.

By default, admission webhooks set the `failurePolicy` field to Fail. The API
server rejects a request if the webhook fails. However, rejecting requests by
default might result in compliant requests being rejected during webhook
downtime. 
-->
### 失败时开放并验证最终状态   {#fail-open-validate-final-state}

变更性质的准入 Webhook 支持 `failurePolicy` 配置字段。此字段指示如果 Webhook
失败，API 服务器是应允许还是拒绝请求。Webhook 失败可能是由于超时或服务器逻辑中的错误造成的。

默认情况下，准入 Webhook 将 `failurePolicy` 字段设置为 `Fail`。
如果 Webhook 失败，API 服务器将拒绝该请求。然而，默认情况下拒绝请求可能会导致在
Webhook 停机期间合规的请求也被拒绝。

<!--
Let your mutating webhooks "fail open" by setting the `failurePolicy` field to
Ignore. Use a validating controller to check the state of requests to ensure
that they comply with your policies. 

This approach has the following benefits:

* Mutating webhook downtime doesn't affect compliant resources from deploying.
* Policy enforcement occurs during validating admission control.
* Mutating webhooks don't interfere with other controllers in the cluster.
-->
通过将 `failurePolicy` 字段设置为 `Ignore`，可以让你的变更性质 Webhook 在失败时更为“开放”。
使用验证控制器检查请求的状态，确保它们符合你的策略。

这种方法有以下好处：

* 变更性 Webhook 的停机不会影响合规资源的部署。
* 策略执行发生在验证准入控制阶段。
* 变更性 Webhooks 不会干扰集群中的其他控制器。

<!--
### Plan for future updates to fields {#plan-future-field-updates}

In general, design your webhooks under the assumption that Kubernetes APIs might
change in a later version. Don't write a server that takes the stability of an
API for granted. For example, the release of sidecar containers in Kubernetes
added a `restartPolicy` field to the Pod API. 
-->
### 为未来的字段更新做计划 {#plan-future-field-updates}

通常，在设计 Webhook 时应假设 Kubernetes API 可能在后续版本中会发生变化。
不要编写一个理所当然地认为某个 API 是稳定的服务器。例如，Kubernetes 中 Sidecar
容器的发布为 Pod API 添加了一个 `restartPolicy` 字段。

<!--
### Prevent your webhook from triggering itself {#prevent-webhook-self-trigger}

Mutating webhooks that respond to a broad range of API requests might
unintentionally trigger themselves. For example, consider a webhook that
responds to all requests in the cluster. If you configure the webhook to create
Event objects for every mutation, it'll respond to its own Event object
creation requests.

To avoid this, consider setting a unique label in any resources that your
webhook creates. Exclude this label from your webhook match conditions.
-->
### 防止 Webhook 自我触发 {#prevent-webhook-self-trigger}

响应广泛 API 请求的变更性质的 Webhook 可能会无意中触发自身。例如，考虑一个响应集群内所有请求的
Webhook。如果配置该 Webhook 为每次变更创建 Event 对象，则它会对自己的 Event 对象创建请求作出响应。

为了避免这种情况，可以考虑在 Webhook 创建的任何资源中设置一个唯一的标签，
并将此标签从 Webhook 的匹配条件中排除。

<!--
### Don't change immutable objects {#dont-change-immutable-objects}

Some Kubernetes objects in the API server can't change. For example, when you
deploy a {{< glossary_tooltip text="static Pod" term_id="static-pod" >}}, the
kubelet on the node creates a 
{{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}} in the API
server to track the static Pod. However, changes to the mirror Pod don't
propagate to the static Pod. 
-->
### 不要更改不可变更的对象   {#dont-change-immutable-objects}

API 服务器中的一些 Kubernetes 对象是不可更改的。例如，
当你部署一个{{< glossary_tooltip text="静态 Pod" term_id="static-pod" >}} 时，
节点上的 kubelet 会在 API 服务器中创建一个{{< glossary_tooltip text="镜像 Pod" term_id="mirror-pod" >}}
来跟踪该静态 Pod。然而，对镜像 Pod 的更改不会被传播到静态 Pod。

<!--
Don't attempt to mutate these objects during admission. All mirror Pods have the
`kubernetes.io/config.mirror` annotation. To exclude mirror Pods while reducing
the security risk of ignoring an annotation, allow static Pods to only run in
specific namespaces. 
-->
不要在准入期间尝试对这些对象进行变更。所有镜像 Pod 都带有
`kubernetes.io/config.mirror` 注解。为了在排除镜像 Pod
的同时降低忽略注解的安全风险，可以仅允许静态 Pod 在特定的名字空间中运行。

<!--
## Mutating webhook ordering and idempotence {#ordering-idempotence}

This section provides recommendations for webhook order and designing idempotent
webhooks. In summary, these are as follows:
-->
## 变更性质 Webhook 的顺序与幂等性 {#ordering-idempotence}

本节提供关于 Webhook 顺序设计和幂等性 Webhook 的建议。总结如下：

<!--
* Don't rely on a specific order of execution.
* Validate mutations before admission.
* Check for mutations being overwritten by other controllers.
* Ensure that the set of mutating webhooks is idempotent, not just the
  individual webhooks.
-->
* 不要依赖特定的执行顺序。
* 在准入前验证变更。
* 检查是否存在其他控制器覆盖的变更。
* 确保整个变更性 Webhook 集合是幂等的，而不仅仅是单个 Webhook 具有幂等性。

<!--
### Don't rely on mutating webhook invocation order {#dont-rely-webhook-order}

Mutating admission webhooks don't run in a consistent order. Various factors
might change when a specific webhook is called. Don't rely on your webhook
running at a specific point in the admission process. Other webhooks could still
mutate your modified object.
-->
### 不要依赖变更准入 Webhook 的调用顺序   {#dont-rely-webhook-order}

变更准入 Webhook 的执行顺序并不固定。某些因素可能会改变特定 Webhook
被调用的时机。不要指望你的 Webhook 在准入流程中的某个特定点运行，
因为其他 Webhook 仍可能对你所修改的对象进行进一步变更。

<!--
The following recommendations might help to minimize the risk of unintended
changes:

* [Validate mutations before admission](#validate-mutations)
* Use a reinvocation policy to observe changes to an object by other plugins
  and re-run the webhook as needed. For details, see
  [Reinvocation policy](/docs/reference/access-authn-authz/extensible-admission-controllers/#reinvocation-policy).
-->
以下建议可能有助于最小化意外更改的风险：

* [在准入前验证变更](#validate-mutations)
* 使用重新调用策略来观察其他插件对对象的更改，并根据需要重新运行 Webhook。
  更多详细信息，请参见[重新调用策略](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#reinvocation-policy)。

<!--
### Ensure that the mutating webhooks in your cluster are idempotent {#ensure-mutating-webhook-idempotent}

Every mutating admission webhook should be _idempotent_. The webhook should be
able to run on an object that it already modifed without making additional
changes beyond the original change.
-->
### 确保集群中的变更准入 Webhook 具有幂等性   {#ensure-mutating-webhook-idempotent}

每个变更性质的准入 Webhook 都应该是**幂等的**。Webhook 应能够在已经修改过的对象上运行，
而不会在原始更改之外产生额外的更改。

<!--
Additionally, all of the mutating webhooks in your cluster should, as a
collection, be idempotent. After the mutation phase of admission control ends,
every individual mutating webhook should be able to run on an object without 
making additional changes to the object.

Depending on your environment, ensuring idempotence at scale might be
challenging. The following recommendations might help:
-->
此外，集群中的所有变更性质的 Webhook 集合也应当是幂等的。在准入控制的变更阶段结束后，
每个变更性质的 Webhook 都应能够针对该对象运行而不会对该对象产生额外的更改。

取决于你的环境，确保大规模幂等性可能会具有挑战性。以下建议可能有所帮助：

<!--
* Use validating admission controllers to verify the final state of
  critical workloads.
* Test your deployments in a staging cluster to see if any objects get modified
  multiple times by the same webhook. 
* Ensure that the scope of each mutating webhook is specific and limited.

The following examples show idempotent mutation logic:
-->
* 使用验证性质的准入控制器来对关键工作负载的最终状态进行检查。
* 在测试集群中测试你的部署，查看是否有对象被同一个 Webhook 多次修改。
* 确保每个变更性 Webhook 的作用范围具体且受限。

以下示例展示的是一些幂等的变更逻辑：

<!--
1. For a **create** Pod request, set the field
  `.spec.securityContext.runAsNonRoot` of the Pod to true.

1. For a **create** Pod request, if the field
   `.spec.containers[].resources.limits` of a container is not set, set default
   resource limits.

1. For a **create** Pod request, inject a sidecar container with name
   `foo-sidecar` if no container with the name `foo-sidecar` already exists.
-->
1. 对于 **create** Pod 请求，将 Pod 的字段 `.spec.securityContext.runAsNonRoot`
   设置为 `true`。

2. 对于 **create** Pod 请求，如果容器的字段 `.spec.containers[].resources.limits`
   未设置，则设置默认的资源限制。

3. 对于 **create** Pod 请求，如果不存在名为 `foo-sidecar` 的容器，
   则注入一个名为 `foo-sidecar` 的边车容器。

<!--
In these cases, the webhook can be safely reinvoked, or admit an object that
already has the fields set.

The following examples show non-idempotent mutation logic:
-->
在这些情况下，Webhook 可以被安全地重新调用，或者允许已经设置了相关字段的对象通过准入控制。

以下示例展示了非幂等的变更逻辑：

<!--
1. For a **create** Pod request, inject a sidecar container with name
   `foo-sidecar` suffixed with the current timestamp (such as
   `foo-sidecar-19700101-000000`).

   Reinvoking the webhook can result in the same sidecar being injected multiple
   times to a Pod, each time with a different container name. Similarly, the
   webhook can inject duplicated containers if the sidecar already exists in
   a user-provided pod.
-->
1. 对于 **create** Pod 请求，注入一个名称为 `foo-sidecar`
   并附加当前时间戳的边车容器（例如 `foo-sidecar-19700101-000000`）。

   重新调用 Webhook 可能会导致同一个边车容器被多次注入到 Pod 中，
   每次使用不同的容器名称。同样，如果边车容器已经存在于用户提供的 Pod 中，
   Webhook 也可能注入重复的容器。

<!--
2. For a **create**/**update** Pod request, reject if the Pod has label `env`
   set, otherwise add an `env: prod` label to the Pod.

   Reinvoking the webhook will result in the webhook failing on its own output.
-->
2. 对于 **create**/**update** Pod 请求，如果 Pod 已设置标签 `env`，则拒绝请求；
   否则，向 Pod 添加标签 `env: prod`。

   重新调用 Webhook 将导致 Webhook 在面对自身的输出时失败。

<!--
3. For a **create** Pod request, append a sidecar container named `foo-sidecar`
   without checking whether a `foo-sidecar` container exists.

   Reinvoking the webhook will result in duplicated containers in the Pod, which
   makes the request invalid and rejected by the API server.
-->
3. 对于 **create** Pod 请求，在不检查是否已存在名为 `foo-sidecar`
   的容器的情况下，追加一个名为 `foo-sidecar` 的边车容器。

   重新调用 Webhook 将导致 Pod 中出现重复的容器，这会使请求无效并被
   API 服务器拒绝。

<!--
## Mutation testing and validation {#mutation-testing-validation}

This section provides recommendations for testing your mutating webhooks and
validating mutated objects. In summary, these are as follows:

* Test webhooks in staging environments.
* Avoid mutations that violate validations.
* Test minor version upgrades for regressions and conflicts.
* Validate mutated objects before admission.
-->
## 变更的测试与验证 {#mutation-testing-validation}

本节提供关于测试变更性质 Webhook 和对已变更对象进行检验的建议。总结如下：

* 在测试环境中测试 Webhook。
* 避免违反验证规则的变更。
* 测试小版本升级时的回归和冲突。
* 在准入前验证变更的对象。

<!--
### Test webhooks in staging environments {#test-in-staging-environments}

Robust testing should be a core part of your release cycle for new or updated
webhooks. If possible, test any changes to your cluster webhooks in a staging
environment that closely resembles your production clusters. At the very least,
consider using a tool like [minikube](https://minikube.sigs.k8s.io/docs/) or
[kind](https://kind.sigs.k8s.io/) to create a small test cluster for webhook
changes.
-->
本节提供关于测试变更性质 Webhook 和对已变更对象进行检验的建议。总结如下：

稳健的测试应该是你发布新的 Webhook 或更新现有 Webhook 的核心部分。如果可能的话，
在一个与生产集群相似的预发布（staging）环境中测试对集群 Webhook 的所有更改。至少，
考虑使用 [minikube](https://minikube.sigs.k8s.io/docs/) 或
[kind](https://kind.sigs.k8s.io/) 等工具创建一个小的测试集群来进行
Webhook 的更改测试。

<!--
### Ensure that mutations don't violate validations {#ensure-mutations-dont-violate-validations}

Your mutating webhooks shouldn't break any of the validations that apply to an
object before admission. For example, consider a mutating webhook that sets the 
default CPU request of a Pod to a specific value. If the CPU limit of that Pod
is set to a lower value than the mutated request, the Pod fails admission. 

Test every mutating webhook against the validations that run in your cluster.
-->
### 确保变更不会违反验证规则   {#ensure-mutations-dont-violate-validations}

你的变更性质 Webhook 不应破坏对象在被准入前将被应用的任何验证规则。例如，考虑一个将
Pod 的默认 CPU 请求设置为特定值的变更性质 Webhook。如果该 Pod 的 CPU
限制设置为低于变更后的请求值，则该 Pod 将无法通过准入。

针对集群中运行的验证规则测试每个变更性质的 Webhook。

<!--
### Test minor version upgrades to ensure consistent behavior {#test-minor-version-upgrades}

Before upgrading your production clusters to a new minor version, test your
webhooks and workloads in a staging environment. Compare the results to ensure
that your webhooks continue to function as expected after the upgrade. 

Additionally, use the following resources to stay informed about API changes:

* [Kubernetes release notes](/releases/)
* [Kubernetes blog](/blog/)
-->
### 测试小版本升级以确保一致的行为   {#test-minor-version-upgrades}

在将生产集群升级到新的小版本之前，在一个预发布环境中测试你的 Webhook 和工作负载。
比较结果，确保升级后你的 Webhook 仍能按预期运行。

此外，使用以下资源来了解 API 变更的相关信息：

* [Kubernetes 发行说明](/zh-cn/releases/)
* [Kubernetes 博客](/zh-cn/blog/)

<!--
### Validate mutations before admission {#validate-mutations}

Mutating webhooks run to completion before any validating webhooks run. There is
no stable order in which mutations are applied to objects. As a result, your
mutations could get overwritten by a mutating webhook that runs at a later time.
-->
### 在准入前验证变更   {#validate-mutations}

变更性质的 Webhook 会在所有验证性质的 Webhook 运行之前完成运行。
多项变更在对象的应用顺序并不稳定。因此，你所作的变更可能会被后续运行的变更性 Webhook 覆盖。

<!--
Add a validating admission controller like a ValidatingAdmissionWebhook or a
ValidatingAdmissionPolicy to your cluster to ensure that your mutations
are still present. For example, consider a mutating webhook that inserts the
`restartPolicy: Always` field to specific init containers to make them run as
sidecar containers. You could run a validating webhook to ensure that those
init containers retained the `restartPolicy: Always` configuration after all
mutations were completed. 
-->
可以添加如 ValidatingAdmissionWebhook 或 ValidatingAdmissionPolicy
这样的验证性准入控制器到你的集群中，以确保你的变更是仍然存在的。例如，
考虑一个变更性质的 Webhook，它将 `restartPolicy: Always` 字段插入特定的初始化容器中，
使它们作为边车容器运行。你可以运行一个验证 Webhook 来确保这些初始化容器在所有变更完成后仍保留
`restartPolicy: Always` 配置。

<!--
For details, see the following resources:

* [Validating Admission Policy](/docs/reference/access-authn-authz/validating-admission-policy/)
* [ValidatingAdmissionWebhooks](/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)
-->
详情请参阅以下资源：

* [验证准入策略](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)
* [ValidatingAdmissionWebhooks](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#validatingadmissionwebhook)

<!--
## Mutating webhook deployment {#mutating-webhook-deployment}

This section provides recommendations for deploying your mutating admission
webhooks. In summary, these are as follows:

* Gradually roll out the webhook configuration and monitor for issues by
  namespace.
* Limit access to edit the webhook configuration resources. 
* Limit access to the namespace that runs the webhook server, if the server is
  in-cluster.
-->
## 变更性 Webhook 的部署   {#mutating-webhook-deployment}

本节给出关于部署变更性准入 Webhook 的建议。总结如下：

* 逐步推出 Webhook 配置，并按名字空间监控可能出现的问题。
* 限制对 Webhook 配置资源的编辑访问权限。
* 如果服务器位于集群内，则限制对运行 Webhook 服务器的命名空间的访问权限。

<!--
### Install and enable a mutating webhook {#install-enable-mutating-webhook}

When you're ready to deploy your mutating webhook to a cluster, use the
following order of operations: 
-->
### 安装、启用变更性 Webhook {#install-enable-mutating-webhook}

当你准备将变更性质的 Webhook 部署到集群时，请按照以下操作顺序进行：

<!--
1.  Install the webhook server and start it.
1.  Set the `failurePolicy` field in the MutatingWebhookConfiguration manifest
    to Ignore. This lets you avoid disruptions caused by misconfigured webhooks.
1.  Set the `namespaceSelector` field in the MutatingWebhookConfiguration
    manifest to a test namespace.
1.  Deploy the MutatingWebhookConfiguration to your cluster.
-->
1. 安装 Webhook 服务器并启动它。
2. 在 MutatingWebhookConfiguration 清单中将 `failurePolicy`
   字段设置为 `Ignore`。这样可以避免因 Webhook 配置错误而导致的干扰。
3. 在 MutatingWebhookConfiguration 清单中将 `namespaceSelector`
   字段设置为一个测试命名空间。
4. 将 MutatingWebhookConfiguration 部署到你的集群中。

<!--
Monitor the webhook in the test namespace to check for any issues, then roll the
webhook out to other namespaces. If the webhook intercepts an API request that
it wasn't meant to intercept, pause the rollout and adjust the scope of the
webhook configuration.
-->
在测试命名空间中监控 Webhook，检查是否有任何问题，然后将 Webhook
推广到其他命名空间。如果 Webhook 拦截了不应拦截的 API 请求，
请暂停推广并调整 Webhook 配置的范围。

<!--
### Limit edit access to mutating webhooks {#limit-edit-access}

Mutating webhooks are powerful Kubernetes controllers. Use RBAC or another
authorization mechanism to limit access to your webhook configurations and
servers. For RBAC, ensure that the following access is only available to trusted
entities:
-->
### 限制对变更性 Webhook 的编辑访问 {#limit-edit-access}

变更性质的 Webhook 是一种强大的 Kubernetes 控制器。使用 RBAC
或其他鉴权机制来限制对你的 Webhook 和服务器的编辑访问权限。
对于 RBAC，确保只有受信任的实体才可以具有以下访问权限：

<!--
* Verbs: **create**, **update**, **patch**, **delete**, **deletecollection**
* API group: `admissionregistration.k8s.io/v1`
* API kind: MutatingWebhookConfigurations

If your mutating webhook server runs in the cluster, limit access to create or
modify any resources in that namespace.
-->
* 动词：**create**（创建）、**update**（更新）、**patch**（补丁）、
  **delete**（删除）、**deletecollection**（删除集合）
* API 组：`admissionregistration.k8s.io/v1`
* API 资源类型：MutatingWebhookConfigurations

如果你的变更性 Webhook 的服务器在集群内运行，请限制对该命名空间中任何资源的创建或修改权限。

<!--
## Examples of good implementations {#example-good-implementations}
-->
## 良好实现的示例   {#example-good-implementations}

{{% thirdparty-content %}}

<!--
The following projects are examples of "good" custom webhook server
implementations. You can use them as a starting point when designing your own
webhooks. Don't use these examples as-is; use them as a starting point and
design your webhooks to run well in your specific environment.
-->
以下项目是“良好的”自定义 Webhook 服务器实现的示例。在设计你自己的 Webhook 时，
可以将它们作为起点。请勿直接使用这些示例，而是应根据你的具体环境进行调整和设计。

* [`cert-manager`](https://github.com/cert-manager/cert-manager/tree/master/internal/webhook)
* [Gatekeeper Open Policy Agent (OPA)](https://open-policy-agent.github.io/gatekeeper/website/docs/mutation)


## {{% heading "whatsnext" %}}

<!--
* [Use webhooks for authentication and authorization](/docs/reference/access-authn-authz/webhook/)
* [Learn about MutatingAdmissionPolicies](/docs/reference/access-authn-authz/mutating-admission-policy/)
* [Learn about ValidatingAdmissionPolicies](/docs/reference/access-authn-authz/validating-admission-policy/)
-->
* [使用 Webhook 进行身份认证和鉴权](/zh-cn/docs/reference/access-authn-authz/webhook/)
* [了解 MutatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/mutating-admission-policy/)
* [了解 ValidatingAdmissionPolicy](/zh-cn/docs/reference/access-authn-authz/validating-admission-policy/)
