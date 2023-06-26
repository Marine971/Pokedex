import React, { useState, useEffect } from 'react';

const Pokedex = () => {
    const [pokemons, setPokemons] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [newPokemon, setNewPokemon] = useState({
        name: '',
        type: [],
        base: {
            HP: '',
            Attack: '',
            Defense: '',
            'Sp. Attack': '',
            'Sp. Defense': '',
            Speed: '',
        },
    });
    const [editedPokemon, setEditedPokemon] = useState({
        id: '',
        name: '',
        type: [],
        base: {
            HP: '',
            Attack: '',
            Defense: '',
            'Sp. Attack': '',
            'Sp. Defense': '',
            Speed: '',
        },
    });

    useEffect(() => {
        fetch('pokedex.json')
            .then((response) => response.json())
            .then((data) => setPokemons(data))
            .catch((error) => console.log(error));
    }, []);

    const handleSelectPokemon = (pokemon) => {
        setSelectedPokemon(pokemon);
        setShowEditForm(false);
        setShowDeleteConfirm(false);
        setEditedPokemon({
            id: pokemon.id,
            name: pokemon.name.english,
            type: pokemon.type,
            base: {
                HP: pokemon.base.HP,
                Attack: pokemon.base.Attack,
                Defense: pokemon.base.Defense,
                'Sp. Attack': pokemon.base['Sp. Attack'],
                'Sp. Defense': pokemon.base['Sp. Defense'],
                Speed: pokemon.base.Speed,
            },
        });
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAddFormToggle = () => {
        setShowAddForm(!showAddForm);
        setNewPokemon({
            name: '',
            type: [],
            base: {
                HP: '',
                Attack: '',
                Defense: '',
                'Sp. Attack': '',
                'Sp. Defense': '',
                Speed: '',
            },
        });
    };

    const handleEditFormToggle = () => {
        console.log("delete")

        setShowEditForm(!showEditForm);
    };

    const handleDeleteConfirmToggle = () => {
        setShowDeleteConfirm(!showDeleteConfirm);
    };

    const handleAddPokemon = () => {
        const updatedPokemons = [...pokemons, newPokemon];
        setPokemons(updatedPokemons);
        handleAddFormToggle();
    };

    const handleEditPokemon = () => {
        console.log("delete")

        const updatedPokemons = pokemons.map((pokemon) => {
            if (pokemon.id === editedPokemon.id) {
                return {
                    ...pokemon,
                    name: {
                        english: editedPokemon.name,
                        french: pokemon.name.french,
                    },
                    type: editedPokemon.type,
                    base: editedPokemon.base,
                };
            }
            return pokemon;
        });
        setPokemons(updatedPokemons);
        handleEditFormToggle();
    };

    const handleDeletePokemon = () => {
        console.log("delete")
        const updatedPokemons = pokemons.filter((pokemon) => pokemon.id !== selectedPokemon.id);
        setPokemons(updatedPokemons);
        handleDeleteConfirmToggle();
        setSelectedPokemon(null);
    };

    const getTypeColor = (pokemonType) => {
        const colorMap = {
            Grass: 'blue',
            Poison: 'purple',
            Fire: 'red',
            Flying: 'gray',
            Water: 'blue',
            Bug: 'green',
            Normal: 'gray',
            Electric: 'yellow',
            Ground: 'brown',
            Fairy: 'pink',
            Fighting: 'brown',
            Psychic: 'pink',
            Rock: 'brown',
            Steel: 'gray',
        };

        return colorMap[pokemonType.split(' ')[0]] || 'gray';
    };

    const renderPokemon = (pokemon) => {
        const { id, name, type, base } = pokemon;

        return (
            <div
                key={id}
                className={`pokemon ${selectedPokemon === pokemon ? 'active' : ''}`}
                onClick={() => handleSelectPokemon(pokemon)}
            >
                <div className="pokemon-name">
                    {name.english} - {name.french}
                </div>
                <div className="pokemon-type">
                    {type.map((pokemonType, index) => (
                        <span
                            key={index}
                            className="type-badge"
                            style={{ backgroundColor: getTypeColor(pokemonType) }}
                        >
                            {pokemonType}
                        </span>
                    ))}
                </div>
                <div className="pokemon-stats">
                    <div>HP: {base.HP}</div>
                    <div>Attack: {base.Attack}</div>
                    <div>Defense: {base.Defense}</div>
                    <div>Sp. Attack: {base['Sp. Attack']}</div>
                    <div>Sp. Defense: {base['Sp. Defense']}</div>
                    <div>Speed: {base.Speed}</div>
                </div>
                <div className="pokemon-actions">
                    <button onClick={() => handleEditFormToggle()}>Modifier</button>
                    <button onClick={() => handleDeleteConfirmToggle()}>Supprimer</button>
                </div>
            </div>
        );
    };

    const filteredPokemons = pokemons.filter((pokemon) => {
        const name = pokemon.name.english ? pokemon.name.english.toLowerCase() : '';
        return name.includes(searchTerm.toLowerCase());
    });


    return (
        <div>
            <h1>Pokédex</h1>
            <input type="text" placeholder="Rechercher un Pokémon" onChange={handleSearch} />
            <div className="pokemon-list">
                {filteredPokemons.map(renderPokemon)}
            </div>
            {showAddForm && (
                <div className="add-form">
                    <h2>Ajouter un Pokémon</h2>
                    <input
                        type="text"
                        placeholder="Nom du Pokémon"
                        value={newPokemon.name}
                        onChange={(e) => setNewPokemon({ ...newPokemon, name: e.target.value })}
                    />
                    <button onClick={handleAddPokemon}>Ajouter</button>
                </div>
            )}
            {showEditForm && (
                <div className="edit-form">
                    <h2>Modifier le Pokémon</h2>
                    <input
                        type="text"
                        placeholder="Nom du Pokémon"
                        value={editedPokemon.name}
                        onChange={(e) => setEditedPokemon({ ...editedPokemon, name: e.target.value })}
                    />
                    <button onClick={handleEditPokemon}>Enregistrer</button>
                </div>
            )}
            {showDeleteConfirm && (
                <div className="delete-confirm">
                    <p>Êtes-vous sûr de vouloir supprimer ce Pokémon ?</p>
                    <button onClick={handleDeletePokemon}>Oui</button>
                    <button onClick={handleDeleteConfirmToggle}>Non</button>
                </div>
            )}
            {selectedPokemon && (
                <div className="selected-pokemon">
                    <div className="pokemon-actions">
                        <button onClick={handleEditFormToggle}>Modifier</button>
                        <button onClick={handleDeleteConfirmToggle}>Supprimer</button>
                    </div>
                </div>
            )}
            <button onClick={handleAddFormToggle}>Ajouter un Pokémon</button>
        </div>
    );

};

export default Pokedex;
