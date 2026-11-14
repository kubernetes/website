---
title: Налаштування служби Konnectivity
content_type: task
weight: 70
---

<!-- overview -->

Служба Konnectivity надає проксі на рівні TCP для звʼязку панелі управління з кластером.

## {{% heading "prerequisites" %}} {#before-you-begin}

Вам потрібен кластер Kubernetes, а інструмент командного рядка kubectl має бути налаштований на звʼязок із вашим кластером. Рекомендовано виконувати цей навчальний матеріал на кластері щонайменше з двома вузлами, які не є хостами панелі управління. Якщо у вас ще немає кластера, ви можете створити його за допомогою [minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/).

<!-- steps -->

## Налаштування служби Konnectivity {#configure-the-konnectivity-service}

Для виконання наведених нижче кроків потрібна конфігурація egress, наприклад:

{{% code_sample file="admin/konnectivity/egress-selector-configuration.yaml" %}}

Потрібно налаштувати API-сервер на використання служби Konnectivity і спрямування мережевого трафіку на вузли кластера:

1. Переконайтеся, що у вашому кластері увімкнено можливість [проєкції томів токенів службових облікових записів](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection). Вона стандартно увімкнена з версії Kubernetes v1.20.
1. Створіть файл конфігурації egress, наприклад `admin/konnectivity/egress-selector-configuration.yaml`.
1. Встановіть прапорець `--egress-selector-config-file` API-сервера на шлях до файлу конфігурації egress API-сервера.
1. Якщо ви використовуєте зʼєднання UDS, додайте конфігурацію томів до kube-apiserver:

   ```yaml
   spec:
     containers:
       volumeMounts:
       - name: konnectivity-uds
         mountPath: /etc/kubernetes/konnectivity-server
         readOnly: false
     volumes:
     - name: konnectivity-uds
       hostPath:
         path: /etc/kubernetes/konnectivity-server
         type: DirectoryOrCreate
   ```

Згенеруйте або отримайте сертифікат і kubeconfig для konnectivity-server. Наприклад, можна використати інструмент командного рядка OpenSSL, щоб видати сертифікат X.509 за допомогою сертифіката CA кластера `/etc/kubernetes/pki/ca.crt` з хоста панелі управління.

```bash
openssl req -subj "/CN=system:konnectivity-server" -new -newkey rsa:2048 -noenc -out konnectivity.csr -keyout konnectivity.key
openssl x509 -req -in konnectivity.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out konnectivity.crt -days 375 -sha256
SERVER=$(kubectl config view -o jsonpath='{.clusters..server}')
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-credentials system:konnectivity-server --client-certificate konnectivity.crt --client-key konnectivity.key --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-cluster kubernetes --server "$SERVER" --certificate-authority /etc/kubernetes/pki/ca.crt --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-context system:konnectivity-server@kubernetes --cluster kubernetes --user system:konnectivity-server
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config use-context system:konnectivity-server@kubernetes
rm -f konnectivity.crt konnectivity.key konnectivity.csr
```

Далі потрібно розгорнути сервер Konnectivity та агентів. [kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy) — це еталонна реалізація.

Розгорніть сервер Konnectivity на вузлі панелі управління. Наданий маніфест `konnectivity-server.yaml` передбачає, що компоненти Kubernetes розгорнуто як {{< glossary_tooltip text="статичний Pod" term_id="static-pod" >}} у вашому кластері. Якщо ні, сервер Konnectivity можна розгорнути як DaemonSet.

{{% code_sample file="admin/konnectivity/konnectivity-server.yaml" %}}

Потім розгорніть агентів Konnectivity у вашому кластері:

{{% code_sample file="admin/konnectivity/konnectivity-agent.yaml" %}}

Нарешті, якщо RBAC увімкнено у вашому кластері, створіть відповідні правила RBAC:

{{% code_sample file="admin/konnectivity/konnectivity-rbac.yaml" %}}
