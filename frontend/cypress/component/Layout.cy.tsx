import React from 'react';
import Layout from '@/components/layout/Layout';

describe('Layout Component', () => {
  beforeEach(() => {
    // Mock the useRouter hook before each test
    cy.stub(require('next/router'), 'useRouter').returns({
      pathname: '/',
      route: '/',
      query: {},
      asPath: '/',
      basePath: '',
      isLocaleDomain: false,
      push: cy.stub(),
      replace: cy.stub(),
      reload: cy.stub(),
      back: cy.stub(),
      prefetch: cy.stub().resolves(),
      beforePopState: cy.stub(),
      events: {
        on: cy.stub(),
        off: cy.stub(),
        emit: cy.stub()
      },
      isFallback: false,
      isReady: true,
      isPreview: false
    });
    
    // Set up the viewport to test responsive behavior
    cy.viewport(1280, 800); // Desktop size initially
  });

  it('renders the sidebar on desktop view', () => {
    cy.mount(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    // Check that the desktop sidebar is visible
    cy.get('.hidden.md\\:flex').should('exist');
    
    // Verify the content is rendered
    cy.contains('div', 'Content').should('be.visible');
  });

  it('hides the sidebar on mobile view by default', () => {
    // Change viewport to mobile size
    cy.viewport(375, 667);
    
    cy.mount(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    // Mobile toggle button should be visible
    cy.get('button[type="button"] svg').first().should('be.visible');
    
    // Mobile sidebar should not be visible initially (should not exist in DOM)
    cy.get('.fixed.inset-0.z-40').should('not.exist');
  });

  it('shows the sidebar when toggle button is clicked on mobile', () => {
    // Change viewport to mobile size
    cy.viewport(375, 667);
    
    cy.mount(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    // Click the mobile toggle button
    cy.get('button[type="button"]').first().click();
    
    // Mobile sidebar should now be visible
    cy.get('.fixed.inset-0.z-40').should('exist');
    
    // Check that the navigation items are rendered in the mobile sidebar
    cy.get('.relative.flex-1').contains('Time to Dry').should('be.visible');
  });

  it('closes the sidebar when close button is clicked on mobile', () => {
    // Change viewport to mobile size
    cy.viewport(375, 667);
    
    cy.mount(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    // Click the mobile toggle button to open the sidebar
    cy.get('button[type="button"]').first().click();
    
    // Mobile sidebar should be visible
    cy.get('.fixed.inset-0.z-40').should('exist');
    
    // Click the close button
    cy.get('.absolute.top-0.right-0.-mr-12 button').click();
    
    // Wait for the sidebar to be removed from the DOM
    cy.get('.fixed.inset-0.z-40').should('not.exist');
  });

  it('closes the sidebar when clicking the overlay on mobile', () => {
    // Change viewport to mobile size
    cy.viewport(375, 667);
    
    cy.mount(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    // Click the mobile toggle button to open the sidebar
    cy.get('button[type="button"]').first().click();
    
    // Mobile sidebar should be visible
    cy.get('.fixed.inset-0.z-40').should('exist');
    
    // Click the overlay (the semi-transparent background)
    cy.get('.fixed.inset-0.bg-gray-600').click({ force: true });
    
    // Wait for the sidebar to be removed from the DOM
    cy.get('.fixed.inset-0.z-40').should('not.exist');
  });

  it('renders the page title in the mobile header', () => {
    // Change viewport to mobile size
    cy.viewport(375, 667);
    
    cy.mount(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    // Check that the title is visible in the mobile header
    cy.get('.sticky.top-0 h1').contains('Time to Dry').should('be.visible');
    cy.get('.sticky.top-0 h1').should('have.class', 'text-blue-600');
  });

  it('renders children content', () => {
    cy.mount(
      <Layout>
        <div className="test-content">Test Content</div>
      </Layout>
    );
    
    // Verify the children content is rendered
    cy.get('.test-content').contains('Test Content').should('be.visible');
    cy.get('main').contains('Test Content').should('be.visible');
  });
});