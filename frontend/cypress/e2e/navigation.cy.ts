describe('Sidebar Navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should navigate to Home page', () => {
    cy.contains('a', 'Home').click();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.contains('Time to Dry').should('be.visible');
  });

  it('should navigate to Statistics page', () => {
    cy.contains('a', 'Statistics').click();
    cy.url().should('include', '/statistics');
    cy.contains('Statistics').should('be.visible');
  });

  it('should navigate to Drying Table page', () => {
    cy.contains('a', 'Drying Table').click();
    cy.url().should('include', '/table');
    cy.contains('Drying Table').should('be.visible');
  });
});
