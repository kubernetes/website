---
approvers:
- bprashanth
- davidopp
title: 配置你的云平台防火墙
---






许多云服务商（比如 Google Compute Engine）定义防火墙以防止服务无意间暴露到 internet 上。
当暴露服务给外网时，你可能需要在防火墙上开启一个或者更多的端口来支持服务。
本文描述了这个过程，以及其他云服务商的具体信息。


## 负载均衡（LoadBalancer）服务的访问限制

 
 
 
 当以 `spec.type: LoadBalancer` 使用服务时，你可以使用 `spec.loadBalancerSourceRanges` 指定允许访问负载均衡的 IP 段。
 这个字段采用 CIDR 的 IP 段，Kubernetes 会使用这个段配置防火墙。支持这个功能的平台目前有 Google Compute Engine，Google Kubernetes Engine 和 AWS。
 如果云服务商不支持这个功能，这个字段会被忽略。

 
 
 假设 10.0.0.0/8 是内部的子网。在下面这个例子中，会创建一个只有集群内部 ip 可以访问的负载均衡器。
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

 
 这个例子中，会创建一个只能被 IP 为 130.211.204.1 和 130.211.204.2 的客户端访问的负载据衡器。

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


### 谷歌计算引擎（Google Compute Engine）




当以 `spec.type: LoadBalancer` 使用服务时，防火墙会被自动打开。
然而，当以 `spec.type: NodePort` 使用服务时，防火墙默认 *不会* 被打开。


Google Compute Engine 的防火墙文档在[别处](https://cloud.google.com/compute/docs/networking#firewalls_1)。


你可以使用 `gcloud` 命令行工具添加一个防火墙：

```shell
$ gcloud compute firewall-rules create my-rule --allow=tcp:<port>
```



**注意**
使用 Google Compute Engine 平台的防火墙时有一个重要的关于安全的注意点：







在 Kubernetes v1.0.0 版本，GCE 防火墙是定义按虚拟机（VM）来的，而不是按 ip 来的。
这就意味着当你在防火墙上打开一个服务端口时，任何在那台虚拟机 IP 上的同一端口的服务
都有被外部访问的潜在可能。注意，这对于其他 Kubernetes 服务来说不是问题，因为他们监
听的 IP 地址与主机节点的外部 IP 地址不同。


考虑一下:

   * 你创建了一个服务，使用了外部服务均衡 (IP 地址为 1.2.3.4) 和 80 端口。
   * 你在防火墙上为集群的所有节点都打开了 80 端口，所以外部的服务可以向你的
     服务发送数据包。
   * 你又在虚拟机（IP 为2.3.4.5）上使用 80 端口启动了一台 nginx 服务器.
     这个 nginx 在虚拟机的外部 IP 地址上也被暴露到了 internet 上。




因此，在 Google Compute Engine 或者 Google Kubernetes Engine 上开启防火墙端口时请
小心。你可能无意间把其他服务也暴露给了 internet。


这个问题会在 Kubernetes 后续版本中被修复。


### 其他云服务商


即将更新

