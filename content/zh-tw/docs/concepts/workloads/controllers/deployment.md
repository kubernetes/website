---
title: Deployments
feature:
  title: 自動化上線和回滾
  description: >
    Kubernetes 會分步驟地將針對應用或其配置的更改上線，同時監視應用程式執行狀況以確保你不會同時終止所有例項。如果出現問題，Kubernetes 會為你回滾所作更改。你應該充分利用不斷成長的部署方案生態系統。
content_type: concept
weight: 10
---
<!--
title: Deployments
feature:
  title: Automated rollouts and rollbacks
  description: >
    Kubernetes progressively rolls out changes to your application or its configuration, while monitoring application health to ensure it doesn't kill all your instances at the same time. If something goes wrong, Kubernetes will rollback the change for you. Take advantage of a growing ecosystem of deployment solutions.

content_type: concept
weight: 10
-->

<!-- overview -->

<!--
A _Deployment_ provides declarative updates for [Pods](/docs/concepts/workloads/pods/pod/) and
[ReplicaSets](/docs/concepts/workloads/controllers/replicaset/).
-->
一個 Deployment 為 {{< glossary_tooltip text="Pod" term_id="pod" >}}
和 {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}
提供宣告式的更新能力。

<!--
You describe a _desired state_ in a Deployment, and the Deployment {{< glossary_tooltip term_id="controller" >}} changes the actual state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove existing Deployments and adopt all their resources with new Deployments.
-->
你負責描述 Deployment 中的 _目標狀態_，而 Deployment {{< glossary_tooltip term_id="controller" >}}
以受控速率更改實際狀態，
使其變為期望狀態。你可以定義 Deployment 以建立新的 ReplicaSet，或刪除現有 Deployment，
並透過新的 Deployment 收養其資源。

{{< note >}}
<!--
Do not manage ReplicaSets owned by a Deployment. Consider opening an issue in the main Kubernetes repository if your use case is not covered below.
-->
不要管理 Deployment 所擁有的 ReplicaSet 。
如果存在下面未覆蓋的使用場景，請考慮在 Kubernetes 倉庫中提出 Issue。
{{< /note >}}

<!-- body -->

<!--
## Use Case

The following are typical use cases for Deployments:
-->
## 用例

以下是 Deployments 的典型用例：

<!--
* [Create a Deployment to rollout a ReplicaSet](#creating-a-deployment). The ReplicaSet creates Pods in the background. Check the status of the rollout to see if it succeeds or not.
* [Declare the new state of the Pods](#updating-a-deployment) by updating the PodTemplateSpec of the Deployment. A new ReplicaSet is created and the Deployment manages moving the Pods from the old ReplicaSet to the new one at a controlled rate. Each new ReplicaSet updates the revision of the Deployment.
-->
* [建立 Deployment 以將 ReplicaSet 上線](#creating-a-deployment)。 ReplicaSet 在後臺建立 Pods。
  檢查 ReplicaSet 的上線狀態，檢視其是否成功。
* 透過更新 Deployment 的 PodTemplateSpec，[宣告 Pod 的新狀態](#updating-a-deployment) 。
  新的 ReplicaSet 會被建立，Deployment 以受控速率將 Pod 從舊 ReplicaSet 遷移到新 ReplicaSet。
  每個新的 ReplicaSet 都會更新 Deployment 的修訂版本。
<!--
* [Rollback to an earlier Deployment revision](#rolling-back-a-deployment) if the current state of the Deployment is not stable. Each rollback updates the revision of the Deployment.
* [Scale up the Deployment to facilitate more load](#scaling-a-deployment).
* [Pause the Deployment](#pausing-and-resuming-a-deployment) to apply multiple fixes to its PodTemplateSpec and then resume it to start a new rollout.
* [Use the status of the Deployment](#deployment-status) as an indicator that a rollout has stuck.
* [Clean up older ReplicaSets](#clean-up-policy) that you don't need anymore.
-->
* 如果 Deployment 的當前狀態不穩定，[回滾到較早的 Deployment 版本](#rolling-back-a-deployment)。
  每次回滾都會更新 Deployment 的修訂版本。
* [擴大 Deployment 規模以承擔更多負載](#scaling-a-deployment)。
* [暫停 Deployment ](#pausing-and-resuming-a-deployment) 以應用對 PodTemplateSpec 所作的多項修改，
  然後恢復其執行以啟動新的上線版本。
* [使用 Deployment 狀態](#deployment-status) 來判定上線過程是否出現停滯。
* [清理較舊的不再需要的 ReplicaSet](#clean-up-policy) 。

<!--
 ## Creating a Deployment

The following is an example of a Deployment. It creates a ReplicaSet to bring up three `nginx` Pods:
-->
## 建立 Deployment  {#creating-a-deployment}

下面是一個 Deployment 示例。其中建立了一個 ReplicaSet，負責啟動三個 `nginx` Pods：

{{< codenew file="controllers/nginx-deployment.yaml" >}}

<!--
In this example:
-->
在該例中：

<!--
 * A Deployment named `nginx-deployment` is created, indicated by the `.metadata.name` field.
 * The Deployment creates three replicated Pods, indicated by the `replicas` field.
-->
* 建立名為 `nginx-deployment`（由 `.metadata.name` 欄位標明）的 Deployment。
* 該 Deployment 建立三個（由 `replicas` 欄位標明）Pod 副本。

<!--
* The `selector` field defines how the Deployment finds which Pods to manage.
  In this case, you select a label that is defined in the Pod template (`app: nginx`).
  However, more sophisticated selection rules are possible,
  as long as the Pod template itself satisfies the rule.
-->
* `selector` 欄位定義 Deployment 如何查詢要管理的 Pods。
  在這裡，你選擇在 Pod 模板中定義的標籤（`app: nginx`）。
  不過，更復雜的選擇規則是也可能的，只要 Pod 模板本身滿足所給規則即可。

  {{< note >}}
  <!--
  The `spec.selector.matchLabels` field is a map of {key,value} pairs.
  A single {key,value} in the `matchLabels` map is equivalent to an element of `matchExpressions`,
  whose `key` field is "key", the `operator` is "In", and the `values` array contains only "value".
  All of the requirements, from both `matchLabels` and `matchExpressions`, must be satisfied in order to match.
  -->
  `spec.selector.matchLabels` 欄位是 `{key,value}` 鍵值對對映。
  在 `matchLabels` 對映中的每個 `{key,value}` 對映等效於 `matchExpressions` 中的一個元素，
  即其 `key` 欄位是 “key”，`operator` 為 “In”，`values` 陣列僅包含 “value”。
  在 `matchLabels` 和 `matchExpressions` 中給出的所有條件都必須滿足才能匹配。
  {{< /note >}}

<!--
* The `template` field contains the following sub-fields:
  * The Pods are labeled `app: nginx`using the `.meatadata.labels` field.
  * The Pod template's specification, or `.template.spec` field, indicates that
    the Pods run one container, `nginx`, which runs the `nginx`
    [Docker Hub](https://hub.docker.com/) image at version 1.14.2.
  * Create one container and name it `nginx` using the `.spec.template.spec.containers[0].name` field.
-->
* `template` 欄位包含以下子欄位：
  * Pod 被使用 `.metadata.labels` 欄位打上 `app: nginx` 標籤。
  * Pod 模板規約（即 `.template.spec` 欄位）指示 Pods 執行一個 `nginx` 容器，
    該容器執行版本為 1.14.2 的 `nginx` [Docker Hub](https://hub.docker.com/)映象。
  * 建立一個容器並使用 `.spec.template.spec.containers[0].name` 欄位將其命名為 `nginx`。

<!--
Before you begin, make sure your Kubernetes cluster is up and running.
Follow the steps given below to create the above Deployment:
-->
開始之前，請確保的 Kubernetes 叢集已啟動並執行。
按照以下步驟建立上述 Deployment ：

<!--
1. Create the Deployment by running the following command:
-->
1. 透過執行以下命令建立 Deployment ：

   ```shell
   kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
   ```

<!--
 2. Run `kubectl get deployments` to check if the Deployment was created.

    If the Deployment is still being created, the output is similar to the following:
-->
2. 執行 `kubectl get deployments` 檢查 Deployment 是否已建立。
   如果仍在建立 Deployment，則輸出類似於：

   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   0/3     0            0           1s
   ```

   <!--
   When you inspect the Deployments in your cluster, the following fields are displayed:
   -->
   在檢查叢集中的 Deployment 時，所顯示的欄位有：

   <!--
   * `NAME` lists the names of the Deployments in the cluster.
   * `READY` displays how many replicas of the application are available to your users. It follows the pattern ready/desired.
   * `UP-TO-DATE` displays the number of replicas that have been updated to achieve the desired state.
   * `AVAILABLE` displays how many replicas of the application are available to your users.
   * `AGE` displays the amount of time that the application has been running.
   -->
   * `NAME` 列出了叢集中 Deployment 的名稱。
   * `READY` 顯示應用程式的可用的“副本”數。顯示的模式是“就緒個數/期望個數”。
   * `UP-TO-DATE` 顯示為了達到期望狀態已經更新的副本數。
   * `AVAILABLE` 顯示應用可供使用者使用的副本數。
   * `AGE` 顯示應用程式執行的時間。

   <!--
   Notice how the number of desired replicas is 3 according to `.spec.replicas` field.
   -->
   請注意期望副本數是根據 `.spec.replicas` 欄位設定 3。

<!--
3. To see the Deployment rollout status, run `kubectl rollout status deployment/nginx-deployment`.

   The output is similar to:
-->
3. 要檢視 Deployment 上線狀態，執行 `kubectl rollout status deployment/nginx-deployment`。

   輸出類似於：

   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   deployment "nginx-deployment" successfully rolled out
   ```

<!--
4. Run the `kubectl get deployments` again a few seconds later. The output is similar to this:
-->
4. 幾秒鐘後再次執行 `kubectl get deployments`。輸出類似於：

   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           18s
   ```

   <!--
   Notice that the Deployment has created all three replicas, and all replicas are up-to-date (they contain the latest Pod template) and available.
   -->
   注意 Deployment 已建立全部三個副本，並且所有副本都是最新的（它們包含最新的 Pod 模板）
   並且可用。

<!--
5. To see the ReplicaSet (`rs`) created by the Deployment, run `kubectl get rs`. The output is similar to this:
-->
5. 要檢視 Deployment 建立的 ReplicaSet（`rs`），執行 `kubectl get rs`。
   輸出類似於：

   ```
   NAME                          DESIRED   CURRENT   READY   AGE
   nginx-deployment-75675f5897   3         3         3       18s
   ```

   <!--
   ReplicaSet output shows the following fields:

   * `NAME` lists the names of the ReplicaSets in the namespace.
   * `DESIRED` displays the desired number of _replicas_ of the application, which you define when you create the Deployment. This is the _desired state_.
   * `CURRENT` displays how many replicas are currently running.
   * `READY` displays how many replicas of the application are available to your users.
   * `AGE` displays the amount of time that the application has been running.
   -->
   ReplicaSet 輸出中包含以下欄位：

   * `NAME` 列出名字空間中 ReplicaSet 的名稱；
   * `DESIRED` 顯示應用的期望副本個數，即在建立 Deployment 時所定義的值。
     此為期望狀態；
   * `CURRENT` 顯示當前執行狀態中的副本個數；
   * `READY` 顯示應用中有多少副本可以為使用者提供服務；
   * `AGE` 顯示應用已經執行的時間長度。

   <!--
   Notice that the name of the ReplicaSet is always formatted as `[DEPLOYMENT-NAME]-[RANDOM-STRING]`. The random string is
   randomly generated and uses the `pod-template-hash` as a seed.
   -->
   注意 ReplicaSet 的名稱始終被格式化為`[Deployment名稱]-[隨機字串]`。
   其中的隨機字串是使用 `pod-template-hash` 作為種子隨機生成的。

<!--
6. To see the labels automatically generated for each Pod, run `kubectl get pods -show-labels`.
   The following output is returned:
-->
6. 要檢視每個 Pod 自動生成的標籤，執行 `kubectl get pods --show-labels`。返回以下輸出：

   ```
   NAME                                READY     STATUS    RESTARTS   AGE       LABELS
   nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
   nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
   nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
   ```

   <!--
   The created ReplicaSet ensures that there are three `nginx` Pods.
   -->
   所建立的 ReplicaSet 確保總是存在三個 `nginx` Pod。

{{< note >}}
<!--
You must specify an appropriate selector and Pod template labels in a Deployment
(in this case, `app: nginx`).

Do not overlap labels or selectors with other controllers (including other Deployments and StatefulSets). Kubernetes doesn't stop you from overlapping, and if multiple controllers have overlapping selectors those controllers might conflict and behave unexpectedly.
-->
你必須在 Deployment 中指定適當的選擇算符和 Pod 模板標籤（在本例中為 `app: nginx`）。
標籤或者選擇算符不要與其他控制器（包括其他 Deployment 和 StatefulSet）重疊。
Kubernetes 不會阻止你這樣做，但是如果多個控制器具有重疊的選擇算符，
它們可能會發生衝突執行難以預料的操作。
{{< /note >}}

<!--
 ### Pod-template-hash label
-->
### Pod-template-hash 標籤

{{< note >}}
<!--
Do not change this label.
-->
不要更改此標籤。
{{< /note >}}

<!--
The `pod-template-hash` label is added by the Deployment controller to every ReplicaSet that a Deployment creates or adopts.
-->
Deployment 控制器將 `pod-template-hash` 標籤新增到 Deployment
所建立或收留的每個 ReplicaSet 。

<!--
This label ensures that child ReplicaSets of a Deployment do not overlap. It is generated by hashing the `PodTemplate` of the ReplicaSet and using the resulting hash as the label value that is added to the ReplicaSet selector, Pod template labels,
and in any existing Pods that the ReplicaSet might have.
-->
此標籤可確保 Deployment 的子 ReplicaSets 不重疊。
標籤是透過對 ReplicaSet 的 `PodTemplate` 進行雜湊處理。
所生成的雜湊值被新增到 ReplicaSet 選擇算符、Pod 模板標籤，並存在於在 ReplicaSet
可能擁有的任何現有 Pod 中。

<!--
 ## Updating a Deployment
-->
## 更新 Deployment   {#updating-a-deployment}

{{< note >}}
<!--
 A Deployment's rollout is triggered if and only if the Deployment's Pod template (that is, `.spec.template`)
is changed, for example if the labels or container images of the template are updated. Other updates, such as scaling the Deployment, do not trigger a rollout.
-->
僅當 Deployment Pod 模板（即 `.spec.template`）發生改變時，例如模板的標籤或容器映象被更新，
才會觸發 Deployment 上線。其他更新（如對 Deployment 執行擴縮容的操作）不會觸發上線動作。
{{< /note >}}

<!--
Follow the steps given below to update your Deployment:
-->
按照以下步驟更新 Deployment：

<!--
1. Let's update the nginx Pods to use the `nginx:1.16.1` image instead of the `nginx:1.14.2` image.
-->
1. 先來更新 nginx Pod 以使用 `nginx:1.16.1` 映象，而不是 `nginx:1.14.2` 映象。

   ```shell
   kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
   ```
   <!--
   or use the following command:
   -->
   或者使用下面的命令：
    
   ```shell
   kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```
   deployment/nginx-deployment image updated
   ```

   <!--
   Alternatively, you can `edit` the Deployment and change `.spec.template.spec.containers[0].image` from `nginx:1.14.2` to `nginx:1.16.1`:
   -->
   或者，可以對 Deployment 執行 `edit` 操作並將 `.spec.template.spec.containers[0].image` 從
   `nginx:1.14.2` 更改至 `nginx:1.16.1`。

   ```shell
   kubectl edit deployment/nginx-deployment
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

   ```
   deployment/nginx-deployment edited
   ```

<!--
2. To see the rollout status, run:
-->
2. 要檢視上線狀態，執行：

   ```shell
   kubectl rollout status deployment/nginx-deployment
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   ```
   <!-- or -->
   或者

   ```
   deployment "nginx-deployment" successfully rolled out
   ```

<!--
Get more details on your updated Deployment:
-->
獲取關於已更新的 Deployment 的更多資訊：

<!--
* After the rollout succeeds, you can view the Deployment by running `kubectl get deployments`.
  The output is similar to this:
-->
* 在上線成功後，可以透過執行 `kubectl get deployments` 來檢視 Deployment：
  輸出類似於：

  ```ini
  NAME               READY   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment   3/3     3            3           36s
  ```

<!--
* Run `kubectl get rs` to see that the Deployment updated the Pods by creating a new ReplicaSet and scaling it
up to 3 replicas, as well as scaling down the old ReplicaSet to 0 replicas.
-->
* 執行 `kubectl get rs` 以檢視 Deployment 透過建立新的 ReplicaSet 並將其擴容到
  3 個副本並將舊 ReplicaSet 縮容到 0 個副本完成了 Pod 的更新操作：

  ```shell
  kubectl get rs
  ```

  <!--
  The output is similar to:
  -->
  輸出類似於：

  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       6s
  nginx-deployment-2035384211   0         0         0       36s
  ```

<!--
* Running `get pods` should now show only the new Pods:
-->
* 現在執行 `get pods` 應僅顯示新的 Pods:

  ```shell
  kubectl get pods
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```
  NAME                                READY     STATUS    RESTARTS   AGE
  nginx-deployment-1564180365-khku8   1/1       Running   0          14s
  nginx-deployment-1564180365-nacti   1/1       Running   0          14s
  nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
  ```

  <!--
  Next time you want to update these Pods, you only need to update the Deployment's Pod template again.

  Deployment ensures that only a certain number of Pods are down while they are being updated. By default,
  it ensures that at least 75% of the desired number of Pods are up (25% max unavailable).
  -->
  下次要更新這些 Pods 時，只需再次更新 Deployment Pod 模板即可。

  Deployment 可確保在更新時僅關閉一定數量的 Pod。預設情況下，它確保至少所需 Pods
  75% 處於執行狀態（最大不可用比例為 25%）。

  <!--
  Deployment also ensures that only a certain number of Pods are created above the desired number of Pods.
  By default, it ensures that at most 25% of the desired number of Pods are up (25% max surge).
  -->
  Deployment 還確保僅所建立 Pod 數量只可能比期望 Pods 數高一點點。
  預設情況下，它可確保啟動的 Pod 個數比期望個數最多多出 25%（最大峰值 25%）。

  <!--   
  For example, if you look at the above Deployment closely, you will see that it first created a new Pod,
  then deleted some old Pods, and created new ones. It does not kill old Pods until a sufficient number of
  new Pods have come up, and does not create new Pods until a sufficient number of old Pods have been killed.
  It makes sure that at least 2 Pods are available and that at max 4 Pods in total are available. In case of
    a Deployment with 4 replicas, the number of Pods would be between 3 and 5.
  -->
  例如，如果仔細檢視上述 Deployment ，將看到它首先建立了一個新的 Pod，然後刪除了一些舊的 Pods，
  並建立了新的 Pods。它不會殺死老 Pods，直到有足夠的數量新的 Pods 已經出現。
  在足夠數量的舊 Pods 被殺死前並沒有建立新 Pods。它確保至少 2 個 Pod 可用，
  同時最多總共 4 個 Pod 可用。
  當 Deployment 設定為 4 個副本時，Pod 的個數會介於 3 和 5 之間。

<!--
* Get details of your Deployment:
-->
* 獲取 Deployment 的更多資訊

  ```shell
  kubectl describe deployments
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```
  Name:                   nginx-deployment
  Namespace:              default
  CreationTimestamp:      Thu, 30 Nov 2017 10:56:25 +0000
  Labels:                 app=nginx
  Annotations:            deployment.kubernetes.io/revision=2
  Selector:               app=nginx
  Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
  StrategyType:           RollingUpdate
  MinReadySeconds:        0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
     Containers:
      nginx:
        Image:        nginx:1.16.1
        Port:         80/TCP
        Environment:  <none>
        Mounts:       <none>
      Volumes:        <none>
    Conditions:
      Type           Status  Reason
      ----           ------  ------
      Available      True    MinimumReplicasAvailable
      Progressing    True    NewReplicaSetAvailable
    OldReplicaSets:  <none>
    NewReplicaSet:   nginx-deployment-1564180365 (3/3 replicas created)
    Events:
      Type    Reason             Age   From                   Message
      ----    ------             ----  ----                   -------
      Normal  ScalingReplicaSet  2m    deployment-controller  Scaled up replica set nginx-deployment-2035384211 to 3
      Normal  ScalingReplicaSet  24s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 1
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 2
      Normal  ScalingReplicaSet  22s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 2
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 1
      Normal  ScalingReplicaSet  19s   deployment-controller  Scaled up replica set nginx-deployment-1564180365 to 3
      Normal  ScalingReplicaSet  14s   deployment-controller  Scaled down replica set nginx-deployment-2035384211 to 0
  ```

  <!--
  Here you see that when you first created the Deployment, it created a ReplicaSet (nginx-deployment-2035384211)
  and scaled it up to 3 replicas directly. When you updated the Deployment, it created a new ReplicaSet
  (nginx-deployment-1564180365) and scaled it up to 1 and waited for it to come up. Then it scaled down the old ReplicaSet
  to 2 and scaled up the new ReplicaSet to 2 so that at least 3 Pods were available and at most 4 Pods were created at all times.
  It then continued scaling up and down the new and the old ReplicaSet, with the same rolling update strategy.
  Finally, you'll have 3 available replicas
  in the new ReplicaSet, and the old ReplicaSet is scaled down to 0.
  -->
  可以看到，當第一次建立 Deployment 時，它建立了一個 ReplicaSet（`nginx-deployment-2035384211`）
  並將其直接擴容至 3 個副本。更新 Deployment 時，它建立了一個新的 ReplicaSet
  （nginx-deployment-1564180365），並將其擴容為 1，等待其就緒；然後將舊 ReplicaSet 縮容到 2，
  將新的 ReplicaSet 擴容到 2 以便至少有 3 個 Pod 可用且最多建立 4 個 Pod。
  然後，它使用相同的滾動更新策略繼續對新的 ReplicaSet 擴容並對舊的 ReplicaSet 縮容。
  最後，你將有 3 個可用的副本在新的 ReplicaSet 中，舊 ReplicaSet 將縮容到 0。

{{< note >}}
<!--
Kubernetes doesn't count terminating Pods when calculating the number of `availableReplicas`, which must be between
`replicas - maxUnavailable` and `replicas + maxSurge`. As a result, you might notice that there are more Pods than
expected during a rollout, and that the total resources consumed by the Deployment is more than `replicas + maxSurge`
until the `terminationGracePeriodSeconds` of the terminating Pods expires.
-->
Kubernetes 在計算 `availableReplicas` 數值時不考慮終止過程中的 Pod，
`availableReplicas` 的值一定介於 `replicas - maxUnavailable` 和 `replicas + maxSurge` 之間。
因此，你可能在上線期間看到 Pod 個數比預期的多，Deployment 所消耗的總的資源也大於
`replicas + maxSurge` 個 Pod 所用的資源，直到被終止的 Pod 所設定的
`terminationGracePeriodSeconds` 到期為止。
{{< /note >}}

<!--
### Rollover (aka multiple updates in-flight)

Each time a new Deployment is observed by the Deployment controller, a ReplicaSet is created to bring up
the desired Pods. If the Deployment is updated, the existing ReplicaSet that controls Pods whose labels
match `.spec.selector` but whose template does not match `.spec.template` are scaled down. Eventually, the new
ReplicaSet is scaled to `.spec.replicas` and all old ReplicaSets is scaled to 0.
-->
### 翻轉（多 Deployment 動態更新）

Deployment 控制器每次注意到新的 Deployment 時，都會建立一個 ReplicaSet 以啟動所需的 Pods。
如果更新了 Deployment，則控制標籤匹配 `.spec.selector` 但模板不匹配 `.spec.template` 的
Pods 的現有 ReplicaSet 被縮容。最終，新的 ReplicaSet 縮放為 `.spec.replicas` 個副本，
所有舊 ReplicaSets 縮放為 0 個副本。

<!--
If you update a Deployment while an existing rollout is in progress, the Deployment creates a new ReplicaSet
as per the update and start scaling that up, and rolls over the ReplicaSet that it was scaling up previously
- it will add it to its list of old ReplicaSets and start scaling it down.
-->
當 Deployment 正在上線時被更新，Deployment 會針對更新建立一個新的 ReplicaSet
並開始對其擴容，之前正在被擴容的 ReplicaSet 會被翻轉，新增到舊 ReplicaSets 列表
並開始縮容。

<!--
For example, suppose you create a Deployment to create 5 replicas of `nginx:1.14.2`,
but then update the Deployment to create 5 replicas of `nginx:1.16.1`, when only 3
replicas of `nginx:1.7.9` had been created. In that case, the Deployment immediately starts
killing the 3 `nginx:1.7.9` Pods that it had created, and starts creating
`nginx:1.9.1` Pods. It does not wait for the 5 replicas of `nginx:1.14.2` to be created
before changing course.
-->
例如，假定你在建立一個 Deployment 以生成 `nginx:1.14.2` 的 5 個副本，但接下來
更新 Deployment 以建立 5 個 `nginx:1.16.1` 的副本，而此時只有 3 個`nginx:1.14.2`
副本已建立。在這種情況下，Deployment 會立即開始殺死 3 個 `nginx:1.14.2` Pods，
並開始建立 `nginx:1.16.1` Pods。它不會等待 `nginx:1.14.2` 的 5
個副本都建立完成後才開始執行變更動作。

<!--
### Label selector updates

 It is generally discouraged to make label selector updates and it is suggested to plan your selectors up front.
In any case, if you need to perform a label selector update, exercise great caution and make sure you have grasped
all of the implications.
-->
### 更改標籤選擇算符   {#label-selector-updates}

通常不鼓勵更新標籤選擇算符。建議你提前規劃選擇算符。
在任何情況下，如果需要更新標籤選擇算符，請格外小心，
並確保自己瞭解這背後可能發生的所有事情。

{{< note >}}
<!--
In API version `apps/v1`, a Deployment's label selector is immutable after it gets created.
-->
在 API 版本 `apps/v1` 中，Deployment 標籤選擇算符在建立後是不可變的。
{{< /note >}}

<!--
 * Selector additions require the Pod template labels in the Deployment spec to be updated with the new label too,
otherwise a validation error is returned. This change is a non-overlapping one, meaning that the new selector does
not select ReplicaSets and Pods created with the old selector, resulting in orphaning all old ReplicaSets and
creating a new ReplicaSet.
* Selector updates changes the existing value in a selector key - result in the same behavior as additions.
* Selector removals removes an existing key from the Deployment selector - do not require any changes in the
Pod template labels. Existing ReplicaSets are not orphaned, and a new ReplicaSet is not created, but note that the
removed label still exists in any existing Pods and ReplicaSets.
-->
* 新增選擇算符時要求使用新標籤更新 Deployment 規約中的 Pod 模板標籤，否則將返回驗證錯誤。
  此更改是非重疊的，也就是說新的選擇算符不會選擇使用舊選擇算符所建立的 ReplicaSet 和 Pod，
  這會導致建立新的 ReplicaSet 時所有舊 ReplicaSet 都會被孤立。
* 選擇算符的更新如果更改了某個算符的鍵名，這會導致與新增算符時相同的行為。
* 刪除選擇算符的操作會刪除從 Deployment 選擇算符中刪除現有算符。
  此操作不需要更改 Pod 模板標籤。現有 ReplicaSet 不會被孤立，也不會因此建立新的 ReplicaSet，
  但請注意已刪除的標籤仍然存在於現有的 Pod 和 ReplicaSet 中。

<!--
## Rolling Back a Deployment
-->
## 回滾 Deployment {#rolling-back-a-deployment}

<!--
 Sometimes, you may want to rollback a Deployment; for example, when the Deployment is not stable, such as crash looping.
By default, all of the Deployment's rollout history is kept in the system so that you can rollback anytime you want
(you can change that by modifying revision history limit).
-->
有時，你可能想要回滾 Deployment；例如，當 Deployment 不穩定時（例如進入反覆崩潰狀態）。
預設情況下，Deployment 的所有上線記錄都保留在系統中，以便可以隨時回滾
（你可以透過修改修訂歷史記錄限制來更改這一約束）。

{{< note >}}
<!--
A Deployment's revision is created when a Deployment's rollout is triggered. This means that the
new revision is created if and only if the Deployment's Pod template (`.spec.template`) is changed,
for example if you update the labels or container images of the template. Other updates, such as scaling the Deployment,
do not create a Deployment revision, so that you can facilitate simultaneous manual- or auto-scaling.
This means that when you roll back to an earlier revision, only the Deployment's Pod template part is
rolled back.
-->
Deployment 被觸發上線時，系統就會建立 Deployment 的新的修訂版本。
這意味著僅當 Deployment 的 Pod 模板（`.spec.template`）發生更改時，才會建立新修訂版本
-- 例如，模板的標籤或容器映象發生變化。
其他更新，如 Deployment 的擴縮容操作不會建立 Deployment 修訂版本。
這是為了方便同時執行手動縮放或自動縮放。
換言之，當你回滾到較早的修訂版本時，只有 Deployment 的 Pod 模板部分會被回滾。
{{< /note >}}

<!--
* Suppose that you made a typo while updating the Deployment, by putting the image name as `nginx:1.161` instead of `nginx:1.16.1`:
-->
* 假設你在更新 Deployment 時犯了一個拼寫錯誤，將映象名稱命名設定為
  `nginx:1.161` 而不是 `nginx:1.16.1`：

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.161 --record=true
  ```

  <!-- The output is similar to this: -->
  輸出類似於：

  ```
  deployment/nginx-deployment image updated
  ```

<!--
* The rollout gets stuck. You can verify it by checking the rollout status:
-->
* 此上線程序會出現停滯。你可以透過檢查上線狀態來驗證：

  ```shell
  kubectl rollout status deployment/nginx-deployment
  ```

  <!-- The output is similar to this: -->
  輸出類似於：

  ```
  Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
  ```

<!--
* Press Ctrl-C to stop the above rollout status watch. For more information on stuck rollouts,
[read more here](#deployment-status).
-->
* 按 Ctrl-C 停止上述上線狀態觀測。有關上線停滯的詳細資訊，[參考這裡](#deployment-status)。

<!--
 * You see that the number of old replicas (`nginx-deployment-1564180365` and `nginx-deployment-2035384211`) is 2, and new replicas (nginx-deployment-3066724191) is 1.
-->
* 你可以看到舊的副本有兩個（`nginx-deployment-1564180365` 和 `nginx-deployment-2035384211`），
  新的副本有 1 個（`nginx-deployment-3066724191`）：

  ```shell
  kubectl get rs
  ```

  <!-- The output is similar to this: -->
  輸出類似於：

  ```shell
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       25s
  nginx-deployment-2035384211   0         0         0       36s
  nginx-deployment-3066724191   1         1         0       6s
  ```

<!--
* Looking at the Pods created, you see that 1 Pod created by new ReplicaSet is stuck in an image pull loop.
-->
* 檢視所建立的 Pod，你會注意到新 ReplicaSet 所建立的 1 個 Pod 卡頓在映象拉取迴圈中。

  ```shell
  kubectl get pods
  ```

  <!-- The output is similar to this: -->
  輸出類似於：

  ```shell
  NAME                                READY     STATUS             RESTARTS   AGE
  nginx-deployment-1564180365-70iae   1/1       Running            0          25s
  nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
  nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
  nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
  ```

  {{< note >}}
  <!--
  The Deployment controller stops the bad rollout automatically, and stops scaling up the new ReplicaSet. This depends on the rollingUpdate parameters (`maxUnavailable` specifically) that you have specified. Kubernetes by default sets the value to 25%.
  -->
  Deployment 控制器自動停止有問題的上線過程，並停止對新的 ReplicaSet 擴容。
  這行為取決於所指定的 rollingUpdate 引數（具體為 `maxUnavailable`）。
  預設情況下，Kubernetes 將此值設定為 25%。
  {{< /note >}}

<!--
* Get the description of the Deployment:
-->
* 獲取 Deployment 描述資訊：

  ```shell
  kubectl describe deployment
  ```

  <!-- The output is similar to this: -->
  輸出類似於：

  ```
  Name:           nginx-deployment
  Namespace:      default
  CreationTimestamp:  Tue, 15 Mar 2016 14:48:04 -0700
  Labels:         app=nginx
  Selector:       app=nginx
  Replicas:       3 desired | 1 updated | 4 total | 3 available | 1 unavailable
  StrategyType:       RollingUpdate
  MinReadySeconds:    0
  RollingUpdateStrategy:  25% max unavailable, 25% max surge
  Pod Template:
    Labels:  app=nginx
    Containers:
     nginx:
      Image:        nginx:1.91
      Port:         80/TCP
      Host Port:    0/TCP
      Environment:  <none>
      Mounts:       <none>
    Volumes:        <none>
  Conditions:
    Type           Status  Reason
    ----           ------  ------
    Available      True    MinimumReplicasAvailable
    Progressing    True    ReplicaSetUpdated
  OldReplicaSets:     nginx-deployment-1564180365 (3/3 replicas created)
  NewReplicaSet:      nginx-deployment-3066724191 (1/1 replicas created)
  Events:
    FirstSeen LastSeen    Count   From                    SubobjectPath   Type        Reason              Message
    --------- --------    -----   ----                    -------------   --------    ------              -------
    1m        1m          1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-2035384211 to 3
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 1
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 2
    22s       22s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 2
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 1
    21s       21s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-1564180365 to 3
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled down replica set nginx-deployment-2035384211 to 0
    13s       13s         1       {deployment-controller }                Normal      ScalingReplicaSet   Scaled up replica set nginx-deployment-3066724191 to 1
  ```

  <!--
  To fix this, you need to rollback to a previous revision of Deployment that is stable.
  -->
  要解決此問題，需要回滾到以前穩定的 Deployment 版本。

<!--
### Checking Rollout History of a Deployment

Follow the steps given below to check the rollout history:
-->
### 檢查 Deployment 上線歷史

按照如下步驟檢查回滾歷史：

<!--
 1. First, check the revisions of this Deployment:
-->
1. 首先，檢查 Deployment 修訂歷史：

   ```shell
   kubectl rollout history deployment/nginx-deployment
   ```

   <!-- The output is similar to this: -->
   輸出類似於：

   ```
   deployments "nginx-deployment"
   REVISION    CHANGE-CAUSE
   1           kubectl apply --filename=https://k8s.io/examples/controllers/nginx-deployment.yaml
   2           kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
   3           kubectl set image deployment/nginx-deployment nginx=nginx:1.161
   ```

   <!--
   `CHANGE-CAUSE` is copied from the Deployment annotation `kubernetes.io/change-cause` to its revisions upon creation. You can specify the`CHANGE-CAUSE` message by:
   -->
   `CHANGE-CAUSE` 的內容是從 Deployment 的 `kubernetes.io/change-cause` 註解複製過來的。
   複製動作發生在修訂版本建立時。你可以透過以下方式設定 `CHANGE-CAUSE` 訊息：

   <!--
   * Annotating the Deployment with `kubectl annotate deployment/nginx-deployment kubernetes.io/change-cause="image updated to 1.9.1"`
   * Manually editing the manifest of the resource.
   -->
   * 使用 `kubectl annotate deployment/nginx-deployment kubernetes.io/change-cause="image updated to 1.16.1"`
     為 Deployment 添加註解。
   * 手動編輯資源的清單。

<!--
2. To see the details of each revision, run:
-->
2. 要檢視修訂歷史的詳細資訊，執行：

   ```shell
   kubectl rollout history deployment/nginx-deployment --revision=2
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

   ```
   deployments "nginx-deployment" revision 2
     Labels:       app=nginx
             pod-template-hash=1159050644
     Annotations:  kubernetes.io/change-cause=kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
     Containers:
      nginx:
       Image:      nginx:1.16.1
       Port:       80/TCP
        QoS Tier:
           cpu:      BestEffort
           memory:   BestEffort
       Environment Variables:      <none>
     No volumes.
   ```

<!--
### Rolling Back to a Previous Revision
Follow the steps given below to rollback the Deployment from the current version to the previous version, which is version 2.
-->
### 回滾到之前的修訂版本   {#rolling-back-to-a-previous-revision}

按照下面給出的步驟將 Deployment 從當前版本回滾到以前的版本（即版本 2）。

<!--
 1. Now you've decided to undo the current rollout and rollback to the previous revision:
-->
1. 假定現在你已決定撤消當前上線並回滾到以前的修訂版本：

   ```shell
   kubectl rollout undo deployment/nginx-deployment
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

   ```
   deployment.apps/nginx-deployment
   ```

   <!--
   Alternatively, you can rollback to a specific revision by specifying it with `-to-revision`:
   -->
   或者，你也可以透過使用 `--to-revision` 來回滾到特定修訂版本：

   ```shell
   kubectl rollout undo deployment/nginx-deployment --to-revision=2
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

   ```
   deployment.apps/nginx-deployment
   ```

   <!--
   For more details about rollout related commands, read [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout).
   -->
   與回滾相關的指令的更詳細資訊，請參考
   [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout)。

   <!--
   The Deployment is now rolled back to a previous stable revision. As you can see, a `DeploymentRollback` event
   for rolling back to revision 2 is generated from Deployment controller.
   -->
   現在，Deployment 正在回滾到以前的穩定版本。正如你所看到的，Deployment
   控制器生成了回滾到修訂版本 2 的 `DeploymentRollback` 事件。

<!--
 2. Check if the rollback was successful and the Deployment is running as expected, run:
-->
2. 檢查回滾是否成功以及 Deployment 是否正在執行，執行：

   ```shell
   kubectl get deployment nginx-deployment
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

   ```
   NAME               READY   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3/3     3            3           30m
   ```

<!--
3. Get the description of the Deployment:
-->
3. 獲取 Deployment 描述資訊：

   ```shell
   kubectl describe deployment nginx-deployment
   ```

   <!--
   The output is similar to this:
   -->
   輸出類似於：

   ```
   Name:                   nginx-deployment
   Namespace:              default
   CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
   Labels:                 app=nginx
   Annotations:            deployment.kubernetes.io/revision=4
                           kubernetes.io/change-cause=kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
   Selector:               app=nginx
   Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
   StrategyType:           RollingUpdate
   MinReadySeconds:        0
   RollingUpdateStrategy:  25% max unavailable, 25% max surge
   Pod Template:
     Labels:  app=nginx
     Containers:
      nginx:
       Image:        nginx:1.16.1
       Port:         80/TCP
       Host Port:    0/TCP
       Environment:  <none>
       Mounts:       <none>
     Volumes:        <none>
   Conditions:
     Type           Status  Reason
     ----           ------  ------
     Available      True    MinimumReplicasAvailable
     Progressing    True    NewReplicaSetAvailable
   OldReplicaSets:  <none>
   NewReplicaSet:   nginx-deployment-c4747d96c (3/3 replicas created)
   Events:
     Type    Reason              Age   From                   Message
     ----    ------              ----  ----                   -------
     Normal  ScalingReplicaSet   12m   deployment-controller  Scaled up replica set nginx-deployment-75675f5897 to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 2
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 1
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-c4747d96c to 3
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled down replica set nginx-deployment-75675f5897 to 0
     Normal  ScalingReplicaSet   11m   deployment-controller  Scaled up replica set nginx-deployment-595696685f to 1
     Normal  DeploymentRollback  15s   deployment-controller  Rolled back deployment "nginx-deployment" to revision 2
     Normal  ScalingReplicaSet   15s   deployment-controller  Scaled down replica set nginx-deployment-595696685f to 0
   ```

<!--
## Scaling a Deployment

You can scale a Deployment by using the following command:
-->
## 縮放 Deployment   {#scaling-a-deployment}

你可以使用如下指令縮放 Deployment：

```shell
kubectl scale deployment/nginx-deployment --replicas=10
```

<!--
The output is similar to this:
-->
輸出類似於：

```
deployment.apps/nginx-deployment scaled
```

<!--
Assuming [horizontal Pod autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) is enabled
in your cluster, you can setup an autoscaler for your Deployment and choose the minimum and maximum number of
Pods you want to run based on the CPU utilization of your existing Pods.
-->
假設叢集啟用了[Pod 的水平自動縮放](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)，
你可以為 Deployment 設定自動縮放器，並基於現有 Pod 的 CPU 利用率選擇要執行的
Pod 個數下限和上限。

```shell
kubectl autoscale deployment/nginx-deployment --min=10 --max=15 --cpu-percent=80
```

<!--
The output is similar to this:
-->
輸出類似於：

```
deployment.apps/nginx-deployment scaled
```

<!--
### Proportional scaling

RollingUpdate Deployments support running multiple versions of an application at the same time. When you
or an autoscaler scales a RollingUpdate Deployment that is in the middle of a rollout (either in progress
or paused), the Deployment controller balances the additional replicas in the existing active
ReplicaSets (ReplicaSets with Pods) in order to mitigate risk. This is called *proportional scaling*.
-->
### 比例縮放  {#proportional-scaling}

RollingUpdate 的 Deployment 支援同時執行應用程式的多個版本。
當自動縮放器縮放處於上線程序（仍在進行中或暫停）中的 RollingUpdate Deployment 時，
Deployment 控制器會平衡現有的活躍狀態的 ReplicaSets（含 Pods 的 ReplicaSets）中的額外副本，
以降低風險。這稱為 *比例縮放（Proportional Scaling）*。

<!--
For example, you are running a Deployment with 10 replicas, [maxSurge](#max-surge)=3, and [maxUnavailable](#max-unavailable)=2.
-->
例如，你正在執行一個 10 個副本的 Deployment，其
[maxSurge](#max-surge)=3，[maxUnavailable](#max-unavailable)=2。

<!--
* Ensure that the 10 replicas in your Deployment are running.
-->
* 確保 Deployment 的這 10 個副本都在執行。

  ```shell
  kubectl get deploy
  ```
  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

<!--
* You update to a new image which happens to be unresolvable from inside the cluster.
-->
* 更新 Deployment 使用新映象，碰巧該映象無法從叢集內部解析。

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:sometag
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```
  deployment.apps/nginx-deployment image updated
  ```

<!--
* The image update starts a new rollout with ReplicaSet nginx-deployment-1989198191, but it's blocked due to the
`maxUnavailable` requirement that you mentioned above. Check out the rollout status:
-->
* 映象更新使用 ReplicaSet `nginx-deployment-1989198191` 啟動新的上線過程，
  但由於上面提到的 `maxUnavailable` 要求，該程序被阻塞了。檢查上線狀態：

  ```shell
  kubectl get rs
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```
  NAME                          DESIRED   CURRENT   READY     AGE
  nginx-deployment-1989198191   5         5         0         9s
  nginx-deployment-618515232    8         8         8         1m
  ```

<!--
* Then a new scaling request for the Deployment comes along. The autoscaler increments the Deployment replicas
to 15. The Deployment controller needs to decide where to add these new 5 replicas. If you weren't using
proportional scaling, all 5 of them would be added in the new ReplicaSet. With proportional scaling, you
spread the additional replicas across all ReplicaSets. Bigger proportions go to the ReplicaSets with the
most replicas and lower proportions go to ReplicaSets with less replicas. Any leftovers are added to the
ReplicaSet with the most replicas. ReplicaSets with zero replicas are not scaled up.
-->
* 然後，出現了新的 Deployment 擴縮請求。自動縮放器將 Deployment 副本增加到 15。
  Deployment 控制器需要決定在何處新增 5 個新副本。如果未使用比例縮放，所有 5 個副本
  都將新增到新的 ReplicaSet 中。使用比例縮放時，可以將額外的副本分佈到所有 ReplicaSet。
  較大比例的副本會被新增到擁有最多副本的 ReplicaSet，而較低比例的副本會進入到
  副本較少的 ReplicaSet。所有剩下的副本都會新增到副本最多的 ReplicaSet。
  具有零副本的 ReplicaSets 不會被擴容。

<!--
In our example above, 3 replicas are added to the old ReplicaSet and 2 replicas are added to the
new ReplicaSet. The rollout process should eventually move all replicas to the new ReplicaSet, assuming
the new replicas become healthy. To confirm this, run:
-->
在上面的示例中，3 個副本被新增到舊 ReplicaSet 中，2 個副本被新增到新 ReplicaSet。
假定新的副本都很健康，上線過程最終應將所有副本遷移到新的 ReplicaSet 中。
要確認這一點，請執行：

```shell
kubectl get deploy
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```

<!--
The rollout status confirms how the replicas were added to each ReplicaSet.
-->
上線狀態確認了副本是如何被新增到每個 ReplicaSet 的。

```shell
kubectl get rs
```

<!--
The output is similar to this:
-->
輸出類似於：

```shell
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

<!--
## Pausing and Resuming a rollout of a Deployment {#pausing-and-resuming-a-deployment}

When you update a Deployment, or plan to, you can pause rollouts
for that Deployment before you trigger one or more updates. When
you're ready to apply those changes, you resume rollouts for the
Deployment. This approach allows you to
apply multiple fixes in between pausing and resuming without triggering unnecessary rollouts.
-->
## 暫停、恢復 Deployment 的上線過程  {#pausing-and-resuming-a-deployment}

在你更新一個 Deployment 的時候，或者計劃更新它的時候，
你可以在觸發一個或多個更新之前暫停 Deployment 的上線過程。
當你準備行應用這些變更時，你可以重新恢復 Deployment 上線過程。
這樣做使得你能夠在暫停和恢復執行之間應用多個修補程式，而不會觸發不必要的上線操作。

<!--
* For example, with a Deployment that was created:

  Get the Deployment details:
-->
* 例如，對於一個剛剛建立的 Deployment：

  獲取該 Deployment 資訊：

  ```shell
  kubectl get deploy
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```
  NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx     3         3         3            3           1m
  ```

  <!--
  Get the rollout status:
  -->
  獲取上線狀態：

  ```shell
  kubectl get rs
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         1m
  ```

<!--
* Pause by running the following command:
-->
* 使用如下指令暫停上線：

  ```shell
  kubectl rollout pause deployment/nginx-deployment
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```shell
  deployment.apps/nginx-deployment paused
  ```

<!--
* Then update the image of the Deployment:
-->
* 接下來更新 Deployment 映象：

  ```shell
  kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```
  deployment.apps/nginx-deployment image updated
  ```

<!--
 * Notice that no new rollout started:
-->
* 注意沒有新的上線被觸發：

  ```shell
  kubectl rollout history deployment/nginx-deployment
  ```

  <!-- The output is similar to this: -->
  輸出類似於：

  ```
  deployments "nginx"
  REVISION  CHANGE-CAUSE
  1   <none>
  ```

<!--
* Get the rollout status to verify that the existing ReplicaSet has not changed:
-->
* 獲取上線狀態驗證現有的 ReplicaSet 沒有被更改：

  ```shell
  kubectl get rs
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```shell
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         2m
  ```

<!--
* You can make as many updates as you wish, for example, update the resources that will be used:
-->
* 你可以根據需要執行很多更新操作，例如，可以要使用的資源：

  ```shell
  kubectl set resources deployment/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```
  deployment.apps/nginx-deployment resource requirements updated
  ```

  <!--
  The initial state of the Deployment prior to pausing its rollout will continue its function, but new updates to
  the Deployment will not have any effect as long as the Deployment is paused.
  -->
  暫停 Deployment 上線之前的初始狀態將繼續發揮作用，但新的更新在 Deployment
  上線被暫停期間不會產生任何效果。

<!--
* Eventually, resume the Deployment rollout and observe a new ReplicaSet coming up with all the new updates:
-->
* 最終，恢復 Deployment 上線並觀察新的 ReplicaSet 的建立過程，其中包含了所應用的所有更新：

  ```shell
  kubectl rollout resume deployment/nginx-deployment
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於這樣：

  ```
  deployment.apps/nginx-deployment resumed
  ```

<!--
* Watch the status of the rollout until it's done.
-->
* 觀察上線的狀態，直到完成。

  ```shell
  kubectl get rs -w
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   2         2         2         2m
  nginx-3926361531   2         2         0         6s
  nginx-3926361531   2         2         1         18s
  nginx-2142116321   1         2         2         2m
  nginx-2142116321   1         2         2         2m
  nginx-3926361531   3         2         1         18s
  nginx-3926361531   3         2         1         18s
  nginx-2142116321   1         1         1         2m
  nginx-3926361531   3         3         1         18s
  nginx-3926361531   3         3         2         19s
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         1         1         2m
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         20s
  ```

<!--
* Get the status of the latest rollout:
-->
* 獲取最近上線的狀態：

  ```shell
  kubectl get rs
  ```

  <!--
  The output is similar to this:
  -->
  輸出類似於：

  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         28s
  ```

{{< note >}}
<!--
You cannot rollback a paused Deployment until you resume it.
-->
你不可以回滾處於暫停狀態的 Deployment，除非先恢復其執行狀態。
{{< /note >}}

<!--
## Deployment status

A Deployment enters various states during its lifecycle. It can be [progressing](#progressing-deployment) while
rolling out a new ReplicaSet, it can be [complete](#complete-deployment), or it can [fail to progress](#failed-deployment).
-->
##  Deployment 狀態 {#deployment-status}

Deployment 的生命週期中會有許多狀態。上線新的 ReplicaSet 期間可能處於
[Progressing（進行中）](#progressing-deployment)，可能是
[Complete（已完成）](#complete-deployment)，也可能是
[Failed（失敗）](#failed-deployment)以至於無法繼續進行。

<!--
### Progressing Deployment

Kubernetes marks a Deployment as _progressing_ when one of the following tasks is performed:
-->
### 進行中的 Deployment  {#progressing-deployment}

執行下面的任務期間，Kubernetes 標記 Deployment 為 _進行中（Progressing）_：

<!--
* The Deployment creates a new ReplicaSet.
* The Deployment is scaling up its newest ReplicaSet.
* The Deployment is scaling down its older ReplicaSet(s).
* New Pods become ready or available (ready for at least [MinReadySeconds](#min-ready-seconds)).
-->
* Deployment 建立新的 ReplicaSet
* Deployment 正在為其最新的 ReplicaSet 擴容
* Deployment 正在為其舊有的 ReplicaSet(s) 縮容
* 新的 Pods 已經就緒或者可用（就緒至少持續了 [MinReadySeconds](#min-ready-seconds) 秒）。

<!--
When the rollout becomes “progressing”, the Deployment controller adds a condition with the following
attributes to the Deployment's `.status.conditions`:
-->
當上線過程進入“Progressing”狀態時，Deployment 控制器會向 Deployment 的
`.status.conditions` 中新增包含下面屬性的狀況條目：

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetCreated` | `reason: FoundNewReplicaSet` | `reason: ReplicaSetUpdated`

<!--
You can monitor the progress for a Deployment by using `kubectl rollout status`.
-->
你可以使用 `kubectl rollout status` 監視 Deployment 的進度。

<!--
### Complete Deployment

Kubernetes marks a Deployment as _complete_ when it has the following characteristics:
-->
### 完成的 Deployment    {#complete-deployment}

當 Deployment 具有以下特徵時，Kubernetes 將其標記為 _完成（Complete）_：

<!--
* All of the replicas associated with the Deployment have been updated to the latest version you've specified, meaning any
updates you've requested have been completed.
* All of the replicas associated with the Deployment are available.
* No old replicas for the Deployment are running.
-->
* 與 Deployment 關聯的所有副本都已更新到指定的最新版本，這意味著之前請求的所有更新都已完成。
* 與 Deployment 關聯的所有副本都可用。
* 未執行 Deployment 的舊副本。

<!--
When the rollout becomes “complete”, the Deployment controller sets a condition with the following
attributes to the Deployment's `.status.conditions`:
-->
當上線過程進入“Complete”狀態時，Deployment 控制器會向 Deployment 的
`.status.conditions` 中新增包含下面屬性的狀況條目：

* `type: Progressing`
* `status: "True"`
* `reason: NewReplicaSetAvailable`

<!--
This `Progressing` condition will retain a status value of `"True"` until a new rollout
is initiated. The condition holds even when availability of replicas changes (which
does instead affect the `Available` condition).
-->
這一 `Progressing` 狀況的狀態值會持續為 `"True"`，直至新的上線動作被觸發。
即使副本的可用狀態發生變化（進而影響 `Available` 狀況），`Progressing` 狀況的值也不會變化。

<!--
You can check if a Deployment has completed by using `kubectl rollout status`. If the rollout completed
successfully, `kubectl rollout status` returns a zero exit code.
-->
你可以使用 `kubectl rollout status` 檢查 Deployment 是否已完成。
如果上線成功完成，`kubectl rollout status` 返回退出程式碼 0。

```shell
kubectl rollout status deployment/nginx-deployment
```

<!-- The output is similar to this: -->
輸出類似於：

```shell
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx-deployment" successfully rolled out
```

從 `kubectl rollout` 命令獲得的返回狀態為 0（成功）：

```shell
$ echo $?
```
```
0
```

<!--
### Failed Deployment
-->
### 失敗的 Deployment   {#failed-deployment}

<!--
Your Deployment may get stuck trying to deploy its newest ReplicaSet without ever completing. This can occur
due to some of the following factors:
-->
你的 Deployment 可能會在嘗試部署其最新的 ReplicaSet 受挫，一直處於未完成狀態。
造成此情況一些可能因素如下：

<!--
 * Insufficient quota
* Readiness probe failures
* Image pull errors
* Insufficient permissions
* Limit ranges
* Application runtime misconfiguration
-->
* 配額（Quota）不足
* 就緒探測（Readiness Probe）失敗
* 映象拉取錯誤
* 許可權不足
* 限制範圍（Limit Ranges）問題
* 應用程式執行時的配置錯誤

<!--
One way you can detect this condition is to specify a deadline parameter in your Deployment spec:
([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `.spec.progressDeadlineSeconds` denotes the
number of seconds the Deployment controller waits before indicating (in the Deployment status) that the
Deployment progress has stalled.
-->
檢測此狀況的一種方法是在 Deployment 規約中指定截止時間引數：
（[`.spec.progressDeadlineSeconds`]（#progress-deadline-seconds））。
`.spec.progressDeadlineSeconds` 給出的是一個秒數值，Deployment 控制器在（透過 Deployment 狀態）
標示 Deployment 進展停滯之前，需要等待所給的時長。

<!--
The following `kubectl` command sets the spec with `progressDeadlineSeconds` to make the controller report
lack of progress for a Deployment after 10 minutes:
-->
以下 `kubectl` 命令設定規約中的 `progressDeadlineSeconds`，從而告知控制器
在 10 分鐘後報告 Deployment 沒有進展：

```shell
kubectl patch deployment/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```

<!--
The output is similar to this:
-->
輸出類似於：

```
deployment.apps/nginx-deployment patched
```

<!--
Once the deadline has been exceeded, the Deployment controller adds a DeploymentCondition with the following
attributes to the Deployment's `.status.conditions`:
-->
超過截止時間後，Deployment 控制器將新增具有以下屬性的 Deployment 狀況到
Deployment 的 `.status.conditions` 中：

* Type=Progressing
* Status=False
* Reason=ProgressDeadlineExceeded

<!--
This condition can also fail early and is then set to status value of `"False"` due to reasons as `ReplicaSetCreateError`.
Also, the deadline is not taken into account anymore once the Deployment rollout completes.
-->
這一狀況也可能會比較早地失敗，因而其狀態值被設定為 `"False"`，
其原因為 `ReplicaSetCreateError`。
一旦 Deployment 上線完成，就不再考慮其期限。

<!--
See the [Kubernetes API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) for more information on status conditions.
-->
參考
[Kubernetes API Conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties)
獲取更多狀態狀況相關的資訊。

{{< note >}}
<!--
 Kubernetes takes no action on a stalled Deployment other than to report a status condition with
`Reason=ProgressDeadlineExceeded`. Higher level orchestrators can take advantage of it and act accordingly, for
example, rollback the Deployment to its previous version.
-->
除了報告 `Reason=ProgressDeadlineExceeded` 狀態之外，Kubernetes 對已停止的
Deployment 不執行任何操作。更高級別的編排器可以利用這一設計並相應地採取行動。
例如，將 Deployment 回滾到其以前的版本。
{{< /note >}}

{{< note >}}
<!--
If you pause a Deployment rollout, Kubernetes does not check progress against your specified deadline. You can
safely pause a Deployment in the middle of a rollout and resume without triggering the condition for
exceeding the deadline.
-->
如果你暫停了某個 Deployment 上線，Kubernetes 不再根據指定的截止時間檢查 Deployment 進展。
你可以在上線過程中間安全地暫停 Deployment 再恢復其執行，這樣做不會導致超出最後時限的問題。
{{< /note >}}

<!--
You may experience transient errors with your Deployments, either due to a low timeout that you have set or
due to any other kind of error that can be treated as transient. For example, let's suppose you have
insufficient quota. If you describe the Deployment you will notice the following section:
-->
Deployment 可能會出現瞬時性的錯誤，可能因為設定的超時時間過短，
也可能因為其他可認為是臨時性的問題。例如，假定所遇到的問題是配額不足。
如果描述 Deployment，你將會注意到以下部分：

```shell
kubectl describe deployment nginx-deployment
```

<!-- The output is similar to this: -->
輸出類似於：

```
<...>
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     True    ReplicaSetUpdated
  ReplicaFailure  True    FailedCreate
<...>
```

<!--
If you run `kubectl get deployment nginx-deployment -o yaml`, the Deployment status is similar to this:
-->
如果執行 `kubectl get deployment nginx-deployment -o yaml`，Deployment 狀態輸出
將類似於這樣：

```
status:
  availableReplicas: 2
  conditions:
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: Replica set "nginx-deployment-4262182780" is progressing.
    reason: ReplicaSetUpdated
    status: "True"
    type: Progressing
  - lastTransitionTime: 2016-10-04T12:25:42Z
    lastUpdateTime: 2016-10-04T12:25:42Z
    message: Deployment has minimum availability.
    reason: MinimumReplicasAvailable
    status: "True"
    type: Available
  - lastTransitionTime: 2016-10-04T12:25:39Z
    lastUpdateTime: 2016-10-04T12:25:39Z
    message: 'Error creating: pods "nginx-deployment-4262182780-" is forbidden: exceeded quota:
      object-counts, requested: pods=1, used: pods=3, limited: pods=2'
    reason: FailedCreate
    status: "True"
    type: ReplicaFailure
  observedGeneration: 3
  replicas: 2
  unavailableReplicas: 2
```

<!--
Eventually, once the Deployment progress deadline is exceeded, Kubernetes updates the status and the
reason for the Progressing condition:
-->
最終，一旦超過 Deployment 進度限期，Kubernetes 將更新狀態和進度狀況的原因：

```
Conditions:
  Type            Status  Reason
  ----            ------  ------
  Available       True    MinimumReplicasAvailable
  Progressing     False   ProgressDeadlineExceeded
  ReplicaFailure  True    FailedCreate
```

<!--
You can address an issue of insufficient quota by scaling down your Deployment, by scaling down other
controllers you may be running, or by increasing quota in your namespace. If you satisfy the quota
conditions and the Deployment controller then completes the Deployment rollout, you'll see the
Deployment's status update with a successful condition (`Status=True` and `Reason=NewReplicaSetAvailable`).
-->
可以透過縮容 Deployment 或者縮容其他執行狀態的控制器，或者直接在名稱空間中增加配額
來解決配額不足的問題。如果配額條件滿足，Deployment 控制器完成了 Deployment 上線操作，
Deployment 狀態會更新為成功狀況（`Status=True` and `Reason=NewReplicaSetAvailable`）。

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

<!--
`type: Available` with `status: "True"` means that your Deployment has minimum availability. Minimum availability is dictated
by the parameters specified in the deployment strategy. `type: Progressing` with `status: "True"` means that your Deployment
is either in the middle of a rollout and it is progressing or that it has successfully completed its progress and the minimum
required new replicas are available (see the Reason of the condition for the particulars - in our case
`reason: NewReplicaSetAvailable` means that the Deployment is complete).
-->
`type: Available` 加上 `status: True` 意味著 Deployment 具有最低可用性。
最低可用性由 Deployment 策略中的引數指定。
`type: Progressing` 加上 `status: True` 表示 Deployment 處於上線過程中，並且正在執行，
或者已成功完成進度，最小所需新副本處於可用。
請參閱對應狀況的 Reason 瞭解相關細節。
在我們的案例中 `reason: NewReplicaSetAvailable` 表示 Deployment 已完成。

<!--
You can check if a Deployment has failed to progress by using `kubectl rollout status`. `kubectl rollout status`
returns a non-zero exit code if the Deployment has exceeded the progression deadline.
-->
你可以使用 `kubectl rollout status` 檢查 Deployment 是否未能取得進展。
如果 Deployment 已超過進度限期，`kubectl rollout status` 返回非零退出程式碼。

```shell
kubectl rollout status deployment/nginx-deployment
```

<!--
The output is similar to this:
-->
輸出類似於：

```
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
```
<!--
and the exit status from `kubectl rollout` is 1 (indicating an error):
-->
`kubectl rollout` 命令的退出狀態為 1（表明發生了錯誤）：

```shell
$ echo $?
```
```
1
```

<!--
### Operating on a failed deployment

All actions that apply to a complete Deployment also apply to a failed Deployment. You can scale it up/down, roll back
to a previous revision, or even pause it if you need to apply multiple tweaks in the Deployment
Pod template.
-->
### 對失敗 Deployment 的操作   {#operating-on-a-failed-deployment}

可應用於已完成的 Deployment 的所有操作也適用於失敗的 Deployment。
你可以對其執行擴縮容、回滾到以前的修訂版本等操作，或者在需要對 Deployment 的
Pod 模板應用多項調整時，將 Deployment 暫停。

<!--
## Clean up Policy

You can set `.spec.revisionHistoryLimit` field in a Deployment to specify how many old ReplicaSets for
this Deployment you want to retain. The rest will be garbage-collected in the background. By default,
it is 10.
-->
## 清理策略   {#clean-up-policy}

你可以在 Deployment 中設定 `.spec.revisionHistoryLimit` 欄位以指定保留此
Deployment 的多少箇舊有 ReplicaSet。其餘的 ReplicaSet 將在後臺被垃圾回收。
預設情況下，此值為 10。

{{< note >}}
<!--
Explicitly setting this field to 0, will result in cleaning up all the history of your Deployment
thus that Deployment will not be able to roll back.
-->
顯式將此欄位設定為 0 將導致 Deployment 的所有歷史記錄被清空，因此 Deployment 將無法回滾。
{{< /note >}}

<!--
## Canary Deployment

If you want to roll out releases to a subset of users or servers using the Deployment, you
can create multiple Deployments, one for each release, following the canary pattern described in
[managing resources](/docs/concepts/cluster-administration/manage-deployment/#canary-deployments).
-->
## 金絲雀部署 {#canary-deployment}

如果要使用 Deployment 向用戶子集或伺服器子集上線版本，
則可以遵循[資源管理](/zh-cn/docs/concepts/cluster-administration/manage-deployment/#canary-deployments)
所描述的金絲雀模式，建立多個 Deployment，每個版本一個。

<!--
## Writing a Deployment Spec

As with all other Kubernetes configs, a Deployment needs `apiVersion`, `kind`, and `metadata` fields.
For general information about working with config files, see
[deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/),
configuring containers, and [using kubectl to manage resources](/docs/concepts/overview/working-with-objects/object-management/) documents.
-->
## 編寫 Deployment 規約       {#writing-a-deployment-spec}

同其他 Kubernetes 配置一樣， Deployment 需要 `apiVersion`，`kind` 和 `metadata` 欄位。
有關配置檔案的其他資訊，請參考[部署 Deployment](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)、
配置容器和[使用 kubectl 管理資源](/zh-cn/docs/concepts/overview/working-with-objects/object-management/)等相關文件。

<!--
The name of a Deployment object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

A Deployment also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
-->
Deployment 物件的名稱必須是合法的
[DNS 子域名](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
Deployment 還需要 [`.spec` 部分](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。

<!--
### Pod Template

The `.spec.template` and `.spec.selector` are the only required field of the `.spec`.
-->
### Pod 模板     {#pod-template}

`.spec` 中只有 `.spec.template` 和 `.spec.selector` 是必需的欄位。

<!--

The `.spec.template` is a [Pod template](/docs/concepts/workloads/pods/#pod-templates). It has exactly the same schema as a {{< glossary_tooltip text="Pod" term_id="pod" >}}, except it is nested and does not have an `apiVersion` or `kind`.
-->
`.spec.template` 是一個 [Pod 模板](/zh-cn/docs/concepts/workloads/pods/#pod-templates)。
它和 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的語法規則完全相同。
只是這裡它是巢狀的，因此不需要 `apiVersion` 或 `kind`。

<!--
In addition to required fields for a Pod, a Pod template in a Deployment must specify appropriate
labels and an appropriate restart policy. For labels, make sure not to overlap with other controllers. See [selector](#selector)).
-->
除了 Pod 的必填欄位外，Deployment 中的 Pod 模板必須指定適當的標籤和適當的重新啟動策略。
對於標籤，請確保不要與其他控制器重疊。請參考[選擇算符](#selector)。

<!--
Only a [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) equal to `Always` is
allowed, which is the default if not specified.
-->
只有 [`.spec.template.spec.restartPolicy`](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
等於 `Always` 才是被允許的，這也是在沒有指定時的預設設定。

<!--
### Replicas

`.spec.replicas` is an optional field that specifies the number of desired Pods. It defaults to 1.
-->
### 副本   {#replicas}

`.spec.replicas` 是指定所需 Pod 的可選欄位。它的預設值是1。

<!--
Should you manually scale a Deployment, example via `kubectl scale deployment
deployment --replicas=X`, and then you update that Deployment based on a manifest
(for example: by running `kubectl apply -f deployment.yaml`),
then applying that manifest overwrites the manual scaling that you previously did.
-->
如果你對某個 Deployment 執行了手動擴縮操作（例如，透過 
`kubectl scale deployment deployment --replicas=X`），
之後基於清單對 Deployment 執行了更新操作（例如透過執行
`kubectl apply -f deployment.yaml`），那麼透過應用清單而完成的更新會覆蓋之前手動擴縮所作的變更。

<!--
If a [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) (or any
similar API for horizontal scaling) is managing scaling for a Deployment, don't set `.spec.replicas`.
-->
如果一個 [HorizontalPodAutoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)
（或者其他執行水平擴縮操作的類似 API）在管理 Deployment 的擴縮，
則不要設定 `.spec.replicas`。

<!--
Instead, allow the Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} to manage the
`.spec.replicas` field automatically.
-->
恰恰相反，應該允許 Kubernetes
{{< glossary_tooltip text="控制面" term_id="control-plane" >}}來自動管理
`.spec.replicas` 欄位。

<!--
### Selector

`.spec.selector` is an required field that specifies a [label selector](/docs/concepts/overview/working-with-objects/labels/)
for the Pods targeted by this Deployment.

`.spec.selector` must match `.spec.template.metadata.labels`, or it will be rejected by the API.
-->
### 選擇算符   {#selector}

`.spec.selector` 是指定本 Deployment 的 Pod
[標籤選擇算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)的必需欄位。

`.spec.selector` 必須匹配 `.spec.template.metadata.labels`，否則請求會被 API 拒絕。

<!--
In API version `apps/v1`, `.spec.selector` and `.metadata.labels` do not default to `.spec.template.metadata.labels` if not set. So they must be set explicitly. Also note that `.spec.selector` is immutable after creation of the Deployment in `apps/v1`.
-->
在 API `apps/v1`版本中，`.spec.selector` 和 `.metadata.labels` 如果沒有設定的話，
不會被預設設定為 `.spec.template.metadata.labels`，所以需要明確進行設定。
同時在 `apps/v1`版本中，Deployment 建立後 `.spec.selector` 是不可變的。

<!--
A Deployment may terminate Pods whose labels match the selector if their template is different
from `.spec.template` or if the total number of such Pods exceeds `.spec.replicas`. It brings up new
Pods with `.spec.template` if the number of Pods is less than the desired number.
-->
當 Pod 的標籤和選擇算符匹配，但其模板和 `.spec.template` 不同時，或者此類 Pod
的總數超過 `.spec.replicas` 的設定時，Deployment 會終結之。
如果 Pods 總數未達到期望值，Deployment 會基於 `.spec.template` 建立新的 Pod。

{{< note >}}
<!--
You should not create other Pods whose labels match this selector, either directly, by creating
another Deployment, or by creating another controller such as a ReplicaSet or a ReplicationController. If you
do so, the first Deployment thinks that it created these other Pods. Kubernetes does not stop you from doing this.
-->
你不應直接建立與此選擇算符匹配的 Pod，也不應透過建立另一個 Deployment 或者類似於
ReplicaSet 或 ReplicationController 這類控制器來建立標籤與此選擇算符匹配的 Pod。
如果這樣做，第一個 Deployment 會認為它建立了這些 Pod。
Kubernetes 不會阻止你這麼做。
{{< /note >}}

<!--
If you have multiple controllers that have overlapping selectors, the controllers will fight with each
other and won't behave correctly.
-->
如果有多個控制器的選擇算符發生重疊，則控制器之間會因衝突而無法正常工作。

<!--
### Strategy

`.spec.strategy` specifies the strategy used to replace old Pods by new ones.
`.spec.strategy.type` can be "Recreate" or "RollingUpdate". "RollingUpdate" is
the default value.
-->
### 策略   {#strategy}

`.spec.strategy` 策略指定用於用新 Pods 替換舊 Pods 的策略。
`.spec.strategy.type` 可以是 “Recreate” 或 “RollingUpdate”。“RollingUpdate” 是預設值。

<!--
#### Recreate Deployment

All existing Pods are killed before new ones are created when `.spec.strategy.type==Recreate`.
-->
#### 重新建立 Deployment   {#recreate-deployment}

如果 `.spec.strategy.type==Recreate`，在建立新 Pods 之前，所有現有的 Pods 會被殺死。

{{< note >}}
<!--
This will only guarantee Pod termination previous to creation for upgrades. If you upgrade a Deployment, all Pods 
of the old revision will be terminated immediately. Successful removal is awaited before any Pod of the new 
revision is created. If you manually delete a Pod, the lifecycle is controlled by the ReplicaSet and the 
replacement will be created immediately (even if the old Pod is still in a Terminating state). If you need an 
"at most" guarantee for your Pods, you should consider using a 
[StatefulSet](/docs/concepts/workloads/controllers/statefulset/).
-->
這隻會確保為了升級而建立新 Pod 之前其他 Pod 都已終止。如果你升級一個 Deployment，
所有舊版本的 Pod 都會立即被終止。控制器等待這些 Pod 被成功移除之後，
才會建立新版本的 Pod。如果你手動刪除一個 Pod，其生命週期是由 ReplicaSet 來控制的，
後者會立即建立一個替換 Pod（即使舊的 Pod 仍然處於 Terminating 狀態）。
如果你需要一種“最多 n 個”的 Pod 個數保證，你需要考慮使用
[StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/)。
{{< /note >}}

<!--
#### Rolling Update Deployment

The Deployment updates Pods in a rolling update
fashion when `.spec.strategy.type==RollingUpdate`. You can specify `maxUnavailable` and `maxSurge` to control
the rolling update process.
-->
#### 滾動更新 Deployment   {#rolling-update-deployment}

Deployment 會在 `.spec.strategy.type==RollingUpdate`時，採取
滾動更新的方式更新 Pods。你可以指定 `maxUnavailable` 和 `maxSurge` 來控制滾動更新
過程。

<!--
##### Max Unavailable
-->
##### 最大不可用   {#max-unavailable}

<!--
`.spec.strategy.rollingUpdate.maxUnavailable` is an optional field that specifies the maximum number
of Pods that can be unavailable during the update process. The value can be an absolute number (for example, 5)
or a percentage of desired Pods (for example, 10%). The absolute number is calculated from percentage by
rounding down. The value cannot be 0 if `.spec.strategy.rollingUpdate.maxSurge` is 0. The default value is 25%.
-->
`.spec.strategy.rollingUpdate.maxUnavailable` 是一個可選欄位，用來指定
更新過程中不可用的 Pod 的個數上限。該值可以是絕對數字（例如，5），也可以是所需
Pods 的百分比（例如，10%）。百分比值會轉換成絕對數並去除小數部分。
如果 `.spec.strategy.rollingUpdate.maxSurge` 為 0，則此值不能為 0。
預設值為 25%。

<!--
For example, when this value is set to 30%, the old ReplicaSet can be scaled down to 70% of desired
Pods immediately when the rolling update starts. Once new Pods are ready, old ReplicaSet can be scaled
down further, followed by scaling up the new ReplicaSet, ensuring that the total number of Pods available
at all times during the update is at least 70% of the desired Pods.
-->
例如，當此值設定為 30% 時，滾動更新開始時會立即將舊 ReplicaSet 縮容到期望 Pod 個數的70%。
新 Pod 準備就緒後，可以繼續縮容舊有的 ReplicaSet，然後對新的 ReplicaSet 擴容，
確保在更新期間可用的 Pods 總數在任何時候都至少為所需的 Pod 個數的 70%。

<!--
##### Max Surge

 `.spec.strategy.rollingUpdate.maxSurge` is an optional field that specifies the maximum number of Pods
that can be created over the desired number of Pods. The value can be an absolute number (for example, 5) or a
percentage of desired Pods (for example, 10%). The value cannot be 0 if `MaxUnavailable` is 0. The absolute number
is calculated from the percentage by rounding up. The default value is 25%.
-->
##### 最大峰值   {#max-surge}

`.spec.strategy.rollingUpdate.maxSurge` 是一個可選欄位，用來指定可以建立的超出期望
Pod 個數的 Pod 數量。此值可以是絕對數（例如，5）或所需 Pods 的百分比（例如，10%）。
如果 `MaxUnavailable` 為 0，則此值不能為 0。百分比值會透過向上取整轉換為絕對數。
此欄位的預設值為 25%。

<!--
For example, when this value is set to 30%, the new ReplicaSet can be scaled up immediately when the
rolling update starts, such that the total number of old and new Pods does not exceed 130% of desired
Pods. Once old Pods have been killed, the new ReplicaSet can be scaled up further, ensuring that the
total number of Pods running at any time during the update is at most 130% of desired Pods.
-->
例如，當此值為 30% 時，啟動滾動更新後，會立即對新的 ReplicaSet 擴容，同時保證新舊 Pod
的總數不超過所需 Pod 總數的 130%。一旦舊 Pods 被殺死，新的 ReplicaSet 可以進一步擴容，
同時確保更新期間的任何時候執行中的 Pods 總數最多為所需 Pods 總數的 130%。

<!--
 ### Progress Deadline Seconds

 `.spec.progressDeadlineSeconds` is an optional field that specifies the number of seconds you want
to wait for your Deployment to progress before the system reports back that the Deployment has
[failed progressing](#failed-deployment) - surfaced as a condition with `type: Progressing`, `status: False`.
and `reason: ProgressDeadlineExceeded` in the status of the resource. The Deployment controller will keep
retrying the Deployment. In the future, once automatic rollback will be implemented, the Deployment
controller will roll back a Deployment as soon as it observes such a condition.
-->
### 進度期限秒數    {#progress-deadline-seconds}
 
`.spec.progressDeadlineSeconds` 是一個可選欄位，用於指定系統在報告 Deployment
[進展失敗](#failed-deployment) 之前等待 Deployment 取得進展的秒數。
這類報告會在資源狀態中體現為 `type: Progressing`、`status: False`、
`reason: ProgressDeadlineExceeded`。Deployment 控制器將持續重試 Deployment。
將來，一旦實現了自動回滾，Deployment 控制器將在探測到這樣的條件時立即回滾 Deployment。

<!--
If specified, this field needs to be greater than `.spec.minReadySeconds`.
-->
如果指定，則此欄位值需要大於 `.spec.minReadySeconds` 取值。

<!--
### Min Ready Seconds

 `.spec.minReadySeconds` is an optional field that specifies the minimum number of seconds for which a newly
created Pod should be ready without any of its containers crashing, for it to be considered available.
This defaults to 0 (the Pod will be considered available as soon as it is ready). To learn more about when
a Pod is considered ready, see [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).
-->
### 最短就緒時間    {#min-ready-seconds}

`.spec.minReadySeconds` 是一個可選欄位，用於指定新建立的 Pod
在沒有任意容器崩潰情況下的最小就緒時間，
只有超出這個時間 Pod 才被視為可用。預設值為 0（Pod 在準備就緒後立即將被視為可用）。
要了解何時 Pod 被視為就緒，
可參考[容器探針](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。

<!--
### Revision History Limit

A Deployment's revision history is stored in the ReplicaSets it controls.
-->
### 修訂歷史限制

Deployment 的修訂歷史記錄儲存在它所控制的 ReplicaSets 中。

<!--
`.spec.revisionHistoryLimit` is an optional field that specifies the number of old ReplicaSets to retain
to allow rollback. These old ReplicaSets consume resources in `etcd` and crowd the output of `kubectl get rs`. The configuration of each Deployment revision is stored in its ReplicaSets; therefore, once an old ReplicaSet is deleted, you lose the ability to rollback to that revision of Deployment. By default, 10 old ReplicaSets will be kept, however its ideal value depends on the frequency and stability of new Deployments.
-->
`.spec.revisionHistoryLimit` 是一個可選欄位，用來設定出於會滾目的所要保留的舊 ReplicaSet 數量。
這些舊 ReplicaSet 會消耗 etcd 中的資源，並佔用 `kubectl get rs` 的輸出。
每個 Deployment 修訂版本的配置都儲存在其 ReplicaSets 中；因此，一旦刪除了舊的 ReplicaSet，
將失去回滾到 Deployment 的對應修訂版本的能力。
預設情況下，系統保留 10 箇舊 ReplicaSet，但其理想值取決於新 Deployment 的頻率和穩定性。

<!--
More specifically, setting this field to zero means that all old ReplicaSets with 0 replicas will be cleaned up.
In this case, a new Deployment rollout cannot be undone, since its revision history is cleaned up.
-->
更具體地說，將此欄位設定為 0 意味著將清理所有具有 0 個副本的舊 ReplicaSet。
在這種情況下，無法撤消新的 Deployment 上線，因為它的修訂歷史被清除了。

<!--
### Paused

`.spec.paused` is an optional boolean field for pausing and resuming a Deployment. The only difference between
a paused Deployment and one that is not paused, is that any changes into the PodTemplateSpec of the paused
Deployment will not trigger new rollouts as long as it is paused. A Deployment is not paused by default when
it is created.
-->
### paused（暫停的）  {#paused}

`.spec.paused` 是用於暫停和恢復 Deployment 的可選布林欄位。
暫停的 Deployment 和未暫停的 Deployment 的唯一區別是，Deployment 處於暫停狀態時，
PodTemplateSpec 的任何修改都不會觸發新的上線。
Deployment 在建立時是預設不會處於暫停狀態。

## {{% heading "whatsnext" %}}

<!--
* Learn about [Pods](/docs/concepts/workloads/pods).
* [Run a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/).
* `Deployment` is a top-level resource in the Kubernetes REST API.
  Read the {{< api-reference page="workload-resources/deployment-v1" >}}
  object definition to understand the API for deployments.
* Read about [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) and how
  you can use it to manage application availability during disruptions.
-->
* 瞭解 [Pod](/zh-cn/docs/concepts/workloads/pods)。
* [使用 Deployment 執行一個無狀態應用](/zh-cn/docs/tasks/run-application/run-stateless-application-deployment/)。
* `Deployment` 是 Kubernetes REST API 中的一個頂層資源。
  閱讀 {{< api-reference page="workload-resources/deployment-v1" >}}
  物件定義，以瞭解 Deployment 的 API 細節。
* 閱讀 [PodDisruptionBudget](/zh-cn/docs/concepts/workloads/pods/disruptions/)
  瞭解如何使用它來在可能出現干擾的情況下管理應用的可用性。

