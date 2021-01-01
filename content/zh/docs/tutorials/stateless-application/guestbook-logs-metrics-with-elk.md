---
title: "示例: 添加日志和指标到 PHP / Redis Guestbook 案例"
content_type: tutorial
weight: 21
card:
  name: tutorials
  weight: 31
  title: "示例: 添加日志和指标到 PHP / Redis Guestbook 案例"
---
<!-- 
title: "Example: Add logging and metrics to the PHP / Redis Guestbook example"
reviewers:
- sftim
content_type: tutorial
weight: 21
card:
  name: tutorials
  weight: 31
  title: "Example: Add logging and metrics to the PHP / Redis Guestbook example"
-->

<!-- overview -->
<!-- 
This tutorial builds upon the [PHP Guestbook with Redis](/docs/tutorials/stateless-application/guestbook) tutorial. Lightweight log, metric, and network data open source shippers, or *Beats*, from Elastic are deployed in the same Kubernetes cluster as the guestbook. The Beats collect, parse, and index the data into Elasticsearch so that you can view and analyze the resulting operational information in Kibana. This example consists of the following components:

* A running instance of the [PHP Guestbook with Redis tutorial](/docs/tutorials/stateless-application/guestbook)
* Elasticsearch and Kibana
* Filebeat
* Metricbeat
* Packetbeat
-->
本教程建立在
[使用 Redis 部署 PHP Guestbook](/zh/docs/tutorials/stateless-application/guestbook) 教程之上。
*Beats*，是 Elastic 出品的开源的轻量级日志、指标和网络数据采集器，
将和 Guestbook 一同部署在 Kubernetes 集群中。
Beats 收集、分析、索引数据到 Elasticsearch，使你可以用 Kibana 查看并分析得到的运营信息。
本示例由以下内容组成：
* [带 Redis 的 PHP Guestbook 教程](/zh/docs/tutorials/stateless-application/guestbook)
  的一个实例部署
* Elasticsearch 和 Kibana
* Filebeat
* Metricbeat
* Packetbeat

## {{% heading "objectives" %}}

<!-- 
* Start up the PHP Guestbook with Redis.
* Install kube-state-metrics.
* Create a Kubernetes Secret.
* Deploy the Beats.
* View dashboards of your logs and metrics.
-->
* 启动用 Redis 部署的 PHP Guestbook。
* 安装 kube-state-metrics。
* 创建 Kubernetes secret。
* 部署 Beats。
* 用仪表板查看日志和指标。

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}
{{< version-check >}}

<!-- 
Additionally you need:

* A running deployment of the [PHP Guestbook with Redis](/docs/tutorials/stateless-application/guestbook) tutorial.

* A running Elasticsearch and Kibana deployment.  You can use [Elasticsearch Service in Elastic Cloud](https://cloud.elastic.co), 
  run the [download files](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-elastic-stack.html) 
  on your workstation or servers, or the [Elastic Helm Charts](https://github.com/elastic/helm-charts).
-->
此外，你还需要:

* 依照教程[使用 Redis 的 PHP Guestbook](/zh/docs/tutorials/stateless-application/guestbook)得到的一套运行中的部署环境。
* 一套运行中的 Elasticsearch 和 Kibana 部署环境。你可以使用 [Elastic 云中的Elasticsearch 服务](https://cloud.elastic.co)、在工作站或者服务器上运行此[下载文件](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-elastic-stack.html)、或运行 [Elastic Helm Charts](https://github.com/elastic/helm-charts)。

<!-- lessoncontent -->

<!-- 
## Start up the  PHP Guestbook with Redis

This tutorial builds on the [PHP Guestbook with Redis](/docs/tutorials/stateless-application/guestbook) tutorial.  If you have the guestbook application running, then you can monitor that.  If you do not have it running then follow the instructions to deploy the guestbook and do not perform the **Cleanup** steps.  Come back to this page when you have the guestbook running.
-->
## 启动用 Redis 部署的 PHP Guestbook {#start-up-the-php-guestbook-with-redis}

本教程建立在
[使用 Redis 部署 PHP Guestbook](/zh/docs/tutorials/stateless-application/guestbook) 之上。
如果你已经有一个运行的 Guestbook 应用程序，那就监控它。
如果还没有，那就按照说明先部署 Guestbook ，但不要执行**清理**的步骤。
当 Guestbook 运行起来后，再返回本页。

<!-- 
## Add a Cluster role binding

Create a [cluster level role binding](/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) so that you can deploy kube-state-metrics and the Beats at the cluster level (in kube-system).
-->
## 添加一个集群角色绑定 {#add-a-cluster-role-binding}

创建一个[集群范围的角色绑定](/zh/docs/reference/access-authn-authz/rbac/#rolebinding-和-clusterrolebinding)，
以便你可以在集群范围（在 kube-system 中）部署 kube-state-metrics 和 Beats。

```shell
kubectl create clusterrolebinding cluster-admin-binding \
 --clusterrole=cluster-admin --user=<your email associated with the k8s provider account>
```

<!-- 
## Install kube-state-metrics

Kubernetes [*kube-state-metrics*](https://github.com/kubernetes/kube-state-metrics) is a simple service that listens to the Kubernetes API server and generates metrics about the state of the objects.  Metricbeat reports these metrics.  Add kube-state-metrics to the Kubernetes cluster that the guestbook is running in.
--> 
### 安装 kube-state-metrics {#install-kube-state-metrics}

Kubernetes [*kube-state-metrics*](https://github.com/kubernetes/kube-state-metrics)
是一个简单的服务，它侦听 Kubernetes API 服务器并生成对象状态的指标。
Metricbeat 报告这些指标。
添加 kube-state-metrics 到运行 Guestbook 的 Kubernetes 集群。

```shell
git clone https://github.com/kubernetes/kube-state-metrics.git kube-state-metrics
kubectl apply -f kube-state-metrics/examples/standard
```

<!-- 
### Check to see if kube-state-metrics is running
-->
### 检查 kube-state-metrics 是否正在运行 {#check-to-see-if-kube-state-metrics-is-running}

```shell
kubectl get pods --namespace=kube-system -l app.kubernetes.io/name=kube-state-metrics
```

<!-- 
Output:
-->
输出：

```
NAME                                 READY   STATUS    RESTARTS   AGE
kube-state-metrics-89d656bf8-vdthm   1/1     Running     0          21s
```

<!-- 
## Clone the Elastic examples GitHub repo
-->
## 从 GitHub 克隆 Elastic examples  库 {#clone-the-elastic-examples-github-repo}

```shell
git clone https://github.com/elastic/examples.git
```

<!-- 
The rest of the commands will reference files in the `examples/beats-k8s-send-anywhere` directory, so change dir there:
-->
后续命令将引用目录 `examples/beats-k8s-send-anywhere` 中的文件，
所以把目录切换过去。

```shell
cd examples/beats-k8s-send-anywhere
```

<!-- 
## Create a Kubernetes Secret
A Kubernetes {{< glossary_tooltip text="Secret" term_id="secret" >}} is an object that contains a small amount of sensitive data such as a password, a token, or a key. Such information might otherwise be put in a Pod specification or in an image; putting it in a Secret object allows for more control over how it is used, and reduces the risk of accidental exposure.

There are two sets of steps here, one for *self managed* Elasticsearch and Kibana (running on your servers or using the Elastic Helm Charts), and a second separate set for the *managed service* Elasticsearch Service in Elastic Cloud.  Only create the secret for the type of Elasticsearch and Kibana system that you will use for this tutorial.
-->
## 创建 Kubernetes Secret {#create-a-kubernetes-secret}

Kubernetes {{< glossary_tooltip text="Secret" term_id="secret" >}}
是包含少量敏感数据（类似密码、令牌、秘钥等）的对象。
这类信息也可以放在 Pod 规格定义或者镜像中；
但放在 Secret 对象中，能更好的控制它的使用方式，也能减少意外泄露的风险。

{{< note >}}
这里有两套步骤，一套用于*自管理*的 Elasticsearch 和 Kibana（运行在你的服务器上或使用 Helm Charts），
另一套用于在 Elastic 云服务中 *Managed service* 的 Elasticsearch 服务。
在本教程中，只需要为 Elasticsearch 和 Kibana 系统创建 secret。
{{< /note >}}

{{< tabs name="tab_with_md" >}}
{{% tab name="自管理" %}}

<!-- 
### Self managed
Switch to the **Managed service** tab if you are connecting to Elasticsearch Service in Elastic Cloud.

### Set the credentials
There are four files to edit to create a k8s secret when you are connecting to self managed Elasticsearch and Kibana (self managed is effectively anything other than the managed Elasticsearch Service in Elastic Cloud).  The files are:
-->
### 自管理系统 {#self-managed}

如果你使用 Elastic 云中的 Elasticsearch 服务，切换到 **Managed service** 标签页。

### 设置凭据 {#set-the-credentials}

当你使用自管理的 Elasticsearch 和 Kibana （对比托管于 Elastic 云中的 Elasticsearch 服务，自管理更有效率），
创建 k8s secret 需要准备四个文件。这些文件是：

1. `ELASTICSEARCH_HOSTS`
1. `ELASTICSEARCH_PASSWORD`
1. `ELASTICSEARCH_USERNAME`
1. `KIBANA_HOST`

<!-- 
Set these with the information for your Elasticsearch cluster and your Kibana host.  Here are some examples (also see [*this configuration*](https://stackoverflow.com/questions/59892896/how-to-connect-from-minikube-to-elasticsearch-installed-on-host-local-developme/59892897#59892897))
-->
为你的 Elasticsearch 集群和 Kibana 主机设置这些信息。这里是一些例子
（另见[*此配置*](https://stackoverflow.com/questions/59892896/how-to-connect-from-minikube-to-elasticsearch-installed-on-host-local-developme/59892897#59892897)）

#### `ELASTICSEARCH_HOSTS` {#elasticsearch-hosts}

<!-- 
1. A nodeGroup from the Elastic Elasticsearch Helm Chart:
-->
1. 来自于 Elastic Elasticsearch Helm Chart 的节点组：

    ```
    ["http://elasticsearch-master.default.svc.cluster.local:9200"]
    ```

   <!-- 
   1. A single Elasticsearch node running on a Mac where your Beats are running in Docker for Mac:
   -->
1. Mac 上的单节点的 Elasticsearch，Beats 运行在 Mac 的容器中：

    ```
    ["http://host.docker.internal:9200"]
    ```

    <!--  
    1. Two Elasticsearch nodes running in VMs or on physical hardware:
    -->
1. 运行在虚拟机或物理机上的两个 Elasticsearch 节点

    ```
    ["http://host1.example.com:9200", "http://host2.example.com:9200"]
    ```

<!-- 
Edit `ELASTICSEARCH_HOSTS`
-->
编辑 `ELASTICSEARCH_HOSTS`
```shell
vi ELASTICSEARCH_HOSTS
```

#### `ELASTICSEARCH_PASSWORD` {#elasticsearch-password}

<!-- 
Just the password; no whitespace, quotes, or <>:
-->
只有密码；没有空格、引号、< 和 >：

```
<yoursecretpassword>
```

<!-- 
Edit `ELASTICSEARCH_PASSWORD`
-->
编辑 `ELASTICSEARCH_PASSWORD`：

```shell
vi ELASTICSEARCH_PASSWORD
```

#### `ELASTICSEARCH_USERNAME` {#elasticsearch-username}

<!-- 
Just the username; no whitespace, quotes, or <>:
-->
只有用名；没有空格、引号、< 和 >：

<!-- 
your ingest username for Elasticsearch
-->
```
<为 Elasticsearch 注入的用户名>
```

<!-- 
Edit `ELASTICSEARCH_USERNAME`
-->
编辑 `ELASTICSEARCH_USERNAME`：

```shell
vi ELASTICSEARCH_USERNAME
```

#### `KIBANA_HOST` {#kibana-host}

<!-- 
1. The Kibana instance from the Elastic Kibana Helm Chart.  The subdomain `default` refers to the default namespace.  If you have deployed the Helm Chart using a different namespace, then your subdomain will be different:
-->
1. 从 Elastic Kibana Helm Chart 安装的 Kibana 实例。子域 `default` 指默认的命名空间。如果你把 Helm Chart 指定部署到不同的命名空间，那子域会不同： 

    ```
    "kibana-kibana.default.svc.cluster.local:5601"
    ```

    <!-- 
    1. A Kibana instance running on a Mac where your Beats are running in Docker for Mac:
    -->
1. Mac 上的 Kibana 实例，Beats 运行于 Mac 的容器：

    ```
    "host.docker.internal:5601"
    ```
    
    <!-- 
      1. Two Elasticsearch nodes running in VMs or on physical hardware:
    -->
1. 运行于虚拟机或物理机上的两个 Elasticsearch 节点：

    ```
    "host1.example.com:5601"
    ```

<!-- 
Edit `KIBANA_HOST`
-->
编辑 `KIBANA_HOST`：

```shell
vi KIBANA_HOST
```

<!-- 
### Create a Kubernetes secret
This command creates a secret in the Kubernetes system level namespace (kube-system) based on the files you just edited:
-->
### 创建 Kubernetes secret {#create-a-kubernetes-secret}

在上面编辑完的文件的基础上，本命令在 Kubernetes 系统范围的命名空间（kube-system）创建一个 secret。

```
    kubectl create secret generic dynamic-logging \
      --from-file=./ELASTICSEARCH_HOSTS \
      --from-file=./ELASTICSEARCH_PASSWORD \
      --from-file=./ELASTICSEARCH_USERNAME \
      --from-file=./KIBANA_HOST \
      --namespace=kube-system
```

{{% /tab %}}
{{% tab name="Managed service" %}}

<!-- 
## Managed service
This tab is for Elasticsearch Service in Elastic Cloud only, if you have already created a secret for a self managed Elasticsearch and Kibana deployment, then continue with [Deploy the Beats](#deploy-the-beats).
### Set the credentials
There are two files to edit to create a k8s secret when you are connecting to the managed Elasticsearch Service in Elastic Cloud.  The files are:
-->
## Managed service {#managed-service}

本标签页只用于 Elastic 云 的 Elasticsearch 服务，如果你已经为自管理的 Elasticsearch 和 Kibana 创建了secret，请继续[部署 Beats](#deploy-the-beats)并继续。

### 设置凭据 {#set-the-credentials}

在 Elastic 云中的托管 Elasticsearch 服务中，为了创建 k8s secret，你需要先编辑两个文件。它们是：

1. `ELASTIC_CLOUD_AUTH`
1. `ELASTIC_CLOUD_ID`

<!-- 
Set these with the information provided to you from the Elasticsearch Service console when you created the deployment.  Here are some examples:
-->
当你完成部署的时候，Elasticsearch 服务控制台会提供给你一些信息，用这些信息完成设置。
这里是一些示例：

#### ELASTIC_CLOUD_ID {#elastic-cloud-id}

```
devk8s:ABC123def456ghi789jkl123mno456pqr789stu123vwx456yza789bcd012efg345hijj678klm901nop345zEwOTJjMTc5YWQ0YzQ5OThlN2U5MjAwYTg4NTIzZQ==
```

#### ELASTIC_CLOUD_AUTH {#elastic-cloud-auth}

<!-- 
Just the username, a colon (`:`), and the password, no whitespace or quotes:
-->
只要用户名；没有空格、引号、< 和 >：

```
elastic:VFxJJf9Tjwer90wnfTghsn8w
```

<!-- 
### Edit the required files:
-->
### 编辑要求的文件 {#edit-the-required-files}
```shell
vi ELASTIC_CLOUD_ID
vi ELASTIC_CLOUD_AUTH
```

<!-- 
### Create a Kubernetes secret
This command creates a secret in the Kubernetes system level namespace (kube-system) based on the files you just edited:
-->
### 创建 Kubernetes secret {#create-a-kubernetes-secret}

基于上面刚编辑过的文件，在 Kubernetes 系统范围命名空间（kube-system）中，用下面命令创建一个的secret：

    kubectl create secret generic dynamic-logging \
      --from-file=./ELASTIC_CLOUD_ID \
      --from-file=./ELASTIC_CLOUD_AUTH \
      --namespace=kube-system

  {{% /tab %}}
{{< /tabs >}}

<!-- 
## Deploy the Beats
Manifest files are provided for each Beat.  These manifest files use the secret created earlier to configure the Beats to connect to your Elasticsearch and Kibana servers.

### About Filebeat
Filebeat will collect logs from the Kubernetes nodes and the containers running in each pod running on those nodes.  Filebeat is deployed as a {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}.  Filebeat can autodiscover applications running in your Kubernetes cluster. At startup Filebeat scans existing containers and launches the proper configurations for them, then it will watch for new start/stop events.

Here is the autodiscover configuration that enables Filebeat to locate and parse Redis logs from the Redis containers deployed with the guestbook application.  This configuration is in the file `filebeat-kubernetes.yaml`:
-->
## 部署 Beats {#deploy-the-beats}

为每一个 Beat 提供 清单文件。清单文件使用已创建的 secret 接入 Elasticsearch 和 Kibana 服务器。

### 关于 Filebeat {#about-filebeat}

Filebeat 收集日志，日志来源于 Kubernetes 节点以及这些节点上每一个 Pod 中的容器。Filebeat 部署为
{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}。
Filebeat 支持自动发现 Kubernetes 集群中的应用。
在启动时，Filebeat 扫描存量的容器，并为它们提供适当的配置，
然后开始监听新的启动/中止信号。

下面是一个自动发现的配置，它支持 Filebeat 定位并分析来自于 Guestbook 应用部署的 Redis 容器的日志文件。
下面的配置片段来自文件 `filebeat-kubernetes.yaml`：

```yaml
- condition.contains:
    kubernetes.labels.app: redis
  config:
    - module: redis
      log:
        input:
          type: docker
          containers.ids:
            - ${data.kubernetes.container.id}
      slowlog:
        enabled: true
        var.hosts: ["${data.host}:${data.port}"]
```

<!-- 
This configures Filebeat to apply the Filebeat module `redis` when a container is detected with a label `app` containing the string `redis`.  The redis module has the ability to collect the `log` stream from the container by using the docker input type (reading the file on the Kubernetes node associated with the STDOUT stream from this Redis container).  Additionally, the module has the ability to collect Redis `slowlog` entries by connecting to the proper pod host and port, which is provided in the container metadata.

### Deploy Filebeat:
-->

这样配置 Filebeat，当探测到容器拥有 `app` 标签，且值为 `redis`，那就启用 Filebeat 的 `redis` 模块。
`redis` 模块可以根据 docker 的输入类型（在 Kubernetes 节点上读取和 Redis 容器的标准输出流关联的文件） ，从容器收集 `log` 流。
另外，此模块还可以使用容器元数据中提供的配置信息，连到 Pod 适当的主机和端口，收集 Redis 的 `slowlog` 。

### 部署 Filebeat {#deploy-filebeat}

```shell
kubectl create -f filebeat-kubernetes.yaml
```

<!-- 
#### Verify
-->
#### 验证 {#verify}

```shell
kubectl get pods -n kube-system -l k8s-app=filebeat-dynamic
```

<!-- 
### About Metricbeat
Metricbeat autodiscover is configured in the same way as Filebeat.  Here is the Metricbeat autodiscover configuration for the Redis containers.  This configuration is in the file `metricbeat-kubernetes.yaml`:
-->
### 关于 Metricbeat {#about-metricbeat}

Metricbeat 自动发现的配置方式与 Filebeat 完全相同。
这里是针对 Redis 容器的 Metricbeat 自动发现配置。
此配置片段来自于文件 `metricbeat-kubernetes.yaml`：

```yaml
- condition.equals:
    kubernetes.labels.tier: backend
  config:
    - module: redis
      metricsets: ["info", "keyspace"]
      period: 10s

      # Redis hosts
      hosts: ["${data.host}:${data.port}"]
```
<!-- 
This configures Metricbeat to apply the Metricbeat module `redis` when a container is detected with a label `tier` equal to the string `backend`.  The `redis` module has the ability to collect the `info` and `keyspace` metrics from the container by connecting to the proper pod host and port, which is provided in the container metadata.

### Deploy Metricbeat
-->
配置 Metricbeat，在探测到标签 `tier` 的值等于 `backend` 时，应用 Metricbeat 模块 `redis`。
`redis` 模块可以获取容器元数据，连接到 Pod 适当的主机和端口，从 Pod 中收集指标 `info` 和 `keyspace`。

### 部署 Metricbeat {#deploy-metricbeat}

```shell
kubectl create -f metricbeat-kubernetes.yaml
```

<!-- 
#### Verify
-->
#### 验证 {#verify2}

```shell
kubectl get pods -n kube-system -l k8s-app=metricbeat
```

<!-- 
### About Packetbeat
Packetbeat configuration is different than Filebeat and Metricbeat.  Rather than specify patterns to match against container labels the configuration is based on the protocols and port numbers involved.  Shown below is a subset of the port numbers.

If you are running a service on a non-standard port add that port number to the appropriate type in `filebeat.yaml` and delete / create the Packetbeat DaemonSet.
-->
### 关于 Packetbeat {#about-packetbeat}

Packetbeat 的配置方式不同于 Filebeat 和 Metricbeat。
相比于匹配容器标签的模式，它的配置基于相关协议和端口号。
下面展示的是端口号的一个子集：

{{< note >}}
如果你的服务运行在非标准的端口上，那就打开文件 `filebeat.yaml`，把这个端口号添加到合适的类型中，然后删除/启动 Packetbeat 的守护进程。
{{< /note >}}

```yaml
packetbeat.interfaces.device: any

packetbeat.protocols:
- type: dns
  ports: [53]
  include_authorities: true
  include_additionals: true

- type: http
  ports: [80, 8000, 8080, 9200]

- type: mysql
  ports: [3306]

- type: redis
  ports: [6379]

packetbeat.flows:
  timeout: 30s
  period: 10s
```

<!-- 
#### Deploy Packetbeat
-->
### 部署 Packetbeat {#deploy-packetbeat}

```shell
kubectl create -f packetbeat-kubernetes.yaml
```

<!-- 
#### Verify
-->
#### 验证 {#verify3}

```shell
kubectl get pods -n kube-system -l k8s-app=packetbeat-dynamic
```

<!-- 
## View in Kibana

Open Kibana in your browser and then open the **Dashboard** application.  In the search bar type Kubernetes and click on the Metricbeat dashboard for Kubernetes.  This dashboard reports on the state of your Nodes, deployments, etc.

Search for Packetbeat on the Dashboard page, and view the Packetbeat overview.

Similarly, view dashboards for Apache and Redis.  You will see dashboards for logs and metrics for each.  The Apache Metricbeat dashboard will be blank.  Look at the Apache Filebeat dashboard and scroll to the bottom to view the Apache error logs.  This will tell you why there are no metrics available for Apache.

To enable Metricbeat to retrieve the Apache metrics, enable server-status by adding a ConfigMap including a mod-status configuration file and re-deploy the guestbook.


## Scale your deployments and see new pods being monitored
List the existing deployments:
-->
## 在 kibana 中浏览 {#view-in-kibana}

在浏览器中打开 kibana，再打开 **Dashboard**。
在搜索栏中键入 Kubernetes，再点击 Metricbeat 的 Kubernetes Dashboard。
此 Dashboard 展示节点状态、应用部署等。

在 Dashboard 页面，搜索 Packetbeat，并浏览 Packetbeat 概览信息。

同样地，浏览 Apache 和 Redis 的 Dashboard。
可以看到日志和指标各自独立 Dashboard。
Apache Metricbeat Dashboard 是空的。
找到 Apache Filebeat Dashboard，拉到最下面，查看 Apache 的错误日志。
日志会揭示出没有 Apache 指标的原因。

要让 metricbeat 得到 Apache 的指标，需要添加一个包含模块状态配置文件的 ConfigMap，并重新部署 Guestbook。

## 缩放部署规模，查看新 Pod 已被监控 {#scale-your-deployments-and-see-new-pods-being-monitored}

列出现有的 deployments：

```shell
kubectl get deployments
```

<!-- 
The output:
-->
输出：

```
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
frontend        3/3     3            3           3h27m
redis-master    1/1     1            1           3h27m
redis-slave     2/2     2            2           3h27m
```

<!-- 
Scale the frontend down to two pods:
-->
缩放前端到两个 Pod：

```shell
kubectl scale --replicas=2 deployment/frontend
```

<!-- 
The output:
 -->
输出：

```
deployment.extensions/frontend scaled
```

<!-- 
Scale the frontend back up to three pods:
-->
将前端应用缩放回三个 Pod：

```shell
kubectl scale --replicas=3 deployment/frontend
```

<!-- 
## View the changes in Kibana
See the screenshot, add the indicated filters and then add the columns to the view.  You can see the ScalingReplicaSet entry that is marked, following from there to the top of the list of events shows the image being pulled, the volumes mounted, the pod starting, etc.
![Kibana Discover](https://raw.githubusercontent.com/elastic/examples/master/beats-k8s-send-anywhere/scaling-up.png)
-->
## 在 Kibana 中查看变化 {#view-the-chagnes-in-kibana}

参见屏幕截图，添加指定的过滤器，然后将列添加到视图。
你可以看到，ScalingReplicaSet 被做了标记，从标记的点开始，到消息列表的顶部，展示了拉取的镜像、挂载的卷、启动的 Pod 等。
![Kibana 发现](https://raw.githubusercontent.com/elastic/examples/master/beats-k8s-send-anywhere/scaling-up.png)

## {{% heading "cleanup" %}}

<!-- 
Deleting the Deployments and Services also deletes any running Pods. Use labels to delete multiple resources with one command.

1. Run the following commands to delete all Pods, Deployments, and Services.
-->
删除 Deployments 和 Services， 删除运行的 Pod。
用标签功能在一个命令中删除多个资源。

1. 执行下列命令，删除所有的 Pod、Deployment 和 Services。

      ```shell
      kubectl delete deployment -l app=redis
      kubectl delete service -l app=redis
      kubectl delete deployment -l app=guestbook
      kubectl delete service -l app=guestbook
      kubectl delete -f filebeat-kubernetes.yaml
      kubectl delete -f metricbeat-kubernetes.yaml
      kubectl delete -f packetbeat-kubernetes.yaml
      kubectl delete secret dynamic-logging -n kube-system
      ```
   <!--   
   1. Query the list of Pods to verify that no Pods are running:
   -->
2. 查询 Pod，以核实没有 Pod 还在运行：

      ```shell
      kubectl get pods
      ```

      <!--
      The response should be this:
      -->
      响应应该是这样：

      ```
      No resources found.
      ```


## {{% heading "whatsnext" %}}

<!-- 
* Learn about [tools for monitoring resources](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* Read more about [logging architecture](/docs/concepts/cluster-administration/logging/)
* Read more about [application introspection and debugging](/docs/tasks/debug-application-cluster/)
* Read more about [troubleshoot applications](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
-->
* 了解[监控资源的工具](/zh/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* 进一步阅读[日志体系架构](/zh/docs/concepts/cluster-administration/logging/)
* 进一步阅读[应用内省和调试](/zh/docs/tasks/debug-application-cluster/)
* 进一步阅读[应用程序的故障排除](/zh/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
