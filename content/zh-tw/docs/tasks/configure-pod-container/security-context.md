---
title: 為 Pod 或容器配置安全上下文
content_type: task
weight: 80
---
<!--
reviewers:
- erictune
- mikedanese
- thockin
title: Configure a Security Context for a Pod or Container
content_type: task
weight: 80
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
安全上下文（Security Context）定義 Pod 或 Container 的特權與訪問控制設定。
安全上下文包括但不限於：

* 自主訪問控制（Discretionary Access Control）：
  基於[使用者 ID（UID）和組 ID（GID）](https://wiki.archlinux.org/index.php/users_and_groups)
  來判定對物件（例如檔案）的訪問許可權。
* [安全性增強的 Linux（SELinux）](https://zh.wikipedia.org/wiki/%E5%AE%89%E5%85%A8%E5%A2%9E%E5%BC%BA%E5%BC%8FLinux)：
  為物件賦予安全性標籤。
* 以特權模式或者非特權模式執行。
* [Linux 權能](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/): 
  為程序賦予 root 使用者的部分特權而非全部特權。
<!--
* [AppArmor](/docs/tutorials/security/apparmor/):
  Use program profiles to restrict the capabilities of individual programs.
* [Seccomp](/docs/tutorials/security/seccomp/): Filter a process's system calls.
* `allowPrivilegeEscalation`: Controls whether a process can gain more privileges than
  its parent process. This bool directly controls whether the
  [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)
  flag gets set on the container process.
  `allowPrivilegeEscalation` is always true
  when the container:

  - is run as privileged, or
  - has `CAP_SYS_ADMIN`

* readOnlyRootFilesystem: Mounts the container's root filesystem as read-only.
-->
* [AppArmor](/zh-cn/docs/tutorials/security/apparmor/)：使用程式配置來限制個別程式的權能。
* [Seccomp](/zh-cn/docs/tutorials/security/seccomp/)：過濾程序的系統呼叫。
* `allowPrivilegeEscalation`：控制程序是否可以獲得超出其父程序的特權。
  此布林值直接控制是否為容器程序設定
  [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)標誌。
  當容器滿足一下條件之一時，`allowPrivilegeEscalation` 總是為 true：

  - 以特權模式執行，或者
  - 具有 `CAP_SYS_ADMIN` 權能

* readOnlyRootFilesystem：以只讀方式載入容器的根檔案系統。

<!--
The above bullets are not a complete set of security context settings - please see
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
for a comprehensive list.
-->
以上條目不是安全上下文設定的完整列表 -- 請參閱
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
## 為 Pod 設定安全性上下文   {#set-the-security-context-for-a-pod}

要為 Pod 設定安全性設定，可在 Pod 規約中包含 `securityContext` 欄位。`securityContext` 欄位值是一個
[PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)
物件。你為 Pod 所設定的安全性配置會應用到 Pod 中所有 Container 上。
下面是一個 Pod 的配置檔案，該 Pod 定義了 `securityContext` 和一個 `emptyDir` 卷：

{{< codenew file="pods/security/security-context.yaml" >}}

<!--
In the configuration file, the `runAsUser` field specifies that for any Containers in
the Pod, all processes run with user ID 1000. The `runAsGroup` field specifies the primary group ID of 3000 for
all processes within any containers of the Pod. If this field is omitted, the primary group ID of the containers
will be root(0). Any files created will also be owned by user 1000 and group 3000 when `runAsGroup` is specified.
Since `fsGroup` field is specified, all processes of the container are also part of the supplementary group ID 2000.
The owner for volume `/data/demo` and any files created in that volume will be Group ID 2000.

Create the Pod:
-->
在配置檔案中，`runAsUser` 欄位指定 Pod 中的所有容器內的程序都使用使用者 ID 1000
來執行。`runAsGroup` 欄位指定所有容器中的程序都以主組 ID 3000 來執行。
如果忽略此欄位，則容器的主組 ID 將是 root（0）。
當 `runAsGroup` 被設定時，所有建立的檔案也會劃歸使用者 1000 和組 3000。
由於 `fsGroup` 被設定，容器中所有程序也會是附組 ID 2000 的一部分。
卷 `/data/demo` 及在該卷中建立的任何檔案的屬主都會是組 ID 2000。

建立該 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context.yaml
```

<!--
Verify that the Pod's Container is running:
-->
檢查 Pod 的容器處於執行狀態：

```shell
kubectl get pod security-context-demo
```

<!--
Get a shell to the running Container:
-->
開啟一個 Shell 進入到執行中的容器：

```shell
kubectl exec -it security-context-demo -- sh
```

<!--
In your shell, list the running processes:
-->
在你的 Shell 中，列舉執行中的程序：

```shell
ps
```

<!--
The output shows that the processes are running as user 1000, which is the value of `runAsUser`:
-->
輸出顯示程序以使用者 1000 執行，即 `runAsUser` 所設定的值：

```shell
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
輸出顯示 `/data/demo` 目錄的組 ID 為 2000，即 `fsGroup` 的設定值：

```shell
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

<!--
In your shell, navigate to `/data/demo`, and create a file:
-->
在你的 Shell 中，進入到 `/data/demo` 目錄下建立一個檔案：

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
輸出顯示 `testfile` 的組 ID 為 2000，也就是 `fsGroup` 所設定的值：

```shell
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

<!--
Run the following command:
-->
執行下面的命令：

```shell
id
```

<!--
The output is similar to this:
-->
輸出類似於：

```none
uid=1000 gid=3000 groups=2000
```

<!--
From the output, you can see that `gid` is 3000 which is same as the `runAsGroup` field.
If the `runAsGroup` was omitted, the `gid` would remain as 0 (root) and the process will
be able to interact with files that are owned by the root(0) group and groups that have
the required group permissions for the root (0) group.

Exit your shell:
-->
從輸出中你會看到 `gid` 值為 3000，也就是 `runAsGroup` 欄位的值。
如果 `runAsGroup` 被忽略，則 `gid` 會取值 0（root），而程序就能夠與 root
使用者組所擁有以及要求 root 使用者組訪問許可權的檔案互動。

退出你的 Shell：

```shell
exit
```

<!--
## Configure volume permission and ownership change policy for Pods
-->
## 為 Pod 配置卷訪問許可權和屬主變更策略

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
預設情況下，Kubernetes 在掛載一個卷時，會遞迴地更改每個卷中的內容的屬主和訪問許可權，
使之與 Pod 的 `securityContext` 中指定的 `fsGroup` 匹配。
對於較大的資料卷，檢查和變更屬主與訪問許可權可能會花費很長時間，降低 Pod 啟動速度。
你可以在 `securityContext` 中使用 `fsGroupChangePolicy` 欄位來控制 Kubernetes
檢查和管理卷屬主和訪問許可權的方式。

<!--
**fsGroupChangePolicy** -  `fsGroupChangePolicy` defines behavior for changing ownership
  and permission of the volume before being exposed inside a Pod.
  This field only applies to volume types that support `fsGroup` controlled ownership and permissions.
  This field has two possible values:

* _OnRootMismatch_: Only change permissions and ownership if permission and ownership of
  root directory does not match with expected permissions of the volume.
  This could help shorten the time it takes to change ownership and permission of a volume.
* _Always_: Always change permission and ownership of the volume when volume is mounted.

For example:
-->
**fsGroupChangePolicy** - `fsGroupChangePolicy` 定義在卷被暴露給 Pod 內部之前對其
內容的屬主和訪問許可進行變更的行為。此欄位僅適用於那些支援使用 `fsGroup` 來
控制屬主與訪問許可權的卷型別。此欄位的取值可以是：

* `OnRootMismatch`：只有根目錄的屬主與訪問許可權與卷所期望的許可權不一致時，
  才改變其中內容的屬主和訪問許可權。這一設定有助於縮短更改卷的屬主與訪問
  許可權所需要的時間。
* `Always`：在掛載卷時總是更改卷中內容的屬主和訪問許可權。

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
and [`emptydir`](/docs/concepts/storage/volumes/#emptydir).
-->
{{< note >}}
此欄位對於 [`secret`](/zh-cn/docs/concepts/storage/volumes/#secret)、
[`configMap`](/zh-cn/docs/concepts/storage/volumes/#configmap)
和 [`emptydir`](/zh-cn/docs/concepts/storage/volumes/#emptydir)
這類臨時性儲存無效。
{{< /note >}}

<!--
## Delegating volume permission and ownership change to CSI driver
-->
## 將卷許可權和所有權更改委派給 CSI 驅動程式
{{< feature-state for_k8s_version="v1.23" state="beta" >}}

<!--
If you deploy a [Container Storage Interface (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md)
driver which supports the `VOLUME_MOUNT_GROUP` `NodeServiceCapability`, the
process of setting file ownership and permissions based on the
`fsGroup` specified in the `securityContext` will be performed by the CSI driver
instead of Kubernetes, provided that the `DelegateFSGroupToCSIDriver` Kubernetes
feature gate is enabled. In this case, since Kubernetes doesn't perform any
ownership and permission change, `fsGroupChangePolicy` does not take effect, and
as specified by CSI, the driver is expected to mount the volume with the
provided `fsGroup`, resulting in a volume that is readable/writable by the
`fsGroup`.
-->
如果你部署了一個[容器儲存介面 (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md)
驅動，而該驅動支援 `VOLUME_MOUNT_GROUP` `NodeServiceCapability`，
在 `securityContext` 中指定 `fsGroup` 來設定檔案所有權和許可權的過程將由 CSI
驅動而不是 Kubernetes 來執行，前提是 Kubernetes 的 `DelegateFSGroupToCSIDriver` 
特性門控已啟用。在這種情況下，由於 Kubernetes 不執行任何所有權和許可權更改，
`fsGroupChangePolicy` 不會生效，並且按照 CSI 的規定，CSI 驅動應該使用所指定的
`fsGroup` 來掛載卷，從而生成了一個對 `fsGroup` 可讀/可寫的卷.

<!--
Please refer to the [KEP](https://github.com/gnufied/enhancements/blob/master/keps/sig-storage/2317-fsgroup-on-mount/README.md)
and the description of the `VolumeCapability.MountVolume.volume_mount_group`
field in the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume)
for more information.
-->
更多的資訊請參考 [KEP](https://github.com/gnufied/enhancements/blob/master/keps/sig-storage/2317-fsgroup-on-mount/README.md)
和 [CSI 規範](https://github.com/container-storage-interface/spec/blob/master/spec.md#createvolume) 
中的欄位 `VolumeCapability.MountVolume.volume_mount_group` 的描述。

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
## 為 Container 設定安全性上下文  {#set-the-security-context-for-a-container}

若要為 Container 設定安全性配置，可以在 Container 清單中包含 `securityContext` 
欄位。`securityContext` 欄位的取值是一個
[SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
物件。你為 Container 設定的安全性配置僅適用於該容器本身，並且所指定的設定在與
Pod 層面設定的內容發生重疊時，會過載後者。Container 層面的設定不會影響到 Pod 的卷。

下面是一個 Pod 的配置檔案，其中包含一個 Container。Pod 和 Container 都有
`securityContext` 欄位：

{{< codenew file="pods/security/security-context-2.yaml" >}}

<!--
Create the Pod:
-->
建立該 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-2.yaml
```

<!--
Verify that the Pod's Container is running:
-->
驗證 Pod 中的容器處於執行狀態：

```shell
kubectl get pod security-context-demo-2
```

<!--
Get a shell into the running Container:
-->
啟動一個 Shell 進入到執行中的容器內：

```shell
kubectl exec -it security-context-demo-2 -- sh
```

<!--
In your shell, list the running processes:
-->
在你的 Shell 中，列舉執行中的程序：

```shell
ps aux
```

<!--
The output shows that the processes are running as user 2000. This is the value
of `runAsUser` specified for the Container. It overrides the value 1000 that is
specified for the Pod.
-->
輸出顯示程序以使用者 2000 執行。該值是在 Container 的 `runAsUser` 中設定的。
該設定值過載了 Pod 層面所設定的值 1000。

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
## 為 Container 設定權能   {#set-capabilities-for-a-container}

使用 [Linux 權能](https://man7.org/linux/man-pages/man7/capabilities.7.html)，
你可以賦予程序 root 使用者所擁有的某些特權，但不必賦予其全部特權。
要為 Container 新增或移除 Linux 權能，可以在 Container 清單的 `securityContext`
節包含 `capabilities` 欄位。

首先，看一下不包含 `capabilities` 欄位時候會發生什麼。
下面是一個配置檔案，其中沒有新增或移除容器的權能：

{{< codenew file="pods/security/security-context-3.yaml" >}}

<!--
Create the Pod:
-->
建立該 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-3.yaml
```

<!--
Verify that the Pod's Container is running:
-->
驗證 Pod 的容器處於執行狀態：

```shell
kubectl get pod security-context-demo-3
```

<!--
Get a shell into the running Container:
-->
啟動一個 Shell 進入到執行中的容器：

```shell
kubectl exec -it security-context-demo-3 -- sh
```

<!--
In your shell, list the running processes:
-->
在你的 Shell 中，列舉執行中的程序：

```shell
ps aux
```

<!--
The output shows the process IDs (PIDs) for the Container:
-->
輸出顯示容器中程序 ID（PIDs）：

```shell
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

<!--
In your shell, view the status for process 1:
-->
在你的 Shell 中，檢視程序 1 的狀態：

```shell
cd /proc/1
cat status
```

<!--
The output shows the capabilities bitmap for the process:
-->
輸出顯示程序的權能點陣圖：

```
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

<!--
Make a note of the capabilities bitmap, and then exit your shell:
-->
記下程序權能點陣圖，之後退出你的 Shell：

```shell
exit
```

<!--
Next, run a Container that is the same as the preceding container, except
that it has additional capabilities set.

Here is the configuration file for a Pod that runs one Container. The configuration
adds the `CAP_NET_ADMIN` and `CAP_SYS_TIME` capabilities:
-->
接下來執行一個與前例中容器相同的容器，只是這個容器有一些額外的權能設定。

下面是一個 Pod 的配置，其中執行一個容器。配置為容器新增 `CAP_NET_ADMIN` 和
`CAP_SYS_TIME` 權能：

{{< codenew file="pods/security/security-context-4.yaml" >}}

<!--
Create the Pod:
-->
建立 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-4.yaml
```

<!--
Get a shell into the running Container:
-->
啟動一個 Shell，進入到執行中的容器：

```shell
kubectl exec -it security-context-demo-4 -- sh
```

<!--
In your shell, view the capabilities for process 1:
-->
在你的 Shell 中，檢視程序 1 的權能：

```shell
cd /proc/1
cat status
```

<!--
The output shows capabilities bitmap for the process:
-->
輸出顯示的是程序的權能點陣圖：

```shell
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

<!--
Compare the capabilities of the two Containers:
-->
比較兩個容器的權能點陣圖：

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
在第一個容器的權能點陣圖中，位 12 和 25 是沒有設定的。在第二個容器中，位 12
和 25 是設定了的。位 12 是 `CAP_NET_ADMIN` 而位 25 則是 `CAP_SYS_TIME`。
參見 [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h)
瞭解權能常數的定義。

<!--
Linux capability constants have the form `CAP_XXX`.
But when you list capabilities in your Container manifest, you must
omit the `CAP_` portion of the constant.
For example, to add `CAP_SYS_TIME`, include `SYS_TIME` in your list of capabilities.
-->
{{< note >}}
Linux 權能常數定義的形式為 `CAP_XXX`。但是你在 Container 清單中列舉權能時，
要將權能名稱中的 `CAP_` 部分去掉。例如，要新增 `CAP_SYS_TIME`，
可在權能列表中新增 `SYS_TIME`。
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
kubelet's configured Seccomp profile location (configured with the `-root-dir`
flag).

Here is an example that sets the Seccomp profile to the node's container runtime
default profile:
-->
## 為容器設定 Seccomp 配置 

若要為容器設定 Seccomp 配置（Profile），可在你的 Pod 或 Container 清單的
`securityContext` 節中包含 `seccompProfile` 欄位。該欄位是一個 
[SeccompProfile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#seccompprofile-v1-core)
物件，包含 `type` 和 `localhostProfile` 屬性。
`type` 的合法選項包括 `RuntimeDefault`、`Unconfined` 和 `Localhost`。
`localhostProfile` 只能在 `type: Localhost` 配置下才可以設定。
該欄位標明節點上預先設定的配置的路徑，路徑是相對於 kubelet 所配置的
Seccomp 配置路徑（使用 `--root-dir` 設定）而言的。

下面是一個例子，設定容器使用節點上容器執行時的預設配置作為 Seccomp 配置：

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
下面是另一個例子，將 Seccomp 的樣板設定為位於
`<kubelet-根目錄>/seccomp/my-profiles/profile-allow.json`
的一個預先配置的檔案。

```yaml
...
securityContext:
  seccompProfile:
    type: Localhost
    localhostProfile: my-profiles/profile-allow.json
```

<!--
## Assign SELinux labels to a Container

To assign SELinux labels to a Container, include the `seLinuxOptions` field in
the `securityContext` section of your Pod or Container manifest. The
`seLinuxOptions` field is an
[SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core)
object. Here's an example that applies an SELinux level:
-->
## 為 Container 賦予 SELinux 標籤

若要給 Container 設定 SELinux 標籤，可以在 Pod 或 Container 清單的
`securityContext` 節包含 `seLinuxOptions` 欄位。
`seLinuxOptions` 欄位的取值是一個
[SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core)
物件。下面是一個應用 SELinux 標籤的例子：

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

<!--
To assign SELinux labels, the SELinux security module must be loaded on the host operating system.
-->
{{< note >}}
要指定 SELinux，需要在宿主作業系統中裝載 SELinux 安全性模組。
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
  [Ownership Management design document](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
  for more details.

* `seLinuxOptions`: Volumes that support SELinux labeling are relabeled to be accessible
  by the label specified under `seLinuxOptions`. Usually you only
  need to set the `level` section. This sets the
  [Multi-Category Security (MCS)](https://selinuxproject.org/page/NB_MLS)
  label given to all Containers in the Pod as well as the Volumes.
-->
* `fsGroup`：支援屬主管理的卷會被修改，將其屬主變更為 `fsGroup` 所指定的 GID，
  並且對該 GID 可寫。進一步的細節可參閱
  [屬主變更設計文件](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)。

* `seLinuxOptions`：支援 SELinux 標籤的卷會被重新打標籤，以便可被 `seLinuxOptions`
  下所設定的標籤訪問。通常你只需要設定 `level` 部分。
  該部分設定的是賦予 Pod 中所有容器及卷的
  [多類別安全性（Multi-Category Security，MCS)](https://selinuxproject.org/page/NB_MLS)標籤。

  <!--
  After you specify an MCS label for a Pod, all Pods with the same label can
  access the Volume. If you need inter-Pod protection, you must assign a unique
  MCS label to each Pod.
  -->
  {{< warning >}}
  在為 Pod 設定 MCS 標籤之後，所有帶有相同標籤的 Pod 可以訪問該卷。
  如果你需要跨 Pod 的保護，你必須為每個 Pod 賦予獨特的 MCS 標籤。
  {{< /warning >}}

<!--
## Clean up

Delete the Pod:
-->
## 清理

刪除之前建立的所有 Pod：

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
* [Tuning Docker with the newest security enhancements](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)
* [Security Contexts design document](https://git.k8s.io/community/contributors/design-proposals/auth/security_context.md)
* [Ownership Management design document](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
* [Pod Security Policies](/docs/concepts/security/pod-security-policy/)
* [AllowPrivilegeEscalation design
  document](https://git.k8s.io/community/contributors/design-proposals/auth/no-new-privs.md)
* For more information about security mechanisms in Linux, see
  [Overview of Linux Kernel Security Features](https://www.linux.com/learn/overview-linux-kernel-security-features)
-->
* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core) API 定義
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core) API 定義
* [使用最新的安全性增強來調優 Docker（英文）](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)
* [安全上下文的設計文件（英文）](https://git.k8s.io/community/contributors/design-proposals/auth/security_context.md)
* [屬主管理的設計文件（英文）](https://git.k8s.io/community/contributors/design-proposals/storage/volume-ownership-management.md)
* [Pod 安全策略](/zh-cn/docs/concepts/security/pod-security-policy/)
* [AllowPrivilegeEscalation 的設計文件（英文）](https://git.k8s.io/community/contributors/design-proposals/auth/no-new-privs.md)
* 關於在 Linux 系統中的安全機制的更多資訊，可參閱
  [Linux 核心安全效能力概述](https://www.linux.com/learn/overview-linux-kernel-security-features)。

