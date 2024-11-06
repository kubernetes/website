---
title: "Autocompletar no bash macOS"
description: "Configurações opcionais do auto-completar do bash no macOS."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### Introdução

O script de autocompletar do kubectl para Bash pode ser gerado com o comando `kubectl completion bash`.
O script permite habilitar o autocompletar do kubectl no seu shell.

No entanto, o script autocompletar depende do
[**bash-completar**](https://github.com/scop/bash-completion), o que significa que você precisa instalar este software primeiro (executando `type _init_completion` você pode testar se tem o bash-completion instalado).

{{< warning>}}
Existem duas versões de autocompletar do Bash, v1 e v2. V1 é para Bash 3.2
(que é padrão no macOS), e v2 que é para Bash 4.1+. O script de autocompletar 
do kubectl **não funciona** corretamente com o autocompletar do bash v1 e o 
Bash 3.2. Ele requer **bash-completion v2** e **Bash 4.1+**. Por isso, para
executarmos o autocompletar do kubectl no macOS de forma correta, você precisa 
instalar e usar o Bash 4.1+([*guia*](https://itnext.io/upgrading-bash-on-macos-7138bd1066ba)).
As instruções a seguir, levam em conta que você utilize o Bash 4.1+.
(Isso quer dizer, nenhuma versão do Bash 4.1 ou mais recente).
{{< /warning >}}

### Atualizando Bash

As instruções abaixo sugerem que você esteja utilizando o Bash 4.1+. Você pode verificar a versão do seu Bash com o comando:

```bash
echo $BASH_VERSION
```

Se a versão do Bash for antiga, você pode instalar ou atualizar utilizando o Homebrew:

```bash
brew install bash
```

Recarregue seu shell e verifique se a versão desejada foi instalada ou se está em uso:

```bash
echo $BASH_VERSION $SHELL
```

O Homebrew normalmente instala os pacotes em `/usr/local/bin/bash`.

### Instalar bash-completar

{{< note >}}
Como mencionado anteriormente, essas instruções levam em consideração que você esteja utilizando o Bash 4.1+, dessa forma você
vai instalar o bash-completion v2 (diferentemente do Bash 3.2 e do bash-completion v1,
nesses casos, o completar do kubectl não irá funcionar).
{{< /note >}}

Você pode testar se você tiver o bash-completion v2 instalado, utilizando `type _init_completion`.
Se não, você pode instalar utilizando o Homebrew:

```bash
brew install bash-completion@2
```

Como indicado na saída deste comando, adicione a seguinte linha em seu arquivo `~/.bash_profile`:

```bash
brew_etc="$(brew --prefix)/etc" && [[ -r "${brew_etc}/profile.d/bash_completion.sh" ]] && . "${brew_etc}/profile.d/bash_completion.sh"
```

Recarregue seu shell e verifique que o bash-completion v2 está instalado corretamente, utilizando `type _init_completion`.

### Habilitar autocompletar do kubectl

Agora você precisa garantir que o script de autocompletar do kubectl seja carregado em todas
as suas sessões de shell. Existem várias maneiras de fazer isso:

- Carregue o script de autocompletar no seu arquivo `~/.bash_profile`:

    ```bash
    echo 'source <(kubectl completion bash)' >>~/.bash_profile
    ```

- Adicione o script de autocompletar ao diretório `/usr/local/etc/bash_completion.d`:

    ```bash
    kubectl completion bash >/usr/local/etc/bash_completion.d/kubectl
    ```

- Se você tiver um alias para o kubectl, pode estender o autocompletar do shell para funcionar com esse alias:

    ```bash
    echo 'alias k=kubectl' >>~/.bash_profile
    echo 'complete -o default -F __start_kubectl k' >>~/.bash_profile
    ```

- Se você tiver instalado o kubectl com o Homebrew(conforme explicado
  [aqui](/docs/tasks/tools/install-kubectl-macos/#install-with-homebrew-on-macos)),
  então o script de autocompletar do kubectl deverá estar pronto em `/usr/local/etc/bash_completion.d/kubectl`.
  Neste caso, você não precisa fazer mais nada.

   {{< note >}}
   A instalação do bash-completion v2 via Homebrew carrega todos os arquivos no diretório
   `BASH_COMPLETION_COMPAT_DIR`, é por isso que os dois últimos métodos funcionam..
   {{< /note >}}

De qualquer forma, após recarregar seu shell, o auto-completar do kubectl deve estar funcionando.
