---
approvers:
- chenopis
- abiogenesis-now
title: Standardized Glossary
noedit: true
---
<link href="/css/expander.css" rel="stylesheet">
<script src="/js/expander.js"></script>

<p>This glossary is intended to be a comprehensive, standardized list of Kubernetes terminology. It includes technical terms that are specific to K8s, as well as more general terms that provide useful context.</p>

<p>Click on the <a href="javascript:void(0)" class="no-underline">[+]</a> indicators below to get a longer explanation for any particular term.</p>

{% assign glossary_terms = site.data.glossary | where_exp: "term", "term.id != '_example'" %}

<ul>
{% for term in glossary_terms %}
<li>
<b>{{ term.name }}</b>
<br>
{% if term.formerly %}
Also known as: <i>{{ term.formerly | join: ", " }}</i>
<br>
{% endif %}
<span class="preview-text">{{ term.short-description | markdownify }} <a href="javascript:void(0)" class="click-controller no-underline" data-target="{{ term.id }}">[+]</a></span>
<br>
<div id="{{ term.id }}" class="hide">
{{ term.long-description | markdownify }}
</div>
</li>
{% endfor %}
</ul>
