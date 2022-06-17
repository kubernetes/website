---
title: 配置多個排程器
content_type: task
weight: 20
---
<!--
reviewers:
- davidopp
- madhusudancs
title: Configure Multiple Schedulers
content_type: task
weight: 20
-->

<!-- overview -->

<!--
Kubernetes ships with a default scheduler that is described
[here](/docs/reference/command-line-tools-reference/kube-scheduler/).
If the default scheduler does not suit your needs you can implement your own scheduler.
Moreover, you can even run multiple schedulers simultaneously alongside the default
scheduler and instruct Kubernetes what scheduler to use for each of your pods. Let's
learn how to run multiple schedulers in Kubernetes with an example.
-->
Kubernetes 自帶了一個預設排程器，其詳細描述請查閱
[這裡](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)。
如果預設排程器不適合你的需求，你可以實現自己的排程器。
而且，你甚至可以和預設排程器一起同時執行多個排程器，並告訴 Kubernetes 為每個
Pod 使用哪個排程器。
讓我們透過一個例子講述如何在 Kubernetes 中執行多個排程器。

<!--
A detailed description of how to implement a scheduler is outside the scope of this
document. Please refer to the kube-scheduler implementation in
[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler)
in the Kubernetes source directory for a canonical example.
-->
關於實現排程器的具體細節描述超出了本文範圍。
請參考 kube-scheduler 的實現，規範示例程式碼位於
[pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Package the scheduler

Package your scheduler binary into a container image. For the purposes of this example,
you can use the default scheduler (kube-scheduler) as your second scheduler.
Clone the [Kubernetes source code from GitHub](https://github.com/kubernetes/kubernetes)
and build the source.
-->
## 打包排程器

將排程器可執行檔案打包到容器映象中。出於示例目的，可以使用預設排程器
（kube-scheduler）作為第二個排程器。
克隆 [GitHub 上 Kubernetes 原始碼](https://github.com/kubernetes/kubernetes)，
並編譯構建原始碼。

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make
```

<!--
Create a container image containing the kube-scheduler binary. Here is the `Dockerfile`
to build the image:
-->
建立一個包含 kube-scheduler 二進位制檔案的容器映象。用於構建映象的 `Dockerfile` 內容如下：

```docker
FROM busybox
ADD ./_output/local/bin/linux/amd64/kube-scheduler /usr/local/bin/kube-scheduler
```

<!--
Save the file as `Dockerfile`, build the image and push it to a registry. This example
pushes the image to
[Google Container Registry (GCR)](https://cloud.google.com/container-registry/).
For more details, please read the GCR
[documentation](https://cloud.google.com/container-registry/docs/).
-->
將檔案儲存為 `Dockerfile`，構建映象並將其推送到映象倉庫。
此示例將映象推送到 [Google 容器映象倉庫（GCR）](https://cloud.google.com/container-registry/)。
有關詳細資訊，請閱讀 GCR [文件](https://cloud.google.com/container-registry/docs/)。

```shell
docker build -t gcr.io/my-gcp-project/my-kube-scheduler:1.0 .
gcloud docker -- push gcr.io/my-gcp-project/my-kube-scheduler:1.0
```

<!--
## Define a Kubernetes Deployment for the scheduler

Now that you have your scheduler in a container image, create a pod
configuration for it and run it in your Kubernetes cluster. But instead of creating a pod
directly in the cluster, you can use a [Deployment](/docs/concepts/workloads/controllers/deployment/)
for this example. A [Deployment](/docs/concepts/workloads/controllers/deployment/) manages a
[Replica Set](/docs/concepts/workloads/controllers/replicaset/) which in turn manages the pods,
thereby making the scheduler resilient to failures. Here is the deployment
config. Save it as `my-scheduler.yaml`:
-->
## 為排程器定義 Kubernetes Deployment

現在將排程器放在容器映象中，為它建立一個 Pod 配置，並在 Kubernetes 叢集中
執行它。但是與其在叢集中直接建立一個 Pod，不如使用
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。
Deployment 管理一個 [ReplicaSet](/zh-cn/docs/concepts/workloads/controllers/replicaset/)，
ReplicaSet 再管理 Pod，從而使排程器能夠免受一些故障的影響。
以下是 Deployment 配置，將其儲存為 `my-scheduler.yaml`：

{{< codenew file="admin/sched/my-scheduler.yaml" >}}

<!--
In the above manifest, you use a [KubeSchedulerConfiguration](/docs/reference/scheduling/config/)
to customize the behavior of your scheduler implementation. This configuration has been passed to
the `kube-scheduler` during initialization with the `--config` option. The `my-scheduler-config` ConfigMap stores the configuration file. The Pod of the`my-scheduler` Deployment mounts the `my-scheduler-config` ConfigMap as a volume.
-->
在以上的清單中，你使用 [KubeSchedulerConfiguration](/zh-cn/docs/reference/scheduling/config/) 
來自定義排程器實現的行為。當使用 `--config` 選項進行初始化時，該配置被傳遞到 `kube-scheduler`。
`my-scheduler-config` ConfigMap 儲存配置資料。
`my-scheduler` Deployment 的 Pod 將 `my-scheduler-config` ConfigMap 掛載為一個卷。

<!--
In the aforementioned Scheduler Configuration, your scheduler implementation is represented via
a [KubeSchedulerProfile](/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerProfile).
{{< note >}}
To determine if a scheduler is responsible for scheduling a specific Pod, the `spec.schedulerName` field in a
PodTemplate or Pod manifest must match the `schedulerName` field of the `KubeSchedulerProfile`.
All schedulers running in the cluster must have unique names.
{{< /note >}}
-->
在前面提到的排程器配置中，你的排程器透過 [KubeSchedulerProfile](/docs/reference/config-api/kube-scheduler-config.v1beta3/#kubescheduler-config-k8s-io-v1beta3-KubeSchedulerProfile) 進行實現。
{{< note >}}
要確定一個排程器是否可以排程特定的 Pod，PodTemplate 或 Pod 清單中的 `spec.schedulerName` 
欄位必須匹配 `KubeSchedulerProfile` 中的 `schedulerName` 欄位。
所有執行在叢集中的排程器必須擁有唯一的名稱。
{{< /note >}}

<!--
Also, note that you create a dedicated service account `my-scheduler` and bind the ClusterRole
`system:kube-scheduler` to it so that it can acquire the same privileges as `kube-scheduler`.
-->
還要注意，我們建立了一個專用服務賬號 `my-scheduler` 並將叢集角色 `system:kube-scheduler`
繫結到它，以便它可以獲得與 `kube-scheduler` 相同的許可權。

<!--
Please see the
[kube-scheduler documentation](/docs/reference/command-line-tools-reference/kube-scheduler/) for
detailed description of other command line arguments and
[Scheduler Configuration reference](/docs/reference/config-api/kube-scheduler-config.v1beta3/) for
detailed description of other customizable `kube-scheduler` configurations.
-->
請參閱 [kube-scheduler 文件](/docs/reference/command-line-tools-reference/kube-scheduler/)
獲取其他命令列引數以及 [Scheduler 配置參考](/docs/reference/config-api/kube-scheduler-config.v1beta3/)
獲取自定義 `kube-scheduler` 配置的詳細說明。

<!--
## Run the second scheduler in the cluster

In order to run your scheduler in a Kubernetes cluster, create the deployment
specified in the config above in a Kubernetes cluster:
-->
## 在叢集中執行第二個排程器

為了在 Kubernetes 叢集中執行我們的第二個排程器，在 Kubernetes 叢集中建立上面配置中指定的 Deployment：

```shell
kubectl create -f my-scheduler.yaml
```

<!--
Verify that the scheduler pod is running:
-->
驗證排程器 Pod 正在執行：

```shell
kubectl get pods --namespace=kube-system
```

輸出類似於：

```
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

<!--
You should see a "Running" my-scheduler pod, in addition to the default kube-scheduler
pod in this list.
-->
此列表中，除了預設的 `kube-scheduler` Pod 之外，你應該還能看到處於 “Running” 狀態的
`my-scheduler` Pod。


<!--
### Enable leader election

To run multiple-scheduler with leader election enabled, you must do the following:

Update the following fields for the KubeSchedulerConfiguration in the `my-scheduler-config` ConfigMap in your YAML file:
-->
### 啟用領導者選舉

要在啟用了 leader 選舉的情況下執行多排程器，你必須執行以下操作：

更新你的 YAML 檔案中的 `my-scheduler-config` ConfigMap 裡的 KubeSchedulerConfiguration 相關欄位如下：

* `leaderElection.leaderElect` to `true`
* `leaderElection.resourceNamespace` to `<lock-object-namespace>`
* `leaderElection.resourceName` to `<lock-object-name>`

{{< note >}}
<!--
The control plane creates the lock objects for you, but the namespace must already exist.
You can use the `kube-system` namespace.
-->
控制平面會為你建立鎖物件，但是名稱空間必須已經存在。
你可以使用 `kube-system` 名稱空間。
{{< /note >}}

<!--
If RBAC is enabled on your cluster, you must update the `system:kube-scheduler` cluster role.
Add your scheduler name to the resourceNames of the rule applied for `endpoints` and `leases` resources, as in the following example:
-->
如果在叢集上啟用了 RBAC，則必須更新 `system：kube-scheduler` 叢集角色。
將排程器名稱新增到應用了 `endpoints` 和 `leases` 資源的規則的 resourceNames 中，如以下示例所示：

```shell
kubectl edit clusterrole system:kube-scheduler
```

{{< codenew file="admin/sched/clusterrole.yaml" >}}

<!--
## Specify schedulers for pods
-->
## 為 Pod 指定排程器

<!--
Now that your second scheduler is running, create some pods, and direct them
to be scheduled by either the default scheduler or the one you deployed.
In order to schedule a given pod using a specific scheduler, specify the name of the
scheduler in that pod spec. Let's look at three examples.
-->
現在第二個排程器正在執行，建立一些 Pod，並指定它們由預設排程器或部署的排程器進行排程。
為了使用特定的排程器排程給定的 Pod，在那個 Pod 的 spec 中指定排程器的名稱。讓我們看看三個例子。

<!--
- Pod spec without any scheduler name
-->
- Pod spec 沒有任何排程器名稱

  {{< codenew file="admin/sched/pod1.yaml" >}}

  <!--
  When no scheduler name is supplied, the pod is automatically scheduled using the
  default-scheduler.
  -->
  如果未提供排程器名稱，則會使用 default-scheduler 自動排程 pod。

  <!--
  Save this file as `pod1.yaml` and submit it to the Kubernetes cluster.
  -->
  將此檔案另存為 `pod1.yaml`，並將其提交給 Kubernetes 叢集。

  ```shell
  kubectl create -f pod1.yaml
  ```

<!--
- Pod spec with `default-scheduler`
-->
- Pod spec 設定為 `default-scheduler`

  {{< codenew file="admin/sched/pod2.yaml" >}}

  <!--
  A scheduler is specified by supplying the scheduler name as a value to `spec.schedulerName`. In this case, we supply the name of the
  default scheduler which is `default-scheduler`.
  -->
  透過將排程器名稱作為 `spec.schedulerName` 引數的值來指定排程器。
  在這種情況下，我們提供預設排程器的名稱，即 `default-scheduler`。

  <!--
  Save this file as `pod2.yaml` and submit it to the Kubernetes cluster.
  -->
  將此檔案另存為 `pod2.yaml`，並將其提交給 Kubernetes 叢集。

  ```shell
  kubectl create -f pod2.yaml
  ```

<!--
- Pod spec with `my-scheduler`
-->
- Pod spec 設定為 `my-scheduler`

  {{< codenew file="admin/sched/pod3.yaml" >}}

  <!--
  In this case, we specify that this pod should be scheduled using the scheduler that we
  deployed - `my-scheduler`. Note that the value of `spec.schedulerName` should match the name supplied for the scheduler
  in the `schedulerName` field of the mapping `KubeSchedulerProfile`.
  -->
  在這種情況下，我們指定此 Pod 使用我們部署的 `my-scheduler` 來排程。
  請注意，`spec.schedulerName` 引數的值應該與排程器提供的 `KubeSchedulerProfile` 中的 `schedulerName` 欄位相匹配。

  <!--
  Save this file as `pod3.yaml` and submit it to the Kubernetes cluster.
  -->
  將此檔案另存為 `pod3.yaml`，並將其提交給 Kubernetes 叢集。

  ```shell
  kubectl create -f pod3.yaml
  ```

<!--
  Verify that all three pods are running.
-->
  確認所有三個 pod 都在執行。

  ```shell
  kubectl get pods
  ```

<!-- discussion -->

<!--
### Verifying that the pods were scheduled using the desired schedulers
-->
### 驗證是否使用所需的排程器排程了 pod

<!--
In order to make it easier to work through these examples, we did not verify that the
pods were actually scheduled using the desired schedulers. We can verify that by
changing the order of pod and deployment config submissions above. If we submit all the
pod configs to a Kubernetes cluster before submitting the scheduler deployment config,
we see that the pod `annotation-second-scheduler` remains in "Pending" state forever
while the other two pods get scheduled. Once we submit the scheduler deployment config
and our new scheduler starts running, the `annotation-second-scheduler` pod gets
scheduled as well.
-->
為了更容易地完成這些示例，我們沒有驗證 Pod 實際上是使用所需的排程程式排程的。
我們可以透過更改 Pod 的順序和上面的部署配置提交來驗證這一點。
如果我們在提交排程器部署配置之前將所有 Pod 配置提交給 Kubernetes 叢集，
我們將看到註解了 `annotation-second-scheduler` 的 Pod 始終處於 “Pending” 狀態，
而其他兩個 Pod 被排程。
一旦我們提交排程器部署配置並且我們的新排程器開始執行，註解了
`annotation-second-scheduler` 的 pod 就能被排程。
<!--
Alternatively, you can look at the "Scheduled" entries in the event logs to
verify that the pods were scheduled by the desired schedulers.
-->
或者，可以檢視事件日誌中的 “Scheduled” 條目，以驗證是否由所需的排程器排程了 Pod。

```shell
kubectl get events
```

<!--
You can also use a [custom scheduler configuration](/docs/reference/scheduling/config/#multiple-profiles)
or a custom container image for the cluster's main scheduler by modifying its static pod manifest
on the relevant control plane nodes.
-->
你也可以使用[自定義排程器配置](/zh-cn/docs/reference/scheduling/config/#multiple-profiles)
或自定義容器映象，用於叢集的主排程器，方法是在相關控制平面節點上修改其靜態 pod 清單。

