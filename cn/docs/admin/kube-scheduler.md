---
title: kube-scheduler
notitle: true
---


## kube-scheduler



<!--### Synopsis-->
### 概要


<!--The Kubernetes scheduler is a policy-rich, topology-aware,
workload-specific function that significantly impacts availability, performance,
and capacity. The scheduler needs to take into account individual and collective
resource requirements, quality of service requirements, hardware/software/policy
constraints, affinity and anti-affinity specifications, data locality, inter-workload
interference, deadlines, and so on. Workload-specific requirements will be exposed
through the API as necessary.-->

Kubernetes scheduler是一个拥有丰富策略、能够感知拓扑变化、支持特定负载的功能组件，它对集群的可用性、性能表现以及容量都影响巨大。scheduler需要考虑独立的和集体的资源需求、服务质量需求、硬件/软件/策略限制、亲和与反亲和规范、数据位置、内部负载接口、截止时间等等。如有必要，特定的负载需求可以通过API暴露出来。


```
kube-scheduler
```

<!--### Options-->
### 选项

<!--```
      --address string                           The IP address to serve on (set to 0.0.0.0 for all interfaces) (default "0.0.0.0")
      --algorithm-provider string                The scheduling algorithm provider to use, one of: ClusterAutoscalerProvider | DefaultProvider (default "DefaultProvider")
      --azure-container-registry-config string   Path to the file container Azure container registry configuration information.
      --contention-profiling                     Enable lock contention profiling, if profiling is enabled
      --feature-gates mapStringBool              A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
Accelerators=true|false (ALPHA - default=false)
AdvancedAuditing=true|false (ALPHA - default=false)
AffinityInAnnotations=true|false (ALPHA - default=false)
AllAlpha=true|false (ALPHA - default=false)
AllowExtTrafficLocalEndpoints=true|false (default=true)
AppArmor=true|false (BETA - default=true)
DynamicKubeletConfig=true|false (ALPHA - default=false)
DynamicVolumeProvisioning=true|false (ALPHA - default=true)
ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)
LocalStorageCapacityIsolation=true|false (ALPHA - default=false)
PersistentLocalVolumes=true|false (ALPHA - default=false)
RotateKubeletClientCertificate=true|false (ALPHA - default=false)
RotateKubeletServerCertificate=true|false (ALPHA - default=false)
StreamingProxyRedirects=true|false (BETA - default=true)
TaintBasedEvictions=true|false (ALPHA - default=false)
      --google-json-key string                   The Google Cloud Platform Service Account JSON Key to use for authentication.
      --kube-api-burst int32                     Burst to use while talking with kubernetes apiserver (default 100)
      --kube-api-content-type string             Content type of requests sent to apiserver. (default "application/vnd.kubernetes.protobuf")
      --kube-api-qps float32                     QPS to use while talking with kubernetes apiserver (default 50)
      --kubeconfig string                        Path to kubeconfig file with authorization and master location information.
      --leader-elect                             Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability. (default true)
      --leader-elect-lease-duration duration     The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled. (default 15s)
      --leader-elect-renew-deadline duration     The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled. (default 10s)
      --leader-elect-resource-lock endpoints     The type of resource resource object that is used for locking duringleader election. Supported options are endpoints (default) and `configmap`. (default "endpoints")
      --leader-elect-retry-period duration       The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled. (default 2s)
      --lock-object-name string                  Define the name of the lock object. (default "kube-scheduler")
      --lock-object-namespace string             Define the namespace of the lock object. (default "kube-system")
      --master string                            The address of the Kubernetes API server (overrides any value in kubeconfig)
      --policy-config-file string                File with scheduler policy configuration. This file is used if policy ConfigMap is not provided or --use-legacy-policy-config==true
      --policy-configmap string                  Name of the ConfigMap object that contains scheduler's policy configuration. It must exist in the system namespace before scheduler initialization if --use-legacy-policy-config==false. The config must be provided as the value of an element in 'Data' map with the key='policy.cfg'
      --policy-configmap-namespace string        The namespace where policy ConfigMap is located. The system namespace will be used if this is not provided or is empty. (default "kube-system")
      --port int32                               The port that the scheduler's http service runs on (default 10251)
      --profiling                                Enable profiling via web interface host:port/debug/pprof/ (default true)
      --scheduler-name string                    Name of the scheduler, used to select which pods will be processed by this scheduler, based on pod's "spec.SchedulerName". (default "default-scheduler")
      --use-legacy-policy-config                 When set to true, scheduler will ignore policy ConfigMap and uses policy config file
      --version version[=true]                   Print version information and quit
```-->
```
      --algorithm-provider string                调度算法的提供者，下列之一：ClusterAutoscalerProvider | DefaultProvider (默认 "DefaultProvider")
      --azure-container-registry-config string   Azure容器仓库配置信息文件路径
      --contention-profiling                     在启用分析后，可启用锁竞争分析
      --feature-gates mapStringBool              一组描述alpha/experimental特性的键值对。选项是：
Accelerators=true|false (ALPHA - default=false)
AdvancedAuditing=true|false (ALPHA - default=false)
AffinityInAnnotations=true|false (ALPHA - default=false)
AllAlpha=true|false (ALPHA - default=false)
AllowExtTrafficLocalEndpoints=true|false (default=true)
AppArmor=true|false (BETA - default=true)
DynamicKubeletConfig=true|false (ALPHA - default=false)
DynamicVolumeProvisioning=true|false (ALPHA - default=true)
ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)
ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)
LocalStorageCapacityIsolation=true|false (ALPHA - default=false)
PersistentLocalVolumes=true|false (ALPHA - default=false)
RotateKubeletClientCertificate=true|false (ALPHA - default=false)
RotateKubeletServerCertificate=true|false (ALPHA - default=false)
StreamingProxyRedirects=true|false (BETA - default=true)
TaintBasedEvictions=true|false (ALPHA - default=false)
      --google-json-key string                   Google Cloud Platform认证使用的账户服务JSON Key
      --kube-api-burst int32                     与kubernetes apiserver通信时突发值（默认 100）
      --kube-api-content-type string             protobuf")发送至apiserver的请求内容类型。（默认 "application/vnd.kubernetes"）
      --kube-api-qps float32                     与kubernetes apiserver通信时的QPS（默认 50）
      --kubeconfig string                        拥有授权和master节点位置信息的kubeconfig文件路径。
      --leader-elect                             启动选主客户端，并在执行主循环前获得新主。当运行了高可用的复制组件时可启用。（默认true）
      --leader-elect-lease-duration duration     非主的候选节点在观察到主节点更新事件后将等待，直到尝试升级为主但没有刷新主节点为止。这是主节点在被其它候选节点取代前可以停止的最大有效时间。只有在选主开启时才可用。（默认 15秒）
      --leader-elect-renew-deadline duration     在执行master节点停止前刷新主节点的重试间隔时间。它必须小于或等于释放时长。只有在选主开启时才可用。（默认 10秒）
      --leader-elect-resource-lock endpoints     在选主过程中需要锁的资源对象类型。支持的选项是endpoints（默认）和`configmap`。（默认 "endpoints")
      --leader-elect-retry-period duration       客户端在尝试获取新主时应该等待的时长。只有在选主开启时才可用。（默认 2秒）
      --lock-object-name string                  定义锁对象的名字。（默认 "kube-scheduler"）
      --lock-object-namespace string             定义锁对象的命名空间。（默认 "kube-system"）
      --master string                            Kubernetes API Server地址（覆盖kubeconfig的任何值）
      --policy-config-file string                scheduler策略配置文件。该文件在策略ConfigMap未被提供时或 --use-legacy-policy-config==true时使用。
      --policy-configmap string                  包含scheduler策略配置信息的ConfigMap对象的名字。如果--use-legacy-policy-config==false时，在scheduler初始化之前它必须存在于系统命名空间。该配置必须作为'Data' map中key为'policy.cfg'的对应值，
      --policy-configmap-namespace string        策略ConfigMap所在的命名空间，若未设置或为空则使用系统命名空间（默认 "kube-system"）
      --port int32                               scheduler的http服务使用的端口（默认 10251）
      --profiling                                启用通过网络接口 host:port/debug/pprof/ 进行分析（默认 true）
      --scheduler-name string                    scheduler的名字，基于Pod的"spec.SchedulerName"字段来选择那些由这个scheduler处理的Pods。（默认 "default-scheduler"）
      --use-legacy-policy-config                 当为true时，scheduler会忽略策略ConfigMap并使用策略配置文件
      --version version[=true]                   打印版本信息并退出
```


###### Auto generated by spf13/cobra on 11-Jul-2017
