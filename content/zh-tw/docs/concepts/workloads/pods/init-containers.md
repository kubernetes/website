---
title: Init 容器
content_type: concept
weight: 40
---
<!---
reviewers:
- erictune
title: Init Containers
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
This page provides an overview of init containers: specialized containers that run
before app containers in a {{< glossary_tooltip text="Pod" term_id="pod" >}}.
Init containers can contain utilities or setup scripts not present in an app image.
-->
本頁提供了 Init 容器的概覽。Init 容器是一種特殊容器，在 {{< glossary_tooltip text="Pod" term_id="pod" >}}
內的應用容器啟動之前執行。Init 容器可以包括一些應用映象中不存在的實用工具和安裝指令碼。

<!--
You can specify init containers in the Pod specification alongside the `containers`
array (which describes app containers).
-->
你可以在 Pod 的規約中與用來描述應用容器的 `containers` 陣列平行的位置指定
Init 容器。

<!-- body -->

<!--
## Understanding init containers

A {{< glossary_tooltip text="Pod" term_id="pod" >}} can have multiple containers
running apps within it, but it can also have one or more init containers, which are run
before the app containers are started.
-->
## 理解 Init 容器

每個 {{< glossary_tooltip text="Pod" term_id="pod" >}} 中可以包含多個容器，
應用執行在這些容器裡面，同時 Pod 也可以有一個或多個先於應用容器啟動的 Init 容器。

<!--
Init containers are exactly like regular containers, except:

* Init containers always run to completion.
* Each init container must complete successfully before the next one starts.
-->
Init 容器與普通的容器非常像，除了如下兩點：

* 它們總是執行到完成。
* 每個都必須在下一個啟動之前成功完成。

<!--
If a Pod's init container fails, the kubelet repeatedly restarts that init container until it succeeds.
However, if the Pod has a `restartPolicy` of Never, and an init container fails during startup of that Pod, Kubernetes treats the overall Pod as failed.
-->
如果 Pod 的 Init 容器失敗，kubelet 會不斷地重啟該 Init 容器直到該容器成功為止。
然而，如果 Pod 對應的 `restartPolicy` 值為 "Never"，並且 Pod 的 Init 容器失敗，
則 Kubernetes 會將整個 Pod 狀態設定為失敗。

<!--
To specify an init container for a Pod, add the `initContainers` field into
the [Pod specification](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec),
as an array of `container` items (similar to the app `containers` field and its contents).
See [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) in the
API reference for more details.

The status of the init containers is returned in `.status.initContainerStatuses`
field as an array of the container statuses (similar to the `.status.containerStatuses`
field).
-->
為 Pod 設定 Init 容器需要在 [Pod 規約](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)
中新增 `initContainers` 欄位，
該欄位以 [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
型別物件陣列的形式組織，和應用的 `containers` 陣列同級相鄰。
參閱 API 參考的[容器](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)章節瞭解詳情。

Init 容器的狀態在 `status.initContainerStatuses` 欄位中以容器狀態陣列的格式返回
（類似 `status.containerStatuses` 欄位）。

<!--
### Differences from regular containers

Init containers support all the fields and features of app containers,
including resource limits, volumes, and security settings. However, the
resource requests and limits for an init container are handled differently,
as documented in [Resources](#resources).

Also, init containers do not support `lifecycle`, `livenessProbe`, `readinessProbe`, or
`startupProbe` because they must run to completion before the Pod can be ready.

If you specify multiple init containers for a Pod, Kubelet runs each init
container sequentially. Each init container must succeed before the next can run.
When all of the init containers have run to completion, Kubelet initializes
the application containers for the Pod and runs them as usual.
-->
### 與普通容器的不同之處

Init 容器支援應用容器的全部欄位和特性，包括資源限制、資料卷和安全設定。
然而，Init 容器對資源請求和限制的處理稍有不同，在下面[資源](#resources)節有說明。

同時 Init 容器不支援 `lifecycle`、`livenessProbe`、`readinessProbe` 和 `startupProbe`，
因為它們必須在 Pod 就緒之前執行完成。

如果為一個 Pod 指定了多個 Init 容器，這些容器會按順序逐個執行。
每個 Init 容器必須執行成功，下一個才能夠執行。當所有的 Init 容器執行完成時，
Kubernetes 才會為 Pod 初始化應用容器並像平常一樣執行。

<!--
## Using init containers

Because init containers have separate images from app containers, they
have some advantages for start-up related code:

* Init containers can contain utilities or custom code for setup that are not present in an app
  image. For example, there is no need to make an image `FROM` another image just to use a tool like
  `sed`, `awk`, `python`, or `dig` during setup.
* The application image builder and deployer roles can work independently without
  the need to jointly build a single app image.
* Init containers can run with a different view of the filesystem than app containers in the
  same Pod. Consequently, they can be given access to
  {{< glossary_tooltip text="Secrets" term_id="secret" >}} that app containers cannot access.
* Because init containers run to completion before any app containers start, init containers offer
  a mechanism to block or delay app container startup until a set of preconditions are met. Once
  preconditions are met, all of the app containers in a Pod can start in parallel.
* Init containers can securely run utilities or custom code that would otherwise make an app
  container image less secure. By keeping unnecessary tools separate you can limit the attack
  surface of your app container image.
-->
## 使用 Init 容器

因為 Init 容器具有與應用容器分離的單獨映象，其啟動相關程式碼具有如下優勢：

* Init 容器可以包含一些安裝過程中應用容器中不存在的實用工具或個性化程式碼。
  例如，沒有必要僅為了在安裝過程中使用類似 `sed`、`awk`、`python` 或 `dig`
  這樣的工具而去 `FROM` 一個映象來生成一個新的映象。

* Init 容器可以安全地執行這些工具，避免這些工具導致應用映象的安全性降低。

* 應用映象的建立者和部署者可以各自獨立工作，而沒有必要聯合構建一個單獨的應用映象。

* Init 容器能以不同於 Pod 內應用容器的檔案系統檢視執行。因此，Init 容器可以訪問
  應用容器不能訪問的 {{< glossary_tooltip text="Secret" term_id="secret" >}} 的許可權。

* 由於 Init 容器必須在應用容器啟動之前執行完成，因此 Init
  容器提供了一種機制來阻塞或延遲應用容器的啟動，直到滿足了一組先決條件。
  一旦前置條件滿足，Pod 內的所有的應用容器會並行啟動。

<!--
### Examples

Here are some ideas for how to use init containers:

* Wait for a {{< glossary_tooltip text="Service" term_id="service">}} to
  be created, using a shell one-line command like:
-->
### 示例  {#examples}

下面是一些如何使用 Init 容器的想法：

* 等待一個 Service 完成建立，透過類似如下 Shell 命令：

  ```shell
  for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; done; exit 1
  ```

<!--
* Register this Pod with a remote server from the downward API with a command like:
-->
* 註冊這個 Pod 到遠端伺服器，透過在命令中呼叫 API，類似如下：

  ```shell
  curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'
  ```

<!--
* Wait for some time before starting the app container with a command like
-->
* 在啟動應用容器之前等一段時間，使用類似命令：

  ```shell
  sleep 60
  ```
<!--
* Clone a Git repository into a {{< glossary_tooltip text="Volume" term_id="volume" >}}

* Place values into a configuration file and run a template tool to dynamically
  generate a configuration file for the main app container. For example,
  place the `POD_IP` value in a configuration and generate the main app
  configuration file using Jinja.
-->
* 克隆 Git 倉庫到{{< glossary_tooltip text="卷" term_id="volume" >}}中。

* 將配置值放到配置檔案中，執行模板工具為主應用容器動態地生成配置檔案。
  例如，在配置檔案中存放 `POD_IP` 值，並使用 Jinja 生成主應用配置檔案。

<!--
#### Init containers in use

This example defines a simple Pod that has two init containers.
The first waits for `myservice`, and the second waits for `mydb`. Once both
init containers complete, the Pod runs the app container from its `spec` section.
-->
### 使用 Init 容器的情況

下面的例子定義了一個具有 2 個 Init 容器的簡單 Pod。 第一個等待 `myservice` 啟動，
第二個等待 `mydb` 啟動。 一旦這兩個 Init容器 都啟動完成，Pod 將啟動 `spec` 節中的應用容器。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup myservice.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for myservice; sleep 2; done"]
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup mydb.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for mydb; sleep 2; done"]
```

<!--
You can start this Pod by running:
-->
你透過執行下面的命令啟動 Pod：

```shell
kubectl apply -f myapp.yaml
```
<!--
The output is similar to this:
-->
輸出類似於：

```
pod/myapp-pod created
```

<!--
And check on its status with:
-->
使用下面的命令檢查其狀態：

```shell
kubectl get -f myapp.yaml
```

<!--
The output is similar to this:
-->
輸出類似於：

```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

<!--
or for more details:
-->
或者檢視更多詳細資訊：

```shell
kubectl describe -f myapp.yaml
```

<!--
The output is similar to this:
-->
輸出類似於：

```
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app=myapp
Status:        Pending
[...]
Init Containers:
  init-myservice:
[...]
    State:         Running
[...]
  init-mydb:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Containers:
  myapp-container:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Events:
  FirstSeen    LastSeen    Count    From                      SubObjectPath                           Type          Reason        Message
  ---------    --------    -----    ----                      -------------                           --------      ------        -------
  16s          16s         1        {default-scheduler }                                              Normal        Scheduled     Successfully assigned myapp-pod to 172.17.4.201
  16s          16s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulling       pulling image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulled        Successfully pulled image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container with docker id 5ced34a04634; Security:[seccomp=unconfined]
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container with docker id 5ced34a04634
```

<!--
To see logs for the init containers in this Pod, run:
-->
如需檢視 Pod 內 Init 容器的日誌，請執行：

```shell
kubectl logs myapp-pod -c init-myservice # 檢視第一個 Init 容器
kubectl logs myapp-pod -c init-mydb      # 檢視第二個 Init 容器
```

<!--
At this point, those init containers will be waiting to discover Services named
`mydb` and `myservice`.

Here's a configuration you can use to make those Services appear:
-->
在這一刻，Init 容器將會等待至發現名稱為 `mydb` 和 `myservice` 的 Service。

如下為建立這些 Service 的配置檔案：

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
---
apiVersion: v1
kind: Service
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

<!--
To create the `mydb` and `myservice` services:
-->
建立 `mydb` 和 `myservice` 服務的命令：

```shell
kubectl create -f services.yaml
```
<!--
The output is similar to this:
-->
輸出類似於：
```
service "myservice" created
service "mydb" created
```

<!--
You'll then see that those init containers complete, and that the `myapp-pod`
Pod moves into the Running state:
-->
這樣你將能看到這些 Init 容器執行完畢，隨後 `my-app` 的 Pod 進入 `Running` 狀態：

```shell
kubectl get -f myapp.yaml
```
<!--
The output is similar to this:
-->
輸出類似於：
```
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

<!--
This simple example should provide some inspiration for you to create your own
init containers. [What's next](#what-s-next) contains a link to a more detailed example.
-->
這個簡單例子應該能為你建立自己的 Init 容器提供一些啟發。
[接下來](#what-s-next)節提供了更詳細例子的連結。

<!--
## Detailed behavior

During Pod startup, the kubelet delays running init containers until the networking
and storage are ready. Then the kubelet runs the Pod's init containers in the order
they appear in the Pod's spec.
-->
## 具體行為 {#detailed-behavior}

在 Pod 啟動過程中，每個 Init 容器會在網路和資料卷初始化之後按順序啟動。
kubelet 執行依據 Init 容器在 Pod 規約中的出現順序依次執行之。

<!--
Each init container must exit successfully before
the next container starts. If a container fails to start due to the runtime or
exits with failure, it is retried according to the Pod `restartPolicy`. However,
if the Pod `restartPolicy` is set to Always, the init containers use
`restartPolicy` OnFailure.
-->
每個 Init 容器成功退出後才會啟動下一個 Init 容器。
如果某容器因為容器執行時的原因無法啟動，或以錯誤狀態退出，kubelet 會根據
Pod 的 `restartPolicy` 策略進行重試。
然而，如果 Pod 的 `restartPolicy` 設定為 "Always"，Init 容器失敗時會使用
`restartPolicy` 的 "OnFailure" 策略。

<!--
A Pod cannot be `Ready` until all init containers have succeeded. The ports on an
init container are not aggregated under a Service. A Pod that is initializing
is in the `Pending` state but should have a condition `Initialized` set to false.

If the Pod [restarts](#pod-restart-reasons), or is restarted, all init containers
must execute again.
-->
在所有的 Init 容器沒有成功之前，Pod 將不會變成 `Ready` 狀態。
Init 容器的埠將不會在 Service 中進行聚集。正在初始化中的 Pod 處於 `Pending` 狀態，
但會將狀況 `Initializing` 設定為 false。

如果 Pod [重啟](#pod-restart-reasons)，所有 Init 容器必須重新執行。

<!--
Changes to the init container spec are limited to the container image field.
Altering an init container image field is equivalent to restarting the Pod.

Because init containers can be restarted, retried, or re-executed, init container
code should be idempotent. In particular, code that writes to files on `EmptyDirs`
should be prepared for the possibility that an output file already exists.
-->
對 Init 容器規約的修改僅限於容器的 `image` 欄位。
更改 Init 容器的 `image` 欄位，等同於重啟該 Pod。

因為 Init 容器可能會被重啟、重試或者重新執行，所以 Init 容器的程式碼應該是冪等的。
特別地，基於 `emptyDirs` 寫檔案的程式碼，應該對輸出檔案可能已經存在做好準備。

<!--
Init containers have all of the fields of an app container. However, Kubernetes
prohibits `readinessProbe` from being used because init containers cannot
define readiness distinct from completion. This is enforced during validation.
-->
Init 容器具有應用容器的所有欄位。然而 Kubernetes 禁止使用 `readinessProbe`，
因為 Init 容器不能定義不同於完成態（Completion）的就緒態（Readiness）。
Kubernetes 會在校驗時強制執行此檢查。

<!--
Use `activeDeadlineSeconds` on the Pod to prevent init containers from failing forever.
The active deadline includes init containers.
However it is recommended to use `activeDeadlineSeconds` only if teams deploy their application
as a Job, because `activeDeadlineSeconds` has an effect even after initContainer finished.
The Pod which is already running correctly would be killed by `activeDeadlineSeconds` if you set.

The name of each app and init container in a Pod must be unique; a
validation error is thrown for any container sharing a name with another.
-->
在 Pod 上使用 `activeDeadlineSeconds` 和在容器上使用 `livenessProbe` 可以避免
Init 容器一直重複失敗。
`activeDeadlineSeconds` 時間包含了 Init 容器啟動的時間。
但建議僅在團隊將其應用程式部署為 Job 時才使用 `activeDeadlineSeconds`，
因為 `activeDeadlineSeconds` 在 Init 容器結束後仍有效果。
如果你設定了 `activeDeadlineSeconds`，已經在正常執行的 Pod 會被殺死。

在 Pod 中的每個應用容器和 Init 容器的名稱必須唯一；
與任何其它容器共享同一個名稱，會在校驗時丟擲錯誤。

<!--
### Resources

Given the ordering and execution for init containers, the following rules
for resource usage apply:
-->
### 資源 {#resources}

在給定的 Init 容器執行順序下，資源使用適用於如下規則：

<!--
* The highest of any particular resource request or limit defined on all init
  containers is the *effective init request/limit*. If any resource has no
  resource limit specified this is considered as the highest limit.
* The Pod's *effective request/limit* for a resource is the higher of:
  * the sum of all app containers request/limit for a resource
  * the effective init request/limit for a resource
-->
* 所有 Init 容器上定義的任何特定資源的 limit 或 request 的最大值，作為
  Pod **有效初始 request/limit**。
  如果任何資源沒有指定資源限制，這被視為最高限制。
* Pod 對資源的 **有效 limit/request** 是如下兩者中的較大者：
  * 所有應用容器對某個資源的 limit/request 之和
  * 對某個資源的有效初始 limit/request

<!--
* Scheduling is done based on effective requests/limits, which means
  init containers can reserve resources for initialization that are not used
  during the life of the Pod.
* The QoS (quality of service) tier of the Pod's *effective QoS tier* is the
  QoS tier for init containers and app containers alike.
-->
* 基於有效 limit/request 完成排程，這意味著 Init 容器能夠為初始化過程預留資源，
  這些資源在 Pod 生命週期過程中並沒有被使用。
* Pod 的 **有效 QoS 層** ，與 Init 容器和應用容器的一樣。

<!--
Quota and limits are applied based on the effective Pod request and limit.
Pod level control groups (cgroups) are based on the effective Pod request and limit, the same as the scheduler.
-->
配額和限制適用於有效 Pod 的請求和限制值。
Pod 級別的 cgroups 是基於有效 Pod 的請求和限制值，和排程器相同。

<!--
### Pod restart reasons

A Pod can restart, causing re-execution of init containers, for the following
reasons:
-->
### Pod 重啟的原因  {#pod-restart-reasons}

Pod 重啟會導致 Init 容器重新執行，主要有如下幾個原因：

<!--
* The Pod infrastructure container is restarted. This is uncommon and would
  have to be done by someone with root access to nodes.
* All containers in a Pod are terminated while `restartPolicy` is set to Always,
  forcing a restart, and the init container completion record has been lost due
  to garbage collection.
-->
* Pod 的基礎設施容器 (譯者注：如 `pause` 容器) 被重啟。這種情況不多見，
  必須由具備 root 許可權訪問節點的人員來完成。

* 當 `restartPolicy` 設定為 "`Always`"，Pod 中所有容器會終止而強制重啟。
  由於垃圾收集機制的原因，Init 容器的完成記錄將會丟失。

<!--
The Pod will not be restarted when the init container image is changed, or the
init container completion record has been lost due to garbage collection. This
applies for Kubernetes v1.20 and later. If you are using an earlier version of
Kubernetes, consult the documentation for the version you are using.
-->
當 Init 容器的映象發生改變或者 Init 容器的完成記錄因為垃圾收集等原因被丟失時，
Pod 不會被重啟。這一行為適用於 Kubernetes v1.20 及更新版本。
如果你在使用較早版本的 Kubernetes，可查閱你所使用的版本對應的文件。

## {{% heading "whatsnext" %}}

<!--
* Read about [creating a Pod that has an init container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)
* Learn how to [debug init containers](/docs/tasks/debug/debug-application/debug-init-containers/)
-->
* 閱讀[建立包含 Init 容器的 Pod](/zh-cn/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)
* 學習如何[除錯 Init 容器](/zh-cn/docs/tasks/debug/debug-application/debug-init-containers/)

