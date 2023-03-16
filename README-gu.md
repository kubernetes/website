# કુબરનેટ્સ દસ્તાવેજીકરણ

[![Build Status](https://api.travis-ci.org/kubernetes/website.svg?branch=master)](https://travis-ci.org/kubernetes/website)
[![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

સ્વાગત છે! આ રિપોઝિટોરી માં [કુબરનેટ્સ વેબસાઇટ અને દસ્તાવેજીકરણ](https://kubernetes.io/) બિલ્ડ કરવા માટે જરૂરી બધી સંપત્તિઓ છે। અમને ખૂબ આનંદ છે કે તમે યોગદાન આપવા માંગો છો!

## દસ્તાવેજોમાં યોગદાન આપો

તમે સ્ક્રીનના ઉપર-જમણા વિસ્તારમાં તમારા GitHub એકાઉન્ટમાં આ રિપોઝીટરીની નકલ બનાવી શકો છો **Fork** બટન પર ક્લિક કરો। આ copy ને *Fork* કહેવાય છે। તમારા fork ફેરફાર કર્યા પછી જ્યારે તમે તેને અમને મોકલવા માટે તૈયાર હોવ, તેથી તમારા fork આગળ વધો અને અમને નવા સુધારા વિશે કહો pull request બનાવો।

એકવાર તમારી pull request બની જાય, તેથી એક કુબરનેટ્સ સમીક્ષક ની સ્પષ્ટતા કરો, કાર્યક્ષમ પ્રતિસાદ પ્રદાન કરવાની જવાબદારી લેશે। pull request ના માલિક તરીકે, **કુબરનેટસ સમીક્ષક દ્વારા તમારી pull request આપેલા પ્રતિસાદને સંબોધવાની જવાબદારી તમારી છે।**

એ પણ નોંધ કરો કે તમારી પાસે એક કરતાં વધુ કુબરનેટ્સ સમીક્ષક હોઈ શકે છે જે તમને પ્રતિસાદ પ્રદાન કરે છે અથવા તમને કુબરનેટ્સ સમીક્ષક તરફથી પ્રતિસાદ પ્રાપ્ત થઈ શકે છે જે તમને પ્રતિસાદ આપવા માટે મૂળ રૂપે સોંપેલ એક કરતા અલગ છે.। વધુમાં, કેટલાક કિસ્સાઓમાં, તમારા સમીક્ષકોમાંથી એકની જરૂર પડી શકે છે. [કુબરનેટ્સ ટેક સમીક્ષક](https://github.com/kubernetes/website/wiki/Tech-reviewers) પાસેથી તકનીકી સમીક્ષા મેળવી શકે છે। સમીક્ષકો સમયસર પ્રતિસાદ આપવા માટે તેમના શ્રેષ્ઠ પ્રયાસો કરશે, પરંતુ પ્રતિભાવ સમય સંજોગોના આધારે બદલાઈ શકે છે.।

કુબરનેટ્સ દસ્તાવેજીકરણમાં યોગદાન આપવા વિશે વધુ માહિતી માટે, જુઓ:

* [ફાળો આપવાનું શરૂ કરો](https://kubernetes.io/docs/contribute/start/)
* [ફેરફારોને છેલ્લા પગલામાં ખસેડો](http://kubernetes.io/docs/contribute/intermediate#view-your-changes-locally)
* [પૃષ્ઠ નમૂનો](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [દસ્તાવેજીકરણ શૈલી માર્ગદર્શિકા](http://kubernetes.io/docs/contribute/style/style-guide/)
* [સ્થાનિકીકરણ કુબરનેટ્સ દસ્તાવેજીકરણ](https://kubernetes.io/docs/contribute/localization/)

## `README.md`'s સ્થાનિકીકરણ કુબરનેટ્સ દસ્તાવેજીકરણ

તમે ગુજરાતી સ્થાનિકીકરણના જાળવણીકારો સુધી પહોંચી શકો છો:

* Anubhav Vardhan ([Slack](https://kubernetes.slack.com/archives/D0261C0A3R8), [Twitter](https://twitter.com/anubha_v_ardhan), [GitHub](https://github.com/anubha-v-ardhan))
* Divya Mohan ([Slack](https://kubernetes.slack.com/archives/D027R7BE804), [Twitter](https://twitter.com/Divya_Mohan02), [GitHub](https://github.com/divya-mohan0209))
* Yashu Mittal ([Twitter](https://twitter.com/mittalyashu77), [GitHub](https://github.com/mittalyashu))

* [Slack channel](https://kubernetes.slack.com/messages/kubernetes-docs-hi)

## ડોકરનો ઉપયોગ કરીને સ્થાનિક રીતે સાઇટ ચલાવવી

સ્થાનિક રીતે કુબરનેટ્સ વેબસાઇટ ચલાવવાની ભલામણ કરેલ રીત એ છે કે વિશિષ્ટ [ડોકર](https://docker.com) image ડોકરનો ઉપયોગ કરવો, જેમાં [Hugo](https://gohugo.io) સ્થિર સાઇટ જનરેટર સમાવેશ થાય છે।

> જો તમે Windows પર છો, તો તમારે થોડા વધુ સાધનોની જરૂર પડશે જે તમે કરી શકો [Chocolatey](https://chocolatey.org) સાથે ઇન્સ્ટોલ કરી શકો છો।

> જો તમે ડોકર વિના સ્થાનિક રીતે વેબસાઇટ ચલાવવાનું પસંદ કરો છો, તો નીચે Hugo ઉપયોગ કરીને સ્થાનિક રીતે સાઇટ ચલાવવી જુઓ.।

જો તમે ડોકર વિના સ્થાનિક રીતે વેબસાઇટ ચલાવવાનું પસંદ કરો છો, તો નીચેનો પ્રયાસ કરો Hugo સ્થાનિક ઉપયોગ [સાઇટ ચલાવો](#hugo-का-उपयोग-करते-हुए-स्थानीय-रूप-से-साइट-चलाना) જુઓ કેવી રીતે।

જો તમે [ડોકર](https://www.docker.com/get-started) ચલાવી રહ્યા, તેથી સ્થાનિક રીતે `કુબરનેટ્સ-હ્યુગો` Docker image બનાવો:

```bash
make container-image
```

एक बार image बन जाने के बाद, आप साइट को स्थानीय रूप से चला सकते हैं:

```bash
make container-serve
```

સાઇટની મુલાકાત લેવા માટે, તમારું browser ને `http://localhost:1313` પર ખોલો। જેમ જેમ તમે source ફાઇલોમાં ફેરફાર કરો છો, Hugo સાઇટને અપડેટ કરે છે અને browser તાજું કરે છે।

## Hugo તેનો ઉપયોગ સ્થાનિક તરીકે થાય છે

Hugo માટે નિર્દેશો [આધિકારિક Hugo પ્રલેખન](https://gohugo.io/getting-started/installing/) देखें। [`Netlify.toml`](netlify.toml#L9) ફાઇલમાં `HUGO_VERSION` environment variable દ્વારા Hugo version કો install ખાતરી કરો।

જ્યારે તમે Hugo install કરો ત્યારે સ્થાનિક રીતે સાઇટ ચલાવવા માટે:

```bash
make serve
```

આ પોર્ટ `1313` પર Hugo સર્વર શરૂ કરશે। સાઇટની મુલાકાત લેવા માટે browser કો `http://localhost:1313` પર ખોલો। જેમ, તમે source ફાઇલોમાં ફેરફાર કરો, Hugo સાઇટને અપડેટ કરે છે અને એ browser ને refresh કરે છે।

## સમુદાય, ચર્ચા, યોગદાન અને સમર્થન

[Community page](http://kubernetes.io/community/) પર કુબરનેટીસ સમુદાય સાથે કેવી રીતે કનેક્ટ થવું તે જાણો।

તમે પ્રોજેક્ટના સ્થાનિકીકરણને ઍક્સેસ કરી શકો છો:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## આચારસંહિતા

કુબરનેટ્સ સમુદાયમાં ભાગીદારી [કુબરનેટ્સ આચારસંહિતા](https://github.com/cncf/foundation/blob/master/code-of-conduct-languages/hi.md) દ્વારા સંચાલિત થાય છે.

## આભાર!

કુબરનેટ્સ સમુદાયની ભાગીદારી પર ખીલે છે, અને અમે અમારી સાઇટ અને અમારા દસ્તાવેજીકરણમાં તમારા યોગદાનની ખરેખર પ્રશંસા કરીએ છીએ!

કુબરનેટ્સ તમારી સહભાગિતા પર આધાર રાખે છે, અને અમે અમારી સાઇટ અને દસ્તાવેજીકરણમાં તમારા યોગદાનની કદર કરીએ છીએ!
