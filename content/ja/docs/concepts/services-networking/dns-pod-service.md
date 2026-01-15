---
title: ServiceとPodに対するDNS
content_type: concept
weight: 80
description: >-
  ワークロードはDNSを使用してクラスター内のServiceを検出できます。
  このページでは、その仕組みについて説明します。
---
<!-- overview -->

KubernetesはServiceとPodに対するDNSレコードを作成します。IPアドレスの代わりに一貫したDNS名でServiceに接続できます。

<!-- body -->

KubernetesはPodとServiceに関する情報を公開し、それがDNSのプログラミングに使用されます。kubeletはPodのDNSを設定するため、実行中のコンテナはIPではなく名前でServiceを検索できます。

クラスター内で定義されたServiceにはDNS名が割り当てられます。デフォルトでは、クライアントPodのDNS検索リストには、Pod自身のネームスペースとクラスターのデフォルトドメインが含まれます。

### Serviceのネームスペース {#namespaces-of-services}

DNSクエリーは、それを行うPodのネームスペースに応じて異なる結果を返す場合があります。ネームスペースを指定しないDNSクエリーは、Podのネームスペースに限定されます。他のネームスペースのServiceにアクセスするには、DNSクエリーでそれを指定します。

例えば、`test`ネームスペースにPodがあるとします。`data` Serviceは`prod`ネームスペースにあります。

`data`へのクエリーは、Podの`test`ネームスペースを使用するため、結果を返しません。

`data.prod`へのクエリーは、ネームスペースを指定しているため、意図した結果を返します。

DNSクエリーは、Podの`/etc/resolv.conf`を使用して展開される場合があります。kubeletはこのファイルを各Podに対して設定します。例えば、`data`だけのクエリーは`data.test.svc.cluster.local`に展開される可能性があります。`search`オプションの値はクエリーを展開するために使用されます。DNSクエリーの詳細については、[`resolv.conf`のmanページ](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html)を参照してください。

```
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

まとめると、_test_ネームスペースのPodは`data.prod`または`data.prod.svc.cluster.local`のどちらでも正常に名前解決できます。

### DNSレコード {#dns-records}

どのオブジェクトがDNSレコードを取得するのでしょうか?

1. Service
1. Pod

以下のセクションでは、サポートされているDNSレコードタイプとレイアウトについて詳しく説明します。うまく機能する他のレイアウト、名前、またはクエリーは、実装の詳細と見なされ、警告なしに変更される可能性があります。最新の仕様については、[KubernetesにおけるDNSベースのServiceディスカバリ](https://github.com/kubernetes/dns/blob/master/docs/specification.md)を参照してください。

## Service {#services}

### A/AAAAレコード {#a-aaaa-records}

「通常の」(Headlessでない)Serviceは、ServiceのIPファミリーに応じて、`my-svc.my-namespace.svc.cluster-domain.example`という形式の名前でDNS AおよびAAAAレコードが割り当てられます。これはServiceのクラスターIPに名前解決されます。

[Headless Service](/docs/concepts/services-networking/service/#headless-services)(クラスターIPなし)もまた、`my-svc.my-namespace.svc.cluster-domain.example`という形式の名前でDNS AおよびAAAAレコードが割り当てられます。通常のServiceとは異なり、これはServiceによって選択されたすべてのPodのIP一覧に名前解決されます。クライアントはこの一覧を使用するか、その一覧から標準のラウンドロビン選択を使用することが期待されます。

### SRVレコード {#srv-records}

SRVレコードは、通常のServiceまたはHeadless Serviceの一部である名前付きポート向けに作成されます。

- 各名前付きポートに対して、SRVレコードは`_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example`という形式になります。
- 通常のServiceの場合、これはポート番号とドメイン名`my-svc.my-namespace.svc.cluster-domain.example`に名前解決されます。
- Headless Serviceの場合、これはServiceを支える各Podに対して1つずつ、複数の回答に名前解決されます。それにはポート番号と`hostname.my-svc.my-namespace.svc.cluster-domain.example`形式のPodのドメイン名が含まれます。

## Pod {#pods}

### A/AAAAレコード {#a-aaaa-records-1}

[DNS仕様](https://github.com/kubernetes/dns/blob/master/docs/specification.md)の実装前のKube-DNSバージョンでは、以下のDNS名前解決がありました:

```
<pod-IPv4-address>.<namespace>.pod.<cluster-domain>
```

例えば、`default`ネームスペースのPodのIPアドレスが172.17.0.3で、クラスターのドメイン名が`cluster.local`の場合、PodのDNS名は以下になります:

```
172-17-0-3.default.pod.cluster.local
```

[CoreDNS](https://coredns.io/)のような一部のクラスターDNSメカニズムは、以下に対する`A`レコードも提供します:

```
<pod-ipv4-address>.<service-name>.<my-namespace>.svc.<cluster-domain.example>
```

例えば、`cafe`ネームスペースのPodのIPアドレスが172.17.0.3で、`barista`という名前のServiceのエンドポイントであり、クラスターのドメイン名が`cluster.local`の場合、PodはこのService固有のDNS `A`レコードを持ちます。

```
172-17-0-3.barista.cafe.svc.cluster.local
```

### Podのhostnameとsubdomainフィールド {#pod-hostname-and-subdomain-field}

現在、Podが作成されると、そのホスト名(Pod内から観測される)はPodの`metadata.name`の値になります。

Pod specにはオプションの`hostname`フィールドがあり、Podのホスト名を指定するために使用できます。指定された場合、Podのホスト名としてPodの名前よりも優先されます(繰り返しますが、Pod内から観測される場合)。例えば、`spec.hostname`が`"my-host"`に設定されたPodの場合、Podのホスト名は`"my-host"`に設定されます。

Pod specにはオプションの`subdomain`フィールドもあり、Podがネームスペースのサブグループの一部であることを示すために使用できます。例えば、`"my-namespace"`ネームスペースで`spec.hostname`が`"foo"`に設定され、`spec.subdomain`が`"bar"`に設定されたPodは、ホスト名が`"foo"`に設定され、完全修飾ドメイン名(FQDN)が`"foo.bar.my-namespace.svc.cluster.local"`に設定されます(繰り返しますが、Pod内から観測される場合)。

サブドメインと同じ名前のHeadless Serviceが同じネームスペースに存在する場合、クラスターのDNSサーバーもPodの完全修飾ホスト名に対するAおよびAAAAレコードを返します。

例:

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
  - name: foo # 単一ポートのServiceでは名前は必須ではありません
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

上記のService `"busybox-subdomain"`と`spec.subdomain`を`"busybox-subdomain"`に設定したPodがある場合、最初のPodは自身のFQDNを`"busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example"`として認識します。DNSはその名前に対して、PodのIPを指すAおよびAAAAレコードを提供します。`"busybox1"`と`"busybox2"`の両方のPodは、それぞれ独自のアドレスレコードを持ちます。

{{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}は、任意のエンドポイントアドレスに対して、そのIPとともにDNSホスト名を指定できます。

{{< note >}}
`hostname`がないPodにはA/AAAAレコードが作成されないため、Podの名前に対してA/AAAAレコードは作成されません。`hostname`はないが`subdomain`はあるPodは、PodのIPアドレスを指すHeadless Service(`busybox-subdomain.my-namespace.svc.cluster-domain.example`)に対するAまたはAAAAレコードのみを作成します。また、Serviceに`publishNotReadyAddresses=True`が設定されていない限り、Podはレコードを持つために準備完了状態である必要があります。
{{< /note >}}

### PodのsetHostnameAsFQDNフィールド {#pod-sethostnameasfqdn-field}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

Podが完全修飾ドメイン名(FQDN)を持つように設定されている場合、そのホスト名は短いホスト名です。例えば、完全修飾ドメイン名が`busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`のPodがある場合、デフォルトではそのPod内の`hostname`コマンドは`busybox-1`を返し、`hostname --fqdn`コマンドはFQDNを返します。

Pod specで`setHostnameAsFQDN: true`を設定すると、kubeletはそのPodのネームスペースのホスト名にPodのFQDNを書き込みます。この場合、`hostname`と`hostname --fqdn`の両方がPodのFQDNを返します。

{{< note >}}
Linuxでは、カーネルのホスト名フィールド(`struct utsname`の`nodename`フィールド)は64文字に制限されています。

Podがこの機能を有効にしていて、そのFQDNが64文字より長い場合、Podの起動に失敗します。Podは`Pending`ステータス(`kubectl`で見ると`ContainerCreating`)のままになり、「Podのホスト名とクラスタードメインからFQDNを作成できなかった、FQDNの`long-FQDN`が長すぎる(64文字が最大、70文字が要求された)」などのエラーイベントが生成されます。このシナリオのユーザー体験を向上させる1つの方法は、ユーザーがDeploymentなどのトップレベルオブジェクトを作成するときにFQDNサイズを制御する[Admission Webhookコントローラー](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)を作成することです。
{{< /note >}}

### PodのDNSポリシー {#pod-s-dns-policy}

DNSポリシーはPod単位で設定できます。現在、Kubernetesは以下のPod固有のDNSポリシーをサポートしています。これらのポリシーはPod Specの`dnsPolicy`フィールドで指定されます。

- "`Default`": PodはPodが実行されているノードから名前解決設定を継承します。詳細については、[関連するドキュメント](/docs/tasks/administer-cluster/dns-custom-nameservers)を参照してください。
- "`ClusterFirst`": "`www.kubernetes.io`"のような設定されたクラスタードメインサフィックスに一致しないDNSクエリーは、DNSサーバーによって上流のネームサーバーに転送されます。クラスター管理者は、追加のスタブドメインと上流のDNSサーバーを設定している場合があります。これらの場合のDNSクエリーの処理方法の詳細については、[関連するドキュメント](/docs/tasks/administer-cluster/dns-custom-nameservers)を参照してください。
- "`ClusterFirstWithHostNet`": hostNetworkで実行されているPodの場合、DNSポリシーを明示的に"`ClusterFirstWithHostNet`"に設定する必要があります。そうしないと、hostNetworkと`"ClusterFirst"`で実行されているPodは`"Default"`ポリシーの動作にフォールバックします。

  {{< note >}}
  これはWindowsではサポートされていません。詳細については[下記](#dns-windows)を参照してください。
  {{< /note >}}

- "`None`": Podにkubernetes環境からのDNS設定を無視させます。すべてのDNS設定は、Pod Specの`dnsConfig`フィールドを使用して提供する必要があります。以下の[PodのDNS設定](#pod-dns-config)サブセクションを参照してください。

{{< note >}}
「Default」はデフォルトのDNSポリシーではありません。`dnsPolicy`が明示的に指定されていない場合、「ClusterFirst」が使用されます。
{{< /note >}}

以下の例は、`hostNetwork`が`true`に設定されているため、DNSポリシーが"`ClusterFirstWithHostNet`"に設定されたPodを示しています。

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

PodのDNS設定により、ユーザーはPodのDNS設定をより細かく制御できます。

`dnsConfig`フィールドはオプションであり、任意の`dnsPolicy`設定と組み合わせて使用できます。ただし、Podの`dnsPolicy`が"`None`"に設定されている場合、`dnsConfig`フィールドを指定する必要があります。

以下は、ユーザーが`dnsConfig`フィールドで指定できるプロパティーです:

- `nameservers`: PodのDNSサーバーとして使用されるIPアドレスのリスト。最大3つのIPアドレスを指定できます。Podの`dnsPolicy`が"`None`"に設定されている場合、リストには少なくとも1つのIPアドレスが含まれている必要があります。それ以外の場合、このプロパティーはオプションです。リストされたサーバーは、指定されたDNSポリシーから生成された基本ネームサーバーと重複するアドレスが削除された状態でマージされます。
- `searches`: Pod内のホスト名ルックアップ用のDNS検索ドメインのリスト。このプロパティーはオプションです。指定した場合、提供されたリストは選択したDNSポリシーから生成された基本検索ドメイン名にマージされます。重複するドメイン名は削除されます。Kubernetesは最大32の検索ドメインを許可します。
- `options`: 各オブジェクトが`name`プロパティー(必須)と`value`プロパティー(オプション)を持つオブジェクトのオプションリスト。このプロパティーの内容は、指定されたDNSポリシーから生成されたオプションにマージされます。重複するエントリーは削除されます。

以下はカスタムDNS設定を持つPodの例です:

{{% code_sample file="service/networking/custom-dns.yaml" %}}

上記のPodが作成されると、コンテナ`test`は`/etc/resolv.conf`ファイルに以下の内容を取得します:

```
nameserver 192.0.2.1
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

IPv6セットアップの場合、検索パスとネームサーバーは次のように設定する必要があります:

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```

出力は次のようになります:

```
nameserver 2001:db8:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

## DNS検索ドメインリストの制限 {#dns-search-domain-list-limits}

{{< feature-state for_k8s_version="1.28" state="stable" >}}

Kubernetes自体は、検索ドメインリストの長さが32を超えるか、すべての検索ドメインの合計長が2048を超えるまで、DNS設定を制限しません。この制限は、ノードのリゾルバー設定ファイル、PodのDNS設定、およびマージされたDNS設定にそれぞれ適用されます。

{{< note >}}
以前のバージョンの一部のコンテナランタイムには、DNS検索ドメインの数に独自の制限がある場合があります。コンテナランタイム環境によっては、多数のDNS検索ドメインを持つPodがPending状態のままになる可能性があります。

containerd v1.5.5以前およびCRI-O v1.21以前にこの問題があることが知られています。
{{< /note >}}

## WindowsノードでのDNS名前解決 {#dns-windows}

- `ClusterFirstWithHostNet`はWindowsノードで実行されるPodではサポートされていません。Windowsは`.`を持つすべての名前をFQDNとして扱い、FQDN名前解決をスキップします。
- Windowsでは、使用できる複数のDNSリゾルバーがあります。これらにはわずかに異なる動作があるため、名前クエリーの名前解決には[`Resolve-DNSName`](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname) PowerShellコマンドレットを使用することをお勧めします。
- Linuxでは、完全修飾として名前の名前解決が失敗した後に使用されるDNSサフィックスリストがあります。Windowsでは、そのPodのネームスペースに関連付けられたDNSサフィックス(例: `mydns.svc.cluster.local`)という1つのDNSサフィックスのみを持つことができます。WindowsはこのサフィックスでFQDN、Service、またはネットワーク名を名前解決できます。例えば、`default`ネームスペースで生成されたPodには、DNSサフィックス`default.svc.cluster.local`があります。Windows Pod内では、`kubernetes.default.svc.cluster.local`と`kubernetes`の両方を名前解決できますが、部分修飾名(`kubernetes.default`または`kubernetes.default.svc`)は名前解決できません。

## {{% heading "whatsnext" %}}

DNS設定の管理に関するガイダンスについては、[DNS Serviceの設定](/docs/tasks/administer-cluster/dns-custom-nameservers/)を確認してください。
