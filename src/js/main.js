import './venodor/object-fit-images/ofi.min'
import 'bootstrap'
import './venodor/from-template/sticky-kit.min'
import './venodor/from-template/imagesloaded.pkgd.min'
import './venodor/from-template/jarallax.min'
import './venodor/from-template/jarallax-video.min'
import './venodor/from-template/photoswipe-ui-default.min'
import './venodor/from-template/photoswipe.min'
import './venodor/from-template/hammer.min'
import './venodor/from-template/jquery.nanoscroller'
import './venodor/from-template/jquery.form.min'
import './venodor/from-template/jquery.validate.min'
import { TweenMax } from 'gsap'
import 'gsap/ScrollToPlugin'
import './venodor/khaki'
import './venodor/khaki-init'
import './dots-bg'

$('body').removeClass('loading')

$('select.d-select').on('change', function () {
  $(this).removeClass('disabled-state')
})

$('form[action="/contact"]').on('reset', () => {
  dataLayer.push ({'event': 'formsend'});
})

$('form').on('reset', () => {
  $('select.d-select').addClass('disabled-state')
})
