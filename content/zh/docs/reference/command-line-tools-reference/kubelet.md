---
title: kubelet
content_type: tool-reference
weight: 28
---

## {{% heading "synopsis" %}}


<!--
The kubelet is the primary "node agent" that runs on each node. It can register the node with the apiserver using one of: the hostname; a flag to override the hostname; or specific logic for a cloud provider.
-->

kubelet 是在每个 Node 节点上运行的主要 “节点代理”。它可以通过以下方式向 apiserver 进行注册：主机名（hostname）；覆盖主机名的参数；某云服务商的特定逻辑。

<!--
The kubelet works in terms of a PodSpec. A PodSpec is a YAML or JSON object that describes a pod. The kubelet takes a set of PodSpecs that are provided through various mechanisms (primarily through the apiserver) and ensures that the containers described in those PodSpecs are running and healthy. The kubelet doesn't manage containers which were not created by Kubernetes.
-->
kubelet 是基于 PodSpec 来工作的。每个 PodSpec 是一个描述 Pod 的 YAML 或 JSON 对象。kubelet 接受通过各种机制（主要是通过 apiserver）提供的一组 PodSpec，并确保这些 PodSpec 中描述的容器处于运行状态且运行状况良好。kubelet 不管理不是由 Kubernetes 创建的容器。

<!--
Other than from an PodSpec from the apiserver, there are three ways that a container manifest can be provided to the Kubelet.
-->
除了来自 apiserver 的 PodSpec 之外，还可以通过以下三种方式将容器清单（manifest）提供给 kubelet。

<!--
File: Path passed as a flag on the command line. Files under this path will be monitored periodically for updates. The monitoring period is 20s by default and is configurable via a flag.
-->
File（文件）：利用命令行参数给定路径。kubelet 周期性地监视此路径下的文件是否有更新。监视周期默认为 20s，且可通过参数进行配置。

<!--
HTTP endpoint: HTTP endpoint passed as a parameter on the command line. This endpoint is checked every 20 seconds (also configurable with a flag).
-->
HTTP endpoint（HTTP 端点）：利用命令行参数指定 HTTP 端点。此端点每 20 秒被检查一次（也可以使用参数进行配置）。

<!--
HTTP server: The kubelet can also listen for HTTP and respond to a simple API (underspec'd currently) to submit a new manifest.
-->
HTTP server（HTTP 服务器）：kubelet 还可以侦听 HTTP 并响应简单的 API（当前未经过规范）来提交新的清单。

```
kubelet [flags]
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, adds the file directory to the header
-->
设置为 true 表示添加文件目录到 header 中
</td>
</tr>

<tr>
<td colspan="2">--address 0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address for the Kubelet to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces) (default 0.0.0.0) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
kubelet 的服务 IP 地址（所有 IPv4 接口设置为 0.0.0.0 ，所有 IPv6 接口设置为 “::”）（默认值为 0.0.0.0）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--allowed-unsafe-sysctls strings</td>
</tr>  
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated whitelist of unsafe sysctls or unsafe sysctl patterns (ending in *). Use these at your own risk. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置允许的非安全 sysctls 或 sysctl 模式(以 * 结尾) 白名单。使用此参数，风险自担。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--alsologtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
log to standard error as well as files
-->
设置为 true 表示将日志输出到文件的同时输出到 stderr
</td>
</tr>

<tr>
<td colspan="2">--anonymous-auth</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables anonymous requests to the Kubelet server. Requests that are not rejected by another authentication method are treated as anonymous requests. Anonymous requests have a username of system:anonymous, and a group name of system:unauthenticated. (default true) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置为 true 表示 kubelet 服务器可以接受匿名请求。未被任何认证组件拒绝的请求将被视为匿名请求。匿名请求的用户名为 system:anonymous，用户组为 system:unauthenticated。（默认值为 true）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--application-metrics-count-limit int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Max number of application metrics to store (per container) (default 100) (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
设置每个容器应用性能度量值存储的个数上限。（默认值为 100）。（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use the TokenReview API to determine authentication for bearer tokens. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
使用 TokenReview API 对持有者令牌进行身份认证。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--authentication-token-webhook-cache-ttl duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache responses from the webhook token authenticator. (default 2m0s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
webhook 令牌认证器返回的响应的缓存时间。（默认值为 2m0s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--authorization-mode string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Authorization mode for Kubelet server. Valid options are AlwaysAllow or Webhook. Webhook mode uses the SubjectAccessReview API to determine authorization. (default "AlwaysAllow") (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
kubelet 服务器的鉴权模式。可选值包括：AlwaysAllow、Webhook。Webhook 模式使用 SubjectAccessReview API 鉴权。（默认值：“AlwaysAllow”）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-authorized-ttl duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'authorized' responses from the webhook authorizer. (default 5m0s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
webhook 认证器所返回的 “己授权” 应答的缓存时间。（默认值为 5m0s）（默认值为 “AlwaysAllow”）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The duration to cache 'unauthorized' responses from the webhook authorizer. (default 30s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
webhook 认证器所返回的 “未授权” 应答的缓存时间。（默认值为 30s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--azure-container-registry-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the file container Azure container registry configuration information.
-->
Azure 云上镜像库的配置文件路径。
</td>
</tr>

<tr>
<td colspan="2">--boot-id-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of files to check for boot-id. Use the first one that exists. (default "/proc/sys/kernel/random/boot_id") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
以逗号分隔的文件列表，用于检查引导 id（boot-id）。使用第 1 个存在 boot-id 的文件。（默认值为“/proc/sys/kernel/random/boot_id”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--bootstrap-checkpoint-path string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> Path to the directory where the checkpoints are stored
-->
&lt;警告：alpha 功能&gt; 存储检查点的目录的路径
</td>
</tr>

<tr>
<td colspan="2">--bootstrap-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeconfig file that will be used to get client certificate for kubelet. If the file specified by --kubeconfig does not exist, the bootstrap kubeconfig is used to request a client certificate from the API server. On success, a kubeconfig file referencing the generated client certificate and key is written to the path specified by --kubeconfig. The client certificate and key file will be stored in the directory pointed by --cert-dir.
-->
kubeconfig 文件的路径，该文件将用于获取 kubelet 的客户端证书。如果 --kubeconfig 指定的文件不存在，则使用引导 kubeconfig 从 API 服务器请求客户端证书。成功后，将引用生成的客户端证书和密钥的 kubeconfig 文件写入 --kubeconfig 所指定的路径。客户端证书和密钥文件将存储在 --cert-dir 指向的目录中。
</td>
</tr>

<tr>
<td colspan="2">--cert-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The directory where the TLS certs are located. If --tls-cert-file and --tls-private-key-file are provided, this flag will be ignored. (default "/var/lib/kubelet/pki")
-->
TLS 证书所在的目录。如果设置了 --tls-cert-file 和 --tls-private-key-file，则该设置将被忽略。（默认值为 “/var/lib/kubelet/pki”）
</td>
</tr>

<tr>
<td colspan="2">--cgroup-driver string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Driver that the kubelet uses to manipulate cgroups on the host.  Possible values: 'cgroupfs', 'systemd' (default "cgroupfs") (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
kubelet 操作本机 cgroup 时使用的驱动程序。支持的选项包括 cgroupfs 或者 systemd（默认值为 cgroupfs）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
/td>
</tr>

<tr>
<td colspan="2">--cgroup-root string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional root cgroup to use for pods. This is handled by the container runtime on a best effort basis. Default: '', which means use the container runtime default. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
为 pod 设置可选的根 cgroup。容器运行时会尽力而为。默认值：‘’，意味着将使用容器运行时的默认设置。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--cgroups-per-qos</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable creation of QoS cgroup hierarchy, if true top level QoS and pod cgroups are created. (default true) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
启用创建 QoS cgroup 层次结构。此值为 true 时创建顶级的 QoS 和 Pod cgroup。（默认值为 true）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--chaos-chance float</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If > 0.0, introduce random client errors and latency. Intended for testing.
-->
如果大于 0.0，则引入随机客户端错误和延迟。用于测试。
</td>
</tr>

<tr>
<td colspan="2">--client-ca-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If set, any request presenting a client certificate signed by one of the authorities in the client-ca-file is authenticated with an identity corresponding to the CommonName of the client certificate. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
如果已设置客户端 CA 证书文件，则使用与客户端证书的 CommonName 对应的身份对任何携带 client-ca 文件中的授权机构之一签名的客户端证书的请求进行身份验证。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--cloud-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path to the cloud provider configuration file.
-->
云服务商的配置文件路径。
</td>
</tr>

<tr>
<td colspan="2">--cloud-provider string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The provider for cloud services. Specify empty string for running with no cloud provider. If set, the cloud provider determines the name of the node (consult cloud provider documentation to determine if and how the hostname is used).
-->
云服务商。设置为空字符串表示在没有云服务商的情况下运行。如果已设置云服务商，则云服务商将确定节点的名称（查阅云提供商文档以确定是否以及如何使用主机名）。
</td>
</tr>

<tr>
<td colspan="2">--cluster-dns strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of DNS server IP address.  This value is used for containers DNS server in case of Pods with "dnsPolicy=ClusterFirst". Note: all DNS servers appearing in the list MUST serve the same set of records otherwise name resolution within the cluster may not work correctly. There is no guarantee as to which DNS server may be contacted for name resolution. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
集群内 DNS 服务的 IP 地址，以逗号分隔。仅当 Pod 设置了 “dnsPolicy=ClusterFirst” 属性时可用。注意：列表中出现的所有 DNS 服务器必须包含相同的记录组，否则集群中的名称解析可能无法正常工作。无法保证名称解析过程中会牵涉到哪些 DNS 服务器。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--cluster-domain string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Domain for this cluster.  If set, kubelet will configure all containers to search this domain in addition to the host's search domains (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
集群的域名。如果设置了此值，除了主机的搜索域外，kubelet 还将配置所有容器以搜索所指定的域名（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/）。
</td>
</tr>

<tr>
<td colspan="2">--cni-bin-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> A comma-separated list of full paths of directories in which to search for CNI plugin binaries. This docker-specific flag only works when container-runtime is set to docker. (default "/opt/cni/bin")
-->
&lt;警告：alpha 功能&gt; 以逗号分隔的目录的完整路径列表，kubelet 将在其中搜索 CNI 插件可执行文件。仅当容器运行环境设置为 docker 时，此特定于 docker 的参数才有效。(默认为 “/opt/cni/bin”)
</td>
</tr>

<tr>
<td colspan="2">--cni-cache-dir string</td>
</tr>
<tr>                                            
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> The full path of the directory in which CNI should store cache files. This docker-specific flag only works when container-runtime is set to docker. (default "/var/lib/cni/cache")
-->
&lt;警告：alpha 功能&gt; CNI 用于缓存文件的目录的完整路径。仅当容器运行环境设置为 docker 时，此特定于 docker 的参数才有效。(默认为 “/var/lib/cni/cache”)
</td>
</tr>

<tr>
<td colspan="2">--cni-conf-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> The full path of the directory in which to search for CNI config files. This docker-specific flag only works when container-runtime is set to docker. (default "/etc/cni/net.d")
-->
&lt;警告：alpha 功能&gt; 用来搜索 CNI 配置文件的目录的完整路径。仅当容器运行环境设置为 docker 时，此特定于 docker 的参数才有效。(默认为 “/etc/cni/net.d”)
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The Kubelet will load its initial configuration from this file. The path may be absolute or relative; relative paths start at the Kubelet's current working directory. Omit this flag to use the built-in default configuration values. Command-line flags override configuration from this file.
-->
kubelet 将从该文件加载其初始配置。该路径可以是绝对路径，也可以是相对路径。相对路径从 kubelet 的当前工作目录开始。省略此参数则使用内置的默认配置值。命令行参数会覆盖此文件中的配置。
</td>
</tr>

<tr>
<td colspan="2">--container-hints string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
location of the container hints file (default "/etc/cadvisor/container_hints.json") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
容器提示（hints）文件的位置。（默认值为 “/etc/cadvisor/container_hints.json”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--container-log-max-files int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Beta feature> Set the maximum number of container log files that can be present for a container. The number must be >= 2. This flag can only be used with --container-runtime=remote. (default 5) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
&lt;警告：beta 功能&gt; 设置容器可以存在的容器日志文件个数上限。此值必须不小于 2。此参数只能与 --container-runtime=remote 参数一起使用。（默认值为 5）。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>    

<tr>
<td colspan="2">--container-log-max-size string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Beta feature> Set the maximum size (e.g. 10Mi) of container log file before it is rotated. This flag can only be used with --container-runtime=remote. (default "10Mi") (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
&lt;警告：beta 功能&gt; 设置容器日志文件在轮转生成新文件时之前的最大值。此参数只能与 --container-runtime=remote 参数一起使用。（默认值为 “10Mi”）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--container-runtime string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The container runtime to use. Possible values: 'docker', 'remote', 'rkt(deprecated)'. (default "docker")
-->
要使用的容器运行时。目前支持 ‘docker’、‘remote’、‘rkt(已弃用)’。（默认值为 ‘docker’）。
</td>
</tr>

<tr>
<td colspan="2">--container-runtime-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] The endpoint of remote runtime service. Currently unix socket endpoint is supported on Linux, while npipe and tcp endpoints are supported on windows.  Examples:'unix:///var/run/dockershim.sock', 'npipe:////./pipe/dockershim' (default "unix:///var/run/dockershim.sock")
-->
[实验性特性] 容器运行时的远程服务端点。目前支持的类型包括 Linux 系统上的 UNIX 套接字、Windows 系统上支持的 npipe 和 TCP 端点。例如：‘unix:///var/run/dockershim.sock’、‘npipe:////./pipe/dockershim’。（默认值为 “unix:///var/run/dockershim.sock”）
</td>
</tr>

<tr>
<td colspan="2">--containerd string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
containerd endpoint (default "/run/containerd/containerd.sock") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
设置 containerd 的端点（默认值为 “/run/containerd/containerd.sock”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--contention-profiling</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable lock contention profiling, if profiling is enabled (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
当启用了性能分析时，启用锁竞争分析（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-cfs-quota</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable CPU CFS quota enforcement for containers that specify CPU limits (default true) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置为 true 表示启用 CPU CFS 配额，用于设置容器的 CPU 限制（默认值为 true）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-cfs-quota-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Sets CPU CFS quota period value, cpu.cfs_period_us, defaults to Linux Kernel default (default 100ms) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置 CPU CFS 配额周期，cpu.cfs_period_us。默认使用 Linux 内核所设置的默认值 （默认值为 100ms）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-manager-policy string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
CPU Manager policy to use. Possible values: 'none', 'static'. Default: 'none' (default "none") (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置 CPU 管理器策略。可选值包括：‘none’ 和 ‘static’。默认值：“none”。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--cpu-manager-reconcile-period NodeStatusUpdateFrequency</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> CPU Manager reconciliation period. Examples: '10s', or '1m'. If not supplied, defaults to NodeStatusUpdateFrequency (default 10s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
&lt;警告：alpha 功能&gt; 设置 CPU 管理器的调和时间。例如：‘10s’ 或者 ‘1m’。如果未设置，默认使用 NodeStatusUpdateFrequency 取值（默认值为 10s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--docker string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
docker endpoint (default "unix:///var/run/docker.sock") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
docker 服务的端点地址（默认值为 “unix:///var/run/docker.sock”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--docker-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use this for the docker endpoint to communicate with. This docker-specific flag only works when container-runtime is set to docker. (default "unix:///var/run/docker.sock")
-->
docker 端点使用该参数值进行通信。仅当容器运行环境设置为 docker 时，此特定于 docker 的参数才有效。(默认为 “unix:///var/run/docker.sock”)
</td>
</tr>

<tr>
<td colspan="2">--docker-env-metadata-whitelist string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
a comma-separated list of environment variable keys that needs to be collected for docker containers (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
docker 容器需要使用的以逗号分隔的环境变量键名列表（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--docker-only</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Only report docker containers in addition to root stats (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
设置为 true 表示除了根统计信息外，仅报告 Docker 容器的统计信息（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--docker-root string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
DEPRECATED: docker root is read from docker info (this is a fallback, default: /var/lib/docker) (default "/var/lib/docker")
-->
已弃用：docker 根目录的路径（备用，默认值：/var/lib/docker）（默认值为 “/var/lib/docker”）
</td>
</tr>

<tr>
<td colspan="2">--docker-tls</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
use TLS to connect to docker (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
使用 TLS 连接 docker。（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--docker-tls-ca string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
path to trusted CA (default "ca.pem") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
可信 CA 的路径（默认值为 “ca.pem”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--docker-tls-cert string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
path to client certificate (default "cert.pem") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
客户端证书的路径（默认值为 “cert.pem”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--docker-tls-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
path to private key (default "key.pem") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
私钥文件路径（默认值为 “key.pem”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--dynamic-config-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The Kubelet will use this directory for checkpointing downloaded configurations and tracking configuration health. The Kubelet will create this directory if it does not already exist. The path may be absolute or relative; relative paths start at the Kubelet's current working directory. Providing this flag enables dynamic Kubelet configuration. The DynamicKubeletConfig feature gate must be enabled to pass this flag; this gate currently defaults to true because the feature is beta.
-->
设置 kubelet 使用此目录来保存所下载的配置和跟踪配置运行状况。如果目录不存在，则创建该目录。该路径可以是绝对路径，也可以是相对路径。相对路径从 kubelet 的当前工作目录开始。设置此参数将启用动态 kubelet 配置。必须启用 DynamicKubeletConfig 特性开关才能传递此参数；由于该功能为 beta，此特性开关当前默认为 true。
</td>
</tr>

<tr>
<td colspan="2">--enable-cadvisor-json-endpoints</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable cAdvisor json /spec and /stats/* endpoints. (default false)
-->
启用 cAdvisor JSON 数据的 /spec 和 /stats/* 端点。（默认值为 false）（已弃用：未来版本将会移除该参数）
</td>
</tr>

<tr>
<td colspan="2">--enable-controller-attach-detach</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables the Attach/Detach controller to manage attachment/detachment of volumes scheduled to this node, and disables kubelet from executing any attach/detach operations (default true)
-->
设置为 true 表示启用 Attach/Detach 控制器进行来挂接和摘除调度到该节点的卷，同时禁用 kubelet 执行挂接和摘除操作（默认值为 true）
</td>
</tr>

<tr>
<td colspan="2">--enable-debugging-handlers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables server endpoints for log collection and local running of containers and commands (default true) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置为 true 表示启用服务器端点进行日志收集和在本地运行容器和命令（默认值为 true）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--enable-load-reader</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether to enable cpu load reader (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
设置为 true 表示启用读取 CPU 负载（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--enable-server</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable the Kubelet's server (default true)
-->
启动 kubelet 服务器（默认值为 true）
</td>
</tr>

<tr>
<td colspan="2">--enforce-node-allocatable stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A comma separated list of levels of node allocatable enforcement to be enforced by kubelet. Acceptable options are 'none', 'pods', 'system-reserved', and 'kube-reserved'. If the latter two options are specified, '--system-reserved-cgroup' and '--kube-reserved-cgroup' must also be set, respectively. If 'none' is specified, no additional options should be set. See https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/ for more details. (default [pods]) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
用逗号分隔的列表，包含由 kubelet 强制执行的节点可分配资源级别。可选配置为：‘none’、‘pods’、‘system-reserved’ 和 ‘kube-reserved’。在设置 ‘system-reserved’ 和 ‘kube-reserved’ 这两个值时，同时要求设置 ‘--system-reserved-cgroup’ 和 ‘--kube-reserved-cgroup’ 这两个参数。如果设置为 ‘none’，则不需要设置其他参数。更多信息请参考 https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/。（默认值为 pods）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--event-burst int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of a bursty event records, temporarily allows event records to burst to this number, while still not exceeding event-qps. Only used if --event-qps > 0 (default 10) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
突发事件记录的个数上限，在遵从 event-qps 阈值约束的前提下临时允许事件记录达到此数目。仅在 --event-qps 大于 0 时使用（默认值为 10）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--event-qps int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If > 0, limit event creations per second to this value. If 0, unlimited. (default 5) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置大于 0 的值表示限制每秒可生成的事件数量。设置为 0 表示不限制。（默认值为 5）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--event-storage-age-limit string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Max length of time for which to store events (per type). Value is a comma separated list of key values, where the keys are event types (e.g.: creation, oom) or "default" and the value is a duration. Default is applied to all non-specified event types (default "default=0") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
不同类型事件的最长保存时间。取值是键值对（key=value）的逗号分隔列表，其中键名是事件类型（例如：creation、oom）或者 “default”，键值是持续时间（duration）。所有未指定的事件类型都使用默认值（默认值为 “default=0”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--event-storage-event-limit string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Max number of events to store (per type). Value is a comma separated list of key values, where the keys are event types (e.g.: creation, oom) or "default" and the value is an integer. Default is applied to all non-specified event types (default "default=0") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
每种事件类型的最大保存数量。取值是键值对（key=value）的逗号分隔列表，其中键名是事件类型（例如：creation、oom）或者 “default”，键值是一个整数（integer）。所有未指定的事件类型都使用默认值（默认值为 “default=0”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-hard mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of eviction thresholds (e.g. memory.available<1Gi) that if met would trigger a pod eviction. (default imagefs.available<15%,memory.available<100Mi,nodefs.available<10%,nodefs.inodesFree<5%) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
触发 Pod 驱逐操作的一组硬性门限（例如：memory.available &lt; 1Gi（内存可用值小于 1 G））设置。（默认值为 imagefs.available&lt;15%,memory.available&lt;100Mi,nodefs.available&lt;10%,nodefs.inodesFree&lt;5%）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-max-pod-grace-period int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum allowed grace period (in seconds) to use when terminating pods in response to a soft eviction threshold being met.  If negative, defer to pod specified value. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
响应满足软驱逐阈值（soft eviction threshold）而终止 Pod 时使用的最长宽限期（以秒为单位）。如果设置为负数，则遵循 Pod 的指定值。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-minimum-reclaim mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of minimum reclaims (e.g. imagefs.available=2Gi) that describes the minimum amount of resource the kubelet will reclaim when performing a pod eviction if that resource is under pressure. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
当本节点压力过大时，kubelet 执行软性驱逐操作。此参数设置软性驱逐操作需要回收的资源的最小数量（例如：imagefs.available=2Gi）。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-pressure-transition-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Duration for which the kubelet has to wait before transitioning out of an eviction pressure condition. (default 5m0s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
kubelet 在触发软性 Pod 驱逐操作之前的最长等待时间。（默认值为 5m0s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-soft mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of eviction thresholds (e.g. memory.available<1.5Gi) that if met over a corresponding grace period would trigger a pod eviction. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置一组驱逐阈值（例如：memory.available&lt;1.5Gi）。如果在相应的宽限期内达到该阈值，则会触发软性 Pod 驱逐操作。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--eviction-soft-grace-period mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of eviction grace periods (e.g. memory.available=1m30s) that correspond to how long a soft eviction threshold must hold before triggering a pod eviction. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置一组驱逐宽限期，对应于触发软性 Pod 驱逐操作之前软性驱逐阈值所需持续的时间长短。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--exit-on-lock-contention</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether kubelet should exit upon lock-file contention.
-->
设置为 true 表示当发生锁文件竞争时 kubelet 可以退出。
</td>
</tr>

<tr>
<td colspan="2">--experimental-allocatable-ignore-eviction</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
When set to 'true', Hard Eviction Thresholds will be ignored while calculating Node Allocatable. See https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/ for more details. [default=false]
-->
设置为 true 表示在计算节点可分配资源数量时忽略硬性逐出阈值设置。请参考 https://kubernetes.io/docs/tasks/administer-cluster/reserve-compute-resources/。（默认值为 false）。
</td>
</tr>

<tr>
<td colspan="2">--experimental-bootstrap-kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
(DEPRECATED: Use --bootstrap-kubeconfig)
-->
（已弃用：使用 --bootstrap-kubeconfig 参数）
</td>
</tr>

<tr>
<td colspan="2">--experimental-check-node-capabilities-before-mount</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] if set true, the kubelet will check the underlying node for required components (binaries, etc.) before performing the mount
-->
[实验性特性] 设置为 true 表示 kubelet 在进行挂载卷操作之前对本节点上所需的组件（如可执行文件等）进行检查
</td>
</tr>

<tr>
<td colspan="2">--experimental-kernel-memcg-notification</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If enabled, the kubelet will integrate with the kernel memcg notification to determine if memory eviction thresholds are crossed rather than polling.
-->
设置为 true 表示 kubelet 将会集成内核的 memcg 通知机制而不是使用轮询机制来判断是否达到了内存驱逐阈值。
</td>
</tr>

<tr>
<td colspan="2">--experimental-mounter-path string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] Path of mounter binary. Leave empty to use the default mount.
-->
[实验性特性] 卷挂载器（mounter）可执行文件的路径。设置为空表示使用默认挂载器 mount。
</td>
</tr>

<tr>
<td colspan="2">--fail-swap-on</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Makes the Kubelet fail to start if swap is enabled on the node.  (default true) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置为 true 表示如果主机启用了交换分区，kubelet 将无法使用。（默认值为 true）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--feature-gates mapStringBool</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:<br/>APIListChunking=true|false (BETA - default=true)<br/>APIResponseCompression=true|false (BETA - default=true)<br/>AllAlpha=true|false (ALPHA - default=false)<br/>AppArmor=true|false (BETA - default=true)<br/>AttachVolumeLimit=true|false (BETA - default=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - default=false)<br/>BlockVolume=true|false (BETA - default=true)<br/>BoundServiceAccountTokenVolume=true|false (ALPHA - default=false)<br/>CPUManager=true|false (BETA - default=true)<br/>CRIContainerLogRotation=true|false (BETA - default=true)
<br/>CSIBlockVolume=true|false (BETA - default=true)<br/>CSIDriverRegistry=true|false (BETA - default=true)<br/>CSIInlineVolume=true|false (BETA - default=true)<br/>CSIMigration=true|false (ALPHA - default=false)<br/>CSIMigrationAWS=true|false (ALPHA - default=false)<br/>CSIMigrationAzureDisk=true|false (ALPHA - default=false)<br/>CSIMigrationAzureFile=true|false (ALPHA - default=false)<br/>CSIMigrationGCE=true|false (ALPHA - default=false)<br/>CSIMigrationOpenStack=true|false (ALPHA - default=false)<br/>CSINodeInfo=true|false (BETA - default=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>CustomResourceDefaulting=true|false (BETA - default=true)<br/>DevicePlugins=true|false (BETA - default=true)<br/>DryRun=true|false (BETA - default=true)<br/>DynamicAuditing=true|false (ALPHA - default=false)<br/>DynamicKubeletConfig=true|false (BETA - default=true)<br/>EndpointSlice=true|false (ALPHA - default=false)<br/>EphemeralContainers=true|false (ALPHA - default=false)<br/>EvenPodsSpread=true|false (ALPHA - default=false)<br/>ExpandCSIVolumes=true|false (BETA - default=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - default=true)<br/>ExpandPersistentVolumes=true|false (BETA - default=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - default=false)<br/>HPAScaleToZero=true|false (ALPHA - default=false)<br/>HyperVContainer=true|false (ALPHA - default=false)<br/>IPv6DualStack=true|false (ALPHA - default=false)<br/>KubeletPodResources=true|false (BETA - default=true)<br/>LegacyNodeRoleBehavior=true|false (ALPHA - default=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - default=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - default=false)<br/>MountContainers=true|false (ALPHA - default=false)<br/>NodeDisruptionExclusion=true|false (ALPHA - default=false)<br/>NodeLease=true|false (BETA - default=true)<br/>NonPreemptingPriority=true|false (ALPHA - default=false)<br/>PodOverhead=true|false (ALPHA - default=false)<br/>PodShareProcessNamespace=true|false (BETA - default=true)<br/>ProcMountType=true|false (ALPHA - default=false)br/>QOSReserved=true|false (ALPHA - default=false)<br/>RemainingItemCount=true|false (BETA - default=true)<br/>RemoveSelfLink=true|false (ALPHA - default=false)<br/>RequestManagement=true|false (ALPHA - default=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - default=false)<br/>ResourceQuotaScopeSelectors=true|false (BETA - default=true)<br/>RotateKubeletClientCertificate=true|false (BETA - default=true)<br/>RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>RunAsGroup=true|false (BETA - default=true)<br/>RuntimeClass=true|false (BETA - default=true)<br/>SCTPSupport=true|false (ALPHA - default=false)<br/>ScheduleDaemonSetPods=true|false (BETA - default=true)<br/>ServerSideApply=true|false (BETA - default=true)<br/>ServiceLoadBalancerFinalizer=true|false (BETA - default=true)<br/>ServiceNodeExclusion=true|false (ALPHA - default=false)<br/>StartupProbe=true|false (BETA - default=true)<br/>StorageVersionHash=true|false (BETA - default=true)<br/>StreamingProxyRedirects=true|false (BETA - default=true)<br/>SupportNodePidsLimit=true|false (BETA - default=true)<br/>SupportPodPidsLimit=true|false (BETA - default=true)<br/>Sysctls=true|false (BETA - default=true)<br/>TTLAfterFinished=true|false (ALPHA - default=false)<br/>TaintBasedEvictions=true|false (BETA - default=true)<br/>TaintNodesByCondition=true|false (BETA - default=true)<br/>TokenRequest=true|false (BETA - default=true)<br/>TokenRequestProjection=true|false (BETA - default=true)<br/>TopologyManager=true|false (ALPHA - default=false)<br/>ValidateProxyRedirects=true|false (BETA - default=true)<br/>VolumePVCDataSource=true|false (BETA - default=true)<br/>VolumeSnapshotDataSource=true|false (ALPHA - default=false)<br/>VolumeSubpathEnvExpansion=true|false (BETA - default=true)<br/>WatchBookmark=true|false (BETA - default=true)<br/>WinDSR=true|false (ALPHA - default=false)<br/>WinOverlay=true|false (ALPHA - default=false)<br/>WindowsGMSA=true|false (BETA - default=true)<br/>WindowsRunAsUserName=true|false (ALPHA - default=false) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
用于 alpha 实验性质的特性开关组，每个开关以 key=value 形式表示。当前可用开关包括：<br/>APIListChunking=true|false (BETA - 默认值=true)<br/>APIResponseCompression=true|false (BETA - 默认值=true)<br/>AllAlpha=true|false (ALPHA - 默认值=false)<br/>AppArmor=true|false (BETA - 默认值=true)<br/>AttachVolumeLimit=true|false (BETA - 默认值=true)<br/>BalanceAttachedNodeVolumes=true|false (ALPHA - 默认值=false)<br/>BlockVolume=true|false (BETA - 默认值=true)<br/>BoundServiceAccountTokenVolume=true|false (ALPHA - 默认值=false)<br/>CPUManager=true|false (BETA - 默认值=true)<br/>CRIContainerLogRotation=true|false (BETA - 默认值=true)
<br/>CSIBlockVolume=true|false (BETA - 默认值=true)<br/>CSIDriverRegistry=true|false (BETA - 默认值=true)<br/>CSIInlineVolume=true|false (BETA - 默认值=true)<br/>CSIMigration=true|false (ALPHA - 默认值=false)<br/>CSIMigrationAWS=true|false (ALPHA - 默认值=false)<br/>CSIMigrationAzureDisk=true|false (ALPHA - 默认值=false)<br/>CSIMigrationAzureFile=true|false (ALPHA - 默认值=false)<br/>CSIMigrationGCE=true|false (ALPHA - 默认值=false)<br/>CSIMigrationOpenStack=true|false (ALPHA - 默认值=false)<br/>CSINodeInfo=true|false (BETA - 默认值=true)<br/>CustomCPUCFSQuotaPeriod=true|false (ALPHA - 默认值=false)<br/>CustomResourceDefaulting=true|false (BETA - 默认值=true)<br/>DevicePlugins=true|false (BETA - 默认值=true)<br/>DryRun=true|false (BETA - 默认值=true)<br/>DynamicAuditing=true|false (ALPHA - 默认值=false)<br/>DynamicKubeletConfig=true|false (BETA - 默认值=true)<br/>EndpointSlice=true|false (ALPHA - 默认值=false)<br/>EphemeralContainers=true|false (ALPHA - 默认值=false)<br/>EvenPodsSpread=true|false (ALPHA - 默认值=false)<br/>ExpandCSIVolumes=true|false (BETA - 默认值=true)<br/>ExpandInUsePersistentVolumes=true|false (BETA - 默认值=true)<br/>ExpandPersistentVolumes=true|false (BETA - 默认值=true)<br/>ExperimentalHostUserNamespaceDefaulting=true|false (BETA - 默认值=false)<br/>HPAScaleToZero=true|false (ALPHA - 默认值=false)<br/>HyperVContainer=true|false (ALPHA - 默认值=false)<br/>IPv6DualStack=true|false (ALPHA - 默认值=false)<br/>KubeletPodResources=true|false (BETA - 默认值=true)<br/>LegacyNodeRoleBehavior=true|false (ALPHA - 默认值=true)<br/>LocalStorageCapacityIsolation=true|false (BETA - 默认值=true)<br/>LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (ALPHA - 默认值=false)<br/>MountContainers=true|false (ALPHA - 默认值=false)<br/>NodeDisruptionExclusion=true|false (ALPHA - 默认值=false)<br/>NodeLease=true|false (BETA - 默认值=true)<br/>NonPreemptingPriority=true|false (ALPHA - 默认值=false)<br/>PodOverhead=true|false (ALPHA - 默认值=false)<br/>PodShareProcessNamespace=true|false (BETA - 默认值=true)<br/>ProcMountType=true|false (ALPHA - 默认值=false)br/>QOSReserved=true|false (ALPHA - 默认值=false)<br/>RemainingItemCount=true|false (BETA - 默认值=true)<br/>RemoveSelfLink=true|false (ALPHA - 默认值=false)<br/>RequestManagement=true|false (ALPHA - 默认值=false)<br/>ResourceLimitsPriorityFunction=true|false (ALPHA - 默认值=false)<br/>ResourceQuotaScopeSelectors=true|false (BETA - 默认值=true)<br/>RotateKubeletClientCertificate=true|false (BETA - 默认值=true)<br/>RotateKubeletServerCertificate=true|false (BETA - 默认值=true)<br/>RunAsGroup=true|false (BETA - 默认值=true)<br/>RuntimeClass=true|false (BETA - 默认值=true)<br/>SCTPSupport=true|false (ALPHA - 默认值=false)<br/>ScheduleDaemonSetPods=true|false (BETA - 默认值=true)<br/>ServerSideApply=true|false (BETA - 默认值=true)<br/>ServiceLoadBalancerFinalizer=true|false (BETA - 默认值=true)<br/>ServiceNodeExclusion=true|false (ALPHA - 默认值=false)<br/>StartupProbe=true|false (BETA - 默认值=true)<br/>StorageVersionHash=true|false (BETA - 默认值=true)<br/>StreamingProxyRedirects=true|false (BETA - 默认值=true)<br/>SupportNodePidsLimit=true|false (BETA - 默认值=true)<br/>SupportPodPidsLimit=true|false (BETA - 默认值=true)<br/>Sysctls=true|false (BETA - 默认值=true)<br/>TTLAfterFinished=true|false (ALPHA - 默认值=false)<br/>TaintBasedEvictions=true|false (BETA - 默认值=true)<br/>TaintNodesByCondition=true|false (BETA - 默认值=true)<br/>TokenRequest=true|false (BETA - 默认值=true)<br/>TokenRequestProjection=true|false (BETA - 默认值=true)<br/>TopologyManager=true|false (ALPHA - 默认值=false)<br/>ValidateProxyRedirects=true|false (BETA - 默认值=true)<br/>VolumePVCDataSource=true|false (BETA - 默认值=true)<br/>VolumeSnapshotDataSource=true|false (ALPHA - 默认值=false)<br/>VolumeSubpathEnvExpansion=true|false (BETA - 默认值=true)<br/>WatchBookmark=true|false (BETA - 默认值=true)<br/>WinDSR=true|false (ALPHA - 默认值=false)<br/>WinOverlay=true|false (ALPHA - 默认值=false)<br/>WindowsGMSA=true|false (BETA - 默认值=true)<br/>WindowsRunAsUserName=true|false (ALPHA - 默认值=false)（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--file-check-frequency duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Duration between checking config files for new data (default 20s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
检查配置文件中新数据的时间间隔（默认值为 20s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--global-housekeeping-interval duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Interval between global housekeepings (default 1m0s) (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
全局资源清理（housekeeping）操作的时间间隔。（默认值为 1m0s）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--hairpin-mode string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
How should the kubelet setup hairpin NAT. This allows endpoints of a Service to loadbalance back to themselves if they should try to access their own Service. Valid values are "promiscuous-bridge", "hairpin-veth" and "none". (default "promiscuous-bridge") (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置 kubelet 执行发夹模式（hairpin）网络地址转译的方式。该模式允许后端端点对其自身服务的访问能够再次经由负载均衡转发回自身。可选项包括 “promiscuous-bridge”、“hairpin-veth” 和 “none”。（默认值为 “promiscuous-bridge”）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--healthz-bind-address 0.0.0.0</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The IP address for the healthz server to serve on (set to 0.0.0.0 for all IPv4 interfaces and `::` for all IPv6 interfaces) (default 127.0.0.1) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
用于运行 healthz 服务器的 IP 地址（对于所有 IPv4 接口，设置为 0.0.0.0；对于所有 IPv6 接口，设置为 `::`）（默认值为 127.0.0.1）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--healthz-port int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port of the localhost healthz endpoint (set to 0 to disable) (default 10248) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
本地 healthz 端点使用的端口（设置为 0 表示禁用）（默认值为 10248）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for kubelet
-->
kubelet 操作的帮助命令
</td>
</tr>

<tr>
<td colspan="2">--hostname-override string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-empty, will use this string as identification instead of the actual hostname. If --cloud-provider is set, the cloud provider determines the name of the node (consult cloud provider documentation to determine if and how the hostname is used).
-->
如果为非空，将使用此字符串而不是实际的主机名作为节点标识。如果设置了 --cloud-provider，则云服务商将确定节点的名称（请查询云服务商文档以确定是否以及如何使用主机名）。
</td>
</tr>

<tr>
<td colspan="2">--housekeeping-interval duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Interval between container housekeepings (default 10s)
-->
清理容器操作的时间间隔（默认值为 10 s）
</td>
</tr>

<tr>
<td colspan="2">--http-check-frequency duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Duration between checking http for new data (default 20s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
HTTP 服务以获取新数据的时间间隔（默认值为 20 s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--image-gc-high-threshold int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The percent of disk usage after which image garbage collection is always run. Values must be within the range [0, 100], To disable image garbage collection, set to 100.  (default 85) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
镜像垃圾回收上限。磁盘使用空间达到该百分比时，镜像垃圾回收将持续工作。值必须在 [0，100] 范围内。要禁用镜像垃圾回收，请设置为 100。（默认值为 85）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--image-gc-low-threshold int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The percent of disk usage before which image garbage collection is never run. Lowest disk usage to garbage collect to. Values must be within the range [0, 100] and should not be larger than that of --image-gc-high-threshold. (default 80) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
镜像垃圾回收下限。磁盘使用空间在达到该百分比之前，镜像垃圾回收操作不会运行。值必须在 [0，100] 范围内，并且不得大于 --image-gc-high-threshold 的值。（默认值为 80）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--image-pull-progress-deadline duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If no pulling progress is made before this deadline, the image pulling will be cancelled. This docker-specific flag only works when container-runtime is set to docker. (default 1m0s)
-->
如果在该参数值所设置的期限之前没有拉取镜像的进展，镜像拉取操作将被取消。仅当容器运行环境设置为 docker 时，此特定于 docker 的参数才有效。（默认值为 1m0s）
</td>
</tr>

<tr>
<td colspan="2">--image-service-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[Experimental] The endpoint of remote image service. If not specified, it will be the same with container-runtime-endpoint by default. Currently unix socket endpoint is supported on Linux, while npipe and tcp endpoints are supported on windows.  Examples:'unix:///var/run/dockershim.sock', 'npipe:////./pipe/dockershim'
-->
[实验性特性] 远程镜像服务的端点。若未设定则默认情况下使用 container-runtime-endpoint 的值。目前支持的类型包括在 Linux 系统上的 UNIX 套接字端点和 Windows 系统上的 npipe 和 TCP 端点。例如：‘unix:///var/run/dockershim.sock’、‘npipe:////./pipe/dockershim’。
</td>
</tr>

<tr>
<td colspan="2">--iptables-drop-bit int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The bit of the fwmark space to mark packets for dropping. Must be within the range [0, 31]. (default 15) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
标记数据包将被丢弃的 fwmark 位设置。必须在 [0，31] 范围内。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--iptables-masquerade-bit int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The bit of the fwmark space to mark packets for SNAT. Must be within the range [0, 31]. Please match this parameter with corresponding parameter in kube-proxy. (default 14) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
标记数据包将进行 SNAT 的 fwmark 位设置。必须在 [0，31] 范围内。请将此参数与 kube-proxy 中的相应参数匹配。（默认值为 14）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--keep-terminated-pod-volumes</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Keep terminated pod volumes mounted to the node after the pod terminates.  Can be useful for debugging volume related issues. (DEPRECATED: will be removed in a future version)
-->
设置为 true 表示 Pod 终止后仍然保留之前挂载过的卷，常用于调试与卷有关的问题。（已弃用：未来版本将会移除该参数）
</td>
</tr>

<tr>
<td colspan="2">--kube-api-burst int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Burst to use while talking with kubernetes apiserver (default 10) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
每秒发送到 apiserver 的请求数量上限（默认值为 10）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--kube-api-content-type string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Content type of requests sent to apiserver. (default "application/vnd.kubernetes.protobuf") (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
发送到 apiserver 的请求的内容类型。（默认值为 “application/vnd.kubernetes.protobuf”）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</td>
</tr>

<tr>
<td colspan="2">--kube-api-qps int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
QPS to use while talking with kubernetes apiserver (default 5) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
与 apiserver 通信的每秒查询数（QPS） 值（默认值为 5）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--kube-reserved mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of ResourceName=ResourceQuantity (e.g. cpu=200m,memory=500Mi,ephemeral-storage=1Gi) pairs that describe resources reserved for kubernetes system components. Currently cpu, memory and local ephemeral storage for root file system are supported. See http://kubernetes.io/docs/user-guide/compute-resources for more detail. [default=none] (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
kubernetes 系统预留的资源配置，以一组 ResourceName=ResourceQuantity 格式表示。（例如：cpu=200m,memory=500Mi,ephemeral-storage=1Gi）。当前支持用于根文件系统的 CPU、内存（memory）和本地临时存储。请参阅 http://kubernetes.io/docs/user-guide/compute-resources 获取更多信息。（默认值为 none）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--kube-reserved-cgroup string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Absolute name of the top level cgroup that is used to manage kubernetes components for which compute resources were reserved via '--kube-reserved' flag. Ex. '/kube-reserved'. [default=''] (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
给出某个顶层 cgroup 绝对名称，该 cgroup 用于管理带 ‘--kube-reserved’ 标签的 kubernetes 组件的计算资源。例如：‘/kube-reserved’。（默认值为 ‘’）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeconfig file, specifying how to connect to the API server. Providing --kubeconfig enables API server mode, omitting --kubeconfig enables standalone mode.
-->
kubeconfig 配置文件的路径，指定如何连接到 API 服务器。提供 --kubeconfig 将启用 API 服务器模式，而省略 --kubeconfig 将启用独立模式。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-cgroups string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional absolute name of cgroups to create and run the Kubelet in. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
用于创建和运行 kubelet 的 cgroup 的绝对名称。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--lock-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> The path to file for kubelet to use as a lock file.
-->
&lt;警告：alpha 功能&gt; kubelet 使用的锁文件的路径。
</td>
</tr>

<tr>
<td colspan="2">--log-backtrace-at traceLocation</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
when logging hits line file:N, emit a stack trace (default :0)
-->
当日志逻辑执行到命中 file 的第 N 行时，转储调用堆栈（默认值为：0）
</td>
</tr>

<tr>
<td colspan="2">--log-cadvisor-usage</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Whether to log the usage of the cAdvisor container (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
设置为 true 表示将 cAdvisor 容器的使用情况写入日志（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--log-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-empty, write log files in this directory
-->
如果此值为非空，则在所指定的目录中写入日志文件
</td>
</tr>

<tr>
<td colspan="2">--log-file string</td>  
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If non-empty, use this log file
-->
如果此值非空，使用所给字符串作为日志文件名
</td>
</tr>

<tr>
<td colspan="2">--log-file-max-size uint</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Defines the maximum size a log file can grow to. Unit is megabytes. If the value is 0, the maximum file size is unlimited. (default 1800)
-->
定义日志文件的最大值。单位为兆字节（M）。如果值为 0，则最大文件大小表示无限制。（默认值为 1800）
</td>
</tr>

<tr>
<td colspan="2">--log-flush-frequency duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of seconds between log flushes (default 5s)
-->
两次日志刷新之间的最大秒数（默认值为 5s）
</td>
</tr>

<tr>
<td colspan="2">--logtostderr</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
log to standard error instead of files (default true)
-->
日志输出到 stderr 而不是文件（默认值为 true）
</td>
</tr>

<tr>
<td colspan="2">--machine-id-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of files to check for machine-id. Use the first one that exists. (default "/etc/machine-id,/var/lib/dbus/machine-id") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
以逗号分隔的文件列表，用于检查 machine-id。kubelet 使用存在的第一个 machine-id。（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--make-iptables-util-chains</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, kubelet will ensure iptables utility rules are present on host. (default true) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置为 true 表示 kubelet 将确保 Iptables 规则在主机上存在。（默认值为 true）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--manifest-url string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
URL for accessing additional Pod specifications to run (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
用于访问要运行的其他 Pod 规范的 URL（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--manifest-url-header --manifest-url-header 'a:hello,b:again,c:world' --manifest-url-header 'b:beautiful'</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of HTTP headers to use when accessing the url provided to --manifest-url. Multiple headers with the same name will be added in the same order provided. This flag can be repeatedly invoked. For example: --manifest-url-header 'a:hello,b:again,c:world' --manifest-url-header 'b:beautiful' (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
取值为由 HTTP 头部组成的逗号分隔列表，在访问 --manifest-url 所给出的 URL 时使用。名称相同的多个头部将按所列的顺序添加。该参数可以多次使用。例如：--manifest-url-header ‘a:hello,b:again,c:world’ --manifest-url-header ‘b:beautiful’（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>
<tr>
<td colspan="2">--master-service-namespace string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The namespace from which the kubernetes master services should be injected into pods (default "default") (DEPRECATED: This flag will be removed in a future version.)
-->
kubelet 向 Pod 注入 Kubernetes 主控服务信息时使用的命名空间（默认值为 “default”）（已弃用：此参数将在未来的版本中删除。）
</td>
</tr>

<tr>
<td colspan="2">--max-open-files int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of files that can be opened by Kubelet process. (default 1000000) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
kubelet 进程可以打开的最大文件数量（默认值为 1000000）。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--max-pods int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of Pods that can run on this Kubelet. (default 110) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
kubelet 能运行的 Pod 最大数量。（默认值为 110）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--maximum-dead-containers int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of old instances of containers to retain globally. Each container takes up some disk space. To disable, set to a negative number. (default -1) (DEPRECATED: Use --eviction-hard or --eviction-soft instead. Will be removed in a future version.)
-->
设置全局可保留的已停止容器实例个数上限。每个实例会占用一些磁盘空间。要禁用，请设置为负数。（默认值为 -1）（已弃用：请改用 --eviction-hard 或者 --eviction-soft。此参数将在未来的版本中删除。）
</td>
</tr>

<tr>
<td colspan="2">--maximum-dead-containers-per-container int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum number of old instances to retain per container. Each container takes up some disk space. (default 1) (DEPRECATED: Use --eviction-hard or --eviction-soft instead. Will be removed in a future version.)
-->
可以保留的每个已停止容器的最大实例数量。每个容器占用一些磁盘空间。（默认值为 1）（已弃用：请改用 --eviction-hard 或者 --eviction-soft。此参数将在未来的版本中删除。）
</td>
</tr>

<tr>
<td colspan="2">--minimum-container-ttl-duration duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum age for a finished container before it is garbage collected.  Examples: '300ms', '10s' or '2h45m' (DEPRECATED: Use --eviction-hard or --eviction-soft instead. Will be removed in a future version.)
-->
已结束的容器在被垃圾回收清理之前的最少存活时间。例如：‘300ms’、‘10s’ 或者 ‘2h45m’（已弃用：请改用 --eviction-hard 或者 --eviction-soft。此参数将在未来的版本中删除。）
</td>
</tr>

<tr>
<td colspan="2">--minimum-image-ttl-duration duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum age for an unused image before it is garbage collected.  Examples: '300ms', '10s' or '2h45m'. (default 2m0s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
不再使用的镜像在被垃圾回收清理之前的最少存活时间。例如：‘300ms’、‘10s’ 或者 ‘2h45m’。（默认值为 2m0s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--network-plugin string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> The name of the network plugin to be invoked for various events in kubelet/pod lifecycle. This docker-specific flag only works when container-runtime is set to docker.
-->
&lt;警告：alpha 功能&gt; 设置 kubelet/pod 生命周期中各种事件调用的网络插件的名称。仅当容器运行环境设置为 docker 时，此特定于 docker 的参数才有效。
</td>
</tr>

<tr>
<td colspan="2">--network-plugin-mtu int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> The MTU to be passed to the network plugin, to override the default. Set to 0 to use the default 1460 MTU. This docker-specific flag only works when container-runtime is set to docker.
-->
&lt;警告：alpha 功能&gt; 传递给网络插件的 MTU 值，将覆盖默认值。设置为 0 则使用默认的 1460 MTU。仅当容器运行环境设置为 docker 时，此特定于 docker 的参数才有效。
</td>
</tr>

<tr>
<td colspan="2">--node-ip string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
IP address of the node. If set, kubelet will use this IP address for the node
-->
节点的 IP 地址。如果设置，kubelet 将使用该 IP 地址作为节点的 IP 地址。
</td>
</tr>

<tr>
<td colspan="2">--node-labels mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> Labels to add when registering the node in the cluster.  Labels must be key=value pairs separated by ','. Labels in the 'kubernetes.io' namespace must begin with an allowed prefix (kubelet.kubernetes.io, node.kubernetes.io) or be in the specifically allowed set (beta.kubernetes.io/arch, beta.kubernetes.io/instance-type, beta.kubernetes.io/os, failure-domain.beta.kubernetes.io/region, failure-domain.beta.kubernetes.io/zone, failure-domain.kubernetes.io/region, failure-domain.kubernetes.io/zone, kubernetes.io/arch, kubernetes.io/hostname, kubernetes.io/instance-type, kubernetes.io/os)
-->
&lt;警告：alpha 功能&gt; kubelet 在集群中注册本节点时设置的标签。标签以 key=value 的格式表示，多个标签以逗号分隔。命名空间 ‘kubernetes.io’ 中的标签必须以 kubelet.kubernetes.io 或 node.kubernetes.io 为前缀，或者在以下明确允许范围内（beta.kubernetes.io/arch、beta.kubernetes.io/instance-type、beta.kubernetes.io/os、failure-domain.beta.kubernetes.io/region、 failure-domain.beta.kubernetes.io/zone、failure-domain.kubernetes.io/region、failure-domain.kubernetes.io/zone、kubernetes.io/arch、kubernetes.io/hostname、kubernetes.io/instance-type、kubernetes.io/os）
</td>
</tr>

<tr>
<td colspan="2">--node-status-max-images int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> The maximum number of images to report in Node.Status.Images. If -1 is specified, no cap will be applied. (default 50)
-->
&lt;警告：alpha 功能&gt; 在 Node.Status.Images 中可以报告的最大镜像数量。如果指定为 -1，则不设上限。（默认值为 50）
</td>
</tr>

<tr>
<td colspan="2">--node-status-update-frequency duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specifies how often kubelet posts node status to master. Note: be cautious when changing the constant, it must work with nodeMonitorGracePeriod in nodecontroller. (default 10s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
指定 kubelet 向主控节点汇报节点状态的时间间隔。注意：更改此常量时请务必谨慎，它必须与 nodecontroller 中的 nodeMonitorGracePeriod 一起使用。（默认值为 10s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--non-masquerade-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Traffic to IPs outside this range will use IP masquerade. Set to '0.0.0.0/0' to never masquerade. (default "10.0.0.0/8") (DEPRECATED: will be removed in a future version)
-->
kubelet 向该 IP 段之外的 IP 地址发送的流量将使用 IP 伪装技术。设置为 “0.0.0.0/0” 则不会使用伪装技术。（默认值为 “10.0.0.0/8”）（已弃用：该参数将在未来版本中删除。）
</td>
</tr>

<tr>
<td colspan="2">--oom-score-adj int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The oom-score-adj value for kubelet process. Values must be within the range [-1000, 1000] (default -999) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
kubelet 进程的 oom-score-adj 参数值。有效范围为 [-1000，1000]（默认值为 -999）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--pod-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The CIDR to use for pod IP addresses, only used in standalone mode.  In cluster mode, this is obtained from the master. For IPv6, the maximum number of IP's allocated is 65536 (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
用于给 Pod 分配 IP 地址的 CIDR 地址池，仅在单机模式下使用。在集群模式下，CIDR 设置是从主服务器获取的。对于 IPv6，分配的 IP 的最大数量为 65536（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--pod-infra-container-image string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The image whose network/ipc namespaces containers in each pod will use. This docker-specific flag only works when container-runtime is set to docker. (default "k8s.gcr.io/pause:3.1")
-->
指定基础设施镜像，Pod 内所有容器与其共享网络和 IPC 命名空间。仅当容器运行环境设置为 docker 时，此特定于 docker 的参数才有效。（默认值为 “k8s.gcr.io/pause:3.1”）
</td>
</tr>

<tr>
<td colspan="2">--pod-manifest-path string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the directory containing static pod files to run, or the path to a single static pod file. Files starting with dots will be ignored. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置包含要运行的静态 Pod 的文件的路径，或单个静态 Pod 文件的路径。以点（.）开头的文件将被忽略。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--pod-max-pids int</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Set the maximum number of processes per pod.  If -1, the kubelet defaults to the node allocatable pid capacity. (default -1) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置每个 Pod 中的最大进程数目。如果为 -1，则 kubelet 使用节点可分配的 PID 容量作为默认值。（默认值为 -1）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--pods-per-core int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Number of Pods per core that can run on this Kubelet. The total number of Pods on this Kubelet cannot exceed max-pods, so max-pods will be used if this calculation results in a larger number of Pods allowed on the Kubelet. A value of 0 disables this limit. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
kubelet 在每个处理器核上可运行的 Pod 数量。此 kubelet 上的 Pod 总数不能超过 max-pods 值。因此，如果此计算结果导致在 kubelet 上允许更多数量的 Pod，则使用 max-pods 值。值为 0 表示不做限制。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--port int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The port for the Kubelet to serve on. (default 10250) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
kubelet 服务监听的本机端口号。（默认值为 10250）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--protect-kernel-defaults</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Default kubelet behaviour for kernel tuning. If set, kubelet errors if any of kernel tunables is different than kubelet defaults. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置 kubelet 的默认内核调整行为。如果已设置该参数，当任何内核可调参数与 kubelet 默认值不同时，kubelet 都会出错。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--provider-id string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Unique identifier for identifying the node in a machine database, i.e cloudprovider
-->
设置主机数据库中用来标识节点的唯一标识，即 cloudprovider
</td>
</tr>

<tr>
<td colspan="2">--qos-reserved mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> A set of ResourceName=Percentage (e.g. memory=50%) pairs that describe how pod resource requests are reserved at the QoS level. Currently only memory is supported. Requires the QOSReserved feature gate to be enabled. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
&lt;警告：alpha 功能&gt; 设置在指定的 QoS 级别预留的 Pod 资源请求，以一组 “ResourceName=Percentage（资源名称=百分比）” 的形式进行设置，例如 memory=50%。当前仅支持内存（memory）。要求启用 QOSReserved 特性开关。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--read-only-port int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The read-only port for the Kubelet to serve on with no authentication/authorization (set to 0 to disable) (default 10255) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
kubelet 可以在没有身份验证/鉴权的情况下提供只读服务的端口（设置为 0 表示禁用）（默认值为 10255）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--really-crash-for-testing</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, when panics occur crash. Intended for testing.
-->
设置为 true 表示发生内核失效时崩溃。仅用于测试。
</td>
</tr>

<tr>
<td colspan="2">--redirect-container-streaming</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enables container streaming redirect. If false, kubelet will proxy container streaming data between apiserver and container runtime; if true, kubelet will return an http redirect to apiserver, and apiserver will access container runtime directly. The proxy approach is more secure, but introduces some overhead. The redirect approach is more performant, but less secure because the connection between apiserver and container runtime may not be authenticated.
-->
启用容器流数据重定向。如果设置为 false，则 kubelet 将在 apiserver 和容器运行时之间转发容器流数据；如果设置为 true，则 kubelet 将返回指向 apiserver 的 HTTP 重定向指令，而 apiserver 将直接访问容器运行时。代理方法更安全，但会带来一些开销。重定向方法性能更高，但安全性较低，因为 apiserver 和容器运行时之间的连接可能未通过身份验证。
</td>
</tr>

<tr>
<td colspan="2">--register-node</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Register the node with the apiserver. If --kubeconfig is not provided, this flag is irrelevant, as the Kubelet won't have an apiserver to register with. Default=true. (default true)
-->
将本节点注册到 apiserver。如果未提供 --kubeconfig 参数，则此参数无关紧要，因为 kubelet 将没有要注册的 apiserver。（默认值为 true）
</td>
</tr>

<tr>
<td colspan="2">--register-schedulable</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Register the node as schedulable. Won't have any effect if register-node is false. (default true) (DEPRECATED: will be removed in a future version)
-->
注册本节点为可调度的。register-node 为 false 时此设置无效。（默认值为 true）（已弃用：此参数将在未来的版本中删除。）
</td>
</tr>

<tr>
<td colspan="2">--register-with-taints []api.Taint</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Register the node with the given list of taints (comma separated "<key>=<value>:<effect>"). No-op if register-node is false.
-->
设置本节点的污点标记，格式为 “&lt;key&gt;=&lt;value&gt;:&lt;effect&gt;” ，以逗号分隔。当 register-node 为 false 时此标志无效。
</td>
</tr>

<tr>
<td colspan="2">--registry-burst int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum size of a bursty pulls, temporarily allows pulls to burst to this number, while still not exceeding registry-qps. Only used if --registry-qps > 0 (default 10) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置突发性镜像拉取的个数上限，在不超过 registration-qps 设置值的前提下暂时允许此参数所给的镜像拉取个数。仅在 --registry-qps 大于 0（默认值为 10）时使用（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--registry-qps int32</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If > 0, limit registry pull QPS to this value.  If 0, unlimited. (default 5) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
如果 --registry-qps 大于 0，用来限制镜像仓库的 QPS 上限。设置为 0，表示不受限制。（默认值为 5）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--resolv-conf string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Resolver configuration file used as the basis for the container DNS resolution configuration. (default "/etc/resolv.conf") (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
名字解析服务的配置文件名，用作容器 DNS 解析配置的基础。（默认值为 “/etc/resolv.conf”）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--root-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Directory path for managing kubelet files (volume mounts,etc). (default "/var/lib/kubelet")
-->
设置用于管理 kubelet 文件的根目录（例如挂载卷的相关文件）（默认值为 “/var/lib/kubelet”）
</td>
</tr>

<tr>
<td colspan="2">--rotate-certificates</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Beta feature> Auto rotate the kubelet client certificates by requesting new certificates from the kube-apiserver when the certificate expiration approaches. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
&lt;警告：alpha 功能&gt; 设置当客户端证书即将过期时 kubelet 自动从 kube-apiserver 请求新的证书进行轮换。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--rotate-server-certificates</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Auto-request and rotate the kubelet serving certificates by requesting new certificates from the kube-apiserver when the certificate expiration approaches. Requires the RotateKubeletServerCertificate feature gate to be enabled, and approval of the submitted CertificateSigningRequest objects. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
当证书即将过期时自动从 kube-apiserver 请求新的证书进行轮换。要求启用 RotateKubeletServerCertificate 特性开关，以及对提交的 CertificateSigningRequest 对象进行批复（approve）操作。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--runonce</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, exit after spawning pods from local manifests or remote urls. Exclusive with --enable-server
-->
设置为 true 表示从本地清单或远程 URL 创建完 Pod 后立即退出 kubelet 进程，与 --enable-server 参数互斥
</td>
</tr>

<tr>
<td colspan="2">--runtime-cgroups string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional absolute name of cgroups to create and run the runtime in.
-->
设置用于创建和运行容器运行时的 cgroup 的绝对名称。
</td>
</tr>

<tr>
<td colspan="2">--runtime-request-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Timeout of all runtime requests except long running request - pull, logs, exec and attach. When timeout exceeded, kubelet will cancel the request, throw out an error and retry later. (default 2m0s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
除了长时间运行的请求（包括 pull、logs、exec 和 attach 等操作），设置其他请求的超时时间。到达超时时间时，请求会被取消，抛出一个错误并会等待重试。（默认值为 2m0s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--seccomp-profile-root string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> Directory path for seccomp profiles. (default "/var/lib/kubelet/seccomp")
-->
&lt;警告：alpha 功能&gt; seccomp 配置文件目录。（默认值为 “/var/lib/kubelet/seccomp”）
</td>
</tr>

<tr>
<td colspan="2">--serialize-image-pulls</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Pull images one at a time. We recommend *not* changing the default value on nodes that run docker daemon with version < 1.9 or an Aufs storage backend. Issue #10959 has more details. (default true) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
逐一拉取镜像。建议 *不要* 在 docker 守护进程版本低于 1.9 或启用了 Aufs 存储后端的节点上更改默认值。（默认值为 true）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--skip-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, avoid header prefixes in the log messages
-->
设置为 true，则在日志消息中去掉标头前缀
</td>
</tr>

<tr>
<td colspan="2">--skip-log-headers</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
If true, avoid headers when opening log files
-->
设置为 true，打开日志文件时去掉标头
</td>
</tr>

<tr>
<td colspan="2">--stderrthreshold severity</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
logs at or above this threshold go to stderr (default 2)
-->
设置严重程度达到或超过此阈值的日志输出到标准错误输出（默认值为 2）
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-buffer-duration duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Writes in the storage driver will be buffered for this duration, and committed to the non memory backends as a single transaction (default 1m0s) (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
设置存储驱动程序中写操作的缓冲时长，超过时长的操作会作为单一事务提交到非内存后端。（默认值为 1m0s）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
database name (default "cadvisor") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
后端存储的数据库名称（默认值为 “cadvisor”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
database host:port (default "localhost:8086") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
后端存储的数据库连接 URL 地址（默认值为 “localhost:8086”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
database password (default "root") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
后端存储的数据库密码（默认值为 “root”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-secure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
use secure connection with database (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
后端存储的数据库是否用安全连接（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
table name (default "stats") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
后端存储的数据库表名（默认值为 “stats”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--storage-driver-user string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
database username (default "root") (DEPRECATED: This is a cadvisor flag that was mistakenly registered with the Kubelet. Due to legacy concerns, it will follow the standard CLI deprecation timeline before being removed.)
-->
后端存储的数据库用户名（默认值为 “root”）（已弃用：这是一个错误地在 kubelet 中注册的 cadvisor 参数。由于遗留问题，在删除之前，它将遵循标准的 CLI 弃用时间表。）
</td>
</tr>

<tr>
<td colspan="2">--streaming-connection-idle-timeout duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Maximum time a streaming connection can be idle before the connection is automatically closed. 0 indicates no timeout. Example: '5m' (default 4h0m0s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置流连接在自动关闭之前可以空闲的最长时间。0 表示没有超时限制。例如：‘5m’（默认值为 4h0m0s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--sync-frequency duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Max period between synchronizing running containers and config (default 1m0s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
在运行中的容器与其配置之间执行同步操作的最长时间间隔（默认值为 1m0s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--system-cgroups /</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Optional absolute name of cgroups in which to place all non-kernel processes that are not already inside a cgroup under /. Empty for no container. Rolling back the flag requires a reboot. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
cgroup 的绝对名称，用于所有尚未放置在根目录下某 cgroup 内的非内核进程。空值表示不指定 cgroup。回滚该参数需要重启机器。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--system-reserved mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of ResourceName=ResourceQuantity (e.g. cpu=200m,memory=500Mi,ephemeral-storage=1Gi) pairs that describe resources reserved for non-kubernetes components. Currently only cpu and memory are supported. See http://kubernetes.io/docs/user-guide/compute-resources for more detail. [default=none] (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
系统预留的资源配置，以一组 ”ResourceName=ResourceQuantity“ 的格式表示，（例如：cpu=200m,memory=500Mi,ephemeral-storage=1Gi）。目前仅支持 CPU 和内存（memory）的设置。请参考 http://kubernetes.io/docs/user-guide/compute-resources 获取更多信息。（默认值为 ”none“）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--system-reserved-cgroup string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Absolute name of the top level cgroup that is used to manage non-kubernetes components for which compute resources were reserved via '--system-reserved' flag. Ex. '/system-reserved'. [default=''] (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
给出一个顶层 cgroup 绝对名称，该 cgroup 用于管理非 kubernetes 组件，这些组件的计算资源通过 ‘--system-reserved’ 标志进行预留。例如 ‘/system-reserved’。（默认值为 ‘’）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--tls-cert-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing x509 Certificate used for serving HTTPS (with intermediate certs, if any, concatenated after server cert). If --tls-cert-file and --tls-private-key-file are not provided, a self-signed certificate and key are generated for the public address and saved to the directory passed to --cert-dir. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
包含 x509 证书的文件路径，用于 HTTPS 认证。如果有中间证书，则中间证书要串接在在服务器证书之后。如果未提供 --tls-cert-file 和 --tls-private-key-file，kubelet 会为公开地址生成自签名证书和密钥，并将其保存到通过 --cert-dir 指定的目录中。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--tls-cipher-suites stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Comma-separated list of cipher suites for the server. If omitted, the default Go cipher suites will be used. Possible values: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_RC4_128_SHA,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_RC4_128_SHA,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_RC4_128_SHA (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
服务器端加密算法列表，以逗号分隔，如果不设置，则使用 Go 语言加密包的默认算法列表。可选加密算法包括：TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_RC4_128_SHA,TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_RSA_WITH_RC4_128_SHA,TLS_RSA_WITH_3DES_EDE_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_GCM_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_RSA_WITH_AES_256_GCM_SHA384,TLS_RSA_WITH_RC4_128_SHA （已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--tls-min-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Minimum TLS version supported. Possible values: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13 (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置支持的最小 TLS 版本号，可选的版本号包括：VersionTLS10、VersionTLS11、VersionTLS12 和 VersionTLS13 （已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">--tls-private-key-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
File containing x509 private key matching --tls-cert-file. (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
包含与 --tls-cert-file 对应的 x509 私钥文件路径。（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>


<tr>
<td colspan="2">--topology-manager-policy string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Topology Manager policy to use. Possible values: 'none', 'best-effort', 'restricted', 'single-numa-node'. (default "none") (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
设置拓扑管理策略（Topology Manager policy）。可选值包括：‘none’、‘best-effort’、‘restricted’ 和 ‘single-numa-node’。（默认值为 “none”）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>

<tr>
<td colspan="2">-v, --v Level</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
number for the log level verbosity
-->
设置 kubelet 日志级别详细程度的数值
</td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Print version information and quit
-->
打印 kubelet 版本信息并退出
</td>
</tr>

<tr>
<td colspan="2">--vmodule moduleSpec</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
comma-separated list of pattern=N settings for file-filtered logging
-->
以逗号分隔的 pattern=N 设置列表，用于文件过滤的日志记录
</td>
</tr>

<tr>
<td colspan="2">--volume-plugin-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<Warning: Alpha feature> The full path of the directory in which to search for additional third party volume plugins (default "/usr/libexec/kubernetes/kubelet-plugins/volume/exec/")
-->
&lt;警告：alpha 功能&gt; 用来搜索第三方存储卷插件的目录（默认值为 “/usr/libexec/kubernetes/kubelet-plugins/volume/exec/”）
</td>
</tr>

<tr>
<td colspan="2">--volume-stats-agg-period duration</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specifies interval for kubelet to calculate and cache the volume disk usage for all pods and volumes. To disable volume calculations, set to 0. (default 1m0s) (DEPRECATED: This parameter should be set via the config file specified by the Kubelet's --config flag. See https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/ for more information.)
-->
指定 kubelet 计算和缓存所有 Pod 和卷的磁盘用量总值的时间间隔。要禁用磁盘用量计算，请设置为 0。（默认值为 1m0s）（已弃用：在 --config 指定的配置文件中进行设置。有关更多信息，请参阅 https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/。）
</td>
</tr>
</tbody>
</table>


