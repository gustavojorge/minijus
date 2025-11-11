describe("Your first test", () => {
  it("should visit the app", () => {
    cy.visit("/");
    cy.get("h1").should("contain", "Hello, World!");
  });
});
