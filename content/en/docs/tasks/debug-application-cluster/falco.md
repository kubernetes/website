---
reviewers:
- soltysh
- sttts
- ericchiang
content_template: templates/concept
title: Auditing with Falco
---

{{% capture overview %}}
### Use Falco to collect audit events

[Falco](https://falco.org/) is an open source project for intrusion and abnormality detection for Cloud Native platforms.
This section describes how to set up Falco, how to send audit events to the Kubernetes Audit endpoint exposed by Falco, and how Falco applies a set of rules to automatically detect suspicious behavior.

{{% /capture %}}

{{% capture body %}}


#### Install Falco

Install Falco by using one of the following methods:

- [Standalone Falco][falco_installation]
- [Kubernetes DaemonSet][falco_installation]
- [Falco Helm Chart][falco_helm_chart]

Once Falco is installed make sure it is configured to expose the Audit webhook. To do so, use the following configuration:

```yaml
webserver:
   enabled: true
   listen_port: 8765
   k8s_audit_endpoint: /k8s_audit
   ssl_enabled: false
   ssl_certificate: /etc/falco/falco.pem
```

This configuration is typically found in the `/etc/falco/falco.yaml` file. If Falco is installed as a Kubernetes DaemonSet, edit the `falco-config` ConfigMap and add this configuration.

#### Configure Kubernetes Audit

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

1. Start [kube-apiserver][kube-apiserver] with the following options:

    ```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
    ```

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
- Creating a ClusterRole with wildcarded verbs or resources. For example,  overly permissive.
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
