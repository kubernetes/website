---
title: 流控
weight: 130
---
<!--
title: Flow control
weight: 130
-->

<!-- overview -->

<!--
API Priority and Fairness controls the behavior of the Kubernetes API server in
an overload situation. You can find more information about it in the
[API Priority and Fairness](/docs/concepts/cluster-administration/flow-control/)
documentation.
-->
API 优先级和公平性控制着 Kubernetes API 服务器在负载过高的情况下的行为。你可以在
[API 优先级和公平性](/zh-cn/docs/concepts/cluster-administration/flow-control/)文档中找到更多信息。

<!-- body -->

<!--
## Diagnostics

Every HTTP response from an API server with the priority and fairness feature
enabled has two extra headers: `X-Kubernetes-PF-FlowSchema-UID` and
`X-Kubernetes-PF-PriorityLevel-UID`, noting the flow schema that matched the request
and the priority level to which it was assigned, respectively. The API objects'
names are not included in these headers (to avoid revealing details in case the
requesting user does not have permission to view them). When debugging, you
can use a command such as:
-->
## 问题诊断    {#diagnostics}

对于启用了 APF 的 API 服务器，每个 HTTP 响应都有两个额外的 HTTP 头：
`X-Kubernetes-PF-FlowSchema-UID` 和 `X-Kubernetes-PF-PriorityLevel-UID`，
给出与请求匹配的 FlowSchema 和已分配的优先级级别。
如果请求用户没有查看这些对象的权限，则这些 HTTP 头中将不包含 API 对象的名称，
因此在调试时，你可以使用类似如下的命令：

```shell
kubectl get flowschemas -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
kubectl get prioritylevelconfigurations -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
```

<!--
to get a mapping of UIDs to names for both FlowSchemas and
PriorityLevelConfigurations.
-->
来获取 UID 与 FlowSchema 的名称和 PriorityLevelConfiguration 的名称之间的对应关系。

<!--
## Debug endpoints

With the `APIPriorityAndFairness` feature enabled, the `kube-apiserver`
serves the following additional paths at its HTTP(S) ports.
-->
### 调试端点    {#debug-endpoints}

启用 APF 特性后，`kube-apiserver` 会在其 HTTP/HTTPS 端口额外提供以下路径：

<!--
You need to ensure you have permissions to access these endpoints.
You don't have to do anything if you are using admin.
Permissions can be granted if needed following the [RBAC](/docs/reference/access-authn-authz/rbac/) doc
to access `/debug/api_priority_and_fairness/` by specifying `nonResourceURLs`.
-->
你需要确保自己具有访问这些端点的权限。如果你使用管理员身份，则无需进行任何操作。
必要时可以通过设置 `nonResourceURLs` 来访问 `/debug/api_priority_and_fairness/`
参照 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 文档授予权限。

<!--
- `/debug/api_priority_and_fairness/dump_priority_levels` - a listing of
  all the priority levels and the current state of each.  You can fetch like this:
-->
- `/debug/api_priority_and_fairness/dump_priority_levels` ——
  所有优先级及其当前状态的列表。你可以这样获取：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_priority_levels
  ```

  <!--
  The output will be in CSV and similar to this:
  -->
  输出格式为 CSV，类似于：

  ```none
  PriorityLevelName, ActiveQueues, IsIdle, IsQuiescing, WaitingRequests, ExecutingRequests, DispatchedRequests, RejectedRequests, TimedoutRequests, CancelledRequests
  catch-all,         0,            true,   false,       0,               0,                 1,                  0,                0,                0
  exempt,            0,            true,   false,       0,               0,                 0,                  0,                0,                0
  global-default,    0,            true,   false,       0,               0,                 46,                 0,                0,                0
  leader-election,   0,            true,   false,       0,               0,                 4,                  0,                0,                0
  node-high,         0,            true,   false,       0,               0,                 34,                 0,                0,                0
  system,            0,            true,   false,       0,               0,                 48,                 0,                0,                0
  workload-high,     0,            true,   false,       0,               0,                 500,                0,                0,                0
  workload-low,      0,            true,   false,       0,               0,                 0,                  0,                0,                0
  ```

  <!--
  Explanation for selected column names:
  - `IsQuiescing` indicates if this priority level will be removed when its queues have been drained.
  -->
  所选列名的解释：

  - `IsQuiescing` 表示当队列已被腾空时此优先级级别是否将被移除。

<!--
- `/debug/api_priority_and_fairness/dump_queues` - a listing of all the
  queues and their current state.  You can fetch like this:
-->
- `/debug/api_priority_and_fairness/dump_queues` —— 所有队列及其当前状态的列表。
  你可以这样获取：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_queues
  ```

  <!--
  The output will be in CSV and similar to this:
  -->
  输出格式为 CSV，类似于：

  ```none
  PriorityLevelName, Index,  PendingRequests, ExecutingRequests, SeatsInUse, NextDispatchR,   InitialSeatsSum, MaxSeatsSum, TotalWorkSum
  workload-low,      14,     27,              0,                 0,          77.64342019ss,   270,             270,         0.81000000ss
  workload-low,      74,     26,              0,                 0,          76.95387841ss,   260,             260,         0.78000000ss
  ...
  leader-election,   0,      0,               0,                 0,          5088.87053833ss, 0,               0,           0.00000000ss
  leader-election,   1,      0,               0,                 0,          0.00000000ss,    0,               0,           0.00000000ss
  ...
  workload-high,     0,      0,               0,                 0,          0.00000000ss,    0,               0,           0.00000000ss
  workload-high,     1,      0,               0,                 0,          1119.44936475ss, 0,               0,           0.00000000ss
  ```

  <!--
  Explanation for selected column names:
  - `NextDispatchR`: The R progress meter reading, in units of seat-seconds, at
    which the next request will be dispatched.
  - `InitialSeatsSum`: The sum of InitialSeats associated with all requests in
    a given queue.
  - `MaxSeatsSum`: The sum of MaxSeats associated with all requests in a given
    queue.
  - `TotalWorkSum`: The sum of total work, in units of seat-seconds, of all
    waiting requests in a given queue.
  -->
  所选列名的解释：

  - `NextDispatchR`：下一个请求将被调度时的 R 进度计读数，单位为 seat-second。
  - `InitialSeatsSum`：与在某个给定队列中所有请求关联的 InitialSeats 的总和。
  - `MaxSeatsSum`：与某个给定队列中所有请求关联的 MaxSeats 的总和。
  - `TotalWorkSum`：在某个给定队列中所有等待中请求的总工作量，单位为 seat-second。

  <!--
  Note: `seat-second` (abbreviate as `ss`) is a measure of work, in units of
  seat-seconds, in the APF world.
  -->
  注意：`seat-second`（缩写为 `ss`）是 APF 领域中的工作量单位。

<!--
- `/debug/api_priority_and_fairness/dump_requests` - a listing of all the requests
  including requests waiting in a queue and requests being executing.
  You can fetch like this:
-->
- `/debug/api_priority_and_fairness/dump_requests` - 所有请求的列表，
  包括队列中正在等待的请求和正在执行的请求。你可以运行以下类似命令获取此列表：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_requests
  ```

  <!--
  The output will be in CSV and similar to this:
  -->
  输出格式为 CSV，类似于：

  ```none
  PriorityLevelName, FlowSchemaName,   QueueIndex, RequestIndexInQueue, FlowDistingsher,                        ArriveTime,                     InitialSeats, FinalSeats, AdditionalLatency, StartTime
  exempt,            exempt,           -1,         -1,                  ,                                       2023-07-15T04:51:25.596404345Z, 1,            0,          0s,                2023-07-15T04:51:25.596404345Z
  workload-low,      service-accounts, 14,         0,                   system:serviceaccount:default:loadtest, 2023-07-18T00:12:51.386556253Z, 10,           0,          0s,                0001-01-01T00:00:00Z
  workload-low,      service-accounts, 14,         1,                   system:serviceaccount:default:loadtest, 2023-07-18T00:12:51.487092539Z, 10,           0,          0s,                0001-01-01T00:00:00Z
  ```

  <!--
  You can get a more detailed listing with a command like this:
  -->
  你可以使用以下命令获得更详细的清单：

  ```shell
  kubectl get --raw '/debug/api_priority_and_fairness/dump_requests?includeRequestDetails=1'
  ```

  <!--
  The output will be in CSV and similar to this:
  -->
  输出格式为 CSV，类似于：

  ```none
  PriorityLevelName, FlowSchemaName,   QueueIndex, RequestIndexInQueue, FlowDistingsher,                        ArriveTime,                     InitialSeats, FinalSeats, AdditionalLatency, StartTime,                      UserName,                               Verb,   APIPath,                                   Namespace,   Name,   APIVersion, Resource,   SubResource
  exempt,            exempt,           -1,         -1,                  ,                                       2023-07-15T04:51:25.596404345Z, 1,            0,          0s,                2023-07-15T04:51:25.596404345Z, system:serviceaccount:system:admin,     list,   /api/v1/namespaces/kube-stress/configmaps, kube-stress, ,       v1,         configmaps,
  workload-low,      service-accounts, 14,         0,                   system:serviceaccount:default:loadtest, 2023-07-18T00:13:08.986534842Z, 10,           0,          0s,                0001-01-01T00:00:00Z,           system:serviceaccount:default:loadtest, list,   /api/v1/namespaces/kube-stress/configmaps, kube-stress, ,       v1,         configmaps,
  workload-low,      service-accounts, 14,         1,                   system:serviceaccount:default:loadtest, 2023-07-18T00:13:09.086476021Z, 10,           0,          0s,                0001-01-01T00:00:00Z,           system:serviceaccount:default:loadtest, list,   /api/v1/namespaces/kube-stress/configmaps, kube-stress, ,       v1,         configmaps,
  ```

  <!--
  Explanation for selected column names:
  - `QueueIndex`: The index of the queue. It will be -1 for priority levels
    without queues.
  - `RequestIndexInQueue`: The index in the queue for a given request. It will
    be -1 for executing requests.
  - `InitialSeats`: The number of seats will be occupied during the initial
    (normal) stage of execution of the request.
  - `FinalSeats`: The number of seats will be occupied during the final stage
    of request execution, accounting for the associated WATCH notifications.
  - `AdditionalLatency`: The extra time taken during the final stage of request
    execution. FinalSeats will be occupied during this time period. It does not
    mean any latency that a user will observe.
  - `StartTime`: The time a request starts to execute. It will be
    0001-01-01T00:00:00Z for queued requests.
  -->
  所选列名的解释：
  - `QueueIndex`：队列的索引。对于没有队列的优先级级别，该值将为 -1。
  - `RequestIndexInQueue`：某个给定请求在队列中的索引。对于正在执行的请求，该值将为 -1。
  - `InitialSeats`：在请求的初始（正常）执行阶段占用的席位数。
  - `FinalSeats`：在请求执行的最终阶段占用的席位数，包括与之关联的 WATCH 通知。
  - `AdditionalLatency`：在请求执行的最终阶段所耗用的额外时间。
    FinalSeats 将在此时间段内被占用。这并不意味着用户会感知到任何延迟。
  - `StartTime`：请求开始执行的时间。对于排队的请求，该值将为 0001-01-01T00:00:00Z。

<!--
## Debug logging

At `-v=3` or more verbosity, the API server outputs an httplog line for every
request in the API server log, and it includes the following attributes.
-->
### 调试日志生成行为  {#debug-logging}

在 `-v=3` 或更详细的情况下，API 服务器会为在 API 服务日志中为每个请求输出一行 httplog，
其中包括以下属性：

<!--
- `apf_fs`: the name of the flow schema to which the request was classified.
- `apf_pl`: the name of the priority level for that flow schema.
- `apf_iseats`: the number of seats determined for the initial
  (normal) stage of execution of the request.
- `apf_fseats`: the number of seats determined for the final stage of
  execution (accounting for the associated `watch` notifications) of the
  request.
- `apf_additionalLatency`: the duration of the final stage of
  execution of the request.
-->
- `apf_fs`：请求被分类到的 FlowSchema 的名称。
- `apf_pl`：该 FlowSchema 的优先级名称。
- `apf_iseats`：为请求执行的初始（正常）阶段确定的席位数量。
- `apf_fseats`：为请求的最后执行阶段（考虑关联的 `watch` 通知）确定的席位数量。
- `apf_additionalLatency`：请求执行最后阶段的持续时间。

<!--
At higher levels of verbosity there will be log lines exposing details
of how APF handled the request, primarily for debugging purposes.
-->
在更高级别的精细度下，将有日志行揭示 APF 如何处理请求的详细信息，主要用于调试目的。

<!--
## Response headers

APF adds the following two headers to each HTTP response message.
They won't appear in the audit log. They can be viewed from the client side.
For client using `klog`, use verbosity `-v=8` or higher to view these headers.

- `X-Kubernetes-PF-FlowSchema-UID` holds the UID of the FlowSchema
  object to which the corresponding request was classified.
- `X-Kubernetes-PF-PriorityLevel-UID` holds the UID of the
  PriorityLevelConfiguration object associated with that FlowSchema.
-->
### 响应头  {#response-headers}

APF 将以下两个头添加到每个 HTTP 响应消息中。
这些信息不会出现在审计日志中，但可以从客户端查看。
对于使用 `klog` 的客户端，使用 `-v=8` 或更高的详细级别可以查看这些头。

- `X-Kubernetes-PF-FlowSchema-UID` 保存相应请求被分类到的 FlowSchema 对象的 UID。
- `X-Kubernetes-PF-PriorityLevel-UID` 保存与该 FlowSchema 关联的 PriorityLevelConfiguration 对象的 UID。

## {{% heading "whatsnext" %}}

<!--
For background information on design details for API priority and fairness, see
the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness).
-->
有关 API 优先级和公平性的设计细节的背景信息，
请参阅[增强提案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness)。
