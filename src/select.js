var cells = document.querySelectorAll('td')
var totalElement
var selectKey = 17 //91;
var selectKeyDown = false
var selected = new Map()
var hoveredCell = null

fetch(chrome.runtime.getURL('/total.html'))
  .then((r) => r.text())
  .then((html) => {
    document.body.insertAdjacentHTML('beforeend', html)
    totalElement = document.getElementById('total')
  })

window.onkeydown = function (e) {
  if (e.keyCode === selectKey) {
    selectKeyDown = true
  }
  updateCursor()
}

window.onkeyup = function (e) {
  if (e.keyCode === selectKey) {
    selectKeyDown = false
  }
  updateCursor()
}

window.onmouseover = function (e) {
  hoveredCell = e.target
  updateCursor()
}

cells.forEach((cell) => {
  cell.addEventListener(
    'click',
    function () {
      if (selectKeyDown) {
        const row = cell.closest('tr').rowIndex - 1
        const col = this.cellIndex
        const cellIdx = `${row}:${col}`

        const valueFormatted = this.innerText
          .trim()
          .replace(',', '@')
          .replace('.', '')
          .replace('@', '.')

        const value = Number(valueFormatted)

        if (!Number.isNaN(value)) {
          if (selected.has(cellIdx)) {
            selected.delete(cellIdx)
          } else {
            selected.set(cellIdx, value)
          }

          this.classList.toggle('selected')

          const total =
            Array.from(selected.values()).reduce(
              (prev, curr) => prev + curr * 100,
              0
            ) / 100

          if (total === 0) {
            totalElement.style.display = 'none'
          } else {
            totalElement.style.display = 'block'
          }

          totalFormatted = new Intl.NumberFormat('pt-BR').format(total)
          totalElement.innerText = totalFormatted
        }
      } else {
        totalElement.innerText = ''
        totalElement.style.display = 'none'
      }
    },
    false
  )
})

function updateCursor() {
  if (hoveredCell.tagName === 'TD' && selectKeyDown) {
    hoveredCell.style.cursor = 'pointer'
  } else {
    hoveredCell.style.cursor = 'default'
  }
}
