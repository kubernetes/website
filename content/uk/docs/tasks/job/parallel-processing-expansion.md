---
title: Паралельна обробка з розширенням
content_type: task
min-kubernetes-server-version: v1.8
weight: 50
---

<!-- overview -->

Це завдання демонструє запуск кількох {{< glossary_tooltip text="Jobs" term_id="job" >}} на основі загального шаблону. Ви можете використовувати цей підхід для обробки пакетних завдань паралельно.

У цьому прикладі є лише три елементи: _apple_, _banana_ та _cherry_. Приклади Job обробляють кожен елемент, виводячи рядок, а потім очікуючи дії користувача.

Див. [використання Job у реальних навантаженнях](#using-jobs-in-real-workloads), щоб дізнатися, як цей підхід вписується у більш реалістичні випадки використання.

## {{% heading "prerequisites" %}}

Вам слід бути знайомим з базовим, не-паралельним використанням [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}}

Для базового шаблонування вам потрібна утиліта командного рядка `sed`.

Для виконання розширеного прикладу шаблонування вам потрібен встановлений [Python](https://www.python.org/) та бібліотека шаблонів Jinja2 для Python.

Після налаштування Python ви можете встановити Jinja2, виконавши:

```shell
pip install --user jinja2
```

<!-- steps -->

## Створення Job на основі шаблону {#create-jobs-based-on-a-template}

Спочатку завантажте наступний шаблон Job у файл з назвою `job-tmpl.yaml`. Ось що ви завантажите:

{{% code_sample file="application/job/job-tmpl.yaml" %}}

```shell
# Використайте curl для завантаження job-tmpl.yaml
curl -L -s -O https://k8s.io/examples/application/job/job-tmpl.yaml
```

Завантажений вами файл ще не є валідним {{< glossary_tooltip text="маніфестом" term_id="manifest" >}} Kubernetes. Замість цього цей шаблон є YAML-представленням об’єкта Job з деякими заповнювачами, які потрібно замінити перед використанням. Синтаксис `$ITEM` не має значення для Kubernetes.

### Створення маніфестів з шаблону {#create-manifests-from-the-template}

Наступний код використовує `sed` для заміни `$ITEM` на значення змінної з циклу, зберігаючи результат в тимчасову теку `jobs`:

```shell
# Розмноження шаблону на кілька файлів, по одному для коженого процесу
mkdir -p ./jobs
for item in apple banana cherry
do
  cat job-tmpl.yaml | sed "s/\$ITEM/$i/g" > ./jobs/job-$i.yaml
done
```

На виході ви маєте отримати три файли:

```none
job-apple.yaml
job-banana.yaml
job-cherry.yaml
```

### Створення Завдань (Job) з маніфестів {#create-jobs-from-manifests}

Далі, створіть всі три Job, використовуючи файли, які ви створили:

```shell
kubectl apply -f ./jobs
```

Вивід буде подібний до цього:

```none
job.batch/process-item-apple created
job.batch/process-item-banana created
job.batch/process-item-cherry created
```

Тепер ви можете перевірити стан Job:

```shell
kubectl get jobs -l jobgroup=jobexample
```

Вивід буде подібний до цього:

```none
NAME                  COMPLETIONS   DURATION   AGE
process-item-apple    1/1           14s        22s
process-item-banana   1/1           12s        21s
process-item-cherry   1/1           12s        20s
```

Використання опції `-l` для `kubectl` вибирає лише Job, які є частиною цієї групи Job (в системі можуть бути інші не Завдання (Job)).

Ви також можете перевірити стан Podʼів, використовуючи той самий {{< glossary_tooltip text="селектор міток" term_id="selector" >}}:

```shell
kubectl get pods -l jobgroup=jobexample
```

Вивід буде подібний до цього:

```none
NAME                        READY     STATUS      RESTARTS   AGE
process-item-apple-kixwv    0/1       Completed   0          4m
process-item-banana-wrsf7   0/1       Completed   0          4m
process-item-cherry-dnfu9   0/1       Completed   0          4m
```

Ви можете використати цю одну команду для перевірки виводу всіх Job одночасно:

```shell
kubectl logs -f -l jobgroup=jobexample
```

Вивід має бути таким:

```none
Processing item apple
Processing item banana
Processing item cherry
```

### Очищення {#cleanup-1}

```shell
# Видаліть створені Job
# Ваш кластер автомтично видаляє пов’язані з Job Pod
kubectl delete jobs -l jobgroup=jobexample
```

## Використання розширених параметрів шаблонів {#use-advanced-template-parameters}

В [першому прикладі](#create-jobs-based-on-a-template), кожен екземпляр шаблону мав один параметр, цей параметр тако використовувався в назві Job. Однак, [назви](/docs/concepts/overview/working-with-objects/names/#names) обмежені набором символів, які можна використовувати.

Ось трохи складніший [шаблон Jinja](https://palletsprojects.com/p/jinja/), для створення маніфестів та обʼєктів на їх основі, з кількома параметрами для кожного Завдання (Job).

В першій частині завдання скористайтесь однорядковим скриптом Python для перетворення шаблонів в набір маніфестів.

Спочатку скопіюйте та вставте наступний шаблон обʼєкта Job у файл з назвою `job.yaml.jinja2`:

```liquid
{% set params = [{ "name": "apple", "url": "http://dbpedia.org/resource/Apple", },
                  { "name": "banana", "url": "http://dbpedia.org/resource/Banana", },
                  { "name": "cherry", "url": "http://dbpedia.org/resource/Cherry" }]
%}
{% for p in params %}
{% set name = p["name"] %}
{% set url = p["url"] %}
---
apiVersion: batch/v1
kind: Job
metadata:
  name: jobexample-{{ name }}
  labels:
    jobgroup: jobexample
spec:
  template:
    metadata:
      name: jobexample
      labels:
        jobgroup: jobexample
    spec:
      containers:
      - name: c
        image: busybox:1.28
        command: ["sh", "-c", "echo Processing URL {{ url }} && sleep 5"]
      restartPolicy: Never
{% endfor %}
```

Наведений шаблон визначає два параметри для кожного обʼєкта Job за допомогою списку словників Python (рядки 1-4). Цикл `for` генерує один маніфест Job для кожного набору параметрів (інші рядки).

Цей приклад використовує можливості YAML. Один файл YAML може містити кілька документів (у цьому випадку маніфестів Kubernetes), розділених рядком `---`.

Ви можете передати вивід безпосередньо до `kubectl`, щоб створити Jobs.

Далі використовуйте цю однорядковий скрипт Python для розширення шаблону:

```shell
alias render_template='python -c "from jinja2 import Template; import sys; print(Template(sys.stdin.read()).render());"'
```

Використовуйте `render_template` для конвертації параметрів та шаблону в один файл YAML, що містить маніфести Kubernetes:

```shell
# Це вимагає визначеного раніше аліасу
cat job.yaml.jinja2 | render_template > jobs.yaml
```

Ви можете переглянути `jobs.yaml`, щоб переконатися, що скрипт `render_template` працює правильно.

Коли ви переконаєтесь, що `render_template` працює так, як ви задумали, ви можете передати його вивід до `kubectl`:

```shell
cat job.yaml.jinja2 | render_template | kubectl apply -f -
```

Kubernetes прийме та запустить створені вами Jobs.

### Очищення {#cleanup-2}

```shell
# Видалення створених вами Jobs
# Ваш кластер автоматично очищає їхні Pods
kubectl delete job -l jobgroup=jobexample
```

<!-- discussion -->

## Використання Jobs у реальних робочих навантаженнях {#using-jobs-in-real-workloads}

У реальному випадку використання кожен Job виконує деяку суттєву обчислювальну задачу, наприклад, рендеринг кадру фільму або обробку діапазону рядків у базі даних. Якщо ви рендерите відео, ви будете встановлювати `$ITEM` на номер кадру. Якщо ви обробляєте рядки з таблиці бази даних, ви будете встановлювати `$ITEM` для представлення діапазону рядків бази даних, які потрібно обробити.

У завданні ви виконували команду для збирання виводу з Podʼів, отримуючи їхні логи. У реальному випадку використання кожен Pod для Job записує свій вивід у надійне сховище перед завершенням. Ви можете використовувати PersistentVolume для кожного Job або зовнішню службу зберігання даних. Наприклад, якщо ви рендерите кадри для відео, використовуйте HTTP `PUT` щоб включити дані обробленого кадру до URL, використовуючи різні URL для кожного кадру.

## Мітки на Job та Podʼах {#labels-on-jobs-and-pods}

Після створення Job, Kubernetes автоматично додає додаткові {{< glossary_tooltip text="мітки" term_id="label" >}}, які вирізняють Podʼи одного Job від Podʼів іншого Job.

У цьому прикладі кожен Job та його шаблон Pod мають мітку: `jobgroup=jobexample`.

Сам Kubernetes не звертає уваги на мітки з іменем `jobgroup`. Встановлення мітки для всіх Job, які ви створюєте за шаблоном, робить зручним керування всіма цими Jobs одночасно. У [першому прикладі](#create-jobs-based-on-a-template) ви використовували шаблон для створення кількох Job. Шаблон гарантує, що кожен Pod також отримує ту саму мітку, тому ви можете перевірити всі Podʼи для цих шаблонних Job за допомогою однієї команди.

{{< note >}}
Ключ мітки `jobgroup` не є особливим чи зарезервованим. Ви можете обрати свою власну схему міток. Існують [рекомендовані мітки](/docs/concepts/overview/working-with-objects/common-labels/#labels), які ви можете використовувати, якщо бажаєте.
{{< /note >}}

## Альтернативи {#alternatives}

Якщо ви плануєте створити велику кількість обʼєктів Job, ви можете виявити, що:

- Навіть використовуючи мітки, керування такою кількістю Job є громіздким.
- Якщо ви створюєте багато Job одночасно, ви можете створити високе навантаження на панель управління Kubernetes. Крім того, сервер API Kubernetes може обмежити швидкість запитів, тимчасово відхиляючи ваші запити зі статусом 429.
- Ви обмежені {{< glossary_tooltip text="квотою ресурсів" term_id="resource-quota" >}} на Job: сервер API постійно відхиляє деякі ваші запити, коли ви створюєте велику кількість роботи за один раз.

Існують інші [шаблони роботи з Job](/docs/concepts/workloads/controllers/job/#job-patterns), які ви можете використовувати для обробки значного обсягу роботи без створення великої кількості обʼєктів Job.

Ви також можете розглянути можливість написання власного [контролера](/docs/concepts/architecture/controller/), щоб автоматично керувати обʼєктами Job.
