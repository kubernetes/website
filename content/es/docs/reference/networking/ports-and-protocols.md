---
title: Puertos y protocolos
content_type: reference
weight: 40
---

Cuando Kubernetes se ejecuta en un entorno con límites estrictos de red, como
en un centro de datos local con firewalls de red físicos o redes
virtuales en la nube pública, es útil conocer los puertos y protocolos
usados por los componentes de Kubernetes.

## Plano de control

| Protocolo | Dirección | Rango de puertos | Propósito                        | Usado por                  |
|-----------|-----------|------------------|----------------------------------|----------------------------|
| TCP       | Entrante  | 6443             | Servidor de la API de Kubernetes | Todos                      |
| TCP       | Entrante  | 2379-2380        | API cliente/servidor de etcd     | kube-apiserver, etcd       |
| TCP       | Entrante  | 10250            | API de Kubelet                   | Sí mismo, plano de control |
| TCP       | Entrante  | 10259            | kube-scheduler                   | Sí mismo                   |
| TCP       | Entrante  | 10257            | kube-controller-manager          | Sí mismo                   |

Aunque los puertos de etcd están incluidos en la sección del plano de control, también puedes alojar tu propio
clúster de etcd externamente o en puertos personalizados.

## Nodo(s) de trabajo {#node}

| Protocolo | Dirección | Rango de puertos | Propósito           | Usado por                        |
|-----------|-----------|------------------|---------------------|----------------------------------|
| TCP       | Entrante  | 10250            | API de Kubelet      | Sí mismo, plano de control       |
| TCP       | Entrante  | 10256            | kube-proxy          | Sí mismo, balanceadores de carga |
| TCP       | Entrante  | 30000-32767      | Servicios NodePort† | Todos                            |
| UDP       | Entrante  | 30000-32767      | Servicios NodePort† | Todos                            |

† Rango de puertos predeterminado para [Servicios NodePort](/docs/concepts/services-networking/service/).

Todos los números de puerto predeterminados se pueden sobrescribir. Cuando se utilizan puertos personalizados, esos
puertos deben estar abiertos en lugar de los predeterminados que se mencionan aquí.

Un ejemplo común es el puerto del servidor de la API, que a veces se cambia
al 443. Alternativamente, el puerto predeterminado se mantiene y el servidor de la API se coloca
detrás de un balanceador de carga que escucha en el 443 y enruta las peticiones al servidor de la API
en el puerto predeterminado.
