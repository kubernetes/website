---
layout: blog
title: "先啓動邊車：如何避免障礙"
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
從 ["Kubernetes 多容器 Pod：概述"博客](/zh-cn/blog/2025/04/22/multi-container-pods-overview/)中，
你瞭解了 Pod 的工作方式，Pod 的主要架構模式，以及 Pod 在 Kubernetes 中是如何實現的。
本文主要介紹的是如何確保你的邊車容器在主應用之前啓動。這比你想象的要複雜得多！

<!--
## A gentle refresher

I'd just like to remind readers that the [v1.29.0 release of Kubernetes](/blog/2023/12/13/kubernetes-v1-29-release/) added native support for
[sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/), which can now be defined within the `.spec.initContainers` field,
but with `restartPolicy: Always`. You can see that illustrated in the following example Pod manifest snippet:
-->
## 簡要回顧

我想提醒讀者的是，[Kubernetes v1.29.0 版本](/zh-cn/blog/2023/12/13/kubernetes-v1-29-release/)增加了對
[邊車容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)的原生支持，
現在可以在 `.spec.initContainers` 字段中定義，但帶有 `restartPolicy: Always`。
你可以在下面的示例 Pod 清單片段中看到這一點：

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
    restartPolicy: Always # 這就是它成爲邊車容器的原因
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
使用 `.spec.initContainers` 塊定義邊車與使用多個 `.spec.containers`
定義傳統的多容器 Pod 相比，具體有什麼不同？
其實，所有 `.spec.initContainers` 總是**在**主應用之前啓動。
如果你定義了 Kubernetes 原生的邊車容器，這些邊車容器將在主應用之後**終止**。
此外，當與 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 一起使用時，
邊車容器仍然保持運行，並且在擁有它的 Job 完成後甚至可能重啓；
Kubernetes 原生邊車容器不會阻止 Pod 的完成。

要了解更多，你也可以閱讀官方的
[Pod 邊車容器教程](/zh-cn/docs/tutorials/configuration/pod-sidecar-containers/)。

<!--
## The problem

Now you know that defining a sidecar with this native approach will always start it before the main application. From the [kubelet source code](https://github.com/kubernetes/kubernetes/blob/537a602195efdc04cdf2cb0368792afad082d9fd/pkg/kubelet/kuberuntime/kuberuntime_manager.go#L827-L830), it's visible that this often means being started almost in parallel, and this is not always what an engineer wants to achieve. What I'm really interested in is whether I can delay the start of the main application until the sidecar is not just started, but fully running and ready to serve.
It might be a bit tricky because the problem with sidecars is there’s no obvious success signal, contrary to init containers - designed to run only for a specified period of time. With an init container, exit status 0 is unambiguously "I succeeded". With a sidecar, there are lots of points at which you can say "a thing is running".
Starting one container only after the previous one is ready is part of a graceful deployment strategy, ensuring proper sequencing and stability during startup. It’s also actually how I’d expect sidecar containers to work as well, to cover the scenario where the main application is dependent on the sidecar. For example, it may happen that an app errors out if the sidecar isn’t available to serve requests (e.g., logging with DataDog). Sure, one could change the application code (and it would actually be the “best practice” solution), but sometimes they can’t - and this post focuses on this use case.
-->
## 問題

現在你知道使用這種原生方法定義邊車總是會在主應用之前啓動它。
從 [kubelet 源代碼](https://github.com/kubernetes/kubernetes/blob/537a602195efdc04cdf2cb0368792afad082d9fd/pkg/kubelet/kuberuntime/kuberuntime_manager.go#L827-L830)
可以看出，這通常意味着幾乎是並行啓動的，而這並不總是工程師想要的結果。
我們真正感興趣的是，是否可以延遲主應用的啓動，直到邊車不僅啓動而且完全運行並準備好服務。
這可能有點棘手，因爲與 Init 容器不同（設計爲僅運行指定的時間段），邊車沒有明顯的成功信號。
對於一個 Init 容器，退出狀態 0 明確表示“我成功了”。而對於邊車容器，
在很多情況下你可以說“某個東西正在運行”。
僅在前一個容器準備好之後才啓動另一個容器，這是優雅部署策略的一部分，
確保啓動期間的正確排序和穩定性。實際上，這也是我希望邊車容器工作的方式，
以覆蓋主應用依賴於邊車的場景。例如，如果邊車不可用於服務請求（例如，使用 DataDog 進行日誌記錄），
應用程序可能會報錯。當然，可以更改應用程序代碼（這實際上是“最佳實踐”解決方案），
但有時他們不能這樣做 - 而本文檔關注的就是這種情況。

<!--
I'll explain some ways that you might try, and show you what approaches will really work.
-->
我會解釋一些你可能嘗試的方法，並告訴你哪些方法真的有效。

<!--
## Readiness probe

To check whether Kubernetes native sidecar delays the start of the main application until the sidecar is ready, let’s simulate a short investigation. Firstly, I’ll simulate a sidecar container which will never be ready by implementing a readiness probe which will never succeed. As a reminder, a [readiness probe](/docs/concepts/configuration/liveness-readiness-startup-probes/) checks if the container is ready to start accepting traffic and therefore, if the pod can be used as a backend for services. 
-->
## 就緒性檢測

要檢查 Kubernetes 原生邊車是否會延遲主應用的啓動直到邊車準備就緒，
讓我們模擬一個簡短的調查。首先，我將通過實現一個永遠不會成功的就緒探針來模擬一個永遠不會準備就緒的邊車容器。
提醒一下，[就緒性探針](/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes/)檢查容器是否準備好開始接受流量，
由此判斷 Pod 是否可以用於服務的後端。

<!--
(Unlike standard init containers, sidecar containers can have [probes](https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/) so that the kubelet can supervise the sidecar and intervene if there are problems. For example, restarting a sidecar container if it fails a health check.)
-->
（與標準的 Init 容器不同，邊車容器可以擁有[探針](https://kubernetes.io/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes/) ，
以便 kubelet 可以監督邊車，並在出現問題時進行干預。例如，
如果邊車容器未通過健康檢查，則重啓它。）

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
              - exit 1 # 此命令總是失敗，導致容器處於"未就緒"狀態
            periodSeconds: 5
      volumes:
        - name: data
          emptyDir: {}
```

<!--
The result is:
-->
結果是：

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
從這些日誌中可以明顯看出只有一個容器準備就緒 - 我知道這不可能是邊車，
因爲我將其定義爲永遠不會準備就緒（你也可以在 `kubectl get pod -o json` 中檢查容器狀態）。
我還看到 myapp 在邊車準備就緒之前已經啓動。這不是我希望達到的結果；
在這種情況下，主應用容器對它邊車有硬依賴。

<!--
## Maybe a startup probe?

To ensure that the sidecar is ready before the main app container starts, I can define a `startupProbe`. It will delay the start of the main container until the command is successfully executed (returns `0` exit status). If you’re wondering why I’ve added it to my `initContainer`, let’s analyse what happens If I’d added it to myapp container. I wouldn’t have guaranteed the probe would run before the main application code - and this one, can potentially error out without the sidecar being up and running.
-->
## 或許是一個啓動探針？

爲了確保邊車準備就緒後再啓動主應用容器，我可以定義一個 `startupProbe`。
這將延遲主容器的啓動，直到命令成功執行（返回 `0` 退出狀態）。
如果你想知道爲什麼我將其添加到我的 `initContainer` 中，
讓我們分析一下如果我將其添加到 myapp 容器會發生什麼。
我不能保證探針會在主應用代碼之前運行 - 而這可能會導致錯誤，尤其是在邊車尚未啓動和運行時。


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
這導致 2/2 個容器已就緒並運行，從事件中可以推斷主應用僅在 nginx 已啓動後纔開始啓動。
但爲了確認它是否等待了邊車的就緒狀態，讓我們將 `startupProbe` 更改爲執行類型命令：

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
並運行 `kubectl get pods -w` 以實時觀察兩個容器的就緒狀態是否僅在 15 秒延遲後更改。
再次確認，事件顯示主應用在邊車之後啓動。
這意味着使用帶有正確 `startupProbe.httpGet` 請求的 `startupProbe`
有助於延遲主應用的啓動，直到邊車準備就緒。這不理想，但它有效。

<!--
## What about the postStart lifecycle hook?

Fun fact: using the `postStart` lifecycle hook block will also do the job, but I’d have to write my own mini-shell script, which is even less efficient.
-->
## 關於 postStart 生命週期鉤子？

趣聞：使用 `postStart` 生命週期鉤子塊也可以完成任務，
但我要編寫自己的迷你 Shell 腳本，這甚至更低效。

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
## 存活探針

一個有趣的練習是使用[存活探針](/zh-cn/docs/concepts/configuration/liveness-readiness-startup-probes/)檢查邊車容器的行爲。
存活探針的設定和行爲與就緒探針相似——唯一的區別是它不會影響容器的就緒狀態，而是在探針失敗時重啓容器。

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
    - exit 1 # 該命令總是失敗，導致容器處於"未就緒"狀態
  periodSeconds: 5
```

<!--
After adding the liveness probe configured just as the previous readiness probe and checking events of the pod by `kubectl describe pod` it’s visible that the sidecar has a restart count above 0. Nevertheless, the main application is not restarted nor influenced at all, even though I'm aware that (in our imaginary worst-case scenario) it can error out when the sidecar is not there serving requests.
What if I’d used a `livenessProbe` without lifecycle `postStart`? Both containers will be immediately ready: at the beginning, this behavior will not be different from the one without any additional probes since the liveness probe doesn’t affect readiness at all. After a while, the sidecar will begin to restart itself, but it won’t influence the main container.
-->
在添加了設定與之前的就緒探針相同的存活探針，並通過 `kubectl describe pod`
檢查 Pod 的事件後，可以看到邊車的重啓次數超過 0。儘管如此，主應用並未受到任何影響或重啓，
即使我知道（在我們假想的最壞情況下）當邊車不處理請求時，主應用可能會出錯。
如果我在沒有生命週期 `postStart` 的情況下使用 `livenessProbe` 會怎樣？
兩個容器將立即準備就緒：一開始，這種行爲不會與沒有任何額外探針的情況有任何不同，
因爲存活探針完全不影響就緒狀態。一段時間後，邊車將開始重啓自己，但這不會影響主容器。

<!--
## Findings summary

I’ll summarize the startup behavior in the table below:
-->
## 調研總結

我將在下表中總結啓動行爲：

<!--
| Probe/Hook     | Sidecar starts before the main app?                      | Main app waits for the sidecar to be ready?         | What if the check doesn’t pass?                    |
|----------------|----------------------------------------------------------|-----------------------------------------------------|----------------------------------------------------|
| `readinessProbe` | **Yes**, but it’s almost in parallel (effectively **no**)    | **No**                                                  | Sidecar is not ready; main app continues running   |
| `livenessProbe`  | Yes, but it’s almost in parallel (effectively **no**)    | **No**                                                  | Sidecar is restarted, main app continues running   |
| `startupProbe`   | **Yes**                                                      | **Yes**                                                 | Main app is not started                            |
| postStart      | **Yes**, main app container starts after `postStart` completes | **Yes**, but you have to provide custom logic for that  | Main app is not started                            |
-->
| 探針/鉤子         | 邊車在主應用之前啓動？                          | 主應用是否等待邊車準備就緒？               | 如果檢查不通過會發生什麼？                |
|------------------|---------------------------------------------|---------------------------------------|---------------------------------------|
| `readinessProbe` | **是**，但幾乎是並行的（實際上爲 **否**）        | **否**                                 | 邊車未就緒；主應用繼續運行              |
| `livenessProbe`  | 是，但幾乎是並行的（實際上爲 **否**）            | **否**                                 | 邊車被重啓，主應用繼續運行                |
| `startupProbe`   | **是**                                      | **是**                                 | 主應用不會啓動                          |
| postStart        | **是**，主應用容器在 `postStart` 完成後啓動     | **是**，但你必須爲此提供自定義邏輯         | 主應用不會啓動                          |

<!--
To summarize: with sidecars often being a dependency of the main application, you may want to delay the start of the latter until the sidecar is healthy.
The ideal pattern is to start both containers simultaneously and have the app container logic delay at all levels, but it’s not always possible. If that's what you need, you have to use the right kind of customization to the Pod definition. Thankfully, it’s nice and quick, and you have the recipe ready above.

Happy deploying!
-->
總結：由於邊車經常是主應用的依賴項，你可能希望延遲後者啓動直到邊車健康。

理想模式是同時啓動兩個容器，並讓應用容器邏輯在所有層面上延遲，但這並不總是可行。
如果你需要這樣做，就必須對 Pod 定義使用適當的自定義設置。
值得慶幸的是，這既簡單又快速，並且你已經有了上面的解決方案。

祝部署順利！
