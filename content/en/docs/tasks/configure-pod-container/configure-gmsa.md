---
title: Configure GMSA for Windows Pods and containers
content_type: task
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

This page shows how to configure [Group Managed Service Accounts](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) (GMSA) for Pods and containers that will run on Windows nodes. Group Managed Service Accounts are a specific type of Active Directory account that provides automatic password management, simplified service principal name (SPN) management, and the ability to delegate the management to other administrators across multiple servers.

In Kubernetes, GMSA credential specs are configured at a Kubernetes cluster-wide scope as Custom Resources. Windows Pods, as well as individual containers within a Pod, can be configured to use a GMSA for domain based functions (e.g. Kerberos authentication) when interacting with other Windows services. As of v1.16, the Docker runtime supports GMSA for Windows workloads.



## {{% heading "prerequisites" %}}


You need to have a Kubernetes cluster and the `kubectl` command-line tool must be configured to communicate with your cluster. The cluster is expected to have Windows worker nodes. This section covers a set of initial steps required once for each cluster:

### Install the GMSACredentialSpec CRD
A [CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)(CRD) for GMSA credential spec resources needs to be configured on the cluster to define the custom resource type `GMSACredentialSpec`. Download the GMSA CRD [YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml) and save it as gmsa-crd.yaml.
Next, install the CRD with `kubectl apply -f gmsa-crd.yaml`

### Install webhooks to validate GMSA users
Two webhooks need to be configured on the Kubernetes cluster to populate and validate GMSA credential spec references at the Pod or container level:

1. A mutating webhook that expands references to GMSAs (by name from a Pod specification) into the full credential spec in JSON form within the Pod spec.

1. A validating webhook ensures all references to GMSAs are authorized to be used by the Pod service account.

Installing the above webhooks and associated objects require the steps below:

1. Create a certificate key pair (that will be used to allow the webhook container to communicate to the cluster)

1. Install a secret with the certificate from above.

1. Create a deployment for the core webhook logic. 

1. Create the validating and mutating webhook configurations referring to the deployment. 

A [script](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh) can be used to deploy and configure the GMSA webhooks and associated objects mentioned above. The script can be run with a ```--dry-run=server``` option to allow you to review the changes that would be made to your cluster.

The [YAML template](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl) used by the script may also be used to deploy the webhooks and associated objects manually (with appropriate substitutions for the parameters)



<!-- steps -->

## Configure GMSAs and Windows nodes in Active Directory
Before Pods in Kubernetes can be configured to use GMSAs, the desired GMSAs need to be provisioned in Active Directory as described in the [Windows GMSA documentation](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1). Windows worker nodes (that are part of the Kubernetes cluster) need to be configured in Active Directory to access the secret credentials associated with the desired GMSA as described in the [Windows GMSA documentation](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet)

## Create GMSA credential spec resources
With the GMSACredentialSpec CRD installed (as described earlier), custom resources containing GMSA credential specs can be configured. The GMSA credential spec does not contain secret or sensitive data. It is information that a container runtime can use to describe the desired GMSA of a container to Windows. GMSA credential specs can be generated in YAML format with a utility [PowerShell script](https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1). 

Following are the steps for generating a GMSA credential spec YAML manually in JSON format and then converting it:

1. Import the CredentialSpec [module](https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1): `ipmo CredentialSpec.psm1`

1. Create a credential spec in JSON format using `New-CredentialSpec`. To create a GMSA credential spec named WebApp1, invoke `New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`

1. Use `Get-CredentialSpec` to show the path of the JSON file. 

1. Convert the credspec file from JSON to YAML format and apply the necessary header fields `apiVersion`, `kind`, `metadata` and `credspec` to make it a GMSACredentialSpec custom resource that can be configured in Kubernetes. 

The following YAML configuration describes a GMSA credential spec named `gmsa-WebApp1`:

```yaml
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

```yaml
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
A service account (that Pods will be configured with) needs to be bound to the cluster role create above. This authorizes the service account to use the desired GMSA credential spec resource. The following shows the default service account being bound to a cluster role `webapp1-role` to use `gmsa-WebApp1` credential spec resource created above.

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

## Configure GMSA credential spec reference in Pod spec
The Pod spec field `securityContext.windowsOptions.gmsaCredentialSpecName` is used to specify references to desired GMSA credential spec custom resources in Pod specs. This configures all containers in the Pod spec to use the specified GMSA. A sample Pod spec with the annotation populated to refer to `gmsa-WebApp1`:

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

Individual containers in a Pod spec can also specify the desired GMSA credspec using a per-container `securityContext.windowsOptions.gmsaCredentialSpecName` field. For example:

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

As Pod specs with GMSA fields populated (as described above) are applied in a cluster, the following sequence of events take place:

1. The mutating webhook resolves and expands all references to GMSA credential spec resources to the contents of the GMSA credential spec.

1. The validating webhook ensures the service account associated with the Pod is authorized for the `use` verb on the specified GMSA credential spec.

1. The container runtime configures each Windows container with the specified GMSA credential spec so that the container can assume the identity of the GMSA in Active Directory and access services in the domain using that identity.

## Troubleshooting

If you are having difficulties getting GMSA to work in your environment, there are a few troubleshooting steps you can take.

First, make sure the credspec has been passed to the Pod.  To do this you will need to `exec` into one of your Pods and check the output of the `nltest.exe /parentdomain` command.  In the example below the Pod did not get the credspec correctly:

```shell
kubectl exec -it iis-auth-7776966999-n5nzr powershell.exe

Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

PS C:\> nltest.exe /parentdomain
Getting parent domain failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
PS C:\>
```

If your Pod did get the credspec correctly, then next check communication with the domain.  First, from inside of your Pod, quickly do an nslookup to find the root of your domain.

This will tell us 3 things:

1. The Pod can reach the DC
1. The DC can reach the Pod
1. DNS is working correctly.

If the DNS and communication test passes, next you will need to check if the Pod has established secure channel communication with the domain.  To do this, again, `exec` into your Pod and run the `nltest.exe /query` command.

```shell
PS C:\> nltest.exe /query
I_NetLogonControl failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

This tells us that for some reason, the Pod was unable to logon to the domain using the account specified in the credspec.  You can try to repair the secure channel by running the `nltest.exe /sc_reset:domain.example` command.

```shell
PS C:\> nltest /sc_reset:domain.example
Flags: 30 HAS_IP  HAS_TIMESERV
Trusted DC Name \\dc10.domain.example
Trusted DC Connection Status Status = 0 0x0 NERR_Success
The command completed successfully
PS C:\>
```

If the above command corrects the error, you can automate the step by adding the following lifecycle hook to your Pod spec.  If it did not correct the error, you will need to examine your credspec again and confirm that it is correct and complete.

```yaml
        image: registry.domain.example/iis-auth:1809v1
        lifecycle:
          postStart:
            exec:
              command: ["powershell.exe","-command","do { Restart-Service -Name netlogon } while ( $($Result = (nltest.exe /query); if ($Result -like '*0x0 NERR_Success*') {return $true} else {return $false}) -eq $false)"]
        imagePullPolicy: IfNotPresent
```

If you add the `lifecycle` section show above to your Pod spec, the Pod will execute the commands listed to restart the `netlogon` service until the `nltest.exe /query` command exits without error.

## GMSA limitations
When using the [ContainerD runtime for Windows](/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#cri-containerd) accessing restricted network shares via the GMSA domain identity fails. The container will receive the identity of and calls from `nltest.exe /query` will work.  It is recommended to use the [Docker EE runtime](/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#docker-ee) if access to network shares is required.  The Windows Server team is working on resolving the issue in the Windows Kernel and will release a patch to resolve this issue in the future. Look for updates on the [Microsoft Windows Containers issue tracker](https://github.com/microsoft/Windows-Containers/issues/44).
