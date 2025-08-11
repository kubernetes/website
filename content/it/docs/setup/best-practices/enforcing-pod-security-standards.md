---
reviewers:
- tallclair
- liggitt
title: Applicazione degli Standard di Sicurezza dei Pod
weight: 40
---

<!-- overview -->

Questa pagina fornisce una panoramica delle migliori pratiche per l'applicazione degli
[Standard di Sicurezza dei Pod](/docs/concepts/security/pod-security-standards).

<!-- body -->

## Utilizzo del Controller di Ammissione Pod Security integrato

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

Il [Controller di Ammissione Pod Security](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
intende sostituire le PodSecurityPolicies deprecate.

### Configurare tutti i namespace del cluster

I namespace privi di qualsiasi configurazione dovrebbero essere considerati lacune significative nel modello di sicurezza del cluster. Si consiglia di analizzare i tipi di workload presenti in ciascun namespace e, facendo riferimento agli Standard di Sicurezza dei Pod, decidere un livello appropriato per ognuno di essi. I namespace senza etichette dovrebbero solo indicare che non sono ancora stati valutati.

Nel caso in cui tutti i workload in tutti i namespace abbiano gli stessi requisiti di sicurezza, forniamo un [esempio](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces) che illustra come applicare in blocco le etichette PodSecurity.

### Adottare il principio del privilegio minimo

In un mondo ideale, ogni pod in ogni namespace soddisferebbe i requisiti della policy `restricted`. Tuttavia, ciò non è sempre possibile o pratico, poiché alcuni workload richiedono privilegi elevati per motivi legittimi.

- I namespace che consentono workload `privileged` dovrebbero stabilire e applicare controlli di accesso appropriati.
- Per i workload che vengono eseguiti in questi namespace permissivi, mantenere una documentazione sui loro requisiti di sicurezza specifici. Se possibile, valutare come tali requisiti possano essere ulteriormente limitati.

### Adottare una strategia multi-modalità

Le modalità `audit` e `warn` del controller di ammissione Pod Security Standards consentono di raccogliere informazioni importanti sulla sicurezza dei pod senza interrompere i workload esistenti.

È buona pratica abilitare queste modalità per tutti i namespace, impostandole al livello _desiderato_ e alla versione che si vorrebbe infine `enforce`. Gli avvisi e le annotazioni di audit generati in questa fase possono guidare verso quello stato. Se si prevede che gli autori dei workload apportino modifiche per rientrare nel livello desiderato, abilitare la modalità `warn`. Se si prevede di utilizzare i log di audit per monitorare o guidare le modifiche, abilitare la modalità `audit`.

Quando la modalità `enforce` è impostata sul valore desiderato, queste modalità possono comunque essere utili in diversi modi:

- Impostando `warn` allo stesso livello di `enforce`, i client riceveranno avvisi quando tentano di creare Pod (o risorse che contengono template di Pod) che non superano la validazione. Questo li aiuterà ad aggiornare tali risorse per renderle conformi.
- Nei namespace che fissano `enforce` a una versione specifica non aggiornata, impostare le modalità `audit` e `warn` allo stesso livello di `enforce`, ma alla versione `latest`, offre visibilità sulle impostazioni consentite dalle versioni precedenti ma non più raccomandate secondo le best practice attuali.

## Alternative di terze parti

{{% thirdparty-content %}}

Altre alternative per l'applicazione dei profili di sicurezza sono in fase di sviluppo nell'ecosistema Kubernetes:

- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/).
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

La scelta tra una soluzione _integrata_ (ad esempio il controller di ammissione PodSecurity) e uno strumento di terze parti dipende interamente dalla propria situazione. Quando si valuta una soluzione, la fiducia nella propria supply chain è fondamentale. In definitiva, utilizzare _qualsiasi_ degli approcci sopra menzionati è meglio che non fare nulla.
