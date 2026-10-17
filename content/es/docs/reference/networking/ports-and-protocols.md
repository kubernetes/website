---
title: Puertos y Protocolos
content_type: reference
weight: 40
---

Al ejecutar Kubernetes en un entorno con límites de red estrictos, tales
como centros de datos locales con firewalls de red físicos o Redes
Virtuales en la Nube Pública, resulta útil conocer los puertos y protocolos
utilizados por los componentes de Kubernetes.

## Plano de control

| Protocolo | Dirección | Rango de puertos | Propósito               | Utilizado por             |
|-----------|-----------|------------------|-------------------------|---------------------------|
| TCP       | Entrante  | 6443             | Servidor API de Kubernetes | Todos                  |
| TCP       | Entrante  | 2379-2380        | API de cliente del servidor etcd | kube-apiserver, etcd |
| TCP       | Entrante  | 10250            | API de Kubelet          | Sí mismo, Plano de control|
| TCP       | Entrante  | 10259            | kube-scheduler          | Sí mismo                  |
| TCP       | Entrante  | 10257            | kube-controller-manager | Sí mismo                  |

Aunque los puertos de etcd están incluidos en la sección del plano de control, también puedes alojar tu propio
clúster de etcd externamente o en puertos personalizados.

## Nodo(s) de trabajo {#node}

| Protocolo | Dirección | Rango de puertos  | Propósito             | Utilizado por           |
|-----------|-----------|-------------------|-----------------------|-------------------------|
| TCP       | Entrante  | 10250             | API de Kubelet        | Sí mismo, Plano de control |
| TCP       | Entrante  | 10256             | kube-proxy            | Sí mismo, Balanceadores de carga |
| TCP       | Entrante  | 30000-32767       | Servicios NodePort†   | Todos                   |
| UDP       | Entrante  | 30000-32767       | Servicios NodePort†   | Todos                   |

† Rango de puertos predeterminado para los [Servicios NodePort](/es/docs/concepts/services-networking/service/).

Todos los números de puerto predeterminados se pueden anular. Cuando se utilizan puertos personalizados, esos
puertos deben estar abiertos en lugar de los valores predeterminados mencionados aquí.

Un ejemplo común es el puerto del servidor API, que a veces se cambia
a 443. Alternativamente, el puerto predeterminado se mantiene como está y el servidor API se coloca
detrás de un balanceador de carga que escucha en el 443 y enruta las solicitudes al servidor API
en el puerto predeterminado.
