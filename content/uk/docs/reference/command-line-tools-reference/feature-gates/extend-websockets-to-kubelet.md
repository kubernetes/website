---
title: ExtendWebSocketsToKubelet
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Коли ввімкнено ExtendWebSocketsToKubelet і вузол kubelet повідомляє про підтримку, потоки exec/attach/portforward проксіруються безпосередньо до kubelet, а не перетворюються чи тунелюються на сервері API. Важливо, що ті самі обробники перекладу та тунелювання потоків, що використовуються на сервері API, тепер налаштовані ідентично в kubelet — логіка просто переміщена ближче до середовища виконання контейнера. Ця функція залежить від переходу NodeDeclaredFeatures у бета-версію, щоб оголошення можливостей kubelet було надійним у промислових кластерах.
