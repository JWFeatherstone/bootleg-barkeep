describe("Drink Grid Gin", () => {
  beforeEach(() => {
    cy.fixture("gin.json").as("ginCocktails");
    cy.intercept(
      "GET",
      "https://www.thecocktaildb.com/api/json/v1/1/random.php",
      {
        statusCode: 200,
        body: {
          drinks: [
            {
              strDrink: "Loch Lomond",
              strDrinkThumb:
                "https://www.thecocktaildb.com/images/media/drink/rpvtpr1468923881.jpg",
              idDrink: "11658",
            },
          ],
        },
      }
    ).as("randomDrink");
    cy.intercept(
      "GET",
      "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=gin",
      {
        statusCode: 200,
        fixture: "gin.json",
      }
    ).as("ginCocktails");
    cy.intercept(
      "GET",
      "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=13940",
      {
        statusCode: 200,
        body: {
          drinks: [
            {
              "idDrink":"13940",
              "strDrink":"69 Special",
              "strCategory":"Ordinary Drink",
              "strAlcoholic":"Alcoholic",
              "strGlass":"Collins Glass",
              "strInstructions":"Pour 2 oz. gin. Add 4 oz. 7-up. Add Lemon Juice for flavor. If you are weak, top up glass with more 7-Up.",
              "strDrinkThumb":"https:\/\/www.thecocktaildb.com\/images\/media\/drink\/vqyxqx1472669095.jpg",
              "strIngredient1":"Gin",
              "strIngredient2":"7-Up",
              "strIngredient3":"Lemon juice",
              "strMeasure1":"2 oz dry ",
              "strMeasure2":"4 oz ",
              "strMeasure3":"0.75 oz ",
            },
          ],
        },
      }
    ).as("ginCocktail1");
    cy.intercept(
      "GET",
      "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11014",
      {
        statusCode: 200,
        body: {
          drinks: [
            {
              "idDrink":"11014",
              "strDrink":"Alexander",
              "strGlass":"Cocktail glass",
              "strInstructions":"Shake all ingredients with ice and strain contents into a cocktail glass. Sprinkle nutmeg on top and serve.",
              "strDrinkThumb":"https:\/\/www.thecocktaildb.com\/images\/media\/drink\/0clus51606772388.jpg",
              "strIngredient1":"Gin",
              "strIngredient2":"Creme de Cacao",
              "strIngredient3":"Light cream",
              "strIngredient4":"Nutmeg",
              "strMeasure1":"1\/2 oz ",
              "strMeasure2":"1\/2 oz white ",
              "strMeasure3":"2 oz ",
            },
          ],
        },
      }
    ).as("ginCocktail2");
    cy.visit("localhost:3000");
  });

  it('should allow user to click NavLink "Gin" and be routed to drink grid with fixture data', () => {
    cy.get(".ingredient-nav").eq(3).click();
    cy.wait("@ginCocktails");
    cy.get(".drink-title").should("contain", "Gin");
    cy.get(".drink-card")
      .should("have.length", 9)
      .each((drinkCard) => {
        cy.wrap(drinkCard).find(".drink-name").should("exist");
        cy.wrap(drinkCard).find(".drink-image").should("exist");
      });
  });

  it("should allow user to click logo to return to Home Screen", () => {
    cy.get(".home-nav").click();
    cy.wait("@randomDrink")
      .get("h2")
      .should("contain", "LUCKY LIBATIONS")
      .get(".random-img")
      .should(
        "have.attr",
        "src",
        "https://www.thecocktaildb.com/images/media/drink/rpvtpr1468923881.jpg"
      )
      .get(".random-img")
      .should("have.attr", "alt", "Loch Lomond")
      .get(".title")
      .should("contain", "Loch Lomond");
  });

  it("should navigate to detailed view of first drink and last drink on grid in gin category", () => {
    cy.get(".ingredient-nav").eq(3).click();
    cy.wait("@ginCocktails");

    cy.get(".drink-title").should("contain", "Gin");

    cy.get(".drink-card").first().click();
    cy.wait("@ginCocktail1");
    cy.get(".drink-name").should("contain", "69 Special");
    cy.get(".drink-image").should(
      "have.attr",
      "src",
      "https://www.thecocktaildb.com/images/media/drink/vqyxqx1472669095.jpg"
    );
    cy.get(".ingredient-nav").eq(3).click();
    cy.wait("@ginCocktails");

    cy.get(".drink-title").should("contain", "Gin");

    cy.get(".drink-card").last().click();
    cy.wait("@ginCocktail2");
    cy.get(".drink-name").should("contain", "Alexander");
    cy.get(".drink-image").should(
      "have.attr",
      "src",
      "https://www.thecocktaildb.com/images/media/drink/0clus51606772388.jpg"
    );
    cy.get(".home-nav").click();
  });

  it("should navigate back to the previous page when the back button is clicked", () => {
    cy.get(".ingredient-nav").eq(3).click();
    cy.wait("@ginCocktails");

    cy.get(".drink-title").should("contain", "Gin");

    cy.go("back");

    cy.wait("@randomDrink");
    cy.get("h2").should("contain", "LUCKY LIBATIONS");
    cy.get(".random-img").should(
      "have.attr",
      "src",
      "https://www.thecocktaildb.com/images/media/drink/rpvtpr1468923881.jpg"
    );
    cy.get(".random-img").should("have.attr", "alt", "Loch Lomond");
    cy.get(".title").should("contain", "Loch Lomond");
  });
});
