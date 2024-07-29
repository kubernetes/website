---
title: 使用 AppArmor 限制容器对资源的访问
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
本页面向你展示如何在节点上加载 AppArmor 配置文件并在 Pod 中强制应用这些配置文件。
要了解有关 Kubernetes 如何使用 AppArmor 限制 Pod 的更多信息，请参阅
[Pod 和容器的 Linux 内核安全约束](/zh-cn/docs/concepts/security/linux-kernel-security-constraints/#apparmor)。

## {{% heading "objectives" %}}

<!--
* See an example of how to load a profile on a Node
* Learn how to enforce the profile on a Pod
* Learn how to check that the profile is loaded
* See what happens when a profile is violated
* See what happens when a profile cannot be loaded
-->
* 查看如何在节点上加载配置文件示例
* 了解如何在 Pod 上强制执行配置文件
* 了解如何检查配置文件是否已加载
* 查看违反配置文件时会发生什么
* 查看无法加载配置文件时会发生什么

## {{% heading "prerequisites" %}}

<!--
AppArmor is an optional kernel module and Kubernetes feature, so verify it is supported on your
Nodes before proceeding:
-->
AppArmor 是一个可选的内核模块和 Kubernetes 特性，因此请在继续之前验证你的节点是否支持它：

<!--
1. AppArmor kernel module is enabled -- For the Linux kernel to enforce an AppArmor profile, the
   AppArmor kernel module must be installed and enabled. Several distributions enable the module by
   default, such as Ubuntu and SUSE, and many others provide optional support. To check whether the
   module is enabled, check the `/sys/module/apparmor/parameters/enabled` file:
-->
1. AppArmor 内核模块已启用 —— 要使 Linux 内核强制执行 AppArmor 配置文件，
   必须安装并且启动 AppArmor 内核模块。默认情况下，有几个发行版支持该模块，
   如 Ubuntu 和 SUSE，还有许多发行版提供可选支持。要检查模块是否已启用，请检查
   `/sys/module/apparmor/parameters/enabled` 文件：

   ```shell
   cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   <!--
   The kubelet verifies that AppArmor is enabled on the host before admitting a pod with AppArmor
   explicitly configured.
   -->
   kubelet 会先验证主机上是否已启用 AppArmor，然后再接纳显式配置了 AppArmor 的 Pod。

<!--
1. Container runtime supports AppArmor -- All common Kubernetes-supported container
   runtimes should support AppArmor, including {{< glossary_tooltip term_id="cri-o" >}} and
   {{< glossary_tooltip term_id="containerd" >}}. Please refer to the corresponding runtime
   documentation and verify that the cluster fulfills the requirements to use AppArmor.
-->
2. 容器运行时支持 AppArmor —— 所有常见的 Kubernetes 支持的容器运行时都应该支持 AppArmor，
   包括 {{< glossary_tooltip term_id="cri-o" >}} 和 {{< glossary_tooltip term_id="containerd" >}}。
   请参考相应的运行时文档并验证集群是否满足使用 AppArmor 的要求。

<!--
1. Profile is loaded -- AppArmor is applied to a Pod by specifying an AppArmor profile that each
   container should be run with. If any of the specified profiles is not loaded in the
   kernel, the kubelet will reject the Pod. You can view which profiles are loaded on a
   node by checking the `/sys/kernel/security/apparmor/profiles` file. For example:
-->
3. 配置文件已加载 —— 通过指定每个容器应使用的 AppArmor 配置文件，
   AppArmor 会被应用到 Pod 上。如果所指定的配置文件未加载到内核，
   kubelet 将拒绝 Pod。
   通过检查 `/sys/kernel/security/apparmor/profiles` 文件，
   可以查看节点加载了哪些配置文件。例如:

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
   
   有关在节点上加载配置文件的详细信息，请参见[使用配置文件设置节点](#setting-up-nodes-with-profiles)。

<!-- lessoncontent -->

<!--
## Securing a Pod
-->
## 保护 Pod {#securing-a-pod}

{{< note >}}
<!--
Prior to Kubernetes v1.30, AppArmor was specified through annotations. Use the documentation version
selector to view the documentation with this deprecated API.
-->
在 Kubernetes v1.30 之前，AppArmor 是通过注解指定的。
使用文档版本选择器查看包含此已弃用 API 的文档。
{{< /note >}}

<!--
AppArmor profiles can be specified at the pod level or container level. The container AppArmor
profile takes precedence over the pod profile.
-->
AppArmor 配置文件可以在 Pod 级别或容器级别指定。容器
AppArmor 配置文件优先于 Pod 配置文件。

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
* `RuntimeDefault` 使用运行时的默认配置文件
* `Localhost` 使用主机上加载的配置文件（见下文）
* `Unconfined` 无需 AppArmor 即可运行

<!--
See [Specifying AppArmor Confinement](#specifying-apparmor-confinement) for full details on the AppArmor profile API.
-->
有关 AppArmor 配置文件 API 的完整详细信息，请参阅[指定 AppArmor 限制](#specifying-apparmor-confinement)。

<!--
To verify that the profile was applied, you can check that the container's root process is
running with the correct profile by examining its proc attr:
-->
要验证是否应用了配置文件，
你可以通过检查容器根进程的进程属性来检查该进程是否正在使用正确的配置文件运行：

```shell
kubectl exec <pod_name> -- cat /proc/1/attr/current
```

<!--
The output should look something like this:
-->
输出应如下所示：

 ```
 cri-containerd.apparmor.d (enforce)
 ```

<!--
You can also verify directly that the container's root process is running with the correct profile by checking its proc attr:
-->
你还可以通过检查容器的 proc attr，直接验证容器的根进程是否以正确的配置文件运行：

```shell
kubectl exec <pod_name> -- cat /proc/1/attr/current
```

```
k8s-apparmor-example-deny-write (enforce)
```

<!--
## Example
-->
## 举例 {#example}

<!--
*This example assumes you have already set up a cluster with AppArmor support.*
-->
**本例假设你已经设置了一个集群使用 AppArmor 支持。**

<!--
First, load the profile you want to use onto your Nodes. This profile blocks all file write operations:
-->
首先，将要使用的配置文件加载到节点上，该配置文件阻止所有文件写入操作：

```
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # 拒绝所有文件写入
  deny /** w,
}
```

<!--
The profile needs to loaded onto all nodes, since you don't know where the pod will be scheduled.
For this example we'll use SSH to install the profiles, but other approaches are
discussed in [Setting up nodes with profiles](#setting-up-nodes-with-profiles).
-->
由于不知道 Pod 将被调度到哪里，该配置文件需要加载到所有节点上。
在本例中，我们将使用 SSH 来安装概要文件，
但是在[使用配置文件设置节点](#setting-up-nodes-with-profiles)中讨论了其他方法。

<!--
# This example assumes that node names match host names, and are reachable via SSH.
-->
```shell
# 此示例假设节点名称与主机名称匹配，并且可通过 SSH 访问。
NODES=($(kubectl get nodes -o name))
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
接下来，运行一个带有拒绝写入配置文件的简单 “Hello AppArmor” Pod：

{{% code_sample file="pods/security/hello-apparmor.yaml" %}}

```shell
kubectl create -f hello-apparmor.yaml
```

<!--
You can verify that the container is actually running with that profile by checking its `/proc/1/attr/current`:
-->
你可以通过检查其 `/proc/1/attr/current` 来验证容器是否确实使用该配置文件运行：

```shell
kubectl exec hello-apparmor -- cat /proc/1/attr/current
```

<!--
The output should be:
-->
输出应该是：

```
k8s-apparmor-example-deny-write (enforce)
```

<!--
Finally, you can see what happens if you violate the profile by writing to a file:
-->
最后，你可以看到，如果你通过写入文件来违反配置文件会发生什么：

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
最后，看看如果你尝试指定尚未加载的配置文件会发生什么：

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
虽然 Pod 创建成功，但进一步检查会发现它陷入 pending 状态：

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
事件提供错误消息及其原因，具体措辞与运行时相关：

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
### 使用配置文件设置节点 {#setting-up-nodes-with-profiles}

<!--
Kubernetes {{< skew currentVersion >}} does not currently provide any built-in mechanisms for loading AppArmor profiles onto
Nodes. Profiles can be loaded through custom infrastructure or tools like the
[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator).
-->
Kubernetes {{< skew currentVersion >}} 目前不提供任何本地机制来将 AppArmor 配置文件加载到节点上。
可以通过自定义基础设施或工具（例如 [Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)）
加载配置文件。

<!--
The scheduler is not aware of which profiles are loaded onto which Node, so the full set of profiles
must be loaded onto every Node.  An alternative approach is to add a Node label for each profile (or
class of profiles) on the Node, and use a
[node selector](/docs/concepts/scheduling-eviction/assign-pod-node/) to ensure the Pod is run on a
Node with the required profile.
-->
调度程序不知道哪些配置文件加载到哪个节点上，因此必须将全套配置文件加载到每个节点上。
另一种方法是为节点上的每个配置文件（或配置文件类）添加节点标签，
并使用[节点选择器](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)确保
Pod 在具有所需配置文件的节点上运行。

<!--
## Authoring Profiles
-->
## 编写配置文件 {#authoring-profiles}

<!--
Getting AppArmor profiles specified correctly can be a tricky business. Fortunately there are some
tools to help with that:
-->
获得正确指定的 AppArmor 配置文件可能是一件棘手的事情。幸运的是，有一些工具可以帮助你做到这一点：

<!--
* `aa-genprof` and `aa-logprof` generate profile rules by monitoring an application's activity and
  logs, and admitting the actions it takes. Further instructions are provided by the
  [AppArmor documentation](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools).
* [bane](https://github.com/jfrazelle/bane) is an AppArmor profile generator for Docker that uses a
  simplified profile language.
-->
* `aa-genprof` 和 `aa-logprof`
  通过监视应用程序的活动和日志并准许它所执行的操作来生成配置文件规则。
  [AppArmor 文档](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools)提供了进一步的指导。
* [bane](https://github.com/jfrazelle/bane)
  是一个用于 Docker的 AppArmor 配置文件生成器，它使用一种简化的画像语言（profile language）。

<!--
To debug problems with AppArmor, you can check the system logs to see what, specifically, was
denied. AppArmor logs verbose messages to `dmesg`, and errors can usually be found in the system
logs or through `journalctl`. More information is provided in
[AppArmor failures](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures).
-->
想要调试 AppArmor 的问题，你可以检查系统日志，查看具体拒绝了什么。
AppArmor 将详细消息记录到 `dmesg`，
错误通常可以在系统日志中或通过 `journalctl` 找到。
更多详细信息参见 [AppArmor 失败](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures)。

<!--
## Specifying AppArmor confinement
-->
## 指定 AppArmor 限制   {#specifying-apparmor-confinement}

{{< caution >}}
<!--
Prior to Kubernetes v1.30, AppArmor was specified through annotations. Use the documentation version
selector to view the documentation with this deprecated API.
-->
在 Kubernetes v1.30 之前，AppArmor 是通过注解指定的。使用文档版本选择器查看包含此已弃用 API 的文档。
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
你可以在容器的 `securityContext` 或 Pod 的 `securityContext` 中设置 `appArmorProfile`。
如果在 Pod 级别设置配置文件，该配置将被用作 Pod 中所有容器（包括 Init、Sidecar 和临时容器）的默认配置文件。
如果同时设置了 Pod 和容器 AppArmor 配置文件，则将使用容器的配置文件。

AppArmor 配置文件有 2 个字段：

<!--
`type` _(required)_ - indicates which kind of AppArmor profile will be applied. Valid options are:

`Localhost`
: a profile pre-loaded on the node (specified by `localhostProfile`).

`RuntimeDefault`
: the container runtime's default profile.

`Unconfined`
: no AppArmor enforcement.
-->
`type` **（必需）** - 指示将应用哪种 AppArmor 配置文件。有效选项是：

`Localhost`
: 节点上预加载的配置文件（由 `localhostProfile` 指定）。

`RuntimeDefault`
: 容器运行时的默认配置文件。

`Unconfined`
: 不强制执行 AppArmor。

<!--
`localhostProfile` - The name of a profile loaded on the node that should be used.
The profile must be preconfigured on the node to work.
This option must be provided if and only if the `type` is `Localhost`.
-->
`localhostProfile` - 在节点上加载的、应被使用的配置文件的名称。
该配置文件必须在节点上预先配置才能工作。
当且仅当 `type` 是 `Localhost` 时，必须提供此选项。

## {{% heading "whatsnext" %}}

<!--
Additional resources:
-->
其他资源：

<!--
* [Quick guide to the AppArmor profile language](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [AppArmor core policy reference](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)
-->
* [Apparmor 配置文件语言快速指南](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [Apparmor 核心策略参考](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)
