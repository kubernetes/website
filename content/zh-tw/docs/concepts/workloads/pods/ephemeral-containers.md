---
title: 臨時容器
content_type: concept
weight: 60
---

<!--
reviewers:
- verb
- yujuhong
title: Ephemeral Containers
content_type: concept
weight: 60
-->

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

<!--
This page provides an overview of ephemeral containers: a special type of container
that runs temporarily in an existing {{< glossary_tooltip term_id="pod" >}} to
accomplish user-initiated actions such as troubleshooting. You use ephemeral
containers to inspect services rather than to build applications.
-->
本頁面概述了臨時容器：一種特殊的容器，該容器在現有
{{< glossary_tooltip text="Pod" term_id="pod" >}}
中臨時運行，以便完成使用者發起的操作，例如故障排查。
你會使用臨時容器來檢查服務，而不是用它來構建應用程序。

<!-- body -->

<!--
## Understanding ephemeral containers

{{< glossary_tooltip text="Pods" term_id="pod" >}} are the fundamental building
block of Kubernetes applications. Since Pods are intended to be disposable and
replaceable, you cannot add a container to a Pod once it has been created.
Instead, you usually delete and replace Pods in a controlled fashion using
{{< glossary_tooltip text="deployments" term_id="deployment" >}}.
-->
## 瞭解臨時容器   {#understanding-ephemeral-containers}

{{< glossary_tooltip text="Pod" term_id="pod" >}} 是 Kubernetes 應用程序的基本構建塊。
由於 Pod 是一次性且可替換的，因此一旦 Pod 創建，就無法將容器加入到 Pod 中。
取而代之的是，通常使用 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
以受控的方式來刪除並替換 Pod。

<!--
Sometimes it's necessary to inspect the state of an existing Pod, however, for
example to troubleshoot a hard-to-reproduce bug. In these cases you can run
an ephemeral container in an existing Pod to inspect its state and run
arbitrary commands.
-->
有時有必要檢查現有 Pod 的狀態。例如，對於難以復現的故障進行排查。
在這些場景中，可以在現有 Pod 中運行臨時容器來檢查其狀態並運行任意命令。

<!--
### What is an ephemeral container?

Ephemeral containers differ from other containers in that they lack guarantees
for resources or execution, and they will never be automatically restarted, so
they are not appropriate for building applications.  Ephemeral containers are
described using the same `ContainerSpec` as regular containers, but many fields
are incompatible and disallowed for ephemeral containers.
-->
### 什麼是臨時容器？    {#what-is-an-ephemeral-container}

臨時容器與其他容器的不同之處在於，它們缺少對資源或執行的保證，並且永遠不會自動重啓，
因此不適用於構建應用程序。
臨時容器使用與常規容器相同的 `ContainerSpec` 節來描述，但許多字段是不兼容和不允許的。

<!--
- Ephemeral containers may not have ports, so fields such as `ports`,
  `livenessProbe`, `readinessProbe` are disallowed.
- Pod resource allocations are immutable, so setting `resources` is disallowed.
- For a complete list of allowed fields, see the [EphemeralContainer reference
  documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core).
-->
- 臨時容器沒有端口設定，因此像 `ports`、`livenessProbe`、`readinessProbe`
  這樣的字段是不允許的。
- Pod 資源分配是不可變的，因此 `resources` 設定是不允許的。
- 有關允許字段的完整列表，請參見
  [EphemeralContainer 參考文檔](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core)。

<!--
Ephemeral containers are created using a special `ephemeralcontainers` handler
in the API rather than by adding them directly to `pod.spec`, so it's not
possible to add an ephemeral container using `kubectl edit`.
-->
臨時容器是使用 API 中的一種特殊的 `ephemeralcontainers` 處理器進行創建的，
而不是直接添加到 `pod.spec` 段，因此無法使用 `kubectl edit` 來添加一個臨時容器。

<!--
Like regular containers, you may not change or remove an ephemeral container
after you have added it to a Pod.
-->
與常規容器一樣，將臨時容器添加到 Pod 後，將不能更改或刪除臨時容器。

{{< note >}}
<!--
Ephemeral containers are not supported by [static pods](/docs/tasks/configure-pod-container/static-pod/).
-->
臨時容器不被[靜態 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod/) 支持。
{{< /note >}}

<!--
## Uses for ephemeral containers

Ephemeral containers are useful for interactive troubleshooting when `kubectl
exec` is insufficient because a container has crashed or a container image
doesn't include debugging utilities.
-->
## 臨時容器的用途   {#uses-for-ephemeral-containers}

當由於容器崩潰或容器映像檔不包含調試工具而導致 `kubectl exec` 無用時，
臨時容器對於交互式故障排查很有用。

<!--
In particular, [distroless images](https://github.com/GoogleContainerTools/distroless)
enable you to deploy minimal container images that reduce attack surface
and exposure to bugs and vulnerabilities. Since distroless images do not include a
shell or any debugging utilities, it's difficult to troubleshoot distroless
images using `kubectl exec` alone.
-->
尤其是，[Distroless 映像檔](https://github.com/GoogleContainerTools/distroless)
允許使用者部署最小的容器映像檔，從而減少攻擊面並減少故障和漏洞的暴露。
由於 distroless 映像檔不包含 Shell 或任何的調試工具，因此很難單獨使用
`kubectl exec` 命令進行故障排查。

<!--
When using ephemeral containers, it's helpful to enable [process namespace
sharing](/docs/tasks/configure-pod-container/share-process-namespace/) so
you can view processes in other containers.
-->
使用臨時容器時，
啓用[進程名字空間共享](/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/)很有幫助，
可以查看其他容器中的進程。

{{% heading "whatsnext" %}}

<!--
* Learn how to [debug pods using ephemeral containers](/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container).
-->
* 瞭解如何[使用臨時調試容器來進行調試](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container)
