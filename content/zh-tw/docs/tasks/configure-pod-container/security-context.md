---
title: 爲 Pod 或容器設定安全上下文
content_type: task
weight: 110
---
<!--
reviewers:
- erictune
- mikedanese
- thockin
title: Configure a Security Context for a Pod or Container
content_type: task
weight: 110
-->

<!-- overview -->

<!--
A security context defines privilege and access control settings for
a Pod or Container. Security context settings include, but are not limited to:

* Discretionary Access Control: Permission to access an object, like a file, is based on
  [user ID (UID) and group ID (GID)](https://wiki.archlinux.org/index.php/users_and_groups).

* [Security Enhanced Linux (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux):
  Objects are assigned security labels.

* Running as privileged or unprivileged.

* [Linux Capabilities](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/):
  Give a process some privileges, but not all the privileges of the root user.
-->
安全上下文（Security Context）定義 Pod 或 Container 的特權與訪問控制設置。
安全上下文包括但不限於：

* 自主訪問控制（Discretionary Access Control）：
  基於[使用者 ID（UID）和組 ID（GID）](https://wiki.archlinux.org/index.php/users_and_groups)
  來判定對對象（例如檔案）的訪問權限。

* [安全性增強的 Linux（SELinux）](https://zh.wikipedia.org/wiki/%E5%AE%89%E5%85%A8%E5%A2%9E%E5%BC%BA%E5%BC%8FLinux)：
  爲對象賦予安全性標籤。

* 以特權模式或者非特權模式運行。

* [Linux 權能](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/): 
  爲進程賦予 root 使用者的部分特權而非全部特權。

<!--
* [AppArmor](/docs/tutorials/security/apparmor/):
  Use program profiles to restrict the capabilities of individual programs.

* [Seccomp](/docs/tutorials/security/seccomp/): Filter a process's system calls.

* `allowPrivilegeEscalation`: Controls whether a process can gain more privileges than
  its parent process. This bool directly controls whether the
  [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)
  flag gets set on the container process.
  `allowPrivilegeEscalation` is always true when the container:

  - is run as privileged, or
  - has `CAP_SYS_ADMIN`

* `readOnlyRootFilesystem`: Mounts the container's root filesystem as read-only.
-->
* [AppArmor](/zh-cn/docs/tutorials/security/apparmor/)：使用程式設定來限制個別程式的權能。

* [Seccomp](/zh-cn/docs/tutorials/security/seccomp/)：過濾進程的系統調用。

* `allowPrivilegeEscalation`：控制進程是否可以獲得超出其父進程的特權。
  此布爾值直接控制是否爲容器進程設置
  [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)標誌。
  當容器滿足一下條件之一時，`allowPrivilegeEscalation` 總是爲 true：

  - 以特權模式運行，或者
  - 具有 `CAP_SYS_ADMIN` 權能

* `readOnlyRootFilesystem`：以只讀方式加載容器的根檔案系統。

<!--
The above bullets are not a complete set of security context settings -- please see
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
for a comprehensive list.
-->
以上條目不是安全上下文設置的完整列表 -- 請參閱
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
瞭解其完整列表。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Set the security context for a Pod

To specify security settings for a Pod, include the `securityContext` field
in the Pod specification. The `securityContext` field is a
[PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core) object.
The security settings that you specify for a Pod apply to all Containers in the Pod.
Here is a configuration file for a Pod that has a `securityContext` and an `emptyDir` volume:
-->
## 爲 Pod 設置安全性上下文   {#set-the-security-context-for-a-pod}

要爲 Pod 設置安全性設置，可在 Pod 規約中包含 `securityContext` 字段。`securityContext` 字段值是一個
[PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)
對象。你爲 Pod 所設置的安全性設定會應用到 Pod 中所有 Container 上。
下面是一個 Pod 的設定檔案，該 Pod 定義了 `securityContext` 和一個 `emptyDir` 卷：

{{% code_sample file="pods/security/security-context.yaml" %}}

<!--
In the configuration file, the `runAsUser` field specifies that for any Containers in
the Pod, all processes run with user ID 1000. The `runAsGroup` field specifies the primary group ID of 3000 for
all processes within any containers of the Pod. If this field is omitted, the primary group ID of the containers
will be root(0). Any files created will also be owned by user 1000 and group 3000 when `runAsGroup` is specified.
Since `fsGroup` field is specified, all processes of the container are also part of the supplementary group ID 2000.
The owner for volume `/data/demo` and any files created in that volume will be Group ID 2000.
Additionally, when the `supplementalGroups` field is specified, all processes of the container are also part of the
specified groups. If this field is omitted, it means empty.

Create the Pod:
-->
在設定檔案中，`runAsUser` 字段指定 Pod 中的所有容器內的進程都使用使用者 ID 1000
來運行。`runAsGroup` 字段指定所有容器中的進程都以主組 ID 3000 來運行。
如果忽略此字段，則容器的主組 ID 將是 root（0）。
當 `runAsGroup` 被設置時，所有創建的檔案也會劃歸使用者 1000 和組 3000。
由於 `fsGroup` 被設置，容器中所有進程也會是附組 ID 2000 的一部分。
卷 `/data/demo` 及在該卷中創建的任何檔案的屬主都會是組 ID 2000。
此外，當 `supplementalGroups` 字段被指定時，容器的所有進程也會成爲所指定的組的一部分。
如果此字段被省略，則表示爲空。

創建該 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context.yaml
```

<!--
Verify that the Pod's Container is running:
-->
檢查 Pod 的容器處於運行狀態：

```shell
kubectl get pod security-context-demo
```

<!--
Get a shell to the running Container:
-->
開啓一個 Shell 進入到運行中的容器：

```shell
kubectl exec -it security-context-demo -- sh
```

<!--
In your shell, list the running processes:
-->
在你的 Shell 中，列舉運行中的進程：

```shell
ps
```

<!--
The output shows that the processes are running as user 1000, which is the value of `runAsUser`:
-->
輸出顯示進程以使用者 1000 運行，即 `runAsUser` 所設置的值：

```none
PID   USER     TIME  COMMAND
    1 1000      0:00 sleep 1h
    6 1000      0:00 sh
...
```

<!--
In your shell, navigate to `/data`, and list the one directory:
-->
在你的 Shell 中，進入 `/data` 目錄列舉其內容：

```shell
cd /data
ls -l
```

<!--
The output shows that the `/data/demo` directory has group ID 2000, which is
the value of `fsGroup`.
-->
輸出顯示 `/data/demo` 目錄的組 ID 爲 2000，即 `fsGroup` 的設置值：

```none
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

<!--
In your shell, navigate to `/data/demo`, and create a file:
-->
在你的 Shell 中，進入到 `/data/demo` 目錄下創建一個檔案：

```shell
cd demo
echo hello > testfile
```

<!--
List the file in the `/data/demo` directory:
-->
列舉 `/data/demo` 目錄下的檔案：

```shell
ls -l
```

<!--
The output shows that `testfile` has group ID 2000, which is the value of `fsGroup`.
-->
輸出顯示 `testfile` 的組 ID 爲 2000，也就是 `fsGroup` 所設置的值：

```none
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

<!--
Run the following command:
-->
運行下面的命令：

```shell
id
```

<!--
The output is similar to this:
-->
輸出類似於：

```none
uid=1000 gid=3000 groups=2000,3000,4000
```

<!--
From the output, you can see that `gid` is 3000 which is same as the `runAsGroup` field.
If the `runAsGroup` was omitted, the `gid` would remain as 0 (root) and the process will
be able to interact with files that are owned by the root(0) group and groups that have
the required group permissions for the root (0) group. You can also see that `groups`
contains the group IDs which are specified by `fsGroup` and `supplementalGroups`,
in addition to `gid`.

Exit your shell:
-->
從輸出中你會看到 `gid` 值爲 3000，也就是 `runAsGroup` 字段的值。
如果 `runAsGroup` 被忽略，則 `gid` 會取值 0（root），而進程就能夠與 root
使用者組所擁有以及要求 root 使用者組訪問權限的檔案交互。
你還可以看到，除了 `gid` 之外，`groups` 還包含了由 `fsGroup` 和 `supplementalGroups` 指定的組 ID。

退出你的 Shell：

```shell
exit
```

<!--
### Implicit group memberships defined in `/etc/group` in the container image

By default, kubernetes merges group information from the Pod with information defined in `/etc/group` in the container image.
-->
### 容器映像檔內 `/etc/group` 中定義的隱式組成員身份

預設情況下，Kubernetes 會將 Pod 中的組資訊與容器映像檔內 `/etc/group` 中定義的資訊合併。

{{% code_sample file="pods/security/security-context-5.yaml" %}}

<!--
This Pod security context contains `runAsUser`, `runAsGroup` and `supplementalGroups`.
However, you can see that the actual supplementary groups attached to the container process
will include group IDs which come from `/etc/group` in the container image.

Create the Pod:
-->
此 Pod 的安全上下文包含 `runAsUser`、`runAsGroup` 和 `supplementalGroups`。  
然而，你可以看到，掛接到容器進程的實際附加組將包括來自容器映像檔中 `/etc/group` 的組 ID。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-5.yaml
```

<!--
Verify that the Pod's Container is running:
-->
驗證 Pod 的 Container 正在運行：

```shell
kubectl get pod security-context-demo
```

<!--
Get a shell to the running Container:
-->
打開一個 Shell 進入正在運行的 Container：

```shell
kubectl exec -it security-context-demo -- sh
```

<!--
Check the process identity:
-->
檢查進程身份：

```shell
id
```

<!--
The output is similar to this:
-->
輸出類似於：

```none
uid=1000 gid=3000 groups=3000,4000,50000
```

<!--
You can see that `groups` includes group ID `50000`. This is because the user (`uid=1000`),
which is defined in the image, belongs to the group (`gid=50000`), which is defined in `/etc/group`
inside the container image.

Check the `/etc/group` in the container image:
-->
你可以看到 `groups` 包含組 ID `50000`。
這是因爲映像檔中定義的使用者（`uid=1000`）屬於在容器映像檔內 `/etc/group` 中定義的組（`gid=50000`）。

檢查容器映像檔中的 `/etc/group`：

```shell
cat /etc/group
```

<!--
You can see that uid `1000` belongs to group `50000`.
-->
你可以看到 uid `1000` 屬於組 `50000`。

```none
...
user-defined-in-image:x:1000:
group-defined-in-image:x:50000:user-defined-in-image
```

<!--
Exit your shell:
-->
退出你的 Shell：

```shell
exit
```

{{<note>}}
<!--
_Implicitly merged_ supplementary groups may cause security problems particularly when accessing
the volumes (see [kubernetes/kubernetes#112879](https://issue.k8s.io/112879) for details).
If you want to avoid this. Please see the below section.
-->
**隱式合併的**附加組可能會導致安全問題，
特別是在訪問卷時（有關細節請參見 [kubernetes/kubernetes#112879](https://issue.k8s.io/112879)）。  
如果你想避免這種問題，請查閱以下章節。
{{</note>}}

<!--
## Configure fine-grained SupplementalGroups control for a Pod {#supplementalgroupspolicy}
-->
## 設定 Pod 的細粒度 SupplementalGroups 控制   {#supplementalgroupspolicy}

{{< feature-state feature_gate_name="SupplementalGroupsPolicy" >}}

<!--
This feature can be enabled by setting the `SupplementalGroupsPolicy`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) for kubelet and
kube-apiserver, and setting the `.spec.securityContext.supplementalGroupsPolicy` field for a pod.

The `supplementalGroupsPolicy` field defines the policy for calculating the
supplementary groups for the container processes in a pod. There are two valid
values for this field:
-->
通過爲 kubelet 和 kube-apiserver 設置 `SupplementalGroupsPolicy`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
併爲 Pod 設置 `.spec.securityContext.supplementalGroupsPolicy` 字段，此特性可以被啓用。

`supplementalGroupsPolicy` 字段爲 Pod 中的容器進程定義了計算附加組的策略。
此字段有兩個有效值：

<!--
* `Merge`: The group membership defined in `/etc/group` for the container's primary user will be merged.
  This is the default policy if not specified.

* `Strict`: Only group IDs in `fsGroup`, `supplementalGroups`, or `runAsGroup` fields 
  are attached as the supplementary groups of the container processes.
  This means no group membership from `/etc/group` for the container's primary user will be merged.
-->
* `Merge`：爲容器的主使用者在 `/etc/group` 中定義的組成員身份將被合併。
  如果不指定，這就是預設策略。

* `Strict`：僅將 `fsGroup`、`supplementalGroups` 或 `runAsGroup`
  字段中的組 ID 掛接爲容器進程的附加組。這意味着容器主使用者在 `/etc/group` 中的組成員身份將不會被合併。

<!--
When the feature is enabled, it also exposes the process identity attached to the first container process
in `.status.containerStatuses[].user.linux` field. It would be useful for detecting if
implicit group ID's are attached.
-->
當此特性被啓用時，它還會在 `.status.containerStatuses[].user.linux`
字段中暴露掛接到第一個容器進程的進程身份。這對於檢測是否掛接了隱式組 ID 非常有用。

{{% code_sample file="pods/security/security-context-6.yaml" %}}

<!--
This pod manifest defines `supplementalGroupsPolicy=Strict`. You can see that no group memberships
defined in `/etc/group` are merged to the supplementary groups for container processes.

Create the Pod:
-->
此 Pod 清單定義了 `supplementalGroupsPolicy=Strict`。
你可以看到沒有將 `/etc/group` 中定義的組成員身份合併到容器進程的附加組中。

創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-6.yaml
```

<!--
Verify that the Pod's Container is running:
-->
驗證 Pod 的 Container 正在運行：

```shell
kubectl get pod security-context-demo
```

<!--
Check the process identity:
-->
檢查進程身份：

```shell
kubectl exec -it security-context-demo -- id
```

<!--
The output is similar to this:
-->
輸出類似於：

```none
uid=1000 gid=3000 groups=3000,4000
```

<!--
See the Pod's status:
-->
查看 Pod 的狀態：

```shell
kubectl get pod security-context-demo -o yaml
```

<!--
You can see that the `status.containerStatuses[].user.linux` field exposes the process identity
attached to the first container process.
-->
你可以看到 `status.containerStatuses[].user.linux` 字段暴露了掛接到第一個容器進程的進程身份。

```none
...
status:
  containerStatuses:
  - name: sec-ctx-demo
    user:
      linux:
        gid: 3000
        supplementalGroups:
        - 3000
        - 4000
        uid: 1000
...
```

{{<note>}}
<!--
Please note that the values in the `status.containerStatuses[].user.linux` field is _the first attached_
process identity to the first container process in the container. If the container has sufficient privilege
to make system calls related to process identity
(e.g. [`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html),
[`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html) or
[`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html), etc.),
the container process can change its identity. Thus, the _actual_ process identity will be dynamic.
-->
請注意，`status.containerStatuses[].user.linux` 字段的值是**第一個掛接到**容器中第一個容器進程的進程身份。
如果容器具有足夠的權限來進行與進程身份相關的系統調用
（例如 [`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html)、
[`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html) 或
[`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html) 等），
則容器進程可以更改其身份。因此，**實際**進程身份將是動態的。
{{</note>}}

<!--
### Implementations {#implementations-supplementalgroupspolicy}
-->
### 實現   {#implementations-supplementalgroupspolicy}

{{% thirdparty-content %}}

<!--
The following container runtimes are known to support fine-grained SupplementalGroups control.

CRI-level:
- [containerd](https://containerd.io/), since v2.0
- [CRI-O](https://cri-o.io/), since v1.31

You can see if the feature is supported in the Node status.
-->
已知以下容器運行時支持細粒度的 SupplementalGroups 控制。

CRI 級別：

- [containerd](https://containerd.io/)，自 v2.0 起
- [CRI-O](https://cri-o.io/)，自 v1.31 起

你可以在 Node 狀態中查看此特性是否受支持。

```yaml
apiVersion: v1
kind: Node
...
status:
  features:
    supplementalGroupsPolicy: true
```

{{<note>}}
<!--
At this alpha release(from v1.31 to v1.32), when a pod with `SupplementalGroupsPolicy=Strict` are scheduled to a node that does NOT support this feature(i.e. `.status.features.supplementalGroupsPolicy=false`), the pod's supplemental groups policy falls back to the `Merge` policy _silently_.
-->
在這個 Alpha 版本（從 v1.31 到 v1.32）中，當一個帶有
`SupplementalGroupsPolicy=Strict` 的 Pod
被調度到不支持此功能的節點上（即 `.status.features.supplementalGroupsPolicy=false`），
Pod 的補充組策略會**靜默地**回退到 `Merge` 策略。

<!--
However, since the beta release (v1.33), to enforce the policy more strictly, __such pod creation will be rejected by kubelet because the node cannot ensure the specified policy__. When your pod is rejected, you will see warning events with `reason=SupplementalGroupsPolicyNotSupported` like below:
-->
然而，自從 Beta 版本（v1.33）以來，爲了更嚴格地實施該策略，**此類
Pod 創建將被 kubelet 拒絕，因爲節點無法確保指定的策略**。
當你的 Pod 被拒絕時，你將會看到帶有 `reason=SupplementalGroupsPolicyNotSupported`
的警告事件，如下所示：

```yaml
apiVersion: v1
kind: Event
...
type: Warning
reason: SupplementalGroupsPolicyNotSupported
message: "SupplementalGroupsPolicy=Strict is not supported in this node"
involvedObject:
  apiVersion: v1
  kind: Pod
  ...
```
{{</note>}}

<!--
## Configure volume permission and ownership change policy for Pods
-->
## 爲 Pod 設定卷訪問權限和屬主變更策略    {#configure-volume-permission-and-ownership-change-policy-for-pods}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

<!--
By default, Kubernetes recursively changes ownership and permissions for the contents of each
volume to match the `fsGroup` specified in a Pod's `securityContext` when that volume is
mounted.
For large volumes, checking and changing ownership and permissions can take a lot of time,
slowing Pod startup. You can use the `fsGroupChangePolicy` field inside a `securityContext`
to control the way that Kubernetes checks and manages ownership and permissions
for a volume.
-->
預設情況下，Kubernetes 在掛載一個卷時，會遞歸地更改每個卷中的內容的屬主和訪問權限，
使之與 Pod 的 `securityContext` 中指定的 `fsGroup` 匹配。
對於較大的資料卷，檢查和變更屬主與訪問權限可能會花費很長時間，降低 Pod 啓動速度。
你可以在 `securityContext` 中使用 `fsGroupChangePolicy` 字段來控制 Kubernetes
檢查和管理卷屬主和訪問權限的方式。

<!--
**fsGroupChangePolicy** -  `fsGroupChangePolicy` defines behavior for changing ownership
  and permission of the volume before being exposed inside a Pod.
  This field only applies to volume types that support `fsGroup` controlled ownership and permissions.
  This field has two possible values:

* _OnRootMismatch_: Only change permissions and ownership if the permission and the ownership of
  root directory does not match with expected permissions of the volume.
  This could help shorten the time it takes to change ownership and permission of a volume.
* _Always_: Always change permission and ownership of the volume when volume is mounted.

For example:
-->
**fsGroupChangePolicy** - `fsGroupChangePolicy` 定義在卷被暴露給 Pod 內部之前對其
內容的屬主和訪問許可進行變更的行爲。此字段僅適用於那些支持使用 `fsGroup` 來
控制屬主與訪問權限的卷類型。此字段的取值可以是：

* `OnRootMismatch`：只有根目錄的屬主與訪問權限與卷所期望的權限不一致時，
  才改變其中內容的屬主和訪問權限。這一設置有助於縮短更改卷的屬主與訪問
  權限所需要的時間。
* `Always`：在掛載卷時總是更改卷中內容的屬主和訪問權限。

例如：

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```

<!--
This field has no effect on ephemeral volume types such as
[`secret`](/docs/concepts/storage/volumes/#secret),
[`configMap`](/docs/concepts/storage/volumes/#configmap),
and [`emptyDir`](/docs/concepts/storage/volumes/#emptydir).
-->
{{< note >}}
此字段對於 [`secret`](/zh-cn/docs/concepts/storage/volumes/#secret)、
[`configMap`](/zh-cn/docs/concepts/storage/volumes/#configmap)
和 [`emptyDir`](/zh-cn/docs/concepts/storage/volumes/#emptydir)
這類臨時性儲存無效。
{{< /note >}}

<!--
## Delegating volume permission and ownership change to CSI driver
-->
## 將卷權限和所有權更改委派給 CSI 驅動程式
{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
If you deploy a [Container Storage Interface (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md)
driver which supports the `VOLUME_MOUNT_GROUP` `NodeServiceCapability`, the
process of setting file ownership and permissions based on the
`fsGroup` specified in the `securityContext` will be performed by the CSI driver
instead of Kubernetes. In this case, since Kubernetes doesn't perform any
ownership and permission change, `fsGroupChangePolicy` does not take effect, and
as specified by CSI, the driver is expected to mount the volume with the
provided `fsGroup`, resulting in a volume that is readable/writable by the
`fsGroup`.
-->
如果你部署了一個[容器儲存介面 (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md)
驅動，而該驅動支持 `VOLUME_MOUNT_GROUP` `NodeServiceCapability`，
在 `securityContext` 中指定 `fsGroup` 來設置檔案所有權和權限的過程將由 CSI
驅動而不是 Kubernetes 來執行。在這種情況下，由於 Kubernetes 不執行任何所有權和權限更改，
`fsGroupChangePolicy` 不會生效，並且按照 CSI 的規定，CSI 驅動應該使用所指定的
`fsGroup` 來掛載卷，從而生成了一個對 `fsGroup` 可讀/可寫的卷.

<!--
## Set the security context for a Container

To specify security settings for a Container, include the `securityContext` field
in the Container manifest. The `securityContext` field is a
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core) object.
Security settings that you specify for a Container apply only to
the individual Container, and they override settings made at the Pod level when
there is overlap. Container settings do not affect the Pod's Volumes.

Here is the configuration file for a Pod that has one Container. Both the Pod
and the Container have a `securityContext` field:
-->
## 爲 Container 設置安全性上下文  {#set-the-security-context-for-a-container}

若要爲 Container 設置安全性設定，可以在 Container 清單中包含 `securityContext` 
字段。`securityContext` 字段的取值是一個
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
對象。你爲 Container 設置的安全性設定僅適用於該容器本身，並且所指定的設置在與
Pod 層面設置的內容發生重疊時，會重寫 Pod 層面的設置。Container 層面的設置不會影響到 Pod 的卷。

下面是一個 Pod 的設定檔案，其中包含一個 Container。Pod 和 Container 都有
`securityContext` 字段：

{{% code_sample file="pods/security/security-context-2.yaml" %}}

<!--
Create the Pod:
-->
創建該 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-2.yaml
```

<!--
Verify that the Pod's Container is running:
-->
驗證 Pod 中的容器處於運行狀態：

```shell
kubectl get pod security-context-demo-2
```

<!--
Get a shell into the running Container:
-->
啓動一個 Shell 進入到運行中的容器內：

```shell
kubectl exec -it security-context-demo-2 -- sh
```

<!--
In your shell, list the running processes:
-->
在你的 Shell 中，列舉運行中的進程：

```shell
ps aux
```

<!--
The output shows that the processes are running as user 2000. This is the value
of `runAsUser` specified for the Container. It overrides the value 1000 that is
specified for the Pod.
-->
輸出顯示進程以使用者 2000 運行。該值是在 Container 的 `runAsUser` 中設置的。
該設置值重寫了 Pod 層面所設置的值 1000。

```
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4336   764 ?        Ss   20:36   0:00 /bin/sh -c node server.js
2000         8  0.1  0.5 772124 22604 ?        Sl   20:36   0:00 node server.js
...
```

<!--
Exit your shell:
-->
退出你的 Shell：

```shell
exit
```

<!--
## Set capabilities for a Container

With [Linux capabilities](https://man7.org/linux/man-pages/man7/capabilities.7.html),
you can grant certain privileges to a process without granting all the privileges
of the root user. To add or remove Linux capabilities for a Container, include the
`capabilities` field in the `securityContext` section of the Container manifest.

First, see what happens when you don't include a `capabilities` field.
Here is configuration file that does not add or remove any Container capabilities:
-->
## 爲 Container 設置權能   {#set-capabilities-for-a-container}

使用 [Linux 權能](https://man7.org/linux/man-pages/man7/capabilities.7.html)，
你可以賦予進程 root 使用者所擁有的某些特權，但不必賦予其全部特權。
要爲 Container 添加或移除 Linux 權能，可以在 Container 清單的 `securityContext`
節包含 `capabilities` 字段。

首先，看一下不包含 `capabilities` 字段時候會發生什麼。
下面是一個設定檔案，其中沒有添加或移除容器的權能：

{{% code_sample file="pods/security/security-context-3.yaml" %}}

<!--
Create the Pod:
-->
創建該 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-3.yaml
```

<!--
Verify that the Pod's Container is running:
-->
驗證 Pod 的容器處於運行狀態：

```shell
kubectl get pod security-context-demo-3
```

<!--
Get a shell into the running Container:
-->
啓動一個 Shell 進入到運行中的容器：

```shell
kubectl exec -it security-context-demo-3 -- sh
```

<!--
In your shell, list the running processes:
-->
在你的 Shell 中，列舉運行中的進程：

```shell
ps aux
```

<!--
The output shows the process IDs (PIDs) for the Container:
-->
輸出顯示容器中進程 ID（PIDs）：

```
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

<!--
In your shell, view the status for process 1:
-->
在你的 Shell 中，查看進程 1 的狀態：

```shell
cd /proc/1
cat status
```

<!--
The output shows the capabilities bitmap for the process:
-->
輸出顯示進程的權能位圖：

```
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

<!--
Make a note of the capabilities bitmap, and then exit your shell:
-->
記下進程權能位圖，之後退出你的 Shell：

```shell
exit
```

<!--
Next, run a Container that is the same as the preceding container, except
that it has additional capabilities set.

Here is the configuration file for a Pod that runs one Container. The configuration
adds the `CAP_NET_ADMIN` and `CAP_SYS_TIME` capabilities:
-->
接下來運行一個與前例中容器相同的容器，只是這個容器有一些額外的權能設置。

下面是一個 Pod 的設定，其中運行一個容器。設定爲容器添加 `CAP_NET_ADMIN` 和
`CAP_SYS_TIME` 權能：

{{% code_sample file="pods/security/security-context-4.yaml" %}}

<!--
Create the Pod:
-->
創建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-4.yaml
```

<!--
Get a shell into the running Container:
-->
啓動一個 Shell，進入到運行中的容器：

```shell
kubectl exec -it security-context-demo-4 -- sh
```

<!--
In your shell, view the capabilities for process 1:
-->
在你的 Shell 中，查看進程 1 的權能：

```shell
cd /proc/1
cat status
```

<!--
The output shows capabilities bitmap for the process:
-->
輸出顯示的是進程的權能位圖：

```
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

<!--
Compare the capabilities of the two Containers:
-->
比較兩個容器的權能位圖：

```
00000000a80425fb
00000000aa0435fb
```

<!--
In the capability bitmap of the first container, bits 12 and 25 are clear. In the second container,
bits 12 and 25 are set. Bit 12 is `CAP_NET_ADMIN`, and bit 25 is `CAP_SYS_TIME`.
See [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)
for definitions of the capability constants.
-->
在第一個容器的權能位圖中，位 12 和 25 是沒有設置的。在第二個容器中，位 12
和 25 是設置了的。位 12 是 `CAP_NET_ADMIN` 而位 25 則是 `CAP_SYS_TIME`。
參見 [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)
瞭解權能常數的定義。

<!--
Linux capability constants have the form `CAP_XXX`.
But when you list capabilities in your container manifest, you must
omit the `CAP_` portion of the constant.
For example, to add `CAP_SYS_TIME`, include `SYS_TIME` in your list of capabilities.
-->
{{< note >}}
Linux 權能常數定義的形式爲 `CAP_XXX`。但是你在 container 清單中列舉權能時，
要將權能名稱中的 `CAP_` 部分去掉。例如，要添加 `CAP_SYS_TIME`，
可在權能列表中添加 `SYS_TIME`。
{{< /note >}}

<!--
## Set the Seccomp Profile for a Container

To set the Seccomp profile for a Container, include the `seccompProfile` field
in the `securityContext` section of your Pod or Container manifest. The
`seccompProfile` field is a
[SeccompProfile](/docs/reference/generated/kubernetes-api/{{< param "version"
>}}/#seccompprofile-v1-core) object consisting of `type` and `localhostProfile`.
Valid options for `type` include `RuntimeDefault`, `Unconfined`, and
`Localhost`. `localhostProfile` must only be set if `type: Localhost`. It
indicates the path of the pre-configured profile on the node, relative to the
kubelet's configured Seccomp profile location (configured with the `--root-dir`
flag).
-->
## 爲容器設置 Seccomp 設定

若要爲容器設置 Seccomp 設定（Profile），可在你的 Pod 或 Container 清單的
`securityContext` 節中包含 `seccompProfile` 字段。該字段是一個 
[SeccompProfile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#seccompprofile-v1-core)
對象，包含 `type` 和 `localhostProfile` 屬性。
`type` 的合法選項包括 `RuntimeDefault`、`Unconfined` 和 `Localhost`。
`localhostProfile` 只能在 `type: Localhost` 設定下纔可以設置。
該字段標明節點上預先設定的設定的路徑，路徑是相對於 kubelet 所設定的
Seccomp 設定路徑（使用 `--root-dir` 設置）而言的。

<!--
Here is an example that sets the Seccomp profile to the node's container runtime
default profile:
-->
下面是一個例子，設置容器使用節點上容器運行時的預設設定作爲 Seccomp 設定：

```yaml
...
securityContext:
  seccompProfile:
    type: RuntimeDefault
```

<!--
Here is an example that sets the Seccomp profile to a pre-configured file at
`<kubelet-root-dir>/seccomp/my-profiles/profile-allow.json`:
-->
下面是另一個例子，將 Seccomp 的樣板設置爲位於
`<kubelet-根目錄>/seccomp/my-profiles/profile-allow.json`
的一個預先設定的檔案。

```yaml
...
securityContext:
  seccompProfile:
    type: Localhost
    localhostProfile: my-profiles/profile-allow.json
```

<!--
## Set the AppArmor Profile for a Container
-->
## 爲 Container 設置 AppArmor 設定   {#set-the-apparmor-profile-for-a-container}

<!--
To set the AppArmor profile for a Container, include the `appArmorProfile` field
in the `securityContext` section of your Container. The `appArmorProfile` field
is a
[AppArmorProfile](/docs/reference/generated/kubernetes-api/{{< param "version"
>}}/#apparmorprofile-v1-core) object consisting of `type` and `localhostProfile`.
Valid options for `type` include `RuntimeDefault`(default), `Unconfined`, and
`Localhost`. `localhostProfile` must only be set if `type` is `Localhost`. It
indicates the name of the pre-configured profile on the node. The profile needs
to be loaded onto all nodes suitable for the Pod, since you don't know where the
pod will be scheduled. 
Approaches for setting up custom profiles are discussed in
[Setting up nodes with profiles](/docs/tutorials/security/apparmor/#setting-up-nodes-with-profiles).
-->
要爲 Container 設置 AppArmor 設定，請在 Container 的 `securityContext` 節中包含 `appArmorProfile` 字段。
`appArmorProfile` 字段是一個
[AppArmorProfile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#apparmorprofile-v1-core)
對象，由 `type` 和 `localhostProfile` 組成。  
`type` 的有效選項包括 `RuntimeDefault`（預設）、`Unconfined` 和 `Localhost`。
只有當 `type` 爲 `Localhost` 時，才能設置 `localhostProfile`。  
它表示節點上預配的設定檔案的名稱。
此設定需要被加載到所有適合 Pod 的節點上，因爲你不知道 Pod 將被調度到哪裏。  
關於設置自定義設定的方法，參見[使用設定檔案設置節點](/zh-cn/docs/tutorials/security/apparmor/#setting-up-nodes-with-profiles)。

<!--
Note: If `containers[*].securityContext.appArmorProfile.type` is explicitly set 
to `RuntimeDefault`, then the Pod will not be admitted if AppArmor is not
enabled on the Node. However if `containers[*].securityContext.appArmorProfile.type`
is not specified, then the default (which is also `RuntimeDefault`) will only
be applied if the node has AppArmor enabled. If the node has AppArmor disabled
the Pod will be admitted but the Container will not be restricted by the 
`RuntimeDefault` profile.

Here is an example that sets the AppArmor profile to the node's container runtime
default profile:
-->
注意：如果 `containers[*].securityContext.appArmorProfile.type` 被顯式設置爲
`RuntimeDefault`，那麼如果 AppArmor 未在 Node 上被啓用，Pod 將不會被准入。  
然而，如果 `containers[*].securityContext.appArmorProfile.type` 未被指定，
則只有在節點已啓用 AppArmor 時纔會應用預設值（也是 `RuntimeDefault`）。  
如果節點已禁用 AppArmor，Pod 將被准入，但 Container 將不受 `RuntimeDefault` 設定的限制。

以下是將 AppArmor 設定設置爲節點的容器運行時預設設定的例子：

```yaml
...
containers:
- name: container-1
  securityContext:
    appArmorProfile:
      type: RuntimeDefault
```

<!--
Here is an example that sets the AppArmor profile to a pre-configured profile
named `k8s-apparmor-example-deny-write`:
-->
以下是將 AppArmor 設定設置爲名爲 `k8s-apparmor-example-deny-write` 的預配設定的例子：

```yaml
...
containers:
- name: container-1
  securityContext:
    appArmorProfile:
      type: Localhost
      localhostProfile: k8s-apparmor-example-deny-write
```

<!--
For more details please see, [Restrict a Container's Access to Resources with AppArmor](/docs/tutorials/security/apparmor/).
-->
有關更多細節參見[使用 AppArmor 限制容器對資源的訪問](/zh-cn/docs/tutorials/security/apparmor/)。

<!--
## Assign SELinux labels to a Container

To assign SELinux labels to a Container, include the `seLinuxOptions` field in
the `securityContext` section of your Pod or Container manifest. The
`seLinuxOptions` field is an
[SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core)
object. Here's an example that applies an SELinux level:
-->
## 爲 Container 賦予 SELinux 標籤   {#assign-selinux-labels-to-a-container}

若要給 Container 設置 SELinux 標籤，可以在 Pod 或 Container 清單的
`securityContext` 節包含 `seLinuxOptions` 字段。
`seLinuxOptions` 字段的取值是一個
[SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core)
對象。下面是一個應用 SELinux 標籤的例子：

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

{{< note >}}
<!--
To assign SELinux labels, the SELinux security module must be loaded on the host operating system.
On Windows and Linux worker nodes without SELinux support, this field and any SELinux feature gates described
below have no effect.
-->
要指定 SELinux，需要在宿主操作系統中裝載 SELinux 安全性模塊。
在不支持 SELinux 的 Windows 和 Linux 工作節點上，此字段和下面描述的任何
SELinux 特性開關均不起作用。
{{< /note >}}

<!--
### Efficient SELinux volume relabeling
-->
### 高效重打 SELinux 卷標籤

{{< feature-state feature_gate_name="SELinuxMountReadWriteOncePod" >}}

{{< note >}}
<!--
Kubernetes v1.27 introduced an early limited form of this behavior that was only applicable
to volumes (and PersistentVolumeClaims) using the `ReadWriteOncePod` access mode.
-->
Kubernetes v1.27 引入了此行爲的早期受限形式，僅適用於使用 `ReadWriteOncePod`
訪問模式的卷（和 PersistentVolumeClaim）。

<!--
Kubernetes v1.33 promotes `SELinuxChangePolicy` and `SELinuxMount`
[feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
as beta to widen that performance improvement to other kinds of PersistentVolumeClaims,
as explained in detail below. While in beta, `SELinuxMount` is still disabled by default.
-->
Kubernetes v1.33 將 `SELinuxChangePolicy` 和 `SELinuxMount`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)提升
Beta 級別，以將該性能改進擴展到其他類型的 PersistentVolumeClaims，
如下文詳細解釋。在 Beta 階段，`SELinuxMount` 仍然是預設禁用的。
{{< /note >}}

<!--
With `SELinuxMount` feature gate disabled (the default in Kubernetes 1.33 and any previous release),
the container runtime recursively assigns SELinux label to all
files on all Pod volumes by default. To speed up this process, Kubernetes can change the
SELinux label of a volume instantly by using a mount option
`-o context=<label>`.
-->
在禁用 `SELinuxMount` 特性開關時（預設在
Kubernetes 1.33 及之前的所有版本中），容器運行時會預設遞歸地爲
Pod 捲上的所有檔案分配 SELinux 標籤。
爲了加快此過程，Kubernetes 使用掛載可選項 `-o context=<label>`
可以立即改變卷的 SELinux 標籤。

<!--
To benefit from this speedup, all these conditions must be met:
-->
要使用這項加速功能，必須滿足下列條件：

<!--
* The [feature gates](/docs/reference/command-line-tools-reference/feature-gates/)
  `SELinuxMountReadWriteOncePod` must be enabled.
-->
* 必須啓用 `SELinuxMountReadWriteOncePod`
  [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
* Pod must use PersistentVolumeClaim with applicable `accessModes` and [feature gates](/docs/reference/command-line-tools-reference/feature-gates/):
  * Either the volume has `accessModes: ["ReadWriteOncePod"]`, and feature gate `SELinuxMountReadWriteOncePod` is enabled.
  * Or the volume can use any other access modes and all feature gates
    `SELinuxMountReadWriteOncePod`, `SELinuxChangePolicy` and `SELinuxMount` must be enabled
    and the Pod has `spec.securityContext.seLinuxChangePolicy` either nil (default) or `MountOption`. 
-->
* Pod 必須使用帶有對應的 `accessModes` 和[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)
  的 PersistentVolumeClaim。
  * 卷具有 `accessModes: ["ReadWriteOncePod"]`，並且 `SELinuxMountReadWriteOncePod` 特性門控已啓用。
  * 或者卷可以使用任何其他訪問模式，並且必須啓用 `SELinuxMountReadWriteOncePod`、`SELinuxChangePolicy`
    和 `SELinuxMount` 特性門控，且 Pod 已將 `spec.securityContext.seLinuxChangePolicy` 設置爲
    nil（預設值）或 `MountOption`。

<!--
* Pod (or all its Containers that use the PersistentVolumeClaim) must
  have `seLinuxOptions` set.
-->
* Pod（或其中使用 PersistentVolumeClaim 的所有容器）必須設置 `seLinuxOptions`。

<!--
* The corresponding PersistentVolume must be either a volume that uses a
  {{< glossary_tooltip text="CSI" term_id="csi" >}} driver, or a volume that uses the
  legacy `iscsi` volume type.
  * If you use a volume backed by a CSI driver, that CSI driver must announce that it
    supports mounting with `-o context` by setting `spec.seLinuxMount: true` in
    its CSIDriver instance.

* The corresponding PersistentVolume must be either:
  * A volume that uses the legacy in-tree `iscsi`, `rbd` or `fc` volume type.
  * Or a volume that uses a {{< glossary_tooltip text="CSI" term_id="csi" >}} driver.
    The CSI driver must announce that it supports mounting with `-o context` by setting
    `spec.seLinuxMount: true` in its CSIDriver instance.
-->
* 對應的 PersistentVolume 必須是：
  * 使用傳統樹內（In-Tree） `iscsi`、`rbd` 或 `fs` 卷類型的卷。
  * 或者是使用 {{< glossary_tooltip text="CSI" term_id="csi" >}} 驅動程式的卷
    CSI 驅動程式必須能夠通過在 CSIDriver 實例中設置 `spec.seLinuxMount: true`
    以支持 `-o context` 掛載。

<!--
When any of these conditions is not met, SELinux relabelling happens another way: the container
runtime  recursively changes the SELinux label for all inodes (files and directories)
in the volume. Calling out explicitly, this applies to Kubernetes ephemeral volumes like
`secret`, `configMap` and `projected`, and all volumes whose CSIDriver instance does not
explicitly announce mounting with `-o context`.
-->
對於這些所有卷類型，重打 SELinux 標籤的方式有所不同：
容器運行時爲卷中的所有節點（檔案和目錄）遞歸地修改 SELinux 標籤。
明確地說，這適用於 Kubernetes 臨時卷，如 `secret`、`configMap`
和 `projected`，以及所有 CSIDriver 實例未明確宣佈使用
`-o context` 選項進行掛載的卷。

<!--
When this speedup is used, all Pods that use the same applicable volume concurrently on the same node
**must have the same SELinux label**. A Pod with a different SELinux label will fail to start and will be
`ContainerCreating` until all Pods with other SELinux labels that use the volume are deleted.
-->
當使用這種加速時，所有在同一個節點上同時使用相同適用卷的 Pod
**必須具有相同的 SELinux 標籤**。具有不同 SELinux 標籤的 Pod 將無法啓動，
並且會處於 `ContainerCreating` 狀態，直到使用該卷的所有其他
SELinux 標籤的 Pod 被刪除。

{{< feature-state feature_gate_name="SELinuxChangePolicy" >}}

<!--
For Pods that want to opt-out from relabeling using mount options, they can set
`spec.securityContext.seLinuxChangePolicy` to `Recursive`. This is required
when multiple pods share a single volume on the same node, but they run with
different SELinux labels that allows simultaneous access to the volume. For example, a privileged pod
running with label `spc_t` and an unprivileged pod running with the default label `container_file_t`.
With unset `spec.securityContext.seLinuxChangePolicy` (or with the default value `MountOption`),
only one of such pods is able to run on a node, the other one gets ContainerCreating with error
`conflicting SELinux labels of volume <name of the volume>: <label of the running pod> and <label of the pod that can't start>`.
-->
對於不希望使用掛載選項來重新打標籤的 Pod，可以將
`spec.securityContext.seLinuxChangePolicy` 設置爲 `Recursive`。
當多個 Pod 共享同一節點上的單個卷，但使用不同的 SELinux 標籤以允許同時訪問此卷時，
此設定是必需的。例如，一個特權 Pod 運行時使用 `spc_t` 標籤，
而一個非特權 Pod 運行時使用預設標籤 `container_file_t`。
在不設置 `spec.securityContext.seLinuxChangePolicy`（或使用預設值 `MountOption`）的情況下，
這樣的多個 Pod 中只能有一個在節點上運行，其他 Pod 會在 ContainerCreating 時報錯
`conflicting SELinux labels of volume <卷名稱>: <正運行的 Pod 的標籤> and <未啓動的 Pod 的標籤>`。

<!--
#### SELinuxWarningController
To make it easier to identify Pods that are affected by the change in SELinux volume relabeling,
a new controller called `SELinuxWarningController` has been introduced in kube-controller-manager.
It is disabled by default and can be enabled by either setting the `--controllers=*,selinux-warning-controller`
[command line flag](/docs/reference/command-line-tools-reference/kube-controller-manager/),
or by setting `genericControllerManagerConfiguration.controllers`
[field in KubeControllerManagerConfiguration](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration).
This controller requires `SELinuxChangePolicy` feature gate to be enabled.
-->
#### SELinuxWarningController

爲了更容易識別受 SELinux 卷重新打標籤的變化所影響的 Pod，一個名爲
`SELinuxWarningController` 的新控制器已被添加到 kube-controller-manager 中。
這個控制器預設是被禁用的，你可以通過設置 `--controllers=*,selinux-warning-controller`
[命令列標誌](/zh-cn/docs/reference/command-line-tools-reference/kube-controller-manager/)或通過在
[KubeControllerManagerConfiguration 中設置 `genericControllerManagerConfiguration.controllers` 字段](/zh-cn/docs/reference/config-api/kube-controller-manager-config.v1alpha1/#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)來啓用。
此控制器需要啓用 `SELinuxChangePolicy` 特性門控。

<!--
When enabled, the controller observes running Pods and when it detects that two Pods use the same volume
with different SELinux labels:
1. It emits an event to both of the Pods. `kubectl describe pod <pod-name>` the shows
  `SELinuxLabel "<label on the pod>" conflicts with pod <the other pod name> that uses the same volume as this pod
  with SELinuxLabel "<the other pod label>". If both pods land on the same node, only one of them may access the volume`.
2. Raise `selinux_warning_controller_selinux_volume_conflict` metric. The metric has both pod
  names + namespaces as labels to identify the affected pods easily.
-->
當此控制器被啓用時，它會觀察運行中的 Pod。
當控制器檢測到兩個 Pod 使用相同的卷但具有不同的 SELinux 標籤時：

1. 它會向這兩個 Pod 發出一個事件。通過 `kubectl describe pod <Pod 名稱>` 可以看到：

   ```
   SELinuxLabel "<Pod 上的標籤>" conflicts with pod <另一個 Pod 名稱> that uses the same volume as this pod with SELinuxLabel "<另一個 Pod 標籤>". If both pods land on the same node, only one of them may access the volume.
   ```

2. 增加 `selinux_warning_controller_selinux_volume_conflict` 指標值。
   此指標將兩個 Pod 的名稱 + 命名空間作爲標籤，以便輕鬆識別受影響的 Pod。

<!--
A cluster admin can use this information to identify pods affected by the planning change and
proactively opt-out Pods from the optimization (i.e. set `spec.securityContext.seLinuxChangePolicy: Recursive`).
-->
叢集管理員可以使用此資訊識別受規劃變更所影響的 Pod，並主動篩選出不需優化的 Pod
（即設置 `spec.securityContext.seLinuxChangePolicy: Recursive`）。

{{< warning >}}
<!--
We strongly recommend clusters that use SELinux to enable this controller and make sure that
`selinux_warning_controller_selinux_volume_conflict` metric does not report any conflicts before enabling `SELinuxMount`
feature gate or upgrading to a version where `SELinuxMount` is enabled by default.
-->
我們強烈建議使用 SELinux 的叢集啓用此控制器，並確保在啓用
`SELinuxMount` 特性門控或升級到預設啓用 `SELinuxMount`
的版本之前，`selinux_warning_controller_selinux_volume_conflict`
指標沒有報告任何衝突。
{{< /warning >}}


<!--
#### Feature gates

The following feature gates control the behavior of SELinux volume relabeling:

* `SELinuxMountReadWriteOncePod`: enables the optimization for volumes with `accessModes: ["ReadWriteOncePod"]`.
  This is a very safe feature gate to enable, as it cannot happen that two pods can share one single volume with
  this access mode. This feature gate is enabled by default sine v1.28.
-->
#### 特性門控

以下特性門控可以控制 SELinux 卷重新打標籤的行爲：

* `SELinuxMountReadWriteOncePod`：爲具有 `accessModes: ["ReadWriteOncePod"]` 的卷啓用優化。
  啓用此特性門控是非常安全的，因爲在這種訪問模式下，不會出現兩個 Pod 共享同一卷的情況。
  此特性門控自 v1.28 起預設被啓用。

<!--
* `SELinuxChangePolicy`: enables `spec.securityContext.seLinuxChangePolicy` field in Pod and related SELinuxWarningController
  in kube-controller-manager. This feature can be used before enabling `SELinuxMount` to check Pods running on a cluster,
  and to pro-actively opt-out Pods from the optimization.
  This feature gate requires `SELinuxMountReadWriteOncePod` enabled. It is beta and enabled by default in 1.33.
-->
* `SELinuxChangePolicy`：在 Pod 中啓用 `spec.securityContext.seLinuxChangePolicy` 字段，
  並在 kube-controller-manager 中啓用相關的 SELinuxWarningController。
  你可以在啓用 `SELinuxMount` 之前使用此特性來檢查叢集中正在運行的 Pod，並主動篩選出不需優化的 Pod。
  此特性門控需要啓用 `SELinuxMountReadWriteOncePod`。它在 1.33 中是 Beta 階段，並預設被啓用。

<!--
* `SELinuxMount` enables the optimization for all eligible volumes. Since it can break existing workloads, we recommend
  enabling `SELinuxChangePolicy` feature gate + SELinuxWarningController first to check the impact of the change.
  This feature gate requires `SELinuxMountReadWriteOncePod` and `SELinuxChangePolicy` enabled. It is beta, but disabled
  by default in 1.33.
-->
* `SELinuxMount`：爲所有符合條件的卷啓用優化。由於可能會破壞現有的工作負載，所以我們建議先啓用
  `SELinuxChangePolicy` 特性門控和 SELinuxWarningController，以檢查這種更改的影響。
  此特性門控要求啓用 `SELinuxMountReadWriteOncePod` 和 `SELinuxChangePolicy`。
  它在 1.33 中是 Beta 階段，但是預設被禁用。

<!--
## Managing access to the `/proc` filesystem {#proc-access}
-->
## 管理對 `/proc` 檔案系統的訪問   {#proc-access}

{{< feature-state feature_gate_name="ProcMountType" >}}

<!--
For runtimes that follow the OCI runtime specification, containers default to running in a mode where
there are multiple paths that are both masked and read-only.
The result of this is the container has these paths present inside the container's mount namespace, and they can function similarly to if
the container was an isolated host, but the container process cannot write to
them. The list of masked and read-only paths are as follows:
-->
對於遵循 OCI 運行時規範的運行時，容器預設運行模式下，存在多個被屏蔽且只讀的路徑。
這樣做的結果是在容器的 mount 命名空間內會存在這些路徑，並且這些路徑的工作方式與容器是隔離主機時類似，
但容器進程無法寫入它們。
被屏蔽的和只讀的路徑列表如下：

<!--
- Masked Paths:
-->
- 被屏蔽的路徑：

  - `/proc/asound`
  - `/proc/acpi`
  - `/proc/kcore`
  - `/proc/keys`
  - `/proc/latency_stats`
  - `/proc/timer_list`
  - `/proc/timer_stats`
  - `/proc/sched_debug`
  - `/proc/scsi`
  - `/sys/firmware`
  - `/sys/devices/virtual/powercap`

<!--
- Read-Only Paths:
-->
- 只讀的路徑：

  - `/proc/bus`
  - `/proc/fs`
  - `/proc/irq`
  - `/proc/sys`
  - `/proc/sysrq-trigger`

<!--
For some Pods, you might want to bypass that default masking of paths.
The most common context for wanting this is if you are trying to run containers within
a Kubernetes container (within a pod).
-->
對於某些 Pod，你可能希望繞過預設的路徑屏蔽。
最常見的情況是你嘗試在 Kubernetes 容器內（在 Pod 內）運行容器。

<!--
The `securityContext` field `procMount` allows a user to request a container's `/proc`
be `Unmasked`, or be mounted as read-write by the container process. This also
applies to `/sys/firmware` which is not in `/proc`.
-->
`securityContext` 字段 `procMount` 允許使用者請求容器的 `/proc` 爲 `Unmasked`，
或者由容器進程以讀寫方式掛載。這一設置也適用於不在 `/proc` 內的 `/sys/firmware` 路徑。

```yaml
...
securityContext:
  procMount: Unmasked
```

{{< note >}}
<!--
Setting `procMount` to Unmasked requires the `spec.hostUsers` value in the pod
spec to be `false`. In other words: a container that wishes to have an Unmasked
`/proc` or unmasked `/sys` must also be in a
[user namespace](/docs/concepts/workloads/pods/user-namespaces/).
Kubernetes v1.12 to v1.29 did not enforce that requirement.
-->
將 `procMount` 設置爲 Unmasked 需要將 Pod 規約中的 `spec.hostUsers`
的值設置爲 `false`。換句話說：希望使用未被屏蔽的 `/proc` 或 `/sys`
路徑的容器也必須位於 [user 命名空間](/zh-cn/docs/concepts/workloads/pods/user-namespaces/)中。
Kubernetes v1.12 到 v1.29 沒有強制執行該要求。
{{< /note >}}

<!--
## Discussion

The security context for a Pod applies to the Pod's Containers and also to
the Pod's Volumes when applicable. Specifically `fsGroup` and `seLinuxOptions` are
applied to Volumes as follows:
-->
## 討論   {#discussion}

Pod 的安全上下文適用於 Pod 中的容器，也適用於 Pod 所掛載的卷（如果有的話）。
尤其是，`fsGroup` 和 `seLinuxOptions` 按下面的方式應用到掛載捲上：

<!--
* `fsGroup`: Volumes that support ownership management are modified to be owned
  and writable by the GID specified in `fsGroup`. See the
  [Ownership Management design document](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)
  for more details.

* `seLinuxOptions`: Volumes that support SELinux labeling are relabeled to be accessible
  by the label specified under `seLinuxOptions`. Usually you only
  need to set the `level` section. This sets the
  [Multi-Category Security (MCS)](https://selinuxproject.org/page/NB_MLS)
  label given to all Containers in the Pod as well as the Volumes.
-->
* `fsGroup`：支持屬主管理的卷會被修改，將其屬主變更爲 `fsGroup` 所指定的 GID，
  並且對該 GID 可寫。進一步的細節可參閱
  [屬主變更設計文檔](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)。

* `seLinuxOptions`：支持 SELinux 標籤的卷會被重新打標籤，以便可被 `seLinuxOptions`
  下所設置的標籤訪問。通常你只需要設置 `level` 部分。
  該部分設置的是賦予 Pod 中所有容器及卷的
  [多類別安全性（Multi-Category Security，MCS)](https://selinuxproject.org/page/NB_MLS)標籤。

<!--
After you specify an MCS label for a Pod, all Pods with the same label can
access the Volume. If you need inter-Pod protection, you must assign a unique
MCS label to each Pod.
-->
{{< warning >}}
在爲 Pod 設置 MCS 標籤之後，所有帶有相同標籤的 Pod 可以訪問該卷。
如果你需要跨 Pod 的保護，你必須爲每個 Pod 賦予獨特的 MCS 標籤。
{{< /warning >}}

<!--
## Clean up

Delete the Pod:
-->
## 清理

刪除之前創建的所有 Pod：

```shell
kubectl delete pod security-context-demo
kubectl delete pod security-context-demo-2
kubectl delete pod security-context-demo-3
kubectl delete pod security-context-demo-4
```

## {{% heading "whatsnext" %}}

<!--
* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
* [CRI Plugin Config Guide](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)
* [Security Contexts design document](https://git.k8s.io/design-proposals-archive/auth/security_context.md)
* [Ownership Management design document](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)
* [PodSecurity Admission](/docs/concepts/security/pod-security-admission/)
* [AllowPrivilegeEscalation design
  document](https://git.k8s.io/design-proposals-archive/auth/no-new-privs.md)
* For more information about security mechanisms in Linux, see
  [Overview of Linux Kernel Security Features](https://www.linux.com/learn/overview-linux-kernel-security-features)
  (Note: Some information is out of date)
* Read about [User Namespaces](/docs/concepts/workloads/pods/user-namespaces/)
  for Linux pods.
* [Masked Paths in the OCI Runtime
  Specification](https://github.com/opencontainers/runtime-spec/blob/f66aad47309/config-linux.md#masked-paths)
-->
* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core) API 定義
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core) API 定義
* [CRI 插件設定指南](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)
* [安全上下文的設計文檔（英文）](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/security_context.md)
* [屬主管理的設計文檔（英文）](https://github.com/kubernetes/design-proposals-archive/blob/main/storage/volume-ownership-management.md)
* [Pod 安全性准入](/zh-cn/docs/concepts/security/pod-security-admission/)
* [AllowPrivilegeEscalation 的設計文檔（英文）](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/no-new-privs.md)
* 關於在 Linux 系統中的安全機制的更多資訊，可參閱
  [Linux 內核安全性能力概述](https://www.linux.com/learn/overview-linux-kernel-security-features)（注意：部分資訊已過時）。
* 瞭解 Linux Pod 的 [user 命名空間](/zh-cn/docs/concepts/workloads/pods/user-namespaces/)。
* [OCI 運行時規範中的被屏蔽的路徑](https://github.com/opencontainers/runtime-spec/blob/f66aad47309/config-linux.md#masked-paths)
