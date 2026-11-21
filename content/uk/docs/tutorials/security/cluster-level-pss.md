---
title: Застосування Стандартів безпеки Podʼів на рівні кластера
content_type: tutorial
weight: 10
---

{{% alert title="Примітка" %}}
Цей посібник призначено лише для нових кластерів.
{{% /alert %}}

Pod Security — це контролер допуску, який під час створення нових Podʼів перевіряє їх на відповідність [Стандартам безпеки Podʼів](/docs/concepts/security/pod-security-standards/) Kubernetes. Ця можливість загальнодоступна (GA) з v1.25. Цей посібник показує, як примусово застосувати Стандарт безпеки Podʼів `baseline` на рівні кластера, що застосовує стандартну конфігурацію до всіх просторів імен у кластері.

Щоб застосувати Стандарти безпеки Podʼів до певних просторів імен, див. [Застосування Стандартів безпеки Podʼів на рівні простору імен](/docs/tutorials/security/ns-level-pss).

Якщо ви працюєте з версією Kubernetes, відмінною від v{{< skew currentVersion >}}, перевірте документацію для вашої версії.

## {{% heading "prerequisites" %}} {#before-you-begin}

Встановіть на свою робочу станцію:

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)

Цей посібник показує, що можна налаштувати для кластера Kubernetes, який ви повністю контролюєте. Якщо ви вивчаєте, як налаштувати Pod Security Admission для керованого кластера, де ви не можете налаштувати панель управління, прочитайте [Застосування Стандартів безпеки Podʼів на рівні простору імен](/docs/tutorials/security/ns-level-pss).

## Виберіть відповідний Стандарт безпеки Podʼів для застосування {#choose-the-right-pod-security-standard-to-apply}

[Pod Security Admission](/docs/concepts/security/pod-security-admission/) дає змогу застосовувати вбудовані [Стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards/) у таких режимах: `enforce`, `audit` і `warn`.

Щоб зібрати інформацію, яка допоможе вам вибрати Стандарти безпеки Podʼів, що найкраще підходять для вашої конфігурації, виконайте такі дії:

1. Створіть кластер без застосованих Стандартів безпеки Podʼів:

   ```shell
   kind create cluster --name psa-wo-cluster-pss
   ```

   Вивід подібний до:

   ```
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

   ```
   Kubernetes control plane is running at https://127.0.0.1:61350

   CoreDNS is running at https://127.0.0.1:61350/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

1. Отримайте список просторів імен у кластері:

   ```shell
   kubectl get ns
   ```

   Вивід подібний до цього:

   ```
   NAME                 STATUS   AGE
   default              Active   9m30s
   kube-node-lease      Active   9m32s
   kube-public          Active   9m32s
   kube-system          Active   9m32s
   local-path-storage   Active   9m26s
   ```

1. Використайте `--dry-run=server`, щоб зрозуміти, що відбувається, коли застосовуються різні Стандарти безпеки Podʼів:

   1. Privileged

      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=privileged
      ```

      Вивід подібний до:

      ```
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

      ```
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

      ```
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

З попереднього виводу видно, що застосування Стандарту безпеки Podʼів `privileged` не показує попереджень для жодного простору імен. Однак для стандартів `baseline` і `restricted` є попередження, зокрема в просторі імен `kube-system`.

## Встановлення режимів, версій і стандартів {#set-modes-versions-and-standards}

У цьому розділі ви застосуєте такі Стандарти безпеки Podʼів до версії `latest`:

- Стандарт `baseline` у режимі `enforce`.
- Стандарт `restricted` у режимах `warn` та `audit`.

Стандарт безпеки Podʼів `baseline` є зручним компромісом, який дає змогу тримати список винятків коротким і запобігає відомим способам підвищення привілеїв.

Крім того, щоб Podʼи в `kube-system` не зазнавали збоїв, ви виключите цей простір імен із застосування Стандартів безпеки Podʼів.

Впроваджуючи Pod Security Admission у власному середовищі, врахуйте таке:

1. Залежно від рівня ризику, прийнятого для кластера, кращим вибором може бути суворіший Стандарт безпеки Podʼів, як-от `restricted`.
1. Виключення простору імен `kube-system` дозволяє Podʼам працювати в цьому просторі імен як `privileged`. Для реального використання проєкт Kubernetes наполегливо рекомендує застосовувати суворі політики RBAC, які обмежують доступ до `kube-system`, дотримуючись принципу найменших привілеїв. Щоб впровадити наведені вище стандарти, виконайте такі дії:

1. Створіть файл конфігурації, який контролер допуску Pod Security Admission може використати для застосування цих Стандартів безпеки Podʼів:

   ```
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

1. Налаштуйте API-сервер на використання цього файлу під час створення кластера:

   ```
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
       # optional: if set, the mount is read-only.
       # default false
       readOnly: false
       # optional: if set, the mount needs SELinux relabeling.
       # default false
       selinuxRelabel: false
       # optional: set propagation mode (None, HostToContainer or Bidirectional)
       # see https://kubernetes.io/docs/concepts/storage/volumes/#mount-propagation
       # default None
       propagation: None
   EOF
   ```

   {{< alert color="info" title="Примітка" >}}
   Якщо ви використовуєте Docker Desktop з *kind* на macOS, ви можете додати `/tmp` як спільну теку у меню **Preferences > Resources > File Sharing**.
   {{< /alert >}}

1. Створіть кластер, який використовує Pod Security Admission для застосування цих Стандартів безпеки Podʼів:

   ```shell
   kind create cluster --name psa-with-cluster-pss --config /tmp/pss/cluster-config.yaml
   ```

   Вивід буде подібним до цього:

   ```
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

1. Спрямуйте kubectl на кластер:

   ```shell
   kubectl cluster-info --context kind-psa-with-cluster-pss
   ```

   Вивід буде схожий на цей:

   ```
   Kubernetes control plane is running at https://127.0.0.1:63855
   CoreDNS is running at https://127.0.0.1:63855/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

1. Створіть Pod у просторі імен default:

    {{% code_sample file="security/example-baseline-pod.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   Pod запускається нормально, але вивід містить попередження:

   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

## Очищення {#clean-up}

Тепер видаліть кластери, які ви створили вище, виконавши цю команду:

```shell
kind delete cluster --name psa-with-cluster-pss
```

```shell
kind delete cluster --name psa-wo-cluster-pss
```

## {{% heading "whatsnext" %}} {#what-s-next}

- Виконайте [скрипт оболонки](/examples/security/kind-with-cluster-level-baseline-pod-security.sh), щоб виконати всі попередні кроки за один раз:
  1. Створіть конфігурацію рівня кластера на основі Стандартів безпеки Podʼів.
  2. Створіть файл для того, щоб API-сервер міг використовувати цю конфігурацію.
  3. Створіть кластер, який створює API-сервер з цією конфігурацією.
  4. Встановіть контекст kubectl для цього нового кластера.
  5. Створіть мінімальний YAML-файл Pod.
  6. Застосуйте цей файл, щоб створити Pod у новому кластері.
- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- [Стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards/)
- [Застосування Стандартів безпеки Podʼів на рівні простору імен](/docs/tutorials/security/ns-level-pss/)
