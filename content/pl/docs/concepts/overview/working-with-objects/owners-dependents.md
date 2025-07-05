---
title: Właściciele i obiekty zależne
content_type: concept
weight: 90
---

<!-- overview -->

W Kubernetes, niektóre {{< glossary_tooltip text="obiekty" term_id="object" >}}
są *właścicielami* innych obiektów. Na przykład,
{{<glossary_tooltip text="ReplicaSet" term_id="replica-set">}} jest
właścicielem zestawu Podów. Te obiekty podległe są *zależnościami* ich właściciela.

Własność różni się od mechanizmu [etykiet i selektorów](/docs/concepts/overview/working-with-objects/labels/),
który również używany jest przez niektóre zasoby. Na
przykład, rozważmy Serwis, który tworzy obiekty `EndpointSlice`. Serwis używa
{{<glossary_tooltip text="etykiet" term_id="label">}}, aby umożliwić warstwie sterowania określenie,
które obiekty `EndpointSlice` są używane przez ten Serwis. Oprócz etykiet, każdy
`EndpointSlice` zarządzany w imieniu Serwisu ma referencje do właściciela. Referencje do
właściciela pomagają różnym częściom Kubernetesa unikać ingerowania w obiekty, którymi nie zarządzają.

## Referencje właściciela w specyfikacjach obiektów {#owner-references-in-object-specifications}

Obiekty zależne posiadają pole `metadata.ownerReferences`, które odnosi się do
obiektu właściciela. Prawidłowe odniesienie właściciela składa się z nazwy obiektu oraz
{{<glossary_tooltip text="UID" term_id="uid">}} w tym samym
{{<glossary_tooltip text="namespace" term_id="namespace">}} co obiekt zależny. Kubernetes automatycznie
ustawia wartość tego pola dla obiektów, które są zależne od innych obiektów, takich jak
ReplicaSets, DaemonSets, Deployments, Jobs i CronJobs oraz ReplicationControllers.
Możesz również skonfigurować te relacje ręcznie, zmieniając wartość tego pola. Jednak
zazwyczaj nie jest to konieczne, ponieważ Kubernetes może automatycznie zarządzać tymi relacjami.

Obiekty zależne mają również pole `ownerReferences.blockOwnerDeletion`,
które przyjmuje wartość logiczną i kontroluje, czy konkretne zależności
mogą zablokować usunięcie obiektu nadrzędnego w procesie oczyszczania (ang. garbage
collection). Kubernetes automatycznie ustawia to pole na `true`, jeśli
{{<glossary_tooltip text="kontroler" term_id="controller">}} (na
przykład kontroler Deployment) ustawia wartość pola
`metadata.ownerReferences`. Możesz także ręcznie ustawić wartość pola `blockOwnerDeletion`, aby kontrolować,
które obiekty zależne blokują mechanizm czyszczenia (garbage collection).

Kontroler wejścia (ang. admission controller) Kubernetesa zarządza dostępem użytkowników
do zmiany tego pola dla zależnych zasobów, na podstawie uprawnień do usuwania właściciela.
Chroni to przed opóźnianiem usuwania obiektów nadrzędnych przez nieuprawnionych użytkowników.

{{< note >}}
Referencje do właścicieli z innych przestrzeni nazw są celowo niedozwolone. Zasoby
zależne w przestrzeni nazw mogą wskazywać właścicieli o zasięgu klastra lub tej samej
przestrzeni nazw. Właściciel znajdujący się w przestrzeni nazw **musi** być w tej samej
przestrzeni co zasób zależny. Jeśli nie jest, referencja do właściciela jest traktowana jako
nieistniejąca, a zależny obiekt może zostać usunięty po zweryfikowaniu braku wszystkich właścicieli.

Zasoby zależne o zasięgu klastra mogą wskazywać wyłącznie właścicieli również o zasięgu klastra. W
wersji 1.20+ jeżeli taki zasób zależny wskaże właściciela typu namespaced, referencja ta jest traktowana
jako nierozwiązywalna, co uniemożliwia jej usunięcie przez mechanizm garbage collection.

W wersji v1.20+, jeśli mechanizm czyszczenia wykryje nieprawidłowe `ownerReference` między
przestrzeniami nazw lub zależność o zasięgu klastra z `ownerReference` odnoszącym się do rodzaju
nazwanej przestrzeni, zostanie zgłoszone ostrzeżenie typu Event z powodem
`OwnerRefInvalidNamespace` oraz `involvedObject` wskazującym na nieprawidłową zależność. Możesz sprawdzić tego
rodzaju zdarzenie, uruchamiając `kubectl get events -A --field-selector=reason=OwnerRefInvalidNamespace`.
{{< /note >}}

## Własność i finalizatory {#ownership-and-finalizers}

Gdy polecisz Kubernetesowi usunięcie zasobu, serwer API pozwala kontrolerowi
zarządzającemu przetworzyć wszelkie [zasady finalizatora](/docs/concepts/overview/working-with-objects/finalizers/)
dla tego zasobu. {{<glossary_tooltip text="Finalizatory" term_id="finalizer">}}
zapobiegają przypadkowemu usunięciu zasobów, które klaster może
wciąż potrzebować do prawidłowego funkcjonowania. Na przykład, jeśli spróbujesz usunąć
[PersistentVolume](/docs/concepts/storage/persistent-volumes/), który jest nadal
używany przez Pod, usunięcie nie nastąpi natychmiast, ponieważ `PersistentVolume` ma na
sobie finalizator `kubernetes.io/pv-protection`. Zamiast tego,
[volume](/docs/concepts/storage/volumes/) pozostaje w statusie `Terminating` do momentu, gdy Kubernetes
usunie finalizator, co następuje dopiero wtedy, gdy `PersistentVolume` nie jest już powiązany z Podem. 

Kubernetes dodaje także finalizatory do zasobu właściciela, gdy używasz [kaskadowego usuwania w trybie pierwszoplanowym lub osieroconym](/docs/concepts/architecture/garbage-collection/#cascading-deletion).
W
przypadku usuwania
pierwszoplanowego, dodaje finalizator `foreground`, tak
aby kontroler musiał usunąć zasoby zależne, które również mają
`ownerReferences.blockOwnerDeletion=true` przed usunięciem właściciela. Jeśli
określisz politykę usuwania osieroconego, Kubernetes dodaje finalizator
`orphan`, aby kontroler ignorował zasoby zależne po usunięciu obiektu właściciela. 

## {{% heading "whatsnext" %}}

* Dowiedz się więcej o [finalizatorach Kubernetesa](/docs/concepts/overview/working-with-objects/finalizers/).
* Dowiedz się więcej o mechaniźmie [garbage collection](/docs/concepts/architecture/garbage-collection).
* Zapoznaj się z dokumentacją API dotyczącą [metadanych obiektu](/docs/reference/kubernetes-api/common-definitions/object-meta/#System).
