---
title: アプリケーションをServiceに接続する
content_type: tutorial
weight: 20
---


<!-- overview -->

## コンテナに接続するためのKubernetesモデル

さて、継続的に実行され、複製されたアプリケーションができたので、これをネットワーク上に公開できます。

Kubernetesは、Podがどのホストに配置されているかにかかわらず、ほかのPodと通信できることを引き受けます。
Kubernetesは各Podにそれぞれ固有のクラスタープライベートなIPアドレスを付与するので、Pod間のリンクや、コンテナのポートとホストのポートのマップを明示的に作成する必要はありません。
これは、Pod内のコンテナは全てlocalhost上でお互いのポートに到達でき、クラスター内の全てのPodはNATなしに互いを見られるということを意味します。このドキュメントの残りの部分では、このようなネットワークモデルの上で信頼性のあるServiceを実行する方法について、詳しく述べていきます。

このチュートリアルでは概念のデモンストレーションのために、シンプルなnginx Webサーバーを例として使います。

<!-- body -->

## Podをクラスターへ公開

これは前出の例でも行いましたが、もう一度やってみて、ネットワークからの観点に着目してみましょう。
nginx Podを作成し、コンテナのポート指定も記載します:

{{% codenew file="service/networking/run-my-nginx.yaml" %}}

この設定で、あなたのクラスターにはどのノードからもアクセス可能になります。Podを実行中のノードを確認してみましょう:

```shell
kubectl apply -f ./run-my-nginx.yaml
kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
```

PodのIPアドレスを確認します:

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.4]]
    [map[ip:10.244.2.5]]
```

あなたのクラスター内のどのノードにもsshで入ることができて、双方のIPアドレスに対して問い合わせるために`curl`のようなツールを使えるようにしておくのがよいでしょう。
各コンテナはノード上でポート80を*使っておらず*、トラフィックをPodに流すための特別なNATルールもなんら存在しないことに注意してください。
つまり、全て同じ`containerPort`を使った同じノード上で複数のnginx Podを実行でき、Serviceに割り当てられたIPアドレスを使って、クラスター内のほかのどのPodあるいはノードからもそれらにアクセスできます。
背後にあるPodにフォワードするためにホストNode上の特定のポートを充てたいというのであれば、それも可能です。とはいえ、ネットワークモデルではそのようなことをする必要がありません。

興味があれば、さらなる詳細について
[Kubernetesネットワークモデル](/ja/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model)
を読んでください。

## Serviceの作成

さて、フラットなクラスター全体のアドレス空間内でnginxを実行中のPodが得られました。
理論的にはこれらのPodと直接対話することは可能ですが、ノードが死んでしまった時には何が起きるでしょうか？
ノードと一緒にPodは死に、Deploymentが新しいPodを異なるIPアドレスで作成します。
これがServiceが解決する問題です。

KubernetesのServiceは、全て同じ機能を提供する、クラスター内のどこかで実行するPodの論理的な集合を定義した抽象物です。
作成時に各Serviceは固有のIPアドレス(clusterIPとも呼ばれます)を割り当てられます。
このアドレスはServiceのライフスパンと結び付けられており、Serviceが生きている間は変わりません。
PodはServiceと対話できるよう設定され、Serviceのメンバーである複数のPodへ自動的に負荷分散されたServiceへ通信する方法を知っています。

`kubectl expose`を使って、2つのnginxレプリカのためのServiceを作成できます:

```shell
kubectl expose deployment/my-nginx
```
```
service/my-nginx exposed
```

これは`kubectl apply -f`を以下のyamlに対して実行するのと同じです:

{{% codenew file="service/networking/nginx-svc.yaml" %}}

この指定は、`run: my-nginx`ラベルの付いた任意のPod上のTCPポート80を宛先とし、それを抽象化されたServiceポート(`targetPort`はコンテナがトラフィックを許可するポート、`port`は抽象化されたServiceポートで、ほかのPodがServiceにアクセスするのに使う任意のポートです)で公開するServiceを作成します。
Service定義内でサポートされているフィールドのリストを見るには、[Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core) APIオブジェクトを参照してください。
Serviceを確認してみましょう:

```shell
kubectl get svc my-nginx
```
```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
```

前述したとおり、ServiceはPodのグループに支えられています。
これらのPodは{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlices">}}を通して公開されています。
Serviceのセレクターは継続的に評価され、その結果はServiceに接続されているEndpointSliceに{{< glossary_tooltip text="labels" term_id="label" >}}を使って「投稿(POST)」されます。

Podが死ぬと、エンドポイントとして含まれていたEndpointSliceからそのPodは自動的に削除されます。
Serviceのセレクターにマッチする新しいPodが、Serviceのために自動的にEndpointSliceに追加されます。
エンドポイントを確認し、IPアドレスが最初のステップで作成したPodと同じであることに注目してください:

```shell
kubectl describe svc my-nginx
```
```
Name:                my-nginx
Namespace:           default
Labels:              run=my-nginx
Annotations:         <none>
Selector:            run=my-nginx
Type:                ClusterIP
IP Family Policy:    SingleStack
IP Families:         IPv4
IP:                  10.0.162.149
IPs:                 10.0.162.149
Port:                <unset> 80/TCP
TargetPort:          80/TCP
Endpoints:           10.244.2.5:80,10.244.3.4:80
Session Affinity:    None
Events:              <none>
```
```shell
kubectl get endpointslices -l kubernetes.io/service-name=my-nginx
```
```
NAME             ADDRESSTYPE   PORTS   ENDPOINTS               AGE
my-nginx-7vzhx   IPv4          80      10.244.2.5,10.244.3.4   21s
```

今や、あなたのクラスター内のどのノードからもnginx Serviceに`<CLUSTER-IP>:<PORT>`でcurlを使用してアクセスできるはずです。Service IPは完全に仮想であり、物理的なケーブルで接続されるものではありません。どのように動作しているのか興味があれば、さらなる詳細について[サービスプロキシ](/ja/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)を読んでください。

## Serviceへのアクセス

KubernetesはServiceを探す2つの主要なモードとして、環境変数とDNSをサポートしています。
前者はすぐに動かせるのに対し、後者は[CoreDNSクラスターアドオン](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/coredns)が必要です。

{{< note >}}
もしServiceの環境変数が望ましくないなら(想定しているプログラムの環境変数と競合する可能性がある、処理する変数が多すぎる、DNSだけ使いたい、など)、[pod spec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)で`enableServiceLinks`のフラグを`false`にすることで、このモードを無効化できます。
{{< /note >}}

### 環境変数

PodをNode上で実行する時、kubeletはアクティブなServiceのそれぞれに環境変数のセットを追加します。
これは順序問題を生みます。なぜそうなるかの理由を見るために、実行中のnginx Podの環境を調査してみましょう(Podの名前は環境によって異なります):

```shell
kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
```

Serviceについて何も言及がないことに注意してください。
これは、Serviceの前にレプリカを作成したからです。
このようにすることでの不利益のもう1つは、スケジューラーが同一のマシンに両方のPodを置く可能性があることです(もしそのマシンが死ぬと全Serviceがダウンしてしまいます)。
2つのPodを殺し、Deploymentがそれらを再作成するのを待つことで、これを正しいやり方にできます。
今回は、レプリカの*前に*Serviceが存在します。
これにより、正しい環境変数だけでなく、(全てのノードで等量のキャパシティを持つ場合)Podに広がった、スケジューラーレベルのServiceが得られます:

```shell
kubectl scale deployment my-nginx --replicas=0; kubectl scale deployment my-nginx --replicas=2;

kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
```

Podが、いったん殺されて再作成された後、異なる名前を持ったことに気付いたでしょうか。

```shell
kubectl exec my-nginx-3800858182-e9ihh -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_PORT=443
MY_NGINX_SERVICE_HOST=10.0.162.149
KUBERNETES_SERVICE_HOST=10.0.0.1
MY_NGINX_SERVICE_PORT=80
KUBERNETES_SERVICE_PORT_HTTPS=443
```

### DNS

Kubernetesは、DNS名をほかのServiceに自動的に割り当てる、DNSクラスターアドオンServiceを提供しています。
クラスター上でそれを実行しているならば、確認できます:

```shell
kubectl get services kube-dns --namespace=kube-system
```
```
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

本セクションの以降では、長寿命のIPアドレス(my-nginx)を持つServiceと、そのIPアドレスに名前を割り当てているDNSサーバーがあることを想定しています。
ここではCoreDNSクラスターアドオン(アプリケーション名`kube-dns`)を使い、標準的な手法(例えば`gethostbyname()`)を使ってクラスター内の任意のPodからServiceと対話してみます。
CoreDNSが動作していない時には、
[CoreDNS README](https://github.com/coredns/deployment/tree/master/kubernetes)
や[CoreDNSのインストール](/ja/docs/tasks/administer-cluster/coredns/#installing-coredns)を参照して有効化してください。
テストするために、別のcurlアプリケーションを実行してみましょう:

```shell
kubectl run curl --image=radial/busyboxplus:curl -i --tty
```
```
Waiting for pod default/curl-131556218-9fnch to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

次にenterを押し、`nslookup my-nginx`を実行します:

```shell
[ root@curl-131556218-9fnch:/ ]$ nslookup my-nginx
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      my-nginx
Address 1: 10.0.162.149
```

## Serviceのセキュア化

これまではクラスター内からnginxサーバーだけにアクセスしてきました。
Serviceをインターネットに公開する前に、通信経路がセキュアかどうかを確かめたいところです。
そのためには次のようなものが必要です:

* https用の自己署名証明書(まだ本人証明を用意していない場合)
* 証明書を使うよう設定されたnginxサーバー
* 証明書をPodからアクセスできるようにする[Secret](/ja/docs/concepts/configuration/secret/)

これら全ては[nginx https example](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/)から取得できます。
go環境とmakeツールのインストールが必要です
(もしこれらをインストールしたくないときには、後述の手動手順に従ってください)。簡潔には:

```shell
make keys KEY=/tmp/nginx.key CERT=/tmp/nginx.crt
kubectl create secret tls nginxsecret --key /tmp/nginx.key --cert /tmp/nginx.crt
```
```
secret/nginxsecret created
```
```shell
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```
configmapも同様:
```shell
kubectl create configmap nginxconfigmap --from-file=default.conf
```
```
configmap/nginxconfigmap created
```
```shell
kubectl get configmaps
```
```
NAME             DATA   AGE
nginxconfigmap   1      114s
```
以下に示すのは、makeを実行したときに問題が発生する場合(例えばWindowsなど)の手動手順です:

```shell
# 公開鍵と秘密鍵のペアを作成する
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
# 鍵をbase64エンコーディングに変換する
cat /d/tmp/nginx.crt | base64
cat /d/tmp/nginx.key | base64
```

以下のようなyamlファイルを作成するために、前のコマンドからの出力を使います。
base64エンコードされた値は、全て1行で記述する必要があります。

```yaml
apiVersion: "v1"
kind: "Secret"
metadata:
  name: "nginxsecret"
  namespace: "default"
type: kubernetes.io/tls
data:
  tls.crt: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURIekNDQWdlZ0F3SUJBZ0lKQUp5M3lQK0pzMlpJTUEwR0NTcUdTSWIzRFFFQkJRVUFNQ1l4RVRBUEJnTlYKQkFNVENHNW5hVzU0YzNaak1SRXdEd1lEVlFRS0V3aHVaMmx1ZUhOMll6QWVGdzB4TnpFd01qWXdOekEzTVRKYQpGdzB4T0RFd01qWXdOekEzTVRKYU1DWXhFVEFQQmdOVkJBTVRDRzVuYVc1NGMzWmpNUkV3RHdZRFZRUUtFd2h1CloybHVlSE4yWXpDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBSjFxSU1SOVdWM0IKMlZIQlRMRmtobDRONXljMEJxYUhIQktMSnJMcy8vdzZhU3hRS29GbHlJSU94NGUrMlN5ajBFcndCLzlYTnBwbQppeW1CL3JkRldkOXg5UWhBQUxCZkVaTmNiV3NsTVFVcnhBZW50VWt1dk1vLzgvMHRpbGhjc3paenJEYVJ4NEo5Ci82UVRtVVI3a0ZTWUpOWTVQZkR3cGc3dlVvaDZmZ1Voam92VG42eHNVR0M2QURVODBpNXFlZWhNeVI1N2lmU2YKNHZpaXdIY3hnL3lZR1JBRS9mRTRqakxCdmdONjc2SU90S01rZXV3R0ljNDFhd05tNnNTSzRqYUNGeGpYSnZaZQp2by9kTlEybHhHWCtKT2l3SEhXbXNhdGp4WTRaNVk3R1ZoK0QrWnYvcW1mMFgvbVY0Rmo1NzV3ajFMWVBocWtsCmdhSXZYRyt4U1FVQ0F3RUFBYU5RTUU0d0hRWURWUjBPQkJZRUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjcKTUI4R0ExVWRJd1FZTUJhQUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjdNQXdHQTFVZEV3UUZNQU1CQWY4dwpEUVlKS29aSWh2Y05BUUVGQlFBRGdnRUJBRVhTMW9FU0lFaXdyMDhWcVA0K2NwTHI3TW5FMTducDBvMm14alFvCjRGb0RvRjdRZnZqeE04Tzd2TjB0clcxb2pGSW0vWDE4ZnZaL3k4ZzVaWG40Vm8zc3hKVmRBcStNZC9jTStzUGEKNmJjTkNUekZqeFpUV0UrKzE5NS9zb2dmOUZ3VDVDK3U2Q3B5N0M3MTZvUXRUakViV05VdEt4cXI0Nk1OZWNCMApwRFhWZmdWQTRadkR4NFo3S2RiZDY5eXM3OVFHYmg5ZW1PZ05NZFlsSUswSGt0ejF5WU4vbVpmK3FqTkJqbWZjCkNnMnlwbGQ0Wi8rUUNQZjl3SkoybFIrY2FnT0R4elBWcGxNSEcybzgvTHFDdnh6elZPUDUxeXdLZEtxaUMwSVEKQ0I5T2wwWW5scE9UNEh1b2hSUzBPOStlMm9KdFZsNUIyczRpbDlhZ3RTVXFxUlU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
  tls.key: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQ2RhaURFZlZsZHdkbFIKd1V5eFpJWmVEZWNuTkFhbWh4d1NpeWF5N1AvOE9ta3NVQ3FCWmNpQ0RzZUh2dGtzbzlCSzhBZi9WemFhWm9zcApnZjYzUlZuZmNmVUlRQUN3WHhHVFhHMXJKVEVGSzhRSHA3VkpMcnpLUC9QOUxZcFlYTE0yYzZ3MmtjZUNmZitrCkU1bEVlNUJVbUNUV09UM3c4S1lPNzFLSWVuNEZJWTZMMDUrc2JGQmd1Z0ExUE5JdWFubm9UTWtlZTRuMG4rTDQKb3NCM01ZUDhtQmtRQlAzeE9JNHl3YjREZXUraURyU2pKSHJzQmlIT05Xc0RadXJFaXVJMmdoY1kxeWIyWHI2UAozVFVOcGNSbC9pVG9zQngxcHJHclk4V09HZVdPeGxZZmcvbWIvNnBuOUYvNWxlQlkrZStjSTlTMkQ0YXBKWUdpCkwxeHZzVWtGQWdNQkFBRUNnZ0VBZFhCK0xkbk8ySElOTGo5bWRsb25IUGlHWWVzZ294RGQwci9hQ1Zkank4dlEKTjIwL3FQWkUxek1yall6Ry9kVGhTMmMwc0QxaTBXSjdwR1lGb0xtdXlWTjltY0FXUTM5SjM0VHZaU2FFSWZWNgo5TE1jUHhNTmFsNjRLMFRVbUFQZytGam9QSFlhUUxLOERLOUtnNXNrSE5pOWNzMlY5ckd6VWlVZWtBL0RBUlBTClI3L2ZjUFBacDRuRWVBZmI3WTk1R1llb1p5V21SU3VKdlNyblBESGtUdW1vVlVWdkxMRHRzaG9reUxiTWVtN3oKMmJzVmpwSW1GTHJqbGtmQXlpNHg0WjJrV3YyMFRrdWtsZU1jaVlMbjk4QWxiRi9DSmRLM3QraTRoMTVlR2ZQegpoTnh3bk9QdlVTaDR2Q0o3c2Q5TmtEUGJvS2JneVVHOXBYamZhRGR2UVFLQmdRRFFLM01nUkhkQ1pKNVFqZWFKClFGdXF4cHdnNzhZTjQyL1NwenlUYmtGcVFoQWtyczJxWGx1MDZBRzhrZzIzQkswaHkzaE9zSGgxcXRVK3NHZVAKOWRERHBsUWV0ODZsY2FlR3hoc0V0L1R6cEdtNGFKSm5oNzVVaTVGZk9QTDhPTm1FZ3MxMVRhUldhNzZxelRyMgphRlpjQ2pWV1g0YnRSTHVwSkgrMjZnY0FhUUtCZ1FEQmxVSUUzTnNVOFBBZEYvL25sQVB5VWs1T3lDdWc3dmVyClUycXlrdXFzYnBkSi9hODViT1JhM05IVmpVM25uRGpHVHBWaE9JeXg5TEFrc2RwZEFjVmxvcG9HODhXYk9lMTAKMUdqbnkySmdDK3JVWUZiRGtpUGx1K09IYnRnOXFYcGJMSHBzUVpsMGhucDBYSFNYVm9CMUliQndnMGEyOFVadApCbFBtWmc2d1BRS0JnRHVIUVV2SDZHYTNDVUsxNFdmOFhIcFFnMU16M2VvWTBPQm5iSDRvZUZKZmcraEppSXlnCm9RN3hqWldVR3BIc3AyblRtcHErQWlSNzdyRVhsdlhtOElVU2FsbkNiRGlKY01Pc29RdFBZNS9NczJMRm5LQTQKaENmL0pWb2FtZm1nZEN0ZGtFMXNINE9MR2lJVHdEbTRpb0dWZGIwMllnbzFyb2htNUpLMUI3MkpBb0dBUW01UQpHNDhXOTVhL0w1eSt5dCsyZ3YvUHM2VnBvMjZlTzRNQ3lJazJVem9ZWE9IYnNkODJkaC8xT2sybGdHZlI2K3VuCnc1YytZUXRSTHlhQmd3MUtpbGhFZDBKTWU3cGpUSVpnQWJ0LzVPbnlDak9OVXN2aDJjS2lrQ1Z2dTZsZlBjNkQKckliT2ZIaHhxV0RZK2Q1TGN1YSt2NzJ0RkxhenJsSlBsRzlOZHhrQ2dZRUF5elIzT3UyMDNRVVV6bUlCRkwzZAp4Wm5XZ0JLSEo3TnNxcGFWb2RjL0d5aGVycjFDZzE2MmJaSjJDV2RsZkI0VEdtUjZZdmxTZEFOOFRwUWhFbUtKCnFBLzVzdHdxNWd0WGVLOVJmMWxXK29xNThRNTBxMmk1NVdUTThoSDZhTjlaMTltZ0FGdE5VdGNqQUx2dFYxdEYKWSs4WFJkSHJaRnBIWll2NWkwVW1VbGc9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K"
```
では、このファイルを使ってSecretを作成します:

```shell
kubectl apply -f nginxsecrets.yaml
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```

Secretにある証明書を使ってhttpsサーバーを開始するために、nginxレプリカを変更します。また、Serviceは(80および443の)両方のポートを公開するようにします:

{{% codenew file="service/networking/nginx-secure-app.yaml" %}}

nginx-secure-appマニフェストの注目すべきポイント:

- DeploymentとServiceの指定の両方が同じファイルに含まれています。
- [nginxサーバー](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/default.conf)は、ポート80でHTTPトラフィック、ポート443でHTTPSトラフィックをサービスし、nginx Serviceは両方のポートを公開します。
- 各コンテナは、`/etc/nginx/ssl`にマウントされたボリューム経由で鍵にアクセスできます。
  これはnginxサーバーが開始する*前*にセットアップされます。

```shell
kubectl delete deployments,svc my-nginx; kubectl create -f ./nginx-secure-app.yaml
```

この時点で、任意のノードからnginxサーバーに到達できます。

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.5]]
```

```shell
node $ curl -k https://10.244.3.5
...
<h1>Welcome to nginx!</h1>
```

最後の手順でcurlに`-k`パラメーターを与えていることに注意してください。
これは、証明書の生成時点ではnginxを実行中のPodについて何もわからないので、curlにCNameのミスマッチを無視するよう指示する必要があるからです。
Serviceを作成することで、証明書で使われているCNameと、PodがServiceルックアップ時に使う実際のDNS名とがリンクされます。
Podからこれをテストしてみましょう(単純化のため同じSecretが再利用されるので、ServiceにアクセスするのにPodが必要なのはnginx.crtだけです):

{{% codenew file="service/networking/curlpod.yaml" %}}

```shell
kubectl apply -f ./curlpod.yaml
kubectl get pods -l app=curlpod
```
```
NAME                               READY     STATUS    RESTARTS   AGE
curl-deployment-1515033274-1410r   1/1       Running   0          1m
```
```shell
kubectl exec curl-deployment-1515033274-1410r -- curl https://my-nginx --cacert /etc/nginx/ssl/tls.crt
...
<title>Welcome to nginx!</title>
...
```

## Serviceの公開

アプリケーションのいくつかの部分においては、Serviceを外部IPアドレスで公開したいと思うかもしれません。
Kubernetesはこれに対して2つのやり方をサポートしています: NodePortとLoadBalancerです。
前のセクションで作成したServiceではすでに`NodePort`を使っていたので、ノードにパブリックIPアドレスがあれば、nginx HTTPSレプリカもトラフィックをインターネットでサービスする準備がすでに整っています。

```shell
kubectl get svc my-nginx -o yaml | grep nodePort -C 5
  uid: 07191fb3-f61a-11e5-8ae5-42010af00002
spec:
  clusterIP: 10.0.162.149
  ports:
  - name: http
    nodePort: 31704
    port: 8080
    protocol: TCP
    targetPort: 80
  - name: https
    nodePort: 32453
    port: 443
    protocol: TCP
    targetPort: 443
  selector:
    run: my-nginx
```
```shell
kubectl get nodes -o yaml | grep ExternalIP -C 1
    - address: 104.197.41.11
      type: ExternalIP
    allocatable:
--
    - address: 23.251.152.56
      type: ExternalIP
    allocatable:
...

$ curl https://<EXTERNAL-IP>:<NODE-PORT> -k
...
<h1>Welcome to nginx!</h1>
```

では、クラウドロードバランサーを使うために、Serviceを再作成してみましょう。
`my-nginx`の`Type`を`NodePort`から`LoadBalancer`に変更してください:

```shell
kubectl edit svc my-nginx
kubectl get svc my-nginx
```
```
NAME       TYPE           CLUSTER-IP     EXTERNAL-IP        PORT(S)               AGE
my-nginx   LoadBalancer   10.0.162.149     xx.xxx.xxx.xxx     8080:30163/TCP        21s
```
```
curl https://<EXTERNAL-IP> -k
...
<title>Welcome to nginx!</title>
```

`EXTERNAL-IP`列のIPアドレスが、パブリックインターネットで利用可能なものになっています。
`CLUSTER-IP`はクラスター/プライベートクラウドネットワーク内でのみ利用可能なものです。

AWSにおいては、`LoadBalancer`タイプは、IPアドレスではなく(長い)ホスト名を使うELBを作成することに注意してください。
これは標準の`kubectl get svc`の出力に合わせるには長すぎ、実際それを見るには`kubectl describe service my-nginx`を使う必要があります。
これは以下のような見た目になります:

```shell
kubectl describe service my-nginx
...
LoadBalancer Ingress:   a320587ffd19711e5a37606cf4a74574-1142138393.us-east-1.elb.amazonaws.com
...
```



## {{% heading "whatsnext" %}}


* [Serviceを利用したクラスター内のアプリケーションへのアクセス](/ja/docs/tasks/access-application-cluster/service-access-application-cluster/)を学びます。
* [Serviceを使用してフロントエンドをバックエンドに接続する](/ja/docs/tasks/access-application-cluster/connecting-frontend-backend/)方法を学びます。
* [Creating an External Load Balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/)を学びます。
