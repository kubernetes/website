---
---
The following is a list of all pages for {{ page.version }}. We also have a [`sitemap.xml`](/sitemap.xml) file.

{% for page in site.pages %}
  {% if page.url contains page.version %}
  {% assign foundTOC=false %}
  {% assign pageTOC=false %}
  {% for thistoc in site.data[page.versionfilesafe].globals.tocs %}
    {% if foundTOC %}
    {% break %}
    {% else %}
    {% assign tree = site.data[page.versionfilesafe][thistoc].toc %}
    {% include tocsearch.html %}
    {% if foundTOC %}
      {% assign pageTOC = thistoc %}
    {% endif %}
    {% endif %}
  {% endfor %}
* {% if pageTOC %}**[{{ pageTOC | capitalize }}](/{{page.version}}/{%if pageTOC != "guides"%}{{pageTOC}}/{%endif%})**: {% endif %}[{% if page.title %}{{page.title}}{% else %}{{ page.url }}{% endif %}]({{ page.url }})
  {% endif %}
{% endfor %}