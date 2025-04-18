describe('Home Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/tmd').as('getTMD');
    cy.intercept('GET', '/api/test/status').as('getStatus');
    cy.intercept('GET', '/api/test/latest/all').as('getDryingData');
    cy.visit('http://localhost:3000');
    cy.wait(['@getTMD', '@getStatus', '@getDryingData']);
  });

  it('should display the page title and subtitle', () => {
    cy.contains('Time to Dry').should('exist');
    cy.contains('Your smart cloth drying assistant').should('exist');
  });

  it('should show online or offline status', () => {
    cy.get('body').then(($body) => {
      if ($body.text().includes('🟢 Online')) {
        cy.contains('🟢 Online').should('exist');
      } else {
        cy.contains('🔴 Offline').should('exist');
      }
    });
  });

  it('should display all weather cards', () => {
    cy.contains('Temperature').should('exist');
    cy.contains('Humidity').should('exist');
    cy.contains('Rainfall').should('exist');
    cy.contains('Drying Rating').should('exist');
  });

  it('should display humidity and temperature chart sections', () => {
    cy.contains('Humidity In vs Out').should('exist');
    cy.contains('Temperature In vs Out').should('exist');
  });

  it('should render chart SVG elements', () => {
    cy.get('svg').should('have.length.greaterThan', 1);
  });
});
