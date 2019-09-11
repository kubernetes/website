---
reviewers:
title: Pod Preset
content_template: templates/concept
weight: 50
---

{{% capture overview %}}
このページではPodPresetについて概観します。PodPresetは、Podの作成時にそのPodに対して、Secret、Volume、VolumeMountや環境変数など、特定の情報を注入するためのオブジェクトです。  
{{% /capture %}}


{{% capture body %}}
## PodPresetを理解する

`PodPreset`はPodの作成時に追加のランタイム要求を注入するためのAPIリソースです。
ユーザーはPodPresetを適用する対象のPodを指定するために、[ラベルセレクター](/docs/concepts/overview/working-with-objects/labels/#label-selectors)を使用します。

PodPresetの使用により、Podテンプレートの作者はPodにおいて、全ての情報を明示的に指定する必要がなくなります。  
この方法により、特定のServiceを使っているPodテンプレートの作者は、そのServiceについて全ての詳細を知る必要がなくなります。

PodPresetの内部についてのさらなる情報は、[PodPresetのデザインプロポーザル](https://git.k8s.io/community/contributors/design-proposals/service-catalog/pod-preset.md)を参照してください。

## PodPresetはどのように動くか

Kubernetesは`PodPreset`に対する管理用コントローラーを提供し、これが有効になっている時、コントローラーはリクエストされたPod作成要求に対してPodPresetを適用します。  
Pod作成要求が発生した時、Kubernetesシステムは下記の処理を行います。

1. 使用可能な全ての`PodPreset`を取得する。
1. それらの`PodPreset`のラベルセレクターが、作成されたPod上のラベルと一致するかチェックする。
1. `PodPreset`によって定義された様々なリソースを、作成されたPodにマージしようと試みる。
1. エラーが起きた時、そのPod上でマージエラーが起きたことを説明するイベントをスローし、`PodPreset`からリソースを1つも注入されていないPodを作成します。
1. `PodPreset`によって修正されたことを示すために、マージ後の修正されたPodにアノテーションをつけます。そのアノテーションは`podpreset.admission.kubernetes.io/podpreset-<PodPreset名>: "<リソースのバージョン>"`という形式になります。

各Podは0以上のPodPresetにマッチすることができます。そして各`PodPreset`は0以上のPodに適用されます。単一の`PodPreset`が1以上のPodに適用された時、KubernetesはそのPodのSpecを修正します。`Env`、`EnvFrom`、`VolumeMounts`への変更があると、KubernetesはそのPod内の全てのコンテナのSpecを修正します。`Volume`への変更があった場合、KubernetesはそのPodのSpecを修正します。

{{< note >}}
単一のPodPresetは必要に応じてPodのSpec内の`.spec.containers`を修正することができます。PodPresetからのリソース定義は`initContainers`フィールドに対して1つも適用されません。
{{< /note >}}

### 特定のPodに対するPodPresetを無効にする

PodPresetによるPodの変更を受け付けたくないようなインスタンスがある場合があります。このようなケースでは、ユーザーはそのPodのSpec内に次のような形式のアノテーションを追加できます。  
`podpreset.admission.kubernetes.io/exclude: "true"`

## PodPresetを有効にする

ユーザーのクラスター内でPodPresetを使うためには、クラスター内の以下の項目をご確認ください。

1.  `settings.k8s.io/v1alpha1/podpreset`というAPIを有効にします。例えば、これはAPI Serverの `--runtime-config`オプションに`settings.k8s.io/v1alpha1=true`を含むことで可能になります。Minikubeにおいては、クラスターの起動時に`--extra-config=apiserver.runtime-config=settings.k8s.io/v1alpha1=true`をつけることで可能です。
1.  `PodPreset`に対する管理コントローラーを有効にします。これを行うための1つの方法として、API Serverの`--enable-admission-plugins`オプションの値に`PodPreset`を含む方法があります。Minikubeにおいては、クラスターの起動時に`--extra-config=apiserver.enable-admission-plugins=Initializers,NamespaceLifecycle,LimitRanger,ServiceAccount,DefaultStorageClass,DefaultTolerationSeconds,NodeRestriction,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota,PodPreset`を追加することで可能になります。
1.  ユーザーが使う予定のNamespaceにおいて、`PodPreset`オブジェクトを作成することによりPodPresetを定義します。

{{% /capture %}}

{{% capture whatsnext %}}

* [PodPresetを使ったPodへのデータの注入](/docs/tasks/inject-data-application/podpreset/)

{{% /capture %}}
