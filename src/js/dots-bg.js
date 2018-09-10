/**
 * window size
 */
const $wnd = $(window)
const $doc = $(document)
const $body = $('body')
let wndW = 0
let wndH = 0
let docH = 0
function getWndSize() {
  exports.wndW = wndW = $wnd.width()
  exports.wndH = wndH = $wnd.height()
  exports.docH = docH = $doc.height()
}
getWndSize()
$wnd.on('resize load orientationchange', getWndSize)

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

let iterationCount = 0

function isInViewport($item, returnRect) {
  const rect = $item[0].getBoundingClientRect()
  let result = 1

  if (rect.right <= 0 || rect.left >= wndW) {
    result = 0
  } else if (rect.bottom < 0 && rect.top <= wndH) {
    result = 0
  } else {
    const beforeTopEnd = Math.max(0, rect.height + rect.top)
    const beforeBottomEnd = Math.max(0, rect.height - (rect.top + rect.height - wndH))
    const afterTop = Math.max(0, -rect.top)
    const beforeBottom = Math.max(0, rect.top + rect.height - wndH)
    if (rect.height < wndH) {
      result = 1 - (afterTop || beforeBottom) / rect.height
    } else if (beforeTopEnd <= wndH) {
      result = beforeTopEnd / wndH
    } else if (beforeBottomEnd <= wndH) {
      result = beforeBottomEnd / wndH
    }
    result = result < 0 ? 0 : result
  }
  if (returnRect) {
    return [result, rect]
  }
  return result
}

let dotId = 0

$(() => {
  const elementSize = 9 // circle
  const MAP = $('.d-bg .daddy-bg-viewport')
  const rotateClasses = [' ', ' d-rotate-90', ' d-rotate-180', ' d-rotate-270']
  const schemas = {
    default: [
      ' d-scheme-1',
      ' d-scheme-1',
      ' d-scheme-2',
      ' d-scheme-3',
      ' d-scheme-4',
      ' d-scheme-5',
      ' d-scheme-6',
    ],
    empty: [' d-scheme-1', ' d-scheme-2'],
  }

  function createBackground(obj) {
    const currentObj = obj
    const conteinerSize = {
      w: currentObj.outerWidth(true),
      h: currentObj.outerHeight(true),
    }
    let dotsHtml = ''
    currentObj.addClass('inited')
    const getRandomScheme = (viewport, empty = false) => {
      const mod = empty ? ' daddy-dots--empty' : ''
      const schemeClass = empty ? schemas.empty : schemas.default
      const schemeClassRand = schemeClass[rand(1, schemeClass.length)]
      const rotate = rotateClasses[rand(0, rotateClasses.length)]
      const transitionDelay = rand(300, 5000)
      let idString = ''

      if (!empty) {
        dotId += 1
        idString = ` id="daddy-dot-${dotId}" `
        let dot = `#daddy-dot-${dotId}`

        setInterval(() => {
          dot = $(dot)
          changePosition(dot)
        }, rand(6000, 30000))
      }

      const randPos = getRandomPosition(viewport)

      return `<div class="daddy-dots${rotate}${schemeClassRand}${mod} "${idString}style="top:${
        randPos.y
      }px;left:${randPos.x}px;transition-delay:
                            ${transitionDelay}ms; ">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>`
    }

    const appendDot = (viewport) => {
      dotsHtml += getRandomScheme(viewport)
    }

    const appendEmptyDot = (viewport) => {
      dotsHtml += getRandomScheme(viewport, 'empty')
    }

    const randVal = currentObj.closest('.d-bg').data('d')
    const randEmptyVal = currentObj.closest('.d-bg').data('d-empty')

    for (let i = 0; i < conteinerSize.h / elementSize; i += elementSize) {
      for (let r = 0; r < conteinerSize.w / elementSize; r += elementSize) {
        ++iterationCount
        if (randEmptyVal && rand(1, randEmptyVal) === 1) {
          appendEmptyDot(currentObj)
        }
        if (randVal && rand(1, randVal) === 1) {
          appendDot(currentObj)
        }

        //        console.log(iterationCount)
      }
    }

    currentObj.html(dotsHtml)

    setTimeout(() => {
      currentObj.closest('.d-bg').addClass('inited')
    }, 300)
  }

  function changePosition(dot) {
    const currentObj = dot.closest('.d-bg').find('.daddy-bg-viewport')
    const randPos = getRandomPosition(currentObj)

    dot.css('opacity', 0)

    setTimeout(() => {
      dot.removeClass('d-rotate-90 d-rotate-180 d-rotate-270')
      const rotate = rotateClasses[rand(0, rotateClasses.length)].trim()
      if (rotate != '') dot.addClass(rotate)

      dot.css({ top: `${randPos.y}px`, left: `${randPos.x}px` })

      dot.css('opacity', 1)
    }, 2100)
  }

  function getRandomPosition(viewport) {
    const conteinerSize = {
      w: viewport.outerWidth(true),
      h: viewport.outerHeight(true),
    }

    let y = rand(0, conteinerSize.h)
    let x = rand(0, conteinerSize.w)

    y -= y % elementSize
    x -= x % elementSize

    return {
      x,
      y,
    }
  }

  // init bg on scroll
  $(window).on('scroll load', () => {
    const bakgrounds = $('.d-bg .daddy-bg-viewport:not(.inited)')

    bakgrounds.each((i, el) => {
      if (isInViewport($(el)) > 0) {
        createBackground($(el))
      }
    })
  })
})

// portfolio active image change
function portfolioImageChange() {
  const $container = $('.d-portfolio-isotope')
  const $items = $container.find('.nk-portfolio-item')

  if ($container.length && $items.length) {
    setInterval(() => {
      $container.find('.nk-portfolio-item.active').removeClass('active')

      $items.eq(rand(0, $items.length)).addClass('active')
    }, 4000)
  }
}

portfolioImageChange()
