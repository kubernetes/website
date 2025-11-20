---
title: "Kubernetes 和 Docker 簡單的 leader election"
date: 2016-01-11
slug: simple-leader-election-with-kubernetes
---
<!--
title: " Simple leader election with Kubernetes and Docker "
date: 2016-01-11
slug: simple-leader-election-with-kubernetes
-->

<!--
####  Overview

Kubernetes simplifies the deployment and operational management of services running on clusters. However, it also simplifies the development of these services. In this post we'll see how you can use Kubernetes to easily perform leader election in your distributed application. Distributed applications usually replicate the tasks of a service for reliability and scalability, but often it is necessary to designate one of the replicas as the leader who is responsible for coordination among all of the replicas.
-->
#### 概述

Kubernetes 簡化了叢集上運行的服務的部署和操作管理。但是，它也簡化了這些服務的發展。在本文中，我們將看到如何使用 Kubernetes 在分佈式應用程式中輕鬆地執行 leader election。分佈式應用程式通常爲了可靠性和可伸縮性而複製服務的任務，但通常需要指定其中一個副本作爲負責所有副本之間協調的負責人。

<!--
Typically in leader election, a set of candidates for becoming leader is identified. These candidates all race to declare themselves the leader. One of the candidates wins and becomes the leader. Once the election is won, the leader continually "heartbeats" to renew their position as the leader, and the other candidates periodically make new attempts to become the leader. This ensures that a new leader is identified quickly, if the current leader fails for some reason.
-->

通常在 leader election 中，會確定一組成爲領導者的候選人。這些候選人都競相宣佈自己爲領袖。其中一位候選人獲勝併成爲領袖。一旦選舉獲勝，領導者就會不斷地“信號”以表示他們作爲領導者的地位，其他候選人也會定期地做出新的嘗試來成爲領導者。這樣可以確保在當前領導因某種原因失敗時，快速確定新領導。

<!--
Implementing leader election usually requires either deploying software such as ZooKeeper, etcd or Consul and using it for consensus, or alternately, implementing a consensus algorithm on your own. We will see below that Kubernetes makes the process of using leader election in your application significantly easier.

####  Implementing leader election in Kubernetes
-->

實現 leader election 通常需要部署 ZooKeeper、etcd 或 Consul 等軟體並將其用於協商一致，或者也可以自己實現協商一致算法。我們將在下面看到，Kubernetes 使在應用程式中使用 leader election 的過程大大簡化。

####在 Kubernetes 實施領導人選舉

<!--
The first requirement in leader election is the specification of the set of candidates for becoming the leader. Kubernetes already uses _Endpoints_ to represent a replicated set of pods that comprise a service, so we will re-use this same object. (aside: You might have thought that we would use _ReplicationControllers_, but they are tied to a specific binary, and generally you want to have a single leader even if you are in the process of performing a rolling update)

To perform leader election, we use two properties of all Kubernetes API objects:
-->

Leader election 的首要條件是確定候選人的人選。Kubernetes 已經使用 _Endpoints_ 來表示組成服務的一組複製 pod，因此我們將重用這個相同的對象。（旁白：您可能認爲我們會使用 _ReplicationControllers_，但它們是綁定到特定的二進制檔案，而且通常您希望只有一個領導者，即使您正在執行滾動更新）

要執行 leader election，我們使用所有 Kubernetes api 對象的兩個屬性：

<!--
* ResourceVersions - Every API object has a unique ResourceVersion, and you can use these versions to perform compare-and-swap on Kubernetes objects
* Annotations - Every API object can be annotated with arbitrary key/value pairs to be used by clients.

Given these primitives, the code to use master election is relatively straightforward, and you can find it [here][1]. Let's run it ourselves.
-->

* ResourceVersions - 每個 API 對象都有一個惟一的 ResourceVersion，您可以使用這些版本對 Kubernetes 對象執行比較和交換
* Annotations - 每個 API 對象都可以用客戶端使用的任意鍵/值對進行註釋。

給定這些原語，使用 master election 的代碼相對簡單，您可以在這裏找到[here][1]。我們自己來做吧。

<!--
```
$ kubectl run leader-elector --image=gcr.io/google_containers/leader-elector:0.4 --replicas=3 -- --election=example
```

This creates a leader election set with 3 replicas:

```
$ kubectl get pods
NAME                   READY     STATUS    RESTARTS   AGE
leader-elector-inmr1   1/1       Running   0          13s
leader-elector-qkq00   1/1       Running   0          13s
leader-elector-sgwcq   1/1       Running   0          13s
```
-->

```
$ kubectl run leader-elector --image=gcr.io/google_containers/leader-elector:0.4 --replicas=3 -- --election=example
```

這將創建一個包含3個副本的 leader election 集合：

```
$ kubectl get pods
NAME                   READY     STATUS    RESTARTS   AGE
leader-elector-inmr1   1/1       Running   0          13s
leader-elector-qkq00   1/1       Running   0          13s
leader-elector-sgwcq   1/1       Running   0          13s
```

<!--
To see which pod was chosen as the leader, you can access the logs of one of the pods, substituting one of your own pod's names in place of

```
${pod_name}, (e.g. leader-elector-inmr1 from the above)

$ kubectl logs -f ${name}
leader is (leader-pod-name)
```
… Alternately, you can inspect the endpoints object directly:
-->

要查看哪個pod被選爲領導，您可以訪問其中一個 pod 的日誌，用您自己的一個 pod 的名稱替換

```
${pod_name}, (e.g. leader-elector-inmr1 from the above)

$ kubectl logs -f ${name}
leader is (leader-pod-name)
```
…或者，可以直接檢查 endpoints 對象：

<!--
_'example' is the name of the candidate set from the above kubectl run … command_
```
$ kubectl get endpoints example -o yaml
```
Now to validate that leader election actually works, in a different terminal, run:

```
$ kubectl delete pods (leader-pod-name)
```
-->

_'example' 是上面 kubectl run … 命令_中候選集的名稱
```
$ kubectl get endpoints example -o yaml
```
現在，要驗證 leader election 是否實際有效，請在另一個終端運行：
```
$ kubectl delete pods (leader-pod-name)
```

<!--
This will delete the existing leader. Because the set of pods is being managed by a replication controller, a new pod replaces the one that was deleted, ensuring that the size of the replicated set is still three. Via leader election one of these three pods is selected as the new leader, and you should see the leader failover to a different pod. Because pods in Kubernetes have a _grace period_ before termination, this may take 30-40 seconds.

The leader-election container provides a simple webserver that can serve on any address (e.g. http://localhost:4040). You can test this out by deleting the existing leader election group and creating a new one where you additionally pass in a --http=(host):(port) specification to the leader-elector image. This causes each member of the set to serve information about the leader via a webhook.
-->

這將刪除現有領導。由於 pod 集由 replication controller 管理，因此新的 pod 將替換已刪除的pod，確保複製集的大小仍爲3。通過 leader election，這三個pod中的一個被選爲新的領導者，您應該會看到領導者故障轉移到另一個pod。因爲 Kubernetes 的吊艙在終止前有一個 _grace period_，這可能需要30-40秒。

Leader-election container 提供了一個簡單的 web 伺服器，可以服務於任何地址(e.g. http://localhost:4040)。您可以通過刪除現有的 leader election 組並創建一個新的 leader elector 組來測試這一點，在該組中，您還可以向 leader elector 映像傳遞--http=(host):(port) 規範。這將導致集合中的每個成員通過 webhook 提供有關領導者的資訊。

<!--
```
# delete the old leader elector group
$ kubectl delete rc leader-elector

# create the new group, note the --http=localhost:4040 flag
$ kubectl run leader-elector --image=gcr.io/google_containers/leader-elector:0.4 --replicas=3 -- --election=example --http=0.0.0.0:4040

# create a proxy to your Kubernetes api server
$ kubectl proxy
```
-->

```
# delete the old leader elector group
$ kubectl delete rc leader-elector

# create the new group, note the --http=localhost:4040 flag
$ kubectl run leader-elector --image=gcr.io/google_containers/leader-elector:0.4 --replicas=3 -- --election=example --http=0.0.0.0:4040

# create a proxy to your Kubernetes api server
$ kubectl proxy
```

<!--
You can then access:


http://localhost:8001/api/v1/proxy/namespaces/default/pods/(leader-pod-name):4040/


And you will see:

```
{"name":"(name-of-leader-here)"}
```
####  Leader election with sidecars
-->

然後您可以訪問：




http://localhost:8001/api/v1/proxy/namespaces/default/pods/(leader-pod-name):4040/




你會看到：

```
{"name":"(name-of-leader-here)"}
```
####  有副手的 leader election

<!--
Ok, that's great, you can do leader election and find out the leader over HTTP, but how can you use it from your own application? This is where the notion of sidecars come in. In Kubernetes, Pods are made up of one or more containers. Often times, this means that you add sidecar containers to your main application to make up a Pod. (for a much more detailed treatment of this subject see my earlier blog post).

The leader-election container can serve as a sidecar that you can use from your own application. Any container in the Pod that's interested in who the current master is can simply access http://localhost:4040 and they'll get back a simple JSON object that contains the name of the current master. Since all containers in a Pod share the same network namespace, there's no service discovery required!
-->

好吧，那太好了，你可以通過 HTTP 進行leader election 並找到 leader，但是你如何從自己的應用程式中使用它呢？這就是 sidecar 的由來。Kubernetes  中，Pods 由一個或多個容器組成。通常情況下，這意味着您將 sidecar containers 添加到主應用程式中以組成 pod。（關於這個主題的更詳細的處理，請參閱我之前的博客文章）。
Leader-election container 可以作爲一個 sidecar，您可以從自己的應用程式中使用。Pod 中任何對當前 master 感興趣的容器都可以簡單地訪問http://localhost:4040，它們將返回一個包含當前 master 名稱的簡單 json 對象。由於 pod中 的所有容器共享相同的網路命名空間，因此不需要服務發現！

<!--
For example, here is a simple Node.js application that connects to the leader election sidecar and prints out whether or not it is currently the master. The leader election sidecar sets its identifier to `hostname` by default.

```
var http = require('http');
// This will hold info about the current master
var master = {};

  // The web handler for our nodejs application
  var handleRequest = function(request, response) {
    response.writeHead(200);
    response.end("Master is " + master.name);
  };

  // A callback that is used for our outgoing client requests to the sidecar
  var cb = function(response) {
    var data = '';
    response.on('data', function(piece) { data = data + piece; });
    response.on('end', function() { master = JSON.parse(data); });
  };

  // Make an async request to the sidecar at http://localhost:4040
  var updateMaster = function() {
    var req = http.get({host: 'localhost', path: '/', port: 4040}, cb);
    req.on('error', function(e) { console.log('problem with request: ' + e.message); });
    req.end();
  };

  / / Set up regular updates
  updateMaster();
  setInterval(updateMaster, 5000);

  // set up the web server
  var www = http.createServer(handleRequest);
  www.listen(8080);
  ```
  Of course, you can use this sidecar from any language that you choose that supports HTTP and JSON.
-->

例如，這裏有一個簡單的 Node.js 應用程式，它連接到 leader election sidecar 並打印出它當前是否是 master。預設情況下，leader election sidecar 將其標識符設置爲 `hostname`。

```
var http = require('http');
// This will hold info about the current master
var master = {};

  // The web handler for our nodejs application
  var handleRequest = function(request, response) {
    response.writeHead(200);
    response.end("Master is " + master.name);
  };

  // A callback that is used for our outgoing client requests to the sidecar
  var cb = function(response) {
    var data = '';
    response.on('data', function(piece) { data = data + piece; });
    response.on('end', function() { master = JSON.parse(data); });
  };

  // Make an async request to the sidecar at http://localhost:4040
  var updateMaster = function() {
    var req = http.get({host: 'localhost', path: '/', port: 4040}, cb);
    req.on('error', function(e) { console.log('problem with request: ' + e.message); });
    req.end();
  };

  / / Set up regular updates
  updateMaster();
  setInterval(updateMaster, 5000);

  // set up the web server
  var www = http.createServer(handleRequest);
  www.listen(8080);
  ```
 當然，您可以從任何支持 HTTP 和 JSON 的語言中使用這個 sidecar。

<!--
#### Conclusion


  Hopefully I've shown you how easy it is to build leader election for your distributed application using Kubernetes. In future installments we'll show you how Kubernetes is making building distributed systems even easier. In the meantime, head over to [Google Container Engine][2] or [kubernetes.io][3] to get started with Kubernetes.

  [1]: https://github.com/kubernetes/contrib/pull/353
  [2]: https://cloud.google.com/container-engine/
  [3]: http://kubernetes.io/
-->

#### 結論


 希望我已經向您展示了使用 Kubernetes 爲您的分佈式應用程式構建 leader election 是多麼容易。在以後的部分中，我們將向您展示 Kubernetes 如何使構建分佈式系統變得更加容易。同時，轉到[Google Container Engine][2]或[kubernetes.io][3]開始使用Kubernetes。

  [1]: https://github.com/kubernetes/contrib/pull/353
  [2]: https://cloud.google.com/container-engine/
  [3]: http://kubernetes.io/