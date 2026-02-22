---
title: Flow control
weight: 130
---

<!-- overview -->

API Priority and Fairness controls the behavior of the Kubernetes API server in
an overload situation. You can find more information about it in the
[API Priority and Fairness](/docs/concepts/cluster-administration/flow-control/)
documentation.

<!-- body -->

## Diagnostics

Every HTTP response from an API server with the priority and fairness feature
enabled has two extra headers: `X-Kubernetes-PF-FlowSchema-UID` and
`X-Kubernetes-PF-PriorityLevel-UID`, noting the flow schema that matched the request
and the priority level to which it was assigned, respectively. The API objects'
names are not included in these headers (to avoid revealing details in case the
requesting user does not have permission to view them). When debugging, you
can use a command such as:

```shell
kubectl get flowschemas -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
kubectl get prioritylevelconfigurations -o custom-columns="uid:{metadata.uid},name:{metadata.name}"
```

to get a mapping of UIDs to names for both FlowSchemas and
PriorityLevelConfigurations.

## Debug endpoints

With the `APIPriorityAndFairness` feature enabled, the `kube-apiserver`
serves the following additional paths at its HTTP(S) ports.

You need to ensure you have permissions to access these endpoints.
You don't have to do anything if you are using admin.
Permissions can be granted if needed following the [RBAC](/docs/reference/access-authn-authz/rbac/) doc
to access `/debug/api_priority_and_fairness/` by specifying `nonResourceURLs`.

- `/debug/api_priority_and_fairness/dump_priority_levels` - a listing of
  all the priority levels and the current state of each.  You can fetch like this:

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_priority_levels
  ```

  The output will be in CSV and similar to this:

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

  Explanation for selected column names:
  - `IsQuiescing` indicates if this priority level will be removed when its queues have been drained.

- `/debug/api_priority_and_fairness/dump_queues` - a listing of all the
  queues and their current state.  You can fetch like this:

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_queues
  ```

  The output will be in CSV and similar to this:

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

  Explanation for selected column names:
  - `NextDispatchR`: The R progress meter reading, in units of seat-seconds, at
    which the next request will be dispatched.
  - `InitialSeatsSum`: The sum of InitialSeats associated with all requests in
    a given queue.
  - `MaxSeatsSum`: The sum of MaxSeats associated with all requests in a given
    queue.
  - `TotalWorkSum`: The sum of total work, in units of seat-seconds, of all
    waiting requests in a given queue.

  Note: `seat-second` (abbreviate as `ss`) is a measure of work, in units of
  seat-seconds, in the APF world.

- `/debug/api_priority_and_fairness/dump_requests` - a listing of all the requests
  including requests waiting in a queue and requests being executing.
  You can fetch like this:

  ```shell
  kubectl get --raw /debug/api_priority_and_fairness/dump_requests
  ```

  The output will be in CSV and similar to this:

  ```none
  PriorityLevelName, FlowSchemaName,   QueueIndex, RequestIndexInQueue, FlowDistingsher,                        ArriveTime,                     InitialSeats, FinalSeats, AdditionalLatency, StartTime
  exempt,            exempt,           -1,         -1,                  ,                                       2023-07-15T04:51:25.596404345Z, 1,            0,          0s,                2023-07-15T04:51:25.596404345Z
  workload-low,      service-accounts, 14,         0,                   system:serviceaccount:default:loadtest, 2023-07-18T00:12:51.386556253Z, 10,           0,          0s,                0001-01-01T00:00:00Z
  workload-low,      service-accounts, 14,         1,                   system:serviceaccount:default:loadtest, 2023-07-18T00:12:51.487092539Z, 10,           0,          0s,                0001-01-01T00:00:00Z
  ```

  You can get a more detailed listing with a command like this:

  ```shell
  kubectl get --raw '/debug/api_priority_and_fairness/dump_requests?includeRequestDetails=1'
  ```

  The output will be in CSV and similar to this:

  ```none
  PriorityLevelName, FlowSchemaName,   QueueIndex, RequestIndexInQueue, FlowDistingsher,                        ArriveTime,                     InitialSeats, FinalSeats, AdditionalLatency, StartTime,                      UserName,                               Verb,   APIPath,                                   Namespace,   Name,   APIVersion, Resource,   SubResource
  exempt,            exempt,           -1,         -1,                  ,                                       2023-07-15T04:51:25.596404345Z, 1,            0,          0s,                2023-07-15T04:51:25.596404345Z, system:serviceaccount:system:admin,     list,   /api/v1/namespaces/kube-stress/configmaps, kube-stress, ,       v1,         configmaps,
  workload-low,      service-accounts, 14,         0,                   system:serviceaccount:default:loadtest, 2023-07-18T00:13:08.986534842Z, 10,           0,          0s,                0001-01-01T00:00:00Z,           system:serviceaccount:default:loadtest, list,   /api/v1/namespaces/kube-stress/configmaps, kube-stress, ,       v1,         configmaps,
  workload-low,      service-accounts, 14,         1,                   system:serviceaccount:default:loadtest, 2023-07-18T00:13:09.086476021Z, 10,           0,          0s,                0001-01-01T00:00:00Z,           system:serviceaccount:default:loadtest, list,   /api/v1/namespaces/kube-stress/configmaps, kube-stress, ,       v1,         configmaps,
  ```

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

## Debug logging

At `-v=3` or more verbosity, the API server outputs an httplog line for every
request in the API server log, and it includes the following attributes.

- `apf_fs`: the name of the flow schema to which the request was classified.
- `apf_pl`: the name of the priority level for that flow schema.
- `apf_iseats`: the number of seats determined for the initial
  (normal) stage of execution of the request.
- `apf_fseats`: the number of seats determined for the final stage of
  execution (accounting for the associated `watch` notifications) of the
  request.
- `apf_additionalLatency`: the duration of the final stage of
  execution of the request.

At higher levels of verbosity there will be log lines exposing details
of how APF handled the request, primarily for debugging purposes.

## Response headers

APF adds the following two headers to each HTTP response message.
They won't appear in the audit log. They can be viewed from the client side.
For client using `klog`, use verbosity `-v=8` or higher to view these headers.

- `X-Kubernetes-PF-FlowSchema-UID` holds the UID of the FlowSchema
  object to which the corresponding request was classified.
- `X-Kubernetes-PF-PriorityLevel-UID` holds the UID of the
  PriorityLevelConfiguration object associated with that FlowSchema.

## {{% heading "whatsnext" %}}

For background information on design details for API priority and fairness, see
the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1040-priority-and-fairness).
