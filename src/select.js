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

const plusKey = new Key(107)
const minusKey = new Key(109)

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
        if (plusKey.isDown()) {
          cell.classList.remove('plus-bg')
        } else {
          cell.classList.remove('minus-bg')
        }

        selectedCells.delete(cellIdx)
      } else {
        let signedValue
        if (plusKey.isDown()) {
          signedValue = value
          cell.classList.remove('minus-bg')
          cell.classList.add('plus-bg')
        } else {
          signedValue = -value
          cell.classList.remove('plus-bg')
          cell.classList.add('minus-bg')
        }

        selectedCells.set(cellIdx, signedValue)
      }

      const total =
        Array.from(selectedCells.values()).reduce(
          (prev, curr) => prev + curr * 100,
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
    totalElement.innerText = ''
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
