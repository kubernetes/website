---
title: 示例：基于 Persistent Volume 部署 WordPress 和 MySQL
assignees:
- ahmetb
cn-approvers:
- xiaosuiba
---

<!--
---
title: "Example: Deploying WordPress and MySQL with Persistent Volumes"
assignees:
- ahmetb
---
-->

{% capture overview %}
<!--
This tutorial shows you how to deploy a WordPress site and a MySQL database using Minikube. Both applications use PersistentVolumes and PersistentVolumeClaims to store data. 
-->
本教程展示了如何使用 Minikube 部署 WordPress 站点和 MySQL 数据库。这两个应用都使用 PersistentVolume 和 PersistentVolumeClaim 存储数据。

<!--
A [PersistentVolume](/docs/concepts/storage/persistent-volumes/) (PV) is a piece of storage in the cluster that has been provisioned by an administrator, and a [PeristentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC) is a set amount of storage in a PV. PersistentVolumes and PeristentVolumeClaims are independent from Pod lifecycles and preserve data through restarting, rescheduling, and even deleting Pods. 
-->
[PersistentVolume](/docs/concepts/storage/persistent-volumes/) (PV) 是由管理员在集群中预先分配的一块存储。[PeristentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC) 是 PV 中一定数量的存储。PersistentVolume 和 PeristentVolumeClaim 与 Pod 的生命周期无关，在重启、重新调度、甚至删除 Pod 后，它们仍然保存着数据。

<!--
**Warning:**  This deployment is not suitable for production use cases, as it uses single instance WordPress and MySQL Pods. Consider using [WordPress Helm Chart](https://github.com/kubernetes/charts/tree/master/stable/wordpress) to deploy WordPress in production.
-->
**警告：**由于使用了单实例的 WordPress 和 MySQL Pod，这个部署不适用于生产环境。请考虑使用 [WordPress Helm Chart](https://github.com/kubernetes/charts/tree/master/stable/wordpress) 在生产环境中部署 WordPress。
{: .warning}

{% endcapture %}

{% capture objectives %}
<!--
* Create a PersistentVolume
* Create a Secret
* Deploy MySQL
* Deploy WordPress
* Clean up
  -->
* 创建 PersistentVolume
* 创建 Secret
* 部署 MySQL
* 部署 WordPress
* 清理

{% endcapture %}

{% capture prerequisites %}

{% include task-tutorial-prereqs.md %} 

<!--
Download the following configuration files:
-->
下载下列配置文件：

1. [local-volumes.yaml](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/local-volumes.yaml)

2. [mysql-deployment.yaml](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/mysql-deployment.yaml)

3. [wordpress-deployment.yaml](/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/wordpress-deployment.yaml)
  -->

{% endcapture %}

{% capture lessoncontent %} 

<!--
## Create a PersistentVolume
-->
## 创建 PersistentVolume

<!--
MySQL and Wordpress each use a PersistentVolume to store data. While Kubernetes supports many different [types of PersistentVolumes](/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes), this tutorial covers [hostPath](/docs/concepts/storage/volumes/#hostpath).
-->
MySQL 和 Wordpress 各自使用一个 PersistentVolume 存储数据。虽然 Kubernetes 支持许多不同  [种类的 PersistentVolumes](/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)，本教程只使用了 [hostPath](/docs/concepts/storage/volumes/#hostpath)。

<!--
**Note:** If you have a Kubernetes cluster running on Google Container Engine, please follow [this guide](https://cloud.google.com/container-engine/docs/tutorials/persistent-disk).
-->
**注意：**如果您的 Kubernetes 集群运行在 Google Container Engine 上，请参考 [这篇指南](https://cloud.google.com/container-engine/docs/tutorials/persistent-disk)。
{: .note}

<!--
### Setting up a hostPath Volume
-->
### 设置 hostPath Volume

<!--
A `hostPath` mounts a file or directory from the host node’s filesystem into your Pod. 
-->
`hostPath` 将宿主节点文件系统中的一个文件或文件夹挂载到您的 Pod 上。

<!--
**Warning:** Only use `hostPath` for developing and testing. With hostPath, your data lives on the node the Pod is scheduled onto and does not move between nodes. If a Pod dies and gets scheduled to another node in the cluster, the data is lost. 
-->
**警告：**请只将 `hostPath` 用于开发和测试。使用 hostPath 时，您的数据保存在 Pod 调度的节点上且不能在节点间迁移。如果 Pod 停止运行并被调度到集群中其它节点上，它的数据将会丢失。
{: .warning}

<!--
1. Launch a terminal window in the directory you downloaded the manifest files.

2. Create two PersistentVolumes from the `local-volumes.yaml` file:
-->
1. 在下载清单文件的目录中启动一个终端窗口。

2. 使用 `local-volumes.yaml` 创建两个 PersistentVolume。

       kubectl create -f local-volumes.yaml

{% include code.html language="yaml" file="mysql-wordpress-persistent-volume/local-volumes.yaml" ghlink="/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/local-volumes.yaml" %}

{:start="3"} 
<!--
3. Run the following command to verify that two 20GiB PersistentVolumes are available:
-->
3. 运行下列命令，验证两个 20GiB 的 PersistentVolume 是否可用：

       kubectl get pv
<!--
   The response should be like this:
-->
   响应应该类似这样：

       NAME         CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
       local-pv-1   20Gi       RWO           Retain          Available                                      1m
       local-pv-2   20Gi       RWO           Retain          Available                                      1m

<!--
## Create a Secret for MySQL Password
-->
## 创建配置 MySQL 密码的 Secret

<!--
A [Secret](/docs/concepts/configuration/secret/) is an object that stores a piece of sensitive data like a password or key. The manifest files are already configured to use a Secret, but you have to create your own Secret.
-->
[Secret](/docs/concepts/configuration/secret/) 是一个用于存储类似密码或密钥等敏感数据的对象。清单文件已经配置成使用 Secret，但您需要创建自己的 Secret。

<!--
1. Create the Secret object from the following command:

       kubectl create secret generic mysql-pass --from-literal=password=YOUR_PASSWORD

   **Note:** Replace `YOUR_PASSWORD` with the password you want to apply.     
   {: .note}
-->
1. 使用下面的命令创建 Secret 对象：

       kubectl create secret generic mysql-pass --from-literal=password=YOUR_PASSWORD

   **注意：**替换 `YOUR_PASSWORD` 为你希望应用的密码。
   {: .note}

<!--
2. Verify that the Secret exists by running the following command:

       kubectl get secrets

   The response should be like this:

       NAME                  TYPE                                  DATA      AGE
       mysql-pass                 Opaque                                1         42s

   **Note:** To protect the Secret from exposure, neither `get` nor `describe` show its contents. 
-->
2. 运行下面的命令，验证 Secret 是否存在:

       kubectl get secrets

   响应应该类似这样：

       NAME                  TYPE                                  DATA      AGE
       mysql-pass                 Opaque                                1         42s

   **注意：**为了保护 Secret 不被暴露，`get` 和 `describe` 都不会显示它的内容。
   {: .note}

<!--
## Deploy MySQL
-->
## 部署 MySQL

<!--
The following manifest describes a single-instance MySQL Deployment. The MySQL container mounts the PersistentVolume at /var/lib/mysql. The `MYSQL_ROOT_PASSWORD` environment variable sets the database password from the Secret. 
-->
下面的清单描述了一个单实例的 MySQL Deployment。MySQL 容器会将 PersistentVolume 挂载到  /var/lib/mysql 路径。`MYSQL_ROOT_PASSWORD` 环境变量使用 Secret 中的配置来设置数据库密码。

{% include code.html language="yaml" file="mysql-wordpress-persistent-volume/mysql-deployment.yaml" ghlink="/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/mysql-deployment.yaml" %}

<!--
1. Deploy MySQL from the `mysql-deployment.yaml` file:

       kubectl create -f mysql-deployment.yaml

2. Verify that the Pod is running by running the following command:

       kubectl get pods

   **Note:** It can take up to a few minutes for the Pod's Status to be `RUNNING`.
-->
1. 使用 `mysql-deployment.yaml` 部署 MySQL：

       kubectl create -f mysql-deployment.yaml

2. 运行下面的命令，验证 Pod 是否正常运行：

       kubectl get pods

   **注意：**可能需要几分钟时间来使 Pod 的状态变为 `RUNNING`。 
   {: .note}

<!--
   The response should be like this:
-->
   响应应该类似这样：

       NAME                               READY     STATUS    RESTARTS   AGE
       wordpress-mysql-1894417608-x5dzt   1/1       Running   0          40s

<!--
## Deploy WordPress
-->
## 部署 WordPress

<!--
The following manifest describes a single-instance WordPress Deployment and Service. It uses many of the same features like a PVC for persistent storage and a Secret for the password. But it also uses a different setting: `type: NodePort`. This setting exposes WordPress to traffic from outside of the cluster.
-->
下面的清单描述了一个单实例的  WordPress Deployment 和 Service。它包含许多（和MySQL）相同的特性，比如用于持久化存储的 PVC 和用于设置密码的 Secret。但它也使用了一个不同的配置：`type: NodePort`。这个配置将 WordPress 暴露给集群外部访问。

{% include code.html language="yaml" file="mysql-wordpress-persistent-volume/wordpress-deployment.yaml" ghlink="/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/wordpress-deployment.yaml" %}

<!--
1. Create a WordPress Service and Deployment from the `wordpress-deployment.yaml` file:

       kubectl create -f wordpress-deployment.yaml

2. Verify that the Service is running by running the following command:

       kubectl get services wordpress

   The response should be like this:
-->
1. 使用 `wordpress-deployment.yaml` 文件创建 WordPress Service 和 Deployment：

       kubectl create -f wordpress-deployment.yaml

2. 运行下面的命令，验证 Service 是否运行正常：

       kubectl get services wordpress

<!--
   The response should be like this:
-->
   响应应该类似这样：
   
       NAME        CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
       wordpress   10.0.0.89    <pending>     80:32406/TCP   4m

<!--
   **Note:** Minikube can only expose Services through `NodePort`. <br/><br/>The `EXTERNAL-IP` is always `<pending>`.
-->
   **注意：**Minikube 只能通过 `NodePort` 暴露 Services。 <br/><br/>`EXTERNAL-IP` 永远为  `<pending>` 状态。
   {: .note}

<!--
3. Run the following command to get the IP Address for the WordPress Service:

       minikube service wordpress --url

   The response should be like this:

       http://1.2.3.4:32406
-->
3. 运行下面的命令，获取 WordPress Service 的 IP 地址：

       minikube service wordpress --url

   响应应该类似这样：

       http://1.2.3.4:32406

<!--
4. Copy the IP address, and load the page in your browser to view your site.

   You should see the WordPress set up page similar to the following screenshot.
-->
4. 拷贝这个 IP 地址并在浏览器中查看您的站点。

<!--
   You should see the WordPress set up page similar to the following screenshot.
-->
   你应该可以看到和下面的截图类似的 WordPress 配置页面。
   ![wordpress-init](https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/WordPress.png)

<!--
   **Warning:** Do not leave your WordPress installation on this page. If another user finds it, they can set up a website on your instance and use it to serve malicious content. <br/><br/>Either install WordPress by creating a username and password or delete your instance.
-->
   **警告：**不要在这个页面上留下您的 WordPress 安装配置。如果其他用户发现了它，他们可能在您的实例上建立网站并用它提供有害的内容。<br/><br/>要么通过创建一个用户名和密码来安装 WordPress，要么删除实例。
   {: .warning}

{% endcapture %}

{% capture cleanup %}

<!--
1. Run the following command to delete your Secret:
-->
1. 运行下面的命令，删除 Secret：

       kubectl delete secret mysql-pass

<!--
2. Run the following commands to delete all Deployments and Services:
-->
2. 运行下面的命令，删除全部 Deployment 和 Service：

       kubectl delete deployment -l app=wordpress
       kubectl delete service -l app=wordpress

<!--
3. Run the following commands to delete the  PersistentVolumeClaims and the PersistentVolumes:
-->
3. 运行下面的命令，删除 PersistentVolumeClaim 和 PersistentVolume：

       kubectl delete pvc -l app=wordpress
       kubectl delete pv local-pv-1 local-pv-2

<!--
   **Note:** Any other Type of PersistentVolume would allow you to recreate the Deployments and Services at this point without losing data, but `hostPath` loses the data as soon as the Pod stops running.
-->
   **注意：**任意其它类型的 PersistentVolume 都可以允许您在此时重建 Deployment 和 Service 而不丢失数据，但 `hostPath` 的数据将在 Pod 停止运行的同时丢失。
   {: .note}       

{% endcapture %}

{% capture whatsnext %}

<!--
* Learn more about [Introspection and Debugging](/docs/tasks/debug-application-cluster/debug-application-introspection/)
* Learn more about [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/)
* Learn more about [Port Forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Learn how to [Get a Shell to a Container](/docs/tasks/debug-application-cluster/get-shell-running-container/)
-->
* 了解更多关于 [Introspection 和 Debugging](/docs/tasks/debug-application-cluster/debug-application-introspection/)
* 了解更多关于 [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/)
* 了解更多关于 [端口转发（Port Forwarding）](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* 了解更多关于 [获取一个到容器的 Shell](/docs/tasks/debug-application-cluster/get-shell-running-container/)

{% endcapture %}

{% include templates/tutorial.md %}
