---
title: 透過名字空間共享叢集
content_type: task
---
<!--
reviewers:
- derekwaynecarr
- janetkuo
title: Share a Cluster with Namespaces
content_type: task
-->

<!-- overview -->
<!--
This page shows how to view, work in, and delete {{< glossary_tooltip text="namespaces" term_id="namespace" >}}. The page also shows how to use Kubernetes namespaces to subdivide your cluster.
-->
本頁展示如何檢視、使用和刪除{{< glossary_tooltip text="名字空間" term_id="namespace" >}}。
本頁同時展示如何使用 Kubernetes 名字空間來劃分叢集。

## {{% heading "prerequisites" %}}

<!--
* Have an [existing Kubernetes cluster](/docs/setup/).
* You have a basic understanding of Kubernetes {{< glossary_tooltip text="Pods" term_id="pod" >}}, {{< glossary_tooltip term_id="service" text="Services" >}}, and {{< glossary_tooltip text="Deployments" term_id="deployment" >}}.
-->
* 你已擁有一個[配置好的 Kubernetes 叢集](/zh-cn/docs/setup/)。
* 你已對 Kubernetes 的 {{< glossary_tooltip text="Pods" term_id="pod" >}} , 
  {{< glossary_tooltip term_id="service" text="Services" >}} , 和
  {{< glossary_tooltip text="Deployments" term_id="deployment" >}} 有基本理解。

<!-- steps -->

<!-- ## Viewing namespaces -->
## 檢視名字空間

<!-- 1. List the current namespaces in a cluster using: -->
1. 列出叢集中現有的名字空間：

```shell
kubectl get namespaces
```
```
NAME          STATUS    AGE
default       Active    11d
kube-system   Active    11d
kube-public   Active    11d
```

<!-- Kubernetes starts with three initial namespaces: -->
初始狀態下，Kubernetes 具有三個名字空間：

<!--
* `default` The default namespace for objects with no other namespace
* `kube-system` The namespace for objects created by the Kubernetes system
* `kube-public` This namespace is created automatically and is readable by all users (including those not authenticated). This namespace is mostly reserved for cluster usage, in case that some resources should be visible and readable publicly throughout the whole cluster. The public aspect of this namespace is only a convention, not a requirement. -->

* `default` 無名字空間物件的預設名字空間
* `kube-system` 由 Kubernetes 系統建立的物件的名字空間
* `kube-public` 自動建立且被所有使用者可讀的名字空間（包括未經身份認證的）。此名字空間通常在某些資源在整個叢集中可見且可公開讀取時被叢集使用。此名字空間的公共方面只是一個約定，而不是一個必要條件。

<!-- You can also get the summary of a specific namespace using: -->
你還可以透過下列命令獲取特定名字空間的摘要：

```shell
kubectl get namespaces <name>
```

<!-- Or you can get detailed information with: -->
或用下面的命令獲取詳細資訊：

```shell
kubectl describe namespaces <name>
```

```
Name:           default
Labels:         <none>
Annotations:    <none>
Status:         Active

No resource quota.

Resource Limits
 Type       Resource    Min Max Default
 ----               --------    --- --- ---
 Container          cpu         -   -   100m
```

<!-- Note that these details show both resource quota (if present) as well as resource limit ranges. -->
請注意，這些詳情同時顯示了資源配額（如果存在）以及資源限制區間。

<!-- Resource quota tracks aggregate usage of resources in the *Namespace* and allows cluster operators
to define *Hard* resource usage limits that a *Namespace* may consume. -->
資源配額跟蹤並聚合 *Namespace* 中資源的使用情況，並允許叢集運營者定義 *Namespace* 可能消耗的 *Hard* 資源使用限制。

<!-- A limit range defines min/max constraints on the amount of resources a single entity can consume in
a *Namespace*.

See [Admission control: Limit Range](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md) -->

限制區間定義了單個實體在一個 *Namespace* 中可使用的最小/最大資源量約束。

參閱 [准入控制: 限制區間](https://git.k8s.io/community/contributors/design-proposals/resource-management/admission_control_limit_range.md)

<!--
A namespace can be in one of two phases:

* `Active` the namespace is in use
* `Terminating` the namespace is being deleted, and can not be used for new objects

For more details, see [Namespace](/docs/reference/kubernetes-api/cluster-resources/namespace-v1/)
in the API reference.
 -->

名字空間可以處於下列兩個階段中的一個:

* `Active` 名字空間正在被使用中
* `Terminating` 名字空間正在被刪除，且不能被用於新物件。

更多細節，參閱 API 參考中的[名稱空間](/docs/reference/kubernetes-api/cluster-resources/namespace-v1/)。

<!-- ## Creating a new namespace -->
## 建立名字空間

<!--
Avoid creating namespace with prefix `kube-`, since it is reserved for Kubernetes system namespaces.
-->
{{< note >}}
避免使用字首 `kube-` 建立名字空間，因為它是為 Kubernetes 系統名字空間保留的。
{{< /note >}}

<!-- 1. Create a new YAML file called `my-namespace.yaml` with the contents: -->
1. 新建一個名為 `my-namespace.yaml` 的 YAML 檔案，並寫入下列內容：

   ```yaml
   apiVersion: v1
   kind: Namespace
   metadata:
     name: <insert-namespace-name-here>
   ```

   <!-- Then run: -->
   然後執行：

   ```shell
   kubectl create -f ./my-namespace.yaml
   ```

<!--
2. Alternatively, you can create namespace using below command:
-->
2. 或者，你可以使用下面的命令建立名字空間：

   ```
   kubectl create namespace <insert-namespace-name-here>
   ```

<!--
The name of your namespace must be a valid
[DNS label](/docs/concepts/overview/working-with-objects/names#dns-label-names).
-->
請注意，名字空間的名稱必須是一個合法的
[DNS 標籤](/zh-cn/docs/concepts/overview/working-with-objects/names#dns-label-names)。

<!--
There's an optional field `finalizers`, which allows observables to purge resources whenever the namespace is deleted. Keep in mind that if you specify a nonexistent finalizer, the namespace will be created but will get stuck in the `Terminating` state if the user tries to delete it.

More information on `finalizers` can be found in the namespace [design doc](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#finalizers).
-->
可選欄位 `finalizers` 允許觀察者們在名字空間被刪除時清除資源。記住如果指定了一個不存在的終結器，名字空間仍會被建立，但如果使用者試圖刪除它，它將陷入 `Terminating` 狀態。

更多有關 `finalizers` 的資訊請查閱 [設計文件](https://git.k8s.io/community/contributors/design-proposals/architecture/namespaces.md#finalizers) 中名字空間部分。

<!-- ## Deleting a namespace -->
## 刪除名字空間

<!--
Delete a namespace with
-->
刪除名字空間使用命令：

```shell
kubectl delete namespaces <insert-some-namespace-name>
```

<!-- This deletes _everything_ under the namespace! -->
{{< warning >}}
這會刪除名字空間下的 _所有內容_ ！
{{< /warning >}}

<!-- This delete is asynchronous, so for a time you will see the namespace in the `Terminating` state. -->
刪除是非同步的，所以有一段時間你會看到名字空間處於 `Terminating` 狀態。

<!--
## Subdividing your cluster using Kubernetes namespaces
-->
## 使用 Kubernetes 名字空間細分你的叢集

<!--
1. Understand the default namespace

   By default, a Kubernetes cluster will instantiate a default namespace when provisioning
   the cluster to hold the default set of Pods, Services, and Deployments used by the cluster.
-->

1. 理解 default 名字空間

   預設情況下，Kubernetes 叢集會在配置叢集時例項化一個 default 名字空間，用以存放叢集所使用的預設
   Pods、Services 和 Deployments 集合。

   <!--
   Assuming you have a fresh cluster, you can introspect the available namespace's by doing the following:
   -->

   假設你有一個新的叢集，你可以透過執行以下操作來內省可用的名字空間

   ```shell
   kubectl get namespaces
   ```
   ```
   NAME      STATUS    AGE
   default   Active    13m
   ```

<!--
2. Create new namespaces
-->
2. 建立新的名字空間

   <!--
   For this exercise, we will create two additional Kubernetes namespaces to hold our content.
   -->
   在本練習中，我們將建立兩個額外的 Kubernetes 名字空間來儲存我們的內容。

   <!--
   In a scenario where an organization is using a shared Kubernetes cluster for development and
   production use cases:
   -->
   在某組織使用共享的 Kubernetes 叢集進行開發和生產的場景中：

   <!--
   The development team would like to maintain a space in the cluster where they can
   get a view on the list of Pods, Services, and Deployments
   they use to build and run their application.  In this space, Kubernetes resources come
   and go, and the restrictions on who can or cannot modify resources
   are relaxed to enable agile development.
   -->
   開發團隊希望在叢集中維護一個空間，以便他們可以檢視用於構建和執行其應用程式的 Pods、Services
   和 Deployments 列表。在這個空間裡，Kubernetes 資源被自由地加入或移除，
   對誰能夠或不能修改資源的限制被放寬，以實現敏捷開發。
   
   <!--
   The operations team would like to maintain a space in the cluster where they can enforce
   strict procedures on who can or cannot manipulate the set of
   Pods, Services, and Deployments that run the production site.
   -->
   運維團隊希望在叢集中維護一個空間，以便他們可以強制實施一些嚴格的規程，
   對誰可以或不可以操作執行生產站點的 Pods、Services 和 Deployments 集合進行控制。
   
   <!--
   One pattern this organization could follow is to partition the Kubernetes cluster into
   two namespaces: `development` and `production`.
   -->
   該組織可以遵循的一種模式是將 Kubernetes 叢集劃分為兩個名字空間：development 和 production。
   
   <!-- Let's create two new namespaces to hold our work. -->
   讓我們建立兩個新的名字空間來儲存我們的工作。
   
   <!-- Create the `development` namespace using kubectl. -->
   使用 kubectl 建立 `development` 名字空間。
   
   ```shell
   kubectl create -f https://k8s.io/examples/admin/namespace-dev.json
   ```

   <!-- And then let's create the `production` namespace using kubectl. -->
   讓我們使用 kubectl 建立 `production` 名字空間。

   ```shell
   kubectl create -f https://k8s.io/examples/admin/namespace-prod.json
   ```

   <!-- To be sure things are right, list all of the namespaces in our cluster. -->
   為了確保一切正常，列出叢集中的所有名字空間。

   ```shell
   kubectl get namespaces --show-labels
   ```
   ```
   NAME          STATUS    AGE       LABELS
   default       Active    32m       <none>
   development   Active    29s       name=development
   production    Active    23s       name=production
   ```

<!-- 3. Create pods in each namespace -->
3. 在每個名字空間中建立 pod

   <!--
   A Kubernetes namespace provides the scope for Pods, Services, and Deployments in the cluster.

   Users interacting with one namespace do not see the content in another namespace.
   -->
   Kubernetes 名字空間為叢集中的 Pods、Services 和 Deployments 提供了作用域。
   
   與一個名字空間互動的使用者不會看到另一個名字空間中的內容。
   
   <!-- To demonstrate this, let's spin up a simple Deployment and Pods in the `development` namespace. -->
   為了演示這一點，讓我們在 `development` 名字空間中啟動一個簡單的 Deployment 和 Pod。

   ```shell
   kubectl create deployment snowflake --image=k8s.gcr.io/serve_hostname -n=development
   kubectl scale deployment snowflake --replicas=2 -n=development
   ```

   <!--
   We have created a deployment whose replica size is 2 that is running the pod
   called `snowflake` with a basic container that serves the hostname.
   -->
   我們建立了一個副本個數為 2 的 Deployment，執行名為 `snowflake` 的
   Pod，其中包含一個負責提供主機名的基本容器。

   ```shell
   kubectl get deployment -n=development
   ```
   ```
   NAME         READY   UP-TO-DATE   AVAILABLE   AGE
   snowflake    2/2     2            2           2m
   ```
   ```shell
   kubectl get pods -l app=snowflake -n=development
   ```
   ```
   NAME                         READY     STATUS    RESTARTS   AGE
   snowflake-3968820950-9dgr8   1/1       Running   0          2m
   snowflake-3968820950-vgc4n   1/1       Running   0          2m
   ```

   <!--
   And this is great, developers are able to do what they want, and they do not have to worry about affecting content in the `production` namespace.

   Let's switch to the `production` namespace and show how resources in one namespace are hidden from the other.

   The `production` namespace should be empty, and the following commands should return nothing.
   -->
   看起來還不錯，開發人員能夠做他們想做的事，而且他們不必擔心會影響到
   `production` 名字空間下面的內容。

   讓我們切換到 `production` 名字空間，展示一下一個名字空間中的資源是如何對
   另一個名字空間隱藏的。

   名字空間 `production` 應該是空的，下面的命令應該不會返回任何東西。

   ```shell
   kubectl get deployment -n=production
   kubectl get pods -n=production
   ```

   <!--
   Production likes to run cattle, so let's create some cattle pods.
   -->
   生產環境下一般以養牛的方式執行負載，所以讓我們建立一些 Cattle（牛）Pod。

   ```shell
   kubectl create deployment cattle --image=k8s.gcr.io/serve_hostname -n=production
   kubectl scale deployment cattle --replicas=5 -n=production

   kubectl get deployment -n=production
   ```
   ```
   NAME         READY   UP-TO-DATE   AVAILABLE   AGE
   cattle       5/5     5            5           10s
   ```

   ```shell
   kubectl get pods -l app=cattle -n=production
   ```
   ```
   NAME                      READY     STATUS    RESTARTS   AGE
   cattle-2263376956-41xy6   1/1       Running   0          34s
   cattle-2263376956-kw466   1/1       Running   0          34s
   cattle-2263376956-n4v97   1/1       Running   0          34s
   cattle-2263376956-p5p3i   1/1       Running   0          34s
   cattle-2263376956-sxpth   1/1       Running   0          34s
   ```

<!--
At this point, it should be clear that the resources users create in one namespace are hidden from the other namespace.
-->
此時，應該很清楚的展示了使用者在一個名字空間中建立的資源對另一個名字空間是隱藏的。

<!--
As the policy support in Kubernetes evolves, we will extend this scenario to show how you can provide different
authorization rules for each namespace.
-->
隨著 Kubernetes 中的策略支援的發展，我們將擴充套件此場景，以展示如何為每個名字空間提供不同的授權規則。

<!-- discussion -->

<!--
## Understanding the motivation for using namespaces
-->
## 理解使用名字空間的動機

<!--
A single cluster should be able to satisfy the needs of multiple users or groups of users (henceforth a 'user community').
-->
單個叢集應該能滿足多個使用者及使用者組的需求（以下稱為 “使用者社群”）。

<!-- Kubernetes _namespaces_ help different projects, teams, or customers to share a Kubernetes cluster. -->
Kubernetes _名字空間_ 幫助不同的專案、團隊或客戶去共享 Kubernetes 叢集。

<!--
It does this by providing the following:

1. A scope for [Names](/docs/concepts/overview/working-with-objects/names/).
2. A mechanism to attach authorization and policy to a subsection of the cluster.
-->
名字空間透過以下方式實現這點：

1. 為[名字](/zh-cn/docs/concepts/overview/working-with-objects/names/)設定作用域.
2. 為叢集中的部分資源關聯鑑權和策略的機制。

<!--
Use of multiple namespaces is optional.
-->
使用多個名字空間是可選的。

<!--
Each user community wants to be able to work in isolation from other communities.
-->
每個使用者社群都希望能夠與其他社群隔離開展工作。

<!--
Each user community has its own:

1. resources (pods, services, replication controllers, etc.)
2. policies (who can or cannot perform actions in their community)
3. constraints (this community is allowed this much quota, etc.)
-->
每個使用者社群都有自己的：

1. 資源（pods、服務、 副本控制器等等）
2. 策略（誰能或不能在他們的社群裡執行操作）
3. 約束（該社群允許多少配額，等等）

<!--
A cluster operator may create a Namespace for each unique user community.
-->
叢集運營者可以為每個唯一使用者社群建立名字空間。

<!--
The Namespace provides a unique scope for:

1. named resources (to avoid basic naming collisions)
2. delegated management authority to trusted users
3. ability to limit community resource consumption
-->
名字空間為下列內容提供唯一的作用域：

1. 命名資源（避免基本的命名衝突）
2. 將管理許可權委派給可信使用者
3. 限制社群資源消耗的能力

<!--
Use cases include:

1.  As a cluster operator, I want to support multiple user communities on a single cluster.
2.  As a cluster operator, I want to delegate authority to partitions of the cluster to trusted users
    in those communities.
3.  As a cluster operator, I want to limit the amount of resources each community can consume in order
    to limit the impact to other communities using the cluster.
4.  As a cluster user, I want to interact with resources that are pertinent to my user community in
    isolation of what other user communities are doing on the cluster.
-->

用例包括:
1.  作為叢集運營者, 我希望能在單個叢集上支援多個使用者社群。
2.  作為叢集運營者，我希望將叢集分割槽的許可權委派給這些社群中的受信任使用者。
3.  作為叢集運營者，我希望能限定每個使用者社群可使用的資源量，以限制對使用同一叢集的其他使用者社群的影響。
4.  作為叢集使用者，我希望與我的使用者社群相關的資源進行互動，而與其他使用者社群在該叢集上執行的操作無關。

<!--
## Understanding namespaces and DNS
-->
## 理解名字空間和 DNS

<!--
When you create a [Service](/docs/concepts/services-networking/service/), it creates a corresponding [DNS entry](/docs/concepts/services-networking/dns-pod-service/).
This entry is of the form `<service-name>.<namespace-name>.svc.cluster.local`, which means
that if a container uses `<service-name>` it will resolve to the service which
is local to a namespace.  This is useful for using the same configuration across
multiple namespaces such as Development, Staging and Production.  If you want to reach
across namespaces, you need to use the fully qualified domain name (FQDN).
-->
當你建立[服務](/zh-cn/docs/concepts/services-networking/service/)時，Kubernetes
會建立相應的 [DNS 條目](/zh-cn/docs/concepts/services-networking/dns-pod-service/)。
此條目的格式為 `<服務名稱>.<名字空間名稱>.svc.cluster.local`。
這意味著如果容器使用 `<服務名稱>`，它將解析為名字空間本地的服務。
這對於在多個名字空間（如開發、暫存和生產）中使用相同的配置非常有用。
如果要跨名字空間訪問，則需要使用完全限定的域名（FQDN）。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [setting the namespace preference](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference).
* Learn more about [setting the namespace for a request](/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-for-a-request)
* See [namespaces design](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture/namespaces.md).
-->

* 進一步瞭解[設定名字空間偏好](/zh-cn/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-preference)
* 進一步瞭解[設定請求的名字空間](/zh-cn/docs/concepts/overview/working-with-objects/namespaces/#setting-the-namespace-for-a-request)
* 參閱[名字空間的設計文件](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/architecture/namespaces.md)

