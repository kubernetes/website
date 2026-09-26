---
title: Розгортання релізу за допомогою канаркового розгортання
content_type: tutorial
weight: 10
card:
  name: tutorials
  weight: 60
  title: "Розгортання канаркового релізу"
---

<!-- overview -->

Цей навчальний посібник проведе вас через розгортання канаркового релізу в Kubernetes. Канаркове розгортання дозволяє безпечно протестувати нову версію застосунку з невеликою часткою промислового трафіку, перш ніж повністю впровадити її. Такий підхід допомагає мінімізувати ризики та забезпечує швидкий зворотний звʼязок від реальних користувачів.

Огляд канаркових розгортань дивіться у розділі [Канаркові розгортання](/docs/concepts/workloads/management/#canary-deployments) концептуальної сторінки "Керування робочими навантаженнями".

## {{% heading "objectives" %}} {#objectives}

* Розгорнути стабільну версію застосунку
* Розгорнути канаркову версію поряд зі стабільною
* Направляти трафік до обох версій за допомогою Service
* Відстежувати канаркове розгортання
* Завершити впровадження, масштабувавши канаркове розгортання та видаливши попередню стабільну версію

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- lessoncontent -->

## Розуміння канаркових розгортань {#understanding-canary-deployments}

Канаркове розгортання — це стратегія, за якої ви розгортаєте нову версію вашого застосунку поряд з наявною версією. Нова версія (канарка) отримує невеликий відсоток трафіку, що дозволяє вам:

* Тестувати нову версію з реальним промисловим трафіком
* Відстежувати помилки, проблеми з продуктивністю чи неочікувану поведінку
* Швидко відкотитися назад, якщо виявлено проблеми
* Поступово збільшувати трафік до нової версії, якщо вона добре працює

У цьому навчальному посібнику ви використаєте мітку `track` для розрізнення стабільного та канаркового релізів. Стабільний реліз використовує `track: stable`, а канарковий — `track: canary`. Обидва розгортання мають спільні мітки (`app.kubernetes.io/name: rollout-demo`), які дозволяють Service направляти трафік до обох наборів Podʼів.

Ви розгорнете стабільну версію з 3 репліками та канаркову версію з 1 реплікою. Оскільки обидві версії використовують спільний селектор Service (`app.kubernetes.io/name: rollout-demo`), Kubernetes буде балансувати навантаження між усіма 4 Podʼами. За такого співвідношення приблизно 25% трафіку йде до канарки та 75% — до стабільної версії.

## Розгортання стабільної версії {#deploying-the-stable-version}

Спочатку розгорніть стабільну версію вашого застосунку:

{{% code_sample file="application/canary/app-v1-deployment.yaml" %}}

Застосуйте стабільний Deployment:

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-v1-deployment.yaml
```

Перевірте, що Deployment створено та Podʼи працюють:

```shell
kubectl get deployments -l app.kubernetes.io/name=rollout-demo
```

Вивід буде схожий на цей:

```none
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
rollout-demo-stable    3/3     3            3           10s
```

Перевірте Podʼи:

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo
```

Вивід буде схожий на цей:

```none
NAME                                  READY   STATUS    RESTARTS   AGE
rollout-demo-stable-7d4b9b8c5d-abc12   1/1     Running   0          15s
rollout-demo-stable-7d4b9b8c5d-def34   1/1     Running   0          15s
rollout-demo-stable-7d4b9b8c5d-ghi56   1/1     Running   0          15s
```

## Створення service {#creating-a-service}

Створіть Service, щоб відкрити доступ до вашого застосунку. Селектор Service використовує спільну мітку (`app.kubernetes.io/name: rollout-demo`) та оминає мітку `track`, що дозволяє йому направляти трафік і до стабільних, і до канаркових Podʼів:

{{% code_sample file="application/canary/app-service.yaml" %}}

Застосуйте Service:

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-service.yaml
```

Перевірте, що Service створено:

```shell
kubectl get service rollout-demo-service
```

Вивід буде схожий на цей:

```none
NAME                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
rollout-demo-service   ClusterIP   10.96.123.45    <none>        80/TCP    5s
```

Протестуйте Service, створивши тимчасовий Pod та виконавши запит:

```shell
kubectl run curl-test --image=curlimages/curl:latest --rm -it --restart=Never -- curl http://rollout-demo-service
```

Ви повинні побачити відповіді від стабільних Podʼів. Виконайте цю команду кілька разів, щоб побачити різні імена хостів Podʼів, але всі відповіді мають показувати версію v1.

На цьому етапі ваш застосунок перебуває у стабільному стані. У реальному сценарії ви зазвичай зупинилися б тут і експлуатували стабільну версію до появи нової версії для розгортання. Наступні кроки демонструють, як впровадити канаркову версію.

## Розгортання канаркової версії {#deploying-the-canary-version}

Щоб створити канарковий Deployment, ви можете скопіювати маніфест стабільного Deployment та внести кілька змін:

* Змінити `metadata.name` (наприклад, на `rollout-demo-canary`)
* Змінити мітку `track` з `stable` на `canary` в обох `metadata.labels` та `spec.selector.matchLabels`/`spec.template.metadata.labels`
* Встановити меншу кількість реплік (наприклад, 1)
* Оновити образ контейнера до нової версії

Оновлений маніфест має виглядати так:

{{% code_sample file="application/canary/app-v2-deployment.yaml" %}}

Ви можете використовувати `kubectl`, щоб застосувати ваш локальний маніфест, або, якщо бажаєте, можете використати цей готовий приклад:

```shell
kubectl apply -f https://k8s.io/examples/application/canary/app-v2-deployment.yaml
```

Перевірте, що обидва Deployment працюють:

```shell
kubectl get deployments -l app.kubernetes.io/name=rollout-demo
```

Вивід буде схожий на цей:

```none
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
rollout-demo-stable    3/3     3            3           2m
rollout-demo-canary    1/1     1            1           10s
```

Перевірте всі Podʼи:

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo -o wide
```

Вивід буде схожий на цей:

```none
NAME                                  READY   STATUS    RESTARTS   AGE   IP           NODE
rollout-demo-stable-7d4b9b8c5d-abc12   1/1     Running   0          2m    10.244.1.5   node1
rollout-demo-stable-7d4b9b8c5d-def34   1/1     Running   0          2m    10.244.1.6   node1
rollout-demo-stable-7d4b9b8c5d-ghi56   1/1     Running   0          2m    10.244.2.7   node2
rollout-demo-canary-8e5c0d9f6a-xyz78   1/1     Running   0          15s   10.244.2.8   node2
```

Зверніть увагу, що тепер у вас 4 Podʼи загалом: 3 стабільні Podʼи та 1 канарковий Pod.

## Тестування розподілу трафіку {#testing-traffic-distribution}

Оскільки обидва Deployment використовують однаковий селектор Service (`app.kubernetes.io/name: rollout-demo`), Service направляє трафік до всіх Podʼів. З 3 стабільними Podʼами та 1 канарковим Podʼом приблизно 25% запитів йде до канарки.

Протестуйте Service кілька разів, щоб побачити розподіл трафіку:

```shell
kubectl run curl-test --image=docker.io/library/curlimages/curl:latest --rm -it --restart=Never -- \
  sh -c 'for i in $(seq 1 10); do curl -s http://rollout-demo-service; echo; done'
```

Ви повинні побачити відповіді і від стабільної, і від канаркової версій. Співвідношення може варіюватися, але ви маєте побачити деякі канаркові відповіді у перемішку зі стабільними.

Перевірте EndpointSlices Service, щоб переконатися, що обидві версії отримують трафік:

```shell
kubectl get endpointslices -l kubernetes.io/service-name=rollout-demo-service
```

Вивід буде схожий на цей (один EndpointSlice на сімейство адрес; стовпець ENDPOINTS за замовчуванням обрізається):

```none
NAME                          ADDRESSTYPE   PORTS   ENDPOINTS                              AGE
rollout-demo-service-abc12    IPv4          8080    10.244.1.5,10.244.1.6,10.244.2.7 + 1 more...   3m
```

Щоб побачити всі адреси точок доступу, використовуйте `-o yaml`.

## Моніторинг канаркового розгортання {#monitoring-the-canary-deployment}

Відстежуйте ваше канаркове розгортання на предмет помилок, проблем з продуктивністю чи неочікуваної поведінки:

Перевірте логи Podʼа канарки:

```shell
kubectl logs -l app.kubernetes.io/name=rollout-demo,track=canary --tail=50
```

Відстежуйте стан Podʼів:

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo -w
```

Натисніть Ctrl+C, щоб зупинити спостереження.

Перевірте використання ресурсів:

```shell
kubectl top pods -l app.kubernetes.io/name=rollout-demo
```

{{< note >}}
Команда `kubectl top` вимагає, щоб у вашому кластері був встановлений [metrics-server](https://github.com/kubernetes-sigs/metrics-server). Якщо він недоступний, ви можете відстежувати за допомогою інших методів, як-от Prometheus або засобів моніторингу хмарного провайдера.
{{< /note >}}

## Регулювання розподілу трафіку {#adjusting-traffic-distribution}

Якщо канарка добре працює, ви можете поступово збільшувати трафік до неї, масштабуючи її вгору:

Масштабуйте канарку до 2 реплік (тепер 40% трафіку):

```shell
kubectl scale deployment/rollout-demo-canary --replicas=2
```

Перевірте, що новий Pod працює:

```shell
kubectl get pods -l app.kubernetes.io/name=rollout-demo
```

Продовжуйте відстеження. Якщо все виглядає добре, ви можете масштабувати канарку далі та зменшити стабільну версію.

## Завершення впровадження {#completing-the-rollout}

Якщо ваш моніторинг натомість виявив проблеми з канаркою, ви б відкотилися назад натомість. Щоб потренуватися на проблемному сценарії, ви можете перейти одразу до розділу [Відкат канаркового розгортання](#rolling-back-a-canary-deployment).

Щоб завершити впровадження за допомогою одного Deployment, спочатку збільшіть стабільний Deployment, щоб не втратити пропускну здатність, якщо новому образу не вдасться завантажитися. Потім оновіть образ та змінну середовища `VERSION` відповідно до нової версії, зачекайте завершення впровадження та видаліть канарковий Deployment:

```shell
kubectl scale deployment/rollout-demo-stable --replicas=3

# Поза цим навчальним посібником ви б не встановлювали
# змінну середовища $VERSION.
# Однак ваш новий код застосунку може потребувати
# інших змін конфігурації після оновлення.
kubectl set image deployment/rollout-demo-stable rollout-demo=gcr.io/google-samples/hello-app:2.0
kubectl set env deployment/rollout-demo-stable VERSION=v2

# Зачекайте завершення впровадження
kubectl rollout status deployment/rollout-demo-stable

kubectl delete deployment rollout-demo-canary
```

Оскільки це вдалося, тепер ви готові перейти до розділу [очищення](#cleaning-up). Немає потреби слідувати наступному розділу про відкат.

Або ви можете прочитати решту сторінки, перш ніж почати очищення — попереду ще кілька тем.

## Відкат канаркового розгортання {#rolling-back-a-canary-deployment}

Якщо ви виявили проблеми з канарковою версією, ви можете швидко відкотитися назад:

Масштабуйте канарковий Deployment вниз:

```shell
kubectl scale deployment/rollout-demo-canary --replicas=0
```

Масштабування до нуля зберігає канарковий Deployment, щоб ви могли переглянути його конфігурацію, поки проводите розслідування. Після завершення видаліть його командою `kubectl delete deployment rollout-demo-canary`.

За потреби збільште стабільну версію назад:

```shell
kubectl scale deployment/rollout-demo-stable --replicas=3
```

Розслідуйте проблеми з канаркою, перш ніж робити чергову спробу канаркового розгортання.

## Розподіл трафіку за допомогою HTTPRoute (опціонально) {#splitting-traffic-using-httproute-optional}

Якщо ви використовуєте [Gateway API](https://gateway-api.sigs.k8s.io/), ви можете застосувати HTTPRoute для точнішого контролю над розподілом трафіку між стабільною та канарковою версіями. Такий підхід дозволяє вказувати точні відсотки розподілу трафіку, а не покладатися на кількість реплік.

Спочатку створіть окремі Services для стабільної та канаркової версій. Цей підхід також корисний для налагодження, навіть якщо ви не використовуєте Gateway API. Маючи окремі Services, ви можете напряму тестувати або відстежувати кожну версію незалежно.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: rollout-demo-stable-service
spec:
  selector:
    app.kubernetes.io/name: rollout-demo
    track: stable
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: rollout-demo-canary-service
spec:
  selector:
    app.kubernetes.io/name: rollout-demo
    track: canary
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```

Потім створіть HTTPRoute, який розподіляє трафік між двома Services:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rollout-demo-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "rollout-demo.example.com"
  rules:
  - backendRefs:
    - name: rollout-demo-stable-service
      port: 80
      weight: 90
    - name: rollout-demo-canary-service
      port: 80
      weight: 10
```

Ця конфігурація направляє 90% трафіку до стабільного Service та 10% до канаркового Service, незалежно від кількості реплік.

Ви також можете використовувати маршрутизацію на основі заголовків, щоб надсилати конкретний трафік до канарки:

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: rollout-demo-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - "rollout-demo.example.com"
  rules:
  # Правило 1: Направляти трафік із заголовком canary до канаркового service
  - matches:
    - headers:
      - type: Exact
        name: env
        value: canary
    backendRefs:
    - name: rollout-demo-canary-service
      port: 80
  # Правило 2: Розподіляти решту трафіку у співвідношенні 90/10
  - backendRefs:
    - name: rollout-demo-stable-service
      port: 80
      weight: 90
    - name: rollout-demo-canary-service
      port: 80
      weight: 10
```

Ця конфігурація надсилає весь трафік із заголовком `env: canary` до канаркового Service, а решта трафіку розподіляється у співвідношенні 90/10 між стабільною та канарковою версіями.

{{< note >}}
Gateway API вимагає встановлення контролера Gateway у вашому кластері. Інструкції зі встановлення та підтримувані реалізації дивіться у [документації Gateway API](https://gateway-api.sigs.k8s.io/).
{{< /note >}}

## Автоматизація канаркових впроваджень {#automating-canary-rollouts}

У промислових середовищах канарковими впровадженнями зазвичай керують контролери або CI/CD-системи, які автоматизують перемикання трафіку, моніторинг та просування чи відкат. Такі інструменти, як Flux, Argo Rollouts, GitLab та багато інших, можуть взяти на себе прогресивне постачання, аналіз та відкат за вас. Це зменшує кількість ручних кроків і допомагає забезпечити безпечні, повторювані розгортання. Додаткову інформацію дивіться у документації вибраного вами інструмента розгортання або контролера.

## {{% heading "cleanup" %}} {#cleaning-up}

Видаліть ресурси, створені в цьому навчальному посібнику:

```shell
kubectl delete deployment rollout-demo-stable rollout-demo-canary
kubectl delete service rollout-demo-service
```

Якщо ви створили окремі Services для HTTPRoute, видаліть і їх:

```shell
kubectl delete service rollout-demo-stable-service rollout-demo-canary-service
kubectl delete httproute rollout-demo-route
```

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся більше про [канаркові розгортання](/docs/concepts/workloads/management/#canary-deployments) на концептуальній сторінці "Керування робочими навантаженнями".
* Прочитайте про [Deployments](/docs/concepts/workloads/controllers/deployment/) та про те, як вони керують життєвим циклом вашого застосунку.
* Прочитайте про [Services](/docs/concepts/services-networking/service/) та про те, як вони забезпечують виявлення сервісів і балансування навантаження.
* Вивчіть [Gateway API](/docs/concepts/services-networking/gateway/) для розширених можливостей керування трафіком.
* Розгляньте використання [Горизонтального автомасштабування Podʼів](/docs/tasks/run-application/horizontal-pod-autoscale/) для автоматичного регулювання кількості реплік на основі метрик.
