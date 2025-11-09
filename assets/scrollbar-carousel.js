// @ts-nocheck
class ScrollbarCarousel extends HTMLElement {
    connectedCallback() {
        const container = this.querySelector('[data-carousel-container]');
        const cards = this.querySelectorAll('[data-card]');

        const mobileLimit = parseInt(this.dataset.mobileLimit)
        const loadMoreBtn = this.querySelector('[data-load-more]');

        const productsPerRow = parseFloat(this.dataset.productsPerRow);
        const gap = parseFloat(this.dataset.desktopGap);
        const maxWidth = parseFloat(this.dataset.maxWidth);

        this.currentMobileVisible = mobileLimit;
        this.handleLayout(container, cards, loadMoreBtn, mobileLimit, productsPerRow, gap, maxWidth);

        window.addEventListener('resize', () => {
            this.handleLayout(container, cards, loadMoreBtn, mobileLimit, productsPerRow, gap, maxWidth);
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
  
    handleLayout(container, cards, loadMoreBtn, mobileLimit, productsPerRow, gap, maxWidth) {
        const isMobile = window.innerWidth < 1024;
        if (isMobile) {      
            if (!this.currentMobileVisible) {
                this.currentMobileVisible = mobileLimit;
            }
        
            cards.forEach((card, index) => {
                if (index < this.currentMobileVisible) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
                card.style.width = '';
                card.style.minWidth = '';
                card.style.maxWidth = '';
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

            this.calculateCardWidth(container, cards, productsPerRow, gap, maxWidth);
        }
    }

    calculateCardWidth(container, cards, productsPerRow, gap, maxWidth) {
        const availableWidth = this.clientWidth;
        const effectiveWidth = Math.min(maxWidth, availableWidth);
        const visibleGaps = Math.floor(productsPerRow);
        const totalGapsWidth = gap * visibleGaps;
        const cardWidth = (effectiveWidth - totalGapsWidth) / productsPerRow;
        
        const isInteger = productsPerRow % 1 === 0;
        const gapsInView = isInteger ? (productsPerRow - 1) : visibleGaps;
        const containerWidth = (cardWidth * productsPerRow) + (gap * gapsInView);
        
        cards.forEach(card => {
            card.style.width = `${cardWidth}px`;
            card.style.minWidth = `${cardWidth}px`;
            card.style.maxWidth = `${cardWidth}px`;
        });
    }
}

if (!customElements.get('scrollbar-carousel')) {
  customElements.define('scrollbar-carousel', ScrollbarCarousel);
}