---
title: Extend kubectl with plugins
approvers:
- fabianofranz
---

{% capture overview %}

This guide shows you how to install and write extensions for [kubectl](/docs/user-guide/kubectl). Usually called "plugins" or "binary extensions", this feature allows you to extend the default set of commands available in `kubectl` by adding new subcommands to perform new tasks and extend the set of features available in the main distribution of `kubectl`.

Plugins are considered an alpha feature and subject to changes.

{% endcapture %}

{% capture prerequisites %}

You need to have a working `kubectl` binary installed. Note that plugins were officially introduced as an alpha feature in the v1.8.0 release. So, while some parts it were already available in previous versions, a `kubectl` equals or greater than that version is recommended.

Until a GA version is released, plugins will only be available under the `kubectl plugin` subcommand.

{% endcapture %}

{% capture steps %}

## Installing kubectl plugins

Plugins are nothing more than a set of files (at least a **plugin.yaml** descriptor, and likely one or more binary, script, or assets files) and installing them requires no more than copying those files to one of the locations in the file system where `kubectl` searches for plugins.

Note that we don't provide a package manager or something similar to install or update plugins, so it's your responsibility to place the plugin files in the correct location. We recommend that each plugin is located on its own directory, so installing a plugin that is distributed as a compressed file is as simple as extracting it to one of the locations specified in the [Plugin loader](#plugin-loader) section.

### Plugin loader

The plugin loader is responsible for searching plugin files in the filesystem locations specified below, and checking if the plugin provides the minimum amount of information required for it to run as a plugin. Files placed in the right location that don't provide the minimum amount of information (for example, an incomplete *plugin.yaml* descriptor) are simply ignored.

#### Search order

1. `${KUBECTL_PLUGINS_PATH}` (if specified, stops here)
2. `${XDG_DATA_DIRS}/kubectl/plugins` (`XDG_DATA_DIRS` defaults to `/usr/local/share:/usr/share`)
3. `~/.kube/plugins`

Additional details:

If the `KUBECTL_PLUGINS_PATH` env var is present, *the loader stops here and uses it as the only location where to search for plugins*. Note that multiple directories can be specified with colons.

If `KUBECTL_PLUGINS_PATH` is not present, two other locations are searched:

First, one or more directories specified acording to the [XDG System Directory Structure](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html) spec. Specifically, it will look for the `XDG_DATA_DIRS` and the `kubectl/plugins` directory inside that. Note that this also supports multiple directories with colons. If `XDG_DATA_DIRS` is not specified, it defaults to `/usr/local/share:/usr/share`.

Second, the `plugins` directory under the user's kubeconfig dir. This means, in most cases, `~/.kube/plugins`.

```shell
# Loads plugins from both /path/to/dir1 and /path/to/dir2
KUBECTL_PLUGINS_PATH=/path/to/dir1:/path/to/dir2 kubectl plugin -h
```

## Writing kubectl plugins

Plugins can be written in any programming laguage or script that allows you to write command line commands. They can even consist in no binary at all and just rely on operating system utilities, like `echo`, `sed`, `grep`, the `kubectl` binary, and so on.

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

In the example above, we'd be declaring the `kubectl plugin targaryen` plugin, which declares one flag named `-h | --heat` and, when invoked, calls the `dracarys` binary or script, which would be located in the same directory of the plugin descriptor. The way the `dracarys` command can access the value provided to the flag and some other runtime context is described in the [Accessing runtime attributes](#accessing-runtime-attributes) section.

### Recommended directory structure

It is recommended that each plugin has its own subdirectory in the filesystem, preferably with the same name of the plugin command. The directory must contain the `plugin.yaml` descriptor and any binary, script, asset, or other dependency it might require.

So for the example described in the previous section, we could have something like:

```
~/.kube/plugins/
└── targaryen
    ├── plugin.yaml
    └── dracarys
```

### Accessing runtime attributes

In most use cases, the binary or script file you write to support the plugin must have access to some contextual information provided by the plugin framework. 

For example, if you declared flags in the descriptor file, you must have access to the value provided by the user through the given flag, at runtime. Same for global flags. The plugin framework is responsible for doing that, so plugin writers don't need to worry about parsing arguments and at the same time we guarantee the best level of consistency between plugins and regular `kubectl` commands.

Plugin writers have access to runtime context attributes through environment variables. So to access the value provided through a flag, for example, just look for the value of the proper environment variable using the proper function call for your binary or script. 

The supported environment variables are:

* `KUBECTL_PLUGINS_CALLER`: provides the full path to the `kubectl` binary, the same used in the current command invocation. This is very useful on plugins since you don't necessarily need to implement the entire logic to authenticate and access the Kubernetes API - you could simply invoke `kubectl` to provide you the information you need, through something like `kubectl get --raw=/apis`, and parse the resulting JSON/YAML.
* `KUBECTL_PLUGINS_CURRENT_NAMESPACE`: current namespace that you should consider as the context for this call, when doing namespaced actions. This is the actual namespace to be used, meaning it was already processed in terms of the precedence between what was provided through the kubeconfig, the `--namespace` global flag, env vars, and so on.
* `KUBECTL_PLUGINS_DESCRIPTOR_*`: one env var for every attribute declared in the `plugin.yaml` descriptor, for example: `KUBECTL_PLUGINS_DESCRIPTOR_NAME`, `KUBECTL_PLUGINS_DESCRIPTOR_COMMAND`, etc.
* `KUBECTL_PLUGINS_GLOBAL_FLAG_*`: one env var for every global flag supported by `kubectl`, for example: `KUBECTL_PLUGINS_GLOBAL_FLAG_NAMESPACE`, `KUBECTL_PLUGINS_GLOBAL_FLAG_V`, etc.
* `KUBECTL_PLUGINS_LOCAL_FLAG_*`: one env var for every local flag declared in the `plugin.yaml` descriptor, for example `KUBECTL_PLUGINS_LOCAL_FLAG_HEAT` in the example we used earlier.

{% endcapture %}

{% capture whatsnext %}

* Check the repository for [some more examples](https://github.com/kubernetes/kubernetes/tree/master/pkg/kubectl/plugins/examples) of plugins.
* In case of any questions, feel free to reach out to the [CLI SIG team](https://github.com/kubernetes/community/tree/master/sig-cli).
* Binary plugins is still alpha, so this is the time to contribute ideas and improvements to the codebase. We're also excited to hear about what you're planning to implement with plugins, so [let us know](https://github.com/kubernetes/community/tree/master/sig-cli)!

{% endcapture %}

{% include templates/task.md %}
