---
reviewers:
- adrianmoisey
- omerap12
title: Install the VerticalPodAutoscaler Add-on Using Helm
content_type: task
weight: 10
min-kubernetes-server-version: 1.28
draft: true
---

<!-- overview -->

The [VerticalPodAutoscaler](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) (VPA)
is provided as a separate component; it is not included in the core Kubernetes release.
This task shows how to install the VPA control plane using [Helm](https://helm.sh/docs/),
and how to choose how the admission controller's webhook and TLS certificates are managed.

For how VPA adjusts workload resource requests and limits, see
[Vertical Pod Autoscaling](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* [Helm](https://helm.sh/docs/intro/install/) 3.
* A working [resource metrics pipeline](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/)
  that serves the [Metrics API](/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/#metrics-api)
  (`metrics.k8s.io`), which VPA uses for CPU and memory data. Many clusters run
  [Metrics Server](https://github.com/kubernetes-sigs/metrics-server#readme); any other implementation
  of that API is also valid.

{{% thirdparty-content single="true" %}}

* (Optional) [cert-manager](https://cert-manager.io/), only if you plan to let cert-manager issue and
  renew the admission webhook's TLS certificate. See
  [Choose how the admission webhook is managed](#admission-webhook-modes).

<!-- steps -->

## Add the Autoscaler Helm repository

The Kubernetes project publishes charts, including VPA, at `https://kubernetes.github.io/autoscaler`.

```shell
helm repo add autoscalers https://kubernetes.github.io/autoscaler
helm repo update
```

## Install the VPA chart

Install a release named `vertical-pod-autoscaler`. The following example deploys into the `vpa` namespace.

```shell
helm upgrade -i vertical-pod-autoscaler autoscalers/vertical-pod-autoscaler \
  --version 0.9.0 \
  --namespace vpa --create-namespace
```

To see the versions available in the repository, run `helm search repo autoscalers/vertical-pod-autoscaler --versions`, or browse the [chart releases](https://github.com/kubernetes/autoscaler/releases) in the Autoscaler repository.

With the default values this installs the recommender, the updater, and the admission controller, and
configures the admission webhook using the default `Helm-managed` mode. To use cert-manager or
another mode instead, see [Choose how the admission webhook is managed](#admission-webhook-modes).

{{< note >}}
Helm does not upgrade the VPA {{< glossary_tooltip text="CustomResourceDefinitions" term_id="customresourcedefinition" >}};
they ship in the chart's `crds/` directory and Helm applies them only on first install. When you move to
a chart version that ships newer CRDs, apply them yourself:

```shell
kubectl apply --server-side -f "https://raw.githubusercontent.com/kubernetes/autoscaler/vertical-pod-autoscaler-<appVersion>/vertical-pod-autoscaler/charts/vertical-pod-autoscaler/crds/vpa-v1-crd-gen.yaml"
```
{{< /note >}}

## Choose how the admission webhook is managed {#admission-webhook-modes}

The VPA admission controller is a
[mutating admission webhook](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)
that applies recommended resource requests to Pods as they are created. It needs a
MutatingWebhookConfiguration and a TLS certificate that the API server trusts. The chart can set these
up in several **mutually exclusive** ways; pick one mode that fits how you manage certificates.

{{< note >}}
The chart always runs the admission controller with `--reload-cert=true`. The controller watches its
mounted certificate and reloads it in place when the contents change, so a renewed or rotated
certificate, whether issued by the certgen Job, by cert-manager, or updated by you in the TLS Secret, takes effect after the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} refreshes the mounted
Secret, without restarting the Pod.
{{< /note >}}

### Helm-managed (default)

In this mode Helm creates the MutatingWebhookConfiguration, and a one-shot Job that runs the
`registry.k8s.io/ingress-nginx/kube-webhook-certgen` image generates a self-signed certificate, stores
it in a Secret, and patches the CA bundle into the webhook configuration.

{{< caution >}}
For now, this mode relies on a certificate-generation image from the ingress-nginx project, which has
been retired and no longer receives updates or security fixes. For production clusters, use the
[cert-manager](#cert-manager) mode instead.
{{< /caution >}}

This is the default, so the command in [Install the VPA chart](#install-the-vpa-chart) already uses it.
To set it explicitly, use these values:

```yaml
# values.yaml
admissionController:
  registerWebhook: false
  certGen:
    enabled: true
```

### cert-manager {#cert-manager}

In this mode [cert-manager](https://cert-manager.io/docs/installation/) issues and automatically renews
the webhook certificate, and its [CA injector](https://cert-manager.io/docs/concepts/ca-injector/) keeps the CA bundle on the MutatingWebhookConfiguration
up to date. Helm still creates the webhook configuration.

Install cert-manager in the cluster *before* enabling this mode. You can either point the chart at an
issuer you already manage, or have the chart create a self-signed issuer for you.

{{< tabs name="vpa_cert_manager_issuer" >}}

{{% tab name="Existing Issuer or ClusterIssuer" %}}

Point the chart at an Issuer or ClusterIssuer that you already manage:

```yaml
# values.yaml
admissionController:
  registerWebhook: false
  certGen:
    enabled: false
  certManager:
    enabled: true
    issuerRef:
      name: my-issuer
      kind: ClusterIssuer       # or Issuer
      group: cert-manager.io
```

{{% /tab %}}

{{% tab name="Chart-created self-signed issuer" %}}

Have the chart create a self-signed issuer for you:

```yaml
# values.yaml
admissionController:
  registerWebhook: false
  certGen:
    enabled: false
  certManager:
    enabled: true
    createSelfSignedIssuer:
      enabled: true
```

This creates a namespaced self-signed Issuer that signs an intermediate CA, which in turn signs
the webhook certificate. It needs no external PKI, so it is a good choice when you want
cert-manager-managed renewal without bringing your own issuer.

{{% /tab %}}

{{< /tabs >}}

Certificate lifetime and renewal are configurable. The webhook certificate defaults to `admissionController.certManager.duration: 168h` with `renewBefore: 24h`. See the [chart values](https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/charts/vertical-pod-autoscaler/README.md#values) for the full list.

{{< note >}}
In cert-manager mode the chart manages the admission controller's certificate volumes and enables cert reloading, so any values written to `admissionController.volumes` or `admissionController.volumeMounts` will be Ignored.
{{< /note >}}

### Application-managed

In this mode the admission controller registers the MutatingWebhookConfiguration itself, and you are responsible for the TLS certificate.

```yaml
# values.yaml
admissionController:
  registerWebhook: true
  certGen:
    enabled: false
```


Create the TLS Secret (default name `vpa-tls-certs`) before or after installing the chart. The admission controller registers the webhook only once that Secret exists. If you create the Secret after installing,
restart the admission controller so it picks the certificate up and registers the webhook:

```shell
kubectl -n vpa rollout restart deployment vertical-pod-autoscaler-admission-controller
```


Because `registerWebhook` is enabled, the controller also writes the current CA bundle into the MutatingWebhookConfiguration and keeps it patched itself, no certgen Job or cert-manager cainjector is involved. That self-management is convenient, but it is why this mode needs broader permissions, as noted below.

{{< caution >}}
This mode grants the admission controller permission to manage MutatingWebhookConfigurations, which
also lets it delete webhook configurations in the cluster. Prefer the default certgen mode or cert-manager unless you specifically need application-managed registration.
{{< /caution >}}

## Verify the installation

Check that the recommender, updater, and admission controller are running.
The label value matches the Helm release name from the install command above.

```shell
kubectl -n vpa get pods -l app.kubernetes.io/instance=vertical-pod-autoscaler
```

The output is similar to:

```
NAME                                                           READY   STATUS    RESTARTS   AGE
vertical-pod-autoscaler-admission-controller-b7787b7f8-5x6rv   1/1     Running   0          5m51s
vertical-pod-autoscaler-recommender-75d9c95bd4-jhnvd           1/1     Running   0          5m51s
vertical-pod-autoscaler-updater-857b5dbd6c-jcnwp               1/1     Running   0          5m50s
```

## {{% heading "whatsnext" %}}

* Read [Vertical Pod Autoscaling](/docs/concepts/workloads/autoscaling/vertical-pod-autoscale/) to create and configure a `VerticalPodAutoscaler` resource.
* For Helm chart values and upgrades, see the
  [chart README](https://github.com/kubernetes/autoscaler/blob/master/vertical-pod-autoscaler/charts/vertical-pod-autoscaler/README.md)
  in the Autoscaler repository.
