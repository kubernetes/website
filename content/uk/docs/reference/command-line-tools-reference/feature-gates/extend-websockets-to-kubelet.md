---
title: ExtendWebSocketsToKubelet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Коли ввімкнено ExtendWebSocketsToKubelet і вузол kubelet повідомляє про підтримку, потоки exec/attach/portforward проксіюються безпосередньо до kubelet, а не перетворюються чи тунелюються на API-сервері. Важливо, що ті самі обробники перетворення та тунелювання потоків, що використовуються на API-сервері, тепер налаштовані ідентично в kubelet — логіка просто переміщена ближче до середовища виконання контейнера. Ця функція залежить від переходу NodeDeclaredFeatures у бета-версію, щоб оголошення можливостей kubelet було надійним у промислових кластерах.
