---
title: 故障排除
---
<!--
---
title: Troubleshooting
---
-->


{% capture overview %}
<!--
This document with highlighting how to troubleshoot the deployment of a Kubernetes cluster, it will not cover debugging of workloads inside Kubernetes. 
-->
本文档重点介绍如何解决 Kubernetes 集群的部署问题，但不包括 Kubernetes 内部工作负载的调试。
{% endcapture %}
{% capture prerequisites %}
<!--
This page assumes you have a working Juju deployed cluster.
-->
本文假设您已经拥有一个正在运行的使用 Juju 部署的集群。
{% endcapture %}

{% capture steps %}
<!--
## Understanding Cluster Status

Using `juju status` can give you some insight as to what's happening in a cluster:
-->
## 了解集群状态

使用 `juju status` 可以让您对集群中发生的事情有一些了解：


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

<!--
In this example we can glean some information. The `Workload` column will show the status of a given service. The `Message` section will show you the health of a given service in the cluster. During deployment and maintenance these workload statuses will update to reflect what a given node is doing. For example the workload my say `maintenance` while message will describe this maintenance as `Installing docker`.
-->
在这个例子中，我们可以收集一些信息。 `Workload` 列将显示给定服务的状态。`Message` 部分将显示集群中给定服务的健康状况。 在部署和维护期间，这些工作负载状态将进行更新以反映给定节点正在执行的操作。例如，Workload 可能显示为 `maintenance`，同时 Message 将会描述 maintenance 为 `Installing docker`。

<!--
During normal operation the Workload should read `active`, the Agent column (which reflects what the Juju agent is doing) should read `idle`, and the messages will either say `Ready` or another descriptive term. `juju status --color` will also return all green results when a cluster's deployment is healthy. 
-->
正常情况下，Workload 应该为 `active`，Agent （用于反映 Juju 代理正在做什么）应该为 `idle`，并且 Message 要么是 `Ready` 或者其它描述性的术语。当群集的部署健康时，`juju status --color` 将返回所有绿色结果。

<!--
Status can become unwieldy for large clusters, it is then recommended to check status on individual services, for example to check the status on the workers only:
-->
对于大型集群来说，状态可能会变得很笨重，因此建议检查各个服务的状态，例如仅检查工作节点的状态：

    juju status kubernetes-workers

<!--
or just on the etcd cluster:
-->
或者只检查 etcd 集群：

    juju status etcd

<!--
Errors will have an obvious message, and will return a red result when used with `juju status --color`. Nodes that come up in this manner should be investigated.   
-->
错误将会有一个明显的信息，并且使用 `juju status --color` 查询时会返回一个红色的结果。如果节点出现这种情况，那么您应该仔细检查它的状态。

<!--
## SSHing to units
-->
## SSH 连接到各单元

<!--
You can ssh to individual units easily with the following convention, `juju ssh <servicename>/<unit#>`:
-->
您可以通过以下方法轻松地连接到各独立的单元，`juju ssh <servicename>/<unit#>`：

    juju ssh kubernetes-worker/3

<!--
Will automatically ssh you to the 3rd worker unit.
-->
这将自动通过 ssh 连接到第三个工作单元。

    juju ssh easyrsa/0 

<!--
This will automatically ssh you to the easyrsa unit. 
-->
这将自动通过 ssh 连接到 easyrsa 单元。

<!--
## Collecting debug information
-->
## 收集调试信息

<!--
Sometimes it is useful to collect all the information from a node to share with a developer so problems can be identifying. This section will deal on how to use the debug action to collect this information. The debug action is only supported on `kubernetes-worker` nodes.
-->
有时收集节点上的所有信息并与开发人员共享，对于快速解决问题非常有帮助。本节将讨论如何使用调试操作来收集这些信息。调试操作仅在 `kubernetes-worker` 节点上支持。

    juju run-action kubernetes-worker/0 debug

<!--
Which returns:
-->
这个命令将会返回：
    

```
Action queued with id: 4b26e339-7366-4dc7-80ed-255ac0377020`
```

<!--
This produces a .tar.gz file which you can retrieve:
-->
这将产生一个 .tar.gz 的文件，您可以通过以下命令获得该文件：

    juju show-action-output 4b26e339-7366-4dc7-80ed-255ac0377020

<!--
This will give you the path for the debug results:
-->
这将给您提供一个调试结果的路径：

```
results:
  command: juju scp debug-test/0:/home/ubuntu/debug-20161110151539.tar.gz .
  path: /home/ubuntu/debug-20161110151539.tar.gz
status: completed
timing:
  completed: 2016-11-10 15:15:41 +0000 UTC
  enqueued: 2016-11-10 15:15:38 +0000 UTC
  started: 2016-11-10 15:15:40 +0000 UTC
```

<!--
You can now copy the results to your local machine: 
-->
然后您就能通过以下命令将结果拷贝到您的本地机器：

    juju scp kubernetes-worker/0:/home/ubuntu/debug-20161110151539.tar.gz .

<!--
The archive includes basic information such as systemctl status, Juju logs,
charm unit data, etc. Additional application-specific information may be
included as well.
-->
压缩包包括 systemctl 状态、Juju 日志和 charm 单元数据等基本信息。还可能包括其他特定应用程序的信息。

<!--
## Common Problems

### Load Balancer interfering with Helm
-->
## 常见问题

### 负载均衡器干扰 Helm

<!--
This section assumes you have a working deployment of Kubernetes via Juju using a Load Balancer for the API, and that you are using Helm to deploy charts. 

To deploy Helm you will have run: 
-->
本章节假定您拥有一个使用 Juju 部署的正在运行的 Kubernetes 集群，使用负载均衡器来负载 API，同时使用 Helm 来部署 chart。

```
helm init
$HELM_HOME has been configured at /home/ubuntu/.helm
Tiller (the helm server side component) has been installed into your Kubernetes Cluster.
Happy Helming!
```

<!--
Then when using helm you may see one of the following errors: 
-->
当您使用 helm 时可能会出现以下错误：

* Helm doesn't get the version from the Tiller server

```
helm version
Client: &version.Version{SemVer:"v2.1.3", GitCommit:"5cbc48fb305ca4bf68c26eb8d2a7eb363227e973", GitTreeState:"clean"}
Error: cannot connect to Tiller
```

* Helm cannot install your chart

```
helm install <chart> --debug
Error: forwarding ports: error upgrading connection: Upgrade request required
```

<!--
This is caused by the API load balancer not forwarding ports in the context of the helm client-server relationship. To deploy using helm, you will need to follow these steps: 
-->
这是因为 API 负载均衡器在 helm 客户端-服务端关系的上下文中不进行端口转发造成的。要使用 helm 进行部署，您需要执行以下步骤：

<!--
1. Expose the Kubernetes Master service
-->
1. 暴露 Kubernetes Master 服务

   ```
   juju expose kubernetes-master
   ```

<!--
1. Identify the public IP address of one of your masters
-->
1. 确定其中一个 master 的公共 IP 地址

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

<!--
   In this context the public IP address is 54.210.100.102.

   If you want to access this data programmatically you can use the JSON output:
-->
   在上述结果中公共 IP 地址是 54.210.100.102。

   如果您想要通过代码来访问这些数据，可以使用 JSON 输出：

   ```
   juju show-status kubernetes-master --format json | jq --raw-output '.applications."kubernetes-master".units | keys[]'
   54.210.100.102
   ```

<!--
1. Update the kubeconfig file

   Identify the kubeconfig file or section used for this cluster, and edit the server configuration.

   By default, it will look like ```https://54.213.123.123:443```. Replace it with the Kubernetes Master endpoint ```https://54.210.100.102:6443``` and save.

   Note that the default port used by CDK for the Kubernetes Master API is 6443 while the port exposed by the load balancer is 443.
-->
1. 更新 kubeconfig 文件

   确定该集群使用的 kubeconfig 文件或者章节，然后编辑服务端的配置。

   默认情况下，这个配置类似于 ```https://54.213.123.123:443```。将其替换为 Kubernetes Master 端点地址 ```https://54.210.100.102:6443``` 然后保存。

   注意，Kubernetes Master API 的 CDK 默认使用的端口为 6443，而负载均衡器暴露的端口是 443。

<!--
1. Start helming again!
-->
1. 重启 helm！

   ```
   helm install <chart> --debug
   Created tunnel using local port: '36749'
   SERVER: "localhost:36749"
   CHART PATH: /home/ubuntu/.helm/<chart>
   NAME:   <chart>
   ...
   ...
   ```

<!--
## Logging and monitoring

By default there is no log aggregation of the Kubernetes nodes, each node logs locally. It is recommended to deploy the Elastic Stack for log aggregation if you desire centralized logging. 
-->
## 日志和管理

默认情况下， Kubernetes 没有进行节点的日志聚合，每个节点都是本地记录。如果需要集中式日志记录，建议部署 Elastic Stack 进行日志聚合。
{% endcapture %}

{% include templates/task.md %}
