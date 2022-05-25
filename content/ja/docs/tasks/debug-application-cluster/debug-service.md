---
content_type: concept
title: Serviceのデバッグ
---

<!-- overview -->
新規にKubernetesをインストールした環境でかなり頻繁に発生する問題は、Serviceが適切に機能しないというものです。Deployment(または他のワークロードコントローラー)を通じてPodを実行し、サービスを作成したにもかかわらず、アクセスしようとしても応答がありません。何が問題になっているのかを理解するのに、このドキュメントがきっと役立つでしょう。





<!-- body -->

## Pod内でコマンドを実行する

ここでの多くのステップでは、クラスターで実行されているPodが見ているものを確認する必要があります。これを行う最も簡単な方法は、インタラクティブなalpineのPodを実行することです。

```none
kubectl run -it --rm --restart=Never alpine --image=alpine sh
```

{{< note >}}
コマンドプロンプトが表示されない場合は、Enterキーを押してみてください。
{{< /note >}}

使用したい実行中のPodがすでにある場合は、以下のようにしてそのPod内でコマンドを実行できます。

```shell
kubectl exec <POD-NAME> -c <CONTAINER-NAME> -- <COMMAND>
```

## セットアップ

このドキュメントのウォークスルーのために、いくつかのPodを実行しましょう。おそらくあなた自身のServiceをデバッグしているため、あなた自身の詳細に置き換えることもできますし、これに沿って2番目のデータポイントを取得することもできます。


```shell
kubectl create deployment hostnames --image=k8s.gcr.io/serve_hostname
```
```none
deployment.apps/hostnames created
```


`kubectl`コマンドは作成、変更されたリソースのタイプと名前を出力するため、この後のコマンドで使用することもできます。

Deploymentを3つのレプリカにスケールさせてみましょう。

```shell
kubectl scale deployment hostnames --replicas=3
```
```none
deployment.apps/hostnames scaled
```

これは、次のYAMLでDeploymentを開始した場合と同じです。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hostnames
  labels:
    app: hostnames
spec:
  selector:
    matchLabels:
      app: hostnames
  replicas: 3
  template:
    metadata:
      labels:
        app: hostnames
    spec:
      containers:
      - name: hostnames
        image: k8s.gcr.io/serve_hostname
```

"app"ラベルは`kubectl create deployment`によって、Deploymentの名前に自動的にセットされます。

Podが実行されていることを確認できます。

```shell
kubectl get pods -l app=hostnames
```
```none
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

Podが機能していることも確認できます。Pod IP アドレスリストを取得し、直接テストできます。

```shell
kubectl get pods -l app=hostnames \
    -o go-template='{{range .items}}{{.status.podIP}}{{"\n"}}{{end}}'
```
```none
10.244.0.5
10.244.0.6
10.244.0.7
```

このウォークスルーに使用されるサンプルコンテナは、ポート9376でHTTPを介して独自のホスト名を提供するだけですが、独自のアプリをデバッグする場合は、Podがリッスンしているポート番号を使用する必要があります。

Pod内から実行します。

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

次のように表示されます。

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

この時点で期待通りの応答が得られない場合、Podが正常でないか、想定しているポートでリッスンしていない可能性があります。なにが起きているかを確認するために`kubectl logs`が役立ちます。Podに直接に入りデバッグする場合は`kubectl exec`が必要になります。

これまでにすべての計画が完了していると想定すると、Serviceが機能しない理由を調査することができます。

## Serviceは存在するか？

賢明な読者は、Serviceをまだ実際に作成していないことにお気付きかと思いますが、これは意図的です。これは時々忘れられるステップであり、最初に確認すべきことです。

存在しないServiceにアクセスしようとするとどうなるでしょうか？このServiceを名前で利用する別のPodがあると仮定すると、次のような結果が得られます。

```shell
wget -O- hostnames
```
```none
Resolving hostnames (hostnames)... failed: Name or service not known.
wget: unable to resolve host address 'hostnames'
```

最初に確認するのは、そのServiceが実際に存在するかどうかです。

```shell
kubectl get svc hostnames
```
```none
No resources found.
Error from server (NotFound): services "hostnames" not found
```

Serviceを作成しましょう。前と同様に、これはウォークスルー用です。ご自身のServiceの詳細を使用することもできます。

```shell
kubectl expose deployment hostnames --port=80 --target-port=9376
```
```none
service/hostnames exposed
```

そして、念のため内容を確認します。

```shell
kubectl get svc hostnames
```
```none
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
```

これで、Serviceが存在することがわかりました。

前と同様に、これは次のようなYAMLでServiceを開始した場合と同じです。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hostnames
spec:
  selector:
    app: hostnames
  ports:
  - name: default
    protocol: TCP
    port: 80
    targetPort: 9376
```

構成の全範囲をハイライトするため、ここで作成したServiceはPodとは異なるポート番号を使用します。多くの実際のServiceでは、これらのポートは同じになる場合があります。

## サービスはDNS名によって機能しているか？

クライアントがサービスを使用する最も一般的な方法の1つは、DNS名を使用することです。同じNamespaceのPodから次のコマンドを実行してください。

```shell
nslookup hostnames
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

これが失敗した場合、おそらくPodとServiceが異なるNamespaceにあるため、ネームスペースで修飾された名前を試してください。(Podの中からもう一度)


```shell
nslookup hostnames.default
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

これが機能する場合、クロスネームスペース名を使用するようにアプリケーションを調整するか、同じNamespaceでアプリとServiceを実行する必要があります。これでも失敗する場合は、完全修飾名を試してください。

```shell
nslookup hostnames.default.svc.cluster.local
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default.svc.cluster.local
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

ここでのサフィックス"default.svc.cluster.local"に注意してください。"default"は、操作しているNamespaceです。"svc"は、これがServiceであることを示します。"cluster.local"はクラスタードメインであり、あなたのクラスターでは異なる場合があります。

クラスター内のノードからも試すこともできます。

{{< note >}}
10.0.0.10はクラスターのDNSサービスのIPであり、あなたのクラスターでは異なるかもしれません。
{{< /note >}}

```shell
nslookup hostnames.default.svc.cluster.local 10.0.0.10
```
```none
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default.svc.cluster.local
Address: 10.0.1.175
```

完全修飾名では検索できるのに、相対名ではできない場合、Podの`/etc/resolv.conf`ファイルが正しいことを確認する必要があります。Pod内から実行します。

```shell
cat /etc/resolv.conf
```

次のように表示されます。

```
nameserver 10.0.0.10
search default.svc.cluster.local svc.cluster.local cluster.local example.com
options ndots:5
```

nameserver行はクラスターのDNS Serviceを示さなければなりません。これは、`--cluster-dns`フラグで`kubelet`に渡されます。

`search`行には、`Service`名を見つけるための適切なサフィックスを含める必要があります。この場合、ローカルの`Namespace`で`Service`を見つけるためのサフィックス(`default.svc.cluster.local`)、すべての`Namespaces`で`Service`を見つけるためのサフィックス(`svc.cluster.local`)、およびクラスターのサフィックス(`cluster.local`)です。インストール方法によっては、その後に追加のレコードがある場合があります(合計6つまで)。クラスターのサフィックスは、`--cluster-domain`フラグを使用して`kubelet`に渡されます。このドキュメントではそれが"cluster.local"であると仮定していますが、あなたのクラスターでは異なる場合があります。その場合は、上記のすべてのコマンドでクラスターのサフィックスを変更する必要があります。

`options`行では、DNSクライアントライブラリーが検索パスをまったく考慮しないように`ndots`を十分に高く設定する必要があります。Kubernetesはデフォルトでこれを5に設定します。これは、生成されるすべてのDNS名をカバーするのに十分な大きさです。

### DNS名で機能するServiceはあるか？ {#does-any-service-exist-in-dns}

上記がまだ失敗する場合、DNSルックアップがServiceに対して機能していません。一歩離れて、他の何が機能していないかを確認しましょう。KubernetesマスターのServiceは常に機能するはずです。Pod内から実行します。

```shell
nslookup kubernetes.default
```
```none
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      kubernetes.default
Address 1: 10.0.0.1 kubernetes.default.svc.cluster.local
```

これが失敗する場合は、このドキュメントの[kube-proxy](#is-the-kube-proxy-working)セクションを参照するか、このドキュメントの先頭に戻って最初からやり直してください。ただし、あなた自身のServiceをデバッグするのではなく、DNSサービスをデバッグします。

## ServiceはIPでは機能するか？

DNSサービスが正しく動作できると仮定すると、次にテストするのはIPによってServiceが動作しているかどうかです。上述の`kubectl get`で確認できるIPに、クラスター内のPodからアクセスします。

```shell
for i in $(seq 1 3); do
    wget -qO- 10.0.1.175:80
done
```

次のように表示されます。

```
hostnames-0uton
hostnames-bvc05
hostnames-yp2kp
```

Serviceが機能している場合は、正しい応答が得られるはずです。そうでない場合、おかしい可能性のあるものがいくつかあるため、続けましょう。

## Serviceは正しく定義されているか？

馬鹿げているように聞こえるかもしれませんが、Serviceが正しく定義されPodのポートとマッチすることを二度、三度と確認すべきです。Serviceを読み返して確認しましょう。

```shell
kubectl get service hostnames -o json
```
```json
{
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
        "name": "hostnames",
        "namespace": "default",
        "uid": "428c8b6c-24bc-11e5-936d-42010af0a9bc",
        "resourceVersion": "347189",
        "creationTimestamp": "2015-07-07T15:24:29Z",
        "labels": {
            "app": "hostnames"
        }
    },
    "spec": {
        "ports": [
            {
                "name": "default",
                "protocol": "TCP",
                "port": 80,
                "targetPort": 9376,
                "nodePort": 0
            }
        ],
        "selector": {
            "app": "hostnames"
        },
        "clusterIP": "10.0.1.175",
        "type": "ClusterIP",
        "sessionAffinity": "None"
    },
    "status": {
        "loadBalancer": {}
    }
}
```

* アクセスしようとしているServiceポートは`spec.ports[]`のリストのなかに定義されていますか？
* `targetPort`はPodに対して適切ですか(いくつかのPodはServiceとは異なるポートを使用します)？
* `targetPort`を数値で定義しようとしている場合、それは数値(9376)、文字列"9376"のどちらですか？
* `targetPort`を名前で定義しようとしている場合、Podは同じ名前でポートを公開していますか？
* ポートの`protocol`はPodに適切ですか？

## ServiceにEndpointsがあるか？

ここまで来たということは、Serviceは正しく定義され、DNSによって名前解決できることが確認できているでしょう。ここでは、実行したPodがServiceによって実際に選択されていることを確認しましょう。

以前に、Podが実行されていることを確認しました。再確認しましょう。

```shell
kubectl get pods -l app=hostnames
```
```none
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          1h
hostnames-632524106-ly40y   1/1       Running   0          1h
hostnames-632524106-tlaok   1/1       Running   0          1h
```
`-l app=hostnames`引数はラベルセレクターで、ちょうど私たちの`Service`に定義されているものと同じです。

"AGE"列は、これらのPodが約1時間前のものであることを示しており、それらが正常に実行され、クラッシュしていないことを意味します。

"RESTARTS"列は、これらのポッドが頻繁にクラッシュしたり、再起動されていないことを示しています。頻繁に再起動すると、断続的な接続性の問題が発生する可能性があります。再起動回数が多い場合は、[ポッドをデバッグする](/ja/docs/tasks/debug-application-cluster/debug-pod-replication-controller/#podのデバッグ)を参照してください。

Kubernetesシステム内には、すべてのServiceのセレクターを評価し、結果をEndpointsオブジェクトに保存するコントロールループがあります。

```shell
kubectl get endpoints hostnames

NAME        ENDPOINTS
hostnames   10.244.0.5:9376,10.244.0.6:9376,10.244.0.7:9376
```

これにより、EndpointsコントローラーがServiceの正しいPodを見つけていることを確認できます。`ENDPOINTS`列が`<none>`の場合、Serviceの`spec.selector`フィールドが実際にPodの`metadata.labels`値を選択していることを確認する必要があります。よくある間違いは、タイプミスやその他のエラー、たとえばDeployment作成にも`kubectl run`が使われた1.18以前のバージョンのように、Serviceが`app=hostnames`を選択しているのにDeploymentが`run=hostnames`を指定していることです。

## Podは機能しているか？

この時点で、Serviceが存在し、Podを選択していることがわかります。このウォークスルーの最初に、Pod自体を確認しました。Podが実際に機能していることを確認しましょう。Serviceメカニズムをバイパスして、上記EndpointsにリストされているPodに直接アクセスすることができます。

{{< note >}}
これらのコマンドは、Serviceポート(80)ではなく、Podポート(9376)を使用します。
{{< /note >}}

Pod内から実行します。

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

次のように表示されます。

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
 ```

Endpointsリスト内の各Podは、それぞれの自身のホスト名を返すはずです。そうならない(または、あなた自身のPodの正しい振る舞いにならない)場合は、そこで何が起こっているのかを調査する必要があります。

## kube-proxyは機能しているか？ {#is-the-kube-proxy-working}

ここに到達したのなら、Serviceは実行され、Endpointsがあり、Podが実際にサービスを提供しています。この時点で、Serviceのプロキシーメカニズム全体が疑わしいです。ひとつひとつ確認しましょう。

Serviceのデフォルト実装、およびほとんどのクラスターで使用されるものは、kube-proxyです。kube-proxyはそれぞれのノードで実行され、Serviceの抽象化を提供するための小さなメカニズムセットの1つを構成するプログラムです。クラスターがkube-proxyを使用しない場合、以下のセクションは適用されず、使用しているServiceの実装を調査する必要があります。

### kube-proxyは実行されているか？

`kube-proxy`がノード上で実行されていることを確認しましょう。ノードで実行されていれば、以下のような結果が得られるはずです。

```shell
ps auxw | grep kube-proxy
```
```none
 root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
 ```

次に、マスターとの接続など、明らかな失敗をしていないことを確認します。これを行うには、ログを確認する必要があります。ログへのアクセス方法は、ノードのOSに依存します。一部のOSでは/var/log/kube-proxy.logのようなファイルですが、他のOSでは`journalctl`を使用してログにアクセスします。次のように表示されます。

```none
I1027 22:14:53.995134    5063 server.go:200] Running in resource-only container "/kube-proxy"
I1027 22:14:53.998163    5063 server.go:247] Using iptables Proxier.
I1027 22:14:53.999055    5063 server.go:255] Tearing down userspace rules. Errors here are acceptable.
I1027 22:14:54.038140    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns-tcp" to [10.244.1.3:53]
I1027 22:14:54.038164    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns" to [10.244.1.3:53]
I1027 22:14:54.038209    5063 proxier.go:352] Setting endpoints for "default/kubernetes:https" to [10.240.0.2:443]
I1027 22:14:54.038238    5063 proxier.go:429] Not syncing iptables until Services and Endpoints have been received from master
I1027 22:14:54.040048    5063 proxier.go:294] Adding new service "default/kubernetes:https" at 10.0.0.1:443/TCP
I1027 22:14:54.040154    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns" at 10.0.0.10:53/UDP
I1027 22:14:54.040223    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns-tcp" at 10.0.0.10:53/TCP
```

マスターに接続できないことに関するエラーメッセージが表示された場合、ノードの設定とインストール手順をダブルチェックする必要があります。

`kube-proxy`が正しく実行できない理由の可能性の1つは、必須の`conntrack`バイナリが見つからないことです。これは、例えばKubernetesをスクラッチからインストールするなど、クラスターのインストール方法に依存して、一部のLinuxシステムで発生する場合があります。これが該当する場合は、`conntrack`パッケージを手動でインストール(例: Ubuntuでは`sudo apt install conntrack`)する必要があり、その後に再試行する必要があります。

kube-proxyは、いくつかのモードのいずれかで実行できます。上記のログの`Using iptables Proxier`という行は、kube-proxyが「iptables」モードで実行されていることを示しています。最も一般的な他のモードは「ipvs」です。古い「ユーザースペース」モードは、主にこれらに置き換えられました。

#### Iptables mode

「iptables」モードでは、ノードに次のようなものが表示されます。

```shell
iptables-save | grep hostnames
```
```none
-A KUBE-SEP-57KPRZ3JQVENLNBR -s 10.244.3.6/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-57KPRZ3JQVENLNBR -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.3.6:9376
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -s 10.244.1.7/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.1.7:9376
-A KUBE-SEP-X3P2623AGDH6CDF3 -s 10.244.2.3/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-X3P2623AGDH6CDF3 -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.2.3:9376
-A KUBE-SERVICES -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames: cluster IP" -m tcp --dport 80 -j KUBE-SVC-NWV5X2332I4OT4T3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.33332999982 -j KUBE-SEP-WNBA2IHDGP2BOBGZ
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-X3P2623AGDH6CDF3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -j KUBE-SEP-57KPRZ3JQVENLNBR
```

各サービスのポートごとに、`KUBE-SERVICES`に1つのルールと1つの` KUBE-SVC- <hash> `チェーンが必要です。Podエンドポイントごとに、その`KUBE-SVC- <hash>`に少数のルールがあり、少数のルールが含まれる1つの`KUBE-SEP- <hash>`チェーンがあるはずです。正確なルールは、正確な構成(NodePortとLoadBalancerを含む)に基づいて異なります。

#### IPVS mode

「ipvs」モードでは、ノードに次のようなものが表示されます。

```shell
ipvsadm -ln
```
```none
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
...
TCP  10.0.1.175:80 rr
  -> 10.244.0.5:9376               Masq    1      0          0
  -> 10.244.0.6:9376               Masq    1      0          0
  -> 10.244.0.7:9376               Masq    1      0          0
...
```

各Serviceの各ポートに加えて、NodePort、External IP、およびLoad Balancer IPに対して、kube-proxyは仮想サーバーを作成します。Pod endpointごとに、対応する実サーバーが作成されます。この例では、サービスhostnames(`10.0.1.175:80`)は3つのendpoints(`10.244.0.5:9376`、`10.244.0.6:9376`、`10.244.0.7:9376`)を持っています。

IPVSプロキシーは、各Serviceアドレス(Cluster IP、External IP、NodePort IP、Load Balancer IPなど)毎の仮想サーバーと、Serviceのエンドポイントが存在する場合に対応する実サーバーを作成します。この例では、hostnames Service(`10.0.1.175:80`)は3つのエンドポイント(`10.244.0.5:9376`、`10.244.0.6:9376`、`10.244.0.7:9376`)を持ち、上と似た結果が得られるはずです。

#### Userspace mode

まれに、「userspace」モードを使用している場合があります。

ノードから実行します。

```shell
iptables-save | grep hostnames
```
```none
-A KUBE-PORTALS-CONTAINER -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j REDIRECT --to-ports 48577
-A KUBE-PORTALS-HOST -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j DNAT --to-destination 10.240.115.247:48577
```

サービスの各ポートには2つのルールが必要です(この例では1つだけ)-「KUBE-PORTALS-CONTAINER」と「KUBE-PORTALS-HOST」です。

「userspace」モードを使用する必要はほとんどないので、ここでこれ以上時間を費やすことはありません。

### kube-proxyはプロキシしているか？

上記のいずれかが発生したと想定して、いずれかのノードからIPでサービスにアクセスをしています。

```shell
curl 10.0.1.175:80
```
```none
hostnames-632524106-bbpiw
```

もしこれが失敗し、あなたがuserspaceプロキシーを使用している場合、プロキシーへの直接アクセスを試してみてください。もしiptablesプロキシーを使用している場合、このセクションはスキップしてください。

上記の`iptables-save`の出力を振り返り、`kube-proxy`がServiceに使用しているポート番号を抽出します。上記の例では"48577"です。このポートに接続してください。

```shell
curl localhost:48577
```
```none
hostnames-632524106-tlaok
```

もしまだ失敗する場合は、`kube-proxy`ログで次のような特定の行を探してください。

```none
Setting endpoints for default/hostnames:default to [10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376]
```

これらが表示されない場合は、`-v`フラグを4に設定して`kube-proxy`を再起動してから、再度ログを確認してください。

### エッジケース: PodがService IP経由で自身に到達できない {#a-pod-fails-to-reach-itself-via-the-service-ip}

これはありそうに聞こえないかもしれませんが、実際には起こり、動作するはずです。これはネットワークが"hairpin"トラフィック用に適切に設定されていない場合、通常は`kube-proxy`が`iptables`モードで実行され、Podがブリッジネットワークに接続されている場合に発生します。`Kubelet`は`hairpin-mode`[フラグ](/docs/reference/command-line-tools-reference/kubelet/)を公開します。これにより、Serviceのエンドポイントが自身のServiceのVIPにアクセスしようとした場合に、自身への負荷分散を可能にします。`hairpin-mode`フラグは`hairpin-veth`または`promiscuous-bridge`に設定する必要があります。

この問題をトラブルシューティングする一般的な手順は次のとおりです。

* `hairpin-mode`が`hairpin-veth`または`promiscuous-bridge`に設定されていることを確認します。次のような表示がされるはずです。この例では、`hairpin-mode`は`promiscuous-bridge`に設定されています。

```shell
ps auxw | grep kubelet
```
```none
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0
```

* 実際に使われている`hairpin-mode`を確認します。これを行うには、kubeletログを確認する必要があります。ログへのアクセス方法は、ノードのOSによって異なります。一部のOSでは/var/log/kubelet.logなどのファイルですが、他のOSでは`journalctl`を使用してログにアクセスします。互換性のために、実際に使われている`hairpin-mode`が`--hairpin-mode`フラグと一致しない場合があることに注意してください。kubelet.logにキーワード`hairpin`を含むログ行があるかどうかを確認してください。実際に使われている`hairpin-mode`を示す以下のようなログ行があるはずです。

```none
I0629 00:51:43.648698    3252 kubelet.go:380] Hairpin mode set to "promiscuous-bridge"
```

* 実際に使われている`hairpin-mode`が`hairpin-veth`の場合、`Kubelet`にノードの`/sys`で操作する権限があることを確認します。すべてが正常に機能している場合、次のようなものが表示されます。

```shell
for intf in /sys/devices/virtual/net/cbr0/brif/*; do cat $intf/hairpin_mode; done
```
```none
1
1
1
1
```

実際に使われている`hairpin-mode`が`promiscuous-bridge`の場合、`Kubelet`にノード上のLinuxブリッジを操作する権限があることを確認してください。`cbr0`ブリッジが使用され適切に構成されている場合、以下が表示されます。

```shell
ifconfig cbr0 |grep PROMISC
```
```none
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1
```

* 上記のいずれも解決しない場合、助けを求めてください。

## 助けを求める

ここまでたどり着いたということは、とてもおかしなことが起こっています。Serviceは実行中で、Endpointsがあり、Podは実際にサービスを提供しています。DNSは動作していて、`kube-proxy`も誤動作していないようです。それでも、あなたのServiceは機能していません。おそらく私たちにお知らせ頂いた方がよいでしょう。調査をお手伝いします！

[Slack](/docs/tasks/debug-application-cluster/troubleshooting/#slack)、[Forum](https://discuss.kubernetes.io)または[GitHub](https://github.com/kubernetes/kubernetes)でお問い合わせください。



## {{% heading "whatsnext" %}}


詳細については、[トラブルシューティングドキュメント](/docs/tasks/debug-application-cluster/troubleshooting/)をご覧ください。
