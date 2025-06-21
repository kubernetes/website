---
title: Podセキュリティポリシー
content_type: concept
weight: 30
---

<!-- overview -->

{{% alert title="削除された機能" color="warning" %}}
PodSecurityPolicyは、Kubernetes v1.21で[非推奨](/blog/2021/04/08/kubernetes-1-21-release-announcement/#podsecuritypolicy-deprecation)となり、Kubernetes v1.25で削除されました。
{{% /alert %}}

PodSecurityPolicyの代わりに、次のいずれか、または両方を使用して、Podに対して同様の制限を適用できます:

- [Podのセキュリティアドミッション](/docs/concepts/security/pod-security-admission/)
- 自身でデプロイおよび設定を行うサードパーティ製のアドミッションプラグイン

移行ガイドについては、[PodSecurityPolicyからビルトインのPodセキュリティアドミッションコントローラーへの移行](/docs/tasks/configure-pod-container/migrate-from-psp/)を参照してください。
このAPIの削除に関する詳細は、[PodSecurityPolicyの非推奨: 過去・現在・未来](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)を参照してください。

Kubernetes v{{< skew currentVersion >}}を使用していない場合は、使用中のKubernetesバージョンのドキュメントを参照してください。