describe('Shop Cards', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders both shop cards', () => {
    cy.get('[data-testid="shop-card"]').should('have.length', 2);
  });

  it('each shop card has a WhatsApp button', () => {
    cy.get('[data-testid="shop-whatsapp-btn"]').should('have.length', 2);
    cy.get('[data-testid="shop-whatsapp-btn"]').first().should('have.attr', 'href').and('include', 'wa.me');
  });

  it('each shop card has a Directions button linking to Google Maps', () => {
    cy.get('[data-testid="shop-directions-btn"]').should('have.length', 2);
    cy.get('[data-testid="shop-directions-btn"]').first().should('have.attr', 'href').and('include', 'maps.google.com');
  });

  it('shop card text translates to Urdu', () => {
    cy.get('[data-lang="ur"]').click();
    cy.get('[data-testid="shops-section"]').should('contain', 'گولڈ سوک');
    cy.get('[data-testid="shop-whatsapp-btn"]').first().should('contain', 'واٹس ایپ');
  });

  it('nav Find Us button links to Google Maps', () => {
    cy.get('[data-testid="find-us-btn"]').should('have.attr', 'href').and('include', 'maps.google.com');
  });
});
