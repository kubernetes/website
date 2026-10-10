---
title: 投影ボリューム
content_type: concept
weight: 21 # just after persistent volumes
---

<!-- overview -->

このドキュメントでは、Kubernetesの*投影ボリューム*について説明します。[ボリューム](/docs/concepts/storage/volumes/)に精通していることをお勧めします。

<!-- body -->

## 概要

ボリュームは、いくつかの既存の`投影`ボリュームソースを同じディレクトリにマップします。

現在、次のタイプのボリュームソースを投影できます。

* [`secret`](/docs/concepts/storage/volumes/#secret)
* [`downwardAPI`](/docs/concepts/storage/volumes/#downwardapi)
* [`configMap`](/docs/concepts/storage/volumes/#configmap)
* `serviceAccountToken`

すべてのソースは、Podと同じnamespaceにある必要があります。詳細は[all-in-one volume](https://github.com/kubernetes/design-proposals-archive/blob/main/node/all-in-one-volume.md)デザインドキュメントを参照してください。

### secret、downwardAPI、およびconfigMapを使用した構成例 {#example-configuration-secret-downwardapi-configmap}

{{% codenew file="pods/storage/projected-secret-downwardapi-configmap.yaml" %}}

### 構成例:デフォルト以外のアクセス許可モードが設定されたsecret {#example-configuration-secrets-nondefault-permission-mode}

{{% codenew file="pods/storage/projected-secrets-nondefault-permission-mode.yaml" %}}

各投影ボリュームソースは、specの`sources`にリストされています。パラメーターは、2つの例外を除いてほぼ同じです。

* secretについて、ConfigMapの命名と一致するように`secretName`フィールドが`name`に変更されました。
* `defaultMode`はprojectedレベルでのみ指定でき、各ボリュームソースには指定できません。ただし上に示したように、個々の投影ごとに`mode`を明示的に設定できます。

`TokenRequestProjection`機能が有効になっている場合、現在の[サービスアカウントトークン](/ja/docs/reference/access-authn-authz/authentication/#service-account-token)を指定されたパスのPodに挿入できます。例えば:

{{% codenew file="pods/storage/projected-service-account-token.yaml" %}}

この例のPodには、挿入されたサービスアカウントトークンを含む投影ボリュームがあります。このトークンはPodのコンテナがKubernetes APIサーバーにアクセスするために使用できます。この`audience`フィールドにはトークンの受信対象者が含まれています。トークンの受信者は、トークンの`audience`フィールドで指定された識別子で自分自身であるかを識別します。そうでない場合はトークンを拒否します。このフィールドはオプションで、デフォルトではAPIサーバーの識別子が指定されます。

`expirationSeconds`はサービスアカウントトークンが有効であると予想される期間です。
デフォルトは1時間で、最低でも10分(600秒)でなければなりません。
管理者は、APIサーバーに`--service-account-max-token-expiration`オプションを指定することで、その最大値を制限することも可能です。
`path`フィールドは、投影ボリュームのマウントポイントへの相対パスを指定します。


{{< note >}}
投影ボリュームソースを[`subPath`](/docs/concepts/storage/volumes/#using-subpath)ボリュームマウントとして使用しているコンテナは、それらのボリュームソースの更新を受信しません。
{{< /note >}}

## SecurityContextの相互作用

サービスアカウントの投影ボリューム拡張でのファイル権限処理の[提案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/2451-service-account-token-volumes#proposal)により、正しい所有者権限が設定された投影ファイルが導入されました。

### Linux

投影ボリュームがあり、Podの[`SecurityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)に`RunAsUser`が設定されているLinux Podでは、投影されたファイルには、コンテナユーザーの所有権を含む正しい所有権が設定されます。

### Windows

投影ボリュームを持ち、Podの`SecurityContext`で`RunAsUsername`を設定したWindows Podでは、Windowsのユーザーアカウント管理方法により所有権が強制されません。
Windowsは、ローカルユーザーとグループアカウントをセキュリティアカウントマネージャー(SAM)と呼ばれるデータベースファイルに保存し、管理します。
各コンテナはSAMデータベースの独自のインスタンスを維持し、コンテナの実行中はホストはそのインスタンスを見ることができません。
Windowsコンテナは、OSのユーザーモード部分をホストから分離して実行するように設計されており、そのため仮想SAMデータベースを維持することになります。
そのため、ホスト上で動作するkubeletには、仮想化されたコンテナアカウントのホストファイル所有権を動的に設定する機能がありません。
ホストマシン上のファイルをコンテナと共有する場合は、`C:\`以外の独自のボリュームマウントに配置することをお勧めします。

デフォルトでは、投影ボリュームファイルの例に示されているように、投影されたファイルには次の所有権があります。
```powershell
PS C:\> Get-Acl C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt | Format-List

Path   : Microsoft.PowerShell.Core\FileSystem::C:\var\run\secrets\kubernetes.io\serviceaccount\..2021_08_31_22_22_18.318230061\ca.crt
Owner  : BUILTIN\Administrators
Group  : NT AUTHORITY\SYSTEM
Access : NT AUTHORITY\SYSTEM Allow  FullControl
         BUILTIN\Administrators Allow  FullControl
         BUILTIN\Users Allow  ReadAndExecute, Synchronize
Audit  :
Sddl   : O:BAG:SYD:AI(A;ID;FA;;;SY)(A;ID;FA;;;BA)(A;ID;0x1200a9;;;BU)
```
これは、`ContainerAdministrator`のようなすべての管理者ユーザーが読み取り、書き込み、および実行アクセス権を持ち、非管理者ユーザーが読み取りおよび実行アクセス権を持つことを意味します。

{{< note >}}
一般に、コンテナにホストへのアクセスを許可することは、潜在的なセキュリティの悪用への扉を開く可能性があるため、お勧めできません。

Windows Podの`SecurityContext`に`RunAsUser`を指定して作成すると、Podは`ContainerCreating`で永久に固まります。したがって、Windows PodでLinux専用の`RunAsUser`オプションを使用しないことをお勧めします。
{{< /note >}}
