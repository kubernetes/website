---
cn-approvers:
- xiaosuiba
title: federation-controller-manager
notitle: true
---

## federation-controller-manager

<!--
### Synopsis
-->
### 概览


<!--
The federation controller manager is a daemon that embeds
the core control loops shipped with federation. In applications of robotics and
automation, a control loop is a non-terminating loop that regulates the state of
the system. In federation, a controller is a control loop that watches the shared
state of the federation cluster through the apiserver and makes changes attempting
to move the current state towards the desired state. Examples of controllers that
ship with federation today is the cluster controller.
-->
Federation 控制器管理器（controller manager）是 federation 功能附带的一个嵌入了核心控制循环逻辑的守护进程。在机器人学和自动化范畴，控制循环指一个永远不会停止的、用于调整系统状态的循环。在 federation 中，控制器（controller）就是一个控制循环，它通过 apiserver 监控 federation 集群的共享状态，并尝试通过一些变更来使系统达到期望状态。目前随 federation 功能发布的控制器样例是集群控制器（cluster controller）。

```
federation-controller-manager
```

<!--
### Options
-->
### 选项

```
<!--
      --address ip                             The IP address to serve on (set to 0.0.0.0 for all interfaces) (default 0.0.0.0)
      -->
      --address ip                             监听的 IP 地址。 （设置为 0.0.0.0 表示所有接口） （默认为 0.0.0.0）
      <!--
      --cluster-monitor-period duration        The period for syncing ClusterStatus in ClusterController. (default 40s)
      -->
      --cluster-monitor-period duration        ClusterController 中 ClusterStatus 的同步周期。 （默认为 40s）
      <!--
      --concurrent-job-syncs int               The number of Jobs syncing operations that will be done concurrently. Larger number = faster endpoint updating, but more CPU (and network) load (default 10)
      -->
      --concurrent-job-syncs int               同时进行同步操作的任务数。较大数量 = 更快的 endpoint 更新速度，但占用更多 CPU（及网络）资源。 （默认为 10）
      <!--
      --concurrent-replicaset-syncs int        The number of ReplicaSets syncing operations that will be done concurrently. Larger number = faster endpoint updating, but more CPU (and network) load (default 10)
      -->
      --concurrent-replicaset-syncs int        同时进行 ReplicaSet 同步操作的任务数。较大数量 = 更快的 endpoint 更新速度，但占用更多 CPU（及网络）资源。 （默认为 10）
      <!--
      --concurrent-service-syncs int           The number of service syncing operations that will be done concurrently. Larger number = faster endpoint updating, but more CPU (and network) load (default 10)
      -->
      --concurrent-service-syncs int           同时进行 service 同步操作的任务数。较大数量 = 更快的 endpoint 更新速度，但占用更多 CPU（及网络）资源。 （默认为 10）
      <!--
      --contention-profiling                   Enable lock contention profiling, if profiling is enabled
      -->
      --contention-profiling                   如果启用了性能分析，则启用锁争用分析。
      <!--
      --controllers mapStringString            A set of key=value pairs that describe controller configuration to enable/disable specific controllers. Key should be the resource name (like services) and value should be true or false. For example: services=false,ingresses=false
      -->
      --controllers mapStringString            一组描述控制器配置的 key= value 键值对，用于启用/禁用特定控制器。Key 应该为资源名称（例如 services），而 value 应该为 true 或 false。例如：services=false,ingresses=false
      <!--
      --dns-provider string                    DNS provider. Valid values are: ["google-clouddns" "aws-route53" "coredns"]
      -->
      --dns-provider string                    DNS provider. 合法值包括： ["google-clouddns" "aws-route53" "coredns"]。
      <!--
      --dns-provider-config string             Path to config file for configuring DNS provider.
      -->
      --dns-provider-config string             用于配置 DNS provider 的配置文件路径。
      <!--
      --federated-api-burst int                Burst to use while talking with federation apiserver (default 30)
      -->
      --federated-api-burst int                和 federation apiserver 通信时使用的 burst 值。 （默认为 30）
      <!--
      --federated-api-qps float32              QPS to use while talking with federation apiserver (default 20)
      -->
      --federated-api-qps float32              和 federation apiserver 通信时使用的 QPS 值。 （默认为 20）
      <!--
      --federation-name string                 Federation name.
      -->
      --federation-name string                 Federation 名称。
      <!--
      --federation-only-namespace string       Name of the namespace that would be created only in federation control plane. (default "federation-only")
      -->
      --federation-only-namespace string       只会在 federation 控制平面创建的 namespace 名。（默认为 "federation-only"）
      <!--
      --hpa-scale-forbidden-window duration    The time window wrt cluster local hpa lastscale time, during which federated hpa would not move the hpa max/min replicas around (default 2m0s)
      -->
      --hpa-scale-forbidden-window duration    和集群本地 hpa lastscale time 相关的时间窗口，这段时间内，hpa 不会改变 hpa 最大/最小副本数量。（默认为 2m0s）
      <!--
      --kube-api-content-type string           ContentType of requests sent to apiserver. Passing application/vnd.kubernetes.protobuf is an experimental feature now.
      -->
      --kube-api-content-type string           发送至 apiserver 的请求的 ContentType。当前，传递 application/vnd.kubernetes.protobuf 为实验特性。
      <!--
      --kubeconfig string                      Path to kubeconfig file with authorization and master location information.
      -->
      --kubeconfig string                      包含认证信息及主节点连接信息的 kubeconfig 文件路径。
      <!--
      --leader-elect                           Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.
      -->
      --leader-elect                           在执行主要控制循环逻辑前，启动 leader election 客户端并获得 leadership。请在需要副本化运行组件以实现高可用时启用此选项。 （默认为 true）
      <!--
      --leader-elect-lease-duration duration   The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled. (default 15s)
      -->
      --leader-elect-lease-duration duration   从发现 leadership 更新起，到非 leader 候选者尝试获取领导权（但并没有实际更新 leader）需要等待的时间。这实际上是一个 leader 在被另一个候选者替代之前停止所需要花费的时间。这个参数只在启用了 leader election 时生效。 （默认为 15s）
      <!--
      --leader-elect-renew-deadline duration   The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled. (default 10s)
      -->
      --leader-elect-renew-deadline duration   在停止领导前，活动主节点尝试更新 leadership 地位的时间间隔。此选项必须小于等于 lease duration。这个参数只在启用了 leader election 时生效。  （默认为 10s）
      <!--
      --leader-elect-resource-lock endpoints   The type of resource object that is used for locking during leader election. Supported options are endpoints (default) and `configmap`. (default "endpoints")
      -->
      --leader-elect-resource-lock endpoints   在 leader election 过程中充当锁使用的资源对象类型。支持的选项有 endpoints（默认）和 `configmap`。 （默认为 "endpoints"）
      <!--
      --leader-elect-retry-period duration     The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled. (default 2s)
      -->
      --leader-elect-retry-period duration     客户端在尝试请求及更新 leadership 时需要等待的时间间隔。 这个参数只在启用了 leader election 时生效。 （默认为 2s）
      <!--
      --log-flush-frequency duration           Maximum number of seconds between log flushes (default 5s)
      -->
      --log-flush-frequency duration           日志刷新的时间间隔。 （默认为 5s）
      <!--
      --master string                          The address of the federation API server (overrides any value in kubeconfig)
      -->
      --master string                          federation API server 地址。（将覆盖 kubeconfig 中的配置）
      <!--
      --port int                               The port that the controller-manager's http service runs on (default 10253)
      -->
      --port int                               controller-manager http 服务的监听端口。 （默认为 10253）
      <!--
      --profiling                              Enable profiling via web interface host:port/debug/pprof/ (default true)
      -->
      --profiling                              通过 host:port/debug/pprof/ web 接口启用性能分析（profiling）。 （默认为 true）
      <!--
      --service-dns-suffix string              DNS Suffix to use when publishing federated service names.  Defaults to zone-name
      -->
      --service-dns-suffix string              发布 federated service 名称时使用的 DNS 后缀。默认为 zone-name。
      <!--
      --zone-id string                         Zone ID, needed if the zone name is not unique.
      -->
      --zone-id string                         Zone ID，当 zone name 不唯一时需要设置该项。
      <!--
      --zone-name string                       Zone name, like example.com.
      -->
      --zone-name string                       Zone name，例如 example.com。
```

###### Auto generated by spf13/cobra on 27-Sep-2017
