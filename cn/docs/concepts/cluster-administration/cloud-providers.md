---
title: 云供应商
---
<!--
---
title: Cloud Providers
---
-->

{% capture overview %}
<!--
This page explains how to manage Kubernetes running on a specific
cloud provider.
-->
本文介绍了如何管理运行在特定云供应商上的 Kubernetes 集群。
{% endcapture %}

{% capture body %}
# AWS
<!--
This section describes all the possible configurations which can
be used when running Kubernetes on Amazon Web Services.

-->
本节介绍在 Amazon Web Services 上运行 Kubernetes 时可以使用的所有配置。
<!--
## Load Balancers
You can setup [external load balancers](/docs/tasks/access-application-cluster/create-external-load-balancer/)
to use specific features in AWS by configuring the annotations as shown below.
-->
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
<!--
Different settings can be applied to a load balancer service in AWS using _annotations_. The following describes the annotations supported on AWS ELBs:
-->
可以使用 _注解_ 将不同的设置应用于 AWS 中的负载平衡器服务。 下面描述了 AWS ELB 所支持的注解：
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
* `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups`: Used one the service to specify additional security groups to be added to ELB created
* `service.beta.kubernetes.io/aws-load-balancer-internal`: Used on the service to indicate that we want an internal ELB.
* `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol`: Used on the service to enable the proxy protocol on an ELB. Right now we only accept the value `*` which means enable the proxy protocol on all ELB backends. In the future we could adjust this to allow setting the proxy protocol only on certain backends.
* `service.beta.kubernetes.io/aws-load-balancer-ssl-ports`: Used on the service to specify a comma-separated list of ports that will use SSL/HTTPS listeners. Defaults to `*` (all)
-->
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

<!--
The information for the annotations for AWS is taken from the comments on [aws.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/providers/aws/aws.go)
-->
AWS 相关的注解信息取自 [aws.go](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/providers/aws/aws.go) 文件的注释。

# OpenStack
<!--
This section describes all the possible configurations which can
be used when using OpenStack with Kubernetes.
-->
本节介绍了使用 OpenStack 运行 Kubernetes 时所有可用的配置。

## cloud.conf
<!--
Kubernetes knows how to interact with OpenStack via the file cloud.conf. It is the file that will provide Kubernetes with credentials and location for the OpenStack auth endpoint.
You can create a cloud.conf file by specifying the following details in it

-->
Kubernetes 知道如何通过文件 cloud.conf 与 OpenStack 进行交互。 该文件会为 Kubernetes 提供证书和 OpenStack 认证端点的区位信息。
用户可以通过在其中指定以下信息来创建 cloud.conf 文件。
<!--
### Minimal configuration
This is an example of a minimal configuration that touches the values that most often need to be set:

-->
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

<!--
#### Global
* `username`: Refers to the username of a valid user set in keystone.
* `password`:Refers to the password of a valid user set in keystone.
* `auth-url`: The URL of the keystone API used to authenticate. On OpenStack control panels, this can be found at Access and Security > API Access > Credentials.
* `tenant-id`: Used to specify the id of the project where you want to create your resources.
* `domain-id`: Used to specify the id of the domain your user belongs to.
* 
-->
#### 全局配置
* `username`：指 keystone 中设置的一个合法用户的用户名。
* `password`：指 keystone 中设置的一个合法用户的密码。
* `auth-url`：用于认证的 keystone API 的 URL 。 在 OpenStack 控制面板上，可以在 “访问和安全（Access and Security）> api 访问（API Access）> 凭证（Credentials）” 路径下找到它。
* `tenant-id`：用于指定要创建资源的项目 ID。
* `domain-id`：用于指定用户所属的域（domain）ID。
<!--
####  Load Balancer
* `subnet-id`: Used to specify the id of the subnet you want to create your loadbalancer on. Can be found at Network > Networks. Click on the respective network to get its subnets.
-->
####  负载均衡器
* `subnet-id`：用于指定要创建的负载均衡器所在的子网 ID。 可以在 “Network > Networks” 路径下找到它。 点击相应的网络获取其子网。
{% endcapture %}

{% include templates/concept.md %}
