---
title: Визначення значень змінних середовища за допомогою контейнера ініціалізації
content_type: task
min-kubernetes-server-version: v1.34
weight: 30
---

<!-- overview -->

{{< feature-state feature_gate_name="EnvFiles" >}}

Ця сторінка показує, як налаштувати змінні середовища для контейнерів у Pod за допомогою файлу.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{% version-check %}}

<!-- steps -->

## How the design works {#how-the-design-works}

В цьому завданні ви створите Pod, який отримує змінні середовища з файлів, проєцюючи ці значення в запущений контейнер.

{{% code_sample file="pods/inject/envars-file-container.yaml" %}}

В маніфесті ви можете побачити, що `initContainer` монтує том `emptyDir` і записує змінні середовища у файл всередині нього, а звичайні контейнери посилаються на нього як на файл, так і на ключ змінної середовища через поле `fileKeyRef`, не потребуючи монтування тому. Коли поле `optional` встановлено в false, вказаний `key` у `fileKeyRef` повинен існувати у файлі змінних середовища.

Том буде змонтовано лише в контейнер, який записує у файл
(`initContainer`), тоді як контейнер-споживач, який споживає змінну середовища, не матиме змонтованого тому.

Формат файлу env відповідає [стандарту файлів env kubernetes](/docs/tasks/inject-data-application/define-environment-variable-via-file/#env-file-syntax).

Під час ініціалізації контейнера kubelet отримує змінні середовища
з вказаних файлів у томі `emptyDir` і надає їх контейнеру.

{{< note >}}
Всі типи контейнерів (initContainers, звичайні контейнери, sidecars контейнери та епhemeral контейнери) підтримують завантаження змінних середовища з файлів.

Хоча ці змінні середовища можуть зберігати конфіденційну інформацію, томи `emptyDir` не забезпечують тих самих механізмів захисту, що й спеціалізовані об'єкти Secret. Тому вважається, що відкриття конфіденційних змінних середовища для контейнерів за допомогою цієї функції не є кращою практикою з точки зору безпеки.
{{< /note >}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/envars-file-container.yaml
```

Перевірте, чи контейнер у Pod працює:

```shell
kubectl get pods

```shell
# Якщо новий Pod ще не справний, повторіть цю команду кілька разів.
kubectl get pods
```

Перевірте журнали контейнера на наявність змінних середовища:

```shell
kubectl logs dapi-test-pod -c use-envfile | grep DB_ADDRESS
```

Вивід показує значення вибраних змінних середовища:

```console
DB_ADDRESS=address
```

## Синтаксис файлів env {#env-file-syntax}

Формат файлів env Kubernetes походить з файлів `.env`.

У середовищі оболонки файли `.env` зазвичай завантажуються за допомогою команди `source .env`.

Для Kubernetes визначений формат файлів env дотримується більш суворих правил синтаксису:

* Порожні рядки: Порожні рядки ігноруються.

* Початкові пробіли: Початкові пробіли у всіх рядках ігноруються.

* Оголошення змінних: Змінні повинні бути оголошені у форматі `VAR=VAL`. Пробіли навколо `=` та пробіли в кінці ігноруються.

  ```console
  VAR=VAL → VAL
  ```

* Коментарі: Рядки, що починаються з #, вважаються коментарями і ігноруються.

  ```console
  # comment
  VAR=VAL → VAL

  VAR=VAL # not a comment → VAL # not a comment
  ```

* Продовження рядка: Зворотний слеш (`\`) в кінці рядка оголошення змінної вказує на те, що значення продовжується на наступному рядку. Рядки об'єднуються з одним пробілом.

  ```console
  VAR=VAL \
  VAL2
  → VAL VAL2
  ```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/).
* Ознайомтесь з [Оголошенням змінних середовища для контейнера](/docs/tasks/inject-data-application/define-environment-variable-container/)
* Дізнайтеся про [Експонування інформації про Pod для контейнерів через змінні середовища](/docs/tasks/inject-data-application/environment-variable-expose-pod-information)
