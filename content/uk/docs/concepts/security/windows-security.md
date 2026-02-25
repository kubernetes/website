---
title: Захист для вузлів з операційною системою Windows
content_type: concept
weight: 40
---

<!-- overview -->

На цій сторінці описано питання безпеки та найкращі практики, специфічні для операційної системи Windows.

<!-- body -->

## Захист конфіденційних даних на вузлах {#protection-for-secret-data-on-nodes}

У Windows дані з Secret записуються у відкритому вигляді у локальне сховище вузла
(на відміну від використання tmpfs / файлових систем у памʼяті в Linux). Як оператору
кластера, вам слід вжити обидва наступні додаткові заходи:

1. Використовуйте контроль доступу до файлів (file ACLs), щоб захистити місце розташування файлів Secrets.
1. Застосовуйте шифрування на рівні тому за допомогою [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server).

## Користувачі контейнерів {#container-users}

[RunAsUsername](/docs/tasks/configure-pod-container/configure-runasusername) може бути вказано для Podʼів Windows або контейнерів, щоб виконувати процеси контейнера
як конкретний користувач. Це приблизно еквівалентно [RunAsUser](/docs/concepts/security/pod-security-policy/#users-and-groups).

В контейнерах Windows доступні два типові облікових записів користувачів: ContainerUser та ContainerAdministrator. Різниця між цими двома обліковими записами користувачів описана у [When to use ContainerAdmin and ContainerUser user accounts](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/container-security#when-to-use-containeradmin-and-containeruser-user-accounts) в документації Microsoft _Secure Windows containers_.

Локальні користувачі можуть бути додані до образів контейнерів під час процесу створення контейнера.

{{< note >}}

* Образи на основі [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver) запускаються як `ContainerUser`
* Образи на основі [Server Core](https://hub.docker.com/_/microsoft-windows-servercore) запускаються як `ContainerAdministrator`

{{< /note >}}

Контейнери Windows також можуть працювати як облікові записи Active Directory за допомогою [Group Managed Service Accounts](/docs/tasks/configure-pod-container/configure-gmsa/)

## Ізоляція на рівні Podʼа {#pod-level-security-isolation}

Механізми контексту безпеки Podʼів, специфічні для Linux (такі як SELinux, AppArmor, Seccomp або власні POSIX можливості), не підтримуються на вузлах з Windows.

Привілейовані контейнери [не підтримуються](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext) на вузлах з Windows. Замість цього на вузлах з Windows можна використовувати [HostProcess контейнери](/docs/tasks/configure-pod-container/create-hostprocess-pod) для виконання багатьох завдань, які виконуються привілейованими контейнерами у Linux.
