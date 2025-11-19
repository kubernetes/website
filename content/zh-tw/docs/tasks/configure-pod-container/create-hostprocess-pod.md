---
title: 創建 Windows HostProcess Pod
content_type: task
weight: 50
min-kubernetes-server-version: 1.23
---
<!--
title: Create a Windows HostProcess Pod
content_type: task
weight: 50
min-kubernetes-server-version: 1.23
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!--
Windows HostProcess containers enable you to run containerized
workloads on a Windows host. These containers operate as
normal processes but have access to the host network namespace,
storage, and devices when given the appropriate user privileges.
HostProcess containers can be used to deploy network plugins,
storage configurations, device plugins, kube-proxy, and other
components to Windows nodes without the need for dedicated proxies or
the direct installation of host services.
-->
Windows HostProcess 容器讓你能夠在 Windows 主機上運行容器化負載。
這類容器以普通的進程形式運行，但能夠在具有合適使用者特權的情況下，
訪問主機網路名字空間、存儲和設備。HostProcess 容器可用來在 Windows
節點上部署網路插件、存儲設定、設備插件、kube-proxy 以及其他組件，
同時不需要設定專用的代理或者直接安裝主機服務。

<!--
Administrative tasks such as installation of security patches, event
log collection, and more can be performed without requiring cluster operators to
log onto each Windows node. HostProcess containers can run as any user that is
available on the host or is in the domain of the host machine, allowing administrators
to restrict resource access through user permissions. While neither filesystem or process
isolation are supported, a new volume is created on the host upon starting the container
to give it a clean and consolidated workspace. HostProcess containers can also be built on
top of existing Windows base images and do not inherit the same
[compatibility requirements](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility)
as Windows server containers, meaning that the version of the base images does not need
to match that of the host. It is, however, recommended that you use the same base image
version as your Windows Server container workloads to ensure you do not have any unused
images taking up space on the node. HostProcess containers also support
[volume mounts](#volume-mounts) within the container volume.
-->
類似於安裝安全補丁、事件日誌收集等這類管理性質的任務可以在不需要叢集操作員登錄到每個
Windows 節點的前提下執行。HostProcess 容器可以以主機上存在的任何使用者賬號來運行，
也可以以主機所在域中的使用者賬號運行，這樣管理員可以通過使用者許可權限來限制資源訪問。
儘管文件系統和進程隔離都不支持，在啓動容器時會在主機上創建一個新的卷，
爲其提供一個乾淨的、整合的工作空間。HostProcess 容器也可以基於現有的 Windows
基礎映像檔來製作，並且不再有 Windows 伺服器容器所帶有的那些
[兼容性需求](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility)，
這意味着基礎映像檔的版本不必與主機操作系統的版本匹配。
不過，仍然建議你像使用 Windows 伺服器容器負載那樣，使用相同的基礎映像檔版本，
這樣你就不會有一些未使用的映像檔佔用節點上的存儲空間。HostProcess 容器也支持
在容器卷內執行[卷掛載](#volume-mounts)。

<!--
### When should I use a Windows HostProcess container?

- When you need to perform tasks which require the networking namespace of the host.
HostProcess containers have access to the host's network interfaces and IP addresses.
- You need access to resources on the host such as the filesystem, event logs, etc.
- Installation of specific device drivers or Windows services.
- Consolidation of administrative tasks and security policies. This reduces the degree of
privileges needed by Windows nodes.
-->
### 我何時該使用 Windows HostProcess 容器？

- 當你準備執行需要訪問主機上網路名字空間的任務時，HostProcess
  容器能夠訪問主機上的網路接口和 IP 地址。
- 當你需要訪問主機上的資源，如文件系統、事件日誌等等。
- 需要安裝特定的設備驅動或者 Windows 服務時。
- 需要對管理任務和安全策略進行整合時。使用 HostProcess 容器能夠縮小 Windows
  節點上所需要的特權範圍。

## {{% heading "prerequisites" %}}

<!-- change this when graduating to stable -->

<!--
This task guide is specific to Kubernetes v{{< skew currentVersion >}}.
If you are not running Kubernetes v{{< skew currentVersion >}}, check the documentation for
that version of Kubernetes.

In Kubernetes {{< skew currentVersion >}}, the HostProcess container feature is enabled by default. The kubelet will
communicate with containerd directly by passing the hostprocess flag via CRI. You can use the
latest version of containerd (v1.6+) to run HostProcess containers.
[How to install containerd.](/docs/setup/production-environment/container-runtimes/#containerd)
-->
本任務指南是特定於 Kubernetes v{{< skew currentVersion >}} 的。
如果你運行的不是 Kubernetes v{{< skew currentVersion >}}，請移步訪問正確
版本的 Kubernetes 文檔。

在 Kubernetes v{{< skew currentVersion >}} 中，HostProcess 容器功能特性默認是啓用的。
kubelet 會直接與 containerd 通信，通過 CRI 將主機進程標誌傳遞過去。
你可以使用 containerd 的最新版本（v1.6+）來運行 HostProcess 容器。
參閱[如何安裝 containerd](/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)。

<!--
## Limitations

These limitations are relevant for Kubernetes v{{< skew currentVersion >}}:
-->
## 限制   {#limitations}

以下限制是與 Kubernetes v{{< skew currentVersion >}} 相關的：

<!--
- HostProcess containers require containerd 1.6 or higher
  {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} and
  containerd 1.7 is recommended.
- HostProcess pods can only contain HostProcess containers. This is a current limitation
  of the Windows OS; non-privileged Windows containers cannot share a vNIC with the host IP namespace.
- HostProcess containers run as a process on the host and do not have any degree of
  isolation other than resource constraints imposed on the HostProcess user account. Neither
  filesystem or Hyper-V isolation are supported for HostProcess containers.
-->
- HostProcess 容器需要 containerd 1.6 或更高版本的
  {{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}，
  推薦 containerd 1.7。
- HostProcess Pods 只能包含 HostProcess 容器。這是在 Windows 操作系統上的約束；
  非特權的 Windows 容器不能與主機 IP 名字空間共享虛擬網卡（vNIC）。
- HostProcess 在主機上以一個進程的形式運行，除了通過 HostProcess
  使用者賬號所實施的資源約束外，不提供任何形式的隔離。HostProcess 容器不支持文件系統或
  Hyper-V 隔離。
<!--
- Volume mounts are supported and are mounted under the container volume. See
  [Volume Mounts](#volume-mounts)
- A limited set of host user accounts are available for HostProcess containers by default.
  See [Choosing a User Account](#choosing-a-user-account).
- Resource limits (disk, memory, cpu count) are supported in the same fashion as processes
  on the host.
- Both Named pipe mounts and Unix domain sockets are **not** supported and should instead
  be accessed via their path on the host (e.g. \\\\.\\pipe\\\*)
-->
- 卷掛載是被支持的，並且要花在到容器卷下。參見[卷掛載](#volume-mounts)。
- 默認情況下有一組主機使用者賬號可供 HostProcess 容器使用。
  參見[選擇使用者賬號](#choosing-a-user-account)。
- 對資源約束（磁盤、內存、CPU 個數）的支持與主機上進程相同。
- **不支持**命名管道或者 UNIX 域套接字形式的掛載，需要使用主機上的路徑名來訪問
  （例如，\\\\.\\pipe\\\*）。
  
<!--
## HostProcess Pod configuration requirements
-->
## HostProcess Pod 設定需求   {#hostprocess-pod-configuration-requirements}

<!--
Enabling a Windows HostProcess pod requires setting the right configurations in the pod security
configuration. Of the policies defined in the [Pod Security Standards](/docs/concepts/security/pod-security-standards)
HostProcess pods are disallowed by the baseline and restricted policies. It is therefore recommended
that HostProcess pods run in alignment with the privileged profile.

When running under the privileged policy, here are
the configurations which need to be set to enable the creation of a HostProcess pod:
-->
啓用 Windows HostProcess Pod 需要在 Pod 安全設定中設置合適的選項。
在 [Pod
安全標準](/zh-cn/docs/concepts/security/pod-security-standards)中所定義的策略中，
HostProcess Pod 默認是不被 basline 和 restricted 策略支持的。因此建議
HostProcess 運行在與 privileged 模式相看齊的策略下。

當運行在 privileged 策略下時，下面是要啓用 HostProcess Pod 創建所需要設置的選項：

<table>
  <caption style="display: none"><!--Privileged policy specification-->privileged 策略規約</caption>
  <thead>
    <tr>
      <th><!--Control-->控制</th>
      <th><!--Policy-->策略</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="white-space: nowrap"><a href="/zh-cn/docs/concepts/security/pod-security-standards"><tt>securityContext.windowsOptions.hostProcess</tt></a></td>
      <td>
        <p><!--Windows pods offer the ability to run <a href="/docs/tasks/configure-pod-container/create-hostprocess-pod">
        HostProcess containers</a> which enables privileged access to the Windows node.-->
        Windows Pods 提供運行<a href="/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod">
        HostProcess 容器</a>的能力，這類容器能夠具有對 Windows 節點的特權訪問權限。</p>
        <p><strong><!--Allowed Values-->可選值</strong></p>
        <ul>
          <li><code>true</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/zh-cn/docs/concepts/security/pod-security-standards"><tt>hostNetwork</tt></a></td>
      <td>
        <p><!--Pods container HostProcess containers must use the host's network namespace.-->
        Pod 容器 HostProcess 容器必須使用主機的網路名字空間。
        </p>
        <p><strong><!--Allowed Values-->可選值</strong></p>
        <ul>
          <li><code>true</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/zh-cn/docs/tasks/configure-pod-container/configure-runasusername/"><tt>securityContext.windowsOptions.runAsUserName</tt></a></td>
      <td>
        <p><!--Specification of which user the HostProcess container should run as is required for the pod spec.-->
        關於 HostProcess 容器所要使用的使用者的規約，需要設置在 Pod 的規約中。
        </p>
        <p><strong><!--Allowed Values-->可選值</strong></p>
        <ul>
          <li><code>NT AUTHORITY\SYSTEM</code></li>
          <li><code>NT AUTHORITY\Local service</code></li>
          <li><code>NT AUTHORITY\NetworkService</code></li>
          <li>
          <!-- Local usergroup names (see below) -->
          本地使用者組名稱（參見下文）
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/zh-cn/docs/concepts/security/pod-security-standards"><tt>runAsNonRoot</tt></a></td>
      <td>
        <p><!--Because HostProcess containers have privileged access to the host, the <tt>runAsNonRoot</tt> field cannot be set to true.-->
        因爲 HostProcess 容器有訪問主機的特權，<tt>runAsNonRoot</tt> 字段不可以設置爲 true。
        </p>
        <p><strong><!--Allowed Values-->可選值</strong></p>
        <ul>
          <li><!--Undefined/Nil-->未定義/Nil</li>
          <li><code>false</code></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

<!--
### Example manifest (excerpt) {#manifest-example}
-->
### 設定清單示例（片段）   {#manifest-example}

```yaml
spec:
  securityContext:
    windowsOptions:
      hostProcess: true
      runAsUserName: "NT AUTHORITY\\Local service"
  hostNetwork: true
  containers:
  - name: test
    image: image1:latest
    command:
      - ping
      - -t
      - 127.0.0.1
  nodeSelector:
    "kubernetes.io/os": windows
```

<!--
## Volume mounts

HostProcess containers support the ability to mount volumes within the container volume space.
Volume mount behavior differs depending on the version of containerd runtime used by on the node.
-->
## 卷掛載    {#volume-mounts}

HostProcess 容器支持在容器卷空間中掛載卷的能力。
卷掛載行爲將因節點所使用的 containerd 運行時版本而異。

<!--
### Containerd v1.6

Applications running inside the container can access volume mounts directly via relative or
absolute paths. An environment variable `$CONTAINER_SANDBOX_MOUNT_POINT` is set upon container
creation and provides the absolute host path to the container volume. Relative paths are based
upon the `.spec.containers.volumeMounts.mountPath` configuration.

To access service account tokens (for example) the following path structures are supported within the container:
-->
### containerd v1.6

在容器內運行的應用能夠通過相對或者絕對路徑直接訪問卷掛載。
環境變量 `$CONTAINER_SANDBOX_MOUNT_POINT` 在容器創建時被設置爲指向容器卷的絕對主機路徑。
相對路徑是基於 `.spec.containers.volumeMounts.mountPath` 設定來推導的。

容器內支持通過下面的路徑結構來訪問服務賬號令牌：

- `.\var\run\secrets\kubernetes.io\serviceaccount\`
- `$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

<!--
### Containerd v1.7 (and greater)

Applications running inside the container can access volume mounts directly via the volumeMount's
specified `mountPath` (just like Linux and non-HostProcess Windows containers).
-->
### containerd v1.7（及更高版本）   {#containerd-v1-7-and-greater}

容器內運行的應用可以通過 volumeMount 指定的 `mountPath` 直接訪問卷掛載
（就像 Linux 和非 HostProcess Windows 容器一樣）。

<!--
For backwards compatibility volumes can also be accessed via using the same relative paths configured by containerd v1.6.

As an example, to access service account tokens within the container you would use one of the following paths:
-->
爲了向後兼容性，卷也可以通過使用由 containerd v1.6 設定的相同相對路徑進行訪問。

例如，要在容器中訪問服務帳戶令牌，你將使用以下路徑之一：

- `c:\var\run\secrets\kubernetes.io\serviceaccount`
- `/var/run/secrets/kubernetes.io/serviceaccount/`
- `$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

<!--
## Resource limits

Resource limits (disk, memory, cpu count) are applied to the job and are job wide.
For example, with a limit of 10MB set, the memory allocated for any HostProcess job object
will be capped at 10MB. This is the same behavior as other Windows container types.
These limits would be specified the same way they are currently for whatever orchestrator
or runtime is being used. The only difference is in the disk resource usage calculation
used for resource tracking due to the difference in how HostProcess containers are bootstrapped.
-->
## 資源限制    {#resource-limits}

資源限制（磁盤、內存、CPU 個數）作用到任務之上，並在整個任務上起作用。
例如，如果內存限制設置爲 10MB，任何 HostProcess 任務對象所分配的內存不會超過 10MB。
這一行爲與其他 Windows 容器類型相同。資源限制的設置方式與編排系統或容器運行時無關。
唯一的區別是用來跟蹤資源所進行的磁盤資源用量的計算，出現差異的原因是因爲
HostProcess 容器啓動引導的方式造成的。

<!--
## Choosing a user account

### System accounts

By default, HostProcess containers support the ability to run as one of three supported Windows service accounts:
-->
## 選擇使用者賬號  {#choosing-a-user-account}

### 系統賬號   {#system-accounts}

默認情況下，HostProcess 容器支持以三種被支持的 Windows 服務賬號之一來運行：

- **[LocalSystem](https://docs.microsoft.com/windows/win32/services/localsystem-account)**
- **[LocalService](https://docs.microsoft.com/windows/win32/services/localservice-account)**
- **[NetworkService](https://docs.microsoft.com/windows/win32/services/networkservice-account)**

<!--
You should select an appropriate Windows service account for each HostProcess
container, aiming to limit the degree of privileges so as to avoid accidental (or even
malicious) damage to the host. The LocalSystem service account has the highest level
of privilege of the three and should be used only if absolutely necessary. Where possible,
use the LocalService service account as it is the least privileged of the three options.
-->
你應該爲每個 HostProcess 容器選擇一個合適的 Windows 服務賬號，嘗試限制特權範圍，
避免給主機代理意外的（甚至是惡意的）傷害。LocalSystem 服務賬號的特權級
在三者之中最高，只有在絕對需要的時候才應該使用。只要可能，應該使用
LocalService 服務賬號，因爲該賬號在三者中特權最低。

<!--
### Local accounts {#local-accounts}

If configured, HostProcess containers can also run as local user accounts which allows for node operators to give
fine-grained access to workloads.
-->
### 本地賬號   {#local-accounts}

取決於設定，HostProcess 容器也能夠以本地使用者賬號運行，
從而允許節點操作員爲工作負載提供細粒度的訪問權限。

<!--
To run HostProcess containers as a local user; A local usergroup must first be created on the node
and the name of that local usergroup must be specified in the `runAsUserName` field in the deployment.
Prior to initializing the HostProcess container, a new **ephemeral** local user account to be created and joined to the specified usergroup, from which the container is run.
This provides a number a benefits including eliminating the need to manage passwords for local user accounts.
An initial HostProcess container running as a service account can be used to
prepare the user groups for later HostProcess containers.
-->
要以本地使用者運行 HostProcess 容器，必須首先在節點上創建一個本地使用者組，
並在部署中在 `runAsUserName` 字段中指定該本地使用者組的名稱。
在初始化 HostProcess 容器之前，將創建一個新的**臨時**本地使用者賬號，並加入到指定的使用者組中，
使用這個賬號來運行容器。這樣做有許多好處，包括不再需要管理本地使用者賬號的密碼。
作爲服務賬號運行的初始 HostProcess 容器可用於準備使用者組，以供後續的 HostProcess 容器使用。

{{< note >}}
<!--
Running HostProcess containers as local user accounts requires containerd v1.7+
-->
以本地使用者賬號運行 HostProcess 容器需要 containerd v1.7+。
{{< /note >}}

<!--
Example:

1. Create a local user group on the node (this can be done in another HostProcess container).
-->
例如：

1. 在節點上創建本地使用者組（這可以在另一個 HostProcess 容器中完成）。

   ```cmd
   net localgroup hpc-localgroup /add
   ```

<!--
1. Grant access to desired resources on the node to the local usergroup.
   This can be done with tools like [icacls](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls).
-->
2. 爲本地使用者組授予訪問所需資源的權限。這可以通過使用
   [icacls](https://learn.microsoft.com/zh-cn/windows-server/administration/windows-commands/icacls)
   這類工具達成。

<!--
1. Set `runAsUserName` to the name of the local usergroup for the pod or individual containers.
-->
3. 針對 Pod 或個別容器，將 `runAsUserName` 設置爲本地使用者組的名稱。

   ```yaml
   securityContext:
     windowsOptions:
       hostProcess: true
       runAsUserName: hpc-localgroup
   ```

<!--
1. Schedule the pod!
-->
4. 調度 Pod！

<!--
## Base Image for HostProcess Containers

HostProcess containers can be built from any of the existing [Windows Container base images](https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images).

Additionally a new base mage has been created just for HostProcess containers!
For more information please check out the [windows-host-process-containers-base-image github project](https://github.com/microsoft/windows-host-process-containers-base-image#overview).
-->
## HostProcess 容器的基礎映像檔   {#base-image-for-hostprocess-containers}

HostProcess 容器可以基於任何現有的
[Windows Container 基礎映像檔](https://learn.microsoft.com/zh-cn/virtualization/windowscontainers/manage-containers/container-base-images)進行構建。

此外，還專爲 HostProcess 容器創建了一個新的基礎映像檔！有關更多信息，請查看
[windows-host-process-containers-base-image github 項目](https://github.com/microsoft/windows-host-process-containers-base-image#overview)。

<!--
## Troubleshooting HostProcess containers

- HostProcess containers fail to start with `failed to create user process token: failed to logon user: Access is denied.: unknown`

  Ensure containerd is running as `LocalSystem` or `LocalService` service accounts. User accounts (even Administrator accounts) do not have permissions to create logon tokens for any of the supported [user accounts](#choosing-a-user-account).
-->
## HostProcess 容器的故障排查   {#troubleshooting-hostprocess-containers}

- HostProcess 容器因
  `failed to create user process token: failed to logon user: Access is denied.: unknown`
  啓動失敗。

  確保 containerd 以 `LocalSystem` 或 `LocalService` 服務帳戶運行。
  使用者賬號（即使是管理員賬號）沒有權限爲任何支持的[使用者賬號](#choosing-a-user-account)創建登錄令牌。
