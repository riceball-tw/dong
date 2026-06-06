describe("404 Page is effective", () => {
	const defaultLocale = Cypress.env("defaultLocale");
	const publicBaseUrl = Cypress.env("publicBaseUrl");

	it("Has link directing away from the 404 page", () => {
		// Home link
		cy.visit("/404", { failOnStatusCode: false });
		cy.dataCy("home-link")
			.should("be.visible")
			.should("have.attr", "href")
			.and("include", `/${defaultLocale}/`);
		cy.dataCy("home-link").click({ force: true });
		cy.location("pathname").should("eq", `${publicBaseUrl}${defaultLocale}/`);

		// Post link
		cy.visit("/404", { failOnStatusCode: false });
		cy.dataCy("post-link")
			.should("be.visible")
			.should("have.attr", "href")
			.and("include", `/${defaultLocale}/post/`);
		cy.dataCy("post-link").click({ force: true });
		cy.location("pathname").should(
			"eq",
			`${publicBaseUrl}${defaultLocale}/post/`,
		);
	});
});
