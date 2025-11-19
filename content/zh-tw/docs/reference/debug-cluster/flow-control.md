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
API 優先級和公平性控制着 Kubernetes API 伺服器在負載過高的情況下的行爲。你可以在
[API 優先級和公平性](/zh-cn/docs/concepts/cluster-administration/flow-control/)文檔中找到更多信息。

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
## 問題診斷    {#diagnostics}

對於啓用了 APF 的 API 伺服器，每個 HTTP 響應都有兩個額外的 HTTP 頭：
`X-Kubernetes-PF-FlowSchema-UID` 和 `X-Kubernetes-PF-PriorityLevel-UID`，
給出與請求匹配的 FlowSchema 和已分配的優先級級別。
如果請求使用者沒有查看這些對象的權限，則這些 HTTP 頭中將不包含 API 對象的名稱，
因此在調試時，你可以使用類似如下的命令：

```shell
kubectl get flowschemas -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
kubectl get prioritylevelconfigurations -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
```

<!--
to get a mapping of UIDs to names for both FlowSchemas and
PriorityLevelConfigurations.
-->
來獲取 UID 與 FlowSchema 的名稱和 PriorityLevelConfiguration 的名稱之間的對應關係。

<!--
## Debug endpoints

With the `APIPriorityAndFairness` feature enabled, the `kube-apiserver`
serves the following additional paths at its HTTP(S) ports.
-->
### 調試端點    {#debug-endpoints}

啓用 APF 特性後，`kube-apiserver` 會在其 HTTP/HTTPS 端口額外提供以下路徑：

<!--
You need to ensure you have permissions to access these endpoints.
You don't have to do anything if you are using admin.
Permissions can be granted if needed following the [RBAC](/docs/reference/access-authn-authz/rbac/) doc
to access `/debug/api_priority_and_fairness/` by specifying `nonResourceURLs`.
-->
你需要確保自己具有訪問這些端點的權限。如果你使用管理員身份，則無需進行任何操作。
必要時可以通過設置 `nonResourceURLs` 來訪問 `/debug/api_priority_and_fairness/`
參照 [RBAC](/zh-cn/docs/reference/access-authn-authz/rbac/) 文檔授予權限。

<!--
- `/debug/api_priority_and_fairness/dump_priority_levels` - a listing of
  all the priority levels and the current state of each.  You can fetch like this:
-->
- `/debug/api_priority_and_fairness/dump_priority_levels` ——
  所有優先級及其當前狀態的列表。你可以這樣獲取：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_priority_levels
  ```

  <!--
  The output will be in CSV and similar to this:
  -->
  輸出格式爲 CSV，類似於：

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
  所選列名的解釋：

  - `IsQuiescing` 表示當隊列已被騰空時此優先級級別是否將被移除。

<!--
- `/debug/api_priority_and_fairness/dump_queues` - a listing of all the
  queues and their current state.  You can fetch like this:
-->
- `/debug/api_priority_and_fairness/dump_queues` —— 所有隊列及其當前狀態的列表。
  你可以這樣獲取：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_queues
  ```

  <!--
  The output will be in CSV and similar to this:
  -->
  輸出格式爲 CSV，類似於：

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
  所選列名的解釋：

  - `NextDispatchR`：下一個請求將被調度時的 R 進度計讀數，單位爲 seat-second。
  - `InitialSeatsSum`：與在某個給定隊列中所有請求關聯的 InitialSeats 的總和。
  - `MaxSeatsSum`：與某個給定隊列中所有請求關聯的 MaxSeats 的總和。
  - `TotalWorkSum`：在某個給定隊列中所有等待中請求的總工作量，單位爲 seat-second。

  <!--
  Note: `seat-second` (abbreviate as `ss`) is a measure of work, in units of
  seat-seconds, in the APF world.
  -->
  注意：`seat-second`（縮寫爲 `ss`）是 APF 領域中的工作量單位。

<!--
- `/debug/api_priority_and_fairness/dump_requests` - a listing of all the requests
  including requests waiting in a queue and requests being executing.
  You can fetch like this:
-->
- `/debug/api_priority_and_fairness/dump_requests` - 所有請求的列表，
  包括隊列中正在等待的請求和正在執行的請求。你可以運行以下類似命令獲取此列表：

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_requests
  ```

  <!--
  The output will be in CSV and similar to this:
  -->
  輸出格式爲 CSV，類似於：

  ```none
  PriorityLevelName, FlowSchemaName,   QueueIndex, RequestIndexInQueue, FlowDistingsher,                        ArriveTime,                     InitialSeats, FinalSeats, AdditionalLatency, StartTime
  exempt,            exempt,           -1,         -1,                  ,                                       2023-07-15T04:51:25.596404345Z, 1,            0,          0s,                2023-07-15T04:51:25.596404345Z
  workload-low,      service-accounts, 14,         0,                   system:serviceaccount:default:loadtest, 2023-07-18T00:12:51.386556253Z, 10,           0,          0s,                0001-01-01T00:00:00Z
  workload-low,      service-accounts, 14,         1,                   system:serviceaccount:default:loadtest, 2023-07-18T00:12:51.487092539Z, 10,           0,          0s,                0001-01-01T00:00:00Z
  ```

  <!--
  You can get a more detailed listing with a command like this:
  -->
  你可以使用以下命令獲得更詳細的清單：

  ```shell
  kubectl get --raw '/debug/api_priority_and_fairness/dump_requests?includeRequestDetails=1'
  ```

  <!--
  The output will be in CSV and similar to this:
  -->
  輸出格式爲 CSV，類似於：

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
  所選列名的解釋：
  - `QueueIndex`：隊列的索引。對於沒有隊列的優先級級別，該值將爲 -1。
  - `RequestIndexInQueue`：某個給定請求在隊列中的索引。對於正在執行的請求，該值將爲 -1。
  - `InitialSeats`：在請求的初始（正常）執行階段佔用的席位數。
  - `FinalSeats`：在請求執行的最終階段佔用的席位數，包括與之關聯的 WATCH 通知。
  - `AdditionalLatency`：在請求執行的最終階段所耗用的額外時間。
    FinalSeats 將在此時間段內被佔用。這並不意味着使用者會感知到任何延遲。
  - `StartTime`：請求開始執行的時間。對於排隊的請求，該值將爲 0001-01-01T00:00:00Z。

<!--
## Debug logging

At `-v=3` or more verbosity, the API server outputs an httplog line for every
request in the API server log, and it includes the following attributes.
-->
### 調試日誌生成行爲  {#debug-logging}

在 `-v=3` 或更詳細的情況下，API 伺服器會爲在 API 服務日誌中爲每個請求輸出一行 httplog，
其中包括以下屬性：

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
- `apf_fs`：請求被分類到的 FlowSchema 的名稱。
- `apf_pl`：該 FlowSchema 的優先級名稱。
- `apf_iseats`：爲請求執行的初始（正常）階段確定的席位數量。
- `apf_fseats`：爲請求的最後執行階段（考慮關聯的 `watch` 通知）確定的席位數量。
- `apf_additionalLatency`：請求執行最後階段的持續時間。

<!--
At higher levels of verbosity there will be log lines exposing details
of how APF handled the request, primarily for debugging purposes.
-->
在更高級別的精細度下，將有日誌行揭示 APF 如何處理請求的詳細信息，主要用於調試目的。

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
### 響應頭  {#response-headers}

APF 將以下兩個頭添加到每個 HTTP 響應消息中。
這些信息不會出現在審計日誌中，但可以從客戶端查看。
對於使用 `klog` 的客戶端，使用 `-v=8` 或更高的詳細級別可以查看這些頭。

- `X-Kubernetes-PF-FlowSchema-UID` 保存相應請求被分類到的 FlowSchema 對象的 UID。
- `X-Kubernetes-PF-PriorityLevel-UID` 保存與該 FlowSchema 關聯的 PriorityLevelConfiguration 對象的 UID。

## {{% heading "whatsnext" %}}

<!--
For background information on design details for API priority and fairness, see
the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness).
-->
有關 API 優先級和公平性的設計細節的背景信息，
請參閱[增強提案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness)。
