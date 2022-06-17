---
title: 檢查棄用 Dockershim 是否對你有影響
content_type: task 
weight: 20
---
<!-- 
title: Check whether Dockershim deprecation affects you
content_type: task 
reviewers:
- SergeyKanzhelev
weight: 20
-->

<!-- overview -->

<!-- 
The `dockershim` component of Kubernetes allows to use Docker as a Kubernetes's
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
Kubernetes' built-in `dockershim` component was removed in release v1.24.
-->

Kubernetes 的 `dockershim` 元件使得你可以把 Docker 用作 Kubernetes 的
{{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}。
在 Kubernetes v1.24 版本中，內建元件 `dockershim` 被移除。


<!-- 
This page explains how your cluster could be using Docker as a container runtime,
provides details on the role that `dockershim` plays when in use, and shows steps
you can take to check whether any workloads could be affected by `dockershim` removal.
-->
本頁講解你的叢集把 Docker 用作容器執行時的運作機制，
並提供使用 `dockershim` 時，它所扮演角色的詳細資訊，
繼而展示了一組操作，可用來檢查棄用 `dockershim` 對你的工作負載是否有影響。

<!-- 
## Finding if your app has a dependencies on Docker {#find-docker-dependencies} 
-->
## 檢查你的應用是否依賴於 Docker {#find-docker-dependencies}

<!-- 
If you are using Docker for building your application containers, you can still
run these containers on any container runtime. This use of Docker does not count
as a dependency on Docker as a container runtime.
-->
即使你是透過 Docker 建立的應用容器，也不妨礙你在其他任何容器執行時上執行這些容器。
這種使用 Docker 的方式並不構成對 Docker 作為一個容器執行時的依賴。

<!-- 
When alternative container runtime is used, executing Docker commands may either
not work or yield unexpected output. This is how you can find whether you have a
dependency on Docker:
-->
當用了別的容器執行時之後，Docker 命令可能不工作，或者產生意外的輸出。
下面是判定你是否依賴於 Docker 的方法。

<!--
1. Make sure no privileged Pods execute Docker commands (like `docker ps`),
   restart the Docker service (commands such as `systemctl restart docker.service`),
   or modify Docker-specific files such as `/etc/docker/daemon.json`.
1. Check for any private registries or image mirror settings in the Docker
   configuration file (like `/etc/docker/daemon.json`). Those typically need to
   be reconfigured for another container runtime.
1. Check that scripts and apps running on nodes outside of your Kubernetes
   infrastructure do not execute Docker commands. It might be:
   - SSH to nodes to troubleshoot;
   - Node startup scripts;
   - Monitoring and security agents installed on nodes directly.
-->
1. 確認沒有特權 Pod 執行 Docker 命令（如 `docker ps`）、重新啟動 Docker
   服務（如 `systemctl restart docker.service`）或修改 Docker 配置檔案
   `/etc/docker/daemon.json`。
2. 檢查 Docker 配置檔案（如 `/etc/docker/daemon.json`）中容器映象倉庫的映象（mirror）站點設定。
   這些配置通常需要針對不同容器執行時來重新設定。
3. 檢查確保在 Kubernetes 基礎設施之外的節點上執行的指令碼和應用程式沒有執行 Docker 命令。
   可能的情況有：
   - SSH 到節點排查故障；
   - 節點啟動指令碼；
   - 直接安裝在節點上的監控和安全代理。
<!--
1. Third-party tools that perform above mentioned privileged operations. See
   [Migrating telemetry and security agents from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents)
   for more information.
1. Make sure there is no indirect dependencies on dockershim behavior.
   This is an edge case and unlikely to affect your application. Some tooling may be configured
   to react to Docker-specific behaviors, for example, raise alert on specific metrics or search for
   a specific log message as part of troubleshooting instructions.
   If you have such tooling configured, test the behavior on test
   cluster before migration.
-->
4. 檢查執行上述特權操作的第三方工具。
   詳細操作請參考[從 dockershim 遷移遙測和安全代理](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents)。
5. 確認沒有對 dockershim 行為的間接依賴。這是一種極端情況，不太可能影響你的應用。
   一些工具很可能被配置為使用了 Docker 特性，比如，基於特定指標發警報，
   或者在故障排查指令的一個環節中搜索特定的日誌資訊。
   如果你有此類配置的工具，需要在遷移之前，在測試叢集上測試這類行為。

<!-- 
## Dependency on Docker explained {#role-of-dockershim}  
-->
## Docker 依賴詳解 {#role-of-dockershim}

<!-- 
A [container runtime](/docs/concepts/containers/#container-runtimes) is software that can
execute the containers that make up a Kubernetes pod. Kubernetes is responsible for orchestration
and scheduling of Pods; on each node, the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
uses the container runtime interface as an abstraction so that you can use any compatible
container runtime.
 -->
[容器執行時](/zh-cn/docs/concepts/containers/#container-runtimes)是一個軟體，
用來執行組成 Kubernetes Pod 的容器。
Kubernetes 負責編排和排程 Pod；在每一個節點上，{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}
使用抽象的容器執行時介面，所以你可以任意選用相容的容器執行時。

<!-- 
In its earliest releases, Kubernetes offered compatibility with one container runtime: Docker.
Later in the Kubernetes project's history, cluster operators wanted to adopt additional container runtimes.
The CRI was designed to allow this kind of flexibility - and the kubelet began supporting CRI. However,
because Docker existed before the CRI specification was invented, the Kubernetes project created an
adapter component, `dockershim`. The dockershim adapter allows the kubelet to interact with Docker as
if Docker were a CRI compatible runtime.
 -->
在早期版本中，Kubernetes 提供的相容性支援一個容器執行時：Docker。
在 Kubernetes 後來的發展歷史中，叢集運營人員希望採用別的容器執行時。
於是 CRI 被設計出來滿足這類靈活性需求 - 而 kubelet 亦開始支援 CRI。
然而，因為 Docker 在 CRI 規範建立之前就已經存在，Kubernetes 就建立了一個介面卡元件 `dockershim`。
dockershim 介面卡允許 kubelet 與 Docker 互動，就好像 Docker 是一個 CRI 相容的執行時一樣。

<!-- 
You can read about it in [Kubernetes Containerd integration goes GA](/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/) blog post.
 -->
你可以閱讀博文
[Kubernetes 正式支援整合 Containerd](/zh-cn/blog/2018/05/24/kubernetes-containerd-integration-goes-ga/)。

<!-- Dockershim vs. CRI with Containerd -->
![Dockershim 和 Containerd CRI 的實現對比圖](/images/blog/2018-05-24-kubernetes-containerd-integration-goes-ga/cri-containerd.png)

<!-- 
Switching to Containerd as a container runtime eliminates the middleman. All the
same containers can be run by container runtimes like Containerd as before. But
now, since containers schedule directly with the container runtime, they are not visible to Docker.
So any Docker tooling or fancy UI you might have used
before to check on these containers is no longer available.
 -->
切換到 Containerd 容器執行時可以消除掉中間環節。
所有相同的容器都可由 Containerd 這類容器執行時來執行。
但是現在，由於直接用容器執行時排程容器，它們對 Docker 是不可見的。
因此，你以前用來檢查這些容器的 Docker 工具或漂亮的 UI 都不再可用。

<!-- 
You cannot get container information using `docker ps` or `docker inspect`
commands. As you cannot list containers, you cannot get logs, stop containers,
or execute something inside container using `docker exec`.
 -->
你不能再使用 `docker ps` 或 `docker inspect` 命令來獲取容器資訊。
由於你不能列出容器，因此你不能獲取日誌、停止容器，甚至不能透過 `docker exec` 在容器中執行命令。

{{< note >}}
<!-- 
If you're running workloads via Kubernetes, the best way to stop a container is through
the Kubernetes API rather than directly through the container runtime (this advice applies
for all container runtimes, not only Docker).
 -->
如果你在用 Kubernetes 執行工作負載，最好透過 Kubernetes API 停止容器，
而不是透過容器執行時來停止它們
（此建議適用於所有容器執行時，不僅僅是針對 Docker）。
{{< /note >}}

<!-- 
You can still pull images or build them using `docker build` command. But images
built or pulled by Docker would not be visible to container runtime and
Kubernetes. They needed to be pushed to some registry to allow them to be used
by Kubernetes.
 -->
你仍然可以下載映象，或者用 `docker build` 命令建立它們。
但用 Docker 建立、下載的映象，對於容器執行時和 Kubernetes，均不可見。
為了在 Kubernetes 中使用，需要把映象推送（push）到某映象倉庫。

## {{% heading "whatsnext" %}}

<!--
- Read [Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/) to understand your next steps
- Read the [dockershim deprecation FAQ](/blog/2020/12/02/dockershim-faq/) article for more information. 
-->
- 閱讀[從 dockershim 遷移](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/)，
  以瞭解你的下一步工作。
- 閱讀[dockershim 棄用常見問題解答](/zh-cn/blog/2020/12/02/dockershim-faq/)文章，瞭解更多資訊。

