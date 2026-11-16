---
reviewers:
- raelga
- electrocucaracha
title: Aplicar los estándares de seguridad de Pods
weight: 40
---

<!-- overview -->

Esta página proporciona un resumen de las mejores prácticas para aplicar los
[estándares de seguridad de Pods](/docs/concepts/security/pod-security-standards).

<!-- body -->

## Utilizar el controlador de admisión de seguridad de Pods nativo

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

El [controlador de admisión de seguridad de Pods](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
pretende reemplazar a las obsoletas PodSecurityPolicies.

### Configurar todos los namespaces del clúster

Los namespaces que carecen de cualquier configuración deberían ser considerados una brecha significativa en el modelo de seguridad de tu clúster.
Recomendamos tomar tiempo para analizar los tipos de cargas de trabajo que se ejecutan en cada
namespace y, tomando como referencia los estándares de seguridad de Pods, decidir un nivel apropiado para
cada una de ellas. Los namespaces sin etiquetas solo deberían indicar que todavía deben ser evaluados.

En el escenario en que todas las cargas de trabajo en todos los namespaces tienen los mismos requerimientos de seguridad,
proporcionamos un [ejemplo](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)
que ilustra cómo las etiquetas de PodSecurity pueden ser utilizadas de forma masiva.

### Adoptar el principio de mínimo privilegio

En un mundo ideal, cada pod en cada namespace cumpliría los requerimientos de la política `restricted`.
Sin embargo, esto no es posible ni práctico debido a que algunas cargas de trabajo requerirán privilegios
elevados por razones legítimas.

- Los namespaces que permiten cargas de trabajo `privileged` deberían establecer y aplicar controles de acceso apropiados.
- Para cargas de trabajo que se ejecutan en aquellos namespaces permisivos, mantén documentación sobre sus requerimientos únicos de seguridad.
  Si es posible, considera cómo se podrían limitar aún más esos
  requerimientos.

### Adoptar una estrategia multimodo

Los modos `audit` y `warn` del controlador de admisión de estándares de seguridad de Pods facilitan
recopilar información de seguridad importante de tus pods sin romper tus cargas de trabajo existentes.

Es una buena práctica habilitar estos modos para todos los namespaces, configurando el nivel _deseado_
y la versión que te gustaría eventualmente `enforce`. Las advertencias y anotaciones de auditoría generadas en
esta fase pueden guiarte hacia ese estado. Si esperas que los autores de las cargas de trabajo hagan cambios para ajustarse
al nivel deseado, habilita el modo `warn`. Si esperas utilizar los registros de auditoría para monitorear o gestionar
cambios para ajustarse al nivel deseado, habilita el modo `audit`.

Cuando tienes configurado el modo `enforce` en tu valor deseado, estos modos todavía pueden ser útiles de
diferentes maneras:

- Al establecer `warn` en el mismo nivel que `enforce`, los clientes recibirán advertencias cuando intenten
  crear Pods (o recursos que tienen plantillas de Pod) que no superen la validación. Esto les ayudará
  a actualizar aquellos recursos para que cumplan con la normativa.
- En los namespaces que fijan `enforce` a una versión específica que no sea la más reciente, configurar los modos `audit` y `warn`
  al mismo nivel que `enforce`, pero en la versión `latest`, proporciona visibilidad sobre las configuraciones
  que estaban permitidas en versiones anteriores pero que ya no se permiten según las mejores prácticas actuales.

## Alternativas de terceros

{{% thirdparty-content %}}

Otras alternativas para aplicar perfiles de seguridad están siendo desarrolladas en el ecosistema de
Kubernetes:

- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/).
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

La decisión de optar por una solución _nativa_ (ej. el controlador de admisión PodSecurity) en vez de
una herramienta de terceros depende completamente de tu propia situación. Cuando evalúes cualquier solución,
confiar en tu cadena de suministro es crucial. Finalmente, utilizar _cualquiera_ de los enfoques mencionados anteriormente
será mejor que no hacer nada.
