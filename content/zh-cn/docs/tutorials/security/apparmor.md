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

{{< feature-state for_k8s_version="v1.4" state="beta" >}}

<!--
[AppArmor](https://apparmor.net/) is a Linux kernel security module that supplements the standard Linux user and group based
permissions to confine programs to a limited set of resources. AppArmor can be configured for any
application to reduce its potential attack surface and provide greater in-depth defense. It is
configured through profiles tuned to allow the access needed by a specific program or container,
such as Linux capabilities, network access, file permissions, etc. Each profile can be run in either
*enforcing* mode, which blocks access to disallowed resources, or *complain* mode, which only reports
violations.
-->
[AppArmor](https://apparmor.net/) 是一个 Linux 内核安全模块，
它补充了基于标准 Linux 用户和组的权限，将程序限制在一组有限的资源中。
AppArmor 可以配置为任何应用程序减少潜在的攻击面，并且提供更加深入的防御。
它通过调整配置文件进行配置，以允许特定程序或容器所需的访问，
如 Linux 权能字、网络访问、文件权限等。
每个配置文件都可以在 **强制（enforcing）**
模式（阻止访问不允许的资源）或 **投诉（complain）** 模式（仅报告冲突）下运行。

<!--
On Kubernetes, AppArmor can help you to run a more secure deployment by restricting what containers are allowed to
do, and/or provide better auditing through system logs. However, it is important to keep in mind
that AppArmor is not a silver bullet and can only do so much to protect against exploits in your
application code. It is important to provide good, restrictive profiles, and harden your
applications and cluster from other angles as well.
-->
在 Kubernetes 中，AppArmor 可以通过限制允许容器执行的操作，
和/或通过系统日志提供更好的审计来帮助你运行更安全的部署。
但是，重要的是要记住 AppArmor 不是灵丹妙药，
只能做部分事情来防止应用程序代码中的漏洞。
提供良好的限制性配置文件，并从其他角度强化你的应用程序和集群非常重要。

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
   The Kubelet verifies that AppArmor is enabled on the host before admitting a pod with AppArmor
   explicitly configured.
   -->
   kubelet 会先验证主机上是否已启用 AppArmor，然后再接纳显式配置了 AppArmor 的 Pod。

<!--
3. Container runtime supports AppArmor -- All common Kubernetes-supported container
   runtimes should support AppArmor, including {{< glossary_tooltip term_id="cri-o" >}} and
   {{< glossary_tooltip term_id="containerd" >}}. Please refer to the corresponding runtime
   documentation and verify that the cluster fulfills the requirements to use AppArmor.
-->
2. 容器运行时支持 AppArmor —— 所有常见的 Kubernetes 支持的容器运行时都应该支持 AppArmor，
   包括 {{< glossary_tooltip term_id="cri-o" >}} 和 {{< glossary_tooltip term_id="containerd" >}}。
   请参考相应的运行时文档并验证集群是否满足使用 AppArmor 的要求。

<!--
3. Profile is loaded -- AppArmor is applied to a Pod by specifying an AppArmor profile that each
   container should be run with. If any of the specified profiles is not loaded in the
   kernel, the Kubelet will reject the Pod. You can view which profiles are loaded on a
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
AppArmor is currently in beta, so options are specified as annotations. Once support graduates to
general availability, the annotations will be replaced with first-class fields.
-->
AppArmor 目前处于 Beta 阶段，因此选项以注解形式设定。
一旦 AppArmor 支持进入正式发布阶段，注解将被替换为一阶的资源字段。
{{< /note >}}

<!--
AppArmor profiles are specified *per-container*. To specify the AppArmor profile to run a Pod
container with, add an annotation to the Pod's metadata:
-->
AppArmor 配置文件是按**逐个容器**的形式来设置的。
要指定用来运行 Pod 容器的 AppArmor 配置文件，请向 Pod 的 metadata 添加注解：

```yaml
container.apparmor.security.beta.kubernetes.io/<container_name>: <profile_ref>
```

<!--
Where `<container_name>` is the name of the container to apply the profile to, and `<profile_ref>`
specifies the profile to apply. The `<profile_ref>` can be one of:
-->
`<container_name>` 的名称是配置文件所针对的容器的名称，`<profile_def>` 则设置要应用的配置文件。
`<profile_ref>` 可以是以下取值之一：

<!--
* `runtime/default` to apply the runtime's default profile
* `localhost/<profile_name>` to apply the profile loaded on the host with the name `<profile_name>`
* `unconfined` to indicate that no profiles will be loaded
-->
* `runtime/default` 应用运行时的默认配置
* `localhost/<profile_name>` 应用在主机上加载的名为 `<profile_name>` 的配置文件
* `unconfined` 表示不加载配置文件

<!--
See the [API Reference](#api-reference) for the full details on the annotation and profile name formats.
-->
有关注解和配置文件名称格式的详细信息，请参阅 [API 参考](#api-reference)。

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
 k8s-apparmor-example-deny-write (enforce)
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
First, load the profile you want to use onto your Nodes. This profile denies all file writes:
-->
首先，将要使用的配置文件加载到节点上，此配置文件拒绝所有文件写入：

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
  annotations:
    container.apparmor.security.beta.kubernetes.io/hello: localhost/k8s-apparmor-example-allow-write
spec:
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
Kubernetes does not currently provide any built-in mechanisms for loading AppArmor profiles onto
Nodes. Profiles can be loaded through custom infrastructure or tools like the
[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator).
-->
Kubernetes 目前不提供任何本地机制来将 AppArmor 配置文件加载到节点上。
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
## API Reference
-->
## API 参考 {#api-reference}

<!--
### Pod Annotation
-->
### Pod 注解 {#pod-annotation}

<!--
Specifying the profile a container will run with:
-->
指定容器将使用的配置文件：

<!--
- **key**: `container.apparmor.security.beta.kubernetes.io/<container_name>`
  Where `<container_name>` matches the name of a container in the Pod.
  A separate profile can be specified for each container in the Pod.
- **value**: a profile reference, described below
-->
- **键名**：`container.apparmor.security.beta.kubernetes.io/<container_name>`，
  其中 `<container_name>` 与 Pod 中某容器的名称匹配。
  可以为 Pod 中的每个容器指定单独的配置文件。
- **键值**：对配置文件的引用，如下所述

<!--
### Profile Reference
-->
### 配置文件引用 {#profile-reference}

<!--
- `runtime/default`: Refers to the default runtime profile.
  - Equivalent to not specifying a profile, except it still requires AppArmor to be enabled.
  - In practice, many container runtimes use the same OCI default profile, defined here:
    https://github.com/containers/common/blob/main/pkg/apparmor/apparmor_linux_template.go
- `localhost/<profile_name>`: Refers to a profile loaded on the node (localhost) by name.
  - The possible profile names are detailed in the
    [core policy reference](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Core_Policy_Reference#profile-names-and-attachment-specifications).
- `unconfined`: This effectively disables AppArmor on the container.
-->
- `runtime/default`：指默认运行时配置文件。
  - 等同于不指定配置文件，只是它仍然需要启用 AppArmor。
  - 实际上，许多容器运行时使用相同的 OCI 默认配置文件，在此处定义：
    https://github.com/containers/common/blob/main/pkg/apparmor/apparmor_linux_template.go
- `localhost/<profile_name>`：按名称引用加载到节点（localhost）上的配置文件。
  - 可能的配置文件名在[核心策略参考](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Core_Policy_Reference#profile-names-and-attachment-specifications)。
- `unconfined`：这相当于为容器禁用 AppArmor。

<!--
Any other profile reference format is invalid.
-->
任何其他配置文件引用格式无效。

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
