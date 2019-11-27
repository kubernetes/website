---
reviewers:
- dchen1107
- egernst
- tallclair
title: Sobrecarga de Pod
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

Cuando se está ejecutando un Pod en un Nodo, el Pod por si mismo toma una cantidad de recursos del sistema. Estos recursos son adicionales a los recursos necesarios para hacer funcionar el/los contenedor(es) dentro del Pod.
La _Sobrecarga de Pod_ es una característica para contabilizar los recursos consumidos por la infraestructura de pods que están arriba de las solicitudes y límites del/los contenedores.

{{% /capture %}}


{{% capture body %}}

## Sobrecarga de Pod

En Kubernetes, la sobrecarga de pod es configurado en el tiempo de [admisión](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) de acuerdo a la sobrecarga asociada con el [RuntimeClass](/docs/concepts/containers/runtime-class/) del pod.

Cuando se habilita la opción de sobrecarga de pod, se considera la sobrecarga además de la suma de solicitudes de recursos del contenedor cuando se programa un pod. Del mismo modo, Kubelet incluirá la sobrecarga de pod cuando se dimensione el cgroup del pod, y cuando al realizar la clasificación de la expulsión de pods.


### Configuración

Debe asegurarse de que la [puerta de características](/docs/reference/command-line-tools-reference/feature-gates/) `PodOverhead` esté activada (Está desactivada de manera predeterminada) en todo el cluster. Esto significa:

- en {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
- en {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}}
- en el {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} on each Node
- en cualquier servidor de API personalizado que ocupe puertas de características.

{{< note >}}
Los usuarios que pueden escribir recursos del tipo RuntimeClass pueden tener impacto en el rendimiento de la carga de trabajo en todo el cluster. Puede limitar el acceso ha esta habilidad usando los controles de acceso de Kubernetes.
Para obtener más detalles vea [Resumen de Autorización](/docs/reference/access-authn-authz/authorization/).
{{< /note >}}

{{% /capture %}}

{{% capture whatsnext %}}

* [RuntimeClass](/docs/concepts/containers/runtime-class/)
* [PodOverhead Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)

{{% /capture %}}
