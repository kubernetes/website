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
Currently this feature is in alpha state. While the overall goals and functionality will not change, the way in which the GMSA credspec references are specified in pod specs may change from annotations to a API fields. Please take this into consideration when testing or adopting this feature.
{{< /note >}}

{{% /capture %}}

{{% capture body %}}

## Setup and configuration for GMSA
Configuring GMSA credential specs in the cluster and configuring individual pods and containers to be able to use them requires several steps described in details below:
1. Enable the `WindowsGMSA` feature gate on kubelet on Windows nodes.
2. Install the GMSACredentialSpec CRD
3. Create GMSA credential spec resources
4. Install webhooks to expand and validate references to GMSA credential spec resources from pod specs
5. Create cluster roles to allow service accounts to use specific GMSA credential spec resources
6. Bind roles to specific service accounts to allow them to use GMSA credential spec resources
7. Configure pods to use GMSA credential specs along with a service account authorized to use the GMSA credential specs

### Enable the WindowsGMSA feature gate
In the alpha state, the `WindowsGMSA` feature gate needs to be enabled on kubelet on Windows nodes. This is required to pass down the GMSA credential specs from the cluster scoped configurations to the container runtime. See [Feature Gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) for an explanation of enabling feature gates. Please make sure `--feature-gates=WindowsGMSA=true` parameter exists in the kubelet.exe command line.

### Install the GMSACredentialSpec CRD
A [CustomResourceDefinition](https://kubernetes.io/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/) (CRD) for GMSA credential spec resources needs to be configured on the cluster to define the custom resource type `GMSACredentialSpec`. Download the GMSA CRD [YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl#L131-L148) and save it as gmsa-crd.yaml.
Next, install the CRD with `kubectl apply -f gmsa-crd.yaml`

### Create GMSA credspec resources
With the GMSACredentialSpec CRD installed, GMSA credspec custom resources can now be configured. The GMSA credential spec does not contain secret or sensitive data. It is information that a container runtime can use to describe the desired GMSA of a container to Windows. The GMSA credspec resources can be generated in JSON format with a utility [PowerShell][] script. Following are the steps for generating a GMSA credspec YAML based on the JSON:
1. Import the CredentialSpec module: `ipmo CredentialSpec.psm1`
2. Create a credential spec in JSON format using `New-CredentialSpec`. To create a GMSA credspec named WebApp1: `New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`
3. Use `Get-CredentialSpec` to show the path of the JSON file. 
4. Convert the credspec file from JSON to YAML format and apply the necessary header fields `apiVersion`, `kind`, `metadata` and `credspec` to make it a GMSACredentialSpec custom resource. An example based on a GMSA credspec named WebApp1 is below:

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

5. Deploy the credential spec resource: `kubectl apply -f gmsa-Webapp1-credspec.yml`

[PowerShell]: https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1

### Install Webhooks for GMSA
Two webhooks need to be configured on the Kubernetes cluster to populate and validate GMSA credential spec references at the pod or container level. The mutating webhook expands references to GMSAs (by name from a pod specification) into the full credential spec in JSON form within the pod spec. The validating webhook ensures all references to GMSAs are authorized to be used by the pod service account. 

Installing the webhooks require several steps:
1. Create a certificate key pair (that will be used to allow the webhook container to communicate to the cluster)
2. Install a secret with the certificate from above.
3. Create a deployment for the core webhook logic. 
4. Create the validating and mutating webhook configurations referring to the deployment. 

The YAML file below can be used to configure the webhooks and the associated deployment and secret. Replace the values in curly braces {} with desired values, save it as `gmsa-webhooks.yml` and apply using `kubectl apply -f gmsa-webhooks.yml`

```
apiVersion: v1
kind: Secret
metadata:
  name: ${DEPLOYMENT_NAME}
  namespace: ${NAMESPACE}
data:
  tls_private_key: ${TLS_PRIVATE_KEY}
  tls_certificate: ${TLS_CERTIFICATE}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${DEPLOYMENT_NAME}
  namespace: ${NAMESPACE}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${DEPLOYMENT_NAME}
  template:
    metadata:
      labels:
        app: ${DEPLOYMENT_NAME}
    spec:
      containers:
      - name: ${DEPLOYMENT_NAME}
        image: k8ssigwindows/gmsa-admission-webhook
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 443
        volumeMounts:
          - name: tls
            mountPath: "/tls"
            readOnly: true
        env:
          - name: TLS_KEY
            value: /tls/key
          - name: TLS_CRT
            value: /tls/crt
      volumes:
      - name: tls
        secret:
          secretName: ${DEPLOYMENT_NAME}
          items:
          - key: tls_private_key
            path: key
          - key: tls_certificate
            path: crt
---
apiVersion: v1
kind: Service
metadata:
  name: ${DEPLOYMENT_NAME}
  namespace: ${NAMESPACE}
spec:
  ports:
  - port: 443
    targetPort: 443
  selector:
    app: ${DEPLOYMENT_NAME}
---
# add a label to the deployment's namespace so that we can exclude it
apiVersion: v1
kind: Namespace
metadata:
  name: ${NAMESPACE}
  labels:
    gmsa-webhook: disabled
---
apiVersion: admissionregistration.k8s.io/v1beta1
kind: ValidatingWebhookConfiguration
metadata:
  name: ${DEPLOYMENT_NAME}
webhooks:
- name: k8s-gmsa-admission-webhook.sig-windows.k8s.io
  clientConfig:
    service:
      name: ${DEPLOYMENT_NAME}
      namespace: ${NAMESPACE}
      path: "/validate"
    caBundle: ${CA_BUNDLE}
  rules:
  - operations: ["CREATE", "UPDATE"]
    apiGroups: [""]
    apiVersions: ["*"]
    resources: ["pods"]
  failurePolicy: Fail
  # don't run on ${NAMESPACE}
  namespaceSelector:
    matchExpressions:
      - key: gmsa-webhook
        operator: NotIn
        values: [disabled]
---
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingWebhookConfiguration
metadata:
  name: ${DEPLOYMENT_NAME}
webhooks:
- name: k8s-gmsa-admission-webhook.sig-windows.k8s.io
  clientConfig:
    service:
      name: ${DEPLOYMENT_NAME}
      namespace: ${NAMESPACE}
      path: "/mutate"
    caBundle: ${CA_BUNDLE}
  rules:
  - operations: ["CREATE"]
    apiGroups: [""]
    apiVersions: ["*"]
    resources: ["pods"]
  failurePolicy: Fail
  # don't run on ${NAMESPACE}
  namespaceSelector:
    matchExpressions:
    - key: gmsa-webhook
      operator: NotIn
      values: [disabled]
```

### Configure cluster role to enable RBAC on specific GMSA credential specs
A cluster role needs to be defined for each GMSA that authorizes the `use` verb on a specific GMSA resource by a subject such as a service account. The following shows an example of a cluster role that authorizes usage of gmsa-WebApp1 credspec from above. Save the file as gmsa-webapp1-role.yaml and apply using `kubectl apply -f gmsa-webapp1-role.yaml`

```
#Create the Role to read the credspec
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: my-rbac-reader
rules:
- apiGroups: ["windows.k8s.io"]
  resources: ["gmsacredentialspecs"]
  verbs: ["use"]
  resourceNames: ["gmsa-WebApp1"]
```

### Assign role to service accounts to use specific GMSA credspecs
A service account that a pod is configured with needs to be bound to the role to `use` the desired GMSA credential spec resources so that a pod's containers can be configured to use the GMSA. The following demonstrates the default service account being bound to a role to use a GMSA credential spec from above. 

```
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: allow-default-svc-account-read-on-gmsa-WebApp1
  namespace: default
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
roleRef:
  kind: ClusterRole
  name: my-rbac-reader
  apiGroup: rbac.authorization.k8s.io
```

### Configure GMSA credential spec reference in pod spec
In the alpha stage of the feature, the annotation `pod.alpha.windows.kubernetes.io/gmsa-credential-spec-name` is used to specify references to desired GMSA credential spec custom resources from pod specs. This configures all containers in the podspec to use the specified GMSA. A sample pod spec with the annotation populated:

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
        pod.alpha.windows.kubernetes.io/gmsa-credential-spec-name: gmsa-WebApp1
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
        iis.container.alpha.windows.kubernetes.io/gmsa-credential-spec-name: gmsa-WebApp1
    spec:
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
      nodeSelector:
        beta.kubernetes.io/os: windows
```

{{% /capture %}}
