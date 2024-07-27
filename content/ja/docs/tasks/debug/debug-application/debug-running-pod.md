---
title: 実行中のPodのデバッグ
content_type: task
---

<!-- overview -->

このページでは、ノード上で動作している(またはクラッシュしている)Podをデバッグする方法について説明します。


## {{% heading "prerequisites" %}}


* あなたの{{< glossary_tooltip text="Pod" term_id="pod" >}}は既にスケジュールされ、実行されているはずです。Podがまだ実行されていない場合は、[アプリケーションのトラブルシューティング](/ja/docs/tasks/debug/debug-application/)から始めてください。

* いくつかの高度なデバッグ手順では、Podがどのノードで動作しているかを知り、そのノードでコマンドを実行するためのシェルアクセス権を持っていることが必要です。`kubectl`を使用する標準的なデバッグ手順の実行には、そのようなアクセスは必要ではありません。


## `kubectl describe pod`を使ってpodの詳細を取得

この例では、先ほどの例と同様に、Deploymentを使用して2つのpodを作成します。

{{% codenew file="application/nginx-with-request.yaml" %}}

以下のコマンドを実行して、Deploymentを作成します:

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

ここでは、コンテナ(複数可)とPodに関する構成情報(ラベル、リソース要件など)や、コンテナ(複数可)とPodに関するステータス情報(状態、準備状況、再起動回数、イベントなど)を確認できます。

コンテナの状態は、Waiting(待機中)、Running(実行中)、Terminated(終了)のいずれかです。状態に応じて、追加の情報が提供されます。ここでは、Running状態のコンテナについて、コンテナがいつ開始されたかが表示されています。

Readyは、コンテナが最後のReadiness Probeに合格したかどうかを示す。(この場合、コンテナにはReadiness Probeが設定されていません。Readiness Probeが設定されていない場合、コンテナは準備が完了した状態であるとみなされます)。

Restart Countは、コンテナが何回再起動されたかを示します。この情報は、再起動ポリシーが「always」に設定されているコンテナのクラッシュループを検出するのに役立ちます。

現在、Podに関連する条件は、二値のReady条件のみです。これは、Podがリクエストに対応可能であり、マッチングするすべてのサービスのロードバランシングプールに追加されるべきであることを示します。

最後に、Podに関連する最近のイベントのログが表示されます。このシステムでは、複数の同一イベントを圧縮して、最初に見られた時刻と最後に見られた時刻、そして見られた回数を示します。"From"はイベントを記録しているコンポーネントを示し、"SubobjectPath"はどのオブジェクト(例: Pod内のコンテナ)が参照されているかを示し、"Reason"と "Message"は何が起こったかを示しています。

## 例: Pending Podsのデバッグ

イベントを使って検出できる一般的なシナリオは、どのノードにも収まらないPodを作成した場合です。例えば、Podがどのノードでも空いている以上のリソースを要求したり、どのノードにもマッチしないラベルセレクターを指定したりする場合です。例えば、各(仮想)マシンが1つのCPUを持つ4ノードのクラスター上で、(2つではなく)5つのレプリカを持ち、500ではなく600ミリコアを要求する前のDeploymentを作成したとします。この場合、Podの1つがスケジュールできなくなります。(なお、各ノードではfluentdやskydnsなどのクラスターアドオンPodが動作しているため、もし1000ミリコアを要求した場合、どのPodもスケジュールできなくなります)

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

ここでは、理由 `FailedScheduling` (およびその他の理由)でPodのスケジュールに失敗したという、スケジューラーによって生成されたイベントを見ることができます。このメッセージは、どのノードでもPodに十分なリソースがなかったことを示しています。

この状況を修正するには、`kubectl scale`を使用して、4つ以下のレプリカを指定するようにDeploymentを更新します。(あるいは、1つのPodを保留にしたままにしておいても害はありません。)

`kubectl describe pod`の最後に出てきたようなイベントは、etcdに永続化され、クラスターで何が起こっているかについての高レベルの情報を提供します。

すべてのイベントをリストアップするには、次のようにします:


```shell
kubectl get events
```

しかし、イベントは名前空間に所属することを忘れてはいけません。つまり、名前空間で管理されているオブジェクトのイベントに興味がある場合(例: 名前空間 `my-namespace`のPods で何が起こったか)、コマンドに名前空間を明示的に指定する必要があります。

```shell
kubectl get events --namespace=my-namespace
```

すべての名前空間からのイベントを見るには、`--all-namespaces` 引数を使用できます。

`kubectl describe pod`に加えて、(`kubectl get pod` で提供される以上の)Podに関する追加情報を得るためのもう一つの方法は、`-o yaml`出力形式フラグを `kubectl get pod`に渡すことです。これにより、`kubectl describe pod`よりもさらに多くの情報、つまりシステムが持っているPodに関するすべての情報をYAML形式で得ることができます。ここでは、アノテーション(Kubernetesのシステムコンポーネントが内部的に使用している、ラベル制限のないキーバリューのメタデータ)、再起動ポリシー、ポート、ボリュームなどが表示されます。

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

## 例: ダウン/到達不可能なノードのデバッグ

例えば、ノード上で動作しているPodのおかしな挙動に気付いたり、Podがノード上でスケジュールされない原因を探ったりと、デバッグ時にノードのステータスを見ることが有用な場合があります。Podと同様に、`kubectl describe node`や`kubectl get node -o yaml`を使ってノードの詳細情報を取得することができます。例えば、ノードがダウンした場合(ネットワークから切断された、またはkubeletが死んで再起動しないなど)に表示される内容は以下の通りです。ノードがNotReadyであることを示すイベントに注目してください。また、Podが実行されなくなっていることにも注目してください(NotReady状態が5分続くと、Podは退避されます)。

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

## Podログを調べます {#examine-pod-logs}

まず、影響を受けるコンテナのログを見ます。

```shell
kubectl logs ${POD_NAME} ${CONTAINER_NAME}
```

コンテナが以前にクラッシュしたことがある場合、次のコマンドで以前のコンテナのクラッシュログにアクセスすることができます:

```shell
kubectl logs --previous ${POD_NAME} ${CONTAINER_NAME}
```

## container execによるデバッグ {#container-exec}

もし{{< glossary_tooltip text="container image" term_id="image" >}}がデバッグユーティリティを含んでいれば、LinuxやWindows OSのベースイメージからビルドしたイメージのように、`kubectl exec`で特定のコンテナ内でコマンドを実行することが可能です:

```shell
kubectl exec ${POD_NAME} -c ${CONTAINER_NAME} -- ${CMD} ${ARG1} ${ARG2} ... ${ARGN}
```

{{< note >}}
`-c ${CONTAINER_NAME}`は省略可能です。コンテナを1つだけ含むPodの場合は省略できます。
{{< /note >}}

例として、実行中のCassandra Podからログを見るには、次のように実行します。

```shell
kubectl exec cassandra -- cat /var/log/cassandra/system.log
```

例えば`kubectl exec`の`-i`と`-t`引数を使って、端末に接続されたシェルを実行することができます:

```shell
kubectl exec -it cassandra -- sh
```

詳しくは、[実行中のコンテナへのシェルを取得する](/ja/docs/tasks/debug/debug-application/get-shell-running-container/)を参照してください。

## エフェメラルコンテナによるデバッグ {#ephemeral-container}

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

{{< glossary_tooltip text="エフェメラルコンテナ" term_id="ephemeral-container" >}}は、コンテナがクラッシュしたり、コンテナイメージにデバッグユーティリティが含まれていないなどの理由で`kubectl exec`が不十分な場合に、対話的にトラブルシューティングを行うのに便利です([ディストロレスイメージ](https://github.com/GoogleContainerTools/distroless)の場合など)。

### エフェメラルコンテナを使用したデバッグ例 {#ephemeral-container-example}

実行中のPodにエフェメラルコンテナを追加するには、`kubectl debug`コマンドを使用することができます。
まず、サンプル用のPodを作成します:

```shell
kubectl run ephemeral-demo --image=registry.k8s.io/pause:3.1 --restart=Never
```

このセクションの例では、デバッグユーティリティが含まれていない`pause`コンテナイメージを使用していますが、この方法はすべてのコンテナイメージで動作します。

もし、`kubectl exec`を使用してシェルを作成しようとすると、このコンテナイメージにはシェルが存在しないため、エラーが表示されます。

```shell
kubectl exec -it ephemeral-demo -- sh
```

```
OCI runtime exec failed: exec failed: container_linux.go:346: starting container process caused "exec: \"sh\": executable file not found in $PATH": unknown
```

代わりに、`kubectl debug`を使ってデバッグ用のコンテナを追加することができます。
引数に`-i`/`--interactive`を指定すると、`kubectl`は自動的にエフェメラルコンテナのコンソールにアタッチされます。

```shell
kubectl debug -it ephemeral-demo --image=busybox:1.28 --target=ephemeral-demo
```

```
Defaulting debug container name to debugger-8xzrl.
If you don't see a command prompt, try pressing enter.
/ #
```

このコマンドは新しいbusyboxコンテナを追加し、それにアタッチします。`--target`パラメーターは、他のコンテナのプロセス名前空間をターゲットにします。これは`kubectl run`が作成するPodで[プロセス名前空間の共有](/ja/docs/tasks/configure-pod-container/share-process-namespace/)を有効にしないため、指定する必要があります。

{{< note >}}
`--target`パラメーターは{{< glossary_tooltip text="Container Runtime" term_id="container-runtime" >}}でサポートされている必要があります。サポートされていない場合、エフェメラルコンテナは起動されないか、`ps`が他のコンテナ内のプロセスを表示しないように孤立したプロセス名前空間を使用して起動されます。
{{< /note >}}

新しく作成されたエフェメラルコンテナの状態は`kubectl describe`を使って見ることができます:

```shell
kubectl describe pod ephemeral-demo
```

```
...
Ephemeral Containers:
  debugger-8xzrl:
    Container ID:   docker://b888f9adfd15bd5739fefaa39e1df4dd3c617b9902082b1cfdc29c4028ffb2eb
    Image:          busybox
    Image ID:       docker-pullable://busybox@sha256:1828edd60c5efd34b2bf5dd3282ec0cc04d47b2ff9caa0b6d4f07a21d1c08084
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Wed, 12 Feb 2020 14:25:42 +0100
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

終了したら`kubectl delete`を使ってPodを削除してください:

```shell
kubectl delete pod ephemeral-demo
```

## Podのコピーを使ったデバッグ

Podの設定オプションによって、特定の状況でのトラブルシューティングが困難になることがあります。
例えば、コンテナイメージにシェルが含まれていない場合、またはアプリケーションが起動時にクラッシュした場合は、`kubectl exec`を実行してトラブルシューティングを行うことができません。
このような状況では、`kubectl debug`を使用してデバッグを支援するために設定値を変更したPodのコピーを作ることができます。

### 新しいコンテナを追加しながらPodをコピーします

新しいコンテナを追加することは、アプリケーションは動作しているが期待通りの動作をせず、トラブルシューティングユーティリティをPodに追加したい場合に便利です。
例えば、アプリケーションのコンテナイメージは`busybox`上にビルドされているが、`busybox`に含まれていないデバッグユーティリティが必要な場合があります。このシナリオは`kubectl run`を使ってシミュレーションすることができます。

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

このコマンドを実行すると、`myapp`のコピーに`myapp-debug`という名前が付き、デバッグ用の新しいUbuntuコンテナが追加されます。

```shell
kubectl debug myapp -it --image=ubuntu --share-processes --copy-to=myapp-debug
```

```
Defaulting debug container name to debugger-w7xmf.
If you don't see a command prompt, try pressing enter.
root@myapp-debug:/#
```

{{< note >}}
* `kubectl debug`は`--container`フラグでコンテナ名を選択しない場合、自動的にコンテナ名を生成します。

* `i`フラグを指定すると、デフォルトで`kubectl debug`が新しいコンテナにアタッチされます。これを防ぐには、`--attach=false`を指定します。セッションが切断された場合は、`kubectl attach`を使用して再接続することができます。

* `--share-processes`を指定すると、このPod内のコンテナが、Pod内の他のコンテナのプロセスを参照することができます。この仕組みについて詳しくは、[Pod内のコンテナ間でプロセス名前空間を共有する](/ja/docs/tasks/configure-pod-container/share-process-namespace/)を参照してください。
{{< /note >}}

デバッグが終わったら、Podの後始末をするのを忘れないでください。

```shell
kubectl delete pod myapp myapp-debug
```

### Podのコマンドを変更しながらコピーします

例えば、デバッグフラグを追加する場合や、アプリケーションがクラッシュしている場合などでは、コンテナのコマンドを変更すると便利なことがあります。
アプリケーションのクラッシュをシミュレートするには、`kubectl run`を使用して、すぐに終了するコンテナを作成します:

```
kubectl run --image=busybox:1.28 myapp -- false
```

`kubectl describe pod myapp`を使用すると、このコンテナがクラッシュしていることがわかります:

```
Containers:
  myapp:
    Image:         busybox
    ...
    Args:
      false
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
```

`kubectl debug`を使うと、コマンドをインタラクティブシェルに変更したこのPodのコピーを作成することができます。

```
kubectl debug myapp -it --copy-to=myapp-debug --container=myapp -- sh
```

```
If you don't see a command prompt, try pressing enter.
/ #
```

これで、ファイルシステムのパスのチェックやコンテナコマンドの手動実行などのタスクを実行するために使用できる対話型シェルが完成しました。

{{< note >}}
* 特定のコンテナのコマンドを変更するには、そのコンテナ名を`--container`で指定する必要があります。そうしなければ、指定したコマンドを実行するための新しいコンテナを、`kubectl debug`が代わりに作成します。

* `-i`フラグは、デフォルトで`kubectl debug`がコンテナにアタッチされるようにします。これを防ぐには、`--attach=false`を指定します。セッションが切断された場合は、`kubectl attach`を使用して再接続することができます。
{{< /note >}}

デバッグが終わったら、Podの後始末をするのを忘れないでください:

```shell
kubectl delete pod myapp myapp-debug
```

### コンテナイメージを変更してPodをコピーします

状況によっては、動作不良のPodを通常のプロダクション用のコンテナイメージから、デバッグビルドや追加ユーティリティを含むイメージに変更したい場合があります。

例として、`kubectl run`を使用してPodを作成します:

```
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

ここで、`kubectl debug`を使用してコピーを作成し、そのコンテナイメージを`ubuntu`に変更します:

```
kubectl debug myapp --copy-to=myapp-debug --set-image=*=ubuntu
```

`--set-image`の構文は、`kubectl set image`と同じ`container_name=image`の構文を使用します。`*=ubuntu`は、全てのコンテナのイメージを`ubuntu`に変更することを意味します。

デバッグが終わったら、Podの後始末をするのを忘れないでください:

```shell
kubectl delete pod myapp myapp-debug
```

## ノード上のシェルによるデバッグ {#node-shell-session}

いずれの方法でもうまくいかない場合は、Podが動作しているノードを探し出し、ホストの名前空間で動作するデバッグ用のPodを作成します。
ノード上で`kubectl debug`を使って対話型のシェルを作成するには、以下を実行します:

```shell
kubectl debug node/mynode -it --image=ubuntu
```

```
Creating debugging pod node-debugger-mynode-pdx84 with container debugger on node mynode.
If you don't see a command prompt, try pressing enter.
root@ek8s:/#
```

ノードでデバッグセッションを作成する場合、以下の点に注意してください:

* `kubectl debug`はノードの名前に基づいて新しいPodの名前を自動的に生成します。
* ノードのルートファイルシステムは`/host`にマウントされます。
* コンテナはホストのIPC、Network、PIDネームスペースで実行されますが、特権は付与されません。そのため、ホスト上のプロセス情報の参照や、`chroot /host`の実行に失敗する場合があります。
* 特権が必要な場合は手動でPodを作成するか、`--profile=sysadmin`を使用してください。

デバッグが終わったら、Podの後始末をするのを忘れないでください:

```shell
kubectl delete pod node-debugger-mynode-pdx84
```

## デバッグプロファイルの使用 {#debugging-profiles}

`kubectl debug`でノードやPodをデバッグする場合、デバッグ用のPod、エフェメラルコンテナ、またはコピーされたPodに`--profile`フラグを使用してデバッグプロファイルを適用できます。
デバッグプロファイルを適用することで、[securityContext](/ja/docs/tasks/configure-pod-container/security-context/)など特定のプロパティが設定され、さまざまなシナリオに適応できるようになります。

使用可能なデバッグプロファイルは以下の通りです:

| Profile      | Description                                                     |
| ------------ | --------------------------------------------------------------- |
| legacy       | v1.22と互換性を保つプロパティのセット |
| general      | 各デバッグシナリオに対応する汎用的なプロパティのセット |
| baseline     | [PodSecurityStandard baseline policy](/ja/docs/concepts/security/pod-security-standards/#ベースライン-デフォルト) に準拠したプロパティのセット |
| restricted   | [PodSecurityStandard restricted policy](/ja/docs/concepts/security/pod-security-standards/#制限)に準拠したプロパティのセット |
| netadmin     | ネットワーク管理者権限を含むプロパティのセット |
| sysadmin     | システム管理者（root）権限を含むプロパティのセット |


{{< note >}}
もし`--profile`を指定しない場合、デフォルトで`legacy`プロファイルが使用されます。
`legacy`プロファイルは将来的に廃止される予定であるため、`general`プロファイルなどの他のプロファイルを使用することを推奨します。
{{< /note >}}

例えば、`myapp`という名前のPodを作成し、デバッグを行います:

```shell
kubectl run myapp --image=busybox:1.28 --restart=Never -- sleep 1d
```

エフェメラルコンテナを使用して、Podをデバッグします。
エフェメラルコンテナに特権が必要な場合は、`sysadmin`プロファイルを使用できます:

```shell
kubectl debug -it myapp --image=busybox:1.28 --target=myapp --profile=sysadmin
```

```
Targeting container "myapp". If you don't see processes from this container it may be because the container runtime doesn't support this feature.
Defaulting debug container name to debugger-6kg4x.
If you don't see a command prompt, try pressing enter.
/ #
```

コンテナで次のコマンドを実行して、エフェメラルコンテナプロセスのケーパビリティを確認します:

```shell
/ # grep Cap /proc/$$/status
```

```
...
CapPrm:	000001ffffffffff
CapEff:	000001ffffffffff
...
```

この結果は、`sysadmin`プロファイルを適用したことで、エフェメラルコンテナプロセスに特権が付与されていることを示しています。
詳細は[コンテナにケーパビリティを設定する](/ja/docs/tasks/configure-pod-container/security-context/#コンテナにケーパビリティを設定する)を参照してください。

エフェメラルコンテナが特権コンテナであることは、次のコマンドからも確認できます:

```shell
kubectl get pod myapp -o jsonpath='{.spec.ephemeralContainers[0].securityContext}'
```

```
{"privileged":true}
```

確認が終わったらPodを削除します:

```shell
kubectl delete pod myapp
```