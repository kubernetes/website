---
title: ビルトインのアドミッションコントローラーを設定してPodセキュリティスタンダードを強制する
content_type: task
weight: 240
---

Kubernetesは[Podセキュリティスタンダード](/docs/concepts/security/pod-security-standards)を強制できる、ビルトインの[アドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)を提供しています。
アドミッションコントローラーを設定して、クラスター全体のデフォルトと[例外](/docs/concepts/security/pod-security-admission/#exemptions)を設定できます。

## {{% heading "prerequisites" %}}

Podセキュリティアドミッションは、Kubernetes v1.22のアルファリリースに続き、Kubernetes v1.23でベータとしてデフォルトで利用可能になりました。
バージョン1.25以降、Podセキュリティアドミッションは正式リリース(GA)されています。

{{% version-check %}}

Kubernetes {{< skew currentVersion >}}を実行していない場合は、実行しているKubernetesバージョンのドキュメントに切り替えて、このページを参照できます。

## アドミッションコントローラーを設定する {#configure-the-admission-controller}

{{< note >}}
`pod-security.admission.config.k8s.io/v1`設定はv1.25+が必要です。
v1.23とv1.24は、[v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)をご利用ください。
v1.22は、[v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)をご利用ください。
{{< /note >}}

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: AdmissionConfiguration
plugins:
- name: PodSecurity
  configuration:
    apiVersion: pod-security.admission.config.k8s.io/v1 # 互換性に関する備考を参照
    kind: PodSecurityConfiguration
    # モードラベルが設定されていない場合に適用されるデフォルト値。
    #
    # レベルラベルの値は次のいずれかでなければならない:
    # - "privileged"(デフォルト)
    # - "baseline"
    # - "restricted"
    #
    # バージョンラベルの値は次のいずれかでなければならない:
    # - "latest"(デフォルト) 
    # - "v{{< skew currentVersion >}}"のような特定のバージョン
    defaults:
      enforce: "privileged"
      enforce-version: "latest"
      audit: "privileged"
      audit-version: "latest"
      warn: "privileged"
      warn-version: "latest"
    exemptions:
      # 適用除外とする認証済みユーザー名の配列。
      usernames: []
      # 適用除外とするランタイムクラス名の配列。
      runtimeClasses: []
      # 適用除外とする名前空間の配列。
      namespaces: []
```

{{< note >}}
上記のマニフェストは、`--admission-control-config-file`を使用してkube-apiserverに指定する必要があります。
{{< /note >}}

