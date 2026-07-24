import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

function Home() {

    const [concerts, setConcerts] = useState([]);
    useEffect(() => {
        async function getConcerts() {
            const { data, error } = await supabase
                .from("concerts")
                .select(`*, bands(name)`);

            if (error) {
                console.error(error);
                return;
            }
            setConcerts(data);
        }

        getConcerts();
    }, []);

    return (
        <>
            {concerts.map(concert => (
                <div key={concert.id}>
                    <h2>{concert.bands.name}</h2>
                    <p>{concert.city}</p>
                    <p>{concert.venue}</p>
                    <p>{concert.date}</p>
                </div>
            ))}
        </>
    );
}

export default Home;