---
title: Organizar El Acceso A Los Clústeres Con Los Archivos kubeconfig
content_template: templates/concept
weight: 60
---

{{% capture overview %}}

<!-- Use kubeconfig files to organize information about clusters, users, namespaces, and
authentication mechanisms. The `kubectl` command-line tool uses kubeconfig files to
find the information it needs to choose a cluster and communicate with the API server
of a cluster. -->

Utilice los archivos kubeconfig para organizar la información acerca de los clústeres, los
usuarios, los namespaces y los mecanismos de autenticación. La herramienta de
línea de comandos `kubectl` utiliza los archivos kubeconfig para hallar la información que
necesita para escoger un clúster y comunicarse con el servidor API de un clúster.

<!-- {{< note >}}
A file that is used to configure access to clusters is called
a *kubeconfig file*. This is a generic way of referring to configuration files.
It does not mean that there is a file named `kubeconfig`.
{{< /note >}} -->

{{< note >}}
Un archivo utilizado para configurar el acceso a los clústeres se denomina
*archivo kubeconfig*. Esta es una forma genérica de referirse a los archivos de
configuración. Esto no significa que exista un archivo llamado `kubeconfig`.
{{< /note >}}

<!-- By default, `kubectl` looks for a file named `config` in the `$HOME/.kube` directory.
You can specify other kubeconfig files by setting the `KUBECONFIG` environment
variable or by setting the
[`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/) flag. -->

Por defecto, `kubectl` busca un archivo llamado `config` en el directorio `$HOME/.kube`.
Puedes especificar otros archivos kubeconfig mediante la configuración de la variable
de entorno `KUBECONFIG` o mediante la configuracion del flag
[`--kubeconfig`](/docs/reference/generated/kubectl/kubectl/).

<!-- For step-by-step instructions on creating and specifying kubeconfig files, see
[Configure Access to Multiple Clusters](/docs/tasks/access-application-cluster/configure-access-multiple-clusters). -->

Para obtener instrucciones paso a paso acerca de cómo crear y especificar los archivos kubeconfig,
consulte el recurso
[Configurar El Acceso A Múltiples Clústeres](/docs/tasks/access-application-cluster/configure-access-multiple-clusters).

{{% /capture %}}


{{% capture body %}}

<!-- ## Supporting multiple clusters, users, and authentication mechanisms -->

## Compatibilidad con múltiples clústeres, usuarios y mecanismos de autenticación

<!-- Suppose you have several clusters, and your users and components authenticate
in a variety of ways. For example: -->
Suponga que tiene diversos clústeres y que sus usuarios y componentes se autentican
de diversas maneras. Por ejemplo:

<!-- - A running kubelet might authenticate using certificates.
- A user might authenticate using tokens.
- Administrators might have sets of certificates that they provide to individual users. -->

- Un kubelet en ejecución se podría autenticar usando certificados.
- Un usuario se podría autenticar utilizando tokens.
- Los administradores podrían tener un conjuntos de certificados que sean suministrados a los usuarios individuales.

<!-- With kubeconfig files, you can organize your clusters, users, and namespaces.
You can also define contexts to quickly and easily switch between
clusters and namespaces. -->
Con los archivos kubeconfig puedes organizar tus clústers, usuarios y namespaces.
También puedes definir los diferentes contextos para realizar de forma rápida y
facil los intercambios entre clústers y namespaces.

<!-- ## Context -->

## Contexto

<!-- A *context* element in a kubeconfig file is used to group access parameters
under a convenient name. Each context has three parameters: cluster, namespace, and user.
By default, the `kubectl` command-line tool uses parameters from
the *current context* to communicate with the cluster. -->
Un elemento *context* en un archivo kubeconfig se utiliza para agrupar los parámetros de
acceso bajo un nombre apropiado. Cada contexto tiene tres parámetros: clúster, namespace
y usuario.
Por defecto, la herramienta de línea de comandos `kubectl` utiliza los parámetros del
*contexto actual* para comunicarse con el clúster.

<!-- To choose the current context: -->
Para seleccionar el contexto actual:
```
kubectl config use-context
```

<!-- ## The KUBECONFIG environment variable -->

## La variable de entorno KUBECONFIG

<!-- The `KUBECONFIG` environment variable holds a list of kubeconfig files.
For Linux and Mac, the list is colon-delimited. For Windows, the list
is semicolon-delimited. The `KUBECONFIG` environment variable is not
required. If the `KUBECONFIG` environment variable doesn't exist,
`kubectl` uses the default kubeconfig file, `$HOME/.kube/config`. -->
La variable de entorno `KUBECONFIG` contiene una lista de archivos kubeconfig.
En el caso de Linux y Mac, la lista está delimitada por dos puntos.  Si se trata
de Windows, la lista está delimitada por punto y coma. La variable de entorno
`KUBECONFIG` no es indispensable. Si la variable de entorno `KUBECONFIG` no existe,
`kubectl` utiliza el archivo kubeconfig por defecto `$HOME/.kube/config`.

<!-- If the `KUBECONFIG` environment variable does exist, `kubectl` uses
an effective configuration that is the result of merging the files
listed in the `KUBECONFIG` environment variable. -->
Si la variable de entorno `KUBECONFIG` existe, `kubectl` utiliza una
configuración eficiente que es el resultado de la fusión de los archivos
listados en la variable de entorno `KUBECONFIG`.

<!-- ## Merging kubeconfig files -->

## Fusionando archivos kubeconfig

<!-- To see your configuration, enter this command: -->
Para poder ver su configuración, escriba el siguiente comando:

```shell
kubectl config view
```

<!-- As described previously, the output might be from a single kubeconfig file,
or it might be the result of merging several kubeconfig files. -->
Como se ha descrito anteriormente, la respuesta de este comando podría resultar ser a partir de un único
archivo kubeconfig, o podría ser el resultado de la fusión de varios archivos kubeconfig.

<!-- Here are the rules that `kubectl` uses when it merges kubeconfig files: -->
A continuación se muestran las reglas que usa `kubectl` cuando fusiona archivos kubeconfig:

<!-- 1. If the `--kubeconfig` flag is set, use only the specified file. Do not merge.
   Only one instance of this flag is allowed. -->

1. Si el flag `--kubeconfig` está activado, utilice sólo el archivo especificado. No fusionar.
   Sólo se permite una instancia de este flag.

   <!-- Otherwise, if the `KUBECONFIG` environment variable is set, use it as a
   list of files that should be merged.
   Merge the files listed in the `KUBECONFIG` environment variable
   according to these rules: -->

   En caso contrario, si la variable de entorno `KUBECONFIG` está activada, úsela
   como un listado de los archivos que deben ser fusionados.
   Fusionar los archivos listados en la variable de entorno `KUBECONFIG` de acuerdo
   con estas reglas:

   <!-- * Ignore empty filenames. -->
   * Ignorar nombres de archivo vacíos.
   <!-- * Produce errors for files with content that cannot be deserialized. -->
   * Producir errores para archivos con contenido que no pueden ser deserializados.
   <!-- * The first file to set a particular value or map key wins. -->
   * El primer archivo que establezca un valor particular o una clave se impone.
   <!-- * Never change the value or map key. -->
   * Nunca cambie el valor o la clave.
     <!-- Example: Preserve the context of the first file to set `current-context`. -->
     Ejemplo: Conserva el contexto del primer archivo para configurar el `contexto actual`.
     <!-- Example: If two files specify a `red-user`, use only values from the first file's `red-user`.
     Even if the second file has non-conflicting entries under `red-user`, discard them. -->
     Ejemplo: Si dos archivos especifican un `red-user`, utilice sólo los valores del primer archivo.
     Incluso desechar el segundo archivo aunque tenga registros que no tengan conflictos.

   <!-- For an example of setting the `KUBECONFIG` environment variable, see -->
   Para obtener un ejemplo de configuración de la variable de entorno `KUBECONFIG`, consulte la sección
   [Configuración de la variable de entorno KUBECONFIG](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable).

   <!-- Otherwise, use the default kubeconfig file, `$HOME/.kube/config`, with no merging. -->
   En caso contrario, utilice el archivo kubeconfig predeterminado `$HOME/.kube/config`, sin fusionar.

<!-- 2. Determine the context to use based on the first hit in this chain:

    1. Use the `--context` command-line flag if it exists.
    2. Use the `current-context` from the merged kubeconfig files.

   An empty context is allowed at this point. -->

2. Determinar el contexto a utilizar en base al primer acierto en esta secuencia:

   1. Si es que existe, utilice el flag `---contexto` de la línea de comandos.
   2. Utilice el `contexto actual` procedente de los archivos kubeconfig fusionados.

   En este punto se permite un contexto vacío.

<!-- 3. Determine the cluster and user. At this point, there might or might not be a context.
   Determine the cluster and user based on the first hit in this chain,
   which is run twice: once for user and once for cluster:

   1. Use a command-line flag if it exists: `--user` or `--cluster`.
   2. If the context is non-empty, take the user or cluster from the context.

   The user and cluster can be empty at this point. -->
3. Determinar el clúster y el usuario. En este caso, puede o no haber un contexto.
   Determine el clúster y el usuario en base al primer acierto que se ejecute dos veces en
   esta secuencia: una para el usuario y otra para el clúster:

   1. Si es que existen, utilice el flag `--user` o `--cluster` de la línea de comandos.
   2. Si el contexto no está vacío, tome el usuario o clúster del contexto.

   En este caso el usuario y el clúster pueden estar vacíos.

<!-- 4. Determine the actual cluster information to use. At this point, there might or
   might not be cluster information.
   Build each piece of the cluster information based on this chain; the first hit wins:

   1. Use command line flags if they exist: `--server`, `--certificate-authority`, `--insecure-skip-tls-verify`.
   2. If any cluster information attributes exist from the merged kubeconfig files, use them.
   3. If there is no server location, fail.   -->
4. Determinar la información del clúster a utilizar. En este caso, puede o no haber información del cluster.
   Se construye cada pieza de la información del clúster en base a esta secuencia, el primer acierto se impone:

   1. Si es que existen, utilice el flag `--server`, `--certificate-authority`, `--insecure-skip-tls-verify` de la línea de comandos.
   2. Si existen atributos de información de clúster procedentes de los archivos kubeconfig fusionados, utilícelos.
   3. Fallar si no existe la ubicación del servidor.

<!-- 5. Determine the actual user information to use. Build user information using the same
   rules as cluster information, except allow only one authentication
   technique per user: -->
1. Determinar la información del usuario a utilizar. Cree información de usuario utilizando las mismas reglas que
   la información de clúster, con la excepción de permitir sólo un mecanismo de autenticación por usuario:

   <!-- 1. Use command line flags if they exist: `--client-certificate`, `--client-key`, `--username`, `--password`, `--token`.
   1. Use the `user` fields from the merged kubeconfig files.
   2. If there are two conflicting techniques, fail. -->
   3. Si es que existen, utilice el flag `--client-certificate`, `--client-key`, `--username`, `--password`, `--token` de la línea de comandos.
   4. Utilice los campos `user` de los archivos kubeconfig fusionados.
   5. Fallar si hay dos mecanismo de autenticación contradictorios.

<!-- 6. For any information still missing, use default values and potentially
   prompt for authentication information. -->
6. Si todavía falta alguna información, utilice los valores predeterminados y solicite
   información de autenticación.

<!-- ## File references -->

## Referencias de archivos

<!-- File and path references in a kubeconfig file are relative to the location of the kubeconfig file. -->
Las referencias, así también como, las rutas de un archivo kubeconfig son relativas a la ubicación del archivo kubeconfig.
<!-- File references on the command line are relative to the current working directory. -->
Las referencias de un archivo en la línea de comandos son relativas al directorio actual de trabajo.
<!-- In `$HOME/.kube/config`, relative paths are stored relatively, and absolute paths
are stored absolutely. -->
Dentro de `$HOME/.kube/config`, las rutas relativas se almacenan relativamente, y las rutas absolutas
se almacenan absolutamente.

{{% /capture %}}


{{% capture whatsnext %}}

* [Configurar El Acceso A Multiples Clústers](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [`kubectl config`](/docs/reference/generated/kubectl/kubectl-commands#config)

{{% /capture %}}
