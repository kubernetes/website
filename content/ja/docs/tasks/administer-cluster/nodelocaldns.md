---
reviewers:
title: KubernetesクラスターでNodeLocal DNSキャッシュを使用する
content_type: task
weight: 390
---
 
<!-- overview -->
{{< feature-state for_k8s_version="v1.18" state="stable" >}}
このページでは、KubernetesのNodeLocal DNSキャッシュの機能の概要について説明します。



## {{% heading "prerequisites" %}}


 {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


 <!-- steps -->

## イントロダクション

NodeLocal DNSキャッシュは、クラスターノード上でDNSキャッシュエージェントをDaemonSetで稼働させることで、クラスターのDNSパフォーマンスを向上させます。現在のアーキテクチャにおいて、ClusterFirstのDNSモードでのPodは、DNSクエリー用にkube-dnsのService IPに疎通します。これにより、kube-proxyによって追加されたiptablesを介してkube-dns/CoreDNSのエンドポイントへ変換されます。この新しいアーキテクチャによって、Podは同じノード上で稼働するDNSキャッシュエージェントに対して疎通し、それによってiptablesのDNATルールとコネクショントラッキングを回避します。ローカルのキャッシュエージェントはクラスターのホスト名(デフォルトではcluster.localというサフィックス)に対するキャッシュミスがあるときはkube-dnsサービスへ問い合わせます。


## 動機

* 現在のDNSアーキテクチャでは、ローカルのkube-dns/CoreDNSがないとき、DNSへの秒間クエリー数が最も高いPodは他のノードへ疎通する可能性があります。ローカルでキャッシュを持つことにより、この状況におけるレイテンシーの改善に役立ちます。

* iptables DNATとコネクショントラッキングをスキップすることは[conntrackの競合](https://github.com/kubernetes/kubernetes/issues/56903)を減らし、UDPでのDNSエントリーがconntrackテーブルを満杯にすることを避けるのに役立ちます。

* ローカルのキャッシュエージェントからkube-dnsサービスへの接続がTCPにアップグレードされます。タイムアウトをしなくてはならないUDPエントリーと比べ、TCPのconntrackエントリーはコネクションクローズ時に削除されます([デフォルトの](https://www.kernel.org/doc/Documentation/networking/nf_conntrack-sysctl.txt) `nf_conntrack_udp_timeout` は30秒です)。

* DNSクエリーをUDPからTCPにアップグレードすることで、UDPパケットの欠損や、通常30秒(10秒のタイムアウトで3回再試行する)であるDNSのタイムアウトによるテイルレイテンシーを減少させます。NodeLocalキャッシュはUDPのDNSクエリーを待ち受けるため、アプリケーションを変更する必要はありません。

* DNSクエリーに対するノードレベルのメトリクスと可視性を得られます。

* DNSの不在応答のキャッシュも再度有効にされ、それによりkube-dnsサービスに対するクエリー数を減らします。

## アーキテクチャ図

この図はNodeLocal DNSキャッシュが有効にされた後にDNSクエリーがあったときの流れとなります。


{{< figure src="/images/docs/nodelocaldns.svg" alt="NodeLocal DNSCache flow" title="Nodelocal DNSCacheのフロー" caption="この図は、NodeLocal DNSキャッシュがDNSクエリーをどう扱うかを表したものです。" >}}

## 設定
{{< note >}} NodeLocal DNSキャッシュのローカルリッスン用のIPアドレスは、クラスター内の既存のIPと衝突しないことが保証できるものであれば、どのようなアドレスでもかまいません。例えば、IPv4のリンクローカル範囲169.254.0.0/16やIPv6のユニークローカルアドレス範囲fd00::/8から、ローカルスコープのアドレスを使用することが推奨されています。
{{< /note >}}

この機能は、下記の手順により有効化できます。

* [`nodelocaldns.yaml`](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/dns/nodelocaldns/nodelocaldns.yaml)と同様のマニフェストを用意し、`nodelocaldns.yaml`という名前で保存してください。
* マニフェスト内の変数を正しい値に置き換えてください。

     * kubedns=`kubectl get svc kube-dns -n kube-system -o jsonpath={.spec.clusterIP}`

     * domain=`<cluster-domain>`

     * localdns=`<node-local-address>`

     `<cluster-domain>`はデフォルトで"cluster.local"です。`<node-local-address>` はNodeLocal DNSキャッシュ用に確保されたローカルの待ち受けIPアドレスです。

   * kube-proxyがIPTABLESモードで稼働中のとき:

     ``` bash
     sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__/$kubedns/g" nodelocaldns.yaml
     ```

     `__PILLAR__CLUSTER__DNS__`と`__PILLAR__UPSTREAM__SERVERS__`はnode-local-dnsというPodによって生成されます。
     このモードでは、node-local-dns Podは`<node-local-address>`とkube-dnsのサービスIPの両方で待ち受けるため、PodはIPアドレスでもDNSレコードのルップアップができます。

  * kube-proxyがIPVSモードで稼働中のとき:

    ``` bash
     sed -i "s/__PILLAR__LOCAL__DNS__/$localdns/g; s/__PILLAR__DNS__DOMAIN__/$domain/g; s/__PILLAR__DNS__SERVER__//g; s/__PILLAR__CLUSTER__DNS__/$kubedns/g" nodelocaldns.yaml
    ```
     このモードでは、node-local-dns Podは`<node-local-address>`上のみで待ち受けます。node-local-dnsのインターフェースはkube-dnsのクラスターIPをバインドしません。なぜならばIPVSロードバランシング用に使われているインターフェースは既にこのアドレスを使用しているためです。
     `__PILLAR__UPSTREAM__SERVERS__` はnode-local-dns Podにより生成されます。

* `kubectl create -f nodelocaldns.yaml`を実行してください。
* kube-proxyをIPVSモードで使用しているとき、NodeLocal DNSキャッシュが待ち受けている`<node-local-address>`を使用するため、kubeletに対する`--cluster-dns`フラグを修正する必要があります。IPVSモード以外のとき、`--cluster-dns`フラグの値を修正する必要はありません。なぜならNodeLocal DNSキャッシュはkube-dnsのサービスIPと`<node-local-address>`の両方で待ち受けているためです。

一度有効にすると、クラスターの各Node上で、kube-systemという名前空間でnode-local-dns Podが、稼働します。このPodは[CoreDNS](https://github.com/coredns/coredns)をキャッシュモードで稼働させるため、異なるプラグインによって公開された全てのCoreDNSのメトリクスがNode単位で利用可能となります。

`kubectl delete -f <manifest>`を実行してDaemonSetを削除することによって、この機能を無効にできます。また、kubeletの設定に対して行った全ての変更をリバートすべきです。
 
