---
layout: blog
title: "Kubernetes 1.31：kubectl debug 中的自定義模板化設定特性已進入 Beta 階段"
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
有很多方法可以對叢集中的 Pod 和節點進行故障排查，而 `kubectl debug` 是最簡單、使用最廣泛、最突出的方法之一。
它提供了一組靜態設定，每個設定適用於不同類型的角色。
例如，從網路管理員的視角來看，調試節點應該像這樣簡單：

```shell
$ kubectl debug node/mynode -it --image=busybox --profile=netadmin
```

<!--
On the other hand, static profiles also bring about inherent rigidity, which has some implications for some pods contrary to their ease of use.
Because there are various kinds of pods (or nodes) that all have their specific
necessities, and unfortunately, some can't be debugged by only using the static profiles. 

Take an instance of a simple pod consisting of a container whose healthiness relies on an environment variable:
-->
另一方面，靜態設定也存在固有的剛性，對某些 Pod 所產生的影響與其易用性是相悖的。
因爲各種類型的 Pod（或節點）都有其特定的需求，不幸的是，有些問題僅通過靜態設定是無法調試的。

以一個簡單的 Pod 爲例，此 Pod 由一個容器組成，其健康狀況依賴於環境變量：

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
目前，複製 Pod 是使用 `kubectl debug` 命令調試此 Pod 的唯一機制。
此外，如果使用者需要將 `REQUIRED_ENV_VAR` 環境變量修改爲其他不同值來進行高級故障排查，
當前並沒有機制能夠實現這一需求。

<!--
## Custom Profiling

Custom profiling is a new functionality available under `--custom` flag, introduced in kubectl debug to provide extensibility. It expects partial `Container` spec in either YAML or JSON format. 
In order to debug the example-container above by creating an ephemeral container, we simply have to define this YAML:
-->
## 自定義模板化設定

自定義模板化設定使用 `--custom` 標誌提供的一項新特性，在 `kubectl debug` 中引入以提供可擴展性。
它需要以 YAML 或 JSON 格式的內容填充 `container` 規約，
爲了通過創建臨時容器來調試上面的示例容器，我們只需定義此 YAML：

```yaml
# partial_container.yaml
env:
  - name: REQUIRED_ENV_VAR
    value: value2
```

<!--
and execute:
-->
並且執行：

```shell
kubectl debug example-pod -it --image=customapp --custom=partial_container.yaml
```

<!--
Here is another example that modifies multiple fields at once (change port number, add resource limits, modify environment variable) in JSON:
-->
下面是另一個在 JSON 中一次修改多個字段（更改端口號、添加資源限制、修改環境變量）的示例：

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
## 約束

不受控制的擴展性會損害可用性。因此，某些字段（例如命令、映像檔、生命週期、卷設備和容器名稱）不允許進行自定義模版化設定。
將來如果需要，可以將更多字段添加到禁止列表中。

<!--
## Limitations

The `kubectl debug` command has 3 aspects: Debugging with ephemeral containers, pod copying, and node debugging. The largest intersection set of these aspects is the container spec within a Pod
That's why, custom profiling only supports the modification of the fields that are defined with `containers`. This leads to a limitation that if user needs to modify the other fields in the Pod spec, it is not supported.
-->
## 限制

`kubectl debug` 命令有 3 個方面：使用臨時容器進行調試、Pod 複製和節點調試。
這些方面最大的交集是 Pod 內的容器規約，因此自定義模版化設定僅支持修改使用 `containers` 下定義的字段。
這導致了一個限制，如果使用者需要修改 Pod 規約中的其他字段，則不受支持。

<!--
## Acknowledgments

Special thanks to all the contributors who reviewed and commented on this feature, from the initial conception to its actual implementation (alphabetical order):
-->
## 致謝

特別感謝所有審查和評論此特性（從最初的概念到實際實施）的貢獻者（按字母順序排列）：

- [Eddie Zaneski](https://github.com/eddiezane)
- [Maciej Szulik](https://github.com/soltysh)
- [Lee Verberne](https://github.com/verb)
