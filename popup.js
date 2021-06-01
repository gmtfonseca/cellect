const select = document.getElementById('select')

select.addEventListener('click', async () => {
  console.log('works')
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  console.log(tab)
})
/* 
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

        const value = Number(this.innerHTML.trim())

        if (!Number.isNaN(value)) {
          if (selected.has(cellIdx)) {
            selected.delete(cellIdx)
          } else {
            selected.set(cellIdx, Number(this.innerHTML.trim()))
          }
          this.classList.toggle('selected')
          console.log(selected)
          totalElement.innerHTML = Array.from(selected.values()).reduce(
            (prev, curr) => prev + curr,
            0
          )
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
 */
