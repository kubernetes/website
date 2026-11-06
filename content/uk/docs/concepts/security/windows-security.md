---
title: Безпека для вузлів Windows
content_type: concept
weight: 40
---

<!-- overview -->

На цій сторінці описано міркування щодо безпеки та рекомендації, специфічні для операційної системи Windows.

<!-- body -->

## Захист даних Secret на вузлах {#protection-for-secret-data-on-nodes}

У Windows дані з Secrets записуються у відкритому вигляді в локальне сховище вузла (на відміну від tmpfs / файлових систем у памʼяті в Linux). Як оператору кластера вам слід вжити обох наведених нижче додаткових заходів:

1. Використовуйте ACL файлів, щоб захистити розташування файлів Secrets.
1. Застосовуйте шифрування на рівні тому за допомогою [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server).

## Користувачі контейнерів {#container-users}

[RunAsUsername](/docs/tasks/configure-pod-container/configure-runasusername) можна вказати для Podʼів або контейнерів Windows, щоб виконувати процеси контейнера від імені конкретного користувача. Це приблизний еквівалент [RunAsUser](/docs/concepts/security/pod-security-policy/#users-and-groups).

Контейнери Windows мають два стандартні облікові записи користувачів: ContainerUser та ContainerAdministrator. Різницю між цими обліковими записами описано в розділі [When to use ContainerAdmin and ContainerUser user accounts](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/container-security#when-to-use-containeradmin-and-containeruser-user-accounts) документації Microsoft _Secure Windows containers_.

Локальних користувачів можна додавати до образів контейнерів під час їх збирання.

{{< note >}}

* Образи на основі [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver) стандартно запускаються як `ContainerUser`
* Образи на основі [Server Core](https://hub.docker.com/_/microsoft-windows-servercore) стандартно запускаються як `ContainerAdministrator`

{{< /note >}}

Контейнери Windows також можуть працювати з ідентичностями Active Directory за допомогою [Group Managed Service Accounts](/docs/tasks/configure-pod-container/configure-gmsa/)

## Ізоляція безпеки на рівні Podʼа {#pod-level-security-isolation}

Специфічні для Linux механізми контексту безпеки Podʼів (такі як SELinux, AppArmor, Seccomp або власні POSIX capabilities) не підтримуються на вузлах Windows.

Привілейовані контейнери [не підтримуються](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext) у Windows. Натомість у Windows можна використовувати [контейнери HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod) для виконання багатьох завдань, які в Linux виконують привілейовані контейнери.
