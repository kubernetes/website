---
title: Configure GMSA for Windows pods and containers
content_template: templates/task
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.14" state="alpha" >}}

This page shows how to configure [Group Managed Service Accounts](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) (GMSA) for pods and containers that will run on Windows nodes. Group Managed Service Accounts are a specific type of Active Directory account that provides automatic password management, simplified service principal name (SPN) management, and the ability to delegate the management to other administrators across multiple servers.

In Kubernetes, GMSA credential specs are configured at a Kubernetes cluster-wide scope as custom resources. Windows pods, as well as individual containers within a pod, can be configured to use a GMSA for domain based functions (e.g. Kerberos authentication) when interacting with other Windows services. As of v1.14, the only container runtime interface that supports GMSA for Windows workloads is Dockershim. Implementation of GMSA through CRI and other runtimes is planned for the future.

{{< note >}}
Currently this feature is in alpha state. While the overall goals and functionality will not change, the way in which the GMSA credspec references are specified in pod specs may change from annotations to API fields. Please take this into consideration when testing or adopting this feature.
{{< /note >}}

{{% /capture %}}

{{% capture prerequisites %}}

You need to have a Kubernetes cluster and the kubectl command-line tool must be configured to communicate with your cluster. The cluster is expected to have Windows worker nodes where pods with containers running Windows workloads requiring GMSA credentials will get scheduled. This section covers a set of initial steps required once for each cluster:

### Enable the WindowsGMSA feature gate
In the alpha state, the `WindowsGMSA` feature gate needs to be enabled on kubelet on Windows nodes. This is required to pass down the GMSA credential specs from the cluster scoped configurations to the container runtime. See [Feature Gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) for an explanation of enabling feature gates. Please make sure `--feature-gates=WindowsGMSA=true` parameter exists in the kubelet.exe command line.

### Install the GMSACredentialSpec CRD
A [CustomResourceDefinition](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/) (CRD) for GMSA credential spec resources needs to be configured on the cluster to define the custom resource type `GMSACredentialSpec`. Download the GMSA CRD [YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml) and save it as gmsa-crd.yaml.
Next, install the CRD with `kubectl apply -f gmsa-crd.yaml`

### Install webhooks to validate GMSA users
Two webhooks need to be configured on the Kubernetes cluster to populate and validate GMSA credential spec references at the pod or container level:

1. A mutating webhook that expands references to GMSAs (by name from a pod specification) into the full credential spec in JSON form within the pod spec. 

1. A validating webhook ensures all references to GMSAs are authorized to be used by the pod service account. 

Installing the above webhooks and associated objects require the steps below:

1. Create a certificate key pair (that will be used to allow the webhook container to communicate to the cluster)

1. Install a secret with the certificate from above.

1. Create a deployment for the core webhook logic. 

1. Create the validating and mutating webhook configurations referring to the deployment. 

A [script](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh) can be used to deploy and configure the GMSA webhooks and associated objects mentioned above. The script can be run with a ```--dry-run``` option to allow you to review the changes that would be made to your cluster.

The [YAML template](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl) used by the script may also be used to deploy the webhooks and associated objects manually (with appropriate substitutions for the parameters)

{{% /capture %}}

{{% capture steps %}}

## Configure GMSAs and Windows nodes in Active Directory
Before pods in Kubernetes can be configured to use GMSAs, the desired GMSAs need to be provisioned in Active Directory as described [here](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1). Windows worker nodes (that are part of the Kubernetes cluster) need to be configured in Active Directory to access the secret credentials associated with the desired GMSA as described [here](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet)

## Create GMSA credential spec resources
With the GMSACredentialSpec CRD installed (as described earlier), custom resources containing GMSA credential specs can be configured. The GMSA credential spec does not contain secret or sensitive data. It is information that a container runtime can use to describe the desired GMSA of a container to Windows. GMSA credential specs can be generated in YAML format with a utility [PowerShell script](https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1). 

Following are the steps for generating a GMSA credential spec YAML manually in JSON format and then converting it:

1. Import the CredentialSpec [module](https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1): `ipmo CredentialSpec.psm1`

1. Create a credential spec in JSON format using `New-CredentialSpec`. To create a GMSA credential spec named WebApp1, invoke `New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`

1. Use `Get-CredentialSpec` to show the path of the JSON file. 

1. Convert the credspec file from JSON to YAML format and apply the necessary header fields `apiVersion`, `kind`, `metadata` and `credspec` to make it a GMSACredentialSpec custom resource that can be configured in Kubernetes. 

The following YAML configuration describes a GMSA credential spec named `gmsa-WebApp1`:

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

The above credential spec resource may be saved as `gmsa-Webapp1-credspec.yaml` and applied to the cluster using: `kubectl apply -f gmsa-Webapp1-credspec.yml`

## Configure cluster role to enable RBAC on specific GMSA credential specs
A cluster role needs to be defined for each GMSA credential spec resource. This authorizes the `use` verb on a specific GMSA resource by a subject which is typically a service account. The following example shows a cluster role that authorizes usage of the `gmsa-WebApp1` credential spec from above. Save the file as gmsa-webapp1-role.yaml and apply using `kubectl apply -f gmsa-webapp1-role.yaml`

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

## Assign role to service accounts to use specific GMSA credspecs
A service account (that pods will be configured with) needs to be bound to the cluster role create above. This authorizes the service account to "use" the desired GMSA credential spec resource. The following shows the default service account being bound to a cluster role `webapp1-role` to use `gmsa-WebApp1` credential spec resource created above. 

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

## Configure GMSA credential spec reference in pod spec
In the alpha stage of the feature, the annotation `pod.alpha.windows.kubernetes.io/gmsa-credential-spec-name` is used to specify references to desired GMSA credential spec custom resources in pod specs. This configures all containers in the pod spec to use the specified GMSA. A sample pod spec with the annotation populated to refer to `gmsa-WebApp1`:

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

Individual containers in a pod spec can also specify the desired GMSA credspec using annotation `<containerName>.container.alpha.windows.kubernetes.io/gmsa-credential-spec`. For example:

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

As pod specs with GMSA annotations (as described above) are applied in a cluster configured for GMSA, the following sequence of events take place:

1. The mutating webhook resolves and expands all references to GMSA credential spec resources to the contents of the GMSA credential spec.

1. The validating webhook ensures the service account associated with the pod is authorized for the "use" verb on the specified GMSA credential spec.

1. The container runtime configures each Windows container with the specified GMSA credential spec so that the container can assume the identity of the GMSA in Active Directory and access services in the domain using that identity.

{{% /capture %}}
