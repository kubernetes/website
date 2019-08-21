---
title: 将 CoreDNS 设置为 Cluster Federation的 DNS 提供端
content_template: templates/tutorial
weight: 130
---
<!--
---
title: Set up CoreDNS as DNS provider for Cluster Federation
content_template: templates/tutorial
weight: 130
---
-->
{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

<!--
This page shows how to configure and deploy CoreDNS to be used as the
DNS provider for Cluster Federation.
-->
本页显示如何配置和部署 CoreDNS ，用作 Cluster Federation 的 DNS 提供端。

{{% /capture %}}


{{% capture objectives %}}

<!--
* Configure and deploy CoreDNS server
* Bring up federation with CoreDNS as dns provider
* Setup CoreDNS server in nameserver lookup chain
-->
*  配置和部署 CoreDNS 服务
*  与 CoreDNS 建立联盟作为 DNS 提供端
*  在名称服务器中查找链中设置 CoreDNS 服务器

{{% /capture %}}


{{% capture prerequisites %}}

<!--
* You need to have a running Kubernetes cluster (which is
referenced as host cluster). Please see one of the
[getting started](/docs/setup/) guides for
installation instructions for your platform.
* Support for `LoadBalancer` services in member clusters of federation is
mandatory to enable `CoreDNS` for service discovery across federated clusters.
-->
*  你需要一个正在运行的 Kubernetes 集群（它被引用为主机集群）。请参阅其中的一个[入门](/docs/setup/) 指，来为你的平台进行安装。
*  联合成员集群中对`LoadBalancer`服务的支持是必须启用`CoreDNS`以跨联合集群进行发现服务。

{{% /capture %}}


{{% capture lessoncontent %}}

<!--
## Deploying CoreDNS and etcd charts
-->
## 部署 CoreDNS 和 etcd 图表

<!--
CoreDNS can be deployed in various configurations. Explained below is a
reference and can be tweaked to suit the needs of the platform and the
cluster federation.
-->
CoreDNS 可以部署在各种配置中。以下解释是一个参考，可以调整以满足平台和集群联盟的需要。

<!--
To deploy CoreDNS, we shall make use of helm charts. CoreDNS will be
deployed with [etcd](https://coreos.com/etcd) as the backend and should
be pre-installed. etcd can also be deployed using helm charts. Shown
below are the instructions to deploy etcd.
-->
要部署 CoreDNS， 我们将使用 helm 图表。CoreDNS 将与[etcd](https://coreos.com/etcd)一起部署，作为后端，应该预先安装。etcd 也可以用 helm 图表来部署。以下显示的是部署 etcd 的说明。

    helm install --namespace my-namespace --name etcd-operator stable/etcd-operator
    helm upgrade --namespace my-namespace --set cluster.enabled=true etcd-operator stable/etcd-operator
    
<!--
*Note: etcd default deployment configurations can be overridden, suiting the
host cluster.*
-->
*说明: etcd 默认部署可以被覆盖，适合主机群。*

<!--
After deployment succeeds, etcd can be accessed with the
[http://etcd-cluster.my-namespace:2379](http://etcd-cluster.my-namespace:2379) endpoint within the host cluster.
-->
部署成功后， etcd 可以用[http://etcd-cluster.my-namespace:2379](http://etcd-cluster.my-namespace:2379) 访问，是主集群中的终结点。

<!--
The CoreDNS default configuration should be customized to suit the federation.
Shown below is the Values.yaml, which overrides the default
configuration parameters on the CoreDNS chart.
-->
应自定义 CoreDNS 默认配置以适应联盟。下面显示的是 Values.yaml，它会覆盖 CoreDNS 图表上的默认设置参数。

```yaml
isClusterService: false
serviceType: "LoadBalancer"
plugins:
  kubernetes:
    enabled: false
  etcd:
    enabled: true
    zones:
    - "example.com."
    endpoint: "http://etcd-cluster.my-namespace:2379"
```

<!--
The above configuration file needs some explanation:

 - `isClusterService` specifies whether CoreDNS should be deployed as a
cluster-service, which is the default. You need to set it to false, so
that CoreDNS is deployed as a Kubernetes application service.
 - `serviceType` specifies the type of Kubernetes service to be created
for CoreDNS. You need to choose either "LoadBalancer" or "NodePort" to
make the CoreDNS service accessible outside the Kubernetes cluster.
 - Disable `plugins.kubernetes`, which is enabled by default by
setting `plugins.kubernetes.enabled` to false.
 - Enable `plugins.etcd` by setting `plugins.etcd.enabled` to
true.
 - Configure the DNS zone (federation domain) for which CoreDNS is
authoritative by setting `plugins.etcd.zones` as shown above.
 - Configure the etcd endpoint which was deployed earlier by setting
`plugins.etcd.endpoint`
-->
以上的配置文件需要一些解释：

 - `isClusterService` 指定是否应将 CoreDNS 部署为 cluster-service，这是默认设置。您应该将它设置为false，这样 CoreDNS 作为一个 Kubernetes 应用服务被部署。
 - `serviceType`为 CoreDNS 指定要创建的 Kubernetes 服务类型。你需要选择"LoadBalancer" 或 "NodePort" 使 Kubernetes 集群外的 CoreDNS 服务可访问。
 - 禁用`plugins.kubernetes`，默认情况下启用将`plugins.kubernetes.enabled`设置为 false 。
 - 通过设置`plugins.etcd.enabled`为 true 来启用`plugins.etcd`。
 - 配置 CoreDNS 所在的 DNS 区域（联合域），使其通过设置`plugins.etcd.zones`来获得权威性，如上所示。
 - 通过设置`plugins.etcd.endpoint`部署，配置 etcd 的终点端。

<!--
Now deploy CoreDNS by running

    helm install --namespace my-namespace --name coredns -f Values.yaml stable/coredns

Verify that both etcd and CoreDNS pods are running as expected.
-->
运行部署CoreDNS

    helm install --namespace my-namespace --name coredns -f Values.yaml stable/coredns

验证 etcd 和 CoreDNS pod 是否按预期运行。


<!--
## Deploying Federation with CoreDNS as DNS provider
-->
## 使用 CoreDNS 作为 DNS 提供程序来部署联盟

<!--
The Federation control plane can be deployed using `kubefed init`. CoreDNS
can be chosen as the DNS provider by specifying two additional parameters.

    --dns-provider=coredns
    --dns-provider-config=coredns-provider.conf

coredns-provider.conf has below format:

    [Global]
    etcd-endpoints = http://etcd-cluster.my-namespace:2379
    zones = example.com.
    coredns-endpoints = <coredns-server-ip>:<port>

 - `etcd-endpoints` is the endpoint to access etcd.
 - `zones` is the federation domain for which CoreDNS is authoritative and is same as --dns-zone-name flag of `kubefed init`.
 - `coredns-endpoints` is the endpoint to access CoreDNS server. This is an optional parameter introduced from v1.7 onwards.
-->
可以使用`kubefed init`部署联合控制平面。CoreDNS 可以通过指定两个附加参数来选择 DNS 提供程序。

    --dns-provider=coredns
    --dns-provider-config=coredns-provider.conf

coredns-provider.conf 的格式如下:

    [Global]
    etcd-endpoints = http://etcd-cluster.my-namespace:2379
    zones = example.com.
    coredns-endpoints = <coredns-server-ip>:<port>

 - `etcd-endpoints`是访问 etcd 的端点。
 - `zones`是 CoreDNS 具有权威性的联盟，与`kubefed init`的--dns-zone-name 标志相同。
 - `coredns-endpoints`是访问 CoreDNS 服务器的端点。这是一个从 v1.7 开始引入的可选参数。
 
{{< note >}}
<!--
`plugins.etcd.zones` in the CoreDNS configuration and the `--dns-zone-name` flag to `kubefed init` should match.
-->
CoreDNS 配置中的`plugins.etcd.zones`和`kubefed init`的`--dns-zone-name`标志应匹配。
{{< /note >}}


<!--
## Setup CoreDNS server in nameserver resolv.conf chain
-->
## 在 nameserver resolv.conf 链中设置 CoreDNS 服务器

{{< note >}}
<!--
The following section applies only to versions prior to v1.7
and will be automatically taken care of if the `coredns-endpoints`
parameter is configured in `coredns-provider.conf` as described in
section above.
-->
以下部分仅适用于 v1.7 之前的版本，如果`coredns-endpoints`参数在`coredns-provider.conf`中配置如以上部分所述，以下部分将会被自动处理。
{{< /note >}}

<!--
Once the federation control plane is deployed and federated clusters
are joined to the federation, you need to add the CoreDNS server to the
pod's nameserver resolv.conf chain in all the federated clusters as this
self hosted CoreDNS server is not discoverable publicly. This can be
achieved by adding the below line to `dnsmasq` container's arg in
`kube-dns` deployment.

    --server=/example.com./<CoreDNS endpoint>

Replace `example.com` above with federation domain.
-->
一旦部署了联盟控制平面和联合集群加入了联盟后，你需要在所有联盟集群中将 CoreDNS 服务添加到 pod's nameserver resolv.conf 链，因为自托管 CoreDNS 服务器不可以公开发现。这个可以通过在`kube-dns`部署中添加以下命令行到`dnsmasq`容器中的 arg 来实现。

    --server=/example.com./<CoreDNS endpoint>

用联盟域替换上面的`example.com`。


<!--
Now the federated cluster is ready for cross-cluster service discovery!
-->
现在联盟集群已准备好进行跨集群服务发现！

{{% /capture %}}
