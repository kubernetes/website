---
title: 云驱动
content_type: concept
weight: 30
---

<!--
---
title: Cloud Providers
content_type: concept
weight: 30
---
-->

<!-- overview -->
<!--
This page explains how to manage Kubernetes running on a specific
cloud provider.
-->
本文介绍了如何管理运行在特定云驱动上的 Kubernetes 集群。


<!-- body -->
<!--
### kubeadm
[kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/) is a popular option for creating kubernetes clusters.
kubeadm has configuration options to specify configuration information for cloud providers. For example a typical
in-tree cloud provider can be configured using kubeadm as shown below:
-->
### kubeadm
[kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/) 是创建 kubernetes 集群的一种流行选择。
kubeadm 通过提供配置选项来指定云驱动的配置信息。例如，一个典型的适用于“树内”云驱动的 kubeadm 配置如下：

```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
---
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.13.0
apiServer:
  extraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
  extraVolumes:
  - name: cloud
    hostPath: "/etc/kubernetes/cloud.conf"
    mountPath: "/etc/kubernetes/cloud.conf"
controllerManager:
  extraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
  extraVolumes:
  - name: cloud
    hostPath: "/etc/kubernetes/cloud.conf"
    mountPath: "/etc/kubernetes/cloud.conf"
```

<!--
The in-tree cloud providers typically need both `--cloud-provider` and `--cloud-config` specified in the command lines
for the [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/) and the
[kubelet](/docs/admin/kubelet/). The contents of the file specified in `--cloud-config` for each provider is documented below as well.

For all external cloud providers, please follow the instructions on the individual repositories,
which are listed under their headings below, or one may view [the list of all repositories](https://github.com/kubernetes?q=cloud-provider-&type=&language=)
-->

“树内”的云驱动通常需要在命令行中为 [kube-apiserver](/docs/admin/kube-apiserver/)、[kube-controller-manager](/docs/admin/kube-controller-manager/) 和 [kubelet](/docs/admin/kubelet/) 指定 `--cloud-provider` 和 `--cloud-config`。在 `--cloud-config` 中为每个供应商指定的文件的内容也同样需要写在下面。
对于所有外部云驱动，请遵循独立云存储库的说明，或浏览[所有版本库清单](https://github.com/kubernetes?q=cloud-provider-&type=&language=)

<!--
## AWS
This section describes all the possible configurations which can
be used when running Kubernetes on Amazon Web Services.

If you wish to use the external cloud provider, its repository is [kubernetes/cloud-provider-aws](https://github.com/kubernetes/cloud-provider-aws#readme)
-->

# AWS
本节介绍在 Amazon Web Services 上运行 Kubernetes 时可以使用的所有配置。
如果希望使用此外部云驱动，其代码库位于 [kubernetes/cloud-provider-aws](https://github.com/kubernetes/cloud-provider-aws#readme)

<!--
### Node Name

The AWS cloud provider uses the private DNS name of the AWS instance as the name of the Kubernetes Node object.
-->
### 节点名称

云驱动 AWS 使用 AWS 实例的私有 DNS 名称作为 Kubernetes 节点对象的名称。

<!--
### Load Balancers
You can setup [external load balancers](/docs/tasks/access-application-cluster/create-external-load-balancer/)
to use specific features in AWS by configuring the annotations as shown below.
-->
### 负载均衡器

用户可以通过配置注解（annotations）来设置 [外部负载均衡器](/docs/tasks/access-application-cluster/create-external-load-balancer/)，以在 AWS 中使用特定功能，如下所示：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example
  namespace: kube-system
  labels:
    run: example
  annotations:
     service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:xx-xxxx-x:xxxxxxxxx:xxxxxxx/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx #replace this value
     service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
spec:
  type: LoadBalancer
  ports:
  - port: 443
    targetPort: 5556
    protocol: TCP
  selector:
    app: example
```
<!--
Different settings can be applied to a load balancer service in AWS using _annotations_. The following describes the annotations supported on AWS ELBs:
-->

可以使用 _注解_ 将不同的设置应用于 AWS 中的负载均衡器服务。下面描述了 AWS ELB 所支持的注解：

<!--
* `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`: Used to specify access log emit interval.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`: Used on the service to enable or disable access logs.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`: Used to specify access log s3 bucket name.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`: Used to specify access log s3 bucket prefix.
* `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags`: Used on the service to specify a comma-separated list of key-value pairs which will be recorded as additional tags in the ELB. For example: `"Key1=Val1,Key2=Val2,KeyNoVal1=,KeyNoVal2"`.
* `service.beta.kubernetes.io/aws-load-balancer-backend-protocol`: Used on the service to specify the protocol spoken by the backend (pod) behind a listener. If `http` (default) or `https`, an HTTPS listener that terminates the connection and parses headers is created. If set to `ssl` or `tcp`, a "raw" SSL listener is used. If set to `http` and `aws-load-balancer-ssl-cert` is not used then a HTTP listener is used.
* `service.beta.kubernetes.io/aws-load-balancer-ssl-cert`: Used on the service to request a secure listener. Value is a valid certificate ARN. For more, see [ELB Listener Config](http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/elb-listener-config.html) CertARN is an IAM or CM certificate ARN, e.g. `arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`.
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled`: Used on the service to enable or disable connection draining.
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout`: Used on the service to specify a connection draining timeout.
* `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout`: Used on the service to specify the idle connection timeout.
* `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled`: Used on the service to enable or disable cross-zone load balancing.
* `service.beta.kubernetes.io/aws-load-balancer-security-groups`: Used to specify the security groups to be added to ELB created. This replaces all other security groups previously assigned to the ELB.
* `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups`: Used on the service to specify additional security groups to be added to ELB created
* `service.beta.kubernetes.io/aws-load-balancer-internal`: Used on the service to indicate that we want an internal ELB.
* `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol`: Used on the service to enable the proxy protocol on an ELB. Right now we only accept the value `*` which means enabling the proxy protocol on all ELB backends. In the future we could adjust this to allow setting the proxy protocol only on certain backends.
* `service.beta.kubernetes.io/aws-load-balancer-ssl-ports`: Used on the service to specify a comma-separated list of ports that will use SSL/HTTPS listeners. Defaults to `*` (all)
-->

* `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`：用于指定访问日志的间隔。
* `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`：用于在服务中启用或禁用访问日志。
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`：用于指定访问日志的 S3 桶名称。
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`：用于指定访问日志的 S3 桶前缀。
* `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags`：用于在服务中指定一个逗号分隔的键值对列表，它将作为附加标签被记录在 ELB 中。例如： `"Key1=Val1,Key2=Val2,KeyNoVal1=,KeyNoVal2"`。
* `service.beta.kubernetes.io/aws-load-balancer-backend-protocol`：用于在服务中指定监听器后端（pod）所使用的协议。如果指定 `http`（默认）或 `https`，将创建一个终止连接和解析头的 HTTPS 监听器。 如果设置为 `ssl` 或 `tcp`，将会使用 “原生的” SSL 监听器。如果设置为 `http`且不使用 `aws-load-balancer-ssl-cert`，将使用 HTTP 监听器。
* `service.beta.kubernetes.io/aws-load-balancer-ssl-cert`：用于在服务中请求安全监听器，其值为合法的证书 ARN（Amazon Resource Name）。更多内容，请参考 [ELB 监听器配置](http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/elb-listener-config.html)。证书 ARN 是 IAM（身份和访问管理）或 CM（证书管理）类型的 ARN，例如 `arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`。
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled`：用于在服务中启用或禁用连接耗尽（connection draining）。
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout`：用于在服务中指定连接耗尽超时时间。
* `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout`：用于在服务中指定空闲连接超时时间。
* `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled`：用于在服务中启用或禁用跨区域负载平衡。
* `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups`：用于在服务中指定要添加到创建的 ELB 中的其他安全组。
* `service.beta.kubernetes.io/aws-load-balancer-internal`：用于在服务中表明需要内部 ELB。
* `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol`：用于在 ELB 上启用代理协议。 当前仅接受 `*`值，也就是在所有 ELB 后端启用代理协议。将来可能进行调整，只允许特定的后端设置代理协议。
* `service.beta.kubernetes.io/aws-load-balancer-ssl-ports`：用于在服务中指定一个逗号分隔的端口列表，这些端口会使用 SSL/HTTPS 监听器。默认为 `*`（全部）

<!--
The information for the annotations for AWS is taken from the comments on [aws.go](https://github.com/kubernetes/cloud-provider-aws/blob/master/pkg/cloudprovider/providers/aws/aws.go)
-->

AWS 相关的注解信息取自 [aws.go](https://github.com/kubernetes/cloud-provider-aws/blob/master/pkg/cloudprovider/providers/aws/aws.go) 文件的注释。

## Azure

<!--
If you wish to use the external cloud provider, its repository is [kubernetes/cloud-provider-azure](https://github.com/kubernetes/cloud-provider-azure#readme)
-->
如果希望使用此外部云驱动，其代码库位于 [kubernetes/cloud-provider-azure](https://github.com/kubernetes/cloud-provider-azure#readme)

<!--
### Node Name

The Azure cloud provider uses the hostname of the node (as determined by the kubelet or overridden with `--hostname-override`) as the name of the Kubernetes Node object.
Note that the Kubernetes Node name must match the Azure VM name.
-->

### 节点名称

云驱动 Azure 使用节点的主机名（由 kubelet 决定，或者用 `--hostname-override` 覆盖）作为 Kubernetes 节点对象的名称。
注意 Kubernetes 节点名必须与 Azure 虚拟机的名称匹配。

## CloudStack

<!--
If you wish to use the external cloud provider, its repository is [apache/cloudstack-kubernetes-provider](https://github.com/apache/cloudstack-kubernetes-provider)
-->

如果希望使用此外部云驱动，其代码库位于 [apache/cloudstack-kubernetes-provider](https://github.com/apache/cloudstack-kubernetes-provider)。

<!--
### Node Name

The CloudStack cloud provider uses the hostname of the node (as determined by the kubelet or overridden with `--hostname-override`) as the name of the Kubernetes Node object.
Note that the Kubernetes Node name must match the CloudStack VM name.
-->

### 节点名称

云驱动 CloudStack 使用节点的主机名（由 kubelet 决定，或者用 `--hostname-override` 覆盖）作为 Kubernetes 节点对象的名称。
注意 Kubernetes 节点名必须与 CloudStack 虚拟机名匹配。

## GCE
<!--
If you wish to use the external cloud provider, its repository is [kubernetes/cloud-provider-gcp](https://github.com/kubernetes/cloud-provider-gcp#readme)
-->

如果希望使用此外部云驱动，其代码库位于 [kubernetes/cloud-provider-gcp](https://github.com/kubernetes/cloud-provider-gcp#readme)

<!--
### Node Name

The GCE cloud provider uses the hostname of the node (as determined by the kubelet or overridden with `--hostname-override`) as the name of the Kubernetes Node object.
Note that the first segment of the Kubernetes Node name must match the GCE instance name (e.g. a Node named `kubernetes-node-2.c.my-proj.internal` must correspond to an instance named `kubernetes-node-2`).
-->

### 节点名称

GCE 云驱动使用节点的主机名（由 kubelet 确定，或者用 `--hostname-override` 覆盖）作为 Kubernetes 节点对象的名称。
注意，Kubernetes 节点名的第一个字段必须匹配 GCE 实例名(例如，名为 `kubernetes-node-2.c.my-proj.internal` 的节点必须对应于一个名为 `kubernetes-node-2` 的实例)。

## OpenStack
<!--
This section describes all the possible configurations which can
be used when using OpenStack with Kubernetes.

If you wish to use the external cloud provider, its repository is [kubernetes/cloud-provider-openstack](https://github.com/kubernetes/cloud-provider-openstack#readme)
-->

本节介绍了使用 OpenStack 运行 Kubernetes 时所有可用的配置。
如果希望使用此外部云驱动，其代码库位于 [kubernetes/cloud-provider-openstack](https://github.com/kubernetes/cloud-provider-openstack#readme)

<!--
### Node Name

The OpenStack cloud provider uses the instance name (as determined from OpenStack metadata) as the name of the Kubernetes Node object.
Note that the instance name must be a valid Kubernetes Node name in order for the kubelet to successfully register its Node object.
-->

### 节点名称

OpenStack 云驱动使用实例名（由 OpenStack 元数据确定）作为 Kubernetes 节点对象的名称。
请注意，实例名必须是一个有效的 Kubernetes 节点名，以便 kubelet 成功注册其节点对象。

<!--
### Services

The OpenStack cloud provider
implementation for Kubernetes supports the use of these OpenStack services from
the underlying cloud, where available:

| Service                  | API Version(s) | Required |
|--------------------------|----------------|----------|
| Block Storage (Cinder)   | V1†, V2, V3    | No       |
| Compute (Nova)           | V2             | No       |
| Identity (Keystone)      | V2‡,  V3       | Yes      |
| Load Balancing (Neutron) | V1§, V2        | No       |
| Load Balancing (Octavia) | V2             | No       |

-->
### 服务

Kubernetes 的 OpenStack 云驱动实现支持从底层云使用这些 OpenStack 服务：

| 服务                     | API 版本       | 必需     |
|--------------------------|----------------|----------|
| 块存储 (Cinder)          | V1†, V2, V3    | No       |
| 计算    (Nova)           | V2             | No       |
| 身份认证 (Keystone)      | V2‡,  V3       | Yes      |
| 负载均衡器 (Neutron)     | V1§, V2        | No       |
| 负载均衡器 (Octavia)     | V2             | No       |

<!--
† Block Storage V1 API support is deprecated, Block Storage V3 API support was
added in Kubernetes 1.9.
‡ Identity V2 API support is deprecated and will be removed from the provider in
a future release. As of the "Queens" release, OpenStack will no longer expose the
Identity V2 API.
§ Load Balancing V1 API support was removed in Kubernetes 1.9.
-->

† Block Storage V1 版本的 API 被弃用，从 Kubernetes 1.9 版本开始加入了 Block Storage V3 版本 API。

‡ Identity V2 API 支持已被弃用，将在未来的版本中从供应商中移除。从 “Queens” 版本开始，OpenStack 将不再支持 Identity V2 版本的 API。

§ Kubernetes 1.9 中取消了对 V1 版本 Load Balancing API 的支持。

<!--
Service discovery is achieved by listing the service catalog managed by
OpenStack Identity (Keystone) using the `auth-url` provided in the provider
configuration. The provider will gracefully degrade in functionality when
OpenStack services other than Keystone are not available and simply disclaim
support for impacted features. Certain features are also enabled or disabled
based on the list of extensions published by Neutron in the underlying cloud.
-->

服务发现是通过使用供应商配置中提供的 `auth-url` 所列出 OpenStack 身份认证（Keystone）管理的服务目录来实现的。
当除 Keystone 外的 OpenStack 服务不可用时，供应商将优雅地降低功能，并简单地放弃对受影响特性的支持。
某些功能还可以根据 Neutron 在底层云中发布的扩展列表启用或禁用。

### cloud.conf
<!--
Kubernetes knows how to interact with OpenStack via the file cloud.conf. It is
the file that will provide Kubernetes with credentials and location for the OpenStack auth endpoint.
You can create a cloud.conf file by specifying the following details in it
-->

Kubernetes 知道如何通过 cloud.conf 文件与 OpenStack 交互。该文件将为 Kubernetes 提供 OpenStack 验证端点的凭据和位置。
用户可在创建 cloud.conf 文件时指定以下信息：

<!--
#### Typical configuration
This is an example of a typical configuration that touches the values that most
often need to be set. It points the provider at the OpenStack cloud's Keystone
endpoint, provides details for how to authenticate with it, and configures the
load balancer:
-->
#### 典型配置

下面是一个典型配置的例子，它涉及到最常设置的值。它将供应商指向 OpenStack 云的 Keystone 端点，提供如何使用它进行身份验证的细节，并配置负载均衡器:

```yaml
[Global]
username=user
password=pass
auth-url=https://<keystone_ip>/identity/v3
tenant-id=c869168a828847f39f7f06edd7305637
domain-id=2a73b8f597c04551a0fdc8e95544be8a

[LoadBalancer]
subnet-id=6937f8fa-858d-4bc9-a3a5-18d2c957166a
```
<!--
##### Global
These configuration options for the OpenStack provider pertain to its global
configuration and should appear in the `[Global]` section of the `cloud.conf`
file:
-->

##### 全局配置

这些配置选项属于 OpenStack 驱动的全局配置，并且应该出现在 `cloud.conf` 文件中的 `[global]` 部分:

<!--
* `auth-url` (Required): The URL of the keystone API used to authenticate. On
  OpenStack control panels, this can be found at Access and Security > API
  Access > Credentials.
* `username` (Required): Refers to the username of a valid user set in keystone.
* `password` (Required): Refers to the password of a valid user set in keystone.
* `tenant-id` (Required): Used to specify the id of the project where you want
  to create your resources.
* `tenant-name` (Optional): Used to specify the name of the project where you
  want to create your resources.
* `trust-id` (Optional): Used to specify the identifier of the trust to use for
  authorization. A trust represents a user's (the trustor) authorization to
  delegate roles to another user (the trustee), and optionally allow the trustee
  to impersonate the trustor. Available trusts are found under the
  `/v3/OS-TRUST/trusts` endpoint of the Keystone API.
* `domain-id` (Optional): Used to specify the id of the domain your user belongs
  to.
* `domain-name` (Optional): Used to specify the name of the domain your user
  belongs to.
* `region` (Optional): Used to specify the identifier of the region to use when
  running on a multi-region OpenStack cloud. A region is a general division of
  an OpenStack deployment. Although a region does not have a strict geographical
  connotation, a deployment can use a geographical name for a region identifier
  such as `us-east`. Available regions are found under the `/v3/regions`
  endpoint of the Keystone API.
* `ca-file` (Optional): Used to specify the path to your custom CA file.
-->

* `auth-url` (必需): 用于认证的 keystone API 的 URL。在 OpenStack 控制面板中，这可以在“访问和安全（Access and Security）> API 访问（API Access）> 凭证（Credentials）”中找到。
* `username` (必需): 指 keystone 中一个有效用户的用户名。
* `password` (必需): 指 keystone 中一个有效用户的密码。
* `tenant-id` (必需): 用于指定要创建资源的租户 ID。
* `tenant-name` (可选): 用于指定要在其中创建资源的租户的名称。
* `trust-id` (可选): 用于指定用于授权的信任的标识符。信任表示用户（委托人）将角色委托给另一个用户(受托人)的授权，并可选的允许受托人模仿委托人。可用的信任可以在 Keystone API 的 `/v3/OS-TRUST/trusts` 端点下找到。
* `domain-id` (可选): 用于指定用户所属域的 ID。
* `domain-name` (可选): 用于指定用户所属域的名称。
* `region` (可选): 用于指定在多区域 OpenStack 云上运行时使用的区域标识符。区域是 OpenStack 部署的一般性划分。虽然区域没有严格的地理含义，但部署可以使用地理名称表示区域标识符，如 `us-east`。可用区域位于 Keystone API 的 `/v3/regions` 端点之下。
* `ca-file` (可选): 用于指定自定义 CA 文件的路径。

<!--
When using Keystone V3 - which changes tenant to project - the `tenant-id` value
is automatically mapped to the project construct in the API.
-->

当使用 Keystone V3 时(它将tenant更改为project)，`tenant-id` 值会自动映射到 API 中的项目。

<!--
#####  Load Balancer
These configuration options for the OpenStack provider pertain to the load
balancer and should appear in the `[LoadBalancer]` section of the `cloud.conf`
file:
-->

####  负载均衡器

这些配置选项属于 OpenStack 驱动的全局配置，并且应该出现在 `cloud.conf` 文件中的 `[LoadBalancer]` 部分:

<!--
* `lb-version` (Optional): Used to override automatic version detection. Valid
  values are `v1` or `v2`. Where no value is provided automatic detection will
  select the highest supported version exposed by the underlying OpenStack
  cloud.
* `use-octavia` (Optional): Used to determine whether to look for and use an
  Octavia LBaaS V2 service catalog endpoint. Valid values are `true` or `false`.
  Where `true` is specified and an Octaiva LBaaS V2 entry can not be found, the
  provider will fall back and attempt to find a Neutron LBaaS V2 endpoint
  instead. The default value is `false`.
* `subnet-id` (Optional): Used to specify the id of the subnet you want to
  create your loadbalancer on. Can be found at Network > Networks. Click on the
  respective network to get its subnets.
* `floating-network-id` (Optional): If specified, will create a floating IP for
  the load balancer.
* `lb-method` (Optional): Used to specify an algorithm by which load will be
  distributed amongst members of the load balancer pool. The value can be
  `ROUND_ROBIN`, `LEAST_CONNECTIONS`, or `SOURCE_IP`. The default behavior if
  none is specified is `ROUND_ROBIN`.
* `lb-provider` (Optional): Used to specify the provider of the load balancer.
  If not specified, the default provider service configured in neutron will be
  used.
* `create-monitor` (Optional): Indicates whether or not to create a health
  monitor for the Neutron load balancer. Valid values are `true` and `false`.
  The default is `false`. When `true` is specified then `monitor-delay`,
  `monitor-timeout`, and `monitor-max-retries` must also be set.
* `monitor-delay` (Optional): The time between sending probes to
  members of the load balancer. Ensure that you specify a valid time unit. The valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h"
* `monitor-timeout` (Optional): Maximum time for a monitor to wait
  for a ping reply before it times out. The value must be less than the delay
  value. Ensure that you specify a valid time unit. The valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h"
* `monitor-max-retries` (Optional): Number of permissible ping failures before
  changing the load balancer member's status to INACTIVE. Must be a number
  between 1 and 10.
* `manage-security-groups` (Optional): Determines whether or not the load
  balancer should automatically manage the security group rules. Valid values
  are `true` and `false`. The default is `false`. When `true` is specified
  `node-security-group` must also be supplied.
* `node-security-group` (Optional): ID of the security group to manage.
-->

* `lb-version` (可选): 用于覆盖自动版本检测。有效值为 `v1` 或 `v2`。如果没有提供值，则自动选择底层 OpenStack 云所支持的最高版本。
* `use-octavia` (可选): 用于确定是否查找和使用 Octavia LBaaS V2 服务目录端点。有效值是 `true` 或 `false`。
如果指定了“true”，并且无法找到 Octaiva LBaaS V2 入口，则提供者将退回并尝试寻找一个 Neutron LBaaS V2 端点。默认值是 `false`。
* `subnet-id` (可选): 用于指定要在其上创建负载均衡器的子网的 ID。
可以在 “Network > Networks” 上找到。
单击相应的网络以获得其子网。
* `floating-network-id` (可选): 如果指定，将为负载均衡器创建一个浮动 IP。
* `lb-method` (可选): 用于指定将负载分配到负载均衡器池成员的算法。值可以是 `ROUND_ROBIN`、`LEAST_CONNECTIONS` 或 `SOURCE_IP`。如果没有指定，默认行为是 `ROUND_ROBIN`。
* `lb-provider` (可选): 用于指定负载均衡器的提供程序。如果没有指定，将使用在 Neutron 中配置的默认提供者服务。
* `create-monitor` (可选): 指定是否为 Neutron 负载均衡器创建健康监视器。有效值是 `true` 和 `false`。
默认为 `false`。当指定 `true` 时，还必须设置 `monitor-delay`、`monitor-timeout` 和 `monitor-max-retries`。
* `monitor-delay` (可选): 向负载均衡器的成员发送探测之间的时间间隔。
确保您指定了一个有效的时间单位。
有效时间单位为 `ns`、`us` (或 `µs`)、`ms`、`s`、`m`、`h`。
* `monitor-timeout` (可选): 在超时之前，监视器等待 ping 响应的最长时间。该值必须小于延迟值。确保您指定了一个有效的时间单位。有效时间单位为 `ns`、 `us` (或 `µs`)、`ms`、`s`、`m`、 `h`。
* `monitor-max-retries` (可选): 在将负载均衡器成员的状态更改为非活动之前，允许 ping 失败的次数。
必须是 1 到 10 之间的数字。
* `manage-security-groups` (可选): 确定负载均衡器是否应自动管理安全组规则。有效值是 `true` 和 `false`。默认为 `false`。当指定 `true` 时，还必须提供 `node-security-group`。
* `node-security-group` (可选): 要管理的安全组的 ID。

<!--
##### Block Storage
These configuration options for the OpenStack provider pertain to block storage
and should appear in the `[BlockStorage]` section of the `cloud.conf` file:
-->

##### 块存储

这些配置选项属于 OpenStack 驱动的全局配置，并且应该出现在 `cloud.conf` 文件中的 `[BlockStorage]` 部分：

<!--
* `bs-version` (可选): Used to override automatic version detection. Valid
  values are `v1`, `v2`, `v3` and `auto`. When `auto` is specified automatic
  detection will select the highest supported version exposed by the underlying
  OpenStack cloud. The default value if none is provided is `auto`.
* `trust-device-path` (Optional): In most scenarios the block device names
  provided by Cinder (e.g. `/dev/vda`) can not be trusted. This boolean toggles
  this behavior. Setting it to `true` results in trusting the block device names
  provided by Cinder. The default value of `false` results in the discovery of
  the device path based on its serial number and `/dev/disk/by-id` mapping and is
  the recommended approach.
* `ignore-volume-az` (Optional): Used to influence availability zone use when
  attaching Cinder volumes. When Nova and Cinder have different availability
  zones, this should be set to `true`. This is most commonly the case where
  there are many Nova availability zones but only one Cinder availability zone.
  The default value is `false` to preserve the behavior used in earlier
  releases, but may change in the future.
* `node-volume-attach-limit` (Optional): Maximum number of Volumes that can be
  attached to the node, default is 256 for cinder.
-->

* `bs-version` (可选): 指所使用的块存储 API 版本。其合法值为 `v1`、`v2`、`v3`和 `auto`。 `auto` 为默认值，将使用底层 Openstack 所支持的块存储 API 的最新版本。
* `trust-device-path` (可选): 在大多数情况下，块设备名称由 Cinder 提供（例如：`/dev/vda`）不可信任。此布尔值切换此行为。将其设置为 `true` 将导致信任 Cinder 提供的块设备名称。默认值 `false` 会根据设备序列号和 `/dev/disk/by-id` 映射发现设备路径，推荐这种方法。
* `ignore-volume-az` (可选): 用于在附加 Cinder 卷时影响可用区使用。
当 Nova 和 Cinder 有不同的可用区域时，应该将其设置为 `true`。
最常见的情况是，有许多 Nova 可用区，但只有一个 Cinder 可用区。
默认值是 `false`，以保持在早期版本中使用的行为，但是将来可能会更改。
* `node-volume-attach-limit` (可选): 可连接到节点的最大卷数，对于 Cinder 默认为 256。
   
<!--
If deploying Kubernetes versions <= 1.8 on an OpenStack deployment that uses
paths rather than ports to differentiate between endpoints it may be necessary
to explicitly set the `bs-version` parameter. A path based endpoint is of the
form `http://foo.bar/volume` while a port based endpoint is of the form
`http://foo.bar:xxx`.

In environments that use path based endpoints and Kubernetes is using the older
auto-detection logic a `BS API version autodetection failed.` error will be
returned on attempting volume detachment. To workaround this issue it is
possible to force the use of Cinder API version 2 by adding this to the cloud
provider configuration:
-->

如果在 OpenStack 上部署 Kubernetes <= 1.8 的版本，同时使用路径而不是端口来区分端点（Endpoints），那么可能需要显式设置 `bs-version` 参数。 基于路径的端点形如 `http://foo.bar/volume`，而基于端口的的端点形如
`http://foo.bar:xxx`。

在使用基于路径的端点，并且 Kubernetes 使用较旧的自动检索逻辑的环境中，尝试卷卸载（Detachment）会返回 `BS API version autodetection failed.` 错误。为了解决这个问题，可以通过添加以下内容到云驱动配置中，来强制使用 Cinder API V2 版本。


```yaml
[BlockStorage]
bs-version=v2
```
<!--
##### Metadata
These configuration options for the OpenStack provider pertain to metadata and
should appear in the `[Metadata]` section of the `cloud.conf` file:

* `search-order` (Optional): This configuration key influences the way that the
  provider retrieves metadata relating to the instance(s) in which it runs. The
  default value of `configDrive,metadataService` results in the provider
  retrieving metadata relating to the instance from the config drive first if
  available and then the metadata service. Alternative values are:
  * `configDrive` - Only retrieve instance metadata from the configuration
    drive.
  * `metadataService` - Only retrieve instance metadata from the metadata
    service.
  * `metadataService,configDrive` - Retrieve instance metadata from the metadata
    service first if available, then the configuration drive.

  Influencing this behavior may be desirable as the metadata on the
  configuration drive may grow stale over time, whereas the metadata service
  always provides the most up to date view. Not all OpenStack clouds provide
  both configuration drive and metadata service though and only one or the other
  may be available which is why the default is to check both.
-->

##### 元数据

这些配置选项属于 OpenStack 提供程序的全局配置，并且应该出现在 `cloud.conf` 文件中的 `[Metadata]` 部分：

* `search-order` (可选): 此配置键影响提供者检索与其运行的实例相关的元数据的方式。
`configDrive，metadataService` 的默认值导致供应商首先从配置驱动器中检索与实例相关的元数据（如果可用的话），然后检索元数据服务。
他们的替代值：
  * `configDrive` - 仅从配置驱动器检索实例元数据。
  * `metadataService` - 仅从元数据服务检索实例元数据。
  * `metadataService,configDrive` - 如果可用，首先从元数据服务检索实例元数据，然后从配置驱动器检索。

影响这种行为可能是可取的，因为配置驱动器上的元数据可能会随着时间的推移而变得陈旧，而元数据服务总是提供最新的数据视图。并不是所有的 OpenStack 云都同时提供配置驱动和元数据服务，可能只有一个或另一个可用，这就是为什么默认情况下要同时检查两个。

<!--
##### Route

These configuration options for the OpenStack provider pertain to the [kubenet]
Kubernetes network plugin and should appear in the `[Route]` section of the
`cloud.conf` file:

* `router-id` (Optional): If the underlying cloud's Neutron deployment supports
  the `extraroutes` extension then use `router-id` to specify a router to add
  routes to.  The router chosen must span the private networks containing your
  cluster nodes (typically there is only one node network, and this value should be
  the default router for the node network).  This value is required to use [kubenet]
  on OpenStack.

[kubenet]: /docs/concepts/cluster-administration/network-plugins/#kubenet
-->

##### 路由

这些配置选项属于 OpenStack 驱动为 Kubernetes 网络插件 [kubenet] 提供的设置，并且应该出现在 `cloud.conf` 文件中的 `[Route]` 部分:

* `router-id` (可选)：如果底层云的 Neutron 部署支持 `extraroutes` 扩展，则使用 `router-id` 指定要添加路由的路由器。选择的路由器必须跨越包含集群节点的私有网络（通常只有一个节点网络，这个值应该是节点网络的默认路由器）。在 OpenStack 上使用 [kubenet] 时需要这个值。

[kubenet]: /docs/concepts/cluster-administration/network-plugins/#kubenet



## OVirt

<!--
### Node Name

The OVirt cloud provider uses the hostname of the node (as determined by the kubelet or overridden with `--hostname-override`) as the name of the Kubernetes Node object.
Note that the Kubernetes Node name must match the VM FQDN (reported by OVirt under `<vm><guest_info><fqdn>...</fqdn></guest_info></vm>`)
-->

### 节点名称

OVirt 云驱动使用节点的主机名（由 kubelet 确定，或者用 `--hostname-override` 覆盖）作为 Kubernetes 节点对象的名称。
注意 Kubernetes 节点名必须与 VM FQDN 匹配（OVirt 在`<vm><guest_info><fqdn>...</fqdn></guest_info></vm>`中说明）。

## Photon

<!--
### Node Name

The Photon cloud provider uses the hostname of the node (as determined by the kubelet or overridden with `--hostname-override`) as the name of the Kubernetes Node object.
Note that the Kubernetes Node name must match the Photon VM name (or if `overrideIP` is set to true in the `--cloud-config`, the Kubernetes Node name must match the Photon VM IP address).
-->
### 节点名称

Photon 云驱动使用节点的主机名（由 kubelet 决定，或者用 `--hostname-override` 覆盖）作为 Kubernetes 节点对象的名称。
注意，Kubernetes 节点名必须与 Photon VM名匹配（或者，如果在 `--cloud-config` 中将 `overrideIP` 设置为 `true`，则 Kubernetes 节点名必须与 Photon VM IP 地址匹配）。

## VSphere

<!--
### Node Name

The VSphere cloud provider uses the detected hostname of the node (as determined by the kubelet) as the name of the Kubernetes Node object.

The `--hostname-override` parameter is ignored by the VSphere cloud provider.
-->
### 节点名称

VSphere 云驱动使用节点检测到的主机名(由 kubelet 确定)作为 Kubernetes 节点对象的名称。
VSphere 云驱动会忽略 `--hostname-override` 参数。

## IBM Cloud Kubernetes Service

<!--
### Compute nodes
By using the IBM Cloud Kubernetes Service provider, you can create clusters with a mixture of virtual and physical (bare metal) nodes in a single zone or across multiple zones in a region. For more information, see [Planning your cluster and worker node setup](https://cloud.ibm.com/docs/containers?topic=containers-plan_clusters#plan_clusters).

The name of the Kubernetes Node object is the private IP address of the IBM Cloud Kubernetes Service worker node instance.
-->
### 计算节点

通过使用 IBM Cloud Kubernetes Service 驱动，您可以在单个区域或跨区域的多个区（Region）中创建虚拟和物理（裸金属）节点的集群。
有关更多信息，请参见[规划您的集群和工作节点设置](https://cloud.ibm.com/docs/containers?topic=containers-plan_clusters#plan_clusters)。

Kubernetes 节点对象的名称是 IBM Cloud Kubernetes Services 工作节点实例的私有IP地址。

<!--
### Networking
The IBM Cloud Kubernetes Service provider provides VLANs for quality network performance and network isolation for nodes. You can set up custom firewalls and Calico network policies to add an extra layer of security for your cluster, or connect your cluster to your on-prem data center via VPN. For more information, see [Planning in-cluster and private networking](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_cluster#cs_network_cluster).

To expose apps to the public or within the cluster, you can leverage NodePort, LoadBalancer, or Ingress services. You can also customize the Ingress application load balancer with annotations. For more information, see [Planning to expose your apps with external networking](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_planning#cs_network_planning).
-->
### 网络

IBM Cloud Kubernetes Services 驱动提供 VLAN，用于提供高质量的网络性能和节点间的网络隔离。您可以设置自定义防火墙和 Calico 网络策略来为您的集群添加额外的安全层，或者通过 VPN 将您的集群连接到自有数据中心。有关更多信息，请参见[规划集群内和私有网络](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_cluster#cs_network_cluster)。

要向公众或集群内部公开应用程序，您可以利用 NodePort、LoadBalancer 或 Ingress 服务。您还可以使用注释自定义 Ingress 应用程序负载均衡器。有关更多信息，请参见[计划使用外部网络公开您的应用程序](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_planning#cs_network_planning)。

<!--
### Storage
The IBM Cloud Kubernetes Service provider leverages Kubernetes-native persistent volumes to enable users to mount file, block, and cloud object storage to their apps. You can also use database-as-a-service and third-party add-ons for persistent storage of your data. For more information, see [Planning highly available persistent storage](https://cloud.ibm.com/docs/containers?topic=containers-storage_planning#storage_planning).
-->

### 存储

IBM Cloud Kubernetes Services 驱动利用 Kubernetes 原生的持久卷，使用户能够将文件、块和云对象存储装载到他们的应用程序中。还可以使用 database-as-a-service 和第三方附加组件来持久存储数据。有关更多信息，请参见[规划高可用性持久存储](https://cloud.ibm.com/docs/containers?topic=containers-storage_planning#storage_planning)。

<!--
## Baidu Cloud Container Engine


### Node Name

The Baidu cloud provider uses the private IP address of the node (as determined by the kubelet or overridden with `--hostname-override`) as the name of the Kubernetes Node object.
Note that the Kubernetes Node name must match the Baidu VM private IP.
-->

## 百度云容器引擎

### 节点名称

Baidu 云驱动使用节点的私有 IP 地址（由 kubelet 确定，或者用 `--hostname-override` 覆盖）作为 Kubernetes 节点对象的名称。
注意 Kubernetes 节点名必须匹配百度 VM 的私有 IP。
