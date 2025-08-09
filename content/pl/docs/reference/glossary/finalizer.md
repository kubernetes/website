---
title: Finalizer
id: finalizer
date: 2021-07-07
full_link: /docs/concepts/overview/working-with-objects/finalizers/
short_description: >
  Klucz w przestrzeni nazw, który mówi Kubernetesowi, by poczekał z usunięciem obiektu,
  aż spełnione zostaną określone warunki.
aka: 
tags:
- fundamental
- operation
---
Finalizatory to klucze z przestrzenią nazw, które informują Kubernetesa, by
wstrzymał całkowite usunięcie zasobów oznaczonych do usunięcia, dopóki nie zostaną spełnione określone
warunki. Finalizery powiadamiają
{{<glossary_tooltip text="kontrolery" term_id="controller">}} o konieczności uprzątnięcia zasobów należących do usuwanego obiektu.

<!--more-->

Gdy poinstruujesz Kubernetesa, aby usunął obiekt, dla którego określono
finalizatory, interfejs API Kubernetesa oznacza obiekt jako przeznaczony do usunięcia,
wypełniając `.metadata.deletionTimestamp`, i zwraca kod statusu `202` (HTTP "Accepted").
Docelowy obiekt pozostaje w stanie terminalnym, podczas gdy warstwa sterująca lub inne
komponenty wykonują działania zdefiniowane przez finalizatory. Po zakończeniu tych
działań kontroler usuwa odpowiednie finalizatory z docelowego obiektu. Gdy pole
`metadata.finalizers` jest puste, Kubernetes uznaje fazę sprzątania za zakończoną i usuwa obiekt.

Możesz użyć finalizerów do kontrolowania {<glossary_tooltip text="automatycznego usuwania nieużywanych zasobów (ang. garbage collection))" term_
id="garbage-collection">}}. Na przykład, możesz zdefiniować
finalizator do wyczyszczenia powiązanych zasobów lub infrastruktury przed tym, jak kontroler usunie docelowy zasób.