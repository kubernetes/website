---
title: Compartilhando o Namespace de Processo Entre Contêineres em um Pod
content_type: task
weight: 160
---

<!-- overview -->

Esta página mostra como configurar o compartilhamento de namespace de processos para um Pod. Quando
O compartilhamento de namespace de processos está ativado, os processos em um Contêiner são visíveis
para todos os outros Contêineres no mesmo Pod.

Você pode usar este recurso para configurar Contêineres de cooperação, como um manipulador de log 
`sidecar` de contêiner, ou para solucionar problemas em imagens de contêiner que não
incluem utilitários de depuração como um shell.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Configure um pod

O compartilhamento de namespace de processos é ativado usando o campo `shareProcessNamespace` da
`.spec` para um Pod. Por exemplo:

{{% codenew file="pods/share-process-namespace.yaml" %}}

1. Crie o pod `nginx` no seu cluster:

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/share-process-namespace.yaml
   ```

1. Conecte ao `shell` do contêiner e execute o comando `ps`:

   ```shell
   kubectl attach -it nginx -c shell
   ```

   Se você não vir um prompt de comando, tente pressionar Enter. No shell do Contêiner execute:

   ```shell
   # execute este comando dentro do "shell" do contêiner
   ps ax
   ```

   A saída é semelhante a esta:

   ```none
   PID   USER     TIME  COMMAND
       1 root      0:00 /pause
       8 root      0:00 nginx: master process nginx -g daemon off;
      14 101       0:00 nginx: worker process
      15 root      0:00 sh
      21 root      0:00 ps ax
   ```

Você pode sinalizar processos em outros Contêineres. Por exemplo, mandando `SIGHUP` ao
`nginx` para restartar o processo `worker`. Isso requer a capacidade `SYS_PTRACE`.

```shell
# execute este comando dentro do "shell" do contêiner
kill -HUP 8   # substitua o "8" pelo PID do processo principal do nginx, se necessário
ps ax
```

A saída é semelhante a esta:

```none
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    8 root      0:00 nginx: master process nginx -g daemon off;
   15 root      0:00 sh
   22 101       0:00 nginx: worker process
   23 root      0:00 ps ax
```

É até possível acessar o sistema de arquivos de outro contêiner usando o link
`/proc/$pid/root`.

```shell
# execute este comando dentro do "shell" do contêiner
# substitua o "8" pelo PID do processo Nginx, se necessario
head /proc/8/root/etc/nginx/nginx.conf
```

A saída é semelhante a esta:

```none
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
```

<!-- discussion -->

## Compreendendo o compartilhamento de namespace de processos

Os Pods compartilham muitos recursos, por isso faz sentido que eles também compartilhem um namespace de processo. 
Alguns Contêineres podem esperar serem isolados de outros, no entanto,
por isso, é importante entender as diferenças:

1. **O processo de contêiner não tem mais o PID 1.** Alguns Contêineres recusam
   começar sem o PID 1 (por exemplo, contêineres usando `systemd`) ou executando comandos 
   como `kill -HUP 1` para sinalizar o processo de Contêiner. Em pods com um
   namespace de processos compartilhado, `kill -HUP 1` irá sinalizar a `sandbox`
   (`/pause` no exemplo acima).

1. **Os processos são visíveis para outros contêineres no Pod.** Isso inclui todas
   informações visíveis em `/proc`, como senhas que foram passadas como argumentos
   ou variáveis de ambiente. Estes são protegidos apenas por permissões regulares do Unix.

1. **Sistema de arquivos do Contêiner são visíveis para outros Contêineres do pod através do link
   `/proc/$pid/root`.** Isso facilita a depuração, mas também significa
   que os segredos do sistema de arquivos, são protegidos apenas por permissões de sistema de arquivos.

