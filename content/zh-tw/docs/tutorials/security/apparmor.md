---
title: 使用 AppArmor 限制容器對資源的訪問
content_type: tutorial
weight: 30
---
<!--
reviewers:
- stclair
title: Restrict a Container's Access to Resources with AppArmor
content_type: tutorial
weight: 30
-->

<!-- overview -->

{{< feature-state feature_gate_name="AppArmor" >}}

<!--
This page shows you how to load AppArmor profiles on your nodes and enforce
those profiles in Pods. To learn more about how Kubernetes can confine Pods using
AppArmor, see
[Linux kernel security constraints for Pods and containers](/docs/concepts/security/linux-kernel-security-constraints/#apparmor).
-->
本頁面向你展示如何在節點上加載 AppArmor 配置文件並在 Pod 中強制應用這些配置文件。
要了解有關 Kubernetes 如何使用 AppArmor 限制 Pod 的更多信息，請參閱
[Pod 和容器的 Linux 內核安全約束](/zh-cn/docs/concepts/security/linux-kernel-security-constraints/#apparmor)。

## {{% heading "objectives" %}}

<!--
* See an example of how to load a profile on a Node
* Learn how to enforce the profile on a Pod
* Learn how to check that the profile is loaded
* See what happens when a profile is violated
* See what happens when a profile cannot be loaded
-->
* 查看如何在節點上加載配置文件示例
* 瞭解如何在 Pod 上強制執行配置文件
* 瞭解如何檢查配置文件是否已加載
* 查看違反配置文件時會發生什麼
* 查看無法加載配置文件時會發生什麼

## {{% heading "prerequisites" %}}

<!--
AppArmor is an optional kernel module and Kubernetes feature, so verify it is supported on your
Nodes before proceeding:
-->
AppArmor 是一個可選的內核模塊和 Kubernetes 特性，因此請在繼續之前驗證你的節點是否支持它：

<!--
1. AppArmor kernel module is enabled -- For the Linux kernel to enforce an AppArmor profile, the
   AppArmor kernel module must be installed and enabled. Several distributions enable the module by
   default, such as Ubuntu and SUSE, and many others provide optional support. To check whether the
   module is enabled, check the `/sys/module/apparmor/parameters/enabled` file:
-->
1. AppArmor 內核模塊已啓用 —— 要使 Linux 內核強制執行 AppArmor 配置文件，
   必須安裝並且啓動 AppArmor 內核模塊。默認情況下，有幾個發行版支持該模塊，
   如 Ubuntu 和 SUSE，還有許多發行版提供可選支持。要檢查模塊是否已啓用，請檢查
   `/sys/module/apparmor/parameters/enabled` 文件：

   ```shell
   cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   <!--
   The kubelet verifies that AppArmor is enabled on the host before admitting a pod with AppArmor
   explicitly configured.
   -->
   kubelet 會先驗證主機上是否已啓用 AppArmor，然後再接納顯式配置了 AppArmor 的 Pod。

<!--
1. Container runtime supports AppArmor -- All common Kubernetes-supported container
   runtimes should support AppArmor, including {{< glossary_tooltip term_id="cri-o" >}} and
   {{< glossary_tooltip term_id="containerd" >}}. Please refer to the corresponding runtime
   documentation and verify that the cluster fulfills the requirements to use AppArmor.
-->
2. 容器運行時支持 AppArmor —— 所有常見的 Kubernetes 支持的容器運行時都應該支持 AppArmor，
   包括 {{< glossary_tooltip term_id="cri-o" >}} 和 {{< glossary_tooltip term_id="containerd" >}}。
   請參考相應的運行時文檔並驗證集羣是否滿足使用 AppArmor 的要求。

<!--
1. Profile is loaded -- AppArmor is applied to a Pod by specifying an AppArmor profile that each
   container should be run with. If any of the specified profiles is not loaded in the
   kernel, the kubelet will reject the Pod. You can view which profiles are loaded on a
   node by checking the `/sys/kernel/security/apparmor/profiles` file. For example:
-->
3. 配置文件已加載 —— 通過指定每個容器應使用的 AppArmor 配置文件，
   AppArmor 會被應用到 Pod 上。如果所指定的配置文件未加載到內核，
   kubelet 將拒絕 Pod。
   通過檢查 `/sys/kernel/security/apparmor/profiles` 文件，
   可以查看節點加載了哪些配置文件。例如:

   ```shell
   ssh gke-test-default-pool-239f5d02-gyn2 "sudo cat /sys/kernel/security/apparmor/profiles | sort"
   ```

   ```
   apparmor-test-deny-write (enforce)
   apparmor-test-audit-write (enforce)
   docker-default (enforce)
   k8s-nginx (enforce)
   ```

   <!--
   For more details on loading profiles on nodes, see
   [Setting up nodes with profiles](#setting-up-nodes-with-profiles).
   -->
   
   有關在節點上加載配置文件的詳細信息，請參見[使用配置文件設置節點](#setting-up-nodes-with-profiles)。

<!-- lessoncontent -->

<!--
## Securing a Pod
-->
## 保護 Pod {#securing-a-pod}

{{< note >}}
<!--
Prior to Kubernetes v1.30, AppArmor was specified through annotations. Use the documentation version
selector to view the documentation with this deprecated API.
-->
在 Kubernetes v1.30 之前，AppArmor 是通過註解指定的。
使用文檔版本選擇器查看包含此已棄用 API 的文檔。
{{< /note >}}

<!--
AppArmor profiles can be specified at the pod level or container level. The container AppArmor
profile takes precedence over the pod profile.
-->
AppArmor 配置文件可以在 Pod 級別或容器級別指定。容器
AppArmor 配置文件優先於 Pod 配置文件。

```yaml
securityContext:
  appArmorProfile:
    type: <profile_type>
```

<!--
Where `<profile_type>` is one of:
-->
其中 `<profile_type>` 是以下之一：

<!--
* `RuntimeDefault` to use the runtime's default profile
* `Localhost` to use a profile loaded on the host (see below)
* `Unconfined` to run without AppArmor
-->
* `RuntimeDefault` 使用運行時的默認配置文件
* `Localhost` 使用主機上加載的配置文件（見下文）
* `Unconfined` 無需 AppArmor 即可運行

<!--
See [Specifying AppArmor Confinement](#specifying-apparmor-confinement) for full details on the AppArmor profile API.
-->
有關 AppArmor 配置文件 API 的完整詳細信息，請參閱[指定 AppArmor 限制](#specifying-apparmor-confinement)。

<!--
To verify that the profile was applied, you can check that the container's root process is
running with the correct profile by examining its proc attr:
-->
要驗證是否應用了配置文件，
你可以通過檢查容器根進程的進程屬性來檢查該進程是否正在使用正確的配置文件運行：

```shell
kubectl exec <pod_name> -- cat /proc/1/attr/current
```

<!--
The output should look something like this:
-->
輸出應如下所示：

 ```
 cri-containerd.apparmor.d (enforce)
 ```

<!--
You can also verify directly that the container's root process is running with the correct profile by checking its proc attr:
-->
你還可以通過檢查容器的 proc attr，直接驗證容器的根進程是否以正確的配置文件運行：

```shell
kubectl exec <pod_name> -- cat /proc/1/attr/current
```

```
k8s-apparmor-example-deny-write (enforce)
```

<!--
## Example
-->
## 舉例 {#example}

<!--
*This example assumes you have already set up a cluster with AppArmor support.*
-->
**本例假設你已經設置了一個集羣使用 AppArmor 支持。**

<!--
First, load the profile you want to use onto your Nodes. This profile blocks all file write operations:
-->
首先，將要使用的配置文件加載到節點上，該配置文件阻止所有文件寫入操作：

```
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # 拒絕所有文件寫入
  deny /** w,
}
```

<!--
The profile needs to be loaded onto all nodes, since you don't know where the pod will be scheduled.
For this example you can use SSH to install the profiles, but other approaches are
discussed in [Setting up nodes with profiles](#setting-up-nodes-with-profiles).
-->
由於不知道 Pod 將被調度到哪裏，該配置文件需要加載到所有節點上。
在本例中，你可以使用 SSH 來安裝配置文件，
但是在[使用配置文件設置節點](#setting-up-nodes-with-profiles)中討論了其他方法。

<!--
# This example assumes that node names match host names, and are reachable via SSH.
-->
```shell
# 此示例假設節點名稱與主機名稱匹配，並且可通過 SSH 訪問。
NODES=($( kubectl get node -o jsonpath='{.items[*].status.addresses[?(.type == "Hostname")].address}' ))
for NODE in ${NODES[*]}; do ssh $NODE 'sudo apparmor_parser -q <<EOF
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
EOF'
done
```

<!--
Next, run a simple "Hello AppArmor" pod with the deny-write profile:
-->
接下來，運行一個帶有拒絕寫入配置文件的簡單 “Hello AppArmor” Pod：

{{% code_sample file="pods/security/hello-apparmor.yaml" %}}

```shell
kubectl create -f hello-apparmor.yaml
```

<!--
You can verify that the container is actually running with that profile by checking its `/proc/1/attr/current`:
-->
你可以通過檢查其 `/proc/1/attr/current` 來驗證容器是否確實使用該配置文件運行：

```shell
kubectl exec hello-apparmor -- cat /proc/1/attr/current
```

<!--
The output should be:
-->
輸出應該是：

```
k8s-apparmor-example-deny-write (enforce)
```

<!--
Finally, you can see what happens if you violate the profile by writing to a file:
-->
最後，你可以看到，如果你通過寫入文件來違反配置文件會發生什麼：

```shell
kubectl exec hello-apparmor -- touch /tmp/test
```

```
touch: /tmp/test: Permission denied
error: error executing remote command: command terminated with non-zero exit code: Error executing in Docker Container: 1
```

<!--
To wrap up, see what happens if you try to specify a profile that hasn't been loaded:
-->
最後，看看如果你嘗試指定尚未加載的配置文件會發生什麼：

```shell
kubectl create -f /dev/stdin <<EOF
apiVersion: v1
kind: Pod
metadata:
  name: hello-apparmor-2
spec:
  securityContext:
    appArmorProfile:
      type: Localhost
      localhostProfile: k8s-apparmor-example-allow-write
  containers:
  - name: hello
    image: busybox:1.28
    command: [ "sh", "-c", "echo 'Hello AppArmor!' && sleep 1h" ]
EOF
```
```
pod/hello-apparmor-2 created
```

<!--
Although the Pod was created successfully, further examination will show that it is stuck in pending:
-->
雖然 Pod 創建成功，但進一步檢查會發現它陷入 pending 狀態：

```shell
kubectl describe pod hello-apparmor-2
```

```
Name:          hello-apparmor-2
Namespace:     default
Node:          gke-test-default-pool-239f5d02-x1kf/10.128.0.27
Start Time:    Tue, 30 Aug 2016 17:58:56 -0700
Labels:        <none>
Annotations:   container.apparmor.security.beta.kubernetes.io/hello=localhost/k8s-apparmor-example-allow-write
Status:        Pending
...
Events:
  Type     Reason     Age              From               Message
  ----     ------     ----             ----               -------
  Normal   Scheduled  10s              default-scheduler  Successfully assigned default/hello-apparmor to gke-test-default-pool-239f5d02-x1kf
  Normal   Pulled     8s               kubelet            Successfully pulled image "busybox:1.28" in 370.157088ms (370.172701ms including waiting)
  Normal   Pulling    7s (x2 over 9s)  kubelet            Pulling image "busybox:1.28"
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: failed to get container spec opts: failed to generate apparmor spec opts: apparmor profile not found k8s-apparmor-example-allow-write
  Normal   Pulled     7s               kubelet            Successfully pulled image "busybox:1.28" in 90.980331ms (91.005869ms including waiting)
```

<!--
An Event provides the error message with the reason, the specific wording is runtime-dependent:
-->
事件提供錯誤消息及其原因，具體措辭與運行時相關：

```
  Warning  Failed     7s (x2 over 8s)  kubelet            Error: failed to get container spec opts: failed to generate apparmor spec opts: apparmor profile not found 
```

<!--
## Administration
-->
## 管理 {#administration}

<!--
### Setting up Nodes with profiles
-->
### 使用配置文件設置節點 {#setting-up-nodes-with-profiles}

<!--
Kubernetes {{< skew currentVersion >}} does not currently provide any built-in mechanisms for loading AppArmor profiles onto
Nodes. Profiles can be loaded through custom infrastructure or tools like the
[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator).
-->
Kubernetes {{< skew currentVersion >}} 目前不提供任何本地機制來將 AppArmor 配置文件加載到節點上。
可以通過自定義基礎設施或工具（例如 [Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)）
加載配置文件。

<!--
The scheduler is not aware of which profiles are loaded onto which Node, so the full set of profiles
must be loaded onto every Node.  An alternative approach is to add a Node label for each profile (or
class of profiles) on the Node, and use a
[node selector](/docs/concepts/scheduling-eviction/assign-pod-node/) to ensure the Pod is run on a
Node with the required profile.
-->
調度程序不知道哪些配置文件加載到哪個節點上，因此必須將全套配置文件加載到每個節點上。
另一種方法是爲節點上的每個配置文件（或配置文件類）添加節點標籤，
並使用[節點選擇器](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)確保
Pod 在具有所需配置文件的節點上運行。

<!--
## Authoring Profiles
-->
## 編寫配置文件 {#authoring-profiles}

<!--
Getting AppArmor profiles specified correctly can be a tricky business. Fortunately there are some
tools to help with that:
-->
獲得正確指定的 AppArmor 配置文件可能是一件棘手的事情。幸運的是，有一些工具可以幫助你做到這一點：

<!--
* `aa-genprof` and `aa-logprof` generate profile rules by monitoring an application's activity and
  logs, and admitting the actions it takes. Further instructions are provided by the
  [AppArmor documentation](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools).
* [bane](https://github.com/jfrazelle/bane) is an AppArmor profile generator for Docker that uses a
  simplified profile language.
-->
* `aa-genprof` 和 `aa-logprof`
  通過監視應用程序的活動和日誌並准許它所執行的操作來生成配置文件規則。
  [AppArmor 文檔](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools)提供了進一步的指導。
* [bane](https://github.com/jfrazelle/bane)
  是一個用於 Docker的 AppArmor 配置文件生成器，它使用一種簡化的畫像語言（profile language）。

<!--
To debug problems with AppArmor, you can check the system logs to see what, specifically, was
denied. AppArmor logs verbose messages to `dmesg`, and errors can usually be found in the system
logs or through `journalctl`. More information is provided in
[AppArmor failures](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures).
-->
想要調試 AppArmor 的問題，你可以檢查系統日誌，查看具體拒絕了什麼。
AppArmor 將詳細消息記錄到 `dmesg`，
錯誤通常可以在系統日誌中或通過 `journalctl` 找到。
更多詳細信息參見 [AppArmor 失敗](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures)。

<!--
## Specifying AppArmor confinement
-->
## 指定 AppArmor 限制   {#specifying-apparmor-confinement}

{{< caution >}}
<!--
Prior to Kubernetes v1.30, AppArmor was specified through annotations. Use the documentation version
selector to view the documentation with this deprecated API.
-->
在 Kubernetes v1.30 之前，AppArmor 是通過註解指定的。使用文檔版本選擇器查看包含此已棄用 API 的文檔。
{{< /caution >}}

<!--
### AppArmor profile within security context  {#appArmorProfile}
-->
### 安全上下文中的 AppArmor 配置文件   {#appArmorProfile}

<!--
You can specify the `appArmorProfile` on either a container's `securityContext` or on a Pod's
`securityContext`. If the profile is set at the pod level, it will be used as the default profile
for all containers in the pod (including init, sidecar, and ephemeral containers). If both a pod & container
AppArmor profile are set, the container's profile will be used.

An AppArmor profile has 2 fields:
-->
你可以在容器的 `securityContext` 或 Pod 的 `securityContext` 中設置 `appArmorProfile`。
如果在 Pod 級別設置配置文件，該配置將被用作 Pod 中所有容器（包括 Init、Sidecar 和臨時容器）的默認配置文件。
如果同時設置了 Pod 和容器 AppArmor 配置文件，則將使用容器的配置文件。

AppArmor 配置文件有 2 個字段：

<!--
`type` _(required)_ - indicates which kind of AppArmor profile will be applied. Valid options are:

`Localhost`
: a profile pre-loaded on the node (specified by `localhostProfile`).

`RuntimeDefault`
: the container runtime's default profile.

`Unconfined`
: no AppArmor enforcement.
-->
`type` **（必需）** - 指示將應用哪種 AppArmor 配置文件。有效選項是：

`Localhost`
: 節點上預加載的配置文件（由 `localhostProfile` 指定）。

`RuntimeDefault`
: 容器運行時的默認配置文件。

`Unconfined`
: 不強制執行 AppArmor。

<!--
`localhostProfile` - The name of a profile loaded on the node that should be used.
The profile must be preconfigured on the node to work.
This option must be provided if and only if the `type` is `Localhost`.
-->
`localhostProfile` - 在節點上加載的、應被使用的配置文件的名稱。
該配置文件必須在節點上預先配置才能工作。
當且僅當 `type` 是 `Localhost` 時，必須提供此選項。

## {{% heading "whatsnext" %}}

<!--
Additional resources:
-->
其他資源：

<!--
* [Quick guide to the AppArmor profile language](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [AppArmor core policy reference](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)
-->
* [Apparmor 配置文件語言快速指南](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [Apparmor 核心策略參考](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)
