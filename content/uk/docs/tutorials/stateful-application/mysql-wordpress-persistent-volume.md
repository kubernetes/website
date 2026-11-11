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

[PersistentVolume](/docs/concepts/storage/persistent-volumes/) (PV) — це частина сховища в кластері, яку вручну надав адміністратор або динамічно надав Kubernetes за допомогою [StorageClass](/docs/concepts/storage/storage-classes). [PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC) — це запит користувача на сховище, який може бути задоволений за допомогою PV. PersistentVolume і PersistentVolumeClaim не залежать від життєвого циклу Podʼів і зберігають дані під час перезапуску, перепланування та навіть видалення Podʼів.

{{< alert color="danger" title="Увага" >}}
Це розгортання не підходить для промислового використання, оскільки використовує одноекземплярні Podʼи WordPress і MySQL. Для розгортання WordPress у промисловому середовищі розгляньте використання [WordPress Helm Chart](https://github.com/bitnami/charts/tree/master/bitnami/wordpress).
{{< /alert >}}

{{< alert color="info" title="Примітка" >}}
Файли, наведені в цьому посібнику, використовують GA API Deployment і призначені для Kubernetes версії 1.9 і новіших. Якщо ви хочете скористатися цим посібником з ранішою версією Kubernetes, відповідно оновіть версію API або зверніться до попередніх версій цього посібника.
{{< /alert >}}

## {{% heading "objectives" %}} {#objectives}

* Створення PersistentVolumeClaim і PersistentVolume
* Створення `kustomization.yaml` з
  * генератором Secret
  * конфігураціями ресурсів MySQL
  * конфігураціями ресурсів WordPress
* Застосування теки kustomization за допомогою `kubectl apply -k ./`
* Очищення

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Наведений на цій сторінці приклад працює з `kubectl` версії 1.27 і вище.

Завантажте такі файли конфігурації:

1. [mysql-deployment.yaml](/examples/application/wordpress/mysql-deployment.yaml)

1. [wordpress-deployment.yaml](/examples/application/wordpress/wordpress-deployment.yaml)

<!-- lessoncontent -->

## Створення PersistentVolumeClaim і PersistentVolume {#create-persistentvolumeclaims-and-persistentvolumes}

Кожному з MySQL і Wordpress потрібен PersistentVolume для зберігання даних. Їхні PersistentVolumeClaim буде створено на етапі розгортання.

У багатьох кластерних середовищах встановлено стандартний StorageClass. Якщо StorageClass не вказано в PersistentVolumeClaim, натомість використовується стандартний StorageClass кластера.

Коли створюється PersistentVolumeClaim, PersistentVolume динамічно надається на основі конфігурації StorageClass.

{{< alert color="danger" title="Увага" >}}
У локальних кластерах стандартний StorageClass використовує provisioner `hostPath`. Томи `hostPath` підходять лише для розробки та тестування. З томами `hostPath` ваші дані зберігаються в `/tmp` на вузлі, на який заплановано Pod, і не переміщуються між вузлами. Якщо Pod припиняє існування й переплановується на інший вузол кластера або вузол перезавантажується, дані втрачаються.
{{< /alert >}}

{{< alert color="info" title="Примітка" >}}
Якщо ви запускаєте кластер, якому потрібен provisioner `hostPath`, у компоненті `controller-manager` має бути встановлено прапорець `--enable-hostpath-provisioner`.
{{< /alert >}}

{{< alert color="info" title="Примітка" >}}
Якщо у вас є кластер Kubernetes, що працює в Google Kubernetes Engine, дотримуйтесь [цього посібника](https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk).
{{< /alert >}}

## Створення файлу kustomization.yaml {#create-a-kustomization-yaml}

### Додавання генератора Secret {#add-a-secret-generator}

[Secret](/docs/concepts/configuration/secret/) — це обʼєкт, який зберігає чутливі дані, такі як паролі або ключі. Починаючи з версії 1.14, `kubectl` підтримує керування обʼєктами Kubernetes за допомогою файлу kustomization. Ви можете створити Secret за допомогою генераторів у файлі `kustomization.yaml`.

Додайте генератор Secret у файл `kustomization.yaml` за допомогою цієї команди. Вам потрібно буде замінити `YOUR_PASSWORD` на пароль, який ви хочете використовувати.

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: mysql-pass
  literals:
  - password=YOUR_PASSWORD
EOF
```

## Додавання конфігурацій ресурсів для MySQL і WordPress {#add-resource-configs-for-mysql-and-wordpress}

Наведений нижче маніфест описує одноекземплярний Deployment MySQL. Контейнер MySQL монтує PersistentVolume у `/var/lib/mysql`. Змінна середовища `MYSQL_ROOT_PASSWORD` задає пароль бази даних із Secret.

{{% code_sample file="application/wordpress/mysql-deployment.yaml" %}}

Наведений нижче маніфест описує одноекземплярний Deployment WordPress. Контейнер WordPress монтує PersistentVolume у `/var/www/html` для файлів даних вебсайту. Змінна середовища `WORDPRESS_DB_HOST` задає імʼя Service MySQL, визначеного вище, і WordPress звертатиметься до бази даних через цей Service. Змінна середовища `WORDPRESS_DB_PASSWORD` задає пароль бази даних із Secret, згенерованого kustomize.

{{% code_sample file="application/wordpress/wordpress-deployment.yaml" %}}

1. Завантажте файл конфігурації Deployment MySQL.

   ```shell
   curl -LO https://k8s.io/examples/application/wordpress/mysql-deployment.yaml
   ```

2. Завантажте файл конфігурації WordPress.

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

Тепер ви можете перевірити, що всі обʼєкти існують.

1. Перевірте, що Secret існує, виконавши цю команду:

   ```shell
   kubectl get secrets
   ```

   Відповідь має бути подібною до цієї:

   ```
   NAME                    TYPE                                  DATA   AGE
   mysql-pass-c57bb4t7mf   Opaque                                1      9s
   ```

2. Перевірте, що PersistentVolume було динамічно надано.

   ```shell
   kubectl get pvc
   ```

   {{< alert color="info" title="Примітка" >}}
   Надання та привʼязка PV можуть тривати кілька хвилин.
   {{< /alert >}}

   Відповідь має бути подібною до цієї:

   ```
   NAME             STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS       AGE
   mysql-pv-claim   Bound     pvc-8cbd7b2e-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   wp-pv-claim      Bound     pvc-8cd0df54-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   ```

3. Перевірте, що Pod працює, виконавши цю команду:

   ```shell
   kubectl get pods
   ```

   {{< alert color="info" title="Примітка" >}}
   Може минути кілька хвилин, перш ніж статус Podʼа стане `RUNNING`.
   {{< /alert >}}

   Відповідь має бути подібною до цієї:

   ```
   NAME                               READY     STATUS    RESTARTS   AGE
   wordpress-mysql-1894417608-x5dzt   1/1       Running   0          40s
   ```

4. Перевірте, що Service працює, виконавши цю команду:

   ```shell
   kubectl get services wordpress
   ```

   Відповідь має бути подібною до цієї:

   ```
   NAME        TYPE            CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
   wordpress   LoadBalancer    10.0.0.89    <pending>     80:32406/TCP   4m
   ```

   {{< alert color="info" title="Примітка" >}}
   Minikube може відкривати доступ до Service лише через `NodePort`. EXTERNAL-IP завжди перебуває в стані pending.
   {{< /alert >}}

5. Виконайте цю команду, щоб отримати IP-адресу Service WordPress:

   ```shell
   minikube service wordpress --url
   ```

   Відповідь має бути подібною до цієї:

   ```
   http://1.2.3.4:32406
   ```

6. Скопіюйте IP-адресу та відкрийте сторінку в браузері, щоб переглянути свій сайт.

   Ви повинні побачити сторінку налаштування WordPress, схожу на знімок екрана нижче.

   ![wordpress-init](/images/docs/tutorials/mysql-wordpress-persistent-volume/WordPress.png)

   {{< alert color="danger" title="Увага" >}}
   Не залишайте встановлення WordPress на цій сторінці. Якщо інший користувач її знайде, він може налаштувати вебсайт на вашому екземплярі й використовувати його для поширення шкідливого вмісту.<br/><br/> Або встановіть WordPress, створивши імʼя користувача та пароль, або видаліть свій екземпляр.
   {{< /alert >}}

## {{% heading "cleanup" %}} {#cleaning-up}

1. Виконайте цю команду, щоб видалити ваш Secret, Deployment, Service і PersistentVolumeClaim:

   ```shell
   kubectl delete -k ./
   ```

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [Налагодження запущених Podʼів](/docs/tasks/debug/debug-application/debug-running-pod/)
* Дізнайтеся більше про [Job](/docs/concepts/workloads/controllers/job/)
* Дізнайтеся більше про [Використання перенаправлення портів для доступу до застосунків у кластері](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Дізнайтеся, як [отримати доступ до оболонки запущеного контейнера](/docs/tasks/debug/debug-application/get-shell-running-container/)
