import React, { useEffect, useState } from 'react';
import "../styles/CharacterDetails.css";
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function CharacterDetails() {
    const { characterId } = useParams();
    const [character, setCharacter] = useState(null);

    useEffect(() => {
        const fetchCharacterDetails = async () => {
            try {
                const response = await axios.get(`https://the-one-api.dev/v2/character/${characterId}`, {
                    headers: {
                        "Authorization": `${API_BASE_URL}`
                    }
                });

                const characterData = response.data.docs;
                setCharacter(characterData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchCharacterDetails();
    }, [characterId]);

    return (
        <section className='detail-section'>
            <header>
                <p>Character Details</p>
            </header>
            <main className='table-container'>
                <table className='detail-table'>
                    <tbody>
                        {character &&character?.map((user)=> (
                            <div key={user._id}>
                                <tr>
                                    <td>Name</td>
                                    <td>{user.name}</td>
                                </tr>
                                <tr>
                                    <td>WikiURL</td>
                                    <td>{user.wikiUrl}</td>
                                </tr>
                                <tr>
                                    <td>Race</td>
                                    <td>{user.race}</td>
                                </tr>
                                <tr>
                                    <td>Height</td>
                                    <td>{user.height}</td>
                                </tr>
                                <tr>
                                    <td>Hair</td>
                                    <td>{user.hair}</td>
                                </tr>
                                <tr>
                                    <td>Realm</td>
                                    <td>{user.realm}</td>
                                </tr>
                                <tr>
                                    <td>Birth</td>
                                    <td>{user.birth}</td>
                                </tr>
                                <tr>
                                    <td>Gender</td>
                                    <td>{user.gender}</td>
                                </tr>
                                <tr>
                                    <td>Spouse</td>
                                    <td>{user.spouse}</td>
                                </tr>
                                <tr>
                                    <td>Death</td>
                                    <td>{user.death}</td>
                                </tr>
                            </div>
                        ))}
                    </tbody>
                </table>
            </main>
            <span></span>
            <div className="close-btn-div">
               <Link className='close-btn' to="/">Close</Link>
            </div>
        </section>
    );
}

export default CharacterDetails;
