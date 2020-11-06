---
title: クラウドプロバイダー
content_type: concept
weight: 30
---

<!-- overview -->
このページでは、特定のクラウドプロバイダーで実行されているKubernetesを管理する方法について説明します。

<!-- body -->
### kubeadm
[kubeadm](/ja/docs/reference/setup-tools/kubeadm/kubeadm/)は、Kubernetesクラスターを作成する選択肢として人気があります。
kubeadmには、クラウドプロバイダーの設定情報を指定する設定オプションがあります。
例えば、典型的なインツリークラウドプロバイダーは、以下のようにkubeadmを使用して設定することができます。

```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
---
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.13.0
apiServer:
  extraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
  extraVolumes:
  - name: cloud
    hostPath: "/etc/kubernetes/cloud.conf"
    mountPath: "/etc/kubernetes/cloud.conf"
controllerManager:
  extraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
  extraVolumes:
  - name: cloud
    hostPath: "/etc/kubernetes/cloud.conf"
    mountPath: "/etc/kubernetes/cloud.conf"
```

典型的なインツリークラウドプロバイダーは、通常、[kube-apiserver](/ja/docs/reference/command-line-tools-reference/kube-apiserver/)および[kube-controller-manager](ja//docs/reference/command-line-tools-reference/kube-controller-manager/)、[kubelet](/ja/docs/reference/command-line-tools-reference/kubelet/)のコマンドラインで指定される`--cloud-provider`と`--cloud-config`の両方が必要です。
プロバイダーごとに`--cloud-config`で指定されるファイルの内容についても、以下に記載します。

すべての外部クラウドプロバイダーについては、以下の見出しに列挙されている個々のリポジトリーの案内に従ってください。または[すべてのリポジトリーのリスト](https://github.com/kubernetes?q=cloud-provider-&type=&language=)もご覧ください。

## AWS
ここでは、Amazon Web ServicesでKubernetesを実行する際に使用できるすべての設定について説明します。

この外部クラウドプロバイダーを利用したい場合、[kubernetes/cloud-provider-aws](https://github.com/kubernetes/cloud-provider-aws#readme)リポジトリーを参照してください。

### ノード名

AWSクラウドプロバイダーは、AWSインスタンスのプライベートDNS名をKubernetesのNodeオブジェクトの名前として使用します。

### ロードバランサー
以下のようにアノテーションを設定することで、[外部ロードバランサー](/ja/docs/tasks/access-application-cluster/create-external-load-balancer/)をAWS上で特定の機能を利用するように構成できます。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example
  namespace: kube-system
  labels:
    run: example
  annotations:
     service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:xx-xxxx-x:xxxxxxxxx:xxxxxxx/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx #replace this value
     service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
spec:
  type: LoadBalancer
  ports:
  - port: 443
    targetPort: 5556
    protocol: TCP
  selector:
    app: example
```
AWSのロードバランサーサービスには、_アノテーション_ を使ってさまざまな設定を適用することができます。以下では、AWS ELBでサポートされているアノテーションについて説明します。

* `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`: アクセスログの送信間隔を指定するために使用します。
* `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`: アクセスログを有効または無効にするためにサービスで使用します。
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`: アクセスログ用のs3バケット名を指定するために使用します。
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`: アクセスログ用のs3バケットのプレフィックスを指定するために使用します。
* `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags`: ELBに追加タグとして記録されるキーとバリューのペアのコンマ区切りリストとして指定するためにサービスで使用します。例えば、`"Key1=Val1,Key2=Val2,KeyNoVal1=,KeyNoVal2"`のように指定できます。
* `service.beta.kubernetes.io/aws-load-balancer-backend-protocol`: リスナーの背後にあるバックエンド(Pod)が使用するプロトコルを指定するためにサービスで使用します。`http`(デフォルト)または`https`を指定すると、接続を終端してヘッダーを解析するHTTPSリスナーが生成されます。`ssl`または`tcp`を指定すると、「生の」SSLリスナーが使われます。`http`を指定して`aws-load-balancer-ssl-cert`を使わない場合は、HTTPリスナーが使われます。
* `service.beta.kubernetes.io/aws-load-balancer-ssl-cert`: セキュアなリスナーを要求するためにサービスで使用します。値は有効な証明書のARNです。詳細は、[ELBリスナーの設定](https://docs.aws.amazon.com/ElasticLoadBalancing/latest/DeveloperGuide/elb-listener-config.html)を参照してください。CertARNは、IAMまたはCM証明書のARNで、例えば`arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`のようになります。
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled`: 接続ドレインを有効または無効にするためにサービスで使用します。
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout`: 接続ドレインのタイムアウトを指定するためにサービスで使用します。
* `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout`: アイドル接続タイムアウトを指定するためにサービスで使用します。
* `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled`: クロスゾーン負荷分散を有効または無効にするためにサービスで使用されます。
* `service.beta.kubernetes.io/aws-load-balancer-security-groups`: 作成されたELBに追加するセキュリティーグループを指定するために使用します。これは、以前にELBに割り当てられた他のすべてのセキュリティーグループを置き換えます。ここで定義されたセキュリティーグループは、サービス間で共有してはいけません。
* `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups`: 作成されたELBに加える追加のセキュリティーグループを指定するためにサービスで使用します。
* `service.beta.kubernetes.io/aws-load-balancer-internal`: 内部ELBが必要であることを示すためにサービスで使用します。
* `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol`: ELB上でプロキシープロトコルを有効にするためにサービスで使用します。現在は、すべてのELBバックエンドでプロキシープロトコルを有効にすることを意味する`*`という値しか受け付けません。将来的には、特定のバックエンドでのみプロキシープロトコルを設定できるように調整できます。
* `service.beta.kubernetes.io/aws-load-balancer-ssl-ports`: SSL/HTTPSリスナーを使用するポートのコンマ区切りリストを指定するためにサービスで使用します。デフォルトは`*`(すべて)です。

AWSのアノテーションの情報は、[aws.go](https://github.com/kubernetes/legacy-cloud-providers/blob/master/aws/aws.go)のコメントから引用しています。

## Azure

この外部クラウドプロバイダーを利用したい場合、[kubernetes/cloud-provider-azure](https://github.com/kubernetes/cloud-provider-azure#readme)リポジトリーを参照してください。

### ノード名

Azureクラウドプロバイダーは、ノードのホスト名(kubeletで決定されたもの、または`--hostname-override`で上書きされたもの)を、Kubernetes Nodeオブジェクトの名前として使用します。
Kubernetesノード名は、Azure VM名と一致しなければならないことに注意してください。

## CloudStack

この外部クラウドプロバイダーを利用したい場合、[apache/cloudstack-kubernetes-provider](https://github.com/apache/cloudstack-kubernetes-provider)リポジトリーを参照してください。

### ノード名

CloudStackクラウドプロバイダーは、ノードのホスト名(kubeletで決定されたもの、または`--hostname-override`で上書きされたもの)を、Kubernetes Nodeオブジェクトの名前として使用します。
Kubernetesノード名は、CloudStack VM名と一致しなければならないことに注意してください。

## GCE

この外部クラウドプロバイダーを利用したい場合、[kubernetes/cloud-provider-gcp](https://github.com/kubernetes/cloud-provider-gcp#readme)リポジトリーを参照してください。

### ノード名

GCEクラウドプロバイダーは、ノードのホスト名(kubeletで決定されたもの、または`--hostname-override`で上書きされたもの)を、Kubernetes Nodeオブジェクトの名前として使用します。
Kubernetesノード名の最初のセグメントは、GCEインスタンス名と一致しなければならないことに注意してください。例えば、`kubernetes-node-2.c.my-proj.internal`という名前のノードは、`kubernetes-node-2`という名前のインスタンスに対応していなければなりません。

## HUAWEI CLOUD

この外部クラウドプロバイダーを利用したい場合、[kubernetes-sigs/cloud-provider-huaweicloud](https://github.com/kubernetes-sigs/cloud-provider-huaweicloud)リポジトリーを参照してください。

### ノード名

HUAWEI CLOUDプロバイダーは、ノードのプライベートIPアドレスをKubernetesノード名として使用します。
ノードでkubeletを開始するときは、必ず`--hostname-override=<node private IP>`を指定してください。

## OpenStack
ここでは、OpenStackでKubernetesを実行する際に使用できるすべての設定について説明します。

この外部クラウドプロバイダーを利用したい場合、[kubernetes/cloud-provider-openstack](https://github.com/kubernetes/cloud-provider-openstack#readme)リポジトリーを参照してください。

### ノード名

OpenStackクラウドプロバイダーは、インスタンス名(OpenStackのメタデータで決定されたもの)を、Kubernetes Nodeオブジェクトの名前として使用します。
インスタンス名は必ず、Kubernetesノード名は、CloudStack VM名と一致しなければならないことに注意してください。
kubeletがNodeオブジェクトを正常に登録できるように、インスタンス名は有効なKubernetesノード名である必要があります。

### サービス

KubernetesのOpenStackクラウドプロバイダーの実装では、利用可能な場合、基盤となるクラウドからこれらのOpenStackのサービスの使用をサポートします。

| サービス名                 | APIバージョン    | 必須か    |
|--------------------------|----------------|----------|
| Block Storage (Cinder)   | V1†, V2, V3    | No       |
| Compute (Nova)           | V2             | No       |
| Identity (Keystone)      | V2‡,  V3       | Yes      |
| Load Balancing (Neutron) | V1§, V2        | No       |
| Load Balancing (Octavia) | V2             | No       |

† Block Storage V1 APIのサポートは非推奨ですが、Kubernetes 1.9ではBlock Storage V3 APIのサポートが追加されました。

‡ Identity V2 APIのサポートは非推奨となり、将来のリリースでプロバイダーから削除される予定です。「Queens」のリリース時点で、OpenStackはIdentity V2 APIを公開しません。

§ Load Balancing V1 APIのサポートは、Kubernetes 1.9で削除されました。

サービスディスカバリーは、プロバイダー設定で提供される`auth-url`を使用して、OpenStack Identity(Keystone)が管理するサービスカタログを一覧表示することで実現されます。
プロバイダーは、Keystone以外のOpenStackサービスが利用できなくなった場合には、機能を緩やかに低下させ、影響を受ける機能のサポートを放棄します。
特定の機能は、基盤となるクラウドでNeutronが公開している拡張機能のリストに基づいて有効または無効にされます。

### cloud.conf
Kubernetesはcloud.confというファイルを介して、OpenStackとのやりとり方法を知っています。
これは、KubernetesにOpenStack認証エンドポイントの認証情報と場所を提供するファイルです。
ファイル内に以下の詳細を指定することで、cloud.confファイルを作成できます。

#### 典型的な設定
以下の設定例は、最も頻繁に設定が必要な値に関するものです。
プロバイダーをOpenStackクラウドのKeystoneエンドポイントに指定し、そのエンドポイントでの認証方法の詳細を提供し、さらにロードバランサーを設定します。

```yaml
[Global]
username=user
password=pass
auth-url=https://<keystone_ip>/identity/v3
tenant-id=c869168a828847f39f7f06edd7305637
domain-id=2a73b8f597c04551a0fdc8e95544be8a

[LoadBalancer]
subnet-id=6937f8fa-858d-4bc9-a3a5-18d2c957166a
```

##### グローバル
これらのOpenStackプロバイダーの設定オプションは、グローバル設定に関連しており、`cloud.conf`ファイルの`[Global]`セクションに記述する必要があります。

* `auth-url`(必死): 認証に使用するKeystone APIのURLです。OpenStackのコントロールパネルでは、Access and Security > API Access > Credentialsで確認できます。
* `username`(必須): Keystoneに設定されている有効なユーザーのユーザー名を参照します。
* `password`(必須): Keystoneで設定された有効なユーザーのパスワードを参照します。
* `tenant-id`(必須): リソースを作成するプロジェクトのIDを指定するために使用します。
* `tenant-name`(任意): リソースを作成するプロジェクトの名前を指定します。
* `trust-id`(任意): 認証に使用するtrustの識別子を指定するために使用します。trustは、ユーザー(委託者)が他のユーザー(受託者)に役割を委譲したり、受託者が委託者になりすますことを許可したりする権限を表します。利用可能なtrustは、Keystone APIの`/v3/OS-TRUST/trusts`エンドポイントの下にあります。
* `domain-id`(任意): ユーザーが所属するドメインのIDを指定するために使用します。
* `domain-name`(任意): ユーザーが所属するドメイン名を指定するために使用します。
* `region`(任意): マルチリージョンのOpenStackクラウド上で実行する際に使うリージョンの識別子を指定するために使用します。リージョンはOpenStackデプロイメントの一般的な区分です。リージョンには厳密な地理的な意味合いはありませんが、デプロイメントでは`us-east`のような地理的な名前をリージョンの識別子に使うことができます。利用可能なリージョンはKeystone APIの`/v3/regions`エンドポイントの下にあります。
* `ca-file`(任意): カスタムCAファイルのパスを指定するために使用します。


テナントをプロジェクトに変更するKeystone V3を使用している場合、`tenant-id`の値は自動的にAPIのプロジェクト構造体にマッピングされます。

##### ロードバランサー
これらのOpenStackプロバイダーの設定オプションは、ロードバランサー設定に関連しており、`cloud.conf`ファイルの`[LoadBalancer]`セクションに記述する必要があります。

* `lb-version`(任意): 自動バージョン検出を上書きするために使用します。有効な値は`v1`または`v2`です。値が指定されていない場合、自動検出は基盤となるOpenStackクラウドが公開するサポートバージョンのうち、最も高いものを選択します。
* `use-octavia`(任意): Octavia LBaaS V2サービスカタログエンドポイントを探して、利用するかどうかを決定するために使用します。有効な値は`true`または`false`です。`true`が指定され、Octaiva LBaaS V2エントリーが見つからなかった場合、プロバイダーはフォールバックして代わりにNeutron LBaaS V2エンドポイントを見つけようとします。デフォルト値は`false` です。
* `subnet-id`(任意): ロードバランサーを作成したいサブネットのIDを指定します。Network > Networksにあります。サブネットを取得するには、それぞれのネットワークをクリックします。
* `floating-network-id`(任意): 指定した場合、ロードバランサーのフローティングIPを作成します。
* `lb-method`(任意): ロードバランサープールのメンバー間で負荷分散させるアルゴリズムを指定するために使用します。値には`ROUND_ROBIN`、`LEAST_CONNECTIONS`、`SOURCE_IP`を指定できます。何も指定しない場合のデフォルトの動作は`ROUND_ROBIN` です。
* `lb-provider`(任意): ロードバランサーのプロバイダーを指定するために使用します。指定しない場合は、Neutronで設定されたデフォルトのプロバイダサービスが使用されます。
* `create-monitor`(任意): Neutronロードバランサーのヘルスモニターを作成するかどうかを表します。有効な値は`true`と`false`で、デフォルト値は`false`です。`true`を指定した場合は、`monitor-delay`、`monitor-timeout`、`monitor-max-retries`も設定しなければなりません。
* `monitor-delay`(任意): ロードバランサーのメンバーにプローブを送信するまでの時間です。有効な時間単位を指定してください。有効な時間単位は"ns"、"us"(または"μs")、"ms"、"s"、"m"、"h"です。
* `monitor-timeout`(任意): モニタリングがタイムアウトする前にpingの応答を待つための最大の時間です。この値はdelay値よりも小さくする必要があります。有効な時間単位を指定してください。有効な時間単位は"ns"、"us"(または"μs")、"ms"、"s"、"m"、"h"です。
* `monitor-max-retries`(任意): ロードバランサーメンバーのステータスをINACTIVEに変更する前に許容されるpingの失敗の数です。1から10の間の数値でなければなりません。
* `manage-security-groups`(任意): ロードバランサーがセキュリティーグループのルールを自動的に管理するかどうかを決定します。有効な値は`true`と`false`で、デフォルト値は`false`です。`true`を指定した場合は、`node-security-group`も指定しなければなりません。
* `node-security-group`(任意): 管理するセキュリティーグループのIDです。

##### ブロックストレージ
これらのOpenStackプロバイダーの設定オプションは、ブロックストレージ設定に関連しており、`cloud.conf`ファイルの`[BlockStorage]`セクションに記述する必要があります。

* `bs-version`(任意): 自動バージョン検出を上書きするために使用します。有効な値は`v1`、`v2`、`v3`、`auto`です。`auto`が指定された場合、自動検出は基盤となるOpenStackクラウドが公開するサポートバージョンのうち、最も高いものを選択します。何も指定しない場合のデフォルト値は`auto`です。
* `trust-device-path`(任意): ほとんどのシナリオでは、Cinderが提供するブロックデバイス名(例: `/dev/vda`)は信頼できません。このブール値はこの動作をトグルします。`true`に設定すると、Cinderが提供するブロックデバイス名を信頼することになります。デフォルト値の`false`は、シリアル番号と`/dev/disk/by-id`のマッピングに基づいてデバイスのパスを検出します。
* `ignore-volume-az`(任意): Cinderボリュームをアタッチする際のアベイラビリティーゾーンの使用に影響を与えます。NovaとCinderのアベイラビリティーゾーンが異なる場合は、`true`に設定する必要があります。これは、Novaのアベイラビリティーゾーンが多くあるにも関わらず、Cinderのアベイラビリティーゾーンが1つしかない場合によく見られます。デフォルト値は以前のリリースで使用されていた動作を維持するために`false`になっていますが、将来的には変更される可能性があります。
* `node-volume-attach-limit`(任意): ノードにアタッチできるボリュームの最大数で、デフォルトはCinderの256です。

エンドポイントを区別するためにポートではなくパスを使用しているOpenStackデプロイメントにおいて、Kubernetesのバージョン1.8以下をデプロイする際、明示的に`bs-version`パラメーターの設定が必要な場合があります。パスベースのエンドポイントは`http://foo.bar/volume`の形式であり、ポートベースのエンドポイントは`http://foo.bar:xxx`の形式です。

パスベースのエンドポイントを使う環境で、Kubernetesが古い自動検出ロジックを使用している場合、ボリュームの切り離しを試みると`BS API version autodetection failed.`というエラーが返されます。この問題を回避するには、クラウドプロバイダー設定に以下のように追記することで、Cinder APIバージョン2を強制的に使用することができます。

```yaml
[BlockStorage]
bs-version=v2
```

##### メタデータ
これらのOpenStackプロバイダーの設定オプションは、メタデータ設定に関連しており、`cloud.conf`ファイルの`[Metadata]`セクションに記述する必要があります。

* `search-order`(任意): この設定のキーは、プロバイダーが実行するインスタンスに関連するメタデータの取得方法に影響します。デフォルト値の`configDrive,metadataService`について、プロバイダーは、コンフィグドライブが利用可能な場合は最初にインスタンスに関連するメタデータをそこから取得し、次にメタデータサービスから取得します。代替値は以下の通りです。
  * `configDrive` - コンフィグドライブからのみ、インスタンスのメタデータを取得します。
  * `metadataService` - メタデータサービスからのみ、インスタンスのメタデータを取得します。
  * `metadataService,configDrive` - 最初にメタデータサービスからインスタンスのメタデータを取得し、次にコンフィグドライブから取得します。

  コンフィグドライブ上のメタデータは時間の経過とともに陳腐化する可能性がありますが、メタデータサービスは常に最新の情報を提供するため、この動作を調整するのが望ましいです。しかし、すべてのOpenStackクラウドがコンフィグドライブとメタデータサービスの両方を提供しているわけではなく、どちらか一方しか利用できない場合もあるため、デフォルトでは両方をチェックするようになっています。

##### ルート
これらのOpenStackプロバイダーの設定オプションは、[kubenet](/ja/docs/concepts/cluster-administration/network-plugins/#kubenet)のKubernetesネットワークプラグインに関連しており、`cloud.conf`ファイルの`[Route]`セクションに記述する必要があります。


* `router-id`(任意): 基盤となるクラウドのNeutronデプロイメントが`extraroutes`拡張機能をサポートしている場合は、`router-id`を使用してルートを追加するルーターを指定します。選択したルーターは、クラスターノードを含むプライベートネットワークにまたがっていなければなりません(通常、ノードネットワークは1つしかないので、この値はノードネットワークのデフォルトルーターになります)。この値は、OpenStackで[kubenet](/docs/concepts/cluster-administration/network-plugins/#kubenet)を使用するために必要です。

## OVirt

### ノード名

OVirtクラウドプロバイダーは、ノードのホスト名(kubeletで決定されたもの、または`--hostname-override`で上書きされたもの)を、Kubernetes Nodeオブジェクトの名前として使用します。
Kubernetesノード名は、VMのFQDN(`<vm><guest_info><fqdn>...</fqdn></guest_info></vm>`の下でOVirtによって報告されたもの)と一致しなければならないことに注意してください。

## Photon

### ノード名

Photonクラウドプロバイダーは、ノードのホスト名(kubeletで決定されたもの、または`--hostname-override`で上書きされたもの)を、Kubernetes Nodeオブジェクトの名前として使用します。
Kubernetesノード名はPhoton VM名と一致しなければならないことに注意してください(もしくは、`--cloud-config`で`overrideIP`がtrueに設定されている場合は、Kubernetesノード名はPhoton VMのIPアドレスと一致しなければなりません)。

## vSphere

{{< tabs name="vSphere cloud provider" >}}
{{% tab name="vSphere 6.7U3以上" %}}
vSphere 6.7U3以上のすべてのvSphereデプロイメントでは、[external vSphere cloud provider](https://github.com/kubernetes/cloud-provider-vsphere)と[vSphere CSI driver](https://github.com/kubernetes-sigs/vsphere-csi-driver)の使用を推奨します。クイックスタートガイドについては、[Deploying a Kubernetes Cluster on vSphere with CSI and CPI](https://cloud-provider-vsphere.sigs.k8s.io/tutorials/kubernetes-on-vsphere-with-kubeadm.html)を参照してください。
{{% /tab %}}
{{% tab name="vSphere 6.7U3未満" %}}
vSphere 6.7U3未満を実行している場合は、インツリーのvSphereクラウドプロバイダーを推奨します。クイックスタートガイドについては、[Running a Kubernetes Cluster on vSphere with kubeadm](https://cloud-provider-vsphere.sigs.k8s.io/tutorials/k8s-vcp-on-vsphere-with-kubeadm.html)を参照してください。
{{% /tab %}}
{{< /tabs >}}

vSphereクラウドプロバイダーの詳細なドキュメントについては、[vSphereクラウドプロバイダーのドキュメントサイト](https://cloud-provider-vsphere.sigs.k8s.io)を参照してください。

## IBM Cloud Kubernetes Service

### コンピュートノード
IBM Cloud Kubernetes Serviceプロバイダーを使用することで、仮想ノードと物理ノード(ベアメタル)を混在させたクラスターを単一のゾーン、またはリージョン内の複数のゾーンにまたがって作成することができます。詳細については、[Planning your cluster and worker node setup](https://cloud.ibm.com/docs/containers?topic=containers-planning_worker_nodes)を参照してください。

Kubernetes Nodeオブジェクトの名前は、IBM Cloud Kubernetes ServiceワーカーノードインスタンスのプライベートIPアドレスです。

### ネットワーク
IBM Cloud Kubernetes Serviceプロバイダーは、高品質なネットワークパフォーマンスとノードのネットワーク分離のためにVLANを提供します。カスタムファイアウォールやCalicoネットワークポリシーを設定して、クラスターにセキュリティーの追加レイヤーを加えたり、VPNを使用してクラスターをオンプレミスデータセンターに接続したりすることができます。詳細については、[Planning your cluster network setup](https://cloud.ibm.com/docs/containers?topic=containers-plan_clusters)を参照してください。

アプリケーションをパブリックまたはクラスター内で公開するには、NodePort、LoadBalancer、Ingressサービスを利用できます。また、Ingressアプリケーションのロードバランサーをアノテーションでカスタマイズすることもできます。詳細については、[Choosing an app exposure service](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_planning#cs_network_planning)を参照してください。

### ストレージ
IBM Cloud Kubernetes Serviceプロバイダーは、Kubernetesネイティブの永続ボリュームを活用して、ユーザーがファイル、ブロック、およびクラウドオブジェクトストレージをアプリケーションにマウントできるようにします。また、データの永続ストレージにDatabase as a Serviceやサードパーティーのアドオンを使用することもできます。詳しくは、[Planning highly available persistent storage](https://cloud.ibm.com/docs/containers?topic=containers-storage_planning#storage_planning)を参照してください。

## Baidu Cloud Container Engine

### ノード名

Baiduクラウドプロバイダーは、ノードのプライベートIPアドレス(kubeletで決定されたもの、または`--hostname-override`で上書きされたもの)を、Kubernetes Nodeオブジェクトの名前として使用します。
Kubernetesノード名はBaidu VMのプライベートIPと一致しなければならないことに注意してください。

## Tencent Kubernetes Engine

この外部クラウドプロバイダーを利用したい場合、[TencentCloud/tencentcloud-cloud-controller-manager](https://github.com/TencentCloud/tencentcloud-cloud-controller-manager)リポジトリーを参照してください。

### ノード名

Baiduクラウドプロバイダーは、ノードのホスト名(kubeletで決定されたもの、または`--hostname-override`で上書きされたもの)を、Kubernetes Nodeオブジェクトの名前として使用します。
Kubernetesノード名はTencent VMのプライベートIPと一致しなければならないことに注意してください。

## Alibaba Cloud Kubernetes

この外部クラウドプロバイダーを利用したい場合、[kubernetes/cloud-provider-alibaba-cloud](https://github.com/kubernetes/cloud-provider-alibaba-cloud)リポジトリーを参照してください。

### ノード名

Alibaba Cloudではノード名の書式は必要ありませんが、kubeletでは`--provider-id=${REGION_ID}.${INSTANCE_ID}`を追加する必要があります。パラメーター`${REGION_ID}`はKubernetesのリージョンのIDを、`${INSTANCE_ID}`はAlibaba ECS(Elastic Compute Service)のIDを表します。

### ロードバランサー

[アノテーション](https://www.alibabacloud.com/help/en/doc-detail/86531.htm)を設定することで、Alibaba Cloudの特定の機能を使用するように外部のロードバランサーを設定できます。
