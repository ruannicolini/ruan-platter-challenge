// @ts-nocheck
class ScrollbarCarousel extends HTMLElement {
  connectedCallback() {
    const mobileLimit = parseInt(this.dataset.mobileLimit || '4');
    const cards = this.querySelectorAll('[data-card]');
    const loadMoreBtn = this.querySelector('[data-load-more]');
    const container = this.querySelector('[data-carousel-container]');

    this.currentMobileVisible = mobileLimit;
    this.handleLayout(container, cards, loadMoreBtn, mobileLimit);
    
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
  
  handleLayout(container, cards, loadMoreBtn, mobileLimit) {
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
        });
      
        if (loadMoreBtn) {
            const hasHiddenCards = Array.from(cards).some(card => card.classList.contains('hidden'));
            loadMoreBtn.style.display = hasHiddenCards ? 'inline-block' : 'none';
        }
    }
  }
}

if (!customElements.get('scrollbar-carousel')) {
  customElements.define('scrollbar-carousel', ScrollbarCarousel);
}