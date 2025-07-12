---
title: Finalizatory (ang. Finalizers)
content_type: concept
weight: 80
---

<!-- overview -->

{{<glossary_definition term_id="finalizer" length="long">}}

Możesz użyć finalizatorów do kontrolowania {{<glossary_tooltip text="automatycznego usuwania nieużywanych zasobów (ang. garbage collection))" term_id="garbage-collection">}}
dla {{<glossary_tooltip text="obiektów" term_id="object">}} poprzez informowanie
{{<glossary_tooltip text="kontrolerów" term_id="controller">}} o wykonaniu określonych zadań porządkowych przed usunięciem docelowego zasobu.

Finalizatory zazwyczaj nie zawierają kodu do wykonania.
Zamiast tego są listą kluczy przypisanych do konkretnego zasobu, podobnie
jak adnotacje. Część finalizatorów jest
automatycznie dodawana przez Kubernetesa, ale można też zdefiniować własne.

## Jak działają finalizatory {#how-finalizers-work}

Gdy tworzysz zasób przy użyciu pliku manifestu, możesz określić finalizatory
w polu `metadata.finalizers`. Gdy podejmujesz
próbę usunięcia zasobu, serwer API obsługujący żądanie usunięcia
zauważa wartości w polu `finalizers` i wykonuje następujące czynności: 

  * Modyfikuje obiekt, dodając pole
    `metadata.deletionTimestamp` z czasem rozpoczęcia usuwania.
  * Zapobiega usunięciu obiektu, dopóki wszystkie elementy nie zostaną usunięte z pola `metadata.finalizers`.
  * Zwraca kod statusu `202` (HTTP "Zaakceptowano")

Kontroler zarządzający tym finalizatorem zauważa aktualizację obiektu ustawiającego
`metadata.deletionTimestamp`, co wskazuje, że zażądano usunięcia obiektu. Następnie
kontroler próbuje spełnić wymagania finalizatorów określonych dla tego zasobu. Za każdym
razem, gdy warunek finalizatora zostanie spełniony, kontroler usuwa ten klucz z pola
`finalizers` zasobu. Gdy pole `finalizers` zostanie opróżnione, obiekt z ustawionym polem
`deletionTimestamp` zostaje automatycznie usunięty. Możesz użyć finalizatorów, aby
zabezpieczyć się przed usuwaniem zasobów, które nie są objęte bezpośrednim zarządzaniem przez Kubernetes.

Przykładem finalizatora jest `kubernetes.io/pv-protection`, który
zapobiega przypadkowemu usunięciu obiektów typu `PersistentVolume`. Gdy
obiekt `PersistentVolume` jest używany przez Pod, Kubernetes dodaje
finalizator `pv-protection`. Jeśli spróbujesz usunąć `PersistentVolume`,
przechodzi on w status `Terminating`, ale kontroler nie może go usunąć, ponieważ
istnieje finalizator. Gdy Pod przestanie używać
`PersistentVolume`, Kubernetes usuwa finalizator `pv-protection`, a kontroler usuwa wolumin.

{{<note>}}
* Gdy `USUWASZ` obiekt, Kubernetes dodaje znacznik czasu usunięcia dla tego
  obiektu, a następnie natychmiast zaczyna ograniczać zmiany w polu `.metadata.finalizers` dla
  obiektu, który jest teraz w trakcie usuwania. Możesz usunąć istniejące
  finalizatory (usuwając wpis z listy `finalizers`), ale nie możesz dodać nowego
  finalizatora. Nie możesz również modyfikować `deletionTimestamp` dla obiektu po jego ustawieniu.

* Po złożeniu żądania usunięcia, nie można przywrócić tego obiektu.
  Jedynym sposobem jest jego usunięcie i utworzenie nowego, podobnego obiektu.
{{</note>}}

{{<note>}}
Własne finalizatory **muszą** mieć nazwę w postaci publicznie kwalifikowanej, np.
`example.com/finalizer-name`. Ten format jest wymagany - serwer API odrzuca zmiany, które nie spełniają tego warunku.
{{</note>}}

## Referencje do właściciela, etykiety i finalizatory {#owners-labels-finalizers}

Podobnie jak {{<glossary_tooltip text="etykiety" term_id="label">}},
[właściciele i zależne obiekty (ang. owners-dependents)](/docs/concepts/overview/working-with-objects/owners-dependents/) opisują
relacje między
obiektami w Kubernetesie, ale są używane do innego celu. Kiedy
{{<glossary_tooltip text="kontroler" term_id="controller">}} zarządza obiektami,
takimi jak Pody, używa etykiet do śledzenia zmian w grupach powiązanych
obiektów. Na przykład, gdy {{<glossary_tooltip text="Job" term_id="job">}} tworzy
jeden lub kilka Podów, kontroler Zadania (ang. Job) aplikuje
etykiety do tych podów i śledzi zmiany w dowolnych Podach w klastrze z tą samą etykietą.

Kontroler Zadania dodaje również *referencje do właściciela* do tych
Podów, wskazujące na Zadanie, które je utworzyło. Jeśli usuniesz Zadanie, gdy te
Pody są w trakcie działania, Kubernetes używa
_referencji do właściciela_ (a nie etykiet) do określenia, które Pody w klastrze wymagają czyszczenia.

Kubernetes przetwarza również finalizatory, gdy identyfikuje referencje
właściciela na zasobie przeznaczonym do usunięcia. 

W niektórych sytuacjach finalizatory mogą blokować usunięcie obiektów
zależnych, co może spowodować, że docelowy obiekt właściciela pozostanie przez
dłuższy czas, niż się tego spodziewano, bez pełnego usunięcia. W takich
przypadkach należy sprawdzić finalizatory i
_referencje do właścicieli_ w docelowych obiektach właściciela i zależnych, aby rozwiązać problem. 

{{<note>}}
W przypadkach, gdy obiekty utknęły w stanie usuwania, unikaj ręcznego
usuwania 'finalizatorów', aby umożliwić kontynuowanie procesu usuwania.
'Finalizatory' są zazwyczaj dodawane do zasobów z określonego powodu, dlatego ich
siłowe usunięcie może prowadzić do problemów w klastrze. Powinno się to robić
jedynie wtedy, gdy cel 'finalizatora' jest zrozumiany i został osiągnięty w
inny sposób (na przykład poprzez ręczne wyczyszczenie niektórych zależnych obiektów).
{{</note>}}

## {{% heading "whatsnext" %}}

* Przeczytaj [Using Finalizers to Control Deletion](/blog/2021/05/14/using-finalizers-to-control-deletion/)
  na blogu Kubernetesa.
