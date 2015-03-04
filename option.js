function initialize() {
    var staffNo = localStorage.getItem("staffNo");
    var sel = document.getElementById('staffNo');
    var opts = sel.options;
    for (var opt, j = 0; opt = opts[j]; j++) {
        if (opt.value == staffNo) {
            sel.selectedIndex = j;
            break;
        }
    }

    document.getElementById("staffNo").addEventListener("click", function () {
        localStorage.setItem("staffNo", document.getElementById("staffNo").value);
    });
}

window.addEventListener("load", initialize);

