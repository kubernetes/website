---
title: サービスとアプリケーションの接続
content_type: concept
weight: 40
---


<!-- overview -->

## コンテナを接続するためのKubernetesモデル

継続的に実行され、複製されたアプリケーションの準備ができたので、ネットワーク上で公開することが可能になります。
Kubernetesのネットワークのアプローチについて説明する前に、Dockerの「通常の」ネットワーク手法と比較することが重要です。

デフォルトでは、Dockerはホストプライベートネットワーキングを使用するため、コンテナは同じマシン上にある場合にのみ他のコンテナと通信できます。
Dockerコンテナがノード間で通信するには、マシンのIPアドレスにポートを割り当ててから、コンテナに転送またはプロキシする必要があります。
これは明らかに、コンテナが使用するポートを非常に慎重に調整するか、ポートを動的に割り当てる必要があることを意味します。

コンテナを提供する複数の開発者やチーム間でポートの割り当てを調整することは、規模的に大変困難であり、ユーザが制御できないクラスターレベルの問題にさらされます。
Kubernetesでは、どのホストで稼働するかに関わらず、Podが他のPodと通信できると想定しています。
すべてのPodに独自のクラスタープライベートIPアドレスを付与するため、Pod間のリンクを明示的に作成したり、コンテナポートをホストポートにマップしたりする必要はありません。
これは、Pod内のコンテナがすべてlocalhostの相互のポートに到達でき、クラスター内のすべてのPodがNATなしで相互に認識できることを意味します。
このドキュメントの残りの部分では、このようなネットワークモデルで信頼できるサービスを実行する方法について詳しく説明します。

このガイドでは、シンプルなnginxサーバーを使用して概念実証を示します。



<!-- body -->

## Podをクラスターに公開する

前の例でネットワークモデルを紹介しましたが、再度ネットワークの観点に焦点を当てましょう。
nginx Podを作成し、コンテナポートの仕様を指定していることに注意してください。

{{% codenew file="service/networking/run-my-nginx.yaml" %}}

これにより、クラスター内のどのノードからでもアクセスできるようになります。
Podが実行されているノードを確認します:

```shell
kubectl apply -f ./run-my-nginx.yaml
kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
```

PodのIPを確認します:

```shell
kubectl get pods -l run=my-nginx -o yaml | grep podIP
    podIP: 10.244.3.4
    podIP: 10.244.2.5
```

クラスター内の任意のノードにSSH接続し、両方のIPにcurl接続できるはずです。
コンテナはノードでポート80を使用**していない**ことに注意してください。
また、Podにトラフィックをルーティングする特別なNATルールもありません。
つまり、同じcontainerPortを使用して同じノードで複数のnginx Podを実行し、IPを使用してクラスター内の他のPodやノードからそれらにアクセスできます。
Dockerと同様に、ポートは引き続きホストノードのインターフェースに公開できますが、ネットワークモデルにより、この必要性は根本的に減少します。

興味があれば、これを[どのように達成するか](/ja/docs/concepts/cluster-administration/networking/#how-to-achieve-this)について詳しく読むことができます。

## Serviceを作成する

そのため、フラットでクラスター全体のアドレス空間でnginxを実行するPodがあります。
理論的には、これらのPodと直接通信することができますが、ノードが停止するとどうなりますか？
Podはそれで死に、Deploymentは異なるIPを持つ新しいものを作成します。
これは、Serviceが解決する問題です。

Kubernetes Serviceは、クラスター内のどこかで実行されるPodの論理セットを定義する抽象化であり、すべて同じ機能を提供します。
作成されると、各Serviceには一意のIPアドレス(clusterIPとも呼ばれます)が割り当てられます。
このアドレスはServiceの有効期間に関連付けられており、Serviceが動作している間は変更されません。
Podは、Serviceと通信するように構成でき、Serviceへの通信は、ServiceのメンバーであるPodに自動的に負荷分散されることを認識できます。

2つのnginxレプリカのサービスを`kubectl expose`で作成できます:

```shell
kubectl expose deployment/my-nginx
```
```
service/my-nginx exposed
```

これは次のyamlを`kubectl apply -f`することと同等です:

{{% codenew file="service/networking/nginx-svc.yaml" %}}

この仕様は、`run：my-nginx`ラベルを持つ任意のPodのTCPポート80をターゲットとするサービスを作成し、抽象化されたサービスポートでPodを公開します(`targetPort`:はコンテナがトラフィックを受信するポート、`port`:は抽象化されたServiceのポートであり、他のPodがServiceへのアクセスに使用する任意のポートにすることができます)。
サービス定義でサポートされているフィールドのリストは[Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core) APIオブジェクトを参照してください。

Serviceを確認します:

```shell
kubectl get svc my-nginx
```
```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
```

前述のように、ServiceはPodのグループによってサポートされています。
これらのPodはエンドポイントを通じて公開されます。
Serviceのセレクターは継続的に評価され、結果は`my-nginx`という名前のEndpointsオブジェクトにPOSTされます。
Podが終了すると、エンドポイントから自動的に削除され、Serviceのセレクターに一致する新しいPodが自動的にエンドポイントに追加されます。
エンドポイントを確認し、IPが最初のステップで作成されたPodと同じであることを確認します:

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
kubectl get ep my-nginx
```
```
NAME       ENDPOINTS                     AGE
my-nginx   10.244.2.5:80,10.244.3.4:80   1m
```

クラスター内の任意のノードから、`<CLUSTER-IP>:<PORT>`でnginx Serviceにcurl接続できるようになりました。
Service IPは完全に仮想的なもので、ホスト側のネットワークには接続できないことに注意してください。
この仕組みに興味がある場合は、[サービスプロキシ](/ja/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)の詳細をお読みください。

## Serviceにアクセスする

Kubernetesは、環境変数とDNSの2つの主要なService検索モードをサポートしています。
前者はそのまま使用でき、後者は[CoreDNSクラスターアドオン](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/coredns)を必要とします。
{{< note >}}
サービス環境変数が望ましくない場合(予想されるプログラム変数と衝突する可能性がある、処理する変数が多すぎる、DNSのみを使用するなど)、[Pod仕様](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)で`enableServiceLinks`フラグを`false`に設定することでこのモードを無効にできます。
{{< /note >}}


### 環境変数

ノードでPodが実行されると、kubeletはアクティブな各サービスの環境変数のセットを追加します。
これにより、順序付けの問題が発生します。
理由を確認するには、実行中のnginx Podの環境を調べます(Pod名は環境によって異なります):

```shell
kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
```

サービスに言及がないことに注意してください。これは、サービスの前にレプリカを作成したためです。
これのもう1つの欠点は、スケジューラーが両方のPodを同じマシンに配置し、サービスが停止した場合にサービス全体がダウンする可能性があることです。
2つのPodを強制終了し、Deploymentがそれらを再作成するのを待つことで、これを正しい方法で実行できます。
今回は、サービスはレプリカの「前」に存在します。
これにより、スケジューラーレベルのサービスがPodに広がり(すべてのノードの容量が等しい場合)、適切な環境変数が提供されます:

```shell
kubectl scale deployment my-nginx --replicas=0; kubectl scale deployment my-nginx --replicas=2;

kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
```

Podは強制終了されて再作成されるため、異なる名前が付いていることに気付くでしょう。

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

Kubernetesは、DNS名を他のServiceに自動的に割り当てるDNSクラスターアドオンサービスを提供します。
クラスターで実行されているかどうかを確認できます:

```shell
kubectl get services kube-dns --namespace=kube-system
```
```
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

このセクションの残りの部分は、寿命の長いIP(my-nginx)を持つServiceと、そのIPに名前を割り当てたDNSサーバーがあることを前提にしています。ここではCoreDNSクラスターアドオン(アプリケーション名: `kube-dns`)を使用しているため、標準的なメソッド(`gethostbyname()`など) を使用してクラスター内の任意のPodからServiceに通信できます。CoreDNSが起動していない場合、[CoreDNS README](https://github.com/coredns/deployment/tree/master/kubernetes)または[Installing CoreDNS](/ja/docs/tasks/administer-cluster/coredns/#installing-coredns)を参照し、有効にする事ができます。curlアプリケーションを実行して、これをテストしてみましょう。

```shell
kubectl run curl --image=radial/busyboxplus:curl -i --tty --rm
```
```
Waiting for pod default/curl-131556218-9fnch to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

次に、Enterキーを押して`nslookup my-nginx`を実行します:

```shell
[ root@curl-131556218-9fnch:/ ]$ nslookup my-nginx
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      my-nginx
Address 1: 10.0.162.149
```

## Serviceを安全にする

これまでは、クラスター内からnginxサーバーにアクセスしただけでした。
サービスをインターネットに公開する前に、通信チャネルが安全であることを確認する必要があります。
これには、次のものが必要です:

* https用の自己署名証明書(既にID証明書を持っている場合を除く)
* 証明書を使用するように構成されたnginxサーバー
* Podが証明書にアクセスできるようにする[Secret](/ja/docs/concepts/configuration/secret/)

これらはすべて[nginx httpsの例](https://github.com/kubernetes/examples/tree/master/_archived/https-nginx/)から取得できます。
これにはツールをインストールする必要があります。
これらをインストールしたくない場合は、後で手動の手順に従ってください。つまり:

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
default-token-il9rc   kubernetes.io/service-account-token   1         1d
nginxsecret           kubernetes.io/tls                     2         1m
```
configmapも作成します:
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
以下は、(Windows上など)makeの実行で問題が発生した場合に実行する手動の手順です:

```shell
# 公開秘密鍵ペアを作成します
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
# キーをbase64エンコードに変換します
cat /d/tmp/nginx.crt | base64
cat /d/tmp/nginx.key | base64
```
前のコマンドの出力を使用して、次のようにyamlファイルを作成します。
base64でエンコードされた値はすべて1行である必要があります。

```yaml
apiVersion: "v1"
kind: "Secret"
metadata:
  name: "nginxsecret"
  namespace: "default"
  type: kubernetes.io/tls
data:
  # 注意: 以下の値はご自身で base64 エンコードした証明書と鍵に置き換えてください。
  nginx.crt: "REPLACE_WITH_BASE64_CERT"
  nginx.key: "REPLACE_WITH_BASE64_KEY"
```
ファイルを使用してSecretを作成します:

```shell
kubectl apply -f nginxsecrets.yaml
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
default-token-il9rc   kubernetes.io/service-account-token   1         1d
nginxsecret           kubernetes.io/tls                     2         1m
```

次に、nginxレプリカを変更して、シークレットの証明書とServiceを使用してhttpsサーバーを起動し、両方のポート(80と443)を公開します:

{{% codenew file="service/networking/nginx-secure-app.yaml" %}}

nginx-secure-appマニフェストに関する注目すべき点:

- 同じファイルにDeploymentとServiceの両方が含まれています。
- [nginxサーバー](https://github.com/kubernetes/examples/blob/master/_archived/https-nginx/default.conf)はポート80のHTTPトラフィックと443のHTTPSトラフィックを処理し、nginx Serviceは両方のポートを公開します。
- 各コンテナは`/etc/nginx/ssl`にマウントされたボリュームを介してキーにアクセスできます。
  これは、nginxサーバーが起動する*前に*セットアップされます。

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

最後の手順でcurlに`-k`パラメーターを指定したことに注意してください。
これは、証明書の生成時にnginxを実行しているPodについて何も知らないためです。
CNameの不一致を無視するようcurlに指示する必要があります。
Serviceを作成することにより、証明書で使用されるCNameを、Service検索中にPodで使用される実際のDNS名にリンクしました。
これをPodからテストしましょう(簡単にするために同じシークレットを再利用しています。PodはServiceにアクセスするためにnginx.crtのみを必要とします):

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

## Serviceを公開する

アプリケーションの一部では、Serviceを外部IPアドレスに公開したい場合があります。
Kubernetesは、NodePortとLoadBalancerの2つの方法をサポートしています。
前のセクションで作成したServiceはすでに`NodePort`を使用しているため、ノードにパブリックIPがあれば、nginx HTTPSレプリカはインターネット上のトラフィックを処理する準備ができています。

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

クラウドロードバランサーを使用するようにサービスを再作成しましょう。
`my-nginx`サービスの`Type`を`NodePort`から`LoadBalancer`に変更するだけです:

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

`EXTERNAL-IP`列のIPアドレスは、パブリックインターネットで利用可能なものです。
`CLUSTER-IP`は、クラスター/プライベートクラウドネットワーク内でのみ使用できます。

AWSでは、type `LoadBalancer`はIPではなく(長い)ホスト名を使用するELBが作成されます。
実際、標準の`kubectl get svc`の出力に収まるには長すぎるので、それを確認するには`kubectl describe service my-nginx`を実行する必要があります。
次のようなものが表示されます:

```shell
kubectl describe service my-nginx
...
LoadBalancer Ingress:   a320587ffd19711e5a37606cf4a74574-1142138393.us-east-1.elb.amazonaws.com
...
```



## {{% heading "whatsnext" %}}


* 詳細: [Serviceを利用したクラスター内のアプリケーションへのアクセス](/ja/docs/tasks/access-application-cluster/service-access-application-cluster/)
* 詳細: [Serviceを使用してフロントエンドをバックエンドに接続する](/ja/docs/tasks/access-application-cluster/connecting-frontend-backend/)
* 詳細: [Creating an External Load Balancer](/docs/tasks/access-application-cluster/create-external-load-balancer/)


