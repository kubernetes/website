---
title: 爲 Windows Pod 和容器設定 GMSA
content_type: task
weight: 30
---
<!--
title: Configure GMSA for Windows Pods and containers
content_type: task
weight: 30
-->
<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

<!--
This page shows how to configure
[Group Managed Service Accounts](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) (GMSA)
for Pods and containers that will run on Windows nodes. Group Managed Service Accounts
are a specific type of Active Directory account that provides automatic password management,
simplified service principal name (SPN) management, and the ability to delegate the management
to other administrators across multiple servers.
-->
本頁展示如何爲將運行在 Windows 節點上的 Pod 和容器設定
[組管理的服務賬號（Group Managed Service Accounts，GMSA）](https://docs.microsoft.com/zh-cn/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview)。
組管理的服務賬號是活動目錄（Active Directory）的一種特殊類型，
提供自動化的密碼管理、簡化的服務主體名稱（Service Principal Name，SPN）
管理以及跨多個伺服器將管理操作委派給其他管理員等能力。

<!--
In Kubernetes, GMSA credential specs are configured at a Kubernetes cluster-wide scope
as Custom Resources. Windows Pods, as well as individual containers within a Pod,
can be configured to use a GMSA for domain based functions (e.g. Kerberos authentication)
when interacting with other Windows services.
-->
在 Kubernetes 環境中，GMSA 憑據規約設定爲 Kubernetes 叢集範圍的自定義資源
（Custom Resources）形式。Windows Pod 以及各 Pod 中的每個容器可以設定爲使用 GMSA
來完成基於域（Domain）的操作（例如，Kerberos 身份認證），以便與其他 Windows 服務相交互。

## {{% heading "prerequisites" %}}

<!--
You need to have a Kubernetes cluster and the `kubectl` command-line tool must be
configured to communicate with your cluster. The cluster is expected to have Windows worker nodes.
This section covers a set of initial steps required once for each cluster:
-->
你需要一個 Kubernetes 叢集，以及 `kubectl` 命令列工具，
且工具必須已設定爲能夠與你的叢集通信。叢集預期包含 Windows 工作節點。
本節討論需要爲每個叢集執行一次的初始操作。

<!--
### Install the GMSACredentialSpec CRD

A [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)(CRD)
for GMSA credential spec resources needs to be configured on the cluster to define
the custom resource type `GMSACredentialSpec`. Download the GMSA CRD
[YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml)
and save it as gmsa-crd.yaml. Next, install the CRD with `kubectl apply -f gmsa-crd.yaml`
-->
### 安裝 GMSACredentialSpec CRD

你需要在叢集上設定一個用於 GMSA 憑據規約資源的
[CustomResourceDefinition](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)(CRD)，
以便定義類型爲 `GMSACredentialSpec` 的自定義資源。首先下載 GMSA CRD
[YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml)
並將其保存爲 `gmsa-crd.yaml`。接下來執行 `kubectl apply -f gmsa-crd.yaml` 安裝 CRD。

<!--
### Install webhooks to validate GMSA users

Two webhooks need to be configured on the Kubernetes cluster to populate and
validate GMSA credential spec references at the Pod or container level:

1. A mutating webhook that expands references to GMSAs (by name from a Pod specification)
   into the full credential spec in JSON form within the Pod spec.

1. A validating webhook ensures all references to GMSAs are authorized to be used by the Pod service account.
-->
### 安裝 Webhook 來驗證 GMSA 使用者

你需要爲 Kubernetes 叢集設定兩個 Webhook，在 Pod 或容器級別填充和檢查
GMSA 憑據規約引用。

1. 一個修改模式（Mutating）的 Webhook，將對 GMSA 的引用（在 Pod 規約中體現爲名字）
   展開爲完整憑據規約的 JSON 形式，並保存回 Pod 規約中。

1. 一個驗證模式（Validating）的 Webhook，確保對 GMSA 的所有引用都是已經授權給
   Pod 的服務賬號使用的。

<!--
Installing the above webhooks and associated objects require the steps below:

1. Create a certificate key pair (that will be used to allow the webhook container to communicate to the cluster)

1. Install a secret with the certificate from above.

1. Create a deployment for the core webhook logic.

1. Create the validating and mutating webhook configurations referring to the deployment.
-->
安裝以上 Webhook 及其相關聯的對象需要執行以下步驟：

1. 創建一個證書密鑰對（用於允許 Webhook 容器與叢集通信）

1. 安裝一個包含如上證書的 Secret

1. 創建一個包含核心 Webhook 邏輯的 Deployment

1. 創建引用該 Deployment 的 Validating Webhook 和 Mutating Webhook 設定

<!--
A [script](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh)
can be used to deploy and configure the GMSA webhooks and associated objects
mentioned above. The script can be run with a `--dry-run=server` option to
allow you to review the changes that would be made to your cluster.

The [YAML template](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl)
used by the script may also be used to deploy the webhooks and associated objects
manually (with appropriate substitutions for the parameters)
-->
你可以使用[這個腳本](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh)
來部署和設定上述 GMSA Webhook 及相關聯的對象。你還可以在運行腳本時設置 `--dry-run=server`
選項以便審查腳本將會對叢集做出的變更。

腳本所使用的 [YAML 模板](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl)
也可用於手動部署 Webhook 及相關聯的對象，不過需要對其中的參數作適當替換。

<!-- steps -->

<!--
## Configure GMSAs and Windows nodes in Active Directory

Before Pods in Kubernetes can be configured to use GMSAs, the desired GMSAs need
to be provisioned in Active Directory as described in the
[Windows GMSA documentation](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1).
Windows worker nodes (that are part of the Kubernetes cluster) need to be configured
in Active Directory to access the secret credentials associated with the desired GMSA as described in the
[Windows GMSA documentation](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet).
-->
## 在活動目錄中設定 GMSA 和 Windows 節點

在設定 Kubernetes 中的 Pod 以使用 GMSA 之前，需要按
[Windows GMSA 文檔](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1)
中描述的那樣先在活動目錄中準備好期望的 GMSA。
Windows 工作節點（作爲 Kubernetes 叢集的一部分）需要被設定到活動目錄中，以便訪問與期望的
GSMA 相關聯的祕密憑據數據。這一操作的描述位於
[Windows GMSA 文檔](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet)
中。

<!--
## Create GMSA credential spec resources

With the GMSACredentialSpec CRD installed (as described earlier), custom resources
containing GMSA credential specs can be configured. The GMSA credential spec does
not contain secret or sensitive data. It is information that a container runtime
can use to describe the desired GMSA of a container to Windows. GMSA credential
specs can be generated in YAML format with a utility
[PowerShell script](https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1).
-->
## 創建 GMSA 憑據規約資源

當（如前所述）安裝了 GMSACredentialSpec CRD 之後，你就可以設定包含 GMSA
憑據規約的自定義資源了。GMSA 憑據規約中並不包含祕密或敏感數據。
其中包含的信息主要用於容器運行時，便於後者向 Windows 描述容器所期望的 GMSA。
GMSA 憑據規約可以使用
[PowerShell 腳本](https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1)
以 YAML 格式生成。

<!--
Following are the steps for generating a GMSA credential spec YAML manually in JSON format and then converting it:

1. Import the CredentialSpec
   [module](https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1): `ipmo CredentialSpec.psm1`

1. Create a credential spec in JSON format using `New-CredentialSpec`.
   To create a GMSA credential spec named WebApp1, invoke
   `New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`

1. Use `Get-CredentialSpec` to show the path of the JSON file.

1. Convert the credspec file from JSON to YAML format and apply the necessary
   header fields `apiVersion`, `kind`, `metadata` and `credspec` to make it a
   GMSACredentialSpec custom resource that can be configured in Kubernetes.
-->
下面是手動以 JSON 格式生成 GMSA 憑據規約並對其進行 YAML 轉換的步驟：

1. 導入 CredentialSpec [模塊](https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1)：`ipmo CredentialSpec.psm1`

1. 使用 `New-CredentialSpec` 來創建一個 JSON 格式的憑據規約。
   要創建名爲 `WebApp1` 的 GMSA 憑據規約，調用
   `New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`。

1. 使用 `Get-CredentialSpec` 來顯示 JSON 文件的路徑。

1. 將憑據規約從 JSON 格式轉換爲 YAML 格式，並添加必要的頭部字段
   `apiVersion`、`kind`、`metadata` 和 `credspec`，使其成爲一個可以在
   Kubernetes 中設定的 GMSACredentialSpec 自定義資源。

<!--
The following YAML configuration describes a GMSA credential spec named `gmsa-WebApp1`:

```yaml
apiVersion: windows.k8s.io/v1
kind: GMSACredentialSpec
metadata:
  name: gmsa-WebApp1  # This is an arbitrary name but it will be used as a reference
credspec:
  ActiveDirectoryConfig:
    GroupManagedServiceAccounts:
    - Name: WebApp1   # Username of the GMSA account
      Scope: CONTOSO  # NETBIOS Domain Name
    - Name: WebApp1   # Username of the GMSA account
      Scope: contoso.com # DNS Domain Name
  CmsPlugins:
  - ActiveDirectory
  DomainJoinConfig:
    DnsName: contoso.com  # DNS Domain Name
    DnsTreeName: contoso.com # DNS Domain Name Root
    Guid: 244818ae-87ac-4fcd-92ec-e79e5252348a  # GUID of the Domain
    MachineAccountName: WebApp1 # Username of the GMSA account
    NetBiosName: CONTOSO  # NETBIOS Domain Name
    Sid: S-1-5-21-2126449477-2524075714-3094792973 # SID of the Domain
```
-->
下面的 YAML 設定描述的是一個名爲 `gmsa-WebApp1` 的 GMSA 憑據規約：

```yaml
apiVersion: windows.k8s.io/v1
kind: GMSACredentialSpec
metadata:
  name: gmsa-WebApp1  # 這是隨意起的一個名字，將用作引用
credspec:
  ActiveDirectoryConfig:
    GroupManagedServiceAccounts:
    - Name: WebApp1   # GMSA 賬號的用戶名
      Scope: CONTOSO  # NETBIOS 域名
    - Name: WebApp1   # GMSA 賬號的用戶名
      Scope: contoso.com # DNS 域名
  CmsPlugins:
  - ActiveDirectory
  DomainJoinConfig:
    DnsName: contoso.com  # DNS 域名
    DnsTreeName: contoso.com # DNS 域名根
    Guid: 244818ae-87ac-4fcd-92ec-e79e5252348a  # 域名的 GUID
    MachineAccountName: WebApp1 # GMSA 賬號的用戶名
    NetBiosName: CONTOSO  # NETBIOS 域名
    Sid: S-1-5-21-2126449477-2524075714-3094792973 # 域名的 SID
```

<!--
The above credential spec resource may be saved as `gmsa-Webapp1-credspec.yaml`
and applied to the cluster using: `kubectl apply -f gmsa-Webapp1-credspec.yml`
-->
上面的憑據規約資源可以保存爲 `gmsa-Webapp1-credspec.yaml`，之後使用
`kubectl apply -f gmsa-Webapp1-credspec.yml` 應用到叢集上。

<!--
## Configure cluster role to enable RBAC on specific GMSA credential specs

A cluster role needs to be defined for each GMSA credential spec resource. This
authorizes the `use` verb on a specific GMSA resource by a subject which is typically
a service account. The following example shows a cluster role that authorizes usage
of the `gmsa-WebApp1` credential spec from above. Save the file as gmsa-webapp1-role.yaml
and apply using `kubectl apply -f gmsa-webapp1-role.yaml`
-->
## 設定叢集角色以啓用對特定 GMSA 憑據規約的 RBAC

你需要爲每個 GMSA 憑據規約資源定義叢集角色。
該叢集角色授權某主體（通常是一個服務賬號）對特定的 GMSA 資源執行 `use` 動作。
下面的示例顯示的是一個叢集角色，對前文創建的憑據規約 `gmsa-WebApp1` 執行鑑權。
將此文件保存爲 `gmsa-webapp1-role.yaml` 並執行 `kubectl apply -f gmsa-webapp1-role.yaml`。

<!--
```yaml
# Create the Role to read the credspec
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: webapp1-role
rules:
- apiGroups: ["windows.k8s.io"]
  resources: ["gmsacredentialspecs"]
  verbs: ["use"]
  resourceNames: ["gmsa-WebApp1"]
```
-->
```yaml
# 創建集羣角色讀取憑據規約
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: webapp1-role
rules:
- apiGroups: ["windows.k8s.io"]
  resources: ["gmsacredentialspecs"]
  verbs: ["use"]
  resourceNames: ["gmsa-WebApp1"]
```

<!--
## Assign role to service accounts to use specific GMSA credspecs

A service account (that Pods will be configured with) needs to be bound to the
cluster role create above. This authorizes the service account to use the desired
GMSA credential spec resource. The following shows the default service account
being bound to a cluster role `webapp1-role` to use `gmsa-WebApp1` credential spec resource created above.
-->
## 將角色指派給要使用特定 GMSA 憑據規約的服務賬號

你需要將某個服務賬號（Pod 設定所對應的那個）綁定到前文創建的叢集角色上。
這一綁定操作實際上授予該服務賬號使用所指定的 GMSA 憑據規約資源的訪問權限。
下面顯示的是一個綁定到叢集角色 `webapp1-role` 上的 default 服務賬號，
使之能夠使用前面所創建的 `gmsa-WebApp1` 憑據規約資源。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: allow-default-svc-account-read-on-gmsa-WebApp1
  namespace: default
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
roleRef:
  kind: ClusterRole
  name: webapp1-role
  apiGroup: rbac.authorization.k8s.io
```

<!--
## Configure GMSA credential spec reference in Pod spec

The Pod spec field `securityContext.windowsOptions.gmsaCredentialSpecName` is used to
specify references to desired GMSA credential spec custom resources in Pod specs.
This configures all containers in the Pod spec to use the specified GMSA. A sample
Pod spec with the annotation populated to refer to `gmsa-WebApp1`:
-->
## 在 Pod 規約中設定 GMSA 憑據規約引用

Pod 規約字段 `securityContext.windowsOptions.gmsaCredentialSpecName`
可用來設置對指定 GMSA 憑據規約自定義資源的引用。
設置此引用將會設定 Pod 中的所有容器使用所給的 GMSA。
下面是一個 Pod 規約示例，其中包含了對 `gmsa-WebApp1` 憑據規約的引用：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: with-creds
  name: with-creds
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      run: with-creds
  template:
    metadata:
      labels:
        run: with-creds
    spec:
      securityContext:
        windowsOptions:
          gmsaCredentialSpecName: gmsa-webapp1
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
      nodeSelector:
        kubernetes.io/os: windows
```

<!--
Individual containers in a Pod spec can also specify the desired GMSA credspec
using a per-container `securityContext.windowsOptions.gmsaCredentialSpecName` field. For example:
-->
Pod 中的各個容器也可以使用對應容器的 `securityContext.windowsOptions.gmsaCredentialSpecName`
字段來設置期望使用的 GMSA 憑據規約。例如：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: with-creds
  name: with-creds
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      run: with-creds
  template:
    metadata:
      labels:
        run: with-creds
    spec:
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
        securityContext:
          windowsOptions:
            gmsaCredentialSpecName: gmsa-Webapp1
      nodeSelector:
        kubernetes.io/os: windows
```

<!--
As Pod specs with GMSA fields populated (as described above) are applied in a cluster,
the following sequence of events take place:

1. The mutating webhook resolves and expands all references to GMSA credential spec
   resources to the contents of the GMSA credential spec.

1. The validating webhook ensures the service account associated with the Pod is
   authorized for the `use` verb on the specified GMSA credential spec.

1. The container runtime configures each Windows container with the specified GMSA
   credential spec so that the container can assume the identity of the GMSA in
   Active Directory and access services in the domain using that identity.
-->
當 Pod 規約中填充了 GMSA 相關字段（如上所述），在叢集中應用 Pod 規約時會依次發生以下事件：

1. Mutating Webhook 解析對 GMSA 憑據規約資源的引用，並將其全部展開，
   得到 GMSA 憑據規約的實際內容。

1. Validating Webhook 確保與 Pod 相關聯的服務賬號有權在所給的 GMSA 憑據規約上執行 `use` 動作。

1. 容器運行時爲每個 Windows 容器設定所指定的 GMSA 憑據規約，
   這樣容器就可以以活動目錄中該 GMSA 所代表的身份來執行操作，使用該身份來訪問域中的服務。

<!--
## Authenticating to network shares using hostname or FQDN
-->
## 使用主機名或 FQDN 對網路共享進行身份驗證

<!--
If you are experiencing issues connecting to SMB shares from Pods using hostname or FQDN,
but are able to access the shares via their IPv4 address then make sure the following registry key is set on the Windows nodes.
-->
如果你在使用主機名或 FQDN 從 Pod 連接到 SMB 共享時遇到問題，但能夠通過其 IPv4 地址訪問共享，
請確保在 Windows 節點上設置了以下註冊表項。

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Services\hns\State" /v EnableCompartmentNamespace /t REG_DWORD /d 1
```

<!--
Running Pods will then need to be recreated to pick up the behavior changes.
More information on how this registry key is used can be found
[here](https://github.com/microsoft/hcsshim/blob/885f896c5a8548ca36c88c4b87fd2208c8d16543/internal/uvm/create.go#L74-L83)
-->
然後需要重新創建正在運行的 Pod 以使行爲更改生效。有關如何使用此註冊表項的更多信息，
請參見[此處](https://github.com/microsoft/hcsshim/blob/885f896c5a8548ca36c88c4b87fd2208c8d16543/internal/uvm/create.go#L74-L83)。

<!--
## Troubleshooting

If you are having difficulties getting GMSA to work in your environment,
there are a few troubleshooting steps you can take.
-->
## 故障排查

如果在你的環境中設定 GMSA 時遇到了困難，你可以採取若干步驟來排查可能的故障。

<!--
First, make sure the credspec has been passed to the Pod. To do this you will need
to `exec` into one of your Pods and check the output of the `nltest.exe /parentdomain` command.
-->
首先，確保 credspec 已傳遞給 Pod。爲此，你需要先運行 `exec`
進入到你的一個 Pod 中並檢查 `nltest.exe /parentdomain` 命令的輸出。

<!--
In the example below the Pod did not get the credspec correctly:
-->
在下面的例子中，Pod 未能正確地獲得憑據規約：

```PowerShell
kubectl exec -it iis-auth-7776966999-n5nzr powershell.exe
```

<!--
`nltest.exe /parentdomain` results in the following error:
-->
`nltest.exe /parentdomain` 導致以下錯誤：

```output
Getting parent domain failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

<!--
If your Pod did get the credspec correctly, then next check communication with the domain.
First, from inside of your Pod, quickly do an nslookup to find the root of your domain.

This will tell us 3 things:

1. The Pod can reach the DC
1. The DC can reach the Pod
1. DNS is working correctly.
-->
如果 Pod 未能正確獲得憑據規約，則下一步就要檢查與域之間的通信。
首先，從 Pod 內部快速執行一個 nslookup 操作，找到域根。

這一操作會告訴我們三件事情：

1. Pod 能否訪問域控制器（DC）
1. DC 能否訪問 Pod
1. DNS 是否正常工作

<!--
If the DNS and communication test passes, next you will need to check if the Pod has
established secure channel communication with the domain. To do this, again,
`exec` into your Pod and run the `nltest.exe /query` command.
-->
如果 DNS 和通信測試通過，接下來你需要檢查是否 Pod 已經與域之間建立了安全通信通道。
要執行這一檢查，你需要再次通過 `exec` 進入到你的 Pod 中並執行 `nltest.exe /query` 命令。

```PowerShell
nltest.exe /query
```

<!--
Results in the following output:
-->
結果輸出如下：

```output
I_NetLogonControl failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

<!--
This tells us that for some reason, the Pod was unable to logon to the domain using
the account specified in the credspec. You can try to repair the secure channel by running the following:
-->
這告訴我們，由於某種原因，Pod 無法使用 credspec 中指定的帳戶登錄到域。
你可以嘗試通過運行以下命令來修復安全通道：

```PowerShell
nltest /sc_reset:domain.example
```

<!--
If the command is successful you will see and output similar to this:
-->
如果命令成功，你將看到類似以下內容的輸出：

```output
Flags: 30 HAS_IP  HAS_TIMESERV
Trusted DC Name \\dc10.domain.example
Trusted DC Connection Status Status = 0 0x0 NERR_Success
The command completed successfully
```

<!--
If the above corrects the error, you can automate the step by adding the following
lifecycle hook to your Pod spec.  If it did not correct the error, you will need to
examine your credspec again and confirm that it is correct and complete.
-->
如果以上命令修復了錯誤，你可以通過將以下生命週期回調添加到你的 Pod 規約中來自動執行該步驟。
如果這些操作沒有修復錯誤，你將需要再次檢查你的 credspec 並確認它是正確和完整的。

```yaml
        image: registry.domain.example/iis-auth:1809v1
        lifecycle:
          postStart:
            exec:
              command: ["powershell.exe","-command","do { Restart-Service -Name netlogon } while ( $($Result = (nltest.exe /query); if ($Result -like '*0x0 NERR_Success*') {return $true} else {return $false}) -eq $false)"]
        imagePullPolicy: IfNotPresent
```

<!--
If you add the `lifecycle` section show above to your Pod spec, the Pod will execute
the commands listed to restart the `netlogon` service until the `nltest.exe /query` command exits without error.
-->
如果你向你的 Pod 規約中添加如上所示的 `lifecycle` 節，則 Pod
會自動執行所列舉的命令來重啓 `netlogon` 服務，直到 `nltest.exe /query`
命令返回時沒有錯誤信息。
