// @ts-nocheck
class FakeScrollBar extends HTMLElement {
  connectedCallback() {
    const target = document.querySelector(this.dataset.target);
    if (!target) {
        return console.warn('FakeScrollBar: target not found →', this.dataset.target);
    }

    const track = document.createElement('div');
    const thumb = document.createElement('button');
    thumb.type = 'button';
    track.appendChild(thumb);
    this.appendChild(track);

    track.classList.add(
        'relative',
        'rounded-full',
        'overflow-hidden',
        'mt-4',
        'mx-auto',
        'cursor-pointer',
        'bg-placeholder',
        'h-[4px]',
        'mb-[2px]',
        'hover:h-[6px]',
        'hover:mb-0',
        'active:h-[6px]',
        'active:mb-0',
        'transition-[height,margin]',
        'duration-100',
        'ease-in-out',
        'w-full'
    );

    thumb.classList.add(
        'absolute',
        'top-0',
        'left-0',
        'h-full',
        'bg-primary',
        'rounded-full',
        'w-[80px]',
        'translate-x-0',
        'transition-transform',
        'duration-100',
        'ease-linear',
        'transition-[height,margin]',
        'duration-100',
        'ease-in-out'
    );

    const minThumb = parseInt(this.dataset.minThumb) || 40;

    const updateThumb = () => {
        const total = target.scrollWidth;
        const visible = target.clientWidth;
        const trackW = track.clientWidth;
        if (total <= visible) {
            return (thumb.style.width = '0px');
        }

        const thumbW = Math.min(480, Math.max(minThumb, (visible / total) * trackW));
        const maxThumbX = trackW - thumbW;
        const thumbX = (target.scrollLeft / (total - visible)) * maxThumbX;

        thumb.style.width = `${thumbW}px`;
        thumb.style.transform = `translateX(${thumbX}px)`;
    }

    target.addEventListener('scroll', updateThumb);
    window.addEventListener('resize', updateThumb);

    let startX = 0, startScroll = 0, dragging = false;

    thumb.addEventListener('pointerdown', e => {
        dragging = true;
        startX = e.clientX;
        startScroll = target.scrollLeft;
        thumb.setPointerCapture(e.pointerId);
    });

    thumb.addEventListener('pointermove', e => {
        if (!dragging) return
        const delta = e.clientX - startX;
        const trackW = track.clientWidth;
        const thumbW = thumb.offsetWidth;
        const maxThumbX = trackW - thumbW;
        const scrollMax = target.scrollWidth - target.clientWidth;
        target.scrollLeft = startScroll + (delta / maxThumbX) * scrollMax;
    });

    thumb.addEventListener('pointerup', e => {
        dragging = false;
        thumb.releasePointerCapture(e.pointerId);
    });

    track.addEventListener('click', e => {
        if (e.target === thumb) return
        const rect = track.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const thumbW = thumb.offsetWidth;
        const trackW = rect.width;
        const maxThumbX = trackW - thumbW;
        const scrollMax = target.scrollWidth - target.clientWidth;
        const newX = Math.max(0, Math.min(maxThumbX, clickX - thumbW / 2));
        target.scrollLeft = (newX / maxThumbX) * scrollMax;
    })

   const normalizeWheelDelta = (event) => {
        let delta;
        if (event.deltaY !== 0) {
            delta = event.deltaY;
        } else {
            delta = event.deltaX;
        }

        if (event.deltaMode === 1) {
            delta *= 16;
        } else if (event.deltaMode === 2) {
            delta *= window.innerHeight;
        }

        return delta;
    };

    const onWheel = (event) => {
        if (event.ctrlKey || event.metaKey) return;

        const wantsHorizontalScroll =
            event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);

        if (!wantsHorizontalScroll) {
            return;
        }

        event.preventDefault();

        const rawDelta = Math.abs(event.deltaX) > 0
            ? event.deltaX
            : normalizeWheelDelta(event);

        const scrollSpeedFactor = 1;

        target.scrollLeft += rawDelta * scrollSpeedFactor;
    };

    target.addEventListener('wheel', onWheel, { passive: false });

    requestAnimationFrame(updateThumb);
  }
}

if (!customElements.get('fake-scroll-ba')) {
    customElements.define('fake-scroll-bar', FakeScrollBar)
}
