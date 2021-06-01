var cells = document.querySelectorAll('td')
var totalElement = document.getElementById('total')
var selectKey = 17
var selectKeyDown = false
var selected = new Map()
var hoveredCell = null

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

        console.log({ row, col })
        const valueFormatted = this.innerText
          .trim()
          .replace(',', '@')
          .replace('.', '')
          .replace('@', '.')
        const value = Number(valueFormatted)
        console.log({ value })

        if (!Number.isNaN(value)) {
          if (selected.has(cellIdx)) {
            selected.delete(cellIdx)
          } else {
            selected.set(cellIdx, value)
          }
          this.classList.toggle('selected')

          const total = Array.from(selected.values()).reduce(
            (prev, curr) => prev + curr,
            0
          )
          // totalElement.innerHTML = total
          console.log({ total })
        }
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
