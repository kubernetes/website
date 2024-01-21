---
reviewers:
- raelga
title: Sobrecarga de Pod
content_type: concept
weight: 20
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

Cuando se está ejecutando un {{< glossary_tooltip text="Pod" term_id="pod" >}} en un {{< glossary_tooltip text="nodo" term_id="node" >}}, el Pod por sí mismo utiliza una cantidad de recursos del sistema. Estos recursos son adicionales a los recursos necesarios para hacer funcionar el/los contenedor(es) dentro del Pod.
La _Sobrecarga de Pod_ es una característica para contabilizar los recursos consumidos por la infraestructura de Pods que están por encima de los valores de _Requests_ y _Limits_ del/los contenedor(es).

<!-- body -->

## Sobrecarga de Pod

En Kubernetes, la sobrecarga de {{< glossary_tooltip text="Pod" term_id="pod" >}} se configura en el tiempo de [admisión](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks) con respecto a la sobrecarga asociada con el [RuntimeClass](/docs/concepts/containers/runtime-class/) del Pod.

Cuando se habilita la opción de sobrecarga de {{< glossary_tooltip text="Pod" term_id="pod" >}}, se considera tanto la propia sobrecarga como la suma de solicitudes de recursos del contenedor al programar el {{< glossary_tooltip text="Pod" term_id="pod" >}}. Del mismo modo, {{< glossary_tooltip text="Kubelet" term_id="kubelet" >}} incluirá la sobrecarga de {{< glossary_tooltip text="Pod" term_id="pod" >}} cuando se dimensione el cgroup del {{< glossary_tooltip text="Pod" term_id="pod" >}}, y cuando se realice la clasificación de la expulsión de {{< glossary_tooltip text="Pods" term_id="pod" >}}.

### Configuración

Debe asegurarse de que el [Feature Gate](/docs/reference/command-line-tools-reference/feature-gates/) `PodOverhead` esté activado (su valor está desactivado de manera predeterminada) en todo el {{< glossary_tooltip text="clúster" term_id="cluster" >}}. Esto significa:

- en el {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}
- en el {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}}
- en el {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} de cada {{< glossary_tooltip text="nodo" term_id="node" >}}
- en cualquier servidor de API personalizado que necesite [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/).

{{< note >}}
Los usuarios que pueden escribir recursos del tipo RuntimeClass podrían impactar y poner en riesgo el rendimiento de la carga de trabajo en todo el {{< glossary_tooltip text="clúster" term_id="cluster" >}}. Por ello, se puede limitar el acceso a esta característica usando los controles de acceso de Kubernetes.
Para obtener más detalles vea la [documentación sobre autorización](/docs/reference/access-authn-authz/authorization/).
{{< /note >}}

<!-- whatsnext -->

* [RuntimeClass](/docs/concepts/containers/runtime-class/)
* [Diseño de capacidad de PodOverhead](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)
