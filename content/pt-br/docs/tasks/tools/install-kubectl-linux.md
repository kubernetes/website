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

Você deve usar uma versão do kubectl que esteja próxima da versão do seu cluster. Por exemplo, um cliente v{{< skew currentVersion >}} pode se comunicar com as versões v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}} e v{{< skew currentVersionAddMinor 1 >}} da camada de gerenciamento. Usar a versão compatível mais recente do kubectl ajuda a evitar problemas inesperados.

## Instale o kubectl no Linux

Existem os seguintes métodos para instalar o kubectl no Linux:

- [Instale o binário kubectl no Linux usando o curl](#instale-o-binário-kubectl-no-linux-usando-o-curl)
- [Instale usando o gerenciador de pacotes nativo](#instale-usando-o-gerenciador-de-pacotes-nativo)
- [Instale usando outro gerenciador de pacotes](#instale-usando-outro-gerenciador-de-pacotes)


### Instale o binário kubectl no Linux usando o curl

1. Faça download da versão mais recente com o comando:

	{{< tabs name="download_binary_linux" >}}
	{{< tab name="x86-64" codelang="bash" >}}
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
	{{< /tab >}}
	{{< tab name="ARM64" codelang="bash" >}}
	curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl"
	{{< /tab >}}
	{{< /tabs >}}

   {{< note >}}
Para fazer o download de uma versão específica, substitua a parte `$(curl -L -s https://dl.k8s.io/release/stable.txt)` do comando pela versão específica.

Por exemplo, para fazer download da versão {{< skew currentPatchVersion >}} no Linux x86-64, digite:

   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/amd64/kubectl
   ```
   
   E para Linux ARM64, digite:
   
   ```bash
   curl -LO https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/linux/arm64/kubectl
   ```
   {{< /note >}}

1. Valide o binário (opcional)

   Faça download do arquivo checksum de verificação do kubectl:
   
   {{< tabs name="download_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl.sha256"
   {{< /tab >}}
   {{< /tabs >}}

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
   # apt-transport-https pode ser um pacote simbólico; se for o caso, você pode ignorá-lo
   sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
   ```
   
2. Faça download da chave de assinatura pública para os  repositórios de pacote do Kubernetes. A mesma chave de assinatura é usada para todos os repositórios, então você pode desconsiderar a versão na URL:

   ```shell
   # Se a pasta `/etc/apt/keyrings` não existir, ela deve ser criada antes do comando curl, leia a nota abaixo.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   sudo chmod 644 /etc/apt/keyrings/kubernetes-apt-keyring.gpg # permitir que programas APT sem acesso privilegiado leiam este keyring
   ```

{{< note >}}
Em releases mais antigos que o Debian 12 e Ubuntu 22.04, a pasta `/etc/apt/keyrings` não existe por padrão, e ela deve ser criada antes do comando curl.
{{< /note >}}

3. Adicione o repositório `apt` do Kubernetes. Se você quiser usar uma versão do Kubernetes diferente de {{< param "version" >}},
   substitua {{< param "version" >}} com a versão menor desejada no comando a seguir:

   ```shell
   # Isto substitui qualquer configuração existente na pasta /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   sudo chmod 644 /etc/apt/sources.list.d/kubernetes.list # ajuda ferramentas tais como command-not-found a funcionar corretamente
   ```
   
{{< note >}}
Para atualizar o kubectl para outra versão menor, você vai precisar atualizar a versão no arquivo `/etc/apt/sources.list.d/kubernetes.list` antes de rodar `apt-get update` e `apt-get upgrade`. Este procedimento está descrito com mais detalhes em [Mudando o Repositório de Pacotes do Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/) (em inglês).
{{< /note >}}

4. Atualize o índice do `apt` com o novo repositório e instale o kubectl:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

{{% /tab %}}

{{% tab name="Distribuições baseadas no Red Hat" %}}

1. Adicione o repositório `yum` do Kubernetes. Se você quiser usar uma versão do 
   Kubernetes diferente de {{< param "version" >}}, substitua {{< param "version" >}} 
   pela versão menor desejada no comando a seguir.

	```bash
	# Isto substitui qualquer configuração existente na pasta /etc/yum.repos.d/kubernetes.repo
	cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
	[kubernetes]
	name=Kubernetes
	baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
	enabled=1
	gpgcheck=1
	gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
	EOF
	```

{{< note >}}
Para atualizar o kubectl para outra versão menor, você vai precisar atualizar a versão no arquivo `/etc/yum.repos.d/kubernetes.repo` antes de rodar `yum update`. Este procedimento está descrito com mais detalhes em [Mudando o Repositório de Pacotes do Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/) (em inglês).
{{< /note >}}

2. Instale o kubectl usando `yum`:

	```bash
	sudo yum install -y kubectl
	```

{{% /tab %}}

{{% tab name="Distribuições baseadas em SUSE" %}}

1. Adicione o repositório `zypper` do Kubernetes. Se você quiser instalar uma versão
   diferente de {{< param "version" >}}, substitua {{< param "version" >}} pela versão
   menor desejada no comando a seguir.
   
   ```bash
   # Isto substitui qualquer configuração existente no arquivo /etc/zypp/repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/zypp/repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   EOF
   ```
{{< note >}}
Para atualizar o kubectl para outra versão menor, você vai precisar atualizar a versão no arquivo `/etc/zypp/repos.d/kubernetes.repo`
antes de rodar `zypper update`. Este procedimento está descrito com mais detalhes em [Mudando o Repositório de Pacotes do Kubernetes](/docs/tasks/administer-cluster/kubeadm/change-package-repository/) (em inglês).
{{< /note >}}

2. Atualize o `zypper` e confirme a adição do novo repositório:

	```bash
	sudo zypper update
	```
	
	Quando esta mensagem aparecer, pressione 't' ou 'a':
	
   ```
   New repository or package signing key received:

   Repository:       Kubernetes
   Key Fingerprint:  1111 2222 3333 4444 5555 6666 7777 8888 9999 AAAA
   Key Name:         isv:kubernetes OBS Project <isv:kubernetes@build.opensuse.org>
   Key Algorithm:    RSA 2048
   Key Created:      Thu 25 Aug 2022 01:21:11 PM -03
   Key Expires:      Sat 02 Nov 2024 01:21:11 PM -03 (expires in 85 days)
   Rpm Name:         gpg-pubkey-9a296436-6307a177

   Note: Signing data enables the recipient to verify that no modifications occurred after the data
   were signed. Accepting data with no, wrong or unknown signature can lead to a corrupted system
   and in extreme cases even to a system compromise.

   Note: A GPG pubkey is clearly identified by its fingerprint. Do not rely on the key's name. If
   you are not sure whether the presented key is authentic, ask the repository provider or check
   their web site. Many providers maintain a web page showing the fingerprints of the GPG keys they
   are using.

   Do you want to reject the key, trust temporarily, or trust always? [r/t/a/?] (r): a
   ```

3. Instale o kubectl usando `zypper`:

	```bash
	sudo zypper install -y kubectl
	```
	
{{% /tab %}}
{{< /tabs >}}

### Instale usando outro gerenciador de pacotes

{{< tabs name="other_kubectl_install" >}}
{{% tab name="Snap" %}}
Se você estiver no Ubuntu ou em outra distribuição Linux que suporte o gerenciador de 
pacotes [snap](https://snapcraft.io/docs/core/install), o kubectl está disponível como 
um aplicativo [snap](https://snapcraft.io/).

```shell
snap install kubectl --classic
kubectl version --client
```

{{% /tab %}}

{{% tab name="Homebrew" %}}
Se você estiver no Linux e usando o gerenciador de pacotes
[Homebrew](https://docs.brew.sh/Homebrew-on-Linux), o kubectl está disponível para
[instalação](https://docs.brew.sh/Homebrew-on-Linux#install).

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

O kubectl oferece recursos de autocompletar para Bash, Zsh, Fish e PowerShell,
o que pode economizar muita digitação.

Abaixo estão os procedimentos para configurar o autocompletar para Bash, Fish e Zsh.

{{< tabs name="kubectl_autocompletion" >}}
{{< tab name="Bash" include="included/optional-kubectl-configs-bash-linux.md" />}}
{{< tab name="Fish" include="included/optional-kubectl-configs-fish.md" />}}
{{< tab name="Zsh" include="included/optional-kubectl-configs-zsh.md" />}}
{{< /tabs >}}

### Instale o plugin `kubectl convert`

{{< include "included/kubectl-convert-overview.md" >}}

1. Faça download da versão mais recente com o comando:

	{{< tabs name="download_convert_binary_linux" >}}
	{{< tab name="x86-64" codelang="bash" >}}
	curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert"
    {{< /tab >}}
	{{< tab name="ARM64" codelang="bash" >}}
	curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert"
	{{< /tab >}}
	{{< /tabs >}}
	
1. Valide o binário (opcional)

   Faça download do arquivo checksum de verificação do kubectl-convert:

   {{< tabs name="download_convert_checksum_linux" >}}
   {{< tab name="x86-64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< tab name="ARM64" codelang="bash" >}}
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubectl-convert.sha256"
   {{< /tab >}}
   {{< /tabs >}}

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

1. Depois de instalar o plugin, remova os arquivos de instalação:

	```bash
	rm kubectl-convert kubectl-convert.sha256
	```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
