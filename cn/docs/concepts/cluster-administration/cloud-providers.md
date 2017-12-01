---
title: 云供应商
---

{% capture overview %}
本文介绍了如何管理运行在特定云供应商上的 Kubernetes 集群。
{% endcapture %}

{% capture body %}
# AWS
本节介绍在 Amazon Web Services 上运行 Kubernetes 时可以使用的所有配置。

## 负载均衡器
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
可以使用 _注解_ 将不同的设置应用于 AWS 中的负载平衡器服务。 下面描述了 AWS ELB 所支持的注解：

* `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`：用于指定访问日志的间隔。
* `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`：用于在服务中启用或禁用日志访问。
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`：用于指定访问日志的 S3 桶名称。
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`：用于指定访问日志的 S3 桶前缀。
* `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags`：用于在服务中指定一个逗号分隔的键值对列表，它将作为附加标签被记录在 ELB 中。 例如： `"Key1=Val1,Key2=Val2,KeyNoVal1=,KeyNoVal2"`。
* `service.beta.kubernetes.io/aws-load-balancer-backend-protocol`：用于在服务中指定监听器后端（pod）所使用的协议。 如果指定 `http` （默认） 或 `https`， 将创建一个终止连接和解析头的 HTTPS 监听器。 如果设置为 `ssl` 或 `tcp`， 将会使用 “原生的” SSL 监听器。 如果设置为 `http` 且不使用 `aws-load-balancer-ssl-cert`，将使用 HTTP 监听器。
* `service.beta.kubernetes.io/aws-load-balancer-ssl-cert`：用于在服务中请求安全监听器，其值为合法的证书 ARN（Amazon Resource Name）。 更多内容，请参考 [ELB 监听器配置](http://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/elb-listener-config.html)。 证书 ARN 是 IAM（身份和访问管理） 或 CM（证书管理）类型的 ARN，例如 `arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`。
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled`：用于在服务中启用或禁用连接耗尽（connection draining）。
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout`：用于在服务中指定连接耗尽超时时间。
* `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout`：用于在服务中指定空闲连接超时时间。
* `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled`：用于在服务中启用或禁用跨区域负载平衡。
* `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups`：用于在服务中指定要添加到创建的 ELB 中的其他安全组。
* `service.beta.kubernetes.io/aws-load-balancer-internal`：用于在服务中表明需要内部 ELB。
* `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol`：用于在 ELB 上启用代理协议。 当前仅接受 `*` 值，也就是在所有 ELB 后端启用代理协议。 将来可能进行调整，只允许特定的后端设置代理协议。
* `service.beta.kubernetes.io/aws-load-balancer-ssl-ports`：用于在服务中指定一个逗号分隔的端口列表，这些端口会使用 SSL/HTTPS 监听器。 默认为 `*`（全部）

AWS 相关的注解信息取自 [aws.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/providers/aws/aws.go) 文件的注释。

# OpenStack
本节介绍了使用 OpenStack 运行 Kubernetes 时所有可用的配置。

## cloud.conf
Kubernetes 知道如何通过文件 cloud.conf 与 OpenStack 进行交互。 该文件会为 Kubernetes 提供证书和 OpenStack 认证端点的区位信息。
用户可以通过在其中指定以下信息来创建 cloud.conf 文件。

### 最小配置
这是一个最小配置的例子，它涉及最常用的值：

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

#### 全局配置
* `username`：指 keystone 中设置的一个合法用户的用户名。
* `password`：指 keystone 中设置的一个合法用户的密码。
* `auth-url`：用于认证的 keystone API 的 URL 。 在 OpenStack 控制面板上，可以在 “访问和安全（Access and Security）> api 访问（API Access）> 凭证（Credentials）” 路径下找到它。
* `tenant-id`：用于指定要创建资源的项目 ID。
* `domain-id`：用于指定用户所属的域（domain）ID。

####  负载均衡器
* `subnet-id`：用于指定要创建的负载均衡器所在的子网 ID。 可以在 “Network > Networks” 路径下找到它。 点击相应的网络获取其子网。

### 可选配置

#### 块存储

Kubernetes 利用 OpenStack 服务目录对它知道如何使用的服务进行定位，包括 Cinder 块存储服务。 然而，云供应商的配置中包含一个附加选项，可以影响块存储 API 的使用方式：

* `bs-version`：指所使用的块存储 API 版本。 其合法值为
  `v1`、 `v2`、 `v3` 和 `auto`。 `auto` 为默认值，将使用底层 Openstack 所支持的块存储 API 的最新版本。

如果在 OpenStack 上部署 Kubernetes <= 1.8 的版本，同时使用路径而不是端口来区分端点（endpoints），那么可能需要显式设置 `bs-version` 参数。 基于路径的端点形如 `http://foo.bar/volume` ，而基于端口的的端点形如
`http://foo.bar:xxx`。

在使用基于路径的端点，并且 Kubernetes 使用较旧的自动检索逻辑的环境中，尝试卷卸载（detachment）会返回 `BS API version autodetection failed.` 错误。 为了解决这个问题，可以通过添加以下内容到云供应商配置中，来强制使用 Cinder API V2 版本。

```yaml
[BlockStorage]
bs-version=v2
```
{% endcapture %}

{% include templates/concept.md %}
