---
layout: blog
title: "Kubernetes v1.37: Storage Version Migration є стандартно увімкненим"
draft: true
slug: kubernetes-v1-37-storage-version-migration-ga
author: >
  [Michael Aspinwall](https://github.com/michaelasp) (Google)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

Я радий, що *міграція версії зберігання* (SVM) досягла загальної доступності (GA) у Kubernetes v1.37!

Після кількох випусків роботи та тестування вбудований API StorageVersionMigration (`storagemigration.k8s.io/v1`)
та контролер панелі управління тепер повністю стабільні та стандартно увімкнені у всіх кластерах Kubernetes v1.37.

## Проблема застарілих версій зберігання {#the-problem-with-stale-storage-versions}

У Kubernetes збережені API-ресурси записуються з використанням певної *версії зберігання* (представлення схеми). Те, як Kubernetes взаємодіє з обʼєктним сховищем, принципово вимагає зміни ресурсу, щоб гарантувати використання останньої версії зберігання для всіх ресурсів. Це створює проблеми, коли ви хочете змінити версію зберігання ресурсу.

Один із прикладів сценарію, коли ви можете захотіти змінити версію зберігання ресурсу, — це коли ви просуваєте CRD, щоб відмовитися від старішої версії API (наприклад, `v1alpha1`) на користь новішої (залишивши лише `v1beta1` та `v1`). Відмова від старішої версії API є проблемою, поки в сховищі все ще залишаються ресурси, збережені зі старою альфа-версією.

Щоб уникнути проблем, ви призначаєте `v1` як нову версію зберігання; але само по собі цього недостатньо. Поки нові записи зберігаються як `v1`, будь-який наявний ресурс може залишатися збереженим як `v1alpha1` або `v1beta1` у сховищі. Ви не можете безпечно видалити `v1alpha1` з `.status.storedVersions` CRD або припинити підтримку обслуговування, доки кожен окремий ресурс у сховищі не буде переписаний так, щоб не серіалізуватися та не зберігатися з альфа-версією.

Іншим доречним прикладом є *шифрування у стані спокою* та, повʼязана з ним, *ротація ключів*. Коли ви налаштовуєте шифрування у стані спокою або виконуєте ротацію ключів шифрування, наявні ресурси у сховищі залишаються **незашифрованими** (або зашифрованими старими ключами), доки вони не будуть явно
переписані через API-сервер Kubernetes.

Історично адміністратори кластерів та автори CRD мали покладатися на ручні скрипти `kubectl get` / `kubectl replace` або розгортати зовнішній компонент `kube-storage-version-migrator`, щоб примусово виконувати перезапис. Ці підходи часто були марудними, схильними до помилок та важкими для моніторингу.

## Як працює міграція версії зберігання {#how-storage-version-migration-works}

Запустити міграцію версії зберігання так само просто, як створити декларативний обʼєкт StorageVersionMigration. Вбудований контролер StorageVersionMigrator у панелі управління Kubernetes відстежує ці обʼєкти та автоматично переносить наявні ресурси до стандартної версії зберігання для цього API.

### Приклад: міграція API власного ресурсу {#example-custom-resources}

Припустимо, ви оновили CustomResourceDefinition (`crontabs.example.com`), щоб використовувати `v1` як версію зберігання. Щоб мігрувати всі наявні збережені ресурси зі старіших версій, створіть StorageVersionMigration:

```yaml
apiVersion: storagemigration.k8s.io/v1
kind: StorageVersionMigration
metadata:
  name: crontabs-migration
spec:
  resource:
    group: example.com
    resource: crontabs
```

Застосуйте маніфест за допомогою `kubectl`:

```shell
kubectl apply -f crontabs-migration.yaml
```

## Моніторинг та перевірка міграцій {#monitoring-and-verifying-migrations}

Контролер StorageVersionMigrator оновлює `status` обʼєкта StorageVersionMigration у міру виконання міграції. Ви можете переглянути стан міграції за допомогою `kubectl`:

```shell
kubectl get storageversionmigration.storagemigration.k8s.io/crontabs-migration -o yaml
```

Успішна міграція повідомить про умову `Succeeded` зі значенням True:

```yaml
status:
  conditions:
    - type: Running
      status: "False"
      lastUpdateTime: "2026-08-02T10:05:00Z"
      reason: StorageVersionMigrationInProgress
    - type: Succeeded
      status: "True"
      lastUpdateTime: "2026-08-02T10:05:00Z"
      reason: StorageVersionMigrationSucceeded
```

Після успішної міграції ви можете бути впевнені, що всі екземпляри ресурсу у сховищі збережені у поточній версії зберігання. Для CRD версія зберігання має бути оновлена в `.status.storedVersions` CRD так, щоб містити лише бажану версію. Якщо `.status.storedVersions` не оновлено після успішної міграції, це означає, що CRD було оновлено під час міграції. У цьому випадку міграцію слід повторити, щоб безпечно визнати старішу версію зберігання застарілою.

## Включення міграцій у ваші маніфести CRD {#including-migrations-in-your-crd-manifests}

Оскільки StorageVersionMigration — це стандартний декларативний API Kubernetes, автори CRD можуть постачати або запускати міграції безпосередньо разом з оновленнями CRD. Наприклад, ви можете включити міграцію в той самий маніфест, що й оновлений CustomResourceDefinition:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.example.com
spec:
  group: example.com
  # Оновлений список версій, де v1 має storage: true
  ...
---
apiVersion: storagemigration.k8s.io/v1
kind: StorageVersionMigration
metadata:
  name: crontabs-migration
spec:
  resource:
    group: example.com
    resource: crontabs
```

## Що далі? {#whats-next}

* Дізнайтеся більше про концепції, що стоять за [версіями зберігання](/docs/concepts/overview/working-with-objects/storage-version/).
* Прочитайте покроковий посібник: [міграція обʼєктів Kubernetes з використанням міграції версії зберігання](/docs/tasks/manage-kubernetes-objects/storage-version-migration/).

SIG API Machinery буде рада почути ваш відгук, коли ви впроваджуватимете вбудовану міграцію версії зберігання у своїх кластерах. Звертайтеся до нас на каналі [#sig-api-machinery](https://kubernetes.slack.com/messages/sig-api-machinery) у Slack або беріть участь у наших обговореннях у спільноті!
