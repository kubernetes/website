---
title: Kubernetes — co to jest?
description: >
 Kubernetes to przenośna, rozszerzalna platforma oprogramowania *open-source* służąca do zarządzania zadaniami i serwisami uruchamianymi w kontenerach. Umożliwia ich deklaratywną konfigurację i automatyzację. Kubernetes posiada duży i dynamicznie rozwijający się ekosystem. Szeroko dostępne są serwisy, wsparcie i dodatkowe narzędzia.
content_type: concept
weight: 10
card:
  name: concepts
  weight: 10
sitemap:
  priority: 0.9
---

<!-- overview -->
Na tej stronie znajdziesz ogólne informacje o Kubernetesie.


<!-- body -->
Kubernetes to przenośna, rozszerzalna platforma oprogramowania *open-source* służąca do zarządzania zadaniami i serwisami uruchamianymi w kontenerach, która umożliwia deklaratywną konfigurację i automatyzację. Ekosystem Kubernetesa jest duży i dynamicznie się rozwija. Serwisy Kubernetesa, wsparcie i narzędzia są szeroko dostępne.

Nazwa Kubernetes pochodzi z greki i oznacza sternika albo pilota. Google otworzyło projekt Kubernetes publicznie w 2014. Kubernetes korzysta z [piętnastoletniego doświadczenia Google w uruchamianiu wielkoskalowych serwisów](/blog/2015/04/borg-predecessor-to-kubernetes/) i łączy je z najlepszymi pomysłami i praktykami wypracowanymi przez społeczność.

## Trochę historii

Aby zrozumieć, dlaczego Kubernetes stał się taki przydatny, cofnijmy sie trochę w czasie.

![Jak zmieniały sie metody wdrożeń](/images/docs/Container_Evolution.svg)

**Era wdrożeń tradycyjnych:**
Na początku aplikacje uruchamiane były na fizycznych serwerach. Nie było możliwości separowania zasobów poszczególnych aplikacji, co prowadziło do problemów z alokacją zasobów. Przykładowo, kiedy wiele aplikacji jest uruchomionych na jednym fizycznym serwerze, część tych aplikacji może zużyć większość dostępnych zasobów, powodując spowolnienie działania innych. Rozwiązaniem tego problemu mogło być uruchamianie każdej aplikacji na osobnej maszynie. Niestety, takie podejście ograniczało skalowanie, ponieważ większość zasobów nie była w pełni wykorzystywana, a utrzymanie wielu fizycznych maszyn było kosztowne.

**Era wdrożeń w środowiskach wirtualnych:**  
Jako rozwiązanie zaproponowano wirtualizację, która umożliwiała uruchamianie wielu maszyn wirtualnych (VM) na jednym procesorze fizycznego serwera. Wirtualizacja pozwalała izolować aplikacje pomiędzy maszynami wirtualnymi i osiągnąć pewien poziom bezpieczeństwa, jako że informacje związane z jedną aplikacją nie były w łatwy sposób dostępne dla pozostałych.

Wirtualizacja pozwala lepiej wykorzystywać zasoby fizycznego serwera i lepiej skalować, ponieważ aplikacje mogą być łatwo dodawane oraz aktualizowane, pozwala ograniczyć koszty sprzętu oraz ma wiele innych zalet. Za pomocą wirtualizacji można udostępnić wybrane zasoby fizyczne jako klaster maszyn wirtualnych "wielokrotnego użytku".

Każda maszyna wirtualna jest pełną maszyną zawierającą własny system operacyjny pracujący na zwirtualizowanej warstwie sprzętowej.

**Era wdrożeń w kontenerach:**
Kontenery działają w sposób zbliżony do maszyn wirtualnych, ale mają mniejszy stopnień wzajemnej izolacji, współdzieląc ten sam system operacyjny. Kontenery określane są mianem "lekkich". Podobnie, jak maszyna wirtualna, kontener posiada własny system plików, udział w zasobach procesora, pamięć, przestrzeń procesów itd. Ponieważ kontenery nie są związane z leżącymi poniżej warstwami infrastruktury, mogą być łatwiej przenoszone pomiędzy chmurami i różnymi dystrybucjami systemu operacyjnego.

Kontenery zyskały popularność ze względu na swoje zalety, takie jak:

* Szybkość i elastyczność w tworzeniu i instalacji aplikacji: obraz kontenera buduje się łatwiej niż obraz VM.
* Ułatwienie ciągłego rozwoju, integracji oraz wdrażania aplikacji (*Continuous development, integration, and deployment*): obrazy kontenerów mogą być budowane w sposób wiarygodny i częsty. Wycofywanie zmian jest skuteczne i szybkie (ponieważ obrazy są niezmienne).
* Rozdzielenie zadań *Dev* i *Ops*: obrazy kontenerów powstają w fazie *build/release*, oddzielając w ten sposób aplikacje od infrastruktury.
* Obserwowalność obejmuje nie tylko informacje i metryki z poziomu systemu operacyjnego, ale także poprawność działania samej aplikacji i inne sygnały.
* Spójność środowiska na etapach rozwoju oprogramowania, testowania i działania w trybie produkcyjnym: działa w ten sam sposób na laptopie i w chmurze.
* Możliwość przenoszenia pomiędzy systemami operacyjnymi i platformami chmurowymi: Ubuntu, RHEL, CoreOS, prywatnymi centrami danych, największymi dostawcami usług chmurowych czy gdziekolwiek indziej.
* Zarządzanie, które w centrum uwagi ma aplikacje: Poziom abstrakcji przeniesiony jest z warstwy systemu operacyjnego działającego na maszynie wirtualnej na poziom działania aplikacji, która działa na systemie operacyjnym używając zasobów logicznych.
* Luźno powiązane, rozproszone i elastyczne "swobodne" mikro serwisy: Aplikacje podzielone są na mniejsze, niezależne komponenty, które mogą być dynamicznie uruchamiane i zarządzane - nie jest to monolityczny system działający na jednej, dużej maszynie dedykowanej na wyłączność.
* Izolacja zasobów: wydajność aplikacji możliwa do przewidzenia
* Wykorzystanie zasobów: wysoka wydajność i upakowanie.

## Do czego potrzebujesz Kubernetesa i jakie są jego możliwości

Kontenery są dobrą metodą na opakowywanie i uruchamianie aplikacji. W środowisku produkcyjnym musisz zarządzać kontenerami, w których działają aplikacje i pilnować, aby nie było żadnych przerw w ich dostępności. Przykładowo, kiedy jeden z kontenerów przestaje działać, inny musi zostać uruchomiony. Nie byłoby prościej, aby takimi działaniami zajmował się jakiś system?

I tu właśnie Kubernetes przychodzi z pomocą! Kubernetes dostarcza środowisko do uruchamiania systemów rozproszonych o wysokiej niezawodności. Kubernetes obsługuje skalowanie aplikacji, przełączanie w sytuacjach awaryjnych, różne scenariusze wdrożeń itp. Przykładowo, Kubernetes w łatwy sposób może zarządzać wdrożeniem nowej wersji oprogramowania zgodnie z metodyką *canary deployments*.

Kubernetes zapewnia:

* **Detekcję nowych serwisów i balansowanie ruchu**
Kubernetes może udostępnić kontener używając nazwy DNS lub swojego własnego adresu IP. Jeśli ruch przychodzący do kontenera jest duży, Kubernetes może balansować obciążenie i przekierować ruch sieciowy, aby zapewnić stabilność całej instalacji.
* **Zarządzanie obsługą składowania danych**
Kubernetes umożliwia automatyczne montowanie systemów składowania danych dowolnego typu — lokalnych, od dostawców chmurowych i innych.
* **Automatyczne wdrożenia i wycofywanie zmian**
Możesz opisać oczekiwany stan instalacji za pomocą Kubernetesa, który zajmie się doprowadzeniem w sposób kontrolowany stanu faktycznego do stanu oczekiwanego. Przykładowo, przy pomocy Kubernetesa możesz zautomatyzować proces tworzenia nowych kontenerów na potrzeby swojego wdrożenia, usuwania istniejących i przejęcia zasobów przez nowe kontenery.
* **Automatyczne zarządzanie dostępnymi zasobami**
Twoim zadaniem jest dostarczenie klastra maszyn, które Kubernetes może wykorzystać do uruchamiania zadań w kontenerach. Określasz zapotrzebowanie na moc procesora i pamięć RAM dla każdego z kontenerów. Kubernetes rozmieszcza kontenery na maszynach w taki sposób, aby jak najlepiej wykorzystać dostarczone zasoby.
* **Samoczynne naprawianie**
Kubernetes restartuje kontenery, które przestały działać, wymienia je na nowe, wymusza wyłączenie kontenerów, które nie odpowiadają na określone zapytania o stan i nie rozgłasza powiadomień o ich dostępności tak długo, dopóki nie są gotowe do działania.
* **Zarządzanie informacjami poufnymi i konfiguracją**
Kubernetes pozwala składować i zarządzać informacjami poufnymi, takimi jak hasła, tokeny OAuth i klucze SSH. Informacje poufne i zawierające konfigurację aplikacji mogą być dostarczane i zmieniane bez konieczności ponownego budowania obrazu kontenerów i bez ujawniania poufnych danych w ogólnej konfiguracji oprogramowania.

## Czym Kubernetes nie jest

Kubernetes nie jest tradycyjnym, zawierającym wszystko systemem PaaS *(Platform as a Service)*. Ponieważ Kubernetes działa w warstwie kontenerów, a nie sprzętu, posiada różne funkcjonalności ogólnego zastosowania, wspólne dla innych rozwiązań PaaS, takie jak: instalacje *(deployments)*, skalowanie i balansowanie ruchu, umożliwiając użytkownikom integrację rozwiązań służących do logowania, monitoringu i ostrzegania. Co ważne, Kubernetes nie jest monolitem i domyślnie dostępne rozwiązania są opcjonalne i działają jako wtyczki. Kubernetes dostarcza elementy, z których może być zbudowana platforma deweloperska, ale pozostawia użytkownikowi wybór i elastyczność tam, gdzie jest to ważne.

Kubernetes:

* Nie ogranicza typów aplikacji, które są obsługiwane. Celem Kubernetesa jest możliwość obsługi bardzo różnorodnego typu zadań, włączając w to aplikacje bezstanowe (*stateless*), aplikacje ze stanem (*stateful*) i ogólne przetwarzanie danych. Jeśli jakaś aplikacja może działać w kontenerze, będzie doskonale sobie radzić w środowisku Kubernetesa.
* Nie oferuje wdrażania aplikacji wprost z kodu źródłowego i nie buduje aplikacji. Procesy Continuous Integration, Delivery, and Deployment (CI/CD) są zależne od kultury pracy organizacji, jej preferencji oraz wymagań technicznych.
* Nie dostarcza serwisów z warstwy aplikacyjnej, takich jak warstwy pośrednie *middleware* (np. broker wiadomości), środowiska analizy danych (np. Spark), bazy danych (np. MySQL), cache ani klastrowych systemów składowania danych (np. Ceph) jako usług wbudowanych. Te składniki mogą być uruchamiane na klastrze Kubernetes i udostępniane innym aplikacjom przez przenośne rozwiązania, takie jak [Open Service Broker](https://openservicebrokerapi.org/).
* Nie wymusza użycia konkretnych systemów zbierania logów, monitorowania ani ostrzegania. Niektóre z tych rozwiązań są udostępnione jako przykłady. Dostępne są też mechanizmy do gromadzenia i eksportowania różnych metryk.
* Nie dostarcza, ani nie wymusza języka/systemu używanego do konfiguracji (np. Jsonnet). Udostępnia API typu deklaratywnego, z którego można korzystać za pomocą różnych metod wykorzystujących deklaratywne specyfikacje.
* Nie zapewnia, ani nie wykorzystuje żadnego ogólnego systemu do zarządzania konfiguracją, utrzymaniem i samo-naprawianiem maszyn.
* Co więcej, nie jest zwykłym systemem planowania *(orchestration)*. W rzeczywistości, eliminuje konieczność orkiestracji. Zgodnie z definicją techniczną, orkiestracja to wykonywanie określonego ciągu zadań: najpierw A, potem B i następnie C. Dla kontrastu, Kubernetes składa się z wielu niezależnych, możliwych do złożenia procesów sterujących, których zadaniem jest doprowadzenie stanu faktycznego do stanu oczekiwanego. Nie ma znaczenia, w jaki sposób przechodzi się od A do C. Nie ma konieczności scentralizowanego zarządzania. Dzięki temu otrzymujemy system, który jest potężniejszy, bardziej odporny i niezawodny i dający więcej możliwości rozbudowy.

## {{% heading "whatsnext" %}}

* Dowiedz się o [komponentach Kubernetesa](/pl/docs/concepts/overview/components/)
* Jesteś gotowy [zacząć pracę](/pl/docs/setup/)?
