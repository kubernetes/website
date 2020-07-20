---
title: kube-controller-manager
content_template: templates/tool-reference
weight: 30
---

## {{% heading "synopsis" %}}

<!--
The Kubernetes controller manager is a daemon that embeds
the core control loops shipped with Kubernetes. In applications of robotics and
automation, a control loop is a non-terminating loop that regulates the state of
the system. In Kubernetes, a controller is a control loop that watches the shared
state of the cluster through the apiserver and makes changes attempting to move the
current state towards the desired state. Examples of controllers that ship with
Kubernetes today are the replication controller, endpoints controller, namespace
controller, and serviceaccounts controller.
-->

Kubernetes 控制器管理器是一个守护进程，内嵌随 Kubernetes 一起发布的核心控制回路。
在机器人和自动化的应用中，控制回路是一个永不休止的循环，用于调节系统状态。
在 Kubernetes 中，每个控制器是一个控制回路，通过 API 服务器监视集群的共享状态，
并尝试进行更改以将当前状态转为期望状态。
目前，Kubernetes 自带的控制器例子包括副本控制器、节点控制器、命名空间控制器和服务账号控制器等。

```
kube-controller-manager [flags]
```

## {{% heading "options" %}}

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--add-dir-header</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">If true, adds the file directory to the header</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">若为 true，将文件目录添加到头部。</td>
</tr>

<tr>
<td colspan="2">--allocate-node-cidrs</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Should CIDRs for Pods be allocated and set on the cloud provider.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">基于云供应商特性来为 Pod 分配和设置子网掩码。</td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">log to standard error as well as files</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在向文件输出日志的同时，也将日志写到标准输出。</td>
</tr>

<tr>
<!--
<td colspan="2">--attach-detach-reconcile-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
-->
<td colspan="2">--attach-detach-reconcile-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：1m0s</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The reconciler sync wait time between volume attach detach. This duration must be larger than one second, and increasing this value from the default may allow for volumes to be mismatched with pods.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">协调器（reconciler）在相邻两次对存储卷进行挂载和解除挂载操作之间的等待时间。此时长必须长于 1 秒钟。此值设置为大于默认值时，可能导致存储卷无法与 Pods 匹配。</td>
</tr>

<tr>
<td colspan="2">--authentication-kubeconfig string</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">kubeconfig file pointing at the 'core' kubernetes server with enough rights to create tokenreviews.authentication.k8s.io. This is optional. If empty, all token requests are considered to be anonymous and no client CA is looked up in the cluster.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">kubeconfig 文件的路径名。该文件中包含与某 Kubernetes “核心” 服务器相关的信息，并支持足够的权限以创建 tokenreviews.authentication.k8s.io。此选项是可选的。如果设置为空值，所有令牌请求都会被认作匿名请求，Kubernetes 也不再在集群中查找客户端的 CA 证书信息。</td>
</tr>

<tr>
<td colspan="2">--authentication-skip-lookup</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">If false, the authentication-kubeconfig will be used to lookup missing authentication configuration from the cluster.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">此值为 false 时，通过 authentication-kubeconfig 参数所指定的文件会被用来检索集群中缺失的身份认证配置信息。</td>
</tr>

<tr>
<!--
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
-->
<td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：10s</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache responses from the webhook token authenticator.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">对 Webhook 令牌认证设施返回结果的缓存时长。</td>
</tr>

<tr>
<td colspan="2">--authentication-tolerate-lookup-failure</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">If true, failures to look up missing authentication configuration from the cluster are not considered fatal. Note that this can result in authentication that treats all requests as anonymous.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">此值 true 时，即使无法从集群中检索到缺失的身份认证配置信息也无大碍。需要注意的是，这样设置可能导致所有请求都被视作匿名请求。</td>
</tr>

<tr>
<!--
<td colspan="2">--authorization-always-allow-paths stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [/healthz]</td>
-->
<td colspan="2">--authorization-always-allow-paths stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：[/healthz]</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">A list of HTTP paths to skip during authorization, i.e. these are authorized without contacting the 'core' kubernetes server.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">鉴权过程中会忽略的一个 HTTP 路径列表。换言之，控制器管理器会对列表中路径的访问进行授权，并且无须征得 Kubernetes “核心” 服务器同意。</td>
</tr>

<tr>
<td colspan="2">--authorization-kubeconfig string</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">kubeconfig file pointing at the 'core' kubernetes server with enough rights to create subjectaccessreviews.authorization.k8s.io. This is optional. If empty, all requests not skipped by authorization are forbidden.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">包含 Kubernetes “核心” 服务器信息的 kubeconfig 文件路径，所包含信息具有创建 subjectaccessreviews.authorization.k8s.io 的足够权限。此参数是可选的。如果配置为空字符串，未被鉴权模块所忽略的请求都会被禁止。</td>
</tr>

<tr>
<!--
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
-->
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：10s</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache 'authorized' responses from the webhook authorizer.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">对 Webhook 形式鉴权组件所返回的“已授权（Authorized）”响应的缓存时长。</td>
</tr>

<tr>
<!--
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td>
-->
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：10s</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The duration to cache 'unauthorized' responses from the webhook authorizer.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">对 Webhook 形式鉴权组件所返回的“未授权（Unauthorized）”响应的缓存时长。</td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file containing Azure container registry configuration information.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">指向包含 Azure 容器仓库配置信息的文件的路径名。</td>
</tr>

<tr>
<!--
<td colspan="2">--bind-address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.0.0.0</td>
-->
<td colspan="2">--bind-address ip&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：0.0.0.0</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address on which to listen for the --secure-port port. The associated interface(s) must be reachable by the rest of the cluster, and by CLI/web clients. If blank or an unspecified address (0.0.0.0 or ::), all interfaces will be used.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">针对 --secure-port 端口上请求执行监听操作的 IP 地址。所对应的网络接口必须从集群中其它位置可访问（含命令行及 Web 客户端）。如果此值为空或者设定为非特定地址（0.0.0.0 或 ::），意味着所有网络接口都在监听范围。</td>
</tr>

<tr>
<td colspan="2">--cert-dir string</td>
</tr>
<tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored.</td>
-->
<td></td><td style="line-height: 130%; word-wrap: break-word;">TLS 证书所在的目录。如果提供了 --tls-cert-file 和 --tls-private-key-file，此标志会被忽略。</td>
</tr>

<tr>
<!-- td colspan="2">--cidr-allocator-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "RangeAllocator"</td -->
<td colspan="2">--cidr-allocator-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："RangeAllocator"</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Type of CIDR allocator to use</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">要使用的 CIDR 分配器类型。</td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">如果设置了此标志，对于所有能够提供客户端证书的请求，若该证书由 client-ca-file 中所给机构之一签署，则该请求会被成功认证为客户端证书中 CommonName 所给的实体。</td>
</tr>

<tr>
<td colspan="2">--cloud-config string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the cloud provider configuration file. Empty string for no configuration file.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">云驱动程序配置文件的路径。空字符串表示没有配置文件。</td>
</tr>

<tr>
<td colspan="2">--cloud-provider string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The provider for cloud services. Empty string for no provider.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">云服务的提供者。空字符串表示没有对应的提供者（驱动）。</td>
</tr>

<tr>
<td colspan="2">--cluster-cidr string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">CIDR Range for Pods in cluster. Requires --allocate-node-cidrs to be true</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">集群中 Pods 的 CIDR 范围。要求 --allocate-node-cidrs 标志为 true。</td>
</tr>

<tr>
<!-- td colspan="2">--cluster-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kubernetes"</td -->
<td colspan="2">--cluster-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："kubernetes"</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The instance prefix for the cluster.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">集群实例的前缀。</td>
</tr>

<tr>
<!-- td colspan="2">--cluster-signing-cert-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/ca/ca.pem"</td -->
<td colspan="2">--cluster-signing-cert-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/ca/ca.pem"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">包含 PEM 编码格式的 X509 CA 证书的文件名。该证书用来发放集群范围的证书。</td>
</tr>

<tr>
<!-- td colspan="2">--cluster-signing-key-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/ca/ca.key"</td -->
<td colspan="2">--cluster-signing-key-file string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/ca/ca.key"</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Filename containing a PEM-encoded RSA or ECDSA private key used to sign cluster-scoped certificates</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">包含 PEM 编码的 RSA 或 ECDSA 私钥的文件名。该私钥用来对集群范围证书签名。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent-deployment-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td -->
<td colspan="2">--concurrent-deployment-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of deployment objects that are allowed to sync concurrently. Larger number = more responsive deployments, but more CPU (and network) load</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并发同步的 Deployment 对象个数。数值越大意味着对 Deployment 的响应越及时，同时也意味着更大的 CPU（和网络带宽）压力。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent-endpoint-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td -->
<td colspan="2">--concurrent-endpoint-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of endpoint syncing operations that will be done concurrently. Larger number = faster endpoint updating, but more CPU (and network) load</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并发执行的 Endpoints 同步操作个数。数值越大意味着更快的 Endpoints 更新操作，同时也意味着更大的 CPU （和网络）压力。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent-gc-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 20</td -->
<td colspan="2">--concurrent-gc-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：20</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of garbage collector workers that are allowed to sync concurrently.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并发同步的垃圾收集工作线程个数。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent-namespace-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10</td -->
<td colspan="2">--concurrent-namespace-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：10</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of namespace objects that are allowed to sync concurrently. Larger number = more responsive namespace termination, but more CPU (and network) load</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并发同步的 Namespace 对象个数。较大的数值意味着更快的名字空间终结操作，不过也意味着更多的 CPU （和网络）占用。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent-replicaset-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td -->
<td colspan="2">--concurrent-replicaset-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of replica sets that are allowed to sync concurrently. Larger number = more responsive replica management, but more CPU (and network) load</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并发同步的 ReplicaSet 个数。数值越大意味着副本管理的响应速度越快，同时也意味着更多的 CPU （和网络）占用。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent-resource-quota-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td -->
<td colspan="2">--concurrent-resource-quota-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of resource quotas that are allowed to sync concurrently. Larger number = more responsive quota management, but more CPU (and network) load</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并发同步的 ResourceQuota 对象个数。数值越大，配额管理的响应速度越快，不过对 CPU （和网络）的占用也越高。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent-service-endpoint-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td -->
<td colspan="2">--concurrent-service-endpoint-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of service endpoint syncing operations that will be done concurrently. Larger number = faster endpoint slice updating, but more CPU (and network) load. Defaults to 5.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并发执行的服务端点同步操作个数。数值越大，端点片段（Endpoint Slice）的更新速度越快，不过对 CPU （和网络）的占用也越高。默认值为 5。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent-service-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1</td -->
<td colspan="2">--concurrent-service-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：1</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of services that are allowed to sync concurrently. Larger number = more responsive service management, but more CPU (and network) load</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并发同步的 Service 对象个数。数值越大，服务管理的响应速度越快，不过对 CPU （和网络）的占用也越高。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent-serviceaccount-token-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td -->
<td colspan="2">--concurrent-serviceaccount-token-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of service account token objects that are allowed to sync concurrently. Larger number = more responsive token generation, but more CPU (and network) load</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并发同步的服务账号令牌对象个数。数值越大，令牌生成的速度越快，不过对 CPU （和网络）的占用也越高。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent-statefulset-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td -->
<td colspan="2">--concurrent-statefulset-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of statefulset objects that are allowed to sync concurrently. Larger number = more responsive statefulsets, but more CPU (and network) load</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并发同步的 StatefulSet 对象个数。数值越大，StatefulSet 管理的响应速度越快，不过对 CPU （和网络）的占用也越高。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent-ttl-after-finished-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td -->
<td colspan="2">--concurrent-ttl-after-finished-syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of TTL-after-finished controller workers that are allowed to sync concurrently.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并行同步的 TTL-after-finished 控制器线程个数。</td>
</tr>

<tr>
<!-- td colspan="2">--concurrent_rc_syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5</td -->
<td colspan="2">--concurrent_rc_syncs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The number of replication controllers that are allowed to sync concurrently. Larger number = more responsive replica management, but more CPU (and network) load</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可以并发同步的 ReplicationController 对象个数。数值越大，副本管理的响应速度越快，不过对 CPU （和网络）的占用也越高。</td>
</tr>

<tr>
<!-- td colspan="2">--configure-cloud-routes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td -->
<td colspan="2">--configure-cloud-routes&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：true</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Should CIDRs allocated by allocate-node-cidrs be configured on the cloud provider.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">决定是否由 --allocate-node-cidrs 所分配的 CIDR 要通过云驱动程序来配置。</td>
</tr>

<tr>
<td colspan="2">--contention-profiling</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Enable lock contention profiling, if profiling is enabled</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在启用了性能分析（profiling）时，也启用锁竞争情况分析。</td>
</tr>

<tr>
<td colspan="2">--controller-start-interval duration</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Interval between starting controller managers.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在两次启动控制器管理器之间的时间间隔。</td>
</tr>

<tr>
<!-- td colspan="2">--controllers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [*]</td -->
<td colspan="2">--controllers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：[*]</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">A list of controllers to enable. '*' enables all on-by-default controllers, 'foo' enables the controller named 'foo', '-foo' disables the controller named 'foo'.<br/>All controllers: attachdetach, bootstrapsigner, cloud-node-lifecycle, clusterrole-aggregation, cronjob, csrapproving, csrcleaner, csrsigning, daemonset, deployment, disruption, endpoint, endpointslice, garbagecollector, horizontalpodautoscaling, job, namespace, nodeipam, nodelifecycle, persistentvolume-binder, persistentvolume-expander, podgc, pv-protection, pvc-protection, replicaset, replicationcontroller, resourcequota, root-ca-cert-publisher, route, service, serviceaccount, serviceaccount-token, statefulset, tokencleaner, ttl, ttl-after-finished<br/>Disabled-by-default controllers: bootstrapsigner, tokencleaner</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">要启用的控制器列表。* 表示启用所有默认启用的控制器；foo 启用名为 foo 的控制器；-foo 表示禁用名为 foo 的控制器。<br/>
控制器的全集：attachdetach、bootstrapsigner、cloud-node-lifecycle、clusterrole-aggregation、cronjob、csrapproving、csrcleaner、csrsigning、daemonset、deployment、disruption、endpoint、endpointslice、garbagecollector、horizontalpodautoscaling、job、namespace、nodeipam、nodelifecycle、persistentvolume-binder、persistentvolume-expander、podgc、pv-protection、pvc-protection、replicaset、replicationcontroller、resourcequota、root-ca-cert-publisher、route、service、serviceaccount、serviceaccount-token、statefulset、tokencleaner、ttl、ttl-after-finished<br/>
默认禁用的控制器有：bootstrapsigner 和 tokencleaner。</td>
</tr>

<tr>
<!-- td colspan="2">--deployment-controller-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td -->
<td colspan="2">--deployment-controller-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：30s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Period for syncing the deployments.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">Deployment 资源的同步周期。</td>
</tr>

<tr>
<td colspan="2">--disable-attach-detach-reconcile-sync</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Disable volume attach detach reconciler sync. Disabling this may cause volumes to be mismatched with pods. Use wisely.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">禁用卷挂接/解挂调节器的同步。禁用此同步可能导致卷存储与 Pod 之间出现错位。请小心使用。</td>
</tr>

<tr>
<!-- td colspan="2">--enable-dynamic-provisioning&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td -->
<td colspan="2">--enable-dynamic-provisioning&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：true</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Enable dynamic provisioning for environments that support it.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在环境允许的情况下启用动态卷供应。</td>
</tr>

<tr>
<!-- td colspan="2">--enable-garbage-collector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td -->
<td colspan="2">--enable-garbage-collector&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">启用通用垃圾收集器。必须与 kube-apiserver 中对应的标志一致。</td>
</tr>

<tr>
<td colspan="2">--enable-hostpath-provisioner</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Enable HostPath PV provisioning when running without a cloud provider. This allows testing and development of provisioning features.  HostPath provisioning is not supported in any way, won't work in a multi-node cluster, and should not be used for anything other than testing or development.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在没有云驱动程序的情况下，启用 HostPath 持久卷的供应。此参数便于对卷供应功能进行开发和测试。 HostPath 卷供应并非受支持的功能特性，在多节点的集群中也无法工作，因此除了开发和测试环境中不应使用。</td>
</tr>

<tr>
<!-- td colspan="2">--enable-taint-manager&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td -->
<td colspan="2">--enable-taint-manager&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：true</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">WARNING: Beta feature. If set to true enables NoExecute Taints and will evict all not-tolerating Pod running on Nodes tainted with this kind of Taints.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">警告：Beta 阶段特性。设置为 true 时会启用 NoExecute 污点，并在所有标记了此污点的节点上逐出所有无法忍受该污点的 Pods。</td>
</tr>

<tr>
<td colspan="2">--endpoint-updates-batch-period duration</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The length of endpoint updates batching period. Processing of pod changes will be delayed by this duration to join them with potential upcoming updates and reduce the overall number of endpoints updates. Larger number = higher endpoint programming latency, but lower number of endpoints revision generated</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">端点（Endpoint）批量更新周期时长。对 Pods 变更的处理会被延迟，以便将其与即将到来的更新操作合并，从而减少端点更新操作次数。较大的数值意味着端点更新的迟滞时间会增长，也意味着所生成的端点版本个数会变少。</td>
</tr>

<tr>
<td colspan="2">--endpointslice-updates-batch-period duration</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The length of endpoint slice updates batching period. Processing of pod changes will be delayed by this duration to join them with potential upcoming updates and reduce the overall number of endpoints updates. Larger number = higher endpoint programming latency, but lower number of endpoints revision generated</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">端点片段（Endpoint Slice）批量更新周期时长。对 Pods 变更的处理会被延迟，以便将其与即将到来的更新操作合并，从而减少端点更新操作次数。较大的数值意味着端点更新的迟滞时间会增长，也意味着所生成的端点版本个数会变少。</td>
</tr>

<tr>
<!-- td colspan="2">--experimental-cluster-signing-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 8760h0m0s</td -->
<td colspan="2">--experimental-cluster-signing-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：8760h0m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">所签署的证书的有效期时长。</td>
</tr>

<tr>
<td colspan="2">--external-cloud-volume-plugin string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The plugin to use when cloud provider is set to external. Can be empty, should only be set when cloud-provider is external. Currently used to allow node and volume controllers to work for in tree cloud providers.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">当云驱动程序设置为 external 时要使用的插件名称。此字符串可以为空。只能在云驱动程序为 external 时设置。目前用来保证节点控制器和卷控制器能够在三种云驱动上正常工作。</td>
</tr>

<tr>
<td colspan="2">--feature-gates mapStringBool</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIPriorityAndFairness=true|false (ALPHA - default=false)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllBeta=true|false (BETA - default=false)<br/>AllowInsecureBackendProxy=true|false (BETA - default=true)<br/>AnyVolumeDataSource=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BoundServiceAccountTokenVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (BETA - default=true)<br/>CSIInlineVolume=true|false (BETA - default=true)<br/>CSIMigration=true|false (BETA - default=true)<br/>CSIMigrationAWS=true|false (BETA - default=false)<br/>CSIMigrationAWSComplete=true|false (ALPHA - default=false)<br/>CSIMigrationAzureDisk=true|false (ALPHA - default=false)<br/>CSIMigrationAzureDiskComplete=true|false (ALPHA - default=false)<br/>CSIMigrationAzureFile=true|false (ALPHA - default=false)<br/>CSIMigrationAzureFileComplete=true|false (ALPHA - default=false)<br/>CSIMigrationGCE=true|false (BETA - default=false)<br/>CSIMigrationGCEComplete=true|false (ALPHA - default=false)<br/>CSIMigrationOpenStack=true|false (BETA - default=false)<br/>CSIMigrationOpenStackComplete=true|false (ALPHA - default=false)<br/>ConfigurableFSGroupPolicy=true|false (ALPHA - default=false)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>DefaultIngressClass=true|false (BETA - default=true)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DryRun=true|false (BETA - default=true)<br/>DynamicAuditing=true|false (ALPHA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EndpointSlice=true|false (BETA - default=true)<br/>EndpointSliceProxying=true|false (ALPHA - default=false)<br/>EphemeralContainers=true|false (ALPHA - default=false)<br/>EvenPodsSpread=true|false (BETA - default=true)<br/>ExpandCSIVolumes=true|false (BETA - default=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HugePageStorageMediumSize=true|false (ALPHA - default=false)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>IPv6DualStack=true|false (ALPHA - default=false)<br/>ImmutableEphemeralVolumes=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>LegacyNodeRoleBehavior=true|false (ALPHA - default=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>NodeDisruptionExclusion=true|false (ALPHA - default=false)<br/>NonPreemptingPriority=true|false (ALPHA - default=false)<br/>PodDisruptionBudget=true|false (BETA - default=true)<br/>PodOverhead=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RemoveSelfLink=true|false (ALPHA - default=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>RunAsGroup=true|false (BETA - default=true)<br/>RuntimeClass=true|false (BETA - default=true)<br/>SCTPSupport=true|false (ALPHA - default=false)<br/>SelectorIndex=true|false (ALPHA - default=false)<br/>ServerSideApply=true|false (BETA - default=true)<br/>ServiceAccountIssuerDiscovery=true|false (ALPHA - default=false)<br/>ServiceAppProtocol=true|false (ALPHA - default=false)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>ServiceTopology=true|false (ALPHA - default=false)<br/>StartupProbe=true|false (BETA - default=true)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>SupportNodePidsLimit=true|false (BETA - default=true)<br/>SupportPodPidsLimit=true|false (BETA - default=true)<br/>Sysctls=true|false (BETA - default=true)<br/>TTLAfterFinished=true|false (ALPHA - default=false)<br/>TokenRequest=true|false (BETA - default=true)<br/>TokenRequestProjection=true|false (BETA - default=true)<br/>TopologyManager=true|false (BETA - default=true)<br/>ValidateProxyRedirects=true|false (BETA - default=true)<br/>VolumeSnapshotDataSource=true|false (BETA - default=true)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (ALPHA - default=false)</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">一组 key=value 耦对，用来描述测试性/试验性功能的特性门控（Feature Gate）。可选项有：<br/>APIListChunking=true|false (BETA - default=true)<br/>APIPriorityAndFairness=true|false (ALPHA - default=false)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AllBeta=true|false (BETA - default=false)<br/>AllowInsecureBackendProxy=true|false (BETA - default=true)<br/>AnyVolumeDataSource=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BoundServiceAccountTokenVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (BETA - default=true)<br/>CSIInlineVolume=true|false (BETA - default=true)<br/>CSIMigration=true|false (BETA - default=true)<br/>CSIMigrationAWS=true|false (BETA - default=false)<br/>CSIMigrationAWSComplete=true|false (ALPHA - default=false)<br/>CSIMigrationAzureDisk=true|false (ALPHA - default=false)<br/>CSIMigrationAzureDiskComplete=true|false (ALPHA - default=false)<br/>CSIMigrationAzureFile=true|false (ALPHA - default=false)<br/>CSIMigrationAzureFileComplete=true|false (ALPHA - default=false)<br/>CSIMigrationGCE=true|false (BETA - default=false)<br/>CSIMigrationGCEComplete=true|false (ALPHA - default=false)<br/>CSIMigrationOpenStack=true|false (BETA - default=false)<br/>CSIMigrationOpenStackComplete=true|false (ALPHA - default=false)<br/>ConfigurableFSGroupPolicy=true|false (ALPHA - default=false)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>DefaultIngressClass=true|false (BETA - default=true)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DryRun=true|false (BETA - default=true)<br/>DynamicAuditing=true|false (ALPHA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EndpointSlice=true|false (BETA - default=true)<br/>EndpointSliceProxying=true|false (ALPHA - default=false)<br/>EphemeralContainers=true|false (ALPHA - default=false)<br/>EvenPodsSpread=true|false (BETA - default=true)<br/>ExpandCSIVolumes=true|false (BETA - default=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HugePageStorageMediumSize=true|false (ALPHA - default=false)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>IPv6DualStack=true|false (ALPHA - default=false)<br/>ImmutableEphemeralVolumes=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>LegacyNodeRoleBehavior=true|false (ALPHA - default=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>NodeDisruptionExclusion=true|false (ALPHA - default=false)<br/>NonPreemptingPriority=true|false (ALPHA - default=false)<br/>PodDisruptionBudget=true|false (BETA - default=true)<br/>PodOverhead=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)<br/>QOSReserved=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RemoveSelfLink=true|false (ALPHA - default=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>RunAsGroup=true|false (BETA - default=true)<br/>RuntimeClass=true|false (BETA - default=true)<br/>SCTPSupport=true|false (ALPHA - default=false)<br/>SelectorIndex=true|false (ALPHA - default=false)<br/>ServerSideApply=true|false (BETA - default=true)<br/>ServiceAccountIssuerDiscovery=true|false (ALPHA - default=false)<br/>ServiceAppProtocol=true|false (ALPHA - default=false)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>ServiceTopology=true|false (ALPHA - default=false)<br/>StartupProbe=true|false (BETA - default=true)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>SupportNodePidsLimit=true|false (BETA - default=true)<br/>SupportPodPidsLimit=true|false (BETA - default=true)<br/>Sysctls=true|false (BETA - default=true)<br/>TTLAfterFinished=true|false (ALPHA - default=false)<br/>TokenRequest=true|false (BETA - default=true)<br/>TokenRequestProjection=true|false (BETA - default=true)<br/>TopologyManager=true|false (BETA - default=true)<br/>ValidateProxyRedirects=true|false (BETA - default=true)<br/>VolumeSnapshotDataSource=true|false (BETA - default=true)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (ALPHA - default=false)</td>
</tr>

<tr>
<!-- td colspan="2">--flex-volume-plugin-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/"</td -->
<td colspan="2">--flex-volume-plugin-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/usr/libexec/kubernetes/kubelet-plugins/volume/exec/"</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Full path of the directory in which the flex volume plugin should search for additional third party volume plugins.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">FlexVolume 插件要搜索第三方卷插件的目录路径。</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">help for kube-controller-manager</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">kube-controller-manager 的帮助信息</td>
</tr>

<tr>
<!-- td colspan="2">--horizontal-pod-autoscaler-cpu-initialization-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td -->
<td colspan="2">--horizontal-pod-autoscaler-cpu-initialization-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5m0s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The period after pod start when CPU samples might be skipped.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">Pod 启动之后可以忽略 CPU 采样值的时长。</td>
</tr>

<tr>
<!-- td colspan="2">--horizontal-pod-autoscaler-downscale-stabilization duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td -->
<td colspan="2">--horizontal-pod-autoscaler-downscale-stabilization duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5m0s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The period for which autoscaler will look backwards and not scale down below any recommendation it made during that period.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">自动扩缩程序的回溯时长。自动扩缩器不会基于在给定的时长内所建议的规模对负载执行规模缩小的操作。</td>
</tr>

<tr>
<!-- td colspan="2">--horizontal-pod-autoscaler-initial-readiness-delay duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30s</td -->
<td colspan="2">--horizontal-pod-autoscaler-initial-readiness-delay duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：30s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The period after pod start during which readiness changes will be treated as initial readiness.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">Pod 启动之后，在此值所给定的时长内，就绪状态的变化都不会作为初始的就绪状态。</td>
</tr>

<tr>
<!-- td colspan="2">--horizontal-pod-autoscaler-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15s</td -->
<td colspan="2">--horizontal-pod-autoscaler-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：15s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The period for syncing the number of pods in horizontal pod autoscaler.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">水平 Pod 扩缩器对 Pods 数目执行同步操作的周期。</td>
</tr>

<tr>
<!-- td colspan="2">--horizontal-pod-autoscaler-tolerance float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.1</td -->
<td colspan="2">--horizontal-pod-autoscaler-tolerance float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：0.1</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">此值为目标值与实际值的比值与 1.0 的差值。只有超过此标志所设的阈值时，HPA 才会考虑执行缩放操作。</td>
</tr>

<tr>
<td colspan="2">--http2-max-streams-per-connection int</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The limit that the server gives to clients for the maximum number of streams in an HTTP/2 connection. Zero means to use golang's default.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">服务器为客户端所设置的 HTTP/2 连接中流式连接个数上限。此值为 0 表示采用 Go 语言库所设置的默认值。</td>
</tr>

<tr>
<!-- td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30</td -->
<td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：30</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Burst to use while talking with kubernetes apiserver.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">与 Kubernetes API 服务器通信时突发峰值请求个数上限。</td>
</tr>

<tr>
<!-- td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "application/vnd.kubernetes.protobuf"</td -->
<td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："application/vnd.kubernetes.protobuf"</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Content type of requests sent to apiserver.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">向 API 服务器发送请求时使用的内容类型（Content-Type）。</td>
</tr>

<tr>
<!-- td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 20</td -->
<td colspan="2">--kube-api-qps float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：20</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">QPS to use while talking with kubernetes apiserver.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">与 API 服务器通信时每秒请求数（QPS）限制。</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeconfig file with authorization and master location information.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">指向 kubeconfig 文件的路径。该文件中包含主控节点位置以及鉴权凭据信息。</td>
</tr>

<tr>
<!-- td colspan="2">--large-cluster-size-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 50</td -->
<td colspan="2">--large-cluster-size-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：50</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Number of nodes from which NodeController treats the cluster as large for the eviction logic purposes. --secondary-node-eviction-rate is implicitly overridden to 0 for clusters this size or smaller.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">节点控制器在执行 Pod 逐出操作逻辑时，基于此标志所设置的节点个数阈值来判断所在集群是否为大规模集群。当集群规模小于等于此规模时，--secondary-node-eviction-rate 会被隐式重设为 0。</td>
</tr>

<tr>
<!-- td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td -->
<td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：true</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Start a leader election client and gain leadership before executing the main loop. Enable this when running replicated components for high availability.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在执行主循环之前，启动领导选举（Leader Election）客户端，并尝试获得领导者身份。在运行多副本组件时启用此标志有助于提高可用性。</td>
</tr>

<tr>
<!-- td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15s</td -->
<td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：15s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The duration that non-leader candidates will wait after observing a leadership renewal until attempting to acquire leadership of a led but unrenewed leader slot. This is effectively the maximum duration that a leader can be stopped before it is replaced by another candidate. This is only applicable if leader election is enabled.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">对于未获得领导者身份的节点，在探测到领导者身份需要更迭时需要等待此标志所设置的时长，才能尝试去获得曾经是领导者但尚未续约的席位。本质上，这个时长也是现有领导者节点在被其他候选节点替代之前可以停止的最长时长。只有集群启用了领导者选举机制时，此标志才起作用。</td>
</tr>

<tr>
<!-- td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td -->
<td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：10s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The interval between attempts by the acting master to renew a leadership slot before it stops leading. This must be less than or equal to the lease duration. This is only applicable if leader election is enabled.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">当前执行领导者角色的节点在被停止履行领导职责之前可多次尝试续约领导者身份；此标志给出相邻两次尝试之间的间歇时长。此值必须小于或等于租期时长（Lease Duration）。仅在集群启用了领导者选举时有效。</td>
</tr>

<tr>
<!-- td colspan="2">--leader-elect-resource-lock endpoints&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "endpointsleases"</td -->
<td colspan="2">--leader-elect-resource-lock endpoints&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："endpointsleases"</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The type of resource object that is used for locking during leader election. Supported options are endpoints (default) and configmaps.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在领导者选举期间用来执行锁操作的资源对象类型。可选项为 endpointsleases （默认值）和 configmaps。</td>
</tr>

<tr>
<!-- td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-controller-manager"</td -->
<td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："kube-controller-manager"</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The name of resource object that is used for locking during leader election.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在领导者选举期间，用来执行锁操作的资源对象名称。</td>
</tr>

<tr>
<!-- td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "kube-system"</td -->
<td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："kube-system"</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The namespace of resource object that is used for locking during leader election.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在领导者选举期间，用来执行锁操作的资源对象的名字空间。</td>
</tr>

<tr>
<!-- td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2s</td -->
<td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：2s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">尝试获得领导者身份时，客户端在相邻两次尝试之间要等待的时长。此标志仅在启用了领导者选举的集群中起作用。</td>
</tr>

<tr>
<!-- td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: :0</td -->
<td colspan="2">--log-backtrace-at traceLocation&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：:0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">当执行到 file:N 所给的文件和代码行时，日志机制会生成一个调用栈快照。</td>
</tr>

<tr>
<td colspan="2">--log-dir string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, write log files in this directory</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">此标志为非空字符串时，日志文件会写入到所给的目录中。</td>
</tr>

<tr>
<td colspan="2">--log-file string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">If non-empty, use this log file</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">此标志为非空字符串时，意味着日志会写入到所给的文件中。</td>
</tr>

<tr>
<!-- td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1800</td -->
<td colspan="2">--log-file-max-size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：1800</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">定义日志文件大小的上限。单位是兆字节（MB）。若此值为 0，则不对日志文件尺寸进行约束。</td>
</tr>

<tr>
<!-- td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td -->
<td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">将内存中日志数据清除到日志文件中时，相邻两次清除操作之间最大间隔秒数。</td>
</tr>

<tr>
<!-- td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td -->
<td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：true</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">log to standard error instead of files</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">将日志写出到标准错误输出（stderr）而不是写入到日志文件。</td>
</tr>

<tr>
<td colspan="2">--master string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The address of the Kubernetes API server (overrides any value in kubeconfig).</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">Kubernetes API 服务器的地址。此值会覆盖 kubeconfig 文件中所给的地址。</td>
</tr>

<tr>
<!-- td colspan="2">--max-endpoints-per-slice int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 100</td -->
<td colspan="2">--max-endpoints-per-slice int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：100</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The maximum number of endpoints that will be added to an EndpointSlice. More endpoints per slice will result in less endpoint slices, but larger resources. Defaults to 100.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">每个 EndpointSlice 中可以添加的端点个数上限。每个片段中端点个数越多，得到的片段个数越少，但是片段的规模会变得更大。默认值为 100。</td>
</tr>

<tr>
<!-- td colspan="2">--min-resync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 12h0m0s</td -->
<td colspan="2">--min-resync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：12h0m0s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The resync period in reflectors will be random between MinResyncPeriod and 2*MinResyncPeriod.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">自省程序的重新同步时隔下限。实际时隔长度会在 min-resync-period 和 2 * min-resync-period 之间。</td>
</tr>

<tr>
<!-- td colspan="2">--namespace-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td -->
<td colspan="2">--namespace-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5m0s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The period for syncing namespace life-cycle updates</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">对名字空间对象进行同步的周期。</td>
</tr>

<tr>
<td colspan="2">--node-cidr-mask-size int32</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Mask size for node cidr in cluster. Default is 24 for IPv4 and 64 for IPv6.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">集群中节点 CIDR 的掩码长度。对 IPv4 而言默认为 24；对 IPv6 而言默认为 64。</td>
</tr>

<tr>
<td colspan="2">--node-cidr-mask-size-ipv4 int32</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Mask size for IPv4 node cidr in dual-stack cluster. Default is 24.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在双堆栈（同时支持 IPv4 和 IPv6）的集群中，节点 IPV4 CIDR 掩码长度。默认为 24。</td>
</tr>

<tr>
<td colspan="2">--node-cidr-mask-size-ipv6 int32</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Mask size for IPv6 node cidr in dual-stack cluster. Default is 64.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在双堆栈（同时支持 IPv4 和 IPv6）的集群中，节点 IPv6 CIDR 掩码长度。默认为 64。</td>
</tr>

<tr>
<!-- td colspan="2">--node-eviction-rate float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.1</td -->
<td colspan="2">--node-eviction-rate float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：0.1</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Number of nodes per second on which pods are deleted in case of node failure when a zone is healthy (see --unhealthy-zone-threshold for definition of healthy/unhealthy). Zone refers to entire cluster in non-multizone clusters.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">当某区域变得不健康，节点失效时，每秒钟可以从此标志所设定的节点个数上删除 Pods。请参阅 --unhealthy-zone-threshold 以了解“健康”的判定标准。这里的区域（zone）在集群并不跨多个区域时指的是整个集群。</td>
</tr>

<tr>
<!-- td colspan="2">--node-monitor-grace-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 40s</td -->
<td colspan="2">--node-monitor-grace-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：40s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Amount of time which we allow running Node to be unresponsive before marking it unhealthy. Must be N times more than kubelet's nodeStatusUpdateFrequency, where N means number of retries allowed for kubelet to post node status.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在将一个 Node 标记为不健康之前允许其无响应的时长上限。必须比 kubelet 的 nodeStatusUpdateFrequency 大 N 倍；这里 N 指的是 kubelet 发送节点状态的重试次数。</td>
</tr>

<tr>
<!-- td colspan="2">--node-monitor-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td -->
<td colspan="2">--node-monitor-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The period for syncing NodeStatus in NodeController.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">节点控制器对节点状态进行同步的重复周期。</td>
</tr>

<tr>
<!-- td colspan="2">--node-startup-grace-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td -->
<td colspan="2">--node-startup-grace-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：1m0s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Amount of time which we allow starting Node to be unresponsive before marking it unhealthy.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在节点启动期间，节点可以处于无响应状态；但超出此标志所设置的时长仍然无响应则该节点被标记为不健康。</td>
</tr>

<tr>
<!-- td colspan="2">--pod-eviction-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td -->
<td colspan="2">--pod-eviction-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5m0s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The grace period for deleting pods on failed nodes.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在失效的节点上删除 Pods 时为其预留的宽限期。</td>
</tr>

<tr>
<!-- td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td -->
<td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：true</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Enable profiling via web interface host:port/debug/pprof/</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">通过位于 host:port/debug/pprof/ 的 Web 接口启用性能分析。</td>
</tr>

<tr>
<!-- td colspan="2">--pv-recycler-increment-timeout-nfs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30</td -->
<td colspan="2">--pv-recycler-increment-timeout-nfs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：30</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">NFS 清洗 Pod 在清洗用过的卷时，根据此标志所设置的秒数，为每清洗 1 GiB 数据增加对应超时时长，作为 activeDeadlineSeconds。</td>
</tr>

<tr>
<!-- td colspan="2">--pv-recycler-minimum-timeout-hostpath int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 60</td -->
<td colspan="2">--pv-recycler-minimum-timeout-hostpath int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：60</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The minimum ActiveDeadlineSeconds to use for a HostPath Recycler pod.  This is for development and testing only and will not work in a multi-node cluster.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">对于 HostPath 回收器 Pod，设置其 activeDeadlineSeconds 参数下限。此参数仅用于开发和测试目的，不适合在多节点集群中使用。</td>
</tr>

<tr>
<!-- td colspan="2">--pv-recycler-minimum-timeout-nfs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 300</td -->
<td colspan="2">--pv-recycler-minimum-timeout-nfs int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：300</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">NFS 回收器 Pod 要使用的 activeDeadlineSeconds 参数下限。</td>
</tr>

<tr>
<td colspan="2">--pv-recycler-pod-template-filepath-hostpath string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The file path to a pod definition used as a template for HostPath persistent volume recycling. This is for development and testing only and will not work in a multi-node cluster.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">对 HostPath 持久卷进行回收利用时，用作模版的 Pod 定义文件所在路径。此标志仅用于开发和测试目的，不适合多节点集群中使用。</td>
</tr>

<tr>
<!-- td colspan="2">--pv-recycler-pod-template-filepath-nfs string</td -->
<td colspan="2">--pv-recycler-pod-template-filepath-nfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">对 NFS 卷执行回收利用时，用作模版的 Pod 定义文件所在路径。</td>
</tr>

<tr>
<!-- td colspan="2">--pv-recycler-timeout-increment-hostpath int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 30</td -->
<td colspan="2">--pv-recycler-timeout-increment-hostpath int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：30</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">the increment of time added per Gi to ActiveDeadlineSeconds for a HostPath scrubber pod.  This is for development and testing only and will not work in a multi-node cluster.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">HostPath 清洗器 Pod 在清洗对应类型持久卷时，为每 GiB 数据增加此标志所设置的秒数，作为其 activeDeadlineSeconds 参数。此标志仅用于开发和测试环境，不适合多节点集群环境。</td>
</tr>

<tr>
<!-- td colspan="2">--pvclaimbinder-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15s</td -->
<td colspan="2">--pvclaimbinder-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：15s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The period for syncing persistent volumes and persistent volume claims</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">持久卷（PV）和持久卷申领（PVC）对象的同步周期。</td>
</tr>

<tr>
<td colspan="2">--requestheader-allowed-names stringSlice</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">List of client certificate common names to allow to provide usernames in headers specified by --requestheader-username-headers. If empty, any client certificate validated by the authorities in --requestheader-client-ca-file is allowed.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">标志值是客户端证书中的 Common Names 列表。其中所列的名称可以通过 --requestheader-username-headers 所设置的 HTTP 头部来提供用户名。如果此标志值为空表，则被 --requestheader-client-ca-file 中机构所验证过的所有客户端证书都是允许的。</td>
</tr>

<tr>
<td colspan="2">--requestheader-client-ca-file string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Root certificate bundle to use to verify client certificates on incoming requests before trusting usernames in headers specified by --requestheader-username-headers. WARNING: generally do not depend on authorization being already done for incoming requests.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">根证书包文件名。在信任通过 --requestheader-username-headers 所指定的任何用户名之前，要使用这里的证书来检查请求中的客户证书。警告：一般不要依赖对请求所作的鉴权结果。</td>
</tr>

<tr>
<!-- td colspan="2">--requestheader-extra-headers-prefix stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [x-remote-extra-]</td -->
<td colspan="2">--requestheader-extra-headers-prefix stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：[x-remote-extra-]</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">List of request header prefixes to inspect. X-Remote-Extra- is suggested.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">要插入的请求头部前缀。建议使用 X-Remote-Exra-。</td>
</tr>

<tr>
<!-- td colspan="2">--requestheader-group-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [x-remote-group]</td -->
<td colspan="2">--requestheader-group-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：[x-remote-group]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">用来检查用户组名的请求头部名称列表。建议使用 X-Remote-Group。</td>
</tr>

<tr>
<!-- td colspan="2">--requestheader-username-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [x-remote-user]</td-->
<td colspan="2">--requestheader-username-headers stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：[x-remote-user]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">用来检查用户名的请求头部名称列表。建议使用 X-Remote-User。</td>
</tr>

<tr>
<!-- td colspan="2">--resource-quota-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5m0s</td -->
<td colspan="2">--resource-quota-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：5m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">对系统中配合用量信息进行同步的周期。</td>
</tr>

<tr>
<td colspan="2">--root-ca-file string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">If set, this root certificate authority will be included in service account's token secret. This must be a valid PEM-encoded CA bundle.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">如果此标志非空，则在服务账号的令牌 Secret 中会包含此根证书机构。所指定标志值必须是一个合法的 PEM 编码的 CA 证书包。</td>
</tr>

<tr>
<!-- td colspan="2">--route-reconciliation-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10s</td -->
<td colspan="2">--route-reconciliation-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：10s</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The period for reconciling routes created for Nodes by cloud provider.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">对云驱动为节点所创建的路由信息进行调解的周期。</td>
</tr>

<tr>
<!-- td colspan="2">--secondary-node-eviction-rate float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.01</td -->
<td colspan="2">--secondary-node-eviction-rate float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：0.01</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Number of nodes per second on which pods are deleted in case of node failure when a zone is unhealthy (see --unhealthy-zone-threshold for definition of healthy/unhealthy). Zone refers to entire cluster in non-multizone clusters. This value is implicitly overridden to 0 if the cluster size is smaller than --large-cluster-size-threshold.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">当区域不健康，节点失效时，每秒钟从此标志所给的节点个数上删除 Pods。参见 --unhealthy-zone-threshold 以了解“健康与否”的判定标准。在只有一个区域的集群中，区域指的是整个集群。如果集群规模小于 --large-cluster-size-threshold 所设置的节点个数时，此值被隐式地重设为 0。</td>
</tr>

<tr>
<!-- td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 10257</td -->
<td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：10257</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The port on which to serve HTTPS with authentication and authorization. If 0, don't serve HTTPS at all.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在此端口上提供 HTTPS 身份认证和鉴权操作。若此标志值为0，则不提供 HTTPS 服务。</td>
</tr>

<tr>
<td colspan="2">--service-account-private-key-file string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Filename containing a PEM-encoded private RSA or ECDSA key used to sign service account tokens.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">包含 PEM 编码的 RSA 或 ECDSA 私钥数据的文件名，这些私钥用来对服务账号令牌签名。</td>
</tr>

<tr>
<td colspan="2">--service-cluster-ip-range string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">CIDR Range for Services in cluster. Requires --allocate-node-cidrs to be true</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">集群中 Service 对象的 CIDR 范围。要求 --allocate-node-cidrs 标志为 true。</td>
</tr>

<tr>
<td colspan="2">--show-hidden-metrics-for-version string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The previous version for which you want to show hidden metrics. Only the previous minor version is meaningful, other values will not be allowed. The format is &lt;major&gt;.&lt;minor&gt;, e.g.: '1.16'. The purpose of this format is make sure you have the opportunity to notice if the next release hides additional metrics, rather than being surprised when they are permanently removed in the release after that.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">你希望展示隐藏度量值的上一个版本。只有上一个次版本号有意义，其他值都是不允许的。字符串格式为 "&lt;major&gt;.&lt;minor&gt;"。例如："1.16"。此格式的目的是确保你能够有机会注意到下一个版本隐藏了一些额外的度量值，而不是在更新版本中某些度量值被彻底删除时措手不及。</td>
</tr>

<tr>
<td colspan="2">--skip-headers</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">If true, avoid header prefixes in the log messages</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">若此标志为 true，则在日志消息中避免写入头部前缀信息。</td>
</tr>

<tr>
<td colspan="2">--skip-log-headers</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">If true, avoid headers when opening log files</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">若此标志为 true，则在写入日志文件时避免写入头部信息。</td>
</tr>

<tr>
<!-- td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 2</td -->
<td colspan="2">--stderrthreshold severity&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：2</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">logs at or above this threshold go to stderr</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">等于或大于此阈值的日志信息会被写入到标准错误输出（stderr）。</td>
</tr>

<tr>
<!-- td colspan="2">--terminated-pod-gc-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 12500</td -->
<td colspan="2">--terminated-pod-gc-threshold int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：12500</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Number of terminated pods that can exist before the terminated pod garbage collector starts deleting terminated pods. If &lt;= 0, the terminated pod garbage collector is disabled.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">在已终止 Pods 垃圾收集器删除已终止 Pods 之前，可以保留的已删除 Pods 的个数上限。若此值小于等于 0，则相当于禁止垃圾回收已终止的 Pods。</td>
</tr>

<tr>
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">File containing the default x509 Certificate for HTTPS. (CA cert, if any, concatenated after server cert). If HTTPS serving is enabled, and --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory specified by --cert-dir.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">包含 HTTPS 所用的默认 X509 证书的文件。如果有 CA 证书，会被串接在服务器证书之后。若启用了 HTTPS 服务且 --tls-cert-file 和 --tls-private-key-file 标志未设置，则为节点的公开地址生成自签名的证书和密钥，并保存到 --cert-dir 所给的目录中。</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites stringSlice</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be use.  Possible values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_RC4_128_SHA,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_RC4_128_SHA,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_RC4_128_SHA</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">供服务器使用的加密包的逗号分隔列表。若忽略此标志，则使用 Go 语言默认的加密包。可选值包括：TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_RC4_128_SHA,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_RC4_128_SHA,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_RC4_128_SHA</td>
</tr>

<tr>
<td colspan="2">--tls-min-version string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Minimum TLS version supported. Possible values: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">可支持的最低 TLS 版本。可选值包括：“VersionTLS10”、“VersionTLS11”、“VersionTLS12”、“VersionTLS13”。</td>
</tr>

<tr>
<td colspan="2">--tls-private-key-file string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">File containing the default x509 private key matching --tls-cert-file.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">包含与 --tls-cert-file 对应的默认 X509 私钥的文件。</td>
</tr>

<tr>
<!-- td colspan="2">--tls-sni-cert-key namedCertKey&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: []</td -->
<td colspan="2">--tls-sni-cert-key namedCertKey&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：[]</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">A pair of x509 certificate and private key file paths, optionally suffixed with a list of domain patterns which are fully qualified domain names, possibly with prefixed wildcard segments. The domain patterns also allow IP addresses, but IPs should only be used if the apiserver has visibility to the IP address requested by a client. If no domain patterns are provided, the names of the certificate are extracted. Non-wildcard matches trump over wildcard matches, explicit domain patterns trump over extracted names. For multiple key/certificate pairs, use the --tls-sni-cert-key multiple times. Examples: "example.crt,example.key" or "foo.crt,foo.key:*.foo.com,foo.com".</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">X509 证书和私钥文件路径的耦对。作为可选项，可以添加域名模式的列表，其中每个域名模式都是可以带通配片段前缀的全限定域名（FQDN）。域名模式也可以使用 IP 地址字符串，不过只有 API 服务器在所给 IP 地址上对客户端可见时才可以使用 IP 地址。在未提供域名模式时，从证书中提取域名。如果有非通配方式的匹配，则优先于通配方式的匹配；显式的域名模式优先于提取的域名。当存在多个密钥/证书耦对时，可以多次使用 --tls-sni-cert-key 标志。例如：example.crt,example.key 或 foo.crt,foo.key:*.foo.com,foo.com。</td>
</tr>

<tr>
<!-- td colspan="2">--unhealthy-zone-threshold float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 0.55</td -->
<td colspan="2">--unhealthy-zone-threshold float32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：0.55</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Fraction of Nodes in a zone which needs to be not Ready (minimum 3) for zone to be treated as unhealthy. </td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">仅当给定区域中处于非就绪状态的节点（最少 3 个）的占比高于此值时，才将该区域视为不健康。</td>
</tr>

<tr>
<td colspan="2">--use-service-account-credentials</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">If true, use individual service account credentials for each controller.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">当此标志为 true 时，为每个控制器单独使用服务账号凭据。</td>
</tr>

<tr>
<td colspan="2">-v, --v Level</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">number for the log level verbosity</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">日志级别详细程度取值</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">打印版本信息之后退出</td>
</tr>

<tr>
<td colspan="2">--vmodule moduleSpec</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">comma-separated list of pattern=N settings for file-filtered logging</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;">由逗号分隔的列表，每一项都是 pattern=N 格式，用来执行根据文件过滤的日志行为。</td>
</tr>

</tbody>
</table>

