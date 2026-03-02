---
title: "Приклад: Розгортання WordPress та MySQL з постійними томами"
content_type: tutorial
weight: 20
card:
  name: tutorials
  weight: 40
  title: "Приклад Stateful: WordPress з Постійними Томами"
---

<!-- overview -->

У цьому посібнику ви дізнаєтеся, як розгорнути сайт WordPress та базу даних MySQL за допомогою Minikube. Обидва застосунки використовують PersistentVolumes та PersistentVolumeClaims для зберігання даних.

Постійні томи ([PersistentVolume](/docs/concepts/storage/persistent-volumes/) (PV)) — це частина системи зберігання в кластері, яку адміністратор вручну надав або яку Kubernetes автоматично надав за допомогою [StorageClass](/docs/concepts/storage/storage-classes). Запити на постійні томи ([PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC)) — це запит на зберігання, який користувач може отримати через PV. PersistentVolumes та PersistentVolumeClaims незалежні від життєвого циклу Podʼів і зберігають дані під час перезапуску, перепланування та навіть видалення Podʼів.

{{< warning >}}
Це розгортання не підходить для використання в операційній діяльності, оскільки використовує Podʼи з одним екземпляром WordPress та MySQL. Розгляньте використання [WordPress Helm Chart](https://github.com/bitnami/charts/tree/master/bitnami/wordpress), щоб розгорнути WordPress для промислової експлуатації.
{{< /warning >}}

{{< note >}}
Файли, наведені в цьому посібнику, використовують API-інтерфейси Deployment GA та є специфічними для версії Kubernetes 1.9 і пізніших. Якщо ви хочете скористатися цим посібником з ранньою версією Kubernetes, оновіть, будь ласка, відповідно версію API або звертайтеся до раніших версій цього посібника.
{{< /note >}}

## {{% heading "objectives" %}}

* Створення PersistentVolumeClaims and PersistentVolumes
* Створення `kustomization.yaml` з
  * генератором Secret
  * конфігураціями ресурсів MySQL
  * конфігураціями ресурсів WordPress
* Застосування теки kustomization за допомогою `kubectl apply -k ./`
* Очищення

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Наведений на цій сторінці приклад працює з `kubectl` версії 1.27 і вище.

Завантажте наступні конфігураційні файли:

1. [mysql-deployment.yaml](/examples/application/wordpress/mysql-deployment.yaml)

1. [wordpress-deployment.yaml](/examples/application/wordpress/wordpress-deployment.yaml)

<!-- lessoncontent -->

## Створення запитів на постійні томи та постійних томів {#create-persistentvolumeclaims-and-persistentvolumes}

Для зберігання даних MySQL та Wordpress кожному потрібен постійний том (PersistentVolume). Їх запити на постійні томи (PersistentVolumeClaim) будуть створені на етапі розгортання.

У багатьох середовищах кластера встановлено типовий StorageClass. Якщо StorageClass не вказано у запиті на постійний том (PersistentVolumeClaim), то використовується типовий StorageClass кластера.

Коли створюється запит на постійний том (PersistentVolumeClaim), постійний том (PersistentVolume) динамічно надається на основі конфігурації StorageClass.

{{< warning >}}
У локальних кластерах типовий StorageClass використовує провізор `hostPath`. Томи `hostPath` підходять лише для розробки та тестування. З томами `hostPath`, ваші дані зберігаються в `/tmp` на вузлі, на який заплановано Pod, і не переміщуються між вузлами. Якщо Pod перестає існувати та переплановується на інший вузол в кластері або вузол перезавантажується, дані втрачаються.
{{< /warning >}}

{{< note >}}
Якщо ви запускаєте кластер, який потребує використання провізора `hostPath`, прапорець `--enable-hostpath-provisioner` повинен бути встановлений в компоненті `controller-manager`.
{{< /note >}}

{{< note >}}
Якщо у вас є кластер Kubernetes, що працює на Google Kubernetes Engine, будь ласка, дотримуйтесь рекомендацій [цього посібника](https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk).
{{< /note >}}

## Створення файлу kustomization.yaml {#create-a-kustomization-yaml}

### Додавання генератора Secret {#add-a-secret-generator}

[Secret](/docs/concepts/configuration/secret/) — це обʼєкт, який зберігає чутливі дані, такі як паролі або ключі. Починаючи з версії 1.14, `kubectl` підтримує керування обʼєктами Kubernetes за допомогою файлу kustomization. Ви можете створити Secret за допомогою генераторів у файлі `kustomization.yaml`.

Додайте генератор Secret у файл `kustomization.yaml` за допомогою наступної команди. Вам потрібно буде замінити `YOUR_PASSWORD` на пароль, який ви хочете використовувати.

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: mysql-pass
  literals:
  - password=YOUR_PASSWORD
EOF
```

## Додавання конфігурації ресурсів для MySQL та WordPress {#add-resource-configurations-for-mysql-and-wordpress}

Наступний маніфест описує Deployment одного екземпляра MySQL. Контейнер MySQL монтує PersistentVolume у `/var/lib/mysql`. Змінна оточення `MYSQL_ROOT_PASSWORD` встановлює пароль бази даних з Secret.

{{% code_sample file="application/wordpress/mysql-deployment.yaml" %}}

Наступний маніфест описує Deployment одного екземпляра WordPress. Контейнер WordPress монтує PersistentVolume у `/var/www/html` для файлів даних вебсайту. Змінна оточення `WORDPRESS_DB_HOST` встановлює імʼя служби MySQL, визначеної вище, і WordPress буде звертатися до бази даних через службу. Змінна оточення `WORDPRESS_DB_PASSWORD` встановлює пароль бази даних згенерованого kustomize Secret.

{{% code_sample file="application/wordpress/wordpress-deployment.yaml" %}}

1. Завантажте файл конфігурації розгортання MySQL.

   ```shell
   curl -LO https://k8s.io/examples/application/wordpress/mysql-deployment.yaml
   ```

2. Завантажте файл конфігурації розгортання WordPress.

   ```shell
   curl -LO https://k8s.io/examples/application/wordpress/wordpress-deployment.yaml
   ```

3. Додайте їх до файлу `kustomization.yaml`.

   ```shell
   cat <<EOF >>./kustomization.yaml
   resources:
     - mysql-deployment.yaml
     - wordpress-deployment.yaml
   EOF
   ```

## Застосування та перевірка {#apply-and-verify}

Файл `kustomization.yaml` містить всі ресурси для розгортання сайту WordPress та бази даних MySQL. Ви можете застосувати цю теку командою

```shell
kubectl apply -k ./
```

Тепер перевірте, що всі обʼєкти існують.

1. Перевірте, що Secret існує, виконавши наступну команду:

   ```shell
   kubectl get secrets
   ```

   Відповідь має бути подібною до цієї:

   ```none
   NAME                    TYPE                                  DATA   AGE
   mysql-pass-c57bb4t7mf   Opaque                                1      9s
   ```

2. Перевірте, що PersistentVolume був динамічно наданий.

   ```shell
   kubectl get pvc
   ```

   {{< note >}}
   Процес надання PV може зайняти кілька хвилин.
   {{< /note >}}

   Відповідь має бути подібною до цієї:

   ```none
   NAME             STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS       AGE
   mysql-pv-claim   Bound     pvc-8cbd7b2e-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   wp-pv-claim      Bound     pvc-8cd0df54-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   ```

3. Перевірте, що Pod працює, виконавши наступну команду:

   ```shell
   kubectl get pods
   ```

   {{< note >}}
   Статус Pod може бути `RUNNING` через кілька хвилин.
   {{< /note >}}

   Відповідь має бути подібною до цієї:

   ```none
   NAME                               READY     STATUS    RESTARTS   AGE
   wordpress-mysql-1894417608-x5dzt   1/1       Running   0          40s
   ```

4. Перевірте, що Service працює, виконавши наступну команду:

   ```shell
   kubectl get services wordpress
   ```

   Відповідь має бути подібною до цієї:

   ```none
   NAME        TYPE            CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
   wordpress   LoadBalancer    10.0.0.89    <pending>     80:32406/TCP   4m
   ```

   {{< note >}}
   Minikube може використовувати лише `NodePort` для викладання служб. Зовнішня IP-адреса завжди знаходиться в стані очікування.
   {{< /note >}}

5. Виконайте наступну команду, щоб отримати IP-адресу для Service WordPress:

   ```shell
   minikube service wordpress --url
   ```

   Відповідь має бути подібною до цієї:

   ```none
   http://1.2.3.4:32406
   ```

6. Скопіюйте IP-адресу та завантажте сторінку у своєму оглядачі, щоб переглянути ваш сайт.

   Ви повинні побачити сторінку налаштування WordPress, схожу на знімок екрана нижче.

   ![wordpress-init](https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/WordPress.png)

   {{< warning >}}
   Не залишайте вашу установку WordPress на цій сторінці. Якщо інший користувач знайде її, вони можуть налаштувати вебсайт на вашому екземплярі та використовувати його для обслуговування шкідливого вмісту.<br/><br/>
   Або встановіть WordPress, створивши імʼя користувача та пароль, або видаліть свій екземпляр.
   {{< /warning >}}

## {{% heading "cleanup" %}}

1. Виконайте наступну команду, щоб видалити ваш Secret, Deployments, Services та PersistentVolumeClaims:

   ```shell
   kubectl delete -k ./
   ```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [Інтроспекцію та Налагодження](/docs/tasks/debug/debug-application/debug-running-pod/)
* Дізнайтеся більше про [Job](/docs/concepts/workloads/controllers/job/)
* Дізнайтеся більше про [Переадресацію портів](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Дізнайтеся, як [Отримати доступ до оболонки командного рядка в контейнері](/docs/tasks/debug/debug-application/get-shell-running-container/)
