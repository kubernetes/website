---
reviewers:
- bprashanth
- davidopp
title: 配置你的云平台防火墙
content_template: templates/task
weight: 90
---

{{% capture overview %}}

<!-- 
Many cloud providers (e.g. Google Compute Engine) define firewalls that help prevent inadvertent
exposure to the internet.  When exposing a service to the external world, you may need to open up
one or more ports in these firewalls to serve traffic.  This document describes this process, as
well as any provider specific details that may be necessary.
-->
许多云服务提供商（比如 谷歌计算引擎）定义防火墙以防止服务无意间暴露到互联网上。
当暴露服务给外网时，你可能需要在防火墙上开启一个或者更多的端口来支持服务。
本文描述了这个过程，以及其他云服务商的具体信息。
{{% /capture %}}


{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}
<!--
## Restrict Access For LoadBalancer Service
-->
## 负载均衡（LoadBalancer）服务的访问限制

<!--
 When using a Service with `spec.type: LoadBalancer`, you can specify the IP ranges that are allowed to access the load balancer
 by using `spec.loadBalancerSourceRanges`. This field takes a list of IP CIDR ranges, which Kubernetes will use to configure firewall exceptions.
 This feature is currently supported on Google Compute Engine, Google Kubernetes Engine, AWS Elastic Kubernetes Service, and Azure Kubernetes Service. This field will be ignored if the cloud provider does not support the feature.
-->
当以 `spec.type: LoadBalancer` 方式配置服务时，你可以使用 `spec.loadBalancerSourceRanges` 来指定允许访问负载均衡器的 ip 段。
这个字段采用 CIDR 的 IP 段， kubernetes 使用该段配置防火墙。目前只有 谷歌计算引擎，谷歌云原生引擎，亚马逊弹性原生云服务 和 微软云原生平台支持此功能。
如果云服务提供商不支持这个功能，这个字段将被忽略。

<!--
 Assuming 10.0.0.0/8 is the internal subnet. In the following example, a load balancer will be created that is only accessible to cluster internal IPs.
 This will not allow clients from outside of your Kubernetes cluster to access the load balancer.
-->
假设内部子网为假设10.0.0.0/8，在下面这个例子中，将创建一个仅能由群集内部IP访问的负载均衡器。此负载均衡器不允许来自 kubernetes 集群外部客户端的访问。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  ports:
  - port: 8765
    targetPort: 9376
  selector:
    app: example
  type: LoadBalancer
  loadBalancerSourceRanges:
  - 10.0.0.0/8
```
<!--
 In the following example, a load balancer will be created that is only accessible to clients with IP addresses from 130.211.204.1 and 130.211.204.2.
-->
在下面这个例子中，将创建一个只能被 IP 为 130.211.204.1 和 130.211.204.2 的客户端访问的负载据衡器。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp
spec:
  ports:
  - port: 8765
    targetPort: 9376
  selector:
    app: example
  type: LoadBalancer
  loadBalancerSourceRanges:
  - 130.211.204.1/32
  - 130.211.204.2/32
```
<!--
## Google Compute Engine
-->
## 谷歌计算引擎 （Google Compute Engine）

<!--
When using a Service with `spec.type: LoadBalancer`, the firewall will be
opened automatically.  When using `spec.type: NodePort`, however, the firewall
is *not* opened by default.
-->
当以 `spec.type: LoadBalancer` 方式配置服务时，该服务的防火墙将自动打开。
当以 `spec.type: NodePort` 方式配置服务时，该服务的防火墙在默认情况下不会打开。

<!--
Google Compute Engine firewalls are documented [elsewhere](https://cloud.google.com/compute/docs/networking#firewalls_1).
-->
谷歌计算引擎的防火墙会进行记录 [他处] (https://cloud.google.com/compute/docs/networking#firewalls_1)。

<!--
You can add a firewall with the `gcloud` command line tool:
-->
你也可以使用 gcloud 命令行工具自行添加防火墙：

```shell
gcloud compute firewall-rules create my-rule --allow=tcp:<port>
```

{{< note >}}
<!--
GCE firewalls are defined per-vm, rather than per-ip address. This means that
when you open a firewall for a service's ports, anything that serves on that
port on that VM's host IP address may potentially serve traffic. Note that this
is not a problem for other Kubernetes services, as they listen on IP addresses
that are different than the host node's external IP address.
-->
GCE 防火墙是按照虚拟机来定义的，而不是通过ip地址来定义的。
这就意味着当你在防火墙上打开一个服务端口时，任何在那台虚拟机 IP 上的同一端口的服务
都有被外部访问的潜在可能。需要注意的是，对于其他的 kubernetes 服务而言，这不是问题。
因为他们监听的ip 地址与主机节点外部的 ip 地址并不相同。

<!--
Consider:
-->
试想一下：

<!--
   * You create a Service with an external load balancer (IP Address 1.2.3.4)
     and port 80
-->
   * 你建立一个（ ip 地址为1.2.3.4）端口为80的外部负载均衡器

<!--
   * You open the firewall for port 80 for all nodes in your cluster, so that
     the external Service actually can deliver packets to your Service
-->
   * 因为在防火墙上为集群的所有节点都打开了 80 端口，所以外部的服务可以向你的
     服务发送数据包。
   
<!--  
   * You start an nginx server, running on port 80 on the host virtual machine
     (IP Address 2.3.4.5).  This nginx is also exposed to the internet on
     the VM's external IP address.
-->
   * 最后你又虚拟机上的80端口启动 nginx 服务器（ip地址2.3.4.5）。
     这个 nginx 在虚拟机的外部 IP 地址上也被暴露到了互联网上。
   
<!--
Consequently, please be careful when opening firewalls in Google Compute Engine
or Google Kubernetes Engine.  You may accidentally be exposing other services to
the wilds of the internet.
-->
因此请务必小心，在谷歌计算引擎或者谷歌云原生引擎中打开防火墙时，可能无意间把其他服务也暴露给了互联网。

{{< /note >}}

{{% /capture %}}
