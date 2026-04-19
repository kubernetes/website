---
title: DNSサービスのカスタマイズ
content_type: task
weight: 160
---

<!-- overview -->
このページでは、{{< glossary_tooltip text="Pod" term_id="pod" >}}のDNSを設定し、クラスター内のDNS名前解決プロセスをカスタマイズする方法を説明します。
## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

クラスターではCoreDNSアドオンが実行されている必要があります。

{{% version-check %}}

<!-- steps -->

## 概要 {#introduction}

DNSは、_addon manager_ [クラスターアドオン](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/addon-manager/README.md)を使用して自動的に起動される、Kubernetesの組み込みサービスです。

{{< note >}}
CoreDNSのServiceは、`metadata.name`フィールドでは`kube-dns`という名前になっています。
これは、クラスター内部のアドレス解決において従来の`kube-dns`Service名に依存していたワークロードとの相互運用性を高めることを目的としています。
`kube-dns`という名前のServiceを使用することで、その背後でどのDNSプロバイダーが動作しているかという実装の詳細を抽象化できます。
{{< /note >}}

CoreDNSをDeploymentとして実行している場合、通常は固定IPアドレスを持つKubernetesのServiceとして公開されます。
kubeletは`--cluster-dns=<dns-service-ip>`フラグを使用して、各コンテナにDNSリゾルバーの情報を渡します。

DNS名にはドメインも必要です。ローカルドメインは、kubeletの`--cluster-domain=<default-local-domain>`フラグで設定します。

DNSサーバーは、前方参照(AレコードおよびAAAAレコード)、ポート参照(SRVレコード)、逆引きIPアドレス参照(PTRレコード)などをサポートしています。詳細については、
[サービスとポッドのDNS](/docs/concepts/services-networking/dns-pod-service/)を参照してください。

Podの`dnsPolicy`が`default`に設定されている場合、そのPodは実行されているノードの名前解決設定を継承します。
この場合、PodのDNS名前解決はノードと同じ動作になります。
ただし、[既知の問題](/docs/tasks/administer-cluster/dns-debugging-resolution/#known-issues)も参照してください。

これを望まない場合、またはPodごとに異なるDNS設定を行いたい場合は、kubeletの`--resolv-conf`フラグを使用できます。
このフラグを`""`に設定すると、PodがDNS設定を継承しないようにできます。
有効なファイルパスを指定すると、`/etc/resolv.conf`以外のファイルからDNS設定を継承できます。

## CoreDNS {#coredns}

CoreDNSは汎用的な権威DNSサーバーであり、クラスターDNSとして機能します。
また、[DNS仕様](https://github.com/kubernetes/dns/blob/master/docs/specification.md)に準拠しています。

### CoreDNSのConfigMapオプション {#coredns-configmap-options}

CoreDNSはモジュール型でプラグイン可能なDNSサーバーであり、プラグインによって機能を拡張できます。
CoreDNSサーバーは、設定ファイルである[Corefile](https://coredns.io/2017/07/23/corefile-explained/)を管理することで構成されます。

クラスター管理者は、CoreDNSのCorefileを含む{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}を変更することで、そのクラスターにおけるDNSサービスディスカバリーの挙動を変更できます。

Kubernetesでは、CoreDNSは以下のデフォルトCorefile設定でインストールされます。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health {
            lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
            pods insecure
            fallthrough in-addr.arpa ip6.arpa
            ttl 30
        }
        prometheus :9153
        forward . /etc/resolv.conf
        cache 30
        loop
        reload
        loadbalance
    }
```

このCorefile設定には、以下のCoreDNSの[プラグイン](https://coredns.io/plugins/)が含まれています。

* [errors](https://coredns.io/plugins/errors/): エラーをstdoutにログ出力します。
* [health](https://coredns.io/plugins/health/): CoreDNSのヘルス状態は`http://localhost:8080/health`で公開されます。この拡張構文では、`lameduck`を指定するとプロセスを一時的に不健全な状態にし、その後5秒待機してからプロセスを終了します。
* [ready](https://coredns.io/plugins/ready/): ポート8181でHTTPエンドポイントを提供し、準備完了を通知できるすべてのプラグインが準備完了状態になると、200 OKを返します。
* [kubernetes](https://coredns.io/plugins/kubernetes/): ServiceおよびPodのIPに基づいてDNSクエリに応答します。このプラグインの詳細は、CoreDNSのWebサイトを参照してください。  
  - `ttl`はレスポンスのTTLを設定するためのオプションです。デフォルトは5秒です。最小値は0秒、最大値は3600秒です。TTLを0に設定すると、レコードはキャッシュされません。  
  - `pods insecure`オプションは、`kube-dns`との後方互換性のために提供されています。  
  - `pods verified`オプションを使用すると、同一Namespace内に一致するIPを持つPodが存在する場合のみAレコードを返します。  
  - `pods disabled`オプションは、Podレコードを使用しない場合に利用できます。  
* [prometheus](https://coredns.io/plugins/metrics/): CoreDNSのメトリクスは、[Prometheus](https://prometheus.io/)形式(OpenMetricsとも呼ばれます)で`http://localhost:9153/metrics`から取得できます。
* [forward](https://coredns.io/plugins/forward/): Kubernetesクラスターのドメイン外のDNSクエリは、事前に定義されたリゾルバー(`/etc/resolv.conf`)に転送されます。
* [cache](https://coredns.io/plugins/cache/): フロントエンドキャッシュを有効にします。
* [loop](https://coredns.io/plugins/loop/): 単純な転送ループを検出し、ループが検出された場合はCoreDNSプロセスを停止します。
* [reload](https://coredns.io/plugins/reload): Corefileの変更を自動的に再読み込みします。ConfigMapを編集した後、変更が反映されるまで最大2分かかります。
* [loadbalance](https://coredns.io/plugins/loadbalance): A、AAAA、MXレコードの順序をランダム化するラウンドロビン方式のDNSロードバランサーです。

ConfigMapを編集することで、CoreDNSのデフォルトの挙動を変更できます。

### CoreDNSを用いたスタブドメインと上流ネームサーバーの設定 {#configuration-of-stub-domain-and-upstream-nameserver-using-coredns}

CoreDNSでは、[forwardプラグイン](https://coredns.io/plugins/forward/)を使用してスタブドメインおよび上流ネームサーバーを設定できます。

#### 例 {#example}

クラスター管理者が、`10.150.0.1`に存在するConsulのドメインサーバーを持ち、すべてのConsul名が`.consul.local`というサフィックスを持つとします。  
この場合、CoreDNSに設定するために、クラスター管理者はCoreDNSのConfigMapに以下の設定を追加します。

```
consul.local:53 {
    errors
    cache 30
    forward . 10.150.0.1
}
```

また、クラスター外のすべてのDNSクエリを特定のネームサーバー`172.16.0.1`に明示的に転送したい場合は、`/etc/resolv.conf`の代わりに`forward`でそのネームサーバーを指定します。

```
forward . 172.16.0.1
```

デフォルトのCorefile設定と組み合わせた最終的なConfigMapは、以下のようになります。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        errors
        health
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
        }
        prometheus :9153
        forward . 172.16.0.1
        cache 30
        loop
        reload
        loadbalance
    }
    consul.local:53 {
        errors
        cache 30
        forward . 10.150.0.1
    }
```

{{< note >}}
CoreDNSはスタブドメインおよびネームサーバーに対してFQDN(例: "ns.foo.com")をサポートしていません。
そのため、このようなFQDNを指定する設定は利用できません。
{{< /note >}}

## {{% heading "whatsnext" %}}

- [DNS名前解決のデバッグ](/docs/tasks/administer-cluster/dns-debugging-resolution/)を参照してください。
