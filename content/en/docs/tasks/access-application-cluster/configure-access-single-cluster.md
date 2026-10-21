---
title: Configure Access to a Single Cluster
description: >-
  Set up a kubeconfig file to access a single existing Kubernetes cluster with kubectl.
content_type: task
weight: 25
---

<!-- overview -->

This page shows how to configure kubectl to access one existing cluster using
a supplied kubeconfig file or your cluster's connection details. For background,
see [Organizing Cluster Access Using kubeconfig Files](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

## {{% heading "prerequisites" %}}

* Have a running Kubernetes cluster. If you do not have one, create a local
  cluster with [Minikube](https://minikube.sigs.k8s.io/docs/start/) or choose
  another [learning environment](/docs/setup/learning-environment/).
* [Install kubectl](/docs/tasks/tools/). Its version should be
  [within one minor version](/releases/version-skew-policy/#kubectl) of your
  cluster's API server. Check your client version with `kubectl version --client`.
* Ensure your computer can reach the cluster's API server, using a VPN if required.
* Have a text editor and a private working directory.

Shell examples use Bash or Zsh on Linux and macOS, and PowerShell on Windows.

<!-- steps -->

## Obtain your cluster access information

Ask your cluster administrator or provider for a personal kubeconfig file or
the information below. The example values match the commands later in this task;
replace them with the values for your cluster.

{{< table caption="Examples and sources of cluster access information" >}}

| Information | Example | Where to obtain it |
| :--- | :--- | :--- |
| API server address | `https://api.example.com:6443` | Your administrator or the cluster provider's connection instructions. |
| Trusted certificate authority (CA) certificate | A PEM file named `ca.crt` | Ask your administrator for the file. A provider-generated kubeconfig already records the required CA file or data. Omit a separate CA file if the server certificate is trusted by your operating system. |
| Authentication method | A credential plugin such as `example-credential-plugin`, or a signed client certificate | Your provider's login instructions or your administrator's certificate enrollment process. |
| Namespace and permissions | Namespace `default`, with permission to list Pods | Your administrator or the provider's access policy. |

{{< /table >}}

For managed clusters, follow the provider's kubeconfig instructions, such as
[Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html),
[Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl),
or [Azure Kubernetes Service](https://learn.microsoft.com/en-us/azure/aks/learn/quick-kubernetes-deploy-cli#connect-to-the-cluster).
These instructions also explain any required login tools.

For kubeadm clusters, administrators can refer to
[Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users).

{{< warning >}}
Only use trusted kubeconfig files. They can execute credential plugins or read
local files. Inspect unfamiliar files before use.
{{< /warning >}}

### Try the task with Minikube

For a local example, install Minikube and a supported container or virtual-machine
manager using the [Minikube getting started guide](https://minikube.sigs.k8s.io/docs/start/).

1. Start the default Minikube cluster:

    ```shell
    minikube start --profile=minikube
    ```

    Minikube creates a `minikube` context with the API server address and local
    certificate settings, so you do not need to collect these values manually.

1. In your private working directory, choose an unused filename such as
    `cluster-config` and export that context:

   {{< tabs name="single-cluster-minikube-export" >}}
   {{% tab name="Linux and macOS" %}}

   ```shell
   kubectl config view --context=minikube --minify --flatten --raw > cluster-config
   ```

   {{% /tab %}}
   {{% tab name="Windows" %}}

   ```powershell
   kubectl config view --context=minikube --minify --flatten --raw | Set-Content -Path cluster-config -Encoding utf8
   ```

   {{% /tab %}}
   {{< /tabs >}}

    `--flatten` embeds the certificate files, and `--raw` preserves credentials
    instead of redacting them. This file contains a private key; keep it private.

Continue with [Verify access to the cluster](#verify-access-to-the-cluster).
Your file is `cluster-config` and your context is `minikube`; skip the manual
configuration sections below.

## Use a supplied kubeconfig file

Follow your provider's setup instructions, including installing and signing in
to any credential plugin. For certificate authentication, use a locally generated
private key; see the [client certificate workflow](#configure-credentials).

1. Save the kubeconfig as `cluster-config` in your working directory. If it
    already exists, choose another name and use it below. Preserve referenced
    certificate and key paths; relative paths are resolved from the kubeconfig
    file's directory.

1. List the contexts in the supplied file:

    ```shell
    kubectl --kubeconfig=cluster-config config get-contexts
    ```

1. Select your cluster's context, replacing `CONTEXT_NAME` with a name from the
    output:

    ```shell
    kubectl --kubeconfig=cluster-config config use-context CONTEXT_NAME
    ```

Continue with [Verify access to the cluster](#verify-access-to-the-cluster).

## Create a kubeconfig from connection information

Start in a directory without a `cluster-config` file. These commands create it
without changing your existing kubeconfig. Replace the server URL, certificate
paths, and namespace with your cluster's values. You can keep the local names
`my-cluster`, `my-user`, and `my-context` as shown.

### Configure the cluster

Save your cluster's trusted CA certificate as `ca.crt`, then record it and the
API server address using
[`kubectl config set-cluster`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set-cluster/):

```shell
kubectl --kubeconfig=cluster-config config set-cluster my-cluster --server=https://api.example.com:6443 --certificate-authority=ca.crt --embed-certs=true
```

`--embed-certs=true` stores the certificate in the kubeconfig. If the server's
certificate is trusted by your operating system, omit `--certificate-authority`
and `--embed-certs`.

### Configure credentials

Use
[`kubectl config set-credentials`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set-credentials/)
to create an entry named `my-user` under `users` in `cluster-config`. This entry
tells kubectl which credential plugin or certificate and key to use. Choose one
of the following authentication methods.

{{< tabs name="single-cluster-authentication" >}}
{{% tab name="Credential plugin" %}}

A credential plugin retrieves credentials when kubectl connects to the API server.

1. Install the plugin and sign in using your provider's instructions. Its
    executable must be on `PATH`, or specified by its full path.

1. Configure the plugin, replacing `example-credential-plugin` with its executable:

    ```shell
    kubectl --kubeconfig=cluster-config config set-credentials my-user --exec-command=example-credential-plugin --exec-api-version=client.authentication.k8s.io/v1 --exec-interactive-mode=IfAvailable
    ```

    Use the API version and interactive mode required by your provider. Add
    `--exec-arg=VALUE` and `--exec-env=NAME=VALUE` for required arguments and
    environment variables. The plugin's response must match `--exec-api-version`.
    See [client-go credential plugins](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)
    for details.

{{% /tab %}}
{{% tab name="Client certificate" %}}

Use this method if your cluster supports X.509 client certificates. It requires
the `openssl` command-line tool.

1. If you need a new certificate, generate a private key and certificate signing
    request (CSR). Use unused filenames, and replace `YOUR_USERNAME` with the
    username agreed with your administrator, such as `jane`:

    ```shell
    openssl genrsa -out my-user.key 3072
    openssl req -new -key my-user.key -out my-user.csr -subj "/CN=YOUR_USERNAME"
    ```

1. If you generated a CSR, send only `my-user.csr` to your administrator; keep
    `my-user.key` locally. Save the signed certificate as `my-user.crt`.

    Your administrator can follow the
    [CertificateSigningRequest workflow](/docs/tasks/tls/certificate-issue-client-csr/)
    where supported, using existing cluster access and the required permissions.

1. Record your certificate and key:

    ```shell
    kubectl --kubeconfig=cluster-config config set-credentials my-user --client-certificate=my-user.crt --client-key=my-user.key --embed-certs=true
    ```

    This embeds the certificate and private key in `cluster-config`.
    Protect that file as you would the private key.

{{% /tab %}}
{{< /tabs >}}

### Configure and select a context

A context saves the cluster, credential entry, and namespace to use together.

1. Create a context that connects to `my-cluster` using the credentials saved as
    `my-user`, with `default` as its namespace. Use
    [`kubectl config set-context`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set-context/):

    ```shell
    kubectl --kubeconfig=cluster-config config set-context my-context --cluster=my-cluster --user=my-user --namespace=default
    ```

    Here, `--user=my-user` selects the entry from the previous section. If that
    entry uses a certificate issued to `jane`, the cluster authenticates you as
    `jane`; `my-user` simply names the stored credentials in your file.

1. Select it:

    ```shell
    kubectl --kubeconfig=cluster-config config use-context my-context
    ```

1. Inspect the configuration:

    ```shell
    kubectl --kubeconfig=cluster-config config view --minify
    ```

    For the credential-plugin example, the output is similar to:

    ```yaml
    apiVersion: v1
    clusters:
    - cluster:
        certificate-authority-data: DATA+OMITTED
        server: https://api.example.com:6443
      name: my-cluster
    contexts:
    - context:
        cluster: my-cluster
        namespace: default
        user: my-user
      name: my-context
    current-context: my-context
    kind: Config
    users:
    - name: my-user
      user:
        exec:
          apiVersion: client.authentication.k8s.io/v1
          args: null
          command: example-credential-plugin
          env: null
          interactiveMode: IfAvailable
          provideClusterInfo: false
    ```

    `DATA+OMITTED` is redacted output; the saved file contains the actual CA
    certificate. Certificate authentication shows certificate and key fields
    instead of `exec`.

## Verify access to the cluster

Use your assigned namespace in place of `default`.

1. Check the identity recognized by the cluster:

    ```shell
    kubectl --kubeconfig=cluster-config auth whoami
    ```

    Confirm that the username and groups are as expected.

1. Check whether you can list Pods in your namespace:

    ```shell
    kubectl --kubeconfig=cluster-config auth can-i list pods --namespace=default
    ```

    If it returns `no`, ask your administrator for the required permissions.
    Authentication alone does not grant access to resources.

1. If the response is `yes`, list the Pods:

    ```shell
    kubectl --kubeconfig=cluster-config get pods --namespace=default
    ```

    `No resources found` is normal if the namespace has no Pods.

## Use the file with the KUBECONFIG environment variable

`KUBECONFIG` is an environment variable containing paths to kubeconfig files.
When you omit `--kubeconfig`, kubectl merges the files in this list. Paths are
separated by `:` on Linux and macOS, or `;` on Windows. An explicit
`--kubeconfig=cluster-config` selects only that file instead.

For this terminal session, append `cluster-config` to any existing list. This
changes which files kubectl reads; it does not copy their contents into another
file. Earlier files take precedence for duplicate cluster, user, and context
names. If names conflict, continue using `--kubeconfig=cluster-config` for
isolated access. See [Merging kubeconfig files](/docs/concepts/configuration/organize-cluster-access-kubeconfig/#merging-kubeconfig-files).

1. From the directory containing `cluster-config`, save the current setting and
    append the file's absolute path:

   {{< tabs name="single-cluster-kubeconfig-path" >}}
   {{% tab name="Linux and macOS" %}}

   ```shell
   export KUBECONFIG_SAVED="$KUBECONFIG"
   export KUBECONFIG="${KUBECONFIG}:$PWD/cluster-config"
   ```

   {{% /tab %}}
   {{% tab name="Windows" %}}

   ```powershell
   $env:KUBECONFIG_SAVED = $env:KUBECONFIG
   $env:KUBECONFIG = "$env:KUBECONFIG;$PWD\cluster-config"
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. List the available contexts, then name your context when making a request.
    Replace `CONTEXT_NAME` with `my-context` for the manual example or `minikube`
    for the Minikube example. For a supplied file, use the context selected
    earlier. Replace `default` with your assigned namespace:

    ```shell
    kubectl config get-contexts
    kubectl --context=CONTEXT_NAME get pods --namespace=default
    ```

    An earlier file's current context can remain selected. `--context` selects
    the intended context for this command without changing a stored context.

1. When finished, restore the previous setting in the same terminal:

   {{< tabs name="single-cluster-kubeconfig-reset" >}}
   {{% tab name="Linux and macOS" %}}

   ```shell
   export KUBECONFIG="$KUBECONFIG_SAVED"
   ```

   {{% /tab %}}
   {{% tab name="Windows" %}}

   ```powershell
   $env:KUBECONFIG = $env:KUBECONFIG_SAVED
   ```

   {{% /tab %}}
   {{< /tabs >}}

Without `--kubeconfig` or `KUBECONFIG`, kubectl uses
`$HOME/.kube/config` on Linux and macOS, or `$env:USERPROFILE\.kube\config` on
Windows. If `KUBECONFIG` was unset or empty, the commands above select only
`cluster-config`; the default file is not automatically included. To include
other files, follow
[Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
and add their paths to the list. Preserve relative certificate and key paths
when moving a file.

Restrict access to kubeconfig files that contain credentials. On Linux and
macOS, use `chmod 600 cluster-config`. On Windows, use the file's security
settings to restrict access to your account and trusted administrators.

## Use an impersonated identity

Optionally, use impersonation if your administrator has granted permission and
provided the identity to use. For one request, replace `approved-user` below:

```shell
kubectl --kubeconfig=cluster-config --as=approved-user auth whoami
```

For persistent impersonation, edit the user entry selected by your context in
`cluster-config`. Keep its credentials and any plugin arguments or environment
settings. The `users` section for the credential-plugin example becomes:

```yaml
users:
- name: my-user
  user:
    as: approved-user
    as-groups:
    - approved-group
    exec:
      apiVersion: client.authentication.k8s.io/v1
      command: example-credential-plugin
      interactiveMode: IfAvailable
```

Replace `approved-group` with a group your administrator permits you to
impersonate, or omit `as-groups` if none is required. For certificate
authentication, keep your existing certificate and key fields instead of adding
`exec`. Leave the cluster and context sections unchanged. See
[User Impersonation](/docs/reference/access-authn-authz/user-impersonation/)
and the [kubeconfig AuthInfo reference](/docs/reference/config-api/kubeconfig.v1/#AuthInfo).

<!-- discussion -->

## Troubleshoot access

* Connection refusal or timeout: check the server URL, network, and VPN.
* Certificate verification error: confirm the server URL and CA certificate.
* Authentication failure: check credential validity and plugin installation or login.
* `Forbidden`: check the selected identity, namespace, and assigned permissions.

Components such as the
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) and
[kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/) also use
kubeconfig files. Follow their documentation for the required identity and
file settings.

## Customize kubectl preferences

Your kubeconfig provides cluster connection and authentication settings.
A separate, optional `kuberc` file configures kubectl defaults and aliases;
you still use kubeconfig for cluster access.

If authentication uses an exec credential plugin, kuberc's
[credential plugin policy](/docs/reference/kubectl/kuberc/#credential-plugin-policy)
can control whether that plugin may run.

See
[Kubectl user preferences (kuberc)](/docs/reference/kubectl/kuberc/)
for instructions on writing a separate `kuberc` file.

## {{% heading "whatsnext" %}}

* [Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [Organizing Cluster Access Using kubeconfig Files](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [kubeconfig (v1) reference](/docs/reference/config-api/kubeconfig.v1/)
* [`kubectl config` reference](/docs/reference/kubectl/generated/kubectl_config/)
