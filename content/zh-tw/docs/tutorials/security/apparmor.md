---
title: 使用 AppArmor 限制容器對資源的訪問
content_type: tutorial
weight: 10
---
<!--
title: Restrict a Container's Access to Resources with AppArmor
content_type: tutorial
weight: 10
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.4" state="beta" >}}

<!-- 
AppArmor is a Linux kernel security module that supplements the standard Linux user and group based
permissions to confine programs to a limited set of resources. AppArmor can be configured for any
application to reduce its potential attack surface and provide greater in-depth defense. It is
configured through profiles tuned to allow the access needed by a specific program or container,
such as Linux capabilities, network access, file permissions, etc. Each profile can be run in either
*enforcing* mode, which blocks access to disallowed resources, or *complain* mode, which only reports
violations. 
-->
AppArmor 是一個 Linux 核心安全模組，
它補充了基於標準 Linux 使用者和組的許可權，將程式限制在一組有限的資源中。
AppArmor 可以配置為任何應用程式減少潛在的攻擊面，並且提供更加深入的防禦。
它透過調整配置檔案進行配置，以允許特定程式或容器所需的訪問，
如 Linux 權能字、網路訪問、檔案許可權等。
每個配置檔案都可以在
*強制（enforcing）* 模式（阻止訪問不允許的資源）或
*投訴（complain）* 模式（僅報告衝突）下執行。

<!-- 
AppArmor can help you to run a more secure deployment by restricting what containers are allowed to
do, and/or provide better auditing through system logs. However, it is important to keep in mind
that AppArmor is not a silver bullet and can only do so much to protect against exploits in your
application code. It is important to provide good, restrictive profiles, and harden your
applications and cluster from other angles as well.
-->
AppArmor 可以透過限制允許容器執行的操作，
和/或透過系統日誌提供更好的審計來幫助你執行更安全的部署。
但是，重要的是要記住 AppArmor 不是靈丹妙藥，
只能做部分事情來防止應用程式程式碼中的漏洞。
提供良好的限制性配置檔案，並從其他角度強化你的應用程式和叢集非常重要。

## {{% heading "objectives" %}}

<!-- 
* See an example of how to load a profile on a node
* Learn how to enforce the profile on a Pod
* Learn how to check that the profile is loaded
* See what happens when a profile is violated
* See what happens when a profile cannot be loaded 
-->
* 檢視如何在節點上載入配置檔案示例
* 瞭解如何在 Pod 上強制執行配置檔案
* 瞭解如何檢查配置檔案是否已載入
* 檢視違反配置檔案時會發生什麼
* 檢視無法載入配置檔案時會發生什麼

## {{% heading "prerequisites" %}}

<!-- Make sure: -->
確保：

<!-- 
1. Kubernetes version is at least v1.4 -- Kubernetes support for AppArmor was added in
   v1.4. Kubernetes components older than v1.4 are not aware of the new AppArmor annotations, and
   will **silently ignore** any AppArmor settings that are provided. To ensure that your Pods are
   receiving the expected protections, it is important to verify the Kubelet version of your nodes:

   ```shell
   kubectl get nodes -o=jsonpath=$'{range .items[*]}{@.metadata.name}: {@.status.nodeInfo.kubeletVersion}\n{end}'
   ```
   ```
   gke-test-default-pool-239f5d02-gyn2: v1.4.0
   gke-test-default-pool-239f5d02-x1kf: v1.4.0
   gke-test-default-pool-239f5d02-xwux: v1.4.0
   ```
-->
1. Kubernetes 版本至少是 v1.4 —— AppArmor 在 Kubernetes v1.4 版本中才添加了對 AppArmor 的支援。
   早於 v1.4 版本的 Kubernetes 元件不知道新的 AppArmor 註解
   並且將會 **預設忽略** 提供的任何 AppArmor 設定。
   為了確保你的 Pod 能夠得到預期的保護，必須驗證節點的 Kubelet 版本：

   ```shell
   kubectl get nodes -o=jsonpath=$'{range .items[*]}{@.metadata.name}: {@.status.nodeInfo.kubeletVersion}\n{end}'
   ```
   ```
   gke-test-default-pool-239f5d02-gyn2: v1.4.0
   gke-test-default-pool-239f5d02-x1kf: v1.4.0
   gke-test-default-pool-239f5d02-xwux: v1.4.0
   ```

<!-- 
2. AppArmor kernel module is enabled -- For the Linux kernel to enforce an AppArmor profile, the
   AppArmor kernel module must be installed and enabled. Several distributions enable the module by
   default, such as Ubuntu and SUSE, and many others provide optional support. To check whether the
   module is enabled, check the `/sys/module/apparmor/parameters/enabled` file:

   ```shell
   cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   If the Kubelet contains AppArmor support (>= v1.4), it will refuse to run a Pod with AppArmor
   options if the kernel module is not enabled.

  {{< note >}}
  Ubuntu carries many AppArmor patches that have not been merged into the upstream Linux
  kernel, including patches that add additional hooks and features. Kubernetes has only been
  tested with the upstream version, and does not promise support for other features.
  {{< /note >}}
-->
2. AppArmor 核心模組已啟用 —— 要使 Linux 核心強制執行 AppArmor 配置檔案，
   必須安裝並且啟動 AppArmor 核心模組。預設情況下，有幾個發行版支援該模組，
   如 Ubuntu 和 SUSE，還有許多發行版提供可選支援。要檢查模組是否已啟用，請檢查
   `/sys/module/apparmor/parameters/enabled` 檔案：

   ```shell
   cat /sys/module/apparmor/parameters/enabled
   Y
   ```

   如果 Kubelet 包含 AppArmor 支援（>= v1.4），
   但是核心模組未啟用，它將拒絕執行帶有 AppArmor 選項的 Pod。

  {{< note >}}
  Ubuntu 攜帶了許多沒有合併到上游 Linux 核心中的 AppArmor 補丁，
  包括新增附加鉤子和特性的補丁。Kubernetes 只在上游版本中測試過，不承諾支援其他特性。
  {{< /note >}}

<!--
3. Container runtime supports AppArmor -- Currently all common Kubernetes-supported container
   runtimes should support AppArmor, like {{< glossary_tooltip term_id="docker">}},
   {{< glossary_tooltip term_id="cri-o" >}} or {{< glossary_tooltip term_id="containerd" >}}.
   Please refer to the corresponding runtime documentation and verify that the cluster fulfills
   the requirements to use AppArmor.
-->
3. 容器執行時支援 AppArmor —— 目前所有常見的 Kubernetes 支援的容器執行時都應該支援 AppArmor，
   像 {{< glossary_tooltip term_id="docker">}}，{{< glossary_tooltip term_id="cri-o" >}}
   或 {{< glossary_tooltip term_id="containerd" >}}。
   請參考相應的執行時文件並驗證叢集是否滿足使用 AppArmor 的要求。

<!-- 
4. Profile is loaded -- AppArmor is applied to a Pod by specifying an AppArmor profile that each
   container should be run with. If any of the specified profiles is not already loaded in the
   kernel, the Kubelet (>= v1.4) will reject the Pod. You can view which profiles are loaded on a
   node by checking the `/sys/kernel/security/apparmor/profiles` file. For example:

   ```shell
   ssh gke-test-default-pool-239f5d02-gyn2 "sudo cat /sys/kernel/security/apparmor/profiles | sort"
   ```
   ```
   apparmor-test-deny-write (enforce)
   apparmor-test-audit-write (enforce)
   docker-default (enforce)
   k8s-nginx (enforce)
   ```

   For more details on loading profiles on nodes, see
   [Setting up nodes with profiles](#setting-up-nodes-with-profiles).
-->
4. 配置檔案已載入 —— 透過指定每個容器都應使用的 AppArmor 配置檔案，
   AppArmor 會被應用到 Pod 上。如果指定的任何配置檔案尚未載入到核心，
   Kubelet（>= v1.4） 將拒絕 Pod。
   透過檢查 `/sys/kernel/security/apparmor/profiles` 檔案，
   可以檢視節點載入了哪些配置檔案。例如:

   ```shell
   ssh gke-test-default-pool-239f5d02-gyn2 "sudo cat /sys/kernel/security/apparmor/profiles | sort"
   ```
   ```
   apparmor-test-deny-write (enforce)
   apparmor-test-audit-write (enforce)
   docker-default (enforce)
   k8s-nginx (enforce)
   ```

   有關在節點上載入配置檔案的詳細資訊，請參見[使用配置檔案設定節點](#setting-up-nodes-with-profiles)。

<!-- 
As long as the Kubelet version includes AppArmor support (>= v1.4), the Kubelet will reject a Pod
with AppArmor options if any of the prerequisites are not met. You can also verify AppArmor support
on nodes by checking the node ready condition message (though this is likely to be removed in a
later release): 
-->
只要 Kubelet 版本包含 AppArmor 支援(>=v1.4)，
如果不滿足這些先決條件，Kubelet 將拒絕帶有 AppArmor 選項的 Pod。
你還可以透過檢查節點就緒狀況訊息來驗證節點上的 AppArmor 支援（儘管這可能會在以後的版本中刪除）：

```shell
kubectl get nodes -o=jsonpath=$'{range .items[*]}{@.metadata.name}: {.status.conditions[?(@.reason=="KubeletReady")].message}\n{end}'
```
```
gke-test-default-pool-239f5d02-gyn2: kubelet is posting ready status. AppArmor enabled
gke-test-default-pool-239f5d02-x1kf: kubelet is posting ready status. AppArmor enabled
gke-test-default-pool-239f5d02-xwux: kubelet is posting ready status. AppArmor enabled
```

<!-- lessoncontent -->

<!-- ## Securing a Pod -->
## 保護 Pod {#securing-a-pod}

{{< note >}}
<!-- 
AppArmor is currently in beta, so options are specified as annotations. Once support graduates to
general availability, the annotations will be replaced with first-class fields (more details in
[Upgrade path to GA](#upgrade-path-to-general-availability)).
-->
AppArmor 目前處於 Beta 階段，因此選項以註解形式設定。
一旦 AppArmor 支援進入正式釋出階段，註解將被替換為一階的資源欄位
（更多詳情參見[升級到 GA 的途徑](#upgrade-path-to-general-availability)）。
{{< /note >}}

<!--
AppArmor profiles are specified *per-container*. To specify the AppArmor profile to run a Pod
container with, add an annotation to the Pod's metadata: 
-->
AppArmor 配置檔案是按 *逐個容器* 的形式來設定的。
要指定用來執行 Pod 容器的 AppArmor 配置檔案，請向 Pod 的 metadata 添加註解：

```yaml
container.apparmor.security.beta.kubernetes.io/<container_name>: <profile_ref>
```

<!-- 
Where `<container_name>` is the name of the container to apply the profile to, and `<profile_ref>`
specifies the profile to apply. The `profile_ref` can be one of: 
-->
`<container_name>` 的名稱是配置檔案所針對的容器的名稱，`<profile_def>` 則設定要應用的配置檔案。
`<profile_ref>` 可以是以下取值之一：

<!-- 
* `runtime/default` to apply the runtime's default profile
* `localhost/<profile_name>` to apply the profile loaded on the host with the name `<profile_name>`
* `unconfined` to indicate that no profiles will be loaded 
-->
* `runtime/default` 應用執行時的預設配置
* `localhost/<profile_name>` 應用在主機上載入的名為 `<profile_name>` 的配置檔案
* `unconfined` 表示不載入配置檔案

<!-- 
See the [API Reference](#api-reference) for the full details on the annotation and profile name formats.
-->
有關注解和配置檔名稱格式的詳細資訊，請參閱[API 參考](#api-reference)。

<!-- 
Kubernetes AppArmor enforcement works by first checking that all the prerequisites have been
met, and then forwarding the profile selection to the container runtime for enforcement. If the
prerequisites have not been met, the Pod will be rejected, and will not run. 
-->
Kubernetes AppArmor 強制執行機制首先檢查所有先決條件都已滿足，
然後將所選的配置檔案轉發到容器執行時進行強制執行。
如果未滿足先決條件，Pod 將被拒絕，並且不會執行。

<!-- 
To verify that the profile was applied, you can look for the AppArmor security option listed in the container created event: 
-->
要驗證是否應用了配置檔案，可以在容器建立事件中查詢所列出的 AppArmor 安全選項：

```shell
kubectl get events | grep Created
```
```
22s        22s         1         hello-apparmor     Pod       spec.containers{hello}   Normal    Created     {kubelet e2e-test-stclair-node-pool-31nt}   Created container with docker id 269a53b202d3; Security:[seccomp=unconfined apparmor=k8s-apparmor-example-deny-write]
```

<!-- 
You can also verify directly that the container's root process is running with the correct profile by checking its proc attr: 
-->
你還可以透過檢查容器的 proc attr，直接驗證容器的根程序是否以正確的配置檔案執行：

```shell
kubectl exec <pod_name> cat /proc/1/attr/current
```
```
k8s-apparmor-example-deny-write (enforce)
```

<!-- ## Example -->
## 舉例 {#example}

<!-- *This example assumes you have already set up a cluster with AppArmor support.* -->
*本例假設你已經設定了一個叢集使用 AppArmor 支援。*

<!-- 
First, we need to load the profile we want to use onto our nodes. This profile denies all file writes: 
-->
首先，我們需要將要使用的配置檔案載入到節點上。配置檔案拒絕所有檔案寫入：

```shell
#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # Deny all file writes.
  deny /** w,
}
```

<!-- 
Since we don't know where the Pod will be scheduled, we'll need to load the profile on all our
nodes. For this example we'll use SSH to install the profiles, but other approaches are
discussed in [Setting up nodes with profiles](#setting-up-nodes-with-profiles). 
-->
由於我們不知道 Pod 將被排程到哪裡，我們需要在所有節點上載入配置檔案。
在本例中，我們將使用 SSH 來安裝概要檔案，
但是在[使用配置檔案設定節點](#setting-up-nodes-with-profiles)中討論了其他方法。

```shell
NODES=(
    # The SSH-accessible domain names of your nodes
    gke-test-default-pool-239f5d02-gyn2.us-central1-a.my-k8s
    gke-test-default-pool-239f5d02-x1kf.us-central1-a.my-k8s
    gke-test-default-pool-239f5d02-xwux.us-central1-a.my-k8s)
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

<!-- Next, we'll run a simple "Hello AppArmor" pod with the deny-write profile: -->
接下來，我們將執行一個帶有拒絕寫入配置檔案的簡單 “Hello AppArmor” Pod：

{{< codenew file="pods/security/hello-apparmor.yaml" >}}

```shell
kubectl create -f ./hello-apparmor.yaml
```

<!-- 
If we look at the pod events, we can see that the Pod container was created with the AppArmor
profile "k8s-apparmor-example-deny-write": 
-->
如果我們檢視 Pod 事件，我們可以看到 Pod 容器是用 AppArmor
配置檔案 “k8s-apparmor-example-deny-write” 所建立的：

```shell
kubectl get events | grep hello-apparmor
```
```
14s        14s         1         hello-apparmor   Pod                                Normal    Scheduled   {default-scheduler }                           Successfully assigned hello-apparmor to gke-test-default-pool-239f5d02-gyn2
14s        14s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Pulling     {kubelet gke-test-default-pool-239f5d02-gyn2}   pulling image "busybox"
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Pulled      {kubelet gke-test-default-pool-239f5d02-gyn2}   Successfully pulled image "busybox"
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Created     {kubelet gke-test-default-pool-239f5d02-gyn2}   Created container with docker id 06b6cd1c0989; Security:[seccomp=unconfined apparmor=k8s-apparmor-example-deny-write]
13s        13s         1         hello-apparmor   Pod       spec.containers{hello}   Normal    Started     {kubelet gke-test-default-pool-239f5d02-gyn2}   Started container with docker id 06b6cd1c0989
```

<!-- We can verify that the container is actually running with that profile by checking its proc attr: -->
我們可以透過檢查該配置檔案的 proc attr 來驗證容器是否實際使用該配置檔案執行：

```shell
kubectl exec hello-apparmor -- cat /proc/1/attr/current
```
```
k8s-apparmor-example-deny-write (enforce)
```

<!-- Finally, we can see what happens if we try to violate the profile by writing to a file: -->
最後，我們可以看到，如果我們嘗試透過寫入檔案來違反配置檔案會發生什麼：

```shell
kubectl exec hello-apparmor -- touch /tmp/test
```
```
touch: /tmp/test: Permission denied
error: error executing remote command: command terminated with non-zero exit code: Error executing in Docker Container: 1
```

<!-- To wrap up, let's look at what happens if we try to specify a profile that hasn't been loaded: -->
最後，讓我們看看如果我們試圖指定一個尚未載入的配置檔案會發生什麼：

```shell
kubectl create -f /dev/stdin <<EOF
```
```yaml
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
pod/hello-apparmor-2 created
```

```shell
kubectl describe pod hello-apparmor-2
```
```
Name:          hello-apparmor-2
Namespace:     default
Node:          gke-test-default-pool-239f5d02-x1kf/
Start Time:    Tue, 30 Aug 2016 17:58:56 -0700
Labels:        <none>
Annotations:   container.apparmor.security.beta.kubernetes.io/hello=localhost/k8s-apparmor-example-allow-write
Status:        Pending
Reason:        AppArmor
Message:       Pod Cannot enforce AppArmor: profile "k8s-apparmor-example-allow-write" is not loaded
IP:
Controllers:   <none>
Containers:
  hello:
    Container ID:
    Image:     busybox
    Image ID:
    Port:
    Command:
      sh
      -c
      echo 'Hello AppArmor!' && sleep 1h
    State:              Waiting
      Reason:           Blocked
    Ready:              False
    Restart Count:      0
    Environment:        <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-dnz7v (ro)
Conditions:
  Type          Status
  Initialized   True
  Ready         False
  PodScheduled  True
Volumes:
  default-token-dnz7v:
    Type:    Secret (a volume populated by a Secret)
    SecretName:    default-token-dnz7v
    Optional:   false
QoS Class:      BestEffort
Node-Selectors: <none>
Tolerations:    <none>
Events:
  FirstSeen    LastSeen    Count    From                        SubobjectPath    Type        Reason        Message
  ---------    --------    -----    ----                        -------------    --------    ------        -------
  23s          23s         1        {default-scheduler }                         Normal      Scheduled     Successfully assigned hello-apparmor-2 to e2e-test-stclair-node-pool-t1f5
  23s          23s         1        {kubelet e2e-test-stclair-node-pool-t1f5}             Warning        AppArmor    Cannot enforce AppArmor: profile "k8s-apparmor-example-allow-write" is not loaded
```

<!-- 
Note the pod status is Pending, with a helpful error message: `Pod Cannot enforce AppArmor: profile
"k8s-apparmor-example-allow-write" is not loaded`. An event was also recorded with the same message. 
-->
注意 Pod 呈現 Pending 狀態，並且顯示一條有用的錯誤資訊：
`Pod Cannot enforce AppArmor: profile "k8s-apparmor-example-allow-write" is not loaded`。
還用相同的訊息記錄了一個事件。

<!-- ## Administration -->
## 管理 {#administration}

<!-- ### Setting up nodes with profiles -->
### 使用配置檔案設定節點 {#setting-up-nodes-with-profiles}

<!-- 
Kubernetes does not currently provide any native mechanisms for loading AppArmor profiles onto
nodes. There are lots of ways to setup the profiles though, such as: 
-->
Kubernetes 目前不提供任何本地機制來將 AppArmor 配置檔案載入到節點上。
有很多方法可以設定配置檔案，例如：

<!-- 
* Through a [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) that runs a Pod on each node to
  ensure the correct profiles are loaded. An example implementation can be found
  [here](https://git.k8s.io/kubernetes/test/images/apparmor-loader).
* At node initialization time, using your node initialization scripts (e.g. Salt, Ansible, etc.) or
  image.
* By copying the profiles to each node and loading them through SSH, as demonstrated in the
  [Example](#example). 
-->
* 透過在每個節點上執行 Pod 的
  [DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/)來確保載入了正確的配置檔案。
  可以在[這裡](https://git.k8s.io/kubernetes/test/images/apparmor-loader)找到實現示例。
* 在節點初始化時，使用節點初始化指令碼(例如 Salt、Ansible 等)或映象。
* 透過將配置檔案複製到每個節點並透過 SSH 載入它們，如[示例](#example)。

<!-- 
The scheduler is not aware of which profiles are loaded onto which node, so the full set of profiles
must be loaded onto every node.  An alternative approach is to add a node label for each profile (or
class of profiles) on the node, and use a
[node selector](/docs/concepts/configuration/assign-pod-node/) to ensure the Pod is run on a
node with the required profile. 
-->
排程程式不知道哪些配置檔案載入到哪個節點上，因此必須將全套配置檔案載入到每個節點上。
另一種方法是為節點上的每個配置檔案（或配置檔案類）新增節點標籤，
並使用[節點選擇器](/zh-cn/docs/concepts/configuration/assign-pod-node/)確保
Pod 在具有所需配置檔案的節點上執行。

<!-- ### Restricting profiles with the PodSecurityPolicy -->
### 使用 PodSecurityPolicy 限制配置檔案 {#restricting-profiles-with-the-podsecuritypolicy}

{{< note >}}
<!-- 
PodSecurityPolicy is deprecated in Kubernetes v1.21, and will be removed in v1.25.
See [PodSecurityPolicy](/docs/concepts/security/pod-security-policy/) documentation for more information.
-->
PodSecurityPolicy 在 Kubernetes v1.21 版本中已被廢棄，將在 v1.25 版本移除。
檢視 [PodSecurityPolicy](/zh-cn/docs/concepts/security/pod-security-policy/) 文件獲取更多資訊。
{{< /note >}}

<!-- 
If the PodSecurityPolicy extension is enabled, cluster-wide AppArmor restrictions can be applied. To
enable the PodSecurityPolicy, the following flag must be set on the `apiserver`: 
-->
如果啟用了 PodSecurityPolicy 擴充套件，則可以應用叢集範圍的 AppArmor 限制。
要啟用 PodSecurityPolicy，必須在 `apiserver` 上設定以下標誌：

```
--enable-admission-plugins=PodSecurityPolicy[,others...]
```

<!-- The AppArmor options can be specified as annotations on the PodSecurityPolicy: -->
AppArmor 選項可以指定為 PodSecurityPolicy 上的註解：

```yaml
apparmor.security.beta.kubernetes.io/defaultProfileName: <profile_ref>
apparmor.security.beta.kubernetes.io/allowedProfileNames: <profile_ref>[,others...]
```

<!-- 
The default profile name option specifies the profile to apply to containers by default when none is
specified. The allowed profile names option specifies a list of profiles that Pod containers are
allowed to be run with. If both options are provided, the default must be allowed. The profiles are
specified in the same format as on containers. See the [API Reference](#api-reference) for the full
specification. 
-->
預設配置檔名選項指定預設情況下在未指定任何配置檔案時應用於容器的配置檔案。
所允許的配置檔名稱選項指定允許 Pod 容器執行期間所對應的配置檔案列表。
如果同時提供了這兩個選項，則必須允許預設值。
配置檔案的指定格式與容器上的相同。有關完整規範，請參閱 [API 參考](#api-reference)。

<!-- ### Disabling AppArmor -->
### 禁用 AppArmor {#disabling-apparmor}

<!-- If you do not want AppArmor to be available on your cluster, it can be disabled by a command-line flag: -->
如果你不希望 AppArmor 在叢集上可用，可以透過命令列標誌禁用它：

```
--feature-gates=AppArmor=false
```

<!-- 
When disabled, any Pod that includes an AppArmor profile will fail validation with a "Forbidden"
error. 
-->
禁用時，任何包含 AppArmor 配置檔案的 Pod 都將導致驗證失敗，且返回 “Forbidden” 錯誤。

{{<note>}}
<!--
Even if the Kubernetes feature is disabled, runtimes may still enforce the default profile. The
option to disable the AppArmor feature will be removed when AppArmor graduates to general
availability (GA).
-->
即使此 Kubernetes 特性被禁用，執行時仍可能強制執行預設配置檔案。
當 AppArmor 升級為正式版 (GA) 時，禁用 AppArmor 功能的選項將被刪除。

{{</note>}}


<!-- ## Authoring Profiles -->
## 編寫配置檔案 {#authoring-profiles}

<!-- 
Getting AppArmor profiles specified correctly can be a tricky business. Fortunately there are some
tools to help with that: 
-->
獲得正確指定的 AppArmor 配置檔案可能是一件棘手的事情。幸運的是，有一些工具可以幫助你做到這一點：

<!-- 
* `aa-genprof` and `aa-logprof` generate profile rules by monitoring an application's activity and
  logs, and admitting the actions it takes. Further instructions are provided by the
  [AppArmor documentation](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools).
* [bane](https://github.com/jfrazelle/bane) is an AppArmor profile generator for Docker that uses a
  simplified profile language. 
-->
* `aa-genprof` 和 `aa-logprof`
  透過監視應用程式的活動和日誌並准許它所執行的操作來生成配置檔案規則。
  [AppArmor 文件](https://gitlab.com/apparmor/apparmor/wikis/Profiling_with_tools)提供了進一步的指導。
* [bane](https://github.com/jfrazelle/bane)
  是一個用於 Docker的 AppArmor 配置檔案生成器，它使用一種簡化的畫像語言（profile language）

<!-- 
To debug problems with AppArmor, you can check the system logs to see what, specifically, was
denied. AppArmor logs verbose messages to `dmesg`, and errors can usually be found in the system
logs or through `journalctl`. More information is provided in
[AppArmor failures](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures). 
-->
想要除錯 AppArmor 的問題，你可以檢查系統日誌，檢視具體拒絕了什麼。
AppArmor 將詳細訊息記錄到 `dmesg`，
錯誤通常可以在系統日誌中或透過 `journalctl` 找到。
更多詳細資訊見 [AppArmor 失敗](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Failures)。

<!-- ## API Reference -->
## API 參考 {#api-reference}

<!-- ### Pod Annotation -->
### Pod 註解 {#pod-annotation}

<!-- Specifying the profile a container will run with: -->
指定容器將使用的配置檔案：

<!-- 
- **key**: `container.apparmor.security.beta.kubernetes.io/<container_name>`
  Where `<container_name>` matches the name of a container in the Pod.
  A separate profile can be specified for each container in the Pod.
- **value**: a profile reference, described below 
-->
- **鍵名**: `container.apparmor.security.beta.kubernetes.io/<container_name>`
  ，其中 `<container_name>` 與 Pod 中某容器的名稱匹配。
  可以為 Pod 中的每個容器指定單獨的配置檔案。
- **鍵值**: 對配置檔案的引用，如下所述

<!-- ### Profile Reference -->
### 配置檔案引用 {#profile-reference}

<!-- 
- `runtime/default`: Refers to the default runtime profile.
  - Equivalent to not specifying a profile (without a PodSecurityPolicy default), except it still
    requires AppArmor to be enabled.
  - In practice, many container runtimes use the same OCI default profile, defined here:
    https://github.com/containers/common/blob/main/pkg/apparmor/apparmor_linux_template.go
- `localhost/<profile_name>`: Refers to a profile loaded on the node (localhost) by name.
  - The possible profile names are detailed in the
    [core policy reference](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Core_Policy_Reference#profile-names-and-attachment-specifications).
- `unconfined`: This effectively disables AppArmor on the container. 
-->
- `runtime/default`: 指預設執行時配置檔案。
  - 等同於不指定配置檔案（沒有 PodSecurityPolicy 預設值），只是它仍然需要啟用 AppArmor。
  - 實際上，許多容器執行時使用相同的 OCI 預設配置檔案，在此處定義：
    https://github.com/containers/common/blob/main/pkg/apparmor/apparmor_linux_template.go
- `localhost/<profile_name>`: 按名稱引用載入到節點（localhost）上的配置檔案。
  - 可能的配置檔名在[核心策略參考](https://gitlab.com/apparmor/apparmor/wikis/AppArmor_Core_Policy_Reference#profile-names-and-attachment-specifications)。
- `unconfined`: 這相當於為容器禁用 AppArmor。

<!-- Any other profile reference format is invalid. -->
任何其他配置檔案引用格式無效。

<!-- ### PodSecurityPolicy Annotations -->
### PodSecurityPolicy 註解 {#podsecuritypolicy-annotations}

<!-- Specifying the default profile to apply to containers when none is provided: -->
指定在未提供容器時應用於容器的預設配置檔案：

<!-- 
* **key**: `apparmor.security.beta.kubernetes.io/defaultProfileName`
* **value**: a profile reference, described above 
-->
* **鍵名**: `apparmor.security.beta.kubernetes.io/defaultProfileName`
* **鍵值**: 如上述檔案參考所述

<!-- Specifying the list of profiles Pod containers is allowed to specify: -->
上面描述的指定配置檔案，Pod 容器列表的配置檔案引用允許指定：

<!-- 
* **key**: `apparmor.security.beta.kubernetes.io/allowedProfileNames`
* **value**: a comma-separated list of profile references (described above)
  - Although an escaped comma is a legal character in a profile name, it cannot be explicitly
    allowed here. 
-->
* **鍵名**: `apparmor.security.beta.kubernetes.io/allowedProfileNames`
* **鍵值**: 配置檔案引用的逗號分隔列表（如上所述）
  - 儘管轉義逗號是配置檔名中的合法字元，但此處不能顯式允許。

## {{% heading "whatsnext" %}}

<!-- Additional resources: -->
其他資源：

<!-- 
* [Quick guide to the AppArmor profile language](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [AppArmor core policy reference](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout) 
-->
* [Apparmor 配置檔案語言快速指南](https://gitlab.com/apparmor/apparmor/wikis/QuickProfileLanguage)
* [Apparmor 核心策略參考](https://gitlab.com/apparmor/apparmor/wikis/Policy_Layout)
