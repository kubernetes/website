---
content_template: templates/concept
title: Serviceのデバッグ
---

{{% capture overview %}}
新規にKubernetesをインストールした環境でかなり頻繁に発生する問題は、`Service`が適切に機能しないというものです。
`Deployment`を実行して`Service`を作成したにもかかわらず、アクセスしようとしても応答がありません。
何が問題になっているのかを理解するのに、このドキュメントがきっと役立つでしょう。


{{% /capture %}}


{{% capture body %}}

## 規則

このドキュメントでは全体を通して、実行可能なさまざまなコマンドが示されます。
中には`Pod`内で実行する必要があるコマンドもあれば、Kubernetesの`ノード`上で実行する必要があるコマンドや、`kubectl`とクラスターの認証情報がある場所であればどこでも実行できるコマンドもあります。
期待される内容を明確にするために、このドキュメントでは次の規則を使用します。

コマンド"COMMAND"が`Pod`内で実行され、"OUTPUT"を出力すると期待される場合:

```shell
u@pod$ COMMAND
OUTPUT
```

コマンド"COMMAND"が`Node`上で実行され、"OUTPUT"を出力すると期待される場合:

```shell
u@node$ COMMAND
OUTPUT
```

コマンドが"kubectl ARGS"の場合:

```shell
kubectl ARGS
OUTPUT
```

## Pod内でコマンドを実行する

ここでの多くのステップでは、クラスターで実行されている`Pod`が見ているものを確認する必要があります。
これを行う最も簡単な方法は、インタラクティブなalpineの`Pod`を実行することです。

```none
kubectl run -it --rm --restart=Never alpine --image=alpine sh
/ #
```
{{< note >}}
コマンドプロンプトが表示されない場合は、Enterキーを押してみてください。
{{< /note >}}

使用したい実行中の`Pod`が既にある場合は、以下のようにしてその`Pod`内でコマンドを実行できます。

```shell
kubectl exec <POD-NAME> -c <CONTAINER-NAME> -- <COMMAND>
```

## セットアップ

このドキュメントのウォークスルーのために、いくつかの`Pod`を実行しましょう。
おそらくあなた自身の`Service`をデバッグしているため、あなた自身の詳細に置き換えることもできますし、これに沿って2番目のデータポイントを取得することもできます。

```shell
kubectl run hostnames --image=k8s.gcr.io/serve_hostname \
                        --labels=app=hostnames \
                        --port=9376 \
                        --replicas=3
deployment.apps/hostnames created
```

`kubectl`コマンドは作成、変更されたリソースのタイプと名前を出力するため、この後のコマンドで使用することもできます。
{{< note >}}
これは、次のYAMLで`Deployment`を開始した場合と同じです。

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hostnames
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
        ports:
        - containerPort: 9376
          protocol: TCP
```
{{< /note >}}

`Pod`が実行中であることを確認してください。

```shell
kubectl get pods -l app=hostnames
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

## Serviceは存在するか？

賢明な読者は、`Service`をまだ実際に作成していないことにお気付きかと思いますが、これは意図的です。これは時々忘れられるステップであり、最初に確認すべきことです。

では、存在しない`Service`にアクセスしようとするとどうなるでしょうか？
この`Service`を名前で利用する別の`Pod`があると仮定すると、次のような結果が得られます。

```shell
u@pod$ wget -O- hostnames
Resolving hostnames (hostnames)... failed: Name or service not known.
wget: unable to resolve host address 'hostnames'
```

そのため、最初に確認するのは、その`Service`が実際に存在するかどうかです。

```shell
kubectl get svc hostnames
No resources found.
Error from server (NotFound): services "hostnames" not found
```

犯人がいましたので、`Service`を作成しましょう。
前と同様に、これはウォークスルー用です。ご自身の`Service`の詳細を使用することもできます。

```shell
kubectl expose deployment hostnames --port=80 --target-port=9376
service/hostnames exposed
```

そして、念のため内容を確認します。

```shell
kubectl get svc hostnames
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
```

前と同様に、これは次のようなYAMLで`Service`を開始した場合と同じです。

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

これで、`Service`が存在することが確認できました。

## サービスはDNSによって機能しているか？

同じ`Namespace`の`Pod`から次のコマンドを実行してください。

```shell
u@pod$ nslookup hostnames
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

これが失敗した場合、おそらく`Pod`と`Service`が異なる`Namespace`にあるため、ネームスペースで修飾された名前を試してください。

```shell
u@pod$ nslookup hostnames.default
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

これが機能する場合、クロスネームスペース名を使用するようにアプリケーションを調整するか、同じ`Namespace`でアプリと`Service`を実行する必要があります。
これでも失敗する場合は、完全修飾名を試してください。

```shell
u@pod$ nslookup hostnames.default.svc.cluster.local
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default.svc.cluster.local
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

ここでのサフィックス"default.svc.cluster.local"に注意してください。
"default"は、操作している`Namespace`です。
"svc"は、これが`Service`であることを示します。
"cluster.local"はクラスタードメインであり、あなたのクラスターでは異なる場合があります。

クラスター内の`ノード`からも試すこともできます。

{{< note >}}
10.0.0.10は私のDNS `Service`であり、あなたのクラスターでは異なるかもしれません。
{{< /note >}}

```shell
u@node$ nslookup hostnames.default.svc.cluster.local 10.0.0.10
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default.svc.cluster.local
Address: 10.0.1.175
```

完全修飾名では検索できるのに、相対名ではできない場合、`/etc/resolv.conf`ファイルが正しいことを確認する必要があります。

```shell
u@pod$ cat /etc/resolv.conf
nameserver 10.0.0.10
search default.svc.cluster.local svc.cluster.local cluster.local example.com
options ndots:5
```

`nameserver`行はクラスターのDNS `Service`を示さなければなりません。
これは、`--cluster-dns`フラグで`kubelet`に渡されます。

`search`行には、`Service`名を見つけるための適切なサフィックスを含める必要があります。
この場合、ローカルの`Namespace`で`Service`を見つけるためのサフィックス(`default.svc.cluster.local`)、すべての`Namespaces`で`Service`を見つけるためのサフィックス(`svc.cluster.local`)、およびクラスターのサフィックス(`cluster.local`)です。
インストール方法によっては、その後に追加のレコードがある場合があります(合計6つまで)。
クラスターのサフィックスは、`--cluster-domain`フラグを使用して`kubelet`に渡されます。
このドキュメントではそれが"cluster.local"であると仮定していますが、あなたのクラスターでは異なる場合があります。
その場合は、上記のすべてのコマンドでクラスターのサフィックスを変更する必要があります。

`options`行では、DNSクライアントライブラリーが検索パスをまったく考慮しないように`ndots`を十分に高く設定する必要があります。
Kubernetesはデフォルトでこれを5に設定します。これは、生成されるすべてのDNS名をカバーするのに十分な大きさです。

### ServiveはDNSに存在するか？

上記がまだ失敗する場合、DNSルックアップが`Service`に対して機能していません。
一歩離れて、他の何が機能していないかを確認しましょう。
Kubernetesマスターの`Service`は常に機能するはずです。

```shell
u@pod$ nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      kubernetes.default
Address 1: 10.0.0.1 kubernetes.default.svc.cluster.local
```

これが失敗した場合、このドキュメントのkube-proxyセクションに移動するか、あるいは、このドキュメントの先頭に戻って最初からやり直し、あなた自身の`Service`をデバッグする代わりにDNSをデバッグする必要があるかもしれません。

## ServiceはIPでは機能するか？

DNSが機能することを確認できると仮定すると、次にテストするのは`Service`が機能しているかどうかです。
上述の`kubectl get`で確認できる`Service`のIPに、クラスター内のノードからアクセスします。

```shell
u@node$ curl 10.0.1.175:80
hostnames-0uton

u@node$ curl 10.0.1.175:80
hostnames-yp2kp

u@node$ curl 10.0.1.175:80
hostnames-bvc05
```

`Service`が機能している場合は、正しい応答が得られるはずです。
そうでない場合、おかしい可能性のあるものがいくつかあるため、続けましょう。

## Serviceは正しいか？

馬鹿げているように聞こえるかもしれませんが、`Service`が正しく定義され`Pod`のポートとマッチすることを二度、三度と確認すべきです。
`Service`を読み返して確認しましょう。

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

* アクセスしようとしているポートは`spec.ports[]`に定義されていますか？
* `targetPort`は`Pod`に対して適切ですか(多くの`Pod`は`Service`とは異なるポートを使用することを選択します)？
* `targetPort`を数値で定義しようとしている場合、それは数値(9376)、文字列"9376"のどちらですか？
* `targetPort`を名前で定義しようとしている場合、`Pod`は同じ名前でポートを公開していますか？
* ポートの`protocol`は`Pod`のものと同じですか？

## ServiceにEndpointsがあるか？

ここまで来たということは、`Service`は存在し、DNSによって名前解決できることが確認できているでしょう。
ここでは、実行した`Pod`が`Service`によって実際に選択されていることを確認しましょう。

以前に、`Pod`が実行されていることを確認しました。再確認しましょう。

```shell
kubectl get pods -l app=hostnames
NAME              READY     STATUS    RESTARTS   AGE
hostnames-0uton   1/1       Running   0          1h
hostnames-bvc05   1/1       Running   0          1h
hostnames-yp2kp   1/1       Running   0          1h
```

"AGE"列は、これらの`Pod`が約1時間前のものであることを示しており、それらが正常に実行され、クラッシュしていないことを意味します。

`-l app=hostnames`引数はラベルセレクターで、ちょうど私たちの`Service`に定義されているものと同じです。
Kubernetesシステム内には、すべての`Service`のセレクターを評価し、結果を`Endpoints`オブジェクトに保存するコントロールループがあります。

```shell
kubectl get endpoints hostnames
NAME        ENDPOINTS
hostnames   10.244.0.5:9376,10.244.0.6:9376,10.244.0.7:9376
```

これにより、Endpointsコントローラーが`Service`の正しい`Pod`を見つけていることを確認できます。
`hostnames`行が空白の場合、`Service`の`spec.selector`フィールドが実際に`Pod`の`metadata.labels`値を選択していることを確認する必要があります。
よくある間違いは、タイプミスまたは他のエラー、たとえば`Service`が`run=hostnames`を選択しているのに`Deployment`が`app=hostnames`を指定していることです。

## Podは機能しているか？

この時点で、`Service`が存在し、`Pod`を選択していることがわかります。
`Pod`が実際に機能していることを確認しましょう。`Service`メカニズムをバイパスして、`Pod`に直接アクセスすることができます。

{{< note >}}
これらのコマンドは、`Service`ポート(80)ではなく、`Pod`ポート(9376)を使用します。
{{< /note >}}

```shell
u@pod$ wget -qO- 10.244.0.5:9376
hostnames-0uton

pod $ wget -qO- 10.244.0.6:9376
hostnames-bvc05

u@pod$ wget -qO- 10.244.0.7:9376
hostnames-yp2kp
```

`Endpoints`リスト内の各`Pod`は、それぞれの自身のホスト名を返すはずです。
そうならない(または、あなた自身の`Pod`の正しい振る舞いにならない)場合は、そこで何が起こっているのかを調査する必要があります。
`kubectl logs`が役立つかもしれません。あるいは、`kubectl exec`で直接`Pod`にアクセスし、そこでサービスをチェックしましょう。

もう1つ確認すべきことは、`Pod`がクラッシュしたり、再起動されていないことです。
頻繁に再起動されていると、断続的な接続の問題が発生する可能性があります。

```shell
kubectl get pods -l app=hostnames
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

再起動回数が多い場合は、[Podをデバッグする](/ja/docs/tasks/debug-application-cluster/debug-pod-replication-controller/#podのデバッグ)方法の詳細をご覧ください。

## kube-proxyは機能しているか？

ここに到達したのなら、`Service`は実行され、`Endpoints`があり、`Pod`が実際にサービスを提供しています。
この時点で、`Service`のプロキシーメカニズム全体が疑わしいです。
ひとつひとつ確認しましょう。

### kube-proxyは実行されているか？

`kube-proxy`が`ノード`上で実行されていることを確認しましょう。
以下のような結果が得られるはずです。

```shell
u@node$ ps auxw | grep kube-proxy
root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
```

次に、マスターとの接続など、明らかな失敗をしていないことを確認します。
これを行うには、ログを確認する必要があります。
ログへのアクセス方法は、`ノード`のOSに依存します。
一部のOSでは/var/log/kube-proxy.logのようなファイルですが、他のOSでは`journalctl`を使用してログにアクセスします。
次のように表示されます。

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

マスターに接続できないことに関するエラーメッセージが表示された場合、`ノード`の設定とインストール手順をダブルチェックする必要があります。

`kube-proxy`が正しく実行できない理由の可能性の1つは、必須の`conntrack`バイナリが見つからないことです。
これは、例えばKubernetesをスクラッチからインストールするなど、クラスターのインストール方法に依存して、一部のLinuxシステムで発生する場合があります。
これが該当する場合は、`conntrack`パッケージを手動でインストール(例: Ubuntuでは`sudo apt install conntrack`)する必要があり、その後に再試行する必要があります。

### kube-proxyはiptablesルールを書いているか？

`kube-proxy`の主な責務の1つは、`Service`を実装する`iptables`ルールを記述することです。
それらのルールが書かれていることを確認しましょう。

kube-proxyは、"userspace"モード、"iptables"モード、または"ipvs"モードで実行できます。
あなたが"iptables"モードまたは"ipvs"モードを使用していることを願います。
続くケースのいずれかが表示されるはずです。

#### Userspace

```shell
u@node$ iptables-save | grep hostnames
-A KUBE-PORTALS-CONTAINER -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j REDIRECT --to-ports 48577
-A KUBE-PORTALS-HOST -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j DNAT --to-destination 10.240.115.247:48577
```

`Service`の各ポート毎(この例では1つ)に2つのルールがあるはずです。
"KUBE-PORTALS-CONTAINER"と"KUBE-PORTALS-HOST"です。
これらが表示されない場合は、`-v`フラグを4に設定して`kube-proxy`を再起動してから、もう一度ログを確認してください。

"userspace"モードを使用する必要がある人ほとんどないため、ここではこれ以上の時間を費やしません。

#### Iptables

```shell
u@node$ iptables-save | grep hostnames
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

`KUBE-SERVICES`に1つのルールがあり、`KUBE-SVC-(hash)`のエンドポイント毎に1つまたは2つのルールがあり(`SessionAffinity`に依存)、エンドポイント毎に1つの`KUBE-SEP-(hash)`チェーンがあり、 そしてそれぞれの`KUBE-SEP-(hash)`チェーンにはいくつかのルールがあるはずです。
正確なルールは、あなたの正確な構成(NodePortとLoadBalancerを含む)によって異なります。

#### IPVS

```shell
u@node$ ipvsadm -ln
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
...
TCP  10.0.1.175:80 rr
  -> 10.244.0.5:9376               Masq    1      0          0
  -> 10.244.0.6:9376               Masq    1      0          0
  -> 10.244.0.7:9376               Masq    1      0          0
...
```

IPVSプロキシーは、各Serviceアドレス(Cluster IP、External IP、NodePort IP、Load Balancer IPなど)毎の仮想サーバーと、Serviceのエンドポイントが存在する場合に対応する実サーバーを作成します。
この例では、hostnames Service(`10.0.1.175:80`)は3つのエンドポイント(`10.244.0.5:9376`、`10.244.0.6:9376`、`10.244.0.7:9376`)を持ち、上と似た結果が得られるはずです。

### kube-proxyはプロキシしているか？

上記のルールが表示されていると仮定すると、もう一度IPを使用して`Service`へのアクセスを試してください。

```shell
u@node$ curl 10.0.1.175:80
hostnames-0uton
```

もしこれが失敗し、あなたがuserspaceプロキシーを使用している場合、プロキシーへの直接アクセスを試してみてください。
もしiptablesプロキシーを使用している場合、このセクションはスキップしてください。

上記の`iptables-save`の出力を振り返り、`kube-proxy`が`Service`に使用しているポート番号を抽出します。
上記の例では"48577"です。このポートに接続してください。

```shell
u@node$ curl localhost:48577
hostnames-yp2kp
```

もしまだ失敗する場合は、`kube-proxy`ログで次のような特定の行を探してください。

```shell
Setting endpoints for default/hostnames:default to [10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376]
```

これらが表示されない場合は、`-v`フラグを4に設定して`kube-proxy`を再起動してから、再度ログを確認してください。

### PodはService IPを介して自分自身にアクセスできない

これはネットワークが"hairpin"トラフィック用に適切に設定されていない場合、通常は`kube-proxy`が`iptables`モードで実行され、Podがブリッジネットワークに接続されている場合に発生します。
`Kubelet`は`hairpin-mode`[フラグ](/docs/admin/kubelet/)を公開します。
これにより、Serviceのエンドポイントが自身のServiceのVIPにアクセスしようとした場合に、自身への負荷分散を可能にします。
`hairpin-mode`フラグは`hairpin-veth`または`promiscuous-bridge`に設定する必要があります。

この問題をトラブルシューティングする一般的な手順は次のとおりです。

* `hairpin-mode`が`hairpin-veth`または`promiscuous-bridge`に設定されていることを確認します。
次のような表示がされるはずです。この例では、`hairpin-mode`は`promiscuous-bridge`に設定されています。

```shell
u@node$ ps auxw|grep kubelet
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0

```

* 実際に使われている`hairpin-mode`を確認します。
これを行うには、kubeletログを確認する必要があります。
ログへのアクセス方法は、NodeのOSによって異なります。
一部のOSでは/var/log/kubelet.logなどのファイルですが、他のOSでは`journalctl`を使用してログにアクセスします。
互換性のために、実際に使われている`hairpin-mode`が`--hairpin-mode`フラグと一致しない場合があることに注意してください。
kubelet.logにキーワード`hairpin`を含むログ行があるかどうかを確認してください。
実際に使われている`hairpin-mode`を示す以下のようなログ行があるはずです。

```shell
I0629 00:51:43.648698    3252 kubelet.go:380] Hairpin mode set to "promiscuous-bridge"
```

* 実際に使われている`hairpin-mode`が`hairpin-veth`の場合、`Kubelet`にノードの`/sys`で操作する権限があることを確認します。
すべてが正常に機能している場合、次のようなものが表示されます。

```shell
for intf in /sys/devices/virtual/net/cbr0/brif/*; do cat $intf/hairpin_mode; done
1
1
1
1
```

実際に使われている`hairpin-mode`が`promiscuous-bridge`の場合、`Kubelet`にノード上のLinuxブリッジを操作する権限があることを確認してください。
`cbr0`ブリッジが使用され適切に構成されている場合、以下が表示されます。

```shell
u@node$ ifconfig cbr0 |grep PROMISC
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1

```

* 上記のいずれも解決しない場合、助けを求めてください。

## 助けを求める

ここまでたどり着いたということは、とてもおかしなことが起こっています。
`Service`は実行中で、`Endpoints`があり、`Pod`は実際にサービスを提供しています。
DNSは動作していて、`iptables`ルールがインストールされていて、`kube-proxy`も誤動作していないようです。
それでも、あなたの`Service`は機能していません。
おそらく私たちにお知らせ頂いた方がよいでしょう。調査をお手伝いします！

[Slack](/docs/troubleshooting/#slack)または
[Forum](https://discuss.kubernetes.io)または
[GitHub](https://github.com/kubernetes/kubernetes)でお問い合わせください。

{{% /capture %}}

{{% capture whatsnext %}}

詳細については、[トラブルシューティングドキュメント](/docs/troubleshooting/)をご覧ください。

{{% /capture %}}
