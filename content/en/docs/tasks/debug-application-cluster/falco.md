---
reviewers:
- soltysh
- sttts
- ericchiang
content_type: concept
title: Auditing with Falco
---

<!-- overview -->
### Use Falco to collect audit events

[Falco](https://falco.org/) is an open source project for intrusion and abnormality detection for Cloud Native platforms.
This section describes how to set up Falco, how to send audit events to the Kubernetes Audit endpoint exposed by Falco, and how Falco applies a set of rules to automatically detect suspicious behavior.

<!-- body -->

#### Install Falco

Install Falco by using one of the following methods:

- [Standalone Falco](https://falco.org/docs/installation)
- [Kubernetes DaemonSet](https://falco.org/docs/installation)
- [Falco Helm Chart](https://github.com/falcosecurity/charts/tree/master/falco)

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

1. Create a [kubeconfig file](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
   for the [kube-apiserver](/docs/reference/generated/kube-apiserver/) webhook audit backend.

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

1. Start `kube-apiserver` with the following options:

    ```shell
    --audit-policy-file=/etc/kubernetes/audit-policy.yaml --audit-webhook-config-file=/etc/kubernetes/audit-webhook-kubeconfig
    ```

#### Audit Rules

Rules devoted to Kubernetes Audit Events can be found in [k8s_audit_rules.yaml](https://github.com/falcosecurity/falco/blob/master/rules/k8s_audit_rules.yaml).
If Audit Rules is installed as a native package or using the official Docker images, Falco copies the rules file to `/etc/falco/`, so they are available for use.

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

For further details, see [Kubernetes Audit Events](https://falco.org/docs/event-sources/kubernetes-audit) in the Falco documentation.


