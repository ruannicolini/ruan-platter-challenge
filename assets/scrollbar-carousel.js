// @ts-nocheck
class ScrollbarCarousel extends HTMLElement {
    connectedCallback() {
        const container = this.querySelector('[data-carousel-container]');
        const cards = this.querySelectorAll('[data-card]');

        const mobileLimit = parseInt(this.dataset.mobileLimit)
        const loadMoreBtn = this.querySelector('[data-load-more]');

        const productsPerRow = parseFloat(this.dataset.productsPerRow);
        const gap = parseFloat(this.dataset.desktopGap);

        this.currentMobileVisible = mobileLimit;
        this.handleLayout(container, cards, loadMoreBtn, mobileLimit, productsPerRow, gap);

        window.addEventListener('resize', () => {
            this.handleLayout(container, cards, loadMoreBtn, mobileLimit, productsPerRow, gap);
        });

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.currentMobileVisible += mobileLimit;
                cards.forEach((card, index) => {
                    if (index < this.currentMobileVisible) {
                        card.classList.remove('hidden');
                    }
                });
                const hasHiddenCards = Array.from(cards).some(card => card.classList.contains('hidden'));
                if (!hasHiddenCards) {
                    loadMoreBtn.classList.add('hidden');
                }
            });
        }
    }
  
    handleLayout(container, cards, loadMoreBtn, mobileLimit, productsPerRow, gap) {
        const isMobile = window.innerWidth < 1024;
        if (isMobile) {      
            if (!this.currentMobileVisible) {
                this.currentMobileVisible = mobileLimit;
            }

            container.style.setProperty('--dynamic-product-card-width', '100%');
        
            cards.forEach((card, index) => {
                if (index < this.currentMobileVisible) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        
            if (loadMoreBtn) {
                const hasHiddenCards = Array.from(cards).some(card => card.classList.contains('hidden'));
                loadMoreBtn.style.display = hasHiddenCards ? 'inline-block' : 'none';
            }
        }else{
            cards.forEach(card => card.classList.remove('hidden'));

            if (loadMoreBtn) {
                loadMoreBtn.classList.add('hidden');
            }

            this.calculateCardWidth(container, cards, productsPerRow, gap);
        }
    }

    calculateCardWidth(container, cards, productsPerRow, gap) {
        const containerStyles = getComputedStyle(container);
        const paddingLeft = parseFloat(containerStyles.paddingLeft) || 0;
        const availableWidth = this.clientWidth;
        const visibleGaps = Math.floor(productsPerRow);
        const totalGapsWidth = gap * visibleGaps;
        const cardWidth = (availableWidth - paddingLeft - totalGapsWidth) / productsPerRow;
        container.style.setProperty('--dynamic-product-card-width', `${cardWidth}px`);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.classList.remove('no-transitions');
            });
        });
    }
}

if (!customElements.get('scrollbar-carousel')) {
  customElements.define('scrollbar-carousel', ScrollbarCarousel);
}