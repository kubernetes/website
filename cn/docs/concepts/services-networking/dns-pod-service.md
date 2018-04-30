---
approvers:
- davidopp
- thockin
title: DNS Pod 与 Service
redirect_from:
- "/docs/admin/dns/"
- "/docs/admin/dns.html"
---



## 介绍

Kubernetes 从 1.3 版本起， DNS 是内置的服务，通过插件管理器 [集群插件](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/README.md) 自动被启动。

Kubernetes DNS 在集群中调度 DNS Pod 和 Service ，配置 kubelet 以通知个别容器使用 DNS Service 的 IP 解析 DNS 名字。




## 怎样获取 DNS 名字?

在集群中定义的每个 Service（包括 DNS 服务器自身）都会被指派一个 DNS 名称。
默认，一个客户端 Pod 的 DNS 搜索列表将包含该 Pod 自己的 Namespace 和集群默认域。
通过如下示例可以很好地说明：

假设在 Kubernetes 集群的 Namespace `bar` 中，定义了一个Service `foo`。
运行在Namespace `bar` 中的一个 Pod，可以简单地通过 DNS 查询 `foo` 来找到该 Service。
运行在 Namespace `quux` 中的一个 Pod 可以通过 DNS 查询 `foo.bar` 找到该 Service。



## 支持的 DNS 模式

下面各段详细说明支持的记录类型和布局。
如果任何其它的布局、名称或查询，碰巧也能够使用，这就需要研究下它们的实现细节，以免后续修改它们又不能使用了。



### Service

#### A 记录

“正常” Service（除了 Headless Service）会以 `my-svc.my-namespace.svc.cluster.local` 这种名字的形式被指派一个 DNS A 记录。这会解析成该 Service 的 Cluster IP。

“Headless” Service（没有Cluster IP）也会以 `my-svc.my-namespace.svc.cluster.local` 这种名字的形式被指派一个 DNS A 记录。
不像正常 Service，它会解析成该 Service 选择的一组 Pod 的 IP。
希望客户端能够使用这一组 IP，否则就使用标准的 round-robin 策略从这一组 IP 中进行选择。



#### SRV 记录

命名端口需要创建 SRV 记录，这些端口是正常 Service或 [Headless
Services](/docs/concepts/services-networking/service/#headless-services) 的一部分。
对每个命名端口，SRV 记录具有 `_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster.local` 这种形式。
对普通 Service，这会被解析成端口号和 CNAME：`my-svc.my-namespace.svc.cluster.local`。
对 Headless Service，这会被解析成多个结果，Service 对应的每个 backend Pod 各一个，包含 `auto-generated-name.my-svc.my-namespace.svc.cluster.local` 这种形式 Pod 的端口号和 CNAME。

#### 后向兼容性

上一版本的 kube-dns 使用 `my-svc.my-namespace.cluster.local` 这种形式的名字（后续会增加 'svc' 这一级），以后这将不再被支持。



### Pod

#### A 记录

如果启用，Pod 会以 `pod-ip-address.my-namespace.pod.cluster.local` 这种形式被指派一个 DNS A 记录。

例如，`default` Namespace 具有 DNS 名字  `cluster.local`，在该 Namespace 中一个 IP 为 `1.2.3.4` 的 Pod 将具有一个条目：`1-2-3-4.default.pod.cluster.local`。



#### 基于 Pod hostname、subdomain 字段的 A 记录和主机名

当前，创建 Pod 后，它的主机名是该 Pod 的 `metadata.name` 值。

在 v1.2 版本中，用户可以配置 Pod annotation， 通过 `pod.beta.kubernetes.io/hostname` 来设置 Pod 的主机名。
如果为 Pod 配置了 annotation，会优先使用 Pod 的名称作为主机名。
例如，给定一个 Pod，它具有 annotation `pod.beta.kubernetes.io/hostname: my-pod-name`，该 Pod 的主机名被设置为 “my-pod-name”。



在 v1.3 版本中，PodSpec 具有 `hostname` 字段，可以用来指定 Pod 的主机名。这个字段的值优先于 annotation `pod.beta.kubernetes.io/hostname`。
在 v1.2 版本中引入了 beta 特性，用户可以为 Pod 指定 annotation，其中 `pod.beta.kubernetes.io/subdomain` 指定了 Pod 的子域名。
最终的域名将是 “<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>”。
举个例子，Pod 的主机名 annotation 设置为 “foo”，子域名 annotation 设置为 “bar”，在 Namespace “my-namespace” 中对应的 FQDN 为 “foo.bar.my-namespace.svc.cluster.local”。 



在 v1.3 版本中，PodSpec 具有 `subdomain` 字段，可以用来指定 Pod 的子域名。
这个字段的值优先于 annotation `pod.beta.kubernetes.io/subdomain` 的值。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: default-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
    - name: foo # Actually, no port is needed.
      port: 1234 
      targetPort: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: default-subdomain
  containers:
  - image: busybox
    command:
      - sleep
      - "3600"
    name: busybox
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox2
  labels:
    name: busybox
spec:
  hostname: busybox-2
  subdomain: default-subdomain
  containers:
  - image: busybox
    command:
      - sleep
      - "3600"
    name: busybox
```



如果 Headless Service 与 Pod 在同一个 Namespace 中，它们具有相同的子域名，集群的 KubeDNS 服务器也会为该 Pod 的完整合法主机名返回 A 记录。
在同一个 Namespace 中，给定一个主机名为 “busybox-1” 的 Pod，子域名设置为 “default-subdomain”，名称为 “default-subdomain” 的 Headless Service ，Pod 将看到自己的 FQDN 为 “busybox-1.default-subdomain.my-namespace.svc.cluster.local”。
DNS 会为那个名字提供一个 A 记录，指向该 Pod 的 IP。
“busybox1” 和 “busybox2” 这两个 Pod 分别具有它们自己的 A 记录。



在Kubernetes v1.2 版本中，`Endpoints` 对象也具有 annotation `endpoints.beta.kubernetes.io/hostnames-map`。
它的值是 map[string(IP)][endpoints.HostRecord] 的 JSON 格式，例如： '{"10.245.1.6":{HostName: "my-webserver"}}'。

如果是 Headless Service 的 `Endpoints`，会以  <hostname>.<service name>.<pod namespace>.svc.<cluster domain> 的格式创建 A 记录。
对示例中的 JSON 字符串，如果 `Endpoints` 是为名称为 “bar” 的 Headless Service 而创建的，其中一个 `Endpoints`  的 IP 是 “10.245.1.6”，则会创建一个名称为 “my-webserver.bar.my-namespace.svc.cluster.local” 的 A 记录，该 A 记录查询将返回 “10.245.1.6”。

`Endpoints` annotation 通常没必要由最终用户指定，但可以被内部的 Service Controller 用来提供上述功能。



在 v1.3 版本中，`Endpoints` 对象可以为任何 endpoint 指定 `hostname` 和 IP。
`hostname` 字段优先于通过 `endpoints.beta.kubernetes.io/hostnames-map` annotation 指定的主机名。

在 v1.3 版本中，下面的 annotation 是过时的：`pod.beta.kubernetes.io/hostname`、`pod.beta.kubernetes.io/subdomain`、`endpoints.beta.kubernetes.io/hostnames-map`。



## 如何测试它是否可以使用?

### 创建一个简单的 Pod 作为测试环境

创建 `busybox.yaml` 文件，内容如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
```



然后，用该文件创建一个 Pod：

```
kubectl create -f busybox.yaml
```



### 等待这个 Pod 变成运行状态

获取它的状态，执行如下命令：

```
kubectl get pods busybox
```



可以看到如下内容：

```
NAME      READY     STATUS    RESTARTS   AGE
busybox   1/1       Running   0          <some-time>
```



### 验证 DNS 已经生效

一旦 Pod 处于运行中状态，可以在测试环境中执行如下 nslookup 查询：

```
kubectl exec -ti busybox -- nslookup kubernetes.default
```



可以看到类似如下的内容：

```
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```



如果看到了，说明 DNS 已经可以正确工作了。

### 问题排查技巧

如果执行 nslookup 命令失败，检查如下内容：

#### 先检查本地 DNS 配置

查看配置文件 resolv.conf。（关于更多信息，参考下面的 “从 Node 继承 DNS” 和 “已知问题”。）

```
kubectl exec busybox cat /etc/resolv.conf
```



按照如下方法（注意搜索路径可能会因为云提供商不同而变化）验证搜索路径和 Name Server 的建立：

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```



#### 快速诊断

出现类似如下指示的错误，说明 kube-dns 插件或相关 Service 存在问题：

```
$ kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```



或者

```
$ kubectl exec -ti busybox -- nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```



#### 检查是否 DNS Pod 正在运行

使用 `kubectl get pods` 命令验证 DNS Pod 正在运行：

```
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
```



应该能够看到类似如下信息：

```
NAME                                                       READY     STATUS    RESTARTS   AGE
...
kube-dns-v19-ezo1y                                         3/3       Running   0           1h
...
```



如果看到没有 Pod 运行，或 Pod 失败/结束，DNS 插件不能默认部署到当前的环境，必须手动部署。

#### 检查 DNS Pod 中的错误信息

使用 `kubectl logs` 命令查看 DNS 后台进程的日志：

```
kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c kubedns
kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c dnsmasq
kubectl logs --namespace=kube-system $(kubectl get pods --namespace=kube-system -l k8s-app=kube-dns -o name) -c healthz
```



查看是否有任何可疑的日志。在行开头的字母 W、E、F 分别表示 警告、错误、失败。请搜索具有这些日志级别的日志行，通过  [Kubernetes 问题](https://github.com/kubernetes/kubernetes/issues) 报告意外的错误。

#### DNS 服务是否运行?

通过使用 `kubectl get service` 命令，验证 DNS 服务是否运行：

```
kubectl get svc --namespace=kube-system
```



应该能够看到：

```
NAME                    CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns                10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```



如果服务已经创建，或在这个例子中默认被创建，但是并没有看到，可以查看 [调试 Service 页面](/docs/tasks/debug-application-cluster/debug-service/) 获取更多信息。

```
kubectl get ep kube-dns --namespace=kube-system
```



应该能够看到类似如下信息：

```
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```



如果没有看到 Endpoint，查看 [调试 Service 文档](/docs/tasks/debug-application-cluster/debug-service/) 中的 Endpoint 段内容。

关于更多 Kubernetes DNS 的示例，参考 Kubernetes GitHub 仓库中 [集群 DNS 示例](https://git.k8s.io/kubernetes/examples/cluster-dns)。

## Kubernetes Federation（多 Zone 支持)

在1.3 发行版本中，为多站点 Kubernetes 安装引入了集群 Federation 支持。这需要对 Kubernetes 集群 DNS 服务器处理 DNS 查询的方式，做出一些微小（后向兼容）改变，从而便利了对联合 Service 的查询（跨多个 Kubernetes 集群）。参考 [集群 Federation 管理员指南](/docs/concepts/cluster-administration/federation/) 获取更多关于集群 Federation 和多站点支持的细节。



## 工作原理

运行的 Kubernetes DNS Pod 包含 3 个容器 —— kubedns、dnsmasq 和负责健康检查的 healthz。
kubedns 进程监视 Kubernetes master 对 Service 和 Endpoint 操作的变更，并维护一个内存查询结构去处理 DNS 请求。dnsmasq 容器增加了一个 DNS 缓存来改善性能。为执行对 dnsmasq 和 kubedns 的健康检查，healthz 容器提供了一个单独的健康检查 Endpoint。

DNS Pod 通过一个静态 IP 暴露为一个 Service。一旦 IP 被分配，kubelet 会通过 `--cluster-dns=10.0.0.10` 标志将配置的 DNS 传递给每一个容器。

DNS 名字也需要域名，本地域名是可配置的，在 kubelet 中使用 `--cluster-domain=<default local domain>` 标志。

Kubernetes 集群 DNS 服务器（根据 [SkyDNS](https://github.com/skynetservices/skydns) 库）支持正向查询（A 记录），Service 查询（SRV 记录）和反向 IP 地址查询（PTR 记录）。



## 从 Node 继承 DNS
当运行 Pod 时，kubelet 将集群 DNS 服务器和搜索路径追加到 Node 自己的 DNS 设置中。如果 Node 能够在大型环境中解析 DNS 名字，Pod 也应该没问题。参考下面 "已知问题” 中给出的更多说明。

如果不想这样，或者希望 Pod 有一个不同的 DNS 配置，可以使用 kubelet 的 `--resolv-conf` 标志。设置为 "" 表示 Pod 将不继承自 DNS。设置为一个合法的文件路径，表示 kubelet 将使用这个文件而不是 `/etc/resolv.conf` 。



## 已知问题

Kubernetes 安装但并不配置 Node 的 resolv.conf 文件，而是默认使用集群 DNS的，因为那个过程本质上就是和特定的发行版本相关的。最终应该会被实现。

Linux libc 在限制为3个 DNS `nameserver` 记录和3个 DNS `search` 记录是不可能卡住的（[查看 2005 年的一个 Bug](https://bugzilla.redhat.com/show_bug.cgi?id=168253)）。Kubernetes 需要使用1个  `nameserver`  记录和3个 `search` 记录。这意味着如果本地安装已经使用了3个 `nameserver` 或使用了3个以上 `search`，那些设置将会丢失。作为部分解决方法， Node 可以运行 `dnsmasq` ，它能提供更多 `nameserver` 条目，但不能运行更多 `search` 条目。可以使用 kubelet 的 `--resolv-conf` 标志。

如果使用 3.3 版本的 Alpine 或更早版本作为 base 镜像，由于 Alpine 的一个已知问题，DNS 可能不会正确工作。查看 [这里](https://github.com/kubernetes/kubernetes/issues/30215) 获取更多信息。



## 参考

- [DNS 集群插件文档](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/README.md)



## 下一步

- [集群中 DNS Service 自动伸缩](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
