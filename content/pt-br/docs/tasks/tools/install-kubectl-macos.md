---
reviewers:
- mikedanese
title: Instalar e configurar o kubectl no macOS
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

Você deve utilizar uma versão do kubectl que tenha pouca diferença da versão do
seu cluster. Por exemplo, um cliente v{{< skew currentVersion >}} pode comunicar-se
com control planes v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}},
e v{{< skew currentVersionAddMinor 1 >}}.
Usar a versão compatível e mais recente do kubectl pode evitar imprevistos ou problemas.

## Instalando o kubectl no macOS

Existem os seguintes métodos para instalar o kubectl no macOS:

- [Instalar kubectl no macOS](#instalar-kubectl-no-macos)
  - [Instalar o binário do kubectl com curl no macOS](#instalar-o-binario-do-kubectl-com-curl-no-macos)
  - [Instalar com Homebew no macOS](#instalar-com-homebrew-no-macos)
  - [Instalar com Macports no macOS](#instalar-com-macports-no-macos)
- [Verificar configuração do kubectl](#verificar-configuracao-do-kubectl)
- [Plugins e configurações opcionais do kubectl](#plugins-e-configuracoes-opcionais-do-kubectl)
  - [Habilitar autocomplete no shell](#habilitar-autocomplete-no-shell)
  - [Instalar `kubectl convert` plugin](#instalar-kubectl-convert-plugin)

### Instalar o binário do kubectl com o curl no macOS

1. Baixe a última versão:

   {{< tabs name="download_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl"
   {{< /tab >}}
   {{< /tabs >}}

   {{< note >}}
   Para baixar uma versão específica, substitua `$(curl -L -s https://dl.k8s.io/release/stable.txt)`
   parte do comando com a versão específica da versão.

   Por exemplo, para baixar a versão {{< skew currentPatchVersion >}} no Intel macOS, digite:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/amd64/kubectl"
   ```

   E para macOS no Apple Silicon, digite:

   ```bash
   curl -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/darwin/arm64/kubectl"
   ```

   {{< /note >}}

1. Validando o binário (opcional)

   Baixe o arquivo de checksum do kubectl:

   {{< tabs name="download_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}
  
   Validando o binário do kubectl com o arquivo de checksum:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | shasum -a 256 --check
   ```

   Se for válido, a saída será:

   ```console
   kubectl: OK
   ```

   Se a houver falha na validação, `shasum` ele retornará uma saída diferente de zero semelhante a:

   ```console
   kubectl: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Baixe a mesma versão do binário e do checksum.
   {{< /note >}}

1. Tornando o binário do kubectl executável.

   ```bash
   chmod +x ./kubectl
   ```

1. Movendo o binário do kubectl para um diretório do seu sistema`PATH`.

   ```bash
   sudo mv ./kubectl /usr/local/bin/kubectl
   sudo chown root: /usr/local/bin/kubectl
   ```

   {{< note >}}
   Make sure `/usr/local/bin` is in your PATH environment variable.
   {{< /note >}}

1. Teste para validar que a versão instalada está atualizada:

   ```bash
   kubectl version --client
   ```
   
   Ou se preferir, use o seguinte comando para uma visão mais detalhada sobre a versão do Kubernetes:

   ```cmd
   kubectl version --client --output=yaml
   ```

1. Depois de instalar e validar o kubectl, delete o arquivo de checksum:

   ```bash
   rm kubectl.sha256
   ```

### Instalar com Homebrew no macOS

Se você está no macOS e usando o gerenciador de pacote [Homebrew](https://brew.sh/),
você pode instalar o kubectl usando o Homebrew.

1. Execute o comando de instalação:

   ```bash
   brew install kubectl
   ```

   or

   ```bash
   brew install kubernetes-cli
   ```

1. Teste para validar se a versão instalada está atualizada:

   ```bash
   kubectl version --client
   ```

### Instalar com Macports no macOS

Se você está no macOS, usando o gerenciador de pacotes [Macports](https://macports.org/),
você pode instalar o kubectl utilizando o Macports.

1. Execute o comando de instalação:

   ```bash
   sudo port selfupdate
   sudo port install kubectl
   ```

1. Teste para validar se a versão instalada está atualizada:

   ```bash
   kubectl version --client
   ```

## Verifique a configuração do kubectl

{{< include "included/verify-kubectl.md" >}}

## Configurações opcionais dos plugins e kubectl

### Habilitar autocomplete no shell

kubectl fornece suporte para auto-complete para Bash, Zsh, Fish, e PowerShell
o que pode fazer com que você digite menos.

Abaixo seguem os procedimentos para configurar o auto-complete para Bash, Fish, and Zsh.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-mac.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### Install `kubectl convert` plugin

{{< include "included/kubectl-convert-overview.md" >}}

1. Download the latest release with the command:

   {{< tabs name="download_convert_binary_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert"
   {{< /tab >}}
   {{< /tabs >}}

1. Validate the binary (optional)

   Download the kubectl-convert checksum file:

   {{< tabs name="download_convert_checksum_macos" >}}
   {{< tab name="Intel" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="Apple Silicon" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/darwin/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

   Validate the kubectl-convert binary against the checksum file:

   ```bash
   echo "$(cat kubectl-convert.sha256)  kubectl-convert" | shasum -a 256 --check
   ```

   If valid, the output is:

   ```console
   kubectl-convert: OK
   ```

   If the check fails, `shasum` exits with nonzero status and prints output similar to:

   ```console
   kubectl-convert: FAILED
   shasum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Download the same version of the binary and checksum.
   {{< /note >}}

1. Make kubectl-convert binary executable

   ```bash
   chmod +x ./kubectl-convert
   ```

1. Move the kubectl-convert binary to a file location on your system `PATH`.

   ```bash
   sudo mv ./kubectl-convert /usr/local/bin/kubectl-convert
   sudo chown root: /usr/local/bin/kubectl-convert
   ```

   {{< note >}}
   Make sure `/usr/local/bin` is in your PATH environment variable.
   {{< /note >}}

1. Verify plugin is successfully installed

   ```shell
   kubectl convert --help
   ```

   If you do not see an error, it means the plugin is successfully installed.

1. After installing the plugin, clean up the installation files:

   ```bash
   rm kubectl-convert kubectl-convert.sha256
   ```

### Uninstall kubectl on macOS

Depending on how you installed `kubectl`, use one of the following methods.

### Uninstall kubectl using the command-line

1.  Locate the `kubectl` binary on your system:

    ```bash
    which kubectl
    ```

1.  Remove the `kubectl` binary:

    ```bash
    sudo rm <path>
    ```
    Replace `<path>` with the path to the `kubectl` binary from the previous step. For example, `sudo rm /usr/local/bin/kubectl`.

### Uninstall kubectl using homebrew

If you installed `kubectl` using Homebrew, run the following command:

```bash
brew remove kubectl
```
  
## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}


