---
title: Паралельна обробка з розгортанням шаблону
content_type: task
min-kubernetes-server-version: v1.8
weight: 50
---

<!-- overview -->

Це завдання демонструє запуск кількох {{< glossary_tooltip text="Jobs" term_id="job" >}} на основі спільного шаблону. Цей підхід можна використовувати для паралельної обробки пакетів роботи.

У цьому прикладі є лише три елементи: _apple_, _banana_ та _cherry_. Приклади Jobs обробляють кожен елемент, виводячи рядок, а потім роблячи паузу.

Дивіться [використання Jobs у реальних робочих навантаженнях](#using-jobs-in-real-workloads), щоб дізнатися, як цей шаблон підходить для реалістичніших сценаріїв.

## {{% heading "prerequisites" %}} {#before-you-begin}

Ви маєте знати базове, непаралельне використання [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}}

Для базового шаблонування вам потрібна утиліта командного рядка `sed`.

Для виконання прикладу з розширеним шаблонуванням потрібен робочий [Python](https://www.python.org/) і бібліотека шаблонів Jinja2 для Python.

Після налаштування Python ви можете встановити Jinja2, виконавши:

```shell
pip install --user jinja2
```

<!-- steps -->

## Створення Job на основі шаблону {#create-jobs-based-on-a-template}

Спочатку завантажте наведений нижче шаблон Job у файл `job-tmpl.yaml`. Ось що ви завантажите:

{{% code_sample file="application/job/job-tmpl.yaml" %}}

```shell
# Використайте curl для завантаження job-tmpl.yaml
curl -L -s -O https://k8s.io/examples/application/job/job-tmpl.yaml
```

Завантажений файл ще не є чинним {{< glossary_tooltip text="маніфестом" term_id="manifest" >}} Kubernetes. Натомість цей шаблон є поданням обʼєкта Job у YAML із заповнювачами, які потрібно заповнити перед використанням. Синтаксис `$ITEM` нічого не означає для Kubernetes.

### Створення маніфестів з шаблону {#create-manifests-from-the-template}

Наведений нижче фрагмент оболонки використовує `sed`, щоб замінити рядок `$ITEM` змінною циклу, записуючи результат у тимчасову теку `jobs`. Виконайте його зараз:

```shell
# Розгорніть шаблон у кілька файлів, по одному для кожного елемента, який потрібно обробити.
mkdir ./jobs
for i in apple banana cherry
do
  cat job-tmpl.yaml | sed "s/\$ITEM/$i/" > ./jobs/job-$i.yaml
done
```

Перевірте, чи це спрацювало:

```shell
ls jobs/
```

Вивід подібний до такого:

```
job-apple.yaml
job-banana.yaml
job-cherry.yaml
```

Ви можете використовувати будь-яку мову шаблонів (наприклад, Jinja2 або ERB) або написати програму для генерації маніфестів Job.

### Створення Jobs з маніфестів {#create-jobs-from-the-manifests}

Далі створіть усі Jobs однією командою kubectl:

```shell
kubectl create -f ./jobs
```

Вивід подібний до такого:

```
job.batch/process-item-apple created
job.batch/process-item-banana created
job.batch/process-item-cherry created
```

Тепер перевірте Jobs:

```shell
kubectl get jobs -l jobgroup=jobexample
```

Вивід подібний до такого:

```
NAME                  COMPLETIONS   DURATION   AGE
process-item-apple    1/1           14s        22s
process-item-banana   1/1           12s        21s
process-item-cherry   1/1           12s        20s
```

Параметр `-l` для kubectl вибирає лише Jobs, що належать до цієї групи Jobs (у системі можуть бути інші, не повʼязані Jobs).

Ви також можете перевірити стан Podʼів, використовуючи той самий {{< glossary_tooltip text="селектор міток" term_id="selector" >}}:

```shell
kubectl get pods -l jobgroup=jobexample
```

Вивід подібний до такого:

```
NAME                        READY     STATUS      RESTARTS   AGE
process-item-apple-kixwv    0/1       Completed   0          4m
process-item-banana-wrsf7   0/1       Completed   0          4m
process-item-cherry-dnfu9   0/1       Completed   0          4m
```

Цією однією командою можна переглянути вивід усіх Jobs одразу:

```shell
kubectl logs -f -l jobgroup=jobexample
```

Вивід має бути таким:

```
Processing item apple
Processing item banana
Processing item cherry
```

### Очищення {#cleanup-1}

```shell
# Видаліть створені вами Jobs
# Ваш кластер автоматично очищає їхні Podʼи
kubectl delete job -l jobgroup=jobexample
```

## Використання розширених параметрів шаблону {#use-advanced-template-parameters}

У [першому прикладі](#create-jobs-based-on-a-template) кожен екземпляр шаблону мав один параметр, і цей параметр також використовувався в назві Job. Однак [назви](/docs/concepts/overview/working-with-objects/names/#names) можуть містити лише певні символи.

Цей трохи складніший приклад використовує [мову шаблонів Jinja](https://palletsprojects.com/p/jinja/), щоб згенерувати маніфести, а потім обʼєкти з цих маніфестів, із кількома параметрами для кожного Job.

У цій частині завдання ви використаєте однорядковий скрипт Python, щоб перетворити шаблон на набір маніфестів.

Спочатку скопіюйте й вставте наведений нижче шаблон обʼєкта Job у файл `job.yaml.jinja2`:

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

Наведений вище шаблон визначає два параметри для кожного обʼєкта Job за допомогою списку словників Python (рядки 1-4). Цикл `for` генерує один маніфест Job для кожного набору параметрів (решта рядків).

Цей приклад спирається на можливість YAML. Один файл YAML може містити кілька документів (у цьому випадку маніфестів Kubernetes), розділених рядком `---`. Ви можете передати вивід безпосередньо до `kubectl`, щоб створити Jobs.

Далі використайте цю однорядкову програму Python, щоб розгорнути шаблон:

```shell
alias render_template='python -c "from jinja2 import Template; import sys; print(Template(sys.stdin.read()).render());"'
```

Використайте `render_template`, щоб перетворити параметри й шаблон на один файл YAML із маніфестами Kubernetes:

```shell
# Це потребує визначеного раніше псевдоніма
cat job.yaml.jinja2 | render_template > jobs.yaml
```

Ви можете переглянути `jobs.yaml`, щоб переконатися, що скрипт `render_template` спрацював правильно.

Коли ви переконаєтеся, що `render_template` працює так, як задумано, можна передати його вивід до `kubectl`:

```shell
cat job.yaml.jinja2 | render_template | kubectl apply -f -
```

Kubernetes приймає та запускає створені вами Jobs.

### Очищення {#cleanup-2}

```shell
# Видаліть створені вами Jobs
# Ваш кластер автоматично очищає їхні Podʼи
kubectl delete job -l jobgroup=jobexample
```

<!-- discussion -->

## Використання Jobs у реальних робочих навантаженнях {#using-jobs-in-real-workloads}

У реальному сценарії кожен Job виконує значні обчислення, наприклад рендеринг кадру фільму або обробку діапазону рядків у базі даних. Якщо ви рендерите фільм, `$ITEM` слід задати як номер кадру. Якщо ви обробляєте рядки таблиці бази даних, `$ITEM` має представляти діапазон рядків для обробки.

У цьому завданні ви виконали команду, щоб зібрати вивід Podʼів, отримавши їхні логи. У реальному сценарії кожен Pod Job записує свій вивід у надійне сховище перед завершенням. Можна використовувати PersistentVolume для кожного Job або зовнішній сервіс зберігання. Наприклад, якщо ви рендерите кадри фільму, надсилайте дані готового кадру за допомогою HTTP `PUT` на URL, використовуючи окрему URL-адресу для кожного кадру.

## Мітки на Jobs і Podʼах {#labels-on-jobs-and-pods}

Після створення Job Kubernetes автоматично додає {{< glossary_tooltip text="мітки" term_id="label" >}}, які відрізняють Podʼи одного Job від Podʼів іншого Job.

У цьому прикладі кожен Job та його шаблон Pod мають мітку: `jobgroup=jobexample`.

Сам Kubernetes не звертає уваги на мітки з назвою `jobgroup`. Мітка на всіх Jobs, створених із шаблону, дає змогу зручно працювати з усіма цими Jobs одразу. У [першому прикладі](#create-jobs-based-on-a-template) ви використали шаблон для створення кількох Jobs. Шаблон гарантує, що кожен Pod також отримує ту саму мітку, тож ви можете перевірити всі Podʼи цих Jobs однією командою.

{{< note >}}
Ключ мітки `jobgroup` не є особливим чи зарезервованим. Ви можете обрати власну схему міток. За бажання можна використовувати [рекомендовані мітки](/docs/concepts/overview/working-with-objects/common-labels/#labels).
{{< /note >}}

## Альтернативи {#alternatives}

Якщо ви плануєте створити велику кількість обʼєктів Job, ви можете виявити, що:

- Навіть із мітками керувати такою кількістю Jobs незручно.
- Якщо ви створюєте багато Jobs одним пакетом, це може створити високе навантаження на панель управління Kubernetes. Крім того, API-сервер Kubernetes може обмежити швидкість ваших запитів, тимчасово відхиляючи їх зі статусом 429.
- Ви обмежені {{< glossary_tooltip text="квотою ресурсів" term_id="resource-quota" >}} на Jobs: API-сервер остаточно відхиляє деякі ваші запити, коли ви створюєте багато роботи одним пакетом.

Існують інші [шаблони Job](/docs/concepts/workloads/controllers/job/#job-patterns), які можна використовувати для обробки великих обсягів роботи без створення дуже великої кількості обʼєктів Job.

Ви також можете розглянути можливість написання власного [контролера](/docs/concepts/architecture/controller/), щоб автоматично керувати обʼєктами Job.
