---
reviewers:
- soltysh
- sttts
- ericchiang
content_template: templates/concept
title: 使用Falco审计
---
<!--
---
reviewers:
- soltysh
- sttts
- ericchiang
content_template: templates/concept
title: Auditing with Falco
---
-->
{{% capture overview %}}
<!--
### Use Falco to collect audit events
-->
### 使用Falco采集审计事件

<!--
[Falco](https://falco.org/) is an open source project for intrusion and abnormality detection for Cloud Native platforms.
This section describes how to set up Falco, how to send audit events to the Kubernetes Audit endpoint exposed by Falco, and how Falco applies a set of rules to automatically detect suspicious behavior.
-->
[Falco]（https://falco.org/）是一个用于云原生平台入侵和异常检测开源项目。本节介绍如何设置Falco，如何将审计事件发送到Falco公开的Kubernetes Audit端点，以及Falco如何应用一组规则来自动检测可疑行为。

{{% /capture %}}

{{% capture body %}}

<!--
#### Install Falco
-->
#### 安装 Falco

<!--
Install Falco by using one of the following methods:
-->
使用以下方法安装Falco：

<!--
- [Standalone Falco][falco_installation]
- [Kubernetes DaemonSet][falco_installation]
- [Falco Helm Chart][falco_helm_chart]
-->
- [Standalone Falco][falco_installation]
- [Kubernetes DaemonSet][falco_installation]
- [Falco Helm Chart][falco_helm_chart]

<!--
Once Falco is installed make sure it is configured to expose the Audit webhook. To do so, use the following configuration:
-->
安装完成Falco后，请确保将其配置为公开Audit Webhook。 为此，请使用以下配置：

```yaml
webserver:
   enabled: true
   listen_port: 8765
   k8s_audit_endpoint: /k8s_audit
   ssl_enabled: false
   ssl_certificate: /etc/falco/falco.pem
```

<!--
This configuration is typically found in the `/etc/falco/falco.yaml` file. If Falco is installed as a Kubernetes DaemonSet, edit the `falco-config` ConfigMap and add this configuration.
-->
配置通常可以在`/ etc / falco / falco.yaml`文件中找到。 如果Falco作为Kubernetes DaemonSet安装，请编辑`falco-config` ConfigMap并添加此配置。
<!--
#### Configure Kubernetes Audit
-->
#### 配置Kubernetes审计

<!--
1. Create a [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) for the [kube-apiserver][kube-apiserver] webhook audit backend.

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
-->
1. 为 [kube-apiserver][kube-apiserver] webhook 审计后端创建一个[kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)配置文件。

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
<!--
1. Start [kube-apiserver][kube-apiserver] with the following options:

    ```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
    ```
-->
2. 使用以下选项开启 [kube-apiserver][kube-apiserver]:

    ```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
    ```
<!--
#### Audit Rules
-->
#### 审计规则

<!--
Rules devoted to Kubernetes Audit Events can be found in [k8s_audit_rules.yaml][falco_k8s_audit_rules]. If Audit Rules is installed as a native package or using the official Docker images, Falco copies the rules file to `/etc/falco/`, so they are available for use.

There are three classes of rules.

The first class of rules looks for suspicious or exceptional activities, such as:
-->

专门用于Kubernetes审计事件的规则可以在[k8s_audit_rules.yaml] [falco_k8s_audit_rules]中找到。 如果Audit Rules是作为本机软件包安装或使用官方Docker镜像安装的，则Falco会将规则文件复制到`/etc/falco/`中，以便可以使用。

共有三类规则。

第一类规则用于查找可疑或异常活动，例如：

<!--
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
- Creating a ClusterRole with wildcarded verbs or resources. For example,  overly permissive.
- Creating a ClusterRole with write permissions or a ClusterRole that can execute commands on pods.
-->
-未经授权或匿名用户的任何活动。
-创建使用未知或不允许的镜像的pod。
-创建特权Pod，从主机安装敏感文件系统的Pod或使用主机网络的Pod。
-创建NodePort服务。
-创建包含私有证书（例如密码和云提供商secrets）的ConfigMap。
-在正在运行的Pod上附加或执行命令。
-在一组允许的名称空间之外创建一个名称空间。
-在kube-system或kube-public命名空间中创建pod或服务帐户。
-尝试修改或删除系统ClusterRole。
-创建一个ClusterRoleBinding到cluster-admin角色。
-使用通配动词或资源创建ClusterRole。 例如，过度赋权。
-创建具有写权限的ClusterRole或可以在Pod上执行命令的ClusterRole。

<!--
A second class of rules tracks resources being created or destroyed, including:

- Deployments
- Services
- ConfigMaps
- Namespaces
- Service accounts
- Role/ClusterRoles
- Role/ClusterRoleBindings
-->
第二类规则跟踪正在创建或销毁的资源，包括：

- Deployments
- Services
- ConfigMaps
- Namespaces
- Service accounts
- Role/ClusterRoles
- Role/ClusterRoleBindings

<!--
The final class of rules simply displays any Audit Event received by Falco. This rule is disabled by default, as it can be quite noisy.

For further details, see [Kubernetes Audit Events][falco_ka_docs] in the Falco documentation.
-->

最后一类规则显示Falco收到的所有审核事件。默认情况下，此规则是禁用的，因为它可能会很吵。

有关更多详细信息，请参阅Falco文档中的[Kubernetes审计事件][falco_ka_docs]。

<!--
[kube-apiserver]: /docs/admin/kube-apiserver
[auditing-proposal]: https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/auditing.md
[auditing-api]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/staging/src/k8s.io/apiserver/pkg/apis/audit/v1/types.go
[gce-audit-profile]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh#L735
[kubeconfig]: /docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[fluentd]: http://www.fluentd.org/
[fluentd_install_doc]: https://docs.fluentd.org/v1.0/articles/quickstart#step-1:-installing-fluentd
[fluentd_plugin_management_doc]: https://docs.fluentd.org/v1.0/articles/plugin-management
[logstash]: https://www.elastic.co/products/logstash
[logstash_install_doc]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
[kube-aggregator]: /docs/concepts/api-extension/apiserver-aggregation
[falco_website]: https://www.falco.org
[falco_k8s_audit_rules]: https://github.com/falcosecurity/falco/blob/master/rules/k8s_audit_rules.yaml
[falco_ka_docs]: https://falco.org/docs/event-sources/kubernetes-audit
[falco_installation]: https://falco.org/docs/installation
[falco_helm_chart]: https://github.com/helm/charts/tree/master/stable/falco
-->
[kube-apiserver]: /docs/admin/kube-apiserver
[auditing-proposal]: https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/auditing.md
[auditing-api]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/staging/src/k8s.io/apiserver/pkg/apis/audit/v1/types.go
[gce-audit-profile]: https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/cluster/gce/gci/configure-helper.sh#L735
[kubeconfig]: /docs/tasks/access-application-cluster/configure-access-multiple-clusters/
[fluentd]: http://www.fluentd.org/
[fluentd_install_doc]: https://docs.fluentd.org/v1.0/articles/quickstart#step-1:-installing-fluentd
[fluentd_plugin_management_doc]: https://docs.fluentd.org/v1.0/articles/plugin-management
[logstash]: https://www.elastic.co/products/logstash
[logstash_install_doc]: https://www.elastic.co/guide/en/logstash/current/installing-logstash.html
[kube-aggregator]: /docs/concepts/api-extension/apiserver-aggregation
[falco_website]: https://www.falco.org
[falco_k8s_audit_rules]: https://github.com/falcosecurity/falco/blob/master/rules/k8s_audit_rules.yaml
[falco_ka_docs]: https://falco.org/docs/event-sources/kubernetes-audit
[falco_installation]: https://falco.org/docs/installation
[falco_helm_chart]: https://github.com/helm/charts/tree/master/stable/falco

{{% /capture %}}
