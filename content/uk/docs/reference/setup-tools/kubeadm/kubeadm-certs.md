---
title: kubeadm certs
content_type: concept
weight: 90
---

`kubeadm certs` надає утиліти для керування сертифікатами. Для отримання детальної інформації про використання цих команд, дивіться [Керування сертифікатами за допомогою kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).

## kubeadm certs {#cmd-certs}

Збірка операцій для роботи з сертифікатами Kubernetes.

{{< tabs name="tab-certs" >}}
{{< tab name="огляд" include="generated/kubeadm_certs/_index.md" />}}
{{< /tabs >}}

## kubeadm certs renew {#cmd-certs-renew}

Ви можете поновити всі сертифікати Kubernetes, використовуючи підкоманду `all`, або поновити їх вибірково. Для отримання детальної інформації дивіться [Ручне поновлення сертифікатів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal).

{{< tabs name="tab-certs-renew" >}}
{{< tab name="renew" include="generated/kubeadm_certs/kubeadm_certs_renew.md" />}}
{{< tab name="all" include="generated/kubeadm_certs/kubeadm_certs_renew_all.md" />}}
{{< tab name="admin.conf" include="generated/kubeadm_certs/kubeadm_certs_renew_admin.conf.md" />}}
{{< tab name="apiserver-etcd-client" include="generated/kubeadm_certs/kubeadm_certs_renew_apiserver-etcd-client.md" />}}
{{< tab name="apiserver-kubelet-client" include="generated/kubeadm_certs/kubeadm_certs_renew_apiserver-kubelet-client.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_certs/kubeadm_certs_renew_apiserver.md" />}}
{{< tab name="controller-manager.conf" include="generated/kubeadm_certs/kubeadm_certs_renew_controller-manager.conf.md" />}}
{{< tab name="etcd-healthcheck-client" include="generated/kubeadm_certs/kubeadm_certs_renew_etcd-healthcheck-client.md" />}}
{{< tab name="etcd-peer" include="generated/kubeadm_certs/kubeadm_certs_renew_etcd-peer.md" />}}
{{< tab name="etcd-server" include="generated/kubeadm_certs/kubeadm_certs_renew_etcd-server.md" />}}
{{< tab name="front-proxy-client" include="generated/kubeadm_certs/kubeadm_certs_renew_front-proxy-client.md" />}}
{{< tab name="scheduler.conf" include="generated/kubeadm_certs/kubeadm_certs_renew_scheduler.conf.md" />}}
{{< tab name="super-admin.conf" include="generated/kubeadm_certs/kubeadm_certs_renew_super-admin.conf.md" />}}
{{< /tabs >}}

## kubeadm certs certificate-key {#cmd-certs-certificate-key}

Ця команда може бути використана для створення нового ключа сертифіката для панелі управління. Ключ може бути переданий як `--certificate-key` до [`kubeadm init`](/docs/reference/setup-tools/kubeadm/kubeadm-init) та [`kubeadm join`](/docs/reference/setup-tools/kubeadm/kubeadm-join) для забезпечення автоматичного копіювання сертифікатів при підключенні додаткових вузлів панелі управління.

{{< tabs name="tab-certs-certificate-key" >}}
{{< tab name="certificate-key" include="generated/kubeadm_certs/kubeadm_certs_certificate-key.md" />}}
{{< /tabs >}}

## kubeadm certs check-expiration {#cmd-certs-check-expiration}

Ця команда перевіряє термін дії сертифікатів у локальному PKI, керованому kubeadm. Для отримання детальної інформації дивіться [Перевірка терміну дії сертифікатів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#check-certificate-expiration).

{{< tabs name="tab-certs-check-expiration" >}}
{{< tab name="check-expiration" include="generated/kubeadm_certs/kubeadm_certs_check-expiration.md" />}}
{{< /tabs >}}

## kubeadm certs generate-csr {#cmd-certs-generate-csr}

Ця команда може бути використана для створення ключів і CSRs для всіх сертифікатів панелі управління та файлів kubeconfig. Користувач може потім підписати CSRs з CA на свій вибір. Для отримання додаткової інформації про використання команди дивіться [Підписання запитів на підписання сертифікатів (CSR), створених за допомогою kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#signing-csr).

{{< tabs name="tab-certs-generate-csr" >}}
{{< tab name="generate-csr" include="generated/kubeadm_certs/kubeadm_certs_generate-csr.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) для запуску вузла панелі управління Kubernetes
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) для підключення вузла до кластера
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) для скасування будь-яких змін, внесених за допомогою `kubeadm init` або `kubeadm join`
