describe('Gold Rates Bar', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the gold rates bar', () => {
    cy.get('[data-testid="gold-rates-bar"]').should('be.visible');
  });

  it('shows rates for all 5 karats from the API', () => {
    cy.intercept('GET', '/api/gold-rates').as('goldRates');
    cy.visit('/');
    cy.wait('@goldRates').its('response.statusCode').should('eq', 200);

    const karats = ['24K', '22K', '21K', '18K', '14K'];
    karats.forEach((k) => {
      cy.get(`[data-testid="rate-${k}"]`).should('exist').and('contain', k);
    });
  });

  it('API /api/gold-rates returns valid JSON with rates', () => {
    cy.request('/api/gold-rates').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('rates');
      expect(res.body.rates).to.have.keys(['24K', '22K', '21K', '18K', '14K']);
      Object.values(res.body.rates).forEach((price) => {
        expect(price).to.be.a('number').and.greaterThan(0);
      });
    });
  });

  it('API /api/gold-rates/health returns ok with cache info', () => {
    cy.request('/api/gold-rates/health').then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('status', 'ok');
      expect(res.body).to.have.property('hasCachedRates');
    });
  });
});
