---
title: "Auto-completar no bash macOS"
description: "Configurações opcionais do auto-completar do basch no macOS."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### Introdução

O script de completar do bash pode ser gerado com `kubectl completion bash`.
Ativando esse script no seu shell, habilita o auto-completar do kubectl.

Entretanto, o script para auto-completar do kubectl depende de
[**bash-completion**](https://github.com/scop/bash-completion) que você deve ter instalado com antecedência.

{{< warning>}}
Existem duas versões de auto-completar do bash, v1 e v2. V1 é Bash 3.2
(que é padrão no macOS), e v2 que é para Bash 4.1+. O script de auto-completar 
do kubectl **não funciona** corretamente com o auto-completar do bash v1 e o 
Bash 3.2. Ele requer **bash-completar v2** e **Bash 4.1+**. Por isso, para
executarmos o auto-completar do kubectl no macOS de forma correta, você pre-
cisa instalar e usar o Bash 4.1+([*instruções*])(https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)).
As instruções a seguir, levam em conta que você utilize o Bash 4.1+.
(Isso quer dizer, nenhuma versão do Bash 4.1 ou mais recente).
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
