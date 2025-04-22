import React from 'react';
import Sidebar from '@/layout/SideBar';

// Create a mock version of the component that doesn't use the router
const MockedSidebar = (props: { pathname?: string }) => {
  // We're bypassing the useRouter call by directly passing the pathname
  return <Sidebar {...props} />;
};

describe('Sidebar Component', () => {
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
  });

  it('renders with the correct title', () => {
    cy.mount(<MockedSidebar />);
    cy.contains('h2', 'Time to Dry').should('be.visible');
    cy.contains('h2', 'Time to Dry').should('have.class', 'text-blue-600');
  });

  it('displays all navigation items', () => {
    cy.mount(<MockedSidebar />);
    cy.contains('a', 'Home').should('be.visible');
    cy.contains('a', 'Statistics').should('be.visible');
    cy.contains('a', 'Drying Table').should('be.visible');
  });

  it('displays corresponding icons for each navigation item', () => {
    cy.mount(<MockedSidebar />);
    
    // Check that each item has its icon
    cy.contains('a', 'Home').find('span').should('contain', '🏠');
    cy.contains('a', 'Statistics').find('span').should('contain', '📊');
    cy.contains('a', 'Drying Table').find('span').should('contain', '🧺');
  });

  it('highlights the active link based on pathname prop', () => {
    // Test with Home active
    cy.mount(<MockedSidebar pathname="/" />);
    cy.contains('a', 'Home').should('have.class', 'bg-blue-100');
    cy.contains('a', 'Home').should('have.class', 'text-blue-600');
    cy.contains('a', 'Statistics').should('not.have.class', 'bg-blue-100');
    
    // Test with Statistics active
    cy.mount(<MockedSidebar pathname="/statistics" />);
    cy.contains('a', 'Statistics').should('have.class', 'bg-blue-100');
    cy.contains('a', 'Statistics').should('have.class', 'text-blue-600');
    cy.contains('a', 'Home').should('not.have.class', 'bg-blue-100');
    
    // Test with Drying Table active
    cy.mount(<MockedSidebar pathname="/table" />);
    cy.contains('a', 'Drying Table').should('have.class', 'bg-blue-100');
    cy.contains('a', 'Drying Table').should('have.class', 'text-blue-600');
    cy.contains('a', 'Home').should('not.have.class', 'bg-blue-100');
  });

  it('applies hover styles to inactive links', () => {
    cy.mount(<MockedSidebar pathname="/" />);
    
    // Check that inactive links have the hover class
    cy.contains('a', 'Statistics')
      .should('have.class', 'hover:bg-gray-50')
      .should('have.class', 'hover:text-gray-900');
    
    cy.contains('a', 'Drying Table')
      .should('have.class', 'hover:bg-gray-50')
      .should('have.class', 'hover:text-gray-900');
  });

  it('has the correct link destinations', () => {
    cy.mount(<MockedSidebar />);
    
    cy.contains('a', 'Home').should('have.attr', 'href', '/');
    cy.contains('a', 'Statistics').should('have.attr', 'href', '/statistics');
    cy.contains('a', 'Drying Table').should('have.attr', 'href', '/table');
  });
});