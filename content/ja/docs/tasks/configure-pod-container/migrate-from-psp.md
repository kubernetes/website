---
title: PodSecurityPolicyからビルトインのPodセキュリティアドミッションコントローラーに移行する
content_type: task
min-kubernetes-server-version: v1.22
weight: 260
---

<!-- overview -->

このページはPodSecurityPolicyからビルトインのPodセキュリティアドミッションコントローラーに移行するための手順について説明します。
この手順は、`audit`モードや`warn`モードとdry-runを組み合わせて用いることで効率的に実施できますが、Podを変更するPSPを利用している場合には難しいものになるかも知れません。

## {{% heading "prerequisites" %}}

{{% version-check %}}

Kubernetesバージョン{{< skew currentVersion >}}以外が稼働している場合には、実際に走っているKubernetesのバージョンのドキュメントに切り替えて読んだほうが良いかもしれません。

このページは[Pod Security Admission](/docs/concepts/security/pod-security-admission/)の基本コンセプトに馴染みのある方を対象にしています。

<!-- body -->

## アプローチの全体像

PodSecurityPolicyをPod Security Admissionに移行する場合、とりうる戦略は複数存在します。
以下のステップは、実運用環境の停止やセキュリティギャップが生じるリスクを最小化することを目標とする場合の、1つの移行手順の例です。

<!-- Keep section header numbering in sync with this list. -->
0. Pod Security Admissionがあなたのユースケースに適合するかどうかを判断する
1. Namespaceの権限をレビューする
2. PodSecurityPolicyをシンプルにして標準化する
3. Namespaceを更新する
   1. 適切なPodのセキュリティ水準を特定する
   2. Podのセキュリティ水準を検証する
   3. Podのセキュリティ水準を強制する
   4. PodSecurityPolicyをバイパスする
4. Namespaceの作成プロセスをレビューする
5. PodSecurityPolicyを無効化する

## 0. Pod Security Admissionが正しい選択かどうかを判断する {#is-psa-right-for-you}

Pod Security Admissionは、複数のセキュリティ水準の標準的な集合をクラスター全体にわたって提供するもので、そのまま使うだけで最も一般的なセキュリティ要求を満たせるように設計されました。
しかし、PodSecurityPolicyよりも柔軟性に乏しい作りとなっています。
特に、以下の機能はPodSecurityPolicyではサポートされているものの、Pod Security Admissionではサポートされていません。

- **デフォルトのsecurity constraintsの設定** - Pod Security AdmissionはValidating Admission Controllerであるため、Podを検証する前にPodを変更しません。
あなたがPSPにおけるdefault security constraintsに依存している場合、ワークロードを修正したり、[Mutating Admission Webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)を使ったりして、Pod Securityの制約を満たせるような変更を実施することが必要です。
詳細は、後で述べる[PodSecurityPolicyをシンプルにして標準化する](#simplify-psps)を参照してください。
- **ポリシー定義のきめ細やかな制御** - Pod Security Admissionは[3つのセキュリティ水準](/docs/concepts/security/pod-security-standards/)のみをサポートします。
特定の制約条件についてさらなる制御が必要な場合には、ポリシーを強制するために[Validating Admission Webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)を使う必要があります。
- **sub-namespaceの粒度のポリシー** - PodSecurityPolicyは、個々のNamespace内部で異なるサービスアカウントやユーザーに対する異なるポリシーの紐付けが可能です。
この手法にはいくつもの落とし穴があるため推奨されませんが、どうしてもこの性質が必要な場合は、サードパーティーのWebhookをPSPの代わりに利用する必要があるでしょう。
ただし、Pod Security Admissionで[静的な適用除外設定](/docs/concepts/security/pod-security-admission/#exemptions)をしており、特定のユーザーや[RuntimeClass](/docs/concepts/containers/runtime-class/)を完全に適用除外とする必要がある場合には、サードパーティーWebhookは必要ないかもしれません。

あなたの全ての要求を満たせない場合であっても、Pod Security Admissionは他のポリシー強制メカニズムに対する _補完的な_ 仕組みとなるよう設計されており、他のアドミッションWebhookと併用する場合にも有益なフォールバック機構を提供します。

## 1. Namespaceの権限をレビューする {#review-namespace-permissions}

Pod Security Admissionは[Namespaceのラベル](/docs/concepts/security/pod-security-admission/#pod-security-admission-labels-for-namespaces)で制御します。
これはNamespaceを更新(もしくは作成やパッチ)できる人物が、同じNamespaceのPodセキュリティ標準を修正できることを意味しており、強固な制限ポリシーを迂回するために利用される可能性があります。
ここから先に進む前に、信頼済みの特権的なユーザーのみがNamespaceに関する権限を有することを確実にしておきましょう。

## 2. PodSecurityPolicyをシンプルにして標準化する 

この節では、Podを変更するPodSecurityPolicyの定義を減らしていき、Podセキュリティ標準のスコープ外のオプションを除去します。
ポリシーの修正前に、編集対象のオリジナルのPodSecurityPolicyについて、オフラインコピーを作成しておくことを推奨します。
複製したPSPの名前には異なる文字を追加しておくべきです。
(例えば名前の先頭に`0`を追加するなど)。
この段階ではKubernetesに新しいポリシーは作成しないでください。
ポリシーの作成については、この後の[更新したポリシーをロールアウトする](#psp-update-rollout)で説明します。

### 2.a Podの変更のみを行うフィールドを排除する {#eliminate-mutating-fields}

あるPodSecurityPolicyがPodを変更する場合、最後にPodSecurityPolicyをオフにした時点で、あなたのPodのセキュリティ水準の要件に適合しないPodが残ってしまう可能性があります。
こうした問題を回避するために、PSPを無効化する前に、PSPによるPodの変更処理を排除しておく必要があります。
残念なことに、PSPはPodを変更する設定項目(mutating field)とPodの検証を行う設定項目(validating field)をきれいに分離できていないため、簡単に移行できるわけではありません。

手始めに、Podの検証処理を損なわないような形で、Pod変更のみを行う設定項目を除去することができます。
PSPでPodの変更のみを行うフィールドは次のとおりです。
([PodSecurityPolicyとPodセキュリティ標準の対応関係](/docs/reference/access-authn-authz/psp-to-pod-security-standards/)にも一覧があります)。

- `.spec.defaultAllowPrivilegeEscalation`
- `.spec.runtimeClass.defaultRuntimeClassName`
- `.metadata.annotations['seccomp.security.alpha.kubernetes.io/defaultProfileName']`
- `.metadata.annotations['apparmor.security.beta.kubernetes.io/defaultProfileName']`
- `.spec.defaultAddCapabilities` - 技術的にはPodを変更する設定とPodを検証する設定を兼ねているため、Podを変更せずに同じ検証処理を行える`.spec.allowedCapabilities`にマージすべきです。

{{< caution >}}
これらのフィールドを除去することにより、必須のフィールドが設定されないワークロードが生じて、問題が発生する可能性があります。
[更新したポリシーをロールアウトする](#psp-update-rollout)を参照して変更を安全にロールアウトするための方法を確認することをお勧めします。
{{< /caution >}}

### 2.b. Podセキュリティ標準が対応できないオプションを排除する {#eliminate-non-standard-options}


PodSecurityPolicyにはPodセキュリティ標準でカバーできない設定項目があります。
このようなオプションを強制する必要がある場合、(この記事のスコープ外の話題ですが)、Pod Security Admissionを[アドミッションWebhook](/docs/reference/access-authn-authz/extensible-admission-controllers/)で補強する必要があるでしょう。

まず、Podセキュリティ標準がカバーしない、純粋にPodの検証のみを行う設定項目は除去できます。
この条件に該当するフィールドは以下のとおりです。
([PodSecurityPolicyとPodセキュリティ標準の対応関係](/docs/reference/access-authn-authz/psp-to-pod-security-standards/)には"no opinion"と表記されています)。

- `.spec.allowedHostPaths`
- `.spec.allowedFlexVolumes`
- `.spec.allowedCSIDrivers`
- `.spec.forbiddenSysctls`
- `.spec.runtimeClass`

以下のようなPOSIX/UNIXグループの制御に関するフィールドも除去できます。

{{< caution >}}
いずれかのフィールドが`MustRunAs`戦略を使っている場合、Podを変更している可能性があります！
これらのフィールドを除去することで、必須のグループ設定がなされていないワークロードが生じ、問題が発生する可能性があります。
[更新したポリシーをロールアウトする](#psp-update-rollout)を参照して、変更を安全にロールアウトするための方法を確認することをお勧めします。
{{< /caution >}}

- `.spec.runAsGroup`
- `.spec.supplementalGroups`
- `.spec.fsGroup`

その他のPod変更に関わるフィールドはPodセキュリティ標準を正確にサポートするためには必要なものであるため、ケースバイケースでの取り扱いが求められるでしょう。

- `.spec.requiredDropCapabilities` - Restrictedプロフィールでdrop `ALL`するために必要です。
- `.spec.seLinux` - (`MustRunAs`ルールがある場合のみPodを変更)Baseline/RestrictedでSELinux関連の要件を強制するために必要です。
- `.spec.runAsUser` - (`RunAsAny`ルールがある場合にはPodを変更しない)Restrictedプロフィールで`RunAsNonRoot`を強制するために必要です。
- `.spec.allowPrivilegeEscalation` - (`false`の場合にはPodを変更)Restrictedプロフィールで必要です。


### 2.c. 更新したPSPをロールアウトする {#psp-update-rollout}

ここからは、クラスターに対して更新したポリシーをロールアウトしていきます。
必須のフィールドが設定されないワークロードを発生させるような変更設定を除去した上で、注意深く進めてください。

更新する個別のPodSecurityPolicyについては

1. オリジナルのPSPが適用されている稼働中のPodを特定してください。
`kubernetes.io/psp`アノテーションを使うとよいでしょう。
例えば、kubectlを次のように実行します。
   
   ```sh
   PSP_NAME="original" #確認したいPSPの名称を入力します
   kubectl get pods --all-namespaces -o jsonpath="{range .items[?(@.metadata.annotations.kubernetes\.io\/psp=='$PSP_NAME')]}{.metadata.namespace} {.metadata.name}{'\n'}{end}"
   ```
2. オリジナルのPod specと稼働中のPodを比較して、PodSecurityPolicyがPodを変更したのかどうかを判定してください。
   [ワークロードリソース](/docs/concepts/workloads/controllers/)が作成したPodについては、Pod specをコントローラーリソースのPodTemplateと比較するとよいでしょう。
   変更箇所を特定したら、オリジナルのPodないしはPodTemplateが期待する設定内容となるように更新する必要があります。
   レビューが必要なフィールドは以下のとおりです。

   - `.metadata.annotations['container.apparmor.security.beta.kubernetes.io/*']` (* をコンテナ名で置き換えてください)
   - `.spec.runtimeClassName`
   - `.spec.securityContext.fsGroup`
   - `.spec.securityContext.seccompProfile`
   - `.spec.securityContext.seLinuxOptions`
   - `.spec.securityContext.supplementalGroups`
   - `.spec.containers[*]`ないしは`.spec.initContainers[*]`配下のコンテナのspecについては次の通り:
       - `.securityContext.allowPrivilegeEscalation`
       - `.securityContext.capabilities.add`
       - `.securityContext.capabilities.drop`
       - `.securityContext.readOnlyRootFilesystem`
       - `.securityContext.runAsGroup`
       - `.securityContext.runAsNonRoot`
       - `.securityContext.runAsUser`
       - `.securityContext.seccompProfile`
       - `.securityContext.seLinuxOptions`
3. 新しくPodSecurityPolicyを作成してください。
任意のRoleないしはClusterRoleに全てのPSPを`use`する権限を付与すれば、新しいPSPが使われるようになる代わりに、既存のPod変更型のPSPは使われなくなります。
4. 認可メカニズムを更新し、新しいPSPへのアクセス権限を付与してください。
これはRBACの更新を意味しており、オリジナルのPSPに対して`use`権限があるRoleやClusterRoleを更新し、新しいPSPに対する`use`権限を追加付与することにほかなりません。
5. 設定を検証しましょう。
多少の猶予期間を設けて、手順1のコマンドに戻り、まだオリジナルのPSPを使っているPodがあるかどうかを見極めましょう。
新規のポリシーのロールアウト後、ポリシーの検証前にPodの再作成が必要となることに注意してください。
6. (オプション)オリジナルのPSPがすでに使われていないことがはっきりしたら、削除しておいてもよいでしょう。

## 3. Namespaceを更新する {#update-namespaces}

以下の手順はクラスターの全てのNamespaceで実施する必要があります。
この手順に示されている`$NAMESPACE`変数を使ったコマンドは、更新対象のNamespaceを参照するものです。

### 3.a. 適切なPodのセキュリティ水準を特定する {#identify-appropriate-level}

[Podセキュリティ標準(Pod Security Standards, PSS)](/docs/concepts/security/pod-security-standards/)のレビューを始めます。
PSSには3つの異なるセキュリティ水準があることに慣れておきましょう。

NamespaceにおけるPodのセキュリティ水準を決定する方法はいくつかあります。

1. **Namespaceのセキュリティ要求を満たすように決める** - 対象のNamespaceで求められるアクセスレベルについて熟知しているのであれば、新しいクラスターに対して実施するのと同様のやり方で、Namespaceの要件に基づいた適切なアクセス水準を選べるはずです。
2. **既存のPodSecurityPolicyに基づいて決める**  - [PodSecurityPolicyとPodセキュリティ標準の対応関係](/docs/reference/access-authn-authz/psp-to-pod-security-standards/)のレファレンスを用いることで、それぞれのPSPをPodセキュリティ標準の各セキュリティ水準に対応させることができます。
PSPがPodセキュリティ標準に対応しない場合は、あえて制限の多いレベルにするか、それともPSPと同等程度に許容的なセキュリティ水準に留めておくか、あなたが決定する必要があるかも知れません。
3. **既存のPodを見て決める** - 下記の[Podのセキュリティ水準を検証する](#verify-pss-level)の手順を用いると、BaselineおよびRestrictedレベルの両方について、既存のワークロードに対して十分許容的なものかどうかをテストした上で、妥当で最小特権なセキュリティ水準を選択することが可能です。


{{< caution >}}
上述の選択肢2と3は _既存の_ Podに基づいて実施するものであるため、現時点で稼働していないワークロードを取りこぼす可能性があります。
例えば、CronJobやレプリカ数0のワークロード、ロールアウトされていないその他のワークロードなどがこうしたものに該当します。
{{< /caution >}}

### 3.b. Podのセキュリティ水準を検証する {#verify-pss-level}

Namespaceに対するPodのセキュリティ水準を選択したら(ないしは複数検討したら)、まずはテストにかけてみると良いでしょう(Privilegedレベルを用いる場合にはこのステップを省略できます)。
Podセキュリティにはプロファイルの安全なロールアウトを支援するいくつかのツールがあります。

まず紹介するのは、ポリシーのdry-runです。
新たなポリシーを実際に適用せずに、適用予定のポリシーに対してNamespaceで現在稼働しているPodを評価することができます。

```sh
# $LEVELはdry-run対象のセキュリティ水準。"baseline"か"restricted"のいずれかの値をとる。
kubectl label --dry-run=server --overwrite ns $NAMESPACE pod-security.kubernetes.io/enforce=$LEVEL
```
このコマンドは、 _現存する_ Podがセキュリティ水準の要求に適合しなかった場合、警告を返します。

次の選択肢であるauditモードは、稼働していないワークロードを捕捉する上で有用です。
auditモードは(enforcingモードとは対象的に)、Podがポリシーを侵害した場合、その実行を禁止せずに監査ログに記録するため、いくらかの猶予期間の後でログをレビューすることができます。
warningモードはこれと同じような動作をしますが、ユーザーに対して即座に警告を返します。
Namespaceの監査レベルは次のコマンドで設定できます。

```sh
kubectl label --overwrite ns $NAMESPACE pod-security.kubernetes.io/audit=$LEVEL
```

上記いずれかのアプローチが予期せぬポリシー侵害をもたらす場合、侵害的なワークロードがポリシー要求を充足するように更新するか、NamespaceのPodのセキュリティ水準を引き下げる必要があります。

### 3.c. Podのセキュリティ水準を強制する {#enforce-pod-security-level}

選択済みのセキュリティ水準をNamespaceに対して安全に強制できることの確証がもてたら、セキュリティ水準を強制するためにNamespaceを更新します。

```sh
kubectl label --overwrite ns $NAMESPACE pod-security.kubernetes.io/enforce=$LEVEL
```

### 3.d. PodSecurityPolicyを迂回する {#bypass-psp}

ここまでくれば、{{< example file="policy/privileged-psp.yaml" >}}特権PSP{{< /example >}}をNamespaceの全てのServiceAccountに紐づけて、NamespaceレベルでPodSecurityPolicyを迂回できます。

```sh
kubectl apply -f privileged-psp.yaml
kubectl create clusterrole privileged-psp --verb use --resource podsecuritypolicies.policy --resource-name privileged

# Namespace単位での無効化
kubectl create -n $NAMESPACE rolebinding disable-psp --clusterrole privileged-psp --group system:serviceaccounts:$NAMESPACE
```

特権PSPはPodを変更しません。
PSPのアドミッションコントローラーはPodを変更しないPSPを優先的に利用するため、PodがPodSecurityPolicyによって変更されたり制限されたりしないことが保証できます。

このようにNamespace単位でPodSecurityPolicyを無効化することの利点としては、問題が発生した際にRoleBindingを削除するだけで変更を簡単にロールバックできることです。
もちろん、既存のPodSecurityPolicyが残っていることは確認しておきましょう。

```sh
# PodSecurityPolicyの無効化を一旦やめる
kubectl delete -n $NAMESPACE rolebinding disable-psp
```


## 4. Namespace作成プロセスをレビューする {#review-namespace-creation-process}

この時点で、Pod Security Admissionを強制するための既存Namespaceの更新が完了しています。
新たなNamespaceに対して適切なPodセキュリティプロファイルを確実に適用できるよう、新規にNamespaceを作るための手順とポリシーについても必ず更新しておくべきです。

ラベルのないNamespaceに対するデフォルトの強制、監査、警告レベルを適用するために、Pod Securityアドミッションコントローラーを静的に定義することもできます。
詳しくは[アドミッションコントローラーを設定する](/docs/tasks/configure-pod-container/enforce-standards-admission-controller/#configure-the-admission-controller)を読んでください。

## 5. PodSecurityPolicyを無効化する {#disable-psps}

PodSecurityPolicyを無効化する準備が整いました。
これを実施するには、APIサーバーのアドミッションコントローラー設定を修正する必要があります。
([アドミッションコントローラーを無効化する方法](/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-off-an-admission-controller))

PodSecurityPolicyアドミッションコントローラーが無効化されていることを確認するには、PodSecurityPolicyへのアクセス権限を有しないユーザーになりすましたアクセスや、APIサーバーのログを検証するなどといった、手動のテストを実施するとよいでしょう。
また、APIサーバーの起動時のログには、ロード済みのアドミッションコントローラーの一覧が表示されます。

```
I0218 00:59:44.903329      13 plugins.go:158] Loaded 16 mutating admission controller(s) successfully in the following order: NamespaceLifecycle,LimitRanger,ServiceAccount,NodeRestriction,TaintNodesByCondition,Priority,DefaultTolerationSeconds,ExtendedResourceToleration,PersistentVolumeLabel,DefaultStorageClass,StorageObjectInUseProtection,RuntimeClass,DefaultIngressClass,MutatingAdmissionWebhook.
I0218 00:59:44.903350      13 plugins.go:161] Loaded 14 validating admission controller(s) successfully in the following order: LimitRanger,ServiceAccount,PodSecurity,Priority,PersistentVolumeClaimResize,RuntimeClass,CertificateApproval,CertificateSigning,CertificateSubjectRestriction,DenyServiceExternalIPs,ValidatingAdmissionWebhook,ResourceQuota.
```

(Validating Admission Controllerの中に)`PodSecurity`が確認できるはずです。
また、いずれの行もPodSecurityPolicyを含まないはずです。

PSPアドミッションコントローラーを無効化したら、(また、ロールバックが必要ないと判断するのに十分な時間が経過したら)、PodSecurityPolicyと関連するRoleやClusterRole、ClusterRoleBindingを削除してもよいでしょう。
(他の無関係な権限付与に使われていないことを確認しておいてください)。
