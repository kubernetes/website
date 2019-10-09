---
title: Extend kubectl with plugins
reviewers:
- juanvallejo
- soltysh
description: With kubectl plugins, you can extend the functionality of the kubectl command by adding new subcommands.
content_template: templates/task
---

{{% capture overview %}}

{{< feature-state state="stable" >}}

This guide demonstrates how to install and write extensions for [kubectl](/docs/reference/kubectl/kubectl/). By thinking of core `kubectl` commands as essential building blocks for interacting with a Kubernetes cluster, a cluster administrator can think
of plugins as a means of utilizing these building blocks to create more complex behavior. Plugins extend `kubectl` with new sub-commands, allowing for new and custom features not included in the main distribution of `kubectl`.

{{% /capture %}}

{{% capture prerequisites %}}

You need to have a working `kubectl` binary installed.

{{< note >}}
Plugins were officially introduced as an alpha feature in the v1.8.0 release. They have been re-worked in the v1.12.0 release to support a wider range of use-cases. So, while some parts of the plugins feature were already available in previous versions, a `kubectl` version of 1.12.0 or later is recommended if you are following these docs.
{{< /note >}}

{{% /capture %}}

{{% capture steps %}}

## Installing kubectl plugins

A plugin is nothing more than a standalone executable file, whose name begins with `kubectl-`. To install a plugin, simply move this executable file to anywhere on your PATH.

{{< note >}}
Kubernetes does not provide a package manager or anything similar to install or update plugins. It is your responsibility to ensure that plugin executables have a filename that begins with `kubectl-`, and that they are placed somewhere on your PATH.
{{< /note >}}

### Discovering plugins

`kubectl` provides a command `kubectl plugin list` that searches your PATH for valid plugin executables.
Executing this command causes a traversal of all files in your PATH. Any files that are executable, and begin with `kubectl-` will show up *in the order in which they are present in your PATH* in this command's output.
A warning will be included for any files beginning with `kubectl-` that are *not* executable.
A warning will also be included for any valid plugin files that overlap each other's name.

#### Limitations

It is currently not possible to create plugins that overwrite existing `kubectl` commands. For example, creating a plugin `kubectl-version` will cause that plugin to never be executed, as the existing `kubectl version` command will always take precedence over it. Due to this limitation, it is also *not* possible to use plugins to add new subcommands to existing `kubectl` commands. For example, adding a subcommand `kubectl create foo` by naming your plugin `kubectl-create-foo` will cause that plugin to be ignored. Warnings will appear under the output of `kubectl plugin list` for any valid plugins that attempt to do this.

## Writing kubectl plugins

You can write a plugin in any programming language or script that allows you to write command-line commands.

There is no plugin installation or pre-loading required. Plugin executables receive the inherited environment from the `kubectl` binary.
A plugin determines which command path it wishes to implement based on its name. For example, a plugin wanting to provide a new command
`kubectl foo`, would simply be named `kubectl-foo`, and live somewhere in the user's PATH.

### Example plugin

```
#!/bin/bash

# optional argument handling
if [[ "$1" == "version" ]]
then
    echo "1.0.0"
    exit 0
fi

# optional argument handling
if [[ "$1" == "config" ]]
then
    echo $KUBECONFIG
    exit 0
fi

echo "I am a plugin named kubectl-foo"
```

### Using a plugin

To use the above plugin, simply make it executable:

```
sudo chmod +x ./kubectl-foo
```

and place it anywhere in your PATH:

```
sudo mv ./kubectl-foo /usr/local/bin
```

You may now invoke your plugin as a `kubectl` command:

```
kubectl foo
```
```
I am a plugin named kubectl-foo
```

All args and flags are passed as-is to the executable:

```
kubectl foo version
```
```
1.0.0
```

All environment variables are also passed as-is to the executable:

```bash
export KUBECONFIG=~/.kube/config
kubectl foo config
```
```
/home/<user>/.kube/config
```

```shell
KUBECONFIG=/etc/kube/config kubectl foo config
```
```
/etc/kube/config
```

Additionally, the first argument that is passed to a plugin will always be the full path to the location where it was invoked (`$0` would equal `/usr/local/bin/kubectl-foo` in our example above).

### Naming a plugin

As seen in the example above, a plugin determines the command path that it will implement based on its filename. Every sub-command in the command path that a plugin targets, is separated by a dash (`-`).
For example, a plugin that wishes to be invoked whenever the command `kubectl foo bar baz` is invoked by the user, would have the filename of `kubectl-foo-bar-baz`.

#### Flags and argument handling

{{< note >}}
Unlike previous versions of `kubectl`, the plugin mechanism will _not_ create any custom, plugin-specific values or environment variables to a plugin process.
This means that environment variables such as `KUBECTL_PLUGINS_CURRENT_NAMESPACE` are no longer provided to a plugin. Plugins must parse all of the arguments passed to them by a user,
and handle flag validation as part of their own implementation. For plugins written in Go, a set of utilities has been provided under [k8s.io/cli-runtime](https://github.com/kubernetes/cli-runtime) to assist with this.
{{< /note >}}

Taking our `kubectl-foo-bar-baz` plugin from the above scenario, we further explore additional cases where users invoke our plugin while providing additional flags and arguments.
For example, in a situation where a user invokes the command `kubectl foo bar baz arg1 --flag=value arg2`, the plugin mechanism will first try to find the plugin with the longest possible name, which in this case
would be `kubectl-foo-bar-baz-arg1`. Upon not finding that plugin, it then treats the last dash-separated value as an argument (`arg1` in this case), and attempts to find the next longest possible name, `kubectl-foo-bar-baz`.
Upon finding a plugin with this name, it then invokes that plugin, passing all args and flags after its name to the plugin executable.

Example:

```bash
# create a plugin
echo -e '#!/bin/bash\n\necho "My first command-line argument was $1"' > kubectl-foo-bar-baz
sudo chmod +x ./kubectl-foo-bar-baz

# "install" our plugin by placing it on our PATH
sudo mv ./kubectl-foo-bar-baz /usr/local/bin

# ensure our plugin is recognized by kubectl
kubectl plugin list
```
```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-foo-bar-baz
```
```
# test that calling our plugin via a "kubectl" command works
# even when additional arguments and flags are passed to our
# plugin executable by the user.
kubectl foo bar baz arg1 --meaningless-flag=true
```
```
My first command-line argument was arg1
```

As you can see, our plugin was found based on the `kubectl` command specified by a user, and all extra arguments and flags were passed as-is to the plugin executable once it was found.

#### Names with dashes and underscores

Although the `kubectl` plugin mechanism uses the dash (`-`) in plugin filenames to separate the sequence of sub-commands processed by the plugin, it is still possible to create a plugin
command containing dashes in its commandline invocation by using underscores (`_`) in its filename.

Example:

```bash
# create a plugin containing an underscore in its filename
echo -e '#!/bin/bash\n\necho "I am a plugin with a dash in my name"' > ./kubectl-foo_bar
sudo chmod +x ./kubectl-foo_bar

# move the plugin into your PATH
sudo mv ./kubectl-foo_bar /usr/local/bin

# our plugin can now be invoked from `kubectl` like so:
kubectl foo-bar
```
```
I am a plugin with a dash in my name
```

Note that the introduction of underscores to a plugin filename does not prevent us from having commands such as `kubectl foo_bar`.
The command from the above example, can be invoked using either a dash (`-`) or an underscore (`_`):

```bash
# our plugin can be invoked with a dash
kubectl foo-bar
```
```
I am a plugin with a dash in my name
```

```bash
# it can also be invoked using an underscore
kubectl foo_bar
```
```
I am a plugin with a dash in my name
```

#### Name conflicts and overshadowing

It is possible to have multiple plugins with the same filename in different locations throughout your PATH.
For example, given a PATH with the following value: `PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins`, a copy of plugin `kubectl-foo` could exist in `/usr/local/bin/plugins` and `/usr/local/bin/moreplugins`,
such that the output of the `kubectl plugin list` command is:

```bash
PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins kubectl plugin list
```
```bash
The following kubectl-compatible plugins are available:

/usr/local/bin/plugins/kubectl-foo
/usr/local/bin/moreplugins/kubectl-foo
  - warning: /usr/local/bin/moreplugins/kubectl-foo is overshadowed by a similarly named plugin: /usr/local/bin/plugins/kubectl-foo

error: one plugin warning was found
```

In the above scenario, the warning under `/usr/local/bin/moreplugins/kubectl-foo` tells us that this plugin will never be executed. Instead, the executable that appears first in our PATH, `/usr/local/bin/plugins/kubectl-foo`, will always be found and executed first by the `kubectl` plugin mechanism.

A way to resolve this issue is to ensure that the location of the plugin that you wish to use with `kubectl` always comes first in your PATH. For example, if we wanted to always use `/usr/local/bin/moreplugins/kubectl-foo` anytime that the `kubectl` command `kubectl foo` was invoked, we would simply change the value of our PATH to be `PATH=/usr/local/bin/moreplugins:/usr/local/bin/plugins`.

#### Invocation of the longest executable filename

There is another kind of overshadowing that can occur with plugin filenames. Given two plugins present in a user's PATH `kubectl-foo-bar` and `kubectl-foo-bar-baz`, the `kubectl` plugin mechanism will always choose the longest possible plugin name for a given user command. Some examples below, clarify this further:

```bash
# for a given kubectl command, the plugin with the longest possible filename will always be preferred
kubectl foo bar baz
```
```
Plugin kubectl-foo-bar-baz is executed
```

```bash
kubectl foo bar
```
```
Plugin kubectl-foo-bar is executed
```

```bash
kubectl foo bar baz buz
```
```
Plugin kubectl-foo-bar-baz is executed, with "buz" as its first argument
```

```bash
kubectl foo bar buz
```
```
Plugin kubectl-foo-bar is executed, with "buz" as its first argument
```

This design choice ensures that plugin sub-commands can be implemented across multiple files, if needed, and that these sub-commands can be nested under a "parent" plugin command:

```bash
ls ./plugin_command_tree
```
```
kubectl-parent
kubectl-parent-subcommand
kubectl-parent-subcommand-subsubcommand
```

### Checking for plugin warnings

You can use the aforementioned `kubectl plugin list` command to ensure that your plugin is visible by `kubectl`, and verify that there are no warnings preventing it from being called as a `kubectl` command.

```bash
kubectl plugin list
```
```
The following kubectl-compatible plugins are available:

test/fixtures/pkg/kubectl/plugins/kubectl-foo
/usr/local/bin/kubectl-foo
  - warning: /usr/local/bin/kubectl-foo is overshadowed by a similarly named plugin: test/fixtures/pkg/kubectl/plugins/kubectl-foo
plugins/kubectl-invalid
  - warning: plugins/kubectl-invalid identified as a kubectl plugin, but it is not executable

error: 2 plugin warnings were found
```

### Using the command line runtime package

As part of the plugin mechanism update in the v1.12.0 release, an additional set of utilities have been made available to plugin authors. These utilities
exist under the [k8s.io/cli-runtime](https://github.com/kubernetes/cli-runtime) repository, and can be used by plugins written in Go to parse and update
a user's KUBECONFIG file, obtain REST clients to talk to the API server, and automatically bind flags associated with configuration and printing.

Plugins *do not* have to be written in Go in order to be recognized as valid plugins by `kubectl`, but they do have to use Go in order to take advantage of
the tools and utilities in the CLI Runtime repository.

See the [Sample CLI Plugin](https://github.com/kubernetes/sample-cli-plugin) for an example usage of the tools provided in the CLI Runtime repo.

{{% /capture %}}

{{% capture whatsnext %}}

* Check the Sample CLI Plugin repository for [a detailed example](https://github.com/kubernetes/sample-cli-plugin) of a plugin written in Go.
* In case of any questions, feel free to reach out to the [CLI SIG team](https://github.com/kubernetes/community/tree/master/sig-cli).
* Binary plugins are a beta feature, so this is the time to contribute ideas and improvements to the codebase. We're also excited to hear about what you're planning to implement with plugins, so [let us know](https://github.com/kubernetes/community/tree/master/sig-cli)!

{{% /capture %}}


