---
title: Політика версійної розбіжності
type: docs
description: >
  Максимально підтримувана версійна розбіжність між різними компонентами Kubernetes.
weight: 60
---

<!-- overview -->

Цей документ описує максимально підтримувану версійну розбіжність між різними компонентами Kubernetes. Конкретні інструменти розгортання кластерів можуть накладати додаткові обмеження на версійну розбіжність.

<!-- body -->

## Підтримувані версії {#supported-versions}

Версії Kubernetes позначаються як **x.y.z**, де **x** — основна версія, **y** — мінорна версія, а **z** — патч-версія, згідно з термінологією [Семантичного Версіонування](https://semver.org/). Для отримання додаткової інформації дивіться [Kubernetes Release Versioning](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning).

Проєкт Kubernetes підтримує гілки випусків для останніх трьох мінорних випусків ({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}). Kubernetes 1.19 та новіші версії отримують [приблизно 1 рік патч-підтримки](/releases/patch-releases/#support-period). Kubernetes 1.18 та старіші отримували приблизно 9 місяців патч-підтримки.

Відповідні виправлення, включаючи виправлення безпеки, можуть бути перенесені на ці три гілки випусків залежно від серйозності та здійсненності. Патч-випуски вирізаються з цих гілок на [регулярній основі](/releases/patch-releases/#cadence), а також додаткові термінові випуски, коли це необхідно.

Група [Менеджерів Релізів](/releases/release-managers/) володіє цим рішенням.

Для отримання додаткової інформації дивіться сторінку [Патч-випуски](/releases/patch-releases/) Kubernetes.

## Підтримувана версійне розбіжність {#supported-version-skew}

### kube-apiserver

У [кластері з високою доступністю (HA)](/docs/setup/production-environment/tools/kubeadm/high-availability/), найновіші та найстаріші екземпляри `kube-apiserver` повинні бути в межах однієї мінорної версії.

Приклад:

* найновіший `kube-apiserver` має версію **{{< skew currentVersion >}}**
* інші екземпляри `kube-apiserver` підтримуються на версіях **{{< skew currentVersion >}}** та **{{< skew currentVersionAddMinor -1 >}}**

### kubelet

* `kubelet` не повинен бути новішим за `kube-apiserver`.
* `kubelet` може бути до трьох мінорних версій старішим за `kube-apiserver` (`kubelet` < 1.25 може бути не більше ніж на дві мінорні версії старішим за `kube-apiserver`).

Приклад:

* `kube-apiserver` має версію **{{< skew currentVersion >}}**
* `kubelet` підтримується на версіях **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}** та **{{< skew currentVersionAddMinor -3 >}}**

{{< note >}}
Якщо існує версійна розбіжність між екземплярами `kube-apiserver` у HA кластері, це звужує допустимі версії `kubelet`.
{{</ note >}}

Приклад:

* екземпляри `kube-apiserver` мають версії **{{< skew currentVersion >}}** та **{{< skew currentVersionAddMinor -1 >}}**
* `kubelet` підтримується на версіях **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**, та **{{< skew currentVersionAddMinor -3 >}}** (**{{< skew currentVersion >}}** не підтримується, оскільки це було б новішим за екземпляр `kube-apiserver` з версією **{{< skew currentVersionAddMinor -1 >}}**)

### kube-proxy

* `kube-proxy` не повинен бути новішим за `kube-apiserver`.
* `kube-proxy` може бути до трьох мінорних версій старішим за `kube-apiserver`
  (`kube-proxy` < 1.25 може бути не більше ніж на дві мінорні версії старішим за `kube-apiserver`).
* `kube-proxy` може бути до трьох мінорних версій старішим або новішим за екземпляр `kubelet`, з яким він працює (`kube-proxy` < 1.25 може бути не більше ніж на дві мінорні версії старішим або новішим за екземпляр `kubelet`, з яким він працює).

Приклад:

* `kube-apiserver` має версію **{{< skew currentVersion >}}**
* `kube-proxy` підтримується на версіях **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}** та **{{< skew currentVersionAddMinor -3 >}}**

{{< note >}}
Якщо існує версійна розбіжність між екземплярами `kube-apiserver` у HA кластері, це звужує допустимі версії `kube-proxy`.
{{</ note >}}

Приклад:

* екземпляри `kube-apiserver` мають версії **{{< skew currentVersion >}}** та **{{< skew currentVersionAddMinor -1 >}}**
* `kube-proxy` підтримується на версіях **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**, та **{{< skew currentVersionAddMinor -3 >}}** (**{{< skew currentVersion >}}** не підтримується, оскільки це було б новішим за екземпляр `kube-apiserver` з версією **{{< skew currentVersionAddMinor -1 >}}**)

### kube-controller-manager, kube-scheduler та cloud-controller-manager {#kube-controller-manager-kube-scheduler-and-cloud-controller-manager}

`kube-controller-manager`, `kube-scheduler` та `cloud-controller-manager` не повинні бути новішими за екземпляри `kube-apiserver`, з якими вони взаємодіють. Вони повинні відповідати мінорній версії `kube-apiserver`, але можуть бути до однієї мінорної версії старішими (для дозволу на живі оновлення).

Приклад:

* `kube-apiserver` має версію **{{< skew currentVersion >}}**
* `kube-controller-manager`, `kube-scheduler` та `cloud-controller-manager` підтримуються на версіях **{{< skew currentVersion >}}** та **{{< skew currentVersionAddMinor -1 >}}**

{{< note >}}
Якщо існує версійна розбіжність між екземплярами `kube-apiserver` у HA кластері, і ці компоненти можуть взаємодіяти з будь-яким екземпляром `kube-apiserver` у кластері (наприклад, через балансувальник навантаження), це звужує допустимі версії цих компонентів.
{{< /note >}}

Приклад:

* екземпляри `kube-apiserver` мають версії **{{< skew currentVersion >}}** та **{{< skew currentVersionAddMinor -1 >}}**
* `kube-controller-manager`, `kube-scheduler` та `cloud-controller-manager` взаємодіють з балансувальником навантаження, який може направляти запити до будь-якого екземпляра `kube-apiserver`
* `kube-controller-manager`, `kube-scheduler` та `cloud-controller-manager` підтримуються на
  версіях **{{< skew currentVersionAddMinor -1 >}}** (**{{< skew currentVersion >}}** не підтримується, оскільки це було б новішим за екземпляр `kube-apiserver` з версією **{{< skew currentVersionAddMinor -1 >}}**)

### kubectl

`kubectl` підтримується в межах однієї мінорної версії (старішої або новішої) від `kube-apiserver`.

Приклад:

* `kube-apiserver` має версію **{{< skew currentVersion >}}**
* `kubectl` підтримується на версіях **{{< skew currentVersionAddMinor 1 >}}**, **{{< skew currentVersion >}}**, та **{{< skew currentVersionAddMinor -1 >}}**

{{< note >}}
Якщо існує версійна розбіжність між екземплярами `kube-apiserver` у HA кластері, це звужує підтримувані версії `kubectl`.
{{< /note >}}

Приклад:

* екземпляри `kube-apiserver` мають версії **{{< skew currentVersion >}}** та **{{< skew currentVersionAddMinor -1 >}}**
* `kubectl` підтримується на версіях **{{< skew currentVersion >}}** та **{{< skew currentVersionAddMinor -1 >}}** (інші версії будуть більше ніж на одну мінорну версію відрізнятися від одного з компонентів `kube-apiserver`)

## Підтримуваний порядок оновлення компонентів {#supported-component-upgrade-order}

Підтримувана версійна розбіжність між компонентами має наслідки для порядку, в якому компоненти повинні оновлюватися. Цей розділ описує порядок, у якому компоненти повинні оновлюватися для переходу поточного кластера з версії **{{< skew currentVersionAddMinor -1 >}}** до версії **{{< skew currentVersion >}}**.

За бажанням, при підготовці до оновлення, проєкт Kubernetes рекомендує зробити наступне для отримання максимальної кількості виправлень та усунення помилок під час оновлення:

* Переконайтеся, що компоненти знаходяться на найновішій патч-версії вашої поточної мінорної версії.
* Оновіть компоненти до найновішої патч-версії цільової мінорної версії.

Наприклад, якщо ви використовуєте версію {{<skew currentVersionAddMinor -1>}}, переконайтеся, що ви використовуєте найновішу патч-версію. Потім оновіть до найновішої патч-версії {{<skew currentVersion>}}.

### kube-apiserver

Передумови:

* У кластері, що складається з одного екземпляру, наявний екземпляр `kube-apiserver` має версію **{{< skew currentVersionAddMinor -1 >}}**
* У HA кластері всі екземпляри `kube-apiserver` мають версії **{{< skew currentVersionAddMinor -1 >}}** або **{{< skew currentVersion >}}** (це забезпечує максимальну різницю в 1 мінорну версію між найстарішим та найновішим екземпляром `kube-apiserver`)
* Екземпляри `kube-controller-manager`, `kube-scheduler` та `cloud-controller-manager`, які взаємодіють з цим сервером, мають версію **{{< skew currentVersionAddMinor -1 >}}** (це забезпечує, що вони не новіші за поточну версію API сервера і знаходяться в межах 1 мінорної версії від нової версії API сервера)
* Екземпляри `kubelet` на всіх вузлах мають версії **{{< skew currentVersionAddMinor -1 >}}** або **{{< skew currentVersionAddMinor -2 >}}** (це забезпечує, що вони не новіші за поточну версію API сервера і знаходяться в межах 2 мінорних версій від нової версії API сервера)
* Зареєстровані вебхуки допуску здатні обробляти дані, які новий екземпляр `kube-apiserver` буде їм надсилати:
  * Обʼєкти `ValidatingWebhookConfiguration` та `MutatingWebhookConfiguration` оновлені для включення будь-яких нових версій REST ресурсів, доданих у **{{< skew currentVersion >}}** (або використовують опцію [`matchPolicy: Equivalent`](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy), доступну у версії v1.15+)
  * Вебхуки здатні обробляти будь-які нові версії REST ресурсів, які будуть їм надсилатися, і будь-які нові поля, додані до поточних версій у **{{< skew currentVersion >}}**

Оновіть `kube-apiserver` до **{{< skew currentVersion >}}**

{{< note >}}
Політики проєкту щодо [застарівання API](/docs/reference/using-api/deprecation-policy/) та
[рекомендацій щодо змін API](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md) вимагають, щоб `kube-apiserver` не пропускав мінорні версії під час оновлення, навіть у кластерах, що складаються з одного екземпляру.
{{< /note >}}

### kube-controller-manager, kube-scheduler та cloud-controller-manager {#kube-controller-manager-kube-scheduler-and-cloud-controller-manager-1}

Передумови:

* Екземпляри `kube-apiserver`, з якими ці компоненти взаємодіють, мають версію **{{< skew currentVersion >}}** (у HA кластерах, в яких ці компоненти керування можуть взаємодіяти з будь-яким екземпляром `kube-apiserver` у кластері, всі екземпляри `kube-apiserver` повинні бути оновлені перед оновленням цих компонентів)

Оновіть `kube-controller-manager`, `kube-scheduler` та `cloud-controller-manager` до **{{< skew currentVersion >}}**. Немає встановленого порядку оновлення між `kube-controller-manager`, `kube-scheduler` та `cloud-controller-manager`. Ви можете оновити ці компоненти в будь-якому порядку або навіть одночасно.

### kubelet

Передумови:

* Екземпляри `kube-apiserver`, з якими `kubelet` взаємодіє, мають версію **{{< skew currentVersion >}}**

За бажанням, оновіть екземпляри `kubelet` до **{{< skew currentVersion >}}** (або їх можна залишити на версіях **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**, або **{{< skew currentVersionAddMinor -3 >}}**)

{{< note >}}
Перед виконанням мінорного оновлення `kubelet`, [виселіть](/docs/tasks/administer-cluster/safely-drain-node/) Podʼи з цього вузла. Оновлення `kubelet` на місці до іншої мінорної версії не підтримується.
{{</ note >}}

{{< warning >}}
Запуск кластера з екземплярами `kubelet`, які постійно знаходяться на три мінорні версії позаду `kube-apiserver`, означає, що вони повинні бути оновлені перед оновленням контрольної площини.
{{</ warning >}}

### kube-proxy

Передумови:

* Екземпляри `kube-apiserver`, з якими `kube-proxy` взаємодіє, мають версію **{{< skew currentVersion >}}**

За бажанням, оновіть екземпляри `kube-proxy` до **{{< skew currentVersion >}}** (або їх можна залишити на версіях **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**, або **{{< skew currentVersionAddMinor -3 >}}**)

{{< warning >}}
Запуск кластера з екземплярами `kube-proxy`, які постійно знаходяться на три мінорні версії позаду `kube-apiserver`, означає, що вони повинні бути оновлені перед оновленням панелі управління.
{{</ warning >}}
