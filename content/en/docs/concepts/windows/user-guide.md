---
reviewers:
- jayunit100
- jsturtevant
- marosset
title: Guide for scheduling Windows containers in Kubernetes
content_type: concept
weight: 75
---

<!-- overview -->

Windows applications constitute a large portion of the services and applications that run in many organizations.
This guide walks you through the steps to configure and deploy Windows containers in Kubernetes.

<!-- body -->

## Objectives

* Configure an example deployment to run Windows containers on the Windows node
* Highlight Windows specific functionality in Kubernetes

## Overview of Kubernetes Architecture

Kubernetes is an **open-source platform** that automates container _deployment_, _scaling_, and _management_. It is designed to simplify the process of managing containerized applications and can be used to manage both simple and complex containerized applications at scale. Understanding the architecture of Kubernetes is crucial when working with the platform.

The **architecture** of Kubernetes is composed of two main components: the control plane and worker nodes. The control plane manages the Kubernetes API, etcd, and various controllers, while the worker nodes run containers.

### Control Plane:
The control plane is responsible for managing the state of the cluster and consists of several components, including:
- **API Server:** The Kubernetes API server provides access to the control plane and worker nodes, allowing users to manage and deploy workloads to the cluster.
- **etcd:** etcd is a distributed key-value store that stores the configuration data of the cluster.
- **kube-controller-manager:** The kube-controller-manager is responsible for managing various controllers that regulate the state of the cluster.
- **kube-scheduler:** The kube-scheduler is responsible for scheduling workloads to run on worker nodes.
- **cloud-controller-manager:** The cloud-controller-manager is responsible for managing the cloud-specific integrations of the cluster.

### Worker Nodes:
Worker nodes run containers and include several components that interact with the control plane to manage the containers running on the node. These components include:
- **kubelet:** The kubelet is responsible for communicating with the control plane and managing the containers running on the node.
- **kube-proxy:** The kube-proxy is responsible for managing the networking between containers running on the node.
- **Container Runtime:** The container runtime is responsible for running the containers on the node.

When creating a Kubernetes cluster, it's essential to choose the right set of components and resources that meet your requirements. You can customize the cluster by selecting the appropriate network and storage plugins, authentication and authorization mechanisms, and other configurations that match your needs.

In the section below, you will find an example that demonstrates how to create a Kubernetes cluster that includes a control plane and a worker node running Windows Server. This example assumes that you have already set up a Windows Server environment and have installed the necessary prerequisites to run Kubernetes.

## Before you begin

* Create a Kubernetes cluster that includes a control plane and a worker node running Windows Server
* It is important to note that creating and deploying services and workloads on Kubernetes
  behaves in much the same way for Linux and Windows containers.
  [Kubectl commands](/docs/reference/kubectl/) to interface with the cluster are identical.
  The example in the section below is provided to jumpstart your experience with Windows containers.

## Getting Started: Deploying a Windows container

The example YAML file below deploys a simple webserver application running inside a Windows container.

Create a service spec named `win-webserver.yaml` with the contents below:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: win-webserver
  labels:
    app: win-webserver
spec:
  ports:
    # the port that this service should serve on
    - port: 80
      targetPort: 80
  selector:
    app: win-webserver
  type: NodePort
---
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: win-webserver
  name: win-webserver
spec:
  replicas: 2
  selector:
    matchLabels:
      app: win-webserver
  template:
    metadata:
      labels:
        app: win-webserver
      name: win-webserver
    spec:
     containers:
      - name: windowswebserver
        image: mcr.microsoft.com/windows/servercore:ltsc2019
        command:
        - powershell.exe
        - -command
        - "<#code used from https://gist.github.com/19WAS85/5424431#> ; $$listener = New-Object System.Net.HttpListener ; $$listener.Prefixes.Add('http://*:80/') ; $$listener.Start() ; $$callerCounts = @{} ; Write-Host('Listening at http://*:80/') ; while ($$listener.IsListening) { ;$$context = $$listener.GetContext() ;$$requestUrl = $$context.Request.Url ;$$clientIP = $$context.Request.RemoteEndPoint.Address ;$$response = $$context.Response ;Write-Host '' ;Write-Host('> {0}' -f $$requestUrl) ;  ;$$count = 1 ;$$k=$$callerCounts.Get_Item($$clientIP) ;if ($$k -ne $$null) { $$count += $$k } ;$$callerCounts.Set_Item($$clientIP, $$count) ;$$ip=(Get-NetAdapter | Get-NetIpAddress); $$header='<html><body><H1>Windows Container Web Server</H1>' ;$$callerCountsString='' ;$$callerCounts.Keys | % { $$callerCountsString+='<p>IP {0} callerCount {1} ' -f $$ip[1].IPAddress,$$callerCounts.Item($$_) } ;$$footer='</body></html>' ;$$content='{0}{1}{2}' -f $$header,$$callerCountsString,$$footer ;Write-Output $$content ;$$buffer = [System.Text.Encoding]::UTF8.GetBytes($$content) ;$$response.ContentLength64 = $$buffer.Length ;$$response.OutputStream.Write($$buffer, 0, $$buffer.Length) ;$$response.Close() ;$$responseStatus = $$response.StatusCode ;Write-Host('< {0}' -f $$responseStatus)  } ; "
     nodeSelector:
      kubernetes.io/os: windows
```

{{< note >}}
Port mapping is also supported, but for simplicity this example exposes
port 80 of the container directly to the Service.
{{< /note >}}

1. Check that all nodes are healthy:

    ```bash
    kubectl get nodes
    ```

1. Deploy the service and watch for pod updates:

    ```bash
    kubectl apply -f win-webserver.yaml
    kubectl get pods -o wide -w
    ```

    When the service is deployed correctly both Pods are marked as Ready. To exit the watch command, press Ctrl+C.

1. Check that the deployment succeeded. To verify:

    * Two pods listed from the Linux control plane node, use `kubectl get pods`
    * Node-to-pod communication across the network, `curl` port 80 of your pod IPs from the Linux control plane node
      to check for a web server response
    * Pod-to-pod communication, ping between pods (and across hosts, if you have more than one Windows node)
      using `docker exec` or `kubectl exec`
    * Service-to-pod communication, `curl` the virtual service IP (seen under `kubectl get services`)
      from the Linux control plane node and from individual pods
    * Service discovery, `curl` the service name with the Kubernetes [default DNS suffix](/docs/concepts/services-networking/dns-pod-service/#services)
    * Inbound connectivity, `curl` the NodePort from the Linux control plane node or machines outside of the cluster
    * Outbound connectivity, `curl` external IPs from inside the pod using `kubectl exec`

{{< note >}}
Windows container hosts are not able to access the IP of services scheduled on them due to current platform limitations of the Windows networking stack.
Only Windows pods are able to access service IPs.
{{< /note >}}

## Observability

### Capturing logs from workloads

Logs are an important element of observability; they enable users to gain insights
into the operational aspect of workloads and are a key ingredient to troubleshooting issues.
Because Windows containers and workloads inside Windows containers behave differently from Linux containers,
users had a hard time collecting logs, limiting operational visibility.
Windows workloads for example are usually configured to log to ETW (Event Tracing for Windows)
or push entries to the application event log.
[LogMonitor](https://github.com/microsoft/windows-container-tools/tree/master/LogMonitor), an open source tool by Microsoft,
is the recommended way to monitor configured log sources inside a Windows container.
LogMonitor supports monitoring event logs, ETW providers, and custom application logs,
piping them to STDOUT for consumption by `kubectl logs <pod>`.

Follow the instructions in the LogMonitor GitHub page to copy its binaries and configuration files
to all your containers and add the necessary entrypoints for LogMonitor to push your logs to STDOUT.

## Configuring container user

### Using configurable Container usernames

Windows containers can be configured to run their entrypoints and processes
with different usernames than the image defaults.
Learn more about it [here](/docs/tasks/configure-pod-container/configure-runasusername/).

### Managing Workload Identity with Group Managed Service Accounts

Windows container workloads can be configured to use Group Managed Service Accounts (GMSA).
Group Managed Service Accounts are a specific type of Active Directory account that provide automatic password management,
simplified service principal name (SPN) management, and the ability to delegate the management to other administrators across multiple servers.
Containers configured with a GMSA can access external Active Directory Domain resources while carrying the identity configured with the GMSA.
Learn more about configuring and using GMSA for Windows containers [here](/docs/tasks/configure-pod-container/configure-gmsa/).

## Taints and Tolerations

Users need to use some combination of taints and node selectors in order to
schedule Linux and Windows workloads to their respective OS-specific nodes.
The recommended approach is outlined below,
with one of its main goals being that this approach should not break compatibility for existing Linux workloads.

Starting from 1.25, you can (and should) set `.spec.os.name` for each Pod, to indicate the operating system
that the containers in that Pod are designed for. For Pods that run Linux containers, set
`.spec.os.name` to `linux`. For Pods that run Windows containers, set `.spec.os.name`
to `windows`.

The scheduler does not use the value of `.spec.os.name` when assigning Pods to nodes. You should
use normal Kubernetes mechanisms for
[assigning pods to nodes](/docs/concepts/scheduling-eviction/assign-pod-node/)
to ensure that the control plane for your cluster places pods onto nodes that are running the
appropriate operating system.

The `.spec.os.name` value has no effect on the scheduling of the Windows pods,
so taints and tolerations and node selectors are still required
 to ensure that the Windows pods land onto appropriate Windows nodes.

### Ensuring OS-specific workloads land on the appropriate container host

Users can ensure Windows containers can be scheduled on the appropriate host using Taints and Tolerations.
All Kubernetes nodes today have the following default labels:

* kubernetes.io/os = [windows|linux]
* kubernetes.io/arch = [amd64|arm64|...]

If a Pod specification does not specify a nodeSelector like `"kubernetes.io/os": windows`,
it is possible the Pod can be scheduled on any host, Windows or Linux.
This can be problematic since a Windows container can only run on Windows and a Linux container can only run on Linux.
The best practice is to use a nodeSelector.

However, we understand that in many cases users have a pre-existing large number of deployments for Linux containers,
as well as an ecosystem of off-the-shelf configurations, such as community Helm charts, and programmatic Pod generation cases, such as with Operators.
In those situations, you may be hesitant to make the configuration change to add nodeSelectors.
The alternative is to use Taints. Because the kubelet can set Taints during registration,
it could easily be modified to automatically add a taint when running on Windows only.

For example:  `--register-with-taints='os=windows:NoSchedule'`

By adding a taint to all Windows nodes, nothing will be scheduled on them (that includes existing Linux Pods).
In order for a Windows Pod to be scheduled on a Windows node, 
it would need both the nodeSelector and the appropriate matching toleration to choose Windows.

```yaml
nodeSelector:
    kubernetes.io/os: windows
    node.kubernetes.io/windows-build: '10.0.17763'
tolerations:
    - key: "os"
      operator: "Equal"
      value: "windows"
      effect: "NoSchedule"
```

### Handling multiple Windows versions in the same cluster

The Windows Server version used by each pod must match that of the node. If you want to use multiple Windows
Server versions in the same cluster, then you should set additional node labels and nodeSelectors.

Kubernetes 1.17 automatically adds a new label `node.kubernetes.io/windows-build` to simplify this.
If you're running an older version, then it's recommended to add this label manually to Windows nodes.

This label reflects the Windows major, minor, and build number that need to match for compatibility.
Here are values used today for each Windows Server version.

| Product Name                         |   Build Number(s)      |
|--------------------------------------|------------------------|
| Windows Server 2019                  | 10.0.17763             |
| Windows Server, Version 20H2         | 10.0.19042             |
| Windows Server 2022                  | 10.0.20348             |

### Simplifying with RuntimeClass

[RuntimeClass] can be used to simplify the process of using taints and tolerations.
A cluster administrator can create a `RuntimeClass` object which is used to encapsulate these taints and tolerations.

1. Save this file to `runtimeClasses.yml`. It includes the appropriate `nodeSelector`
for the Windows OS, architecture, and version.

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: windows-2019
handler: 'docker'
scheduling:
  nodeSelector:
    kubernetes.io/os: 'windows'
    kubernetes.io/arch: 'amd64'
    node.kubernetes.io/windows-build: '10.0.17763'
  tolerations:
  - effect: NoSchedule
    key: os
    operator: Equal
    value: "windows"
```

1. Run `kubectl create -f runtimeClasses.yml` using as a cluster administrator
1. Add `runtimeClassName: windows-2019` as appropriate to Pod specs

For example:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: iis-2019
  labels:
    app: iis-2019
spec:
  replicas: 1
  template:
    metadata:
      name: iis-2019
      labels:
        app: iis-2019
    spec:
      runtimeClassName: windows-2019
      containers:
      - name: iis
        image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        resources:
          limits:
            cpu: 1
            memory: 800Mi
          requests:
            cpu: .1
            memory: 300Mi
        ports:
          - containerPort: 80
 selector:
    matchLabels:
      app: iis-2019
---
apiVersion: v1
kind: Service
metadata:
  name: iis
spec:
  type: LoadBalancer
  ports:
  - protocol: TCP
    port: 80
  selector:
    app: iis-2019
```

[RuntimeClass]: /docs/concepts/containers/runtime-class/


## Troubleshooting Common Issues

When deploying Windows containers in Kubernetes, users may face several issues. Here are some common ones and how to address them:

- <ins>**Node selector errors:**</ins> 
Ensure that the nodeSelector field in the deployment spec matches the label applied to the Windows worker node correctly. Double-check the spelling of the label and make sure that it matches the key-value pair specified in the nodeSelector field.

- <ins>**Networking issues:**</ins> 
Due to current platform limitations of the Windows networking stack, Windows container hosts cannot access the IP of services scheduled on them. Only Windows pods can access service IPs. To verify network connectivity, try pinging between pods and nodes, and from outside the cluster. Curl the virtual service IP from the Linux control plane node and from individual pods to ensure that service-to-pod communication is working. Also, check that the kube-proxy service is running on each node, and that Windows firewall rules are set up correctly to allow communication between pods and services.

- <ins>**Image pull errors:**</ins> 
Verify that the image repository is accessible from the worker node, and that the image name and tag are spelled correctly in the deployment spec.

- <ins>**Resource allocation errors:**</ins> 
Windows containers may have different resource requirements than Linux containers, so make sure that the resource limits and requests in the deployment spec are appropriate for the application running in the container.

- <ins>**Permission errors:**</ins> 
Check that the service account associated with the pod has the necessary permissions to access any required resources or APIs.

- <ins>**Logging issues:**</ins> 
Collecting logs from Windows containers and workloads inside Windows containers can be challenging. Ensure that the logging driver is configured correctly, and that the logs are being forwarded to the correct destination for analysis. Consider using a logging solution specifically designed for Windows containers, such as Fluentd or Event Viewer.

Note: It's important to keep in mind that troubleshooting common issues is just the first step in successfully deploying Windows containers in Kubernetes. Continuously monitoring the containers and the Kubernetes environment can help detect and prevent issues before they occur, ensuring smooth operation and better performance.
