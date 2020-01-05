---
content_template: templates/concept
# title: Debug Services
title: Serviceのデバッグ
---

{{% capture overview %}}
<!--
An issue that comes up rather frequently for new installations of Kubernetes is
that a `Service` is not working properly.  You've run your `Deployment` and
created a `Service`, but you get no response when you try to access it.
This document will hopefully help you to figure out what's going wrong.
-->
新規にKubernetesをインストールした環境でかなり頻繁に発生する問題は、`Service`が適切に機能しないというものです。
`Deployment`を実行して`Service`を作成したにもかかわらず、アクセスしようとしても応答がありません。
何が問題になっているのかを理解するのに、このドキュメントがきっと役立つでしょう。


{{% /capture %}}


{{% capture body %}}

<!--
## Conventions
-->
## 規則

<!--
Throughout this doc you will see various commands that you can run.  Some
commands need to be run within a `Pod`, others on a Kubernetes `Node`, and others
can run anywhere you have `kubectl` and credentials for the cluster.  To make it
clear what is expected, this document will use the following conventions.
-->
このドキュメントでは全体を通して、実行可能なさまざまなコマンドが示されます。
中には`Pod`内で実行する必要があるコマンドもあれば、Kubernetesの`ノード`上で実行する必要があるコマンドや、`kubectl`とクラスターの認証情報がある場所であればどこでも実行できるコマンドもあります。
期待される内容を明確にするために、このドキュメントでは次の規則を使用します。

<!--
If the command "COMMAND" is expected to run in a `Pod` and produce "OUTPUT":
-->
コマンド"COMMAND"が`Pod`内で実行され、"OUTPUT"を出力すると期待される場合:

```shell
u@pod$ COMMAND
OUTPUT
```

<!--
If the command "COMMAND" is expected to run on a `Node` and produce "OUTPUT":
-->
コマンド"COMMAND"が`Node`上で実行され、"OUTPUT"を出力すると期待される場合:

```shell
u@node$ COMMAND
OUTPUT
```

<!--
If the command is "kubectl ARGS":
-->
コマンドが"kubectl ARGS"の場合:

```shell
kubectl ARGS
OUTPUT
```

<!--
## Running commands in a Pod
-->
## Pod内でコマンドを実行する

<!--
For many steps here you will want to see what a `Pod` running in the cluster
sees.  The simplest way to do this is to run an interactive alpine `Pod`:
-->
ここでの多くのステップでは、クラスターで実行されている`Pod`が見ているものを確認する必要があります。
これを行う最も簡単な方法は、インタラクティブなalpineの`Pod`を実行することです。

```none
kubectl run -it --rm --restart=Never alpine --image=alpine sh
/ #
```
{{< note >}}
<!--
If you don't see a command prompt, try pressing enter.
-->
コマンドプロンプトが表示されない場合は、Enterキーを押してみてください。
{{< /note >}}

<!--
If you already have a running `Pod` that you prefer to use, you can run a
command in it using:
-->
使用したい実行中の`Pod`が既にある場合は、以下のようにしてその`Pod`内でコマンドを実行できます。

```shell
kubectl exec <POD-NAME> -c <CONTAINER-NAME> -- <COMMAND>
```

<!--
## Setup
-->
## セットアップ

<!--
For the purposes of this walk-through, let's run some `Pods`.  Since you're
probably debugging your own `Service` you can substitute your own details, or you
can follow along and get a second data point.
-->
このウォークスルーの目的のために、いくつかの`Pod`を実行しましょう。
おそらくあなた自身の`Service`をデバッグしているので、あなた自身の詳細に置き換えることもできますし、これに沿って2番目のデータポイントを取得することもできます。

```shell
kubectl run hostnames --image=k8s.gcr.io/serve_hostname \
                        --labels=app=hostnames \
                        --port=9376 \
                        --replicas=3
deployment.apps/hostnames created
```

<!--
`kubectl` commands will print the type and name of the resource created or mutated, which can then be used in subsequent commands.
-->
`kubectl`コマンドは作成、変更されたリソースのタイプと名前を出力するので、この後のコマンドで使用することもできます。
{{< note >}}
<!--
This is the same as if you started the `Deployment` with the following YAML:
-->
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

<!--
Confirm your `Pods` are running:
-->
`Pod`が実行中であることを確認してください。

```shell
kubectl get pods -l app=hostnames
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

<!--
## Does the Service exist?
-->
## Serviceは存在するか？

<!--
The astute reader will have noticed that we did not actually create a `Service`
yet - that is intentional.  This is a step that sometimes gets forgotten, and
is the first thing to check.
-->
賢明な読者は、`Service`をまだ実際に作成していないことにお気付きかと思いますが、これは意図的です。これは時々忘れられるステップであり、最初に確認すべきことです。

<!--
So what would happen if I tried to access a non-existent `Service`?  Assuming you
have another `Pod` that consumes this `Service` by name you would get something
like:
-->
では、存在しない`Service`にアクセスしようとするとどうなるでしょうか？
この`Service`を名前で利用する別の`Pod`があると仮定すると、次のような結果が得られます。

```shell
u@pod$ wget -O- hostnames
Resolving hostnames (hostnames)... failed: Name or service not known.
wget: unable to resolve host address 'hostnames'
```

<!--
So the first thing to check is whether that `Service` actually exists:
-->
そのため、最初に確認するのは、その`Service`が実際に存在するかどうかです。

```shell
kubectl get svc hostnames
No resources found.
Error from server (NotFound): services "hostnames" not found
```

<!--
So we have a culprit, let's create the `Service`.  As before, this is for the
walk-through - you can use your own `Service`'s details here.
-->
犯人がいましたので、`Service`を作成しましょう。
前と同様に、これはウォークスルー用です。ご自身の`Service`の詳細を使用することもできます。

```shell
kubectl expose deployment hostnames --port=80 --target-port=9376
service/hostnames exposed
```

<!--
And read it back, just to be sure:
-->
そして、念のため内容を確認します。

```shell
kubectl get svc hostnames
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
```

<!--
As before, this is the same as if you had started the `Service` with YAML:
-->
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

<!--
Now you can confirm that the `Service` exists.
-->
これで、`Service`が存在することが確認できました。

<!--
## Does the Service work by DNS?
-->
## サービスはDNSによって機能しているか？

<!--
From a `Pod` in the same `Namespace`:
-->
同じ`Namespace`の`Pod`から次のコマンドを実行してください。

```shell
u@pod$ nslookup hostnames
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

<!--
If this fails, perhaps your `Pod` and `Service` are in different
`Namespaces`, try a namespace-qualified name:
-->
これが失敗した場合、おそらく`Pod`と`Service`が異なる`Namespace`にあるので、ネームスペースで修飾された名前を試してください。

```shell
u@pod$ nslookup hostnames.default
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

<!--
If this works, you'll need to adjust your app to use a cross-namespace name, or
run your app and `Service` in the same `Namespace`.  If this still fails, try a
fully-qualified name:
-->
これが機能する場合、クロスネームスペース名を使用するようにアプリケーションを調整するか、同じ`Namespace`でアプリと`Service`を実行する必要があります。
これでも失敗する場合は、完全修飾名を試してください。

```shell
u@pod$ nslookup hostnames.default.svc.cluster.local
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default.svc.cluster.local
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

<!--
Note the suffix here: "default.svc.cluster.local".  The "default" is the
`Namespace` we're operating in.  The "svc" denotes that this is a `Service`.
The "cluster.local" is your cluster domain, which COULD be different in your
own cluster.
-->
ここでのサフィックス"default.svc.cluster.local"に注意してください。
"default"は、操作している`Namespace`です。
"svc"は、これが`Service`であることを示します。
"cluster.local"はクラスタードメインであり、あなたのクラスターでは異なる場合があります。

<!--
You can also try this from a `Node` in the cluster:
-->
クラスター内の`Node`からも試すこともできます。

{{< note >}}
<!--
10.0.0.10 is my DNS `Service`, yours might be different.
-->
10.0.0.10は私のDNS `Service`であり、あなたのクラスターでは異なるかもしれません。
{{< /note >}}

```shell
u@node$ nslookup hostnames.default.svc.cluster.local 10.0.0.10
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default.svc.cluster.local
Address: 10.0.1.175
```

<!--
If you are able to do a fully-qualified name lookup but not a relative one, you
need to check that your `/etc/resolv.conf` file is correct.
-->
完全修飾名では検索できるのに、相対名ではできない場合、`/etc/resolv.conf`ファイルが正しいことを確認する必要があります。

```shell
u@pod$ cat /etc/resolv.conf
nameserver 10.0.0.10
search default.svc.cluster.local svc.cluster.local cluster.local example.com
options ndots:5
```

<!--
The `nameserver` line must indicate your cluster's DNS `Service`.  This is
passed into `kubelet` with the `--cluster-dns` flag.
-->
`nameserver`行はクラスターのDNS `Service`を示さなければなりません。
これは、`--cluster-dns`フラグで`kubelet`に渡されます。

<!--
The `search` line must include an appropriate suffix for you to find the
`Service` name.  In this case it is looking for `Services` in the local
`Namespace` (`default.svc.cluster.local`), `Services` in all `Namespaces`
(`svc.cluster.local`), and the cluster (`cluster.local`).  Depending on your own
install you might have additional records after that (up to 6 total).  The
cluster suffix is passed into `kubelet` with the `--cluster-domain` flag.  We
assume that is "cluster.local" in this document, but yours might be different,
in which case you should change that in all of the commands above.
-->
`search`行には、`Service`名を見つけるための適切なサフィックスを含める必要があります。
この場合、ローカルの`Namespace`で`Service`を見つけるためのサフィックス(`default.svc.cluster.local`)、すべての`Namespaces`で`Service`を見つけるためのサフィックス(`svc.cluster.local`)、およびクラスターのサフィックス(`cluster.local`)です。
インストール方法によっては、その後に追加のレコードがある場合があります(合計6つまで)。
クラスターのサフィックスは、`--cluster-domain`フラグを使用して`kubelet`に渡されます。
このドキュメントではそれが"cluster.local"であると仮定していますが、あなたのクラスターでは異なる場合があります。
その場合は、上記のすべてのコマンドでクラスターのサフィックスを変更する必要があります。

<!--
The `options` line must set `ndots` high enough that your DNS client library
considers search paths at all.  Kubernetes sets this to 5 by default, which is
high enough to cover all of the DNS names it generates.
-->
`options`行では、DNSクライアントライブラリーが検索パスをまったく考慮しないように`ndots`を十分に高く設定する必要があります。
Kubernetesはデフォルトでこれを5に設定します。これは、生成されるすべてのDNS名をカバーするのに十分な大きさです。

<!-- ### Does any Service exist in DNS?-->
### ServiveはDNSに存在するか？

<!--
If the above still fails - DNS lookups are not working for your `Service` - we
can take a step back and see what else is not working.  The Kubernetes master
`Service` should always work:
-->
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

<!--
If this fails, you might need to go to the kube-proxy section of this doc, or
even go back to the top of this document and start over, but instead of
debugging your own `Service`, debug DNS.
-->
これが失敗した場合、このドキュメントのkube-proxyセクションに移動するか、あるいは、このドキュメントの先頭に戻って最初からやり直し、あなた自身の`Service`をデバッグする代わりにDNSをデバッグする必要があるかもしれません。

<!--
## Does the Service work by IP?
-->
## ServiceはIPでは機能するか？

<!--
Assuming we can confirm that DNS works, the next thing to test is whether your
`Service` works at all.  From a node in your cluster, access the `Service`'s
IP (from `kubectl get` above).
-->
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

<!--
If your `Service` is working, you should get correct responses.  If not, there
are a number of things that could be going wrong.  Read on.
-->
`Service`が機能している場合は、正しい応答が得られるはずです。
そうでない場合、おかしい可能性のあるものがいくつかありますので、続けましょう。

<!--
## Is the Service correct?
-->
## Serviceは正しいか？

<!--
It might sound silly, but you should really double and triple check that your
`Service` is correct and matches your `Pod`'s port.  Read back your `Service`
and verify it:
-->
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

<!--
* Is the port you are trying to access in `spec.ports[]`? 
* Is the `targetPort` correct for your `Pods` (many `Pods` choose to use a different port than the `Service`)?
* If you meant it to be a numeric port, is it a number (9376) or a
string "9376"?
* If you meant it to be a named port, do your `Pods` expose a port
with the same name?
* Is the port's `protocol` the same as the `Pod`'s?
-->
* アクセスしようとしているポートは`spec.ports[]`に定義されていますか？
* `targetPort`は`Pod`に対して適切ですか(多くの`Pod`は`Service`とは異なるポートを使用することを選択します)？
* `targetPort`を数値で定義しようとしている場合、それは数値(9376)、文字列"9376"のどちらですか？
* `targetPort`を名前で定義しようとしている場合、`Pod`は同じ名前でポートを公開していますか？
* ポートの`protocol`は`Pod`のものと同じですか？

<!--
## Does the Service have any Endpoints?
-->
## ServiceにEndpointがあるか？

<!--
If you got this far, we assume that you have confirmed that your `Service`
exists and is resolved by DNS.  Now let's check that the `Pods` you ran are
actually being selected by the `Service`.
-->
ここまで来たということは、`Service`は存在し、DNSによって名前解決できることが確認できているでしょう。
ここでは、実行した`Pod`が`Service`によって実際に選択されていることを確認しましょう。

<!--
Earlier we saw that the `Pods` were running.  We can re-check that:
-->
以前に、`Pod`が実行されていることを確認しました。再確認しましょう。

```shell
kubectl get pods -l app=hostnames
NAME              READY     STATUS    RESTARTS   AGE
hostnames-0uton   1/1       Running   0          1h
hostnames-bvc05   1/1       Running   0          1h
hostnames-yp2kp   1/1       Running   0          1h
```

<!--
The "AGE" column says that these `Pods` are about an hour old, which implies that
they are running fine and not crashing.
-->
"AGE"列は、これらの`Pod`が約1時間前のものであることを示しており、それらが正常に実行され、クラッシュしていないことを意味します。

<!--
The `-l app=hostnames` argument is a label selector - just like our `Service`
has.  Inside the Kubernetes system is a control loop which evaluates the
selector of every `Service` and saves the results into an `Endpoints` object.
-->
`-l app=hostnames`引数はラベルセレクターで、ちょうど私たちの`Service`に定義されているものと同じです。
Kubernetesシステム内には、すべての`Service`のセレクターを評価し、結果を`Endpoint`オブジェクトに保存するコントロールループがあります。

```shell
kubectl get endpoints hostnames
NAME        ENDPOINTS
hostnames   10.244.0.5:9376,10.244.0.6:9376,10.244.0.7:9376
```

<!--
This confirms that the endpoints controller has found the correct `Pods` for
your `Service`.  If the `hostnames` row is blank, you should check that the
`spec.selector` field of your `Service` actually selects for `metadata.labels`
values on your `Pods`.  A common mistake is to have a typo or other error, such
as the `Service` selecting for `run=hostnames`, but the `Deployment` specifying
`app=hostnames`.
-->
これにより、Endpointコントローラーが`Service`の正しい`Pod`を見つけていることを確認できます。
`hostnames`行が空白の場合、`Service`の`spec.selector`フィールドが実際に`Pod`の`metadata.labels`値を選択していることを確認する必要があります。
よくある間違いは、タイプミスまたは他のエラー、たとえば`Service`が`run=hostnames`を選択しているのに`Deployment`が`app=hostnames`を指定していることです。

<!--
## Are the Pods working?
-->
## Podは機能しているか？

<!--
At this point, we know that your `Service` exists and has selected your `Pods`.
Let's check that the `Pods` are actually working - we can bypass the `Service`
mechanism and go straight to the `Pods`.
-->
この時点で、`Service`が存在し、`Pod`を選択していることがわかります。
`Pod`が実際に機能していることを確認しましょう。`Service`メカニズムをバイパスして、`Pod`に直接アクセスすることができます。

{{< note >}}
<!--
These commands use the `Pod` port (9376), rather than the `Service` port (80).
-->
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

<!--
We expect each `Pod` in the `Endpoints` list to return its own hostname.  If
this is not what happens (or whatever the correct behavior is for your own
`Pods`), you should investigate what's happening there.  You might find
`kubectl logs` to be useful or `kubectl exec` directly to your `Pods` and check
service from there.
-->
`Endpoint`リスト内の各`Pod`は、それぞれの自身のホスト名を返すはずです。
そうならない(または、あなた自身の`Pod`の正しい振る舞いにならない)場合は、そこで何が起こっているのかを調査する必要があります。
`kubectl logs`が役立つかもしれません。あるいは、`kubectl exec`で直接`Pod`にアクセスし、そこでサービスをチェックしましょう。

<!--
Another thing to check is that your `Pods` are not crashing or being restarted.
Frequent restarts could lead to intermittent connectivity issues.
-->
もう1つ確認すべきことは、`Pod`がクラッシュしたり、再起動されていないことです。
頻繁に再起動されていると、断続的な接続の問題が発生する可能性があります。

```shell
kubectl get pods -l app=hostnames
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

<!--
If the restart count is high, read more about how to [debug
pods](/docs/tasks/debug-application-cluster/debug-pod-replication-controller/#debugging-pods).
-->
再起動回数が多い場合は、[Podをデバッグする](/ja/docs/tasks/debug-application-cluster/debug-pod-replication-controller/#podのデバッグ)方法の詳細をご覧ください。

<!--
## Is the kube-proxy working?
-->
## kube-proxyは機能しているか？

<!--
If you get here, your `Service` is running, has `Endpoints`, and your `Pods`
are actually serving.  At this point, the whole `Service` proxy mechanism is
suspect.  Let's confirm it, piece by piece.
-->
ここに到達したのなら、`Service`は実行され、`Endpoint`があり、`Pod`が実際にサービスを提供しています。
この時点で、`Service`のプロキシメカニズム全体が疑わしいです。
ひとつひとつ確認しましょう。

<!--
### Is kube-proxy running?
-->
### kube-proxyは実行されているか？

<!--
Confirm that `kube-proxy` is running on your `Nodes`.  You should get something
like the below:
-->
`kube-proxy`が`Node`上で実行されていることを確認しましょう。
以下のような結果が得られるはずです。

```shell
u@node$ ps auxw | grep kube-proxy
root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
```

<!--
Next, confirm that it is not failing something obvious, like contacting the
master.  To do this, you'll have to look at the logs.  Accessing the logs
depends on your `Node` OS.  On some OSes it is a file, such as
/var/log/kube-proxy.log, while other OSes use `journalctl` to access logs.  You
should see something like:
-->
次に、マスターとの接続など、明らかな失敗をしていないことを確認します。
これを行うには、ログを確認する必要があります。
ログへのアクセス方法は、`Node`のOSに依存します。
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

<!--
If you see error messages about not being able to contact the master, you
should double-check your `Node` configuration and installation steps.
-->
マスターに接続できないことに関するエラーメッセージが表示された場合、`Node`の設定とインストール手順をダブルチェックする必要があります。

<!--
One of the possible reasons that `kube-proxy` cannot run correctly is that the
required `conntrack` binary cannot be found. This may happen on some Linux
systems, depending on how you are installing the cluster, for example, you are
installing Kubernetes from scratch. If this is the case, you need to manually
install the `conntrack` package (e.g. `sudo apt install conntrack` on Ubuntu)
and then retry.
-->
`kube-proxy`が正しく実行できない理由の可能性の1つは、必須の`conntrack`バイナリが見つからないことです。
これは、例えばKubernetesをスクラッチからインストールするなど、クラスターのインストール方法に依存して、一部のLinuxシステムで発生する場合があります。
これが該当する場合は、`conntrack`パッケージを手動でインストール(例: Ubuntuでは`sudo apt install conntrack`)する必要があり、その後に再試行する必要があります。

<!--
### Is kube-proxy writing iptables rules?
-->
### kube-proxyはiptablesルールを書いているか？

<!--
One of the main responsibilities of `kube-proxy` is to write the `iptables`
rules which implement `Services`.  Let's check that those rules are getting
written.
-->
`kube-proxy`の主な責務の1つは、`Services`を実装する`iptables`ルールを記述することです。
それらのルールが書かれていることを確認しましょう。

<!--
The kube-proxy can run in "userspace" mode, "iptables" mode or "ipvs" mode.
Hopefully you are using the "iptables" mode or "ipvs" mode.  You
should see one of the following cases.
-->
kube-proxyは、"userspace"モード、"iptables"モード、または"ipvs"モードで実行できます。
あなたが"iptables"モードまたは"ipvs"モードを使用していることを願います。
続くケースのいずれかが表示されるはずです。

#### Userspace

```shell
u@node$ iptables-save | grep hostnames
-A KUBE-PORTALS-CONTAINER -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j REDIRECT --to-ports 48577
-A KUBE-PORTALS-HOST -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j DNAT --to-destination 10.240.115.247:48577
```

<!--
There should be 2 rules for each port on your `Service` (just one in this
example) - a "KUBE-PORTALS-CONTAINER" and a "KUBE-PORTALS-HOST".  If you do
not see these, try restarting `kube-proxy` with the `-v` flag set to 4, and
then look at the logs again.
-->
`Service`の各ポート毎(この例では1つ)に2つのルールがあるはずです。
"KUBE-PORTALS-CONTAINER"と"KUBE-PORTALS-HOST"です。
これらが表示されない場合は、`-v`フラグを4に設定して`kube-proxy`を再起動してから、もう一度ログを確認してください。

<!--
Almost nobody should be using the "userspace" mode any more, so we won't spend
more time on it here.
-->
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

<!--
There should be 1 rule in `KUBE-SERVICES`, 1 or 2 rules per endpoint in
`KUBE-SVC-(hash)` (depending on `SessionAffinity`), one `KUBE-SEP-(hash)` chain
per endpoint, and a few rules in each `KUBE-SEP-(hash)` chain.  The exact rules
will vary based on your exact config (including node-ports and load-balancers).
-->
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

<!--
IPVS proxy will create a virtual server for each service address(e.g. Cluster IP, External IP, NodePort IP, Load Balancer IP etc.) and some corresponding real servers for endpoints of the service, if any. In this example, service hostnames(`10.0.1.175:80`) has 3 endpoints(`10.244.0.5:9376`, `10.244.0.6:9376`, `10.244.0.7:9376`) and you'll get results similar to above.
-->
IPVSプロキシーは、各Serviceアドレス(Cluster IP、External IP、NodePort IP、Load Balancer IPなど)毎の仮想サーバーと、Serviceのエンドポイントが存在する場合に対応する実サーバーを作成します。
この例では、サービスホスト名(`10.0.1.175:80`)は3つのエンドポイント(`10.244.0.5:9376`、`10.244.0.6:9376`、`10.244.0.7:9376`)を持ち、上と似た結果が得られるはずです。

<!--
### Is kube-proxy proxying?
-->
### kube-proxyはプロキシしているか？

<!--
Assuming you do see the above rules, try again to access your `Service` by IP:
-->
上記のルールが表示されていると仮定すると、もう一度IPを使用して`Service`へのアクセスを試してください。

```shell
u@node$ curl 10.0.1.175:80
hostnames-0uton
```

<!--
If this fails and you are using the userspace proxy, you can try accessing the
proxy directly.  If you are using the iptables proxy, skip this section.
-->
もしこれが失敗し、あなたがuserspaceプロキシーを使用している場合、プロキシーへの直接アクセスを試してみてください。
もしiptablesプロキシーを使用している場合、このセクションはスキップしてください。

<!--
Look back at the `iptables-save` output above, and extract the
port number that `kube-proxy` is using for your `Service`.  In the above
examples it is "48577".  Now connect to that:
-->
上記の`iptables-save`の出力を振り返り、`kube-proxy`が`Service`に使用しているポート番号を抽出します。
上記の例では"48577"です。このポートに接続してください。

```shell
u@node$ curl localhost:48577
hostnames-yp2kp
```

<!--
If this still fails, look at the `kube-proxy` logs for specific lines like:
-->
もしまだ失敗する場合は、`kube-proxy`ログで次のような特定の行を探してください。

```shell
Setting endpoints for default/hostnames:default to [10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376]
```

<!--
If you don't see those, try restarting `kube-proxy` with the `-v` flag set to 4, and
then look at the logs again.
-->
これらが表示されない場合は、`-v`フラグを4に設定して`kube-proxy`を再起動してから、再度ログを確認してください。

<!--
### A Pod cannot reach itself via Service IP
-->
### PodはService IPを介して自分自身にアクセスできない

<!--
This can happen when the network is not properly configured for "hairpin"
traffic, usually when `kube-proxy` is running in `iptables` mode and Pods
are connected with bridge network. The `Kubelet` exposes a `hairpin-mode`
[flag](/docs/admin/kubelet/) that allows endpoints of a Service to loadbalance back to themselves
if they try to access their own Service VIP. The `hairpin-mode` flag must either be
set to `hairpin-veth` or `promiscuous-bridge`.
-->
これはネットワークが"hairpin"トラフィック用に適切に設定されていない場合、通常は`kube-proxy`が`iptables`モードで実行され、Podがブリッジネットワークに接続されている場合に発生します。
`Kubelet`は`hairpin-mode`[フラグ](/docs/admin/kubelet/)を公開します。
これにより、Serviceのエンドポイントが自身のServiceのVIPにアクセスしようとした場合に、自身への負荷分散を可能にします。
`hairpin-mode`フラグは`hairpin-veth`または`promiscuous-bridge`に設定する必要があります。

<!--
The common steps to trouble shoot this are as follows:
-->
この問題をトラブルシューティングする一般的な手順は次のとおりです。

<!--
* Confirm `hairpin-mode` is set to `hairpin-veth` or `promiscuous-bridge`.
You should see something like the below. `hairpin-mode` is set to
`promiscuous-bridge` in the following example.
-->
* `hairpin-mode`が`hairpin-veth`または`promiscuous-bridge`に設定されていることを確認します。
次のような表示がされるはずです。この例では、`hairpin-mode`は`promiscuous-bridge`に設定されています。

```shell
u@node$ ps auxw|grep kubelet
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0

```

<!--
* Confirm the effective `hairpin-mode`. To do this, you'll have to look at
kubelet log. Accessing the logs depends on your Node OS. On some OSes it
is a file, such as /var/log/kubelet.log, while other OSes use `journalctl`
to access logs. Please be noted that the effective hairpin mode may not
match `--hairpin-mode` flag due to compatibility. Check if there is any log
lines with key word `hairpin` in kubelet.log. There should be log lines
indicating the effective hairpin mode, like something below.
-->
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

<!--
* If the effective hairpin mode is `hairpin-veth`, ensure the `Kubelet` has
the permission to operate in `/sys` on node. If everything works properly,
you should see something like:
-->
* 実際に使われている`hairpin-mode`が`hairpin-veth`の場合、`Kubelet`にノードの`/sys`で操作する権限があることを確認します。
すべてが正常に機能している場合、次のようなものが表示されます。

```shell
for intf in /sys/devices/virtual/net/cbr0/brif/*; do cat $intf/hairpin_mode; done
1
1
1
1
```

<!--
* If the effective hairpin mode is `promiscuous-bridge`, ensure `Kubelet`
has the permission to manipulate linux bridge on node. If cbr0` bridge is
used and configured properly, you should see:
-->
実際に使われている`hairpin-mode`が`promiscuous-bridge`の場合、`Kubelet`にノード上のLinuxブリッジを操作する権限があることを確認してください。
`cbr0`ブリッジが使用され適切に構成されている場合、以下が表示されます。

```shell
u@node$ ifconfig cbr0 |grep PROMISC
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1

```

<!--
* Seek help if none of above works out.
-->
* 上記のいずれも解決しない場合、助けを求めてください。

<!--
## Seek help
-->
## 助けを求める

<!--
If you get this far, something very strange is happening.  Your `Service` is
running, has `Endpoints`, and your `Pods` are actually serving.  You have DNS
working, `iptables` rules installed, and `kube-proxy` does not seem to be
misbehaving.  And yet your `Service` is not working.  You should probably let
us know, so we can help investigate!
-->
ここまでたどり着いたということは、とてもおかしなことが起こっています。
`Service`は実行中で、`Endpoint`があり、`Pod`は実際にサービスを提供しています。
DNSは動作していて、`iptables`ルールがインストールされていて、`kube-proxy`も誤動作していないようです。
それでも、あなたの`Service`は機能していません。
おそらく私たちにお知らせ頂いた方がよいでしょう。調査をお手伝いします！

<!--
Contact us on
[Slack](/docs/troubleshooting/#slack) or
[Forum](https://discuss.kubernetes.io) or
[GitHub](https://github.com/kubernetes/kubernetes).
-->
[Slack](/docs/troubleshooting/#slack)または
[Forum](https://discuss.kubernetes.io)または
[GitHub](https://github.com/kubernetes/kubernetes)でお問い合わせください。

{{% /capture %}}

{{% capture whatsnext %}}

<!--
Visit [troubleshooting document](/docs/troubleshooting/) for more information.
-->
詳細については、[トラブルシューティングドキュメント](/docs/troubleshooting/)をご覧ください。

{{% /capture %}}
