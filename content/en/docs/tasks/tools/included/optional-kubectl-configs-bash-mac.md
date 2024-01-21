---
title: "bash auto-completion on macOS"
description: "Some optional configuration for bash auto-completion on macOS."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### Introduction

The kubectl completion script for Bash can be generated with `kubectl completion bash`.
Sourcing this script in your shell enables kubectl completion.

However, the kubectl completion script depends on
[**bash-completion**](https://github.com/scop/bash-completion) which you thus have to previously install.

{{< warning>}}
There are two versions of bash-completion, v1 and v2. V1 is for Bash 3.2
(which is the default on macOS), and v2 is for Bash 4.1+. The kubectl completion
script **doesn't work** correctly with bash-completion v1 and Bash 3.2.
It requires **bash-completion v2** and **Bash 4.1+**. Thus, to be able to
correctly use kubectl completion on macOS, you have to install and use
Bash 4.1+ ([*instructions*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)).
The following instructions assume that you use Bash 4.1+
(that is, any Bash version of 4.1 or newer).
{{< /warning >}}

### Upgrade Bash

The instructions here assume you use Bash 4.1+. You can check your Bash's version by running:

```bash
echo $BASH_VERSION
```

If it is too old, you can install/upgrade it using Homebrew:

```bash
brew install bash
```

Reload your shell and verify that the desired version is being used:

```bash
echo $BASH_VERSION $SHELL
```

Homebrew usually installs it at `/usr/local/bin/bash`.

### Install bash-completion

{{< note >}}
As mentioned, these instructions assume you use Bash 4.1+, which means you will
install bash-completion v2 (in contrast to Bash 3.2 and bash-completion v1,
in which case kubectl completion won't work).
{{< /note >}}

You can test if you have bash-completion v2 already installed with `type _init_completion`.
If not, you can install it with Homebrew:

```bash
brew install bash-completion@2
```

As stated in the output of this command, add the following to your `~/.bash_profile` file:

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

Reload your shell and verify that bash-completion v2 is correctly installed with `type _init_completion`.

### Enable kubectl autocompletion

You now have to ensure that the kubectl completion script gets sourced in all
your shell sessions. There are multiple ways to achieve this:

- Source the completion script in your `~/.bash_profile` file:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- Add the completion script to the `/usr/local/etc/bash_completion.d` directory:

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- If you have an alias for kubectl, you can extend shell completion to work with that alias:

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -o default -F __start_kubectl k' >>~/.bash_profile
    ```

- If you installed kubectl with Homebrew (as explained
  [here](/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)),
  then the kubectl completion script should already be in `/usr/local/etc/bash_completion.d/kubectl`.
  In that case, you don't need to do anything.

   {{< note >}}
   The Homebrew installation of bash-completion v2 sources all the files in the
   `BASH_COMPLETION_COMPAT_DIR` directory, that's why the latter two methods work.
   {{< /note >}}

In any case, after reloading your shell, kubectl completion should be working.
