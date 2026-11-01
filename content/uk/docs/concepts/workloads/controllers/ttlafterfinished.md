---
title: Автоматичне очищення завершених Jobs
content_type: concept
weight: 70
description: >-
  Механізм часу життя (TTL) для очищення старих Jobs, які завершили виконання.
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Коли ваш Job завершився, корисно залишити цей Job в API (і не видаляти його відразу), щоб ви могли визначити, успішно він виконався чи зазнав невдачі.

{{<glossary_tooltip text="Контролер" term_id="controller">}} TTL-after-finished у Kubernetes забезпечує механізм TTL (time to live), щоб обмежити час життя обʼєктів Job, які завершили виконання.

<!-- body -->

## Очищення завершених Jobs {#cleanup-for-finished-jobs}

Контролер TTL-after-finished підтримується лише для Jobs. Ви можете використовувати цей механізм для автоматичного очищення завершених Jobs (як `Complete`, так і `Failed`), вказавши поле `.spec.ttlSecondsAfterFinished` Job, як у цьому [прикладі](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically).

Контролер TTL-after-finished вважає, що Job можна очистити через TTL секунд після його завершення. Відлік починається, коли умова статусу Job змінюється, показуючи, що Job є або `Complete`, або `Failed`; щойно TTL закінчується, цей Job стає придатним для [каскадного](/docs/concepts/architecture/garbage-collection/#cascading-deletion) видалення. Коли контролер TTL-after-finished очищає Job, він видаляє його каскадно, тобто разом із залежними обʼєктами.

Kubernetes дотримується гарантій життєвого циклу обʼєкта для Job, таких як очікування [завершувачів](/docs/concepts/overview/working-with-objects/finalizers/).

Ви можете встановити TTL секунд у будь-який момент. Ось деякі приклади встановлення поля `.spec.ttlSecondsAfterFinished` Job:

* Вкажіть це поле в маніфесті Job, щоб Job можна було автоматично очистити через певний час після його завершення.
* Вручну встановіть це поле для наявних, уже завершених Jobs, щоб вони стали придатними для очищення.
* Використовуйте [змінювальний вебхук допуску](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook) для динамічного встановлення цього поля під час створення Job. Адміністратори кластера можуть використовувати це, щоб застосовувати політику TTL для завершених Jobs.
* Використовуйте [змінювальний вебхук допуску](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook) для динамічного встановлення цього поля після завершення Job та вибору різних значень TTL на основі статусу Job і міток. У цьому випадку вебхук повинен виявляти зміни в полі `.status` Job і встановлювати TTL лише тоді, коли Job позначається як завершений.
* Напишіть власний контролер для керування TTL очищення для Jobs, які відповідають певному {{< glossary_tooltip term_id="selector" text="селектору" >}}.

## Застереження {#caveats}

### Оновлення TTL для завершених Jobs {#updating-ttl-for-finished-jobs}

Ви можете змінювати період TTL, наприклад, поле `.spec.ttlSecondsAfterFinished` Jobs, після створення або завершення Job. Якщо ви збільшуєте період TTL після закінчення наявного періоду `ttlSecondsAfterFinished`, Kubernetes не гарантує збереження цього Job, навіть якщо оновлення для збільшення TTL повертає успішну відповідь API.

### Зсув часу {#time-skew}

Оскільки контролер TTL-after-finished використовує мітки часу, збережені в Jobs Kubernetes, для визначення того, чи минув TTL, ця функція чутлива до зсуву часу в кластері, через що панель управління може очистити обʼєкти Job у неправильний час.

Годинники не завжди точні, але різниця повинна бути дуже малою. Майте на увазі цей ризик під час встановлення ненульового TTL.

## {{% heading "whatsnext" %}} {#whats-next}

* Прочитайте [Автоматичне очищення Jobs](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)

* Зверніться до [Пропозиції з покращення Kubernetes](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/592-ttl-after-finish/README.md) (KEP) щодо додавання цього механізму.
