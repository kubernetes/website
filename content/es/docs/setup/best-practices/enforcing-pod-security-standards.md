---
reviewers:
- tallclair
- liggitt
title: Aplicación de los Estándares de Seguridad de Pods
weight: 40
---

<!-- overview -->

Esta página proporciona una descripción general de las mejores prácticas para aplicar los
[Estándares de Seguridad de Pods](/es/docs/concepts/security/pod-security-standards).

<!-- body -->

## Uso del controlador de admisión de seguridad de pods integrado

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

El [Controlador de Admisión Pod Security](/es/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
pretende reemplazar las PodSecurityPolicies en desuso.

### Configurar todos los namespaces del clúster

Los namespaces que carecen por completo de configuración deben considerarse brechas significativas en el modelo de
seguridad de tu clúster. Recomendamos dedicar tiempo a analizar los tipos de cargas de trabajo que se ejecutan en cada
namespace y, haciendo referencia a los Estándares de Seguridad de Pods, decidir un nivel adecuado para
cada uno de ellos. Los namespaces sin etiquetar solo deben indicar que aún no han sido evaluados.

En el caso de que todas las cargas de trabajo en todos los namespaces tengan los mismos requisitos de seguridad,
proporcionamos un [ejemplo](/es/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)
que ilustra cómo aplicar las etiquetas de PodSecurity de forma masiva.

### Adoptar el principio de mínimo privilegio

En un mundo ideal, cada pod en cada namespace cumpliría con los requisitos de la política
`restricted`. Sin embargo, esto no es posible ni práctico, ya que algunas cargas de trabajo requerirán privilegios
elevados por razones legítimas.

- Los namespaces que permiten cargas de trabajo `privileged` deben establecer y aplicar los controles de acceso correspondientes.
- Para las cargas de trabajo que se ejecutan en esos namespaces permisivos, mantén documentación sobre sus requisitos
  de seguridad únicos. Siempre que sea posible, evalúa cómo esos requisitos podrían restringirse
  aún más.

### Adoptar una estrategia multimodo

Los modos `audit` y `warn` del controlador de admisión de Estándares de Seguridad de Pods facilitan la
recopilación de información de seguridad importante sobre tus pods sin afectar las cargas de trabajo existentes.

Es una buena práctica habilitar estos modos para todos los namespaces, configurándolos en el nivel y
versión _deseados_ que eventualmente te gustaría `enforce` (aplicar). Las advertencias y las anotaciones de auditoría
generadas en esta fase pueden orientarte hacia ese estado. Si esperas que los autores de las cargas de trabajo realicen
cambios para ajustarse al nivel deseado, habilita el modo `warn`. Si planeas utilizar registros de auditoría para
supervisar/impulsar los cambios para ajustarse al nivel deseado, habilita el modo `audit`.

Cuando hayas configurado el modo `enforce` con tu valor deseado, estos modos aún pueden ser útiles de
varias maneras:

- Al configurar `warn` en el mismo nivel que `enforce`, los clientes recibirán advertencias al intentar
  crear Pods (o recursos con plantillas de Pod) que no pasen la validación. Esto les ayudará
  a actualizar esos recursos para que cumplan con la normativa.
- En namespaces que fijan `enforce` en una versión específica que no es la más reciente, configurar los modos `audit`
  y `warn` en el mismo nivel que `enforce`, pero en la versión `latest`, brinda visibilidad sobre las configuraciones
  permitidas por versiones anteriores pero que no están permitidas según las mejores prácticas actuales.

## Alternativas de terceros

{{% thirdparty-content %}}

En el ecosistema de Kubernetes se están desarrollando otras alternativas para aplicar perfiles de seguridad:

- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/).
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

La decisión de optar por una solución _integrada_ (por ejemplo, el controlador de admisión PodSecurity) frente a una
herramienta de terceros depende enteramente de tu propia situación. Al evaluar cualquier solución,
la confianza en tu cadena de suministro es crucial. En última instancia, utilizar _cualquiera_ de los enfoques
mencionados será mejor que no hacer nada.
