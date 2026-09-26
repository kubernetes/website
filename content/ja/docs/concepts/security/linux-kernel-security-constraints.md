---
title: Podとコンテナに対するLinuxカーネルのセキュリティ制約
description: Podとコンテナを強化するために使用できるLinuxカーネルのセキュリティモジュールと制約の概要。
content_type: concept
weight: 100
---

<!-- overview -->

このページでは、Kubernetesのワークロードで使用できる、Linuxカーネルに組み込まれたいくつかのセキュリティ機能について説明します。
これらの機能をPodとコンテナに適用する方法については、[Podとコンテナにセキュリティコンテキストを設定する](/docs/tasks/configure-pod-container/security-context/)を参照してください。
LinuxとKubernetesワークロードの基本については、すでに理解している必要があります。

<!-- body -->

## root権限なしでワークロードを実行する {#run-without-root}

Kubernetesでワークロードをデプロイする場合は、Podの仕様を使用して、そのワークロードがノード上でrootユーザーとして実行されないように制限します。
Podの`securityContext`を使用すると、Pod内のプロセスに対して特定のLinuxユーザーとグループを定義し、コンテナがrootユーザーとして実行されないように明示的に制限できます。
Podマニフェストにこれらの値を設定すると、コンテナイメージ内の同様の値よりも優先されます。
これは、自分が所有していないイメージを実行する場合に特に便利です。

{{< caution >}}
ワークロードに割り当てるユーザーまたはグループに、アプリケーションが正しく機能するために必要な権限があることを確認してください。
正しい権限を持たないユーザーまたはグループに変更すると、ファイルアクセスの問題や操作の失敗につながる可能性があります。
{{< /caution >}}

このページのカーネルセキュリティ機能を設定すると、クラスター内のプロセスが実行できる操作を細かく制御できますが、これらの設定を大規模に管理するのは困難な場合があります。
コンテナを非rootとして実行するか、root権限が必要な場合はユーザー名前空間で実行すると、設定したカーネルセキュリティ機能を強制する必要が生じる可能性を減らせます。

## Linuxカーネルのセキュリティ機能 {#linux-security-features}

Kubernetesでは、隔離性を強化し、コンテナ化されたワークロードを強化するために、Linuxカーネルの機能を設定して使用できます。
一般的な機能には、次のものがあります。

* **Secure computing mode (seccomp)**: プロセスが実行できるシステムコールをフィルターします
* **AppArmor**: 個々のプログラムのアクセス権限を制限します
* **Security Enhanced Linux (SELinux)**: より管理しやすいセキュリティポリシーの適用のために、オブジェクトにセキュリティラベルを割り当てます

これらの機能のいずれかの設定を構成するには、ノードに選択したオペレーティングシステムにおいて、その機能がカーネルで有効になっている必要があります。
たとえば、Ubuntu 7.10以降ではAppArmorがデフォルトで有効です。
使用しているOSで特定の機能が有効になっているかどうかを確認するには、OSのドキュメントを参照してください。

Podの仕様の`securityContext`フィールドを使用して、それらのプロセスに適用する制約を定義します。
`securityContext`フィールドは、特定のLinuxケーパビリティや、UIDとGIDを使用したファイルアクセス権限など、他のセキュリティ設定もサポートしています。
詳細については、[Podとコンテナにセキュリティコンテキストを設定する](/docs/tasks/configure-pod-container/security-context/)を参照してください。

### seccomp {#seccomp}

ワークロードのなかには、ノードのホストマシン上でrootユーザーとして特定の操作を実行するための権限が必要なものがあります。
Linuxでは、利用可能な権限を*ケーパビリティ*に分割して分類します。
これにより、プロセスはすべての権限を付与されることなく、特定の操作を実行するために必要な権限を得ることができます。
各ケーパビリティには、プロセスが実行できるシステムコール(syscall)のセットがあります。
seccompを使用すると、これらの個々のsyscallを制限できます。<!--Copied from seccomp tutorial-->
これはプロセスの権限をサンドボックス化し、ユーザー空間からカーネルに対して実行できる呼び出しを制限するために使用できます。<!--End copy-->

Kubernetesでは、各ノードで*コンテナランタイム*を使用してコンテナを実行します。
ランタイムの例には、CRI-O、Docker、containerdがあります。
各ランタイムは、デフォルトではLinuxケーパビリティの一部のみを許可します。
seccompプロファイルを使用すると、許可されるsyscallを個別にさらに制限できます。
コンテナランタイムには通常、デフォルトのseccompプロファイルが含まれています。<!--Copied from seccomp tutorial-->
Kubernetesでは、ノードに読み込まれたseccompプロファイルをPodとコンテナに自動的に適用できます。<!--End copy-->

{{<note>}}
Kubernetesには、Podとコンテナ向けの`allowPrivilegeEscalation`設定もあります。
これを`false`に設定すると、プロセスが新しいケーパビリティを取得することを防ぎ、非特権ユーザーが適用済みのseccompプロファイルをより寛容なプロファイルに変更することを制限します。
{{</note>}}

Kubernetesでseccompを実装する方法については、[seccompでコンテナのシステムコールを制限する](/ja/docs/tutorials/security/seccomp/)または[Seccompのノードリファレンス](/docs/reference/node/seccomp/)を参照してください。

seccompの詳細については、Linuxカーネルドキュメントの[Seccomp BPF](https://www.kernel.org/doc/html/latest/userspace-api/seccomp_filter.html)を参照してください。

#### seccompに関する考慮事項 {#seccomp-considerations}

seccompは低レベルのセキュリティ設定であり、Linux syscallを細かく制御する必要がある場合にのみ自分で設定すべきです。
seccompの使用には、特に大規模な環境では次のリスクがあります。

* アプリケーションの更新時に設定が壊れる可能性があります。
* 攻撃者は、許可されたsyscallを使用して脆弱性を悪用できる可能性があります。
* 個々のアプリケーションのプロファイル管理は、規模が大きくなると困難になります。

**推奨事項**: コンテナランタイムに同梱されているデフォルトのseccompプロファイルを使用してください。
より分離された環境が必要な場合は、gVisorなどのサンドボックスの使用を検討してください。
サンドボックスは、カスタムseccompプロファイルに伴う前述のリスクを解決しますが、ノード上でより多くのコンピュートリソースを必要とし、GPUやその他の特殊なハードウェアとの互換性の問題が発生する可能性があります。

### AppArmorとSELinux: ポリシーベースの強制アクセス制御 {#policy-based-mac}

AppArmorやSELinuxなどのLinuxのポリシーベースの強制アクセス制御(MAC)メカニズムを使用して、Kubernetesのワークロードを強化できます。

#### AppArmor {#apparmor}

<!-- Original text from https://kubernetes.io/docs/tutorials/security/apparmor/ -->

[AppArmor](https://apparmor.net/)はLinuxカーネルのセキュリティモジュールであり、標準のLinuxユーザーとグループに基づく権限を補完し、プログラムを制限されたリソースのセットに閉じ込めます。
AppArmorは任意のアプリケーションに対して設定でき、潜在的な攻撃対象領域を減らし、より強力な多層防御を提供します。
AppArmorは、Linuxケーパビリティ、ネットワークアクセス、ファイル権限など、特定のプログラムまたはコンテナが必要とするアクセスを許可するように調整されたプロファイルを通じて設定されます。
各プロファイルは、許可されていないリソースへのアクセスをブロックするenforcingモード、または違反の報告のみを行うcomplainモードのいずれかで実行できます。

AppArmorは、コンテナに許可される操作を制限することで、より安全なデプロイを実行するのに役立ちます。
また、システムログを通じてより優れた監査を提供できます。
使用するコンテナランタイムにはデフォルトのAppArmorプロファイルが同梱されている場合もあり、カスタムプロファイルを使用することもできます。

KubernetesでAppArmorを使用する方法については、[AppArmdiorでコンテナのリソースアクセスを制限する](/docs/tutorials/security/apparmor/)を参照してください。

#### SELinux {#selinux}

SELinuxはLinuxカーネルのセキュリティモジュールであり、プロセスなどの特定の*サブジェクト*がシステム上のファイルに対して持つアクセスを制限できます。
特定のSELinuxラベルを持つサブジェクトに適用されるセキュリティポリシーを定義します。
SELinuxラベルを持つプロセスがファイルにアクセスしようとすると、SELinuxサーバーはそのプロセスのセキュリティポリシーがアクセスを許可しているかどうかを確認し、認可の判断を行います。

Kubernetesでは、マニフェストの`securityContext`フィールドにSELinuxラベルを設定できます。
指定されたラベルは、それらのプロセスに割り当てられます。
それらのラベルに影響するセキュリティポリシーを設定している場合、ホストOSのカーネルがこれらのポリシーを適用します。

KubernetesでSELinuxを使用する方法については、[コンテナにSELinuxラベルを割り当てる](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)を参照してください。

#### AppArmorとSELinuxの違い {#apparmor-selinux-diff}

Linuxノード上のオペレーティングシステムには、通常AppArmorまたはSELinuxのどちらか一方が含まれています。
どちらのメカニズムも同様の保護を提供しますが、次のような違いがあります。

* **設定**: AppArmorはプロファイルを使用してリソースへのアクセスを定義します。
  SELinuxは特定のラベルに適用されるポリシーを使用します。
* **ポリシーの適用**: AppArmorでは、ファイルパスを使用してリソースを定義します。
  SELinuxでは、リソースを識別するためにリソースのインデックスノード(inode)を使用します。

### 機能の概要 {#summary}

次の表では、各セキュリティ制御のユースケースと範囲について説明します。
これらの制御はすべて組み合わせて使用し、より強化されたシステムを構築できます。

<table>
  <caption>Linuxカーネルのセキュリティ機能の概要</caption>
  <thead>
    <tr>
      <th>セキュリティ機能</th>
      <th>説明</th>
      <th>使用方法</th>
      <th>例</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>seccomp</td>
      <td>ユーザー空間内の個々のカーネル呼び出しを制限します。
      制限されたsyscallを使用する脆弱性によってシステムが侵害される可能性を減らします。</td>
      <td>Podまたはコンテナ仕様で読み込み済みのseccompプロファイルを指定し、その制約をPod内のプロセスに適用します。</td>
      <td><a href="https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-0185">CVE-2022-0185</a>で使用された<code>unshare</code> syscallを拒否します。</td>
    </tr>
    <tr>
      <td>AppArmor</td>
      <td>特定のリソースへのプログラムのアクセスを制限します。
      プログラムの攻撃対象領域を減らします。
      監査ログを改善します。</td>
      <td>コンテナ仕様で読み込み済みのAppArmorプロファイルを指定します。</td>
      <td>読み取り専用のプログラムがシステム内の任意のファイルパスに書き込むことを制限します。</td>
    </tr>
    <tr>
      <td>SELinux</td>
      <td>ラベルとセキュリティポリシーを使用して、ファイル、アプリケーション、ポート、プロセスなどのリソースへのアクセスを制限します。</td>
      <td>特定のラベルに対するアクセス制限を指定します。
      プロセスにそれらのラベルを付与し、そのラベルに関連するアクセス制限を適用します。</td>
      <td>コンテナが自身のファイルシステム外のファイルにアクセスすることを制限します。</td>
    </tr>
  </tbody>
</table>

{{< note >}}
AppArmorやSELinuxのようなメカニズムは、コンテナの範囲を超える保護を提供できます。
たとえば、SELinuxを使用して[CVE-2019-5736](https://access.redhat.com/security/cve/cve-2019-5736)の緩和に役立てることができます。
{{< /note >}}

### カスタム設定の管理に関する考慮事項 {#considerations-custom-configurations}

seccomp、AppArmor、SELinuxには通常、基本的な保護を提供するデフォルト設定があります。
ワークロードの要件を満たすカスタムプロファイルやポリシーを作成することもできます。
これらのカスタム設定を大規模に管理および配布することは、特に3つの機能すべてを一緒に使用する場合には困難なことがあります。
これらの設定を大規模に管理しやすくするには、[Kubernetes Security Profiles Operator](https://github.com/kubernetes-sigs/security-profiles-operator)のようなツールを使用してください。

## カーネルレベルのセキュリティ機能と特権コンテナ {#kernel-security-features-privileged-containers}

Kubernetesでは、一部の信頼されたコンテナを*特権*モードで実行するように指定できます。
Pod内の任意のコンテナは、通常はアクセスできないオペレーティングシステムの管理機能を使用するために、特権モードで実行できます。
これはWindowsとLinuxの両方で利用できます。

特権コンテナは、ワークロードで使用する可能性のあるLinuxカーネルの制約の一部を、次のように明示的に上書きします。

* **seccomp**: 特権コンテナは`Unconfined` seccompプロファイルとして実行され、マニフェストで指定したseccompプロファイルを上書きします。
* **AppArmor**: 特権コンテナは、適用されたAppArmorプロファイルを無視します。
* **SELinux**: 特権コンテナは`unconfined_t`ドメインとして実行されます。

### 特権コンテナ {#privileged-containers}

<!-- Content from https://kubernetes.io/docs/concepts/workloads/pods/#privileged-mode-for-containers  -->

コンテナの[`securityContext`](/docs/tasks/configure-pod-container/security-context/)フィールドに`privileged: true`フィールドを設定すると、Pod内の任意のコンテナで*特権モード*を有効にできます。
特権コンテナは、適用されたseccompプロファイル、AppArmorプロファイル、SELinux制約など、他の多くの強化設定を上書きまたは取り消します。
特権コンテナには、不要なものを含むすべてのLinuxケーパビリティが付与されます。
たとえば、特権コンテナ内のrootユーザーは、ノード上で`CAP_SYS_ADMIN`や`CAP_NET_ADMIN`ケーパビリティを使用できる場合があり、ランタイムのseccomp設定やその他の制限をバイパスできます。

ほとんどの場合、特権コンテナの使用は避けるべきです。
代わりに、`securityContext`フィールドの`capabilities`フィールドを使用して、コンテナに必要な特定のケーパビリティを付与してください。
securityContextでは付与できないケーパビリティがある場合にのみ、特権モードを使用してください。
これは、ネットワークスタックの操作やハードウェアデバイスへのアクセスなど、オペレーティングシステムの管理機能を使用したいコンテナに役立ちます。

Kubernetesバージョン1.26以降では、Podの仕様のセキュリティコンテキストで`windowsOptions.hostProcess`フラグを設定することで、Windowsコンテナも同様の特権モードで実行できます。
詳細と手順については、[Windows HostProcess Podを作成する](/docs/tasks/configure-pod-container/create-hostprocess-pod/)を参照してください。

## 推奨事項とベストプラクティス {#recommendations-best-practices}

* カーネルレベルのセキュリティケーパビリティを設定する前に、ネットワークレベルの分離の実装を検討すべきです。
  詳細については、[セキュリティチェックリスト](/docs/concepts/security/security-checklist/#network-security)を参照してください。
* 必要がない限り、Podマニフェストで特定のユーザーIDとグループIDを設定し、`runAsNonRoot: true`を指定して、Linuxワークロードを非rootとして実行してください。

さらに、Podマニフェストで`hostUsers: false`を設定することで、ユーザー名前空間内でワークロードを実行できます。
これにより、コンテナをユーザー名前空間内ではrootユーザーとして実行し、ノード上のホスト名前空間では非rootユーザーとして実行できます。
これはまだ開発の初期段階にあり、必要なレベルのサポートが得られない可能性があります。
手順については、[Podでユーザー名前空間を使用する](/docs/tasks/configure-pod-container/user-namespaces/)を参照してください。

## {{% heading "whatsnext" %}}

* [AppArmorの使用方法を学ぶ](/docs/tutorials/security/apparmor/)
* [seccompの使用方法を学ぶ](/docs/tutorials/security/seccomp/)
* [SELinuxの使用方法を学ぶ](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)
* [Seccompのノードリファレンス](/docs/reference/node/seccomp/)
