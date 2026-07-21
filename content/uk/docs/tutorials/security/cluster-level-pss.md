---
title: Застосування стандартів безпеки Podʼів на рівні кластера
content_type: tutorial
weight: 10
---

{{% alert title="Примітка" %}}
Цей навчальний посібник застосовується лише для нових кластерів.
{{% /alert %}}

Безпека Pod покладається на контролер допуску, що виконує перевірки відповідно до [Стандартів безпеки Podʼів в Kubernetes](/docs/concepts/security/pod-security-standards/) при створенні нових Podʼів. Це функція, має загальну доступність з випуску v1.25. Цей навчальний посібник показує, як застосувати стандарт безпеки `baseline` на рівні кластера, що застосовує стандартну конфігурацію для всіх просторів імен у кластері.

Для застосування стандартів безпеки Podʼів до певних просторів імен дивіться [Застосування стандартів безпеки Podʼів на рівні простору імен](/docs/tutorials/security/ns-level-pss).

Якщо ви працюєте з версією Kubernetes, відмінною від v{{< skew currentVersion >}}, перевірте документацію для вашої версії.

## {{% heading "prerequisites" %}}

Встановіть на ваш компʼютер наступне:

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)

Цей навчальний посібник показує, як ви можете налаштувати кластер Kubernetes, який ви повністю контролюєте. Якщо ви вивчаєте, як налаштувати Pod Security Admission для кластера, що надається постачальником послуг, де ви не можете налаштувати панель управління, прочитайте [Застосування стандартів безпеки Podʼів на рівні простору імен](/docs/tutorials/security/ns-level-pss).

## Виберіть правильний стандарт безпеки Podʼів {#choose-the-right-pod-security-standard-to-apply}

[Pod Security Admission](/docs/concepts/security/pod-security-admission/) дозволяє застосовувати вбудовані [Стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards/) у режимах: `enforce`, `audit` та `warn`.

Щоб зібрати інформацію, яка допоможе вам вибрати стандарти безпеки Podʼів, які найбільш підходять для вашої конфігурації, виконайте наступне:

1. Створіть кластер, в якому не застосовані стандарти безпеки Podʼів:

   ```shell
   kind create cluster --name psa-wo-cluster-pss
   ```

   Вивід подібний до:

   ```none
   Creating cluster "psa-wo-cluster-pss" ...
   ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼
   ✓ Preparing nodes 📦
   ✓ Writing configuration 📜
   ✓ Starting control-plane 🕹️
   ✓ Installing CNI 🔌
   ✓ Installing StorageClass 💾
   Set kubectl context to "kind-psa-wo-cluster-pss"
   You can now use your cluster with:

   kubectl cluster-info --context kind-psa-wo-cluster-pss

   Thanks for using kind! 😊
   ```

1. Встановіть контекст kubectl для нового кластера:

   ```shell
   kubectl cluster-info --context kind-psa-wo-cluster-pss
   ```

   Вивід подібний до цього:

   ```none
   Kubernetes control plane is running at https://127.0.0.1:61350

   CoreDNS is running at https://127.0.0.1:61350/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

1. Отримайте список просторів імен у кластері:

   ```shell
   kubectl get ns
   ```

   Вивід подібний до цього:

   ```none
   NAME                 STATUS   AGE
   default              Active   9m30s
   kube-node-lease      Active   9m32s
   kube-public          Active   9m32s
   kube-system          Active   9m32s
   local-path-storage   Active   9m26s
   ```

1. Використовуйте `--dry-run=server`, щоб зрозуміти, що відбувається при застосуванні різних стандартів безпеки Podʼів:

   1. Privileged

      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=privileged
      ```

      Вивід подібний до:

      ```none
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      namespace/kube-system labeled
      namespace/local-path-storage labeled
      ```

   2. Baseline

      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=baseline
      ```

      Вивід подібний до:

      ```none
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      Warning: existing pods in namespace "kube-system" violate the new PodSecurity enforce level "baseline:latest"
      Warning: etcd-psa-wo-cluster-pss-control-plane (and 3 other pods): host namespaces, hostPath volumes
      Warning: kindnet-vzj42: non-default capabilities, host namespaces, hostPath volumes
      Warning: kube-proxy-m6hwf: host namespaces, hostPath volumes, privileged
      namespace/kube-system labeled
      namespace/local-path-storage labeled
      ```

   3. Restricted

      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=restricted
      ```

      Вивід подібний до:

      ```none
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      Warning: existing pods in namespace "kube-system" violate the new PodSecurity enforce level "restricted:latest"
      Warning: coredns-7bb9c7b568-hsptc (and 1 other pod): unrestricted capabilities, runAsNonRoot != true, seccompProfile
      Warning: etcd-psa-wo-cluster-pss-control-plane (and 3 other pods): host namespaces, hostPath volumes, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true
      Warning: kindnet-vzj42: non-default capabilities, host namespaces, hostPath volumes, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true, seccompProfile
      Warning: kube-proxy-m6hwf: host namespaces, hostPath volumes, privileged, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true, seccompProfile
      namespace/kube-system labeled
      Warning: existing pods in namespace "local-path-storage" violate the new PodSecurity enforce level "restricted:latest"
      Warning: local-path-provisioner-d6d9f7ffc-lw9lh: allowPrivilegeEscalation != false, unrestricted capabilities, runAsNonRoot != true, seccompProfile
      namespace/local-path-storage labeled
      ```

З попередніх результатів ви можете помітити, що застосування стандарту безпеки `privileged` не показує жодних попереджень для жодного простору імен. Однак для стандартів `baseline` і `restricted` є попередження, зокрема для простору імен `kube-system`.

## Встановлення режимів, версій та стандартів

У цьому розділі ви застосовуєте наступні Стандарти безпеки Pod до версії `latest`:

- Стандарт `baseline` у режимі `enforce`.
- Стандарт `restricted` у режимах `warn` та `audit`.

Стандарт безпеки Pod `baseline` надає зручний проміжний рівень, який дозволяє тримати список винятків коротким та запобігає відомим підвищенням привілеїв.

Додатково, для запобігання витоку підсистеми `kube-system`, ви виключите простір імен з застосуванням Стандартів безпеки Pod.

При впровадженні перевірки безпеки Pod у власному середовищі оберіть такі пункти:

1. Враховуючи рівень ризику, застосований до кластера, строгий Стандарт безпеки Pod, наприклад `restricted`, може бути кращим вибором.
2. Виключення простору імен `kube-system` дозволяє підсистемам працювати з підвищеними привілеями у цьому просторі імен. Для реального використання проєкт Kubernetes наполегливо рекомендує вам застосовувати строгі політики RBAC, які обмежують доступ до `kube-system`, слідуючи принципу найменших привілеїв. Для впровадження вищезазначених стандартів виконайте наступне:

3. Створіть файл конфігурації, який може бути використаний Контролером допуску Стандартів безпеки Pod для застосування цих Стандартів безпеки Pod:

   ```shell
   mkdir -p /tmp/pss
   cat <<EOF > /tmp/pss/cluster-level-pss.yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: AdmissionConfiguration
   plugins:
   - name: PodSecurity
     configuration:
       apiVersion: pod-security.admission.config.k8s.io/v1
       kind: PodSecurityConfiguration
       defaults:
         enforce: "baseline"
         enforce-version: "latest"
         audit: "restricted"
         audit-version: "latest"
         warn: "restricted"
         warn-version: "latest"
       exemptions:
         usernames: []
         runtimeClasses: []
         namespaces: [kube-system]
   EOF
   ```

   {{< alert color="info" title="Примітка" >}}
   Конфігурація `pod-security.admission.config.k8s.io/v1` вимагає v1.25+. Для v1.23 та v1.24 використовуйте [v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/). Для v1.22 використовуйте [v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/).
   {{< /alert >}}

4. Налаштуйте API-сервер для використання цього файлу під час створення кластера:

   ```shell
   cat <<EOF > /tmp/pss/cluster-config.yaml
   kind: Cluster
   apiVersion: kind.x-k8s.io/v1alpha4
   nodes:
   - role: control-plane
     kubeadmConfigPatches:
     - |
       kind: ClusterConfiguration
       apiServer:
           extraArgs:
             admission-control-config-file: /etc/config/cluster-level-pss.yaml
           extraVolumes:
             - name: accf
               hostPath: /etc/config
               mountPath: /etc/config
               readOnly: false
               pathType: "DirectoryOrCreate"
     extraMounts:
     - hostPath: /tmp/pss
       containerPath: /etc/config
       readOnly: false
       selinuxRelabel: false
       propagation: None
   EOF
   ```

   {{< alert color="info" title="Примітка" >}}
   Якщо ви використовуєте Docker Desktop з *kind* на macOS, ви можете додати `/tmp` як спільну теку у меню  **Preferences > Resources > File Sharing**.
   {{< /alert >}}

5. Створіть кластер, який використовує Pod Security Admission для застосування цих Стандартів безпеки Pod:

   ```shell
   kind create cluster --name psa-with-cluster-pss --config /tmp/pss/cluster-config.yaml
   ```

   Вивід буде подібним до цього:

   ```none
   Creating cluster "psa-with-cluster-pss" ...
    ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼
    ✓ Preparing nodes 📦
    ✓ Writing configuration 📜
    ✓ Starting control-plane 🕹️
    ✓ Installing CNI 🔌
    ✓ Installing StorageClass 💾
   Set kubectl context to "kind-psa-with-cluster-pss"
   You can now use your cluster with:

   kubectl cluster-info --context kind-psa-with-cluster-pss

   Have a question, bug, or feature request? Let us know! https://kind.sigs.k8s.io/#community 🙂
   ```

6. Вкажіт kubectl кластер:

   ```shell
   kubectl cluster-info --context kind-psa-with-cluster-pss
   ```

   Вивід буде схожий на цей:

   ```none
   Kubernetes control plane is running at https://127.0.0.1:63855
   CoreDNS is running at https://127.0.0.1:63855/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

7. Створіть Pod у просторі імен default:

    {{% code_sample file="security/example-baseline-pod.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   Pod запускається звичайно, але вивід містить попередження:

   ```none
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

## Очищення {#clean-up}

Тепер ви можете видалити кластери, які ви створили:

```shell
kind delete cluster --name psa-with-cluster-pss
```

```shell
kind delete cluster --name psa-wo-cluster-pss
```

## {{% heading "whatsnext" %}}

- Виконайте
  [скрипт оболонки](/examples/security/kind-with-cluster-level-baseline-pod-security.sh) для виконання всіх попередніх кроків одночасно:
  1. Створіть конфігурацію на рівні кластера на основі Стандартів безпеки Pod.
  2. Створіть файл для того, щоб API-сервер міг використовувати цю конфігурацію.
  3. Створіть кластер, який створює API-сервер з цією конфігурацією.
  4. Встановіть контекст kubectl для цього нового кластера.
  5. Створіть мінімальний файл yaml для Podʼів.
  6. Застосуйте цей файл для створення Podʼів в новому кластері.
- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- [Стандарти безпеки Pod](/docs/concepts/security/pod-security-standards/)
- [Застосування Стандартів безпеки Pod на рівні простору імен](/docs/tutorials/security/ns-level-pss/)
