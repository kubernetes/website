---
approvers:
- caesarxuchao
- lavalamp
- thockin
title: 应用连接到 Service
---

* TOC
{:toc}

<!--
## The Kubernetes model for connecting containers

Now that you have a continuously running, replicated application you can expose it on a network. Before discussing the Kubernetes approach to networking, it is worthwhile to contrast it with the "normal" way networking works with Docker.
-->

## Kubernetes 连接容器模型

既然有了一个持续运行、可复制的应用，我们就能够将它暴露到网络上。在讨论 Kubernetes 网络连接的方式之前，非常值得我们同 Docker中 “正常” 方式的网络进行一番对比。 

<!--
By default, Docker uses host-private networking, so containers can talk to other containers only if they are on the same machine. In order for Docker containers to communicate across nodes, they must be allocated ports on the machine's own IP address, which are then forwarded or proxied to the containers. This obviously means that containers must either coordinate which ports they use very carefully or else be allocated ports dynamically.

Coordinating ports across multiple developers is very difficult to do at scale and exposes users to cluster-level issues outside of their control. Kubernetes assumes that pods can communicate with other pods, regardless of which host they land on. We give every pod its own cluster-private-IP address so you do not need to explicitly create links between pods or mapping container ports to host ports. This means that containers within a Pod can all reach each other's ports on localhost, and all pods in a cluster can see each other without NAT. The rest of this document will elaborate on how you can run reliable services on such a networking model.

This guide uses a simple nginx server to demonstrate proof of concept. The same principles are embodied in a more complete [Jenkins CI application](http://blog.kubernetes.io/2015/07/strong-simple-ssl-for-kubernetes.html).
-->

默认情况下，Docker 使用私有主机网络，仅能与同在一台机器上的容器间通信。为了实现容器的跨节点通信，必须在机器自己的 IP 上为这些容器分配端口，为容器进行端口转发或者代理。

多个开发人员之间协调端口的使用很难做到规模化，那些难以控制的集群级别的问题，都会交由用户自己去处理。
Kubernetes 假设 Pod 可与其它 Pod 通信，不管它们在哪个主机上。
我们给 Pod 分配属于自己的集群私有 IP 地址，所以没必要在 Pod 或映射到的容器的端口和主机端口之间显式地创建连接。
这表明了在 Pod 内的容器都能够连接到本地的每个端口，集群中的所有 Pod 不需要通过 NAT 转换就能够互相看到。
文档的剩余部分将详述，如何在一个网络模型之上运行可靠的服务。

该指南使用一个简单的 Nginx server 来演示证明谈及的概念。同样的原则也体现在一个更加完整的 [Jenkins CI 应用](http://blog.kubernetes.io/2015/07/strong-simple-ssl-for-kubernetes.html) 中。

<!--
## Exposing pods to the cluster

We did this in a previous example, but let's do it once again and focus on the networking perspective. Create an nginx pod, and note that it has a container port specification:
-->

## 在集群中暴露 Pod

我们在之前的示例中已经做过，然而再让我重试一次，这次聚焦在网络连接的视角。
创建一个 Nginx Pod，指示它具有一个容器端口的说明：

{% include code.html language="yaml" file="run-my-nginx.yaml" ghlink="/docs/concepts/services-networking/run-my-nginx.yaml" %}

<!--
This makes it accessible from any node in your cluster. Check the nodes the pod is running on:
-->

这使得可以从集群中任何一个节点来访问它。检查节点，该 Pod 正在运行：

```shell
$ kubectl create -f ./run-my-nginx.yaml
$ kubectl get pods -l run=my-nginx -o wide
NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
```

<!--
Check your pods' IPs:
-->

检查 Pod 的 IP 地址：

```shell
$ kubectl get pods -l run=my-nginx -o yaml | grep podIP
    podIP: 10.244.3.4
    podIP: 10.244.2.5
```

<!--
You should be able to ssh into any node in your cluster and curl both IPs. Note that the containers are *not* using port 80 on the node, nor are there any special NAT rules to route traffic to the pod. This means you can run multiple nginx pods on the same node all using the same containerPort and access them from any other pod or node in your cluster using IP. Like Docker, ports can still be published to the host node's interfaces, but the need for this is radically diminished because of the networking model.

You can read more about [how we achieve this](/docs/concepts/cluster-administration/networking/#how-to-achieve-this) if you're curious.
-->

应该能够通过 ssh 登录到集群中的任何一个节点，使用 curl 也能调通所有 IP 地址。
需要注意的是，容器不会使用该节点上的 80 端口，也不会使用任何特定的 NAT 规则去路由流量到 Pod 上。
这意味着可以在同一个节点上运行多个 Pod，使用相同的容器端口，并且可以从集群中任何其他的 Pod 或节点上使用 IP 的方式访问到它们。
像 Docker 一样，端口能够被发布到主机节点的接口上，但是出于网络模型的原因应该从根本上减少这种用法。

如果对此好奇，可以获取更多关于 [如何实现网络模型](/docs/concepts/cluster-administration/networking/#how-to-achieve-this)  的内容。

<!--
## Creating a Service

So we have pods running nginx in a flat, cluster wide, address space. In theory, you could talk to these pods directly, but what happens when a node dies? The pods die with it, and the Deployment will create new ones, with different IPs. This is the problem a Service solves.

A Kubernetes Service is an abstraction which defines a logical set of Pods running somewhere in your cluster, that all provide the same functionality. When created, each Service is assigned a unique IP address (also called clusterIP). This address is tied to the lifespan of the Service, and will not change while the Service is alive. Pods can be configured to talk to the Service, and know that communication to the Service will be automatically load-balanced out to some pod that is a member of the Service.

You can create a Service for your 2 nginx replicas with `kubectl expose`:
-->

## 创建 Service

我们有 Pod 在一个扁平的、集群范围的地址空间中运行 Nginx 服务，可以直接连接到这些 Pod，但如果某个节点死掉了会发生什么呢？
Pod 会终止，Deployment 将创建新的 Pod，使用不同的 IP。这正是 Service 要解决的问题。

Kubernetes Service 从逻辑上定义了运行在集群中的一组 Pod，这些 Pod 提供了相同的功能。
当创建时，每个 Service 被分配一个唯一的 IP 地址（也称为 clusterIP）。
这个 IP 地址与一个 Service 的生命周期绑定在一起，当 Service 存在的时候它也不会改变。
可以配置 Pod 使它与 Service 进行通信，Pod 知道，与 Service 通信将被自动地负载均衡到该 Service 中的某些 Pod 上。

可以使用 `kubectl expose` 为 2个 Nginx 副本创建一个 Service：

```shell
$ kubectl expose deployment/my-nginx
service "my-nginx" exposed
```

<!--
This is equivalent to `kubectl create -f` the following yaml:
-->

这等价于使用 `kubectl create -f` 命令创建，对应如下的 yaml 文件：

{% include code.html language="yaml" file="nginx-svc.yaml" ghlink="/docs/concepts/services-networking/nginx-svc.yaml" %}

<!--
This specification will create a Service which targets TCP port 80 on any Pod with the `run: my-nginx` label, and expose it on an abstracted Service port (`targetPort`: is the port the container accepts traffic on, `port`: is the abstracted Service port, which can be any port other pods use to access the Service). View [service API object](/docs/api-reference/{{page.version}}/#service-v1-core) to see the list of supported fields in service definition.
Check your Service:
-->

上述规格将创建一个 Service，对应具有标签 `run: my-nginx` 的 Pod，目标 TCP 端口 80，并且在一个抽象的 Service 端口（`targetPort`：容器接收流量的端口；`port`：抽象的 Service 端口，可以使任何其它 Pod 访问该 Service 的端口）上暴露。
查看 [Service API 对象](/docs/api-reference/{{page.version}}/#service-v1-core) 了解 Service 定义支持的字段列表。

```shell
$ kubectl get svc my-nginx
NAME       CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   10.0.162.149   <none>        80/TCP    21s
```

<!--
As mentioned previously, a Service is backed by a group of pods. These pods are exposed through `endpoints`. The Service's selector will be evaluated continuously and the results will be POSTed to an Endpoints object also named `my-nginx`. When a pod dies, it is automatically removed from the endpoints, and new pods matching the Service's selector will automatically get added to the endpoints. Check the endpoints, and note that the IPs are the same as the pods created in the first step:
-->

正如前面所提到的，一个 Service 由一组 backend Pod 组成。这些 Pod 通过 `endpoints` 暴露出来。
Service Selector 将持续评估，结果被 POST 到一个名称为 `my-nginx` 的 Endpoint 对象。
当 Pod 终止后，它会自动从 Endpoint 中移除，新的能够匹配上 Service Selector 的 Pod 将自动地被添加到 Endpoint 中。
检查该 Endpoint，注意到 IP 地址与在第一步创建的 Pod 是相同的。

```shell
$ kubectl describe svc my-nginx
Name:                my-nginx
Namespace:           default
Labels:              run=my-nginx
Selector:            run=my-nginx
Type:                ClusterIP
IP:                  10.0.162.149
Port:                <unset> 80/TCP
Endpoints:           10.244.2.5:80,10.244.3.4:80
Session Affinity:    None
No events.

$ kubectl get ep my-nginx
NAME       ENDPOINTS                     AGE
my-nginx   10.244.2.5:80,10.244.3.4:80   1m
```

<!--
You should now be able to curl the nginx Service on `<CLUSTER-IP>:<PORT>` from any node in your cluster. Note that the Service IP is completely virtual, it never hits the wire, if you're curious about how this works you can read more about the [service proxy](/docs/user-guide/services/#virtual-ips-and-service-proxies).
-->

现在能够从集群中任意节点上，通过 curl 请求 Nginx Service  `<CLUSTER-IP>:<PORT>` 。
注意 Service IP 完全是虚拟的，它从来没有走过网络，如果对它如何工作的原理好奇，可以阅读更多关于 [服务代理](/docs/user-guide/services/#virtual-ips-and-service-proxies) 的内容。

<!--
## Accessing the Service

Kubernetes supports 2 primary modes of finding a Service - environment variables and DNS. The former works out of the box while the latter requires the [kube-dns cluster addon](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md).
-->

## 访问 Service

Kubernetes 支持两种主要的服务发现模式 —— 环境变量和 DNS。前者在单个节点上可用使用，然而后者需要 [kube-dns 集群插件](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md)。

<!--
### Environment Variables

When a Pod runs on a Node, the kubelet adds a set of environment variables for each active Service. This introduces an ordering problem. To see why, inspect the environment of your running nginx pods (your pod name will be different):
-->

### 环境变量

当 Pod 在 Node 上运行时，kubelet 会为每个活跃的 Service 添加一组环境变量。这会有一个顺序的问题。想了解为何，检查正在运行的 Nginx Pod 的环境变量（Pod 名称将不会相同）：

```shell
$ kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
```

<!--
Note there's no mention of your Service. This is because you created the replicas before the Service. Another disadvantage of doing this is that the scheduler might put both pods on the same machine, which will take your entire Service down if it dies. We can do this the right way by killing the 2 pods and waiting for the Deployment to recreate them. This time around the Service exists *before* the replicas. This will give you scheduler-level Service spreading of your pods (provided all your nodes have equal capacity), as well as the right environment variables:
-->

注意，还没有谈及到 Service。这是因为创建副本先于 Service。
这样做的另一个缺点是，调度器可能在同一个机器上放置所有 Pod，如果该机器宕机则所有的 Service 都会挂掉。
正确的做法是，我们杀掉 2 个 Pod，等待 Deployment 去创建它们。
这次 Service 会 *先于* 副本存在。这将实现调度器级别的 Service，能够使 Pod 分散创建（假定所有的 Node 都具有同样的容量），还有正确的环境变量：

```shell
$ kubectl scale deployment my-nginx --replicas=0; kubectl scale deployment my-nginx --replicas=2;

$ kubectl get pods -l run=my-nginx -o wide
NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
```

<!--
You may notice that the pods have different names, since they are killed and recreated.
-->

可能注意到，Pod 具有不同的名称，因为它们被杀掉后并被重新创建。

```shell
$ kubectl exec my-nginx-3800858182-e9ihh -- printenv | grep SERVICE
KUBERNETES_SERVICE_PORT=443
MY_NGINX_SERVICE_HOST=10.0.162.149
KUBERNETES_SERVICE_HOST=10.0.0.1
MY_NGINX_SERVICE_PORT=80
KUBERNETES_SERVICE_PORT_HTTPS=443
```

### DNS

<!--
Kubernetes offers a DNS cluster addon Service that uses skydns to automatically assign dns names to other Services. You can check if it's running on your cluster:
-->

Kubernetes 提供了一个 DNS 插件 Service，它使用 skydns 自动为其它 Service 指派 DNS 名字。
如果它在集群中处于运行状态，可以通过如下命令来检查：

```shell
$ kubectl get services kube-dns --namespace=kube-system
NAME       CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

<!--
If it isn't running, you can [enable it](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md#how-do-i-configure-it). The rest of this section will assume you have a Service with a long lived IP (my-nginx), and a dns server that has assigned a name to that IP (the kube-dns cluster addon), so you can talk to the Service from any pod in your cluster using standard methods (e.g. gethostbyname). Let's run another curl application to test this:
-->

如果没有在运行，可以 [启用它](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md#how-do-i-configure-it)。
本段剩余的内容，将假设已经有一个 Service，它具有一个长久存在的 IP（my-nginx），一个为该 IP 指派名称的 DNS 服务器（kube-dns 集群插件），所以可以通过标准做法，使在集群中的任何 Pod 都能与该 Service 通信（例如：gethostbyname）。
让我们运行另一个 curl 应用来进行测试：

```shell
$ kubectl run curl --image=radial/busyboxplus:curl -i --tty
Waiting for pod default/curl-131556218-9fnch to be running, status is Pending, pod ready: false
Hit enter for command prompt
```
<!--
Then, hit enter and run `nslookup my-nginx`:
-->

然后，按回车并执行命令 `nslookup my-nginx`：

```shell
[ root@curl-131556218-9fnch:/ ]$ nslookup my-nginx
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      my-nginx
Address 1: 10.0.162.149
```

<!--
## Securing the Service

Till now we have only accessed the nginx server from within the cluster. Before exposing the Service to the internet, you want to make sure the communication channel is secure. For this, you will need:
-->

## Service 安全

到现在为止，我们只在集群内部访问了 Nginx server。在将 Service 暴露到 Internet 之前，我们希望确保通信信道是安全的。对于这可能需要：

<!--
* Self signed certificates for https (unless you already have an identity certificate)
* An nginx server configured to use the certificates
* A [secret](/docs/user-guide/secrets) that makes the certificates accessible to pods

You can acquire all these from the [nginx https example](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/https-nginx/), in short:
-->

* https 自签名证书（除非已经有了一个识别身份的证书）
* 使用证书配置的 Nginx server
* 使证书可以访问 Pod 的[秘钥](/docs/user-guide/secrets)

可以从 [Nginx https 示例](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/https-nginx/) 获取所有上述内容，简明示例如下：

```shell
$ make keys secret KEY=/tmp/nginx.key CERT=/tmp/nginx.crt SECRET=/tmp/secret.json
$ kubectl create -f /tmp/secret.json
secret "nginxsecret" created
$ kubectl get secrets
NAME                  TYPE                                  DATA      AGE
default-token-il9rc   kubernetes.io/service-account-token   1         1d
nginxsecret           Opaque                                2         1m
```

<!--
Now modify your nginx replicas to start an https server using the certificate in the secret, and the Service, to expose both ports (80 and 443):
-->

现在修改 Nginx 副本，启动一个使用在秘钥中的证书的 https 服务器和 Servcie，都暴露端口（80 和 443）：

{% include code.html language="yaml" file="nginx-secure-app.yaml" ghlink="/docs/concepts/services-networking/nginx-secure-app.yaml" %}

<!--
Noteworthy points about the nginx-secure-app manifest:
-->

关于 nginx-secure-app manifest 值得注意的点如下：

<!--
- It contains both Deployment and Service specification in the same file.
- The [nginx server](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/https-nginx/default.conf) serves http traffic on port 80 and https traffic on 443, and nginx Service exposes both ports.
- Each container has access to the keys through a volume mounted at /etc/nginx/ssl. This is setup *before* the nginx server is started.
-->

- 它在相同的文件中包含了 Deployment 和 Service 的规格
- [Nginx server](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/https-nginx/default.conf) 处理 80 端口上的 http 流量，以及 443  端口上的 https 流量，Nginx Service 暴露了这两个端口。
- 每个容器访问挂载在 /etc/nginx/ssl 卷上的秘钥。这需要在 Nginx server 启动之前安装好。

```shell
$ kubectl delete deployments,svc my-nginx; kubectl create -f ./nginx-secure-app.yaml
```

<!--
At this point you can reach the nginx server from any node.
-->

这时可以从任何节点访问到 Nginx server。

```shell
$ kubectl get pods -o yaml | grep -i podip
    podIP: 10.244.3.5
node $ curl -k https://10.244.3.5
...
<h1>Welcome to nginx!</h1>
```

<!--
Note how we supplied the `-k` parameter to curl in the last step, this is because we don't know anything about the pods running nginx at certificate generation time,
so we have to tell curl to ignore the CName mismatch. By creating a Service we linked the CName used in the certificate with the actual DNS name used by pods during Service lookup.
Let's test this from a pod (the same secret is being reused for simplicity, the pod only needs nginx.crt to access the Service):
-->

注意最后一步我们是如何提供 `-k` 参数执行 curl命令的，这是因为在证书生成时，我们不知道任何关于运行 Nginx 的 Pod 的信息，所以不得不在执行 curl 命令时忽略 CName 不匹配的情况。
通过创建 Service，我们连接了在证书中的 CName 与在 Service 查询时被 Pod使用的实际 DNS 名字。
让我们从一个 Pod 来测试（为了简化使用同一个秘钥，Pod 仅需要使用 nginx.crt 去访问 Service）：

{% include code.html language="yaml" file="curlpod.yaml" ghlink="/docs/concepts/services-networking/curlpod.yaml" %}

```shell
$ kubectl create -f ./curlpod.yaml
$ kubectl get pods -l app=curlpod
NAME                               READY     STATUS    RESTARTS   AGE
curl-deployment-1515033274-1410r   1/1       Running   0          1m
$ kubectl exec curl-deployment-1515033274-1410r -- curl https://my-nginx --cacert /etc/nginx/ssl/nginx.crt
...
<title>Welcome to nginx!</title>
...
```
<!--
## Exposing the Service

For some parts of your applications you may want to expose a Service onto an external IP address. Kubernetes supports two ways of doing this: NodePorts and LoadBalancers. The Service created in the last section already used `NodePort`, so your nginx https replica is ready to serve traffic on the internet if your node has a public IP.
-->

## 暴露 Service

对我们应用的某些部分，可能希望将 Service 暴露在一个外部 IP 地址上。
Kubernetes 支持两种实现方式：NodePort 和 LoadBalancer。
在上一段创建的 Service 使用了 `NodePort`，因此 Nginx https 副本已经就绪，如果使用一个公网 IP，能够处理 Internet 上的流量。

```shell
$ kubectl get svc my-nginx -o yaml | grep nodePort -C 5
  uid: 07191fb3-f61a-11e5-8ae5-42010af00002
spec:
  clusterIP: 10.0.162.149
  ports:
  - name: http
    nodePort: 31704
    port: 8080
    protocol: TCP
    targetPort: 80
  - name: https
    nodePort: 32453
    port: 443
    protocol: TCP
    targetPort: 443
  selector:
    run: my-nginx

$ kubectl get nodes -o yaml | grep ExternalIP -C 1
    - address: 104.197.41.11
      type: ExternalIP
    allocatable:
--
    - address: 23.251.152.56
      type: ExternalIP
    allocatable:
...

$ curl https://<EXTERNAL-IP>:<NODE-PORT> -k
...
<h1>Welcome to nginx!</h1>
```

<!--
Let's now recreate the Service to use a cloud load balancer, just change the `Type` of `my-nginx` Service from `NodePort` to `LoadBalancer`:
-->

让我们重新创建一个 Service，使用一个云负载均衡器，只需要将 `my-nginx` Service 的 `Type` 由 `NodePort` 改成 `LoadBalancer`。

```shell
$ kubectl edit svc my-nginx
$ kubectl get svc my-nginx
NAME       CLUSTER-IP     EXTERNAL-IP        PORT(S)               AGE
my-nginx   10.0.162.149   162.222.184.144    80/TCP,81/TCP,82/TCP  21s

$ curl https://<EXTERNAL-IP> -k
...
<title>Welcome to nginx!</title>
```

<!--
The IP address in the `EXTERNAL-IP` column is the one that is available on the public internet.  The `CLUSTER-IP` is only available inside your
cluster/private cloud network.

Note that on AWS, type `LoadBalancer` creates an ELB, which uses a (long)
hostname, not an IP.  It's too long to fit in the standard `kubectl get svc`
output, in fact, so you'll need to do `kubectl describe service my-nginx` to
see it.  You'll see something like this:
-->

在 `EXTERNAL-IP` 列指定的 IP 地址是在公网上可用的。`CLUSTER-IP` 只在集群/私有云网络中可用。

注意，在 AWS 上类型 `LoadBalancer` 创建一个 ELB，它使用主机名（比较长），而不是 IP。
它太长以至于不能适配标准 `kubectl get svc` 的输出，事实上需要通过执行 `kubectl describe service my-nginx` 命令来查看它。
可以看到类似如下内容：

```shell
$ kubectl describe service my-nginx
...
LoadBalancer Ingress:   a320587ffd19711e5a37606cf4a74574-1142138393.us-east-1.elb.amazonaws.com
...
```

<!--
## Further reading

Kubernetes also supports Federated Services, which can span multiple
clusters and cloud providers, to provide increased availability,
better fault tolerance and greater scalability for your services. See
the [Federated Services User Guide](/docs/concepts/cluster-administration/federation-service-discovery/)
for further information.
-->

## 进一步阅读

Kubernetes 也支持联合 Service，能够跨多个集群和云提供商，提供逐步增长的可用性，更好的容错和服务的可伸缩性。
查看 [联合 Service 用户指南](/docs/concepts/cluster-administration/federation-service-discovery/) 获取更进一步信息。

<!--
## What's next?

[Learn about more Kubernetes features that will help you run containers reliably in production.](/docs/user-guide/production-pods)
-->

## 下一步

[了解更多关于 Kubernetes 的特性，有助于在生产环境中可靠地运行容器](/docs/user-guide/production-pods)

