Cypress.Commands.add("login", (role) => {
  cy.fixture("users").then((users) => {
    const user = users[role];
    cy.visit("/login");
    cy.get('input[name="username"]').type(user.username);
    cy.get('input[name="password"]').type(user.password, { log: false });
    cy.get('button[type="submit"]').click();
    cy.url().should("match", /\/(dashboard|profile|my)/i);
  });
});