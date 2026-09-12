---
title: "Оголошення про створення робочої групи Checkpoint/Restore Working Group"
date: 2026-01-21T10:00:00-08:00
canonicalUrl: https://www.kubernetes.dev/blog/2026/01/21/introducing-checkpoint-restore-wg/
slug: introducing-checkpoint-restore-wg
author: >
  [Radostin Stoyanov](https://github.com/rst0git),
  [Viktória Spišaková](https://github.com/viktoriaas),
  [Adrian Reber](https://github.com/adrianreber),
  [Peter Hunt](https://github.com/haircommander)
translator: >
  [Андрій Головін](https:/github.com/Andygol)
---

Спільнота навколо Kubernetes включає в себе ряд спеціальних груп за інтересами (SIG) та робочих груп (WG), які сприяють обговоренню важливих тем між зацікавленими учасниками. Сьогодні ми хотіли б оголосити про створення нової робочої групи [Kubernetes Checkpoint Restore WG](https://github.com/kubernetes/community/tree/master/wg-checkpoint-restore), яка зосередиться на інтеграції функціоналу Checkpoint/Restore в Kubernetes.

## Мотивація та випадки використання {#motivation-and-use-cases}

Робоча група обговорює кілька сценаріїв високого рівня:

- Оптимізація використання ресурсів для інтерактивних робочих навантажень, таких як Jupyter notebook та чат-боти зі штучним інтелектом
- Прискорення запуску застосунків з тривалим часом ініціалізації, включаючи Java-застосунки та [служби LLM-інференції](https://doi.org/10.1145/3731599.3767354)
- Використання періодичних контрольних точок для забезпечення відмовостійкості довготривалих робочих навантажень, таких як розподілене навчання моделей
- Забезпечення [планування з урахуванням переривань](https://doi.org/10.1007/978-3-032-10507-3_3) з прозорою перевіркою/відновленням, що дозволяє витісняти Pod з нижчим пріоритетом, зберігаючи стан виконання застосунків
- Спрощення міграції Podʼів між вузлами для балансування навантаження та обслуговування без переривання робочих навантажень.
- Увімкнення перевірки для розслідування та аналізу інцидентів безпеки, таких як кібератаки, порушення безпеки даних та несанкціонований доступ.

У всіх цих сценаріях мета полягає в тому, щоб сприяти обговоренню ідей між спільнотою Kubernetes та екосистемою Checkpoint/Restore in Userspace (CRIU), яка постійно розширюється. Спільнота CRIU включає кілька проєктів, що підтримують ці випадки використання, зокрема:

- [CRIU](https://github.com/checkpoint-restore/criu) — інструмент для створення контрольних точок та відновлення запущених застосунків і контейнерів
- [checkpointctl](https://github.com/checkpoint-restore/checkpointctl) — інструмент для поглибленого аналізу контрольних точок контейнерів
- [criu-coordinator](https://github.com/checkpoint-restore/criu-coordinator) — інструмент для скоординованого створення контрольних точок/відновлення розподілених застосунків за допомогою CRIU
- [checkpoint-restore-operator](https://github.com/checkpoint-restore/checkpoint-restore-operator) — оператор Kubernetes для управління контрольними точками

Більше інформації про інтеграцію контрольних точок/відновлення з Kubernetes також доступно [тут](https://criu.org/Kubernetes).

## Повʼязані події {#related-events}

Після нашої презентації про [прозорі контрольні точки](https://sched.co/1tx7i) на KubeCon EU 2025, ми раді запросити вас до участі в нашій [панельній дискусії](https://sched.co/2CW6P) та [сесії AI + ML](https://sched.co/2CW7Z) на KubeCon + CloudNativeCon Europe 2026.

## Звʼяжіться з нами {#connect-with-us}

Якщо ви зацікавлені у співпраці з Kubernetes або CRIU, є кілька способів взяти участь:

- Приєднуйтесь до наших зустрічей щодругого четверга о 17:00 UTC за посиланням Zoom у наших [нотатках про зустрічі](https://docs.google.com/document/d/1ZMtHBibXfTw4cQerM4O4DJonzVs3W7Hp2K5ml6pTufs/edit); записи наших попередніх зустрічей доступні [тут](https://www.youtube.com/playlist?list=PL69nYSiGNLP1P7F40IMVL3NsNiIm5AGos).
- Поспілкуйтеся з нами на [Kubernetes Slack](http://slack.k8s.io/): [#wg-checkpoint-restore](https://kubernetes.slack.com/messages/wg-checkpoint-restore)
- Надішліть нам електронного листа на [адресу розсилки wg-checkpoint-restore](https://groups.google.com/a/kubernetes.io/g/wg-checkpoint-restore)
