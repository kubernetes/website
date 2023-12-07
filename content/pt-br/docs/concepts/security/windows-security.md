---
title: Segurança para Nós Windows
content_type: concept
weight: 40
---

<!-- overview -->

Esta página descreve considerações de segurança e boas práticas específicas para o sistema operacional Windows.

<!-- body -->

## Proteção para dados Secret nos Nós

No Windows, os dados do Secret são escritos em texto não-encriptado no armazenamento local do nó (em comparação ao uso de tmpfs / sistemas de arquivo em memória no Linux). Como um operador do cluster, você deve tomar as duas medidas adicionais a seguir:

1. Use ACLs em arquivos para proteger a localização do arquivo Secrets.
2. Aplique criptografia a nível de volume usando
   [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server).

## Usuários dos Contêineres

[RunAsUsername](/docs/tasks/configure-pod-container/configure-runasusername)
pode ser utilizado em Pods ou contêineres com Windows para executar os processos do contêiner como usuário específico. Isto é aproximadamente equivalente a
[RunAsUser](/docs/concepts/security/pod-security-policy/#users-and-groups).

Os contêineres Windows oferecem duas contas de usuário padrão, ContainerUser e ContainerAdministrator. As diferenças entre estas duas contas de usuário são descritas em
[When to use ContainerAdmin and ContainerUser user accounts](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/container-security#when-to-use-containeradmin-and-containeruser-user-accounts)
dentro da documentação da Microsoft _Secure Windows containers_.

Os usuários locais podem ser adicionados às imagens do contêiner durante o processo de criação do mesmo.

{{< note >}}

- Imagens baseadas no [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver) rodam como
  `ContainerUser` por padrão.
- Imagens baseadas no [Server Core](https://hub.docker.com/_/microsoft-windows-servercore) rodam como
  `ContainerAdministrator` por padrão.

{{< /note >}}

Contêineres Windows também podem rodar como identidades do Active Directory usando
[Group Managed Service Accounts](/docs/tasks/configure-pod-container/configure-gmsa/)

## Isolamento de segurança a nível do Pod

Mecanismos de contexto de segurança de Pod específicos para Linux (como SELinux, AppArmor, Seccomp, ou capabilities customizados para POSIX) não são suportados nos nós com Windows.

Contêineres privilegiados [não são suportados](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext)
no Windows.
Em vez disso, [contêineres HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod)
podem ser usados no Windows para realizar muitas das tarefas realizadas por contêineres privilegiados no Linux.
