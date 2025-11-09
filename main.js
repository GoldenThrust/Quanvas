if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("service-worker.js").then(function (registration) {
            console.log("ServiceWorker registration successful with scope: ", registration.scope);
        }, function (err) {
            console.log("ServiceWorker registration failed: ", err);
        });
    });
}

// Prevent right-click context menu
window.addEventListener("contextmenu", function (e) {
    e.preventDefault();
}, false);

const tools = document.getElementById("tools");
let selectedElement = tools.querySelector('#pen');

tools.addEventListener("click", (e) => {
    if (e.target.parentElement.id) {
        selectTool(e.target.parentElement);
    }
});

function selectTool(tool) {
    if (['pen', 'rect', 'line', 'circle', 'curve'].includes(tool.id)) {
        selectedElement.classList.remove('selected');
        tool.classList.add('selected');
        selectedElement = tool;
    }
}
