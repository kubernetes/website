---
title: "示例：将日志记录和指标添加到 PHP/Redis Guestbook 示例"
reviewers:
- sftim
content_template: templates/tutorial
weight: 21
card:
  name: tutorials
  weight: 31
  title: "示例：将日志记录和指标添加到 PHP/Redis Guestbook 示例"
---
<!--
---
title: "Example: Add logging and metrics to the PHP / Redis Guestbook example"
reviewers:
- sftim
content_template: templates/tutorial
weight: 21
card:
  name: tutorials
  weight: 31
  title: "Example: Add logging and metrics to the PHP / Redis Guestbook example"
---
-->

{{% capture overview %}}
<!--
This tutorial builds upon the [PHP Guestbook with Redis](../guestbook) tutorial. Lightweight log, metric, and network data open source shippers, or *Beats*, from Elastic are deployed in the same Kubernetes cluster as the guestbook. The Beats collect, parse, and index the data into Elasticsearch so that you can view and analyze the resulting operational information in Kibana. This example consists of the following components:

* A running instance of the [PHP Guestbook with Redis tutorial](../guestbook)
* Elasticsearch and Kibana
* Filebeat
* Metricbeat
* Packetbeat
-->
本教程以 [PHP Guestbook with Redis](../guestbook) 为基础。Elastic 中的轻量级日志、指标和网络数据开源交付器或 *Beats* 部署在与 guestbook 相同的 Kubernetes 集群中。Beats 在 Elasticsearch 中对数据进行收集、解析和索引，以便您可以在 Kibana 中查看和分析生成的操作信息。此示例包含以下组件：

* 运行实例 [使用 Redis 的 PHP Guestbook 教程](../guestbook)
* Elasticsearch 和 Kibana
* Filebeat
* Metricbeat
* Packetbeat

{{% /capture %}}

{{% capture objectives %}}
<!--
* Start up the PHP Guestbook with Redis.
* Install kube-state-metrics.
* Create a Kubernetes secret.
* Deploy the Beats.
* View dashboards of your logs and metrics.
-->
* 使用 Redis 启动 PHP Guestbook
* 安装 kube-state-metrics
* 创建一个 Kubernetes 密码
* 部署 Beat
* 查看仪表板中的日志和指标
{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}}
{{< version-check >}}

<!--
Additionally you need:

* A running deployment of the [PHP Guestbook with Redis](../guestbook) tutorial.

* A running Elasticsearch and Kibana deployment.  You can use [Elasticsearch Service in Elastic Cloud](https://cloud.elastic.co), run the [download files](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-elastic-stack.html) on your workstation or servers, or the [Elastic Helm Charts](https://github.com/elastic/helm-charts).  
-->
此外，您还需要：

* 正在运行的 Deployment 教程 [使用 Redis 的 PHP Guestbook](../guestbook) 
* 正在运行的 Elasticsearch 和 Kibana 的 Deployment。您可以使用 [Elasticsearch Service in Elastic Cloud](https://cloud.elastic.co)运行工作站活服务器上的 [下载文件](https://www.elastic.co/guide/en/elastic-stack-get-started/current/get-started-elastic-stack.html) 或 [Elastic Helm Charts](https://github.com/elastic/helm-charts)

{{% /capture %}}

{{% capture lessoncontent %}}

<!--
## Start up the  PHP Guestbook with Redis
This tutorial builds on the [PHP Guestbook with Redis](../guestbook) tutorial.  If you have the guestbook application running, then you can monitor that.  If you do not have it running then follow the instructions to deploy the guestbook and do not perform the **Cleanup** steps.  Come back to this page when you have the guestbook running.

## Add a Cluster role binding
Create a [cluster level role binding](/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) so that you can deploy kube-state-metrics and the Beats at the cluster level (in kube-system).
-->
## 启动带有 Redis 的 PHP Guestbook
这个教程是基于 [PHP Guestbook with Redis](../guestbook) 教程。如果 guestbook 程序正在运行，您可以进行监视。如果没在运行就需要根据说明部署 guestbook，注意不要执行 **清理** 步骤。当您完成运行 guestbook 后请回到本页面。 

## 添加集群角色绑定
创建一个 [集群级别的角色绑定](/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding) 能够在集群级别下（在 kube-system 中）部署 kube-state-metrics 和 Beat。

```shell
kubectl create clusterrolebinding cluster-admin-binding \
 --clusterrole=cluster-admin --user=<your email associated with the k8s provider account>
```

<!--
## Install kube-state-metrics

Kubernetes [*kube-state-metrics*](https://github.com/kubernetes/kube-state-metrics) is a simple service that listens to the Kubernetes API server and generates metrics about the state of the objects.  Metricbeat reports these metrics.  Add kube-state-metrics to the Kubernetes cluster that the guestbook is running in.

### Check to see if kube-state-metrics is running
-->
## 安装 kube-state-metrics

Kubernetes 的 [*kube-state-metrics*](https://github.com/kubernetes/kube-state-metrics) 是一个基础服务，它可以监听 Kubernetes API 服务器并生成相关对象的状态指标。Metricbeat 报告这些指标，并将 kube-state-metrics 添加到运行 guestbook 的 Kubernetes 集群。
### 检查 kube-state-metrics 是否在运行
```shell
kubectl get pods --namespace=kube-system | grep kube-state
```
<!--
### Install kube-state-metrics if needed
-->
### 如果有需要请安装 kube-state-metrics 
```shell
git clone https://github.com/kubernetes/kube-state-metrics.git kube-state-metrics
kubectl create -f examples/standard
kubectl get pods --namespace=kube-system | grep kube-state-metrics
```
<!--
Verify that kube-state-metrics is running and ready
-->
确认 kube-state-metrics 正在运行并且做好准备
```shell
kubectl get pods -n kube-system -l app.kubernetes.io/name=kube-state-metrics
```

<!--
Output:
-->
输出：
```shell
NAME                                 READY   STATUS    RESTARTS   AGE
kube-state-metrics-89d656bf8-vdthm   2/2     Running     0          21s
```
<!--
## Clone the Elastic examples GitHub repo
-->
## 在 GitHub 存储库中克隆 Elastic 示例 
```shell
git clone https://github.com/elastic/examples.git
```

<!--
The rest of the commands will reference files in the `examples/beats-k8s-send-anywhere` directory, so change dir there:
-->
其余命令将引用 `examples/beats-k8s-send-anywhere` 目录中的文件，因此请在此处更改 dir：
```shell
cd examples/beats-k8s-send-anywhere
```

<!--
## Create a Kubernetes Secret
A Kubernetes {{< glossary_tooltip text="Secret" term_id="secret" >}} is an object that contains a small amount of sensitive data such as a password, a token, or a key. Such information might otherwise be put in a Pod specification or in an image; putting it in a Secret object allows for more control over how it is used, and reduces the risk of accidental exposure.
-->
## 创建 Kubernetes Secret
Kubernetes {{< glossary_tooltip text="Secret" term_id="secret" >}} 是一个对象，其中包含少量的敏感数据，如一个密码，一个令牌，或一个键。尽管这些信息可以放在 Pod 规范或图像中，但将其放在 Secret 对象中可以更好地控制其使用方式，并降低意外暴露的风险。

<!--
{{< note >}}
There are two sets of steps here, one for *self managed* Elasticsearch and Kibana (running on your servers or using the Elastic Helm Charts), and a second separate set for the *managed service* Elasticsearch Service in Elastic Cloud.  Only create the secret for the type of Elasticsearch and Kibana system that you will use for this tutorial.
{{< /note >}}
-->
{{< note >}}
这里有两组步骤，一组用于 *自我管理*  Elasticsearch 和 Kibana (在您的服务器上运行或使用 Elastic Helm Charts )，另一组用于在 Elastic Cloud 中的 *托管服务* Elasticsearch Service。只为用于本教程的 Elasticsearch 和 Kibana 类型的系统创建 Secret。

{{< tabs name="tab_with_md" >}}
{{% tab name="Self Managed" %}}

<!--
### Self managed
Switch to the **Managed service** tab if you are connecting to Elasticsearch Service in Elastic Cloud.
-->
### 自我管理
如果要连接到 Elastic Cloud 中的 Elasticsearch Service，请切换到 **托管服务** 选项卡。

<!--
### Set the credentials
There are four files to edit to create a k8s secret when you are connecting to self managed Elasticsearch and Kibana (self managed is effectively anything other than the managed Elasticsearch Service in Elastic Cloud).  The files are:
-->
### 设置凭证
当您连接到自我管理的 Elasticsearch 和 Kibana 时，有四个文件可以编辑用来创建 k8s secret（自我管理实际上是管理除了 Elastic Cloud 中 Elasticsearch Service 的其他部分）。这些文件是：

1. ELASTICSEARCH_HOSTS
2. ELASTICSEARCH_PASSWORD
3. ELASTICSEARCH_USERNAME
4. KIBANA_HOST

<!--
Set these with the information for your Elasticsearch cluster and your Kibana host.  Here are some examples
-->
根据您的 Elasticsearch 集群和 Kibana 主机的信息进行设置。例如：


#### `ELASTICSEARCH_HOSTS`
<!--
1. A nodeGroup from the Elastic Elasticsearch Helm Chart:
-->
1. Elastic Elasticsearch Helm Chart 中的一个 nodeGroup：

    ```shell
    ["http://elasticsearch-master.default.svc.cluster.local:9200"]
    ```
<!--
2. A single Elasticsearch node running on a Mac where your Beats are running in Docker for Mac:
-->
2. 在 Mac 上运行单个 Elasticsearch 节点，其中 Beats 在 Docker for Mac 上运行：

    ```shell
    ["http://host.docker.internal:9200"]
    ```
<!--
3. Two Elasticsearch nodes running in VMs or on physical hardware:
-->
3. 在 VM 或物理硬件上运行的两个 Elasticsearch Node：

    ```shell
    ["http://host1.example.com:9200", "http://host2.example.com:9200"]
    ```
<!--
Edit `ELASTICSEARCH_HOSTS`
-->
编辑 `ELASTICSEARCH_HOSTS`
```shell
vi ELASTICSEARCH_HOSTS
```

#### `ELASTICSEARCH_PASSWORD`
<!--
Just the password; no whitespace, quotes, or <>:
-->
只有密码；不能有空格、引号或<>：
    <yoursecretpassword>

<!--
Edit `ELASTICSEARCH_PASSWORD`
-->
编辑 `ELASTICSEARCH_PASSWORD`
```shell
vi ELASTICSEARCH_PASSWORD
```

#### `ELASTICSEARCH_USERNAME`
<!--
Just the username; no whitespace, quotes, or <>:
-->
只有用户名；不能有空格、引号或<>：

    <your ingest username for Elasticsearch>

<!--
Edit `ELASTICSEARCH_USERNAME`
-->
编辑 `ELASTICSEARCH_USERNAME`
```shell
vi ELASTICSEARCH_USERNAME
```

#### `KIBANA_HOST`

<!--
1. The Kibana instance from the Elastic Kibana Helm Chart.  The subdomain `default` refers to the default namespace.  If you have deployed the Helm Chart using a different namespace, then your subdomain will be different:
-->
1. Elastic Kibana Helm Chart 中的 Kibana 实例。子域 `default` 是指默认命名空间。如果您使用其他命名空间部署了 Helm Chart，则您的子域将有所不同：

    ```shell
    "kibana-kibana.default.svc.cluster.local:5601"
    ```
<!--
2. A Kibana instance running on a Mac where your Beats are running in Docker for Mac:
-->
2. 在 Mac 上运行的 Kibana 实例，其中 Beats 在 Docker for Mac 中运行：

    ```shell
    "host.docker.internal:5601"
    ```
<!--
3. Two Elasticsearch nodes running in VMs or on physical hardware:
-->
3. 在 VM 或物理硬件上运行的两个 Elasticsearch Node：

    ```shell
    "host1.example.com:5601"
    ```
<!--
Edit `KIBANA_HOST`
-->
编辑 `KIBANA_HOST`
```shell
vi KIBANA_HOST
```

<!--
### Create a Kubernetes secret
This command creates a secret in the Kubernetes system level namespace (kube-system) based on the files you just edited:
-->
### 创建 Kubernetes secret
以下命令是根据您刚刚编辑的文件在 Kubernetes 系统级别的命名空间（kube-system）中创建一个 Secret：

    kubectl create secret generic dynamic-logging \
      --from-file=./ELASTICSEARCH_HOSTS \
      --from-file=./ELASTICSEARCH_PASSWORD \
      --from-file=./ELASTICSEARCH_USERNAME \
      --from-file=./KIBANA_HOST \
      --namespace=kube-system

{{% /tab %}}
{{% tab name="Managed service" %}}

<!--
## Managed service
This tab is for Elasticsearch Service in Elastic Cloud only, if you have already created a secret for a self managed Elasticsearch and Kibana deployment, then continue with [Deploy the Beats](#deploy-the-beats).
### Set the credentials
There are two files to edit to create a k8s secret when you are connecting to the managed Elasticsearch Service in Elastic Cloud.  The files are:
-->
## 托管服务
如果您已经为自我管理的 Elasticsearch 和 Kibana 部署创建了 Secret，那么这部分仅适用于 Elastic Cloud 中的 Elasticsearch Service，请继续 [部署 Beat](#deploy-the-beats)。
### 设置凭证
当您连接到 Elastic Cloud 中托管的 Elasticsearch Service 时，创建 k8s Secret 需要编辑这两个文件：

1. ELASTIC_CLOUD_AUTH
1. ELASTIC_CLOUD_ID

<!--
Set these with the information provided to you from the Elasticsearch Service console when you created the deployment.  Here are some examples:
-->
在创建部署时，您可以使用 Elasticsearch Service 控制台提供的信息进行设置。例如：

#### ELASTIC_CLOUD_ID
```shell
devk8s:ABC123def456ghi789jkl123mno456pqr789stu123vwx456yza789bcd012efg345hijj678klm901nop345zEwOTJjMTc5YWQ0YzQ5OThlN2U5MjAwYTg4NTIzZQ==
```

#### ELASTIC_CLOUD_AUTH
<!--
Just the username, a colon (`:`), and the password, no whitespace or quotes:
-->
只有用户名、冒号（`:`）和密码，不能有空格或引号：
```shell
elastic:VFxJJf9Tjwer90wnfTghsn8w
```

<!--
### Edit the required files:
-->
### 编辑所需的文件：
```shell
vi ELASTIC_CLOUD_ID
vi ELASTIC_CLOUD_AUTH
```
<!--
### Create a Kubernetes secret
This command creates a secret in the Kubernetes system level namespace (kube-system) based on the files you just edited:
-->
### 创建 Kubernetes secret
该命令是根据您刚刚编辑的文件在 Kubernetes 系统级别的命名空间（kube-system）中创建一个 Secret：

    kubectl create secret generic dynamic-logging \
      --from-file=./ELASTIC_CLOUD_ID \
      --from-file=./ELASTIC_CLOUD_AUTH \
      --namespace=kube-system

  {{% /tab %}}
{{< /tabs >}}

<!--
## Deploy the Beats
Manifest files are provided for each Beat. These manifest files use the secret created earlier to configure the Beats to connect to your Elasticsearch and Kibana servers.
-->
## 部署 Beat
为每个 Beat 提供清单文件。这些清单文件使用先前创建的 Secret 来配置 Beat，从而连接到您的 Elasticsearch 和 Kibana 服务器。

<!--
### About Filebeat
Filebeat will collect logs from the Kubernetes nodes and the containers running in each pod running on those nodes.  Filebeat is deployed as a {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}.  Filebeat can autodiscover applications running in your Kubernetes cluster. At startup Filebeat scans existing containers and launches the proper configurations for them, then it will watch for new start/stop events.
-->
### 关于 Filebeat
Filebeat 会从 Kubernetes Node 以及 Node上的 Pod 中运行的容器收集日志。Filebeat 部署为{{<lossary_tooltip text =“ DaemonSet” term_id =“ daemonset”>}}。Filebeat 可以自动发现 Kubernetes 集群中运行的应用程序。在启动时，Filebeat 会扫描现有容器并为它们启动适当的配置，然后它会监视新的启动/停止事件。

<!--
Here is the autodiscover configuration that enables Filebeat to locate and parse Redis logs from the Redis containers deployed with the guestbook application.  This configuration is in the file `filebeat-kubernetes.yaml`:
-->
以下是配置自动发现功能，Filebeat 可以从与 Guestbook 应用程序一起部署的 Redis 容器中查找和解析 Redis 日志。该配置在文件 `filebeat-kubernetes.yaml` 中：

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
-->
当检测到带有标签 `app` 的包含字符串 `redis` 的容器时，Filebeat 会配置为应用 Filebeat 模块 `redis` 。Redis 模块具有使用 docker 输入类型从容器收集 `log` 流的能力（从该 Redis 容器读取与 STDOUT 流关联的 Kubernetes Node 上的文件）。此外，在容器元数据中还提供以下功能，模块可以通过连接到的适当的 pod 主机和端口来收集 Redis 的 `slowlog` 条目。

<!--
### Deploy Filebeat:
-->
### 配置 Filebeat：
```shell
kubectl create -f filebeat-kubernetes.yaml
```

<!--
#### Verify
-->
#### 核对
```shell
kubectl get pods -n kube-system -l k8s-app=filebeat-dynamic
```

<!--
### About Metricbeat
Metricbeat autodiscover is configured in the same way as Filebeat.  Here is the Metricbeat autodiscover configuration for the Redis containers.  This configuration is in the file `metricbeat-kubernetes.yaml`:
-->
### 关于 Metricbeat
Metricbeat 自动发现的配置方式与 Filebeat 相同。以下是 Redis 容器的 Metricbeat 自动发现配置。此配置位于 `metricbeat-kubernetes.yaml` 文件中：
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
-->
当检测到带有标签 `tier` 等于字符串 `backend` 的容器时，Metricbeat 会配置为应用 Metricbeat 模块 `redis` 。此外，在容器元数据中还提供以下功能，通过连接到适当的 Pod 主机和端口，`redis` 模块具有从容器收集 `info` 和 `keyspace` 指标的能力。

<!--
### Deploy Metricbeat
-->
### 配置 Metricbeat
```shell
kubectl create -f metricbeat-kubernetes.yaml
```
<!--
#### Verify
-->
#### 核对
```shell
kubectl get pods -n kube-system -l k8s-app=metricbeat
```

<!--
### About Packetbeat
Packetbeat configuration is different than Filebeat and Metricbeat.  Rather than specify patterns to match against container labels the configuration is based on the protocols and port numbers involved.  Shown below is a subset of the port numbers.
-->
### 关于 Packetbeat
Packetbeat 的配置不同于 Filebeat 和 Metricbeat。配置不是基于与容器标签匹配的模式，而是基于所涉及的协议和端口号。下面显示的是端口号的子集。

<!--
{{< note >}}
If you are running a service on a non-standard port add that port number to the appropriate type in `filebeat.yaml` and delete / create the Packetbeat DaemonSet.
{{< /note >}}
-->
{{< note >}}
如果您正在非标准端口上运行服务，需要将该端口号添加到 `filebeat.yaml` 中的适当类型，然后删除/创建 Packetbeat DaemonSet。
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
#### 配置 Packetbeat
```shell
kubectl create -f packetbeat-kubernetes.yaml
```

<!--
#### Verify
-->
#### 核对
```shell
kubectl get pods -n kube-system -l k8s-app=packetbeat-dynamic
```

<!--
## View in Kibana

Open Kibana in your browser and then open the **Dashboard** application.  In the search bar type Kubernetes and click on the Metricbeat dashboard for Kubernetes.  This dashboard reports on the state of your Nodes, deployments, etc.

Search for Packetbeat on the Dashboard page, and view the Packetbeat overview.
-->
## 在 Kibana 中查看

在浏览器中打开 Kibana，然后打开 **仪表盘** 应用程序。在搜索栏中输入 Kubernetes，然后点击 Kubernetes 的 Metricbeat 仪表盘。仪表盘会报告 Node、Deployment 等的状态。

在仪表盘页面上搜索 Packetbeat，可以查看 Packetbeat 概述。

<!--
Similarly, view dashboards for Apache and Redis.  You will see dashboards for logs and metrics for each.  The Apache Metricbeat dashboard will be blank.  Look at the Apache Filebeat dashboard and scroll to the bottom to view the Apache error logs.  This will tell you why there are no metrics available for Apache.

To enable Metricbeat to retrieve the Apache metrics, enable server-status by adding a ConfigMap including a mod-status configuration file and re-deploy the guestbook.
-->
查看 Apache 和 Redis 的仪表盘也是一样的。您将看到仪表盘包含各自的日志和指标。Apache Metricbeat 仪表盘是空白的。查看 Apache Filebeat 仪表盘，滚动到底部查看 Apache 错误日志，会告诉您为什么没有适用于 Apache 的指标。

要使 Metricbeat 能够检索 Apache 指标，请添加一个包含 mod-status 配置文件的 ConfigMap 启用 server-status，然后重新部署 Gustbook。


<!--
## Scale your deployments and see new pods being monitored
List the existing deployments:
-->
## 扩展 Deployment 并查看正在监视的新 Pod
列出现有的 Deployment：
```shell
kubectl get deployments
```

<!--
The output:
-->
输出：
```shell
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
frontend        3/3     3            3           3h27m
redis-master    1/1     1            1           3h27m
redis-slave     2/2     2            2           3h27m
```

<!--
Scale the frontend down to two pods:
-->
缩小 frontend 至两个 Pod：
```shell
kubectl scale --replicas=2 deployment/frontend
```
<!--
The output:
-->
输出：
```shell
deployment.extensions/frontend scaled
```

<!--
## View the changes in Kibana
See the screenshot, add the indicated filters and then add the columns to the view.  You can see the ScalingReplicaSet entry that is marked, following from there to the top of the list of events shows the image being pulled, the volumes mounted, the pod starting, etc.
![Kibana Discover](https://raw.githubusercontent.com/elastic/examples/master/beats-k8s-send-anywhere/scaling-discover.png)
-->
## 在 Kibana 中查看变更
查看屏幕截图，添加指定的过滤器，然后将各列添加到视图中。您可以看到已标记的 ScalingReplicaSet 条目，从这里到事件列表的顶部依次显示了要拉取的镜像、已安装的卷，启动的 Pod 等等。
![Kibana Discover](https://raw.githubusercontent.com/elastic/examples/master/beats-k8s-send-anywhere/scaling-discover.png)
{{% /capture %}}

<!--
{{% capture cleanup %}}
Deleting the Deployments and Services also deletes any running Pods. Use labels to delete multiple resources with one command.

1. Run the following commands to delete all Pods, Deployments, and Services.
-->
{{% capture cleanup %}}
删除 Deployment 和 Service 也会删除任何正在运行的 Pod。在一个命令中使用标签删除多个资源。

1. 运行以下命令删除所有 Pod，Deployment 和 Service。

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
2. Query the list of Pods to verify that no Pods are running:
-->
2. 查询 Pod 列表，确认没有 Pod 在运行：

      ```shell
      kubectl get pods
      ```

      The response should be this:

      ```
      No resources found.
      ```

{{% /capture %}}

<!--
{{% capture whatsnext %}}
* Learn about [tools for monitoring resources](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* Read more about [logging architecture](/docs/concepts/cluster-administration/logging/)
* Read more about [application introspection and debugging](/docs/tasks/debug-application-cluster/)
* Read more about [troubleshoot applications](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
-->
{{% capture whatsnext %}}
* 了解关于 [监控资源的工具](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* 了解关于 [日志体系架构](/docs/concepts/cluster-administration/logging/) 的更多信息
* 了解关于 [应用程序的自检和调试](/docs/tasks/debug-application-cluster/) 的更多信息
* 了解关于 [解决应用程序故障](/docs/tasks/debug-application-cluster/resource-usage-monitoring/) 的更多信息
{{% /capture %}}
