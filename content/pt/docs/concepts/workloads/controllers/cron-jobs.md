---
reviewers:
  - erictune
  - soltysh
  - janetkuo
title: CronJob
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.8" state="beta" >}}

Um _Cron Job_ cria [Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/) em um cronograma baseado em tempo.

Um objeto CronJob é como um arquivo _crontab_ (tabela cron). Executa um job periodicamente em um determinado horário, escrito no formato [Cron](https://en.wikipedia.org/wiki/Cron).

{{< note >}}
Todos os **CronJob** `schedule (horários):` são indicados em UTC.
{{< /note >}}

Ao criar o manifesto para um recurso CronJob, verifique se o nome que você fornece é um [nome de subdomínio DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) válido.
O nome não deve ter mais que 52 caracteres. Isso ocorre porque o controlador do CronJob anexará automaticamente 11 caracteres ao nome da tarefa fornecido e há uma restrição de que o comprimento máximo de um nome da tarefa não pode ultrapassar 63 caracteres.

Para obter instruções sobre como criar e trabalhar com tarefas cron, e para obter um exemplo de arquivo de especificação para uma tarefa cron, consulte [Executando tarefas automatizadas com tarefas cron](/docs/tasks/job/automated-tasks-with-cron-jobs).



<!-- body -->

## Limitações do Cron Job

Um trabalho cron cria um objeto de trabalho _about_ uma vez por tempo de execução de seu planejamento, Dizemos "about" porque há certas circunstâncias em que duas tarefas podem ser criadas ou nenhum trabalho pode ser criado. Tentamos torná-los únicos, mas não os impedimos completamente. Portanto, os trabalhos devem ser _idempotente_.

Se `startingDeadlineSeconds` estiver definido como um valor grande ou não definido (o padrão) e se `concurrencyPolicy` estiver definido como `Allow(Permitir)` os trabalhos sempre serão executados pelo menos uma vez.

Para cada CronJob, o CronJob {{< glossary_tooltip term_id="controller" >}} verifica quantas agendas faltou na duração, desde o último horário agendado até agora. Se houver mais de 100 agendamentos perdidos, ele não iniciará o trabalho e registrará o erro

```
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
```

É importante observar que, se o campo `startingDeadlineSeconds` estiver definido (não `nil`), o controlador contará quantas tarefas perdidas ocorreram a partir do valor de `startingDeadlineSeconds` até agora, e não do último horário programado até agora. Por exemplo, se `startingDeadlineSeconds` for `200`, o controlador contará quantas tarefas perdidas ocorreram nos últimos 200 segundos.

Um CronJob é contado como perdido se não tiver sido criado no horário agendado. Por exemplo, se `concurrencyPolicy` estiver definido como `Forbid` e um CronJob tiver sido tentado ser agendado quando havia um agendamento anterior ainda em execução, será contabilizado como perdido.

Por exemplo, suponha que um CronJob esteja definido para agendar um novo trabalho a cada minuto, começando em `08:30:00`, e seu campo `startingDeadlineSeconds` não esteja defindo. Se o controlador CronJob estiver baixo de `08:29:00` para `10:21:00`, o trabalho não será iniciado, pois o número de trabalhos perdidos que perderam o cronograma é maior que 100.

Para ilustrar ainda mais esse conceito, suponha que um CronJob esteja definido para agendar um novo trabalho a cada minuto, começando em `08:30:00`, e seu `startingDeadlineSeconds` está definido em 200 segundos. Se o controlador CronJob estiver inativo no mesmo período do exemplo anterior (`08:29:00` a `10:21:00`), o trabalho ainda será iniciado às 10:22:00. Isso acontece pois o controlador agora verifica quantos agendamentos perdidos ocorreram nos últimos 200 segundos (ou seja, 3 agendamentos perdidos), em vez do último horário agendado até agora.

O CronJob é responsável apenas pela criação de trabalhos que correspondem à sua programação, e o trabalho, por sua vez, é responsável pelo gerenciamento dos Pods que ele representa.


