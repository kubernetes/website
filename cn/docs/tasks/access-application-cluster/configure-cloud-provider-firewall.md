---
approvers:
- bprashanth
- davidopp
title: 配置云平台防火墙
---
<!--
---
approvers:
- bprashanth
- davidopp
title: Configure Your Cloud Provider's Firewalls
---
-->

<!-- Many cloud providers (e.g. Google Compute Engine) define firewalls that help prevent inadvertent
exposure to the internet.  When exposing a service to the external world, you may need to open up
one or more ports in these firewalls to serve traffic.  This document describes this process, as
well as any provider specific details that may be necessary. -->
许多云服务商（比如 Google Compute Engine）会定义防火墙以防止服务无意间暴露到公网上。
当暴露服务给外网时，你可能需要在防火墙上开启一个或者更多的端口来提供服务。
本文描述了这个过程，以及其他云服务商平台的具体信息。

<!-- ### Restrict Access For LoadBalancer Service -->
### 负载均衡（LoadBalancer）服务的访问限制

 <!-- When using a Service with `spec.type: LoadBalancer`, you can specify the IP ranges that are allowed to access the load balancer
 by using `spec.loadBalancerSourceRanges`. This field takes a list of IP CIDR ranges, which Kubernetes will use to configure firewall exceptions.
 This feature is currently supported on Google Compute Engine, Google Container Engine and AWS. This field will be ignored if the cloud provider does not support the feature. -->
 当以 `spec.type: LoadBalancer` 使用服务时，你可以使用 `spec.loadBalancerSourceRanges` 指定允许访问负载均衡的 IP 段。
 这个字段采用 CIDR 的 IP 段列表，Kubernetes 会使用这个列表配置防火墙的排除例外。支持这个功能的平台目前有 Google Compute Engine，Google Container Engine 和 AWS。
 如果云服务商不支持这个功能，这个字段会被忽略。

 <!-- Assuming 10.0.0.0/8 is the internal subnet. In the following example, a load balancer will be created that is only accessible to cluster internal ips.
 This will not allow clients from outside of your Kubernetes cluster to access the load balancer. -->
 假设 10.0.0.0/8 是内部的子网。在下面这个例子中，会创建一个只有集群内部 IP 可以访问的负载均衡器。
 集群外部的客户端是无法访问这个负载均衡器的。

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

 <!-- In the following example, a load balancer will be created that is only accessible to clients with IP addresses from 130.211.204.1 and 130.211.204.2. -->
 这个例子中，会创建一个只能被 IP 为 130.211.204.1 和 130.211.204.2 的客户端访问的负载均衡器。

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

<!-- ### Google Compute Engine -->
### 谷歌计算引擎（Google Compute Engine）

<!-- When using a Service with `spec.type: LoadBalancer`, the firewall will be
opened automatically.  When using `spec.type: NodePort`, however, the firewall
is *not* opened by default. -->
当以 `spec.type: LoadBalancer` 使用服务时，防火墙会被自动打开。
然而，当以 `spec.type: NodePort` 使用服务时，防火墙默认 *不会* 被打开。

<!-- Google Compute Engine firewalls are documented [elsewhere](https://cloud.google.com/compute/docs/networking#firewalls_1). -->
Google Compute Engine 的防火墙文档在 [其他地方](https://cloud.google.com/compute/docs/networking#firewalls_1)。

<!-- You can add a firewall with the `gcloud` command line tool: -->
你可以使用 `gcloud` 命令行工具添加一个防火墙：

```shell
$ gcloud compute firewall-rules create my-rule --allow=tcp:<port>
```

<!-- **Note**
There is one important security note when using firewalls on Google Compute Engine: -->
**注意**
使用 Google Compute Engine 平台的防火墙时有一个重要的关于安全的注意点：

<!-- as of Kubernetes v1.0.0, GCE firewalls are defined per-vm, rather than per-ip
address.  This means that when you open a firewall for a service's ports,
anything that serves on that port on that VM's host IP address may potentially
serve traffic.  Note that this is not a problem for other Kubernetes services,
as they listen on IP addresses that are different than the host node's external
IP address. -->
在 Kubernetes v1.0.0 版本，GCE 防火墙是按虚拟机（VM）设定的，而不是按 IP 设置的。
这就意味着当你在防火墙上打开一个服务端口时，任何在那台虚拟机 IP 上的同一端口的服务
都有被外部访问的潜在可能。注意，这对于其他 Kubernetes 服务来说不是问题，因为他们监
听的 IP 地址与主机的外部 IP 地址不同。

<!--Consider:

   * You create a Service with an external load balancer (IP Address 1.2.3.4)
     and port 80
   * You open the firewall for port 80 for all nodes in your cluster, so that
     the external Service actually can deliver packets to your Service
   * You start an nginx server, running on port 80 on the host virtual machine
     (IP Address 2.3.4.5).  This nginx is also exposed to the internet on
     the VM's external IP address. -->
考虑一下:

   * 你创建了一个服务，使用了外部负载均衡器 (IP 地址为 1.2.3.4) 和 80 端口。
   * 你在防火墙上为集群的所有节点都打开了 80 端口，可以让外部的服务可以向你的
     服务发送数据包。
   * 你又在虚拟机（IP 为2.3.4.5）上使用 80 端口启动了一台 nginx 服务器。
     这个 nginx 通过虚拟机的外部 IP 地址也被暴露到了公网上。

<!-- Consequently, please be careful when opening firewalls in Google Compute Engine
or Google Container Engine.  You may accidentally be exposing other services to
the wilds of the internet. -->
因此，在 Google Compute Engine 或者 Google Container Engine 上开启防火墙端口时请
小心。你可能无意间把其他服务也暴露给了公网。

<!-- This will be fixed in an upcoming release of Kubernetes. -->
这个问题会在 Kubernetes 后续版本中被修复。

<!-- ### Other cloud providers -->
### 其他云服务商

<!-- Coming soon. -->
即将更新

