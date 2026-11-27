---
title: Налаштування RunAsUserName для Podʼів та контейнерів Windows
content_type: task
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Ця сторінка показує, як використовувати параметр `runAsUserName` для Podʼів і контейнерів, які запускатимуться на вузлах Windows. Це приблизний відповідник параметра `runAsUser`, специфічного для Linux, який дає змогу запускати застосунки в контейнері від імені іншого користувача, ніж стандартний.

## {{% heading "prerequisites" %}} {#before-you-begin}

Вам потрібен кластер Kubernetes, а інструмент командного рядка kubectl має бути налаштований для взаємодії з вашим кластером. Очікується, що кластер має робочі вузли Windows, на які плануватимуться Podʼи з контейнерами, що виконують робочі навантаження Windows.

<!-- steps -->

## Встановлення імені користувача для Podʼа {#set-the-username-for-a-pod}

Щоб вказати імʼя користувача, з яким потрібно виконати процеси контейнера Podʼа, включіть поле `securityContext` ([PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)) в специфікацію Podʼа, а всередині нього — поле `windowsOptions` ([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core)), що містить поле `runAsUserName`.

Параметри контексту безпеки Windows, які ви вказуєте для Podʼа, застосовуються до всіх контейнерів та init-контейнерів у Podʼі.

Ось файл конфігурації Podʼа Windows зі встановленим полем `runAsUserName`:

{{% code_sample file="windows/run-as-username-pod.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-pod.yaml
```

Перевірте, що контейнер Podʼа працює:

```shell
kubectl get pod run-as-username-pod-demo
```

Отримайте доступ до оболонки запущеного контейнера:

```shell
kubectl exec -it run-as-username-pod-demo -- powershell
```

Перевірте, що оболонка працює від імені відповідного користувача:

```powershell
echo $env:USERNAME
```

Вивід має бути таким:

```
ContainerUser
```

## Встановлення імені користувача для контейнера {#set-the-username-for-a-container}

Щоб вказати імʼя користувача, з яким потрібно виконати процеси контейнера, включіть поле `securityContext` ([SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)) у маніфесті контейнера, а всередині нього — поле `windowsOptions` ([WindowsSecurityContextOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#windowssecuritycontextoptions-v1-core)), що містить поле `runAsUserName`.

Параметри контексту безпеки Windows, які ви вказуєте для контейнера, застосовуються лише до цього окремого контейнера й перевизначають налаштування рівня Podʼа.

Ось файл конфігурації Podʼа з одним контейнером, у якому поле `runAsUserName` встановлено на рівні Podʼа і на рівні контейнера:

{{% code_sample file="windows/run-as-username-container.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/windows/run-as-username-container.yaml
```

Перевірте, що контейнер Podʼа працює:

```shell
kubectl get pod run-as-username-container-demo
```

Отримайте доступ до оболонки запущеного контейнера:

```shell
kubectl exec -it run-as-username-container-demo -- powershell
```

Перевірте, що оболонка працює від імені відповідного користувача (того, який встановлений на рівні контейнера):

```powershell
echo $env:USERNAME
```

Вивід має бути таким:

```
ContainerAdministrator
```

## Обмеження імен користувачів Windows {#windows-username-limitations}

Щоб використовувати цю можливість, значення поля `runAsUserName` має бути дійсним імʼям користувача. Воно має бути у форматі `DOMAIN\USER`, де `DOMAIN\` необовʼязковий. Імена користувачів Windows нечутливі до регістру. Крім того, є певні обмеження щодо `DOMAIN` та `USER`:

- Поле `runAsUserName` не може бути порожнім і не може містити керуючі символи (ASCII значення: `0x00-0x1F`, `0x7F`)
- `DOMAIN` має бути або імʼям NetBios, або DNS-імʼям, кожне з власними обмеженнями:
  - NetBios імена: максимум 15 символів, не можуть починатися з `.` (крапка), і не можуть містити такі символи: `\ / : * ? " < > |`
  - DNS-імена: максимум 255 символів, містять тільки буквено-цифрові символи, крапки та дефіси, і не можуть починатися або закінчуватися `.` (крапка) або `-` (дефіс).
- `USER` має містити щонайбільше 20 символів, не може складатися *лише* з крапок або пробілів і не може містити таких символів: `" / \ [ ] : ; | = , + * ? < > @`.

Приклади припустимих значень для поля `runAsUserName`: `ContainerAdministrator`, `ContainerUser`, `NT AUTHORITY\NETWORK SERVICE`, `NT AUTHORITY\LOCAL SERVICE`.

Докладніше про ці обмеження дивіться [тут](https://support.microsoft.com/en-us/help/909264/naming-conventions-in-active-directory-for-computers-domains-sites-and) і [тут](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/new-localuser?view=powershell-5.1).

## {{% heading "whatsnext" %}} {#what-s-next}

* [Посібник з планування контейнерів Windows у Kubernetes](/docs/concepts/windows/user-guide/)
* [Керування ідентичністю робочих навантажень за допомогою групових керованих службових облікових записів (GMSA)](/docs/concepts/windows/user-guide/#managing-workload-identity-with-group-managed-service-accounts)
* [Налаштування GMSA для Podʼів і контейнерів Windows](/docs/tasks/configure-pod-container/configure-gmsa/)
