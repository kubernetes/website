---
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
title: Guide for scheduling Windows containers in Kubernetes
content_type: concept
weight: 75
---

<!-- overview -->

Windows applications constitute a large portion of the services and applications that run in many organizations. 
This guide walks you through the steps to configure and deploy a Windows container in Kubernetes.


<!-- body -->

## Objectives

* Configure an example deployment to run Windows containers on the Windows node
* (Optional) Configure an Active Directory Identity for your Pod using Group Managed Service Accounts (GMSA)

## Before you begin

* Create a Kubernetes cluster that includes a 
control plane and a [worker node running Windows Server](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)
* It is important to note that creating and deploying services and workloads on Kubernetes 
behaves in much the same way for Linux and Windows containers. 
[Kubectl commands](/docs/reference/kubectl/overview/) to interface with the cluster are identical. 
The example in the section below is provided to jumpstart your experience with Windows containers.

## Getting Started: Deploying a Windows container

To deploy a Windows container on Kubernetes, you must first create an example application. 
The example YAML file below creates a simple webserver application. 
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
Port mapping is also supported, but for simplicity in this example 
the container port 80 is exposed directly to the service.
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

    * Two containers per pod on the Windows node, use `docker ps` 
    * Two pods listed from the Linux control plane node, use `kubectl get pods` 
    * Node-to-pod communication across the network, `curl` port 80 of your pod IPs from the Linux control plane node 
      to check for a web server response
    * Pod-to-pod communication, ping between pods (and across hosts, if you have more than one Windows node) 
      using docker exec or kubectl exec
    * Service-to-pod communication, `curl` the virtual service IP (seen under `kubectl get services`) 
      from the Linux control plane node and from individual pods
    * Service discovery, `curl` the service name with the Kubernetes [default DNS suffix](/docs/concepts/services-networking/dns-pod-service/#services)
    * Inbound connectivity, `curl` the NodePort from the Linux control plane node or machines outside of the cluster
    * Outbound connectivity, `curl` external IPs from inside the pod using kubectl exec

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

## Using configurable Container usernames

Starting with Kubernetes v1.16, Windows containers can be configured to run their entrypoints and processes 
with different usernames than the image defaults. 
The way this is achieved is a bit different from the way it is done for Linux containers. 
Learn more about it [here](/docs/tasks/configure-pod-container/configure-runasusername/).

## Managing Workload Identity with Group Managed Service Accounts

Starting with Kubernetes v1.14, Windows container workloads can be configured to use Group Managed Service Accounts (GMSA). 
Group Managed Service Accounts are a specific type of Active Directory account that provides automatic password management, 
simplified service principal name (SPN) management, and the ability to delegate the management to other administrators across multiple servers. 
Containers configured with a GMSA can access external Active Directory Domain resources while carrying the identity configured with the GMSA. 
Learn more about configuring and using GMSA for Windows containers [here](/docs/tasks/configure-pod-container/configure-gmsa/).

## Taints and Tolerations

Users today need to use some combination of taints and node selectors in order to 
keep Linux and Windows workloads on their respective OS-specific nodes. 
This likely imposes a burden only on Windows users. The recommended approach is outlined below, 
with one of its main goals being that this approach should not break compatibility for existing Linux workloads.
 {{< note >}}
If the `IdentifyPodOS` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is
enabled, you can (and should) set `.spec.os.name` for a Pod to indicate the operating system
that the containers in that Pod are designed for. For Pods that run Linux containers, set
`.spec.os.name` to `linux`. For Pods that run Windows containers, set `.spec.os.name`
to Windows.

The scheduler does not use the value of `.spec.os.name` when assigning Pods to nodes. You should
use normal Kubernetes mechanisms for
[assigning pods to nodes](/docs/concepts/scheduling-eviction/assign-pod-node/)
to ensure that the control plane for your cluster places pods onto nodes that are running the
appropriate operating system.
 no effect on the scheduling of the Windows pods, so taints and tolerations and node selectors are still required
 to ensure that the Windows pods land onto appropriate Windows nodes.
 {{< /note >}}
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
| Windows Server version 1809          | 10.0.17763             |
| Windows Server version 1903          | 10.0.18362             |


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




[RuntimeClass]: https://kubernetes.io/docs/concepts/containers/runtime-class/


# Node-level troubleshooting {#troubleshooting-node}

1. How do I know `start.ps1` completed successfully?

   You should see kubelet, kube-proxy, and (if you chose Flannel as your networking
   solution) flanneld host-agent processes running on your node, with running logs
   being displayed in separate PowerShell windows. In addition to this, your Windows
   node should be listed as "Ready" in your Kubernetes cluster.

1. Can I configure the Kubernetes node processes to run in the background as services?

   The kubelet and kube-proxy are already configured to run as native Windows Services,
   offering resiliency by re-starting the services automatically in the event of
   failure (for example a process crash). You have two options for configuring these
   node components as services.

    1. As native Windows Services

        You can run the kubelet and kube-proxy as native Windows Services using `sc.exe`.

        ```powershell
        # Create the services for kubelet and kube-proxy in two separate commands
        sc.exe create <component_name> binPath= "<path_to_binary> --service <other_args>"

        # Please note that if the arguments contain spaces, they must be escaped.
        sc.exe create kubelet binPath= "C:\kubelet.exe --service --hostname-override 'minion' <other_args>"

        # Start the services
        Start-Service kubelet
        Start-Service kube-proxy

        # Stop the service
        Stop-Service kubelet (-Force)
        Stop-Service kube-proxy (-Force)

        # Query the service status
        Get-Service kubelet
        Get-Service kube-proxy
        ```

    1. Using `nssm.exe`

       You can also always use alternative service managers like
       [nssm.exe](https://nssm.cc/) to run these processes (flanneld,
       kubelet & kube-proxy) in the background for you. You can use this
       [sample script](https://github.com/Microsoft/SDN/tree/master/Kubernetes/flannel/register-svc.ps1),
       leveraging nssm.exe to register kubelet, kube-proxy, and flanneld.exe to run
       as Windows services in the background.

       ```powershell
       register-svc.ps1 -NetworkMode <Network mode> -ManagementIP <Windows Node IP> -ClusterCIDR <Cluster subnet> -KubeDnsServiceIP <Kube-dns Service IP> -LogDir <Directory to place logs>

       # NetworkMode      = The network mode l2bridge (flannel host-gw, also the default value) or overlay (flannel vxlan) chosen as a network solution
       # ManagementIP     = The IP address assigned to the Windows node. You can use ipconfig to find this
       # ClusterCIDR      = The cluster subnet range. (Default value 10.244.0.0/16)
       # KubeDnsServiceIP = The Kubernetes DNS service IP (Default value 10.96.0.10)
       # LogDir           = The directory where kubelet and kube-proxy logs are redirected into their respective output files (Default value C:\k)
       ```

       If the above referenced script is not suitable, you can manually configure
       `nssm.exe` using the following examples.

       ```powershell
       # Register flanneld.exe
       nssm install flanneld C:\flannel\flanneld.exe
       nssm set flanneld AppParameters --kubeconfig-file=c:\k\config --iface=<ManagementIP> --ip-masq=1 --kube-subnet-mgr=1
       nssm set flanneld AppEnvironmentExtra NODE_NAME=<hostname>
       nssm set flanneld AppDirectory C:\flannel
       nssm start flanneld

       # Register kubelet.exe
       # Microsoft releases the pause infrastructure container at mcr.microsoft.com/oss/kubernetes/pause:3.6
       nssm install kubelet C:\k\kubelet.exe
       nssm set kubelet AppParameters --hostname-override=<hostname> --v=6 --pod-infra-container-image=mcr.microsoft.com/oss/kubernetes/pause:3.6 --resolv-conf="" --allow-privileged=true --enable-debugging-handlers --cluster-dns=<DNS-service-IP> --cluster-domain=cluster.local --kubeconfig=c:\k\config --hairpin-mode=promiscuous-bridge --image-pull-progress-deadline=20m --cgroups-per-qos=false  --log-dir=<log directory> --logtostderr=false --enforce-node-allocatable="" --network-plugin=cni --cni-bin-dir=c:\k\cni --cni-conf-dir=c:\k\cni\config
       nssm set kubelet AppDirectory C:\k
       nssm start kubelet

       # Register kube-proxy.exe (l2bridge / host-gw)
       nssm install kube-proxy C:\k\kube-proxy.exe
       nssm set kube-proxy AppDirectory c:\k
       nssm set kube-proxy AppParameters --v=4 --proxy-mode=kernelspace --hostname-override=<hostname>--kubeconfig=c:\k\config --enable-dsr=false --log-dir=<log directory> --logtostderr=false
       nssm.exe set kube-proxy AppEnvironmentExtra KUBE_NETWORK=cbr0
       nssm set kube-proxy DependOnService kubelet
       nssm start kube-proxy

       # Register kube-proxy.exe (overlay / vxlan)
       nssm install kube-proxy C:\k\kube-proxy.exe
       nssm set kube-proxy AppDirectory c:\k
       nssm set kube-proxy AppParameters --v=4 --proxy-mode=kernelspace --feature-gates="WinOverlay=true" --hostname-override=<hostname> --kubeconfig=c:\k\config --network-name=vxlan0 --source-vip=<source-vip> --enable-dsr=false --log-dir=<log directory> --logtostderr=false
       nssm set kube-proxy DependOnService kubelet
       nssm start kube-proxy
       ```

       For initial troubleshooting, you can use the following flags in [nssm.exe](https://nssm.cc/) to redirect stdout and stderr to a output file:

       ```powershell
       nssm set <Service Name> AppStdout C:\k\mysvc.log
       nssm set <Service Name> AppStderr C:\k\mysvc.log
       ```

       For additional details, see [NSSM - the Non-Sucking Service Manager](https://nssm.cc/usage).

1. My Pods are stuck at "Container Creating" or restarting over and over

   Check that your pause image is compatible with your OS version. The
   [instructions](https://docs.microsoft.com/en-us/virtualization/windowscontainers/kubernetes/deploying-resources)
   assume that both the OS and the containers are version 1803. If you have a later
   version of Windows, such as an Insider build, you need to adjust the images
   accordingly. See [Pause container](#pause-container) for more details.
