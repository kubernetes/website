---
title: 示例：使用持久卷部署 WordPress 和 MySQL
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 40
  title: "有状态应用示例: 带持久卷的 Wordpress"
---
<!--
title: "Example: Deploying WordPress and MySQL with Persistent Volumes"
reviewers:
- ahmetb
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 40
  title: "Stateful Example: Wordpress with Persistent Volumes"
-->
<!-- overview -->

<!--
This tutorial shows you how to deploy a WordPress site and a MySQL database using
Minikube. Both applications use PersistentVolumes and PersistentVolumeClaims to store data.
-->
本示例描述了如何通过 Minikube 在 Kubernetes 上安装 WordPress 和 MySQL。
这两个应用都使用 PersistentVolumes 和 PersistentVolumeClaims 保存数据。

<!--
A [PersistentVolume](/docs/concepts/storage/persistent-volumes/) (PV) is a piece
of storage in the cluster that has been manually provisioned by an administrator,
or dynamically provisioned by Kubernetes using a [StorageClass](/docs/concepts/storage/storage-classes).
A [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC)
is a request for storage by a user that can be fulfilled by a PV. PersistentVolumes and
PersistentVolumeClaims are independent from Pod lifecycles and preserve data through
restarting, rescheduling, and even deleting Pods.
-->
[PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)（PV）是在集群里由管理员手动制备或
Kubernetes 通过 [StorageClass](/zh-cn/docs/concepts/storage/storage-classes) 动态制备的一块存储。
[PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
是用户对存储的请求，该请求可由某个 PV 来满足。
PersistentVolumes 和 PersistentVolumeClaims 独立于 Pod 生命周期而存在，
在 Pod 重启、重新调度甚至删除过程中用于保存数据。

{{< warning >}}
<!--
This deployment is not suitable for production use cases, as it uses single instance
WordPress and MySQL Pods. Consider using
[WordPress Helm Chart](https://github.com/bitnami/charts/tree/master/bitnami/wordpress)
to deploy WordPress in production.
-->
这种部署并不适合生产场景，因为它使用的是单实例 WordPress 和 MySQL Pod。
在生产场景中，请考虑使用 [WordPress Helm Chart](https://github.com/bitnami/charts/tree/master/bitnami/wordpress)
部署 WordPress。
{{< /warning >}}

{{< note >}}
<!--
The files provided in this tutorial are using GA Deployment APIs and are specific
to kubernetes version 1.9 and later. If you wish to use this tutorial with an earlier
version of Kubernetes, please update the API version appropriately, or reference
earlier versions of this tutorial.
-->
本教程中提供的文件使用 GA Deployment API，并且特定于 kubernetes 1.9 或更高版本。
如果你希望将本教程与 Kubernetes 的早期版本一起使用，请相应地更新 API 版本，或参考本教程的早期版本。
{{< /note >}}

## {{% heading "objectives" %}}

<!--
* Create PersistentVolumeClaims and PersistentVolumes
* Create a `kustomization.yaml` with
  * a Secret generator
  * MySQL resource configs
  * WordPress resource configs
* Apply the kustomization directory by `kubectl apply -k ./`
* Clean up
-->
* 创建 PersistentVolumeClaims 和 PersistentVolumes
* 创建 `kustomization.yaml` 以使用
  * Secret 生成器
  * MySQL 资源配置
  * WordPress 资源配置
* `kubectl apply -k ./` 来应用整个 kustomization 目录
* 清理

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
The example shown on this page works with `kubectl` 1.27 and above.

Download the following configuration files:

1. [mysql-deployment.yaml](/examples/application/wordpress/mysql-deployment.yaml)

1. [wordpress-deployment.yaml](/examples/application/wordpress/wordpress-deployment.yaml)
-->
此例在 `kubectl` 1.27 或者更高版本有效。

下载下面的配置文件：

1. [mysql-deployment.yaml](/examples/application/wordpress/mysql-deployment.yaml)

2. [wordpress-deployment.yaml](/examples/application/wordpress/wordpress-deployment.yaml)

<!-- lessoncontent -->

<!--
## Create PersistentVolumeClaims and PersistentVolumes
-->
## 创建 PersistentVolumeClaims 和 PersistentVolumes

<!--
MySQL and Wordpress each require a PersistentVolume to store data.
Their PersistentVolumeClaims will be created at the deployment step.

Many cluster environments have a default StorageClass installed.
When a StorageClass is not specified in the PersistentVolumeClaim,
the cluster's default StorageClass is used instead.

When a PersistentVolumeClaim is created, a PersistentVolume is dynamically
provisioned based on the StorageClass configuration.
-->
MySQL 和 Wordpress 都需要一个 PersistentVolume 来存储数据。
它们的 PersistentVolumeClaims 将在部署步骤中创建。

许多集群环境都安装了默认的 StorageClass。如果在 PersistentVolumeClaim 中未指定 StorageClass，
则使用集群的默认 StorageClass。

创建 PersistentVolumeClaim 时，将根据 StorageClass 配置动态制备一个 PersistentVolume。

{{< warning >}}
<!--
In local clusters, the default StorageClass uses the `hostPath` provisioner.
`hostPath` volumes are only suitable for development and testing. With `hostPath`
volumes, your data lives in `/tmp` on the node the Pod is scheduled onto and does
not move between nodes. If a Pod dies and gets scheduled to another node in the
cluster, or the node is rebooted, the data is lost.
-->
在本地集群中，默认的 StorageClass 使用 `hostPath` 制备程序。`hostPath` 卷仅适用于开发和测试。
使用 `hostPath` 卷时，你的数据位于 Pod 调度到的节点上的 `/tmp` 中，并且不会在节点之间移动。
如果 Pod 死亡并被调度到集群中的另一个节点，或者该节点重新启动，则数据将丢失。
{{< /warning >}}

{{< note >}}
<!--
If you are bringing up a cluster that needs to use the `hostPath` provisioner,
the `--enable-hostpath-provisioner` flag must be set in the `controller-manager` component.
-->
如果要建立需要使用 `hostPath` 制备程序的集群，
则必须在 `controller-manager` 组件中设置 `--enable-hostpath-provisioner` 标志。
{{< /note >}}

{{< note >}}
<!--
If you have a Kubernetes cluster running on Google Kubernetes Engine, please
follow [this guide](https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk).
-->
如果你已经有运行在 Google Kubernetes Engine 的集群，
请参考[此指南](https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk)。
{{< /note >}}

<!--
## Create a kustomization.yaml
-->
## 创建 kustomization.yaml

<!--
### Add a Secret generator
-->
### 创建 Secret 生成器

<!--
A [Secret](/docs/concepts/configuration/secret/) is an object that stores a piece
of sensitive data like a password or key. Since 1.14, `kubectl` supports the
management of Kubernetes objects using a kustomization file. You can create a Secret
by generators in `kustomization.yaml`.

Add a Secret generator in `kustomization.yaml` from the following command.
You will need to replace `YOUR_PASSWORD` with the password you want to use.
-->
[Secret](/zh-cn/docs/concepts/configuration/secret/) 是存储诸如密码或密钥之类敏感数据的对象。
从 1.14 开始，`kubectl` 支持使用一个 kustomization 文件来管理 Kubernetes 对象。
你可以通过 `kustomization.yaml` 中的生成器创建一个 Secret。

通过以下命令在 `kustomization.yaml` 中添加一个 Secret 生成器。
你需要将 `YOUR_PASSWORD` 替换为自己要用的密码。

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: mysql-pass
  literals:
  - password=YOUR_PASSWORD
EOF
```

<!--
## Add resource configs for MySQL and WordPress
-->
## 补充 MySQL 和 WordPress 的资源配置

<!--
The following manifest describes a single-instance MySQL Deployment. The MySQL
container mounts the PersistentVolume at /var/lib/mysql. The `MYSQL_ROOT_PASSWORD`
environment variable sets the database password from the Secret.
-->
以下清单文件描述的是一个单实例的 MySQL Deployment。MySQL 容器将 PersistentVolume 挂载在 `/var/lib/mysql`。
`MYSQL_ROOT_PASSWORD` 环境变量根据 Secret 设置数据库密码。

{{% code_sample file="application/wordpress/mysql-deployment.yaml" %}}

<!--
The following manifest describes a single-instance WordPress Deployment. The WordPress container mounts the
PersistentVolume at `/var/www/html` for website data files. The `WORDPRESS_DB_HOST` environment variable sets
the name of the MySQL Service defined above, and WordPress will access the database by Service. The
`WORDPRESS_DB_PASSWORD` environment variable sets the database password from the Secret kustomize generated.
-->
以下清单文件描述的是一个单实例 WordPress Deployment。WordPress 容器将 PersistentVolume
挂载到 `/var/www/html`，用于保存网站数据文件。
`WORDPRESS_DB_HOST` 环境变量设置上面定义的 MySQL Service 的名称，WordPress 将通过 Service 访问数据库。
`WORDPRESS_DB_PASSWORD` 环境变量根据使用 kustomize 生成的 Secret 设置数据库密码。

{{% code_sample file="application/wordpress/wordpress-deployment.yaml" %}}

<!--
1. Download the MySQL deployment configuration file.
-->
1. 下载 MySQL Deployment 配置文件。

   ```shell
   curl -LO https://k8s.io/examples/application/wordpress/mysql-deployment.yaml
   ```

<!--
2. Download the WordPress configuration file.
-->
2. 下载 WordPress 配置文件。

   ```shell
   curl -LO https://k8s.io/examples/application/wordpress/wordpress-deployment.yaml
   ```

<!--
3. Add them to `kustomization.yaml` file.
-->
3. 将上述内容追加到 `kustomization.yaml` 文件。

   ```shell
   cat <<EOF >>./kustomization.yaml
   resources:
     - mysql-deployment.yaml
     - wordpress-deployment.yaml
   EOF
   ```

<!--
## Apply and Verify
-->
## 应用和验证

<!--
The `kustomization.yaml` contains all the resources for deploying a WordPress site and a
MySQL database. You can apply the directory by
-->
`kustomization.yaml` 包含用于部署 WordPress 网站以及 MySQL 数据库的所有资源。你可以通过以下方式应用目录：

```shell
kubectl apply -k ./
```

<!--
Now you can verify that all objects exist.

1. Verify that the Secret exists by running the following command:
-->
现在，你可以验证所有对象是否存在。

1. 通过运行以下命令验证 Secret 是否存在：

   ```shell
   kubectl get secrets
   ```

   <!--
   The response should be like this:
   -->

   响应应如下所示：

   ```
   NAME                    TYPE                                  DATA   AGE
   mysql-pass-c57bb4t7mf   Opaque                                1      9s
   ```

<!--
2. Verify that a PersistentVolume got dynamically provisioned.
-->
2. 验证是否已动态制备 PersistentVolume：

   ```shell
   kubectl get pvc
   ```

   {{< note >}}
   <!--
   It can take up to a few minutes for the PVs to be provisioned and bound.
   -->

   制备和绑定 PV 可能要花费几分钟。
   {{< /note >}}

   <!--
   The response should be like this:
   -->

   响应应如下所示：

   ```
   NAME             STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS       AGE
   mysql-pv-claim   Bound     pvc-8cbd7b2e-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   wp-pv-claim      Bound     pvc-8cd0df54-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   ```

<!--
3. Verify that the Pod is running by running the following command:
-->
3. 通过运行以下命令来验证 Pod 是否正在运行：

   ```shell
   kubectl get pods
   ```

   {{< note >}}
   <!--
   It can take up to a few minutes for the Pod's Status to be `RUNNING`.
   -->

   等待 Pod 状态变成 `RUNNING` 可能会花费几分钟。
   {{< /note >}}

   <!--
   The response should be like this:
   -->

   响应应如下所示：

   ```
   NAME                               READY     STATUS    RESTARTS   AGE
   wordpress-mysql-1894417608-x5dzt   1/1       Running   0          40s
   ```

<!--
4. Verify that the Service is running by running the following command:
-->
4. 通过运行以下命令来验证 Service 是否正在运行：

   ```shell
   kubectl get services wordpress
   ```

   <!--
   The response should be like this:
   -->

   响应应如下所示：

   ```
   NAME        TYPE            CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
   wordpress   LoadBalancer    10.0.0.89    <pending>     80:32406/TCP   4m
   ```

   {{< note >}}
   <!--
   Minikube can only expose Services through `NodePort`. The EXTERNAL-IP is always pending.
   -->

   Minikube 只能通过 NodePort 公开服务。EXTERNAL-IP 始终处于 pending 状态。
   {{< /note >}}

<!--
5. Run the following command to get the IP Address for the WordPress Service:
-->
5. 运行以下命令以获取 WordPress 服务的 IP 地址：

   ```shell
   minikube service wordpress --url
   ```

   <!--
   The response should be like this:
   -->
   响应应如下所示：

   ```
   http://1.2.3.4:32406
   ```

<!--
6. Copy the IP address, and load the page in your browser to view your site.

   You should see the WordPress set up page similar to the following screenshot.
-->
6. 复制 IP 地址，然后将页面加载到浏览器中来查看你的站点。

   你应该看到类似于以下屏幕截图的 WordPress 设置页面。

   ![wordpress-init](https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/WordPress.png)

   {{< warning >}}
   <!--
   Do not leave your WordPress installation on this page. If another user finds it,
   they can set up a website on your instance and use it to serve malicious content.<br/><br/>
   Either install WordPress by creating a username and password or delete your instance.
   -->
   不要在此页面上保留 WordPress 安装。如果其他用户找到了它，他们可以在你的实例上建立一个网站并使用它来提供恶意内容。<br/><br/>
   通过创建用户名和密码来安装 WordPress 或删除你的实例。
   {{< /warning >}}

## {{% heading "cleanup" %}}

<!--
1. Run the following command to delete your Secret, Deployments, Services and PersistentVolumeClaims:
-->
1. 运行以下命令删除你的 Secret、Deployment、Service 和 PersistentVolumeClaims：

   ```shell
   kubectl delete -k ./
   ```

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Introspection and Debugging](/docs/tasks/debug/debug-application/debug-running-pod/)
* Learn more about [Jobs](/docs/concepts/workloads/controllers/job/)
* Learn more about [Port Forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Learn how to [Get a Shell to a Container](/docs/tasks/debug/debug-application/get-shell-running-container/)
-->
* 进一步了解[自省与调试](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/)
* 进一步了解 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
* 进一步了解[端口转发](/zh-cn/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* 了解如何[获得容器的 Shell](/zh-cn/docs/tasks/debug/debug-application/get-shell-running-container/)
