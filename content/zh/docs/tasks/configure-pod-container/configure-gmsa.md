---
title: 为 Windows pod 和容器配置 GMSA
content_template: templates/task
weight: 20
---
<!--
---
title: Configure GMSA for Windows pods and containers
content_template: templates/task
weight: 20
---
-->

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

<!--
This page shows how to configure [Group Managed Service Accounts](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) (GMSA) for pods and containers that will run on Windows nodes. Group Managed Service Accounts are a specific type of Active Directory account that provides automatic password management, simplified service principal name (SPN) management, and the ability to delegate the management to other administrators across multiple servers.
-->
本页显示了如何将在 Windows 节点上运行的 pod 和容器配置[组管理服务账户](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) (GMSA) 。
组管理服务账户是一种特定类型的 Active Directory 账户，它提供自动密码管理，简化服务主体名称（SPN）管理，以及将管理委派给跨多个服务器的其他管理员的功能。

<!--
In Kubernetes, GMSA credential specs are configured at a Kubernetes cluster-wide scope as custom resources. Windows pods, as well as individual containers within a pod, can be configured to use a GMSA for domain based functions (e.g. Kerberos authentication) when interacting with other Windows services. As of v1.14, the only container runtime interface that supports GMSA for Windows workloads is Dockershim. Implementation of GMSA through CRI and other runtimes is planned for the future.
-->
在 Kubernetes 中，在 Kubernetes 集群范围内将 GMSA 凭据规范配置为自定义资源。Windows Pod 以及 Pod 中的各个容器可以配置为在与其他 Windows 服务交互时将 GMSA 用于基于域的功能（例如，Kerberos 身份验证）。从 v1.14开始，Dockershim 是支持 Windows 工作负载 GMSA 的唯一容器运行时接口。在未来计划通过 CRI 和其他运行时刻执行 GMSA。

<!--
Currently this feature is in alpha state. While the overall goals and functionality will not change, the way in which the GMSA credspec references are specified in pod specs may change from annotations to API fields. Please take this into consideration when testing or adopting this feature.
-->
{{< note >}}
当前，此功能处于 Alpha 状态。尽管总体目标和功能不会改变，但在 pod 规范中指定 GMSA credspec 引用的方式可能会从注释更改为 API 字段。在测试或采用此功能时，请考虑到这一点。
{{< /note >}}

{{% /capture %}}

{{% capture prerequisites %}}

<!--
You need to have a Kubernetes cluster and the kubectl command-line tool must be configured to communicate with your cluster. The cluster is expected to have Windows worker nodes where pods with containers running Windows workloads requiring GMSA credentials will get scheduled. This section covers a set of initial steps required once for each cluster:
-->
您需要拥有一个 Kubernetes 集群，并且必须配置 kubectl 命令行工具才能与您的集群通信。
预计该集群将具有 Windows 辅助节点，在该节点上将安排运行需要 GMSA 凭据的 Windows 工作负载的容器的 pod。
本节介绍了每个集群一次所需的一组初始步骤：

<!--
### Enable the WindowsGMSA feature gate
-->
### 启用 WindowsGMSA 功能门 
<!--
In the alpha state, the `WindowsGMSA` feature gate needs to be enabled on kubelet on Windows nodes. This is required to pass down the GMSA credential specs from the cluster scoped configurations to the container runtime. See [Feature Gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) for an explanation of enabling feature gates. Please make sure `--feature-gates=WindowsGMSA=true` parameter exists in the kubelet.exe command line.
-->
在 Alpha 状态下，需要在 Windows 节点上的 kubelet 上启用`WindowsGMSA`功能门。
这是将 GMSA 凭据规范从集群范围配置传递到容器运行时所必需的。
有关启用功能门的说明，请参见[功能门](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) 。
请确保 kubelet.exe 命令行中存在`--feature-gates=WindowsGMSA=true`参数。

<!--
### Install the GMSACredentialSpec CRD
-->
### 安装 GMSACredentialSpec CRD
<!--
A [CustomResourceDefinition](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/) (CRD) for GMSA credential spec resources needs to be configured on the cluster to define the custom resource type `GMSACredentialSpec`. Download the GMSA CRD [YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml) and save it as gmsa-crd.yaml.
Next, install the CRD with `kubectl apply -f gmsa-crd.yaml`
-->
GMSA 凭证规范资源的[CustomResourceDefinition](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/) (CRD)需要在集群上配置来定义自定义资源类型`GMSACredentialSpec`。
下载 GMSA CRD [YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml)，并将其另存为 gmsa-crd.yaml。
接下来，使用`kubectl apply -f gmsa-crd.yaml`安装 CRD。

<!--
### Install webhooks to validate GMSA users
-->
### 安装 webhooks 以验证 GMSA 用户
<!--
Two webhooks need to be configured on the Kubernetes cluster to populate and validate GMSA credential spec references at the pod or container level:
-->
在 Kubernetes 集群上在 Pod 或容器级别需要配置两个 webhook 来填充和验证 GMSA 凭证规范参考：

<!--
1. A mutating webhook that expands references to GMSAs (by name from a pod specification) into the full credential spec in JSON form within the pod spec. 
-->
1. 一个变异的 webhook，它将对 GMSA 的引用（按 Pod 规范中的名称）扩展为 Pod 规范中 JSON 形式的完整的凭据规范。

<!--
1. A validating webhook ensures all references to GMSAs are authorized to be used by the pod service account. 
-->
1.  一个有效的 webhook 可以确保 Pod 服务账户可以使用所有对 GMSA 的引用。

<!--
Installing the above webhooks and associated objects require the steps below:
-->
安装上述 webhook 和相关对象需要执行以下步骤：

<!--
1. Create a certificate key pair (that will be used to allow the webhook container to communicate to the cluster)
-->
1. 创建一个证书密钥对（将用于允许 webhook 容器与集群通信）

<!--
1. Install a secret with the certificate from above.
-->
1. 安装带有上述证书的密钥。

<!--
1. Create a deployment for the core webhook logic. 
-->
1. 为核心 webhook 逻辑创建部署。

<!--
1. Create the validating and mutating webhook configurations referring to the deployment. 
-->
1. 创建参考部署的验证和变异 webhook 配置。

<!--
A [script](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh) can be used to deploy and configure the GMSA webhooks and associated objects mentioned above. The script can be run with a ```--dry-run``` option to allow you to review the changes that would be made to your cluster.
-->
可以使用[脚本](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh)来部署和配置 GMSA webhook 和上面提到的相关对象。
该脚本可以使用```--dry-run```选项运行，以允许您查看将对集群进行的更改。

<!--
The [YAML template](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl) used by the script may also be used to deploy the webhooks and associated objects manually (with appropriate substitutions for the parameters)
-->
脚本使用的[YAML 模版](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl)也可以用于手动部署 webhook 和关联的对象（对参数进行适当的替换）

{{% /capture %}}

{{% capture steps %}}

<!--
## Configure GMSAs and Windows nodes in Active Directory
-->
## 在活动目录中配置 GMSA 和 Windows 节点
<!--
Before pods in Kubernetes can be configured to use GMSAs, the desired GMSAs need to be provisioned in Active Directory as described [here](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1). Windows worker nodes (that are part of the Kubernetes cluster) need to be configured in Active Directory to access the secret credentials associated with the desired GMSA as described [here](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet)
-->
在 kubernetes 中的 Pod 可以配置为使用 GMSA 之前，需要按照 [此处](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1)所述在活动目录中配置所需的 GMSA。
需要在活动目录中配置 Windows 辅助节点（属于 Kubernetes集群），以访问与所需的 GMSA 关联的秘密凭据，如[此处](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet)所述

<!--
## Create GMSA credential spec resources
-->
## 创建 GMSA 凭证规范资源
<!--
With the GMSACredentialSpec CRD installed (as described earlier), custom resources containing GMSA credential specs can be configured. The GMSA credential spec does not contain secret or sensitive data. It is information that a container runtime can use to describe the desired GMSA of a container to Windows. GMSA credential specs can be generated in YAML format with a utility [PowerShell script](https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1). 
-->
安装了 GMSACredentialSpec CRD（如前所述）后，可以配置包含 GMSA 凭证规范的自定义资源。
GMSA 凭证规范不包含秘密或敏感数据。
容器运行时可以使用该信息来向 Windows 描述所需的容器 GMSA。
可以使用实用程序[PowerShell 脚本](https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1)以 YAML 格式生成 GMSA 凭据规范。

<!--
Following are the steps for generating a GMSA credential spec YAML manually in JSON format and then converting it:
-->
以下是以 JSON 格式手动生成 GMSA 凭证规范 YAML 并将其转换到步骤：

<!--
1. Import the CredentialSpec [module](https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1): `ipmo CredentialSpec.psm1`
-->
1. 导入 CredentialSpec [模块](https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1): `ipmo CredentialSpec.psm1`

<!--
1. Create a credential spec in JSON format using `New-CredentialSpec`. To create a GMSA credential spec named WebApp1, invoke `New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`
-->
1. 使用`New-CredentialSpec`创建 JSON 格式的凭证规范。
   要创建名为 WebApp1 的 GMSA 的凭证规范，请调用`New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`

<!--
1. Use `Get-CredentialSpec` to show the path of the JSON file. 
-->
1. 使用 `Get-CredentialSpec`来显示 JSON 文件的路径

<!--
1. Convert the credspec file from JSON to YAML format and apply the necessary header fields `apiVersion`, `kind`, `metadata` and `credspec` to make it a GMSACredentialSpec custom resource that can be configured in Kubernetes. 
-->
1. 将 credspec 文件从 JSON 转换为 YAML 格式，并应用必要的标头字段`apiVersion`，`kind`，`metadata`和`credspec`，使其成为可在 Kubernetes 中配置的 GMSACredentialSpec 自定义资源。

<!--
The following YAML configuration describes a GMSA credential spec --named `gmsa-WebApp1`:
-->
以下 YAML 配置描述了名为`gmsa-WebApp1`的 GMSA 凭据规范：

```
apiVersion: windows.k8s.io/v1alpha1
kind: GMSACredentialSpec
metadata:
  name: gmsa-WebApp1  #This is an arbitrary name but it will be used as a reference
credspec:
  ActiveDirectoryConfig:
    GroupManagedServiceAccounts:
    - Name: WebApp1   #Username of the GMSA account
      Scope: CONTOSO  #NETBIOS Domain Name
    - Name: WebApp1   #Username of the GMSA account
      Scope: contoso.com #DNS Domain Name
  CmsPlugins:
  - ActiveDirectory
  DomainJoinConfig:
    DnsName: contoso.com  #DNS Domain Name
    DnsTreeName: contoso.com #DNS Domain Name Root
    Guid: 244818ae-87ac-4fcd-92ec-e79e5252348a  #GUID
    MachineAccountName: WebApp1 #Username of the GMSA account
    NetBiosName: CONTOSO  #NETBIOS Domain Name
    Sid: S-1-5-21-2126449477-2524075714-3094792973 #SID of GMSA
```

<!--
The above credential spec resource may be saved as `gmsa-Webapp1-credspec.yaml` and applied to the cluster using: `kubectl apply -f gmsa-Webapp1-credspec.yml`
-->
以上凭证规范资源可以另存为`gmsa-Webapp1-credspec.yaml`，并使用`kubectl apply -f gmsa-Webapp1-credspec.yml`命令将其应用于集群

<!--
## Configure cluster role to enable RBAC on specific GMSA credential specs
-->
## 配置集群角色以在特定 GMSA 凭据规范上启用 RBAC
<!--
A cluster role needs to be defined for each GMSA credential spec resource. This authorizes the `use` verb on a specific GMSA resource by a subject which is typically a service account. The following example shows a cluster role that authorizes usage of the `gmsa-WebApp1` credential spec from above. Save the file as gmsa-webapp1-role.yaml and apply using `kubectl apply -f gmsa-webapp1-role.yaml`
-->
需要为每个 GMSA 凭证规范资源定义集群角色。这可以通过主题（通常是服务账号）授权特定 GMSA 资源上的`use`动词。
以下示例显示了一个集群角色，该角色授权以上`gmsa-WebApp1`凭证规范的使用。
将文件另存为 gmsa-webapp1-role.yaml 并使用`kubectl apply -f gmsa-webapp1-role.yaml`

```
#Create the Role to read the credspec
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
-->
## 为服务账户分配角色以使用特定的 GMSA 信用规范
<!--
A service account (that pods will be configured with) needs to be bound to the cluster role create above. This authorizes the service account to "use" the desired GMSA credential spec resource. The following shows the default service account being bound to a cluster role `webapp1-role` to use `gmsa-WebApp1` credential spec resource created above. 
-->
服务账户（将使用其配置 Pod）需要绑定到上面创建的集群角色。
这授权服务账户“使用”所需的 GMSA 凭据规范资源。
以下显示了默认服务账户绑定到集群角色`webapp1-role`以使用上面创建的`gmsa-WebApp1`凭证规范资源。

```
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
## Configure GMSA credential spec reference in pod spec
-->
## 在 Pod 规范中配置 GMSA 凭证规范参考
<!--
In the alpha stage of the feature, the annotation `pod.alpha.windows.kubernetes.io/gmsa-credential-spec-name` is used to specify references to desired GMSA credential spec custom resources in pod specs. This configures all containers in the pod spec to use the specified GMSA. A sample pod spec with the annotation populated to refer to `gmsa-WebApp1`:
-->
在功能的 Alpha 阶段，注释`pod.alpha.windows.kubernetes.io/gmsa-credential-spec-name`用于在 Pod 规范中指定对所需 GMSA 凭证规范自定义资源的引用。
这将在 pod 规范中配置所有容器来使用指定的 GMSA。
一个带有注释的 pod 规范示例填充为链接到`gmsa-WebApp1`：

```
apiVersion: apps/v1beta1
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
      annotations:
        pod.alpha.windows.kubernetes.io/gmsa-credential-spec-name: gmsa-WebApp1  # This must be the name of the cred spec you created
    spec:
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
      nodeSelector:
        beta.kubernetes.io/os: windows
```

<!--
Individual containers in a pod spec can also specify the desired GMSA credspec using annotation `<containerName>.container.alpha.windows.kubernetes.io/gmsa-credential-spec`. For example:
-->
容器规范中的各个容器还可以使用注释`<containerName>.container.alpha.windows.kubernetes.io/gmsa-credential-spec`来指定所需的 GMSA 信用规范。例如：

```
apiVersion: apps/v1beta1
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
      annotations:
        iis.container.alpha.windows.kubernetes.io/gmsa-credential-spec-name: gmsa-WebApp1  # This must be the name of the cred spec you created
    spec:
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
      nodeSelector:
        beta.kubernetes.io/os: windows
```

<!--
As pod specs with GMSA annotations (as described above) are applied in a cluster configured for GMSA, the following sequence of events take place:
-->
当具有 GMSA 注释的 pod 规范（如上所述）应用于为 GMSA 配置的集群中时，将发生以下事件序列：

<!--
1. The mutating webhook resolves and expands all references to GMSA credential spec resources to the contents of the GMSA credential spec.
-->
1. 变异 Webhook 解析并扩展了对 GMSA 凭证规范资源的所有引用，使其扩展到 GMSA 凭证规范的内容。

<!--
1. The validating webhook ensures the service account associated with the pod is authorized for the "use" verb on the specified GMSA credential spec.
-->
1. 验证 Webhook 确保与 pod 相关的服务账号在 GMSA 凭证规范上被授权用于“使用”动词。

<!--
1. The container runtime configures each Windows container with the specified GMSA credential spec so that the container can assume the identity of the GMSA in Active Directory and access services in the domain using that identity.
-->
1. 容器运行时使用指定的 GMSA 凭证规范配置每个 WIndows 容器，以便容器可以在活动目录中采用 GMSA 的身份，并使用该身份访问域中的服务。

{{% /capture %}}
