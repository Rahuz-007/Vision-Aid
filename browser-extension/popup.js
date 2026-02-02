document.addEventListener('DOMContentLoaded', () => {
    const filterToggle = document.getElementById('filterToggle');
    const filterType = document.getElementById('filterType');
    const inspectorToggle = document.getElementById('inspectorToggle');
    const resetBtn = document.getElementById('resetBtn');

    // Load saved settings
    chrome.storage.sync.get(['visionAid_filter', 'visionAid_type', 'visionAid_inspector'], (data) => {
        if (data.visionAid_filter) filterToggle.checked = data.visionAid_filter;
        if (data.visionAid_type) filterType.value = data.visionAid_type;
        if (data.visionAid_inspector) inspectorToggle.checked = data.visionAid_inspector;
    });

    // Event Listeners
    filterToggle.addEventListener('change', updateSettings);
    filterType.addEventListener('change', updateSettings);
    inspectorToggle.addEventListener('change', updateSettings);

    resetBtn.addEventListener('click', () => {
        filterToggle.checked = false;
        filterType.value = 'none';
        inspectorToggle.checked = false;
        updateSettings();
    });

    function updateSettings() {
        const settings = {
            filter: filterToggle.checked,
            type: filterType.value,
            inspector: inspectorToggle.checked
        };

        // Save to chrome storage
        chrome.storage.sync.set({
            'visionAid_filter': settings.filter,
            'visionAid_type': settings.type,
            'visionAid_inspector': settings.inspector
        });

        // Send message to active tab content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "updateSettings",
                    settings: settings
                });
            }
        });
    }
});
