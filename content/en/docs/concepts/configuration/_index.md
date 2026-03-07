---
title: "Configuration"
weight: 80
description: >
  Configuration mechanisms within Kubernetes.
simple_list: true
---

Kubernetes provides ways to _separate configuration from code_. This is a common
practice that aligns with DevOps as a practice, and with cloud native architecture.

If you have a {{< glossary_tooltip text="container image" term_id="image" >}} that
allows separate configuration, you can deploy the **same** application code in
different contexts. For example, you can run tests against the built image, and
then run that exact same image in a production context. Doing that gives you
better confidence in your testing, compared with if you deployed the application
one way for tests and a different way in production.

If you wanted to learn about configuring the `kubectl` command line tool,
read [configure access to multiple clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

<!-- body -->
## Kubernetes configuration-related APIs {#api-kinds}

Kubernetes provides two main API kinds that you can use to store configuration,
ready for a Pod (or other component) to load and use:
[ConfigMap](/docs/concepts/configuration/configmap/), and
[Secret](/docs/concepts/configuration/secret/).

The special-use
[CertificateSigningRequest](/docs/reference/access-authn-authz/certificate-signing-requests/#certificate-signing-requests)
and
[ClusterTrustBundle](/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles)
API kinds also hold configuration data that's relevant to some specific cases,
such as TLS configuration.

All of these mechanisms can be shared across multiple Pods. You typically don't
have to write the configuration out once per Pod, and you should design applications
where possible so that they can work with shared configuration.

To learn about using configuration in your applications, read
[inject data into applications](/docs/tasks/inject-data-application/).

### ConfigMaps

{{< glossary_definition term_id="configmap" prepend="A ConfigMap is" length="all" >}}

### Secrets

A Secret is an object that contains an amount of confidential data,
such as a password, a token, or a key.

Secrets are similar to {{< glossary_tooltip text="ConfigMaps" term_id="configmap" >}}
but are specifically intended to hold confidential data. Read the page about [Secrets](/docs/concepts/configuration/secret/)
to learn about the benefits (and limitations) around information security and Secrets.

## Configuration via sidecar containers or init containers {#config-helper-overview}

You can also use an 
{{< glossary_tooltip text="init container" term_id="init-container" >}} or a
{{< glossary_tooltip text="sidecar container" term_id="sidecar-container" >}}
to provide configuration to your workload.

This is useful if you already have some means, outside of Kubernetes, to store
configuration or security keys or other information that your containers must
use, and that shouldn't be stored in container images.

### Sidecar container helper {#config-helper-sidecar}

A _sidecar_ configuration helper runs in the same Pod as the application container, so
each Pod has its own sidecar. A typical configuration sidecar fetches configuration data over the
Pod network, and then writes it into a {{< glossary_tooltip text="volume" term_id="volume" >}}
that is mounted into both containers.

There are many variations on this basic pattern, that still have a helper
container writing configuration for the app container to consume.

### Init container helper {#config-helper-init-container}

Pods can have _init_ containers that start before the main application. Unlike sidecars,
init containers complete before the Pod's main (application) containers start up, so the
configuration only gets set once.

You have two main options for configuration using init containers:

#### Configuration via the filesystem {#init-container-shared-volume}

With this option, the init container fetches configuration and writes the configuration to
a file, or several files, typically to a Pod-local
{{< glossary_tooltip text="volume" term_id="volume" >}}.

#### Configuration via environment variables {#init-container-env-files}

{{< feature-state feature_gate_name="EnvFiles" >}}

This is done using a local volume, but only the init container mounts that volume. The kubelet then reads from that volume before starting the app container.

Read [Define Environment Variable Values Using An Init Container](/docs/tasks/inject-data-application/define-environment-variable-via-file/)
to learn more.

## Cluster configuration

Depending on the role you have, you may also need to configure your cluster.
To learn more about that, read
[cluster administration](/docs/concepts/cluster-administration/) and
look through the list of [cluster administration tasks](/docs/tasks/administer-cluster/).

## {{% heading "whatsnext" %}}

The following links are all relevant to the overall idea of _configuration_ and Kubernetes:

* [Configure Pods and Containers](/docs/tasks/configure-pod-container/)
* [Inject Data Into Applications](/docs/tasks/inject-data-application/)
* [Policies](/docs/concepts/policy/), another form of configuration
* [Management of Kubernetes Objects Using Configuration Files](/docs/tasks/manage-kubernetes-objects/declarative-config/),
  which is about Kubernetes {{< glossary_tooltip text="manifests" term_id="manifest" >}}
  * [Kubernetes Object Management](/docs/concepts/overview/working-with-objects/object-management/) is also about object management / configuration
* [Configure Redis Using A ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).
  a tutorial
* [Updating Configuration via a ConfigMap](/docs/tutorials/configuration/updating-configuration-via-a-configmap/)
  (another tutorial)

and you can review the [list of configuration file formats](/docs/reference/config-api/)
in the reference section.

Within **this** section of the documentation, you can read about:  
