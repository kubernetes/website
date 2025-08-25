---
title: Завдання (Job) з комунікацією Pod-Pod
content_type: task
min-kubernetes-server-version: v1.21
weight: 32
---

<!-- overview -->

У цьому прикладі ви запустите Job в [Indexed completion mode](/blog/2021/04/19/introducing-indexed-jobs/), налаштований таким чином, щоб Podʼи, створені Job, могли комунікувати один з одним, використовуючи назви хостів Podʼів, а не IP-адреси Podʼів.

Podʼи в межах Job можуть потребувати комунікації між собою. Робоче навантаження користувача, що виконується в кожному Podʼі, може звертатися до сервера API Kubernetes для отримання IP-адрес інших Podʼів, але набагато простіше покладатися на вбудований DNS-резолвер Kubernetes.

Job в Indexed completion mode автоматично встановлюють назви хостів Podʼів у форматі
`${jobName}-${completionIndex}`. Ви можете використовувати цей формат для детермінованого створення назв хостів Podʼів та забезпечення комунікації між Podʼами *без* необхідності створювати клієнтське з’єднання з панеллю управління Kubernetes для отримання назв хостів/IP-адрес Podʼів через API-запити.

Ця конфігурація корисна для випадків, коли необхідна мережева взаємодія Podʼів, але ви не хочете залежати від мережевого з’єднання з сервером API Kubernetes.

## {{% heading "prerequisites" %}}

Ви повинні вже бути знайомі з основами використання [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
Якщо ви використовуєте minikube або подібний інструмент, можливо, вам потрібно буде вжити
[додаткових заходів](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/), щоб переконатись, що ви використовуєте DNS.
{{< /note >}}

<!-- steps -->

## Запуск роботи з комунікацією між Podʼами {#starting-a-job-with-pod-to-pod-communication}

Щоб увімкнути комунікацію між Podʼами з використанням назв хостів Podʼів у Job, ви повинні зробити наступне:

1. Налаштуйте [headless Service](/docs/concepts/services-networking/service/#headless-services)
з дійсним селектором міток для Podʼів, створених вашим Job. Headless Service має бути в тому ж просторі імен, що й Job. Один із простих способів зробити це — використати селектор `job-name: <your-job-name>`, оскільки мітка `job-name` буде додана Kubernetes автоматично. Ця конфігурація активує систему DNS для створення записів назв хостів Podʼів, що виконують ваш обʼєкт Job.

1. Налаштуйте headless Service як піддомен для Podʼів Job, включивши наступне значення у ваш шаблон специфікації Job: з дійсним селектором міток для podʼів, створених вашим Job. Headless Service повинен знаходитися в тому ж просторі імен, що і Job. Один з простих способів зробити це — використовувати `job-name: <ваша-назва-job>`, оскільки Kubernetes автоматично додасть мітку `job-name`. Ця конфігурація змусить систему DNS створити записи з іменами вузлів, на яких виконується ваше завдання.

1. Налаштуйте service headless як сервіс субдомену для завдань, включивши наступне значення у специфікацію template Job:

   ```yaml
   subdomain: <headless-svc-name>
   ```

### Приклад {#example}

Нижче наведено робочий приклад Job з увімкненою комунікацією між Podʼами через назви хостів Podʼів. Job завершується лише після того, як усі Podʼи успішно пінгують один одного за допомогою назв хостів.

{{< note >}}
У Bash-скрипті, що виконується на кожному Podʼі у прикладі нижче, назви хостів Podʼів можуть мати префікс простору імен, якщо Pod повинен бути доступний ззовні простору імен.
{{< /note >}}

```yaml

apiVersion: v1
kind: Service
metadata:
  name: headless-svc
spec:
  clusterIP: None # clusterIP має бути None для створення headless service
  selector:
    job-name: example-job # має відповідати імені Job
---
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  completions: 3
  parallelism: 3
  completionMode: Indexed
  template:
    spec:
      subdomain: headless-svc # має відповідати імені Service
      restartPolicy: Never
      containers:
      - name: example-workload
        image: bash:latest
        command:
        - bash
        - -c
        - |
          for i in 0 1 2
          do
            gotStatus="-1"
            wantStatus="0"
            while [ $gotStatus -ne $wantStatus ]
            do
              ping -c 1 example-job-${i}.headless-svc > /dev/null 2>&1
              gotStatus=$?
              if [ $gotStatus -ne $wantStatus ]; then
                echo "Failed to ping pod example-job-${i}.headless-svc, retrying in 1 second..."
                sleep 1
              fi
            done
            echo "Successfully pinged pod: example-job-${i}.headless-svc"
          done
```

Після застосування наведеного вище прикладу, Podʼи зможуть звертатись один до одного в мережі, використовуючи: `<pod-hostname>.<headless-service-name>`. Ви повинні побачити вихідні дані, подібні до наступних:

```shell
kubectl logs example-job-0-qws42
```

```none
Failed to ping pod example-job-0.headless-svc, retrying in 1 second...
Successfully pinged pod: example-job-0.headless-svc
Successfully pinged pod: example-job-1.headless-svc
Successfully pinged pod: example-job-2.headless-svc
```

{{< note >}}
Майте на увазі, що формат імені `<pod-hostname>.<headless-service-name>`, використаний у цьому прикладі, не працюватиме з політикою DNS, встановленою на `None` або `Default`. Ви можете дізнатися більше про [політику DNS для Podʼів](/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy).
{{< /note >}}
