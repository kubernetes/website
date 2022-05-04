---
title:  DNS名前解決のデバッグ
content_type: task
min-kubernetes-server-version: v1.6
---

<!-- overview -->
このページでは、DNSの問題を診断するためのヒントを提供します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}  
クラスターは、CoreDNS {{< glossary_tooltip text="addon" term_id="addons" >}}またはその前身であるkube-dnsを使用するように構成する必要があります。

{{% version-check %}}

<!-- steps -->

### テスト環境として使用するシンプルなPodを作成する {#create-a-simple-pod-to-use-as-a-test-environment}

{{< codenew file="admin/dns/dnsutils.yaml" >}}

{{< note >}}
この例では、`default`名前空間(Namespace)にPodを作成します。
ServiceのDNS名前解決は、Podの名前空間によって異なります。
詳細については、[ServiceとPodに対するDNS](/ja/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names)を参照してください。
{{< /note >}}

前述のマニフェストを使用してPodを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/dns/dnsutils.yaml
```
```
pod/dnsutils created
```

Pod作成のステータスを確認します:

```shell
kubectl get pods dnsutils
```
```
NAME      READY     STATUS    RESTARTS   AGE
dnsutils   1/1       Running   0          <some-time>
```

Podが実行状態に移ると、その環境で`nslookup`を実行できます。
次のような出力が表示される場合は、DNSが正しく動作しています。

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```
```
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

`nslookup`コマンドが失敗した場合は、次の点を確認します:

### 最初にローカルDNS構成を確認する {#check-the-local-dns-configuration-first}

`resolv.conf`ファイルの内部を確認します。
(詳細については、[Customizing DNS Service](/docs/tasks/administer-cluster/dns-custom-nameservers)および以下の[既知の問題](#known-issues)を参照してください)

```shell
kubectl exec -ti dnsutils -- cat /etc/resolv.conf
```

検索パスとネームサーバーが次のように設定されていることを確認します(検索パスはクラウドプロバイダーによって異なる場合があります):

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

次のようなエラーは、CoreDNS(またはkube-dns)アドオンまたは関連するServiceに問題があることを示しています:

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```
```
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

または

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```
```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

### DNS podが実行されているかどうかを確認する {#check-if-the-dns-pod-is-running}

`kubectl get pods`コマンドを使用して、DNS Podが実行されていることを確認します。

```shell
kubectl get pods --namespace=kube-system -l k8s-app=kube-dns
```
```
NAME                       READY     STATUS    RESTARTS   AGE
...
coredns-7b96bf9f76-5hsxb   1/1       Running   0           1h
coredns-7b96bf9f76-mvmmt   1/1       Running   0           1h
...
```

{{< note >}}
CoreDNSとkube-dnsのどちらのDeploymentでもラベル`k8s-app`の値は`kube-dns`です。
{{< /note >}}


CoreDNS Podが実行されていない場合、またはPodが失敗/完了したことがわかった場合、DNSアドオンは既定で現在の環境に展開されていない可能性があり、手動で展開する必要があります。

### DNS podのエラーを確認する {#check-for-errors-in-the-dns-pod}

`kubectl logs`コマンドを使用して、DNSコンテナのログを表示します。

CoreDNSの場合:
```shell
kubectl logs --namespace=kube-system -l k8s-app=kube-dns
```

正常なCoreDNSログの例を次に示します:

```
.:53
2018/08/15 14:37:17 [INFO] CoreDNS-1.2.2
2018/08/15 14:37:17 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.2
linux/amd64, go1.10.3, 2e322f6
2018/08/15 14:37:17 [INFO] plugin/reload: Running configuration MD5 = 24e6c59e83ce706f07bcc82c31b1ea1c
```

ログに疑わしいメッセージや予期しないメッセージがないかどうかを確認します。

### DNS Serviceが稼働しているかを確認する {#is-dns-service-up?}

`kubectl get service`コマンドを使用して、DNS Serviceが稼働していることを確認します。

```shell
kubectl get svc --namespace=kube-system
```
```
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)             AGE
...
kube-dns     ClusterIP   10.0.0.10      <none>        53/UDP,53/TCP        1h
...
```

{{< note >}}
CoreDNSとkube-dnsのどちらのDeploymentでもServiceの名前は`kube-dns`です。
{{< /note >}}



Serviceを作成した場合、またはデフォルトで作成する必要があるのに表示されない場合は、[debugging Services](/docs/tasks/debug/debug-application/debug-service/)を参照してください。

### DNSエンドポイントが公開されているか確認する {#are-dns-endpoints-exposed?}

DNS エンドポイントが公開されていることを確認するには、`kubectl get endpoints`コマンドを使用します。

```shell
kubectl get endpoints kube-dns --namespace=kube-system
```
```
NAME       ENDPOINTS                       AGE
kube-dns   10.180.3.17:53,10.180.3.17:53    1h
```

エンドポイントが表示されない場合は、[debugging Services](/docs/tasks/debug/debug-application/debug-service/)ドキュメントのエンドポイントセクションを参照してください。

その他のKubernetes DNSの例については、Kubernetes GitHubリポジトリの[cluster-dns example](https://github.com/kubernetes/examples/tree/master/staging/cluster-dns)を参照してください。

### DNSクエリは受信/処理されているか確認する {#are-dns-queries-being-received/processed?}

クエリがCoreDNSによって受信されているかどうかを確認するには、CoreDNS構成(別名 Corefile)に`log`プラグインを追加します。
CoreDNS Corefileは`coredns`という名前の{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}に保持されています。
編集するには、次のコマンドを使用します:

```
kubectl -n kube-system edit configmap coredns
```

次に、以下の例ごとにCorefileセクションに`log`を追加します:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        log
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
          pods insecure
          upstream
          fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

変更を保存した後、Kubernetesがこれらの変更をCoreDNS Podに伝達するまでに最大1から2分かかる場合があります。

次に、いくつかのクエリを実行し、このドキュメントの上記のセクションごとにログを表示します。
CoreDNS Podがクエリを受信している場合は、ログにそれらが表示されます。

ログ内のクエリの例を次に示します:

```
.:53
2018/08/15 14:37:15 [INFO] CoreDNS-1.2.0
2018/08/15 14:37:15 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.0
linux/amd64, go1.10.3, 2e322f6
2018/09/07 15:29:04 [INFO] plugin/reload: Running configuration MD5 = 162475cdf272d8aa601e6fe67a6ad42f
2018/09/07 15:29:04 [INFO] Reloading complete
172.17.0.18:41675 - [07/Sep/2018:15:29:11 +0000] 59925 "A IN kubernetes.default.svc.cluster.local. udp 54 false 512" NOERROR qr,aa,rd,ra 106 0.000066649s
```

### Serviceに適した名前空間にいるかを確認する {#are-you-in-the-right-namespace-for-the-service?}

名前空間を指定しないDNSクエリは、Podの名前空間に制限されます。

PodとServiceの名前空間が異なる場合、DNSクエリにはServiceの名前空間を含める必要があります。

このクエリは、Podの名前空間に限定されます:
```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>
```

このクエリは名前空間を指定します:
```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>.<namespace>
```

名前解決の詳細については、[ServiceとPodに対するDNS](/ja/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names)を参照してください。

## 既知の問題 {#known-issues}

一部のLinuxディストリビューション(Ubuntuなど)は、既定でローカルDNSリゾルバ(`systemd-resolved`)を使用します。
`systemd-resolved`は、`/etc/resolv.conf`をスタブファイルで移動して置き換え、アップストリームサーバで名前を解決するときに致命的な転送ループを引き起こす可能性があります。
これは、kubeletの`--resolv-conf`フラグを使って正しい`resolv.conf`を指定することで手動で修正できます。(`systemd-resolve`では、これは`/run/systemd/resolve/resolv.conf`です)
kubeadmは自動的に`systemd-resolved`を検出し、それに応じてkubelet`フラグを調整します。

Kubernetesのインストールでは、そのプロセスが本質的にディストリビューション固有であるために、ノードの`resolv.conf`ファイルが既定でクラスターDNSを使用するように構成されません。
これは、おそらく最終的に実装されるべきでしょう。

Linuxのlibc(別名glibc)では、既定でDNSの`nameserver`レコードの数が3までという制限があります。
さらに、glibc-2.17-222より古いバージョンのglibc([the new versions update see this issue](https://access.redhat.com/solutions/58028))の場合、DNSの`search`レコードの許容数は6に制限されています。([see this bug from 2005](https://bugzilla.redhat.com/show_bug.cgi?id=168253))
Kubernetesは1つの`nameserver`レコードと3つの`search`レコードを使用する必要があります。
つまり、glibcのバージョンが影響を受けるバージョンである場合に、ローカルインストールですでに3つの`nameserver`が使われていたり、 3つ以上の`search`を使ったりすると、 これらの設定の一部は失われます。
DNSの`nameserver`レコードの制限を回避するために、`dnsmasq`を実行し、より多くの`nameserver`エントリを提供することができます。
また、kubeletの`--resolv-conf`フラグを使うこともできます。
DNSの`search`レコード制限を修正するには、Linuxディストリビューションをアップグレードするか、影響を受けないバージョンのglibcにアップグレードすることを検討してください。

{{< note >}}

[Expanded DNS Configuration](/ja/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration)を使用すると、Kubernetesはより多くのDNSの`search`レコードを許可します。

{{< /note >}}

ベースイメージとしてAlpineバージョン3.3以前を使用している場合、Alpineの既知の問題が原因でDNSが正しく動作しないことがあります。
より詳細についてはKubernetes [issue 30215](https://github.com/kubernetes/kubernetes/issues/30215)を参照してください。

## {{% heading "whatsnext" %}}

- [Autoscaling the DNS Service in a Cluster](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)を参照してください。
- [ServiceとPodに対するDNS](/ja/docs/concepts/services-networking/dns-pod-service/)を参照してください。
