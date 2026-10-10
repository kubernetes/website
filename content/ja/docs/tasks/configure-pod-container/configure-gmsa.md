---
title: Windows Podとコンテナに対するGMSAの設定
content_type: task
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

このページでは、Windowsノード上で動作するPodとコンテナに対する[グループ管理サービスアカウント](https://learn.microsoft.com/ja-jp/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview)(GMSA)の設定方法を示します。
グループ管理サービスアカウントは特別な種類のActive Directoryアカウントで、パスワードの自動管理、簡略化されたサービスプリンシパル名(SPN)の管理、および管理を他の管理者に委任する機能を複数のサーバーに提供します。

Kubernetesでは、GMSA資格情報仕様は、Kubernetesクラスター全体をスコープとするカスタムリソースとして設定されます。
WindowsのPodおよびPod内の個々のコンテナは、他のWindowsサービスとやり取りする際に、ドメインベースの機能(例えばKerberos認証)に対してGMSAを使用するように設定できます。

## {{% heading "prerequisites" %}}

Kubernetesクラスターが必要で、`kubectl`コマンドラインツールがクラスターと通信できるように設定されている必要があります。
クラスターにはWindowsワーカーノードを持つことが求められます。
このセクションでは、各クラスターに対して一度だけ実施する必要がある一連の初期ステップについて説明します:

### GMSACredentialSpec CRDのインストール

カスタムリソースタイプ`GMSACredentialSpec`を定義するために、GMSA資格情報仕様リソースに対する[CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)(CRD)をクラスター上で設定する必要があります。
GMSA CRDの[YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml)をダウンロードし、gmsa-crd.yamlとして保存します。
次に、`kubectl apply -f gmsa-crd.yaml`を実行してCRDをインストールします。

### GMSAユーザーを検証するためのWebhookのインストール

Podまたはコンテナレベルで参照するGMSA資格情報仕様を追加および検証するために、Kubernetesクラスター上で2つのWebhookを設定する必要があります:

1. Mutating Webhookは、(Podの仕様から名前で指定された)GMSAへの参照を、JSON形式の完全な資格情報仕様としてPodのspecの中へ展開します。

1. Validating Webhookは、すべてのGMSAへの参照に対して、Podサービスアカウントによる利用が認可されているか確認します。

上記Webhookと関連するオブジェクトをインストールするためには、次の手順が必要です:

1. 証明書と鍵のペアを作成します(Webhookコンテナがクラスターと通信できるようにするために使用されます)

1. 上記の証明書を含むSecretをインストールします。

1. コアとなるWebhookロジックのためのDeploymentを作成します。

1. Deploymentを参照するValidating WebhookとMutating Webhookの設定を作成します。

上で述べたGMSA Webhookと関連するオブジェクトを展開、構成するための[スクリプト](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh)があります。
スクリプトは、`--dry-run=server`オプションをつけることで、クラスターに対して行われる変更内容をレビューすることができます。

Webhookと関連するオプジェクトを(適切なパラメーターを渡すことで)手動で展開するための[YAMLテンプレート](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl)もあります。

<!-- steps -->

## Active DirectoryにGMSAとWindowsノードを構成する

[Windows GMSAのドキュメント](https://learn.microsoft.com/ja-jp/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1)に記載されている通り、Kubernetes内のPodがGMSAを使用するために設定できるようにする前に、Active Directory内に目的のGMSAを展開する必要があります。
[Windows GMSAのドキュメント](https://learn.microsoft.com/ja-jp/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet)に記載されている通り、(Kubernetesクラスターの一部である)Windowsワーカーノードは、目的のGMSAに関連づけられたシークレット資格情報にアクセスできるように、Active Directory内で設定されている必要があります。

## GMSA資格情報仕様リソースの作成

(前述の通り)GMSACredentialSpec CRDをインストールすると、GMSA資格情報仕様を含むカスタムリソースを設定できます。
GMSA資格情報仕様には、シークレットや機密データは含まれません。
それは、コンテナランタイムが目的のコンテナのGMSAをWindowsに対して記述するために使用できる情報です。
GMSA資格情報仕様は、[PowerShellスクリプト](https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1)のユーティリティを使用して、YAMLフォーマットで生成することができます。

以下は、GMSA資格情報仕様をJSON形式で手動で生成し、その後それをYAMLに変換する手順です:

1. CredentialSpec[モジュール](https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1)をインポートします: `ipmo CredentialSpec.psm1`

1. `New-CredentialSpec`を使用してJSONフォーマットの資格情報仕様を作成します。
   WebApp1という名前のGMSA資格情報仕様を作成するには、`New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`を実行します

1. `Get-CredentialSpec`を使用して、JSONファイルのパスを表示します。

1. credspecファイルをJSON形式からYAML形式に変換し、Kubernetesで設定可能なGMSACredentialSpecカスタムリソースにするために、必要なヘッダーフィールドである`apiVersion`、`kind`、`metadata`、`credspec`を記述します。

次のYAML設定は、`gmsa-WebApp1`という名前のGMSA資格情報仕様を記述しています:

```yaml
apiVersion: windows.k8s.io/v1
kind: GMSACredentialSpec
metadata:
  name: gmsa-WebApp1  # これは任意の名前で構いませんが、参照時に使用されます
credspec:
  ActiveDirectoryConfig:
    GroupManagedServiceAccounts:
    - Name: WebApp1   # GMSAアカウントのユーザー名
      Scope: CONTOSO  # NETBIOSドメイン名
    - Name: WebApp1   # GMSAアカウントのユーザー名
      Scope: contoso.com # DNSドメイン名
  CmsPlugins:
  - ActiveDirectory
  DomainJoinConfig:
    DnsName: contoso.com  # DNSドメイン名
    DnsTreeName: contoso.com # DNSルートドメイン名
    Guid: 244818ae-87ac-4fcd-92ec-e79e5252348a  # GUID
    MachineAccountName: WebApp1 # GMSAアカウントのユーザー名
    NetBiosName: CONTOSO  # NETBIOSドメイン名
    Sid: S-1-5-21-2126449477-2524075714-3094792973 # GMSAのSID
```

上記の資格情報仕様リソースは`gmsa-Webapp1-credspec.yaml`として保存され、次のコマンドを使用してクラスターに適用されます: `kubectl apply -f gmsa-Webapp1-credspec.yml`

## 指定されたGMSA資格情報仕様上にRBACを有効にするためのクラスターロールの設定

各GMSA資格情報仕様リソースに対して、クラスターロールを定義する必要があります。
これは特定のGMSAリソース上の`use` verbを、通常はサービスアカウントであるsubjectに対して認可します。
次の例は、前述の`gmsa-WebApp1`資格情報仕様の利用を認可するクラスターロールを示しています。
ファイルをgmsa-webapp1-role.yamlとして保存し、`kubectl apply -f gmsa-webapp1-role.yaml`を使用して適用します。

```yaml
# credspecを読むためのロールを作成
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: webapp1-role
rules:
- apiGroups: ["windows.k8s.io"]
  resources: ["gmsacredentialspecs"]
  verbs: ["use"]
  resourceNames: ["gmsa-WebApp1"]
```

## 指定されたGMSA credspecを使用するためのサービスアカウントへのロールの割り当て

(Podに対して設定される)サービスアカウントを、上で作成したクラスターロールに結びつける必要があります。
これによって、要求されたGMSA資格情報仕様のリソースの利用をサービスアカウントに対して認可できます。
以下は、上で作成した資格情報仕様リソース`gmsa-WebApp1`を使うために、既定のサービスアカウントに対してクラスターロール`webapp1-role`を割り当てる方法を示しています。

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: allow-default-svc-account-read-on-gmsa-WebApp1
  namespace: default
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
roleRef:
  kind: ClusterRole
  name: webapp1-role
  apiGroup: rbac.authorization.k8s.io
```

## Podのspec内で参照するGMSA資格情報仕様の設定

Podのspecのフィールド`securityContext.windowsOptions.gmsaCredentialSpecName`は、要求されたGMSA資格情報仕様のカスタムリソースに対する参照を、Podのspec内で指定するために使用されます。
これは、Podのspec内の全てのコンテナに対して、指定されたGMSAを使用するように設定します。
`gmsa-WebApp1`を参照するために追加された注釈を持つPodのspecのサンプルです:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: with-creds
  name: with-creds
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      run: with-creds
  template:
    metadata:
      labels:
        run: with-creds
    spec:
      securityContext:
        windowsOptions:
          gmsaCredentialSpecName: gmsa-webapp1
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
      nodeSelector:
        kubernetes.io/os: windows
```

Podのspec内の個々のコンテナも、コンテナ毎の`securityContext.windowsOptions.gmsaCredentialSpecName`フィールドを使用することで、要求されたGMSA credspecを指定することができます。

設定例:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: with-creds
  name: with-creds
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      run: with-creds
  template:
    metadata:
      labels:
        run: with-creds
    spec:
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
        securityContext:
          windowsOptions:
            gmsaCredentialSpecName: gmsa-Webapp1
      nodeSelector:
        kubernetes.io/os: windows
```

(上記のような)GMSAフィールドが入力されたPod specがクラスターに適用されると、次の一連のイベントが発生します:

1. Mutating WebhookがGMSA資格情報仕様リソースへの全ての参照を解決し、GMSA資格情報仕様の内容を展開します。

1. Validating Webhookは、Podに関連付けられたサービスアカウントが、指定されたGMSA資格情報仕様上の`use` verbに対して認可されていることを保証します。

1. コンテナランタイムは、指定されたGMSA資格情報仕様で各Windowsコンテナを設定します。
それによってコンテナはGMSAのIDがActive Directory内にあることを仮定でき、そのIDを使用してドメイン内のサービスにアクセスできます。

## ホスト名またはFQDNを使用してネットワーク共有に対して認証する

PodからSMB共有へのホスト名やFQDNを使用した接続で問題が発生した際に、IPv4アドレスではSMB共有にアクセスすることはできる場合には、次のレジストリキーがWindowsノード上で設定されているか確認してください。

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Services\hns\State" /v EnableCompartmentNamespace /t REG_DWORD /d 1
```

その後、動作の変更を反映させるために、実行中のPodを再作成する必要があります。
このレジストリキーがどのように使用されるかについてのより詳細な情報は、[こちら](https://github.com/microsoft/hcsshim/blob/885f896c5a8548ca36c88c4b87fd2208c8d16543/internal/uvm/create.go#L74-L83)を参照してください。

## トラブルシューティング

自分の環境でGMSAがうまく動作しない時に実行できるトラブルシューティングステップがあります。

まず、credspecがPodに渡されたことを確認します。
そのためには、Podのひとつに`exec`で入り、`nltest.exe /parentdomain`コマンドの出力をチェックする必要があります。 

以下の例では、Podはcredspecを正しく取得できませんでした:

```PowerShell
kubectl exec -it iis-auth-7776966999-n5nzr powershell.exe
```

`nltest.exe /parentdomain`の結果は次のようなエラーになります:

```output
Getting parent domain failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

Podが正しくcredspecを取得したら、次にドメインと正しく通信できることを確認します。
まずはPodの中から、ドメインのルートを見つけるために、手短にnslookupを実行します。

これから3つのことがわかります:

1. PodがDCまで到達できる
1. DCがPodに到達できる
1. DNSが正しく動作している

DNSと通信のテストをパスしたら、次にPodがドメインとセキュアチャネル通信を構築することができるか確認する必要があります。
そのためには、再び`exec`を使用してPodの中に入り、`nltest.exe /query`コマンドを実行します。

```PowerShell
nltest.exe /query
```

結果は次のように出力されます:

```output
I_NetLogonControl failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

これは、Podがなんらかの理由で、credspec内で指定されたアカウントを使用してドメインにログオンできなかったことを示しています。
次のコマンドを実行してセキュアチャネルを修復してみてください:

```PowerShell
nltest /sc_reset:domain.example
```

コマンドが成功したら、このような出力を確認することができます:

```output
Flags: 30 HAS_IP  HAS_TIMESERV
Trusted DC Name \\dc10.domain.example
Trusted DC Connection Status Status = 0 0x0 NERR_Success
The command completed successfully
```

もし上記によってエラーが解消された場合は、次のライフサイクルフックをPodのspecに追加することで、手順を自動化できます。
エラーが解消されなかった場合は、credspecをもう一度調べ、正しく完全であることを確認する必要があります。

```yaml
        image: registry.domain.example/iis-auth:1809v1
        lifecycle:
          postStart:
            exec:
              command: ["powershell.exe","-command","do { Restart-Service -Name netlogon } while ( $($Result = (nltest.exe /query); if ($Result -like '*0x0 NERR_Success*') {return $true} else {return $false}) -eq $false)"]
        imagePullPolicy: IfNotPresent
```

Podのspecに上記の`lifecycle`セクションを追加すると、`nltest.exe /query`コマンドがエラーとならずに終了するまで`netlogon`サービスを再起動するために、Podは一連のコマンドを実行します。
