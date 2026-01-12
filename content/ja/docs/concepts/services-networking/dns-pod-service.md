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

## イントロダクション

Kubernetesは、DNSの設定に用いられるPodとServiceの情報を公開します。
kubeletがPodのDNSを設定することで、実行中のコンテナがIPアドレスではなくDNS名でServiceの名前解決を行えるようになります。

クラスター内で定義されたServiceにはDNS名が割り当てられます。デフォルトでは、クライアントであるPodのDNS検索リストには、そのPod自身の名前空間とクラスターのデフォルトドメインが含まれています。

### サービスの名前空間

DNSクエリの結果は、クエリを発行したPodの名前空間によって異なる場合があります。
名前空間を指定しないDNSクエリは、Pod自身の名前空間に限定して解決されます。
他の名前空間にアクセスするには、名前空間を指定する必要があります。

例えば、`test`という名前空間にPodが、`prod`という名前空間に`data`というServiceがそれぞれ存在しているとします。
Podから"`data`"というクエリを発行しても、DNS解決はPodの名前空間`test`に限定されるため、結果は返りません。
"`data.prod`"というクエリを発行すれば、Serviceの属する名前空間が指定されているため、Serviceを探索することができます。

DNSクエリはPodの`/etc/resolv.conf`に基づいて展開される場合があります。
kubeletは、それぞれのPodにこのファイルを設定します。
例えば、"`data`"というクエリは、`data.test.svc.cluster.local`に展開される場合があります。
クエリの展開には`search`オプションの値が用いられます。
DNSクエリの詳細については、[`resolv.conf` のマニュアル](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html)をご覧ください。

```
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

以上のように、`test`という名前空間に存在するPodは、"`data.prod`"や"`data.prod.svc.cluster.local`"というクエリを正常に名前解決できます。

### DNSレコード

DNSレコードが作成されるオブジェクトは、ServiceおよびPodです。
以降のセクションでは、サポートされているDNSレコードの種類および構成について説明します。
その他の構成、名前、クエリは実装に依存するものであり、予告なく変更される可能性があります。
最新の仕様については、[Kubernetes DNS-Based Service Discovery](https://github.com/kubernetes/dns/blob/master/docs/specification.md)をご覧ください。

## Service {#services}

### A/AAAAレコード

"通常の"(Headlessでない)Serviceは、`my-svc.my-namespace.svc.cluster.local`という形式のDNS A(AAAA)レコードを、ServiceのIPバージョンに応じて割り当てられます。このAレコードはそのServiceのClusterIPへと名前解決されます。

ClusterIPのない[Headless Service](/docs/concepts/services-networking/service/#headless-services)にも`my-svc.my-namespace.svc.cluster.local`の形式のDNS A(AAAA)レコードが割り当てられます。通常のServiceとは異なり、Serviceによって選択されたすべてのPodのIPアドレスに解決されます。クライアントは、得られたIPアドレスの集合を扱うか、標準のラウンドロビン方式で集合からIPアドレスを選択します。

### SRVレコード

SRVレコードは、通常のServiceもしくは[Headless
Services](/ja/docs/concepts/services-networking/service/#headless-service)の一部である名前付きポート向けに作成されます。

それぞれの名前付きポートに対して、そのSRVレコードは`_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example`という形式となります。
通常のServiceに対しては、このSRVレコードは`my-svc.my-namespace.svc.cluster-domain.example`という形式のドメイン名とポート番号へ名前解決します。
Headless Serviceに対しては、このSRVレコードは複数の結果を返します。Serviceの背後にある各Podに対し1つずつレコードが返され、それぞれのレコードはPodのポート番号と`hostname.my-svc.my-namespace.svc.cluster-domain.example`という形式のドメイン名を含んでいます。

## Pod

### A/AAAAレコード

[DNSの仕様](https://github.com/kubernetes/dns/blob/master/docs/specification.md)が実装される前のバージョンのKube-DNSでは、以下のような名前解決が行われていました。

```
<pod-IPv4-address>.<namespace>.pod.<cluster-domain>
```

例えば、IPアドレスが172.17.0.3のPodが`default`という名前空間に存在しており、クラスターのドメイン名が`cluster.local`の場合、PodのDNS名は以下のとおりです。

```
172-17-0-3.default.pod.cluster.local
```

[CoreDNS](https://coredns.io/)などの一部のクラスター実装では、以下のようなAレコードも提供されます。

```
<pod-ipv4-address>.<service-name>.<my-namespace>.svc.<cluster-domain.example>
```

例えば、IPアドレスが172.17.0.3のPodが`cafe`という名前空間に存在しており、Podが`barista`というServiceのエンドポイントで、クラスターのドメイン名が`cluster.local`の場合、Podは次のようなServiceスコープのAレコードを持つことがあります。

```
172-17-0-3.barista.cafe.svc.cluster.local
```

### Podのhostnameとsubdomainフィールド

現在、Podが作成されたとき、そのPodのホスト名はPodの`metadata.name`フィールドの値となります。

Pod Specは、オプションである`hostname`フィールドを持ち、Podのホスト名を指定するために使うことができます。`hostname`が指定されたとき、`hostname`はそのPodの名前よりも優先されます。例えば、`hostname`フィールドが"`my-host`"にセットされたPodを考えると、Podはそのhostnameが"`my-host`"に設定されます。

Pod Specはまた、オプションである`subdomain`フィールドも持ち、Podのサブドメイン名を指定するために使うことができます。例えば、"`my-namespace`"というネームスペース内で`hostname`が`foo`とセットされていて、`subdomain`が`bar`とセットされているPodの場合、そのPodは"`foo.bar.my-namespace.svc.cluster.local`"という名前の完全修飾ドメイン名(FQDN)を持つことになります。

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
  - name: foo # 実際は、portは必要ありません。
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

"`busybox-1`"というホスト名で、"`busybox-subdomain`"というサブドメインを持ったPodと、そのPodと同じネームスペース内にある"`busybox-subdomain`"という名前のHeadless Serviceがあると考えると、そのPodは自身の完全修飾ドメイン名(FQDN)を"`busybox-1.busybox-subdomain.my-namespace.svc.cluster.local`"として扱います。DNSはそのPodのIPを指し示すA(AAAA)レコードを返します。"`busybox1`"と"`busybox2`"の両方のPodはそれぞれ独立したA(AAAA)レコードを持ちます。

そのエンドポイントオブジェクトはそのIPに加えて`hostname`を任意のエンドポイントアドレスに対して指定できます。

{{< note >}}
Podに`hostname`が設定されていない場合、そのPod名に対するA(AAAA)レコードは作成されません。`hostname`を持たずに`subdomain`のみを持つPodの場合、Headless Service(`busybox-subdomain.my-namespace.svc.cluster-domain.example`)に対し、PodのIPアドレスを指すA(AAAA)レコードのみが作成されます。なお、Serviceに`publishNotReadyAddresses=True`が設定されている場合を除き、PodがDNSレコードに含まれるためには、Podの状態がReadyである必要があります。
{{< /note >}}

### PodのsetHostnameAsFQDNフィールド

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

<!-- ここPRで確認？ -->
**前提条件**: {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}に対して`SetHostnameAsFQDN`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にする必要があります。

Podが完全修飾ドメイン名(FQDN)を持つように構成されている場合、そのホスト名は短いホスト名です。
例えば、FQDNが`busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`のPodがある場合、
デフォルトではそのPod内の`hostname`コマンドは`busybox-1`を返し、`hostname --fqdn`コマンドはFQDNを返します。

Podのspecで`setHostnameAsFQDN: true`を設定した場合、そのPodの名前空間に対してkubeletはPodのFQDNをホスト名に書き込みます。
この場合、`hostname`と`hostname --fqdn`の両方がPodのFQDNを返します。

{{< note >}}
Linuxでは、カーネルのホスト名のフィールド(`struct utsname`の`nodename`フィールド)は64文字に制限されています。

Podがこの機能を有効にしていて、そのFQDNが64文字より長い場合、Podは起動に失敗します。
Podは`Pending`ステータス(`kubectl`でみられる`ContainerCreating`)のままになり、「Podのホスト名とクラスタードメインからFQDNを作成できなかった」や、「FQDN`long-FQDN`が長すぎる(64文字が最大, 70文字が要求された)」などのエラーイベントが生成されます。

このシナリオのユーザー体験を向上させる1つの方法は、[admission webhook controller](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)を作成して、ユーザーがDeploymentなどのトップレベルのオブジェクトを作成するときにFQDNのサイズを制御することです。
{{< /note >}}


### PodのDNSポリシー

DNSポリシーはPod毎に設定できます。現在のKubernetesでは次のようなPod固有のDNSポリシーをサポートしています。これらのポリシーはPod Specの`dnsPolicy`フィールドで指定されます。

- "`Default`": そのPodはPodが稼働しているNodeから名前解決の設定を継承します。詳細に関しては、[関連する議論](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node)を参照してください。
- "`ClusterFirst`": "`www.kubernetes.io`"のようなクラスタードメインのサフィックスにマッチしないようなDNSクエリーは、Nodeから継承された上流のネームサーバーにフォワーディングされます。クラスター管理者は、追加のstubドメインと上流のDNSサーバーを設定できます。このような場合におけるDNSクエリー処理の詳細に関しては、[関連する議論](/docs/tasks/administer-cluster/dns-custom-nameservers/#effects-on-pods)を参照してください。
- "`ClusterFirstWithHostNet`": hostNetworkによって稼働しているPodに対しては、ユーザーは明示的にDNSポリシーを"`ClusterFirstWithHostNet`"を指定するべきです。hostNetworkによって稼働しているPodに"`ClusterFirst`"を指定すると、"`Default`"と同じ動作となります。
  {{< note >}}
  本ポリシーはWindowsではサポートされていません。詳細は[DNS resolution on Windows nodes](#dns-windows)をご確認ください。
  {{< /note >}}

- "`None`": この設定では、Kubernetesの環境からDNS設定を無視することができます。全てのDNS設定は、Pod Spec内の`dnsConfig`フィールドを指定して提供することになっています。下記のセクションの[Pod's DNS config](#pod-dns-config)を参照ください。

{{< note >}}
"`Default`"は、デフォルトのDNSポリシーではありません。もし`dnsPolicy`が明示的に指定されていない場合、"`ClusterFirst`"が使用されます。
{{< /note >}}

下記の例では、`hostNetwork`フィールドが`true`であるため、`dnsPolicy`に"`ClusterFirstWithHostNet`"を指定しています。

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

PodのDNS設定は、ユーザーがPodに対してそのDNS設定上でさらに制御するための手段を提供します。

`dnsConfig`フィールドはオプションで、どのような設定の`dnsPolicy`でも共に機能することができます。しかし、Podの`dnsPolicy`が"`None`"にセットされていたとき、`dnsConfig`フィールドは必ず指定されなくてはなりません。

下記の項目は、ユーザーが`dnsConfig`フィールドに指定可能なプロパティーとなります。

- `nameservers`: そのPodに対するDNSサーバーとして使われるIPアドレスのリストです。これは最大で3つのIPアドレスを指定することができます。Podの`dnsPolicy`が"`None`"に指定されていたとき、そのリストは最低1つのIPアドレスを指定しなければならず、`dnsPolicy`の値が"`None`"以外の場合は、このプロパティーは任意となります。
- `searches`: Pod内のホスト名の名前解決のためのDNS検索ドメインのリストです。このプロパティーは任意です。このプロパティーが指定されていたとき、このリストは選択されたDNSポリシーから生成されたサーチドメイン名のベースとなるリストにマージされます。重複されているドメイン名は削除されます。最大で32個のサーチドメインの設定が可能です。
- `options`: `name`プロパティー(必須)と`value`プロパティー(オプション)を持つような各オプジェクトのリストで、これはオプションです。このプロパティー内の内容は指定されたDNSポリシーから生成されたオプションにマージされます。重複されたエントリーは削除されます。

下記のファイルはカスタムDNS設定を持ったPodの例です。

{{% codenew file="service/networking/custom-dns.yaml" %}}

上記のPodが作成されたとき、`test`コンテナは、コンテナ内の`/etc/resolv.conf`ファイル内にある下記の内容を取得します。

```
nameserver 192.0.2.1
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

IPv6用のセットアップのためには、サーチパスとネームサーバーは次のように設定されるべきです。

```
nameserver 2001:db8:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

{{< note >}}
Pod内の`/etc/resolv.conf`の設定は以下のコマンドで確認できます。

```shell
# Pod名がdns-exampleの場合
kubectl exec -it dns-example -- cat /etc/resolv.conf
```
{{< /note >}}

## DNS検索ドメインリストの制限

{{< feature-state for_k8s_version="1.28" state="stable" >}}

Kubernetes自体は、DNS検索リストの要素数が32を超えたり、DNS検索ドメイン名の文字数の合計2048を超えたりしない限り、DNS設定に制限を設けません。
この制限は、ノードのリゾルバ設定ファイル、PodのDNS設定、およびそれらがマージされたDNS設定に適用されます。

{{< note >}}
古いバージョンの一部のコンテナランタイムでは、DNS検索リストの要素数に制限のある場合があります。
コンテナランタイムによっては、DNS検索ドメインの要素数が多い場合、Podの状態がPendingのままとなることがあります。

この問題は、containerd v1.5.5以前、およびCRI-O v1.21以前で発生することが確認されています。
{{< /note >}}

## WindowsノードにおけるDNSの名前解決 {#dns-windows}

Windowsノード上で実行されるPodでは、DNSポリシーの`ClusterFirstWithHostNet`はサポートされていません。
Windowsでは、`.`を含む名前をFQDNとして扱い、DNSサフィックスによる補完は行われません。

Windowsにおいては、複数のDNSリゾルバを利用できます。それぞれのリゾルバの挙動がわずかに異なるため、[`Resolve-DNSName`](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname) PowerShellコマンドレットを使用することが推奨されます。

Linuxには完全修飾名としての名前解決が失敗した後に使用されるDNSサフィックスリストがあります。
一方で、WindowsにはDNSサフィックスを1つしか指定できず、それはPodの名前空間に対応するDNSサフィックスとなります（例: `mydns.svc.cluster.local`）。
Windowsでは、この単一のサフィックスを用いてFQDNやService、ネットワーク名の名前解決を行えます。
例えば、`default`という名前空間で起動されたPodは、DNSサフィックスとして`default.svc.cluster.local`が設定されます。
このPodでは、`kubernetes.default.svc.cluster.local`や`kubernetes`は名前解決できますが、部分的に修飾された名前（`kubernetes.default`や`kubernetes.default.svc`）は名前解決できません。

## {{% heading "whatsnext" %}}

DNS設定の管理方法に関しては、[DNS Serviceの設定](/docs/tasks/administer-cluster/dns-custom-nameservers/)
を確認してください。




