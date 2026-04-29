describe('Language Switcher', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('defaults to English with gold theme', () => {
    cy.get('[data-lang="en"]').should('have.class', 'active');
    cy.get('html').should('have.attr', 'data-theme', 'en');
    cy.get('html').should('have.attr', 'dir', 'ltr');
    cy.get('[data-testid="hero-headline"]').should('contain', 'Real Gold');
  });

  it('switches to Urdu — RTL layout and green theme', () => {
    cy.get('[data-lang="ur"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'ur');
    cy.get('html').should('have.attr', 'dir', 'rtl');
    cy.get('[data-testid="hero-headline"]').should('contain', 'اصل سونا');
  });

  it('switches to Hindi — saffron/navy theme, LTR', () => {
    cy.get('[data-lang="hi"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'hi');
    cy.get('html').should('have.attr', 'dir', 'ltr');
    cy.get('[data-testid="hero-headline"]').should('contain', 'असली सोना');
  });

  it('switches to Bengali — green/red theme, LTR', () => {
    cy.get('[data-lang="bn"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'bn');
    cy.get('html').should('have.attr', 'dir', 'ltr');
    cy.get('[data-testid="hero-headline"]').should('contain', 'আসল সোনা');
  });

  it('Arabic shows coming soon screen, not full page', () => {
    cy.get('[data-lang="ar"]').click();
    cy.get('html').should('have.attr', 'data-theme', 'ar');
    cy.get('html').should('have.attr', 'dir', 'rtl');
    cy.contains('النسخة العربية قريبًا').should('be.visible');
    cy.get('[data-testid="hero-headline"]').should('not.exist');
  });

  it('can return to English from Arabic via the switch button', () => {
    cy.get('[data-lang="ar"]').click();
    cy.contains('Switch to English').click();
    cy.get('[data-testid="hero-headline"]').should('contain', 'Real Gold');
  });

  it('FAQ questions translate when language changes', () => {
    cy.get('[data-testid="faq-section"]').should('contain', 'What karat should I buy?');
    cy.get('[data-lang="ur"]').click();
    cy.get('[data-testid="faq-section"]').should('contain', 'کونسا کیرٹ خریدنا چاہیے؟');
  });
});
