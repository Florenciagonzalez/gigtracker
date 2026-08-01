import { useEffect, useState } from "react";




function Home() {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/events")
        .then((res) => res.json())
        .then((data) => setEvents(data))
        .catch(console.error);
    }, []);

    return (
        <>
        <div>
      {events.map((event) => (
        <div key={event.buyUrl}>
          <h2>{event.name}</h2>
          <img src={event.image} alt={event.name} width={300} />
          <p>{event.date}</p>
          <p>{event.venue}</p>
          <p>{event.price}</p>
        </div>
      ))}
    </div>

        </>
    );
}

export default Home;