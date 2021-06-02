"use strict";

var cells = document.querySelectorAll('td');
var totalElement;
var selectKey = 17; //91;

var selectKeyDown = false;
var selected = new Map();
var hoveredCell = null;
fetch(chrome.runtime.getURL('/total.html')).then(function (r) {
  return r.text();
}).then(function (html) {
  document.body.insertAdjacentHTML('beforeend', html);
  totalElement = document.getElementById('total');
});

window.onkeydown = function (e) {
  if (e.keyCode === selectKey) {
    selectKeyDown = true;
  }

  updateCursor();
};

window.onkeyup = function (e) {
  if (e.keyCode === selectKey) {
    selectKeyDown = false;
  }

  updateCursor();
};

window.onmouseover = function (e) {
  hoveredCell = e.target;
  updateCursor();
};

cells.forEach(function (cell) {
  cell.addEventListener('click', function () {
    if (selectKeyDown) {
      var row = cell.closest('tr').rowIndex - 1;
      var col = this.cellIndex;
      var cellIdx = "".concat(row, ":").concat(col);
      var valueFormatted = this.innerText.trim().replace(',', '@').replace('.', '').replace('@', '.');
      var value = Number(valueFormatted);

      if (!Number.isNaN(value)) {
        if (selected.has(cellIdx)) {
          selected["delete"](cellIdx);
        } else {
          selected.set(cellIdx, value);
        }

        this.classList.toggle('selected');
        var total = Array.from(selected.values()).reduce(function (prev, curr) {
          return prev + curr * 100;
        }, 0) / 100;

        if (total === 0) {
          totalElement.style.display = 'none';
        } else {
          totalElement.style.display = 'block';
        }

        totalFormatted = new Intl.NumberFormat('pt-BR').format(total);
        totalElement.innerText = totalFormatted;
      }
    } else {
      totalElement.innerText = '';
      totalElement.style.display = 'none';
    }
  }, false);
});

function updateCursor() {
  if (hoveredCell.tagName === 'TD' && selectKeyDown) {
    hoveredCell.style.cursor = 'pointer';
  } else {
    hoveredCell.style.cursor = 'default';
  }
}