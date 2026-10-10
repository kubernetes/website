---
title: "autocompletar do bash no Linux"
description: "Algumas configurações opcionais para o autocompletar do bash no Linux."
headless: true
_build:
  list: never
  render: never
  publishResources: false
---

### Introdução

O script de autocompletar do kubectl para Bash pode ser gerado com o comando `kubectl completion bash`. O script permite habilitar o autocompletar do kubectl no seu shell.

No entanto, o script autocompletar depende do [**bash-completion**](https://github.com/scop/bash-completion), o que significa que você precisa instalar este software primeiro (executando `type _init_completion` você pode testar se tem o bash-completion instalado).

### Instale bash-completion

O bash-completion é fornecido por muitos gerenciadores de pacotes (veja [aqui](https://github.com/scop/bash-completion#installation)). Você pode instalar com `apt-get install bash-completion` ou `yum install bash-completion`, etc.

Os comandos acima criam `/usr/share/bash-completion/bash_completion`, que é o  script principal de bash-completion. Dependendo do seu gerenciador de pacotes, você tem que adicionar manualmente ao seu arquivo `~/.bashrc`.

Para descobrir, recarregue seu shell e execute `type _init_completion`. Se o comando for bem-sucedido, já está definido, caso contrário, adicione o seguinte ao seu arquivo `~/.bashrc`:

```bash
source /usr/share/bash-completion/bash_completion
```

Recarregue o seu shell e verifique se o bash-completion está instalado corretamente digitando `type _init_completion`.

### Ative o autocompletar do kubectl

#### Bash

Agora você precisa garantir que o autocompletar do kubectl esteja ativo em todas as suas sessões shell. Existem duas maneiras pelas quais você pode fazer isso:

{{< tabs name="kubectl_bash_autocompletion" >}}
{{< tab name="User" codelang="bash" >}}
echo 'source <(kubectl completion bash)' >>~/.bashrc
{{< /tab >}}
{{< tab name="System" codelang="bash" >}}
kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
sudo chmod a+r /etc/bash_completion.d/kubectl
{{< /tab >}}
{{< /tabs >}}

Se você tiver um alias para kubectl, você pode estender o autocompletar do shell para trabalhar com esse alias:

```bash
echo 'alias k=kubectl' >>~/.bashrc
echo 'complete -o default -F __start_kubectl k' >>~/.bashrc
```

{{< note >}}
bash-completion fornece todos os scripts de autocompletar em `/etc/bash_completion.d`.
{{< /note >}}

Todas as abordagens são equivalentes. Depois de recarregar seu shell, o autocompletar do kubectl deve estar funcionando. Para ativar o autocompletar do bash na sessão atual do shell, execute `exec bash`:

```bash
exec bash
```
