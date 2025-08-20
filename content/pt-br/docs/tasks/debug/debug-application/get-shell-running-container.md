---
title: Obter um Shell em um Contêiner em Execução
content_type: task
---

<!-- overview -->

Esta página mostra como usar `kubectl exec` para obter um shell em um contêiner em execução.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}




<!-- steps -->

## Obtendo um Shell em um Contêiner

Neste exercício, você cria um Pod que possui um contêiner. O contêiner
executa a imagem do nginx. Aqui está o arquivo de configuração para o Pod:

{{% code_sample file="application/shell-demo.yaml" %}}

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/application/shell-demo.yaml
```

Verifique se o contêiner está em execução:

```shell
kubectl get pod shell-demo
```

Obtenha um shell no contêiner em execução:

```shell
kubectl exec --stdin --tty shell-demo -- /bin/bash
```

{{< note >}}
O duplo traço (`--`) separa os argumentos que você deseja passar para o comando dos argumentos do `kubectl`.
{{< /note >}}

No seu shell, liste o diretório raiz:

```shell
# Execute isso dentro do contêiner
ls /
```

No seu shell, experimente outros comandos. Aqui estão alguns exemplos:

```shell
# Você pode executar esses comandos de exemplo dentro do contêiner
ls /
cat /proc/mounts
cat /proc/1/maps
apt-get update
apt-get install -y tcpdump
tcpdump
apt-get install -y lsof
lsof
apt-get install -y procps
ps aux
ps aux | grep nginx
```

## Escrevendo a página raiz para o nginx

Veja novamente o arquivo de configuração do seu Pod. O Pod
possui um volume `emptyDir`, e o contêiner monta esse volume
em `/usr/share/nginx/html`.

No seu shell, crie um arquivo `index.html` no diretório `/usr/share/nginx/html`:

```shell
# Execute isso dentro do contêiner
echo 'Hello shell demo' > /usr/share/nginx/html/index.html
```

No seu shell, envie uma solicitação GET para o servidor nginx:

```shell
# Execute isso no shell dentro do seu contêiner
apt-get update
apt-get install curl
curl http://localhost/
```

A saída exibe o texto que você escreveu no arquivo `index.html`:

```
Hello shell demo
```

Quando terminar de usar o shell, digite `exit`.

```shell
exit # Para sair do shell no contêiner
```

## Executando comandos individuais em um contêiner

Em uma janela de comando comum, fora do seu shell, liste as variáveis de ambiente no contêiner em execução:

```shell
kubectl exec shell-demo -- env
```

Experimente executar outros comandos. Aqui estão alguns exemplos:

```shell
kubectl exec shell-demo -- ps aux
kubectl exec shell-demo -- ls /
kubectl exec shell-demo -- cat /proc/1/mounts
```



<!-- discussion -->

## Abrindo um shell quando um Pod tem mais de um contêiner

Se um Pod tiver mais de um contêiner, use `--container` ou `-c` para
especificar um contêiner no comando `kubectl exec`. Por exemplo,
suponha que você tenha um Pod chamado `my-pod`, e esse Pod tenha dois contêineres
chamados _main-app_ e _helper-app_. O seguinte comando abriria um
shell no contêiner _main-app_.

```shell
kubectl exec -i -t my-pod --container main-app -- /bin/bash
```

{{< note >}}
As opções curtas `-i` e `-t` são equivalentes às opções longas `--stdin` e `--tty`
{{< /note >}}


## {{% heading "whatsnext" %}}


* Leia mais sobre [`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec)
