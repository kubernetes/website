---
approvers:
- chenopis
- abiogenesis-now
title: Standardized Glossary
noedit: true
default_active_tag: fundamental
---
<link href="/css/glossary.css" rel="stylesheet">
<script src="/js/glossary.js"></script>

<p>This glossary is intended to be a comprehensive, standardized list of Kubernetes terminology. It includes technical terms that are specific to K8s, as well as more general terms that provide useful context.</p>

<div id="tag-container">
<p>Filter terms according to their tags:</p>
<div class="tag-description invisible" id="placeholder">.</div>
{% for tag in site.data.canonical-tags %}
{% assign tag_info = tag[1] %}
<div class="tag-description hide" id="{{ tag_info.id | prepend: "tag-" | append: "-description" }}">
<i>{{ tag_info.description }}</i>
</div>
{% endfor %}

{% assign sorted_tags = site.data.canonical-tags | where_exp: "tag", "true" | sort: 'name' %}
{% for tag_info in sorted_tags %}

{% assign tag_state_class = "" %}

{% assign fullTagName = tag_info.id | prepend: "tag-" %}
<span id="{{ fullTagName }}" class="tag-option canonical-tag {{ tag_state_class }}" data-target="{{ fullTagName }}">
<a href="javascript:void(0)">{{ tag_info.name }}</a>
</span>
{% endfor %}
<span class="tag-option"><a id="select-all-tags" href="javascript:void(0)">Select all</a></span>
<span class="tag-option"><a id="deselect-all-tags" href="javascript:void(0)">Deselect all</a></span>
</div>

<p>Click on the <a href="javascript:void(0)" class="no-underline">[+]</a> indicators below to get a longer explanation for any particular term.</p>

{% assign glossary_terms = site.data.glossary | where_exp: "term", "term.id != '_example'" | sort_natural: 'name' %}

<ul>
{% for term in glossary_terms %}

{% assign tag_classes = term.tags | join: " tag-" | prepend: "tag-" %}

{% assign term_visibility_class = "hide" %}
{% assign show_count = 0 %}
{% assign term_identifier = term.id | prepend: 'term-' %}

<li class="{{ tag_classes }} {{ term_visibility_class }}" data-show-count="{{ show_count }}">
<div id="{{ term_identifier }}" class="term-anchor"></div>
<div>
<div class="term-name"><b>{{ term.name }}</b><a href="{{ term_identifier | prepend: '#' }}" class="permalink hide">LINK</a></div>
{% if term.aka %}
Also known as: <i>{{ term.aka | join: ", " }}</i>
<br>
{% endif %}

<span class="preview-text">{{ term.short-description | liquify | markdownify }} <a href="javascript:void(0)" class="click-controller no-underline" data-target="{{ term.id }}">[+]</a></span>
<div id="{{ term.id }}" class="hide">
{{ term.long-description | liquify | markdownify }}
</div>
</div>
</li>
{% endfor %}
</ul>
