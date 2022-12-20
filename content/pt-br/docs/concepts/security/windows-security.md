---
reviewers:
  -
title: Segurança para Nós Windows
content_type: concept
weight: 40
---

<!-- overview -->

Esta página descreve considerações de segurança e boas práticas específicas para o sistema operacional Windows.

<!-- body -->

## Proteção para dados Secret nos Nós

No Windows, os dados do Secret são escritos em texto claro no Nó local do
armazenamento (em comparação ao uso de tmpfs / in-memory filesystems no Linux). Como um cluster
operador, você deve tomar as duas medidas adicionais a seguir:

1. Use arquivos ACLs para assegurar a localização do arquivo Secrets.
2. Aplicar criptografia à nível de volume usando
   [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server).

## Usuários dos Contêineres

[RunAsUsername](/docs/tasks/configure-pod-container/configure-runasusername)
pode ser especificado para Pods com Windows ou contêiner para executar os processos do contêiner como usuário específico. Isto é aproximadamente equivalente a
[RunAsUser](/docs/concepts/security/pod-security-policy/#users-and-groups).

Os contêineres Windows oferecem duas contas de usuário padrão, ContainerUser e ContainerAdministrator. As diferenças entre estas duas contas de usuário são cobertas em
[When to use ContainerAdmin and ContainerUser user accounts](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/container-security#when-to-use-containeradmin-and-containeruser-user-accounts)
dentro da documentação da Microsoft _Secure Windows containers_.

Os usuários locais podem ser adicionados as imagens do contêiner durante o processo de construção do mesmo.

{{< note >}}

- Imagens baseadas no [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver) rodam como
  `ContainerUser` por padrão.
- Imagens baseadas no [Server Core](https://hub.docker.com/_/microsoft-windows-servercore) rodam como
  `ContainerAdministrator` por padrão.

{{< /note >}}

Contêineres Windows também podem rodar como identidades do Active Directory usando
[Group Managed Service Accounts](/docs/tasks/configure-pod-container/configure-gmsa/)

## Isolamento de segurança a nível do Pod

Mecanismos de contexto de segurança de Pod específicos para Linux (como SELinux, AppArmor, Seccomp, ou capabilities customizados para POSIX) não são suportados nos nós do Windows.

Contêineres privilegiados [não são suportados](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext)
no Windows.
Em vez disso, [HostProcess containers](/docs/tasks/configure-pod-container/create-hostprocess-pod)
podem ser usados no Windows para realizar muitas das tarefas realizadas por contêineres privilegiados no Linux.
