---
reviewers:
title: ServiceとPodに対するDNS
content_template: templates/concept
weight: 20
---
{{% capture overview %}}
このページではKubernetesによるDNSサポートについて概観します。
{{% /capture %}}

{{% capture body %}}

## イントロダクション

KubernetesのDNSはクラスター上でDNS PodとServiceをスケジュールし、DNSの名前解決をするために各コンテナに対してDNS ServiceのIPを使うようにKubeletを設定します。

### 何がDNS名を取得するか

クラスター内(DNSサーバーそれ自体も含む)で定義された全てのServiceはDNS名を割り当てられます。デフォルトでは、クライアントPodのDNSサーチリストはPod自身のネームスペースと、クラスターのデフォルトドメインを含みます。  
下記の例でこの仕組みを説明します。

Kubernetesの`bar`というネームスペース内で`foo`という名前のServiceがあると仮定します。`bar`ネームスペース内で稼働しているPodは、`foo`に対してDNSクエリを実行するだけでこのServiceを探すことができます。`bar`とは別の`quux`ネームスペース内で稼働しているPodは、`foo.bar`に対してDNSクエリを実行するだけでこのServiceを探すことができます。

下記のセクションでは、サポートされているレコードタイプとレイアウトについて詳しくまとめています。
うまく機能する他のレイアウト、名前、またはクエリーは、実装の詳細を考慮し、警告なしに変更されることがあります。  
最新の仕様に関する詳細は、[KubernetesにおけるDNSベースのServiceディスカバリ](https://github.com/kubernetes/dns/blob/master/docs/specification.md)を参照ください。

## Service

### Aレコード

"通常の"(Headlessでない)Serviceは、`my-svc.my-namespace.svc.cluster.local`という形式のDNS Aレコードを割り当てられます。このAレコードはそのServiceのClusterIPへと名前解決されます。

"Headless"(ClusterIPなしの)Serviceもまた`my-svc.my-namespace.svc.cluster.local`という形式のDNS Aレコードを割り当てられます。通常のServiceとは異なり、このAレコードはServiceによって選択されたPodのIPの一覧へと名前解決されます。クライアントはこの一覧のIPを使うか、その一覧から標準のラウンドロビン方式によって選択されたIPを使います…

### SRVレコード

SRVレコードは、通常のServiceもしくは[Headless
Services](/ja/docs/concepts/services-networking/service/#headless-service)の一部である名前付きポート向けに作成されます。それぞれの名前付きポートに対して、そのSRVレコードは`_my-port-name._my-port-protocol.my-svc.my-namespace.svc.cluster.local`という形式となります。  
通常のServiceに対しては、このSRVレコードは`my-svc.my-namespace.svc.cluster.local`という形式のドメイン名とポート番号へ名前解決します。  
Headless Serviceに対しては、このSRVレコードは複数の結果を返します。それはServiceの背後にある各Podの1つを返すのと、`auto-generated-name.my-svc.my-namespace.svc.cluster.local`という形式のPodのドメイン名とポート番号を含んだ結果を返します。

## Pod

### Aレコード

DNSが有効なとき、Podは"`pod-ip-address.my-namespace.pod.cluster.local`"という形式のAレコードを割り当てられます。

例えば、`default`ネームスペース内で`cluster.local`というDNS名を持ち、`1.2.3.4`というIPを持ったPodは次の形式のエントリーを持ちます。: `1-2-3-4.default.pod.cluster.local`。

### Podのhostnameとsubdomainフィールド

現在、Podが作成されたとき、そのPodのホスト名はPodの`metadata.name`フィールドの値となります。

Pod Specは、オプションである`hostname`フィールドを持ち、Podのホスト名を指定するために使うことができます。`hostname`が指定されたとき、`hostname`はそのPodの名前よりも優先されます。例えば、`hostname`フィールドが"`my-host`"にセットされたPodを考えると、Podはそのhostnameが"`my-host`"に設定されます。

Pod Specはまた、オプションである`subdomain`フィールドも持ち、Podのサブドメイン名を指定するために使うことができます。例えば、"`my-namespace`"というネームスペース内で`hostname`が`foo`とセットされていて、`subdomain`が`bar`とセットされているPodの場合、そのPodは"`foo.bar.my-namespace.svc.cluster.local`"という名前の完全修飾ドメイン名(FQDN)を持つことになります。

例:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: default-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo # 実際は、portは必要ありません。
    port: 1234
    targetPort: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: default-subdomain
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
  subdomain: default-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

もしそのPodと同じネームスペース内で、同じサブドメインを持ったHeadless Serviceが存在していた場合、クラスターのKubeDNSサーバーもまた、そのPodの完全修飾ドメイン名(FQDN)に対するAレコードを返します。
例えば、"`busybox-1`"というホスト名で、"`default-subdomain`"というサブドメインを持ったPodと、そのPodと同じネームスペース内にある"`default-subdomain`"という名前のHeadless Serviceがあると考えると、そのPodは自身の完全修飾ドメイン名(FQDN)を"`busybox-1.default-subdomain.my-namespace.svc.cluster.local`"として扱います。DNSはそのPodのIPを指し示すAレコードを返します。"`busybox1`"と"`busybox2`"の両方のPodはそれぞれ独立したAレコードを持ちます。

そのエンドポイントオブジェクトはそのIPに加えて`hostname`を任意のエンドポイントアドレスに対して指定できます。

{{< note >}}
AレコードはPodの名前に対して作成されないため、`hostname`はPodのAレコードが作成されるために必須となります。`hostname`を持たないが`subdomain`を持つようなPodは、そのPodのIPアドレスを指し示すHeadless Service(`default-subdomain.my-namespace.svc.cluster.local`)に対するAレコードのみ作成します。
{{< /note >}}

### PodのDNSポリシー

DNSポリシーはPod毎に設定できます。現在のKubernetesでは次のようなPod固有のDNSポリシーをサポートしています。これらのポリシーはPod Specの`dnsPolicy`フィールドで指定されます。

- "`Default`": そのPodはPodが稼働しているNodeから名前解決の設定を継承します。詳細に関しては、[関連する議論](/docs/tasks/administer-cluster/dns-custom-nameservers/#inheriting-dns-from-the-node)を参照してください。
- "`ClusterFirst`": "`www.kubernetes.io`"のようなクラスタードメインのサフィックスにマッチしないようなDNSクエリーは、Nodeから継承された上流のネームサーバーにフォワーディングされます。クラスター管理者は、追加のstubドメインと上流のDNSサーバーを設定できます。
- "`ClusterFirstWithHostNet`": hostNetworkによって稼働しているPodに対しては、ユーザーは明示的にDNSポリシーを"`ClusterFirstWithHostNet`"とセットするべきです。
- "`None`": この設定では、Kubernetesの環境からDNS設定を無視することができます。全てのDNS設定は、Pod Spec内の`dnsConfig`フィールドを指定して提供することになっています。下記のセクションの[Pod's DNS config](#pod-s-dns-config)を参照ください。

{{< note >}}
"Default"は、デフォルトのDNSポリシーではありません。もし`dnsPolicy`が明示的に指定されていない場合、"ClusterFirst"が使用されます。
{{< /note >}}

下記の例では、`hostNetwork`フィールドが`true`にセットされているため、`dnsPolicy`が"`ClusterFirstWithHostNet`"とセットされているPodを示します。

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

### PodのDNS設定

PodのDNS設定は、ユーザーがPodに対してそのDNS設定上でさらに制御するための手段を提供します。

`dnsConfig`フィールドはオプションで、どのような設定の`dnsPolicy`でも共に機能することができます。しかし、Podの`dnsPolicy`が"`None`"にセットされていたとき、`dnsConfig`フィールドは必ず指定されなくてはなりません。

下記の項目は、ユーザーが`dnsConfig`フィールドに指定可能なプロパティーとなります。

- `nameservers`: そのPodに対するDNSサーバーとして使われるIPアドレスのリストです。これは最大で3つのIPアドレスを指定することができます。Podの`dnsPolicy`が"`None`"に指定されていたとき、そのリストは最低1つのIPアドレスを指定しなければならず、もし指定されていなければ、それ以外の`dnsPolicy`の値の場合は、このプロパティーはオプションとなります。
- `searches`: Pod内のホスト名のルックアップのためのDNSサーチドメインのリストです。このプロパティーはオプションです。指定されていたとき、このリストは選択されたDNSポリシーから生成されたサーチドメイン名のベースとなるリストにマージされます。重複されているドメイン名は削除されます。Kubernetesでは最大6つのサーチドメインの設定を許可しています。
- `options`: `name`プロパティー(必須)と`value`プロパティー(オプション)を持つような各オプジェクトのリストで、これはオプションです。このプロパティー内の内容は指定されたDNSポリシーから生成されたオプションにマージされます。重複されたエントリーは削除されます。

下記のファイルはカスタムDNS設定を持ったPodの例です。

{{< codenew file="service/networking/custom-dns.yaml" >}}

上記のPodが作成されたとき、`test`コンテナは、コンテナ内の`/etc/resolv.conf`ファイル内にある下記の内容を取得します。

```
nameserver 1.2.3.4
search ns1.svc.cluster.local my.dns.search.suffix
options ndots:2 edns0
```

IPv6用のセットアップのためには、サーチパスとname serverは下記のようにセットアップするべきです。

```
$ kubectl exec -it dns-example -- cat /etc/resolv.conf
nameserver fd00:79:30::a
search default.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

### DNS機能を利用可用なバージョン

PodのDNS設定と"`None`"というDNSポリシーの利用可能なバージョンに関しては下記の通りです。

| k8s version | Feature support |
| :---------: |:-----------:|
| 1.14 | ステーブル |
| 1.10 | β版 (デフォルトで有効)|
| 1.9 | α版 |

{{% /capture %}}

{{% capture whatsnext %}}

DNS設定の管理方法に関しては、[DNS Serviceの設定](/docs/tasks/administer-cluster/dns-custom-nameservers/)
を確認してください。

{{% /capture %}}


