---
title: kubectlの使用規則
content_type: concept
---

<!-- overview -->
`kubectl`の推奨される使用規則です。


<!-- body -->

## 再利用可能なスクリプトでの`kubectl`の使用

スクリプトでの安定した出力のために:

* `-o name`, `-o json`, `-o yaml`, `-o go-template`, `-o jsonpath` などの機械指向の出力形式のいずれかを必要します。
* バージョンを完全に指定します。例えば、`jobs.v1.batch/myjob`のようにします。これにより、kubectlが時間とともに変化する可能性のあるデフォルトのバージョンを使用しないようにします。
* コンテキストやプリファレンス、その他の暗黙的な状態に頼ってはいけません。

## ベストプラクティス

### `kubectl run`

`kubectl run`がインフラのコード化を満たすのために:

* Tag the image with a version-specific tag and don't move that tag to a new version. For example, use `:v1234`, `v1.2.3`, `r03062016-1-4`, rather than `:latest` (For more information, see [Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images)).
* Check in the script for an image that is heavily parameterized.
* Switch to configuration files checked into source control for features that are needed, but not expressible via `kubectl run` flags.

You can use the `--dry-run=client` flag to preview the object that would be sent to your cluster, without really submitting it.

{{< note >}}
All `kubectl run` generators are deprecated. See the Kubernetes v1.17 documentation for a [list](https://v1-17.docs.kubernetes.io/docs/reference/kubectl/conventions/#generators) of generators and how they were used.
{{< /note >}}

#### Generators
You can generate the following resources with a kubectl command, `kubectl create --dry-run=client -o yaml`:

* `clusterrole`: Create a ClusterRole.
* `clusterrolebinding`: Create a ClusterRoleBinding for a particular ClusterRole.
* `configmap`: Create a ConfigMap from a local file, directory or literal value.
* `cronjob`: Create a CronJob with the specified name.
* `deployment`: Create a Deployment with the specified name.
* `job`: Create a Job with the specified name.
* `namespace`: Create a Namespace with the specified name.
* `poddisruptionbudget`: Create a PodDisruptionBudget with the specified name.
* `priorityclass`: Create a PriorityClass with the specified name.
* `quota`: Create a Quota with the specified name.
* `role`: Create a Role with single rule.
* `rolebinding`: Create a RoleBinding for a particular Role or ClusterRole.
* `secret`: Create a Secret using specified subcommand.
* `service`: Create a Service using specified subcommand.
* `serviceaccount`: Create a ServiceAccount with the specified name.

### `kubectl apply`

* You can use `kubectl apply` to create or update resources. For more information about using kubectl apply to update resources, see [Kubectl Book](https://kubectl.docs.kubernetes.io).


