---
approvers:
- mikedanese
- thockin
title: 容器环境变量
---

{% capture overview %}

本文介绍容器环境中对容器可用的资源。 

{% endcapture %}

{:toc}

{% capture body %}

## 容器环境

Kubernetes 容器环境为容器提供了几类重要的资源：

* 一个文件系统，其中包含一个[镜像](/docs/concepts/containers/images/)和一个或多个[卷](/docs/concepts/storage/volumes/)。
* 容器本身相关的信息。
* 集群中其他对象相关的信息。

### 容器信息

容器的 *hostname* 是容器所在的 Pod 名称。 可以通过 `hostname` 命令或调用 libc 中的
[`gethostname`](http://man7.org/linux/man-pages/man2/gethostname.2.html)
函数来获取。

Pod 名称和名字空间可以通过
[downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/) 以环境变量方式访问。

与 Docker 镜像中静态指定的环境变量一样，Pod 中用户定义的环境变量也可用于容器。

### 集群信息

容器创建时运行的所有服务的列表都会作为环境变量提供给容器。
这些环境变量与 Docker 链接语法相匹配。

对一个名为 *foo*，映射到名为 *bar* 的容器端口的服务，
会定义如下变量：

```shell
FOO_SERVICE_HOST=<服务所在的主机地址>
FOO_SERVICE_PORT=<服务所启用的端口>
```

服务具有专用 IP 地址，如果启用了 [DNS 插件](http://releases.k8s.io/{{page.githubbranch}}/cluster/addons/dns/)，还可以在容器中通过 DNS 进行访问。

{% endcapture %}

{% capture whatsnext %}

* 查看[容器生命周期挂钩（hooks）](/docs/concepts/containers/container-lifecycle-hooks/)了解更多。
* 获取[为容器生命周期事件附加处理程序](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/)的实践经验。

{% endcapture %}

{% include templates/concept.md %}
