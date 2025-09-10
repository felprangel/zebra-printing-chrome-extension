// Notify current website about the existence of this chrome extension
function notifyExtension() {
    window.postMessage(
        {
            ZebraPrintingExtensionId: chrome.runtime.id,
            ZebraPrintingVersion: chrome.runtime.getManifest().version,
        },
        "*"
    );
}

notifyExtension();

// Listen to messages from the current website
window.addEventListener("message", function (event) {
    if (typeof event.data.type === "undefined") {
        return;
    }

    if (event.data.type == "zebra_print_label") {
        chrome.runtime.sendMessage(event.data);
        return;
    }

    if (event.data.type == "zebra_ping") {
        notifyExtension();
        return;
    }
});
