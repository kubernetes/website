---
reviewers:
- cheftako
- dims
title: Cloud Controller Manager Webhook Framework
description: >
  An overview of the cloud controller manager webhook framework which makes it
  easier to serve webhooks using the cloud-provider framework.
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.27" state="alpha" >}}

The Kubernetes cloud provider webhook framework is designed to make it easier
for cloud providers to serve admission webhooks from their cloud controller
manager binaries.

<!-- body -->

## Overview

In order to take advantage of the cloud controller manager webhook framework, a
vendor needs to use the new `app.CommandBuilder` imported from
`k8s.io/cloud-provider/app` to generate their cloud controller manager's
`cobra.Command`.  This command is used to start the cloud controller manager
binary, and currently most ccms use `NewCloudControllerManagerCommand()` to
generate the `cobra.Command`.  The new alternative, found in
[builder.go](https://github.com/kubernetes/kubernetes/blob/d89d5ab2680bc74fe4487ad71e514f4e0812d9ce/staging/src/k8s.io/cloud-provider/app/builder.go)
supports the new webhook functionality in a way that no longer requires cloud
providers to update their cloud controller manager binary when new features are
released.

## Example Usage

In the main package of your cloud controller manager binary (or wherever you
construct your `cobra.Command` using `NewCloudControllerManagerCommand()`), you
must first migrate your command creation process to use the `CommandBuilder`.

With the `CommandBuilder` pattern in place, the `RegisterWebhook()` function can be called to complete the registration of the webhook.
An example `main()` function might look like this:

```go
import (
	"math/rand"
	"time"

	"k8s.io/apimachinery/pkg/util/wait"
	"k8s.io/cloud-provider/app"
	cliflag "k8s.io/component-base/cli/flag"
	"k8s.io/component-base/logs"
	"k8s.io/klog/v2"
)

func main() {
        rand.Seed(time.Now().UTC().UnixNano())

        logs.InitLogs()
        defer logs.FlushLogs()

        fss := cliflag.NamedFlagSets{}

        examplecontroller.Options.AddFlags(fss.FlagSet("example controller"))

        builder := app.NewBuilder()
        builder.AddFlags(fss)
        builder.RegisterDefaultControllers()
        builder.RegisterController(examplecontroller.ExampleControllerKey, examplecontroller.ExampleControllerConstructor)
        builder.RegisterWebhook("example-webhook", app.WebhookConfig{
                Path:             examplewebhook.Path,
                AdmissionHandler: examplewebhook.ValidatingWebhook,
        })
        builder.SetStopChannel(wait.NeverStop)
        builder.SetCloudInitializer(cloudInitializer)
        builder.SetProviderDefaults(cpoptions.ProviderDefaults{
                WebhookBindPort: &examplewebhook.Webhookport,
        })
        command := builder.BuildCommand()

        if err := command.Execute(); err != nil {
                klog.Fatalf("unable to execute command: %v", err)
        }
}
```

Finally, a webhook configuration needs to be created, referencing the webhook endpoint which was just created:
```yaml
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingWebhookConfiguration
metadata:
  name: "ccm-webhook.example.com"
webhooks:
  - name: "ccm-webhook.example.com"
    clientConfig:
      service:
        namespace: "example-namespace"
        name: "example-service"
    caBundle: <CA_BUNDLE>
    rules:
      - operations: ["CREATE"]
        apiGroups: [""]
        apiVersions: ["v1"]
        resources: ["pods"]
    namespaceSelector:
      matchLabels:
        modify: "true"
    sideEffects: None
    timeoutSeconds: 5
    admissionReviewVersions: ["v1"]
```

{{< note >}}
You must replace the `<CA_BUNDLE>` in the above example by a valid CA bundle
which is a PEM-encoded CA bundle for validating the webhook's server certificate.
{{< /note >}}

The `scope` field specifies if only cluster-scoped resources ("Cluster") or namespace-scoped
resources ("Namespaced") will match this rule. "&lowast;" means that there are no scope restrictions.

{{< note >}}
When using `clientConfig.service`, the server cert must be valid for
`<svc_name>.<svc_namespace>.svc`.
{{< /note >}}

{{< note >}}
Default timeout for a webhook call is 10 seconds,
You can set the `timeout` and it is encouraged to use a short timeout for webhooks.
If the webhook call times out, the request is handled according to the webhook's
failure policy.
{{< /note >}}

For more information about webhook configuration, refer to [the dynamic admission control documentation](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/).

## Persistent Volume Labeller

One application of the cloud controller manager webhook framework is an easy
mechanism for cloud providers to host a webhook for replacing the [persistent
volume labelling admission
controller](https://github.com/kubernetes/kubernetes/blob/master/plugin/pkg/admission/storage/persistentvolume/label/admission.go).
This admission controller is responsible for adding labels to PersistentVolume
CREATE requests for manually provisioned persistent volumes.

## {{% heading "whatsnext" %}}

- [Dynamic Admission Controllers](/docs/reference/access-authn-authz/extensible-admission-controllers)

