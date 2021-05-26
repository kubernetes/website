---
title: Vista General de Seguridad Cloud Native
content_type: concept
weight: 10
---

<!-- overview -->

Esta descripción general define un modelo para la seguridad de Kubernetes en el contexto de Seguridad en Cloud Native.

{{< warning >}}
Este modelo de seguridad en el contenedor brinda sugerencias, no es una prueba de políticas de seguridad de la información.
{{< /warning >}}

<!-- body -->

## Las 4C de Seguridad en Cloud Native

Puede pensar en seguridad por capas. Las 4C de la seguridad en Cloud Native son la nube (Cloud),
{{< glossary_tooltip text="Clústeres" term_id="cluster" >}}, {{< glossary_tooltip text="Contenedores" term_id="container" >}} y Código.

{{< note >}}
Este enfoque en capas aumenta la [defensa en profundidad](https://en.wikipedia.org/wiki/Defense_in_depth_(computing))
de la seguridad, es considerada una buena práctica en seguridad para el software de sistemas.
{{< /note >}}

{{< figure src="/images/docs/4c.png" title="Las 4C de Seguridad en Cloud Native" >}}

Cada capa del modelo de seguridad Cloud Native es basada en la siguiente capa más externa.
La capa de código se beneficia de una base sólida (nube, clúster, contenedor) de capas seguras.
No podemos garantizar la seguridad aplicando solo seguridad a nivel del código, y usar estándares de seguridad deficientes en las otras capas.

## Nube (Cloud)

En muchos sentidos, la nube (o los servidores o el centro de datos corporativo) es la
[base de computador confiable](https://es.wikipedia.org/wiki/Base_de_computador_confiable)
de un clúster de Kubernetes. Si la capa de la nube es vulnerable (o
configurado de alguna manera vulnerable), por consecuencia no hay garantía de que los componentes construidos
encima de la base sean seguros. Cada proveedor de la nube tiene recomendaciones de seguridad
para ejecutar las cargas de trabajo de forma segura en sus entornos.

### Seguridad del proveedor de la nube

Si está ejecutando un clúster de Kubernetes en su propio hardware o en un proveedor de nube diferente,
consulte la documentación para conocer las mejores prácticas de seguridad.
A continuación, algunos enlaces a la documentación de seguridad de los proveedores de nube más populares:

{{< table caption="Cloud provider security" >}}

Proveedor IaaS        | Link |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security/ |
Google Cloud Platform | https://cloud.google.com/security/ |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
VMWare VSphere | https://www.vmware.com/security/hardening-guides.html |

{{< /table >}}

### Seguridad de la Infraestructura {#infrastructure-security}

Sugerencias para proteger su infraestructura en un clúster de Kubernetes:

{{< table caption="Infrastructure security" >}}

Área de Interés para la Infraestructura de Kubernetes | Recomendación |
--------------------------------------------- | -------------- |
Acceso de red al Plano de Control | Todo acceso público al {{< glossary_tooltip text="plano de control" term_id="control-plane" >}} del Kubernetes en Internet no está permitido y es controlado por listas de control de acceso a la red estrictas a un conjunto de direcciones IP necesarias para administrar el clúster.|
Acceso a la red de los Nodos | Los {{< glossary_tooltip text="nodos" term_id="node" >}} deben ser configurados para _solo_ aceptar conexiones (por medio de listas de control de acceso a la red) desde el plano de control en los puertos especificados y aceptar conexiones para servicios en Kubernetes del tipo NodePort y LoadBalancer. Si es posible, estos nodos no deben exponerse públicamente en Internet.
Acceso a la API de Kubernetes del proveedor de la nube | Cada proveedor de la nube debe dar un conjunto de permisos al plano de control y nodos del Kubernetes. Es mejor otorgar al clúster el permiso de acceso al proveedor de nube siguiendo el [principio de mínimo privilegio](https://es.wikipedia.org/wiki/Principio_de_m%C3%ADnimo_privilegio) para los recursos que necesite administrar. La [documentación del Kops](https://github.com/kubernetes/kops/blob/master/docs/iam_roles.md#iam-roles) ofrece información sobre las políticas y roles de IAM.
Acceso a etcd | El acceso a {{< glossary_tooltip text="etcd" term_id="etcd" >}} (banco de datos de Kubernetes) debe ser limitado apenas al plano de control. Dependiendo de su configuración, debería intentar usar etcd sobre TLS. Puede encontrar mas información en la [documentación de etcd](https://github.com/etcd-io/etcd/tree/master/Documentation).
Encriptación etcd | Siempre que sea posible, es una buena práctica encriptar todas las unidades de almacenamiento. Etcd mantiene el estado de todo el clúster (incluidos los Secretos), por lo que su disco debe estar encriptado.

{{< /table >}}

## Clúster

Existen dos áreas de preocupación para proteger Kubernetes:

* Protección de las configuraciones de los componentes del clúster.
* Protección de las aplicaciones que se ejecutan en el clúster.

### Componentes del Clúster {#cluster-components}

Si desea proteger su clúster de accesos accidentales o maliciosos y adoptar
buenas prácticas de seguridad, a continuación sigue estos consejos sobre
[como proteger el clúster](/docs/tasks/administer-cluster/securing-a-cluster/).

### Componentes del clúster (su aplicación) {#cluster-applications}

Dependiendo de la superficie de ataque de su aplicación, es posible que desee concentrarse en
temas de seguridad específicos. Por ejemplo: si está ejecutando un servicio (Servicio A) que es crítico
en una cadena de otros recursos y otra carga de trabajo separada (Servicio B) que es
vulnerable a un ataque de sobrecarga de recursos, el riesgo de comprometer el Servicio A
es alto si no limita las funciones del Servicio B. La siguiente tabla enumera
áreas de atención de seguridad y recomendaciones para proteger las cargas de trabajo que se ejecutan en Kubernetes:

Áreas para la seguridad de la carga del trabajo | Recomendación |
------------------------------ | --------------------- |
Autorización RBAC (acceso a la API Kubernetes) | https://kubernetes.io/docs/reference/access-authn-authz/rbac/
Autenticación | https://kubernetes.io/docs/concepts/security/controlling-access/
Administrar secretos en la aplicación (encriptar el etcd - dato en reposo) | https://kubernetes.io/docs/concepts/configuration/secret/ <br> https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/
Políticas de seguridad de Pod | https://kubernetes.io/docs/concepts/policy/pod-security-policy/
Calidad de servicio (y gestión de recursos del clúster) | https://kubernetes.io/docs/tasks/configure-pod-container/quality-service-pod/
Políticas de Red | https://kubernetes.io/docs/concepts/services-networking/network-policies/
TLS para Kubernetes Ingress | https://kubernetes.io/docs/concepts/services-networking/ingress/#tls

## Contenedor

La seguridad de los contenedores está fuera del alcance de la guía. Aquí hay recomendaciones generales y
enlaces para explorar este tema:

Área de Interés para Contenedores | Recomendación |
------------------------------ | -------------- |
Escáneres de vulnerabilidad de contenedores y seguridad de dependencia del sistema operativo | Como parte del paso de la creación de la imagen, se debe utilizar un escáner de contenedores para detectar vulnerabilidades.
Firma de Imágenes y Aplicación | Firma de imágenes de contenedores para mantener un sistema confiable para el contenido de sus contenedores.
Prohibir Usuarios Privilegiados | Al crear contenedores, consulte la documentación para crear usuarios dentro de los contenedores con el menor privilegio necesario para cumplir con el propósito del contenedor en el sistema operativo.
Utilice el contenedor de tiempo de ejecución con el aislamiento más fuerte | Seleccione [clases del contenedor runtime](/docs/concepts/containers/runtime-class/) con el proveedor de aislamiento más fuerte.

## Código

El código de la aplicación es una de las principales superficies de ataque sobre las que tenemos más control.
Aunque la protección del código de la aplicación está fuera del tema de seguridad de Kubernetes, aquí algunas
recomendaciones para proteger el código de su aplicación:

### Seguridad del código

{{< table caption="Code security" >}}

Áreas de Atención para el Código | Recomendación |
-------------------------| -------------- |
Acceso solo a través de TLS | Si su código necesita comunicarse a través de TCP, ejecute un handshake TLS con el cliente anticipadamente. Con la excepción de algunos casos, encripte todo lo que está en tránsito. Yendo un paso más allá, es una buena idea cifrar el tráfico de red entre los servicios. Esto se puede hacer a través del proceso de autenticación mutua o [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication), que realiza una verificación bilateral de la comunicación a través de los certificados en los servicios. |
Limitación de rangos de puertos de comunicación | Esta recomendación puede ser un poco evidente, pero siempre que sea posible, solo debe exponer los puertos de su servicio que son absolutamente esenciales para la comunicación o la recopilación de métricas. |
Seguridad en dependencia de terceros | Es una buena práctica comprobar periódicamente las bibliotecas de terceros de su aplicación en busca de vulnerabilidades de seguridad. Cada lenguaje de programación tiene una herramienta para realizar esta verificación de forma automática. |
Análisis de código estático | La mayoría de los lenguajes proporcionan una forma de analizar el código en busca de prácticas de codificación potencialmente inseguras. Siempre que sea posible, debe automatizar los escaneos utilizando herramientas que puedan escanear las bases del código en busca de errores de seguridad comunes. Algunas de las herramientas se pueden encontrar en [OWASP Source Code Analysis Tools](https://owasp.org/www-community/Source_Code_Analysis_Tools). |
Ataques de sondeo dinámico | Existen algunas herramientas automatizadas que puede ejecutar en su servicio para explorar algunos de los ataques más conocidos. Esto incluye la inyección de SQL, CSRF y XSS. Una de las herramientas de análisis dinámico más populares es la [OWASP Zed Attack proxy](https://owasp.org/www-project-zap/). |

{{< /table >}}

## {{% heading "whatsnext" %}}

Obtenga más información sobre los temas de seguridad de Kubernetes:

* [Estándares de seguridad del pod](/docs/concepts/security/pod-security-standards/)
* [Políticas de red para pods](/docs/concepts/services-networking/network-policies/)
* [Control de acceso a la API de Kubernetes](/docs/concepts/security/controlling-access)
* [Protegiendo su clúster](/docs/tasks/administer-cluster/securing-a-cluster/)
* [Criptografía de datos en tránsito](/docs/tasks/tls/managing-tls-in-a-cluster/)
* [Criptografía de datos en reposo](/docs/tasks/administer-cluster/encrypt-data/)
* [Secretos en Kubernetes](/docs/concepts/configuration/secret/)
* [Runtime class](/docs/concepts/containers/runtime-class)