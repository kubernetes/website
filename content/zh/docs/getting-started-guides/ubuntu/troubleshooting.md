---
title: 故障排除
---

<!-- ---
title: Troubleshooting
content_template: templates/task
--- -->

{{% capture overview %}}

<!-- This document with highlighting how to troubleshoot the deployment of a Kubernetes cluster,
it will not cover debugging of workloads inside Kubernetes. -->

本文重点讨论如何解决 Kubernetes 集群部署过程中的问题，
而不会关心如何调试 Kubernetes 集群内的工作负载。

{{% /capture %}}

{{% capture prerequisites %}}

<!-- This page assumes you have a working Juju deployed cluster. -->

本文假设您已经有一个用 Juju 部署、正在工作的集群。

{{% /capture %}}

{{% capture steps %}}

<!-- ## Understanding Cluster Status -->
## 了解集群状态

<!-- Using `juju status` can give you some insight as to what's happening in a cluster: -->
使用 `juju status` 命令可以了解一些集群内的情况：

```
Model  Controller  Cloud/Region   Version
kubes  work-multi  aws/us-east-2  2.0.2.1

App                Version  Status  Scale  Charm              Store       Rev  OS      Notes
easyrsa            3.0.1    active      1  easyrsa            jujucharms    3  ubuntu
etcd               2.2.5    active      1  etcd               jujucharms   17  ubuntu
flannel            0.6.1    active      2  flannel            jujucharms    6  ubuntu
kubernetes-master  1.4.5    active      1  kubernetes-master  jujucharms    8  ubuntu  exposed
kubernetes-worker  1.4.5    active      1  kubernetes-worker  jujucharms   11  ubuntu  exposed

Unit                  Workload  Agent  Machine  Public address  Ports           Message
easyrsa/0*            active    idle   0/lxd/0  10.0.0.55                       Certificate Authority connected.
etcd/0*               active    idle   0        52.15.47.228    2379/tcp        Healthy with 1 known peers.
kubernetes-master/0*  active    idle   0        52.15.47.228    6443/tcp        Kubernetes master services ready.
  flannel/1           active    idle            52.15.47.228                    Flannel subnet 10.1.75.1/24
kubernetes-worker/0*  active    idle   1        52.15.177.233   80/tcp,443/tcp  Kubernetes worker running.
  flannel/0*          active    idle            52.15.177.233                   Flannel subnet 10.1.63.1/24

Machine  State    DNS            Inst id              Series  AZ
0        started  52.15.47.228   i-0bb211a18be691473  xenial  us-east-2a
0/lxd/0  started  10.0.0.55      juju-153b74-0-lxd-0  xenial
1        started  52.15.177.233  i-0502d7de733be31bb  xenial  us-east-2b
```

<!-- In this example we can glean some information. The `Workload` column will show the status of a given service.
The `Message` section will show you the health of a given service in the cluster.
During deployment and maintenance these workload statuses will update to
reflect what a given node is doing. For example the workload my say `maintenance`
while message will describe this maintenance as `Installing docker`. -->

在这个例子中，我们可以获取一些信息。 `Workload` 列将显示给定服务的状态。
`Message` 部分将显示集群中给定服务的健康状况。 在部署和维护期间，
这些工作负载状态将进行更新以反映给定节点正在执行的操作。例如，
Workload 可能显示为 `maintenance`，而 Message 则会相应显示为 `Installing docker`。

<!-- During normal operation the Workload should read `active`,
the Agent column (which reflects what the Juju agent is doing) should read `idle`,
and the messages will either say `Ready` or another descriptive term.
`juju status --color` will also return all green results when a cluster's deployment is healthy. -->

正常情况下，Workload 列应该为 `active`，Agent 列（用于反映 Juju 代理正在做什么）应该为 `idle`，
而 Message 要么是 `Ready` 或者其它描述性的术语。
如果集群运行健康，`juju status --color` 返回的结果输出都将是绿色的。

<!-- Status can become unwieldy for large clusters, it is then recommended to
check status on individual services, for example to check the status on the workers only: -->

对于大型集群而言，状态信息可能会太多，因此建议检查各个服务的状态，例如仅检查工作节点的状态：

    juju status kubernetes-worker

<!-- or just on the etcd cluster: -->
或者只检查 etcd 集群的状态：

    juju status etcd

Errors will have an obvious message, and will return a red result when used with
`juju status --color`. Nodes that come up in this manner should be investigated.

错误都会有明显的错误信息，使用 `juju status --color` 的返回结果也将是红色的。
如果节点状态出现这种情况，需要相应地检查了解。

<!-- ## SSHing to units -->
## SSH 到各个单元上

<!-- You can ssh to individual units easily with the following convention,
`juju ssh <servicename>/<unit#>`: -->

按照 `juju ssh <服务名>/<单元#>` 的命令格式可以轻松地连接到各个单元上：

    juju ssh kubernetes-worker/3

<!-- Will automatically ssh you to the 3rd worker unit. -->
将会 ssh 到第 3 个工作单元上。

    juju ssh easyrsa/0

<!-- This will automatically ssh you to the easyrsa unit. -->
将会 ssh 到第 0 个 easyrsa 单元上。

<!-- ## Collecting debug information -->
## 收集调试信息

<!-- Sometimes it is useful to collect all the information from a cluster
to share with a developer to identify problems. This is best accomplished with [CDK Field Agent](https://github.com/juju-solutions/cdk-field-agent). -->

有时候，从集群上收集所有的信息，并与开发人员共享，将有助于发现问题。
这最好是通过 [CDK Field Agent](https://github.com/juju-solutions/cdk-field-agent) 来完成。

<!-- Download and execute the collect.py script from [CDK Field Agent](https://github.com/juju-solutions/cdk-field-agent) on a box that has a Juju client configured with the current controller and model pointing at the CDK deployment of interest. -->

在带有 Juju 客户端，而客户端配有指向相应的 CDK 部署的控制器的节点上，
下载并执行[CDK Field Agent](https://github.com/juju-solutions/cdk-field-agent)中的 collect.py 文件。

<!-- Running the script will generate a tarball of system information and includes basic information such as systemctl status, Juju logs, charm unit data, etc. Additional application-specific information may be included as well. -->

运行该脚本会生成一个 tar 包，包含系统信息以及诸如 systemctl 状态，Juju 日志，charm 单元数据等基本信息。
额外和应用相关的信息可能也会包含其中。

<!-- ## Common Problems -->

## 常见问题

<!-- ### Load Balancer interfering with Helm -->

### 负载均衡器对 Helm 的影响

<!-- This section assumes you have a working deployment of Kubernetes via Juju
using a Load Balancer for the API, and that you are using Helm to deploy charts. -->

本节假定有一个用 Juju 部署的正在运行的 Kubernetes 集群，使用负载均衡器来代理 API，同时也用 Helm 来进行 chart 部署。

<!-- To deploy Helm you will have run: -->
Helm 初始化：

```
helm init
$HELM_HOME has been configured at /home/ubuntu/.helm
Tiller (the helm server side component) has been installed into your Kubernetes Cluster.
Happy Helming!
```

<!-- Then when using helm you may see one of the following errors: -->
随后使用 helm 时，可能会出现以下错误：

<!-- * Helm doesn't get the version from the Tiller server -->
* Helm 不能从 Tiller 服务器获取版本号

```
helm version
Client: &version.Version{SemVer:"v2.1.3", GitCommit:"5cbc48fb305ca4bf68c26eb8d2a7eb363227e973", GitTreeState:"clean"}
Error: cannot connect to Tiller
```

<!-- * Helm cannot install your chart -->
* Helm 不能安装 chart

```
helm install <chart> --debug
Error: forwarding ports: error upgrading connection: Upgrade request required
```

<!-- This is caused by the API load balancer not forwarding ports in the context of the helm client-server relationship.
To deploy using helm, you will need to follow these steps: -->

这是因为 API 负载均衡器在 helm 客户端-服务端关系的上下文中不进行端口转发造成的。
要使用 helm 进行部署，需要执行以下步骤：

<!-- 1. Expose the Kubernetes Master service -->
1. 暴露 Kubernetes Master 服务

   ```
   juju expose kubernetes-master
   ```

<!-- 1. Identify the public IP address of one of your masters -->
1. 确定其中一个主节点的公开 IP 地址

   ```
   juju status kubernetes-master
   Model       Controller  Cloud/Region   Version
   production  k8s-admin   aws/us-east-1  2.0.0

   App                Version  Status  Scale  Charm              Store       Rev  OS      Notes
   flannel            0.6.1    active      1  flannel            jujucharms    7  ubuntu
   kubernetes-master  1.5.1    active      1  kubernetes-master  jujucharms   10  ubuntu  exposed

   Unit                  Workload  Agent  Machine  Public address  Ports     Message
   kubernetes-master/0*  active    idle   5        54.210.100.102    6443/tcp  Kubernetes master running.
     flannel/0           active    idle            54.210.100.102              Flannel subnet 10.1.50.1/24

   Machine  State    DNS           Inst id              Series  AZ
   5        started  54.210.100.102  i-002b7150639eb183b  xenial  us-east-1a

   Relation      Provides               Consumes           Type
   certificates  easyrsa                kubernetes-master  regular
   etcd          etcd                   flannel            regular
   etcd          etcd                   kubernetes-master  regular
   cni           flannel                kubernetes-master  regular
   loadbalancer  kubeapi-load-balancer  kubernetes-master  regular
   cni           kubernetes-master      flannel            subordinate
   cluster-dns   kubernetes-master      kubernetes-worker  regular
   cni           kubernetes-worker      flannel            subordinate
   ```

   <!-- In this context the public IP address is 54.210.100.102.

   If you want to access this data programmatically you can use the JSON output: -->

   本例中，公开 IP 地址为 54.210.100.102。
   如果想编程访问得到这个值，可以使用 JSON 输出：

   ```
   juju show-status kubernetes-master --format json | jq --raw-output '.applications."kubernetes-master".units | keys[]'
   54.210.100.102
   ```

<!-- 1. Update the kubeconfig file -->
1. 更新 kubeconfig 文件

   <!-- Identify the kubeconfig file or section used for this cluster, and edit the server configuration.

   By default, it will look like ```https://54.213.123.123:443```. Replace it with the Kubernetes Master endpoint ```https://54.210.100.102:6443``` and save.

   Note that the default port used by CDK for the Kubernetes Master API is 6443 while the port exposed by the load balancer is 443. -->

   确定集群所使用的 kubeconfig 文件或配置部分，然后修改服务器配置。

   默认情况下，这个配置类似于 ```https://54.213.123.123:443```。将其替换为 Kubernetes Master 端点地址
   ```https://54.210.100.102:6443``` 并保存。

   注意，Kubernetes Master API 的 CDK 默认使用的端口为 6443，而负载均衡器暴露的端口是 443。

<!-- 1. Start helm again! -->
1. 继续使用 helm！

   ```
   helm install <chart> --debug
   Created tunnel using local port: '36749'
   SERVER: "localhost:36749"
   CHART PATH: /home/ubuntu/.helm/<chart>
   NAME:   <chart>
   ...
   ...
   ```

<!-- ## Logging and monitoring -->
## 日志和监控

<!-- By default there is no log aggregation of the Kubernetes nodes, each node logs locally.
Please read over the [logging](/docs/getting-started-guides/ubuntu/logging/) page for more information. -->

默认情况下， Kubernetes 没有节点的日志聚合，每个节点都是本地保存日志。
请参阅[日志](/docs/getting-started-guides/ubuntu/logging/)文档，获取更多信息。

{{% /capture %}}
