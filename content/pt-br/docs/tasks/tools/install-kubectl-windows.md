---
title: Instale e configure o kubectl no Windows
content_type: task
weight: 10
---

## {{% heading "prerequisites" %}}

Você deve usar uma versão do kubectl que esteja próxima da versão do seu cluster. Por exemplo, um cliente v{{< skew currentVersion >}} pode se comunicar com as versões v{{< skew currentVersionAddMinor -1 >}}, v{{< skew currentVersionAddMinor 0 >}} e v{{< skew currentVersionAddMinor 1 >}} da camada de gerenciamento. Usar a versão compatível mais recente do kubectl ajuda a evitar problemas inesperados.

## Instale o kubectl no Windows

Existem os seguintes métodos para instalar o kubectl no Windows:

- [Instale o binário kubectl no Windows (via download direto ou curl)](#install-kubectl-binary-on-windows-via-direct-download-or-curl)
- [Instale no Windows usando Chocolatey, Scoop ou winget](#install-nonstandard-package-tools)

### Instale o binário kubectl no Windows (via download direto ou curl) {#install-kubectl-binary-on-windows-via-direct-download-or-curl}

1. Você tem duas opções para instalar o kubectl em seu dispositivo Windows

   - Download direto:
     
     Baixe a última versão do patch {{< skew currentVersion >}} diretamente para sua arquitetura específica visitando a [pagina de lançamentos do Kubernetes](https://kubernetes.io/releases/download/#binaries). Certifique-se de selecionar o binário correto para a sua arquitetura. (e.g., amd64, arm64, etc.).
   
   - Usando curl:

     Se você tiver o `curl` instalado, use este comando:

     ```powershell
     curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe"
     ```

   {{< note >}}
   Para descobrir a versão estável mais recente (por exemplo, para scripts), veja
   [https://dl.k8s.io/release/stable.txt](https://dl.k8s.io/release/stable.txt).
   {{< /note >}}

2. Validar o binário (opcional)

   Baixe o arquivo de checksum do `kubectl`:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl.exe.sha256"
   ```

   Valide o binário do `kubectl` com o arquivo de checksum:

   - Usando o Prompt de Comando para comparar manualmente a saída do `CertUtil` ao arquivo de checksum baixado:

     ```cmd
     CertUtil -hashfile kubectl.exe SHA256
     type kubectl.exe.sha256
     ```

   - Usando PowerShell para automatizar a verificação com o operador `-eq` para obter 
     um resultado `True` ou `False`:

     ```powershell
      $(Get-FileHash -Algorithm SHA256 .\kubectl.exe).Hash -eq $(Get-Content .\kubectl.exe.sha256)
     ```

3. Adicione (no início ou no final) o diretório do binário `kubectl` na variável de ambiente `PATH`.

4. Teste para garantir que a versão do `kubectl` seja a mesma que foi baixada:

   ```cmd
   kubectl version --client
   ```
   
   Ou use este comando para uma visão detalhada da versão:

   ```cmd
   kubectl version --client --output=yaml
   ```



{{< note >}}
[Docker Desktop para Windows](https://docs.docker.com/docker-for-windows/#kubernetes)
adiciona sua própria versão do `kubectl` ao `PATH`. Se você instalou o Docker Desktop anteriormente,
pode ser necessário colocar sua entrada no `PATH` antes da adicionada pelo instalador do Docker Desktop
ou remover o `kubectl` do Docker Desktop.
{{< /note >}}

### Instalar no Windows usando Chocolatey, Scoop, ou winget {#install-nonstandard-package-tools}

1. Para instalar o kubectl no Windows, você pode usar o gerenciador de pacotes [Chocolatey](https://chocolatey.org),
   o instalador de linha de comando [Scoop](https://scoop.sh) ou o gerenciador de pacotes
   [winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/).

   {{< tabs name="kubectl_win_install" >}}
   {{% tab name="choco" %}}
   ```powershell
   choco install kubernetes-cli
   ```
   {{% /tab %}}
   {{% tab name="scoop" %}}
   ```powershell
   scoop install kubectl
   ```
   {{% /tab %}}
   {{% tab name="winget" %}}
   ```powershell
   winget install -e --id Kubernetes.kubectl
   ```
   {{% /tab %}}
   {{< /tabs >}}

2. Teste para garantir que a versão que você instalou está atualizada:

   ```powershell
   kubectl version --client
   ```

3. Navegue até seu diretório pessoal:

   ```powershell
   # Se você estiver usando o cmd.exe, execute: cd %USERPROFILE%
   cd ~
   ```

4. Crie o diretório `.kube`:

   ```powershell
   mkdir .kube
   ```

5. Navegue para o diretório `.kube` que você acabou de criar:

   ```powershell
   cd .kube
   ```

6. Configure o kubectl para usar um cluster Kubernetes remoto:

   ```powershell
   New-Item config -type file
   ```

{{< note >}}
Edite o arquivo de configuração com um editor de texto de sua escolha, como o Notepad.
{{< /note >}}

## Verificar a configuração do kubectl

{{< include "included/verify-kubectl.md" >}}

## Configurações e plugins opcionais do kubectl

### Ativar autocompletar no shell

O kubectl oferece suporte ao autocompletar para Bash, Zsh, Fish e PowerShell,
o que pode economizar tempo de digitação.

Abaixo estão os procedimentos para configurar o autocompletar no PowerShell.

{{< include "included/optional-kubectl-configs-pwsh.md" >}}

### Instalar o plugin `kubectl convert`

{{< include "included/kubectl-convert-overview.md" >}}

1. Baixe a última versão com este comando:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/release/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe"
   ```

2. Validar o binário (opcional).

   Baixe o arquivo de checksum do `kubectl-convert`:

   ```powershell
   curl.exe -LO "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubectl-convert.exe.sha256"
   ```

   Valide o binário do `kubectl-convert` com o arquivo de checksum:

   - Usando o Prompt de Comando para comparar manualmente a saída do `CertUtil` ao arquivo de checksum baixado:

     ```cmd
     CertUtil -hashfile kubectl-convert.exe SHA256
     type kubectl-convert.exe.sha256
     ```

   - Usando PowerShell para automatizar a verificação com o operador `-eq` para obter 
     um resultado `True` ou `False`:

     ```powershell
     $($(CertUtil -hashfile .\kubectl-convert.exe SHA256)[1] -replace " ", "") -eq $(type .\kubectl-convert.exe.sha256)
     ```

3. Adicione (no início ou no final) o diretório do binário `kubectl-convert` na variável de ambiente `PATH`.

4. Verifique se o plugin foi instalado com sucesso.

   ```shell
   kubectl convert --help
   ```

   Se você não ver um erro, isso significa que o plugin foi instalado com sucesso.

5. Após instalar o plugin, limpe os arquivos de instalação:

   ```powershell
   del kubectl-convert.exe
   del kubectl-convert.exe.sha256
   ```

## {{% heading "whatsnext" %}}

{{< include "included/kubectl-whats-next.md" >}}
