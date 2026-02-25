---
content_type: "reference"
title: Вимоги до версії ядра Linux
weight: 10
---

{{% thirdparty-content %}}

Багато функцій залежать від певних можливостей ядра і мають мінімальні вимоги до версії ядра. Однак покладатися лише на номери версій ядра може бути недостатньо для деяких операційних систем, оскільки підтримувачі дистрибутивів таких як RHEL, Ubuntu та SUSE часто зворотно переносять вибрані функції до старіших версій ядра (залишаючи старішу версію ядра).

## Pod sysctls {#pod-sysctls}

У Linux системний виклик `sysctl()` налаштовує параметри ядра під час виконання. Є інструмент командного рядка з назвою `sysctl`, який можна використовувати для налаштування цих параметрів, і багато з них доступні через файлову систему `proc`.

Деякі sysctls доступні лише за наявності достатньо нової версії ядра.

Наступні sysctls мають мінімальні вимоги до версії ядра і підтримуються в [безпечному наборі](/docs/tasks/administer-cluster/sysctl-cluster/#safe-and-unsafe-sysctls):

<!--
Code: https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L19-L45
-->
- `net.ipv4.ip_local_reserved_ports` (з Kubernetes 1.27, потребує ядро 3.16+);
- `net.ipv4.tcp_keepalive_time` (з Kubernetes 1.29, потребує ядро 4.5+);
- `net.ipv4.tcp_fin_timeout` (з Kubernetes 1.29, потребує ядро 4.6+);
- `net.ipv4.tcp_keepalive_intvl` (з Kubernetes 1.29, потребує ядро 4.5+);
- `net.ipv4.tcp_keepalive_probes` (з Kubernetes 1.29, потребує ядро 4.5+);
- `net.ipv4.tcp_syncookies` (з ізоляцією в просторі імен з ядра 4.6+);
- `net.ipv4.tcp_rmem` (з Kubernetes 1.32, потребує ядро 4.15+).
- `net.ipv4.tcp_wmem` (з Kubernetes 1.32, потребує ядро 4.15+).
- `net.ipv4.vs.conn_reuse_mode` (використовується в режимі проксі `ipvs`, потребує ядро 4.1+);

### Режим проксі `nftables` в kube-proxy {#kube-proxy-nftables-proxy-mode}

<!--
Code: https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L53-L56
-->
Для Kubernetes {{< skew currentVersion >}}, режим [`nftables`](/docs/reference/networking/virtual-ips/#proxy-mode-nftables) у kube-proxy вимагає
версії 1.0.1 або новішої версії інструменту командного рядка nft, а також ядра 5.13 або новішого.

Для тестування та розробки можна використовувати старіші ядра, аж до 5.4, якщо встановити опцію `nftables.skipKernelVersionCheck` у конфігурації kube-proxy. Але це не рекомендується в операційній діяльності, оскільки це може викликати проблеми з іншими користувачами nftables
у системі.

## Контрольні групи версії 2 {#version-2-control-groups}

Підтримка cgroup v1 у Kubernetes перебуває в режимі супроводу, починаючи з версії Kubernetes v1.31; рекомендовано використовувати cgroup v2. У [Linux 5.8](https://github.com/torvalds/linux/commit/4a7e89c5ec0238017a757131eb9ab8dc111f961c), файл системного рівня `cpu.stat` був доданий до кореневої cgroup для зручності.

У документації runc, ядра старіші за 5.2 не рекомендуються через відсутність підтримки freezer.

## Pressure Stall Information (PSI) {#requirements-psi}

[Pressure Stall Information](/docs/reference/instrumentation/understand-psi-metrics/) підтримується в ядрі Linux версії 4.20 та новіших, але вимагає наступної конфігурації:

- Ядро повинно бути скомпільоване з опцією `CONFIG_PSI=y`. Більшість сучасних дистрибутивів це стандартно увімкнено. Ви можете перевірити конфігурацію вашого ядра, виконавши команду `zgrep CONFIG_PSI /proc/config.gz`.
- Деякі дистрибутиви Linux можуть скомпілювати PSI в ядро, але вимкнути його. Якщо так, вам потрібно увімкнути його під час завантаження, додайте параметр `psi=1` до командного рядка ядра.

## Інші вимоги до ядра {#requirements-other}

Деякі функції можуть залежати від нових можливостей ядра і мати конкретні вимоги до ядра:

<!--
Code(recursive read only mount): https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/staging/src/k8s.io/cri-api/pkg/apis/runtime/v1/api.proto#L1605-L1609
Code(user namespace and swap): https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L47-L51
-->
1. [Рекурсивне монтування в режимі тільки для читання](/docs/concepts/storage/volumes/#recursive-read-only-mounts): Реалізується шляхом застосування атрибута `MOUNT_ATTR_RDONLY` із прапором `AT_RECURSIVE`, використовуючи `mount_setattr`(2), доданий у ядрі Linux v5.12.
2. Підтримка простору імен користувачів в Pod вимагає мінімальної версії ядра 6.5+, згідно з [KEP-127](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/127-user-namespaces/README.md).
3. Для [swap на рівні вузлів](/docs/concepts/architecture/nodes/#swap-memory) не підтримується tmpfs, встановлений як `noswap`, до версії ядра 6.3.

## Довгострокова підтримка ядра Linux {#linux-kernel-long-term-maintenance}

Актуальні випуски ядра можна знайти на [kernel.org](https://www.kernel.org/category/releases.html).

Зазвичай існує кілька випусків ядра з _довгостроковою підтримкою_, які забезпечують зворотне перенесення виправлень для старіших версій ядра. До таких ядер застосовуються лише важливі виправлення помилок, і вони зазвичай виходять не дуже часто, особливо для старіших версій. Перегляньте список випусків на вебсайті ядра Linux в розділі [Longterm](https://www.kernel.org/category/releases.html).

## {{% heading "whatsnext" %}}

- Перегляньте [sysctls](/docs/tasks/administer-cluster/sysctl-cluster/) для отримання додаткової інформації.
- Дозвольте запуск kube-proxy у [режимі nftables](/docs/reference/networking/virtual-ips/#proxy-mode-nftables).
- Дізнайтесь більше про [cgroups v2](/docs/concepts/architecture/cgroups/).
