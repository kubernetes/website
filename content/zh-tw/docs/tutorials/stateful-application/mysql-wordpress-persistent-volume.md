---
title: 示例：使用持久卷部署 WordPress 和 MySQL
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 40
  title: "有狀態應用示例: 帶持久卷的 Wordpress"
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
本示例描述瞭如何通過 Minikube 在 Kubernetes 上安裝 WordPress 和 MySQL。
這兩個應用都使用 PersistentVolumes 和 PersistentVolumeClaims 保存數據。

<!--
A [PersistentVolume](/docs/concepts/storage/persistent-volumes/) (PV) is a piece
of storage in the cluster that has been manually provisioned by an administrator,
or dynamically provisioned by Kubernetes using a [StorageClass](/docs/concepts/storage/storage-classes).
A [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC)
is a request for storage by a user that can be fulfilled by a PV. PersistentVolumes and
PersistentVolumeClaims are independent from Pod lifecycles and preserve data through
restarting, rescheduling, and even deleting Pods.
-->
[PersistentVolume](/zh-cn/docs/concepts/storage/persistent-volumes/)（PV）是在集羣裏由管理員手動製備或
Kubernetes 通過 [StorageClass](/zh-cn/docs/concepts/storage/storage-classes) 動態製備的一塊存儲。
[PersistentVolumeClaim](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)
是用戶對存儲的請求，該請求可由某個 PV 來滿足。
PersistentVolumes 和 PersistentVolumeClaims 獨立於 Pod 生命週期而存在，
在 Pod 重啓、重新調度甚至刪除過程中用於保存數據。

{{< warning >}}
<!--
This deployment is not suitable for production use cases, as it uses single instance
WordPress and MySQL Pods. Consider using
[WordPress Helm Chart](https://github.com/bitnami/charts/tree/master/bitnami/wordpress)
to deploy WordPress in production.
-->
這種部署並不適合生產場景，因爲它使用的是單實例 WordPress 和 MySQL Pod。
在生產場景中，請考慮使用 [WordPress Helm Chart](https://github.com/bitnami/charts/tree/master/bitnami/wordpress)
部署 WordPress。
{{< /warning >}}

{{< note >}}
<!--
The files provided in this tutorial are using GA Deployment APIs and are specific
to kubernetes version 1.9 and later. If you wish to use this tutorial with an earlier
version of Kubernetes, please update the API version appropriately, or reference
earlier versions of this tutorial.
-->
本教程中提供的文件使用 GA Deployment API，並且特定於 kubernetes 1.9 或更高版本。
如果你希望將本教程與 Kubernetes 的早期版本一起使用，請相應地更新 API 版本，或參考本教程的早期版本。
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
* 創建 PersistentVolumeClaims 和 PersistentVolumes
* 創建 `kustomization.yaml` 以使用
  * Secret 生成器
  * MySQL 資源配置
  * WordPress 資源配置
* `kubectl apply -k ./` 來應用整個 kustomization 目錄
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

下載下面的配置文件：

1. [mysql-deployment.yaml](/examples/application/wordpress/mysql-deployment.yaml)

2. [wordpress-deployment.yaml](/examples/application/wordpress/wordpress-deployment.yaml)

<!-- lessoncontent -->

<!--
## Create PersistentVolumeClaims and PersistentVolumes
-->
## 創建 PersistentVolumeClaims 和 PersistentVolumes

<!--
MySQL and Wordpress each require a PersistentVolume to store data.
Their PersistentVolumeClaims will be created at the deployment step.

Many cluster environments have a default StorageClass installed.
When a StorageClass is not specified in the PersistentVolumeClaim,
the cluster's default StorageClass is used instead.

When a PersistentVolumeClaim is created, a PersistentVolume is dynamically
provisioned based on the StorageClass configuration.
-->
MySQL 和 Wordpress 都需要一個 PersistentVolume 來存儲數據。
它們的 PersistentVolumeClaims 將在部署步驟中創建。

許多集羣環境都安裝了默認的 StorageClass。如果在 PersistentVolumeClaim 中未指定 StorageClass，
則使用集羣的默認 StorageClass。

創建 PersistentVolumeClaim 時，將根據 StorageClass 配置動態製備一個 PersistentVolume。

{{< warning >}}
<!--
In local clusters, the default StorageClass uses the `hostPath` provisioner.
`hostPath` volumes are only suitable for development and testing. With `hostPath`
volumes, your data lives in `/tmp` on the node the Pod is scheduled onto and does
not move between nodes. If a Pod dies and gets scheduled to another node in the
cluster, or the node is rebooted, the data is lost.
-->
在本地集羣中，默認的 StorageClass 使用 `hostPath` 製備程序。`hostPath` 卷僅適用於開發和測試。
使用 `hostPath` 卷時，你的數據位於 Pod 調度到的節點上的 `/tmp` 中，並且不會在節點之間移動。
如果 Pod 死亡並被調度到集羣中的另一個節點，或者該節點重新啓動，則數據將丟失。
{{< /warning >}}

{{< note >}}
<!--
If you are bringing up a cluster that needs to use the `hostPath` provisioner,
the `--enable-hostpath-provisioner` flag must be set in the `controller-manager` component.
-->
如果要建立需要使用 `hostPath` 製備程序的集羣，
則必須在 `controller-manager` 組件中設置 `--enable-hostpath-provisioner` 標誌。
{{< /note >}}

{{< note >}}
<!--
If you have a Kubernetes cluster running on Google Kubernetes Engine, please
follow [this guide](https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk).
-->
如果你已經有運行在 Google Kubernetes Engine 的集羣，
請參考[此指南](https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk)。
{{< /note >}}

<!--
## Create a kustomization.yaml
-->
## 創建 kustomization.yaml

<!--
### Add a Secret generator
-->
### 創建 Secret 生成器

<!--
A [Secret](/docs/concepts/configuration/secret/) is an object that stores a piece
of sensitive data like a password or key. Since 1.14, `kubectl` supports the
management of Kubernetes objects using a kustomization file. You can create a Secret
by generators in `kustomization.yaml`.

Add a Secret generator in `kustomization.yaml` from the following command.
You will need to replace `YOUR_PASSWORD` with the password you want to use.
-->
[Secret](/zh-cn/docs/concepts/configuration/secret/) 是存儲諸如密碼或密鑰之類敏感數據的對象。
從 1.14 開始，`kubectl` 支持使用一個 kustomization 文件來管理 Kubernetes 對象。
你可以通過 `kustomization.yaml` 中的生成器創建一個 Secret。

通過以下命令在 `kustomization.yaml` 中添加一個 Secret 生成器。
你需要將 `YOUR_PASSWORD` 替換爲自己要用的密碼。

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
## 補充 MySQL 和 WordPress 的資源配置

<!--
The following manifest describes a single-instance MySQL Deployment. The MySQL
container mounts the PersistentVolume at /var/lib/mysql. The `MYSQL_ROOT_PASSWORD`
environment variable sets the database password from the Secret.
-->
以下清單文件描述的是一個單實例的 MySQL Deployment。MySQL 容器將 PersistentVolume 掛載在 `/var/lib/mysql`。
`MYSQL_ROOT_PASSWORD` 環境變量根據 Secret 設置數據庫密碼。

{{% code_sample file="application/wordpress/mysql-deployment.yaml" %}}

<!--
The following manifest describes a single-instance WordPress Deployment. The WordPress container mounts the
PersistentVolume at `/var/www/html` for website data files. The `WORDPRESS_DB_HOST` environment variable sets
the name of the MySQL Service defined above, and WordPress will access the database by Service. The
`WORDPRESS_DB_PASSWORD` environment variable sets the database password from the Secret kustomize generated.
-->
以下清單文件描述的是一個單實例 WordPress Deployment。WordPress 容器將 PersistentVolume
掛載到 `/var/www/html`，用於保存網站數據文件。
`WORDPRESS_DB_HOST` 環境變量設置上面定義的 MySQL Service 的名稱，WordPress 將通過 Service 訪問數據庫。
`WORDPRESS_DB_PASSWORD` 環境變量根據使用 kustomize 生成的 Secret 設置數據庫密碼。

{{% code_sample file="application/wordpress/wordpress-deployment.yaml" %}}

<!--
1. Download the MySQL deployment configuration file.
-->
1. 下載 MySQL Deployment 配置文件。

   ```shell
   curl -LO https://k8s.io/examples/application/wordpress/mysql-deployment.yaml
   ```

<!--
2. Download the WordPress configuration file.
-->
2. 下載 WordPress 配置文件。

   ```shell
   curl -LO https://k8s.io/examples/application/wordpress/wordpress-deployment.yaml
   ```

<!--
3. Add them to `kustomization.yaml` file.
-->
3. 將上述內容追加到 `kustomization.yaml` 文件。

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
## 應用和驗證

<!--
The `kustomization.yaml` contains all the resources for deploying a WordPress site and a
MySQL database. You can apply the directory by
-->
`kustomization.yaml` 包含用於部署 WordPress 網站以及 MySQL 數據庫的所有資源。你可以通過以下方式應用目錄：

```shell
kubectl apply -k ./
```

<!--
Now you can verify that all objects exist.

1. Verify that the Secret exists by running the following command:
-->
現在，你可以驗證所有對象是否存在。

1. 通過運行以下命令驗證 Secret 是否存在：

   ```shell
   kubectl get secrets
   ```

   <!--
   The response should be like this:
   -->

   響應應如下所示：

   ```
   NAME                    TYPE                                  DATA   AGE
   mysql-pass-c57bb4t7mf   Opaque                                1      9s
   ```

<!--
2. Verify that a PersistentVolume got dynamically provisioned.
-->
2. 驗證是否已動態製備 PersistentVolume：

   ```shell
   kubectl get pvc
   ```

   {{< note >}}
   <!--
   It can take up to a few minutes for the PVs to be provisioned and bound.
   -->

   製備和綁定 PV 可能要花費幾分鐘。
   {{< /note >}}

   <!--
   The response should be like this:
   -->

   響應應如下所示：

   ```
   NAME             STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS       AGE
   mysql-pv-claim   Bound     pvc-8cbd7b2e-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   wp-pv-claim      Bound     pvc-8cd0df54-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   ```

<!--
3. Verify that the Pod is running by running the following command:
-->
3. 通過運行以下命令來驗證 Pod 是否正在運行：

   ```shell
   kubectl get pods
   ```

   {{< note >}}
   <!--
   It can take up to a few minutes for the Pod's Status to be `RUNNING`.
   -->

   等待 Pod 狀態變成 `RUNNING` 可能會花費幾分鐘。
   {{< /note >}}

   <!--
   The response should be like this:
   -->

   響應應如下所示：

   ```
   NAME                               READY     STATUS    RESTARTS   AGE
   wordpress-mysql-1894417608-x5dzt   1/1       Running   0          40s
   ```

<!--
4. Verify that the Service is running by running the following command:
-->
4. 通過運行以下命令來驗證 Service 是否正在運行：

   ```shell
   kubectl get services wordpress
   ```

   <!--
   The response should be like this:
   -->

   響應應如下所示：

   ```
   NAME        TYPE            CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
   wordpress   LoadBalancer    10.0.0.89    <pending>     80:32406/TCP   4m
   ```

   {{< note >}}
   <!--
   Minikube can only expose Services through `NodePort`. The EXTERNAL-IP is always pending.
   -->

   Minikube 只能通過 NodePort 公開服務。EXTERNAL-IP 始終處於 pending 狀態。
   {{< /note >}}

<!--
5. Run the following command to get the IP Address for the WordPress Service:
-->
5. 運行以下命令以獲取 WordPress 服務的 IP 地址：

   ```shell
   minikube service wordpress --url
   ```

   <!--
   The response should be like this:
   -->
   響應應如下所示：

   ```
   http://1.2.3.4:32406
   ```

<!--
6. Copy the IP address, and load the page in your browser to view your site.

   You should see the WordPress set up page similar to the following screenshot.
-->
6. 複製 IP 地址，然後將頁面加載到瀏覽器中來查看你的站點。

   你應該看到類似於以下屏幕截圖的 WordPress 設置頁面。

   ![wordpress-init](https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/WordPress.png)

   {{< warning >}}
   <!--
   Do not leave your WordPress installation on this page. If another user finds it,
   they can set up a website on your instance and use it to serve malicious content.<br/><br/>
   Either install WordPress by creating a username and password or delete your instance.
   -->
   不要在此頁面上保留 WordPress 安裝。如果其他用戶找到了它，他們可以在你的實例上建立一個網站並使用它來提供惡意內容。<br/><br/>
   通過創建用戶名和密碼來安裝 WordPress 或刪除你的實例。
   {{< /warning >}}

## {{% heading "cleanup" %}}

<!--
1. Run the following command to delete your Secret, Deployments, Services and PersistentVolumeClaims:
-->
1. 運行以下命令刪除你的 Secret、Deployment、Service 和 PersistentVolumeClaims：

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
* 進一步瞭解[自省與調試](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/)
* 進一步瞭解 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
* 進一步瞭解[端口轉發](/zh-cn/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* 瞭解如何[獲得容器的 Shell](/zh-cn/docs/tasks/debug/debug-application/get-shell-running-container/)
