---
layout: blog
title: "Kubernetes 1.31：kubectl debug 中的自定义模板化配置特性已进入 Beta 阶段"
date: 2024-08-22
slug: kubernetes-1-31-custom-profiling-kubectl-debug
author: >
  Arda Güçlü (Red Hat)
translator: >
  Xin Li (DaoCloud)
---
<!--
layout: blog
title: "Kubernetes 1.31: Custom Profiling in Kubectl Debug Graduates to Beta"
date: 2024-08-22
slug: kubernetes-1-31-custom-profiling-kubectl-debug
author: >
  Arda Güçlü (Red Hat)
-->

<!--
There are many ways of troubleshooting the pods and nodes in the cluster. However, `kubectl debug` is one of the easiest, highly used and most prominent ones. It
provides a set of static profiles and each profile serves for a different kind of role. For instance, from the network administrator's point of view, 
debugging the node should be as easy as this:
-->
有很多方法可以对集群中的 Pod 和节点进行故障排查，而 `kubectl debug` 是最简单、使用最广泛、最突出的方法之一。
它提供了一组静态配置，每个配置适用于不同类型的角色。
例如，从网络管理员的视角来看，调试节点应该像这样简单：

```shell
$ kubectl debug node/mynode -it --image=busybox --profile=netadmin
```

<!--
On the other hand, static profiles also bring about inherent rigidity, which has some implications for some pods contrary to their ease of use.
Because there are various kinds of pods (or nodes) that all have their specific
necessities, and unfortunately, some can't be debugged by only using the static profiles. 

Take an instance of a simple pod consisting of a container whose healthiness relies on an environment variable:
-->
另一方面，静态配置也存在固有的刚性，对某些 Pod 所产生的影响与其易用性是相悖的。
因为各种类型的 Pod（或节点）都有其特定的需求，不幸的是，有些问题仅通过静态配置是无法调试的。

以一个简单的 Pod 为例，此 Pod 由一个容器组成，其健康状况依赖于环境变量：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  containers:
  - name: example-container
    image: customapp:latest
    env:
    - name: REQUIRED_ENV_VAR
      value: "value1"
```

<!--
Currently, copying the pod is the sole mechanism that supports debugging this pod in kubectl debug. Furthermore, what if user needs to modify the `REQUIRED_ENV_VAR` to something different
for advanced troubleshooting?. There is no mechanism to achieve this.
-->
目前，复制 Pod 是使用 `kubectl debug` 命令调试此 Pod 的唯一机制。
此外，如果用户需要将 `REQUIRED_ENV_VAR` 环境变量修改为其他不同值来进行高级故障排查，
当前并没有机制能够实现这一需求。

<!--
## Custom Profiling

Custom profiling is a new functionality available under `--custom` flag, introduced in kubectl debug to provide extensibility. It expects partial `Container` spec in either YAML or JSON format. 
In order to debug the example-container above by creating an ephemeral container, we simply have to define this YAML:
-->
## 自定义模板化配置

自定义模板化配置使用 `--custom` 标志提供的一项新特性，在 `kubectl debug` 中引入以提供可扩展性。
它需要以 YAML 或 JSON 格式的内容填充 `container` 规约，
为了通过创建临时容器来调试上面的示例容器，我们只需定义此 YAML：

```yaml
# partial_container.yaml
env:
  - name: REQUIRED_ENV_VAR
    value: value2
```

<!--
and execute:
-->
并且执行：

```shell
kubectl debug example-pod -it --image=customapp --custom=partial_container.yaml
```

<!--
Here is another example that modifies multiple fields at once (change port number, add resource limits, modify environment variable) in JSON:
-->
下面是另一个在 JSON 中一次修改多个字段（更改端口号、添加资源限制、修改环境变量）的示例：

```json
{
  "ports": [
    {
      "containerPort": 80
    }
  ],
  "resources": {
    "limits": {
      "cpu": "0.5",
      "memory": "512Mi"
    },
    "requests": {
      "cpu": "0.2",
      "memory": "256Mi"
    }
  },
  "env": [
    {
      "name": "REQUIRED_ENV_VAR",
      "value": "value2"
    }
  ]
}
```

<!--
## Constraints

Uncontrolled extensibility hurts the usability. So that, custom profiling is not allowed for certain fields such as command, image, lifecycle, volume devices and container name.
In the future, more fields can be added to the disallowed list if required.
-->
## 约束

不受控制的扩展性会损害可用性。因此，某些字段（例如命令、镜像、生命周期、卷设备和容器名称）不允许进行自定义模版化配置。
将来如果需要，可以将更多字段添加到禁止列表中。

<!--
## Limitations

The `kubectl debug` command has 3 aspects: Debugging with ephemeral containers, pod copying, and node debugging. The largest intersection set of these aspects is the container spec within a Pod
That's why, custom profiling only supports the modification of the fields that are defined with `containers`. This leads to a limitation that if user needs to modify the other fields in the Pod spec, it is not supported.
-->
## 限制

`kubectl debug` 命令有 3 个方面：使用临时容器进行调试、Pod 复制和节点调试。
这些方面最大的交集是 Pod 内的容器规约，因此自定义模版化配置仅支持修改使用 `containers` 下定义的字段。
这导致了一个限制，如果用户需要修改 Pod 规约中的其他字段，则不受支持。

<!--
## Acknowledgments

Special thanks to all the contributors who reviewed and commented on this feature, from the initial conception to its actual implementation (alphabetical order):
-->
## 致谢

特别感谢所有审查和评论此特性（从最初的概念到实际实施）的贡献者（按字母顺序排列）：

- [Eddie Zaneski](https://github.com/eddiezane)
- [Maciej Szulik](https://github.com/soltysh)
- [Lee Verberne](https://github.com/verb)
