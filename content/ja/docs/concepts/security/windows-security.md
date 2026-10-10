---
title: Windowsノードのセキュリティ
content_type: concept
weight: 40
---

<!-- overview -->

このページでは、Windowsオペレーティングシステムに特有のセキュリティ上の考慮事項とベストプラクティスについて説明します。

<!-- body -->

Windowsでは、Secretデータがノードのローカルストレージに平文で書き込まれます(Linuxのtmpfs、インメモリファイルシステムとは異なります)。
クラスターオペレーターは、次の両方の追加対策を講じる必要があります:

1. ファイルACLを使用して、Secretのファイル配置場所を保護する。
2. [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server)を使用して、ボリュームレベルの暗号化を適用する。

## コンテナユーザー

[RunAsUsername](/docs/tasks/configure-pod-container/configure-runasusername)は、WindowsのPodまたはコンテナに対して、特定のユーザーとしてコンテナプロセスを実行するために指定できます。
これは、おおよそ[RunAsUser](/docs/concepts/security/pod-security-policy/#users-and-groups)と同等です。

Windowsコンテナには、ContainerUserとContainerAdministratorという2つのデフォルトのユーザーアカウントが用意されています。
これら2つのユーザーアカウントの違いについては、Microsoftの _Secure Windows containers_ ドキュメント内の[ContainerAdminとContainerUserのユーザーアカウントを使うタイミング](https://docs.microsoft.com/ja-jp/virtualization/windowscontainers/manage-containers/container-security#when-to-use-containeradmin-and-containeruser-user-accounts)に記載されています。

ローカルユーザーは、コンテナのビルドプロセス中にコンテナイメージに追加できます。

{{< note >}}

* [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver)ベースのイメージは、デフォルトで`ContainerUser`として実行されます
* [Server Core](https://hub.docker.com/_/microsoft-windows-servercore)ベースのイメージは、デフォルトで`ContainerAdministrator`として実行されます

{{< /note >}}

Windowsコンテナは、[グループ管理サービスアカウント](/ja/docs/tasks/configure-pod-container/configure-gmsa/)を利用することで、Active DirectoryのIDとして実行することもできます

## Podレベルのセキュリティ分離

Linux固有のPodセキュリティコンテキスト機構(SELinux、AppArmor、Seccomp、カスタムPOSIXケーパビリティなど)は、Windowsノードではサポートされていません。
特権コンテナは、Windowsでは[サポートされていません](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext)。
代わりに、Windowsでは[HostProcessコンテナ](/docs/tasks/configure-pod-container/create-hostprocess-pod)を使用することで、Linuxの特権コンテナが実行する多くのタスクを実行できます。
