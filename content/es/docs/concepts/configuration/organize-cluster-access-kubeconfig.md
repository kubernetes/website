---
title: Organizar el acceso a los clústeres utilizando archivos kubeconfig
content_type: concept
weight: 60
---

<!-- overview -->

Utilice los archivos kubeconfig para organizar la información acerca de los clústeres, los
usuarios, los Namespaces y los mecanismos de autenticación. La herramienta de
línea de comandos `kubectl` utiliza los archivos kubeconfig para hallar la información que
necesita para escoger un clúster y comunicarse con el servidor API de un clúster.

{{< note >}}
Un archivo utilizado para configurar el acceso a los clústeres se denomina
*archivo kubeconfig*. Esta es una forma genérica de referirse a los archivos de
configuración. Esto no significa que exista un archivo llamado `kubeconfig`.
{{< /note >}}

Por defecto, `kubectl` busca un archivo llamado `config` en el directorio `$HOME/.kube`.
Puedes especificar otros archivos kubeconfig mediante la configuración de la variable
de entorno `KUBECONFIG` o mediante la configuracion del flag
[`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/).

Para obtener instrucciones paso a paso acerca de cómo crear y especificar los archivos kubeconfig,
consulte el recurso
[Configurar El Acceso A Múltiples Clústeres](/docs/tasks/access-application-cluster/configure-access-multiple-clusters).



<!-- body -->

## Compatibilidad con múltiples clústeres, usuarios y mecanismos de autenticación

Suponga que tiene diversos clústeres y que sus usuarios y componentes se autentican
de diversas maneras. Por ejemplo:

- Un kubelet en ejecución se podría autenticar usando certificados.
- Un usuario se podría autenticar utilizando tokens.
- Los administradores podrían tener un conjunto de certificados que sean suministrados a los usuarios individualmente.

Con los archivos kubeconfig puedes organizar tus clústeres, usuarios y Namespaces.
También puedes definir diferentes contextos para realizar de forma rápida y
fácil cambios entre clústeres y Namespaces.

## Contexto

Un elemento *context* en un archivo kubeconfig se utiliza para agrupar los parámetros de
acceso bajo un nombre apropiado. Cada contexto tiene tres parámetros: clúster, Namespace
y usuario.
Por defecto, la herramienta de línea de comandos `kubectl` utiliza los parámetros del
*contexto actual* para comunicarse con el clúster.

Para seleccionar el contexto actual:

```shell
kubectl config use-context
```

## Variable de entorno KUBECONFIG

La variable de entorno `KUBECONFIG` contiene una lista de archivos kubeconfig.
En el caso de Linux y Mac, la lista está delimitada por dos puntos.  Si se trata
de Windows, la lista está delimitada por punto y coma. La variable de entorno
`KUBECONFIG` no es indispensable. Si la variable de entorno `KUBECONFIG` no existe,
`kubectl` utiliza el archivo kubeconfig por defecto `$HOME/.kube/config`.

Si la variable de entorno `KUBECONFIG` existe, `kubectl` utiliza una
configuración eficiente que es el resultado de la fusión de los archivos
listados en la variable de entorno `KUBECONFIG`.

## Fusionando archivos kubeconfig

Para poder ver su configuración, escriba el siguiente comando:

```shell
kubectl config view
```

Como se ha descrito anteriormente, la respuesta de este comando podría resultar a partir de un solo
archivo kubeconfig, o podría ser el resultado de la fusión de varios archivos kubeconfig.

A continuación se muestran las reglas que usa `kubectl` cuando fusiona archivos kubeconfig:

1. Si el flag `--kubeconfig` está activado, usa solamente el archivo especificado. Sin fusionar.
   Sólo se permite una instancia con este flag.

   En caso contrario, si la variable de entorno `KUBECONFIG` está activada, sera usada
   como un listado de los archivos a ser fusionados.
   Fusionar los archivos listados en la variable de entorno `KUBECONFIG` de acuerdo
   con estas reglas:

   * Ignorar nombres de archivo vacíos.
   * Producir errores para archivos con contenido que no pueden ser deserializados.
   * El primer archivo que establezca un valor particular o una clave se impone.
   * Nunca cambie el valor o la clave.
     Ejemplo: Conserva el contexto del primer archivo para configurar el `contexto actual`.
     Ejemplo: Si dos archivos especifican un `red-user`, utilice sólo los valores del primer archivo.
     Incluso desechar el segundo archivo aunque tenga registros que no tengan conflictos.

   Para obtener un ejemplo de configuración de la variable de entorno `KUBECONFIG`, consulte la sección
   [Configuración de la variable de entorno KUBECONFIG](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable).

   En caso contrario, utilice el archivo kubeconfig predeterminado `$HOME/.kube/config`, sin fusionar.

2. Determinar el contexto a utilizar con base en el primer acierto en esta secuencia:

   1. Si es que existe, utilice el flag `---contexto` de la línea de comandos.
   2. Utilice el `contexto actual` procedente de los archivos kubeconfig fusionados.

   En este punto se permite un contexto vacío.

3. Determinar el clúster y el usuario. En este caso, puede o no haber un contexto.
   Determine el clúster y el usuario con base en el primer acierto que se ejecute dos veces en
   esta secuencia: una para el usuario y otra para el clúster:

   1. Si es que existen, utilice el flag `--user` o `--cluster` de la línea de comandos.
   2. Si el contexto no está vacío, tome el usuario o clúster del contexto.

   En este caso el usuario y el clúster pueden estar vacíos.

4. Determinar la información del clúster a utilizar. En este caso, puede o no haber información del clúster.
   Se construye cada pieza de la información del clúster con base en esta secuencia, el primer acierto se impone:

   1. Si es que existen, use el flag `--server`, `--certificate-authority`, `--insecure-skip-tls-verify` en la línea de comandos.
   2. Si existen atributos de información de clúster procedentes de los archivos kubeconfig fusionados, utilícelos.
   3. Falla si no existe la ubicación del servidor.

5. Determinar la información del usuario a utilizar. Cree información de usuario utilizando las mismas reglas que
   la información de clúster, con la excepción de permitir sólo un mecanismo de autenticación por usuario:

   1. Si es que existen, utilice el flag `--client-certificate`, `--client-key`, `--username`, `--password`, `--token` de la línea de comandos.
   2. Utilice los campos `user` de los archivos kubeconfig fusionados.
   3. Falla si hay dos mecanismos de autenticación contradictorios.

6. Si todavía falta información, utilice los valores predeterminados y solicite
   información de autenticación.

## Referencias de archivos

Las referencias, así también como, las rutas de un archivo kubeconfig son relativas a la ubicación del archivo kubeconfig.
Las referencias de un archivo en la línea de comandos son relativas al directorio actual de trabajo.
Dentro de `$HOME/.kube/config`, las rutas relativas se almacenan de manera relativa a la ubicación del archivo kubeconfig , al igual que las rutas absolutas
se almacenan absolutamente.



## {{% heading "whatsnext" %}}


* [Configurar el acceso a multiples Clústeres](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [`kubectl config`](/docs/reference/generated/kubectl/kubectl-commands#config)


