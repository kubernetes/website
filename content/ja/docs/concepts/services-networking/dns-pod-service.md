---
title: ServiceとPodに対するDNS
content_type: concept
weight: 80
description: >-
  ワークロードは、DNSを用いてクラスター内のServiceを探索できます。本ページでは、その仕組みを解説します。
---
<!-- overview -->
KubernetesはServiceとPodのDNSレコードを作成します。
IPアドレスの代わりに安定したDNS名を用いて、Serviceに接続できます。

<!-- body -->

Kubernetesは、DNSの設定に用いられるPodとServiceの情報を公開します。
kubeletがPodのDNSを設定することで、実行中のコンテナがIPアドレスではなくDNS名でServiceの名前解決を行えます。

クラスター内で定義されたServiceにはDNS名が割り当てられます。
デフォルトでは、クライアントであるPodのDNS検索リストには、そのPod自身の名前空間とクラスターのデフォルトドメインが含まれています。

### サービスの名前空間 {#namespaces-of-services}

DNSクエリの結果は、クエリを発行したPodの名前空間によって異なる場合があります。
名前空間を指定しないDNSクエリは、Pod自身の名前空間に限定して解決されます。
他の名前空間にアクセスするには、DNSクエリ内で名前空間を指定する必要があります。
例えば、`test`という名前空間にPodが、`prod`という名前空間に`data`というServiceがそれぞれ存在しているとします。
Podから`data`というクエリを発行しても、DNS解決はPodの名前空間`test`に限定されるため、結果は返りません。
`data.prod`というクエリを発行すれば、Serviceの属する名前空間が指定されているため、Serviceを探索することができます。

DNSクエリはPodの`/etc/resolv.conf`に基づいて展開される場合があります。
kubeletは、それぞれのPodにこのファイルを設定します。
例えば、`data`というクエリは、`data.test.svc.cluster.local`に展開される場合があります。
クエリの展開には`search`オプションの値が用いられます。
DNSクエリの詳細については、[`resolv.conf` のマニュアル](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html)をご覧ください。

```
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

以上のように、_test_ という名前空間に存在するPodは、`data.prod`や`data.prod.svc.cluster.local`というクエリを正常に名前解決できます。

### DNSレコード {#dns-records}

DNSレコードが作成されるオブジェクトは、以下の2つです。

1. Service
1. Pod
以降のセクションでは、サポートされているDNSレコードの種類および構成について説明します。
その他の構成、名前、クエリは実装に依存し、予告なく変更される可能性があります。
最新の仕様については、[Kubernetes DNS-Based Service Discovery](https://github.com/kubernetes/dns/blob/master/docs/specification.md)をご覧ください。

## Service {#services}

### A/AAAAレコード {#a-aaaa-records}

"通常の"(Headlessでない)Serviceは、`my-svc.my-namespace.svc.cluster.local`という形式のDNS A(AAAA)レコードを、ServiceのIPバージョンに応じて割り当てられます。
割り当てられたAレコードは、ServiceのClusterIPへと名前解決されます。

ClusterIPのない[Headless Service](/docs/concepts/services-networking/service/#headless-service)にも`my-svc.my-namespace.svc.cluster.local`の形式のDNS A(AAAA)レコードが割り当てられます。
通常のServiceとは異なり、Serviceによって選択されたすべてのPodのIPアドレスに解決されます。
クライアントは、得られたIPアドレスの集合を扱うか、標準のラウンドロビン方式で集合からIPアドレスを選択します。

### SRVレコード {#srv-records}

SRVレコードは、通常のServiceもしくは[Headless
Services](/docs/concepts/services-networking/service/#headless-service)の一部である名前付きポート向けに作成されます。

それぞれの名前付きポートに対して、SRVレコードは`_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example`という形式です。
通常のServiceに対しては、このSRVレコードは`my-svc.my-namespace.svc.cluster-domain.example`という形式のドメイン名とポート番号へ名前解決します。
Headless Serviceに対しては、このSRVレコードは複数の結果を返します。
Serviceの背後にある各Podに対し1つずつレコードが返され、それぞれのレコードはPodのポート番号と`hostname.my-svc.my-namespace.svc.cluster-domain.example`という形式のドメイン名を含んでいます。

## Pod {#pods}

### A/AAAAレコード {#a-aaaa-records-1}

[DNSの仕様](https://github.com/kubernetes/dns/blob/master/docs/specification.md)が実装される前のバージョンのKube-DNSでは、以下のような名前解決が行われていました。

```
<pod-IPv4-address>.<namespace>.pod.<cluster-domain>
```

例えば、IPアドレスが172.17.0.3のPodが`default`という名前空間に存在しており、クラスターのドメイン名が`cluster.local`の場合、PodのDNS名は以下のとおりです。

```
172-17-0-3.default.pod.cluster.local
```

[CoreDNS](https://coredns.io/)などの一部のクラスター実装では、以下のような`A`レコードも提供されます。

```
<pod-ipv4-address>.<service-name>.<my-namespace>.svc.<cluster-domain.example>
```

例えば、IPアドレスが172.17.0.3のPodが`cafe`という名前空間に存在しており、Podが`barista`というServiceのエンドポイントで、クラスターのドメイン名が`cluster.local`の場合、Podは次のようなServiceスコープの`A`レコードを持ちます。

```
172-17-0-3.barista.cafe.svc.cluster.local
```

### Podのhostnameとsubdomainフィールド {#pod-hostname-and-subdomain-field}


現在、Podが作成されたとき、Pod内部から観測されるホスト名は、Podの`metadata.name`フィールドの値です。

Podのspecでは、オプションの`hostname`フィールドで別のホスト名を指定できます。
`hostname`を指定すると、Podの内部から観測されるホスト名として、Podの名前よりも優先されます。
例えば、`spec.hostname`フィールドが`my-host`に設定されたPodのホスト名は`my-host`です。

Podのspecはまた、オプションの`subdomain`フィールドで、Podの名前空間のサブグループを指定することができます。
例えば、`my-namespace`という名前空間において、`spec.hostname`が`foo`、`spec.subdomain`が`bar`にそれぞれ設定されているPodがあるとします。
このとき、Podのホスト名は`foo`で、Pod内部から観測される完全修飾ドメイン名(FQDN)は`foo.bar.my-namespace.svc.cluster.local`です。

Podと同じ名前空間内に、Podのサブドメインと同じ名前のHeadless Serviceが存在する場合、クラスターのDNSサーバーは、そのPodのFQDNに対するA(AAAA)レコードを返します。

例えば、以下の設定について考えてみましょう:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: busybox-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo # 単一ポートのServiceには、nameは必須ではありません
    port: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: busybox-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox2
  labels:
    name: busybox
spec:
  hostname: busybox-2
  subdomain: busybox-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

上記の設定のように、`busybox-subdomain`というServiceと、`spec.subdomain`に`busybox-subdomain`を指定したPodが存在するとします。
このとき、1つ目のPodは、自身のFQDNを`busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`と認識します。
DNSはそのPodのIPを指し示すA(AAAA)レコードを返します。
`busybox1`と`busybox2`の両方のPodはそれぞれ自身のA(AAAA)レコードを持ちます。

{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}では、IPアドレスとともに、任意のエンドポイントアドレスに対するDNSホスト名を指定できます。

{{< note >}}
Podに`hostname`が設定されていない場合、そのPod名に対するA(AAAA)レコードは作成されません。
`hostname`を持たずに`subdomain`のみを持つPodの場合、Headless Service(`busybox-subdomain.my-namespace.svc.cluster-domain.example`)に対し、PodのIPアドレスを指すA(AAAA)レコードのみが作成されます。
なお、Serviceに`publishNotReadyAddresses=True`が設定されている場合を除き、PodがDNSレコードに含まれるためには、Podの状態がReadyである必要があります。
{{< /note >}}

### PodのsetHostnameAsFQDNフィールド {#pod-sethostnameasfqdn-field}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

PodがFQDNを持つように構成されている場合、そのホスト名は短縮されたホスト名です。
例えば、FQDNが`busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`のPodがあるとします。
この場合、デフォルトではそのPod内で`hostname`コマンドを実行すると`busybox-1`が返され、`hostname --fqdn`コマンドを実行するとFQDNが返されます。

Podのspecで`setHostnameAsFQDN: true`を設定した場合、kubeletはPodのFQDNを、そのPodの名前空間におけるホスト名として書き込みます。
この場合、`hostname`と`hostname --fqdn`の両方がPodのFQDNを返します。

{{< note >}}
Linuxでは、カーネルのホスト名のフィールド(`struct utsname`の`nodename`フィールド)は64文字に制限されています。

Podがこの機能を有効にしていて、そのFQDNが64文字より長い場合、Podは起動に失敗します。
Podは`Pending`ステータス(`kubectl`では`ContainerCreating`と表示)のままになり、`Failed to construct FQDN from Pod hostname and cluster domain`や、`FQDN long-FQDN is too long (64 characters is the max, 70 characters requested)`などのエラーイベントが生成されます。

この場合のユーザー体験を向上させる1つの方法は、[admission webhook controller](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)を作成して、ユーザーがDeploymentなどのトップレベルのオブジェクトを作成するときにFQDNのサイズを制御することです。
{{< /note >}}


### PodのDNSポリシー {#pod-s-dns-policy}

DNSポリシーはPodごとに設定できます。
現在のKubernetesでは次のようなPod固有のDNSポリシーをサポートしています。
これらのポリシーはPodのspecの`dnsPolicy`フィールドで指定されます。

- `Default`: Podが実行されているノードから名前解決の設定を継承します。
  詳細に関しては、[関連する議論](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node)を参照してください。
- `ClusterFirst`: `www.kubernetes.io`のようなクラスターのドメインのサフィックスに一致しないDNSクエリは、DNSサーバーによって上流のネームサーバーに転送されます。
  クラスター管理者が追加のスタブドメインと上流のDNSサーバーを設定している場合があります。
  このような場合におけるDNSクエリ処理の詳細に関しては、[関連する議論](/docs/tasks/administer-cluster/dns-custom-nameservers/)を参照してください。
- `ClusterFirstWithHostNet`: hostNetworkによって稼働しているPodに対しては、明示的にDNSポリシーを`ClusterFirstWithHostNet`に設定してください。
  そうしない場合、hostNetworkによって稼働しているPodに`ClusterFirst`を指定すると、`Default`ポリシーの挙動にフォールバックします。

  {{< note >}}
  本ポリシーはWindowsではサポートされていません。
  詳細は[WindowsノードにおけるDNSの名前解決](#dns-windows)をご確認ください。
  {{< /note >}}

- `None`: Kubernetes環境からDNS設定を無視することができます。
  全てのDNS設定は、Podのspecの`dnsConfig`フィールドで指定する必要があります。
  詳細は、以下の[PodのDNS設定](#pod-dns-config)をご覧ください。

{{< note >}}
`Default`は、デフォルトのDNSポリシーではありません。
`dnsPolicy`が明示的に指定されていない場合、`ClusterFirst`が使用されます。
{{< /note >}}

下記の例では、`hostNetwork`フィールドが`true`のため`dnsPolicy`に`ClusterFirstWithHostNet`を指定したPodを示しています。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

### PodのDNS設定 {#pod-dns-config}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

PodのDNS設定では、Podに対するDNS設定をより細かく制御できます。

`dnsConfig`フィールドは任意で指定でき、どの`dnsPolicy`の設定でも併用できます。
ただし、Podの`dnsPolicy`が`None`の場合、`dnsConfig`フィールドの設定は必須です。

以下は、`dnsConfig`フィールドで指定可能なプロパティです。

- `nameservers`: PodのDNSサーバーとして使用されるIPアドレスのリストです。
  最大で3つのIPアドレスを指定できます。
  Podの`dnsPolicy`が`None`の場合、少なくとも1つのIPアドレスを指定する必要があります。
  それ以外の場合は、このプロパティは任意です。
  ここで指定したサーバーは、指定されたDNSポリシーから生成されるベースのネームサーバーと結合され、重複するアドレスは削除されます。
- `searches`: Pod内のホスト名の名前解決のためのDNS検索ドメインのリストです。
  このプロパティは任意です。
  このプロパティを指定した場合、このリストは、選択されたDNSポリシーから生成されるベースの検索ドメイン名にマージされます。
  重複するドメイン名は削除されます。最大で32個の検索ドメインを指定できます。
- `options`: `name`プロパティ(必須)と`value`プロパティ(任意)を持つオブジェクトのリストです。
  このプロパティの内容は、指定されたDNSポリシーから生成されるオプションにマージされます。
  重複するエントリは削除されます。

以下は、カスタムDNS設定を持つPodの例です。

{{% code_sample file="service/networking/custom-dns.yaml" %}}

上記のPodが作成されたとき、`test`コンテナの`/etc/resolv.conf`ファイルには以下の内容が設定されます。

```
nameserver 192.0.2.1
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

IPv6の設定では、検索パスとネームサーバーは次のように設定されます。

```
nameserver 2001:db8:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

{{< note >}}
Pod内の`/etc/resolv.conf`の設定は、以下のコマンドで確認できます。

```shell
# Pod名がdns-exampleの場合
kubectl exec -it dns-example -- cat /etc/resolv.conf
```
{{< /note >}}

## DNS検索ドメインリストの制限 {#dns-search-domain-list-limits}

{{< feature-state for_k8s_version="1.28" state="stable" >}}

Kubernetes自体は、DNS検索リストの要素数が32を超えたり、DNS検索ドメイン名の文字数の合計2048を超えたりしない限り、DNS設定に制限を設けません。
この制限は、ノードのリゾルバ設定ファイル、PodのDNS設定、およびそれらがマージされたDNS設定に適用されます。

{{< note >}}
古いバージョンの一部のコンテナランタイムでは、DNS検索リストの要素数に制限がある場合があります。
コンテナランタイムによっては、DNS検索ドメインの要素数が多い場合、Podの状態がPendingのままとなることがあります。

この問題は、containerd v1.5.5以前、およびCRI-O v1.21以前で発生することが確認されています。
{{< /note >}}

## WindowsノードにおけるDNSの名前解決 {#dns-windows}

Windowsノード上で実行されるPodでは、DNSポリシーの`ClusterFirstWithHostNet`はサポートされていません。
Windowsでは、`.`を含む名前をFQDNとして扱い、FQDN解決はスキップされます。

Windowsにおいては、複数のDNSリゾルバを利用できます。それぞれのリゾルバの挙動がわずかに異なるため、[`Resolve-DNSName`](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname) PowerShellコマンドレットを使用することが推奨されます。

Linuxには完全修飾名としての名前解決が失敗した後に使用されるDNSサフィックスリストがあります。
一方で、WindowsにはDNSサフィックスを1つしか指定できず、それはPodの名前空間に対応するDNSサフィックスです(例: `mydns.svc.cluster.local`)。
Windowsでは、この単一のサフィックスを用いてFQDNやService、ネットワーク名の名前解決を行えます。
例えば、`default`という名前空間で起動されたPodは、DNSサフィックスとして`default.svc.cluster.local`が設定されます。
このPodでは、`kubernetes.default.svc.cluster.local`や`kubernetes`は名前解決できますが、部分的に修飾された名前(`kubernetes.default`や`kubernetes.default.svc`)は名前解決できません。

## {{% heading "whatsnext" %}}

DNS設定の管理方法に関しては、[DNS Serviceの設定](/docs/tasks/administer-cluster/dns-custom-nameservers/)を確認してください。
を確認してください。
