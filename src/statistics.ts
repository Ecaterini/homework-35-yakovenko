 import $ from 'jquery'
function createStatistics() {
let counter = 0
let isDestroyed = false
const listener = () => counter++

$(document).on('click', listener)

return {
  destroy() {
    $(document).off('click', listener)
    isDestroyed = true
    return 'Statistics fully destroyed'
  },
getClicks() {
if (isDestroyed) return 'Statistics is destroyed'
return counter
}
}
}
(window as any).statistics = createStatistics()