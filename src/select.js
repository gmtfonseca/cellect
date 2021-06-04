const KEY_STATE = {
  Up: 0,
  Down: 1,
}

class Key {
  constructor(code) {
    this.code = code
    this.state = KEY_STATE.Up
  }

  isDown() {
    return this.state === KEY_STATE.Down
  }
}

const os = navigator.userAgent.indexOf('Win') != -1 ? 'Win' : 'Other'

const plusKeyCode = os === 'Win' ? 107 : 81
const minusKeyCode = os === 'Win' ? 109 : 87

const plusKey = new Key(plusKeyCode)
const minusKey = new Key(minusKeyCode)

let hoveredCell, totalElement

injectTotalHtml()

function injectTotalHtml() {
  fetch(chrome.runtime.getURL('/total.html'))
    .then((res) => res.text())
    .then((html) => {
      document.body.insertAdjacentHTML('beforeend', html)
      totalElement = document.getElementById('total')
    })
}

window.onkeydown = function (e) {
  updateKeyState(e.keyCode, KEY_STATE.Down)
  updateCursor()
}

window.onkeyup = function (e) {
  updateKeyState(e.keyCode, KEY_STATE.Up)
  updateCursor()
}

window.onmouseover = function (e) {
  hoveredCell = e.target
  updateCursor()
}

function updateKeyState(code, state) {
  switch (code) {
    case plusKey.code:
      plusKey.state = state
      break
    case minusKey.code:
      minusKey.state = state
      break
  }
}

function updateCursor() {
  if (hoveredCell) {
    if (
      hoveredCell.tagName === 'TD' &&
      (plusKey.isDown() || minusKey.isDown())
    ) {
      hoveredCell.style.cursor = 'pointer'
    } else {
      hoveredCell.style.cursor = 'default'
    }
  }
}

const selectedCells = new Map()
const cells = document.querySelectorAll('td')
cells.forEach((cell) =>
  cell.addEventListener('click', handleCellClick.bind(this, cell), false)
)

function handleCellClick(cell) {
  if (plusKey.isDown() || minusKey.isDown()) {
    const row = cell.closest('tr').rowIndex - 1
    const col = cell.cellIndex
    const cellIdx = `${row}:${col}`
    const value = parseNumber(cell.innerText)

    if (!Number.isNaN(value)) {
      if (selectedCells.has(cellIdx)) {
        if (cell.classList.contains('plus-bg') && plusKey.isDown()) {
          selectedCells.delete(cellIdx)
          cell.classList.remove('plus-bg')
        } else if (cell.classList.contains('minus-bg') && minusKey.isDown()) {
          selectedCells.delete(cellIdx)
          cell.classList.remove('minus-bg')
        } else {
          const signedValue = plusKey.isDown() ? value : -value
          selectedCells.set(cellIdx, { element: cell, value: signedValue })

          if (plusKey.isDown()) {
            cell.classList.remove('minus-bg')
            cell.classList.add('plus-bg')
          } else {
            cell.classList.remove('plus-bg')
            cell.classList.add('minus-bg')
          }
        }
      } else {
        const signedValue = plusKey.isDown() ? value : -value
        selectedCells.set(cellIdx, { element: cell, value: signedValue })

        if (plusKey.isDown()) {
          cell.classList.add('plus-bg')
        } else {
          cell.classList.add('minus-bg')
        }
      }

      const total =
        Array.from(selectedCells.values()).reduce(
          (prev, curr) => prev + curr.value * 100,
          0
        ) / 100

      if (total === 0) {
        totalElement.style.display = 'none'
      } else {
        totalElement.style.display = 'block'
      }

      const totalFormatted = new Intl.NumberFormat('pt-BR').format(total)
      totalElement.innerText = totalFormatted
    }
  } else {
    Array.from(selectedCells.values()).forEach((cell) => {
      cell.element.classList.remove('plus-bg')
      cell.element.classList.remove('minus-bg')
    })
    selectedCells.clear()
    totalElement.innerText = null
    totalElement.style.display = 'none'
  }
}

function parseNumber(str) {
  const brazilianStrNum = str
    .trim()
    .replace(',', '@')
    .replace('.', '')
    .replace('@', '.')

  return Number(brazilianStrNum)
}
