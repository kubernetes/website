<a href="#" id="feature-state-dialog-link" class="ui-state-default ui-corner-all"><span class="ui-icon ui-icon-newwin"></span>{{ dialog_title }}</a>
<div id="feature-state-dialog" class="ui-dialog-content" title="{{ dialog_title }}">
{{ dialog_content | markdownify }}
</div>
{% raw %}<script>
$(function(){
    
    $( "#feature-state-dialog" ).dialog({
        autoOpen: false,
        width: {% endraw %}{{ dialog_width | default: "600" }}{% raw %},
        buttons: [
            {
                text: "Ok",
                click: function() {
                    $( this ).dialog( "close" );
                }
            }
        ]
    });

    // Link to open the dialog
    $( "#feature-state-dialog-link" ).click(function( event ) {
        $( "#feature-state-dialog" ).dialog( "open" );
        event.preventDefault();
    });

});
</script>{% endraw %}
