const filterCriteria = {
    os: "",
    arch: ""
};

["os", "arch"].forEach(kind => {
    eventListener(kind);
});

function eventListener(kind) {
    let buttonGroupQuery = '#' + kind + '-filter' + ' > button';
    let buttonGroup = document.querySelectorAll(buttonGroupQuery);

    buttonGroup.forEach(button => {
        button.addEventListener('click', (evt) => {
            let buttonData = button.dataset[kind];

            if (filterCriteria[kind] === buttonData) {
                filterCriteria[kind] = "";
                button.classList.add('btn-outline-primary');
                button.classList.remove('btn-primary');
            } else {
                filterCriteria[kind] = buttonData;
                buttonGroup.forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-outline-primary');
                });
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-primary');
            }
            
            filterRows();
        });
    });
}

function filterRows() {
    const rows = document.querySelectorAll('#release-binary-table tbody tr');
    
    rows.forEach(row => {
        const os = row.classList.contains(filterCriteria.os) || filterCriteria.os === "";
        const arch = row.classList.contains(filterCriteria.arch) || filterCriteria.arch === "";
        
        if (os && arch) {
            row.classList.remove('hide');
        } else {
            row.classList.add('hide');
        }
    });
}

document.querySelectorAll("#release-binary-table .release-binary-copy").forEach(link => {
    link.addEventListener('click', (evt) => {
        evt.preventDefault();

        const hrefValue = link.getAttribute('href');
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = hrefValue;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        return false;
    });
});

// The page and script is loaded successfully
$( document ).ready(function() {

    // Remove the non-js content
    $('.downloadbinaries-nojs').hide();

    // Display the release binary content
    $('#download-kubernetes-data').show();
})