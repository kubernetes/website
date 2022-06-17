---
title: 建立 Windows HostProcess Pod
content_type: task
weight: 20
min-kubernetes-server-version: 1.23
---

<!--
title: Create a Windows HostProcess Pod
content_type: task
weight: 20
min-kubernetes-server-version: 1.23
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

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
Windows HostProcess 容器讓你能夠在 Windows 主機上執行容器化負載。
這類容器以普通的程序形式執行，但能夠在具有合適使用者特權的情況下，
訪問主機網路名字空間、儲存和裝置。HostProcess 容器可用來在 Windows
節點上部署網路外掛、儲存配置、裝置外掛、kube-proxy 以及其他元件，
同時不需要配置專用的代理或者直接安裝主機服務。

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
類似於安裝安全補丁、事件日誌收集等這類管理性質的任務可以在不需要叢集操作員登入到每個
Windows 節點的前提下執行。HostProcess 容器可以以主機上存在的任何使用者賬戶來執行，
也可以以主機所在域中的使用者賬戶執行，這樣管理員可以透過使用者許可許可權來限制資源訪問。
儘管檔案系統和程序隔離都不支援，在啟動容器時會在主機上建立一個新的卷，
為其提供一個乾淨的、整合的工作空間。HostProcess 容器也可以基於現有的 Windows
基礎映象來製作，並且不再有 Windows 伺服器容器所帶有的那些
[相容性需求](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility)，
這意味著基礎映象的版本不必與主機作業系統的版本匹配。
不過，仍然建議你像使用 Windows 伺服器容器負載那樣，使用相同的基礎映象版本，
這樣你就不會有一些未使用的映象佔用節點上的儲存空間。HostProcess 容器也支援
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
  容器能夠訪問主機上的網路介面和 IP 地址。
- 當你需要訪問主機上的資源，如檔案系統、事件日誌等等。
- 需要安裝特定的裝置驅動或者 Windows 服務時。
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
如果你執行的不是 Kubernetes v{{< skew currentVersion >}}，請移步訪問正確
版本的 Kubernetes 文件。

在 Kubernetes v{{< skew currentVersion >}} 中，HostProcess 容器功能特性預設是啟用的。
kubelet 會直接與 containerd 通訊，透過 CRI 將主機程序標誌傳遞過去。
你可以使用 containerd 的最新版本（v1.6+）來執行 HostProcess 容器。
參閱[如何安裝 containerd](/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)。

<!--
To *disable* HostProcess containers you need to pass the following feature gate flag to the
**kubelet** and **kube-apiserver**:
-->
要 *禁用* HostProcess 容器特性，你需要為 **kubelet** 和 **kube-apiserver**
設定下面的特性門控標誌：

```powershell
--feature-gates=WindowsHostProcessContainers=false
```

<!--
See [Features Gates](/docs/reference/command-line-tools-reference/feature-gates/#overview)
documentation for more details.
-->
進一步的細節可參閱[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#overview)文件。

<!--
## Limitations

These limitations are relevant for Kubernetes v{{< skew currentVersion >}}:
-->
## 限制   {#limitations}

以下限制是與 Kubernetes v{{< skew currentVersion >}} 相關的：

<!--
- HostProcess containers require containerd 1.6 or higher
  {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}.
- HostProcess pods can only contain HostProcess containers. This is a current limitation
  of the Windows OS; non-privileged Windows containers cannot share a vNIC with the host IP namespace.
- HostProcess containers run as a process on the host and do not have any degree of
  isolation other than resource constraints imposed on the HostProcess user account. Neither
  filesystem or Hyper-V isolation are supported for HostProcess containers.
-->
- HostProcess 容器需要 containerd 1.6 或更高版本的
  {{< glossary_tooltip text="容器執行時" term_id="container-runtime" >}}。
- HostProcess Pods 只能包含 HostProcess 容器。這是在 Windows 作業系統上的約束；
  非特權的 Windows 容器不能與主機 IP 名字空間共享虛擬網絡卡（vNIC）。 
- HostProcess 在主機上以一個程序的形式執行，除了透過 HostProcess
  使用者賬號所實施的資源約束外，不提供任何形式的隔離。HostProcess 容器不支援檔案系統或
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
- 卷掛載是被支援的，並且要花在到容器卷下。參見[卷掛載](#volume-mounts)。
- 預設情況下有一組主機使用者賬戶可供 HostProcess 容器使用。
  參見[選擇使用者賬號](#choosing-a-user-account)。
- 對資源約束（磁碟、記憶體、CPU 個數）的支援與主機上程序相同。
- **不支援**命名管道或者 UNIX 域套接字形式的掛載，需要使用主機上的路徑名來訪問
  （例如，\\\\.\\pipe\\\*）。
  
<!--
## HostProcess Pod configuration requirements
-->
## HostProcess Pod 配置需求   {#hostprocess-pod-configuration-requirements}

<!--
Enabling a Windows HostProcess pod requires setting the right configurations in the pod security
configuration. Of the policies defined in the [Pod Security Standards](/docs/concepts/security/pod-security-standards)
HostProcess pods are disallowed by the baseline and restricted policies. It is therefore recommended
that HostProcess pods run in alignment with the privileged profile.

When running under the privileged policy, here are
the configurations which need to be set to enable the creation of a HostProcess pod:
-->
啟用 Windows HostProcess Pod 需要在 Pod 安全配置中設定合適的選項。
在 [Pod
安全標準](/zh-cn/docs/concepts/security/pod-security-standards)中所定義的策略中，
HostProcess Pod 預設是不被 basline 和 restricted 策略支援的。因此建議
HostProcess 執行在與 privileged 模式相看齊的策略下。

當執行在 privileged 策略下時，下面是要啟用 HostProcess Pod 建立所需要設定的選項：

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
        Windows Pods 提供執行<a href="/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod">
        HostProcess 容器</a>的能力，這類容器能夠具有對 Windows 節點的特權訪問許可權。</p>
        <p><strong><!--Allowed Values-->可選值</strong></p>
        <ul>
          <li><code>true</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/zh-cn/docs/concepts/security/pod-security-standards"><tt>hostNetwork</tt></a></td>
      <td>
        <p><!--Will be in host network by default initially. Support
        to set network to a different compartment may be desirable in
        the future.-->
        初始時將預設位於主機網路中。在未來可能會希望將網路設定到不同的隔離環境中。
        </p>
        <p><strong><!--Allowed Values-->可選值</strong></p>
        <ul>
          <li><code>true</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/zh-cn/docs/tasks/configure-pod-container/configure-runasusername/"><tt>securityContext.windowsOptions.runAsUsername</tt></a></td>
      <td>
        <p><!--Specification of which user the HostProcess container should run as is required for the pod spec.-->
        關於 HostProcess 容器所要使用的使用者的規約，需要設定在 Pod 的規約中。
        </p>
        <p><strong><!--Allowed Values-->可選值</strong></p>
        <ul>
          <li><code>NT AUTHORITY\SYSTEM</code></li>
          <li><code>NT AUTHORITY\Local service</code></li>
          <li><code>NT AUTHORITY\NetworkService</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/zh-cn/docs/concepts/security/pod-security-standards"><tt>runAsNonRoot</tt></a></td>
      <td>
        <p><!--Because HostProcess containers have privileged access to the host, the <tt>runAsNonRoot</tt> field cannot be set to true.-->
        因為 HostProcess 容器有訪問主機的特權，<tt>runAsNonRoot</tt> 欄位不可以設定為 true。
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
### 配置清單示例（片段）   {#manifest-example}

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
Applications running inside the container can access volume mounts directly via relative or
absolute paths. An environment variable `$CONTAINER_SANDBOX_MOUNT_POINT` is set upon container
creation and provides the absolute host path to the container volume. Relative paths are based
upon the `.spec.containers.volumeMounts.mountPath` configuration.
-->
## 卷掛載    {#volume-mounts}

HostProcess 容器支援在容器卷空間中掛載卷的能力。
在容器內執行的應用能夠透過相對或者絕對路徑直接訪問卷掛載。
環境變數 `$CONTAINER_SANDBOX_MOUNT_POINT` 在容器建立時被設定為指向容器卷的絕對主機路徑。
相對路徑是基於 `.spec.containers.volumeMounts.mountPath` 配置來推導的。

<!--
### Example {#volume-mount-example}

To access service account tokens the following path structures are supported within the container:
-->
### 示例    {#volume-mount-example}

容器內支援透過下面的路徑結構來訪問服務賬好令牌：

`.\var\run\secrets\kubernetes.io\serviceaccount\`

`$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

<!--
## Resource limits

Resource limits (disk, memory, cpu count) are applied to the job and are job wide.
For example, with a limit of 10MB set, the memory allocated for any HostProcess job object
will be capped at 10MB. This is the same behavior as other Windows container types.
These limits would be specified the same way they are currently for whatever orchestrator
or runtime is being used. The only difference is in the disk resource usage calculation
used for resource tracking due to the difference in how HostProcess containers are bootstrapped.
-->
## 資源約束    {#resource-limits}

資源約束（磁碟、記憶體、CPU 個數）作用到任務之上，並在整個任務上起作用。
例如，如果記憶體限制設定為 10MB，任何 HostProcess 任務物件所分配的記憶體不會超過 10MB。
這一行為與其他 Windows 容器型別相同。資源限制的設定方式與編排系統或容器執行時無關。
唯一的區別是用來跟蹤資源所進行的磁碟資源用量的計算，出現差異的原因是因為
HostProcess 容器啟動引導的方式造成的。

<!--
## Choosing a user account

HostProcess containers support the ability to run as one of three supported Windows service accounts:
-->
## 選擇使用者賬號  {#choosing-a-user-account}

HostProcess 容器支援以三種被支援的 Windows 服務賬號之一來執行：

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
你應該為每個 HostProcess 容器選擇一個合適的 Windows 服務賬號，嘗試限制特權範圍，
避免給主機代理意外的（甚至是惡意的）傷害。LocalSystem 服務賬號的特權級
在三者之中最高，只有在絕對需要的時候才應該使用。只要可能，應該使用
LocalService 服務賬號，因為該賬號在三者中特權最低。

