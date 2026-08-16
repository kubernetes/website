---
title: Configurando RunAsUserName Para Pods e Contêineres Windows
content_type: task
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Esta página mostra como usar a configuração `runAsUserName` para Pods 
e contêineres que serão executados em nós Windows. Isso é aproximadamente 
equivalente à configuração `runAsUser` específica do Linux, permitindo a você 
executar aplicativos em um contêiner com um nome de usuário diferente do padrão. 

## {{% heading "prerequisites" %}}

Você precisa ter um cluster Kubernetes, e a ferramenta de linha de comando Kubectl
deve ser configurada para se comunicar com o seu cluster. Espera-se que o cluster
tenha nós de carga de trabalho Windows, onde os Pods com contêineres executando as cargas de trabalho do Windows,
serão agendados.

<!-- steps -->

## Defina o nome de usuário para um Pod

Para especificar o nome de usuário com o qual executar os processos de contêiner do Pod, 
inclua o campo `securityContext` ([PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)) 
na especificação do Pod, e dentro dela, o campo `WindowsOptions` ([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core)) 
contendo o campo `runAsUserName`.

As opções de contexto de segurança do Windows que você especificar para um Pod, 
se aplicam a todos os contêineres do Pod, inclusive os de inicialização.

Veja abaixo um arquivo de configuração para um Pod do Windows que possui o campo 
`runAsUserName` definido:

{{% code_sample file="windows/run-as-username-pod.yaml" %}}

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-pod.yaml
```

Verifique se o contêiner do Pod está em execução:

```shell
kubectl get pod run-as-username-pod-demo
```

Abra um shell para o contêiner em execução:

```shell
kubectl exec -it run-as-username-pod-demo -- powershell
```

Verifique se o shell está executando com o nome de usuário correto:

```powershell
echo $env:USERNAME
```

A saída deve ser:

```
ContainerUser
```

## Defina o nome de usuário para o contêiner

Para especificar o nome de usuário com o qual executar os processos de um contêiner, 
inclua o campo `SecurityContext` ([SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)) 
no manifesto do contêiner, e dentro dele, o campo `WindowsOptions` 
([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core)) 
contendo o campo `runAsUserName`.

As opções de contexto de segurança do Windows que você especificar para um contêiner, 
se aplicam apenas a esse contêiner individual, e substituem as configurações feitas 
no nível do Pod.

Aqui está o arquivo de configuração para um pod que possui um contêiner, 
e o campo `runAsUserName` está definido no nível do Pod e no nível do contêiner:

{{% code_sample file="windows/run-as-username-container.yaml" %}}

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-container.yaml
```

Verifique se o contêiner do Pod está em execução:

```shell
kubectl get pod run-as-username-container-demo
```

Abra um shell para o contêiner em execução:

```shell
kubectl exec -it run-as-username-container-demo -- powershell
```

Verifique se o shell está executando o usuário correto, (aquele definido no nível do contêiner):

```powershell
echo $env:USERNAME
```

A saída deve ser:

```
ContainerAdministrator
```

## Limitações de nomes de usuários no Windows

Para usar esse recurso, o valor definido no campo `runAsUserName` deve ser um nome 
de usuário válido. Deve ter o seguinte formato: `DOMAIN\USER`, onde ` DOMAIN\` 
é opcional. Os nomes de usuário do Windows não diferenciam letras maiúsculas 
e minúsculas. Além disso, existem algumas restrições em relação ao `DOMAIN` e `USER`:
- O campo `runAsUserName`: não pode estar vazio, e não pode conter caracteres 
  de controle (Valores ASCII : `0x00-0x1F`, `0x7F`)
- O nome de `DOMAIN` NetBios, ou um nome de DNS, cada um com suas próprias restrições:
  - Nomes NetBios: máximo de 15 caracteres, não podem iniciar com `.` (ponto), 
  e não podem conter os seguintes caracteres: `\ / : * ? " < > |`
  - Nomes DNS: máximo de 255 caracteres, contendo apenas caracteres alfanuméricos, 
  pontos, e traços, e não podem iniciar ou terminar com um `.` (ponto) ou `-` (traço).
- O `USER`: deve ter no máximo 20 caracteres, não pode conter *somente* pontos ou espaços, 
  e não pode conter os seguintes caracteres: `" / \ [ ] : ; | = , + * ? < > @`.

Exemplos de valores aceitáveis para o campo `runAsUserName`: `ContainerAdministrator`, 
`ContainerUser`, `NT AUTHORITY\NETWORK SERVICE`, `NT AUTHORITY\LOCAL SERVICE`.

Para mais informações sobre estas limitações, verifique [aqui](https://support.microsoft.com/en-us/help/909264/naming-conventions-in-active-directory-for-computers-domains-sites-and) e [aqui](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/new-localuser?view=powershell-5.1).

## {{% heading "whatsnext" %}}

* [Guia Para Agendar Contêineres Windows em Kubernetes](/docs/concepts/windows/user-guide/)
* [Gerenciando Identidade de Cargas de Trabalho com Contas de Serviço Gerenciadas em Grupo (GMSA)](/docs/concepts/windows/user-guide/#managing-workload-identity-with-group-managed-service-accounts)
* [Configure GMSA Para Pods e Contêineres Windows](/docs/tasks/configure-pod-container/configure-gmsa/)

