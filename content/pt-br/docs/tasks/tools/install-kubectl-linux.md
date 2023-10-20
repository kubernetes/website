---
title: Instale e configure o kubectl no Linux
content_type: task
weight: 10
card:
  name: tasks
  weight: 20
  title: Install kubectl on Linux
---

## {{% heading "prerequisites" %}}

Você deve usar uma versão do kubectl que esteja próxima da versão do seu cluster. Por exemplo, um cliente v1.26 pode se comunicar com as versões v1.25, v1.26 e v1.27 da camada de gerenciamento. Usar a versão compatível mais recente do kubectl ajuda a evitar problemas inesperados.

## Instale o kubectl no Linux

Existem os seguintes métodos para instalar o kubectl no Linux:

- [Instale o binário kubectl no Linux usando o curl](#instale-o-binário-kubectl-no-linux-usando-o-curl)
- [Instale usando o gerenciador de pacotes nativo](#instale-usando-o-gerenciador-de-pacotes-nativo)
- [Instale usando outro gerenciador de pacotes](#instale-usando-outro-gerenciador-de-pacotes)


### Instale o binário kubectl no Linux usando o curl

1. Faça download da versão mais recente com o comando:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   ```

   {{< note >}}
Para fazer o download de uma versão específica, substitua a parte `$(curl -L -s https://dl.k8s.io/release/stable.txt)` do comando pela versão específica.

Por exemplo, para fazer download da versão {{< skew currentPatchVersion >}} no Linux, digite:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```
   {{< /note >}}

1. Valide o binário (opcional)

   Faça download do arquivo checksum de verificação do kubectl:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   ```

   Valide o binário kubectl em relação ao arquivo de verificação:

   ```bash
   echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
   ```

   Se válido, a saída será:

   ```console
   kubectl: OK
   ```

   Se a verificação falhar, o `sha256` exibirá o status diferente de zero e a saída será semelhante a:

   ```console
   kubectl: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Faça download da mesma versão do binário e do arquivo de verificação.
   {{< /note >}}

1. Instale o kubectl

   ```bash
   sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
   ```

   {{< note >}}
   Se você não tiver acesso root no sistema de destino, ainda poderá instalar o kubectl no diretório `~/.local/bin`:

   ```bash
   chmod +x kubectl
   mkdir -p ~/.local/bin
   mv ./kubectl ~/.local/bin/kubectl
   # e depois adicione ~/.local/bin na variável $PATH
   ```

   {{< /note >}}

1. Teste para garantir que a versão que você instalou esteja atualizada:

   ```bash
   kubectl version --client
   ```

   Ou use isso para visualizar mais detalhes da versão:

   ```cmd
   kubectl version --client --output=yaml    
   ```

### Instale usando o gerenciador de pacotes nativo

{{< tabs name="kubectl_install" >}}
{{% tab name="Distribuições baseadas no Debian" %}}

1. Atualize o índice do `apt` e instale os pacotes necessários para utilizar o repositório `apt` do Kubernetes:

   ```shell
   sudo apt-get update
   sudo apt-get install -y ca-certificates curl
   ```
   
   Se você usa o Debian 9 (stretch) ou anterior, também precisará instalar o `apt-transport-https`:
   ```shell
   sudo apt-get install -y apt-transport-https
   ```

2. Faça download da chave de assinatura pública do Google Cloud:

   ```shell
   curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-archive-keyring.gpg
   ```

3. Adicione o repositório `apt` do Kubernetes:

   ```shell
   echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. Atualize o índice do `apt` com o novo repositório e instale o kubectl:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```
{{< note >}}
Em versões anteriores ao Debian 12 e Ubuntu 22.04, o `/etc/apt/keyrings` não existe por padrão. 
Você pode criar este diretório se precisar, tornando-o visível para todos, mas com permissão de escrita apenas aos administradores.
{{< /note >}}

{{% /tab %}}

{{% tab name="Distribuições baseadas no Red Hat" %}}
```bash
cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
sudo yum install -y kubectl
```

{{% /tab %}}
{{< /tabs >}}

### Instale usando outro gerenciador de pacotes

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
Se você estiver no Ubuntu ou em outra distribuição Linux que suporte o gerenciador de pacotes [snap](https://snapcraft.io/docs/core/install), o kubectl está disponível como um aplicativo [snap](https://snapcraft.io/).

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
Se você estiver no Linux e usando o gerenciador de pacotes [Homebrew](https://docs.brew.sh/Homebrew-on-Linux), o kubectl está disponível para [instalação](https://docs.brew.sh/Homebrew-on-Linux#install).

```shell
brew install kubectl
kubectl version --client
```

{{% /tab %}}

{{< /tabs >}}

## Verifique a configuração kubectl

{{< include "included/verify-kubectl.md" >}}

## Configurações e plugins opcionais do kubectl 
### Ative o autocompletar no shell 

O kubectl oferece recursos de autocompletar para Bash, Zsh, Fish e PowerShell, o que pode economizar muita digitação.

Abaixo estão os procedimentos para configurar o autocompletar para Bash, Fish e Zsh.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### Instale o plugin `kubectl convert`

{{< include "included/kubectl-convert-overview.md" >}}

1. Faça download da versão mais recente com o comando:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
   ```

1. Valide o binário (opcional)

   Faça download do arquivo checksum de verificação do kubectl-convert:

   ```bash
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   ```

   Valide o binário kubectl-convert com o arquivo de verificação:

   ```bash
   echo "$(cat kubectl-convert.sha256) kubectl-convert" | sha256sum --check
   ```

   Se válido, a saída será:

   ```console
   kubectl-convert: OK
   ```

   Se a verificação falhar, o `sha256` exibirá o status diferente de zero e a saída será semelhante a:

   ```console
   kubectl-convert: FAILED
   sha256sum: WARNING: 1 computed checksum did NOT match
   ```

   {{< note >}}
   Faça download da mesma versão do binário e do arquivo de verificação.
   {{< /note >}}

1. Instale o kubectl-convert

   ```bash
   sudo install -o root -g root -m 0755 kubectl-convert /usr/local/bin/kubectl-convert
   ```

1. Verifique se o plugin foi instalado com sucesso

   ```shell
   kubectl convert --help
   ```

   Se não for exibido um erro, isso significa que o plugin foi instalado com sucesso.

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
