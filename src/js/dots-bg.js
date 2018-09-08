function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
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

  MAP.each((i, map) => {
    const currentObj = $(map)
    const conteinerSize = {
      w: currentObj.outerWidth(true),
      h: currentObj.outerHeight(true),
    }
    let dotsHtml = ''

    const getRandomScheme = (pos, empty = false) => {
      const mod = empty ? ' daddy-dots--empty' : ''
      const schemeClass = empty ? schemas.empty : schemas.default
      const schemeClassRand = schemeClass[rand(1, schemeClass.length)]
      const rotate = rotateClasses[rand(0, rotateClasses.length)]
      const transitionDelay = rand(500, 1500)
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

      return `<div class="daddy-dots${rotate}${schemeClassRand}${mod} "${idString}style="top:${
        pos.y
      }px;left:${pos.x}px;transition-delay:
                            ${transitionDelay}ms; ">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>`
    }

    const appendDot = (pos) => {
      dotsHtml += getRandomScheme(pos)
    }

    const appendEmptyDot = (pos) => {
      dotsHtml += getRandomScheme(pos, 'empty')
    }

    const randVal = currentObj.closest('.d-bg').data('d')
    const randEmptyVal = currentObj.closest('.d-bg').data('d-empty')

    for (let i = 0; i < conteinerSize.h / elementSize; i++) {
      for (let r = 0; r < conteinerSize.w / elementSize; r++) {
        if (randEmptyVal && rand(1, randEmptyVal) === 1) {
          appendEmptyDot({
            x: -4 + r * elementSize,
            y: i * elementSize,
          })
        }
        if (randVal && rand(1, randVal) === 1) {
          appendDot({
            x: -4 + r * elementSize,
            y: i * elementSize,
          })
        }
      }
    }

    currentObj.html(dotsHtml)

    setTimeout(() => {
      currentObj.closest('.d-bg').addClass('inited')
    }, 300)
  })

  function changePosition(dot) {
    const currentObj = dot.closest('.d-bg').find('.daddy-bg-viewport')
    const conteinerSize = {
      w: currentObj.outerWidth(true),
      h: currentObj.outerHeight(true),
    }

    let randY = rand(0, conteinerSize.h)
    let randX = rand(0, conteinerSize.w)

    randY -= randY % elementSize
    randX -= randX % elementSize

    dot.css('opacity', 0)

    setTimeout(() => {
      dot.removeClass('d-rotate-90 d-rotate-180 d-rotate-270')
      const rotate = rotateClasses[rand(0, rotateClasses.length)].trim()
      if (rotate != '') dot.addClass(rotate)

      dot.css({ top: `${randY}px`, left: `${randX}px` })

      dot.css('opacity', 1)
    }, 2100)
  }
})
