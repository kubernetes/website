---
content_type: concept
title: アプリケーションの自己観察とデバッグ
---

<!-- overview -->

アプリケーションが稼働すると、必然的にその問題をデバッグする必要が出てきます。
先に、`kubectl get pods`を使って、Podの簡単なステータス情報を取得する方法を説明しました。
しかし、アプリケーションに関するより多くの情報を取得する方法がいくつかあります。

<!-- body -->

## `kubectl describe pod`を使ってpodの詳細を取得

この例では、先ほどの例と同様に、Deploymentを使用して2つのpodを作成します。

{{< codenew file="application/nginx-with-request.yaml" >}}

以下のコマンドを実行して、Deploymentトを作成します:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-with-request.yaml
```

```none
deployment.apps/nginx-deployment created
```

以下のコマンドでPodの状態を確認します:

```shell
kubectl get pods
```

```none
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1006230814-6winp   1/1       Running   0          11s
nginx-deployment-1006230814-fmgu3   1/1       Running   0          11s
```

`kubectl describe pod`を使うと、これらのPodについてより多くの情報を得ることができます。
例えば:

```shell
kubectl describe pod nginx-deployment-1006230814-6winp
```

```none
Name:		nginx-deployment-1006230814-6winp
Namespace:	default
Node:		kubernetes-node-wul5/10.240.0.9
Start Time:	Thu, 24 Mar 2016 01:39:49 +0000
Labels:		app=nginx,pod-template-hash=1006230814
Annotations:    kubernetes.io/created-by={"kind":"SerializedReference","apiVersion":"v1","reference":{"kind":"ReplicaSet","namespace":"default","name":"nginx-deployment-1956810328","uid":"14e607e7-8ba1-11e7-b5cb-fa16" ...
Status:		Running
IP:		10.244.0.6
Controllers:	ReplicaSet/nginx-deployment-1006230814
Containers:
  nginx:
    Container ID:	docker://90315cc9f513c724e9957a4788d3e625a078de84750f244a40f97ae355eb1149
    Image:		nginx
    Image ID:		docker://6f62f48c4e55d700cf3eb1b5e33fa051802986b77b874cc351cce539e5163707
    Port:		80/TCP
    QoS Tier:
      cpu:	Guaranteed
      memory:	Guaranteed
    Limits:
      cpu:	500m
      memory:	128Mi
    Requests:
      memory:		128Mi
      cpu:		500m
    State:		Running
      Started:		Thu, 24 Mar 2016 01:39:51 +0000
    Ready:		True
    Restart Count:	0
    Environment:        <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-5kdvl (ro)
Conditions:
  Type          Status
  Initialized   True
  Ready         True
  PodScheduled  True
Volumes:
  default-token-4bcbi:
    Type:	Secret (a volume populated by a Secret)
    SecretName:	default-token-4bcbi
    Optional:   false
QoS Class:      Guaranteed
Node-Selectors: <none>
Tolerations:    <none>
Events:
  FirstSeen	LastSeen	Count	From					SubobjectPath		Type		Reason		Message
  ---------	--------	-----	----					-------------		--------	------		-------
  54s		54s		1	{default-scheduler }						Normal		Scheduled	Successfully assigned nginx-deployment-1006230814-6winp to kubernetes-node-wul5
  54s		54s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Pulling		pulling image "nginx"
  53s		53s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Pulled		Successfully pulled image "nginx"
  53s		53s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Created		Created container with docker id 90315cc9f513
  53s		53s		1	{kubelet kubernetes-node-wul5}	spec.containers{nginx}	Normal		Started		Started container with docker id 90315cc9f513
```

ここでは、コンテナ（複数可）とPodに関する構成情報（ラベル、リソース要件など）や、コンテナ（複数可）とPodに関するステータス情報（状態、準備状況、再起動回数、イベントなど）を確認できます。

コンテナの状態は、Waiting（待機中）、Running（実行中）、Terminated（終了）のいずれかです。状態に応じて、追加の情報が提供されます。ここでは、Running状態のコンテナについて、コンテナがいつ開始されたかが表示されています。

Readyは、コンテナが最後のレディネスプローブに合格したかどうかを示す。(この場合、コンテナにはレディネスプローブが設定されていません。レディネスプローブが設定されていない場合、コンテナはレディであるとみなされます)。

Restart Countは、コンテナが何回再起動されたかを示します。この情報は、再起動ポリシーが「always」に設定されているコンテナのクラッシュループを検出するのに役立ちます。

現在、Podに関連する条件は、バイナリのReady条件のみです。これは、Podがリクエストに対応可能であり、マッチングするすべてのサービスのロードバランシングプールに追加されるべきであることを示します。

最後に、Podに関連する最近のイベントのログが表示されます。このシステムでは、複数の同一イベントを圧縮して、最初に見られた時刻と最後に見られた時刻、そして見られた回数を示します。"From"はイベントを記録しているコンポーネントを示し、"SubobjectPath"はどのオブジェクト（例：ポッド内のコンテナ）が参照されているかを示し、"Reason"と "Message"は何が起こったかを示しています。

## 例：Pending Podsのデバッグ

イベントを使って検出できる一般的なシナリオは、どのノードにも収まらないPodを作成した場合です。例えば、Podがどのノードでも空いている以上のリソースを要求したり、どのノードにもマッチしないラベルセレクタを指定したりする場合です。例えば、各(仮想)マシンが1つのCPUを持つ4ノードのクラスター上で、（2つではなく）5つのレプリカを持ち、500ではなく600のミリコアを要求する前のDeploymentを作成したとします。この場合、Podの1つがスケジュールできなくなります。(なお、各ノードではfluentdやskydnsなどのクラスタアドオンポッドが動作しているため、もし1000ミリコアを要求した場合、どのポッドもスケジュールできなくなります)

```shell
kubectl get pods
```

```none
NAME                                READY     STATUS    RESTARTS   AGE
nginx-deployment-1006230814-6winp   1/1       Running   0          7m
nginx-deployment-1006230814-fmgu3   1/1       Running   0          7m
nginx-deployment-1370807587-6ekbw   1/1       Running   0          1m
nginx-deployment-1370807587-fg172   0/1       Pending   0          1m
nginx-deployment-1370807587-fz9sd   0/1       Pending   0          1m
```

nginx-deployment-1370807587-fz9sdのPodが実行されていない理由を調べるには、保留中のPodに対して`kubectl describe pod`を使用し、そのイベントを見てみましょう

```shell
kubectl describe pod nginx-deployment-1370807587-fz9sd
```

```none
  Name:		nginx-deployment-1370807587-fz9sd
  Namespace:	default
  Node:		/
  Labels:		app=nginx,pod-template-hash=1370807587
  Status:		Pending
  IP:
  Controllers:	ReplicaSet/nginx-deployment-1370807587
  Containers:
    nginx:
      Image:	nginx
      Port:	80/TCP
      QoS Tier:
        memory:	Guaranteed
        cpu:	Guaranteed
      Limits:
        cpu:	1
        memory:	128Mi
      Requests:
        cpu:	1
        memory:	128Mi
      Environment Variables:
  Volumes:
    default-token-4bcbi:
      Type:	Secret (a volume populated by a Secret)
      SecretName:	default-token-4bcbi
  Events:
    FirstSeen	LastSeen	Count	From			        SubobjectPath	Type		Reason			    Message
    ---------	--------	-----	----			        -------------	--------	------			    -------
    1m		    48s		    7	    {default-scheduler }			        Warning		FailedScheduling	pod (nginx-deployment-1370807587-fz9sd) failed to fit in any node
  fit failure on node (kubernetes-node-6ta5): Node didn't have enough resource: CPU, requested: 1000, used: 1420, capacity: 2000
  fit failure on node (kubernetes-node-wul5): Node didn't have enough resource: CPU, requested: 1000, used: 1100, capacity: 2000
```

ここでは、理由 `FailedScheduling` (およびその他の理由)でPodのスケジュールに失敗したという、スケジューラによって生成されたイベントを見ることができます。このメッセージは、どのノードでもPodに十分なリソースがなかったことを示しています。

この状況を修正するには、`kubectl scale`を使用して、4つ以下のレプリカを指定するようにDeploymentを更新します。(あるいは、1つのPodを保留にしたままにしておいても害はありません。)

kubectl describe pod`の最後に出てきたようなイベントは、etcdに永続化され、クラスタで何が起こっているかについての高レベルの情報を提供します。

すべてのイベントをリストアップするには、次のようにします:


```shell
kubectl get events
```

しかし、イベントは名前空間であることを忘れてはいけません。つまり、名前空間で管理されているオブジェクトのイベントに興味がある場合(例：名前空間 `my-namespace`のPods で何が起こったか)コマンドに名前空間を明示的に指定する必要があります。

```shell
kubectl get events --namespace=my-namespace
```

すべての名前空間からのイベントを見るには、`--all-namespaces` 引数を使用できます。

`kubectl describe pod`に加えて、(`kubectl get pod` で提供される以上の)Podに関する追加情報を得るためのもう一つの方法は、`-o yaml`出力形式フラグを `kubectl get pod`に渡すことです。これにより、`kubectl describe pod`よりもさらに多くの情報、つまりシステムが持っているPodに関するすべての情報をYAML形式で得ることができます。ここでは、アノテーション（Kubernetesのシステムコンポーネントが内部的に使用している、ラベル制限のないキーバリューのメタデータ）、再起動ポリシー、ポート、ボリュームなどが表示されます。

```shell
kubectl get pod nginx-deployment-1006230814-6winp -o yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/created-by: |
      {"kind":"SerializedReference","apiVersion":"v1","reference":{"kind":"ReplicaSet","namespace":"default","name":"nginx-deployment-1006230814","uid":"4c84c175-f161-11e5-9a78-42010af00005","apiVersion":"extensions","resourceVersion":"133434"}}
  creationTimestamp: 2016-03-24T01:39:50Z
  generateName: nginx-deployment-1006230814-
  labels:
    app: nginx
    pod-template-hash: "1006230814"
  name: nginx-deployment-1006230814-6winp
  namespace: default
  resourceVersion: "133447"
  uid: 4c879808-f161-11e5-9a78-42010af00005
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: nginx
    ports:
    - containerPort: 80
      protocol: TCP
    resources:
      limits:
        cpu: 500m
        memory: 128Mi
      requests:
        cpu: 500m
        memory: 128Mi
    terminationMessagePath: /dev/termination-log
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: default-token-4bcbi
      readOnly: true
  dnsPolicy: ClusterFirst
  nodeName: kubernetes-node-wul5
  restartPolicy: Always
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  volumes:
  - name: default-token-4bcbi
    secret:
      secretName: default-token-4bcbi
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: 2016-03-24T01:39:51Z
    status: "True"
    type: Ready
  containerStatuses:
  - containerID: docker://90315cc9f513c724e9957a4788d3e625a078de84750f244a40f97ae355eb1149
    image: nginx
    imageID: docker://6f62f48c4e55d700cf3eb1b5e33fa051802986b77b874cc351cce539e5163707
    lastState: {}
    name: nginx
    ready: true
    restartCount: 0
    state:
      running:
        startedAt: 2016-03-24T01:39:51Z
  hostIP: 10.240.0.9
  phase: Running
  podIP: 10.244.0.6
  startTime: 2016-03-24T01:39:49Z
```

## 例：ダウン／到達不可能なノードのデバッグ

例えば、ノード上で動作しているPodのおかしな挙動に気付いたり、Podがノード上でスケジュールされない原因を探ったりと、デバッグ時にノードのステータスを見ることが有用な場合があります。Podと同様に、`kubectl describe node`や`kubectl get node -o yaml`を使ってノードの詳細情報を取得することができます。例えば、ノードがダウンした場合（ネットワークから切断された、またはkubeletが死んで再起動しないなど）に表示される内容は以下の通りです。ノードがNotReadyであることを示すイベントに注目してください。また、ポッドが実行されなくなっていることにも注目してください（NotReady状態が5分続くと、ポッドは退避されます）。

```shell
kubectl get nodes
```

```none
NAME                     STATUS       ROLES     AGE     VERSION
kubernetes-node-861h     NotReady     <none>    1h      v1.13.0
kubernetes-node-bols     Ready        <none>    1h      v1.13.0
kubernetes-node-st6x     Ready        <none>    1h      v1.13.0
kubernetes-node-unaj     Ready        <none>    1h      v1.13.0
```

```shell
kubectl describe node kubernetes-node-861h
```

```none
Name:			kubernetes-node-861h
Role
Labels:		 kubernetes.io/arch=amd64
           kubernetes.io/os=linux
           kubernetes.io/hostname=kubernetes-node-861h
Annotations:        node.alpha.kubernetes.io/ttl=0
                    volumes.kubernetes.io/controller-managed-attach-detach=true
Taints:             <none>
CreationTimestamp:	Mon, 04 Sep 2017 17:13:23 +0800
Phase:
Conditions:
  Type		Status		LastHeartbeatTime			LastTransitionTime			Reason					Message
  ----    ------    -----------------     ------------------      ------          -------
  OutOfDisk             Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
  MemoryPressure        Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
  DiskPressure          Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
  Ready                 Unknown         Fri, 08 Sep 2017 16:04:28 +0800         Fri, 08 Sep 2017 16:20:58 +0800         NodeStatusUnknown       Kubelet stopped posting node status.
Addresses:	10.240.115.55,104.197.0.26
Capacity:
 cpu:           2
 hugePages:     0
 memory:        4046788Ki
 pods:          110
Allocatable:
 cpu:           1500m
 hugePages:     0
 memory:        1479263Ki
 pods:          110
System Info:
 Machine ID:                    8e025a21a4254e11b028584d9d8b12c4
 System UUID:                   349075D1-D169-4F25-9F2A-E886850C47E3
 Boot ID:                       5cd18b37-c5bd-4658-94e0-e436d3f110e0
 Kernel Version:                4.4.0-31-generic
 OS Image:                      Debian GNU/Linux 8 (jessie)
 Operating System:              linux
 Architecture:                  amd64
 Container Runtime Version:     docker://1.12.5
 Kubelet Version:               v1.6.9+a3d1dfa6f4335
 Kube-Proxy Version:            v1.6.9+a3d1dfa6f4335
ExternalID:                     15233045891481496305
Non-terminated Pods:            (9 in total)
  Namespace                     Name                                            CPU Requests    CPU Limits      Memory Requests Memory Limits
  ---------                     ----                                            ------------    ----------      --------------- -------------
......
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  CPU Requests  CPU Limits      Memory Requests         Memory Limits
  ------------  ----------      ---------------         -------------
  900m (60%)    2200m (146%)    1009286400 (66%)        5681286400 (375%)
Events:         <none>
```

```shell
kubectl get node kubernetes-node-861h -o yaml
```

```yaml
apiVersion: v1
kind: Node
metadata:
  creationTimestamp: 2015-07-10T21:32:29Z
  labels:
    kubernetes.io/hostname: kubernetes-node-861h
  name: kubernetes-node-861h
  resourceVersion: "757"
  uid: 2a69374e-274b-11e5-a234-42010af0d969
spec:
  externalID: "15233045891481496305"
  podCIDR: 10.244.0.0/24
  providerID: gce://striped-torus-760/us-central1-b/kubernetes-node-861h
status:
  addresses:
  - address: 10.240.115.55
    type: InternalIP
  - address: 104.197.0.26
    type: ExternalIP
  capacity:
    cpu: "1"
    memory: 3800808Ki
    pods: "100"
  conditions:
  - lastHeartbeatTime: 2015-07-10T21:34:32Z
    lastTransitionTime: 2015-07-10T21:35:15Z
    reason: Kubelet stopped posting node status.
    status: Unknown
    type: Ready
  nodeInfo:
    bootID: 4e316776-b40d-4f78-a4ea-ab0d73390897
    containerRuntimeVersion: docker://Unknown
    kernelVersion: 3.16.0-0.bpo.4-amd64
    kubeProxyVersion: v0.21.1-185-gffc5a86098dc01
    kubeletVersion: v0.21.1-185-gffc5a86098dc01
    machineID: ""
    osImage: Debian GNU/Linux 7 (wheezy)
    systemUUID: ABE5F6B4-D44B-108B-C46A-24CCE16C8B6E
```



## {{% heading "whatsnext" %}}

以下のような追加のデバッグツールについて学びます:

* [Logging](/docs/concepts/cluster-administration/logging/)
* [Monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
* [Getting into containers via `exec`](/docs/tasks/debug-application-cluster/get-shell-running-container/)
* [Connecting to containers via proxies](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [Connecting to containers via port forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* [Inspect Kubernetes node with crictl](/docs/tasks/debug-application-cluster/crictl/)
