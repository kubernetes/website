---
title: Налаштування RunAsUserName для Podʼів та контейнерів Windows
content_type: task
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Ця сторінка показує, як використовувати параметр `runAsUserName` для Podʼів та контейнерів, які будуть запущені на вузлах Windows. Це приблизно еквівалент параметра `runAsUser`, який використовується для Linux, і дозволяє виконувати програми в контейнері від імені іншого імені користувача, ніж типово.

## {{% heading "prerequisites" %}}

Вам потрібно мати кластер Kubernetes, а також інструмент командного рядка kubectl повинен бути налаштований для взаємодії з вашим кластером. Очікується, що в кластері будуть використовуватися вузли Windows, де будуть запускатися Podʼи з контейнерами, що виконують робочі навантаження у Windows.

<!-- steps -->

## Встановлення імені користувача для Podʼа {#set-the-username-for-a-pod}

Щоб вказати імʼя користувача, з яким потрібно виконати процеси контейнера Podʼа, включіть поле `securityContext` ([PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)) в специфікацію Podʼа, а всередині нього — поле `windowsOptions` ([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core)), що містить поле `runAsUserName`.

Опції безпеки Windows, які ви вказуєте для Podʼа, застосовуються до всіх контейнерів та контейнерів ініціалізації у Podʼі.

Ось конфігураційний файл для Podʼа Windows зі встановленим полем `runAsUserName`:

{{% code_sample file="windows/run-as-username-pod.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-pod.yaml
```

Перевірте, що Контейнер Podʼа працює:

```shell
kubectl get pod run-as-username-pod-demo
```

Отримайте доступ до оболонки контейнера:

```shell
kubectl exec -it run-as-username-pod-demo -- powershell
```

Перевірте, що оболонка працює від імені відповідного користувача:

```powershell
echo $env:USERNAME
```

Вивід повинен бути:

```none
ContainerUser
```

## Встановлення імені користувача для контейнера {#set-the-username-for-a-container}

Щоб вказати імʼя користувача, з яким потрібно виконати процеси контейнера, включіть поле `securityContext` ([SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)) у маніфесті контейнера, а всередині нього — поле `windowsOptions` ([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core)), що містить поле `runAsUserName`.

Опції безпеки Windows, які ви вказуєте для контейнера, застосовуються тільки до цього окремого контейнера, і вони перевизначають налаштування, зроблені на рівні Podʼа.

Ось конфігураційний файл для Podʼа, який має один Контейнер, а поле `runAsUserName` встановлене на рівні Podʼа та на рівні Контейнера:

{{% code_sample file="windows/run-as-username-container.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-container.yaml
```

Перевірте, що Контейнер Podʼа працює:

```shell
kubectl get pod run-as-username-container-demo
```

Отримайте доступ до оболонки контейнера:

```shell
kubectl exec -it run-as-username-container-demo -- powershell
```

Перевірте, що оболонка працює від імені відповідного користувача (того, який встановлений на рівні контейнера):

```powershell
echo $env:USERNAME
```

Вивід повинен бути:

```none
ContainerAdministrator
```

## Обмеження імен користувачів Windows {#windows-username-limitations}

Для використання цієї функції значення, встановлене у полі `runAsUserName`, повинно бути дійсним імʼям користувача. Воно повинно мати наступний формат: `DOMAIN\USER`, де `DOMAIN\` є необовʼязковим. Імена користувачів Windows регістронезалежні. Крім того, існують деякі обмеження стосовно `DOMAIN` та `USER`:

- Поле `runAsUserName` не може бути порожнім і не може містити керуючі символи (ASCII значення: `0x00-0x1F`, `0x7F`)
- `DOMAIN` може бути або NetBios-імʼям, або DNS-імʼям, кожне з власними обмеженнями:
  - NetBios імена: максимум 15 символів, не можуть починатися з `.` (крапка), і не можуть містити наступні символи: `\ / : * ? " < > |`
  - DNS-імена: максимум 255 символів, містять тільки буквено-цифрові символи, крапки та дефіси, і не можуть починатися або закінчуватися `.` (крапка) або `-` (дефіс).
- `USER` може мати не більше 20 символів, не може містити *тільки* крапки або пробіли, і не може містити наступні символи: `" / \ [ ] : ; | = , + * ? < > @`.

Приклади припустимих значень для поля `runAsUserName`: `ContainerAdministrator`, `ContainerUser`, `NT AUTHORITY\NETWORK SERVICE`, `NT AUTHORITY\LOCAL SERVICE`.

Для отримання додаткової інформації про ці обмеження, перевірте [тут](https://support.microsoft.com/en-us/help/909264/naming-conventions-in-active-directory-for-computers-domains-sites-and) та [тут](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/new-localuser?view=powershell-5.1).

## {{% heading "whatsnext" %}}

- [Посібник з планування контейнерів Windows в Kubernetes](/docs/concepts/windows/user-guide/)
- [Управління ідентифікацією робочого навантаження за допомогою групових керованих службових облікових записів (GMSA)](/docs/concepts/windows/user-guide/#managing-workload-identity-with-group-managed-service-accounts)
- [Налаштування GMSA для Podʼів та контейнерів Windows](/docs/tasks/configure-pod-container/configure-gmsa/)
