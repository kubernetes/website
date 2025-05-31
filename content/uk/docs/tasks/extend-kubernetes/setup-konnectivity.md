---
title: Налаштування служби Konnectivity
content_type: task
weight: 70
---

<!-- overview -->

Служба Konnectivity надає проксі на рівні TCP для комунікації між панеллю управління та кластером.

## {{% heading "prerequisites" %}}

Вам потрібно мати кластер Kubernetes, а також інструмент командного рядка kubectl повинен бути налаштований на звʼязок з вашим кластером. Рекомендується виконувати цей посібник на кластері з щонайменше двома вузлами, які не є хостами панелі управління. Якщо у вас ще немає кластера, ви можете створити його за допомогою [minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/).

<!-- steps -->

## Налаштування служби Konnectivity {#configure-the-konnectivity-service}

Для виконання наступних кроків потрібна конфігурація egress, наприклад:

{{% code_sample file="admin/konnectivity/egress-selector-configuration.yaml" %}}

Вам потрібно налаштувати API-сервер для використання служби Konnectivity та направлення мережевого трафіку на вузли кластера:

1. Переконайтеся, що функція [Проєкція токенів службових облікових записів](/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection) увімкенна у вашому кластері. Вона є типово увімкненою з версії Kubernetes v1.20.
2. Створіть файл конфігурації egress, наприклад `admin/konnectivity/egress-selector-configuration.yaml`.
3. Встановіть прапорець `--egress-selector-config-file` API-сервера на шлях до файлу конфігурації виходу API-сервера.
4. Якщо ви використовуєте з'ʼєднання UDS, додайте конфігурацію томів до kube-apiserver:

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

Згенеруйте або отримайте сертифікат та kubeconfig для konnectivity-server. Наприклад, ви можете використовувати інструмент командного рядка OpenSSL для створення сертифіката X.509, використовуючи сертифікат CA кластера `/etc/kubernetes/pki/ca.crt` з хосту панелі управління.

```bash
openssl req -subj "/CN=system:konnectivity-server" -new -newkey rsa:2048 -nodes -out konnectivity.csr -keyout konnectivity.key
openssl x509 -req -in konnectivity.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out konnectivity.crt -days 375 -sha256
SERVER=$(kubectl config view -o jsonpath='{.clusters..server}')
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-credentials system:konnectivity-server --client-certificate konnectivity.crt --client-key konnectivity.key --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-cluster kubernetes --server "$SERVER" --certificate-authority /etc/kubernetes/pki/ca.crt --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-context system:konnectivity-server@kubernetes --cluster kubernetes --user system:konnectivity-server
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config use-context system:konnectivity-server@kubernetes
rm -f konnectivity.crt konnectivity.key konnectivity.csr
```

Потім вам потрібно розгорнути сервер Konnectivity та агентів.
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy) є посиланням на референсну реалізацію.

Розгорніть сервер Konnectivity на ваших вузлах панелі управління. Наданий маніфест `konnectivity-server.yaml` передбачає, що компоненти Kubernetes розгорнуті як {{< glossary_tooltip text="статичний Pod" term_id="static-pod" >}} у вашому кластері. Якщо ні, ви можете розгорнути сервер Konnectivity як DaemonSet.

{{% code_sample file="admin/konnectivity/konnectivity-server.yaml" %}}

Потім розгорніть агентів Konnectivity у вашому кластері:

{{% code_sample file="admin/konnectivity/konnectivity-agent.yaml" %}}

Нарешті, якщо RBAC включено у вашому кластері, створіть відповідні правила RBAC:

{{% code_sample file="admin/konnectivity/konnectivity-rbac.yaml" %}}
