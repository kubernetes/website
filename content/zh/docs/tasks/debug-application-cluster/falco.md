<!--
| reviewers              | content_type | title               |
| ---------------------- | ------------ | ------------------- |
| soltyshstttsericchiang | concept      | Auditing with Falco |
-->

| 评论者                 | 内容类型 | 标题                |
| ---------------------- | -------- | ------------------- |
| soltyshstttsericchiang | concept  | Auditing with Falco |

<!--

### Use Falco to collect audit events

[Falco](https://falco.org/) is an open source project for intrusion and abnormality detection for Cloud Native platforms. This section describes how to set up Falco, how to send audit events to the Kubernetes Audit endpoint exposed by Falco, and how Falco applies a set of rules to automatically detect suspicious behavior.

-->

### 使用 Falco 收集审核事件

Falco 是一个用于云原生平台入侵和异常检测的开源项目。 本节介绍如何设置 Falco，如何将审核事件发送到Falco公开的 Kubernetes Audit 端点以及 Falco 如何用一组规则来自动检测可疑行为。

<!--

#### Install Falco

Install Falco by using one of the following methods:

- [Standalone Falco][falco_installation]
- [Kubernetes DaemonSet][falco_installation]
- [Falco Helm Chart][falco_helm_chart]

Once Falco is installed make sure it is configured to expose the Audit webhook. To do so, use the following configuration:

```
webserver:
   enabled: true
   listen_port: 8765
   k8s_audit_endpoint: /k8s_audit
   ssl_enabled: false
   ssl_certificate: /etc/falco/falco.pem
```

This configuration is typically found in the `/etc/falco/falco.yaml` file. If Falco is installed as a Kubernetes DaemonSet, edit the `falco-config` ConfigMap and add this configuration.

-->

#### 安装 Falco

您可通过以下方式安装 Falco:

- [单机版 Falco][falco_installation]
- [Kubernetes DaemonSet][falco_installation]
- [Falco Helm Chart][falco_helm_chart]

安装Falco后，请确保将其配置成公开Audit Webhook。为此，请使用以下配置：

```
webserver:
   enabled: true
   listen_port: 8765
   k8s_audit_endpoint: /k8s_audit
   ssl_enabled: false
   ssl_certificate: /etc/falco/falco.pem
```

主要在 `/etc/falco/falco.yaml` 文件进行配置。如果 Falco 以 Kubernetes DaemonSet 方式安装，编辑 `falco-config` 配置文件并添加这个配置。

<!--

#### Configure Kubernetes Audit

1. Create a [kubeconfig file](https://github.com/kubernetes/website/blob/release-1.16/docs/concepts/configuration/organize-cluster-access-kubeconfig) for the [kube-apiserver](https://github.com/kubernetes/website/blob/release-1.16/docs/admin/kube-apiserver) webhook audit backend.

   ```
    cat <<EOF > /etc/kubernetes/audit-webhook-kubeconfig
    apiVersion: v1
    kind: Config
    clusters:
    - cluster:
        server: http://<ip_of_falco>:8765/k8s_audit
      name: falco
    contexts:
    - context:
        cluster: falco
        user: ""
      name: default-context
    current-context: default-context
    preferences: {}
    users: []
    EOF
   ```

2. Start [kube-apiserver](https://github.com/kubernetes/website/blob/release-1.16/docs/admin/kube-apiserver) with the following options:

   ```
   --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
   ```

-->

#### 配置 Kubernetes 审核

1. 为 [kube-apiserver](https://github.com/kubernetes/website/blob/release-1.16/docs/admin/kube-apiserver) webhook 审核后台创建一个  [kubeconfig 配置文件](https://github.com/kubernetes/website/blob/release-1.16/docs/concepts/configuration/organize-cluster-access-kubeconfig)。

   ```
    cat <<EOF > /etc/kubernetes/audit-webhook-kubeconfig
    apiVersion: v1
    kind: Config
    clusters:
    - cluster:
        server: http://<ip_of_falco>:8765/k8s_audit
      name: falco
    contexts:
    - context:
        cluster: falco
        user: ""
      name: default-context
    current-context: default-context
    preferences: {}
    users: []
    EOF
   ```

2. 以如下配置启动 [kube-apiserver](https://github.com/kubernetes/website/blob/release-1.16/docs/admin/kube-apiserver):

   ```
   --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
   ```

<!--

#### Audit Rules

Rules devoted to Kubernetes Audit Events can be found in [k8s_audit_rules.yaml][falco_k8s_audit_rules]. If Audit Rules is installed as a native package or using the official Docker images, Falco copies the rules file to `/etc/falco/`, so they are available for use.

There are three classes of rules.

The first class of rules looks for suspicious or exceptional activities, such as:

- Any activity by an unauthorized or anonymous user.
- Creating a pod with an unknown or disallowed image.
- Creating a privileged pod, a pod mounting a sensitive filesystem from the host, or a pod using host networking.
- Creating a NodePort service.
- Creating a ConfigMap containing private credentials, such as passwords and cloud provider secrets.
- Attaching to or executing a command on a running pod.
- Creating a namespace external to a set of allowed namespaces.
- Creating a pod or service account in the kube-system or kube-public namespaces.
- Trying to modify or delete a system ClusterRole.
- Creating a ClusterRoleBinding to the cluster-admin role.
- Creating a ClusterRole with wildcarded verbs or resources. For example, overly permissive.
- Creating a ClusterRole with write permissions or a ClusterRole that can execute commands on pods.

A second class of rules tracks resources being created or destroyed, including:

- Deployments
- Services
- ConfigMaps
- Namespaces
- Service accounts
- Role/ClusterRoles
- Role/ClusterRoleBindings

The final class of rules simply displays any Audit Event received by Falco. This rule is disabled by default, as it can be quite noisy.

For further details, see [Kubernetes Audit Events][falco_ka_docs] in the Falco documentation.

[auditing-api]: [https://github.com/kubernetes/kubernetes/blob/{{](https://github.com/kubernetes/kubernetes/blob/%7B%7B)< param "githubbranch" >}}/staging/src/k8s.io/apiserver/pkg/apis/audit/v1/types.go [gce-audit-profile]: [https://github.com/kubernetes/kubernetes/blob/{{](https://github.com/kubernetes/kubernetes/blob/%7B%7B)< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh#L735 [kubeconfig]: /docs/tasks/access-application-cluster/configure-access-multiple-clusters/ [fluentd]: <http://www.fluentd.org/> [fluentd_install_doc]: <https://docs.fluentd.org/v1.0/articles/quickstart#step-1:-installing-fluentd> [fluentd_plugin_management_doc]: <https://docs.fluentd.org/v1.0/articles/plugin-management> [logstash]: <https://www.elastic.co/products/logstash> [logstash_install_doc]: <https://www.elastic.co/guide/en/logstash/current/installing-logstash.html> [kube-aggregator]: /docs/concepts/api-extension/apiserver-aggregation [falco_website]: [https://www.falco.org](https://www.falco.org/) [falco_k8s_audit_rules]: <https://github.com/falcosecurity/falco/blob/master/rules/k8s_audit_rules.yaml> [falco_ka_docs]: <https://falco.org/docs/event-sources/kubernetes-audit> [falco_installation]: <https://falco.org/docs/installation> [falco_helm_chart]: <https://github.com/helm/charts/tree/master/stable/falco>

-->

#### 审核规则

用于 Kubernetes 审核事件的规则可以在 [k8s_audit_rules.yaml][falco_k8s_audit_rules] 文件中找到。如果审核规则作为本地软件包安装或使用官方 Docker 镜像安装，则 Falco 会将规则文件复制到 `/etc/falco/` 中，以便可以使用它们。

共有三类规则。

第一类规则用于查找可疑或异常活动，例如：

- 未经授权或匿名用户的任何活动。
- 使用未知或不允许的镜像创建 Pod。
- 创建特权 Pod，从主机安装敏感文件系统的 Pod 或使用主机联网的 Pod。
- 创建一个 NodePort 服务。
- 创建一个包含私有凭证（例如密码和云提供商机密）的 ConfigMap。
- 在正在运行的 Pod 上附加或执行命令。
- 在一组允许的命名空间外部创建一个命名空间。
- 在 kube-system 或 kube-public 命名空间中创建 Pod 或服务帐户。
- 试图修改或删除系统 ClusterRole。
- 给 cluster-admin 角色创建一个 ClusterRoleBinding。
- 使用通配动词或资源创建 ClusterRole，例如 overly permissive。
- 创建具有写权限的 ClusterRole 或可以在 Pod 上执行命令的 ClusterRole。

第二类规则跟踪正在创建或销毁的资源，包括：

- 部署
- 服务
- 配置
- 命名空间
- 服务账户
- 角色/集群角色
- 角色/集群角色绑定

最后一类规则仅显示 Falco 收到的所有审核事件。默认情况下，此规则是禁用的，因为它可能会很琐碎。

更多详细信息，请参考 Falco 文档中的 [Kubernetes Audit Events][falco_ka_docs]。

[auditing-api]: [https://github.com/kubernetes/kubernetes/blob/{{](https://github.com/kubernetes/kubernetes/blob/%7B%7B)< param "githubbranch" >}}/staging/src/k8s.io/apiserver/pkg/apis/audit/v1/types.go [gce-audit-profile]: [https://github.com/kubernetes/kubernetes/blob/{{](https://github.com/kubernetes/kubernetes/blob/%7B%7B)< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh#L735 [kubeconfig]: /docs/tasks/access-application-cluster/configure-access-multiple-clusters/ [fluentd]: <http://www.fluentd.org/> [fluentd_install_doc]: <https://docs.fluentd.org/v1.0/articles/quickstart#step-1:-installing-fluentd> [fluentd_plugin_management_doc]: <https://docs.fluentd.org/v1.0/articles/plugin-management> [logstash]: <https://www.elastic.co/products/logstash> [logstash_install_doc]: <https://www.elastic.co/guide/en/logstash/current/installing-logstash.html> [kube-aggregator]: /docs/concepts/api-extension/apiserver-aggregation [falco_website]: [https://www.falco.org](https://www.falco.org/) [falco_k8s_audit_rules]: <https://github.com/falcosecurity/falco/blob/master/rules/k8s_audit_rules.yaml> [falco_ka_docs]: <https://falco.org/docs/event-sources/kubernetes-audit> [falco_installation]: <https://falco.org/docs/installation> [falco_helm_chart]: <https://github.com/helm/charts/tree/master/stable/falco
