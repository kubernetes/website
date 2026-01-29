---
title: DNS解決のデバッグ
content_type: task
min-kubernetes-server-version: v1.6
weight: 170
---

<!-- overview -->
このページでは、DNSの問題を診断するためのヒントを提供します。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}  
クラスターは、CoreDNS{{< glossary_tooltip text="アドオン" term_id="addons" >}}またはその前身であるkube-dnsを使用するように設定されている必要があります。

{{% version-check %}}

<!-- steps -->

### テスト環境として使用するシンプルなPodを作成する {#create-a-simple-pod-to-use-as-a-test-environment}

{{% code_sample file="admin/dns/dnsutils.yaml" %}}

{{< note >}}
この例では、`default`名前空間内にPodを作成します。
Serviceに対するDNS名前解決は、Podの名前空間に依存します。
詳細については、[ServiceとPodに対するDNS](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names)を参照してください。
{{< /note >}}

このマニフェストを使用してPodを作成します:

```shell
kubectl apply -f https://k8s.io/examples/admin/dns/dnsutils.yaml
```
```
pod/dnsutils created
```
そして、ステータスを確認します:
```shell
kubectl get pods dnsutils
```
```
NAME       READY     STATUS    RESTARTS   AGE
dnsutils   1/1       Running   0          <some-time>
```

このPodが実行されたら、その環境で`nslookup`を実行できます。
以下のような結果が表示された場合、DNSは正常に動作しています。

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```
```
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      kubernetes.default
Address 1: 10.0.0.1
```

`nslookup`コマンドが失敗した場合は、以下を確認してください:

### まずは、ローカルのDNS設定を確認する {#check-the-local-dns-configuration-first}

resolv.confファイルの内容を確認します。
(詳細については、[DNSサービスのカスタマイズ](/docs/tasks/administer-cluster/dns-custom-nameservers)および下記の[既知の問題](#known-issues)を参照してください)

```shell
kubectl exec -ti dnsutils -- cat /etc/resolv.conf
```

検索パスとネームサーバーが以下のように設定されていることを確認します。
(検索パスはクラウドプロバイダーによって異なる場合があることに注意してください):

```
search default.svc.cluster.local svc.cluster.local cluster.local google.internal c.gce_project_id.internal
nameserver 10.0.0.10
options ndots:5
```

以下のようなエラーは、CoreDNS(またはkube-dns)アドオンまたは関連するServiceに問題があることを示しています:

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```
```
Server:    10.0.0.10
Address 1: 10.0.0.10

nslookup: can't resolve 'kubernetes.default'
```

または、

```shell
kubectl exec -i -t dnsutils -- nslookup kubernetes.default
```
```
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

nslookup: can't resolve 'kubernetes.default'
```

### DNSのPodが実行されているか確認する {#check-if-the-dns-pod-is-running}

`kubectl get pods`コマンドを使用して、DNSのPodが実行されていることを確認します。

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
ラベル`k8s-app`の値は、CoreDNSとkube-dnsの両方のデプロイメントで`kube-dns`です。
{{< /note >}}

CoreDNSのPodが実行されていない、またはPodが失敗/完了している場合、現在の環境ではDNSアドオンがデフォルトでデプロイされていない可能性があり、手動でデプロイする必要があります。

### DNSのPodのエラーを確認する {#check-for-errors-in-the-dns-pod}

`kubectl logs`コマンドを使用して、DNSコンテナのログを確認します。

CoreDNSの場合:
```shell
kubectl logs --namespace=kube-system -l k8s-app=kube-dns
```

以下は正常なCoreDNSログの例です:
```
.:53
2018/08/15 14:37:17 [INFO] CoreDNS-1.2.2
2018/08/15 14:37:17 [INFO] linux/amd64, go1.10.3, 2e322f6
CoreDNS-1.2.2
linux/amd64, go1.10.3, 2e322f6
2018/08/15 14:37:17 [INFO] plugin/reload: Running configuration MD5 = 24e6c59e83ce706f07bcc82c31b1ea1c
```

ログに疑わしいメッセージや予期しないメッセージがないか確認してください。

### DNSサービスは起動しているか {#is-dns-service-up}

`kubectl get service`コマンドを使用して、DNSサービスが起動していることを確認します。

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
サービス名は、CoreDNSとkube-dnsの両方のデプロイメントで`kube-dns`です。
{{< /note >}}



Serviceを作成した場合、またはデフォルトで作成されるはずなのに表示されない場合、詳細については、[Serviceのデバッグ](/docs/tasks/debug/debug-application/debug-service/)を参照してください。

### DNSエンドポイントは公開されているか {#are-dns-endpoints-exposed}

`kubectl get endpointslice`コマンドを使用して、DNSエンドポイントが公開されていることを確認できます。

```shell
kubectl get endpointslice -l k8s.io/service-name=kube-dns --namespace=kube-system
```
```
NAME             ADDRESSTYPE   PORTS   ENDPOINTS                  AGE
kube-dns-zxoja   IPv4          53      10.180.3.17,10.180.3.17    1h
```

エンドポイントが表示されない場合は、[Serviceのデバッグ](/docs/tasks/debug/debug-application/debug-service/)ドキュメントのエンドポイントセクションを参照してください。

### DNSクエリは受信/処理されているか {#are-dns-queries-being-received-processed}

CoreDNS設定(別名: Corefile)に`log`プラグインを追加することで、クエリが受信されているかどうかを確認できます。
CoreDNSのCorefileは、`coredns`という名前の{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}に保持されています。
編集するには、次のコマンドを使用します:

```
kubectl -n kube-system edit configmap coredns
```

次に、以下の例に従ってCorefileセクションに`log`を追加します:

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

変更を保存した後、Kubernetesがこれらの変更をCoreDNSのPodに伝播するまでに最大1〜2分かかる場合があります。

次に、いくつかのクエリを実行し、このドキュメントの上記のセクションに従ってログを確認します。
CoreDNSのPodがクエリを受信している場合、ログにそれらが表示されるはずです。

以下はログ内のクエリの例です:

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

### CoreDNSに十分な権限があるか {#does-coredns-have-sufficient-permissions}

CoreDNSは、サービス名を適切に解決するために、{{< glossary_tooltip text="Service" term_id="service" >}}および{{< glossary_tooltip text="EndpointSlice" term_id="endpoint-slice" >}}関連のリソースをリストできる必要があります。

エラーメッセージの例:
```
2022-03-18T07:12:15.699431183Z [INFO] 10.96.144.227:52299 - 3686 "A IN serverproxy.contoso.net.cluster.local. udp 52 false 512" SERVFAIL qr,aa,rd 145 0.000091221s
```

まず、`system:coredns`の現在のClusterRoleを取得します:

```shell
kubectl describe clusterrole system:coredns -n kube-system
```

期待される出力:
```
PolicyRule:
  Resources                        Non-Resource URLs  Resource Names  Verbs
  ---------                        -----------------  --------------  -----
  endpoints                        []                 []              [list watch]
  namespaces                       []                 []              [list watch]
  pods                             []                 []              [list watch]
  services                         []                 []              [list watch]
  endpointslices.discovery.k8s.io  []                 []              [list watch]
```

権限が不足している場合は、ClusterRoleを編集して追加します:

```shell
kubectl edit clusterrole system:coredns -n kube-system
```

EndpointSlices権限の追加例:
```
...
- apiGroups:
  - discovery.k8s.io
  resources:
  - endpointslices
  verbs:
  - list
  - watch
...
```

### 正しい名前空間のServiceを指定しているか {#are-you-in-the-right-namespace-for-the-service}

名前空間を指定しないDNSクエリは、Podの名前空間に制限されます。

Podの名前空間とServiceの名前空間が異なる場合、DNSクエリにはServiceの名前空間を含める必要があります。

このクエリはPodの名前空間に制限されます:
```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>
```

このクエリは名前空間を指定します:
```shell
kubectl exec -i -t dnsutils -- nslookup <service-name>.<namespace>
```

名前解決の詳細については、[ServiceとPodに対するDNS](/docs/concepts/services-networking/dns-pod-service/#what-things-get-dns-names)を参照してください。

## 既知の問題 {#known-issues}

一部のLinuxディストリビューション(Ubuntuなど)は、デフォルトでローカルDNSリゾルバー(systemd-resolved)を使用します。
systemd-resolvedは`/etc/resolv.conf`を移動してスタブファイルに置き換えるため、アップストリームサーバーで名前を解決する際に致命的な転送ループが発生する可能性があります。
これは、kubeletの`--resolv-conf`フラグを使用して正しい`resolv.conf`を指定することで手動で修正できます(`systemd-resolved`の場合、これは`/run/systemd/resolve/resolv.conf`です)。
kubeadmは`systemd-resolved`を自動的に検出し、それに応じてkubeletフラグを調整します。

Kubernetesのインストールでは、ノードの`resolv.conf`ファイルをクラスターDNSを使用するように設定しません。
このプロセスは本質的にディストリビューション固有であるためです。
これは最終的には実装される必要があるでしょう。

LinuxのlibC(別名: glibc)には、DNSの`nameserver`レコードに対してデフォルトで3つという制限があり、Kubernetesは1つの`nameserver`レコードを消費する必要があります。
つまり、ローカルインストールがすでに3つの`nameserver`を使用している場合、それらのエントリの一部が失われます。
この制限を回避するには、ノードで`dnsmasq`を実行することで、より多くの`nameserver`エントリを提供できます。
kubeletの`--resolv-conf`フラグを使用することもできます。

ベースイメージとして、バージョン3.17以前のAlpineを使用している場合、Alpineの設計上の問題によりDNSが正しく動作しない可能性があります。
muslバージョン1.24まで、DNSスタブリゾルバーへのTCPフォールバックが含まれていなかったため、512バイトを超えるDNS呼び出しは失敗していました。
バージョン3.18以降のAlpineイメージにアップグレードしてください。

## {{% heading "whatsnext" %}}

- [クラスター内のDNSサービスのオートスケール](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)を参照してください。
- [ServiceとPodに対するDNS](/docs/concepts/services-networking/dns-pod-service/)を読んでください。
