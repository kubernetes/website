---
title: kube-scheduler
notitle: true
---
## kube-scheduler



<!--
### Synopsis


The Kubernetes scheduler is a policy-rich, topology-aware,
workload-specific function that significantly impacts availability, performance,
and capacity. The scheduler needs to take into account individual and collective
resource requirements, quality of service requirements, hardware/software/policy
constraints, affinity and anti-affinity specifications, data locality, inter-workload
interference, deadlines, and so on. Workload-specific requirements will be exposed
through the API as necessary.
-->
### 概要


Kubernetes 调度器是一个策略丰富、拓扑感知、工作负载特定的功能，显著影响可用性、性能和容量。调度器需要考虑个人和集体
的资源要求、服务质量要求、硬件/软件/政策约束、亲和力和反亲和力规范、数据局部性、负载间干扰、完成期限等。
工作负载特定的要求必要时将通过 API 暴露。

```
kube-scheduler [flags]
```

<!--
### Options
-->
### 选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
    <!--
      <td colspan="2">--address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "0.0.0.0"</td>
    -->
      <td colspan="2">--address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "0.0.0.0"</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: the IP address on which to listen for the --port port (set to 0.0.0.0 for all IPv4 interfaces and :: for all IPv6 interfaces). See --bind-address instead.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 要监听 --port 端口的 IP 地址（对于所有 IPv4 接口设置为 0.0.0.0，对于所有 IPv6 接口设置为 ::）。 请参阅 --bind-address。</td>
    </tr>

    <tr>
      <td colspan="2">--algorithm-provider string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: the scheduling algorithm provider to use, one of: ClusterAutoscalerProvider | DefaultProvider</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 要使用的调度算法，可选值：ClusterAutoscalerProvider |DefaultProvider</td>
    </tr>

    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file containing Azure container registry configuration information.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">包含 Azure 容器仓库配置信息的文件的路径。</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the configuration file. Flags override values in this file.</td>
      -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">配置文件的路径。标志会覆盖此文件中的值。</td>
    </tr>

    <tr>
      <td colspan="2">--contention-profiling</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: enable lock contention profiling, if profiling is enabled</td>
      -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 如果启用了性能分析，则启用锁竞争分析</td>
    </tr>

    <tr>
      <td colspan="2">--feature-gates mapStringBool</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (ALPHA - default=false)<br/>AdvancedAuditing=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>AttachVolumeLimit=true|false (ALPHA - default=false)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BlockVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (BETA - default=true)<br/>CSIBlockVolume=true|false (ALPHA - default=false)<br/>CSIPersistentVolume=true|false (BETA - default=true)<br/>CustomPodDNS=true|false (BETA - default=true)<br/>CustomResourceSubresources=true|false (BETA - default=true)<br/>CustomResourceValidation=true|false (BETA - default=true)<br/>DebugContainers=true|false (ALPHA - default=false)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>DynamicProvisioningScheduling=true|false (ALPHA - default=false)<br/>EnableEquivalenceClassCache=true|false (ALPHA - default=false)<br/>ExpandInUsePersistentVolumes=true|false (ALPHA - default=false)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalCriticalPodAnnotation=true|false (ALPHA - default=false)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>GCERegionalPersistentDisk=true|false (BETA - default=true)<br/>HugePages=true|false (BETA - default=true)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>KubeletPluginsWatcher=true|false (ALPHA - default=false)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>MountContainers=true|false (ALPHA - default=false)<br/>MountPropagation=true|false (BETA - default=true)<br/>PersistentLocalVolumes=true|false (BETA - default=true)<br/>PodPriority=true|false (BETA - default=true)<br/>PodReadinessGates=true|false (BETA - default=false)<br/>PodShareProcessNamespace=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>ReadOnlyAPIDataVolumes=true|false (DEPRECATED - default=true)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>ResourceQuotaScopeSelectors=true|false (ALPHA - default=false)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (ALPHA - default=false)<br/>RunAsGroup=true|false (ALPHA - default=false)<br/>ScheduleDaemonSetPods=true|false (ALPHA - default=false)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>ServiceProxyAllowExternalIPs=true|false (DEPRECATED - default=false)<br/>StorageObjectInUseProtection=true|false (default=true)<br/>StreamingProxyRedirects=true|false (BETA - default=true)<br/>SupportIPVSProxyMode=true|false (default=true)<br/>SupportPodPidsLimit=true|false (ALPHA - default=false)<br/>Sysctls=true|false (BETA - default=true)<br/>TaintBasedEvictions=true|false (ALPHA - default=false)<br/>TaintNodesByCondition=true|false (ALPHA - default=false)<br/>TokenRequest=true|false (ALPHA - default=false)<br/>TokenRequestProjection=true|false (ALPHA - default=false)<br/>VolumeScheduling=true|false (BETA - default=true)<br/>VolumeSubpath=true|false (default=true)<br/>VolumeSubpathEnvExpansion=true|false (ALPHA - default=false)</td>
      -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一组 key=value 对，用于描述 alpha/experimental 特征的特征门。选项包括：<br/>APIListChunking=true|false (BETA - 默认=true)<br/>APIResponseCompression=true|false (ALPHA - 默认=false)<br/>AdvancedAuditing=true|false (BETA - 默认=true)<br/>AllAlpha=true|false (ALPHA - 默认=false)<br/>AppArmor=true|false (BETA - 默认=true)<br/>AttachVolumeLimit=true|false (ALPHA - 默认=false)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - 默认=false)<br/>BlockVolume=true|false (ALPHA - 默认=false)<br/>CPUManager=true|false (BETA - 默认=true)<br/>CRIContainerLogRotation=true|false (BETA - 默认=true)<br/>CSIBlockVolume=true|false (ALPHA - 默认=false)<br/>CSIPersistentVolume=true|false (BETA - 默认=true)<br/>CustomPodDNS=true|false (BETA - 默认=true)<br/>CustomResourceSubresources=true|false (BETA - 默认=true)<br/>CustomResourceValidation=true|false (BETA - 默认=true)<br/>DebugContainers=true|false (ALPHA - 默认=false)<br/>DevicePlugins=true|false (BETA - 默认=true)<br/>DynamicKubeletConfig=true|false (BETA - 默认=true)<br/>DynamicProvisioningScheduling=true|false (ALPHA - 默认=false)<br/>EnableEquivalenceClassCache=true|false (ALPHA - 默认=false)<br/>ExpandInUsePersistentVolumes=true|false (ALPHA - 默认=false)<br/>ExpandPersistentVolumes=true|false (BETA - 默认=true)<br/>ExperimentalCriticalPodAnnotation=true|false (ALPHA - 默认=false)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 默认=false)<br/>GCERegionalPersistentDisk=true|false (BETA - 默认=true)<br/>HugePages=true|false (BETA - 默认=true)<br/>HyperVContainer=true|false (ALPHA - 默认=false)<br/>KubeletPluginsWatcher=true|false (ALPHA - 默认=false)<br/>LocalStorageCapacityIsolation=true|false (BETA - 默认=true)<br/>MountContainers=true|false (ALPHA - 默认=false)<br/>MountPropagation=true|false (BETA - 默认=true)<br/>PersistentLocalVolumes=true|false (BETA - 默认=true)<br/>PodPriority=true|false (BETA - 默认=true)<br/>PodReadinessGates=true|false (BETA - 默认=false)<br/>PodShareProcessNamespace=true|false (ALPHA - 默认=false)<br/>QOSReserved=true|false (ALPHA - 默认=false)<br/>ReadOnlyAPIDataVolumes=true|false (弃用 - 默认=true)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - 默认=false)<br/>ResourceQuotaScopeSelectors=true|false (ALPHA - 默认=false)<br/>RotateKubeletClientCertificate=true|false (BETA - 默认=true)<br/>RotateKubeletServerCertificate=true|false (ALPHA - 默认=false)<br/>RunAsGroup=true|false (ALPHA - 默认=false)<br/>ScheduleDaemonSetPods=true|false (ALPHA - 默认=false)<br/>ServiceNodeExclusion=true|false (ALPHA - 默认=false)<br/>ServiceProxyAllowExternalIPs=true|false (弃用 - 默认=false)<br/>StorageObjectInUseProtection=true|false (默认=true)<br/>StreamingProxyRedirects=true|false (BETA - 默认=true)<br/>SupportIPVSProxyMode=true|false (默认=true)<br/>SupportPodPidsLimit=true|false (ALPHA - 默认=false)<br/>Sysctls=true|false (BETA - 默认=true)<br/>TaintBasedEvictions=true|false (ALPHA - 默认=false)<br/>TaintNodesByCondition=true|false (ALPHA - 默认=false)<br/>TokenRequest=true|false (ALPHA - 默认=false)<br/>TokenRequestProjection=true|false (ALPHA - 默认=false)<br/>VolumeScheduling=true|false (BETA - 默认=true)<br/>VolumeSubpath=true|false (默认=true)<br/>VolumeSubpathEnvExpansion=true|false (ALPHA - 默认=false)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for kube-scheduler</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kube-scheduler 帮助信息</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td>
    -->
      <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 100</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: burst to use while talking with kubernetes apiserver</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 每秒与 kubernetes apiserver 交互的数量</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td>
    -->
      <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "application/vnd.kubernetes.protobuf"</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: content type of requests sent to apiserver.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 发送到 apiserver 的请求的内容类型</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 50</td>
    -->
      <td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 50</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: QPS to use while talking with kubernetes apiserver</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 与 kubernetes apiserver 交互时使用的 QPS</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: path to kubeconfig file with authorization and master location information.</td>
    -->
    <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 包含授权和 master 位置信息的 kubeconfig 文件的路径。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
    -->
      <td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: true</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">在执行主循环之前，启动 leader 选举客户端并获得领导能力。在运行复制组件以实现高可用性时启用此选项。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15s</td>
    -->
      <td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 15s</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">非 leader 候选人在观察领导层续约之后将等待的时间，直到试图获得领导但尚未更新的 leader 位置。这实际上是 leader 在被另一个候选人替换之前可以停止的最长持续时间。这仅适用于启用 leader 选举的情况。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
    -->
      <td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 10s</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">代理 master 在停止领导之前更新领导位置的时间间隔。这必须小于或等于租约期限。这仅适用于启用 leader 选举的情况</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--leader-elect-resource-lock endpoints&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "endpoints"</td>
    -->
      <td colspan="2">--leader-elect-resource-lock endpoints&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "endpoints"</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The type of resource object that is used for locking during leader election. Supported options are endpoints (default) and `configmaps`.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">在 leader 选举期间用于锁定的资源对象的类型。支持的选项是 endpoints (默认) 和 `configmaps`。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2s</td>
    -->
      <td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 2s</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration the clients should wait between attempting acquisition and renewal of a leadership. This is only applicable if leader election is enabled.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">客户端在尝试获取和更新领导之间应该等待的持续时间。这仅适用于启用leader选举的情况。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--lock-object-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-scheduler"</td>
    -->
      <td colspan="2">--lock-object-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "kube-scheduler"</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: define the name of the lock object.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 定义锁对象的名称。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--lock-object-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"</td>
    -->
      <td colspan="2">--lock-object-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "kube-system"</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: define the namespace of the lock object.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 定义锁对象的命名空间。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
    -->
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 5s</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">日志刷新最大间隔</td>
    </tr>

    <tr>
      <td colspan="2">--master string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The address of the Kubernetes API server (overrides any value in kubeconfig)</td>
      -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Kubernetes API 服务器的地址（覆盖 kubeconfig 中的任何值）</td>
    </tr>

    <tr>
      <td colspan="2">--policy-config-file string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: file with scheduler policy configuration. This file is used if policy ConfigMap is not provided or --use-legacy-policy-config=true</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 包含调度器策略配置的文件。如果未提供策略 ConfigMap 或 --use-legacy-policy-config==true，则使用此文件</td>
    </tr>

    <tr>
      <td colspan="2">--policy-configmap string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: name of the ConfigMap object that contains scheduler's policy configuration. It must exist in the system namespace before scheduler initialization if --use-legacy-policy-config=false. The config must be provided as the value of an element in 'Data' map with the key='policy.cfg'</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 包含调度器策略配置的 ConfigMap 对象的名称。如果 --use-legacy-policy-config==false，它必须在调度器初始化之前存在于系统命名空间中。配置必须作为 'Data' 映射中元素的值提供，其中 key='policy.cfg'</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--policy-configmap-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"</td>
    -->
      <td colspan="2">--policy-configmap-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "kube-system"</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: the namespace where policy ConfigMap is located. The kube-system namespace will be used if this is not provided or is empty.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 策略 ConfigMap 所在的命名空间。 如果未提供此命名空间或为空，则将使用系统命名空间。</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10251</td>
    -->
      <td colspan="2">--port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 10251</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: the port on which to serve HTTP insecurely without authentication and authorization. If 0, don't serve HTTPS at all. See --secure-port instead.</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 不安全地提供没有身份验证和授权的 HTTP 端口。 如果为0，则根本不提供 HTTPS。 请参阅 --secure-port。</td>
    </tr>

    <tr>
      <td colspan="2">--profiling</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: enable profiling via web interface host:port/debug/pprof/</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 通过 web 接口 host:port/debug/pprof/ 启动性能分析</td>
    </tr>

    <tr>
    <!--
      <td colspan="2">--scheduler-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "default-scheduler"</td>
    -->
      <td colspan="2">--scheduler-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: "default-scheduler"</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: name of the scheduler, used to select which pods will be processed by this scheduler, based on pod's "spec.schedulerName".</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 调度器名称，用于根据 pod 的 "spec.SchedulerName" 选择哪些 pod 将被此调度器处理。</td>
    </tr>

    <tr>
      <td colspan="2">--use-legacy-policy-config</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">DEPRECATED: when set to true, scheduler will ignore policy ConfigMap and uses policy config file</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">弃用: 当设置为 true 时，调度器将忽略策略 ConfigMap 并使用策略配置文件</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td>
    -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">打印版本信息并退出</td>
    </tr>

    <tr>
      <td colspan="2">--write-config-to string</td>
    </tr>
    <tr>
    <!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">If set, write the configuration values to this file and exit.</td>
      -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">如果设置，将配置值写入此文件并退出。</td>
    </tr>

  </tbody>
</table>
