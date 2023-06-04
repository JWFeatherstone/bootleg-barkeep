import React, { Component } from "react";
import "../DrinkDetails/DrinkDetails.css";
import { fetchDetails } from "../API/apiCalls";
import { DrinkDetailsProps, DrinkDetailsState } from "../../Types/Details";

class DrinkDetails extends Component<DrinkDetailsProps, DrinkDetailsState> {
  constructor(props: DrinkDetailsProps) {
    super(props);
    this.state = {
      drink: {
        strDrink: "",
        strDrinkThumb: "",
        idDrink: "",
        strGlass: "",
        strInstructions: "",
        strIngredients: [],
        strMeasures: [],
        id: "",
      },
      errorMsg: null, 
    };
  }

  componentDidMount() {
    this.getInfo();
  }

  getInfo() {
    const { id } = this.props;
    fetchDetails(id)
      .then((data) => {
        this.setState({
          drink: data,
          errorMsg: null,
        });
      })
      .catch((error) => {
        let errorMsg;
        if (error instanceof Error) {
          errorMsg = "Server error.";
        } else {
          errorMsg = "Unknown error.";
        }
        this.setState({ errorMsg });
      });
  }

  organizeIngredientsAndAmounts(): string[] {
    const { drink } = this.state;
    const ingredients: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredientKey = `strIngredient${i}`;
      const measureKey = `strMeasure${i}`;

      if (drink[ingredientKey] !== null) {
        const ingredient = drink[ingredientKey];
        const measure = drink[measureKey] || "";
        ingredients.push(ingredient + " " + measure);
      }
    }
    return ingredients;
  }

  render() {
    const ingredients: string[] = this.organizeIngredientsAndAmounts();
    const { id } = this.props;
    return (
      <div id={id} className="drink-details">
        <div className="left-side">
          <div id={id} className="drink-card">
            <img
              className="drink-image"
              src={this.state.drink.strDrinkThumb}
              alt={this.state.drink.strDrink}
            />
            <h2 className="drink-name">{this.state.drink.strDrink}</h2>
          </div>
        </div>
        <div className="right-side">
          <section className="prep-wrapper">
            <h3 className="prep-title">Make the {this.state.drink.strDrink}</h3>
            <h4 className="prep-subtitle">GLASS</h4>
            <p className="prep-detail">{this.state.drink.strGlass}</p>
            <h4 className="prep-subtitle">INGREDIENTS</h4>
            {ingredients.map((ingredient, index) => (
              <p className="prep-detail" key={index}>
                {ingredient}
              </p>
            ))}
            <h4 className="prep-subtitle">INSTRUCTIONS</h4>
            <p className="prep-detail">{this.state.drink.strInstructions}</p>
          </section>
        </div>
      </div>
    );
  }
}

export default DrinkDetails;
