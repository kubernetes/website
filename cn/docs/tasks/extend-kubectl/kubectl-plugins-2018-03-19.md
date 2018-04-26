---
title: Extend kubectl with plugins
reviewers:
- fabianofranz
description: With kubectl plugins, you can extend the functionality of the kubectl command by adding new subcommands.
---

{% capture overview %}

{% include feature-state-alpha.md %}

This guide shows you how to install and write extensions for [kubectl](/docs/user-guide/kubectl/). Usually called *plugins* or *binary extensions*, this feature allows you to extend the default set of commands available in `kubectl` by adding new subcommands to perform new tasks and extend the set of features available in the main distribution of `kubectl`.

{% endcapture %}

{% capture prerequisites %}

You need to have a working `kubectl` binary installed. Note that plugins were officially introduced as an alpha feature in the v1.8.0 release. So, while some parts of the plugins feature were already available in previous versions, a `kubectl` version of 1.8.0 or later is recommended.

Until a GA version is released, plugins will only be available under the `kubectl plugin` subcommand.

{% endcapture %}

{% capture steps %}

## Installing kubectl plugins

A plugin is nothing more than a set of files: at least a **plugin.yaml** descriptor, and likely one or more binary, script, or assets files. To install a plugin, copy those files to one of the locations in the filesystem where `kubectl` searches for plugins.

Note that Kubernetes does not provide a package manager or something similar to install or update plugins, so it's your responsibility to place the plugin files in the correct location. We recommend that each plugin is located on its own directory, so installing a plugin that is distributed as a compressed file is as simple as extracting it to one of the locations specified in the [Plugin loader](#plugin-loader) section.

### Plugin loader

The plugin loader is responsible for searching plugin files in the filesystem locations specified below, and checking if the plugin provides the minimum amount of information required for it to run. Files placed in the right location that don't provide the minimum amount of information, for example an incomplete *plugin.yaml* descriptor, are ignored.

#### Search order

The plugin loader uses the following search order:

1. `${KUBECTL_PLUGINS_PATH}` If specified, the search stops here.
2. `${XDG_DATA_DIRS}/kubectl/plugins`
3. `~/.kube/plugins`

If the `KUBECTL_PLUGINS_PATH` environment variable is present, the loader uses it as the only location to look for plugins.
The `KUBECTL_PLUGINS_PATH` environment variable is a list of directories. In Linux and Mac, the list is colon-delimited. In
Windows, the list is semicolon-delimited.

If `KUBECTL_PLUGINS_PATH` is not present, the loader searches these additional locations:

First, one or more directories specified according to the
[XDG System Directory Structure](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
specification. Specifically, the loader locates the directories specified by the `XDG_DATA_DIRS` environment variable,
and then searches `kubectl/plugins` directory inside of those.
If `XDG_DATA_DIRS` is not specified, it defaults to `/usr/local/share:/usr/share`.

Second, the `plugins` directory under the user's kubeconfig dir. In most cases, this is `~/.kube/plugins`.

```shell
# Loads plugins from both /path/to/dir1 and /path/to/dir2
KUBECTL_PLUGINS_PATH=/path/to/dir1:/path/to/dir2 kubectl plugin -h
```

## Writing kubectl plugins

You can write a plugin in any programming language or script that allows you to write command-line commands.
A plugin does not necessarily need to have a binary component. It could rely entirely on operating system utilities
like `echo`, `sed`, or `grep`. Or it could rely on the `kubectl` binary.

The only strong requirement for a `kubectl` plugin is the `plugin.yaml` descriptor file. This file is responsible for declaring at least the minimum attributes required to register a plugin and must be located under one of the locations specified in the [Search order](#search-order) section. 

### The plugin.yaml descriptor

The descriptor file supports the following attributes:

```
name: "targaryen"                 # REQUIRED: the plugin command name, to be invoked under 'kubectl'
shortDesc: "Dragonized plugin"    # REQUIRED: the command short description, for help
longDesc: ""                      # the command long description, for help
example: ""                       # command example(s), for help
command: "./dracarys"             # REQUIRED: the command, binary, or script to invoke when running the plugin
flags:                            # flags supported by the plugin
  - name: "heat"                  # REQUIRED for each flag: flag name
    shorthand: "h"                # short version of the flag name
    desc: "Fire heat"             # REQUIRED for each flag: flag description
    defValue: "extreme"           # default value of the flag
tree:                             # allows the declaration of subcommands
  - ...                           # subcommands support the same set of attributes
```

The preceding descriptor declares the `kubectl plugin targaryen` plugin, which has one flag named `-h | --heat`.
When the plugin is invoked, it calls the `dracarys` binary or script, which is located in the same directory as the descriptor file. The [Accessing runtime attributes](#accessing-runtime-attributes) section describes how the `dracarys` command accesses the flag value and other runtime context.

### Recommended directory structure

It is recommended that each plugin has its own subdirectory in the filesystem, preferably with the same name as the plugin command. The directory must contain the `plugin.yaml` descriptor and any binary, script, asset, or other dependency it might require.

For example, the directory structure for the `targaryen` plugin could look like this:

```
~/.kube/plugins/
└── targaryen
    ├── plugin.yaml
    └── dracarys
```

### Accessing runtime attributes

In most use cases, the binary or script file you write to support the plugin must have access to some contextual information provided by the plugin framework. For example, if you declared flags in the descriptor file, your plugin must have access to the user-provided flag values at runtime. The same is true for global flags. The plugin framework is responsible for doing that, so plugin writers don't need to worry about parsing arguments. This also ensures the best level of consistency between plugins and regular `kubectl` commands.

Plugins have access to runtime context attributes through environment variables. So to access the value provided through a flag, for example, just look for the value of the proper environment variable using the appropriate function call for your binary or script. 

The supported environment variables are:

* `KUBECTL_PLUGINS_CALLER`: The full path to the `kubectl` binary that was used in the current command invocation.
As a plugin writer, you don't have to implement logic to authenticate and access the Kubernetes API. Instead, you can invoke `kubectl` to obtain the information you need, through something like `kubectl get --raw=/apis`.

* `KUBECTL_PLUGINS_CURRENT_NAMESPACE`: The current namespace that is the context for this call. This is the actual namespace to be used, meaning it was already processed in terms of the precedence between what was provided through the kubeconfig, the `--namespace` global flag, environment variables, and so on.

* `KUBECTL_PLUGINS_DESCRIPTOR_*`: One environment variable for every attribute declared in the `plugin.yaml` descriptor.
For example, `KUBECTL_PLUGINS_DESCRIPTOR_NAME`, `KUBECTL_PLUGINS_DESCRIPTOR_COMMAND`.

* `KUBECTL_PLUGINS_GLOBAL_FLAG_*`: One environment variable for every global flag supported by `kubectl`.
For example, `KUBECTL_PLUGINS_GLOBAL_FLAG_NAMESPACE`, `KUBECTL_PLUGINS_GLOBAL_FLAG_V`.

* `KUBECTL_PLUGINS_LOCAL_FLAG_*`: One environment variable for every local flag declared in the `plugin.yaml` descriptor. For example, `KUBECTL_PLUGINS_LOCAL_FLAG_HEAT` in the preceding `targaryen` example.

{% endcapture %}

{% capture whatsnext %}

* Check the repository for [some more examples](https://github.com/kubernetes/kubernetes/tree/master/pkg/kubectl/plugins/examples) of plugins.
* In case of any questions, feel free to reach out to the [CLI SIG team](https://github.com/kubernetes/community/tree/master/sig-cli).
* Binary plugins is still an alpha feature, so this is the time to contribute ideas and improvements to the codebase. We're also excited to hear about what you're planning to implement with plugins, so [let us know](https://github.com/kubernetes/community/tree/master/sig-cli)!

{% endcapture %}

{% include templates/task.md %}
