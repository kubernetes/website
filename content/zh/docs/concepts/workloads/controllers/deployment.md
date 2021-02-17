---
title: Deployments
feature:
  title: 自动化上线和回滚
  description: >
    Kubernetes 会分步骤地将针对应用或其配置的更改上线，同时监视应用程序运行状况以确保你不会同时终止所有实例。如果出现问题，Kubernetes 会为你回滚所作更改。你应该充分利用不断成长的部署方案生态系统。
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
一个 _Deployment_ 为 {{< glossary_tooltip text="Pods" term_id="pod" >}}
和 {{< glossary_tooltip term_id="replica-set" text="ReplicaSets" >}}
提供声明式的更新能力。

<!--
You describe a _desired state_ in a Deployment, and the Deployment {{< glossary_tooltip term_id="controller" >}} changes the actual state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove existing Deployments and adopt all their resources with new Deployments.
-->
你负责描述 Deployment 中的 _目标状态_，而 Deployment {{< glossary_tooltip term_id="controller" >}}
以受控速率更改实际状态，
使其变为期望状态。你可以定义 Deployment 以创建新的 ReplicaSet，或删除现有 Deployment，
并通过新的 Deployment 管理其资源。

<!--
Do not manage ReplicaSets owned by a Deployment. Consider opening an issue in the main Kubernetes repository if your use case is not covered below.
-->
{{< note >}}
不要管理 Deployment 所拥有的 ReplicaSet 。
如果存在下面未覆盖的使用场景，请考虑在 Kubernetes 仓库中提出 Issue。
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
* [Rollback to an earlier Deployment revision](#rolling-back-a-deployment) if the current state of the Deployment is not stable. Each rollback updates the revision of the Deployment.
* [Scale up the Deployment to facilitate more load](#scaling-a-deployment).
 * [Pause the Deployment](#pausing-and-resuming-a-deployment) to apply multiple fixes to its PodTemplateSpec and then resume it to start a new rollout.
 * [Use the status of the Deployment](#deployment-status) as an indicator that a rollout has stuck.
 * [Clean up older ReplicaSets](#clean-up-policy) that you don't need anymore.
-->
* [创建 Deployment 以将 ReplicaSet 上线](#creating-a-deployment)。 ReplicaSet 在后台创建 Pods。
  检查 ReplicaSet 的上线状态，查看其是否成功。
* 通过更新 Deployment 的 PodTemplateSpec，[声明 Pod 的新状态](#updating-a-deployment) 。
  新的 ReplicaSet 会被创建，Deployment 以受控速率将 Pod 从旧 ReplicaSet 迁移到新 ReplicaSet。
  每个新的 ReplicaSet 都会更新 Deployment 的修订版本。
* 如果 Deployment 的当前状态不稳定，[回滚到较早的 Deployment 版本](#rolling-back-a-deployment)。
  每次回滚都会更新 Deployment 的修订版本。
* [扩大 Deployment 规模以承担更多负载](#scaling-a-deployment)。
* [暂停 Deployment ](#pausing-and-resuming-a-deployment) 以应用对 PodTemplateSpec 所作的多项修改，
  然后恢复其执行以启动新的上线版本。
* [使用 Deployment 状态](#deployment-status) 来判定上线过程是否出现停滞。
* [清理较旧的不再需要的 ReplicaSet](#clean-up-policy) 。

<!--
 ## Creating a Deployment

The following is an example of a Deployment. It creates a ReplicaSet to bring up three `nginx` Pods:
-->
## 创建 Deployment  {#creating-a-deployment}

下面是 Deployment 示例。其中创建了一个 ReplicaSet，负责启动三个 `nginx` Pods：

{{< codenew file="controllers/nginx-deployment.yaml" >}}

<!--
In this example:
-->
在该例中：

<!--
 * A Deployment named `nginx-deployment` is created, indicated by the `.metadata.name` field.
 * The Deployment creates three replicated Pods, indicated by the `replicas` field.
-->
* 创建名为 `nginx-deployment`（由 `.metadata.name` 字段标明）的 Deployment。
* 该 Deployment 创建三个（由 `replicas` 字段标明）Pod 副本。

<!--
* The `selector` field defines how the Deployment finds which Pods to manage.
  In this case, you simply select a label that is defined in the Pod template (`app: nginx`).
  However, more sophisticated selection rules are possible,
  as long as the Pod template itself satisfies the rule.
-->
* `selector` 字段定义 Deployment 如何查找要管理的 Pods。
  在这里，你只需选择在 Pod 模板中定义的标签（`app: nginx`）。
  不过，更复杂的选择规则也是可能的，只要 Pod 模板本身满足所给规则即可。

  <!--
  The `matchLabels` field is a map of {key,value} pairs. A single {key,value} in the `matchLabels` map
  is equivalent to an element of `matchExpressions`, whose key field is "key" the operator is "In",
  and the values array contains only "value".
  All of the requirements, from both `matchLabels` and `matchExpressions`, must be satisfied in order to match.
  -->
  {{< note >}}
  `matchLabels` 字段是 `{key,value}` 偶对的映射。在 `matchLabels` 映射中的单个 `{key,value}`
  映射等效于 `matchExpressions` 中的一个元素，即其 `key` 字段是 “key”，operator 为 “In”，`value`
  数组仅包含 “value”。在 `matchLabels` 和 `matchExpressions` 中给出的所有条件都必须满足才能匹配。
  {{< /note >}}

<!--
* The `template` field contains the following sub-fields:
   * The Pods are labeled `app: nginx`using the `labels` field.
  * The Pod template's specification, or `.template.spec` field, indicates that
    the Pods run one container, `nginx`, which runs the `nginx`
    [Docker Hub](https://hub.docker.com/) image at version 1.14.2.
  * Create one container and name it `nginx` using the `name` field.
-->
* `template` 字段包含以下子字段：
  * Pod 被使用 `labels` 字段打上 `app: nginx` 标签。
  * Pod 模板规约（即 `.template.spec` 字段）指示 Pods 运行一个 `nginx` 容器，
    该容器运行版本为 1.14.2 的 `nginx` [Docker Hub](https://hub.docker.com/)镜像。
  * 创建一个容器并使用 `name` 字段将其命名为 `nginx`。

<!--
Before you begin, make sure your Kubernetes cluster is up and running.
Follow the steps given below to create the above Deployment:
-->
开始之前，请确保的 Kubernetes 集群已启动并运行。
按照以下步骤创建上述 Deployment ：

<!--
1. Create the Deployment by running the following command:
-->
1. 通过运行以下命令创建 Deployment ：

   ```shell
   kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
   ```
   <!--
   You may specify the `-record` flag to write the command executed in the resource annotation
   `kubernetes.io/change-cause`. It is useful for future introspection.
   For example, to see the commands executed in each Deployment revision.
   -->
   {{< note >}}
   你可以设置 `--record` 标志将所执行的命令写入资源注解 `kubernetes.io/change-cause` 中。
   这对于以后的检查是有用的。例如，要查看针对每个 Deployment 修订版本所执行过的命令。
   {{< /note >}}

<!--
 2. Run `kubectl get deployments` to check if the Deployment was created. If the Deployment is still being created, the output is similar to the following:
-->
2. 运行 `kubectl get deployments` 检查 Deployment 是否已创建。如果仍在创建 Deployment，
   则输出类似于：

   ```
   NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3         0         0            0           1s
   ```

   <!--
   When you inspect the Deployments in your cluster, the following fields are displayed:
   -->
   在检查集群中的 Deployment 时，所显示的字段有：

   <!--
   * `NAME` lists the names of the Deployments in the cluster.
   * `READY` displays how many replicas of the application are available to your users. It follows the pattern ready/desired.
   * `UP-TO-DATE` displays the number of replicas that have been updated to achieve the desired state.
   * `AVAILABLE` displays how many replicas of the application are available to your users.
   * `AGE` displays the amount of time that the application has been running.
   -->
   * `NAME` 列出了集群中 Deployment 的名称。
   * `READY` 显示应用程序的可用的 _副本_ 数。显示的模式是“就绪个数/期望个数”。
   * `UP-TO-DATE` 显示为了达到期望状态已经更新的副本数。
   * `AVAILABLE` 显示应用可供用户使用的副本数。
   * `AGE` 显示应用程序运行的时间。

   <!--
   Notice how the number of desired replicas is 3 according to `.spec.replicas` field.
   -->
   请注意期望副本数是根据 `.spec.replicas` 字段设置 3。

<!--
3. To see the Deployment rollout status, run `kubectl rollout status deployment/nginx-deployment`.

   The output is similar to:
-->
3. 要查看 Deployment 上线状态，运行 `kubectl rollout status deployment/nginx-deployment`。

   输出类似于：

   ```
   Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
   deployment "nginx-deployment" successfully rolled out
   ```

<!--
4. Run the `kubectl get deployments` again a few seconds later. The output is similar to this:
-->
4. 几秒钟后再次运行 `kubectl get deployments`。输出类似于：

   ```
   NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3         3         3            3           18s
   ```

   <!--
   Notice that the Deployment has created all three replicas, and all replicas are up-to-date (they contain the latest Pod template) and available.
   -->
   注意 Deployment 已创建全部三个副本，并且所有副本都是最新的（它们包含最新的 Pod 模板）
   并且可用。

<!--
5. To see the ReplicaSet (`rs`) created by the Deployment, run `kubectl get rs`. The output is similar to this:
-->
5. 要查看 Deployment 创建的 ReplicaSet（`rs`），运行 `kubectl get rs`。
   输出类似于：

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
   ReplicaSet 输出中包含以下字段：

   * `NAME` 列出名字空间中 ReplicaSet 的名称；
   * `DESIRED` 显示应用的期望副本个数，即在创建 Deployment 时所定义的值。
     此为期望状态；
   * `CURRENT` 显示当前运行状态中的副本个数；
   * `READY` 显示应用中有多少副本可以为用户提供服务；
   * `AGE` 显示应用已经运行的时间长度。

   <!--
   Notice that the name of the ReplicaSet is always formatted as `[DEPLOYMENT-NAME]-[RANDOM-STRING]`. The random string is
   randomly generated and uses the pod-template-hash as a seed.
   -->
   注意 ReplicaSet 的名称始终被格式化为`[Deployment名称]-[随机字符串]`。
   其中的随机字符串是使用 pod-template-hash 作为种子随机生成的。

<!--
 6. To see the labels automatically generated for each Pod, run `kubectl get pods -show-labels`. The following output is returned:
-->
6. 要查看每个 Pod 自动生成的标签，运行 `kubectl get pods --show-labels`。返回以下输出：

   ```
   NAME                                READY     STATUS    RESTARTS   AGE       LABELS
   nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
   nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
   nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
   ```

   <!--
   The created ReplicaSet ensures that there are three `nginx` Pods.
   -->
   所创建的 ReplicaSet 确保总是存在三个 `nginx` Pod。

<!--
You must specify an appropriate selector and Pod template labels in a Deployment (in this case,
`app: nginx`). Do not overlap labels or selectors with other controllers
(including other Deployments and StatefulSets). Kubernetes doesn't stop you from overlapping,
and if multiple controllers have overlapping selectors those controllers might conflict and behave unexpectedly.
-->
{{< note >}}
你必须在 Deployment 中指定适当的选择算符和 Pod 模板标签（在本例中为 `app: nginx`）。
标签或者选择算符不要与其他控制器（包括其他 Deployment 和 StatefulSet）重叠。
Kubernetes 不会阻止你这样做，但是如果多个控制器具有重叠的选择算符，它们可能会发生冲突
执行难以预料的操作。
{{< /note >}}

<!--
 ### Pod-template-hash label
-->
### Pod-template-hash 标签

<!-- Do not change this label.  -->
{{< note >}}
不要更改此标签。
{{< /note >}}

<!--
The `pod-template-hash` label is added by the Deployment controller to every ReplicaSet
that a Deployment creates or adopts.
-->
Deployment 控制器将 `pod-template-hash` 标签添加到 Deployment 所创建或收留的
每个 ReplicaSet 。

<!--
This label ensures that child ReplicaSets of a Deployment do not overlap. It is generated by hashing the `PodTemplate` of the ReplicaSet and using the resulting hash as the label value that is added to the ReplicaSet selector, Pod template labels,
and in any existing Pods that the ReplicaSet might have.
-->
此标签可确保 Deployment 的子 ReplicaSets 不重叠。
标签是通过对 ReplicaSet 的 `PodTemplate` 进行哈希处理。
所生成的哈希值被添加到 ReplicaSet 选择算符、Pod 模板标签，并存在于在 ReplicaSet
可能拥有的任何现有 Pod 中。

<!--
 ## Updating a Deployment
-->
## 更新 Deployment   {#updating-a-deployment}

<!--
 A Deployment's rollout is triggered if and only if the Deployment's Pod template (that is, `.spec.template`)
is changed, for example if the labels or container images of the template are updated. Other updates, such as scaling the Deployment, do not trigger a rollout.
-->
{{< note >}}
仅当 Deployment Pod 模板（即 `.spec.template`）发生改变时，例如模板的标签或容器镜像被更新，
才会触发 Deployment 上线。
其他更新（如对 Deployment 执行扩缩容的操作）不会触发上线动作。
{{< /note >}}

<!--
 Follow the steps given below to update your Deployment:
-->
按照以下步骤更新 Deployment：

<!--
1. Let's update the nginx Pods to use the `nginx:1.16.1` image instead of the `nginx:1.14.2` image.
-->
1. 先来更新 nginx Pod 以使用 `nginx:1.16.1` 镜像，而不是 `nginx:1.14.2` 镜像。

   ```shell
   kubectl --record deployment.apps/nginx-deployment set image \
      deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
   ```
   <!--
   or simply use the following command:
   -->
   或者使用下面的命令：
    
   ```shell
   kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1 --record
   ```

   <!-- The output is similar to this: -->
   输出类似于：

   ```
   deployment.apps/nginx-deployment image updated
   ```

   <!--
   Alternatively, you can `edit` the Deployment and change `.spec.template.spec.containers[0].image` from `nginx:1.7.9` to `nginx:1.9.1`:
   -->
   或者，可以 `edit`  Deployment 并将 `.spec.template.spec.containers[0].image` 从
   `nginx:1.14.2` 更改至 `nginx:1.16.1`。

   ```shell
   kubectl edit deployment.v1.apps/nginx-deployment
   ```

   <!-- The output is similar to this: -->
   输出类似于：

   ```
   deployment.apps/nginx-deployment edited
   ```

<!--
2. To see the rollout status, run:
-->
2. 要查看上线状态，运行：

   ```shell
   kubectl rollout status deployment/nginx-deployment
   ```

   <!-- The output is similar to this: -->
   输出类似于：

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
获取关于已更新的 Deployment 的更多信息：

<!--
* After the rollout succeeds, you can view the Deployment by running `kubectl get deployments`.
  The output is similar to this:
-->
* 在上线成功后，可以通过运行 `kubectl get deployments` 来查看 Deployment：
  输出类似于：

  ```shell
  NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment   3         3         3            3           36s
  ```

<!--
* Run `kubectl get rs` to see that the Deployment updated the Pods by creating a new ReplicaSet and scaling it
up to 3 replicas, as well as scaling down the old ReplicaSet to 0 replicas.
-->
* 运行 `kubectl get rs` 以查看 Deployment 通过创建新的 ReplicaSet 并将其扩容到
  3 个副本并将旧 ReplicaSet 缩容到 0 个副本完成了 Pod 的更新操作：

  ```shell
  kubectl get rs
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       6s
  nginx-deployment-2035384211   0         0         0       36s
  ```

<!--
* Running `get pods` should now show only the new Pods:
-->
* 现在运行 `get pods` 应仅显示新的 Pods:

  ```shell
  kubectl get pods
  ```

  <!-- The output is similar to this: -->
  输出类似于：

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
  下次要更新这些 Pods 时，只需再次更新 Deployment Pod 模板即可。

  Deployment 可确保在更新时仅关闭一定数量的 Pod。默认情况下，它确保至少所需 Pods
  75% 处于运行状态（最大不可用比例为 25%）。

  <!--
  Deployment also ensures that only a certain number of Pods are created above the desired number of Pods.
  By default, it ensures that at most 25% of the desired number of Pods are up (25% max surge).
  -->
  Deployment 还确保仅所创建 Pod 数量只可能比期望 Pods 数高一点点。
  默认情况下，它可确保启动的 Pod 个数比期望个数最多多出 25%（最大峰值 25%）。

  <!--   
  For example, if you look at the above Deployment closely, you will see that it first created a new Pod,
  then deleted some old Pods, and created new ones. It does not kill old Pods until a sufficient number of
  new Pods have come up, and does not create new Pods until a sufficient number of old Pods have been killed.
  It makes sure that at least 2 Pods are available and that at max 4 Pods in total are available.
  -->
  例如，如果仔细查看上述 Deployment ，将看到它首先创建了一个新的 Pod，然后删除了一些旧的 Pods，
  并创建了新的 Pods。它不会杀死老 Pods，直到有足够的数量新的 Pods 已经出现。
  在足够数量的旧 Pods 被杀死前并没有创建新 Pods。它确保至少 2 个 Pod 可用，同时
  最多总共 4 个 Pod 可用。

<!--
* Get details of your Deployment:
-->
* 获取 Deployment 的更多信息

  ```shell
  kubectl describe deployments
  ```

  <!-- The output is similar to this: -->
  输出类似于：

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
  (nginx-deployment-1564180365) and scaled it up to 1 and then scaled down the old ReplicaSet to 2, so that at
  least 2 Pods were available and at most 4 Pods were created at all times. It then continued scaling up and down
  the new and the old ReplicaSet, with the same rolling update strategy. Finally, you'll have 3 available replicas
  in the new ReplicaSet, and the old ReplicaSet is scaled down to 0.
  -->
  可以看到，当第一次创建 Deployment 时，它创建了一个 ReplicaSet（nginx-deployment-2035384211）
  并将其直接扩容至 3 个副本。更新 Deployment 时，它创建了一个新的 ReplicaSet
  （nginx-deployment-1564180365），并将其扩容为 1，然后将旧 ReplicaSet 缩容到 2，
  以便至少有 2 个 Pod 可用且最多创建 4 个 Pod。
  然后，它使用相同的滚动更新策略继续对新的 ReplicaSet 扩容并对旧的 ReplicaSet 缩容。
  最后，你将有 3 个可用的副本在新的 ReplicaSet 中，旧 ReplicaSet 将缩容到 0。

<!--
### Rollover (aka multiple updates in-flight)

Each time a new Deployment is observed by the Deployment controller, a ReplicaSet is created to bring up
the desired Pods. If the Deployment is updated, the existing ReplicaSet that controls Pods whose labels
match `.spec.selector` but whose template does not match `.spec.template` are scaled down. Eventually, the new
ReplicaSet is scaled to `.spec.replicas` and all old ReplicaSets is scaled to 0.
-->
### 翻转（多 Deployment 动态更新）

Deployment 控制器每次注意到新的 Deployment 时，都会创建一个 ReplicaSet 以启动所需的 Pods。
如果更新了 Deployment，则控制标签匹配 `.spec.selector` 但模板不匹配 `.spec.template` 的
Pods 的现有 ReplicaSet 被缩容。最终，新的 ReplicaSet 扩容为 `.spec.replicas` 个副本，
所有旧 ReplicaSets 缩放为 0 个副本。

<!--
If you update a Deployment while an existing rollout is in progress, the Deployment creates a new ReplicaSet
as per the update and start scaling that up, and rolls over the ReplicaSet that it was scaling up previously
- it will add it to its list of old ReplicaSets and start scaling it down.
-->
当 Deployment 正在上线时被更新，Deployment 会针对更新创建一个新的 ReplicaSet
并开始对其扩容，之前正在被扩容的 ReplicaSet 会被翻转，添加到旧 ReplicaSets 列表
并开始缩容。

<!--
For example, suppose you create a Deployment to create 5 replicas of `nginx:1.14.2`,
but then update the Deployment to create 5 replicas of `nginx:1.16.1`, when only 3
replicas of `nginx:1.7.9` had been created. In that case, the Deployment immediately starts
killing the 3 `nginx:1.7.9` Pods that it had created, and starts creating
`nginx:1.9.1` Pods. It does not wait for the 5 replicas of `nginx:1.14.2` to be created
before changing course.
-->
例如，假定你在创建一个 Deployment 以生成 `nginx:1.14.2` 的 5 个副本，但接下来
更新 Deployment 以创建 5 个 `nginx:1.16.1` 的副本，而此时只有 3 个`nginx:1.14.2`
副本已创建。在这种情况下，Deployment 会立即开始杀死 3 个 `nginx:1.14.2` Pods，
并开始创建 `nginx:1.16.1` Pods。它不会等待 `nginx:1.14.2` 的 5 个副本都创建完成
后才开始执行变更动作。

<!--
### Label selector updates

 It is generally discouraged to make label selector updates and it is suggested to plan your selectors up front.
In any case, if you need to perform a label selector update, exercise great caution and make sure you have grasped
all of the implications.
-->
### 更改标签选择算符

通常不鼓励更新标签选择算符。建议你提前规划选择算符。
在任何情况下，如果需要更新标签选择算符，请格外小心，并确保自己了解
这背后可能发生的所有事情。

<!--
In API version `apps/v1`, a Deployment's label selector is immutable after it gets created.
-->
{{< note >}}
在 API 版本 `apps/v1` 中，Deployment 标签选择算符在创建后是不可变的。
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
* 添加选择算符时要求使用新标签更新 Deployment 规约中的 Pod 模板标签，否则将返回验证错误。
  此更改是非重叠的，也就是说新的选择算符不会选择使用旧选择算符所创建的 ReplicaSet 和 Pod，
  这会导致创建新的 ReplicaSet 时所有旧 ReplicaSet 都会被孤立。
* 选择算符的更新如果更改了某个算符的键名，这会导致与添加算符时相同的行为。
* 删除选择算符的操作会删除从 Deployment 选择算符中删除现有算符。
  此操作不需要更改 Pod 模板标签。现有 ReplicaSet 不会被孤立，也不会因此创建新的 ReplicaSet，
  但请注意已删除的标签仍然存在于现有的 Pod 和 ReplicaSet 中。

<!--
## Rolling Back a Deployment
-->
## 回滚 Deployment {#rolling-back-a-deployment}

<!--
 Sometimes, you may want to rollback a Deployment; for example, when the Deployment is not stable, such as crash looping.
By default, all of the Deployment's rollout history is kept in the system so that you can rollback anytime you want
(you can change that by modifying revision history limit).
-->
有时，你可能想要回滚 Deployment；例如，当 Deployment 不稳定时（例如进入反复崩溃状态）。
默认情况下，Deployment 的所有上线记录都保留在系统中，以便可以随时回滚
（你可以通过修改修订历史记录限制来更改这一约束）。

<!--
A Deployment's revision is created when a Deployment's rollout is triggered. This means that the
new revision is created if and only if the Deployment's Pod template (`.spec.template`) is changed,
for example if you update the labels or container images of the template. Other updates, such as scaling the Deployment,
do not create a Deployment revision, so that you can facilitate simultaneous manual- or auto-scaling.
This means that when you roll back to an earlier revision, only the Deployment's Pod template part is
rolled back.
-->
{{< note >}}
Deployment 被触发上线时，系统就会创建 Deployment 的新的修订版本。
这意味着仅当 Deployment 的 Pod 模板（`.spec.template`）发生更改时，才会创建新修订版本
-- 例如，模板的标签或容器镜像发生变化。
其他更新，如 Deployment 的扩缩容操作不会创建 Deployment 修订版本。
这是为了方便同时执行手动缩放或自动缩放。
换言之，当你回滚到较早的修订版本时，只有 Deployment 的 Pod 模板部分会被回滚。
{{< /note >}}

<!--
* Suppose that you made a typo while updating the Deployment, by putting the image name as `nginx:1.161` instead of `nginx:1.16.1`:
-->
* 假设你在更新 Deployment 时犯了一个拼写错误，将镜像名称命名设置为
  `nginx:1.161` 而不是 `nginx:1.16.1`：

  ```shell
  kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.161 --record=true
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```shell
  deployment.apps/nginx-deployment image updated
  ```

<!--
* The rollout gets stuck. You can verify it by checking the rollout status:
-->
* 此上线进程会出现停滞。你可以通过检查上线状态来验证：

  ```shell
  kubectl rollout status deployment/nginx-deployment
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```
  Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
  ```

<!--
* Press Ctrl-C to stop the above rollout status watch. For more information on stuck rollouts,
[read more here](#deployment-status).
-->
* 按 Ctrl-C 停止上述上线状态观测。有关上线停滞的详细信息，[参考这里](#deployment-status)。

<!--
 * You see that the number of old replicas (`nginx-deployment-1564180365` and `nginx-deployment-2035384211`) is 2, and new replicas (nginx-deployment-3066724191) is 1.
-->
* 你可以看到旧的副本有两个（`nginx-deployment-1564180365` 和 `nginx-deployment-2035384211`），
  新的副本有 1 个（`nginx-deployment-3066724191`）：

  ```shell
  kubectl get rs
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```shell
  NAME                          DESIRED   CURRENT   READY   AGE
  nginx-deployment-1564180365   3         3         3       25s
  nginx-deployment-2035384211   0         0         0       36s
  nginx-deployment-3066724191   1         1         0       6s
  ```

<!--
* Looking at the Pods created, you see that 1 Pod created by new ReplicaSet is stuck in an image pull loop.
-->
* 查看所创建的 Pod，你会注意到新 ReplicaSet 所创建的 1 个 Pod 卡顿在镜像拉取循环中。

  ```shell
  kubectl get pods
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```shell
  NAME                                READY     STATUS             RESTARTS   AGE
  nginx-deployment-1564180365-70iae   1/1       Running            0          25s
  nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
  nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
  nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
  ```

  <!--
  The Deployment controller stops the bad rollout automatically, and stops scaling up the new
  ReplicaSet. This depends on the rollingUpdate parameters (`maxUnavailable` specifically) that you have specified.
  Kubernetes by default sets the value to 25%.
  -->
  {{< note >}}
  Deployment 控制器自动停止有问题的上线过程，并停止对新的 ReplicaSet 扩容。
  这行为取决于所指定的 rollingUpdate 参数（具体为 `maxUnavailable`）。
  默认情况下，Kubernetes 将此值设置为 25%。
  {{< /note >}}

<!--
 * Get the description of the Deployment:
-->
* 获取 Deployment 描述信息：

  ```shell
  kubectl describe deployment
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```shell
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
  要解决此问题，需要回滚到以前稳定的 Deployment 版本。

<!--
### Checking Rollout History of a Deployment

Follow the steps given below to check the rollout history:
-->
### 检查 Deployment 上线历史

按照如下步骤检查回滚历史：

<!--
 1. First, check the revisions of this Deployment:
-->
1. 首先，检查 Deployment 修订历史：

   ```shell
   kubectl rollout history deployment.v1.apps/nginx-deployment
   ```

   <!-- The output is similar to this: -->
   输出类似于：

   ```shell
   deployments "nginx-deployment"
   REVISION    CHANGE-CAUSE
   1           kubectl apply --filename=https://k8s.io/examples/controllers/nginx-deployment.yaml --record=true
   2           kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
   3           kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.91 --record=true
   ```

   <!--
   `CHANGE-CAUSE` is copied from the Deployment annotation `kubernetes.io/change-cause` to its revisions upon creation. You can specify the`CHANGE-CAUSE` message by:
   -->
   `CHANGE-CAUSE` 的内容是从 Deployment 的 `kubernetes.io/change-cause` 注解复制过来的。
   复制动作发生在修订版本创建时。你可以通过以下方式设置 `CHANGE-CAUSE` 消息：

   <!--
   * Annotating the Deployment with `kubectl annotate deployment.v1.apps/nginx-deployment kubernetes.io/change-cause="image updated to 1.9.1"`
   * Append the `-record` flag to save the `kubectl` command that is making changes to the resource.
   * Manually editing the manifest of the resource.
   -->
   * 使用 `kubectl annotate deployment.v1.apps/nginx-deployment kubernetes.io/change-cause="image updated to 1.9.1"` 为 Deployment 添加注解。
   * 追加 `--record` 命令行标志以保存正在更改资源的 `kubectl` 命令。
   * 手动编辑资源的清单。

<!--
2. To see the details of each revision, run:
-->
2. 要查看修订历史的详细信息，运行：

   ```shell
   kubectl rollout history deployment.v1.apps/nginx-deployment --revision=2
   ```

   <!-- The output is similar to this: -->
   输出类似于：

   ```shell
   deployments "nginx-deployment" revision 2
     Labels:       app=nginx
             pod-template-hash=1159050644
     Annotations:  kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1 --record=true
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
### 回滚到之前的修订版本   {#rolling-back-to-a-previous-revision}

按照下面给出的步骤将 Deployment 从当前版本回滚到以前的版本（即版本 2）。

<!--
 1. Now you've decided to undo the current rollout and rollback to the previous revision:
-->
1. 假定现在你已决定撤消当前上线并回滚到以前的修订版本：

   ```shell
   kubectl rollout undo deployment.v1.apps/nginx-deployment
   ```

   <!-- The output is similar to this: -->
   输出类似于：

   ```
   deployment.apps/nginx-deployment
   ```

   <!--
   Alternatively, you can rollback to a specific revision by specifying it with `-to-revision`:
   -->
   或者，你也可以通过使用 `--to-revision` 来回滚到特定修订版本：

   ```shell
   kubectl rollout undo deployment.v1.apps/nginx-deployment --to-revision=2
   ```

   <!-- The output is similar to this: -->
   输出类似于：

   ```
   deployment.apps/nginx-deployment
   ```

   <!--
   For more details about rollout related commands, read [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout).
   -->
   与回滚相关的指令的更详细信息，请参考 [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout)。

   <!--
   The Deployment is now rolled back to a previous stable revision. As you can see, a `DeploymentRollback` event
   for rolling back to revision 2 is generated from Deployment controller.
   -->
   现在，Deployment 正在回滚到以前的稳定版本。正如你所看到的，Deployment 控制器生成了
   回滚到修订版本 2 的 `DeploymentRollback` 事件。

<!--
 2. Check if the rollback was successful and the Deployment is running as expected, run:
-->
2. 检查回滚是否成功以及 Deployment 是否正在运行，运行：

   ```shell
   kubectl get deployment nginx-deployment
   ```

   <!-- The output is similar to this: -->
   输出类似于：

   ```shell
   NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
   nginx-deployment   3         3         3            3           30m
   ```

<!--
3. Get the description of the Deployment:
-->
3. 获取 Deployment 描述信息：

   ```shell
   kubectl describe deployment nginx-deployment
   ```

   <!-- The output is similar to this: -->
   输出类似于：

   ```
   Name:                   nginx-deployment
   Namespace:              default
   CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
   Labels:                 app=nginx
   Annotations:            deployment.kubernetes.io/revision=4
                           kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1 --record=true
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
## 缩放 Deployment   {#scaling-a-deployment}

你可以使用如下指令缩放 Deployment：

```shell
kubectl scale deployment.v1.apps/nginx-deployment --replicas=10
```

<!-- The output is similar to this: -->
输出类似于：

```
deployment.apps/nginx-deployment scaled
```

<!--
Assuming [horizontal Pod autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) is enabled
in your cluster, you can setup an autoscaler for your Deployment and choose the minimum and maximum number of
Pods you want to run based on the CPU utilization of your existing Pods.
-->
假设集群启用了[Pod 的水平自动缩放](/zh/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)，
你可以为 Deployment 设置自动缩放器，并基于现有 Pods 的 CPU 利用率选择
要运行的 Pods 个数下限和上限。

```shell
kubectl autoscale deployment.v1.apps/nginx-deployment --min=10 --max=15 --cpu-percent=80
```

<!-- The output is similar to this: -->
输出类似于：

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
### 比例缩放  {#proportional-scaling}

RollingUpdate 的 Deployment 支持同时运行应用程序的多个版本。
当自动缩放器缩放处于上线进程（仍在进行中或暂停）中的 RollingUpdate Deployment 时，
Deployment 控制器会平衡现有的活跃状态的 ReplicaSets（含 Pods 的 ReplicaSets）中的额外副本，
以降低风险。这称为 *比例缩放（Proportional Scaling）*。

<!--
For example, you are running a Deployment with 10 replicas, [maxSurge](#max-surge)=3, and [maxUnavailable](#max-unavailable)=2.
-->
例如，你正在运行一个 10 个副本的 Deployment，其 [maxSurge](#max-surge)=3，[maxUnavailable](#max-unavailable)=2。

<!--
* Ensure that the 10 replicas in your Deployment are running.
-->
* 确保 Deployment 的这 10 个副本都在运行。

  ```shell
  kubectl get deploy
  ```
  <!-- The output is similar to this: -->
  输出类似于：

  ```
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

<!--
* You update to a new image which happens to be unresolvable from inside the cluster.
-->
* 更新 Deployment 使用新镜像，碰巧该镜像无法从集群内部解析。

  ```shell
  kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:sometag
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```
  deployment.apps/nginx-deployment image updated
  ```

<!--
* The image update starts a new rollout with ReplicaSet nginx-deployment-1989198191, but it's blocked due to the
`maxUnavailable` requirement that you mentioned above. Check out the rollout status:
-->
* 镜像更新使用 ReplicaSet `nginx-deployment-1989198191` 启动新的上线过程，
  但由于上面提到的 `maxUnavailable` 要求，该进程被阻塞了。检查上线状态：

  ```shell
  kubectl get rs
  ```
  <!-- The output is similar to this: -->
  输出类似于：

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
* 然后，出现了新的 Deployment 扩缩请求。自动缩放器将 Deployment 副本增加到 15。
  Deployment 控制器需要决定在何处添加 5 个新副本。如果未使用比例缩放，所有 5 个副本
  都将添加到新的 ReplicaSet 中。使用比例缩放时，可以将额外的副本分布到所有 ReplicaSet。
  较大比例的副本会被添加到拥有最多副本的 ReplicaSet，而较低比例的副本会进入到
  副本较少的 ReplicaSet。所有剩下的副本都会添加到副本最多的 ReplicaSet。
  具有零副本的 ReplicaSets 不会被扩容。

<!--
In our example above, 3 replicas are added to the old ReplicaSet and 2 replicas are added to the
new ReplicaSet. The rollout process should eventually move all replicas to the new ReplicaSet, assuming
the new replicas become healthy. To confirm this, run:
-->
在上面的示例中，3 个副本被添加到旧 ReplicaSet 中，2 个副本被添加到新 ReplicaSet。
假定新的副本都很健康，上线过程最终应将所有副本迁移到新的 ReplicaSet 中。
要确认这一点，请运行：

```shell
kubectl get deploy
```
<!-- The output is similar to this: -->
输出类似于：

```
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```

<!--
The rollout status confirms how the replicas were added to each ReplicaSet.
-->
上线状态确认了副本是如何被添加到每个 ReplicaSet 的。

```shell
kubectl get rs
```

<!-- The output is similar to this: -->
输出类似于：

```shell
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

<!--
## Pausing and Resuming a Deployment

You can pause a Deployment before triggering one or more updates and then resume it. This allows you to
apply multiple fixes in between pausing and resuming without triggering unnecessary rollouts.
-->
## 暂停、恢复 Deployment   {#pausing-and-resuming-a-deployment}

你可以在触发一个或多个更新之前暂停 Deployment，然后再恢复其执行。
这样做使得你能够在暂停和恢复执行之间应用多个修补程序，而不会触发不必要的上线操作。

<!--
* For example, with a Deployment that was just created:
  Get the Deployment details:
-->
* 例如，对于一个刚刚创建的 Deployment：
  获取 Deployment 信息：

  ```shell
  kubectl get deploy
  ```
  <!-- The output is similar to this: -->
  输出类似于：

  ```
  NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx     3         3         3            3           1m
  ```

  <!-- Get the rollout status: -->
  获取上线状态：

  ```shell
  kubectl get rs
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```shell
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         1m
  ```

<!--
* Pause by running the following command:
-->
* 使用如下指令暂停运行：

  ```shell
  kubectl rollout pause deployment.v1.apps/nginx-deployment
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```shell
  deployment.apps/nginx-deployment paused
  ```

<!--
* Then update the image of the Deployment:
-->
* 接下来更新 Deployment 镜像：

  ```shell
  kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.16.1
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```
  deployment.apps/nginx-deployment image updated
  ```

<!--
 * Notice that no new rollout started:
-->
* 注意没有新的上线被触发：

  ```shell
  kubectl rollout history deployment.v1.apps/nginx-deployment
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```shell
  deployments "nginx"
  REVISION  CHANGE-CAUSE
  1   <none>
  ```

<!--
* Get the rollout status to ensure that the Deployment is updates successfully:
-->
* 获取上线状态确保 Deployment 更新已经成功：

  ```shell
  kubectl get rs
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```shell
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         2m
  ```

<!--
* You can make as many updates as you wish, for example, update the resources that will be used:
-->
* 你可以根据需要执行很多更新操作，例如，可以要使用的资源：

  ```shell
  kubectl set resources deployment.v1.apps/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```
  deployment.apps/nginx-deployment resource requirements updated
  ```

  <!--
  The initial state of the Deployment prior to pausing it will continue its function, but new updates to
  the Deployment will not have any effect as long as the Deployment is paused.
  -->
  暂停 Deployment 之前的初始状态将继续发挥作用，但新的更新在 Deployment 被
  暂停期间不会产生任何效果。

<!--
* Eventually, resume the Deployment and observe a new ReplicaSet coming up with all the new updates:
-->
* 最终，恢复 Deployment 执行并观察新的 ReplicaSet 的创建过程，其中包含了所应用的所有更新：

  ```shell
  kubectl rollout resume deployment.v1.apps/nginx-deployment
  ```

  <!-- The output is similar to this: -->
  输出：

  ```shell
  deployment.apps/nginx-deployment resumed
  ```

<!--
* Watch the status of the rollout until it's done.
-->
* 观察上线的状态，直到完成。

  ```shell
  kubectl get rs -w
  ```

  <!-- The output is similar to this: -->
  输出类似于：

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
* 获取最近上线的状态：

  ```shell
  kubectl get rs
  ```

  <!-- The output is similar to this: -->
  输出类似于：

  ```
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   0         0         0         2m
  nginx-3926361531   3         3         3         28s
  ```

<!--
You cannot rollback a paused Deployment until you resume it.
-->
{{< note >}}
你不可以回滚处于暂停状态的 Deployment，除非先恢复其执行状态。
{{< /note >}}

<!--
## Deployment status

A Deployment enters various states during its lifecycle. It can be [progressing](#progressing-deployment) while
rolling out a new ReplicaSet, it can be [complete](#complete-deployment), or it can [fail to progress](#failed-deployment).
-->
##  Deployment 状态 {#deployment-status}

Deployment 的生命周期中会有许多状态。上线新的 ReplicaSet 期间可能处于
[Progressing（进行中）](#progressing-deployment)，可能是
[Complete（已完成）](#complete-deployment)，也可能是
[Failed（失败）](#failed-deployment)以至于无法继续进行。

<!--
### Progressing Deployment

Kubernetes marks a Deployment as _progressing_ when one of the following tasks is performed:
-->
### 进行中的 Deployment  {#progressing-deployment}

执行下面的任务期间，Kubernetes 标记 Deployment 为 _进行中（Progressing）_：

<!--
 * The Deployment creates a new ReplicaSet.
* The Deployment is scaling up its newest ReplicaSet.
* The Deployment is scaling down its older ReplicaSet(s).
* New Pods become ready or available (ready for at least [MinReadySeconds](#min-ready-seconds)).
-->
* Deployment 创建新的 ReplicaSet
* Deployment 正在为其最新的 ReplicaSet 扩容
* Deployment 正在为其旧有的 ReplicaSet(s) 缩容
* 新的 Pods 已经就绪或者可用（就绪至少持续了 [MinReadySeconds](#min-ready-seconds) 秒）。

<!--
You can monitor the progress for a Deployment by using `kubectl rollout status`.
-->
你可以使用 `kubectl rollout status` 监视 Deployment 的进度。

<!--
### Complete Deployment

Kubernetes marks a Deployment as _complete_ when it has the following characteristics:
-->
### 完成的 Deployment    {#complete-deployment}

当 Deployment 具有以下特征时，Kubernetes 将其标记为 _完成（Complete）_：

<!--
* All of the replicas associated with the Deployment have been updated to the latest version you've specified, meaning any
updates you've requested have been completed.
* All of the replicas associated with the Deployment are available.
* No old replicas for the Deployment are running.
-->
* 与 Deployment 关联的所有副本都已更新到指定的最新版本，这意味着之前请求的所有更新都已完成。
* 与 Deployment 关联的所有副本都可用。
* 未运行 Deployment 的旧副本。

<!--
You can check if a Deployment has completed by using `kubectl rollout status`. If the rollout completed
successfully, `kubectl rollout status` returns a zero exit code.
-->
你可以使用 `kubectl rollout status` 检查 Deployment 是否已完成。
如果上线成功完成，`kubectl rollout status` 返回退出代码 0。

```shell
kubectl rollout status deployment/nginx-deployment
```

<!-- The output is similar to this: -->
输出类似于：

```shell
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment "nginx-deployment" successfully rolled out
$ echo $?
0
```

<!--
### Failed Deployment
-->
### 失败的 Deployment   {#failed-deployment}

<!--
Your Deployment may get stuck trying to deploy its newest ReplicaSet without ever completing. This can occur
due to some of the following factors:
-->
你的 Deployment 可能会在尝试部署其最新的 ReplicaSet 受挫，一直处于未完成状态。
造成此情况一些可能因素如下：

<!--
 * Insufficient quota
* Readiness probe failures
* Image pull errors
* Insufficient permissions
* Limit ranges
* Application runtime misconfiguration
-->
* 配额（Quota）不足
* 就绪探测（Readiness Probe）失败
* 镜像拉取错误
* 权限不足
* 限制范围（Limit Ranges）问题
* 应用程序运行时的配置错误

<!--
One way you can detect this condition is to specify a deadline parameter in your Deployment spec:
([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `.spec.progressDeadlineSeconds` denotes the
number of seconds the Deployment controller waits before indicating (in the Deployment status) that the
Deployment progress has stalled.
-->
检测此状况的一种方法是在 Deployment 规约中指定截止时间参数：
（[`.spec.progressDeadlineSeconds`]（#progress-deadline-seconds））。
`.spec.progressDeadlineSeconds` 给出的是一个秒数值，Deployment 控制器在（通过 Deployment 状态）
标示 Deployment 进展停滞之前，需要等待所给的时长。

<!--
The following `kubectl` command sets the spec with `progressDeadlineSeconds` to make the controller report
lack of progress for a Deployment after 10 minutes:
-->
以下 `kubectl` 命令设置规约中的 `progressDeadlineSeconds`，从而告知控制器
在 10 分钟后报告 Deployment 没有进展：

```shell
kubectl patch deployment.v1.apps/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```

<!-- The output is similar to this: -->
输出类似于：

```
deployment.apps/nginx-deployment patched
```

<!--
Once the deadline has been exceeded, the Deployment controller adds a DeploymentCondition with the following
attributes to the Deployment's `.status.conditions`:
-->
超过截止时间后，Deployment 控制器将添加具有以下属性的 DeploymentCondition 到
Deployment 的 `.status.conditions` 中：

* Type=Progressing
* Status=False
* Reason=ProgressDeadlineExceeded

<!--
See the [Kubernetes API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) for more information on status conditions.
-->
参考
[Kubernetes API 约定](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties)
获取更多状态状况相关的信息。

<!--
 Kubernetes takes no action on a stalled Deployment other than to report a status condition with
`Reason=ProgressDeadlineExceeded`. Higher level orchestrators can take advantage of it and act accordingly, for
example, rollback the Deployment to its previous version.

If you pause a Deployment, Kubernetes does not check progress against your specified deadline. You can
safely pause a Deployment in the middle of a rollout and resume without triggering the condition for
exceeding the deadline.
-->
{{< note >}}
除了报告 `Reason=ProgressDeadlineExceeded` 状态之外，Kubernetes 对已停止的
Deployment 不执行任何操作。更高级别的编排器可以利用这一设计并相应地采取行动。
例如，将 Deployment 回滚到其以前的版本。

如果你暂停了某个 Deployment，Kubernetes 不再根据指定的截止时间检查 Deployment 进展。
你可以在上线过程中间安全地暂停 Deployment 再恢复其执行，这样做不会导致超出最后时限的问题。
{{< /note >}}

<!--
You may experience transient errors with your Deployments, either due to a low timeout that you have set or
due to any other kind of error that can be treated as transient. For example, let's suppose you have
insufficient quota. If you describe the Deployment you will notice the following section:
-->
Deployment 可能会出现瞬时性的错误，可能因为设置的超时时间过短，
也可能因为其他可认为是临时性的问题。例如，假定所遇到的问题是配额不足。
如果描述 Deployment，你将会注意到以下部分：

```shell
kubectl describe deployment nginx-deployment
```

<!-- The output is similar to this: -->
输出类似于：

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
如果运行 `kubectl get deployment nginx-deployment -o yaml`，Deployment 状态输出
将类似于这样：

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
最终，一旦超过 Deployment 进度限期，Kubernetes 将更新状态和进度状况的原因：

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
可以通过缩容 Deployment 或者缩容其他运行状态的控制器，或者直接在命名空间中增加配额
来解决配额不足的问题。如果配额条件满足，Deployment 控制器完成了 Deployment 上线操作，
Deployment 状态会更新为成功状况（`Status=True` and `Reason=NewReplicaSetAvailable`）。

```
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
```

<!--
`Type=Available` with `Status=True` means that your Deployment has minimum availability. Minimum availability is dictated
by the parameters specified in the deployment strategy. `Type=Progressing` with `Status=True` means that your Deployment
is either in the middle of a rollout and it is progressing or that it has successfully completed its progress and the minimum
required new replicas are available (see the Reason of the condition for the particulars - in our case
`Reason=NewReplicaSetAvailable` means that the Deployment is complete).
-->
`Type=Available` 加上 `Status=True` 意味着 Deployment 具有最低可用性。
最低可用性由 Deployment 策略中的参数指定。
`Type=Progressing` 加上 `Status=True` 表示 Deployment 处于上线过程中，并且正在运行，
或者已成功完成进度，最小所需新副本处于可用。
请参阅对应状况的 Reason 了解相关细节。
在我们的案例中 `Reason=NewReplicaSetAvailable` 表示 Deployment 已完成。

<!--
You can check if a Deployment has failed to progress by using `kubectl rollout status`. `kubectl rollout status`
returns a non-zero exit code if the Deployment has exceeded the progression deadline.
-->
你可以使用 `kubectl rollout status` 检查 Deployment 是否未能取得进展。
如果 Deployment 已超过进度限期，`kubectl rollout status` 返回非零退出代码。

```shell
kubectl rollout status deployment/nginx-deployment
```

<!--
The output is similar to this:
-->
输出类似于：

```
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
```
<!--
and the exit status from `kubectl rollout` is 1 (indicating an error):
-->
`kubectl rollout` 命令的退出状态为 1（表明发生了错误）：

```shell
$ echo $?
```
```
1
```

<!--
### Operating on a failed deployment

All actions that apply to a complete Deployment also apply to a failed Deployment. You can scale it up/down,
roll back to a previous revision, or even pause it if you need to apply multiple tweaks in the Deployment
Pod template.
-->
### 对失败 Deployment 的操作   {#operating-on-a-failed-deployment}

可应用于已完成的 Deployment 的所有操作也适用于失败的 Deployment。
你可以对其执行扩缩容、回滚到以前的修订版本等操作，或者在需要对 Deployment 的
Pod 模板应用多项调整时，将 Deployment 暂停。

<!--
## Clean up Policy

You can set `.spec.revisionHistoryLimit` field in a Deployment to specify how many old ReplicaSets for
this Deployment you want to retain. The rest will be garbage-collected in the background. By default,
it is 10.
-->
## 清理策略   {#clean-up-policy}

你可以在 Deployment 中设置 `.spec.revisionHistoryLimit` 字段以指定保留此
Deployment 的多少个旧有 ReplicaSet。其余的 ReplicaSet 将在后台被垃圾回收。
默认情况下，此值为 10。

<!--
 Explicitly setting this field to 0, will result in cleaning up all the history of your Deployment
thus that Deployment will not be able to roll back.
-->
{{< note >}}
显式将此字段设置为 0 将导致 Deployment 的所有历史记录被清空，因此 Deployment 将无法回滚。
{{< /note >}}

<!--
## Canary Deployment

If you want to roll out releases to a subset of users or servers using the Deployment, you
can create multiple Deployments, one for each release, following the canary pattern described in
[managing resources](/docs/concepts/cluster-administration/manage-deployment/#canary-deployments).
-->
## 金丝雀部署 {#canary-deployment}

如果要使用 Deployment 向用户子集或服务器子集上线版本，则可以遵循
[资源管理](/zh/docs/concepts/cluster-administration/manage-deployment/#canary-deployments)
所描述的金丝雀模式，创建多个 Deployment，每个版本一个。

<!--
## Writing a Deployment Spec

As with all other Kubernetes configs, a Deployment needs `apiVersion`, `kind`, and `metadata` fields.
For general information about working with config files, see [deploying applications](/docs/tutorials/stateless-application/run-stateless-application-deployment/),
configuring containers, and [using kubectl to manage resources](/docs/concepts/overview/working-with-objects/object-management/) documents.
-->
## 编写 Deployment 规约       {#writing-a-deployment-spec}

同其他 Kubernetes 配置一样， Deployment 需要 `apiVersion`，`kind` 和 `metadata` 字段。
有关配置文件的其他信息，请参考
[部署 Deployment ](/zh/docs/tasks/run-application/run-stateless-application-deployment/)、配置容器和
[使用 kubectl 管理资源](/zh/docs/concepts/overview/working-with-objects/object-management/)等相关文档。

<!--
The name of a Deployment object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

A Deployment also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
-->
Deployment 对象的名称必须是合法的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)。
Deployment 还需要 [`.spec` 部分](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。

<!--
### Pod Template

The `.spec.template` and `.spec.selector` are the only required field of the `.spec`.
-->
### Pod 模板     {#pod-template}

`.spec` 中只有 `.spec.template` 和 `.spec.selector` 是必需的字段。

<!--
 The `.spec.template` is a [Pod template](/docs/concepts/workloads/pods/pod-overview/#pod-templates). It has exactly the same schema as a [Pod](/docs/concepts/workloads/pods/pod/), except it is nested and does not have an
`apiVersion` or `kind`.
-->
`.spec.template` 是一个 [Pod 模板](/zh/docs/concepts/workloads/pods/#pod-templates)。
它和 {{< glossary_tooltip text="Pod" term_id="pod" >}} 的语法规则完全相同。
只是这里它是嵌套的，因此不需要 `apiVersion` 或 `kind`。

<!--
In addition to required fields for a Pod, a Pod template in a Deployment must specify appropriate
labels and an appropriate restart policy. For labels, make sure not to overlap with other controllers. See [selector](#selector)).
-->
除了 Pod 的必填字段外，Deployment 中的 Pod 模板必须指定适当的标签和适当的重新启动策略。
对于标签，请确保不要与其他控制器重叠。请参考[选择算符](#selector)。

<!--
Only a [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) equal to `Always` is
allowed, which is the default if not specified.
-->
只有 [`.spec.template.spec.restartPolicy`](/zh/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)
等于 `Always` 才是被允许的，这也是在没有指定时的默认设置。

<!--
### Replicas

`.spec.replicas` is an optional field that specifies the number of desired Pods. It defaults to 1.
-->
### 副本   {#replicas}

`.spec.replicas` 是指定所需 Pod 的可选字段。它的默认值是1。

<!--
### Selector

`.spec.selector` is an required field that specifies a [label selector](/docs/concepts/overview/working-with-objects/labels/)
for the Pods targeted by this Deployment.

`.spec.selector` must match `.spec.template.metadata.labels`, or it will be rejected by the API.
-->
### 选择算符   {#selector}

`.spec.selector` 是指定本 Deployment 的 Pod
[标签选择算符](/zh/docs/concepts/overview/working-with-objects/labels/)的必需字段。

`.spec.selector` 必须匹配 `.spec.template.metadata.labels`，否则请求会被 API 拒绝。

<!--
 In API version `apps/v1`, `.spec.selector` and `.metadata.labels` do not default to `.spec.template.metadata.labels` if not set. So they must be set explicitly. Also note that `.spec.selector` is immutable after creation of the Deployment in `apps/v1`.
-->
在 API `apps/v1`版本中，`.spec.selector` 和 `.metadata.labels` 如果没有设置的话，
不会被默认设置为 `.spec.template.metadata.labels`，所以需要明确进行设置。
同时在 `apps/v1`版本中，Deployment 创建后 `.spec.selector` 是不可变的。

<!--
A Deployment may terminate Pods whose labels match the selector if their template is different
from `.spec.template` or if the total number of such Pods exceeds `.spec.replicas`. It brings up new
Pods with `.spec.template` if the number of Pods is less than the desired number.
-->
当 Pod 的标签和选择算符匹配，但其模板和 `.spec.template` 不同时，或者此类 Pod
的总数超过 `.spec.replicas` 的设置时，Deployment 会终结之。
如果 Pods 总数未达到期望值，Deployment 会基于 `.spec.template` 创建新的 Pod。

<!--
You should not create other Pods whose labels match this selector, either directly, by creating
another Deployment, or by creating another controller such as a ReplicaSet or a ReplicationController. If you
do so, the first Deployment thinks that it created these other Pods. Kubernetes does not stop you from doing this.
-->
{{< note >}}
你不应直接创建、或者通过创建另一个 Deployment，或者创建类似 ReplicaSet
或 ReplicationController 这类控制器来创建标签与此选择算符匹配的 Pod。
如果这样做，第一个 Deployment 会认为它创建了这些 Pod。
Kubernetes 不会阻止你这么做。
{{< /note >}}

<!--
If you have multiple controllers that have overlapping selectors, the controllers will fight with each
other and won't behave correctly.
-->
如果有多个控制器的选择算符发生重叠，则控制器之间会因冲突而无法正常工作。

<!--
### Strategy

`.spec.strategy` specifies the strategy used to replace old Pods by new ones.
`.spec.strategy.type` can be "Recreate" or "RollingUpdate". "RollingUpdate" is
the default value.
-->
### 策略   {#strategy}

`.spec.strategy` 策略指定用于用新 Pods 替换旧 Pods 的策略。
`.spec.strategy.type` 可以是 “Recreate” 或 “RollingUpdate”。“RollingUpdate” 是默认值。

<!--
#### Recreate Deployment

All existing Pods are killed before new ones are created when `.spec.strategy.type==Recreate`.
-->
#### 重新创建 Deployment   {#recreate-deployment}

如果 `.spec.strategy.type==Recreate`，在创建新 Pods 之前，所有现有的 Pods 会被杀死。

<!--
#### Rolling Update Deployment

The Deployment updates Pods in a rolling update
fashion when `.spec.strategy.type==RollingUpdate`. You can specify `maxUnavailable` and `maxSurge` to control
the rolling update process.
-->
#### 滚动更新 Deployment   {#rolling-update-deployment}

Deployment 会在 `.spec.strategy.type==RollingUpdate`时，采取
滚动更新的方式更新 Pods。你可以指定 `maxUnavailable` 和 `maxSurge` 来控制滚动更新
过程。

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
`.spec.strategy.rollingUpdate.maxUnavailable` 是一个可选字段，用来指定
更新过程中不可用的 Pod 的个数上限。该值可以是绝对数字（例如，5），也可以是
所需 Pods 的百分比（例如，10%）。百分比值会转换成绝对数并去除小数部分。
如果 `.spec.strategy.rollingUpdate.maxSurge` 为 0，则此值不能为 0。
默认值为 25%。

<!--
For example, when this value is set to 30%, the old ReplicaSet can be scaled down to 70% of desired
Pods immediately when the rolling update starts. Once new Pods are ready, old ReplicaSet can be scaled
down further, followed by scaling up the new ReplicaSet, ensuring that the total number of Pods available
at all times during the update is at least 70% of the desired Pods.
-->
例如，当此值设置为 30% 时，滚动更新开始时会立即将旧 ReplicaSet 缩容到期望 Pod 个数的70%。
新 Pod 准备就绪后，可以继续缩容旧有的 ReplicaSet，然后对新的 ReplicaSet 扩容，确保在更新期间
可用的 Pods 总数在任何时候都至少为所需的 Pod 个数的 70%。

<!--
##### Max Surge

 `.spec.strategy.rollingUpdate.maxSurge` is an optional field that specifies the maximum number of Pods
that can be created over the desired number of Pods. The value can be an absolute number (for example, 5) or a
percentage of desired Pods (for example, 10%). The value cannot be 0 if `MaxUnavailable` is 0. The absolute number
is calculated from the percentage by rounding up. The default value is 25%.
-->
##### 最大峰值   {#max-surge}

`.spec.strategy.rollingUpdate.maxSurge` 是一个可选字段，用来指定可以创建的超出
期望 Pod 个数的 Pod 数量。此值可以是绝对数（例如，5）或所需 Pods 的百分比（例如，10%）。
如果 `MaxUnavailable` 为 0，则此值不能为 0。百分比值会通过向上取整转换为绝对数。
此字段的默认值为 25%。

<!--
For example, when this value is set to 30%, the new ReplicaSet can be scaled up immediately when the
rolling update starts, such that the total number of old and new Pods does not exceed 130% of desired
Pods. Once old Pods have been killed, the new ReplicaSet can be scaled up further, ensuring that the
total number of Pods running at any time during the update is at most 130% of desired Pods.
-->
例如，当此值为 30% 时，启动滚动更新后，会立即对新的 ReplicaSet 扩容，同时保证新旧 Pod
的总数不超过所需 Pod 总数的 130%。一旦旧 Pods 被杀死，新的 ReplicaSet 可以进一步扩容，
同时确保更新期间的任何时候运行中的 Pods 总数最多为所需 Pods 总数的 130%。

<!--
 ### Progress Deadline Seconds

 `.spec.progressDeadlineSeconds` is an optional field that specifies the number of seconds you want
to wait for your Deployment to progress before the system reports back that the Deployment has
[failed progressing](#failed-deployment) - surfaced as a condition with `Type=Progressing`, `Status=False`.
and `Reason=ProgressDeadlineExceeded` in the status of the resource. The Deployment controller will keep
retrying the Deployment. In the future, once automatic rollback will be implemented, the Deployment
controller will roll back a Deployment as soon as it observes such a condition.
-->
### 进度期限秒数    {#progress-deadline-seconds}
 
`.spec.progressDeadlineSeconds` 是一个可选字段，用于指定系统在报告 Deployment
[进展失败](#failed-deployment) 之前等待 Deployment 取得进展的秒数。
这类报告会在资源状态中体现为 `Type=Progressing`、`Status=False`、
`Reason=ProgressDeadlineExceeded`。Deployment 控制器将持续重试 Deployment。
将来，一旦实现了自动回滚，Deployment 控制器将在探测到这样的条件时立即回滚 Deployment。

<!--
If specified, this field needs to be greater than `.spec.minReadySeconds`.
-->
如果指定，则此字段值需要大于 `.spec.minReadySeconds` 取值。

<!--
### Min Ready Seconds

 `.spec.minReadySeconds` is an optional field that specifies the minimum number of seconds for which a newly
created Pod should be ready without any of its containers crashing, for it to be considered available.
This defaults to 0 (the Pod will be considered available as soon as it is ready). To learn more about when
a Pod is considered ready, see [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).
-->
### 最短就绪时间    {#min-ready-seconds}

`.spec.minReadySeconds` 是一个可选字段，用于指定新创建的 Pod 在没有任意容器崩溃情况下的最小就绪时间，
只有超出这个时间 Pod 才被视为可用。默认值为 0（Pod 在准备就绪后立即将被视为可用）。
要了解何时 Pod 被视为就绪，可参考[容器探针](/zh/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。

<!--
### Revision History Limit

A Deployment's revision history is stored in the ReplicaSets it controls.
-->
### 修订历史限制

Deployment 的修订历史记录存储在它所控制的 ReplicaSets 中。

<!--
`.spec.revisionHistoryLimit` is an optional field that specifies the number of old ReplicaSets to retain
to allow rollback. These old ReplicaSets consume resources in `etcd` and crowd the output of `kubectl get rs`. The configuration of each Deployment revision is stored in its ReplicaSets; therefore, once an old ReplicaSet is deleted, you lose the ability to rollback to that revision of Deployment. By default, 10 old ReplicaSets will be kept, however its ideal value depends on the frequency and stability of new Deployments.
-->
`.spec.revisionHistoryLimit` 是一个可选字段，用来设定出于会滚目的所要保留的旧 ReplicaSet 数量。
这些旧 ReplicaSet 会消耗 etcd 中的资源，并占用 `kubectl get rs` 的输出。
每个 Deployment 修订版本的配置都存储在其 ReplicaSets 中；因此，一旦删除了旧的 ReplicaSet，
将失去回滚到 Deployment 的对应修订版本的能力。
默认情况下，系统保留 10 个旧 ReplicaSet，但其理想值取决于新 Deployment 的频率和稳定性。

<!--
More specifically, setting this field to zero means that all old ReplicaSets with 0 replicas will be cleaned up.
In this case, a new Deployment rollout cannot be undone, since its revision history is cleaned up.
-->
更具体地说，将此字段设置为 0 意味着将清理所有具有 0 个副本的旧 ReplicaSet。
在这种情况下，无法撤消新的 Deployment 上线，因为它的修订历史被清除了。

<!--
### Paused

`.spec.paused` is an optional boolean field for pausing and resuming a Deployment. The only difference between
a paused Deployment and one that is not paused, is that any changes into the PodTemplateSpec of the paused
Deployment will not trigger new rollouts as long as it is paused. A Deployment is not paused by default when
it is created.
-->
### paused（暂停的）  {#paused}

`.spec.paused` 是用于暂停和恢复 Deployment 的可选布尔字段。
暂停的 Deployment 和未暂停的 Deployment 的唯一区别是，Deployment 处于暂停状态时，
PodTemplateSpec 的任何修改都不会触发新的上线。
Deployment 在创建时是默认不会处于暂停状态。
