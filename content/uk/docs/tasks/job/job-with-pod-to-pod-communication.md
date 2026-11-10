---
title: Job із взаємодією між Podʼами
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
---

<!-- overview -->

У цьому прикладі ви запустите Job у [режимі завершення Indexed](/blog/2021/04/19/introducing-indexed-jobs/), налаштований так, щоб Podʼи, створені Job, могли взаємодіяти між собою за іменами хостів Podʼів, а не за IP-адресами Podʼів.

Podʼам у межах Job може знадобитися взаємодіяти між собою. Робоче навантаження користувача в кожному Podʼі могло б запитувати API-сервер Kubernetes, щоб дізнатися IP-адреси інших Podʼів, але набагато простіше покладатися на вбудоване в Kubernetes розвʼязання DNS.

Jobs у режимі завершення Indexed автоматично задають імена хостів Podʼів у форматі `${jobName}-${completionIndex}`. Цей формат дозволяє детерміновано будувати імена хостів Podʼів і забезпечувати взаємодію між Podʼами *без* потреби створювати клієнтське зʼєднання з панеллю управління Kubernetes для отримання імен хостів або IP-адрес Podʼів через запити API.

Ця конфігурація корисна для сценаріїв, де потрібна мережева взаємодія Podʼів, але ви не хочете залежати від мережевого зʼєднання з API-сервером Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

Ви вже маєте знати основи використання [Job](/docs/concepts/workloads/controllers/job/).

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
Якщо ви використовуєте minikube або подібний інструмент, може знадобитися виконати [додаткові кроки](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/), щоб забезпечити наявність DNS.
{{< /note >}}

<!-- steps -->

## Запуск Job із взаємодією між Podʼами {#starting-a-job-with-pod-to-pod-communication}

Щоб увімкнути взаємодію між Podʼами за іменами хостів Podʼів у Job, потрібно зробити таке:

1. Налаштуйте [headless Service](/docs/concepts/services-networking/service/#headless-services) із дійсним селектором міток для Podʼів, створених вашим Job. Headless Service має бути в тому самому просторі імен, що й Job. Простий спосіб зробити це — використати селектор `job-name: <your-job-name>`, оскільки Kubernetes автоматично додає мітку `job-name`. Ця конфігурація спонукає систему DNS створити записи імен хостів Podʼів, що виконують ваш Job.

1. Налаштуйте headless Service як сервіс піддомену для Podʼів Job, додавши таке значення до специфікації шаблону Job:

   ```yaml
   subdomain: <headless-svc-name>
   ```

### Приклад {#example}

Нижче наведено робочий приклад Job з увімкненою взаємодією між Podʼами за іменами хостів Podʼів. Job завершується лише після того, як усі Podʼи успішно пропінгують один одного за іменами хостів.

{{< note >}}
У скрипті Bash, який виконується в кожному Podʼі у наведеному нижче прикладі, імена хостів Podʼів можуть також мати префікс простору імен, якщо Pod має бути доступний ззовні простору імен.
{{< /note >}}

```yaml
apiVersion: v1
kind: Service
metadata:
  name: headless-svc
spec:
  clusterIP: None # clusterIP має бути None для створення headless Service
  selector:
    job-name: example-job # має відповідати назві Job
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
      subdomain: headless-svc # має відповідати назві Service
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

Після застосування наведеного вище прикладу Podʼи зможуть звертатися один до одного через мережу за допомогою `<pod-hostname>.<headless-service-name>`. Ви маєте побачити вивід, подібний до такого:

```shell
kubectl logs example-job-0-qws42
```

```
Failed to ping pod example-job-0.headless-svc, retrying in 1 second...
Successfully pinged pod: example-job-0.headless-svc
Successfully pinged pod: example-job-1.headless-svc
Successfully pinged pod: example-job-2.headless-svc
```

{{< note >}}
Майте на увазі, що формат назви `<pod-hostname>.<headless-service-name>`, використаний у цьому прикладі, не працюватиме з політикою DNS `None` або `Default`. Дивіться [Політику DNS Podʼа](/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy).
{{< /note >}}
