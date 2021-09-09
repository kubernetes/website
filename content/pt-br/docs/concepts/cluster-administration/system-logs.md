---
title: Logs de Sistema
content_type: concept
weight: 60
---

<!-- overview -->

Logs de componentes do sistema armazenam eventos que acontecem no cluster, sendo muito úteis para depuração. Seus níveis de detalhe podem ser ajustados para mais ou para menos. Podendo se ater, por exemplo, a mostrar apenas os erros que ocorrem no componente, ou chegando a mostrar cada passo de um evento. (Como acessos HTTP, mudanças no estado dos pods, ações dos controllers, ou decisões do scheduler).

<!-- body -->

## Klog

[Klog](https://github.com/kubernetes/klog) é a biblioteca de logs do Kubernetes. Responsável por gerar as mensagens de log para os componentes do sistema. 

Para mais informações acerca da sua configuração, veja a documentação da [ferramenta de linha de comando](https://kubernetes.io/docs/reference/command-line-tools-reference/). 

Um exemplo do formato padrão dos logs da biblioteca:
```
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

### Logs Estruturados

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{< warning >}}
A migração pro formato de logs estruturados é um processo em andamento. Nem todos os logs estão dessa forma na versão atual. Sendo assim, para realizar o processamento de arquivos de log, você também precisa lidar com logs não estruturados.

A formatação e serialização dos logs ainda estão sujeitas a alterações.
{{< /warning>}}

A estruturação dos logs trás uma estrutura uniforme para as mensagens de log, permitindo a extração programática de informações. Logs estruturados podem ser armazenados e processados com menos esforço e custo. Esse formato é totalmente retrocompatível e é habilitado por padrão.

Formato dos logs estruturados:

```ini
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

Exemplo:

```ini
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```


### Logs em formato JSON

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{<warning >}}
Algumas opções da biblioteca klog ainda não funcionam com os logs em formato JSON. Para ver uma lista completa de quais são estas, veja a documentação da [ferramenta de linha de comando](/docs/reference/command-line-tools-reference/).

Nem todos os logs estarão garantidamente em formato JSON (como por exemplo durante o início de processos). Sendo assim, se você pretende realizar o processamento dos logs, seu código deverá saber tratar também linhas que não são JSON.

O nome dos campos e a serialização JSON ainda estão sujeitos a mudanças.
{{< /warning >}}

A opção `--logging-format=json` muda o formato dos logs, do formato padrão da klog para JSON. Abaixo segue um exemplo de um log em formato JSON (identado):
```json
{
   "ts": 1580306777.04728,
   "v": 4,
   "msg": "Pod status updated",
   "pod":{
      "name": "nginx-1",
      "namespace": "default"
   },
   "status": "ready"
}
```

Chaves com significados especiais:
* `ts` - Data e hora no formato Unix (obrigatório, float)
* `v` - Nível de detalhe (obrigatório, int, padrão 0)
* `err` - Mensagem de erro (opcional, string)
* `msg` - Mensagem (obrigatório, string)

Lista dos componentes que suportam o formato JSON atualmente:
* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

### Limpeza dos Logs

{{< feature-state for_k8s_version="v1.20" state="alpha" >}}

{{<warning >}}
A funcionalidade de limpeza dos logs pode causar impactos significativos na performance, sendo portanto contraindicada em produção.
{{< /warning >}}

A opção `--experimental-logging-sanitization` habilita o filtro de limpeza dos logs.
Quando habilitado, esse filtro inspeciona todos os argumentos dos logs, procurando por campos contendo dados sensíveis (como senhas, chaves e tokens). Tais campos não serão expostos nas mensagens de log.

Lista dos componentes que suportam a limpeza de logs atualmente:
* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

{{< note >}}
O filtro de limpeza dos logs não impede a exposição de dados sensíveis nos logs das aplicações em execução.
{{< /note >}}

### Nível de detalhe dos logs

A opção `-v` controla o nível de detalhe dos logs. Um valor maior aumenta o número de eventos registrados, começando a registrar também os eventos menos importantes. Similarmente, um valor menor restringe os logs apenas aos eventos mais importantes. O valor padrão 0 registra apenas eventos críticos.

### Localização dos Logs

Existem dois tipos de componentes do sistema: aqueles que são executados em um contêiner e aqueles que não são. Por exemplo:

* O [Kubernetes scheduler](https://kubernetes.io/pt-br/docs/concepts/overview/components/#kube-scheduler) e o [kube-proxy](https://kubernetes.io/pt-br/docs/concepts/overview/components/#kube-proxy) são executados em um contêiner.
* O [kubelet](https://kubernetes.io/pt-br/docs/concepts/overview/components/#kubelet) e os [agentes de execução](https://kubernetes.io/pt-br/docs/concepts/overview/components/#container-runtime), como o Docker por exemplo, não são executados em contêineres.

Em máquinas com systemd, o kubelet e os agentes de execução gravam os logs no journald. 
Em outros casos, eles escrevem os logs em arquivos `.log` no diretório `/var/log`.
Já os componentes executados dentro de contêineres, sempre irão escrever os logs em arquivos `.log` 
no diretório `/var/log`, ignorando o mecanismo padrão de log.

De forma similar aos logs de contêiner, os logs de componentes do sistema no diretório `/var/log` devem ser rotacionados.
Nos clusters Kubernetes criados com o script `kube-up.sh`, a rotação dos logs é configurada pela ferramenta `logrotate`. Essa ferramenta rotaciona os logs diariamente 
ou quando o tamanho do arquivo excede 100MB.

## {{% heading "whatsnext" %}}

* Leia sobre [Arquitetura de Logs do Kubernetes](/pt-br/docs/concepts/cluster-administration/logging/)
* Leia sobre [Logs Estruturados](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
* Leia sobre [Convenções sobre os níveis de logs](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
