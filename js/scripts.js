$(() => {
	// Ширина окна для ресайза
	WW = $(window).width()


	// Основной слайдер на главной
	if ($('.main_slider .swiper-container').length) {
		new Swiper('.main_slider .swiper-container', {
			loop: true,
			speed: 500,
			watchSlidesVisibility: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: 0,
			slidesPerView: 1,
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			}
		})
	}


	// Карусель товаров
	const productsSliders = []

	$('.products .swiper-container').each(function (i) {
		$(this).addClass('products_s' + i)

		let slides = $(this).find('.slide').length,
			options = {
				loop: false,
				speed: 500,
				simulateTouch: false,
				allowTouchMove: true,
				noSwiping: true,
				spaceBetween: 16,
				watchSlidesVisibility: true,
				slideActiveClass: 'active',
				slideVisibleClass: 'visible',
				pagination: {
					el: '.swiper-pagination',
					type: 'bullets',
					clickable: true,
					bulletActiveClass: 'active'
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev'
				},
				breakpoints: {
					0: {
						slidesPerView: 1
					},
					480: {
						slidesPerView: 2
					},
					1024: {
						slidesPerView: $(this).closest('.content').length ? 2 : 3
					},
					1272: {
						slidesPerView: $(this).closest('.content').length ? 3 : 4
					}
				},
				on: {
					init: swiper => {
						setTimeout(() => {
							productHeight($(this), $(swiper.$el).find('.product').length)
						})
					},
					resize: swiper => {
						setTimeout(() => {
							productHeight($(this), $(swiper.$el).find('.product').length)
						})
					}
				}
			}

		productsSliders.push(new Swiper('.products_s' + i, options))

		if (slides > productsSliders[i].params.slidesPerView) {
			options.loop = true
			options.simulateTouch = true
			options.allowTouchMove = true
			options.noSwiping = false

			productsSliders[i].destroy(true, true)
			productsSliders[i] = new Swiper('.products_s' + i, options)
		}
	})


	// Страница товара
	if ($('.product_info .images').length) {
		const productThumbs = new Swiper('.product_info .thumbs .swiper-container', {
			loop: false,
			speed: 500,
			watchSlidesVisibility: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			navigation: {
				nextEl: '.thumbs-swiper-button-next',
				prevEl: '.thumbs-swiper-button-prev'
			},
			slidesPerView: 3,
			spaceBetween: 10
		})

		new Swiper('.product_info .big .swiper-container', {
			loop: false,
			speed: 500,
			watchSlidesVisibility: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: 24,
			slidesPerView: 1,
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			},
			thumbs: {
				swiper: productThumbs
			}
		})
	}


	// Фиксация блока при прокрутке
	$('.sticky').stick_in_parent({
		offset_top: 20
	})


	// Боковая колонка - Ссылки
	$('aside .links .link > a.sub_link').click(function (e) {
		e.preventDefault()

		$(this).toggleClass('active').next().slideToggle(300)
	})

	$('aside .links .sub_links a.sub_link').click(function (e) {
		e.preventDefault()

		let parent = $(this).closest('.sub_links')

		if ($(this).hasClass('active')) {
			$(this).toggleClass('active').next().slideToggle(300)
		} else {
			parent.find('a.sub_link').removeClass('active')
			parent.find('.sub_links').slideUp(300)

			$(this).toggleClass('active').next().slideToggle(300)
		}
	})


	// Боковая колонка - Фильтр
	$('aside .mob_filter_btn').click(function (e) {
		e.preventDefault()

		$(this).toggleClass('active')
		$('aside .filter form').slideToggle(300)
	})

	$('aside .filter .name').click(function (e) {
		e.preventDefault()

		$(this).toggleClass('active').next().slideToggle(300)
	})


	$priceRange = $('.filter #price_range').ionRangeSlider({
		type: 'double',
		min: 0,
		max: 10000,
		from: 15,
		to: 1500,
		step: 5,
		onChange: data => {
			$('.filter .price_range input.from').val(data.from.toLocaleString())
			$('.filter .price_range input.to').val(data.to.toLocaleString())
		}
	}).data("ionRangeSlider")

	$('.filter .price_range .input').keyup(function () {
		$priceRange.update({
			from: parseFloat($('.filter .price_range input.from').val().replace(/\s+/g, '')),
			to: parseFloat($('.filter .price_range input.to').val().replace(/\s+/g, ''))
		})
	})


	$lengthRange = $('.filter #length_range').ionRangeSlider({
		type: 'double',
		min: 0,
		max: 10000,
		from: 15,
		to: 1500,
		step: 5,
		onChange: data => {
			$('.filter .length_range input.from').val(data.from.toLocaleString())
			$('.filter .length_range input.to').val(data.to.toLocaleString())
		}
	}).data("ionRangeSlider")

	$('.filter .length_range .input').keyup(function () {
		$lengthRange.update({
			from: parseFloat($('.filter .length_range input.from').val().replace(/\s+/g, '')),
			to: parseFloat($('.filter .length_range input.to').val().replace(/\s+/g, ''))
		})
	})


	$('.filter .reset_btn').click(function () {
		$('.filter input').removeAttr('checked')

		$priceRange.reset()
		$lengthRange.reset()
	})


	// Оформление заказа - Лимит символов
	$('.checkout_info .comment textarea').keydown(function (e) {
		let field = $(this)

		setTimeout(() => {
			let current = field.val().length,
				limit = parseInt($('.checkout_info .comment .count .total').text())

			current <= limit
				? $('.checkout_info .comment .count .current').text(field.val().length)
				: e.preventDefault()
		})
	})

	// Оформление заказа - Назад
	$('.checkout_info .btn.prev').click(function (e) {
		e.preventDefault()

		let parentStep = $(this).closest('.step')

		parentStep.removeClass('active').find('.data').slideUp(300)
		parentStep.prev().removeClass('finish').addClass('active').find('.data').slideDown(300)
	})

	// Оформление заказа - Вперёд
	$('.checkout_info .btn.next').click(function (e) {
		e.preventDefault()

		let parentStep = $(this).closest('.step')

		parentStep.removeClass('active').addClass('finish').find('.data').slideUp(300)
		parentStep.next().removeClass('finish').addClass('active').find('.data').slideDown(300)
	})

	// Оформление заказа - Изменить
	$('.checkout_info .edit_btn, .checkout_info .step .arrow').click(function (e) {
		e.preventDefault()

		let parentStep = $(this).closest('.step')

		if (parentStep.hasClass('active')) {
			$('.checkout_info .step').removeClass('active').find('.data').slideUp(300)
		} else {
			$('.checkout_info .step').removeClass('active').find('.data').slideUp(300)
			parentStep.removeClass('finish').addClass('active').find('.data').slideDown(300)
		}
	})


	// Изменение количества товара
	$('body').on('click', '.amount .minus', function (e) {
		e.preventDefault()

		const $parent = $(this).closest('.amount'),
			$input = $parent.find('.input'),
			inputVal = parseFloat($input.val()),
			minimum = parseFloat($input.data('minimum')),
			step = parseFloat($input.data('step')),
			unit = $input.data('unit')

		if (inputVal > minimum) $input.val(inputVal - step + unit)
	})

	$('body').on('click', '.amount .plus', function (e) {
		e.preventDefault()

		const $parent = $(this).closest('.amount'),
			$input = $parent.find('.input'),
			inputVal = parseFloat($input.val()),
			maximum = parseFloat($input.data('maximum')),
			step = parseFloat($input.data('step')),
			unit = $input.data('unit')

		if (inputVal < maximum) $input.val(inputVal + step + unit)
	})

	$('.amount .input').keydown(function () {
		const _self = $(this),
			maximum = parseInt(_self.data('maximum'))

		setTimeout(() => {
			if (_self.val() == '' || _self.val() == 0) _self.val(parseInt(_self.data('minimum')))
			if (_self.val() > maximum) _self.val(maximum)
		})
	})


	// Моб. меню
	$('.mob_header .mob_menu_btn').click((e) => {
		e.preventDefault()

		$('.mob_header .mob_menu_btn').addClass('active')
		$('body').addClass('menu_open')
		$('header').addClass('show')
		$('.overlay').fadeIn(300)
	})

	$('header > .close, .overlay').click((e) => {
		e.preventDefault()

		$('.mob_header .mob_menu_btn').removeClass('active')
		$('body').removeClass('menu_open')
		$('header').removeClass('show')
		$('.overlay').fadeOut(300)
	})


	$('header .menu .item a.catalog_link').click((e) => {
		e.preventDefault()

		$('header .data').addClass('offset')
	})

	$('header .front2 a.sub_link').click(function (e) {
		e.preventDefault()

		let linkIndex = $(this).closest('.link').index()

		$('header .front3 .links').hide()
		$('header .front3 .links').eq(linkIndex).show()

		$('header .data').addClass('offset2')
	})

	$('header .front3 a.sub_link').click(function (e) {
		e.preventDefault()

		let linkIndex = $(this).closest('.link').index()

		$('header .front4 .links').hide()
		$('header .front4 .links').eq(linkIndex).show()

		$('header .data').addClass('offset3')
	})


	$('header .front2 .back_btn').click((e) => {
		e.preventDefault()

		$('header .data').removeClass('offset')
	})

	$('header .front3 .back_btn').click((e) => {
		e.preventDefault()

		$('header .data').removeClass('offset2')
	})

	$('header .front4 .back_btn').click((e) => {
		e.preventDefault()

		$('header .data').removeClass('offset3')
	})


	// Отправка форм
	$('body').on('submit', 'form.custom_submit', function (e) {
		e.preventDefault()

		Fancybox.close()

		Fancybox.show([{
			src: '#success_modal',
			type: 'inline'
		}])
	})


	// Теги
	$('.tags .spoler_btn').click(function (e) {
		e.preventDefault()

		$(this).toggleClass('active')
		$('.tags .hide').slideToggle(200)
	})
})



$(window).on('resize', () => {
	if (typeof WW !== 'undefined' && WW != $(window).width()) {
		// Моб. версия
		if (!fiestResize) {
			$('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1')
			if ($(window).width() < 480) $('meta[name=viewport]').attr('content', 'width=480, user-scalable=no')

			fiestResize = true
		} else {
			fiestResize = false
		}


		// Перезапись ширины окна
		WW = $(window).width()
	}
})



// Выравнивание товаров
function productHeight(context, step) {
	let start = 0,
		finish = step,
		$products = context.find('.product')

	$products.find('.name').height('auto')

	$products.each(function () {
		setHeight($products.slice(start, finish).find('.name'))

		start = start + step
		finish = finish + step
	})
}