---
reviewers:
- janetkuo
title: Deployments
feature:
  <!-- title: Automated rollouts and rollbacks -->
  title: 自动化展开和回滚
  description: >
    <!-- Kubernetes progressively rolls out changes to your application or its configuration, while monitoring application health to ensure it doesn't kill all your instances at the same time. If something goes wrong, Kubernetes will rollback the change for you. Take advantage of a growing ecosystem of deployment solutions. -->
    Kubernetes 会逐步推出针对应用或其配置的更改，确保在监视应用程序运行状况的同时，不会终止所有实例。如果出现问题，Kubernetes 会为您回滚更改。充分利用不断成长的部署解决方案生态系统。

content_type: concept
weight: 30
---

<!-- overview -->

<!--

A _Deployment_ controller provides declarative updates for [Pods](/docs/concepts/workloads/pods/pod/) and
[ReplicaSets](/docs/concepts/workloads/controllers/replicaset/).

-->
一个 _Deployment_ 控制器为 [Pods](/docs/concepts/workloads/pods/pod/)和 [ReplicaSets](/docs/concepts/workloads/controllers/replicaset/)提供描述性的更新方式。

<!--

You describe a _desired state_ in a Deployment, and the Deployment controller changes the actual state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove existing Deployments and adopt all their resources with new Deployments.

-->
描述 Deployment 中的 _desired state_，并且 Deployment 控制器以受控速率更改实际状态，以达到期望状态。可以定义 Deployments 以创建新的 ReplicaSets ，或删除现有 Deployments ，并通过新的 Deployments 使用其所有资源。

{{< note >}}
<!--

Do not manage ReplicaSets owned by a Deployment. Consider opening an issue in the main Kubernetes repository if your use case is not covered below.

-->
不要管理 Deployment 拥有的 ReplicaSets 。如果存在下面未介绍的用例，请考虑在主 Kubernetes 仓库中提出 issue。

{{< /note >}}



<!-- body -->

<!--

## Use Case

-->
## 用例

<!--

The following are typical use cases for Deployments:

-->
以下是典型的 Deployments 用例：

<!--

* [Create a Deployment to rollout a ReplicaSet](#creating-a-deployment). The ReplicaSet creates Pods in the background. Check the status of the rollout to see if it succeeds or not.

-->
* [创建 Deployment 以展开 ReplicaSet ](#creating-a-deployment)。 ReplicaSet 在后台创建 Pods。检查 ReplicaSet 展开的状态，查看其是否成功。

<!--

* [Declare the new state of the Pods](#updating-a-deployment) by updating the PodTemplateSpec of the Deployment. A new ReplicaSet is created and the Deployment manages moving the Pods from the old ReplicaSet to the new one at a controlled rate. Each new ReplicaSet updates the revision of the Deployment.

-->
* [声明 Pod 的新状态](#updating-a-deployment) 通过更新 Deployment 的 PodTemplateSpec。将创建新的 ReplicaSet ，并且 Deployment 管理器以受控速率将 Pod 从旧 ReplicaSet 移动到新 ReplicaSet 。每个新的 ReplicaSet 都会更新 Deployment 的修改历史。

<!--

* [Rollback to an earlier Deployment revision](#rolling-back-a-deployment) if the current state of the Deployment is not stable. Each rollback updates the revision of the Deployment.

-->
* [回滚到较早的 Deployment 版本](#rolling-back-a-deployment)，如果 Deployment 的当前状态不稳定。每次回滚都会更新 Deployment 的修改。

<!--

* [Scale up the Deployment to facilitate more load](#scaling-a-deployment).

-->
* [扩展 Deployment 以承担更多负载](#scaling-a-deployment).

<!--

 * [Pause the Deployment](#pausing-and-resuming-a-deployment) to apply multiple fixes to its PodTemplateSpec and then resume it to start a new rollout.

-->
* [暂停 Deployment ](#pausing-and-resuming-a-deployment) 对其 PodTemplateSpec 进行修改，然后恢复它以启动新的展开。

<!--

 * [Use the status of the Deployment](#deployment-status) as an indicator that a rollout has stuck.
-->
* [使用 Deployment 状态](#deployment-status) 作为卡住展开的指示器。

<!--

 * [Clean up older ReplicaSets](#clean-up-policy) that you don't need anymore.

-->
* [清理较旧的 ReplicaSets ](#clean-up-policy) ，那些不再需要的。

<!--
 ## Creating a Deployment
-->
## 创建 Deployment

<!--

The following is an example of a Deployment. It creates a ReplicaSet to bring up three `nginx` Pods:

-->
下面是 Deployment 示例。创建一个 ReplicaSet 展开三个 `nginx` Pods：

{{< codenew file="controllers/nginx-deployment.yaml" >}}

<!--
 In this example:
-->
在该例中：

<!--
 * A Deployment named `nginx-deployment` is created, indicated by the `.metadata.name` field.
-->
* 将创建名为 `nginx-deployment` 的 Deployment ，由 `.metadata.name` 字段指示。

<!--
 * The Deployment creates three replicated Pods, indicated by the `replicas` field.
-->
*  Deployment 创建三个复制的 Pods，由 `replicas` 字段指示。

<!--
 * The `selector` field defines how the Deployment finds which Pods to manage.
  In this case, you simply select a label that is defined in the Pod template (`app: nginx`).
  However, more sophisticated selection rules are possible,
  as long as the Pod template itself satisfies the rule.
-->
* `selector` 字段定义 Deployment 如何查找要管理的 Pods。
  在这种情况下，只需选择在 Pod 模板（`app: nginx`）中定义的标签。但是，更复杂的选择规则是可能的，只要 Pod 模板本身满足规则。

  {{< note >}}

  <!--
   The `matchLabels` field is a map of {key,value} pairs. A single {key,value} in the `matchLabels` map
    is equivalent to an element of `matchExpressions`, whose key field is "key" the operator is "In",
    and the values array contains only "value".
    All of the requirements, from both `matchLabels` and `matchExpressions`, must be satisfied in order to match.
  -->
    `matchLabels` 字段是 {key,value} 的映射。单个 {key,value}在 `matchLabels` 映射中的值等效于 `matchExpressions` 的元素，其键字段是“key”，运算符为“In”，值数组仅包含“value”。所有要求，从 `matchLabels` 和 `matchExpressions`，必须满足才能匹配。
  {{< /note >}}

<!--
 * The `template` field contains the following sub-fields:
-->
* `template` 字段包含以下子字段：

<!--
 * The Pods are labeled `app: nginx`using the `labels` field.
-->
  * Pod 标记为`app: nginx`，使用`labels`字段。

  <!--
   * The Pod template's specification, or `.template.spec` field, indicates that
    the Pods run one container, `nginx`, which runs the `nginx`
    [Docker Hub](https://hub.docker.com/) image at version 1.7.9.
  -->
  * Pod 模板规范或 `.template.spec` 字段指示 Pods 运行一个容器， `nginx`，运行 `nginx` [Docker Hub](https://hub.docker.com/)版本1.7.9的镜像 。

  <!--
   * Create one container and name it `nginx` using the `name` field.
  -->
  * 创建一个容器并使用`name`字段将其命名为 `nginx`。

<!--
 Follow the steps given below to create the above Deployment:
-->
按照以下步骤创建上述 Deployment ：

<!--
 Before you begin, make sure your Kubernetes cluster is up and running.
-->
开始之前，请确保的 Kubernetes 集群已启动并运行。

<!--
 1. Create the Deployment by running the following command:
-->
1. 通过运行以下命令创建 Deployment ：

    {{< note >}}
    <!--
    You may specify the `--record` flag to write the command executed in the resource annotation `kubernetes.io/change-cause`. It is useful for future introspection.
    -->
      可以指定 `--record` 标志来写入在资源注释`kubernetes.io/change-cause`中执行的命令。它对以后的检查是有用的。
    <!--
    For example, to see the commands executed in each Deployment revision.
    -->
      例如，查看在每个 Deployment 修改中执行的命令。
    {{< /note >}}

    ```shell
    kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml
    ```

<!--
 2. Run `kubectl get deployments` to check if the Deployment was created. If the Deployment is still being created, the output is similar to the following:
-->
2. 运行 `kubectl get deployments` 以检查 Deployment 是否已创建。如果仍在创建 Deployment ，则输出以下内容：

    ```shell
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3         0         0            0           1s
    ```

    <!--
    When you inspect the Deployments in your cluster, the following fields are displayed:
    -->
    检查集群中的 Deployments 时，将显示以下字段：

    <!--
    * `NAME` lists the names of the Deployments in the cluster.
        * `DESIRED` displays the desired number of _replicas_ of the application, which you define when you create the Deployment. This is the _desired state_.
        * `CURRENT` displays how many replicas are currently running.
        * `UP-TO-DATE` displays the number of replicas that have been updated to achieve the desired state.
        * `AVAILABLE` displays how many replicas of the application are available to your users.
        * `AGE` displays the amount of time that the application has been running.
    -->
    * `NAME` 列出了集群中 Deployments 的名称。
    * `DESIRED` 显示应用程序的所需 _副本_ 数，在创建 Deployment 时定义这些副本。这是 _期望状态_。
    * `CURRENT`显示当前正在运行的副本数。
    * `UP-TO-DATE`显示已更新以实现期望状态的副本数。
    * `AVAILABLE`显示应用程序可供用户使用的副本数。
    * `AGE` 显示应用程序运行的时间量。

    <!--
    Notice how the number of desired replicas is 3 according to `.spec.replicas` field.
    -->
    请注意，根据`.spec.replicas`副本字段，所需副本的数量为 3。

<!--
 3. To see the Deployment rollout status, run `kubectl rollout status deployment.v1.apps/nginx-deployment`. The output is similar to this:
-->
3. 要查看 Deployment 展开状态，运行 `kubectl rollout status deployment.v1.apps/nginx-deployment`。输出：

    ```shell
    Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
    deployment.apps/nginx-deployment successfully rolled out
    ```

<!--
 4. Run the `kubectl get deployments` again a few seconds later. The output is similar to this:
-->
4. 几秒钟后再次运行 `kubectl get deployments`。输出：

    ```shell
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3         3         3            3           18s
    ```
    <!--
    Notice that the Deployment has created all three replicas, and all replicas are up-to-date (they contain the latest Pod template) and available.
    -->
    请注意， Deployment 已创建所有三个副本，并且所有副本都是最新的（它们包含最新的 Pod 模板）并且可用。

<!--
 5. To see the ReplicaSet (`rs`) created by the Deployment, run `kubectl get rs`. The output is similar to this:
-->
5. 要查看 Deployment 创建的 ReplicaSet  （`rs`），运行 `kubectl get rs`。输出：

    ```shell
    NAME                          DESIRED   CURRENT   READY   AGE
    nginx-deployment-75675f5897   3         3         3       18s
    ```
    <!--
    Notice that the name of the ReplicaSet is always formatted as `[DEPLOYMENT-NAME]-[RANDOM-STRING]`. The random string is
            randomly generated and uses the pod-template-hash as a seed.
    -->
    请注意， ReplicaSet 的名称始终被格式化为`[DEPLOYMENT-NAME]-[RANDOM-STRING]`。随机字符串是随机生成并使用 pod-template-hash 作为种子。

<!--
 6. To see the labels automatically generated for each Pod, run `kubectl get pods --show-labels`. The following output is returned:
-->
6. 要查看每个 Pod 自动生成的标签，运行 `kubectl get pods --show-labels`。返回以下输出：

    ```shell
    NAME                                READY     STATUS    RESTARTS   AGE       LABELS
    nginx-deployment-75675f5897-7ci7o   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
    nginx-deployment-75675f5897-kzszj   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
    nginx-deployment-75675f5897-qqcnn   1/1       Running   0          18s       app=nginx,pod-template-hash=3123191453
    ```

    <!--
    The created ReplicaSet ensures that there are three `nginx` Pods.
    -->
    创建的复制集可确保有三个 `nginx` Pods。

{{< note >}}
<!--
 You must specify an appropriate selector and Pod template labels in a Deployment (in this case,
  `app: nginx`). Do not overlap labels or selectors with other controllers (including other Deployments and StatefulSets). Kubernetes doesn't stop you from overlapping, and if multiple controllers have overlapping selectors those controllers might conflict and behave unexpectedly.
-->
  必须在 Deployment 中指定适当的选择器和 Pod 模板标签（在本例中为`app: nginx`）。不要与其他控制器（包括其他 Deployments 和状态设置）重叠标签或选择器。Kubernetes 不会阻止重叠，如果多个控制器具有重叠的选择器，这些控制器可能会冲突并运行意外。
{{< /note >}}

<!--
 ### Pod-template-hash label
-->
### Pod-template-hash 标签

{{< note >}}
<!--
 Do not change this label.
-->
不要更改此标签。
{{< /note >}}

<!--
 The `pod-template-hash` label is added by the Deployment controller to every ReplicaSet that a Deployment creates or adopts.
-->
 Deployment 控制器将 `pod-template-hash` 标签添加到 Deployment 创建或使用的每个 ReplicaSet 。

<!--
 This label ensures that child ReplicaSets of a Deployment do not overlap. It is generated by hashing the `PodTemplate` of the ReplicaSet and using the resulting hash as the label value that is added to the ReplicaSet selector, Pod template labels,
and in any existing Pods that the ReplicaSet might have.
-->
此标签可确保 Deployment 的子 ReplicaSets 不重叠。它通过对 ReplicaSet 的 `PodTemplate` 进行哈希处理，并使用生成的哈希值添加到 ReplicaSet 选择器、Pod 模板标签,并在 ReplicaSet 可能具有的任何现有 Pod 中。

<!--
 ## Updating a Deployment
-->
## 更新 Deployment

{{< note >}}
<!--
 A Deployment's rollout is triggered if and only if the Deployment's Pod template (that is, `.spec.template`)
is changed, for example if the labels or container images of the template are updated. Other updates, such as scaling the Deployment, do not trigger a rollout.
-->
仅当 Deployment  Pod 模板（即 `.spec.template`）时，才会触发 Deployment 展开，例如，如果模板的标签或容器镜像已更新，其他更新（如扩展 Deployment ）不会触发展开。
{{< /note >}}

<!--
 Follow the steps given below to update your Deployment:
-->
按照以下步骤更新 Deployment ：

<!--
 1. Let's update the nginx Pods to use the `nginx:1.9.1` image instead of the `nginx:1.7.9` image.
-->
1. 让我们更新 nginx Pods，以使用 `nginx:1.9.1` 镜像 ，而不是 `nginx:1.7.9` 镜像 。

    ```shell
    kubectl --record deployment.apps/nginx-deployment set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    deployment.apps/nginx-deployment image updated
    ```

    <!--
    Alternatively, you can `edit` the Deployment and change `.spec.template.spec.containers[0].image` from `nginx:1.7.9` to `nginx:1.9.1`:
    -->
    或者，可以 `edit`  Deployment 并将 `.spec.template.spec.containers[0].image` 从 `nginx:1.7.9` 更改至 `nginx:1.9.1`。

    ```shell
    kubectl edit deployment.v1.apps/nginx-deployment
    ```

    <!--
    The output is similar to this:
    -->

    输出：

    ```shell
    deployment.apps/nginx-deployment edited
    ```

<!--
 2. To see the rollout status, run:
-->
2. 要查看展开状态，运行：

    ```shell
    kubectl rollout status deployment.v1.apps/nginx-deployment
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
    ```
    <!--
    or
    -->
    或者

    ```shell
    deployment.apps/nginx-deployment successfully rolled out
    ```

<!--
 Get more details on your updated Deployment:
-->
在更新后的 Deployment 上获取更多信息

<!--
 * After the rollout succeeds, you can view the Deployment by running `kubectl get deployments`.
    The output is similar to this:
-->
* 在展开成功后，可以通过运行 `kubectl get deployments`来查看 Deployment 。
    输出：

    ```shell
    NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    nginx-deployment   3         3         3            3           36s
    ```

<!--
 * Run `kubectl get rs` to see that the Deployment updated the Pods by creating a new ReplicaSet and scaling it
up to 3 replicas, as well as scaling down the old ReplicaSet to 0 replicas.
-->
* 运行 `kubectl get rs` 以查看 Deployment 通过创建新的 ReplicaSet 并缩放它更新了 Pods 最多 3 个副本，以及将旧 ReplicaSet 缩放到 0 个副本。

    ```shell
    kubectl get rs
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    NAME                          DESIRED   CURRENT   READY   AGE
    nginx-deployment-1564180365   3         3         3       6s
    nginx-deployment-2035384211   0         0         0       36s
    ```

<!--
 * Running `get pods` should now show only the new Pods:
-->
* 运行 `get pods` 现在应仅显示新的 Pods:

    ```shell
    kubectl get pods
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    NAME                                READY     STATUS    RESTARTS   AGE
    nginx-deployment-1564180365-khku8   1/1       Running   0          14s
    nginx-deployment-1564180365-nacti   1/1       Running   0          14s
    nginx-deployment-1564180365-z9gth   1/1       Running   0          14s
    ```

    <!--
    Next time you want to update these Pods, you only need to update the Deployment's Pod template again.
    -->
    下次要更新这些 Pods 时，只需再次更新 Deployment  Pod 模板。

    <!--
    Deployment ensures that only a certain number of Pods are down while they are being updated. By default,
        it ensures that at least 75% of the desired number of Pods are up (25% max unavailable).
    -->
     Deployment 可确保在更新时仅关闭一定数量的 Pods。默认情况下，它确保至少 75%所需 Pods 运行（25%最大不可用）。

    <!--
    Deployment also ensures that only a certain number of Pods are created above the desired number of Pods.
        By default, it ensures that at most 25% of the desired number of Pods are up (25% max surge).
    -->
     Deployment 还确保仅创建一定数量的 Pods 高于期望的 Pods 数。默认情况下，它可确保最多增加 25% 期望 Pods 数（25%最大增量）。

    <!--   
    For example, if you look at the above Deployment closely, you will see that it first created a new Pod,
        then deleted some old Pods, and created new ones. It does not kill old Pods until a sufficient number of
        new Pods have come up, and does not create new Pods until a sufficient number of old Pods have been killed.
        It makes sure that at least 2 Pods are available and that at max 4 Pods in total are available.
    -->
    例如，如果仔细查看上述 Deployment ，将看到它首先创建了一个新的 Pod，然后删除了一些旧的 Pods，并创建了新的 Pods。它不会杀死老 Pods，直到有足够的数量新的 Pods 已经出现，并没有创造新的 Pods，直到足够数量的旧 Pods 被杀死。它确保至少 2 个 Pods 可用，并且总共最多 4 个 Pods 可用。

<!--
 * Get details of your Deployment:
-->
* 获取 Deployment 的更多信息
  ```shell
  kubectl describe deployments
  ```
  <!--
    The output is similar to this:
  -->
  输出：

  ```shell
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
        Image:        nginx:1.9.1
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
    可以看到，当第一次创建 Deployment 时，它创建了一个 ReplicaSet  （nginx-deployment-2035384211）并将其直接扩展至 3 个副本。更新 Deployment 时，它创建了一个新的 ReplicaSet （nginx-deployment-1564180365），并将其扩展为 1，然后将旧 ReplicaSet 缩小到 2，以便至少有 2 个 Pod 可用，并且最多创建 4 个 Pod。然后，它继续向上和向下扩展新的和旧的 ReplicaSet ，具有相同的滚动更新策略。最后，将有 3 个可用的副本在新的 ReplicaSet 中，旧 ReplicaSet 将缩小到 0。

<!--
 ### Rollover (aka multiple updates in-flight)
-->
### 翻转（多 Deployment 动态更新）

<!--
 Each time a new Deployment is observed by the Deployment controller, a ReplicaSet is created to bring up
the desired Pods. If the Deployment is updated, the existing ReplicaSet that controls Pods whose labels
match `.spec.selector` but whose template does not match `.spec.template` are scaled down. Eventually, the new
ReplicaSet is scaled to `.spec.replicas` and all old ReplicaSets is scaled to 0.
-->
每次 Deployment 控制器观察新 Deployment 时，都会创建一个 ReplicaSet 以启动所需的 Pods。如果更新了 Deployment ，则控制其标签的 Pods 的现有 ReplicaSet 匹配 `.spec.selector`，但其模板不匹配 `.spec.template` 被缩小。最终，新的 ReplicaSet 缩放为 `.spec.replicas`，所有旧 ReplicaSets 缩放为 0。

<!--
 If you update a Deployment while an existing rollout is in progress, the Deployment creates a new ReplicaSet
as per the update and start scaling that up, and rolls over the ReplicaSet that it was scaling up previously
 -- it will add it to its list of old ReplicaSets and start scaling it down.
-->
当 Deployment 正在展开时进行更新， Deployment 会为每个更新创建一个新的 ReplicaSet 并开始向上扩展，之前的 ReplicaSet 会被添加到旧 ReplicaSets 队列并开始向下扩展。

<!--
 For example, suppose you create a Deployment to create 5 replicas of `nginx:1.7.9`,
but then update the Deployment to create 5 replicas of `nginx:1.9.1`, when only 3
replicas of `nginx:1.7.9` had been created. In that case, the Deployment immediately starts
killing the 3 `nginx:1.7.9` Pods that it had created, and starts creating
`nginx:1.9.1` Pods. It does not wait for the 5 replicas of `nginx:1.7.9` to be created
before changing course.
-->
例如，假设创建一个 Deployment 以创建 `nginx:1.7.9` 的 5 个副本，然后更新 Deployment 以创建 5 个 `nginx:1.9.1` 的副本，而此时只有 3 个`nginx:1.7.9` 的副本已创建。在这种情况下， Deployment 会立即开始杀死3个 `nginx:1.7.9` Pods，并开始创建 `nginx:1.9.1` Pods。它不等待 `nginx:1.7.9` 的 5 个副本在改变任务之前完成创建。

<!--
 ### Label selector updates
-->
### 使用标签选择器进行更新

<!--
 It is generally discouraged to make label selector updates and it is suggested to plan your selectors up front.
In any case, if you need to perform a label selector update, exercise great caution and make sure you have grasped
all of the implications.
-->
通常不鼓励更新标签选择器，建议提前规划选择器。在任何情况下，如果需要执行标签选择器更新，请格外小心，并确保已掌握所有的含义。

{{< note >}}
<!--
 In API version `apps/v1`, a Deployment's label selector is immutable after it gets created.
-->
在 API 版本 `apps/v1` 中， Deployment 标签选择器在创建后是不可变的。
{{< /note >}}

<!--
 * Selector additions require the Pod template labels in the Deployment spec to be updated with the new label too,
otherwise a validation error is returned. This change is a non-overlapping one, meaning that the new selector does
not select ReplicaSets and Pods created with the old selector, resulting in orphaning all old ReplicaSets and
creating a new ReplicaSet.
* Selector updates changes the existing value in a selector key -- result in the same behavior as additions.
* Selector removals removes an existing key from the Deployment selector -- do not require any changes in the
Pod template labels. Existing ReplicaSets are not orphaned, and a new ReplicaSet is not created, but note that the
removed label still exists in any existing Pods and ReplicaSets.
-->
* 选择器添加还需要使用新标签更新 Deployment 规范中的 Pod 模板标签，否则将返回验证错误。此更改是非重叠的，这意味着新的选择器不选择使用旧选择器创建的 ReplicaSets 和 Pod，从而导致弃用所有旧 ReplicaSets 和创建新的 ReplicaSet 。
* 选择器更新更改选择器键中的现有值 -- 导致发生与添加相同的行为。
* 选择器删除从 Deployment 选择器中删除现有密钥 -- 不需要在Pod 模板标签做任意更改。现有 ReplicaSets 不会孤立，并且不会创建新的 ReplicaSet ，但请注意，已删除的标签仍然存在于任何现有的 Pods 和 ReplicaSets 中。

<!--
 ## Rolling Back a Deployment
-->
## 回滚 Deployment

<!--
 Sometimes, you may want to rollback a Deployment; for example, when the Deployment is not stable, such as crash looping.
By default, all of the Deployment's rollout history is kept in the system so that you can rollback anytime you want
(you can change that by modifying revision history limit).
-->
有时，可能需要回滚 Deployment ；例如，当 Deployment 不稳定时，例如循环崩溃。默认情况下，所有 Deployment 历史记录都保留在系统中，以便可以随时回滚（可以通过修改修改历史记录限制来更改该限制）。

{{< note >}}
<!--
 A Deployment's revision is created when a Deployment's rollout is triggered. This means that the
new revision is created if and only if the Deployment's Pod template (`.spec.template`) is changed,
for example if you update the labels or container images of the template. Other updates, such as scaling the Deployment,
do not create a Deployment revision, so that you can facilitate simultaneous manual- or auto-scaling.
This means that when you roll back to an earlier revision, only the Deployment's Pod template part is
rolled back.
-->
触发 Deployment 展开时，将创建 Deployment 修改版。这意味着仅当 Deployment  Pod 模板 （`.spec.template`） 发生更改时，才会创建新修改版本，例如，如果更新模板的标签或容器镜像 。其他更新，如扩展 Deployment 、不要创建 Deployment 修改版，以便方便同时手动或自动缩放。这意味着，当回滚到较早的修改版时，只有 Deployment  Pod 模板部分回滚。
{{< /note >}}

<!--
 * Suppose that you made a typo while updating the Deployment, by putting the image name as `nginx:1.91` instead of `nginx:1.9.1`:
-->
* 假设在更新 Deployment 时犯了一个拼写错误，将镜像名称命名为 `nginx:1.91` 而不是 `nginx:1.9.1`：
    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.91 --record=true
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    deployment.apps/nginx-deployment image updated
    ```

<!--
 * The rollout gets stuck. You can verify it by checking the rollout status:
-->
* 展开遇到问题。可以通过检查展开状态来验证它：

    ```shell
    kubectl rollout status deployment.v1.apps/nginx-deployment
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    Waiting for rollout to finish: 1 out of 3 new replicas have been updated...
    ```

<!--
 * Press Ctrl-C to stop the above rollout status watch. For more information on stuck rollouts,
[read more here](#deployment-status).
-->
* 按 Ctrl-C 停止上述展开状态表。有关卡住展开的详细信息，[参考这里](#deployment-status)

<!--
 * You see that the number of old replicas (`nginx-deployment-1564180365` and `nginx-deployment-2035384211`) is 2, and new replicas (nginx-deployment-3066724191) is 1.
-->
<!--
 * You see that the number of old replicas
-->
* 查看旧 ReplicaSets ：
    ```shell
    kubectl get rs
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    NAME                          DESIRED   CURRENT   READY   AGE
    nginx-deployment-1564180365   3         3         3       25s
    nginx-deployment-2035384211   0         0         0       36s
    nginx-deployment-3066724191   1         1         0       6s
    ```

<!--
 * Looking at the Pods created, you see that 1 Pod created by new ReplicaSet is stuck in an image pull loop.
-->
* 查看创建的 Pod，看到由新 ReplicaSet 创建的 1 个 Pod 卡在镜像拉取循环中。

    ```shell
    kubectl get pods
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    NAME                                READY     STATUS             RESTARTS   AGE
    nginx-deployment-1564180365-70iae   1/1       Running            0          25s
    nginx-deployment-1564180365-jbqqo   1/1       Running            0          25s
    nginx-deployment-1564180365-hysrc   1/1       Running            0          25s
    nginx-deployment-3066724191-08mng   0/1       ImagePullBackOff   0          6s
    ```

    {{< note >}}
    <!--
    The Deployment controller stops the bad rollout automatically, and stops scaling up the new
        ReplicaSet. This depends on the rollingUpdate parameters (`maxUnavailable` specifically) that you have specified.
        Kubernetes by default sets the value to 25%.
    -->
    Deployment 控制器自动停止不良展开，并停止向上扩展新的 ReplicaSet 。这取决于指定的滚动更新参数（具体为 `maxUnavailable`）。默认情况下，Kubernetes 将值设置为 25%。
    {{< /note >}}

<!--
 * Get the description of the Deployment:
-->
* 获取 Deployment 描述信息：
    ```shell
    kubectl describe deployment
    ```

    <!--
    The output is similar to this:
    -->
    输出：

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
-->
### 检查 Deployment 展开历史

<!--
 Follow the steps given below to check the rollout history:
-->
按照如下步骤检查回滚历史：

<!--
 1. First, check the revisions of this Deployment:
-->
1. 首先，检查 Deployment 修改历史：

    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment
    ```
    <!--
    The output is similar to this:
    -->
    输出：

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
    `CHANGE-CAUSE` 从 Deployment 注释 `kubernetes.io/change-cause` 创建时复制到其修改版。可以通过以下条件指定 `CHANGE-CAUSE` 消息：

    <!--
    * Annotating the Deployment with `kubectl annotate deployment.v1.apps/nginx-deployment kubernetes.io/change-cause="image updated to 1.9.1"`
        * Append the `--record` flag to save the `kubectl` command that is making changes to the resource.
        * Manually editing the manifest of the resource.
    -->
    * 使用 `kubectl annotate deployment.v1.apps/nginx-deployment kubernetes.io/change-cause="image updated to 1.9.1"`  Deployment 对 Deployment 进行分号。
    * 追加 `--record` 以保存正在更改资源的 `kubectl` 命令。
    * 手动编辑资源的清单。

<!--
 2. To see the details of each revision, run:
-->
2. 查看修改历史的详细信息，运行：

    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment --revision=2
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    deployments "nginx-deployment" revision 2
      Labels:       app=nginx
              pod-template-hash=1159050644
      Annotations:  kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
      Containers:
       nginx:
        Image:      nginx:1.9.1
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
### 回滚到上一次修改

按照下面给出的步骤将 Deployment 从当前版本回滚到以前的版本（即版本 2）。

<!--
 1. Now you've decided to undo the current rollout and rollback to the previous revision:
-->
1. 现在已决定撤消当前展开并回滚到以前的版本：

    ```shell
    kubectl rollout undo deployment.v1.apps/nginx-deployment
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    deployment.apps/nginx-deployment
    ```
    <!--
    Alternatively, you can rollback to a specific revision by specifying it with `--to-revision`:
    -->
    或者，可以通过使用 `--to-revision` 来回滚到特定修改版本：

    ```shell
    kubectl rollout undo deployment.v1.apps/nginx-deployment --to-revision=2
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    deployment.apps/nginx-deployment
    ```

    <!--
    For more details about rollout related commands, read [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout).
    -->
    更多有关回滚相关指令，请参考 [`kubectl rollout`](/docs/reference/generated/kubectl/kubectl-commands#rollout).

    <!--
    The Deployment is now rolled back to a previous stable revision. As you can see, a `DeploymentRollback` event
        for rolling back to revision 2 is generated from Deployment controller.
    -->
    现在， Deployment 将回滚到以前的稳定版本。如所见， Deployment 回滚事件回滚到修改版 2 是从 Deployment 控制器生成的。

<!--
 2. Check if the rollback was successful and the Deployment is running as expected, run:
-->
2. 检查回滚是否成功、 Deployment 是否正在运行，运行：

    ```shell
    kubectl get deployment nginx-deployment
    ```

    <!--
    The output is similar to this:
    -->
    输出：

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

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    Name:                   nginx-deployment
    Namespace:              default
    CreationTimestamp:      Sun, 02 Sep 2018 18:17:55 -0500
    Labels:                 app=nginx
    Annotations:            deployment.kubernetes.io/revision=4
                            kubernetes.io/change-cause=kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1 --record=true
    Selector:               app=nginx
    Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
    StrategyType:           RollingUpdate
    MinReadySeconds:        0
    RollingUpdateStrategy:  25% max unavailable, 25% max surge
    Pod Template:
      Labels:  app=nginx
      Containers:
       nginx:
        Image:        nginx:1.9.1
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
-->
## 缩放 Deployment


<!--
 You can scale a Deployment by using the following command:
-->
可以使用如下指令缩放 Deployment ：

```shell
kubectl scale deployment.v1.apps/nginx-deployment --replicas=10
```

<!--
 The output is similar to this:
-->
输出：

```shell
deployment.apps/nginx-deployment scaled
```

<!--
 Assuming [horizontal Pod autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/) is enabled
in your cluster, you can setup an autoscaler for your Deployment and choose the minimum and maximum number of
Pods you want to run based on the CPU utilization of your existing Pods.
-->
假设启用[水平自动缩放 Pod](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/)在集群中，可以为 Deployment 设置自动缩放器，并选择最小和最大
要基于现有 Pods 的 CPU 利用率运行的 Pods。

```shell
kubectl autoscale deployment.v1.apps/nginx-deployment --min=10 --max=15 --cpu-percent=80
```

<!--
 The output is similar to this:
-->
输出：

```shell
deployment.apps/nginx-deployment scaled
```

<!--
 ### Proportional scaling
-->
### 比例缩放

<!--
 RollingUpdate Deployments support running multiple versions of an application at the same time. When you
or an autoscaler scales a RollingUpdate Deployment that is in the middle of a rollout (either in progress
or paused), the Deployment controller balances the additional replicas in the existing active
ReplicaSets (ReplicaSets with Pods) in order to mitigate risk. This is called *proportional scaling*.
-->
滚动更新 Deployments 支持同时运行应用程序的多个版本。当自动缩放器缩放处于展开中间的滚动更新 Deployment （仍在进行中或暂停）时， Deployment 控制器平衡现有活动中的其他 ReplicaSets （带 Pods 的 ReplicaSets ），以降低风险。这称为比例缩放。

<!--
 For example, you are running a Deployment with 10 replicas, [maxSurge](#max-surge)=3, and [maxUnavailable](#max-unavailable)=2.
-->
例如，运行一个10个副本的 Deployment ，[最大增加](#max-surge)=3， [最大不可用](#max-unavailable)=2.

<!--
 * Ensure that the 10 replicas in your Deployment are running.
-->
* 确保这10个副本都在运行。
  ```shell
  kubectl get deploy
  ```

  <!--
  The output is similar to this:
  -->
  输出：

  ```shell
  NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx-deployment     10        10        10           10          50s
  ```

<!--
 * You update to a new image which happens to be unresolvable from inside the cluster.
-->
* 更新到新镜像，该镜像恰好无法从集群内部解析。
    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:sometag
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    deployment.apps/nginx-deployment image updated
    ```

<!--
 * The image update starts a new rollout with ReplicaSet nginx-deployment-1989198191, but it's blocked due to the
`maxUnavailable` requirement that you mentioned above. Check out the rollout status:
-->
* 镜像更新使用 ReplicaSet  nginx-deployment-1989198191 启动新的展开，但由于上面提到的最大不可用要求。检查展开状态：
    ```shell
    kubectl get rs
    ```
    <!--
    The output is similar to this:
    -->
      输出：

    ```shell
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
* 然后，出现了新的 Deployment 扩展请求。自动缩放器增加 Deployment 副本到15。 Deployment 控制器需要决定在何处添加这些新 5 个副本。如果未使用比例缩放，所有 5 个都将添加到新的 ReplicaSet 中。使用比例缩放，可以将其他副本分布到所有 ReplicaSets 。更大的比例转到 ReplicaSets 与大多数副本和较低的比例都转到副本较少的 ReplicaSets 。任何剩余部分都添加到具有最多副本的 ReplicaSet 。具有零副本的 ReplicaSets 不会放大。

<!--
 In our example above, 3 replicas are added to the old ReplicaSet and 2 replicas are added to the
new ReplicaSet. The rollout process should eventually move all replicas to the new ReplicaSet, assuming
the new replicas become healthy. To confirm this, run:
-->
在上面的示例中，3 个副本添加到旧 ReplicaSet 中，2 个副本添加到新 ReplicaSet 。展开过程最终应将所有副本移动到新的 ReplicaSet ，假定新的副本变得正常。要确认这一点，请运行：

```shell
kubectl get deploy
```

<!--
 The output is similar to this:
-->
输出：

```shell
NAME                 DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment     15        18        7            8           7m
```

<!--
 The rollout status confirms how the replicas were added to each ReplicaSet.
-->
展开状态确认副本如何添加到每个 ReplicaSet 。

```shell
kubectl get rs
```

<!--
 The output is similar to this:
-->
输出：

```shell
NAME                          DESIRED   CURRENT   READY     AGE
nginx-deployment-1989198191   7         7         0         7m
nginx-deployment-618515232    11        11        11        7m
```

<!--
 ## Pausing and Resuming a Deployment
-->
## 暂停、恢复 Deployment

<!--
 You can pause a Deployment before triggering one or more updates and then resume it. This allows you to
apply multiple fixes in between pausing and resuming without triggering unnecessary rollouts.
-->
可以在触发一个或多个更新之前暂停 Deployment ，然后继续它。这允许在暂停和恢复之间应用多个修补程序，而不会触发不必要的 Deployment 。

<!--
 * For example, with a Deployment that was just created:
  Get the Deployment details:
-->
* 例如，对于一个刚刚创建的 Deployment ：
  获取 Deployment 信息：

  ```shell
  kubectl get deploy
  ```
    <!--
    The output is similar to this:
    -->
  输出：

  ```shell
  NAME      DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
  nginx     3         3         3            3           1m
  ```

    <!--
    Get the rollout status:
    -->
  获取 Deployment 状态：

  ```shell
  kubectl get rs
  ```
  <!--
  The output is similar to this:
  -->
  输出：

  ```shell
  NAME               DESIRED   CURRENT   READY     AGE
  nginx-2142116321   3         3         3         1m
  ```

    <!--
    * Pause by running the following command:
    -->
    使用如下指令中断运行：

    ```shell
    kubectl rollout pause deployment.v1.apps/nginx-deployment
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    deployment.apps/nginx-deployment paused
    ```

<!--
 * Then update the image of the Deployment:
-->
* 然后更新 Deployment 镜像：

    ```shell
    kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.1
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    deployment.apps/nginx-deployment image updated
    ```

<!--
 * Notice that no new rollout started:
-->
* 注意没有新的展开：

    ```shell
    kubectl rollout history deployment.v1.apps/nginx-deployment
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    deployments "nginx"
    REVISION  CHANGE-CAUSE
    1   <none>
    ```

<!--
 * Get the rollout status to ensure that the Deployment is updates successfully:
-->
* 获取展开状态确保 Deployment 更新已经成功：

    ```shell
    kubectl get rs
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    NAME               DESIRED   CURRENT   READY     AGE
    nginx-2142116321   3         3         3         2m
    ```

<!--
 * You can make as many updates as you wish, for example, update the resources that will be used:
-->
* 更新是很容易的，例如，可以这样更新使用到的资源：

    ```shell
    kubectl set resources deployment.v1.apps/nginx-deployment -c=nginx --limits=cpu=200m,memory=512Mi
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    deployment.apps/nginx-deployment resource requirements updated
    ```

    <!--
    The initial state of the Deployment prior to pausing it will continue its function, but new updates to
        the Deployment will not have any effect as long as the Deployment is paused.
    -->
    暂停 Deployment 之前的初始状态将继续其功能，但新的更新只要暂停 Deployment ， Deployment 就不会产生任何效果。

<!--
 * Eventually, resume the Deployment and observe a new ReplicaSet coming up with all the new updates:
-->
* 最后，恢复 Deployment 并观察新的 ReplicaSet ，并更新所有新的更新：

    ```shell
    kubectl rollout resume deployment.v1.apps/nginx-deployment
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    deployment.apps/nginx-deployment resumed
    ```
<!--
 * Watch the status of the rollout until it's done.
-->
* 观察展开的状态，直到完成。

    ```shell
    kubectl get rs -w
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
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
* 获取最近展开的状态：

    ```shell
    kubectl get rs
    ```

    <!--
    The output is similar to this:
    -->
    输出：

    ```shell
    NAME               DESIRED   CURRENT   READY     AGE
    nginx-2142116321   0         0         0         2m
    nginx-3926361531   3         3         3         28s
    ```

{{< note >}}
<!--
 You cannot rollback a paused Deployment until you resume it.
-->
暂停的 Deployment 不可以回滚，除非恢复它以后。
{{< /note >}}

<!--
 ## Deployment status
-->
##  Deployment 状态

<!--
 A Deployment enters various states during its lifecycle. It can be [progressing](#progressing-deployment) while
rolling out a new ReplicaSet, it can be [complete](#complete-deployment), or it can [fail to progress](#failed-deployment).
-->
一个 Deployment 的生命周期中会有许多状态。当正在生产新的 ReplicaSet 时可能是[正在运行](#progressing-deployment)，可能是[已完成](#complete-deployment)，也可能是[ Deployment 失败](#failed-deployment)。

<!--
 ### Progressing Deployment
-->
### 正在 Deployment

<!--
 Kubernetes marks a Deployment as _progressing_ when one of the following tasks is performed:
-->
Kubernetes 使用 _运行中_ 来标记一个 Deployment ，当下面的任务被执行时：

<!--
 * The Deployment creates a new ReplicaSet.
* The Deployment is scaling up its newest ReplicaSet.
* The Deployment is scaling down its older ReplicaSet(s).
* New Pods become ready or available (ready for at least [MinReadySeconds](#min-ready-seconds)).
-->
* 创建新的 ReplicaSet 。
* 正在向上扩展最新的 ReplicaSet 。
*  Deployment 向下扩展旧的 ReplicaSet(s) 。
* 新的 Pods 已经就绪或者可用（在[最小就绪时间](#min-ready-seconds)内就绪）。

<!--
 You can monitor the progress for a Deployment by using `kubectl rollout status`.
-->
可以使用 `kubectl rollout status` 监视 Deployment 的进度。

<!--
 ### Complete Deployment
-->
### 完成 Deployment

<!--
 Kubernetes marks a Deployment as _complete_ when it has the following characteristics:
-->
Kubernetes 将 Deployment 标记为 _完成_，当它具有以下特征时：

<!--
 * All of the replicas associated with the Deployment have been updated to the latest version you've specified, meaning any
updates you've requested have been completed.
-->
* 与 Deployment 关联的所有副本都已更新到指定的最新版本，这意味着请求的任何更新都已完成。

<!--
 * All of the replicas associated with the Deployment are available.
-->
* 与 Deployment 关联的所有副本都可用。

<!--
 * No old replicas for the Deployment are running.
-->
* 未运行 Deployment 的旧副本。

<!--
 You can check if a Deployment has completed by using `kubectl rollout status`. If the rollout completed
successfully, `kubectl rollout status` returns a zero exit code.
-->
可以使用 `kubectl rollout status` 检查 Deployment 是否已完成。如果展开成功完成，`kubectl rollout status` 返回退出代码 0。

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```

<!--
 The output is similar to this:
-->
输出：

```shell
Waiting for rollout to finish: 2 of 3 updated replicas are available...
deployment.apps/nginx-deployment successfully rolled out
$ echo $?
0
```

<!--
 ### Failed Deployment
-->
###  Deployment 失败

<!--
 Your Deployment may get stuck trying to deploy its newest ReplicaSet without ever completing. This can occur
due to some of the following factors:
-->
你的 Deployment 可能会在未完成的情况下尝试 Deployment 其最新的 ReplicaSet 时遇到问题。可能发生此情况由于以下一些因素：

<!--
 * Insufficient quota
* Readiness probe failures
* Image pull errors
* Insufficient permissions
* Limit ranges
* Application runtime misconfiguration
-->
* 配额不足
* 就绪探测失败
* 镜像拉取错误
* 权限不足
* 限制范围
* 应用程序运行时配置错误

<!--
 One way you can detect this condition is to specify a deadline parameter in your Deployment spec:
([`.spec.progressDeadlineSeconds`](#progress-deadline-seconds)). `.spec.progressDeadlineSeconds` denotes the
number of seconds the Deployment controller waits before indicating (in the Deployment status) that the
Deployment progress has stalled.
-->
检测此条件的一种方法是在 Deployment 规范中指定截止时间参数：（[`.spec.progressDeadlineSeconds`]（#progress-deadline-seconds））。`.spec.progressDeadlineSeconds` 进度截止时间秒表示 Deployment 控制器在指示（处于 Deployment 状态）之前等待的秒数 Deployment 进度已停止。

<!--
 The following `kubectl` command sets the spec with `progressDeadlineSeconds` to make the controller report
lack of progress for a Deployment after 10 minutes:
-->
以下 `kubectl` 命令设置具有进度的规范，使控制器报告 10 分钟后 Deployment 进度不足：

```shell
kubectl patch deployment.v1.apps/nginx-deployment -p '{"spec":{"progressDeadlineSeconds":600}}'
```

<!--
 The output is similar to this:
-->
输出：

```shell
deployment.apps/nginx-deployment patched
```

<!--
 Once the deadline has been exceeded, the Deployment controller adds a DeploymentCondition with the following
attributes to the Deployment's `.status.conditions`:
-->
超过截止时间后， Deployment 控制器将添加具有以下属性到 Deployment 的 `.status.conditions` ：

* Type=Progressing
* Status=False
* Reason=ProgressDeadlineExceeded

<!--
 See the [Kubernetes API conventions](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) for more information on status conditions.
-->
参考 [Kubernetes API 约定](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#typical-status-properties) 获取更多状态条件相关信息。

{{< note >}}
<!--
 Kubernetes takes no action on a stalled Deployment other than to report a status condition with
`Reason=ProgressDeadlineExceeded`. Higher level orchestrators can take advantage of it and act accordingly, for
example, rollback the Deployment to its previous version.
-->
Kubernetes 对已停止的 Deployment 不执行任何操作，只需使用`Reason=ProgressDeadlineExceeded`。更高级别的编排器可以利用它并相应地采取行动，例如，将 Deployment 回滚到其以前的版本。
{{< /note >}}

{{< note >}}
<!--
 If you pause a Deployment, Kubernetes does not check progress against your specified deadline. You can
safely pause a Deployment in the middle of a rollout and resume without triggering the condition for exceeding the
deadline.
-->
如果暂停 Deployment ，Kubernetes 不会根据指定的截止时间检查进度。可以在展开栏中间安全地暂停 Deployment ，并在不触发超过最后期限时恢复。
{{< /note >}}

<!--
 You may experience transient errors with your Deployments, either due to a low timeout that you have set or
due to any other kind of error that can be treated as transient. For example, let's suppose you have
insufficient quota. If you describe the Deployment you will notice the following section:
-->
 Deployments 可能会出现短暂的错误，既不是因为设置的超时时间过短，也不是因为任何真正的暂时性错误。例如配额不足。如果描述 Deployment ，将注意到以下部分：

```shell
kubectl describe deployment nginx-deployment
```

<!--
 The output is similar to this:
-->
输出：

```shell
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
如果运行 `kubectl get deployment nginx-deployment -o yaml`， Deployment 状态输出：

```shell
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
最终，一旦超过 Deployment 进度截止时间，Kubernetes 将更新状态和进度状态：

```shell
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
可以通过缩减 Deployment 来解决配额不足的问题，或者直接在命名空间中增加配额。如果配额条件满足， Deployment 控制器完成了 Deployment 展开， Deployment 状态会更新为成功（`Status=True` and `Reason=NewReplicaSetAvailable`）。

```shell
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
`Type=Available`和 `Status=True` 表示 Deployment 具有最低可用性。最低可用性由 Deployment 策略中的参数指定。`Type=Progressing` 和 `Status=True` 表示 Deployment 处于展开中间，并且正在运行，或者已成功完成进度，最小所需新的副本处于可用（请参阅此种状态原因的相关细节，在我们的案例中`Reason=NewReplicaSetAvailable` 表示 Deployment 已完成）。

<!--
 You can check if a Deployment has failed to progress by using `kubectl rollout status`. `kubectl rollout status`
returns a non-zero exit code if the Deployment has exceeded the progression deadline.
-->
可以使用 `kubectl rollout status` 检查 Deployment 是否未能取得进展。`kubectl rollout status`如果 Deployment 已超过进度截止时间，则返回非零退出代码。

```shell
kubectl rollout status deployment.v1.apps/nginx-deployment
```
<!--
 The output is similar to this:
-->
输出：

```shell
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
error: deployment "nginx" exceeded its progress deadline
$ echo $?
1
```

<!--
 ### Operating on a failed deployment
-->
### 对失败 Deployment 的操作

<!--
 All actions that apply to a complete Deployment also apply to a failed Deployment. You can scale it up/down, roll back
to a previous revision, or even pause it if you need to apply multiple tweaks in the Deployment Pod template.
-->
应用于完整 Deployment 的所有操作也适用于失败的 Deployment 。可以向上/向下扩展，回滚到以前的修改版，或者如果需要在 Deployment  Pod 模板中应用多个调整，甚至将其暂停。

<!--
 ## Clean up Policy
-->
## 清理策略

<!--
 You can set `.spec.revisionHistoryLimit` field in a Deployment to specify how many old ReplicaSets for
this Deployment you want to retain. The rest will be garbage-collected in the background. By default,
it is 10.
-->
可以在 Deployment 中设置 `.spec.revisionHistoryLimit` ，以指定保留多少此 Deployment 的 ReplicaSets。其余的将在后台进行垃圾回收。默认情况下，是10。

{{< note >}}
<!--
 Explicitly setting this field to 0, will result in cleaning up all the history of your Deployment
thus that Deployment will not be able to roll back.
-->
显式将此字段设置为 0 将导致清理 Deployment 的所有历史记录，因此 Deployment 将无法回滚。
{{< /note >}}

<!--
 ## Canary Deployment
-->
## 金丝雀 Deployment

<!--
 If you want to roll out releases to a subset of users or servers using the Deployment, you
can create multiple Deployments, one for each release, following the canary pattern described in
[managing resources](/docs/concepts/cluster-administration/manage-deployment/#canary-deployments).
-->
如果要使用 Deployment 向用户或服务器子集展开版本，则可以创建多个 Deployments ，每个版本一个，遵循[资源管理](/docs/concepts/cluster-administration/manage-deployment/#canary-deployments)。

<!--
 ## Writing a Deployment Spec
-->
## 编写 Deployment 脚本

<!--
 As with all other Kubernetes configs, a Deployment needs `apiVersion`, `kind`, and `metadata` fields.
For general information about working with config files, see [deploying applications](/docs/tutorials/stateless-application/run-stateless-application-deployment/),
configuring containers, and [using kubectl to manage resources](/docs/concepts/overview/working-with-objects/object-management/) documents.
-->
同其他 Kubernetes 配置， Deployment 需要 `apiVersion`， `kind`， 和 `metadata` 字段。有关配置文件的其他信息，参考 [应用 Deployment ](/docs/tutorials/stateless-application/run-stateless-application-deployment/)，配置容器，和 [使用 kubectl 管理资源](/docs/concepts/overview/working-with-objects/object-management/) 相关文档。

<!--
 A Deployment also needs a [`.spec` section](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).
-->
 Deployment 还需要 [`.spec` 部分](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)。

<!--
 ### Pod Template
-->
### Pod 示例

<!--
 The `.spec.template` and `.spec.selector` are the only required field of the `.spec`.
-->
`.spec`仅需要 `.spec.template` 和 `.spec.selector`。

<!--
 The `.spec.template` is a [Pod template](/docs/concepts/workloads/pods/pod-overview/#pod-templates). It has exactly the same schema as a [Pod](/docs/concepts/workloads/pods/pod/), except it is nested and does not have an
`apiVersion` or `kind`.
-->
`.spec.template` 是一个 [Pod 示例](/docs/concepts/workloads/pods/pod-overview/#pod-templates)。它和 [Pod](/docs/concepts/workloads/pods/pod/)的约束完全相同，除了它是嵌套的，而且没有 `apiVersion` 或 `kind`。

<!--
 In addition to required fields for a Pod, a Pod template in a Deployment must specify appropriate
labels and an appropriate restart policy. For labels, make sure not to overlap with other controllers. See [selector](#selector)).
-->
除了 Pod 的必填字段外， Deployment 中的 Pod 模板必须指定适当的标签和适当的重新启动策略。对于标签，请确保不要与其他控制器重叠。请参考[选择器](#selector))。

<!--
 Only a [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) equal to `Always` is
allowed, which is the default if not specified.
-->
只有 [`.spec.template.spec.restartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) 等于 `Always` 被允许，这是在没有指定时的默认设置。

<!--
 ### Replicas
-->
### 副本

<!--
 `.spec.replicas` is an optional field that specifies the number of desired Pods. It defaults to 1.
-->
`.spec.replicas` 是指定所需 Pod 的可选字段。它的默认值是1。

<!--
 ### Selector
-->
### 选择器

<!--
 `.spec.selector` is an required field that specifies a [label selector](/docs/concepts/overview/working-with-objects/labels/)
for the Pods targeted by this Deployment.
-->
`.spec.selector` 是指定本次 Deployment  Pods [标签选择器](/docs/concepts/overview/working-with-objects/labels/)的必要字段。

<!--
 `.spec.selector` must match `.spec.template.metadata.labels`, or it will be rejected by the API.
-->
`.spec.selector` 必须匹配 `.spec.template.metadata.labels`，否则请求会被 API 拒绝。

<!--
 In API version `apps/v1`, `.spec.selector` and `.metadata.labels` do not default to `.spec.template.metadata.labels` if not set. So they must be set explicitly. Also note that `.spec.selector` is immutable after creation of the Deployment in `apps/v1`.
-->
在 API `apps/v1`版本中，`.spec.selector` 和 `.metadata.labels` 不会被默认设置为 `.spec.template.metadata.labels`，如果没有设置的话。所以需要明确进行设置。同时在 `apps/v1`版本中， Deployment 创建后 `.spec.selector` 是可变的。

<!--
 A Deployment may terminate Pods whose labels match the selector if their template is different
from `.spec.template` or if the total number of such Pods exceeds `.spec.replicas`. It brings up new
Pods with `.spec.template` if the number of Pods is less than the desired number.
-->
当 Pods 的标签和选择器匹配时，此类 Pods 的模板和 `.spec.template` 不同，或者此类 Pods 的总数超过 `.spec.replicas`， Deployment 会终结这些 Pods。如果 Pods 总数达不到期望值，会用 `.spec.template` 创建新的 Pods。

{{< note >}}
<!--
 You should not create other Pods whose labels match this selector, either directly, by creating
another Deployment, or by creating another controller such as a ReplicaSet or a ReplicationController. If you
do so, the first Deployment thinks that it created these other Pods. Kubernetes does not stop you from doing this.
-->
不应创建其标签与此选择器匹配的 Pods，或者直接创建另一个 Deployment ，或通过创建其他控制器（如 ReplicaSet 或复制控制器）。如果这样做，第一个 Deployment 认为它创建了这些其他 Pods。Kubernetes 不会阻止你这么做。
{{< /note >}}

<!--
 If you have multiple controllers that have overlapping selectors, the controllers will fight with each
other and won't behave correctly.
-->
如果有多个具有重叠选择器的控制器，则控制器之间会因冲突而故障。

<!--
 ### Strategy
-->
### 策略
<!--
 `.spec.strategy` specifies the strategy used to replace old Pods by new ones.
`.spec.strategy.type` can be "Recreate" or "RollingUpdate". "RollingUpdate" is
the default value.
-->
`.spec.strategy` 策略指定用于用新 Pods 替换旧 Pods 的策略。`.spec.strategy.type` 可以是“Recreate”或“RollingUpdate”。“RollingUpdate”是默认值。

<!--
 #### Recreate Deployment
-->
#### 重新创建 Deployment

<!--
 All existing Pods are killed before new ones are created when `.spec.strategy.type==Recreate`.
-->
当 `.spec.strategy.type==Recreate`,所有现有的 Pods 在创建新 Pods 之前被杀死。

<!--
 #### Rolling Update Deployment
-->
#### 滚动更新 Deployment

<!--
 The Deployment updates Pods in a [rolling update](/docs/tasks/run-application/rolling-update-replication-controller/)
fashion when `.spec.strategy.type==RollingUpdate`. You can specify `maxUnavailable` and `maxSurge` to control
the rolling update process.
-->
 Deployment 会在 `.spec.strategy.type==RollingUpdate`时，采取 [滚动更新](/docs/tasks/run-application/rolling-update-replication-controller/)的方式更新Pods。可以指定 `maxUnavailable` 和 `maxSurge` 来控制滚动更新操作。

<!--
 ##### Max Unavailable
-->
##### 最大不可用

<!--
 `.spec.strategy.rollingUpdate.maxUnavailable` is an optional field that specifies the maximum number
of Pods that can be unavailable during the update process. The value can be an absolute number (for example, 5)
or a percentage of desired Pods (for example, 10%). The absolute number is calculated from percentage by
rounding down. The value cannot be 0 if `.spec.strategy.rollingUpdate.maxSurge` is 0. The default value is 25%.
-->
`.spec.strategy.rollingUpdate.maxUnavailable` 是指定最大数量的可选字段，表示在更新过程中不可用的 Pods。该值可以是绝对数字（例如，5）或所需 Pods 的百分比（例如，10%）。绝对数按百分比计算，四舍五入下来。如果 `.spec.strategy.rollingUpdate.maxSurge` 为 0，则该值不能为 0。默认值为 25%。

<!--
 For example, when this value is set to 30%, the old ReplicaSet can be scaled down to 70% of desired
Pods immediately when the rolling update starts. Once new Pods are ready, old ReplicaSet can be scaled
down further, followed by scaling up the new ReplicaSet, ensuring that the total number of Pods available
at all times during the update is at least 70% of the desired Pods.
-->
例如，当此值设置为 30% 时，滚动更新开始时会立即将旧 ReplicaSet 向下扩展到期望 Pods 的70%。新 Pods 准备就绪后，可以缩放旧 ReplicaSet 进一步向下，然后向上扩展新的 ReplicaSet ，确保可用的 Pods 总数在更新期间，任何时候都至少为 70% 所需的 Pods。

<!--
 ##### Max Surge
-->
##### 最大增量

<!--
 `.spec.strategy.rollingUpdate.maxSurge` is an optional field that specifies the maximum number of Pods
that can be created over the desired number of Pods. The value can be an absolute number (for example, 5) or a
percentage of desired Pods (for example, 10%). The value cannot be 0 if `MaxUnavailable` is 0. The absolute number
is calculated from the percentage by rounding up. The default value is 25%.
-->
`.spec.strategy.rollingUpdate.maxSurge`  是指定最大 Pods 数的可选字段可在所需的 Pods 数上创建。该值可以是绝对数（例如，5）或所需 Pods 的百分比（例如，10%）。如果 `MaxUnavailable` 0，则值不能为 0。绝对数通过舍入从百分比计算。默认值为 25%。

<!--
 For example, when this value is set to 30%, the new ReplicaSet can be scaled up immediately when the
rolling update starts, such that the total number of old and new Pods does not exceed 130% of desired
Pods. Once old Pods have been killed, the new ReplicaSet can be scaled up further, ensuring that the
total number of Pods running at any time during the update is at most 130% of desired Pods.
-->
例如，当此值设置为 30% 时，启动滚动更新后，会立即展开新的 ReplicaSet ，以便新旧 Pod 的总数不超过所需的 130%。一旦旧 Pods 被杀死，新的 ReplicaSet 可以进一步扩展，确保更新期间任何时间运行的 Pods 总数最多为所需 Pods 总数的130%。

<!--
 ### Progress Deadline Seconds
-->
###  Deployment 失败等待时间

<!--
 `.spec.progressDeadlineSeconds` is an optional field that specifies the number of seconds you want
to wait for your Deployment to progress before the system reports back that the Deployment has
[failed progressing](#failed-deployment) - surfaced as a condition with `Type=Progressing`, `Status=False`.
and `Reason=ProgressDeadlineExceeded` in the status of the resource. The Deployment controller will keep
retrying the Deployment. In the future, once automatic rollback will be implemented, the Deployment
controller will roll back a Deployment as soon as it observes such a condition.
-->
`.spec.progressDeadlineSeconds` 是一个可选字段，用于指定等待的秒数而后在系统报告中返回[ Deployment 失败](#failed-deployment)，同时在资源状态中 `Type=Progressing`、 `Status=False` 、 `Reason=ProgressDeadlineExceeded` 。  Deployment 控制器将保留正在重试 Deployment 。将来，一旦实现自动回滚， Deployment 控制器将回滚 Deployment ，只要它探测到这样的条件。

<!--
 If specified, this field needs to be greater than `.spec.minReadySeconds`.
-->
如果指定，则此字段需要大于 `.spec.minReadySeconds`。

<!--
 ### Min Ready Seconds
-->
### 最小就绪时间

<!--
 `.spec.minReadySeconds` is an optional field that specifies the minimum number of seconds for which a newly
created Pod should be ready without any of its containers crashing, for it to be considered available.
This defaults to 0 (the Pod will be considered available as soon as it is ready). To learn more about when
a Pod is considered ready, see [Container Probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).
-->
`.spec.minReadySeconds` 是一个可选字段，用于指定新创建的 Pod 在没有任意容器崩溃情况下的最小就绪时间，以便将其视为可用。默认值为 0（Pod 在准备就绪后立即将被视为可用）。了解有关何时Pod 被视为已准备就绪，参考[容器探针](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。

<!--
 ### Rollback To
-->
### 回滚

<!--
 Field `.spec.rollbackTo` has been deprecated in API versions `extensions/v1beta1` and `apps/v1beta1`, and is no longer supported in API versions starting `apps/v1beta2`. Instead, `kubectl rollout undo` as introduced in [Rolling Back to a Previous Revision](#rolling-back-to-a-previous-revision) should be used.
-->
`.spec.rollbackTo` 字段已经在 API 版本 `extensions/v1beta1` 和 `apps/v1beta1`中废弃了，并且从 `apps/v1beta2`版本开始不在支持。相应的，会开始使用已经引入[回滚到上一个版本](#rolling-back-to-a-previous-revision)中的 `kubectl rollout undo`。

<!--
 ### Revision History Limit
-->
### 修改历史限制

<!--
 A Deployment's revision history is stored in the ReplicaSets it controls.
-->
 Deployment 修改历史记录存储在它所控制的 ReplicaSets 中。

<!--
 `.spec.revisionHistoryLimit` is an optional field that specifies the number of old ReplicaSets to retain
to allow rollback. These old ReplicaSets consume resources in `etcd` and crowd the output of `kubectl get rs`. The configuration of each Deployment revision is stored in its ReplicaSets; therefore, once an old ReplicaSet is deleted, you lose the ability to rollback to that revision of Deployment. By default, 10 old ReplicaSets will be kept, however its ideal value depends on the frequency and stability of new Deployments.
-->
`.spec.revisionHistoryLimit` 修改历史记录限制是一个可选字段，用于指定要保留的旧 ReplicaSets 的数量以允许回滚。这些旧 ReplicaSets 消耗 etcd 中的资源，并占用 `kubectl get rs` 的输出。每个 Deployment 修改版的配置都存储在其 ReplicaSets 中；因此，一旦删除了旧的 ReplicaSet ，将失去回滚到 Deployment 版本的能力。默认情况下，将保留 10 个旧 ReplicaSets ，但其理想值取决于新 Deployment 的频率和稳定性。

<!--
 More specifically, setting this field to zero means that all old ReplicaSets with 0 replicas will be cleaned up.
In this case, a new Deployment rollout cannot be undone, since its revision history is cleaned up.
-->
更具体地说，将此字段设置为 0 意味着将清理所有具有 0 个副本的旧 ReplicaSets 。在这种情况下，无法撤消新的 Deployment 展开，因为它的修改历史被清除了。

<!--
 ### Paused
-->
### 暂停

<!--
 `.spec.paused` is an optional boolean field for pausing and resuming a Deployment. The only difference between
a paused Deployment and one that is not paused, is that any changes into the PodTemplateSpec of the paused
Deployment will not trigger new rollouts as long as it is paused. A Deployment is not paused by default when
it is created.
-->
`.spec.paused` 是用于暂停和恢复 Deployment 的可选布尔字段。暂停的 Deployment 和未暂停的 Deployment 唯一的区别，只要暂停 Deployment 处于暂停状态， PodTemplateSpec 的任意修改都不会触发新的展开。默认 Deployment 在创建时是不会被暂停的。

<!--
 ## Alternative to Deployments
-->
##  Deployments 的替代方案

<!--
 ### kubectl rolling update
-->
### kubectl滚动更新

<!--
 [`kubectl rolling update`](/docs/reference/generated/kubectl/kubectl-commands#rolling-update) updates Pods and ReplicationControllers
-->

<!--
 in a similar fashion. But Deployments are recommended, since they are declarative, server side, and have
additional features, such as rolling back to any previous revision even after the rolling update is done.
-->
[`kubectl rolling update`](/docs/reference/generated/kubectl/kubectl-commands#rolling-update)更新 Pods 和副本控制器的方式类似。但是，建议采取 Deployments 的方式来更新，因为它们是声明性的，在服务器端，并且具有其他功能，例如，即使在滚动更新完成后，也会回滚到以前的任何修改版本。


