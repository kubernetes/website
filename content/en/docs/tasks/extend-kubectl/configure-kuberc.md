---
title: Configure kubectl with a kuberc file
description: >-
  Configure kubectl defaults, aliases, and credential plugin policy using kuberc.
content_type: task
---

<!-- overview -->

This page shows how to write a `kuberc` file to customize default options and
define command aliases for kubectl. Start with one default option, then add
shortcuts, preset arguments, and a credential plugin policy.

For background and detailed feature behavior, see
[Kubectl user preferences (kuberc)](/docs/reference/kubectl/kuberc/).

A `kuberc` file configures kubectl preferences. To access a cluster with commands
such as `kubectl get pods`, configure connection and authentication settings in a
separate kubeconfig file. See
[Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
for instructions on writing one.

{{< feature-state state="beta" for_k8s_version="1.34" >}}

## {{% heading "prerequisites" %}}

* [Install kubectl](/docs/tasks/tools/) v1.34 or later.
  Check your client version by running `kubectl version --client`.
* Have a text editor and a directory where you can save the example file.
* If you previously disabled kuberc, ensure that `KUBERC` is not set to `off`
  and `KUBECTL_KUBERC` is not set to `false`.

You do not need a running cluster for the main exercise, which generates
manifests using `--dry-run=client`. The optional examples that access cluster
resources require a configured kubeconfig, a running cluster, and appropriate
permissions. You do not need to change any API server feature gates.

The platform-specific examples use a POSIX shell, such as Bash or Zsh, on
Linux and macOS, and PowerShell on Windows. The shared YAML and kubectl
commands work on all three operating systems.

<!-- steps -->

## Set a default output format

A default option saves you from typing the same flag each time you run a
command. Start by configuring `kubectl create configmap` to print YAML.
The example generates a manifest locally so that you can try the setting
without creating a resource in a cluster.

1. In your current directory, create a file named `kuberc-example` with the
   following contents. If that file already exists, choose a different name
   and use that name in the commands below. Save the file as UTF-8 text.
   On Windows, ensure that your editor does not append `.txt` to the filename.

   ```yaml
   apiVersion: kubectl.config.k8s.io/v1beta1
   kind: Preference
   defaults:
   - command: create configmap
     options:
     - name: output
       default: yaml
   ```

   The `defaults` entry sets `output` to `yaml` for `create configmap`.
   Use the long option name without leading dashes, such as `output` rather
   than `-o` or `--output`. Each `default` must be a string; quote values such
   as `"true"` or `"10"`. See
   [defaults](/docs/reference/kubectl/kuberc/#defaults) for more examples.

1. Generate a ConfigMap manifest using your example file:

   ```shell
   kubectl --kuberc=kuberc-example create configmap kuberc-demo --from-literal=mode=demo --dry-run=client
   ```

   The `--kuberc` option selects your preferences file. The command uses
   your default output format, so you do not need to pass `--output=yaml`.
   The `--from-literal=mode=demo` option supplies sample ConfigMap data.
   The explicit `--dry-run=client` keeps the operation local. The output is:

   ```yaml
   apiVersion: v1
   data:
     mode: demo
   kind: ConfigMap
   metadata:
     name: kuberc-demo
   ```

## Override a default for one command

You can choose a different option value for a single invocation without
editing your preferences. To print the same manifest as JSON, explicitly
pass `--output=json`:

```shell
kubectl --kuberc=kuberc-example create configmap kuberc-demo --from-literal=mode=demo --dry-run=client --output=json
```

An option passed on the command line takes precedence over the configured
default. Your file still specifies YAML for subsequent invocations.

## Create a command shortcut

An alias gives a frequently used command a shorter, memorable name. This
example defines `previewcm` to generate a ConfigMap manifest locally as YAML.
You will still supply the ConfigMap name and data when you run the alias.
For alias configuration details, see
[aliases](/docs/reference/kubectl/kuberc/#aliases).

The remaining examples update `kuberc-example`. If you use another file,
replace `--kuberc=kuberc-example` with its path. Add entries under the
existing `defaults` or `aliases` list, and replace an existing entry when
modifying it. Do not create duplicate top-level keys or duplicate entries
for the same command or alias.

1. Add this `aliases` section to your file, keeping the existing `defaults`:

   ```yaml
   aliases:
   - name: previewcm
     command: create configmap
     options:
     - name: dry-run
       default: client
     - name: output
       default: yaml
   ```

   The alias sets both `dry-run` and `output`. Defaults configured for a
   built-in command do **not** apply to its aliases, so set the options you
   need under the alias itself.

1. Run the shortcut:

   ```shell
   kubectl --kuberc=kuberc-example previewcm kuberc-demo --from-literal=mode=demo
   ```

   The shortcut prints the same YAML manifest as the first example and does
   not create anything in a cluster.

## Supply arguments automatically

An alias can also supply arguments that you would otherwise type each time.
Use `appendArgs` for arguments added after yours, or `prependArgs` for
arguments inserted before yours.

### Append preset ConfigMap data

Extend `previewcm` to include the same `mode=demo` data each time. This lets
you generate the example manifest by supplying only its name.

1. Replace the existing `previewcm` entry with this version:

   ```yaml
   - name: previewcm
     command: create configmap
     options:
     - name: dry-run
       default: client
     - name: output
       default: yaml
     appendArgs:
     - --from-literal=mode=demo
   ```

1. Run the alias without repeating the literal value:

   ```shell
   kubectl --kuberc=kuberc-example previewcm kuberc-demo
   ```

   kubectl appends `--from-literal=mode=demo` and prints the same YAML
   manifest. The alias still generates the manifest locally.

For more argument combinations, including passing arguments after `--`, see
[appendArgs](/docs/reference/kubectl/kuberc/#appendargs).

### Prepend a resource type for listing Pods

A resource shortcut can save you from typing the resource type for each
request. This example defines `getpods` to list Pods in wide format.
It requires cluster access and permission to list Pods.

Add this entry to the existing `aliases` list, keeping `previewcm`:

```yaml
- name: getpods
  command: get
  prependArgs:
  - pods
  options:
  - name: output
    default: wide
```

Run the shortcut:

```shell
kubectl --kuberc=kuberc-example getpods --namespace=default
```

This is equivalent to `kubectl get pods --namespace=default --output=wide`.
You can pass additional arguments and options, such as a Pod name,
`--selector=app=example`, or `--output=json`.

Here, `command` names the `get` command, and `prependArgs` supplies the
`pods` resource type. See
[prependArgs](/docs/reference/kubectl/kuberc/#prependargs) for further examples.

## Set defaults for apply and delete

To use [Server-Side Apply](/docs/reference/using-api/server-side-apply/) and
request confirmation before deleting resources, add these entries under
`defaults`:

```yaml
- command: apply
  options:
  - name: server-side
    default: "true"
- command: delete
  options:
  - name: interactive
    default: "true"
```

These defaults apply when you run `kubectl apply` or `kubectl delete`.
Explicitly passing `--server-side=false` or `--interactive=false` overrides
the corresponding preference for that invocation. For additional
recommendations, see
[suggested defaults](/docs/reference/kubectl/kuberc/#suggested-defaults).

## Use your preferences for subsequent commands

To load preferences without passing `--kuberc` each time, create or edit the
file at the default location for your operating system. If you already have
a kuberc file, merge the settings you want to keep into it, preserving
existing preferences and credential plugin policy. Otherwise, copy the
contents of the example file into the new file.

{{< tabs name="kuberc-default-location" >}}
{{% tab name="Linux and macOS" %}}

Create the default directory if it does not exist:

```shell
mkdir -p "$HOME/.kube"
```

Use your text editor to create or edit `$HOME/.kube/kuberc` and save your
preferences there. Then unset `KUBERC` in the current shell so that kubectl
uses the default file, and try the alias without `--kuberc`:

```shell
unset KUBERC
kubectl previewcm kuberc-demo
```

{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

Create the default directory if it does not exist:

```powershell
New-Item -ItemType Directory -Path "$env:USERPROFILE\.kube" -Force | Out-Null
```

Use your text editor to create or edit
`$env:USERPROFILE\.kube\kuberc` and save your preferences as UTF-8 text.
Ensure that the filename is `kuberc`, without a `.txt` extension.
Then remove `KUBERC` from the current PowerShell session so that kubectl
uses the default file, and try the alias without `--kuberc`:

```powershell
Remove-Item Env:\KUBERC -ErrorAction SilentlyContinue
kubectl previewcm kuberc-demo
```

{{% /tab %}}
{{< /tabs >}}

This is a local configuration file; do not use `kubectl apply` to install it.

With kubectl v1.35 or later, you can also set the `KUBERC` environment
variable to the path of your preferred file. With kubectl v1.34, use
`--kuberc` or the default location instead. From the directory containing
`kuberc-example`, use the commands for your shell:

{{< tabs name="kuberc-custom-location" >}}
{{% tab name="Linux and macOS" %}}

```shell
export KUBERC="$PWD/kuberc-example"
kubectl previewcm kuberc-demo
```

To return to the default location, run `unset KUBERC`.

{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

```powershell
$env:KUBERC = (Resolve-Path -LiteralPath .\kuberc-example).Path
kubectl previewcm kuberc-demo
```

To return to the default location, run:

```powershell
Remove-Item Env:\KUBERC -ErrorAction SilentlyContinue
```

{{% /tab %}}
{{< /tabs >}}

These assignments affect the current shell session and programs launched
from it. Kubectl v1.35 and later select a single kuberc file in this order:

1. The file specified by `--kuberc`.
1. The file specified by `KUBERC`.
1. The default path for your operating system.

It does not merge preferences from these locations. The selected preferences
apply regardless of which kubeconfig or context you use; kuberc does not
automatically select preferences by context. Use separate kuberc files for
different workflows if needed. For scripts that need predictable behavior,
explicitly pass the options they depend on or disable kuberc for that
invocation.

## Edit preferences from the command line

With kubectl v1.36 or later, you can use `kubectl kuberc set` instead of
editing YAML. For example, add wide output as the default for `get` in
your example file:

```shell
kubectl kuberc set --kuberc=kuberc-example --section=defaults --command=get --option=output=wide
```

Inspect the saved preferences:

```shell
kubectl kuberc view --kuberc=kuberc-example
```

If a command or alias entry already exists, `set` requires `--overwrite` to
replace it. For example, change the `get` output default to JSON:

```shell
kubectl kuberc set --kuberc=kuberc-example --section=defaults --command=get --option=output=json --overwrite
```

When replacing an entry's options, include all the options you want to keep.
For the full options and examples for managing defaults, aliases, and
credential policies, see
[`kubectl kuberc set`](/docs/reference/kubectl/generated/kubectl_kuberc/kubectl_kuberc_set/)
and [`kubectl kuberc view`](/docs/reference/kubectl/generated/kubectl_kuberc/kubectl_kuberc_view/).

## Control exec credential plugins

Use a credential plugin policy to control which authentication helpers
kubectl can execute from your kubeconfig. For example, you can restrict
execution to helpers required by your provider that you trust.

Credential plugin policies are available in kubectl v1.35 and later. The
`command` field used in the following example requires v1.36 or later.
Add these top-level fields to allow a trusted helper:

```yaml
credentialPluginPolicy: Allowlist
credentialPluginAllowlist:
- command: my-trusted-credential-helper
```

Replace `my-trusted-credential-helper` with the actual helper required by your
provider and installed on your computer. Add an entry for each helper you
trust. Check your provider's documentation before restricting plugins;
omitting a required helper can prevent authentication to your cluster.

For other policy choices, including `AllowAll` and `DenyAll`, see
[credential plugin policy](/docs/reference/kubectl/kuberc/#credentialpluginpolicy).
For valid entries and command matching rules, see
[credentialPluginAllowlist](/docs/reference/kubectl/kuberc/#credentialpluginallowlist).

<!-- discussion -->

## Troubleshoot your preferences

If kubectl does not use the preferences you expect, check your client
version, the selected file path, and whether you have disabled kuberc.
Also check that option names use their long form and that default values
are strings. Invalid YAML, an unknown option, or a value that the option
cannot accept can prevent your preferences from working.

Add `--v=5` to a command to see additional diagnostics when kubectl reads
the preference file. To check a credential policy, use a command that
authenticates to your cluster; a client dry run does not test whether a
credential plugin can run.

To compare behavior without preferences, set `KUBERC` to `off` and run
kubectl **without** `--kuberc`. See
[Disable kuberc](/docs/reference/kubectl/kuberc/#disable-kuberc) for the feature
settings. To disable preferences temporarily for one command:

{{< tabs name="kuberc-disable-preferences" >}}
{{% tab name="Linux and macOS" %}}

Set `KUBERC` only for this command:

```shell
KUBERC=off kubectl create configmap kuberc-demo \
  --from-literal=mode=demo --dry-run=client --output=yaml
```

{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}

Save the current value and restore it after running the command:

```powershell
$previousKuberc = $env:KUBERC
try {
    $env:KUBERC = 'off'
    kubectl create configmap kuberc-demo `
      --from-literal=mode=demo --dry-run=client --output=yaml
} finally {
    if ($null -eq $previousKuberc) {
        Remove-Item Env:\KUBERC -ErrorAction SilentlyContinue
    } else {
        $env:KUBERC = $previousKuberc
    }
}
```

{{% /tab %}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* Read about [kubectl user preferences](/docs/reference/kubectl/kuberc/).
* Consult the [kuberc v1beta1 API reference](/docs/reference/config-api/kuberc.v1beta1/).
* Review [kubectl usage conventions](/docs/reference/kubectl/conventions/)
  when writing scripts.
