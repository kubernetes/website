---
title: 将 CoreDNS 设置为联邦集群的 DNS 提供者
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
此页面显示如何配置和部署 CoreDNS，将其用作联邦集群的 DNS 提供者

{{% /capture %}}


{{% capture objectives %}}

<!--
* Configure and deploy CoreDNS server
* Bring up federation with CoreDNS as dns provider
* Setup CoreDNS server in nameserver lookup chain
-->

* 配置和部署 CoreDNS 服务器
* 使用 CoreDNS 作为 dns 提供者设置联邦
* 在 nameserver 查找链中设置 CoreDNS 服务器

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

* 你需要有一个正在运行的 Kubernetes 集群（作为主机集群引用）。请参阅[入门指南](/docs/setup/)，了解平台的安装说明。
* 必须在联邦的集群成员中支持 `LoadBalancer` 服务，用来支持跨联邦集群的 `CoreDNS` 服务发现。

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
CoreDNS 可以部署在各种配置中。下面解释的是一个参考，可以根据平台和联邦集群的需要进行调整。

<!--
To deploy CoreDNS, we shall make use of helm charts. CoreDNS will be
deployed with [etcd](https://coreos.com/etcd) as the backend and should
be pre-installed. etcd can also be deployed using helm charts. Shown
below are the instructions to deploy etcd.
--->
为了部署 CoreDNS，我们将利用图表。
CoreDNS 将部署 [etcd](https://coreos.com/etcd) 作为后端，并且应该预先安装。etcd 也可以使用图表进行部署。下面显示了部署 etcd 的说明。

    helm install --namespace my-namespace --name etcd-operator stable/etcd-operator
    helm upgrade --namespace my-namespace --set cluster.enabled=true etcd-operator stable/etcd-operator

<!--
*Note: etcd default deployment configurations can be overridden, suiting the
host cluster.*
-->
*注意：etcd 默认部署配置可以被覆盖，适合主机集群。*

<!--
After deployment succeeds, etcd can be accessed with the
[http://etcd-cluster.my-namespace:2379](http://etcd-cluster.my-namespace:2379) endpoint within the host cluster.
-->
部署成功后，可以使用主机集群中的 [http://etcd-cluster.my-namespace:2379](http://etcd-cluster.my-namespace:2379) 端点访问 etcd。

<!--
The CoreDNS default configuration should be customized to suit the federation.
Shown below is the Values.yaml, which overrides the default
configuration parameters on the CoreDNS chart.
-->
应该定制 CoreDNS 默认配置适应联邦。
下面显示的是 Values.yaml，它覆盖了 CoreDNS 图表上的默认配置参数。

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
-->
以上配置文件需要说明：

<!--
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
 - `isClusterService` 指定是否应该将 CoreDNS 部署为集群服务，这是默认值。
你需要将其设置为 false，以便将 CoreDNS 部署为 Kubernetes 应用程序服务。
 - `serviceType` 指定为核心用户创建的 Kubernetes 服务的类型。
你需要选择 `LoadBalancer` 或 `NodePort`，以便在 Kubernetes 集群之外访问 CoreDNS 服务。
 - 禁用 `plugins.kubernetes`，默认情况下通过设置 `plugins.kubernetes.enabled` 为 false。
 - 启用 `plugins.etcd`，通过设置 `plugins.etcd.enabled` 为 true。 
 - 通过设置 `plugins.etcd.zones` 来配置 CoreDNS 具有权威性的 DNS 域（联邦域）。如上所示。
 - 通过设置 `plugins.etcd.endpoint` 来配置早期部署的 etcd 端点
 
<!-- 
Now deploy CoreDNS by running

    helm install --namespace my-namespace --name coredns -f Values.yaml stable/coredns

Verify that both etcd and CoreDNS pods are running as expected.
-->
现在部署 CoreDNS 来运行

    helm install --namespace my-namespace --name coredns -f Values.yaml stable/coredns

验证 etcd 和 CoreDNS，pod 都按预期运行。

<!--
## Deploying Federation with CoreDNS as DNS provider
-->

## 使用 CoreDNS 作为 DNS 提供者部署联邦

<!--
The Federation control plane can be deployed using `kubefed init`. CoreDNS
can be chosen as the DNS provider by specifying two additional parameters.
-->
可以使用 `kubefed init` 部署联邦控制平面。通过指定两个附加参数，可以选择 CoreDNS 作为 DNS 提供者。

    --dns-provider=coredns
    --dns-provider-config=coredns-provider.conf

<!--
coredns-provider.conf has below format:
-->
coredns-provider.conf 的格式如下：

    [Global]
    etcd-endpoints = http://etcd-cluster.my-namespace:2379
    zones = example.com.
    coredns-endpoints = <coredns-server-ip>:<port>

<!--
 - `etcd-endpoints` is the endpoint to access etcd.
 - `zones` is the federation domain for which CoreDNS is authoritative and is same as --dns-zone-name flag of `kubefed init`.
 - `coredns-endpoints` is the endpoint to access CoreDNS server. This is an optional parameter introduced from v1.7 onwards.
-->

 - `etcd-endpoints` 是访问 etcd 的端点。
 - `zones` 是 CoreDNS 具有权威性的联邦域，它与 `kubefed init` 的 --dns-zone-name 参数相同。
 - `coredns-endpoints` 是访问 CoreDNS 服务器的端点。这是从 v1.7 开始引入的一个可选参数。

{{< note >}}
<!--
`plugins.etcd.zones` in the CoreDNS configuration and the `--dns-zone-name` flag to `kubefed init` should match.
-->
CoreDNS 配置中的 `plugins.etcd.zones` 和 `kubefed init` 的 `--dns-zone-name` 参数应该匹配。 
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
下面的部分只适用于 v1.7 之前的版本，如果 `coredns-endpoint` 参数是
在 `coredns-provider.conf` 中配置的，就会自动处理。

{{< /note >}}

<!--
Once the federation control plane is deployed and federated clusters
are joined to the federation, you need to add the CoreDNS server to the
pod's nameserver resolv.conf chain in all the federated clusters as this
self hosted CoreDNS server is not discoverable publicly. This can be
achieved by adding the below line to `dnsmasq` container's arg in
`kube-dns` deployment.
-->
一旦部署了联邦控制平面并将联邦集群连接到联邦，
你需要将 CoreDNS 服务器添加到所有联邦集群中 pod 的 nameserver resolv.conf 链，因为这个自托管的 CoreDNS 服务器是不可公开发现的。
这可以通过在 `kube-dns` 部署中将下面的行添加到 `dnsmasq` 容器的参数中来实现。


    --server=/example.com./<CoreDNS endpoint>

<!--
Replace `example.com` above with federation domain.
-->
将上面的 `example.com` 替换为联邦域。

<!--
Now the federated cluster is ready for cross-cluster service discovery!
-->
现在联邦集群已经为跨集群服务发现做好了准备！

{{% /capture %}}


