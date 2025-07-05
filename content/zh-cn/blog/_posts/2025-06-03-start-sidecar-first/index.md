---
layout: blog
title: "先启动边车：如何避免障碍"
date: 2025-06-03
draft: false
slug: start-sidecar-first
author: Agata Skorupka (The Scale Factory)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Start Sidecar First: How To Avoid Snags"
date: 2025-06-03
draft: false
slug: start-sidecar-first
author: Agata Skorupka (The Scale Factory)
-->

<!--
From the [Kubernetes Multicontainer Pods: An Overview blog post](/blog/2025/04/22/multi-container-pods-overview/) you know what their job is, what are the main architectural patterns, and how they are implemented in Kubernetes. The main thing I’ll cover in this article is how to ensure that your sidecar containers start before the main app. It’s more complicated than you might think!
-->
从 ["Kubernetes 多容器 Pod：概述"博客](/zh-cn/blog/2025/04/22/multi-container-pods-overview/)中，
你了解了 Pod 的工作方式，Pod 的主要架构模式，以及 Pod 在 Kubernetes 中是如何实现的。
本文主要介绍的是如何确保你的边车容器在主应用之前启动。这比你想象的要复杂得多！

<!--
## A gentle refresher

I'd just like to remind readers that the [v1.29.0 release of Kubernetes](/blog/2023/12/13/kubernetes-v1-29-release/) added native support for
[sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/), which can now be defined within the `.spec.initContainers` field,
but with `restartPolicy: Always`. You can see that illustrated in the following example Pod manifest snippet:
-->
## 简要回顾

我想提醒读者的是，[Kubernetes v1.29.0 版本](/zh-cn/blog/2023/12/13/kubernetes-v1-29-release/)增加了对
[边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)的原生支持，
现在可以在 `.spec.initContainers` 字段中定义，但带有 `restartPolicy: Always`。
你可以在下面的示例 Pod 清单片段中看到这一点：

<!--
```yaml
initContainers:
  - name: logshipper
    image: alpine:latest
    restartPolicy: Always # this is what makes it a sidecar container
    command: ['sh', '-c', 'tail -F /opt/logs.txt']
    volumeMounts:
    - name: data
        mountPath: /opt
```
-->
```yaml
initContainers:
  - name: logshipper
    image: alpine:latest
    restartPolicy: Always # 这就是它成为边车容器的原因
    command: ['sh', '-c', 'tail -F /opt/logs.txt']
    volumeMounts:
    - name: data
        mountPath: /opt
```

<!--
What are the specifics of defining sidecars with a `.spec.initContainers` block, rather than as a legacy multi-container pod with multiple `.spec.containers`?
Well, all `.spec.initContainers` are always launched **before** the main application. If you define Kubernetes-native sidecars, those are terminated **after** the main application. Furthermore, when used with [Jobs](/docs/concepts/workloads/controllers/job/), a sidecar container should still be alive and could potentially even restart after the owning Job is complete; Kubernetes-native sidecar containers do not block pod completion.

To learn more, you can also read the official [Pod sidecar containers tutorial](/docs/tutorials/configuration/pod-sidecar-containers/).
-->
使用 `.spec.initContainers` 块定义边车与使用多个 `.spec.containers`
定义传统的多容器 Pod 相比，具体有什么不同？
其实，所有 `.spec.initContainers` 总是**在**主应用之前启动。
如果你定义了 Kubernetes 原生的边车容器，这些边车容器将在主应用之后**终止**。
此外，当与 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 一起使用时，
边车容器仍然保持运行，并且在拥有它的 Job 完成后甚至可能重启；
Kubernetes 原生边车容器不会阻止 Pod 的完成。

要了解更多，你也可以阅读官方的
[Pod 边车容器教程](/zh-cn/docs/tutorials/configuration/pod-sidecar-containers/)。

<!--
## The problem

Now you know that defining a sidecar with this native approach will always start it before the main application. From the [kubelet source code](https://github.com/kubernetes/kubernetes/blob/537a602195efdc04cdf2cb0368792afad082d9fd/pkg/kubelet/kuberuntime/kuberuntime_manager.go#L827-L830), it's visible that this often means being started almost in parallel, and this is not always what an engineer wants to achieve. What I'm really interested in is whether I can delay the start of the main application until the sidecar is not just started, but fully running and ready to serve.
It might be a bit tricky because the problem with sidecars is there’s no obvious success signal, contrary to init containers - designed to run only for a specified period of time. With an init container, exit status 0 is unambiguously "I succeeded". With a sidecar, there are lots of points at which you can say "a thing is running".
Starting one container only after the previous one is ready is part of a graceful deployment strategy, ensuring proper sequencing and stability during startup. It’s also actually how I’d expect sidecar containers to work as well, to cover the scenario where the main application is dependent on the sidecar. For example, it may happen that an app errors out if the sidecar isn’t available to serve requests (e.g., logging with DataDog). Sure, one could change the application code (and it would actually be the “best practice” solution), but sometimes they can’t - and this post focuses on this use case.
-->
## 问题

现在你知道使用这种原生方法定义边车总是会在主应用之前启动它。
从 [kubelet 源代码](https://github.com/kubernetes/kubernetes/blob/537a602195efdc04cdf2cb0368792afad082d9fd/pkg/kubelet/kuberuntime/kuberuntime_manager.go#L827-L830)
可以看出，这通常意味着几乎是并行启动的，而这并不总是工程师想要的结果。
我们真正感兴趣的是，是否可以延迟主应用的启动，直到边车不仅启动而且完全运行并准备好服务。
这可能有点棘手，因为与 Init 容器不同（设计为仅运行指定的时间段），边车没有明显的成功信号。
对于一个 Init 容器，退出状态 0 明确表示“我成功了”。而对于边车容器，
在很多情况下你可以说“某个东西正在运行”。
仅在前一个容器准备好之后才启动另一个容器，这是优雅部署策略的一部分，
确保启动期间的正确排序和稳定性。实际上，这也是我希望边车容器工作的方式，
以覆盖主应用依赖于边车的场景。例如，如果边车不可用于服务请求（例如，使用 DataDog 进行日志记录），
应用程序可能会报错。当然，可以更改应用程序代码（这实际上是“最佳实践”解决方案），
但有时他们不能这样做 - 而本文档关注的就是这种情况。

<!--
I'll explain some ways that you might try, and show you what approaches will really work.
-->
我会解释一些你可能尝试的方法，并告诉你哪些方法真的有效。

<!--
## Readiness probe

To check whether Kubernetes native sidecar delays the start of the main application until the sidecar is ready, let’s simulate a short investigation. Firstly, I’ll simulate a sidecar container which will never be ready by implementing a readiness probe which will never succeed. As a reminder, a [readiness probe](/docs/concepts/configuration/liveness-readiness-startup-probes/) checks if the container is ready to start accepting traffic and therefore, if the pod can be used as a backend for services. 
-->
## 就绪性检测

要检查 Kubernetes 原生边车是否会延迟主应用的启动直到边车准备就绪，
让我们模拟一个简短的调查。首先，我将通过实现一个永远不会成功的就绪探针来模拟一个永远不会准备就绪的边车容器。
提醒一下，[就绪性探针](/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes/)检查容器是否准备好开始接受流量，
由此判断 Pod 是否可以用于服务的后端。

<!--
(Unlike standard init containers, sidecar containers can have [probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/) so that the kubelet can supervise the sidecar and intervene if there are problems. For example, restarting a sidecar container if it fails a health check.)
-->
（与标准的 Init 容器不同，边车容器可以拥有[探针](https://kubernetes.io/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes/) ，
以便 kubelet 可以监督边车，并在出现问题时进行干预。例如，
如果边车容器未通过健康检查，则重启它。）

<!--
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: alpine:latest
          command: ["sh", "-c", "sleep 3600"]
      initContainers:
        - name: nginx
          image: nginx:latest
          restartPolicy: Always
          ports:
            - containerPort: 80
              protocol: TCP
          readinessProbe:
            exec:
              command:
              - /bin/sh
              - -c
              - exit 1 # this command always fails, keeping the container "Not Ready"
            periodSeconds: 5
      volumes:
        - name: data
          emptyDir: {}
```
-->
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: alpine:latest
          command: ["sh", "-c", "sleep 3600"]
      initContainers:
        - name: nginx
          image: nginx:latest
          restartPolicy: Always
          ports:
            - containerPort: 80
              protocol: TCP
          readinessProbe:
            exec:
              command:
              - /bin/sh
              - -c
              - exit 1 # 此命令总是失败，导致容器处于"未就绪"状态
            periodSeconds: 5
      volumes:
        - name: data
          emptyDir: {}
```

<!--
The result is:
-->
结果是：

```console
controlplane $ kubectl get pods -w
NAME                    READY   STATUS    RESTARTS   AGE
myapp-db5474f45-htgw5   1/2     Running   0          9m28s

controlplane $ kubectl describe pod myapp-db5474f45-htgw5 
Name:             myapp-db5474f45-htgw5
Namespace:        default
(...)
Events:
  Type     Reason     Age               From               Message
  ----     ------     ----              ----               -------
  Normal   Scheduled  17s               default-scheduler  Successfully assigned default/myapp-db5474f45-htgw5 to node01
  Normal   Pulling    16s               kubelet            Pulling image "nginx:latest"
  Normal   Pulled     16s               kubelet            Successfully pulled image "nginx:latest" in 163ms (163ms including waiting). Image size: 72080558 bytes.
  Normal   Created    16s               kubelet            Created container nginx
  Normal   Started    16s               kubelet            Started container nginx
  Normal   Pulling    15s               kubelet            Pulling image "alpine:latest"
  Normal   Pulled     15s               kubelet            Successfully pulled image "alpine:latest" in 159ms (160ms including waiting). Image size: 3652536 bytes.
  Normal   Created    15s               kubelet            Created container myapp
  Normal   Started    15s               kubelet            Started container myapp
  Warning  Unhealthy  1s (x6 over 15s)  kubelet            Readiness probe failed:
```

<!--
From these logs it’s evident that only one container is ready - and I know it can’t be the sidecar, because I’ve defined it so it’ll never be ready (you can also check container statuses in `kubectl get pod -o json`). I also saw that myapp has been started before the sidecar is ready. That was not the result I wanted to achieve; in this case, the main app container has a hard dependency on its sidecar.
-->
从这些日志中可以明显看出只有一个容器准备就绪 - 我知道这不可能是边车，
因为我将其定义为永远不会准备就绪（你也可以在 `kubectl get pod -o json` 中检查容器状态）。
我还看到 myapp 在边车准备就绪之前已经启动。这不是我希望达到的结果；
在这种情况下，主应用容器对它边车有硬依赖。

<!--
## Maybe a startup probe?

To ensure that the sidecar is ready before the main app container starts, I can define a `startupProbe`. It will delay the start of the main container until the command is successfully executed (returns `0` exit status). If you’re wondering why I’ve added it to my `initContainer`, let’s analyse what happens If I’d added it to myapp container. I wouldn’t have guaranteed the probe would run before the main application code - and this one, can potentially error out without the sidecar being up and running.
-->
## 或许是一个启动探针？

为了确保边车准备就绪后再启动主应用容器，我可以定义一个 `startupProbe`。
这将延迟主容器的启动，直到命令成功执行（返回 `0` 退出状态）。
如果你想知道为什么我将其添加到我的 `initContainer` 中，
让我们分析一下如果我将其添加到 myapp 容器会发生什么。
我不能保证探针会在主应用代码之前运行 - 而这可能会导致错误，尤其是在边车尚未启动和运行时。


```yaml                                                                
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: alpine:latest
          command: ["sh", "-c", "sleep 3600"]
      initContainers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
              protocol: TCP
          restartPolicy: Always
          startupProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 30
            failureThreshold: 10
            timeoutSeconds: 20
      volumes:
        - name: data
          emptyDir: {}
```

<!--
This results in 2/2 containers being ready and running, and from events, it can be inferred that the main application started only after nginx had already been started. But to confirm whether it waited for the sidecar readiness, let’s change the `startupProbe` to the exec type of command: 
-->
这导致 2/2 个容器已就绪并运行，从事件中可以推断主应用仅在 nginx 已启动后才开始启动。
但为了确认它是否等待了边车的就绪状态，让我们将 `startupProbe` 更改为执行类型命令：

```yaml
startupProbe:
  exec:
    command:
    - /bin/sh
    - -c
    - sleep 15
```

<!--
and run `kubectl get pods -w` to watch in real time whether the readiness of both containers only changes after a 15 second delay. Again, events confirm the main application starts after the sidecar.
That means that using the `startupProbe` with a correct `startupProbe.httpGet` request helps to delay the main application start until the sidecar is ready. It’s not optimal, but it works.
-->
并运行 `kubectl get pods -w` 以实时观察两个容器的就绪状态是否仅在 15 秒延迟后更改。
再次确认，事件显示主应用在边车之后启动。
这意味着使用带有正确 `startupProbe.httpGet` 请求的 `startupProbe`
有助于延迟主应用的启动，直到边车准备就绪。这不理想，但它有效。

<!--
## What about the postStart lifecycle hook?

Fun fact: using the `postStart` lifecycle hook block will also do the job, but I’d have to write my own mini-shell script, which is even less efficient.
-->
## 关于 postStart 生命周期钩子？

趣闻：使用 `postStart` 生命周期钩子块也可以完成任务，
但我要编写自己的迷你 Shell 脚本，这甚至更低效。

```yaml
initContainers:
  - name: nginx
    image: nginx:latest
    restartPolicy: Always
    ports:
      - containerPort: 80
        protocol: TCP
    lifecycle:
      postStart:
        exec:
          command:
          - /bin/sh
          - -c
          - |
            echo "Waiting for readiness at http://localhost:80"
            until curl -sf http://localhost:80; do
              echo "Still waiting for http://localhost:80..."
              sleep 5
            done
            echo "Service is ready at http://localhost:80"
```

<!--
## Liveness probe

An interesting exercise would be to check the sidecar container behavior with a [liveness probe](/docs/concepts/configuration/liveness-readiness-startup-probes/).
A liveness probe behaves and is configured similarly to a readiness probe - only with the difference that it doesn’t affect the readiness of the container but restarts it in case the probe fails. 
-->
## 存活探针

一个有趣的练习是使用[存活探针](/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes/)检查边车容器的行为。
存活探针的配置和行为与就绪探针相似——唯一的区别是它不会影响容器的就绪状态，而是在探针失败时重启容器。

<!--
```yaml
livenessProbe:
  exec:
    command:
    - /bin/sh
    - -c
    - exit 1 # this command always fails, keeping the container "Not Ready"
  periodSeconds: 5
```
-->
```yaml
livenessProbe:
  exec:
    command:
    - /bin/sh
    - -c
    - exit 1 # 该命令总是失败，导致容器处于"未就绪"状态
  periodSeconds: 5
```

<!--
After adding the liveness probe configured just as the previous readiness probe and checking events of the pod by `kubectl describe pod` it’s visible that the sidecar has a restart count above 0. Nevertheless, the main application is not restarted nor influenced at all, even though I'm aware that (in our imaginary worst-case scenario) it can error out when the sidecar is not there serving requests.
What if I’d used a `livenessProbe` without lifecycle `postStart`? Both containers will be immediately ready: at the beginning, this behavior will not be different from the one without any additional probes since the liveness probe doesn’t affect readiness at all. After a while, the sidecar will begin to restart itself, but it won’t influence the main container.
-->
在添加了配置与之前的就绪探针相同的存活探针，并通过 `kubectl describe pod`
检查 Pod 的事件后，可以看到边车的重启次数超过 0。尽管如此，主应用并未受到任何影响或重启，
即使我知道（在我们假想的最坏情况下）当边车不处理请求时，主应用可能会出错。
如果我在没有生命周期 `postStart` 的情况下使用 `livenessProbe` 会怎样？
两个容器将立即准备就绪：一开始，这种行为不会与没有任何额外探针的情况有任何不同，
因为存活探针完全不影响就绪状态。一段时间后，边车将开始重启自己，但这不会影响主容器。

<!--
## Findings summary

I’ll summarize the startup behavior in the table below:
-->
## 调研总结

我将在下表中总结启动行为：

<!--
| Probe/Hook     | Sidecar starts before the main app?                      | Main app waits for the sidecar to be ready?         | What if the check doesn’t pass?                    |
|----------------|----------------------------------------------------------|-----------------------------------------------------|----------------------------------------------------|
| `readinessProbe` | **Yes**, but it’s almost in parallel (effectively **no**)    | **No**                                                  | Sidecar is not ready; main app continues running   |
| `livenessProbe`  | Yes, but it’s almost in parallel (effectively **no**)    | **No**                                                  | Sidecar is restarted, main app continues running   |
| `startupProbe`   | **Yes**                                                      | **Yes**                                                 | Main app is not started                            |
| postStart      | **Yes**, main app container starts after `postStart` completes | **Yes**, but you have to provide custom logic for that  | Main app is not started                            |
-->
| 探针/钩子         | 边车在主应用之前启动？                          | 主应用是否等待边车准备就绪？               | 如果检查不通过会发生什么？                |
|------------------|---------------------------------------------|---------------------------------------|---------------------------------------|
| `readinessProbe` | **是**，但几乎是并行的（实际上为 **否**）        | **否**                                 | 边车未就绪；主应用继续运行              |
| `livenessProbe`  | 是，但几乎是并行的（实际上为 **否**）            | **否**                                 | 边车被重启，主应用继续运行                |
| `startupProbe`   | **是**                                      | **是**                                 | 主应用不会启动                          |
| postStart        | **是**，主应用容器在 `postStart` 完成后启动     | **是**，但你必须为此提供自定义逻辑         | 主应用不会启动                          |

<!--
To summarize: with sidecars often being a dependency of the main application, you may want to delay the start of the latter until the sidecar is healthy.
The ideal pattern is to start both containers simultaneously and have the app container logic delay at all levels, but it’s not always possible. If that's what you need, you have to use the right kind of customization to the Pod definition. Thankfully, it’s nice and quick, and you have the recipe ready above.

Happy deploying!
-->
总结：由于边车经常是主应用的依赖项，你可能希望延迟后者启动直到边车健康。

理想模式是同时启动两个容器，并让应用容器逻辑在所有层面上延迟，但这并不总是可行。
如果你需要这样做，就必须对 Pod 定义使用适当的自定义设置。
值得庆幸的是，这既简单又快速，并且你已经有了上面的解决方案。

祝部署顺利！
