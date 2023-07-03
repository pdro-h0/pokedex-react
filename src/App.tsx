import { useEffect, useState } from "react";

export default function App() {
  const fetchPokemons = async () => {
    const req = await fetch("https://pokeapi.co/api/v2/pokemon/");
    const json = await req.json();
    return json.results;
  };

  interface pokemonType {
    name: string;
    url: string;
  }

  interface pokemonShownType {
    abilities: {
      ability: {
        name: string;
        url: string;
      };
      is_hidden: boolean;
    }[];
    height: number;
    name: string;
    sprites: {
      front_default: string;
    };
    stats: {
      base_stat: number;
      stat: {
        name: string;
      };
    }[];
    types: {
      type: {
        name: string;
      };
    }[];
    weight: number;
  }

  const [pokemons, setPokemons] = useState<pokemonType[]>([]);
  const [pokemonShown, setPokemonShown] = useState<pokemonShownType>();

  useEffect(() => {
    fetchPokemons().then((result) => {
      console.log("Requisição realizada");
      console.log(result);
      setPokemons(result);
    });
  }, []);

  const showDetails = async (url: string) => {
    const data = await fetch(url).then((res) => res.json());
    console.log("Pokémon encontrado!");
    console.log(data);
    setPokemonShown(data);
  };

  return (
    <div className="app">
      <div>
        <div>
          <h2>Api Pokemon</h2>
          <ul className="pokemon">
            {pokemons.length > 0 ? (
              pokemons.map((pokemon) => {
                return (
                  <li key={pokemon.name}>
                    <span>{pokemon.name}</span>
                    <button onClick={() => showDetails(pokemon.url)}>
                      Ver detalhes
                    </button>
                  </li>
                );
              })
            ) : (
              <p>
                <strong>CAREGANDO...</strong>
              </p>
            )}
          </ul>
        </div>
      </div>

      {pokemonShown && (
        <div>
          <h2>{pokemonShown.name.toUpperCase()}</h2>
          <img
            src={pokemonShown.sprites.front_default}
            alt={pokemonShown.name}
          />
          <div className="stat">
            <b>Tipo: </b>
            {pokemonShown.types.map(({ type }) => (
              <span key={type.name}>{type.name}</span>
            ))}
          </div>

          <div className="stat">
            <b>Altura: </b>
            {pokemonShown.height / 10}m
          </div>

          <div className="stat">
            <b>Peso: </b>
            {pokemonShown.weight / 10}Kg
          </div>

          <div className="stat">
            <b>Atributos: </b>
            <ul>
              {pokemonShown.stats.map(({ base_stat, stat }) => (
                <li key={stat.name}>
                  {stat.name}: {base_stat}
                </li>
              ))}
            </ul>
          </div>

          <div className="stat">
            <b>Habilidades:</b>
            <ul>
              {pokemonShown.abilities.map(({ ability, is_hidden }) => (
                <li key={ability.name}>
                  {ability.name}
                  {is_hidden && " (secreta)"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
