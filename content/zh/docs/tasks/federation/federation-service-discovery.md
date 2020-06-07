---
title: 使用联合服务来实现跨集群的服务发现
content_template: templates/task
weight: 140
---
<!-- ---
title: Cross-cluster Service Discovery using Federated Services
reviewers:
- bprashanth
- quinton-hoole
content_template: templates/task
weight: 140
--- -->

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

<!-- This guide explains how to use Kubernetes Federated Services to deploy
a common Service across multiple Kubernetes clusters. This makes it
easy to achieve cross-cluster service discovery and availability zone
fault tolerance for your Kubernetes applications. -->
本指南说明了如何使用 Kubernetes 联合服务跨多个 Kubernetes 集群部署通用服务。这样可以轻松实现 Kubernetes 应用程序的跨集群服务发现和可用区容错。


<!-- Federated Services are created in much that same way as traditional
[Kubernetes Services](/docs/concepts/services-networking/service/) by making an API
call which specifies the desired properties of your service. In the
case of Federated Services, this API call is directed to the
Federation API endpoint, rather than a Kubernetes cluster API
endpoint. The API for Federated Services is 100% compatible with the
API for traditional Kubernetes Services. -->
联合服务的创建与传统服务几乎相同 [Kubernetes Services](/docs/concepts/services-networking/service/) 即通过 API 调用来指定所需的服务属性。对于联合服务，此 API 调用定向到联合身份验证 API 接入点，而不是 Kubernetes 集群 API 接入点。联合服务的 API 与传统 Kubernetes 服务的 API 是 100% 兼容的。

<!-- Once created, the Federated Service automatically: -->
创建后，联合服务会自动:

<!-- 1. Creates matching Kubernetes Services in every cluster underlying your Cluster Federation,
2. Monitors the health of those service "shards" (and the clusters in which they reside), and
3. Manages a set of DNS records in a public DNS provider (like Google Cloud DNS, or AWS Route 53), thus ensuring that clients
of your federated service can seamlessly locate an appropriate healthy service endpoint at all times, even in the event of cluster,
availability zone or regional outages. -->
1. 在基础集群联合的每个集群中创建匹配的 Kubernetes 服务,
2. 监视那些服务 "分片"(及其驻留的集群)的运行状况,以及
3. 在公共 DNS 提供商(例如 Google Cloud DNS 或 AWS Route 53)中管理一组 DNS 记录,即使在集群可用区域中断的情况下，也能确保您联合服务的客户端始终可以无缝地定位合适的健康服务接入点。

<!-- Clients inside your federated Kubernetes clusters (that is Pods) will
automatically find the local shard of the Federated Service in their
cluster if it exists and is healthy, or the closest healthy shard in a
different cluster if it does not. -->
如果存在健康的分片，联合 Kubernetes 集群(即 Pods )中的客户端将自动在其中找到联合服务的本地分片集群或者集群中最接近的健康分片;如果不存在，则使用最接近的其他集群的健康分片。

{{% /capture %}}

{{< toc >}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

<!-- ## Prerequisites -->
## 前提

<!-- This guide assumes that you have a running Kubernetes Cluster
Federation installation. If not, then head over to the
[federation admin guide](/docs/admin/federation/) to learn how to
bring up a cluster federation (or have your cluster administrator do
this for you). Other tutorials, for example
[this one](https://github.com/kelseyhightower/kubernetes-cluster-federation)
by Kelsey Hightower, are also available to help you. -->
本指南假设您已经安装 Kubernetes 联合集群。如果没有，则访问 [联合集群管理指南](/docs/admin/federation/)了解如何建立联合集群(或让您的集群管理员为您执行此操作)。其他教程，例如 Kelsey Hightower 编写的 [案例](https://github.com/kelseyhightower/kubernetes-cluster-federation)或许有用。

<!-- You should also have a basic
[working knowledge of Kubernetes](/docs/tutorials/kubernetes-basics/) in
general, and [Services](/docs/concepts/services-networking/service/) in particular. -->
一般而言，您应该还有基本的 [Kubernetes 工作常识](/docs/tutorials/kubernetes-basics/)，特别是 [Services](/docs/concepts/services-networking/service/)。

<!-- ## Hybrid cloud capabilities -->
## 混合云功能

<!-- Federations of Kubernetes Clusters can include clusters running in
different cloud providers (such as Google Cloud or AWS), and on-premises
(such as on OpenStack). Simply create all of the clusters that you
require, in the appropriate cloud providers and/or locations, and
register each cluster's API endpoint and credentials with your
Federation API Server (See the
[federation admin guide](/docs/admin/federation/) for details). -->
Kubernetes 联合集群需要可以在不同的云提供商(例如 Google Cloud 或 AWS)和本地(例如 OpenStack)环境中运行。只需在合适的云提供商创建所需的所有集群，向您的联合身份验证 API 服务器注册每个集群的 API 接入点和凭据(有关详细信息，请参见 [联合管理指南](/docs/admin/federation/))。

<!-- Thereafter, your applications and services can span different clusters
and cloud providers as described in more detail below. -->
此后，您的应用程序和服务可以跨越不同的集群和云提供商，如下所述。

<!-- ## Creating a federated service -->
## 创建联合服务

<!-- This is done in the usual way, for example: -->
常见方式创建，例如:

``` shell
kubectl --context=federation-cluster create -f services/nginx.yaml
```

<!-- The '--context=federation-cluster' flag tells kubectl to submit the
request to the Federation API endpoint, with the appropriate
credentials. If you have not yet configured such a context, visit the
[federation admin guide](/docs/admin/federation/) or one of the
[administration tutorials](https://github.com/kelseyhightower/kubernetes-cluster-federation)
to find out how to do so. -->
'--context=federation-cluster' 标志通知 kubectl 使用合适的凭据将请求提交到联合 API 接入点。如果您尚未配置此类上下文，请访问 [联合管理指南](/docs/admin/federation/)或者 [管理教程](https://github.com/kelseyhightower/kubernetes-cluster-federation)找出解决方案。

<!-- As described above, the Federated Service will automatically create
and maintain matching Kubernetes services in all of the clusters
underlying your federation. -->
如上所述，联合服务将自动创建并在所有集群中维护匹配的 Kubernetes 服务以支持联合。

<!-- You can verify this by checking in each of the underlying clusters, for example: -->
您可以通过核对每个基础集群的信息来验证这一点, 例如:

``` shell
kubectl --context=gce-asia-east1a get services nginx
NAME     TYPE        CLUSTER-IP     EXTERNAL-IP      PORT(S)   AGE
nginx    ClusterIP   10.63.250.98   104.199.136.89   80/TCP    9m
```

<!-- The above assumes that you have a context named 'gce-asia-east1a'
configured in your client for your cluster in that zone. The name and
namespace of the underlying services will automatically match those of
the Federated Service that you created above (and if you happen to
have had services of the same name and namespace already existing in
any of those clusters, they will be automatically adopted by the
Federation and updated to conform with the specification of your
Federated Service - either way, the end result will be the same). -->
以上假设您有一个名为 'gce-asia-east1a' 上下文在客户端中为该区域中的集群配置。基础服务的名称和命名空间将自动与您在上面创建的联合服务匹配(如果服务的名称和命名空间与集群中任意一个服务器的名称和命名空间相同，它们将被联合并更新为符合您的规范联合服务 - 无论哪种方式，最终结果都是相同的)。

<!-- The status of your Federated Service will automatically reflect the
real-time status of the underlying Kubernetes services, for example: -->
联合服务的状态将自动反映基础 Kubernetes 服务的实时状态，例如:

``` shell
kubectl --context=federation-cluster describe services nginx
```
```
Name:                   nginx
Namespace:              default
Labels:                 run=nginx
Annotations:            <none>
Selector:               run=nginx
Type:                   LoadBalancer
IP:                     10.63.250.98
LoadBalancer Ingress:   104.197.246.190, 130.211.57.243, 104.196.14.231, 104.199.136.89, ...
Port:                   http    80/TCP
Endpoints:              <none>
Session Affinity:       None
Events:                 <none>
```

<!-- {{< note >}}
The 'LoadBalancer Ingress' addresses of your Federated Service
correspond with the 'LoadBalancer Ingress' addresses of all of the
underlying Kubernetes services (once these have been allocated - this
may take a few seconds). For inter-cluster and inter-cloud-provider
networking between service shards to work correctly, your services
need to have an externally visible IP address. [Service Type:
Loadbalancer](/docs/concepts/services-networking/service/#loadbalancer)
is typically used for this, although other options
(for example [External IPs](/docs/concepts/services-networking/service/#external-ips)) exist.
{{< /note >}} -->
{{< note >}}
联合服务的 'LoadBalancer Ingress' 地址与所有基础 Kubernetes 服务的 'LoadBalancer Ingress' 地址相对应(一旦分配了这些地址，这可能需要几秒钟)。为了使服务分片之间的集群和云提供商之间的网络正常工作，您的服务需要具有一个外部可见的 IP 地址。[Service Type:Loadbalancer](/docs/concepts/services-networking/service/#loadbalancer)。尽管存在其他选项(例如 [外部 IP](/docs/concepts/services-networking/service/#external-ips)),但通常会使用 [Service 类型:Loadbalancer](/docs/concepts/services-networking/service/#loadbalancer)。
{{< /note >}}

<!-- Note also that we have not yet provisioned any backend Pods to receive
the network traffic directed to these addresses (that is 'Service
Endpoints'), so the Federated Service does not yet consider these to
be healthy service shards, and has accordingly not yet added their
addresses to the DNS records for this Federated Service (more on this
aspect later). -->
还要注意，我们尚未设置任何后端 Pod 来接收定向到这些地址的网络流量(即 'Service Endpoints')，因此联合服务尚未将它们视为健康的服务分片，并且尚未将其地址添加到联合服务的 DNS 记录中(稍后在此方面进行介绍)。

<!-- ## Adding backend pods -->
## 添加后端 pods

<!-- To render the underlying service shards healthy, we need to add
backend Pods behind them. This is currently done directly against the
API endpoints of the underlying clusters (although in future the
Federation server will be able to do all this for you with a single
command, to save you the trouble). For example, to create backend Pods
in 13 underlying clusters: -->
为了使基础服务分片健康，我们需要在它们后面添加后端 Pod。当前，这是直接针对基础集群 API 接入点完成的(尽管将来，联合服务将能够通过单个命令为您完成所有这些操作，从而省去了麻烦)。例如，在13个基础集群中创建后端 Pod:

``` shell
for CLUSTER in asia-east1-c asia-east1-a asia-east1-b \
                        europe-west1-d europe-west1-c europe-west1-b \
                        us-central1-f us-central1-a us-central1-b us-central1-c \
                        us-east1-d us-east1-c us-east1-b
do
  kubectl --context=$CLUSTER run nginx --image=nginx:1.11.1-alpine --port=80
done
```

<!-- Note that `kubectl run` automatically adds the `run=nginx` labels required to associate the backend pods with their services. -->
注意，`kubectl run` 会自动添加 `run=nginx` 标签，这是将后端 pod 与其服务关联起来所必需的。

<!-- ## Verifying public DNS records -->
## 验证公共 DNS 记录

<!-- Once the above Pods have successfully started and have begun listening
for connections, Kubernetes will report them as healthy endpoints of
the service in that cluster (through automatic health checks). The Cluster
Federation will in turn consider each of these
service 'shards' to be healthy, and place them in serving by
automatically configuring corresponding public DNS records. You can
use your preferred interface to your configured DNS provider to verify
this. For example, if your Federation is configured to use Google
Cloud DNS, and a managed DNS domain 'example.com': -->
一旦上述 Pod 成功启动并开始侦听连接，Kubernetes 就会将它们报告为该集群中服务的正常接入点(通过自动运行状况检查)。反过来，联合集群会将这些服务 '分片' 中的每一个视为健康，并通过自动配置相应的公共 DNS 记录将其置于服务中。您可以使用首选接口访问已配置的 DNS 提供程序来进行验证。例如，如果您的联邦配置为使用 Google Cloud DNS 和托管 DNS 域名 'example.com'。

``` shell
gcloud dns managed-zones describe example-dot-com
```
```
creationTime: '2016-06-26T18:18:39.229Z'
description: Example domain for Kubernetes Cluster Federation
dnsName: example.com.
id: '3229332181334243121'
kind: dns#managedZone
name: example-dot-com
nameServers:
- ns-cloud-a1.googledomains.com.
- ns-cloud-a2.googledomains.com.
- ns-cloud-a3.googledomains.com.
- ns-cloud-a4.googledomains.com.
```

```shell
gcloud dns record-sets list --zone example-dot-com
```
```
NAME                                                            TYPE      TTL     DATA
example.com.                                                    NS        21600   ns-cloud-e1.googledomains.com., ns-cloud-e2.googledomains.com.
example.com.                                                    OA        21600   ns-cloud-e1.googledomains.com. cloud-dns-hostmaster.google.com. 1 21600 3600 1209600 300
nginx.mynamespace.myfederation.svc.example.com.                 A         180     104.197.246.190, 130.211.57.243, 104.196.14.231, 104.199.136.89,...
nginx.mynamespace.myfederation.svc.us-central1-a.example.com.   A         180     104.197.247.191
nginx.mynamespace.myfederation.svc.us-central1-b.example.com.   A         180     104.197.244.180
nginx.mynamespace.myfederation.svc.us-central1-c.example.com.   A         180     104.197.245.170
nginx.mynamespace.myfederation.svc.us-central1-f.example.com.   CNAME     180     nginx.mynamespace.myfederation.svc.us-central1.example.com.
nginx.mynamespace.myfederation.svc.us-central1.example.com.     A         180     104.197.247.191, 104.197.244.180, 104.197.245.170
nginx.mynamespace.myfederation.svc.asia-east1-a.example.com.    A         180     130.211.57.243
nginx.mynamespace.myfederation.svc.asia-east1-b.example.com.    CNAME     180     nginx.mynamespace.myfederation.svc.asia-east1.example.com.
nginx.mynamespace.myfederation.svc.asia-east1-c.example.com.    A         180     130.211.56.221
nginx.mynamespace.myfederation.svc.asia-east1.example.com.      A         180     130.211.57.243, 130.211.56.221
nginx.mynamespace.myfederation.svc.europe-west1.example.com.    CNAME     180     nginx.mynamespace.myfederation.svc.example.com.
nginx.mynamespace.myfederation.svc.europe-west1-d.example.com.  CNAME     180     nginx.mynamespace.myfederation.svc.europe-west1.example.com.
... etc.
```

<!-- {{< note >}}
If your Federation is configured to use AWS Route53, you can use one of the equivalent AWS tools, for example:

``` shell
aws route53 list-hosted-zones
```
and

``` shell
aws route53 list-resource-record-sets --hosted-zone-id Z3ECL0L9QLOVBX
```
{{< /note >}} -->
{{< note >}}
如果您的联邦配置为使用 AWS Route53，则可以使用类似的 AWS 工具，例如:

``` shell
aws route53 list-hosted-zones
```
和

``` shell
aws route53 list-resource-record-sets --hosted-zone-id Z3ECL0L9QLOVBX
```
{{< /note >}}

<!-- Whatever DNS provider you use, any DNS query tool (for example 'dig'
or 'nslookup') will of course also allow you to see the records
created by the Federation for you. Note that you should either point
these tools directly at your DNS provider (such as `dig
@ns-cloud-e1.googledomains.com...`) or expect delays in the order of
your configured TTL (180 seconds, by default) before seeing updates,
due to caching by intermediate DNS servers. -->
无论使用哪种 DNS 提供商，任何 DNS 查询工具(例如 'dig' 或者 'nslookup')都将允许您查看联邦会为您创建的记录。请注意，您应该将这些工具直接指向您的 DNS 提供商(例如 `dig @ ns-cloud-e1.googledomains.com ...`),或者由于中间 DNS 服务器进行了缓存，因此在看到更新之前，预计延迟会按照配置的 TTL 顺序(默认为 180 秒)进行。

<!-- ### Some notes about the above example -->
### 有关上述示例的一些注意事项

<!-- 1. Notice that there is a normal ('A') record for each service shard that has at least one healthy backend endpoint. For example, in us-central1-a, 104.197.247.191 is the external IP address of the service shard in that zone, and in asia-east1-a the address is 130.211.56.221.
2. Similarly, there are regional 'A' records which include all healthy shards in that region. For example, 'us-central1'.  These regional records are useful for clients which do not have a particular zone preference, and as a building block for the automated locality and failover mechanism described below.
3. For zones where there are currently no healthy backend endpoints, a CNAME ('Canonical Name') record is used to alias (automatically redirect) those queries to the next closest healthy zone.  In the example, the service shard in us-central1-f currently has no healthy backend endpoints (that is Pods), so a CNAME record has been created to automatically redirect queries to other shards in that region (us-central1 in this case).
4. Similarly, if no healthy shards exist in the enclosing region, the search progresses further afield. In the europe-west1-d availability zone, there are no healthy backends, so queries are redirected to the broader europe-west1 region (which also has no healthy backends), and onward to the global set of healthy addresses (' nginx.mynamespace.myfederation.svc.example.com.'). -->
1. 请注意，每个具有至少一个正常后端端点的服务分片都有一条正常('A')记录。例如，在 us-central1-a 中，104.197.247.191 是该区域中服务分片的外部 IP 地址，在 asia-east1-a 中，该地址是 130.211.56.221。
2. 同样，也有区域 'A' 记录，其中包括该区域中所有健康的分片。例如，'us-central1'。这些区域记录对于没有特定区域首选项的客户很有用，并且作为下文所述的自动位置和故障转移机制的基础。
3. 对于当前没有健康后端终结点的区域，将使用 CNAME ('Canonical Name') 记录将这些查询别名(自动重定向)到下一个最接近的健康区域。在此示例中，us-central1-f 中的服务分片当前没有健康的后端端点(即Pods)，因此已创建 CNAME 记录来自动将查询重定向到该区域中的其他分片(在本例中为 us-central1)。
4. 类似地，如果封闭区域中不存在健康分片，则搜索将进一步进行。在 europe-west1-d 可用性区域中,没有健康的后端,因此查询将重定向到更广阔的 Europe-west1 区域(也没有健康的后端),然后再重定向到全局的健康地址集('nginx.mynamespace.myfederation.svc.example.com.')。

<!-- The above set of DNS records is automatically kept in sync with the
current state of health of all service shards globally by the
Federated Service system. DNS resolver libraries (which are invoked by
all clients) automatically traverse the hierarchy of 'CNAME' and 'A'
records to return the correct set of healthy IP addresses. Clients can
then select any one of the returned addresses to initiate a network
connection (and fail over automatically to one of the other equivalent
addresses if required). -->
上面的 DNS 记录集由联邦服务系统自动与全球所有服务分片的当前健康状况保持同步。DNS 解析库(由所有客户端调用)自动遍历 'CNAME' 与 'A' 记录的层次结构，以返回正确健康的 IP 地址集。然后，客户端可以选择任何返回的地址来启动网络连接(并根据需要自动故障转移到其他等效地址之一)。

<!-- ## Discovering a federated service -->
## 发现联合服务

<!-- ### From pods inside your federated clusters -->
### 从联合集群内的 Pods 来发现

<!-- By default, Kubernetes clusters come pre-configured with a
cluster-local DNS server ('KubeDNS'), as well as an intelligently
constructed DNS search path which together ensure that DNS queries
like "myservice", "myservice.mynamespace",
"bobsservice.othernamespace" etc issued by your software running
inside Pods are automatically expanded and resolved correctly to the
appropriate service IP of services running in the local cluster. -->
默认情况下，Kubernetes 集群预先配置了本地集群 DNS 服务器('KubeDNS')以及智能构建的 DNS 搜索路径，这些路径共同确保由 Pods 内部运行软件发出的 DNS 查询如 "myservice", "myservice.mynamespace","bobsservice.othernamespace" 等，会自动扩展并正确解析为本地集群运行服务的相应服务 IP。

<!-- With the introduction of Federated Services and Cross-Cluster Service
Discovery, this concept is extended to cover Kubernetes services
running in any other cluster across your Cluster Federation, globally.
To take advantage of this extended range, you use a slightly different
DNS name of the form ```"<servicename>.<namespace>.<federationname>"```
to resolve Federated Services. For example, you might use
`myservice.mynamespace.myfederation`. Using a different DNS name also
avoids having your existing applications accidentally traversing
cross-zone or cross-region networks and you incurring perhaps unwanted
network charges or latency, without you explicitly opting in to this
behavior. -->
随着联合服务和跨集群服务发现的引入，该概念已扩展到涵盖在全球集群联盟中任何其他集群中运行的 Kubernetes 服务。要利用此扩展范围，您可以使用形式稍有不同的 DNS 名称，形式为 ```"<servicename>.<namespace>.<federationname>"``` 来解析联合服务。例如，您可以使用 `myservice.mynamespace.myfederation`。使用不同的 DNS 名称还可以避免现有应用程序意外穿越跨区域或跨区域网络，并且可能招致不必要的网络费用或延迟，而无需您明确选择采取这种行为。

<!-- So, using our NGINX example service above, and the Federated Service
DNS name form just described, let's consider an example: A Pod in a
cluster in the `us-central1-f` availability zone needs to contact our
NGINX service. Rather than use the service's traditional cluster-local
DNS name (`"nginx.mynamespace"`, which is automatically expanded
to `"nginx.mynamespace.svc.cluster.local"`) it can now use the
service's Federated DNS name, which is
`"nginx.mynamespace.myfederation"`. This will be automatically
expanded and resolved to the closest healthy shard of my NGINX
service, wherever in the world that may be. If a healthy shard exists
in the local cluster, that service's cluster-local (typically
10.x.y.z) IP address will be returned (by the cluster-local KubeDNS).
This is almost exactly equivalent to non-federated service resolution
(almost because KubeDNS actually returns both a CNAME and an A record
for local federated services, but applications will be oblivious
to this minor technical difference). -->
因此，使用上面的 NGINX 示例服务和刚才描述的联合服务 DNS 名称表单，让我们考虑一个示例:`us-central1-f` 可用性区域集群中的 Pod 需要联系我们的 NGINX 服务。现在，可以使用服务的联合 DNS 名称，而不是使用服务的传统集群本地 DNS 名称(`"nginx.mynamespace"` 会自动扩展为 `"nginx.mynamespace.svc.cluster.local"`)。无论位于世界何处，它都会自动扩展并解析为我的 NGINX 服务中最接近的健康分片。如果本地集群中存在健康的分片，则将返回该服务的集群本地(通常为10.x.y.z)的 IP 地址(由集群本地的 KubeDNS)。这几乎完全等同于非联合服务解析(几乎是因为 KubeDNS 实际上为本地联合服务返回了 CNAME 和 A 记录，但是应用程序将忽略这种微小的技术差异)。

<!-- But if the service does not exist in the local cluster (or it exists
but has no healthy backend pods), the DNS query is automatically
expanded to ```"nginx.mynamespace.myfederation.svc.us-central1-f.example.com"```
(that is, logically "find the external IP of one of the shards closest to
my availability zone"). This expansion is performed automatically by
KubeDNS, which returns the associated CNAME record. This results in
automatic traversal of the hierarchy of DNS records in the above
example, and ends up at one of the external IPs of the Federated
Service in the local us-central1 region (that is 104.197.247.191,
104.197.244.180 or 104.197.245.170). -->
但是，如果服务在本地集群中不存在(或者存在但没有正常的后端 Pod),则 DNS 查询会自动扩展为 ```"nginx.mynamespace.myfederation.svc.us-central1-f.example.com"```(也就是说，从逻辑上 "找到最接近我可用区的一个分片的外部 IP")。此扩展由 KubeDNS 自动执行，它返回关联的 CNAME 记录。这将导致在上面的示例中自动遍历 DNS 记录的层次结构，并最终到达本地 us-central1 区域中联合服务的外部 IP 之一(即 104.197.247.191, 104.197.244.180 或 104.197.245.170 )。

<!-- It is of course possible to explicitly target service shards in
availability zones and regions other than the ones local to a Pod by
specifying the appropriate DNS names explicitly, and not relying on
automatic DNS expansion. For example,
"nginx.mynamespace.myfederation.svc.europe-west1.example.com" will
resolve to all of the currently healthy service shards in Europe, even
if the Pod issuing the lookup is located in the U.S., and irrespective
of whether or not there are healthy shards of the service in the U.S.
This is useful for remote monitoring and other similar applications. -->
当然，可以通过明确地指定合适的 DNS 名称而不依赖于自动 DNS 扩展，在 Pod 本地的可用区域和可用区域之外的区域中明确地定位服务分片。例如，即使发出查询的 Pod 位于美国，"nginx.mynamespace.myfederation.svc.europe-west1.example.com" 也将解析欧洲目前所有健康的服务分片,并且无论美国是否有健康的服务分片。这对于远程监视和其他类似应用程序很有用。

<!-- ### From other clients outside your federated clusters -->
### 来自联合集群之外的其他客户端

<!-- Much of the above discussion applies equally to external clients,
except that the automatic DNS expansion described is no longer
possible.  So external clients need to specify one of the fully
qualified DNS names of the Federated Service, be that a zonal,
regional or global name. For convenience reasons, it is often a good
idea to manually configure additional static CNAME records in your
service, for example: -->
上面大部分讨论都同样适用于外部客户端，除了不再描述所描述的自动 DNS 扩展。因此，外部客户端需要指定联合服务的标准 DNS 名称，可以是地带名称，区域名称或者全局名称。为了方便起见，通常最好在服务中手动配置其他静态 CNAME 记录，例如:

``` shell
eu.nginx.acme.com        CNAME nginx.mynamespace.myfederation.svc.europe-west1.example.com.
us.nginx.acme.com        CNAME nginx.mynamespace.myfederation.svc.us-central1.example.com.
nginx.acme.com           CNAME nginx.mynamespace.myfederation.svc.example.com.
```
<!-- That way your clients can always use the short form on the left, and
always be automatically routed to the closest healthy shard on their
home continent.  All of the required failover is handled for you
automatically by Kubernetes Cluster Federation.  Future releases will
improve upon this even further. -->
这样，您的客户就可以始终使用左侧的缩写形式，并始终被自动路由到其本国大陆上最接近的健康分片。Kubernetes 联邦集群自动为您处理所有必需的故障转移。将来的发行版将对此进行进一步改进。

<!-- ## Handling failures of backend pods and whole clusters -->
## 处理后端 Pod 和整个集群的故障

<!-- Standard Kubernetes service cluster-IP's already ensure that
non-responsive individual Pod endpoints are automatically taken out of
service with low latency (a few seconds). In addition, as alluded
above, the Kubernetes Cluster Federation system automatically monitors
the health of clusters and the endpoints behind all of the shards of
your Federated Service, taking shards in and out of service as
required (for example, when all of the endpoints behind a service, or perhaps
the entire cluster or availability zone go down, or conversely recover
from an outage). Due to the latency inherent in DNS caching (the cache
timeout, or TTL for Federated Service DNS records is configured to 3
minutes, by default, but can be adjusted), it may take up to that long
for all clients to completely fail over to an alternative cluster in
the case of catastrophic failure. However, given the number of
discrete IP addresses which can be returned for each regional service
endpoint (such as us-central1 above, which has three alternatives)
many clients will fail over automatically to one of the alternative
IP's in less time than that given appropriate configuration. -->
标准的 Kubernetes 服务集群 IP 已确保无响应的单个 Pod 端点以低延迟(几秒钟)自动退出服务。此外，如上所述，Kubernetes 联邦集群系统会自动监视集群的状态以及联合服务的所有分片后面的端点，并根据需要使分片进入和退出服务(例如，当服务后面的所有端点或者整个集群或可用性区域出现故障时，或者相反地从中断中恢复时)。由于 DNS 缓存固有的延迟(默认情况下,缓存超时或联合服务 DNS 记录的 TTL 配置为3分钟，可以调整),在灾难性故障的情况下，所有客户端可能要花费很长时间才能完全故障转移到备用集群。但是，鉴于每个区域服务端点可以返回的离散 IP 地址数量(例如上面的 us-central1，它有三个替代方案),与给定的合适配置相比，许多客户端将在更少的时间内自动故障转移到其他 IP。

{{% /capture %}}

{{% capture discussion %}}

<!-- ## Troubleshooting -->
## 故障排除

<!-- ### I cannot connect to my cluster federation API -->
### 我无法连接到联合集群 API
<!-- Check that your -->
检查您的

<!-- 1. Client (typically kubectl) is correctly configured (including API endpoints and login credentials).
2. Cluster Federation API server is running and network-reachable. -->
1. 客户端(通常是 kubectl)已正确配置(包括 API 端点和登录凭据)。
2. 联合集群 API 服务器正在运行并且可以访问网络。

<!-- See the [federation admin guide](/docs/admin/federation/) to learn
how to bring up a cluster federation correctly (or have your cluster administrator do this for you), and how to correctly configure your client. -->
请参阅 [联合集群管理员指南](/docs/admin/federation/)了解如何正确启动联邦集群(或让您的集群管理员为您执行此操作),以及如何正确配置客户端。

<!-- ### I can create a federated service successfully against the cluster federation API, but no matching services are created in my underlying clusters -->
### 我可以针对联合集群 API 成功创建联合服务,但是在我的基础集群中没有创建匹配的服务。
<!-- Check that: -->
检查:

<!-- 1. Your clusters are correctly registered in the Cluster Federation API (`kubectl describe clusters`).
2. Your clusters are all 'Active'. This means that the cluster Federation system was able to connect and authenticate against the clusters' endpoints. If not, consult the logs of the federation-controller-manager pod to ascertain what the failure might be. 
      ```
      kubectl --namespace=federation logs $(kubectl get pods --namespace=federation -l module=federation-controller-manager -o name)
      ```
3. That the login credentials provided to the Cluster Federation API for the clusters have the correct authorization and quota to create services in the relevant namespace in the clusters.  Again you should see associated error messages providing more detail in the above log file if this is not the case.
4. Whether any other error is preventing the service creation operation from succeeding (look for `service-controller` errors in the output of `kubectl logs federation-controller-manager --namespace federation`). -->
1. 您的集群已在联合集群 API 中正确注册(`kubectl describe clusters`)。
2. 您的集群都是 "活跃的"。这意味着集群联合身份验证系统能够针对集群的端点进行连接和身份验证。如果不是，请查阅federation-controller-manager pod 的日志，以确定可能是什么故障。
      ```
      kubectl --namespace=federation logs $(kubectl get pods --namespace=federation -l module=federation-controller-manager -o name)
      ```
3. 集群提供给联合集群 API 的登录凭据具有正确的授权和配额，可以在集群的相关命名空间中创建服务。如果不是这种情况，您将再次在上述日志文件中看到相关的错误消息，以提供更多详细信息。
4. 是否有其他错误阻止服务创建操作成功(请在 `kubectl logs federation-controller-manager --namespace federation` 的输出中查找 `service-controller` 错误)。

<!-- ### I can create a federated service successfully, but no matching DNS records are created in my DNS provider.
Check that: -->
### 我可以成功创建联合服务，但是在我的 DNS 提供程序中没有创建匹配的 DNS 记录。
检查:

<!-- 1. Your federation name, DNS provider, DNS domain name are configured correctly.  Consult the [federation admin guide](/docs/admin/federation/) or  [tutorial](https://github.com/kelseyhightower/kubernetes-cluster-federation) to learn
how to configure your Cluster Federation system's DNS provider (or have your cluster administrator do this for you).
2. Confirm that the Cluster Federation's service-controller is successfully connecting to and authenticating against your selected DNS provider (look for `service-controller` errors or successes in the output of `kubectl logs federation-controller-manager --namespace federation`).
3. Confirm that the Cluster Federation's service-controller is successfully creating DNS records in your DNS provider (or outputting errors in its logs explaining in more detail what's failing). -->
1. 您的联邦集群名称，DNS 提供程序，DNS 域名已正确配置。请参阅 [联邦集群管理指南](/docs/admin/federation/)或者 [教程](https://github.com/kelseyhightower/kubernetes-cluster-federation)了解如何配置联合集群系统的 DNS 提供程序(或让您的集群管理员为您执行此操作)。
2. 确认联合集群的服务控制器已成功连接到所选的 DNS 提供程序并对其进行身份验证(在 `kubectl logs federation-controller-manager --namespace federation` 的输出中查找 `service-controller` 错误或者成功)。
3. 确认联合集群的服务控制器已在您的 DNS 提供程序中成功创建了 DNS 记录(或在其日志中输出错误，以更详细地解释失败原因)。

<!-- ### Matching DNS records are created in my DNS provider, but clients are unable to resolve against those names
Check that: -->
### 在我的 DNS 提供程序中创建了匹配的 DNS 记录，但是客户端无法根据这些名称进行解析
检查:

<!-- 1. The DNS registrar that manages your federation DNS domain has been correctly configured to point to your configured DNS provider's nameservers.  See for example [Google Domains Documentation](https://support.google.com/domains/answer/3290309?hl=en&ref_topic=3251230) and [Google Cloud DNS Documentation](https://cloud.google.com/dns/update-name-servers), or equivalent guidance from your domain registrar and DNS provider. -->
1. 已正确配置用于管理联合 DNS 域名的 DNS 注册器，使其指向已配置的 DNS 提供程序的名称服务器。例如，请参见 [Google Domains 文档](https://support.google.com/domains/answer/3290309?hl=en&ref_topic=3251230)与 [Google Cloud DNS 文档](https://cloud.google.com/dns/update-name-servers),或者域名注册商和 DNS 提供商的等效指南。

<!-- ### This troubleshooting guide did not help me solve my problem -->
### 此疑难解答指南没有帮助我解决问题

<!-- 1. Please use one of our [support channels](/docs/tasks/debug-application-cluster/troubleshooting/) to seek assistance. -->
1. 请使用我们的 [支持渠道](/docs/tasks/debug-application-cluster/troubleshooting/)寻求帮助。

<!-- ## For more information -->
## 更多信息

 <!-- * [Federation proposal](https://git.k8s.io/community/contributors/design-proposals/multicluster/federation.md) details use cases that motivated this work. -->
 * [联合提议](https://git.k8s.io/community/contributors/design-proposals/multicluster/federation.md) 详细介绍了促进这项工作的用例。
{{% /capture %}}
