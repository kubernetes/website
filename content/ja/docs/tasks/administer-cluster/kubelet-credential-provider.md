---
title: kubelet image credential providerの設定
content_type: task
min-kubernetes-server-version: v1.26
weight: 120
---

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

<!-- overview -->

Kubernetes v1.20以降、kubeletはexecプラグインを使用してコンテナイメージレジストリへの認証情報を動的に取得できるようになりました。
kubeletとexecプラグインは、Kubernetesのバージョン管理されたAPIを用いて標準入出力(stdin、stdout、stderr)を通じて通信します。
これらのプラグインを使用することで、kubeletはディスク上に静的な認証情報を保存する代わりに、コンテナレジストリへの認証情報を動的に要求できるようになります。
たとえば、プラグインがローカルのメタデータサーバーと通信し、kubeletが取得しようとしているイメージに対する、短期間有効な認証情報を取得することがあります。

以下のいずれかに該当する場合、この機能の利用を検討するとよいでしょう:

* レジストリへの認証情報を取得するために、クラウドプロバイダーのサービスへのAPI呼び出しが必要である。
* 認証情報の有効期限が短く、頻繁に新しい認証情報の取得が必要である。
* 認証情報をディスク上やimagePullSecretsに保存することが許容されない。

このガイドでは、kubelet image credential providerプラグイン機構の設定方法について説明します。

## イメージ取得用のServiceAccountトークン
{{< feature-state feature_gate_name="KubeletServiceAccountTokenForCredentialProviders" >}}

Kubernetes v1.33以降、kubeletは、イメージの取得を行っているPodにバインドされたサービスアカウントトークンを、credential providerプラグインに送信するように設定できます。

これにより、プラグインはそのトークンを使用して、イメージレジストリへのアクセスに必要な認証情報と交換することが可能になります。

この機能を有効化するには、kubeletで`KubeletServiceAccountTokenForCredentialProviders`フィーチャーゲートを有効化し、プラグイン用の`CredentialProviderConfig`ファイルで`tokenAttributes`フィールドを設定する必要があります。

`tokenAttributes`フィールドには、プラグインに渡されるサービスアカウントトークンに関する情報が含まれており、トークンの対象となるオーディエンスや、プラグインがPodにサービスアカウントを必要とするかどうかといった内容が指定されます。

サービスアカウントトークンによる認証情報を用いることで、次のようなユースケースに対応できます:

* レジストリからイメージを取得するために、kubeletやノードに基づくアイデンティティを必要としないようにする
* 長期間有効なシークレットや永続的なシークレットを使用せずに、ワークロードが自身のランタイムのアイデンティティに基づいてイメージを取得できるようにする

## {{% heading "prerequisites" %}}

* kubelet credential providerプラグインをサポートするノードを持つKubernetesクラスターが必要です。このサポートは、Kubernetes {{< skew currentVersion >}}で利用可能です。Kubernetes v1.24およびv1.25で、デフォルトで有効なベータ機能として含まれるようになりました。
* サービスアカウントトークンを必要とするcredential providerプラグインを設定する場合は、Kubernetes v1.33以降を実行しているノードを持つクラスターと、kubelet上で`KubeletServiceAccountTokenForCredentialProviders`フィーチャーゲートが有効になっている必要があります。
* credential provider execプラグインの動作する実装。独自にプラグインを作成するか、クラウドプロバイダーが提供するものを使用できます。

{{< version-check >}}

<!-- steps -->

## ノードへのプラグインのインストール

credential providerプラグインは、kubeletによって実行される実行可能バイナリです。
クラスター内のすべてのノードにこのプラグインバイナリが存在し、既知のディレクトリに配置されていることを確認してください。
このディレクトリは、後でkubeletのフラグを設定する際に必要です。

## kubeletの設定

この機能を使用するには、kubeletに次の2つのフラグを設定する必要があります:

* `--image-credential-provider-config` - credential providerプラグインの設定ファイルへのパス
* `--image-credential-provider-bin-dir` - credential providerプラグインのバイナリが配置されているディレクトリへのパス

### kubelet credential providerを設定する

`--image-credential-provider-config`に指定された設定ファイルは、どのコンテナイメージに対してどのexecプラグインを呼び出すかを判断するためにkubeletによって読み込まれます。
以下は、[ECRベースのプラグイン](https://github.com/kubernetes/cloud-provider-aws/tree/master/cmd/ecr-credential-provider)を使用する場合に利用される可能性がある設定ファイルの例です。

```yaml
apiVersion: kubelet.config.k8s.io/v1
kind: CredentialProviderConfig
# providersは、kubeletによって有効化されるcredential provider補助プラグインのリストです。
# 単一のイメージに対して複数のプロバイダーが一致する場合、すべてのプロバイダーからの認証情報がkubeletに返されます。
# 単一のイメージに対して複数のプロバイダーが呼び出されると、結果は結合されます。
# 認証キーが重複する場合は、このリスト内で先に定義されたプロバイダーの値が使用されます。
providers:
  # nameはcredential providerの名前で必須項目です。kubeletから見えるプロバイダーの実行可能ファイル名と一致している必要があります。
  # 実行可能ファイルは、kubeletのbinディレクトリ(--image-credential-provider-bin-dirフラグで指定)内に存在しなければなりません。
  - name: ecr-credential-provider
    # matchImagesは必須の文字列リストで、イメージに対して一致判定を行い、
    # このプロバイダーを呼び出すべきかどうかを判断するために使用されます。
    # 指定された文字列のいずれか1つが、kubeletから要求されたイメージに一致した場合、
    # プラグインが呼び出され、認証情報を提供する機会が与えられます。
    # イメージには、レジストリのドメインおよびURLパスが含まれている必要があります。
    #
    # matchImagesの各エントリは、オプションでポートおよびパスを含むことができるパターンです。
    # ドメインにはグロブを使用できますが、ポートやパスには使用できません。
    # グロブは、'*.k8s.io'や'k8s.*.io'のようなサブドメインや、'k8s.*'のようなトップレベルドメインでサポートされています。
    # 'app*.k8s.io'のような部分的なサブドメインの一致もサポートされています。
    # 各グロブはサブドメインの1セグメントのみに一致するため、`*.io`は`*.k8s.io`には**一致しません**。
    #
    # イメージとmatchImageが一致すると見なされるのは、以下のすべての条件を満たす場合です:
    # - 双方が同じ数のドメインパートを含み、各パートが一致していること
    # - matchImagesに指定されたURLパスが、対象のイメージURLパスのプレフィックスであること
    # - matchImagesにポートが含まれている場合、そのポートがイメージのポートにも一致すること
    #
    # matchImagesの値の例:
    # - 123456789.dkr.ecr.us-east-1.amazonaws.com
    # - *.azurecr.io
    # - gcr.io
    # - *.*.registry.io
    # - registry.io:8080/path
    matchImages:
      - "*.dkr.ecr.*.amazonaws.com"
      - "*.dkr.ecr.*.amazonaws.com.cn"
      - "*.dkr.ecr-fips.*.amazonaws.com"
      - "*.dkr.ecr.us-iso-east-1.c2s.ic.gov"
      - "*.dkr.ecr.us-isob-east-1.sc2s.sgov.gov"
    # defaultCacheDurationは、プラグインの応答にキャッシュ期間が指定されていない場合に、
    # プラグインが認証情報をメモリ内でキャッシュするデフォルトの期間です。このフィールドは必須です。
    defaultCacheDuration: "12h"
    # exec CredentialProviderRequestの入力に必要なバージョンです。返されるCredentialProviderResponseは、
    # 入力と同じエンコーディングバージョンを使用しなければなりません。現在サポートされている値は以下のとおりです:
    # - credentialprovider.kubelet.k8s.io/v1
    apiVersion: credentialprovider.kubelet.k8s.io/v1
    # コマンドを実行する際に渡す引数です。
    # +optional
    # args:
    #   - --example-argument
    # envは、プロセスに対して公開する追加の環境変数を定義します。
    # これらはホストの環境変数および、client-goがプラグインに引数を渡すために使用する変数と結合されます。
    # +optional
    env:
      - name: AWS_PROFILE
        value: example_profile

    # tokenAttributesは、プラグインに渡されるサービスアカウントトークンの設定です。
    # このフィールドを設定することで、credential providerはイメージの取得にサービスアカウントトークンを使用するようになります。
    # このフィールドが設定されているにも関わらず、`KubeletServiceAccountTokenForCredentialProviders`フィーチャーゲートが有効になっていない場合、
    # kubeletは無効な設定エラーとして起動に失敗します。
    # +optional
    tokenAttributes:
      # serviceAccountTokenAudienceは、投影されたサービスアカウントトークンの対象となるオーディエンスです。
      # +required
      serviceAccountTokenAudience: "<audience for the token>"
      # requireServiceAccountは、プラグインがPodにサービスアカウントを必要とするかどうかを示します。
      # trueに設定された場合、kubeletはPodにサービスアカウントがある場合にのみプラグインを呼び出します。
      # falseに設定された場合、Podにサービスアカウントがなくてもkubeletはプラグインを呼び出し、
      # CredentialProviderRequestにはトークンを含めません。これは、サービスアカウントを持たないPod
      # (たとえば、Static Pod)に対してイメージを取得するためのプラグインに有用です。
      # +required
      requireServiceAccount: true
      # requiredServiceAccountAnnotationKeysは、プラグインが対象とし、サービスアカウントに存在する必要があるアノテーションキーのリストです。
      # このリストに定義されたキーは、対応するサービスアカウントから抽出され、CredentialProviderRequestの一部としてプラグインに渡されます。
      # このリストに定義されたキーのいずれかがサービスアカウントに存在しない場合、kubeletはプラグインを呼び出さず、エラーを返します。
      # このフィールドはオプションであり、空であっても構いません。プラグインはこのフィールドを使用して、
      # 認証情報の取得に必要な追加情報を抽出したり、サービスアカウントトークンによるイメージ取得の利用を
      # ワークロード側で選択可能にしたりできます。
      # このフィールドが空でない場合、requireServiceAccountはtrueに設定されていなければなりません。
      # このリストに定義されたキーは一意である必要があり、
      # optionalServiceAccountAnnotationKeysリストに定義されたキーと重複してはいけません。
      # +optional
      requiredServiceAccountAnnotationKeys:
      - "example.com/required-annotation-key-1"
      - "example.com/required-annotation-key-2"
      # optionalServiceAccountAnnotationKeysは、プラグインが対象とするアノテーションキーのリストで、
      # サービスアカウントに存在していなくてもよいオプションの項目です。
      # このリストに定義されたキーは、対応するサービスアカウントから抽出され、
      # CredentialProviderRequestの一部としてプラグインに渡されます。
      # アノテーションの存在や値の検証はプラグイン側の責任です。
      # このフィールドはオプションであり、空でも構いません。
      # プラグインはこのフィールドを使用して、認証情報の取得に必要な追加情報を抽出できます。
      # このリストに定義されたキーは一意でなければならず、
      # requiredServiceAccountAnnotationKeysリストに定義されたキーと重複してはいけません。
      # +optional
      optionalServiceAccountAnnotationKeys:
      - "example.com/optional-annotation-key-1"
      - "example.com/optional-annotation-key-2"
```

`providers`フィールドは、kubeletが使用する有効なプラグインのリストです。
各エントリには、いくつかの入力必須のフィールドがあります:

* `name`: プラグインの名前であり、`--image-credential-provider-bin-dir`で指定されたディレクトリ内に存在する実行可能バイナリの名前と一致していなければなりません。
* `matchImages`: このプロバイダーを呼び出すべきかどうかを判断するために、イメージと照合するための文字列リスト。詳細は後述します。
* `defaultCacheDuration`: プラグインによってキャッシュ期間が指定されていない場合に、kubeletが認証情報をメモリ内にキャッシュするデフォルトの期間。
* `apiVersion`: kubeletとexecプラグインが通信時に使用するAPIバージョン。

各credential providerには、オプションの引数や環境変数を指定することもできます。
特定のプラグインで必要となる引数や環境変数のセットについては、プラグインの実装者に確認してください。

KubeletServiceAccountTokenForCredentialProvidersフィーチャーゲートを使用し、tokenAttributesフィールドを設定してプラグインにサービスアカウントトークンを使用させる場合、以下のフィールドの設定が必須となります:

* `serviceAccountTokenAudience`:
  投影されたサービスアカウントトークンの対象となるオーディエンス。
  空文字列は指定できません。

* `requireServiceAccount`:
  プラグインがPodにサービスアカウントを必要とするかどうか。
  * `true`に設定すると、Podにサービスアカウントがある場合にのみkubeletはプラグインを呼び出します。
  * `false`に設定すると、Podにサービスアカウントがなくてもkubeletはプラグインを呼び出し、`CredentialProviderRequest`にはトークンを含めません。

これは、サービスアカウントを持たないPod(たとえば、Static Pod)に対してイメージを取得するためのプラグインに有用です。

#### イメージのマッチングを設定する

各credential providerの`matchImages`フィールドは、Podが使用する特定のイメージに対してプラグインを呼び出すべきかどうかを、kubeletが判断するために使用されます。
`matchImages`の各エントリはイメージパターンであり、オプションでポートやパスを含めることができます。
ドメインにはグロブを使用できますが、ポートやパスには使用できません。
グロブは、`*.k8s.io`や`k8s.*.io`のようなサブドメインや、`k8s.*`のようなトップレベルドメインで使用可能です。
`app*.k8s.io`のような部分的なサブドメインの一致もサポートされています。
ただし、各グロブは1つのサブドメインセグメントにしか一致しないため、`*.io`は`*.k8s.io`には一致しません。

イメージ名と`matchImage`エントリが一致すると見なされるのは、以下のすべての条件を満たす場合です:

* 両者が同じ数のドメインパートを持ち、それぞれのパートが一致していること。
* イメージの一致条件として指定されたURLパスが、対象のイメージのURLパスのプレフィックスであること。
* matchImagesにポートが含まれている場合、イメージのポートとも一致すること。

`matchImages`パターンの値のいくつかの例:

* `123456789.dkr.ecr.us-east-1.amazonaws.com`
* `*.azurecr.io`
* `gcr.io`
* `*.*.registry.io`
* `foo.registry.io:8080/path`

## {{% heading "whatsnext" %}}

* `CredentialProviderConfig`の詳細については、[kubelet設定API(v1)リファレンス](/docs/reference/config-api/kubelet-config.v1/)を参照してください。
* [kubelet credential provider APIリファレンス(v1)](/docs/reference/config-api/kubelet-credentialprovider.v1/)を参照してください。
