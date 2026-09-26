---
layout: blog
title: 'Kubernetes 1.31: Fine-grained SupplementalGroups control'
date: 2024-08-22
slug: fine-grained-supplementalgroups-control
author: >
  Shingo Omura (Woven By Toyota)
translator: >
  Shingo Omura (Woven By Toyota)
---

この記事ではKubernetes 1.31の新機能である、Pod内のコンテナにおける補助グループ制御の改善機能について説明します。

## 動機: コンテナイメージ内の`/etc/group`に定義される暗黙的なグループ情報

この挙動は多くのKubernetesクラスターのユーザー、管理者にとってあまり知られていないかもしれませんが、Kubernetesは、デフォルトでは、Podで定義された情報に加えて、コンテナイメージ内の`/etc/group`のグループ情報を _マージ_ します。

例を見てみましょう。このPodはsecurityContextで`runAsUser=1000`、`runAsGroup=3000`、`supplementalGroups=4000`を指定しています。

{{% code_sample file="implicit-groups.yaml" %}}

`ctr`コンテナで`id`コマンドを実行すると何が出力されるでしょうか？

```console
# Podを作成してみましょう。
$ kubectl apply -f https://k8s.io/blog/2024-08-22-Fine-grained-SupplementalGroups-control/implicit-groups.yaml

# Podのコンテナが実行されていることを確認します。
$ kubectl get pod implicit-groups

# idコマンドを確認します。
$ kubectl exec implicit-groups -- id
```

出力は次のようになるでしょう。

```none
uid=1000 gid=3000 groups=3000,4000,50000
```

Podマニフェストには`50000`は一切定義されていないにもかかわらず、補助グループ(`groups`フィールド)に含まれているグループID`50000`は一体どこから来るのでしょうか? 答えはコンテナイメージの`/etc/group`ファイルです。

コンテナイメージの`/etc/group`の内容が下記のようになっていることが確認できるでしょう。

```console
$ kubectl exec implicit-groups -- cat /etc/group
...
user-defined-in-image:x:1000:
group-defined-in-image:x:50000:user-defined-in-image
```

なるほど！コンテナのプライマリユーザーであるユーザー(`1000`)がグループ(`50000`)に属していることが最後のエントリから確認出来ました。

このように、コンテナイメージ上の`/etc/group`で定義される、コンテナのプライマリユーザーのグループ情報は、Podからの情報に加えて _暗黙的にマージ_ されます。ただし、この挙動は、現在のCRI実装がDockerから引き継いだ設計上の決定であり、コミュニティはこれまでこの挙動について再検討することはほとんどありませんでした。

### 何が悪いのか？

コンテナイメージの`/etc/group`から _暗黙的にマージ_ されるグループ情報は、特にボリュームアクセスを行う際に、セキュリティ上の懸念を引き起こすことがあります(詳細は[kubernetes/kubernetes#112879](https://issue.k8s.io/112879)を参照してください)。なぜなら、Linuxにおいて、ファイルパーミッションはuid/gidで制御されているからです。更に悪いことに、`/etc/group`に由来する暗黙的なgidは、マニフェストにグループ情報の手がかりが無いため、ポリシーエンジン等でチェック・検知をすることが出来ません。これはKubernetesセキュリティの観点からも懸念となります。

## PodにおけるFine-grained(きめ細かい) SupplementalGroups control: `SupplementaryGroupsPolicy`

この課題を解決するために、Kubernetes 1.31はPodの`.spec.securityContext`に、新しく`supplementalGroupsPolicy`フィールドを追加します。

このフィールドは、Pod内のコンテナプロセスに付与される補助グループを決定するを方法を制御できるようにします。有効なポリシーは次の2つです。

* _Merge_: `/etc/group`で定義されている、コンテナのプライマリユーザーが所属するグループ情報をマージします。指定されていない場合、このポリシーがデフォルトです(後方互換性を考慮して既存の挙動と同様)。

* _Strict_: `fsGroup`、`supplementalGroups`、`runAsGroup`フィールドで指定されたグループIDのみ補助グループに指定されます。つまり、`/etc/group`で定義された、コンテナのプライマリユーザーのグループ情報はマージされません。

では、どのように`Strict`ポリシーが動作するか見てみましょう。

{{% code_sample file="strict-supplementalgroups-policy.yaml" %}}

```console
# Podを作成してみましょう。
$ kubectl apply -f https://k8s.io/blog/2024-08-22-Fine-grained-SupplementalGroups-control/strict-supplementalgroups-policy.yaml

# Podのコンテナが実行されていることを確認します。
$ kubectl get pod strict-supplementalgroups-policy

# プロセスのユーザー、グループ情報を確認します。
kubectl exec -it strict-supplementalgroups-policy -- id
```

出力はこのようになります。

```none
uid=1000 gid=3000 groups=3000,4000
```

`Strict`ポリシーによってグループ`50000`が`groups`から除外されているのが確認できました！

このように、確実に`supplementalGroupsPolicy: Strict`を設定する(ポリシーエンジン等によって強制する)ことで、暗黙的な補助グループを回避することが可能になります。

{{<note>}}
このフィールドの値を強制するだけでは不十分な場合もあります。なぜなら、プロセスが自分自身のユーザー、グループ情報を変更できる権限/ケーパビリティを持っている場合があるからです。詳細は次のセクションを参照してください。
{{</note>}}

## Podステータスにおける付与されたユーザー、グループ情報の確認

この機能は、Podの`status.containerStatuses[].user.linux`フィールドでコンテナの最初のプロセスに付与されたユーザー、グループ情報を公開しています。暗黙的なグループIDが付与されているかどうかを確認するのに便利でしょう。

```yaml
...
status:
  containerStatuses:
  - name: ctr
    user:
      linux:
        gid: 3000
        supplementalGroups:
        - 3000
        - 4000
        uid: 1000
...
```

{{<note>}}
`status.containerStatuses[].user.linux`フィールドで公開されているユーザー、グループ情報は、コンテナの最初のプロセスに、_最初に付与された_ 情報であることに注意してください。
もしそのプロセスが、自身のユーザー、グループ情報を変更できるシステムコール(例えば [`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html),
[`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html),
[`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html)等)を実行する権限を持っている場合、プロセス自身で動的に変更が可能なためです。
つまり、実際にプロセスに付与されているユーザー、グループ情報は動的に変化します。
{{</note>}}

## この機能を利用するには

`supplementalGroupsPolicy`フィールドを有効化するには、下記のコンポーネントを利用する必要があります。

- Kubernetes: v1.31以降、かつ、`SupplementalGroupsPolicy`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/)が有効化されていること。v1.31現在、このフィーチャーゲートはアルファです。
- CRI実装:
  - containerd: v2.0以降
  - CRI-O: v1.31以降

ノードの`.status.features.supplementalGroupsPolicy`フィールドでこの機能が利用可能かどうか確認出来ます。

```yaml
apiVersion: v1
kind: Node
...
status:
  features:
    supplementalGroupsPolicy: true
```

## 将来の展望

Kubernetes SIG Nodeは、この機能が将来的なKubernetesのリリースでベータ版に昇格し、最終的には一般提供(GA)されることを望んでおり、期待しています。そうなれば、ユーザーはもはや機能ゲートを手動で有効にする必要がなくなります。

`supplementalGroupsPolicy`が指定されていない場合は、後方互換性のために`Merge`ポリシーが適用されます。

## より学ぶには？

<!-- https://github.com/kubernetes/website/pull/46920 -->

- [Podとコンテナにセキュリティコンテキストを設定する](/ja/docs/tasks/configure-pod-container/security-context/)(`supplementalGroupsPolicy`の詳細)
- [KEP-3619: Fine-grained SupplementalGroups control](https://github.com/kubernetes/enhancements/issues/3619)

## 参加するには？

この機能はSIG Nodeコミュニティによって推進されています。コミュニティに参加して、上記の機能やそれ以外のアイデアやフィードバックを共有してください。皆さんからのご意見をお待ちしています！
